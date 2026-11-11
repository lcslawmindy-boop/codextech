// Neuro Regeneration Chamber — Engineering Development Package
// ZA-NRC-001 · PRD · PDR · BOM · SOW · EVT · DVT
// Research prototype. Not for medical use. Unverified concept claims.

export const DEVICE = {
  id: "nrc",
  name: "Neuro Regeneration Chamber (NRC-1)",
  docId: "ZA-NRC-001",
  revision: "B",
  date: "2026-11-11",
  classification: "Research Prototype — Not for Sale",
  image: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9abda12e4_generated_image.png",
  summary: "An investigational, closed-loop neuromodulation chamber integrating evidence-anchored modalities (transcranial PBM, cranial PEMF/theta entrainment, molecular hydrogen, gut-brain microbiome delivery, biometric closed-loop control) with an in-vitro-only epigenetic/reprogramming interface. The device is a governed research platform — no claim of reversing pre-birth brain damage is made or implied.",
};

// Subsystem reference designators used on the rendering callouts
export const SUBSYSTEMS = [
  { ref: "PBM", name: "Transcranial PBM Core", color: "#ef4444", desc: "Multi-array 630/850 nm near-IR LED helmet to cortex. Strongest evidence-backed modality. Dosimetry-controlled, sham-capable.", verified: true },
  { ref: "PEMF", name: "Cranial PEMF + Theta Coil Ring", color: "#3b82f6", desc: "4–7 Hz theta + 7.83 Hz Schumann PEMF coil ring for state induction / vagal tone. Adjunct, not a repair claim.", verified: "partial" },
  { ref: "HIT", name: "Hydrogen Inhalation Manifold", color: "#14b8a6", desc: "99.99% H₂ delivery 100–300 mL/min with MQ-8 concentration sensor and auto-shutoff. Targets neuroinflammation axis.", verified: "partial" },
  { ref: "GUT", name: "Gut-Brain Microbiome Delivery Port", color: "#22c55e", desc: "Prebiotic/nootropic (Triphala, Brahmi) delivery with optional gold-nanoparticle (Swarna Bhasma) BBB carrier. IND-gated.", verified: "partial" },
  { ref: "EPI", name: "Epigenetic Reprogramming RF Interface", color: "#a855f7", desc: "IN-VITRO ONLY. Longitudinal-wave / wave-genome exposure panel tested against sham on iPSC-neuron lines. Falsification gate required.", verified: false },
  { ref: "BIO", name: "Biometric Closed-Loop Sensor Stack", color: "#f59e0b", desc: "HRV (MAX30102) + EEG headband + EDA/GSR + skin temp. Cortex-M7 fusion, 100 ms sample, auto-titrates modality intensity.", verified: "partial" },
  { ref: "DEL", name: "Bioactive Delivery Module", color: "#ec4899", desc: "Gold-nanoparticle + Rasayana/Brahmi reservoir with metered pump. Pharmacology under IND; 'scalar activation' dropped.", verified: "partial" },
  { ref: "SHD", name: "Faraday-Shielded Treatment Chamber", color: "#06b6d4", desc: "0.1 mm copper mesh 360° EM enclosure around patient cradle. EMI gasket seams, <100 ms E-stop interlock.", verified: true },
];

// Overlay callouts positioned over the engineering render (percent coordinates)
export const CALLOUTS = [
  { ref: "PBM", x: 50, y: 20, label: "PBM LED Helmet 630/850 nm" },
  { ref: "PEMF", x: 78, y: 30, label: "PEMF Theta Coil Ring 4–7 Hz" },
  { ref: "BIO", x: 22, y: 38, label: "Biometric Sensor Stack HRV/EEG/EDA" },
  { ref: "EPI", x: 80, y: 52, label: "Epigenetic RF Interface (in-vitro)" },
  { ref: "DEL", x: 20, y: 58, label: "Bioactive Delivery Module" },
  { ref: "GUT", x: 76, y: 68, label: "Gut-Brain Microbiome Port" },
  { ref: "HIT", x: 24, y: 72, label: "H₂ Inhalation Manifold" },
  { ref: "SHD", x: 50, y: 88, label: "Faraday Shielded Chamber" },
];

