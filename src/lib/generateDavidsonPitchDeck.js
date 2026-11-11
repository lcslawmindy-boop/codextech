import pptxgen from "pptxgenjs";
import { CLAIMS, EQUITY_ASK } from "./filingPlaybook";

const DARK = "0B111E";
const CYAN = "06B6D4";
const SLATE = "65758B";
const WHITE = "FFFFFF";
const AMBER = "FBBF24";

// Davidson = defense-track investor. Track A only — ITAR-controlled assets.
const ITAR = CLAIMS.filter((c) => c.track === "ITAR");

export default async function generateDavidsonPitchDeck() {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";
  pptx.author = "Aethon Apex IP Holdings";
  pptx.subject = "Track A — ITAR Defense Portfolio (Investor Pitch for Davidson)";

  const head = (s, t) => {
    s.addShape("rect", { x: 0, y: 0, w: "100%", h: 0.85, fill: { color: DARK } });
    s.addText(t, { x: 0.5, y: 0.16, w: 11, h: 0.5, fontFace: "Arial", fontSize: 21, bold: true, color: WHITE });
    s.addText("CONFIDENTIAL · ITAR-CONTROLLED · NDA REQUIRED", { x: 8.2, y: 0.26, w: 5, h: 0.4, fontFace: "Arial", fontSize: 9, color: AMBER, align: "right", bold: true });
  };

  // Cover
  const c = pptx.addSlide();
  c.background = { color: DARK };
  c.addText("PREPARED FOR: DAVIDSON", { x: 0.8, y: 1.6, w: 11.7, h: 0.5, fontFace: "Arial", fontSize: 16, color: AMBER, bold: true });
  c.addText("Track A — ITAR Defense Portfolio\nInvestor Pitch", { x: 0.8, y: 2.3, w: 11.7, h: 1.6, fontFace: "Arial", fontSize: 40, bold: true, color: WHITE, lineSpacing: 48 });
  c.addText("Aethon Apex IP Holdings  |  10 cleared defense inventions  |  $500k–$2M equity raise", { x: 0.8, y: 4.4, w: 11.7, h: 0.5, fontFace: "Arial", fontSize: 13, color: SLATE });
  c.addText("ITAR-CONTROLLED TECHNICAL DATA. Disclosure restricted to US persons under NDA + ITAR screening. No export, no foreign-national access. Nothing herein is a filed patent, an investment offer, or legal advice.", { x: 0.8, y: 6.0, w: 11.7, h: 0.9, fontFace: "Arial", fontSize: 10, color: AMBER, italic: true });
  c.addNotes("Open by establishing the classification boundary. Everything in this deck is ITAR-controlled technical data. Davidson representatives must be US persons, under NDA, after ITAR screening. We will not disclose to foreign nationals and we will not export. This is Track A of a two-track raise; the clean non-ITAR track is a separate conversation.");

  // The situation / why defense
  const sit = pptx.addSlide();
  sit.background = { color: "F6F7F9" };
  head(sit, "Why We're Here");
  sit.addText([
    { text: "33 defense-grade inventions documented across 6 domains.\n", options: { fontSize: 14, color: DARK, breakLine: true } },
    { text: "Preliminary Design Review complete (AX-ZDS-PDR-001 Rev 1.0).\n", options: { fontSize: 14, color: DARK, breakLine: true } },
    { text: "Zero patents filed. Zero revenue. Zero licenses. Pre-revenue, pre-filing.\n", options: { fontSize: 14, color: AMBER, bold: true, breakLine: true } },
    { text: "DDTC registration not yet complete — a prerequisite to broad disclosure.\n", options: { fontSize: 14, color: DARK, breakLine: true } },
    { text: "We are here to fund the filings, the compliance, and the SBIR campaign.\n", options: { fontSize: 14, color: DARK, bold: true } },
  ], { x: 0.6, y: 1.2, w: 12.1, h: 5, fontFace: "Arial", valign: "top" });
  sit.addNotes("Be direct about the state of things. Thirty-three inventions, a completed PDR, but zero filed patents and no revenue. The honest framing is what earns a defense investor's trust. We are raising to fund the filings and the compliance infrastructure that defense disclosure requires.");

  // The 10 ITAR assets (table)
  const t = pptx.addSlide();
  t.background = { color: "F6F7F9" };
  head(t, "The 10 ITAR Defense Assets");
  const rows = [["Code", "Asset", "Domain", "Cat"]];
  ITAR.forEach((a) => rows.push([a.code, a.name, a.domain.split(" / ")[0], a.cat || "—"]));
  t.addTable(
    rows.map((r, i) => r.map((cell) => ({ text: cell, options: { color: i === 0 ? WHITE : DARK, fill: { color: i === 0 ? DARK : "FFFFFF" }, bold: i === 0, fontSize: 10 } }))),
    { x: 0.4, y: 1.05, w: 12.5, colW: [1.2, 6.8, 2.8, 1.7], fontFace: "Arial", border: { type: "solid", color: "D1D4DC", pt: 1 }, rowH: 0.5 }
  );
  t.addNotes("These ten assets span six domains — secure communications (the quantum mesh node), autonomous swarming, sensing (bio-threat, air-defense radar, biometric checkpoint), power (solid-state battery), and AI command fusion. The quantum mesh and the swarm AI map directly to active AFWERX and Army ARL SBIR topics. The air-defense radar and the EW SIGINT pod map to Navy and SOCOM programs of record. We are not showing technical detail beyond this list until the NDA and ITAR screening are complete.");

  // Compliance framing
  const comp = pptx.addSlide();
  comp.background = { color: "F6F7F9" };
  head(comp, "Export-Control & Compliance (why this matters to Davidson)");
  comp.addText([
    { text: "ITAR (22 CFR §120–130) governs these inventions. Before any broad technical disclosure:\n", options: { fontSize: 13, color: DARK, breakLine: true } },
    { text: "1. DDTC registration (in progress, funded by this raise).\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "2. Technology Control Plan (TCP) — cleared counsel, US-person-only handling.\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "3. US-only patent filing; foreign filing requires a USPTO foreign-filing license.\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "4. No foreign-national access to technical data at any stage.\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "5. Trade-secret retention considered for the most sensitive items (e.g., INV-26 warhead) in lieu of public filing.\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "Davidson personnel reviewing this material must be US persons under NDA + ITAR screening.", options: { fontSize: 12, color: AMBER, bold: true } },
  ], { x: 0.6, y: 1.2, w: 12.1, h: 5.2, fontFace: "Arial", valign: "top" });
  comp.addNotes("This slide is the gating one. Defense investors know ITAR; we show we know it too. DDTC registration, a Technology Control Plan, US-only filing, US-person-only access. For the most sensitive item — the thermobaric warhead — we are actively considering trade-secret retention over a public patent, because a published patent on a warhead is itself an export. Davidson reviewers must be cleared US persons.");

  // SBIR pathway
  const sbir = pptx.addSlide();
  sbir.background = { color: "F6F7F9" };
  head(sbir, "Non-Dilutive Funding Pathway (SBIR first)");
  sbir.addText([
    { text: "Before equity is spent, we chase non-dilutive SBIR/STTR money:\n", options: { fontSize: 13, color: DARK, breakLine: true } },
    { text: "• AFWERX SBIR Phase I — Quantum-Encrypted Tactical Mesh Node (INV-01). Up to $1.9M Phase I+II.\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "• Army ARL SBIR — Autonomous Swarm Coordination AI Core (INV-03).\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "• Navy / SOCOM pathways for the air-defense radar (INV-31) and EW SIGINT pod (INV-27).\n", options: { fontSize: 12, color: DARK, breakLine: true } },
    { text: "Five grant proposals are drafted and ready for submission.\n", options: { fontSize: 12, color: CYAN, bold: true } },
    { text: "SBIR funding does not cost equity and de-risks the round. A Phase I award is also the strongest signal of government interest a defense investor can see.", options: { fontSize: 12, color: DARK } },
  ], { x: 0.6, y: 1.2, w: 12.1, h: 5, fontFace: "Arial", valign: "top" });
  sbir.addNotes("Defense investors look for government money as validation. We have two SBIR targets mapped to specific assets and topics, with proposals drafted. An AFWERX Phase I on the quantum mesh node would both fund the work and signal that the Air Force wants the technology. That award materially de-risks Davidson's investment.");

  // Use of funds
  const uf = pptx.addSlide();
  uf.background = { color: "F6F7F9" };
  head(uf, "Use of Funds — $500k–$2M");
  uf.addText([
    { text: "40% — Provisional + non-provisional patent filings (10 ITAR assets, cleared counsel)\n", options: { fontSize: 13, color: DARK, breakLine: true } },
    { text: "25% — DDTC registration + Technology Control Plan + cleared-staff onboarding\n", options: { fontSize: 13, color: DARK, breakLine: true } },
    { text: "20% — Independent IP valuation + due-diligence package for the defense slice\n", options: { fontSize: 13, color: DARK, breakLine: true } },
    { text: "15% — SBIR cost-share + first benchtop prototype (quantum mesh node or swarm core)\n", options: { fontSize: 13, color: DARK } },
  ], { x: 0.6, y: 1.2, w: 12.1, h: 4, fontFace: "Arial", valign: "top" });
  uf.addText("Forty percent goes straight to IP protection — the highest-leverage spend because an unfiled invention has no defensible value. Twenty-five percent funds the export-control infrastructure Track A cannot proceed without.", { x: 0.6, y: 5.6, w: 12.1, h: 1, fontFace: "Arial", fontSize: 11, color: SLATE });
  uf.addNotes("Forty percent to filings, twenty-five to compliance, twenty to an independent valuation, fifteen to the first benchtop prototype and SBIR cost-share. This is a lean, IP-and-compliance-focused raise, not a burn budget. The first prototype is either the quantum mesh node or the swarm core — whichever the SBIR award lands on first.");

  // Claims appendix — 1 slide per ITAR asset
  ITAR.forEach((a, i) => {
    const s = pptx.addSlide();
    s.background = { color: "F6F7F9" };
    head(s, `Draft Provisional Claim — ${a.code} (${a.domain})`);
    s.addText(a.name, { x: 0.5, y: 1.0, w: 12.3, h: 0.5, fontFace: "Arial", fontSize: 14, bold: true, color: DARK });
    s.addText("INDEPENDENT CLAIM (draft — counsel review required)", { x: 0.5, y: 1.55, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: CYAN });
    s.addText(a.independent[0], { x: 0.5, y: 1.9, w: 12.3, h: 1.6, fontFace: "Arial", fontSize: 10, color: DARK });
    s.addText("DEPENDENT CLAIMS (draft)", { x: 0.5, y: 3.6, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: CYAN });
    s.addText(a.dependent.join("\n"), { x: 0.5, y: 3.95, w: 12.3, h: 2.0, fontFace: "Arial", fontSize: 9, color: SLATE });
    s.addText(a.note, { x: 0.5, y: 6.4, w: 12.3, h: 0.6, fontFace: "Arial", fontSize: 8, color: AMBER, italic: true });
    s.addNotes(`${a.code}: ${a.name}. The claim on screen is a draft scaffold — it must be finalized with cleared patent counsel before any USPTO submission. ITAR note: ${a.note} Speak to the operational relevance and the SBIR/program-of-record alignment, not to unverified performance claims.`);
  });

  // The ask
  const ask = pptx.addSlide();
  ask.background = { color: DARK };
  ask.addText("The Ask", { x: 0.8, y: 1.0, w: 11.7, h: 0.7, fontFace: "Arial", fontSize: 32, bold: true, color: WHITE });
  ask.addText([
    { text: "Track A — ITAR Defense: $500,000–$2,000,000\n", options: { fontSize: 18, color: AMBER, bold: true, breakLine: true } },
    { text: "Structure: SAFE or convertible note. Founder retains majority.\n", options: { fontSize: 13, color: WHITE, breakLine: true } },
    { text: "All IP assigned to a single US holding entity before any check clears.\n", options: { fontSize: 13, color: WHITE, breakLine: true } },
    { text: "Eligibility: US-citizen cleared investors only. NDA + ITAR screening required.\n", options: { fontSize: 13, color: WHITE, breakLine: true } },
    { text: "Close target: 30–60 days post-DDTC registration and first provisional filings.", options: { fontSize: 13, color: WHITE } },
  ], { x: 0.8, y: 1.9, w: 11.7, h: 3, fontFace: "Arial", valign: "top" });
  ask.addText("ITAR-CONTROLLED. No patent is filed. Claims require cleared counsel review. Not an offer of securities. Disclosure to non-US persons is an export violation.", { x: 0.8, y: 6.0, w: 11.7, h: 0.8, fontFace: "Arial", fontSize: 11, color: AMBER, italic: true });
  ask.addNotes("Close with the ask. Five hundred thousand to two million, SAFE or convertible note, founder retains majority. All IP goes into a single US holding entity before any money moves. Only US-citizen cleared investors. Close target thirty to sixty days after DDTC registration and the first provisional filings. Confirm Davidson's intent on NDA and screening before scheduling a technical follow-up.");

  await pptx.writeFile({ fileName: "Aethon-Apex-Davidson-Defense-Pitch.pptx" });
}