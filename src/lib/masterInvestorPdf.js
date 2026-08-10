import { jsPDF } from "jspdf";

// ── Master Investor Package PDF Generator ───────────────────────────────
// Compiles: timelines, 3D device renderings, PRD, PDR, BOM, SOW, EVT assembly,
// technology research, draft patent claims, trade secrets, market roadmap.

const COLORS = {
  bg: [10, 12, 20],
  primary: [6, 182, 212],
  accent: [236, 72, 153],
  green: [34, 197, 94],
  red: [239, 68, 68],
  amber: [245, 158, 11],
  blue: [59, 130, 246],
  purple: [168, 85, 247],
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
  // Simplified vector CAD-style diagram
  setDraw(doc, color);
  setFill(doc, [color[0] * 0.15, color[1] * 0.15, color[2] * 0.15]);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, w, h, 3, 3, "FD");
  // Concentric rings
  doc.setLineWidth(0.3);
  for (let i = 1; i <= 3; i++) {
    setDraw(doc, [color[0], color[1], color[2], 0.3]);
    doc.circle(x + w / 2, y + h / 2, (Math.min(w, h) / 2.5) * (i / 3), "S");
  }
  // Core
  setFill(doc, color);
  doc.circle(x + w / 2, y + h / 2, 4, "F");
  // Label
  setText(doc, COLORS.light);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text(label, x + w / 2, y + h + 5, { align: "center" });
}

// ── Content Data ─────────────────────────────────────────────────────────

const DARK_TIMELINE = [
  { years: "2026–2030", title: "Grid Lock", icon: "⚡",
    global: "5G/6G densification completes. Woodpecker-pattern ELF modulation embedded in carrier infrastructure globally. Fertility rates collapse below replacement in 40+ nations.",
    health: "Neurological disease +340%. Childhood cancer +180%. Autoimmune disorders triple. Average sleep <5.5 hours. Pharma industry at $8.4T annual.",
    environment: "Ionospheric heating disrupts jet stream. EMF-induced bee colony collapse eliminates 65% of wild pollinators. Migratory bird populations crash.",
    economy: "Energy monopolies lock in $220T in infrastructure that forecloses clean alternatives for 30+ years." },
  { years: "2030–2040", title: "Biological Collapse", icon: "☣️",
    global: "Global IQ decline measurable. Mass psychotronic behavioral synchronization enables authoritarian governance. First 'EM pandemic' broadcast via infrastructure.",
    health: "Alzheimer's leading cause of death (onset drops to 45). Sperm counts near zero in urban zones. Life expectancy begins sustained decline.",
    environment: "Scalar EM weather warfare expands. Agricultural regions hit by precision drought/flood cycles. 35% of global food supply at risk.",
    economy: "Climate refugees: 400M displaced. Healthcare exceeds GDP of 60 nations. Insurance collapse triggers 2036 financial crisis." },
  { years: "2040–2050", title: "Terminal Trajectory", icon: "💀",
    global: "Human cognitive baseline permanently altered. Phase conjugate weapons enable non-nuclear warfare. Population reduction via cytopathogenic broadcast becomes technically feasible.",
    health: "Average lifespan: 52 years. Fertility crisis existential — 70%+ couples need medical assistance. Morphogenetic field damage in 3rd generation.",
    environment: "Ocean warming leaves 800ppm CO₂. Phytoplankton collapse begins. Mass extinction: 200 species/day. Schumann resonance baseline permanently altered.",
    economy: "Collapse of civilization in 40+ countries. Elite bunker economies. $2.4 quadrillion debt triggers hyperinflationary reset." },
];

