// ── BOM (Conceptual Bill of Materials) Auto-Generator ───────────────────────
// Generates Section 13 — Conceptual BOM data from selected research nodes and LLM result.
// All ZARP plans start at pre-engineering / concept stage.

const BOM_LABEL = "CONCEPTUAL BILL OF MATERIALS — PRE-ENGINEERING STAGE";
const BOM_SUBLABEL = "Component selections are conceptual reference points only.";
const BOM_DISCLAIMER = "Final BOM requires manufacturer engineering and supplier qualification. No procurement authority granted.";

const BOM_NOTES =
  "All component descriptions are conceptual. Specific components, part numbers, manufacturers, and specifications to be determined during detailed engineering with qualified manufacturer. No supplier relationships implied or established by this document.";

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

// Derive driver description from modality
function deriveDriverDesc(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("scalar") || title.includes("phi")) return "DDS signal generator + toroidal coil amplifier — 20 Hz–20 kHz waveform synthesis";
  if (title.includes("magnetic") || title.includes("meg")) return "PWM driver + coil excitation amplifier — pulsed electromagnetic field generation";
  if (title.includes("uv") || title.includes("photon")) return "LED driver board + constant-current regulator — UV/visible spectrum emission control";
  if (title.includes("biofield") || title.includes("frequency")) return "Function generator + RF amplifier — bioelectromagnetic frequency delivery";
  if (title.includes("interferometer") || title.includes("bottle")) return "Dual-channel RF transmitter + phase-locked oscillator — scalar interference zone generation";
  if (title.includes("circuit") || title.includes("oscillator")) return "Oscillator + amplifier stage — signal generation and conditioning";
  return "Signal generator + amplifier — modality-specific waveform synthesis";
}

// Derive applicator description from modality
function deriveApplicator(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("scalar") || title.includes("phi")) return "Dual-layer toroidal coil — scalar field emitter array";
  if (title.includes("magnetic") || title.includes("meg")) return "Helmholtz coil pair — electromagnetic field delivery matrix";
  if (title.includes("uv") || title.includes("photon")) return "UV/visible LED panel — photonic emission array";
  if (title.includes("biofield") || title.includes("frequency")) return "RF applicator coil — bioelectromagnetic field delivery";
  if (title.includes("interferometer") || title.includes("bottle")) return "Dual transmitter antenna pair — scalar interference zone projector";
  if (title.includes("circuit") || title.includes("oscillator")) return "Electrode pair — direct electrical coupling";
  return "Modality-specific applicator — delivery mechanism pending detailed design";
}

// Derive applicator quantity
function deriveApplicatorQty(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("array") || title.includes("matrix")) return 4;
  if (title.includes("dual") || title.includes("pair")) return 2;
  return 1;
}

// Derive applicator category
function deriveApplicatorCategory(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("coil") || title.includes("magnetic")) return "Mechanical / Electronic";
  if (title.includes("led") || title.includes("uv") || title.includes("photon")) return "Electronic / Optical";
  return "Electronic";
}

// Derive delivery description
function deriveDeliveryDesc(node) {
  const title = (node.title + " " + (node.tagline || "")).toLowerCase();
  if (title.includes("scalar") || title.includes("phi")) return "Generates scalar interference field in treatment volume — dual-layer toroidal emission";
  if (title.includes("magnetic") || title.includes("meg")) return "Delivers pulsed electromagnetic field to treatment area — coil induction";
  if (title.includes("uv") || title.includes("photon")) return "Emits UV/visible photons to treatment surface — photonic delivery";
  if (title.includes("biofield") || title.includes("frequency")) return "Delivers bioelectromagnetic frequency field to patient — RF applicator";
  if (title.includes("interferometer") || title.includes("bottle")) return "Projects scalar interference zone in spatial treatment volume — dual transmitter";
  if (title.includes("circuit") || title.includes("oscillator")) return "Direct electrical coupling via electrode contact — signal delivery";
  return "Delivers modality output to patient — delivery mechanism pending detailed design";
}

