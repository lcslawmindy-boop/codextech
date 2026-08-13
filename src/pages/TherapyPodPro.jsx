import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Dna, FileText, Package, Shield, AlertTriangle, Box, ChevronDown, ChevronUp, CheckCircle2, Radio, Sparkles } from "lucide-react";
import TherapyPodExplodedView from "../components/TherapyPodExplodedView";
import TherapyPodEngineeringDocs from "../components/TherapyPodEngineeringDocs";
import TherapyPodModalityExplodedView from "../components/TherapyPodModalityExplodedView";
import AttributionFooter from "../components/AttributionFooter";

// ── Assembly Manual Data ─────────────────────────────────────────────────
const MODALITIES = [
  { code: "PBM", name: "Photobiomodulation LED Array", freq: "630nm (Red) & 850nm (NIR)", color: "#ef4444", icon: "💡",
    desc: "Full-spectrum photobiomodulation with aluminum heat sinks and thermal management.",
    assembly: ["Mount PBM LED panels to canopy interior frame using M3 stainless fasteners (torque: 0.4 Nm)", "Connect 630nm red LED arrays to PBM-R rail (48V DC)", "Connect 850nm NIR LED arrays to PBM-NIR rail (48V DC)", "Install aluminum heat sink assemblies behind each panel — thermal paste required", "Route LED driver harness through canopy spine conduit", "Connect temperature sensor (NTC 10kΩ) per panel to CTL board ADC inputs", "Verify thermal management — max LED junction temp <75°C under load", "Functional test: PBM pattern run, verify uniform illumination at seat surface"],
    qc: ["LED on/off uniformity test", "Thermal rise <15°C above ambient at 30 min", "No dead pixels or uneven zones"] },

  { code: "FIT", name: "Far-Infrared Thermal Panels", freq: "37–55°C / 8–14 μm wavelength", color: "#f97316", icon: "🌡️",
    desc: "Far-infrared thermal therapy for deep tissue soothing and circulation.",
    assembly: ["Install FIR ceramic emitter panels to seat back and canopy lower zones", "Mount NTC thermistors at 3 patient contact points (seat, back, foot)", "Connect FIR heating elements to FIT rail (38V DC, 10A max)", "Install safety thermal cutoff (TCO) in series — trips at 60°C", "Route FIR control harness to BFAC MCU PWM outputs", "Calibrate PID loop: setpoint 37–55°C, ±0.5°C band", "Insulate FIR panel rear faces with ceramic fiber blanket", "Waterproof all FIR wiring connections with heat-shrink terminals"],
    qc: ["Thermal uniformity scan — FLIR imaging required", "TCO trip test at 60°C", "PID setpoint hold ±1°C for 10 min"] },

  { code: "SFT", name: "Scalar Field Therapy Coil System", freq: "20 Hz – 20 kHz", color: "#06b6d4", icon: "⚡",
    desc: "Scalar Field Therapy with DDS waveform generation for coherence and resonance.",
    assembly: ["Wind bifilar coil pairs on ferrite cores (AWG14, 144 turns, Fair-Rite 77 material)", "Mount 8 coil pairs in octagonal array around patient chamber walls", "Orient each pair 180° out-of-phase — verify cancellation null with gaussmeter (<1 mT transverse)", "Connect coil pairs to Class-D amplifier channels (500W/ch)", "Install DDS frequency synthesizer (AD9854) — configure F1/F2/F3 channels", "Set OCXO master clock reference (10 MHz, 0.01 ppb stability)", "Route all coil drive cables in shielded conduit, separated from signal cables by ≥100mm", "Load Schumann resonance profile (7.83 Hz), alpha-theta sweep (8–12 Hz), and Lisitsyn biological windows"],
    qc: ["Transverse field null verification (<1 mT at patient position)", "Frequency accuracy ±0.01 Hz at all programmed setpoints", "DDS sweep test — all 24 Lisitsyn windows"] },

  { code: "PEMF", name: "PEMF Coil Matrix", freq: "7.83 Hz (Schumann Resonance)", color: "#3b82f6", icon: "🔵",
    desc: "Pulsed Electromagnetic Field Therapy under floor panel for full-body Schumann resonance.",
    assembly: ["Install PEMF coil matrix beneath floor panel — 4 × planar coil segments in 2×2 grid", "Use litz wire (AWG20 × 50 strand) for low-loss PEMF operation at 7.83 Hz", "Connect PEMF coils to PEMF driver board (48V DC rail)", "Set pulse width and duty cycle: 50μs pulse, 7.83 Hz PRF", "Install current monitor (ACS712) on each PEMF coil segment for BFAC feedback", "Verify field uniformity: measure at 5 patient body reference points — target ≥1 μT at seat surface", "Install PEMF shield panel above coils (non-ferrous aluminum)", "PEMF safe-on interlock: field only enables when canopy sealed and biometric active"],
    qc: ["7.83 Hz frequency verification (±0.01 Hz)", "Field uniformity map at patient plane", "Safe-on interlock functional test"] },

  { code: "VAT", name: "Vibroacoustic Transducer Plate", freq: "30–528 Hz", color: "#a855f7", icon: "🔊",
    desc: "Vibroacoustic Therapy — transducer matrix behind seat for vibro-feedback.",
    assembly: ["Mount VAT transducer array (8 × Dayton Audio BST-1) to seat back plate", "Use coupling compound between transducer face and seat panel — fill all gaps", "Connect transducer array to VAT amplifier (Class-AB, 50W/ch, 4-channel)", "Install DSP processor (ADAU1701) for formant synthesis — load bija frequency presets", "Route audio harness through sealed cable gland in seat frame", "Install SPL limiter hardware — trips at 85 dB at patient ear position", "Calibrate low-frequency response: verify -3 dB at 30 Hz and 528 Hz", "Program therapeutic sessions: delta (0.5–4 Hz), theta (4–8 Hz), Schumann (7.83 Hz), alpha (8–12 Hz), bija formants"],
    qc: ["SPL limit functional test at 85 dB trip", "Frequency response sweep 30–528 Hz ±3 dB", "Vibration isolation — no resonance transmission to chamber frame"] },

  { code: "MCT", name: "MicroCurrent/TENS Ports", freq: "1–999 μA precision output", color: "#ec4899", icon: "⚡",
    desc: "Microcurrent Therapy precision output ports on armrests.",
    assembly: ["Install 4 × MCT output ports on armrest surfaces (2 per armrest)", "Use gold-plated electrode inserts, recessed flush with armrest surface", "Connect MCT ports to MCT driver board (isolated DC-DC, 1–999μA, ±0.1μA resolution)", "Install GFCI protection on each MCT port (10μA trip threshold)", "Current limit hardware: hard cap at 1,000 μA via resistor + crowbar circuit", "Route MCT harness in separate conduit from power and RF cables", "Program default profiles: sub-sensory (10–100μA), sensory (100–500μA)", "Functional test: current accuracy verification at 10, 100, 500, 999 μA setpoints with calibrated ammeter"],
    qc: ["Current accuracy ±1μA at all setpoints", "GFCI trip test at 10μA leakage", "Patient isolation test per IEC 60601-1"] },

  { code: "HIT", name: "Hydrogen Inhalation Module", freq: "99.99% purity H₂ delivery", color: "#14b8a6", icon: "💧",
    desc: "Molecular Hydrogen therapy with intake, filtration, and delivery system.",
    assembly: ["Install HIT PEM electrolyzer unit in lower equipment bay (side module)", "Route H₂ delivery tube through sealed grommet to canopy interior", "Install H₂ concentration sensor (MQ-8) at canopy breathing zone — alarm at >1% v/v", "Connect H₂ flow control valve (solenoid) to BFAC safety relay — auto-close on H₂ alarm", "Install water reservoir (1L deionized) and auto-fill sensor", "Set flow rate: 100–300 mL/min — patient adjustable via HMI", "Bond all H₂ wetted metal parts to earth ground (explosion prevention)", "Functional test: H₂ purity verification with portable analyzer (target ≥99.99%)"],
    qc: ["H₂ purity ≥99.99% at delivery point", "H₂ alarm trip test at 1% v/v", "Auto-shutoff on alarm verified <2s"] },

  { code: "NIA", name: "Negative Ion Air Emitter", freq: "<0.05 ppm O₃ safety limit", color: "#2dd4bf", icon: "🌬️",
    desc: "Negative Ion Air Therapy for air purification and ionic balance.",
    assembly: ["Mount NIA corona-discharge emitter at canopy crown (top center)", "Install ozone sensor (MQ-131) at patient breathing zone — 2-point calibration required", "Connect NIA emitter to NIA driver board (12V DC, PWM controlled)", "Set corona voltage: 5–8 kV peak (factory adjusted — do not modify)", "Install ozone interlock: NIA auto-disables if O₃ >0.03 ppm (safety margin below 0.05 ppm limit)", "Verify negative ion output: target ≥1×10⁶ ions/cm³ at patient position", "Route NIA HV cable in PTFE-insulated conduit, separated from all other wiring", "Ozone baseline calibration: record ambient O₃ before NIA enable, store as reference"],
    qc: ["O₃ concentration ≤0.03 ppm at patient position under full operation", "Interlock trip test at 0.03 ppm threshold", "Ion output verification with air ion counter"] },

  { code: "BIO", name: "Biometric Sensor Array (BFAC Inputs)", freq: "HRV · Temp · GSR · EEG", color: "#f59e0b", icon: "📊",
    desc: "Real-time biometric monitoring: HRV, stress, temperature, SpO₂, EEG for BFAC closed-loop control.",
    assembly: ["Install HRV/pulse sensor (MAX30102) in left armrest contact pad — medical-grade gel interface", "Mount EDA/GSR sensor (AD8232 variant) in right armrest contact pad", "Install skin temperature sensor (MLX90614 IR) in headrest assembly", "Mount EEG headband dock at canopy crown — spring-loaded contact points", "Connect all sensor outputs to BFAC MCU ADC inputs (3.3V logic, isolated)", "Install sensor fusion board (Cortex-M7, 100ms sample cycle) in control bay", "Program BFAC closed-loop: HRV coherence ≥0.8 target, auto-adjust modality intensity", "Validate biometric feedback loop: simulate stress event → verify modality auto-reduction within 200ms"],
    qc: ["HRV sensor accuracy ±2 BPM vs reference ECG", "EDA baseline capture and drift <5% over 30 min", "Closed-loop response time ≤200ms from threshold to modality adjust"] },
];

