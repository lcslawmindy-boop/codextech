// ── Timeline Pitch Deck PDF Generator ───────────────────────────────────
// Generates a professional investor & grant funding PDF from the Timeline
// Pitch Deck slide data — includes both dark and light timeline scenarios.

import { jsPDF } from "jspdf";
import { SLIDES } from "@/pages/TimelinePitchDeckData";

// ── PDF theme ──
const COLORS = {
  bg: "#0a0e14",
  card: "#111827",
  text: "#e5e7eb",
  muted: "#6b7280",
  darkAccent: "#ef4444",
  lightAccent: "#00ffcc",
  green: "#22c55e",
  amber: "#f59e0b",
  blue: "#3b82f6",
  purple: "#a855f7",
  border: "#1f2937",
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function setFill(pdf, hex) {
  const [r, g, b] = hexToRgb(hex);
  pdf.setFillColor(r, g, b);
}

function setText(pdf, hex) {
  const [r, g, b] = hexToRgb(hex);
  pdf.setTextColor(r, g, b);
}

function setDraw(pdf, hex) {
  const [r, g, b] = hexToRgb(hex);
  pdf.setDrawColor(r, g, b);
}

// ── Page helpers ──

function fillBackground(pdf) {
  setFill(pdf, COLORS.bg);
  pdf.rect(0, 0, 595, 842, "F"); // A4
}

function addFooter(pdf, pageNum, total) {
  setText(pdf, COLORS.muted);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.text("Zenith Apex Research Division · Confidential — For Investor & Grant Review Only", 40, 815);
  pdf.text(`Page ${pageNum} / ${total}`, 515, 815);
  setDraw(pdf, COLORS.border);
  pdf.setLineWidth(0.3);
  pdf.line(40, 808, 555, 808);
}

function addSectionHeader(pdf, y, label, accent) {
  setDraw(pdf, accent);
  pdf.setLineWidth(3);
  pdf.line(40, y, 55, y + 14);
  setText(pdf, accent);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text(label.toUpperCase(), 62, y + 10);
  return y + 24;
}

function addCard(pdf, x, y, w, h, borderColor) {
  setFill(pdf, COLORS.card);
  setDraw(pdf, borderColor);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(x, y, w, h, 4, 4, "FD");
}

function wrapText(pdf, text, maxWidth, fontSize, fontStyle = "normal") {
  pdf.setFontSize(fontSize);
  pdf.setFont("helvetica", fontStyle);
  return pdf.splitTextToSize(text, maxWidth);
}

// ── Slide renderers ──

function renderCoverPage(pdf) {
  fillBackground(pdf);

  // Top accent bar
  setFill(pdf, COLORS.darkAccent);
  pdf.rect(0, 0, 595, 6, "F");
  setFill(pdf, COLORS.lightAccent);
  pdf.rect(0, 6, 595, 3, "F");

  // Title
  setText(pdf, COLORS.text);
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.text("THE ELECTROMAGNETIC CRISIS", 40, 120);
  pdf.setFontSize(14);
  setText(pdf, COLORS.lightAccent);
  pdf.text("& THE SCALAR ENERGY SOLUTION", 40, 145);

  // Subtitle
  setText(pdf, COLORS.muted);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  const sub = wrapText(pdf, "How EMF Weapons & Suppressed Physics Are Destroying Human Civilization — and How Bearden's Open-System Physics Will Heal Humanity & Transform Civilization", 515, 11);
  pdf.text(sub, 40, 175);

  // Divider
  setDraw(pdf, COLORS.border);
  pdf.setLineWidth(0.5);
  pdf.line(40, 210, 555, 210);

  // Meta block
  setText(pdf, COLORS.text);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("PREPARED FOR:", 40, 240);
  pdf.text("DOCUMENT TYPE:", 40, 260);
  pdf.text("CLASSIFICATION:", 40, 280);
  pdf.text("DATE:", 40, 300);

  setText(pdf, COLORS.muted);
  pdf.setFont("helvetica", "normal");
  pdf.text("Investor & Grant Funding Review", 170, 240);
  pdf.text("Timeline Pitch Deck — Dual Scenario Analysis", 170, 260);
  pdf.text("Confidential — Research & Experimental", 170, 280);
  pdf.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), 170, 300);

  // Summary box
  addCard(pdf, 40, 340, 515, 200, COLORS.border);
  setText(pdf, COLORS.lightAccent);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("EXECUTIVE SUMMARY", 55, 365);

  setText(pdf, COLORS.text);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const summary = wrapText(pdf,
    "This document presents a dual-scenario analysis of the 2026-2050 civilizational trajectory. The Dark Timeline extrapolates from documented EMF bioweapon science and geopolitical energy lock-in. The Light Timeline extrapolates from Bearden's scalar EM physics, Pior\u00e9's documented healing results, and the trajectory of open-system energy technology. The fork in the road is now. The physics is documented. The devices are buildable with off-the-shelf components. The healing mechanism is proven. What stands between the dark and light timelines is awareness, access, and action.",
    485, 9);
  pdf.text(summary, 55, 385);

  // Key metrics
  const metrics = [
    { label: "Market Opportunity", value: "$755B+", color: COLORS.green },
    { label: "Technology Readiness", value: "COTS Available", color: COLORS.lightAccent },
    { label: "Timeline Window", value: "2026-2032", color: COLORS.amber },
    { label: "IP Portfolio", value: "35+ Patents", color: COLORS.purple },
  ];
  metrics.forEach((m, i) => {
    const mx = 55 + i * 125;
    addCard(pdf, mx, 470, 115, 50, m.color);
    setText(pdf, m.color);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text(m.value, mx + 10, 492);
    setText(pdf, COLORS.muted);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text(m.label, mx + 10, 508);
  });

  // Disclaimer
  setText(pdf, COLORS.muted);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "italic");
  const disc = wrapText(pdf, "Research & Experimental: All concepts are derived from published works attributed to their original authors (Bearden, Pior\u00e9, Rife, Reich, Schauberger, et al.) and the Vedic/Sanskrit textual tradition. For research and experimental purposes only. Referenced under Fair Use (17 U.S.C. \u00a7 107).", 515, 7);
  pdf.text(disc, 40, 580);

  addFooter(pdf, 1, 1);
}