export const PRD_SECTIONS = [
  { heading: "1. Purpose & Scope", body: "The Neuro Regeneration Chamber (NRC-1) is an investigational research platform for controlled, closed-loop neuromodulation of the developing/injured brain. It is intended exclusively for in-vitro and IRB/IACUC-gated animal research under this PRD. No human therapeutic use is authorized." },
  { heading: "2. Target Condition", body: "Pre-birth brain injury including in-utero hypoxic-ischemic injury (HIE), congenital infection/teratogen exposure, genetic neurodevelopmental disorders, neural-tube/migration defects, and prematurity-related injury (PVL, PVHI). No established clinical reversal exists for most structural injury; this device tests adjunctive neuroprotective/reparative hypotheses only." },
  { heading: "3. User Personas", bullets: [
    "Principal Investigator — configures protocols, gates progression, owns IRB/IACUC record.",
    "Research Technician — operates chamber, runs pre-registered endpoints, logs deviations.",
    "Independent DSMB / QA reviewer — audits sham controls and null-result paths.",
  ] },
  { heading: "4. Functional Requirements (FR)", table: [
    { ID: "FR-01", Requirement: "Deliver transcranial PBM at 630 nm and 850 nm, 0–50 mW/cm², dosimetry logged", Priority: "Must" },
    { ID: "FR-02", Requirement: "Deliver cranial PEMF, 4–7 Hz theta + 7.83 Hz Schumann, ≤20 µT at cradle", Priority: "Must" },
    { ID: "FR-03", Requirement: "Deliver 99.99% H₂ at 100–300 mL/min with auto-shutoff >1% v/v", Priority: "Must" },
    { ID: "FR-04", Requirement: "Closed-loop biometric control (HRV/EEG/EDA/temp), ≤200 ms modality adjust", Priority: "Must" },
    { ID: "FR-05", Requirement: "Epigenetic RF exposure panel — sham-controlled, in-vitro only, hardware interlocked", Priority: "Must" },
    { ID: "FR-06", Requirement: "Faraday EM enclosure, <100 ms E-stop, EMI gasket seams", Priority: "Must" },
    { ID: "FR-07", Requirement: "Pre-registered protocol + null-result path per session", Priority: "Must" },
    { ID: "FR-08", Requirement: "Bioactive delivery (gold-nanoparticle + nootropic) under IND, metered pump", Priority: "Should" },
  ] },
  { heading: "5. Non-Functional Requirements (NFR)", bullets: [
    "Safety: IEC 60601-1 patient isolation, GFCI 10 µA trip, H₂ explosion bonding, O₃ <0.03 ppm.",
    "Reliability: MTBF >2,000 h bench, 200 canopy cycles no binding.",
    "Data integrity: signed firmware, append-only session log, CRC-verified sensor frames.",
    "Auditability: every modality enable/disable timestamped and reviewer-readable.",
    "Export control: EAR/ITAR screen on EM-emission hardware before any external disclosure.",
  ] },
  { heading: "6. Out of Scope", bullets: [
    "Any claim of reversing structural pre-birth brain damage.",
    "Human clinical use prior to IRB approval and regulatory clearance (IND/IMD).",
    "Reliance on unverified mechanisms (scalar EM, wave genome, Priore, Akashic) without falsification.",
    "Field repair or unsupervised operation.",
  ] },
];

