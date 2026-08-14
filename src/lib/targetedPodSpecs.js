// ─────────────────────────────────────────────────────────────────────────────
// TARGETED POD ENGINEERING SPEC GENERATOR
// Generates PRD, PDR, BOM, SOW, EVT, DVT, Valuation, Commercialization Roadmap
// for the Autism and PTSD targeted therapy pods.
// ─────────────────────────────────────────────────────────────────────────────

import { AUTISM_POD, PTSD_POD } from "./targetedTherapyPods";

const POD_SPECS = {
  autism: {
    docId: "ZA-AATCS-P1-AU-001",
    revision: "A",
    safetyClass: "Class IIa — Enclosed Therapy (Neurodevelopmental)",
    powerClass: "Line-Powered Clinical Pod (<3kW)",
    timeline: { evt: 10, dvt: 14, pvt: 8, total: 32 },
    budget: { evt: 120000, dvt: 280000, pvt: 350000 },
    marketSize: "$45B+ ASD intervention market (global)",
    ipValuation: { low: 85, mid: 180, high: 350 }, // millions USD
    regulatoryPath: "FDA 510(k) — Class II Neurological Therapeutic Device; IRB-approved clinical study",
    targetUsers: "Ages 4+ with ASD diagnosis; clinical and home-research settings under supervision",
  },
  ptsd: {
    docId: "ZA-AATCS-P1-PT-001",
    revision: "A",
    safetyClass: "Class IIb — Enclosed Therapy (Psychiatric/Neurological)",
    powerClass: "Line-Powered Clinical Pod (<3kW)",
    timeline: { evt: 10, dvt: 14, pvt: 8, total: 32 },
    budget: { evt: 120000, dvt: 280000, pvt: 350000 },
    marketSize: "$60B+ PTSD treatment market (global, incl. veteran populations)",
    ipValuation: { low: 95, mid: 210, high: 420 },
    regulatoryPath: "FDA 510(k) — Class II Psychiatric Therapeutic Device; VA/DoD partnership pathway; IRB-approved study",
    targetUsers: "Adults 18+ with PTSD diagnosis; clinical, VA, and integrative settings",
  },
};

// ── PRD ──────────────────────────────────────────────────────────────────────

