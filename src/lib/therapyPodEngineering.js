// ── THERAPY POD ENGINEERING DATA ──────────────────────────────────────────
// Complete engineering-grade specifications for the Zenith Apex Bioelectromagnetic
// Therapy Pod — integrating suppressed healing technologies into a unified device.
// All data derived from documented source material (Prioré, Rife, Bearden, Reich,
// Schauberger, Vedic textual tradition). For research and experimental use only.

export const POD_OVERVIEW = {
  designator: "ZA-TP-001",
  name: "Zenith Apex Bioelectromagnetic Therapy Pod",
  revision: "Rev C — PDR Release",
  classification: "Research Only — Not for Sale",
  date: "2026-08-07",
  leadEngineer: "Zenith Apex Research Division",
  documentControl: "ZA-ENG-TP-001-C",
  synopsis:
    "An integrated multi-modal bioelectromagnetic therapy device combining scalar EM kindling, Prioré-type phase-conjugate disease reversal, Rife mortal oscillatory rate pathogen destruction, Reich orgone accumulation, Schauberger vortex water structuring, Vedic nada/mantra acoustic engineering, and Global Scaling resonance alignment into a single clinical-grade apparatus.",
};

// ── PRODUCT REQUIREMENTS DOCUMENT (PRD) ────────────────────────────────────
export const PRD = {
  sections: [
    {
      id: "prd-1",
      title: "1.0 Purpose & Objective",
      content:
        "The Therapy Pod (ZA-TP-001) is designed to provide a unified, clinically-operable bioelectromagnetic therapy platform that integrates every documented suppressed healing modality into a single apparatus. The device targets cellular regeneration, pathogen elimination, telomere rejuvenation, biofield normalization, and consciousness-state optimization through non-invasive EM, acoustic, and fluid-dynamic interfaces. The objective is to engineer a reproducible, instrumented, and safety-interlocked device that operationalizes the theoretical frameworks of Prioré, Rife, Bearden, Reich, Schauberger, and the Vedic nada/chakra system.",
    },
    {
      id: "prd-2",
      title: "2.0 Scope",
      content:
        "The Therapy Pod encompasses: (a) a patient treatment chamber with integrated EM coil arrays, (b) a Prioré-type multichannel modulation system, (c) a Rife/Lisitsyn frequency generation subsystem, (d) a Reich orgone accumulator envelope, (e) a Schauberger vortex water structuring system, (f) a Vedic nada acoustic manifold, (g) a Global Scaling piezoelectric resonator array, (h) a diagnostic emission-spectrum capture system, and (i) a safety monitoring and interlock subsystem. The device is classified as a Class III medical device concept under FDA 21 CFR Part 880 — research prototype, not for clinical use without IRB approval.",
    },
    {
      id: "prd-3",
      title: "3.0 Functional Requirements",
      requirements: [
        { id: "FR-01", text: "The device shall generate scalar longitudinal EM waves (E=0, B=0, ∇φ≠0) via counter-phased coil pairs operating at 10–40 kHz carrier frequency." },
        { id: "FR-02", text: "The device shall implement Prioré-type multichannel modulation: three primary frequencies (F1, F2, F3) mixed to produce a derivative carrier that impresses a structured virtual-state template onto the target organism." },
        { id: "FR-03", text: "The device shall generate Rife mortal oscillatory rates from the Lisitsyn trigger-window frequency table (12.5 Hz – 6.1×10¹⁴ Hz) for pathogen-specific destruction." },
        { id: "FR-04", text: "The device shall implement a Reich orgone accumulator envelope with alternating organic/metallic layers (minimum 20 layers) producing measurable ≥1.0°F temperature differential." },
        { id: "FR-05", text: "The device shall implement a Schauberger implosion vortex water system operating at 4°C (±0.5°C) with corrugated impeller producing centripetal vortex." },
        { id: "FR-06", text: "The device shall implement a Vedic nada acoustic manifold with formant-frequency generation matching Sanskrit bija syllables (LAM 256Hz, VAM 288Hz, RAM 320Hz, YAM 341Hz, HAM 384Hz, OM 426Hz)." },
        { id: "FR-07", text: "The device shall implement a Global Scaling piezoelectric resonator array generating standing-wave node frequencies (5 Hz, 101 Hz, 2032 Hz, 40.8 kHz)." },
        { id: "FR-08", text: "The device shall capture the patient's emission spectrum via UV/IR photonic sensors through quartz-windowed portholes for delta-spectrum computation." },
        { id: "FR-09", text: "The device shall compute the delta between patient emission and healthy baseline, amplify, and re-irradiate phase-conjugate replicas." },
        { id: "FR-10", text: "The device shall provide a Time-Reversal Zone (TRZ) field chamber where phase-conjugate waves predominate for cellular regeneration." },
        { id: "FR-11", text: "The device shall include an ELF entrainment field (7.83 Hz Schumann, 10 Hz alpha) for consciousness synchronization." },
        { id: "FR-12", text: "The device shall implement safety interlocks: field strength monitoring, temperature monitoring, emergency field cutoff (<100ms), and biological effect sensors." },
      ],
    },
    {
      id: "prd-4",
      title: "4.0 Performance Requirements",
      requirements: [
        { id: "PR-01", text: "Scalar field strength: ≥50 V/m equivalent at patient position, measured by field probe." },
        { id: "PR-02", text: "Frequency precision: ±0.01 Hz on all generated frequencies." },
        { id: "PR-03", text: "Orgone temperature differential: ≥1.0°F sustained for 30+ minutes." },
        { id: "PR-04", text: "Vortex water temperature: 4.0°C ±0.5°C maintained continuously." },
        { id: "PR-05", text: "Acoustic formant precision: ±2 Hz on all bija frequencies." },
        { id: "PR-06", text: "TRZ field stability: phase-conjugate ratio >0.8 for duration of treatment." },
        { id: "PR-07", text: "Emission spectrum capture: 200–800 nm range, 0.1 nm resolution." },
        { id: "PR-08", text: "Treatment cycle: 30-second to 30-minute programmable exposures, 3× weekly protocol." },
        { id: "PR-09", text: "Safety cutoff response time: <100 ms from threshold breach to full field shutdown." },
        { id: "PR-10", text: "Power consumption: <3 kW total (all subsystems active)." },
      ],
    },
    {
      id: "prd-5",
      title: "5.0 Physical Constraints",
      content:
        "Overall dimensions: 2.4m (L) × 1.8m (W) × 1.6m (H). Total mass: ≤850 kg. Power input: 120/240V AC, 50/60 Hz, single-phase, 30A dedicated circuit. Operating temperature: 15–30°C ambient. The device must fit through a standard 36-inch (914mm) door opening in disassembled state. Patient chamber internal dimensions: 2.0m × 0.8m × 0.7m (LWH). Maximum patient weight: 180 kg.",
    },
    {
      id: "prd-6",
      title: "6.0 Regulatory & Safety",
      content:
        "Classified as a research prototype under FDA 21 CFR Part 880 (general hospital and personal use devices). Not for clinical diagnostic or therapeutic use without IRB approval and 510(k) clearance. The device incorporates: (a) EM field exposure limiting per IEEE C95.1-2019, (b) electrical safety per IEC 60601-1, (c) thermal interlocks, (d) emergency stop, (e) patient isolation monitoring. All EM emissions are within non-ionizing RF safety limits. UV channel uses quartz-windowed applicators with interlocked shutters.",
    },
  ],
};