export const PDR_SECTIONS = [
  { heading: "1. Architecture Overview", body: "Eight subsystems coordinated by a BeagleBone AI-64 + Lattice iCE40 FPGA controller. Patient cradle centered in a Faraday enclosure; PBM helmet and PEMF coil ring above; H₂, microbiome, and bioactive delivery flanking; biometric sensors at contact points; epigenetic RF panel on a separate interlocked in-vitro bench (not in the human cradle)." },
  { heading: "2. Subsystem Decomposition", table: SUBSYSTEMS.map((s) => ({ Ref: s.ref, Subsystem: s.name, Status: s.verified === true ? "Verified anchor" : s.verified === "partial" ? "Partial / early" : "Speculative", Role: s.desc })) },
  { heading: "3. Evidence Status & Falsification", bullets: [
    "Verified anchors: transcranial PBM, Faraday shielding, closed-loop biometric control.",
    "Partial / early: PEMF theta entrainment, H₂ neuroinflammation, gut-brain delivery, gold-nanoparticle BBB carrier.",
    "Speculative (in-vitro only): epigenetic RF / wave-genome / Priore-class exposure — must pass sham before any reliance.",
    "Every speculative subsystem carries a falsification gate with a documented null-result path.",
  ] },
  { heading: "4. Key Interfaces", table: [
    { Interface: "PBM driver ← BFAC MCU", Type: "PWM + thermal sense", Spec: "48 V DC, 0–50 mW/cm², NTC 10kΩ per panel" },
    { Interface: "PEMF driver ← BFAC MCU", Type: "Current-mode", Spec: "≤20 µT, 4–7 Hz + 7.83 Hz, ACS712 monitor" },
    { Interface: "H₂ manifold ← safety relay", Type: "Solenoid + MQ-8", Spec: "Auto-close <2 s on >1% v/v alarm" },
    { Interface: "Biometric fusion → BFAC", Type: "Isolated ADC 3.3 V", Spec: "100 ms sample, ≤200 ms modality adjust" },
    { Interface: "EPI panel ← interlock", Type: "Hardwired key + door", Spec: "Energized only with in-vitro bench present" },
  ] },
  { heading: "5. Risks & Mitigations", table: [
    { Risk: "Speculative mechanism relied upon", Severity: "High", Mitigation: "In-vitro only, sham-controlled, falsification gate, no human use" },
    { Risk: "H₂ flammability", Severity: "High", Mitigation: "Bonding, MQ-8 alarm, auto-shutoff, ventilation, <1% v/v" },
    { Risk: "Sensory overload (pediatric/neonatal)", Severity: "Medium", Mitigation: "Closed-loop biometric auto-reduction, max intensity caps" },
    { Risk: "EM emission regulatory", Severity: "Medium", Mitigation: "Faraday enclosure, EAR/ITAR screen pre-export" },
    { Risk: "Bioactive pharmacology", Severity: "High", Mitigation: "IND-gated, metered pump, no 'scalar activation' claim" },
  ] },
  { heading: "6. Compliance Targets", bullets: [
    "IEC 60601-1 (electrical safety), IEC 60601-1-2 (EMC) for any human-adjacent configuration.",
    "IACUC for animal model; IRB + IND/IMD before any human use.",
    "ISO 14971 risk management file maintained throughout.",
  ] },
];

