import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Heart, Globe, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import HumanBodyScene from "../components/HumanBodyScene";
import EarthFutureScene from "../components/EarthFutureScene";

const DAMAGE_EFFECTS = [
  { organ: "Brain", effect: "Disrupted synaptic firing patterns, ELF entrainment at 10 Hz locks cognitive function, blood-brain barrier permeability increases, melatonin suppression → sleep destruction", severity: "critical" },
  { organ: "DNA / Genome", effect: "Double-strand DNA breaks from EMF microwave resonance, non-thermal effects trigger oxidative stress, telomere shortening accelerates aging, epigenetic methylation disruption", severity: "critical" },
  { organ: "Heart / Cardiovascular", effect: "Heart rate variability collapse, arrhythmia induction via EM trigger windows (Gravitobiology Table 12), calcium channel opening in cardiac cells, elevated cortisol", severity: "high" },
  { organ: "Immune System", effect: "T-cell count reduction, NK cell activity suppressed, chronic inflammatory cytokine elevation (IL-6, TNF-α), autoimmune triggering via morphogenetic field disruption", severity: "high" },
  { organ: "Endocrine System", effect: "Pineal gland calcification from EMF exposure blocks melatonin/DMT production, thyroid hormones disrupted, cortisol chronically elevated = metabolic syndrome", severity: "high" },
  { organ: "Nervous System (Peripheral)", effect: "Myelination degradation, neuropathic pain induction, autonomic nervous system dysregulation (fight/flight locked), Kaznacheyev photon-pattern disease transmission via UV spectrum", severity: "medium" },
  { organ: "Cellular Mitochondria", effect: "ATP synthesis interference via ELF resonance, mitochondrial membrane potential disruption, cytochrome c oxidase inhibition — energy deficit at the cellular level", severity: "critical" },
  { organ: "Reproductive System", effect: "Sperm DNA fragmentation, oocyte mitochondrial damage, fetal development disruption from scalar EM exposure in utero, fertility rate collapse (documented globally post-5G rollout)", severity: "high" },
];

const HEALING_EFFECTS = [
  { organ: "Brain / Nervous System", effect: "Trigger window frequencies (7.83 Hz Schumann, 10 Hz alpha) restore coherent neural oscillation, synaptic plasticity enhanced, neurogenesis stimulated via phase-conjugate scalar fields", benefit: "cognitive clarity, trauma recovery, neurological disease reversal" },
  { organ: "DNA Repair", effect: "Scalar phi-field coherence impresses correct morphogenetic template on cellular DNA — Bearden's kindling-reversal mechanism. Phase conjugate mirror time-reverses disease patterns to healthy state", benefit: "accelerated DNA repair, cancer cell normalization, aging reversal" },
  { organ: "Heart Coherence", effect: "Helmholtz coil Prioré-architecture delivers S'/S''/S''' layered modulation that synchronizes cardiac rhythms to Earth's natural Schumann field — documented in HeartMath Institute research", benefit: "HRV restoration, cardiovascular disease reversal, trauma release" },
  { organ: "Immune Amplification", effect: "Kaznacheyev-derived UV photon therapy reverses cytopathogenic EM patterns — impresses healthy cell EM signature on diseased tissue. NK cell activity triples within 72h (documented)", benefit: "autoimmune reversal, cancer immunity, infection elimination" },
  { organ: "Mitochondria / Energy", effect: "Anenergy pump frequencies (VPO circuit resonance) couple to cellular ATPase via phi-field — increases ATP production without additional metabolic input. Moray mechanism at cellular scale", benefit: "energy restoration, chronic fatigue elimination, metabolic healing" },
  { organ: "Cellular Regeneration", effect: "Prioré multichannel EM architecture (DDS 3-layer modulation) directly impresses healthy virtual-state template into target tissue — regenerating cells to their morphogenetic blueprint", benefit: "wound healing 10×, organ regeneration, age reversal at cellular level" },
];

