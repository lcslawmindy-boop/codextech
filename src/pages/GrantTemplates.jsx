import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, FileText, Landmark, Leaf, Waves, Shield } from "lucide-react";
import { generateAfwerxTemplate, generateArmyArlTemplate, generateNsfSvrrdTemplate, generateUsdaMysaTemplate } from "@/lib/generateGrantTemplates";

const GRANTS = [
  { key: "afwerx", title: "AFWERX SBIR Phase I", sub: "Quantum-Encrypted Tactical Mesh Node (INV-01)", tag: "ITAR", amount: "$75k Phase I · up to $1.9M Phase I+II", icon: Shield, color: "#fbbf24", fn: generateAfwerxTemplate },
  { key: "arl", title: "Army ARL SBIR Phase I", sub: "Autonomous Swarm Coordination AI Core (INV-03)", tag: "ITAR", amount: "$100k Phase I", icon: Shield, color: "#fbbf24", fn: generateArmyArlTemplate },
  { key: "nsf", title: "NSF CBET", sub: "Schauberger-Vortex River Device (SVRRD, 66/100)", tag: "Non-ITAR · Fundable now", amount: "~$300k", icon: Waves, color: "#10b981", fn: generateNsfSvrrdTemplate },
  { key: "usda", title: "USDA NIFA AFRI", sub: "MorphoYield Agri Array (MYTSA, 58/100)", tag: "Non-ITAR · Fundable now", amount: "~$500k", icon: Leaf, color: "#10b981", fn: generateUsdaMysaTemplate },
];

export default function GrantTemplates() {
  const [busy, setBusy] = useState({});
  const run = (k, fn) => async () => {
    setBusy((b) => ({ ...b, [k]: true }));
    try { await fn(); } finally { setBusy((b) => ({ ...b, [k]: false })); }
  };
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-4 py-3 sticky top-0 z-40 bg-slate-950/95 backdrop-blur flex items-center gap-2">
        <Link to="/zds33-admin" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-white font-black text-sm">Grant Application Templates</h1>
          <p className="text-slate-500 text-[10px]">Submission-ready SBIR / agency templates · auto-generated from project research data</p>
        </div>
      </div>
      <div className="px-4 py-4 space-y-3">
        <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-3 text-amber-200/90 text-[11px] leading-relaxed">
          <b>Submission-ready.</b> Each export produces a complete proposal PDF (cover sheet, project summary, significance, objectives, work plan, related work, personnel, facilities, commercialization, budget justification, prior funding, and ITAR handling where applicable). Confirm exact solicitation amounts, deadlines, and page limits on the agency portal before submitting. Claim scaffolds referenced within require registered patent-counsel review before any USPTO filing.
        </div>
        {GRANTS.map((g) => {
          const Icon = g.icon;
          return (
            <div key={g.key} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg p-2 flex-shrink-0" style={{ background: g.color + "20" }}>
                  <Icon size={18} style={{ color: g.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white text-sm font-bold">{g.title}</h3>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: g.color, background: g.color + "20" }}>{g.tag}</span>
                  </div>
                  <p className="text-slate-300 text-xs mt-0.5">{g.sub}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{g.amount}</p>
                </div>
                <button onClick={run(g.key, g.fn)} disabled={busy[g.key]}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold whitespace-nowrap flex-shrink-0">
                  {busy[g.key] ? <Loader2 className="animate-spin" size={13} /> : <FileText size={13} />}
                  {busy[g.key] ? "Building…" : "Download PDF"}
                </button>
              </div>
            </div>
          );
        })}
        <p className="text-slate-500 text-[10px] pt-2 flex items-center gap-1.5">
          <Landmark size={11} className="text-cyan-400" />
          Non-dilutive funding first — AFWERX + Army ARL cover the ITAR defense assets; NSF + USDA NIFA cover the fundable-now non-ITAR leads (SVRRD, MYTSA).
        </p>
      </div>
    </div>
  );
}