// ── AATCS-P2 Adaptive Resonance Therapy Pod — Research Platform Data ──────────
// Inspired by (but not copying) the reported characteristics of the Prioré machine.
// All modules are research-grade, characterized, and measurable.

export const POD_OVERVIEW = {
  id: "AATCS-P2",
  name: "Adaptive Resonance Therapy Pod",
  subtitle: "Research Platform — Multimodal Synchronized Stimulation",
  revision: "REV A — CONCEPT SPEC",
  status: "Research Platform · Not a Medical Device",
  tagline: "Advancing understanding of how combinations of well-characterized physical stimuli interact with human physiology.",
  description: "Instead of attempting to duplicate the Prioré machine, the AATCS-P2 incorporates research modules inspired by its reported characteristics — modulated magnetic fields, multiple oscillators, and synchronized energy delivery — implemented with modern, fully-characterized, measurable engineering. Every output is measurable and logged. The platform's primary purpose is research; any therapeutic applications require independent scientific validation before claims are made.",
  disclaimer: "Conceptual research platform. Not a medical device. Not for clinical use. All stimulation parameters operate within established safety limits. Therapeutic claims require independent scientific validation.",
};

export const POD_BADGES = [
  { label: "6 Research Modules", color: "#06b6d4" },
  { label: "10 Hardware Modules", color: "#a855f7" },
  { label: "Multimodal Sync", color: "#10b981" },
  { label: "AI Adaptive Control", color: "#f59e0b" },
];

// ── 6 Research Modules ─────────────────────────────────────────────────────
export const RESEARCH_MODULES = [
  {
    id: 1,
    title: "Multi-Frequency Electromagnetic Resonance Chamber",
    icon: "Waves",
    color: "#06b6d4",
    historical: [
      "Modulated magnetic fields",
      "Microwave energy",
      "Multiple oscillators",
    ],
    modern: [
      "Low-field Helmholtz coils",
      "Independently programmable waveform generators",
      "Real-time field mapping",
      "Automatic safety limits",
      "Continuous dosimetry logging",
    ],
    researchFocus: "Every output is measurable and characterized. The chamber generates precisely controlled, low-intensity electromagnetic fields across multiple frequencies simultaneously, with full real-time instrumentation.",
  },
  {
    id: 2,
    title: "Resonant Field Synchronization Engine",
    icon: "RefreshCw",
    color: "#10b981",
    historical: [
      "Prioré reportedly synchronized multiple energy sources",
    ],
    modern: [
      "PEMF (Pulsed Electromagnetic Field)",
      "Photobiomodulation (light therapy)",
      "Acoustic stimulation (vibroacoustic)",
      "Breathing guidance (paced respiration)",
      "Environmental conditioning (thermal, humidity)",
    ],
    researchFocus: "Rather than operating each subsystem independently, the engine synchronizes all modalities using precise phase relationships. The core research question: does synchronized delivery produce different physiological responses than unsynchronized delivery?",
  },
  {
    id: 3,
    title: "Adaptive Biofeedback Loop",
    icon: "Activity",
    color: "#ef4444",
    historical: [
      "Prioré machine reportedly adjusted based on subject response",
    ],
    modern: [
      "HRV (Heart Rate Variability)",
      "ECG (Electrocardiogram)",
      "Respiration rate and pattern",
      "GSR (Galvanic Skin Response)",
      "Skin temperature",
      "EEG (optional, 19-channel)",
    ],
    researchFocus: "The system continuously monitors physiological signals and automatically adjusts stimulation parameters based on predefined safety rules and research protocols. A closed-loop adaptive controller keeps all outputs within validated safe operating ranges.",
  },
  {
    id: 4,
    title: "Electromagnetic Characterization Module",
    icon: "Gauge",
    color: "#f59e0b",
    historical: [
      "Main criticism of Prioré work: insufficient technical characterization",
    ],
    modern: [
      "Magnetic field strength (3-axis Hall probe)",
      "Frequency spectrum (real-time FFT)",
      "RF leakage (ambient and radiated)",
      "Electric field strength",
      "Harmonic content (THD analysis)",
      "Coil temperature (NTC array)",
      "Impedance (per-channel LCR)",
      "Power consumption (per rail)",
    ],
    researchFocus: "A comprehensive measurement subsystem that records every electromagnetic output. This directly addresses the primary criticism of historical Prioré research: insufficient technical characterization. All data is logged for reproducibility.",
  },
  {
    id: 5,
    title: "Physiological Resonance Mapping",
    icon: "Brain",
    color: "#a855f7",
    historical: [
      "Prioré sought a single 'healing frequency'",
    ],
    modern: [
      "Multi-variable input space (waveform, wavelength, acoustic pattern, temperature, duration)",
      "Multi-output measurement (HRV, EEG bands, respiration, skin conductance, subjective comfort)",
      "Longitudinal session database",
      "AI pattern recognition across sessions",
    ],
    researchFocus: "Instead of seeking a single 'healing frequency,' the system builds individualized response maps. Over many sessions, AI identifies reproducible patterns for further study — turning anecdotal observation into structured data.",
    mappingTable: [
      { input: "Magnetic waveform", output: "HRV" },
      { input: "Light wavelength", output: "EEG bands" },
      { input: "Acoustic pattern", output: "Respiration" },
      { input: "Temperature", output: "Skin conductance" },
      { input: "Session duration", output: "Subjective comfort" },
    ],
  },
  {
    id: 6,
    title: "AI Digital Twin",
    icon: "Cpu",
    color: "#6366f1",
    historical: [
      "No historical equivalent — novel research addition",
    ],
    modern: [
      "Computational model of each participant",
      "Predicts expected physiological responses",
      "Personalizes future session parameters",
      "Operates within validated safety limits",
      "Trains on longitudinal session data",
    ],
    researchFocus: "The pod creates a computational model of each participant that predicts expected physiological responses and helps personalize future sessions while remaining within validated safety limits. The digital twin improves with each session.",
  },
];

