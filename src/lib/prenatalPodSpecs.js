// Prenatal Repair Pod (NRC-P) — Pediatric Variant Engineering Development Package
// ZA-NRC-P-001 · PRD · PDR · BOM · SOW · EVT · DVT
// Pediatric investigational device. Not for medical use. Unverified concept claims.
// Autism is a neurodevelopmental difference, not "damage to reverse."

export const DEVICE = {
  id: "nrcp",
  name: "Prenatal Repair Pod (NRC-P)",
  docId: "ZA-NRC-P-001",
  revision: "A",
  date: "2026-11-11",
  classification: "Pediatric Investigational Device — Not for Sale",
  image: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0d0f3b134_generated_image.png",
  summary: "A pediatric-scaled variant of the Neuro Regeneration Chamber tuned to the dysregulations that prenatal injury (congenital infection, HIE, teratogen, prematurity, maternal immune activation) can amplify in autism spectrum: neuroinflammation, sensory overload, neural incoherence, and gut-brain disruption. Closed-loop biometrics titrate every modality to keep a child safe. The epigenetic/DNA 'reprogramming' layer is an in-vitro research interface only — it never operates on a child. No claim of reversing, repairing, or curing autism or brain damage is made or implied.",
};

export const SUBSYSTEMS = [
  { ref: "PBM", name: "Transcranial PBM Helmet (Pediatric)", color: "#ef4444", desc: "630/850 nm near-IR LED helmet, dosimetry-capped for pediatric skull thickness. Strongest evidence anchor. Sham-capable. Max 25 mW/cm² for pediatric use.", verified: true },
  { ref: "PEMF", name: "Cranial PEMF + Theta Coil Ring", color: "#3b82f6", desc: "4–7 Hz theta + 7.83 Hz Schumann coil ring for state regulation and vagal tone. Adjunct, not a repair claim. ≤10 µT pediatric cap.", verified: "partial" },
  { ref: "HIT", name: "Low-Dose H₂ Inhalation (Pediatric)", color: "#14b8a6", desc: "Titrated H₂ 50–150 mL/min for neuroinflammation axis. Pediatric flow limits, MQ-8 auto-shutoff >1% v/v, <2 s close.", verified: "partial" },
  { ref: "GUT", name: "Gut-Brain Microbiome Delivery Port", color: "#22c55e", desc: "Prebiotic/Triphala oral delivery targeting gut dysbiosis common in ASD. Optional IND-gated bioactive (gold-nanoparticle + Brahmi).", verified: "partial" },
  { ref: "BIO", name: "Pediatric Biometric Closed-Loop", color: "#f59e0b", desc: "HRV (MAX30102) + EEG headband + EDA/GSR + skin temp. Cortex-M7 fusion, 100 ms sample, ≤200 ms auto-reduction to prevent sensory overload.", verified: "partial" },
  { ref: "EPI", name: "Epigenetic Reprogramming RF Interface", color: "#a855f7", desc: "IN-VITRO ONLY. NEVER ON A CHILD. Longitudinal-wave / wave-genome exposure tested vs sham on iPSC-neuron lines. Hardwired interlock disables when pediatric cradle present.", verified: false },
  { ref: "SHD", name: "Faraday + Soft Pediatric Enclosure", color: "#06b6d4", desc: "0.1 mm copper mesh 360° EM shield, child-safe materials (ASTM F963), soft padded interior, <100 ms E-stop, EMI gasket seams.", verified: true },
  { ref: "CTL", name: "Controller + Audit Log", color: "#eab308", desc: "BeagleBone AI-64 + Lattice iCE40 FPGA, signed firmware, append-only session log, IRB-exportable, reviewer-readable. DSMB halt rules.", verified: true },
];

export const CALLOUTS = [
  { ref: "PBM", x: 50, y: 18, label: "PBM LED Helmet 630/850 nm (pediatric cap)" },
  { ref: "PEMF", x: 78, y: 28, label: "PEMF Theta Coil Ring 4–7 Hz" },
  { ref: "BIO", x: 22, y: 36, label: "Biometric Sensor Stack HRV/EEG/EDA" },
  { ref: "EPI", x: 80, y: 50, label: "Epigenetic RF Interface (in-vitro only)" },
  { ref: "CTL", x: 20, y: 52, label: "Controller + Audit Log" },
  { ref: "GUT", x: 76, y: 66, label: "Gut-Brain Microbiome Port" },
  { ref: "HIT", x: 24, y: 70, label: "H₂ Inhalation Manifold (pediatric)" },
  { ref: "SHD", x: 50, y: 88, label: "Faraday + Soft Pediatric Enclosure" },
];

