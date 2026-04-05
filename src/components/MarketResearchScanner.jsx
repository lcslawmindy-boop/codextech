import { useState } from "react";
import { X, Loader2, Search, TrendingUp, BookOpen, AlertTriangle, RefreshCw, Copy, Check, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TABS = ["market", "priorArt"];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 text-gray-600 hover:text-gray-300 transition-colors">
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
    </button>
  );
}

function RiskBadge({ level }) {
  const map = { Low: "bg-green-950/60 border-green-800 text-green-400", Medium: "bg-yellow-950/60 border-yellow-800 text-yellow-400", High: "bg-red-950/60 border-red-800 text-red-400" };
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${map[level] || map.Medium}`}>{level} Risk</span>;
}

function PriorArtCard({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800/40 transition-colors" onClick={() => setOpen(o => !o)}>
        <span className="text-gray-600 font-mono text-xs mt-0.5 flex-shrink-0">{String(index + 1).padStart(2, "0")}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <p className="text-white font-bold text-sm leading-tight">{item.title}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RiskBadge level={item.conflictRisk} />
              <span className="text-gray-600 text-xs">{item.year}</span>
              {open ? <ChevronUp size={12} className="text-gray-500" /> : <ChevronDown size={12} className="text-gray-500" />}
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">{item.inventor} · {item.source}</p>
        </div>
      </div>
      {open && (
        <div className="border-t border-gray-800 px-4 py-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Key Claims</p>
              <p className="text-gray-300 text-xs leading-relaxed">{item.keyClaims}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Outcome / Status</p>
              <p className="text-gray-300 text-xs leading-relaxed">{item.outcome}</p>
            </div>
          </div>
          <div className="bg-blue-950/20 border border-blue-900/40 rounded-lg p-3">
            <p className="text-blue-400 text-xs font-bold mb-1">🛡 Differentiation Strategy</p>
            <p className="text-blue-200 text-xs leading-relaxed">{item.differentiation}</p>
          </div>
          {item.patentNumber && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-mono bg-gray-800 px-2 py-0.5 rounded">{item.patentNumber}</span>
              <a href={`https://patents.google.com/patent/${item.patentNumber.replace(/\s/g,"")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                <ExternalLink size={10} /> Google Patents
              </a>
              <CopyButton text={item.patentNumber} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MarketPanel({ market }) {
  if (!market) return null;
  return (
    <div className="space-y-4">
      {/* TAM / SAM / SOM */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: "TAM", label: "Total Addressable Market", color: "text-blue-400", border: "border-blue-900/50", bg: "bg-blue-950/20", desc: market.tamDesc },
          { key: "SAM", label: "Serviceable Addressable Market", color: "text-purple-400", border: "border-purple-900/50", bg: "bg-purple-950/20", desc: market.samDesc },
          { key: "SOM", label: "Serviceable Obtainable Market", color: "text-green-400", border: "border-green-900/50", bg: "bg-green-950/20", desc: market.somDesc },
        ].map(m => (
          <div key={m.key} className={`${m.bg} border ${m.border} rounded-2xl p-4`}>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{m.key}</p>
            <p className={`text-2xl font-black ${m.color}`}>{market[m.key] || "—"}</p>
            <p className="text-gray-500 text-xs mt-1 leading-snug">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Growth & CAGR */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Market CAGR</p>
          <p className="text-yellow-400 font-black text-xl">{market.cagr || "—"}</p>
          <p className="text-gray-500 text-xs mt-1">{market.cagrContext}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Forecast Horizon</p>
          <p className="text-white font-black text-xl">{market.forecastYear || "—"}</p>
          <p className="text-gray-500 text-xs mt-1">{market.forecastSource}</p>
        </div>
      </div>

      {/* Key players */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-xs font-bold uppercase mb-2">Key Incumbents & Competitors</p>
        <div className="flex flex-wrap gap-2">
          {(market.keyPlayers || []).map((p, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-300">{p}</span>
          ))}
        </div>
      </div>

      {/* Trends */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-xs font-bold uppercase mb-2">Driving Trends</p>
        <div className="space-y-1.5">
          {(market.trends || []).map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-green-500 mt-0.5">↑</span>
              <p className="text-gray-300 leading-snug">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Entry barriers */}
      <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-4">
        <p className="text-red-400 text-xs font-bold uppercase mb-2">Entry Barriers & Risks</p>
        <div className="space-y-1.5">
          {(market.barriers || []).map((b, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <AlertTriangle size={10} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-200 leading-snug">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      {market.sources?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
          <p className="text-gray-500 text-xs font-bold uppercase mb-2">Research Sources</p>
          <div className="space-y-1">
            {market.sources.map((s, i) => (
              <p key={i} className="text-gray-600 text-xs font-mono">{s}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketResearchScanner({ invention, onClose, onUpdateInvention }) {
  const [tab, setTab] = useState("market");
  const [scanning, setScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState("");
  const [market, setMarket] = useState(null);
  const [priorArt, setPriorArt] = useState([]);
  const [done, setDone] = useState(false);

  const scan = async () => {
    setScanning(true);
    setDone(false);
    setMarket(null);
    setPriorArt([]);

    const invSummary = `
Invention: ${invention.name}
Category: ${invention.category}
Description: ${invention.description}
Solution: ${invention.solution}
Key Principles: ${(invention.principles || []).join(", ")}
Prior Art Diff (existing): ${invention.priorArtDiff || "none"}
Market Size (existing): ${invention.marketSize || "unknown"}
`.trim();

    // Run both scans in parallel
    setScanPhase("Scanning patent databases & technical journals…");
    const [marketResult, priorArtResult] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `You are a market research analyst specializing in deep-tech, energy technology, and electromagnetic devices. Using real market data from public sources, provide a detailed TAM/SAM/SOM market sizing and competitive landscape analysis for the following invention.

${invSummary}

Search publicly available market reports (Grand View Research, MarketsandMarkets, IBISWorld, Statista, Allied Market Research) and provide REAL data with specific $ figures, CAGR, and forecast years. Be specific and cite actual research.

Return a JSON object:
- TAM: string (e.g. "$4.2T")
- tamDesc: string (what TAM covers, 1 sentence, cite source)
- SAM: string (e.g. "$180B")
- samDesc: string (serviceable segment, 1 sentence)
- SOM: string (e.g. "$12B")
- somDesc: string (realistically obtainable share, 1 sentence)
- cagr: string (e.g. "14.3%")
- cagrContext: string (time period + source)
- forecastYear: string (e.g. "2030")
- forecastSource: string (report name + year)
- keyPlayers: array of 8 strings (company names)
- trends: array of 5 strings (key market driving trends, 1 sentence each)
- barriers: array of 4 strings (entry barriers / risks, 1 sentence each)
- sources: array of 5 strings (specific report citations with year)`,
        response_json_schema: {
          type: "object",
          properties: {
            TAM: { type: "string" }, tamDesc: { type: "string" },
            SAM: { type: "string" }, samDesc: { type: "string" },
            SOM: { type: "string" }, somDesc: { type: "string" },
            cagr: { type: "string" }, cagrContext: { type: "string" },
            forecastYear: { type: "string" }, forecastSource: { type: "string" },
            keyPlayers: { type: "array", items: { type: "string" } },
            trends: { type: "array", items: { type: "string" } },
            barriers: { type: "array", items: { type: "string" } },
            sources: { type: "array", items: { type: "string" } },
          }
        },
        add_context_from_internet: true,
        model: "gemini_3_1_pro",
      }),

      base44.integrations.Core.InvokeLLM({
        prompt: `You are a senior USPTO patent examiner and prior art researcher. Search public patent databases (USPTO, EPO, WIPO, Google Patents) and technical journals (IEEE Xplore, arXiv, Nature, Physical Review Letters, Foundations of Physics) for prior art relevant to the following invention.

${invSummary}

Find REAL prior art — actual patents and published papers that are most relevant. Focus especially on scalar electromagnetics, vacuum energy, bioelectromagnetics, phase conjugation, and related fields including Bearden's documented work.

Return a JSON object with a "results" array of 8 prior art items, each:
- title: string (exact title of patent/paper)
- inventor: string (inventor/author name)
- year: number
- source: string (e.g. "USPTO Patent", "IEEE Xplore", "arXiv", "EPO")
- patentNumber: string or null (e.g. "US6362718B1" for patents)
- keyClaims: string (main claims, 2 sentences)
- outcome: string (granted/rejected/published/cited, 1 sentence)
- conflictRisk: string (one of: "Low", "Medium", "High") — how much this conflicts with our invention
- differentiation: string (how our invention differs from this prior art, 2 sentences)`,
        response_json_schema: {
          type: "object",
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  inventor: { type: "string" },
                  year: { type: "number" },
                  source: { type: "string" },
                  patentNumber: { type: "string" },
                  keyClaims: { type: "string" },
                  outcome: { type: "string" },
                  conflictRisk: { type: "string" },
                  differentiation: { type: "string" },
                }
              }
            }
          }
        },
        add_context_from_internet: true,
        model: "gemini_3_1_pro",
      }),
    ]);

    setMarket(marketResult);
    setPriorArt(priorArtResult?.results || []);
    setScanPhase("");
    setScanning(false);
    setDone(true);

    // Offer to push data back to invention
    if (onUpdateInvention && marketResult) {
      const tamSom = `TAM ${marketResult.TAM} · SAM ${marketResult.SAM} · SOM ${marketResult.SOM} · CAGR ${marketResult.cagr} (${marketResult.forecastYear})`;
      onUpdateInvention({ marketSize: tamSom });
    }
  };

  const highRisk = priorArt.filter(p => p.conflictRisk === "High").length;
  const medRisk = priorArt.filter(p => p.conflictRisk === "Medium").length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-950 border border-gray-700 rounded-2xl shadow-2xl flex flex-col" style={{ height: "92vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Search size={14} className="text-blue-400" />
            <span className="text-gray-400 text-xs font-mono uppercase tracking-widest">AI Market Research</span>
            <span className="text-white font-black text-sm truncate max-w-xs">{invention.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {done && (
              <button onClick={scan} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors">
                <RefreshCw size={11} /> Re-scan
              </button>
            )}
            {!done && !scanning && (
              <button onClick={scan}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-black text-sm transition-all shadow-[0_0_20px_rgba(80,140,255,0.3)]">
                <Search size={14} /> Scan Now
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2"><X size={16} /></button>
          </div>
        </div>

        {/* Scanning state */}
        {scanning && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-5 py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-900 border-t-blue-400 rounded-full animate-spin" />
              <Search size={18} className="text-blue-400 absolute inset-0 m-auto" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-white font-black text-lg">Scanning Public Sources</p>
              <p className="text-gray-400 text-sm">{scanPhase}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md text-xs text-gray-600">
              {["USPTO Patent Database", "EPO / WIPO", "Google Patents", "IEEE Xplore", "arXiv.org", "Grand View Research", "MarketsandMarkets", "Physical Review Letters"].map(s => (
                <div key={s} className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  {s}
                </div>
              ))}
            </div>
            <p className="text-blue-500 text-xs">Using Gemini Pro with live internet access · ~30 seconds</p>
          </div>
        )}

        {/* Empty state */}
        {!scanning && !done && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-8">
            <div className="text-5xl mb-4">🔬</div>
            <h2 className="text-white font-black text-xl mb-2">AI Market Research Scanner</h2>
            <p className="text-gray-500 text-sm max-w-lg leading-relaxed mb-6">
              Scans <strong className="text-white">USPTO, EPO, WIPO, Google Patents, IEEE Xplore, arXiv</strong> and live market reports to auto-populate prior art citations and real TAM/SAM/SOM data for this invention.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md mb-6 text-xs">
              {[["📚 Prior Art", "8 patent/paper citations with conflict risk scoring"],
                ["💰 TAM/SAM/SOM", "Real market figures from published reports"],
                ["🏭 Competitors", "Key incumbents and market players"],
                ["🛡 Differentiation", "How this invention stands apart from each citation"]].map(([icon, desc]) => (
                <div key={icon} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-left">
                  <p className="text-white font-bold mb-0.5">{icon}</p>
                  <p className="text-gray-500 leading-snug">{desc}</p>
                </div>
              ))}
            </div>
            <button onClick={scan}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-black text-base transition-all shadow-[0_0_30px_rgba(80,140,255,0.3)]">
              <Search size={16} /> Start AI Scan
            </button>
            <p className="text-gray-600 text-xs mt-2">Live internet access · Gemini Pro · ~30 seconds</p>
          </div>
        )}

        {/* Results */}
        {done && (
          <>
            {/* Tabs + summary */}
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
              <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                <button onClick={() => setTab("market")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === "market" ? "bg-blue-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  <TrendingUp size={11} /> Market Data
                </button>
                <button onClick={() => setTab("priorArt")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === "priorArt" ? "bg-blue-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  <BookOpen size={11} /> Prior Art ({priorArt.length})
                </button>
              </div>
              {tab === "priorArt" && priorArt.length > 0 && (
                <div className="flex items-center gap-3 text-xs">
                  {highRisk > 0 && <span className="text-red-400 font-bold">{highRisk} High Risk</span>}
                  {medRisk > 0 && <span className="text-yellow-400 font-bold">{medRisk} Medium Risk</span>}
                  <span className="text-green-400 font-bold">{priorArt.length - highRisk - medRisk} Low Risk</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {tab === "market" && <MarketPanel market={market} />}
              {tab === "priorArt" && priorArt.map((item, i) => (
                <PriorArtCard key={i} item={item} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}