import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, Copy, CheckCircle2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";

const TODAY = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

// ── TERM SHEET DATA ───────────────────────────────────────────────────────────

const ACQUISITION_TERMS = [
  {
    section: "Transaction Overview",
    items: [
      { label: "Target Company", value: "Zenith Apex Research Portfolio, LLC" },
      { label: "Acquirer", value: "[ACQUIRER LEGAL NAME] ('Buyer')" },
      { label: "Transaction Type", value: "Asset Purchase or Stock Acquisition (to be determined)" },
      { label: "Effective Date", value: TODAY },
      { label: "Exclusivity Period", value: "60 days from execution of this Term Sheet" },
    ],
  },
  {
    section: "Purchase Price & Valuation",
    items: [
      { label: "Base Purchase Price", value: "$4,200,000 – $6,800,000 USD (subject to due diligence)" },
      { label: "Valuation Basis", value: "IP asset value + SaaS ARR multiple (5–8×) + platform goodwill" },
      { label: "IP Asset Floor", value: "$2,100,000 (21 documented device architectures + AI tool suite)" },
      { label: "Platform ARR Multiple", value: "5× trailing 12-month ARR" },
      { label: "Cash at Close", value: "70% of Base Purchase Price" },
      { label: "Deferred / Earnout", value: "30% over 24 months, tied to revenue milestones" },
    ],
  },
  {
    section: "Earnout Structure",
    items: [
      { label: "Earnout Period", value: "24 months post-close" },
      { label: "Milestone 1 (Month 12)", value: "15% of deferred consideration if platform ARR ≥ $500K" },
      { label: "Milestone 2 (Month 24)", value: "15% of deferred consideration if platform ARR ≥ $1M" },
      { label: "Measurement Metric", value: "Gross recurring subscription revenue (Stripe verified)" },
      { label: "Clawback Provision", value: "None — milestones are additive only" },
    ],
  },
  {
    section: "Assets Included",
    items: [
      { label: "Platform Codebase", value: "Full source code (Base44 SaaS, backend functions, agents)" },
      { label: "IP Portfolio", value: "21 invention dossiers, provisional patent filings, prior art archive" },
      { label: "Customer Database", value: "All subscriber records, CRM data, communication logs" },
      { label: "Content Library", value: "Courses, build plans, research documents, video assets" },
      { label: "Domains & Branding", value: "zenithapex.base44.app and associated brand assets" },
      { label: "Government Documentation", value: "Declassified ONR, DoD SBIR documentation archive" },
      { label: "Excluded Assets", value: "Seller's personal research notes not integrated into platform" },
    ],
  },
  {
    section: "Representations & Conditions",
    items: [
      { label: "Due Diligence Period", value: "45 business days from signing" },
      { label: "Seller Reps", value: "Clear title to all assets; no undisclosed liabilities; IP free of liens" },
      { label: "Non-Compete", value: "Seller agrees to 24-month non-compete in advanced EM IP platforms" },
      { label: "Transition Support", value: "90-day paid transition consulting at $250/hour" },
      { label: "Governing Law", value: "State of Delaware, USA" },
      { label: "Binding Nature", value: "Non-binding except Exclusivity, Confidentiality, and Governing Law sections" },
    ],
  },
];