export const PRD_SECTIONS = [
  { heading: "1. Purpose & Scope", body: "The Prenatal Repair Pod (NRC-P) is a pediatric investigational device concept for adjunctive support of the dysregulations prenatal injury can amplify in autism spectrum. It is intended for in-vitro and IACUC-gated animal research under this PRD. No human pediatric use is authorized without IRB approval with pediatric expertise, IND/IMD clearance, assent/consent, and an independent DSMB." },
  { heading: "2. Target Condition (Honest Reframe)", body: "Prenatal injury subtypes linked to ASD-risk dysregulation: congenital infection (CMV, Zika), in-utero HIE, teratogen/medication exposure (valproate), prematurity-related white-matter injury (PVL, PVHI), maternal immune activation, and genetic/epigenetic variants. Autism is a neurodevelopmental difference — NOT 'damage to reverse'. No established clinical reversal of structural injury exists; this device tests adjunctive neuroprotective/regulatory hypotheses only. It makes NO claim to cure, reverse, or repair autism or brain damage." },
  { heading: "3. User Personas", bullets: [
    "Principal Investigator — configures protocols, gates progression, owns IRB/IACUC record, signs no-claim audit.",
    "Pediatric Research Nurse — operates pod, monitors child biometrics, holds E-stop authority.",
    "Independent DSMB / pediatric ethicist — audits sham controls, null-result paths, and assent/consent.",
  ] },
  { heading: "4. Functional Requirements (FR)", table: [
    { ID: "FR-01", Requirement: "Deliver transcranial PBM 630/850 nm, 0–25 mW/cm² (pediatric cap), dosimetry logged", Priority: "Must" },
    { ID: "FR-02", Requirement: "Deliver cranial PEMF 4–7 Hz theta + 7.83 Hz Schumann, ≤10 µT at cradle (pediatric cap)", Priority: "Must" },
    { ID: "FR-03", Requirement: "Deliver 99.99% H₂ at 50–150 mL/min (pediatric flow), auto-shutoff >1% v/v <2 s", Priority: "Must" },
    { ID: "FR-04", Requirement: "Closed-loop biometric control (HRV/EEG/EDA/temp), ≤200 ms modality auto-reduction to prevent overload", Priority: "Must" },
    { ID: "FR-05", Requirement: "Epigenetic RF exposure panel — sham-controlled, IN-VITRO ONLY, hardwired interlocked off when child cradle present", Priority: "Must" },
    { ID: "FR-06", Requirement: "Faraday EM enclosure + child-safe materials (ASTM F963), <100 ms E-stop", Priority: "Must" },
    { ID: "FR-07", Requirement: "Pre-registered protocol + null-result path + no-claim copy audit per session", Priority: "Must" },
    { ID: "FR-08", Requirement: "Gut-brain microbiome delivery (prebiotic/Triphala); IND-gated bioactive optional", Priority: "Should" },
  ] },
  { heading: "5. Non-Functional Requirements (NFR)", bullets: [
    "Safety: IEC 60601-1 patient isolation, GFCI 10 µA trip, H₂ explosion bonding, O₃ <0.03 ppm, ASTM F963 child-safe materials.",
    "Pediatric-specific: sensory-overload prevention, max intensity caps, soft padding, no pinch points.",
    "Reliability: MTBF >2,000 h bench, 200 canopy cycles no binding.",
    "Data integrity: signed firmware, append-only session log, CRC-verified sensor frames, IRB-exportable.",
    "Auditability: every modality enable/disable timestamped; no 'reversal/cure' language outside granted protocol.",
  ] },
  { heading: "6. Out of Scope", bullets: [
    "Any claim of reversing, repairing, or curing autism or brain damage.",
    "Human pediatric use prior to IRB (pediatric expertise) + IND/IMD + assent/consent + DSMB.",
    "Applying the epigenetic/DNA 'reprogramming' layer to a child — it is in-vitro only, hardwired off in pediatric configuration.",
    "Reliance on unverified mechanisms (scalar EM, wave genome, DNA reprogramming) without falsification.",
    "Field repair, unsupervised operation, or marketing as a therapy.",
  ] },
];

