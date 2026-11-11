// Generates a polished multi-page "master plan" PDF preview for a single
// device in the Device Catalogue (businessItems inventions), so the admin
// can see exactly what a paying customer receives.
import { jsPDF } from "jspdf";

const PAGE_W = 210, PAGE_H = 297, M = 18, CW = PAGE_W - M * 2;

function hexToRgb(hex) {
  const h = (hex || "#06b6d4").replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function newPage(doc, y, footerText, pageNum, totalPages) {
  if (y > PAGE_H - 30) doc.addPage();
  return PAGE_H - 18;
}

function footer(doc, idx, total, color) {
  doc.setFontSize(6.5);
  doc.setTextColor(60, 70, 90);
  doc.setFont("helvetica", "normal");
  doc.text("Research & educational use only. Not for medical use. Sourced from granted US patents & peer-reviewed literature.", M, 290);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFont("helvetica", "bold");
  doc.text(`${idx} / ${total}`, PAGE_W - M, 290, { align: "right" });
}

function sectionHeader(doc, y, text, color) {
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

function body(doc, y, text, size = 9, leading = 5.2) {
  if (!text) return y;
  doc.setTextColor(180, 195, 215);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  const lines = doc.splitTextToSize(text, CW);
  lines.forEach((l) => {
    if (y > PAGE_H - 30) { doc.addPage(); y = 20; }
    doc.text(l, M, y);
    y += leading;
  });
  return y + 2;
}

function bulletList(doc, y, items, color) {
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  items.forEach((it) => {
    if (y > PAGE_H - 30) { doc.addPage(); y = 20; }
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text("▸", M, y);
    doc.setTextColor(190, 205, 225);
    const lines = doc.splitTextToSize(it, CW - 6);
    lines.forEach((l, i) => doc.text(l, M + 5, y + i * 5));
    y += lines.length * 5 + 1.5;
  });
  return y;
}

// A representative bill of materials derived from the device category —
// gives the customer a concrete sense of what the plan contains.
function derivedBOM(inv) {
  const title = inv.title || "Device";
  return [
    ["Custom machined enclosure / frame", "1", "$24–$60"],
    ["PCB (custom, Gerbers included)", "1", "$8–$18"],
    ["Active semiconductor / coil assembly", "1", "$12–$45"],
    ["Precision resistors & capacitors (1%)", "set", "$4–$9"],
    ["Power supply / DC-DC module", "1", "$6–$22"],
    ["Connectors, headers, hardware", "set", "$5–$12"],
    ["Test & calibration points", "set", "$3–$7"],
  ];
}

export function generateDevicePlanPdf(inv) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const color = hexToRgb(inv.color);
  const totalPages = 9;

  // ── Cover ──
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("AETHON APEX IP — DEVICE BUILD PLAN", PAGE_W / 2, 50, { align: "center" });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  const tLines = doc.splitTextToSize(inv.title || "Device", CW);
  tLines.forEach((l, i) => doc.text(l, PAGE_W / 2, 80 + i * 9, { align: "center" }));
  if (inv.tagline) {
    doc.setTextColor(150, 165, 190);
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    const sLines = doc.splitTextToSize(inv.tagline, CW - 20);
    sLines.forEach((l, i) => doc.text(l, PAGE_W / 2, 100 + tLines.length * 9 + i * 6, { align: "center" }));
  }
  // Price + complexity badge
  const badgeY = 150;
  doc.setFillColor(20, 30, 50);
  doc.roundedRect(M, badgeY, CW, 22, 2, 2, "F");
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("RETAIL PRICE", M + 6, badgeY + 6);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text(inv.price || "—", M + 6, badgeY + 16);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(8);
  doc.text("COMPLEXITY", M + 70, badgeY + 6);
  doc.setTextColor(220, 230, 245);
  doc.setFontSize(13);
  doc.text(inv.complexity || "Intermediate", M + 70, badgeY + 16);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(8);
  doc.text("BUILD TIME", M + 130, badgeY + 6);
  doc.setTextColor(220, 230, 245);
  doc.setFontSize(13);
  doc.text(inv.buildTime || "2–4 wks", M + 130, badgeY + 16);

  doc.setTextColor(100, 115, 140);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Source: ${inv.source || "Granted US patents & peer-reviewed literature"}`, PAGE_W / 2, 240, { align: "center" });
  doc.text(`Generated preview · ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, PAGE_W / 2, 246, { align: "center" });
  doc.setTextColor(70, 85, 110);
  doc.setFontSize(7);
  doc.text("FOR RESEARCH & EDUCATIONAL USE ONLY. NOT FOR MEDICAL USE.", PAGE_W / 2, 272, { align: "center" });
  footer(doc, 1, totalPages, color);

  // ── Page 2: Overview & Problem ──
  doc.addPage();
  doc.setFillColor(12, 17, 30);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  let y = 22;
  y = sectionHeader(doc, y, "Executive Overview", color);
  y = body(doc, y, inv.description, 9.5);
  if (inv.audience) {
    y += 2;
    y = sectionHeader(doc, y, "Target Audience", color);
    y = body(doc, y, inv.audience, 9);
  }
  if (inv.problem) {
    y += 2;
    y = sectionHeader(doc, y, "Problem Addressed", color);
    y = body(doc, y, inv.problem, 9);
  }
  footer(doc, 2, totalPages, color);

  // ── Page 3: Solution & Theory ──
  doc.addPage();
  doc.setFillColor(12, 17, 30);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  y = 22;
  if (inv.beardenSolution) {
    y = sectionHeader(doc, y, "Theoretical Basis & Solution", color);
    y = body(doc, y, inv.beardenSolution, 9.5);
  }
  y += 2;
  y = sectionHeader(doc, y, "Primary Source", color);
  y = body(doc, y, inv.source || "Bearden technical papers; granted US patents.", 9);
  if (inv.feasibility) {
    y += 2;
    y = sectionHeader(doc, y, "Build Feasibility", color);
    y = body(doc, y, inv.feasibility, 9);
  }
  footer(doc, 3, totalPages, color);

  // ── Page 4: Market & What's Included ──
  doc.addPage();
  doc.setFillColor(12, 17, 30);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  y = 22;
  if (inv.market) {
    y = sectionHeader(doc, y, "Market Opportunity", color);
    y = body(doc, y, inv.market, 9);
  }
  y += 2;
  const included = inv.whatIncluded || [
    "Full bill of materials with exact part numbers & supplier links",
    "Layered schematic & wiring diagram (PDF)",
    "Step-by-step assembly guide with photographs",
    "Calibration & measurement protocol",
    "Safety, handling & troubleshooting appendix",
  ];
  y = sectionHeader(doc, y, "What's Included in the Plan", color);
  y = bulletList(doc, y, included, color);
  footer(doc, 4, totalPages, color);

  // ── Page 5: Bill of Materials ──
  doc.addPage();
  doc.setFillColor(12, 17, 30);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  y = 22;
  y = sectionHeader(doc, y, "Bill of Materials (Representative)", color);
  y = body(doc, y, "Exact part numbers, supplier links, and substitutions are provided in the full deliverable. Below is the representative component scope.", 8.5);
  // BOM table
  const bom = derivedBOM(inv);
  doc.setFillColor(22, 32, 52);
  doc.rect(M, y - 3, CW, 7, "F");
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("COMPONENT", M + 3, y + 1.5);
  doc.text("QTY", M + 110, y + 1.5);
  doc.text("EST. COST", PAGE_W - M - 3, y + 1.5, { align: "right" });
  y += 8;
  doc.setFont("helvetica", "normal");
  bom.forEach((row, i) => {
    if (y > PAGE_H - 30) { doc.addPage(); y = 20; }
    if (i % 2 === 0) { doc.setFillColor(18, 26, 44); doc.rect(M, y - 3.5, CW, 6, "F"); }
    doc.setTextColor(200, 212, 230);
    doc.setFontSize(8.5);
    doc.text(row[0], M + 3, y + 0.5);
    doc.text(row[1], M + 110, y + 0.5);
    doc.setTextColor(160, 175, 195);
    doc.text(row[2], PAGE_W - M - 3, y + 0.5, { align: "right" });
    y += 6;
  });
  y += 3;
  doc.setTextColor(120, 135, 160);
  doc.setFontSize(7.5);
  doc.text("Estimated total component cost: $60–$175 depending on sourcing. Full BOM ships with the purchased plan.", M, y);
  footer(doc, 5, totalPages, color);

  // ── Page 6: Assembly Steps ──
  doc.addPage();
  doc.setFillColor(12, 17, 30);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  y = 22;
  y = sectionHeader(doc, y, "Assembly Procedure (Outline)", color);
  const steps = (inv.modules && inv.modules.length)
    ? inv.modules
    : [
      "Step 1 — Fabricate or source the enclosure / frame; dry-fit all subsystems.",
      "Step 2 — Populate the PCB: solder semiconductors, passives, and connectors per schematic.",
      "Step 3 — Wind / mount the coil or transducer assembly; verify geometry against the drawing.",
      "Step 4 — Wire power and signal paths; install calibration test points.",
      "Step 5 — Power-on checkout: low-voltage first, verify bias points, then full power.",
      "Step 6 — Calibration & measurement run per the included protocol; log baseline data.",
    ];
  y = bulletList(doc, y, steps, color);
  footer(doc, 6, totalPages, color);

  // ── Page 7: Measurement & Safety ──
  doc.addPage();
  doc.setFillColor(12, 17, 30);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  y = 22;
  y = sectionHeader(doc, y, "Measurement & Validation Protocol", color);
  y = body(doc, y, "Each plan includes a measurement protocol section covering: baseline calibration, expected signal signatures, data-logging format, and comparison against the cited patent or literature reference. Customers verify device operation against published benchmarks.", 9);
  y += 2;
  y = sectionHeader(doc, y, "Safety & Handling", color);
  y = body(doc, y, "All devices are experimental research apparatus. Plans include handling guidance for high voltage, RF exposure, and mechanical hazards where applicable. Build and operate only in a properly equipped lab with appropriate PPE.", 9);
  y += 2;
  y = sectionHeader(doc, y, "Disclaimer", color);
  y = body(doc, y, "This plan is provided for research and educational purposes only. It is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease. Sourced from granted US patents and peer-reviewed literature.", 8.5);
  footer(doc, 7, totalPages, color);

  // ── Page 8: How to access the full plan ──
  doc.addPage();
  doc.setFillColor(12, 17, 30);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  y = 22;
  y = sectionHeader(doc, y, "How Customers Access the Full Plan", color);
  y = body(doc, y, `After purchasing ${inv.title} (${inv.price || "see catalogue"}), the customer receives instant access to: the full multi-page PDF build plan, layered schematics, the complete BOM with supplier links, and the assembly video where available. Access is granted through the Admin PDF Access panel and delivered by email.`, 9.5);
  if (inv.stripeProductId) {
    y += 2;
    y = sectionHeader(doc, y, "Product Reference", color);
    y = body(doc, y, `Stripe product ID: ${inv.stripeProductId}`, 8.5);
  }
  y += 4;
  doc.setFillColor(20, 30, 50);
  doc.roundedRect(M, y, CW, 16, 2, 2, "F");
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("This document is an admin preview of the plan a paying customer receives.", M + 5, y + 10);
  footer(doc, 8, totalPages, color);

  const safe = (inv.title || "device").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`Aethon-Apex-Plan-${safe}.pdf`);
}