const LICENSING_TERMS = [
  {
    section: "License Overview",
    items: [
      { label: "Licensor", value: "Zenith Apex Research Portfolio, LLC ('Licensor')" },
      { label: "Licensee", value: "[LICENSEE LEGAL NAME] ('Licensee')" },
      { label: "Subject Matter", value: "Advanced Electromagnetic Device Architectures & AI IP Generation Platform" },
      { label: "Effective Date", value: TODAY },
      { label: "License Term", value: "5 years, renewable with mutual consent" },
    ],
  },
  {
    section: "Licensed Assets",
    items: [
      { label: "Device Architectures", value: "Up to 21 documented EM device build plans (Licensee selects)" },
      { label: "AI Tool Suite", value: "Patent Drafting Tool, Invention Forge, Prior Art Archive" },
      { label: "White-Label Rights", value: "Included — Licensee may rebrand for internal or commercial use" },
      { label: "Source Documentation", value: "ONR, DoD SBIR, peer-reviewed citation library included" },
      { label: "Excluded", value: "Platform customer data; classified government device plans" },
    ],
  },
  {
    section: "Financial Terms",
    items: [
      { label: "Upfront License Fee", value: "$175,000 – $350,000 (based on scope selection)" },
      { label: "Annual Royalty", value: "6% of gross revenue derived from licensed IP" },
      { label: "Minimum Annual Royalty", value: "$25,000/year (Years 1–3); $40,000/year (Years 4–5)" },
      { label: "Sublicensing", value: "Permitted with 50% sublicense fee pass-through to Licensor" },
      { label: "Audit Rights", value: "Licensor may audit Licensee's royalty-bearing books once per year" },
    ],
  },
  {
    section: "Exclusivity & Territory",
    items: [
      { label: "Exclusivity", value: "Non-exclusive unless Licensee pays $500K+ exclusivity premium" },
      { label: "Exclusive Territory (if elected)", value: "As negotiated — e.g., North America, EU, or specific vertical" },
      { label: "Field of Use", value: "Bioelectromagnetics, Energy Research, Defense, IP Commercialization" },
      { label: "Field Restrictions", value: "Consumer medical devices require separate FDA clearance by Licensee" },
    ],
  },
  {
    section: "IP Ownership & Improvements",
    items: [
      { label: "Ownership", value: "Licensor retains all underlying IP ownership" },
      { label: "Derivative Works", value: "Improvements by Licensee: 50/50 co-ownership; Licensor gets license back" },
      { label: "Patent Prosecution", value: "Licensor controls all patent filings; Licensee may request at Licensor's discretion" },
      { label: "Infringement Defense", value: "Licensor has first right to defend; Licensee may step in if Licensor declines" },
    ],
  },
  {
    section: "Termination & Governing Law",
    items: [
      { label: "Termination for Cause", value: "30-day cure period for material breach; immediate for fraud or insolvency" },
      { label: "Effect of Termination", value: "All sublicenses survive; white-label use ceases within 90 days" },
      { label: "Governing Law", value: "State of Delaware, USA" },
      { label: "Binding Nature", value: "Non-binding until formal License Agreement is executed" },
    ],
  },
];

const INVESTOR_TERMS = [
  {
    section: "Offering Summary",
    items: [
      { label: "Company", value: "Zenith Apex Research Portfolio, LLC" },
      { label: "Investor", value: "[INVESTOR NAME / FUND] ('Investor')" },
      { label: "Round Type", value: "Seed / Series A — Convertible Note or Preferred Equity (TBD)" },
      { label: "Effective Date", value: TODAY },
      { label: "Use of Proceeds", value: "Platform development, IP filings, sales & marketing, team expansion" },
    ],
  },
  {
    section: "Investment Terms",
    items: [
      { label: "Investment Amount", value: "$500,000 – $2,000,000 USD" },
      { label: "Pre-Money Valuation", value: "$6,000,000 USD" },
      { label: "Post-Money Valuation", value: "$6,500,000 – $8,000,000 USD (depending on round size)" },
      { label: "Security Type", value: "Series A Preferred Units (or Convertible Note at Investor's election)" },
      { label: "Conversion Discount (if Note)", value: "20% discount on qualified next-round price" },
      { label: "Valuation Cap (if Note)", value: "$7,000,000 USD" },
    ],
  },
  {
    section: "Equity & Ownership",
    items: [
      { label: "Implied Equity %", value: "8.3% – 25% depending on round size" },
      { label: "Option Pool", value: "10% ESOP to be established prior to close (included in pre-money)" },
      { label: "Liquidation Preference", value: "1× non-participating preferred" },
      { label: "Anti-Dilution", value: "Broad-based weighted average" },
      { label: "Dividends", value: "Non-cumulative; at Board discretion" },
    ],
  },
  {
    section: "Governance & Rights",
    items: [
      { label: "Board Seat", value: "1 Board observer seat for Investor if investment ≥ $750K" },
      { label: "Pro-Rata Rights", value: "Investor has right to participate pro-rata in future rounds" },
      { label: "Information Rights", value: "Quarterly financials, annual audited statements, Stripe MRR reports" },
      { label: "Major Decision Approval", value: "Investor consent required for: asset sale > $500K, new equity issuance, M&A" },
      { label: "Drag-Along", value: "Majority equity holders may drag minority into approved sale" },
      { label: "Tag-Along", value: "Investor has tag-along rights on any Founder share sale > 10%" },
    ],
  },
  {
    section: "Exit & Distributions",
    items: [
      { label: "Target Exit", value: "Strategic acquisition or secondary market sale within 4–6 years" },
      { label: "Preferred Exit Multiples", value: "3–5× return target on investment" },
      { label: "IPO Conversion", value: "Preferred automatically converts to common on qualified IPO ≥ $30M raise" },
      { label: "Right of First Refusal", value: "Investor has ROFR on any secondary share transfer by Founders" },
    ],
  },
  {
    section: "Conditions & Governing Law",
    items: [
      { label: "Closing Conditions", value: "Satisfactory due diligence; executed final agreements; platform audit" },
      { label: "Exclusivity", value: "45-day exclusivity from signing" },
      { label: "Governing Law", value: "State of Delaware, USA" },
      { label: "Binding Nature", value: "Non-binding except Exclusivity and Confidentiality provisions" },
      { label: "Legal Counsel", value: "Each party bears own counsel costs" },
    ],
  },
];

