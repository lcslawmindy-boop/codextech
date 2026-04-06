import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Download, ChevronRight, Check, Loader2, X, FileText, TrendingUp, DollarSign, Award, Zap } from "lucide-react";
import { jsPDF } from "jspdf";
import { businessItems } from "../lib/businessItems";
import { base44 } from "@/api/base44Client";
import { nodes, links } from "../lib/beardenData";

const inventions = businessItems.filter(i => i.category === "Invention" && i.problem);

function getRelatedNodes(item) {
  // pull concept IDs from source text heuristically by matching node labels/ids
  const text = (item.title + " " + item.description + " " + (item.source || "")).toLowerCase();
  return nodes.filter(n =>
    text.includes(n.id.replace(/_/g, " ")) ||
    text.includes(n.label.toLowerCase())
  ).slice(0, 5);
}

// ── IP Valuation Module ──────────────────────────────────────────────────────

const TRL_LABELS = [
  "1 — Basic principles observed",
  "2 — Technology concept formulated",
  "3 — Experimental proof of concept",
  "4 — Technology validated in lab",
  "5 — Technology validated in relevant environment",
  "6 — Technology demonstrated in relevant environment",
  "7 — System prototype in operational environment",
  "8 — System complete and qualified",
  "9 — Actual system proven in operational environment",
];

const PATENT_LABELS = ["Very Low", "Low", "Moderate", "High", "Very High"];

function calcValuation(tam, trl, patent) {
  // Base royalty rate: 2%–8% of TAM slice, scaled by TRL
  const trlFactor = 0.3 + (trl / 9) * 0.7;
  const patentFactor = 0.2 + (patent / 4) * 0.8;
  const reachableTam = tam * 0.001; // 0.1% of TAM as reachable slice
  const lowRoyalty = reachableTam * 0.02 * trlFactor * patentFactor;
  const highRoyalty = reachableTam * 0.08 * trlFactor * patentFactor;
  const ipValue = lowRoyalty * 8; // ~8× annual royalty = IP value
  const ipValueHigh = highRoyalty * 12;
  // Grant probability: weighted TRL + patent viability
  const grantPct = Math.min(95, Math.round((trl / 9) * 50 + (patent / 4) * 30 + 10));
  // SBIR/STTR estimate
  const sbirLow = trl >= 4 ? 150000 : trl >= 2 ? 50000 : 0;
  const sbirHigh = trl >= 6 ? 2000000 : trl >= 4 ? 750000 : trl >= 2 ? 250000 : 0;
  return { lowRoyalty, highRoyalty, ipValue, ipValueHigh, grantPct, sbirLow, sbirHigh };
}

