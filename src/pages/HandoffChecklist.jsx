import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle, FileText, XCircle, Loader2 } from "lucide-react";

// Handoff materials status. Honest: materials are drafted, but the one gate
// (provisional filing) is not done — no buyer pays for an unfiled idea.
const CHECKLIST = [
  {
    id: "provisionals",
    label: "Provisional patents filed (USPTO)",
    status: "blocked",
    detail: "THE gate. Zero patents on record today. File via USPTO Patent Pro Bono Program ($0 attorney fees) + micro-entity fee (~$65–300 each). Unfiled = unsellable.",
    link: "/zero-capital-plan",
    linkLabel: "Zero-Capital Plan (pro-bono path)",
  },
  {
    id: "claims",
    label: "Patent claim drafts (10 lead assets)",
    status: "ready",
    detail: "Independent + dependent claim drafts complete for SVRRD, MYTSA and 8 more. Drafts only — counsel must finalize before filing.",
    link: "/filing-playbook",
    linkLabel: "Filing Playbook → Claims",
  },
  {
    id: "pitch",
    label: "Angel pitch deck (with speaker notes)",
    status: "ready",
    detail: "14-slide deck, speaker notes, .pptx export. Leads with fundable-now assets (SVRRD, MYTSA).",
    link: "/angel-playbook",
    linkLabel: "Angel Playbook",
  },
  {
    id: "viability",
    label: "Commercial viability report",
    status: "ready",
    detail: "Top-10 scored scorecard + grant drafts + recommendations + risks. PDF export.",
    link: "/investor-portfolio",
    linkLabel: "Investor Portfolio",
  },
  {
    id: "legal",
    label: "Legal review package",
    status: "ready",
    detail: "Draft claims + legal-review guidance per asset. For counsel to finalize. PDF export.",
    link: "/investor-portfolio",
    linkLabel: "Investor Portfolio",
  },
  {
    id: "grants",
    label: "Grant proposals (5, submission-ready)",
    status: "ready",
    detail: "AFWERX, Army ARL, NSF, USDA NIFA, NIH NIBIB. Non-dilutive funding to build the tech without spending equity.",
    link: "/grant-templates",
    linkLabel: "Grant Templates",
  },
  {
    id: "zerocap",
    label: "Zero-capital partner one-pager",
    status: "ready",
    detail: "One-page partner outreach PDF + partner tracker. For the pro-bono counsel / university / OEM path.",
    link: "/zero-capital-plan",
    linkLabel: "Zero-Capital Plan",
  },
  {
    id: "profile",
    label: "Startups.com / Gust profile kit",
    status: "ready",
    detail: "Every profile field pre-written. Copy-paste into Startups.com, Fundable, or Gust.",
    link: "/angel-playbook",
    linkLabel: "Angel Playbook → Profile",
  },
  {
    id: "broker",
    label: "IP broker listing live",
    status: "action",
    detail: "Action needed: list the filed portfolio with an IP broker / marketplace. Broker shops it, takes 20-40%, you get the check. Do this AFTER provisionals are filed.",
    link: "/ip-broker",
    linkLabel: "IP Broker page",
  },
];

const STATUS_META = {
  ready: { icon: CheckCircle2, color: "#34d399", bg: "#064e3b", label: "Ready" },
  blocked: { icon: XCircle, color: "#f87171", bg: "#450a0a", label: "BLOCKED — not filed" },
  action: { icon: AlertCircle, color: "#fbbf24", bg: "#451a03", label: "Action needed" },
  draft: { icon: Loader2, color: "#60a5fa", bg: "#0c2d4a", label: "Draft" },
};

function Item({ item, checked, onToggle }) {
  const meta = STATUS_META[item.status];
  const Icon = meta.icon;
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(item.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 ${checked ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}
          aria-label="toggle"
        >
          {checked && <CheckCircle2 size={14} className="text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-white text-xs font-bold">{item.label}</p>
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: meta.color, background: meta.bg }}>
              <Icon size={9} className="inline mr-0.5" /> {meta.label}
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed mb-2">{item.detail}</p>
          <Link to={item.link} className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold">
            {item.linkLabel} →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HandoffChecklist() {
  const [done, setDone] = useState({});
  const toggle = (id) => setDone((p) => ({ ...p, [id]: !p[id] }));

  const readyCount = CHECKLIST.filter((c) => c.status === "ready").length;
  const blockedCount = CHECKLIST.filter((c) => c.status === "blocked").length;
  const actionCount = CHECKLIST.filter((c) => c.status === "action").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-4 py-3 sticky top-0 z-40 bg-slate-950/95 backdrop-blur flex items-center gap-2">
        <Link to="/zds33-admin" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-white font-black text-sm">Handoff Checklist</h1>
          <p className="text-slate-500 text-[10px]">Status of materials for buyer / broker handoff</p>
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        {/* The one blocker */}
        <div className="rounded-xl border border-red-700/50 bg-red-950/30 p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-red-400" />
            <p className="text-red-300 text-xs font-bold">The one thing standing between you and a check</p>
          </div>
          <p className="text-red-100/80 text-[11px] leading-relaxed">
            Everything else is drafted. The single gate is filing the provisionals. Until a provisional
            is on record at the USPTO, no broker or buyer will pay — an unfiled idea can't be owned or
            enforced. File via the USPTO Patent Pro Bono Program ($0 attorney fees) + micro-entity fee
            (~$65–300 each). Once filed, hand it to a broker and they do the selling.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-2.5 text-center">
            <p className="text-emerald-400 text-lg font-black">{readyCount}</p>
            <p className="text-emerald-300/70 text-[9px] uppercase font-bold">Ready</p>
          </div>
          <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-2.5 text-center">
            <p className="text-red-400 text-lg font-black">{blockedCount}</p>
            <p className="text-red-300/70 text-[9px] uppercase font-bold">Blocked</p>
          </div>
          <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-2.5 text-center">
            <p className="text-amber-400 text-lg font-black">{actionCount}</p>
            <p className="text-amber-300/70 text-[9px] uppercase font-bold">Action</p>
          </div>
        </div>

        <div className="space-y-2">
          {CHECKLIST.map((item) => (
            <Item key={item.id} item={item} checked={done[item.id]} onToggle={toggle} />
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
          <p className="text-slate-500 text-[10px] leading-relaxed">
            <b className="text-slate-400">Path to check:</b> File provisionals (pro-bono, ~$65–300 fee) →
            Hand filed portfolio to IP broker → Broker shops to buyers/licensees → You sign, you cash.
            Broker takes 20–40%; you get a lump sum or royalty. Your remaining work after filing is
            signing documents.
          </p>
        </div>
      </div>
    </div>
  );
}