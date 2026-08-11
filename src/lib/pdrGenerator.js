// ── PDR (Preliminary Design Review) Auto-Generator ──────────────────────────
// Generates Section 11 — PDR data from selected research nodes and LLM result.
// All ZARP plans start at TRL 1-2 (concept stage).

const PDR_LABEL = "PRELIMINARY DESIGN REVIEW — CONCEPT STAGE";
const PDR_SUBLABEL = "Subject to manufacturer validation and engineering review.";
const PDR_DISCLAIMER = "Not a final design. Not a certified device.";

const TRL_JUSTIFICATION =
  "Basic principles observed and documented in cited research. Technology concept formulated. Experimental proof of concept not yet demonstrated by this specific multi-system integration.";

// Generate a short node code from a title (e.g., "Anenergy Pump" → "ANP")
function nodeCode(title, index) {
  const words = title.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean);
  const code = words.slice(0, 3).map(w => w[0]?.toUpperCase() || "").join("");
  return `${code || "ZAP"}-${String(index + 1).padStart(2, "0")}`;
}

// Derive modality name from invention title (short form)
function shortModalityName(title) {
  return title.replace(/\(.*?\)/g, "").replace(/Demonstration Circuit|Circuit Kit|Research Prototype|Research Device|Prototype Plans/gi, "").trim() || title;
}

