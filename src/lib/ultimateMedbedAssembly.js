// ── OMEGA MEDBED DETAILED ASSEMBLY MANUAL ───────────────────────────────────
// Step-by-step technical assembly layout for ZA-MB-Ω
// Each phase broken into sub-steps with tools, parts, and verification checks.

export const ASSEMBLY_STEPS = [
  // ── Phase A: Structural Frame + Canopy ──
  {
    phase: "A", title: "Structural Frame + Canopy", hours: 16,
    color: "#64748b",
    steps: [
      { id: "A1", title: "Lay out base frame extrusions", tool: "Torque wrench, M8 hex bit", parts: "4× 6061-T6 aluminum extrusion (2.4m), 4× corner brackets", detail: "Place 4 horizontal extrusions on assembly table forming the base rectangle (2.4m × 1.6m). Secure corner brackets with M8 bolts finger-tight.", verify: "Frame square — diagonal measurements equal ±2mm" },
      { id: "A2", title: "Install vertical posts", tool: "Torque wrench, level", parts: "4× vertical extrusions (1.8m), 8× M8 fasteners", detail: "Mount 4 vertical posts at each corner. Torque all M8 fasteners to 20 Nm in cross-pattern sequence.", verify: "Posts plumb — vertical deviation <1mm over full height" },
      { id: "A3", title: "Install leveling feet", tool: "Wrench 19mm", parts: "4× adjustable leveling feet", detail: "Thread leveling feet into base corner brackets. Adjust until frame sits level on floor.", verify: "Frame level — bubble level centered on both axes" },
      { id: "A4", title: "Mount canopy cross-braces", tool: "Torque wrench", parts: "2× horizontal cross-braces, 4× M8 fasteners", detail: "Install horizontal cross-braces at canopy height (1.7m). These support the motorized canopy assembly.", verify: "Cross-braces level — measured at both ends" },
      { id: "A5", title: "Install canopy linear actuator", tool: "Hex key set", parts: "1× linear actuator (500-1200mm travel), 4× M6 fasteners", detail: "Mount linear actuator to center cross-brace. Attach actuator rod to canopy frame mounting plate.", verify: "Actuator travel smooth — full extension without binding" },
      { id: "A6", title: "Route cable management channels", tool: "Cable ties, snips", parts: "1× cable management channel kit, 20× cable ties", detail: "Install cable channels along left and right vertical posts. Route from base to canopy for future wiring.", verify: "Channels secure — no obstruction of actuator travel" },
    ],
  },
  // ── Phase B: Orgone Accumulator Envelope ──
  {
    phase: "B", title: "Orgone Accumulator Envelope", hours: 10,
    color: "#65a30d",
    steps: [
      { id: "B1", title: "Install innermost organic layer", tool: "Heavy-duty shears, staple gun", parts: "1× sheep wool felt sheet (10mm, 2.4m × 1.6m)", detail: "Line the inner chamber walls with the first organic (wool felt) layer. Secure with stainless staples at 100mm intervals.", verify: "Full wall coverage — no gaps or folds" },
      { id: "B2", title: "Apply first metallic layer", tool: "Tin snips, gloves", parts: "1× galvanized steel sheet (0.5mm, 2.4m × 1.6m)", detail: "Place galvanized steel sheet directly over the wool felt. Overlap seams by 20mm. Secure with copper rivets at 200mm intervals.", verify: "Metallic layer flat — no sharp edges exposed" },
      { id: "B3", title: "Repeat alternating layers 3-20", tool: "Staple gun, rivet tool", parts: "19× alternating wool felt + steel sheets", detail: "Continue alternating organic (wool) and metallic (steel) layers for a total of 20 layers. Each layer must fully cover the previous.", verify: "20 layers counted — alternating pattern verified" },
      { id: "B4", title: "Install mineral wool insulation", tool: "Utility knife", parts: "1× mineral wool insulation (50mm, R-13)", detail: "Wrap the outermost layer with mineral wool for thermal isolation. Seal seams with aluminum tape.", verify: "No thermal bridges — seams fully sealed" },
      { id: "B5", title: "Verify temperature differential", tool: "2× calibrated thermometers", parts: "None", detail: "Place one thermometer inside the chamber and one outside. Wait 30 minutes. Verify ≥1.0°F differential per Reich/Grad protocol.", verify: "Temperature differential ≥1.0°F sustained 30+ minutes" },
    ],
  },
  // ── Phase C: Faraday Shield + Scalar EM Coil Array ──
  {
    phase: "C", title: "Faraday Shield + Scalar EM Coil Array", hours: 18,
    color: "#06b6d4",
    steps: [
      { id: "C1", title: "Install Faraday copper mesh", tool: "Tin snirs, copper tape", parts: "1× copper mesh (0.1mm, 99.9% purity), conductive copper tape", detail: "Line the inner chamber walls with copper mesh. Overlap seams by 50mm and seal with conductive copper tape. Connect to ground rail.", verify: "Continuity test — <0.1Ω from any point to ground" },
      { id: "C2", title: "Mount octagonal coil base ring", tool: "Level, hex key", parts: "1× coil base ring (8-sided), 8× M6 fasteners", detail: "Mount the octagonal coil base ring at mid-chamber height. Ensure it is level and centered.", verify: "Ring level — centered within ±5mm" },
      { id: "C3", title: "Wind 8 bifilar coil pairs", tool: "Coil winder, AWG14 enameled copper wire", parts: "8× Fair-Rite 77 ferrite cores, 500m AWG14 wire", detail: "Wind 144 turns bifilar on each of 8 ferrite cores. Two wires wound simultaneously. Secure with high-temp tape.", verify: "144 turns counted — DC resistance matched ±2% across all coils" },
      { id: "C4", title: "Mount coil pairs on octagonal ring", tool: "Hex key, torque wrench", parts: "8× wound coil assemblies, 16× M5 fasteners", detail: "Mount each coil pair at one of 8 octagonal positions. Coils oriented vertically. Torque M5 to 3 Nm.", verify: "All 8 coils at equal radial distance — measured ±1mm" },
      { id: "C5", title: "Wire coil array to Class-D amplifier", tool: "Soldering iron, multimeter", parts: "1× 8-ch Class-D amplifier, 40m 12AWG shielded cable", detail: "Route shielded cable from each coil to amplifier output channels. Solder connections. Keep pair wiring twisted to maintain phase opposition.", verify: "Phase opposition verified — oscilloscope shows 180° between paired channels" },
      { id: "C6", title: "Field strength verification", tool: "Narda ELT-400 field probe", parts: "None", detail: "Power on amplifier at 50% duty. Measure field at patient position (center, 200mm above bed).", verify: "Field strength ≥50 V/m equivalent at patient position" },
    ],
  },
  // ── Phase D: Prioré + Rife/Lisitsyn Systems ──
  {
    phase: "D", title: "Prioré + Rife/Lisitsyn Systems", hours: 14,
    color: "#2dd4bf",
    steps: [
      { id: "D1", title: "Mount Prioré modulator chassis", tool: "Hex key", parts: "1× Prioré modulator chassis, 4× M6 fasteners", detail: "Mount the Prioré modulator chassis in the rear equipment rack. Allow 50mm clearance for ventilation.", verify: "Chassis secure — no movement when rack is tilted" },
      { id: "D2", title: "Install Bedini electron tubes", tool: "Tube socket tool, gloves", parts: "4× Bedini-conditioned 6L6GC tubes (reversed mode)", detail: "Insert 4 Bedini tubes into their sockets on the modulator. Tubes operate in reversed mode — verify pin orientation matches Bedini conditioning spec.", verify: "Tube heater glow uniform — no arcing on power-up test" },
      { id: "D3", title: "Wire DDS frequency synthesizers", tool: "Soldering iron, oscilloscope", parts: "3× AD9854 DDS modules, 1× OCXO 10MHz reference", detail: "Connect 3 DDS modules (F1, F2, F3 channels) to the OCXO master clock. Route outputs to the RF mixer inputs.", verify: "All 3 channels locked to OCXO — frequency precision ±0.01 Hz verified" },
      { id: "D4", title: "Install Rife plasma tube array", tool: "Hex key, high-voltage gloves", parts: "4× plasma tubes (Argon/Neon), 4× tube mounts, HV cables", detail: "Mount 4 plasma tubes at 90° intervals around the chamber upper ring. Connect HV cables to driver. CAUTION: Do not power during installation.", verify: "All tubes seated — no HV arc to ground (megger test at 5kV)" },
      { id: "D5", title: "Install quartz UV applicators", tool: "Hex key, UV safety glasses", parts: "4× quartz-windowed UV applicators, 4× solenoid shutters", detail: "Mount UV applicators at 4 porthole positions. Install interlocked solenoid shutters. Wire shutter control to BFAC safety relay.", verify: "Shutter closes on E-stop — response <250ms" },
      { id: "D6", title: "Load Lisitsyn frequency table", tool: "Laptop, USB cable", parts: "Keysight 33600A function generator", detail: "Connect laptop to function generator. Upload the 24-window Lisitsyn trigger table. Verify sweep covers 12.5 Hz to 6.1×10¹⁴ Hz.", verify: "All 24 windows accessible — sweep time <30s full range" },
    ],
  },
  // ── Phase E: PBM + PEMF + FIR Arrays ──
  {
    phase: "E", title: "PBM + PEMF + FIR Physical Therapy Arrays", hours: 20,
    color: "#ef4444",
    steps: [
      { id: "E1", title: "Mount overhead PBM LED panels", tool: "Hex key, thermal paste", parts: "6× 660nm LED panels, 2× 810nm panels, 4× 850nm panels, 12× heat sinks", detail: "Mount PBM panels on canopy underside in 5×5 grid pattern. Apply thermal paste to each heat sink. Connect to PBM driver boards.", verify: "All panels illuminate — irradiance 100-120 mW/cm² at bed surface" },
      { id: "E2", title: "Install NTC temperature sensors on PBM", tool: "Soldering iron", parts: "12× NTC 10k sensors", detail: "Solder one NTC sensor to each PBM panel. Route wires to BFAC ADC inputs.", verify: "All 12 sensors read within ±1°C of ambient" },
      { id: "E3", title: "Install under-mattress PEMF matrix", tool: "Hex key, multimeter", parts: "4× litz wire coils (AWG20×50), 1× PEMF driver board", detail: "Place 4 PEMF coils in 2×2 grid under mattress. Connect to driver board. Wire ACS712 current monitors per coil.", verify: "Field uniformity ±5% across patient surface — measured at 9 points" },
      { id: "E4", title: "Mount FIR side-wall panels", tool: "Hex key, thermal paste", parts: "4× FIR carbon fiber panels (420×230mm), 4× ceramic fiber insulation blankets", detail: "Mount FIR panels on left and right chamber walls. Apply ceramic fiber insulation to rear faces. Wire NTC thermistors at 3 contact points.", verify: "Panels heat to 55°C — TCO cutoff at 60°C verified" },
      { id: "E5", title: "Install under-mattress FIR panel", tool: "Hex key", parts: "2× FIR panels, 2× insulation blankets", detail: "Place FIR panels beneath mattress with insulation below. Route thermistor wires through cable channel.", verify: "Under-mattress temp reaches 37°C — no hot spots on thermal camera" },
      { id: "E6", title: "Calibrate PBM 5×5 grid", tool: "Power meter, alignment jig", parts: "None", detail: "Use alignment jig to verify each PBM panel is aimed at the correct grid coordinate. Adjust angles for uniform coverage.", verify: "5×5 grid irradiance uniform — max deviation <10% across grid" },
    ],
  },
  // ── Phase F: VAT + MCT + NIA + CHM ──
  {
    phase: "F", title: "VAT + MCT + NIA + CHM Systems", hours: 12,
    color: "#a855f7",
    steps: [
      { id: "F1", title: "Embed VAT transducers in mattress", tool: "Utility knife, adhesive", parts: "8× Dayton BST-1 tactile transducers, adhesive", detail: "Cut 8 pockets in memory foam mattress. Insert transducers at dorsal contact points. Route wires through mattress underside.", verify: "All 8 transducers vibrate — tested at 40 Hz, palpable across full dorsal surface" },
      { id: "F2", title: "Wire VAT amplifier + DSP", tool: "Soldering iron", parts: "2× Class-AB amplifiers (50W/ch), 1× ADAU1701 DSP, 1× SPL limiter", detail: "Connect DSP to amplifiers. Route amplifier outputs to mattress transducers. Install SPL limiter in signal chain.", verify: "SPL limited to 85 dB at patient ear — verified with Class 1 SPL meter" },
      { id: "F3", title: "Install MCT electrode ports", tool: "Hex key, crimp tool", parts: "4× gold-plated electrode ports, 1× MCT driver board, 4× GFCI modules", detail: "Mount 4 electrode ports at armrest (2) and headrest (2). Wire to MCT driver with GFCI on each port. Install crowbar current limiter.", verify: "GFCI trips at 10μA — crowbar caps at 1000μA (verified with calibration current source)" },
      { id: "F4", title: "Mount NIA corona emitter", tool: "Hex key, high-voltage gloves", parts: "1× corona discharge emitter, 1× NIA driver board", detail: "Mount corona emitter at canopy crown. Wire to NIA driver. Connect MQ-131 ozone sensor as interlock.", verify: "Ion density 10⁶-10⁷ ions/cm³ at bed surface — ozone <0.03 ppm" },
      { id: "F5", title: "Install chromotherapy WLED array", tool: "Soldering iron, hex key", parts: "1× programmable WLED strip (2m), 1× WLED controller", detail: "Mount WLED strip around canopy perimeter. Connect to controller. Synchronize controller to session protocol and Vedic nada DSP.", verify: "All 7 chakra colors render correctly — synchronized to bija frequency test" },
    ],
  },
  // ── Phase G: HIT + OZO + VOR Chemical Systems ──
  {
    phase: "G", title: "HIT + OZO + VOR Chemical Systems", hours: 14,
    color: "#14b8a6",
    steps: [
      { id: "G1", title: "Install PEM electrolyzer", tool: "Hex key, wrench set", parts: "1× PEM electrolyzer (99.99% H₂), 1× deionized water reservoir (1L), 1× solenoid valve", detail: "Mount electrolyzer in lower bay. Connect to water reservoir and solenoid flow valve. Route H₂ output to canopy delivery port.", verify: "H₂ purity 99.99% — flow rate 150-300 mL/min adjustable" },
      { id: "G2", title: "Install H₂ safety system", tool: "Multimeter, gas detector", parts: "1× MQ-8 sensor, 1× earth bonding kit", detail: "Mount MQ-8 sensor within 30cm of electrolyzer. Wire to BFAC safety relay. Install earth bonding on all wetted metal parts.", verify: "Auto-shutdown at 25% LEL — earth continuity <0.1Ω" },
      { id: "G3", title: "Install ozone generator", tool: "Hex key, PTFE tape", parts: "1× ozone generator (medical-grade), 1× MQ-131 sensor, tubing", detail: "Mount ozone generator in lower bay (separate from H₂). Connect O₂ feed gas. Route O₃ output to insufflation ports. Install MQ-131 ambient sensor.", verify: "O₃ concentration 0.5-5% — auto-off at 0.05 ppm ambient" },
      { id: "G4", title: "Install vortex chamber", tool: "Hex key, silicone sealant", parts: "1× borosilicate vortex chamber (40L), 1× corrugated impeller, 1× magnetic drive pump", detail: "Mount vortex chamber on lower bay platform. Install impeller in chamber. Connect water pump for circulation. Seal all joints with silicone.", verify: "No leaks at 40L — 24h pressure test passed" },
      { id: "G5", title: "Install Peltier + compressor cooling", tool: "Hex key, thermal paste", parts: "8× Peltier modules (TEC1-12706), 1× miniature compressor, 1× PID controller", detail: "Mount 8 Peltier modules around vortex chamber. Install compressor for hybrid cooling. Wire PID controller with 3× PT100 sensors.", verify: "Vortex water holds 4.0°C ±0.5°C for 2h continuous" },
    ],
  },
  // ── Phase H: Vedic Nada + Global Scaling + EEG ──
  {
    phase: "H", title: "Vedic Nada + Global Scaling + EEG", hours: 10,
    color: "#eab308",
    steps: [
      { id: "H1", title: "Mount 7 chakra transducers", tool: "Hex key, measuring tape", parts: "7× Dayton ND16-4 directional transducers", detail: "Mount 7 transducers at chakra correspondence points along chamber walls: root (base), sacral (lower), solar plexus (mid), heart (center), throat (upper), third eye (canopy), crown (canopy top).", verify: "All 7 positioned at endocrine gland correspondence points — measured from bed center" },
      { id: "H2", title: "Wire nada DSP + amplifier", tool: "Soldering iron", parts: "1× ADAU1701 DSP, 1× 8-ch Class-AB amplifier", detail: "Connect DSP to amplifier. Route amplifier outputs to 7 chakra transducers. Load bija formant frequency profiles.", verify: "All 6 bija frequencies within ±2 Hz — LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426" },
      { id: "H3", title: "Install 4 Global Scaling G-Elements", tool: "Hex key, mu-metal gloves", parts: "4× PZT-5H nanocrystal G-Elements, 4× mu-metal isolation enclosures, 4× precision drivers", detail: "Place each G-Element in its mu-metal enclosure. Mount at 4 cardinal points around chamber base. Connect to precision sine drivers.", verify: "EM isolation verified — no external field coupling at 50V/m test field" },
      { id: "H4", title: "Calibrate G-Scaling node frequencies", tool: "Frequency counter", parts: "None", detail: "Set each G-Element driver to its node frequency: 5 Hz, 101 Hz, 2032 Hz, 40.8 kHz. Verify with frequency counter.", verify: "All 4 node frequencies within 0.001 Hz of target" },
      { id: "H5", title: "Install EEG headset dock", tool: "Hex key", parts: "1× EEG headset (19-ch 10-20), 1× EEG amplifier, 1× canopy dock", detail: "Mount EEG headset dock on canopy. Connect amplifier to BFAC controller. Route cable through canopy hinge chase.", verify: "All 19 channels show clean signal — impedance <5kΩ per electrode" },
    ],
  },
  // ── Phase I: Emission Diagnostic + Safety ──
  {
    phase: "I", title: "Emission Diagnostic + Safety Systems", hours: 12,
    color: "#ec4899",
    steps: [
      { id: "I1", title: "Install 6 quartz porthole windows", tool: "Hex key, silicone sealant", parts: "6× fused silica windows (50mm dia, 10mm)", detail: "Mount 6 quartz portholes at chamber wall positions (head, torso, limbs — both sides). Seal with high-temp silicone.", verify: "No light leakage — UV transmission verified at 254nm and 365nm" },
      { id: "I2", title: "Mount UV/Vis spectrometer + fiber bundles", tool: "Hex key, fiber optic tools", parts: "1× Ocean Insight Flame spectrometer, 6× UV-grade fiber bundles", detail: "Mount spectrometer in equipment rack. Route fiber bundles from each porthole to spectrometer input. Calibrate with Hg-Ar lamp.", verify: "Spectrum capture 200-800nm at 0.1nm resolution — wavelength calibration ±0.05nm" },
      { id: "I3", title: "Install FLIR thermal camera", tool: "Hex key", parts: "1× FLIR A65 thermal camera, 1× mounting bracket", detail: "Mount FLIR camera at canopy interior. Aim at patient surface. Connect to BFAC controller for real-time thermal monitoring.", verify: "Thermal map covers full patient surface — temp reading within ±0.5°C of reference" },
      { id: "I4", title: "Install 3× emergency stop buttons", tool: "Hex key, wire crimper", parts: "3× mushroom E-stop (IP65, dual-channel NC), 1× Pilz PNOZ safety relay", detail: "Mount E-stops: 1 interior (patient reach), 1 exterior (operator), 1 rear (technician). Wire all to Pilz safety relay in series.", verify: "Any E-stop triggers full shutdown — response <100ms on oscilloscope" },
      { id: "I5", title: "Install EM field probe + isolation monitor", tool: "Hex key", parts: "1× Narda ELT-400 field probe, 1× patient isolation monitor (10μA trip)", detail: "Mount field probe at chamber interior wall. Connect isolation monitor to patient bed frame and electrode circuit.", verify: "Field probe reads real-time — isolation monitor trips at 10μA leakage" },
    ],
  },
  // ── Phase J: Control Electronics + Firmware ──
  {
    phase: "J", title: "Control Electronics + Firmware", hours: 22,
    color: "#f59e0b",
    steps: [
      { id: "J1", title: "Mount BeagleBone AI-64 + FPGA", tool: "Hex key, anti-static wrist strap", parts: "1× BeagleBone AI-64, 1× Lattice iCE40 FPGA, 1× STM32H7 sensor fusion board", detail: "Mount all 3 controller boards in equipment rack. Interconnect via SPI bus. Apply thermal pads to heat-generating components.", verify: "All boards boot — SPI bus communication verified at 10MHz" },
      { id: "J2", title: "Install 48V/24V/12V PSU stack", tool: "Hex key, multimeter", parts: "1× 48V PSU (500W), 1× 24V PSU, 1× 12V DC-DC, 1× 5V DC-DC", detail: "Mount PSU stack in lower bay. Connect to isolation transformer (5kVA). Route DC rails to subsystem distribution blocks.", verify: "All rails within ±2% of nominal — ripple <50mV under load" },
      { id: "J3", title: "Install HMI touchscreen", tool: "Hex key", parts: "1× 10.1 inch touchscreen (1280×800)", detail: "Mount HMI on exterior operator panel. Connect to BeagleBone via HDMI + USB. Route cable through frame chase.", verify: "Touch responsive — display shows BFAC dashboard" },
      { id: "J4", title: "Flash BFAC+ACE firmware", tool: "Laptop, USB cable", parts: "None", detail: "Flash BFAC safety engine to BeagleBone. Flash ACE adaptive control to FPGA. Flash sensor fusion to STM32H7. Load TensorFlow Lite model.", verify: "All firmware versions match — BFAC heartbeat 100ms cycle confirmed" },
      { id: "J5", title: "Wire all sensors to BFAC", tool: "Crimp tool, wire tracer", parts: "Cable harness set", detail: "Route all sensor wires (HRV, SpO₂, EEG, GSR, Temp, NTC, MQ-8, MQ-131, ACS712) to STM32H7 ADC inputs. Label each wire.", verify: "All sensors read correctly on HMI dashboard — 100ms update cycle" },
    ],
  },
  // ── Phase K: Integration + Testing + QC ──
  {
    phase: "K", title: "Integration + Testing + QC", hours: 18,
    color: "#10b981",
    steps: [
      { id: "K1", title: "Full system power-up sequence", tool: "Multimeter, thermal camera", parts: "None", detail: "Power on in sequence: isolation transformer → PSUs → controllers → low-voltage subsystems → high-voltage subsystems. Monitor for faults at each stage.", verify: "No fault indicators — all rails nominal — no thermal hotspots" },
      { id: "K2", title: "Subsystem interface test", tool: "Oscilloscope, function generator", parts: "None", detail: "Test each modality independently, then in combinations. Verify no cross-interference between modalities.", verify: "All 18 modalities operate independently and in combination — no interference" },
      { id: "K3", title: "Safety cutoff validation", tool: "Oscilloscope, calibrated current source", parts: "None", detail: "Trigger each safety threshold (field strength, temp, H₂ LEL, ozone, current leakage). Measure response time from threshold breach to full shutdown.", verify: "All safety cutoffs respond <100ms — documented on test record" },
      { id: "K4", title: "30-minute burn-in test", tool: "Thermal camera, data logger", parts: "None", detail: "Run all 18 modalities at full power for 30 minutes. Monitor all temperatures with thermal camera. Log all sensor data.", verify: "No component exceeds 80°C — all sensors within nominal range for 30 min" },
      { id: "K5", title: "Torque audit + final QC", tool: "Torque wrench (calibrated), QC checklist", parts: "None", detail: "Re-torque all M8 fasteners to 20 Nm. Re-torque all M5 to 3 Nm. Complete QC checklist (87 items). Sign off with Lead Engineer and Safety Officer.", verify: "All 87 QC items pass — Lead Engineer + Safety Officer signatures obtained" },
    ],
  },
];

export const TOTAL_ASSEMBLY_HOURS = ASSEMBLY_STEPS.reduce((s, p) => s + p.hours, 0);
export const TOTAL_SUB_STEPS = ASSEMBLY_STEPS.reduce((s, p) => s + p.steps.length, 0);