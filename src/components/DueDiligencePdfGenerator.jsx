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
function generateDueDiligencePDF(selectedSections, includeCharts) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 0;
  let currentSectionLabel = '';

  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, pageW, 297, 'F'); };

  const drawRunningHeader = () => {
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageW, 16, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('ZENITH APEX RESEARCH PORTFOLIO — TECHNICAL DUE DILIGENCE PACKAGE', margin, 10.5);
    doc.text(`v${CURRENT_VERSION}  ·  ${currentSectionLabel || 'CONFIDENTIAL'}`, pageW - margin, 10.5, { align: 'right' });
  };

  const drawFooter = () => {
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 285, pageW, 12, 'F');
      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(200, 200, 200);
      doc.text('ZENITH APEX — TECHNICAL DUE DILIGENCE — CONFIDENTIAL — UNAUTHORIZED DISCLOSURE SUBJECT TO $2.5M LIQUIDATED DAMAGES', pageW / 2, 291, { align: 'center' });
      doc.text(`Page ${p} of ${total}`, pageW - margin, 291, { align: 'right' });
      doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, 291);
    }
  };

  const addPage = () => { doc.addPage(); bg(); drawRunningHeader(); y = 26; };
  const check = (need = 16) => { if (y + need > 281) addPage(); };

  const rule = () => {
    check(8);
    doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y); y += 8;
  };

  const sectionDivider = (text, subtitle) => {
    if (y > 70) addPage();
    doc.setFillColor(10, 10, 10);
    doc.rect(0, y - 6, pageW, 28, 'F');
    doc.setFontSize(15); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text(text, margin, y + 9);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(190, 190, 190);
    doc.text(subtitle, pageW - margin, y + 16, { align: 'right' });
    y += 30;
  };

  const subHeading = (text) => {
    check(20);
    doc.setFillColor(225, 225, 225);
    doc.rect(margin - 2, y - 3, contentW + 4, 14, 'F');
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
    doc.line(margin - 2, y - 3, margin - 2, y + 11);
    doc.setFontSize(12.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text(text, margin + 4, y + 7);
    y += 18;
  };

  const para = (text) => {
    const lines = doc.splitTextToSize(text, contentW);
    lines.forEach(l => {
      check(10);
      const trimmed = l.trim();
      const isBold = (trimmed.endsWith(':') && trimmed.length < 60 && !trimmed.startsWith('—') && !trimmed.startsWith('(')) ||
        trimmed.startsWith('[  ]') || trimmed.startsWith('[ ]') ||
        (trimmed.startsWith('STEP ') && trimmed.includes('—')) ||
        (trimmed.startsWith('STRUCTURE ') && trimmed.includes('—')) ||
        (trimmed.startsWith('RISK ') && trimmed.includes(':')) ||
        (trimmed.startsWith('VERTICAL ') && trimmed.includes('—')) ||
        (trimmed.startsWith('STREAM ') && trimmed.includes('—')) ||
        trimmed.startsWith('PLATFORM TOTAL') || trimmed.startsWith('──────');
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(isBold ? 0 : 15, isBold ? 0 : 15, isBold ? 0 : 15);
      doc.setFontSize(12);
      doc.text(l, margin, y);
      y += 8.5;
    });
    y += 5;
  };

  // ── CLICKABLE LINK HELPER ──────────────────────────────────────────────────
  const addLink = (labelText, url) => {
    check(12);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(0, 80, 200);
    doc.textWithLink(`→ ${labelText}`, margin + 4, y, { url });
    const lw = doc.getTextWidth(`→ ${labelText}`);
    doc.setDrawColor(0, 80, 200); doc.setLineWidth(0.2);
    doc.line(margin + 4, y + 1, margin + 4 + lw, y + 1);
    y += 9;
  };

  // ── COVER PAGE ─────────────────────────────────────────────────────────────
  bg();
  doc.setFillColor(10, 10, 10); doc.rect(0, 0, pageW, 90, 'F');

  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(175, 175, 175);
  doc.text('ZENITH APEX RESEARCH PORTFOLIO', pageW / 2, 25, { align: 'center' });
  doc.text('Advanced Research  ·  Intellectual Property  ·  AI-Powered Innovation', pageW / 2, 35, { align: 'center' });
  doc.text(`Q2 2026  ·  Document Version ${CURRENT_VERSION}`, pageW / 2, 44, { align: 'center' });

  doc.setFontSize(27); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
  doc.text('TECHNICAL DUE DILIGENCE', pageW / 2, 65, { align: 'center' });
  doc.setFontSize(18);
  doc.text('INVESTMENT PACKAGE', pageW / 2, 79, { align: 'center' });

  y = 106;
  doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('Comprehensive Technical, IP, Financial & Market Analysis', pageW / 2, y, { align: 'center' });
  y += 8;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor(60, 60, 60);
  doc.text(`${selectedSections.length} of 12 Sections Selected  ·  26 Device Architectures  ·  8 Revenue Streams  ·  ~100 Pages`, pageW / 2, y, { align: 'center' });
  y += 18;

  // Valuation box
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(1.0);
  doc.rect(margin, y, contentW, 44, 'D');
  doc.setFontSize(9.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('PLATFORM FAIR MARKET VALUATION (Q2 2026)  —  ASSET-BY-ASSET DCF', margin + 8, y + 10);
  doc.setFontSize(26); doc.setTextColor(0, 0, 0);
  doc.text('$5.8M – $13.5M', margin + 8, y + 27);
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(70, 70, 70);
  doc.text('Conservative DCF: 15 assets incl. KRCIC, UBDRS & legal compliance', margin + 8, y + 36);
  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('$7.5M – $22M', pageW - margin - 8, y + 27, { align: 'right' });
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(70, 70, 70);
  doc.text('ACQUISITION ASKING PRICE', pageW - margin - 8, y + 36, { align: 'right' });
  y += 52;

  const stats = [['26','Device\nArchitectures'],['12','Sections'],['200+','KG Nodes'],['8','Revenue\nStreams'],['$630K','SBIR\nFunding'],['40+','Yrs Research']];
  const colW = contentW / stats.length;
  stats.forEach(([val, lbl], i) => {
    const cx = margin + i * colW + colW / 2;
    doc.setFontSize(17); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text(val, cx, y + 10, { align: 'center' });
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(70, 70, 70);
    lbl.split('\n').forEach((ll, li) => doc.text(ll, cx, y + 17 + li * 5, { align: 'center' }));
  });
  y += 32;

  doc.setDrawColor(0); doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y); y += 8;

  // TOC — only selected sections
  doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('TABLE OF CONTENTS', margin, y); y += 8;

  const sectionsToRender = DD_SECTIONS.filter((_, i) => selectedSections.includes(i));
  sectionsToRender.forEach((s, si) => {
    check(10);
    doc.setFontSize(10.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text(`${si + 1}.  ${s.title}`, margin, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80);
    doc.text(s.subtitle, pageW - margin, y, { align: 'right' });
    y += 9;
  });
  y += 8;

  // Confidentiality notice
  doc.setDrawColor(0); doc.setLineWidth(0.5);
  doc.rect(margin, y, contentW, 26, 'D');
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('CONFIDENTIALITY NOTICE', margin + 6, y + 10);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(25, 25, 25);
  const noticeLines = doc.splitTextToSize('This document contains proprietary trade secrets, invention disclosures, and strategic financial information. Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident under the executed NDA.', contentW - 12);
  noticeLines.forEach((l, i) => doc.text(l, margin + 6, y + 17 + i * 5));

  drawFooter();

  // ── FINANCIAL CHARTS PAGE (if Section 6 selected and includeCharts) ────────
  if (includeCharts && selectedSections.includes(5)) {
    addPage();
    currentSectionLabel = 'FINANCIAL CHARTS';
    drawRunningHeader();
    y = 26;

    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text('FINANCIAL PROJECTIONS — VISUAL SUMMARY', pageW / 2, y, { align: 'center' });
    y += 12;

    // 5-year Revenue bar chart
    const fmtM = v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}K`;
    drawBarChart(doc, margin, y, 80, 50, FINANCIAL_DATA.revenue, ['Y1','Y2','Y3','Y4','Y5'], '5-Year Revenue Projection', [59, 130, 246], fmtM);
    drawBarChart(doc, margin + 90, y, 80, 50, FINANCIAL_DATA.ebitda, ['Y1','Y2','Y3','Y4','Y5'], '5-Year EBITDA Projection', [34, 197, 94], fmtM);
    y += 65;

    // Revenue streams pie chart
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text('Year 5 Revenue Mix by Stream', margin + 35, y);
    y += 6;
    drawPieChart(doc, margin + 32, y + 30, 28, FINANCIAL_DATA.streams, '');
    y += 68;

    // TAM bar chart
    drawBarChart(doc, margin, y, 165, 50, FINANCIAL_DATA.tam.map(t => t.value), FINANCIAL_DATA.tam.map(t => t.label), 'Total Addressable Market by Vertical ($B)', [168, 85, 247], v => `$${v}B`);
    y += 65;

    // Comparable M&A table
    check(50);
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text('Comparable M&A Transaction Benchmarks', margin, y); y += 8;
    const comps = [
      ['Company', 'Acquirer', 'Price', 'Multiple'],
      ['PatSnap', 'SoftBank', '$1.5B', '28× ARR'],
      ['Anaqua', 'Vista Equity', '$650M', '~9× ARR'],
      ['CPA Global', 'Clarivate', '$6.8B', '9× Revenue'],
      ['Derwent Innovation', 'Clarivate', '$800M–$1.2B', 'Domain Premium'],
      ['Zenith Apex (ASKING)', '—', '$7.5M–$22M', '4–12× Y1 EBITDA'],
    ];
    const colXs = [margin, margin + 55, margin + 105, margin + 140];
    comps.forEach((row, ri) => {
      check(10);
      if (ri === 0) { doc.setFillColor(220, 220, 220); doc.rect(margin - 2, y - 4, contentW + 4, 9, 'F'); }
      if (ri === comps.length - 1) { doc.setFillColor(210, 240, 210); doc.rect(margin - 2, y - 4, contentW + 4, 9, 'F'); }
      row.forEach((cell, ci) => {
        doc.setFont('helvetica', ri === 0 || ri === comps.length - 1 ? 'bold' : 'normal');
        doc.setFontSize(9); doc.setTextColor(0, 0, 0);
        doc.text(cell, colXs[ci], y);
      });
      y += 10;
    });
  }

  // ── CONTENT SECTIONS ──────────────────────────────────────────────────────
  sectionsToRender.forEach((section, si) => {
    currentSectionLabel = section.title.replace('SECTION ', 'SEC ').split(' — ')[0];
    doc.addPage(); bg(); drawRunningHeader(); y = 26;
    sectionDivider(section.title, section.subtitle);

    section.items.forEach(item => {
      subHeading(item.heading);
      para(item.body);

      // ── INJECT SOURCE LINKS for Section 4 ──────────────────────────────
      if (section.title.includes('SECTION 4') && item.heading.includes('4.2')) {
        check(12);
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
        doc.text('CLICKABLE SOURCE DOCUMENT LINKS:', margin, y); y += 8;
        SOURCE_LINKS.slice(0, 4).forEach(link => addLink(link.label, link.url));
      }
      if (section.title.includes('SECTION 4') && item.heading.includes('4.3')) {
        check(12);
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
        doc.text('PATENT DATABASE LINKS:', margin, y); y += 8;
        SOURCE_LINKS.slice(4).forEach(link => addLink(link.label, link.url));
      }

      rule();
    });
  });

  // ── VERSION CONTROL PAGE ───────────────────────────────────────────────────
  addPage();
  currentSectionLabel = 'VERSION HISTORY';
  drawRunningHeader();
  y = 26;

  doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('DOCUMENT VERSION HISTORY & CHANGE LOG', pageW / 2, y, { align: 'center' }); y += 12;

  CHANGELOG.forEach(entry => {
    check(30);
    doc.setFillColor(240, 240, 240); doc.rect(margin - 2, y - 3, contentW + 4, 10, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(0, 0, 0);
    doc.text(`Version ${entry.version}`, margin + 2, y + 4);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(80, 80, 80);
    doc.text(entry.date, pageW - margin, y + 4, { align: 'right' });
    y += 14;
    entry.changes.forEach(c => {
      check(8);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(30, 30, 30);
      doc.text(`  •  ${c}`, margin + 4, y); y += 7;
    });
    y += 5;
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

  const handle = () => {
    if (selectedSections.length === 0) { alert("Select at least one section."); return; }
    setGenerating(true);
    setTimeout(() => { generateDueDiligencePDF(selectedSections, includeCharts); setGenerating(false); }, 400);
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

          <button onClick={handle} disabled={generating || selectedSections.length === 0}
            className="mt-4 w-full py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs transition-all flex items-center justify-center gap-2">
            {generating ? <Loader2 size={12} className="animate-spin" /> : <BookOpen size={12} />}
            Generate {selectedSections.length}-Section PDF
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