export const BOM_ITEMS = [
  { item: 1, refDes: "PBM-LED-1", category: "PBM", description: "630 nm red LED array panel (48-emitter)", qty: 6, uom: "ea", estCost: 85, supplier: "Quantum Devices", leadTime: "6 wk", notes: "Mounted in helmet" },
  { item: 2, refDes: "PBM-LED-2", category: "PBM", description: "850 nm NIR LED array panel (48-emitter)", qty: 6, uom: "ea", estCost: 95, supplier: "Quantum Devices", leadTime: "6 wk", notes: "Mounted in helmet" },
  { item: 3, refDes: "PBM-DRV", category: "PBM", description: "Constant-current LED driver, 48 V DC, 4-channel PWM", qty: 2, uom: "ea", estCost: 120, supplier: "Mean Well", leadTime: "4 wk", notes: "" },
  { item: 4, refDes: "PBM-HS", category: "PBM", description: "Aluminum heat sink + thermal paste per panel", qty: 12, uom: "ea", estCost: 14, supplier: "Wakefield", leadTime: "3 wk", notes: "" },
  { item: 5, refDes: "PBM-NTC", category: "PBM", description: "NTC 10kΩ thermistor per panel", qty: 12, uom: "ea", estCost: 2, supplier: "Murata", leadTime: "2 wk", notes: "Junction <75 °C" },
  { item: 6, refDes: "PEMF-COIL", category: "PEMF", description: "Cranial coil ring, litz AWG20 × 50 strand, 144 turns", qty: 1, uom: "set", estCost: 340, supplier: "Coil winding (custom)", leadTime: "8 wk", notes: "4–7 Hz + 7.83 Hz" },
  { item: 7, refDes: "PEMF-DRV", category: "PEMF", description: "PEMF driver board, 48 V, current-mode, ≤20 µT", qty: 1, uom: "ea", estCost: 180, supplier: "Custom PCB", leadTime: "6 wk", notes: "" },
  { item: 8, refDes: "PEMF-ACS", category: "PEMF", description: "ACS712 current monitor per coil segment", qty: 4, uom: "ea", estCost: 6, supplier: "Allegro", leadTime: "3 wk", notes: "" },
  { item: 9, refDes: "HIT-ELZ", category: "H₂", description: "PEM electrolyzer, 99.99% H₂, 300 mL/min", qty: 1, uom: "ea", estCost: 420, supplier: "Proton OnSite", leadTime: "10 wk", notes: "" },
  { item: 10, refDes: "HIT-MQ8", category: "H₂", description: "MQ-8 H₂ concentration sensor", qty: 2, uom: "ea", estCost: 12, supplier: "Hanwei", leadTime: "2 wk", notes: "Alarm >1% v/v" },
  { item: 11, refDes: "HIT-VALVE", category: "H₂", description: "Solenoid shutoff valve, 1/4 in", qty: 1, uom: "ea", estCost: 28, supplier: "ASCO", leadTime: "3 wk", notes: "Auto-close <2 s" },
  { item: 12, refDes: "HIT-TUBE", category: "H₂", description: "PTFE H₂ delivery tube + sealed grommet", qty: 1, uom: "set", estCost: 18, supplier: "McMaster", leadTime: "1 wk", notes: "" },
  { item: 13, refDes: "GUT-PUMP", category: "Gut-Brain", description: "Metered peristaltic pump, 0–10 mL/h", qty: 1, uom: "ea", estCost: 140, supplier: "Cole-Parmer", leadTime: "4 wk", notes: "IND-gated" },
  { item: 14, refDes: "GUT-RES", category: "Gut-Brain", description: "Bioactive reservoir, 250 mL, medical-grade", qty: 1, uom: "ea", estCost: 22, supplier: "Thermo", leadTime: "2 wk", notes: "" },
  { item: 15, refDes: "DEL-AU", category: "Delivery", description: "Gold nanoparticle (Swarna Bhasma) carrier, 10 nm, GMP", qty: 1, uom: "lot", estCost: 600, supplier: "Cytodiagnostics", leadTime: "8 wk", notes: "BBB carrier; no scalar claim" },
  { item: 16, refDes: "DEL-BRA", category: "Delivery", description: "Brahmi (Bacopa) standardized extract", qty: 1, uom: "lot", estCost: 45, supplier: "Sabinsa", leadTime: "3 wk", notes: "BDNF adjunct" },
  { item: 17, refDes: "EPI-DDS", category: "Epi RF", description: "AD9854 DDS synthesizer (3-channel)", qty: 1, uom: "ea", estCost: 95, supplier: "Analog Devices", leadTime: "6 wk", notes: "In-vitro only" },
  { item: 18, refDes: "EPI-OCXO", category: "Epi RF", description: "10 MHz OCXO reference, 0.01 ppb", qty: 1, uom: "ea", estCost: 110, supplier: "Bliley", leadTime: "6 wk", notes: "" },
  { item: 19, refDes: "EPI-AMP", category: "Epi RF", description: "Class-D amplifier, 500 W/ch", qty: 2, uom: "ea", estCost: 220, supplier: "Custom", leadTime: "8 wk", notes: "Shielded bench" },
  { item: 20, refDes: "EPI-INT", category: "Epi RF", description: "Hardwired key + door interlock", qty: 1, uom: "set", estCost: 40, supplier: "Omron", leadTime: "2 wk", notes: "Energizes only with in-vitro bench" },
  { item: 21, refDes: "BIO-HRV", category: "Biometric", description: "MAX30102 HRV/pulse sensor", qty: 1, uom: "ea", estCost: 9, supplier: "Maxim", leadTime: "3 wk", notes: "Left armrest" },
  { item: 22, refDes: "BIO-EEG", category: "Biometric", description: "EEG headband, 8-channel, spring contacts", qty: 1, uom: "ea", estCost: 180, supplier: "OpenBCI", leadTime: "5 wk", notes: "Canopy crown dock" },
  { item: 23, refDes: "BIO-EDA", category: "Biometric", description: "AD8232 EDA/GSR sensor", qty: 1, uom: "ea", estCost: 14, supplier: "Analog Devices", leadTime: "3 wk", notes: "Right armrest" },
  { item: 24, refDes: "BIO-TMP", category: "Biometric", description: "MLX90614 IR skin temp sensor", qty: 1, uom: "ea", estCost: 18, supplier: "Melexis", leadTime: "3 wk", notes: "Headrest" },
  { item: 25, refDes: "BIO-MCU", category: "Biometric", description: "Cortex-M7 sensor fusion board", qty: 1, uom: "ea", estCost: 90, supplier: "STMicro", leadTime: "4 wk", notes: "100 ms sample" },
  { item: 26, refDes: "CTL-BBB", category: "Controller", description: "BeagleBone AI-64 embedded controller", qty: 1, uom: "ea", estCost: 200, supplier: "BeagleBoard", leadTime: "5 wk", notes: "" },
  { item: 27, refDes: "CTL-FPGA", category: "Controller", description: "Lattice iCE40 FPGA, real-time I/O", qty: 1, uom: "ea", estCost: 60, supplier: "Lattice", leadTime: "4 wk", notes: "" },
  { item: 28, refDes: "CTL-HMI", category: "Controller", description: "10.1 in touchscreen operator HMI", qty: 1, uom: "ea", estCost: 140, supplier: "Adafruit", leadTime: "3 wk", notes: "" },
  { item: 29, refDes: "SHD-MESH", category: "Shield", description: "0.1 mm copper mesh, 99.9%, 360° enclosure", qty: 1, uom: "set", estCost: 320, supplier: "TWP Inc", leadTime: "4 wk", notes: "" },
  { item: 30, refDes: "SHD-GASK", category: "Shield", description: "Conductive silicone EMI gasket, perimeter", qty: 1, uom: "set", estCost: 85, supplier: "Laird", leadTime: "3 wk", notes: "" },
  { item: 31, refDes: "SHD-ESTP", category: "Shield", description: "E-stop button + safety relay, <100 ms cutoff", qty: 2, uom: "ea", estCost: 35, supplier: "Pilz", leadTime: "3 wk", notes: "" },
  { item: 32, refDes: "SHD-FARADAY", category: "Shield", description: "Faraday enclosure frame + hinge", qty: 1, uom: "set", estCost: 480, supplier: "Custom fab", leadTime: "10 wk", notes: "" },
  { item: 33, refDes: "PWR-ISO", category: "Power", description: "5 kVA medical isolation transformer", qty: 1, uom: "ea", estCost: 380, supplier: "Tripp Lite", leadTime: "5 wk", notes: "" },
  { item: 34, refDes: "PWR-RAIL", category: "Power", description: "Multi-rail DC supply 48/24/12/5 V", qty: 1, uom: "ea", estCost: 160, supplier: "Mean Well", leadTime: "4 wk", notes: "<3 kW total" },
  { item: 35, refDes: "PWR-GFCI", category: "Power", description: "GFCI patient-isolation, 10 µA trip", qty: 4, uom: "ea", estCost: 25, supplier: "Legrand", leadTime: "2 wk", notes: "" },
  { item: 36, refDes: "STR-CRADLE", category: "Structural", description: "Carbon-fiber patient cradle, EM-transparent", qty: 1, uom: "ea", estCost: 700, supplier: "Custom fab", leadTime: "12 wk", notes: "300 kg load" },
  { item: 37, refDes: "STR-FRAME", category: "Structural", description: "Titanium-reinforced inner frame", qty: 1, uom: "set", estCost: 900, supplier: "Custom fab", leadTime: "12 wk", notes: "" },
  { item: 38, refDes: "STR-CANOPY", category: "Structural", description: "Composite canopy + gas-strut assist", qty: 1, uom: "ea", estCost: 540, supplier: "Custom fab", leadTime: "10 wk", notes: "200 cycles" },
  { item: 39, refDes: "SW-FW", category: "Software", description: "BFAC safety firmware v1.0 (signed)", qty: 1, uom: "lot", estCost: 0, supplier: "Internal", leadTime: "—", notes: "CRC-verified" },
  { item: 40, refDes: "SW-LOG", category: "Software", description: "Append-only session log + audit export", qty: 1, uom: "lot", estCost: 0, supplier: "Internal", leadTime: "—", notes: "Reviewer-readable" },
];

