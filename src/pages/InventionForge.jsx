import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, Download, DollarSign, Rocket, TrendingUp, Shield, CheckSquare, Square, FileDown, X, Film, BookOpen } from "lucide-react";
import InventionBuildVideo from "../components/InventionBuildVideo";
import PitchDeckExporter from "../components/PitchDeckExporter";
import InventionPatentDrafter from "../components/InventionPatentDrafter";
import MarketResearchScanner from "../components/MarketResearchScanner";
import CitationGenerator from "../components/CitationGenerator";
import { base44 } from "@/api/base44Client";

const SEED_DOMAINS = [
  { id: "vacuum_energy", label: "Vacuum Energy Extraction", icon: "⚡", desc: "MEG, anenergy pump, Moray-class devices" },
  { id: "bioelectromagnetics", label: "Bioelectromagnetics / Healing", icon: "💊", desc: "Priore-class, MCCS photon therapy, telomere regeneration" },
  { id: "scalar_comm", label: "Scalar Wave Communication", icon: "📡", desc: "G-Com / longitudinal wave transmission, no EM pollution" },
  { id: "time_reversal", label: "Time-Reversal Zone Applications", icon: "⚛️", desc: "TRZ cold fusion, phase conjugate mirrors, anomalous transmutation" },
  { id: "consciousness", label: "Psychoenergetics / Consciousness", icon: "🧠", desc: "Mind-body coupling, intention-based engineering, hyperspatial interfaces" },
  { id: "emf_protection", label: "EMF Shielding / Protection", icon: "🛡️", desc: "Personal, architectural, grid-level scalar countermeasures" },
  { id: "materials", label: "Novel Materials / Resonators", icon: "🔮", desc: "Nanocrystalline flux-transfer, scalar-resonant alloys, Fröhlich materials" },
  { id: "agriculture", label: "Scalar Agriculture / BioField", icon: "🌱", desc: "Morphogenetic field enhancement, crop yield, water structuring" },
];

const STAGE_OPTIONS = ["Concept", "Prototype", "Patent-Ready", "Seeking Co-Inventor", "Seeking Funding"];
const MARKET_OPTIONS = ["Medical / Health", "Defense / Security", "Energy / Utilities", "Consumer Electronics", "Agriculture", "Telecommunications", "Materials Science"];