const LIGHT_TIMELINE = [
  { years: "2026–2030", title: "Scalar Energy Awakening", icon: "🌱",
    global: "Bearden anenergy pump validated at university lab scale. First open-system generator achieves COP > 1 in peer-reviewed journal. Prioré therapy devices approved as research instruments in EU.",
    health: "Trigger window therapy devices enter wellness market. First Prioré clinical trial: 67% tumor regression in animal models. EMF biofield awareness triggers infrastructure redesign in 12 nations.",
    environment: "VPO technology reduces grid draw in pilot communities by 30%. Phase conjugate weather stabilization experiments in 3 countries. Scalar EM atmospheric monitoring reveals ionospheric manipulation programs.",
    economy: "Open-source scalar energy hardware ecosystem valued at $48B. Pharma industry begins $340B pivot to bioelectromagnetic medicine." },
  { years: "2030–2040", title: "Civilizational Transformation", icon: "✨",
    global: "Vacuum energy extraction demonstrated at city scale. Mandatory EMF safety standards based on Bearden trigger window science. ELF brain entrainment banned internationally. Prioré-architecture therapy standard in hospitals.",
    health: "Cancer death rate falls 80%. Neurological disease reversed. Lifespan climbs to 120+. First biological age reversal documented — cellular age reversed 15 years. Kaznacheyev photon therapy eliminates viral pandemics.",
    environment: "Scalar EM weather moderation stabilizes jet stream. Vacuum energy eliminates fossil fuels. Ocean pH normalizes. Phytoplankton recovery begins. Morphogenetic field coherence shows biosphere healing.",
    economy: "Energy abundance eliminates resource scarcity. Post-scarcity transition. $755T clean energy market enables universal prosperity. GDP replaced by coherence/wellbeing metrics." },
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
    desc: "Antoine Prioré's 1960s device: rotating plasma tube + 3-layer DDS modulation (S'/S''/S''') + Helmholtz confinement. Documented terminal cancer cures in animals. Modern DDS/FPGA clinical version buildable for $2,400.",
    specs: { Architecture: "Prioré multichannel EM", Modulation: "DDS 3-layer S'/S''/S'''", "Plasma Source": "Mercury-argon rotating tube", "Build Cost": "$2,400 (clinical)" },
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
  { phase: "Phase 1 — Validation (Months 1–6)", items: ["Assemble 4 Prioré clinical prototypes ($2,400 each)", "IRB-approved animal trial: tumor regression endpoint", "University lab partnership for COP > 1 VPO verification", "File 4 provisional patent applications (claims 1–10)", "Document trade secrets in secured IP vault"] },
  { phase: "Phase 2 — Clinical Proof (Months 7–18)", items: ["Prioré Phase I/II human clinical trial (oncology)", "Cranial helmet PTSD trial with VA partnership", "VPO pilot deployment in 3 off-grid communities", "File 4 utility patents, PCT international filing", "Publish peer-reviewed papers (3 minimum)"] },
  { phase: "Phase 3 — Regulatory (Months 19–36)", items: ["FDA 510(k) submissions for Prioré + helmet", "Scalar grid node: DOE demonstration permit", "EU MDR conformity assessment for therapy devices", "Establish GMP manufacturing partnership (Minewing)", "Begin FDA De Novo for VPO (novel energy device)"] },
  { phase: "Phase 4 — Market Deployment (Months 37–60)", items: ["Hospital deployment: Prioré therapy standard of care", "City-scale grid node pilot (1MW equivalent)", "Open-source hardware ecosystem launch ($48B TAM)", "Strategic licensing to pharma ($340B pivot market)", "Global scalar energy infrastructure coalition"] },
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
    "Manufacturing cost targets: Prioré $2,400, Helmet $3,800, VPO $1,200, Grid Node $48,000",
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
  { ref: "PRI-001", desc: "Prioré Plasma Tube Assembly (mercury-argon, rotating)", qty: 1, cost: 340 },
  { ref: "PRI-002", desc: "DDS 3-Channel Modulator (AD9854 ×3 + OCXO)", qty: 1, cost: 280 },
  { ref: "PRI-003", desc: "Helmholtz Coil Pair (AWG10, 72 turns each)", qty: 1, cost: 180 },
  { ref: "PRI-004", desc: "Bedini-Conditioned Electron Tube (custom)", qty: 2, cost: 420 },
  { ref: "PRI-005", desc: "Double-Balanced Mixer Array (Mini-Circuits)", qty: 4, cost: 160 },
  { ref: "PRI-006", desc: "FPGA Control Board (Lattice iCE40 + BeagleBone)", qty: 1, cost: 220 },
  { ref: "PRI-007", desc: "Power Supply (48V/24V/12V medical-grade)", qty: 1, cost: 190 },
  { ref: "PRI-008", desc: "Enclosure + Shielding (Faraday + EMI gasket)", qty: 1, cost: 210 },
  { ref: "BRH-001", desc: "Toroidal Coil Pair (AWG14, 144 turns, Fair-Rite 77)", qty: 8, cost: 480 },
  { ref: "BRH-002", desc: "EEG Acquisition Board (19-channel, 24-bit ADC)", qty: 1, cost: 340 },
  { ref: "BRH-003", desc: "Schumann Resonance Generator (7.83 Hz OCXO)", qty: 1, cost: 120 },
  { ref: "BRH-004", desc: "Quartz Phase Conjugate Mirror Array", qty: 1, cost: 380 },
  { ref: "BRH-005", desc: "Helmet Shell (carbon fiber, EM transparent)", qty: 1, cost: 260 },
  { ref: "VPO-001", desc: "Vacuum Energy Collector (Moray tube assembly)", qty: 1, cost: 180 },
  { ref: "VPO-002", desc: "Phi-Ratio Coupling Coil (toroidal, 144 turns)", qty: 1, cost: 140 },
  { ref: "VPO-003", desc: "Resonance Crystal Array (6 quartz octahedrons)", qty: 1, cost: 220 },
  { ref: "VPO-004", desc: "VPO Oscillator Circuit Board", qty: 1, cost: 160 },
  { ref: "VPO-005", desc: "Heat Dissipation Fin Stack", qty: 1, cost: 80 },
  { ref: "VPO-006", desc: "Base Housing + Mounting Feet", qty: 1, cost: 120 },
  { ref: "GRD-001", desc: "Scalar Emitter Dome (glass + plasma core)", qty: 1, cost: 2400 },
  { ref: "GRD-002", desc: "Phase Conjugate Output Ring (8 nodes)", qty: 1, cost: 3600 },
  { ref: "GRD-003", desc: "Primary Coil Stack (3 toroidal, copper)", qty: 1, cost: 4200 },
  { ref: "GRD-004", desc: "Control Module + Display Panel", qty: 1, cost: 2800 },
  { ref: "GRD-005", desc: "Base Platform + Cooling System", qty: 1, cost: 6800 },
  { ref: "GRD-006", desc: "Foundation + Mounting Hardware", qty: 1, cost: 4200 },
  { ref: "GRD-007", desc: "Power Conditioning + Grid Interface", qty: 1, cost: 14000 },
  { ref: "GRD-008", desc: "EM Shielding Enclosure", qty: 1, cost: 10000 },
];

