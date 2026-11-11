import jsPDF from "jspdf";
import { TOP10, PORTFOLIO, VIABILITY_REPORT, GRANT_DRAFTS } from "./investorDeckData";

const money = (n) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`);

export default function generateViabilityReportPdf() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const M = 50;
  const W = doc.internal.pageSize.getWidth() - M * 2;
  let y = M;
  const ink = (txt, size, opts = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(opts.color || [11, 17, 30]);
    const lines = doc.splitTextToSize(txt, W);
    lines.forEach((ln) => {
      if (y > doc.internal.pageSize.getHeight() - M) { doc.addPage(); y = M; }
      doc.text(ln, M, y);
      y += size * (opts.lh || 1.35);
    });
    y += opts.gap || 0;
  };
  const rule = () => { doc.setDrawColor(209, 212, 220); doc.line(M, y, M + W, y); y += 10; };

  ink("COMMERCIAL VIABILITY REPORT", 20, { bold: true, gap: 4 });
  ink("Aethon Apex IP Holdings — Top 10 IP Assets", 12, { color: [101, 117, 139], gap: 8 });
  ink(`Generated ${VIABILITY_REPORT.generated}. ${VIABILITY_REPORT.scope}`, 9, { color: [101, 117, 139], gap: 6 });
  ink(VIABILITY_REPORT.headline, 11, { gap: 8 });
  ink(`Method: ${VIABILITY_REPORT.method}`, 9, { color: [101, 117, 139], gap: 10 });
  rule();

  ink("TOP-10 SCORECARD", 14, { bold: true, gap: 6 });
  const sorted = [...TOP10].sort((a, b) => b.viability.score - a.viability.score);
  sorted.forEach((a) => {
    const col = a.viability.score >= 55 ? [16, 185, 129] : a.viability.score >= 35 ? [180, 83, 9] : [239, 68, 68];
    ink(`#${a.rank}  ${a.name}  —  score ${a.viability.score}/100  |  ${money(a.vLow)}–${money(a.vHigh)}`, 10, { bold: true, color: col, gap: 2 });
    ink(a.viability.risk, 9, { color: [101, 117, 139], gap: 6 });
  });
  rule();

  ink("GRANT SUBMISSION DRAFTS", 14, { bold: true, gap: 6 });
  GRANT_DRAFTS.forEach((g) => {
    ink(`${g.target}`, 11, { bold: true, color: [6, 182, 212], gap: 2 });
    ink(`Assets: ${g.assets.join(", ")}   |   Amount: ${g.amount}   |   Deadline: ${g.deadline}`, 9, { color: [101, 117, 139], gap: 2 });
    ink(`Rationale: ${g.rationale}`, 9, { gap: 2 });
    ink(`Objective: ${g.objective}`, 9, { gap: 2 });
    ink(`Honest note: ${g.honest_note}`, 9, { color: [180, 83, 9], gap: 8 });
  });
  rule();

  ink("RECOMMENDATIONS", 14, { bold: true, gap: 6 });
  VIABILITY_REPORT.recommendations.forEach((r, i) => ink(`${i + 1}. ${r}`, 10, { gap: 4 }));
  ink("KEY RISKS", 14, { bold: true, gap: 6 });
  VIABILITY_REPORT.risks.forEach((r, i) => ink(`${i + 1}. ${r}`, 10, { color: [180, 83, 9], gap: 4 }));

  ink("ADVISORY ONLY — cost-approach figures are a floor, not a market valuation. Commission an independent IP valuation before investor disclosure. No patent is filed at the USPTO.", 9, { color: [180, 83, 9], gap: 0 });

  doc.save("Aethon-Apex-Commercial-Viability-Report.pdf");
}