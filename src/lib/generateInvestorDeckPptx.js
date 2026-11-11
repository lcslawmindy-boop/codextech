import pptxgen from "pptxgenjs";
import { PORTFOLIO, TOP10 } from "./investorDeckData";

const DARK = "0B111E";
const CYAN = "06B6D4";
const SLATE = "65758B";
const WHITE = "FFFFFF";
const AMBER = "FBBF24";
const GREEN = "10B981";

const money = (n) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`);

export default async function generateInvestorDeckPptx() {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";
  pptx.author = "Aethon Apex IP Holdings";
  pptx.subject = "Portfolio Valuation & Top-10 Investor Deck";

  const addHeader = (slide, title) => {
    slide.addShape("rect", { x: 0, y: 0, w: "100%", h: 0.85, fill: { color: DARK } });
    slide.addText(title, { x: 0.5, y: 0.16, w: 11, h: 0.5, fontFace: "Arial", fontSize: 21, bold: true, color: WHITE });
    slide.addText("Aethon Apex IP Holdings", { x: 10.8, y: 0.26, w: 2.4, h: 0.4, fontFace: "Arial", fontSize: 10, color: CYAN, align: "right" });
  };

  // Cover
  const cover = pptx.addSlide();
  cover.background = { color: DARK };
  cover.addText("Aethon Apex IP Holdings", { x: 0.8, y: 2.0, w: 11.7, h: 0.5, fontFace: "Arial", fontSize: 16, color: CYAN, bold: true });
  cover.addText("Portfolio Valuation\n& Top-10 IP Asset Investor Deck", { x: 0.8, y: 2.6, w: 11.7, h: 1.5, fontFace: "Arial", fontSize: 38, bold: true, color: WHITE, lineSpacing: 46 });
  cover.addText(`${PORTFOLIO.totalAssets} assets  |  ${PORTFOLIO.provisionalFiled} provisionally authorized  |  Top-10 advisory range ${money(PORTFOLIO.top10Range.low)}–${money(PORTFOLIO.top10Range.high)}`, { x: 0.8, y: 4.7, w: 11.7, h: 0.5, fontFace: "Arial", fontSize: 13, color: SLATE });
  cover.addText("ADVISORY ONLY — cost approach, not an independent or market valuation. No patent is filed at the USPTO.", { x: 0.8, y: 6.5, w: 11.7, h: 0.4, fontFace: "Arial", fontSize: 10, color: AMBER, italic: true });

  // Portfolio overview
  const ov = pptx.addSlide();
  ov.background = { color: "F6F7F9" };
  addHeader(ov, "Portfolio at a Glance");
  const oRows = [
    ["Total IP assets", String(PORTFOLIO.totalAssets)],
    ["Provisionally authorized (not yet filed)", String(PORTFOLIO.provisionalFiled)],
    ["Not filed", String(PORTFOLIO.notFiled)],
    ["Top-10 advisory low", money(PORTFOLIO.top10Range.low)],
    ["Top-10 advisory high", money(PORTFOLIO.top10Range.high)],
    ["Valuation basis", "Cost approach (claims × $25k floor)"],
  ];
  ov.addTable(oRows.map(r => [{ text: r[0], options: { bold: true, color: SLATE, fontSize: 12 } }, { text: r[1], options: { color: DARK, fontSize: 12 } }]),
    { x: 0.6, y: 1.1, w: 12.1, colW: [5.5, 6.6], fontFace: "Arial", border: { type: "solid", color: "D1D4DC", pt: 1 } });
  ov.addText("By domain", { x: 0.6, y: 4.4, w: 12.1, h: 0.3, fontFace: "Arial", fontSize: 13, bold: true, color: CYAN });
  const dRows = PORTFOLIO.perDomain.map(d => [{ text: d.domain, options: { color: DARK, fontSize: 12 } }, { text: String(d.count), options: { color: d.color, fontSize: 12, bold: true } }]);
  ov.addTable(dRows, { x: 0.6, y: 4.8, w: 6, colW: [4.4, 1.6], fontFace: "Arial", border: { type: "solid", color: "D1D4DC", pt: 1 } });
  ov.addNotes("Be explicit: one hundred forty-nine total assets, twenty provisionally authorized, none actually filed. The top ten carry a one-point-five to four-point-seven million dollar advisory range under the cost approach. This is a floor, not a market valuation. By domain: fifty-eight humanitarian, seventy-five defense, sixteen deep-space.");

  // Top-10 breakdown table
  const t10 = pptx.addSlide();
  t10.background = { color: "F6F7F9" };
  addHeader(t10, "Top-10 IP Assets by Advisory Valuation");
  const rows = [["#", "Asset", "Domain", "Low", "High", "Filing"]];
  TOP10.forEach(a => rows.push([
    String(a.rank), a.name, a.domain.split(" / ")[0], money(a.vLow), money(a.vHigh), a.filing.replace("_", " "),
  ]));
  t10.addTable(
    rows.map((r, i) => r.map(c => ({ text: c, options: { color: i === 0 ? WHITE : DARK, fill: { color: i === 0 ? DARK : "FFFFFF" }, bold: i === 0, fontSize: 10, align: ["#"].includes(r[0]) ? "center" : "left" } }))),
    { x: 0.4, y: 1.05, w: 12.5, colW: [0.5, 5.8, 2.0, 1.4, 1.4, 1.4], fontFace: "Arial", border: { type: "solid", color: "D1D4DC", pt: 1 }, rowH: 0.5 }
  );
  t10.addText(`Aggregate (top 10): ${money(PORTFOLIO.top10Range.low)} – ${money(PORTFOLIO.top10Range.high)}`, { x: 0.4, y: 6.8, w: 12.5, h: 0.4, fontFace: "Arial", fontSize: 13, bold: true, color: CYAN });
  t10.addNotes("The top ten are all humanitarian-domain assets — therapeutic pods, a diagnostic microscope, agricultural and environmental devices. The aggregate advisory range is one-point-five-five to four-point-seven million. Note every one of these is not filed — the provisional filings are the immediate next action. Two assets (SVRRD the river device, and MYTSA the agricultural array) are the strongest commercial candidates because they are non-medical, low-regulation, and have clear grant pathways.");

  // One slide per top-10 asset (rank + valuation + claims summary)
  TOP10.forEach(a => {
    const s = pptx.addSlide();
    s.background = { color: "F6F7F9" };
    addHeader(s, `#${a.rank} — ${a.name}`);
    s.addText([
      { text: `Advisory valuation: ${money(a.vLow)} – ${money(a.vHigh)}\n`, options: { fontSize: 16, bold: true, color: CYAN, breakLine: true } },
      { text: `Domain: ${a.domain}   |   Filing: ${a.filing.replace(/_/g, " ")}\n`, options: { fontSize: 11, color: DARK, breakLine: true } },
      { text: `Market: ${a.market}\n`, options: { fontSize: 11, color: DARK, breakLine: true } },
      { text: `Viability score: ${a.viability.score}/100   |   ${a.viability.trl}`, options: { fontSize: 11, bold: true, color: a.viability.score >= 55 ? GREEN : a.viability.score >= 35 ? AMBER : "EF4444" } },
    ], { x: 0.5, y: 1.0, w: 12.3, h: 1.4, fontFace: "Arial", valign: "top" });
    s.addText("Draft independent claim", { x: 0.5, y: 2.5, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 11, bold: true, color: CYAN });
    s.addText(a.claims.independent[0], { x: 0.5, y: 2.8, w: 12.3, h: 1.8, fontFace: "Arial", fontSize: 10, color: DARK });
    s.addText("Dependent claims", { x: 0.5, y: 4.7, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 11, bold: true, color: CYAN });
    s.addText(a.claims.dependent.join("\n"), { x: 0.5, y: 5.0, w: 12.3, h: 1.6, fontFace: "Arial", fontSize: 9, color: SLATE });
    s.addNotes(`${a.name}. Advisory range ${money(a.vLow)} to ${money(a.vHigh)} on a cost approach. Viability score ${a.viability.score} of 100. ${a.viability.risk} Speak to the market: ${a.market}. The independent claim on screen is a draft scaffold — it must be finalized with a registered patent attorney before filing. ${a.filing === "not_fled" ? "This asset is NOT filed at the USPTO." : ""}`);
  });

  // Closing / ask
  const end = pptx.addSlide();
  end.background = { color: DARK };
  end.addText("The Ask", { x: 0.8, y: 1.0, w: 11.7, h: 0.7, fontFace: "Arial", fontSize: 32, bold: true, color: WHITE });
  end.addText("Two-track equity raise. Non-ITAR clean portfolio (this top 10) seeks $500k–$2M via SAFE/convertible note to fund provisional filings, an independent IP valuation, and humanitarian/field-validation pilots. Use of funds: 40% patent filings, 20% independent valuation, 25% NSF/USDA/NIH grant match, 15% field pilots.", { x: 0.8, y: 1.9, w: 11.7, h: 1.8, fontFace: "Arial", fontSize: 14, color: WHITE });
  end.addText("Strongest leads: SVRRD (river restoration, NSF) and MYTSA (agriculture, USDA) — both non-medical, low-regulation, fundable now.", { x: 0.8, y: 3.8, w: 11.7, h: 0.8, fontFace: "Arial", fontSize: 13, color: CYAN, bold: true });
  end.addText("ADVISORY ONLY. No patent is filed. Claims require counsel review. Not an offer of securities.", { x: 0.8, y: 6.4, w: 11.7, h: 0.6, fontFace: "Arial", fontSize: 11, color: AMBER, italic: true });

  await pptx.writeFile({ fileName: "Aethon-Apex-Portfolio-Top10-Investor-Deck.pptx" });
}