// Filing & Equity-Raise Playbook for the ZARP / Aethon Apex / ZDS33 portfolio.
// All claim language is a DRAFT scaffold derived from on-file asset names and
// descriptions. It is NOT a filed patent and is NOT legal advice. Every claim
// set MUST be reviewed and finalized with a registered US patent attorney
// (or a registered patent agent) before submission to the USPTO.

export const FILING_SEQUENCE = [
  {
    n: 1,
    title: "Engage registered patent counsel",
    detail: "Before drafting anything, retain a registered USPTO patent attorney or agent. Only a registered practitioner may prosecute a patent application. Provisionals are cheaper (no claims required to be perfect) but the disclosure must still be enabling and describe the best mode. A practitioner also runs a quick novelty/prior-art scan to avoid wasting filing fees on claims already in the public art.",
    owner: "Founder",
    cost: "$0 (retainer agreement first visit)",
    days: "Day 0–3",
  },
  {
    n: 2,
    title: "File provisional applications — Non-ITAR slice FIRST",
    detail: "File the 10 non-ITAR provisional applications first (Omega MedBed, AATCS-P1, AEGH, Anenergy Pump, VPO, Open-System Magnetic Generator, Whittaker PCM, MFCS, Biofield Chamber, Priore-Type). These have no export-control gating, so the spec and figures can be shared freely with counsel. One USPTO provisional per asset: USPTO fee $75–$300 (small/micro entity). Filing the provisional establishes a 12-month priority date and lets you publicly disclose / fundraise without destroying novelty.",
    owner: "Founder + counsel",
    cost: "~$2,000–$5,000 per asset (counsel + USPTO fee)",
    days: "Day 4–21",
  },
  {
    n: 3,
    title: "File provisional applications — ITAR defense slice (under counsel's TCP)",
    detail: "File the 10 ITAR-flagged provisionals (INV-01, 03, 05, 26–31, 33). These inventions are subject to ITAR (22 CFR §120–130). The spec MUST be reviewed for export-controlled technical data BEFORE it leaves your control. Counsel must be US-based and cleared; any foreign-national reviewer is an export violation. Recommend filing a US patent application ONLY (no PCT until a foreign-filing license is granted). Concurrently begin DDTC registration and a Technology Control Plan (TCP).",
    owner: "Founder + cleared counsel",
    cost: "~$3,000–$6,000 per asset (higher review burden)",
    days: "Day 10–40",
  },
  {
    n: 4,
    title: "Submit non-provisional (utility) applications within 12 months",
    detail: "A provisional expires in 12 months. Before it lapses, convert each to a non-provisional utility application (USPTO fee ~$430 small entity, ~$215 micro). Add formal claims, drawings, and an oath/declaration. For the ITAR set, request a foreign-filing license from the USPTO Office of International Patent Documentation before any PCT or foreign filing.",
    owner: "Counsel",
    cost: "~$4,000–$10,000 per asset",
    days: "Month 6–11",
  },
  {
    n: 5,
    title: "Record assignments to the holding entity",
    detail: "Every provisional and non-provisional must be assigned (USPTO Assignment Recordation) to a single IP holding entity (e.g., Aethon Apex IP Holdings LLC). An unrecorded assignment means the inventor, not the company, owns the patent — which kills any equity raise. Record the assignment at filing.",
    owner: "Counsel",
    cost: "~$40 USPTO recordation per assignment",
    days: "At each filing",
  },
  {
    n: 6,
    title: "Submit grant proposals (non-dilutive funding)",
    detail: "In parallel with filing, submit the four drafted grant proposals below: AFWERX SBIR (INV-01), Army ARL SBIR (INV-03), NASA SBIR (deep-space energy/sensing), ARPA-E (clean energy), and the global-health proposal (humanitarian therapeutics). SBIR/STTR and ARPA-E are non-dilutive — they do not cost equity. Submit before the respective deadlines.",
    owner: "Founder",
    cost: "$0 submission (proposal drafting time only)",
    days: "Day 14–60",
  },
  {
    n: 7,
    title: "Open the equity raise (post-priority-date)",
    detail: "Once provisionals are on file (priority date established), open the data room and pitch. The investor deck (exportable below) carries the equity ask. Use the ITAR track for cleared defense investors only; use the non-ITAR track for general/foundation/energy investors. No public disclosure of any invention until its provisional is filed.",
    owner: "Founder",
    cost: "—",
    days: "Day 21+",
  },
];

