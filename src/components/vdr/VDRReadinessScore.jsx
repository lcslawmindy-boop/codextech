import { useState } from "react";
import { VDR_DOCUMENTS } from "./SmartVDRWorkflow";
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, TrendingUp, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// Each document contributes a weight to the total score
const DOC_WEIGHTS = {
  ip_overview: 10,
  patent_landscape: 8,
  fto_report: 7,
  revenue_summary: 10,
  stripe_report: 9,
  financial_model: 8,
  codebase_summary: 7,
  feature_inventory: 6,
  api_docs: 5,
  market_analysis: 8,
  acquisition_thesis: 7,
  ip_ownership: 8,
  legal_checklist: 7,
};

// Additional readiness checks beyond document generation
const READINESS_CHECKS = [
  { id: "llc", label: "LLC Formed", points: 15, category: "Legal", link: "https://stripe.com/atlas", linkLabel: "Stripe Atlas" },
  { id: "bank", label: "Business Bank Account Open", points: 10, category: "Legal", link: "https://mercury.com", linkLabel: "Mercury" },
  { id: "stripe_screenshots", label: "Stripe Screenshots Collected", points: 10, category: "Revenue", link: null },
  { id: "platform_video", label: "Platform Walkthrough Video Recorded", points: 10, category: "Platform", link: "https://loom.com", linkLabel: "Loom (free)" },
  { id: "nda_working", label: "NDA Gateway Tested & Working", points: 8, category: "Legal", link: "/vdr-nda", linkLabel: "Test NDA" },
  { id: "vdr_sessions", label: "VDR Access Links Generated", points: 7, category: "Deal", link: "/vdr-admin", linkLabel: "VDR Admin" },
  { id: "term_sheet", label: "Draft Term Sheet Prepared", points: 8, category: "Deal", link: "/acquisition-outreach", linkLabel: "Term Sheet" },
  { id: "broker_contacted", label: "At Least 1 Broker Contacted", points: 12, category: "Deal", link: "/exit-advisor", linkLabel: "Exit Advisor" },
];

const CATEGORY_COLORS = {
  "IP & Patents": "#a855f7",
  "Revenue & Financials": "#22c55e",
  "Platform & Technology": "#06b6d4",
  "Market & Strategy": "#f97316",
  "Legal & Compliance": "#eab308",
  "Legal": "#eab308",
  "Revenue": "#22c55e",
  "Platform": "#06b6d4",
  "Deal": "#f97316",
};

function ScoreGauge({ score }) {
  const color = score >= 80 ? "#22c55e" : score >= 55 ? "#f97316" : score >= 30 ? "#eab308" : "#ef4444";
  const label = score >= 80 ? "Buyer-Ready" : score >= 55 ? "Nearly Ready" : score >= 30 ? "In Progress" : "Early Stage";

  // SVG arc
  const r = 52;
  const cx = 70, cy = 70;
  const circumference = Math.PI * r; // half-circle
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center">
      <svg width={140} height={80} viewBox="0 0 140 80">
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#1f2937" strokeWidth={12} strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize={22} fontWeight="900">{score}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={color} fontSize={9} fontWeight="bold">{label}</text>
      </svg>
      <p className="text-gray-500 text-xs mt-1">out of 100</p>
    </div>
  );
}