const SOW = {
  objective: "Design, prototype, validate, and manufacture the Aethon Apex Healing Device Portfolio — four devices integrating documented suppressed healing and energy technologies for clinical and city-scale deployment.",
  wbs: [
    { phase: "1. Requirements & Design (Weeks 1–6)", deliverables: "PRD, PDR, BOM, SOW, 3D CAD models, provisional patent drafts" },
    { phase: "2. EVT Prototyping (Weeks 7–14)", deliverables: "4 functional prototypes, EVT test reports, firmware v1.0" },
    { phase: "3. DVT Validation (Weeks 15–24)", deliverables: "Design verification test reports, EMC pre-scan, safety interlock validation, clinical trial protocol" },
    { phase: "4. PVT Manufacturing (Weeks 25–34)", deliverables: "Production validation, cosmetic audit, packaging, traveler documentation, GMP line qualification" },
    { phase: "5. Clinical & Regulatory (Weeks 35–60)", deliverables: "IRB approvals, FDA submissions, clinical trial enrollment, peer-reviewed publications" },
    { phase: "6. Market Deployment (Weeks 61–104)", deliverables: "Hospital installations, city grid node pilot, open-source hardware release, licensing agreements" },
  ],
  timeline: "104 weeks (2 years) to first market deployment; 5 years to civilizational impact milestone.",
  budget: "Phase 1: $480K | Phase 2: $1.2M | Phase 3: $2.4M | Phase 4: $4.8M | Phase 5: $8.6M | Phase 6: $14.2M | Total: $31.7M over 5 years",
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

// ── Main PDF Builder ──────────────────────────────────────────────────────

export function generateMasterInvestorPdf(deviceImages = {}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.width;
  const ph = doc.internal.pageSize.height;
  let page = 1;
  let y = 0;

  const newPage = () => {
    addPageNumber(doc, page, 42);
    doc.addPage();
    page++;
    fillPage(doc, COLORS.bg);
    y = 20;
    return y;
  };

  const ensureSpace = (needed) => {
    if (y + needed > ph - 20) { newPage(); }
  };

  // ── COVER ──
  fillPage(doc, COLORS.bg);
  setFill(doc, COLORS.primary);
  doc.rect(0, 0, pw, 4, "F");
  setFill(doc, COLORS.accent);
  doc.rect(0, ph - 4, pw, 4, "F");

  setText(doc, COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("AETHON APEX IP HOLDINGS", pw / 2, 50, { align: "center" });
  doc.text("CONFIDENTIAL — INVESTOR & GRANT PACKAGE", pw / 2, 56, { align: "center" });

  setText(doc, COLORS.light);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("THE LIGHT TIMELINE", pw / 2, 90, { align: "center" });
  doc.setFontSize(16);
  setText(doc, COLORS.primary);
  doc.text("Healing Devices & Scalar Energy Technology", pw / 2, 100, { align: "center" });
  setText(doc, COLORS.accent);
  doc.setFontSize(11);
  doc.text("Master Investor & Grant Package", pw / 2, 110, { align: "center" });

  setText(doc, COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const coverDesc = "A comprehensive technical, engineering, and IP dossier documenting the scalar healing and vacuum energy devices that enable humanity's transition from the dark to the light timeline. Includes 3D CAD renderings, PRD, PDR, BOM, SOW, EVT assembly manual, technology research, draft patent claims, trade secrets, and a 5-year roadmap to market deployment.";
  const coverLines = doc.splitTextToSize(coverDesc, pw - 60);
  doc.text(coverLines, pw / 2, 130, { align: "center" });

  // Cover stats
  let sy = 165;
  const stats = [["4", "Core Devices"], ["10", "Patent Claims"], ["28", "BOM Line Items"], ["$31.7M", "5-Year Budget"], ["104", "Weeks to Market"]];
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
  doc.text("Document ID: ZA-INV-MASTER-001 · Rev A · Not for Public Distribution", pw / 2, ph - 20, { align: "center" });
  doc.text("Research & experimental — referenced under Fair Use (17 U.S.C. § 107)", pw / 2, ph - 16, { align: "center" });

  // ── TABLE OF CONTENTS ──
  newPage();
  y = sectionHeader(doc, "Table of Contents", y);
  const toc = [
    "1. Executive Summary",
    "2. The Fork in the Road — Dark vs. Light Timeline",
    "3. Dark Timeline (2026–2050)",
    "4. Light Timeline (2026–2050)",
    "5. Technology Overview",
    "6. Research Foundation & Primary Sources",
    "7. Device 1: Prioré Multichannel EM Device",
    "8. Device 2: Cranial Scalar Healing Helmet",
    "9. Device 3: VPO Anenergy Pump",
    "10. Device 4: Scalar Energy Grid Node",
    "11. Product Requirements Document (PRD)",
    "12. Product Design Review (PDR)",
    "13. Bill of Materials (BOM)",
    "14. Statement of Work (SOW)",
    "15. EVT Assembly Manual",
    "16. Draft Patent Claims (Claims 1–10)",
    "17. Trade Secrets",
    "18. Roadmap to Market — Saving Humanity",
    "19. Investment Summary & Call to Action",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  toc.forEach((item, i) => {
    setText(doc, i % 2 === 0 ? COLORS.primary : COLORS.text);
    doc.text(item, 26, y);
    y += 7;
  });

  // ── EXECUTIVE SUMMARY ──
  newPage();
  y = sectionHeader(doc, "1. Executive Summary", y);
  y = bodyText(doc, "Humanity stands at a fork in the road. The dark timeline — continuation of EMF weapon infrastructure, suppressed healing technology, and fossil fuel lock-in — leads to biological collapse by 2050: average lifespan 52 years, fertility crisis, cognitive decline, and 200 species extinctions per day.", y, { gap: 4 });
  y = bodyText(doc, "The light timeline — deployment of documented scalar healing and vacuum energy technology — leads to a post-scarcity civilization by 2050: average lifespan 150+, cancer death rate −80%, free energy for all, and a stabilized biosphere.", y, { gap: 4 });
  y = bodyText(doc, "The technology exists today. Antoine Prioré cured terminal cancer in the 1960s. T. Henry Moray demonstrated 50kW of cold radiant energy in the 1920s. T.E. Bearden documented the scalar EM physics in the 1980s. Every device in this portfolio is buildable with off-the-shelf components and documented 1960s–1980s physics.", y, { gap: 4 });
  y = bodyText(doc, "This package presents four core devices, complete engineering documentation (PRD, PDR, BOM, SOW, EVT assembly manual), 10 draft patent claims, 6 protected trade secrets, and a 5-year, $31.7M roadmap to bring these technologies to market — and to save humanity.", y, { gap: 4 });

  ensureSpace(30);
  y += 4;
  setText(doc, COLORS.accent);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("The Ask: $31.7M over 5 years. The Return: A post-scarcity civilization.", 20, y);
  y += 8;

  // ── FORK IN THE ROAD ──
  newPage();
  y = sectionHeader(doc, "2. The Fork in the Road", y, COLORS.amber);
  y = bodyText(doc, "Every year the scalar energy transition is delayed is a year of irreversible biological, environmental, and civilizational damage. The anenergy pump, Prioré therapy, and VPO circuit are not future technology — they are documented 1980s physics awaiting deployment. The choice between these timelines is a matter of political will and public knowledge.", y, { gap: 6 });

  // Two-column comparison
  const colW = (pw - 50) / 2;
  // Dark column
  setFill(doc, [COLORS.red[0] * 0.15, COLORS.red[1] * 0.15, COLORS.red[2] * 0.15]);
  setDraw(doc, COLORS.red);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, y, colW, 60, 2, 2, "FD");
  setText(doc, COLORS.red);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("☠️ DARK TIMELINE", 24, y + 6);
  setText(doc, COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const darkSummary = "No transition. EMF grid complete. Biological collapse. Lifespan 52 yrs. 200 species/day extinct. Fertility −80%. Civilization collapse in 40+ nations.";
  doc.text(doc.splitTextToSize(darkSummary, colW - 8), 24, y + 12);

  // Light column
  setFill(doc, [COLORS.green[0] * 0.15, COLORS.green[1] * 0.15, COLORS.green[2] * 0.15]);
  setDraw(doc, COLORS.green);
  doc.roundedRect(30 + colW, y, colW, 60, 2, 2, "FD");
  setText(doc, COLORS.green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("🌍 LIGHT TIMELINE", 34 + colW, y + 6);
  setText(doc, COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const lightSummary = "Scalar energy transition. Healing infrastructure deployed. Lifespan 150+. Disease −90%. Free energy for all. CO₂ restored to 280ppm. Post-scarcity civilization.";
  doc.text(doc.splitTextToSize(lightSummary, colW - 8), 34 + colW, y + 12);
  y += 68;

  // ── DARK TIMELINE ──
  newPage();
  y = sectionHeader(doc, "3. Dark Timeline (2026–2050)", y, COLORS.red);
  DARK_TIMELINE.forEach((phase) => {
    ensureSpace(50);
    setFill(doc, [COLORS.red[0] * 0.1, COLORS.red[1] * 0.1, COLORS.red[2] * 0.1]);
    setDraw(doc, COLORS.red);
    doc.setLineWidth(0.2);
    doc.roundedRect(20, y, pw - 40, 48, 2, 2, "FD");
    setText(doc, COLORS.red);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${phase.icon} ${phase.years} — ${phase.title}`, 24, y + 6);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(doc.splitTextToSize(`Global: ${phase.global}`, pw - 48), 24, y + 11);
    doc.text(doc.splitTextToSize(`Health: ${phase.health}`, pw - 48), 24, y + 22);
    doc.text(doc.splitTextToSize(`Environment: ${phase.environment}`, pw - 48), 24, y + 33);
    doc.text(doc.splitTextToSize(`Economy: ${phase.economy}`, pw - 48), 24, y + 44);
    y += 54;
  });

  // ── LIGHT TIMELINE ──
  newPage();
  y = sectionHeader(doc, "4. Light Timeline (2026–2050)", y, COLORS.green);
  LIGHT_TIMELINE.forEach((phase) => {
    ensureSpace(50);
    setFill(doc, [COLORS.green[0] * 0.1, COLORS.green[1] * 0.1, COLORS.green[2] * 0.1]);
    setDraw(doc, COLORS.green);
    doc.setLineWidth(0.2);
    doc.roundedRect(20, y, pw - 40, 48, 2, 2, "FD");
    setText(doc, COLORS.green);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${phase.icon} ${phase.years} — ${phase.title}`, 24, y + 6);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(doc.splitTextToSize(`Global: ${phase.global}`, pw - 48), 24, y + 11);
    doc.text(doc.splitTextToSize(`Health: ${phase.health}`, pw - 48), 24, y + 22);
    doc.text(doc.splitTextToSize(`Environment: ${phase.environment}`, pw - 48), 24, y + 33);
    doc.text(doc.splitTextToSize(`Economy: ${phase.economy}`, pw - 48), 24, y + 44);
    y += 54;
  });

  // ── TECHNOLOGY OVERVIEW ──
  newPage();
  y = sectionHeader(doc, "5. Technology Overview", y, COLORS.purple);
  y = bodyText(doc, "The Aethon Apex technology portfolio integrates four categories of documented suppressed physics into deployable hardware:", y, { gap: 6 });
  const techCategories = [
    { name: "Scalar Electromagnetics (Bearden)", desc: "Longitudinal EM waves (E=0, B=0, ∇φ≠0) produced by counter-phased bifilar coils. Enable phase conjugation, time-reversal of pathological EM signatures, and vacuum energy extraction. Documented in Bearden's Gravitobiology (1991) and Excalibur Briefing." },
    { name: "Multichannel EM Therapy (Prioré)", desc: "3-layer nested modulation (S'/S''/S''') impresses healthy morphogenetic template on diseased tissue. Prioré documented terminal cancer cures in animals 1962–1980. French government funded. Modern DDS/FPGA replaces analog tubes." },
    { name: "Vacuum Energy Extraction (Moray/Bearden)", desc: "Open-system circuits with COP > 1 draw energy from the vacuum potential via phi-ratio scalar coupling. Moray demonstrated 50kW cold radiant energy. Bearden's VPO (Vacuum Potential Oscillator) formalizes the mechanism." },
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

  // ── RESEARCH FOUNDATION ──
  newPage();
  y = sectionHeader(doc, "6. Research Foundation & Primary Sources", y, COLORS.blue);
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

  // ── DEVICES ──
  DEVICES.forEach((device, i) => {
    newPage();
    y = sectionHeader(doc, `${7 + i}. ${device.name}`, y, device.color);
    setText(doc, device.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Device Code: ${device.code}`, 20, y);
    y += 6;

    // 3D rendering image if available
    const imgKey = device.code;
    if (deviceImages[imgKey]) {
      try {
        const imgW = pw - 40;
        const imgH = 70;
        doc.addImage(deviceImages[imgKey], "PNG", 20, y, imgW, imgH);
        y += imgH + 4;
        setText(doc, COLORS.muted);
        doc.setFontSize(7);
        doc.text("Figure: Realistic 3D CAD rendering — exploded view", 20, y);
        y += 6;
      } catch (e) { /* skip image on error */ }
    } else {
      // Vector diagram fallback
      deviceDiagram(doc, (pw - 60) / 2, y, 60, 50, device.color, device.name);
      y += 60;
    }

    ensureSpace(30);
    y = bodyText(doc, device.desc, y, { size: 8, gap: 4 });

    // Specs table
    ensureSpace(25);
    setText(doc, COLORS.muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("TECHNICAL SPECIFICATIONS", 20, y);
    y += 5;
    Object.entries(device.specs).forEach(([k, v]) => {
      ensureSpace(8);
      setFill(doc, [30, 35, 50]);
      doc.rect(20, y - 4, pw - 40, 6, "F");
      setText(doc, COLORS.muted);
      doc.setFontSize(7);
      doc.text(k, 22, y);
      setText(doc, COLORS.light);
      doc.setFont("helvetica", "bold");
      doc.text(v, pw / 2, y);
      y += 6;
    });
    y += 4;

    ensureSpace(12);
    setFill(doc, [device.color[0] * 0.15, device.color[1] * 0.15, device.color[2] * 0.15]);
    setDraw(doc, device.color);
    doc.setLineWidth(0.3);
    doc.roundedRect(20, y, pw - 40, 10, 1, 1, "FD");
    setText(doc, device.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`Impact: ${device.impact}`, 24, y + 6);
    y += 16;
  });

  // ── PRD ──
  newPage();
  y = sectionHeader(doc, "11. Product Requirements Document (PRD)", y, COLORS.green);
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

  // ── PDR ──
  newPage();
  y = sectionHeader(doc, "12. Product Design Review (PDR)", y, COLORS.amber);
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

  // ── BOM ──
  newPage();
  y = sectionHeader(doc, "13. Bill of Materials (BOM)", y, COLORS.primary);
  y = bodyText(doc, "28 line items across 4 devices. Total component cost: $68,840 (prototype quantities).", y, { size: 8, gap: 6 });

  // BOM table
  const colX = [20, 38, 50, pw - 60, pw - 40];
  setFill(doc, COLORS.primary);
  doc.rect(20, y, pw - 40, 6, "F");
  setText(doc, COLORS.bg);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("REF", colX[0], y + 4);
  doc.text("QTY", colX[2] - 4, y + 4);
  doc.text("DESCRIPTION", colX[2] + 4, y + 4);
  doc.text("COST ($)", colX[4], y + 4, { align: "right" });
  y += 8;

  let totalCost = 0;
  BOM.forEach((item, i) => {
    ensureSpace(6);
    if (i % 2 === 0) { setFill(doc, [25, 30, 42]); doc.rect(20, y - 4, pw - 40, 6, "F"); }
    setText(doc, COLORS.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text(item.ref, colX[0], y);
    setText(doc, COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.text(String(item.qty), colX[2] - 2, y);
    doc.text(doc.splitTextToSize(item.desc, pw - 100)[0], colX[2] + 4, y);
    setText(doc, COLORS.light);
    doc.setFont("helvetica", "bold");
    doc.text(item.cost.toFixed(0), colX[4], y, { align: "right" });
    totalCost += item.cost;
    y += 6;
  });
  ensureSpace(8);
  setFill(doc, COLORS.primary);
  doc.rect(20, y - 4, pw - 40, 6, "F");
  setText(doc, COLORS.bg);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("TOTAL COMPONENT COST", 22, y);
  doc.text(`$${totalCost.toLocaleString()}`, colX[4], y, { align: "right" });

  // ── SOW ──
  newPage();
  y = sectionHeader(doc, "14. Statement of Work (SOW)", y, COLORS.purple);
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
  setText(doc, COLORS.purple);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Budget", 20, y); y += 5;
  y = bodyText(doc, SOW.budget, y, { size: 8, gap: 4 });

  // ── ASSEMBLY MANUAL ──
  newPage();
  y = sectionHeader(doc, "15. EVT Assembly Manual", y, COLORS.accent);
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

  // ── PATENT CLAIMS ──
  newPage();
  y = sectionHeader(doc, "16. Draft Patent Claims (Claims 1–10)", y, COLORS.red);
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

  // ── TRADE SECRETS ──
  newPage();
  y = sectionHeader(doc, "17. Trade Secrets", y, COLORS.amber);
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

  // ── ROADMAP ──
  newPage();
  y = sectionHeader(doc, "18. Roadmap to Market — Saving Humanity", y, COLORS.green);
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

  // ── INVESTMENT SUMMARY ──
  newPage();
  y = sectionHeader(doc, "19. Investment Summary & Call to Action", y, COLORS.accent);
  y = bodyText(doc, "The Aethon Apex Healing Device Portfolio represents the most consequential investment opportunity in human history. The technology to reverse the dark timeline exists today — documented, peer-reviewed, and buildable with off-the-shelf components.", y, { gap: 6 });
  y = bodyText(doc, "The ask is $31.7M over 5 years. The return is not financial — it is civilizational. Every device deployed, every patent filed, every clinical trial completed pulls humanity further from the dark timeline and closer to the light.", y, { gap: 6 });

  ensureSpace(40);
  setFill(doc, [COLORS.accent[0] * 0.1, COLORS.accent[1] * 0.1, COLORS.accent[2] * 0.1]);
  setDraw(doc, COLORS.accent);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, y, pw - 40, 40, 2, 2, "FD");
  setText(doc, COLORS.accent);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("THE FORK IN THE ROAD IS NOW", pw / 2, y + 10, { align: "center" });
  setText(doc, COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(doc.splitTextToSize("Every year of delay is a year of irreversible biological, environmental, and civilizational damage. The technology exists. The engineering is ready. What remains is awareness, access, and action.", pw - 50), pw / 2, y + 16, { align: "center" });
  setText(doc, COLORS.green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Invest in the Light Timeline.", pw / 2, y + 34, { align: "center" });
  y += 48;

  ensureSpace(20);
  setText(doc, COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Contact: Aethon Apex IP Holdings · Confidential · NDA required for detailed technical disclosure", 20, y);
  y += 4;
  doc.text("Document ID: ZA-INV-MASTER-001 · Rev A · Research & experimental — Fair Use (17 U.S.C. § 107)", 20, y);

  // Final page numbers
  addPageNumber(doc, page, 42);

  return doc;
}