// Per-asset provisional claim scaffolds. DRAFT ONLY — review with counsel.
// Each entry: { code, name, track, independent: [claim strings], dependent: [claim strings] }
export const CLAIMS = [
  {
    code: "ZA-MB-OMEGA-A", name: "Omega MedBed — 18-Modality Integrated Therapeutic Platform", track: "Non-ITAR", domain: "Humanitarian / Medical",
    independent: [
      "1. A research therapeutic platform comprising: a canopy enclosure; a plurality of therapeutic modality modules disposed within the canopy enclosure, the plurality comprising at least a photobiomodulation module, a pulsed electromagnetic field module, and an acoustic/vibroacoustic module; and a closed-loop controller operatively coupled to each of the plurality of modality modules, the closed-loop controller configured to coordinate simultaneous operation of two or more of the modality modules according to a selectable protocol.",
    ],
    dependent: [
      "2. The platform of claim 1, wherein the closed-loop controller modulates a frequency, duty cycle, or intensity of at least one modality module in response to a sensed physiological parameter.",
      "3. The platform of claim 1, further comprising a bio-feedback sensor array in communication with the closed-loop controller.",
      "4. The platform of claim 1, wherein the plurality of modality modules comprises at least eighteen distinct modality modules.",
    ],
    note: "Class III medical device concept. Claims must be written as a research device; no therapeutic-effect claim without clinical data and FDA clearance.",
  },
  {
    code: "AATCS-P1", name: "AuraWell Adaptive Aura-Therapeutic Coherence System", track: "Non-ITAR", domain: "Humanitarian / Medical",
    independent: [
      "1. A coherence-therapy system comprising: a pulsed electromagnetic field (PEMF) emitter; a photobiomodulation (PBM) emitter; an acoustic emitter; and an adaptive controller configured to drive the PEMF emitter, the PBM emitter, and the acoustic emitter in a synchronized multi-modal sequence derived from a selectable coherence protocol.",
    ],
    dependent: [
      "2. The system of claim 1, wherein the adaptive controller adjusts at least one drive parameter in response to a measured biofeedback signal.",
      "3. The system of claim 1, wherein the PEMF, PBM, and acoustic emissions are phase-locked to a common reference clock.",
    ],
    note: "Theory and protocol design only; no clinical data on file. Claims are apparatus claims, not method-of-treatment claims.",
  },
  {
    code: "BP-30", name: "Atmospheric Electrostatic Gradient Harvester (AEGH)", track: "Non-ITAR", domain: "Deep-Space / Energy",
    independent: [
      "1. An atmospheric electrostatic energy harvester comprising: an elevated collector electrode configured to be disposed at a first atmospheric potential; a reference electrode disposed at a second atmospheric potential different from the first; and a power-conditioning circuit electrically coupled between the collector electrode and the reference electrode, the power-conditioning circuit configured to extract electrical energy from an atmospheric electrostatic potential gradient.",
    ],
    dependent: [
      "2. The harvester of claim 1, wherein the elevated collector electrode is tethered to an aerial platform.",
      "3. The harvester of claim 1, further comprising an energy storage element charged by the power-conditioning circuit.",
    ],
    note: "Research-prototype. Performance claims are unverified; provisional should describe the best-mode build plan from the compendium.",
  },
  {
    code: "BP-01", name: "Anenergy Pump Demonstration Circuit", track: "Non-ITAR", domain: "Deep-Space / Energy",
    independent: [
      "1. A demonstration circuit comprising: a resonant tank circuit; a switching element coupled to the resonant tank circuit; and a control driver configured to drive the switching element at a selected duty cycle to excite the resonant tank circuit, the circuit configured to exhibit a measurable energy-recirculation characteristic at a selected operating point.",
    ],
    dependent: [
      "2. The circuit of claim 1, further comprising a measurement port for characterizing the energy-recirculation characteristic.",
      "3. The circuit of claim 1, wherein the resonant tank circuit operates at a selected resonant frequency above 1 kHz.",
    ],
    note: "Performance claims unverified. Provisional should not claim over-unity performance; claim the apparatus and method of demonstration.",
  },
  {
    code: "BP-03", name: "Vacuum Potential Oscillator (VPO) Circuit Kit", track: "Non-ITAR", domain: "Deep-Space / Energy",
    independent: [
      "1. A vacuum-potential oscillator circuit kit comprising: an oscillator driver stage; a tuned load network coupled to the oscillator driver stage; and an output measurement port, the circuit kit configured to generate an oscillating potential at the output measurement port when energized.",
    ],
    dependent: [
      "2. The kit of claim 1, further comprising an enclosure housing the oscillator driver stage and the tuned load network.",
      "3. The kit of claim 1, wherein the tuned load network comprises a variable reactive element.",
    ],
    note: "Build-plan kit. Claim the apparatus; do not claim energy extraction as a verified result.",
  },
  {
    code: "BP-05", name: "Open-System Magnetic Generator (Prototype Plans)", track: "Non-ITAR", domain: "Deep-Space / Energy",
    independent: [
      "1. A magnetic generator apparatus comprising: a rotor; a stator; a plurality of permanent magnets disposed on at least one of the rotor and the stator; and a coil winding disposed on the other of the rotor and the stator, the apparatus configured such that rotation of the rotor induces an electrical potential in the coil winding.",
    ],
    dependent: [
      "2. The apparatus of claim 1, wherein the plurality of permanent magnets are arranged in a selected asymmetric configuration.",
      "3. The apparatus of claim 1, further comprising a measurement port for characterizing output electrical potential under load.",
    ],
    note: "Prototype plans only. Claims cover the apparatus configuration; no verified-output claims.",
  },
  {
    code: "BP-09", name: "Whittaker Wave Phase Conjugate Mirror (PCM) System", track: "Non-ITAR", domain: "Deep-Space / Communications",
    independent: [
      "1. A phase-conjugate mirror system comprising: a signal input port; a non-linear medium coupled to the signal input port; and an excitation source configured to pump the non-linear medium such that an input signal at the signal input port produces a phase-conjugated return signal.",
    ],
    dependent: [
      "2. The system of claim 1, wherein the non-linear medium is a selected crystalline or electromagnetic medium.",
      "3. The system of claim 1, further comprising a measurement port for characterizing the phase-conjugated return signal.",
    ],
    note: "Communications application. Provisional should describe the best-mode build plan.",
  },
  {
    code: "BP-31", name: "Morphogenetic Field Coherence Synchronizer (MFCS)", track: "Non-ITAR", domain: "Humanitarian / Medical",
    independent: [
      "1. A coherence-synchronization apparatus comprising: a plurality of field-emission elements; and a controller configured to drive the plurality of field-emission elements in a selected spatial and temporal pattern to produce a coherent field distribution within a target region.",
    ],
    dependent: [
      "2. The apparatus of claim 1, wherein the field-emission elements comprise electromagnetic emitters.",
      "3. The apparatus of claim 1, further comprising a sensor for measuring a response within the target region.",
    ],
    note: "Humanitarian research device. No therapeutic-effect claim without clinical data.",
  },
  {
    code: "BP-04", name: "Biofield Frequency Exposure Chamber (Research Device)", track: "Non-ITAR", domain: "Humanitarian / Sensing",
    independent: [
      "1. A frequency-exposure research chamber comprising: an enclosure defining an exposure volume; a plurality of frequency-emission elements disposed within the enclosure; and a controller configured to drive the frequency-emission elements at a selectable frequency and intensity within the exposure volume.",
    ],
    dependent: [
      "2. The chamber of claim 1, further comprising a sensor disposed within the exposure volume for measuring an emitted field.",
      "3. The chamber of claim 1, wherein the controller drives the frequency-emission elements in a swept-frequency mode.",
    ],
    note: "Research device only. No therapeutic-effect claim.",
  },
  {
    code: "BP-10", name: "Priore-Type Multichannel EM Therapy System", track: "Non-ITAR", domain: "Humanitarian / Medical",
    independent: [
      "1. A multichannel electromagnetic therapy apparatus comprising: a plurality of electromagnetic emitters arranged to irradiate a target volume; a multichannel driver coupled to the plurality of electromagnetic emitters; and a controller configured to drive each channel of the multichannel driver at an independently selectable frequency and phase.",
    ],
    dependent: [
      "2. The apparatus of claim 1, wherein the controller phase-locks the plurality of electromagnetic emitters to a common reference.",
      "3. The apparatus of claim 1, further comprising a measurement port for characterizing the combined field within the target volume.",
    ],
    note: "Research device. Historical 'Priore' modality. No therapeutic-effect claim without clinical data.",
  },
  // ---- ITAR DEFENSE SLICE ----
  {
    code: "INV-01", name: "Quantum-Encrypted Tactical Mesh Network Node", track: "ITAR", domain: "Defense / Comms",
    independent: [
      "1. A tactical mesh network node comprising: a quantum key distribution (QKD) module; a mesh-radio transceiver coupled to the QKD module; and a routing processor configured to establish encrypted mesh links with peer nodes using keys derived from the QKD module.",
    ],
    dependent: [
      "2. The node of claim 1, wherein the mesh-radio transceiver operates in a selected tactical frequency band.",
      "3. The node of claim 1, further comprising a store-and-forward buffer for link-disruption-tolerant routing.",
    ],
    note: "ITAR-controlled (Cat XV). File US-only; foreign filing requires a USPTO foreign-filing license. No disclosure to foreign nationals.",
  },
  {
    code: "INV-03", name: "Autonomous Swarm Coordination AI Core", track: "ITAR", domain: "Defense / Autonomy",
    independent: [
      "1. A swarm coordination system comprising: a plurality of autonomous agents; and a coordination computing core configured to exchange state information among the plurality of agents and to generate coordinated behavioral commands according to a distributed coordination algorithm.",
    ],
    dependent: [
      "2. The system of claim 1, wherein the distributed coordination algorithm updates agent assignments in response to a loss of a member agent.",
      "3. The system of claim 1, wherein the coordination computing core operates aboard each agent in a peer configuration.",
    ],
    note: "ITAR-controlled. US filing only.",
  },
  {
    code: "INV-05", name: "Bio-Threat Detection Spectrometer Array", track: "ITAR", domain: "Defense / Sensing",
    independent: [
      "1. A bio-threat detection array comprising: a plurality of spectrometer sensors; a sampling manifold coupled to the plurality of spectrometer sensors; and a processor configured to compare spectral signatures from the plurality of spectrometer sensors against a reference signature library to detect a biological threat agent.",
    ],
    dependent: [
      "2. The array of claim 1, wherein the plurality of spectrometer sensors comprises Raman and ultraviolet sensors.",
      "3. The array of claim 1, further comprising an alarm output responsive to detection.",
    ],
    note: "ITAR/EAR dual-use. US filing only.",
  },
  {
    code: "INV-26", name: "Thermobaric Fuel-Air Munition Warhead", track: "ITAR", domain: "Defense",
    independent: [
      "1. A fuel-air warhead comprising: a dispersal charge configured to distribute a fuel payload into a target volume; and an initiation charge configured to ignite the distributed fuel payload, the dispersal charge and the initiation charge sequenced to form a fuel-air cloud prior to ignition.",
    ],
    dependent: [
      "2. The warhead of claim 1, wherein the fuel payload comprises a selected metal-powder additive.",
      "3. The warhead of claim 1, further comprising a delay fuze controlling the sequence.",
    ],
    note: "ITAR Cat IV. Highly controlled. File US-only; counsel must confirm filing does not itself constitute an export. Consider trade-secret retention in lieu of publication.",
  },
  {
    code: "INV-27", name: "Electronic Warfare Signal Intelligence Pod", track: "ITAR", domain: "Defense / Comms",
    independent: [
      "1. A signal-intelligence pod comprising: a wideband receiver array; a direction-finding processor coupled to the receiver array; and a signal-classification processor configured to identify and geolocate emitters from received signals.",
    ],
    dependent: [
      "2. The pod of claim 1, wherein the direction-finding processor uses a phase-interferometry method.",
      "3. The pod of claim 1, further comprising an aerodynamic housing configured for external carriage.",
    ],
    note: "ITAR Cat XI. US filing only.",
  },
  {
    code: "INV-28", name: "Biometric Identity Verification Checkpoint System", track: "ITAR", domain: "Defense / Sensing",
    independent: [
      "1. A biometric checkpoint system comprising: a plurality of biometric capture sensors; a fusion processor coupled to the plurality of sensors; and a verification engine configured to compare a fused biometric template against an enrolled reference to render an identity decision.",
    ],
    dependent: [
      "2. The system of claim 1, wherein the plurality of sensors comprises facial, iris, and fingerprint sensors.",
      "3. The system of claim 1, further comprising a gate actuator responsive to the identity decision.",
    ],
    note: "ITAR/EAR. US filing only.",
  },
  {
    code: "INV-29", name: "High-Energy Density Solid-State Battery Pack", track: "ITAR", domain: "Defense / Power",
    independent: [
      "1. A solid-state battery pack comprising: a plurality of solid-state electrochemical cells; an inter-cell bus electrically coupling the cells; and a battery management system configured to balance the cells and to disconnect a faulted cell.",
    ],
    dependent: [
      "2. The pack of claim 1, wherein the solid-state electrochemical cells comprise a selected solid electrolyte.",
      "3. The pack of claim 1, further comprising an impact-resistant enclosure.",
    ],
    note: "Defense power. US filing preferred.",
  },
  {
    code: "INV-30", name: "Urban Combat Micro-Drone Reconnaissance Unit", track: "ITAR", domain: "Defense / Autonomy",
    independent: [
      "1. A micro-drone reconnaissance unit comprising: an airframe sized for single-person deployment; an imaging payload; a propulsion system; and an onboard processor configured to navigate and capture imagery in a GPS-denied indoor environment.",
    ],
    dependent: [
      "2. The unit of claim 1, wherein the onboard processor performs visual-inertial odometry.",
      "3. The unit of claim 1, further comprising a datalink configured to relay captured imagery.",
    ],
    note: "ITAR Cat VIII/UAV. US filing only.",
  },
  {
    code: "INV-31", name: "Shipborne Integrated Air Defense Radar", track: "ITAR", domain: "Defense / Sensing",
    independent: [
      "1. A shipborne air-defense radar comprising: a phased-array antenna; a transmit/receive module array coupled to the phased-array antenna; and a signal processor configured to form multiple simultaneous beams and to detect and track airborne targets.",
    ],
    dependent: [
      "2. The radar of claim 1, wherein the signal processor performs adaptive beamforming to null clutter.",
      "3. The radar of claim 1, further comprising a track-while-scan mode.",
    ],
    note: "ITAR Cat XI. US filing only.",
  },
  {
    code: "INV-33", name: "Multi-Domain Command & Control Fusion Node", track: "ITAR", domain: "Defense / AI",
    independent: [
      "1. A command-and-control fusion node comprising: a multi-source data ingest interface; a correlation processor configured to fuse heterogeneous sensor and intelligence data; and a decision-support output configured to present a common operating picture.",
    ],
    dependent: [
      "2. The node of claim 1, wherein the correlation processor performs entity resolution across domains.",
      "3. The node of claim 1, further comprising an alerting engine responsive to a fused threat indicator.",
    ],
    note: "ITAR Cat XV. US filing only.",
  },
];

