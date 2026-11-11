// Generates a combined "Master Build Package" PDF for a single invention:
// cover, PRD, PDR, BOM, SOW, EVT/DVT/PVT test plan, build plan, cost-to-market.
import { jsPDF } from "jspdf";

const PAGE_W = 210, PAGE_H = 297, M = 16, CW = PAGE_W - M * 2;

function ensureSpace(doc, y, need = 20) {
  if (y + need > PAGE_H - 22) { doc.addPage(); return 20; }
  return y;
}

function footer(doc, idx, total, code) {
  doc.setFontSize(6.5);
  doc.setTextColor(90, 100, 120);
  doc.setFont("helvetica", "normal");
  doc.text("Research & educational use only — Not for Sale. Advisory estimates.", M, 290);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 50, 70);
  doc.text(`${code}  ·  ${idx} / ${total}`, PAGE_W - M, 290, { align: "right" });
}

function sectionHeader(doc, y, text, color = [6, 182, 212]) {
  y = ensureSpace(doc, y, 14);
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(M, y - 4, 3, 8, "F");
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(text.toUpperCase(), M + 6, y + 1.5);
  doc.setDrawColor(40, 50, 70);
  doc.setLineWidth(0.2);
  doc.line(M, y + 4, PAGE_W - M, y + 4);
  return y + 9;
}

function body(doc, y, text, size = 9) {
  if (!text) return y;
  doc.setTextColor(180, 195, 215);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  const lines = doc.splitTextToSize(text, CW);
  lines.forEach((l) => {
    y = ensureSpace(doc, y, 6);
    doc.text(l, M, y);
    y += 5.2;
  });
  return y + 2;
}

function bullets(doc, y, items, color = [6, 182, 212]) {
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  items.forEach((it) => {
    y = ensureSpace(doc, y, 7);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text("▸", M, y);
    doc.setTextColor(190, 205, 225);
    const lines = doc.splitTextToSize(it, CW - 6);
    lines.forEach((l, i) => doc.text(l, M + 5, y + i * 5));
    y += lines.length * 5 + 1.5;
  });
  return y;
}

function table(doc, y, headers, rows, colWidths) {
  y = ensureSpace(doc, y, 10);
  doc.setFillColor(30, 40, 60);
  doc.rect(M, y - 4, CW, 7, "F");
  doc.setTextColor(220, 230, 245);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  let x = M + 2;
  headers.forEach((h, i) => {
    doc.text(h, x, y + 1);
    x += colWidths[i];
  });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  rows.forEach((row, ri) => {
    y = ensureSpace(doc, y, 7);
    if (ri % 2 === 0) { doc.setFillColor(20, 28, 44); doc.rect(M, y - 3.5, CW, 6, "F"); }
    doc.setTextColor(180, 195, 215);
    x = M + 2;
    row.forEach((cell, i) => {
      const txt = String(cell ?? "");
      const lines = doc.splitTextToSize(txt, colWidths[i] - 4);
      doc.text(lines[0] || "", x, y + 1);
      x += colWidths[i];
    });
    y += 6;
  });
  return y + 2;
}

