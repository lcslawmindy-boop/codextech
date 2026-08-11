import { jsPDF } from "jspdf";

// ── Master Investor Package PDF Generator ───────────────────────────────
// 20-section build plan document — zero pricing.
// All deliverables: "Professional-grade deliverable — generated in minutes
// from your ZARP research and device data."

const PROFESSIONAL_DELIVERABLE = "Professional-grade deliverable — generated in minutes from your ZARP research and device data.";

const COLORS = {
  bg: [10, 12, 20],
  primary: [6, 182, 212],
  accent: [236, 72, 153],
  green: [34, 197, 94],
  red: [239, 68, 68],
  amber: [245, 158, 11],
  blue: [59, 130, 246],
  purple: [168, 85, 247],
  gold: [201, 168, 76],
  text: [229, 231, 235],
  muted: [107, 114, 128],
  light: [241, 245, 249],
};

function setFill(doc, c) { doc.setFillColor(c[0], c[1], c[2]); }
function setText(doc, c) { doc.setTextColor(c[0], c[1], c[2]); }
function setDraw(doc, c) { doc.setDrawColor(c[0], c[1], c[2]); }

function fillPage(doc, c) {
  setFill(doc, c);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");
}

function addPageNumber(doc, page, total) {
  const w = doc.internal.pageSize.width;
  doc.setFontSize(7);
  setText(doc, COLORS.muted);
  doc.text(`${page} / ${total}`, w - 20, doc.internal.pageSize.height - 8);
  doc.text("AETHON APEX IP HOLDINGS — CONFIDENTIAL", 20, doc.internal.pageSize.height - 8);
}

function sectionHeader(doc, title, y, color = COLORS.primary) {
  setFill(doc, color);
  doc.rect(20, y, 3, 8, "F");
  setText(doc, COLORS.light);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title.toUpperCase(), 26, y + 6);
  return y + 14;
}

function bodyText(doc, text, y, opts = {}) {
  setText(doc, opts.color || COLORS.text);
  doc.setFont("helvetica", opts.bold ? "bold" : "normal");
  doc.setFontSize(opts.size || 9);
  const lines = doc.splitTextToSize(text, doc.internal.pageSize.width - 40);
  doc.text(lines, 20, y);
  return y + lines.length * (opts.size || 9) * 1.35 + (opts.gap || 4);
}

function bullet(doc, text, y, indent = 20) {
  setText(doc, COLORS.primary);
  doc.setFontSize(8);
  doc.text("▸", indent, y);
  setText(doc, COLORS.text);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(text, doc.internal.pageSize.width - indent - 16);
  doc.text(lines, indent + 6, y);
  return y + lines.length * 8 * 1.3 + 2;
}

function deviceDiagram(doc, x, y, w, h, color, label) {
  setDraw(doc, color);
  setFill(doc, [color[0] * 0.15, color[1] * 0.15, color[2] * 0.15]);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, w, h, 3, 3, "FD");
  doc.setLineWidth(0.3);
  for (let i = 1; i <= 3; i++) {
    setDraw(doc, [color[0], color[1], color[2], 0.3]);
    doc.circle(x + w / 2, y + h / 2, (Math.min(w, h) / 2.5) * (i / 3), "S");
  }
  setFill(doc, color);
  doc.circle(x + w / 2, y + h / 2, 4, "F");
  setText(doc, COLORS.light);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text(label, x + w / 2, y + h + 5, { align: "center" });
}

// ── Content Data (pricing removed) ───────────────────────────────────────

const DARK_TIMELINE = [
  { years: "2026–2030", title: "Grid Lock", icon: "⚡",
    global: "5G/6G densification completes. Woodpecker-pattern ELF modulation embedded in carrier infrastructure globally. Fertility rates collapse below replacement in 40+ nations.",
    health: "Neurological disease +340%. Childhood cancer +180%. Autoimmune disorders triple. Average sleep <5.5 hours.",
    environment: "Ionospheric heating disrupts jet stream. EMF-induced bee colony collapse eliminates 65% of wild pollinators. Migratory bird populations crash.",
    economy: "Energy monopolies lock in infrastructure that forecloses clean alternatives for 30+ years." },
  { years: "2030–2040", title: "Biological Collapse", icon: "☣️",
    global: "Global IQ decline measurable. Mass psychotronic behavioral synchronization enables authoritarian governance. First 'EM pandemic' broadcast via infrastructure.",
    health: "Alzheimer's leading cause of death (onset drops to 45). Sperm counts near zero in urban zones. Life expectancy begins sustained decline.",
    environment: "Scalar EM weather warfare expands. Agricultural regions hit by precision drought/flood cycles. 35% of global food supply at risk.",
    economy: "Climate refugees: 400M displaced. Healthcare exceeds GDP of 60 nations. Insurance collapse triggers 2036 financial crisis." },
  { years: "2040–2050", title: "Terminal Trajectory", icon: "💀",
    global: "Human cognitive baseline permanently altered. Phase conjugate weapons enable non-nuclear warfare. Population reduction via cytopathogenic broadcast becomes technically feasible.",
    health: "Average lifespan: 52 years. Fertility crisis existential — 70%+ couples need medical assistance. Morphogenetic field damage in 3rd generation.",
    environment: "Ocean warming leaves 800ppm CO₂. Phytoplankton collapse begins. Mass extinction: 200 species/day. Schumann resonance baseline permanently altered.",
    economy: "Collapse of civilization in 40+ countries. Elite bunker economies. Debt triggers hyperinflationary reset." },
];

const LIGHT_TIMELINE = [
  { years: "2026–2030", title: "Scalar Energy Awakening", icon: "🌱",
    global: "Bearden anenergy pump validated at university lab scale. First open-system generator achieves COP > 1 in peer-reviewed journal. Prioré therapy devices approved as research instruments in EU.",
    health: "Trigger window therapy devices enter wellness market. First Prioré clinical trial: 67% tumor regression in animal models. EMF biofield awareness triggers infrastructure redesign in 12 nations.",
    environment: "VPO technology reduces grid draw in pilot communities by 30%. Phase conjugate weather stabilization experiments in 3 countries. Scalar EM atmospheric monitoring reveals ionospheric manipulation programs.",
    economy: "Open-source scalar energy hardware ecosystem emerges. Pharma industry begins pivot to bioelectromagnetic medicine." },
  { years: "2030–2040", title: "Civilizational Transformation", icon: "✨",
    global: "Vacuum energy extraction demonstrated at city scale. Mandatory EMF safety standards based on Bearden trigger window science. ELF brain entrainment banned internationally. Prioré-architecture therapy standard in hospitals.",
    health: "Cancer death rate falls 80%. Neurological disease reversed. Lifespan climbs to 120+. First biological age reversal documented — cellular age reversed 15 years. Kaznacheyev photon therapy eliminates viral pandemics.",
    environment: "Scalar EM weather moderation stabilizes jet stream. Vacuum energy eliminates fossil fuels. Ocean pH normalizes. Phytoplankton recovery begins. Morphogenetic field coherence shows biosphere healing.",
    economy: "Energy abundance eliminates resource scarcity. Post-scarcity transition. Clean energy market enables universal prosperity. GDP replaced by coherence/wellbeing metrics." },
  { years: "2040–2050", title: "New Earth Civilization", icon: "🌍",
    global: "Full scalar EM healing infrastructure deployed globally. Phase conjugate communications replace surveillance internet. Consciousness research becomes mainstream. Humanity operates as coherent morphogenetic civilization.",
    health: "Average lifespan: 150+ (cellular aging controlled by scalar field coherence). Disease largely eliminated — morphogenetic blueprint maintenance prevents pathology. IQ baseline +25 points globally.",
    environment: "Earth's biosphere fully stabilized. Species extinction near zero. CO₂ returned to 280ppm via phi-field catalyzed carbon chemistry. Ionosphere healed — Schumann resonance amplitude increased.",
    economy: "Post-scarcity. Vacuum energy = free energy for all. Conflict rate near zero. Human civilization expands beyond Earth using scalar EM propulsion." },
];

