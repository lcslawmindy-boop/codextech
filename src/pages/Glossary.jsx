import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, ChevronDown, ChevronRight } from "lucide-react";

const TERMS = [
  { term: "Anenergy", category: "Physics", definition: "Bearden's term for the energy of curved spacetime — the zero-point field energy accessible through asymmetric regauging of Maxwell's equations. Not 'negative energy' but rather energy flowing from the vacuum into the circuit." },
  { term: "Asymmetric Regauging", category: "Physics", definition: "The process of changing the gauge of a system (its potential energy) in an asymmetric way — allowing some of the added energy to be collected as useful work. The MEG exploits this principle." },
  { term: "Barium Titanate (BaTiO3)", category: "Components", definition: "A crystalline material with strong electro-optic and photorefractive properties. Used in the TRZ reactor as a phase-conjugate mirror. It can reverse the wavefront of incoming light, sending it exactly back along its original path." },
  { term: "Bedini Circuit", category: "Devices", definition: "A family of switching circuits designed by John Bedini that exploit monopolar back-EMF pulses to condition and charge batteries while producing longitudinal EM components. The BESC-1 is derived from this class of circuits." },
  { term: "Bearden, Thomas E.", category: "People", definition: "Lt. Col. Thomas E. Bearden (US Army, Ret.) — retired Army officer, defense analyst, and independent physicist who published extensively on scalar electromagnetics, vacuum energy, and bioelectromagnetics from 1975–2007. His books include Gravitobiology, Excalibur Briefing, and Fer-de-Lance." },
  { term: "Bifilar Coil", category: "Components", definition: "A coil wound with two wires side-by-side (or two strands of a single wire). Depending on how the two windings are connected, a bifilar coil can produce canceling or reinforcing magnetic fields, with interesting longitudinal EM effects when wound and connected in specific configurations." },
  { term: "Bioelectromagnetics", category: "Physics", definition: "The study of how electromagnetic fields interact with living organisms at the cellular, molecular, and systemic level. Bearden's bioelectromagnetics work focuses on phase-conjugate EM as a mechanism for biological effects observed in the Prioré device." },
  { term: "COP (Coefficient of Performance)", category: "Physics", definition: "The ratio of useful output energy to input energy from the operator. COP>1 means more output than the operator inputs — not a violation of thermodynamics if the extra energy comes from the environment (vacuum, heat reservoir). Heat pumps achieve COP of 3–5 via this mechanism." },
  { term: "Caduceus Winding", category: "Components", definition: "A specific coil winding pattern (also called a Smith coil) in which two conductors are wound in opposing helical spirals on the same core. Produces canceling magnetic fields with a net longitudinal EM output." },
  { term: "Cold Solder Joint", category: "Electronics", definition: "A solder connection that didn't flow properly during soldering — typically from insufficient heat or movement during cooling. Appears dull or grainy rather than shiny. Creates intermittent or high-resistance connections that cause unpredictable circuit behavior." },
  { term: "Continuity Test", category: "Electronics", definition: "Using a multimeter to check whether two points in a circuit are electrically connected. The meter beeps (or shows near-zero resistance) when the points are connected. Essential for verifying wiring before powering a circuit." },
  { term: "Crystal Oscillator", category: "Components", definition: "An electronic component that uses the mechanical resonance of a piezoelectric crystal to generate a precise electrical signal. Used for timing circuits where frequency stability is critical. Accuracy typically <100 parts per million." },
  { term: "Declassified", category: "Research", definition: "Government documents that were originally classified (restricted access) and have since been released to the public. Several key source documents on this platform are declassified US government reports." },
  { term: "Electrolytic Capacitor", category: "Components", definition: "A polarized capacitor (has a + and - terminal) with high capacitance in a small package. Used for power filtering and bulk energy storage. Must be installed with correct polarity — reverse installation causes failure or explosion." },
  { term: "Faraday Cage", category: "Components", definition: "An enclosure made of conductive material (copper mesh, aluminum) that shields its interior from external electric fields and electromagnetic radiation. Named after Michael Faraday. Used to isolate sensitive circuits from interference." },
  { term: "Ferrite Core", category: "Components", definition: "A ceramic magnetic material used as the core of inductors and transformers. Different ferrite 'mixes' have different permeability and frequency characteristics — always use the mix number specified in your BOM." },
  { term: "Flux (solder)", category: "Electronics", definition: "A chemical agent applied to solder joints to remove surface oxides from metal, allowing solder to flow and bond properly. Most solder wire has flux in its core. A flux pen provides additional flux for stubborn joints." },
  { term: "Foundations of Physics Letters", category: "Research", definition: "A peer-reviewed scientific journal published by Springer. The MEG paper (Anastasovski et al., 2001) documenting theoretical and experimental COP>1 results was published in this journal, with 15 co-authors from 12 institutions." },
  { term: "GFCI (Ground Fault Circuit Interrupter)", category: "Safety", definition: "A safety device that monitors current difference between hot and neutral conductors. Trips in <25ms when it detects current leaking to ground through a person. Required for all mains-voltage builds. Available as outlet ($15) or circuit breaker ($25)." },
  { term: "Gravitobiology", category: "Physics", definition: "Bearden's term for the study of how gravitational (spacetime curvature) changes directly affect biological organisms. Distinct from mechanical gravity effects — concerned with the direct coupling between the infolded EM structure of spacetime and biological EM systems." },
  { term: "Hall Effect Sensor", category: "Components", definition: "A semiconductor device that produces a voltage proportional to the magnetic field passing through it. Used in the MEG build to detect magnet position and trigger the switching circuit. Flat face of sensor must face the magnet pole." },
  { term: "Helmholtz Coil", category: "Components", definition: "A pair of circular coils placed coaxially with a specific separation distance (equal to their radius). Produces a highly uniform magnetic field in the region between them. Used in the Prioré system to create the rotating EM field." },
  { term: "Impedance Matching", category: "Electronics", definition: "The process of ensuring that the output impedance of one circuit stage matches the input impedance of the next. Maximum power transfer occurs when source and load impedances are equal. Mismatched impedances cause signal reflections and power loss." },
  { term: "Infolded EM", category: "Physics", definition: "Bearden's term for electromagnetic energy 'inside' the potentials — stored in the vector and scalar potential fields rather than in the conventional E and B fields. Not directly detectable with standard instruments but producible through specific circuit configurations." },
  { term: "Isolation Transformer", category: "Components", definition: "A transformer with a 1:1 turns ratio that passes AC voltage while galvanically isolating input from output. Breaks ground loops, prevents shock from circuits floating above chassis ground, and enables safe probing of live circuits." },
  { term: "LC Circuit", category: "Electronics", definition: "A circuit combining an inductor (L) and capacitor (C) that resonates at a specific frequency. The resonant frequency f = 1/(2π√LC). Forms the basis of oscillators, filters, and tuned circuits." },
  { term: "Longitudinal EM Wave", category: "Physics", definition: "An electromagnetic wave in which the field oscillation is parallel to the direction of propagation — like a sound wave. Conventional EM theory excludes these from vacuum propagation. Bearden's work posits that phase-conjugation produces longitudinal components in vacuum." },
  { term: "MCCS (Master Control Computer System)", category: "Physics", definition: "Bearden's model for the body's electromagnetic master regulatory system — proposed to operate via scalar/longitudinal EM signals that control cellular processes, including telomere length maintenance and DNA repair." },
  { term: "MEG (Motionless Electromagnetic Generator)", category: "Devices", definition: "A device consisting of a permanent magnet, bifilar coils, and a switching circuit, designed to collect energy from the vacuum via asymmetric regauging. Published in Foundations of Physics Letters (2001) by Bearden et al." },
  { term: "Mu-Metal", category: "Components", definition: "A nickel-iron alloy with very high magnetic permeability — typically 20,000–400,000µ. Used to shield sensitive components from magnetic fields by providing a low-resistance path that routes field lines around the shielded area." },
  { term: "NTC Thermistor", category: "Components", definition: "A resistor whose resistance decreases as temperature increases (Negative Temperature Coefficient). Used as inrush current limiters — high resistance when cold limits startup surge, then resistance drops as device warms up." },
  { term: "ONR (Office of Naval Research)", category: "Research", definition: "US Navy research organization. The ONR London Branch Report R-5-78 (J.B. Bateman, 1978) is a key primary source document on this platform — a formal US government assessment of the Prioré electromagnetic treatment device." },
  { term: "Oscilloscope", category: "Electronics", definition: "An instrument that displays electrical signals as a graph of voltage over time. Shows you the shape (waveform) of a signal — whether it's a clean sine wave, a square wave, or a noisy mess. Essential for verifying frequency and waveform in any RF or switching circuit." },
  { term: "Phase Conjugation", category: "Physics", definition: "An optical process that reverses the wavefront of an electromagnetic wave — effectively reversing the phase of every frequency component. The resulting wave travels backward along exactly the original path. BaTiO3 is a natural phase-conjugate mirror at optical frequencies." },
  { term: "Phase Shifter", category: "Components", definition: "A circuit or component that delays an electrical signal by a specified angle (in degrees) relative to a reference. In the G-Com build, the phase shifter is adjusted to produce the phase-conjugate relationship between transmit and receive antenna." },
  { term: "Piezoelectric", category: "Components", definition: "A property of certain materials (quartz, BaTiO3, PZT) that produce voltage when mechanically stressed, and deform when voltage is applied. Crystal oscillators use piezoelectric quartz. TRZ build uses PZT transducers to acoustically modulate the BaTiO3 crystal." },
  { term: "Plasma Tube", category: "Components", definition: "A gas-filled tube that glows when RF energy is applied — like a neon lamp but configured for high-frequency EM emission. Used in the Prioré device to produce the rotating EM field described in French patent 1,342,772." },
  { term: "Prior Art", category: "Patents", definition: "Existing knowledge (patents, papers, devices) that predates a new invention. Prior art can prevent a patent from being granted if it demonstrates that the claimed invention was already known or obvious. The platform's Prior Art Archive documents prior art for scalar EM devices." },
  { term: "Prioré Device", category: "Devices", definition: "An electromagnetic treatment device invented by Antoine Prioré in France. Produced rotating magnetic fields combined with RF plasma emission. ONR London Branch Report R-5-78 (1978) documents US government assessment of its experimental results in animal studies." },
  { term: "Provisional Patent Application (PPA)", category: "Patents", definition: "A simplified patent filing with the USPTO that establishes a priority date for an invention. Valid for 12 months, after which a full patent application must be filed. Does not require claims or formal drawings. Cost: $320 government fee." },
  { term: "Psychoenergetics", category: "Physics", definition: "Bearden's term for the study of human consciousness as an electromagnetic phenomenon — the coupling between the infolded EM structure of spacetime and the brain's EM fields. Documented in his Psychoenergetics briefings." },
  { term: "Regauging", category: "Physics", definition: "In classical field theory, changing the gauge potential (adding a gradient to the vector potential or a constant to the scalar potential) without changing observable physics. Bearden argues that asymmetric regauging can be used to extract energy from the vacuum." },
  { term: "RF (Radio Frequency)", category: "Electronics", definition: "Electromagnetic signals in the frequency range of 20kHz to 300GHz. RF circuits require special handling — impedance matching, proper grounding, shielded cables — because at high frequencies, regular wire behaves as an antenna." },
  { term: "Scalar Potential", category: "Physics", definition: "The electrostatic potential field (voltage) at a point in space, represented by the symbol φ (phi). Conventional EM treats this as a mathematical convenience. Bearden argues it has physical structure — containing bidirectional EM wave pairs that cancel in the vector sense but retain real energy." },
  { term: "Scalar Wave", category: "Physics", definition: "Bearden's term for a wave in the scalar potential field — produced by specific configurations of paired, phase-conjugate EM waves. Not to be confused with scalar quantities in mathematics. The existence and nature of scalar waves in vacuum is the subject of ongoing scientific debate." },
  { term: "SWR (Standing Wave Ratio)", category: "Electronics", definition: "A measure of impedance matching in RF systems. SWR of 1:1 = perfect match, all power delivered to load. SWR of 2:1 = 11% power reflected. Above 3:1, reflected power becomes significant enough to damage transmitter stages." },
  { term: "Time-Reversal Zone (TRZ)", category: "Physics", definition: "A region of space in which physical processes appear to run backward — time-reversed. Documented at 73 sigma above background at China Lake Naval Weapons Center. The TRZ reactor is designed to produce such a zone via phase-conjugation of EM fields." },
  { term: "Toroid", category: "Components", definition: "A donut-shaped coil core. When wire is wound on a toroid, the magnetic field is almost entirely contained inside the core — very little leaks out. This makes toroidal inductors self-shielding and ideal for high-frequency power conversion." },
  { term: "Variac", category: "Safety", definition: "A variable autotransformer — allows you to smoothly vary AC mains voltage from 0V to full voltage. Essential for safely bringing mains-powered builds (Prioré) up to operating voltage gradually. Never connect a new mains-powered build directly to full voltage on first power-on." },
  { term: "Vacuum Energy / ZPE", category: "Physics", definition: "The energy of the quantum vacuum — the lowest possible energy state of a quantum field. Not empty space but a seething sea of virtual particle-antiparticle pairs. The Casimir effect demonstrates it is real and measurable. Bearden's framework proposes mechanisms for macroscopic extraction." },
  { term: "Winding Direction", category: "Electronics", definition: "The rotational direction in which wire is wound on a coil core — either clockwise (CW) or counterclockwise (CCW) when viewed from a specified end. Winding direction determines the polarity of the magnetic field produced. Always follow the direction specified in your build plan exactly." },
];

const CATEGORIES = ["All", ...Array.from(new Set(TERMS.map(t => t.category))).sort()];

export default function Glossary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = TERMS.filter(t => {
    const matchCat = category === "All" || t.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white">
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-bold text-base flex items-center gap-2">
            <BookOpen size={15} className="text-purple-400" /> Research Glossary
          </h1>
          <p className="text-gray-500 text-xs">{TERMS.length} terms across {CATEGORIES.length - 1} categories</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-6">
        {/* Search + filter */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search terms or definitions…"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-8 pr-4 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-600" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-600">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <p className="text-gray-600 text-xs mb-4">{filtered.length} results</p>

        <div className="space-y-2">
          {filtered.map((term, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/40 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-sm">{term.term}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-500">{term.category}</span>
                  </div>
                </div>
                {expanded === i ? <ChevronDown size={14} className="text-gray-500 flex-shrink-0" /> : <ChevronRight size={14} className="text-gray-500 flex-shrink-0" />}
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 border-t border-gray-800 pt-3">
                  <p className="text-gray-300 text-sm leading-relaxed">{term.definition}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <BookOpen size={32} className="mx-auto mb-3" />
            <p>No terms match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}