function CheckItem({ check, checked, onToggle }) {
  const color = CATEGORY_COLORS[check.category] || "#6b7280";
  return (
    <div
      onClick={() => onToggle(check.id)}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
        checked ? "border-green-800/40 bg-green-950/10" : "border-gray-800 bg-gray-900/40 hover:border-gray-700"
      }`}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        checked ? "bg-green-600 border-green-600" : "border-gray-600"
      }`}>
        {checked && <CheckCircle2 size={11} className="text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${checked ? "line-through text-gray-600" : "text-white"}`}>{check.label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-bold" style={{ color }}>+{check.points} pts</span>
          {check.link && !checked && (
            <Link to={check.link} onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              <ExternalLink size={9} /> {check.linkLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VDRReadinessScore({ docState = {} }) {
  const [checks, setChecks] = useState({});

  const toggleCheck = (id) => setChecks(prev => ({ ...prev, [id]: !prev[id] }));

  // Calculate score from documents
  const totalDocWeight = Object.values(DOC_WEIGHTS).reduce((s, w) => s + w, 0);
  const docScore = VDR_DOCUMENTS.reduce((total, doc) => {
    const weight = DOC_WEIGHTS[doc.id] || 0;
    const isDone = docState[doc.id]?.status === "done" || (!doc.autoGenerate);
    return total + (isDone ? weight : 0);
  }, 0);
  const docPercent = (docScore / totalDocWeight) * 50; // docs = 50 pts max

  // Calculate score from readiness checks
  const totalCheckPoints = READINESS_CHECKS.reduce((s, c) => s + c.points, 0);
  const checkScore = READINESS_CHECKS.reduce((total, c) => total + (checks[c.id] ? c.points : 0), 0);
  const checkPercent = (checkScore / totalCheckPoints) * 50; // checks = 50 pts max

  const totalScore = Math.round(docPercent + checkPercent);

  // Group docs by category for breakdown
  const categoryBreakdown = Object.entries(
    VDR_DOCUMENTS.reduce((acc, doc) => {
      const cat = doc.category;
      if (!acc[cat]) acc[cat] = { total: 0, done: 0 };
      acc[cat].total += 1;
      if (docState[doc.id]?.status === "done" || !doc.autoGenerate) acc[cat].done += 1;
      return acc;
    }, {})
  );

  const readinessLabel =
    totalScore >= 80 ? "🟢 Buyer-Ready — Start reaching out to brokers" :
    totalScore >= 55 ? "🟡 Nearly Ready — Complete remaining docs & checks" :
    totalScore >= 30 ? "🟠 In Progress — Keep generating documents" :
    "🔴 Early Stage — Work through the checklist below";

  return (
    <div className="space-y-5">
      {/* Score card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreGauge score={totalScore} />
          <div className="flex-1">
            <p className="text-white font-black text-base mb-1">VDR Readiness Score</p>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">{readinessLabel}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/60 rounded-xl p-3 text-center">
                <p className="text-purple-400 font-black text-lg">{Math.round(docPercent)}<span className="text-xs text-gray-500">/50</span></p>
                <p className="text-gray-500 text-xs">Document Score</p>
              </div>
              <div className="bg-gray-800/60 rounded-xl p-3 text-center">
                <p className="text-orange-400 font-black text-lg">{Math.round(checkPercent)}<span className="text-xs text-gray-500">/50</span></p>
                <p className="text-gray-500 text-xs">Readiness Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document category breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <p className="text-white font-black text-sm mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-purple-400" /> Document Coverage
        </p>
        <div className="space-y-2">
          {categoryBreakdown.map(([cat, { total, done }]) => {
            const pct = Math.round((done / total) * 100);
            const color = CATEGORY_COLORS[cat] || "#6b7280";
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-xs font-semibold">{cat}</span>
                  <span className="text-xs font-bold" style={{ color }}>{done}/{total}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Readiness checklist */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <p className="text-white font-black text-sm mb-1 flex items-center gap-2">
          <ShieldCheck size={14} className="text-orange-400" /> Buyer Readiness Checklist
        </p>
        <p className="text-gray-500 text-xs mb-3">Mark each item as complete to increase your score.</p>
        <div className="space-y-2">
          {READINESS_CHECKS.map(check => (
            <CheckItem key={check.id} check={check} checked={!!checks[check.id]} onToggle={toggleCheck} />
          ))}
        </div>
      </div>

      {/* What's missing */}
      {totalScore < 80 && (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-4">
          <p className="text-amber-300 font-black text-sm mb-2">⚡ To reach Buyer-Ready status:</p>
          <ul className="space-y-1">
            {[
              ...VDR_DOCUMENTS.filter(d => d.autoGenerate && docState[d.id]?.status !== "done").slice(0, 3).map(d => `Generate: ${d.title}`),
              ...READINESS_CHECKS.filter(c => !checks[c.id]).slice(0, 3).map(c => `Complete: ${c.label}`),
            ].map((item, i) => (
              <li key={i} className="text-amber-200/70 text-xs flex items-center gap-2">
                <AlertCircle size={9} className="text-amber-400 flex-shrink-0" /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}