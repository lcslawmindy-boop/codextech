import { useState } from "react";
import { TrendingUp, Loader2, Zap, ChevronRight, Globe, DollarSign, Map } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function OpportunityEngine() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("concepts");

  const run = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("intelligenceEngine", { module: "opportunity_engine" });
      setData(res.data?.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const TABS = [
    { id: "concepts", label: "New Concepts" },
    { id: "expansions", label: "Claim Expansions" },
    { id: "commercialization", label: "Commercialization" },
    { id: "licensing", label: "Licensing" },
    { id: "gaps", label: "Competitor Gaps" },
  ];

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-base flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" /> Opportunity Engine
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">New concepts · Claim expansions · Licensing · Competitor gap maps</p>
        </div>
        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-black transition-all">
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
          {loading ? "Generating..." : "Generate Opportunities"}
        </button>
      </div>

      {!data && !loading && (
        <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <TrendingUp size={28} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold">Click "Generate" to discover IP opportunities</p>
        </div>
      )}

      {loading && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center">
          <Loader2 size={24} className="animate-spin text-green-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Generating opportunity map...</p>
        </div>
      )}

      {data && (
        <>
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tab === t.id ? "bg-green-900/40 border border-green-700 text-green-300" : "border border-slate-800 text-slate-500 hover:text-slate-300"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "concepts" && (
            <div className="space-y-3">
              {(data.new_concepts || []).map((c, i) => (
                <div key={i} className="bg-slate-900 border border-green-900/30 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white font-black text-sm">{c.concept}</h3>
                    <span className="px-2 py-0.5 rounded bg-green-900/40 border border-green-800 text-green-300 text-[10px] font-bold flex-shrink-0">{c.domain}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-2">{c.mechanism}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold">
                    <DollarSign size={10} /> Est. Value: {c.estimated_value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "expansions" && (
            <div className="space-y-2.5">
              {(data.claim_expansions || []).map((exp, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-6 h-6 rounded bg-purple-900/40 border border-purple-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-black text-purple-400">{i + 1}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{exp}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "commercialization" && (
            <div className="space-y-3">
              {(data.commercialization_paths || []).map((cp, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <p className="text-white font-black text-sm mb-2">{cp.path}</p>
                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="text-slate-500 flex items-center gap-1"><ChevronRight size={9} /> Timeline: <span className="text-slate-300">{cp.timeline}</span></span>
                    <span className="text-green-400 flex items-center gap-1"><DollarSign size={9} /> {cp.revenue_model}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "licensing" && (
            <div className="space-y-3">
              {(data.licensing_targets || []).map((lt, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-white font-black text-sm">{lt.target}</p>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] border border-slate-700">{lt.deal_type}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{lt.rationale}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "gaps" && (
            <div className="space-y-2.5">
              {(data.competitor_gaps || []).map((gap, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-orange-900/30">
                  <Map size={13} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-xs leading-relaxed">{gap}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}