import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { BookOpen, Loader2, Settings, CheckSquare, Square, ChevronDown, ChevronUp, Clock, BarChart2, X } from "lucide-react";
import { DD_SECTIONS } from "../lib/dueDiligenceSections";

// ── VERSION CONTROL ───────────────────────────────────────────────────────────
const CURRENT_VERSION = "3.2.0";
const CHANGELOG = [
  { version: "3.2.0", date: "2026-04-13", changes: ["Added KRCIC and UBDRS biophysics device architectures", "Added legal compliance infrastructure asset", "Updated platform total valuation to $5.8M–$13.5M", "Expanded suppressed inventor archive to 7 researchers"] },
  { version: "3.1.0", date: "2026-03-15", changes: ["Added 26 device build plans with PDF/video export", "Updated 5-year P&L with B2B licensing streams", "Added SBIR Phase II award documentation ($480K)"] },
  { version: "3.0.0", date: "2026-02-01", changes: ["Added AI Module Architecture section (Section 2)", "Integrated AI Market Research Scanner documentation", "Added USPTO Provisional Patent Drafter specs"] },
  { version: "2.0.0", date: "2025-11-20", changes: ["Added Government Validation Dossier (Section 9)", "Expanded peer review consortium analysis", "Added acquisition process 8-step workflow"] },
  { version: "1.0.0", date: "2025-09-01", changes: ["Initial due diligence package", "12 sections, 60+ subsections", "Base valuation $3.9M"] },
];

// ── SOURCE DOCUMENT LINKS ─────────────────────────────────────────────────────
const SOURCE_LINKS = [
  { label: "Anastasovski et al. (2001) — Foundations of Physics Letters 14(1)", url: "https://link.springer.com/journal/10701" },
  { label: "Bohren (1983) — Am. J. Phys. 51(4)", url: "https://doi.org/10.1119/1.13262" },
  { label: "US Patent 6,362,718 (MEG — Bearden et al.)", url: "https://patents.google.com/patent/US6362718B1" },
  { label: "USPTO SBIR Award Database", url: "https://www.sbir.gov" },
  { label: "ONR London Branch Report R-5-78 (FOIA request to Dept. of Navy)", url: "https://www.onr.navy.mil" },
  { label: "Grand View Research — AI IP Generation Market", url: "https://www.grandviewresearch.com" },
  { label: "DoD SBIR/STTR Program", url: "https://www.dodsbirpawards.com" },
  { label: "Fröhlich (1973) — Collective Phenomena Vol. 1", url: "https://scholar.google.com/scholar?q=frohlich+long+range+coherence+biological+systems" },
];

// ── FINANCIAL DATA FOR CHARTS ─────────────────────────────────────────────────
const FINANCIAL_DATA = {
  revenue: [1343277, 3890062, 6600000, 9800000, 14500000],
  ebitda: [478353, 2145453, 3630000, 5488000, 8410000],
  streams: [
    { label: "Subscriptions", value: 37, color: [59, 130, 246] },
    { label: "AI Module Licensing", value: 25, color: [34, 197, 94] },
    { label: "Platform Licensing", value: 18, color: [168, 85, 247] },
    { label: "Govt Grants", value: 11, color: [245, 158, 11] },
    { label: "Courses & Kits", value: 6, color: [239, 68, 68] },
    { label: "Other", value: 3, color: [100, 116, 139] },
  ],
  tam: [
    { label: "AI IP Tools", value: 14.2, color: [59, 130, 246] },
    { label: "Longevity Biotech", value: 85, color: [34, 197, 94] },
    { label: "Defense DE", value: 9.3, color: [239, 68, 68] },
    { label: "Academic Research", value: 12, color: [168, 85, 247] },
    { label: "IP Analytics", value: 3.8, color: [245, 158, 11] },
  ],
};

