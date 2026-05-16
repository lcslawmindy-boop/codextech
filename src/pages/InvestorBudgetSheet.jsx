import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, DollarSign, TrendingUp, Shield, Clock, CheckCircle } from "lucide-react";
import jsPDF from "jspdf";

// ── Budget Line Items ─────────────────────────────────────────────────────────
const BUDGET_ITEMS = [
  {
    category: "Legal Entity Formation",
    color: "#6366f1",
    items: [
      { item: "Delaware LLC Formation (Stripe Atlas)", cost: 500, timing: "Month 1", notes: "Includes registered agent 1yr, EIN, operating agreement" },
      { item: "Business Bank Account (Mercury)", cost: 0, timing: "Month 1", notes: "Free — instant setup for funded startups" },
      { item: "M&A Attorney Retainer (5hrs)", cost: 2500, timing: "Month 1–2", notes: "Term sheet review, APA structuring, deal advisory" },
      { item: "CPA / Tax Strategy Consultation", cost: 800, timing: "Month 1", notes: "Asset sale vs. stock sale optimization, acquisition tax planning" },
      { item: "Trademark Search + Filing (USPTO)", cost: 1200, timing: "Month 2", notes: "'Aethon Apex IP' brand in IC 042 — research/software services" },
    ],
  },
  {
    category: "Patent Filings",
    color: "#f59e0b",
    items: [
      { item: "Provisional Patent App #1 — MEG / Advanced Energy", cost: 2800, timing: "Month 2", notes: "Attorney-assisted PPA on Motionless EM Generator cluster" },
      { item: "Provisional Patent App #2 — Bioelectromagnetic Therapeutics", cost: 2800, timing: "Month 2", notes: "Prioré-type MCCS + TRD-1 Telomere Resonance Device" },
      { item: "Provisional Patent App #3 — Scalar EM Communications", cost: 2800, timing: "Month 3", notes: "G-Com novel modulation topology — defensible claims" },
      { item: "FTO Analysis (Freedom-to-Operate)", cost: 3500, timing: "Month 2–3", notes: "Attorney review across all 6 clusters — confirms clear-to-operate status" },
      { item: "IP Valuation Report (Professional)", cost: 5000, timing: "Month 3", notes: "Certified third-party valuation — critical for buyer credibility" },
    ],
  },
  {
    category: "Platform & Acquisition Prep",
    color: "#22c55e",
    items: [
      { item: "Platform Video Walkthrough (Loom + editing)", cost: 500, timing: "Month 1", notes: "Professional 10-min Loom + 3-min highlight reel for brokers" },
      { item: "Broker Engagement (Quiet Light / Empire Flippers)", cost: 0, timing: "Month 2–3", notes: "No upfront — 8–12% success fee at close only" },
      { item: "Private Listing Fees (Acquire.com + Flippa)", cost: 150, timing: "Month 2", notes: "Stealth/confidential listings — buyers sign NDA before details" },
      { item: "Due Diligence Package Design (PDF kit)", cost: 300, timing: "Month 2", notes: "Professional formatting of exec summary, patent docs, Stripe reports" },
      { item: "Revenue Growth Sprint (targeted ad spend)", cost: 2000, timing: "Month 1–3", notes: "10–20 paying subscribers adds $290–$9,940/mo MRR — 3–6× deal multiple" },
    ],
  },
];

const TOTAL_BUDGET = BUDGET_ITEMS.reduce((s, cat) => s + cat.items.reduce((ss, i) => ss + i.cost, 0), 0);

// ── Valuation Scenarios ───────────────────────────────────────────────────────
const SCENARIOS = [
  {
    label: "Base Case",
    subtitle: "LLC formed, 3 PPAs filed, $2K MRR",
    timeframe: "3–6 months",
    before: 50000,
    after: 350000,
    color: "#94a3b8",
    roi_pct: null,
    confidence: "High",
    buyer: "Individual operator / Acquire.com",
  },
  {
    label: "Realistic Case",
    subtitle: "LLC + patents + $5K MRR + broker engaged",
    timeframe: "6–9 months",
    before: 50000,
    after: 750000,
    color: "#06b6d4",
    confidence: "Medium-High",
    buyer: "Empire Flippers / strategic acquirer",
  },
  {
    label: "Strong Case",
    subtitle: "1 white-label client + $10K MRR + 3 PPAs",
    timeframe: "9–15 months",
    before: 50000,
    after: 2000000,
    color: "#a855f7",
    confidence: "Medium",
    buyer: "IP monetization firm / EdTech rollup",
  },
  {
    label: "Strategic Exit",
    subtitle: "Defense/pharma buyer finds IP portfolio",
    timeframe: "12–24 months",
    before: 50000,
    after: 7500000,
    color: "#f97316",
    confidence: "Lower (requires right buyer)",
    buyer: "Defense contractor / pharma / major IP firm",
  },
];

