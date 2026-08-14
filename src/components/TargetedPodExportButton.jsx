import { useState } from "react";
import { Download, Loader2, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { generateAllSpecs } from "../lib/targetedPodSpecs";

export default function TargetedPodExportButton({ pod }) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const color = pod.color;

  const generatePDF = async () => {
    setGenerating(true);
    setProgress(0);
    await new Promise(r => setTimeout(r, 50));

    const specs = generateAllSpecs(pod);
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210, H = 297, margin = 18, cW = W - margin * 2;
    let y = 0, page = 0;
    const color = pod.color;

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
      doc.text(`${pod.designation} — ENGINEERING BUILD PLAN`, W - margin, 6, { align: "right" });
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

    const sectionBand = (txt) => {
      check(14);
      doc.setFillColor(40, 50, 70);
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

    const renderDoc = (title, d, bandColor) => {
      sectionBand(title);
      d.sections.forEach(sec => {
        heading(sec.heading);
        if (sec.body) body(sec.body);
        if (sec.bullets) sec.bullets.forEach(b => bullet(b));
        if (sec.table) {
          const keys = Object.keys(sec.table[0] || {});
          if (keys.length === 4) table(sec.table, [25, 60, 25, 25]);
          else if (keys.length === 3) table(sec.table, [40, 40, 40]);
          else if (keys.length === 5) table(sec.table, [20, 50, 20, 20, 20]);
          else table(sec.table, keys.map(() => cW / keys.length));
        }
        y += 2;
      });
    };

    // ── COVER ──
    addPage();
    y = 50;
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 200, 255);
    doc.text("ENGINEERING BUILD", W / 2, y, { align: "center" });
    y += 13;
    doc.text("PLAN", W / 2, y, { align: "center" });
    y += 16;
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 200, 230);
    const nameLines = doc.splitTextToSize(pod.name, cW);
    nameLines.forEach(l => { doc.text(l, W / 2, y, { align: "center" }); y += 8; });
    y += 6;
    doc.setFontSize(11);
    doc.setTextColor(120, 140, 170);
    doc.text(`${pod.designation} · ${pod.condition}`, W / 2, y, { align: "center" });
    y += 8;
    doc.setFontSize(9);
    doc.text("PRD · PDR · BOM · SOW · EVT · DVT · Valuation · Commercialization", W / 2, y, { align: "center" });
    y += 14;
    doc.setDrawColor(60, 80, 110);
    doc.setLineWidth(0.3);
    doc.line(margin + 30, y, W - margin - 30, y);
    y += 10;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150, 200, 255);
    doc.text("DOCUMENT CONTROL", W / 2, y, { align: "center" });
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 155, 180);
    const info = [
      `Document ID: ${pod.designation}-MASTER-001`,
      "Revision: A",
      "Date: 2026-08-14",
      "Classification: Research Prototype — Not for Sale",
      `Condition: ${pod.condition}`,
      `Safety Class: ${specs.prd.sections.find(s => s.heading.includes("Regulatory"))?.body || "Class II"}`,
      "Total Technologies: " + (9 + pod.inventions.length + pod.vedic.length + pod.suppressed.length + pod.consciousness.length),
      "Documents: PRD + PDR + BOM + SOW + EVT + DVT + Valuation + Commercialization",
    ];
    info.forEach(line => { check(6); doc.text(line, W / 2, y, { align: "center" }); y += 6; });
    y += 6;
    doc.setFontSize(7);
    doc.setTextColor(100, 110, 130);
    const disc = "Research prototype — not for clinical use without IRB approval and 510(k) clearance. Not for sale. Fair Use (17 U.S.C. § 107).";
    const dLines = doc.splitTextToSize(disc, cW - 40);
    dLines.forEach(l => { check(4); doc.text(l, W / 2, y, { align: "center" }); y += 4; });

    // ── TOC ──
    addPage();
    sectionBand("TABLE OF CONTENTS");
    const toc = ["PRD — Product Requirements Document", "PDR — Preliminary Design Review", "BOM — Bill of Materials", "SOW — Statement of Work", "EVT — Engineering Validation Test", "DVT — Design Validation Test", "Valuation — IP & Revenue", "Commercialization — Roadmap & Strategy"];
    toc.forEach(t => { check(6); doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 200, 255); doc.text(t, margin, y); y += 6; });

    // ── Documents ──
    renderDoc(`PRD — ${specs.prd.docId} (Rev ${specs.prd.revision})`, specs.prd);
    setProgress(12);
    await new Promise(r => setTimeout(r, 10));

    renderDoc(`PDR — ${specs.pdr.docId} (Rev ${specs.pdr.revision})`, specs.pdr);
    setProgress(25);
    await new Promise(r => setTimeout(r, 10));

    // BOM
    sectionBand(`BOM — ${specs.bom.docId} (Rev ${specs.bom.revision})`);
    heading(`Summary: ${specs.bom.summary.totalLineItems} line items, ${specs.bom.summary.totalComponents} total components`);
    body(`Categories: ${specs.bom.summary.categories.join(", ")}`);
    y += 2;
    table(specs.bom.items.map(it => ({
      Ref: it.refDes, Item: it.item, Cat: it.category, Qty: it.qty, Description: it.description.slice(0, 45), Notes: it.notes,
    })), [16, 35, 18, 8, 45, 25]);
    setProgress(40);
    await new Promise(r => setTimeout(r, 10));

    renderDoc(`SOW — ${specs.sow.docId} (Rev ${specs.sow.revision})`, specs.sow);
    setProgress(55);
    await new Promise(r => setTimeout(r, 10));

    renderDoc(`EVT — ${specs.evt.docId} (Rev ${specs.evt.revision})`, specs.evt);
    setProgress(68);
    await new Promise(r => setTimeout(r, 10));

    renderDoc(`DVT — ${specs.dvt.docId} (Rev ${specs.dvt.revision})`, specs.dvt);
    setProgress(80);
    await new Promise(r => setTimeout(r, 10));

    renderDoc(`VALUATION — ${specs.valuation.docId} (Rev ${specs.valuation.revision})`, specs.valuation);
    setProgress(90);
    await new Promise(r => setTimeout(r, 10));

    renderDoc(`COMMERCIALIZATION — ${specs.commercialization.docId} (Rev ${specs.commercialization.revision})`, specs.commercialization);

    // Footer page numbers
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 90, 110);
      doc.text(`Page ${p} of ${total}`, W - margin, H - 6, { align: "right" });
    }

    doc.save(`${pod.designation}_Engineering_Build_Plan.pdf`);
    setProgress(100);
    setGenerating(false);
    setTimeout(() => setProgress(0), 2000);
  };

  return (
    <button
      onClick={generatePDF}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 4px 20px ${color}40` }}
    >
      {generating ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {progress < 100 ? `Generating... ${progress}%` : "Complete!"}
        </>
      ) : (
        <>
          <Download size={16} />
          Export Build Plan (PDF)
        </>
      )}
    </button>
  );
}