import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Loader2, Presentation, Search, ClipboardList, Copy, Check,
  ExternalLink, Download, Megaphone, Lightbulb,
} from "lucide-react";
import { ANGEL_DECK, LOCATE_PLAYBOOK, OUTREACH_RULES, STARTUPS_PROFILE } from "@/lib/angelInvestorData";
import generateAngelPitchDeck from "@/lib/generateAngelPitchDeck";

function CopyButton({ text, label }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }
    catch { alert("Copy failed — select and copy manually."); }
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold">
      {done ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
      {done ? "Copied" : label || "Copy"}
    </button>
  );
}

function SlideCard({ s, i }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-3 flex items-center gap-2">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
        <span className="text-white text-xs font-bold flex-1">{s.title}</span>
        <span className="text-[10px] text-slate-500">{open ? "hide notes" : "show notes"}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-slate-800 pt-3">
          <ul className="space-y-1 mb-2">
            {s.bullets.map((b, bi) => <li key={bi} className="text-slate-400 text-[11px] leading-snug">• {b}</li>)}
          </ul>
          <p className="text-[10px] text-cyan-500 uppercase tracking-wider font-bold mt-2">Speaker notes</p>
          <p className="text-slate-300 text-[11px] italic leading-relaxed mt-0.5">{s.notes}</p>
        </div>
      )}
    </div>
  );
}

function ProfileRow({ label, value }) {
  if (Array.isArray(value)) value = value.join(", ");
  return (
    <div className="py-2 border-b border-slate-800 last:border-0">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</span>
        <CopyButton text={String(value)} />
      </div>
      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default function AngelInvestorPlaybook() {
  const [tab, setTab] = useState("deck");
  const [busy, setBusy] = useState(false);

  const exportDeck = async () => {
    setBusy(true);
    try { await generateAngelPitchDeck(); }
    catch (e) { alert(e.message || "Export failed"); }
    finally { setBusy(false); }
  };

  const copyWholeProfile = async () => {
    const lines = Object.entries(STARTUPS_PROFILE).map(([k, v]) => {
      const val = Array.isArray(v) ? v.join(", ") : v;
      return `${k.toUpperCase().replace(/_/g, " ")}:\n${val}`;
    }).join("\n\n");
    try { await navigator.clipboard.writeText(lines); alert("Full profile copied to clipboard."); }
    catch { alert("Copy failed."); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-4 py-3 sticky top-0 z-40 bg-slate-950/95 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/zds33-admin" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="text-white font-black text-sm">Angel Investor Playbook</h1>
            <p className="text-slate-500 text-[10px]">Pitch deck · locate angels · Startups.com profile</p>
          </div>
        </div>
        <button onClick={exportDeck} disabled={busy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold">
          {busy ? <Loader2 className="animate-spin" size={13} /> : <Download size={13} />}
          {busy ? "Building…" : "Export Deck (.pptx)"}
        </button>
      </div>

      <div className="flex gap-1 border-b border-slate-800 px-4 mb-4 overflow-x-auto">
        {[["deck", "Pitch Deck", Presentation], ["locate", "Locate Angels", Search], ["profile", "Startups.com Profile", ClipboardList]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 -mb-px whitespace-nowrap ${tab === k ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-500"}`}>
            <Icon size={13} /> {l}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 max-w-3xl mx-auto">
        {tab === "deck" && (
          <div>
            <div className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 p-3 mb-4 flex gap-2">
              <Lightbulb size={15} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-cyan-100 text-xs leading-relaxed">
                {ANGEL_DECK.length} slides with speaker notes. Export the .pptx for live pitching (notes appear
                in presenter view). Lead every pitch with the fundable-now assets — SVRRD & MYTSA — never the
                contested-science assets. File a provisional before disclosing any technical detail.
              </p>
            </div>
            <div className="space-y-2">
              {ANGEL_DECK.map((s, i) => <SlideCard key={i} s={s} i={i} />)}
            </div>
          </div>
        )}

        {tab === "locate" && (
          <div>
            <div className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 p-3 mb-4">
              <p className="text-cyan-100 text-xs leading-relaxed">
                Where to find angels for this profile. Target 20-30 to land 3-5 meetings. This is a numbers
                game at pre-seed.
              </p>
            </div>
            <div className="space-y-2 mb-5">
              {LOCATE_PLAYBOOK.map((p) => (
                <div key={p.name} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white text-xs font-bold">{p.name}</p>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold">
                        open <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-1"><b className="text-slate-300">What:</b> {p.what}</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5"><b className="text-slate-300">How:</b> {p.how}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Megaphone size={14} className="text-amber-400" />
                <p className="text-amber-300 text-xs font-bold">Outreach rules</p>
              </div>
              <ul className="space-y-1">
                {OUTREACH_RULES.map((r, i) => <li key={i} className="text-amber-200/80 text-[11px] leading-relaxed">• {r}</li>)}
              </ul>
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div>
            <div className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 p-3 mb-4 flex items-center justify-between gap-2">
              <p className="text-cyan-100 text-xs leading-relaxed flex-1">
                Ready-to-paste fields for a Startups.com / Fundable / Gust profile. Copy each field or the whole kit.
              </p>
              <button onClick={copyWholeProfile} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex-shrink-0">
                <Copy size={13} /> Copy all
              </button>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-3">
              {Object.entries(STARTUPS_PROFILE).map(([k, v]) => (
                <ProfileRow key={k} label={k.replace(/_/g, " ")} value={v} />
              ))}
            </div>
            <p className="text-amber-400/70 text-[10px] italic mt-3 leading-relaxed">
              Replace the website placeholder with your real company URL before publishing the profile. All
              technical claims are conditioned on a signed NDA and a filed provisional.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}