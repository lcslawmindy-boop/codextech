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
      { label: "Transaction Type", value: "Asset Purchase or Stock Acquisition (to be determined at close)" },
      { label: "Effective Date", value: TODAY },
      { label: "Exclusivity Period", value: "60 days from execution of this Term Sheet" },
      { label: "Platform Revision", value: "Q3 2026 v2.1 — 23 invention plans · AI Patent Suite · VDR Portal" },
    ],
  },
  {
    section: "Purchase Price & Valuation",
    items: [
      { label: "Base Purchase Price", value: "$8,800,000 – $25,000,000 USD (subject to due diligence and final audit)" },
      { label: "Valuation Basis", value: "Asset-by-asset DCF ($6.3M–$17.8M conservative floor) + strategic pre-public premium (40–120%)" },
      { label: "IP Asset Floor", value: "$9,200,000 (23 documented device architectures + AI Patent Suite + VDR Portal + legal infrastructure)" },
      { label: "Platform ARR Multiple", value: "15×–25× trailing 12-month ARR (strategic AI platform premium)" },
      { label: "Cash at Close", value: "70% of Base Purchase Price" },
      { label: "Deferred / Earnout", value: "30% over 24 months, tied to revenue milestones (Stripe verified)" },
    ],
  },
  {
    section: "Earnout Structure",
    items: [
      { label: "Earnout Period", value: "24 months post-close" },
      { label: "Milestone 1 (Month 12)", value: "15% of deferred consideration if platform ARR >= $750K" },
      { label: "Milestone 2 (Month 24)", value: "15% of deferred consideration if platform ARR >= $1.5M" },
      { label: "Bonus Milestone", value: "Additional 5% if AI Patent Suite white-label secures >= 2 law firm licensees" },
      { label: "Measurement Metric", value: "Gross recurring subscription revenue (Stripe verified) + AI module licensing fees" },
      { label: "Clawback Provision", value: "None — milestones are additive only" },
    ],
  },
  {
    section: "Assets Included",
    items: [
      { label: "Platform Codebase", value: "Full source code (React/Vite frontend, Deno backend functions, 70+ components, all pages)" },
      { label: "IP Portfolio", value: "23 invention dossiers with BOM, PDF export, animated build guides, gov-classified tier" },
      { label: "AI Patent Suite", value: "Patent Intelligence (4 tools) + 7-step Drafting Wizard + Secure Sharing System (tokenized review links)" },
      { label: "VDR Portal", value: "Tokenized NDA-gated investor data room with page-view analytics, revocation controls, and audit trail" },
      { label: "New Inventions (Q3 2026)", value: "MorphoYield TRZ-Agri Array (scalar agriculture IP) + Aegis-SV Adaptive Scalar Counterphase Shield" },
      { label: "Customer Database", value: "All subscriber records, beta applicant pipeline, CRM data, and communication logs" },
      { label: "Content Library", value: "20+ courses, 23 build plan kits, research documents, animated video guides, prior art archive" },
      { label: "Government Documentation", value: "Declassified ONR R-5-78, DoD SBIR grants ($630K+), TACOM IOP FSO-3, Bearden archive (200+ items)" },
      { label: "Revenue Infrastructure", value: "Stripe integrations (live mode), EMF shop (20 products), newsletter list, NDA gate, Material Sourcing Center" },
      { label: "Domains & Branding", value: "zenithapex.base44.app and all associated brand assets, social profiles, and profile content" },
      { label: "Excluded Assets", value: "Seller's personal research notes not integrated into platform; third-party copyrighted source texts" },
    ],
  },
  {
    section: "AI Module White-Label Revenue Rights",
    items: [
      { label: "AI Patent Suite Licensing", value: "Buyer inherits right to sub-license AI Patent Suite to law firms/IP shops at $210K–$750K/yr per licensee" },
      { label: "VDR Portal SaaS Rights", value: "Buyer may license VDR Portal as standalone SaaS to VC/IP firms at $50K–$180K/yr per client" },
      { label: "Projected Year 2 Licensing Revenue", value: "$420K–$1.5M (2 patent suite licensees + 3 VDR clients at midpoint)" },
      { label: "Revenue Share (if applicable)", value: "None — all licensing revenue transfers fully to Buyer post-close" },
    ],
  },
  {
    section: "Representations & Conditions",
    items: [
      { label: "Due Diligence Period", value: "45 business days from signing (live platform demonstration available Day 3–7)" },
      { label: "Seller Reps", value: "Clear title to all platform assets; no undisclosed liabilities; IP free of liens; no pending litigation" },
      { label: "Non-Compete", value: "Seller agrees to 36-month non-compete in advanced EM IP platforms and AI-powered patent generation" },
      { label: "Transition Support", value: "90-day paid transition consulting at $250/hour; 30-day onboarding documentation included at no cost" },
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
      { label: "Subject Matter", value: "Advanced Electromagnetic Device Architectures, AI Patent Suite, VDR Portal & IP Generation Platform (Q3 2026 v2.1)" },
      { label: "Effective Date", value: TODAY },
      { label: "License Term", value: "5 years, renewable with mutual consent at prevailing market rates" },
    ],
  },
  {
    section: "Licensed Assets — Tier Selection",
    items: [
      { label: "Tier A — Device IP Only", value: "Up to 23 documented EM device build plans with BOM, PDF, animated guides (Licensee selects devices)" },
      { label: "Tier B — AI Patent Suite", value: "Patent Intelligence (Claim Summarizer, Novelty/FTO, Competitive Landscape, Drafting Strategy) + Patent Drafting Wizard (7-step, real-time validation, PDF export) + Secure Sharing System" },
      { label: "Tier C — VDR Portal", value: "Tokenized investor data room with page-view analytics, revocation controls, audit trail — white-label deployable" },
      { label: "Tier D — Full Platform", value: "All tiers above + Invention Forge + Market Scanner + PPA Drafter + Build Video + Pitch Deck Exporter" },
      { label: "White-Label Rights", value: "Included in all tiers — Licensee may rebrand for internal or commercial use under agreed field of use" },
      { label: "Source Documentation", value: "ONR R-5-78, DoD SBIR grants, peer-reviewed citation library, Bearden archive index included" },
      { label: "Excluded", value: "Platform customer PII; classified/gov-only device plans (available separately under DoD/defense license)" },
    ],
  },
  {
    section: "Financial Terms",
    items: [
      { label: "Tier A Upfront Fee", value: "$175,000 – $350,000 (based on device count selected)" },
      { label: "Tier B Upfront Fee (AI Patent Suite)", value: "$210,000 – $420,000 + $210,000 – $750,000/year annual license" },
      { label: "Tier C Upfront Fee (VDR Portal)", value: "$75,000 – $140,000 + $50,000 – $180,000/year annual license" },
      { label: "Tier D Full Platform Annual License", value: "$850,000 – $2,200,000/year (non-exclusive); $2,200,000 – $4,500,000/year (exclusive)" },
      { label: "Annual Royalty", value: "6% of gross revenue derived from licensed IP (applies to all tiers)" },
      { label: "Minimum Annual Royalty", value: "$25,000/year (Years 1–3, Tier A); $75,000/year (Years 1–3, Tier B+)" },
      { label: "Sublicensing", value: "Permitted with 50% sublicense fee pass-through to Licensor" },
      { label: "Audit Rights", value: "Licensor may audit Licensee's royalty-bearing books once per year with 15 days notice" },
    ],
  },
  {
    section: "Exclusivity & Territory",
    items: [
      { label: "Default Exclusivity", value: "Non-exclusive unless Licensee elects and pays exclusivity premium below" },
      { label: "Exclusive Territory Premium (Tier A)", value: "$500,000+ one-time for defined territory exclusivity" },
      { label: "Exclusive Territory Premium (Tier B/D)", value: "$1,200,000+ one-time for AI Patent Suite exclusive territory" },
      { label: "Field of Use", value: "Bioelectromagnetics, Energy Research, Defense, IP Commercialization, Law Firm Practice" },
      { label: "Field Restrictions", value: "Consumer medical device marketing requires separate FDA clearance by Licensee at Licensee's cost" },
    ],
  },
  {
    section: "IP Ownership & Improvements",
    items: [
      { label: "Ownership", value: "Licensor retains all underlying IP ownership across all tiers" },
      { label: "Derivative Works", value: "Improvements by Licensee: 50/50 co-ownership with grant-back to Licensor" },
      { label: "Patent Prosecution", value: "Licensor controls all patent filings; Licensee may request filing at Licensor's discretion with cost-sharing" },
      { label: "AI Model Training", value: "Licensee may NOT use licensed platform outputs to train competing AI models without separate written consent" },
      { label: "Infringement Defense", value: "Licensor has first right to defend; Licensee may step in if Licensor declines within 30 days" },
    ],
  },
  {
    section: "Termination & Governing Law",
    items: [
      { label: "Termination for Cause", value: "30-day cure period for material breach; immediate for fraud, insolvency, or unauthorized sublicensing" },
      { label: "Effect of Termination", value: "Existing sublicenses survive; white-label use and API access cease within 90 days" },
      { label: "Governing Law", value: "State of Delaware, USA" },
      { label: "Binding Nature", value: "Non-binding until formal License Agreement is executed by both parties" },
    ],
  },
];

