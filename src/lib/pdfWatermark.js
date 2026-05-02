/**
 * Adds a Zenith Apex Tech watermark to a jsPDF document
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {number} pageWidth - Page width in mm
 * @param {number} pageHeight - Page height in mm
 */
export function addZenithApexWatermark(doc, pageWidth, pageHeight) {
  const watermarkText = "ZENITH APEX TECH";
  const x = pageWidth - 30;
  const y = pageHeight - 25;

  doc.setFontSize(7);
  doc.setTextColor(0, 150, 200);
  doc.setFont(undefined, "bold");
  doc.text(watermarkText, x, y, { align: "right" });
  
  // Optional: Add a small circle outline
  doc.setDrawColor(0, 150, 200);
  doc.setLineWidth(0.3);
  doc.circle(x + 3, y - 5, 3);
}

/**
 * Adds watermark to all pages of a jsPDF document
 * @param {jsPDF} doc - The jsPDF document instance
 */
export function addWatermarkToAllPages(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.internal.pages.length - 1; // Exclude the first empty page

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addZenithApexWatermark(doc, pageWidth, pageHeight);
  }
}