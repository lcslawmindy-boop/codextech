import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { module, context = {} } = body;

    // Load data for analysis
    const [inventions, priorArt, alerts, opportunities] = await Promise.all([
      base44.asServiceRole.entities.HybridInvention.list("-created_date", 20).catch(() => []),
      base44.asServiceRole.entities.PriorArtEntry.list("-created_date", 30).catch(() => []),
      base44.asServiceRole.entities.MonitoringAlert.filter({ status: "new" }).catch(() => []),
      base44.asServiceRole.entities.OpportunityCard.list("-created_date", 15).catch(() => []),
    ]);

    const inventionSummary = inventions.slice(0, 8).map(i =>
      `• ${i.hybrid_concept} (score: ${i.synergy_score}, val: ${i.ip_valuation})`
    ).join("\n");

    const priorArtSummary = priorArt.slice(0, 10).map(p =>
      `• ${p.title} (${p.year}) — ${p.category} — ${p.outcome}`
    ).join("\n");

    const alertSummary = alerts.slice(0, 5).map(a =>
      `• [${a.risk_level}] ${a.title} — ${a.category}`
    ).join("\n");

    const opportunitySummary = opportunities.slice(0, 6).map(o =>
      `• ${o.alias}: ${o.headline} (${o.stage})`
    ).join("\n");

    let prompt = "";
    let schema = null;

    if (module === "insight_engine") {
      prompt = `You are an IP intelligence analyst for Aethon Apex IP. Analyze this portfolio data and provide concise, actionable intelligence.

INVENTIONS (${inventions.length} total):
${inventionSummary}

PRIOR ART ENTRIES (${priorArt.length} total):
${priorArtSummary}

ACTIVE ALERTS (${alerts.length}):
${alertSummary}

Generate a JSON intelligence report with:
- executive_summary: 2 sentence portfolio overview
- key_insights: array of 4 specific, data-driven insights (strings)
- what_changed: array of 3 recent notable changes or trends
- claim_optimizations: array of 3 specific claim improvement suggestions
- prior_art_risks: array of top 3 prior art conflicts with risk level (high/medium/low)
- patent_activity: 2 sentence summary of patent activity signals`;

      schema = {
        type: "object",
        properties: {
          executive_summary: { type: "string" },
          key_insights: { type: "array", items: { type: "string" } },
          what_changed: { type: "array", items: { type: "string" } },
          claim_optimizations: { type: "array", items: { type: "string" } },
          prior_art_risks: { type: "array", items: { type: "object", properties: { title: { type: "string" }, risk: { type: "string" }, action: { type: "string" } } } },
          patent_activity: { type: "string" },
        }
      };
    }

    else if (module === "threat_monitor") {
      prompt = `You are a patent threat detection system. Analyze the prior art and alerts for IP threats.

PRIOR ART (${priorArt.length} entries):
${priorArtSummary}

ACTIVE ALERTS (${alerts.length}):
${alertSummary}

INVENTIONS TO PROTECT (${inventions.length}):
${inventionSummary}

Identify threats and generate repair patches as JSON:
- threats: array of detected threats with { title, severity (critical/high/medium/low), type (prior_art_collision/conflicting_claim/competitor_activity/patent_challenge), description, affected_invention }
- repair_patches: array of { issue, patch_action, priority }
- overall_risk: critical/high/medium/low
- threat_count: number`;

      schema = {
        type: "object",
        properties: {
          threats: { type: "array", items: { type: "object", properties: { title: { type: "string" }, severity: { type: "string" }, type: { type: "string" }, description: { type: "string" }, affected_invention: { type: "string" } } } },
          repair_patches: { type: "array", items: { type: "object", properties: { issue: { type: "string" }, patch_action: { type: "string" }, priority: { type: "string" } } } },
          overall_risk: { type: "string" },
          threat_count: { type: "number" },
        }
      };
    }

    else if (module === "opportunity_engine") {
      prompt = `You are an IP opportunity strategist for Aethon Apex IP. Generate expansion opportunities.

CURRENT PORTFOLIO:
${inventionSummary}

MARKET OPPORTUNITIES (${opportunities.length}):
${opportunitySummary}

Generate strategic IP opportunities as JSON:
- new_concepts: array of 3 new invention concepts with { concept, mechanism, estimated_value, domain }
- claim_expansions: array of 3 ways to expand existing claims
- commercialization_paths: array of 3 commercialization pathways with { path, timeline, revenue_model }
- licensing_targets: array of 3 potential licensing targets with { target, rationale, deal_type }
- competitor_gaps: array of 3 market gaps competitors have missed`;

      schema = {
        type: "object",
        properties: {
          new_concepts: { type: "array", items: { type: "object", properties: { concept: { type: "string" }, mechanism: { type: "string" }, estimated_value: { type: "string" }, domain: { type: "string" } } } },
          claim_expansions: { type: "array", items: { type: "string" } },
          commercialization_paths: { type: "array", items: { type: "object", properties: { path: { type: "string" }, timeline: { type: "string" }, revenue_model: { type: "string" } } } },
          licensing_targets: { type: "array", items: { type: "object", properties: { target: { type: "string" }, rationale: { type: "string" }, deal_type: { type: "string" } } } },
          competitor_gaps: { type: "array", items: { type: "string" } },
        }
      };
    }

    else if (module === "cluster_detection") {
      prompt = `Analyze this IP portfolio and detect technology clusters.

INVENTIONS:
${inventionSummary}

PRIOR ART:
${priorArtSummary}

Detect and group clusters as JSON:
- physics_clusters: array of { name, description, members (string list), cohesion_score }
- market_clusters: array of { name, description, members (string list), market_size_est }
- claim_clusters: array of { name, description, common_claim_structure }
- prior_art_clusters: array of { category, risk_level, entry_count, dominant_theme }`;

      schema = {
        type: "object",
        properties: {
          physics_clusters: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, members: { type: "array", items: { type: "string" } }, cohesion_score: { type: "number" } } } },
          market_clusters: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, members: { type: "array", items: { type: "string" } }, market_size_est: { type: "string" } } } },
          claim_clusters: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, common_claim_structure: { type: "string" } } } },
          prior_art_clusters: { type: "array", items: { type: "object", properties: { category: { type: "string" }, risk_level: { type: "string" }, entry_count: { type: "number" }, dominant_theme: { type: "string" } } } },
        }
      };
    }

    else if (module === "entity_linking") {
      prompt = `Map entity relationships in this IP portfolio.

INVENTIONS:
${inventionSummary}

PRIOR ART:
${priorArtSummary}

Generate entity link map as JSON:
- invention_to_claims: array of { invention, primary_claims (string list), claim_strength }
- claim_to_prior_art: array of { claim_topic, conflicting_prior_art (string list), conflict_severity }
- prior_art_to_families: array of { prior_art_title, patent_family, family_size_est }
- competitor_clusters: array of { competitor_domain, related_patents (string list), threat_level }
- user_workspaces: [{ workspace: "Primary Research", tools: string list, focus_area: string }]`;

      schema = {
        type: "object",
        properties: {
          invention_to_claims: { type: "array", items: { type: "object", properties: { invention: { type: "string" }, primary_claims: { type: "array", items: { type: "string" } }, claim_strength: { type: "string" } } } },
          claim_to_prior_art: { type: "array", items: { type: "object", properties: { claim_topic: { type: "string" }, conflicting_prior_art: { type: "array", items: { type: "string" } }, conflict_severity: { type: "string" } } } },
          prior_art_to_families: { type: "array", items: { type: "object", properties: { prior_art_title: { type: "string" }, patent_family: { type: "string" }, family_size_est: { type: "number" } } } },
          competitor_clusters: { type: "array", items: { type: "object", properties: { competitor_domain: { type: "string" }, related_patents: { type: "array", items: { type: "string" } }, threat_level: { type: "string" } } } },
          user_workspaces: { type: "array", items: { type: "object", properties: { workspace: { type: "string" }, tools: { type: "array", items: { type: "string" } }, focus_area: { type: "string" } } } },
        }
      };
    }

    else {
      return Response.json({ error: "Unknown module" }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: { type: "object", ...schema },
    });

    return Response.json({ success: true, module, data: result });

  } catch (error) {
    console.error("Intelligence engine error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});