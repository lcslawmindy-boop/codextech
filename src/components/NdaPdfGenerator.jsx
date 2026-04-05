import { useState } from "react";
import { jsPDF } from "jspdf";
import { FileText, Loader2, Download } from "lucide-react";

function generateNDA(recipientName, recipientOrg, recipientTitle) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 20;
  let y = M;
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const bg = () => { doc.setFillColor(8, 8, 20); doc.rect(0, 0, W, 297, "F"); };
  const addPage = () => { doc.addPage(); bg(); y = M; };
  const checkPage = (h = 10) => { if (y + h > 272) addPage(); };

  const h1 = (txt) => {
    checkPage(12);
    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 160, 255);
    doc.text(txt, M, y); y += 8;
  };
  const h2 = (txt) => {
    checkPage(9);
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(200, 220, 255);
    doc.text(txt, M, y); y += 6;
  };
  const body = (txt, indent = 0) => {
    doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(190, 190, 210);
    const lines = doc.splitTextToSize(txt, W - M * 2 - indent);
    lines.forEach(l => { checkPage(5); doc.text(l, M + indent, y); y += 4.8; });
    y += 2;
  };
  const rule = () => { checkPage(4); doc.setDrawColor(40, 50, 90); doc.setLineWidth(0.3); doc.line(M, y, W - M, y); y += 5; };

  // ── Cover page ──────────────────────────────────────────────────────────────
  bg();
  doc.setFillColor(15, 25, 70); doc.rect(0, 0, W, 55, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 140, 255);
  doc.text("STRICTLY CONFIDENTIAL — ATTORNEY-CLIENT PRIVILEGED", W / 2, 16, { align: "center" });
  doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  doc.text("NON-DISCLOSURE AGREEMENT", W / 2, 28, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(140, 160, 220);
  doc.text("MUTUAL CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT", W / 2, 36, { align: "center" });
  doc.text("Governing Disclosure of Proprietary Research, IP, and Trade Secrets", W / 2, 42, { align: "center" });

  y = 68;
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(180, 200, 255);
  doc.text("AGREEMENT DATE:", M, y); doc.setFont("helvetica", "normal"); doc.setTextColor(210, 210, 230); doc.text(date, M + 42, y); y += 7;
  doc.setFont("helvetica", "bold"); doc.setTextColor(180, 200, 255);
  doc.text("DISCLOSING PARTY:", M, y); doc.setFont("helvetica", "normal"); doc.setTextColor(210, 210, 230); doc.text("Zenith Apex Research Portfolio (\"ZARP\")", M + 42, y); y += 7;
  doc.setFont("helvetica", "bold"); doc.setTextColor(180, 200, 255);
  doc.text("RECEIVING PARTY:", M, y); doc.setFont("helvetica", "normal"); doc.setTextColor(210, 210, 230);
  doc.text(`${recipientName || "[RECIPIENT NAME]"}, ${recipientTitle || "[TITLE]"}, ${recipientOrg || "[ORGANIZATION]"}`, M + 42, y); y += 14;

  doc.setFillColor(30, 40, 90); doc.rect(M, y, W - M * 2, 22, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 200, 80);
  doc.text("⚠  NOTICE", M + 4, y + 6);
  doc.setFont("helvetica", "normal"); doc.setTextColor(220, 220, 180);
  const noticeLines = doc.splitTextToSize("This Agreement governs all confidential information disclosed by ZARP including, without limitation, proprietary research, electromagnetic physics frameworks, AI platform architectures, financial models, invention disclosures, patent strategies, and all technical documentation herein. Unauthorized disclosure carries liquidated damages of $2,500,000 per incident.", W - M * 2 - 8);
  noticeLines.forEach((l, i) => doc.text(l, M + 4, y + 12 + i * 4));
  y += 28;

  rule();

  // ── Recitals ────────────────────────────────────────────────────────────────
  h1("RECITALS");
  body("WHEREAS, ZARP possesses certain confidential, proprietary, and trade secret information relating to advanced electromagnetic physics research, AI-powered intellectual property generation platforms, invention disclosures, patent strategies, business models, financial projections, and related technical documentation (collectively, the \"Confidential Information\");");
  body("WHEREAS, the Receiving Party desires to evaluate the Confidential Information for the purpose of assessing a potential business transaction, licensing arrangement, strategic partnership, or acquisition (the \"Purpose\");");
  body("WHEREAS, both parties agree that the Confidential Information constitutes valuable trade secrets and proprietary information deserving the highest level of protection;");
  body("NOW, THEREFORE, in consideration of the mutual covenants and promises set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:");
  rule();

  // ── Article 1 ───────────────────────────────────────────────────────────────
  h1("ARTICLE 1 — DEFINITIONS");
  h2("1.1 Confidential Information");
  body("\"Confidential Information\" means any and all information, data, documents, materials, or knowledge disclosed by ZARP to the Receiving Party, whether disclosed orally, in writing, electronically, visually, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes but is not limited to:", 0);
  const ciItems = [
    "(a) All research, analyses, theories, frameworks, and findings related to scalar electromagnetics, vacuum energy extraction, overunity energy devices, bioelectromagnetics, psychoenergetics, and related fields derived from the published and unpublished works of Lt. Col. Thomas E. Bearden (ret.) and associated researchers;",
    "(b) The Zenith Apex Research Platform — including all source code, AI prompt architectures, database schemas, entity structures, backend functions, automation workflows, and platform configurations;",
    "(c) All AI-generated invention disclosures, patent drafts, financial models, market research reports, pitch decks, and build guides generated by or stored on the Platform;",
    "(d) All business plans, financial projections, revenue models, customer lists, investor relationships, acquisition valuations, and negotiation strategies;",
    "(e) All primary source documents, declassified government reports, patent applications, engineering diagrams, and annotated research materials contained in or referenced by the Platform;",
    "(f) All oral communications, presentations, demonstrations, and discussions relating to the above.",
  ];
  ciItems.forEach(item => body(item, 4));

  h2("1.2 Excluded Information");
  body("Confidential Information does not include information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was rightfully known to the Receiving Party prior to disclosure, as evidenced by written records predating this Agreement; (c) is independently developed by the Receiving Party without use of or reference to the Confidential Information; or (d) is required to be disclosed by applicable law or court order, provided that the Receiving Party provides ZARP with prompt written notice and cooperates with ZARP's efforts to seek a protective order.");

  h2("1.3 Representatives");
  body("\"Representatives\" means the Receiving Party's employees, officers, directors, legal counsel, financial advisors, and other agents who have a need to know the Confidential Information for the Purpose and who are bound by confidentiality obligations at least as protective as those set forth herein.");
  rule();

  // ── Article 2 ───────────────────────────────────────────────────────────────
  h1("ARTICLE 2 — OBLIGATIONS OF THE RECEIVING PARTY");
  h2("2.1 Non-Disclosure");
  body("The Receiving Party agrees to: (a) hold all Confidential Information in strict confidence; (b) not disclose any Confidential Information to any third party without ZARP's prior written consent; (c) use the Confidential Information solely for the Purpose and for no other purpose whatsoever; (d) limit access to the Confidential Information to Representatives who have a legitimate need to know; (e) notify ZARP immediately upon discovery of any unauthorized use or disclosure of the Confidential Information.");

  h2("2.2 Standard of Care");
  body("The Receiving Party shall protect the Confidential Information using at least the same degree of care used to protect its own most sensitive proprietary information, but in no event less than a commercially reasonable standard of care.");

  h2("2.3 Prohibited Uses");
  body("The Receiving Party expressly agrees NOT to: (a) reverse engineer, disassemble, decompile, or attempt to derive source code from the Platform; (b) use any Confidential Information to train, fine-tune, or prompt any artificial intelligence model, large language model, or machine learning system; (c) file any patent application incorporating or derived from any Confidential Information without ZARP's written consent; (d) use any Confidential Information to solicit ZARP's customers, investors, or business partners; (e) share, post, publish, or transmit any Confidential Information on any public or private digital platform, database, or communication channel.");

  h2("2.4 Return or Destruction");
  body("Upon ZARP's written request, or upon termination of discussions relating to the Purpose, the Receiving Party shall promptly return or destroy all Confidential Information and all copies, extracts, and summaries thereof, and shall certify in writing that such return or destruction has been completed.");
  rule();

  // ── Article 3 ───────────────────────────────────────────────────────────────
  h1("ARTICLE 3 — INTELLECTUAL PROPERTY");
  h2("3.1 Ownership");
  body("All Confidential Information and all intellectual property rights therein remain the exclusive property of ZARP. This Agreement does not grant the Receiving Party any license, right, or interest in any Confidential Information, or in any intellectual property owned or controlled by ZARP.");

  h2("3.2 No License");
  body("Nothing in this Agreement shall be construed as granting any rights by license, implication, estoppel, or otherwise, in or to any patents, copyrights, trademarks, trade secrets, or other proprietary rights of ZARP.");

  h2("3.3 Inventions and Discoveries");
  body("Any improvements, adaptations, or derivative works created by the Receiving Party using or based on the Confidential Information shall be deemed to be owned by ZARP, and the Receiving Party hereby assigns all such rights to ZARP.");
  rule();

  // ── Article 4 ───────────────────────────────────────────────────────────────
  h1("ARTICLE 4 — TERM AND TERMINATION");
  h2("4.1 Term");
  body("This Agreement shall commence on the date first written above and shall remain in effect for a period of five (5) years, unless earlier terminated by mutual written agreement. The confidentiality obligations with respect to trade secrets shall survive termination indefinitely.");

  h2("4.2 Survival");
  body("Articles 2, 3, 5, 6, and 7 shall survive the termination or expiration of this Agreement.");
  rule();

  // ── Article 5 ───────────────────────────────────────────────────────────────
  h1("ARTICLE 5 — REMEDIES AND ENFORCEMENT");
  h2("5.1 Irreparable Harm");
  body("The Receiving Party acknowledges that any breach of this Agreement would cause irreparable harm to ZARP for which monetary damages would be an inadequate remedy. Accordingly, ZARP shall be entitled to seek equitable relief, including injunction and specific performance, without the requirement of posting a bond or other security.");

  h2("5.2 Liquidated Damages");
  body("In addition to all other available remedies, the Receiving Party agrees to pay liquidated damages of TWO MILLION FIVE HUNDRED THOUSAND DOLLARS ($2,500,000.00 USD) per incident of unauthorized disclosure, the parties acknowledging that actual damages from such breach would be difficult to ascertain and that this amount represents a reasonable estimate of the harm that would result.");

  h2("5.3 Attorneys' Fees");
  body("In any action to enforce this Agreement, the prevailing party shall be entitled to recover its reasonable attorneys' fees and costs from the non-prevailing party.");
  rule();

  // ── Article 6 ───────────────────────────────────────────────────────────────
  h1("ARTICLE 6 — GENERAL PROVISIONS");
  h2("6.1 Governing Law");
  body("This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any dispute arising under this Agreement shall be resolved by binding arbitration in Los Angeles, California.");

  h2("6.2 Entire Agreement");
  body("This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, negotiations, and representations, whether oral or written.");

  h2("6.3 Amendment");
  body("This Agreement may not be amended except by a written instrument signed by authorized representatives of both parties.");

  h2("6.4 Severability");
  body("If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.");

  h2("6.5 Waiver");
  body("No failure or delay by either party in exercising any right under this Agreement shall operate as a waiver of such right.");

  h2("6.6 Counterparts / Electronic Signatures");
  body("This Agreement may be executed in counterparts, each of which shall be deemed an original. Electronic signatures shall be deemed valid and binding.");
  rule();

  // ── Signature block ─────────────────────────────────────────────────────────
  h1("ARTICLE 7 — SIGNATURES");
  body("IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.");
  y += 4;

  const sigBlock = (label, name, title, org, extra) => {
    checkPage(40);
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(150, 180, 255);
    doc.text(label, M, y); y += 5;
    doc.setDrawColor(80, 100, 180); doc.setLineWidth(0.4);
    doc.line(M, y + 12, M + 80, y + 12);
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(160, 160, 200);
    doc.text("Signature", M, y + 16); y += 20;
    [
      ["Printed Name:", name || "___________________________________"],
      ["Title:", title || "___________________________________"],
      ["Organization:", org || "___________________________________"],
      ["Date:", "___________________________________"],
      ...(extra || []),
    ].forEach(([lbl, val]) => {
      doc.setFont("helvetica", "bold"); doc.setTextColor(160, 160, 200); doc.text(lbl, M, y);
      doc.setFont("helvetica", "normal"); doc.setTextColor(210, 210, 230); doc.text(val, M + 38, y);
      y += 5;
    });
    y += 4;
  };

  sigBlock("DISCLOSING PARTY (ZARP):", "[YOUR NAME]", "Founder / Portfolio Director", "Zenith Apex Research Portfolio", [["Email:", "[YOUR EMAIL]"], ["Phone:", "[YOUR PHONE]"]]);
  rule();
  sigBlock("RECEIVING PARTY:", recipientName || "[RECIPIENT NAME]", recipientTitle || "[TITLE]", recipientOrg || "[ORGANIZATION]", [["Email:", "___________________________________"]]);

  // ── Footer on all pages ──────────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5); doc.setFont("helvetica", "normal"); doc.setTextColor(50, 55, 90);
    doc.text("CONFIDENTIAL — ZENITH APEX RESEARCH PORTFOLIO — NDA — UNAUTHORIZED DISCLOSURE PROHIBITED", W / 2, 291, { align: "center" });
    doc.text(`Page ${i} of ${total}`, W - M, 291, { align: "right" });
  }

  doc.save("zenith-apex-nda.pdf");
}

export default function NdaPdfGenerator() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => { generateNDA(name, org, title); setLoading(false); setOpen(false); }, 100);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700 text-purple-300 text-xs font-bold transition-all">
        <FileText size={13} /> Generate NDA PDF
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-white font-black text-lg">Generate NDA PDF</h2>
            <p className="text-gray-400 text-xs">Pre-fill recipient details (optional — leave blank to use placeholder lines)</p>
            {[
              { label: "Recipient Full Name", val: name, set: setName, ph: "e.g. John Smith" },
              { label: "Title / Role", val: title, set: setTitle, ph: "e.g. Managing Director" },
              { label: "Organization", val: org, set: setOrg, ph: "e.g. Andreessen Horowitz" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-gray-400 text-xs mb-1 block">{f.label}</label>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500" />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setOpen(false)} className="flex-1 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm hover:border-gray-500 transition-all">Cancel</button>
              <button onClick={handle} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm disabled:opacity-60 transition-all">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {loading ? "Building…" : "Download NDA PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}