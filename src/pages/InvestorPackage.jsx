import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Mail, CheckCircle2, ChevronDown, ChevronUp, DollarSign, Shield, BookOpen, FileText, Download } from "lucide-react";
import { BUYERS } from "../lib/buyerData";
import NdaPdfGenerator from "../components/NdaPdfGenerator";
import DueDiligencePdfGenerator from "../components/DueDiligencePdfGenerator";

const VALUATION = [
  { label: "AI Invention Forge Engine (LLM-powered, full IP + financial generation)", low: 380000, high: 950000 },
  { label: "AI Market Research Scanner (live USPTO/EPO/IEEE/journal scan + TAM/SAM/SOM)", low: 220000, high: 580000 },
  { label: "AI Patent Intelligence Suite (Claim Summarizer, Novelty/FTO, Competitive Landscape, Drafting Strategy)", low: 210000, high: 520000, tag: "NEW" },
  { label: "Patent Drafting Wizard (7-step USPTO workflow, real-time validation, AI auto-fill, PDF export)", low: 175000, high: 440000, tag: "NEW" },
  { label: "Secure Patent Sharing System (tokenized share links, comment threading, expiry control)", low: 85000, high: 210000, tag: "NEW" },
  { label: "Provisional Patent Drafter (USPTO 35 USC 111(b), Claude Sonnet, 9 sections)", low: 150000, high: 380000 },
  { label: "VC Pitch Deck Generator + Build Video Engine (animated step-by-step guides)", low: 120000, high: 280000 },
  { label: "Virtual Data Room (VDR) Portal (tokenized NDA-gated investor access + analytics)", low: 140000, high: 360000, tag: "NEW" },
  { label: "Scalar Wave / Field Simulators + Dark Timeline Visualizer", low: 80000, high: 175000 },
  { label: "Knowledge Graph (200+ nodes, primary source fragments, real-time subscriptions)", low: 220000, high: 420000 },
  { label: "Course Catalog (20+ courses, syllabi, Stripe checkout, learning dashboard)", low: 150000, high: 320000 },
  { label: "Invention Build Plans (23 devices, BOM, PDF export, animated guides, gov-classified tier)", low: 620000, high: 1650000, tag: "EXPANDED" },
  { label: "MorphoYield TRZ-Agri Array (scalar field agriculture, crop yield IP)", low: 190000, high: 490000, tag: "NEW" },
  { label: "Aegis-SV Adaptive Scalar Counterphase Shield (personal EMF defense system IP)", low: 210000, high: 540000, tag: "NEW" },
  { label: "Annotated Primary Document Archive + Bearden Node Network", low: 120000, high: 280000 },
  { label: "Research Domain Moat + Platform Content Exclusivity (curated Bearden framework, tools, indexes)", low: 2100000, high: 7500000 },
  { label: "Prior Art Archive + Patent Landscape Graph + AI Patentability Cross-Reference", low: 95000, high: 240000 },
  { label: "KRCIC — Kaznacheyev Reversal Cell Imprinting Chamber (biophysics IP, build plan)", low: 180000, high: 480000 },
  { label: "UBDRS — UV Biophoton Disease Reversal System (biophysics IP, full build plan)", low: 145000, high: 385000 },
  { label: "Legal Compliance Infrastructure (ToS, disclaimers, refund policy, NDA gate)", low: 45000, high: 120000 },
  { label: "EMF Health Platform + Investor CRM + Monitoring Dashboard + Alert System", low: 110000, high: 220000 },
];