function renderProblemPage(pdf, pageNum, total) {
  fillBackground(pdf);
  let y = addSectionHeader(pdf, 50, "The Problem", COLORS.darkAccent);

  const dark = SLIDES.find(s => s.id === "problem").dark;
  setText(pdf, COLORS.text);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(dark.title, 40, y);
  y += 10;
  setText(pdf, COLORS.muted);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(dark.subtitle, 40, y);
  y += 20;

  // 6 stat cards in 2x3 grid
  const cardW = 165, cardH = 85, gap = 10;
  dark.body.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 40 + col * (cardW + gap);
    const cy = y + row * (cardH + gap);
    addCard(pdf, x, cy, cardW, cardH, COLORS.darkAccent + "60");

    setText(pdf, COLORS.darkAccent);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(item.stat, x + 12, cy + 22);

    setText(pdf, COLORS.text);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    const label = wrapText(pdf, item.label, cardW - 24, 8, "bold");
    pdf.text(label, x + 12, cy + 38);

    setText(pdf, COLORS.muted);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    const detail = wrapText(pdf, item.detail, cardW - 24, 7);
    pdf.text(detail, x + 12, cy + 52);
  });

  addFooter(pdf, pageNum, total);
}

function renderSolutionPage(pdf, pageNum, total) {
  fillBackground(pdf);
  let y = addSectionHeader(pdf, 50, "The Solution", COLORS.lightAccent);

  const light = SLIDES.find(s => s.id === "problem").light;
  setText(pdf, COLORS.text);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(light.title, 40, y);
  y += 10;
  setText(pdf, COLORS.muted);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(light.subtitle, 40, y);
  y += 20;

  const cardW = 165, cardH = 85, gap = 10;
  light.body.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 40 + col * (cardW + gap);
    const cy = y + row * (cardH + gap);
    addCard(pdf, x, cy, cardW, cardH, COLORS.lightAccent + "60");

    setText(pdf, COLORS.lightAccent);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(item.stat, x + 12, cy + 22);

    setText(pdf, COLORS.text);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    const label = wrapText(pdf, item.label, cardW - 24, 8, "bold");
    pdf.text(label, x + 12, cy + 38);

    setText(pdf, COLORS.muted);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    const detail = wrapText(pdf, item.detail, cardW - 24, 7);
    pdf.text(detail, x + 12, cy + 52);
  });

  addFooter(pdf, pageNum, total);
}

