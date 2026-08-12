// ── ULTIMATE MEDBED ENGINEERING DATA ───────────────────────────────────────
// ZA-MB-OMEGA — The world's first unified multi-modal healing device combining
// ALL documented suppressed and emerging healing technologies into one apparatus.
// 18 simultaneous therapeutic modalities under closed-loop AI control.
// For research and experimental use only. Not medical advice.

export const MEDBED_OVERVIEW = {
  designator: "ZA-MB-Ω",
  name: "Zenith Apex Omega MedBed",
  revision: "Rev A — PDR Release",
  classification: "Research Only — Not for Sale",
  date: "2026-08-12",
  leadEngineer: "Zenith Apex Research Division",
  documentControl: "ZA-ENG-MB-OMEGA-A",
  synopsis:
    "The Omega MedBed is a full-body supine therapy chamber that unifies every documented suppressed and emerging healing modality — scalar EM, Prioré phase-conjugation, Rife mortal oscillatory rates, Reich orgone, Schauberger vortex water, Vedic nada acoustics, Global Scaling resonance, photobiomodulation, PEMF, vibroacoustic, far-infrared, microcurrent, hydrogen inhalation, negative ions, chromotherapy, ozone, and EEG neurofeedback — into a single clinical-grade apparatus with closed-loop biometric AI dosimetry.",
};

// ── 18 MODALITIES ──────────────────────────────────────────────────────────
export const MODALITIES = [
  { code: "PBM", label: "Photobiomodulation", category: "Photonic", color: "#ef4444", icon: "Sun",
    spec: "660/810/850nm NIR — 5×5 full-body calibration grid, 100-120 mW/cm²",
    desc: "Full-body LED array overhead + lateral panels. 810nm transcranial for TBI, 660nm systemic, 850nm deep tissue. Dual-wavelength pulsable.",
    sourceRef: "Tier 1 — FDA-cleared 810nm transcranial PBM (NeuroThera, Vielight)" },
  { code: "PEMF", label: "Pulsed EM Field", category: "Electromagnetic", color: "#3b82f6", icon: "Magnet",
    spec: "0.5-4 Hz delta + 7.83 Hz Schumann — 2×2 Helmholtz under-mattress matrix",
    desc: "Dual-mode PEMF: delta-band for neuroinduction/sleep + Schumann resonance for grounding. Uniform field through supine body via floor coil grid.",
    sourceRef: "Tier 1 — FDA-cleared PEMF (Orthofix, Bemer)" },
  { code: "VAT", label: "Vibroacoustic Therapy", category: "Acoustic", color: "#a855f7", icon: "Volume2",
    spec: "20-528 Hz — 8-transducer mattress-embedded array",
    desc: "Full dorsal surface haptic delivery through memory foam. Somatic tremor facilitation (TRE) at 20-40 Hz, sensory integration at 40-528 Hz.",
    sourceRef: "Tier 1 — VAT clinical evidence (NHS, Vibroacoustic Therapy Association)" },
  { code: "FIT", label: "Far-Infrared Thermal", category: "Thermal", color: "#f97316", icon: "Flame",
    spec: "5-14μm wavelength — 37-55°C, side-wall + under-mattress panels",
    desc: "Tri-surface FIR envelope wrapping the body. Carbon fiber panels with NTC monitoring at 3 patient contact points. TCO 60°C hard cutoff.",
    sourceRef: "Tier 1 — FIR sauna therapy (published meta-analyses)" },
  { code: "SFT", label: "Scalar Field / Phase-Conjugate", category: "Electromagnetic", color: "#06b6d4", icon: "Radio",
    spec: "10-40 kHz carrier — 8-pair octagonal bifilar coil array",
    desc: "Bearden scalar EM: counter-phased bifilar coils produce longitudinal waves (E=0, B=0, ∇φ≠0). Phase-conjugate replicas for cellular regeneration. Prioré F1×F2×F3→Fz modulation impressed on carrier.",
    sourceRef: "Tier 3 — Bearden scalar EM theory; Prioré ONR Report R-5-78" },
  { code: "MCT", label: "Microcurrent Therapy", category: "Electrical", color: "#ec4899", icon: "Zap",
    spec: "1-999μA — 4-channel, head/torso/limb zones",
    desc: "Sub-threshold cellular ATP stimulation. Gold-plated electrode ports at armrest + headrest. GFCI 10μA trip + crowbar 1000μA hard cap.",
    sourceRef: "Tier 1 — FDA-cleared microcurrent (Alpha-Stim, Sota)" },
  { code: "HIT", label: "Hydrogen Inhalation", category: "Chemical", color: "#14b8a6", icon: "Wind",
    spec: "99.99% H₂ — PEM electrolyzer, 150-300 mL/min",
    desc: "Molecular hydrogen selective antioxidant (·OH scavenger). Canopy delivery. MQ-8 sensor with 25% LEL auto-shutdown. Spark-free interlock with MCT.",
    sourceRef: "Tier 2 — H₂ therapy clinical trials (Japan, China)" },
  { code: "NIA", label: "Negative Ion Therapy", category: "Environmental", color: "#2dd4bf", icon: "Cloud",
    spec: "10⁶-10⁷ ions/cm³ — corona discharge + HEPA",
    desc: "Canopy-mounted corona emitter (5-8 kV). Ozone sensor interlock at 0.03 ppm. HEPA + activated carbon filtration for sealed canopy atmosphere.",
    sourceRef: "Tier 2 — Negative ion literature (Journal of Negative Ions)" },
  { code: "BIO", label: "Biometric AI Closed-Loop", category: "Control", color: "#10b981", icon: "Activity",
    spec: "HRV + SpO₂ + EEG + GSR + Temp — 100ms cycle",
    desc: "ARM Cortex-A72 + STM32H7 + TensorFlow Lite. Real-time adaptive dosimetry across all 18 modalities. BFAC safety engine monitors thresholds with <100ms cutoff.",
    sourceRef: "Tier 1 — Closed-loop physiological control (FDA guidance)" },
  { code: "PRI", label: "Prioré Multichannel Modulator", category: "Electromagnetic", color: "#2dd4bf", icon: "Waves",
    spec: "F1×F2×F3→Fz — Bedini-conditioned electron tubes",
    desc: "Antoine Prioré's 3-channel modulation: F1 (9.4-21.4Hz), F2 (64-76Hz), F3 (9.7-39.6Hz) → derivative carrier Fz carrying structured virtual-state template. Phase-conjugate re-irradiation of patient emission delta.",
    sourceRef: "Tier 3 — Prioré French Patent 1,342,772 (1962); ONR Report R-5-78" },
  { code: "RIF", label: "Rife / Lisitsyn Frequency", category: "Electromagnetic", color: "#f43f5e", icon: "Crosshair",
    spec: "12.5 Hz – 6.1×10¹⁴ Hz — 24 Lisitsyn windows",
    desc: "Royal Rife mortal oscillatory rates via Lisitsyn trigger-window table. Quartz-windowed UV applicators (200-400nm) for Kaznacheyev photon template disease reversal. Plasma tube array for broadband pathogen devitalization.",
    sourceRef: "Tier 3 — Rife 1934 USC trial; Lisitsyn; Kaznacheyev cytopathogenic effect" },
  { code: "ORG", label: "Reich Orgone Accumulator", category: "Biofield", color: "#65a30d", icon: "Hexagon",
    spec: "20-layer alternating organic/metallic — ≥1.0°F temp differential",
    desc: "Wilhelm Reich orgone accumulator envelope: alternating sheep wool felt (organic) and galvanized steel (metallic) layers. Measurable temperature differential per Grad (1965). Biofield concentration around patient chamber.",
    sourceRef: "Tier 3 — Reich orgone accumulator; Grad B. (1965) Int. J. Biometeorology" },
  { code: "VOR", label: "Schauberger Vortex Water", category: "Fluid", color: "#0891b2", icon: "RotateCw",
    spec: "4.0°C ±0.5°C — corrugated Repulsine impeller, 40L",
    desc: "Viktor Schauberger implosion vortex: water at 4°C (max density phase boundary) vortexed in corrugated impeller producing centripetal negentropic order. Structured water consumed pre-session. Peltier + compressor hybrid cooling.",
    sourceRef: "Tier 3 — Schauberger archives; Repulsine principle" },
  { code: "NAD", label: "Vedic Nada Acoustic", category: "Acoustic", color: "#eab308", icon: "Music",
    spec: "LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426 Hz",
    desc: "Sanskrit bija syllable formant frequencies at 7 chakra correspondence points (endocrine glands). 50 letters = 50 petals of 6 lower chakras. Tomatis Method corti→vagus→limbic pathway. Mahamrityunjaya regenerative band (12.5-39.6 Hz).",
    sourceRef: "Tier 2 — Vedic nada Brahma; Tomatis Method (1950s-90s)" },
  { code: "GSC", label: "Global Scaling Resonator", category: "Resonance", color: "#6366f1", icon: "Globe",
    spec: "5 Hz, 101 Hz, 2032 Hz, 40.8 kHz — piezoelectric G-Elements",
    desc: "Dr. Hartmut Müller's standing gravitational wave node frequencies. G-Elements (EM-isolated PZT-5H nanocrystal resonators) at <1W each. Brings body into resonance with global standing wave nodes. G-Com® demonstrated 2,500 km transmission at <1W.",
    sourceRef: "Tier 3 — Müller Global Scaling Theory (1982); G-Com® Oct 27, 2001" },
  { code: "CHM", label: "Chromotherapy", category: "Photonic", color: "#a855f7", icon: "Palette",
    spec: "WLED full-spectrum — 7 chakra colors, programmable",
    desc: "Color therapy via programmable WLED canopy array. Red (root), orange (sacral), yellow (solar plexus), green (heart), blue (throat), indigo (third eye), violet (crown). Synchronized to session protocol and bija frequencies.",
    sourceRef: "Tier 2 — Chromotherapy literature; color psychology" },
  { code: "OZO", label: "Ozone Therapy", category: "Chemical", color: "#0ea5e9", icon: "Droplet",
    spec: "Medical-grade O₃ — 0.5-5% concentration, ear + rectal insufflation",
    desc: "Ozone generator with O₂ feed gas. Medical-grade O₃ at therapeutic concentrations. Auto-off at 0.05 ppm ambient. Used for pathogen load reduction and oxygenation. Separate from HIT hydrogen channel.",
    sourceRef: "Tier 2 — Ozone therapy (International Ozone Association)" },
  { code: "EEG", label: "EEG Neurofeedback", category: "Neural", color: "#8b5cf6", icon: "Brain",
    spec: "19-channel 10-20 system — real-time FFT, alpha/theta training",
    desc: "19-channel EEG headset (canopy-mounted dock) with real-time FFT analysis. Alpha-theta neurofeedback training for trauma release. PTSD hyperarousal detection via alpha/delta ratio. Integrated with BIO closed-loop.",
    sourceRef: "Tier 1 — FDA-cleared EEG neurofeedback (BrainMaster, NeuroField)" },
];