const ASSEMBLY_SECTIONS = [
  { id: "intro", title: "1. Introduction & Scope", content: [
    "This manual covers the Therapy Pod AATCS-P1 (AuraWell) prototype assembly procedure for EVT → DVT → PVT prototype phases, prepared for manufacturing partner Minewing.",
    "Manufacturer: Minewing | Prepared For: BrightSteps ASD Unified Therapy Systems | Rev B — Post-EVT",
    "Device designation: AATCS-P1 | Classification: Medical Device Class II (Target) | Not for Sale — Research Only",
  ], bullets: [
    "ESD workstation required — all PCB and sensor handling must be on a grounded ESD mat",
    "Cleanliness standard: ISO Class 7 cleanroom for optical and sensor assemblies",
    "Child-safe material verification required for all patient-contact surfaces",
    "Firmware flashing station: USB-C DFU mode, signed firmware image only",
    "Safety interlock verification is MANDATORY before any powered-on testing",
  ]},
  { id: "env", title: "2. Assembly Environment Requirements", bullets: [
    "ESD workstation: grounded mat, wrist strap, ionizer fan — verify <100V on sensitive components",
    "Temperature: 20–25°C ± 2°C | Humidity: 40–60% RH (non-condensing)",
    "PPE: ESD gloves for electronics, nitrile gloves for soft goods and coatings",
    "Child-safe material handling: all foam, fabric, and plastic parts to ASTM F963 standard",
    "Sensor calibration station: calibrated multimeter, oscilloscope, and thermal reference",
    "Firmware flashing station: laptop with DFU drivers, signed .bin file, USB-C OTG cable",
  ]},
  { id: "verify", title: "3. Component Verification (Incoming QC)", bullets: [
    "Visual inspection: all parts against 2D drawings — no cracks, burrs, or surface defects",
    "Electrical continuity: all PCB connectors, coil windings, and harness assemblies",
    "Coil resistance: PEMF coil 0.8–1.2Ω | VAT transducer 4Ω ±10% | SFT bifilar pair <0.5Ω each",
    "LED panel test: PBM 630nm and 850nm channels at 50% duty — verify no dead emitters",
    "Battery health: capacity ≥95% of rated value, internal resistance <50mΩ per cell",
    "PCB revision verification: confirm BOM revision on silkscreen matches traveler",
    "Copper grounding continuity: ≤0.1Ω between all grounding points and earth lug",
    "H₂ module integrity: pressure test at 1.5× operating pressure, 5-minute hold — zero leak",
  ]},
  { id: "structural", title: "4.1 Structural & Shell Assembly", bullets: [
    "Assemble titanium-reinforced inner frame — torque M6 bolts to 8 Nm, M8 to 14 Nm",
    "Install aerospace-grade composite shell panels — verify snap-fit engagement at all 12 latch points",
    "Apply EMI gasket (conductive silicone) to all shell seams before panel close",
    "Install copper grounding rail along full perimeter of floor panel",
    "Mount gas-strut canopy assist assembly — pre-load to 180N per strut",
    "Install lid assembly and hinge — verify open/close cycle 200× with no binding",
    "Ultrasonic weld points: 8 locations on canopy rim — verify weld strength per IPC-2221",
    "Cable routing: route all harnesses through pre-molded conduits before shell closure",
  ]},
  { id: "electronics", title: "4.2 Electronics Sub-Assembly", bullets: [
    "PCB installation: install BFAC MCU board and ACE adaptive engine board in electronics bay",
    "Sensor mounting: seat HRV/EDA pads, headrest thermal sensor, canopy EEG dock (see §BIO)",
    "LED module installation: PBM 630nm and 850nm arrays with heat sink thermal paste (see §PBM)",
    "Coil installation: SFT bifilar coil array and PEMF floor coil matrix (see §SFT, §PEMF)",
    "Haptic/VAT motor installation: transducer array behind seat back (see §VAT)",
    "H₂ module installation: PEM electrolyzer and delivery tube routing (see §HIT)",
    "NIA emitter installation: corona discharge emitter at canopy crown (see §NIA)",
    "FIR panel installation: ceramic emitter panels to seat back and canopy lower zones (see §FIT)",
    "MCT port installation: gold-plated electrode ports on armrests (see §MCT)",
    "Battery installation: Li-NMC pack in lower bay — verify polarity and thermal fuse continuity",
    "Wiring harness routing: color-coded per harness spec — 48V (yellow), 24V (red), 12V (orange), 5V (blue), signal (white), safety (green)",
  ]},
  { id: "firmware", title: "4.4 Firmware Flashing & Calibration", bullets: [
    "Flash BFAC safety firmware v2.4.1 via USB-C DFU — verify CRC checksum before and after",
    "Flash ACE adaptive engine firmware v1.8.0 — load child profile defaults",
    "Sensor calibration: HRV baseline capture (5 min), EDA zero-point, skin temp offset",
    "LED pattern verification: run all 8 PBM protocols, verify timing and intensity levels",
    "Modality output verification: enable each modality individually — verify output at spec",
    "BFAC closed-loop test: simulate HRV stress event — verify auto-reduction within 200ms",
    "Safety interlock test: E-stop test, H₂ alarm test, O₃ alarm test, thermal cutoff test",
    "OTA update connectivity test: connect to Slicon Systems Cloud Core staging server",
  ]},
  { id: "final", title: "6. Final Assembly & Integration", bullets: [
    "Full system integration: connect all sub-assemblies and verify complete harness continuity",
    "Cable routing verification: no pinched cables at hinge points or closure seams",
    "Fastener torque audit: 100% torque verification on all structural fasteners with torque wrench",
    "EMI gasket seating: verify all seams have continuous gasket contact — no gaps >2mm",
    "Canopy cosmetic inspection: no visible scratches, gaps, or alignment issues >0.5mm",
    "Child-safe inspection: no sharp edges, exposed fasteners, or pinch points per ASTM F963",
    "Weight verification: total assembled weight — record on traveler",
  ]},
  { id: "testing", title: "7. Functional Testing", bullets: [
    "Power-on test: verify all DC rail voltages (48V, 24V, 12V, 5V, 3.3V) within ±2%",
    "Sensor test: HRV ±2 BPM vs reference, EDA baseline, skin temp ±0.5°C, SpO₂ ±1%",
    "PBM test: 630nm and 850nm output power measurement with calibrated photodetector",
    "PEMF test: 7.83 Hz field strength ≥1 μT at seat surface",
    "VAT test: frequency sweep 30–528 Hz, SPL limit trip test at 85 dB",
    "FIR test: thermal ramp 37–55°C, PID hold, TCO trip at 60°C",
    "SFT test: DDS carrier output, Lisitsyn window sweep, field null verification",
    "MCT test: current accuracy ±1μA at 10/100/500/999 μA, GFCI trip test",
    "HIT test: H₂ purity ≥99.99%, flow rate 100–300 mL/min, H₂ alarm trip",
    "NIA test: O₃ ≤0.03 ppm, ion count ≥1×10⁶ ions/cm³, interlock trip",
    "BIO closed-loop test: simulate stress → modality auto-adjust ≤200ms",
    "Bluetooth/WiFi test: connect to tablet, verify biometric data sync",
    "Battery charging test: full charge cycle, verify BMS temperature and voltage limits",
  ]},
  { id: "qa", title: "8. Quality Assurance", bullets: [
    "EVT checklist: all mechanical fits, first-article inspection, dimensional verification",
    "DVT checklist: all functional tests, EMC pre-scan, safety interlock validation",
    "PVT checklist: full production validation, cosmetic audit, packaging verification",
    "Failure mode logging: all deviations logged in traveler — root cause required before rework",
    "Rework procedures: documented in RWK-AATCS-P1-001 — no unauthorized field repairs",
    "Final approval sign-off: quality engineer + lead engineer signatures required on traveler",
  ]},
];

