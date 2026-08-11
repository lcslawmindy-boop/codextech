// ── PRD (Product Requirements Document) Auto-Generator ───────────────────────
// Generates Section 12 — PRD data from selected research nodes and LLM result.

const PRD_LABEL = "PRODUCT REQUIREMENTS DOCUMENT — CONCEPT STAGE";
const PRD_SUBLABEL = "Requirements are conceptual and subject to validation.";
const PRD_DISCLAIMER = "Not a final engineering specification.";

function nodeCode(title, index) {
  const words = title.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean);
  const code = words.slice(0, 3).map(w => w[0]?.toUpperCase() || "").join("");
  return `${code || "ZAP"}-${String(index + 1).padStart(2, "0")}`;
}

function shortModalityName(title) {
  return title.replace(/\(.*?\)/g, "").replace(/Demonstration Circuit|Circuit Kit|Research Prototype|Research Device|Prototype Plans/gi, "").trim() || title;
}

export function generatePrdData(selectedNodes, result, mode) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const docCode = "ZARP-PRD-" + String(now.getFullYear()).slice(-2) + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0");

  const deviceName = result?.hybrid_concept || "ZARP Multi-System Device";
  const targetPop = deriveTargetPopulation(selectedNodes);
  const mechanism = result?.mechanism?.split(".")[0] || "multi-system electromagnetic integration";
  const outcome = "therapeutic outcomes not currently possible with single-modality solutions";

  // ── 2.1 Product Vision Statement ──
  const visionStatement = `The ${deviceName} is designed to ${mechanism} for ${targetPop} by integrating ${selectedNodes.length} research-validated modalities — enabling ${outcome}.`;

  // ── 2.2 User Personas ──
  const personas = generatePersonas(selectedNodes, targetPop);

  // ── 2.3 Functional Requirements ──
  const functionalReqs = generateFunctionalReqs(selectedNodes);

  // ── 2.4 Non-Functional Requirements ──
  const nonFunctionalReqs = [
    { id: "NFR-001", requirement: "Session start < 30 seconds from power-on", category: "Performance" },
    { id: "NFR-002", requirement: "Battery life: minimum 4 hours continuous operation", category: "Performance" },
    { id: "NFR-003", requirement: "EMF emissions comply with FCC Part 15 Class B", category: "Regulatory" },
    { id: "NFR-004", requirement: "Biocompatible materials on all patient-contact surfaces (ISO 10993)", category: "Safety" },
    { id: "NFR-005", requirement: "Operable by trained staff with < 2hr training", category: "Usability" },
    { id: "NFR-006", requirement: "Software: IEC 62304 Class B classification", category: "Regulatory" },
    { id: "NFR-007", requirement: "Housing: IP54 minimum ingress protection", category: "Environmental" },
    { id: "NFR-008", requirement: "Thermal stability: patient-contact surfaces < 42°C at all times", category: "Safety" },
    { id: "NFR-009", requirement: "Data export: session logs via USB-C and encrypted cloud sync", category: "Usability" },
  ];

  // ── 2.5 Modality Performance Requirements ──
  const modalityPerfReqs = selectedNodes.map((n, i) => {
    const freq = deriveFreqRange(n);
    return {
      modality: shortModalityName(n.title),
      outputParam: deriveOutputParam(n),
      min: deriveMin(n),
      max: deriveMax(n),
      tolerance: "± 5%",
      accuracy: "± 2%",
      safetyLimit: deriveSafetyLimit(n),
    };
  });

  // ── 2.6 User Interface Requirements ──
  const uiRequirements = {
    controlType: "Touchscreen control panel (7-inch minimum) + physical E-stop button + optional clinician tablet app",
    display: [
      "Real-time session status (elapsed time, remaining time, active modalities)",
      "Safety indicators (temperature, EM field strength, battery level)",
      "Output level bars per modality with adjustable limits",
      "Biometric feedback display (HRV, SpO₂, GSR, skin temp)",
    ],
    alerts: [
      "Visual + audible alarm for threshold breach (IEC 60601-1-8)",
      "Auto-pause with amber warning for anomalous physiological response",
      "Red emergency indicator + auto-shutdown for critical safety event",
      "Pre-session checklist confirmation prompt",
    ],
    dataLogging: [
      "Session logs: timestamp, duration, modality settings, biometric data",
      "User profiles: saved protocols, calibration data, session history",
      "Outcome tracking: pre/post subjective + objective measures",
      "Exportable CSV/PDF session reports for clinical records",
    ],
    connectivity: "Bluetooth 5.0 + WiFi 802.11ac for data export and cloud sync; USB-C for direct download and firmware updates",
  };

  // ── 2.7 Regulatory Requirements Summary ──
  const regulatory = {
    fdaClassification: deriveFdaClass(selectedNodes),
    likelyPathway: deriveRegPathway(selectedNodes),
    applicableStandards: [
      { std: "IEC 60601-1", desc: "Medical electrical equipment — general safety" },
      { std: "IEC 60601-1-2", desc: "EMC for medical devices" },
      { std: "IEC 62304", desc: "Medical device software lifecycle" },
      { std: "ISO 14971", desc: "Risk management for medical devices" },
      { std: "ISO 10993", desc: "Biological evaluation of medical devices" },
      { std: "FCC Part 15", desc: "Radio frequency emissions — unintentional radiator" },
      { std: "IEC 60601-1-8", desc: "Alarm systems in medical electrical equipment" },
    ],
  };

  // ── 2.8 Acceptance Criteria ──
  const acceptanceCriteria = generateAcceptanceCriteria(functionalReqs, selectedNodes);

  // ── 2.9 Out of Scope ──
  const outOfScope = [
    "Diagnose medical conditions",
    "Replace physician consultation or clinical judgment",
    "Claim to cure, treat, or prevent any disease",
    "Operate as a Class III medical device (life-sustaining)",
    "Deliver modalities outside documented safety limits",
    "Be used without trained operator supervision",
    "Function as a standalone diagnostic instrument",
  ];

  return {
    docCode,
    label: PRD_LABEL,
    sublabel: PRD_SUBLABEL,
    disclaimer: PRD_DISCLAIMER,
    dateStr,
    deviceName,
    visionStatement,
    personas,
    functionalReqs,
    nonFunctionalReqs,
    modalityPerfReqs,
    uiRequirements,
    regulatory,
    acceptanceCriteria,
    outOfScope,
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function deriveTargetPopulation(nodes) {
  const audiences = nodes.map(n => n.audience).filter(Boolean);
  if (audiences.some(a => a.includes("Defense") || a.includes("military"))) return "defense and military personnel requiring neurorecovery";
  if (audiences.some(a => a.includes("Bio") || a.includes("medic"))) return "clinical patients seeking therapeutic recovery";
  if (audiences.some(a => a.includes("hobbyist") || a.includes("researcher"))) return "research community members for experimental validation";
  return "research and clinical validation subjects";
}

function generatePersonas(nodes, targetPop) {
  return [
    {
      id: "A",
      title: "Primary User",
      profile: derivePrimaryProfile(nodes),
      currentSolution: deriveCurrentSolution(nodes),
      whatTheyNeed: deriveWhatTheyNeed(nodes),
      successDef: "Considers device successful when measurable improvement in target biomarker is observed within 10 sessions without adverse events",
    },
    {
      id: "B",
      title: "Clinical Administrator",
      profile: "Clinician, therapist, or trained caregiver operating the device in a clinical or research setting",
      setupReq: "Setup < 5 minutes; calibration auto-guided via touchscreen wizard; pre-session checklist with confirmation prompts",
      dataReq: "Real-time biometric dashboard; exportable session reports (CSV/PDF); outcome trend analytics across sessions",
      trainingReq: "Operator certification in < 2 hours; safety shutdown protocol training; emergency response procedure",
    },
    {
      id: "C",
      title: "Payer / Decision Maker",
      profile: derivePayerProfile(nodes),
      adoptionJustification: deriveAdoptionJust(nodes),
      evidenceReq: "IRB-approved proof-of-concept study data; peer-reviewed publication of mechanism; safety profile per IEC 60601; cost-effectiveness analysis vs. standard of care",
    },
  ];
}

function derivePrimaryProfile(nodes) {
  const titles = nodes.map(n => n.title.toLowerCase());
  if (titles.some(t => t.includes("biofield") || t.includes("therapy") || t.includes("frequency")))
    return "Adults (25-65) seeking non-pharmaceutical therapeutic intervention for chronic conditions";
  if (titles.some(t => t.includes("scalar") || t.includes("energy")))
    return "Adults (30-70) exploring advanced electromagnetic wellness modalities";
  return "Adults (25-70) participating in research-stage electromagnetic therapy studies";
}

function deriveCurrentSolution(nodes) {
  const titles = nodes.map(n => n.title.toLowerCase());
  if (titles.some(t => t.includes("biofield") || t.includes("therapy")))
    return "Currently uses single-modality devices (TMS, CES, or PEMF alone) which fail because they address only one pathway and cannot integrate multi-system effects";
  if (titles.some(t => t.includes("scalar") || t.includes("energy")))
    return "Currently has no commercial solution — scalar EM technology exists only in research literature with no integrated device available";
  return "Currently relies on conventional single-modality approaches which fail because they do not integrate the multi-system electromagnetic interactions documented in cited research";
}

function deriveWhatTheyNeed(nodes) {
  return "A multi-modality integrated device that delivers all selected therapeutic modalities simultaneously under closed-loop AI control — without the limitations of single-modality approaches";
}

function derivePayerProfile(nodes) {
  const audiences = nodes.map(n => n.audience).filter(Boolean);
  if (audiences.some(a => a.includes("Defense"))) return "VA hospital system, DoD medical procurement, military health program administrators";
  if (audiences.some(a => a.includes("medic") || a.includes("Bio"))) return "Hospital purchasing committees, insurance medical directors, clinical research grant administrators";
  return "Research institution procurement, university lab directors, independent research grant administrators";
}

function deriveAdoptionJust(nodes) {
  return "Multi-modality integration addresses unmet need not covered by existing single-modality devices; published research supports mechanism; potential for patent-protected market differentiation";
}

function generateFunctionalReqs(nodes) {
  const reqs = [
    { id: "FR-001", requirement: `Device shall deliver ${nodes.length} therapeutic modalities simultaneously under unified control`, priority: "MUST HAVE", rationale: "Core multi-system integration", source: "System" },
    { id: "FR-002", requirement: "Session duration programmable 5-60 minutes in 5-minute increments", priority: "MUST HAVE", rationale: "Clinical protocol flexibility", source: "System" },
    { id: "FR-003", requirement: "Real-time biofeedback display (HRV, SpO₂, GSR, skin temp)", priority: "SHOULD HAVE", rationale: "Clinical monitoring and safety", source: "System" },
    { id: "FR-004", requirement: "Auto-pause if anomalous physiological response detected", priority: "MUST HAVE", rationale: "Safety requirement — IEC 60601", source: "System" },
    { id: "FR-005", requirement: "Dual-channel NC E-stop circuit with < 250ms response time", priority: "MUST HAVE", rationale: "Emergency safety cutoff", source: "System" },
    { id: "FR-006", requirement: "Session protocol presets (calming, stimulating, integration, custom)", priority: "SHOULD HAVE", rationale: "Clinical workflow efficiency", source: "System" },
    { id: "FR-007", requirement: "User profile storage with calibration data and session history", priority: "SHOULD HAVE", rationale: "Personalized therapy delivery", source: "System" },
  ];

  // Add modality-specific FRs
  nodes.forEach((n, i) => {
    const code = nodeCode(n.title, i);
    const name = shortModalityName(n.title);
    const freq = deriveFreqRange(n);
    reqs.push({
      id: `FR-${String(reqs.length + 1).padStart(3, "0")}`,
      requirement: `Device shall deliver ${name} at ${freq} to ${deriveTargetTissue(n)}`,
      priority: "MUST HAVE",
      rationale: `Core therapeutic modality from ${code}`,
      source: code,
    });
    reqs.push({
      id: `FR-${String(reqs.length + 1).padStart(3, "0")}`,
      requirement: `${name} output level adjustable 0-100% in 1% increments`,
      priority: "SHOULD HAVE",
      rationale: `Dose control for ${code}`,
      source: code,
    });
  });

  reqs.push(
    { id: `FR-${String(reqs.length + 1).padStart(3, "0")}`, requirement: "Session data logging with timestamp, settings, and biometric capture at 1Hz", priority: "MUST HAVE", rationale: "Clinical record and outcome tracking", source: "System" },
    { id: `FR-${String(reqs.length + 1).padStart(3, "0")}`, requirement: "Cloud sync of session data with HIPAA-compliant encryption", priority: "SHOULD HAVE", rationale: "Data portability and backup", source: "System" },
    { id: `FR-${String(reqs.length + 1).padStart(3, "0")}`, requirement: "Firmware update via USB-C without data loss", priority: "NICE TO HAVE", rationale: "Maintainability", source: "System" },
    { id: `FR-${String(reqs.length + 1).padStart(3, "0")}`, requirement: "Multi-language UI (English, Spanish minimum)", priority: "NICE TO HAVE", rationale: "Accessibility", source: "System" },
  );

  return reqs;
}

function deriveFreqRange(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("7.83") || title.includes("schumann")) return "7.83 Hz (Schumann)";
  if (title.includes("scalar") || title.includes("phi")) return "20 Hz – 20 kHz (DDS)";
  if (title.includes("uv") || title.includes("photon")) return "280-400 nm (UV)";
  if (title.includes("magnetic") || title.includes("generator")) return "50-500 Hz (rotational)";
  return "frequency range per source research";
}

