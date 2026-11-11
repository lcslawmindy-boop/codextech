import pptxgen from "pptxgenjs";
import { TOP10, PORTFOLIO } from "./investorDeckData";

const DARK = "0B111E";
const CYAN = "06B6D4";
const GREEN = "10B981";
const SLATE = "65758B";
const WHITE = "FFFFFF";
const AMBER = "FBBF24";

// Davidson = non-ITAR, fundable-now humanitarian track. Leads: SVRRD (66) + MYTSA (58).
const money = (n) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`);
const scoreColor = (s) => (s >= 55 ? GREEN : s >= 35 ? AMBER : "EF4444");

// Fundable-now, non-ITAR, defensible humanitarian assets — sorted by viability, SVRRD + MYTSA first.
const FUNDABLE = [...TOP10].sort((a, b) => b.viability.score - a.viability.score);

export default async function generateDavidsonPitchDeck() {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";
  pptx.author = "Aethon Apex IP Holdings";
  pptx.subject = "Track B — Non-ITAR Humanitarian Portfolio (Fundable Now)";

  const head = (s, t) => {
    s.addShape("rect", { x: 0, y: 0, w: "100%", h: 0.85, fill: { color: DARK } });
    s.addText(t, { x: 0.5, y: 0.16, w: 11, h: 0.5, fontFace: "Arial", fontSize: 21, bold: true, color: WHITE });
    s.addText("CONFIDENTIAL · NDA REQUIRED · ADVISORY ONLY", { x: 9, y: 0.26, w: 4, h: 0.4, fontFace: "Arial", fontSize: 9, color: AMBER, align: "right", bold: true });
  };

  // Cover
  const c = pptx.addSlide();
  c.background = { color: DARK };
  c.addText("PREPARED FOR: DAVIDSON", { x: 0.8, y: 1.5, w: 11.7, h: 0.5, fontFace: "Arial", fontSize: 16, color: GREEN, bold: true });
  c.addText("Fundable-Now\nNon-ITAR Humanitarian Portfolio", { x: 0.8, y: 2.15, w: 11.7, h: 1.7, fontFace: "Arial", fontSize: 38, bold: true, color: WHITE, lineSpacing: 46 });
  c.addText("Aethon Apex IP Holdings  |  Two strongest commercial leads ready for grant + market today", { x: 0.8, y: 4.3, w: 11.7, h: 0.5, fontFace: "Arial", fontSize: 13, color: SLATE });
  c.addText("Leads: Schauberger-Vortex River Device (SVRRD, 66/100) + MorphoYield Agri Array (MYTSA, 58/100). Both non-medical, low-regulation, and fundable via NSF and USDA NIFA right now. No ITAR gating — this track can close immediately.", { x: 0.8, y: 4.9, w: 11.7, h: 0.7, fontFace: "Arial", fontSize: 11, color: CYAN });
  c.addText("Advisory only. No patent is filed at the USPTO. Valuations are a cost-approach floor, not a market valuation. Not an offer of securities. Disclosure under NDA only.", { x: 0.8, y: 6.2, w: 11.7, h: 0.8, fontFace: "Arial", fontSize: 10, color: AMBER, italic: true });
  c.addNotes("Open with the fundable-now thesis. Davidson gets the non-ITAR track — two commercial leads, SVRRD and MYTSA, that are non-medical, low-regulation, and have live grant pathways at NSF and USDA NIFA. No export control means this track can close immediately, unlike the ITAR defense track which waits on DDTC registration. Be honest: nothing is filed at the USPTO, and the dollar figures are a floor, not a market valuation.");

  // The thesis
  const th = pptx.addSlide();
  th.background = { color: "F6F7F9" };
  head(th, "Why These Two, Why Now");
  th.addText([
    { text: "SVRRD — Schauberger-Vortex River Restoration Device  (66/100)\n", options: { fontSize: 15, color: DARK, bold: true, breakLine: true } },
    { text: "Passive, no-power river device that induces vortex flow to oxygenate, cool, and restore degraded waterways. Hydrodynamics is measurable, physically grounded, and patentable. Strongest commercial candidate in the portfolio. Fundable via NSF CBET today.\n\n", options: { fontSize: 12, color: SLATE, breakLine: true } },
    { text: "MYTSA — MorphoYield TRZ-Agri Scalar Array  (58/100)\n", options: { fontSize: 15, color: DARK, bold: true, breakLine: true } },
    { text: "Perimeter EM-field-emission array targeting crop yield improvement without chemicals. Apparatus is patentable; the 20–40% yield claim is the hypothesis the grant tests. Fundable via USDA NIFA AFRI today.\n\n", options: { fontSize: 12, color: SLATE, breakLine: true } },
    { text: "Both are non-medical → no FDA. Both are non-weapon → no ITAR. Both have a clear, single-agency grant pathway already drafted and submission-ready.", options: { fontSize: 12, color: GREEN, bold: true } },
  ], { x: 0.6, y: 1.15, w: 12.1, h: 5.6, fontFace: "Arial", valign: "top" });
  th.addNotes("The thesis is simple: of the top ten humanitarian assets, only two are non-medical AND non-weapon AND have a single clear grant home. SVRRD goes to NSF CBET — environmental engineering, water science. MYTSA goes to USDA NIFA AFRI — agricultural productivity. Both agencies fund exactly this kind of hardware-with-field-validation work. The grants are drafted and ready to submit. The equity funds the filings and the cost-share while the grants are in review.");

  // Portfolio snapshot
  const ps = pptx.addSlide();
  ps.background = { color: "F6F7F9" };
  head(ps, "Portfolio Snapshot (live, Production database)");
  ps.addText([
    { text: `Total IP assets: ${PORTFOLIO.totalAssets}   |   Provisionally authorized: ${PORTFOLIO.provisionalFiled}   |   Filed at USPTO: 0\n`, options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: `Non-ITAR humanitarian portfolio: ${PORTFOLIO.perDomain[0].count} assets   |   Top-10 advisory range: ${money(PORTFOLIO.top10Range.low)}–${money(PORTFOLIO.top10Range.high)}\n`, options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "Basis: cost approach (claim count × $25k floor). Advisory only — not an independent or market valuation.\n\n", options: { fontSize: 10, color: SLATE, italic: true, breakLine: true } },
    { text: "This raise funds the non-ITAR slice: provisional filings, an independent IP valuation, and the two field-validation pilots (SVRRD + MYTSA) that the grants require as cost-share.\n", options: { fontSize: 12, color: DARK, breakLine: true } },
  ], { x: 0.6, y: 1.1, w: 12.1, h: 3, fontFace: "Arial", valign: "top" });
  ps.addText("BE HONEST", { x: 0.6, y: 4.4, w: 12.1, h: 0.35, fontFace: "Arial", fontSize: 11, bold: true, color: AMBER });
  ps.addText("Zero filed patents. Zero revenue. No independent valuation. The figures shown are an internal cost-approach floor, not a market price. The provisional filings are the immediate next action and will establish priority dates.", { x: 0.6, y: 4.8, w: 12.1, h: 1.2, fontFace: "Arial", fontSize: 11, color: SLATE, italic: true });
  ps.addNotes("The honesty slide. One hundred forty-nine assets total, twenty provisionally authorized internally, zero filed at the USPTO, zero revenue, no independent valuation. Investors respect a founder who says this plainly. The raise funds the filings and the valuation — we are not asking Davidson to pay for burn, we are asking Davidson to fund the moment the IP becomes defensible.");

  // Scorecard
  const sc = pptx.addSlide();
  sc.background = { color: "F6F7F9" };
  head(sc, "Top-10 Viability Scorecard");
  const rows = [["#", "Asset", "Domain", "Score", "Advisory val."]];
  FUNDABLE.forEach((a) => rows.push([`#${a.rank}`, a.name, a.domain.split(" / ")[0], `${a.viability.score}/100`, `${money(a.vLow)}–${money(a.vHigh)}`]));
  sc.addTable(
    rows.map((r, i) => r.map((cell, j) => ({
      text: cell,
      options: {
        color: i === 0 ? WHITE : (j === 3 ? scoreColor(FUNDABLE[i - 1].viability.score) : DARK),
        fill: { color: i === 0 ? DARK : "FFFFFF" },
        bold: i === 0 || j === 3,
        fontSize: 9.5,
      },
    }))),
    { x: 0.3, y: 1.0, w: 12.7, colW: [0.6, 7.0, 2.3, 1.2, 1.6], fontFace: "Arial", border: { type: "solid", color: "D1D4DC", pt: 1 }, rowH: 0.46 }
  );
  sc.addText("SVRRD (66) and MYTSA (58) lead — both above the 55 fundable threshold and both non-medical/non-weapon. The therapeutic pods (UBSCHLP 62, WHACT 48) are higher-concept but carry FDA and scientific-acceptance risk and route to NCCIH, not to market.", { x: 0.6, y: 6.4, w: 12.1, h: 0.7, fontFace: "Arial", fontSize: 10, color: SLATE, italic: true });
  sc.addNotes("Walk the table top to bottom. SVRRD at sixty-six is the clear lead. MYTSA at fifty-eight is the strong second. Everything above fifty-five is fundable-now; everything below is deferred to trade-secret or routed to the therapeutic research track. The score is a weighted heuristic — filing status, valuation, technical plausibility, regulatory clarity, and commercial demand. Be transparent that it is advisory, not certified.");

  // Grant-first
  const gf = pptx.addSlide();
  gf.background = { color: "F6F7F9" };
  head(gf, "Non-Dilutive Grants First");
  gf.addText([
    { text: "Before equity is spent, we submit two submission-ready grants:\n\n", options: { fontSize: 13, color: DARK, bold: true, breakLine: true } },
    { text: "NSF CBET (Environmental Engineering / Water Science) — SVRRD passive vortex river-restoration field validation. ~$300k.\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "USDA NIFA AFRI (Foundational Program) — MYTSA replicated split-field yield trials, two crops, two seasons. ~$500k.\n\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "Both templates are drafted and submission-ready in the app.\n", options: { fontSize: 12, color: GREEN, bold: true, breakLine: true } },
    { text: "Grant money does not cost equity. A Phase I award is the strongest external validation a non-ITAR investor can see. The equity funds the provisional filings and the field-trial cost-share while the grants are in review — so the work moves whether the round closes fast or slow.", options: { fontSize: 12, color: DARK } },
  ], { x: 0.6, y: 1.15, w: 12.1, h: 5, fontFace: "Arial", valign: "top" });
  gf.addNotes("Grants first. NSF for SVRRD, USDA NIFA for MYTSA — both drafted and ready to submit from the app. Non-dilutive. An award de-risks Davidson's investment and validates the technology with the one agency that owns that mission. The equity covers the filings and the cost-share the grants require; the grants cover the validation the market requires. Two runways, same goal.");

  // Use of funds
  const uf = pptx.addSlide();
  uf.background = { color: "F6F7F9" };
  head(uf, "Use of Funds — $500k–$2M (Track B)");
  uf.addText([
    { text: "40% — Provisional + non-provisional filings (SVRRD, MYTSA first; then NSBDM, UBSCHLP)\n", options: { fontSize: 13, color: DARK, breakLine: true } },
    { text: "25% — Field-validation cost-share (SVRRD stream reach + MYTSA split-field trials)\n", options: { fontSize: 13, color: DARK, breakLine: true } },
    { text: "20% — Independent IP valuation + due-diligence package for the non-ITAR slice\n", options: { fontSize: 13, color: DARK, breakLine: true } },
    { text: "15% — First benchtop/field prototype builds (vortex vanes + EM array towers)\n", options: { fontSize: 13, color: DARK } },
  ], { x: 0.6, y: 1.2, w: 12.1, h: 3.8, fontFace: "Arial", valign: "top" });
  uf.addText("Forty percent goes straight to filings — the highest-leverage spend, because an unfiled invention has no defensible value. Twenty-five percent funds the field trials the grants require as cost-share — the work that turns an apparatus claim into a validated result. No DDTC gating on this track; it can close immediately.", { x: 0.6, y: 5.5, w: 12.1, h: 1.2, fontFace: "Arial", fontSize: 11, color: SLATE });
  uf.addNotes("Forty percent to filings — SVRRD and MYTSA provisionals first, then NSBDM and UBSCHLP. Twenty-five percent to the field-validation cost-share that NSF and USDA grants require. Twenty to an independent valuation — we will not ask Davidson to rely on our internal floor number. Fifteen to the first prototype builds. No DDTC wait on this track, so we can close immediately after the first provisionals are on file.");

  // Claim appendix — SVRRD and MYTSA detail
  [FUNDABLE[0], FUNDABLE.find((a) => a.name.includes("MYTSA"))].filter(Boolean).forEach((a) => {
    const s = pptx.addSlide();
    s.background = { color: "F6F7F9" };
    head(s, `Draft Provisional Claim — ${a.name.split("(")[0].trim()}`);
    s.addText(`Viability ${a.viability.score}/100  |  ${a.viability.trl}  |  Advisory val. ${money(a.vLow)}–${money(a.vHigh)}`, { x: 0.5, y: 0.95, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 11, bold: true, color: scoreColor(a.viability.score) });
    s.addText(a.desc, { x: 0.5, y: 1.35, w: 12.3, h: 0.9, fontFace: "Arial", fontSize: 10, color: SLATE });
    s.addText("INDEPENDENT CLAIM (draft — counsel review required)", { x: 0.5, y: 2.35, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: CYAN });
    s.addText(a.claims.independent[0], { x: 0.5, y: 2.7, w: 12.3, h: 1.5, fontFace: "Arial", fontSize: 10, color: DARK });
    s.addText("DEPENDENT CLAIMS (draft)", { x: 0.5, y: 4.3, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: CYAN });
    s.addText(a.claims.dependent.join("\n"), { x: 0.5, y: 4.65, w: 12.3, h: 1.6, fontFace: "Arial", fontSize: 9, color: SLATE });
    s.addText(`Counsel note / risk: ${a.viability.risk}`, { x: 0.5, y: 6.4, w: 12.3, h: 0.7, fontFace: "Arial", fontSize: 9, color: AMBER, italic: true });
    s.addNotes(`${a.name}. The claim on screen is a draft scaffold — it must be finalized with a registered patent attorney before any USPTO submission. Counsel note: ${a.viability.risk} For the grant, drop the contested framing (implosion / structured water for SVRRD; agnihotra / vortex-water for MYTSA) and present the defensible physical core: passive vortex hydrodynamics, and the EM-array apparatus.`);
  });

  // The ask
  const ask = pptx.addSlide();
  ask.background = { color: DARK };
  ask.addText("The Ask", { x: 0.8, y: 0.9, w: 11.7, h: 0.7, fontFace: "Arial", fontSize: 32, bold: true, color: WHITE });
  ask.addText([
    { text: "Track B — Non-ITAR Humanitarian: $500,000–$2,000,000\n", options: { fontSize: 18, color: GREEN, bold: true, breakLine: true } },
    { text: "Structure: SAFE or convertible note. Founder retains majority.\n", options: { fontSize: 13, color: WHITE, breakLine: true } },
    { text: "All IP assigned to a single US holding entity before any check clears.\n", options: { fontSize: 13, color: WHITE, breakLine: true } },
    { text: "No ITAR gating — this track can close immediately after the first provisionals.\n", options: { fontSize: 13, color: WHITE, breakLine: true } },
    { text: "Grants-first: NSF (SVRRD) and USDA NIFA (MYTSA) submit before the round closes.\n", options: { fontSize: 13, color: WHITE, breakLine: true } },
    { text: "Close target: 21–45 days post provisional filings.", options: { fontSize: 13, color: WHITE } },
  ], { x: 0.8, y: 1.8, w: 11.7, h: 3.2, fontFace: "Arial", valign: "top" });
  ask.addText("Advisory only. No patent is filed. Claims require registered-counsel review. Not an offer of securities. Disclosure under NDA only.", { x: 0.8, y: 6.0, w: 11.7, h: 0.8, fontFace: "Arial", fontSize: 11, color: AMBER, italic: true });
  ask.addNotes("Close with the ask. Five hundred thousand to two million, SAFE or convertible note, founder retains majority, all IP into a single holding entity before any money moves. No ITAR gating means we close in weeks, not months. Grants submit in parallel. The floor is the filings and the cost-share; the ceiling is the full field-validation campaign. Confirm Davidson's interest on NDA before scheduling the technical deep-dive on SVRRD and MYTSA.");

  await pptx.writeFile({ fileName: "Aethon-Apex-Davidson-NonITAR-Pitch.pptx" });
}