function renderMechanismPage(pdf, scenario, pageNum, total) {
  fillBackground(pdf);
  const accent = scenario === "dark" ? COLORS.darkAccent : COLORS.lightAccent;
  const label = scenario === "dark" ? "Mechanism — EMF Damage" : "Mechanism — Scalar Healing";
  let y = addSectionHeader(pdf, 50, label, accent);

  const s = SLIDES.find(sl => sl.id === "mechanism")[scenario];
  setText(pdf, COLORS.text);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  const title = wrapText(pdf, s.title, 515, 16, "bold");
  pdf.text(title, 40, y);
  y += 10;
  setText(pdf, COLORS.muted);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(s.subtitle, 40, y);
  y += 20;

  // 4 organ columns in 2x2 grid
  const cardW = 250, cardH = 130, gap = 15;
  s.cols.forEach((col, i) => {
    const cx = 40 + (i % 2) * (cardW + gap);
    const cy = y + Math.floor(i / 2) * (cardH + gap);
    addCard(pdf, cx, cy, cardW, cardH, col.color + "60");

    setText(pdf, col.color);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(col.organ, cx + 12, cy + 18);

    setText(pdf, COLORS.text);
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    let ey = cy + 32;
    col.effects.forEach(e => {
      const lines = wrapText(pdf, "\u25b8 " + e, cardW - 24, 7.5);
      pdf.text(lines, cx + 12, ey);
      ey += lines.length * 9 + 2;
    });
  });

  addFooter(pdf, pageNum, total);
}

function renderTimelinePage(pdf, scenario, slideId, pageNum, total) {
  fillBackground(pdf);
  const accent = scenario === "dark" ? COLORS.darkAccent : COLORS.lightAccent;
  const s = SLIDES.find(sl => sl.id === slideId)[scenario];
  let y = addSectionHeader(pdf, 50, `Timeline ${s.years}`, accent);

  setText(pdf, COLORS.text);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(s.title, 40, y);
  y += 10;
  setText(pdf, COLORS.muted);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(s.subtitle, 40, y);
  y += 20;

  // 4 category cards
  const cardW = 515, cardH = 75, gap = 10;
  s.items.forEach((item, i) => {
    const cy = y + i * (cardH + gap);
    addCard(pdf, 40, cy, cardW, cardH, COLORS.border);

    setText(pdf, accent);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(item.cat, 52, cy + 18);

    setText(pdf, COLORS.text);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const text = wrapText(pdf, item.text, cardW - 24, 9);
    pdf.text(text, 52, cy + 36);
  });

  addFooter(pdf, pageNum, total);
}

function renderTechnologyPage(pdf, scenario, pageNum, total) {
  fillBackground(pdf);
  const accent = scenario === "dark" ? COLORS.amber : COLORS.lightAccent;
  const label = scenario === "dark" ? "Suppressed Technology Stack" : "Deployable Solution Stack";
  let y = addSectionHeader(pdf, 50, label, accent);

  const s = SLIDES.find(sl => sl.id === "technology")[scenario];
  setText(pdf, COLORS.text);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(s.title, 40, y);
  y += 10;
  setText(pdf, COLORS.muted);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(s.subtitle, 40, y);
  y += 20;

  const cardW = 250, cardH = 80, gap = 12;
  s.body.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 40 + col * (cardW + gap);
    const cy = y + row * (cardH + gap);
    addCard(pdf, x, cy, cardW, cardH, COLORS.border);

    setText(pdf, COLORS.text);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    const title = wrapText(pdf, item.title, cardW - 24, 9, "bold");
    pdf.text(title, x + 12, cy + 18);

    setText(pdf, COLORS.muted);
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    const detail = wrapText(pdf, item.detail, cardW - 24, 7.5);
    pdf.text(detail, x + 12, cy + 34);
  });

  addFooter(pdf, pageNum, total);
}

