import { useState } from "react";
import { Network, Loader2, Zap, ChevronRight, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SEV_COLORS = { critical: "#7c3aed", high: "#ef4444", medium: "#f97316", low: "#22c55e", strong: "#22c55e", moderate: "#f97316", weak: "#94a3b8" };

function LinkSection({ title, color, items, renderItem }) {
  if (!items?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color }}>{title}</p>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i}>{renderItem(item, i)}</div>
        ))}
      </div>
    </div>
  );
}

export default function EntityLinkingEngine() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("intelligenceEngine", { module: "entity_linking" });
      setData(res.data?.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-base flex items-center gap-2">
            <Network size={16} className="text-purple-400" /> Entity Linking Engine
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Invention → Claims → Prior Art → Patent Families → Competitors</p>
        </div>
        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-black transition-all">
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
          {loading ? "Mapping..." : "Map Entities"}
        </button>
      </div>

      {!data && !loading && (
        <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <Network size={28} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold">Build the entity link map</p>
        </div>
      )}

      {loading && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center">
          <Loader2 size={24} className="animate-spin text-purple-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Mapping entity relationships...</p>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <LinkSection title="Invention → Claims" color="#00E5FF"
            items={data.invention_to_claims}
            renderItem={(item, i) => (
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-cyan-300 text-xs font-black">{item.invention}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-900/30 text-cyan-500 border border-cyan-900">{item.claim_strength}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(item.primary_claims || []).map((c, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">{c}</span>
                  ))}
                </div>
              </div>
            )}
          />

          <LinkSection title="Claim → Prior Art Conflicts" color="#f97316"
            items={data.claim_to_prior_art}
            renderItem={(item, i) => (
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle size={11} style={{ color: SEV_COLORS[item.conflict_severity] || "#888" }} />
                  <span className="text-white text-xs font-bold">{item.claim_topic}</span>
                  <span className="text-[9px] font-black" style={{ color: SEV_COLORS[item.conflict_severity] || "#888" }}>{item.conflict_severity}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(item.conflicting_prior_art || []).map((pa, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-orange-950/30 text-orange-300 border border-orange-900/40">{pa}</span>
                  ))}
                </div>
              </div>
            )}
          />

          <LinkSection title="Prior Art → Patent Families" color="#22c55e"
            items={data.prior_art_to_families}
            renderItem={(item, i) => (
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-white text-xs font-bold">{item.prior_art_title}</p>
                  <p className="text-slate-500 text-[10px] flex items-center gap-1 mt-0.5">
                    <ChevronRight size={9} /> {item.patent_family}
                  </p>
                </div>
                <span className="text-[10px] text-green-400 font-black">{item.family_size_est} patents</span>
              </div>
            )}
          />

          <LinkSection title="Competitor Clusters" color="#ef4444"
            items={data.competitor_clusters}
            renderItem={(item, i) => (
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-red-300 text-xs font-black">{item.competitor_domain}</span>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: (SEV_COLORS[item.threat_level] || "#888") + "20", color: SEV_COLORS[item.threat_level] || "#888" }}>
                    {item.threat_level}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(item.related_patents || []).map((p, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-red-950/30 text-red-300 border border-red-900/40">{p}</span>
                  ))}
                </div>
              </div>
            )}
          />

          {data.user_workspaces?.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">User Workspaces</p>
              {data.user_workspaces.map((ws, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-white text-xs font-black mb-1">{ws.workspace}</p>
                  <p className="text-slate-500 text-[10px] mb-1.5">Focus: {ws.focus_area}</p>
                  <div className="flex flex-wrap gap-1">
                    {(ws.tools || []).map((t, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}