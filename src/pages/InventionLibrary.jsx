import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Film, Download, FileText, Loader2, Search, X, Lock } from "lucide-react";
import { jsPDF } from "jspdf";
import { businessItems } from "../lib/businessItems";
import { inventionSteps } from "../lib/inventionSteps";
import Invention3DCardSmall from "../components/Invention3DCardSmall";
import InventionBuildVideo from "../components/InventionBuildVideo";
import { base44 } from "@/api/base44Client";

const inventions = businessItems.filter(i => i.category === "Invention");

// ─── Professional B&W PDF Generator ────────────────────────────────────────

function generateInventionPDF(inv) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 22;
  const cW = W - margin * 2;
  let y = 0;
  let pageCount = 0;

  const addPage = () => {
    if (pageCount > 0) doc.addPage();
    pageCount++;
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, 297, "F");
    // Header band
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, W, 18, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("ZENITH APEX RESEARCH PORTFOLIO", margin, 8);
    doc.text("INVENTION BUILD SPECIFICATIONS", W - margin, 8, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text("CONFIDENTIAL — NDA APPLIES — NOT FOR DISTRIBUTION", W / 2, 14, { align: "center" });
    y = 26;
  };

  const check = (need = 16) => {
    if (y + need > 282) { addPage(); }
  };

  const rule = (weight = 0.4) => {
    check(6);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(weight);
    doc.line(margin, y, W - margin, y);
    y += 5;
  };

  const sectionBand = (txt) => {
    check(14);
    doc.setFillColor(10, 10, 10);
    doc.rect(margin - 3, y - 2, cW + 6, 12, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(txt, margin, y + 6);
    y += 16;
  };

  const heading2 = (txt) => {
    check(12);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(txt, margin, y);
    y += 8;
  };

  const body = (txt, indent = 0, fontSize = 11) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    const lines = doc.splitTextToSize(txt, cW - indent);
    lines.forEach(l => { check(8); doc.text(l, margin + indent, y); y += 7; });
    y += 3;
  };

  const label = (lbl, val) => {
    check(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(lbl, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(val || "—", cW - 50);
    doc.text(lines[0], margin + 48, y);
    y += 7;
  };

  const data = inventionSteps[inv.title];

  // ── COVER ────────────────────────────────────────────────────────────────
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, 297, "F");
  pageCount++;

  // Top full-width band
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, W, 55, "F");

  // Logo text
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text("ZENITH APEX RESEARCH PORTFOLIO", W / 2, 16, { align: "center" });
  doc.setFontSize(7);
  doc.text("Advanced Scalar EM  ·  AI-Powered IP Generation  ·  Invention Build Plans  ·  Q2 2026", W / 2, 23, { align: "center" });

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize("INVENTION BUILD", cW);
  doc.text("INVENTION BUILD", W / 2, 37, { align: "center" });
  doc.text("SPECIFICATIONS & PLANS", W / 2, 48, { align: "center" });

  y = 70;

  // Device name box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(margin, y, cW, 28, "D");
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  const nameLines = doc.splitTextToSize(inv.title, cW - 8);
  nameLines.forEach((l, i) => doc.text(l, margin + 4, y + 11 + i * 8));
  y += 34;

  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(60, 60, 60);
  const tagLines = doc.splitTextToSize(`"${inv.tagline}"`, cW);
  tagLines.forEach(l => { doc.text(l, margin, y); y += 7; });
  y += 8;

  // Info row
  label("Price:", inv.price);
  label("Audience:", inv.audience);
  label("Category:", "Invention Build Plan — Zenith Apex Research Portfolio");
  label("Source:", inv.source);
  label("Date:", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));

  y += 8;
  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, cW, 20, "D");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("CONFIDENTIALITY NOTICE", margin + 4, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const confLines = doc.splitTextToSize("This document contains proprietary trade secrets. Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident.", cW - 8);
  confLines.forEach((l, i) => doc.text(l, margin + 4, y + 14 + i * 4.5));

  // ── CONTENT PAGES ───────────────────────────────────────────────────────
  addPage();

  sectionBand("1. OVERVIEW & TECHNICAL DESCRIPTION");
  body(inv.description || "See full technical documentation.");

  if (inv.problem) {
    heading2("1.1  The Problem");
    body(inv.problem);
  }
  if (inv.beardenSolution) {
    heading2("1.2  Bearden's Solution");
    body(inv.beardenSolution);
  }
  if (inv.market) {
    heading2("1.3  Market Opportunity");
    body(inv.market);
  }
  if (inv.feasibility) {
    heading2("1.4  Feasibility Notes");
    body(inv.feasibility);
  }

  rule();

  if (data) {
    sectionBand("2. TECHNICAL OVERVIEW");
    body(data.overview);
    rule();

    // BOM
    sectionBand("3. BILL OF MATERIALS");
    check(20);

    // Table header
    doc.setFillColor(30, 30, 30);
    doc.rect(margin - 3, y - 3, cW + 6, 11, "F");
    const cols = [margin - 1, margin + 15, margin + 85, margin + 135];
    ["Qty", "Component", "Specification", "Source / Cost"].forEach((h, i) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(h, cols[i], y + 4);
    });
    y += 12;

    data.bom.forEach((row, idx) => {
      check(10);
      if (idx % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin - 3, y - 3, cW + 6, 10, "F");
      }
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(String(row.qty), cols[0], y + 3);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(20, 20, 20);
      const itemLines = doc.splitTextToSize(row.item, 68);
      doc.text(itemLines[0], cols[1], y + 3);
      doc.setTextColor(40, 40, 40);
      const specLines = doc.splitTextToSize(row.spec, 48);
      doc.text(specLines[0], cols[2], y + 3);
      doc.setTextColor(60, 60, 60);
      const srcLines = doc.splitTextToSize(row.source, 36);
      doc.text(srcLines[0], cols[3], y + 3);
      y += 10;
    });
    y += 5;

    rule();

    sectionBand("4. STEP-BY-STEP BUILD INSTRUCTIONS");

    data.steps.forEach((step, i) => {
      check(28);
      // Step header
      doc.setFillColor(20, 20, 20);
      doc.rect(margin - 3, y - 2, cW + 6, 13, "F");
      // Circle number
      doc.setFillColor(255, 255, 255);
      doc.circle(margin + 5, y + 4.5, 4.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(String(i + 1), margin + 5, y + 6.5, { align: "center" });
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text(`Step ${i + 1}: ${step.title}`, margin + 13, y + 6);
      y += 16;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 15, 15);
      const detailLines = doc.splitTextToSize(step.detail, cW - 4);
      detailLines.forEach(l => { check(8); doc.text(l, margin + 2, y); y += 7; });

      if (step.warning) {
        check(18);
        y += 2;
        doc.setDrawColor(0);
        doc.setLineWidth(0.4);
        doc.rect(margin, y, cW, 14, "D");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("⚠ WARNING:", margin + 3, y + 6);
        doc.setFont("helvetica", "normal");
        const warnLines = doc.splitTextToSize(step.warning, cW - 32);
        doc.text(warnLines[0], margin + 30, y + 6);
        if (warnLines[1]) doc.text(warnLines[1], margin + 3, y + 10.5);
        y += 18;
      } else {
        y += 5;
      }
    });

    rule();

    sectionBand("5. TECHNICAL NOTES");
    body(data.notes);
    y += 4;

    sectionBand("6. SOFTWARE & FIRMWARE");
    body(data.softwareNotes);
  } else {
    sectionBand("2. BUILD SPECIFICATIONS");
    body("Detailed engineering drawings and step-by-step build instructions are included in the full technical package, available after NDA execution. See section 1 for the invention overview, problem statement, and Bearden's solution framework.");
    y += 4;
    sectionBand("3. TECHNICAL NOTES");
    body("This invention is derived from the primary source documentation included in the Zenith Apex Research Portfolio. Full BOM, schematic diagrams, winding specifications, and firmware are available in the complete plans package.");
  }

  rule();
  sectionBand("7. PRIMARY SOURCES & REFERENCES");
  body(inv.source);

  // ── FOOTER on all pages ──────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 287, W, 10, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Zenith Apex Research Portfolio — Invention Build Plans — CONFIDENTIAL — NDA Applies", margin, 293);
    doc.text(`Page ${p} of ${total}`, W - margin, 293, { align: "right" });
  }

  const fname = inv.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 45);
  doc.save(`ZenithApex_Build_Plans_${fname}.pdf`);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InventionLibrary() {
  const [search, setSearch] = useState("");
  const [buildVideoInv, setBuildVideoInv] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  useEffect(() => {
    base44.functions.invoke("getUserPurchases", {})
      .then(res => {
        const purchases = res?.data?.purchases || [];
        const paid = purchases.some(p =>
          p.category === "Invention" ||
          p.title?.toLowerCase().includes("invention") ||
          p.title?.toLowerCase().includes("plan") ||
          p.title?.toLowerCase().includes("build")
        );
        setHasPurchased(paid);
      })
      .catch(() => setHasPurchased(false))
      .finally(() => setCheckingPurchase(false));
  }, []);

  const filtered = inventions.filter(inv =>
    inv.title.toLowerCase().includes(search.toLowerCase()) ||
    inv.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePdf = async (inv) => {
    setGeneratingPdf(inv.title);
    await new Promise(r => setTimeout(r, 50));
    generateInventionPDF(inv);
    setGeneratingPdf(null);
  };

  const getBuildVideoPayload = (inv) => {
    const data = inventionSteps[inv.title];
    return {
      name: inv.title,
      tagline: inv.tagline,
      category: inv.category,
      steps: data?.steps?.map(s => ({
        title: s.title,
        description: s.detail,
        materials: [],
        tools: [],
        warning: s.warning || null,
      })) || [],
    };
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 sticky top-0 z-20 bg-gray-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base tracking-tight">⚗️ Invention Build Library</h1>
            <p className="text-gray-500 text-xs">{inventions.length} inventions · Build videos · Professional PDF specs</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search inventions…"
              className="bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-500 w-52"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"><X size={12} /></button>}
          </div>
          <Link to="/admin-videos" className="px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-900/40 border border-purple-700 text-purple-300">🎬 Video Library</Link>
          <Link to="/invention-plans" className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-900/40 border border-red-700 text-red-300">📐 Build Plans</Link>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((inv, i) => {
            const hasSteps = !!inventionSteps[inv.title];
            const colors = ["#3b82f6","#22c55e","#a855f7","#f59e0b","#ef4444","#06b6d4","#ec4899","#84cc16","#f97316","#8b5cf6","#14b8a6","#fb923c"];
            const color = inv.color || colors[i % colors.length];
            const isPdfLoading = generatingPdf === inv.title;

            return (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col"
                style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
                {/* 3D Device Visualization */}
                <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-gray-700 overflow-hidden border-b border-gray-700 flex">
                  <div className="w-full h-full">
                    <Invention3DCardSmall invention={inv} />
                  </div>
                </div>
                {/* Card header */}
                <div className="p-4 flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl flex-shrink-0">{inv.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded font-bold uppercase" style={{ backgroundColor: color + "22", color }}>{inv.price}</span>
                        {hasSteps && <span className="text-xs px-2 py-0.5 rounded bg-green-950/50 border border-green-800 text-green-400">Full Plans</span>}
                      </div>
                      <h3 className="text-white font-bold text-sm leading-snug">{inv.title}</h3>
                      <p className="text-gray-500 text-xs mt-1 italic leading-snug">"{inv.tagline}"</p>
                    </div>
                  </div>

                  {inv.description && (
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{inv.description}</p>
                  )}

                  {inv.problem && (
                    <div className="mt-3 bg-gray-800/50 rounded-lg p-2.5">
                      <p className="text-gray-600 text-xs font-bold uppercase mb-1">Problem</p>
                      <p className="text-gray-400 text-xs leading-snug line-clamp-2">{inv.problem}</p>
                    </div>
                  )}

                  {hasSteps && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-gray-600">{inventionSteps[inv.title].bom?.length} components</span>
                      <span className="text-gray-700">·</span>
                      <span className="text-xs text-gray-600">{inventionSteps[inv.title].steps?.length} build steps</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                 <div className="px-4 pb-4 flex gap-2 flex-wrap">
                   {hasPurchased ? (
                     <>
                       <button
                         onClick={() => setBuildVideoInv(getBuildVideoPayload(inv))}
                         className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 flex-1"
                         style={{ backgroundColor: color }}>
                         <Film size={12} /> 🎬 Build Video
                       </button>
                       <button
                         onClick={() => handlePdf(inv)}
                         disabled={isPdfLoading}
                         className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-all disabled:opacity-60 flex-1">
                         {isPdfLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                         {isPdfLoading ? "Building…" : "PDF Specs"}
                       </button>
                     </>
                   ) : (
                     <>
                       <button
                         disabled
                         className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 bg-gray-800 border border-gray-700 flex-1 opacity-50 cursor-not-allowed">
                         <Lock size={12} /> Video (locked)
                       </button>
                       <button
                         disabled
                         className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 bg-gray-800 border border-gray-700 flex-1 opacity-50 cursor-not-allowed">
                         <Lock size={12} /> Specs (locked)
                       </button>
                     </>
                   )}
                   <Link to="/pricing" className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-cyan-700 hover:bg-cyan-600 text-white transition-all flex-1">
                     💳 Buy Now
                   </Link>
                 </div>
                  </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <p className="text-4xl mb-3">🔍</p>
            <p>No inventions match "{search}"</p>
          </div>
        )}
      </div>

      {buildVideoInv && (
        <InventionBuildVideo invention={buildVideoInv} onClose={() => setBuildVideoInv(null)} />
      )}
    </div>
  );
}