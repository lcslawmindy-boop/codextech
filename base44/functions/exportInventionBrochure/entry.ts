import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { jsPDF } from 'npm:jspdf@4.0.0';

// ─── Brand colors ──────────────────────────────────────────────────────────
const C = {
  black: [10, 10, 14],
  darkGray: [22, 24, 30],
  midGray: [45, 48, 58],
  lightGray: [120, 130, 145],
  white: [255, 255, 255],
  blue: [59, 130, 246],
  cyan: [6, 182, 212],
  green: [34, 197, 94],
  purple: [168, 85, 247],
  yellow: [245, 158, 11],
  red: [239, 68, 68],
};

const ACCENT_COLORS = [C.blue, C.green, C.purple, C.yellow, C.cyan, C.red];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function setFill(doc, rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]); }
function setTextColor(doc, rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]); }
function setDraw(doc, rgb) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]); }

function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(String(text || ""), maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function addPageBackground(doc) {
  setFill(doc, C.black);
  doc.rect(0, 0, 297, 210, 'F');
  // Subtle grid overlay
  setDraw(doc, [25, 28, 36]);
  doc.setLineWidth(0.1);
  for (let x = 0; x < 297; x += 20) doc.line(x, 0, x, 210);
  for (let y = 0; y < 210; y += 20) doc.line(0, y, 297, y);
}

function addBrandFooter(doc, pageNum, total) {
  setFill(doc, C.midGray);
  doc.rect(0, 200, 297, 10, 'F');
  setTextColor(doc, C.lightGray);
  doc.setFontSize(7);
  doc.text("ZENITH APEX ADVANCED RESEARCH · BEARDEN SCALAR EM PORTFOLIO · CONFIDENTIAL", 10, 206);
  doc.text(`${pageNum} / ${total}`, 287, 206, { align: "right" });
}

function addSectionTag(doc, label, x, y, accent) {
  setFill(doc, accent);
  doc.roundedRect(x, y - 4, label.length * 1.6 + 6, 6, 1, 1, 'F');
  setTextColor(doc, C.white);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text(label.toUpperCase(), x + 3, y);
}

function coverPage(doc, inventions, generatedAt) {
  addPageBackground(doc);

  // Accent bar left
  setFill(doc, C.blue);
  doc.rect(0, 0, 4, 210, 'F');

  // Title block
  setTextColor(doc, C.cyan);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ZENITH APEX ADVANCED RESEARCH", 20, 30);

  setTextColor(doc, C.white);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("SCALAR EM", 20, 55);
  setTextColor(doc, C.cyan);
  doc.text("INVESTMENT", 20, 72);
  setTextColor(doc, C.white);
  doc.text("BROCHURE", 20, 89);

  // Divider
  setFill(doc, C.blue);
  doc.rect(20, 95, 60, 0.8, 'F');

  // Subtitle
  setTextColor(doc, C.lightGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${inventions.length} Novel Scalar EM Invention${inventions.length > 1 ? "s" : ""}`, 20, 105);
  doc.text("Grounded in Lt. Col. Thomas E. Bearden's Published Works", 20, 112);
  doc.text("Complete IP Valuation · Financial Projections · Launch Plans", 20, 119);

  // Summary stats box
  setFill(doc, C.midGray);
  doc.roundedRect(20, 130, 130, 45, 3, 3, 'F');
  setFill(doc, C.blue);
  doc.rect(20, 130, 4, 45, 'F');

  const totalAsk = inventions.reduce((s, inv) => {
    const n = parseFloat(String(inv.fundingAsk || "0").replace(/[^0-9.]/g, ""));
    return s + (isNaN(n) ? 0 : n);
  }, 0);
  const totalIPVal = inventions.reduce((s, inv) => {
    const n = parseFloat(String(inv.ipValuation || "0").replace(/[^0-9.]/g, ""));
    return s + (isNaN(n) ? 0 : n);
  }, 0);

  setTextColor(doc, C.lightGray);
  doc.setFontSize(7);
  doc.text("PORTFOLIO SUMMARY", 30, 138);

  const stats = [
    ["Inventions", inventions.length],
    ["Total Funding Ask", `$${totalAsk.toFixed(1)}M`],
    ["Combined IP Valuation", `$${totalIPVal.toFixed(1)}M`],
    ["Technology Domains", [...new Set(inventions.map(i => i.category))].length],
  ];
  stats.forEach(([label, val], i) => {
    setTextColor(doc, C.lightGray);
    doc.setFontSize(7);
    doc.text(label, 30, 148 + i * 7);
    setTextColor(doc, C.white);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(String(val), 120, 148 + i * 7, { align: "right" });
    doc.setFont("helvetica", "normal");
  });

  // Right: invention list preview
  setTextColor(doc, C.lightGray);
  doc.setFontSize(7);
  doc.text("INCLUDED INVENTIONS:", 165, 35);
  inventions.forEach((inv, i) => {
    const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
    setFill(doc, accent);
    doc.circle(168, 45 + i * 14, 2, 'F');
    setTextColor(doc, C.white);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    wrapText(doc, inv.name || `Invention ${i + 1}`, 173, 46 + i * 14, 110, 4);
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(`${inv.category || ""} · ${inv.ipValuation || ""}`, 173, 51 + i * 14);
  });

  // Date & confidential
  setTextColor(doc, C.lightGray);
  doc.setFontSize(7);
  doc.text(`Generated: ${generatedAt}`, 20, 195);
  doc.text("CONFIDENTIAL — Not for public distribution", 150, 195);
}

function analyticsPage(doc, inventions, pageNum, totalPages) {
  addPageBackground(doc);
  addBrandFooter(doc, pageNum, totalPages);

  setFill(doc, C.purple);
  doc.rect(0, 0, 4, 210, 'F');

  setTextColor(doc, C.purple);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("PORTFOLIO ANALYTICS", 15, 18);
  setTextColor(doc, C.white);
  doc.setFontSize(18);
  doc.text("Investment Overview", 15, 30);
  setFill(doc, C.purple);
  doc.rect(15, 34, 50, 0.6, 'F');

  // Top stat cards
  const totalAsk = inventions.reduce((s, inv) => s + (parseFloat(String(inv.fundingAsk || "0").replace(/[^0-9.]/g, "")) || 0), 0);
  const totalIPVal = inventions.reduce((s, inv) => s + (parseFloat(String(inv.ipValuation || "0").replace(/[^0-9.]/g, "")) || 0), 0);
  const totalRevY5 = inventions.reduce((s, inv) => s + (parseFloat(String(inv.fiveYrRevenue || "0").replace(/[^0-9.]/g, "")) || 0), 0);
  const avgEquity = inventions.reduce((s, inv) => s + (parseFloat(String(inv.equity || "0").replace(/[^0-9.%]/g, "")) || 0), 0) / (inventions.length || 1);

  const statCards = [
    { label: "Total Funding Ask", value: `$${totalAsk.toFixed(1)}M`, color: C.blue },
    { label: "Combined IP Value", value: `$${totalIPVal.toFixed(1)}M`, color: C.green },
    { label: "5-Year Revenue (Combined)", value: `$${totalRevY5.toFixed(1)}M`, color: C.yellow },
    { label: "Avg. Equity Offered", value: `${avgEquity.toFixed(1)}%`, color: C.purple },
  ];

  statCards.forEach((card, i) => {
    const x = 15 + i * 68;
    setFill(doc, C.midGray);
    doc.roundedRect(x, 42, 62, 28, 2, 2, 'F');
    setFill(doc, card.color);
    doc.rect(x, 42, 3, 28, 'F');
    setTextColor(doc, card.color);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(card.value, x + 8, 56);
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(card.label, x + 8, 63);
  });

  // Category breakdown
  const categoryMap = {};
  inventions.forEach(inv => { categoryMap[inv.category] = (categoryMap[inv.category] || 0) + 1; });
  const categories = Object.entries(categoryMap);

  setTextColor(doc, C.lightGray);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("DOMAIN BREAKDOWN", 15, 85);

  categories.forEach(([cat, count], i) => {
    const pct = (count / inventions.length) * 100;
    const barW = (pct / 100) * 100;
    const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
    const y = 92 + i * 10;

    setTextColor(doc, C.white);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(cat, 15, y + 4);

    setFill(doc, C.midGray);
    doc.roundedRect(90, y, 100, 5, 1, 1, 'F');
    setFill(doc, accent);
    doc.roundedRect(90, y, barW, 5, 1, 1, 'F');

    setTextColor(doc, accent);
    doc.setFontSize(6.5);
    doc.text(`${count} invention${count > 1 ? "s" : ""} (${pct.toFixed(0)}%)`, 196, y + 4);
  });

  // Invention comparison table
  const tableY = 85 + categories.length * 10 + 15;
  setTextColor(doc, C.lightGray);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("INVENTION COMPARISON MATRIX", 15, tableY);

  const headers = ["Invention", "Category", "Stage", "IP Valuation", "Funding Ask", "5-Yr Rev"];
  const colWidths = [65, 45, 28, 30, 28, 28];
  const startX = 15;
  let cx = startX;

  setFill(doc, C.midGray);
  doc.rect(startX, tableY + 4, 267, 7, 'F');

  headers.forEach((h, i) => {
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(h, cx + 2, tableY + 9);
    cx += colWidths[i];
  });

  inventions.forEach((inv, ri) => {
    const rowY = tableY + 14 + ri * 9;
    if (ri % 2 === 1) {
      setFill(doc, [18, 20, 26]);
      doc.rect(startX, rowY - 4, 267, 9, 'F');
    }
    const accent = ACCENT_COLORS[ri % ACCENT_COLORS.length];
    setFill(doc, accent);
    doc.rect(startX, rowY - 4, 2, 9, 'F');

    const rowData = [inv.name, inv.category, inv.stage, inv.ipValuation, inv.fundingAsk, inv.fiveYrRevenue];
    let rcx = startX;
    rowData.forEach((val, ci) => {
      setTextColor(doc, ci === 0 ? C.white : C.lightGray);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", ci === 0 ? "bold" : "normal");
      const clamped = doc.splitTextToSize(String(val || ""), colWidths[ci] - 4)[0];
      doc.text(clamped, rcx + 4, rowY);
      rcx += colWidths[ci];
    });
  });
}

function inventionPage(doc, inv, index, pageNum, totalPages) {
  addPageBackground(doc);
  addBrandFooter(doc, pageNum, totalPages);

  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  // Left accent bar
  setFill(doc, accent);
  doc.rect(0, 0, 4, 210, 'F');

  // Header band
  setFill(doc, C.midGray);
  doc.rect(4, 0, 293, 38, 'F');
  setFill(doc, accent);
  doc.rect(4, 35, 293, 2, 'F');

  setTextColor(doc, accent);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(`INVENTION ${(index + 1).toString().padStart(2, "0")} · ${(inv.category || "").toUpperCase()}`, 15, 12);

  setTextColor(doc, C.white);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(inv.name || "Untitled Invention", 180);
  doc.text(titleLines, 15, 22);

  // Tagline
  setTextColor(doc, C.lightGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(`"${inv.tagline || ""}"`, 15, 32);

  // KPI row
  const kpis = [
    { label: "IP Valuation", value: inv.ipValuation, color: C.green },
    { label: "Funding Ask", value: inv.fundingAsk, color: C.blue },
    { label: "Equity", value: inv.equity, color: C.purple },
    { label: "Stage", value: inv.stage, color: C.yellow },
    { label: "5-Yr Revenue", value: inv.fiveYrRevenue, color: C.cyan },
  ];
  kpis.forEach((kpi, i) => {
    const x = 15 + i * 56;
    setFill(doc, C.darkGray);
    doc.roundedRect(x, 42, 50, 16, 1.5, 1.5, 'F');
    setFill(doc, kpi.color);
    doc.rect(x, 42, 2, 16, 'F');
    setTextColor(doc, kpi.color);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(String(kpi.value || ""), x + 5, 51);
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(kpi.label, x + 5, 56);
  });

  // ── Left column ──────────────────────────────────────────────────────────
  const LX = 15;
  let ly = 68;

  // Overview
  addSectionTag(doc, "Overview", LX, ly, accent);
  ly += 6;
  setTextColor(doc, C.lightGray);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(inv.description || "", 130);
  doc.text(descLines, LX, ly);
  ly += descLines.length * 3.5 + 4;

  // Problem / Solution
  setFill(doc, C.darkGray);
  doc.roundedRect(LX, ly, 130, 22, 2, 2, 'F');
  setFill(doc, C.red);
  doc.rect(LX, ly, 2, 22, 'F');
  setTextColor(doc, C.red);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("PROBLEM", LX + 5, ly + 6);
  setTextColor(doc, C.lightGray);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  const probLines = doc.splitTextToSize(inv.problem || "", 120);
  doc.text(probLines.slice(0, 2), LX + 5, ly + 12);
  ly += 26;

  setFill(doc, C.darkGray);
  doc.roundedRect(LX, ly, 130, 22, 2, 2, 'F');
  setFill(doc, C.green);
  doc.rect(LX, ly, 2, 22, 'F');
  setTextColor(doc, C.green);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("SOLUTION", LX + 5, ly + 6);
  setTextColor(doc, C.lightGray);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  const solLines = doc.splitTextToSize(inv.solution || "", 120);
  doc.text(solLines.slice(0, 2), LX + 5, ly + 12);
  ly += 26;

  // Market size
  addSectionTag(doc, "Market Size", LX, ly, accent);
  ly += 6;
  setTextColor(doc, C.lightGray);
  doc.setFontSize(7);
  const mktLines = doc.splitTextToSize(inv.marketSize || "", 130);
  doc.text(mktLines.slice(0, 3), LX, ly);
  ly += mktLines.slice(0, 3).length * 3.5 + 4;

  // Bearden principles
  addSectionTag(doc, "Bearden Principles", LX, ly, accent);
  ly += 6;
  (inv.principles || []).slice(0, 6).forEach((p, i) => {
    setFill(doc, accent);
    doc.circle(LX + 2, ly + 1, 1, 'F');
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6.5);
    doc.text(p, LX + 6, ly + 2);
    ly += 5;
  });

  // ── Right column ─────────────────────────────────────────────────────────
  const RX = 155;
  let ry = 68;

  // Tech specs
  addSectionTag(doc, "Technical Specs", RX, ry, accent);
  ry += 6;
  (inv.specs || []).slice(0, 7).forEach((spec, i) => {
    setFill(doc, i % 2 === 0 ? C.darkGray : [14, 16, 20]);
    doc.rect(RX, ry - 3, 130, 6, 'F');
    setTextColor(doc, accent);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(String(spec.label || ""), RX + 2, ry + 1);
    setTextColor(doc, C.white);
    doc.setFont("helvetica", "normal");
    const vText = doc.splitTextToSize(String(spec.value || ""), 80)[0];
    doc.text(vText, RX + 50, ry + 1);
    ry += 7;
  });
  ry += 4;

  // IP Box
  addSectionTag(doc, "IP & Patents", RX, ry, accent);
  ry += 6;
  setFill(doc, C.darkGray);
  doc.roundedRect(RX, ry, 130, 28, 2, 2, 'F');

  const ipFields = [
    ["IP Type", inv.ipType],
    ["Valuation Method", inv.valuationMethod],
    ["Valuation", inv.ipValuation],
  ];
  ipFields.forEach(([k, v], i) => {
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(k, RX + 4, ry + 8 + i * 8);
    setTextColor(doc, C.white);
    doc.setFont("helvetica", "normal");
    doc.text(String(v || ""), RX + 45, ry + 8 + i * 8);
  });
  ry += 32;

  // Filing jurisdictions
  addSectionTag(doc, "Filing Jurisdictions", RX, ry, accent);
  ry += 6;
  let jx = RX;
  (inv.jurisdictions || []).forEach((j, i) => {
    setFill(doc, accent);
    doc.roundedRect(jx, ry - 3, j.length * 2.2 + 6, 6, 1, 1, 'F');
    setTextColor(doc, C.white);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(j, jx + 3, ry + 1);
    jx += j.length * 2.2 + 10;
    if (jx > 270) { jx = RX; ry += 8; }
  });
  ry += 10;

  // Financial mini-table (Year 1-3 only)
  addSectionTag(doc, "Financial Projections", RX, ry, accent);
  ry += 6;
  setFill(doc, C.midGray);
  doc.rect(RX, ry, 130, 6, 'F');
  const fHeaders = ["Year", "Revenue", "EBITDA", "Cum. Inv."];
  const fWidths = [20, 37, 37, 36];
  let fhx = RX;
  fHeaders.forEach((h, i) => {
    setTextColor(doc, C.lightGray);
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "bold");
    doc.text(h, fhx + 2, ry + 4);
    fhx += fWidths[i];
  });
  ry += 7;

  (inv.financials?.projections || []).slice(0, 4).forEach((row, ri) => {
    if (ri % 2 === 0) { setFill(doc, [16, 18, 24]); doc.rect(RX, ry, 130, 5.5, 'F'); }
    const cells = [row.year, row.revenue, row.ebitda, row.cumulativeInvestment];
    let frx = RX;
    cells.forEach((val, ci) => {
      setTextColor(doc, ci === 0 ? C.white : ci === 2 ? C.green : C.lightGray);
      doc.setFontSize(6);
      doc.setFont("helvetica", ci === 0 ? "bold" : "normal");
      doc.text(String(val || ""), frx + 2, ry + 4);
      frx += fWidths[ci];
    });
    ry += 6;
  });
}

function launchPage(doc, inv, index, pageNum, totalPages) {
  addPageBackground(doc);
  addBrandFooter(doc, pageNum, totalPages);

  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  setFill(doc, accent);
  doc.rect(0, 0, 4, 210, 'F');

  // Header
  setFill(doc, C.darkGray);
  doc.rect(4, 0, 293, 24, 'F');
  setTextColor(doc, accent);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(`${(inv.name || "").toUpperCase()} · LAUNCH & BUSINESS PLAN`, 15, 10);
  setTextColor(doc, C.white);
  doc.setFontSize(13);
  doc.text("Go-to-Market & Financial Plan", 15, 20);

  let y = 34;

  // Launch phases
  addSectionTag(doc, "Launch Plan", 15, y, accent);
  y += 6;

  const phases = inv.launchPlan || [];
  phases.slice(0, 5).forEach((phase, i) => {
    const phaseAccent = ACCENT_COLORS[(index + i + 1) % ACCENT_COLORS.length];
    setFill(doc, C.darkGray);
    doc.roundedRect(15, y, 175, 22, 2, 2, 'F');
    setFill(doc, phaseAccent);
    doc.rect(15, y, 3, 22, 'F');

    setTextColor(doc, C.white);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(phase.phase || `Phase ${i + 1}`, 22, y + 7);

    setFill(doc, phaseAccent);
    const tlLabel = phase.timeline || "";
    doc.roundedRect(140, y + 2, tlLabel.length * 1.5 + 6, 6, 1, 1, 'F');
    setTextColor(doc, C.white);
    doc.setFontSize(5.5);
    doc.text(tlLabel, 143, y + 6.5);

    setTextColor(doc, C.lightGray);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    const actionLines = doc.splitTextToSize(phase.actions || "", 168);
    doc.text(actionLines.slice(0, 2), 22, y + 13);

    if (phase.milestone) {
      setTextColor(doc, phaseAccent);
      doc.setFontSize(6);
      doc.text(`✓ ${phase.milestone}`, 22, y + 21);
    }
    y += 26;
  });

  // Full financial table (right side)
  const RX = 200;
  let ry = 34;

  addSectionTag(doc, "5-Year P&L", RX, ry, accent);
  ry += 6;

  const fCols = ["Year", "Revenue", "EBITDA"];
  const fw = [20, 35, 35];
  setFill(doc, C.midGray);
  doc.rect(RX, ry, 92, 7, 'F');
  let fx = RX;
  fCols.forEach((h, i) => {
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(h, fx + 2, ry + 5);
    fx += fw[i];
  });
  ry += 8;

  (inv.financials?.projections || []).forEach((row, ri) => {
    if (ri % 2 === 0) { setFill(doc, C.darkGray); doc.rect(RX, ry - 1, 92, 7, 'F'); }
    const cells = [row.year, row.revenue, row.ebitda];
    let rcx = RX;
    cells.forEach((val, ci) => {
      setTextColor(doc, ci === 2 ? C.green : ci === 0 ? C.white : C.lightGray);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", ci === 0 ? "bold" : "normal");
      doc.text(String(val || ""), rcx + 2, ry + 4);
      rcx += fw[ci];
    });
    ry += 8;
  });

  // Assumptions
  ry += 4;
  addSectionTag(doc, "Key Assumptions", RX, ry, accent);
  ry += 6;
  (inv.financials?.assumptions || []).slice(0, 5).forEach((a, i) => {
    setFill(doc, accent);
    doc.circle(RX + 2, ry, 1, 'F');
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(a, 85);
    doc.text(lines[0], RX + 6, ry + 1);
    ry += 6;
  });

  // Channels
  let cy = y + 8;
  addSectionTag(doc, "Go-to-Market Channels", 15, cy, accent);
  cy += 8;
  (inv.channels || []).forEach((ch, i) => {
    const chAccent = ACCENT_COLORS[(i + 2) % ACCENT_COLORS.length];
    const cw = ch.length * 2 + 10;
    setFill(doc, C.darkGray);
    doc.roundedRect(15 + (i % 3) * 60, cy + Math.floor(i / 3) * 12, 55, 8, 1, 1, 'F');
    setFill(doc, chAccent);
    doc.rect(15 + (i % 3) * 60, cy + Math.floor(i / 3) * 12, 2, 8, 'F');
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6.5);
    doc.text(ch, 20 + (i % 3) * 60, cy + Math.floor(i / 3) * 12 + 5);
  });
}

function closingPage(doc, inventions, pageNum, totalPages) {
  addPageBackground(doc);
  addBrandFooter(doc, pageNum, totalPages);

  setFill(doc, C.cyan);
  doc.rect(0, 0, 4, 210, 'F');

  setTextColor(doc, C.cyan);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("NEXT STEPS", 15, 25);
  setTextColor(doc, C.white);
  doc.setFontSize(22);
  doc.text("Ready to Invest in", 15, 40);
  doc.text("Scalar Energy's Future?", 15, 54);

  setFill(doc, C.cyan);
  doc.rect(15, 58, 80, 1, 'F');

  const steps = [
    { n: "01", title: "Sign NDA", body: "Execute confidentiality agreement to receive full technical documentation and proprietary research files." },
    { n: "02", title: "Technical Review", body: "30-day due diligence period with access to all Bearden source documents, MEG replication data, and patent filings." },
    { n: "03", title: "Term Sheet", body: "Negotiate investment terms. Preferred equity structure available. Co-inventor arrangements possible for technical contributors." },
    { n: "04", title: "Fund & Build", body: "Tranche-based funding tied to technical milestones. Advisory board positions available to lead investors." },
  ];

  steps.forEach((s, i) => {
    const x = 15 + (i % 2) * 138;
    const y = 70 + Math.floor(i / 2) * 50;
    setFill(doc, C.midGray);
    doc.roundedRect(x, y, 128, 38, 3, 3, 'F');
    setFill(doc, C.cyan);
    doc.rect(x, y, 3, 38, 'F');
    setTextColor(doc, C.cyan);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(s.n, x + 8, y + 15);
    setTextColor(doc, C.white);
    doc.setFontSize(9);
    doc.text(s.title, x + 8, y + 24);
    setTextColor(doc, C.lightGray);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(s.body, 112);
    doc.text(lines.slice(0, 2), x + 8, y + 31);
  });

  setTextColor(doc, C.lightGray);
  doc.setFontSize(7);
  doc.text("Contact: research@zenithapex.com  |  zenithapex.com/investors", 15, 185);
  setTextColor(doc, C.midGray);
  doc.setFontSize(6.5);
  doc.text("Based on Lt. Col. Thomas E. Bearden's published works. All IP valuations are estimates. Consult a registered patent attorney before filing.", 15, 192);
}

// ─── Main handler ──────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { inventions, title } = await req.json();
    if (!inventions?.length) return Response.json({ error: "No inventions provided" }, { status: 400 });

    console.log(`Generating brochure PDF for ${inventions.length} inventions, user: ${user.email}`);

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const generatedAt = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    // Count total pages: cover + analytics + (2 pages per invention) + closing
    const totalPages = 1 + 1 + inventions.length * 2 + 1;
    let pageNum = 1;

    // Cover
    coverPage(doc, inventions, generatedAt);
    pageNum++;

    // Analytics overview
    doc.addPage();
    analyticsPage(doc, inventions, pageNum, totalPages);
    pageNum++;

    // Per-invention pages
    inventions.forEach((inv, i) => {
      doc.addPage();
      inventionPage(doc, inv, i, pageNum, totalPages);
      pageNum++;

      doc.addPage();
      launchPage(doc, inv, i, pageNum, totalPages);
      pageNum++;
    });

    // Closing CTA
    doc.addPage();
    closingPage(doc, inventions, pageNum, totalPages);

    const pdfBytes = doc.output("arraybuffer");
    const safeTitle = (title || "scalar-em-investment-brochure").toLowerCase().replace(/[^a-z0-9]/g, "-");

    console.log(`PDF generated: ${pdfBytes.byteLength} bytes, ${totalPages} pages`);

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeTitle}.pdf"`,
        "Access-Control-Expose-Headers": "Content-Disposition",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});