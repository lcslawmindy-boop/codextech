// Angel-investor pitch deck PPTX with speaker notes.
import pptxgen from "pptxgenjs";
import { ANGEL_DECK } from "@/lib/angelInvestorData";

export default async function generateAngelPitchDeck() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Aethon Apex IP Holdings";
  pptx.company = "Aethon Apex / ZDS33";

  ANGEL_DECK.forEach((s, i) => {
    const slide = pptx.addSlide();
    slide.background = { color: "07090C" };

    // Header band
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.5, fill: { color: "0E7490" } });
    slide.addText(`${i + 1} / ${ANGEL_DECK.length}`, { x: 0.3, y: 0.1, w: 1.5, h: 0.3, fontFace: "Arial", fontSize: 9, color: "FFFFFF", bold: true, align: "left" });
    slide.addText("AETHON APEX / ZDS33 — CONFIDENTIAL", { x: 9.5, y: 0.1, w: 3.5, h: 0.3, fontFace: "Arial", fontSize: 8, color: "FFFFFF", align: "right" });

    // Title
    slide.addText(s.title, { x: 0.5, y: 0.7, w: 12.3, h: 0.9, fontFace: "Arial", fontSize: 24, color: "FFFFFF", bold: true, valign: "top" });

    // Bullets
    slide.addText(
      s.bullets.map((b) => ({ text: b, options: { bullet: { code: "2022" }, indentLevel: 0 } })),
      { x: 0.5, y: 1.7, w: 12.3, h: 4.0, fontFace: "Arial", fontSize: 16, color: "CBD5E1", lineSpacingMultiple: 1.4, valign: "top" }
    );

    // Footer disclaimer
    slide.addText(
      "DRAFT — not a filed patent, investment offer, or legal advice. Subject to NDA + filed provisional.",
      { x: 0.5, y: 7.0, w: 12.3, h: 0.3, fontFace: "Arial", fontSize: 8, color: "64748B", italic: true, align: "left" }
    );

    // Speaker notes
    slide.addNotes(s.notes);
  });

  await pptx.writeFile({ fileName: "Aethon-Apex-Angel-Pitch-Deck.pptx" });
}