export const PDR_SECTIONS = [
  { heading: "1. Architecture Overview", body: "Eight subsystems coordinated by a BeagleBone AI-64 + Lattice iCE40 FPGA controller. A child-sized cradle sits in a soft-padded Faraday enclosure; PBM helmet and PEMF coil ring above; H₂ and microbiome delivery flanking; biometric sensors at contact points. The epigenetic RF panel is on a SEPARATE interlocked in-vitro bench and is hardwired OFF whenever the pediatric cradle is present — it can never operate on a child." },
  { heading: "2. Subsystem Decomposition", table: SUBSYSTEMS.map((s) => ({ Ref: s.ref, Subsystem: s.name, Status: s.verified === true ? "Verified anchor" : s.verified === "partial" ? "Partial / early" : "Speculative (in-vitro)", Role: s.desc })) },
  { heading: "3. Evidence Status & Falsification", bullets: [
    "Verified anchors: transcranial PBM (pediatric dosing), Faraday shielding, controller/audit, closed-loop safety control.",
    "Partial / early: PEMF theta entrainment, H₂ neuroinflammation, gut-brain delivery, biometric closed-loop titration.",
    "Speculative (IN-VITRO ONLY, never on a child): epigenetic RF / wave-genome / DNA 'reprogramming' — must pass sham before any reliance; hardwired off in pediatric config.",
    "Every speculative subsystem carries a falsification gate with a documented null-result path. A failed gate halts progression.",
  ] },
  { heading: "4. Key Interfaces", table: [
    { Interface: "PBM driver ← BFAC MCU", Type: "PWM + thermal sense", Spec: "48 V DC, 0–25 mW/cm² pediatric cap, NTC 10kΩ per panel" },
    { Interface: "PEMF driver ← BFAC MCU", Type: "Current-mode", Spec: "≤10 µT pediatric cap, 4–7 Hz + 7.83 Hz, ACS712 monitor" },
    { Interface: "H₂ manifold ← safety relay", Type: "Solenoid + MQ-8", Spec: "Pediatric 50–150 mL/min, auto-close <2 s on >1% v/v" },
    { Interface: "Biometric fusion → BFAC", Type: "Isolated ADC 3.3 V", Spec: "100 ms sample, ≤200 ms auto-reduction (overload prevention)" },
    { Interface: "EPI panel ← pediatric interlock", Type: "Hardwired cradle-presence sensor", Spec: "Energized ONLY when pediatric cradle absent" },
  ] },
  { heading: "5. Risks & Mitigations", table: [
    { Risk: "Speculative mechanism applied to a child", Severity: "Critical", Mitigation: "Hardwired interlock; EPI panel off whenever pediatric cradle present; in-vitro only" },
    { Risk: "Sensory overload (autism pediatric)", Severity: "High", Mitigation: "Closed-loop biometric auto-reduction ≤200 ms, max intensity caps, soft ramp" },
    { Risk: "H₂ flammability (pediatric)", Severity: "High", Mitigation: "Bonding, MQ-8 alarm, auto-shutoff, ventilation, <1% v/v, pediatric flow cap" },
    { Risk: "Claim creep ('reversal' language)", Severity: "High", Mitigation: "No-claim copy audit per session; DSMB review; IRB copy review" },
    { Risk: "Bioactive pharmacology (pediatric)", Severity: "High", Mitigation: "IND-gated, metered pump, pediatric dosing, no 'scalar activation' claim" },
  ] },
  { heading: "6. Compliance Targets", bullets: [
    "IEC 60601-1 (electrical safety), IEC 60601-1-2 (EMC) for any human-adjacent configuration.",
    "ASTM F963 child-safe materials for all patient-contact surfaces.",
    "IACUC for animal model; IRB with pediatric expertise + IND/IMD before any human pediatric use.",
    "ISO 14971 risk management file with pediatric-specific hazard analysis maintained throughout.",
    "Independent DSMB with pediatric ethicist at EVT exit, DVT exit, and every gate.",
  ] },
];

