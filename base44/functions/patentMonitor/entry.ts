import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const SUPPRESSION_PATTERNS = [
  "patent bought and shelved",
  "acquired and discontinued",
  "cease and desist energy device",
  "injunction free energy",
  "trade secret misappropriation vacuum",
  "national security patent suppression",
  "secrecy order USPTO",
  "DOE classification energy invention",
  "corporate acquisition scalar",
  "ITC exclusion order energy device",
  "prior art challenge vacuum energy",
  "IPR inter partes review free energy",
  "obviousness rejection scalar electromagnetics",
];

const CATEGORY_KEYWORDS = {
  "Vacuum Energy": ["vacuum energy patent", "zero point energy USPTO", "ZPE device patent", "vacuum fluctuation energy extraction", "quantum vacuum patent filing"],
  "Scalar EM": ["scalar electromagnetics patent", "scalar wave device", "longitudinal EM wave patent", "non-Hertzian wave patent", "Bearden scalar patent"],
  "Bioelectromagnetics": ["bioelectromagnetic therapy patent", "EM cancer treatment patent", "pulsed electromagnetic field FDA", "PEMF device patent challenge", "EM biological treatment"],
  "Free Energy": ["over unity patent rejection", "COP greater than 1 patent", "self-sustaining generator patent", "free energy device USPTO", "perpetual motion patent"],
  "Resonance Devices": ["resonance energy device patent", "Tesla coil patent filing", "resonant cavity energy patent", "standing wave energy harvesting"],
  "Phase Conjugation": ["phase conjugate mirror patent", "time reversal wave patent", "phase conjugation energy"],
  "Tesla Technology": ["Tesla magnifying transmitter patent", "Wardenclyffe type device patent", "longitudinal wave transmission patent"],
  "Atmospheric EM": ["atmospheric energy harvesting patent", "ionosphere energy extraction patent", "atmospheric electricity device"],
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Allow both scheduled (no user) and manual (with user) invocations
  let callerIsAdmin = false;
  try {
    const user = await base44.auth.me();
    if (user?.role === 'admin') callerIsAdmin = true;
  } catch {
    // scheduled call — no user context, treat as trusted
    callerIsAdmin = true;
  }

  if (!callerIsAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const scanRunId = `scan_${Date.now()}`;
  const isManual = body.manual === true;

  console.log(`[patentMonitor] Starting scan run ${scanRunId} (manual=${isManual})`);

  // Load all active monitoring configs
  const configs = await base44.asServiceRole.entities.MonitoringConfig.filter({ is_active: true });
  if (configs.length === 0) {
    console.log("[patentMonitor] No active monitoring configs found.");
    return Response.json({ status: "ok", alerts: 0, message: "No active monitoring configs." });
  }

  // Aggregate all watched categories + custom keywords across all configs
  const allCategories = [...new Set(configs.flatMap(c => c.watch_categories || []))];
  const allCustomKeywords = [...new Set(configs.flatMap(c => c.custom_keywords || []))];

  if (allCategories.length === 0) {
    allCategories.push(...Object.keys(CATEGORY_KEYWORDS));
  }

  console.log(`[patentMonitor] Watching ${allCategories.length} categories, ${allCustomKeywords.length} custom keywords`);

  const allAlerts = [];

  // Run one LLM+web scan per category batch (max 4 categories per call to stay under token limits)
  const batches = [];
  for (let i = 0; i < allCategories.length; i += 3) {
    batches.push(allCategories.slice(i, i + 3));
  }

  for (const batch of batches) {
    const keywordsForBatch = batch.flatMap(cat => CATEGORY_KEYWORDS[cat] || [cat]);
    const suppressionContext = SUPPRESSION_PATTERNS.slice(0, 6).join("; ");

    const prompt = `You are an IP threat intelligence analyst monitoring for patent threats, suppression activity, and legal challenges against breakthrough energy technology inventions.

CATEGORIES TO MONITOR: ${batch.join(", ")}

KEY SEARCH TERMS: ${[...keywordsForBatch, ...allCustomKeywords.slice(0, 5)].join(", ")}

SUPPRESSION PATTERNS TO DETECT: ${suppressionContext}

Search the web RIGHT NOW for:
1. Any new patent filings (last 90 days) in these technology categories
2. Any legal challenges, IPR petitions, or cease-and-desist actions against energy device inventors
3. Any corporate acquisitions or buyouts of companies in these spaces
4. Any news articles about suppression, government classification, or NDA-related shutdowns of energy tech
5. Any USPTO secrecy orders or DOE classification of energy patents

For each finding, assess whether it matches historical suppression patterns (investor pressure, regulatory capture, IP acquisition to shelve, etc.).

Return findings as structured threat intelligence. If nothing significant found in a category, return an empty array for that category. Today's date: ${new Date().toISOString().split('T')[0]}.`;

    let result = null;
    try {
      result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        model: "gemini_3_flash",
        response_json_schema: {
          type: "object",
          properties: {
            findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  source_type: { type: "string" },
                  source_url: { type: "string" },
                  source_name: { type: "string" },
                  category: { type: "string" },
                  matched_keywords: { type: "array", items: { type: "string" } },
                  suppression_pattern: { type: "string" },
                  risk_level: { type: "string" },
                  risk_score: { type: "number" },
                  summary: { type: "string" },
                  recommended_action: { type: "string" },
                  published_date: { type: "string" },
                },
              },
            },
          },
        },
      });
    } catch (err) {
      console.error(`[patentMonitor] LLM call failed for batch ${batch.join(",")}:`, err.message);
      continue;
    }

    const findings = (result?.findings || []).filter(f => f.title && f.risk_level);
    console.log(`[patentMonitor] Batch [${batch.join(",")}] → ${findings.length} findings`);

    for (const finding of findings) {
      // Normalize risk_level
      const rl = (finding.risk_level || "").toLowerCase();
      const normalizedRisk = ["critical","high","medium","low"].includes(rl) ? rl : "medium";

      const alert = await base44.asServiceRole.entities.MonitoringAlert.create({
        title: finding.title,
        source_type: finding.source_type || "News",
        source_url: finding.source_url || "",
        source_name: finding.source_name || "Web scan",
        category: finding.category || batch[0],
        matched_keywords: finding.matched_keywords || [],
        suppression_pattern: finding.suppression_pattern || "",
        risk_level: normalizedRisk,
        risk_score: Math.round(finding.risk_score || 50),
        summary: finding.summary || "",
        recommended_action: finding.recommended_action || "",
        status: "new",
        scan_run_id: scanRunId,
        published_date: finding.published_date || new Date().toISOString().split('T')[0],
      });
      allAlerts.push(alert);
    }
  }

  // Send email notifications for high/critical alerts
  const highAlerts = allAlerts.filter(a => a.risk_level === "critical" || a.risk_level === "high");
  if (highAlerts.length > 0) {
    for (const config of configs) {
      if (!config.email_alerts) continue;
      const minRisk = config.min_risk_for_email || "high";
      const alertsToSend = highAlerts.filter(a => {
        if (minRisk === "critical") return a.risk_level === "critical";
        if (minRisk === "high") return ["critical","high"].includes(a.risk_level);
        return true;
      });
      if (alertsToSend.length === 0) continue;

      const emailBody = `PATENT THREAT INTELLIGENCE ALERT
Scan ID: ${scanRunId}
Date: ${new Date().toUTCString()}

${alertsToSend.length} HIGH/CRITICAL threat(s) detected:

${alertsToSend.map((a, i) => `[${i+1}] ${a.risk_level.toUpperCase()}: ${a.title}
   Category: ${a.category}
   Pattern: ${a.suppression_pattern || "General threat"}
   Summary: ${a.summary}
   Action: ${a.recommended_action}
   Source: ${a.source_url || a.source_name}
`).join("\n")}

Log in to your dashboard to review and take action.
This alert was generated by your automated patent monitoring service.`;

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: config.user_email,
        subject: `⚠️ ${alertsToSend.length} Patent Threat Alert(s) — ${alertsToSend[0].category}`,
        body: emailBody,
      });
      console.log(`[patentMonitor] Sent email to ${config.user_email} with ${alertsToSend.length} alerts`);
    }
  }

  // Update last_scan timestamp on all configs
  for (const config of configs) {
    await base44.asServiceRole.entities.MonitoringConfig.update(config.id, { last_scan: new Date().toISOString() });
  }

  console.log(`[patentMonitor] Scan complete. Total alerts created: ${allAlerts.length}`);
  return Response.json({
    status: "ok",
    scan_run_id: scanRunId,
    alerts_created: allAlerts.length,
    high_critical: highAlerts.length,
    categories_scanned: allCategories.length,
  });
});