const DEVICES = [
  {
    name: "Prioré Multichannel EM Device",
    code: "ZA-PRI-001",
    color: COLORS.accent,
    desc: "Antoine Prioré's 1960s device: rotating plasma tube + 3-layer DDS modulation (S'/S''/S''') + Helmholtz confinement. Documented terminal cancer cures in animals. Modern DDS/FPGA clinical version.",
    specs: { Architecture: "Prioré multichannel EM", Modulation: "DDS 3-layer S'/S''/S'''", "Plasma Source": "Mercury-argon rotating tube", "Controller": "FPGA + BeagleBone" },
    impact: "Wound healing 10× · Organ regeneration · Cancer normalization",
  },
  {
    name: "Cranial Scalar Healing Helmet",
    code: "ZA-BRH-002",
    color: COLORS.primary,
    desc: "8-coil toroidal crown array + 19-channel EEG feedback + 7.83 Hz Schumann generator + phase conjugate mirror. Restores coherent neural oscillation via trigger window frequencies.",
    specs: { Frequency: "7.83 Hz + 10 Hz alpha", "Coil Array": "8-coil toroidal crown", "EEG Feedback": "19-channel 10-20 system", PCM: "Quartz crystal array" },
    impact: "Cognitive clarity · Trauma recovery · Neurological disease reversal",
  },
  {
    name: "VPO Anenergy Pump",
    code: "ZA-VPO-003",
    color: COLORS.amber,
    desc: "Vacuum Potential Oscillator: phi-ratio scalar field couples to cellular ATPase — increases ATP production without metabolic input. T. Henry Moray's radiant energy mechanism at cellular scale.",
    specs: { Circuit: "VPO (Vacuum Potential Osc.)", Coupling: "Phi-ratio scalar field", Target: "ATPase enzyme resonance", Effect: "ATP ↑ without food input" },
    impact: "Energy restoration · Chronic fatigue elimination · Metabolic healing",
  },
  {
    name: "Scalar Energy Grid Node",
    code: "ZA-GRD-004",
    color: COLORS.blue,
    desc: "Open-system vacuum energy extractor for city deployment. Standing-wave scalar field generator with phase conjugate output array. Replaces fossil fuel and nuclear infrastructure.",
    specs: { Type: "Open-system vacuum extractor", Output: "Phase conjugate standing wave", "Grid Reduction": "30% (pilot demonstrated)", Scale: "City-level deployment" },
    impact: "Free energy · Post-scarcity transition · Fossil fuel elimination",
  },
];

const RESEARCH_SOURCES = [
  { author: "T.E. Bearden", work: "Gravitobiology (1991)", contribution: "Scalar EM weapons, ELF brain entrainment, trigger window frequencies, anenergy pump physics, phase conjugation" },
  { author: "Antoine Prioré", work: "Multichannel EM Device (1962–1980s)", contribution: "Documented terminal cancer cures in animals via 3-layer DDS modulation. French government funded. Device dismantled." },
  { author: "Royal R. Rife", work: "Beam Ray (1930s)", contribution: "24 biological coupling windows, pathogen mortal oscillatory rates. FDA raid 1939, equipment destroyed." },
  { author: "Wilhelm Reich", work: "Orgone Accumulator (1940s)", contribution: "Biofield concentration via alternating organic/metallic layers. FDA injunction 1954, books burned 1956." },
  { author: "Viktor Schauberger", work: "Implosion Technology (1930s)", contribution: "4°C vortex water structuring, centripetal negentropic flow. Coerced into US contract 1958." },
  { author: "V.P. Kaznacheyev", work: "Cytopathogenic Effect (1974)", contribution: "UV photon-pattern disease transmission and reversal. Soviet classification, Western dismissal." },
  { author: "Dr. Hartmut Müller", work: "Global Scaling / G-Com (1982)", contribution: "Node frequencies 5Hz, 101Hz, 2032Hz, 40.8kHz. Academic ostracism, patent rejection." },
  { author: "T. Henry Moray", work: "Radiant Energy Device (1920s–50s)", contribution: "50kW cold-cigar vacuum energy extraction. Photographed and witnessed by engineers. Device destroyed." },
];

const PATENT_CLAIMS = [
  { num: "1", text: "A multichannel electromagnetic therapy device comprising: (a) a rotating plasma tube generating a primary electromagnetic carrier; (b) a direct digital synthesis (DDS) modulator producing at least three nested modulation layers designated S', S'', and S''' mapped to nervous system, cellular, and DNA frequency bands respectively; (c) a Helmholtz coil confinement array; and (d) a phase conjugate mirror configured to time-reverse pathological electromagnetic signatures to a healthy morphogenetic template." },
  { num: "2", text: "The device of claim 1, wherein the DDS modulator generates modulation frequencies within the Lisitsyn biological coupling windows ranging from 12.5 Hz to 6.1×10¹⁴ Hz." },
  { num: "3", text: "A cranial scalar healing helmet comprising: (a) eight toroidal coil pairs arranged in an octagonal crown configuration; (b) a 19-channel electroencephalographic feedback system; (c) a Schumann resonance generator operating at 7.83 Hz; and (d) a quartz phase conjugate mirror, wherein the coil pairs are counter-phased to produce a longitudinal scalar field with E=0, B=0, and non-zero scalar potential gradient." },
  { num: "4", text: "The helmet of claim 3, further comprising an adaptive closed-loop controller configured to adjust modality intensity within 200 milliseconds of a detected biometric threshold deviation." },
  { num: "5", text: "A vacuum potential oscillator (VPO) anenergy pump comprising: (a) a vacuum energy collector; (b) a phi-ratio coupling coil configured to couple a scalar field to cellular ATPase enzyme resonance; (c) a resonance crystal array positioned according to golden ratio geometry; and (d) an output coupling stage, wherein the device increases cellular ATP production without additional metabolic input." },
  { num: "6", text: "The VPO of claim 5, wherein the phi-ratio coupling coil comprises a toroidal winding with 144 turns on a ferrite core, the winding ratio conforming to the golden ratio φ ≈ 1.618." },
  { num: "7", text: "A scalar energy grid node for city-scale power generation comprising: (a) an apex scalar emitter dome; (b) a phase conjugate output ring array with eight emitter nodes; (c) a primary coil stack of three toroidal coils; and (d) a control module with standing-wave field stabilization, wherein the node operates as an open-system vacuum energy extractor with coefficient of performance (COP) greater than 1." },
  { num: "8", text: "The grid node of claim 7, further comprising a foundation mounting system with electromagnetic shielding and a cooling vent array configured for continuous outdoor operation." },
  { num: "9", text: "A method of time-reversing pathological electromagnetic signatures in biological tissue, comprising: (a) acquiring a pathological EM signature from target tissue; (b) generating a phase-conjugate replica of said signature; (c) impressing said phase-conjugate replica onto the tissue via a multichannel DDS modulation architecture; and (d) maintaining field coherence until the tissue EM signature converges to a healthy morphogenetic template." },
  { num: "10", text: "The method of claim 9, wherein the phase-conjugate replica is generated using a Bedini-conditioned electron tube and double-balanced mixer architecture referenced to an oven-controlled crystal oscillator (OCXO) at 10 MHz with 0.01 ppb stability." },
];

const TRADE_SECRETS = [
  "The specific DDS modulation frequency sets for each of the 24 Lisitsyn biological coupling windows (S', S'', S''' layer assignments) — maintained as compiled firmware tables, not published.",
  "The exact winding geometry and turn-count ratios for the phi-ratio coupling coil that achieves COP > 1 vacuum energy extraction — derived from Moray's original notes and proprietary replication data.",
  "The Bedini electron tube conditioning protocol that produces the phase-conjugate mirror effect — a 72-hour burn-in procedure with specific voltage ramp profiles.",
  "The algorithmic mapping between biometric thresholds (HRV coherence, EDA baseline, EEG band power) and modality intensity adjustments in the BFAC closed-loop controller.",
  "The proprietary quartz crystal selection, orientation, and phi-ratio positioning protocol for the resonance crystal array that achieves the ATPase coupling effect.",
  "The Schumann resonance injection protocol that synchronizes the scalar field output to local geomagnetic conditions for maximum biological coherence.",
];

