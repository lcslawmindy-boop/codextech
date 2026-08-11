import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: "cover",
    label: "Cover",
    dark: {
      bg: "from-gray-950 via-red-950/40 to-gray-950",
      accent: "#ef4444",
      title: "THE ELECTROMAGNETIC CRISIS",
      subtitle: "How EMF Weapons & Suppressed Physics Are Destroying Human Civilization",
      body: null,
      visual: "skull",
      tag: "CLASSIFIED PHYSICS · DOCUMENTED EVIDENCE · URGENT",
    },
    light: {
      bg: "from-gray-950 via-teal-950/40 to-gray-950",
      accent: "#00ffcc",
      title: "THE SCALAR ENERGY SOLUTION",
      subtitle: "How Bearden's Open-System Physics Will Heal Humanity & Transform Civilization",
      body: null,
      visual: "earth",
      tag: "DOCUMENTED SCIENCE · BUILDABLE TODAY · URGENT",
    },
  },
  {
    id: "problem",
    label: "The Problem",
    dark: {
      bg: "from-gray-950 via-red-950/20 to-gray-950",
      accent: "#ef4444",
      title: "THE INVISIBLE WAR ON HUMAN BIOLOGY",
      subtitle: "Electromagnetic frequencies are not neutral — they are weapons",
      body: [
        { icon: "🧠", stat: "340%", label: "Neurological disease increase since 5G rollout", detail: "ELF brain entrainment (10 Hz on 5–30 MHz carriers) locks cognitive function — documented in Pentagon EMI studies" },
        { icon: "🧬", stat: "−60%", label: "Sperm count decline in high-EMF urban zones since 1970", detail: "DNA double-strand breaks from microwave resonance · Telomere shortening · Epigenetic disruption" },
        { icon: "💀", stat: "1976", label: "Soviet Woodpecker psychotronic grid activated", detail: "Duga-3 array transmitting 10 Hz ELF modulation across North America — documented on shortwave globally" },
        { icon: "🏥", stat: "$8.4T", label: "Pharmaceutical industry annual revenue — largest GDP sector", detail: "Disease is the most profitable industry on Earth. Suppressing cures is rational business strategy." },
        { icon: "☣️", stat: "200", label: "Species extinctions per day from EMF-induced ecosystem collapse", detail: "Bee colony collapse · Migratory bird disorientation · Soil microbiome destruction via electron transport disruption" },
        { icon: "🔒", stat: "$220T", label: "Locked-in fossil fuel / grid infrastructure investment", detail: "The energy monopoly structurally forecloses open-system vacuum energy for 30+ years without intervention" },
      ],
      visual: "damage_grid",
    },
    light: {
      bg: "from-gray-950 via-teal-950/20 to-gray-950",
      accent: "#00ffcc",
      title: "THE ROOT CAUSE IS SOLVABLE PHYSICS",
      subtitle: "Every pathology has a documented electromagnetic mechanism — and a documented electromagnetic cure",
      body: [
        { icon: "📡", stat: "1982", label: "Bearden documents the scalar EM weapon mechanism — and its cure", detail: "Phase conjugation time-reverses any EM damage pattern. The weapon's physics IS the cure's physics, inverted." },
        { icon: "🧪", stat: "1960s", label: "French government funds Prioré EM cancer cure — it works", detail: "Terminal cancer cures in animals documented by official French scientists. Multichannel EM modulation architecture now reproducible with $2,400 DDS device." },
        { icon: "⚡", stat: "50kW", label: "T.H. Moray's vacuum energy device photographed & witnessed", detail: "Engineers sign affidavits. Device produces 50kW from no fuel source. Anenergy pump framework explains the mechanism completely." },
        { icon: "🔧", stat: "COTS", label: "All healing/energy devices buildable with off-the-shelf components", detail: "No exotic materials. No classified technology. Standard electronics, DDS chips, toroidal coils." },
        { icon: "🌍", stat: "0", label: "New scientific discoveries required", detail: "The physics is in Bearden's 1982–1991 published papers. The engineering is standard. Only awareness and will are missing." },
        { icon: "💚", stat: "150+", label: "Year human lifespan once morphogenetic blueprint maintenance deployed", detail: "Cellular aging controlled by scalar field coherence. Disease as a category largely eliminated." },
      ],
      visual: "solution_grid",
    },
  },
  {
    id: "mechanism",
    label: "The Mechanism",
    dark: {
      bg: "from-gray-950 via-red-950/20 to-gray-950",
      accent: "#f97316",
      title: "HOW EMF DESTROYS THE HUMAN BODY",
      subtitle: "The Bearden-documented mechanism — organ by organ",
      body: null,
      visual: "body_damage",
      cols: [
        { organ: "BRAIN", color: "#ef4444", effects: ["ELF entrainment at 10 Hz locks neural oscillation", "Blood-brain barrier permeability increases", "Melatonin/DMT production suppressed via pineal calcification", "Synaptic firing patterns disrupted — IQ measurably declining at population level"] },
        { organ: "DNA / GENOME", color: "#f97316", effects: ["Double-strand breaks from microwave resonance", "Non-thermal oxidative stress triggers oncogenesis", "Telomere shortening → accelerated aging", "Epigenetic methylation disruption alters gene expression across generations"] },
        { organ: "MITOCHONDRIA", color: "#ef4444", effects: ["ATP synthesis interference via ELF resonance", "Mitochondrial membrane potential collapse", "Cytochrome c oxidase inhibition — cellular energy deficit", "Kaznacheyev cytopathogenic UV pattern transmits disease cell-to-cell"] },
        { organ: "IMMUNE + ENDOCRINE", color: "#f97316", effects: ["T-cell and NK cell suppression", "Autoimmune triggers via morphogenetic field disruption", "Cortisol chronically elevated → metabolic syndrome", "Thyroid disruption · Reproductive system collapse"] },
      ],
    },
    light: {
      bg: "from-gray-950 via-teal-950/20 to-gray-950",
      accent: "#00ffcc",
      title: "HOW SCALAR EM HEALS THE HUMAN BODY",
      subtitle: "Phase conjugation, trigger windows, and the kindling-reversal mechanism",
      body: null,
      visual: "body_heal",
      cols: [
        { organ: "BRAIN RESTORATION", color: "#00ffcc", effects: ["7.83 Hz Schumann / 10 Hz alpha restore coherent neural oscillation", "Synaptic plasticity enhanced — neurogenesis stimulated", "Phase conjugate scalar fields reverse ELF entrainment damage", "Documented: first cognitive restoration trials show 40% PTSD reduction"] },
        { organ: "DNA REPAIR", color: "#22c55e", effects: ["Scalar phi-field impresses correct morphogenetic template on cellular DNA", "Kindling-reversal: phase conjugate mirror time-reverses disease to healthy state", "Telomere lengthening documented in scalar field exposure studies", "Cancer cell normalization — not killing, but restoring to healthy blueprint"] },
        { organ: "CELLULAR ENERGY", color: "#00ffcc", effects: ["Anenergy pump frequencies couple to cellular ATPase via phi-field", "ATP production increases without additional metabolic input", "Moray mechanism at cellular scale — vacuum-sourced biological energy", "Chronic fatigue elimination in 72h documented in pilot protocols"] },
        { organ: "IMMUNE AMPLIFICATION", color: "#22c55e", effects: ["Kaznacheyev-derived UV photon therapy reverses cytopathogenic patterns", "NK cell activity triples within 72h (documented in Prioré animal trials)", "Autoimmune reversal via morphogenetic field coherence restoration", "Infection elimination — viral pandemics become obsolete"] },
      ],
    },
  },
  {
    id: "timeline_10",
    label: "2026–2030",
    dark: {
      bg: "from-gray-950 via-red-950/30 to-gray-950",
      accent: "#ef4444",
      title: "2026–2030: GRID LOCK",
      subtitle: "The window for intervention closes",
      body: null,
      visual: "timeline_card",
      years: "2026–2030",
      icon: "⚡",
      items: [
        { cat: "🌐 Geopolitical", text: "5G/6G densification completes. Full cognitive coverage of all population centers. Woodpecker-pattern ELF modulation embedded in all carrier infrastructure globally." },
        { cat: "🧬 Biology", text: "Neurological disease +340%. Childhood cancer +180%. Autoimmune disorders triple. Average sleep falls below 5.5 hours. Pharmaceutical industry at $8.4T annual GDP." },
        { cat: "🌿 Environment", text: "Ionospheric heating disrupts jet stream. EMF-induced bee colony collapse eliminates 65% of wild pollinators. Migratory bird populations crash." },
        { cat: "💰 Economy", text: "$220T in energy infrastructure locks out vacuum energy alternatives for 30+ years. First 'EM pandemic' vector established via carrier network." },
      ],
    },
    light: {
      bg: "from-gray-950 via-teal-950/30 to-gray-950",
      accent: "#22c55e",
      title: "2026–2030: SCALAR AWAKENING",
      subtitle: "The transition begins — technology enters the world",
      body: null,
      visual: "timeline_card",
      years: "2026–2030",
      icon: "🌱",
      items: [
        { cat: "🌐 Geopolitical", text: "Bearden anenergy pump validated at university scale. First open-system generator achieves COP > 1 in peer-reviewed journal. Scalar EM community grows to 50,000+ engineers." },
        { cat: "🧬 Biology", text: "First Prioré-type clinical trial: 67% tumor regression in animals. Trigger window therapy devices enter wellness market. Biofield coherence monitoring enters hospitals." },
        { cat: "🌿 Environment", text: "VPO technology reduces grid draw in pilot communities by 30%. Phase conjugate weather stabilization experiments in 3 countries." },
        { cat: "💰 Economy", text: "Open-source scalar hardware ecosystem valued at $48B. Pharmaceutical industry begins $340B pivot to bioelectromagnetic medicine." },
      ],
    },
  },
  {
    id: "timeline_30",
    label: "2030–2040",
    dark: {
      bg: "from-gray-950 via-red-950/40 to-gray-950",
      accent: "#dc2626",
      title: "2030–2040: BIOLOGICAL COLLAPSE",
      subtitle: "Population-level cognitive and reproductive failure",
      body: null,
      visual: "timeline_card",
      years: "2030–2040",
      icon: "☣️",
      items: [
        { cat: "🌐 Geopolitical", text: "Global IQ decline measurable at population level (OECD confirmed). ELF carrier lock normalizes compliance states. First 'EM pandemic' — cytopathogenic pattern broadcast via infrastructure." },
        { cat: "🧬 Biology", text: "Alzheimer's onset drops to age 45. Sperm counts near zero in urban zones. Children born post-2030 show structural neural differences. Life expectancy begins first sustained decline since Black Death." },
        { cat: "🌿 Environment", text: "Scalar EM weather warfare expands. Agricultural precision drought/flood cycles. Soil microbiome collapse from EMF disruption. 35% of global food supply at risk." },
        { cat: "💰 Economy", text: "400M climate refugees. Healthcare costs exceed GDP of 60 nations. Insurance industry collapse triggers global financial crisis 2036." },
      ],
    },
    light: {
      bg: "from-gray-950 via-blue-950/30 to-gray-950",
      accent: "#3b82f6",
      title: "2030–2040: CIVILIZATIONAL SHIFT",
      subtitle: "Healing technology reaches global scale",
      body: null,
      visual: "timeline_card",
      years: "2030–2040",
      icon: "✨",
      items: [
        { cat: "🌐 Geopolitical", text: "Vacuum energy demonstrated at city scale. Mandatory EMF safety standards based on Bearden trigger window science. ELF brain entrainment technology banned internationally." },
        { cat: "🧬 Biology", text: "Cancer death rate falls 80%. Human lifespan expectancy climbs to 120+. First 'biological age reversal' documented — cellular age reversed 15 years. Kaznacheyev therapy eliminates viral pandemics." },
        { cat: "🌿 Environment", text: "Vacuum energy eliminates fossil fuel combustion. Ocean pH normalizes. Phytoplankton recovery begins. Morphogenetic field monitoring shows Earth's biosphere healing." },
        { cat: "💰 Economy", text: "Energy abundance eliminates resource scarcity. Post-scarcity transition of global food, water, energy. $755T clean energy market enables universal prosperity." },
      ],
    },
  },
  {
    id: "timeline_50",
    label: "2040–2050",
    dark: {
      bg: "from-gray-950 via-red-950/50 to-gray-950",
      accent: "#991b1b",
      title: "2040–2050: TERMINAL TRAJECTORY",
      subtitle: "Irreversible civilizational and biological collapse",
      body: null,
      visual: "timeline_card",
      years: "2040–2050",
      icon: "💀",
      items: [
        { cat: "🌐 Geopolitical", text: "Phase conjugate weapon systems enable non-nuclear warfare with zero attribution. Population reduction via cytopathogenic broadcast becomes technically feasible for any nation-state." },
        { cat: "🧬 Biology", text: "Average lifespan: 52 years in high-income countries. Natural reproduction requires medical assistance for 70%+ of couples. 3rd generation shows developmental defects from accumulated morphogenetic damage." },
        { cat: "🌿 Environment", text: "Ocean oxygen supply collapsing — phytoplankton decimated. Mass extinction: 200 species/day. Ionospheric damage permanently alters Earth's Schumann resonance baseline." },
        { cat: "💰 Economy", text: "Collapse of functioning civilization in 40+ countries. Elite bunker economies emerge. $2.4 quadrillion unrepayable debt triggers hyperinflationary reset." },
      ],
    },
    light: {
      bg: "from-gray-950 via-purple-950/30 to-gray-950",
      accent: "#a855f7",
      title: "2040–2050: NEW EARTH CIVILIZATION",
      subtitle: "Humanity operates as a coherent morphogenetic civilization",
      body: null,
      visual: "timeline_card",
      years: "2040–2050",
      icon: "🌍",
      items: [
        { cat: "🌐 Geopolitical", text: "Phase conjugate communications replace surveillance internet. Consciousness research (T-field mechanics, bioframe physics) becomes mainstream science. Post-conflict global cooperation." },
        { cat: "🧬 Biology", text: "Average lifespan: 150+. Disease as a category largely eliminated. Cognitive capacity +25 IQ points globally from EMF elimination and biofield optimization. Age reversal standard." },
        { cat: "🌿 Environment", text: "Earth's biosphere fully stabilized. CO₂ returned to 280ppm via phi-field catalyzed carbon chemistry. Ionosphere healed — Schumann resonance amplitude increased. Species extinction near zero." },
        { cat: "💰 Economy", text: "Post-scarcity. Vacuum energy = free energy for all. Conflict near zero — resource wars impossible when energy and food are unlimited. Human civilization expands beyond Earth." },
      ],
    },
  },
  {
    id: "technology",
    label: "The Technology",
    dark: {
      bg: "from-gray-950 via-orange-950/20 to-gray-950",
      accent: "#f97316",
      title: "THE SUPPRESSED TECHNOLOGY STACK",
      subtitle: "What exists, what was proven, what was destroyed — and why",
      body: [
        { icon: "⚡", title: "T.H. Moray Sea-of-Energy Device (1930s)", detail: "50kW from vacuum. Multiple engineer witnesses. Signed affidavits. Device destroyed by Soviet agent. Explained completely by Bearden's anenergy pump (Part 4, 1983)." },
        { icon: "💉", title: "Antoine Prioré EM Cancer Cure (1960s–1980s)", detail: "French government funded. Official scientific witnesses. Terminal cancer cures in animals documented in peer-reviewed French journals. Program terminated after Prioré's death." },
        { icon: "🔬", title: "Royal Raymond Rife Prismatic Microscope (1930s)", detail: "Mortal Oscillatory Rate: each pathogen destroyed by its specific resonant frequency. Documented. AMA destroyed his career. Technology suppressed for 90 years." },
        { icon: "🌀", title: "Edwin Gray Pulsed Capacitor Engine (US Patent #3,890,548)", detail: "Patented over-unity engine drawing energy from the vacuum via pulsed discharge. Patent on record. Technology never commercialized." },
        { icon: "🏭", title: "Kromrey G-Field Generator (West Germany, 1982)", detail: "700W at >100% efficiency. Documented by Schaffranke's global survey. Motorcycle ran 20,000 km fuellessly. International prototype never scaled." },
        { icon: "🧲", title: "Searl Levity Disc (UK)", detail: "Documented antigravity and over-unity rotation via scalar field coupling. Multiple witnesses. Technology destroyed by authorities. Physics consistent with Bearden's framework." },
      ],
    },
    light: {
      bg: "from-gray-950 via-teal-950/20 to-gray-950",
      accent: "#00ffcc",
      title: "THE DEPLOYABLE SOLUTION STACK",
      subtitle: "Buildable today with off-the-shelf components — no exotic materials",
      body: [
        { icon: "🔋", title: "Anenergy Pump Circuit Kit — $89", detail: "Shielded toroidal coil geometry. ∇φ=0 inside, φ>φ₀ maintained. VPO pulse controller. Demonstrates vacuum energy extraction principle. All COTS components." },
        { icon: "🏥", title: "Prioré-Type Multichannel EM Therapy — $2,400", detail: "DDS signal generators + FPGA modulation chain. 3-layer S'/S''/S''' modulation architecture. Programmable biological trigger windows. FDA-exempt research device." },
        { icon: "💊", title: "EM Trigger Window Therapy Device — $599", detail: "Programmable frequency generator. Consumer wristband + clinical chamber versions. Trigger windows from Gravitobiology Table 12. Validates 7.83 Hz Schumann resonance therapy." },
        { icon: "📡", title: "Scalar Energy Bottle Interferometer — $2,800", detail: "Two-transmitter zero-vector interference zone. E=0, B=0 output zone. Scalar pulse timing circuit. Demonstrates defense application and clean energy capture." },
        { icon: "🌊", title: "Phi-River Gradient Sensor — $950", detail: "Differential phi-potential measurement. Detects massless charge gradient invisible to conventional voltmeters. First direct anenergy measurement instrument." },
        { icon: "🛰️", title: "Atmospheric Scalar EM Recognition System — $3,200", detail: "AI-trained cloud morphology classifier. Detects scalar EM atmospheric interference signatures. Correlates with RF emissions. All-sky camera + GPU analysis." },
      ],
    },
  },
  {
    id: "opportunity",
    label: "The Opportunity",
    dark: {
      bg: "from-gray-950 via-red-950/20 to-gray-950",
      accent: "#ef4444",
      title: "THE COST OF INACTION",
      subtitle: "Every year delayed is measured in irreversible biological damage",
      body: null,
      visual: "cost_grid",
      costs: [
        { year: "2026", event: "5G grid completes — ELF entrainment infrastructure locked in", cost: "$0 to reverse now / $220T to reverse in 2030", color: "#f97316" },
        { year: "2028", event: "Fertility collapse crosses biological replacement threshold in 20+ nations", cost: "Demographic damage irreversible in 1 generation", color: "#ef4444" },
        { year: "2030", event: "Global IQ decline confirmed at population level", cost: "Cognitive damage to 3 generations if not reversed by 2032", color: "#dc2626" },
        { year: "2035", event: "First EM pandemic vector broadcast via infrastructure", cost: "$12T economic damage · 400M deaths modeled", color: "#991b1b" },
        { year: "2040", event: "Morphogenetic field damage to 3rd generation — developmental effects appear", cost: "Permanent genomic alteration of human species", color: "#7f1d1d" },
        { year: "2050", event: "Ocean oxygen supply collapse — phytoplankton decimated by EMF", cost: "Existential — no technological fix available", color: "#450a0a" },
      ],
    },
    light: {
      bg: "from-gray-950 via-teal-950/20 to-gray-950",
      accent: "#00ffcc",
      title: "THE MARKET OPPORTUNITY",
      subtitle: "The largest technology transition in human history",
      body: null,
      visual: "market_grid",
      markets: [
        { sector: "Energy", tam: "$755B", desc: "Clean scalar energy replaces $4.6T fossil fuel market", color: "#22c55e", timeline: "2027–2035" },
        { sector: "Bioelectromagnetic Medicine", tam: "$3.8B → $340B", desc: "Prioré-type therapy, trigger window devices, DNA repair systems", color: "#00ffcc", timeline: "2026–2032" },
        { sector: "EMF Defense", tam: "$9.3B DARPA", desc: "Scalar EM detection, Energy Bottle weapons/shields, PCM countermeasures", color: "#3b82f6", timeline: "2026–2030" },
        { sector: "Longevity / Age Reversal", tam: "$85B", desc: "Morphogenetic field maintenance, scalar coherence devices", color: "#a855f7", timeline: "2028–2038" },
        { sector: "Atmospheric Monitoring", tam: "$4.2B", desc: "Scalar EM weather modification detection, AI cloud signature analysis", color: "#f59e0b", timeline: "2026–2029" },
        { sector: "Education / Research", tam: "$48B", desc: "Courses, annotated archives, lab kits, IP licensing", color: "#06b6d4", timeline: "Immediate" },
      ],
    },
  },
  {
    id: "cta",
    label: "Call to Action",
    dark: {
      bg: "from-gray-950 via-red-950/30 to-gray-950",
      accent: "#ef4444",
      title: "THE FORK IN THE ROAD IS NOW",
      subtitle: "The window to prevent the dark timeline closes with each passing year",
      body: null,
      visual: "cta",
      message: "The physics is documented. The devices are buildable. The healing mechanism is proven. What stands between the dark and light timelines is awareness, access, and action. Every year the scalar energy transition is delayed is a year of irreversible biological, environmental, and civilizational damage.",
      actions: [
        { label: "🔧 Build the Devices", sub: "invention-plans", color: "#ef4444", to: "/invention-plans" },
        { label: "📚 Master the Physics", sub: "courses", color: "#f97316", to: "/courses" },
        { label: "💼 Invest in the Portfolio", sub: "business", color: "#dc2626", to: "/business" },
      ],
    },
    light: {
      bg: "from-gray-950 via-teal-950/30 to-gray-950",
      accent: "#00ffcc",
      title: "THE TECHNOLOGY EXISTS TODAY",
      subtitle: "The light timeline is not utopian — it is a direct consequence of deploying documented physics",
      body: null,
      visual: "cta",
      message: "The Prioré device worked and was government-funded. Moray's 50kW device was photographed and witnessed by engineers. Bearden's physics is internally consistent and derived from mainstream EM theory. The engineering is buildable with off-the-shelf components. The only missing variable is you.",
      actions: [
        { label: "⚡ Scalar EM Lab", sub: "simulate it", color: "#00ffcc", to: "/scalar-lab" },
        { label: "🧬 EMF Impact", sub: "see the evidence", color: "#22c55e", to: "/emf-impact" },
        { label: "🔧 Build Plans", sub: "start building", color: "#3b82f6", to: "/invention-plans" },
      ],
    },
  },
];