export const BOM_ITEMS = [
  { item: 1, refDes: "PBM-LED-1", category: "PBM", description: "630 nm red LED array panel (24-emitter, pediatric scale)", qty: 4, uom: "ea", estCost: 65, supplier: "Quantum Devices", leadTime: "6 wk", notes: "Pediatric helmet" },
  { item: 2, refDes: "PBM-LED-2", category: "PBM", description: "850 nm NIR LED array panel (24-emitter, pediatric scale)", qty: 4, uom: "ea", estCost: 75, supplier: "Quantum Devices", leadTime: "6 wk", notes: "Pediatric helmet" },
  { item: 3, refDes: "PBM-DRV", category: "PBM", description: "Constant-current LED driver, 48 V, 4-ch PWM, pediatric cap", qty: 1, uom: "ea", estCost: 110, supplier: "Mean Well", leadTime: "4 wk", notes: "25 mW/cm² cap" },
  { item: 4, refDes: "PBM-HS", category: "PBM", description: "Aluminum heat sink + thermal paste per panel", qty: 8, uom: "ea", estCost: 12, supplier: "Wakefield", leadTime: "3 wk", notes: "" },
  { item: 5, refDes: "PBM-NTC", category: "PBM", description: "NTC 10kΩ thermistor per panel", qty: 8, uom: "ea", estCost: 2, supplier: "Murata", leadTime: "2 wk", notes: "Junction <70 °C pediatric" },
  { item: 6, refDes: "PEMF-COIL", category: "PEMF", description: "Pediatric cranial coil ring, litz AWG22, 120 turns", qty: 1, uom: "set", estCost: 280, supplier: "Coil winding (custom)", leadTime: "8 wk", notes: "≤10 µT cap" },
  { item: 7, refDes: "PEMF-DRV", category: "PEMF", description: "PEMF driver board, 48 V, current-mode, pediatric cap", qty: 1, uom: "ea", estCost: 160, supplier: "Custom PCB", leadTime: "6 wk", notes: "" },
  { item: 8, refDes: "PEMF-ACS", category: "PEMF", description: "ACS712 current monitor per coil segment", qty: 4, uom: "ea", estCost: 6, supplier: "Allegro", leadTime: "3 wk", notes: "" },
  { item: 9, refDes: "HIT-ELZ", category: "H₂", description: "PEM electrolyzer, 99.99% H₂, 150 mL/min pediatric", qty: 1, uom: "ea", estCost: 360, supplier: "Proton OnSite", leadTime: "10 wk", notes: "" },
  { item: 10, refDes: "HIT-MQ8", category: "H₂", description: "MQ-8 H₂ concentration sensor", qty: 2, uom: "ea", estCost: 12, supplier: "Hanwei", leadTime: "2 wk", notes: "Alarm >1% v/v" },
  { item: 11, refDes: "HIT-VALVE", category: "H₂", description: "Solenoid shutoff valve, pediatric flow limiter", qty: 1, uom: "ea", estCost: 28, supplier: "ASCO", leadTime: "3 wk", notes: "Auto-close <2 s" },
  { item: 12, refDes: "HIT-TUBE", category: "H₂", description: "PTFE H₂ delivery tube + sealed grommet, pediatric", qty: 1, uom: "set", estCost: 18, supplier: "McMaster", leadTime: "1 wk", notes: "" },
  { item: 13, refDes: "GUT-PUMP", category: "Gut-Brain", description: "Metered peristaltic pump, 0–5 mL/h pediatric", qty: 1, uom: "ea", estCost: 130, supplier: "Cole-Parmer", leadTime: "4 wk", notes: "IND-gated" },
  { item: 14, refDes: "GUT-RES", category: "Gut-Brain", description: "Bioactive reservoir, 120 mL, medical-grade", qty: 1, uom: "ea", estCost: 20, supplier: "Thermo", leadTime: "2 wk", notes: "" },
  { item: 15, refDes: "GUT-PREBIO", category: "Gut-Brain", description: "Prebiotic/Triphala standardized delivery lot", qty: 1, uom: "lot", estCost: 35, supplier: "Sabinsa", leadTime: "3 wk", notes: "Gut dysbiosis" },
  { item: 16, refDes: "DEL-AU", category: "Delivery", description: "Gold nanoparticle carrier, 10 nm, GMP (IND-gated, optional)", qty: 1, uom: "lot", estCost: 600, supplier: "Cytodiagnostics", leadTime: "8 wk", notes: "BBB carrier; no scalar claim" },
  { item: 17, refDes: "DEL-BRA", category: "Delivery", description: "Brahmi (Bacopa) standardized extract (IND-gated, optional)", qty: 1, uom: "lot", estCost: 45, supplier: "Sabinsa", leadTime: "3 wk", notes: "BDNF adjunct" },
  { item: 18, refDes: "EPI-DDS", category: "Epi RF", description: "AD9854 DDS synthesizer (3-channel) — IN-VITRO ONLY", qty: 1, uom: "ea", estCost: 95, supplier: "Analog Devices", leadTime: "6 wk", notes: "Never on a child" },
  { item: 19, refDes: "EPI-OCXO", category: "Epi RF", description: "10 MHz OCXO reference, 0.01 ppb — IN-VITRO ONLY", qty: 1, uom: "ea", estCost: 110, supplier: "Bliley", leadTime: "6 wk", notes: "" },
  { item: 20, refDes: "EPI-AMP", category: "Epi RF", description: "Class-D amplifier, 500 W/ch — IN-VITRO ONLY", qty: 2, uom: "ea", estCost: 220, supplier: "Custom", leadTime: "8 wk", notes: "Shielded bench" },
  { item: 21, refDes: "EPI-INT", category: "Epi RF", description: "Hardwired cradle-presence interlock (pediatric lockout)", qty: 1, uom: "set", estCost: 45, supplier: "Omron", leadTime: "2 wk", notes: "Off when child present" },
  { item: 22, refDes: "BIO-HRV", category: "Biometric", description: "MAX30102 HRV/pulse sensor (pediatric contact pad)", qty: 1, uom: "ea", estCost: 9, supplier: "Maxim", leadTime: "3 wk", notes: "" },
  { item: 23, refDes: "BIO-EEG", category: "Biometric", description: "Pediatric EEG headband, 8-channel, soft contacts", qty: 1, uom: "ea", estCost: 200, supplier: "OpenBCI", leadTime: "5 wk", notes: "" },
  { item: 24, refDes: "BIO-EDA", category: "Biometric", description: "AD8232 EDA/GSR sensor (pediatric pad)", qty: 1, uom: "ea", estCost: 14, supplier: "Analog Devices", leadTime: "3 wk", notes: "" },
  { item: 25, refDes: "BIO-TMP", category: "Biometric", description: "MLX90614 IR skin temp sensor", qty: 1, uom: "ea", estCost: 18, supplier: "Melexis", leadTime: "3 wk", notes: "Headrest" },
  { item: 26, refDes: "BIO-MCU", category: "Biometric", description: "Cortex-M7 sensor fusion board", qty: 1, uom: "ea", estCost: 90, supplier: "STMicro", leadTime: "4 wk", notes: "100 ms sample" },
  { item: 27, refDes: "CTL-BBB", category: "Controller", description: "BeagleBone AI-64 embedded controller", qty: 1, uom: "ea", estCost: 200, supplier: "BeagleBoard", leadTime: "5 wk", notes: "" },
  { item: 28, refDes: "CTL-FPGA", category: "Controller", description: "Lattice iCE40 FPGA, real-time I/O", qty: 1, uom: "ea", estCost: 60, supplier: "Lattice", leadTime: "4 wk", notes: "" },
  { item: 29, refDes: "CTL-HMI", category: "Controller", description: "10.1 in touchscreen operator HMI (nurse station)", qty: 1, uom: "ea", estCost: 140, supplier: "Adafruit", leadTime: "3 wk", notes: "" },
  { item: 30, refDes: "SHD-MESH", category: "Shield", description: "0.1 mm copper mesh, 99.9%, 360° enclosure (pediatric)", qty: 1, uom: "set", estCost: 300, supplier: "TWP Inc", leadTime: "4 wk", notes: "" },
  { item: 31, refDes: "SHD-GASK", category: "Shield", description: "Conductive silicone EMI gasket, perimeter", qty: 1, uom: "set", estCost: 80, supplier: "Laird", leadTime: "3 wk", notes: "" },
  { item: 32, refDes: "SHD-ESTP", category: "Shield", description: "E-stop button + safety relay, <100 ms cutoff", qty: 2, uom: "ea", estCost: 35, supplier: "Pilz", leadTime: "3 wk", notes: "Nurse authority" },
  { item: 33, refDes: "SHD-PAD", category: "Shield", description: "ASTM F963 child-safe soft padding + interior lining", qty: 1, uom: "set", estCost: 180, supplier: "Custom fab", leadTime: "6 wk", notes: "No pinch points" },
  { item: 34, refDes: "SHD-CRADLE", category: "Shield", description: "Pediatric cradle, EM-transparent, child-sized", qty: 1, uom: "ea", estCost: 520, supplier: "Custom fab", leadTime: "10 wk", notes: "80 kg load" },
  { item: 35, refDes: "PWR-ISO", category: "Power", description: "5 kVA medical isolation transformer", qty: 1, uom: "ea", estCost: 380, supplier: "Tripp Lite", leadTime: "5 wk", notes: "" },
  { item: 36, refDes: "PWR-RAIL", category: "Power", description: "Multi-rail DC supply 48/24/12/5 V", qty: 1, uom: "ea", estCost: 160, supplier: "Mean Well", leadTime: "4 wk", notes: "<2.5 kW pediatric" },
  { item: 37, refDes: "PWR-GFCI", category: "Power", description: "GFCI patient-isolation, 10 µA trip", qty: 4, uom: "ea", estCost: 25, supplier: "Legrand", leadTime: "2 wk", notes: "" },
  { item: 38, refDes: "SW-FW", category: "Software", description: "BFAC safety firmware v1.0 (signed), pediatric caps", qty: 1, uom: "lot", estCost: 0, supplier: "Internal", leadTime: "—", notes: "CRC-verified" },
  { item: 39, refDes: "SW-LOG", category: "Software", description: "Append-only session log + IRB audit export", qty: 1, uom: "lot", estCost: 0, supplier: "Internal", leadTime: "—", notes: "Reviewer-readable" },
  { item: 40, refDes: "SW-AUDIT", category: "Software", description: "No-claim copy audit module (blocks 'reversal/cure')", qty: 1, uom: "lot", estCost: 0, supplier: "Internal", leadTime: "—", notes: "DSMB-reviewed" },
];

