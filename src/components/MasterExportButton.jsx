import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { NEW_INVENTIONS } from "../lib/newInventions";
import { generatePRD, generatePDR, generateBOM, generateSOW, generateTestPlan } from "../lib/inventionEngineeringSpecs";

// Split 50 inventions into 3 volumes: 17 + 17 + 16
const VOLUMES = [
  { num: 1, start: 0, end: 17, label: "Inventions 1–17" },
  { num: 2, start: 17, end: 34, label: "Inventions 18–34" },
  { num: 3, start: 34, end: 50, label: "Inventions 35–50" },
];

const MAX_PAGES = 100;

function buildVolumePDF(inventions, volumeNum, volumeLabel, progressCb) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297, margin = 18, cW = W - margin * 2;
  let y = 0, page = 0;

  const addPage = () => {
    if (page > 0) doc.addPage();
    page++;
    doc.setFillColor(8, 10, 15);
    doc.rect(0, 0, W, H, "F");
    doc.setFillColor(20, 25, 35);
    doc.rect(0, 0, W, 14, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 200, 255);
    doc.text("ZENITH APEX RESEARCH PORTFOLIO", margin, 6);
    doc.text(`MASTER EXPORT — VOLUME ${volumeNum} OF 3`, W - margin, 6, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(100, 110, 130);
    doc.text("CONFIDENTIAL — NDA APPLIES — NOT FOR DISTRIBUTION — RESEARCH ONLY", W / 2, 11, { align: "center" });
    doc.setFontSize(6);
    doc.setTextColor(80, 90, 110);
    doc.text(`Page ${page}`, W - margin, H - 6, { align: "right" });
    doc.text("© 2026 Zenith Apex — Fair Use (17 U.S.C. § 107)", margin, H - 6);
    y = 22;
  };

  const check = (need = 10) => { if (y + need > H - 12) addPage(); };

  const sectionBand = (txt, color = [40, 50, 70]) => {
    check(14);
    doc.setFillColor(...color);
    doc.rect(margin - 2, y - 2, cW + 4, 10, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 220, 255);
    doc.text(txt, margin, y + 4);
    y += 12;
  };

  const heading = (txt, size = 10) => {
    check(8);
    doc.setFontSize(size);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 230, 245);
    doc.text(txt, margin, y);
    y += size * 0.5 + 2;
  };

  const body = (txt, size = 8, indent = 0) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(170, 180, 200);
    const lines = doc.splitTextToSize(txt, cW - indent);
    lines.forEach(line => {
      check(size * 0.45 + 1);
      doc.text(line, margin + indent, y);
      y += size * 0.45 + 1;
    });
  };

  const bullet = (txt, size = 8) => {
    check(size * 0.45 + 1);
    doc.setFontSize(size);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(170, 180, 200);
    const lines = doc.splitTextToSize(txt, cW - 8);
    doc.text("•", margin, y);
    lines.forEach((line, i) => {
      if (i > 0) check(size * 0.45 + 1);
      doc.text(line, margin + 5, y);
      y += size * 0.45 + 1;
    });
  };

  const table = (rows, colWidths) => {
    if (!rows.length) return;
    const cols = Object.keys(rows[0]);
    const totalW = colWidths.reduce((a, b) => a + b, 0);
    const scale = cW / totalW;
    const scaledW = colWidths.map(w => w * scale);
    check(8);
    doc.setFillColor(30, 38, 52);
    let x = margin;
    cols.forEach((col, i) => {
      doc.rect(x, y, scaledW[i], 7, "F");
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(150, 200, 255);
      doc.text(col.toUpperCase(), x + 1.5, y + 5);
      x += scaledW[i];
    });
    y += 7;
    rows.forEach((row, ri) => {
      check(7);
      doc.setFillColor(ri % 2 === 0 ? 15 : 18, ri % 2 === 0 ? 18 : 22, ri % 2 === 0 ? 24 : 30);
      x = margin;
      cols.forEach((col, i) => {
        doc.rect(x, y, scaledW[i], 6, "F");
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(160, 175, 195);
        const val = String(row[col] ?? "");
        const lines = doc.splitTextToSize(val, scaledW[i] - 3);
        doc.text(lines[0] || "", x + 1.5, y + 4.5);
        x += scaledW[i];
      });
      y += 6;
    });
    y += 3;
  };

  // ── COVER PAGE ──
  addPage();
  y = 50;
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 200, 255);
  doc.text("MASTER ENGINEERING", W / 2, y, { align: "center" });
  y += 13;
  doc.text(`EXPORT — VOLUME ${volumeNum}`, W / 2, y, { align: "center" });
  y += 18;
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 200, 230);
  doc.text(volumeLabel, W / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(120, 140, 170);
  doc.text(`${inventions.length} Inventions — PRD · PDR · BOM · SOW · Test Plans`, W / 2, y, { align: "center" });
  y += 16;
  doc.setDrawColor(60, 80, 110);
  doc.setLineWidth(0.3);
  doc.line(margin + 30, y, W - margin - 30, y);
  y += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(150, 200, 255);
  doc.text("DOCUMENT CONTROL", W / 2, y, { align: "center" });
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(140, 155, 180);
  const docInfo = [
    `Document ID: ZA-MASTER-EXPORT-VOL${volumeNum}-001`,
    "Revision: A",
    "Date: 2026-08-13",
    "Classification: Research Prototype — Not for Sale",
    "Program: Zenith Apex Research Portfolio",
    `Volume: ${volumeNum} of 3 (${volumeLabel})`,
    `Inventions in this volume: ${inventions.length}`,
    "Max pages per volume: 100",
  ];
  docInfo.forEach(line => {
    check(6);
    doc.text(line, W / 2, y, { align: "center" });
    y += 6;
  });
  y += 8;
  doc.setFontSize(7);
  doc.setTextColor(100, 110, 130);
  const disclaimer = "All concepts are derived from published works attributed to their original authors and the Vedic/Sanskrit textual tradition. Research prototypes — not for clinical use without IRB approval and 510(k) clearance. Not for sale. Fair Use (17 U.S.C. § 107).";
  const dLines = doc.splitTextToSize(disclaimer, cW - 40);
  dLines.forEach(line => { check(4); doc.text(line, W / 2, y, { align: "center" }); y += 4; });

  // ── TABLE OF CONTENTS ──
  addPage();
  sectionBand(`TABLE OF CONTENTS — VOLUME ${volumeNum} (${volumeLabel})`);
  inventions.forEach((inv, i) => {
    check(6);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 200, 255);
    doc.text(inv.id.toUpperCase(), margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 195, 215);
    const nameLines = doc.splitTextToSize(inv.name, cW - 50);
    doc.text(nameLines[0], margin + 22, y);
    doc.setFontSize(6);
    doc.setTextColor(100, 115, 140);
    doc.text(inv.category, W - margin, y, { align: "right" });
    y += 5.5;
  });

  // ── PER-INVENTION DETAIL ──
  for (let i = 0; i < inventions.length; i++) {
    const inv = inventions[i];
    const prd = generatePRD(inv);
    const pdr = generatePDR(inv);
    const bom = generateBOM(inv);
    const sow = generateSOW(inv);
    const testPlan = generateTestPlan(inv);

    addPage();
    y = 30;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 200, 255);
    doc.text(inv.id.toUpperCase(), margin, y);
    doc.text(inv.category, W - margin, y, { align: "right" });
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(220, 235, 255);
    const titleLines = doc.splitTextToSize(inv.name, cW);
    titleLines.forEach(line => { check(8); doc.text(line, margin, y); y += 8; });
    y += 4;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(140, 160, 190);
    const fusionLines = doc.splitTextToSize(`Fusion: ${inv.fusion}`, cW);
    fusionLines.forEach(line => { check(5); doc.text(line, margin, y); y += 5; });
    y += 6;

    check(20);
    doc.setFillColor(20, 28, 40);
    doc.rect(margin, y, cW, 18, "F");
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 200, 255);
    doc.text("SUBSYSTEMS", margin + 4, y + 5);
    doc.text("PATENT CLAIMS", margin + cW / 4, y + 5);
    doc.text("BOM ITEMS", margin + cW / 2, y + 5);
    doc.text("DIGITAL PRODUCTS", margin + 3 * cW / 4, y + 5);
    doc.setFontSize(10);
    doc.setTextColor(220, 235, 255);
    doc.text(String(inv.components.length), margin + 4, y + 11);
    doc.text(String(inv.patentClaims.length), margin + cW / 4, y + 11);
    doc.text(String(bom.summary.totalLineItems), margin + cW / 2, y + 11);
    doc.text(String(inv.digitalProducts.length), margin + 3 * cW / 4, y + 11);
    y += 24;

    sectionBand(`PRD — ${prd.docId} (Rev ${prd.revision})`, [50, 30, 30]);
    prd.sections.forEach(sec => {
      heading(sec.heading);
      if (sec.body) body(sec.body);
      if (sec.bullets) sec.bullets.forEach(b => bullet(b));
      if (sec.table) table(sec.table, sec.table[0] && sec.table[0].wbs ? [20, 60, 25, 35] : [25, 50, 25]);
      y += 2;
    });

    sectionBand(`PDR — ${pdr.docId} (Rev ${pdr.revision})`, [30, 50, 30]);
    pdr.sections.forEach(sec => {
      heading(sec.heading);
      if (sec.body) body(sec.body);
      if (sec.bullets) sec.bullets.forEach(b => bullet(b));
      if (sec.table) {
        if (sec.heading.includes("Subsystem")) table(sec.table, [20, 70, 30, 20]);
        else if (sec.heading.includes("Risk")) table(sec.table, [60, 20, 50]);
        else table(sec.table, [20, 70, 30, 20]);
      }
      y += 2;
    });

    sectionBand(`BOM — ${bom.docId} (Rev ${bom.revision})`, [30, 30, 50]);
    heading(`Summary: ${bom.summary.totalLineItems} line items, ${bom.summary.totalComponents} total components`);
    body(`Categories: ${bom.summary.categories.join(", ")}`);
    y += 2;
    table(bom.items.map(it => ({
      Item: it.item, Ref: it.refDes, Description: it.description.slice(0, 50),
      Cat: it.category, Qty: it.qty, Notes: it.notes,
    })), [12, 22, 55, 25, 12, 25]);

    sectionBand(`SOW — ${sow.docId} (Rev ${sow.revision})`, [50, 30, 30]);
    sow.sections.forEach(sec => {
      heading(sec.heading);
      if (sec.body) body(sec.body);
      if (sec.bullets) sec.bullets.forEach(b => bullet(b));
      if (sec.table) {
        if (sec.heading.includes("Timeline")) table(sec.table, [30, 40, 40]);
        else if (sec.heading.includes("WBS")) table(sec.table, [15, 55, 25, 35]);
        else table(sec.table, [30, 50, 30]);
      }
      y += 2;
    });

    sectionBand(`TEST PLAN — ${testPlan.docId} (Rev ${testPlan.revision})`, [30, 50, 30]);
    testPlan.sections.forEach(sec => {
      heading(sec.heading);
      if (sec.body) body(sec.body);
      if (sec.table) table(sec.table, [18, 60, 40, 25]);
      y += 2;
    });

    progressCb?.(Math.round((i / inventions.length) * 100));
  }

  // ── APPENDIX ──
  addPage();
  sectionBand(`APPENDIX — VOLUME ${volumeNum} SUMMARY MATRIX`);
  const matrix = inventions.map(inv => ({
    ID: inv.id.toUpperCase(),
    Name: inv.name.slice(0, 35),
    Category: inv.category.slice(0, 20),
    Subs: inv.components.length,
    Claims: inv.patentClaims.length,
    Tags: inv.tags.slice(0, 3).join(", ").slice(0, 25),
  }));
  table(matrix, [18, 55, 35, 12, 12, 30]);
  y += 8;
  heading("Attribution & Fair Use Notice");
  body("All concepts derived from published works attributed to original authors (Bearden, Prioré, Rife, Reich, Schauberger, et al.) and Vedic/Sanskrit tradition. Research prototypes — not for clinical use without IRB approval and 510(k) clearance. Not for sale. Fair Use (17 U.S.C. § 107).", 7);

  const totalPages = doc.getNumberOfPages();
  doc.save(`Zenith_Apex_Master_Export_Vol${volumeNum}_${volumeLabel.replace(/[^\d]/g, "_")}.pdf`);
  return totalPages;
}