// ── PDF THEMES ───────────────────────────────────────────────────────────────
const PDF_THEMES = [
  {
    id: 'navy-gold',
    label: 'Navy & Gold',
    preview: ['#0F2346', '#B48C32'],
    NAVY: [15, 35, 70], GOLD: [180, 140, 50], SLATE: [55, 70, 95],
    TEXT: [28, 32, 40], LIGHT: [240, 242, 246], ACCENT: [230, 236, 248], WHITE: [255, 255, 255],
    bar1: [30, 60, 140], bar2: [30, 130, 80], bar3: [100, 60, 180],
    mono: false,
  },
  {
    id: 'black-white',
    label: 'Black & White',
    preview: ['#111111', '#888888'],
    NAVY: [20, 20, 20], GOLD: [90, 90, 90], SLATE: [50, 50, 50],
    TEXT: [30, 30, 30], LIGHT: [242, 242, 242], ACCENT: [232, 232, 232], WHITE: [255, 255, 255],
    bar1: [60, 60, 60], bar2: [120, 120, 120], bar3: [160, 160, 160],
    mono: true,
  },
  {
    id: 'executive-red',
    label: 'Executive Red',
    preview: ['#7B1414', '#C85028'],
    NAVY: [100, 18, 18], GOLD: [200, 80, 40], SLATE: [90, 25, 25],
    TEXT: [28, 20, 20], LIGHT: [255, 242, 240], ACCENT: [255, 236, 232], WHITE: [255, 255, 255],
    bar1: [180, 40, 40], bar2: [210, 100, 60], bar3: [240, 150, 80],
    mono: false,
  },
  {
    id: 'forest-green',
    label: 'Forest Green',
    preview: ['#14462A', '#4A9660'],
    NAVY: [20, 60, 38], GOLD: [74, 150, 96], SLATE: [28, 72, 46],
    TEXT: [20, 35, 25], LIGHT: [232, 248, 237], ACCENT: [220, 245, 228], WHITE: [255, 255, 255],
    bar1: [30, 120, 70], bar2: [60, 160, 100], bar3: [90, 190, 130],
    mono: false,
  },
  {
    id: 'slate-corporate',
    label: 'Slate Corporate',
    preview: ['#2D3748', '#6480A0'],
    NAVY: [45, 55, 75], GOLD: [100, 128, 165], SLATE: [60, 72, 95],
    TEXT: [35, 40, 55], LIGHT: [238, 241, 248], ACCENT: [228, 234, 246], WHITE: [255, 255, 255],
    bar1: [70, 100, 160], bar2: [80, 140, 130], bar3: [120, 90, 170],
    mono: false,
  },
];

// ── CHART DRAWING HELPERS ─────────────────────────────────────────────────────
function drawBarChart(doc, x, y, w, h, data, labels, title, colorRGB, formatFn) {
  // Title
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0, 0, 0);
  doc.text(title, x + w / 2, y - 4, { align: "center" });

  const max = Math.max(...data);
  const barW = (w - 20) / data.length - 4;
  const chartH = h - 20;
  const chartY = y + chartH;

  // Axes
  doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.4);
  doc.line(x + 10, y, x + 10, chartY);
  doc.line(x + 10, chartY, x + w, chartY);

  // Grid lines (4)
  doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.2);
  for (let g = 1; g <= 4; g++) {
    const gy = chartY - (chartH * g) / 4;
    doc.line(x + 10, gy, x + w, gy);
    doc.setFont("helvetica", "normal"); doc.setFontSize(6); doc.setTextColor(120, 120, 120);
    doc.text(formatFn(max * g / 4), x + 8, gy + 1, { align: "right" });
  }

  // Bars
  data.forEach((val, i) => {
    const bx = x + 12 + i * (barW + 4);
    const bh = (val / max) * chartH;
    const by = chartY - bh;
    doc.setFillColor(...colorRGB);
    doc.rect(bx, by, barW, bh, "F");
    // Value label
    doc.setFont("helvetica", "bold"); doc.setFontSize(6); doc.setTextColor(0, 0, 0);
    doc.text(formatFn(val), bx + barW / 2, by - 1.5, { align: "center" });
    // X label
    doc.setFont("helvetica", "normal"); doc.setFontSize(6); doc.setTextColor(80, 80, 80);
    doc.text(labels[i], bx + barW / 2, chartY + 5, { align: "center" });
  });
}