export const BOM_SUMMARY = {
  totalLineItems: BOM_ITEMS.length,
  totalComponents: BOM_ITEMS.reduce((s, it) => s + (Number(it.qty) || 0), 0),
  estimatedCost: BOM_ITEMS.reduce((s, it) => s + (Number(it.estCost) || 0) * (Number(it.qty) || 0), 0),
  categories: [...new Set(BOM_ITEMS.map((it) => it.category))],
};

export const SOW_SECTIONS = [
  { heading: "1. Scope of Work", body: "Design, build, and bench-validate the NRC-P pediatric variant through EVT and DVT. No human pediatric use. All speculative subsystems remain in-vitro with falsification gates and hardwired pediatric lockout. Work proceeds only after Gate 0 (reframe & harm screen — remove all 'cure/reverse' language) and Gate 1 (in-vitro) are satisfied." },
  { heading: "2. Deliverables", table: [
    { Task: "T1 Design package", Deliverable: "PRD, PDR, BOM, SOW, this document set", Due: "Week 4" },
    { Task: "T2 Bench prototype (EVT)", Deliverable: "Assembled NRC-P EVT unit, pediatric safety test report", Due: "Week 18" },
    { Task: "T3 In-vitro falsification", Deliverable: "Sham-controlled iPSC-neuron study, null-result documented", Due: "Week 24" },
    { Task: "T4 Pediatric lockout audit", Deliverable: "EPI interlock never bypassed with cradle present — verified", Due: "Week 26" },
    { Task: "T5 DVT build", Deliverable: "DVT unit + EMC pre-scan + ASTM F963 material audit", Due: "Week 32" },
    { Task: "T6 Risk file + IRB packet draft", Deliverable: "ISO 14971 risk file + IRB/IACUC packet draft", Due: "Week 40" },
  ] },
  { heading: "3. Work Breakdown Structure (WBS)", bullets: [
    "WP1 — Requirements, reframe & harm screen (Gate 0) — Weeks 1–4",
    "WP2 — Pediatric PBM + PEMF subsystems (pediatric caps) — Weeks 4–12",
    "WP3 — Pediatric H₂ + gut-brain + bioactive delivery — Weeks 4–14",
    "WP4 — Biometric closed-loop + overload prevention firmware — Weeks 6–14",
    "WP5 — Epigenetic RF in-vitro bench + pediatric lockout interlock — Weeks 8–16",
    "WP6 — Faraday + soft pediatric enclosure + ASTM F963 materials — Weeks 10–18",
    "WP7 — EVT integration & pediatric safety test — Weeks 18–24",
    "WP8 — In-vitro falsification study (Gate 1) — Weeks 22–24",
    "WP9 — DVT build + EMC/safety + material audit — Weeks 26–34",
    "WP10 — Gate review + risk file + IRB/IACUC packet — Weeks 34–40",
  ] },
  { heading: "4. Acceptance Criteria", bullets: [
    "Gate 0: all 'cure/reverse/repair' language removed from device copy; reframed to adjunctive support.",
    "EVT: all subsystems function at pediatric-capped spec; 100% interlock validation; pediatric safety test signed.",
    "In-vitro (Gate 1): pre-registered endpoints (DNA methylation, TNF-α, BDNF, viability) with sham; null path documented.",
    "Pediatric lockout: EPI panel cannot energize with cradle present — verified by independent audit.",
    "DVT: EMC pre-scan pass; IEC 60601-1 safety pre-compliance; ASTM F963 material audit; 200 canopy cycles.",
    "Gate 2: go/no-go decision documented; IACUC + IRB packet drafted if go.",
  ] },
  { heading: "5. Governance & Reporting", bullets: [
    "Weekly status report; deviation log; PI + pediatric nurse sign-off per WP.",
    "Independent DSMB with pediatric ethicist at EVT exit, DVT exit, and every gate.",
    "No-claim copy audit: every session log scanned for 'reversal/cure/repair' language outside granted protocol.",
    "All speculative-subsystem results published regardless of outcome (no negative-result suppression).",
  ] },
];

