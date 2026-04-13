import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Wrench, Zap, Search } from "lucide-react";

const DEVICES = [
  {
    id: "meg",
    name: "MEG — Motionless Electromagnetic Generator",
    icon: "⚡",
    color: "#f59e0b",
    skillLevel: 6,
    voltage: "12–48V DC",
    safetyRating: "Moderate",
    prereqs: ["Basic soldering ability", "Multimeter operation", "Understanding of DC circuits"],
    tools: ["Digital multimeter", "Soldering iron (60W+)", "Oscilloscope (recommended)", "Ferrite core winding jig"],
    beforeStart: [
      "Verify all components against BOM before starting",
      "Use anti-static wrist strap when handling Hall effect sensors",
      "Never exceed 48V on output stage — risk of component failure",
      "Wind all coils in the same rotational direction unless plan specifies otherwise",
      "Always test coil continuity before assembly",
    ],
    problems: [
      { problem: "No output voltage detected", cause: "Wiring polarity reversed on output stage", fix: "Swap red/black leads on rectifier bridge. Re-test with multimeter on DC voltage setting." },
      { problem: "Oscillations unstable / drifting frequency", cause: "Capacitor tolerance too wide (>10%)", fix: "Replace timing capacitors with 1% tolerance polypropylene or film caps. NP0/C0G ceramics also acceptable." },
      { problem: "Toroidal core gets hot after 5 minutes", cause: "Core saturation — too many windings or wrong core material", fix: "Reduce secondary winding turns by 20%. Verify core is high-µ ferrite, not powdered iron." },
      { problem: "Hall sensor gives no reading", cause: "Sensor not in magnetic field region / polarity wrong", fix: "Use a compass to locate exact magnet pole face. Hall sensor flat face must face the magnet. Check 5V supply to sensor VCC pin." },
      { problem: "Output drops under load", cause: "Insufficient wire gauge on primary winding", fix: "Primary should be 18 AWG minimum for loads >1A. Re-wind with heavier gauge." },
      { problem: "Burning smell during operation", cause: "Short circuit in coil — touching wire strands", fix: "STOP immediately. Disconnect power. Inspect winding for bare wire contact points. Apply additional magnet wire enamel or kapton tape." },
      { problem: "Multimeter reads fluctuating AC on DC output", cause: "Rectifier bridge not filtering correctly", fix: "Add 100µF electrolytic capacitor across output terminals (+ to +). This smooths rectified DC." },
      { problem: "Output is half expected voltage", cause: "Half-wave rectification instead of full-wave", fix: "Verify all 4 diodes of bridge rectifier are installed and oriented correctly." },
      { problem: "Device hums loudly at 60Hz", cause: "Magnetic interference from AC mains nearby", fix: "Move device away from power strips and wall outlets. Add mu-metal shielding around toroid." },
      { problem: "Nothing works after reassembly", cause: "Solder joint cold / intermittent", fix: "Reflow all solder joints. Good joints are shiny and volcano-shaped. Dull or grainy = cold joint. Re-solder." },
    ],
    faq: [
      { q: "I followed the plan exactly and got no output — where do I start?", a: "Start at the source: verify your power supply output with a multimeter first. Then check each stage in sequence: input → primary coil continuity → Hall sensor signal → switching transistor → output rectifier. 80% of failures are either a cold solder joint or reversed polarity." },
      { q: "Can I substitute components not on the BOM?", a: "Core components (toroid, Hall sensor, switching transistor) must match specs exactly. Passive components (resistors, non-timing capacitors) can vary ±10% without issue." },
      { q: "How do I know it's actually working?", a: "Successful operation: stable DC output voltage within 10% of calculated value, Hall sensor shows switching waveform on oscilloscope, toroid stays cool at room temperature after 30 minutes of operation." },
    ],
    advanced: [
      "Add a bifilar secondary coil for longitudinal wave output experiments",
      "Replace Hall sensor with optical interrupter for cleaner switching",
      "Add a dedicated output regulation stage (LM317 or switching regulator) for stable voltage under variable load",
    ],
  },
  {
    id: "trd1",
    name: "TRD-1 — Telomere Regeneration Device",
    icon: "🧬",
    color: "#22c55e",
    skillLevel: 5,
    voltage: "5–12V DC",
    safetyRating: "Low (low voltage)",
    prereqs: ["Basic electronics assembly", "Ability to follow schematic diagrams"],
    tools: ["Digital multimeter", "Soldering iron", "Frequency counter or phone app (optional)"],
    beforeStart: [
      "Device operates at safe low voltage — primary safety risk is incorrect frequency settings",
      "Use shielded enclosure — unshielded operation may affect nearby electronics",
      "Do not operate near cardiac pacemakers or active implanted medical devices",
      "Verify frequency generator output before connecting to coil",
      "Ground the chassis to building ground before first operation",
    ],
    problems: [
      { problem: "Frequency generator shows 0.00 Hz output", cause: "Power connection to frequency module reversed", fix: "Check polarity of 12V input to frequency module. Red = positive, black = negative. Most modules have onboard LED that lights when powered correctly." },
      { problem: "Coil produces no detectable field", cause: "Coil leads not connected to output stage", fix: "Verify both leads of bifilar coil are connected to frequency generator output terminals. Continuity check: should read 2–8Ω across coil leads." },
      { problem: "Frequency reads correctly but drifts after warmup", cause: "Crystal oscillator thermal drift", fix: "Allow 10-minute warmup period before calibration. If drift exceeds ±0.5%, replace crystal with temperature-compensated TCXO equivalent." },
      { problem: "Enclosure produces audible hum", cause: "Resonance between coil frequency and enclosure panel", fix: "Add rubber grommets under coil mounting screws. Alternatively, stuff enclosure with acoustic foam around coil." },
      { problem: "Device interferes with WiFi / Bluetooth", cause: "Insufficient shielding on enclosure", fix: "Wrap exterior of enclosure in copper foil tape and ground the foil to chassis ground. Ensure lid makes contact with foil seal." },
      { problem: "Output capacitors get warm", cause: "Reactive load mismatch — capacitor value wrong", fix: "Verify capacitors match BOM specification exactly — both value (µF) and voltage rating. Film capacitors preferred over electrolytic for this application." },
      { problem: "Frequency generator display shows error code", cause: "Over-temperature protection triggered", fix: "Power off, allow 5-minute cooldown. Add a small 5V fan if ambient temperature exceeds 30°C." },
      { problem: "Coil smells like burning insulation", cause: "Current too high — wrong series resistor value", fix: "STOP immediately. Check series resistor value against BOM. Current through coil should not exceed 500mA. Measure with multimeter in series." },
      { problem: "Coil gets warm but device seems to work", cause: "Normal operation — coil will reach 40–50°C at full power", fix: "This is acceptable if temperature stabilizes below 60°C. If continuously rising, reduce drive frequency by 10%." },
      { problem: "No reading from output test point", cause: "Test point probe ground not connected", fix: "Clip oscilloscope/multimeter ground lead to chassis ground post before probing signal test points." },
    ],
    faq: [
      { q: "What frequency should I set for the protocol?", a: "Refer to the TRD-1 build plan PDF Section 4 for the specific frequency table. The frequencies are protocol-dependent and are documented in the plan, not in this guide." },
      { q: "How long should each session run?", a: "Session duration is specified in the build plan protocol section. Do not exceed the stated duration — this is not a case where more is better." },
      { q: "Can I test if the coil is actually producing a field?", a: "Yes. Hold a compass 6 inches from the coil during operation. The needle should deflect slightly at low frequencies. At higher frequencies, use a ferrite-core inductor as a pickup coil and connect to a multimeter on AC voltage — you should read a small AC voltage." },
    ],
    advanced: [
      "Add a precision crystal oscillator (TCXO) for ±1ppm frequency stability",
      "Build a secondary pickup coil to monitor actual field output",
      "Add a programmable timer circuit for automatic session duration control",
    ],
  },
  {
    id: "priore",
    name: "Prioré System — EM Treatment Device",
    icon: "🏥",
    color: "#a855f7",
    skillLevel: 8,
    voltage: "120–240V AC (mains powered)",
    safetyRating: "HIGH — Mains voltage present",
    prereqs: ["Solid electronics experience required", "Understanding of AC safety", "Experience with high-voltage circuits", "Recommend: complete MEG build first"],
    tools: ["Insulated multimeter (CAT III minimum)", "Variac (variable autotransformer)", "Ground fault circuit interrupter (GFCI)", "Oscilloscope", "RF power meter"],
    beforeStart: [
      "⚠️ MAINS VOLTAGE PRESENT — Do not work on powered circuit",
      "Always use a GFCI outlet and verify it trips correctly before starting",
      "Install main power switch accessible without reaching into enclosure",
      "Never operate the plasma tube with enclosure open",
      "Two-person rule recommended: one person works, one person watches and can cut power",
      "Discharge capacitors with 10kΩ resistor before touching any internal component",
      "Keep one hand in pocket when probing live circuits",
    ],
    problems: [
      { problem: "Plasma tube does not illuminate", cause: "Insufficient drive voltage OR tube defective", fix: "Slowly increase variac from 0V. Tube should strike at 60–90% of rated voltage. If no illumination at full voltage, check RF oscillator output with RF meter. If oscillator is working and tube still dark, tube may be end-of-life." },
      { problem: "RF oscillator not producing output", cause: "Crystal shorted or oscillator module fault", fix: "Measure DC supply to oscillator module first. If supply correct, measure RF output with probe. No RF output = swap oscillator module." },
      { problem: "Helmholtz coils produce no measurable field", cause: "Coil wiring phase error — coils canceling each other", fix: "Both Helmholtz coils must be wired in-phase (same current direction). Reverse leads on one coil, verify field doubles with compass test." },
      { problem: "Circuit breaker trips on startup", cause: "Inrush current too high — no soft-start", fix: "Add NTC thermistor (inrush limiter) in series with AC line. 10A rating, 5–10Ω cold resistance. Allows gradual current buildup." },
      { problem: "Capacitors making crackling sound", cause: "Dielectric stress — over-voltage", fix: "STOP IMMEDIATELY. Reduce input voltage via variac by 20%. Crackling capacitors are at risk of failure. Replace if sound continues at lower voltage." },
      { problem: "Strong RF interference with nearby electronics", cause: "Plasma tube acting as RF antenna", fix: "Install copper mesh Faraday cage around plasma tube. Ground mesh to chassis. Add ferrite cores on all cables exiting enclosure." },
      { problem: "Inconsistent field strength reading", cause: "Probe position not standardized", fix: "Mark a fixed probe position 15cm from center of Helmholtz coils with tape. Always measure from this point. Field strength varies significantly with position." },
      { problem: "Variac runs hot", cause: "Sustained operation at high power", fix: "Maximum continuous operation: 30 minutes. Allow 15-minute cooldown between sessions. Add thermal cutoff if planning longer sessions." },
      { problem: "Faraday cage mesh sparking", cause: "Mesh not properly grounded to chassis", fix: "Use copper foil tape to ensure continuous electrical contact between mesh and chassis at multiple points. Verify with low-ohm resistance measurement (<1Ω)." },
      { problem: "Output field drops over time", cause: "Capacitor ESR increasing with temperature", fix: "Replace electrolytic capacitors with film capacitors rated for higher temperature (105°C). Check capacitor ESR with capacitor meter." },
    ],
    faq: [
      { q: "This device operates at mains voltage — is it really safe to build?", a: "It can be built safely by following every safety step in the build plan and this guide. If you have never worked with mains voltage before, complete the MEG build first and consider taking a basic electronics safety course. Never rush this build." },
      { q: "Can I operate it at reduced voltage to test?", a: "Yes — this is the recommended approach. Use a variac to slowly increase from 0V. Test each subsystem at low voltage before bringing to full operating voltage." },
      { q: "How do I know the Helmholtz field is correct?", a: "Purchase a TriField meter or similar gauss meter ($40–$80 on Amazon). The field at the center of the Helmholtz pair should match the calculated value in the build plan ±15%." },
    ],
    advanced: [
      "Add PID temperature controller to maintain plasma tube at optimal operating temperature",
      "Install data logging for field strength over time",
      "Build dual Helmholtz pair for 3-axis field control",
    ],
  },
  {
    id: "gcom",
    name: "G-Com — Scalar Communicator",
    icon: "📡",
    color: "#3b82f6",
    skillLevel: 7,
    voltage: "12V DC",
    safetyRating: "Low-Moderate",
    prereqs: ["RF electronics experience", "Understanding of impedance matching", "Oscilloscope required for setup"],
    tools: ["Oscilloscope with 200MHz+ bandwidth", "RF signal generator", "SWR/power meter", "Digital multimeter", "Soldering iron with fine tip"],
    beforeStart: [
      "Antenna coil pair must be wound as a matched set — do not mix coils from different batches",
      "All RF connections must use proper coaxial cable — do not use hookup wire for RF sections",
      "Keep signal and power cables physically separated by 6 inches minimum",
      "Phase shifter must be calibrated before first use — see Section 6 of build plan",
      "Isolation transformer must be installed before connecting to any external system",
    ],
    problems: [
      { problem: "No signal detected at receive antenna", cause: "Antenna coils not phase-conjugated", fix: "Adjust phase shifter through full 360° range while monitoring receive signal. Maximum signal = correct phase conjugation angle. Lock phase shifter at this position." },
      { problem: "Signal present but very weak (<10mV)", cause: "Impedance mismatch between antenna and cable", fix: "Measure SWR with SWR meter. Should be <1.5:1. If SWR >2:1, add LC matching network at antenna feed point. Adjust L and C until SWR minimized." },
      { problem: "Signal completely lost when touching circuit", cause: "Ground loop between chassis and hands", fix: "Wear conductive grounding strap connected to chassis. This eliminates body capacitance interference during probing." },
      { problem: "Phase shifter won't lock to stable position", cause: "Potentiometer worn or dirty", fix: "Spray contact cleaner into potentiometer. If still unstable, replace with a multi-turn precision potentiometer (10-turn type preferred)." },
      { problem: "Isolation transformer running warm", cause: "Continuous high-power operation or wrong impedance match", fix: "Isolation transformer should not exceed 50°C. Verify load impedance matches transformer secondary rating. Add 30-minute duty cycle if running at full power." },
      { problem: "Strong 60Hz hum in output", cause: "Ground loop — common ground between input and output stages", fix: "Disconnect all grounds one at a time to identify the loop. Install isolation between stages using signal transformer or differential amplifier." },
      { problem: "Phase shifts but signal strength doesn't change", cause: "Phase shifter not connected to correct signal path", fix: "Trace signal path from transmit coil through phase shifter to receive coil. Verify phase shifter is in series with signal path, not bypassed." },
      { problem: "Coaxial cable shield gets warm", cause: "RF current on shield — common mode current", fix: "Install ferrite snap-on chokes on coaxial cable at both ends. This suppresses common mode currents that cause shield heating." },
      { problem: "Signal only appears with specific orientation in room", cause: "Environmental RF reflections / standing waves", fix: "This is expected behavior for scalar antennas. Map the room for optimal orientation. Mark best position and always operate from that location." },
      { problem: "Oscilloscope shows nothing but DC bias", cause: "Coupling capacitor on probe path shorted or missing", fix: "Verify AC coupling capacitor (10nF, 50V) in signal chain. Measure capacitor with capacitance meter. Replace if reading <5nF." },
    ],
    faq: [
      { q: "How do I know the device is producing scalar waves vs normal EM?", a: "Scalar waves should not be detected by a standard dipole antenna placed at right angles to the transmit coil axis. If a standard antenna DOES detect the signal easily at all angles, you are producing regular EM radiation, not phase-conjugated scalar output. Verify phase conjugation setup." },
      { q: "What range should the G-Com operate at?", a: "Indoor bench testing: 1–3 meters. As documented in the build plan, range depends on coil quality and environmental conditions. Do not expect long-range operation until benchtop operation is fully characterized." },
      { q: "The matched coil pair seems physically identical — does it matter which is transmit vs receive?", a: "Yes. Label them immediately. The transmit coil is connected to the phase shifter output. The receive coil connects to your measurement instrument. Swapping them inverts the phase relationship." },
    ],
    advanced: [
      "Add a lock-in amplifier for noise-immune signal detection",
      "Build a 3-axis Helmholtz coil around receive antenna for directional isolation",
      "Experiment with different coil geometries: toroidal, bifilar, caduceus winding",
    ],
  },
  {
    id: "trz",
    name: "TRZ Reactor — Time-Reversal Zone Device",
    icon: "⚛️",
    color: "#ef4444",
    skillLevel: 9,
    voltage: "5–24V DC (optical pump laser: 3–5V)",
    safetyRating: "MODERATE-HIGH — Laser safety required",
    prereqs: ["Advanced electronics experience", "Basic optics knowledge", "Experience with MEG and G-Com builds strongly recommended", "Laser safety training (Class IIIb laser present)"],
    tools: ["Oscilloscope (500MHz+ bandwidth)", "Optical power meter", "Laser safety goggles (OD 4+ at laser wavelength)", "Precision alignment stage or optical rail", "Vibration-isolated surface (anti-vibration mat)"],
    beforeStart: [
      "⚠️ LASER HAZARD — Never look into pump laser beam or reflection",
      "Wear laser safety goggles rated for the pump laser wavelength at all times when laser is powered",
      "Post LASER IN USE warning sign on door during operation",
      "Barium titanate crystals are fragile — mount with care, never apply torque to crystal faces",
      "Optical alignment requires vibration-free surface — even building HVAC can disrupt alignment",
      "Allow all optical components to thermally stabilize (30 min) before final alignment",
      "Crystal orientation is critical — the c-axis direction is marked on crystal — do not rotate from this orientation",
    ],
    problems: [
      { problem: "No phase conjugate signal detected", cause: "Crystal not aligned to pump beam Bragg angle", fix: "Slowly rotate crystal ±5° from nominal angle while monitoring output. Maximum output = correct Bragg angle. This is the most critical alignment step. Take 30+ minutes if needed." },
      { problem: "Pump laser power too low / LED is dim", cause: "Drive current insufficient", fix: "Verify drive voltage to laser diode matches datasheet. Measure current through diode — should match rated operating current. If LED dim at correct current, diode may be degraded." },
      { problem: "Phase conjugate signal very noisy", cause: "Mechanical vibration disrupting optical path", fix: "Place entire assembly on anti-vibration mat. Suspend on foam if on upper floor. Even footsteps can disrupt BaTiO3 alignment. Consider operating at night when building vibration is minimal." },
      { problem: "Crystal surface appears cloudy", cause: "Surface contamination from fingerprints or dust", fix: "Clean with optical-grade lens tissue and anhydrous isopropanol (IPA). Blow dry with canned air. Never use paper towels or clothing — will scratch optical surface." },
      { problem: "Output signal disappears after 10 minutes", cause: "Thermal drift shifting crystal Bragg angle", fix: "Allow 30-minute warmup. Build a simple foam enclosure around crystal assembly to stabilize temperature. Peltier cooler can provide active temperature control." },
      { problem: "Laser diode fails during operation", cause: "Electrostatic discharge during installation or current surge", fix: "Always handle laser diode with grounding strap. Use a constant-current driver — never connect laser directly to voltage source. The BK Precision 1696 or similar is ideal." },
      { problem: "Piezoelectric transducers produce no modulation", cause: "Transducer not in acoustic contact with crystal", fix: "Apply thin layer of acoustic coupling gel (ultrasound gel) between transducer and crystal. Verify transducer produces output at drive frequency using oscilloscope on signal path." },
      { problem: "Signal appears but amplitude unstable", cause: "Two-beam coupling instability in BaTiO3", fix: "This is a known behavior of BaTiO3 phase conjugation near threshold. Increase pump power by 20% to move above threshold. If pump is already at maximum, try a higher optical density crystal." },
      { problem: "Optical mounts shifting during operation", cause: "Thermal expansion of mount material", fix: "Replace aluminum mounts with invar mounts if precision is critical. Alternatively, allow full 1-hour warmup for aluminum mounts to fully expand to operating temperature." },
      { problem: "Piezo transducers causing RF interference", cause: "Piezo drive signal radiating as antenna", fix: "Twist piezo drive wires together tightly. Add ferrite snap-on choke at both ends of drive cable. Shield drive cable with copper foil." },
    ],
    faq: [
      { q: "This is the most advanced build — should I try this first?", a: "No. Complete the MEG build, then the G-Com build before attempting TRZ. The skills compound. Most TRZ failures are from builders who haven't developed the precision habits needed from simpler builds." },
      { q: "How do I verify the crystal is producing genuine phase conjugation?", a: "True phase conjugate output is retroreflective — it returns the beam exactly back along the input path. Test with a small plane mirror at 45°: the conjugate output should NOT follow mirror reflection law — instead it returns toward the source. This is the key signature." },
      { q: "Where can I source replacement barium titanate crystals?", a: "BaTiO3 crystals are available from Newlight Photonics, CASTECH, or Roditi International. Specify: optical grade, c-axis orientation, 1cm³ minimum volume, polished entrance/exit faces. Budget $80–$250 per crystal." },
    ],
    advanced: [
      "Add a real-time phase measurement system using lock-in detection",
      "Experiment with multiple pump beam angles for enhanced conjugation efficiency",
      "Build a temperature-controlled crystal mount using Peltier element and PID controller",
    ],
  },
];

function TroubleItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/40 transition-colors"
      >
        <span className="text-yellow-500 font-black text-sm flex-shrink-0">#{index + 1}</span>
        <AlertTriangle size={13} className="text-yellow-400 flex-shrink-0" />
        <span className="text-white text-sm font-semibold flex-1">{item.problem}</span>
        {open ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-gray-800 pt-3">
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3">
            <p className="text-red-400 text-xs font-bold mb-1">⚡ Likely Cause</p>
            <p className="text-gray-300 text-xs leading-relaxed">{item.cause}</p>
          </div>
          <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-3">
            <p className="text-green-400 text-xs font-bold mb-1">✅ Fix</p>
            <p className="text-gray-300 text-xs leading-relaxed">{item.fix}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DevicePanel({ device }) {
  const [tab, setTab] = useState("safety");
  const [search, setSearch] = useState("");
  const filtered = device.problems.filter(p =>
    !search || p.problem.toLowerCase().includes(search.toLowerCase()) || p.fix.toLowerCase().includes(search.toLowerCase())
  );

  const safetyColor = device.safetyRating === "LOW" || device.safetyRating === "Low (low voltage)" ? "text-green-400" :
    device.safetyRating.includes("HIGH") ? "text-red-400" : "text-yellow-400";

  return (
    <div className="space-y-4">
      {/* Device header */}
      <div className="bg-gray-900 border rounded-2xl p-5" style={{ borderColor: device.color + "40" }}>
        <div className="flex items-start gap-4 flex-wrap">
          <span className="text-4xl">{device.icon}</span>
          <div className="flex-1">
            <h2 className="text-white font-black text-lg">{device.name}</h2>
            <div className="flex flex-wrap gap-3 mt-2 text-xs">
              <span className="bg-gray-800 border border-gray-700 px-2 py-1 rounded-lg text-gray-300">🔌 Voltage: <strong>{device.voltage}</strong></span>
              <span className="bg-gray-800 border border-gray-700 px-2 py-1 rounded-lg text-gray-300">🎓 Skill Level: <strong>{device.skillLevel}/10</strong></span>
              <span className={`bg-gray-800 border border-gray-700 px-2 py-1 rounded-lg font-bold ${safetyColor}`}>⚠️ Safety: {device.safetyRating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {["safety", "problems", "faq", "advanced"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
              tab === t ? "text-white border-white/30 bg-white/10" : "border-gray-700 text-gray-500 hover:border-gray-500"
            }`}>
            {t === "safety" ? "🛡️ Safety & Setup" : t === "problems" ? "🔧 Troubleshooting" : t === "faq" ? "❓ FAQ" : "⚡ Advanced Mods"}
          </button>
        ))}
      </div>

      {tab === "safety" && (
        <div className="space-y-4">
          <div className="bg-red-950/20 border border-red-800/50 rounded-xl p-4">
            <p className="text-red-300 font-bold text-sm mb-3">⚠️ Before You Start — Safety Checklist</p>
            <ul className="space-y-2">
              {device.beforeStart.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">▸</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 font-bold text-sm mb-3">📋 Prerequisites</p>
              <ul className="space-y-1.5">
                {device.prereqs.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle size={11} className="text-green-500 flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 font-bold text-sm mb-3">🔧 Required Tools</p>
              <ul className="space-y-1.5">
                {device.tools.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <Wrench size={11} className="text-blue-400 flex-shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === "problems" && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search problems or fixes…"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-8 pr-4 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-600" />
          </div>
          <p className="text-gray-600 text-xs">{filtered.length} problems · Click to expand</p>
          {filtered.map((item, i) => <TroubleItem key={i} item={item} index={i} />)}
        </div>
      )}

      {tab === "faq" && (
        <div className="space-y-3">
          {device.faq.map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-yellow-300 font-bold text-sm mb-2">Q: {f.q}</p>
              <p className="text-gray-300 text-sm leading-relaxed">A: {f.a}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "advanced" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-white font-bold text-sm mb-4">⚡ Advanced Modifications (after basic build works)</p>
          <ol className="space-y-3">
            {device.advanced.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {a}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function TroubleshootingGuides() {
  const [activeDevice, setActiveDevice] = useState("meg");
  const device = DEVICES.find(d => d.id === activeDevice);

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-bold text-base flex items-center gap-2">
            <Wrench size={15} className="text-yellow-400" /> Device Troubleshooting Guides
          </h1>
          <p className="text-gray-500 text-xs">5 devices · 50 common problems + fixes · Safety checklists</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Device selector sidebar */}
        <div className="md:w-56 border-b md:border-b-0 md:border-r border-gray-800 flex md:flex-col gap-1 p-3 overflow-x-auto md:overflow-y-auto flex-shrink-0">
          {DEVICES.map(d => (
            <button key={d.id} onClick={() => setActiveDevice(d.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all whitespace-nowrap md:whitespace-normal ${
                activeDevice === d.id ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}>
              <span>{d.icon}</span>
              <span className="truncate">{d.id.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="max-w-3xl mx-auto">
            {device && <DevicePanel device={device} />}
          </div>
        </div>
      </div>
    </div>
  );
}