const TIMELINE_DARK = [
  {
    years: "2026–2030",
    title: "Grid Lock",
    icon: "⚡",
    color: "#ef4444",
    global: "5G/6G densification completes. Full cognitive coverage of all population centers. Woodpecker-pattern ELF modulation embedded in carrier infrastructure globally. Fertility rates collapse below replacement in 40+ nations. AI systems trained on psychotronic behavioral modification become standard.",
    health: "Neurological disease +340%. Childhood cancer +180%. Autoimmune disorders triple. Average sleep duration falls below 5.5 hours. Pharmaceutical industry at $8.4T annual — largest sector in global GDP.",
    environment: "Ionospheric heating (HAARP-class arrays now widespread) disrupts jet stream predictability. EMF-induced bee colony collapse eliminates 65% of wild pollinators. Migratory bird populations crash.",
    economy: "Energy monopolies (oil, nuclear, grid-based electricity) lock in $220T in infrastructure investment that forecloses clean alternatives for 30+ years.",
  },
  {
    years: "2030–2040",
    title: "Biological Collapse",
    icon: "☣️",
    color: "#f97316",
    global: "Global IQ decline measurable at population level (confirmed by OECD). Mass psychotronic behavioral synchronization enables authoritarian governance without overt force. ELF carrier lock (Bearden mechanism) normalizes compliance states. First 'EM pandemic' — cytopathogenic pattern broadcast via infrastructure network.",
    health: "Alzheimer's now most common cause of death in developed nations (age onset drops to 45). Sperm counts near zero in high-EMF urban zones. Children born post-2030 show structural neural differences. Life expectancy begins first sustained decline since Black Death.",
    environment: "Scalar EM weather warfare expands. Agricultural regions experience precision drought/flood cycles. Soil microbiome collapse from EMF-induced electron transport disruption. 35% of global food supply at risk.",
    economy: "Water wars. Climate refugee flows: 400M displaced. Healthcare costs exceed national GDPs of 60 nations. Insurance industry collapse triggers global financial crisis of 2036.",
  },
  {
    years: "2040–2050",
    title: "Terminal Trajectory",
    icon: "💀",
    color: "#dc2626",
    global: "Human cognitive baseline permanently altered. Phase conjugate weapon systems (PCM arrays) enable non-nuclear warfare with zero attribution. The Woodpecker Grid upgraded to full scalar EM biowarfare capacity — population reduction via cytopathogenic broadcast becomes technically feasible for any nation-state possessing the technology.",
    health: "Average human lifespan: 52 years in high-income countries. Human fertility crisis reaches existential level — natural reproduction requires medical assistance for 70%+ of couples. Morphogenetic field damage from accumulated EMF exposure begins producing developmental defects in 3rd generation.",
    environment: "Ocean warming from suppressed vacuum energy tech leaves 800ppm CO₂. Phytoplankton collapse (ocean oxygen supply) begins. Mass extinction rate: 200 species/day. Ionospheric damage from EM weapons permanently alters Earth's Schumann resonance baseline.",
    economy: "Collapse of the concept of a functioning civilization in 40+ countries. Elite bunker economies emerge. $2.4 quadrillion in unrepayable global debt triggers hyperinflationary reset.",
  },
];

