import pptxgen from "pptxgenjs";
import { DECK_SLIDES, EQUITY_ASK, CLAIMS, FILING_SEQUENCE, GRANT_PROPOSALS } from "./filingPlaybook";

const DARK = "0B111E";
const CYAN = "06B6D4";
const SLATE = "65758B";
const WHITE = "FFFFFF";
const AMBER = "FBBF24";

export default async function generateFilingPlaybookPptx() {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";
  pptx.author = "Aethon Apex IP Holdings";
  pptx.subject = "Two-Track IP Equity Raise & Filing Playbook";

  const addHeader = (slide, title) => {
    slide.addShape("rect", { x: 0, y: 0, w: "100%", h: 0.9, fill: { color: DARK } });
    slide.addText(title, { x: 0.5, y: 0.18, w: 11, h: 0.55, fontFace: "Arial", fontSize: 22, bold: true, color: WHITE });
    slide.addText("Aethon Apex / ZDS33", { x: 11.2, y: 0.28, w: 2, h: 0.4, fontFace: "Arial", fontSize: 11, color: CYAN, align: "right" });
  };

  // Cover
  const cover = pptx.addSlide();
  cover.background = { color: DARK };
  cover.addText("Aethon Apex / ZDS33", { x: 0.8, y: 2.2, w: 11.7, h: 0.6, fontFace: "Arial", fontSize: 16, color: CYAN, bold: true });
  cover.addText("Two-Track IP Equity Raise\n& Step-by-Step Filing Playbook", { x: 0.8, y: 2.9, w: 11.7, h: 1.6, fontFace: "Arial", fontSize: 40, bold: true, color: WHITE, lineSpacing: 48 });
  cover.addText("20 lead inventions  |  ITAR defense + Non-ITAR clean portfolios  |  Provisional filings, grant proposals, investor deck", { x: 0.8, y: 5.0, w: 11.7, h: 0.5, fontFace: "Arial", fontSize: 13, color: SLATE });
  cover.addText("DRAFT — internal. No patent is filed at the USPTO. All claims require review by a registered patent attorney before filing.", { x: 0.8, y: 6.4, w: 11.7, h: 0.4, fontFace: "Arial", fontSize: 10, color: AMBER, italic: true });

  // Deck slides with speaker notes
  DECK_SLIDES.forEach((s, i) => {
    const slide = pptx.addSlide();
    slide.background = { color: "F6F7F9" };
    addHeader(slide, `${i + 1}. ${s.title}`);
    s.bullets.forEach((b, bi) => {
      slide.addText(`• ${b}`, { x: 0.6, y: 1.2 + bi * 0.7, w: 12, h: 0.6, fontFace: "Arial", fontSize: 16, color: DARK, bullet: false });
    });
    slide.addNotes(s.notes);
  });

  // Two-track summary slide
  const t = pptx.addSlide();
  t.background = { color: "F6F7F9" };
  addHeader(t, "Equity Raise — Two Tracks");
  t.addText(EQUITY_ASK.summary, { x: 0.6, y: 1.1, w: 12.1, h: 0.9, fontFace: "Arial", fontSize: 13, color: SLATE });
  t.addText([
    { text: "TRACK A — ITAR DEFENSE\n", options: { fontSize: 16, bold: true, color: AMBER, breakLine: true } },
    { text: `${EQUITY_ASK.trackA.title}\n`, options: { fontSize: 14, bold: true, color: DARK, breakLine: true } },
    { text: `Use of funds: ${EQUITY_ASK.trackA.use}\n`, options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: `Investor: ${EQUITY_ASK.trackA.investor}\n`, options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: `Structure: ${EQUITY_ASK.trackA.structure}`, options: { fontSize: 12, color: DARK } },
  ], { x: 0.6, y: 2.2, w: 6, h: 3.6, fontFace: "Arial", valign: "top" });
  t.addText([
    { text: "TRACK B — NON-ITAR CLEAN\n", options: { fontSize: 16, bold: true, color: CYAN, breakLine: true } },
    { text: `${EQUITY_ASK.trackB.title}\n`, options: { fontSize: 14, bold: true, color: DARK, breakLine: true } },
    { text: `Use of funds: ${EQUITY_ASK.trackB.use}\n`, options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: `Investor: ${EQUITY_ASK.trackB.investor}\n`, options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: `Structure: ${EQUITY_ASK.trackB.structure}`, options: { fontSize: 12, color: DARK } },
  ], { x: 6.9, y: 2.2, w: 6, h: 3.6, fontFace: "Arial", valign: "top" });
  t.addNotes("The two tracks exist because of export control. Track A is gated by DDTC registration and can only be shown to cleared US investors. Track B has no such gate and can close first. We will accept one or both; the floor is five hundred thousand per track.");

  // Filing sequence slide
  const fs = pptx.addSlide();
  fs.background = { color: "F6F7F9" };
  addHeader(fs, "Step-by-Step Filing Sequence");
  FILING_SEQUENCE.forEach((step, i) => {
    const y = 1.1 + i * 0.78;
    fs.addText(`${step.n}.`, { x: 0.5, y, w: 0.5, h: 0.6, fontFace: "Arial", fontSize: 20, bold: true, color: CYAN });
    fs.addText(step.title, { x: 1.05, y, w: 8.0, h: 0.35, fontFace: "Arial", fontSize: 13, bold: true, color: DARK });
    fs.addText(step.detail.slice(0, 120) + (step.detail.length > 120 ? "…" : ""), { x: 1.05, y: y + 0.34, w: 8.0, h: 0.4, fontFace: "Arial", fontSize: 9, color: SLATE });
    fs.addText(`${step.days}\n${step.cost}`, { x: 9.2, y, w: 3.7, h: 0.7, fontFace: "Arial", fontSize: 9, color: AMBER, align: "right", valign: "middle" });
  });
  fs.addNotes("This is the literal order of operations. Counsel first, then non-ITAR provisionals, then ITAR provisionals under a TCP, then non-provisionals within twelve months, then grants in parallel, then the data room opens. Nothing is disclosed publicly before a provisional is on file.");

  // Claims appendix slides (one per asset, 2 per slide)
  for (let i = 0; i < CLAIMS.length; i += 2) {
    const slide = pptx.addSlide();
    slide.background = { color: "F6F7F9" };
    addHeader(slide, "Draft Provisional Claims (appendix)");
    for (let j = 0; j < 2 && i + j < CLAIMS.length; j++) {
      const c = CLAIMS[i + j];
      const x = j === 0 ? 0.5 : 6.9;
      slide.addText(`${c.code} — ${c.name}`, { x, y: 1.1, w: 5.9, h: 0.5, fontFace: "Arial", fontSize: 12, bold: true, color: DARK });
      slide.addText(`Track: ${c.track}  |  ${c.domain}`, { x, y: 1.55, w: 5.9, h: 0.3, fontFace: "Arial", fontSize: 9, color: c.track === "ITAR" ? AMBER : CYAN, bold: true });
      const claimText = [...c.independent, ...c.dependent].join("\n");
      slide.addText(claimText, { x, y: 1.9, w: 5.9, h: 4.8, fontFace: "Arial", fontSize: 9, color: DARK, valign: "top" });
      slide.addText(c.note, { x, y: 6.75, w: 5.9, h: 0.5, fontFace: "Arial", fontSize: 8, color: AMBER, italic: true });
    }
    slide.addNotes("Every claim on this appendix slide is a draft scaffold derived from the on-file asset description. None of these is a filed patent. Each must be reviewed and finalized with a registered patent attorney before submission to the USPTO. ITAR-tagged claims are filed US-only.");
  }

  // Grant proposals — one slide each
  GRANT_PROPOSALS.forEach((g) => {
    const slide = pptx.addSlide();
    slide.background = { color: "F6F7F9" };
    addHeader(slide, g.title);
    const rows = [
      ["Program", g.program],
      ["Amount", g.amount],
      ["Period", g.period],
      ["Deadline", g.deadline],
      ["Applicant", g.applicant],
      ["Keywords", g.keywords],
    ];
    slide.addTable(
      rows.map((r) => [{ text: r[0], options: { bold: true, color: SLATE, fontSize: 10 } }, { text: r[1], options: { color: DARK, fontSize: 10 } }]),
      { x: 0.5, y: 1.1, w: 12.3, colW: [2.2, 10.1], fontFace: "Arial", border: { type: "solid", color: "D1D4DC", pt: 1 } }
    );
    slide.addText("Objective", { x: 0.5, y: 3.0, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 11, bold: true, color: CYAN });
    slide.addText(g.objective, { x: 0.5, y: 3.3, w: 12.3, h: 0.9, fontFace: "Arial", fontSize: 10, color: DARK });
    slide.addText("Innovation", { x: 0.5, y: 4.2, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 11, bold: true, color: CYAN });
    slide.addText(g.innovation, { x: 0.5, y: 4.5, w: 12.3, h: 0.9, fontFace: "Arial", fontSize: 10, color: DARK });
    slide.addText("Phase I Tasks", { x: 0.5, y: 5.4, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 11, bold: true, color: CYAN });
    slide.addText(g.phase1_tasks.map((t, k) => `${k + 1}. ${t}`).join("\n"), { x: 0.5, y: 5.7, w: 12.3, h: 1.2, fontFace: "Arial", fontSize: 10, color: DARK });
    slide.addNotes(`DRAFT grant proposal: ${g.title}. ${g.commercialization} ITAR note: ${g.itar} This is a draft for submission; confirm open solicitation topics and exact deadlines on the agency portal before submitting.`);
  });

  // Closing slide
  const end = pptx.addSlide();
  end.background = { color: DARK };
  end.addText("Next Actions", { x: 0.8, y: 1.2, w: 11.7, h: 0.7, fontFace: "Arial", fontSize: 32, bold: true, color: WHITE });
  end.addText("1. Retain a registered US patent attorney (this week).\n2. File the 10 non-ITAR provisionals (Day 4–21).\n3. Begin DDTC registration + TCP (Day 4).\n4. File the 10 ITAR provisionals under the TCP (Day 10–40).\n5. Submit the 5 drafted grant proposals (Day 14–60).\n6. Open the data room and pitch (Day 21+).", { x: 0.8, y: 2.2, w: 11.7, h: 3.5, fontFace: "Arial", fontSize: 18, color: WHITE, lineSpacing: 32 });
  end.addText("Nothing in this deck is a filed patent, an investment offer, or legal advice. Claims and proposals require counsel review before any filing or submission.", { x: 0.8, y: 6.4, w: 11.7, h: 0.6, fontFace: "Arial", fontSize: 11, color: AMBER, italic: true });

  await pptx.writeFile({ fileName: "Aethon-Apex-Filing-Playbook.pptx" });
}