// ── PRODUCT REQUIREMENTS DOCUMENT (PRD) ──────────────────────────────────────
export const PRD = {
  sections: [
    {
      id: "prd-1",
      title: "1.0 Purpose & Objective",
      content:
        "The Omega MedBed (ZA-MB-Ω) is designed to be the world's first unified multi-modal bioelectromagnetic therapy device that integrates every documented suppressed and emerging healing technology into a single clinical-grade apparatus. The device targets cellular regeneration, pathogen elimination, telomere rejuvenation, biofield normalization, trauma release, neuroregulation, and consciousness-state optimization through 18 simultaneously operating therapeutic modalities under closed-loop biometric AI control. The objective is to engineer a reproducible, instrumented, and safety-interlocked device that operationalizes the theoretical frameworks of Prioré, Rife, Bearden, Reich, Schauberger, Müller, and the Vedic nada/chakra system alongside FDA-cleared modalities (PBM, PEMF, MCT, EEG).",
    },
    {
      id: "prd-2",
      title: "2.0 Scope",
      content:
        "The Omega MedBed encompasses: (a) a full-body supine treatment chamber with overhead canopy and under-mattress systems, (b) 18 simultaneously operating therapeutic modalities, (c) a Prioré-type multichannel modulation subsystem, (d) a Rife/Lisitsyn frequency generation subsystem with quartz UV applicators, (e) a Reich orgone accumulator envelope (20-layer), (f) a Schauberger vortex water structuring system, (g) a Vedic nada acoustic manifold, (h) a Global Scaling piezoelectric resonator array, (i) full-body PBM/PEMF/VAT/FIT arrays, (j) hydrogen inhalation and ozone therapy subsystems, (k) chromotherapy and negative ion environmental enrichment, (l) 19-channel EEG neurofeedback, (m) a diagnostic emission-spectrum capture system, and (n) a BFAC+ACE safety monitoring and interlock subsystem. Classified as a Class III medical device concept under FDA 21 CFR Part 880 — research prototype.",
    },
    {
      id: "prd-3",
      title: "3.0 Functional Requirements",
      requirements: [
        { id: "FR-01", text: "The device shall generate scalar longitudinal EM waves (E=0, B=0, ∇φ≠0) via 8 counter-phased bifilar coil pairs operating at 10-40 kHz carrier frequency, arranged in an octagonal configuration around the patient chamber." },
        { id: "FR-02", text: "The device shall implement Prioré-type multichannel modulation: F1 (9.4-21.4 Hz), F2 (64-76 Hz), F3 (9.7-39.6 Hz) mixed to produce derivative carrier Fz that impresses a structured virtual-state template onto the target organism." },
        { id: "FR-03", text: "The device shall generate Rife mortal oscillatory rates from the Lisitsyn trigger-window frequency table (12.5 Hz – 6.1×10¹⁴ Hz) for pathogen-specific destruction via quartz-windowed UV applicators and plasma tube array." },
        { id: "FR-04", text: "The device shall implement a Reich orgone accumulator envelope with 20 alternating organic/metallic layers producing measurable ≥1.0°F temperature differential sustained for 30+ minutes." },
        { id: "FR-05", text: "The device shall implement a Schauberger implosion vortex water system operating at 4.0°C (±0.5°C) with corrugated impeller producing centripetal vortex in a 40L borosilicate chamber." },
        { id: "FR-06", text: "The device shall implement a Vedic nada acoustic manifold generating six bija syllables (LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426 Hz) at 7 chakra correspondence points with ±2 Hz precision." },
        { id: "FR-07", text: "The device shall implement a Global Scaling piezoelectric resonator array generating standing-wave node frequencies (5 Hz, 101 Hz, 2032 Hz, 40.8 kHz) via EM-isolated G-Elements at <1W each." },
        { id: "FR-08", text: "The device shall provide full-body photobiomodulation via overhead 660/810/850nm LED arrays + lateral panels in a 5×5 calibration grid at 100-120 mW/cm²." },
        { id: "FR-09", text: "The device shall provide dual-mode PEMF: 0.5-4 Hz delta induction + 7.83 Hz Schumann resonance via 2×2 Helmholtz under-mattress coil matrix." },
        { id: "FR-10", text: "The device shall provide vibroacoustic therapy via 8-transducer mattress-embedded array operating at 20-528 Hz with SPL limiting to 85 dB." },
        { id: "FR-11", text: "The device shall provide far-infrared thermal therapy via side-wall + under-mattress carbon fiber panels at 37-55°C with TCO 60°C hard cutoff." },
        { id: "FR-12", text: "The device shall provide microcurrent therapy at 1-999μA across 4 body zones with GFCI 10μA trip and crowbar 1000μA hard cap." },
        { id: "FR-13", text: "The device shall provide 99.99% hydrogen inhalation at 150-300 mL/min via PEM electrolyzer with 25% LEL auto-shutdown and spark-free interlock." },
        { id: "FR-14", text: "The device shall provide negative ion enrichment at 10⁶-10⁷ ions/cm³ with ozone interlock at 0.03 ppm." },
        { id: "FR-15", text: "The device shall provide chromotherapy via programmable WLED canopy array synchronized to session protocol and bija frequencies." },
        { id: "FR-16", text: "The device shall provide medical-grade ozone at 0.5-5% concentration for ear/rectal insufflation with auto-off at 0.05 ppm ambient." },
        { id: "FR-17", text: "The device shall provide 19-channel EEG neurofeedback with real-time FFT, alpha-theta training, and PTSD hyperarousal detection." },
        { id: "FR-18", text: "The device shall implement closed-loop biometric AI control (BFAC+ACE) monitoring HRV, SpO₂, EEG, GSR, and skin temperature at 100ms cycle with <100ms safety cutoff." },
        { id: "FR-19", text: "The device shall capture the patient's emission spectrum via UV/IR photonic sensors through quartz-windowed portholes for delta-spectrum computation and phase-conjugate re-irradiation." },
        { id: "FR-20", text: "The device shall provide a Time-Reversal Zone (TRZ) field chamber where phase-conjugate waves predominate for cellular regeneration with ratio >0.8." },
      ],
    },
    {
      id: "prd-4",
      title: "4.0 Performance Requirements",
      requirements: [
        { id: "PR-01", text: "Scalar field strength: ≥50 V/m equivalent at patient position, measured by isotropic field probe." },
        { id: "PR-02", text: "Frequency precision: ±0.01 Hz on all generated frequencies (OCXO 10 MHz, 0.01 ppb reference)." },
        { id: "PR-03", text: "Orgone temperature differential: ≥1.0°F sustained for 30+ minutes." },
        { id: "PR-04", text: "Vortex water temperature: 4.0°C ±0.5°C maintained continuously." },
        { id: "PR-05", text: "Acoustic formant precision: ±2 Hz on all bija frequencies." },
        { id: "PR-06", text: "TRZ field stability: phase-conjugate ratio >0.8 for duration of treatment." },
        { id: "PR-07", text: "Emission spectrum capture: 200-800 nm range, 0.1 nm resolution." },
        { id: "PR-08", text: "PBM irradiance: 100-120 mW/cm² uniform across 5×5 grid, junction temp <75°C." },
        { id: "PR-09", text: "PEMF field uniformity: ±5% across patient surface area." },
        { id: "PR-10", text: "Treatment cycle: 30-second to 45-minute programmable exposures, 3× weekly protocol." },
        { id: "PR-11", text: "Safety cutoff response time: <100 ms from threshold breach to full field shutdown." },
        { id: "PR-12", text: "Power consumption: <3.5 kW total (all 18 modalities active)." },
      ],
    },
    {
      id: "prd-5",
      title: "5.0 Physical Constraints",
      content:
        "Overall dimensions: 2.4m (L) × 1.6m (W) × 1.8m (H). Total mass: ≤1,200 kg. Power input: 120/240V AC, 50/60 Hz, single-phase, 30A dedicated circuit. Operating temperature: 15-30°C ambient. The device must fit through a standard 36-inch (914mm) door opening in disassembled state. Patient chamber internal dimensions: 2.1m × 0.9m × 0.5m (LWH). Canopy height adjustable 500-1200mm from patient surface. Maximum patient weight: 180 kg. Full-body supine configuration with motorized zero-gravity preset.",
    },
    {
      id: "prd-6",
      title: "6.0 Regulatory & Safety",
      content:
        "Classified as a research prototype under FDA 21 CFR Part 880 (general hospital and personal use devices). Not for clinical diagnostic or therapeutic use without IRB approval and 510(k) clearance. The device incorporates: (a) EM field exposure limiting per IEEE C95.1-2019, (b) electrical safety per IEC 60601-1, (c) thermal interlocks on all heating elements, (d) dual-channel NC emergency stop (IEC 60947-5-5), (e) patient isolation monitoring at 10μA trip, (f) UV interlocked quartz shutters, (g) H₂ auto-shutdown at 25% LEL, (h) ozone interlock at 0.03 ppm. All EM emissions within non-ionizing RF safety limits. Conceptual — subject to manufacturer validation.",
    },
  ],
};