// ── ROI Table ────────────────────────────────────────────────────────────────
const ROI_ROWS = SCENARIOS.map(s => ({
  ...s,
  net_gain: s.after - s.before - TOTAL_BUDGET,
  roi_multiple: ((s.after - TOTAL_BUDGET) / TOTAL_BUDGET).toFixed(1),
  roi_pct: (((s.after - TOTAL_BUDGET - s.before) / TOTAL_BUDGET) * 100).toFixed(0),
}));

// ── Revenue Bridge ───────────────────────────────────────────────────────────
const REVENUE_BRIDGE = [
  { driver: "Current Platform Value (code + content + tools)", value: 50000, color: "#475569" },
  { driver: "+ LLC Formation (investor credibility)", value: 25000, color: "#6366f1" },
  { driver: "+ 3 Provisional Patents Filed", value: 175000, color: "#f59e0b" },
  { driver: "+ Professional IP Valuation Report", value: 50000, color: "#f59e0b" },
  { driver: "+ $5K MRR (3× annual revenue multiple)", value: 180000, color: "#22c55e" },
  { driver: "+ Broker Engagement (deal flow access)", value: 75000, color: "#06b6d4" },
  { driver: "+ FTO Analysis (risk removal for buyer)", value: 45000, color: "#22c55e" },
  { driver: "= Conservative Exit Value", value: 600000, color: "#a855f7", total: true },
];

// ── Use of Funds Breakdown ───────────────────────────────────────────────────
const USE_OF_FUNDS = [
  { label: "Patent Filings (3 PPAs + FTO + Valuation)", amount: 16900, pct: 63, color: "#f59e0b" },
  { label: "Legal Entity + Attorney + CPA", amount: 5000, pct: 19, color: "#6366f1" },
  { label: "Platform & Acquisition Prep", amount: 2950, pct: 11, color: "#22c55e" },
  { label: "Revenue Growth Sprint (ad spend)", amount: 2000, pct: 7, color: "#06b6d4" },
];

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function generatePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  let y = 20;

  // Header
  doc.setFillColor(10, 15, 40);
  doc.rect(0, 0, W, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("AETHON APEX IP", 20, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Investor Budget Sheet — LLC Formation, Patent Filing & Acquisition ROI", 20, 28);
  doc.setFontSize(8);
  doc.text(`Total Ask: $${TOTAL_BUDGET.toLocaleString()} | Projected Exit: $350K–$7.5M | Timeline: 3–24 months`, 20, 36);
  y = 52;

  // Use of Funds
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("USE OF FUNDS", 20, y);
  y += 7;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  USE_OF_FUNDS.forEach(row => {
    doc.text(`${row.label}`, 22, y);
    doc.text(`$${row.amount.toLocaleString()} (${row.pct}%)`, 155, y, { align: "right" });
    y += 6;
  });
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL INVESTMENT ASK`, 22, y);
  doc.text(`$${TOTAL_BUDGET.toLocaleString()}`, 155, y, { align: "right" });
  y += 12;

  // Budget Line Items
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DETAILED BUDGET", 20, y);
  y += 7;

  BUDGET_ITEMS.forEach(cat => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 180);
    doc.text(cat.category.toUpperCase(), 20, y);
    y += 5;
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    cat.items.forEach(item => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`• ${item.item}`, 22, y);
      doc.text(item.cost === 0 ? "FREE" : `$${item.cost.toLocaleString()}`, 175, y, { align: "right" });
      y += 4.5;
      doc.setTextColor(100, 100, 100);
      doc.text(`  ${item.timing} — ${item.notes}`, 22, y);
      doc.setTextColor(30, 30, 30);
      y += 5;
    });
    y += 3;
  });

  // ROI Scenarios
  doc.addPage();
  y = 20;
  doc.setFillColor(10, 15, 40);
  doc.rect(0, 0, W, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("ROI SCENARIOS — INVESTOR RETURN ANALYSIS", 20, 10);
  y = 25;

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  ["Scenario", "Timeframe", "Exit Value", "Net Gain", "ROI Multiple", "Confidence"].forEach((h, i) => {
    doc.text(h, [20, 55, 90, 125, 155, 178][i], y);
  });
  y += 5;
  doc.setFont("helvetica", "normal");
  ROI_ROWS.forEach((r, i) => {
    if (i % 2 === 0) { doc.setFillColor(245, 245, 255); doc.rect(18, y - 3.5, W - 36, 8, "F"); }
    doc.text(r.label, 20, y);
    doc.text(r.timeframe, 55, y);
    doc.text(fmt(r.after), 90, y);
    doc.text(fmt(Math.max(0, r.net_gain)), 125, y);
    doc.text(`${r.roi_multiple}×`, 155, y);
    doc.text(r.confidence, 178, y);
    y += 8;
  });

  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("VALUATION BRIDGE — HOW $26,850 BECOMES $350K+", 20, y);
  y += 7;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  REVENUE_BRIDGE.forEach(row => {
    if (row.total) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 0, 160);
    }
    doc.text(row.driver, 22, y);
    doc.text(fmt(row.value), 175, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    y += 6;
  });

  // Disclaimer
  y += 10;
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text("This document is for informational and discussion purposes only. All projections are estimates based on comparable market transactions.", 20, y);
  doc.text("Not a guarantee of returns. Consult qualified legal, financial, and tax counsel before any investment decision.", 20, y + 4);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Aethon Apex IP | zenithapexresearch@gmail.com`, 20, y + 8);

  doc.save("Aethon-Apex-IP-Investor-Budget-Sheet.pdf");
}

