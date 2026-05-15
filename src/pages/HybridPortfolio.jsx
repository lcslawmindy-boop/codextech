import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FlaskConical, DollarSign, TrendingUp, BarChart2, Layers, Trash2, ExternalLink, RefreshCw, Loader2, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { base44 } from "@/api/base44Client";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";

const GROUP_COLORS = {
  physics: "#3b82f6",
  biology: "#22c55e",
  weapons: "#ef4444",
  consciousness: "#a855f7",
  history: "#f59e0b",
  philosophy: "#06b6d4",
};

const STATUS_CONFIG = {
  draft: { color: "#6b7280", bg: "bg-gray-800 border-gray-700" },
  filed: { color: "#f59e0b", bg: "bg-yellow-900/40 border-yellow-700" },
  patented: { color: "#22c55e", bg: "bg-green-900/40 border-green-700" },
  commercializing: { color: "#6366f1", bg: "bg-indigo-900/40 border-indigo-700" },
};

// Parse "$X - $Y million" → { low, high }
function parseValuation(str) {
  if (!str) return { low: 0, high: 0 };
  const nums = str.match(/[\d,]+(?:\.\d+)?/g);
  if (!nums) return { low: 0, high: 0 };
  const vals = nums.map(n => parseFloat(n.replace(/,/g, "")));
  // Check for "million" or "M"
  const isMillion = /million|M\b/i.test(str);
  const mul = isMillion ? 1 : 0.000001; // assume raw dollars if no million keyword
  return {
    low: Math.min(...vals) * mul,
    high: Math.max(...vals) * mul,
  };
}