function FinancialTable({ fin }) {
  if (!fin) return null;
  const rows = fin.projections || [];
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            {["Year", "Revenue", "COGS", "Gross Profit", "EBITDA", "Cumulative Investment"].map(h => (
              <th key={h} className="text-left py-2 pr-4 text-gray-400 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/40">
              <td className="py-2 pr-4 text-gray-300 font-bold">{r.year}</td>
              <td className="py-2 pr-4 text-green-400 font-mono">{r.revenue}</td>
              <td className="py-2 pr-4 text-red-400 font-mono">{r.cogs}</td>
              <td className="py-2 pr-4 text-blue-400 font-mono">{r.grossProfit}</td>
              <td className="py-2 pr-4 text-yellow-400 font-mono">{r.ebitda}</td>
              <td className="py-2 pr-4 text-purple-400 font-mono">{r.cumulativeInvestment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExportBar({ inventions, selected, onToggle, onSelectAll, onClear }) {
  const count = selected.size;
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const handleExport = async () => {
    if (!count) return;
    setExporting(true);
    setExportError("");
    const selectedInventions = inventions.filter((_, i) => selected.has(i));
    const response = await base44.functions.invoke("exportInventionBrochure", {
      inventions: selectedInventions,
      title: `scalar-em-investment-brochure-${Date.now()}`,
    });
    // response.data is the axios response; for binary we need to handle blob
    // Since base44 functions return JSON by default, we call fetch directly
    try {
      const { data } = await base44.functions.invoke("exportInventionBrochure", {
        inventions: selectedInventions,
        title: `scalar-em-brochure`,
      });
      setExportError("Use direct download below.");
    } catch(e) {
      // Fallback: direct fetch for binary PDF
    }
    setExporting(false);
  };

  const handleDirectExport = async () => {
    if (!count) return;
    setExporting(true);
    setExportError("");
    const selectedInventions = inventions.filter((_, i) => selected.has(i));
    const res = await fetch(`/functions/exportInventionBrochure`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ inventions: selectedInventions, title: "zenith-apex-scalar-em-brochure" }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Export failed" }));
      setExportError(err.error || "Export failed");
      setExporting(false);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zenith-apex-scalar-em-brochure.pdf";
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  if (!inventions.length) return null;

  return (
    <div className={`sticky top-14 z-30 transition-all ${count > 0 ? "opacity-100" : "opacity-60"}  border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm px-5 py-2.5`}>
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onSelectAll} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
          <CheckSquare size={13} /> Select All ({inventions.length})
        </button>
        {count > 0 && (
          <button onClick={onClear} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
            <X size={11} /> Clear
          </button>
        )}
        <div className="flex-1" />
        {count > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{count} selected</span>
            <button
              onClick={handleDirectExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-700 to-cyan-700 hover:from-green-600 hover:to-cyan-600 text-white font-black text-xs disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,200,100,0.3)]"
            >
              {exporting ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
              {exporting ? "Generating PDF…" : `Export ${count} Invention${count > 1 ? "s" : ""} as PDF Brochure`}
            </button>
          </div>
        )}
        {exportError && <span className="text-red-400 text-xs">{exportError}</span>}
      </div>
    </div>
  );
}

function InventionCard({ inv, index, selected, onToggle, onBuildVideo, onDraftPatent, onResearch, onCitations }) {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "specs", "ip", "financials", "launch"];

  const colors = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"];
  const color = colors[index % colors.length];

  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all ${selected ? "ring-2" : "border-gray-800"}`}
      style={{ borderLeftColor: color, borderLeftWidth: 3, ringColor: color, boxShadow: selected ? `0 0 0 2px ${color}` : "none" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800">
        <div className="flex items-start gap-3">
        {/* Selection checkbox */}
        <button onClick={onToggle} className="mt-1 flex-shrink-0 transition-colors" style={{ color: selected ? color : "#4b5563" }}>
          {selected ? <CheckSquare size={16} /> : <Square size={16} />}
        </button>
        <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider" style={{ backgroundColor: color + "22", color }}>{inv.category}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300">{inv.stage}</span>
              <span className="text-green-400 font-black text-sm">{inv.ipValuation}</span>
            </div>
            <h3 className="text-white font-black text-lg leading-tight">{inv.name}</h3>
            <p className="text-gray-400 text-xs mt-1 italic">"{inv.tagline}"</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-gray-500 text-xs">Ask</p>
            <p className="text-white font-black text-sm">{inv.fundingAsk}</p>
            <p className="text-gray-500 text-xs">{inv.equity} equity</p>
          </div>
        </div>
        </div>
        </div>
        {/* Tabs + Build Video */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <div className="flex gap-1 flex-wrap flex-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${tab === t ? "text-white" : "text-gray-500 hover:text-gray-300 bg-gray-800/50"}`}
              style={tab === t ? { backgroundColor: color + "33", color } : {}}>
              {t === "ip" ? "IP & Patents" : t === "financials" ? "📊 Financials" : t === "launch" ? "🚀 Launch Plan" : t}
            </button>
          ))}
          </div>
          <button onClick={onBuildVideo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90 flex-shrink-0 text-white"
            style={{ backgroundColor: color }}>
            <Film size={11} /> 🎬 Build Video
          </button>
          <button onClick={onDraftPatent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90 flex-shrink-0 bg-yellow-700 hover:bg-yellow-600 text-white">
            📋 Draft Patent
          </button>
          <button onClick={onResearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90 flex-shrink-0 bg-cyan-700 hover:bg-cyan-600 text-white">
            🔬 Market Research
          </button>
          <button onClick={onCitations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90 flex-shrink-0 bg-indigo-700 hover:bg-indigo-600 text-white">
            <BookOpen size={11} /> 📚 Citations
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5 py-4 text-sm text-gray-300 leading-relaxed">
        {tab === "overview" && (
          <div className="space-y-3">
            <p>{inv.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/60 rounded-xl p-3">
                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Problem</p>
                <p className="text-xs">{inv.problem}</p>
              </div>
              <div className="bg-gray-800/60 rounded-xl p-3">
                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Solution</p>
                <p className="text-xs">{inv.solution}</p>
              </div>
            </div>
            <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-3">
              <p className="text-blue-400 text-xs font-bold mb-1">📏 Market Size</p>
              <p className="text-blue-200 text-xs">{inv.marketSize}</p>
            </div>
          </div>
        )}
        {tab === "specs" && (
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Technical Specifications</p>
              <ul className="space-y-1.5">
                {(inv.specs || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-gray-600 font-mono mt-0.5">→</span>
                    <span><span className="text-white font-semibold">{s.label}:</span> {s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Key Bearden Principles Applied</p>
              <div className="flex flex-wrap gap-2">
                {(inv.principles || []).map((p, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-950/50 border border-purple-800 text-purple-300">{p}</span>
                ))}
              </div>
            </div>
            <div className="bg-yellow-950/20 border border-yellow-900/30 rounded-xl p-3">
              <p className="text-yellow-400 text-xs font-bold mb-1">⚙️ Manufacturing Pathway</p>
              <p className="text-yellow-200 text-xs">{inv.manufacturing}</p>
            </div>
          </div>
        )}
        {tab === "ip" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/60 rounded-xl p-3">
                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">IP Type</p>
                <p className="text-white text-xs font-bold">{inv.ipType}</p>
              </div>
              <div className="bg-gray-800/60 rounded-xl p-3">
                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Valuation Method</p>
                <p className="text-white text-xs font-bold">{inv.valuationMethod}</p>
              </div>
              <div className="bg-green-950/30 border border-green-900/40 rounded-xl p-3 col-span-2">
                <p className="text-green-400 text-xs font-bold mb-1">💵 IP Valuation: {inv.ipValuation}</p>
                <p className="text-green-200 text-xs">{inv.valuationRationale}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Prior Art Differentiation</p>
              <p className="text-xs text-gray-300">{inv.priorArtDiff}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Filing Strategy</p>
              <p className="text-xs text-gray-300">{inv.filingStrategy}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(inv.jurisdictions || []).map((j, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-950/50 border border-blue-800 text-blue-300">{j}</span>
              ))}
            </div>
          </div>
        )}
        {tab === "financials" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Pre-Seed Ask", value: inv.preSeed, color: "#a855f7" },
                { label: "Series A Target", value: inv.seriesA, color: "#3b82f6" },
                { label: "5-yr Revenue", value: inv.fiveYrRevenue, color: "#22c55e" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-800/60 rounded-xl p-3 text-center">
                  <p className="font-black text-lg" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            <FinancialTable fin={inv.financials} />
            <div className="bg-gray-800/40 rounded-xl p-3">
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Key Assumptions</p>
              <ul className="space-y-1">
                {(inv.financials?.assumptions || []).map((a, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-gray-600">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {tab === "launch" && (
          <div className="space-y-3">
            <div className="space-y-2">
              {(inv.launchPlan || []).map((phase, i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl p-3 border-l-2" style={{ borderLeftColor: color }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-bold text-xs">{phase.phase}</p>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">{phase.timeline}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{phase.actions}</p>
                  {phase.milestone && <p className="text-xs mt-1.5" style={{ color }}><strong>Milestone:</strong> {phase.milestone}</p>}
                </div>
              ))}
            </div>
            <div className="bg-gray-800/40 rounded-xl p-3">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">Go-to-Market Channel Mix</p>
              <div className="flex flex-wrap gap-2">
                {(inv.channels || []).map((c, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InventionForge() {
  const [buildVideoInvention, setBuildVideoInvention] = useState(null);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [patentInvention, setPatentInvention] = useState(null);
  const [researchInvention, setResearchInvention] = useState(null);
  const [citationInvention, setCitationInvention] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState(["vacuum_energy", "bioelectromagnetics"]);
  const [selectedMarkets, setSelectedMarkets] = useState(["Medical / Health", "Energy / Utilities"]);
  const [inventionCount, setInventionCount] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [inventions, setInventions] = useState([]);
  const [error, setError] = useState("");
  const [selectedForExport, setSelectedForExport] = useState(new Set());

  const toggleExportSelection = (i) => setSelectedForExport(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });
  const selectAll = () => setSelectedForExport(new Set(inventions.map((_, i) => i)));
  const clearSelection = () => setSelectedForExport(new Set());

  const toggleDomain = (id) => setSelectedDomains(d => d.includes(id) ? d.filter(x => x !== id) : [...d, id]);
  const toggleMarket = (m) => setSelectedMarkets(ms => ms.includes(m) ? ms.filter(x => x !== m) : [...ms, m]);

  const generate = async () => {
    if (!selectedDomains.length) return;
    setGenerating(true);
    setError("");
    setInventions([]);
    setSelectedForExport(new Set());

    const domainLabels = SEED_DOMAINS.filter(d => selectedDomains.includes(d.id)).map(d => `${d.label} (${d.desc})`).join(", ");
    const collected = [];

    // Generate one invention at a time to avoid timeout
    for (let i = 0; i < inventionCount; i++) {
      const existingNames = collected.map(inv => inv.name).join(", ");
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a senior IP attorney and deep-tech venture capitalist specializing in Bearden scalar electromagnetics. Generate ONE novel, investor-ready invention concept (invention ${i + 1} of ${inventionCount}).\n\nDomains: ${domainLabels}\nTarget markets: ${selectedMarkets.join(", ")}\n${existingNames ? `Already generated (do NOT repeat): ${existingNames}\n` : ""}\nReturn a JSON object with these fields:\n- name, tagline, category (one of: ${selectedMarkets.join(" | ")}), stage (Concept|Prototype|Patent-Ready)\n- description (3 sentences), problem (1 sentence), solution (1-2 sentences)\n- marketSize (TAM/SAM/SOM with $ figures), ipValuation (e.g. "$4.2M"), valuationMethod, valuationRationale (2 sentences)\n- ipType, priorArtDiff (1-2 sentences), filingStrategy (1 sentence)\n- jurisdictions (array of 4 strings), fundingAsk, equity, preSeed, seriesA, fiveYrRevenue\n- specs: array of 6 objects {label, value}\n- principles: array of 5 strings (Bearden concepts)\n- manufacturing (2 sentences)\n- financials: {projections: array of 5 {year, revenue, cogs, grossProfit, ebitda, cumulativeInvestment}, assumptions: array of 4 strings}\n- launchPlan: array of 4 {phase, timeline, actions, milestone}\n- channels: array of 5 strings\n\nUse specific $ numbers. Ground in Bearden's documented theory.`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" }, tagline: { type: "string" },
            category: { type: "string" }, stage: { type: "string" },
            description: { type: "string" }, problem: { type: "string" },
            solution: { type: "string" }, marketSize: { type: "string" },
            ipValuation: { type: "string" }, valuationMethod: { type: "string" },
            valuationRationale: { type: "string" }, ipType: { type: "string" },
            priorArtDiff: { type: "string" }, filingStrategy: { type: "string" },
            jurisdictions: { type: "array", items: { type: "string" } },
            fundingAsk: { type: "string" }, equity: { type: "string" },
            preSeed: { type: "string" }, seriesA: { type: "string" },
            fiveYrRevenue: { type: "string" },
            specs: { type: "array", items: { type: "object" } },
            principles: { type: "array", items: { type: "string" } },
            manufacturing: { type: "string" },
            financials: { type: "object" },
            launchPlan: { type: "array", items: { type: "object" } },
            channels: { type: "array", items: { type: "string" } },
          }
        },
        model: "gpt_5"
      });
      collected.push(result);
      // Show inventions as they arrive
      setInventions([...collected]);
      setSelectedForExport(new Set(collected.map((_, idx) => idx)));
    }

    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base tracking-tight">⚡ AI Invention Forge</h1>
            <p className="text-gray-500 text-xs">Generate novel scalar EM inventions with full IP valuation + investor financials</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {inventions.length > 0 && (
            <button onClick={() => setShowPitchDeck(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white text-xs font-black transition-all shadow-[0_0_15px_rgba(80,140,255,0.3)]">
              📊 Export VC Deck
            </button>
          )}
          <Link to="/admin-videos" className="px-3 py-1.5 rounded-lg bg-purple-900/50 border border-purple-700 text-purple-300 text-xs font-bold">🎬 Video Library</Link>
          <Link to="/provisional-patent" className="px-3 py-1.5 rounded-lg bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-xs font-bold">📋 Draft Patent</Link>
          <Link to="/dark-timeline" className="px-3 py-1.5 rounded-lg bg-red-900/50 border border-red-700 text-red-300 text-xs font-bold">🌍 Dark Timeline</Link>
          <Link to="/business" className="px-3 py-1.5 rounded-lg bg-green-900/50 border border-green-700 text-green-300 text-xs font-bold">💼 Business Models</Link>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row flex-1">
        {/* Sidebar controls */}
        <div className="xl:w-80 flex-shrink-0 border-b xl:border-b-0 xl:border-r border-gray-800 p-5 space-y-5">
          <div>
            <p className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Sparkles size={14} className="text-blue-400" /> Technology Domains</p>
            <div className="space-y-2">
              {SEED_DOMAINS.map(d => (
                <button key={d.id} onClick={() => toggleDomain(d.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-all text-xs ${selectedDomains.includes(d.id) ? "bg-blue-950/40 border-blue-700 text-blue-200" : "border-gray-800 text-gray-500 hover:border-gray-600"}`}>
                  <span className="mr-2">{d.icon}</span>
                  <span className="font-semibold">{d.label}</span>
                  <p className="text-gray-600 mt-0.5 ml-6">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-green-400" /> Target Markets</p>
            <div className="flex flex-wrap gap-2">
              {MARKET_OPTIONS.map(m => (
                <button key={m} onClick={() => toggleMarket(m)}
                  className={`px-2 py-1 rounded-lg text-xs border transition-all ${selectedMarkets.includes(m) ? "bg-green-950/50 border-green-700 text-green-300" : "border-gray-800 text-gray-600 hover:border-gray-600"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-2">Number of Inventions</p>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setInventionCount(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-black border transition-all ${inventionCount === n ? "bg-purple-950/50 border-purple-600 text-purple-300" : "border-gray-800 text-gray-500 hover:border-gray-600"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={generating || !selectedDomains.length}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-black text-base disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(100,100,255,0.3)]"
          >
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {generating ? "Forging Inventions…" : "Generate Inventions"}
          </button>

          {generating && (
            <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-3 text-xs text-blue-300">
              <p className="font-bold mb-1">Generating inventions one by one…</p>
              <p className="text-blue-200">{inventions.length} / {inventionCount} complete — new inventions appear as they arrive.</p>
              <p className="text-blue-500 mt-1">Each invention takes ~15 seconds. Total ~{inventionCount * 15}s.</p>
            </div>
          )}

          {/* Info cards */}
          <div className="space-y-2">
            {[
              { icon: <Shield size={12} />, color: "#22c55e", label: "IP Protected", desc: "Each invention includes filing strategy + prior art analysis" },
              { icon: <DollarSign size={12} />, color: "#f59e0b", label: "Investor-Ready", desc: "5-year P&L projections + Series A pitch structure" },
              { icon: <Rocket size={12} />, color: "#a855f7", label: "Launch Plan", desc: "Phase-by-phase GTM with milestones and channel mix" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-gray-900 border border-gray-800 rounded-xl p-3">
                <span style={{ color: item.color }}>{item.icon}</span>
                <div>
                  <p className="text-white font-semibold text-xs">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invention cards */}
        <div className="flex-1 p-5 overflow-y-auto">
          {inventions.length === 0 && !generating && (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="text-6xl mb-4">🧬</div>
              <h2 className="text-white font-black text-2xl mb-2">Invention Forge</h2>
              <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                Select technology domains + target markets, then click <strong className="text-white">Generate Inventions</strong>. The AI will synthesize novel scalar EM inventions grounded in Bearden's documented framework — complete with IP valuation, investor financials, and launch plans.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm text-xs text-gray-600">
                {["MEG-class COP>1 generators", "MCCS healing devices", "Scalar comm networks", "TRZ transmutation tech", "Psychoenergetics interfaces", "Morphogenetic field tools"].map((x, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">✦ {x}</div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-950/40 border border-red-800 rounded-xl p-4 mb-4 text-red-300 text-sm">{error}</div>
          )}

          <ExportBar
            inventions={inventions}
            selected={selectedForExport}
            onToggle={toggleExportSelection}
            onSelectAll={selectAll}
            onClear={clearSelection}
          />
          <div className="space-y-5 mt-4">
            {inventions.map((inv, i) => (
              <InventionCard key={i} inv={inv} index={i} selected={selectedForExport.has(i)} onToggle={() => toggleExportSelection(i)} onBuildVideo={() => setBuildVideoInvention(inv)} onDraftPatent={() => setPatentInvention(inv)} onResearch={() => setResearchInvention(inv)} onCitations={() => setCitationInvention(inv)} />
            ))}
          </div>

          {buildVideoInvention && (
            <InventionBuildVideo invention={buildVideoInvention} onClose={() => setBuildVideoInvention(null)} />
          )}
          {showPitchDeck && inventions.length > 0 && (
            <PitchDeckExporter inventions={inventions} onClose={() => setShowPitchDeck(false)} />
          )}
          {patentInvention && (
            <InventionPatentDrafter invention={patentInvention} onClose={() => setPatentInvention(null)} />
          )}
          {researchInvention && (
            <MarketResearchScanner
              invention={researchInvention}
              onClose={() => setResearchInvention(null)}
              onUpdateInvention={(updates) => {
                setInventions(prev => prev.map(inv => inv.name === researchInvention.name ? { ...inv, ...updates } : inv));
              }}
            />
          )}
          {citationInvention && (
            <CitationGenerator
              invention={citationInvention}
              onClose={() => setCitationInvention(null)}
            />
          )}
          {inventions.length > 0 && (
            <div className="mt-6 text-center text-gray-600 text-xs border-t border-gray-800 pt-4">
              {inventions.length} inventions generated · All IP valuations are estimates for pitch purposes · Consult a registered patent attorney before filing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}