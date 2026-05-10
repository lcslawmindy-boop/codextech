import { useState } from "react";
import { Brain, Loader2, RefreshCw, AlertTriangle, TrendingUp, FileText, Zap, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const RISK_COLORS = { high: "#ef4444", medium: "#f97316", low: "#22c55e" };

export default function InsightEngine() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("intelligenceEngine", { module: "insight_engine" });
      setData(res.data?.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-base flex items-center gap-2">
            <Brain size={16} className="text-cyan-400" /> Insight Engine
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">AI-powered portfolio intelligence — summaries, diffs, optimizations</p>
        </div>
        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-black transition-all">
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {!data && !loading && (
        <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <Brain size={28} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold">Click "Run Analysis" to generate intelligence</p>
          <p className="text-slate-600 text-xs mt-1">Analyzes inventions, prior art, alerts, and opportunities</p>
        </div>
      )}

      {loading && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center">
          <Loader2 size={24} className="animate-spin text-cyan-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Generating intelligence report...</p>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {/* Executive Summary */}
          <div className="bg-slate-900 border border-cyan-900/30 rounded-xl p-5">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-2">Executive Summary</p>
            <p className="text-slate-200 text-sm leading-relaxed">{data.executive_summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Insights */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Key Insights</p>
              <div className="space-y-2.5">
                {(data.key_insights || []).map((insight, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded bg-cyan-900/40 border border-cyan-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] font-black text-cyan-400">{i + 1}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What Changed */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">What Changed</p>
              <div className="space-y-2.5">
                {(data.what_changed || []).map((change, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <ChevronRight size={12} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                    {change}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Claim Optimizations */}
          <div className="bg-slate-900 border border-purple-900/30 rounded-xl p-5">
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3">Claim Optimization Suggestions</p>
            <div className="space-y-2">
              {(data.claim_optimizations || []).map((opt, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-purple-950/20 border border-purple-900/30">
                  <FileText size={11} className="text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-xs leading-relaxed">{opt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Prior Art Risks */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Prior Art Risk Scoring</p>
            <div className="space-y-2.5">
              {(data.prior_art_risks || []).map((risk, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                  <AlertTriangle size={13} style={{ color: RISK_COLORS[risk.risk] || "#888" }} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-xs font-bold">{risk.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase"
                        style={{ backgroundColor: (RISK_COLORS[risk.risk] || "#888") + "20", color: RISK_COLORS[risk.risk] || "#888" }}>
                        {risk.risk}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{risk.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patent Activity */}
          <div className="bg-slate-900 border border-green-900/30 rounded-xl p-5">
            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Patent Activity Alerts</p>
            <p className="text-slate-300 text-sm leading-relaxed">{data.patent_activity}</p>
          </div>
        </div>
      )}
    </div>
  );
}