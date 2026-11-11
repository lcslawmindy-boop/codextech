import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminDashboard from "@/components/zds33/admin/AdminDashboard";
import AdminClassify from "@/components/zds33/admin/AdminClassify";
import AdminOpportunities from "@/components/zds33/admin/AdminOpportunities";
import AdminInquiries from "@/components/zds33/admin/AdminInquiries";
import ValuationSummary from "@/components/zds33/admin/ValuationSummary";

const TABS = [
  ["dashboard", "Dashboard", AdminDashboard],
  ["valuation", "Valuation Summary", ValuationSummary],
  ["classify", "Classify & Publish", AdminClassify],
  ["opps", "Opportunities", AdminOpportunities],
  ["inquiries", "Inquiries", AdminInquiries],
];

export default function ZDS33Admin() {
  const [tab, setTab] = useState("dashboard");
  const Active = TABS.find((t) => t[0] === tab)[2];
  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-1">
          <Link to="/zds33" className="text-slate-400"><ArrowLeft size={16} /></Link>
          <h1 className="text-xl font-black tracking-wide">ZDS33 Integrated Systems · Control</h1>
        </div>
        <p className="text-xs text-slate-500 mb-4">Research → IP Asset → Invention → Build/Validation → Commercialization Readiness → Broker / License / Partner. One IP asset, many domains.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Link to="/filing-playbook" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 border border-cyan-600/40 text-cyan-300 text-xs font-bold hover:bg-cyan-600/30">
            📋 Filing & Equity-Raise Playbook — claims, steps, deck & grant drafts →
          </Link>
          <Link to="/investor-portfolio" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-600/40 text-emerald-300 text-xs font-bold hover:bg-emerald-600/30">
            📊 Investor Deck · Legal Review · Viability Report (top 10) →
          </Link>
          <Link to="/grant-templates" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-600/40 text-violet-300 text-xs font-bold hover:bg-violet-600/30">
            📝 Grant Templates — AFWERX · Army ARL · NSF · USDA NIFA (submission-ready) →
          </Link>
          <Link to="/zero-capital-plan" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600/20 border border-pink-600/40 text-pink-300 text-xs font-bold hover:bg-pink-600/30">
            🤝 Zero-Capital Partnership Plan — $0 to start, trade IP rights for resources →
          </Link>
          <Link to="/angel-playbook" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 border border-rose-600/40 text-rose-300 text-xs font-bold hover:bg-rose-600/30">
            🎯 Angel Investor Playbook — pitch deck (w/ notes) + locate angels + Startups.com profile →
          </Link>
          <Link to="/handoff-checklist" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-600/40 text-red-300 text-xs font-bold hover:bg-red-600/30">
            ✅ Handoff Checklist — what's ready, what's blocking the check →
          </Link>
          <Link to="/investor-status" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-600/40 text-indigo-300 text-xs font-bold hover:bg-indigo-600/30">
            📈 Investor Status — partners contacted, deck reviews, deal status per asset →
          </Link>
          <Link to="/executive-summary" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600/20 border border-teal-600/40 text-teal-300 text-xs font-bold hover:bg-teal-600/30">
            📄 Executive Summary — one-page valuation + viability (PDF) →
          </Link>
        </div>
        <div className="flex gap-1 border-b border-slate-800 mb-5 overflow-x-auto">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px whitespace-nowrap ${tab === k ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-500"}`}>{l}</button>
          ))}
        </div>
        <Active />
      </div>
    </div>
  );
}