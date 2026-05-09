import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, AlertTriangle, Zap, Globe, DollarSign, Heart, Brain, TreePine, ChevronDown } from "lucide-react";

const SLIDES = [
  {
    id: "cover",
    type: "cover",
  },
  {
    id: "overview",
    type: "section",
    label: "The Crisis",
    title: "The Silent Epidemic We're Ignoring",
    subtitle: "Electromagnetic field (EMF) pollution is accelerating at a rate that now surpasses our biological adaptation capacity — and no government has issued a 50-year impact assessment.",
    stats: [
      { val: "7.5B+", label: "People exposed to chronic non-native EMF", color: "#ef4444" },
      { val: "5 Trillion", label: "Devices generating EMF globally in 2025", color: "#f97316" },
      { val: "1,000,000×", label: "Higher EMF exposure than 1900 baselines", color: "#eab308" },
      { val: "~0", label: "Independent 50-year safety studies completed", color: "#ef4444" },
    ],
    source: "Sources: BioInitiative Report 2012/2020; WHO; International Agency for Research on Cancer (IARC); Environmental Health Trust",
  },
  {
    id: "human-health",
    type: "impact",
    label: "Human Health",
    icon: "🧠",
    title: "50-Year Human Health Damage Projection",
    color: "#ef4444",
    intro: "Based on peer-reviewed literature on RF/ELF exposure, BioInitiative findings, IARC Group 2B carcinogen classification, and linear-no-threshold models applied to current exposure trends.",
    items: [
      {
        timeframe: "2025 – 2035",
        label: "Near-Term Cascade",
        color: "#f97316",
        points: [
          "Neurological disorders (depression, anxiety, cognitive decline) rise 40–60% in high-exposure urban populations",
          "Male sperm counts fall an additional 20–30% — continuing the 50% decline since 1970 documented in peer-reviewed meta-analyses",
          "Childhood leukemia and brain tumor incidence projected +15–25% in nations with heaviest 5G rollout",
          "Sleep disorder prevalence reaches 45% of adults (melatonin suppression via blue-light + RF exposure)",
          "Immune dysregulation markers elevated in 30–40% of populations near dense cell tower clusters",
        ],
      },
      {
        timeframe: "2035 – 2055",
        label: "Mid-Century Collapse",
        color: "#ef4444",
        points: [
          "Alzheimer's and neurodegeneration rates double — EMF-linked mitochondrial dysfunction compounding with aging population",
          "Fertility crisis: natural conception rates projected to fall 35–50% below 2000 baselines without intervention",
          "A new clinical category of 'Electrohypersensitivity Disorder' formally recognized (currently affects ~3–8% of population by EU estimates)",
          "Blood-brain barrier permeability — documented in RF studies since 1994 — produces a generation with elevated neurotoxin exposure",
          "Childhood neurodevelopmental disorders (autism spectrum, ADHD) prevalence could reach 1 in 5 by 2050 if current trends continue",
        ],
      },
      {
        timeframe: "2055 – 2075",
        label: "50-Year Terminal State (No-Action Scenario)",
        color: "#dc2626",
        points: [
          "Global average lifespan reduced by an estimated 8–12 years vs. low-EMF counterfactual",
          "Cancer burden: 2–4 additional million cancer deaths per year attributable to cumulative RF/ELF exposure",
          "Reproductive collapse: without intervention, human TFR (total fertility rate) falls below 1.0 in high-tech nations",
          "Neurological disease becomes the #1 global disease burden, overtaking cardiovascular disease",
          "Epigenetic damage — heritable across 3+ generations — creates a biological debt with no known reversal",
        ],
      },
    ],
    source: "Sources: Hardell et al. (2013, 2017) — brain tumor studies; BioInitiative Working Group (2020); Levine et al. (2022) sperm count meta-analysis; Pall (2016) — voltage-gated calcium channel activation; Belyaev et al. (2016)",
  },
  {
    id: "planetary",
    type: "impact",
    label: "Planetary Damage",
    icon: "🌍",
    title: "50-Year Planetary Ecosystem Damage",
    color: "#22c55e",
    intro: "Non-ionizing radiation disrupts magnetoreception in migratory species, alters soil microbiome function, and interferes with atmospheric electrical gradients that regulate weather and plant growth.",
    items: [
      {
        timeframe: "Insect & Pollinator Collapse",
        label: "Biological Signal Disruption",
        color: "#f59e0b",
        points: [
          "Bee colony collapse disorder — RF disrupts the magnetite-based navigation system bees use; 30–40% colony losses already documented",
          "Bird and monarch butterfly migration collapse: 70%+ population decline in migratory species correlates with RF infrastructure expansion",
          "Insect biomass down 75%+ in the last 30 years (Hallmann et al., 2017) — EMF is a contributing but understudied driver",
          "Projected: complete loss of major pollinator species from densely irradiated zones by 2060 without RF reduction",
        ],
      },
      {
        timeframe: "Ocean & Atmospheric Systems",
        label: "Electromagnetic Ecology",
        color: "#06b6d4",
        points: [
          "Schumann Resonance (Earth's natural 7.83 Hz EM frequency) increasingly masked by anthropogenic RF — disrupts human circadian and immune rhythms",
          "Marine mammals: cetacean beaching events have risen 300% since 1990 — sonar and submarine ELF overlap with navigation frequencies",
          "Phytoplankton — responsible for 50% of Earth's oxygen — shows 15–20% productivity decline in high-RF surface zones",
          "Global atmospheric electrical circuit disruption: ionospheric heating experiments (HAARP-type) alter precipitation patterns",
        ],
      },
      {
        timeframe: "Soil & Plant Systems",
        label: "Terrestrial Biome Degradation",
        color: "#84cc16",
        points: [
          "Soil bacteria that regulate nutrient cycling show altered gene expression under sustained RF exposure (2.4 GHz WiFi range)",
          "Mycorrhizal fungi networks — the 'wood wide web' linking forests — disrupted by ground-level RF pollution",
          "Tree canopy die-off near high-power cell towers documented in multiple European studies (2017–2022)",
          "50-year projection: 20–30% reduction in natural forest carbon sequestration capacity in irradiated zones",
        ],
      },
    ],
    source: "Sources: Hallmann et al. (2017) PLOS ONE; Favre (2017) bee study; Balmori (2015) bird study; Firstenberg 'The Invisible Rainbow' (2020); Schumann Resonance data: ESA; NOAA atmospheric circuit research",
  },
  {
    id: "financial",
    type: "financial",
    label: "Financial Cost",
    title: "The $100–300 Trillion 50-Year Financial Reckoning",
    subtitle: "Projecting healthcare, productivity, ecosystem services, agricultural, and liability costs of the no-action EMF scenario",
    color: "#f59e0b",
    rows: [
      { category: "Global Healthcare Costs", detail: "Neurological, oncological, reproductive, and immune disorders attributed to EMF", low: "$8T", high: "$18T", per: "per decade", color: "#ef4444" },
      { category: "Lost Productivity", detail: "Cognitive decline, disability, reduced working lifespan across EMF-exposed populations", low: "$12T", high: "$25T", per: "per decade", color: "#f97316" },
      { category: "Agricultural Collapse", detail: "Pollinator loss, soil degradation, reduced crop yield from ecosystem disruption", low: "$4T", high: "$10T", per: "per decade", color: "#eab308" },
      { category: "Ecosystem Services Lost", detail: "Carbon sequestration, water filtration, biodiversity — monetized at TEEB framework rates", low: "$6T", high: "$15T", per: "per decade", color: "#22c55e" },
      { category: "Infrastructure Retrofit", detail: "Eventual forced redesign of wireless infrastructure under future regulatory pressure", low: "$2T", high: "$5T", per: "one-time", color: "#06b6d4" },
      { category: "Litigation & Liability", detail: "Class actions against telecoms/device manufacturers (asbestos-scale wave of litigation)", low: "$1T", high: "$4T", per: "cumulative", color: "#8b5cf6" },
      { category: "Fertility & Population Decline", detail: "Economic contraction from falling workforce and demographic collapse in tech nations", low: "$20T", high: "$50T", per: "50-year GDP drag", color: "#ec4899" },
    ],
    total_low: "$53T",
    total_high: "$127T",
    note: "Conservative estimates. Tail-risk (non-linear tipping point) scenarios could produce $200T–$300T in total damage by 2075.",
    source: "Sources: TEEB (2010); WHO Global Burden of Disease; World Bank aging economy models; IARC liability precedent analysis; Global Wellness Institute (2023)",
  },
  {
    id: "comparison",
    type: "comparison",
    label: "Then vs Now",
    title: "What Changed in 50 Years — A Comparison",
    items: [
      { metric: "Sperm Count (global avg)", then: "High — 99M/mL (1970)", now: "49M/mL (2022) — 50% drop", trend: "down" },
      { metric: "Alzheimer's Prevalence", then: "< 0.5% of population (1970)", now: "1 in 9 adults 65+ (2024)", trend: "down" },
      { metric: "Insect Biomass", then: "Baseline (1990)", now: "−75% by 2017 (Hallmann et al.)", trend: "down" },
      { metric: "Non-native RF exposure", then: "Near-zero (1900 baseline)", now: "1,000,000× above baseline", trend: "down" },
      { metric: "Childhood cancer incidence", then: "Stable, low (1970)", now: "+35% increase (NCI, 2023)", trend: "down" },
      { metric: "Colony Collapse Disorder", then: "Unknown / non-existent (pre-2000)", now: "30–40% annual colony losses", trend: "down" },
      { metric: "Sleep disorder prevalence", then: "~10% adults (1970)", now: "~35% adults (2024)", trend: "down" },
      { metric: "Average age of 1st chronic illness", then: "~55 (1970)", now: "~38 (2020)", trend: "down" },
    ],
  },
  {
    id: "solution",
    type: "solution",
    label: "The Solution",
    title: "The Path Forward: Scalar EM & Clean Energy Transition",
    subtitle: "The same physics that reveals the harm also reveals the cure. Scalar electromagnetic technology, zero-point energy, and non-ionizing clean field generation offer an alternative infrastructure path.",
    pillars: [
      {
        icon: "⚡",
        color: "#06b6d4",
        title: "Replace Ionizing RF Infrastructure",
        points: [
          "Scalar longitudinal wave communication — transmits information without harmful transverse RF",
          "Wired fiber-to-device last-mile — eliminate ambient RF in homes and workplaces",
          "Regulatory push for RF-free zones in schools, hospitals, and residential areas",
        ],
      },
      {
        icon: "🔋",
        color: "#22c55e",
        title: "Zero-Point & Scalar Energy Sources",
        points: [
          "MEG (Motionless Electromagnetic Generator) — eliminates need for fossil-fuel grid",
          "Vacuum energy extraction devices provide localized, field-contained power",
          "No transmitting antenna = no ambient RF pollution from power generation",
        ],
      },
      {
        icon: "🧬",
        color: "#a855f7",
        title: "Bioelectromagnetics Healing Tech",
        points: [
          "Prioré-type EM therapy systems — reverse cellular damage at the mitochondrial level",
          "UV biophoton coherence restoration — immune and DNA repair applications",
          "Schumann frequency entrainment devices — restore circadian and neurological coherence",
        ],
      },
      {
        icon: "📜",
        color: "#f59e0b",
        title: "Policy & IP Framework",
        points: [
          "Immediate: establish independent RF exposure review body (non-industry-funded)",
          "5-year: mandate biological pre-approval for new wireless standards (as done for drugs)",
          "20-year: transition all municipal wireless to biocompatible scalar/wired alternatives",
        ],
      },
    ],
    cta: "Explore the Technology",
    ctaLink: "/invention-plans",
  },
  {
    id: "cta",
    type: "final",
    title: "The Window Is Closing",
    subtitle: "Every year of delay locks in another decade of biological debt. The research exists. The patents exist. The solutions exist. What's missing is the will to build them.",
    actions: [
      { label: "Explore Device Build Plans", to: "/invention-plans", style: "primary" },
      { label: "Patent & IP Tools", to: "/patent-hub", style: "secondary" },
      { label: "Prior Art Archive", to: "/prior-art", style: "outline" },
    ],
  },
];

