import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Plus, X, Loader2, TrendingUp, DollarSign, Map, ShoppingCart, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { businessItems } from "../lib/businessItems";
import { base44 } from "@/api/base44Client";

const inventions = businessItems.filter(i => i.category === "Invention");

const MARKET_SECTORS = [
  "Clean Energy", "Defense R&D", "Biotech / Longevity", "AgTech",
  "Medical Devices", "Quantum / Physics", "Consumer Wellness", "Industrial NDT",
];

function DeviceChip({ inv, onRemove }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-sm">
      <span>{inv.icon}</span>
      <span className="text-white font-semibold text-xs leading-snug max-w-[160px] truncate">{inv.title}</span>
      <button onClick={onRemove} className="text-gray-500 hover:text-red-400 transition-colors">
        <X size={12} />
      </button>
    </div>
  );
}

function IPValuationMeter({ low, high }) {
  const avg = (low + high) / 2;
  const tier = avg >= 500 ? "🔥 High Value" : avg >= 100 ? "💡 Mid Value" : "🌱 Early Stage";
  const color = avg >= 500 ? "text-red-400" : avg >= 100 ? "text-yellow-400" : "text-green-400";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-3">IP Valuation Estimate</p>
      <div className="flex items-end gap-3 mb-2">
        <div>
          <p className="text-gray-500 text-xs">Low</p>
          <p className="text-white font-black text-xl">${low}M</p>
        </div>
        <div className="text-gray-600 text-lg font-bold mb-1">—</div>
        <div>
          <p className="text-gray-500 text-xs">High</p>
          <p className="text-white font-black text-xl">${high}M</p>
        </div>
        <div className="ml-auto text-right">
          <p className={`font-black text-sm ${color}`}>{tier}</p>
          <p className="text-gray-500 text-xs">USD (pre-patent)</p>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
          style={{ width: `${Math.min(100, (avg / 1000) * 100)}%` }} />
      </div>
    </div>
  );
}