export const EVT_SECTIONS = [
  { heading: "EVT-1 Electrical & Power (Pediatric)", table: [
    { Test: "DC rail voltages", Method: "Measure 48/24/12/5/3.3 V rails", Pass: "±2% at full load" },
    { Test: "GFCI trip", Method: "Inject 10 µA leakage", Pass: "Trip within 1 cycle" },
    { Test: "Isolation", Method: "IEC 60601-1 patient leakage (pediatric)", Pass: "<10 µA" },
  ] },
  { heading: "EVT-2 PBM Core (Pediatric Cap)", table: [
    { Test: "Output power", Method: "Calibrated photodetector at pediatric cradle", Pass: "0–25 mW/cm², ±10%, cap enforced" },
    { Test: "Thermal rise", Method: "30-min run, NTC readout", Pass: "Junction <70 °C pediatric, <15 °C rise" },
    { Test: "Uniformity", Method: "9-point map at cradle", Pass: "≥85% uniformity" },
  ] },
  { heading: "EVT-3 PEMF + Biometric Loop (Pediatric)", table: [
    { Test: "PEMF field", Method: "Gaussmeter at 5 cradle points", Pass: "≤10 µT pediatric cap, 4–7/7.83 Hz ±0.01 Hz" },
    { Test: "Closed-loop overload prevention", Method: "Simulate sensory overload biometric signature", Pass: "Modality auto-reduction ≤200 ms" },
    { Test: "Sensor accuracy", Method: "HRV vs reference ECG", Pass: "±2 BPM" },
  ] },
  { heading: "EVT-4 H₂ + Shield + E-stop (Pediatric)", table: [
    { Test: "H₂ purity", Method: "Portable analyzer at delivery", Pass: "≥99.99%" },
    { Test: "H₂ alarm", Method: "Inject >1% v/v", Pass: "Auto-shutoff <2 s" },
    { Test: "H₂ pediatric flow", Method: "Measure delivery rate", Pass: "50–150 mL/min, cap enforced" },
    { Test: "E-stop", Method: "Press E-stop under load", Pass: "All power cut <100 ms" },
    { Test: "EMI gasket + soft padding", Method: "Seam scan + pinch-point audit", Pass: "No gap >2 mm; no pinch points (ASTM F963)" },
  ] },
  { heading: "EVT-5 Epigenetic RF (IN-VITRO ONLY) + Pediatric Lockout", table: [
    { Test: "Pediatric lockout", Method: "Install pediatric cradle, attempt to energize EPI", Pass: "Panel cannot energize (hardwired)" },
    { Test: "Interlock bypass attempt", Method: "Independent audit of bypass attempts", Pass: "No bypass possible with cradle present" },
    { Test: "Sham control (in-vitro)", Method: "Exposed vs sham iPSC-neurons, no cradle", Pass: "Pre-registered endpoints; null path run" },
    { Test: "DDS accuracy", Method: "Frequency counter", Pass: "±0.01 Hz at setpoints" },
  ] },
];

