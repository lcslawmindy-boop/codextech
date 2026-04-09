import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, BookOpen, Film, Package, ShoppingBag, Mail, Shield, Loader2, ChevronDown, ChevronUp, Star, Wrench } from "lucide-react";
import { jsPDF } from "jspdf";
import { base44 } from "@/api/base44Client";
import { THEME, drawLogo, drawPageHeader, drawFooter } from "../lib/zenithPdfTheme";
import NdaPdfGenerator from "../components/NdaPdfGenerator";
import DueDiligencePdfGenerator from "../components/DueDiligencePdfGenerator";
import { businessItems } from "../lib/businessItems";
import { inventionSteps } from "../lib/inventionSteps";

// ── MASTER LETTER TEXT ─────────────────────────────────────────────────────
const MASTER_LETTER = `STRICTLY CONFIDENTIAL — NDA REQUIRED BEFORE FURTHER DISCLOSURE

[DATE]

Dear [RECIPIENT NAME],

I am writing to offer you a time-limited, exclusive first-look at an acquisition that does not come to market twice.

The Zenith Apex Advanced Research Platform is the world's only commercially structured, production-ready AI-powered knowledge and IP generation platform built around the suppressed physics and biology research of Lt. Col. Thomas E. Bearden (ret.) — cross-referenced against primary US government documents, peer-reviewed publications, and declassified archives that validate the core claims.

PLATFORM FAIR MARKET VALUE (Q2 2026)
  AI Invention Forge Engine ............. $380K – $950K
  AI Market Research Scanner ............ $220K – $580K
  USPTO Provisional Patent Drafter ....... $150K – $380K
  VC Pitch Deck + Build Video Engine .... $120K – $280K
  Scalar Simulators ..................... $80K – $175K
  Bearden Knowledge Graph ............... $220K – $420K
  Course Catalog (20+ courses) .......... $150K – $320K
  Invention Build Plans ................. $450K – $1.2M
  Primary Document Archive .............. $120K – $280K
  IP Portfolio (MEG, TRZ, TRD-1) ........ $1.8M – $6.5M
  Prior Art Archive + Patent AI ......... $95K – $240K
  Health + CRM + Monitoring Suite ....... $110K – $220K

  PLATFORM TOTAL (conservative):    $3.9M – $11.5M
  + Strategic pre-public premium:    $5.5M – $25.3M

ACQUISITION TERMS
  EXCLUSIVE ACQUISITION:          $6.5M – $18M
  LICENSING ONLY (annual):        $650,000 – $1,500,000/year
  AI WHITE-LABEL (per licensee):  $280,000 – $750,000/year
  STRATEGIC JV:                   Equity terms, negotiable

This opportunity is being presented to a maximum of six (6) qualified buyers before public launch.

TO PROCEED:
1. Reply to confirm interest and receive NDA template
2. Execute NDA and provide proof of funds or institutional mandate letter
3. Receive full 100+ page technical due diligence package
4. Schedule live demonstration and Q&A

Sincerely,
[YOUR NAME]
Zenith Apex Research Portfolio
[YOUR EMAIL]
[YOUR PHONE]
[DATE]

UNAUTHORIZED DISCLOSURE SUBJECT TO $2.5M LIQUIDATED DAMAGES PER INCIDENT`;

// ── PDF GENERATORS ──────────────────────────────────────────────────────────

function generateMasterLetterPDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 0;
  let pageNum = 1;

  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, pageW, 297, 'F'); };

  const newPage = () => {
    doc.addPage(); bg(); pageNum++;
    drawPageHeader(doc, 'ACQUISITION LETTER', 'CONFIDENTIAL');
    y = 58;
  };

  const check = (n = 14) => { if (y + n > 281) newPage(); };

  bg();
  drawPageHeader(doc, 'MASTER ACQUISITION LETTER', 'STRICTLY CONFIDENTIAL — PERSONALIZE BEFORE SENDING');
  y = 58;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  const lines = doc.splitTextToSize(MASTER_LETTER, contentW);
  lines.forEach(l => {
    check(9);
    const trimmed = l.trim();
    if (trimmed.startsWith('PLATFORM') || trimmed.startsWith('ACQUISITION') || trimmed.startsWith('TO PROCEED') || trimmed === 'STRICTLY CONFIDENTIAL — NDA REQUIRED BEFORE FURTHER DISCLOSURE') {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(20, 20, 20);
    }
    doc.text(l, margin, y);
    y += 8;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, p, total, 'MASTER ACQUISITION LETTER');
  }
  doc.save('zenith-apex-acquisition-letter.pdf');
}

function generateCoursesPDF(courses) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 58; let pn = 1;
  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); pn++; drawPageHeader(doc, 'COURSE CATALOG', 'ZENITH APEX EDUCATIONAL LIBRARY'); y = 58; };
  const check = (n = 14) => { if (y + n > 281) newPage(); };

  bg(); drawPageHeader(doc, 'COURSE CATALOG', 'ZENITH APEX EDUCATIONAL LIBRARY');

  doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('Complete Course Catalog', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
  doc.text(`${courses.length} Courses  ·  Scalar EM  ·  IP Strategy  ·  Bioelectromagnetics  ·  Advanced Physics`, pageW / 2, y + 18, { align: 'center' });
  y += 32;

  courses.forEach((course, idx) => {
    check(48);
    doc.setFillColor(240, 240, 240);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentW, 42, 2, 2, 'FD');
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text(`${idx + 1}.  ${course.name}`, margin + 5, y + 10);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);
    const desc = doc.splitTextToSize(course.description || course.tagline || '', contentW - 10);
    desc.slice(0, 2).forEach((l, i) => doc.text(l, margin + 5, y + 18 + i * 7));
    if (course.price) {
      doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text(course.price, pageW - margin - 5, y + 10, { align: 'right' });
    }
    if (course.modules) {
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(70, 70, 70);
      doc.text('Modules: ' + course.modules.slice(0, 5).join('  ·  '), margin + 5, y + 35);
    }
    y += 48;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'COURSE CATALOG'); }
  doc.save('zenith-apex-course-catalog.pdf');
}

