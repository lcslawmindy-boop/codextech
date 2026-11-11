import { jsPDF } from 'jspdf';

const clean = text => String(text || '').replace(/[\u2013\u2014]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[^\x09\x0a\x0d\x20-\x7e\xa0-\xff]/g, '');

export function buildChapterPDF(packs) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const ranges = {};
  let y = 24;
  const page = () => {
    doc.setFillColor(10, 16, 28);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(205, 215, 230);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    y = 24;
  };
  const next = () => { doc.addPage(); page(); };
  const lines = (text, size = 11, bold = false) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    for (const line of doc.splitTextToSize(clean(text), 174)) {
      if (y > 273) next();
      doc.setFontSize(size);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.text(line, 18, y);
      y += 7;
    }
    y += 3;
  };
  page();
  lines('AETHON APEX IP', 12, true);
  y += 14;
  lines('Master Technical Brief Pack', 24, true);
  lines(`${packs.length} device research dossiers`, 14);
  lines(`Generated ${new Date().toLocaleDateString()}`);
  lines('AI-generated research drafts. Unverified proposals are not established evidence, validated designs, clinical guidance or authorization to build hazardous systems.');
  lines('This document contains the saved long-form chapters only. Legacy placeholder content is excluded.');
  const countY = y + 8;
  next();
  const contentsPage = doc.getNumberOfPages();
  lines('CONTENTS', 16, true);
  for (const pack of packs) {
    next();
    const start = doc.getNumberOfPages();
    lines(pack.title, 20, true);
    lines(pack.subtitle, 12);
    lines(`Category: ${pack.category}`);
    lines('Internal research draft. Human technical and safety review required before any implementation or external disclosure.');
    for (const chapter of pack.chapters) {
      next();
      lines(`${chapter.chapter_index + 1}. ${chapter.chapter_title}`, 15, true);
      for (const paragraph of chapter.text.split(/\n\s*\n/)) lines(paragraph);
    }
    ranges[pack.id] = { start, end: doc.getNumberOfPages(), pages: doc.getNumberOfPages() - start + 1 };
  }
  const total = doc.getNumberOfPages();
  doc.setPage(1);
  y = countY;
  lines(`${total.toLocaleString()} actual PDF pages`, 14, true);
  doc.setPage(contentsPage);
  y = 38;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  for (const pack of packs) {
    const range = ranges[pack.id];
    const label = doc.splitTextToSize(clean(pack.title), 145)[0];
    doc.text(label, 18, y);
    doc.text(`${range.start}-${range.end}`, 192, y, { align: 'right' });
    y += 6.8;
  }
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(125, 145, 175);
    doc.text('CONFIDENTIAL | AI research draft | Not for medical use', 18, 289);
    doc.text(`${i} / ${total}`, 192, 289, { align: 'right' });
  }
  return { doc, pageCount: total, ranges };
}