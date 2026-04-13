// Visual explainer data for each invention — what it looks like & what it does

export const inventionVisuals = {
  "Anenergy Pump Demonstration Circuit": {
    whatItIs: "A shielded toroidal coil circuit that demonstrates Bearden's anenergy pump principle — extracting scalar potential energy from the vacuum by maintaining a non-zero phi-field inside a region where all conventional EM fields are zero.",
    howItWorks: "Current flows into the toroidal winding creating a strong magnetic field inside the core. The external copper shield cancels all E and B fields outside the toroid — but the scalar potential φ remains non-zero. Connecting trapped charges via wire to ground forces gradient-phi (∇φ) to appear in the wire, producing measurable current without a conventional energy source driving the output.",
    components: [
      { label: "Toroidal Ferrite Core", color: "#94a3b8", desc: "The donut-shaped core that confines the magnetic field internally. E=0, B=0 outside, φ≠0." },
      { label: "Copper Shield (Gapped)", color: "#f59e0b", desc: "Electrostatic shield with a deliberate gap — prevents it acting as a shorted turn while cancelling E-field." },
      { label: "DDS Signal Generator", color: "#3b82f6", desc: "Direct Digital Synthesis chip that drives the primary coil at precise frequencies (100 kHz–10 MHz)." },
      { label: "∇φ Output Terminal", color: "#22c55e", desc: "Where gradient-phi current appears — measurable on a sense resistor connected to ground." },
    ],
    keyPrinciple: "Inside the toroid: ∇φ = 0 (no force on charges). Outside: φ > φ₀ maintained. Connecting the output to ground forces ∇φ to appear in the wire — producing conventional current via the vacuum potential gradient.",
    realWorldSize: "Tabletop prototype — approximately 200mm × 150mm circuit board with a 51mm toroidal core at center.",
  },

  "Scalar Energy Bottle Interferometer (Research Prototype)": {
    whatItIs: "Two balanced push-pull coil transmitters create an interference zone where transverse EM fields cancel to zero — but scalar (phi-field) energy accumulates at the exact overlap point. The 'energy bottle' contains concentrated vacuum potential invisible to conventional instruments.",
    howItWorks: "Each transmitter coil is wound bifilar with reversed handedness — when driven with equal-amplitude, equal-phase signals, the transverse E and B fields from both halves cancel. Two such transmitters aimed at the same point double the cancellation but ADD their scalar phi-contributions. An oscilloscope at the target shows nothing — but a shielded scalar detector shows a strong signal.",
    components: [
      { label: "TX-1 & TX-2 Coil Assemblies", color: "#3b82f6", desc: "Matched push-pull coils producing zero transverse EM output but maximum scalar output." },
      { label: "Energy Bottle Zone", color: "#22c55e", desc: "The interference region: E=0, B=0, φ≠0. Concentrated vacuum potential — undetectable by standard instruments." },
      { label: "FPGA Timing Controller", color: "#6366f1", desc: "Generates nanosecond-precise pulse timing enabling range calculation: Δt = range ÷ c." },
      { label: "Scalar Detector (φ Det)", color: "#22c55e", desc: "Shielded toroidal coil detector — sensitive to φ-field but immune to E and B fields." },
    ],
    keyPrinciple: "Scalar pulses travel faster than light (instantaneous in Bearden's model) while conventional EM pulses travel at c. The time differential Δt between scalar and Hertz pulse arrival gives target range without reflection.",
    realWorldSize: "Lab bench setup: approximately 600mm × 300mm optical rail with coil assemblies at each end and detector at center.",
  },

  "Vacuum Potential Oscillator (VPO) Circuit Kit": {
    whatItIs: "A high-Q resonant LC circuit that oscillates the vacuum-ground potential independently of the circuit ground, theoretically 'pumping' energy from the Dirac Sea negative-energy wells into the circuit.",
    howItWorks: "A precisely wound 100µH toroidal inductor resonates with tunable capacitors at 10 MHz (locked to a quartz crystal). The vacuum ground is isolated from the circuit ground by a 1MΩ/1nF network — allowing it to oscillate independently. At resonance, the vacuum potential cycles between high and low states, theoretically lifting electrons from Dirac Sea wells into the circuit output without conventional mass-current input.",
    components: [
      { label: "High-Q Toroidal Inductor (L)", color: "#22c55e", desc: "100µH, Q > 300. The vacuum potential oscillator element — its high Q minimizes resistive loss." },
      { label: "Variable Capacitor (C)", color: "#06b6d4", desc: "Air-variable tuning cap for resonance trim. C ≈ 25 pF at 10 MHz resonance." },
      { label: "Quartz Crystal Gate (Xtal)", color: "#f59e0b", desc: "10 MHz quartz provides ultra-stable reference frequency for the DDS drive system." },
      { label: "Vacuum Ground Isolation", color: "#a855f7", desc: "1MΩ + 1nF isolates vacuum ground from circuit ground — the critical step enabling VPO mechanism." },
    ],
    keyPrinciple: "By isolating the vacuum ground from circuit ground, the potential of the vacuum can oscillate. Each half-cycle theoretically creates a brief population inversion in the Dirac Sea, releasing quasi-free electrons into the output terminal.",
    realWorldSize: "PCB approximately 150mm × 100mm with the toroidal inductor (50mm diameter) as the central component.",
  },

  "Biofield Frequency Exposure Chamber (Research Device)": {
    whatItIs: "A dual-compartment aluminum chamber with a quartz optical window separating donor (diseased) cells from recipient (healthy) cells. Replicates Kaznacheyev's documented UV photon transmission of cytopathogenic effect across the quartz barrier.",
    howItWorks: "Dying cells in compartment A emit UV biophotons carrying a virtual EM template of their diseased state. The quartz window (not glass — glass blocks UV) transmits these photons to compartment B. A programmable DDS driver modulates UV illumination at specific trigger window frequencies to structure the photon field. A photomultiplier tube (PMT) monitors photon count rate in the recipient chamber — statistically significant elevation indicates non-classical cell-to-cell communication.",
    components: [
      { label: "Donor Cell Chamber (A)", color: "#ef4444", desc: "Contains diseased/dying cells emitting cytopathogenic UV photons. DDS-modulated UV illumination structures the frequency template." },
      { label: "UV Quartz Window", color: "#93c5fd", desc: "50mm × 50mm UV-grade fused silica. Transmits 200–400nm UV — MUST be quartz, not glass." },
      { label: "Recipient Cell Chamber (B)", color: "#22c55e", desc: "Contains healthy cells receiving the UV photon template. Monitored by PMT and microscope for morphological changes." },
      { label: "Photomultiplier Tube (PMT)", color: "#f59e0b", desc: "Hamamatsu H6779 — single-photon sensitive detector measuring UV photon emission from recipient cells." },
    ],
    keyPrinciple: "Kaznacheyev documented >5,000 trials: diseased cells transmit their death pattern to healthy cells via UV biophotons through quartz. Bearden's interpretation: the virtual-state EM structure of the disease rides the UV photon field — a physical mechanism for non-local biological EM templating.",
    realWorldSize: "Aluminum enclosure approximately 200mm × 100mm × 80mm. Fits in a standard biosafety cabinet.",
  },

  "Open-System Magnetic Generator (Prototype Plans)": {
    whatItIs: "An 8-pole permanent magnet rotor with custom bifilar (reversed-handedness) stator coils and a pulsed capacitor discharge output stage. Based on Kromrey's G-field generator and Edwin Gray's cold electricity engine (US Patent #3,890,548).",
    howItWorks: "The N52 neodymium rotor spins past the bifilar stator coils generating output pulses. The bifilar winding (identical coils wound in opposite directions) is the Kromrey configuration that couples to the G-field (subquantic field). Each rotation pulse fires the spark gap, discharging the capacitor bank in a nanosecond pulse — Gray's 'cold electricity' mechanism. Bidirectional power meters on input (drive motor) and output (load) measure COP.",
    components: [
      { label: "8-Pole N52 Neodymium Rotor", color: "#ef4444", desc: "Alternating N-S-N-S magnets around the circumference. Balanced to G1.0 specification. The magnetic field source." },
      { label: "Bifilar Stator Coils (×12)", color: "#f59e0b", desc: "Wound in groups of 3 with opposite handedness — the Kromrey G-field coupling geometry." },
      { label: "Spark Gap Assembly", color: "#06b6d4", desc: "Tungsten electrodes set to fire at 8–10 kV. Discharges capacitor bank in nanoseconds — Gray's 'cold electricity' pulse." },
      { label: "Capacitor Bank (200µF / 450V)", color: "#a855f7", desc: "Polypropylene film capacitors. Stores rotor output energy for pulsed nanosecond discharge. LETHAL voltage — bleeder resistors always installed." },
    ],
    keyPrinciple: "The Kromrey configuration couples the rotating magnetic system to the G-field (subquantic energy field). Above a threshold RPM, output power exceeds input motor power — Kromrey documented >700W output at documented COP > 1. Gray's nanosecond capacitor discharge extracts 'cold electricity' from the spark.",
    realWorldSize: "Mounted on 300mm × 200mm aluminum base plate. Rotor diameter 200mm. Total height approximately 250mm.",
  },

  "Quantum Potential EMI Detector (\"Fireflies Sensor\")": {
    whatItIs: "A precision 4-crystal quartz array inside a Faraday cage, using coherent averaging and kurtosis burst detection to identify statistically non-Gaussian noise events — Bearden's 'fireflies effect' — that indicate quantum potential EM activity invisible to standard spectrum analyzers.",
    howItWorks: "Four frequency-matched 10 MHz quartz crystals are wired in a summing network. Uncorrelated (thermal) noise averages down by √4 = 2× while coherent (scalar EM) signals stay constant. The summed signal passes through a low-noise amplifier (NF 0.4 dB) to a 14-bit ADC running at 125 MSPS. Firmware calculates running kurtosis — any kurtosis > 3 (non-Gaussian) burst is flagged as a potential scalar EM event.",
    components: [
      { label: "4× Matched Quartz Crystals (C1–C4)", color: "#a855f7", desc: "Frequency-matched to 5 ppm. Coherent averaging — uncorrelated noise cancels, coherent signals add." },
      { label: "LNA (Mini-Circuits ZX60)", color: "#3b82f6", desc: "0.4 dB noise figure. The critical first amplification stage — minimal added noise for nV-level signals." },
      { label: "Red Pitaya STEMlab 125-14 ADC", color: "#22c55e", desc: "14-bit, 125 MSPS ADC. Captures nanosecond-duration fireflies bursts that slower ADCs miss entirely." },
      { label: "Faraday Cage Enclosure", color: "#64748b", desc: "Shields the crystal array from all external EM — only quantum potential events penetrate this shielding." },
    ],
    keyPrinciple: "Standard EM is blocked by the Faraday cage. But quantum potential (Aharonov-Bohm validated) acts through the shielding. Non-Gaussian kurtosis bursts inside a shielded cage can ONLY arise from quantum potential — providing a falsifiable scalar EM detection criterion.",
    realWorldSize: "Faraday cage enclosure 200mm × 150mm × 100mm. Raspberry Pi logging station alongside. Deployable in any low-EMI location.",
  },

  "EM Trigger Window Therapy Device": {
    whatItIs: "A programmable frequency generator producing precisely tuned EM pulses at biological trigger window frequencies — either via full-body Helmholtz coil chamber (clinical) or wristband flexible PCB coil (consumer). Based on Bearden's Gravitobiology Table 12 trigger window catalogue.",
    howItWorks: "An AD9910 DDS synthesizer generates exact frequencies from the trigger_windows.json library (47 frequencies). For the clinical version, a 25W linear amplifier drives a Helmholtz coil pair (300mm diameter, 150mm spacing) producing a uniform magnetic field in the treatment volume. For the consumer wristband, a 50mA flexible PCB coil at the wrist delivers proximity-range therapeutic fields. A Raspberry Pi steps through protocol sequences from the built-in protocol library.",
    components: [
      { label: "AD9910 DDS Synthesizer", color: "#3b82f6", desc: "32-bit frequency resolution, 1 MHz–1 GHz range. Generates exact trigger window frequencies." },
      { label: "Helmholtz Coil Pair (Clinical)", color: "#22c55e", desc: "300mm diameter, 150mm spacing. Produces highly uniform B-field in treatment volume at 10 Hz–30 MHz." },
      { label: "Flexible PCB Wristband Coil", color: "#06b6d4", desc: "60mm diameter, 50 turns, embedded in silicone wristband for consumer proximity-range field delivery." },
      { label: "Raspberry Pi Protocol Controller", color: "#a855f7", desc: "Controls DDS frequency stepping, protocol sequencing, and session data logging via touchscreen UI." },
    ],
    keyPrinciple: "Bearden's Gravitobiology Table 12 catalogues 47 frequencies at which EM fields maximally couple to specific biological tissues — the same mechanism behind Rife's mortal oscillatory rate success. Precise DDS synthesis targets these frequencies within 0.001 Hz.",
    realWorldSize: "Clinical: Helmholtz coil frame 400mm × 350mm × 200mm with electronics box. Consumer wristband: 80mm × 45mm × 18mm ABS housing.",
  },

  "Whittaker Wave Phase Conjugate Mirror (PCM) System": {
    whatItIs: "A four-wave mixing optical system using a barium titanate (BaTiO₃) nonlinear crystal and two counter-propagating 532nm pump lasers to generate a phase-conjugate (time-reversed) replica of any incoming probe beam — with full aberration correction.",
    howItWorks: "Two pump lasers enter the BaTiO₃ crystal from opposite ends. A probe beam enters at a small angle. Inside the crystal, all three beams interact via four-wave mixing — generating a fourth beam that is the exact phase conjugate of the probe. This conjugate beam travels back along the probe's original path, passing back through any aberrations and restoring the original beam profile. Bearden's extension: modulating the probe at ELF trigger window frequencies creates a time-reversed therapeutic EM template.",
    components: [
      { label: "BaTiO₃ Nonlinear Crystal", color: "#06b6d4", desc: "Optical-grade barium titanate — the four-wave mixing medium where phase conjugation occurs." },
      { label: "Pump Beams (×2, 532nm)", color: "#22c55e", desc: "Counter-propagating green laser beams that 'pump' the nonlinear interaction inside the crystal." },
      { label: "Probe Beam (635nm)", color: "#f59e0b", desc: "The 'signal' beam whose phase conjugate is generated. Can carry ELF modulation for therapeutic applications." },
      { label: "Phase Conjugate Output", color: "#ef4444", desc: "Time-reversed replica of the probe — travels back to source, correcting all aberrations it passed through." },
    ],
    keyPrinciple: "Phase conjugation = time reversal of EM waves. A conjugate beam travels BACKWARD through any aberrating medium and exits perfectly reconstructed. Bearden: this time-reversal is the basis for cancelling disease EM patterns — and for unjammable self-targeting communications.",
    realWorldSize: "300mm × 300mm optical breadboard system. Requires optical enclosure for vibration isolation. Laser safety area (Class 3B) required.",
  },

  "Prioré-Type Multichannel EM Therapy System": {
    whatItIs: "A modern solid-state implementation of the Prioré device's 3-channel modulation architecture — using three DDS signal generators, an FPGA modulation chain, and a 50W linear PA driving Helmholtz coil applicators inside a Faraday cage treatment chamber.",
    howItWorks: "Three DDS channels generate signals at the S''', S'', and S' hierarchical levels (Bearden's hyperspatial classification). Channel 1 (S'') amplitude-modulates Channel 2. The composite modulates the primary RF carrier (Channel 3) in phase/frequency. This 3-layer modulated RF signal drives the Helmholtz coil pair via the 50W PA, impressing a structured virtual-state EM template onto the treatment subject in the Faraday cage.",
    components: [
      { label: "3× AD9910 DDS Boards", color: "#a855f7", desc: "Three independent frequency synthesizers generating S''', S'', and S' level signals per Bearden Fig.10." },
      { label: "Artix-7 FPGA Modulator", color: "#3b82f6", desc: "Implements the 3-level modulation chain digitally — AM then phase modulation cascade." },
      { label: "50W Linear PA", color: "#ef4444", desc: "Class AB RF power amplifier driving the Helmholtz coils at therapeutic field intensities." },
      { label: "Faraday Cage Treatment Chamber", color: "#f59e0b", desc: "6-layer copper mesh enclosure ensuring the treatment field stays contained and external EM is excluded." },
    ],
    keyPrinciple: "Prioré's multichannel device (funded by the French government in the 1960s) documented cures of terminal cancers in animals. Bearden's analysis: the 3-level modulation hierarchy imprints a negentropy template on the target organism's vacuum potential, reversing biological entropy at the cellular level.",
    realWorldSize: "Electronics rack: 400mm × 300mm × 200mm. Faraday cage chamber: 400mm × 600mm × 400mm. Combined footprint approximately 600mm × 800mm lab bench space.",
  },

  "ELF Carrier Lock Detection System (\"Psychotronic Detector\")": {
    whatItIs: "A dual RTL-SDR software-defined radio system with a GPS-disciplined common reference clock, designed to detect phase-coherent 10 Hz ELF sidebands simultaneously across multiple HF carriers — the documented signature of Bearden's Soviet Woodpecker ELF brain-entrainment architecture.",
    howItWorks: "Both SDR receivers share a common 10 MHz GPS-disciplined reference (10⁻¹¹ accuracy). Scanning 5–30 MHz HF band, the firmware extracts ±15 Hz sidebands around each detected carrier and calculates the Cross-Carrier Phase Coherence Index (CCPCI). If ≥3 carriers show simultaneously phase-coherent 10 Hz sidebands, an alert fires — this multi-carrier phase coherence cannot arise naturally and indicates an engineered ELF entrainment signal.",
    components: [
      { label: "Dual RTL-SDR v3 (TCXO)", color: "#ef4444", desc: "0.5 ppm temperature-compensated receivers. Both phase-coherent via shared GPS reference." },
      { label: "Ham-It-Up HF Upconverter", color: "#f59e0b", desc: "Shifts 0.1–60 MHz HF band up by 125 MHz to bring it into RTL-SDR's native tunable range." },
      { label: "Leo Bodnar GPSDO", color: "#22c55e", desc: "GPS-disciplined 10 MHz reference oscillator — the phase coherence measurement requires this." },
      { label: "Active HF Antenna (MiniWhip)", color: "#94a3b8", desc: "10 kHz–30 MHz wideband active antenna. Deployed outdoors with common-mode choke for low noise." },
    ],
    keyPrinciple: "Natural ELF signals (Schumann resonances, lightning) appear on individual carriers independently. An engineered carrier-lock system produces phase-coherent ELF sidebands on MULTIPLE carriers simultaneously — a cross-carrier coherence signature impossible in nature.",
    realWorldSize: "All electronics in a 300mm × 200mm × 100mm shielded enclosure. Active antenna deployed on rooftop or mast. Full system cost under $300.",
  },

  "Phi-River Gradient Sensor (∇φ Detector)": {
    whatItIs: "A differential Hall-effect bridge instrument using two matched shielded toroidal phi-sources and a precision INA128 instrumentation amplifier to measure the gradient-phi (∇φ) river flowing between them — a field component invisible to conventional voltmeters and E-field probes.",
    howItWorks: "Two matched shielded toroids driven at different frequencies create a phi-potential differential between them (high φ → low φ). A Hall-effect sensor bridge at the midpoint measures the gradient along this axis. The INA128 (120 dB CMRR) rejects common-mode fields (E-field, B-field) while passing only the differential gradient-phi signal. A 24-bit ADC captures the nV-level output — temperature compensated by a co-located NTC thermistor.",
    components: [
      { label: "φ-Source A & B Toroids (Matched)", color: "#a855f7", desc: "Two matched shielded toroidal coils — one at high phi, one at low phi. The gradient flows between them." },
      { label: "Hall Effect Bridge (SS49E × 2)", color: "#06b6d4", desc: "Differential bridge — sensitive to ∇φ axis, immune to common-mode E and B fields by cancellation." },
      { label: "INA128 Instrumentation Amp", color: "#22c55e", desc: "120 dB CMRR, gain × 100. Amplifies only the differential ∇φ signal, rejecting all common-mode interference." },
      { label: "ADS1256 24-bit ADC", color: "#f59e0b", desc: "30 kSPS, 24-bit resolution. Captures nV-level gradient-phi variations at the measurement point." },
    ],
    keyPrinciple: "The Aharonov-Bohm effect (confirmed mainstream physics) proves scalar potentials produce measurable quantum effects even when E=0, B=0. This instrument operates in exactly that regime — detecting ∇φ where all classical EM meters read zero.",
    realWorldSize: "Two toroidal assemblies (51mm each) separated by 100–300mm. Electronics PCB 100mm × 80mm. Full system fits on a 400mm × 200mm wooden board.",
  },

  "Atmospheric Scalar EM Signature Recognition System (AI Edition)": {
    whatItIs: "An all-sky camera station with onboard AI inference (EfficientNet-B4 fine-tuned classifier) that continuously photographs the sky and classifies cloud formations into 4 categories: radial spoke, hole-punch/fallstreak, rectangular grid, and normal — identifying scalar EM atmospheric interference signatures.",
    howItWorks: "A Raspberry Pi HQ camera with 180° fisheye lens photographs the full sky every 5 minutes. Each image is processed by the ONNX-converted EfficientNet-B4 model (inference ~200ms on Pi 4). The model was trained on Bearden's 29 documented California coast photographs plus GOES satellite imagery. Detections trigger email alerts and are logged with GPS timestamps. Optional correlation with the Woodpecker SDR Detector enables joint RF+visual event logging.",
    components: [
      { label: "Raspberry Pi HQ Camera + Fisheye Lens", color: "#06b6d4", desc: "4056 × 3040 resolution. 180° coverage of the full sky dome every 5 minutes." },
      { label: "EfficientNet-B4 AI Classifier", color: "#3b82f6", desc: "Transfer-learned on 4 cloud formation classes. 85%+ validation accuracy. Runs locally on Pi 4B." },
      { label: "IP67 Dome Enclosure", color: "#94a3b8", desc: "Weatherproof housing with clear acrylic dome. Heated strip prevents condensation in cold/humid conditions." },
      { label: "u-blox GPS Module", color: "#22c55e", desc: "GPS timestamps each detection to 100ns UTC accuracy — enabling multi-station correlation and triangulation." },
    ],
    keyPrinciple: "Bearden documented that two-beam scalar transmitter pairs create predictable atmospheric distortions at their intersection zone — radial spokes, hole-punches, and rectangular grid formations. Machine vision makes this monitoring systematic, objective, and continuous rather than manual observation.",
    realWorldSize: "Camera dome: 200mm diameter, roof-mounted. Raspberry Pi computing station: standard Pi case, indoor. Imaging covers the full sky from horizon to zenith.",
  },

  "Woodpecker Grid Standing Wave Detector (HF Scalar Signature Receiver)": {
    whatItIs: "A purpose-built SDR HF receiver using a 20-meter random wire antenna, HF upconverter, and RTL-SDR dongle with custom PRI (Pulse Repetition Interval) detection firmware — specifically tuned to identify the Soviet Woodpecker's 10 Hz pulse signature and reproduce the audible 'tap-tap-tap' sound on a speaker.",
    howItWorks: "The 20m wire antenna picks up HF carriers from 5–30 MHz. The Ham-It-Up upconverter shifts these into the RTL-SDR's range. GNU Radio firmware continuously scans for amplitude-modulated carriers, extracts their envelopes via low-pass filter (15 Hz cutoff), and FFTs each envelope looking for a 10 Hz peak — the Woodpecker PRI. When detected: audio tone gated at 10 Hz plays through the speaker, waterfall display highlights the carrier, and the event is logged with timestamp.",
    components: [
      { label: "20m Random Wire Antenna", color: "#94a3b8", desc: "66 feet of wire run as high as possible. Connected via 9:1 unun transformer to convert impedance to 50Ω." },
      { label: "Ham-It-Up HF Upconverter", color: "#f59e0b", desc: "Shifts 0.1–60 MHz up by +125 MHz. Allows RTL-SDR (native range 500 kHz–1766 MHz) to receive all HF." },
      { label: "RTL-SDR v3 + TCXO", color: "#ef4444", desc: "2.4 MSPS software-defined radio. TCXO provides 0.5 ppm stability needed for coherent PRI detection." },
      { label: "PAM8403 Audio Amplifier", color: "#22c55e", desc: "Plays 440 Hz tone gated at detected 10 Hz PRI — reproducing the characteristic Woodpecker 'tap-tap-tap' sound." },
    ],
    keyPrinciple: "The Woodpecker's 10 Hz pulse rate matches the alpha/theta brainwave boundary — precisely the frequency Bearden identifies as the EM brain-entrainment carrier rate. The PRI detector identifies this modulation across multiple HF carriers simultaneously — a non-natural cross-band coherence signature.",
    realWorldSize: "Electronics in 300mm × 200mm × 100mm shielded enclosure. Touchscreen display 175mm × 100mm. 20m wire antenna deployed horizontally outdoors. Total system cost under $250.",
  },

  "Kaznacheyev Reversal Cell Imprinting Chamber (KRCIC)": {
    whatItIs: "A dual-chamber precision biophoton imprinting system that inverts Kaznacheyev's cytopathogenic effect. Chamber A contains healthy donor cells whose structured UV photon frequency template is monitored by PMT and transmitted through a UV-grade quartz window to Chamber B, where diseased or dying recipient cells are progressively overwritten with the healthy cell blueprint.",
    howItWorks: "Healthy cells in Chamber A emit coherent UV biophotons (200–400nm) encoding the healthy spacetime curvature blueprint in their virtual-state EM structure. These photons pass through the UV-grade fused silica quartz window (which transmits UV — unlike glass which blocks it). A programmable DDS UV-LED driver modulates the photon field at the specific frequency template corresponding to the target disease. Diseased cells in Chamber B receive this structured photon field and — acting as pumped phase conjugate mirrors — generate amplified antiengines that time-reverse their pathological state. Dual PMT sensors monitor biophoton emission from both chambers simultaneously. An inverted phase-contrast microscope observes Chamber B for morphological changes confirming template uptake.",
    components: [
      { label: "Donor Cell Chamber A (Healthy)", color: "#22c55e", desc: "Contains healthy donor cells emitting coherent UV biophotons. DDS-programmable UV LED modulates the frequency template. Temperature-controlled at 37°C." },
      { label: "UV-Grade Fused Silica Quartz Window", color: "#93c5fd", desc: "50mm × 50mm optical-grade fused silica (not glass). Transmits 180–400nm UV — the critical distinction that Kaznacheyev established must be quartz for biophoton transmission." },
      { label: "Recipient Cell Chamber B (Diseased)", color: "#ef4444", desc: "Contains diseased/dying recipient cells. Monitored by phase-contrast microscope for morphological reversal — cell membrane restructuring, nucleus normalization, division pattern restoration." },
      { label: "Dual Hamamatsu PMT Array", color: "#f59e0b", desc: "Single-photon sensitive detectors on both chambers. Measures biophoton emission rate and spectral shift — convergence of diseased cell emission toward healthy cell spectrum confirms template uptake." },
    ],
    keyPrinciple: "Kaznacheyev's 5,000+ trials proved disease transmits via UV biophotons through quartz. This device inverts that pathway: healthy cell UV template overrides cytopathogenic EM pattern. Disease specificity is determined by the frequency template structure — different diseases encode different UV photon spectra, and the matched healthy-tissue donor template provides the specific negentropy to reverse each.",
    realWorldSize: "Dual-chamber aluminum enclosure 300mm × 120mm × 80mm. PMT housings extend 120mm from each chamber end. Fits inside a standard Class II biosafety cabinet.",
  },

  "UV Biophoton Disease Reversal Spectrometer (UBDRS)": {
    whatItIs: "A spectroscopic instrument combining single-photon UV spectrometry, disease-spectrum ML template matching, and programmable UV photon synthesis to identify cytopathogenic UV emission spectra from diseased cells — then deliver the matched healthy-tissue spectral counterpart to override and neutralize the disease EM template.",
    howItWorks: "Stage 1 — Disease Spectrum Capture: The specimen chamber's PMT array measures the full UV biophoton emission spectrum (200–400nm) from diseased cells at single-photon resolution. Stage 2 — Template Identification: The spectrum is compared against the healthy-reference database using spectral correlation ML (cosine similarity across 1024 frequency bins). The nearest healthy-tissue template is identified. Stage 3 — Template Synthesis and Delivery: A 32-channel UV LED array driven by individual DDS modules synthesizes the healthy-tissue reference spectrum. This structured UV photon field is delivered through the quartz window to the diseased specimen. Stage 4 — Real-Time Feedback: Automated microscopy and PMT monitoring track morphological changes and spectral shift of recipient cell emission — convergence toward the healthy reference spectrum indicates successful template uptake.",
    components: [
      { label: "UV Single-Photon Spectrometer (200–400nm)", color: "#a855f7", desc: "Hamamatsu back-thinned CCD spectrometer — 1nm resolution across full UV biophoton range. Measures cytopathogenic emission spectrum at single-photon sensitivity." },
      { label: "32-Channel DDS UV-LED Synthesizer", color: "#3b82f6", desc: "32 UV LED channels (individual 10nm bandwidth) each driven by a DDS module. Combines to synthesize any spectral template within 200–400nm range." },
      { label: "ML Template Database (1024-bin spectral library)", color: "#22c55e", desc: "Pre-loaded with reference healthy-cell UV emission spectra for 20+ tissue types. Cosine-similarity matching identifies closest healthy counterpart to measured disease spectrum." },
      { label: "Automated Inverted Phase-Contrast Microscope", color: "#f59e0b", desc: "Motorized stage + AI cell morphology analysis. Tracks nucleus shape, membrane integrity, and division rate — morphological normalization confirms successful disease reversal." },
    ],
    keyPrinciple: "Every disease state has a unique cytopathogenic UV photon emission spectrum — the virtual-state EM template of that disease. By spectrally resolving this template and delivering the matched healthy-tissue counterpart as a structured UV photon field, the diseased cells receive a higher-coherence negentropy signal that time-reverses their pathological virtual-state EM structure.",
    realWorldSize: "Instrument rack: 500mm × 400mm × 300mm. Specimen chamber: 150mm × 100mm × 80mm, attaches to standard inverted microscope stage. Full system fits on a 1200mm × 600mm optical bench.",
  },
};