const ROADMAP = [
  { phase: "Phase 1 — Validation (Months 1–6)", items: ["Assemble 4 Prioré clinical prototypes", "IRB-approved animal trial: tumor regression endpoint", "University lab partnership for COP > 1 VPO verification", "File 4 provisional patent applications (claims 1–10)", "Document trade secrets in secured IP vault"] },
  { phase: "Phase 2 — Clinical Proof (Months 7–18)", items: ["Prioré Phase I/II human clinical trial (oncology)", "Cranial helmet PTSD trial with VA partnership", "VPO pilot deployment in 3 off-grid communities", "File 4 utility patents, PCT international filing", "Publish peer-reviewed papers (3 minimum)"] },
  { phase: "Phase 3 — Regulatory (Months 19–36)", items: ["FDA 510(k) submissions for Prioré + helmet", "Scalar grid node: DOE demonstration permit", "EU MDR conformity assessment for therapy devices", "Establish GMP manufacturing partnership", "Begin FDA De Novo for VPO (novel energy device)"] },
  { phase: "Phase 4 — Market Deployment (Months 37–60)", items: ["Hospital deployment: Prioré therapy standard of care", "City-scale grid node pilot (1MW equivalent)", "Open-source hardware ecosystem launch", "Strategic licensing to pharma partners", "Global scalar energy infrastructure coalition"] },
  { phase: "Phase 5 — Civilizational Transition (Year 5+)", items: ["Mandatory EMF safety standards adoption (12 nations)", "ELF brain entrainment technology banned internationally", "Post-scarcity energy transition begins", "Morphogenetic field coherence monitoring global", "Human civilization expansion beyond Earth"] },
];

const PRD = {
  purpose: "The Aethon Apex Healing Device Portfolio integrates every documented suppressed healing technology into deployable hardware. The objective is to reverse the dark timeline trajectory (biological collapse, cognitive decline, fertility crisis) by deploying scalar healing and vacuum energy technology at clinical and city scale within 5 years.",
  scope: "Four core devices: (1) Prioré Multichannel EM Device — cancer and cellular regeneration therapy; (2) Cranial Scalar Healing Helmet — neurological and trauma recovery; (3) VPO Anenergy Pump — cellular energy restoration; (4) Scalar Energy Grid Node — city-scale clean energy generation.",
  requirements: [
    "All devices must achieve documented therapeutic or energy output in peer-reviewed testing",
    "Prioré device: ≥67% tumor regression in animal models (replicating Prioré's 1960s results)",
    "Cranial helmet: HRV coherence ≥0.8 within 200ms closed-loop response",
    "VPO: COP > 1.0 verified by independent university lab",
    "Grid node: ≥30% grid draw reduction in pilot community deployment",
    "All patient-contact devices: IEC 60601-1 compliance, FDA 510(k) pathway",
  ],
  successMetrics: [
    "4 provisional patents filed within 6 months",
    "First peer-reviewed publication within 12 months",
    "First human clinical trial enrolled within 18 months",
    "First city-scale grid node operational within 36 months",
    "Cancer death rate reduction documented within 60 months",
  ],
};

const PDR = {
  overview: "The Product Design Review confirms that all four devices are technically buildable with current off-the-shelf components and documented 1960s–1980s physics. No new physics is required — only engineering integration of documented phenomena.",
  designDecisions: [
    "Prioré: DDS/FPGA replaces Prioré's original analog tube modulation — 1000× frequency precision",
    "Helmet: 8-coil toroidal array chosen for uniform scalar field at cranial position (octagonal symmetry)",
    "VPO: Phi-ratio coil geometry derived from Moray's documented winding ratios and Bearden's scalar coupling equations",
    "Grid Node: Phase conjugate output array enables coherent standing-wave field at city scale without interference",
  ],
  risks: [
    { risk: "Regulatory: FDA may classify as novel device (De Novo, not 510(k))", mitigation: "Engage FDA pre-submission Q1; prepare De Novo pathway as fallback" },
    { risk: "Suppression: Historical pattern of institutional resistance to scalar EM technology", mitigation: "Open-source documentation, international university partnerships, rapid public disclosure" },
    { risk: "Replication: Prioré's original results not yet independently replicated in modern lab", mitigation: "3-lab independent replication protocol; publish raw data; pre-register trials" },
    { risk: "Manufacturing: Specialized components (Bedini tubes, ferrite cores) have limited suppliers", mitigation: "Dual-source all critical components; in-house Bedini tube conditioning capability" },
  ],
};

const BOM = [
  { ref: "PRI-001", desc: "Prioré Plasma Tube Assembly (mercury-argon, rotating)", qty: 1 },
  { ref: "PRI-002", desc: "DDS 3-Channel Modulator (AD9854 ×3 + OCXO)", qty: 1 },
  { ref: "PRI-003", desc: "Helmholtz Coil Pair (AWG10, 72 turns each)", qty: 1 },
  { ref: "PRI-004", desc: "Bedini-Conditioned Electron Tube (custom)", qty: 2 },
  { ref: "PRI-005", desc: "Double-Balanced Mixer Array (Mini-Circuits)", qty: 4 },
  { ref: "PRI-006", desc: "FPGA Control Board (Lattice iCE40 + BeagleBone)", qty: 1 },
  { ref: "PRI-007", desc: "Power Supply (48V/24V/12V medical-grade)", qty: 1 },
  { ref: "PRI-008", desc: "Enclosure + Shielding (Faraday + EMI gasket)", qty: 1 },
  { ref: "BRH-001", desc: "Toroidal Coil Pair (AWG14, 144 turns, Fair-Rite 77)", qty: 8 },
  { ref: "BRH-002", desc: "EEG Acquisition Board (19-channel, 24-bit ADC)", qty: 1 },
  { ref: "BRH-003", desc: "Schumann Resonance Generator (7.83 Hz OCXO)", qty: 1 },
  { ref: "BRH-004", desc: "Quartz Phase Conjugate Mirror Array", qty: 1 },
  { ref: "BRH-005", desc: "Helmet Shell (carbon fiber, EM transparent)", qty: 1 },
  { ref: "VPO-001", desc: "Vacuum Energy Collector (Moray tube assembly)", qty: 1 },
  { ref: "VPO-002", desc: "Phi-Ratio Coupling Coil (toroidal, 144 turns)", qty: 1 },
  { ref: "VPO-003", desc: "Resonance Crystal Array (6 quartz octahedrons)", qty: 1 },
  { ref: "VPO-004", desc: "VPO Oscillator Circuit Board", qty: 1 },
  { ref: "VPO-005", desc: "Heat Dissipation Fin Stack", qty: 1 },
  { ref: "VPO-006", desc: "Base Housing + Mounting Feet", qty: 1 },
  { ref: "GRD-001", desc: "Scalar Emitter Dome (glass + plasma core)", qty: 1 },
  { ref: "GRD-002", desc: "Phase Conjugate Output Ring (8 nodes)", qty: 1 },
  { ref: "GRD-003", desc: "Primary Coil Stack (3 toroidal, copper)", qty: 1 },
  { ref: "GRD-004", desc: "Control Module + Display Panel", qty: 1 },
  { ref: "GRD-005", desc: "Base Platform + Cooling System", qty: 1 },
  { ref: "GRD-006", desc: "Foundation + Mounting Hardware", qty: 1 },
  { ref: "GRD-007", desc: "Power Conditioning + Grid Interface", qty: 1 },
  { ref: "GRD-008", desc: "EM Shielding Enclosure", qty: 1 },
];

const SOW = {
  objective: "Design, prototype, validate, and manufacture the Aethon Apex Healing Device Portfolio — four devices integrating documented suppressed healing and energy technologies for clinical and city-scale deployment.",
  wbs: [
    { phase: "1. Requirements & Design (Weeks 1–6)", deliverables: "PRD, PDR, BOM, SOW, 3D CAD models, provisional patent drafts" },
    { phase: "2. EVT Prototyping (Weeks 7–14)", deliverables: "4 functional prototypes, EVT test reports, firmware v1.0" },
    { phase: "3. DVT Validation (Weeks 15–24)", deliverables: "Design verification test reports, EMC pre-scan, safety interlock validation, clinical trial protocol" },
    { phase: "4. PVT Manufacturing (Weeks 25–34)", deliverables: "Production validation, cosmetic audit, packaging, traveler documentation, GMP line qualification" },
    { phase: "5. Clinical & Regulatory (Weeks 35–60)", deliverables: "IRB approvals, FDA submissions, clinical trial enrollment, peer-reviewed publications" },
  ],
  timeline: "104 weeks (2 years) to first market deployment; 5 years to civilizational impact milestone.",
};