const INVESTOR_TERMS = [
  {
    section: "Offering Summary",
    items: [
      { label: "Company", value: "Zenith Apex Research Portfolio, LLC" },
      { label: "Investor", value: "[INVESTOR NAME / FUND] ('Investor')" },
      { label: "Round Type", value: "Seed / Series A — Convertible Note or Preferred Equity (Investor's election)" },
      { label: "Effective Date", value: TODAY },
      { label: "Platform Status", value: "Q3 2026 v2.1 — 23 inventions, AI Patent Suite, VDR Portal, 7 AI modules, live Stripe revenue" },
      { label: "Use of Proceeds", value: "Patent filings (provisional → nonprovisional conversions), AI Patent Suite white-label sales, team expansion, global marketing" },
    ],
  },
  {
    section: "Investment Terms",
    items: [
      { label: "Investment Amount", value: "$750,000 – $3,000,000 USD" },
      { label: "Pre-Money Valuation", value: "$9,200,000 USD (conservative IP asset floor basis)" },
      { label: "Post-Money Valuation", value: "$9,950,000 – $12,200,000 USD (depending on round size)" },
      { label: "Security Type", value: "Series A Preferred Units (or Convertible Note at Investor's election)" },
      { label: "Conversion Discount (if Note)", value: "20% discount on qualified next-round price" },
      { label: "Valuation Cap (if Note)", value: "$10,500,000 USD" },
    ],
  },
  {
    section: "Equity & Ownership",
    items: [
      { label: "Implied Equity %", value: "7.5% – 24.6% depending on round size and valuation" },
      { label: "Option Pool", value: "10% ESOP to be established prior to close (included in pre-money)" },
      { label: "Liquidation Preference", value: "1× non-participating preferred" },
      { label: "Anti-Dilution", value: "Broad-based weighted average" },
      { label: "Dividends", value: "Non-cumulative; at Board discretion" },
    ],
  },
  {
    section: "Investment Thesis & Revenue Drivers",
    items: [
      { label: "Conservative Year 1 Revenue", value: "$380K – $850K (self-operated: courses + shop + build plans)" },
      { label: "Year 2 Upside — AI Patent Suite", value: "$420K – $1.5M (2 law firm licensees at $210K–$750K/yr each)" },
      { label: "Year 2 Upside — VDR Portal SaaS", value: "$150K – $540K (3 VC/IP firm clients at $50K–$180K/yr each)" },
      { label: "Year 5 Exit Value (10× EBITDA)", value: "$42M – $96M (high scenario per DCF model)" },
      { label: "Cost Per Invention Cycle", value: "~$0.80 LLM API costs → $10K–$50K attorney fees displaced per USPTO PPA" },
      { label: "Competitive Moat", value: "Only platform combining Bearden framework + AI invention generation + real-time patent scanning + USPTO PPA drafting + VDR" },
    ],
  },
  {
    section: "Governance & Rights",
    items: [
      { label: "Board Seat", value: "1 Board observer seat for Investor if investment >= $1M; full Board seat if >= $2M" },
      { label: "Pro-Rata Rights", value: "Investor has right to participate pro-rata in future rounds" },
      { label: "Information Rights", value: "Monthly Stripe MRR/ARR dashboard access, quarterly financials, annual audited statements" },
      { label: "Major Decision Approval", value: "Investor consent required for: asset sale > $1M, new equity issuance, IP encumbrance, M&A" },
      { label: "Drag-Along", value: "Majority equity holders may drag minority into approved sale at >= 3x investment return" },
      { label: "Tag-Along", value: "Investor has tag-along rights on any Founder share sale > 5%" },
    ],
  },
  {
    section: "Exit & Distributions",
    items: [
      { label: "Target Exit", value: "Strategic acquisition by defense contractor, IP firm, or deep-tech VC portfolio within 4–6 years" },
      { label: "Preferred Exit Multiples", value: "4–8× return target on investment (supported by DCF and comparable SaaS transactions)" },
      { label: "Strategic Acquirer Targets", value: "Defense/IC primes, IP management SaaS rollups, deep-tech VC portfolio companies, law firm IP practice groups" },
      { label: "IPO Conversion", value: "Preferred automatically converts to common on qualified IPO >= $50M raise" },
      { label: "Right of First Refusal", value: "Investor has ROFR on any secondary share transfer by Founders" },
    ],
  },
  {
    section: "Conditions & Governing Law",
    items: [
      { label: "Closing Conditions", value: "Satisfactory due diligence (live platform demo available); executed final agreements; IP audit" },
      { label: "Exclusivity", value: "45-day exclusivity from signing" },
      { label: "Governing Law", value: "State of Delaware, USA" },
      { label: "Binding Nature", value: "Non-binding except Exclusivity and Confidentiality provisions" },
      { label: "Legal Counsel", value: "Each party bears own counsel costs; parties agree to use Delaware-qualified counsel" },
    ],
  },
];