// Auto-generate PDR data from selected nodes and LLM result
export function generatePdrData(selectedNodes, result, mode) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const docCode = "ZARP-PDR-" + String(now.getFullYear()).slice(-2) + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0");

  // Source nodes with generated codes
  const sourceNodes = selectedNodes.map((n, i) => ({
    code: nodeCode(n.title, i),
    title: n.title,
    tagline: n.tagline || "",
    source: n.source || "ZARP Research Database",
    icon: n.icon || "⚡",
  }));

  // ── 1.1 System Overview ──
  const systemOverview = {
    deviceName: result?.hybrid_concept || "ZARP Multi-System Device",
    deviceCode: "ZARP-MSD-" + String(now.getFullYear()).slice(-2) + "-001",
    version: "Rev A — Draft",
    date: dateStr,
    missionStatement: selectedNodes.map(n => n.tagline).join(" "),
    targetPopulation: deriveTargetPopulation(selectedNodes),
    primaryInnovationGoal: result?.mechanism?.split(".")[0] || "Multi-system integration of selected research technologies into a unified therapeutic device platform.",
    trl: "TRL 1-2",
    trlJustification: TRL_JUSTIFICATION,
  };

  // ── 1.2 Design Basis & Requirements Summary ──
  const modalityCount = selectedNodes.length;
  const designBasis = {
    sourceNodes,
    keyDesignDrivers: [
      { label: "Therapeutic target", value: deriveTherapeuticTarget(selectedNodes) },
      { label: "Modality count and type", value: `${modalityCount} modalities — ${selectedNodes.map(n => shortModalityName(n.title)).join(", ")}` },
      { label: "Delivery format", value: deriveDeliveryFormat(selectedNodes) },
      { label: "Operating environment", value: "Clinical / Research laboratory" },
      { label: "User interface requirements", value: "Touchscreen control panel + biometric feedback display + session protocol management" },
    ],
    designConstraints: [
      "Regulatory pathway: FDA De Novo or 510(k) — combination device classification pending",
      "Safety margins: SAR limits per IEEE C95.1-2019 and ICNIRP 2020 guidelines",
      "Material biocompatibility: ISO 10993 series evaluation required for all patient-contact surfaces",
      "EMC compliance: FCC Part 15 Subpart B (unintentional radiator) + IEC 61000-4 series immunity",
    ],
    openDesignQuestions: [
      "Multi-modality integration requires shielding analysis — coupling between modalities may require RF shielding",
      "Power supply architecture not yet determined — centralized vs distributed PSU topology",
      "Software safety classification requires IEC 62304 review — likely Class B (non-life-sustaining)",
      "Thermal management strategy for simultaneous modality operation not yet defined",
    ],
  };

  // ── 1.3 Multi-System Architecture Block Diagram ──
  const architectureBlocks = [
    { label: "User Interface Layer", source: "System", desc: "Touchscreen, session controls, biometric display" },
    { label: "Control System Core", source: "System", desc: "ARM Cortex-A72 + STM32H7 dual-processor architecture" },
    ...selectedNodes.map((n, i) => ({
      label: `${shortModalityName(n.title)} Driver`,
      source: nodeCode(n.title, i),
      desc: n.beardenSolution || n.tagline || "Modality driver subsystem",
    })),
    { label: "Delivery Subsystems", source: "System", desc: "Coil arrays, emitter panels, electrode matrix" },
    { label: "Patient / User", source: "Target", desc: "Therapeutic delivery endpoint" },
  ];
  const feedbackLoop = "[Biofeedback Sensor] → [AI Adjustment Engine] → [Control System Core] → [Modality Driver Array]";

  // ── 1.4 Modality Matrix ──
  const modalityMatrix = selectedNodes.map((n, i) => ({
    num: i + 1,
    name: shortModalityName(n.title),
    sourceNode: nodeCode(n.title, i),
    mechanism: n.beardenSolution || n.tagline || "See source research",
    frequencyRange: deriveFrequencyRange(n),
    deliveryMethod: deriveDeliveryMethod(n),
    targetTissue: deriveTargetTissue(n),
    safetyRef: deriveSafetyRef(n),
    priorityRank: i + 1,
  }));

  // ── 1.5 Interface Control Document (ICD) ──
  const icd = [
    { id: "INT-001", from: "Control Core", to: "Modality Driver 1", signal: "Digital PWM", protocol: "I2C", notes: "Frequency + amplitude command" },
    { id: "INT-002", from: "Control Core", to: "Modality Driver 2", signal: "Digital PWM", protocol: "I2C", notes: "Frequency + amplitude command" },
    { id: "INT-003", from: "Biofeedback Sensor", to: "Control Core", signal: "Analog + Digital", protocol: "SPI", notes: "HRV, SpO2, GSR, skin temp telemetry" },
    { id: "INT-004", from: "Control Core", to: "User Interface", signal: "Serial Data", protocol: "UART", notes: "Session status, biometric display data" },
    { id: "INT-005", from: "E-Stop Circuit", to: "All Drivers", signal: "Hardwired NC", protocol: "Direct", notes: "Dual-channel IEC 60947-5-5 cutoff" },
  ];

  // ── 1.6 PDR Risk Register ──
  const riskRegister = generateRiskRegister(selectedNodes);

  // ── 1.7 PDR Action Items ──
  const actionItems = [
    { id: "PDR-AI-001", text: "Engage manufacturer for feasibility review of multi-system integration" },
    { id: "PDR-AI-002", text: "Commission EMC pre-compliance study for simultaneous modality operation" },
    { id: "PDR-AI-003", text: "Prepare IP claim filing with patent counsel — multi-system integration claims" },
    { id: "PDR-AI-004", text: "Identify IRB research partner for proof-of-concept study" },
    { id: "PDR-AI-005", text: "Conduct shielding analysis for cross-modality EM interference" },
    { id: "PDR-AI-006", text: "Define software safety classification per IEC 62304" },
  ];

  // ── 1.8 PDR Sign-Off Block ──
  const signOff = {
    preparedBy: "Inventor / Aethon Apex IP Holdings LLC",
    date: dateStr,
    reviewStatus: "DRAFT — Pending Manufacturer Engagement",
    nextMilestone: "Critical Design Review (CDR) — triggered after manufacturer feasibility confirmation",
  };

  return {
    docCode,
    label: PDR_LABEL,
    sublabel: PDR_SUBLABEL,
    disclaimer: PDR_DISCLAIMER,
    systemOverview,
    designBasis,
    architectureBlocks,
    feedbackLoop,
    modalityMatrix,
    icd,
    riskRegister,
    actionItems,
    signOff,
  };
}

// ── Helper functions ──────────────────────────────────────────────────────

function deriveTargetPopulation(nodes) {
  const audiences = nodes.map(n => n.audience).filter(Boolean);
  if (audiences.some(a => a.includes("Defense") || a.includes("military"))) return "Defense / Military personnel — PTSD, TBI recovery";
  if (audiences.some(a => a.includes("Bio") || a.includes("medic"))) return "Clinical patients — therapeutic recovery";
  if (audiences.some(a => a.includes("hobbyist") || a.includes("researcher"))) return "Research community — experimental validation";
  return "Research and clinical validation population — specific demographic pending IRB approval";
}

function deriveTherapeuticTarget(nodes) {
  const titles = nodes.map(n => n.title.toLowerCase());
  if (titles.some(t => t.includes("biofield") || t.includes("frequency") || t.includes("therapy"))) return "Bioelectromagnetic regulation — cellular and systemic";
  if (titles.some(t => t.includes("scalar") || t.includes("energy"))) return "Scalar field coherence — neuroregulation and energy balance";
  return "Multi-system electromagnetic therapeutic target — pending clinical definition";
}

