import { useState } from "react";
import { Layers, Loader2, Zap, BarChart3 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CLUSTER_TYPES = [
  { id: "physics_clusters", label: "Physics Principle Clusters", color: "#00E5FF" },
  { id: "market_clusters", label: "Market Clusters", color: "#fbbf24" },
  { id: "claim_clusters", label: "Claim Structure Clusters", color: "#a855f7" },
  { id: "prior_art_clusters", label: "Prior Art Clusters", color: "#f97316" },
];

function ClusterCard({ cluster, color, type }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900 border" style={{ borderColor: color + "25" }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-white font-black text-sm">{cluster.name || cluster.category}</p>
        {cluster.cohesion_score !== undefined && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
            <BarChart3 size={9} style={{ color }} />
            <span className="text-[10px] font-black" style={{ color }}>{cluster.cohesion_score}/100</span>
          </div>
        )}
        {cluster.risk_level && (
          <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase"
            style={{ backgroundColor: { high: "#ef444420", medium: "#f9741620", low: "#22c55e20" }[cluster.risk_level] || "#88888820",
              color: { high: "#ef4444", medium: "#f97316", low: "#22c55e" }[cluster.risk_level] || "#888" }}>
            {cluster.risk_level}
          </span>
        )}
        {cluster.entry_count !== undefined && (
          <span className="text-[10px] text-slate-500">{cluster.entry_count} entries</span>
        )}
      </div>

      {cluster.description && <p className="text-slate-400 text-[11px] leading-relaxed mb-3">{cluster.description}</p>}
      {cluster.dominant_theme && <p className="text-slate-400 text-[11px] leading-relaxed mb-3">{cluster.dominant_theme}</p>}
      {cluster.common_claim_structure && <p className="text-slate-400 text-[11px] leading-relaxed mb-3 italic">"{cluster.common_claim_structure}"</p>}
      {cluster.market_size_est && (
        <p className="text-yellow-400 text-[10px] font-bold mb-2">Market: {cluster.market_size_est}</p>
      )}

      {/* Members */}
      {cluster.members?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {cluster.members.slice(0, 6).map((m, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded border text-slate-300"
              style={{ borderColor: color + "30", backgroundColor: color + "08" }}>
              {m}
            </span>
          ))}
          {cluster.members.length > 6 && (
            <span className="text-[10px] text-slate-600">+{cluster.members.length - 6} more</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function ClusterDetection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("physics_clusters");

  const run = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("intelligenceEngine", { module: "cluster_detection" });
      setData(res.data?.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const activeClusters = data?.[activeType] || [];
  const activeColor = CLUSTER_TYPES.find(t => t.id === activeType)?.color || "#888";

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-base flex items-center gap-2">
            <Layers size={16} className="text-yellow-400" /> Auto-Cluster Detection
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Physics · Market · Claim structure · Prior art clusters</p>
        </div>
        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-700 hover:bg-yellow-600 disabled:opacity-50 text-white text-xs font-black transition-all">
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
          {loading ? "Clustering..." : "Detect Clusters"}
        </button>
      </div>

      {!data && !loading && (
        <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <Layers size={28} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold">Run cluster detection to group related IP</p>
        </div>
      )}

      {loading && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center">
          <Loader2 size={24} className="animate-spin text-yellow-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Detecting clusters across portfolio...</p>
        </div>
      )}

      {data && (
        <>
          {/* Summary counts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CLUSTER_TYPES.map(ct => (
              <button key={ct.id} onClick={() => setActiveType(ct.id)}
                className={`p-3 rounded-xl border transition-all text-left ${
                  activeType === ct.id ? "" : "border-slate-800 hover:border-slate-700"
                }`}
                style={activeType === ct.id ? { borderColor: ct.color + "50", backgroundColor: ct.color + "08" } : {}}>
                <p className="text-xl font-black" style={{ color: ct.color }}>{(data[ct.id] || []).length}</p>
                <p className="text-[10px] text-slate-500 leading-snug">{ct.label}</p>
              </button>
            ))}
          </div>

          {/* Active cluster type display */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: activeColor }}>
              {CLUSTER_TYPES.find(t => t.id === activeType)?.label} ({activeClusters.length})
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeClusters.map((c, i) => (
                <ClusterCard key={i} cluster={c} color={activeColor} type={activeType} />
              ))}
              {activeClusters.length === 0 && (
                <p className="text-slate-600 text-sm col-span-2 text-center py-6">No clusters detected for this type</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}