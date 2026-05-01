import { useState } from "react";
import { jsPDF } from "jspdf";
import { FileText, Loader2, Download } from "lucide-react";

function generateNDA(recipientName, recipientOrg, recipientTitle) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 0;

  const bg = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, 297, 'F');
  };

  const drawHeader = () => {
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageW, 14, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('ZENITH APEX RESEARCH PORTFOLIO — NON-DISCLOSURE AGREEMENT', margin, 9.5);
    doc.text('STRICTLY CONFIDENTIAL', pageW - margin, 9.5, { align: 'right' });
  };

  const drawFooter = () => {
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 286, pageW, 11, 'F');
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 286, pageW, 0.4, 'F');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text('Zenith Apex Research Portfolio — Confidential Platform Agreement — For Authorized Recipients Only', margin, 292);
      doc.text(`Page ${p} of ${total}`, pageW - margin, 292, { align: 'right' });
    }
  };

  const newPage = () => {
    doc.addPage();
    bg();
    drawHeader();
    y = 24;
  };

  const check = (need = 16) => { if (y + need > 282) newPage(); };

  const rule = () => {
    check(8);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 8;
  };

  const h1 = (txt) => {
    check(22);
    doc.setFillColor(10, 10, 10);
    doc.rect(margin - 4, y - 4, contentW + 8, 18, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(txt, margin, y + 8);
    y += 22;
  };

  const h2 = (txt) => {
    check(18);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(txt, margin, y);
    y += 4;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + doc.getTextWidth(txt), y);
    y += 9;
  };

  const body = (txt, indent = 0) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    const lines = doc.splitTextToSize(txt, contentW - indent);
    lines.forEach(l => { check(10); doc.text(l, margin + indent, y); y += 8.5; });
    y += 5;
  };

  const infoRow = (label, value) => {
    check(12);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(label, margin + 4, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text(value || '___________________________________', margin + 62, y);
    y += 9;
  };

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // ── COVER PAGE ─────────────────────────────────────────────────────────────
  bg();
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageW, 68, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 190, 190);
  doc.text('ZENITH APEX RESEARCH PORTFOLIO', pageW / 2, 22, { align: 'center' });
  doc.text('Advanced Research  ·  Intellectual Property  ·  AI-Powered Innovation  ·  Platform Valuation: $8.5M–$18.5M', pageW / 2, 31, { align: 'center' });

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('NON-DISCLOSURE AGREEMENT', pageW / 2, 52, { align: 'center' });

  y = 82;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('MUTUAL CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT', pageW / 2, y, { align: 'center' });
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text('Governing Disclosure of Proprietary Research, Intellectual Property, and Trade Secrets', pageW / 2, y, { align: 'center' });
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Platform Acquisition Valuation: $8.5M–$18.5M (DCF) · Asking: $12M–$28M · April 2026 AI SaaS Market Multiples Applied', pageW / 2, y, { align: 'center' });
  y += 16;

  // Parties box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.rect(margin, y, contentW, 52, 'D');
  y += 10;
  infoRow('Agreement Date:', date);
  infoRow('Disclosing Party:', 'Zenith Apex Research Portfolio ("ZARP")');
  infoRow('Receiving Party:', `${recipientName || '[RECIPIENT NAME]'}, ${recipientTitle || '[TITLE]'}, ${recipientOrg || '[ORGANIZATION]'}`);
  y += 6;

  // Notice box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, contentW, 28, 'D');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('NOTICE: CONFIDENTIAL — FOR AUTHORIZED RECIPIENTS ONLY', margin + 6, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const noticeLines = doc.splitTextToSize('This document contains proprietary platform information. Third-party research referenced herein remains the copyright of respective authors. Recipients are bound by the terms of this agreement.', contentW - 12);
  noticeLines.forEach((l, i) => doc.text(l, margin + 6, y + 19 + i * 5.5));
  y += 34;

  drawFooter();

  // ── CONTENT PAGES ──────────────────────────────────────────────────────────
  newPage();

  h1('ARTICLE 1 — RECITALS');
  body('WHEREAS, ZARP operates a research curation and AI-powered tools platform (the "Platform") that includes proprietary software, compiled research indexes, AI-generated analysis tools, patent drafting utilities, and original platform content (collectively, the "Confidential Information"). Note: Third-party published works referenced on the Platform (including works by Thomas E. Bearden and other researchers) remain the copyright of their respective authors and are not included in the definition of Confidential Information.;');
  body('WHEREAS, the Receiving Party desires to evaluate the Confidential Information for the purpose of assessing a potential business transaction, licensing arrangement, strategic partnership, or acquisition (the "Purpose");');
  body('NOW, THEREFORE, in consideration of the mutual covenants herein, and for other good and valuable consideration, the receipt and sufficiency of which are acknowledged, the parties agree as follows:');
  rule();

  h1('ARTICLE 2 — DEFINITIONS');
  h2('2.1  Confidential Information');
  body('"Confidential Information" means any and all information, data, documents, materials, or knowledge disclosed by ZARP, whether orally, in writing, electronically, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential. This includes without limitation:');
  [
    '(a) All original Platform tools, software, source code, AI prompt architectures, database schemas, and platform configurations developed by ZARP;',
    '(b) The Zenith Apex Research Platform — including all source code, AI prompt architectures, database schemas, entity structures, backend functions, automation workflows, and platform configurations;',
    '(c) All AI-generated invention disclosures, patent drafts, financial models, market research reports, pitch decks, and build guides;',
    '(d) All business plans, financial projections, revenue models, investor relationships, acquisition valuations, and negotiation strategies;',
    '(e) All original annotations, curation decisions, and novel analysis compiled by ZARP (excluding the underlying third-party source documents themselves, which remain the property of their respective authors).',
  ].forEach(item => body(item, 6));

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
  body('All original Platform Confidential Information and all intellectual property rights therein remain the exclusive property of ZARP. This Agreement grants no license, right, or interest of any kind in ZARP\'s proprietary Platform. Nothing herein shall be construed to grant any rights in third-party published works that are referenced on the Platform, which remain the intellectual property of their respective owners. Any improvements or derivative works created using ZARP\'s original Platform Confidential Information shall be deemed owned by ZARP.');
  rule();

  h1('ARTICLE 5 — TERM AND TERMINATION');
  body('This Agreement commences on the date first written above and remains in effect for five (5) years. Confidentiality obligations with respect to trade secrets survive termination indefinitely. Articles 3, 4, 6, and 7 survive termination or expiration.');
  rule();

  h1('ARTICLE 6 — REMEDIES AND ENFORCEMENT');
  h2('6.1  Irreparable Harm');
  body('The Receiving Party acknowledges that any breach would cause irreparable harm for which monetary damages would be an inadequate remedy. Accordingly, ZARP shall be entitled to seek equitable relief, including injunction and specific performance, without posting a bond.');

  h2('6.2  Damages');
  body('In the event of breach, the non-breaching party shall be entitled to seek actual damages, including but not limited to lost profits and business opportunities. The parties agree that damages may be difficult to quantify and that equitable relief shall be available as described in Section 6.1.');

  h2('6.3  Attorneys\' Fees');
  body('In any action to enforce this Agreement, the prevailing party shall be entitled to recover reasonable attorneys\' fees and costs.');
  rule();

  h1('ARTICLE 7 — GENERAL PROVISIONS');
  body('Governing Law: State of California. Disputes resolved by binding arbitration in Los Angeles, California. This Agreement constitutes the entire agreement regarding the subject matter and supersedes all prior understandings. Amendments require written agreement by both parties. Electronic signatures are valid and binding. This Agreement may be executed in counterparts, each of which shall constitute an original.');
  rule();

  h1('ARTICLE 8 — SIGNATURES');
  body('IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.');
  y += 6;

  const sigBlock = (label, name, title, org) => {
    check(60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(label, margin, y);
    y += 8;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentW, 50, 'D');
    y += 10;

    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.4);
    doc.line(margin + 6, y + 14, margin + 90, y + 14);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.text('Authorized Signature', margin + 6, y + 19);
    y += 24;

    [['Printed Name:', name || '___________________________________'],
     ['Title / Role:', title || '___________________________________'],
     ['Organization:', org || '___________________________________'],
     ['Date Signed:', '___________________________________']
    ].forEach(([lbl, val]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(lbl, margin + 6, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);
      doc.text(val, margin + 48, y);
      y += 7;
    });
    y += 10;
  };

  sigBlock('DISCLOSING PARTY — ZENITH APEX RESEARCH PORTFOLIO (ZARP)', '[YOUR NAME]', 'Founder / Portfolio Director', 'Zenith Apex Research Portfolio');
  rule();
  sigBlock('RECEIVING PARTY', recipientName || '[RECIPIENT NAME]', recipientTitle || '[TITLE]', recipientOrg || '[ORGANIZATION]');

  drawFooter();
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
            <p className="text-gray-400 text-xs">Pre-fill recipient details (optional — leave blank for template placeholders)</p>
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