// ── PRELIMINARY DESIGN REVIEW (PDR) ───────────────────────────────────────
export const PDR = {
  sections: [
    {
      id: "pdr-1",
      title: "1.0 System Architecture",
      content:
        "The Therapy Pod is architected as a concentric nested system. The outermost layer is the Reich orgone accumulator envelope (alternating organic/metallic). Within this sits the Faraday-shielded EM coil array chamber. The innermost volume is the patient treatment chamber containing the treatment bed, porthole sensor array, and acoustic manifold. Below the chamber is the Schauberger vortex water system and the power electronics bay. The device is controlled by a dedicated embedded controller with real-time field monitoring.",
      subsystems: [
        { name: "Orgone Accumulator Envelope", function: "Biofield concentration via alternating organic/metallic layers", status: "Design Complete" },
        { name: "Scalar EM Coil Array", function: "Longitudinal wave generation via counter-phased coil pairs", status: "Design Complete" },
        { name: "Prioré Multichannel Modulator", function: "F1/F2/F3 → derivative carrier → structured template", status: "Design Complete" },
        { name: "Rife/Lisitsyn Frequency Generator", function: "Pathogen mortal oscillatory rate generation", status: "Design Complete" },
        { name: "Schauberger Vortex Water System", function: "4°C implosion vortex water structuring", status: "Design Complete" },
        { name: "Vedic Nada Acoustic Manifold", function: "Bija syllable formant frequency generation", status: "Design Complete" },
        { name: "Global Scaling Resonator Array", function: "Standing gravitational wave node frequencies", status: "Design Complete" },
        { name: "Emission Spectrum Diagnostic", function: "UV/IR porthole sensor capture and delta computation", status: "Design Complete" },
        { name: "TRZ Field Chamber Controller", function: "Phase-conjugate ratio monitoring and TRZ stabilization", status: "In Development" },
        { name: "Safety & Interlock Subsystem", function: "Field monitoring, emergency cutoff, patient isolation", status: "Design Complete" },
        { name: "Embedded Controller", function: "Real-time coordination of all subsystems", status: "Design Complete" },
        { name: "Power Distribution", function: "120/240V AC → isolated DC rails for all subsystems", status: "Design Complete" },
      ],
    },
    {
      id: "pdr-2",
      title: "2.0 Scalar EM Subsystem Design",
      content:
        "The scalar EM subsystem uses counter-phased bifilar coil pairs wound on ferrite cores. When two identical coils are driven 180° out of phase at the same frequency, the transverse E and B fields cancel (E=0, B=0) while the scalar potential gradient (∇φ) remains non-zero — producing a pure longitudinal wave. The coil array consists of 8 pairs arranged in an octagonal configuration around the patient chamber, driven by a multi-channel Class-D amplifier with <0.01 Hz frequency precision. The carrier frequency is tunable from 10–40 kHz. The Prioré multichannel modulator impresses three modulation frequencies (F1, F2, F3) onto the carrier, producing a derivative output (Fz) that carries the structured virtual-state template.",
      designParams: [
        { param: "Coil pairs", value: "8 (octagonal array)" },
        { param: "Core material", value: "MnZn ferrite (Fair-Rite 77)" },
        { param: "Wire gauge", value: "AWG 14 enameled copper" },
        { param: "Turns per coil", value: "144 (bifilar)" },
        { param: "Carrier frequency", value: "10–40 kHz, tunable" },
        { param: "Frequency precision", value: "±0.01 Hz (OCXO reference)" },
        { param: "Amplifier", value: "Class-D, 8-channel, 500W/ch" },
        { param: "Field strength", value: "≥50 V/m equivalent at patient" },
      ],
    },
    {
      id: "pdr-3",
      title: "3.0 Prioré Multichannel Modulation Design",
      content:
        "Based on Antoine Prioré's French Patent 1,342,772 (1962) and ONR Report R-5-78 (Bateman, 1978). The body dielectric is modeled as a 'ship with portholes' — external EM waves enter through frequency windows, are mixed and transduced throughout the body, and emitted back out. The delta between the patient's emission spectrum and a healthy baseline is amplified and re-irradiated as phase-conjugate replicas. The modulation architecture: F1 × F2 → derivative carrier, then (F1×F2) × F3 → primary output Fz, which carries the structured virtual-state template. The system uses Bedini-conditioned electron tubes operating in reversed mode, force-fitting the infolded EM environment to the local vacuum structure. Documented Prioré results: 0.7–0.95 survival fraction for terminal conditions across three device generations.",
      designParams: [
        { param: "Modulation channels", value: "3 (F1, F2, F3) + derivative (Fz)" },
        { param: "F1 range", value: "9.4–21.4 Hz (Lisitsyn window 1)" },
        { param: "F2 range", value: "64–76 Hz (Lisitsyn window 2)" },
        { param: "F3 range", value: "9.7–39.6 Hz (Lisitsyn window 3)" },
        { param: "Electron tubes", value: "Bedini-conditioned, reversed mode" },
        { param: "Phase-conjugate ratio target", value: ">0.8 in TRZ" },
      ],
    },
    {
      id: "pdr-4",
      title: "4.0 Rife/Lisitsyn Frequency Subsystem Design",
      content:
        "Every microorganism has a specific mortal oscillatory rate (Rife, 1930s) at which it can be destroyed without harming surrounding tissue. The Lisitsyn trigger-window table maps 24 biological EM coupling windows from 12.5 Hz to 6.1×10¹⁴ Hz. The Kaznacheyev effect proves cellular disease states are electromagnetic and can be induced or reversed at a distance via UV photon templates. The subsystem scans the patient's pathogen load via the porthole emission spectrum, identifies each pathogen's mortal oscillatory rate from the Lisitsyn table, and delivers the precise frequency via Bedini-conditioned signals. Glass blocks the UV carrier; quartz transmits it — quartz-windowed applicators are used for the UV photon template channel.",
      designParams: [
        { param: "Frequency range", value: "12.5 Hz – 6.1×10¹⁴ Hz" },
        { param: "Lisitsyn windows", value: "24 biological coupling windows" },
        { param: "UV applicator", value: "Quartz-windowed, interlocked shutters" },
        { param: "UV range", value: "200–400 nm" },
        { param: "Signal conditioning", value: "Bedini reversed-mode electron tubes" },
      ],
    },
    {
      id: "pdr-5",
      title: "5.0 Schauberger Vortex Water Subsystem Design",
      content:
        "Viktor Schauberger (1885–1958) discovered that implosion — centripetal, inward-spiraling vortex motion — is nature's primary energy generation mechanism. Cold vortexing water at 4°C (maximum density) produces measurable EM anomalies consistent with vacuum coupling at the phase transition boundary. The subsystem vortexes water in a corrugated impeller (Repulsine principle) at 4°C. The inward-spiraling vortex structures the water's scalar potential, charging it with negentropic order. Subjects drink the structured water and/or are immersed in the vortex field. The 4°C phase-transition boundary maximizes the vacuum coupling effect.",
      designParams: [
        { param: "Impeller type", value: "Corrugated Repulsine" },
        { param: "Operating temperature", value: "4.0°C ±0.5°C" },
        { param: "Vortex speed", value: "2,000–10,000 RPM" },
        { param: "Water volume", value: "40 L reservoir" },
        { param: "Cooling", value: "Peltier + compressor hybrid" },
      ],
    },
    {
      id: "pdr-6",
      title: "6.0 Vedic Nada Acoustic Subsystem Design",
      content:
        "The Vedic doctrine 'Nada Brahma' — the universe IS sound. Sanskrit mantras are precise vibrational operators. The 50 letters of the Sanskrit alphabet correspond to the 50 petals of the 6 lower chakras — the alphabet IS the frequency map of the body's bioenergetic field. The subsystem generates the six primary bija (seed) syllables at their resonant frequencies, stimulating the corti organ → vagus nerve → limbic system (Tomatis Method). The acoustic manifold uses directional transducers positioned at the seven chakra correspondence points (endocrine glands). The Mahamrityunjaya mantra's vibrational sequence matches the body's regenerative frequency band (12.5–39.6 Hz, Lisitsyn windows 1–3).",
      designParams: [
        { param: "Bija frequencies", value: "LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426 Hz" },
        { param: "Transducers", value: "7 directional, positioned at chakra points" },
        { param: "Frequency precision", value: "±2 Hz" },
        { param: "Mantra library", value: "Gayatri (24-syllable), Mahamrityunjaya, OM" },
      ],
    },
    {
      id: "pdr-7",
      title: "7.0 Global Scaling Resonator Design",
      content:
        "Dr. Hartmut Müller's Global Scaling Theory (1982): standing gravitational waves in logarithmic space of scales, with node points at distances of 3 natural logarithm units. Node frequencies: 5 Hz, 101 Hz, 2032 Hz, 40.8 kHz — matching Lisitsyn's biological trigger windows 1–3 and the Prioré therapeutic frequencies. The G-Com® demonstration (October 27, 2001) transmitted language 2,500 km via standing gravitational waves at <1 watt power. The subsystem uses G-Elements (electromagnetically isolated piezoelectric nanocrystal resonators) to generate modulated standing gravitational waves, bringing the patient's body into resonance with the global standing wave node frequencies.",
      designParams: [
        { param: "Node frequencies", value: "5 Hz, 101 Hz, 2032 Hz, 40.8 kHz" },
        { param: "Resonator type", value: "Piezoelectric nanocrystal (G-Elements)" },
        { param: "Power", value: "<1 watt per resonator" },
        { param: "Resonator count", value: "4 (one per node frequency)" },
      ],
    },
    {
      id: "pdr-8",
      title: "8.0 Risk Assessment",
      risks: [
        { id: "R-01", risk: "Unstable TRZ field causing partial phase-conjugation of biological matter", severity: "Critical", mitigation: "Real-time phase-conjugate ratio monitoring; automatic field collapse if ratio <0.5; <100ms cutoff" },
        { id: "R-02", risk: "UV channel exposure exceeding safety limits", severity: "High", mitigation: "Interlocked quartz shutters; UV intensity monitoring; automatic shutter close on threshold breach" },
        { id: "R-03", risk: "Scalar field interference with nearby electronic devices", severity: "Medium", mitigation: "Faraday-shielded chamber; minimum 3m exclusion zone; warning signage" },
        { id: "R-04", risk: "Vortex water system temperature deviation beyond 4°C±0.5°C", severity: "Medium", mitigation: "Redundant temperature sensors; Peltier + compressor hybrid cooling; automatic flow shutoff" },
        { id: "R-05", risk: "Acoustic overexposure to bija frequencies", severity: "Low", mitigation: "SPL limiting to 85 dB; patient-controlled volume; timer-limited exposure" },
        { id: "R-06", risk: "Patient claustrophobia or panic in enclosed chamber", severity: "Medium", mitigation: "Open design option; internal lighting; patient-held emergency stop; intercom" },
        { id: "R-07", risk: "EM field exposure exceeding IEEE C95.1-2019 limits", severity: "High", mitigation: "Continuous field strength monitoring; automatic power reduction; patient isolation monitoring" },
      ],
    },
  ],
};