export function generatePRD(pod) {
  const s = POD_SPECS[pod.id];
  const techCount = 9 + pod.inventions.length + pod.vedic.length + pod.suppressed.length + pod.consciousness.length;
  return {
    docId: s.docId + "-PRD",
    revision: s.revision,
    sections: [
      { heading: "1. Purpose & Scope", body: `This PRD defines the requirements for the ${pod.name} (${pod.designation}), a unified bioelectromagnetic therapy pod targeting ${pod.condition}. The device integrates ${techCount} technologies: 9 BrightSteps modalities, ${pod.inventions.length} fused inventions, ${pod.vedic.length} Vedic therapies, ${pod.suppressed.length} suppressed technologies, and ${pod.consciousness.length} consciousness systems into a single enclosed clinical pod. Classification: ${s.safetyClass}.` },
      { heading: "2. Target Condition", body: `${pod.condition}. ${pod.summary}` },
      { heading: "3. Target Users", body: s.targetUsers },
      { heading: "4. Functional Requirements", bullets: [
        "Deliver all 9 BrightSteps modalities simultaneously or individually under BFAC closed-loop control",
        `Integrate ${pod.inventions.length} fused invention subsystems per the technology fusion matrix`,
        "Real-time biometric monitoring (HRV, EEG, GSR, SpO₂, skin temp) with auto-modulation to prevent sensory overload / trauma flooding",
        "Session protocol engine with 7-phase programmable workflows",
        "AI-driven protocol personalization based on assessment data",
        "Safety interlocks: E-stop <100ms, H₂ alarm, O₃ alarm, thermal cutoff, GFCI, patient isolation",
        "OTA firmware updates, cloud telemetry, practitioner dashboard",
        ...pod.modalities.map(m => `${m.code} (${m.name}): ${m.role}`),
      ]},
      { heading: "5. Performance Requirements", bullets: [
        "PBM: 630nm + 850nm (autism) / 810nm (PTSD), 10-50 mW/cm², uniform illumination at patient plane",
        "PEMF: 7.83 Hz ±0.01 Hz, ≥1 μT at seat surface, Schumann-locked",
        "VAT: 30-528 Hz ±3 dB, SPL limiter at 85 dB, 8-transducer array",
        "FIT: 37-55°C ±0.5°C, PID controlled, TCO at 60°C",
        "SFT: 20 Hz-20 kHz DDS, transverse field null <1 mT, 24 Lisitsyn windows",
        "MCT: 1-999 μA ±0.1 μA, GFCI 10 μA trip, IEC 60601-1 isolation",
        "HIT: 99.99% H₂ purity, 100-300 mL/min, alarm at 1% v/v",
        "NIA: ≥1×10⁶ ions/cm³, O₃ ≤0.03 ppm, interlock at 0.03 ppm",
        "BIO: HRV ±2 BPM, EEG 0.5-100 Hz, GSR, SpO₂ ±1%, 100ms sample cycle",
      ]},
      { heading: "6. Regulatory Requirements", body: s.regulatoryPath + ". IEC 60601-1 (medical electrical safety), IEC 60601-1-2 (EMC), ISO 14971 (risk management), ISO 13485 (QMS). Not for Sale — Research Only until clearance." },
      { heading: "7. Market Analysis", body: `${s.marketSize}. The ${pod.id === "autism" ? "ASD" : "PTSD"} intervention market is underserved by conventional pharmacology. The integrated multi-modal approach addresses root-cause bioenergetic dysregulation rather than symptom management, positioning the pod as a category-defining therapeutic platform.` },
      { heading: "8. Success Criteria", bullets: [
        "EVT: all 9 modalities functional, BFAC closed-loop verified, safety interlocks pass",
        "DVT: EMC pre-scan pass, biometric accuracy verified, 30-session pilot safety",
        "PVT: 100-unit production validation, cosmetic audit, packaging",
        "Clinical: measurable improvement on validated scales (CARS-2 for autism, PCL-5 for PTSD) in IRB study",
      ]},
    ],
  };
}

// ── PDR ──────────────────────────────────────────────────────────────────────