const SHEETS = [
  { id: "acquisition", label: "Acquisition / M&A", emoji: "🏢", color: "#6366f1", data: ACQUISITION_TERMS, subtitle: "Full platform sale to strategic or financial acquirer" },
  { id: "licensing", label: "IP Licensing", emoji: "📋", color: "#f59e0b", data: LICENSING_TERMS, subtitle: "License specific IP assets to a licensee" },
  { id: "investor", label: "Investor / Equity", emoji: "💼", color: "#22c55e", data: INVESTOR_TERMS, subtitle: "Bring in an equity investor or convertible note holder" },
];

// ── PDF EXPORT ───────────────────────────────────────────────────────────────

function exportPDF(sheet) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkPage = (need = 12) => { if (y + need > 275) addPage(); };

  // Cover
  doc.setFillColor(10, 14, 26);
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(...hexToRgb(sheet.color));
  doc.rect(0, 0, W, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("ZENITH APEX RESEARCH PORTFOLIO", margin, 30);
  doc.text("CONFIDENTIAL — DRAFT TERM SHEET", margin, 37);

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(`${sheet.label} Term Sheet`, margin, 58);

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(148, 163, 184);
  doc.text(sheet.subtitle, margin, 67);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Date: ${TODAY}`, margin, 78);
  doc.text("THIS TERM SHEET IS NON-BINDING EXCEPT WHERE EXPLICITLY STATED.", margin, 84);
  doc.text("This document is confidential and intended solely for the named parties.", margin, 90);

  doc.setFillColor(...hexToRgb(sheet.color));
  doc.rect(0, 293, W, 4, "F");

  // Content pages
  sheet.data.forEach(section => {
    addPage();
    doc.setFillColor(20, 28, 48);
    doc.rect(margin - 3, y - 5, contentW + 6, 11, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...hexToRgb(sheet.color));
    doc.text(section.section.toUpperCase(), margin, y + 2);
    y += 12;

    section.items.forEach(item => {
      checkPage(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(item.label, margin, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(220, 230, 245);
      const lines = doc.splitTextToSize(item.value, contentW - 4);
      lines.forEach(line => {
        checkPage(7);
        doc.text(line, margin + 2, y);
        y += 5.5;
      });
      y += 2;
    });
  });

  // Footer on last page
  checkPage(20);
  y += 8;
  doc.setFillColor(20, 28, 48);
  doc.rect(margin - 3, y, contentW + 6, 28, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(sheet.color));
  doc.text("SIGNATURE BLOCK", margin, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Seller / Licensor: ________________________________  Date: ______________", margin, y + 16);
  doc.text("Buyer / Investor:  ________________________________  Date: ______________", margin, y + 23);

  doc.save(`ZenithApex_${sheet.id}_TermSheet_${new Date().toISOString().slice(0, 10)}.pdf`);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [100, 100, 100];
}

// ── COPY BUTTON ───────────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold transition-all"
    >
      {copied ? <CheckCircle2 size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy All"}
    </button>
  );
}

// ── SECTION CARD ──────────────────────────────────────────────────────────────

function SectionCard({ section, color }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-700/60 shadow-md mb-3"
      style={{ boxShadow: `0 2px 16px ${color}14` }}>
      <button
        className="w-full flex items-center justify-between px-5 py-3 text-left"
        style={{ background: `linear-gradient(90deg, ${color}22, ${color}08)`, borderBottom: open ? `1px solid ${color}30` : "none" }}
        onClick={() => setOpen(o => !o)}
      >
        <p className="text-xs font-black uppercase tracking-widest" style={{ color }}>{section.section}</p>
        {open ? <ChevronUp size={13} className="text-gray-500" /> : <ChevronDown size={13} className="text-gray-500" />}
      </button>
      {open && (
        <div className="bg-gray-900 divide-y divide-gray-800">
          {section.items.map((item, i) => (
            <div key={i} className="px-5 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider sm:w-52 flex-shrink-0">{item.label}</p>
              <p className="text-gray-100 text-sm leading-relaxed flex-1">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function SellerTermSheet() {
  const [activeSheet, setActiveSheet] = useState(SHEETS[0]);
  const [downloading, setDownloading] = useState(false);

  const allText = activeSheet.data
    .map(s => `\n=== ${s.section} ===\n` + s.items.map(i => `${i.label}: ${i.value}`).join("\n"))
    .join("\n");

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise(r => setTimeout(r, 50));
    exportPDF(activeSheet);
    setDownloading(false);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/investor-package" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <FileText size={15} className="text-indigo-400" /> Seller Term Sheet Generator
            </h1>
            <p className="text-gray-500 text-xs">Draft · Confidential · Non-binding (except where noted)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={allText} />
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60"
            style={{ backgroundColor: activeSheet.color }}
          >
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {downloading ? "Exporting…" : "Export PDF"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full p-5 space-y-5">

          {/* Sheet type selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SHEETS.map(sheet => (
              <button
                key={sheet.id}
                onClick={() => setActiveSheet(sheet)}
                className={`text-left px-5 py-4 rounded-2xl border transition-all ${
                  activeSheet.id === sheet.id ? "bg-gray-800/80 border-white/20 shadow-lg" : "bg-gray-900/60 border-gray-800 hover:border-gray-600"
                }`}
                style={activeSheet.id === sheet.id ? { boxShadow: `0 0 24px ${sheet.color}30` } : {}}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{sheet.emoji}</span>
                  <p className="text-white font-black text-sm">{sheet.label}</p>
                  {activeSheet.id === sheet.id && <CheckCircle2 size={12} className="ml-auto" style={{ color: sheet.color }} />}
                </div>
                <p className="text-gray-500 text-xs">{sheet.subtitle}</p>
              </button>
            ))}
          </div>

          {/* Disclaimer banner */}
          <div className="flex items-start gap-3 bg-yellow-950/20 border border-yellow-800/40 rounded-xl px-5 py-3">
            <span className="text-yellow-400 text-sm flex-shrink-0">⚠️</span>
            <p className="text-yellow-300/80 text-xs leading-relaxed">
              <span className="font-black text-yellow-300">DRAFT — NOT LEGALLY BINDING</span> (except Exclusivity, Confidentiality, and Governing Law clauses).
              This document is a starting point for negotiation only. Consult qualified legal counsel before executing any binding agreement.
              All financial figures are indicative and subject to due diligence verification.
            </p>
          </div>

          {/* Active sheet header */}
          <div className="rounded-2xl border border-gray-700/50 overflow-hidden"
            style={{ boxShadow: `0 4px 32px ${activeSheet.color}20` }}>
            <div className="px-6 py-5 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${activeSheet.color}28, ${activeSheet.color}08)`, borderBottom: `1px solid ${activeSheet.color}30` }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{activeSheet.emoji}</span>
                  <h2 className="text-white font-black text-xl">{activeSheet.label} Term Sheet</h2>
                </div>
                <p className="text-gray-400 text-sm">{activeSheet.subtitle}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-gray-500 text-xs">Zenith Apex Research Portfolio</p>
                <p className="text-gray-600 text-xs">{TODAY}</p>
                <p className="text-xs font-bold mt-1" style={{ color: activeSheet.color }}>CONFIDENTIAL DRAFT</p>
              </div>
            </div>
            <div className="bg-gray-900 px-6 py-3 flex items-center gap-4 border-b border-gray-800 text-xs text-gray-500">
              <span>📄 {activeSheet.data.length} sections</span>
              <span>·</span>
              <span>⚖️ Delaware law</span>
              <span>·</span>
              <span>🔒 Confidential</span>
              <span>·</span>
              <span>✏️ Fill in bracketed fields before sending</span>
            </div>
          </div>

          {/* Sections */}
          <div>
            {activeSheet.data.map((section, i) => (
              <SectionCard key={i} section={section} color={activeSheet.color} />
            ))}
          </div>

          {/* Signature block */}
          <div className="rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Signature Block</p>
            </div>
            <div className="bg-gray-900 px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {["Seller / Licensor", "Buyer / Investor / Licensee"].map((party, i) => (
                <div key={i}>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">{party}</p>
                  <div className="space-y-4">
                    <div className="border-b border-gray-700 pb-2">
                      <p className="text-gray-600 text-xs mb-1">Signature</p>
                      <div className="h-8" />
                    </div>
                    <div className="border-b border-gray-700 pb-2">
                      <p className="text-gray-600 text-xs mb-1">Printed Name</p>
                      <div className="h-5" />
                    </div>
                    <div className="border-b border-gray-700 pb-2">
                      <p className="text-gray-600 text-xs mb-1">Title / Organization</p>
                      <div className="h-5" />
                    </div>
                    <div className="border-b border-gray-700 pb-2">
                      <p className="text-gray-600 text-xs mb-1">Date</p>
                      <div className="h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-gray-700 text-xs pb-4">
            Zenith Apex Research Portfolio · CONFIDENTIAL · {TODAY} · For discussion purposes only — not a binding commitment
          </p>
        </div>
      </div>
    </div>
  );
}