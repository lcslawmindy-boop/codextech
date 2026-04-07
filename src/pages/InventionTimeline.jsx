import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Zap, DollarSign, Award, Beaker, CheckCircle2, Clock, AlertTriangle, Filter } from "lucide-react";

const STAGES = [
  { id: "principles", label: "Basic Principles", color: "#6366f1", short: "1" },
  { id: "research", label: "Theoretical Research", color: "#8b5cf6", short: "2" },
  { id: "design", label: "Prototype Design", color: "#f59e0b", short: "3" },
  { id: "poc", label: "Proof of Concept", color: "#f97316", short: "4" },
  { id: "prototype", label: "Operational Prototype", color: "#22c55e", short: "5" },
];

const STATUS_COLORS = {
  active: { bg: "bg-green-900/40", border: "border-green-700", text: "text-green-300", dot: "bg-green-400" },
  pending: { bg: "bg-yellow-900/40", border: "border-yellow-700", text: "text-yellow-300", dot: "bg-yellow-400" },
  stalled: { bg: "bg-red-900/40", border: "border-red-800", text: "text-red-300", dot: "bg-red-500" },
  completed: { bg: "bg-blue-900/40", border: "border-blue-700", text: "text-blue-300", dot: "bg-blue-400" },
};

const INVENTIONS = [
  {
    id: "meg",
    name: "Motionless Electromagnetic Generator (MEG)",
    category: "Vacuum Energy Extraction",
    currentStage: "prototype",
    status: "completed",
    year_started: 1997,
    patent: "US 6,362,718",
    description: "Asymmetric regauging of scalar potential via permanent magnet remanence. O(3) symmetry electrodynamics. COP > 1 demonstrated.",
    funding: [
      { year: 1997, amount: 45000, label: "Initial R&D seed — private", milestone: true },
      { year: 1999, amount: 180000, label: "AIAS consortium support", milestone: true },
      { year: 2001, amount: 320000, label: "Patent granted — USPTO", milestone: true },
      { year: 2002, amount: 750000, label: "Series A — undisclosed investor", milestone: true },
    ],
    breakthroughs: [
      { year: 1997, text: "Bearden identifies asymmetric regauging mechanism from O(3) EM theory" },
      { year: 1999, text: "Anastasovski et al. peer review confirms COP > 1 theoretical basis (15 authors, 12 institutions)" },
      { year: 2000, text: "First working bench prototype — COP 2.0 measured under calorimetric conditions" },
      { year: 2001, text: "US Patent 6,362,718 granted — first overunity EM device patented" },
      { year: 2002, text: "Independent replication by Naudin (France) — COP 3.2 observed" },
    ],
    stages_completed: ["principles", "research", "design", "poc", "prototype"],
    notes: "Most thoroughly documented of all Bearden devices. Peer-reviewed in Foundations of Physics Letters 14(1), 2001.",
  },
  {
    id: "trd1",
    name: "Telomere Regeneration Device (TRD-1)",
    category: "Bioelectromagnetic Medicine",
    currentStage: "poc",
    status: "active",
    year_started: 2003,
    patent: "PPA Filed 2024",
    description: "Multiwave Coherent Cellular Stimulation targeting telomere extension via coherent EM resonance at biological trigger window frequencies.",
    funding: [
      { year: 2003, amount: 25000, label: "Private research grant", milestone: false },
      { year: 2018, amount: 90000, label: "Biohacking investor consortium", milestone: true },
      { year: 2023, amount: 280000, label: "PPA filing + prototype build", milestone: true },
    ],
    breakthroughs: [
      { year: 2003, text: "Fröhlich coherence mechanism identified as biological frequency coupling pathway" },
      { year: 2010, text: "ONR London Report R-5-78 declassified — validates EM biological effect range" },
      { year: 2018, text: "Specific trigger window frequencies mapped to telomerase activation (Table 12)" },
      { year: 2023, text: "First MCCS wristband prototype constructed — 7.83 Hz Schumann resonance delivery confirmed" },
    ],
    stages_completed: ["principles", "research", "design", "poc"],
    notes: "Clinical trials pathway requires IRB approval. Current focus: in vitro cell culture validation.",
  },
  {
    id: "gcom",
    name: "Scalar Wave Communicator (G-Com Mk I)",
    category: "Scalar EM Devices",
    currentStage: "design",
    status: "active",
    year_started: 2005,
    patent: "Trade Secret / PPA Pending",
    description: "Longitudinal (scalar) wave transmission — immune to conventional ECM, passes through Earth and water with no EM radiation signature.",
    funding: [
      { year: 2005, amount: 15000, label: "Internal R&D budget", milestone: false },
      { year: 2019, amount: 120000, label: "DoD exploratory interest (informal)", milestone: true },
      { year: 2024, amount: 340000, label: "Series seed — defense-adjacent investor", milestone: true },
    ],
    breakthroughs: [
      { year: 2005, text: "Bearden documents G-Com concept — contra-wound bifilar antenna cancels transverse EM" },
      { year: 2012, text: "Aharonov-Bohm effect confirmed in sub-THz regime — validates scalar propagation pathway" },
      { year: 2019, text: "Bench model transmits 10 kHz scalar pulse through 6-inch lead shielding (EM null confirmed)" },
      { year: 2024, text: "Prototype design completed — FPGA-controlled DDS modulation chain validated on bench" },
    ],
    stages_completed: ["principles", "research", "design"],
    notes: "Key challenge: matched receiver coil sensitivity below thermal noise floor. Requires cryogenic receiver or SQUID.",
  },
  {
    id: "priore",
    name: "Portable Prioré-Class EM System",
    category: "Bioelectromagnetic Medicine",
    currentStage: "research",
    status: "active",
    year_started: 2008,
    patent: "Based on FR 1,342,772 (Prioré, A.)",
    description: "Phase-conjugate pumping of cellular voltage clamps at 17.6 MHz reverses cellular pathology. ONR and Nobel-validated mechanism.",
    funding: [
      { year: 2008, amount: 10000, label: "Initial literature analysis grant", milestone: false },
      { year: 2015, amount: 65000, label: "Bioelectromagnetics conference funding", milestone: false },
      { year: 2022, amount: 195000, label: "Angel investor — integrative medicine focus", milestone: true },
    ],
    breakthroughs: [
      { year: 2008, text: "French Patent 1,342,772 fully reverse-engineered — 17.6 MHz + 9.4 GHz parameter set derived" },
      { year: 2010, text: "ONR London Branch Report R-5-78 (Bateman, 1978) independently located and analyzed" },
      { year: 2015, text: "Nobel laureate André Lwoff (1965) validation documentation authenticated" },
      { year: 2022, text: "Solid-state DDS implementation of Prioré signal chain completed — awaiting plasma tube assembly" },
    ],
    stages_completed: ["principles", "research"],
    notes: "Regulatory pathway: Class III medical device (FDA 510(k) or De Novo). Currently pre-IDE stage.",
  },
  {
    id: "trz",
    name: "Time-Reversal Zone Cold Fusion Reactor (TRZ-1)",
    category: "Vacuum Energy Extraction",
    currentStage: "poc",
    status: "pending",
    year_started: 2010,
    patent: "PPA Series — 31 figures",
    description: "Phase-conjugate pumping establishes time-reversal zone in palladium cathode matrix — anomalous transmutation at 73 sigma above background (China Lake NWC).",
    funding: [
      { year: 2010, amount: 30000, label: "LENR research consortium", milestone: false },
      { year: 2014, amount: 85000, label: "Shoulder & Fox replication review grant", milestone: false },
      { year: 2020, amount: 250000, label: "Clean energy VC — pre-seed", milestone: true },
      { year: 2024, amount: 620000, label: "Series A — strategic energy fund", milestone: true },
    ],
    breakthroughs: [
      { year: 2010, text: "China Lake NWC 73-sigma result analyzed — time-reversal zone mechanism identified" },
      { year: 2013, text: "Shoulder & Fox transmutation data cross-referenced with TRZ theory — 98% correlation" },
      { year: 2016, text: "Japanese SRI replication series confirmed TRZ preconditions (D/Pd ≥ 0.87 loading)" },
      { year: 2020, text: "First TRZ-1 cell constructed — 3.5W excess heat confirmed over 48h measurement window" },
      { year: 2023, text: "He-4 transmutation products detected via mass spectrometry — 2.4×10¹¹ atoms/W·s" },
    ],
    stages_completed: ["principles", "research", "design", "poc"],
    notes: "Currently stalled on calorimeter calibration. Phase-conjugate pump (532nm laser) alignment requires optical bench.",
  },
  {
    id: "scalar_radar",
    name: "Scalar Pulse Radar Detection System",
    category: "Scalar EM Sensing",
    currentStage: "design",
    status: "active",
    year_started: 2015,
    patent: "PPA 2025 — 18 claims",
    description: "Dual-channel receiver detects scalar AND Hertz pulses. Range by timing differential — scalar arrives instantaneously, Hertz delayed by range/c.",
    funding: [
      { year: 2015, amount: 20000, label: "Defense-adjacent seed", milestone: false },
      { year: 2021, amount: 145000, label: "SBIR Phase I — DoD electronic warfare", milestone: true },
      { year: 2024, amount: 480000, label: "SBIR Phase II award", milestone: true },
    ],
    breakthroughs: [
      { year: 2015, text: "Theoretical ranging model: Δt = R/c differential between scalar and Hertz pulse reception" },
      { year: 2019, text: "FPGA nanosecond timing architecture validated — 1ns resolution on Xilinx Artix-7" },
      { year: 2021, text: "Bench demonstration: scalar pulse detected at 1.5m while E-field instruments read zero" },
      { year: 2024, text: "Dual-channel array design finalized — SBIR Phase II funding secured for prototype build" },
    ],
    stages_completed: ["principles", "research", "design"],
    notes: "Most commercially viable near-term. DoD interest confirmed via SBIR. Prototype build scheduled Q3 2026.",
  },
  {
    id: "woodpecker",
    name: "Woodpecker Grid ELF Detector",
    category: "Scalar EM Sensing",
    currentStage: "prototype",
    status: "completed",
    year_started: 2018,
    patent: "Open Source / Published",
    description: "RTL-SDR + GPS-disciplined dual receiver detecting phase-locked 10 Hz ELF modulation across 5–30 MHz HF band. Auditory output confirmed.",
    funding: [
      { year: 2018, amount: 8000, label: "Self-funded prototype", milestone: false },
      { year: 2020, amount: 45000, label: "Crowdfunding campaign — 340 backers", milestone: true },
      { year: 2022, amount: 90000, label: "SIGINT research grant (academic)", milestone: true },
    ],
    breakthroughs: [
      { year: 2018, text: "RTL-SDR + Ham-It-Up upconverter achieves HF coverage for <$100 hardware" },
      { year: 2019, text: "GNU Radio PRI (Pulse Repetition Interval) detector developed — identifies 10 Hz signature" },
      { year: 2020, text: "First live detection of 10 Hz ELF sideband on multiple HF carriers simultaneously" },
      { year: 2021, text: "Leo Bodnar GPSDO integration achieves 10¹¹ frequency accuracy — phase coherence confirmed" },
      { year: 2022, text: "Dual magnetic loop direction-finding add-on validated — azimuth accuracy ±3°" },
    ],
    stages_completed: ["principles", "research", "design", "poc", "prototype"],
    notes: "Fully operational. Documentation released under open research license. Community replication confirmed in 14 countries.",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(INVENTIONS.map(i => i.category)))];

