import { useState } from "react";
import { Link } from "react-router-dom";
import ResearchDisclaimer from "../components/ResearchDisclaimer";
import { ArrowLeft, BookOpen, ChevronRight, ChevronDown, CheckCircle, AlertTriangle, Lightbulb, Zap } from "lucide-react";

const SECTIONS = [
  {
    id: "welcome",
    title: "Welcome — What Is This Platform?",
    icon: "👋",
    content: `Zenith Apex is a research platform built around the published physics and biology work of Lt. Col. Thomas E. Bearden (US Army, Ret.). Bearden spent decades documenting electromagnetic phenomena that mainstream science either overlooked or actively avoided — including devices that appear to produce more output than their conventional input, and electromagnetic treatment systems that produced remarkable results in controlled animal studies.

This platform gives you:
• Access to primary source documents — actual government reports, peer-reviewed physics papers, and engineering documents
• Build plans for 5 devices based on this documented research
• Courses explaining the underlying physics in plain English
• AI tools for patent drafting and invention generation

You do NOT need a physics degree to use this platform. The courses and build plans are written for smart, curious people — engineers, makers, researchers — who want to understand and experiment with these ideas.`,
    callout: { type: "info", text: "Every claim on this platform comes with a cited source — a journal paper, government report, or patent. We don't ask you to take anything on faith." },
  },
  {
    id: "safety",
    title: "Safety First — The Rules That Keep You Safe",
    icon: "🛡️",
    content: `Before you touch any component, read this section completely. These rules apply to ALL builds.`,
    rules: [
      { title: "Never work on a powered circuit", detail: "Turn off and unplug before touching any internal component. Capacitors hold charge even after power is removed — discharge with a 10kΩ resistor before touching." },
      { title: "Use a GFCI outlet for all AC-powered builds", detail: "A Ground Fault Circuit Interrupter cuts power in <25ms if it detects a ground fault. Buy a GFCI outlet ($15) and plug your workbench into it. This can save your life." },
      { title: "One hand rule for live circuits", detail: "If you must probe a live circuit, keep your free hand in your pocket or behind your back. This prevents current from flowing across your chest if you accidentally touch two points simultaneously." },
      { title: "Wear safety glasses when soldering", detail: "Solder can spit tiny droplets of molten metal. Safety glasses are $5 and prevent permanent eye injury." },
      { title: "Ventilate when soldering", detail: "Solder flux fumes are harmful to inhale. Open a window, use a small fan pointed away from you, or use a fume extractor." },
      { title: "Laser safety for TRZ build only", detail: "The TRZ reactor uses a pump laser. Never look into the beam. Wear laser safety goggles rated for the laser wavelength." },
      { title: "If in doubt, stop", detail: "There is no shame in stopping, researching your question, and returning to the build. A 30-minute delay is better than an injury or a destroyed component." },
    ],
    callout: { type: "warning", text: "The Prioré system operates at mains voltage (120V AC). If you have zero experience with mains voltage circuits, complete the MEG build first." },
  },
  {
    id: "tools",
    title: "Tools You Need (And What They Do)",
    icon: "🔧",
    content: `Here is every tool you'll encounter in the build plans, explained in plain English.`,
    tools: [
      { name: "Digital Multimeter (DMM)", cost: "$15–$80", what: "Measures voltage, current, and resistance. The most important tool in electronics. Use it to check: Is power reaching this point? Is this wire connected? Is this component the right value?" },
      { name: "Soldering Iron (60W temperature-controlled)", cost: "$25–$60", what: "Melts solder to make permanent electrical connections. Temperature-controlled is important — too hot burns components, too cool makes bad joints. Set to 350°C for most work." },
      { name: "Oscilloscope", cost: "$30 (DSO138 kit) – $300", what: "Shows you the shape of an electrical signal over time. Essential for verifying frequency, checking waveform shape, and confirming a circuit is actually oscillating." },
      { name: "Breadboard", cost: "$5–$15", what: "A plastic board with pre-connected holes. Lets you prototype a circuit without soldering — just push component legs into holes. Test the circuit here before committing to permanent soldering." },
      { name: "Anti-Static Wrist Strap", cost: "$5–$10", what: "Connects your wrist to ground, preventing static discharge. Static electricity you can't feel (a few hundred volts) can destroy semiconductors instantly." },
      { name: "Helping Hands / PCB Holder", cost: "$8–$20", what: "A stand with alligator clips that holds your work while you solder. Frees both hands for the iron and solder." },
      { name: "Wire Strippers", cost: "$8–$15", what: "Removes the insulation from wire without cutting the conductor inside. Don't use scissors or a knife — you'll nick the wire and create a weak point." },
      { name: "Flux Pen", cost: "$5–$10", what: "Applies rosin flux to solder joints for cleaner connections. If your solder isn't flowing smoothly, flux is the fix." },
    ],
    callout: { type: "tip", text: "Start with: Multimeter ($25) + 60W soldering iron ($35) + breadboard ($8) + wrist strap ($5). Total: ~$73. Add an oscilloscope when you're ready to go deeper." },
  },
  {
    id: "components",
    title: "Understanding Components (Plain English)",
    icon: "🔬",
    content: `Every component in your build plans is listed below with a plain-English explanation of what it does and why it matters.`,
    components: [
      { name: "Resistor", symbol: "R", what: "Limits how much current flows. Like a narrow pipe that slows water flow. Value in Ohms (Ω). Color bands on the body tell you the value." },
      { name: "Capacitor", symbol: "C", what: "Stores electrical charge and releases it quickly. Like a small rechargeable battery. Used for filtering, timing, and energy storage. Value in Farads (F), usually microfarads (µF) or picofarads (pF)." },
      { name: "Inductor / Coil", symbol: "L", what: "A coil of wire that stores energy in a magnetic field. Resists changes in current. The core of most devices in this platform — the toroid, Helmholtz coil, and bifilar coil are all inductors." },
      { name: "Diode", symbol: "D", what: "Allows current to flow in one direction only — like a one-way valve. Used in rectifiers (converting AC to DC). The stripe on the body = cathode = negative end." },
      { name: "Transistor", symbol: "Q", what: "An electronic switch controlled by a small signal. A tiny signal at the base/gate controls a large current through the device. Used as a switch and amplifier." },
      { name: "Hall Effect Sensor", symbol: "—", what: "Detects magnetic field strength and polarity. Used in the MEG build to detect magnet position. Outputs a voltage proportional to magnetic field strength." },
      { name: "Ferrite Core / Toroid", symbol: "—", what: "A donut-shaped magnetic material used as the core of coils and transformers. Different ferrite materials (77, 43, 61 mix) have different magnetic properties — always use the material specified in your BOM." },
      { name: "Barium Titanate Crystal (BaTiO3)", symbol: "—", what: "A crystalline material with phase-conjugating optical properties. Used in the TRZ build. Fragile — never apply direct force to crystal faces." },
      { name: "Bridge Rectifier", symbol: "BR", what: "Four diodes arranged to convert AC (alternating current) to DC (direct current). Output is pulsating DC — add a capacitor across output to smooth it." },
      { name: "Crystal Oscillator", symbol: "XTAL", what: "A piezoelectric crystal that vibrates at a precise, stable frequency when voltage is applied. Used for timing circuits where frequency accuracy matters." },
    ],
  },
  {
    id: "reading",
    title: "How to Read a Build Plan",
    icon: "📋",
    content: `Every build plan PDF has the same structure. Here's what each section means:`,
    steps: [
      { title: "1. Bill of Materials (BOM)", detail: "A list of every component you need, with part numbers and quantities. Order everything on this list before starting. Check off each item as it arrives." },
      { title: "2. Schematic Diagram", detail: "A map of the circuit using standard symbols. The schematic shows you how components connect electrically — not physically. Think of it like a subway map vs a real map of the city." },
      { title: "3. Assembly Diagram / PCB Layout", detail: "Shows you the physical placement of components on the board. Use this alongside the schematic — the schematic tells you WHAT connects, the assembly diagram tells you WHERE to put things." },
      { title: "4. Winding Specifications", detail: "For coils and toroids — tells you how many turns, what wire gauge, and which direction to wind. Wind direction matters. If the plan says 'clockwise viewed from the top,' follow that exactly." },
      { title: "5. Test Points", detail: "Labeled locations where you should measure voltage or signal during testing. Work through these in order — if test point 3 is wrong, don't continue to test point 4." },
      { title: "6. Calibration Procedure", detail: "Step-by-step instructions to adjust the device after assembly. Read this completely before starting the build — sometimes calibration requires components to be left accessible." },
    ],
    callout: { type: "tip", text: "Pro tip: Read the entire build plan PDF from cover to cover before ordering a single part. You'll often find notes near the end that affect decisions you make at the beginning." },
  },
  {
    id: "sourcing",
    title: "Where to Buy Components",
    icon: "🛒",
    content: `Your build plans include specific part numbers. Here's where to find them:`,
    sources: [
      { name: "Mouser Electronics (mouser.com)", best: "Precision components, ICs, sensors", notes: "Ships same day. Minimum order sometimes required. Best for Hall sensors, crystal oscillators, precision capacitors." },
      { name: "DigiKey (digikey.com)", best: "Any component in the BOM", notes: "Largest selection, fast shipping. Search by manufacturer part number from your BOM for exact matches." },
      { name: "Amazon", best: "Tools, ferrite cores, wire, breadboards", notes: "Good for common components and tools. Quality varies — stick to brands with 4+ star ratings and 100+ reviews for components." },
      { name: "Zenith Apex Build Supplies Shop", best: "Pre-bundled kits for each device", notes: "We've done the sourcing for you. Kits include all major components in the right values, tested and bundled. Saves 5–10 hours of sourcing time." },
      { name: "eBay", best: "Specialty components, vintage parts", notes: "For hard-to-find items. Check seller feedback carefully. Useful for NOS (new old stock) components." },
      { name: "Alibaba / AliExpress", best: "Bulk components at lowest cost", notes: "2–4 week shipping. Best for common passives (resistors, capacitors) in bulk. Not ideal for precision components where spec adherence matters." },
    ],
    callout: { type: "info", text: "Always order 10–20% extra of small passive components (resistors, capacitors) — they're cheap and you will lose some during assembly." },
  },
  {
    id: "soldering",
    title: "Soldering — The Core Skill",
    icon: "🔥",
    content: `90% of build failures come from bad solder joints. Here's how to solder correctly:`,
    steps: [
      { title: "Heat the joint, not the solder", detail: "Touch the iron to the component lead AND the pad simultaneously. Hold for 2–3 seconds to heat both surfaces. THEN touch solder to the joint (not the iron). Solder flows to heat — it will flow into the joint automatically." },
      { title: "What a good joint looks like", detail: "Shiny, volcano-shaped, small. The solder should flow smoothly around the lead and pad. If it looks dull, grainy, or blobby — it's a cold joint. Reheat and add a tiny bit of fresh solder." },
      { title: "How long to hold the iron", detail: "2–3 seconds for small components. 4–5 seconds for large pads or thick wire. If you need more than 5 seconds, add flux or check your iron temperature." },
      { title: "How much solder to use", detail: "Less than you think. A good joint uses a tiny amount of solder. If you can see solder domed above the pad, that's too much. If the joint looks webbed between adjacent pads — that's a solder bridge, which will short your circuit." },
      { title: "After soldering", detail: "Allow joint to cool without moving the component for 5 seconds. Movement during cooling = cold joint. After cooling, trim excess lead length with flush cutters." },
    ],
    callout: { type: "warning", text: "Cold solder joints are the #1 cause of circuits that almost work — they look connected but have intermittent or high-resistance contact. When in doubt, reflow the joint." },
  },
  {
    id: "testing",
    title: "Testing Your Build",
    icon: "✅",
    content: `Never power on a completed build without testing each stage first. This approach saves components and frustration.`,
    steps: [
      { title: "Step 1: Visual inspection", detail: "Before powering on, look at every solder joint with a magnifying glass or phone camera. Check for: cold joints (dull), solder bridges (solder between adjacent pads), wrong component placement, missing components." },
      { title: "Step 2: Continuity test", detail: "With power OFF, use multimeter in continuity mode (beeps when connected). Verify: Ground planes are connected, power rails are not shorted to ground, each net connects to where it should." },
      { title: "Step 3: Power supply test", detail: "Before connecting your circuit, measure your power supply output with a multimeter. Verify it's the correct voltage before connecting. Wrong voltage destroys components instantly." },
      { title: "Step 4: Current-limited first power-on", detail: "If available, use a current-limited bench power supply set to 50mA on first power-on. If current immediately hits the limit, there's a short somewhere. Find it before applying full current." },
      { title: "Step 5: Check each test point in sequence", detail: "Your build plan has numbered test points. Work through them in order. Each test point should give the voltage or waveform shown in the plan. If a test point fails, don't advance to the next — diagnose and fix first." },
      { title: "Step 6: Full power-on", detail: "Once all test points pass at reduced power, apply full operating voltage. Monitor temperature of all components for first 5 minutes. Anything that gets unexpectedly hot needs investigation." },
    ],
  },
  {
    id: "support",
    title: "Getting Help",
    icon: "💬",
    content: `You are not alone. Here's how to get help when you're stuck:`,
    options: [
      { title: "Check the Troubleshooting Guide first", detail: "The troubleshooting guide for your specific device covers the 10 most common problems. Your issue has almost certainly been encountered before." },
      { title: "Email support", detail: "Email support@zenithapex.com with: which device you're building, which step you're on, what you expected to see, and what you actually see. Photos of your build help enormously." },
      { title: "Take a break", detail: "Seriously. If you've been staring at a problem for 30+ minutes and can't find it, walk away for an hour. You will almost always spot the issue immediately when you return with fresh eyes." },
      { title: "Use a rubber duck", detail: "Explain your problem out loud to an inanimate object (the 'rubber duck debugging' method). The act of explaining forces you to think through each step, which often reveals the error." },
    ],
    callout: { type: "info", text: "Response time: We respond to support emails within 48 hours on weekdays. Include your order number in the subject line for fastest service." },
  },
];

