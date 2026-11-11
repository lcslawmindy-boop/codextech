import { jsPDF } from "jspdf";
import { generatePRD, generatePDR, generateBOM, generateSOW, generateTestPlan } from "./inventionEngineeringSpecs";

const W = 210, H = 297, M = 16, CW = W - M * 2;
const WIDE_KEYS = /desc|task|deliverable|requirement|hypothesis|method|pass|criteria|risk|mitigation|test$/i;

function makeWriter(doc) {
  let y = 0;
  const labels = { 1: "" };
  let label = "";
  const page = () => doc.getNumberOfPages();
  const newPage = () => { doc.addPage(); labels[page()] = label; y = 22; };
  const check = (need) => { if (y + need > H - 16) newPage(); };
  const setLabel = (l) => { label = l; labels[page()] = l; };

  const w = {
    labels, setLabel, newPage,
    get y() { return y; }, set y(v) { y = v; },
    band(txt, rgb = [17, 24, 39]) {
      check(14);
      doc.setFillColor(...rgb); doc.rect(M - 2, y - 3, CW + 4, 9, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
      doc.text(txt, M, y + 3); y += 12;
    },
    h(txt) {
      check(9); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(17, 24, 39);
      doc.text(txt, M, y); y += 5.5;
    },
    p(txt, size = 8.5, indent = 0) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.setTextColor(40, 48, 60);
      doc.splitTextToSize(String(txt ?? ""), CW - indent).forEach((l) => { check(5); doc.text(l, M + indent, y); y += size * 0.46 + 1; });
      y += 1;
    },
    bullet(txt, size = 8.5) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.setTextColor(40, 48, 60);
      const lines = doc.splitTextToSize(String(txt), CW - 7);
      check(5); doc.text("•", M + 1, y);
      lines.forEach((l) => { check(5); doc.text(l, M + 6, y); y += size * 0.46 + 1; });
    },
    table(rows) {
      if (!rows?.length) return;
      const cols = Object.keys(rows[0]);
      const weights = cols.map((c) => (WIDE_KEYS.test(c) ? 3 : 1));
      const tw = weights.reduce((a, b) => a + b, 0);
      const cw = weights.map((x) => (x / tw) * CW);
      const header = () => {
        check(8); let x = M;
        cols.forEach((c, i) => {
          doc.setFillColor(226, 232, 240); doc.rect(x, y, cw[i], 6.5, "F");
          doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); doc.setTextColor(17, 24, 39);
          doc.text(c.toUpperCase(), x + 1.5, y + 4.4); x += cw[i];
        });
        y += 6.5;
      };
      header();
      rows.forEach((row) => {
        doc.setFont("helvetica", "normal"); doc.setFontSize(6.5);
        const cells = cols.map((c, i) => doc.splitTextToSize(String(row[c] ?? ""), cw[i] - 3));
        const rh = Math.max(...cells.map((c) => c.length)) * 3 + 2.5;
        if (y + rh > H - 16) { newPage(); header(); }
        let x = M;
        cells.forEach((lines, i) => {
          doc.setDrawColor(203, 213, 225); doc.rect(x, y, cw[i], rh);
          doc.setTextColor(40, 48, 60);
          lines.forEach((l, li) => doc.text(l, x + 1.5, y + 3.6 + li * 3));
          x += cw[i];
        });
        y += rh;
      });
      y += 3;
    },
    sections(secs) {
      secs.forEach((s) => {
        this.h(s.heading);
        if (s.body) this.p(s.body);
        if (s.bullets) s.bullets.forEach((b) => this.bullet(b));
        if (s.table) this.table(s.table);
        y += 2;
      });
    },
  };
  return w;
}

