import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Package, Loader2, FileText, Lock, ShoppingCart, Lightbulb, Eye, Film, Shield, RotateCcw } from "lucide-react";
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
import BuildUpsellPanel from "../components/BuildUpsellPanel";

// Legacy admin-only gate (free energy / medical claims — still admin-only)
const ADMIN_ONLY_KEYWORDS = ["motionless electromagnetic generator", "prioré-type multichannel"];
const isAdminOnly = (title) => ADMIN_ONLY_KEYWORDS.some(k => title?.toLowerCase().includes(k.toLowerCase()));

// All inventions require membership or purchase
const isMembershipRequired = (title) => !isAdminOnly(title);

// Defense/restricted licensing inventions (hidden from public)
const DEFENSE_RESTRICTED = [
  "Time-Reversal Zone Cold Fusion Reactor",
  "Aegis-SV Adaptive Scalar Counterphase Shield",
  "Atmospheric Scalar EM Signature Recognition System",
  "T-Polarized EM Wave Transducer",
  "Waddington Valley EM Tracer System",
  "Cloning Efficiency Enhancement System",
  "Kaznacheyev Reversal Cell Imprinting Chamber (KRCIC)",
  "UV Biophoton Disease Reversal Spectrometer",
  "Telomere Regeneration Device (TRD-1)",
  "Portable Porthole Disease Treatment System",
  "Psychoenergetics Cellular Control System"
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
  const [selected, setSelected] = useState(inventions[0]);
  const [showBuildVideo, setShowBuildVideo] = useState(false);
  const [showBom, setShowBom] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [bomChecked, setBomChecked] = useState({});
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
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
          <button
            onClick={() => setShowBuildVideo(true)}
            disabled={!selected || !canViewSelected}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white text-sm font-semibold transition-all"
          >
            <Film size={14} /> 🎬 Build Video
          </button>
          <button
            onClick={() => {
              if (!isAdmin && !hasPurchased) {
                alert("PDF downloads are only available after purchase. Visit /checkout to buy this plan.");
                return;
              }
              if (isTrial && !isAdmin) { alert("Downloads are not available during the 24-hour trial. Upgrade to a paid plan."); return; }
              handleDownload();
            }}
            disabled={!data || generating || (!isAdmin && !hasPurchased)}
            title={!isAdmin && !hasPurchased ? "Purchase required to download" : "Download"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {generating ? "Generating PDF…" : "Download Plans PDF"}
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

                  {/* Kit upsell — fires after user has seen the full build */}
                  <BuildUpsellPanel trigger="after_build" />
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