function fmt(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function ValuationModule({ item }) {
  const [open, setOpen] = useState(false);
  const [tam, setTam] = useState(500); // in $M
  const [trl, setTrl] = useState(3);
  const [patent, setPatent] = useState(2);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  const v = calcValuation(tam * 1e6, trl, patent);

  const handleDownloadDossier = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 56;
    const maxW = pageW - margin * 2;
    let y = margin;

    const addPage = () => { doc.addPage(); y = margin; drawHeader(); drawFooter(); };
    const check = (need = 16) => { if (y + need > pageH - 60) addPage(); };

    const drawHeader = () => {
      doc.setFillColor(10, 14, 35);
      doc.rect(0, 0, pageW, 38, "F");
      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(180, 200, 255);
      doc.text("ZENITH APEX RESEARCH DATABASE", margin, 16);
      doc.setFont("helvetica", "normal"); doc.setTextColor(120, 140, 200);
      doc.text("INVENTION PITCH DOSSIER — CONFIDENTIAL", margin, 27);
      doc.setTextColor(80, 100, 160);
      doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), pageW - margin, 27, { align: "right" });
    };

    const drawFooter = () => {
      const total = doc.getNumberOfPages();
      for (let p = 1; p <= total; p++) {
        doc.setPage(p);
        doc.setFillColor(10, 14, 35);
        doc.rect(0, pageH - 32, pageW, 32, "F");
        doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 120, 180);
        doc.text("CONFIDENTIAL — FOR AUTHORIZED RECIPIENTS ONLY. Unauthorized disclosure is subject to liquidated damages.", margin, pageH - 14);
        doc.text(`Page ${p} of ${total}`, pageW - margin, pageH - 14, { align: "right" });
      }
    };

    const sectionBand = (title, r, g, b) => {
      check(24);
      doc.setFillColor(r, g, b);
      doc.rect(margin - 8, y - 6, maxW + 16, 20, "F");
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), margin, y + 8); y += 26;
    };

    const para = (text, color = [40, 40, 60]) => {
      if (!text) return;
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxW);
      lines.forEach(l => { check(13); doc.text(l, margin, y); y += 12; });
      y += 6;
    };

    const kv = (label, value, labelColor = [80, 100, 160], valColor = [20, 20, 40]) => {
      check(14);
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...labelColor);
      doc.text(label, margin, y);
      doc.setFont("helvetica", "normal"); doc.setTextColor(...valColor);
      doc.text(String(value), margin + 160, y);
      y += 14;
    };

    // ── COVER ──────────────────────────────────────────────────────────────
    doc.setFillColor(10, 14, 35);
    doc.rect(0, 0, pageW, pageH, "F");
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 130, 200);
    doc.text("ZENITH APEX RESEARCH DATABASE", pageW / 2, 100, { align: "center" });
    doc.text("Advanced Research · Intellectual Property · AI-Powered Innovation", pageW / 2, 114, { align: "center" });
    doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    const titleLines = doc.splitTextToSize(item.title, maxW);
    titleLines.forEach((l, i) => doc.text(l, pageW / 2, 165 + i * 28, { align: "center" }));
    doc.setFontSize(11); doc.setFont("helvetica", "italic"); doc.setTextColor(160, 180, 240);
    doc.text(`"${item.tagline}"`, pageW / 2, 165 + titleLines.length * 28 + 16, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 100, 160);
    doc.text("CONFIDENTIAL — ATTORNEY-CLIENT PRIVILEGED", pageW / 2, pageH - 60, { align: "center" });
    doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageW / 2, pageH - 44, { align: "center" });

    // ── PAGE 2 ─────────────────────────────────────────────────────────────
    doc.addPage();
    doc.setFillColor(248, 249, 255); doc.rect(0, 0, pageW, pageH, "F");
    y = margin;
    drawHeader();
    y = 56;

    // Project overview
    sectionBand("1. Project Overview", 30, 50, 120);
    kv("Invention:", item.title);
    kv("Category:", item.category);
    kv("Price Point:", item.price);
    kv("Target Audience:", item.audience);
    y += 4;
    para(item.beardenSolution);

    // Problem & Solution
    sectionBand("2. Problem & Solution", 140, 30, 60);
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(140, 30, 60);
    doc.text("PROBLEM", margin, y); y += 12;
    para(item.problem, [60, 30, 40]);
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 100, 60);
    doc.text("SOLUTION", margin, y); y += 12;
    para(item.beardenSolution, [20, 60, 40]);

    // Market
    sectionBand("3. Market Potential", 20, 100, 60);
    para(item.market, [20, 60, 40]);

    // Technical Feasibility
    sectionBand("4. Technical Feasibility", 60, 40, 140);
    para(item.feasibility, [40, 30, 80]);
    doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(100, 80, 160);
    const srcLines = doc.splitTextToSize(`Source: ${item.source}`, maxW);
    srcLines.forEach(l => { check(12); doc.text(l, margin, y); y += 11; });
    y += 6;

    // IP Valuation
    sectionBand("5. IP Valuation Analysis", 160, 100, 20);
    kv("Total Addressable Market:", `$${tam}M`, [140, 80, 20]);
    kv("Technology Readiness Level:", `TRL ${trl + 1} — ${TRL_LABELS[trl]}`, [140, 80, 20]);
    kv("Patent Viability:", PATENT_LABELS[patent], [140, 80, 20]);
    y += 4;
    kv("Annual Licensing Royalties:", `${fmt(v.lowRoyalty)} – ${fmt(v.highRoyalty)}`, [20, 100, 40], [10, 80, 30]);
    kv("IP Portfolio Value:", `${fmt(v.ipValue)} – ${fmt(v.ipValueHigh)}`, [20, 100, 40], [10, 80, 30]);
    kv("Grant Funding Probability:", `${v.grantPct}%`, [20, 100, 40], [10, 80, 30]);
    kv("SBIR/STTR Potential:", v.sbirLow > 0 ? `${fmt(v.sbirLow)} – ${fmt(v.sbirHigh)}` : "Insufficient TRL", [20, 100, 40], [10, 80, 30]);

    // AI Valuation Report
    if (aiReport) {
      sectionBand("6. AI Valuation Report", 60, 20, 120);
      para(aiReport, [30, 20, 60]);
    }

    // Legal notice
    check(60);
    y += 10;
    doc.setFillColor(240, 240, 248);
    doc.rect(margin - 8, y - 6, maxW + 16, 52, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(80, 80, 140);
    doc.text("CONFIDENTIALITY NOTICE", margin, y + 6);
    doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 120);
    const notice = doc.splitTextToSize("This document contains proprietary research and confidential intellectual property belonging to Zenith Apex Research. Unauthorized disclosure, reproduction, or distribution is strictly prohibited and subject to liquidated damages of $250,000 per incident under the executed Non-Disclosure Agreement.", maxW - 8);
    notice.forEach((l, i) => doc.text(l, margin, y + 18 + i * 10));

    drawFooter();
    doc.save(`ZenithApex_Dossier_${item.title.replace(/[^a-z0-9]/gi, "_").slice(0, 40)}.pdf`);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setGenerated(false);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior IP valuation analyst. Generate a concise Valuation Report for the following invention:\n\nInvention: ${item.title}\nDescription: ${item.beardenSolution}\nTAM: $${tam}M\nTechnology Readiness Level: ${trl + 1} — ${TRL_LABELS[trl]}\nPatent Viability: ${PATENT_LABELS[patent]}\nEstimated Annual Licensing Royalties: ${fmt(v.lowRoyalty)}–${fmt(v.highRoyalty)}\nEstimated IP Portfolio Value: ${fmt(v.ipValue)}–${fmt(v.ipValueHigh)}\nGrant Funding Probability: ${v.grantPct}%\nSBIR/STTR Funding Potential: ${fmt(v.sbirLow)}–${fmt(v.sbirHigh)}\n\nWrite a 3-paragraph professional valuation report (150–200 words) covering:\n1. IP asset strength and licensing opportunity\n2. Grant funding pathways (DoD SBIR, DARPA, NIH, DOE)\n3. Overall commercialization recommendation\n\nBe specific, confident, and data-driven. No hype.`,
    });
    setAiReport(result);
    setGenerated(true);
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-yellow-900/40 bg-yellow-950/10 overflow-hidden mt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-yellow-900/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-yellow-400" />
          <span className="text-yellow-300 font-bold text-sm uppercase tracking-widest">IP Valuation Calculator</span>
        </div>
        <ChevronRight size={15} className={`text-yellow-600 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-yellow-900/30">
          <p className="text-gray-500 text-xs pt-4">Adjust parameters to estimate IP value, licensing royalties, and grant probability.</p>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-gray-400 text-xs font-semibold">Total Addressable Market (TAM)</label>
                <span className="text-yellow-300 text-xs font-bold">${tam}M</span>
              </div>
              <input type="range" min={10} max={10000} step={10} value={tam} onChange={e => setTam(+e.target.value)}
                className="w-full accent-yellow-500" />
              <div className="flex justify-between text-gray-700 text-xs mt-0.5"><span>$10M</span><span>$10B</span></div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-gray-400 text-xs font-semibold">Technology Readiness Level (TRL)</label>
                <span className="text-blue-300 text-xs font-bold">TRL {trl + 1}</span>
              </div>
              <input type="range" min={0} max={8} step={1} value={trl} onChange={e => setTrl(+e.target.value)}
                className="w-full accent-blue-500" />
              <p className="text-gray-600 text-xs mt-1">{TRL_LABELS[trl]}</p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-gray-400 text-xs font-semibold">Patent Viability</label>
                <span className="text-purple-300 text-xs font-bold">{PATENT_LABELS[patent]}</span>
              </div>
              <input type="range" min={0} max={4} step={1} value={patent} onChange={e => setPatent(+e.target.value)}
                className="w-full accent-purple-500" />
              <div className="flex justify-between text-gray-700 text-xs mt-0.5"><span>Very Low</span><span>Very High</span></div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Annual Licensing Royalties", value: `${fmt(v.lowRoyalty)} – ${fmt(v.highRoyalty)}`, icon: <TrendingUp size={13} className="text-green-400" />, color: "green" },
              { label: "IP Portfolio Value", value: `${fmt(v.ipValue)} – ${fmt(v.ipValueHigh)}`, icon: <DollarSign size={13} className="text-yellow-400" />, color: "yellow" },
              { label: "Grant Funding Probability", value: `${v.grantPct}%`, icon: <Award size={13} className="text-blue-400" />, color: "blue" },
              { label: "SBIR/STTR Potential", value: v.sbirLow > 0 ? `${fmt(v.sbirLow)} – ${fmt(v.sbirHigh)}` : "Insufficient TRL", icon: <Zap size={13} className="text-purple-400" />, color: "purple" },
            ].map(m => (
              <div key={m.label} className={`bg-gray-900/60 border border-${m.color}-900/40 rounded-xl p-3`}>
                <div className="flex items-center gap-1.5 mb-1">{m.icon}<p className="text-gray-500 text-xs">{m.label}</p></div>
                <p className={`text-${m.color}-300 font-bold text-sm`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* AI Report */}
          <div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 text-sm font-bold transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {loading ? "Generating Valuation Report…" : generated ? "Regenerate AI Valuation Report" : "Generate AI Valuation Report"}
            </button>

            {aiReport && (
              <div className="mt-3 bg-gray-900/60 border border-yellow-900/40 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={11} className="text-yellow-400" />
                  <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">AI Valuation Report</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{aiReport}</p>
              </div>
            )}

            {/* Download Dossier */}
            <button
              onClick={handleDownloadDossier}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-900/40 hover:bg-blue-800/50 border border-blue-700 text-blue-200 text-sm font-bold transition-all mt-2"
            >
              <Download size={14} />
              Download Full Dossier PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionBlock({ emoji, title, color, children }) {
  return (
    <div className="rounded-xl border p-5 space-y-2" style={{ borderColor: color + "40", backgroundColor: color + "08" }}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <h3 className="font-bold text-white text-sm uppercase tracking-widest" style={{ color }}>{title}</h3>
      </div>
      <div className="text-gray-300 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function PitchDeck({ item, aiExpansion, loadingAI, onRequestAI }) {
  const related = getRelatedNodes(item);

  return (
    <div className="space-y-4">
      {/* Header slide */}
      <div className="rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 text-center">
        <div className="text-3xl mb-2">{item.icon}</div>
        <h2 className="text-white font-bold text-xl mb-1">{item.title}</h2>
        <p className="text-gray-400 text-sm italic mb-3">"{item.tagline}"</p>
        <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
          <span className="px-3 py-1 rounded-full bg-green-900/50 border border-green-700 text-green-300 font-bold">{item.price}</span>
          <span className="px-3 py-1 rounded-full bg-gray-700 border border-gray-600 text-gray-300">{item.audience}</span>
        </div>
      </div>

      {/* Slide 1 — Problem */}
      <SectionBlock emoji="🔴" title="Slide 1 — The Problem" color="#ef4444">
        <p>{item.problem}</p>
        <div className="mt-2 p-3 rounded-lg bg-gray-900/60 border border-red-900/40">
          <p className="text-red-300 font-semibold text-xs uppercase tracking-wider mb-1">Standard EM Limitation</p>
          <p className="text-gray-400 text-xs">Present electromagnetic theory is only a special case of a more fundamental electromagnetics. It conflates massless charge with charged mass, assumes vacuum potential is zero, and is blind to the scalar phi-field — making conventional engineering incomplete by design.</p>
        </div>
      </SectionBlock>

      {/* Slide 2 — Bearden Solution */}
      <SectionBlock emoji="💡" title="Slide 2 — The Bearden Solution" color="#3b82f6">
        <p>{item.beardenSolution}</p>
        {related.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Connected concepts in the research network:</p>
            <div className="flex flex-wrap gap-1.5">
              {related.map(n => (
                <span key={n.id} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "#3b82f6" + "50", backgroundColor: "#3b82f6" + "15", color: "#3b82f6" }}>
                  {n.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </SectionBlock>

      {/* Slide 3 — Market Potential */}
      <SectionBlock emoji="📈" title="Slide 3 — Market Potential" color="#22c55e">
        <p>{item.market}</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { label: "Entry Price", value: item.price },
            { label: "Target Segment", value: item.audience.split(",")[0] },
            { label: "Category", value: item.category },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900/60 border border-green-900/30 rounded-lg p-2 text-center">
              <p className="text-green-400 font-bold text-xs truncate">{stat.value}</p>
              <p className="text-gray-600 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Slide 4 — Technical Feasibility */}
      <SectionBlock emoji="🔬" title="Slide 4 — Technical Feasibility" color="#a855f7">
        <p>{item.feasibility}</p>
        <div className="mt-2 p-3 rounded-lg bg-gray-900/60 border border-purple-900/40">
          <p className="text-purple-300 font-semibold text-xs uppercase tracking-wider mb-1">Primary Source Documentation</p>
          <p className="text-gray-400 text-xs">{item.source}</p>
        </div>
      </SectionBlock>

      {/* Slide 5 — Revenue Streams */}
      <SectionBlock emoji="💰" title="Slide 5 — Revenue Streams" color="#f59e0b">
        <div className="grid grid-cols-1 gap-2">
          {[
            { stream: "Direct Product/Kit Sales", detail: `Initial price point: ${item.price}` },
            { stream: "Engineering Plans / PDF", detail: "Lower-barrier digital product — 80% margin, passive income" },
            { stream: "Course / Training Bundle", detail: "Pair with Gravitobiology or Scalar EM course — upsell path" },
            { stream: "Research Licensing", detail: "License IP to university labs, defense contractors, biotech firms" },
            { stream: "Consulting / Custom Builds", detail: "Premium service tier for serious researchers at $250+/hr" },
            { stream: "Investor / Grant Funding", detail: "DoD SBIR/STTR grants, longevity/biotech angel investors, alternative energy VCs" },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check size={13} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-yellow-300 font-semibold text-xs">{r.stream}: </span>
                <span className="text-gray-400 text-xs">{r.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Slide 6 — AI-Expanded Pitch (on demand) */}
      <SectionBlock emoji="✨" title="Slide 6 — AI Executive Summary" color="#ec4899">
        {aiExpansion ? (
          <p className="whitespace-pre-wrap">{aiExpansion}</p>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-xs mb-3">Generate a polished executive summary paragraph using AI — suitable for email outreach or deck cover page.</p>
            <button
              onClick={onRequestAI}
              disabled={loadingAI}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-900/40 hover:bg-pink-800/50 border border-pink-700 text-pink-300 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loadingAI ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {loadingAI ? "Generating…" : "Generate AI Executive Summary"}
            </button>
          </div>
        )}
      </SectionBlock>

      {/* Source footer */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
        <p className="text-gray-600 text-xs"><span className="text-gray-500 font-semibold">All claims sourced from: </span>{item.source}</p>
      </div>
    </div>
  );
}

function generatePDF(item, aiExpansion) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 20, cW = W - margin * 2;
  let y = 20;

  const check = (n = 12) => { if (y + n > 282) { doc.addPage(); y = 20; } };

  const band = (text, r, g, b) => {
    check(16);
    doc.setFillColor(r, g, b);
    doc.rect(margin - 2, y - 4, cW + 4, 12, "F");
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text(text, margin, y + 4); y += 14;
  };

  const para = (text, color = [40, 40, 40]) => {
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text || "", cW);
    lines.forEach(l => { check(6); doc.text(l, margin, y); y += 5.5; });
    y += 3;
  };

  // Cover
  doc.setFillColor(10, 15, 40);
  doc.rect(0, 0, W, 297, "F");
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(160, 160, 200);
  doc.text("ZENITH APEX RESEARCH DATABASE — PITCH DECK", W / 2, 30, { align: "center" });
  doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(item.title, cW);
  titleLines.forEach((l, i) => doc.text(l, W / 2, 50 + i * 10, { align: "center" }));
  doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(180, 180, 220);
  doc.text(`"${item.tagline}"`, W / 2, 50 + titleLines.length * 10 + 8, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 200, 130);
  doc.text(item.price, W / 2, 50 + titleLines.length * 10 + 18, { align: "center" });
  doc.setFontSize(8); doc.setTextColor(120, 120, 160);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, W / 2, 50 + titleLines.length * 10 + 26, { align: "center" });

  doc.addPage();
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 297, "F");
  y = 20;

  band("SLIDE 1 — THE PROBLEM", 200, 50, 50);
  para(item.problem);
  para("Standard EM limitation: Present electromagnetic theory is only a special case of a more fundamental electromagnetics — blind to the scalar phi-field by design.", [120, 60, 60]);
  y += 4;

  band("SLIDE 2 — THE BEARDEN SOLUTION", 40, 90, 200);
  para(item.beardenSolution);
  y += 4;

  band("SLIDE 3 — MARKET POTENTIAL", 30, 150, 80);
  para(item.market);
  para(`Entry Price: ${item.price}  |  Target: ${item.audience}  |  Category: ${item.category}`, [60, 120, 60]);
  y += 4;

  band("SLIDE 4 — TECHNICAL FEASIBILITY", 120, 60, 180);
  para(item.feasibility);
  para(`Source: ${item.source}`, [100, 80, 150]);
  y += 4;

  band("SLIDE 5 — REVENUE STREAMS", 180, 130, 30);
  [
    `Direct Sales: ${item.price} entry price`,
    "Engineering Plans PDF: 80% margin digital product",
    "Course / Training Bundle: Scalar EM upsell path",
    "Research Licensing: University labs, defense contractors, biotech",
    "Consulting / Custom Builds: $250+/hr premium service",
    "DoD SBIR/STTR grants & alternative energy VC funding",
  ].forEach(r => { check(6); para(`· ${r}`); });
  y += 4;

  if (aiExpansion) {
    band("SLIDE 6 — AI EXECUTIVE SUMMARY", 180, 40, 100);
    para(aiExpansion);
  }

  // Footer on all pages
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(150, 150, 150);
    doc.text("Zenith Apex Research Database — CONFIDENTIAL", margin, 291);
    doc.text(`Page ${p} of ${total}`, W - margin, 291, { align: "right" });
  }

  doc.save(`ZenithApex_PitchDeck_${item.title.replace(/[^a-z0-9]/gi, "_").slice(0, 40)}.pdf`);
}

export default function PitchBuilder() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [aiExpansion, setAiExpansion] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [exportingSlides, setExportingSlides] = useState(false);
  const [slidesUrl, setSlidesUrl] = useState(null);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setAiExpansion(null);
  };

  const handleExportSlides = async () => {
    setExportingSlides(true);
    setSlidesUrl(null);
    const res = await base44.functions.invoke("exportToGoogleSlides", {
      title: selectedItem.title,
      tagline: selectedItem.tagline,
      price: selectedItem.price,
      audience: selectedItem.audience,
      category: selectedItem.category,
      problem: selectedItem.problem,
      beardenSolution: selectedItem.beardenSolution,
      market: selectedItem.market,
      feasibility: selectedItem.feasibility,
      source: selectedItem.source,
      aiExpansion: aiExpansion || "",
    });
    if (res.data?.url) setSlidesUrl(res.data.url);
    setExportingSlides(false);
  };

  const handleAI = async () => {
    setLoadingAI(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are writing an executive summary for an investor pitch deck. The invention is based on the classified research of Lt. Col. Thomas E. Bearden.

Invention: ${selectedItem.title}
Tagline: ${selectedItem.tagline}
Problem solved: ${selectedItem.problem}
Bearden Solution: ${selectedItem.beardenSolution}
Market: ${selectedItem.market}
Technical feasibility: ${selectedItem.feasibility}
Price point: ${selectedItem.price}
Target audience: ${selectedItem.audience}

Write a compelling 3-paragraph executive summary (120-150 words total) that:
1. Opens with the market problem and its scale
2. Introduces the Bearden-based solution with technical credibility
3. Closes with market opportunity and call to action for investors

Be specific, confident, and grounded in the documented physics. Avoid hype language. Sound like a serious defense/biotech pitch.`,
    });
    setAiExpansion(result);
    setLoadingAI(false);
  };

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <Link to="/business" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={15} /> Business Models
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">Pitch Builder</h1>
          <p className="text-gray-500 text-xs">Select an invention to auto-generate a high-converting pitch deck outline</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — invention selector */}
        <div className="w-72 flex-shrink-0 border-r border-gray-800 overflow-y-auto">
          <div className="p-3 border-b border-gray-800">
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Select Invention</p>
          </div>
          <div className="p-2 space-y-1">
            {inventions.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item)}
                className={`w-full text-left p-3 rounded-lg transition-colors group ${
                  selectedItem?.title === item.title
                    ? "bg-gray-800 border border-gray-600"
                    : "hover:bg-gray-900 border border-transparent"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold leading-snug truncate">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.price}</p>
                  </div>
                  <ChevronRight size={13} className="text-gray-700 group-hover:text-gray-400 flex-shrink-0 ml-auto mt-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main — pitch deck */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedItem ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-white font-bold text-lg mb-2">Build Your Pitch Deck</h2>
              <p className="text-gray-500 text-sm">Select an invention from the left panel. Each pitch deck is auto-populated with Problem, Bearden Solution, Market Potential, Technical Feasibility, Revenue Streams, and an AI-generated Executive Summary — all sourced from Bearden's primary documents.</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-gray-500 text-xs uppercase tracking-widest">Pitch Deck Outline</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generatePDF(selectedItem, aiExpansion)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700 text-blue-300 text-xs font-bold transition-all"
                  >
                    <FileText size={12} /> Download PDF
                  </button>
                  <button
                    onClick={handleExportSlides}
                    disabled={exportingSlides}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/60 border border-green-700 text-green-300 text-xs font-bold transition-all disabled:opacity-60"
                  >
                    {exportingSlides ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                    {exportingSlides ? "Creating…" : "Google Slides"}
                  </button>
                  {slidesUrl && (
                    <a href={slidesUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300 text-xs font-bold transition-all">
                      Open Slides ↗
                    </a>
                  )}
                  <button onClick={() => { setSelectedItem(null); setSlidesUrl(null); }} className="text-gray-600 hover:text-gray-400 ml-1">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <PitchDeck
                item={selectedItem}
                aiExpansion={aiExpansion}
                loadingAI={loadingAI}
                onRequestAI={handleAI}
              />
              <ValuationModule item={selectedItem} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}