// ── PRELIMINARY DESIGN REVIEW (PDR) ─────────────────────────────────────────
export const PDR = {
  sections: [
    {
      id: "pdr-1",
      title: "1.0 System Architecture",
      content:
        "The Omega MedBed is architected as a concentric nested full-body supine system. The outermost layer is the Reich orgone accumulator envelope (20 alternating organic/metallic layers). Within this sits the Faraday-shielded EM coil array chamber with 8-pair octagonal scalar coils. The innermost volume is the patient treatment chamber containing the memory-foam mattress with embedded VAT transducers, under-mattress PEMF matrix, and FIR panels. Above the patient is the motorized canopy housing PBM LED arrays, chromotherapy WLED, negative ion emitter, H₂ delivery, EEG headset dock, and diagnostic porthole sensors. Below the chamber floor is the Schauberger vortex water system, ozone generator, and power electronics bay. The Prioré modulator and Rife/Lisitsyn frequency system occupy a rear equipment rack. The Global Scaling resonators are mounted at 4 cardinal points. The Vedic nada acoustic manifold uses 7 directional transducers at chakra correspondence points along the chamber walls.",
      subsystems: [
        { name: "Orgone Accumulator Envelope", function: "20-layer biofield concentration (organic/metallic)", status: "Design Complete" },
        { name: "Scalar EM Octagonal Coil Array", function: "Longitudinal wave generation (8 bifilar pairs)", status: "Design Complete" },
        { name: "Prioré Multichannel Modulator", function: "F1×F2×F3→Fz structured template", status: "Design Complete" },
        { name: "Rife/Lisitsyn Frequency System", function: "Pathogen MOR + UV photon templates", status: "Design Complete" },
        { name: "Full-Body PBM Array", function: "660/810/850nm photobiomodulation", status: "Design Complete" },
        { name: "Under-Mattress PEMF Matrix", function: "2×2 Helmholtz delta + Schumann", status: "Design Complete" },
        { name: "Mattress VAT Array", function: "8-transducer vibroacoustic 20-528 Hz", status: "Design Complete" },
        { name: "Tri-Surface FIR Panels", function: "Side-wall + under-mattress 37-55°C", status: "Design Complete" },
        { name: "Microcurrent Therapy System", function: "4-zone 1-999μA with GFCI", status: "Design Complete" },
        { name: "Hydrogen Inhalation System", function: "99.99% H₂ PEM electrolyzer", status: "Design Complete" },
        { name: "Negative Ion + HEPA System", function: "10⁷ ions/cm³ canopy enrichment", status: "Design Complete" },
        { name: "Chromotherapy WLED Array", function: "7-color chakra-synchronized", status: "Design Complete" },
        { name: "Ozone Therapy Subsystem", function: "Medical-grade O₃ insufflation", status: "Design Complete" },
        { name: "EEG Neurofeedback System", function: "19-channel 10-20 FFT + alpha-theta", status: "Design Complete" },
        { name: "Schauberger Vortex Water System", function: "4°C implosion vortex structuring", status: "Design Complete" },
        { name: "Vedic Nada Acoustic Manifold", function: "Bija syllable formant generation", status: "Design Complete" },
        { name: "Global Scaling Resonator Array", function: "Standing gravitational wave nodes", status: "Design Complete" },
        { name: "Emission Spectrum Diagnostic", function: "UV/IR porthole capture + delta", status: "Design Complete" },
        { name: "BFAC+ACE Closed-Loop Controller", function: "Biometric AI dosimetry all modalities", status: "Design Complete" },
        { name: "Safety & Interlock Subsystem", function: "Multi-modal safety cutoff <100ms", status: "Design Complete" },
      ],
    },
    {
      id: "pdr-2",
      title: "2.0 Scalar EM + Prioré Subsystem Design",
      content:
        "The scalar EM subsystem uses 8 counter-phased bifilar coil pairs (AWG 14, 144 turns, Fair-Rite 77 MnZn ferrite) arranged in an octagonal configuration around the patient chamber. Driven 180° out of phase, transverse E and B fields cancel while scalar potential gradient (∇φ) remains — producing pure longitudinal waves. Carrier tunable 10-40 kHz with ±0.01 Hz precision (OCXO 10 MHz, 0.01 ppb). The Prioré modulator impresses F1 (9.4-21.4 Hz), F2 (64-76 Hz), F3 (9.7-39.6 Hz) onto the carrier, producing derivative Fz carrying the structured virtual-state template. Bedini-conditioned electron tubes operate in reversed mode. The system captures the patient's emission spectrum, computes the delta from healthy baseline, and re-irradiates phase-conjugate replicas in the TRZ chamber.",
      designParams: [
        { param: "Coil pairs", value: "8 (octagonal array)" },
        { param: "Core material", value: "MnZn ferrite (Fair-Rite 77)" },
        { param: "Wire gauge", value: "AWG 14 enameled copper, bifilar" },
        { param: "Turns per coil", value: "144" },
        { param: "Carrier frequency", value: "10-40 kHz, tunable" },
        { param: "Frequency precision", value: "±0.01 Hz (OCXO 10 MHz)" },
        { param: "Amplifier", value: "Class-D, 8-channel, 500W/ch" },
        { param: "Field strength", value: "≥50 V/m equivalent at patient" },
        { param: "Prioré channels", value: "F1, F2, F3 → derivative Fz" },
        { param: "Electron tubes", value: "Bedini-conditioned, reversed mode" },
        { param: "TRZ phase-conjugate ratio", value: ">0.8 target" },
      ],
    },
    {
      id: "pdr-3",
      title: "3.0 PBM + PEMF + FIR Physical Therapy Subsystem Design",
      content:
        "The physical therapy layer combines three FDA-cleared modalities into a unified full-body envelope. PBM: overhead 660/810/850nm LED arrays + lateral panels in a 5×5 calibration grid at 100-120 mW/cm², with NTC per-panel temperature feedback and aluminum heat sinks (junction <75°C). PEMF: 2×2 Helmholtz under-mattress coil matrix (litz wire AWG20×50 strand) producing uniform field through the supine body, dual-mode at 0.5-4 Hz delta and 7.83 Hz Schumann. FIR: tri-surface carbon fiber panels (420×230mm) on side walls + under-mattress at 37-55°C with NTC thermistors at 3 patient contact points and TCO 60°C hard cutoff. All three modalities are coordinated by the BFAC closed-loop controller.",
      designParams: [
        { param: "PBM wavelengths", value: "660nm / 810nm / 850nm" },
        { param: "PBM irradiance", value: "100-120 mW/cm²" },
        { param: "PBM grid", value: "5×5 calibration, overhead + lateral" },
        { param: "PEMF coils", value: "2×2 Helmholtz litz matrix" },
        { param: "PEMF modes", value: "Delta 0.5-4 Hz + Schumann 7.83 Hz" },
        { param: "FIR wavelength", value: "5-14 μm" },
        { param: "FIR temperature", value: "37-55°C, TCO 60°C cutoff" },
        { param: "FIR surfaces", value: "Side walls + under-mattress" },
      ],
    },
    {
      id: "pdr-4",
      title: "4.0 Rife/Lisitsyn + Ozone + Hydrogen Chemical Therapy Design",
      content:
        "The chemical/biological therapy layer targets pathogen elimination and oxidative stress reduction. Rife/Lisitsyn: 24 biological EM coupling windows from 12.5 Hz to 6.1×10¹⁴ Hz, delivered via quartz-windowed UV applicators (200-400nm) and broadband plasma tube array. The Kaznacheyev UV photon template mechanism enables disease reversal at a distance. Ozone: medical-grade O₃ at 0.5-5% concentration from O₂ feed gas, for ear/rectal insufflation, with auto-off at 0.05 ppm ambient. Hydrogen: 99.99% H₂ via PEM electrolyzer at 150-300 mL/min, canopy delivery, with MQ-8 sensor at 25% LEL and spark-free interlock preventing simultaneous MCT electrode operation. The three subsystems are sequenced by the BFAC controller to prevent interference.",
      designParams: [
        { param: "Rife frequency range", value: "12.5 Hz – 6.1×10¹⁴ Hz" },
        { param: "Lisitsyn windows", value: "24 biological coupling windows" },
        { param: "UV applicator", value: "Quartz-windowed, 200-400nm, interlocked" },
        { param: "Plasma tube", value: "Broadband Rife plasma array" },
        { param: "Ozone concentration", value: "0.5-5% O₃ in O₂" },
        { param: "Ozone interlock", value: "Auto-off at 0.05 ppm ambient" },
        { param: "H₂ purity", value: "99.99% via PEM electrolyzer" },
        { param: "H₂ flow", value: "150-300 mL/min, canopy delivery" },
        { param: "H₂ safety", value: "25% LEL shutdown, spark-free interlock" },
      ],
    },
    {
      id: "pdr-5",
      title: "5.0 Vedic Nada + Global Scaling + EEG Resonance Design",
      content:
        "The resonance/neural layer synchronizes the patient's biofield with fundamental natural frequencies. Vedic Nada: 7 directional transducers at chakra correspondence points (endocrine glands) generating 6 bija syllables (LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426 Hz) with ±2 Hz precision, stimulating corti organ → vagus nerve → limbic system (Tomatis Method). Global Scaling: 4 piezoelectric G-Elements (PZT-5H, EM-isolated in mu-metal) generating standing gravitational wave node frequencies (5 Hz, 101 Hz, 2032 Hz, 40.8 kHz) at <1W each, bringing the body into resonance with global standing wave nodes. EEG: 19-channel 10-20 system headset (canopy-mounted dock) with real-time FFT, alpha-theta neurofeedback training for trauma release, and PTSD hyperarousal detection via alpha/delta ratio. All three feed into the BIO closed-loop controller.",
      designParams: [
        { param: "Bija frequencies", value: "LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426 Hz" },
        { param: "Chakra transducers", value: "7 directional at endocrine points" },
        { param: "G-Scaling nodes", value: "5 Hz, 101 Hz, 2032 Hz, 40.8 kHz" },
        { param: "G-Elements", value: "PZT-5H nanocrystal, mu-metal isolated" },
        { param: "EEG channels", value: "19 (10-20 international system)" },
        { param: "EEG feedback", value: "Real-time FFT, alpha-theta training" },
      ],
    },
    {
      id: "pdr-6",
      title: "6.0 Risk Assessment",
      risks: [
        { id: "R-01", risk: "Unstable TRZ field causing partial phase-conjugation of biological matter", severity: "Critical", mitigation: "Real-time phase-conjugate ratio monitoring; automatic field collapse if ratio <0.5; <100ms cutoff" },
        { id: "R-02", risk: "UV channel exposure exceeding safety limits", severity: "High", mitigation: "Interlocked quartz shutters; UV intensity monitoring; automatic shutter close on threshold breach" },
        { id: "R-03", risk: "H₂ accumulation exceeding 25% LEL (explosion risk)", severity: "Critical", mitigation: "MQ-8 sensor within 30cm of electrolyzer; auto-shutdown at 25% LEL; spark-free interlock with MCT; earth bonding" },
        { id: "R-04", risk: "Ozone ambient exceeding 0.05 ppm (respiratory irritation)", severity: "High", mitigation: "MQ-131 sensor with 2-point calibration; auto-off at 0.05 ppm; sealed canopy with HEPA ventilation" },
        { id: "R-05", risk: "FIR thermal burn from panel overheating", severity: "High", mitigation: "NTC thermistors at 3 contact points; TCO 60°C hard cutoff; ceramic fiber insulation; max 80°C during burn-in" },
        { id: "R-06", risk: "PEMF interference with cardiac implants", severity: "High", mitigation: "Contraindication screening; field strength monitoring; auto power reduction; patient isolation" },
        { id: "R-07", risk: "Scalar field interference with nearby electronics", severity: "Medium", mitigation: "Faraday-shielded chamber; minimum 3m exclusion zone; warning signage" },
        { id: "R-08", risk: "Vortex water temperature deviation beyond 4°C±0.5°C", severity: "Medium", mitigation: "Redundant PT100 sensors; Peltier + compressor hybrid cooling; automatic flow shutoff" },
        { id: "R-09", risk: "Acoustic overexposure to bija frequencies", severity: "Low", mitigation: "SPL limiting to 85 dB; patient-controlled volume; timer-limited exposure" },
        { id: "R-10", risk: "Patient claustrophobia in enclosed canopy", severity: "Medium", mitigation: "Motorized canopy with open preset; internal lighting; patient-held emergency stop; intercom" },
      ],
    },
  ],
};

