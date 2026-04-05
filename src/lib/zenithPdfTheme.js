// Shared Zenith Apex PDF branding theme
// Navy/Midnight blue + Gold accent professional palette

export const THEME = {
  // Backgrounds
  pageBg:    [4, 8, 28],        // deep navy
  headerBg:  [8, 18, 60],       // midnight blue
  accentBg:  [12, 24, 80],      // section header
  cardBg:    [10, 20, 52],      // card fill
  ruleBg:    [20, 38, 100],     // light rule
  // Typography
  gold:      [212, 175, 55],    // Zenith gold
  goldLight: [240, 210, 100],   // lighter gold
  white:     [255, 255, 255],
  silver:    [200, 210, 230],
  muted:     [130, 145, 175],
  dimmed:    [70, 80, 110],
  // Accent
  cyan:      [80, 200, 240],
  green:     [60, 210, 120],
  red:       [240, 70, 70],
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
  doc.setDrawColor(...THEME.gold);
  doc.setLineWidth(0.6);
  const hex = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    hex.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  doc.setFillColor(12, 24, 80);
  doc.lines(hex.map((p, i) => [
    hex[(i + 1) % 6][0] - p[0],
    hex[(i + 1) % 6][1] - p[1]
  ]), hex[0][0], hex[0][1], [1, 1], 'FD', true);

  // Inner Z shape
  const zScale = r * 0.55;
  doc.setDrawColor(...THEME.goldLight);
  doc.setLineWidth(0.8);
  // Top bar
  doc.line(cx - zScale * 0.6, cy - zScale * 0.5, cx + zScale * 0.6, cy - zScale * 0.5);
  // Diagonal
  doc.line(cx + zScale * 0.6, cy - zScale * 0.5, cx - zScale * 0.6, cy + zScale * 0.5);
  // Bottom bar
  doc.line(cx - zScale * 0.6, cy + zScale * 0.5, cx + zScale * 0.6, cy + zScale * 0.5);

  // Corner circuit dots
  doc.setFillColor(...THEME.gold);
  hex.forEach(([px, py]) => {
    doc.circle(px, py, 0.7, 'F');
  });
}

// Draw branded page header band
export function drawPageHeader(doc, title, subtitle) {
  const { margin, pageW, gold, white, silver, muted, headerBg } = THEME;
  doc.setFillColor(...headerBg);
  doc.rect(0, 0, pageW, 38, 'F');
  // Gold top rule
  doc.setFillColor(...gold);
  doc.rect(0, 0, pageW, 1.5, 'F');

  drawLogo(doc, margin - 2, 12, 14);

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...white);
  doc.text('ZENITH APEX', margin + 17, 20);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gold);
  doc.text('ADVANCED RESEARCH PORTFOLIO', margin + 17, 26);

  if (title) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...silver);
    doc.text(title, pageW - margin, 20, { align: 'right' });
  }
  if (subtitle) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...muted);
    doc.text(subtitle, pageW - margin, 26, { align: 'right' });
  }

  // Bottom rule gold
  doc.setFillColor(...gold);
  doc.rect(0, 37, pageW, 0.5, 'F');
}

// Draw footer on current page
export function drawFooter(doc, pageNum, totalPages, label) {
  const { pageW, margin, dimmed, gold } = THEME;
  doc.setFillColor(...[8, 18, 60]);
  doc.rect(0, 289, pageW, 8, 'F');
  doc.setFillColor(...gold);
  doc.rect(0, 289, pageW, 0.4, 'F');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...[100, 110, 140]);
  doc.text('CONFIDENTIAL — ZENITH APEX RESEARCH PORTFOLIO — UNAUTHORIZED DISCLOSURE PROHIBITED', pageW / 2, 293, { align: 'center' });
  doc.text(`${label || ''}  ·  Page ${pageNum} of ${totalPages}`, pageW - margin, 293, { align: 'right' });
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, 293);
}