// Shared Zenith Apex PDF branding theme — Black & White print-friendly

export const THEME = {
  // Backgrounds — all white/light gray for B&W printing
  pageBg:    [255, 255, 255],   // white
  headerBg:  [20, 20, 20],      // black header band
  accentBg:  [220, 220, 220],   // light gray section bands
  cardBg:    [245, 245, 245],   // very light gray cards
  ruleBg:    [180, 180, 180],
  // Typography — all grayscale
  gold:      [0, 0, 0],         // black (was gold)
  goldLight: [50, 50, 50],      // dark gray
  white:     [255, 255, 255],
  silver:    [20, 20, 20],      // near-black body text
  muted:     [70, 70, 70],      // medium gray
  dimmed:    [130, 130, 130],   // lighter gray
  // Accents — all grayscale
  cyan:      [60, 60, 60],
  green:     [40, 40, 40],
  red:       [60, 60, 60],
  // Dimensions
  margin: 18,
  pageW: 210,
  pageH: 297,
};

// Draw the Zenith Apex tech logo at (x, y) with given size
export function drawLogo(doc, x, y, size = 14) {
  const s = size;
  const cx = x + s * 0.5;
  const cy = y + s * 0.5;
  const r = s * 0.48;

  // Outer hexagon
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.6);
  const hex = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    hex.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  doc.setFillColor(20, 20, 20);
  doc.lines(hex.map((p, i) => [
    hex[(i + 1) % 6][0] - p[0],
    hex[(i + 1) % 6][1] - p[1]
  ]), hex[0][0], hex[0][1], [1, 1], 'FD', true);

  // Inner Z shape
  const zScale = r * 0.55;
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  doc.line(cx - zScale * 0.6, cy - zScale * 0.5, cx + zScale * 0.6, cy - zScale * 0.5);
  doc.line(cx + zScale * 0.6, cy - zScale * 0.5, cx - zScale * 0.6, cy + zScale * 0.5);
  doc.line(cx - zScale * 0.6, cy + zScale * 0.5, cx + zScale * 0.6, cy + zScale * 0.5);

  // Corner dots
  doc.setFillColor(255, 255, 255);
  hex.forEach(([px, py]) => {
    doc.circle(px, py, 0.7, 'F');
  });
}

// Draw branded page header band
export function drawPageHeader(doc, title, subtitle) {
  const { margin, pageW } = THEME;
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, pageW, 42, 'F');
  // Top rule
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, 1.5, 'F');

  drawLogo(doc, margin - 2, 13, 16);

  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ZENITH APEX', margin + 20, 22);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('ADVANCED RESEARCH PORTFOLIO', margin + 20, 29);

  if (title) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(title, pageW - margin, 22, { align: 'right' });
  }
  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text(subtitle, pageW - margin, 29, { align: 'right' });
  }

  // Bottom rule
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 41, pageW, 0.5, 'F');
}

// Draw footer on current page
export function drawFooter(doc, pageNum, totalPages, label) {
  const { pageW, margin } = THEME;
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 289, pageW, 8, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 289, pageW, 0.4, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('CONFIDENTIAL — ZENITH APEX RESEARCH PORTFOLIO — UNAUTHORIZED DISCLOSURE PROHIBITED', pageW / 2, 294, { align: 'center' });
  doc.text(`${label || ''}  ·  Page ${pageNum} of ${totalPages}`, pageW - margin, 294, { align: 'right' });
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, 294);
}