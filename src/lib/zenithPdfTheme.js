// Shared Zenith Apex PDF branding theme — Black & White print-friendly, large readable fonts

export const THEME = {
  // Backgrounds — pure B&W
  pageBg:    [255, 255, 255],
  headerBg:  [10, 10, 10],
  accentBg:  [230, 230, 230],
  cardBg:    [245, 245, 245],
  ruleBg:    [160, 160, 160],
  // Typography — strict grayscale
  gold:      [0, 0, 0],
  goldLight: [40, 40, 40],
  white:     [255, 255, 255],
  silver:    [15, 15, 15],
  muted:     [60, 60, 60],
  dimmed:    [110, 110, 110],
  cyan:      [50, 50, 50],
  green:     [30, 30, 30],
  red:       [50, 50, 50],
  // Dimensions — wider margin for readability
  margin: 20,
  pageW: 210,
  pageH: 297,
};

// Draw the Zenith Apex hexagonal logo at (x, y)
export function drawLogo(doc, x, y, size = 16) {
  const s = size;
  const cx = x + s * 0.5;
  const cy = y + s * 0.5;
  const r = s * 0.48;

  const hex = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    hex.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  doc.setFillColor(10, 10, 10);
  doc.lines(hex.map((p, i) => [
    hex[(i + 1) % 6][0] - p[0],
    hex[(i + 1) % 6][1] - p[1]
  ]), hex[0][0], hex[0][1], [1, 1], 'FD', true);

  const zScale = r * 0.55;
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.0);
  doc.line(cx - zScale * 0.6, cy - zScale * 0.5, cx + zScale * 0.6, cy - zScale * 0.5);
  doc.line(cx + zScale * 0.6, cy - zScale * 0.5, cx - zScale * 0.6, cy + zScale * 0.5);
  doc.line(cx - zScale * 0.6, cy + zScale * 0.5, cx + zScale * 0.6, cy + zScale * 0.5);

  doc.setFillColor(255, 255, 255);
  hex.forEach(([px, py]) => doc.circle(px, py, 0.8, 'F'));
}

// Draw branded page header band — taller, larger fonts
export function drawPageHeader(doc, title, subtitle) {
  const { margin, pageW } = THEME;
  // Main band
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageW, 50, 'F');
  // Top accent rule
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, 2, 'F');

  drawLogo(doc, margin - 2, 16, 18);

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ZENITH APEX', margin + 24, 27);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 190, 190);
  doc.text('ADVANCED RESEARCH PORTFOLIO', margin + 24, 35);

  if (title) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(title, pageW - margin, 27, { align: 'right' });
  }
  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180);
    doc.text(subtitle, pageW - margin, 35, { align: 'right' });
  }

  // Bottom rule
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 49, pageW, 1, 'F');
}

// Draw footer on all pages
export function drawFooter(doc, pageNum, totalPages, label) {
  const { pageW, margin } = THEME;
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 287, pageW, 10, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 287, pageW, 0.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('CONFIDENTIAL — ZENITH APEX RESEARCH PORTFOLIO — UNAUTHORIZED DISCLOSURE PROHIBITED', pageW / 2, 293, { align: 'center' });
  doc.text(`${label || ''}  ·  Page ${pageNum} of ${totalPages}`, pageW - margin, 293, { align: 'right' });
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, 293);
}