export function generatePDR(pod) {
  const s = POD_SPECS[pod.id];
  return {
    docId: s.docId + "-PDR",
    revision: s.revision,
    sections: [
      { heading: "1. System Architecture", body: `The ${pod.designation} is a 12-subsystem enclosed therapy pod built on the AATCS-P1 chassis. Architecture: BFAC MCU (Cortex-M7) coordinates all modalities via CAN bus; ACE adaptive engine (FPGA) runs the AI protocol engine; each modality has a dedicated driver board with local safety interlocks. Cloud telemetry via WiFi/4G to Slicon Systems Cloud Core.` },
      { heading: "2. Subsystem Decomposition", table: [
        { subsystem: "BFAC Control", tech: "Cortex-M7 + FPGA", status: "Design Complete", risk: "Low" },
        { subsystem: "PBM Array", tech: "630/850nm LED + heat sink", status: "Design Complete", risk: "Low" },
        { subsystem: "PEMF Matrix", tech: "4× planar litz coils, 7.83 Hz", status: "Design Complete", risk: "Low" },
        { subsystem: "VAT Transducers", tech: "8× Dayton BST-1 + DSP", status: "Design Complete", risk: "Low" },
        { subsystem: "FIR Panels", tech: "Ceramic emitters + PID + TCO", status: "Design Complete", risk: "Medium" },
        { subsystem: "SFT Coils", tech: "8× bifilar pairs + AD9854 DDS", status: "Design Complete", risk: "Medium" },
        { subsystem: "MCT Ports", tech: "Isolated DC-DC + GFCI", status: "Design Complete", risk: "Medium" },
        { subsystem: "HIT Module", tech: "PEM electrolyzer + H₂ sensors", status: "Design Complete", risk: "High" },
        { subsystem: "NIA Emitter", tech: "Corona 5-8kV + O₃ interlock", status: "Design Complete", risk: "Medium" },
        { subsystem: "BIO Sensors", tech: "MAX30102 + AD8232 + MLX90614 + EEG", status: "Design Complete", risk: "Low" },
        { subsystem: "Vedic Suite", tech: "Shirodhara + marma coils + mantra chamber", status: "Concept → Design", risk: "Medium" },
        { subsystem: "Diagnostic Suite", tech: "Somatid/biophoton scanner", status: "Concept → Design", risk: "High" },
      ]},
      { heading: "3. Key Technical Parameters", bullets: [
        "Total power: <3kW (5kVA isolation transformer)",
        "DC rails: 48V (modalities), 24V (control), 12V (sensors), 5V/3.3V (logic)",
        "BFAC sample cycle: 100ms, closed-loop response: ≤200ms",
        "Canopy: titanium-reinforced composite, gas-strut assist, EMI gasket sealed",
        "Patient bed: carbon fiber, EM transparent, 300kg load",
        "Faraday shield: 0.1mm copper mesh, 99.9% purity, 360° enclosure",
      ]},
      { heading: "4. Technology Fusion Matrix", body: `The pod fuses ${pod.inventions.length} inventions into the 9-modality chassis. Each invention maps to one or more BrightSteps modalities as its delivery mechanism, with Vedic therapies providing the herbal/breath/sound adjuncts and consciousness systems providing the field-structuring layer. See BOM for component-level mapping.` },
      { heading: "5. Risk Assessment", table: [
        { risk: "H₂ accumulation in canopy", severity: "Critical", mitigation: "MQ-8 sensor + auto-shutoff <2s + forced ventilation" },
        { risk: "O₃ exceedance from NIA", severity: "High", mitigation: "MQ-131 sensor + interlock at 0.03 ppm (below 0.05 limit)" },
        { risk: "Sensory overload (autism) / trauma flooding (PTSD)", severity: "High", mitigation: "BFAC closed-loop + EEG/HRV auto-modulation + practitioner override" },
        { risk: "MCT patient isolation failure", severity: "Critical", mitigation: "GFCI 10μA trip + IEC 60601-1 isolation + crowbar current cap" },
        { risk: "Thermal runaway (FIR)", severity: "High", mitigation: "TCO at 60°C + PID + NTC monitoring at 3 points" },
        { risk: "EMC emissions", severity: "Medium", mitigation: "Faraday shield + EMI gasket + shielded conduit" },
      ]},
      { heading: "6. Patent Claims (Core)", bullets: [
        `Unified bioelectromagnetic pod for ${pod.condition} integrating 9 modalities + ${pod.inventions.length} fused inventions`,
        "BFAC closed-loop biometric auto-modulation for neurodevelopmental/psychiatric therapy",
        "Multi-modal Vedic-suppressed-tech fusion therapy device",
        "7-phase protocol engine with AI personalization",
        "Safety-interlocked enclosed pod for vulnerable populations",
        ...pod.inventions.slice(0, 6).map(i => `${i.name}: ${i.role}`),
      ]},
      { heading: "7. Build Plan", body: `Phase 1 (EVT, ${s.timeline.evt} weeks): functional prototype with all 9 modalities + BFAC. Phase 2 (DVT, ${s.timeline.dvt} weeks): add Vedic suite + diagnostic suite, EMC/safety validation. Phase 3 (PVT, ${s.timeline.pvt} weeks): production validation, 100-unit run. Total: ${s.timeline.total} weeks.` },
    ],
  };
}

// ── BOM ──────────────────────────────────────────────────────────────────────