// ── BILL OF MATERIALS (BOM) — 18 modalities + structural + electrical ───────
export const BOM_SUMMARY = {
  totalLineItems: 94,
  totalComponents: 1284,
  categories: 16,
};

export const BOM_CATEGORIES = [
  {
    name: "Structural & Chamber",
    color: "#64748b",
    items: [
      { ref: "STR-001", component: "Outer shell — aluminum honeycomb panels", spec: "5052-H32, 2.4m×1.6m×1.8m, 3mm skin", qty: "1", source: "Custom fabrication", notes: "Anodized black" },
      { ref: "STR-002", component: "Patient chamber inner shell — fiberglass", spec: "FR-4, 2.1m×0.9m×0.5m, 6mm", qty: "1", source: "Custom fabrication", notes: "RF transparent" },
      { ref: "STR-003", component: "Treatment bed — adjustable carbon fiber", spec: "CFRP, 2.0m×0.8m, 300kg load", qty: "1", source: "Medical grade supplier", notes: "EM transparent, zero-gravity" },
      { ref: "STR-004", component: "Motorized canopy — height adjustable", spec: "500-1200mm travel, linear actuator", qty: "1", source: "McMaster-Carr", notes: "Soft-close" },
      { ref: "STR-005", component: "Faraday shield — copper mesh", spec: "0.1mm Cu, 99.9% purity", qty: "1", source: "Specialty supplier", notes: "360° enclosure" },
      { ref: "STR-006", component: "Memory foam mattress + antimicrobial cover", spec: "Viscoelastic, 2.0m×0.8m×0.15m", qty: "1", source: "Medical supplier", notes: "VAT transducer embed" },
      { ref: "STR-007", component: "Acoustic interior panels (NRC 0.65)", spec: "Sound-isolated, perimeter", qty: "1", source: "McMaster-Carr", notes: "Sound isolation" },
    ],
  },
  {
    name: "Orgone Accumulator Envelope",
    color: "#65a30d",
    items: [
      { ref: "ORG-001", component: "Organic layer — sheep wool felt", spec: "10mm, natural undyed", qty: "20", source: "Textile supplier", notes: "Alternating layers" },
      { ref: "ORG-002", component: "Metallic layer — galvanized steel sheet", spec: "0.5mm, 24-gauge", qty: "20", source: "Metal supplier", notes: "Alternating layers" },
      { ref: "ORG-003", component: "Insulation — mineral wool", spec: "50mm, R-13", qty: "1", source: "Building supply", notes: "Thermal isolation" },
    ],
  },
  {
    name: "Scalar EM + Prioré Subsystem",
    color: "#06b6d4",
    items: [
      { ref: "EM-001", component: "Bifilar coil pair — ferrite core", spec: "Fair-Rite 77, 144 turns AWG14", qty: "8", source: "Custom wound", notes: "Octagonal array" },
      { ref: "EM-002", component: "Enameled copper magnet wire", spec: "AWG 14, 155°C polyimide", qty: "500m", source: "MWS Wire Industries", notes: "" },
      { ref: "EM-003", component: "Ferrite core — MnZn", spec: "Fair-Rite 77, OD=47mm", qty: "8", source: "Fair-Rite Products", notes: "High permeability" },
      { ref: "PRI-001", component: "Bedini electron tube — reversed mode", spec: "Custom 6L6GC variant", qty: "4", source: "Custom build", notes: "Bedini conditioning" },
      { ref: "PRI-002", component: "DDS frequency synthesizer", spec: "AD9854, 0-150 MHz, 0.01Hz res", qty: "3", source: "Analog Devices", notes: "F1, F2, F3 channels" },
      { ref: "PRI-003", component: "OCXO reference oscillator", spec: "10 MHz, 0.01 ppb stability", qty: "1", source: "ConnorWinfield", notes: "Master clock" },
      { ref: "PRI-004", component: "Class-D amplifier — 8-channel", spec: "Custom, 500W/ch, 0.01Hz res", qty: "1", source: "Custom build", notes: "Coil array driver" },
    ],
  },
  {
    name: "Rife/Lisitsyn Frequency System",
    color: "#f43f5e",
    items: [
      { ref: "RIF-001", component: "Quartz-windowed UV applicator", spec: "Fused silica, 200-400nm trans", qty: "4", source: "Custom fabrication", notes: "Interlocked shutters" },
      { ref: "RIF-002", component: "UV-C LED array — 254nm", spec: "Asahi Spectra, 5W", qty: "4", source: "Asahi Spectra", notes: "Pathogen channel" },
      { ref: "RIF-003", component: "UV-A LED array — 365nm", spec: "Nichia NVSU233A, 3W", qty: "4", source: "Nichia", notes: "Kaznacheyev channel" },
      { ref: "RIF-004", component: "Plasma tube — broadband Rife", spec: "Argon/Neon filled, 40W", qty: "4", source: "Custom build", notes: "Pathogen devitalization" },
      { ref: "RIF-005", component: "Programmable function generator", spec: "Keysight 33600A, 80 MHz", qty: "1", source: "Keysight Technologies", notes: "Lisitsyn sweep" },
    ],
  },
  {
    name: "PBM (Photobiomodulation)",
    color: "#ef4444",
    items: [
      { ref: "PBM-001", component: "660nm red LED panel array", spec: "Samsung LH351B, 100 mW/cm²", qty: "6", source: "Samsung / Cree", notes: "Overhead + lateral" },
      { ref: "PBM-002", component: "810nm NIR transcranial LED array", spec: "120 mW/cm², TBI protocol", qty: "2", source: "Samsung / Cree", notes: "Canopy-mounted" },
      { ref: "PBM-003", component: "850nm NIR deep-tissue LED panel", spec: "100 mW/cm²", qty: "4", source: "Samsung / Cree", notes: "Side panels" },
      { ref: "PBM-004", component: "PBM LED driver board (constant current)", spec: "48V DC, PWM dimmable", qty: "4", source: "Digi-Key / Mouser", notes: "5×5 grid calibration" },
      { ref: "PBM-005", component: "Aluminum heat sink + thermal paste kit", spec: "Junction temp <75°C", qty: "12", source: "McMaster-Carr", notes: "Per panel" },
      { ref: "PBM-006", component: "NTC 10k temperature sensor", spec: "Per panel ADC feedback", qty: "12", source: "Maxim / ADI", notes: "BFAC feedback" },
    ],
  },
  {
    name: "PEMF (Pulsed EM Field)",
    color: "#3b82f6",
    items: [
      { ref: "PEM-001", component: "PEMF coil matrix — litz wire", spec: "AWG20×50 strand, 2×2 grid", qty: "4", source: "Amidon / Fair-Rite", notes: "Under-mattress Helmholtz" },
      { ref: "PEM-002", component: "PEMF driver board (48V DC, PWM)", spec: "Dual-mode delta + Schumann", qty: "1", source: "Digi-Key / Mouser", notes: "0.5-4 Hz + 7.83 Hz" },
      { ref: "PEM-003", component: "ACS712 current monitor", spec: "Per coil segment", qty: "4", source: "Maxim / ADI", notes: "BFAC feedback loop" },
      { ref: "PEM-004", component: "Non-ferrous aluminum shield panel", spec: "Above coil matrix", qty: "1", source: "McMaster-Carr", notes: "Field shaping" },
    ],
  },
  {
    name: "VAT (Vibroacoustic)",
    color: "#a855f7",
    items: [
      { ref: "VAT-001", component: "Tactile transducer — mattress embed", spec: "Dayton Audio BST-1, 20-528 Hz", qty: "8", source: "Dayton Audio", notes: "Full dorsal surface" },
      { ref: "VAT-002", component: "Class-AB amplifier (50W/ch, 4-ch)", spec: "VAT drive", qty: "2", source: "Digi-Key / Mouser", notes: "" },
      { ref: "VAT-003", component: "ADAU1701 DSP processor", spec: "Formant synthesis", qty: "1", source: "Analog Devices", notes: "" },
      { ref: "VAT-004", component: "SPL limiter hardware", spec: "85 dB trip", qty: "1", source: "Digi-Key / Mouser", notes: "Patient ear safety" },
    ],
  },
  {
    name: "FIT (Far-Infrared)",
    color: "#f97316",
    items: [
      { ref: "FIT-001", component: "Far-infrared carbon fiber panel", spec: "420×230mm, 5-14μm, 37-55°C", qty: "6", source: "Watlow / Omega", notes: "Side walls + under-mattress" },
      { ref: "FIT-002", component: "NTC thermistor (patient contact)", spec: "3 contact points", qty: "3", source: "Maxim / ADI", notes: "Seat, back, foot" },
      { ref: "FIT-003", component: "Safety thermal cutoff (TCO 60°C)", spec: "Series with elements", qty: "1", source: "Digi-Key / Mouser", notes: "Hard safety cap" },
      { ref: "FIT-004", component: "Ceramic fiber insulation blanket", spec: "Panel rear face", qty: "6", source: "Watlow / Omega", notes: "" },
    ],
  },
  {
    name: "MCT (Microcurrent)",
    color: "#ec4899",
    items: [
      { ref: "MCT-001", component: "Gold-plated electrode port (armrest + headrest)", spec: "4-zone, 1-999μA", qty: "4", source: "Newark / element14", notes: "Head/torso/limb" },
      { ref: "MCT-002", component: "MCT driver board (isolated DC-DC)", spec: "Precision current source", qty: "1", source: "Digi-Key / Mouser", notes: "" },
      { ref: "MCT-003", component: "GFCI protection module (10μA trip)", spec: "Per-port leakage", qty: "4", source: "Digi-Key / Mouser", notes: "Patient safety" },
      { ref: "MCT-004", component: "Crowbar current limit hardware", spec: "1000μA hard cap", qty: "1", source: "Digi-Key / Mouser", notes: "Hard safety cap" },
    ],
  },
  {
    name: "HIT (Hydrogen) + OZO (Ozone)",
    color: "#14b8a6",
    items: [
      { ref: "HIT-001", component: "PEM electrolyzer unit (99.99% H₂)", spec: "150-300 mL/min", qty: "1", source: "Digi-Key / Mouser", notes: "Canopy delivery" },
      { ref: "HIT-002", component: "MQ-8 H₂ concentration sensor", spec: "Alarm at >1% v/v, 25% LEL", qty: "1", source: "Maxim / ADI", notes: "Explosion prevention" },
      { ref: "HIT-003", component: "Solenoid flow control valve", spec: "BFAC safety relay", qty: "1", source: "Digi-Key / Mouser", notes: "" },
      { ref: "HIT-004", component: "Earth bonding kit (explosion prevention)", spec: "Wetted metal parts", qty: "1", source: "McMaster-Carr", notes: "" },
      { ref: "OZO-001", component: "Ozone generator (medical-grade O₃)", spec: "0.5-5% O₃ in O₂", qty: "1", source: "Medical supplier", notes: "Insufflation" },
      { ref: "OZO-002", component: "MQ-131 ozone sensor (2-point cal)", spec: "Interlock at 0.05 ppm", qty: "1", source: "Maxim / ADI", notes: "Ambient safety" },
    ],
  },
  {
    name: "NIA (Negative Ions) + CHM (Chromotherapy)",
    color: "#2dd4bf",
    items: [
      { ref: "NIA-001", component: "Corona-discharge emitter (canopy crown)", spec: "5-8 kV peak", qty: "1", source: "Digi-Key / Mouser", notes: "10⁷ ions/cm³" },
      { ref: "NIA-002", component: "HEPA + activated carbon filter", spec: "Sealed canopy", qty: "1", source: "McMaster-Carr", notes: "Air quality" },
      { ref: "CHM-001", component: "Programmable WLED canopy array", spec: "7 chakra colors, full-spectrum", qty: "1", source: "Digi-Key / Mouser", notes: "Chromotherapy" },
      { ref: "CHM-002", component: "WLED controller (synchronized)", spec: "Protocol + bija sync", qty: "1", source: "Digi-Key / Mouser", notes: "" },
    ],
  },
  {
    name: "Vedic Nada + Global Scaling",
    color: "#eab308",
    items: [
      { ref: "NAD-001", component: "Directional transducer — wideband", spec: "Dayton Audio ND16-4, 4Ω", qty: "7", source: "Dayton Audio", notes: "Chakra points" },
      { ref: "NAD-002", component: "Audio amplifier — 8-channel", spec: "Class-AB, 50W/ch", qty: "1", source: "Custom build", notes: "" },
      { ref: "NAD-003", component: "DSP audio processor", spec: "ADAU1701, 48-bit", qty: "1", source: "Analog Devices", notes: "Formant synthesis" },
      { ref: "GSC-001", component: "Piezoelectric nanocrystal — G-Element", spec: "PZT-5H, 5mm, EM isolated", qty: "4", source: "Custom fabrication", notes: "One per node freq" },
      { ref: "GSC-002", component: "Mu-metal EM isolation enclosure", spec: "0.1mm, 4-layer", qty: "4", source: "Magnetic Shield Corp", notes: "Faraday + magnetic" },
    ],
  },
  {
    name: "EEG Neurofeedback",
    color: "#8b5cf6",
    items: [
      { ref: "EEG-001", component: "19-channel EEG headset", spec: "10-20 international system", qty: "1", source: "Medical supplier", notes: "Canopy-mounted dock" },
      { ref: "EEG-002", component: "EEG amplifier — medical grade", spec: "24-bit, 500 Hz sample", qty: "1", source: "Medical supplier", notes: "Real-time FFT" },
      { ref: "EEG-003", component: "Neurofeedback software", spec: "Alpha-theta, PTSD protocol", qty: "1", source: "Custom build", notes: "Closed-loop" },
    ],
  },
  {
    name: "Schauberger Vortex Water",
    color: "#0891b2",
    items: [
      { ref: "VOR-001", component: "Corrugated impeller — Repulsine type", spec: "316L SS, 200mm dia", qty: "1", source: "Custom CNC", notes: "Centripetal vortex" },
      { ref: "VOR-002", component: "Vortex chamber — borosilicate glass", spec: "Pyrex, 40L, 300mm dia", qty: "1", source: "Custom glassblowing", notes: "Visual inspection" },
      { ref: "VOR-003", component: "Peltier cooling module", spec: "TEC1-12706, 12V 6A, 72W", qty: "8", source: "Marlow Industries", notes: "Arrayed cooling" },
      { ref: "VOR-004", component: "Compressor — miniature", spec: "R134a, 1/4 hp, 12V DC", qty: "1", source: "Danfoss", notes: "Hybrid cooling" },
      { ref: "VOR-005", component: "PID temperature controller", spec: "Omega CN7500, 0.1°C precision", qty: "1", source: "Omega Engineering", notes: "4°C target" },
    ],
  },
  {
    name: "Control + Safety Electronics",
    color: "#f59e0b",
    items: [
      { ref: "CTL-001", component: "BeagleBone AI-64 embedded controller", spec: "Dual-core, BFAC MCU", qty: "1", source: "BeagleBoard", notes: "Main controller" },
      { ref: "CTL-002", component: "Lattice iCE40 FPGA", spec: "Real-time DSP, ACE engine", qty: "1", source: "Lattice Semi", notes: "Adaptive control" },
      { ref: "CTL-003", component: "ARM Cortex-A72 + STM32H7 sensor fusion", spec: "100ms cycle, TF Lite", qty: "1", source: "Digi-Key / Mouser", notes: "BFAC closed-loop" },
      { ref: "CTL-004", component: "10.1 inch touchscreen HMI", spec: "1280×800, capacitive", qty: "1", source: "Industrial supplier", notes: "Operator interface" },
      { ref: "SAF-001", component: "Emergency stop — mushroom (dual-ch NC)", spec: "IEC 60947-5-5, IP65", qty: "3", source: "Schneider Electric", notes: "Interior + exterior" },
      { ref: "SAF-002", component: "EM field probe — isotropic", spec: "Narda ELT-400, 1Hz-400kHz", qty: "1", source: "Narda", notes: "Field monitoring" },
      { ref: "SAF-003", component: "Patient isolation monitor", spec: "10μA trip, medical grade", qty: "1", source: "Rigel Medical", notes: "IEC 60601" },
      { ref: "SAF-004", component: "Interlock relay — safety (Cat 4 SIL 3)", spec: "Pilz PNOZ", qty: "1", source: "Pilz", notes: "Master safety" },
      { ref: "PWR-001", component: "Isolation transformer (5kVA)", spec: "120/240V, medical grade", qty: "1", source: "Tripp Lite", notes: "Patient isolation" },
      { ref: "PWR-002", component: "DC power supply — multi-rail", spec: "48V/24V/12V, 500W", qty: "1", source: "Mean Well", notes: "Subsystem rails" },
    ],
  },
  {
    name: "Emission Spectrum Diagnostic",
    color: "#ec4899",
    items: [
      { ref: "DIAG-001", component: "UV/Vis spectrometer", spec: "Ocean Insight Flame, 200-800nm, 0.1nm", qty: "1", source: "Ocean Insight", notes: "Porthole capture" },
      { ref: "DIAG-002", component: "Quartz porthole window", spec: "Fused silica, 50mm dia", qty: "6", source: "Edmund Optics", notes: "Body emission ports" },
      { ref: "DIAG-003", component: "Fiber optic bundle — UV grade", spec: "High-OH silica, 6-around-1", qty: "6", source: "Thorlabs", notes: "Porthole to spectrometer" },
      { ref: "DIAG-004", component: "IR thermal camera", spec: "FLIR A65, 640×512, 7.5-13μm", qty: "1", source: "FLIR Systems", notes: "Thermal mapping" },
    ],
  },
];