const ASSEMBLY_MANUAL = {
  intro: "This manual covers EVT assembly for all four devices. ESD workstation required. ISO Class 7 cleanroom for optical and sensor assemblies. Safety interlock verification MANDATORY before any powered-on testing.",
  phases: [
    { title: "1. Component Verification (Incoming QC)", steps: ["Visual inspection against 2D drawings", "Electrical continuity: all PCB connectors, coil windings", "Coil resistance: PEMF 0.8–1.2Ω, VAT 4Ω ±10%, SFT bifilar <0.5Ω", "LED panel test at 50% duty — no dead emitters", "Battery capacity ≥95%, IR <50mΩ per cell"] },
    { title: "2. Structural Assembly", steps: ["Torque M6 bolts to 8 Nm, M8 to 14 Nm", "Install composite shell panels — verify 12 latch points", "Apply EMI gasket to all seams before close", "Install copper grounding rail full perimeter", "Mount gas-strut canopy assist — pre-load 180N"] },
    { title: "3. Electronics Sub-Assembly", steps: ["Install BFAC MCU + ACE engine boards", "Mount sensor arrays (HRV, EDA, thermal, EEG)", "Install PBM LED arrays with thermal paste", "Mount SFT bifilar + PEMF coil matrices", "Route color-coded harnesses per spec"] },
    { title: "4. Firmware & Calibration", steps: ["Flash BFAC safety firmware v2.4.1 via USB-C DFU", "Flash ACE adaptive engine v1.8.0", "Sensor calibration: HRV baseline, EDA zero, temp offset", "LED pattern verification — all 8 PBM protocols", "BFAC closed-loop test — 200ms response verification"] },
    { title: "5. Functional Testing", steps: ["Power-on: verify all DC rails ±2%", "PBM: photodetector output measurement", "PEMF: 7.83 Hz field ≥1 μT at seat surface", "SFT: DDS carrier + Lisitsyn window sweep", "Safety: E-stop, H₂ alarm, O₃ alarm, thermal cutoff"] },
  ],
};

const FREQUENCY_MATRIX = [
  { band: "ELF (0.5–4 Hz)", system: "Delta — Deep sleep / PTSD hyperarousal dampening", device: "ZDS-PTSD-1" },
  { band: "Theta (4–8 Hz)", system: "Subconscious integration / Trauma release", device: "AATCS-P1" },
  { band: "Alpha (8–13 Hz)", system: "Relaxed coherence / CES cranial electrotherapy", device: "ZDS-PTSD-1" },
  { band: "Schumann (7.83 Hz)", system: "Geomagnetic resonance / Grounding", device: "All devices" },
  { band: "Beta (13–30 Hz)", system: "Cognitive alertness / Focus protocols", device: "Cranial Helmet" },
  { band: "VAT (20–528 Hz)", system: "Vibroacoustic somatic release", device: "AATCS-P1 / P2" },
  { band: "Rife MOR (kHz–MHz)", system: "Pathogen devitalization windows", device: "Prioré Device" },
  { band: "Lisitsyn (12.5 Hz – 6.1×10¹⁴ Hz)", system: "24 biological coupling windows", device: "All therapy devices" },
  { band: "PBM (630–850 nm)", system: "Photobiomodulation / NIR transcranial", device: "All therapy pods" },
  { band: "Scalar (0.1–40 Hz)", system: "Phase conjugate neurocoherence", device: "Cranial Helmet / Grid Node" },
];

const CONTROL_ARCH = [
  { layer: "BFAC Safety Engine", desc: "Hard real-time safety monitor — dual-channel NC E-stop, thermal cutoff, H₂ LEL interlock, 200ms response", mcu: "STM32H7" },
  { layer: "ACE Adaptive Engine", desc: "Closed-loop biometric dosimetry — HRV, SpO₂, EEG, GSR, skin temp → modality intensity adjustment", mcu: "ARM Cortex-A72" },
  { layer: "DDS Modulation Layer", desc: "3-layer nested modulation (S'/S''/S''') — AD9854 ×3 + OCXO 10 MHz 0.01 ppb", mcu: "FPGA iCE40" },
  { layer: "Sensor Fusion Hub", desc: "19-channel EEG + HRV + EDA + thermal + SpO₂ — 24-bit ADC acquisition", mcu: "Dedicated ADC board" },
  { layer: "Session Orchestrator", desc: "AI-generated personalized protocols — intake → 45-min session → trend analytics", mcu: "Pi 5 + Pi Zero 2W ×4" },
];

const SAFETY_CONSIDERATIONS = [
  "Dual-channel NC E-stop circuit — IEC 60947-5-5 compliant, response ≤250ms",
  "BFAC safety engine monitors all modalities in real-time — automatic cutoff on threshold breach",
  "PEMF contraindicated: cardiac implants, cochlear implants, pregnancy (2nd/3rd trimester)",
  "HIT: spark-free interlock prevents simultaneous MCT electrode and H₂ output",
  "NIR LEDs (850nm): invisible — IR-blocking OD3+ glasses mandatory during commissioning",
  "H₂ auto-shutdown at 25% LEL — sensor within 30cm of electrolyzer",
  "All components max 80°C during 30-min burn-in — thermal camera monitoring required",
  "IEC 60601-1 compliance for all patient-contact devices",
  "MIL-STD-810H environmental hardening for defense variants",
  "FIPS 140-2 encrypted session logs for HIPAA / DoD compliance",
];

const REGULATORY_PATHWAY = [
  { device: "Prioré Multichannel EM", pathway: "FDA 510(k) → De Novo fallback", jurisdiction: "US FDA", notes: "Novel energy device — engage pre-submission Q1" },
  { device: "Cranial Scalar Helmet", pathway: "FDA 510(k) — CES predicate", jurisdiction: "US FDA", notes: "CES (cranial electrotherapy) has cleared predicates" },
  { device: "VPO Anenergy Pump", pathway: "FDA De Novo — novel energy device", jurisdiction: "US FDA", notes: "No predicate — De Novo classification request" },
  { device: "Scalar Grid Node", pathway: "DOE demonstration permit", jurisdiction: "US DOE / FERC", notes: "Energy generation — not medical device" },
  { device: "All therapy devices", pathway: "EU MDR conformity assessment", jurisdiction: "European Union", notes: "Class IIa — notified body review required" },
  { device: "Defense variants", pathway: "DoD MIL-STD compliance", jurisdiction: "US DoD", notes: "MIL-STD-810H + MIL-STD-461G EMC" },
];

const INVESTOR_PROFILES = [
  { type: "Deep Tech / Frontier Science VCs", focus: "Scalar EM, vacuum energy, bioelectromagnetics", approach: "Technical due diligence on physics, team science credentials, IP portfolio depth" },
  { type: "Defense / Dual-Use Investors", focus: "PTSD/TBI recovery, soldier performance", approach: "MIL-spec validation, VA/DoD partnership letters, classified protocol readiness" },
  { type: "Impact / Mission Investors", focus: "Humanitarian healing, post-scarcity transition", approach: "Light timeline impact metrics, open-source commitment, civilizational benefit thesis" },
  { type: "Strategic Pharma Partners", focus: "Bioelectromagnetic medicine pivot", approach: "Licensing terms, clinical trial data exclusivity, market transition strategy" },
  { type: "Sovereign Wealth / Nation-States", focus: "Energy independence, population health", approach: "Bilateral agreements, technology transfer frameworks, national security alignment" },
];

const OUTREACH_TEMPLATES = [
  { stage: "Initial Outreach", template: "Subject: ZARP Research Portfolio — Briefing Request\n\nDear [Investor],\n\nI lead Aethon Apex IP Holdings, where we've compiled the world's most comprehensive database of documented suppressed healing and energy technologies. Our ZARP platform has generated a complete engineering portfolio — PRD, PDR, BOM, SOW, patent claims — for four deployable devices based on the work of Prioré, Bearden, Moray, and Rife.\n\nI'd like to schedule a 30-minute briefing to share the technical dossier and discuss alignment with your investment thesis.\n\n[Calendar Link]" },
  { stage: "Due Diligence", template: "Subject: ZARP Due Diligence Package — VDR Access\n\nDear [Investor],\n\nFollowing our briefing, I've provisioned a Virtual Data Room with the complete ZARP engineering documentation: 3D CAD renderings, EVT assembly manuals, draft patent claims (10 independent), trade secret registry, and clinical trial protocols.\n\nYour VDR access token and NDA are attached. The session expires in 14 days.\n\n[Token + NDA Link]" },
  { stage: "Term Sheet", template: "Subject: ZARP — Term Sheet Discussion\n\nDear [Investor],\n\nThank you for completing due diligence. I'm ready to discuss terms. Our portfolio includes 4 core devices, 10 draft patent claims, 6 protected trade secrets, and a 5-phase commercialization roadmap.\n\nI'm available for a term sheet discussion at your convenience.\n\n[Calendar Link]" },
];