export function generateBOM(pod) {
  const s = POD_SPECS[pod.id];
  const items = [
    { refDes: "BFAC-001", item: "BFAC MCU Board", category: "Control", qty: 1, description: "Cortex-M7 + FPGA, CAN bus, WiFi/4G", notes: "Core controller" },
    { refDes: "ACE-001", item: "ACE Adaptive Engine", category: "Control", qty: 1, description: "Lattice iCE40 FPGA, AI protocol engine", notes: "Protocol personalization" },
    { refDes: "PBM-001", item: "PBM LED Array 630nm", category: "Optical", qty: 4, description: "Red LED panels, 48V DC, heat sink", notes: pod.id === "autism" ? "630nm + 850nm" : "810nm NIR" },
    { refDes: "PBM-002", item: "PBM LED Array 850nm/810nm", category: "Optical", qty: 4, description: "NIR LED panels, 48V DC, heat sink", notes: "Transcranial" },
    { refDes: "PEMF-001", item: "PEMF Coil Matrix", category: "EM", qty: 4, description: "Planar litz coils, AWG20×50, 7.83 Hz", notes: "Floor panel" },
    { refDes: "PEMF-002", item: "PEMF Driver Board", category: "EM", qty: 1, description: "48V DC, pulse 50μs, ACS712 monitor", notes: "Schumann locked" },
    { refDes: "VAT-001", item: "VAT Transducer Array", category: "Acoustic", qty: 8, description: "Dayton Audio BST-1, seat back", notes: "30-528 Hz" },
    { refDes: "VAT-002", item: "VAT Amplifier + DSP", category: "Acoustic", qty: 1, description: "Class-AB 50W/ch, ADAU1701 DSP", notes: "SPL limiter 85 dB" },
    { refDes: "FIT-001", item: "FIR Ceramic Panels", category: "Thermal", qty: 6, description: "8-14 μm emitters, seat + canopy", notes: "37-55°C" },
    { refDes: "FIT-002", item: "FIR Controller + TCO", category: "Thermal", qty: 1, description: "PID loop, NTC ×3, TCO 60°C", notes: "Safety cutoff" },
    { refDes: "SFT-001", item: "SFT Bifilar Coil Array", category: "Scalar", qty: 8, description: "Fair-Rite 77, AWG14, 144 turns", notes: "Octagonal" },
    { refDes: "SFT-002", item: "SFT DDS Synthesizer", category: "Scalar", qty: 1, description: "AD9854, OCXO 10 MHz, 3-channel", notes: "20 Hz-20 kHz" },
    { refDes: "MCT-001", item: "MCT Output Ports", category: "Electro", qty: 4, description: "Gold-plated, armrest mounted", notes: "1-999 μA" },
    { refDes: "MCT-002", item: "MCT Driver + GFCI", category: "Electro", qty: 1, description: "Isolated DC-DC, 10μA GFCI, crowbar", notes: "IEC 60601-1" },
    { refDes: "HIT-001", item: "H₂ PEM Electrolyzer", category: "Gas", qty: 1, description: "99.99% H₂, 100-300 mL/min", notes: "Lower equipment bay" },
    { refDes: "HIT-002", item: "H₂ Sensor + Safety Valve", category: "Gas", qty: 2, description: "MQ-8 sensor, solenoid auto-close", notes: "Alarm 1% v/v" },
    { refDes: "NIA-001", item: "NIA Corona Emitter", category: "Ion", qty: 1, description: "5-8 kV, canopy crown", notes: "≥10⁶ ions/cm³" },
    { refDes: "NIA-002", item: "O₃ Sensor + Interlock", category: "Ion", qty: 1, description: "MQ-131, interlock 0.03 ppm", notes: "Below 0.05 limit" },
    { refDes: "BIO-001", item: "HRV/Pulse Sensor", category: "Bio", qty: 1, description: "MAX30102, left armrest", notes: "±2 BPM" },
    { refDes: "BIO-002", item: "EDA/GSR Sensor", category: "Bio", qty: 1, description: "AD8232, right armrest", notes: "Stress monitor" },
    { refDes: "BIO-003", item: "Skin Temp Sensor", category: "Bio", qty: 1, description: "MLX90614 IR, headrest", notes: "±0.5°C" },
    { refDes: "BIO-004", item: "EEG Headband Dock", category: "Bio", qty: 1, description: "Canopy crown, spring contacts", notes: "0.5-100 Hz" },
    { refDes: "VED-001", item: "Shirodhara Oil System", category: "Vedic", qty: 1, description: "Warm oil flow, forehead, continuous", notes: "Theta induction" },
    { refDes: "VED-002", item: "Marma PEMF Mesh", category: "Vedic", qty: 1, description: "107 micro-coils, wearable", notes: "Bio-point stim" },
    { refDes: "VED-003", item: "Mantra Scalar Chamber", category: "Vedic", qty: 1, description: "Quartz transducers, Sanskrit formants", notes: "Vagal stim" },
    { refDes: "VED-004", item: "Panchakarma Steam + Oil", category: "Vedic", qty: 1, description: "Herbal steam + abhyanga auto", notes: "Detox" },
    { refDes: "DIAG-001", item: "Somatid/Biophoton Scanner", category: "Diagnostic", qty: 1, description: pod.id === "autism" ? "Naessens somatoscope 30,000×" : "Popp biophoton coherence scanner", notes: "Assessment" },
    { refDes: "PWR-001", item: "Power Distribution Bay", category: "Power", qty: 1, description: "5kVA isolation transformer, multi-rail", notes: "<3kW total" },
    { refDes: "SHL-001", item: "Composite Shell + Canopy", category: "Structural", qty: 1, description: "Titanium frame, gas-strut, EMI gasket", notes: "12 latch points" },
    { refDes: "SHL-002", item: "Faraday Shield", category: "Structural", qty: 1, description: "0.1mm copper mesh, 360°", notes: "EMC" },
    { refDes: "SHL-003", item: "Patient Bed", category: "Structural", qty: 1, description: "Carbon fiber, EM transparent, 300kg", notes: "1.9m × 0.7m" },
    { refDes: "SAF-001", item: "Safety Interlock Board", category: "Safety", qty: 1, description: "E-stop, H₂, O₃, thermal, GFCI, isolation", notes: "<100ms cutoff" },
    { refDes: "HMI-001", item: "10.1\" Touchscreen HMI", category: "Interface", qty: 1, description: "Practitioner interface, protocol select", notes: "Session control" },
  ];

  return {
    docId: s.docId + "-BOM",
    revision: s.revision,
    summary: {
      totalLineItems: items.length,
      totalComponents: items.reduce((sum, i) => sum + i.qty, 0),
      categories: [...new Set(items.map(i => i.category))],
    },
    items,
  };
}