// ── ASSEMBLY PHASES ─────────────────────────────────────────────────────────
export const ASSEMBLY_PHASES = [
  { phase: "A", title: "Structural Frame + Canopy", hours: 16, desc: "6061-T6 aluminum extrusion frame, motorized canopy with linear actuator, M8 fasteners at 20 Nm, leveling feet, cable management" },
  { phase: "B", title: "Orgone Accumulator Envelope", hours: 10, desc: "20-layer alternating sheep wool felt + galvanized steel sheet, mineral wool insulation, temp differential verification ≥1.0°F" },
  { phase: "C", title: "Faraday Shield + EM Coil Array", hours: 18, desc: "Copper mesh 360° enclosure, 8 bifilar coil pairs (144 turns AWG14) mounted octagonally, Class-D 8-ch amplifier, field test ≥50 V/m" },
  { phase: "D", title: "Prioré + Rife/Lisitsyn Systems", hours: 14, desc: "Bedini electron tubes (4x, reversed mode), AD9854 DDS (3-ch), OCXO master clock, quartz UV applicators, plasma tubes, Lisitsyn table load" },
  { phase: "E", title: "PBM + PEMF + FIR Arrays", hours: 20, desc: "Overhead + lateral PBM LED panels (660/810/850nm), 2×2 Helmholtz under-mattress PEMF, tri-surface FIR carbon panels, NTC monitoring" },
  { phase: "F", title: "VAT + MCT + NIA + CHM", hours: 12, desc: "8-transducer mattress VAT embed, 4-zone MCT electrodes, corona discharge NIA emitter, WLED chromotherapy canopy array" },
  { phase: "G", title: "HIT + OZO + VOR Chemical Systems", hours: 14, desc: "PEM electrolyzer + H₂ delivery + MQ-8 sensor, ozone generator + MQ-131, Schauberger vortex chamber + Peltier cooling + 4°C PID" },
  { phase: "H", title: "Vedic Nada + Global Scaling + EEG", hours: 10, desc: "7 chakra transducers + DSP, 4 G-Element resonators + mu-metal isolation, 19-ch EEG headset dock + amplifier" },
  { phase: "I", title: "Emission Diagnostic + Safety", hours: 12, desc: "UV/Vis spectrometer + 6 quartz portholes + fiber bundles, FLIR thermal camera, E-stop (3x), field probe, isolation monitor, Pilz relay" },
  { phase: "J", title: "Control Electronics + Firmware", hours: 22, desc: "BeagleBone AI-64 + iCE40 FPGA + STM32H7, BFAC+ACE firmware, TF Lite closed-loop, HMI touchscreen, 48V/24V/12V PSU stack" },
  { phase: "K", title: "Integration + Testing + QC", hours: 18, desc: "Full system integration, subsystem interface test, 30-min burn-in, all safety cutoffs <100ms, torque audit, final QC sign-off" },
];

