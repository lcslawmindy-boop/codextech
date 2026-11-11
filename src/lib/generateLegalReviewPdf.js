import jsPDF from "jspdf";
import { TOP10, PORTFOLIO } from "./investorDeckData";

const money = (n) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`);

export default function generateLegalReviewPdf() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const M = 50;
  const W = doc.internal.pageSize.getWidth() - M * 2;
  let y = M;
  const ink = (txt, size, opts = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(opts.color || [11, 17, 30]);
    const lines = doc.splitTextToSize(txt, W);
    lines.forEach((ln) => {
      if (y > doc.internal.pageSize.getHeight() - M) { doc.addPage(); y = M; }
      doc.text(ln, M, y);
      y += size * (opts.lh || 1.35);
    });
    y += opts.gap || 0;
  };
  const rule = () => { doc.setDrawColor(209, 212, 220); doc.line(M, y, M + W, y); y += 10; };
  const hr = () => { if (y > doc.internal.pageSize.getHeight() - M) { doc.addPage(); y = M; } };

  ink("PATENT CLAIM LEGAL-REVIEW DOCUMENT", 18, { bold: true, gap: 4 });
  ink("Aethon Apex IP Holdings — Top 10 IP Assets by Valuation", 12, { color: [101, 117, 139], gap: 8 });
  ink(`Generated 2026-11-11. Sourced live from the IPAsset entity (Production). ${PORTFOLIO.totalAssets} total assets; ${PORTFOLIO.provisionalFiled} provisionally authorized; 0 filed at the USPTO.`, 9, { color: [101, 117, 139], gap: 8 });
  ink("CONFIDENTIAL — ATTORNEY WORK PRODUCT / PREPARATION FOR LEGAL REVIEW. All claims below are DRAFT scaffolds derived from on-file asset descriptions. They are NOT filed patents and are NOT legal advice. Each claim set must be reviewed and finalized by a registered US patent attorney (or agent) before any USPTO submission. Therapeutic assets are apparatus claims only — no therapeutic-effect claims without clinical data and FDA clearance.", 9, { color: [180, 83, 9], gap: 10 });
  rule();

  TOP10.forEach((a) => {
    hr();
    ink(`#${a.rank} — ${a.name}`, 13, { bold: true, gap: 2 });
    ink(`Domain: ${a.domain}   |   Category: ${a.cat}   |   Filing status: ${a.filing.replace(/_/g, " ")}   |   Confidential: ${a.confidential ? "Yes" : "No"}`, 9, { color: [101, 117, 139], gap: 2 });
    ink(`Advisory valuation: ${money(a.vLow)} – ${money(a.vHigh)}  (${a.basis})`, 9, { bold: true, color: [6, 182, 212], gap: 2 });
    ink(`Market: ${a.market}`, 9, { color: [101, 117, 139], gap: 6 });

    ink("Invention summary (on file):", 10, { bold: true, gap: 2 });
    ink(a.desc, 9, { gap: 6 });

    ink("INDEPENDENT CLAIM (draft):", 10, { bold: true, color: [6, 182, 212], gap: 2 });
    a.claims.independent.forEach((c) => ink(c, 10, { gap: 6 }));

    ink("DEPENDENT CLAIMS (draft):", 10, { bold: true, color: [6, 182, 212], gap: 2 });
    a.claims.dependent.forEach((c) => ink(c, 9, { gap: 4 }));

    ink(`Viability score: ${a.viability.score}/100  |  ${a.viability.trl}`, 9, { bold: true, color: a.viability.score >= 55 ? [16, 185, 129] : a.viability.score >= 35 ? [180, 83, 9] : [239, 68, 68], gap: 2 });
    ink(`Counsel note / risk: ${a.viability.risk}`, 9, { color: [101, 117, 139], gap: 4 });

    hr();
    rule();
  });

  ink("ATTORNEY INSTRUCTIONS", 12, { bold: true, gap: 4 });
  ink("1. Run a novelty/prior-art scan for each claim set before drafting a non-provisional.\n2. Therapeutic assets (UBSCHLP, WHACT, ASITS, ASTTS) — apparatus claims only; remove any method-of-treatment language; advise on §112 enablement given the broad modality fusion in UBSCHLP.\n3. NSBDM — drop 'somatid' / 'pleomorphic' interpretive framing in the spec; claim the fused high-magnification + EM-sensing instrument.\n4. MYTSA, SVRRD — strongest patentability; standard apparatus claims. SVRRD is a passive hydrodynamic device (no §101 issue).\n5. ASTTS, RGSVC, RCSAM, VHSAPS — assess §101 subject-matter eligibility (abstract-idea / natural-phenomenon risk); recommend trade-secret retention where eligibility is doubtful.\n6. Trademark exposure: rename WHACT (Wim Hof) and ASITS (Ayahuasca) before any filing or marketing.\n7. Record assignment of every filed application to Aethon Apex IP Holdings at filing.\n8. All assets here are NON-ITAR; standard US filing and PCT available after a foreign-filing license.", 9, { gap: 8 });

  doc.save("Aethon-Apex-Top10-Legal-Review.pdf");
}