function RoadmapTimeline({ phases }) {
  return (
    <div className="space-y-3">
      {phases.map((phase, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-black text-cyan-400 flex-shrink-0">
              {i + 1}
            </div>
            {i < phases.length - 1 && <div className="w-px flex-1 bg-gray-800 my-1" />}
          </div>
          <div className="pb-4">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white font-bold text-sm">{phase.title}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-900 text-cyan-400">{phase.timeline}</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{phase.description}</p>
            {phase.milestone && (
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                <CheckCircle2 size={10} /> {phase.milestone}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InventionForge2() {
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState("merge"); // merge | cross-pollinate
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const toggle = (inv) => {
    if (selected.find(s => s.title === inv.title)) {
      setSelected(selected.filter(s => s.title !== inv.title));
    } else if (selected.length < 4) {
      setSelected([...selected, inv]);
    }
  };

  const handleForge = async () => {
    if (selected.length < 2) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const nodeDescriptions = selected.map(inv =>
      `${inv.title}: ${inv.tagline}. ${inv.problem ? "Problem: " + inv.problem : ""} ${inv.beardenSolution ? "Solution: " + inv.beardenSolution : ""}`
    ).join("\n\n");

    const prompt = `You are an advanced IP strategist specializing in scalar electromagnetics, vacuum energy, and bioelectromagnetics.

You are given ${selected.length} invention technologies to ${mode === "merge" ? "MERGE into a single unified invention" : "CROSS-POLLINATE to create a novel hybrid invention"}.

TECHNOLOGIES:
${nodeDescriptions}

Generate a completely new invention concept that synthesizes these technologies. Output a JSON object with EXACTLY these fields:

{
  "hybrid_concept": "Name of the new invention (8 words max)",
  "mechanism": "Technical paragraph: how the technologies combine to create the new system (3-5 sentences)",
  "patent_claims": "3 independent patent claims in legal format (numbered list)",
  "market_applications": "3 specific market applications with estimated market sizes",
  "required_components": "Key hardware/software components needed to build this invention",
  "ip_value_low": <integer: low IP valuation in millions USD>,
  "ip_value_high": <integer: high IP valuation in millions USD>,
  "ip_valuation": "1-2 sentence justification of the valuation",
  "suggested_next_steps": "3 actionable next steps to bring this to market",
  "commercialization_roadmap": [
    {"title": "Phase name", "timeline": "0-6 months", "description": "What happens", "milestone": "Key deliverable"},
    {"title": "Phase name", "timeline": "6-18 months", "description": "What happens", "milestone": "Key deliverable"},
    {"title": "Phase name", "timeline": "18-36 months", "description": "What happens", "milestone": "Key deliverable"},
    {"title": "Phase name", "timeline": "3-5 years", "description": "What happens", "milestone": "Key deliverable"}
  ],
  "market_sectors": ["sector1", "sector2", "sector3"],
  "synergy_score": <integer 1-100: how well these technologies combine>
}`;

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            hybrid_concept: { type: "string" },
            mechanism: { type: "string" },
            patent_claims: { type: "string" },
            market_applications: { type: "string" },
            required_components: { type: "string" },
            ip_value_low: { type: "number" },
            ip_value_high: { type: "number" },
            ip_valuation: { type: "string" },
            suggested_next_steps: { type: "string" },
            commercialization_roadmap: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  timeline: { type: "string" },
                  description: { type: "string" },
                  milestone: { type: "string" }
                }
              }
            },
            market_sectors: { type: "array", items: { type: "string" } },
            synergy_score: { type: "number" }
          }
        }
      });

      // Save to HybridInvention entity
      try {
        await base44.entities.HybridInvention.create({
          hybrid_concept: res.hybrid_concept,
          mechanism: res.mechanism,
          synergy_score: res.synergy_score,
          patent_claims: res.patent_claims,
          market_applications: res.market_applications,
          required_components: res.required_components,
          ip_valuation: res.ip_valuation,
          ip_value_low: res.ip_value_low,
          ip_value_high: res.ip_value_high,
          suggested_next_steps: res.suggested_next_steps,
          input_nodes: selected.map(s => ({ id: s.title, label: s.title, group: "Invention" })),
          mode,
          market_sectors: res.market_sectors,
          status: "draft",
        });
      } catch { /* non-critical */ }

      setResult(res);
    } catch (e) {
      setError("Failed to generate hybrid invention. Please try again.");
      console.error(e);
    }
    setLoading(false);
  };

  const handleCheckout = async () => {
    if (!result) return;
    if (window.self !== window.top) {
      alert("Checkout only works from the published app, not inside the editor.");
      return;
    }
    setCheckoutLoading(true);
    try {
      const origin = window.location.origin;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: `IP Package: ${result.hybrid_concept}`,
        priceInCents: 49700,
        description: "Full IP package: patent claims, commercialization roadmap, market analysis",
        category: "IP",
        successUrl: `${origin}/invention-forge`,
        cancelUrl: `${origin}/invention-forge`,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (e) { console.error(e); }
    setCheckoutLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/business" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" /> Invention Forge
            </h1>
            <p className="text-gray-500 text-xs">Mix technologies to create new IP — with valuation, patent claims & commercialization roadmap</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <button onClick={() => { setResult(null); setSelected([]); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-700 text-gray-400 text-xs hover:bg-gray-800 transition-all">
              <RotateCcw size={13} /> New Forge
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: device selector */}
        <div className="w-72 flex-shrink-0 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/50">
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">Select 2–4 Technologies</p>
            <p className="text-gray-500 text-xs">Click to add. Max 4 selected.</p>
          </div>

          {/* Mode toggle */}
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-gray-400 text-xs mb-2 font-semibold">Forge Mode</p>
            <div className="flex gap-2">
              {[["merge", "🔗 Merge"], ["cross-pollinate", "✨ Cross-Pollinate"]].map(([m, label]) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === m ? "bg-yellow-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="px-4 py-3 border-b border-gray-800 flex flex-wrap gap-2">
              {selected.map(inv => (
                <DeviceChip key={inv.title} inv={inv} onRemove={() => toggle(inv)} />
              ))}
            </div>
          )}

          {/* Invention list */}
          <div className="flex-1 overflow-y-auto">
            {inventions.map((inv, i) => {
              const isSelected = !!selected.find(s => s.title === inv.title);
              const disabled = !isSelected && selected.length >= 4;
              return (
                <button key={i} onClick={() => toggle(inv)} disabled={disabled}
                  className={`w-full text-left px-4 py-2.5 border-b border-gray-800/60 flex items-start gap-2.5 transition-all ${
                    isSelected ? "bg-yellow-950/30 border-l-2 border-l-yellow-500" :
                    disabled ? "opacity-30 cursor-not-allowed" :
                    "hover:bg-gray-800/40"
                  }`}>
                  <span className="text-lg flex-shrink-0 mt-0.5">{inv.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold leading-snug ${isSelected ? "text-yellow-300" : "text-gray-300"}`}>
                      {inv.title}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5 truncate">{inv.price}</p>
                  </div>
                  {isSelected && <CheckCircle2 size={13} className="text-yellow-400 flex-shrink-0 mt-1 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Forge button */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleForge}
              disabled={selected.length < 2 || loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-black text-sm bg-yellow-700 hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
              {loading ? "Forging..." : selected.length < 2 ? `Select ${2 - selected.length} more` : `⚡ Forge New IP`}
            </button>
          </div>
        </div>

        {/* Right: results */}
        <div className="flex-1 overflow-y-auto p-6">
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <div className="w-24 h-24 rounded-3xl bg-yellow-950/30 border border-yellow-900/40 flex items-center justify-center text-5xl mb-6">⚡</div>
              <h2 className="text-white font-black text-2xl mb-3">Invention Forge</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Select 2–4 device technologies from the left panel, choose a forge mode, and generate a brand-new IP concept with:
              </p>
              <div className="grid grid-cols-2 gap-3 text-left w-full">
                {[
                  ["🔬", "Hybrid concept name & mechanism"],
                  ["📜", "Patent claims (3 independent)"],
                  ["💰", "IP valuation estimate"],
                  ["🗺️", "Commercialization roadmap"],
                  ["📈", "Market applications & sizing"],
                  ["✅", "Next steps to file & launch"],
                ].map(([icon, text], i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-gray-300">
                    <span>{icon}</span> {text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 size={40} className="text-yellow-400 animate-spin mb-4" />
              <p className="text-white font-bold text-lg">Forging new IP...</p>
              <p className="text-gray-500 text-sm mt-2">Analyzing technology synergies & generating patent claims</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-red-950/30 border border-red-800 rounded-2xl p-6 max-w-md text-center">
                <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
                <p className="text-white font-bold mb-2">Generation Failed</p>
                <p className="text-gray-400 text-sm">{error}</p>
                <button onClick={() => setError(null)} className="mt-4 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Hero */}
              <div className="bg-gradient-to-br from-yellow-950/40 to-gray-900 border border-yellow-800/40 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-800/50 border border-yellow-700 text-yellow-300 font-bold uppercase tracking-wider">
                        {mode === "merge" ? "🔗 Merged" : "✨ Cross-Pollinated"} IP
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
                        Synergy Score: {result.synergy_score}/100
                      </span>
                    </div>
                    <h2 className="text-white font-black text-2xl mb-1">{result.hybrid_concept}</h2>
                    <div className="flex flex-wrap gap-2">
                      {result.market_sectors?.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-500 text-xs mb-1">Input technologies</p>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {selected.map(inv => (
                        <span key={inv.title} className="text-lg">{inv.icon}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/60 rounded-xl p-4">
                  <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">Mechanism</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.mechanism}</p>
                </div>
              </div>

              {/* IP Valuation */}
              <IPValuationMeter low={result.ip_value_low} high={result.ip_value_high} />
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-xs leading-relaxed italic">{result.ip_valuation}</p>
              </div>

              {/* Patent Claims */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                  📜 Patent Claims (Draft — 3 Independent)
                </p>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-mono bg-gray-950/60 rounded-xl p-4">
                  {result.patent_claims}
                </div>
                <p className="text-gray-600 text-xs mt-2">⚠ Draft only — consult a patent attorney before filing</p>
              </div>

              {/* Market Applications */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-green-400 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp size={12} /> Market Applications
                </p>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{result.market_applications}</p>
              </div>

              {/* Required Components */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-3">Required Components</p>
                <p className="text-gray-300 text-sm leading-relaxed">{result.required_components}</p>
              </div>

              {/* Commercialization Roadmap */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Map size={12} /> Commercialization Roadmap
                </p>
                <RoadmapTimeline phases={result.commercialization_roadmap || []} />
              </div>

              {/* Next Steps */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-white font-bold text-xs uppercase tracking-wider mb-3">Suggested Next Steps</p>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{result.suggested_next_steps}</p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-yellow-950/30 to-gray-900 border border-yellow-800/40 rounded-2xl p-6 text-center">
                <h3 className="text-white font-black text-xl mb-2">Get the Full IP Package</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Download a full PDF package with all patent claims, commercialization roadmap, market analysis, and component specs.
                </p>
                <button onClick={handleCheckout} disabled={checkoutLoading}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-black text-sm bg-yellow-700 hover:bg-yellow-600 disabled:opacity-50 transition-all max-w-sm mx-auto">
                  {checkoutLoading ? <Loader2 size={15} className="animate-spin" /> : <ShoppingCart size={15} />}
                  {checkoutLoading ? "Processing..." : "Get Full IP Package — $497"}
                </button>
                <p className="text-gray-600 text-xs mt-3">Includes PDF export, filing checklist & attorney-ready claim format</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}