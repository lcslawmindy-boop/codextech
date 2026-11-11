import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Loader2, Shield, FileText, ListChecks, Presentation, Landmark,
  AlertTriangle, Download, ChevronDown, ChevronRight, Gavel, Coins, Rocket,
} from "lucide-react";
import { FILING_SEQUENCE, CLAIMS, EQUITY_ASK, DECK_SLIDES, GRANT_PROPOSALS } from "@/lib/filingPlaybook";
import generateFilingPlaybookPptx from "@/lib/generateFilingPlaybookPptx";

const TRACK_COLOR = { "Non-ITAR": "#06b6d4", ITAR: "#fbbf24" };

function Notice() {
  return (
    <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-4 mb-5 flex gap-3">
      <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
      <p className="text-amber-200/90 text-xs leading-relaxed">
        <b>Read this first.</b> Nothing on this page is a filed patent, an investment offer, or legal advice.
        The "approved" filing requests in the database are <b>internal authorizations only</b> — no application
        has been submitted to the USPTO. Every claim below is a <b>draft scaffold</b> that a registered US patent
        attorney must review and finalize before filing. ITAR-tagged claims must be filed US-only under a Technology Control Plan.
      </p>
    </div>
  );
}

function Section({ id, icon: Icon, title, accent, children }) {
  return (
    <section id={id} className="mb-8 scroll-mt-20">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} style={{ color: accent }} />
        <h2 className="text-white font-black text-base">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ClaimCard({ c }) {
  const [open, setOpen] = useState(false);
  const color = TRACK_COLOR[c.track];
  return (
    <div className="rounded-xl border bg-slate-900/60 overflow-hidden" style={{ borderColor: color + "40" }}>
      <button onClick={() => setOpen(!open)} className="w-full text-left p-3 flex items-center gap-2">
        {open ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color, background: color + "20" }}>{c.code}</span>
        <span className="text-white text-xs font-bold flex-1">{c.name}</span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{c.track}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-slate-800 pt-3">
          <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">{c.domain}</p>
          {c.independent.map((cl, i) => (
            <p key={i} className="text-slate-200 text-xs leading-relaxed mb-1.5">{cl}</p>
          ))}
          {c.dependent.map((cl, i) => (
            <p key={i} className="text-slate-400 text-xs leading-relaxed mb-1">{cl}</p>
          ))}
          <p className="text-amber-400/80 text-[10px] italic mt-2">{c.note}</p>
        </div>
      )}
    </div>
  );
}

function GrantCard({ g }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-3 flex items-center gap-2">
        {open ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
        <Landmark size={14} className="text-cyan-400" />
        <span className="text-white text-xs font-bold flex-1">{g.title}</span>
        <span className="text-[10px] text-amber-400 font-bold">{g.amount}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-slate-800 pt-3 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <p><span className="text-slate-500">Program:</span> <span className="text-slate-300">{g.program}</span></p>
            <p><span className="text-slate-500">Period:</span> <span className="text-slate-300">{g.period}</span></p>
            <p><span className="text-slate-500">Deadline:</span> <span className="text-slate-300">{g.deadline}</span></p>
            <p><span className="text-slate-500">Keywords:</span> <span className="text-slate-300">{g.keywords}</span></p>
          </div>
          <p><span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Objective</span><br /><span className="text-slate-300">{g.objective}</span></p>
          <p><span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Innovation</span><br /><span className="text-slate-300">{g.innovation}</span></p>
          <p><span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Approach</span><br /><span className="text-slate-300">{g.approach}</span></p>
          <div>
            <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Phase I Tasks</span>
            <ol className="list-decimal ml-4 mt-1 text-slate-300 space-y-0.5">
              {g.phase1_tasks.map((t, i) => <li key={i}>{t}</li>)}
            </ol>
          </div>
          <p><span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Commercialization</span><br /><span className="text-slate-300">{g.commercialization}</span></p>
          <p className="text-amber-400/80 text-[10px] italic">{g.itar}</p>
        </div>
      )}
    </div>
  );
}