// ── SOW ──────────────────────────────────────────────────────────────────────

export function generateSOW(pod) {
  const s = POD_SPECS[pod.id];
  return {
    docId: s.docId + "-SOW",
    revision: s.revision,
    sections: [
      { heading: "1. Scope of Work", body: `Design, build, and validate the ${pod.name} (${pod.designation}) through EVT → DVT → PVT prototype phases. Manufacturer: Minewing. Prepared for: BrightSteps ASD Unified Therapy Systems.` },
      { heading: "2. Work Breakdown Structure (WBS)", table: [
        { wbs: "1.0", task: "Program Management", duration: `${s.timeline.total} wks`, deliverable: "Weekly reports, risk log" },
        { wbs: "1.1", task: "EVT Build", duration: `${s.timeline.evt} wks`, deliverable: "Functional prototype, 9 modalities" },
        { wbs: "1.2", task: "DVT Build", duration: `${s.timeline.dvt} wks`, deliverable: "Vedic + diagnostic suite, EMC/safety" },
        { wbs: "1.3", task: "PVT Build", duration: `${s.timeline.pvt} wks`, deliverable: "100-unit production validation" },
        { wbs: "2.0", task: "BFAC Firmware", duration: "16 wks", deliverable: "v2.4.1 safety + ACE v1.8.0" },
        { wbs: "3.0", task: "Clinical Protocol Engine", duration: "12 wks", deliverable: "7-phase protocol + AI personalization" },
        { wbs: "4.0", task: "Regulatory Submission", duration: "20 wks", deliverable: "510(k) package, IRB protocol" },
      ]},
      { heading: "3. Timeline & Budget", table: [
        { phase: "EVT", duration: `${s.timeline.evt} weeks`, budget: `$${s.budget.evt.toLocaleString()}` },
        { phase: "DVT", duration: `${s.timeline.dvt} weeks`, budget: `$${s.budget.dvt.toLocaleString()}` },
        { phase: "PVT", duration: `${s.timeline.pvt} weeks`, budget: `$${s.budget.pvt.toLocaleString()}` },
        { phase: "Total", duration: `${s.timeline.total} weeks`, budget: `$${(s.budget.evt + s.budget.dvt + s.budget.pvt).toLocaleString()}` },
      ]},
      { heading: "4. Acceptance Criteria", bullets: [
        "EVT: all 9 modalities functional, BFAC closed-loop, safety interlocks pass",
        "DVT: EMC pre-scan pass, IEC 60601-1 safety, biometric accuracy, 30-session pilot",
        "PVT: 100-unit production, cosmetic audit, packaging, traveler sign-off",
        "Clinical: IRB-approved study shows measurable improvement (CARS-2 / PCL-5)",
      ]},
      { heading: "5. Deliverables", bullets: [
        "Functional prototype (EVT, DVT, PVT)",
        "BFAC + ACE firmware (signed images)",
        "BOM, schematics, assembly manual",
        "Regulatory submission package (510(k))",
        "Clinical study protocol (IRB)",
        "Practitioner training materials",
      ]},
    ],
  };
}

