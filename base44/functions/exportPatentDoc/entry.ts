import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { jsPDF } from 'npm:jspdf@4.0.0';

const SECTIONS = [
  { key: "crossReference", label: "CROSS-REFERENCE TO RELATED APPLICATIONS" },
  { key: "technicalField", label: "TECHNICAL FIELD" },
  { key: "background", label: "BACKGROUND OF THE INVENTION" },
  { key: "summary", label: "SUMMARY OF THE INVENTION" },
  { key: "briefDrawings", label: "BRIEF DESCRIPTION OF THE DRAWINGS" },
  { key: "detailedDescription", label: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS" },
  { key: "claims", label: "CLAIMS" },
  { key: "abstract", label: "ABSTRACT" },
];

function addPageBackground(doc) {
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, 216, 279, 'F');
}

function addPageHeader(doc, title, pageNum) {
  doc.setFillColor(245, 245, 240);
  doc.rect(0, 0, 216, 16, 'F');
  doc.setDrawColor(200, 195, 185);
  doc.setLineWidth(0.3);
  doc.line(0, 16, 216, 16);

  doc.setTextColor(100, 95, 85);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  const shortTitle = title.length > 70 ? title.slice(0, 67) + "..." : title;
  doc.text("US PROVISIONAL PATENT APPLICATION (35 USC 111(b))", 20, 7);
  doc.text(shortTitle, 20, 12);
  doc.text(`Page ${pageNum}`, 196, 10, { align: "right" });
}

function addPageFooter(doc, pageNum, total) {
  doc.setDrawColor(200, 195, 185);
  doc.setLineWidth(0.3);
  doc.line(20, 268, 196, 268);
  doc.setTextColor(150, 145, 135);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("CONFIDENTIAL — PATENT PENDING — NOT FOR PUBLIC DISTRIBUTION", 20, 273);
  doc.text(`${pageNum} / ${total}`, 196, 273, { align: "right" });
}