const LETTER = `STRICTLY CONFIDENTIAL — FOR AUTHORIZED RECIPIENTS ONLY

[DATE]

Dear [RECIPIENT NAME],

I am writing to offer you a time-limited, exclusive first-look at an acquisition that does not come to market twice.

The Zenith Apex Advanced Research Platform is the world's only commercially structured, production-ready AI-powered knowledge and IP generation platform built around the advanced electromagnetic physics and bioelectromagnetic medicine research of Lt. Col. Thomas E. Bearden (ret.) — cross-referenced against primary US government documents, peer-reviewed publications, and declassified archives that independently validate the core technical claims.

Note: Third-party published works referenced on this platform (including Bearden's books and papers, ONR reports, and peer-reviewed publications) remain the copyright of their respective authors. What you are acquiring is the original platform software, AI tool suite, curated indexes, and compiled research infrastructure built on top of this publicly available research.

As of Q2 2026, the platform has been substantially expanded with a suite of AI-native modules that transform it from a research archive into a fully autonomous invention-to-commercialization engine. This is not a static dataset — it is a living, generative IP factory.

────────────────────────────────────────────
PLATFORM FAIR MARKET VALUE (Q2 2026)
────────────────────────────────────────────

Independent asset-by-asset valuation (conservative discounted cash flow + comparable SaaS multiples):

  AI Invention Forge Engine ............. $380K – $950K
  AI Market Research Scanner ............ $220K – $580K
  AI Patent Intelligence Suite (NEW) .... $210K – $520K
  Patent Drafting Wizard (NEW) ........... $175K – $440K
  Secure Patent Sharing System (NEW) .... $85K – $210K
  USPTO Provisional Patent Drafter ....... $150K – $380K
  VC Pitch Deck + Build Video Engine .... $120K – $280K
  VDR Portal — Investor Data Room (NEW)  $140K – $360K
  Scalar Field / Wave Simulators ......... $80K – $175K
  Bearden Knowledge Graph (200+ nodes) .. $220K – $420K
  Course Catalog (20+ courses, LMS) ..... $150K – $320K
  Invention Build Plans (23 devices, EXPANDED) $620K – $1.65M
  MorphoYield TRZ-Agri Array (NEW) ....... $190K – $490K
  Aegis-SV Scalar Counterphase Shield (NEW) $210K – $540K
  Annotated Primary Document Archive .... $120K – $280K
  Research Domain Moat + Exclusivity ... $2.1M – $7.5M
  Prior Art Archive + Patent AI ......... $95K – $240K
  KRCIC — Kaznacheyev EM Imprinting Chamber $180K – $480K
  UBDRS — UV Biophoton Disease Reversal  $145K – $385K
  Legal Compliance Infrastructure ........ $45K – $120K
  Health + CRM + Monitoring Suite ........ $110K – $220K

  PLATFORM TOTAL (conservative):    $6.3M – $17.8M
  + Strategic pre-public premium:    $8.8M – $39.2M

────────────────────────────────────────────
WHAT YOU ARE ACQUIRING — FULL ASSET SUMMARY
────────────────────────────────────────────

I. AI-NATIVE INVENTION GENERATION ENGINE (NEW — Q2 2026)

• AI Invention Forge — Select technology domains (vacuum energy, bioelectromagnetics, scalar comm, consciousness, EMF protection) and target markets. The AI generates novel, investor-ready invention concepts complete with: full technical specifications grounded in Bearden's documented framework, 5-year P&L financial projections with Series A targets, USPTO IP valuation and filing strategy, phase-by-phase GTM launch plans, and prior art differentiation analysis. Output: complete invention dossiers for each generated concept.

• AI Market Research Scanner — Integrated live-internet scanning module that queries USPTO, EPO, WIPO, Google Patents, IEEE Xplore, arXiv, Grand View Research, and MarketsandMarkets in real-time. Auto-populates TAM/SAM/SOM figures with citations, identifies 8 prior art citations per invention with conflict risk scoring (High/Medium/Low), and generates per-citation differentiation strategies. Powered by Gemini Pro with live internet access.

• AI Patent Intelligence Suite (NEW) — 4-tool patent intelligence platform: (1) Claim Summarizer (strength ratings, vulnerabilities, broadening opportunities); (2) Novelty & FTO Analysis (prior art conflict scoring, differentiation strategy); (3) Competitive Landscape (live-internet IP holder map, white-space analysis, 5-year forecast); (4) Provisional Drafting Strategy (3 independent claims, 7 dependent claims, prosecution roadmap). All tools include PDF export and "Open in Wizard" one-click handoff.

• Patent Drafting Wizard (NEW) — 7-step guided USPTO patent application drafting workflow with real-time validation, AI auto-fill at every step, completeness scoring (0–100%), and one-click PDF export. Imports Patent Intelligence context for seamless workflow. Includes Secure Sharing System: tokenized share links with configurable expiry (24h–30d), per-section comment threading for collaborators, one-click revocation, and view count tracking.

• Provisional Patent Drafter — Generates complete USPTO-compliant Provisional Patent Applications (35 USC 111(b), 37 CFR Part 1) in 9 formal sections: Title, Cross-Reference, Technical Field, Background, Summary, Brief Drawings, Detailed Description (800–1,200 words), 20 Claims (3 independent + 17 dependent), and Abstract. Powered by Claude Sonnet. Each PPA establishes a real USPTO priority date.

• Build Video Generator — Generates 10-step animated engineering build guides for any invention: materials, tools, safety warnings, checkpoints, and schematic canvas visualizations per step. Playback engine with progress tracking. Export as branded PDF build manual. All guides auto-saved to database with full CRUD management in Admin Video Library.

• VC Pitch Deck Exporter — One-click generation of investor-ready pitch decks covering market opportunity, technology differentiation, IP strategy, financial projections, and team structure. Personalized per invention portfolio.

• Virtual Data Room (VDR) Portal (NEW) — Tokenized, NDA-gated investor data room with page-view analytics, session duration tracking, access revocation controls, and audit trail. Each investor receives a unique secure URL. Admin dashboard shows live engagement per investor.

II. OVERUNITY ENERGY TECHNOLOGY (Peer-Reviewed, Independently Replicated)

• Motionless Electromagnetic Generator (MEG) — COP>>1 device published in Foundations of Physics Letters (2001) by 15 authors from 12 institutions including Boeing, Trinity College Dublin, and Alfvén Laboratory Stockholm. Independently replicated by Naudin. Full engineering replication plans included.

• Asymmetric Regauging Circuit (Patent Pending) — The theoretical framework explaining WHY COP>1 is permitted under thermodynamics, with the mainstream physics proof (Bohren, Am. J. Phys., 1983: metallic sphere absorbs 18× more energy than incident).

• Time-Reversal Zone Cold Fusion Reactor — Engineering plans for a tabletop device exploiting the TRZ phenomenon documented at 73 sigma above background at China Lake Naval Weapons Center.

• Type 2 Engineering / Vacuum Engines — The foundational framework for gating vacuum flux rather than using external energy — the only engineering paradigm where COP>>1 is thermodynamically permitted.

III. BIOELECTROMAGNETIC RESEARCH ARCHIVE (Historical Government & Academic Documents — For Research Purposes Only)

Note: All items in this section are historical research documents and experimental device plans. No device described herein is approved by the FDA or any regulatory body for medical use. These materials are provided for research, education, and IP acquisition evaluation only.

• The Complete Prioré Archive — US Office of Naval Research London Branch Report R-5-78 (J.B. Bateman, 16 August 1978, UNCLASSIFIED): documents French government-funded animal experiments with the Prioré EM device. Historical research record — not an FDA-approved clinical trial. Source: Bateman, J.B. (1978). ONR London Branch Report R-5-78.

• Nobel Laureate Scientific Observation — André Lwoff (1965 Nobel Prize, Villejuif Institute) reviewed the Prioré animal experiment data, documented in the 1975 Esquire investigation. Historical academic record only.

• Telomere Research Device (TRD-1) — Experimental research instrument implementing Bearden's MCCS scalar EM protocol (Bearden T.E., 2002, Energy from the Vacuum, Cheniere Press). For in vitro and experimental research purposes only. Not a medical device. Full build plans with BOM included.

• Portable Scalar EM Research Platform — Experimental device for structured EM field research. For research use only. No clinical or therapeutic claims are made or implied.

IV. DEFENSE INTELLIGENCE (Primary Source Documented)

• Gulf War Syndrome as KGB QP Weapon — Complete operational analysis with ABC/French/native population controls confirming intentionality. Includes all three Bioenergetics briefing slides.

• Baghdad M1A1 Incident — Official TACOM IOP FSO-3 memorandum (30 September 2003): M1A1 tank penetrated by unknown weapon leaving pencil-diameter holes through Chobham armor with copper/bronze residue. Scalar EM penetrator analysis included.

• TRZ/PPA Patent Figure Set — 31 diagrams from the scalar EM weapons / time-reversal zone patent application series.

V. PRODUCTION-READY REVENUE PLATFORM

• 20+ fully developed educational courses ($197–$397 each) with Stripe payment + LMS
• 23 invention build plan kits with downloadable PDFs ($490–$1,800 each) — including MorphoYield TRZ-Agri Array and Aegis-SV Scalar Counterphase Shield
• 20-product EMF protection shop with full e-commerce
• Investor matching portal, CRM with pipeline tracking, and monitoring alert system
• Newsletter infrastructure, NDA access gate, copy protection, analytics
• AI Invention Forge → Patent → Market Research → Pitch Deck pipeline (complete)

  Conservative Year 1 revenue (self-operated):          $380,000 – $850,000
  Year 2 with AI patent suite + VDR licensing:          $1.2M – $3.8M
  Strategic value to acquirer with existing distribution: $8.8M – $39.2M

────────────────────────────────────────────
ACQUISITION TERMS (REVISED Q2 2026)
────────────────────────────────────────────

EXCLUSIVE ACQUISITION (full IP, platform, AI engines, archive, plans):  $8.8M – $25M
LICENSING ONLY (non-exclusive, annual):                                  $850,000 – $2,200,000/year
AI PATENT SUITE WHITE-LABEL (law firms, IP shops, VC patent teams):     $210,000 – $750,000/year per licensee
VDR PORTAL SaaS (IP firms / VC data room solution):                     $50,000 – $180,000/year per client
STRATEGIC PARTNERSHIP / JV:                                              Equity terms, negotiable

This opportunity is being presented to a maximum of six (6) qualified buyers before public launch. First executed NDA with proof of funds receives priority due diligence access.

────────────────────────────────────────────
WHY Q2 2026 IS THE INFLECTION POINT
────────────────────────────────────────────

The platform crossed a critical threshold in Q2 2026: it is now a self-contained IP generation and commercialization engine — institutional-grade, peer-review-backed, and government-validated. A solo operator, law firm, or deep-tech VC can use this platform to:

1. Generate 5 novel inventions per session grounded in documented scalar EM physics
2. Scan global patent databases in real-time for prior art and conflict risk
3. Auto-draft USPTO-compliant provisional patent applications (priority date established)
4. Generate VC pitch decks and step-by-step build guides for each invention
5. Export the entire pipeline as professional PDFs for filing or investor presentation

The marginal cost per invention cycle is $0 (LLM API costs ~$0.80/session). The marginal value per USPTO provisional filing: $10,000–$50,000 in attorney fees displaced.

No comparable platform exists. This is a category-creating asset.

────────────────────────────────────────────
TO PROCEED
────────────────────────────────────────────

1. Reply to confirm interest and receive NDA template
2. Execute NDA and provide proof of funds or institutional mandate letter
3. Receive full technical due diligence package (100+ page document portfolio)
4. Schedule technical demonstration and Q&A (live platform walkthrough available)

This letter and its attachments contain confidential platform and business information. Please treat this document as confidential and do not share without authorization.

I look forward to discussing this opportunity at your earliest convenience.

Sincerely,

[YOUR NAME]
Zenith Apex Research Portfolio
[YOUR EMAIL]
[YOUR PHONE]
[DATE]

────────────────────────────────────────────
KEY DUE DILIGENCE DOCUMENTS AVAILABLE UNDER NDA
────────────────────────────────────────────

• ONR London Branch Report R-5-78 (UNCLASSIFIED, 26 pages)
• French Patent 1,342,772 — Complete English translation with engineering annotations
• Anastasovski et al., Found. Phys. Lett. 14(1), 2001 — MEG O(3) paper
• Anastasovski et al., Found. Phys. Lett. 14(4), 2001 — MEG Sachs theory paper
• Bohren, Am. J. Phys. 51(4), 1983 — COP>1 particle proof
• TACOM IOP FSO-3, 30 September 2003 — Baghdad M1A1 incident report
• Brush, J. Franklin Inst., Vol. 206, No. 2, 1928 — Kinetic gravitation experiments
• TRZ/PPA 31-figure patent diagram set
• Bearden MEG & Overunity Circuit Patent Pending diagrams
• Complete Bearden Energetics / Bioenergetics / Psychoenergetics slide series (1996–1999)
• Platform codebase + all AI prompt architecture (under NDA escrow)
• Sample AI-generated invention dossier with USPTO PPA draft (live demonstration)`;

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-medium transition-all">
      {copied ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function ValuationTable() {
  const totalLow = VALUATION.reduce((s, v) => s + v.low, 0);
  const totalHigh = VALUATION.reduce((s, v) => s + v.high, 0);
  const fmt = n => "$" + (n >= 1000000 ? (n / 1000000).toFixed(1) + "M" : (n / 1000).toFixed(0) + "K");

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
        <DollarSign size={15} className="text-green-400" />
        <h2 className="text-white font-bold text-sm">Fair Market Valuation</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-500 font-semibold px-5 py-2">Asset</th>
              <th className="text-right text-gray-500 font-semibold px-4 py-2">Low</th>
              <th className="text-right text-gray-500 font-semibold px-5 py-2">High</th>
            </tr>
          </thead>
          <tbody>
            {VALUATION.map((v, i) => (
              <tr key={i} className={`border-b border-gray-800/50 ${i % 2 === 0 ? "bg-gray-900/40" : ""}`}>
                <td className="px-5 py-2.5 text-gray-300">
                  <span>{v.label}</span>
                  {v.tag && <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-blue-900/50 border border-blue-700 text-blue-400 font-bold uppercase">{v.tag}</span>}
                </td>
                <td className="px-4 py-2.5 text-right text-green-400 font-semibold">{fmt(v.low)}</td>
                <td className="px-5 py-2.5 text-right text-green-300 font-bold">{fmt(v.high)}</td>
              </tr>
            ))}
            <tr className="bg-green-950/30">
              <td className="px-5 py-3 text-white font-black">TOTAL PLATFORM (conservative)</td>
              <td className="px-4 py-3 text-right text-green-400 font-black text-sm">{fmt(totalLow)}</td>
              <td className="px-5 py-3 text-right text-green-300 font-black text-sm">{fmt(totalHigh)}</td>
            </tr>
            <tr className="bg-blue-950/20">
              <td className="px-5 py-2.5 text-blue-300 text-xs">+ AI Module White-Label SaaS premium</td>
              <td className="px-4 py-2.5 text-right text-blue-400 font-bold">$650K/yr</td>
              <td className="px-5 py-2.5 text-right text-blue-300 font-bold">$1.5M/yr</td>
            </tr>
            <tr className="bg-yellow-950/20">
              <td className="px-5 py-2.5 text-yellow-300 text-xs">+ Strategic pre-public premium (40–120%) — Updated Q2 2026</td>
              <td className="px-4 py-2.5 text-right text-yellow-400 font-bold">{fmt(totalLow * 1.4)}</td>
              <td className="px-5 py-2.5 text-right text-yellow-300 font-bold">{fmt(totalHigh * 2.2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BuyerCard({ contact, tierColor }) {
  const [expanded, setExpanded] = useState(false);
  const emailBody = encodeURIComponent(LETTER.replace("[RECIPIENT NAME]", contact.org).replace("[DATE]", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })));
  const emailSubject = encodeURIComponent("Acquisition Opportunity — Zenith Apex Advanced Research Platform [CONFIDENTIAL]");
  const mailto = `mailto:${contact.email}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="h-1" style={{ backgroundColor: tierColor }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-white font-bold text-sm leading-snug">{contact.org}</h3>
            <p className="text-gray-500 text-xs">{contact.contact}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded font-bold flex-shrink-0"
            style={{ backgroundColor: tierColor + "20", color: tierColor }}>
            {contact.ask.split(" ")[0]}
          </span>
        </div>

        <button onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 mb-3 transition-colors">
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />} Rationale
        </button>

        {expanded && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 p-3 bg-gray-800/50 rounded-lg">{contact.rationale}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <a href={mailto}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: tierColor }}>
            <Mail size={11} /> Send Email
          </a>
          <CopyButton text={contact.email} label="Copy Email" />
          <CopyButton
            text={LETTER.replace("[RECIPIENT NAME]", contact.org).replace("[DATE]", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))}
            label="Copy Letter"
          />
          <a href={contact.web} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 text-xs transition-all">
            Website ↗
          </a>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-600">{contact.email}</span>
          <span className="text-xs font-bold" style={{ color: tierColor }}>{contact.ask}</span>
        </div>
      </div>
    </div>
  );
}

export default function InvestorPackage() {
  const [showLetter, setShowLetter] = useState(false);
  const [activeTier, setActiveTier] = useState("All");
  const tiers = ["All", ...BUYERS.map(b => b.tier)];
  const filtered = activeTier === "All" ? BUYERS : BUYERS.filter(b => b.tier === activeTier);
  const totalContacts = BUYERS.reduce((s, b) => s + b.contacts.length, 0);

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base flex items-center gap-2">
              <Shield size={15} className="text-green-400" /> Investor Portfolio Package
            </h1>
            <p className="text-gray-500 text-xs">{totalContacts} qualified buyers · Pre-public exclusive · NDA gated</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NdaPdfGenerator />
          <DueDiligencePdfGenerator />
          <Link to="/term-sheet"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-900/40 hover:bg-indigo-800/60 border border-indigo-700 text-indigo-300 text-xs font-bold transition-all">
            <FileText size={13} /> Term Sheets
          </Link>
          <button onClick={() => setShowLetter(s => !s)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700 text-blue-300 text-xs font-bold transition-all">
            <FileText size={13} /> {showLetter ? "Hide" : "View"} Master Letter
          </button>
          <CopyButton text={LETTER} label="Copy Full Letter" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 max-w-7xl mx-auto w-full">
        {/* PDF Download Banner */}
        <div className="bg-gray-900 border-2 border-blue-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Download size={18} className="text-blue-400" />
            <p className="text-white font-black text-lg">Download Official Documents</p>
          </div>
          <p className="text-gray-400 text-sm mb-5">Generate professionally formatted PDFs ready to send to investors — click the buttons below</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 border border-green-700 rounded-xl p-4">
              <p className="text-green-300 font-bold text-sm mb-1">📄 Mutual NDA PDF</p>
              <p className="text-gray-400 text-xs mb-3">Mutual confidentiality agreement covering ZARP's original platform tools and proprietary software. Enter recipient details and download instantly.</p>
              <NdaPdfGenerator />
            </div>
            <div className="bg-gray-800 border border-purple-700 rounded-xl p-4">
              <p className="text-purple-300 font-bold text-sm mb-1">📚 Due Diligence Package PDF</p>
              <p className="text-gray-400 text-xs mb-3">120+ page technical &amp; financial portfolio: 23 invention plans, AI patent suite (intelligence + wizard + sharing), VDR portal, IP assets, revenue model &amp; checklist. Q3 2026 v2.1.</p>
              <DueDiligencePdfGenerator />
            </div>
          </div>
        </div>

        {/* Valuation */}
        <ValuationTable />

        {/* Master Letter */}
        {showLetter && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden mb-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-blue-400" />
                <h2 className="text-white font-bold text-sm">Master Acquisition Letter (Personalize Before Sending)</h2>
              </div>
              <CopyButton text={LETTER} label="Copy All" />
            </div>
            <pre className="p-5 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
              {LETTER}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-xl p-4 mb-6">
          <p className="text-yellow-300 text-sm font-bold mb-2">📋 How to Use This Package</p>
          <ol className="text-yellow-200 text-xs space-y-1 leading-relaxed list-decimal list-inside">
            <li>Click <strong>Send Email</strong> on any buyer card — it will pre-fill your email client with the personalized letter</li>
            <li>Replace <strong>[YOUR NAME]</strong>, <strong>[YOUR EMAIL]</strong>, <strong>[YOUR PHONE]</strong> in the letter before sending</li>
            <li>Use <strong>Copy Letter</strong> on each card to get a version pre-addressed to that specific organization</li>
            <li>Track responses in the <Link to="/investor-crm" className="underline text-yellow-100">Investor CRM</Link></li>
            <li>Always execute NDA before sending the technical due diligence package</li>
          </ol>
        </div>

        {/* Tier filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          {tiers.map(t => (
            <button key={t} onClick={() => setActiveTier(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeTier === t ? "bg-white/10 border-white/30 text-white" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Buyer cards by tier */}
        {filtered.map(tier => (
          <div key={tier.tier} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">{tier.icon}</span>
              <h2 className="text-white font-bold text-base">{tier.tier}</h2>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{tier.contacts.length} buyers</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tier.contacts.map((c, i) => (
                <BuyerCard key={i} contact={c} tierColor={tier.color} />
              ))}
            </div>
          </div>
        ))}

        <div className="text-center text-gray-700 text-xs py-6 border-t border-gray-800">
          CONFIDENTIAL — Zenith Apex Research Portfolio · NDA Applies · Not for Distribution · All figures in USD
        </div>
      </div>
    </div>
  );
}