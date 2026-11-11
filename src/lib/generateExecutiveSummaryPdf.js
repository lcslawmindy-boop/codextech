// One-page executive summary PDF: pulls valuation scores + commercial viability.
import jsPDF from "jspdf";
import { FACTS, SCORECARD, METHODS, BLENDED, FINDINGS, money } from "@/lib/zds33Valuation";

export default async function generateExecutiveSummaryPdf(assets = []) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 0;

  const setBody = (size = 10, color = [30, 41, 59]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
  };
  const setHeading = (size, color = [12, 74, 110]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
  };
  const line = (text, size, color, gap = 14) => {
    setBody(size, color);
    const split = doc.splitTextToSize(text, W - M * 2);
    doc.text(split, M, y);
    y += split.length * (size * 1.35) + gap;
  };
  const divider = () => {
    doc.setDrawColor(210, 214, 220);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
    y += 12;
  };

  // Header band
  doc.setFillColor(13, 148, 136);
  doc.rect(0, 0, W, 56, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Aethon Apex IP Holdings", M, 28);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Executive Summary — Valuation & Commercial Viability", M, 44);
  y = 80;

  line("CONFIDENTIAL — For investor review under NDA. Advisory analysis only, not an independent valuation. No patents filed at the USPTO at date of issue.", 8, [180, 83, 9], 14);

  // Valuation range headline
  setHeading(20, [13, 148, 136]);
  doc.text(`Indicative portfolio value: ${money(BLENDED.low)} – ${money(BLENDED.high)}`, M, y);
  y += 22;
  setBody(9, [100, 116, 139]);
  doc.text("Blended range across deal-implied, cost-replacement, and risk-adjusted option methods.", M, y);
  y += 18;

  divider();

  // Key facts
  setHeading(12);
  doc.text("Portfolio at a glance", M, y); y += 16;
  FACTS.forEach(([k, v]) => {
    setBody(9, [71, 85, 105]);
    doc.text(k, M, y);
    setBody(9, [30, 41, 59]);
    doc.text(doc.splitTextToSize(v, W - M * 2 - 130), M + 128, y);
    y += 14;
  });
  y += 6; divider();

  // Scorecard
  setHeading(12);
  doc.text("Viability scorecard (HDG rubric, indicative)", M, y); y += 16;
  const totalMax = SCORECARD.reduce((a, s) => a + s.max, 0);
  const totalScore = SCORECARD.reduce((a, s) => a + s.score, 0);
  SCORECARD.forEach((s) => {
    setBody(9, [71, 85, 105]);
    doc.text(`${s.name}`, M, y);
    setBody(9, [30, 41, 59]);
    doc.text(`${s.score} / ${s.max}`, W - M - 40, y, { align: "right" });
    y += 12;
    setBody(8, [100, 116, 139]);
    doc.text(doc.splitTextToSize(s.why, W - M * 2 - 20), M + 12, y);
    y += 14;
  });
  setBody(10, [13, 148, 136]);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${totalScore} / ${totalMax}`, M, y); y += 18; divider();

  // Top assets (passed in)
  if (assets.length) {
    setHeading(12);
    doc.text("Lead assets — valuation & status", M, y); y += 16;
    assets.slice(0, 6).forEach((a) => {
      setBody(10, [30, 41, 59]);
      doc.setFont("helvetica", "bold");
      doc.text(a.asset_name || "Unnamed", M, y); y += 13;
      doc.setFont("helvetica", "normal");
      setBody(9, [71, 85, 105]);
      const val = (a.valuation_low || a.valuation_high) ? `${money(a.valuation_low || 0)} – ${money(a.valuation_high || 0)}` : "Not valued";
      doc.text(`Indicative value: ${val}`, M, y); y += 11;
      if (a.filing_status) { doc.text(`Filing: ${a.filing_status.replace(/_/g, " ")}`, M, y); y += 11; }
      if (a.development_stage) { doc.text(`Stage: ${a.development_stage}`, M, y); y += 11; }
      if (a.commercialization_readiness) { doc.text(`Commercialization: ${a.commercialization_readiness.replace(/_/g, " ")}`, M, y); y += 14; }
    });
    y += 4; if (y < 680) divider();
  }

  // Valuation methods
  setHeading(12);
  doc.text("Valuation methods", M, y); y += 16;
  METHODS.forEach((m) => {
    setBody(10, [30, 41, 59]);
    doc.setFont("helvetica", "bold");
    doc.text(`${m.method}: ${money(m.low)} – ${money(m.high)}`, M, y); y += 12;
    doc.setFont("helvetica", "normal");
    setBody(8, [100, 116, 139]);
    doc.text(doc.splitTextToSize(m.note, W - M * 2 - 12), M + 12, y);
    y += 16;
  });

  // Key findings
  if (y > 640) { doc.addPage(); y = 60; }
  y += 4; divider();
  setHeading(12, [194, 83, 9]);
  doc.text("Key findings & risks", M, y); y += 16;
  FINDINGS.forEach((f) => {
    setBody(9, f.sev === "high" ? [194, 83, 9] : [180, 140, 20]);
    doc.setFont("helvetica", "bold");
    doc.text(`[${f.sev.toUpperCase()}] ${f.t}`, M, y); y += 12;
    doc.setFont("helvetica", "normal");
    setBody(9, [71, 85, 105]);
    doc.text(doc.splitTextToSize(f.d, W - M * 2 - 12), M + 12, y);
    y += 18;
  });

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text("Aethon Apex IP Holdings — Confidential. Advisory analysis, not an independent valuation. No patents filed at USPTO. Not an investment offer or legal advice.", M, 740);
    doc.text(`Page ${i} of ${pages}`, W - M, 740, { align: "right" });
  }

  doc.save("Aethon-Apex-Executive-Summary.pdf");
}