export const EQUITY_ASK = {
  summary:
    "Two-track equity raise. Track A (ITAR defense, 10 assets) seeks $500k–$2M from cleared US defense investors to fund DDTC registration, provisional filings, and an SBIR campaign. Track B (Non-ITAR, 10 lead assets of a 125-asset clean portfolio) seeks $500k–$2M via SAFE/convertible note to fund provisionals, an independent IP valuation, and humanitarian-deployment pilots. Combined target $1M–$4M; the non-ITAR track can close first (no DDTC wait).",
  trackA: {
    title: "Track A — ITAR Defense Portfolio ($500k–$2M)",
    use: "DDTC registration + Technology Control Plan, cleared counsel for 10 ITAR provisionals, AFWERX + Army ARL SBIR submissions, cleared-staff onboarding.",
    investor: "US-citizen cleared defense investors, defense primes, strategic OEMs. NDA + ITAR screening required before any technical disclosure.",
    structure: "SAFE or convertible note, valuation cap negotiated. Founder retains majority.",
    risk: "Filing alone is not a guarantee of patentability; export control slows disclosure. Mitigations: US-only filing, trade-secret retention where publication is a risk, SBIR non-dilutive funding first.",
  },
  trackB: {
    title: "Track B — Non-ITAR Clean Portfolio ($500k–$2M)",
    use: "10 non-ITAR provisionals, independent IP valuation of the clean slice, humanitarian/global-health pilot partnerships, NASA SBIR + ARPA-E submissions.",
    investor: "General angels, foundations, global-health funders, climate/energy funds. No clearance required.",
    structure: "SAFE or convertible note. Founder retains majority.",
    risk: "TRL 3–4, no regulatory clearance for therapeutic claims. Mitigations: research-license model, 'investigational device' labeling, foundation grants before VCs.",
  },
};

