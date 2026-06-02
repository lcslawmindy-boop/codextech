import { jsPDF } from "jspdf";
import { BRIEF_PACKS } from "./briefPackData";

/**
 * Generates a full-content PDF for all 33 brief packs using AI-generated content from DB.
 * contentMap: { [pack_id]: BriefPackContent record }
 */
export function generateFullMasterPDF(contentMap) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 18, contentW = W - margin * 2;
  let y = 0;

  const newPage = () => { doc.addPage(); y = 20; };
  const checkSpace = (needed) => { if (y + needed > 278) newPage(); };

  const drawSectionHeader = (text, color = [6, 182, 212]) => {
    checkSpace(12);
    doc.setFillColor(18, 28, 50);
    doc.setDrawColor(...color);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y - 2, contentW, 8, 1, 1, "FD");
    doc.setTextColor(...color);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(text.toUpperCase(), margin + 3, y + 3.5);
    y += 10;
  };

  const writeBody = (text, color = [190, 200, 220]) => {
    if (!text) return;
    doc.setTextColor(...color);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, contentW);
    lines.forEach(line => {
      checkSpace(5.5);
      doc.text(line, margin, y);
      y += 5.5;
    });
    y += 2;
  };

  // ── COVER PAGE ────────────────────────────────────────────────────────────
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 0, 210, 297, "F");
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("AETHON APEX IP — CONFIDENTIAL RESEARCH DOCUMENTATION", W / 2, 55, { align: "center" });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("Master Technical Brief Pack", W / 2, 75, { align: "center" });
  doc.setFontSize(16);
  doc.text("All 33 Device Build Plans — Complete Engineering Library", W / 2, 87, { align: "center" });
  doc.setTextColor(120, 140, 170);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, W / 2, 100, { align: "center" });

  const completePacks = BRIEF_PACKS.filter(p => contentMap[p.id]?.status === 'complete').length;
  const totalPages = BRIEF_PACKS.reduce((s, p) => s + (contentMap[p.id]?.estimated_pages || 0), 0);
  const totalWords = BRIEF_PACKS.reduce((s, p) => s + (contentMap[p.id]?.word_count || 0), 0);

  const stats = [
    ["33", "Device Packs"],
    [totalPages > 0 ? totalPages.toLocaleString() + "+" : "1,400+", "Est. Pages"],
    [totalWords > 0 ? Math.round(totalWords / 1000) + "K+" : "400K+", "Words"],
    ["$891", "Retail Value"],
  ];
  let sx = 18;
  stats.forEach(([val, label]) => {
    doc.setFillColor(20, 30, 50);
    doc.roundedRect(sx, 120, 42, 22, 2, 2, "F");
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(val, sx + 21, 134, { align: "center" });
    doc.setTextColor(100, 120, 160);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(label, sx + 21, 140, { align: "center" });
    sx += 48;
  });

  if (completePacks < 33) {
    doc.setFillColor(80, 50, 10);
    doc.roundedRect(margin, 158, contentW, 12, 2, 2, "F");
    doc.setTextColor(255, 200, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`⚠ ${completePacks}/33 packs have full AI content. Remaining packs show metadata only. Generate all packs in Admin to get full content.`, W / 2, 166, { align: "center" });
  }

  doc.setTextColor(60, 75, 100);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("FOR RESEARCH AND EXPERIMENTAL PURPOSES ONLY. NOT FOR MEDICAL, DEFENSE, OR COMMERCIAL USE WITHOUT WRITTEN AUTHORIZATION.", W / 2, 275, { align: "center" });
  doc.text("All content based on published patents, peer-reviewed literature, and theoretical engineering frameworks.", W / 2, 281, { align: "center" });

  // ── TABLE OF CONTENTS ─────────────────────────────────────────────────────
  doc.addPage();
  doc.setFillColor(12, 18, 32);
  doc.rect(0, 0, 210, 297, "F");
  y = 22;
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TABLE OF CONTENTS", margin, y);
  y += 8;
  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.3);
  doc.line(margin, y, W - margin, y);
  y += 6;

  BRIEF_PACKS.forEach((pack, i) => {
    checkSpace(7);
    const content = contentMap[pack.id];
    const hasContent = content?.status === 'complete';
    doc.setTextColor(80, 100, 140);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(String(i + 1).padStart(2, "0"), margin, y);
    doc.setTextColor(hasContent ? 210 : 130, hasContent ? 220 : 140, hasContent ? 235 : 150);
    doc.setFont("helvetica", hasContent ? "bold" : "normal");
    doc.text(pack.title, margin + 8, y);
    doc.setTextColor(70, 90, 120);
    doc.setFont("helvetica", "normal");
    doc.text(pack.category, W - margin - 28, y, { align: "right" });
    const pageInfo = hasContent ? `~${content.estimated_pages}p` : `${pack.pages}p`;
    doc.text(pageInfo, W - margin, y, { align: "right" });
    y += 6.5;
  });

  // ── INDIVIDUAL PACK PAGES ─────────────────────────────────────────────────
  BRIEF_PACKS.forEach((pack, i) => {
    const content = contentMap[pack.id];
    const hasFullContent = content?.status === 'complete';

    // Cover page for this pack
    doc.addPage();
    doc.setFillColor(10, 16, 28);
    doc.rect(0, 0, 210, 297, "F");
    y = 18;

    // Pack header bar
    doc.setFillColor(25, 35, 58);
    doc.roundedRect(margin, y - 4, contentW, 9, 2, 2, "F");
    doc.setTextColor(80, 110, 160);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text(`PACK ${String(i + 1).padStart(2, "0")} / 33`, margin + 3, y + 1.5);
    doc.setTextColor(6, 182, 212);
    doc.text(pack.category.toUpperCase(), W - margin - 3, y + 1.5, { align: "right" });
    y += 12;

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(`${pack.icon}  ${pack.title}`, contentW);
    titleLines.forEach(line => { doc.text(line, margin, y); y += 8; });

    // Subtitle
    doc.setTextColor(140, 160, 190);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "italic");
    const subLines = doc.splitTextToSize(pack.subtitle, contentW);
    subLines.forEach(line => { doc.text(line, margin, y); y += 5.5; });
    y += 4;

    // Tagline box
    doc.setFillColor(18, 28, 48);
    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.4);
    const tagLines = doc.splitTextToSize(pack.tagline, contentW - 10);
    const tagH = tagLines.length * 5.5 + 10;
    checkSpace(tagH + 4);
    doc.roundedRect(margin, y, contentW, tagH, 2, 2, "FD");
    doc.setTextColor(170, 215, 240);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    tagLines.forEach((line, li) => { doc.text(line, margin + 5, y + 7 + li * 5.5); });
    y += tagH + 8;

    // Info pills
    const infoItems = [["Difficulty", pack.difficulty || "Medium"], ["Est. Pages", hasFullContent ? `~${content.estimated_pages}` : `${pack.pages || 40}`], ["Category", pack.category || "Research"]];
    checkSpace(15);
    let ix = margin;
    infoItems.forEach(([lbl, val]) => {
      doc.setFillColor(22, 32, 55);
      doc.roundedRect(ix, y, 54, 14, 2, 2, "F");
      doc.setTextColor(90, 120, 160);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.text(lbl.toUpperCase(), ix + 4, y + 5.5);
      doc.setTextColor(215, 225, 245);
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text(String(val), ix + 4, y + 11.5);
      ix += 58;
    });
    y += 20;

    if (!hasFullContent) {
      // Metadata-only fallback
      doc.setFillColor(50, 35, 10);
      doc.roundedRect(margin, y, contentW, 12, 2, 2, "F");
      doc.setTextColor(200, 160, 80);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("⚠ Full AI-generated content pending. Use Admin → PDF Access → AI Content Generator to generate this pack.", W / 2, y + 8, { align: "center" });
      y += 18;

      // Show unique metadata for THIS pack
      drawSectionHeader("ABOUT THIS DEVICE");
      writeBody(pack.tagline);
      
      drawSectionHeader("THEORETICAL FOUNDATION");
      writeBody(pack.theory_basis);
      
      if (pack.sections && pack.sections.length > 0) {
        drawSectionHeader("CONTENT TO GENERATE");
        doc.setTextColor(170, 180, 210);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        pack.sections.forEach((s, si) => {
          checkSpace(7);
          doc.text(`${si + 1}. ${s}`, margin + 4, y);
          y += 5;
        });
        y += 3;
      }

    } else {
      // FULL CONTENT PAGES
      // Overview
      newPage();
      doc.setFillColor(10, 16, 28);
      doc.rect(0, 0, 210, 297, "F");
      y = 20;
      doc.setTextColor(150, 165, 195);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`${pack.icon} ${pack.title} — Full Technical Document`, margin, y);
      y += 8;
      doc.setDrawColor(30, 45, 75);
      doc.setLineWidth(0.2);
      doc.line(margin, y, W - margin, y);
      y += 6;

      drawSectionHeader("1. OVERVIEW & INTRODUCTION");
      writeBody(content.overview);

      drawSectionHeader("2. THEORETICAL FOUNDATIONS");
      writeBody(content.theory_deep);

      drawSectionHeader("3. SYSTEM ARCHITECTURE");
      writeBody(content.system_architecture);

      drawSectionHeader("4. CIRCUIT / TOPOLOGY DESCRIPTION");
      writeBody(content.circuit_description);

      // BOM Table
      if (content.bom && content.bom.length > 0) {
        newPage();
        doc.setFillColor(10, 16, 28);
        doc.rect(0, 0, 210, 297, "F");
        y = 20;
        doc.setTextColor(150, 165, 195);
        doc.setFontSize(8);
        doc.text(`${pack.title} — Bill of Materials`, margin, y);
        y += 10;

        drawSectionHeader("5. BILL OF MATERIALS", [16, 185, 129]);

        // Table header
        const cols = [{ x: margin, w: 12, label: "REF" }, { x: margin + 12, w: 42, label: "COMPONENT" }, { x: margin + 54, w: 38, label: "SPECIFICATION" }, { x: margin + 92, w: 10, label: "QTY" }, { x: margin + 102, w: 28, label: "SOURCE" }, { x: margin + 130, w: 44, label: "NOTES" }];
        checkSpace(8);
        doc.setFillColor(18, 28, 50);
        doc.roundedRect(margin, y - 2, contentW, 7, 1, 1, "F");
        cols.forEach(col => {
          doc.setTextColor(6, 182, 212);
          doc.setFontSize(6.5);
          doc.setFont("helvetica", "bold");
          doc.text(col.label, col.x + 1, y + 3);
        });
        y += 7;

        content.bom.forEach((item, bi) => {
          const rowData = [
            { x: margin, w: 11, text: String(item.ref || '') },
            { x: margin + 12, w: 41, text: String(item.component || '') },
            { x: margin + 54, w: 37, text: String(item.spec || '') },
            { x: margin + 92, w: 9, text: String(item.qty || '') },
            { x: margin + 102, w: 27, text: String(item.source || '') },
            { x: margin + 130, w: 43, text: String(item.notes || '') },
          ];
          // Calculate row height based on tallest cell
          let maxLines = 1;
          rowData.forEach(cell => {
            const lines = doc.splitTextToSize(cell.text, cell.w - 2);
            if (lines.length > maxLines) maxLines = lines.length;
          });
          const rowH = maxLines * 4.5 + 4;
          checkSpace(rowH + 2);
          if (bi % 2 === 0) {
            doc.setFillColor(18, 26, 44);
            doc.rect(margin, y - 1, contentW, rowH, "F");
          }
          rowData.forEach(cell => {
            doc.setTextColor(200, 210, 225);
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(cell.text, cell.w - 2);
            lines.forEach((l, li) => doc.text(l, cell.x + 1, y + 4 + li * 4.5));
          });
          y += rowH;
        });
        y += 4;
      }

      // Assembly Steps
      if (content.assembly_steps && content.assembly_steps.length > 0) {
        checkSpace(14);
        drawSectionHeader("6. ASSEMBLY PROCEDURE", [168, 85, 247]);
        content.assembly_steps.forEach(step => {
          checkSpace(18);
          doc.setFillColor(20, 28, 48);
          doc.roundedRect(margin, y - 1, contentW, 7, 1, 1, "F");
          doc.setTextColor(168, 85, 247);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.text(`Step ${step.step}: ${step.title || ''}`, margin + 3, y + 4);
          y += 8;
          writeBody(step.detail, [180, 190, 215]);
          if (step.caution) {
            checkSpace(7);
            doc.setFillColor(60, 35, 15);
            doc.roundedRect(margin, y - 1, contentW, 7, 1, 1, "F");
            doc.setTextColor(240, 160, 60);
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            const cautionLines = doc.splitTextToSize(`⚠ ${step.caution}`, contentW - 6);
            doc.text(cautionLines[0], margin + 3, y + 4);
            y += 8;
          }
        });
      }

      // Measurement Protocols
      if (content.measurement_protocols && content.measurement_protocols.length > 0) {
        checkSpace(14);
        drawSectionHeader("7. MEASUREMENT PROTOCOLS", [16, 185, 129]);
        content.measurement_protocols.forEach((proto, pi) => {
          checkSpace(28);
          doc.setFillColor(16, 28, 44);
          doc.setDrawColor(16, 185, 129);
          doc.setLineWidth(0.25);
          doc.roundedRect(margin, y - 2, contentW, 7, 1, 1, "FD");
          doc.setTextColor(16, 185, 129);
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.text(`Test ${pi + 1}: ${proto.test || ''}`, margin + 3, y + 3);
          y += 9;
          doc.setTextColor(140, 155, 185);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.text("Equipment:", margin + 3, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(185, 200, 220);
          const eqLines = doc.splitTextToSize(proto.equipment || '', contentW - 26);
          eqLines.forEach(l => { doc.text(l, margin + 26, y); y += 4.5; });
          doc.setTextColor(140, 155, 185);
          doc.setFont("helvetica", "bold");
          doc.text("Procedure:", margin + 3, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(185, 200, 220);
          const prLines = doc.splitTextToSize(proto.procedure || '', contentW - 28);
          prLines.forEach(l => { doc.text(l, margin + 28, y); y += 4.5; });
          doc.setTextColor(16, 185, 129);
          doc.setFont("helvetica", "bold");
          doc.text("Expected:", margin + 3, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(150, 220, 190);
          const exLines = doc.splitTextToSize(proto.expected_result || '', contentW - 26);
          exLines.forEach(l => { doc.text(l, margin + 26, y); y += 4.5; });
          y += 4;
        });
      }

      // Safety
      if (content.safety_guidelines) {
        checkSpace(14);
        drawSectionHeader("8. SAFETY GUIDELINES", [239, 68, 68]);
        writeBody(content.safety_guidelines, [240, 170, 170]);
      }

      // Troubleshooting
      if (content.troubleshooting && content.troubleshooting.length > 0) {
        checkSpace(14);
        drawSectionHeader("9. TROUBLESHOOTING GUIDE", [251, 146, 60]);
        content.troubleshooting.forEach(item => {
          checkSpace(20);
          doc.setFillColor(45, 25, 10);
          doc.roundedRect(margin, y - 1, contentW, 7, 1, 1, "F");
          doc.setTextColor(251, 146, 60);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.text(`Symptom: ${item.symptom || ''}`, margin + 3, y + 4);
          y += 8;
          doc.setTextColor(140, 155, 185);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.text(`Cause: `, margin + 3, y);
          doc.setTextColor(200, 210, 225);
          doc.setFont("helvetica", "normal");
          const causeLines = doc.splitTextToSize(item.likely_cause || '', contentW - 18);
          causeLines.forEach(l => { checkSpace(5); doc.text(l, margin + 16, y); y += 4.5; });
          doc.setTextColor(140, 155, 185);
          doc.setFont("helvetica", "bold");
          doc.text(`Remedy: `, margin + 3, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(170, 220, 200);
          const remLines = doc.splitTextToSize(item.remedy || '', contentW - 20);
          remLines.forEach(l => { checkSpace(5); doc.text(l, margin + 18, y); y += 4.5; });
          y += 3;
        });
      }

      // References
      if (content.references && content.references.length > 0) {
        checkSpace(14);
        drawSectionHeader("10. REFERENCES & CITATIONS", [100, 150, 220]);
        content.references.forEach((ref, ri) => {
          const rLines = doc.splitTextToSize(String(ref), contentW - 10);
          checkSpace(rLines.length * 4.5 + 3);
          doc.setTextColor(100, 140, 200);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.text(`[${ri + 1}]`, margin, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(170, 185, 215);
          rLines.forEach(l => { doc.text(l, margin + 9, y); y += 4.5; });
          y += 2;
        });
      }
    }

    // Footer on last page of this pack
    doc.setTextColor(40, 55, 80);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text("For research and experimental purposes only. Not for medical use.", margin, 290);
    doc.text(`Pack ${i + 1} of 33`, W - margin, 290, { align: "right" });
  });

  doc.save("Aethon-Apex-Master-Brief-Pack-All-33-Full.pdf");
}