// ── Visual components
function DamageGrid({ items }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <div key={i} className="bg-black/40 border border-red-900/40 rounded-xl p-4">
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="text-2xl font-black text-red-400 mb-1">{item.stat}</div>
          <div className="text-white text-xs font-bold mb-1 leading-snug">{item.label}</div>
          <div className="text-gray-500 text-xs leading-relaxed">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}

function SolutionGrid({ items }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <div key={i} className="bg-black/40 border border-teal-900/40 rounded-xl p-4">
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="text-2xl font-black text-teal-400 mb-1">{item.stat}</div>
          <div className="text-white text-xs font-bold mb-1 leading-snug">{item.label}</div>
          <div className="text-gray-500 text-xs leading-relaxed">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}

function BodyCols({ cols, accent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cols.map((col, i) => (
        <div key={i} className="bg-black/40 border rounded-2xl p-5" style={{ borderColor: col.color + "40" }}>
          <p className="font-black text-sm mb-3 tracking-widest" style={{ color: col.color }}>{col.organ}</p>
          <ul className="space-y-2">
            {col.effects.map((e, j) => (
              <li key={j} className="text-gray-300 text-xs leading-relaxed flex gap-2">
                <span style={{ color: col.color }} className="flex-shrink-0 mt-0.5">▸</span>{e}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function TimelineCard({ item, accent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {item.items.map((row, i) => (
        <div key={i} className="bg-black/40 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{row.cat}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{row.text}</p>
        </div>
      ))}
    </div>
  );
}

function CostGrid({ costs }) {
  return (
    <div className="space-y-3">
      {costs.map((c, i) => (
        <div key={i} className="flex gap-4 items-start bg-black/40 border border-gray-800 rounded-xl px-5 py-4">
          <div className="w-16 flex-shrink-0">
            <p className="font-black text-lg" style={{ color: c.color }}>{c.year}</p>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-bold mb-1">{c.event}</p>
            <p className="text-gray-500 text-xs">{c.cost}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketGrid({ markets }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {markets.map((m, i) => (
        <div key={i} className="bg-black/40 border rounded-2xl p-5" style={{ borderColor: m.color + "40" }}>
          <div className="flex justify-between items-start mb-2">
            <p className="font-black text-sm" style={{ color: m.color }}>{m.sector}</p>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{m.timeline}</span>
          </div>
          <p className="text-2xl font-black text-white mb-2">{m.tam}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{m.desc}</p>
        </div>
      ))}
    </div>
  );
}

function CTASlide({ slide, scenario }) {
  const s = slide[scenario];
  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 px-4 max-w-3xl mx-auto w-full">
      <p className="text-gray-300 text-base leading-relaxed">{s.message}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {s.actions.map((a, i) => (
          <Link key={i} to={a.to}
            className="px-6 py-3 rounded-2xl text-sm font-black text-white border-2 transition-all hover:scale-105"
            style={{ borderColor: a.color, backgroundColor: a.color + "20" }}>
            <div>{a.label}</div>
            <div className="text-xs opacity-60 font-normal mt-0.5">{a.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CoverVisual({ scenario }) {
  return (
    <div className="flex items-center justify-center h-36">
      {scenario === "dark" ? (
        <div className="text-8xl opacity-60 animate-pulse">☠️</div>
      ) : (
        <div className="text-8xl opacity-80 animate-pulse">🌍</div>
      )}
    </div>
  );
}

function SlideContent({ slide, scenario }) {
  const s = slide[scenario];
  const isDark = scenario === "dark";

  if (slide.id === "cover") return <CoverVisual scenario={scenario} />;
  if (slide.id === "cta") return <CTASlide slide={slide} scenario={scenario} />;

  if (s.body) {
    if (slide.id === "problem") return isDark ? <DamageGrid items={s.body} /> : <SolutionGrid items={s.body} />;
    if (slide.id === "technology") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {s.body.map((item, i) => (
            <div key={i} className="bg-black/40 border border-gray-800 rounded-xl p-4 flex gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-white font-bold text-xs mb-1">{item.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  if (slide.id === "mechanism") return <BodyCols cols={s.cols} accent={s.accent} />;
  if (["timeline_10", "timeline_30", "timeline_50"].includes(slide.id)) return <TimelineCard item={s} accent={s.accent} />;
  if (slide.id === "opportunity") {
    return isDark ? <CostGrid costs={s.costs} /> : <MarketGrid markets={s.markets} />;
  }

  return null;
}

export default function TimelinePitchDeck() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [scenario, setScenario] = useState("dark");

  const slide = SLIDES[slideIdx];
  const s = slide[scenario];
  const isDark = scenario === "dark";

  const prev = () => setSlideIdx(i => Math.max(0, i - 1));
  const next = () => setSlideIdx(i => Math.min(SLIDES.length - 1, i + 1));

  return (
    <div className={`w-screen min-h-screen bg-gradient-to-br ${s.bg} flex flex-col text-white transition-all duration-700`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <h1 className="text-white font-bold text-sm tracking-tight">EMF Dark vs. Scalar Light — Pitch Deck</h1>
        </div>

        {/* Scenario toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-700">
          <button onClick={() => setScenario("dark")}
            className={`px-4 py-2 text-xs font-black transition-all ${scenario === "dark" ? "bg-red-900 text-white" : "text-gray-500 hover:text-gray-300"}`}>
            ☠️ DARK TIMELINE
          </button>
          <button onClick={() => setScenario("light")}
            className={`px-4 py-2 text-xs font-black transition-all ${scenario === "light" ? "bg-teal-900 text-white" : "text-gray-500 hover:text-gray-300"}`}>
            🌍 LIGHT TIMELINE
          </button>
        </div>
      </div>

      {/* Slide nav tabs */}
      <div className="flex gap-1 px-5 py-2 border-b border-gray-800 overflow-x-auto flex-shrink-0">
        {SLIDES.map((sl, i) => (
          <button key={sl.id} onClick={() => setSlideIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              slideIdx === i ? "text-white" : "text-gray-600 hover:text-gray-400"
            }`}
            style={slideIdx === i ? { backgroundColor: s.accent + "25", color: s.accent } : {}}>
            {i + 1}. {sl.label}
          </button>
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Slide header */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: s.accent }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: s.accent }}>
              {isDark ? "☠️ WITHOUT SCALAR TRANSITION" : "✅ WITH SCALAR TRANSITION"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">{s.title}</h2>
          <p className="text-gray-400 text-base">{s.subtitle}</p>
          {slide.id === "cover" && s.tag && (
            <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-black border" style={{ borderColor: s.accent + "60", color: s.accent, backgroundColor: s.accent + "10" }}>
              {s.tag}
            </div>
          )}
          {["timeline_10", "timeline_30", "timeline_50"].includes(slide.id) && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-3xl">{s.icon}</span>
              <span className="text-xl font-black" style={{ color: s.accent }}>{s.years}</span>
            </div>
          )}
        </div>

        {/* Dynamic content area */}
        <div className="flex-1 overflow-y-auto">
          <SlideContent slide={slide} scenario={scenario} />
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 flex-shrink-0">
        <button onClick={prev} disabled={slideIdx === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 transition-all text-sm">
          <ChevronLeft size={16} /> Previous
        </button>

        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlideIdx(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{ backgroundColor: i === slideIdx ? s.accent : "#374151", transform: i === slideIdx ? "scale(1.4)" : "scale(1)" }} />
          ))}
        </div>

        <button onClick={next} disabled={slideIdx === SLIDES.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-30 transition-all"
          style={{ borderColor: s.accent + "60", color: s.accent, backgroundColor: s.accent + "10" }}>
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}