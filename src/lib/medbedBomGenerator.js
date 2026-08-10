// ── MedBed BOM Generator ─────────────────────────────────────────────────
// Auto-generates a complete Bill of Materials from device engineering specs.

const SUPPLIERS = {
  structural: "80/20 Inc.",
  electronics: "Digi-Key / Mouser",
  coils: "Amidon / Fair-Rite",
  leds: "Samsung / Cree",
  sensors: "Maxim Integrated / ADI",
  medical: "Newark / element14",
  milspec: "MIL-STD Qualified Vendor",
  mechanical: "McMaster-Carr",
  thermal: "Watlow / Omega",
};

function line(ref, category, desc, qty, unitCost, supplier, notes) {
  return { ref, category, desc, qty, unitCost, extCost: qty * unitCost, supplier, notes: notes || "" };
}

function modalityComponents(modalities, isMil) {
  const bom = [];
  const suffix = isMil ? "-MIL" : "";

  modalities.forEach(function (m) {
    if (m.code === "PBM") {
      bom.push(line("PBM-001" + suffix, "PBM", isMil ? "810nm NIR transcranial LED array (MIL-spec)" : "660nm/850nm NIR LED panel array", isMil ? 6 : 4, isMil ? 185 : 142, SUPPLIERS.leds, isMil ? "TBI-specific 810nm protocol" : "Dual-wavelength 660/850nm"));
      bom.push(line("PBM-002" + suffix, "PBM", "PBM LED driver board (constant current, 48V DC)", 2, 68, SUPPLIERS.electronics, "PWM dimmable"));
      bom.push(line("PBM-003" + suffix, "PBM", "Aluminum heat sink + thermal paste kit", isMil ? 6 : 4, 24, SUPPLIERS.mechanical, "Junction temp <75C"));
      bom.push(line("PBM-004" + suffix, "PBM", "NTC 10k temperature sensor (per panel)", isMil ? 6 : 4, 4.5, SUPPLIERS.sensors, "ADC feedback to BFAC"));
    }
    if (m.code === "PEMF") {
      bom.push(line("PEM-001" + suffix, "PEMF", isMil ? "MIL-spec litz wire coil matrix (2x2 grid)" : "PEMF coil matrix - litz wire AWG20x50 strand", 4, isMil ? 185 : 120, SUPPLIERS.coils, "2x2 floor grid"));
      bom.push(line("PEM-002" + suffix, "PEMF", "PEMF driver board (48V DC, PWM)", 1, 95, SUPPLIERS.electronics, isMil ? "0.5-4 Hz delta induction" : "7.83 Hz Schumann PRF"));
      bom.push(line("PEM-003" + suffix, "PEMF", "ACS712 current monitor (per coil segment)", 4, 8.5, SUPPLIERS.sensors, "BFAC feedback loop"));
      bom.push(line("PEM-004" + suffix, "PEMF", "Non-ferrous aluminum shield panel", 1, 42, SUPPLIERS.mechanical, "Above coil matrix"));
    }
    if (m.code === "VAT") {
      bom.push(line("VAT-001" + suffix, "VAT", isMil ? "MIL-spec vibration transducer (BST-1 equiv)" : "Dayton Audio BST-1 tactile transducer", isMil ? 12 : 8, isMil ? 78 : 52, SUPPLIERS.electronics, isMil ? "20-40 Hz TRE protocol" : "20-528 Hz range"));
      bom.push(line("VAT-002" + suffix, "VAT", "Class-AB amplifier (50W/ch, 4-channel)", 2, 115, SUPPLIERS.electronics, "VAT drive"));
      bom.push(line("VAT-003" + suffix, "VAT", "ADAU1701 DSP processor", 1, 38, SUPPLIERS.electronics, "Formant synthesis"));
      bom.push(line("VAT-004" + suffix, "VAT", "SPL limiter hardware (85 dB trip)", 1, 22, SUPPLIERS.electronics, "Patient ear safety"));
      bom.push(line("VAT-005" + suffix, "VAT", "Coupling compound (transducer-seat interface)", 1, 18, SUPPLIERS.mechanical, "Gap fill"));
    }
    if (m.code === "FIT") {
      bom.push(line("FIT-001" + suffix, "FIT", isMil ? "MIL-grade FIR ceramic emitter panel" : "Far-infrared carbon fiber panel (420x230mm)", isMil ? 8 : 6, isMil ? 95 : 72, SUPPLIERS.thermal, isMil ? "45-55C deep tissue" : "37-55C range"));
      bom.push(line("FIT-002" + suffix, "FIT", "NTC thermistor (3 patient contact points)", 3, 6.5, SUPPLIERS.sensors, "Seat, back, foot"));
      bom.push(line("FIT-003" + suffix, "FIT", "Safety thermal cutoff (TCO 60C)", 1, 12, SUPPLIERS.electronics, "Series with elements"));
      bom.push(line("FIT-004" + suffix, "FIT", "Ceramic fiber insulation blanket", isMil ? 8 : 6, 28, SUPPLIERS.thermal, "Panel rear face"));
    }
    if (m.code === "SFT") {
      bom.push(line("SFT-001" + suffix, "SFT", "Bifilar coil pair (AWG14, 144 turns, Fair-Rite 77)", isMil ? 10 : 8, isMil ? 88 : 72, SUPPLIERS.coils, "Octagonal array"));
      bom.push(line("SFT-002" + suffix, "SFT", "Class-D amplifier (500W/ch)", isMil ? 6 : 4, 245, SUPPLIERS.electronics, "Coil drive"));
      bom.push(line("SFT-003" + suffix, "SFT", "AD9854 DDS frequency synthesizer (3-channel)", 1, 185, SUPPLIERS.electronics, "F1/F2/F3 channels"));
      bom.push(line("SFT-004" + suffix, "SFT", "OCXO master clock (10 MHz, 0.01 ppb)", 1, 95, SUPPLIERS.electronics, "Frequency reference"));
      bom.push(line("SFT-005" + suffix, "SFT", isMil ? "Classified scalar protocol firmware module" : "Schumann/alpha-theta/Lisitsyn profile firmware", 1, isMil ? 450 : 120, SUPPLIERS.electronics, isMil ? "Bearden phase-conjugate protocol" : "24 Lisitsyn windows"));
    }
    if (m.code === "MCT") {
      bom.push(line("MCT-001" + suffix, "MCT", isMil ? "CES earclip electrode set (MIL-spec)" : "Gold-plated electrode port (armrest)", isMil ? 2 : 4, isMil ? 65 : 28, SUPPLIERS.medical, isMil ? "0.5 Hz CES mode" : "1-999uA range"));
      bom.push(line("MCT-002" + suffix, "MCT", "MCT driver board (isolated DC-DC)", 1, 88, SUPPLIERS.electronics, "Precision current source"));
      bom.push(line("MCT-003" + suffix, "MCT", "GFCI protection module (10uA trip)", isMil ? 2 : 4, 32, SUPPLIERS.electronics, "Per-port leakage protection"));
      bom.push(line("MCT-004" + suffix, "MCT", "Crowbar current limit hardware (1000uA cap)", 1, 14, SUPPLIERS.electronics, "Hard safety cap"));
    }
    if (m.code === "HIT") {
      bom.push(line("HIT-001" + suffix, "HIT", "PEM electrolyzer unit (99.99% H2)", 1, isMil ? 385 : 285, SUPPLIERS.electronics, isMil ? "300 mL/min TBI protocol" : "150-300 mL/min"));
      bom.push(line("HIT-002" + suffix, "HIT", "MQ-8 H2 concentration sensor", 1, 42, SUPPLIERS.sensors, "Alarm at >1% v/v"));
      bom.push(line("HIT-003" + suffix, "HIT", "Solenoid flow control valve", 1, 38, SUPPLIERS.electronics, "BFAC safety relay"));
      bom.push(line("HIT-004" + suffix, "HIT", "Deionized water reservoir (1L) + auto-fill sensor", 1, 35, SUPPLIERS.mechanical, "Electrolyzer supply"));
      bom.push(line("HIT-005" + suffix, "HIT", "Earth bonding kit (explosion prevention)", 1, 22, SUPPLIERS.electronics, "Wetted metal parts"));
    }
    if (m.code === "NIA") {
      bom.push(line("NIA-001" + suffix, "NIA", "Corona-discharge emitter (canopy crown)", 1, 68, SUPPLIERS.electronics, "5-8 kV peak"));
      bom.push(line("NIA-002" + suffix, "NIA", "MQ-131 ozone sensor (2-point cal)", 1, 52, SUPPLIERS.sensors, "Interlock at 0.03 ppm"));
      bom.push(line("NIA-003" + suffix, "NIA", "NIA driver board (12V DC, PWM)", 1, 45, SUPPLIERS.electronics, "Corona voltage control"));
      bom.push(line("NIA-004" + suffix, "NIA", isMil ? "MIL-grade HEPA + CBRN filter cartridge" : "HEPA + activated carbon filter", 1, isMil ? 185 : 78, SUPPLIERS.mechanical, isMil ? "Field-deployable CBRN" : "Air quality enrichment"));
    }
    if (m.code === "BIO") {
      bom.push(line("BIO-001" + suffix, "BIO", isMil ? "MIL-spec EEG headset (19-ch 10-20)" : "MAX30102 HRV/pulse sensor (armrest)", 1, isMil ? 485 : 32, SUPPLIERS.sensors, isMil ? "PTSD hyperarousal detection" : "HRV monitoring"));
      bom.push(line("BIO-002" + suffix, "BIO", isMil ? "AD8232 EDA/GSR module" : "AD8232 EDA/GSR sensor (armrest)", 1, 28, SUPPLIERS.sensors, "Stress monitoring"));
      bom.push(line("BIO-003" + suffix, "BIO", "MLX90614 IR skin temp sensor (headrest)", 1, 42, SUPPLIERS.sensors, "Skin temperature"));
      bom.push(line("BIO-004" + suffix, "BIO", isMil ? "EEG headband dock (spring-loaded)" : "EEG headband dock (canopy crown)", 1, isMil ? 125 : 85, SUPPLIERS.medical, "19-channel 10-20 system"));
      bom.push(line("BIO-005" + suffix, "BIO", "Sensor fusion board (Cortex-M7, 100ms cycle)", 1, 145, SUPPLIERS.electronics, "BFAC closed-loop"));
      bom.push(line("BIO-006" + suffix, "BIO", isMil ? "PTSD severity scoring AI module (TF Lite)" : "BFAC closed-loop firmware (TF Lite)", 1, isMil ? 285 : 95, SUPPLIERS.electronics, isMil ? "DSM-5 PCL-5 correlation" : "HRV coherence target"));
    }
  });

  return bom;
}

