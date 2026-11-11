import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Wrench, Cpu, Beaker, ShieldCheck, Cog, ClipboardCheck, AlertTriangle, FlaskConical } from "lucide-react";

const PHASES = [
  { id: "env", icon: ShieldCheck, title: "Phase 1 — Build Environment & ESD", color: "#3b82f6", bullets: [
    "ESD workstation: grounded mat, wrist strap, ionizer fan — verify <100 V on sensitive components.",
    "Temperature 20–25 °C ±2 °C | Humidity 40–60 % RH (non-condensing).",
    "PPE: ESD gloves for electronics, nitrile gloves for optics/coatings.",
    "Sensor calibration station: calibrated multimeter, oscilloscope, thermal reference, gaussmeter, spectrometer.",
    "Firmware flashing station: laptop with DFU drivers, signed .bin, USB-C OTG.",
    "In-vitro cell-culture bench (separate room) for epigenetic falsification gate work.",
    "Export-control (EAR/ITAR) review logged before EM-emission hardware fabrication.",
  ] },
  { id: "iqc", icon: ClipboardCheck, title: "Phase 2 — Incoming QC", color: "#22c55e", bullets: [
    "Visual inspection: all parts vs 2D drawings — no cracks, burrs, surface defects.",
    "Electrical continuity: all PCB connectors, coil windings, harness assemblies.",
    "Coil resistance: PBM/PEMF bifilar pairs <0.5 Ω each; SFT bifilar within spec.",
    "LED panel test: 630/850 nm at 50 % duty — verify no dead emitters.",
    "PCB revision: confirm BOM rev on silkscreen matches traveler.",
    "Copper grounding continuity: ≤0.1 Ω between all ground points and earth lug.",
    "H₂ module integrity: pressure test at 1.5× operating, 5-min hold — zero leak.",
    "Faraday mesh sample: verify ≥40 dB attenuation across 1 MHz–1 GHz.",
    "Spectrometer (Flame) wavelength calibration against NIST-traceable source.",
  ] },
  { id: "struct", icon: Wrench, title: "Phase 3 — Structural & Shielded Chamber", color: "#f97316", bullets: [
    "Assemble titanium-reinforced inner frame — torque M6 to 8 Nm, M8 to 14 Nm.",
    "Install aerospace-grade composite shell panels — verify snap-fit at all 12 latch points.",
    "Apply EMI gasket (conductive silicone) to all shell seams before panel close.",
    "Install copper grounding rail along full perimeter of floor panel.",
    "Mount gas-strut canopy assist — pre-load to 180 N per strut.",
    "Install canopy + hinge — verify 200 open/close cycles, no binding.",
    "Install 0.1 mm copper mesh (99.9 %) 360° around patient chamber.",
    "Install 6 quartz portholes for diagnostic ring (optical-grade seals).",
    "Ultrasonic weld points: 8 locations on canopy rim — verify per IPC-2221.",
    "Cable routing: route all harnesses through pre-molded conduits before shell closure.",
  ] },
  { id: "pbm", icon: Wrench, title: "Phase 4.1 — Transcranial PBM Core", color: "#ef4444", bullets: [
    "Mount PBM LED panels (630 + 850 nm) to canopy interior in multi-array — M3 stainless, 0.4 Nm.",
    "Connect 630 nm arrays to PBM-R rail (48 V DC); 850 nm to PBM-NIR rail (48 V DC).",
    "Install aluminum heat sinks + thermal paste behind each panel.",
    "Route LED driver harness through canopy spine conduit.",
    "Connect NTC 10kΩ thermistor per panel to CTL board ADC.",
    "Verify thermal: max LED junction <75 °C under 30-min load.",
    "Functional test: PBM pattern run, uniform illumination at bed surface, sham-shutter operation.",
    "Sham path: install motorized shutter for sham-controlled trials (research-critical).",
  ], qc: ["LED on/off uniformity", "Thermal rise <15 °C above ambient at 30 min", "Sham shutter transitions <50 ms", "No dead pixels"] },
  { id: "pemf", icon: Cpu, title: "Phase 4.2 — Cranial PEMF + Theta Entrainment", color: "#3b82f6", bullets: [
    "Wind bifilar coil pairs on ferrite cores (AWG14, 144 turns, Fair-Rite 77).",
    "Mount 8 coil pairs in octagonal array around cranial zone.",
    "Orient each pair 180° out-of-phase — verify cancellation null with gaussmeter (<1 mT transverse).",
    "Connect coil pairs to Class-D amplifier channels (500 W/ch).",
    "Install AD9854 DDS synthesizer — F1/F2/F3 channels; OCXO 10 MHz reference (0.01 ppb).",
    "Route coil drive cables in shielded conduit, separated from signal cables ≥100 mm.",
    "Load theta profile (4–7 Hz) + Schumann (7.83 Hz). Research-dosing, not a repair claim.",
    "Verify field null and frequency accuracy at all programmed setpoints.",
  ], qc: ["Transverse field null <1 mT at patient position", "Frequency ±0.01 Hz at setpoints", "DDS sweep functional"] },
  { id: "hit", icon: Beaker, title: "Phase 4.3 — Neuroinflammation Control (H₂ + Microbiome)", color: "#14b8a6", bullets: [
    "Install PEM electrolyzer (99.99 % H₂) in lower equipment bay.",
    "Route H₂ delivery tube through sealed grommet to canopy interior.",
    "Install H₂ concentration sensor (MQ-8) at breathing zone — alarm at >1 % v/v.",
    "Connect H₂ solenoid shutoff valve to BFAC safety relay — auto-close <2 s on alarm.",
    "Install water reservoir (1 L deionized) + auto-fill sensor.",
    "Set flow rate 100–300 mL/min — patient adjustable via HMI.",
    "Bond all H₂ wetted metal parts to earth ground (explosion prevention).",
    "Install gut-brain microbiome delivery pump (IND-gated) for adjunct protocol.",
    "Functional test: H₂ purity ≥99.99 %, flow verified, alarm trip at 1 % v/v.",
  ], qc: ["H₂ purity ≥99.99 %", "Flow 100–300 mL/min verified", "Alarm trip <2 s at 1 % v/v"] },
  { id: "diag", icon: FlaskConical, title: "Phase 4.4 — Diagnostics & Closed-Loop", color: "#ec4899", bullets: [
    "Install Ocean Insight Flame spectrometer (200–800 nm, 0.1 nm) in diagnostic ring.",
    "Mount 6 quartz portholes + FLIR thermal camera at diagnostic ring.",
    "Install HRV/pulse (MAX30102), EDA/GSR (AD8232), skin temp (MLX90614), EEG headband dock.",
    "Connect all sensor outputs to BFAC MCU ADC (3.3 V, isolated).",
    "Install Cortex-M7 sensor fusion board — 100 ms sample cycle.",
    "Program closed-loop: biometric threshold → modality auto-reduction ≤200 ms (overload prevention).",
    "Validate: simulate overload biometric signature → verify auto-reduction within 200 ms.",
    "Popp biophoton readout: research channel only, not clinical.",
  ], qc: ["HRV ±2 BPM vs reference ECG", "EDA drift <5 % over 30 min", "Auto-reduction ≤200 ms", "Spectrometer wavelength calibrated"] },
  { id: "epi", icon: AlertTriangle, title: "Phase 4.5 — Epigenetic / Reprogramming Interface (IN-VITRO ONLY)", color: "#a855f7", bullets: [
    "CRITICAL: This subsystem is IN-VITRO ONLY. It must NEVER operate on a human subject.",
    "Install AD9854 DDS + Class-D amps on a SEPARATE shielded in-vitro bench (not in the chamber).",
    "Install hardwired interlock: chamber occupancy sensor → EPI bench power interrupt.",
    "Verify interlock is HARDWIRED (not software-only) — failsafe: chamber occupied = bench de-energized.",
    "Install physical key switch + door interlock on in-vitro bench enclosure.",
    "Wire sham relay path for falsification studies (Gate 1).",
    "Wire Priore-class longitudinal-wave modulator (F1/F2/F3 → Fz derivative) — research replication only.",
    "Falsification gate: exposed vs sham on iPSC-neuron lines; pre-registered endpoints (DNA methylation, telomere, BDNF, viability).",
    "Null-result path mandatory — no 'reversal' claim without replicated, blinded data.",
  ], qc: ["EPI bench CANNOT energize with chamber occupied (hardwired)", "Bypass audit: zero bypass", "Sham relay functional", "Falsification protocol pre-registered"] },
  { id: "bio", icon: Beaker, title: "Phase 4.6 — Bioactive Delivery (IND-Gated)", color: "#eab308", bullets: [
    "Install metered peristaltic pump for bioactive delivery to chamber (research dose only).",
    "Mount reservoir — IND-gated fill only; no off-protocol substance.",
    "Route delivery line to chamber port.",
    "Connect pump to CTL board PWM — log every dose to session log.",
    "Gold-nanoparticle (Swarna Bhasma) BBB delivery handled under IND; 'scalar activation' dropped from protocol.",
    "Rasayana/Brahmi/Triphala adjuncts: pharmacology reviewed; no 'rejuvenation' claim outside granted protocol.",
    "Functional test: dose accuracy ±0.1 mL at setpoints.",
  ], qc: ["Dose accuracy ±0.1 mL", "Reservoir lot-tracked", "IND-gated bioactive requires separate sign-off"] },
  { id: "pwr", icon: ShieldCheck, title: "Phase 4.7 — Power, Faraday & Safety", color: "#06b6d4", bullets: [
    "Install 5 kVA medical isolation transformer + multi-rail DC (48/24/12/5 V) — <3 kW total.",
    "Install GFCI patient-isolation (10 µA trip) on all patient-contact circuits.",
    "Install E-stop buttons (×2) + safety relay — <100 ms all-power cutoff.",
    "Verify Faraday attenuation ≥40 dB across 1 MHz–1 GHz.",
    "EMI gasket seam scan — no gap >2 mm.",
    "UV shutters interlocked (if UV diagnostic fitted).",
  ], qc: ["GFCI trip within 1 cycle at 10 µA", "Faraday ≥40 dB", "E-stop <100 ms", "EMI gasket no gap >2 mm"] },
  { id: "ctl", icon: Cpu, title: "Phase 5 — Controller, Firmware & Calibration", color: "#eab308", bullets: [
    "Install BeagleBone AI-64 + Lattice iCE40 FPGA in electronics bay.",
    "Install 10.1 in touchscreen HMI at operator station.",
    "Flash BFAC safety firmware (signed) via USB-C DFU — verify CRC before and after.",
    "Flash overload-prevention firmware — biometric auto-reduction baked in.",
    "Sensor calibration: HRV baseline (5 min), EDA zero-point, skin temp offset, EEG impedance.",
    "LED pattern verification: run all PBM protocols — verify timing, sham-shutter operation.",
    "Modality output verification: enable each modality individually — verify at spec.",
    "Closed-loop test: simulate overload → verify auto-reduction ≤200 ms.",
    "Safety interlock test: E-stop, H₂ alarm, thermal cutoff, EPI in-vitro lockout.",
    "No-claim audit module: scan session logs for 'reversal/cure/repair' — zero violations.",
  ] },
  { id: "final", icon: Cog, title: "Phase 6 — Final Assembly & Integration", color: "#8b5cf6", bullets: [
    "Full system integration: connect all sub-assemblies, verify complete harness continuity.",
    "Cable routing: no pinched cables at hinge points or closure seams.",
    "Fastener torque audit: 100 % verification with torque wrench.",
    "EMI gasket seating: continuous contact, no gaps >2 mm.",
    "Cosmetic inspection: no scratches, gaps, or alignment issues >0.5 mm.",
    "Weight verification: record total assembled weight on traveler.",
    "In-vitro lockout final test: chamber occupied → EPI bench energize attempt → MUST FAIL.",
    "No-claim label audit: device labeling contains NO 'reversal/cure/repair' language.",
  ] },
  { id: "test", icon: ClipboardCheck, title: "Phase 7 — Functional Testing (EVT)", color: "#22c55e", bullets: [
    "Power-on: all DC rails (48/24/12/5/3.3 V) ±2 % at full load.",
    "PBM test: 630/850 nm output measured with photodetector; sham-shutter transition <50 ms.",
    "PEMF test: theta 4–7 Hz + Schumann 7.83 Hz, field null verification.",
    "H₂ test: purity ≥99.99 %, flow 100–300 mL/min, alarm trip <2 s.",
    "Diagnostic test: spectrometer wavelength, FLIR thermal, biometric sensor accuracies.",
    "Biometric closed-loop: overload → auto-reduction ≤200 ms.",
    "In-vitro lockout test: EPI bench cannot energize with chamber occupied (CRITICAL).",
    "E-stop test: <100 ms all-power cutoff.",
    "EMI gasket + Faraday attenuation audit.",
    "No-claim audit: scan session log for 'reversal/cure/repair' — zero violations.",
  ] },
  { id: "qa", icon: ShieldCheck, title: "Phase 8 — QA, Gates & Sign-Off", color: "#ef4444", bullets: [
    "EVT checklist: all mechanical fits, first-article, dimensional verification — signed.",
    "In-vitro lockout audit: independent bypass audit — zero bypass events — signed.",
    "No-claim copy audit: DSMB review of all logs + labels — zero violations — signed.",
    "Gate 1 (in-vitro falsification): sham-controlled iPSC-neuron study, null path documented.",
    "ISO 14971 risk file: hazard analysis maintained.",
    "Gate review (Gate 0 + Gate 1): PI + DSMB + ethicist sign-off.",
    "Gate 2 (animal): IACUC approval, randomised/blinded/powered protocol drafted.",
    "Gate 3 (regulatory): IND/IMD packet drafted — NOT for human use without clearance.",
    "Failure mode logging: all deviations in traveler, root cause before rework.",
    "Final sign-off: quality engineer + lead engineer + ethicist signatures.",
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

export default function NeuroRegenBuildPlan() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500 font-mono text-xs">ZA-NRC-001-BLD-001-B</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800">Not for Sale</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-950/40 text-yellow-400 border border-yellow-800">Research Only</span>
            </div>
            <h2 className="text-white font-black text-lg">Neuro Regeneration Chamber (NRC-1) — Complete Build Plan</h2>
            <p className="text-gray-500 text-xs mt-1">8-phase assembly manual · research-grade · EVT → DVT · Gate 0/1 governed</p>
          </div>
        </div>
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl px-4 py-3 mt-2">
          <p className="text-amber-200/80 text-xs leading-relaxed">
            <strong className="text-amber-300">In-vitro lockout is non-negotiable.</strong> The epigenetic / reprogramming interface (Phase 4.5) is IN-VITRO ONLY and is hardwired OFF whenever the chamber is occupied. It can never operate on a human subject. Build plan makes NO claim to reverse, repair, or cure pre-birth brain damage.
          </p>
        </div>
      </div>

      {PHASES.map((p) => <Phase key={p.id} phase={p} />)}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-3">Build Timeline (Indicative)</h3>
        <div className="space-y-2">
          {[
            { ph: "Phases 1–3", w: "Weeks 1–8", t: "Environment, IQC, structural + Faraday chamber" },
            { ph: "Phase 4 (4.1–4.7)", w: "Weeks 8–20", t: "All subsystem sub-assemblies" },
            { ph: "Phase 5", w: "Weeks 18–24", t: "Controller, firmware, calibration, lockout test" },
            { ph: "Phase 6–7 (EVT)", w: "Weeks 24–32", t: "Final assembly, integration, EVT functional test" },
            { ph: "Gate 1 (in-vitro)", w: "Weeks 30–36", t: "Sham-controlled falsification, null path" },
            { ph: "Phase 8 (DVT + QA)", w: "Weeks 36–48", t: "DVT build, EMC, risk file, Gate 2/3 packet draft" },
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