function CalloutBox({ callout }) {
  if (!callout) return null;
  const styles = {
    info: "bg-blue-950/30 border-blue-800/50 text-blue-300",
    warning: "bg-yellow-950/30 border-yellow-800/50 text-yellow-300",
    tip: "bg-green-950/30 border-green-800/50 text-green-300",
  };
  const icons = { info: "ℹ️", warning: "⚠️", tip: "💡" };
  return (
    <div className={`border rounded-xl px-4 py-3 mt-4 text-sm leading-relaxed ${styles[callout.type]}`}>
      {icons[callout.type]} {callout.text}
    </div>
  );
}

export default function BeginnerManual() {
  const [activeSection, setActiveSection] = useState("welcome");
  const [completed, setCompleted] = useState(new Set());
  const section = SECTIONS.find(s => s.id === activeSection);

  const toggleComplete = (id) => {
    setCompleted(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-bold text-base flex items-center gap-2">
            <BookOpen size={15} className="text-blue-400" /> Beginner's Guide to Device Builds
          </h1>
          <p className="text-gray-500 text-xs">{completed.size} of {SECTIONS.length} sections read · Start here if you're new</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="md:w-60 border-b md:border-b-0 md:border-r border-gray-800 flex md:flex-col gap-1 p-3 overflow-x-auto md:overflow-y-auto flex-shrink-0">
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all whitespace-nowrap md:whitespace-normal ${
                activeSection === s.id ? "bg-blue-900/40 border border-blue-700 text-blue-300" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}>
              {completed.has(s.id) ? <CheckCircle size={13} className="text-green-400 flex-shrink-0" /> : <span className="text-gray-600 text-xs w-4 flex-shrink-0">{i + 1}.</span>}
              <span>{s.icon} {s.title.split("—")[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <ResearchDisclaimer type="energy" />
          {section && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-4xl">{section.icon}</span>
                  <h2 className="text-white font-black text-xl mt-2">{section.title}</h2>
                </div>
                <button onClick={() => toggleComplete(section.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    completed.has(section.id) ? "bg-green-900/40 border-green-700 text-green-300" : "border-gray-700 text-gray-500 hover:border-gray-500"
                  }`}>
                  <CheckCircle size={12} /> {completed.has(section.id) ? "Read ✓" : "Mark Read"}
                </button>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>

              {section.rules && (
                <div className="space-y-3">
                  {section.rules.map((r, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <p className="text-white font-bold text-sm">{i + 1}. {r.title}</p>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{r.detail}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.tools && (
                <div className="space-y-3">
                  {section.tools.map((t, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-bold text-sm">{t.name}</p>
                          <span className="text-green-400 text-xs font-bold">{t.cost}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed">{t.what}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.components && (
                <div className="space-y-2">
                  {section.components.map((c, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-bold text-sm">{c.name}</p>
                        {c.symbol !== "—" && <span className="text-xs bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-yellow-400 font-mono">{c.symbol}</span>}
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">{c.what}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.steps && (
                <div className="space-y-3">
                  {section.steps.map((s, i) => (
                    <div key={i} className="flex gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <div className="w-7 h-7 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</div>
                      <div>
                        <p className="text-white font-bold text-sm">{s.title}</p>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.sources && (
                <div className="space-y-3">
                  {section.sources.map((s, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <p className="text-white font-bold text-sm">{s.name}</p>
                      <p className="text-blue-400 text-xs mt-0.5">Best for: {s.best}</p>
                      <p className="text-gray-500 text-xs mt-1">{s.notes}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.options && (
                <div className="space-y-3">
                  {section.options.map((o, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <p className="text-white font-bold text-sm">{o.title}</p>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{o.detail}</p>
                    </div>
                  ))}
                </div>
              )}

              <CalloutBox callout={section.callout} />

              {/* Navigation */}
              <div className="flex gap-3 pt-4 border-t border-gray-800">
                {SECTIONS.findIndex(s => s.id === activeSection) > 0 && (
                  <button onClick={() => { const i = SECTIONS.findIndex(s => s.id === activeSection); setActiveSection(SECTIONS[i - 1].id); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-all">
                    ← Previous
                  </button>
                )}
                {SECTIONS.findIndex(s => s.id === activeSection) < SECTIONS.length - 1 && (
                  <button onClick={() => { toggleComplete(activeSection); const i = SECTIONS.findIndex(s => s.id === activeSection); setActiveSection(SECTIONS[i + 1].id); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all ml-auto">
                    Next → Mark Read
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}