// ── Hardware Engineering Modules ────────────────────────────────────────────
export const HARDWARE_MODULES = [
  { name: "Toroidal magnetic field coils", desc: "Low-field toroidal coils for contained, characterized magnetic field generation", icon: "Circle" },
  { name: "Multi-axis Helmholtz coil arrays", desc: "3-axis Helmholtz pairs for uniform, programmable field vectors", icon: "Box" },
  { name: "Phase-synchronized oscillator network", desc: "Multiple oscillators locked to a common time base with adjustable phase", icon: "Radio" },
  { name: "Wideband waveform synthesizers", desc: "DDS-based arbitrary waveform generation across full frequency range", icon: "Waveform" },
  { name: "Low-power RF research module", desc: "Operates within regulatory limits; fully characterized output", icon: "Wifi" },
  { name: "Precision impedance monitoring", desc: "Per-channel LCR measurement for coil health and characterization", icon: "Gauge" },
  { name: "Environmental isolation enclosure", desc: "Acoustic and thermal isolation for controlled research conditions", icon: "Shield" },
  { name: "Electromagnetic shielding", desc: "Faraday enclosure to contain fields and exclude external interference", icon: "ShieldCheck" },
  { name: "Fiber-optic sensing", desc: "Immune to EM interference; for temperature and field measurement inside chamber", icon: "Cable" },
  { name: "Adaptive cooling system", desc: "Closed-loop thermal management maintaining coil and electronics within spec", icon: "Thermometer" },
];

// ── Novel Research Features (software & systems integration) ───────────────
export const NOVEL_FEATURES = [
  { title: "AI-guided optimization of multimodal stimulation", desc: "Machine learning searches the multi-modal parameter space for optimal combinations within safe ranges.", icon: "Sparkles" },
  { title: "Automatic resonance scanning", desc: "System scans across predefined safe operating ranges to identify individual resonance responses.", icon: "Radar" },
  { title: "Real-time multi-channel synchronization", desc: "All stimulation channels phase-locked with sub-millisecond precision.", icon: "Timer" },
  { title: "Comprehensive session logging", desc: "Every parameter, sensor reading, and environmental condition logged for full reproducibility.", icon: "Database" },
  { title: "Standardized comparison protocols", desc: "Built-in protocols for comparing physiological responses across sessions and subjects.", icon: "ClipboardList" },
];

// ── Scientific Development Strategy (4 phases) ─────────────────────────────
export const DEVELOPMENT_PHASES = [
  {
    phase: "1",
    title: "Engineering Validation",
    desc: "Verify field generation, synchronization, calibration, and safety. All subsystems characterized independently against specifications.",
    color: "#06b6d4",
    deliverables: ["Field mapping report", "Synchronization jitter <1ms", "Safety limit verification", "Calibration certificates"],
  },
  {
    phase: "2",
    title: "Bench Testing",
    desc: "Confirm repeatable physical outputs with instrumentation. Phantom and sensor-based testing before any human interaction.",
    color: "#10b981",
    deliverables: ["Repeatability data", "Thermal stability", "EM characterization report", "Failure mode analysis"],
  },
  {
    phase: "3",
    title: "Healthy Volunteer Studies",
    desc: "Evaluate comfort, usability, and measurable physiological responses under ethical oversight. IRB-approved protocols.",
    color: "#f59e0b",
    deliverables: ["IRB approval", "Comfort/usability metrics", "Physiological response data", "Safety profile"],
  },
  {
    phase: "4",
    title: "Clinical Research",
    desc: "If warranted, study specific outcomes through appropriately designed trials. Independent validation required before any claims.",
    color: "#ef4444",
    deliverables: ["Trial design", "Outcome metrics", "Statistical analysis", "Peer-reviewed publication"],
  },
];

// ── Next-Generation Platform Vision ─────────────────────────────────────────
export const PLATFORM_VISION = [
  "AI adaptive control",
  "Multimodal sensing",
  "Photobiomodulation",
  "Low-field magnetic stimulation",
  "Acoustic stimulation",
  "Thermal regulation",
  "Physiological digital twins",
  "Comprehensive instrumentation",
  "Synchronization and resonance research",
];

export const VISION_STATEMENT = "The result is a platform that integrates AI adaptive control, multimodal sensing, and comprehensive instrumentation to advance understanding of how combinations of well-characterized physical stimuli interact with human physiology. Any therapeutic applications require independent scientific validation before claims are made.";