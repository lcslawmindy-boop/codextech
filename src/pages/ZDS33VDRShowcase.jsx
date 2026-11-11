import { Link } from "react-router-dom";
import { ArrowLeft, Lock, AlertTriangle, FolderLock } from "lucide-react";
import { FACTS, SCORECARD, METHODS, BLENDED, FINDINGS, VDR_FOLDERS, money } from "@/lib/zds33Valuation";

const sevColor = { high: "#f87171", med: "#fbbf24" };
const Section = ({ title, children }) => (
  <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 mb-5">
    <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-3">{title}</h2>
    {children}
  </section>
);

export default function ZDS33VDRShowcase() {
  const total = SCORECARD.reduce((s, r) => s + r.score, 0);
  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-1">
          <Link to="/zds33-admin" className="text-slate-400"><ArrowLeft size={16} /></Link>
          <h1 className="text-xl font-black">ZDS33 VDR Showcase</h1>
          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-red-300 border border-red-800 rounded px-2 py-1"><Lock size={11} /> ADMIN ONLY</span>
        </div>
        <p className="text-xs text-slate-500 mb-5">Analysis and valuation from the Business Plan, Investor Briefing and ZDS Teaser. Internal, advisory, unverified. Not visible to the public.</p>

        <Section title="What the documents establish">
          <div className="divide-y divide-slate-900">
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid sm:grid-cols-3 gap-1 py-2 text-xs"><span className="text-slate-500">{k}</span><span className="sm:col-span-2 text-slate-200">{v}</span></div>
            ))}
          </div>
        </Section>

        <Section title="Indicative HDG score (Appendix C rubric)">
          {SCORECARD.map((r) => (
            <div key={r.name} className="mb-2">
              <div className="flex justify-between text-xs"><span>{r.name}</span><span className="font-bold">{r.score} / {r.max}</span></div>
              <div className="h-1.5 bg-slate-900 rounded"><div className="h-1.5 rounded bg-cyan-500" style={{ width: `${(r.score / r.max) * 100}%` }} /></div>
              <p className="text-[11px] text-slate-500 mt-0.5">{r.why}</p>
            </div>
          ))}
          <p className="mt-3 text-sm font-bold">Total {total} / 100 <span className="text-amber-400 font-normal">· below the Tier 3 threshold (35). Not yet HDG-classifiable.</span></p>
        </Section>

        <Section title="Valuation (indicative)">
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            {METHODS.map((m) => (
              <div key={m.method} className="rounded-xl border border-slate-800 p-3">
                <p className="text-xs font-bold">{m.method}</p>
                <p className="text-lg font-black text-cyan-300 my-1">{money(m.low)} to {money(m.high)}</p>
                <p className="text-[11px] text-slate-500">{m.note}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-cyan-800 bg-cyan-950/20 p-4">
            <p className="text-[10px] uppercase tracking-widest text-cyan-400">Blended working range, Zenith portfolio today</p>
            <p className="text-3xl font-black">{money(BLENDED.low)} to {money(BLENDED.high)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Rises materially after provisional filings, ITAR/EAR classification, a submitted SBIR, and an independent valuation. Any lender or investor will require the independent valuation. Stated values of $15M or more are not supported by the evidence on file.</p>
          </div>
        </Section>

        <Section title="Findings to fix before sharing">
          {FINDINGS.map((f) => (
            <div key={f.t} className="flex gap-2 py-2 border-b border-slate-900 last:border-0">
              <AlertTriangle size={14} style={{ color: sevColor[f.sev] }} className="mt-0.5 flex-shrink-0" />
              <div><p className="text-xs font-bold">{f.t}</p><p className="text-[11px] text-slate-400">{f.d}</p></div>
            </div>
          ))}
        </Section>

        <Section title="Planned data room contents (75 documents)">
          {VDR_FOLDERS.map((v) => (
            <div key={v.company} className="flex gap-3 py-2 border-b border-slate-900 last:border-0">
              <FolderLock size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs"><p className="font-bold">{v.company} <span className="text-slate-500 font-normal">· {v.folders} folders · {v.docs} docs</span></p><p className="text-slate-400">{v.items}</p></div>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 mt-3">Upload and manage the actual files in the ZDS33 Control "Classify and Publish" tab. Every document is private and opens only through signed links for admins. The existing VDR Admin handles NDA-gated outside access.</p>
        </Section>
      </div>
    </div>
  );
}