function renderMarketPage(pdf, scenario, pageNum, total) {
  fillBackground(pdf);
  const accent = scenario === "dark" ? COLORS.darkAccent : COLORS.lightAccent;
  const label = scenario === "dark" ? "Cost of Inaction" : "Market Opportunity";
  let y = addSectionHeader(pdf, 50, label, accent);

  const s = SLIDES.find(sl => sl.id === "opportunity")[scenario];
  setText(pdf, COLORS.text);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(s.title, 40, y);
  y += 10;
  setText(pdf, COLORS.muted);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(s.subtitle, 40, y);
  y += 20;

  if (scenario === "dark" && s.costs) {
    s.costs.forEach((c, i) => {
      const cy = y + i * 60;
      addCard(pdf, 40, cy, 515, 52, c.color + "60");

      setText(pdf, c.color);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(c.year, 52, cy + 18);

      setText(pdf, COLORS.text);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      const event = wrapText(pdf, c.event, 430, 9, "bold");
      pdf.text(event, 100, cy + 18);

      setText(pdf, COLORS.muted);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(c.cost, 100, cy + 34);
    });
  } else if (s.markets) {
    const cardW = 250, cardH = 90, gap = 12;
    s.markets.forEach((m, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 40 + col * (cardW + gap);
      const cy = y + row * (cardH + gap);
      addCard(pdf, x, cy, cardW, cardH, m.color + "60");

      setText(pdf, m.color);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(m.sector, x + 12, cy + 18);

      setText(pdf, COLORS.muted);
      pdf.setFontSize(7);
      pdf.text(m.timeline, x + cardW - 60, cy + 18);

      setText(pdf, COLORS.text);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(m.tam, x + 12, cy + 38);

      setText(pdf, COLORS.muted);
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "normal");
      const desc = wrapText(pdf, m.desc, cardW - 24, 7.5);
      pdf.text(desc, x + 12, cy + 52);
    });
  }

  addFooter(pdf, pageNum, total);
}

function renderFundingAskPage(pdf, pageNum, total) {
  fillBackground(pdf);
  let y = addSectionHeader(pdf, 50, "Funding Ask & Use of Funds", COLORS.green);

  setText(pdf, COLORS.text);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("INVESTMENT & GRANT FUNDING REQUEST", 40, y);
  y += 20;

  // Funding ask
  addCard(pdf, 40, y, 515, 60, COLORS.green + "60");
  setText(pdf, COLORS.green);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("$2.4M Seed Round", 52, y + 25);
  setText(pdf, COLORS.muted);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Equity: 12% · Valuation: $20M post-money · Timeline: 18 months to FDA 510(k) submission", 52, y + 42);
  y += 80;

  // Use of funds breakdown
  setText(pdf, COLORS.text);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("USE OF FUNDS", 40, y);
  y += 15;

  const useOfFunds = [
    { item: "Clinical Validation Study (50 subjects, IRB protocol)", amount: "$680K", pct: "28%", color: COLORS.green },
    { item: "FDA 510(k) Submission & Regulatory Consulting", amount: "$420K", pct: "18%", color: COLORS.lightAccent },
    { item: "AI Calibration Algorithm Development", amount: "$380K", pct: "16%", color: COLORS.purple },
    { item: "Patent Portfolio Filing (8 provisionals → 4 utility)", amount: "$320K", pct: "13%", color: COLORS.amber },
    { item: "AATCS-P1 Prototype Manufacturing (3 units)", amount: "$300K", pct: "13%", color: COLORS.blue },
    { item: "Team Expansion (2 engineers, 1 regulatory lead)", amount: "$300K", pct: "12%", color: COLORS.darkAccent },
  ];

  useOfFunds.forEach((u, i) => {
    const cy = y + i * 38;
    addCard(pdf, 40, cy, 515, 32, COLORS.border);
    setText(pdf, COLORS.text);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(u.item, 52, cy + 14);
    setText(pdf, u.color);
    pdf.setFont("helvetica", "bold");
    pdf.text(u.amount, 420, cy + 14);
    setText(pdf, COLORS.muted);
    pdf.setFont("helvetica", "normal");
    pdf.text(u.pct, 500, cy + 14);
  });
  y += useOfFunds.length * 38 + 10;

  // Milestones
  setText(pdf, COLORS.text);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("18-MONTH MILESTONES", 40, y);
  y += 15;

  const milestones = [
    { q: "Q1-Q2", task: "File 4 provisional patents · Build AATCS-P1 prototype v2 · IRB approval" },
    { q: "Q3-Q4", task: "Clinical validation study enrollment · AI calibration v1 · 510(k) predicate analysis" },
    { q: "Q5-Q6", task: "Clinical data analysis · 510(k) submission · Series A preparation" },
  ];

  milestones.forEach((m, i) => {
    const cy = y + i * 40;
    addCard(pdf, 40, cy, 515, 34, COLORS.border);
    setText(pdf, COLORS.green);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(m.q, 52, cy + 15);
    setText(pdf, COLORS.text);
    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "normal");
    const task = wrapText(pdf, m.task, 430, 8.5);
    pdf.text(task, 100, cy + 15);
  });

  addFooter(pdf, pageNum, total);
}