export const BOM_SUMMARY = {
  totalLineItems: BOM_ITEMS.length,
  totalComponents: BOM_ITEMS.reduce((s, it) => s + (Number(it.qty) || 0), 0),
  estimatedCost: BOM_ITEMS.reduce((s, it) => s + (Number(it.estCost) || 0) * (Number(it.qty) || 0), 0),
  categories: [...new Set(BOM_ITEMS.map((it) => it.category))],
};

export const SOW_SECTIONS = [
  { heading: "1. Scope of Work", body: "Design, build, and bench-validate the NRC-1 research prototype through EVT and DVT. No human use. All speculative subsystems remain in-vitro with falsification gates. Work proceeds only after Gate 0 (literature & harm screen) and Gate 1 (in-vitro) are satisfied." },
  { heading: "2. Deliverables", table: [
    { Task: "T1 Design package", Deliverable: "PRD, PDR, BOM, SOW, this document set", Due: "Week 4" },
    { Task: "T2 Bench prototype (EVT)", Deliverable: "Assembled NRC-1 EVT unit, test report", Due: "Week 18" },
    { Task: "T3 In-vitro falsification", Deliverable: "Sham-controlled iPSC-neuron study, null-result documented", Due: "Week 24" },
    { Task: "T4 DVT build", Deliverable: "DVT unit + EMC pre-scan + safety interlock validation", Due: "Week 32" },
    { Task: "T5 Risk file", Deliverable: "ISO 14971 risk management file", Due: "Week 36" },
    { Task: "T6 Gate review", Deliverable: "Go/no-go review for animal model (Gate 2)", Due: "Week 40" },
  ] },
  { heading: "3. Work Breakdown Structure (WBS)", bullets: [
    "WP1 — Requirements & architecture (PRD/PDR) — Weeks 1–4",
    "WP2 — PBM + PEMF subsystems design/build — Weeks 4–12",
    "WP3 — H₂ + gut-brain + bioactive delivery — Weeks 4–14",
    "WP4 — Biometric closed-loop + controller firmware — Weeks 6–14",
    "WP5 — Epigenetic RF in-vitro bench + interlock — Weeks 8–16",
    "WP6 — Faraday enclosure + structural integration — Weeks 10–18",
    "WP7 — EVT integration & test — Weeks 18–24",
    "WP8 — In-vitro falsification study — Weeks 22–24",
    "WP9 — DVT build + EMC/safety — Weeks 26–34",
    "WP10 — Gate review & risk file — Weeks 34–40",
  ] },
  { heading: "4. Acceptance Criteria", bullets: [
    "EVT: all subsystems function at spec; 100% interlock validation; EVT test report signed.",
    "In-vitro: pre-registered endpoints (DNA methylation, telomere, BDNF, viability) with sham control; null-result path documented.",
    "DVT: EMC pre-scan pass; IEC 60601-1 safety pre-compliance; 200 canopy cycles no binding.",
    "Gate 2: go/no-go decision documented; IACUC packet drafted if go.",
  ] },
  { heading: "5. Governance & Reporting", bullets: [
    "Weekly status report; deviation log; PI sign-off per WP completion.",
    "Independent DSMB review at EVT exit and DVT exit.",
    "All speculative-subsystem results published regardless of outcome (no negative-result suppression).",
  ] },
];