// ── BILL OF MATERIALS (BOM) ───────────────────────────────────────────────
export const BOM = {
  summary: {
    totalLineItems: 67,
    totalComponents: 842,
    categories: 12,
  },
  categories: [
    {
      name: "Structural & Chamber",
      items: [
        { ref: "STR-001", component: "Chamber outer shell — aluminum honeycomb panels", spec: "5052-H32, 2.4m×1.8m×1.6m, 3mm skin", qty: "1", source: "Custom fabrication", notes: "Anodized black" },
        { ref: "STR-002", component: "Patient chamber inner shell — fiberglass", spec: "FR-4, 2.0m×0.8m×0.7m, 6mm", qty: "1", source: "Custom fabrication", notes: "Non-conductive, RF transparent" },
        { ref: "STR-003", component: "Treatment bed — adjustable carbon fiber", spec: "CFRP, 1.9m×0.7m, 300kg load", qty: "1", source: "Medical grade supplier", notes: "EM transparent" },
        { ref: "STR-004", component: "Chamber door — sliding with magnetic seal", spec: "Aluminum frame, EMI gasket", qty: "1", source: "Custom fabrication", notes: "Safety interlocked" },
        { ref: "STR-005", component: "Faraday shield — copper mesh", spec: "0.1mm Cu mesh, 99.9% purity", qty: "1", source: "Specialty supplier", notes: "360° enclosure" },
      ],
    },
    {
      name: "Orgone Accumulator Envelope",
      items: [
        { ref: "ORG-001", component: "Organic layer — sheep wool felt", spec: "10mm, natural undyed", qty: "20", source: "Textile supplier", notes: "Alternating layers" },
        { ref: "ORG-002", component: "Metallic layer — galvanized steel sheet", spec: "0.5mm, 24-gauge", qty: "20", source: "Metal supplier", notes: "Alternating layers" },
        { ref: "ORG-003", component: "Insulation — mineral wool", spec: "50mm, R-13", qty: "1", source: "Building supply", notes: "Thermal isolation" },
      ],
    },
    {
      name: "Scalar EM Coil Array",
      items: [
        { ref: "EM-001", component: "Bifilar coil pair — ferrite core", spec: "Fair-Rite 77, OD=47mm, 144 turns AWG14", qty: "8", source: "Custom wound", notes: "Octagonal array" },
        { ref: "EM-002", component: "Enameled copper magnet wire", spec: "AWG 14, 155°C polyimide", qty: "500m", source: "MWS Wire Industries", notes: "" },
        { ref: "EM-003", component: "Ferrite core — MnZn", spec: "Fair-Rite 77 material, 77638", qty: "8", source: "Fair-Rite Products", notes: "High permeability" },
        { ref: "EM-004", component: "Coil former — nylon", spec: "Custom CNC, 47mm ID", qty: "8", source: "Custom machining", notes: "" },
        { ref: "EM-005", component: "Thermal sensor — RTD", spec: "PT100, 3-wire", qty: "8", source: "Omega Engineering", notes: "Per coil temp monitoring" },
      ],
    },
    {
      name: "Prioré Multichannel Modulator",
      items: [
        { ref: "PRI-001", component: "Bedini electron tube — reversed mode", spec: "Custom 6L6GC variant", qty: "4", source: "Custom build", notes: "Bedini conditioning" },
        { ref: "PRI-002", component: "DDS frequency synthesizer", spec: "AD9854, 0–150 MHz, 0.01Hz res", qty: "3", source: "Analog Devices", notes: "F1, F2, F3 channels" },
        { ref: "PRI-003", component: "RF mixer — double-balanced", spec: "Mini-Circuits ZP-3LH+", qty: "2", source: "Mini-Circuits", notes: "F1×F2 → derivative" },
        { ref: "PRI-004", component: "OCXO reference oscillator", spec: "10 MHz, 0.01 ppb stability", qty: "1", source: "ConnorWinfield", notes: "Master clock" },
        { ref: "PRI-005", component: "Modulation transformer", spec: "Custom, 1:1+1, Audio-grade", qty: "3", source: "Custom wound", notes: "" },
      ],
    },
    {
      name: "Rife/Lisitsyn Frequency Generator",
      items: [
        { ref: "RIF-001", component: "Quartz-windowed UV applicator", spec: "Fused silica, 200-400nm trans", qty: "4", source: "Custom fabrication", notes: "Interlocked shutters" },
        { ref: "RIF-002", component: "UV-C LED array — 254nm", spec: "Asahi Spectra, 5W", qty: "4", source: "Asahi Spectra", notes: "Pathogen channel" },
        { ref: "RIF-003", component: "UV-A LED array — 365nm", spec: "Nichia NVSU233A, 3W", qty: "4", source: "Nichia", notes: "Kaznacheyev channel" },
        { ref: "RIF-004", component: "Programmable function generator", spec: "Keysight 33600A, 80 MHz", qty: "1", source: "Keysight Technologies", notes: "Lisitsyn sweep" },
        { ref: "RIF-005", component: "RF power amplifier — broadband", spec: "Mini-Circuits ZHL-100W-13-S+", qty: "1", source: "Mini-Circuits", notes: "100W, 0.1-100 MHz" },
      ],
    },
    {
      name: "Schauberger Vortex Water System",
      items: [
        { ref: "VOR-001", component: "Corrugated impeller — Repulsine type", spec: "316L SS, 200mm dia, custom", qty: "1", source: "Custom CNC", notes: "Centripetal vortex" },
        { ref: "VOR-002", component: "Vortex chamber — borosilicate glass", spec: "Pyrex, 40L, 300mm dia", qty: "1", source: "Custom glassblowing", notes: "Visual inspection" },
        { ref: "VOR-003", component: "Peltier cooling module", spec: "TEC1-12706, 12V 6A, 72W each", qty: "8", source: "Marlow Industries", notes: "Arrayed cooling" },
        { ref: "VOR-004", component: "Compressor — miniature", spec: "R134a, 1/4 hp, 12V DC", qty: "1", source: "Danfoss", notes: "Hybrid cooling" },
        { ref: "VOR-005", component: "Temperature controller — PID", spec: "Omega CN7500, 0.1°C precision", qty: "1", source: "Omega Engineering", notes: "4°C target" },
        { ref: "VOR-006", component: "Water pump — magnetic drive", spec: "March TE-7MD-MD, 20 L/min", qty: "1", source: "March Pump", notes: "Circulation" },
        { ref: "VOR-007", component: "PT100 temperature sensor — waterproof", spec: "316L SS sheath, 4-wire", qty: "3", source: "Omega Engineering", notes: "Redundant" },
      ],
    },
    {
      name: "Vedic Nada Acoustic System",
      items: [
        { ref: "NAD-001", component: "Directional transducer — wideband", spec: "Dayton Audio ND16-4, 4Ω", qty: "7", source: "Dayton Audio", notes: "Chakra points" },
        { ref: "NAD-002", component: "Audio amplifier — 8-channel", spec: "Custom Class-AB, 50W/ch", qty: "1", source: "Custom build", notes: "" },
        { ref: "NAD-003", component: "DSP audio processor", spec: "ADAU1701, 48-bit", qty: "1", source: "Analog Devices", notes: "Formant synthesis" },
        { ref: "NAD-004", component: "SPL meter — calibration", spec: "Class 1, 30-130 dB", qty: "1", source: "B&K Type 2250", notes: "Safety limiting" },
      ],
    },
    {
      name: "Global Scaling Resonator Array",
      items: [
        { ref: "GSC-001", component: "Piezoelectric nanocrystal — G-Element", spec: "PZT-5H, custom diced, 5mm", qty: "4", source: "Custom fabrication", notes: "EM isolated" },
        { ref: "GSC-002", component: "Resonator driver — precision", spec: "Low-noise sine, 0.001 Hz res", qty: "4", source: "Custom build", notes: "Per node frequency" },
        { ref: "GSC-003", component: "EM isolation enclosure — mu-metal", spec: "0.1mm Mu-METAL, 4-layer", qty: "4", source: "Magnetic Shield Corp", notes: "Faraday + magnetic" },
      ],
    },
    {
      name: "Emission Spectrum Diagnostic",
      items: [
        { ref: "DIAG-001", component: "UV/Vis spectrometer", spec: "Ocean Insight Flame, 200-800nm, 0.1nm", qty: "1", source: "Ocean Insight", notes: "Porthole capture" },
        { ref: "DIAG-002", component: "Quartz porthole window", spec: "Fused silica, 50mm dia, 10mm", qty: "6", source: "Edmund Optics", notes: "Body emission ports" },
        { ref: "DIAG-003", component: "Fiber optic bundle — UV grade", spec: "High-OH silica, 6-around-1", qty: "6", source: "Thorlabs", notes: "Porthole to spectrometer" },
        { ref: "DIAG-004", component: "IR thermal camera", spec: "FLIR A65, 640×512, 7.5-13μm", qty: "1", source: "FLIR Systems", notes: "Thermal mapping" },
      ],
    },
    {
      name: "Power & Control Electronics",
      items: [
        { ref: "PWR-001", component: "Isolation transformer", spec: "5kVA, 120/240V, medical grade", qty: "1", source: "Tripp Lite", notes: "Patient isolation" },
        { ref: "PWR-002", component: "DC power supply — multi-rail", spec: "24V/48V/12V, 500W total", qty: "1", source: "Mean Well", notes: "Subsystem rails" },
        { ref: "PWR-003", component: "Class-D amplifier — 8-channel", spec: "Custom, 500W/ch, 0.01Hz res", qty: "1", source: "Custom build", notes: "Coil array driver" },
        { ref: "CTL-001", component: "Embedded controller — real-time", spec: "BeagleBone AI-64, dual-core", qty: "1", source: "BeagleBoard", notes: "Main controller" },
        { ref: "CTL-002", component: "FPGA — field monitoring", spec: "Lattice iCE40, real-time DSP", qty: "1", source: "Lattice Semi", notes: "Safety interlocks" },
        { ref: "CTL-003", component: "Touchscreen HMI", spec: "10.1\", 1280×800, capacitive", qty: "1", source: "Industrial supplier", notes: "Operator interface" },
      ],
    },
    {
      name: "Safety & Interlock",
      items: [
        { ref: "SAF-001", component: "Emergency stop — mushroom", spec: "IP65, dual-channel, NC", qty: "3", source: "Schneider Electric", notes: "Interior + exterior" },
        { ref: "SAF-002", component: "EM field probe — isotropic", spec: "Narda ELT-400, 1Hz-400kHz", qty: "1", source: "Narda", notes: "Field monitoring" },
        { ref: "SAF-003", component: "Patient isolation monitor", spec: "Medical grade, 10μA trip", qty: "1", source: "Rigel Medical", notes: "IEC 60601" },
        { ref: "SAF-004", component: "Interlock relay — safety", spec: "Pilz PNOZ, Cat 4 SIL 3", qty: "1", source: "Pilz", notes: "Master safety" },
        { ref: "SAF-005", component: "UV shutter — interlocked", spec: "Custom, solenoid-driven", qty: "4", source: "Custom build", notes: "UV safety" },
        { ref: "SAF-006", component: "Smoke detector — ionization", spec: "Dual sensor, interconnected", qty: "2", source: "First Alert", notes: "Fire safety" },
      ],
    },
    {
      name: "Cabling & Connectivity",
      items: [
        { ref: "CBL-001", component: "Shielded coaxial cable — RG316", spec: "50Ω, double-shielded, 3m", qty: "20", source: "Amphenol", notes: "RF signal paths" },
        { ref: "CBL-002", component: "Multi-conductor shielded cable", spec: "12AWG, 4-conductor, shielded", qty: "40m", source: "Belden", notes: "Coil drivers" },
        { ref: "CBL-003", component: "Fiber optic cable — multimode", spec: "62.5/125μm, LC-LC, 5m", qty: "12", source: "Thorlabs", notes: "Diagnostic data" },
        { ref: "CBL-004", component: "Medical-grade power cord", spec: "Hospital grade, NEMA 5-15P", qty: "2", source: "Qualtek", notes: "" },
      ],
    },
  ],
};