function structuralComponents(isMil) {
  if (isMil) {
    return [
      line("STR-001M", "Structural", "7075-T6 aluminum frame extrusion (MIL-hardened)", 1, 2850, SUPPLIERS.milspec, "MIL-DTL-5541 chromate coating"),
      line("STR-002M", "Structural", "Steel-reinforced joints + corner brackets", 12, 45, SUPPLIERS.milspec, "Vibration/shock rated"),
      line("STR-003M", "Structural", "MIL-PRF-32432 polycarbonate canopy panels", 1, 1250, SUPPLIERS.milspec, "IP65 gasket seal"),
      line("STR-004M", "Structural", "EMI shielding mesh (copper, 0.1mm)", 1, 385, SUPPLIERS.milspec, "MIL-STD-461G EMC"),
      line("STR-005M", "Structural", "IP65 exterior panels (CBRN-cleanable)", 1, 890, SUPPLIERS.milspec, "Field decontamination"),
      line("STR-006M", "Structural", "Gas-strut canopy assist (MIL-spec, 220N)", 2, 145, SUPPLIERS.milspec, "Hardened actuation"),
      line("STR-007M", "Structural", "M8 stainless fastener kit (MIL-spec)", 1, 185, SUPPLIERS.milspec, "Torque 14 Nm"),
      line("STR-008M", "Structural", "Leveling feet + transit case hardware", 4, 95, SUPPLIERS.milspec, "45-min field setup"),
    ];
  }
  return [
    line("STR-001", "Structural", "6061-T6 aluminum frame extrusion set", 1, 1250, SUPPLIERS.structural, "M8 fasteners at 20 Nm"),
    line("STR-002", "Structural", "Polycarbonate canopy panels (clear)", 1, 680, SUPPLIERS.structural, "Soft-close hinges"),
    line("STR-003", "Structural", "EMI gasket (conductive silicone, perimeter)", 1, 145, SUPPLIERS.mechanical, "Seam sealing"),
    line("STR-004", "Structural", "Copper grounding rail (full perimeter)", 1, 88, SUPPLIERS.mechanical, "Ground continuity"),
    line("STR-005", "Structural", "Gas-strut canopy assist (180N per strut)", 2, 72, SUPPLIERS.mechanical, "Pre-loaded"),
    line("STR-006", "Structural", "M8 stainless fastener kit", 1, 65, SUPPLIERS.mechanical, "Torque 20 Nm"),
    line("STR-007", "Structural", "Leveling feet (adjustable)", 4, 28, SUPPLIERS.mechanical, "Floor stability"),
    line("STR-008", "Structural", "Infinity mirror ceiling panel (ASD)", 1, 185, SUPPLIERS.electronics, "Visual calm environment"),
    line("STR-009", "Structural", "Acoustic interior panels (NRC 0.65)", 1, 245, SUPPLIERS.mechanical, "Sound isolation"),
    line("STR-010", "Structural", "Memory foam mattress + antimicrobial cover", 1, 195, SUPPLIERS.medical, "Patient surface"),
    line("STR-011", "Structural", "Silicone edge guards (child-safe)", 1, 42, SUPPLIERS.medical, "ASTM F963"),
  ];
}

