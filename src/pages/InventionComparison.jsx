import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, GitCompare, CheckCircle, X, DollarSign, Zap, Package } from "lucide-react";
import { Link } from "react-router-dom";

function parseBOM(inv) {
  if (!inv.required_components) return [];
  return inv.required_components.split(",").map(c => c.trim()).filter(Boolean);
}

function parseValueRange(inv) {
  const low = inv.ip_value_low || 0;
  const high = inv.ip_value_high || 0;
  return low && high ? `$${low}M – $${high}M` : inv.ip_valuation || "N/A";
}

function ScoreBar({ value, max = 100, color = "bg-cyan-500" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-gray-800 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function InventionComparison() {
  const [inventions, setInventions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.HybridInvention.list("-created_date", 50).then(data => {
      setInventions(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggle = (inv) => {
    if (selected.find(s => s.id === inv.id)) {
      setSelected(selected.filter(s => s.id !== inv.id));
    } else if (selected.length < 4) {
      setSelected([...selected, inv]);
    }
  };

  // Collect all unique BOM components across selected inventions
  const allComponents = [...new Set(selected.flatMap(inv => parseBOM(inv)))];

  const colWidth = selected.length > 0 ? `${Math.floor(100 / (selected.length + 1))}%` : "25%";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/invention-dossier" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-2">
            <GitCompare size={18} className="text-cyan-400" />
            <div>
              <h1 className="text-white font-bold text-lg">Invention Comparison</h1>
              <p className="text-gray-500 text-xs">Side-by-side BOM, tech requirements & cost analysis</p>
            </div>
          </div>
          {selected.length > 0 && (
            <span className="ml-auto px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-700 text-cyan-300 text-xs font-bold">
              {selected.length} selected
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Selection Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-1">Select Inventions to Compare</h2>
          <p className="text-gray-500 text-xs mb-5">Pick 2–4 inventions. Select to add to the comparison table below.</p>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading inventions...</div>
          ) : inventions.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <GitCompare size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No saved inventions found.</p>
              <Link to="/research-membership" className="text-cyan-400 text-xs underline mt-1 inline-block">Generate a dossier first →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {inventions.map(inv => {
                const isSelected = !!selected.find(s => s.id === inv.id);
                const disabled = !isSelected && selected.length >= 4;
                return (
                  <button
                    key={inv.id}
                    onClick={() => !disabled && toggle(inv)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected ? "border-cyan-500 bg-cyan-950/30" : disabled ? "border-gray-800 opacity-40 cursor-not-allowed" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm leading-snug">{inv.hybrid_concept || "Unnamed"}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {inv.synergy_score && <span className="text-cyan-400 text-xs"><Zap size={10} className="inline mr-0.5" />Score: {inv.synergy_score}</span>}
                          {(inv.ip_value_low || inv.ip_value_high) && <span className="text-green-400 text-xs"><DollarSign size={10} className="inline" />${inv.ip_value_low}M–${inv.ip_value_high}M</span>}
                        </div>
                      </div>
                      {isSelected ? <CheckCircle size={18} className="text-cyan-400 flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-600 flex-shrink-0 mt-0.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selected.length >= 2 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-white font-black text-lg">Side-by-Side Comparison</h2>
              <button onClick={() => setSelected([])} className="text-gray-500 hover:text-white text-xs flex items-center gap-1 transition-colors">
                <X size={12} /> Clear
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* Header Row */}
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-500 font-bold text-xs uppercase tracking-widest px-6 py-3 w-48 bg-gray-900/80">Attribute</th>
                    {selected.map(inv => (
                      <th key={inv.id} className="text-left px-4 py-3 bg-gray-800/50">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-white font-bold text-sm leading-snug">{inv.hybrid_concept || "Unnamed"}</p>
                          <button onClick={() => toggle(inv)} className="text-gray-600 hover:text-red-400 flex-shrink-0 mt-0.5">
                            <X size={12} />
                          </button>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${inv.status === "filed" ? "bg-green-900/40 text-green-300" : inv.status === "patented" ? "bg-blue-900/40 text-blue-300" : "bg-gray-700 text-gray-400"}`}>
                          {inv.status || "draft"}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Synergy Score */}
                  <tr className="border-b border-gray-800/60">
                    <td className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider bg-gray-900/40">Synergy Score</td>
                    {selected.map(inv => (
                      <td key={inv.id} className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-cyan-400 font-black text-lg w-10">{inv.synergy_score || "—"}</span>
                          {inv.synergy_score && <ScoreBar value={inv.synergy_score} color="bg-cyan-500" />}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* IP Valuation */}
                  <tr className="border-b border-gray-800/60">
                    <td className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider bg-gray-900/40">IP Valuation</td>
                    {selected.map(inv => (
                      <td key={inv.id} className="px-4 py-4">
                        <span className="text-green-400 font-bold">{parseValueRange(inv)}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Market Sectors */}
                  <tr className="border-b border-gray-800/60">
                    <td className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider bg-gray-900/40">Market Sectors</td>
                    {selected.map(inv => (
                      <td key={inv.id} className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(inv.market_sectors || []).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-800 text-purple-300 text-xs">{s}</span>
                          ))}
                          {(!inv.market_sectors || inv.market_sectors.length === 0) && <span className="text-gray-600 text-xs">—</span>}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Market Applications */}
                  <tr className="border-b border-gray-800/60">
                    <td className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider bg-gray-900/40">Market Applications</td>
                    {selected.map(inv => (
                      <td key={inv.id} className="px-4 py-4 text-gray-300 text-xs leading-relaxed">
                        {inv.market_applications || "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Next Steps */}
                  <tr className="border-b border-gray-800/60">
                    <td className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider bg-gray-900/40">Commercialization Steps</td>
                    {selected.map(inv => (
                      <td key={inv.id} className="px-4 py-4 text-gray-300 text-xs leading-relaxed">
                        {inv.suggested_next_steps
                          ? inv.suggested_next_steps.split("→").map((s, i) => (
                              <div key={i} className="flex items-start gap-1.5 mb-1">
                                <span className="text-cyan-500 font-bold flex-shrink-0">{i + 1}.</span>
                                <span>{s.trim()}</span>
                              </div>
                            ))
                          : "—"}
                      </td>
                    ))}
                  </tr>

                  {/* BOM Section Header */}
                  <tr>
                    <td colSpan={selected.length + 1} className="px-6 py-3 bg-gray-800/80">
                      <div className="flex items-center gap-2 text-gray-300 font-black text-xs uppercase tracking-widest">
                        <Package size={13} /> Bill of Materials Components
                      </div>
                    </td>
                  </tr>

                  {/* BOM rows */}
                  {allComponents.length > 0 ? allComponents.map((component, ci) => (
                    <tr key={ci} className={`border-b border-gray-800/40 ${ci % 2 === 0 ? "bg-gray-900/20" : ""}`}>
                      <td className="px-6 py-3 text-gray-300 text-xs font-medium bg-gray-900/40">{component}</td>
                      {selected.map(inv => {
                        const bomList = parseBOM(inv);
                        const has = bomList.some(b => b.toLowerCase().includes(component.toLowerCase()) || component.toLowerCase().includes(b.toLowerCase()));
                        return (
                          <td key={inv.id} className="px-4 py-3 text-center">
                            {has ? (
                              <CheckCircle size={16} className="text-green-400 mx-auto" />
                            ) : (
                              <X size={16} className="text-gray-700 mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={selected.length + 1} className="px-6 py-4 text-gray-600 text-xs text-center">No BOM component data available for selected inventions.</td>
                    </tr>
                  )}

                  {/* Estimated Cost Row */}
                  <tr className="border-t-2 border-gray-700 bg-gray-800/40">
                    <td className="px-6 py-4 text-gray-300 font-black text-xs uppercase tracking-wider">Est. IP Value (Low)</td>
                    {selected.map(inv => (
                      <td key={inv.id} className="px-4 py-4">
                        <span className="text-green-400 font-black text-base">{inv.ip_value_low ? `$${inv.ip_value_low}M` : "—"}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-800/40">
                    <td className="px-6 py-4 text-gray-300 font-black text-xs uppercase tracking-wider">Est. IP Value (High)</td>
                    {selected.map(inv => (
                      <td key={inv.id} className="px-4 py-4">
                        <span className="text-green-300 font-black text-base">{inv.ip_value_high ? `$${inv.ip_value_high}M` : "—"}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selected.length === 1 && (
          <div className="text-center py-8 text-gray-500 border border-dashed border-gray-700 rounded-2xl">
            <GitCompare size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">Select at least one more invention to compare</p>
          </div>
        )}
      </div>
    </div>
  );
}