function generateInventionPlansPDF(plans) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 18, CW = W - M * 2;
  let y = 0;

  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 297, 'F'); };
  const addPage = () => { doc.addPage(); bg(); drawPageHeader(doc, 'INVENTION BUILD PLANS', 'BEGINNER-FRIENDLY ASSEMBLY GUIDE'); y = 58; };
  const check = (n = 14) => { if (y + n > 281) addPage(); };

  const para = (text, color = [20, 20, 20], size = 11, bold = false, indent = 0) => {
    doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CW - indent);
    lines.forEach(l => { check(8); doc.text(l, M + indent, y); y += 7; });
    y += 2;
  };

  const sectionBand = (label, color = [10, 10, 10], textColor = [255, 255, 255]) => {
    check(14);
    doc.setFillColor(...color); doc.rect(M - 2, y - 3, CW + 4, 13, 'F');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textColor);
    doc.text(label, M + 2, y + 6); y += 16;
  };

  const pill = (label, x, py, bgColor = [230, 230, 230], textColor = [0, 0, 0]) => {
    doc.setFillColor(...bgColor); doc.roundedRect(x, py - 4, doc.getStringUnitWidth(label) * 3 + 8, 7, 2, 2, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textColor);
    doc.text(label, x + 4, py + 0.5);
  };

  // ── COVER PAGE ──
  bg();
  doc.setFillColor(10, 10, 10); doc.rect(0, 0, W, 50, 'F');
  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 160);
  doc.text('ZENITH APEX RESEARCH PORTFOLIO', W / 2, 16, { align: 'center' });
  doc.setFontSize(22); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
  doc.text('INVENTION BUILD PLANS', W / 2, 34, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(180, 180, 180);
  doc.text('Beginner-Friendly Step-by-Step Assembly Guides', W / 2, 43, { align: 'center' });

  y = 64;
  doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text(`${plans.length} Invention Devices — Complete Engineering & Assembly Guides`, W / 2, y, { align: 'center' }); y += 10;
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
  doc.text('Written so a beginner — or a curious 10-year-old — can follow along and build.', W / 2, y, { align: 'center' }); y += 14;

  // How to use this guide box
  doc.setDrawColor(0); doc.setLineWidth(0.5); doc.rect(M, y, CW, 44, 'D');
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('HOW TO USE THIS GUIDE', M + 5, y + 10); y += 14;
  const tips = [
    '🔵  Read the WHAT IS IT section first — it explains the idea in plain language.',
    '🟢  Gather ALL parts from the SHOPPING LIST before you start building.',
    '🟡  Follow steps IN ORDER — do not skip ahead.',
    '🔴  Read every WARNING box carefully before doing that step.',
    '✅  Complete the CHECKPOINT before moving to the next step.',
  ];
  tips.forEach(t => { doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(20, 20, 20); doc.text(t, M + 5, y); y += 7; });
  y += 14;

  // Table of contents
  doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('TABLE OF CONTENTS', M, y); y += 8;
  plans.forEach((plan, i) => {
    check(8);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(20, 20, 20);
    doc.text(`${i + 1}.  ${plan.name}`, M, y);
    if (plan.steps?.length) { doc.setTextColor(100, 100, 100); doc.text(`${plan.steps.length} steps`, W - M, y, { align: 'right' }); }
    y += 7;
  });

  const confidText = 'CONFIDENTIAL — NDA APPLIES — Unauthorized disclosure subject to $2,500,000 liquidated damages per incident.';
  y += 6; doc.setDrawColor(0); doc.setLineWidth(0.3); doc.rect(M, y, CW, 12, 'D');
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text(confidText, M + 4, y + 7);

  // ── PLAN PAGES ──
  plans.forEach((plan, planIdx) => {
    addPage();

    // Device header
    doc.setFillColor(0, 0, 0); doc.rect(0, y - 8, W, 26, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 160);
    doc.text(`DEVICE ${planIdx + 1} OF ${plans.length}`, M, y);
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    const titleLines = doc.splitTextToSize(plan.name, CW - 40);
    titleLines.slice(0, 2).forEach((l, i) => doc.text(l, M, y + 8 + i * 8));
    if (plan.price) { doc.setFontSize(11); doc.setTextColor(220, 220, 100); doc.text(plan.price, W - M, y + 8, { align: 'right' }); }
    y += 28;

    // ── WHAT IS IT? (plain English) ──
    sectionBand('🔵  WHAT IS IT? — Plain English Explanation', [30, 60, 130]);
    if (plan.whatItIs) {
      para(plan.whatItIs, [10, 10, 10], 11, false, 2);
    } else if (plan.description) {
      para(plan.description, [10, 10, 10], 11, false, 2);
    }
    if (plan.analogy) {
      check(18);
      doc.setFillColor(240, 248, 255); doc.rect(M, y - 2, CW, 16, 'F');
      doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 80, 160);
      doc.text('Think of it like this:', M + 4, y + 5);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(20, 20, 80);
      const aLines = doc.splitTextToSize(plan.analogy, CW - 8);
      aLines.slice(0, 2).forEach((l, i) => doc.text(l, M + 4, y + 11 + i * 6));
      y += 20;
    }

    // ── HOW DOES IT WORK? ──
    if (plan.howItWorks) {
      sectionBand('⚙️  HOW DOES IT WORK?', [40, 40, 60]);
      para(plan.howItWorks, [10, 10, 10], 11, false, 2);
    }

    // ── SHOPPING LIST (BOM) ──
    if (plan.bom?.length) {
      sectionBand('🟢  SHOPPING LIST — Everything You Need to Buy', [10, 80, 30]);

      // Column headers
      doc.setFillColor(220, 240, 220); doc.rect(M - 1, y - 3, CW + 2, 10, 'F');
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text('Qty', M + 1, y + 4);
      doc.text('Part Name', M + 14, y + 4);
      doc.text('What it does (plain English)', M + 78, y + 4);
      doc.text('Est. Cost', W - M - 36, y + 4);
      doc.text('Where to Buy', W - M - 2, y + 4, { align: 'right' });
      y += 12;

      plan.bom.forEach((item, bi) => {
        const rowH = 13;
        check(rowH);
        if (bi % 2 === 0) { doc.setFillColor(248, 252, 248); doc.rect(M - 1, y - 3, CW + 2, rowH, 'F'); }
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 100, 0);
        doc.text(String(item.qty || 1), M + 4, y + 4, { align: 'center' });
        doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
        const itemName = doc.splitTextToSize(item.item || item.name || '', 60);
        doc.text(itemName[0], M + 14, y + 4);
        if (itemName[1]) { doc.setFontSize(8); doc.text(itemName[1], M + 14, y + 9); }
        // Plain-English spec
        doc.setFont('helvetica', 'normal'); doc.setTextColor(40, 40, 40); doc.setFontSize(8);
        const specText = item.plainEnglish || item.spec || '';
        const specLines = doc.splitTextToSize(specText, 54);
        specLines.slice(0, 2).forEach((l, li) => doc.text(l, M + 78, y + 4 + li * 5));
        // Cost
        doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 120, 0); doc.setFontSize(9);
        doc.text(item.cost || item.estCost || '—', W - M - 36, y + 4);
        // Where
        doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 200); doc.setFontSize(8);
        const whereText = item.source || item.where || '';
        doc.text(doc.splitTextToSize(whereText, 34)[0], W - M - 2, y + 4, { align: 'right' });
        y += rowH;
      });
      y += 4;

      if (plan.estimatedCost) {
        check(10);
        doc.setFillColor(200, 240, 200); doc.rect(M, y - 2, CW, 10, 'F');
        doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 80, 0);
        doc.text(`💰 Estimated Total Cost: ${plan.estimatedCost}`, M + 4, y + 5); y += 14;
      }
    } else if (plan.components?.length) {
      sectionBand('🟢  PARTS LIST', [10, 80, 30]);
      plan.components.forEach(c => { para(`•  ${c}`, [10, 10, 10], 10, false, 4); });
    }

    // ── SAFETY FIRST ──
    if (plan.safetyNotes) {
      check(24);
      sectionBand('⚠️  SAFETY FIRST — Read Before You Build', [120, 20, 20]);
      para(plan.safetyNotes, [80, 0, 0], 10, false, 2);
    } else {
      check(20);
      sectionBand('⚠️  SAFETY REMINDERS', [120, 50, 0]);
      const safetyDefaults = [
        '• Always have an adult present when working with electricity.',
        '• Never touch exposed wires when power is on. Always unplug before wiring.',
        '• Strong magnets can pinch fingers hard. Keep away from faces and electronics.',
        '• If something smells hot or burns, turn off power immediately.',
        '• Keep your workspace tidy — tools on floor can cause trips and accidents.',
      ];
      safetyDefaults.forEach(s => { para(s, [80, 30, 0], 10, false, 2); });
    }

    // ── TOOLS NEEDED ──
    if (plan.tools?.length) {
      sectionBand('🔧  TOOLS YOU WILL NEED', [60, 40, 0]);
      plan.tools.forEach(t => { para(`🔧  ${t}`, [30, 20, 0], 10, false, 2); });
    }

    // ── STEP-BY-STEP ASSEMBLY ──
    if (plan.steps?.length) {
      addPage();
      sectionBand(`📋  STEP-BY-STEP ASSEMBLY — ${plan.steps.length} STEPS`, [0, 0, 0]);
      doc.setFontSize(10); doc.setFont('helvetica', 'italic'); doc.setTextColor(60, 60, 60);
      doc.text('Take your time with each step. Read the full step before starting. Do the checkpoint before moving on.', M, y); y += 10;

      plan.steps.forEach((step, si) => {
        const stepTitle = typeof step === 'string' ? step : (step.title || step.action || `Step ${si + 1}`);
        const stepDetail = typeof step === 'string' ? '' : (step.detail || step.action || step.description || '');
        const stepBeginner = typeof step === 'string' ? '' : (step.beginnerNote || '');
        const stepWarning = typeof step === 'string' ? '' : (step.warning || '');
        const stepCheckpoint = typeof step === 'string' ? '' : (step.checkpoint || '');
        const stepMaterials = typeof step === 'string' ? [] : (step.materials || []);
        const stepTools = typeof step === 'string' ? [] : (step.tools || []);

        check(36);
        // Step number band
        doc.setFillColor(30, 30, 30); doc.rect(M - 2, y - 3, CW + 4, 14, 'F');
        // Big step number circle
        doc.setFillColor(255, 255, 255); doc.circle(M + 6, y + 4, 5, 'F');
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
        doc.text(String(si + 1), M + 6, y + 5.5, { align: 'center' });
        // Step title
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
        doc.text(stepTitle, M + 14, y + 5);
        y += 17;

        // Full detailed instructions
        if (stepDetail) {
          para(stepDetail, [10, 10, 10], 10, false, 4);
        }

        // Beginner note (plain English analogy/tip)
        if (stepBeginner) {
          check(14);
          doc.setFillColor(240, 245, 255); doc.rect(M + 2, y - 2, CW - 4, 14, 'F');
          doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 80, 160);
          doc.text('💡 Beginner Tip:', M + 5, y + 4);
          doc.setFont('helvetica', 'normal'); doc.setTextColor(20, 40, 100);
          const bLines = doc.splitTextToSize(stepBeginner, CW - 12);
          bLines.slice(0, 2).forEach((l, li) => doc.text(l, M + 5, y + 9 + li * 5.5));
          y += 14 + Math.max(0, bLines.length - 1) * 5.5;
        }

        // Step-specific materials
        if (stepMaterials.length > 0) {
          check(10);
          doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 100, 0);
          doc.text('For this step — grab:', M + 4, y);
          doc.setFont('helvetica', 'normal'); doc.setTextColor(10, 60, 10);
          doc.text(stepMaterials.join('  ·  '), M + 38, y); y += 7;
        }

        // Tools for this step
        if (stepTools.length > 0) {
          check(8);
          doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 50, 0);
          doc.text('Tools:', M + 4, y);
          doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 40, 0);
          doc.text(stepTools.join('  ·  '), M + 18, y); y += 7;
        }

        // Warning
        if (stepWarning) {
          check(14);
          doc.setFillColor(255, 235, 235); doc.rect(M + 2, y - 2, CW - 4, 13, 'F');
          doc.setDrawColor(200, 0, 0); doc.setLineWidth(0.6); doc.rect(M + 2, y - 2, CW - 4, 13, 'D');
          doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(180, 0, 0);
          doc.text('⚠ WARNING: ', M + 5, y + 6);
          doc.setFont('helvetica', 'normal');
          const wLines = doc.splitTextToSize(stepWarning, CW - 36);
          doc.text(wLines[0], M + 32, y + 6); y += 17;
        }

        // Checkpoint
        if (stepCheckpoint) {
          check(14);
          doc.setFillColor(235, 255, 235); doc.rect(M + 2, y - 2, CW - 4, 13, 'F');
          doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 120, 0);
          doc.text('✅ CHECK: Before moving on —', M + 5, y + 4);
          doc.setFont('helvetica', 'normal'); doc.setTextColor(0, 60, 0);
          const cpLines = doc.splitTextToSize(stepCheckpoint, CW - 8);
          cpLines.slice(0, 2).forEach((l, li) => doc.text(l, M + 5, y + 9 + li * 5.5));
          y += 14 + Math.max(0, cpLines.length - 1) * 5.5;
        }

        // Divider
        y += 4;
        doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2); doc.line(M, y, W - M, y); y += 7;
      });
    }

    // ── TROUBLESHOOTING ──
    if (plan.troubleshooting) {
      check(16);
      sectionBand('🛠  TROUBLESHOOTING — If Something Goes Wrong', [60, 0, 60]);
      para(plan.troubleshooting, [40, 0, 40], 10, false, 2);
    }

    // ── TECHNICAL NOTES ──
    if (plan.notes) {
      check(12);
      sectionBand('📖  TECHNICAL NOTES & REFERENCES', [40, 40, 40]);
      para(plan.notes, [30, 30, 30], 9, false, 2);
    }

    // End of device divider
    y += 6;
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.8); doc.line(M, y, W - M, y); y += 10;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'INVENTION BUILD PLANS — BEGINNER GUIDE'); }
  doc.save('zenith-apex-invention-plans-beginner-guide.pdf');
}