function electricalComponents(isMil) {
  if (isMil) {
    return [
      line("ELE-001M", "Electrical", "MIL-spec 28VDC + 115VAC 400Hz power entry", 1, 685, SUPPLIERS.milspec, "Dual-power mode"),
      line("ELE-002M", "Electrical", "MIL-W-22759 wire harness set", 1, 485, SUPPLIERS.milspec, "EMI-filtered"),
      line("ELE-003M", "Electrical", "BeagleBone AI-64 + Lattice iCE40 FPGA (MIL)", 1, 425, SUPPLIERS.electronics, "BFAC + ACE controller"),
      line("ELE-004M", "Electrical", "MIL-spec E-stop (dual-channel NC)", 1, 125, SUPPLIERS.milspec, "IEC 60947-5-5"),
      line("ELE-005M", "Electrical", "FIPS 140-2 Level 2 crypto module", 1, 385, SUPPLIERS.milspec, "Encrypted session logs"),
      line("ELE-006M", "Electrical", "MIL-spec 48V/24V/12V PSU stack", 1, 485, SUPPLIERS.milspec, "Multi-rail DC"),
      line("ELE-007M", "Electrical", "Secure comms module (SIPR-net option)", 1, 285, SUPPLIERS.milspec, "VA/DoD telemedicine"),
    ];
  }
  return [
    line("ELE-001", "Electrical", "48V/24V medical-grade PSU", 1, 285, SUPPLIERS.electronics, "Multi-rail DC"),
    line("ELE-002", "Electrical", "12V/5V DC-DC converter board", 1, 65, SUPPLIERS.electronics, "Logic supply"),
    line("ELE-003", "Electrical", "BeagleBone AI-64 embedded controller", 1, 195, SUPPLIERS.electronics, "BFAC MCU"),
    line("ELE-004", "Electrical", "Lattice iCE40 FPGA (ACE engine)", 1, 85, SUPPLIERS.electronics, "Adaptive control"),
    line("ELE-005", "Electrical", "Dual-channel NC E-stop (IEC 60947-5-5)", 1, 45, SUPPLIERS.electronics, "Safety cutoff"),
    line("ELE-006", "Electrical", "Color-coded wire harness set", 1, 165, SUPPLIERS.electronics, "Multi-voltage routing"),
    line("ELE-007", "Electrical", "10.1 inch touchscreen HMI (operator)", 1, 145, SUPPLIERS.electronics, "Caregiver dashboard"),
    line("ELE-008", "Electrical", "WLED ambient lighting controller (ASD)", 1, 38, SUPPLIERS.electronics, "Chromotherapy"),
    line("ELE-009", "Electrical", "Holographic fan display (ASD)", 1, 125, SUPPLIERS.electronics, "Visual engagement"),
  ];
}

