import { jsPDF } from "jspdf";
import {
  DEVICE, PRD_SECTIONS, PDR_SECTIONS, BOM_ITEMS, BOM_SUMMARY,
  SOW_SECTIONS, EVT_SECTIONS, DVT_SECTIONS, FALSIFICATION_TESTS,
} from "./prenatalPodSpecs";

const W = 210, H = 297, M = 16, CW = W - M * 2;
const WIDE = /req|task|deliverable|requirement|hypothesis|method|pass|criteria|risk|mitigation|test|role|desc|description|notes/i;

function makeWriter(doc) {
  let y = 0;
  const labels = { 1: "" };
  let label = "";
  const page = () => doc.getNumberOfPages();
  const newPage = () => { doc.addPage(); labels[page()] = label; y = 22; };
  const check = (need) => { if (y + need > H - 16) newPage(); };
  const setLabel = (l) => { label = l; labels[page()] = l; };

  return {
    labels, setLabel, newPage, get y() { return y; }, set y(v) { y = v; },
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
      const weights = cols.map((c) => (WIDE.test(c) ? 3 : 1));
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
}

export function generatePrenatalPodPdf() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const wr = makeWriter(doc);

  wr.setLabel(`${DEVICE.docId} — COVER`);
  wr.y = 50;
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text("PRENATAL REPAIR POD (NRC-P) — ENGINEERING DEVELOPMENT PACKAGE", W / 2, wr.y, { align: "center" }); wr.y += 12;
  doc.setFontSize(22); doc.setTextColor(17, 24, 39);
  doc.splitTextToSize(DEVICE.name, CW - 20).forEach((l) => { doc.text(l, W / 2, wr.y, { align: "center" }); wr.y += 10; });
  wr.y += 4;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(71, 85, 105);
  doc.text("PRD · PDR · BOM · SOW · EVT · DVT", W / 2, wr.y, { align: "center" }); wr.y += 14;
  [
    `Document set: ${DEVICE.docId} · Revision ${DEVICE.revision} · ${DEVICE.date}`,
    `Classification: ${DEVICE.classification}`,
    "Pediatric investigational device — no human use without IRB (pediatric expertise) + IND/IMD clearance.",
  ].forEach((l) => { wr.p(l, 8.5); });
  wr.y += 6;
  wr.p("Status of claims: autism is a neurodevelopmental difference, not 'damage to reverse'. No device reverses or repairs brain damage. This package describes adjunctive support of dysregulation linked to prenatal injury. Speculative subsystems (wave-genome, scalar EM, DNA 'reprogramming') are IN-VITRO ONLY with sham-controlled falsification gates and are never applied to a child.", 8);

  wr.newPage(); wr.band("DEVICE SUMMARY");
  wr.h("Concept"); wr.p(DEVICE.summary);

  wr.newPage(); wr.setLabel(`${DEVICE.docId} — PRD`);
  wr.band(`PRD — ${DEVICE.docId}-PRD (Rev ${DEVICE.revision})`, [30, 58, 95]);
  wr.sections(PRD_SECTIONS);

  wr.newPage(); wr.setLabel(`${DEVICE.docId} — PDR`);
  wr.band(`PDR — ${DEVICE.docId}-PDR (Rev ${DEVICE.revision})`, [30, 58, 95]);
  wr.sections(PDR_SECTIONS);

  wr.newPage(); wr.setLabel(`${DEVICE.docId} — BOM`);
  wr.band(`BOM — ${DEVICE.docId}-BOM (Rev ${DEVICE.revision})`, [55, 48, 90]);
  wr.p(`${BOM_SUMMARY.totalLineItems} line items · ${BOM_SUMMARY.totalComponents} components · estimated unit cost $${BOM_SUMMARY.estimatedCost.toLocaleString()} · categories: ${BOM_SUMMARY.categories.join(", ")}`);
  wr.table(BOM_ITEMS.map((it) => ({ Item: it.item, Ref: it.refDes, Description: it.description, Cat: it.category, Qty: it.qty, UoM: it.uom, "$": it.estCost, Supplier: it.supplier, Lead: it.leadTime, Notes: it.notes })));

  wr.newPage(); wr.setLabel(`${DEVICE.docId} — SOW`);
  wr.band(`SOW — ${DEVICE.docId}-SOW (Rev ${DEVICE.revision})`, [90, 48, 48]);
  wr.sections(SOW_SECTIONS);

  wr.newPage(); wr.setLabel(`${DEVICE.docId} — EVT`);
  wr.band(`EVT TEST PLAN — ${DEVICE.docId}-EVT (Rev ${DEVICE.revision})`, [30, 80, 55]);
  wr.sections(EVT_SECTIONS);

  wr.newPage(); wr.setLabel(`${DEVICE.docId} — DVT`);
  wr.band(`DVT TEST PLAN — ${DEVICE.docId}-DVT (Rev ${DEVICE.revision})`, [30, 80, 55]);
  wr.sections(DVT_SECTIONS);

  wr.newPage(); wr.setLabel(`${DEVICE.docId} — ADDENDUM`);
  wr.band("ADDENDUM A — HYPOTHESIS FALSIFICATION & PEDIATRIC GATES", [120, 53, 15]);
  wr.p("Every speculative test requires a sham/control condition, blinded analysis, pre-registered pass criteria, and a documented null-result outcome. The epigenetic/DNA 'reprogramming' layer is in-vitro only and never operates on a child. A failed gate halts progression. Pediatric use requires IRB with pediatric expertise, IND/IMD, assent/consent, and an independent DSMB.");
  wr.table(FALSIFICATION_TESTS.map((a) => ({ Test: a.test, Hypothesis: a.hypothesis, Method: a.method, "Pass criteria": a.pass })));

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor(100, 116, 139);
    doc.text("AETHON APEX IP — NRC-P PRENATAL REPAIR POD — CONFIDENTIAL", M, 10);
    doc.text(wr.labels[p] || "", W - M, 10, { align: "right" });
    doc.text("Pediatric investigational device. Not for medical use. Unverified concept claims.", M, H - 8);
    doc.text(`Page ${p} of ${total}`, W - M, H - 8, { align: "right" });
  }
  doc.save("NRC-P-Prenatal-Repair-Pod-Engineering-Package.pdf");
  return total;
}