// ── EVT Test Plan ────────────────────────────────────────────────────────────

export function generateEVT(pod) {
  const s = POD_SPECS[pod.id];
  return {
    docId: s.docId + "-EVT",
    revision: s.revision,
    sections: [
      { heading: "1. EVT Scope", body: `Engineering Validation Test — verify functional performance of the ${pod.designation} prototype. Phase: EVT (${s.timeline.evt} weeks).` },
      { heading: "2. Test Matrix", table: [
        { test: "Power-on rail check", method: "DMM on 48/24/12/5/3.3V rails", criteria: "±2% nominal", pass: "Pending" },
        { test: "PBM output", method: "Calibrated photodetector", criteria: "10-50 mW/cm² uniform", pass: "Pending" },
        { test: "PEMF field", method: "Gaussmeter at seat", criteria: "≥1 μT, 7.83 Hz ±0.01", pass: "Pending" },
        { test: "VAT sweep", method: "SPL meter, 30-528 Hz", criteria: "±3 dB, 85 dB limiter", pass: "Pending" },
        { test: "FIR thermal", method: "FLIR + thermocouple", criteria: "37-55°C, TCO 60°C", pass: "Pending" },
        { test: "SFT DDS", method: "Spectrum analyzer", criteria: "24 windows, field null <1 mT", pass: "Pending" },
        { test: "MCT accuracy", method: "Calibrated ammeter", criteria: "±1 μA, GFCI 10 μA", pass: "Pending" },
        { test: "H₂ purity", method: "Portable analyzer", criteria: "≥99.99%, alarm 1%", pass: "Pending" },
        { test: "NIA O₃", method: "Ozone meter", criteria: "≤0.03 ppm, interlock", pass: "Pending" },
        { test: "BIO accuracy", method: "Reference ECG/thermometer", criteria: "HRV ±2, temp ±0.5", pass: "Pending" },
        { test: "BFAC closed-loop", method: "Simulated stress event", criteria: "≤200ms modality adjust", pass: "Pending" },
        { test: "Safety interlocks", method: "E-stop, H₂, O₃, TCO, GFCI", criteria: "All pass <100ms", pass: "Pending" },
      ]},
    ],
  };
}

// ── DVT Test Plan ────────────────────────────────────────────────────────────

