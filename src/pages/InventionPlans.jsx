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
import BuildKitUpsellPanel from "../components/BuildKitUpsellPanel";
import ComponentKitMarketplace from "../components/ComponentKitMarketplace";

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

const inventions = businessItems.filter(i => i.category === "Invention" && !isDefenseRestricted(i.title));

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

function generateMasterPDF(allInventions) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;
  let pageCount = 0;

  const wrapText = (text, maxW, fontSize) => {
    const words = String(text || "").split(" ");
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

  const newPage = () => {
    if (pageCount > 0) doc.addPage();
    pageCount++;
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, W, 297, "F");
    y = 20;
  };

  const checkPage = (needed = 20) => {
    if (y + needed > 278) newPage();
  };

  const section = (title, color = [148, 163, 184]) => {
    checkPage(18);
    doc.setFillColor(30, 41, 59);
    doc.rect(margin - 2, y - 5, contentW + 4, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...color);
    doc.text(title, margin, y + 1);
    y += 12;
  };

  const body = (text, color = [148, 163, 184], fs = 8.5) => {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fs);
    doc.setTextColor(...color);
    const lines = wrapText(text, contentW, fs);
    lines.forEach(ln => { checkPage(7); doc.text(ln, margin, y); y += 5.5; });
    y += 2;
  };

  const addFooterToAllPages = (total) => {
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFillColor(20, 20, 20);
      doc.rect(0, 287, W, 10, "F");
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text("C.O.D.E.X.T.E.C.H. — MASTER BUILD PLANS COMPENDIUM — ADMIN CONFIDENTIAL — NDA Applies — Do Not Distribute", margin, 293);
      doc.text(`${p} / ${total}`, W - margin, 293, { align: "right" });
    }
  };

  // ── MASTER COVER PAGE ──────────────────────────────────────────────────────
  pageCount++;
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, W, 4, "F");
  doc.rect(0, 293, W, 4, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("C.O.D.E.X.T.E.C.H. ZENITH APEX RESEARCH PLATFORM", margin, 22);
  doc.text("RESTRICTED — ADMIN ONLY — NDA ENFORCED", margin, 29);

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("MASTER BUILD PLANS", margin, 58);
  doc.text("COMPENDIUM", margin, 72);

  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  doc.text("Complete Engineering Documentation for All Invention Build Plans", margin, 84);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  const invWithData = allInventions.filter(inv => inventionSteps[inv.title]);
  doc.text(`${allInventions.length} total inventions  ·  ${invWithData.length} with full build plans  ·  Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin, 96);

  // Stats box
  doc.setFillColor(20, 20, 20);
  doc.rect(margin, 108, contentW, 40, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(239, 68, 68);
  doc.text("DOCUMENT CLASSIFICATION", margin + 4, 118);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("This document contains the complete engineering specifications, bills of materials, step-by-step build", margin + 4, 125);
  doc.text("instructions, software notes, and technical references for all invention build plans in the C.O.D.E.X.T.E.C.H.", margin + 4, 131);
  doc.text("platform. Distribution is strictly limited to authorized administrators. NDA applies in all jurisdictions.", margin + 4, 137);
  doc.text("Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident.", margin + 4, 143);

  // TOC
  y = 160;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TABLE OF CONTENTS", margin, y); y += 8;

  allInventions.forEach((inv, idx) => {
    if (y > 278) return; // cap TOC on cover
    const hasData = !!inventionSteps[inv.title];
    doc.setFontSize(8);
    doc.setFont("helvetica", hasData ? "normal" : "italic");
    doc.setTextColor(hasData ? 203 : 100, hasData ? 213 : 116, hasData ? 225 : 139);
    const label = `${idx + 1}. ${inv.title}${hasData ? "" : " (overview only)"}`;
    const truncated = label.length > 75 ? label.slice(0, 72) + "…" : label;
    doc.text(truncated, margin, y);
    y += 5;
  });

  // ── GLOBAL DISCLAIMER ─────────────────────────────────────────────────────
  newPage();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(251, 191, 36);
  doc.text("RESEARCH & EDUCATIONAL USE DISCLAIMER", margin, y); y += 10;

  const disclaimerText = "ALL DEVICES, PLANS, AND SPECIFICATIONS IN THIS COMPENDIUM ARE PROVIDED FOR RESEARCH AND EDUCATIONAL PURPOSES ONLY. No device described herein has been approved by the FDA, FCC, EPA, FTC, or any regulatory authority for medical, therapeutic, commercial, or consumer use. Do not use any device from these plans for diagnosis, treatment, cure, or prevention of any disease or medical condition. All claims regarding energy output, biological effects, or field phenomena are theoretical or experimental in nature and have not been independently verified by a regulatory body. Replicate at your own risk. Always consult a licensed professional before any experimental application. C.O.D.E.X.T.E.C.H. and Zenith Apex LLC assume no liability for use or misuse of these plans. All build plans are derived from publicly available patents, peer-reviewed scientific publications, and declassified government documents — sources are cited individually in each build plan section.";
  body(disclaimerText, [251, 191, 36], 9);

  y += 6;
  body("Primary Sources: Bearden T.E. (2002) Energy from the Vacuum, Cheniere Press. | Anastasovski P.K. et al. (2001) Found. Phys. Lett. 14(1). | U.S. Patent 6,362,718 (MEG). | Bateman J.B. (1978) ONR London Branch Report R-5-78. | Bohren C.F. (1983) Am. J. Phys. 51(4). | Kaznacheyev V.P. (1974–1982) Soviet cytopathogenic UV photon research. | Gray E.V. (1975) U.S. Patent 3,890,548. | Bearden T.E. (1991) Gravitobiology. | Aharonov Y. & Bohm D. (1959) Phys. Rev. 115(3). | Popp F.A. (1992) Biophotons, Kluwer Academic. | Rycroft M.J. et al. (2008) J. Atmos. Solar-Terrestrial Phys. 70(7). | Gurwitsch A.G. (1923) Arch. Entwicklungsmech. 100. | Waddington C.H. (1940) Organizers and Genes. Cambridge.", [148, 163, 184], 8);

  // ── EACH INVENTION ────────────────────────────────────────────────────────
  allInventions.forEach((inv, invIdx) => {
    const data = inventionSteps[inv.title];

    // Divider page for each invention
    newPage();
    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, W, 297, "F");
    doc.setFillColor(239, 68, 68);
    doc.rect(0, 0, W, 3, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(`INVENTION ${invIdx + 1} OF ${allInventions.length}`, margin, 28);

    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    const titleLines = wrapText(inv.title, contentW, 20);
    titleLines.forEach((ln, i) => doc.text(ln, margin, 42 + i * 10));

    const afterTitleY = 42 + titleLines.length * 10 + 4;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    const taglines = wrapText(`"${inv.tagline || ""}"`, contentW, 10);
    taglines.forEach((ln, i) => doc.text(ln, margin, afterTitleY + i * 6));

    let metaY = afterTitleY + taglines.length * 6 + 10;
    [["PRICE", inv.price], ["AUDIENCE", inv.audience], ["SOURCE", inv.source]].forEach(([lbl, val]) => {
      if (!val || metaY > 250) return;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text(lbl + ":", margin, metaY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      const vLines = wrapText(val, contentW - 20, 7.5);
      doc.text(vLines[0] || "", margin + 20, metaY);
      metaY += 7;
    });

    if (!data) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(71, 85, 105);
      doc.text("Full build plans in development — overview below.", margin, metaY + 10);
      newPage();
      section("DESCRIPTION", [148, 163, 184]);
      body(inv.description, [203, 213, 225]);
      if (inv.problem) { section("THE PROBLEM", [239, 68, 68]); body(inv.problem, [203, 213, 225]); }
      if (inv.beardenSolution) { section("SOLUTION", [59, 130, 246]); body(inv.beardenSolution, [203, 213, 225]); }
      if (inv.market) { section("MARKET OPPORTUNITY", [245, 158, 11]); body(inv.market, [203, 213, 225]); }
      return;
    }

    // Full build plan
    newPage();
    section("TECHNICAL OVERVIEW", [34, 197, 94]);
    body(data.overview, [203, 213, 225]);
    if (inv.problem) { section("THE PROBLEM", [239, 68, 68]); body(inv.problem, [203, 213, 225]); }
    if (inv.beardenSolution) { section("BEARDEN'S SOLUTION", [59, 130, 246]); body(inv.beardenSolution, [203, 213, 225]); }
    if (inv.market) { section("MARKET OPPORTUNITY", [245, 158, 11]); body(inv.market, [203, 213, 225]); }
    if (inv.feasibility) { section("FEASIBILITY", [168, 85, 247]); body(inv.feasibility, [203, 213, 225]); }

    // BOM
    if (data.bom?.length > 0) {
      checkPage(25);
      section("BILL OF MATERIALS", [6, 182, 212]);
      const colX = [margin, margin + 10, margin + 78, margin + 130];
      doc.setFillColor(30, 41, 59);
      doc.rect(margin - 2, y - 5, contentW + 4, 9, "F");
      ["Qty", "Item", "Specification", "Source"].forEach((h, i) => {
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(h, colX[i], y);
      });
      y += 6;
      data.bom.forEach((row, idx) => {
        checkPage(8);
        if (idx % 2 === 0) { doc.setFillColor(22, 33, 48); doc.rect(margin - 2, y - 3, contentW + 4, 8, "F"); }
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(34, 211, 238);
        doc.text(String(row.qty), colX[0], y + 1);
        doc.setFont("helvetica", "normal"); doc.setTextColor(203, 213, 225);
        doc.text(wrapText(row.item, 66, 7.5)[0] || "", colX[1], y + 1);
        doc.setTextColor(148, 163, 184);
        doc.text(wrapText(row.spec, 50, 7.5)[0] || "", colX[2], y + 1);
        doc.setTextColor(100, 116, 139);
        doc.text(wrapText(row.source, 40, 7.5)[0] || "", colX[3], y + 1);
        y += 8;
      });
      y += 4;
    }

    // Steps
    if (data.steps?.length > 0) {
      checkPage(20);
      section("STEP-BY-STEP BUILD INSTRUCTIONS", [255, 255, 255]);
      data.steps.forEach((step, si) => {
        checkPage(28);
        doc.setFillColor(30, 41, 59);
        doc.rect(margin - 2, y - 4, contentW + 4, 11, "F");
        doc.setFillColor(239, 68, 68);
        doc.circle(margin + 4.5, y + 1.5, 4, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(255, 255, 255);
        doc.text(String(si + 1), margin + 4.5, y + 3, { align: "center" });
        doc.setFontSize(9.5); doc.text(`Step ${si + 1}: ${step.title}`, margin + 11, y + 2);
        y += 12;
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(203, 213, 225);
        const dLines = wrapText(step.detail, contentW - 4, 8.5);
        dLines.forEach(ln => { checkPage(7); doc.text(ln, margin + 2, y); y += 5.5; });
        if (step.warning) {
          checkPage(18);
          y += 2;
          doc.setFillColor(40, 20, 0);
          doc.rect(margin, y, contentW, 1, "F"); y += 3;
          doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(251, 191, 36);
          doc.text("⚠ WARNING:", margin + 2, y);
          doc.setFont("helvetica", "normal"); doc.setTextColor(253, 224, 71);
          const wLines = wrapText(step.warning, contentW - 4, 7.5);
          wLines.forEach(ln => { checkPage(7); doc.text(ln, margin + 2, y + 5); y += 5; });
          y += 5;
        }
        y += 6;
      });
    }

    // Notes
    if (data.notes) { section("TECHNICAL NOTES", [148, 163, 184]); body(data.notes, [203, 213, 225]); }
    if (data.softwareNotes) { section("SOFTWARE & FIRMWARE", [34, 197, 94]); body(data.softwareNotes, [203, 213, 225]); }
    section("SOURCE CITATIONS", [245, 158, 11]);
    body(inv.source, [203, 213, 225]);
  });

  addFooterToAllPages(doc.getNumberOfPages());
  doc.save(`ZenithApex_MASTER_Build_Plans_Compendium_${new Date().toISOString().slice(0, 10)}.pdf`);
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
          <button onClick={() => window.location.href = '/pricing'}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-white text-sm bg-indigo-700 hover:bg-indigo-600 transition-all">
            View Membership Plans
          </button>
          <button onClick={() => window.location.href = '/pricing'}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm border border-indigo-700 text-indigo-400 hover:bg-indigo-900/20 transition-all">
            <ShoppingCart size={15} /> Buy This Plan — $49
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
        <Link to="/pricing"
         className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-white text-sm bg-indigo-700 hover:bg-indigo-600 transition-all mb-3">
         View Membership Plans
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
                generateMasterPDF(allInvs);
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
                <Link to="/pricing"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-white text-sm transition-all"
                  style={{ background: "linear-gradient(135deg, #0EA5E9, #10B981)" }}>
                  Upgrade for Full Access — from $47
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

                  {/* Component Kit Marketplace — direct purchase from plan page */}
                  {canViewSelected && (
                    <ComponentKitMarketplace
                      inventionTitle={selected.title}
                      inventionIcon={selected.icon}
                    />
                  )}

                  {/* Kit upsell — fires after user has seen the full build */}
                  <BuildKitUpsellPanel
                    buildTitle={selected.title}
                    kitPrice={287}
                    components={data?.bom?.slice(0, 5).map(b => `${b.qty}x ${b.item}`) || []}
                  />
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