// One-page partner pitch PDF for the zero-capital plan.
// Sent to a specific partner to open a $0 partnership conversation.
import { jsPDF } from "jspdf";

export default function generatePartnerOnePager(o) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const M = 48;
  const W = doc.internal.pageSize.getWidth() - M * 2;
  let y = M;

  const ink = (txt, size, opts = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    const _c = opts.color || [11, 17, 30];
    doc.setTextColor(_c[0], _c[1], _c[2]);
    const lines = doc.splitTextToSize(txt, W);
    lines.forEach((ln) => {
      if (y > doc.internal.pageSize.getHeight() - M) { doc.addPage(); y = M; }
      doc.text(ln, M, y);
      y += size * (opts.lh || 1.4);
    });
    y += opts.gap || 0;
  };

  const rule = () => {
    doc.setDrawColor(209, 212, 220);
    doc.setLineWidth(0.5);
    doc.line(M, y, M + W, y);
    y += 10;
  };

  // Header band
  doc.setFillColor(7, 9, 12);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 64, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("AETHON APEX / ZDS33 — Partnership Proposal", M, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Zero-capital co-development · IP rights traded for resources", M, 44);
  y = 88;

  ink(`To: ${o.partner_name || "—"}${o.contact_name ? ` (Attn: ${o.contact_name})` : ""}`, 11, { bold: true });
  ink(`Re: ${o.asset_focus ? `${o.asset_focus} — partnership inquiry` : "Partnership inquiry"}`, 10, { gap: 6 });

  rule();

  ink("The opportunity", 12, { bold: true, color: [6, 182, 212], gap: 2 });
  ink(
    "Aethon Apex IP Holdings holds a portfolio of research-stage inventions across humanitarian, " +
    "deep-space, and defense domains. We are seeking partners to co-develop two lead non-ITAR assets " +
    "that are low-regulation and grant-fundable, in exchange for a license or equity share rather than cash. " +
    "No capital is requested from the partner for IP access; the partner funds the build or study.",
    9.5, { gap: 8 }
  );

  ink("Lead asset", 12, { bold: true, color: [6, 182, 212], gap: 2 });
  ink(
    (o.asset_focus || "SVRRD — passive vortex river-restoration device") +
    ". Research-stage, non-ITAR, no export-control restrictions. " +
    "Viability score 66/100 (strongest commercial candidate in the portfolio). " +
    "Grant pathways identified: NSF CBET, Gates Foundation global water.",
    9.5, { gap: 8 }
  );

  ink("What we ask of the partner", 12, { bold: true, color: [6, 182, 212], gap: 2 });
  ink(o.ask || "Provision of lab/bench facilities, engineering staff time, or field-test sites to advance the asset toward prototype validation. Alternatively, free provisional patent filing via a pro-bono IP clinic.", 9.5, { gap: 8 });

  ink("What we offer in return", 12, { bold: true, color: [6, 182, 212], gap: 2 });
  ink(o.offer || "Exclusive license to the partner in their vertical market. IP ownership retained by Aethon Apex. Royalty or equity terms negotiable. No upfront cash required from the partner.", 9.5, { gap: 8 });

  ink("Why now", 12, { bold: true, color: [6, 182, 212], gap: 2 });
  ink(
    "Five non-dilutive grant proposals are drafted and ready to submit (AFWERX, Army ARL, NSF, USDA NIFA, NIH NIBIB). " +
    "A partnership strengthens every grant application. We file provisionals before any public disclosure; " +
    "this conversation is under NDA until a provisional is on file.",
    9.5, { gap: 8 }
  );

  rule();

  ink("Next step", 10, { bold: true });
  ink(
    "A 30-minute call to confirm fit and outline a one-page term sheet. Contact: " +
    (o.contact_email || "reply to this message") + ".",
    9, { gap: 4 }
  );

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "This document is a partnership inquiry, not an investment offer or legal advice. " +
    "No patent is filed at the USPTO for any referenced asset. " +
    "All technical disclosure is conditioned on a signed NDA and a filed provisional.",
    M, doc.internal.pageSize.getHeight() - 24,
    { maxWidth: W }
  );

  doc.save(`Aethon-Partner-OnePager-${(o.partner_name || "partner").replace(/\s+/g, "-")}.pdf`);
}