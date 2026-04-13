import { useState } from "react";
import { jsPDF } from "jspdf";
import { BookOpen, Loader2 } from "lucide-react";
import { DD_SECTIONS } from "../lib/dueDiligenceSections";

function generateDueDiligencePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 0;
  let currentSectionLabel = '';

  const bg = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, 297, 'F');
  };

  const drawRunningHeader = () => {
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageW, 16, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('ZENITH APEX RESEARCH PORTFOLIO — TECHNICAL DUE DILIGENCE PACKAGE', margin, 10.5);
    doc.text(currentSectionLabel || 'CONFIDENTIAL', pageW - margin, 10.5, { align: 'right' });
  };

  const drawFooter = () => {
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 285, pageW, 12, 'F');
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 285, pageW, 0.4, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text(
        'ZENITH APEX — TECHNICAL DUE DILIGENCE — CONFIDENTIAL — UNAUTHORIZED DISCLOSURE SUBJECT TO $2.5M LIQUIDATED DAMAGES',
        pageW / 2, 291, { align: 'center' }
      );
      doc.text(`Page ${p} of ${total}`, pageW - margin, 291, { align: 'right' });
      doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, 291);
    }
  };

  const addPage = () => {
    doc.addPage();
    bg();
    drawRunningHeader();
    y = 26;
  };

  const check = (need = 16) => { if (y + need > 281) addPage(); };

  const rule = () => {
    check(8);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 8;
  };

  const sectionDivider = (text, subtitle) => {
    if (y > 70) addPage();
    doc.setFillColor(10, 10, 10);
    doc.rect(0, y - 6, pageW, 28, 'F');
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(text, margin, y + 9);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(190, 190, 190);
    doc.text(subtitle, pageW - margin, y + 16, { align: 'right' });
    y += 30;
  };

  const subHeading = (text) => {
    check(20);
    doc.setFillColor(225, 225, 225);
    doc.rect(margin - 2, y - 3, contentW + 4, 14, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(margin - 2, y - 3, margin - 2, y + 11);
    doc.setFontSize(12.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(text, margin + 4, y + 7);
    y += 18;
  };

  const para = (text) => {
    const lines = doc.splitTextToSize(text, contentW);
    lines.forEach(l => {
      check(10);
      const trimmed = l.trim();
      // Bold key labels and checklist items
      if (
        (trimmed.endsWith(':') && trimmed.length < 60 && !trimmed.startsWith('—') && !trimmed.startsWith('(')) ||
        trimmed.startsWith('[  ]') || trimmed.startsWith('[ ]') ||
        (trimmed.startsWith('STEP ') && trimmed.includes('—')) ||
        (trimmed.startsWith('STRUCTURE ') && trimmed.includes('—')) ||
        (trimmed.startsWith('RISK ') && trimmed.includes(':')) ||
        (trimmed.startsWith('VERTICAL ') && trimmed.includes('—')) ||
        (trimmed.startsWith('STREAM ') && trimmed.includes('—')) ||
        trimmed.startsWith('PLATFORM TOTAL') ||
        trimmed.startsWith('──────')
      ) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 15, 15);
        doc.setFontSize(12);
      }
      doc.text(l, margin, y);
      y += 8.5;
    });
    y += 5;
  };

  // ── COVER PAGE ─────────────────────────────────────────────────────────────
  bg();
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageW, 90, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(175, 175, 175);
  doc.text('ZENITH APEX RESEARCH PORTFOLIO', pageW / 2, 25, { align: 'center' });
  doc.text('Advanced Research  ·  Intellectual Property  ·  AI-Powered Innovation', pageW / 2, 35, { align: 'center' });
  doc.text('Q2 2026', pageW / 2, 44, { align: 'center' });

  doc.setFontSize(27);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TECHNICAL DUE DILIGENCE', pageW / 2, 65, { align: 'center' });
  doc.setFontSize(18);
  doc.text('INVESTMENT PACKAGE', pageW / 2, 79, { align: 'center' });

  y = 106;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Comprehensive Technical, IP, Financial & Market Analysis', pageW / 2, y, { align: 'center' });
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(60, 60, 60);
  doc.text('Updated Q2 2026  ·  12 Sections  ·  26 Device Architectures  ·  8 Revenue Streams  ·  ~100 Pages', pageW / 2, y, { align: 'center' });
  y += 18;

  // Valuation box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.0);
  doc.rect(margin, y, contentW, 44, 'D');
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('PLATFORM FAIR MARKET VALUATION (Q2 2026)  —  ASSET-BY-ASSET DCF', margin + 8, y + 10);
  doc.setFontSize(26);
  doc.setTextColor(0, 0, 0);
  doc.text('$5.8M \u2013 $13.5M', margin + 8, y + 27);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);
  doc.text('Conservative DCF: 15 assets incl. KRCIC, UBDRS & legal compliance', margin + 8, y + 36);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('$7.5M \u2013 $22M', pageW - margin - 8, y + 27, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);
  doc.text('ACQUISITION ASKING PRICE', pageW - margin - 8, y + 36, { align: 'right' });
  y += 52;

  // Stats row
  const stats = [
    ['26', 'Device\nArchitectures'],
    ['12', 'Sections'],
    ['200+', 'KG Nodes'],
    ['8', 'Revenue\nStreams'],
    ['$630K', 'SBIR\nFunding'],
    ['40+', 'Yrs Research'],
  ];
  const colW = contentW / stats.length;
  stats.forEach(([val, lbl], i) => {
    const cx = margin + i * colW + colW / 2;
    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(val, cx, y + 10, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    lbl.split('\n').forEach((ll, li) => doc.text(ll, cx, y + 17 + li * 5, { align: 'center' }));
  });
  y += 32;

  // Horizontal rule
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Table of contents
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TABLE OF CONTENTS', margin, y);
  y += 8;

  DD_SECTIONS.forEach((s, si) => {
    check(10);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${si + 1}.  ${s.title}`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text(s.subtitle, pageW - margin, y, { align: 'right' });
    y += 9;
  });
  y += 8;

  // Confidentiality notice
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, contentW, 26, 'D');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CONFIDENTIALITY NOTICE', margin + 6, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(25, 25, 25);
  const noticeLines = doc.splitTextToSize(
    'This document contains proprietary trade secrets, invention disclosures, and strategic financial information. Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident under the executed NDA. May not be reproduced or transmitted without prior written consent from Zenith Apex Research Portfolio.',
    contentW - 12
  );
  noticeLines.forEach((l, i) => doc.text(l, margin + 6, y + 17 + i * 5));

  drawFooter();

  // ── CONTENT SECTIONS ──────────────────────────────────────────────────────
  DD_SECTIONS.forEach(section => {
    currentSectionLabel = section.title.replace('SECTION ', 'SEC ').split(' — ')[0];
    doc.addPage();
    bg();
    drawRunningHeader();
    y = 26;

    sectionDivider(section.title, section.subtitle);

    section.items.forEach(item => {
      subHeading(item.heading);
      para(item.body);
      rule();
    });
  });

  drawFooter();
  doc.save('zenith-apex-due-diligence-q2-2026-updated.pdf');
}

export default function DueDiligencePdfGenerator({ compact }) {
  const [generating, setGenerating] = useState(false);

  const handle = () => {
    setGenerating(true);
    setTimeout(() => { generateDueDiligencePDF(); setGenerating(false); }, 400);
  };

  return (
    <button onClick={handle} disabled={generating}
      className={`flex items-center gap-2 rounded-xl border font-bold transition-all disabled:opacity-60 ${
        compact
          ? 'px-3 py-1.5 text-xs bg-blue-900/40 hover:bg-blue-800/60 border-blue-700 text-blue-300'
          : 'px-4 py-2 text-xs bg-blue-900/40 hover:bg-blue-800/60 border-blue-700 text-blue-300'
      }`}>
      {generating ? <Loader2 size={13} className="animate-spin" /> : <BookOpen size={13} />}
      {generating ? 'Building 100-Page Package…' : '100-Page Due Diligence PDF'}
    </button>
  );
}