export default function MasterExportButton() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const generateAllVolumes = async () => {
    setGenerating(true);
    setProgress(0);
    setStatus("Starting...");
    await new Promise(r => setTimeout(r, 50));

    const results = [];
    for (let v = 0; v < VOLUMES.length; v++) {
      const vol = VOLUMES[v];
      const inventions = NEW_INVENTIONS.slice(vol.start, vol.end);
      setStatus(`Volume ${vol.num}/3 — ${vol.label}`);
      setProgress(Math.round((v / VOLUMES.length) * 100));
      await new Promise(r => setTimeout(r, 30));

      const pages = buildVolumePDF(inventions, vol.num, vol.label, (p) => {
        setProgress(Math.round((v / VOLUMES.length) * 100 + (p / VOLUMES.length)));
      });
      results.push({ volume: vol.num, label: vol.label, pages });

      await new Promise(r => setTimeout(r, 100));
    }

    setProgress(100);
    setStatus(`Done — 3 PDFs generated`);
    setGenerating(false);
    setTimeout(() => { setProgress(0); setStatus(""); }, 3000);
  };

  return (
    <button
      onClick={generateAllVolumes}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/30"
    >
      {generating ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {progress < 100 ? `${status} ${progress}%` : "Complete!"}
        </>
      ) : (
        <>
          <Download size={16} />
          Master Export (3 Volumes)
        </>
      )}
    </button>
  );
}