function drawPieChart(doc, cx, cy, r, segments, title) {
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0, 0, 0);
  doc.text(title, cx, cy - r - 6, { align: "center" });

  let angle = -Math.PI / 2;
  segments.forEach(seg => {
    const slice = (seg.value / 100) * 2 * Math.PI;
    const endAngle = angle + slice;
    const midAngle = angle + slice / 2;
    // Draw wedge via polygon approximation (jsPDF doesn't have native arc fill)
    const steps = Math.max(6, Math.round(slice * 20));
    const pts = [[cx, cy]];
    for (let s = 0; s <= steps; s++) {
      const a = angle + (slice * s) / steps;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    doc.setFillColor(...seg.color);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    // Draw as lines
    doc.lines(pts.slice(1).map((p, i) => {
      const prev = i === 0 ? pts[0] : pts[i];
      return [p[0] - prev[0], p[1] - prev[1]];
    }), pts[0][0], pts[0][1], [1, 1], "FD");
    angle = endAngle;
  });

  // Legend
  let lx = cx + r + 8;
  let ly = cy - r;
  segments.forEach(seg => {
    doc.setFillColor(...seg.color);
    doc.rect(lx, ly, 4, 4, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(30, 30, 30);
    doc.text(`${seg.label} (${seg.value}%)`, lx + 6, ly + 3.5);
    ly += 8;
  });
}

// ── PDF GENERATION ────────────────────────────────────────────────────────────
function generateDueDiligencePDF(selectedSections, includeCharts, theme = PDF_THEMES[0]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 20;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 0;
  let currentSectionLabel = '';

  // ── THEME ─────────────────────────────────────────────────────────────────
  const { NAVY, GOLD, SLATE, TEXT, LIGHT, ACCENT, WHITE } = theme;

  // ── SANITIZE ──────────────────────────────────────────────────────────────
  const clean = (txt) => String(txt || '')
    .replace(/!'/g, '→')
    .replace(/"d/g, '≤').replace(/"e/g, '≥')
    .replace(/Æ/g, 'φ').replace(/Â/g, '')
    .replace(/ÿ/g, '').replace(/[\u0080-\u009F]/g, '')
    .replace(/%%%+/g, '─────────────────────────────────')
    .replace(/─{10,}/g, '')  // remove long dash lines (will be replaced by rule())
    .trim();

  const bg = () => { doc.setFillColor(...WHITE); doc.rect(0, 0, pageW, 297, 'F'); };

  const drawRunningHeader = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageW, 14, 'F');
    doc.setFillColor(...GOLD);
    doc.rect(0, 14, pageW, 1.2, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
    doc.text('ZENITH APEX RESEARCH PORTFOLIO  ·  TECHNICAL DUE DILIGENCE PACKAGE', margin, 9);
    doc.setFont('helvetica', 'normal');
    doc.text(`v${CURRENT_VERSION}  ·  ${currentSectionLabel || 'CONFIDENTIAL'}`, pageW - margin, 9, { align: 'right' });
  };

  const drawFooter = () => {
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFillColor(...NAVY);
      doc.rect(0, 285, pageW, 12, 'F');
      doc.setFillColor(...GOLD);
      doc.rect(0, 285, pageW, 1, 'F');
      doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(180, 190, 210);
      doc.text('ZENITH APEX  ·  CONFIDENTIAL  ·  UNAUTHORIZED DISCLOSURE SUBJECT TO $2.5M LIQUIDATED DAMAGES', pageW / 2, 291, { align: 'center' });
      doc.text(`Page ${p} of ${total}`, pageW - margin, 291, { align: 'right' });
      doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, 291);
    }
  };

  const addPage = () => { doc.addPage(); bg(); drawRunningHeader(); y = 24; };
  const check = (need = 14) => { if (y + need > 281) addPage(); };

  const rule = () => {
    check(8);
    doc.setDrawColor(210, 215, 225); doc.setLineWidth(0.25);
    doc.line(margin, y, pageW - margin, y); y += 7;
  };

  const sectionDivider = (text, subtitle) => {
    if (y > 60) addPage();
    else { check(32); }
    doc.setFillColor(...NAVY);
    doc.rect(0, y - 4, pageW, 26, 'F');
    doc.setFillColor(...GOLD); doc.rect(0, y + 22, pageW, 1.5, 'F');
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
    doc.text(text, margin, y + 9);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(180, 200, 230);
    doc.text(subtitle, margin, y + 18);
    y += 32;
  };

  const subHeading = (text) => {
    check(18);
    doc.setFillColor(...ACCENT);
    doc.rect(margin - 2, y - 2, contentW + 4, 13, 'F');
    doc.setFillColor(...GOLD); doc.rect(margin - 2, y - 2, 3, 13, 'F');
    doc.setFontSize(10.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...SLATE);
    doc.text(clean(text), margin + 5, y + 7);
    y += 17;
  };

  const para = (rawText) => {
    const text = clean(rawText);
    // Split into logical lines first (newline-delimited blocks)
    const segments = text.split('\n').filter(s => s.trim());
    segments.forEach(seg => {
      const trimmed = seg.trim();
      // Skip pure divider lines
      if (/^[─—\-=]{5,}$/.test(trimmed)) { rule(); return; }
      const lines = doc.splitTextToSize(trimmed, contentW - 4);
      // Detect heading-like lines
      const isHeadline = (
        (trimmed.length < 70 && /^[A-Z][A-Z\s\d&\.\/\-:,()]+[:\s]/.test(trimmed) &&
          (trimmed === trimmed.toUpperCase() || trimmed.endsWith(':')))
        || /^\[\s*\]/.test(trimmed)
        || /^(STREAM|STRUCTURE|RISK|VERTICAL|PHASE|STEP|LAYER|REASON|PUBLICATION|YEAR|CATEGORY)\s+[\dA-Z]/.test(trimmed)
        || /^(PLATFORM TOTAL|KEY UNIT|VALUATION CONCLUSION|PAYMENT STRUCTURES|FINANCIAL PACKAGE|LEGAL PACKAGE|ENGINEERING:|DATA:|TECHNOLOGY:|INTELLECTUAL PROPERTY:|TRANSITION:)/.test(trimmed)
      );
      lines.forEach((l, li) => {
        check(8);
        if (isHeadline && li === 0) {
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...SLATE);
          doc.text(l, margin + 2, y); y += 7;
        } else {
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...TEXT);
          const indent = trimmed.startsWith('—') || trimmed.startsWith('•') || trimmed.startsWith('→') ? margin + 6 : margin + 2;
          doc.text(l, indent, y); y += 6.5;
        }
      });
      y += 1.5;
    });
    y += 3;
  };

  // ── CLICKABLE LINK HELPER ──────────────────────────────────────────────────
  const addLink = (labelText, url) => {
    check(10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(40, 90, 180);
    const linkText = `→  ${labelText}`;
    doc.textWithLink(linkText, margin + 4, y, { url });
    const lw = doc.getTextWidth(linkText);
    doc.setDrawColor(40, 90, 180); doc.setLineWidth(0.15);
    doc.line(margin + 4, y + 1, margin + 4 + lw, y + 1);
    y += 9;
  };

  // ── COVER PAGE ─────────────────────────────────────────────────────────────
  bg();
  // Top navy band
  doc.setFillColor(...NAVY); doc.rect(0, 0, pageW, 80, 'F');
  doc.setFillColor(...GOLD); doc.rect(0, 80, pageW, 2, 'F');
  // Left accent stripe
  doc.setFillColor(...GOLD); doc.rect(0, 0, 5, 297, 'F');

  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 180, 220);
  doc.text('ZENITH APEX RESEARCH PORTFOLIO', pageW / 2, 18, { align: 'center' });
  doc.text('Advanced Research  ·  Intellectual Property  ·  AI-Powered Innovation', pageW / 2, 27, { align: 'center' });
  doc.text(`Q2 2026  ·  Document Version ${CURRENT_VERSION}`, pageW / 2, 36, { align: 'center' });

  doc.setFontSize(28); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
  doc.text('TECHNICAL DUE DILIGENCE', pageW / 2, 56, { align: 'center' });
  doc.setFontSize(15); doc.setFont('helvetica', 'normal'); doc.setTextColor(...GOLD);
  doc.text('INVESTMENT PACKAGE', pageW / 2, 70, { align: 'center' });

  y = 95;
  doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
  doc.text('Comprehensive Technical, IP, Financial & Market Analysis', pageW / 2, y, { align: 'center' });
  y += 8;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 110, 130);
  doc.text(`${selectedSections.length} of 12 Sections  ·  26 Device Architectures  ·  8 Revenue Streams`, pageW / 2, y, { align: 'center' });
  y += 14;

  // Valuation box
  doc.setFillColor(245, 247, 252);
  doc.roundedRect(margin, y, contentW, 52, 3, 3, 'F');
  doc.setDrawColor(...NAVY); doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentW, 52, 3, 3, 'D');
  doc.setFillColor(...NAVY); doc.roundedRect(margin, y, contentW, 12, 3, 3, 'F');
  doc.rect(margin, y + 9, contentW, 3, 'F'); // square off bottom corners of header
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
  doc.text('PLATFORM FAIR MARKET VALUATION (Q2 2026)  ─  ASSET-BY-ASSET DCF', margin + 6, y + 8);

  doc.setFontSize(24); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
  doc.text('$5.8M – $13.5M', margin + 6, y + 27);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(90, 100, 120);
  doc.text('Conservative DCF · 15 assets incl. KRCIC, UBDRS & legal compliance', margin + 6, y + 36);

  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(...GOLD);
  doc.text('$7.5M – $22M', pageW - margin - 6, y + 27, { align: 'right' });
  doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(90, 100, 120);
  doc.text('ACQUISITION ASKING PRICE', pageW - margin - 6, y + 36, { align: 'right' });
  y += 60;

  // Stats row
  const stats = [['26','Device\nArchitectures'],['12','Sections'],['200+','KG Nodes'],['8','Revenue\nStreams'],['$630K','SBIR\nFunding'],['40+','Yrs Research']];
  const colW = contentW / stats.length;
  stats.forEach(([val, lbl], i) => {
    const cx = margin + i * colW + colW / 2;
    if (i > 0) { doc.setDrawColor(210,215,225); doc.setLineWidth(0.3); doc.line(margin + i*colW, y, margin + i*colW, y+18); }
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
    doc.text(val, cx, y + 8, { align: 'center' });
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 110, 130);
    lbl.split('\n').forEach((ll, li) => doc.text(ll, cx, y + 14 + li * 5, { align: 'center' }));
  });
  y += 28;

  doc.setDrawColor(200, 205, 215); doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y); y += 10;

  // TOC
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
  doc.text('TABLE OF CONTENTS', margin, y); y += 9;

  const sectionsToRender = DD_SECTIONS.filter((_, i) => selectedSections.includes(i));
  sectionsToRender.forEach((s, si) => {
    check(9);
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
    doc.text(`${si + 1}.  ${s.title}`, margin, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 130, 150);
    doc.text(s.subtitle, pageW - margin, y, { align: 'right' });
    // Dot leader
    const leftW = doc.getTextWidth(`${si + 1}.  ${s.title}`);
    const rightW = doc.getTextWidth(s.subtitle);
    const dotsStart = margin + leftW + 3;
    const dotsEnd = pageW - margin - rightW - 3;
    if (dotsEnd > dotsStart + 4) {
      doc.setTextColor(200, 205, 215);
      let dx = dotsStart;
      while (dx < dotsEnd) { doc.text('.', dx, y); dx += 3; }
    }
    y += 8.5;
  });
  y += 6;

  // Confidentiality box
  doc.setFillColor(250, 245, 235);
  doc.roundedRect(margin, y, contentW, 24, 2, 2, 'F');
  doc.setDrawColor(200, 160, 60); doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, 24, 2, 2, 'D');
  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(140, 100, 20);
  doc.text('CONFIDENTIALITY NOTICE', margin + 6, y + 8);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(80, 60, 20);
  const noticeLines = doc.splitTextToSize(
    'This document contains proprietary trade secrets and strategic financial information. Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident under the executed NDA.',
    contentW - 12
  );
  noticeLines.forEach((l, i) => doc.text(l, margin + 6, y + 14 + i * 5));

  drawFooter();

  // ── FINANCIAL CHARTS PAGE ─────────────────────────────────────────────────
  if (includeCharts && selectedSections.includes(5)) {
    addPage();
    currentSectionLabel = 'FINANCIAL CHARTS';
    drawRunningHeader();
    y = 24;

    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
    doc.text('FINANCIAL PROJECTIONS  —  VISUAL SUMMARY', pageW / 2, y, { align: 'center' });
    doc.setFillColor(...GOLD); doc.rect(margin, y + 3, contentW, 1, 'F');
    y += 14;

    const fmtM = v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}K`;
    // Apply theme colors to charts
    const themedStreams = theme.mono
      ? FINANCIAL_DATA.streams.map((s, i) => ({ ...s, color: [[60,60,60],[100,100,100],[130,130,130],[160,160,160],[190,190,190],[210,210,210]][i] }))
      : FINANCIAL_DATA.streams;
    const themedTam = theme.mono
      ? FINANCIAL_DATA.tam.map((t, i) => ({ ...t, color: [[50,50,50],[90,90,90],[130,130,130],[160,160,160],[190,190,190]][i] }))
      : FINANCIAL_DATA.tam;
    drawBarChart(doc, margin, y, 82, 48, FINANCIAL_DATA.revenue, ['Y1','Y2','Y3','Y4','Y5'], '5-Year Revenue Projection', theme.bar1, fmtM);
    drawBarChart(doc, margin + 88, y, 82, 48, FINANCIAL_DATA.ebitda, ['Y1','Y2','Y3','Y4','Y5'], '5-Year EBITDA Projection', theme.bar2, fmtM);
    y += 62;

    drawPieChart(doc, margin + 30, y + 32, 26, themedStreams, 'Year 5 Revenue Mix by Stream');
    y += 72;

    drawBarChart(doc, margin, y, 165, 46, themedTam.map(t => t.value), themedTam.map(t => t.label), 'Total Addressable Market by Vertical ($B)', theme.bar3, v => `$${v}B`);
    y += 60;

    // M&A table
    check(50);
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
    doc.text('Comparable M&A Transaction Benchmarks', margin, y); y += 6;
    doc.setFillColor(...GOLD); doc.rect(margin, y, contentW, 1, 'F'); y += 5;

    const comps = [
      ['Company', 'Acquirer', 'Price', 'Multiple'],
      ['PatSnap', 'SoftBank', '$1.5B', '28× ARR'],
      ['Anaqua', 'Vista Equity', '$650M', '~9× ARR'],
      ['CPA Global', 'Clarivate', '$6.8B', '9× Revenue'],
      ['Derwent Innovation', 'Clarivate', '$800M–$1.2B', 'Domain Premium'],
      ['Zenith Apex (ASKING)', '—', '$7.5M–$22M', '4–12× Y1 EBITDA'],
    ];
    const colXs = [margin, margin + 52, margin + 104, margin + 143];
    comps.forEach((row, ri) => {
      check(10);
      if (ri === 0) { doc.setFillColor(...NAVY); doc.rect(margin - 2, y - 4, contentW + 4, 9, 'F'); }
      else if (ri % 2 === 0) { doc.setFillColor(...LIGHT); doc.rect(margin - 2, y - 4, contentW + 4, 9, 'F'); }
      if (ri === comps.length - 1) { doc.setFillColor(220, 240, 220); doc.rect(margin - 2, y - 4, contentW + 4, 9, 'F'); }
      row.forEach((cell, ci) => {
        const isBold = ri === 0 || ri === comps.length - 1;
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setFontSize(9);
        doc.setTextColor(ri === 0 ? 255 : (ri === comps.length - 1 ? 30 : 30), ri === 0 ? 255 : 35, ri === 0 ? 255 : 45);
        doc.text(cell, colXs[ci], y);
      });
      y += 10;
    });
  }

  // ── CONTENT SECTIONS ──────────────────────────────────────────────────────
  sectionsToRender.forEach((section) => {
    currentSectionLabel = section.title.replace('SECTION ', 'SEC ').split(' — ')[0];
    doc.addPage(); bg(); drawRunningHeader(); y = 24;
    sectionDivider(section.title, section.subtitle);

    section.items.forEach(item => {
      subHeading(item.heading);
      para(item.body);

      // Inject links for Section 4
      if (section.title.includes('SECTION 4') && item.heading.includes('4.2')) {
        check(10);
        doc.setFontSize(9.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...SLATE);
        doc.text('SOURCE DOCUMENT LINKS:', margin + 2, y); y += 8;
        SOURCE_LINKS.slice(0, 4).forEach(link => addLink(link.label, link.url));
      }
      if (section.title.includes('SECTION 4') && item.heading.includes('4.3')) {
        check(10);
        doc.setFontSize(9.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...SLATE);
        doc.text('PATENT DATABASE LINKS:', margin + 2, y); y += 8;
        SOURCE_LINKS.slice(4).forEach(link => addLink(link.label, link.url));
      }

      rule();
    });
  });

  // ── VERSION HISTORY PAGE ──────────────────────────────────────────────────
  addPage();
  currentSectionLabel = 'VERSION HISTORY';
  drawRunningHeader();
  y = 24;

  doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
  doc.text('DOCUMENT VERSION HISTORY & CHANGE LOG', pageW / 2, y, { align: 'center' });
  doc.setFillColor(...GOLD); doc.rect(margin, y + 4, contentW, 1.2, 'F');
  y += 16;

  CHANGELOG.forEach((entry, i) => {
    check(28);
    const isLatest = i === 0;
    doc.setFillColor(isLatest ? 235 : 244, isLatest ? 242 : 246, isLatest ? 252 : 250);
    doc.roundedRect(margin, y - 2, contentW, 8, 1, 1, 'F');
    if (isLatest) { doc.setFillColor(...GOLD); doc.rect(margin, y - 2, 3, 8, 'F'); }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...NAVY);
    doc.text(`Version ${entry.version}`, margin + 7, y + 4);
    if (isLatest) {
      doc.setFillColor(...NAVY); doc.roundedRect(margin + 50, y, 22, 6, 2, 2, 'F');
      doc.setFontSize(7); doc.setTextColor(...WHITE); doc.text('CURRENT', margin + 54, y + 4);
    }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(110, 120, 140);
    doc.text(entry.date, pageW - margin, y + 4, { align: 'right' });
    y += 12;
    entry.changes.forEach(c => {
      check(7);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...TEXT);
      doc.text(`  •  ${c}`, margin + 4, y); y += 6.5;
    });
    y += 6;
  });

  drawFooter();
  doc.save(`zenith-apex-due-diligence-v${CURRENT_VERSION}-${new Date().toISOString().slice(0,10)}.pdf`);
}

// ── REACT COMPONENT ───────────────────────────────────────────────────────────
export default function DueDiligencePdfGenerator({ compact }) {
  const [generating, setGenerating] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [selectedSections, setSelectedSections] = useState(DD_SECTIONS.map((_, i) => i));
  const [includeCharts, setIncludeCharts] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(PDF_THEMES[0]);

  // Persist selections in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dd_selected_sections");
    if (saved) {
      try { setSelectedSections(JSON.parse(saved)); } catch {}
    }
  }, []);

  const toggleSection = (idx) => {
    const next = selectedSections.includes(idx)
      ? selectedSections.filter(i => i !== idx)
      : [...selectedSections, idx].sort((a, b) => a - b);
    setSelectedSections(next);
    localStorage.setItem("dd_selected_sections", JSON.stringify(next));
  };

  const selectAll = () => { const all = DD_SECTIONS.map((_, i) => i); setSelectedSections(all); localStorage.setItem("dd_selected_sections", JSON.stringify(all)); };
  const selectNone = () => { setSelectedSections([]); localStorage.setItem("dd_selected_sections", JSON.stringify([])); };

  const handle = (themeOverride) => {
    if (selectedSections.length === 0) { alert("Select at least one section."); return; }
    setGenerating(true);
    setTimeout(() => { generateDueDiligencePDF(selectedSections, includeCharts, themeOverride || selectedTheme); setGenerating(false); }, 400);
  };

  return (
    <div className="relative">
      {/* Main buttons row */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={handle} disabled={generating}
          className={`flex items-center gap-2 rounded-xl border font-bold transition-all disabled:opacity-60 ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs'
          } bg-blue-900/40 hover:bg-blue-800/60 border-blue-700 text-blue-300`}>
          {generating ? <Loader2 size={13} className="animate-spin" /> : <BookOpen size={13} />}
          {generating ? 'Building PDF…' : `DD Package PDF (${selectedSections.length}/${DD_SECTIONS.length} sections)`}
        </button>

        <button onClick={() => { setShowConfig(c => !c); setShowChangelog(false); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-all">
          <Settings size={11} /> Customize
        </button>

        <button onClick={() => { setShowChangelog(c => !c); setShowConfig(false); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-400 text-xs transition-all">
          <Clock size={11} /> v{CURRENT_VERSION}
        </button>
      </div>

      {/* Section Selector Panel */}
      {showConfig && (
        <div className="absolute left-0 top-12 z-50 bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-2xl w-96 max-h-[520px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-black text-sm">Customize Package</p>
            <button onClick={() => setShowConfig(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
          </div>

          {/* Theme Picker */}
          <div className="mb-3 pb-3 border-b border-gray-800">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">PDF Style Theme</p>
            <div className="grid grid-cols-5 gap-1.5">
              {PDF_THEMES.map(t => (
                <button key={t.id} onClick={() => setSelectedTheme(t)}
                  title={t.label}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
                    selectedTheme.id === t.id ? 'border-blue-500 bg-blue-950/30' : 'border-gray-700 hover:border-gray-500'
                  }`}>
                  <div className="flex w-full h-5 rounded overflow-hidden">
                    <div className="flex-1" style={{ backgroundColor: t.preview[0] }} />
                    <div className="flex-1" style={{ backgroundColor: t.preview[1] }} />
                  </div>
                  <span className={`text-center leading-tight ${selectedTheme.id === t.id ? 'text-blue-300' : 'text-gray-600'}`}
                    style={{ fontSize: '8px' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Charts toggle */}
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-800">
            <button onClick={() => setIncludeCharts(c => !c)} className="flex items-center gap-2 text-xs">
              {includeCharts ? <CheckSquare size={14} className="text-blue-400" /> : <Square size={14} className="text-gray-600" />}
              <span className={includeCharts ? "text-white font-bold" : "text-gray-500"}>
                Include Financial Charts Page <span className="text-blue-400">(bar charts, pie chart, M&A table)</span>
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Sections ({selectedSections.length}/{DD_SECTIONS.length})</p>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-xs text-blue-400 hover:text-blue-300">All</button>
              <span className="text-gray-700">·</span>
              <button onClick={selectNone} className="text-xs text-gray-500 hover:text-gray-400">None</button>
            </div>
          </div>

          <div className="space-y-1.5">
            {DD_SECTIONS.map((s, i) => (
              <button key={i} onClick={() => toggleSection(i)}
                className={`w-full flex items-start gap-2.5 text-left px-3 py-2 rounded-xl border transition-all text-xs ${
                  selectedSections.includes(i)
                    ? 'border-blue-700/60 bg-blue-950/30 text-white'
                    : 'border-gray-800 text-gray-500 hover:border-gray-600'
                }`}>
                {selectedSections.includes(i)
                  ? <CheckSquare size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  : <Square size={13} className="text-gray-700 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="font-bold leading-tight">{s.title}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{s.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          <button onClick={() => handle()} disabled={generating || selectedSections.length === 0}
            className="mt-4 w-full py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs transition-all flex items-center justify-center gap-2">
            {generating ? <Loader2 size={12} className="animate-spin" /> : <BookOpen size={12} />}
            Generate {selectedSections.length}-Section PDF ({selectedTheme.label})
          </button>
        </div>
      )}

      {/* Changelog Panel */}
      {showChangelog && (
        <div className="absolute left-0 top-12 z-50 bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-2xl w-96 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart2 size={13} className="text-blue-400" />
              <p className="text-white font-black text-sm">Version History</p>
            </div>
            <button onClick={() => setShowChangelog(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
          </div>
          <div className="space-y-3">
            {CHANGELOG.map((entry, i) => (
              <div key={i} className={`border rounded-xl p-3 ${i === 0 ? 'border-blue-700/60 bg-blue-950/20' : 'border-gray-800'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-black ${i === 0 ? 'text-blue-300' : 'text-gray-400'}`}>v{entry.version}</span>
                  <span className="text-gray-600 text-xs">{entry.date}</span>
                  {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-900 text-blue-300 font-bold">CURRENT</span>}
                </div>
                <ul className="space-y-0.5">
                  {entry.changes.map((c, ci) => (
                    <li key={ci} className="text-gray-400 text-xs flex gap-1.5">
                      <span className="text-gray-600">•</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}