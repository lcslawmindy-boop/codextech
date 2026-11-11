import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Loader2, Download, Landmark, Shield, Presentation, FileText,
  AlertTriangle, TrendingUp, ChevronDown, ChevronRight,
} from "lucide-react";
import { PORTFOLIO, TOP10, GRANT_DRAFTS, VIABILITY_REPORT } from "@/lib/investorDeckData";
import generateInvestorDeckPptx from "@/lib/generateInvestorDeckPptx";
import generateLegalReviewPdf from "@/lib/generateLegalReviewPdf";
import generateViabilityReportPdf from "@/lib/generateViabilityReportPdf";

const money = (n) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`);
const scoreColor = (s) => (s >= 55 ? "#10b981" : s >= 35 ? "#fbbf24" : "#ef4444");

function Notice() {
  return (
    <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-3 mb-4 flex gap-2">
      <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
      <p className="text-amber-200/90 text-[11px] leading-relaxed">
        <b>Advisory only.</b> Valuations use a cost approach (claims × $25k floor) — a floor, not a market valuation.
        <b> None of these 10 assets are filed at the USPTO.</b> Claims are draft scaffolds for a registered patent attorney.
        Commission an independent IP valuation before investor disclosure.
      </p>
    </div>
  );
}

function ExportBar({ busy, onDeck, onLegal, onViability }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button onClick={onDeck} disabled={busy.deck} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold">
        {busy.deck ? <Loader2 className="animate-spin" size={13} /> : <Presentation size={13} />} Investor Deck (PPTX)
      </button>
      <button onClick={onLegal} disabled={busy.legal} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-bold">
        {busy.legal ? <Loader2 className="animate-spin" size={13} /> : <Shield size={13} />} Legal-Review Claims (PDF)
      </button>
      <button onClick={onViability} disabled={busy.viability} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold">
        {busy.viability ? <Loader2 className="animate-spin" size={13} /> : <TrendingUp size={13} />} Viability Report (PDF)
      </button>
    </div>
  );
}

function AssetRow({ a }) {
  const [open, setOpen] = useState(false);
  const col = scoreColor(a.viability.score);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-3 flex items-center gap-2">
        {open ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
        <span className="text-[10px] font-bold w-5 text-cyan-400">#{a.rank}</span>
        <span className="text-white text-xs font-bold flex-1">{a.name}</span>
        <span className="text-[10px] font-bold" style={{ color: col }}>{a.viability.score}/100</span>
        <span className="text-[10px] text-amber-400 font-bold whitespace-nowrap">{money(a.vLow)}–{money(a.vHigh)}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-slate-800 pt-3 space-y-2">
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <p><span className="text-slate-500">Domain:</span> <span className="text-slate-300">{a.domain}</span></p>
            <p><span className="text-slate-500">Filing:</span> <span className="text-amber-400 font-bold">{a.filing.replace(/_/g, " ")}</span></p>
            <p><span className="text-slate-500">Market:</span> <span className="text-slate-300">{a.market}</span></p>
            <p><span className="text-slate-500">Stage:</span> <span className="text-slate-300">{a.viability.trl}</span></p>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">{a.desc}</p>
          <p className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Draft independent claim</p>
          <p className="text-slate-200 text-[11px] leading-relaxed">{a.claims.independent[0]}</p>
          <p className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Dependent claims</p>
          {a.claims.dependent.map((c, i) => <p key={i} className="text-slate-400 text-[11px] leading-relaxed">{c}</p>)}
          <p className="text-[10px]" style={{ color: col }}><b>Viability {a.viability.score}/100.</b> {a.viability.risk}</p>
        </div>
      )}
    </div>
  );
}

export default function InvestorPortfolio() {
  const [busy, setBusy] = useState({ deck: false, legal: false, viability: false });
  const run = (k, fn) => async () => {
    setBusy((b) => ({ ...b, [k]: true }));
    try { await fn(); } finally { setBusy((b) => ({ ...b, [k]: false })); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-4 py-3 sticky top-0 z-40 bg-slate-950/95 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/zds33-admin" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="text-white font-black text-sm">Investor Deck · Legal Review · Viability</h1>
            <p className="text-slate-500 text-[10px]">Top 10 IP assets by valuation — live data</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Notice />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"><p className="text-[10px] text-slate-500 uppercase">Total assets</p><p className="text-white text-lg font-black">{PORTFOLIO.totalAssets}</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"><p className="text-[10px] text-slate-500 uppercase">Filed at USPTO</p><p className="text-red-400 text-lg font-black">0</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"><p className="text-[10px] text-slate-500 uppercase">Top-10 low</p><p className="text-cyan-400 text-lg font-black">{money(PORTFOLIO.top10Range.low)}</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"><p className="text-[10px] text-slate-500 uppercase">Top-10 high</p><p className="text-cyan-400 text-lg font-black">{money(PORTFOLIO.top10Range.high)}</p></div>
        </div>

        <div className="flex gap-2 mb-4">
          {PORTFOLIO.perDomain.map((d) => (
            <div key={d.domain} className="flex-1 rounded-xl border p-2" style={{ borderColor: d.color + "40" }}>
              <p className="text-[10px] font-bold" style={{ color: d.color }}>{d.domain}</p>
              <p className="text-white text-sm font-black">{d.count}</p>
            </div>
          ))}
        </div>

        <ExportBar busy={busy}
          onDeck={run("deck", generateInvestorDeckPptx)}
          onLegal={run("legal", generateLegalReviewPdf)}
          onViability={run("viability", generateViabilityReportPdf)} />

        <h2 className="text-white font-black text-sm mb-2 flex items-center gap-2"><TrendingUp size={15} className="text-cyan-400" /> Viability headline</h2>
        <p className="text-slate-300 text-xs leading-relaxed mb-4">{VIABILITY_REPORT.headline}</p>

        <h2 className="text-white font-black text-sm mb-2 flex items-center gap-2"><Shield size={15} className="text-cyan-400" /> Top-10 asset breakdown & draft claims</h2>
        <div className="space-y-2 mb-6">
          {[...TOP10].sort((a, b) => b.viability.score - a.viability.score).map((a) => <AssetRow key={a.rank} a={a} />)}
        </div>

        <h2 className="text-white font-black text-sm mb-2 flex items-center gap-2"><Landmark size={15} className="text-cyan-400" /> Grant submission drafts</h2>
        <div className="space-y-2 mb-6">
          {GRANT_DRAFTS.map((g) => (
            <div key={g.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <p className="text-cyan-400 text-xs font-bold">{g.target}</p>
              <p className="text-slate-400 text-[11px] mt-0.5"><b className="text-slate-300">Assets:</b> {g.assets.join(", ")} · <b className="text-slate-300">Amount:</b> {g.amount} · <b className="text-slate-300">Deadline:</b> {g.deadline}</p>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-1">{g.rationale}</p>
              <p className="text-slate-400 text-[11px] leading-relaxed"><b className="text-slate-300">Objective:</b> {g.objective}</p>
              <p className="text-amber-400/80 text-[10px] italic mt-1">{g.honest_note}</p>
            </div>
          ))}
        </div>

        <h2 className="text-white font-black text-sm mb-2 flex items-center gap-2"><FileText size={15} className="text-cyan-400" /> Recommendations</h2>
        <ol className="list-decimal ml-4 space-y-1 text-slate-300 text-xs mb-4">
          {VIABILITY_REPORT.recommendations.map((r, i) => <li key={i}>{r}</li>)}
        </ol>
      </div>
    </div>
  );
}