function renderContactPage(pdf, pageNum, total) {
  fillBackground(pdf);
  let y = addSectionHeader(pdf, 50, "Contact & Next Steps", COLORS.lightAccent);

  setText(pdf, COLORS.text);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("THE FORK IN THE ROAD IS NOW", 40, y);
  y += 25;

  const cta = SLIDES.find(s => s.id === "cta").light;
  setText(pdf, COLORS.text);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const msg = wrapText(pdf, cta.message, 515, 10);
  pdf.text(msg, 40, y);
  y += msg.length * 12 + 15;

  // Next steps cards
  addCard(pdf, 40, y, 515, 120, COLORS.green + "60");
  setText(pdf, COLORS.green);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("IMMEDIATE NEXT STEPS", 52, y + 20);

  const steps = [
    "Schedule a technical deep-dive presentation (60 min)",
    "Review the AATCS-P1 prototype and clinical validation protocol",
    "Access the full IP portfolio and patent filing roadmap",
    "Discuss term sheet and investment structure",
  ];
  setText(pdf, COLORS.text);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  steps.forEach((s, i) => {
    pdf.text(`${i + 1}. ${s}`, 52, y + 40 + i * 18);
  });
  y += 140;

  // Contact info
  addCard(pdf, 40, y, 515, 80, COLORS.border);
  setText(pdf, COLORS.lightAccent);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Zenith Apex Research Division", 52, y + 22);
  setText(pdf, COLORS.muted);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("Investor & Grant Funding Inquiries", 52, y + 38);
  pdf.text("Confidential — For authorized reviewers only", 52, y + 52);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 52, y + 66);

  addFooter(pdf, pageNum, total);
}

// ── Main export ──

export function generateTimelinePitchPdf() {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });

  // Calculate total pages: cover + problem + solution + mechanism(dark+light) +
  // timeline_10(dark+light) + timeline_30(dark+light) + timeline_50(dark+light) +
  // technology(dark+light) + market(dark+light) + funding + contact
  const total = 14;
  let page = 1;

  renderCoverPage(pdf);
  pdf.addPage(); page++;
  renderProblemPage(pdf, page, total);
  pdf.addPage(); page++;
  renderSolutionPage(pdf, page, total);
  pdf.addPage(); page++;
  renderMechanismPage(pdf, "dark", page, total);
  pdf.addPage(); page++;
  renderMechanismPage(pdf, "light", page, total);
  pdf.addPage(); page++;
  renderTimelinePage(pdf, "dark", "timeline_10", page, total);
  pdf.addPage(); page++;
  renderTimelinePage(pdf, "light", "timeline_10", page, total);
  pdf.addPage(); page++;
  renderTimelinePage(pdf, "dark", "timeline_30", page, total);
  pdf.addPage(); page++;
  renderTimelinePage(pdf, "light", "timeline_30", page, total);
  pdf.addPage(); page++;
  renderTimelinePage(pdf, "dark", "timeline_50", page, total);
  pdf.addPage(); page++;
  renderTimelinePage(pdf, "light", "timeline_50", page, total);
  pdf.addPage(); page++;
  renderTechnologyPage(pdf, "dark", page, total);
  pdf.addPage(); page++;
  renderTechnologyPage(pdf, "light", page, total);
  pdf.addPage(); page++;
  renderMarketPage(pdf, "dark", page, total);
  pdf.addPage(); page++;
  renderMarketPage(pdf, "light", page, total);
  pdf.addPage(); page++;
  renderFundingAskPage(pdf, page, total);
  pdf.addPage(); page++;
  renderContactPage(pdf, page, total);

  pdf.save(`Zenith-Apex-Timeline-Pitch-${new Date().toISOString().slice(0, 10)}.pdf`);
}