export function generateDVT(pod) {
  const s = POD_SPECS[pod.id];
  return {
    docId: s.docId + "-DVT",
    revision: s.revision,
    sections: [
      { heading: "1. DVT Scope", body: `Design Validation Test — verify the ${pod.designation} meets design requirements under environmental, EMC, safety, and reliability conditions. Phase: DVT (${s.timeline.dvt} weeks).` },
      { heading: "2. Environmental Tests", table: [
        { test: "Temperature operating", method: "10-40°C, 80% RH", criteria: "All modalities nominal", pass: "Pending" },
        { test: "Temperature storage", method: "-20 to 60°C", criteria: "No damage, power-on pass", pass: "Pending" },
        { test: "Vibration (transport)", method: "ISTA 3A", criteria: "No mechanical failure", pass: "Pending" },
        { test: "Drop test", method: "1m, 6 faces", criteria: "Cosmetic + functional", pass: "Pending" },
      ]},
      { heading: "3. EMC Tests", table: [
        { test: "Radiated emissions", method: "CISPR 11 Class A", criteria: "Below limit", pass: "Pending" },
        { test: "Conducted emissions", method: "CISPR 11", criteria: "Below limit", pass: "Pending" },
        { test: "Radiated immunity", method: "IEC 61000-4-3, 10V/m", criteria: "No malfunction", pass: "Pending" },
        { test: "ESD immunity", method: "IEC 61000-4-2, 8kV", criteria: "No malfunction", pass: "Pending" },
      ]},
      { heading: "4. Safety Tests", table: [
        { test: "Dielectric strength", method: "IEC 60601-1, 4kV", criteria: "No breakdown", pass: "Pending" },
        { test: "Leakage current", method: "IEC 60601-1", criteria: "<100 μA normal, <500 μA single fault", pass: "Pending" },
        { test: "Patient isolation", method: "IEC 60601-1", criteria: "2 MOPP verified", pass: "Pending" },
        { test: "H₂ leak rate", method: "Sniffer, full session", criteria: "0 leak at 1.5× pressure", pass: "Pending" },
      ]},
      { heading: "5. Reliability & Pilot", table: [
        { test: "30-session pilot", method: "Sequential sessions", criteria: "No failure, thermal stable", pass: "Pending" },
        { test: "MTBF estimate", method: "Accelerated life", criteria: ">2,000 hours", pass: "Pending" },
        { test: "BFAC AI protocol", method: "10-subject personalization", criteria: "Protocol adapts, no overload", pass: "Pending" },
      ]},
    ],
  };
}

// ── Valuation ────────────────────────────────────────────────────────────────

export function generateValuation(pod) {
  const s = POD_SPECS[pod.id];
  return {
    docId: s.docId + "-VAL",
    revision: s.revision,
    sections: [
      { heading: "1. IP Valuation Summary", body: `The ${pod.name} IP portfolio is valued at $${s.ipValuation.low}M – $${s.ipValuation.high}M (midpoint $${s.ipValuation.mid}M) based on the cost, market, and income approaches. This reflects the integration of ${9 + pod.inventions.length} technologies into a single FDA-path device targeting a ${s.marketSize.toLowerCase()}.` },
      { heading: "2. Valuation Methods", table: [
        { method: "Cost Approach", basis: "R&D investment + prototype cost", value: `$${((s.budget.evt + s.budget.dvt + s.budget.pvt) / 1000000).toFixed(1)}M (sunk cost)` },
        { method: "Market Approach", basis: "Comparable medical device IP sales", value: `$${s.ipValuation.low}M – $${s.ipValuation.high}M` },
        { method: "Income Approach (DCF)", basis: "5-year projected licensing revenue", value: `$${s.ipValuation.mid}M NPV (midpoint)` },
      ]},
      { heading: "3. Value Drivers", bullets: [
        `Category-defining: first integrated multi-modal pod for ${pod.condition}`,
        `${9 + pod.inventions.length + pod.vedic.length + pod.suppressed.length + pod.consciousness.length} technologies fused into one device — broad patent coverage`,
        "FDA 510(k) pathway de-risked (Class II, predicate exists for individual modalities)",
        "Recurring revenue: clinical sessions + protocol licensing + practitioner training",
        "Veteran/VA channel (PTSD) / school + clinic channel (autism) — government reimbursement eligible",
      ]},
      { heading: "4. Revenue Projections (5-Year)", table: [
        { year: "Year 1", units: 10, revenue: "$2.0M", source: "Clinical pilot installations" },
        { year: "Year 2", units: 50, revenue: "$12.5M", source: "VA/clinic rollout" },
        { year: "Year 3", units: 200, revenue: "$50M", source: "Commercial launch" },
        { year: "Year 4", units: 500, revenue: "$125M", source: "Scale + international" },
        { year: "Year 5", units: 1000, revenue: "$250M", source: "Mature market + licensing" },
      ]},
    ],
  };
}