export const EVT_SECTIONS = [
  { heading: "EVT-1 Electrical & Power", table: [
    { Test: "DC rail voltages", Method: "Measure 48/24/12/5/3.3 V rails", Pass: "±2% at full load" },
    { Test: "GFCI trip", Method: "Inject 10 µA leakage", Pass: "Trip within 1 cycle" },
    { Test: "Isolation", Method: "IEC 60601-1 patient leakage", Pass: "<10 µA" },
  ] },
  { heading: "EVT-2 PBM Core", table: [
    { Test: "Output power", Method: "Calibrated photodetector at cradle", Pass: "0–50 mW/cm², ±10%" },
    { Test: "Thermal rise", Method: "30-min run, NTC readout", Pass: "Junction <75 °C, <15 °C rise" },
    { Test: "Uniformity", Method: "9-point map at cradle", Pass: "≥85% uniformity" },
  ] },
  { heading: "EVT-3 PEMF + Biometric Loop", table: [
    { Test: "PEMF field", Method: "Gaussmeter at 5 cradle points", Pass: "≤20 µT, 4–7/7.83 Hz ±0.01 Hz" },
    { Test: "Closed-loop response", Method: "Simulate HRV stress event", Pass: "Modality adjust ≤200 ms" },
    { Test: "Sensor accuracy", Method: "HRV vs reference ECG", Pass: "±2 BPM" },
  ] },
  { heading: "EVT-4 H₂ + Shield + E-stop", table: [
    { Test: "H₂ purity", Method: "Portable analyzer at delivery", Pass: "≥99.99%" },
    { Test: "H₂ alarm", Method: "Inject >1% v/v", Pass: "Auto-shutoff <2 s" },
    { Test: "E-stop", Method: "Press E-stop under load", Pass: "All power cut <100 ms" },
    { Test: "EMI gasket", Method: "Seam scan", Pass: "No gap >2 mm" },
  ] },
  { heading: "EVT-5 Epigenetic RF (in-vitro only)", table: [
    { Test: "Interlock", Method: "Remove in-vitro bench", Pass: "Panel de-energizes" },
    { Test: "Sham control", Method: "Exposed vs sham iPSC-neurons", Pass: "Pre-registered endpoints; null path run" },
    { Test: "DDS accuracy", Method: "Frequency counter", Pass: "±0.01 Hz at setpoints" },
  ] },
];

