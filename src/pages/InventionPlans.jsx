import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Package, Loader2, FileText, Lock, ShoppingCart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { businessItems } from "../lib/businessItems";
import { inventionSteps } from "../lib/inventionSteps";
import InventionDiagram from "../components/InventionDiagram";
import { jsPDF } from "jspdf";

const inventions = businessItems.filter(i => i.category === "Invention");

function BomTable({ bom }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left text-gray-500 font-semibold py-2 pr-4 w-12">Qty</th>
            <th className="text-left text-gray-500 font-semibold py-2 pr-4">Item</th>
            <th className="text-left text-gray-500 font-semibold py-2 pr-4">Specification</th>
            <th className="text-left text-gray-500 font-semibold py-2">Source / Est. Cost</th>
          </tr>
        </thead>
        <tbody>
          {bom.map((row, i) => (
            <tr key={i} className={`border-b border-gray-800 ${i % 2 === 0 ? "bg-gray-900/30" : ""}`}>
              <td className="py-2 pr-4 text-cyan-400 font-bold">{row.qty}</td>
              <td className="py-2 pr-4 text-gray-200">{row.item}</td>
              <td className="py-2 pr-4 text-gray-400">{row.spec}</td>
              <td className="py-2 text-gray-500">{row.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepCard({ step, index }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-bold text-white">
        {index + 1}
      </div>
      <div className="flex-1 pb-6 border-l border-gray-800 pl-4 -ml-4 ml-0">
        <h4 className="text-white font-semibold text-sm mb-1">{step.title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{step.detail}</p>
        {step.warning && (
          <div className="mt-2 flex items-start gap-2 bg-yellow-950/40 border border-yellow-800/50 rounded-lg px-3 py-2">
            <AlertTriangle size={13} className="text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-300 text-xs leading-relaxed">{step.warning}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function generatePDF(invention, data) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;

  const wrapText = (text, maxW, fontSize) => {
    const words = String(text).split(" ");
    const lines = [];
    let line = "";
    const charW = fontSize * 0.45;
    const maxChars = Math.floor(maxW / charW);
    words.forEach(word => {
      if ((line + word).length > maxChars) {
        if (line) lines.push(line.trim());
        line = word + " ";
      } else {
        line += word + " ";
      }
    });
    if (line.trim()) lines.push(line.trim());
    return lines;
  };

  let y = 0;

  const checkPage = (needed = 20) => {
    if (y + needed > 275) { doc.addPage(); y = 20; }
  };

  // ── Cover page
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, W, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("BEARDEN SCALAR EM RESEARCH PLATFORM", margin, 35);
  doc.text("INVENTION BUILD PLANS — CONFIDENTIAL", margin, 42);

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  const titleLines = wrapText(invention.title, contentW, 22);
  titleLines.forEach((ln, i) => doc.text(ln, margin, 65 + i * 12));

  const afterTitle = 65 + titleLines.length * 12 + 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  const tagLines = wrapText(`"${invention.tagline}"`, contentW, 11);
  tagLines.forEach((ln, i) => doc.text(ln, margin, afterTitle + i * 7));

  let ty = afterTitle + tagLines.length * 7 + 12;

  const infoBoxes = [
    { label: "CATEGORY", value: invention.category },
    { label: "PRICE", value: invention.price },
    { label: "AUDIENCE", value: invention.audience },
  ];
  infoBoxes.forEach(({ label, value }) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(label, margin, ty);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225);
    doc.text(value, margin, ty + 5);
    ty += 14;
  });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Source: ${invention.source}`, margin, ty + 5);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | NDA APPLIES — DO NOT DISTRIBUTE`, margin, ty + 12);

  doc.setFillColor(239, 68, 68);
  doc.rect(0, 294, W, 3, "F");

  // ── Page 2: Overview + Problem + Solution
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 297, "F");
  y = 20;

  const section = (title, color = [148, 163, 184]) => {
    checkPage(20);
    doc.setFillColor(30, 41, 59);
    doc.rect(margin - 2, y - 5, contentW + 4, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...color);
    doc.text(title, margin, y + 1);
    y += 10;
  };

  const body = (text, color = [148, 163, 184], fs = 9) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fs);
    doc.setTextColor(...color);
    const lines = wrapText(text, contentW, fs);
    lines.forEach(ln => { checkPage(8); doc.text(ln, margin, y); y += 6; });
    y += 3;
  };

  section("TECHNICAL OVERVIEW", [34, 197, 94]);
  body(data.overview, [203, 213, 225]);

  section("THE PROBLEM", [239, 68, 68]);
  body(invention.problem || "No problem statement provided.", [203, 213, 225]);

  section("BEARDEN'S SOLUTION", [59, 130, 246]);
  body(invention.beardenSolution || "Refer to source documents.", [203, 213, 225]);

  section("MARKET OPPORTUNITY", [245, 158, 11]);
  body(invention.market || "See business models section.", [203, 213, 225]);

  section("FEASIBILITY NOTES", [168, 85, 247]);
  body(invention.feasibility || "See engineering plans.", [203, 213, 225]);

  // ── Page 3: Bill of Materials
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 297, "F");
  y = 20;

  section("BILL OF MATERIALS", [6, 182, 212]);

  const colWidths = [12, 72, 56, 32];
  const colX = [margin, margin + 12, margin + 84, margin + 140];
  const headers = ["Qty", "Item", "Specification", "Source"];

  doc.setFillColor(30, 41, 59);
  doc.rect(margin - 2, y - 5, contentW + 4, 10, "F");
  headers.forEach((h, i) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(h, colX[i], y + 1);
  });
  y += 8;

  data.bom.forEach((row, idx) => {
    checkPage(12);
    if (idx % 2 === 0) {
      doc.setFillColor(22, 33, 48);
      doc.rect(margin - 2, y - 4, contentW + 4, 9, "F");
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(34, 211, 238);
    doc.text(String(row.qty), colX[0], y + 1);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(203, 213, 225);
    const itemLines = wrapText(row.item, 70, 8);
    doc.text(itemLines[0], colX[1], y + 1);
    doc.setTextColor(148, 163, 184);
    const specLines = wrapText(row.spec, 54, 8);
    doc.text(specLines[0], colX[2], y + 1);
    doc.setTextColor(100, 116, 139);
    const srcLines = wrapText(row.source, 42, 8);
    doc.text(srcLines[0], colX[3], y + 1);
    y += 9;
  });

  y += 5;
  section("SOFTWARE & FIRMWARE NOTES", [34, 197, 94]);
  body(data.softwareNotes, [203, 213, 225]);

  // ── Step-by-step pages
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 297, "F");
  y = 20;

  section("STEP-BY-STEP BUILD INSTRUCTIONS", [255, 255, 255]);

  data.steps.forEach((step, i) => {
    checkPage(30);

    doc.setFillColor(30, 41, 59);
    doc.rect(margin - 2, y - 5, contentW + 4, 12, "F");

    doc.setFillColor(239, 68, 68);
    doc.circle(margin + 5, y + 1, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(String(i + 1), margin + 4, y + 2.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Step ${i + 1}: ${step.title}`, margin + 12, y + 2);
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    const detailLines = wrapText(step.detail, contentW - 4, 9);
    detailLines.forEach(ln => { checkPage(8); doc.text(ln, margin + 2, y); y += 6; });

    if (step.warning) {
      checkPage(20);
      doc.setFillColor(69, 26, 3);
      doc.rect(margin, y, contentW, 1, "F");
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(251, 191, 36);
      doc.text("⚠ WARNING:", margin + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(253, 224, 71);
      const warnLines = wrapText(step.warning, contentW - 4, 8);
      warnLines.forEach(ln => { checkPage(8); doc.text(ln, margin + 2, y + 6); y += 6; });
      y += 6;
    }
    y += 8;
  });

  // ── Final notes page
  checkPage(60);
  section("TECHNICAL NOTES & REFERENCES", [148, 163, 184]);
  body(data.notes, [203, 213, 225]);

  section("SOURCE DOCUMENTATION", [245, 158, 11]);
  body(invention.source, [203, 213, 225]);

  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text("CONFIDENTIAL — Bearden Scalar EM Research Platform — NDA Applies — Not for Distribution", margin, 290);

  const filename = invention.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
  doc.save(`Bearden_Plans_${filename}.pdf`);
}

function PaywallGate({ invention }) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-4xl mx-auto mb-6">
          {invention?.icon || "🔒"}
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock size={16} className="text-red-400" />
          <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Purchase Required</span>
        </div>
        <h2 className="text-white font-black text-2xl mb-3">
          {invention?.title || "Invention Build Plans"}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Full build plans — including step-by-step instructions, bill of materials, schematics, and downloadable PDF — are available after purchase.
        </p>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 mb-6 text-left space-y-2">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">What's included after purchase:</p>
          {["Step-by-step build instructions", "Full bill of materials with sources", "Schematic diagrams", "Software & firmware notes", "Downloadable PDF"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />{item}
            </div>
          ))}
        </div>
        <Link to="/checkout"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-white text-sm bg-red-700 hover:bg-red-600 transition-all">
          <ShoppingCart size={15} /> Purchase Access — {invention?.price || "See Pricing"}
        </Link>
        <Link to="/courses" className="block mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors">
          View all courses & plans →
        </Link>
      </div>
    </div>
  );
}

export default function InventionPlans() {
  const [selected, setSelected] = useState(inventions[0]);
  const [showBom, setShowBom] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [generating, setGenerating] = useState(false);
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

  const data = inventionSteps[selected?.title];

  const handleDownload = async () => {
    if (!data || !selected) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 50));
    generatePDF(selected, data);
    setGenerating(false);
  };

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/business" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Invention Build Plans</h1>
            <p className="text-gray-500 text-xs">Step-by-step instructions, instrument schematics & downloadable PDF plans</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800">
            <Package size={12} /> {inventions.length} inventions
          </span>
          <button
            onClick={handleDownload}
            disabled={!data || generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-all"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {generating ? "Generating PDF…" : "Download Plans PDF"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-gray-800 overflow-y-auto bg-gray-950">
          {inventions.map((inv, i) => {
            const isSelected = selected?.title === inv.title;
            const hasData = !!inventionSteps[inv.title];
            return (
              <button
                key={i}
                onClick={() => setSelected(inv)}
                className={`w-full text-left px-4 py-3 border-b border-gray-800/50 transition-all flex items-start gap-3 ${
                  isSelected ? "bg-gray-800 border-l-2" : "hover:bg-gray-900"
                }`}
                style={isSelected ? { borderLeftColor: inv.color } : {}}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{inv.icon}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold leading-snug ${isSelected ? "text-white" : "text-gray-300"}`}>
                    {inv.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: inv.color }}>{inv.price}</p>
                  {hasData && (
                    <span className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={10} /> Plans available
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {checkingPurchase ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 size={24} className="animate-spin text-gray-600" />
            </div>
          ) : !hasPurchased ? (
            <PaywallGate invention={selected} />
          ) : selected && data ? (
            <div className="p-6 max-w-5xl">
              {/* Invention header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: selected.color + "20" }}>
                  {selected.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: selected.color + "20", color: selected.color }}>
                      {selected.category}
                    </span>
                    <span className="text-green-400 font-bold text-sm">{selected.price}</span>
                  </div>
                  <h2 className="text-white font-bold text-2xl leading-tight">{selected.title}</h2>
                  <p className="text-gray-400 text-sm mt-1 italic">"{selected.tagline}"</p>
                </div>
              </div>

              {/* Diagram + overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden aspect-[4/3]">
                  <InventionDiagram type={data.diagramType} color={selected.color} />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">Technical Overview</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{data.overview}</p>
                  </div>
                  {selected.problem && (
                    <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4">
                      <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">The Problem</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">{selected.problem}</p>
                    </div>
                  )}
                  {selected.feasibility && (
                    <div className="bg-green-950/30 border border-green-900/40 rounded-xl p-4">
                      <h4 className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1">Feasibility</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">{selected.feasibility}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* BOM */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
                <button
                  onClick={() => setShowBom(s => !s)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={15} className="text-cyan-400" />
                    <h3 className="text-white font-bold text-sm">Bill of Materials</h3>
                    <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{data.bom.length} components</span>
                  </div>
                  {showBom ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
                </button>
                {showBom && (
                  <div className="px-5 pb-5">
                    <BomTable bom={data.bom} />
                  </div>
                )}
              </div>

              {/* Steps */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
                <button
                  onClick={() => setShowSteps(s => !s)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-green-400" />
                    <h3 className="text-white font-bold text-sm">Step-by-Step Instructions</h3>
                    <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{data.steps.length} steps</span>
                  </div>
                  {showSteps ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
                </button>
                {showSteps && (
                  <div className="px-5 pb-5 space-y-1">
                    {data.steps.map((step, i) => (
                      <StepCard key={i} step={step} index={i} />
                    ))}
                  </div>
                )}
              </div>

              {/* Notes + software */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Technical Notes</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{data.notes}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <h4 className="text-cyan-500 text-xs font-bold uppercase tracking-wider mb-2">Software & Firmware Included in PDF</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{data.softwareNotes}</p>
                </div>
              </div>

              {/* Source */}
              <div className="text-xs text-gray-700 border-t border-gray-800 pt-4">
                <span className="text-gray-500 font-semibold">Source: </span>{selected.source}
              </div>

              {/* Bottom CTA */}
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={handleDownload}
                  disabled={generating}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ backgroundColor: selected.color }}
                >
                  {generating ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                  {generating ? "Generating…" : `Download Complete Plans PDF`}
                </button>
                <p className="text-xs text-gray-600">Includes full BOM, schematics description, firmware notes, and step-by-step instructions.</p>
              </div>
            </div>
          ) : selected ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-12">
              <span className="text-5xl mb-4">{selected.icon}</span>
              <h3 className="text-white font-bold text-xl mb-2">{selected.title}</h3>
              <p className="text-gray-500 text-sm max-w-md">Detailed build plans for this invention are coming soon. Check back after the next update.</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">Select an invention to view plans</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}