function generateShopPDF() {
  const products = [
    { name: 'Scalar Shield Pendant', category: 'Jewelry', price: '$89', desc: 'Orgonite-based scalar energy pendant with shungite and black tourmaline crystal matrix.' },
    { name: 'BioField Harmonizer', category: 'Jewelry', price: '$145', desc: 'Copper-wound torus coil with rare earth magnets, resonant frequency 7.83 Hz (Schumann).' },
    { name: 'Home EMF Guardian', category: 'Home Device', price: '$299', desc: 'Room-scale scalar field generator neutralizing 5G, WiFi, and smart meter radiation.' },
    { name: 'Faraday Sleeping Canopy', category: 'Home Device', price: '$890', desc: 'Silver-threaded fabric canopy blocking 99.9% of RF/EMF during sleep.' },
    { name: 'EMF Blocking Lab Coat', category: 'Clothing', price: '$420', desc: 'Silver fiber-woven professional garment, 40dB attenuation across 1MHz–10GHz.' },
    { name: 'Quantum Minerals Detox Kit', category: 'Supplements', price: '$178', desc: 'Full 90-day heavy metal chelation protocol: chlorella, zeolite, EDTA, ALA, NAC.' },
    { name: 'Faraday Room Kit', category: 'DIY Kit', price: '$620', desc: 'Complete room Faraday cage kit: copper mesh, conductive tape, grounding wire, instructions.' },
    { name: 'Water Structuring Device', category: 'Home Device', price: '$245', desc: 'Scalar-imprinted water structuring chamber, increases bioavailability and coherence.' },
    { name: 'Schumann Resonance Generator', category: 'Home Device', price: '$195', desc: '7.83 Hz portable generator for circadian rhythm support and EMF stress mitigation.' },
    { name: 'TRD-1 Component Kit', category: 'DIY Kit', price: '$1,200', desc: 'All components for Telomere Regeneration Device assembly: coils, capacitors, PCB, housing.' },
    { name: 'MEG Prototype Kit', category: 'DIY Kit', price: '$1,800', desc: 'Complete MEG replication component set with nanocrystalline cores and precision windings.' },
    { name: 'Scalar Comm Module', category: 'Electronics', price: '$340', desc: 'Longitudinal wave transmission prototype board with adjustable phase conjugation.' },
  ];
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 58;
  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); drawPageHeader(doc, 'EMF PROTECTION SHOP', 'PRODUCT CATALOG'); y = 58; };
  const check = (n = 14) => { if (y + n > 281) newPage(); };

  bg(); drawPageHeader(doc, 'EMF PROTECTION SHOP', 'COMPLETE PRODUCT CATALOG');
  doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('EMF Protection Shop — Product Catalog', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
  doc.text(`${products.length} Products  ·  Jewelry  ·  Home Devices  ·  Clothing  ·  Supplements  ·  DIY Kits`, pageW / 2, y + 18, { align: 'center' });
  y += 32;

  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    check(18);
    doc.setFillColor(10, 10, 10); doc.rect(margin - 2, y - 2, contentW + 4, 13, 'F');
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text(cat.toUpperCase(), margin, y + 7); y += 18;
    products.filter(p => p.category === cat).forEach(p => {
      check(26);
      doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text(p.name, margin, y);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text(p.price, pageW - margin, y, { align: 'right' });
      y += 9;
      doc.setFontSize(12); doc.setFont('helvetica', 'normal'); doc.setTextColor(25, 25, 25);
      const lines = doc.splitTextToSize(p.desc, contentW);
      lines.forEach(l => { check(8); doc.text(l, margin, y); y += 8; });
      y += 6;
      doc.setDrawColor(160, 160, 160); doc.setLineWidth(0.3); doc.line(margin, y, pageW - margin, y);
      y += 5;
    });
    y += 4;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'EMF PROTECTION SHOP'); }
  doc.save('zenith-apex-emf-shop.pdf');
}