function StageBar({ stages_completed, currentStage }) {
  return (
    <div className="flex items-center gap-0 mt-3">
      {STAGES.map((stage, i) => {
        const done = stages_completed.includes(stage.id);
        const current = stage.id === currentStage;
        return (
          <div key={stage.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-full h-2 rounded-sm transition-all ${done ? "" : "bg-gray-800"}`}
                style={done ? { backgroundColor: stage.color, opacity: current ? 1 : 0.65 } : {}}
              />
              <span className="text-gray-600 text-[9px] mt-1 truncate w-full text-center leading-tight hidden sm:block">
                {stage.label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`w-1 h-2 flex-shrink-0 ${done && stages_completed.includes(STAGES[i+1]?.id) ? "bg-gray-600" : "bg-gray-800"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FundingChart({ funding }) {
  const max = Math.max(...funding.map(f => f.amount));
  return (
    <div className="space-y-2">
      {funding.map((f, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-gray-500 text-xs w-10 flex-shrink-0">{f.year}</span>
          <div className="flex-1 bg-gray-800 rounded-full h-2 relative">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${(f.amount / max) * 100}%`, backgroundColor: f.milestone ? "#d4af37" : "#4b5563" }}
            />
          </div>
          <span className="text-gray-400 text-xs w-20 text-right flex-shrink-0">
            ${f.amount >= 1000000 ? `${(f.amount/1000000).toFixed(1)}M` : `${(f.amount/1000).toFixed(0)}K`}
          </span>
          {f.milestone && <span className="text-yellow-500 text-xs flex-shrink-0">★</span>}
        </div>
      ))}
      <p className="text-gray-600 text-xs mt-1">★ = key milestone funding event</p>
    </div>
  );
}

function InventionCard({ invention, expanded, onToggle }) {
  const stageObj = STAGES.find(s => s.id === invention.currentStage);
  const statusStyle = STATUS_COLORS[invention.status] || STATUS_COLORS.pending;
  const totalFunding = invention.funding.reduce((s, f) => s + f.amount, 0);

  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all ${expanded ? "border-yellow-700/60" : "border-gray-800 hover:border-gray-700"}`}>
      {/* Card header */}
      <button className="w-full text-left p-5" onClick={onToggle}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full border" style={{ color: stageObj?.color, borderColor: stageObj?.color + "60", backgroundColor: stageObj?.color + "18" }}>
                {stageObj?.label}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusStyle.text} ${statusStyle.border} ${statusStyle.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {invention.status.charAt(0).toUpperCase() + invention.status.slice(1)}
              </span>
              <span className="text-gray-600 text-xs">{invention.category}</span>
            </div>
            <h3 className="text-white font-black text-base leading-tight mb-1">{invention.name}</h3>
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{invention.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-yellow-400 font-black text-sm">${totalFunding >= 1000000 ? `${(totalFunding/1000000).toFixed(2)}M` : `${(totalFunding/1000).toFixed(0)}K`}</p>
              <p className="text-gray-600 text-xs">total funding</p>
            </div>
            {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
          </div>
        </div>
        <StageBar stages_completed={invention.stages_completed} currentStage={invention.currentStage} />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-800 grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
          {/* Technical Breakthroughs */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={13} className="text-yellow-400" />
              <h4 className="text-yellow-400 font-black text-xs uppercase tracking-widest">Technical Breakthroughs</h4>
            </div>
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-800" />
              <div className="space-y-4 pl-7">
                {invention.breakthroughs.map((b, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-yellow-600 border-2 border-gray-900" />
                    <span className="text-yellow-600 text-xs font-bold block mb-0.5">{b.year}</span>
                    <p className="text-gray-300 text-xs leading-relaxed">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Funding & Meta */}
          <div className="p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={13} className="text-green-400" />
                <h4 className="text-green-400 font-black text-xs uppercase tracking-widest">Funding History</h4>
              </div>
              <FundingChart funding={invention.funding} />
            </div>

            <div className="bg-gray-800/50 rounded-xl p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Started</span>
                <span className="text-gray-300 font-bold">{invention.year_started}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Patent / IP Status</span>
                <span className="text-gray-300 font-bold text-right max-w-[60%]">{invention.patent}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Stage Progress</span>
                <span className="text-gray-300 font-bold">{invention.stages_completed.length} / {STAGES.length}</span>
              </div>
            </div>

            {invention.notes && (
              <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-3">
                <p className="text-blue-300 text-xs leading-relaxed">{invention.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InventionTimeline() {
  const [expanded, setExpanded] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterStage, setFilterStage] = useState("All");

  const filtered = INVENTIONS.filter(inv => {
    if (filterCategory !== "All" && inv.category !== filterCategory) return false;
    if (filterStatus !== "All" && inv.status !== filterStatus) return false;
    if (filterStage !== "All" && inv.currentStage !== filterStage) return false;
    return true;
  });

  const stageCounts = STAGES.map(s => ({
    ...s,
    count: INVENTIONS.filter(i => i.currentStage === s.id).length,
  }));

  const totalFunding = INVENTIONS.reduce((sum, inv) => sum + inv.funding.reduce((s, f) => s + f.amount, 0), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-yellow-900/40 bg-gray-900/80 px-5 py-4 flex-shrink-0">
        <div className="flex items-center gap-4 mb-1">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-xl tracking-tight">Invention Development Timeline</h1>
            <p className="text-gray-500 text-xs">Basic Principles → Operational Prototype · Funding milestones · Technical breakthroughs</p>
          </div>
        </div>
      </div>

      {/* Stage legend + stats */}
      <div className="bg-gray-900/60 border-b border-gray-800 px-5 py-4 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          {/* Pipeline overview */}
          <div className="flex items-stretch gap-1 mb-4 overflow-x-auto">
            {stageCounts.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setFilterStage(filterStage === s.id ? "All" : s.id)}
                className={`flex-1 min-w-[100px] rounded-xl p-3 text-center border transition-all ${filterStage === s.id ? "border-white/30" : "border-transparent hover:border-gray-700"}`}
                style={{ backgroundColor: s.color + (filterStage === s.id ? "30" : "15") }}
              >
                <div className="font-black text-xl" style={{ color: s.color }}>{s.count}</div>
                <div className="text-gray-400 text-xs mt-0.5 leading-tight">{s.label}</div>
              </button>
            ))}
          </div>

          {/* Summary stats */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span><span className="text-white font-bold">{INVENTIONS.length}</span> inventions tracked</span>
            <span><span className="text-green-400 font-bold">{INVENTIONS.filter(i => i.status === "completed").length}</span> operational</span>
            <span><span className="text-yellow-400 font-bold">{INVENTIONS.filter(i => i.status === "active").length}</span> active development</span>
            <span><span className="text-yellow-300 font-bold">${(totalFunding / 1000000).toFixed(2)}M</span> total funding tracked</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 border-b border-gray-800/60 bg-gray-950 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Filter size={12} /> Filters:
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-yellow-600"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-yellow-600"
            >
              {["All", "active", "pending", "stalled", "completed"].map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          {(filterCategory !== "All" || filterStatus !== "All" || filterStage !== "All") && (
            <button onClick={() => { setFilterCategory("All"); setFilterStatus("All"); setFilterStage("All"); }}
              className="text-xs text-yellow-500 hover:text-yellow-300 underline transition-colors">
              Clear filters
            </button>
          )}
          <span className="text-gray-600 text-xs ml-auto">{filtered.length} of {INVENTIONS.length} shown</span>
        </div>
      </div>

      {/* Timeline list */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-600">No inventions match the current filters.</div>
          ) : (
            filtered.map(inv => (
              <InventionCard
                key={inv.id}
                invention={inv}
                expanded={expanded === inv.id}
                onToggle={() => setExpanded(expanded === inv.id ? null : inv.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}