function AssemblyManual({ expandedSection, toggleSection }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500 font-mono text-xs">AATCS-P1-MFG-001-B</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800">Not for Sale</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/60 text-blue-400 border border-blue-800">Rev B — Post-EVT</span>
            </div>
            <h2 className="text-white font-black text-xl">BrightSteps™ Therapy Pod — Prototype Assembly Manual</h2>
            <p className="text-gray-500 text-xs mt-1">AATCS-P1 · Manufacturer: Minewing · Prepared For: BrightSteps ASD Unified Therapy Systems</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-xs">Phases</p>
            <p className="text-gray-300 text-sm font-semibold">EVT → DVT → PVT</p>
          </div>
        </div>
        {/* Modality quick-ref */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-800">
          {MODALITIES.map(m => (
            <span key={m.code} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border" style={{ backgroundColor: `${m.color}18`, borderColor: `${m.color}50`, color: m.color }}>
              {m.icon} {m.code}
            </span>
          ))}
        </div>
      </div>

      {/* General assembly sections */}
      {ASSEMBLY_SECTIONS.map(sec => (
        <div key={sec.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button onClick={() => toggleSection(sec.id)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText size={14} className="text-cyan-400" />
              <span className="text-white font-bold text-sm">{sec.title}</span>
            </div>
            {expandedSection[sec.id] ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
          </button>
          {expandedSection[sec.id] && (
            <div className="px-5 pb-4 space-y-3 border-t border-gray-800">
              {sec.content?.map((c, i) => <p key={i} className="text-gray-400 text-xs leading-relaxed mt-3">{c}</p>)}
              {sec.bullets && (
                <ul className="space-y-1.5 mt-2">
                  {sec.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-xs leading-relaxed">
                      <CheckCircle2 size={11} className="text-cyan-500 flex-shrink-0 mt-0.5" />{b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Modality-specific assembly */}
      <div className="mt-2">
        <h3 className="text-white font-black text-base mb-3 px-1">5. Modality-Specific Assembly Procedures</h3>
        <div className="space-y-3">
          {MODALITIES.map((m, i) => (
            <div key={m.code} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" style={{ borderLeftColor: m.color, borderLeftWidth: 3 }}>
              <button onClick={() => toggleSection(`mod-${m.code}`)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{m.icon}</span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${m.color}25`, color: m.color }}>5.{i+1} {m.code}</span>
                      <span className="text-white font-bold text-sm">{m.name}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{m.freq}</p>
                  </div>
                </div>
                {expandedSection[`mod-${m.code}`] ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
              </button>
              {expandedSection[`mod-${m.code}`] && (
                <div className="border-t border-gray-800 px-5 pb-4">
                  <p className="text-gray-400 text-xs leading-relaxed mt-3 mb-3">{m.desc}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Assembly Steps</p>
                      <ol className="space-y-1.5">
                        {m.assembly.map((step, si) => (
                          <li key={si} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                            <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black mt-0.5" style={{ backgroundColor: `${m.color}25`, color: m.color }}>{si+1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">QC Acceptance Criteria</p>
                      <ul className="space-y-1.5">
                        {m.qc.map((q, qi) => (
                          <li key={qi} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: m.color }}>
                            <CheckCircle2 size={11} className="flex-shrink-0 mt-0.5" />{q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TherapyPodPro() {
  const [view, setView] = useState("overview"); // overview, cad, engineering, assembly
  const [expandedSection, setExpandedSection] = useState({});
  const toggleSection = (id) => setExpandedSection(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Graph
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <Dna size={16} className="text-rose-400" />
            <div>
              <h1 className="text-white font-black text-lg">Therapy Pod — Engineering Package</h1>
              <p className="text-gray-500 text-xs">ZA-TP-001 Rev C · PRD · PDR · BOM · SOW · 3D CAD · Not for Sale</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-950/60 border border-red-800 text-red-400 uppercase tracking-wider">
              Not for Sale
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-950/40 border border-yellow-800 text-yellow-400 uppercase tracking-wider">
              Research Only
            </span>
            <Link to="/resonance-dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-950/40 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/40 transition-colors">
              <Radio size={12} /> Resonance Monitor
            </Link>
            <Link to="/expanded-research" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-950/40 border border-purple-800 text-purple-400 hover:bg-purple-900/40 transition-colors">
              <Sparkles size={12} /> Research Archive
            </Link>
          </div>
        </div>
      </div>

      {/* View tabs */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {[
            { id: "overview", label: "Overview", icon: <Heart size={14} /> },
            { id: "cad", label: "3D CAD Exploded View", icon: <Box size={14} /> },
            { id: "engineering", label: "Engineering Docs", icon: <FileText size={14} /> },
            { id: "assembly", label: "Assembly Manual", icon: <Package size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === tab.id
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === "overview" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="rounded-3xl border border-gray-800 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/50 text-rose-400 text-xs font-bold uppercase tracking-widest w-fit mb-4">
                    <Dna size={12} /> Unified Bioelectromagnetic System
                  </div>
                  <h2 className="text-3xl font-black leading-tight mb-3">
                    One Pod. <span className="text-rose-400">Every Healing Modality.</span>
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    The Therapy Pod (ZA-TP-001) synthesizes every documented suppressed healing technology into a single
                    integrated device. Engineering-grade documentation includes a complete PRD, PDR, BOM (67 line items,
                    842 components), and SOW with 13-phase WBS — plus a 3D exploded CAD rendering of all 12 subsystems.
                  </p>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    <div className="text-center">
                      <p className="text-2xl font-black text-cyan-400">12</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Subsystems</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-green-400">8</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Concepts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-yellow-400">67</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">BOM Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-rose-400">42</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Weeks</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setView("cad")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-sm font-bold transition-colors"
                    >
                      <Box size={14} /> View 3D CAD
                    </button>
                    <button
                      onClick={() => setView("engineering")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-bold transition-colors"
                    >
                      <FileText size={14} /> Engineering Docs
                    </button>
                  </div>
                </div>

                {/* Right: Pod visualization */}
                <div className="relative min-h-[300px] flex items-center justify-center p-8 border-l border-gray-800/50">
                  <div className="relative w-56 h-56">
                    <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "#ec489940", background: "radial-gradient(circle, #ec489915 0%, transparent 70%)" }} />
                    <div className="absolute inset-8 rounded-full border border-dashed animate-spin" style={{ borderColor: "#06b6d440", animationDuration: "20s" }} />
                    <div className="absolute inset-16 rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle, #f59e0b30 0%, #ec489920 50%, transparent 100%)", border: "1px solid #f59e0b50" }}>
                      <Heart size={28} className="text-rose-400" />
                    </div>
                    {/* Orbiting subsystem dots */}
                    {[
                      { color: "#ef4444", label: "Safety" },
                      { color: "#f59e0b", label: "Power" },
                      { color: "#6366f1", label: "G-Scaling" },
                      { color: "#ec4899", label: "Diagnostic" },
                      { color: "#06b6d4", label: "Scalar Coils" },
                      { color: "#2dd4bf", label: "Prioré" },
                      { color: "#eab308", label: "Nada" },
                      { color: "#14b8a6", label: "Vortex" },
                    ].map((c, i) => {
                      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                      const r = 104;
                      const x = 112 + Math.cos(angle) * r;
                      const y = 112 + Math.sin(angle) * r;
                      return (
                        <button
                          key={c.label}
                          onClick={() => setView("cad")}
                          className="absolute w-7 h-7 rounded-full flex items-center justify-center text-xs transition-transform hover:scale-125"
                          style={{ left: `${x - 14}px`, top: `${y - 14}px`, background: `${c.color}30`, border: `1.5px solid ${c.color}` }}
                          title={c.label}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Subsystem summary */}
            <div>
              <h3 className="text-white font-black text-lg mb-4">Integrated Subsystems (12)</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Orgone Accumulator Envelope", icon: "🟢", desc: "Alternating organic/metallic layers (Reich). Biofield concentration via ≥1.0°F temp differential.", color: "#2d4a2d" },
                  { name: "Scalar EM Coil Array", icon: "⚡", desc: "8 bifilar coil pairs (octagonal). Counter-phased → longitudinal wave (E=0, B=0, ∇φ≠0).", color: "#06b6d4" },
                  { name: "Prioré Multichannel Modulator", icon: "🧬", desc: "F1/F2/F3 → derivative Fz. Bedini-conditioned tubes. Phase-conjugate disease reversal.", color: "#2dd4bf" },
                  { name: "Rife/Lisitsyn Frequency System", icon: "📡", desc: "24 biological coupling windows (12.5 Hz – 6.1×10¹⁴ Hz). Pathogen mortal oscillatory rates.", color: "#3b82f6" },
                  { name: "Schauberger Vortex Water", icon: "💧", desc: "4°C implosion vortex. Corrugated Repulsine impeller. Centripetal negentropic structuring.", color: "#14b8a6" },
                  { name: "Vedic Nada Acoustic Manifold", icon: "🎵", desc: "7 chakra transducers. Bija syllables (LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426 Hz).", color: "#eab308" },
                  { name: "Global Scaling Resonator Array", icon: "⚛️", desc: "Piezoelectric G-Elements. Node frequencies: 5 Hz, 101 Hz, 2032 Hz, 40.8 kHz.", color: "#6366f1" },
                  { name: "Emission Spectrum Diagnostic", icon: "🔬", desc: "UV/Vis spectrometer (200–800nm, 0.1nm res). 6 quartz portholes. Delta-spectrum computation.", color: "#ec4899" },
                  { name: "TRZ Field Chamber Controller", icon: "🌀", desc: "Phase-conjugate ratio monitoring (>0.8 target). Time-Reversal Zone stabilization.", color: "#a855f7" },
                  { name: "Safety & Interlock Subsystem", icon: "🛡️", desc: "EM field probe, patient isolation, UV shutters, <100ms emergency cutoff.", color: "#ef4444" },
                  { name: "Embedded Controller", icon: "💻", desc: "BeagleBone AI-64 + Lattice iCE40 FPGA. Real-time subsystem coordination.", color: "#f59e0b" },
                  { name: "Power Distribution", icon: "🔌", desc: "5kVA medical isolation transformer. Multi-rail DC (24V/48V/12V). <3kW total.", color: "#f97316" },
                ].map((sub, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors" style={{ borderTopColor: sub.color, borderTopWidth: 2 }}>
                    <div className="text-2xl mb-2">{sub.icon}</div>
                    <h4 className="text-white font-bold text-sm mb-1">{sub.name}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{sub.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suppressed concepts summary */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-red-400" />
                <h3 className="text-white font-black text-lg">Suppressed Healing Technologies Integrated</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { name: "Prioré Device", inv: "Antoine Prioré", yr: "1962", sup: "Funding withdrawn 1980s; device dismantled" },
                  { name: "Rife Beam Ray", inv: "Royal R. Rife", yr: "1930s", sup: "FDA raid 1939; equipment destroyed" },
                  { name: "Scalar EM / Kindling", inv: "T.E. Bearden", yr: "1980s", sup: "DoD classification; Sec. 181 secrecy" },
                  { name: "Reich Orgone Accumulator", inv: "Wilhelm Reich", yr: "1940s", sup: "FDA injunction 1954; books burned 1956" },
                  { name: "Schauberger Implosion", inv: "Viktor Schauberger", yr: "1930s", sup: "Coerced into US contract 1958; died on return" },
                  { name: "Kaznacheyev Effect", inv: "V.P. Kaznacheyev", yr: "1974", sup: "Soviet classification; Western dismissal" },
                  { name: "Global Scaling (G-Com)", inv: "Dr. Hartmut Müller", yr: "1982", sup: "Academic ostracism; patent rejection" },
                  { name: "Vedic Nada Brahma", inv: "Vedic seers", yr: "c. 1500 BCE", sup: "Colonial dismissal; academic reductionism" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-800 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={14} className="text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-xs">{c.name}</p>
                        <span className="text-gray-600 text-xs">· {c.inv} · {c.yr}</span>
                      </div>
                      <p className="text-red-300/60 text-xs mt-0.5">{c.sup}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl bg-yellow-950/20 border border-yellow-800/40 px-5 py-3">
              <p className="text-yellow-200/70 text-xs leading-relaxed">
                <span className="font-bold text-yellow-300">Research & Experimental:</span> All concepts are derived from
                published works attributed to their original authors (Bearden, Prioré, Rife, Reich, Schauberger, et al.)
                and the Vedic/Sanskrit textual tradition. The Therapy Pod is a research prototype — not for clinical
                diagnostic or therapeutic use without IRB approval and 510(k) clearance. Not for sale. Referenced under
                Fair Use (17 U.S.C. § 107).
              </p>
            </div>

            <AttributionFooter compact />
          </div>
        )}

        {view === "cad" && (
          <div className="space-y-6">
            <TherapyPodExplodedView />

            {/* Part callouts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { ref: "SAF", name: "Safety & Interlock Module", desc: "EM field probe, patient isolation monitor, UV interlocked shutters, <100ms emergency cutoff", color: "#ef4444" },
                { ref: "CTL", name: "Control Electronics & HMI", desc: "BeagleBone AI-64 embedded controller, Lattice iCE40 FPGA, 10.1\" touchscreen operator interface", color: "#f59e0b" },
                { ref: "GSC", name: "Global Scaling Resonator Array", desc: "4 piezoelectric G-Elements in mu-metal isolation. Node freqs: 5Hz, 101Hz, 2032Hz, 40.8kHz", color: "#6366f1" },
                { ref: "DIAG", name: "Emission Spectrum Diagnostic Ring", desc: "Ocean Insight Flame spectrometer (200-800nm, 0.1nm), 6 quartz portholes, FLIR thermal camera", color: "#ec4899" },
                { ref: "EM", name: "Scalar EM Coil Array (Octagonal)", desc: "8 bifilar coil pairs on Fair-Rite 77 ferrite cores, AWG14, 144 turns, 10-40kHz carrier", color: "#06b6d4" },
                { ref: "PRI", name: "Prioré Multichannel Modulator", desc: "3-channel DDS (AD9854), Bedini-conditioned electron tubes, double-balanced mixers, OCXO reference", color: "#2dd4bf" },
                { ref: "NAD", name: "Vedic Nada Acoustic Manifold", desc: "7 directional transducers at chakra points. Bija: LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426 Hz", color: "#eab308" },
                { ref: "BED", name: "Patient Treatment Bed", desc: "Carbon fiber, EM transparent, 1.9m × 0.7m, 300kg load capacity, adjustable", color: "#1a1a1a" },
                { ref: "VOR", name: "Schauberger Vortex Water System", desc: "Corrugated Repulsine impeller, 40L borosilicate chamber, Peltier+compressor hybrid, 4°C ±0.5°C", color: "#14b8a6" },
                { ref: "PWR", name: "Power Distribution Bay", desc: "5kVA medical isolation transformer, multi-rail DC (24V/48V/12V), <3kW total consumption", color: "#f97316" },
                { ref: "FAF", name: "Faraday Shield", desc: "0.1mm copper mesh, 99.9% purity, 360° EM enclosure around patient chamber", color: "#8B4513" },
                { ref: "ORG", name: "Orgone Accumulator Envelope", desc: "20 alternating organic (sheep wool felt) / metallic (galvanized steel) layers, ≥1.0°F differential", color: "#2d4a2d" },
              ].map((part) => (
                <div key={part.ref} className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderLeftColor: part.color, borderLeftWidth: 3 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-400">{part.ref}</span>
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: part.color }} />
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">{part.name}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{part.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "engineering" && (
          <TherapyPodEngineeringDocs />
        )}

        {view === "assembly" && (
          <div className="space-y-4">
            <TherapyPodModalityExplodedView />
            <AssemblyManual expandedSection={expandedSection} toggleSection={toggleSection} />
          </div>
        )}
      </div>
    </div>
  );
}