// Auto-generate BOM data from selected nodes and LLM result
export function generateBomData(selectedNodes, result, mode) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const docCode = "ZARP-BOM-" + String(now.getFullYear()).slice(-2) + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0");

  const deviceName = result?.hybrid_concept || "ZARP Multi-System Device";
  const deviceCode = "ZARP-MSD-" + String(now.getFullYear()).slice(-2) + "-001";

  // ── BOM Header Block ──
  const header = {
    bomCode: docCode,
    device: `${deviceName} (${deviceCode})`,
    version: "1.0",
    date: dateStr,
    status: "CONCEPTUAL",
    preparedBy: "Aethon Apex IP Holdings LLC",
  };

  // ── Assembly 1 — Control System ──
  const assembly1 = [
    {
      item: "1.001",
      assembly: "Control System",
      subAssembly: "Master Controller",
      desc: "Embedded microcontroller / single-board computer (ARM Cortex-A72 class + STM32H7 safety MCU)",
      category: "Electronics",
      qty: 1,
      unit: "EA",
      func: "Runs session protocol, manages modality outputs, receives sensor inputs, runs AI adjustment loop",
      sourceNode: "System",
      notes: "Dual-processor architecture — main + independent safety monitor",
    },
    {
      item: "1.002",
      assembly: "Control System",
      subAssembly: "Safety Monitor",
      desc: "Independent watchdog processor (IEC 61047-5-5 compliant)",
      category: "Electronics",
      qty: 1,
      unit: "EA",
      func: "Hardware safety layer independent of main controller. Monitors all output parameters, cuts power on fault.",
      sourceNode: "System",
      notes: "Dual-channel NC E-stop circuit — hardwired cutoff",
    },
    {
      item: "1.003",
      assembly: "Control System",
      subAssembly: "Power Management",
      desc: "Power supply + distribution board (48V/24V isolated rails)",
      category: "Electronics",
      qty: 1,
      unit: "EA",
      func: "Converts input power, provides isolated rails for each modality driver",
      sourceNode: "System",
      notes: "Medical-grade isolation — IEC 60601-1 compliant",
    },
    {
      item: "1.004",
      assembly: "Control System",
      subAssembly: "UI Controller",
      desc: "Touchscreen display + UI processor (7\" capacitive HMI)",
      category: "Electronics",
      qty: 1,
      unit: "EA",
      func: "Session control interface, biometric display, protocol selection",
      sourceNode: "System",
      notes: "IP54 front panel rating for clinical environment",
    },
  ];

  // ── Assembly 2 — Modality Drivers (auto-generate one row per modality) ──
  const assembly2 = selectedNodes.map((n, i) => ({
    item: `2.0${String(i + 1).padStart(2, "0")}`,
    assembly: "Modality Drivers",
    subAssembly: `${shortModalityName(n.title)} Driver`,
    desc: deriveDriverDesc(n),
    category: "Electronics",
    qty: 1,
    unit: "EA",
    func: `Generates modality-specific signal/waveform for ${shortModalityName(n.title)} applicator`,
    sourceNode: nodeCode(n.title, i),
    notes: `Source: ${n.title}`,
  }));

  // ── Assembly 3 — Delivery Subsystems (one per modality) ──
  const assembly3 = selectedNodes.map((n, i) => ({
    item: `3.0${String(i + 1).padStart(2, "0")}`,
    assembly: "Delivery Subsystems",
    subAssembly: `${shortModalityName(n.title)} Applicator`,
    desc: deriveApplicator(n),
    category: deriveApplicatorCategory(n),
    qty: deriveApplicatorQty(n),
    unit: "EA",
    func: deriveDeliveryDesc(n),
    sourceNode: nodeCode(n.title, i),
    notes: `Delivery mechanism for ${shortModalityName(n.title)}`,
  }));

  // ── Assembly 4 — Sensing & Biofeedback ──
  const assembly4 = [
    {
      item: "4.001",
      assembly: "Sensing & Biofeedback",
      subAssembly: "Biofeedback Sensor Array",
      desc: "HRV / EEG / GSR / SpO₂ / skin temp sensor suite",
      category: "Electronics",
      qty: 1,
      unit: "EA",
      func: "Monitors physiological response during session — feeds AI adjustment loop",
      sourceNode: "System",
      notes: "Non-invasive sensors — medical-grade accuracy",
    },
  ];

  // ── Assembly 5 — Structural / Housing ──
  const assembly5 = [
    {
      item: "5.001",
      assembly: "Structural / Housing",
      subAssembly: "Primary Enclosure",
      desc: "Main structural housing (material TBD — 6061-T6 aluminum or equivalent)",
      category: "Mechanical",
      qty: 1,
      unit: "EA",
      func: "Structural support, EMI shielding, patient safety enclosure",
      sourceNode: "System",
      notes: "Material selection pending biocompatibility and EMC analysis",
    },
    {
      item: "5.002",
      assembly: "Structural / Housing",
      subAssembly: "Patient Interface",
      desc: "Ergonomic contact surfaces — biocompatible materials (ISO 10993 compliant)",
      category: "Mechanical",
      qty: 1,
      unit: "EA",
      func: "Patient contact surface — comfort and positioning during session",
      sourceNode: "System",
      notes: "ISO 10993 biocompatibility testing required",
    },
  ];

  // ── Assembly 6 — Software & Firmware ──
  const assembly6 = [
    {
      item: "6.001",
      assembly: "Software & Firmware",
      subAssembly: "Device Firmware",
      desc: "Embedded RTOS + session protocol engine",
      category: "Software",
      qty: 1,
      unit: "LIC",
      func: "Real-time session control, modality coordination, safety monitoring",
      sourceNode: "System",
      notes: "IEC 62304 Class B safety classification required",
    },
    {
      item: "6.002",
      assembly: "Software & Firmware",
      subAssembly: "AI Adjustment Module",
      desc: "ML model for real-time protocol optimization (TensorFlow Lite class)",
      category: "Software",
      qty: 1,
      unit: "LIC",
      func: "Closed-loop biometric feedback → protocol adjustment",
      sourceNode: "System",
      notes: "On-device inference — no cloud dependency for safety-critical loop",
    },
    {
      item: "6.003",
      assembly: "Software & Firmware",
      subAssembly: "Data Platform Integration",
      desc: "ACE / BFAC cloud sync module",
      category: "Software",
      qty: 1,
      unit: "LIC",
      func: "Session data upload, analytics, therapist dashboard integration",
      sourceNode: "System",
      notes: "HIPAA-compliant data handling — encrypted at rest and in transit",
    },
  ];

  // ── Assembly 7 — Accessories & Consumables ──
  const assembly7 = [
    {
      item: "7.001",
      assembly: "Accessories & Consumables",
      subAssembly: "Calibration Reference",
      desc: "Output verification standard — modality-specific calibration fixture",
      category: "Accessory",
      qty: 1,
      unit: "EA",
      func: "Field calibration and output verification",
      sourceNode: "System",
      notes: "Required for annual calibration cycle",
    },
    {
      item: "7.002",
      assembly: "Accessories & Consumables",
      subAssembly: "Session Consumables",
      desc: "Gel pads / electrode patches (if applicable to modality)",
      category: "Consumable",
      qty: 1,
      unit: "EA",
      func: "Patient contact medium for electrode-based modalities",
      sourceNode: "System",
      notes: "Single-use, per-session replacement — quantity TBD",
    },
  ];

  const allItems = [
    ...assembly1,
    ...assembly2,
    ...assembly3,
    ...assembly4,
    ...assembly5,
    ...assembly6,
    ...assembly7,
  ];

  // ── BOM Revision Log ──
  const revisionLog = [
    { rev: "1.0", date: dateStr, author: "ZARP Auto-Generated", changes: "Initial concept BOM" },
  ];

  return {
    docCode,
    label: BOM_LABEL,
    sublabel: BOM_SUBLABEL,
    disclaimer: BOM_DISCLAIMER,
    notes: BOM_NOTES,
    header,
    assemblies: {
      "1": { name: "Control System", items: assembly1 },
      "2": { name: "Modality Drivers", items: assembly2 },
      "3": { name: "Delivery Subsystems", items: assembly3 },
      "4": { name: "Sensing & Biofeedback", items: assembly4 },
      "5": { name: "Structural / Housing", items: assembly5 },
      "6": { name: "Software & Firmware", items: assembly6 },
      "7": { name: "Accessories & Consumables", items: assembly7 },
    },
    allItems,
    revisionLog,
  };
}

export { BOM_LABEL, BOM_SUBLABEL, BOM_DISCLAIMER, BOM_NOTES };