import { useState } from "react";
import { jsPDF } from "jspdf";
import { FileText, Loader2, Download } from "lucide-react";
import { THEME, drawLogo, drawPageHeader, drawFooter } from "../lib/zenithPdfTheme";

function generateNDA(recipientName, recipientOrg, recipientTitle) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { margin, pageW, gold, goldLight, white, silver, muted, dimmed, pageBg, cardBg, accentBg } = THEME;
  let y = 0;
  let pageNum = 1;

  const bg = () => {
    doc.setFillColor(...pageBg);
    doc.rect(0, 0, pageW, 297, 'F');
  };

  const newPage = () => {
    doc.addPage();
    bg();
    pageNum++;
    drawPageHeader(doc, 'NON-DISCLOSURE AGREEMENT', 'STRICTLY CONFIDENTIAL');
    y = 46;
  };

  const check = (need = 12) => { if (y + need > 282) newPage(); };

  const rule = () => {
    check(6);
    doc.setFillColor(...gold);
    doc.rect(margin, y, pageW - margin * 2, 0.3, 'F');
    y += 5;
  };

  const h1 = (txt) => {
    check(14);
    doc.setFillColor(...accentBg);
    doc.rect(margin - 3, y - 3, pageW - margin * 2 + 6, 11, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text(txt, margin, y + 4);
    y += 12;
  };

  const h2 = (txt) => {
    check(10);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...goldLight);
    doc.text(txt, margin, y);
    y += 7;
  };

  const body = (txt, indent = 0) => {
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...silver);
    const lines = doc.splitTextToSize(txt, pageW - margin * 2 - indent);
    lines.forEach(l => { check(6); doc.text(l, margin + indent, y); y += 5.5; });
    y += 3;
  };

  const infoRow = (label, value) => {
    check(7);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...muted);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...silver);
    doc.text(value || '___________________________________', margin + 46, y);
    y += 6;
  };

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // ── COVER PAGE ─────────────────────────────────────────────────────────────
  bg();
  // Hero band
  doc.setFillColor(...[8, 18, 60]);
  doc.rect(0, 0, pageW, 80, 'F');
  doc.setFillColor(...gold);
  doc.rect(0, 0, pageW, 2, 'F');
  doc.rect(0, 78, pageW, 2, 'F');

  // Large logo centered
  drawLogo(doc, pageW / 2 - 18, 12, 36);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...gold);
  doc.text('ZENITH APEX RESEARCH PORTFOLIO', pageW / 2, 60, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...muted);
  doc.text('Advanced Research · Intellectual Property · AI-Powered Innovation', pageW / 2, 67, { align: 'center' });

  y = 96;
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...white);
  doc.text('NON-DISCLOSURE AGREEMENT', pageW / 2, y, { align: 'center' });
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...muted);
  doc.text('MUTUAL CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT', pageW / 2, y, { align: 'center' });
  y += 5;
  doc.text('Governing Disclosure of Proprietary Research, IP, and Trade Secrets', pageW / 2, y, { align: 'center' });
  y += 14;

  // Parties box
  doc.setFillColor(...cardBg);
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, pageW - margin * 2, 44, 3, 3, 'FD');
  y += 8;

  infoRow('Agreement Date:', date);
  infoRow('Disclosing Party:', 'Zenith Apex Research Portfolio ("ZARP")');
  infoRow('Receiving Party:', `${recipientName || '[RECIPIENT NAME]'}, ${recipientTitle || '[TITLE]'}, ${recipientOrg || '[ORGANIZATION]'}`);
  y += 4;

  // Warning banner
  y += 4;
  doc.setFillColor(40, 10, 10);
  doc.setDrawColor(180, 50, 30);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, pageW - margin * 2, 22, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 120, 80);
  doc.text('⚠  NOTICE: STRICTLY CONFIDENTIAL — ATTORNEY-CLIENT PRIVILEGED', margin + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 160, 140);
  doc.setFontSize(7.5);
  const noticeLines = doc.splitTextToSize(
    'This Agreement governs all Confidential Information disclosed by ZARP. Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident. This document is intended solely for the named Receiving Party.',
    pageW - margin * 2 - 8
  );
  noticeLines.forEach((l, i) => doc.text(l, margin + 4, y + 13 + i * 4.5));
  y += 28;

  // Draw footer on cover
  drawFooter(doc, 1, 1, 'CONFIDENTIAL NDA');

  // ── PAGE 2+ CONTENT ──────────────────────────────────────────────────────
  newPage();

  h1('ARTICLE 1 — RECITALS');
  body('WHEREAS, ZARP possesses certain confidential, proprietary, and trade secret information relating to advanced electromagnetic physics research, AI-powered intellectual property generation platforms, invention disclosures, patent strategies, business models, financial projections, and related technical documentation (collectively, the "Confidential Information");');
  body('WHEREAS, the Receiving Party desires to evaluate the Confidential Information for the purpose of assessing a potential business transaction, licensing arrangement, strategic partnership, or acquisition (the "Purpose");');
  body('NOW, THEREFORE, in consideration of the mutual covenants herein, and for other good and valuable consideration, the receipt and sufficiency of which are acknowledged, the parties agree as follows:');
  rule();

  h1('ARTICLE 2 — DEFINITIONS');
  h2('2.1  Confidential Information');
  body('"Confidential Information" means any and all information, data, documents, materials, or knowledge disclosed by ZARP, whether orally, in writing, electronically, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential. This includes without limitation:');
  const ciItems = [
    '(a) All research, analyses, and findings related to scalar electromagnetics, vacuum energy extraction, overunity energy devices, bioelectromagnetics, psychoenergetics, and related fields derived from the published and unpublished works of Lt. Col. Thomas E. Bearden (ret.);',
    '(b) The Zenith Apex Research Platform — including all source code, AI prompt architectures, database schemas, entity structures, backend functions, automation workflows, and platform configurations;',
    '(c) All AI-generated invention disclosures, patent drafts, financial models, market research reports, pitch decks, and build guides;',
    '(d) All business plans, financial projections, revenue models, investor relationships, acquisition valuations, and negotiation strategies;',
    '(e) All primary source documents, declassified government reports, patent applications, engineering diagrams, and annotated research materials.',
  ];
  ciItems.forEach(item => body(item, 5));

  h2('2.2  Excluded Information');
  body('Confidential Information does not include information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was rightfully known to the Receiving Party prior to disclosure; (c) is independently developed without use of Confidential Information; or (d) is required to be disclosed by applicable law, provided Receiving Party gives prompt written notice.');

  h2('2.3  Representatives');
  body('"Representatives" means the Receiving Party\'s employees, officers, directors, legal counsel, and financial advisors who have a need to know the Confidential Information for the Purpose and who are bound by equivalent confidentiality obligations.');
  rule();

  h1('ARTICLE 3 — OBLIGATIONS OF THE RECEIVING PARTY');
  h2('3.1  Non-Disclosure');
  body('The Receiving Party agrees to: (a) hold all Confidential Information in strict confidence; (b) not disclose any Confidential Information to any third party without ZARP\'s prior written consent; (c) use the Confidential Information solely for the Purpose; (d) limit access to Representatives with a legitimate need to know; (e) notify ZARP immediately upon discovery of any unauthorized use or disclosure.');

  h2('3.2  Standard of Care');
  body('The Receiving Party shall protect the Confidential Information using at least the same degree of care used to protect its own most sensitive proprietary information, but in no event less than a commercially reasonable standard of care.');

  h2('3.3  Prohibited Uses');
  body('The Receiving Party expressly agrees NOT to: (a) reverse engineer or attempt to derive source code from the Platform; (b) use any Confidential Information to train, fine-tune, or prompt any artificial intelligence or machine learning system; (c) file any patent application incorporating or derived from Confidential Information without ZARP\'s written consent; (d) share, post, publish, or transmit any Confidential Information on any public or private digital platform.');

  h2('3.4  Return or Destruction');
  body('Upon ZARP\'s written request, or upon termination of discussions relating to the Purpose, the Receiving Party shall promptly return or destroy all Confidential Information and all copies, extracts, and summaries thereof, and shall certify in writing that such return or destruction has been completed.');
  rule();

  h1('ARTICLE 4 — INTELLECTUAL PROPERTY');
  body('All Confidential Information and all intellectual property rights therein remain the exclusive property of ZARP. This Agreement grants no license, right, or interest of any kind. Any improvements or derivative works created using the Confidential Information shall be deemed owned by ZARP, and the Receiving Party hereby assigns all such rights to ZARP.');
  rule();

  h1('ARTICLE 5 — TERM AND TERMINATION');
  body('This Agreement commences on the date first written above and remains in effect for five (5) years. Confidentiality obligations with respect to trade secrets survive termination indefinitely. Articles 3, 4, 6, and 7 survive termination or expiration.');
  rule();

  h1('ARTICLE 6 — REMEDIES AND ENFORCEMENT');
  h2('6.1  Irreparable Harm');
  body('The Receiving Party acknowledges that any breach would cause irreparable harm for which monetary damages would be an inadequate remedy. Accordingly, ZARP shall be entitled to seek equitable relief, including injunction and specific performance, without posting a bond.');

  h2('6.2  Liquidated Damages');
  body('The Receiving Party agrees to pay liquidated damages of TWO MILLION FIVE HUNDRED THOUSAND DOLLARS ($2,500,000.00 USD) per incident of unauthorized disclosure, the parties acknowledging this represents a reasonable estimate of the harm from such breach.');

  h2('6.3  Attorneys\' Fees');
  body('In any action to enforce this Agreement, the prevailing party shall be entitled to recover reasonable attorneys\' fees and costs.');
  rule();

  h1('ARTICLE 7 — GENERAL PROVISIONS');
  body('Governing Law: California. Disputes resolved by binding arbitration in Los Angeles, CA. This Agreement constitutes the entire agreement regarding the subject matter and supersedes all prior understandings. Amendments require written agreement by both parties. Electronic signatures are valid and binding. This Agreement may be executed in counterparts.');
  rule();

  h1('ARTICLE 8 — SIGNATURES');
  body('IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.');
  y += 5;

  const sigBlock = (label, name, title, org, email) => {
    check(50);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text(label, margin, y);
    y += 6;

    doc.setFillColor(...cardBg);
    doc.setDrawColor(...[30, 50, 100]);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, pageW - margin * 2, 40, 2, 2, 'FD');
    y += 6;

    doc.setFillColor(...[40, 80, 160]);
    doc.rect(margin + 4, y + 10, 75, 0.4, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...dimmed);
    doc.text('Authorized Signature', margin + 4, y + 14);
    y += 18;

    [['Printed Name:', name || '___________________________________'],
     ['Title / Role:', title || '___________________________________'],
     ['Organization:', org || '___________________________________'],
     ['Email:', email || '___________________________________'],
     ['Date:', '___________________________________']
    ].forEach(([lbl, val]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...muted);
      doc.text(lbl, margin + 4, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...silver);
      doc.text(val, margin + 40, y);
      y += 5;
    });
    y += 6;
  };

  sigBlock('DISCLOSING PARTY — ZENITH APEX RESEARCH PORTFOLIO (ZARP)', '[YOUR NAME]', 'Founder / Portfolio Director', 'Zenith Apex Research Portfolio', '[YOUR EMAIL]');
  rule();
  sigBlock('RECEIVING PARTY', recipientName || '[RECIPIENT NAME]', recipientTitle || '[TITLE]', recipientOrg || '[ORGANIZATION]', '');

  // Add footers to all pages
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, p, total, 'NDA');
  }

  doc.save('zenith-apex-nda.pdf');
}

export default function NdaPdfGenerator({ compact }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => { generateNDA(name, org, title); setLoading(false); setOpen(false); }, 100);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className={`flex items-center gap-2 rounded-xl border font-bold transition-all ${compact ? 'px-3 py-1.5 text-xs bg-purple-900/40 hover:bg-purple-800/60 border-purple-700 text-purple-300' : 'px-4 py-2 text-xs bg-purple-900/40 hover:bg-purple-800/60 border-purple-700 text-purple-300'}`}>
        <FileText size={13} /> Generate NDA PDF
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-white font-black text-lg">Generate NDA PDF</h2>
            <p className="text-gray-400 text-xs">Pre-fill recipient details (optional)</p>
            {[
              { label: 'Recipient Full Name', val: name, set: setName, ph: 'e.g. John Smith' },
              { label: 'Title / Role', val: title, set: setTitle, ph: 'e.g. Managing Director' },
              { label: 'Organization', val: org, set: setOrg, ph: 'e.g. Andreessen Horowitz' },
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
                {loading ? 'Building…' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}