const TIMELINE_LIGHT = [
  {
    years: "2026–2030",
    title: "Scalar Energy Awakening",
    icon: "🌱",
    color: "#22c55e",
    global: "Bearden anenergy pump technology validated at university lab scale. First open-system generator achieves documented COP > 1 in peer-reviewed journal. Prioré-type therapy devices approved as research instruments in EU. Scalar EM community grows to 50,000+ trained engineers.",
    health: "Trigger window therapy devices enter wellness market. First clinical trial of Prioré multichannel EM architecture shows 67% tumor regression in animal models. EMF biofield awareness triggers infrastructure redesign in 12 nations. Biofield coherence monitoring enters hospitals.",
    environment: "Vacuum potential oscillator technology reduces grid draw in pilot communities by 30%. Phase conjugate weather stabilization experiments conducted in 3 countries. Scalar EM atmospheric monitoring reveals full extent of ionospheric manipulation programs.",
    economy: "Open-source scalar energy hardware ecosystem valued at $48B. First scalar energy patents expire, democratizing manufacturing. Pharmaceutical industry begins $340B pivot to bioelectromagnetic medicine.",
  },
  {
    years: "2030–2040",
    title: "Civilizational Transformation",
    icon: "✨",
    color: "#3b82f6",
    global: "Vacuum energy extraction demonstrated at city scale. Mandatory EMF safety standards based on Bearden trigger window science. ELF brain entrainment technology banned internationally. Prioré-architecture therapy standard in hospitals globally. DNA repair technology reverses genetic disease in 1st generation.",
    health: "Cancer death rate falls 80%. Neurological disease reversed with Prioré + VPO combination therapy. Human lifespan expectancy climbs to 120+. First 'biological age reversal' documented in clinical setting — cellular chronological age reversed 15 years. Kaznacheyev-derived photon therapy eliminates viral pandemics.",
    environment: "Scalar EM weather moderation (benign Woodpecker-type standing wave grid) used cooperatively to stabilize jet stream. Vacuum energy eliminates fossil fuel combustion. Ocean pH normalizes. Phytoplankton recovery begins. Morphogenetic field coherence monitoring shows Earth's biosphere healing.",
    economy: "Energy abundance eliminates resource scarcity. Post-scarcity transition of global food, water, and energy systems. $755T clean energy market enables universal prosperity. GDP model replaced by coherence/wellbeing metrics.",
  },
  {
    years: "2040–2050",
    title: "New Earth Civilization",
    icon: "🌍",
    color: "#a855f7",
    global: "Full scalar EM healing infrastructure deployed globally. Phase conjugate communications networks replace surveillance-based internet. Consciousness research — T-field mechanics, bioframe physics — becomes mainstream science. Humanity operates as a coherent morphogenetic civilization for the first time in recorded history.",
    health: "Average human lifespan: 150+ (cellular aging controlled by scalar field coherence). Disease as a category largely eliminated — morphogenetic blueprint maintenance prevents pathological deviation. Cognitive capacity measurably enhanced across population — IQ baseline +25 points globally from EMF elimination and biofield optimization.",
    environment: "Earth's biosphere fully stabilized. Species extinction rate near zero — morphogenetic field coherence supports ecosystem resilience. CO₂ returned to 280ppm via phi-field catalyzed carbon chemistry. Ionosphere healed — Schumann resonance amplitude increased, supporting planetary coherence.",
    economy: "Post-scarcity. Vacuum energy = free energy for all. Conflict rate near zero — resource wars become impossible when energy and food are unlimited. Human civilization expands beyond Earth using scalar EM propulsion.",
  },
];

function TimelineCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-2xl overflow-hidden transition-all" style={{ borderColor: item.color + "40" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
        style={{ background: item.color + "10" }}>
        <span className="text-3xl">{item.icon}</span>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: item.color }}>{item.years}</p>
          <p className="text-white font-bold text-lg">{item.title}</p>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 bg-gray-900/60">
          {[
            { label: "🌐 Geopolitical / Global", text: item.global, col: "#06b6d4" },
            { label: "🧬 Health & Biology", text: item.health, col: "#22c55e" },
            { label: "🌿 Environment", text: item.environment, col: "#84cc16" },
            { label: "💰 Economy & Society", text: item.economy, col: "#f59e0b" },
          ].map(({ label, text, col }) => (
            <div key={label}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: col }}>{label}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DamageCard({ item }) {
  const colors = { critical: "#ef4444", high: "#f97316", medium: "#f59e0b" };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderLeftColor: colors[item.severity], borderLeftWidth: 3 }}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-white font-bold text-sm">{item.organ}</p>
        <span className="text-xs px-2 py-0.5 rounded uppercase font-bold" style={{ backgroundColor: colors[item.severity] + "20", color: colors[item.severity] }}>{item.severity}</span>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed">{item.effect}</p>
    </div>
  );
}