export default function FilingPlaybook() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try { await generateFilingPlaybookPptx(); }
    finally { setExporting(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-4 py-3 sticky top-0 z-40 bg-slate-950/95 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/zds33-admin" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="text-white font-black text-sm">Filing & Equity-Raise Playbook</h1>
            <p className="text-slate-500 text-[10px]">Claims, steps, investor deck & grant proposals</p>
          </div>
        </div>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold">
          {exporting ? <Loader2 className="animate-spin" size={13} /> : <Download size={13} />}
          {exporting ? "Building…" : "Export PPTX"}
        </button>
      </div>

      <div className="px-4 py-4">
        <Notice />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <a href="#steps" className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 hover:border-cyan-500">
            <ListChecks size={16} className="text-cyan-400 mb-1" />
            <p className="text-[10px] text-slate-500 uppercase">Step by Step</p>
            <p className="text-white text-xs font-bold">{FILING_SEQUENCE.length} steps</p>
          </a>
          <a href="#claims" className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 hover:border-cyan-500">
            <Shield size={16} className="text-cyan-400 mb-1" />
            <p className="text-[10px] text-slate-500 uppercase">Claim Drafts</p>
            <p className="text-white text-xs font-bold">{CLAIMS.length} assets</p>
          </a>
          <a href="#deck" className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 hover:border-cyan-500">
            <Presentation size={16} className="text-cyan-400 mb-1" />
            <p className="text-[10px] text-slate-500 uppercase">Investor Deck</p>
            <p className="text-white text-xs font-bold">{DECK_SLIDES.length} slides</p>
          </a>
          <a href="#grants" className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 hover:border-cyan-500">
            <Landmark size={16} className="text-cyan-400 mb-1" />
            <p className="text-[10px] text-slate-500 uppercase">Grant Proposals</p>
            <p className="text-white text-xs font-bold">{GRANT_PROPOSALS.length} drafts</p>
          </a>
        </div>

        <Section id="steps" icon={ListChecks} title="Step-by-Step Filing Sequence" accent="#06b6d4">
          <div className="space-y-2">
            {FILING_SEQUENCE.map((s) => (
              <div key={s.n} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">{s.n}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">{s.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed mt-1">{s.detail}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-[10px]">
                      <span className="text-cyan-400"><b>When:</b> {s.days}</span>
                      <span className="text-amber-400"><b>Cost:</b> {s.cost}</span>
                      <span className="text-slate-500"><b>Owner:</b> {s.owner}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="claims" icon={Shield} title="Provisional Claim Drafts (what to file for what)" accent="#06b6d4">
          <p className="text-slate-500 text-[11px] mb-3">Tap any asset to expand. Independent claims first, dependent claims below. All drafts — review with counsel.</p>
          <div className="space-y-2">
            {CLAIMS.map((c) => <ClaimCard key={c.code} c={c} />)}
          </div>
        </Section>

        <Section id="deck" icon={Presentation} title="Investor Deck (with speaker notes)" accent="#06b6d4">
          <div className="grid md:grid-cols-2 gap-3">
            {DECK_SLIDES.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-white text-xs font-bold mb-1">{i + 1}. {s.title}</p>
                <ul className="space-y-0.5 mb-2">
                  {s.bullets.map((b, bi) => <li key={bi} className="text-slate-400 text-[11px] leading-snug">• {b}</li>)}
                </ul>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-2">Speaker notes</p>
                <p className="text-slate-500 text-[11px] italic leading-relaxed">{s.notes}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="equity" icon={Coins} title="The Equity Ask (two tracks)" accent="#fbbf24">
          <p className="text-slate-400 text-xs leading-relaxed mb-3">{EQUITY_ASK.summary}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {[{ k: "trackA", c: "#fbbf24" }, { k: "trackB", c: "#06b6d4" }].map(({ k, c }) => {
              const tr = EQUITY_ASK[k];
              return (
                <div key={k} className="rounded-xl border p-3 bg-slate-900/50" style={{ borderColor: c + "40" }}>
                  <p className="text-xs font-bold mb-2" style={{ color: c }}>{tr.title}</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-1"><b className="text-slate-300">Use of funds:</b> {tr.use}</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-1"><b className="text-slate-300">Investor:</b> {tr.investor}</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-1"><b className="text-slate-300">Structure:</b> {tr.structure}</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed"><b className="text-slate-300">Risk:</b> {tr.risk}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="grants" icon={Landmark} title="Grant Proposals — drafted for submission" accent="#06b6d4">
          <p className="text-slate-500 text-[11px] mb-3">Non-dilutive funding first. Tap to expand. Confirm open solicitation topics and exact deadlines on each agency portal before submitting.</p>
          <div className="space-y-2">
            {GRANT_PROPOSALS.map((g) => <GrantCard key={g.id} g={g} />)}
          </div>
        </Section>

        <Section id="final" icon={Rocket} title="Immediate next actions" accent="#06b6d4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <ol className="space-y-1.5 list-decimal ml-4 text-slate-300 text-xs">
              <li>Retain a registered US patent attorney this week.</li>
              <li>File the 10 non-ITAR provisional applications (Day 4–21).</li>
              <li>Begin DDTC registration + Technology Control Plan (Day 4).</li>
              <li>File the 10 ITAR provisional applications under the TCP (Day 10–40).</li>
              <li>Submit the 5 drafted grant proposals (Day 14–60).</li>
              <li>Open the data room and pitch investors (Day 21+).</li>
            </ol>
            <p className="text-amber-400/80 text-[10px] italic mt-3">Nothing here is a filed patent, an investment offer, or legal advice. Claims and proposals require counsel review before filing or submission.</p>
          </div>
        </Section>
      </div>
    </div>
  );
}