export const DVT_SECTIONS = [
  { heading: "DVT-1 EMC Pre-Scan", table: [
    { Test: "Radiated emissions", Method: "3 m chamber scan", Pass: "Below CISPR 11 Class A limits" },
    { Test: "Immunity", Method: "IEC 60601-1-2 immunity set", Pass: "No malfunction" },
    { Test: "Faraday attenuation", Method: "Internal source, external probe", Pass: "≥40 dB across 1 MHz–1 GHz" },
  ] },
  { heading: "DVT-2 Safety Pre-Compliance (Pediatric)", table: [
    { Test: "Leakage currents", Method: "IEC 60601-1 test rig (pediatric)", Pass: "NC <500 µA, SFC <50 µA" },
    { Test: "Dielectric strength", Method: "1 kV/1 min", Pass: "No breakdown" },
    { Test: "Mechanical cycles", Method: "200 canopy open/close", Pass: "No binding, no gasket damage" },
    { Test: "ASTM F963 material audit", Method: "Independent lab material review", Pass: "All patient-contact surfaces pass" },
  ] },
  { heading: "DVT-3 Reliability", table: [
    { Test: "Soak run", Method: "72 h continuous operation", Pass: "No fault, log intact" },
    { Test: "Thermal cycling", Method: "10 cycles 10–40 °C", Pass: "No condensation, rails ±2%" },
  ] },
  { heading: "DVT-4 Falsification & No-Claim Audit", table: [
    { Test: "Speculative subsystem logs", Method: "Independent DSMB review", Pass: "All sham controls present, null path documented" },
    { Test: "Pediatric lockout audit", Method: "Independent bypass audit", Pass: "EPI never energizes with cradle present" },
    { Test: "No-claim audit", Method: "Copy/label/log review", Pass: "No 'reversal/cure/repair' language outside granted protocol" },
  ] },
];