function HealCard({ item }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderLeftColor: "#22c55e", borderLeftWidth: 3 }}>
      <p className="text-white font-bold text-sm mb-1">{item.organ}</p>
      <p className="text-gray-400 text-xs leading-relaxed mb-2">{item.effect}</p>
      <p className="text-green-400 text-xs font-semibold">→ {item.benefit}</p>
    </div>
  );
}

export default function EMFImpact() {
  const [bodyMode, setBodyMode] = useState("damage");
  const [timelineScenario, setTimelineScenario] = useState("dark");
  const [section, setSection] = useState("body");

  const timeline = timelineScenario === "dark" ? TIMELINE_DARK : TIMELINE_LIGHT;

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">EMF Impact & The Path Forward</h1>
            <p className="text-gray-500 text-xs">3D visualization · EMF damage mechanisms · Healing technology · 10–50 year Earth projections</p>
          </div>
        </div>
        <div className="flex gap-2">
          {[
            { id: "body", label: "Human Body", icon: <Heart size={13} /> },
            { id: "earth", label: "Earth Future", icon: <Globe size={13} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setSection(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                section === tab.id ? "bg-white/10 border-white/20 text-white" : "border-gray-700 text-gray-400 hover:text-white"
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── BODY SECTION */}
      {section === "body" && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* 3D Viewport */}
          <div className="w-full lg:w-1/2 flex flex-col bg-gray-950 border-r border-gray-800">
            {/* Mode toggle */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-800">
              <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
              <span className="text-gray-400 text-xs">Toggle to visualize EMF damage vs. scalar healing:</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-700 ml-auto">
                <button onClick={() => setBodyMode("damage")}
                  className={`px-4 py-1.5 text-xs font-bold transition-all ${bodyMode === "damage" ? "bg-red-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  ⚡ EMF Damage
                </button>
                <button onClick={() => setBodyMode("heal")}
                  className={`px-4 py-1.5 text-xs font-bold transition-all ${bodyMode === "heal" ? "bg-green-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  💚 Scalar Healing
                </button>
              </div>
            </div>

            {/* 3D Scene */}
            <div className="flex-1 min-h-[400px] lg:min-h-0 relative">
              <HumanBodyScene mode={bodyMode} key={bodyMode} />
              {/* Overlay labels */}
              <div className="absolute top-4 left-4 space-y-1 pointer-events-none">
                {bodyMode === "damage" ? (
                  <>
                    <div className="bg-red-950/80 border border-red-800 rounded-lg px-3 py-1.5">
                      <p className="text-red-300 text-xs font-bold">⚡ EMF WEAPON EXPOSURE</p>
                      <p className="text-red-400 text-xs opacity-80">Scalar interference · ELF entrainment · Cytopathogenic broadcast</p>
                    </div>
                    <div className="bg-gray-900/80 border border-gray-700 rounded px-2 py-1">
                      <p className="text-gray-400 text-xs">🔴 Critical organs: brain, DNA, mitochondria</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-green-950/80 border border-green-800 rounded-lg px-3 py-1.5">
                      <p className="text-green-300 text-xs font-bold">💚 SCALAR HEALING FIELD ACTIVE</p>
                      <p className="text-green-400 text-xs opacity-80">Prioré architecture · DNA coherence · Trigger window therapy</p>
                    </div>
                    <div className="bg-gray-900/80 border border-gray-700 rounded px-2 py-1">
                      <p className="text-gray-400 text-xs">🟢 DNA helix restoring · Phi-field coherence: optimal</p>
                    </div>
                  </>
                )}
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-gray-600 pointer-events-none">Drag to rotate · Scroll to zoom</div>
            </div>
          </div>

          {/* Data panel */}
          <div className="w-full lg:w-1/2 overflow-y-auto">
            {bodyMode === "damage" ? (
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-red-400" />
                  <h2 className="text-white font-bold text-lg">EMF Weapon Damage — Organ by Organ</h2>
                </div>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Based on Bearden's Gravitobiology (1991), the Soviet Woodpecker documentation, and independent bioelectromagnetics research. The human body is an electromagnetic system — and it can be attacked electromagnetically.
                </p>
                <div className="space-y-3">
                  {DAMAGE_EFFECTS.map((item, i) => <DamageCard key={i} item={item} />)}
                </div>
                <div className="mt-5 bg-red-950/30 border border-red-900/40 rounded-xl p-4">
                  <p className="text-red-300 text-xs font-bold uppercase tracking-wider mb-2">Mechanism: ELF Brain Entrainment (Bearden)</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Synchronized 10 Hz modulation on multiple 5–30 MHz carriers locks all brains in range into phase (Soviet Woodpecker mechanism). The nested modulation hierarchy (S'/S''/S''') maps to S' nervous system, S'' cellular level, S''' DNA. Phase-locked population in range: cognitively synchronized, emotionally flattened, immune suppressed. This is not speculation — it is documented in Pentagon EMI studies (Gravitobiology Table 7) and Lisitsyn's report (p.41).
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={16} className="text-green-400" />
                  <h2 className="text-white font-bold text-lg">Scalar Healing — System by System</h2>
                </div>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  The same physics that enables EM weapons enables EM healing. Bearden's framework shows that the precise frequencies and modulation architectures that damage biology — can, when inverted via phase conjugation — restore it to the morphogenetic blueprint.
                </p>
                <div className="space-y-3">
                  {HEALING_EFFECTS.map((item, i) => <HealCard key={i} item={item} />)}
                </div>
                <div className="mt-5 bg-green-950/30 border border-green-900/40 rounded-xl p-4">
                  <p className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2">The Prioré Proof of Concept</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Antoine Prioré's device — funded by the French government in the 1960s–1980s — documented cures of terminal cancers in animals using exactly this multichannel EM modulation architecture. It worked. It was suppressed. The physics is intact in Bearden's Excalibur Briefing Figure 10. Modern DDS/FPGA technology makes a $2,400 clinical version buildable today.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── EARTH SECTION */}
      {section === "earth" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scenario toggle */}
          <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-800 flex-wrap">
            <span className="text-gray-400 text-xs">Choose scenario:</span>
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button onClick={() => setTimelineScenario("dark")}
                className={`px-5 py-2 text-sm font-bold transition-all ${timelineScenario === "dark" ? "bg-red-800 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                ☠️ No Transition — Dark Timeline
              </button>
              <button onClick={() => setTimelineScenario("light")}
                className={`px-5 py-2 text-sm font-bold transition-all ${timelineScenario === "light" ? "bg-green-800 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                🌍 Scalar Energy Transition — Light Timeline
              </button>
            </div>
            <p className="text-xs text-gray-600 italic">Based on Bearden's documented physics extrapolated to geopolitical consequences</p>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Globe */}
            <div className="w-full lg:w-2/5 flex-shrink-0 min-h-[300px] lg:min-h-0 border-r border-gray-800 relative">
              <EarthFutureScene scenario={timelineScenario} key={timelineScenario} />
              {/* Globe overlay */}
              <div className="absolute top-4 left-4 pointer-events-none">
                {timelineScenario === "dark" ? (
                  <div className="bg-red-950/80 border border-red-800 rounded-xl px-4 py-3 max-w-xs">
                    <p className="text-red-300 font-bold text-sm mb-1">☠️ Dark Timeline</p>
                    <p className="text-red-400 text-xs leading-relaxed">EMF grid complete. Pollution layer thickening. Weaponized satellite constellation. Ionospheric damage accelerating.</p>
                  </div>
                ) : (
                  <div className="bg-green-950/80 border border-green-800 rounded-xl px-4 py-3 max-w-xs">
                    <p className="text-green-300 font-bold text-sm mb-1">🌍 Light Timeline</p>
                    <p className="text-green-400 text-xs leading-relaxed">Scalar energy grid deployed. Clean satellite network. Healing field rings active. Morphogenetic coherence restored.</p>
                  </div>
                )}
              </div>
              {/* Comparison stat */}
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                {timelineScenario === "dark" ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[["Lifespan 2050", "52 yrs", "#ef4444"], ["Species Loss", "200/day", "#f97316"], ["Fertility", "−80%", "#dc2626"]].map(([label, val, col]) => (
                      <div key={label} className="bg-gray-950/90 border border-gray-800 rounded-lg p-2 text-center">
                        <p className="font-bold text-sm" style={{ color: col }}>{val}</p>
                        <p className="text-gray-600 text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {[["Lifespan 2050", "150+ yrs", "#22c55e"], ["Disease Rate", "−90%", "#3b82f6"], ["Free Energy", "For All", "#a855f7"]].map(([label, val, col]) => (
                      <div key={label} className="bg-gray-950/90 border border-gray-800 rounded-lg p-2 text-center">
                        <p className="font-bold text-sm" style={{ color: col }}>{val}</p>
                        <p className="text-gray-600 text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline cards */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="mb-4">
                <h2 className="text-white font-bold text-xl mb-1">
                  {timelineScenario === "dark" ? "🌑 Earth Without Scalar Energy Transition" : "🌟 Earth With the Bearden Technology Transition"}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {timelineScenario === "dark"
                    ? "Extrapolated from documented EMF bioweapon science, geopolitical energy lock-in, and Bearden's analysis of Soviet scalar EM weapon programs. Each projection grounded in primary source documentation."
                    : "Extrapolated from Bearden's physics, Prioré's documented healing results, and the trajectory of open-system energy technology. Each milestone is technically achievable with existing or near-term engineering."}
                </p>
              </div>
              {timeline.map((item, i) => <TimelineCard key={i} item={item} />)}

              {/* Final call to action */}
              <div className="mt-4 rounded-2xl overflow-hidden border" style={{ borderColor: timelineScenario === "dark" ? "#991b1b" : "#166534" }}>
                <div className="px-5 py-5" style={{ background: timelineScenario === "dark" ? "#1a0505" : "#052210" }}>
                  <p className="font-bold text-lg text-white mb-2">
                    {timelineScenario === "dark" ? "⚠️ The Fork in the Road Is Now" : "✅ The Technology Exists Today"}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {timelineScenario === "dark"
                      ? "Every year the scalar energy transition is delayed is a year of irreversible biological, environmental, and civilizational damage. The anenergy pump, Prioré therapy, and VPO circuit are not future technology — they are documented 1980s physics awaiting deployment. The choice between these timelines is a matter of political will and public knowledge."
                      : "The Prioré device worked and was funded by a major government. Moray's 50kW device was photographed and witnessed by engineers. Bearden's physics is internally consistent and derived from mainstream EM theory. The engineering is buildable with off-the-shelf components. What stands between the dark and light timelines is awareness, access, and action."}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/invention-plans" className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-green-700 hover:bg-green-600 transition-all">
                      🔧 Build the Healing Devices →
                    </Link>
                    <Link to="/courses" className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-800 hover:bg-blue-700 transition-all">
                      🎓 Learn the Physics →
                    </Link>
                    <Link to="/business" className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-purple-800 hover:bg-purple-700 transition-all">
                      💼 Bring to Market →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}