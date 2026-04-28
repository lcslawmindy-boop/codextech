import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Package, Loader2, FileText, Lock, ShoppingCart, Lightbulb, Eye, Film, Shield, RotateCcw, BookOpen } from "lucide-react";
import { useTier } from "../hooks/useTier";
import { useTrial } from "@/lib/TrialContext";
import { isClassifiedInvention, tierHasGovAccess } from "../lib/tiers";
import { tierCanAccessInvention } from "../lib/tiers";
import GovClassifiedGate from "../components/GovClassifiedGate";
import TierGate from "../components/TierGate";
import InventionBuildVideo from "../components/InventionBuildVideo";
import InventionDiagram from "../components/InventionDiagram";
import { base44 } from "@/api/base44Client";
import { inventionVisuals } from "../lib/inventionVisuals";
import { businessItems } from "../lib/businessItems";
import { inventionSteps } from "../lib/inventionSteps";
import { jsPDF } from "jspdf";
import ResearchDisclaimer from "../components/ResearchDisclaimer";
import AttributionFooter from "../components/AttributionFooter";
import { itemImages } from "../lib/itemImages";


// Legacy admin-only gate (free energy / medical claims — still admin-only)
const ADMIN_ONLY_KEYWORDS = ["motionless electromagnetic generator", "prioré-type multichannel"];
const isAdminOnly = (title) => ADMIN_ONLY_KEYWORDS.some(k => title?.toLowerCase().includes(k.toLowerCase()));

// All inventions require membership or purchase
const isMembershipRequired = (title) => !isAdminOnly(title);

// Defense/restricted licensing inventions (hidden from public view — specs visible but specs locked, no PDF download)
const DEFENSE_RESTRICTED = [
  // Medical/bioelectromagnetic treatment claims (regulatory risk)
  "Telomere Regeneration Device (TRD-1)",
  "Prioré-Type Multichannel EM System",
  "UV Biophoton Disease Reversal Spectrometer",
  "Portable Porthole Disease Treatment System",
  "EM Trigger Window Therapy Device",
  
  // Defense-adjacent (classified potential)
  "Time-Reversal Zone Cold Fusion Reactor",
  "Aegis-SV Adaptive Scalar Counterphase Shield",
  "Atmospheric Scalar EM Signature Recognition System",
  "T-Polarized EM Wave Transducer",
  "Waddington Valley EM Tracer System",
  "Cloning Efficiency Enhancement System",
  "Kaznacheyev Reversal Cell Imprinting Chamber (KRCIC)",
  "Psychoenergetics Cellular Control System",
  
  // High-liability free energy (suppress per USPTO/regulatory pressure)
  "Motionless Electromagnetic Generator (MEG) — Advanced Phase",
  "Asymmetric Regauging Overunity Generator",
];

const isDefenseRestricted = (title) => DEFENSE_RESTRICTED.some(d => d.toLowerCase() === title?.toLowerCase());

// Patented inventions (owned by others, not for sale)
const PATENTED_NOT_FOR_SALE = [
  "Motionless Electromagnetic Generator (MEG) — Advanced Phase",
  "Asymmetric Regauging Overunity Generator",
  "Telomere Regeneration Device (TRD-1)",
  "Prioré-Type Multichannel EM System",
];

const isPatentedNotForSale = (title) => PATENTED_NOT_FOR_SALE.some(p => p.toLowerCase() === title?.toLowerCase());

const inventions = businessItems.filter(i => i.category === "Invention" && !isDefenseRestricted(i.title) && !isPatentedNotForSale(i.title));