// Investor deck — slide outline with speaker notes.
export const DECK_SLIDES = [
  { title: "Aethon Apex / ZDS33 — Two-Track IP Equity Raise",
    bullets: ["20 lead inventions across two portfolios", "ITAR defense: 10 assets", "Non-ITAR clean: 10 lead assets (of 125)", "Target raise: $1M–$4M combined"],
    notes: "Open by framing the two-track structure. The reason for two tracks is export control: the defense slice is ITAR-gated and can only be shown to cleared US investors, while the clean slice is open to anyone. Combined ask is one to four million dollars; the clean track can close first because it has no DDTC wait." },
  { title: "The Portfolio at a Glance",
    bullets: ["33 inventions documented (INV-01–33)", "Plus 10 lead non-ITAR research builds (BP series + Omega MedBed + AATCS)", "6 domains: comms, autonomy, sensing, power, AI, medical", "Preliminary Design Review complete for the defense set"],
    notes: "Twenty of these inventions have provisional-filing authorization. The defense set has a completed PDR package. Emphasize breadth — six technical domains — but be honest that readiness is design to prototype stage, TRL three to four." },
  { title: "IP Status — Be Honest",
    bullets: ["Zero patents granted. Zero filed at the USPTO today.", "Claim drafts prepared; provisional filing is the immediate next step", "No revenue, no executed licenses, no independent valuation", "20 internal filing authorizations approved; counsel being retained"],
    notes: "This is the most important honesty slide. We have zero filed patents. The provisional filings are the very next action and will establish priority dates. We have no revenue and no independent valuation. Any dollar figure we discussed before is an internal estimate, not a market valuation. Investors respect a founder who says this plainly." },
  { title: "Track A — ITAR Defense ($500k–$2M)",
    bullets: ["10 assets: INV-01, 03, 05, 26–31, 33", "Quantum mesh, swarm AI, bio-threat, EW SIGINT, air-defense radar, C2 fusion", "Use of funds: DDTC registration + TCP, cleared counsel, SBIR", "Investors: cleared US only, NDA + ITAR screening"],
    notes: "Walk through three flagship assets — the quantum mesh node, the swarm AI core, and the bio-threat spectrometer. These map directly to AFWERX and Army ARL SBIR topics. Stress that DDTC registration is a prerequisite to any disclosure, and that is what part of the raise funds." },
  { title: "Track B — Non-ITAR Clean ($500k–$2M)",
    bullets: ["10 lead assets: Omega MedBed, AATCS-P1, AEGH, Anenergy Pump, VPO, OS Magnetic Generator, Whittaker PCM, MFCS, Biofield Chamber, Priore-Type", "Humanitarian + deep-space + energy", "Use of funds: 10 provisionals, independent valuation, humanitarian pilots", "No DDTC gating — can close immediately"],
    notes: "This is the faster track. No export control. The humanitarian tag opens foundations and global-health funders; the deep-space tag opens NASA SBIR; the energy tag opens ARPA-E. We market everything here as civilian research devices — we do NOT position any clean asset as a weapon, because that re-triggers export control." },
  { title: "Non-Dilutive Funding First",
    bullets: ["AFWERX SBIR (INV-01) — up to $1.9M Phase I+II", "Army ARL SBIR (INV-03)", "NASA SBIR deep-space power/sensing — $150k–$850k", "ARPA-E clean energy — $100k–$750k", "Global-health grants (humanitarian therapeutics) — $250k–$1.5M"],
    notes: "Before we spend a dollar of equity, we chase non-dilutive money. SBIR and ARPA-E grants do not cost equity. Five proposals are drafted and ready to submit. This de-risks the equity round because even if the round is slow, grant money keeps the work moving." },
  { title: "Use of Funds",
    bullets: ["40% — provisional + non-provisional patent filings (both tracks)", "25% — DDTC registration + Technology Control Plan (Track A)", "20% — independent IP valuation + due-diligence package", "15% — humanitarian pilot + first research license"],
    notes: "Forty percent goes straight to IP protection — this is the highest-leverage spend because an unfiled invention has no defensible value. Twenty-five percent funds the export-control infrastructure that Track A cannot proceed without. Keep runway lean; the raise is for IP and compliance, not burn." },
  { title: "Milestones to Close",
    bullets: ["Day 0–3: retain registered patent counsel", "Day 4–21: file 10 non-ITAR provisionals", "Day 10–40: file 10 ITAR provisionals under TCP", "Day 14–60: submit 5 grant proposals", "Day 21+: open data room, pitch investors"],
    notes: "This is the step-by-step. The non-ITAR provisionals go first because they are ungated. ITAR provisionals follow under a Technology Control Plan. Grant proposals go in parallel. Only once priority dates are established do we open the data room — no disclosure before filing." },
  { title: "Risk & Mitigation",
    bullets: ["No filed patents → file provisionals immediately", "ITAR exposure → DDTC + TCP, US-only filing, cleared counsel", "Therapeutic claims unproven → 'investigational device' labeling, research-license model", "Two competing asks → consolidated to one two-track raise"],
    notes: "We previously had conflicting asks — the teaser said one number, the briefing said another. We have consolidated to a single two-track raise. The therapeutic assets are research devices until FDA clearance; we will not claim therapeutic effect in any filing or pitch." },
  { title: "The Ask",
    bullets: ["Track A: $500k–$2M (cleared US defense investors)", "Track B: $500k–$2M (general/foundation/energy)", "Structure: SAFE or convertible note", "Founder retains majority; single IP holding entity"],
    notes: "Close with the ask. We will accept either track or both. Structure is founder-friendly SAFE or convertible note. All IP will be assigned to a single holding entity with a clean cap table before any check clears. The floor is five hundred thousand per track; the ceiling is two million per track." },
];