function renderDevice(doc, wr, dev, index, total) {
  const prd = generatePRD(dev), pdr = generatePDR(dev), bom = generateBOM(dev), sow = generateSOW(dev), test = generateTestPlan(dev);
  const short = dev.name.replace(/\s*\(.*\)$/, "");
  if (index > 0) wr.newPage();
  wr.setLabel(`${dev.id.toUpperCase()} — ${short}`);

  // Cover / document control
  wr.y = 50;
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text(`HYBRID DEVICE ${index + 1} OF ${total}`, W / 2, wr.y, { align: "center" }); wr.y += 10;
  doc.setFontSize(20); doc.setTextColor(17, 24, 39);
  doc.splitTextToSize(dev.name, CW - 20).forEach((l) => { doc.text(l, W / 2, wr.y, { align: "center" }); wr.y += 9; });
  wr.y += 4;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(71, 85, 105);
  doc.text("Engineering Development Package", W / 2, wr.y, { align: "center" }); wr.y += 6;
  doc.text("PRD · PDR · BOM · SOW · EVT / DVT / PVT", W / 2, wr.y, { align: "center" }); wr.y += 14;
  [
    `Source: ${dev.source}`,
    `Documents: ${prd.docId}, ${pdr.docId}, ${bom.docId}, ${sow.docId}, ${test.docId}`,
    "Revision B · 2026-11-10 · Classification: Research Prototype — Not for Sale",
  ].forEach((l) => { wr.p(l, 8.5); });
  wr.y += 4;
  wr.p("Status of claims: performance, mechanism and valuation statements below originate from AI-assisted concept generation and are UNVERIFIED HYPOTHESES. Each gate in this package includes control/sham conditions and a null-result path so that the program can confirm or refute them on measured evidence.", 8);

  // Device summary
  wr.newPage();
  wr.band("DEVICE SUMMARY");
  wr.h("Input technologies"); dev.inputNodes.forEach((n) => wr.bullet(n));
  wr.y += 2; wr.h("Concept fusion"); wr.p(dev.fusion);
  wr.h("Operating mechanism"); wr.p(dev.mechanism);
  wr.h("Draft patent claims (consult a patent attorney before filing)"); dev.patentClaims.forEach((c, i) => wr.bullet(`${i + 1}. ${c}`));
  wr.y += 2; wr.h("Market applications (advisory)"); wr.p(dev.market);
  wr.h("Valuation estimate (advisory, unverified)"); wr.p(dev.valuation);

  // PRD / PDR
  wr.newPage(); wr.band(`PRD — ${prd.docId} (Rev ${prd.revision})`, [30, 58, 95]); wr.sections(prd.sections);
  wr.newPage(); wr.band(`PDR — ${pdr.docId} (Rev ${pdr.revision})`, [30, 58, 95]); wr.sections(pdr.sections);

  // BOM
  wr.newPage(); wr.band(`BOM — ${bom.docId} (Rev ${bom.revision})`, [55, 48, 90]);
  wr.p(`${bom.summary.totalLineItems} line items · ${bom.summary.totalComponents} components · estimated unit cost $${(bom.summary.estimatedCost || 0).toLocaleString()} · categories: ${bom.summary.categories.join(", ")}`);
  wr.table(bom.items.map((it) => ({ Item: it.item, RefDes: it.refDes, Description: it.description, Category: it.category, Qty: it.qty, UoM: it.uom, "Est $": it.estCost, Supplier: it.supplier, "Lead time": it.leadTime, Notes: it.notes })));

  // SOW
  wr.newPage(); wr.band(`SOW — ${sow.docId} (Rev ${sow.revision})`, [90, 48, 48]); wr.sections(sow.sections);

  // EVT / DVT / PVT
  wr.newPage(); wr.band(`EVT / DVT / PVT TEST PLAN — ${test.docId} (Rev ${test.revision})`, [30, 80, 55]); wr.sections(test.sections);

  // Addendum
  wr.newPage(); wr.band("ADDENDUM A — HYPOTHESIS FALSIFICATION & GATES", [120, 53, 15]);
  wr.p("These tests run in EVT alongside the standard plan. Every test requires a sham/control condition, blinded analysis where applicable, pre-registered pass criteria, and a documented null-result outcome. A failed gate halts progression to DVT.");
  wr.table(dev.addendum.map((a) => ({ Test: a.test, Hypothesis: a.hypothesis, Method: a.method, "Pass criteria": a.pass })));
}

export function generateHybridDevPackagePdf(devices, filename) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const wr = makeWriter(doc);
  devices.forEach((d, i) => renderDevice(doc, wr, d, i, devices.length));

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor(100, 116, 139);
    doc.text("AETHON APEX IP — HYBRID DEVELOPMENT PACKAGE — CONFIDENTIAL", M, 10);
    doc.text(wr.labels[p] || "", W - M, 10, { align: "right" });
    doc.text("Research prototype. Not for medical use. Unverified concept claims.", M, H - 8);
    doc.text(`Page ${p} of ${total}`, W - M, H - 8, { align: "right" });
  }
  doc.save(filename);
  return total;
}