export function generateMasterBuildPackagePdf({ invention, prd, pdr, bom, sow, testPlan, buildPlan, cost }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const code = (invention.id || "INV").toUpperCase();
  const color = [6, 182, 212];
  let y = 20;

  // ── Cover ─────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, PAGE_W, 60, "F");
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("MASTER BUILD PACKAGE", M, 20);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(doc.splitTextToSize(invention.name, CW), M, 32);
  doc.setTextColor(150, 165, 185);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${code}  ·  ${invention.category}`, M, 42);
  doc.text(`Classification: Research Prototype — Not for Sale`, M, 48);
  y = 72;

  // Cost-to-market summary box on cover
  if (cost) {
    doc.setDrawColor(40, 50, 70);
    doc.setFillColor(20, 28, 44);
    doc.roundedRect(M, y, CW, 34, 2, 2, "FD");
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("COST TO BRING TO MARKET", M + 4, y + 6);
    const rows = [
      ["Materials", `$${cost.materials.toLocaleString()}`],
      ["Engineering labor (EVT/DVT, 2.5×)", `$${cost.labor.toLocaleString()}`],
      ["Build subtotal", `$${cost.buildTotal.toLocaleString()}`],
      ["Software / firmware dev", `$${cost.softwareDev.toLocaleString()}`],
      ["IRB / IACUC + regulatory", `$${cost.irbRegulatory.toLocaleString()}`],
      ["Pilot study (animal + first-in-human)", `$${cost.pilot.toLocaleString()}`],
      ["TOTAL TO BRING TO MARKET", `$${cost.toMarket.toLocaleString()}`],
    ];
    doc.setFontSize(8.5);
    let ry = y + 11;
    rows.forEach((r, i) => {
      const isTotal = i === rows.length - 1;
      doc.setTextColor(isTotal ? color[0] : 190, isTotal ? color[1] : 205, isTotal ? color[2] : 225);
      doc.setFont("helvetica", isTotal ? "bold" : "normal");
      doc.text(r[0], M + 6, ry);
      doc.text(r[1], M + CW - 6, ry, { align: "right" });
      ry += 3.6;
    });
    y += 40;
  }

  // ── PRD ────────────────────────────────────────────────────────
  if (prd) {
    y = sectionHeader(doc, y, `${prd.docId} — Product Requirements Document`);
    doc.setTextColor(120, 130, 150);
    doc.setFontSize(7.5);
    doc.text(`Rev ${prd.revision}  ·  ${prd.date}  ·  ${prd.classification}`, M, y);
    y += 5;
    prd.sections.forEach((s) => {
      y = body(doc, y, s.heading, 9.5);
      doc.setFont("helvetica", "bold"); doc.setTextColor(120, 200, 220);
      y = ensureSpace(doc, y, 6);
      doc.text(s.heading, M, y); y += 5;
      if (s.body) y = body(doc, y, s.body);
      if (s.bullets) y = bullets(doc, y, s.bullets);
    });
  }

  // ── PDR ───────────────────────────────────────────────────────
  if (pdr) {
    y = sectionHeader(doc, y, `${pdr.docId} — Preliminary Design Review`, [168, 85, 247]);
    pdr.sections.forEach((s) => {
      y = body(doc, y, s.heading, 9.5);
      doc.setFont("helvetica", "bold"); doc.setTextColor(200, 170, 240);
      y = ensureSpace(doc, y, 6);
      doc.text(s.heading, M, y); y += 5;
      if (s.body) y = body(doc, y, s.body);
      if (s.bullets) y = bullets(doc, y, s.bullets, [168, 85, 247]);
      if (s.table) {
        if (s.heading.includes("Subsystem")) {
          y = table(doc, y, ["Ref", "Subsystem", "Status", "Risk"], s.table.map(r => [r.ref, r.name, r.status, r.risk]), [16, CW - 56, 22, 18]);
        } else if (s.heading.includes("Risk")) {
          y = table(doc, y, ["Risk", "Severity", "Mitigation"], s.table.map(r => [r.risk, r.severity, r.mitigation]), [CW * 0.4, CW * 0.2, CW * 0.4]);
        }
      }
    });
  }

  // ── BOM ───────────────────────────────────────────────────────
  if (bom) {
    y = sectionHeader(doc, y, `${bom.docId} — Bill of Materials`, [249, 115, 22]);
    doc.setTextColor(150, 165, 185);
    doc.setFontSize(8);
    doc.text(`Line items: ${bom.summary.totalLineItems}  ·  Components: ${bom.summary.totalComponents}  ·  Est. cost: $${bom.summary.estimatedCost.toLocaleString()}`, M, y);
    y += 5;
    y = table(doc, y, ["#", "Ref", "Description", "Cat", "Qty", "Cost", "Supplier"],
      bom.items.map(it => [it.item, it.refDes, it.description.length > 48 ? it.description.slice(0, 45) + "..." : it.description, it.category.slice(0, 4), it.qty, `$${it.estCost}`, it.supplier.split(" ")[0]]),
      [10, 18, CW - 10 - 18 - 22 - 12 - 16 - 24, 22, 12, 16, 24]);
  }

  // ── SOW ───────────────────────────────────────────────────────
  if (sow) {
    y = sectionHeader(doc, y, `${sow.docId} — Statement of Work`, [34, 197, 94]);
    sow.sections.forEach((s) => {
      doc.setFont("helvetica", "bold"); doc.setTextColor(120, 230, 160);
      y = ensureSpace(doc, y, 6);
      doc.text(s.heading, M, y); y += 5;
      if (s.body) y = body(doc, y, s.body);
      if (s.bullets) y = bullets(doc, y, s.bullets, [34, 197, 94]);
      if (s.table) {
        if (s.heading.includes("WBS")) {
          y = table(doc, y, ["WBS", "Task", "Dur", "Deliverable"], s.table.map(r => [r.wbs, r.task.length > 50 ? r.task.slice(0, 47) + "..." : r.task, r.duration, r.deliverable.length > 40 ? r.deliverable.slice(0, 37) + "..." : r.deliverable]), [14, CW * 0.45, 20, CW * 0.35 - 14]);
        } else if (s.heading.includes("Timeline")) {
          y = table(doc, y, ["Phase", "Duration", "Budget"], s.table.map(r => [r.phase, r.duration, r.budget]), [CW * 0.3, CW * 0.3, CW * 0.4]);
        }
      }
    });
  }

  // ── EVT / DVT / PVT Test Plan ─────────────────────────────────
  if (testPlan) {
    y = sectionHeader(doc, y, `${testPlan.docId} — EVT / DVT / PVT Test Plan`, [239, 68, 68]);
    testPlan.sections.forEach((s) => {
      doc.setFont("helvetica", "bold"); doc.setTextColor(250, 130, 130);
      y = ensureSpace(doc, y, 6);
      doc.text(s.heading, M, y); y += 5;
      if (s.body) y = body(doc, y, s.body);
      if (s.table) {
        y = table(doc, y, ["Test", "Description", "Pass Criteria", "Status"],
          s.table.map(r => [r.test, r.description.length > 48 ? r.description.slice(0, 45) + "..." : r.description, r.pass.length > 40 ? r.pass.slice(0, 37) + "..." : r.pass, r.status]),
          [16, CW * 0.4, CW * 0.35, CW * 0.25 - 16]);
      }
    });
  }

  // ── Build Plan ────────────────────────────────────────────────
  if (buildPlan) {
    y = sectionHeader(doc, y, "Phased Build Plan", [245, 158, 11]);
    y = body(doc, y, buildPlan);
  }

  // ── Footers on every page ─────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    footer(doc, i, total, code);
  }

  doc.save(`ZARP-Master-Build-Package-${code}.pdf`);
}