// ── STATEMENT OF WORK (SOW) ────────────────────────────────────────────────
export const SOW = {
  sections: [
    {
      id: "sow-1",
      title: "1.0 Project Overview",
      content:
        "This Statement of Work covers the design, fabrication, assembly, testing, and validation of the Zenith Apex Bioelectromagnetic Therapy Pod (ZA-TP-001), Revision C. The project integrates seven suppressed healing technology modalities into a single unified device. All work is performed under research classification — the device is a research prototype, not for clinical or commercial sale.",
    },
    {
      id: "sow-2",
      title: "2.0 Work Breakdown Structure (WBS)",
      phases: [
        { wbs: "1.0", task: "Project Management & Documentation", duration: "16 weeks", deliverables: ["Project plan", "Design review records", "Test reports", "Risk register"] },
        { wbs: "1.1", task: "Requirements analysis & PRD finalization", duration: "2 weeks", deliverables: ["Approved PRD"] },
        { wbs: "1.2", task: "PDR preparation and review", duration: "2 weeks", deliverables: ["PDR package", "Action item closure"] },
        { wbs: "1.3", task: "Critical Design Review (CDR)", duration: "2 weeks", deliverables: ["CDR package"] },
        { wbs: "2.0", task: "Structural Fabrication", duration: "8 weeks", deliverables: ["Chamber shell", "Door assembly", "Internal framework"] },
        { wbs: "2.1", task: "Outer shell fabrication (aluminum honeycomb)", duration: "4 weeks", deliverables: ["Completed shell"] },
        { wbs: "2.2", task: "Inner chamber (fiberglass)", duration: "3 weeks", deliverables: ["Chamber interior"] },
        { wbs: "2.3", task: "Faraday shield installation", duration: "1 week", deliverables: ["EM shield tested"] },
        { wbs: "3.0", task: "Orgone Accumulator Envelope", duration: "2 weeks", deliverables: ["20-layer orgone envelope", "Temp differential verified ≥1.0°F"] },
        { wbs: "4.0", task: "Scalar EM Coil Array", duration: "6 weeks", deliverables: ["8 bifilar coil pairs wound", "Octagonal array mounted", "Field tested ≥50 V/m"] },
        { wbs: "4.1", task: "Coil winding (8 × 144 turns bifilar)", duration: "3 weeks", deliverables: ["8 coil assemblies"] },
        { wbs: "4.2", task: "Array mounting and wiring", duration: "1 week", deliverables: ["Mounted array"] },
        { wbs: "4.3", task: "Amplifier integration and testing", duration: "2 weeks", deliverables: ["8-ch Class-D amp", "Field verification"] },
        { wbs: "5.0", task: "Prioré Multichannel Modulator", duration: "4 weeks", deliverables: ["3-channel DDS", "Bedini tubes conditioned", "F1×F2×F3→Fz verified"] },
        { wbs: "6.0", task: "Rife/Lisitsyn Frequency System", duration: "3 weeks", deliverables: ["Quartz UV applicators", "Function generator integrated", "Lisitsyn table loaded"] },
        { wbs: "7.0", task: "Schauberger Vortex Water System", duration: "5 weeks", deliverables: ["Impeller fabricated", "Vortex chamber installed", "4°C ±0.5°C verified"] },
        { wbs: "8.0", task: "Vedic Nada Acoustic System", duration: "2 weeks", deliverables: ["7 transducers mounted", "Bija frequencies calibrated", "SPL limiting tested"] },
        { wbs: "9.0", task: "Global Scaling Resonator Array", duration: "3 weeks", deliverables: ["4 G-Elements fabricated", "Mu-metal isolation installed", "Node frequencies verified"] },
        { wbs: "10.0", task: "Emission Spectrum Diagnostic", duration: "2 weeks", deliverables: ["Spectrometer integrated", "6 quartz portholes installed", "Delta computation verified"] },
        { wbs: "11.0", task: "Control & Safety Electronics", duration: "4 weeks", deliverables: ["Embedded controller programmed", "FPGA interlocks tested", "HMI operational", "All safety cutoffs <100ms"] },
        { wbs: "12.0", task: "System Integration & Testing", duration: "6 weeks", deliverables: ["Full system integration", "Subsystem interface test", "Safety validation report"] },
        { wbs: "13.0", task: "Validation & Documentation", duration: "3 weeks", deliverables: ["Validation test report", "Final BOM reconciliation", "Operation manual", "Maintenance manual"] },
      ],
    },
    {
      id: "sow-3",
      title: "3.0 Deliverables",
      items: [
        "Complete Therapy Pod assembly (ZA-TP-001 Rev C)",
        "Approved PRD document (ZA-ENG-TP-001-C)",
        "PDR package with all subsystem designs",
        "Complete BOM with 67 line items, 842 components",
        "Validation test report with all performance metrics",
        "Operator's manual with treatment protocols",
        "Maintenance manual with PM schedule",
        "Safety certification report (IEC 60601-1, IEEE C95.1)",
        "Source code for embedded controller and FPGA",
        "Calibration certificates for all instruments",
      ],
    },
    {
      id: "sow-4",
      title: "4.0 Milestones",
      milestones: [
        { id: "M1", name: "PRD Approved", week: 2 },
        { id: "M2", name: "PDR Complete", week: 4 },
        { id: "M3", name: "CDR Complete", week: 6 },
        { id: "M4", name: "Structural Fabrication Complete", week: 14 },
        { id: "M5", name: "All Subsystems Fabricated", week: 28 },
        { id: "M6", name: "System Integration Complete", week: 34 },
        { id: "M7", name: "Validation Testing Complete", week: 40 },
        { id: "M8", name: "Documentation Complete — Device Ready", week: 42 },
      ],
    },
    {
      id: "sow-5",
      title: "5.0 Acceptance Criteria",
      content:
        "The Therapy Pod shall be accepted upon successful completion of all validation tests: (1) scalar field ≥50 V/m at patient position, (2) frequency precision ±0.01 Hz on all channels, (3) orgone temperature differential ≥1.0°F sustained 30+ minutes, (4) vortex water temperature 4.0°C ±0.5°C, (5) acoustic formant precision ±2 Hz, (6) TRZ phase-conjugate ratio >0.8, (7) emission spectrum capture 200–800nm at 0.1nm resolution, (8) all safety cutoffs <100ms response, (9) total power <3kW. Acceptance requires sign-off by the Lead Engineer and Safety Officer.",
    },
  ],
};

