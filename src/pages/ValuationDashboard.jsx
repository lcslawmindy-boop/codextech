import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Download, RefreshCw, Loader2, TrendingUp, DollarSign,
  Users, Activity, BarChart2, Zap, Shield, AlertCircle
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

// ── DCF CONFIG ────────────────────────────────────────────────────────────────
const WACC = 0.18;         // 18% discount rate for early-stage
const GROWTH_YEARS = 5;
const TERMINAL_GROWTH = 0.04;
const IP_BASE_VALUE = 3_900_000; // floor from due diligence
const REVENUE_MULTIPLES = [
  { label: "Conservative (3×)", mult: 3 },
  { label: "Base Case (6×)", mult: 6 },
  { label: "Optimistic (12×)", mult: 12 },
  { label: "Strategic Premium (18×)", mult: 18 },
];
const EBITDA_MARGIN = 0.72; // SaaS-comparable gross margin assumption

function fmt(n, prefix = "$") {
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}K`;
  return `${prefix}${n.toFixed(0)}`;
}

function pct(n) { return `${Number(n).toFixed(1)}%`; }

function dcfValuation(arr, growthRates) {
  let totalPV = 0;
  let revenue = arr;
  for (let y = 1; y <= GROWTH_YEARS; y++) {
    revenue = revenue * (1 + (growthRates[y - 1] || 0.5));
    const fcf = revenue * EBITDA_MARGIN;
    totalPV += fcf / Math.pow(1 + WACC, y);
  }
  // Terminal value
  const terminalFCF = (revenue * EBITDA_MARGIN) * (1 + TERMINAL_GROWTH);
  const terminalValue = terminalFCF / (WACC - TERMINAL_GROWTH);
  const pvTerminal = terminalValue / Math.pow(1 + WACC, GROWTH_YEARS);
  return {
    pvCashFlows: totalPV,
    pvTerminal,
    totalDCF: totalPV + pvTerminal + IP_BASE_VALUE,
  };
}

// ── METRIC CARD ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, color = "#d4af37", icon }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
        {icon && <span style={{ color }} className="opacity-70">{icon}</span>}
      </div>
      <p className="font-black text-xl" style={{ color }}>{value}</p>
      {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ── PDF EXPORT ────────────────────────────────────────────────────────────────
function exportPDF(data, dcf, multiples, growthRates) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 18, cW = W - margin * 2;
  let y = 0;

  const bg = () => { doc.setFillColor(10, 10, 30); doc.rect(0, 0, W, 297, "F"); };
  const addPage = () => { doc.addPage(); bg(); y = 20; };
  const check = (n = 20) => { if (y + n > 275) addPage(); };

  const heading = (txt, col = [212, 175, 55]) => {
    check(16);
    doc.setFillColor(20, 20, 45);
    doc.rect(margin - 2, y - 4, cW + 4, 12, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.setTextColor(...col); doc.text(txt, margin, y + 4);
    y += 16;
  };

  const row = (label, value, highlight = false) => {
    check(10);
    doc.setFont("helvetica", highlight ? "bold" : "normal");
    doc.setFontSize(10);
    doc.setTextColor(highlight ? 212 : 148, highlight ? 175 : 163, highlight ? 55 : 184);
    doc.text(label, margin, y);
    doc.setTextColor(highlight ? 255 : 203, highlight ? 255 : 213, highlight ? 255 : 225);
    doc.text(value, W - margin, y, { align: "right" });
    y += 8;
  };

  const divider = () => {
    doc.setDrawColor(40, 40, 80); doc.setLineWidth(0.3);
    doc.line(margin, y, W - margin, y); y += 6;
  };

  // ── COVER
  bg();
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, W, 4, "F");

  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(148, 163, 184);
  doc.text("ZENITH APEX RESEARCH PORTFOLIO", W / 2, 22, { align: "center" });
  doc.text("LIVE FINANCIAL VALUATION — CONFIDENTIAL", W / 2, 30, { align: "center" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(26); doc.setTextColor(212, 175, 55);
  doc.text("VALUATION DASHBOARD", W / 2, 60, { align: "center" });

  doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor(100, 116, 139);
  doc.text("Dynamic DCF & Exit Multiple Analysis", W / 2, 72, { align: "center" });
  doc.text(`Generated: ${new Date().toLocaleString()}  ·  Live Stripe + Entity Data`, W / 2, 80, { align: "center" });

  // Valuation box
  y = 100;
  doc.setDrawColor(212, 175, 55); doc.setLineWidth(1);
  doc.rect(margin, y, cW, 50, "D");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(148, 163, 184);
  doc.text("DCF ENTERPRISE VALUATION RANGE", margin + 8, y + 12);
  doc.setFontSize(28); doc.setTextColor(212, 175, 55);
  doc.text(fmt(dcf.totalDCF), margin + 8, y + 28);
  doc.setFontSize(12); doc.setTextColor(100, 116, 139);
  doc.text("+ IP Base Floor: $3.9M", margin + 8, y + 38);
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(255, 255, 255);
  const askRange = fmt(multiples.find(m => m.label.includes("12"))?.value || 0) + " – " + fmt(multiples.find(m => m.label.includes("18"))?.value || 0);
  doc.text(`Asking: ${askRange}`, W - margin - 8, y + 28, { align: "right" });
  doc.setFontSize(10); doc.setTextColor(100, 116, 139);
  doc.text("12× – 18× ARR Strategic Premium", W - margin - 8, y + 38, { align: "right" });

  doc.setFillColor(212, 175, 55);
  doc.rect(0, 293, W, 4, "F");

  // ── PAGE 2: Revenue Metrics
  addPage();
  heading("LIVE REVENUE METRICS (STRIPE)");
  row("Total Revenue (All Time)", fmt(data.stripe.totalRevenue));
  row("Revenue — Last 30 Days", fmt(data.stripe.revenue30d));
  row("Revenue — Last 90 Days", fmt(data.stripe.revenue90d));
  divider();
  row("Monthly Recurring Revenue (MRR)", fmt(data.stripe.mrr), true);
  row("Annual Recurring Revenue (ARR)", fmt(data.stripe.arr), true);
  divider();
  row("Total Customers", data.stripe.totalCustomers.toLocaleString());
  row("Active Subscriptions", data.stripe.activeSubscriptions.toLocaleString());
  row("Successful Transactions", data.stripe.transactionCount.toLocaleString());
  y += 6;

  heading("PLATFORM ENTITY METRICS");
  row("Beta Applications", data.entities.betaApplications.toLocaleString());
  row("Converted Members", data.entities.convertedMembers.toLocaleString());
  row("Conversion Rate", pct(data.entities.conversionRate));
  divider();
  row("Active Investor Relationships", data.entities.activeInvestors.toLocaleString());
  row("Deals in Due Diligence / Negotiating", data.entities.dueDiligenceDeals.toLocaleString());
  row("Funded Deals Closed", data.entities.fundedDeals.toLocaleString());
  divider();
  row("Active VDR Sessions", data.entities.activeVDRSessions.toLocaleString());
  row("Total VDR Sessions Created", data.entities.totalVDRSessions.toLocaleString());
  row("Prior Art Database Entries", data.entities.priorArtEntries.toLocaleString());
  row("Active Monitoring Alerts", data.entities.monitoringAlerts.toLocaleString());

  // ── PAGE 3: DCF
  addPage();
  heading("DCF VALUATION MODEL");
  row("Discount Rate (WACC)", pct(WACC * 100));
  row("Projection Horizon", `${GROWTH_YEARS} Years`);
  row("Terminal Growth Rate", pct(TERMINAL_GROWTH * 100));
  row("EBITDA/FCF Margin Assumption", pct(EBITDA_MARGIN * 100));
  divider();
  row("PV of Free Cash Flows", fmt(dcf.pvCashFlows));
  row("PV of Terminal Value", fmt(dcf.pvTerminal));
  row("IP Portfolio Base Value", fmt(IP_BASE_VALUE));
  divider();
  row("TOTAL DCF ENTERPRISE VALUE", fmt(dcf.totalDCF), true);

  y += 8;
  heading("GROWTH RATE ASSUMPTIONS");
  growthRates.forEach((r, i) => row(`Year ${i + 1} Revenue Growth`, pct(r * 100)));

  y += 8;
  heading("EXIT MULTIPLE ANALYSIS (ARR-BASED)");
  multiples.forEach(m => row(m.label, fmt(m.value), m.label.includes("18")));

  // Footer on all pages
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(40, 40, 80);
    doc.text("ZENITH APEX — LIVE VALUATION — CONFIDENTIAL — NDA APPLIES", W / 2, 291, { align: "center" });
    doc.text(`Page ${p} of ${total}`, W - margin, 291, { align: "right" });
  }

  doc.save(`zenith-apex-valuation-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ValuationDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  // Growth rate assumptions (editable)
  const [growthRates, setGrowthRates] = useState([1.5, 1.2, 0.9, 0.6, 0.4]);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke("valuationData", {});
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const arr = data?.stripe?.arr || 0;
  const dcf = dcfValuation(arr, growthRates);
  const multiples = REVENUE_MULTIPLES.map(m => ({ ...m, value: arr * m.mult + IP_BASE_VALUE }));

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 100));
    exportPDF(data, dcf, multiples, growthRates);
    setExporting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-yellow-400 mx-auto mb-3" size={32} />
        <p className="text-gray-400 text-sm">Pulling live Stripe & entity data…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
        <p className="text-white font-bold mb-2">Error loading valuation data</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button onClick={load} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">Valuation Dashboard</h1>
            <p className="text-gray-500 text-xs">Live Stripe + Entity DCF · Updated {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-all">
            <RefreshCw size={12} /> Refresh
          </button>
          <button onClick={handleExport} disabled={exporting || !data}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-xs transition-all disabled:opacity-60">
            {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            {exporting ? "Generating…" : "Export Investor PDF"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-6xl mx-auto w-full space-y-6">

        {/* Valuation Hero */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-yellow-950/20 border border-yellow-800/40 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-yellow-400" />
            <h2 className="text-yellow-400 font-black text-sm uppercase tracking-widest">DCF Enterprise Valuation</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">Total DCF Value</p>
              <p className="text-yellow-400 font-black text-2xl">{fmt(dcf.totalDCF)}</p>
              <p className="text-gray-600 text-xs">incl. IP base floor</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">PV Cash Flows</p>
              <p className="text-white font-black text-xl">{fmt(dcf.pvCashFlows)}</p>
              <p className="text-gray-600 text-xs">{GROWTH_YEARS}-year horizon</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Terminal Value (PV)</p>
              <p className="text-white font-black text-xl">{fmt(dcf.pvTerminal)}</p>
              <p className="text-gray-600 text-xs">{pct(TERMINAL_GROWTH * 100)} perpetual growth</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">IP Portfolio Floor</p>
              <p className="text-white font-black text-xl">{fmt(IP_BASE_VALUE)}</p>
              <p className="text-gray-600 text-xs">asset-by-asset DCF</p>
            </div>
          </div>
        </div>

        {/* Exit Multiples */}
        <div>
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Exit Multiple Analysis — ARR × Revenue</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {multiples.map((m, i) => (
              <div key={i} className={`rounded-xl p-4 border ${i === 3 ? "bg-yellow-950/30 border-yellow-700/50" : "bg-gray-900 border-gray-800"}`}>
                <p className="text-gray-500 text-xs mb-1">{m.label}</p>
                <p className={`font-black text-lg ${i === 3 ? "text-yellow-400" : "text-white"}`}>{fmt(m.value)}</p>
                <p className="text-gray-600 text-xs">{arr > 0 ? `ARR × ${m.mult}` : "No ARR yet"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Stripe Metrics */}
        <div>
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Live Revenue Metrics — Stripe</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="ARR" value={fmt(data?.stripe?.arr || 0)} sub="Annualized recurring" color="#22c55e" icon={<TrendingUp size={16} />} />
            <MetricCard label="MRR" value={fmt(data?.stripe?.mrr || 0)} sub="Monthly recurring" color="#22c55e" icon={<DollarSign size={16} />} />
            <MetricCard label="Revenue (30d)" value={fmt(data?.stripe?.revenue30d || 0)} sub="Last 30 days" color="#d4af37" icon={<Activity size={16} />} />
            <MetricCard label="All-Time Revenue" value={fmt(data?.stripe?.totalRevenue || 0)} sub={`${data?.stripe?.transactionCount || 0} transactions`} color="#d4af37" icon={<DollarSign size={16} />} />
            <MetricCard label="Total Customers" value={(data?.stripe?.totalCustomers || 0).toLocaleString()} sub="Stripe customers" color="#3b82f6" icon={<Users size={16} />} />
            <MetricCard label="Active Subscriptions" value={(data?.stripe?.activeSubscriptions || 0).toLocaleString()} sub="Live subs" color="#3b82f6" icon={<Zap size={16} />} />
          </div>
        </div>

        {/* Entity Metrics */}
        <div>
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Platform Entity Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Beta Applications" value={(data?.entities?.betaApplications || 0).toLocaleString()} sub={`${data?.entities?.convertedMembers || 0} converted`} color="#a855f7" icon={<Users size={16} />} />
            <MetricCard label="Conversion Rate" value={pct(data?.entities?.conversionRate || 0)} sub="App → Paid" color="#a855f7" icon={<TrendingUp size={16} />} />
            <MetricCard label="Active Investors" value={(data?.entities?.activeInvestors || 0).toLocaleString()} sub={`${data?.entities?.dueDiligenceDeals || 0} in due diligence`} color="#f59e0b" icon={<BarChart2 size={16} />} />
            <MetricCard label="Active VDR Sessions" value={(data?.entities?.activeVDRSessions || 0).toLocaleString()} sub={`${data?.entities?.totalVDRSessions || 0} total created`} color="#f59e0b" icon={<Shield size={16} />} />
            <MetricCard label="Prior Art Entries" value={(data?.entities?.priorArtEntries || 0).toLocaleString()} sub="IP database" color="#06b6d4" />
            <MetricCard label="Funded Deals" value={(data?.entities?.fundedDeals || 0).toLocaleString()} sub="Closed acquisitions" color="#22c55e" icon={<Zap size={16} />} />
          </div>
        </div>

        {/* Growth Rate Assumptions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">DCF Growth Rate Assumptions — Edit to Recalculate</h3>
          <div className="grid grid-cols-5 gap-3">
            {growthRates.map((r, i) => (
              <div key={i}>
                <label className="text-gray-500 text-xs block mb-1">Year {i + 1}</label>
                <input
                  type="number"
                  step="0.1"
                  value={(r * 100).toFixed(0)}
                  onChange={e => {
                    const newRates = [...growthRates];
                    newRates[i] = Math.max(0, parseFloat(e.target.value) / 100);
                    setGrowthRates(newRates);
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm font-bold focus:outline-none focus:border-yellow-600 text-center"
                />
                <p className="text-gray-700 text-xs text-center mt-0.5">%</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-gray-600">WACC / Discount Rate</p>
              <p className="text-white font-bold">{pct(WACC * 100)}</p>
            </div>
            <div>
              <p className="text-gray-600">EBITDA Margin Assumption</p>
              <p className="text-white font-bold">{pct(EBITDA_MARGIN * 100)}</p>
            </div>
            <div>
              <p className="text-gray-600">Terminal Growth Rate</p>
              <p className="text-white font-bold">{pct(TERMINAL_GROWTH * 100)}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}