function generateBuildVideosPDF(videos) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 18, CW = W - M * 2;
  let y = 58;
  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); drawPageHeader(doc, 'BUILD VIDEO LIBRARY', 'ENGINEERING GUIDES'); y = 58; };
  const check = (n = 14) => { if (y + n > 281) newPage(); };

  const para = (text, color = [20,20,20], size = 10, bold = false, indent = 0) => {
    if (!text) return;
    doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setTextColor(...color);
    doc.splitTextToSize(String(text), CW - indent).forEach(l => { check(7); doc.text(l, M + indent, y); y += 6.5; });
    y += 2;
  };

  bg(); drawPageHeader(doc, 'BUILD VIDEO LIBRARY', 'COMPLETE STEP-BY-STEP ENGINEERING GUIDES');
  doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('Build Video Library', W / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
  doc.text(`${videos.length} Build Guides  ·  Complete Step-by-Step Instructions  ·  Full BOM with Specs  ·  Warnings & Checkpoints`, W / 2, y + 18, { align: 'center' });
  y += 32;

  if (videos.length === 0) {
    para('No build videos found. Generate build videos in the Invention Forge to populate this catalog.', [80,80,80], 12, true);
  }

  videos.forEach((v, idx) => {
    newPage();

    // Device header
    doc.setFillColor(10, 10, 10); doc.rect(0, y - 8, W, 26, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(160,160,160);
    doc.text(`DEVICE ${idx + 1} OF ${videos.length}`, M, y);
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(255,255,255);
    doc.text(v.invention_name, M, y + 10);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(190,190,190);
    doc.text(`${v.step_count || (v.steps||[]).length} steps  ·  ${v.invention_category || ''}`, W - M, y + 10, { align: 'right' });
    y += 30;

    if (v.invention_tagline) {
      doc.setFontSize(11); doc.setFont('helvetica', 'italic'); doc.setTextColor(40,40,40);
      doc.text(`"${v.invention_tagline}"`, M, y); y += 10;
    }

    // Overview
    if (v.overview) {
      doc.setFillColor(245,245,245); doc.rect(M-1, y-2, CW+2, 11, 'F');
      doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(0,0,0);
      doc.text('OVERVIEW', M, y+6); y += 12;
      para(v.overview, [20,20,20], 10);
    }

    // Full BOM table
    if (v.bom?.length) {
      check(14);
      doc.setFillColor(10,10,10); doc.rect(M-1, y-3, CW+2, 12, 'F');
      doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(255,255,255);
      doc.text('COMPLETE BILL OF MATERIALS', M+2, y+5); y += 14;
      // Headers
      doc.setFillColor(220,220,220); doc.rect(M-1, y-3, CW+2, 10, 'F');
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(0,0,0);
      doc.text('Qty', M+1, y+4); doc.text('Part', M+14, y+4); doc.text('Specification', M+72, y+4); doc.text('Source / Est. Cost', W-M-2, y+4, {align:'right'});
      y += 11;
      v.bom.forEach((b, bi) => {
        check(11);
        if (bi%2===0) { doc.setFillColor(250,250,250); doc.rect(M-1, y-3, CW+2, 10, 'F'); }
        doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(0,80,0);
        doc.text(String(b.qty||1), M+4, y+3, {align:'center'});
        doc.setFont('helvetica', 'bold'); doc.setTextColor(0,0,0);
        doc.text(doc.splitTextToSize(b.item||'', 54)[0], M+14, y+3);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(40,40,40);
        doc.text(doc.splitTextToSize(b.spec||'', 58)[0], M+72, y+3);
        doc.setTextColor(60,60,180);
        doc.text(doc.splitTextToSize(b.source||'', 52)[0], W-M-2, y+3, {align:'right'});
        y += 10;
      });
      y += 4;
    }

    // Steps
    (v.steps || []).forEach((step, si) => {
      check(30);
      // Step header
      doc.setFillColor(30,30,30); doc.rect(M, y, CW, 12, 'F');
      doc.setFillColor(255,255,255); doc.circle(M+6, y+6, 4.5, 'F');
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(0,0,0);
      doc.text(String(si+1), M+6, y+7.5, {align:'center'});
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(255,255,255);
      doc.text(step.title || '', M+14, y+8);
      if (step.duration) { doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(180,180,180); doc.text(step.duration, W-M-2, y+8, {align:'right'}); }
      y += 16;

      // Description
      if (step.description) para(step.description, [10,10,10], 10);

      // Materials with full spec
      if (step.materials?.length) {
        check(8);
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0,100,0);
        doc.text('Materials for this step:', M+2, y); y += 6;
        step.materials.slice(0, 6).forEach(m => {
          check(7);
          doc.setFont('helvetica', 'normal'); doc.setTextColor(10,50,10); doc.setFontSize(8);
          const mLines = doc.splitTextToSize(`• ${m}`, CW-6);
          mLines.forEach(ml => { check(6); doc.text(ml, M+4, y); y += 5.5; });
        });
        y += 2;
      }

      // Warning
      if (step.warning) {
        check(14);
        doc.setFillColor(255,235,235); doc.rect(M+2, y-2, CW-4, 13, 'F');
        doc.setDrawColor(200,0,0); doc.setLineWidth(0.5); doc.rect(M+2, y-2, CW-4, 13, 'D');
        doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(180,0,0);
        doc.text('⚠ WARNING: ', M+5, y+6);
        doc.setFont('helvetica','normal');
        doc.text(doc.splitTextToSize(step.warning, CW-38)[0], M+32, y+6);
        y += 17;
      }

      // Checkpoint
      if (step.checkpoint) {
        check(12);
        doc.setFillColor(235,255,235); doc.rect(M+2, y-2, CW-4, 11, 'F');
        doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(0,120,0);
        doc.text('✅ CHECKPOINT: ', M+5, y+5);
        doc.setFont('helvetica','normal'); doc.setTextColor(0,60,0);
        doc.text(doc.splitTextToSize(step.checkpoint, CW-42)[0], M+38, y+5);
        y += 14;
      }

      doc.setDrawColor(180,180,180); doc.setLineWidth(0.2); doc.line(M, y, W-M, y); y += 6;
    });

    // Software / Notes
    if (v.softwareNotes) { check(14); doc.setFillColor(240,240,255); doc.rect(M, y-2, CW, 10, 'F'); para(`Software/Firmware: ${v.softwareNotes}`, [20,20,100], 9, true); }
    if (v.notes) para(v.notes, [60,60,60], 9);

    doc.setDrawColor(0,0,0); doc.setLineWidth(0.6); doc.line(M, y, W-M, y); y += 8;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'BUILD VIDEO LIBRARY'); }
  doc.save('zenith-apex-build-video-library.pdf');
}