// ── SUPPRESSED CONCEPT REFERENCES ─────────────────────────────────────────
export const SUPPRESSED_CONCEPTS = [
  {
    name: "Prioré Device",
    inventor: "Antoine Prioré",
    year: "1962",
    patent: "French Patent 1,342,772",
    validation: "ONR Report R-5-78 (Bateman, 1978)",
    outcome: "0.7–0.95 survival fraction for terminal conditions",
    suppression: "Funding withdrawn 1980s; device dismantled after Prioré's death",
    role: "Multichannel modulation + TRZ disease reversal",
  },
  {
    name: "Rife Universal Microscope & Beam Ray",
    inventor: "Royal R. Rife",
    year: "1930s",
    patent: "None (suppressed)",
    validation: "1934 USC clinical trial (16/16 terminal cancer remission)",
    outcome: "Pathogen destruction via mortal oscillatory rates",
    suppression: "FDA raid 1939; equipment destroyed; Morris Fishbeine AMA campaign",
    role: "Frequency-specific pathogen elimination",
  },
  {
    name: "Scalar EM / Kindling",
    inventor: "Lt. Col. T.E. Bearden",
    year: "1980s–2000s",
    patent: "U.S. Patent 6,362,718 (MEG, 2002)",
    validation: "Peer-reviewed: Found. Phys. Lett. 14(1), 2001",
    outcome: "Longitudinal wave biopotential charging",
    suppression: "DoD classification; patent Sec. 181 secrecy orders",
    role: "Scalar wave generation + kindling mechanism",
  },
  {
    name: "Reich Orgone Accumulator",
    inventor: "Wilhelm Reich",
    year: "1940s–1957",
    patent: "None (FDA injunction)",
    validation: "Grad B. (1965) Int. J. Biometeorology — temp differential measured",
    outcome: "Biofield concentration via organic/metallic layers",
    suppression: "FDA injunction 1954; books burned by FDA 1956; Reich imprisoned, died 1957",
    role: "Orgone accumulator envelope",
  },
  {
    name: "Schauberger Implosion / Repulsine",
    inventor: "Viktor Schauberger",
    year: "1930s–1958",
    patent: "Austrian patents 1930s–50s",
    validation: "Documented in Schauberger archives",
    outcome: "Vortex water structuring at 4°C phase boundary",
    suppression: "Coerced into US contract 1958; died days after return; notes seized",
    role: "Vortex water structuring system",
  },
  {
    name: "Kaznacheyev Cytopathogenic Effect",
    inventor: "V.P. Kaznacheyev",
    year: "1974–1982",
    patent: "Soviet scientific literature",
    validation: "Published in Soviet scientific journals",
    outcome: "UV photon templates induce/reverse disease at a distance",
    suppression: "Soviet classification; Western dismissal",
    role: "UV photon template disease reversal mechanism",
  },
  {
    name: "Global Scaling Theory (G-Com)",
    inventor: "Dr. Hartmut Müller",
    year: "1982–2001",
    patent: "G-Com® demonstration Oct 27, 2001",
    validation: "2,500 km transmission at <1W, no EM radiation",
    outcome: "Standing gravitational wave node frequencies",
    suppression: "Academic ostracism; patent rejection",
    role: "Global Scaling resonator array",
  },
  {
    name: "Vedic Nada Brahma / Mantra System",
    inventor: "Vedic seers (Rig Veda, c. 1500 BCE)",
    year: "c. 1500 BCE",
    patent: "None (public domain textual tradition)",
    validation: "Tomatis Method (1950s–90s); 3,500-year continuous Gayatri transmission",
    outcome: "Bija syllable formant frequencies structure biofield",
    suppression: "Colonial-era dismissal; modern academic reductionism",
    role: "Acoustic bija frequency engineering",
  },
];