export const DVT_SECTIONS = [
  { heading: "DVT-1 EMC Pre-Scan", table: [
    { Test: "Radiated emissions", Method: "3 m chamber scan", Pass: "Below CISPR 11 Class A limits" },
    { Test: "Immunity", Method: "IEC 60601-1-2 immunity set", Pass: "No malfunction" },
    { Test: "Faraday attenuation", Method: "Internal source, external probe", Pass: "≥40 dB across 1 MHz–1 GHz" },
  ] },
  { heading: "DVT-2 Safety Pre-Compliance", table: [
    { Test: "Leakage currents", Method: "IEC 60601-1 test rig", Pass: "NC <500 µA, SFC <50 µA" },
    { Test: "Dielectric strength", Method: "1 kV/1 min", Pass: "No breakdown" },
    { Test: "Mechanical cycles", Method: "200 canopy open/close", Pass: "No binding, no gasket damage" },
  ] },
  { heading: "DVT-3 Reliability", table: [
    { Test: "Soak run", Method: "72 h continuous operation", Pass: "No fault, log intact" },
    { Test: "Thermal cycling", Method: "10 cycles 10–40 °C", Pass: "No condensation, rails ±2%" },
  ] },
  { heading: "DVT-4 Falsification Audit", table: [
    { Test: "Speculative subsystem logs", Method: "Independent DSMB review", Pass: "All sham controls present, null path documented" },
    { Test: "No-claim audit", Method: "Copy/label review", Pass: "No 'reversal' language outside granted protocol" },
  ] },
];

export const FALSIFICATION_TESTS = [
  { test: "EPI-F1 Wave-genome exposure", hypothesis: "Longitudinal-wave exposure shifts DNA methylation vs sham", method: "iPSC-neuron lines, exposed vs sham, 72 h, blinded analysis", pass: "Significant delta (p<0.01, FDR) vs sham; if null, subsystem retired" },
  { test: "EPI-F2 Priore-class field", hypothesis: "Phase-conjugate field improves viability after injury model", method: "In-vitro injury model, exposed vs sham, viability endpoint", pass: "Pre-registered effect size; null path documented" },
  { test: "PBM-F1 Transcranial dose", hypothesis: "PBM reduces neuroinflammation marker (TNF-α) vs sham", method: "Conditioned media assay, sham LED array", pass: "Significant TNF-α reduction vs sham" },
  { test: "HIT-F1 Hydrogen neuroinflammation", hypothesis: "H₂ inhalation reduces oxidative stress marker", method: "Animal model, H₂ vs air, blinded endpoint", pass: "Pre-registered marker reduction" },
  { test: "GUT-F1 Microbiome gut-brain", hypothesis: "Microbiome delivery shifts behavior marker", method: "Animal model, delivery vs vehicle, blinded scoring", pass: "Pre-registered effect; null path documented" },
];