import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Wrench, Cpu, Beaker, ShieldCheck, Cog, ClipboardCheck, AlertTriangle, Baby } from "lucide-react";

// Build phases
const PHASES = [
  { id: "env", icon: ShieldCheck, title: "Phase 1 — Build Environment & ESD Requirements", color: "#3b82f6", bullets: [
    "ESD workstation: grounded mat, wrist strap, ionizer fan — verify <100 V on sensitive components.",
    "Temperature 20–25 °C ±2 °C | Humidity 40–60 % RH (non-condensing).",
    "PPE: ESD gloves for electronics, nitrile gloves for soft goods/coatings.",
    "Child-safe material handling: all foam, fabric, plastic to ASTM F963 — lot-tracked.",
    "Sensor calibration station: calibrated multimeter, oscilloscope, thermal reference, gaussmeter.",
    "Firmware flashing station: laptop with DFU drivers, signed .bin, USB-C OTG.",
    "Pediatric lockout test rig: cradle-presence sensor simulator + bypass-attempt logger.",
  ] },
  { id: "iqc", icon: ClipboardCheck, title: "Phase 2 — Incoming QC (Component Verification)", color: "#22c55e", bullets: [
    "Visual inspection: all parts vs 2D drawings — no cracks, burrs, sharp edges (pediatric pinch-point check).",
    "Electrical continuity: all PCB connectors, coil windings, harness assemblies.",
    "Coil resistance: PEMF pediatric coil 1.0–1.4 Ω | H₂ solenoid coil within spec.",
    "LED panel test: PBM 630/850 nm at 50 % duty — verify no dead emitters, pediatric cap resistor in place.",
    "Battery (if used): capacity ≥95 %, IR <50 mΩ/cell — pediatric devices prefer line-power only.",
    "PCB revision: confirm BOM rev on silkscreen matches traveler.",
    "Copper grounding continuity: ≤0.1 Ω between all ground points and earth lug.",
    "H₂ module integrity: pressure test at 1.5× operating, 5-min hold — zero leak.",
    "ASTM F963 material certificates for ALL patient-contact surfaces (foam, fabric, plastic, paint).",
    "Pediatric lockout interlock: bench-test cradle-presence sensor before installation.",
  ] },
  { id: "struct", icon: Wrench, title: "Phase 3 — Structural & Soft Pediatric Enclosure", color: "#f97316", bullets: [
    "Assemble titanium-reinforced inner frame — torque M6 to 8 Nm, M8 to 14 Nm.",
    "Install pediatric-sized composite shell panels — verify snap-fit at all 12 latch points.",
    "Apply EMI gasket (conductive silicone) to all shell seams before panel close.",
    "Install copper grounding rail along full perimeter of floor panel.",
    "Mount gas-strut canopy assist — pre-load to 140 N (pediatric lighter than adult).",
    "Install canopy + hinge — verify 200 open/close cycles, no binding.",
    "Install ASTM F963 soft padding to all patient-contact surfaces — no pinch points, no sharp edges.",
    "Ultrasonic weld points: 8 locations on canopy rim — verify per IPC-2221.",
    "Cable routing: route all harnesses through pre-molded conduits before shell closure.",
    "Pediatric cradle-presence sensor install + wiring to EPI interlock (CRITICAL — see Phase 7).",
  ] },
  { id: "pbm", icon: Wrench, title: "Phase 4.1 — PBM Helmet Sub-Assembly (Pediatric Cap)", color: "#ef4444", bullets: [
    "Mount PBM LED panels (24-emitter pediatric scale) to helmet interior — M3 stainless, 0.4 Nm.",
    "Connect 630 nm red arrays to PBM-R rail (48 V DC).",
    "Connect 850 nm NIR arrays to PBM-NIR rail (48 V DC).",
    "INSTALL PEDIATRIC CAP RESISTOR on each driver channel — hard limit 25 mW/cm² (verify with photodetector).",
    "Install aluminum heat sinks + thermal paste behind each panel.",
    "Route LED driver harness through helmet spine conduit.",
    "Connect NTC 10kΩ thermistor per panel to CTL board ADC.",
    "Verify thermal: max LED junction <70 °C (pediatric) under 30-min load.",
    "Functional test: PBM pattern run, verify uniform illumination at cradle surface, cap enforced.",
  ], qc: ["LED on/off uniformity", "Thermal rise <15 °C above ambient at 30 min", "Cap enforced — output does not exceed 25 mW/cm²", "No dead pixels"] },
  { id: "pemf", icon: Cpu, title: "Phase 4.2 — PEMF Theta Coil Ring (Pediatric Cap)", color: "#3b82f6", bullets: [
    "Wind pediatric cranial coil ring — litz AWG22, 120 turns (pediatric scale).",
    "Mount coil ring to canopy interior, oriented for cranial theta entrainment.",
    "Connect coil ring to PEMF driver board (48 V DC, current-mode).",
    "INSTALL PEDIATRIC FIELD CAP — driver firmware limit ≤10 µT at cradle (verify with gaussmeter).",
    "Install ACS712 current monitor per coil segment for BFAC feedback.",
    "Route coil drive cables in shielded conduit, separated from signal cables ≥100 mm.",
    "Load theta profile (4–7 Hz) + Schumann (7.83 Hz) — pediatric regulation, not repair.",
    "Verify field: ≤10 µT at 5 cradle reference points.",
  ], qc: ["Field ≤10 µT at all cradle points", "Frequency 4–7 Hz + 7.83 Hz ±0.01 Hz", "Cap enforced — no override possible"] },
  { id: "hit", icon: Beaker, title: "Phase 4.3 — H₂ Inhalation Manifold (Pediatric Flow)", color: "#14b8a6", bullets: [
    "Install PEM electrolyzer (99.99 % H₂, 150 mL/min pediatric) in lower equipment bay.",
    "Route H₂ delivery tube through sealed grommet to canopy interior.",
    "Install pediatric flow limiter (50–150 mL/min cap) inline.",
    "Install MQ-8 H₂ sensor at canopy breathing zone — alarm at >1 % v/v.",
    "Connect H₂ solenoid shutoff valve to BFAC safety relay — auto-close <2 s on alarm.",
    "Bond all H₂ wetted metal parts to earth ground (explosion prevention).",
    "Functional test: H₂ purity ≥99.99 %, flow ≤150 mL/min cap enforced, alarm trip at 1 % v/v.",
  ], qc: ["H₂ purity ≥99.99 %", "Pediatric flow cap ≤150 mL/min enforced", "Alarm trip <2 s at 1 % v/v"] },
  { id: "gut", icon: Beaker, title: "Phase 4.4 — Gut-Brain Microbiome Delivery", color: "#22c55e", bullets: [
    "Install metered peristaltic pump (0–5 mL/h pediatric) in equipment bay.",
    "Mount bioactive reservoir (120 mL, medical-grade) — IND-gated fill only.",
    "Route delivery line to oral port at armrest.",
    "Connect pump to CTL board PWM — log every dose to session log.",
    "Load default prebiotic/Triphala profile (non-IND). IND-gated bioactive requires separate authorization.",
    "Functional test: dose accuracy ±0.1 mL at 1, 2, 5 mL/h setpoints.",
  ], qc: ["Dose accuracy ±0.1 mL", "Reservoir lot-tracked", "IND-gated bioactive requires separate sign-off"] },
  { id: "bio", icon: Cpu, title: "Phase 4.5 — Pediatric Biometric Closed-Loop", color: "#f59e0b", bullets: [
    "Install HRV/pulse sensor (MAX30102) in left armrest pediatric contact pad — soft gel interface.",
    "Mount EDA/GSR sensor (AD8232) in right armrest pediatric pad.",
    "Install skin temp sensor (MLX90614 IR) in headrest.",
    "Mount pediatric EEG headband (8-ch, soft spring contacts) at canopy crown dock.",
    "Connect all sensor outputs to BFAC MCU ADC (3.3 V, isolated).",
    "Install Cortex-M7 sensor fusion board in control bay — 100 ms sample cycle.",
    "Program OVERLOAD-PREVENTION loop: biometric threshold → modality auto-reduction ≤200 ms.",
    "Validate: simulate sensory-overload biometric signature → verify auto-reduction within 200 ms.",
  ], qc: ["HRV ±2 BPM vs reference ECG", "EDA drift <5 % over 30 min", "Auto-reduction ≤200 ms from threshold"] },
  { id: "epi", icon: AlertTriangle, title: "Phase 4.6 — Epigenetic RF Interface (IN-VITRO ONLY) + Pediatric Lockout", color: "#a855f7", bullets: [
    "CRITICAL: This subsystem is IN-VITRO ONLY. It must NEVER operate with a pediatric cradle present.",
    "Install AD9854 DDS synthesizer + 10 MHz OCXO + Class-D amps on a SEPARATE shielded in-vitro bench.",
    "Install hardwired cradle-presence interlock: EPI panel power circuit interrupted when pediatric cradle present.",
    "Verify interlock is HARDWIRED (not software-only) — failsafe: absence of cradle = panel energized.",
    "Wire interlock status to CTL board for session-log recording.",
    "Install physical key switch + door interlock on in-vitro bench enclosure.",
    "Pediatric lockout test (see Phase 7 EVT-5): install cradle, attempt energize — must be impossible.",
    "Sham-control wiring: separate sham relay path for in-vitro falsification studies.",
  ], qc: ["EPI CANNOT energize with pediatric cradle present (hardwired)", "Bypass audit: zero bypass possible", "Sham relay functional"] },
  { id: "shield", icon: ShieldCheck, title: "Phase 4.7 — Faraday Shield + Power", color: "#06b6d4", bullets: [
    "Install 0.1 mm copper mesh (99.9 %) 360° around pediatric chamber.",
    "Install conductive silicone EMI gasket on all seams — no gap >2 mm.",
    "Install 5 kVA medical isolation transformer + multi-rail DC (48/24/12/5 V) — <2.5 kW pediatric total.",
    "Install GFCI patient-isolation (10 µA trip) on all patient-contact circuits.",
    "Install E-stop buttons (×2) + safety relay — <100 ms all-power cutoff, nurse-authority.",
    "Verify Faraday attenuation ≥40 dB across 1 MHz–1 GHz.",
  ], qc: ["EMI gasket seam scan — no gap >2 mm", "GFCI trip within 1 cycle at 10 µA", "Faraday ≥40 dB", "E-stop <100 ms"] },
  { id: "ctl", icon: Cpu, title: "Phase 5 — Controller, Firmware & Calibration", color: "#eab308", bullets: [
    "Install BeagleBone AI-64 + Lattice iCE40 FPGA in electronics bay.",
    "Install 10.1 in touchscreen HMI at nurse station (operator, not patient-accessible).",
    "Flash BFAC safety firmware v1.0 (signed) via USB-C DFU — verify CRC before and after.",
    "Flash overload-prevention firmware — pediatric caps baked into firmware (not just hardware).",
    "Sensor calibration: HRV baseline (5 min), EDA zero-point, skin temp offset, EEG impedance check.",
    "LED pattern verification: run all PBM protocols — verify timing + pediatric cap.",
    "Modality output verification: enable each modality individually — verify at pediatric-capped spec.",
    "Closed-loop test: simulate overload → verify auto-reduction ≤200 ms.",
    "Safety interlock test: E-stop, H₂ alarm, O₃ alarm, thermal cutoff, PEDIATRIC LOCKOUT (EPI).",
    "No-claim audit module: activate copy scanner — blocks 'reversal/cure/repair' language in session logs.",
  ] },
  { id: "final", icon: Cog, title: "Phase 6 — Final Assembly & Integration", color: "#8b5cf6", bullets: [
    "Full system integration: connect all sub-assemblies, verify complete harness continuity.",
    "Cable routing: no pinched cables at hinge points or closure seams.",
    "Fastener torque audit: 100 % verification with torque wrench.",
    "EMI gasket seating: continuous contact, no gaps >2 mm.",
    "Pediatric cosmetic + safety: no sharp edges, no pinch points, all padding ASTM F963.",
    "Pediatric lockout final test: cradle installed → EPI energize attempt → MUST FAIL.",
    "Weight verification: record total assembled weight on traveler.",
    "No-claim label audit: device labeling contains NO 'reversal/cure/repair autism' language.",
  ] },
  { id: "test", icon: ClipboardCheck, title: "Phase 7 — Functional Testing (EVT)", color: "#22c55e", bullets: [
    "Power-on: all DC rails (48/24/12/5/3.3 V) ±2 % at full load.",
    "PBM test: output 0–25 mW/cm² cap enforced, thermal <70 °C, uniformity ≥85 %.",
    "PEMF test: ≤10 µT cap, 4–7/7.83 Hz ±0.01 Hz.",
    "H₂ test: purity ≥99.99 %, flow ≤150 mL/min cap, alarm trip <2 s.",
    "Gut-brain test: dose accuracy ±0.1 mL.",
    "Biometric closed-loop: overload → auto-reduction ≤200 ms.",
    "Pediatric lockout test: EPI cannot energize with cradle present (CRITICAL).",
    "E-stop test: <100 ms all-power cutoff.",
    "EMI gasket + pinch-point audit.",
    "Bluetooth/WiFi (if fitted): biometric data sync to nurse station.",
    "No-claim audit: scan session log for 'reversal/cure/repair' — zero violations.",
  ] },
  { id: "qa", icon: ShieldCheck, title: "Phase 8 — QA, Gates & Sign-Off", color: "#ef4444", bullets: [
    "EVT checklist: all mechanical fits, first-article, dimensional verification — signed.",
    "Pediatric lockout audit: independent bypass audit — zero bypass events — signed.",
    "ASTM F963 material audit: independent lab review of all patient-contact surfaces — signed.",
    "No-claim copy audit: DSMB review of all logs + labels — zero violations — signed.",
    "In-vitro falsification (Gate 1): sham-controlled iPSC-neuron study, null path documented.",
    "ISO 14971 risk file: pediatric-specific hazard analysis maintained.",
    "Gate review (Gate 0 + Gate 1): PI + pediatric nurse + DSMB + pediatric ethicist sign-off.",
    "IRB/IACUC packet drafted (Gate 2) — NOT for human pediatric use until IRB + IND/IMD + DSMB.",
    "Failure mode logging: all deviations in traveler, root cause before rework.",
    "Final sign-off: quality engineer + lead engineer + pediatric ethicist signatures.",
  ] },
];