function deriveOutputParam(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("coil") || title.includes("magnetic")) return "Magnetic flux density";
  if (title.includes("uv") || title.includes("photon")) return "Irradiance";
  if (title.includes("scalar") || title.includes("phi")) return "Scalar field potential";
  if (title.includes("circuit") || title.includes("oscillator")) return "Voltage amplitude";
  return "Output amplitude";
}

function deriveMin(node) { return "0 (off)"; }
function deriveMax(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("coil") || title.includes("magnetic")) return "200 μT";
  if (title.includes("uv")) return "10 mW/cm²";
  if (title.includes("scalar")) return "100% DDS output";
  return "100% rated output";
}

function deriveSafetyLimit(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("coil") || title.includes("magnetic")) return "IEEE C95.1-2019 SAR limit";
  if (title.includes("uv")) return "ICNIRP 2020 optical exposure limit";
  if (title.includes("scalar")) return "ICNIRP 2020 EM field limit";
  return "IEEE C95.1 + ICNIRP 2020 combined";
}

function deriveTargetTissue(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("biofield") || title.includes("cell")) return "cellular tissue";
  if (title.includes("brain") || title.includes("neuro")) return "neural tissue";
  return "target tissue per source research";
}

function deriveFdaClass(nodes) {
  const titles = nodes.map(n => n.title.toLowerCase());
  if (titles.some(t => t.includes("biofield") || t.includes("therapy") || t.includes("frequency")))
    return "Class II (combination therapy device — De Novo pathway likely)";
  if (titles.some(t => t.includes("scalar") || t.includes("energy")))
    return "Class II (novel modality — De Novo pathway likely) or Wellness if non-medical claims";
  return "Class II (combination device — pathway pending regulatory counsel review)";
}