function BudgetCategory({ cat }) {
  const [open, setOpen] = useState(true);
  const total = cat.items.reduce((s, i) => s + i.cost, 0);
  return (
    <div className="border rounded-2xl overflow-hidden" style={{ borderColor: cat.color + "40" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: cat.color + "12" }}>
        <div>
          <p className="text-white font-black text-sm">{cat.category}</p>
          <p className="text-gray-500 text-xs mt-0.5">{cat.items.length} line items</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-black text-base" style={{ color: cat.color }}>${total.toLocaleString()}</span>
          <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </button>
      {open && (
        <div className="divide-y divide-gray-800/60">
          {cat.items.map((item, i) => (
            <div key={i} className="px-5 py-3 flex items-start justify-between gap-4 bg-gray-950/40">
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">{item.item}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.timing} — {item.notes}</p>
              </div>
              <span className={`font-black text-sm whitespace-nowrap ${item.cost === 0 ? "text-green-400" : "text-gray-200"}`}>
                {item.cost === 0 ? "FREE" : `$${item.cost.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InvestorBudgetSheet() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link to="/exit-advisor" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Exit Advisor
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">Investor Budget Sheet</h1>
            <p className="text-gray-500 text-xs">LLC Formation · Patent Filing · Acquisition ROI</p>
          </div>
        </div>
        <button onClick={generatePDF}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-black transition-all">
          <Download size={13} /> Download PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-8">

        {/* Hero Summary */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-gray-900 border border-indigo-800/50 rounded-2xl p-6">
          <p className="text-indigo-300 text-xs font-black uppercase tracking-widest mb-2">Confidential — For Investor Review</p>
          <h2 className="text-white font-black text-2xl mb-1">Aethon Apex IP</h2>
          <p className="text-gray-300 text-sm mb-5 leading-relaxed">
            This sheet outlines the capital required to transform an existing AI + IP SaaS platform into a fully acquisition-ready asset — by forming a legal entity, filing 3 provisional patents, and engaging professional brokers. The ask is <strong className="text-white">${TOTAL_BUDGET.toLocaleString()}</strong>. The projected outcome is a platform exit valued at <strong className="text-white">$350K – $7.5M</strong> within 3–24 months.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Ask", value: `$${TOTAL_BUDGET.toLocaleString()}`, color: "text-indigo-300", icon: <DollarSign size={14} /> },
              { label: "Base Exit", value: "$350K", color: "text-cyan-400", icon: <TrendingUp size={14} /> },
              { label: "Patents Filed", value: "3 PPAs", color: "text-yellow-400", icon: <Shield size={14} /> },
              { label: "Timeline", value: "3–6 mo", color: "text-green-400", icon: <Clock size={14} /> },
            ].map((s, i) => (
              <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center">
                <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                <p className={`font-black text-lg ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Use of Funds */}
        <div>
          <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded bg-indigo-500 inline-block" /> Use of Funds
          </h3>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {USE_OF_FUNDS.map((row, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-800/60 last:border-0">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: row.color }} />
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{row.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-sm">${row.amount.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs">{row.pct}% of ask</p>
                </div>
                <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                  <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-4 bg-indigo-950/30 border-t border-indigo-800/30">
              <p className="text-white font-black text-sm">TOTAL INVESTMENT ASK</p>
              <p className="text-indigo-300 font-black text-xl">${TOTAL_BUDGET.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Detailed Budget */}
        <div>
          <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded bg-yellow-500 inline-block" /> Detailed Budget Breakdown
          </h3>
          <div className="space-y-3">
            {BUDGET_ITEMS.map((cat, i) => <BudgetCategory key={i} cat={cat} />)}
          </div>
        </div>

        {/* Valuation Bridge */}
        <div>
          <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded bg-purple-500 inline-block" /> Valuation Bridge — How ${TOTAL_BUDGET.toLocaleString()} Becomes $350K+
          </h3>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {REVENUE_BRIDGE.map((row, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-3.5 border-b border-gray-800/50 last:border-0 ${row.total ? "bg-purple-950/30 border-t border-purple-800/40" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: row.color }} />
                  <p className={`text-sm ${row.total ? "text-purple-300 font-black text-base" : "text-gray-300 font-medium"}`}>{row.driver}</p>
                </div>
                <p className={`font-black ${row.total ? "text-purple-300 text-xl" : "text-white text-sm"}`}>{fmt(row.value)}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-2 px-1">Each step is independently validated by comparable M&A transactions on Acquire.com, Empire Flippers, and IP broker databases.</p>
        </div>

        {/* ROI Scenarios */}
        <div>
          <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded bg-green-500 inline-block" /> Investor ROI Scenarios
          </h3>
          <div className="space-y-3">
            {ROI_ROWS.map((s, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5" style={{ borderLeftWidth: 4, borderLeftColor: s.color }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-white font-black text-base">{s.label}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{s.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-2xl" style={{ color: s.color }}>{fmt(s.after)}</p>
                    <p className="text-gray-500 text-xs">exit value</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Timeframe", value: s.timeframe },
                    { label: "Net Gain", value: fmt(Math.max(0, s.net_gain)) },
                    { label: "ROI Multiple", value: `${s.roi_multiple}×` },
                  ].map((m, j) => (
                    <div key={j} className="bg-gray-800/50 rounded-xl p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">{m.label}</p>
                      <p className="text-white font-black text-sm">{m.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <CheckCircle size={11} style={{ color: s.color }} />
                  <p className="text-gray-400 text-xs"><strong className="text-gray-300">Buyer:</strong> {s.buyer}</p>
                  <span className="ml-auto text-xs text-gray-500">Confidence: <strong className="text-gray-400">{s.confidence}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What Investor Gets */}
        <div className="bg-green-950/20 border border-green-800/40 rounded-2xl p-6">
          <h3 className="text-green-400 font-black text-base mb-4">What the Investor Gets</h3>
          <div className="space-y-2">
            {[
              "Equity stake negotiated pre-investment (suggested: 15–25% for $26,850 at $350K base valuation = ~7.7% diluted stake at exit)",
              "Pro-rata rights on any follow-on financing or licensing deals",
              "Seat at the table on deal structure and broker selection",
              "All 3 patents filed in investor's name or co-assigned to LLC",
              "Preferred return: investor receives first $26,850 + 15% IRR before founder takes proceeds",
              "Full transparency: Stripe dashboard access, VDR access, weekly update calls",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-gray-700 text-xs pb-6">
          Confidential. Not a securities offering. All projections are estimates based on comparable M&A transactions. Consult qualified legal, financial, and tax counsel before any investment decision.
        </p>
      </div>
    </div>
  );
}