export function generateBom(device) {
  const isMil = device.id === "zds-ptsd-pod";
  const isAsd = device.id === "aatcs-p1-asd";

  const bom = structuralComponents(isMil).concat(electricalComponents(isMil), modalityComponents(device.modalities, isMil));

  if (isAsd) {
    bom.push(line("ASD-001", "ASD-Specific", "Robotic bio-sensor arm (child engagement)", 1, 285, SUPPLIERS.electronics, "Interactive therapy"));
    bom.push(line("ASD-002", "ASD-Specific", "Child-accessible interior canopy release", 1, 45, SUPPLIERS.mechanical, "Emergency exit"));
    bom.push(line("ASD-003", "ASD-Specific", "Sensory calibration profile firmware", 1, 85, SUPPLIERS.electronics, "Hyper/hypo-sensitivity"));
  }
  if (isMil) {
    bom.push(line("MIL-001", "MIL-Specific", "CBRN decontamination-compatible surface treatment", 1, 385, SUPPLIERS.milspec, "Field cleanable"));
    bom.push(line("MIL-002", "MIL-Specific", "Biometric clinician authentication module", 1, 225, SUPPLIERS.milspec, "Chain-of-custody"));
    bom.push(line("MIL-003", "MIL-Specific", "MIL-STD-810H environmental test kit", 1, 485, SUPPLIERS.milspec, "Vibration/shock/temp"));
  }

  const categoryOrder = ["Structural", "Electrical", "PBM", "PEMF", "VAT", "FIT", "SFT", "MCT", "HIT", "NIA", "BIO", "ASD-Specific", "MIL-Specific"];
  bom.sort(function (a, b) {
    const ca = categoryOrder.indexOf(a.category);
    const cb = categoryOrder.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    return a.ref.localeCompare(b.ref);
  });

  const totalCost = bom.reduce(function (s, l) { return s + l.extCost; }, 0);
  const categorySummary = {};
  bom.forEach(function (l) {
    if (!categorySummary[l.category]) categorySummary[l.category] = { count: 0, cost: 0 };
    categorySummary[l.category].count++;
    categorySummary[l.category].cost += l.extCost;
  });

  return {
    deviceName: device.name,
    deviceId: device.id,
    isMil: isMil,
    isAsd: isAsd,
    lineItems: bom,
    totalLineItems: bom.length,
    totalCost: totalCost,
    categorySummary: categorySummary,
    generatedAt: new Date().toISOString(),
  };
}