// Drafted grant proposals — structured for the page and for export.
export const GRANT_PROPOSALS = [
  {
    id: "afwerx-inov01",
    title: "AFWERX SBIR Phase I — Quantum-Encrypted Tactical Mesh Network Node (INV-01)",
    program: "AFWERX / USAF SBIR Phase I",
    amount: "$75,000 (Phase I); up to $1.9M Phase I+II follow-on",
    period: "3 months Phase I",
    deadline: "Open topic — rolling submission; target March 2027 cycle",
    applicant: "Aethon Apex IP Holdings (small business, US-owned)",
    keywords: "quantum key distribution, tactical mesh, disruption-tolerant networking",
    objective:
      "Develop and demonstrate a prototype tactical mesh network node that integrates quantum key distribution (QKD) with a disruption-tolerant mesh-radio stack, enabling encrypted peer-to-peer links among dismounted, vehicle, and unattended-sensor nodes without reliance on fixed key-infrastructure.",
    innovation:
      "Existing tactical mesh systems rely on pre-shared or PKI-derived keys that are vulnerable to capture and to long-term quantum decryption. Integrating QKD at the node level removes key-distribution trust assumptions and enables forward secrecy without a central authority. The novelty is the pairing of a low-SWaP QKD module with a store-and-forward mesh routing layer optimized for intermittent links.",
    approach:
      "Phase I: (1) finalize the QKD module and mesh-radio interface specification; (2) build a bench-top two-node demonstrator; (3) characterize key-rate vs. link budget and mesh re-convergence time under induced link disruption; (4) deliver a Phase II plan with subsystem TRL targets. The work uses COTS QKD components and a software-defined mesh-radio for rapid prototyping.",
    phase1_tasks: [
      "Task 1 — QKD-module integration and key-interface specification",
      "Task 2 — Two-node benchtop mesh demonstrator",
      "Task 3 — Link-budget and disruption characterization",
      "Task 4 — Phase II plan and TRL roadmap",
    ],
    commercialization:
      "Dual-use: defense tactical networking (Army, USAF, USSOCOM) and secure industrial IoT. Phase II adds a fieldable prototype; Phase III targets transition to a prime integrator. ITAR-controlled; commercialization limited to US-cleared partners per DDTC licensing.",
    personnel: "Principal Investigator (inventor); one RF/SDR engineer; one cryptographer; one part-time systems engineer. US persons only.",
    facilities: "US-based lab with shielded RF test enclosure; cleared workspace for ITAR technical data.",
    similar_work: "No prior federal funding on this invention. The inventor has completed the PDR package (AX-ZDS-PDR-001 Rev 1.0).",
    itar: "ITAR Cat XV. Work performed entirely in the United States by US persons. No foreign nationals. Export-controlled technical data handled under a Technology Control Plan.",
  },
  {
    id: "army-arl-inov03",
    title: "Army ARL SBIR — Autonomous Swarm Coordination AI Core (INV-03)",
    program: "Army Research Laboratory SBIR Phase I",
    amount: "$100,000 (Phase I)",
    period: "6 months Phase I",
    deadline: "Army ARL SBIR topics — rolling; target FY27 cycle",
    applicant: "Aethon Apex IP Holdings",
    keywords: "swarm autonomy, distributed coordination, resilient multi-agent systems",
    objective:
      "Develop a peer-to-peer swarm coordination core that maintains coordinated mission behavior among heterogeneous autonomous agents despite individual agent loss, communication degradation, and partial observability.",
    innovation:
      "Most swarm stacks use a centralized coordinator that is a single point of failure. This work places an identical coordination core on each agent operating as peers, with a distributed re-assignment algorithm that re-plans tasking within seconds of agent loss. The novelty is the peer-reconfigurable coordination algorithm and its bounded re-convergence guarantee.",
    approach:
      "Phase I: (1) specify the peer coordination protocol and state-exchange format; (2) implement in simulation with 10–50 agents across mixed mission types; (3) characterize re-convergence time and mission-completion rate under induced attrition; (4) deliver a Phase II hardware-in-the-loop plan.",
    phase1_tasks: [
      "Task 1 — Peer coordination protocol specification",
      "Task 2 — 10–50 agent simulation environment",
      "Task 3 — Attrition and degradation characterization",
      "Task 4 — Phase II hardware-in-the-loop plan",
    ],
    commercialization: "Transition targets: Army ERDC, PEO Soldier, SOCOM. Dual-use: warehouse/forestry robotics. ITAR-controlled.",
    personnel: "Principal Investigator; one multi-agent AI engineer; one simulation engineer. US persons only.",
    facilities: "US-based compute lab; cleared workspace.",
    similar_work: "None federal. PDR package complete.",
    itar: "ITAR Cat XV / Cat VIII. US persons only. TCP enforced.",
  },
  {
    id: "nasa-sbir-deepspace",
    title: "NASA SBIR Phase I — Deep-Space Power & Sensing (5 assets)",
    program: "NASA SBIR/STTR Phase I",
    amount: "$150,000 (Phase I); up to $850,000 Phase II",
    period: "6 months Phase I",
    deadline: "NASA SBIR solicitation — target March 2027",
    applicant: "Aethon Apex IP Holdings",
    keywords: "atmospheric energy harvesting, vacuum-potential oscillation, phase-conjugate communications",
    objective:
      "Advance five deep-space power and communications concepts toward TRL 5: the Atmospheric Electrostatic Gradient Harvester (AEGH), the Anenergy Pump, the Vacuum Potential Oscillator (VPO), the Open-System Magnetic Generator, and the Whittaker Wave Phase-Conjugate Mirror. Phase I focuses on AEGH and the Whittaker PCM as the two highest-readiness leads.",
    innovation:
      "The AEGH harvests atmospheric electrostatic potential gradients for sustained low-power supply to high-altitude / orbital sensors — an alternative to limited-life primary batteries. The Whittaker PCM enables retrodirective phase-conjugate communication links tolerant to platform motion. Both reduce mass and increase mission duration.",
    approach:
      "Phase I: (1) benchtop AEGH characterization across altitude-simulated potential gradients; (2) Whittaker PCM benchtop demonstration of phase-conjugate return at microwave frequencies; (3) TRL roadmap and Phase II flight-relevant test plan for all five assets.",
    phase1_tasks: [
      "Task 1 — AEGH benchtop characterization",
      "Task 2 — Whittaker PCM benchtop demonstration",
      "Task 3 — Mass/power model for deep-space mission insertion",
      "Task 4 — Phase II flight-relevant test plan",
    ],
    commercialization: "Civil space (NASA, DoD space). Non-ITAR for civil-space path; ITAR review if dual-use defense insertion pursued.",
    personnel: "Principal Investigator; one power-electronics engineer; one RF engineer. US persons.",
    facilities: "US-based lab with vacuum and high-voltage test capability.",
    similar_work: "None federal. Build-plan compendium complete.",
    itar: "Civil-space track is non-ITAR. If a defense insertion is pursued, the relevant asset moves to the ITAR track under a separate TCP.",
  },
  {
    id: "arpa-e-clean-energy",
    title: "ARPA-E / DOE SBIR — Clean Energy (4 power assets)",
    program: "ARPA-E Open FOA + DOE SBIR Phase I",
    amount: "$100,000–$750,000",
    period: "6–12 months",
    deadline: "ARPA-E Open FOA rolling; DOE SBIR — target February 2027",
    applicant: "Aethon Apex IP Holdings",
    keywords: "electrostatic energy harvesting, resonant power, magnetic generation",
    objective:
      "Characterize the energy-conversion performance of four power-generation concepts — AEGH, Anenergy Pump, VPO, Open-System Magnetic Generator — under controlled benchtop conditions, and deliver an honest, measurement-based performance assessment suitable for go/no-go to Phase II.",
    innovation:
      "These concepts target unconventional energy-conversion mechanisms. The innovation is not a claim of over-unity output — ARPA-E will not fund such claims — but a rigorous, independently-characterizable apparatus and method that lets a third party reproduce and measure the conversion behavior.",
    approach:
      "Phase I: (1) build benchtop apparatus for each concept per the compendium build plan; (2) measure input vs. output power under calibrated load with independent instrumentation; (3) publish a characterization report (positive or null result); (4) Phase II plan for any concept showing a viable conversion path.",
    phase1_tasks: [
      "Task 1 — Benchtop build of four apparatus",
      "Task 2 — Calibrated input/output power measurement",
      "Task 3 — Independent characterization report",
      "Task 4 — Phase II go/no-go plan",
    ],
    commercialization: "Grid-adjacent and off-grid power. Non-ITAR. Climate/energy is the most funded non-defense lane.",
    personnel: "Principal Investigator; one power-electronics engineer; one metrology engineer.",
    facilities: "US-based power lab with calibrated calorimetry and electrical instrumentation.",
    similar_work: "None federal.",
    itar: "Non-ITAR. No export-control restrictions.",
  },
  {
    id: "global-health-therapeutics",
    title: "Global-Health Grant — Humanitarian Therapeutic Devices (5 assets)",
    program: "BARDA / NIH / Gates Foundation global-health programs",
    amount: "$250,000–$1,500,000",
    period: "12 months",
    deadline: "Rolling; target April 2027 cycle",
    applicant: "Aethon Apex IP Holdings",
    keywords: "investigational device, multi-modal therapy, coherence therapy, biofield research",
    objective:
      "Advance five humanitarian therapeutic-device concepts toward IRB-approved first-in-human research studies: the Omega MedBed 18-modality platform, AATCS-P1, the Morphogenetic Field Coherence Synchronizer (MFCS), the Biofield Frequency Exposure Chamber, and the Priore-Type Multichannel EM Therapy System.",
    innovation:
      "These devices combine multiple non-invasive modalities (PEMF, photobiomodulation, acoustic) under a single closed-loop controller. The innovation is the integrated, protocol-driven multi-modal controller — not a claim of therapeutic effect, which must be established by the research itself.",
    approach:
      "Phase I: (1) finalize the five device specifications to research-grade build plans; (2) assemble an Institutional Review Board (IRB) protocol for a first-in-human observational study; (3) build two clinical-grade prototype units; (4) submit the IRB package. No therapeutic claims are made until IRB-approved data exists.",
    phase1_tasks: [
      "Task 1 — Research-grade device specifications (5 devices)",
      "Task 2 — IRB observational-study protocol",
      "Task 3 — Two clinical-grade prototype builds",
      "Task 4 — IRB submission package",
    ],
    commercialization: "Humanitarian deployment + research licensing. Devices are 'investigational' until FDA clearance; commercialization is research-license and sponsored-study first.",
    personnel: "Principal Investigator; one biomedical engineer; one clinical-study coordinator; one regulatory consultant.",
    facilities: "US-based biomedical build lab; partner clinical site for IRB study.",
    similar_work: "None federal. AATCS-P1 derived from the Unified Theory of Regenerative Technology (UTRT).",
    itar: "Non-ITAR. No export-control restrictions. All therapeutic claims deferred pending IRB data.",
  },
];