// ── Commercialization Roadmap ───────────────────────────────────────────────

export function generateCommercialization(pod) {
  const s = POD_SPECS[pod.id];
  return {
    docId: s.docId + "-COMM",
    revision: s.revision,
    sections: [
      { heading: "1. Commercialization Strategy", body: `Phased commercialization: (1) clinical research installations, (2) VA/clinic pilot programs, (3) commercial launch, (4) international expansion, (5) licensing & IP monetization. Not for Sale until FDA clearance; research revenue via IRB-approved studies.` },
      { heading: "2. Go-To-Market Channels", table: [
        { channel: "Clinical Research Sites", segment: "Academic medical centers", model: "Research grant + site fee" },
        { channel: "VA / DoD (PTSD)", segment: "Veteran health systems", model: "Federal contract + per-session" },
        { channel: "Autism Clinics", segment: "Private integrative clinics", model: "Device lease + protocol license" },
        { channel: "Home Research Market", segment: "Biohacking / integrative", model: "Device sale + subscription" },
        { channel: "International", segment: "EU/Asia medical wellness", model: "Distribution + licensing" },
      ]},
      { heading: "3. Milestone Roadmap", table: [
        { milestone: "EVT Complete", target: `Week ${s.timeline.evt}`, status: "Planned" },
        { milestone: "DVT Complete", target: `Week ${s.timeline.evt + s.timeline.dvt}`, status: "Planned" },
        { milestone: "IRB Study Start", target: `Week ${s.timeline.evt + s.timeline.dvt + 4}`, status: "Planned" },
        { milestone: "510(k) Submission", target: `Week ${s.timeline.total + 8}`, status: "Planned" },
        { milestone: "FDA Clearance", target: `Week ${s.timeline.total + 20}`, status: "Planned" },
        { milestone: "Commercial Launch", target: `Week ${s.timeline.total + 24}`, status: "Planned" },
        { milestone: "International Expansion", target: `Week ${s.timeline.total + 48}`, status: "Planned" },
      ]},
      { heading: "4. IP & Licensing Strategy", bullets: [
        "File provisional patents on core fusion claims (PRD §8, PDR §6)",
        "License individual modality IP to existing device manufacturers",
        "Protocol engine IP licensed to clinics as SaaS",
        "Practitioner certification program (training revenue)",
        "White-label option for large health systems",
      ]},
      { heading: "5. Funding Strategy", body: `Phase 1 (EVT/DVT): $${((s.budget.evt + s.budget.dvt) / 1000).toFixed(0)}K — angel/seed + SBIR/STTR. Phase 2 (PVT + clinical): $${((s.budget.pvt + 500000) / 1000000).toFixed(1)}M — Series A. Phase 3 (commercial): $10M+ — Series B / strategic partner (VA, pharma, medtech).` },
    ],
  };
}

// ── Aggregate ────────────────────────────────────────────────────────────────

export function generateAllSpecs(pod) {
  return {
    pod,
    prd: generatePRD(pod),
    pdr: generatePDR(pod),
    bom: generateBOM(pod),
    sow: generateSOW(pod),
    evt: generateEVT(pod),
    dvt: generateDVT(pod),
    valuation: generateValuation(pod),
    commercialization: generateCommercialization(pod),
  };
}