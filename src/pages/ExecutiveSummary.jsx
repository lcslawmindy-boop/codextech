import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Download, FileText, TrendingUp, AlertTriangle, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { FACTS, SCORECARD, METHODS, BLENDED, FINDINGS, money } from "@/lib/zds33Valuation";
import generateExecutiveSummaryPdf from "@/lib/generateExecutiveSummaryPdf";

export default function ExecutiveSummary() {
  const [assets, setAssets] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    base44.entities.IPAsset.filter(
      { status: "active", valuation_low: { $exists: true } },
      { sort: "-valuation_high", limit: 10 }
    ).then((page) => setAssets(page.items || [])).catch(() => setAssets([]));
  }, []);

  const totalMax = SCORECARD.reduce((a, s) => a + s.max, 0);
  const totalScore = SCORECARD.reduce((a, s) => a + s.score, 0);

  const exportPdf = async () => {
    setBusy(true);
    try { await generateExecutiveSummaryPdf(assets || []); }
    catch (e) { alert(e.message || "Export failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-4 py-3 sticky top-0 z-40 bg-slate-950/95 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/zds33-admin" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="text-white font-black text-sm">Executive Summary</h1>
            <p className="text-slate-500 text-[10px]">Valuation + commercial viability — one page, investor-ready</p>
          </div>
        </div>
        <button onClick={exportPdf} disabled={busy || !assets}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold">
          {busy ? <Loader2 className="animate-spin" size={13} /> : <Download size={13} />}
          {busy ? "Building…" : "Export PDF"}
        </button>
      </div>

      <div className="px-4 py-4 max-w-3xl mx-auto">
        {/* Confidential banner */}
        <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-3 mb-4 flex gap-2">
          <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200/90 text-[11px] leading-relaxed">
            <b>Confidential.</b> Advisory analysis only — not an independent valuation. No patents filed at the USPTO at date of issue.
            For investor review under NDA. Not an investment offer or legal advice.
          </p>
        </div>

        {/* Headline valuation */}
        <div className="rounded-xl border border-cyan-700/40 bg-gradient-to-br from-cyan-950/30 to-slate-900/40 p-4 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-1">Indicative portfolio value</p>
          <p className="text-white text-3xl font-black">{money(BLENDED.low)} <span className="text-slate-500 text-xl">–</span> {money(BLENDED.high)}</p>
          <p className="text-slate-400 text-[11px] mt-1">Blended across deal-implied, cost-replacement & risk-adjusted option methods.</p>
        </div>

        {/* Portfolio at a glance */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3"><FileText size={15} className="text-cyan-400" /><h2 className="text-white font-black text-xs">Portfolio at a glance</h2></div>
          <div className="space-y-1.5">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex items-start gap-2 text-[11px] py-1 border-b border-slate-800/50 last:border-0">
                <span className="text-slate-500 font-bold w-40 flex-shrink-0">{k}</span>
                <span className="text-slate-200">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Viability scorecard */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><TrendingUp size={15} className="text-emerald-400" /><h2 className="text-white font-black text-xs">Viability scorecard</h2></div>
            <span className="text-emerald-400 text-xs font-black">{totalScore} / {totalMax}</span>
          </div>
          <div className="space-y-2">
            {SCORECARD.map((s) => (
              <div key={s.name} className="border-b border-slate-800/50 last:border-0 pb-2">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-slate-200 text-[11px] font-bold">{s.name}</p>
                  <p className="text-cyan-400 text-[11px] font-bold">{s.score} / {s.max}</p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 mb-1">
                  <div className="h-1.5 rounded-full bg-cyan-500" style={{ width: `${(s.score / s.max) * 100}%` }} />
                </div>
                <p className="text-slate-500 text-[10px] leading-relaxed">{s.why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lead assets */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3"><Shield size={15} className="text-cyan-400" /><h2 className="text-white font-black text-xs">Lead assets — valuation & status</h2></div>
          {!assets ? (
            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-cyan-400" size={18} /></div>
          ) : assets.length === 0 ? (
            <p className="text-slate-500 text-[11px]">No assets with valuations recorded yet. Add valuations in the IP Inventory.</p>
          ) : (
            <div className="space-y-2">
              {assets.slice(0, 6).map((a) => (
                <div key={a.id} className="rounded-lg bg-slate-950/40 border border-slate-800 p-2.5">
                  <p className="text-white text-xs font-bold mb-1">{a.asset_name}</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                    <p><span className="text-slate-500">Value:</span> <span className="text-cyan-400 font-bold">{a.valuation_low || a.valuation_high ? `${money(a.valuation_low || 0)} – ${money(a.valuation_high || 0)}` : "Not valued"}</span></p>
                    <p><span className="text-slate-500">Filing:</span> <span className="text-slate-300">{(a.filing_status || "not_filed").replace(/_/g, " ")}</span></p>
                    <p><span className="text-slate-500">Stage:</span> <span className="text-slate-300">{a.development_stage || "concept"}</span></p>
                    <p><span className="text-slate-500">Commercial:</span> <span className="text-slate-300">{(a.commercialization_readiness || "not_assessed").replace(/_/g, " ")}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Valuation methods */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 mb-4">
          <h2 className="text-white font-black text-xs mb-3">Valuation methods</h2>
          <div className="space-y-2">
            {METHODS.map((m) => (
              <div key={m.method} className="border-b border-slate-800/50 last:border-0 pb-2">
                <p className="text-white text-[11px] font-bold">{m.method}: <span className="text-cyan-400">{money(m.low)} – {money(m.high)}</span></p>
                <p className="text-slate-500 text-[10px] leading-relaxed mt-0.5">{m.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key findings */}
        <div className="rounded-xl border border-amber-700/30 bg-amber-950/10 p-4 mb-4">
          <h2 className="text-amber-300 font-black text-xs mb-3">Key findings & risks</h2>
          <div className="space-y-2">
            {FINDINGS.map((f, i) => (
              <div key={i} className="border-b border-amber-800/20 last:border-0 pb-2">
                <p className={`text-[11px] font-bold ${f.sev === "high" ? "text-amber-400" : "text-amber-300"}`}>[{f.sev.toUpperCase()}] {f.t}</p>
                <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">{f.d}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-[10px] italic leading-relaxed">
          Aethon Apex IP Holdings — Confidential. Advisory analysis derived from source documentation, not an independent
          valuation. No patents filed at USPTO. Not an investment offer or legal advice.
        </p>
      </div>
    </div>
  );
}