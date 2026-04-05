import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Download, ChevronRight, Check, Loader2, X, FileText, Presentation } from "lucide-react";
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}