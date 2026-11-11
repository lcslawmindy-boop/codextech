import { buildChapterPDF } from '@/lib/briefPackChapterPdf';

export function generateFullMasterPDF(packs) {
  const result = buildChapterPDF(packs);
  const full = packs.length === 33 && packs.every(pack => pack.chapters.filter(chapter => chapter.chapter_index < 20).length === 20) && result.pageCount >= 1400;
  result.doc.setProperties({ title: `${full ? 'Full' : 'DRAFT - Incomplete'} Master Technical Brief Pack`, subject: `${result.pageCount} actual pages; AI-generated, unverified research` });
  if (!full) {
    result.doc.setPage(1);
    result.doc.setTextColor(255, 190, 90);
    result.doc.setFontSize(16);
    result.doc.text('DRAFT - INCOMPLETE MANUSCRIPT', 18, 266);
  }
  result.doc.save(`Aethon-Apex-Master-Brief-Pack-${full ? 'Full' : 'DRAFT'}-${result.pageCount}pages.pdf`);
  return { pageCount: result.pageCount, full };
}