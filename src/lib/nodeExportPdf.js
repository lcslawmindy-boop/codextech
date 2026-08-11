import { jsPDF } from "jspdf";

// Generates a multi-page PDF intelligence brief for a research node:
// AI summary + full detail & build integration + relevant nodes + patents + cited papers.
export function generateNodeExportPdf({ node, aiData, connectedNodes }) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (h) => {
    if (y + h > pageH - margin - 30) { doc.addPage(); y = margin; }
  };

  // ── Header band ──
  doc.setFillColor(13, 17, 23);
  doc.rect(0, 0, pageW, 70, "F");
  doc.setTextColor(234, 179, 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ZARP RESEARCH GRAPH", margin, 30);
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Node Intelligence Brief — AI Summary, Full Detail & Build Integration", margin, 46);
  doc.setFontSize(8);
  doc.text(new Date().toLocaleDateString(), pageW - margin, 46, { align: "right" });
  y = 92;

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const titleLines = doc.splitTextToSize(node.label, contentW);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 16 + 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`${node.researcher}  ·  ${node.year}  ·  ${node.domain}  ·  ${node.suppression}`, margin, y);
  y += 18;

  const section = (title, color) => {
    ensureSpace(30);
    y += 10;
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(1.5);
    doc.line(margin, y, margin + 20, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(title.toUpperCase(), margin, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(226, 232, 240);
  };

  const paragraph = (text) => {
    if (!text) return;
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(text, contentW);
    lines.forEach(line => {
      ensureSpace(14);
      doc.text(line, margin, y);
      y += 13;
    });
  };

  const bullet = (text) => {
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(text, contentW - 16);
    lines.forEach((line, i) => {
      ensureSpace(14);
      doc.text(i === 0 ? `\u2022  ${line}` : `    ${line}`, margin, y);
      y += 13;
    });
  };

  // AI Summary
  section("AI Summary", [234, 179, 8]);
  paragraph(aiData?.summary || node.description || "");

  // Key Insights
  if (aiData?.key_insights?.length) {
    section("Key Insights", [234, 179, 8]);
    aiData.key_insights.forEach(k => bullet(k));
  }

  // Full Detail & Build Integration
  section("Full Detail & Build Integration", [6, 182, 212]);
  paragraph(`Mechanism: ${node.mechanism || "\u2014"}`);
  paragraph(`Target Systems: ${(node.targetSystems || []).join(", ") || "\u2014"}`);
  paragraph(`Device Integration: ${node.deviceIntegration || "\u2014"}`);
  paragraph(`Evidence Level: ${node.evidenceLabel || node.evidence || "\u2014"}`);
  paragraph(`Suppression Status: ${node.suppression || "\u2014"}`);
  if (node.frequency) paragraph(`Frequency: ${node.frequency} ${node.frequencyUnit || "Hz"}`);
  paragraph(`Tags: ${(node.tags || []).join(", ") || "\u2014"}`);
  paragraph(`Description: ${node.description || ""}`);

  // Relevant Nodes
  if (connectedNodes?.length) {
    section("Relevant Nodes (clickable in app)", [34, 211, 238]);
    connectedNodes.forEach(n => bullet(`${n.label} \u2014 ${n.domain} (${n.researcher}, ${n.year})`));
  }

  // Reference Patents
  section("Reference Patents", [139, 92, 246]);
  if (aiData?.patent_numbers?.length) {
    aiData.patent_numbers.forEach(p => bullet(p));
  } else {
    paragraph("No confirmed patents in public records.");
  }

  // Cited Research Papers
  section("Cited Research Papers", [16, 185, 129]);
  if (aiData?.cited_papers?.length) {
    aiData.cited_papers.forEach(p => {
      const parts = [p.title];
      if (p.authors) parts.push(`\u2014 ${p.authors}`);
      if (p.year) parts.push(`(${p.year})`);
      if (p.source) parts.push(`, ${p.source}`);
      bullet(parts.join(" "));
    });
  } else {
    paragraph("No confirmed cited papers in public records.");
  }

  // ── Footer disclaimer on every page ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("ZARP Research Graph \u2014 All nodes represent published historical and scientific research for innovation and IP development purposes only. ZARP does not validate or endorse underlying scientific claims. Not medical advice. \u00A9 2026 Aethon Apex IP Holdings LLC.", margin, pageH - 20, { maxWidth: contentW });
  }

  return doc;
}