function deriveDeliveryFormat(nodes) {
  const titles = nodes.map(n => n.title.toLowerCase());
  if (titles.some(t => t.includes("chamber") || t.includes("pod"))) return "Pod / Chamber — enclosed multi-modality";
  if (titles.some(t => t.includes("circuit") || t.includes("kit"))) return "Benchtop / Tabletop — research apparatus";
  if (titles.some(t => t.includes("generator"))) return "Stationary — floor-standing unit";
  return "Modular platform — delivery format pending detailed design";
}

function deriveFrequencyRange(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("7.83") || title.includes("schumann")) return "7.83 Hz (Schumann)";
  if (title.includes("scalar") || title.includes("phi")) return "20 Hz – 20 kHz (DDS)";
  if (title.includes("uv") || title.includes("photon")) return "UV-B/C (280-400 nm)";
  if (title.includes("magnetic") || title.includes("generator")) return "50-500 Hz (rotational)";
  return "Frequency range pending — see source research";
}

function deriveDeliveryMethod(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("coil") || title.includes("magnetic")) return "Coil array — electromagnetic induction";
  if (title.includes("chamber") || title.includes("quartz")) return "Optical path — quartz windowed chamber";
  if (title.includes("circuit") || title.includes("oscillator")) return "Electrode contact — direct coupling";
  if (title.includes("interferometer") || title.includes("bottle")) return "Field interference zone — spatial";
  return "Delivery method pending — conceptual";
}

function deriveTargetTissue(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("biofield") || title.includes("cell")) return "Cellular — cytoplasmic and membrane";
  if (title.includes("brain") || title.includes("neuro")) return "Neural — cortical and subcortical";
  if (title.includes("energy") || title.includes("body")) return "Systemic — whole-body field";
  return "Target tissue pending — multi-system application";
}

function deriveSafetyRef(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("magnetic") || title.includes("coil")) return "IEEE C95.1-2019 (SAR limits)";
  if (title.includes("uv") || title.includes("photon")) return "ICNIRP 2020 (optical radiation)";
  if (title.includes("scalar") || title.includes("field")) return "ICNIRP 2020 (EM field exposure)";
  return "IEEE C95.1 + ICNIRP 2020 (general EM safety)";
}

function generateRiskRegister(nodes) {
  const risks = [
    {
      id: "PDR-R001",
      description: "Multi-modality EM interference: coupling between modalities may require shielding",
      likelihood: "Medium",
      impact: "High",
      mitigation: "RF shielding analysis during detailed design phase",
    },
    {
      id: "PDR-R002",
      description: "Regulatory pathway uncertainty: combination device may require De Novo review",
      likelihood: "Medium",
      impact: "High",
      mitigation: "Engage FDA regulatory counsel at Phase 1",
    },
    {
      id: "PDR-R003",
      description: "TRL gap: selected technologies at TRL 1-2 — no integrated proof of concept yet",
      likelihood: "High",
      impact: "Medium",
      mitigation: "Sequence modality validation before full integration testing",
    },
    {
      id: "PDR-R004",
      description: "Software safety classification undetermined — IEC 62304 path unclear",
      likelihood: "Medium",
      impact: "Medium",
      mitigation: "IEC 62304 analysis during CDR preparation",
    },
    {
      id: "PDR-R005",
      description: "Thermal management: simultaneous modality operation may exceed patient-contact surface limits",
      likelihood: "Medium",
      impact: "Medium",
      mitigation: "Thermal modeling and sensor interlocks in detailed design",
    },
  ];

  // Add modality-specific risks based on selection
  const titles = nodes.map(n => n.title.toLowerCase());
  if (titles.some(t => t.includes("scalar") || t.includes("energy"))) {
    risks.push({
      id: "PDR-R006",
      description: "Scalar field measurement: no standardized dosimetry protocol exists for scalar modalities",
      likelihood: "High",
      impact: "Medium",
      mitigation: "Develop custom dosimetry protocol and engage academic measurement partner",
    });
  }
  if (titles.some(t => t.includes("biofield") || t.includes("frequency"))) {
    risks.push({
      id: "PDR-R007",
      description: "Biofield mechanism: therapeutic mechanism not yet clinically validated for this integration",
      likelihood: "High",
      impact: "Medium",
      mitigation: "IRB-approved proof-of-concept study before CDR",
    });
  }
  if (nodes.length >= 3) {
    risks.push({
      id: `PDR-R00${risks.length + 1}`,
      description: `High modality count (${nodes.length}): integration complexity increases quadratically with modality count`,
      likelihood: "Medium",
      impact: "High",
      mitigation: "Phased modality integration — validate pairs before full stack",
    });
  }

  return risks;
}

export { PDR_LABEL, PDR_SUBLABEL, PDR_DISCLAIMER };