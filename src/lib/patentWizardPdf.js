import { jsPDF } from "jspdf";

export function exportPatentApplicationPDF(doc) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210; const margin = 25; const contentW = W - margin * 2;
  let y = 0;
  let pageNum = 1;

  const addPage = () => {
    pdf.addPage();
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, W, 297, "F");
    pageNum++;
    y = 25;
    // Page footer
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${pageNum}`, W / 2, 290, { align: "center" });
  };

  const checkPage = (needed = 15) => {
    if (y + needed > 275) addPage();
  };

  const section = (title) => {
    checkPage(20);
    y += 6;
    pdf.setDrawColor(180, 180, 200);
    pdf.line(margin, y, W - margin, y);
    y += 6;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(30, 30, 30);
    pdf.text(title.toUpperCase(), margin, y);
    y += 8;
  };

  const body = (text, options = {}) => {
    if (!text || !text.trim()) return;
    pdf.setFont(options.mono ? "courier" : "helvetica", options.bold ? "bold" : "normal");
    pdf.setFontSize(options.size || 10);
    pdf.setTextColor(...(options.color || [50, 50, 50]));
    const lines = pdf.splitTextToSize(text.trim(), contentW);
    lines.forEach(line => {
      checkPage(7);
      pdf.text(line, margin, y);
      y += options.lineH || 6;
    });
    y += 2;
  };

  // ── COVER PAGE ──────────────────────────────────────────────────────────────
  pdf.setFillColor(10, 14, 26);
  pdf.rect(0, 0, W, 297, "F");
  pdf.setFillColor(99, 102, 241);
  pdf.rect(0, 0, W, 4, "F");
  pdf.setFillColor(99, 102, 241);
  pdf.rect(0, 293, W, 4, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(148, 163, 184);
  pdf.text("UNITED STATES PATENT APPLICATION", margin, 30);
  pdf.text("PROVISIONAL PATENT APPLICATION UNDER 35 U.S.C. § 111(b)", margin, 37);

  pdf.setFontSize(20);
  pdf.setTextColor(255, 255, 255);
  const titleLines = pdf.splitTextToSize(doc.title || "Untitled Invention", contentW);
  titleLines.forEach((line, i) => {
    pdf.text(line, margin, 60 + i * 12);
  });

  let coverY = 60 + titleLines.length * 12 + 16;

  if (doc.inventors?.length) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184);
    pdf.text("INVENTOR(S):", margin, coverY);
    coverY += 7;
    doc.inventors.forEach(inv => {
      pdf.setTextColor(203, 213, 225);
      pdf.text(`${inv.name}${inv.address ? " — " + inv.address : ""}`, margin + 4, coverY);
      coverY += 6;
    });
    coverY += 5;
  }

  if (doc.field) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text("TECHNICAL FIELD:", margin, coverY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(203, 213, 225);
    const fieldLines = pdf.splitTextToSize(doc.field, contentW - 10);
    fieldLines.forEach((l, i) => pdf.text(l, margin + 4, coverY + 6 + i * 6));
    coverY += 6 + fieldLines.length * 6 + 6;
  }

  pdf.setFontSize(8);
  pdf.setTextColor(51, 65, 85);
  pdf.text(`Prepared: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin, 275);
  pdf.text("CONFIDENTIAL — Not for public disclosure prior to filing", margin, 281);
  pdf.text("Zenith Apex Research Portfolio — AI Patent Drafting Wizard", margin, 287);

  // ── PAGE 2: SPECIFICATION ───────────────────────────────────────────────────
  addPage();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, W, 297, "F");

  // Page header on page 2+
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text((doc.title || "Patent Application").slice(0, 60).toUpperCase(), margin, 15);
  pdf.text(`Page ${pageNum}`, W - margin, 15, { align: "right" });
  y = 25;

  section("ABSTRACT");
  body(doc.abstract);

  section("FIELD OF THE INVENTION");
  body(doc.field);

  section("BACKGROUND OF THE INVENTION");
  body(doc.background);

  section("SUMMARY OF THE INVENTION");
  body(doc.summary);

  section("BRIEF DESCRIPTION OF THE DRAWINGS");
  body(doc.drawings || "No drawings description provided.");

  section("DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS");
  body(doc.description);

  // ── CLAIMS ──────────────────────────────────────────────────────────────────
  section("CLAIMS");
  body("What is claimed is:", { bold: true });
  y += 2;

  const allClaims = [
    ...(doc.claims?.independent || []).filter(c => c.trim()),
    ...(doc.claims?.dependent || []).filter(c => c.trim()),
  ];

  allClaims.forEach((claim, i) => {
    checkPage(20);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(30, 30, 30);
    pdf.text(`${i + 1}.`, margin, y);
    pdf.setFont("helvetica", "normal");
    const claimLines = pdf.splitTextToSize(claim.trim(), contentW - 8);
    claimLines.forEach(line => {
      checkPage(7);
      pdf.text(line, margin + 8, y);
      y += 6;
    });
    y += 3;
  });

  // ── ABSTRACT (SEPARATE PAGE, USPTO REQUIREMENT) ─────────────────────────────
  if (doc.abstract) {
    addPage();
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, W, 297, "F");
    y = 25;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(30, 30, 30);
    pdf.text("ABSTRACT", W / 2, y, { align: "center" });
    y += 12;
    body(doc.abstract);
  }

  const filename = (doc.title || "Patent_Application").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
  pdf.save(`${filename}_USPTO_Application.pdf`);
}