export const TOTAL_HOURS = ASSEMBLY_PHASES.reduce((s, p) => s + p.hours, 0);

// ── SUPPRESSED CONCEPT REFERENCES ──────────────────────────────────────────
export const SUPPRESSED_CONCEPTS = [
  { name: "Prioré Device", inventor: "Antoine Prioré", year: "1962", patent: "French Patent 1,342,772", outcome: "0.7-0.95 survival fraction for terminal conditions", role: "Multichannel modulation + TRZ disease reversal" },
  { name: "Rife Beam Ray", inventor: "Royal R. Rife", year: "1930s", patent: "None (suppressed)", outcome: "1934 USC trial 16/16 terminal cancer remission", role: "Frequency-specific pathogen elimination" },
  { name: "Scalar EM / Kindling", inventor: "Lt. Col. T.E. Bearden", year: "1980s-2000s", patent: "U.S. Patent 6,362,718 (MEG)", outcome: "Longitudinal wave biopotential charging", role: "Scalar wave generation + phase-conjugate" },
  { name: "Reich Orgone Accumulator", inventor: "Wilhelm Reich", year: "1940s-1957", patent: "None (FDA injunction)", outcome: "Biofield concentration, ≥1.0°F temp differential", role: "Orgone accumulator envelope" },
  { name: "Schauberger Implosion", inventor: "Viktor Schauberger", year: "1930s-1958", patent: "Austrian patents", outcome: "Vortex water structuring at 4°C", role: "Vortex water structuring system" },
  { name: "Global Scaling (G-Com)", inventor: "Dr. Hartmut Müller", year: "1982-2001", patent: "G-Com® demo Oct 27, 2001", outcome: "2,500 km transmission at <1W", role: "Standing gravitational wave resonance" },
  { name: "Vedic Nada Brahma", inventor: "Vedic seers", year: "c. 1500 BCE", patent: "Public domain", outcome: "Bija syllable biofield structuring", role: "Acoustic bija frequency engineering" },
  { name: "Kaznacheyev Effect", inventor: "V.P. Kaznacheyev", year: "1974-1982", patent: "Soviet literature", outcome: "UV photon templates induce/reverse disease", role: "UV photon template disease reversal" },
];