const SHEETS = [
  { id: "acquisition", label: "Acquisition / M&A", emoji: "🏢", color: "#6366f1", data: ACQUISITION_TERMS, subtitle: "Full platform sale to strategic or financial acquirer" },
  { id: "licensing", label: "IP Licensing", emoji: "📋", color: "#f59e0b", data: LICENSING_TERMS, subtitle: "License specific IP assets to a licensee" },
  { id: "investor", label: "Investor / Equity", emoji: "💼", color: "#22c55e", data: INVESTOR_TERMS, subtitle: "Bring in an equity investor or convertible note holder" },
];

// ── PDF EXPORT ───────────────────────────────────────────────────────────────

// Sanitize special characters that jsPDF helvetica cannot render
function sanitize(str) {
  return String(str)
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/×/g, "x")
    .replace(/–/g, "-")
    .replace(/—/g, "--")
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/…/g, "...")
    .replace(/•/g, "-")
    .replace(/·/g, ".")
    .replace(/[^\x00-\x7F]/g, ""); // strip any remaining non-ASCII
}

function exportPDF(sheet) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 20;

  const newPage = () => {
    doc.addPage();
    // dark bg on every page
    doc.setFillColor(10, 14, 26);
    doc.rect(0, 0, W, 297, "F");
    // footer bar
    doc.setFillColor(...hexToRgb(sheet.color));
    doc.rect(0, 293, W, 4, "F");
    y = 20;
  };

  const checkPage = (need = 14) => { if (y + need > 282) newPage(); };

  // ── COVER PAGE ──────────────────────────────────────────────────────────────
  doc.setFillColor(10, 14, 26);
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(...hexToRgb(sheet.color));
  doc.rect(0, 0, W, 4, "F");
  doc.rect(0, 293, W, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("ZENITH APEX RESEARCH PORTFOLIO", margin, 30);
  doc.text("CONFIDENTIAL -- DRAFT TERM SHEET", margin, 38);

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(sanitize(`${sheet.label} Term Sheet`), margin, 65);

  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(148, 163, 184);
  doc.text(sanitize(sheet.subtitle), margin, 75);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${TODAY}`, margin, 90);
  doc.text("THIS TERM SHEET IS NON-BINDING EXCEPT WHERE EXPLICITLY STATED.", margin, 98);
  doc.text("This document is confidential and intended solely for the named parties.", margin, 105);

  // valuation highlight box on cover
  const [cr, cg, cb] = hexToRgb(sheet.color);
  doc.setFillColor(cr, cg, cb, 0.15);
  doc.setDrawColor(...hexToRgb(sheet.color));
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, 120, contentW, 40, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("PLATFORM VALUATION", margin + 6, 133);
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("$8.8M -- $25M Acquisition", margin + 6, 146);
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("IP Floor: $9.2M  |  23 Inventions + AI Patent Suite + VDR Portal", margin + 6, 156);

  // ── CONTENT PAGES ──────────────────────────────────────────────────────────
  sheet.data.forEach(section => {
    newPage();

    // Section header bar
    doc.setFillColor(20, 28, 55);
    doc.rect(0, 0, W, 14, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...hexToRgb(sheet.color));
    doc.text(sanitize(section.section.toUpperCase()), margin, 10);
    y = 24;

    section.items.forEach(item => {
      // Estimate height needed
      const valueLines = doc.setFontSize(10) || doc.splitTextToSize(sanitize(item.value), contentW - 6);
      const need = 8 + (valueLines.length * 6) + 4;
      checkPage(need);

      // Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(120, 140, 180);
      doc.text(sanitize(item.label).toUpperCase(), margin, y);
      y += 5;

      // Value
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(230, 235, 250);
      const lines = doc.splitTextToSize(sanitize(item.value), contentW - 6);
      lines.forEach(line => {
        checkPage(7);
        doc.text(line, margin + 3, y);
        y += 6;
      });

      // Divider
      doc.setDrawColor(30, 40, 65);
      doc.setLineWidth(0.3);
      doc.line(margin, y + 1, W - margin, y + 1);
      y += 6;
    });
  });

  // ── SIGNATURE PAGE ──────────────────────────────────────────────────────────
  newPage();
  doc.setFillColor(20, 28, 55);
  doc.rect(0, 0, W, 14, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...hexToRgb(sheet.color));
  doc.text("SIGNATURE BLOCK", margin, 10);
  y = 30;

  [["Seller / Licensor", "Zenith Apex Research Portfolio, LLC"], ["Buyer / Acquirer / Licensee", "[COUNTERPARTY NAME]"]].forEach(([role, name]) => {
    checkPage(55);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...hexToRgb(sheet.color));
    doc.text(role.toUpperCase(), margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(name, margin, y + 6);
    y += 14;

    [["Signature", 18], ["Printed Name", 10], ["Title / Organization", 10], ["Date", 10]].forEach(([fieldLabel, h]) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(fieldLabel + ":", margin, y);
      doc.setDrawColor(50, 65, 100);
      doc.setLineWidth(0.4);
      doc.line(margin + 25, y, W - margin, y);
      y += h;
    });
    y += 10;
  });

  doc.setFontSize(7);
  doc.setTextColor(50, 65, 100);
  doc.text(`ZENITH APEX RESEARCH PORTFOLIO -- CONFIDENTIAL -- ${TODAY} -- FOR DISCUSSION PURPOSES ONLY`, margin, 288);

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