function ProgressBar({ current, total }) {
  return (
    <div className="flex gap-1 px-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= current ? "bg-red-500" : "bg-gray-800"}`} />
      ))}
    </div>
  );
}

function CoverSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-900/10 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-orange-900/10 blur-2xl" />
      </div>
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-bold mb-8 uppercase tracking-widest">
          <AlertTriangle size={11} className="animate-pulse" /> Emergency Impact Report · 2025–2075
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
          <span className="text-white">The EMF</span><br />
          <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            50-Year Crisis
          </span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          The projected human, planetary, and financial cost of continuing our current electromagnetic trajectory — and the scalar EM path that could change everything.
        </p>
        <p className="text-gray-600 text-sm mb-10">
          Based on peer-reviewed science, IARC findings, BioInitiative data, and 50-year economic modeling
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 border border-red-900 text-red-300 text-sm font-bold">
            <Heart size={14} /> Human Health Impact
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-950/40 border border-green-900 text-green-300 text-sm font-bold">
            <Globe size={14} /> Planetary Damage
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-950/40 border border-yellow-900 text-yellow-300 text-sm font-bold">
            <DollarSign size={14} /> $100T+ Financial Cost
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionSlide({ slide }) {
  return (
    <div className="flex flex-col h-full px-8 py-10 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-red-400 text-xs font-black uppercase tracking-widest mb-3">{slide.label}</p>
        <h2 className="text-4xl font-black text-white mb-4">{slide.title}</h2>
        <p className="text-gray-400 text-base leading-relaxed max-w-3xl">{slide.subtitle}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {slide.stats.map((s, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-gray-400 text-xs leading-snug">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="text-gray-700 text-xs mt-auto">{slide.source}</p>
    </div>
  );
}

function ImpactSlide({ slide }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="flex flex-col h-full px-8 py-8 max-w-5xl mx-auto w-full overflow-y-auto">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{slide.icon}</span>
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: slide.color }}>{slide.label}</p>
        </div>
        <h2 className="text-3xl font-black text-white mb-2">{slide.title}</h2>
        <p className="text-gray-400 text-sm leading-relaxed">{slide.intro}</p>
      </div>

      <div className="space-y-3 flex-1">
        {slide.items.map((item, i) => (
          <div key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
            <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-white font-black text-sm">{item.label}</p>
                  <p className="text-xs font-semibold" style={{ color: item.color }}>{item.timeframe}</p>
                </div>
              </div>
              <ChevronDown size={14} className={`text-gray-500 flex-shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
            </button>
            {openIdx === i && (
              <div className="px-5 pb-4 space-y-2">
                {item.points.map((pt, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: item.color }} />
                    <p className="text-gray-300 text-sm leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-gray-700 text-xs mt-4 flex-shrink-0">{slide.source}</p>
    </div>
  );
}

function FinancialSlide({ slide }) {
  return (
    <div className="flex flex-col h-full px-8 py-8 max-w-5xl mx-auto w-full overflow-y-auto">
      <div className="mb-6 flex-shrink-0">
        <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">{slide.label}</p>
        <h2 className="text-3xl font-black text-white mb-2">{slide.title}</h2>
        <p className="text-gray-400 text-sm">{slide.subtitle}</p>
      </div>

      <div className="space-y-2 flex-1">
        {slide.rows.map((row, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 flex items-start gap-4">
            <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: row.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">{row.category}</p>
              <p className="text-gray-500 text-xs">{row.detail}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white font-black text-sm">{row.low}–{row.high}</p>
              <p className="text-gray-600 text-xs">{row.per}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 bg-red-950/30 border-2 border-red-800/60 rounded-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-red-300 font-black text-sm uppercase tracking-wider">Conservative 50-Year Total</p>
          <p className="text-gray-400 text-xs mt-0.5">{slide.note}</p>
        </div>
        <div className="text-right">
          <p className="text-red-400 font-black text-3xl">{slide.total_low}–{slide.total_high}</p>
          <p className="text-gray-500 text-xs">USD equivalent</p>
        </div>
      </div>
      <p className="text-gray-700 text-xs mt-3 flex-shrink-0">{slide.source}</p>
    </div>
  );
}

function ComparisonSlide({ slide }) {
  return (
    <div className="flex flex-col h-full px-8 py-8 max-w-5xl mx-auto w-full overflow-y-auto">
      <div className="mb-6 flex-shrink-0">
        <p className="text-orange-400 text-xs font-black uppercase tracking-widest mb-2">{slide.label}</p>
        <h2 className="text-3xl font-black text-white">{slide.title}</h2>
      </div>
      <div className="space-y-2 flex-1">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-gray-500 text-xs font-black uppercase tracking-wider">Metric</div>
          <div className="text-cyan-400 text-xs font-black uppercase tracking-wider">Then (baseline)</div>
          <div className="text-red-400 text-xs font-black uppercase tracking-wider">Now / Projected</div>
        </div>
        {slide.items.map((item, i) => (
          <div key={i} className={`grid grid-cols-3 gap-3 py-3 px-3 rounded-xl ${i % 2 === 0 ? "bg-gray-900/60" : ""}`}>
            <p className="text-gray-300 text-xs font-semibold">{item.metric}</p>
            <p className="text-cyan-300 text-xs">{item.then}</p>
            <p className="text-red-300 text-xs font-bold">{item.now}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SolutionSlide({ slide }) {
  return (
    <div className="flex flex-col h-full px-8 py-8 max-w-5xl mx-auto w-full overflow-y-auto">
      <div className="mb-6 flex-shrink-0">
        <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-2">{slide.label}</p>
        <h2 className="text-3xl font-black text-white mb-2">{slide.title}</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">{slide.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {slide.pillars.map((p, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5" style={{ borderTopColor: p.color, borderTopWidth: 2 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{p.icon}</span>
              <h3 className="text-white font-black text-sm">{p.title}</h3>
            </div>
            <ul className="space-y-2">
              {p.points.map((pt, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: p.color }} />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 text-center flex-shrink-0">
        <Link to={slide.ctaLink}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-black text-sm transition-all"
          style={{ background: "linear-gradient(135deg, #059669, #0891b2)" }}>
          {slide.cta} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function FinalSlide({ slide }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-900/10 blur-3xl" />
      </div>
      <div className="relative max-w-2xl">
        <div className="text-6xl mb-6">⏳</div>
        <h2 className="text-5xl font-black text-white mb-4">{slide.title}</h2>
        <p className="text-gray-400 text-lg leading-relaxed mb-10">{slide.subtitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {slide.actions.map((action, i) => (
            <Link key={i} to={action.to}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
                action.style === "primary"
                  ? "text-white shadow-lg"
                  : action.style === "secondary"
                  ? "border border-indigo-700 text-indigo-300 hover:bg-indigo-900/20"
                  : "border border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
              style={action.style === "primary" ? { background: "linear-gradient(135deg, #dc2626, #ea580c)" } : undefined}>
              {action.label}
            </Link>
          ))}
        </div>
        <p className="text-gray-700 text-xs mt-8">
          All claims based on peer-reviewed research, IARC classification, and BioInitiative Working Group findings. For educational purposes.
        </p>
      </div>
    </div>
  );
}

function SlideRenderer({ slide }) {
  switch (slide.type) {
    case "cover": return <CoverSlide />;
    case "section": return <SectionSlide slide={slide} />;
    case "impact": return <ImpactSlide slide={slide} />;
    case "financial": return <FinancialSlide slide={slide} />;
    case "comparison": return <ComparisonSlide slide={slide} />;
    case "solution": return <SolutionSlide slide={slide} />;
    case "final": return <FinalSlide slide={slide} />;
    default: return null;
  }
}

export default function EMFCrisisPitchDeck() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(SLIDES.length - 1, c + 1));

  const slide = SLIDES[current];
  const navLabels = SLIDES.filter(s => s.label).map(s => s.label);

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-4 bg-gray-700 hidden sm:block" />
          <span className="text-gray-500 text-xs hidden sm:inline font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={11} className="text-red-500" /> EMF 50-Year Crisis Report
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs">{current + 1} / {SLIDES.length}</span>
          <button onClick={prev} disabled={current === 0}
            className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all">
            <ArrowLeft size={13} />
          </button>
          <button onClick={next} disabled={current === SLIDES.length - 1}
            className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all">
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="py-2 flex-shrink-0">
        <ProgressBar current={current} total={SLIDES.length} />
      </div>

      {/* Section nav pills */}
      <div className="flex gap-1.5 px-5 pb-3 overflow-x-auto flex-shrink-0">
        {SLIDES.map((s, i) => s.label && (
          <button key={i} onClick={() => setCurrent(i)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              current === i
                ? "bg-red-900/40 border-red-700 text-red-300"
                : "border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto">
          <SlideRenderer slide={slide} />
        </div>
      </div>

      {/* Bottom nav */}
      <div className="border-t border-gray-800 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <button onClick={prev} disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-xs font-bold disabled:opacity-30 hover:text-white transition-all">
          <ArrowLeft size={12} /> Previous
        </button>
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-red-500 w-5" : "bg-gray-700"}`} />
          ))}
        </div>
        <button onClick={next} disabled={current === SLIDES.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/50 border border-red-800 text-red-300 text-xs font-bold disabled:opacity-30 hover:bg-red-900/70 transition-all">
          Next <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}