// ── SYNERGY HEATMAP ─────────────────────────────────────────────────────────
function SynergyHeatmap({ inventions }) {
  // Build a unique list of all node IDs used across inventions
  const allNodeIds = useMemo(() => {
    const set = new Set();
    inventions.forEach(inv => (inv.input_nodes || []).forEach(n => set.add(n.id)));
    return [...set];
  }, [inventions]);

  // For each pair, count how many inventions share both nodes
  const matrix = useMemo(() => {
    const m = {};
    allNodeIds.forEach(a => {
      m[a] = {};
      allNodeIds.forEach(b => { m[a][b] = 0; });
    });
    inventions.forEach(inv => {
      const ids = (inv.input_nodes || []).map(n => n.id);
      for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < ids.length; j++) {
          if (i !== j && m[ids[i]]) m[ids[i]][ids[j]] = (m[ids[i]][ids[j]] || 0) + 1;
        }
      }
    });
    return m;
  }, [inventions, allNodeIds]);

  const maxCount = useMemo(() => {
    let max = 1;
    allNodeIds.forEach(a => allNodeIds.forEach(b => { if (a !== b) max = Math.max(max, matrix[a]?.[b] || 0); }));
    return max;
  }, [matrix, allNodeIds]);

  const displayNodes = allNodeIds.slice(0, 10); // cap for display
  const labels = inventions.reduce((acc, inv) => {
    (inv.input_nodes || []).forEach(n => { acc[n.id] = n.label?.split(" ").slice(0, 2).join(" ") || n.id; });
    return acc;
  }, {});

  if (displayNodes.length < 2) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-700 text-sm">
        Generate at least 2 hybrid inventions sharing common nodes to see the heatmap.
      </div>
    );
  }

  const CELL = 44;

  return (
    <div className="overflow-x-auto">
      <svg width={displayNodes.length * CELL + 120} height={displayNodes.length * CELL + 60}>
        {/* Column headers */}
        {displayNodes.map((id, ci) => (
          <text key={ci} x={120 + ci * CELL + CELL / 2} y={50}
            textAnchor="middle" fill="#6b7280" fontSize="7" transform={`rotate(-35,${120 + ci * CELL + CELL / 2},50)`}>
            {(labels[id] || id).slice(0, 12)}
          </text>
        ))}
        {/* Row headers + cells */}
        {displayNodes.map((rowId, ri) => (
          <g key={ri}>
            <text x={115} y={60 + ri * CELL + CELL / 2 + 4} textAnchor="end" fill="#6b7280" fontSize="7">
              {(labels[rowId] || rowId).slice(0, 14)}
            </text>
            {displayNodes.map((colId, ci) => {
              if (rowId === colId) {
                return <rect key={ci} x={120 + ci * CELL} y={60 + ri * CELL} width={CELL - 2} height={CELL - 2} fill="#1f2937" rx="3" />;
              }
              const count = matrix[rowId]?.[colId] || 0;
              const intensity = count / maxCount;
              const r = Math.round(212 * intensity);
              const g = Math.round(175 * intensity);
              const b = Math.round(55 * intensity);
              return (
                <g key={ci}>
                  <rect x={120 + ci * CELL} y={60 + ri * CELL} width={CELL - 2} height={CELL - 2}
                    fill={count === 0 ? "#111827" : `rgb(${r},${g},${b})`} rx="3" opacity={count === 0 ? 1 : 0.3 + 0.7 * intensity} />
                  {count > 0 && (
                    <text x={120 + ci * CELL + CELL / 2 - 1} y={60 + ri * CELL + CELL / 2 + 4}
                      textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{count}</text>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
      <p className="text-gray-700 text-xs mt-1 ml-1">Cell = # of hybrid inventions sharing both nodes. Brighter = higher synergy overlap.</p>
    </div>
  );
}

// ── MARKET SECTOR BREAKDOWN ──────────────────────────────────────────────────
function SectorBreakdown({ inventions }) {
  const sectorData = useMemo(() => {
    const map = {};
    inventions.forEach(inv => {
      // Derive sectors from input node groups
      (inv.input_nodes || []).forEach(n => {
        const g = n.group || "other";
        map[g] = (map[g] || 0) + 1;
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [inventions]);

  if (!sectorData.length) return <div className="h-32 flex items-center justify-center text-gray-700 text-sm">No data yet.</div>;

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={sectorData} barSize={24}>
        <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {sectorData.map((entry, i) => (
            <Cell key={i} fill={GROUP_COLORS[entry.name] || "#6b7280"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── RADAR CHART ──────────────────────────────────────────────────────────────
function SynergyRadar({ inventions }) {
  const data = useMemo(() => {
    const groupScores = {};
    const groupCounts = {};
    inventions.forEach(inv => {
      (inv.input_nodes || []).forEach(n => {
        const g = n.group || "other";
        groupScores[g] = (groupScores[g] || 0) + (inv.synergy_score || 0);
        groupCounts[g] = (groupCounts[g] || 0) + 1;
      });
    });
    return Object.keys(groupScores).map(g => ({
      subject: g,
      score: Math.round(groupScores[g] / groupCounts[g]),
    }));
  }, [inventions]);

  if (data.length < 3) return <div className="h-40 flex items-center justify-center text-gray-700 text-sm">Need more inventions for radar view.</div>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 10 }} />
        <Radar name="Avg Synergy" dataKey="score" stroke="#d4af37" fill="#d4af37" fillOpacity={0.25} />
        <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function exportInventionPDF(inv) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;
  const cW = W - margin * 2;
  let y = 0;

  const addPage = () => {
    if (y > 0) doc.addPage();
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, W, 20, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("AETHON APEX IP HOLDINGS — HYBRID IP PACKAGE", margin, 13);
    doc.text("CONFIDENTIAL", W - margin, 13, { align: "right" });
    y = 30;
  };

  const check = (need = 14) => { if (y + need > 280) addPage(); };

  const section = (txt) => {
    check(16);
    doc.setFillColor(20, 20, 20);
    doc.rect(margin - 3, y - 3, cW + 6, 12, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(txt, margin, y + 5);
    y += 15;
  };

  const body = (txt, size = 10) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    const lines = doc.splitTextToSize(txt || "—", cW);
    lines.forEach(l => { check(8); doc.text(l, margin, y); y += 7; });
    y += 3;
  };

  addPage();

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  const titleLines = doc.splitTextToSize(inv.hybrid_concept || "Hybrid IP", cW);
  titleLines.forEach(l => { doc.text(l, margin, y); y += 10; });
  y += 3;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Mode: ${inv.mode === "merge" ? "Merged" : "Cross-Pollinated"} | Synergy: ${inv.synergy_score}/100 | Status: ${inv.status}`, margin, y); y += 7;
  doc.text(`IP Valuation: $${inv.ip_value_low || 0}M – $${inv.ip_value_high || 0}M`, margin, y); y += 7;
  doc.text(`Input Technologies: ${(inv.input_nodes || []).map(n => n.label).join(", ")}`, margin, y); y += 7;
  doc.text(`Market Sectors: ${(inv.market_sectors || []).join(", ")}`, margin, y); y += 12;

  section("1. MECHANISM");
  body(inv.mechanism);
  section("2. PATENT CLAIMS (DRAFT)");
  body(inv.patent_claims);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120, 120, 120);
  check(8);
  doc.text("⚠ Draft only — consult a patent attorney before filing", margin, y);
  y += 10;
  section("3. IP VALUATION JUSTIFICATION");
  body(inv.ip_valuation);
  section("4. MARKET APPLICATIONS");
  body(inv.market_applications);
  section("5. REQUIRED COMPONENTS");
  body(inv.required_components);
  section("6. SUGGESTED NEXT STEPS");
  body(inv.suggested_next_steps);

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 287, W, 10, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Aethon Apex IP Holdings — Hybrid IP Package — CONFIDENTIAL", margin, 293);
    doc.text(`Page ${p} of ${total}`, W - margin, 293, { align: "right" });
  }

  const fname = (inv.hybrid_concept || "IP").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
  doc.save(`AethonApex_${fname}.pdf`);
}

// ── INVENTION CARD ──────────────────────────────────────────────────────────
function InventionCard({ inv, onDelete, onStatusChange }) {
  const { low, high } = parseValuation(inv.ip_valuation);
  const cfg = STATUS_CONFIG[inv.status] || STATUS_CONFIG.draft;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-sm leading-snug mb-1 line-clamp-2">{inv.hybrid_concept?.split(":")[0] || "Hybrid Invention"}</p>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {(inv.input_nodes || []).slice(0, 3).map((n, i) => (
              <span key={i} className="text-xs px-1.5 py-0.5 rounded font-semibold"
                style={{ backgroundColor: (GROUP_COLORS[n.group] || "#888") + "25", color: GROUP_COLORS[n.group] || "#888" }}>
                {n.label?.split(" ").slice(0, 2).join(" ")}
              </span>
            ))}
            {(inv.input_nodes || []).length > 3 && (
              <span className="text-gray-600 text-xs">+{inv.input_nodes.length - 3}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => exportInventionPDF(inv)} className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-600 hover:text-gray-200 transition-all" title="Export PDF">
            <Download size={12} />
          </button>
          <button onClick={() => onDelete(inv.id)} className="p-1.5 rounded-lg hover:bg-red-950/40 text-gray-700 hover:text-red-400 transition-all" title="Delete">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-4 mb-3">
        <div>
          <p className="text-gray-600 text-xs">Synergy</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${inv.synergy_score || 0}%` }} />
            </div>
            <span className="text-green-400 font-black text-xs">{inv.synergy_score || 0}%</span>
          </div>
        </div>
        <div>
          <p className="text-gray-600 text-xs">IP Value</p>
          <p className="text-yellow-400 font-black text-xs mt-0.5">
            {low > 0 ? `$${low}–${high}M` : "TBD"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-xs">Mode</p>
          <p className="text-gray-400 text-xs mt-0.5 capitalize">{inv.mode || "merge"}</p>
        </div>
      </div>

      {/* Status selector */}
      <select value={inv.status || "draft"} onChange={e => onStatusChange(inv.id, e.target.value)}
        className={`w-full text-xs font-bold rounded-lg px-2 py-1.5 border focus:outline-none transition-all ${cfg.bg}`}
        style={{ color: cfg.color }}>
        <option value="draft">Draft</option>
        <option value="filed">Patent Filed</option>
        <option value="patented">Patented</option>
        <option value="commercializing">Commercializing</option>
      </select>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function HybridPortfolio() {
  const [inventions, setInventions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.HybridInvention.list("-created_date", 100);
    setInventions(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await base44.entities.HybridInvention.delete(id);
    setInventions(prev => prev.filter(i => i.id !== id));
  };

  const handleStatusChange = async (id, status) => {
    await base44.entities.HybridInvention.update(id, { status });
    setInventions(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  // Aggregates
  const totalIPLow = useMemo(() => inventions.reduce((s, inv) => s + parseValuation(inv.ip_valuation).low, 0), [inventions]);
  const totalIPHigh = useMemo(() => inventions.reduce((s, inv) => s + parseValuation(inv.ip_valuation).high, 0), [inventions]);
  const avgSynergy = useMemo(() => inventions.length ? Math.round(inventions.reduce((s, i) => s + (i.synergy_score || 0), 0) / inventions.length) : 0, [inventions]);
  const statusCounts = useMemo(() => {
    const m = { draft: 0, filed: 0, patented: 0, commercializing: 0 };
    inventions.forEach(i => { m[i.status || "draft"]++; });
    return m;
  }, [inventions]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/rd-sandbox" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> R&D Sandbox
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Layers size={14} className="text-yellow-400" /> Hybrid IP Portfolio
            </h1>
            <p className="text-gray-500 text-xs">All sandbox hybrid inventions · IP valuation · synergy analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
            <RefreshCw size={13} />
          </button>
          <Link to="/rd-sandbox"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 text-xs font-black transition-all">
            <FlaskConical size={12} /> New Hybrid
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-yellow-400" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 py-6 max-w-7xl mx-auto w-full space-y-6">

          {/* Portfolio Overview KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Hybrids", value: inventions.length, color: "#d4af37", icon: <FlaskConical size={16} /> },
              { label: "Total IP Value", value: inventions.length ? `$${totalIPLow.toFixed(0)}–${totalIPHigh.toFixed(0)}M` : "—", color: "#22c55e", icon: <DollarSign size={16} /> },
              { label: "Avg Synergy Score", value: `${avgSynergy}%`, color: "#6366f1", icon: <TrendingUp size={16} /> },
              { label: "Patented / Filed", value: `${statusCounts.patented + statusCounts.filed}`, color: "#f59e0b", icon: <BarChart2 size={16} /> },
            ].map((m, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{m.label}</p>
                  <span style={{ color: m.color }}>{m.icon}</span>
                </div>
                <p className="font-black text-xl" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Status pipeline */}
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(statusCounts).map(([status, count]) => {
              const cfg = STATUS_CONFIG[status];
              return (
                <div key={status} className={`rounded-xl border px-4 py-3 ${cfg.bg}`}>
                  <p className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: cfg.color }}>{status}</p>
                  <p className="text-white font-black text-2xl">{count}</p>
                </div>
              );
            })}
          </div>

          {/* Analytics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Sector Breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Market Sector Breakdown</p>
              <SectorBreakdown inventions={inventions} />
            </div>

            {/* Synergy Radar */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Domain Synergy Radar</p>
              <SynergyRadar inventions={inventions} />
            </div>

            {/* IP Value Waterfall */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Top IP Valuations</p>
              {inventions.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-700 text-sm">No inventions yet.</div>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {[...inventions]
                    .sort((a, b) => parseValuation(b.ip_valuation).high - parseValuation(a.ip_valuation).high)
                    .slice(0, 8)
                    .map((inv, i) => {
                      const { low, high } = parseValuation(inv.ip_valuation);
                      const maxH = parseValuation([...inventions].sort((a, b) => parseValuation(b.ip_valuation).high - parseValuation(a.ip_valuation).high)[0]?.ip_valuation).high || 1;
                      return (
                        <div key={i}>
                          <div className="flex justify-between items-center mb-0.5">
                            <p className="text-gray-400 text-xs truncate flex-1 mr-2">{inv.hybrid_concept?.split(":")[0]?.slice(0, 30) || "Hybrid"}</p>
                            <p className="text-yellow-400 text-xs font-bold flex-shrink-0">{high > 0 ? `$${high}M` : "—"}</p>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-600 rounded-full" style={{ width: `${Math.min(100, (high / maxH) * 100)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Synergy Heatmap */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">R&D Synergy Heatmap — Node Co-Occurrence</p>
            <SynergyHeatmap inventions={inventions} />
          </div>

          {/* Invention Cards */}
          <div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">All Hybrid Inventions ({inventions.length})</p>
            {inventions.length === 0 ? (
              <div className="border border-dashed border-gray-800 rounded-2xl p-12 text-center">
                <FlaskConical size={36} className="text-gray-800 mx-auto mb-3" />
                <p className="text-gray-600 text-sm font-bold mb-1">No hybrid inventions yet</p>
                <p className="text-gray-700 text-xs mb-4">Use the R&D Sandbox to generate your first AI cross-pollinated invention.</p>
                <Link to="/rd-sandbox"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-sm font-black">
                  <FlaskConical size={14} /> Open R&D Sandbox
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventions.map(inv => (
                  <InventionCard key={inv.id} inv={inv} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}