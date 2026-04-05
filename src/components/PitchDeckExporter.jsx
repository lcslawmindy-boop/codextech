import { useState } from "react";
import { X, Download, ChevronLeft, ChevronRight, Loader2, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";

// ── Brand palette ─────────────────────────────────────────────────────────────
const BRAND = {
  bg: [8, 8, 18],
  surface: [16, 16, 32],
  accent: [80, 140, 255],
  accentAlt: [130, 80, 255],
  gold: [245, 185, 60],
  text: [230, 230, 240],
  muted: [120, 120, 150],
  success: [52, 211, 153],
  danger: [248, 113, 113],
};

const SLIDE_TYPES = [
  { key: "cover", label: "Cover" },
  { key: "problem", label: "Problem & Solution" },
  { key: "market", label: "Market Opportunity" },
  { key: "tech", label: "Technology" },
  { key: "financials", label: "Financials" },
  { key: "ip", label: "IP Strategy" },
  { key: "launch", label: "Launch Plan" },
  { key: "ask", label: "The Ask" },
];

// ── PDF generation ────────────────────────────────────────────────────────────
function buildPDF(inventions) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210;

  const fill = (r, g, b) => { doc.setFillColor(r, g, b); };
  const stroke = (r, g, b) => { doc.setDrawColor(r, g, b); };
  const color = (r, g, b) => { doc.setTextColor(r, g, b); };
  const font = (size, style = "normal") => { doc.setFontSize(size); doc.setFont("helvetica", style); };
  const txt = (text, x, y, maxW) => {
    const lines = maxW ? doc.splitTextToSize(String(text || ""), maxW) : [String(text || "")];
    lines.forEach((l, i) => doc.text(l, x, y + i * (doc.getFontSize() * 0.42)));
    return lines.length * (doc.getFontSize() * 0.42);
  };

  const bg = () => { fill(...BRAND.bg); doc.rect(0, 0, W, H, "F"); };
  const accentBar = (h = 1.5) => {
    // gradient-style bar using two rects
    fill(...BRAND.accent); doc.rect(0, H - h, W * 0.6, h, "F");
    fill(...BRAND.accentAlt); doc.rect(W * 0.6, H - h, W * 0.4, h, "F");
  };
  const watermark = () => {
    color(...BRAND.muted); font(7); doc.setTextColor(40, 40, 60);
    doc.text("ZENITH APEX RESEARCH · CONFIDENTIAL · VC PRESENTATION", W / 2, H - 4, { align: "center" });
  };
  const pageNum = (n, total) => {
    color(...BRAND.muted); font(7);
    doc.text(`${n} / ${total}`, W - 10, H - 4, { align: "right" });
  };

  // ── Master cover page ──────────────────────────────────────────────────────
  bg();
  // Big gradient block
  fill(...BRAND.accent); doc.rect(0, 0, 12, H, "F");
  fill(...BRAND.accentAlt); doc.rect(12, 0, 4, H, "F");

  color(...BRAND.gold); font(9, "bold");
  doc.text("ZENITH APEX RESEARCH", 28, 22);
  color(...BRAND.text); font(28, "bold");
  doc.text("Scalar EM Invention Portfolio", 28, 44, { maxWidth: W - 40 });
  color(...BRAND.muted); font(11);
  doc.text(`${inventions.length} Novel Deep-Tech Invention${inventions.length > 1 ? "s" : ""} · Investor Package`, 28, 56);
  color(...BRAND.muted); font(9);
  doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 28, 65);

  // TOC
  fill(...BRAND.surface); doc.rect(28, 78, W - 38, H - 98, "F");
  color(...BRAND.accent); font(9, "bold");
  doc.text("CONTENTS", 34, 88);
  inventions.forEach((inv, i) => {
    color(...BRAND.text); font(9, "normal");
    doc.text(`${String(i + 1).padStart(2, "0")}  ${inv.name}`, 34, 98 + i * 9);
    color(...BRAND.muted); font(8);
    doc.text(inv.category || "", W - 50, 98 + i * 9, { align: "right" });
  });

  accentBar(2); watermark(); pageNum(1, inventions.length * 8 + 1);

  // ── Per-invention slides ───────────────────────────────────────────────────
  let pageN = 2;
  const total = inventions.length * 8 + 1;

  inventions.forEach((inv, idx) => {
    const colors = [BRAND.accent, BRAND.accentAlt, [52, 211, 153], [245, 185, 60], [248, 113, 113], [6, 182, 212]];
    const c = colors[idx % colors.length];

    // ── Slide 1: Cover ──────────────────────────────────────────────────────
    bg();
    fill(...c); doc.rect(0, 0, W, 55, "F");
    // Diagonal cut
    doc.setFillColor(...BRAND.bg);
    doc.triangle(0, 55, W, 40, W, 55, "F");

    color(255, 255, 255); font(22, "bold");
    txt(inv.name, 18, 22, W - 40);
    color(255, 255, 255); font(10);
    txt(`"${inv.tagline || ""}"`, 18, 36, W - 40);

    // Badges
    let bx = 18;
    [[inv.category, BRAND.surface, c], [inv.stage, BRAND.surface, BRAND.gold], [`IP: ${inv.ipValuation}`, BRAND.surface, BRAND.success]].forEach(([label, bg2, tc]) => {
      if (!label) return;
      fill(...bg2); doc.roundedRect(bx, 62, label.length * 2.1 + 6, 8, 2, 2, "F");
      color(...tc); font(8, "bold"); doc.text(label, bx + 3, 67.5);
      bx += label.length * 2.1 + 10;
    });

    // Stats row
    const stats = [
      { label: "Funding Ask", value: inv.fundingAsk || "TBD" },
      { label: "Equity", value: inv.equity || "TBD" },
      { label: "5-yr Revenue", value: inv.fiveYrRevenue || "TBD" },
      { label: "IP Value", value: inv.ipValuation || "TBD" },
    ];
    stats.forEach((s, i) => {
      const sx = 18 + i * 68;
      fill(...BRAND.surface); doc.rect(sx, 78, 62, 20, "F");
      color(...c); font(13, "bold"); doc.text(s.value, sx + 4, 90);
      color(...BRAND.muted); font(7); doc.text(s.label.toUpperCase(), sx + 4, 95);
    });

    color(...BRAND.muted); font(8);
    txt(`Invention ${idx + 1} of ${inventions.length} · Zenith Apex Research · Proprietary & Confidential`, 18, H - 14, W - 30);
    accentBar(); watermark(); pageNum(pageN++, total);

    // ── Slide 2: Problem & Solution ─────────────────────────────────────────
    bg();
    fill(...c); doc.rect(0, 0, W, 18, "F");
    color(255, 255, 255); font(13, "bold"); doc.text("PROBLEM & SOLUTION", 14, 12);
    color(...BRAND.muted); font(8); doc.text(inv.name, W - 14, 12, { align: "right" });

    // Problem box
    fill(60, 15, 15); doc.rect(14, 24, (W - 28) / 2 - 4, H - 50, "F");
    color(...BRAND.danger); font(9, "bold"); doc.text("THE PROBLEM", 18, 33);
    color(...BRAND.text); font(8, "normal"); txt(inv.problem || "", 18, 40, (W - 28) / 2 - 10);

    // Solution box
    const sx2 = 14 + (W - 28) / 2 + 4;
    fill(10, 50, 30); doc.rect(sx2, 24, (W - 28) / 2 - 4, H - 50, "F");
    color(...BRAND.success); font(9, "bold"); doc.text("THE SOLUTION", sx2 + 4, 33);
    color(...BRAND.text); font(8, "normal"); txt(inv.solution || "", sx2 + 4, 40, (W - 28) / 2 - 10);

    // Description strip
    fill(...BRAND.surface); doc.rect(14, H - 24, W - 28, 16, "F");
    color(...BRAND.muted); font(7, "normal"); txt(inv.description || "", 18, H - 17, W - 36);

    accentBar(); watermark(); pageNum(pageN++, total);

    // ── Slide 3: Market Opportunity ─────────────────────────────────────────
    bg();
    fill(...c); doc.rect(0, 0, W, 18, "F");
    color(255, 255, 255); font(13, "bold"); doc.text("MARKET OPPORTUNITY", 14, 12);
    color(...BRAND.muted); font(8); doc.text(inv.name, W - 14, 12, { align: "right" });

    // Market size block
    fill(...BRAND.surface); doc.rect(14, 24, W - 28, 28, "F");
    color(...c); font(16, "bold"); txt(inv.marketSize || "Global Market", 18, 38, W - 36);

    // Channels
    color(...BRAND.text); font(9, "bold"); doc.text("GO-TO-MARKET CHANNELS", 14, 64);
    (inv.channels || []).forEach((ch, i) => {
      const cx = 14 + (i % 3) * 88, cy = 70 + Math.floor(i / 3) * 14;
      fill(...BRAND.surface); doc.rect(cx, cy, 82, 10, "F");
      fill(...c); doc.rect(cx, cy, 3, 10, "F");
      color(...BRAND.text); font(8); doc.text(ch, cx + 6, cy + 6.5);
    });

    // Manufacturing note
    fill(20, 20, 40); doc.rect(14, H - 32, W - 28, 20, "F");
    color(...BRAND.muted); font(7, "bold"); doc.text("MANUFACTURING PATHWAY", 18, H - 24);
    color(...BRAND.text); font(7, "normal"); txt(inv.manufacturing || "", 18, H - 19, W - 36);

    accentBar(); watermark(); pageNum(pageN++, total);

    // ── Slide 4: Technology ─────────────────────────────────────────────────
    bg();
    fill(...c); doc.rect(0, 0, W, 18, "F");
    color(255, 255, 255); font(13, "bold"); doc.text("TECHNOLOGY & SPECIFICATIONS", 14, 12);
    color(...BRAND.muted); font(8); doc.text(inv.name, W - 14, 12, { align: "right" });

    // Specs grid
    color(...BRAND.text); font(9, "bold"); doc.text("TECHNICAL SPECIFICATIONS", 14, 28);
    const specs = inv.specs || [];
    specs.slice(0, 6).forEach((s, i) => {
      const gx = 14 + (i % 2) * 138, gy = 33 + Math.floor(i / 2) * 20;
      fill(...BRAND.surface); doc.rect(gx, gy, 132, 16, "F");
      fill(...c); doc.rect(gx, gy, 3, 16, "F");
      color(...c); font(8, "bold"); doc.text(s.label || "", gx + 6, gy + 7);
      color(...BRAND.text); font(8, "normal"); txt(s.value || "", gx + 6, gy + 12, 120);
    });

    // Principles
    color(...BRAND.text); font(9, "bold"); doc.text("KEY BEARDEN PRINCIPLES", 14, 100);
    (inv.principles || []).slice(0, 5).forEach((p, i) => {
      const px = 14 + (i % 3) * 90, py = 105 + Math.floor(i / 3) * 12;
      fill(30, 20, 60); doc.roundedRect(px, py, 84, 9, 2, 2, "F");
      color(...BRAND.accentAlt); font(7, "bold"); doc.text(p, px + 4, py + 5.5, { maxWidth: 76 });
    });

    accentBar(); watermark(); pageNum(pageN++, total);

    // ── Slide 5: Financials ─────────────────────────────────────────────────
    bg();
    fill(...c); doc.rect(0, 0, W, 18, "F");
    color(255, 255, 255); font(13, "bold"); doc.text("FINANCIAL PROJECTIONS", 14, 12);
    color(...BRAND.muted); font(8); doc.text(inv.name, W - 14, 12, { align: "right" });

    // Summary KPIs
    const kpis = [
      { label: "Pre-Seed Ask", value: inv.preSeed || "—" },
      { label: "Series A", value: inv.seriesA || "—" },
      { label: "5-Year Revenue", value: inv.fiveYrRevenue || "—" },
    ];
    kpis.forEach((k, i) => {
      const kx = 14 + i * 92;
      fill(...BRAND.surface); doc.rect(kx, 22, 86, 18, "F");
      fill(...c); doc.rect(kx, 22, 86, 2, "F");
      color(...c); font(14, "bold"); doc.text(k.value, kx + 4, 34);
      color(...BRAND.muted); font(7); doc.text(k.label.toUpperCase(), kx + 4, 37);
    });

    // Table
    const projections = (inv.financials?.projections || []);
    const headers = ["Year", "Revenue", "COGS", "Gross Profit", "EBITDA", "Cum. Investment"];
    const colWidths = [18, 42, 38, 42, 38, 48];
    let tx = 14, ty = 48;
    fill(...BRAND.surface); doc.rect(14, ty - 6, W - 28, 9, "F");
    headers.forEach((h, i) => {
      color(...BRAND.muted); font(7, "bold"); doc.text(h, tx + 2, ty);
      tx += colWidths[i];
    });
    ty += 3;
    projections.slice(0, 5).forEach((row, ri) => {
      if (ri % 2 === 0) { fill(16, 16, 32); doc.rect(14, ty - 4, W - 28, 8, "F"); }
      tx = 14;
      const vals = [row.year, row.revenue, row.cogs, row.grossProfit, row.ebitda, row.cumulativeInvestment];
      const tcols = [[...BRAND.text], [...BRAND.success], [...BRAND.danger], [96, 184, 255], [245, 185, 60], [167, 139, 250]];
      vals.forEach((v, i) => {
        color(...tcols[i]); font(8, i === 0 ? "bold" : "normal");
        doc.text(String(v || "—"), tx + 2, ty + 1);
        tx += colWidths[i];
      });
      ty += 8;
    });

    // Assumptions
    ty = Math.max(ty + 4, 130);
    color(...BRAND.muted); font(8, "bold"); doc.text("KEY ASSUMPTIONS", 14, ty);
    (inv.financials?.assumptions || []).forEach((a, i) => {
      color(...BRAND.text); font(7, "normal"); doc.text(`· ${a}`, 14, ty + 6 + i * 6, { maxWidth: W - 28 });
    });

    accentBar(); watermark(); pageNum(pageN++, total);

    // ── Slide 6: IP Strategy ────────────────────────────────────────────────
    bg();
    fill(...c); doc.rect(0, 0, W, 18, "F");
    color(255, 255, 255); font(13, "bold"); doc.text("IP STRATEGY & VALUATION", 14, 12);
    color(...BRAND.muted); font(8); doc.text(inv.name, W - 14, 12, { align: "right" });

    // Valuation box
    fill(10, 40, 20); doc.rect(14, 22, W - 28, 22, "F");
    color(...BRAND.success); font(18, "bold"); doc.text(inv.ipValuation || "—", 18, 35);
    color(...BRAND.muted); font(8); doc.text(`${inv.valuationMethod || ""} · ${inv.ipType || ""}`, 18, 40);

    // Rationale + Differentiation
    [[inv.valuationRationale, "VALUATION RATIONALE", BRAND.success],
     [inv.priorArtDiff, "PRIOR ART DIFFERENTIATION", c],
     [inv.filingStrategy, "FILING STRATEGY", BRAND.gold]].forEach(([text, label, lc], i) => {
      const by = 50 + i * 28;
      fill(...BRAND.surface); doc.rect(14, by, W - 28, 24, "F");
      fill(...lc); doc.rect(14, by, 3, 24, "F");
      color(...lc); font(7, "bold"); doc.text(label, 20, by + 7);
      color(...BRAND.text); font(8, "normal"); txt(text || "", 20, by + 13, W - 40);
    });

    // Jurisdictions
    color(...BRAND.text); font(8, "bold"); doc.text("TARGET JURISDICTIONS", 14, 140);
    (inv.jurisdictions || []).forEach((j, i) => {
      const jx = 14 + i * 68;
      fill(30, 20, 60); doc.roundedRect(jx, 144, 62, 8, 2, 2, "F");
      color(...BRAND.accentAlt); font(7); doc.text(j, jx + 3, 149);
    });

    accentBar(); watermark(); pageNum(pageN++, total);

    // ── Slide 7: Launch Plan ────────────────────────────────────────────────
    bg();
    fill(...c); doc.rect(0, 0, W, 18, "F");
    color(255, 255, 255); font(13, "bold"); doc.text("LAUNCH PLAN & MILESTONES", 14, 12);
    color(...BRAND.muted); font(8); doc.text(inv.name, W - 14, 12, { align: "right" });

    (inv.launchPlan || []).slice(0, 4).forEach((phase, i) => {
      const ly = 24 + i * 40;
      fill(...BRAND.surface); doc.rect(14, ly, W - 28, 36, "F");
      fill(...c); doc.rect(14, ly, 4, 36, "F");

      // Timeline badge
      fill(...c); doc.roundedRect(W - 80, ly + 4, 64, 7, 2, 2, "F");
      color(255, 255, 255); font(7, "bold"); doc.text(phase.timeline || "", W - 78, ly + 8.5);

      color(...c); font(9, "bold"); doc.text(phase.phase || `Phase ${i + 1}`, 22, ly + 9);
      color(...BRAND.text); font(7, "normal"); txt(phase.actions || "", 22, ly + 15, W - 100);
      if (phase.milestone) {
        color(...BRAND.success); font(7, "bold"); doc.text(`✓ ${phase.milestone}`, 22, ly + 29, { maxWidth: W - 50 });
      }
    });

    accentBar(); watermark(); pageNum(pageN++, total);

    // ── Slide 8: The Ask ────────────────────────────────────────────────────
    bg();
    fill(...c); doc.rect(0, 0, W, 18, "F");
    color(255, 255, 255); font(13, "bold"); doc.text("THE ASK", 14, 12);
    color(...BRAND.muted); font(8); doc.text(inv.name, W - 14, 12, { align: "right" });

    // Big ask
    fill(...BRAND.surface); doc.rect(14, 22, W - 28, 40, "F");
    fill(...c); doc.rect(14, 22, W - 28, 3, "F");
    color(...c); font(32, "bold"); doc.text(inv.fundingAsk || "—", 18, 48);
    color(...BRAND.muted); font(10); doc.text("funding ask  ·  " + (inv.equity || "—") + " equity", 18, 57);

    // Use of funds (derived from launch plan milestones)
    color(...BRAND.text); font(9, "bold"); doc.text("USE OF FUNDS", 14, 74);
    const fundUses = (inv.launchPlan || []).map(p => p.phase).filter(Boolean);
    fundUses.forEach((u, i) => {
      const ux = 14 + (i % 2) * 138, uy = 79 + Math.floor(i / 2) * 14;
      fill(...BRAND.surface); doc.rect(ux, uy, 132, 10, "F");
      fill(...c); doc.rect(ux, uy, 3, 10, "F");
      color(...BRAND.text); font(8); doc.text(u, ux + 6, uy + 6.5);
    });

    // Contact CTA
    fill(20, 20, 60); doc.rect(14, H - 40, W - 28, 24, "F");
    color(...BRAND.gold); font(10, "bold"); doc.text("READY TO DISCUSS?", 18, H - 29);
    color(...BRAND.muted); font(8, "normal");
    doc.text("Contact: Zenith Apex Research · This document is confidential and prepared exclusively for accredited investors.", 18, H - 22);
    color(...BRAND.text); font(7); doc.text(`IP Valuation: ${inv.ipValuation} · ${inv.valuationMethod}`, 18, H - 16);

    accentBar(3); watermark(); pageNum(pageN++, total);

    // Page break between inventions (not after last)
    if (idx < inventions.length - 1) doc.addPage();
  });

  const fname = `zenith-apex-vc-deck-${Date.now()}.pdf`;
  doc.save(fname);
}