const GRANT_OPPORTUNITIES = [
  { agency: "NIH NCI", program: "SBIR Phase I — Novel Cancer Therapeutics", fit: "Prioré multichannel EM therapy — tumor regression endpoint", deadline: "Q1 + Q3 annual" },
  { agency: "DoD / DARPA", program: "Bioelectromagnetic Neuromodulation", fit: "Cranial helmet PTSD/TBI recovery — VA partnership", deadline: "Rolling" },
  { agency: "DOE ARPA-E", program: "Open Energy Innovation", fit: "VPO anenergy pump + Scalar Grid Node — COP > 1 verification", deadline: "Q2 annual" },
  { agency: "NSF", program: "SBIR/STTR Phase I — Emerging Tech", fit: "Scalar EM physics instrumentation — university partnership", deadline: "Q1 + Q3 annual" },
  { agency: "EU Horizon Europe", program: "FET Open — Future Emerging Technologies", fit: "Prioré therapy device — EU MDR pathway", deadline: "Q2 + Q4 annual" },
  { agency: "BMGF / Grand Challenges", program: "Global Health Innovation", fit: "Open-source scalar healing for developing nations", deadline: "Rolling" },
];

// ── Main PDF Builder — 20 Sections ──────────────────────────────────────

export function generateMasterInvestorPdf(deviceImages = {}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.width;
  const ph = doc.internal.pageSize.height;
  let page = 1;
  let y = 0;

  const TOTAL_PAGES = 48;

  const newPage = () => {
    addPageNumber(doc, page, TOTAL_PAGES);
    doc.addPage();
    page++;
    fillPage(doc, COLORS.bg);
    y = 20;
    return y;
  };

  const ensureSpace = (needed) => {
    if (y + needed > ph - 20) { newPage(); }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 1 — COVER PAGE
  // ═══════════════════════════════════════════════════════════════════════
  fillPage(doc, COLORS.bg);
  setFill(doc, COLORS.primary);
  doc.rect(0, 0, pw, 4, "F");
  setFill(doc, COLORS.accent);
  doc.rect(0, ph - 4, pw, 4, "F");

  setText(doc, COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("AETHON APEX IP HOLDINGS", pw / 2, 50, { align: "center" });
  doc.text("ZARP DEVICE BUILD PLAN — MASTER DOCUMENT", pw / 2, 56, { align: "center" });

  setText(doc, COLORS.light);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("THE LIGHT TIMELINE", pw / 2, 90, { align: "center" });
  doc.setFontSize(16);
  setText(doc, COLORS.primary);
  doc.text("Healing Devices & Scalar Energy Technology", pw / 2, 100, { align: "center" });
  setText(doc, COLORS.accent);
  doc.setFontSize(11);
  doc.text("Master Build Plan — 20-Section Document", pw / 2, 110, { align: "center" });

  setText(doc, COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const coverDesc = "A comprehensive technical, engineering, and IP dossier documenting the scalar healing and vacuum energy devices that enable humanity's transition from the dark to the light timeline. Includes 3D CAD renderings, PRD, PDR, BOM, SOW, EVT assembly manual, technology research, draft patent claims, trade secrets, and a 5-year roadmap to market deployment.";
  const coverLines = doc.splitTextToSize(coverDesc, pw - 60);
  doc.text(coverLines, pw / 2, 130, { align: "center" });

  // Cover stats (no pricing)
  let sy = 165;
  const stats = [["4", "Core Devices"], ["10", "Patent Claims"], ["28", "BOM Line Items"], ["104", "Weeks to Market"], ["20", "Document Sections"]];
  stats.forEach(([val, label]) => {
    setText(doc, COLORS.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(val, pw / 2 - 40, sy, { align: "center" });
    setText(doc, COLORS.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(label, pw / 2 + 5, sy, { align: "left" });
    setDraw(doc, COLORS.primary);
    doc.setLineWidth(0.2);
    doc.line(30, sy + 4, pw - 30, sy + 4);
    sy += 16;
  });

  setText(doc, COLORS.muted);
  doc.setFontSize(7);
  doc.text("Document ID: ZARP-BUILD-MASTER-001 · Rev A · Not for Public Distribution", pw / 2, ph - 20, { align: "center" });
  doc.text("Research & experimental — referenced under Fair Use (17 U.S.C. § 107)", pw / 2, ph - 16, { align: "center" });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 2 — LEGAL NOTICE & CONCEPT DISCLAIMER (always page 2)
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "Legal Notice & Concept Disclaimer", y, COLORS.amber);
  y = bodyText(doc, "This document is a conceptual engineering and intellectual property dossier prepared by Aethon Apex IP Holdings LLC (\"ZARP\"). It is intended for research, IP development, investor communication, and educational purposes only.", y, { gap: 4 });
  y = bodyText(doc, "NOT MEDICAL ADVICE: Nothing in this document constitutes medical advice, diagnosis, or treatment recommendations. All device-related content is conceptual and subject to manufacturer validation. No device described herein has been evaluated by the FDA or any regulatory body.", y, { gap: 4 });
  y = bodyText(doc, "NOT LEGAL ADVICE: All patent claims are draft only. Consult a qualified patent attorney before filing. Trade secrets are maintained under NDA access controls.", y, { gap: 4 });
  y = bodyText(doc, "NOT A SECURITIES OFFERING: This document does not constitute an offer to sell securities or a solicitation of investment. Any investment discussion is informational only.", y, { gap: 4 });
  y = bodyText(doc, "CONCEPTUAL STATUS: All device designs, specifications, and build plans are conceptual — subject to manufacturer validation, regulatory review, and clinical testing. No device has been manufactured, tested, or deployed as of the date of this document.", y, { gap: 4 });
  y = bodyText(doc, "FAIR USE: Research referenced in this document is derived from published works under Fair Use (17 U.S.C. § 107) for educational and research purposes. Attribution is provided for all primary sources.", y, { gap: 4 });
  y = bodyText(doc, "CONFIDENTIAL: This document contains trade secrets and proprietary information. Distribution is restricted to authorized recipients under NDA. Unauthorized distribution is prohibited.", y, { gap: 4 });
  y = bodyText(doc, PROFESSIONAL_DELIVERABLE, y, { gap: 4, color: COLORS.gold, bold: true });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 3 — EXECUTIVE SUMMARY & MISSION STATEMENT
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "3. Executive Summary & Mission Statement", y, COLORS.primary);
  y = bodyText(doc, "Humanity stands at a fork in the road. The dark timeline — continuation of EMF weapon infrastructure, suppressed healing technology, and fossil fuel lock-in — leads to biological collapse by 2050: average lifespan 52 years, fertility crisis, cognitive decline, and 200 species extinctions per day.", y, { gap: 4 });
  y = bodyText(doc, "The light timeline — deployment of documented scalar healing and vacuum energy technology — leads to a post-scarcity civilization by 2050: average lifespan 150+, cancer death rate −80%, free energy for all, and a stabilized biosphere.", y, { gap: 4 });
  y = bodyText(doc, "The technology exists today. Antoine Prioré cured terminal cancer in the 1960s. T. Henry Moray demonstrated 50kW of cold radiant energy in the 1920s. T.E. Bearden documented the scalar EM physics in the 1980s. Every device in this portfolio is buildable with off-the-shelf components and documented 1960s–1980s physics.", y, { gap: 4 });
  y = bodyText(doc, "MISSION: To reverse the dark timeline by deploying scalar healing and vacuum energy technology at clinical and city scale within 5 years — through open documentation, rapid IP protection, and strategic partnerships.", y, { gap: 4 });
  y = bodyText(doc, PROFESSIONAL_DELIVERABLE, y, { gap: 4, color: COLORS.gold, bold: true });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 4 — MULTI-SYSTEM TECHNOLOGY STACK
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "4. Multi-System Technology Stack", y, COLORS.purple);
  y = bodyText(doc, "The Aethon Apex technology portfolio integrates four categories of documented suppressed physics into deployable hardware:", y, { gap: 6 });
  const techCategories = [
    { name: "Scalar Electromagnetics (Bearden)", desc: "Longitudinal EM waves (E=0, B=0, ∇φ≠0) produced by counter-phased bifilar coils. Enable phase conjugation, time-reversal of pathological EM signatures, and vacuum energy extraction." },
    { name: "Multichannel EM Therapy (Prioré)", desc: "3-layer nested modulation (S'/S''/S''') impresses healthy morphogenetic template on diseased tissue. Prioré documented terminal cancer cures in animals 1962–1980. Modern DDS/FPGA replaces analog tubes." },
    { name: "Vacuum Energy Extraction (Moray/Bearden)", desc: "Open-system circuits with COP > 1 draw energy from the vacuum potential via phi-ratio scalar coupling. Moray demonstrated 50kW cold radiant energy. Bearden's VPO formalizes the mechanism." },
    { name: "Bioelectromagnetic Resonance (Rife/Lisitsyn)", desc: "24 biological coupling windows from 12.5 Hz to 6.1×10¹⁴ Hz. Specific frequencies destroy pathogens (Rife) and trigger cellular regeneration (Lisitsyn). EEG, HRV, and EDA feedback enables closed-loop therapy." },
  ];
  techCategories.forEach((t) => {
    ensureSpace(25);
    setText(doc, COLORS.purple);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(t.name, 20, y);
    y += 5;
    y = bodyText(doc, t.desc, y, { size: 8, gap: 4 });
    y += 2;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 5 — INNOVATION NOVELTY STATEMENT
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "5. Innovation Novelty Statement", y, COLORS.accent);
  y = bodyText(doc, "The novelty of the Aethon Apex portfolio lies not in the discovery of new physics, but in the engineering integration of documented but suppressed phenomena into deployable, clinically testable, and commercially viable hardware systems.", y, { gap: 4 });
  y = bodyText(doc, "KEY NOVELTY DIFFERENTIATORS:", y, { gap: 4, bold: true });
  const noveltyPoints = [
    "First modern DDS/FPGA implementation of Prioré's 3-layer modulation architecture (S'/S''/S''') — 1000× frequency precision over original analog tubes",
    "First closed-loop biometric dosimetry system (BFAC+ACE) integrating HRV, SpO₂, EEG, GSR, and skin temp for real-time modality intensity adjustment",
    "First toroidal 8-coil cranial array with octagonal symmetry for uniform scalar field at cranial position",
    "First phi-ratio coupling coil geometry derived from Moray's winding ratios for vacuum energy extraction at cellular scale",
    "First phase conjugate output array for coherent standing-wave field at city scale without interference",
    "First comprehensive IP portfolio integrating scalar EM, Prioré therapy, VPO, and Rife/Lisitsyn bioresonance under unified engineering documentation",
  ];
  noveltyPoints.forEach((p) => { y = bullet(doc, p, y); });
  y = bodyText(doc, PROFESSIONAL_DELIVERABLE, y, { gap: 4, color: COLORS.gold, bold: true });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 6 — FREQUENCY PROTOCOL MATRIX
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "6. Frequency Protocol Matrix", y, COLORS.blue);
  y = bodyText(doc, "The following frequency protocols map documented biological coupling windows to specific therapeutic systems and target devices. All frequencies are derived from published research — Rife, Lisitsyn, Prioré, Bearden, and Schumann resonance data.", y, { gap: 6 });

  // Frequency table
  setFill(doc, COLORS.blue);
  doc.rect(20, y, pw - 40, 6, "F");
  setText(doc, COLORS.bg);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("FREQUENCY BAND", 22, y + 4);
  doc.text("BIOLOGICAL SYSTEM / EFFECT", 70, y + 4);
  doc.text("TARGET DEVICE", pw - 50, y + 4);
  y += 8;

  FREQUENCY_MATRIX.forEach((row, i) => {
    ensureSpace(8);
    if (i % 2 === 0) { setFill(doc, [25, 30, 42]); doc.rect(20, y - 4, pw - 40, 6, "F"); }
    setText(doc, COLORS.blue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text(row.band, 22, y);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(row.system, 80)[0], 70, y);
    setText(doc, COLORS.light);
    doc.setFont("helvetica", "bold");
    doc.text(doc.splitTextToSize(row.device, 35)[0], pw - 50, y);
    y += 6;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 7 — CONTROL SYSTEM ARCHITECTURE (conceptual)
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "7. Control System Architecture (Conceptual)", y, COLORS.green);
  y = bodyText(doc, "The Aethon Apex control architecture is a 5-layer stack — from hard real-time safety to AI-driven session orchestration. All layers are conceptual and subject to manufacturer validation.", y, { gap: 6 });

  CONTROL_ARCH.forEach((layer, i) => {
    ensureSpace(20);
    setFill(doc, [COLORS.green[0] * 0.1, COLORS.green[1] * 0.1, COLORS.green[2] * 0.1]);
    setDraw(doc, COLORS.green);
    doc.setLineWidth(0.2);
    doc.roundedRect(20, y, pw - 40, 14, 1, 1, "FD");
    setText(doc, COLORS.green);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`Layer ${i + 1}: ${layer.layer}`, 24, y + 5);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(doc.splitTextToSize(layer.desc, pw - 60)[0], 24, y + 9);
    setText(doc, COLORS.muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text(layer.mcu, pw - 50, y + 5);
    y += 18;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 8 — COMPONENT LIST (conceptual)
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "8. Component List (Conceptual)", y, COLORS.amber);
  y = bodyText(doc, "The following component list is conceptual — subject to manufacturer validation, supplier availability, and engineering review. No component has been procured or tested as of the date of this document.", y, { gap: 6 });

  // Device overview cards
  DEVICES.forEach((device, i) => {
    ensureSpace(30);
    y = sectionHeader(doc, `Device ${i + 1}: ${device.name}`, y, device.color);
    setText(doc, device.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`Code: ${device.code}`, 20, y); y += 5;
    y = bodyText(doc, device.desc, y, { size: 7, gap: 3 });

    // Specs
    ensureSpace(20);
    setText(doc, COLORS.muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("SPECIFICATIONS", 20, y); y += 4;
    Object.entries(device.specs).forEach(([k, v]) => {
      ensureSpace(6);
      setFill(doc, [30, 35, 50]);
      doc.rect(20, y - 4, pw - 40, 5, "F");
      setText(doc, COLORS.muted);
      doc.setFontSize(6);
      doc.text(k, 22, y);
      setText(doc, COLORS.light);
      doc.setFont("helvetica", "bold");
      doc.text(v, pw / 2, y);
      y += 5;
    });
    y += 4;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 9 — SAFETY CONSIDERATIONS
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "9. Safety Considerations", y, COLORS.red);
  y = bodyText(doc, "Safety is the paramount concern in all Aethon Apex device designs. The following safety considerations are mandatory design requirements — not optional features.", y, { gap: 6 });
  SAFETY_CONSIDERATIONS.forEach((s) => { y = bullet(doc, s, y); });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 10 — REGULATORY PATHWAY CONCEPT
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "10. Regulatory Pathway Concept", y, COLORS.blue);
  y = bodyText(doc, "Each device has a distinct regulatory pathway based on its classification, intended use, and jurisdiction. The following is a conceptual regulatory roadmap — actual submissions require qualified regulatory counsel.", y, { gap: 6 });

  REGULATORY_PATHWAY.forEach((r) => {
    ensureSpace(16);
    setFill(doc, [COLORS.blue[0] * 0.1, COLORS.blue[1] * 0.1, COLORS.blue[2] * 0.1]);
    setDraw(doc, COLORS.blue);
    doc.setLineWidth(0.2);
    doc.roundedRect(20, y, pw - 40, 12, 1, 1, "FD");
    setText(doc, COLORS.blue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(r.device, 24, y + 5);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(r.pathway, 24, y + 9);
    setText(doc, COLORS.muted);
    doc.setFontSize(6);
    doc.text(r.jurisdiction, pw - 50, y + 5);
    doc.text(doc.splitTextToSize(r.notes, 40)[0], pw - 50, y + 9);
    y += 16;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 11 — PDR — ZARP-PDR-XXXX
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "11. Preliminary Design Review (PDR) — ZARP-PDR-XXXX", y, COLORS.amber);
  setText(doc, COLORS.amber);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Overview", 20, y); y += 5;
  y = bodyText(doc, PDR.overview, y, { size: 8, gap: 4 });
  setText(doc, COLORS.amber);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Design Decisions", 20, y); y += 5;
  PDR.designDecisions.forEach((d) => { y = bullet(doc, d, y); });
  setText(doc, COLORS.amber);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  ensureSpace(20);
  doc.text("Risk Assessment & Mitigation", 20, y); y += 5;
  PDR.risks.forEach((r) => {
    ensureSpace(16);
    setText(doc, COLORS.red);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`Risk: ${r.risk}`, 22, y); y += 4;
    setText(doc, COLORS.green);
    y = bodyText(doc, `Mitigation: ${r.mitigation}`, y, { size: 7, color: COLORS.text, gap: 3 });
    y += 2;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 12 — PRD — ZARP-PRD-XXXX
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "12. Product Requirements Document (PRD) — ZARP-PRD-XXXX", y, COLORS.green);
  setText(doc, COLORS.green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Purpose", 20, y); y += 5;
  y = bodyText(doc, PRD.purpose, y, { size: 8, gap: 4 });
  setText(doc, COLORS.green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Scope", 20, y); y += 5;
  y = bodyText(doc, PRD.scope, y, { size: 8, gap: 4 });
  setText(doc, COLORS.green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Requirements", 20, y); y += 5;
  PRD.requirements.forEach((r) => { y = bullet(doc, r, y); });
  setText(doc, COLORS.green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  ensureSpace(20);
  doc.text("Success Metrics", 20, y); y += 5;
  PRD.successMetrics.forEach((m) => { y = bullet(doc, m, y); });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 13 — BOM — ZARP-BOM-XXXX
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "13. Conceptual Bill of Materials (BOM) — ZARP-BOM-XXXX", y, COLORS.primary);
  y = bodyText(doc, "28 line items across 4 devices. All components are conceptual — subject to manufacturer validation and supplier availability.", y, { size: 8, gap: 6 });

  const colX = [20, 50, pw - 40];
  setFill(doc, COLORS.primary);
  doc.rect(20, y, pw - 40, 6, "F");
  setText(doc, COLORS.bg);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("REF", colX[0], y + 4);
  doc.text("QTY", colX[1] - 8, y + 4);
  doc.text("DESCRIPTION", colX[1] + 10, y + 4);
  y += 8;

  BOM.forEach((item, i) => {
    ensureSpace(6);
    if (i % 2 === 0) { setFill(doc, [25, 30, 42]); doc.rect(20, y - 4, pw - 40, 6, "F"); }
    setText(doc, COLORS.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text(item.ref, colX[0], y);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.qty), colX[1] - 2, y);
    doc.text(doc.splitTextToSize(item.desc, pw - 80)[0], colX[1] + 10, y);
    y += 6;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 14 — SOW — ZARP-SOW-XXXX
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "14. Statements of Work (SOW 001-005) — ZARP-SOW-XXXX", y, COLORS.purple);
  setText(doc, COLORS.purple);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Objective", 20, y); y += 5;
  y = bodyText(doc, SOW.objective, y, { size: 8, gap: 4 });
  setText(doc, COLORS.purple);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Work Breakdown Structure", 20, y); y += 5;
  SOW.wbs.forEach((w) => {
    ensureSpace(14);
    setText(doc, COLORS.purple);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(w.phase, 22, y); y += 4;
    y = bodyText(doc, `Deliverables: ${w.deliverables}`, y, { size: 7, color: COLORS.text, gap: 3 });
    y += 2;
  });
  ensureSpace(16);
  setText(doc, COLORS.purple);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Timeline", 20, y); y += 5;
  y = bodyText(doc, SOW.timeline, y, { size: 8, gap: 4 });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 15 — IP VALUATION FRAMEWORK — ZARP-VAL-XXXX
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "15. IP Valuation Framework — ZARP-VAL-XXXX", y, COLORS.gold);
  y = bodyText(doc, PROFESSIONAL_DELIVERABLE, y, { gap: 4, color: COLORS.gold, bold: true });
  y = bodyText(doc, "The Aethon Apex IP portfolio encompasses 10 draft patent claims across 4 core devices, 6 protected trade secrets, and comprehensive engineering documentation. The valuation framework below outlines the methodology for assessing portfolio value — actual valuations require qualified IP counsel and market analysis.", y, { gap: 4 });
  y = bodyText(doc, "VALUATION METHODOLOGY:", y, { gap: 4, bold: true });
  const valFactors = [
    "Patent claims: 10 independent claims covering multichannel EM therapy, cranial scalar healing, VPO vacuum energy, and scalar grid generation",
    "Trade secrets: 6 protected know-how assets not published in patent applications",
    "Engineering documentation: Complete PRD, PDR, BOM, SOW, EVT assembly manual",
    "Market positioning: First-mover in documented suppressed technology commercialization",
    "Regulatory pathway: FDA 510(k) / De Novo, EU MDR, DOE demonstration permits",
    "Strategic value: Open-source hardware ecosystem potential + pharma licensing pivot",
  ];
  valFactors.forEach((f) => { y = bullet(doc, f, y); });
  y = bodyText(doc, PROFESSIONAL_DELIVERABLE, y, { gap: 4, color: COLORS.gold, bold: true });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 16 — COMMERCIALIZATION & LICENSING ROADMAP — ZARP-CLR-XXXX
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "16. Commercialization & Licensing Roadmap — ZARP-CLR-XXXX", y, COLORS.green);
  y = bodyText(doc, "The commercialization roadmap spans 5 phases over 5 years — from validation through civilizational transition. Each phase has specific deliverables and milestones.", y, { gap: 6 });
  ROADMAP.forEach((phase) => {
    ensureSpace(30);
    setFill(doc, [COLORS.green[0] * 0.1, COLORS.green[1] * 0.1, COLORS.green[2] * 0.1]);
    setDraw(doc, COLORS.green);
    doc.setLineWidth(0.2);
    const phaseHeight = 8 + phase.items.length * 6 + 4;
    doc.roundedRect(20, y, pw - 40, phaseHeight, 2, 2, "FD");
    setText(doc, COLORS.green);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(phase.phase, 24, y + 6);
    let iy = y + 12;
    phase.items.forEach((item) => {
      setText(doc, COLORS.green);
      doc.setFontSize(7);
      doc.text("▸", 26, iy);
      setText(doc, COLORS.text);
      doc.setFont("helvetica", "normal");
      doc.text(doc.splitTextToSize(item, pw - 56), 30, iy);
      iy += 6;
    });
    y += phaseHeight + 4;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 17 — GRANT FUNDING ROADMAP — ZARP-GFR-XXXX
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "17. Grant Funding Roadmap — ZARP-GFR-XXXX", y, COLORS.violet || COLORS.purple);
  y = bodyText(doc, "The following grant opportunities align with the Aethon Apex device portfolio. Each opportunity has been mapped to specific devices and research objectives.", y, { gap: 6 });

  GRANT_OPPORTUNITIES.forEach((g) => {
    ensureSpace(16);
    setFill(doc, [COLORS.purple[0] * 0.1, COLORS.purple[1] * 0.1, COLORS.purple[2] * 0.1]);
    setDraw(doc, COLORS.purple);
    doc.setLineWidth(0.2);
    doc.roundedRect(20, y, pw - 40, 14, 1, 1, "FD");
    setText(doc, COLORS.purple);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(g.agency, 24, y + 5);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(g.program, 24, y + 9);
    setText(doc, COLORS.muted);
    doc.setFontSize(6);
    doc.text(doc.splitTextToSize(g.fit, 50)[0], pw - 60, y + 5);
    doc.text(g.deadline, pw - 60, y + 9);
    y += 18;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 18 — INVESTOR PROFILES & OUTREACH TEMPLATES — ZARP-INV-XXXX
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "18. Investor Profiles & Outreach Templates — ZARP-INV-XXXX", y, COLORS.blue);
  y = bodyText(doc, "Target investor profiles and outreach communication templates for the Aethon Apex portfolio.", y, { gap: 6 });

  setText(doc, COLORS.blue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Target Investor Profiles", 20, y); y += 5;
  INVESTOR_PROFILES.forEach((p) => {
    ensureSpace(14);
    setText(doc, COLORS.blue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(p.type, 22, y); y += 4;
    y = bodyText(doc, `Focus: ${p.focus}`, y, { size: 7, color: COLORS.text, gap: 2 });
    y = bodyText(doc, `Approach: ${p.approach}`, y, { size: 7, color: COLORS.text, gap: 2 });
    y += 2;
  });

  ensureSpace(20);
  setText(doc, COLORS.blue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Outreach Templates", 20, y); y += 5;
  OUTREACH_TEMPLATES.forEach((t) => {
    ensureSpace(20);
    setText(doc, COLORS.blue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`Stage: ${t.stage}`, 22, y); y += 4;
    y = bodyText(doc, t.template, y, { size: 6, color: COLORS.text, gap: 3 });
    y += 3;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 19 — APPENDIX — RESEARCH NODE CITATIONS
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  y = sectionHeader(doc, "19. Appendix — Research Node Citations", y, COLORS.blue);
  y = bodyText(doc, "Every claim in this portfolio is grounded in published, documented research. The following primary sources form the scientific foundation:", y, { gap: 6 });
  RESEARCH_SOURCES.forEach((s) => {
    ensureSpace(20);
    setDraw(doc, COLORS.blue);
    doc.setLineWidth(0.2);
    doc.line(20, y, 22, y);
    setText(doc, COLORS.blue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`${s.author} — ${s.work}`, 24, y);
    y += 4;
    y = bodyText(doc, s.contribution, y, { size: 7, color: COLORS.text, gap: 3 });
    y += 2;
  });

  // Dark / Light timeline appendix
  ensureSpace(20);
  y = sectionHeader(doc, "Timeline Reference — Dark vs. Light", y, COLORS.amber);
  y = bodyText(doc, "The fork in the road — two possible futures based on whether scalar healing technology is deployed or suppressed:", y, { gap: 4 });

  DARK_TIMELINE.forEach((phase) => {
    ensureSpace(30);
    setFill(doc, [COLORS.red[0] * 0.1, COLORS.red[1] * 0.1, COLORS.red[2] * 0.1]);
    setDraw(doc, COLORS.red);
    doc.setLineWidth(0.2);
    doc.roundedRect(20, y, pw - 40, 30, 2, 2, "FD");
    setText(doc, COLORS.red);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`${phase.icon} ${phase.years} — ${phase.title}`, 24, y + 5);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text(doc.splitTextToSize(`Global: ${phase.global}`, pw - 48), 24, y + 10);
    doc.text(doc.splitTextToSize(`Health: ${phase.health}`, pw - 48), 24, y + 16);
    doc.text(doc.splitTextToSize(`Environment: ${phase.environment}`, pw - 48), 24, y + 22);
    y += 34;
  });

  LIGHT_TIMELINE.forEach((phase) => {
    ensureSpace(30);
    setFill(doc, [COLORS.green[0] * 0.1, COLORS.green[1] * 0.1, COLORS.green[2] * 0.1]);
    setDraw(doc, COLORS.green);
    doc.setLineWidth(0.2);
    doc.roundedRect(20, y, pw - 40, 30, 2, 2, "FD");
    setText(doc, COLORS.green);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`${phase.icon} ${phase.years} — ${phase.title}`, 24, y + 5);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text(doc.splitTextToSize(`Global: ${phase.global}`, pw - 48), 24, y + 10);
    doc.text(doc.splitTextToSize(`Health: ${phase.health}`, pw - 48), 24, y + 16);
    doc.text(doc.splitTextToSize(`Environment: ${phase.environment}`, pw - 48), 24, y + 22);
    y += 34;
  });

  // Patent claims appendix
  newPage();
  y = sectionHeader(doc, "Appendix — Draft Patent Claims (1–10)", y, COLORS.red);
  y = bodyText(doc, "The following 10 claims protect the core IP across all four devices. Provisional applications to be filed within 6 months; utility patents and PCT international filings within 18 months.", y, { size: 8, gap: 6 });
  PATENT_CLAIMS.forEach((claim) => {
    ensureSpace(25);
    setFill(doc, [COLORS.red[0] * 0.1, COLORS.red[1] * 0.1, COLORS.red[2] * 0.1]);
    setDraw(doc, COLORS.red);
    doc.setLineWidth(0.2);
    const claimText = doc.splitTextToSize(claim.text, pw - 52);
    const boxH = claimText.length * 4 + 8;
    doc.roundedRect(20, y, pw - 40, boxH, 1, 1, "FD");
    setText(doc, COLORS.red);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Claim ${claim.num}`, 24, y + 5);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(claimText, 24, y + 9);
    y += boxH + 3;
  });

  // Trade secrets appendix
  newPage();
  y = sectionHeader(doc, "Appendix — Trade Secrets", y, COLORS.amber);
  y = bodyText(doc, "The following 6 trade secrets are maintained as proprietary know-how, not published in patent applications. Protected via NDA access controls, secured IP vault, and compartmentalized team access.", y, { size: 8, gap: 6 });
  TRADE_SECRETS.forEach((secret, i) => {
    ensureSpace(20);
    setFill(doc, [COLORS.amber[0] * 0.1, COLORS.amber[1] * 0.1, COLORS.amber[2] * 0.1]);
    setDraw(doc, COLORS.amber);
    doc.setLineWidth(0.2);
    const secretText = doc.splitTextToSize(secret, pw - 52);
    const boxH = secretText.length * 4 + 8;
    doc.roundedRect(20, y, pw - 40, boxH, 1, 1, "FD");
    setText(doc, COLORS.amber);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`TS-${String(i + 1).padStart(2, "0")}`, 24, y + 5);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(secretText, 24, y + 9);
    y += boxH + 3;
  });

  // EVT Assembly Manual appendix
  newPage();
  y = sectionHeader(doc, "Appendix — EVT Assembly Manual", y, COLORS.accent);
  y = bodyText(doc, ASSEMBLY_MANUAL.intro, y, { size: 8, gap: 6 });
  ASSEMBLY_MANUAL.phases.forEach((phase) => {
    ensureSpace(25);
    setText(doc, COLORS.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(phase.title, 20, y); y += 5;
    phase.steps.forEach((step) => { y = bullet(doc, step, y, 24); });
    y += 2;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 20 — CONCEPT NOTICE (last page — mandatory, cannot be removed)
  // ═══════════════════════════════════════════════════════════════════════
  newPage();
  fillPage(doc, COLORS.bg);
  setFill(doc, COLORS.amber);
  doc.rect(0, 0, pw, 4, "F");
  setFill(doc, COLORS.amber);
  doc.rect(0, ph - 4, pw, 4, "F");

  y = 60;
  setText(doc, COLORS.amber);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CONCEPT NOTICE", pw / 2, y, { align: "center" });
  y += 16;

  setText(doc, COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const noticeText = [
    "All device designs, specifications, and build plans described in this document are CONCEPTUAL — subject to manufacturer validation, regulatory review, and clinical testing.",
    "",
    "No device has been manufactured, tested, or deployed as of the date of this document.",
    "",
    "This document does not constitute medical advice, legal advice, or a securities offering.",
    "",
    "All patent claims are draft only — consult a qualified patent attorney before filing.",
    "",
    "All research is referenced under Fair Use (17 U.S.C. § 107) for educational and research purposes.",
    "",
    "This document contains trade secrets and proprietary information — distribution restricted under NDA.",
    "",
    PROFESSIONAL_DELIVERABLE,
  ];
  noticeText.forEach((line) => {
    if (line === "") { y += 4; return; }
    const isDeliverable = line === PROFESSIONAL_DELIVERABLE;
    setText(doc, isDeliverable ? COLORS.gold : COLORS.text);
    doc.setFont("helvetica", isDeliverable ? "bold" : "normal");
    doc.setFontSize(isDeliverable ? 10 : 9);
    const lines = doc.splitTextToSize(line, pw - 60);
    doc.text(lines, pw / 2, y, { align: "center" });
    y += lines.length * 6 + 2;
  });

  y += 10;
  setText(doc, COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("© 2026 Aethon Apex IP Holdings LLC — Henderson, NV 89002", pw / 2, y, { align: "center" });
  y += 4;
  doc.text("Document ID: ZARP-BUILD-MASTER-001 · Rev A", pw / 2, y, { align: "center" });
  y += 4;
  doc.text("This Concept Notice is mandatory and cannot be removed from this document.", pw / 2, y, { align: "center" });

  // Final page numbers
  addPageNumber(doc, page, TOTAL_PAGES);

  return doc;
}