// ── DOWNLOAD CARD COMPONENT ────────────────────────────────────────────────
function DownloadCard({ icon, title, desc, badge, color, children, extra }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all`}
      style={{ borderColor: color + '44', boxShadow: `0 0 0 0 ${color}` }}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: color + '18' }}>
            <span style={{ color }}>{icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-white font-black text-sm">{title}</h3>
              {badge && <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider" style={{ backgroundColor: color + '22', color }}>{badge}</span>}
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">{desc}</p>
            <div className="flex flex-wrap gap-2">
              {children}
              {extra && (
                <button onClick={() => setExpanded(e => !e)}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />} Details
                </button>
              )}
            </div>
          </div>
        </div>
        {expanded && extra && (
          <div className="mt-4 pl-16 text-gray-500 text-xs leading-relaxed">{extra}</div>
        )}
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function DownloadCenter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buildVideos, setBuildVideos] = useState([]);
  const [tab, setTab] = useState("investor");
  const [generatingVideos, setGeneratingVideos] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const me = await base44.auth.me();
    setUser(me);
    if (me?.role === 'admin') {
      const vids = await base44.entities.BuildVideo.list('-created_date', 100);
      setBuildVideos(vids);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={32} />
    </div>
  );

  if (user?.role !== 'admin') return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center p-8">
      <Shield size={48} className="text-gray-700 mb-4" />
      <h1 className="text-white font-black text-2xl mb-2">Admin Access Required</h1>
      <p className="text-gray-500 text-sm mb-6">The Download Center is restricted to admin accounts only.</p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm">← Back to Home</Link>
    </div>
  );

  const courses = (businessItems || []).filter(b => b.category === 'Video Course' || b.category === 'Course');
  const allInventions = (businessItems || []).filter(b => b.category === 'Invention');
  const inventionsWithSteps = allInventions.filter(inv => inventionSteps[inv.title]);
  const plans = allInventions.map(inv => {
    const data = inventionSteps[inv.title];
    // Estimate total cost from BOM
    const costMatches = (data?.bom || []).map(b => {
      const m = (b.source || '').match(/\$(\d[\d,.]+)/);
      return m ? parseFloat(m[1].replace(',', '')) : 0;
    });
    const totalCost = costMatches.reduce((a, b) => a + b, 0);
    const estCost = totalCost > 0 ? `~$${totalCost.toFixed(0)}` : 'Varies';

    return {
      name: inv.title,
      // Plain-English description (reuse tagline as analogy starter)
      whatItIs: inv.description,
      analogy: inv.tagline ? `"${inv.tagline}"` : null,
      howItWorks: data?.overview || null,
      description: inv.description,
      price: inv.price,
      estimatedCost: estCost,
      safetyNotes: null, // step-level warnings cover this
      notes: data?.notes || null,
      troubleshooting: data?.softwareNotes ? `Software & firmware: ${data.softwareNotes}` : null,
      tools: data ? [...new Set((data.steps || []).flatMap(s => []))].slice(0, 6) : [],
      // Full BOM with plain-English descriptions
      bom: (data?.bom || []).map(b => ({
        qty: b.qty,
        item: b.item,
        spec: b.spec,
        plainEnglish: b.spec,
        cost: (b.source || '').match(/\$[\d,.]+/)?.[0] || '—',
        source: (b.source || '').replace(/\s*~?\$[\d,.]+.*/, '').trim() || b.source,
        where: b.source || '—',
      })),
      // Steps with beginner notes
      steps: (data?.steps || []).map((s, i) => ({
        title: s.title,
        detail: s.detail,
        warning: s.warning || null,
        checkpoint: `Verify step ${i + 1} is complete before continuing: look at your work and make sure it matches the description above.`,
        beginnerNote: s.warning
          ? `⚠️ This step has a warning. Read it carefully!`
          : i === 0
          ? `Start here! Take it slow — there's no rush. Read the full step once before picking up any tools.`
          : `Good progress! You're on step ${i + 1}. Double-check the previous step looks right before continuing.`,
      })),
      // Fallback for inventions without detailed steps
      components: data?.bom ? [] : [],
    };
  });
  const genVideoPDF = () => {
    setGeneratingVideos(true);
    const stepGuides = inventionsWithSteps.map(inv => {
      const data = inventionSteps[inv.title];
      return {
        invention_name: inv.title,
        invention_category: inv.category,
        invention_tagline: inv.tagline,
        step_count: data.steps.length,
        overview: data.overview || '',
        notes: data.notes || '',
        softwareNotes: data.softwareNotes || '',
        bom: data.bom || [],
        steps: data.steps.map((s, i) => ({
          title: s.title,
          description: s.detail,
          warning: s.warning || null,
          checkpoint: `Verify step ${i + 1} is complete before continuing.`,
          // All BOM items with full spec — relevant per step
          materials: (data.bom || []).map(b => `${b.qty}× ${b.item} — ${b.spec} (${b.source})`),
        })),
      };
    });
    const allGuides = [...stepGuides, ...buildVideos.filter(v => !stepGuides.some(g => g.invention_name === v.invention_name))];
    setTimeout(() => { generateBuildVideosPDF(allGuides); setGeneratingVideos(false); }, 200);
  };

  const TABS = [
    { id: "investor", label: "Investor Package", icon: <Star size={13} /> },
    { id: "plans", label: "Invention Plans", icon: <Package size={13} /> },
    { id: "videos", label: "Build Videos", icon: <Film size={13} /> },
    { id: "courses", label: "Course Catalog", icon: <BookOpen size={13} /> },
    { id: "shop", label: "Shop Catalog", icon: <ShoppingBag size={13} /> },
    { id: "letter", label: "Master Letter", icon: <Mail size={13} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            {/* Mini logo */}
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polygon points="14,1 26,8 26,20 14,27 2,20 2,8" fill="#0c1850" stroke="#d4af37" strokeWidth="1.2"/>
                <line x1="8" y1="9" x2="20" y2="9" stroke="#f0d264" strokeWidth="1.4"/>
                <line x1="20" y1="9" x2="8" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
                <line x1="8" y1="19" x2="20" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
              </svg>
              <div>
                <h1 className="text-white font-black text-base tracking-tight">Download Center</h1>
                <p className="text-yellow-600 text-xs font-semibold">ZENITH APEX · ADMIN ONLY</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-lg bg-yellow-900/40 border border-yellow-700 text-yellow-400 font-bold">🔐 Admin Access</span>
          <Link to="/investor-package" className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white transition-colors">Investor Package ↗</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-800 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${tab === t.id ? 'bg-yellow-900/60 border border-yellow-700 text-yellow-300' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-4">

        {/* INVESTOR PACKAGE TAB */}
        {tab === "investor" && (
          <>
            <div className="bg-gray-900 border border-yellow-800/40 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <svg width="32" height="32" viewBox="0 0 28 28">
                  <polygon points="14,1 26,8 26,20 14,27 2,20 2,8" fill="#0c1850" stroke="#d4af37" strokeWidth="1.2"/>
                  <line x1="8" y1="9" x2="20" y2="9" stroke="#f0d264" strokeWidth="1.4"/>
                  <line x1="20" y1="9" x2="8" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
                  <line x1="8" y1="19" x2="20" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
                </svg>
                <div>
                  <h2 className="text-white font-black text-lg">Zenith Apex — Investor Package</h2>
                  <p className="text-yellow-600 text-xs">Navy & Gold Professional Branding · All Documents</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">Complete investor-ready document suite. All PDFs use the Zenith Apex brand identity with hexagonal tech logo, navy/midnight blue backgrounds, and gold typography.</p>
            </div>
            <DownloadCard icon={<FileText size={22} />} title="Mutual NDA" badge="Legal" color="#a855f7"
              desc="Professionally branded NDA with $2.5M liquidated damages clause, full Articles 1-8, signature blocks. Navy/gold theme with Zenith Apex logo on every page.">
              <NdaPdfGenerator />
            </DownloadCard>
            <DownloadCard icon={<BookOpen size={22} />} title="Technical Due Diligence Package" badge="100+ Pages" color="#3b82f6"
              desc="Complete 8-section institutional investment package: Platform Overview, AI Architecture, IP Portfolio, Primary Sources, Tech Stack, Revenue Model, Risk Analysis, Due Diligence Checklist.">
              <DueDiligencePdfGenerator />
            </DownloadCard>
          </>
        )}

        {/* INVENTION PLANS TAB */}
        {tab === "plans" && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-2">
              <p className="text-white font-bold mb-1">Invention Build Plans Library</p>
              <p className="text-gray-400 text-sm">{allInventions.length} invention build plans · {inventionsWithSteps.length} with full BOM & step-by-step assembly instructions.</p>
            </div>
            <DownloadCard icon={<Package size={22} />} title="All 21 Invention Plans — Full PDF" badge={`${allInventions.length} Devices`} color="#22c55e"
              desc="Complete engineering specifications for all 21 invention devices: MEG, TRD-1, TRZ Reactor, Prioré System, Scalar Comm, Biofield Chamber, VPO, Fireflies Sensor, PCM System, and more. Each plan includes description, components, assembly steps, and theory primer.">
              <button onClick={() => generateInventionPlansPDF(plans)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 hover:bg-green-700 text-white text-xs font-bold transition-all">
                <Download size={13} /> Download All {allInventions.length} Plans PDF
              </button>
            </DownloadCard>
            {/* Individual invention cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {allInventions.map((inv, i) => {
                const hasSteps = !!inventionSteps[inv.title];
                const stepData = inventionSteps[inv.title];
                return (
                  <div key={i} className={`bg-gray-900 border rounded-xl p-4 ${hasSteps ? 'border-green-900/50' : 'border-gray-800'}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-white font-bold text-sm leading-tight">{inv.icon} {inv.title}</p>
                      {hasSteps && <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-green-950/40 border border-green-800 text-green-400 font-bold">Full BOM</span>}
                    </div>
                    <p className="text-gray-500 text-xs mb-2">{inv.price}</p>
                    {hasSteps && (
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Wrench size={9} /> {stepData.bom?.length || 0} parts</span>
                        <span>{stepData.steps?.length || 0} steps</span>
                      </div>
                    )}
                    {!hasSteps && <p className="text-gray-700 text-xs">Description & specs included</p>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* BUILD VIDEOS TAB */}
        {tab === "videos" && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-2">
              <p className="text-white font-bold mb-1">Build Video / Step-by-Step Guide Library</p>
              <p className="text-gray-400 text-sm">{inventionsWithSteps.length} inventions with full step-by-step build guides from inventionSteps + {buildVideos.length} AI-generated build videos from database.</p>
            </div>
            <DownloadCard icon={<Film size={22} />} title="All Build Guides — Complete Engineering PDF" badge={`${inventionsWithSteps.length + buildVideos.length} Guides`} color="#f59e0b"
              desc={`Export all ${inventionsWithSteps.length} inventionSteps guides plus ${buildVideos.length} AI-generated build videos as a complete printable engineering PDF. Each guide includes detailed steps, BOM highlights, warnings, and checkpoints.`}>
              <button onClick={genVideoPDF} disabled={generatingVideos}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold transition-all disabled:opacity-60">
                {generatingVideos ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                {generatingVideos ? 'Building…' : `Download All ${inventionsWithSteps.length + buildVideos.length} Build Guides PDF`}
              </button>
            </DownloadCard>
            {/* Step-by-step guide cards from inventionSteps */}
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4">Full Step-by-Step Guides ({inventionsWithSteps.length})</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inventionsWithSteps.map((inv, i) => {
                const data = inventionSteps[inv.title];
                return (
                  <div key={i} className="bg-gray-900 border border-amber-900/40 rounded-xl p-4">
                    <p className="text-white font-bold text-sm">{inv.icon} {inv.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{data.steps?.length || 0} steps · {data.bom?.length || 0} BOM items</p>
                    <p className="text-gray-600 text-xs mt-1 leading-relaxed line-clamp-2">{data.overview?.slice(0, 120)}…</p>
                  </div>
                );
              })}
            </div>
            {/* DB build videos */}
            {buildVideos.length > 0 && (
              <>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4">AI-Generated Build Videos ({buildVideos.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {buildVideos.map((v, i) => (
                    <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <p className="text-white font-bold text-sm">{v.invention_name}</p>
                      <p className="text-gray-500 text-xs">{v.step_count || (v.steps || []).length} steps · {v.invention_category}</p>
                      <p className="text-gray-600 text-xs mt-1">{new Date(v.created_date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* COURSES TAB */}
        {tab === "courses" && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-2">
              <p className="text-white font-bold mb-1">Course Catalog</p>
              <p className="text-gray-400 text-sm">{courses.length} courses in the catalog. Download as a branded PDF for distribution.</p>
            </div>
            <DownloadCard icon={<BookOpen size={22} />} title="Complete Course Catalog PDF" badge={`${courses.length} Courses`} color="#8b5cf6"
              desc="Printable catalog of all courses: scalar EM fundamentals, MEG replication, Priore device, TRZ physics, bioelectromagnetics, psychoenergetics, defense applications. Includes pricing and module listings.">
              <button onClick={() => generateCoursesPDF(courses.length > 0 ? courses : [
                { name: 'Scalar EM Fundamentals', description: 'Complete introduction to Bearden scalar electromagnetics framework.', price: '$197', modules: ['Maxwell equations', 'Active vacuum', 'Gauge theory', 'COP>1 devices'] },
                { name: 'MEG Replication Workshop', description: 'Step-by-step MEG device replication with instrumented measurements.', price: '$297', modules: ['Core winding', 'Magnet array', 'Output measurement', 'COP analysis'] },
                { name: 'Bioelectromagnetics & Healing', description: 'Priore device, MCCS protocol, telomere restoration, and scalar medicine.', price: '$247', modules: ['Priore history', 'ONR validation', 'TRD-1 build', 'Protocol'] },
                { name: 'Defense Applications & History', description: 'KGB QP weapons, Baghdad M1A1 incident, Gulf War Syndrome analysis.', price: '$397', modules: ['QP weapons', 'TACOM memo', 'Gulf War', 'Countermeasures'] },
              ])}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold transition-all">
                <Download size={13} /> Download Course Catalog PDF
              </button>
            </DownloadCard>
          </>
        )}

        {/* SHOP TAB */}
        {tab === "shop" && (
          <DownloadCard icon={<ShoppingBag size={22} />} title="EMF Protection Shop — Product Catalog PDF" badge="20 Products" color="#10b981"
            desc="Complete printable product catalog: jewelry, home devices, clothing, supplements, DIY kits. Each product includes pricing, description, and specifications. Branded Zenith Apex layout.">
            <button onClick={() => { setTimeout(generateShopPDF, 100); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all">
              <Download size={13} /> Download Shop Catalog PDF
            </button>
          </DownloadCard>
        )}

        {/* MASTER LETTER TAB */}
        {tab === "letter" && (
          <>
            <DownloadCard icon={<Mail size={22} />} title="Master Acquisition Letter PDF" badge="Personalize Before Sending" color="#f59e0b"
              desc="Complete acquisition outreach letter with full valuation tables, asset summary, acquisition terms, and contact blocks. Branded Zenith Apex PDF — replace [YOUR NAME], [YOUR EMAIL], [YOUR PHONE] before sending.">
              <button onClick={() => { setTimeout(generateMasterLetterPDF, 100); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold transition-all">
                <Download size={13} /> Download Master Letter PDF
              </button>
            </DownloadCard>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mt-4">
              <p className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Letter Preview</p>
              <pre className="text-gray-500 text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">{MASTER_LETTER}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}