function deriveRegPathway(nodes) {
  const titles = nodes.map(n => n.title.toLowerCase());
  if (titles.some(t => t.includes("biofield") || t.includes("therapy")))
    return "FDA De Novo (novel combination therapy device)";
  if (titles.some(t => t.includes("scalar")))
    return "FDA De Novo (novel modality) or Wellness Device (if non-medical claims only)";
  return "FDA De Novo or 510(k) — pending regulatory counsel determination";
}

function generateAcceptanceCriteria(frs, nodes) {
  const acs = [];
  let acNum = 1;
  frs.forEach(fr => {
    if (fr.priority === "MUST HAVE" && fr.source !== "System" && fr.source !== "System") {
      acs.push({
        id: `AC-${String(acNum).padStart(3, "0")}`,
        frRef: fr.id,
        criteria: `${fr.id} satisfied when ${fr.requirement.toLowerCase()} verified by calibrated equipment in 10 of 10 test units`,
      });
      acNum++;
    }
  });
  // Add system-level ACs
  acs.push({ id: `AC-${String(acNum).padStart(3, "0")}`, frRef: "FR-004", criteria: "FR-004 satisfied when auto-pause triggers within 500ms of anomalous biometric threshold breach in 100% of test sessions" });
  acs.push({ id: `AC-${String(acNum + 1).padStart(3, "0")}`, frRef: "FR-005", criteria: "FR-005 satisfied when E-stop cuts all modality output within 250ms in 10 of 10 activation tests" });
  return acs;
}

export { PRD_LABEL, PRD_SUBLABEL, PRD_DISCLAIMER };