function drawSectionHeader(doc, label, y) {
  doc.setFillColor(30, 30, 50);
  doc.rect(20, y, 176, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(label, 24, y + 5.5);
  return y + 12;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { draft, invention, format, filename } = await req.json();
    const title = draft.title || invention?.name || "Provisional Patent Application";

    console.log(`Exporting patent doc: format=${format}, title=${title}, user=${user.email}`);

    // ── Plain text export ─────────────────────────────────────────────────
    if (format === "txt") {
      const lines = [
        "═".repeat(80),
        "US PROVISIONAL PATENT APPLICATION",
        "Filed pursuant to 35 USC 111(b) and 37 CFR Part 1",
        "═".repeat(80),
        "",
        `TITLE OF INVENTION: ${title}`,
        `Filing Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
        "",
        "─".repeat(80),
        "",
        ...SECTIONS.flatMap(s => [
          s.label,
          "─".repeat(s.label.length),
          "",
          draft[s.key] || "[Not provided]",
          "",
          "",
        ]),
        "═".repeat(80),
        "INVENTOR DECLARATION",
        "═".repeat(80),
        "",
        `I hereby declare that I am the original inventor of the subject matter which is claimed and for which a patent is sought in the above-entitled application.`,
        "",
        `Inventor Signature: _______________________________  Date: _______________`,
        `Printed Name: _______________________________`,
        "",
        "─".repeat(80),
        "NOTE: This provisional patent application establishes a priority date under 35 USC 119(e).",
        "A non-provisional application must be filed within 12 months to claim this priority date.",
        "Review with a registered USPTO patent practitioner before filing.",
        "─".repeat(80),
      ];

      const text = lines.join("\n");
      return new Response(text, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename || "provisional-patent"}.txt"`,
        },
      });
    }

    // ── PDF export ────────────────────────────────────────────────────────
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageW = 216;
    const pageH = 279;
    const marginL = 20;
    const marginR = 196;
    const textW = marginR - marginL;
    const headerH = 20;
    const footerH = 14;
    const bodyTop = headerH + 4;
    const bodyBottom = pageH - footerH;

    let pageNum = 1;
    const allPageContents = []; // We'll figure out total pages after

    const addPage = () => {
      if (pageNum > 1) doc.addPage();
      addPageBackground(doc);
      addPageHeader(doc, title, pageNum);
      pageNum++;
      return bodyTop;
    };

    const printText = (text, y, fontSize, fontStyle, color, indent = 0) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", fontStyle || "normal");
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, textW - indent);
      let curY = y;
      for (const line of lines) {
        if (curY > bodyBottom - 8) {
          addPageFooter(doc, pageNum - 1, "?");
          curY = addPage();
        }
        doc.text(line, marginL + indent, curY);
        curY += fontSize * 0.45;
      }
      return curY;
    };

    // ── Cover page ────────────────────────────────────────────────────────
    let y = addPage();

    // USPTO seal block
    doc.setFillColor(240, 238, 230);
    doc.roundedRect(marginL, y, textW, 40, 2, 2, 'F');
    doc.setDrawColor(180, 175, 160);
    doc.setLineWidth(0.5);
    doc.roundedRect(marginL, y, textW, 40, 2, 2, 'S');

    doc.setTextColor(50, 50, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("UNITED STATES PATENT AND TRADEMARK OFFICE", pageW / 2, y + 10, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("PROVISIONAL PATENT APPLICATION", pageW / 2, y + 17, { align: "center" });
    doc.setFontSize(8);
    doc.text("Filed Pursuant to 35 U.S.C. § 111(b) and 37 C.F.R. § 1.53(c)", pageW / 2, y + 23, { align: "center" });
    doc.text(`Filing Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageW / 2, y + 30, { align: "center" });
    doc.text("Serial No.: [Assigned Upon Filing]", pageW / 2, y + 36, { align: "center" });
    y += 48;

    // Title
    doc.setFillColor(30, 30, 50);
    doc.rect(marginL, y, textW, 1, 'F');
    y += 5;
    doc.setTextColor(20, 20, 35);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(title.toUpperCase(), textW);
    doc.text(titleLines, pageW / 2, y, { align: "center" });
    y += titleLines.length * 6 + 4;
    doc.setFillColor(30, 30, 50);
    doc.rect(marginL, y, textW, 1, 'F');
    y += 8;

    // Metadata table
    const metaRows = [
      ["Inventor(s):", "[To be completed before filing]"],
      ["Correspondence Address:", "[To be completed before filing]"],
      ["Technical Field:", invention?.category || "Electromagnetic Devices"],
      ["Development Stage:", invention?.stage || "—"],
      ["Attorney/Agent:", "[If represented]"],
    ];
    doc.setFontSize(9);
    metaRows.forEach(([k, v]) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 70);
      doc.text(k, marginL, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 40);
      doc.text(v, marginL + 52, y);
      y += 7;
    });
    y += 8;

    // Disclaimer box
    doc.setFillColor(255, 248, 220);
    doc.roundedRect(marginL, y, textW, 22, 2, 2, 'F');
    doc.setDrawColor(220, 180, 80);
    doc.setLineWidth(0.4);
    doc.roundedRect(marginL, y, textW, 22, 2, 2, 'S');
    doc.setTextColor(120, 90, 20);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("IMPORTANT LEGAL NOTICE", marginL + 4, y + 6);
    doc.setFont("helvetica", "normal");
    const disclaimerText = "This provisional patent application was prepared with AI assistance. Review all claims and sections with a registered USPTO patent practitioner (attorney or agent) before filing. This document does not constitute legal advice. A nonprovisional application must be filed within 12 months to claim this priority date (35 USC 119(e)).";
    const dLines = doc.splitTextToSize(disclaimerText, textW - 8);
    doc.text(dLines, marginL + 4, y + 12);
    y += 28;

    addPageFooter(doc, pageNum - 1, "?");

    // ── Specification pages ───────────────────────────────────────────────
    y = addPage();

    for (const section of SECTIONS) {
      const content = draft[section.key] || "[This section was not generated. Please add content before filing.]";

      // Section header
      if (y > bodyBottom - 30) {
        addPageFooter(doc, pageNum - 1, "?");
        y = addPage();
      }
      y = drawSectionHeader(doc, section.label, y);

      // Special formatting for claims
      if (section.key === "claims") {
        const claimLines = content.split("\n").filter(l => l.trim());
        for (const line of claimLines) {
          if (y > bodyBottom - 10) {
            addPageFooter(doc, pageNum - 1, "?");
            y = addPage();
          }
          const isClaimNum = /^\d+\./.test(line.trim());
          const isIndependent = /^\s*(1|[0-9]+)\.\s*(A |An |The )/.test(line);
          doc.setFontSize(9);
          doc.setFont("helvetica", isClaimNum ? "bold" : "normal");
          doc.setTextColor(isIndependent && isClaimNum ? 20 : 50, 20, isIndependent && isClaimNum ? 80 : 50);
          const indent = isClaimNum ? 0 : 8;
          const clLines = doc.splitTextToSize(line.trim(), textW - indent);
          for (const cl of clLines) {
            if (y > bodyBottom - 8) {
              addPageFooter(doc, pageNum - 1, "?");
              y = addPage();
            }
            doc.text(cl, marginL + indent, y);
            y += 4.5;
          }
          y += 1.5;
        }
      } else {
        // Normal section text
        const paragraphs = content.split("\n\n").filter(p => p.trim());
        for (const para of paragraphs) {
          if (y > bodyBottom - 15) {
            addPageFooter(doc, pageNum - 1, "?");
            y = addPage();
          }
          doc.setFontSize(9.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(25, 25, 35);
          const pLines = doc.splitTextToSize(para.trim(), textW);
          for (const pl of pLines) {
            if (y > bodyBottom - 8) {
              addPageFooter(doc, pageNum - 1, "?");
              y = addPage();
            }
            doc.text(pl, marginL, y);
            y += 4.8;
          }
          y += 3;
        }
      }
      y += 6;
    }

    // ── Declaration page ──────────────────────────────────────────────────
    if (y > bodyBottom - 60) {
      addPageFooter(doc, pageNum - 1, "?");
      y = addPage();
    }
    y = drawSectionHeader(doc, "INVENTOR'S DECLARATION", y);
    const declText = `I hereby declare that: (1) I am the original inventor or an original joint inventor of a claimed invention in the application; (2) The application was made or authorized to be made by me; (3) I acknowledge the duty to disclose to the Office all information known to me to be material to patentability as defined in 37 C.F.R. § 1.56.

WARNING: Petitioner/applicant is cautioned to avoid submitting personal information in documents filed in a patent application that may contribute to identity theft. Personal information such as social security numbers, bank account numbers, or credit card numbers (other than a check or credit card authorization form USPTO-2038 submitted for payment purposes) is never required by the USPTO to support a patent application. If this type of personal information is included in documents submitted to the USPTO, petitioners/applicants should consider redacting such personal information from the documents before submitting them to the USPTO. The USPTO will not redact such information from patent application documents.`;

    y = printText(declText, y, 9, "normal", [50, 50, 60], 0);
    y += 10;

    doc.setDrawColor(100, 95, 85);
    doc.setLineWidth(0.3);
    doc.line(marginL, y, marginL + 80, y);
    doc.line(marginL + 100, y, marginR, y);
    y += 4;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 95, 85);
    doc.text("Inventor Signature", marginL, y);
    doc.text("Date", marginL + 100, y);
    y += 8;
    doc.line(marginL, y, marginL + 80, y);
    y += 4;
    doc.text("Printed Name of Inventor", marginL, y);

    addPageFooter(doc, pageNum - 1, pageNum - 1);

    // Fix total pages on all previous footer calls (best effort — update last page footer)
    const totalPages = pageNum - 1;

    // Re-render last page footer with correct total
    doc.setPage(totalPages);
    doc.setFillColor(252, 252, 250);
    doc.rect(0, 265, 216, 15, 'F');
    addPageFooter(doc, totalPages, totalPages);

    const pdfBytes = doc.output("arraybuffer");
    console.log(`Patent PDF: ${pdfBytes.byteLength} bytes, ${totalPages} pages`);

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename || "provisional-patent"}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Patent export error:", error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});