// ── Slide preview (in-browser) ────────────────────────────────────────────────
function SlidePreview({ inv, slideIndex }) {
  const slide = SLIDE_TYPES[slideIndex];
  const c = ["#508cff", "#8250ff", "#34d399", "#f5b93c", "#f87171", "#06b6d4"][0];

  const sections = {
    cover: (
      <div className="h-full flex flex-col justify-between p-6 bg-gradient-to-br from-gray-900 to-gray-950">
        <div>
          <div className="w-1 h-full absolute left-0 top-0 bg-gradient-to-b from-blue-500 to-purple-600" />
          <span className="text-xs font-bold tracking-widest text-blue-400">ZENITH APEX RESEARCH</span>
          <h2 className="text-2xl font-black text-white mt-2 leading-tight">{inv.name}</h2>
          <p className="text-gray-400 text-xs mt-1 italic">"{inv.tagline}"</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {[inv.category, inv.stage, `IP: ${inv.ipValuation}`].filter(Boolean).map((b, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-800 text-blue-300">{b}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[["Ask", inv.fundingAsk], ["Equity", inv.equity], ["5yr Rev", inv.fiveYrRevenue], ["IP Value", inv.ipValuation]].map(([l, v]) => (
            <div key={l} className="bg-gray-800/60 rounded-lg p-2 text-center">
              <div className="text-blue-400 font-black text-sm">{v || "—"}</div>
              <div className="text-gray-500 text-xs">{l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    problem: (
      <div className="h-full grid grid-cols-2 gap-0">
        <div className="bg-red-950/40 border-r border-gray-800 p-4">
          <p className="text-red-400 font-bold text-xs uppercase mb-2">The Problem</p>
          <p className="text-gray-300 text-xs leading-relaxed">{inv.problem}</p>
        </div>
        <div className="bg-green-950/40 p-4">
          <p className="text-green-400 font-bold text-xs uppercase mb-2">The Solution</p>
          <p className="text-gray-300 text-xs leading-relaxed">{inv.solution}</p>
        </div>
      </div>
    ),
    market: (
      <div className="h-full p-4 space-y-3">
        <div className="bg-gray-800/60 rounded-xl p-3">
          <p className="text-blue-400 font-black text-sm">{inv.marketSize}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(inv.channels || []).slice(0, 6).map((c, i) => (
            <div key={i} className="bg-gray-800/40 rounded-lg px-2 py-1.5 text-xs text-gray-300 border-l-2 border-blue-600">{c}</div>
          ))}
        </div>
      </div>
    ),
    tech: (
      <div className="h-full p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {(inv.specs || []).slice(0, 4).map((s, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-2 border-l-2 border-blue-500">
              <p className="text-blue-400 text-xs font-bold">{s.label}</p>
              <p className="text-gray-300 text-xs">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {(inv.principles || []).map((p, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300">{p}</span>
          ))}
        </div>
      </div>
    ),
    financials: (
      <div className="h-full p-4 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {[["Pre-Seed", inv.preSeed, "text-purple-400"], ["Series A", inv.seriesA, "text-blue-400"], ["5-yr Rev", inv.fiveYrRevenue, "text-green-400"]].map(([l, v, cls]) => (
            <div key={l} className="bg-gray-800/60 rounded-lg p-2 text-center">
              <div className={`font-black text-sm ${cls}`}>{v || "—"}</div>
              <div className="text-gray-500 text-xs">{l}</div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-700">
              {["Year","Revenue","COGS","Gross","EBITDA"].map(h => <th key={h} className="text-left py-1 pr-2 text-gray-500">{h}</th>)}
            </tr></thead>
            <tbody>
              {(inv.financials?.projections || []).slice(0, 4).map((r, i) => (
                <tr key={i} className="border-b border-gray-800/50">
                  <td className="py-1 pr-2 text-gray-300 font-bold">{r.year}</td>
                  <td className="py-1 pr-2 text-green-400 font-mono">{r.revenue}</td>
                  <td className="py-1 pr-2 text-red-400 font-mono">{r.cogs}</td>
                  <td className="py-1 pr-2 text-blue-400 font-mono">{r.grossProfit}</td>
                  <td className="py-1 pr-2 text-yellow-400 font-mono">{r.ebitda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
    ip: (
      <div className="h-full p-4 space-y-2">
        <div className="bg-green-950/40 border border-green-900/50 rounded-xl p-3">
          <p className="text-green-400 font-black text-lg">{inv.ipValuation}</p>
          <p className="text-gray-400 text-xs">{inv.valuationMethod} · {inv.ipType}</p>
        </div>
        {[["Rationale", inv.valuationRationale], ["Differentiation", inv.priorArtDiff], ["Filing", inv.filingStrategy]].map(([l, v]) => (
          <div key={l} className="bg-gray-800/40 rounded-lg p-2 border-l-2 border-blue-600">
            <p className="text-blue-400 text-xs font-bold">{l}</p>
            <p className="text-gray-300 text-xs leading-snug">{v}</p>
          </div>
        ))}
      </div>
    ),
    launch: (
      <div className="h-full p-4 space-y-2">
        {(inv.launchPlan || []).map((p, i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-2 border-l-2 border-blue-500 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs">{p.phase}</p>
              <p className="text-gray-400 text-xs leading-snug">{p.actions}</p>
              {p.milestone && <p className="text-green-400 text-xs mt-0.5">✓ {p.milestone}</p>}
            </div>
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300 flex-shrink-0">{p.timeline}</span>
          </div>
        ))}
      </div>
    ),
    ask: (
      <div className="h-full p-4 space-y-3">
        <div className="bg-gray-800/60 rounded-2xl p-4 text-center">
          <p className="text-blue-400 font-black text-3xl">{inv.fundingAsk}</p>
          <p className="text-gray-400 text-sm mt-1">{inv.equity} equity offered</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(inv.launchPlan || []).map((p, i) => (
            <div key={i} className="bg-gray-800/40 rounded-lg px-3 py-2 text-xs text-gray-300 border-l-2 border-blue-500">{p.phase}</div>
          ))}
        </div>
        <p className="text-gray-600 text-xs text-center">Confidential · Zenith Apex Research · For Accredited Investors Only</p>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-gray-950 rounded-xl overflow-hidden border border-gray-700 relative">
      <div className="absolute top-0 left-0 right-0 bg-gray-900/90 px-3 py-1.5 flex items-center justify-between z-10 border-b border-gray-800">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{slide.label}</span>
        <span className="text-xs text-gray-600">{inv.name}</span>
      </div>
      <div className="absolute inset-0 pt-8">
        {sections[slide.key]}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PitchDeckExporter({ inventions, onClose }) {
  const [currentInv, setCurrentInv] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exporting, setExporting] = useState(false);

  const inv = inventions[currentInv];
  const totalSlides = SLIDE_TYPES.length;

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      buildPDF(inventions);
      setExporting(false);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-gray-950 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ height: "90vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-gray-400 text-xs font-mono uppercase tracking-widest">VC Pitch Deck</span>
            <span className="text-white font-black text-sm">{inventions.length} invention{inventions.length > 1 ? "s" : ""} · {inventions.length * 8 + 1} slides</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-black text-sm disabled:opacity-60 transition-all shadow-[0_0_20px_rgba(80,140,255,0.3)]"
            >
              {exporting ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
              {exporting ? "Building PDF…" : "Export Full Deck as PDF"}
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: invention + slide nav */}
          <div className="w-52 flex-shrink-0 border-r border-gray-800 flex flex-col overflow-y-auto bg-gray-950">
            {/* Inventions */}
            <div className="p-3 border-b border-gray-800">
              <p className="text-gray-600 text-xs uppercase tracking-widest font-bold mb-2">Inventions</p>
              {inventions.map((inv, i) => (
                <button key={i} onClick={() => { setCurrentInv(i); setCurrentSlide(0); }}
                  className={`w-full text-left px-2 py-2 rounded-lg text-xs mb-1 transition-colors ${currentInv === i ? "bg-blue-950/60 border border-blue-800 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-gray-900"}`}>
                  <span className="font-bold text-blue-400 mr-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate">{inv.name}</span>
                </button>
              ))}
            </div>
            {/* Slides */}
            <div className="p-3 flex-1">
              <p className="text-gray-600 text-xs uppercase tracking-widest font-bold mb-2">Slides</p>
              {SLIDE_TYPES.map((s, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs mb-0.5 transition-colors ${currentSlide === i ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-300"}`}>
                  <span className="text-gray-600 font-mono mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center: slide preview */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900/40 overflow-hidden">
            <div className="w-full max-w-2xl" style={{ aspectRatio: "16/9" }}>
              <SlidePreview inv={inv} slideIndex={currentSlide} />
            </div>

            {/* Slide navigation */}
            <div className="flex items-center gap-4 mt-4">
              <button onClick={() => setCurrentSlide(s => Math.max(0, s - 1))} disabled={currentSlide === 0}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-30 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-gray-500 text-xs font-mono">{currentSlide + 1} / {totalSlides}</span>
              <button onClick={() => setCurrentSlide(s => Math.min(totalSlides - 1, s + 1))} disabled={currentSlide === totalSlides - 1}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-30 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: slide info */}
          <div className="w-52 flex-shrink-0 border-l border-gray-800 p-4 overflow-y-auto bg-gray-950 space-y-4">
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-widest font-bold mb-2">Current Slide</p>
              <p className="text-white font-bold text-sm">{SLIDE_TYPES[currentSlide].label}</p>
              <p className="text-gray-500 text-xs mt-1">{inv.name}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-2">
              <p className="text-gray-500 text-xs font-bold uppercase">Deck Summary</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-gray-600">Inventions</span><span className="text-white font-bold">{inventions.length}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-600">Slides/Inv</span><span className="text-white font-bold">8</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-600">Total Slides</span><span className="text-blue-400 font-bold">{inventions.length * 8 + 1}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-600">Format</span><span className="text-gray-300">A4 Landscape</span></div>
              </div>
            </div>
            <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-3">
              <p className="text-blue-400 text-xs font-bold mb-1">Export includes:</p>
              <ul className="space-y-0.5 text-xs text-gray-500">
                {["Master cover page", "Per-invention cover", "Problem & Solution", "Market analysis", "Tech specs", "5-yr financials", "IP strategy", "Launch plan", "The Ask"].map(item => (
                  <li key={item} className="flex items-center gap-1"><span className="text-green-500">✓</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}