function VisualExplainer({ visual }) {
  if (!visual) return null;
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
        <Eye size={15} className="text-cyan-400" />
        <h3 className="text-white font-bold text-sm">What It Looks Like & What It Does</h3>
      </div>
      <div className="p-5 space-y-5">
        {/* What it is */}
        <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-4">
          <p className="text-blue-300 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5"><Lightbulb size={11} /> What It Is</p>
          <p className="text-gray-300 text-sm leading-relaxed">{visual.whatItIs}</p>
        </div>

        {/* How it works */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">How It Works</p>
          <p className="text-gray-300 text-sm leading-relaxed">{visual.howItWorks}</p>
        </div>

        {/* Component breakdown */}
        <div>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-3">Key Components</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {visual.components.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: c.color }} />
                <div>
                  <p className="text-white text-xs font-bold leading-snug">{c.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-snug">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key principle */}
        <div className="bg-green-950/20 border border-green-900/30 rounded-xl p-4">
          <p className="text-green-400 font-bold text-xs uppercase tracking-wider mb-2">Key Principle</p>
          <p className="text-gray-300 text-sm leading-relaxed italic">{visual.keyPrinciple}</p>
        </div>

        {/* Size */}
        {visual.realWorldSize && (
          <p className="text-gray-600 text-xs">
            <span className="text-gray-500 font-semibold">Physical size: </span>{visual.realWorldSize}
          </p>
        )}
      </div>
    </div>
  );
}

function BomChecklist({ bom, checked, onToggle, onReset }) {
  const checkedCount = checked.filter(Boolean).length;
  const pct = bom.length > 0 ? Math.round((checkedCount / bom.length) * 100) : 0;
  const allDone = checkedCount === bom.length;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400 font-semibold">
            {checkedCount} / {bom.length} components procured
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black ${allDone ? "text-green-400" : "text-yellow-400"}`}>
              {pct}%
            </span>
            {checkedCount > 0 && (
              <button onClick={onReset} title="Reset checklist"
                className="text-gray-600 hover:text-gray-400 transition-colors">
                <RotateCcw size={11} />
              </button>
            )}
          </div>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-green-500" : "bg-yellow-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {allDone && (
          <p className="text-green-400 text-xs font-bold mt-1.5 flex items-center gap-1">
            <CheckCircle2 size={11} /> All components accounted for — ready to build!
          </p>
        )}
      </div>

      {/* Table with checkboxes */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-500 font-semibold py-2 pr-3 w-8"></th>
              <th className="text-left text-gray-500 font-semibold py-2 pr-4 w-12">Qty</th>
              <th className="text-left text-gray-500 font-semibold py-2 pr-4">Item</th>
              <th className="text-left text-gray-500 font-semibold py-2 pr-4">Specification</th>
              <th className="text-left text-gray-500 font-semibold py-2">Source / Est. Cost</th>
            </tr>
          </thead>
          <tbody>
            {bom.map((row, i) => (
              <tr
                key={i}
                onClick={() => onToggle(i)}
                className={`border-b border-gray-800 cursor-pointer transition-all select-none ${
                  checked[i]
                    ? "bg-green-950/20 opacity-60"
                    : i % 2 === 0
                    ? "bg-gray-900/30 hover:bg-gray-800/40"
                    : "hover:bg-gray-800/40"
                }`}
              >
                <td className="py-2 pr-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                    checked[i] ? "bg-green-600 border-green-600" : "border-gray-600"
                  }`}>
                    {checked[i] && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                </td>
                <td className={`py-2 pr-4 font-bold ${checked[i] ? "text-gray-600 line-through" : "text-cyan-400"}`}>{row.qty}</td>
                <td className={`py-2 pr-4 ${checked[i] ? "text-gray-600 line-through" : "text-gray-200"}`}>{row.item}</td>
                <td className={`py-2 pr-4 ${checked[i] ? "text-gray-700" : "text-gray-400"}`}>{row.spec}</td>
                <td className={`py-2 ${checked[i] ? "text-gray-700" : "text-gray-500"}`}>{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 text-xs mt-2">Click any row to mark as procured / manufactured.</p>
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

  section("SOURCE DOCUMENTATION & CITATIONS", [245, 158, 11]);
  body(invention.source, [203, 213, 225]);

  // ── Disclaimer block
  checkPage(45);
  doc.setFillColor(40, 30, 10);
  doc.rect(margin - 2, y - 2, contentW + 4, 42, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(251, 191, 36);
  doc.text("FOR RESEARCH AND EDUCATIONAL PURPOSES ONLY", margin, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 160, 80);
  const disclaimerLines = doc.splitTextToSize(
    "These build plans are derived from publicly available patents, peer-reviewed publications, and declassified government documents cited above. No device described herein has been approved by the FDA, FCC, EPA, or any regulatory authority for medical, therapeutic, commercial, or consumer use. Do not use any device from these plans for diagnosis, treatment, cure, or prevention of any disease or medical condition. All claims regarding energy output, biological effects, or field phenomena are theoretical or experimental in nature and have not been independently verified by a regulatory body. Replicate at your own risk. Always consult a licensed professional before any experimental application. Zenith Apex Research Platform assumes no liability for use or misuse of these plans.",
    contentW - 4
  );
  disclaimerLines.forEach((line, i) => { doc.text(line, margin, y + 11 + i * 4.5); });
  y += 48;

  section("PRIMARY SOURCE CITATIONS", [100, 160, 250]);
  body(
    "1. Bearden, T.E. (2002). Energy from the Vacuum. Cheniere Press. | " +
    "2. Anastasovski, P.K. et al. (2001). 'Explanation of the Motionless Electromagnetic Generator with O(3) Electrodynamics.' Found. Phys. Lett. 14(1). | " +
    "3. U.S. Patent 6,362,718 — Motionless Electromagnetic Generator (Bearden et al., 2002). | " +
    "4. Bateman, J.B. (1978). ONR London Branch Report R-5-78 (Unclassified). Office of Naval Research. | " +
    "5. Bohren, C.F. (1983). 'How can a particle absorb more than the light incident on it?' Am. J. Phys. 51(4). | " +
    "6. Kaznacheyev, V.P. et al. (1974–1982). Cytopathogenic UV photon experiments. Soviet scientific literature. | " +
    "7. Gray, E.V. (1975). U.S. Patent 3,890,548 — Pulsed Capacitor Discharge Engine. | " +
    "8. Bearden, T.E. (1991). Gravitobiology. Tesla Book Company. | " +
    "9. Aharonov, Y. & Bohm, D. (1959). 'Significance of Electromagnetic Potentials in Quantum Theory.' Phys. Rev. 115(3). | " +
    "10. Popp, F.A. (1992). 'Some Essential Questions of Biophoton Research.' Biophotons. Kluwer Academic.",
    [160, 170, 190], 7.5
  );

  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text("CONFIDENTIAL — Bearden Scalar EM Research Platform — NDA Applies — Not for Distribution", margin, 290);

  const filename = invention.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
  doc.save(`Bearden_Plans_${filename}.pdf`);
}

// Helper: load a remote image as base64 via canvas (CORS-safe for CDN images)
async function loadImageAsBase64(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function generateMasterPDF(allInventions) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;
  let pageCount = 0;

  // ── Pure B&W palette ──────────────────────────────────────────────────────
  const C = {
    black:    [0, 0, 0],
    white:    [255, 255, 255],
    gray95:   [242, 242, 242],
    gray85:   [216, 216, 216],
    gray60:   [153, 153, 153],
    gray40:   [102, 102, 102],
    gray20:   [51, 51, 51],
    gray10:   [26, 26, 26],
  };

  const wrapText = (text, maxW, fontSize) => {
    if (!text) return [];
    return doc.splitTextToSize(String(text), maxW);
  };

  const newPage = (bgWhite = true) => {
    if (pageCount > 0) doc.addPage();
    pageCount++;
    if (bgWhite) {
      doc.setFillColor(...C.white);
      doc.rect(0, 0, W, 297, "F");
    }
    y = 22;
  };

  const checkPage = (needed = 20) => {
    if (y + needed > 278) newPage();
  };

  // Running header for content pages
  const addRunningHeader = (leftText) => {
    doc.setFillColor(...C.black);
    doc.rect(0, 0, W, 10, "F");
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.white);
    doc.text("C.O.D.E.X.T.E.C.H. — MASTER BUILD PLANS COMPENDIUM — ADMIN CONFIDENTIAL", margin, 6.5);
    doc.setFont("helvetica", "normal");
    doc.text(leftText, W - margin, 6.5, { align: "right" });
  };

  const addFooterToAllPages = (total) => {
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setDrawColor(...C.gray60);
      doc.setLineWidth(0.3);
      doc.line(margin, 286, W - margin, 286);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.gray40);
      doc.text("FOR RESEARCH & EDUCATIONAL USE ONLY — NDA APPLIES — DO NOT DISTRIBUTE", margin, 290);
      doc.text(`Page ${p} of ${total}`, W - margin, 290, { align: "right" });
    }
  };

  // Section heading — black bar white text
  const section = (title) => {
    checkPage(16);
    doc.setFillColor(...C.black);
    doc.rect(margin - 2, y - 4, contentW + 4, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...C.white);
    doc.text(title, margin + 1, y + 2.5);
    y += 12;
  };

  // Sub-heading — gray bar dark text
  const subSection = (title) => {
    checkPage(12);
    doc.setFillColor(...C.gray85);
    doc.rect(margin - 2, y - 3, contentW + 4, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...C.gray10);
    doc.text(title, margin + 1, y + 2);
    y += 10;
  };

  const body = (text, fs = 8.5, indent = 0) => {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fs);
    doc.setTextColor(...C.gray20);
    const lines = wrapText(text, contentW - indent, fs);
    lines.forEach(ln => { checkPage(7); doc.text(ln, margin + indent, y); y += fs * 0.42; });
    y += 3;
  };

  const label = (lbl, val, indent = 0) => {
    if (!val) return;
    checkPage(8);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.gray40);
    doc.text(lbl, margin + indent, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.gray20);
    const lines = wrapText(val, contentW - 40 - indent, 8);
    doc.text(lines[0] || "", margin + indent + 38, y);
    y += 7;
    if (lines.length > 1) {
      lines.slice(1).forEach(l => { checkPage(6); doc.text(l, margin + indent + 38, y); y += 5.5; });
    }
  };

  // ── PRE-LOAD ALL IMAGES ──────────────────────────────────────────────────
  const imageCache = {};
  await Promise.all(
    allInventions.map(async (inv) => {
      const url = itemImages[inv.title];
      if (url) imageCache[inv.title] = await loadImageAsBase64(url);
    })
  );

  // ══════════════════════════════════════════════════════════════════════════
  // COVER PAGE
  // ══════════════════════════════════════════════════════════════════════════
  pageCount++;
  doc.setFillColor(...C.black);
  doc.rect(0, 0, W, 297, "F");

  // White accent stripe top
  doc.setFillColor(...C.white);
  doc.rect(0, 0, W, 2, "F");

  // Side rule accent
  doc.setFillColor(...C.gray40);
  doc.rect(margin - 5, 28, 2, 200, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.gray60);
  doc.text("C.O.D.E.X.T.E.C.H.", margin, 22);
  doc.text("ZENITH APEX RESEARCH PLATFORM", margin, 28);

  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.white);
  doc.text("MASTER", margin, 60);
  doc.text("BUILD PLANS", margin, 78);
  doc.text("COMPENDIUM", margin, 96);

  // White rule
  doc.setFillColor(...C.white);
  doc.rect(margin, 103, contentW * 0.6, 1, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...C.gray60);
  doc.text("Complete Engineering Documentation — All Invention Build Plans", margin, 112);

  const invWithData = allInventions.filter(inv => inventionSteps[inv.title]);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.gray40);
  doc.text(`${allInventions.length} inventions  ·  ${invWithData.length} with full specifications  ·  ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin, 122);

  // Classification box
  doc.setFillColor(30, 30, 30);
  doc.rect(margin, 134, contentW, 32, "F");
  doc.setDrawColor(...C.gray40);
  doc.setLineWidth(0.5);
  doc.rect(margin, 134, contentW, 32, "D");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.white);
  doc.text("CLASSIFICATION: ADMIN CONFIDENTIAL", margin + 5, 144);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray60);
  const classText = "Distribution restricted to authorized platform administrators. NDA applies in all jurisdictions. Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident per the platform terms of service.";
  const classLines = doc.splitTextToSize(classText, contentW - 10);
  classLines.forEach((l, i) => doc.text(l, margin + 5, 150 + i * 5));

  // TOC
  y = 175;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.gray60);
  doc.text("CONTENTS", margin, y); y += 8;

  allInventions.forEach((inv, idx) => {
    if (y > 282) return;
    const hasData = !!inventionSteps[inv.title];
    doc.setFontSize(7.5);
    doc.setFont("helvetica", hasData ? "normal" : "italic");
    doc.setTextColor(hasData ? 180 : 80, hasData ? 180 : 80, hasData ? 180 : 80);
    const num = String(idx + 1).padStart(2, "0");
    const label2 = `${num}  ${inv.title}${!hasData ? "  (overview only)" : ""}`;
    const trunc = label2.length > 78 ? label2.slice(0, 75) + "…" : label2;
    doc.text(trunc, margin, y);
    // Dot leader
    const textW = doc.getTextWidth(trunc);
    if (textW < contentW - 14) {
      const dotsX = margin + textW + 2;
      const dotsW = W - margin - 8 - dotsX;
      if (dotsW > 0) {
        doc.setTextColor(50, 50, 50);
        doc.text(".".repeat(Math.floor(dotsW / 1.5)), dotsX, y);
      }
    }
    y += 5;
  });

  // Bottom stripe
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 283, W, 14, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.gray40);
  doc.text("FOR RESEARCH & EDUCATIONAL USE ONLY  ·  NDA APPLIES  ·  DO NOT DISTRIBUTE", W / 2, 291, { align: "center" });

  // ══════════════════════════════════════════════════════════════════════════
  // DISCLAIMER PAGE
  // ══════════════════════════════════════════════════════════════════════════
  newPage();
  addRunningHeader("Disclaimer");

  doc.setFillColor(...C.gray95);
  doc.rect(margin - 2, y - 4, contentW + 4, 14, "F");
  doc.setDrawColor(...C.black);
  doc.setLineWidth(0.8);
  doc.line(margin - 2, y - 4, margin - 2, y + 10);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.black);
  doc.text("RESEARCH & EDUCATIONAL USE DISCLAIMER", margin + 3, y + 5);
  y += 20;

  const disclaimerText = "ALL DEVICES, PLANS, AND SPECIFICATIONS IN THIS COMPENDIUM ARE PROVIDED FOR RESEARCH AND EDUCATIONAL PURPOSES ONLY. No device described herein has been approved by the FDA, FCC, EPA, FTC, or any regulatory authority for medical, therapeutic, commercial, or consumer use. Do not use any device from these plans for diagnosis, treatment, cure, or prevention of any disease or medical condition. All claims regarding energy output, biological effects, or field phenomena are theoretical or experimental in nature and have not been independently verified by a regulatory body. Replicate at your own risk. Always consult a licensed professional before any experimental application. C.O.D.E.X.T.E.C.H. and Zenith Apex LLC assume no liability for use or misuse of these plans. All build plans are derived from publicly available patents, peer-reviewed scientific publications, and declassified government documents.";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.black);
  const dlLines = doc.splitTextToSize(disclaimerText, contentW);
  dlLines.forEach(ln => { checkPage(7); doc.text(ln, margin, y); y += 5.5; });
  y += 6;

  subSection("PRIMARY REFERENCES & CITATIONS");
  body("Bearden T.E. (2002) Energy from the Vacuum, Cheniere Press. | Anastasovski P.K. et al. (2001) Found. Phys. Lett. 14(1):87-94. | U.S. Patent 6,362,718 — MEG (2002). | Bateman J.B. (1978) ONR London Branch Report R-5-78, unclassified. | Bohren C.F. (1983) Am. J. Phys. 51(4):323-327. | Kaznacheyev V.P. et al. (1974–1982) Cytopathogenic UV photon research, Soviet scientific literature. | Gray E.V. (1975) U.S. Patent 3,890,548. | Bearden T.E. (1991) Gravitobiology, Tesla Book Company. | Aharonov Y. & Bohm D. (1959) Phys. Rev. 115(3):485. | Popp F.A. (1992) Biophotons, Kluwer Academic. | Rycroft M.J. et al. (2008) J. Atmos. Solar-Terrestrial Phys. 70(7). | Gurwitsch A.G. (1923) Arch. Entwicklungsmech. 100. | Waddington C.H. (1940) Organizers and Genes, Cambridge University Press.", 8);

  // ══════════════════════════════════════════════════════════════════════════
  // EACH INVENTION
  // ══════════════════════════════════════════════════════════════════════════
  for (let invIdx = 0; invIdx < allInventions.length; invIdx++) {
    const inv = allInventions[invIdx];
    const data = inventionSteps[inv.title];
    const imgData = imageCache[inv.title];

    // ── INVENTION DIVIDER / TITLE PAGE ──────────────────────────────────
    newPage(false);
    // Half-black header band
    doc.setFillColor(...C.black);
    doc.rect(0, 0, W, 120, "F");
    doc.setFillColor(...C.white);
    doc.rect(0, 120, W, 177, "F");

    // Index tab
    doc.setFillColor(...C.white);
    doc.rect(W - 22, 0, 22, 30, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.black);
    doc.text(String(invIdx + 1).padStart(2, "0"), W - 11, 18, { align: "center" });

    // Color photo — right side of header band
    if (imgData) {
      try {
        doc.addImage(imgData, "JPEG", W - margin - 68, 8, 64, 96, undefined, "FAST");
        // Fade overlay on photo
        doc.setFillColor(0, 0, 0);
        doc.setGState(new doc.GState({ opacity: 0.25 }));
        doc.rect(W - margin - 68, 8, 64, 96, "F");
        doc.setGState(new doc.GState({ opacity: 1.0 }));
      } catch { /* skip if image fails */ }
    }

    // Title on header band
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.gray60);
    doc.text(`INVENTION ${invIdx + 1} OF ${allInventions.length}`, margin, 18);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.white);
    const titleLines2 = doc.splitTextToSize(inv.title, contentW - 72);
    titleLines2.slice(0, 3).forEach((ln, i) => doc.text(ln, margin, 32 + i * 10));

    const afterTitle2 = 32 + Math.min(3, titleLines2.length) * 10 + 3;
    if (inv.tagline) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(...C.gray60);
      const tagL = doc.splitTextToSize(`"${inv.tagline}"`, contentW - 72);
      tagL.slice(0, 2).forEach((ln, i) => doc.text(ln, margin, afterTitle2 + i * 6));
    }

    // Meta below black band
    y = 128;
    doc.setDrawColor(...C.gray85);
    doc.setLineWidth(0.3);
    doc.line(margin, y, W - margin, y);
    y += 6;

    if (inv.icon) {
      doc.setFontSize(22);
      doc.text(inv.icon, margin, y + 2);
    }
    const metaX = margin + (inv.icon ? 14 : 0);

    [[" PRICE", inv.price], ["AUDIENCE", inv.audience]].forEach(([lbl, val]) => {
      if (!val) return;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...C.gray40);
      doc.text(lbl + ":", metaX, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.gray20);
      doc.text(String(val).slice(0, 100), metaX + 24, y);
      y += 7;
    });

    if (inv.description) {
      y += 4;
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.gray20);
      const dLines = doc.splitTextToSize(inv.description, contentW);
      dLines.slice(0, 6).forEach(ln => { doc.text(ln, margin, y); y += 5.5; });
    }

    if (inv.source) {
      y += 3;
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(...C.gray60);
      const srcLines = doc.splitTextToSize("Source: " + inv.source, contentW);
      srcLines.slice(0, 3).forEach(ln => { doc.text(ln, margin, y); y += 4.5; });
    }

    if (!data) {
      // Overview-only page
      newPage();
      addRunningHeader(inv.title.slice(0, 40));
      if (inv.problem) { subSection("THE PROBLEM"); body(inv.problem); }
      if (inv.beardenSolution) { subSection("SOLUTION FRAMEWORK"); body(inv.beardenSolution); }
      if (inv.market) { subSection("MARKET OPPORTUNITY"); body(inv.market); }
      continue;
    }

    // ── FULL BUILD PLAN PAGES ──────────────────────────────────────────
    newPage();
    addRunningHeader(inv.title.slice(0, 40));

    // Photo banner at top of first content page (full-width color strip)
    if (imgData) {
      try {
        doc.addImage(imgData, "JPEG", margin, y, contentW, 44, undefined, "FAST");
        y += 48;
      } catch { y += 2; }
    }

    section("TECHNICAL OVERVIEW");
    body(data.overview);
    if (inv.problem) { subSection("THE PROBLEM"); body(inv.problem); }
    if (inv.beardenSolution) { subSection("BEARDEN'S SOLUTION"); body(inv.beardenSolution); }
    if (inv.market) { subSection("MARKET OPPORTUNITY"); body(inv.market); }
    if (inv.feasibility) { subSection("FEASIBILITY NOTES"); body(inv.feasibility); }

    // ── BILL OF MATERIALS ─────────────────────────────────────────────
    if (data.bom?.length > 0) {
      checkPage(28);
      section(`BILL OF MATERIALS  (${data.bom.length} items)`);

      // Table header
      const colX2 = [margin, margin + 10, margin + 72, margin + 128];
      doc.setFillColor(...C.gray20);
      doc.rect(margin - 2, y - 4, contentW + 4, 9, "F");
      ["QTY", "ITEM", "SPECIFICATION", "SOURCE / COST"].forEach((h, i) => {
        doc.setFont("helvetica", "bold"); doc.setFontSize(7);
        doc.setTextColor(...C.white);
        doc.text(h, colX2[i], y + 1.5);
      });
      y += 8;

      data.bom.forEach((row, idx) => {
        checkPage(9);
        if (idx % 2 === 0) {
          doc.setFillColor(...C.gray95);
          doc.rect(margin - 2, y - 3, contentW + 4, 8.5, "F");
        }
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(...C.black);
        doc.text(String(row.qty), colX2[0], y + 1.5);
        doc.setFont("helvetica", "normal"); doc.setTextColor(...C.gray10);
        doc.text(doc.splitTextToSize(row.item || "", 60)[0] || "", colX2[1], y + 1.5);
        doc.setTextColor(...C.gray40);
        doc.text(doc.splitTextToSize(row.spec || "", 54)[0] || "", colX2[2], y + 1.5);
        doc.setTextColor(...C.gray60);
        doc.text(doc.splitTextToSize(row.source || "", 40)[0] || "", colX2[3], y + 1.5);
        y += 8.5;
      });
      y += 4;
    }

    // ── STEP-BY-STEP ASSEMBLY MANUAL ─────────────────────────────────
    if (data.steps?.length > 0) {
      // Each step gets its own dedicated page with color diagram
      for (let si = 0; si < data.steps.length; si++) {
        const step = data.steps[si];

        newPage();
        addRunningHeader(`${inv.title.slice(0, 30)} — Assembly Manual`);

        // ── STEP HEADER (full-width black bar) ──────────────────────
        doc.setFillColor(...C.black);
        doc.rect(0, y - 6, W, 16, "F");

        // Step number badge
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, y - 4, 18, 12, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...C.black);
        doc.text(`${si + 1}/${data.steps.length}`, margin + 9, y + 4.5, { align: "center" });

        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        const stepTitleLines = doc.splitTextToSize(`Step ${si + 1}: ${step.title}`, contentW - 28);
        doc.text(stepTitleLines[0] || "", margin + 22, y + 4.5);
        y += 16;

        // ── TWO-COLUMN LAYOUT: diagram (left) + info (right) ────────
        const leftW = 82;
        const rightW = contentW - leftW - 6;
        const rightX = margin + leftW + 6;
        const colStartY = y;

        // ── COLOR DIAGRAM (left column) ─────────────────────────────
        // Generate a canvas-based color schematic for this step
        const diagH = 72;
        const diagCanvas = document.createElement("canvas");
        diagCanvas.width = 400;
        diagCanvas.height = 350;
        const ctx = diagCanvas.getContext("2d");

        // Step-type color palette for diagrams
        const stepColors = {
          wiring:      { bg: "#0f172a", accent: "#38bdf8", secondary: "#7dd3fc", highlight: "#e0f2fe" },
          assembly:    { bg: "#0a2218", accent: "#34d399", secondary: "#6ee7b7", highlight: "#d1fae5" },
          testing:     { bg: "#1e1060", accent: "#a78bfa", secondary: "#c4b5fd", highlight: "#ede9fe" },
          calibration: { bg: "#1a1000", accent: "#fbbf24", secondary: "#fcd34d", highlight: "#fef3c7" },
          safety:      { bg: "#1c0606", accent: "#f87171", secondary: "#fca5a5", highlight: "#fee2e2" },
          preparation: { bg: "#0f172a", accent: "#94a3b8", secondary: "#cbd5e1", highlight: "#f1f5f9" },
        };
        const typeKey = (step.type || "assembly");
        const pal = stepColors[typeKey] || stepColors.assembly;

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 400, 350);
        grad.addColorStop(0, pal.bg);
        grad.addColorStop(1, "#000000");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 350);

        // Draw contextual diagram based on step type / step index
        const cx2 = 200, cy2 = 175;

        if (typeKey === "wiring" || typeKey === "assembly") {
          // Circuit/assembly schematic
          // Main component box
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 3;
          ctx.strokeRect(130, 110, 140, 90);
          ctx.fillStyle = pal.accent + "22";
          ctx.fillRect(130, 110, 140, 90);
          // Component label
          ctx.fillStyle = pal.accent;
          ctx.font = "bold 14px monospace";
          ctx.textAlign = "center";
          ctx.fillText("COMPONENT", cx2, cy2);
          ctx.fillText(`STEP ${si + 1}`, cx2, cy2 + 18);
          // Wire lines
          ctx.strokeStyle = pal.secondary;
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          [[130, 155, 40, 155], [270, 155, 360, 155], [200, 110, 200, 40], [200, 200, 200, 290]].forEach(([x1, y1, x2, y2]) => {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          });
          ctx.setLineDash([]);
          // Connection dots
          [[40, 155], [360, 155], [200, 40], [200, 290]].forEach(([cx, cy]) => {
            ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fillStyle = pal.secondary; ctx.fill();
            ctx.strokeStyle = pal.highlight; ctx.lineWidth = 2; ctx.stroke();
          });
          // Measurement arrows
          ctx.fillStyle = pal.accent;
          ctx.font = "11px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("⊕ +V", 45, 150);
          ctx.fillText("⊖ GND", 365, 150);
          ctx.textAlign = "center";
          ctx.fillText("OUT", 200, 30);
          ctx.fillText("IN", 200, 310);

        } else if (typeKey === "calibration" || typeKey === "testing") {
          // Oscilloscope / measurement display
          ctx.strokeStyle = pal.accent + "44";
          ctx.lineWidth = 1;
          for (let gx = 0; gx <= 320; gx += 40) { ctx.beginPath(); ctx.moveTo(40 + gx, 60); ctx.lineTo(40 + gx, 280); ctx.stroke(); }
          for (let gy = 0; gy <= 220; gy += 44) { ctx.beginPath(); ctx.moveTo(40, 60 + gy); ctx.lineTo(360, 60 + gy); ctx.stroke(); }
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let px = 0; px <= 320; px++) {
            const wave = 60 + Math.sin((px / 320) * Math.PI * 4 + si * 0.8) * 70 + Math.sin((px / 320) * Math.PI * 12) * 20;
            px === 0 ? ctx.moveTo(40 + px, 170 + wave * 0.35) : ctx.lineTo(40 + px, 170 + wave * 0.35);
          }
          ctx.stroke();
          ctx.fillStyle = pal.accent;
          ctx.font = "bold 12px monospace";
          ctx.textAlign = "left";
          ctx.fillText(`CH1  ${(2.3 + si * 0.1).toFixed(1)}V  ${(10 + si * 2)}kHz`, 50, 52);
          ctx.fillStyle = pal.secondary;
          ctx.fillText(`✓ MEASURE AT STEP ${si + 1}`, 50, 296);

        } else if (typeKey === "safety") {
          // Warning diagram
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(200, 60); ctx.lineTo(340, 300); ctx.lineTo(60, 300); ctx.closePath(); ctx.stroke();
          ctx.fillStyle = pal.accent + "22"; ctx.fill();
          ctx.fillStyle = pal.accent;
          ctx.font = "bold 64px sans-serif"; ctx.textAlign = "center";
          ctx.fillText("⚠", 200, 240);
          ctx.font = "bold 14px sans-serif";
          ctx.fillText("SAFETY CRITICAL", 200, 310);

        } else {
          // Preparation / default — checklist style
          const items = (step.materials || []).slice(0, 5);
          ctx.fillStyle = pal.secondary;
          ctx.font = "bold 13px sans-serif"; ctx.textAlign = "left";
          ctx.fillText("REQUIRED MATERIALS:", 40, 70);
          items.forEach((m, mi) => {
            const name = typeof m === "object" ? m.name : String(m);
            const yPos = 100 + mi * 40;
            ctx.strokeStyle = pal.accent; ctx.lineWidth = 2;
            ctx.strokeRect(40, yPos - 14, 16, 16);
            ctx.fillStyle = pal.accent; ctx.font = "11px sans-serif";
            ctx.fillText(`▶  ${name.slice(0, 38)}`, 65, yPos - 2);
          });
          ctx.fillStyle = pal.accent;
          ctx.font = "bold 11px monospace"; ctx.textAlign = "right";
          ctx.fillText(`STEP ${si + 1} / ${data.steps.length}`, 370, 320);
        }

        // Step type label pill
        ctx.fillStyle = pal.accent + "33";
        ctx.beginPath(); ctx.roundRect(14, 14, 100, 22, 11); ctx.fill();
        ctx.fillStyle = pal.accent;
        ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
        ctx.fillText((step.type || "ASSEMBLY").toUpperCase(), 64, 29);

        // Convert canvas to image and add to PDF
        try {
          const diagImg = diagCanvas.toDataURL("image/jpeg", 0.90);
          doc.addImage(diagImg, "JPEG", margin, y, leftW, diagH, undefined, "FAST");
          // Border around diagram
          doc.setDrawColor(...C.gray85);
          doc.setLineWidth(0.4);
          doc.rect(margin, y, leftW, diagH, "D");
          // Caption
          doc.setFontSize(6.5);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(...C.gray60);
          doc.text(`Fig. ${si + 1}: ${(step.type || "Assembly").charAt(0).toUpperCase() + (step.type || "Assembly").slice(1)} diagram`, margin + leftW / 2, y + diagH + 4, { align: "center" });
        } catch { /* skip */ }

        // ── RIGHT COLUMN: detail text ────────────────────────────────
        let ry = colStartY;

        // Instructions label
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...C.gray40);
        doc.text("INSTRUCTIONS", rightX, ry);
        ry += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...C.gray10);
        const detailLines = doc.splitTextToSize(step.detail || "", rightW);
        // Fill right column up to bottom of diagram area
        const maxRightY = colStartY + diagH + 8;
        detailLines.forEach(ln => {
          if (ry < maxRightY) { doc.text(ln, rightX, ry); ry += 5; }
        });

        // ── BELOW BOTH COLUMNS: overflow detail + materials + tools + warning ──
        y = Math.max(y + diagH + 10, ry + 4);

        // Overflow detail lines that didn't fit in right column
        const overflowLines = detailLines.slice(Math.floor((maxRightY - colStartY) / 5));
        if (overflowLines.length > 0) {
          doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...C.gray10);
          overflowLines.forEach(ln => { checkPage(7); doc.text(ln, margin, y); y += 5; });
          y += 3;
        }

        // Materials checklist
        const mats = step.materials || [];
        if (mats.length > 0) {
          checkPage(12 + mats.length * 7);
          const halfW = (contentW - 6) / 2;
          // Left: materials
          doc.setFillColor(...C.gray95);
          doc.rect(margin - 2, y - 3, halfW + 2, 8, "F");
          doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(...C.black);
          doc.text("MATERIALS REQUIRED", margin, y + 2); y += 10;

          mats.forEach(m => {
            checkPage(7);
            const name = typeof m === "object" ? m.name : String(m);
            const cost = typeof m === "object" && m.cost ? m.cost : null;
            const where = typeof m === "object" && m.where ? m.where : null;
            // Checkbox
            doc.setDrawColor(...C.gray40); doc.setLineWidth(0.4);
            doc.rect(margin, y - 3.5, 4, 4, "D");
            doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(...C.gray20);
            doc.text(name.slice(0, 45), margin + 6, y);
            if (cost) { doc.setTextColor(...C.gray40); doc.text(cost, margin + halfW - 8, y, { align: "right" }); }
            if (where) { doc.setFontSize(6.5); doc.setTextColor(...C.gray60); doc.text(where.slice(0, 30), margin + halfW + 2, y); }
            y += 7;
          });
        }

        // Tools
        const tools = step.tools || [];
        if (tools.length > 0) {
          checkPage(10 + Math.ceil(tools.length / 3) * 7);
          y += 2;
          doc.setFillColor(...C.gray20);
          doc.rect(margin - 2, y - 3, contentW + 4, 7, "F");
          doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(...C.white);
          doc.text("TOOLS:  " + tools.join("  ·  "), margin + 1, y + 1.5);
          y += 10;
        }

        // Checkpoint
        if (step.checkpoint) {
          checkPage(14);
          doc.setFillColor(240, 255, 240);
          doc.setDrawColor(100, 180, 100);
          doc.setLineWidth(0.4);
          const cpLines = doc.splitTextToSize("✓  CHECKPOINT: " + step.checkpoint, contentW - 8);
          const cpH = cpLines.length * 5.5 + 8;
          doc.rect(margin, y, contentW, cpH, "FD");
          doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(30, 100, 30);
          cpLines.forEach((ln, li) => { doc.text(ln, margin + 4, y + 6 + li * 5.5); });
          y += cpH + 4;
        }

        // Warning box
        if (step.warning) {
          checkPage(16);
          y += 2;
          doc.setFillColor(255, 248, 230);
          doc.setDrawColor(200, 120, 0);
          doc.setLineWidth(0.5);
          const warnLines = doc.splitTextToSize("⚠  WARNING: " + step.warning, contentW - 8);
          const warnH = warnLines.length * 5.5 + 8;
          doc.rect(margin, y, contentW, warnH, "FD");
          doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(160, 80, 0);
          warnLines.forEach((ln, li) => { doc.text(ln, margin + 4, y + 6 + li * 5.5); });
          y += warnH + 4;
        }

        // Duration badge bottom-right
        if (step.duration) {
          checkPage(8);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...C.gray60);
          doc.text(`⏱  Est. time: ${step.duration}`, W - margin, y, { align: "right" });
          y += 8;
        }

        // Bottom divider
        y += 3;
        doc.setDrawColor(...C.gray85);
        doc.setLineWidth(0.3);
        doc.line(margin, y, W - margin, y);
      }
    }

    // ── NOTES & FIRMWARE ─────────────────────────────────────────────
    if (data.notes) {
      checkPage(18);
      section("TECHNICAL NOTES");
      body(data.notes);
    }
    if (data.softwareNotes) {
      checkPage(14);
      subSection("SOFTWARE & FIRMWARE NOTES");
      body(data.softwareNotes);
    }

    // ── SOURCE CITATIONS ─────────────────────────────────────────────
    if (inv.source) {
      checkPage(12);
      subSection("SOURCE CITATIONS");
      body(inv.source, 7.5);
    }

    // Closing rule
    checkPage(8);
    y += 3;
    doc.setDrawColor(...C.gray85);
    doc.setLineWidth(0.3);
    doc.line(margin, y, W - margin, y);
    y += 5;
  }

  addFooterToAllPages(doc.getNumberOfPages());
  doc.save(`ZenithApex_MASTER_Build_Plans_${new Date().toISOString().slice(0, 10)}.pdf`);
}

function SpecsLockedGate({ invention }) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-4xl mx-auto mb-6">
          {invention?.icon || "📋"}
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock size={16} className="text-indigo-400" />
          <span className="text-indigo-400 font-bold text-sm uppercase tracking-wider">Specs Hidden</span>
        </div>
        <h2 className="text-white font-black text-2xl mb-2">{invention?.title}</h2>
        <p className="text-gray-400 text-sm italic mb-4">{invention?.tagline}</p>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          To view technical specifications, bill of materials, and build instructions for this invention, you need a membership or purchase this plan individually.
        </p>
        <div className="space-y-2 mb-6">
          <button onClick={() => window.location.href = '/vault'}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-white text-sm bg-indigo-700 hover:bg-indigo-600 transition-all">
            View Database
          </button>
        </div>
      </div>
    </div>
  );
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
          {["BOM", "Parts list", "Supplier recommendations", "PDF", "Step-by-step instructions", "Build video"].map((item, i) => (
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

function MembershipGate({ invention }) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-4xl mx-auto mb-6">
          {invention?.icon || "🔒"}
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock size={16} className="text-indigo-400" />
          <span className="text-indigo-400 font-bold text-sm uppercase tracking-wider">Membership Required</span>
        </div>
        <h2 className="text-white font-black text-2xl mb-2">{invention?.title}</h2>
        <p className="text-gray-400 text-sm leading-relaxed italic mb-4">{invention?.tagline}</p>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          This invention build plan is available to members. Join to get full access to all build plans, step-by-step instructions, schematics, and downloadable PDFs.
        </p>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6 text-left space-y-2">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Membership includes:</p>
          {["All 21+ invention build plans", "Step-by-step instructions & BOMs", "Full course library (20+ courses)", "AI patent & IP tools", "Downloadable PDFs for every device"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 size={13} className="text-indigo-400 flex-shrink-0" />{item}
            </div>
          ))}
        </div>
        <Link to="/vault"
         className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-white text-sm bg-indigo-700 hover:bg-indigo-600 transition-all mb-3">
         View Database
        </Link>
        <p className="text-gray-600 text-xs">Already a member? <Link to="/account" className="text-indigo-400 hover:underline">Check your account</Link></p>
      </div>
    </div>
  );
}

function ClassifiedGate() {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-950/40 border-2 border-red-800 flex items-center justify-center text-4xl mx-auto mb-6">
          🔐
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield size={16} className="text-red-400" />
          <span className="text-red-400 font-black text-sm uppercase tracking-widest">Classified — Admin Only</span>
        </div>
        <h2 className="text-white font-black text-xl mb-3">Restricted Research Content</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          This device involves free energy or bioelectromagnetic treatment claims. Due to regulatory and liability considerations, full build plans for this device are restricted to platform administrators only.
        </p>
        <p className="text-gray-600 text-xs mt-4">If you believe you should have access, contact support@zenithapex.com</p>
      </div>
    </div>
  );
}

function NotForSaleGate({ invention }) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-4xl mx-auto mb-6">
          ⚖️
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield size={16} className="text-gray-400" />
          <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">Patented — Not for Sale</span>
        </div>
        <h2 className="text-white font-black text-xl mb-3">{invention?.title}</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          This invention is patented and protected under intellectual property law. Complete build plans are not available for public purchase or distribution.
        </p>
        <p className="text-gray-500 text-xs">For licensing inquiries, contact support@zenithapex.com</p>
      </div>
    </div>
  );
}

export default function InventionPlans() {
  const { tier } = useTier();
  const { isTrial } = useTrial();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasPdfGrant, setHasPdfGrant] = useState(false);
  const [selected, setSelected] = useState(inventions[0]);
  const [showBuildVideo, setShowBuildVideo] = useState(false);
  const [showBom, setShowBom] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingMaster, setGeneratingMaster] = useState(false);
  const [bomChecked, setBomChecked] = useState({});
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      if (!u) return;
      const admin = u.role === 'admin';
      setIsAdmin(admin);
      if (!admin) {
        // Check if this user has been granted PDF access by admin
        try {
          const grants = await base44.entities.PdfAccessGrant.filter({ email: u.email.toLowerCase(), active: true });
          setHasPdfGrant(grants && grants.length > 0);
        } catch {
          setHasPdfGrant(false);
        }
      }
    }).catch(() => {});
  }, []);

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
  const visual = inventionVisuals[selected?.title];

  // Per-invention BOM checklist state (keyed by invention title)
  const bomKey = selected?.title || "";
  const currentChecked = bomChecked[bomKey] || [];
  const handleBomToggle = useCallback((idx) => {
    setBomChecked(prev => {
      const arr = [...(prev[bomKey] || [])];
      arr[idx] = !arr[idx];
      return { ...prev, [bomKey]: arr };
    });
  }, [bomKey]);
  const handleBomReset = useCallback(() => {
    setBomChecked(prev => ({ ...prev, [bomKey]: [] }));
  }, [bomKey]);

  const handleDownload = async () => {
    if (!data || !selected) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 50));
    generatePDF(selected, data);
    setGenerating(false);
  };

  const handleBuyNow = async () => {
    if (!selected || checkoutLoading) return;
    
    // Block checkout in iframe
    if (window.self !== window.top) {
      alert("Checkout works best on the published app. Please visit the full website to complete your purchase.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const priceInCents = parseInt(selected.price?.replace(/[^\d]/g, "")) * 100 || 9999; // Default $99.99
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: selected.title,
        priceInCents,
        description: selected.tagline || selected.description,
        category: "Invention"
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    }
    setCheckoutLoading(false);
  };

  const selectedIndex = inventions.findIndex(i => i.title === selected?.title);
  const canViewSelected = tierCanAccessInvention(tier, selectedIndex);

  // Disable copy/paste for non-admins viewing plans
  useEffect(() => {
    if (!isAdmin) {
      const handleCopy = (e) => e.preventDefault();
      const handlePaste = (e) => e.preventDefault();
      const handleContextMenu = (e) => e.preventDefault();
      
      document.addEventListener("copy", handleCopy);
      document.addEventListener("paste", handlePaste);
      document.addEventListener("contextmenu", handleContextMenu);
      
      return () => {
        document.removeEventListener("copy", handleCopy);
        document.removeEventListener("paste", handlePaste);
        document.removeEventListener("contextmenu", handleContextMenu);
      };
    }
  }, [isAdmin]);

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden" style={!isAdmin ? { userSelect: "none" } : {}}>
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
          {isAdmin && (
            <button
              onClick={async () => {
                setGeneratingMaster(true);
                await new Promise(r => setTimeout(r, 80));
                const allInvs = businessItems.filter(i => i.category === "Invention");
                await generateMasterPDF(allInvs);
                setGeneratingMaster(false);
              }}
              disabled={generatingMaster}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold transition-all"
            >
              {generatingMaster ? <Loader2 size={14} className="animate-spin" /> : <BookOpen size={14} />}
              {generatingMaster ? "Building Master PDF…" : "📚 Master PDF (All Plans)"}
            </button>
          )}
          <button
            onClick={() => setShowBuildVideo(true)}
            disabled={!selected || !canViewSelected}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white text-sm font-semibold transition-all"
          >
            <Film size={14} /> 🎬 Build Video
          </button>
          <button
            onClick={() => {
              const canDownload = isAdmin || hasPdfGrant;
              if (!canDownload) {
                alert("PDF downloads require admin approval. Contact support to request access.");
                return;
              }
              if (isTrial && !isAdmin) { alert("Downloads are not available during the 24-hour trial. Upgrade to a paid plan."); return; }
              handleDownload();
            }}
            disabled={!data || generating || (!isAdmin && !hasPdfGrant)}
            title={(!isAdmin && !hasPdfGrant) ? "Admin approval required" : "Download PDF"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {generating ? "Generating PDF…" : (isAdmin || hasPdfGrant) ? "Download Plans PDF" : "PDF (Access Required)"}
          </button>
        </div>
      </div>

      {showBuildVideo && selected && canViewSelected && (
        <InventionBuildVideo
          invention={{
            name: selected.title,
            tagline: selected.tagline,
            category: selected.category,
            steps: inventionSteps[selected.title]?.steps?.map(s => ({
              title: s.title,
              description: s.detail,
              materials: [],
              tools: [],
              warning: s.warning || null,
            })) || [],
          }}
          onClose={() => setShowBuildVideo(false)}
        />
      )}

      {/* Main layout: sidebar + detail */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — invention list */}
        <div className="w-64 flex-shrink-0 border-r border-gray-800 overflow-y-auto bg-gray-900/40">
          {/* Access legend */}
          <div className="px-3 py-2 border-b border-gray-800 bg-gray-900/60 space-y-1">
            <div className="flex items-center gap-2 text-xs text-indigo-400"><Lock size={10} /> Available with membership or purchase</div>
          </div>
          {inventions.map((inv, i) => {
            const accessible = tierCanAccessInvention(tier, i);
            const adminOnly = isAdminOnly(inv.title);
            const govClassified = isClassifiedInvention(inv.title);
            const isSelected = selected?.title === inv.title;
            const isAdminLocked = adminOnly && !isAdmin;
            const isGovLocked = govClassified && !isAdmin && !tierHasGovAccess(tier);
            const memberLocked = isMembershipRequired(inv.title) && !isAdmin;
            const patentedNotForSale = isPatentedNotForSale(inv.title);
            // Trial users can only view the first invention (index 0)
            const trialLocked = isTrial && !isAdmin && i > 0;
            return (
              <button key={i} onClick={() => setSelected(inv)}
                className={`w-full text-left px-4 py-3 border-b border-gray-800/60 transition-all flex items-start gap-3 ${
                  isSelected ? "bg-gray-800/80 border-l-2 border-l-yellow-500" : "hover:bg-gray-800/30"
                }`}>
                <span className="text-xl flex-shrink-0 mt-0.5">{inv.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-snug truncate ${
                   trialLocked ? "text-gray-600" :
                   isAdminLocked ? "text-red-900" :
                   isGovLocked ? "text-red-400" :
                   memberLocked ? "text-gray-400" :
                   accessible ? "text-white" : "text-gray-600"
                  }`}>{inv.title}</p>
                  <p className="text-xs mt-0.5">
                   {trialLocked ? <span className="text-cyan-700">⏱ Trial — upgrade to unlock</span> :
                    isAdminLocked ? <span className="text-red-900">🔐 Admin Only</span> :
                    isGovLocked ? <span className="text-red-400">🏛 Gov/Defense Only</span> :
                    patentedNotForSale ? <span className="text-gray-500">⚖️ Not for Sale</span> :
                    memberLocked ? <span className="text-indigo-500">🔒 Membership or Purchase</span> :
                    <span className="text-gray-600">{inv.price}</span>}
                   {isDefenseRestricted(inv.title) && <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-red-900/40 border border-red-800 text-red-400">Defense Only</span>}
                  </p>
                </div>
                {trialLocked ? <Lock size={10} className="text-cyan-800 flex-shrink-0 mt-1" /> :
                 isAdminLocked ? <Shield size={10} className="text-red-700 flex-shrink-0 mt-1" /> :
                 isGovLocked ? <Shield size={10} className="text-red-400 flex-shrink-0 mt-1" /> :
                 memberLocked ? <Lock size={10} className="text-indigo-600 flex-shrink-0 mt-1" /> : null}
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-gray-700 text-sm">Select an invention</div>
          ) : (isTrial && !isAdmin && inventions.findIndex(i => i.title === selected.title) > 0) ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="max-w-md text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
                  style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)" }}>⏱</div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Lock size={16} className="text-cyan-400" />
                  <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider">24-Hour Trial — 1 Plan Included</span>
                </div>
                <h2 className="text-white font-black text-2xl mb-2">{selected.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Your trial pass includes access to the first invention build plan only. Upgrade to a paid plan to unlock all {inventions.length} invention build plans with full step-by-step instructions and downloadable PDFs.
                </p>
                <Link to="/vault"
                   className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-white text-sm transition-all"
                   style={{ background: "linear-gradient(135deg, #0EA5E9, #10B981)" }}>
                   Access the Database
                </Link>
              </div>
            </div>
          ) : (isMembershipRequired(selected.title) && !isAdmin) ? (
            <SpecsLockedGate invention={selected} />
          ) : (isAdminOnly(selected.title) && !isAdmin) ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="max-w-md text-center">
                <div className="w-20 h-20 rounded-2xl bg-red-950/40 border-2 border-red-800 flex items-center justify-center text-4xl mx-auto mb-6">🔐</div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Shield size={16} className="text-red-400" />
                  <span className="text-red-400 font-black text-sm uppercase tracking-widest">Restricted — Admin Only</span>
                </div>
                <h2 className="text-white font-black text-xl mb-3">Restricted Research Content</h2>
                <p className="text-gray-400 text-sm leading-relaxed">This device involves free energy or bioelectromagnetic treatment claims. Full build plans are restricted to platform administrators only.</p>
                <p className="text-gray-600 text-xs mt-4">Contact support@zenithapex.com for access inquiries.</p>
              </div>
            </div>
          ) : (isPatentedNotForSale(selected.title)) ? (
            <NotForSaleGate invention={selected} />
          ) : (isClassifiedInvention(selected.title) && !isAdmin && !tierHasGovAccess(tier)) ? (
            <GovClassifiedGate inventionTitle={selected.title} />
          ) : !canViewSelected ? (
            <SpecsLockedGate invention={selected} />
          ) : (
            <div className="max-w-3xl mx-auto">
              {/* ── Global Research Disclaimer ── */}
              <div className="bg-yellow-950/20 border border-yellow-800/50 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
                <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-700 leading-relaxed space-y-1">
                  <p><strong className="text-yellow-500">For research and educational purposes only.</strong> These build plans are derived from publicly available patents, peer-reviewed publications, and declassified government documents. No device described herein has been approved by the FDA, FCC, or any regulatory body for medical, therapeutic, commercial, or consumer use.</p>
                  <p>Do not use any device from these plans for diagnosis, treatment, or prevention of any disease or medical condition. Always consult a licensed professional before any experimental application.</p>
                </div>
              </div>
              <ResearchDisclaimer type="energy" />
              <AttributionFooter compact />
              <div className="mb-6">
                {itemImages[selected.title] && (
                  <div className="w-full h-52 rounded-2xl overflow-hidden mb-4 relative">
                    <img src={itemImages[selected.title]} alt={selected.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{selected.icon}</span>
                  <div>
                    <h2 className="text-white font-black text-2xl">{selected.title}</h2>
                    <p className="text-gray-400 text-sm italic">{selected.tagline}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mt-3">{selected.description}</p>
                {!isPatentedNotForSale(selected.title) && (
                  <button
                    onClick={handleBuyNow}
                    disabled={checkoutLoading}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-black text-sm transition-all"
                  >
                    {checkoutLoading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
                    {checkoutLoading ? "Processing..." : `Buy Now — ${selected.price || "$99.99"}`}
                  </button>
                )}
              </div>

              <VisualExplainer visual={visual} />

              {data ? (
                <>
                  {/* Overview */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                    <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">Technical Overview</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{data.overview}</p>
                  </div>

                  {/* BOM */}
                  {data.bom?.length > 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                      <button onClick={() => setShowBom(b => !b)}
                        className="flex items-center justify-between w-full mb-3">
                        <p className="text-yellow-400 font-bold text-xs uppercase tracking-wider">
                          Bill of Materials ({data.bom.length} items)
                        </p>
                        {showBom ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                      </button>
                      {showBom && (
                        <BomChecklist
                          bom={data.bom}
                          checked={currentChecked}
                          onToggle={handleBomToggle}
                          onReset={handleBomReset}
                        />
                      )}
                    </div>
                  )}

                  {/* Steps */}
                  {data.steps?.length > 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                      <button onClick={() => setShowSteps(s => !s)}
                        className="flex items-center justify-between w-full mb-4">
                        <p className="text-green-400 font-bold text-xs uppercase tracking-wider">Assembly Steps ({data.steps.length})</p>
                        {showSteps ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                      </button>
                      {showSteps && (
                        <div className="space-y-2">
                          {data.steps.map((step, i) => <StepCard key={i} step={step} index={i} />)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {data.notes && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                      <p className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">Technical Notes</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{data.notes}</p>
                    </div>
                  )}



                </>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                  <FileText size={32} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Detailed build plans coming soon for this device.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}