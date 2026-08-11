import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { pack_id, pack_title } = await req.json();
    if (!pack_id || !pack_title) {
      return Response.json({ error: 'pack_id and pack_title required' }, { status: 400 });
    }

    console.log(`Generating content for: ${pack_title}`);

    // Mark as generating
    const existing = await base44.asServiceRole.entities.BriefPackContent.filter({ pack_id });
    if (existing.length > 0) {
      await base44.asServiceRole.entities.BriefPackContent.update(existing[0].id, { status: 'generating' });
    } else {
      await base44.asServiceRole.entities.BriefPackContent.create({
        pack_id, pack_title, status: 'generating'
      });
    }

    // Fast mock content (no AI call for testing)
    const mockContent = {
      overview: `${pack_title} is an advanced experimental device designed for research and testing purposes only. This document provides comprehensive engineering specifications, assembly instructions, and measurement protocols based on peer-reviewed literature and patent analysis.`,
      theory_deep: `The theoretical foundation for this device is rooted in electromagnetic field interactions and energy transduction principles. Key references include established patents (US 6,362,718, US 3,656,021) and peer-reviewed analysis by researchers in advanced electromagnetics. The design leverages asymmetric regauging and flux linkage principles to explore non-linear energy conversion pathways.`,
      system_architecture: `The system comprises four major subsystems: (1) Primary energy source and power conditioning, (2) Core electromagnetic transducer with optimized coil geometry, (3) Secondary winding for energy extraction, (4) Measurement and feedback circuitry. These subsystems operate in coordinated fashion to achieve the desired electromagnetic effects.`,
      circuit_description: `The core topology utilizes a primary drive coil wound on a high-permeability ferrite core. The secondary extraction coil is positioned to maximize flux coupling while minimizing back-EMF. A driver circuit operating at the resonant frequency supplies the primary coil, with frequency tuning available via variable capacitor network. Output is rectified and filtered for measurement.`,
      bom: [
        { ref: "C1", component: "Capacitor", spec: "100µF 50V Polypropylene", qty: "2", source: "Mouser", notes: "Low-loss film type" },
        { ref: "C2", component: "Capacitor", spec: "10µF 100V Ceramic", qty: "4", source: "Digi-Key", notes: "Bypass capacitors" },
        { ref: "R1", component: "Resistor", spec: "10kΩ 1/4W 1%", qty: "3", source: "Mouser", notes: "Precision resistors" },
        { ref: "L1", component: "Inductor", spec: "10mH 1A Ferrite Core", qty: "1", source: "McMaster-Carr", notes: "Primary coil substrate" },
        { ref: "L2", component: "Inductor", spec: "5mH 2A Ferrite Core", qty: "1", source: "McMaster-Carr", notes: "Secondary coil" },
        { ref: "T1", component: "Transformer", spec: "EI-core 1:1 50VA", qty: "1", source: "Mouser", notes: "Isolation transformer" },
        { ref: "D1-D4", component: "Diode", spec: "1N4007 1A 1kV", qty: "4", source: "Digi-Key", notes: "Rectifier bridge" },
        { ref: "U1", component: "IC Oscillator", spec: "NE555 Timer 8-pin", qty: "1", source: "Mouser", notes: "Frequency generator" },
        { ref: "U2", component: "Op-Amp", spec: "LM358 Dual Op-Amp", qty: "1", source: "Mouser", notes: "Signal conditioning" },
        { ref: "SW1", component: "Toggle Switch", spec: "SPST 20A 125V", qty: "1", source: "Home Depot", notes: "Power control" },
        { ref: "F1", component: "Fuse", spec: "5A 250V Fast-Blow", qty: "1", source: "Mouser", notes: "Circuit protection" },
      ],
      assembly_steps: [
        { step: 1, title: "Prepare core materials", detail: "Gather all ferrite core materials and inspect for cracks or defects. Clean with dry cloth.", caution: "Do not use solvents on ferrite cores." },
        { step: 2, title: "Wind primary coil", detail: "Wrap 22 AWG magnet wire around primary core 500 turns. Maintain uniform tension.", caution: "Wear ESD protection during winding." },
        { step: 3, title: "Wind secondary coil", detail: "Wind 20 AWG magnet wire 250 turns over primary. Use insulation tape between layers.", caution: "Keep wire tight to avoid loose windings." },
        { step: 4, title: "Mount on PCB", detail: "Solder transformer leads to circuit board using 60/40 rosin-core solder.", caution: "Allow joints to cool naturally." },
        { step: 5, title: "Install capacitors", detail: "Install C1, C2 ceramic capacitors near IC power pins. Use 0.1\" spacing.", caution: "Observe polarity on C1 electrolytics." },
        { step: 6, title: "Install resistor network", detail: "Install all resistors with color bands clearly visible for future reference.", caution: "Double-check 1% tolerance resistors before soldering." },
        { step: 7, title: "Install oscillator IC", detail: "Install NE555 timer in 8-pin DIP socket. Orient notch correctly.", caution: "Do not exceed 15V supply to IC." },
      ],
      measurement_protocols: [
        { test: "Input voltage", equipment: "Digital multimeter", procedure: "Connect DMM to power supply rails. Record steady-state voltage.", expected_result: "Supply voltage ±2% stable" },
        { test: "Primary coil resistance", equipment: "Digital multimeter", procedure: "Disconnect power. Measure DC resistance across primary winding.", expected_result: "2-5Ω depending on wire gauge" },
        { test: "Frequency response", equipment: "Oscilloscope, function generator", procedure: "Apply 1V AC signal sweep 10-100kHz. Observe secondary output.", expected_result: "Peak resonance within ±5% of calculated frequency" },
        { test: "Output voltage", equipment: "Oscilloscope", procedure: "Monitor secondary winding during operation. Capture waveform.", expected_result: "Expected output 5-50V peak depending on configuration" },
        { test: "Phase shift", equipment: "Oscilloscope with dual-channel", procedure: "Observe primary and secondary waveforms simultaneously.", expected_result: "Phase lag 45-90° at resonant frequency" },
      ],
      safety_guidelines: `This device operates at electrical potentials up to 500V DC in some configurations. Proper grounding and insulation are essential. Wear insulated gloves during assembly and testing. Use a variac (variable transformer) to bring power up slowly during initial testing. Never operate this device unattended. Keep a fire extinguisher (Class C) nearby. All test measurements should be performed with proper PPE including safety glasses. High-frequency components may generate RF energy — limit exposure near sensitive electronics.`,
      troubleshooting: [
        { symptom: "No oscillation on primary coil", likely_cause: "NE555 timer not clocking or loose connection", remedy: "Check supply voltage to U1. Verify capacitor C1 voltage rating and polarity." },
        { symptom: "Secondary winding shows no voltage", likely_cause: "Coupling coefficient too low or poor coil alignment", remedy: "Reposition secondary coil closer to primary. Check for wire breaks." },
        { symptom: "Device draws excessive current", likely_cause: "Shorted capacitor or transistor failure", remedy: "Disconnect power immediately. Check all capacitors with ESR meter." },
        { symptom: "Oscillation stops after brief operation", likely_cause: "Thermal shutdown or component aging", remedy: "Allow cooling period. Check for burnt components. Verify frequency calibration." },
        { symptom: "Output voltage unstable", likely_cause: "Load impedance mismatch or power supply noise", remedy: "Add LC filter to output. Use regulated power supply." },
      ],
      references: [
        "US Patent 6,362,718 - Motionless Electromagnetic Generator",
        "US Patent 3,656,021 - Parametric Oscillator",
        "Bearden, T.E. (2002) Energy from the Vacuum: Concepts & Principles",
        "IEEE Transactions on Power Electronics - Efficiency in Magnetic Circuits",
        "Journal of Applied Physics - Ferrite Core Performance at High Frequencies",
      ]
    };

    const wordCount = Object.values(mockContent).filter(v => typeof v === 'string').reduce((sum, text) => sum + text.split(/\s+/).length, 0) + (mockContent.bom?.length || 0) * 20 + (mockContent.assembly_steps?.length || 0) * 30 + (mockContent.measurement_protocols?.length || 0) * 25;
    const estimatedPages = Math.ceil(wordCount / 300) + 5;

    const updateData = {
      pack_title,
      ...mockContent,
      status: 'complete',
      word_count: wordCount,
      estimated_pages: estimatedPages
    };

    const records = await base44.asServiceRole.entities.BriefPackContent.filter({ pack_id });
    if (records.length > 0) {
      await base44.asServiceRole.entities.BriefPackContent.update(records[0].id, updateData);
    } else {
      await base44.asServiceRole.entities.BriefPackContent.create({ pack_id, ...updateData });
    }

    console.log(`Done: ${pack_title} — ~${estimatedPages} pages`);
    return Response.json({ success: true, pack_id, estimated_pages: estimatedPages, word_count: wordCount });

  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});