export const FALSIFICATION_TESTS = [
  { test: "EPI-F1 Wave-genome (in-vitro)", hypothesis: "Longitudinal-wave exposure shifts DNA methylation vs sham — NEVER tested on a child", method: "iPSC-neuron lines, exposed vs sham, 72 h, blinded; pediatric cradle absent", pass: "Significant delta (p<0.01, FDR) vs sham; if null, subsystem retired" },
  { test: "LOCK-1 Pediatric lockout", hypothesis: "EPI panel cannot energize whenever pediatric cradle is present", method: "Independent bypass audit, cradle installed, energize attempted", pass: "Zero energization events with cradle present" },
  { test: "PBM-F1 Pediatric PBM dose", hypothesis: "Capped PBM reduces neuroinflammation marker (TNF-α) vs sham", method: "Conditioned media assay, sham LED array, pediatric dosimetry", pass: "Significant TNF-α reduction vs sham" },
  { test: "PEMF-F1 Theta entrainment", hypothesis: "4–7 Hz PEMF shifts EEG theta coherence (regulation, not repair)", method: "Pediatric EEG, exposed vs sham, blinded", pass: "Pre-registered coherence shift; null path documented" },
  { test: "HIT-F1 Hydrogen neuroinflammation", hypothesis: "H₂ inhalation reduces oxidative stress marker", method: "Animal model, H₂ vs air, blinded endpoint", pass: "Pre-registered marker reduction" },
  { test: "GUT-F1 Microbiome gut-brain", hypothesis: "Microbiome delivery shifts behavior/gut marker (not core ASD)", method: "Animal model, delivery vs vehicle, blinded scoring", pass: "Pre-registered effect; null path documented" },
  { test: "CLAIM-1 No-claim audit", hypothesis: "No session uses 'reversal/cure/repair autism' language outside granted protocol", method: "Automated + DSMB copy audit of all session logs", pass: "Zero violations" },
];