function Phase({ phase }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" style={{ borderLeftColor: phase.color, borderLeftWidth: 3 }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors">
        <span className="flex items-center gap-2 text-white font-bold text-sm">
          <phase.icon size={14} style={{ color: phase.color }} />{phase.title}
        </span>
        {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-gray-800">
          <ul className="space-y-1.5 mt-3">
            {phase.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-xs leading-relaxed">
                <CheckCircle2 size={11} className="text-cyan-500 flex-shrink-0 mt-0.5" />{b}
              </li>
            ))}
          </ul>
          {phase.qc && (
            <div className="mt-3 pt-3 border-t border-gray-800/60">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">QC Acceptance Criteria</p>
              <ul className="space-y-1.5">
                {phase.qc.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: phase.color }}>
                    <CheckCircle2 size={11} className="flex-shrink-0 mt-0.5" />{q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PrenatalBuildPlan() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500 font-mono text-xs">ZA-NRC-P-BLD-001-A</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800">Not for Sale</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-950/40 text-yellow-400 border border-yellow-800">Pediatric — IRB Gated</span>
            </div>
            <h2 className="text-white font-black text-lg">Prenatal Repair Pod (NRC-P) — Complete Build Plan</h2>
            <p className="text-gray-500 text-xs mt-1">8-phase assembly manual · pediatric-scaled · EVT → DVT · Gate 0/1 governed</p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-950/40 text-red-400 border border-red-800"><Baby size={10} /> Pediatric Caps</span>
          </div>
        </div>
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl px-4 py-3 mt-2">
          <p className="text-amber-200/80 text-xs leading-relaxed">
            <strong className="text-amber-300">Pediatric lockout is non-negotiable.</strong> The epigenetic/DNA "reprogramming" interface (Phase 4.6) is IN-VITRO ONLY and is hardwired OFF whenever a pediatric cradle is present. It can never operate on a child. Build plan makes NO claim to reverse, repair, or cure autism or brain damage.
          </p>
        </div>
      </div>

      {PHASES.map((p) => <Phase key={p.id} phase={p} />)}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-3">Build Timeline (Indicative)</h3>
        <div className="space-y-2">
          {[
            { ph: "Phases 1–3", w: "Weeks 1–6", t: "Environment, IQC, structural + soft enclosure" },
            { ph: "Phase 4 (4.1–4.7)", w: "Weeks 6–16", t: "All subsystem sub-assemblies (pediatric-capped)" },
            { ph: "Phase 5", w: "Weeks 14–18", t: "Controller, firmware, calibration, lockout test" },
            { ph: "Phase 6–7 (EVT)", w: "Weeks 18–24", t: "Final assembly, integration, EVT functional test" },
            { ph: "Gate 1 (in-vitro)", w: "Weeks 22–24", t: "Sham-controlled falsification, null path" },
            { ph: "Phase 8 (DVT + QA)", w: "Weeks 26–40", t: "DVT build, EMC, ASTM F963, risk file, IRB packet draft" },
          ].map((r) => (
            <div key={r.ph} className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-lg p-2.5">
              <span className="text-cyan-400 text-xs font-bold w-32 flex-shrink-0">{r.ph}</span>
              <span className="text-gray-500 text-xs w-24 flex-shrink-0">{r.w}</span>
              <span className="text-gray-300 text-xs">{r.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}