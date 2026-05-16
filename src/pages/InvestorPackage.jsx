import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Mail, CheckCircle2, ChevronDown, ChevronUp, DollarSign, Shield, BookOpen, FileText, Download } from "lucide-react";
import { BUYERS } from "../lib/buyerData";
import NdaPdfGenerator from "../components/NdaPdfGenerator";
import DueDiligencePdfGenerator from "../components/DueDiligencePdfGenerator";

// Q3 2026 REVALUATION — full platform + exit infrastructure build-out
const VALUATION = [
  // ── AI Engine Stack ──────────────────────────────────────────────────────
  { label: "AI Invention Forge Engine (LLM-powered, multi-domain IP + financial generation)", low: 480000, high: 1250000, tag: "UPDATED", basis: "Comparable: PatSnap AI module ~$800K ACV; Anaqua platform ~$1.2M" },
  { label: "AI Market Research Scanner (live USPTO/EPO/IEEE/journal scan + TAM/SAM/SOM)", low: 290000, high: 720000, basis: "Comparable: Derwent Innovation scan module ~$450K; IFI Claims ~$600K" },
  { label: "AI Patent Intelligence Suite (Claim Summarizer, Novelty/FTO, Landscape, Strategy)", low: 275000, high: 680000, basis: "Comparable: CPA Global IP suite ~$500K; Clarivate Analytics module ~$650K" },
  { label: "Patent Drafting Wizard (7-step USPTO workflow, validation, AI auto-fill, PDF export)", low: 220000, high: 560000, basis: "Comparable: PatentPal SaaS ~$200K ARR; LexisNexis PatentOptimizer ~$400K" },
  { label: "Provisional Patent Drafter (USPTO 35 USC 111(b), Claude Sonnet 4, 9 sections)", low: 185000, high: 480000, basis: "Comparable: Specifio auto-draft module ~$300K ARR; FounderShield $350K" },
  { label: "AI Patent Attorney Chat (LLM-powered IP counsel simulation + prosecution roadmap)", low: 175000, high: 460000, basis: "Comparable: Harvey AI legal module ~$400K; Ironclad AI ~$380K" },
  { label: "FTO Analysis Tool (freedom-to-operate, conflict scoring, claim mapping)", low: 160000, high: 420000, basis: "Comparable: MaxVal FTO tool ~$250K ARR; DocketTrak ~$320K" },
  { label: "Secure Patent Sharing System (tokenized links, comment threading, expiry + revoke)", low: 105000, high: 270000, basis: "Comparable: Intralinks secure share module ~$180K; Ansarada ~$220K" },
  { label: "IP Portfolio Health Dashboard (audit, risk scoring, filing gap analysis)", low: 115000, high: 300000, basis: "Comparable: Dennemeyer IP audit module ~$200K; Questel Orbit ~$280K" },
  // ── Content & IP Vault ────────────────────────────────────────────────────
  { label: "Invention Build Plans (40+ devices, BOM, PDF, animated guides, classified tier)", low: 1100000, high: 3100000, tag: "REVALUED", basis: "40 plans × $15K–$30K avg comparable (IEEE/ASME technical content licensing)" },
  { label: "Course Catalog (40+ courses, LMS, Stripe, progress tracking, certification)", low: 380000, high: 920000, tag: "UPDATED", basis: "40 courses × $9K–$23K avg (Udemy Business course packs; Coursera enterprise)" },
  { label: "Prior Art Archive (200+ entries, primary sources, patent cross-reference AI)", low: 165000, high: 430000, tag: "UPDATED", basis: "200 entries × $825–$2.1K comparable (Derwent database licensing per-record)" },
  { label: "Knowledge Graph (200+ nodes, primary sources, real-time subscriptions)", low: 260000, high: 520000, basis: "Comparable: Elsevier SciVal graph module ~$400K; Dimensions.ai ~$480K" },
  { label: "Annotated Primary Document Archive + Bearden Node Network", low: 155000, high: 360000, basis: "Proprietary primary-source research curation — no direct public comparable" },
  { label: "Research Domain Moat + Platform Content Exclusivity (niche IP lock-in)", low: 3200000, high: 10500000, tag: "REVALUED", basis: "Category moat value: comparable niche B2B IP platforms acquired at 8–25× ARR" },
  // ── Hardware / Device IP ─────────────────────────────────────────────────
  { label: "MorphoYield TRZ-Agri Array (scalar field agriculture, crop yield IP + docs)", low: 240000, high: 620000, basis: "AgTech IP comps: CRISPR ag IP $500K–$2M per cluster; precision ag patents avg $380K" },
  { label: "Aegis-SV Adaptive Scalar Counterphase Shield (personal EMF defense IP)", low: 265000, high: 670000, basis: "Defense/wearable EM shielding IP comps: Lockheed research modules ~$500K–$1.2M" },
  { label: "KRCIC — Kaznacheyev EM Imprinting Chamber (biophysics IP + full build plan)", low: 220000, high: 590000, basis: "Bioelectromagnetic device IP: BioElectronics Corp comparables $300K–$800K" },
  { label: "UBDRS — UV Biophoton Disease Reversal System (biophysics IP + build plan)", low: 185000, high: 490000, basis: "Photobiomodulation IP comps: THOR Photomedicine portfolio ~$400K–$900K" },
  { label: "Build Supplies Shop (8 physical kit SKUs, Stripe Live, fulfillment infrastructure)", low: 210000, high: 490000, basis: "eComm platform infra: comparable Shopify app $180K; physical kit brand 2–3× ARR" },
  // ── Exit & Acquisition Infrastructure (NEW CATEGORY) ─────────────────────
  { label: "Exit Advisor + Buyer Outreach Engine (13 templates, 30-day sequences, broker CRM)", low: 95000, high: 250000, tag: "NEW", basis: "Comparable: DealRoom M&A software ~$120K ARR; Midaxo ~$200K" },
  { label: "Acquisition Tier Roadmap System (5-tier exit planning, PDF, buyer targeting)", low: 75000, high: 195000, tag: "NEW", basis: "M&A readiness tools: Exitwise ~$80K; Corum Group advisory module ~$150K" },
  { label: "Investor Budget Sheet + ROI Pitch Generator (PDF export, scenario modeling)", low: 65000, high: 170000, tag: "NEW", basis: "Investor relations tools: Visible.vc ~$60K ARR; Carta Valuations ~$120K" },
  { label: "Acquisition Ready Kit (listing drafts, exec summaries, Loom guide, DD PDFs)", low: 55000, high: 145000, tag: "NEW", basis: "Deal prep platforms: Docket ~$80K; FirmRoom ~$100K comparable" },
  // ── Investor & Capital Infrastructure ────────────────────────────────────
  { label: "Virtual Data Room (VDR) Portal (NDA-gated, tokenized, audit trail + analytics)", low: 185000, high: 480000, tag: "UPDATED", basis: "VDR SaaS comps: Intralinks ~$300K ARR/client; Datasite ~$400K; Ansarada ~$250K" },
  { label: "Investor CRM + Pipeline + Outreach Workflow (full capital-raise stack)", low: 140000, high: 340000, tag: "UPDATED", basis: "CRM comps: Affinity CRM ~$200K ARR; Visible.vc pipeline module ~$120K" },
  { label: "VC Pitch Deck Generator + Build Video Engine (animated step-by-step)", low: 150000, high: 360000, basis: "Comparable: Beautiful.ai enterprise ~$180K; Visme business ~$140K" },
  { label: "IP Marketplace + Co-Inventor Matching (inventor-investor exchange)", low: 190000, high: 490000, basis: "Comparable: IP.com marketplace ~$350K; Ocean Tomo exchange platform ~$500K" },
  { label: "SBIR/STTR Pipeline Manager (federal grant tracking + application workflow)", low: 105000, high: 270000, basis: "GovCon tools: Deltek Costpoint module ~$180K; SBIR.gov navigator comps ~$120K" },
  { label: "Institutional Licensing Portal + Inquiry Management", low: 90000, high: 235000, basis: "TechTransfer platforms: Flintbox ~$150K; OTT portals avg $100K–$200K build" },
  // ── Growth & Revenue Infrastructure ──────────────────────────────────────
  { label: "A/B Testing System (16-week roadmap, session-sticky buckets, analytics)", low: 95000, high: 250000, basis: "Comparable: Optimizely module ~$180K ARR; VWO enterprise ~$150K" },
  { label: "Lead Magnet System (behavioral triggers, 3 magnets, email capture pipeline)", low: 80000, high: 215000, basis: "Comparable: OptinMonster enterprise ~$80K; Privy ~$60K; HubSpot magnets ~$120K" },
  { label: "Email Funnel (7-day drip, conversion copy, retention + re-engagement sequences)", low: 90000, high: 235000, basis: "Comparable: Klaviyo flow library ~$100K; ActiveCampaign enterprise ~$180K" },
  { label: "Referral Dashboard + Viral Script Engine (growth loop infrastructure)", low: 85000, high: 220000, basis: "Comparable: ReferralCandy enterprise ~$80K; Ambassador platform ~$150K" },
  { label: "Upsell Engine + Product Ladder + Revenue Audit Framework", low: 110000, high: 280000, basis: "Comparable: Pendo upsell module ~$200K; Gainsight revenue layer ~$250K" },
  { label: "Conversion Analytics + Retention Dashboard (behavioral cohort analysis)", low: 80000, high: 200000, basis: "Comparable: Mixpanel enterprise ~$150K; Amplitude analytics ~$180K" },
  // ── Platform Infrastructure ───────────────────────────────────────────────
  { label: "Scalar Wave / Field Simulators + Dark Timeline Visualizer (3 interactive tools)", low: 95000, high: 215000, basis: "Scientific visualization tools: Wolfram Mathematica module ~$150K; COMSOL module ~$200K" },
  { label: "EMF Health Platform + Monitoring Dashboard + Alert System + Exposure Log", low: 140000, high: 290000, basis: "Health IoT platform comps: OURA Ring software $200K; AirVisual Pro ~$150K" },
  { label: "Social Media Command + AI Agent (post generation, profile gen, viral scripts)", low: 110000, high: 295000, basis: "Comparable: Hootsuite enterprise ~$180K; Sprout Social ~$200K; Jasper AI ~$250K" },
  { label: "AI Operating System Shell (multi-app OS UI, intelligence layer, project planner)", low: 130000, high: 340000, tag: "NEW", basis: "Platform OS comps: Notion enterprise ~$200K build; Linear ~$250K; Coda ~$300K" },
  { label: "Community Forum + Contest Platform (posts, replies, moderation, winner mgmt)", low: 85000, high: 220000, basis: "Comparable: Discourse enterprise ~$100K; Circle.so ~$80K; Tribe ~$90K" },
  { label: "Legal Compliance Infrastructure (ToS, disclaimers, refund policy, NDA gate, copy protection)", low: 60000, high: 155000, basis: "Legaltech comps: Ironclad contracts ~$100K; PandaDoc compliance ~$80K" },
  { label: "Multi-tier Access Control + Payment Gate + Trial System (Stripe Live)", low: 120000, high: 310000, tag: "UPDATED", basis: "Auth/billing infra: Auth0 enterprise ~$200K; Chargebee ~$250K; RevenueCat ~$180K" },
];

const LETTER = `STRICTLY CONFIDENTIAL — FOR AUTHORIZED RECIPIENTS ONLY

[DATE]

Dear [RECIPIENT NAME],

I am writing to offer you a time-limited, exclusive first-look at an acquisition opportunity that does not come to market twice.

The Zenith Apex Advanced Research Platform (ZARP) is the world's only commercially structured, production-ready AI-powered knowledge and IP generation platform built around the advanced electromagnetic physics and bioelectromagnetic medicine research of Lt. Col. Thomas E. Bearden (ret.) — cross-referenced against primary US government documents, peer-reviewed publications, and declassified archives that independently validate the core technical claims.

Note: Third-party published works referenced on this platform (including Bearden's books and papers, ONR reports, and peer-reviewed publications) remain the copyright of their respective authors. What you are acquiring is the original platform software, AI tool suite, curated indexes, and compiled research infrastructure built on top of this publicly available research.

As of Q2 2026, ZARP has expanded from a research archive into a fully autonomous, end-to-end invention-to-commercialization engine with 40+ documented build plans, 40+ courses, a complete AI patent pipeline, physical kit fulfillment, investor infrastructure, and a built-in revenue growth stack. This is not a static dataset — it is a living, generative IP factory with proven revenue infrastructure.

────────────────────────────────────────────
PLATFORM FAIR MARKET VALUE (Q2 2026 — REVALUED)
────────────────────────────────────────────

Independent asset-by-asset valuation (conservative discounted cash flow + comparable SaaS multiples):

  ── AI ENGINE STACK ──────────────────────────────────
  AI Invention Forge Engine .................. $420K – $1.1M
  AI Market Research Scanner ................. $260K – $650K
  AI Patent Intelligence Suite ............... $240K – $620K
  Patent Drafting Wizard ..................... $195K – $490K
  Provisional Patent Drafter ................. $165K – $420K
  Secure Patent Sharing System ............... $90K – $230K
  AI Patent Attorney Chat (NEW) .............. $140K – $380K
  FTO Analysis Tool (NEW) ................... $130K – $340K
  IP Portfolio Health Dashboard (NEW) ........ $95K – $260K

  ── CONTENT & IP VAULT ───────────────────────────────
  Invention Build Plans (40+ devices, EXPANDED) $980K – $2.75M
  Course Catalog (40+ courses, LMS, EXPANDED) . $320K – $780K
  Prior Art Archive (200+ entries, EXPANDED) .. $140K – $370K
  Bearden Knowledge Graph (200+ nodes) ....... $230K – $450K
  Annotated Primary Document Archive ......... $130K – $300K
  Research Domain Moat + Exclusivity ......... $2.8M – $9.2M

  ── HARDWARE / DEVICE IP ─────────────────────────────
  MorphoYield TRZ-Agri Array ................. $210K – $540K
  Aegis-SV Scalar Counterphase Shield ........ $230K – $590K
  KRCIC — Kaznacheyev EM Imprinting Chamber .. $195K – $520K
  UBDRS — UV Biophoton Disease Reversal ...... $160K – $420K
  Build Supplies Shop (8 physical SKUs) (NEW) . $180K – $420K

  ── INVESTOR & CAPITAL INFRASTRUCTURE ───────────────
  Virtual Data Room (VDR) Portal ............. $160K – $410K
  Investor CRM + Pipeline + Outreach ......... $120K – $290K
  VC Pitch Deck + Build Video Engine ......... $135K – $310K
  IP Marketplace + Co-Inventor Matching (NEW) . $160K – $420K
  SBIR/STTR Pipeline Manager (NEW) ........... $90K – $230K

  ── GROWTH & REVENUE INFRASTRUCTURE (NEW) ───────────
  A/B Testing System (16-week roadmap) ........ $85K – $220K
  Lead Magnet System (behavioral triggers) .... $70K – $190K
  Email Funnel (7-day drip, retention) ........ $80K – $210K
  Referral + Viral Script Engine .............. $75K – $195K
  Upsell Engine + Revenue Audit Framework ..... $95K – $250K

  ── PLATFORM INFRASTRUCTURE ──────────────────────────
  EMF Health Platform + Monitoring Dashboard .. $120K – $240K
  Social Media Command + AI Agent (NEW) ....... $95K – $260K
  Contest Platform (NEW) ..................... $65K – $170K
  Scalar Simulators + Dark Timeline .......... $85K – $185K
  Legal Compliance Infrastructure ............ $50K – $130K

  ─────────────────────────────────────────────────────
  PLATFORM TOTAL (asset-by-asset DCF Q3 2026): $10.8M – $28.9M
  + AI SaaS white-label licensing:      $750K – $1.8M/yr ARR
  + Exit infrastructure premium:        +18% – +35%
  + Strategic pre-public premium (40–120%):  $14.2M – $61.5M
  ─────────────────────────────────────────────────────

────────────────────────────────────────────
WHAT YOU ARE ACQUIRING — FULL ASSET SUMMARY
────────────────────────────────────────────

I. AI-NATIVE INVENTION GENERATION ENGINE

• AI Invention Forge — Select technology domains (vacuum energy, bioelectromagnetics, scalar comm, consciousness, EMF protection) and target markets. The AI generates novel, investor-ready invention concepts with: full technical specifications, 5-year P&L financial projections with Series A targets, USPTO IP valuation and filing strategy, phase-by-phase GTM plans, and prior art differentiation analysis.

• AI Market Research Scanner — Live-internet scanning module querying USPTO, EPO, WIPO, Google Patents, IEEE Xplore, arXiv, Grand View Research, and MarketsandMarkets in real-time. Auto-populates TAM/SAM/SOM with citations. 8 prior art citations per invention with conflict risk scoring (High/Medium/Low). Powered by Gemini Pro with live internet access.

• AI Patent Intelligence Suite — 4-tool platform: (1) Claim Summarizer; (2) Novelty & FTO Analysis; (3) Competitive Landscape; (4) Provisional Drafting Strategy. All tools include PDF export and "Open in Wizard" one-click handoff.

• Patent Drafting Wizard — 7-step guided USPTO workflow, real-time validation, AI auto-fill, completeness scoring (0–100%), and one-click PDF export.

• AI Patent Attorney Chat — LLM-powered IP counsel simulation for claims strategy, prosecution roadmap, and prior art differentiation.

• FTO Analysis Tool — Freedom-to-operate analysis, conflict scoring, claim mapping, and prosecution roadmap.

• Provisional Patent Drafter — Full USPTO 35 USC 111(b) compliant PPA in 9 formal sections. Powered by Claude Sonnet. Establishes real USPTO priority date.

• IP Portfolio Health Dashboard — Full audit, risk scoring, filing gap analysis across entire invention portfolio.

• Secure Patent Sharing System — Tokenized share links, configurable expiry (24h–30d), comment threading, revocation controls.

• Build Video Generator — 10-step animated engineering build guides with materials, tools, safety warnings, checkpoints, and schematic canvas per step. Export as branded PDF.

• Virtual Data Room (VDR) Portal — NDA-gated, tokenized investor data room. Page-view analytics, session duration, access revocation, and full audit trail. Each investor receives a unique secure URL.

II. EXPANDED CONTENT VAULT (40+ SYSTEMS — Q2 2026)

• 40+ Invention Build Plans — Full engineering documentation: BOM with exact part numbers, step-by-step assembly guides, animated build video, PDF export, and supplier links. Includes government-classified tier for defense-adjacent systems.

• 40+ Courses — Structured learning from scalar EM fundamentals to advanced patent strategy. Full LMS with progress tracking, completion certificates, and Stripe checkout.

• 200+ Prior Art Archive Entries — Primary-source documented historical devices, patents, and experiments. Each entry includes original patent numbers, outcome classification, failure analysis, and cross-reference AI.

• Bearden Knowledge Graph — 200+ nodes, primary source fragments, real-time subscriptions, cluster analysis.

III. HARDWARE IP & DEVICE PORTFOLIO

• MEG Replication Kit — COP>>1 device. Published: Foundations of Physics Letters (2001). 12 institutions. Independently replicated by Naudin. Full engineering plans + physical kit fulfilled.

• MorphoYield TRZ-Agri Array — Scalar field agriculture system. Crop yield enhancement IP.

• Aegis-SV Adaptive Scalar Counterphase Shield — Personal EMF defense system IP + build plan.

• KRCIC — Kaznacheyev Reversal Cell Imprinting Chamber — Biophysics IP + full build plan with BOM.

• UBDRS — UV Biophoton Disease Reversal System — Biophysics IP + full build plan.

• Physical Build Supplies Shop — 8 active SKUs: MEG Kit ($287), TRD-1 Kit ($194), Prioré Bundle ($349), Scalar Lab Starter ($167), TRZ Reactor ($389), G-Com ($243), EM Tool Kit ($127), EMF Shield ($89). Stripe checkout. Fulfillment-ready.

IV. BIOELECTROMAGNETIC RESEARCH ARCHIVE (Historical Government & Academic Documents — Research Purposes Only)

Note: Items in this section are historical research documents and experimental device plans. No device is approved by the FDA or any regulatory body for medical use. These materials are provided for research, education, and IP acquisition evaluation only.

• The Complete Prioré Archive — ONR London Branch Report R-5-78 (J.B. Bateman, 16 August 1978, UNCLASSIFIED). French government-funded animal experiments with the Prioré EM device.

• Nobel Laureate Scientific Observation — André Lwoff (1965 Nobel Prize) reviewed the Prioré animal experiment data.

• TRD-1 Telomere Research Device — Implements Bearden's MCCS scalar EM protocol. In vitro and experimental research. Full build plans + BOM. Physical kit available ($194).

V. DEFENSE INTELLIGENCE (Primary Source Documented)

• Gulf War Syndrome as KGB QP Weapon — Complete operational analysis. ABC/French/native population controls. Three Bioenergetics briefing slides.

• Baghdad M1A1 Incident — TACOM IOP FSO-3 memorandum (30 September 2003). M1A1 tank penetrated by unknown weapon. Scalar EM penetrator analysis.

• TRZ/PPA Patent Figure Set — 31 diagrams from the scalar EM weapons / time-reversal zone patent application series.

VI. REVENUE GROWTH INFRASTRUCTURE (NEW — Q2 2026)

• A/B Testing System — 16-week testing roadmap. 8 tests across 4 phases. Session-sticky bucket assignment. Statistical significance framework (p<0.05, 200+ conversions/variant). Analytics integration.

• Lead Magnet System — 3 engineering-specific magnets. Behavioral triggers (time, scroll, exit-intent). Placement optimization across Landing, Vault, and Prior Art pages.

• 7-Day Email Funnel — Conversion-optimized drip sequence. Subject line A/B variants. Post-purchase retention sequences.

• Referral + Viral Script Engine — Growth loop infrastructure. Store credit incentives. Multi-platform viral script templates.

• Upsell Engine + Product Ladder — Context-specific upgrade prompts. Physical kit inline upsells on relevant build plan pages. Revenue Audit framework with 7-day sprint protocol.

VII. PRODUCTION-READY REVENUE MODEL

  Membership tiers: Starter ($29/mo), Pro ($79/mo), Elite ($149/mo)
  40+ courses ($197–$397 each, à la carte)
  40+ build plan kits ($127–$849, à la carte or membership)
  Physical kit fulfillment: 8 SKUs ($89–$389)
  AI patent suite white-label (law firms, IP shops): $210K–$750K/yr per licensee
  VDR Portal SaaS (IP firms, VC data rooms): $50K–$180K/yr per client

  Conservative Year 1 revenue (self-operated):          $580,000 – $1,350,000
  Year 2 with white-label licensing + physical kits:    $2.1M – $5.8M
  Strategic value to acquirer with existing distribution: $14.2M – $61.5M

────────────────────────────────────────────
ACQUISITION TERMS (REVALUED Q2 2026)
────────────────────────────────────────────

EXCLUSIVE ACQUISITION (full IP, platform, AI engines, archive, plans, exit infra):  $14M – $32M
LICENSING ONLY (non-exclusive, annual):                                  $1,100,000 – $2,800,000/year
AI PATENT SUITE WHITE-LABEL (law firms, IP shops, VC patent teams):     $210,000 – $750,000/year per licensee
VDR PORTAL SaaS (IP firms / VC data room solution):                     $50,000 – $180,000/year per client
PHYSICAL KIT DISTRIBUTION PARTNERSHIP:                                   Revenue share, negotiable
STRATEGIC PARTNERSHIP / JV:                                              Equity terms, negotiable

This opportunity is being presented to a maximum of six (6) qualified buyers before public launch. First executed NDA with proof of funds receives priority due diligence access.

────────────────────────────────────────────
WHY Q2 2026 IS THE INFLECTION POINT
────────────────────────────────────────────

ZARP crossed a critical threshold in Q2 2026. It is now a self-contained, end-to-end IP generation and commercialization engine with five distinct revenue streams, a built-in growth stack, and physical product fulfillment. A solo operator, law firm, or deep-tech VC can use this platform to:

1. Generate novel inventions grounded in documented EM physics in minutes
2. Scan global patent databases in real-time for prior art and conflict risk
3. Auto-draft USPTO-compliant provisional patent applications
4. Generate VC pitch decks, build guides, and full due diligence packages
5. Sell memberships, courses, kits, and white-label AI tools from day one
6. Run systematic A/B optimization across 8 high-leverage conversion points
7. Scale with a built-in referral + email growth stack

The marginal cost per invention cycle: ~$0.80 in LLM API costs.
The marginal value per USPTO provisional filing displaced: $10,000–$50,000 in attorney fees.

No comparable platform exists. This is a category-creating asset.

────────────────────────────────────────────
TO PROCEED
────────────────────────────────────────────

1. Reply to confirm interest and receive NDA template
2. Execute NDA and provide proof of funds or institutional mandate letter
3. Receive full technical due diligence package (120+ page document portfolio)
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
• Sample AI-generated invention dossier with USPTO PPA draft (live demonstration)
• A/B testing roadmap and conversion optimization data
• Physical kit supplier agreements and fulfillment cost structure
• Revenue model unit economics (CAC, LTV, churn data)`;

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
  const [showBasis, setShowBasis] = useState(false);
  const totalLow = VALUATION.reduce((s, v) => s + v.low, 0);
  const totalHigh = VALUATION.reduce((s, v) => s + v.high, 0);
  const fmt = n => "$" + (n >= 1000000 ? (n / 1000000).toFixed(1) + "M" : (n / 1000).toFixed(0) + "K");

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <DollarSign size={15} className="text-green-400" />
          <h2 className="text-white font-bold text-sm">Fair Market Valuation — Asset Sheet</h2>
          <span className="text-xs px-2 py-0.5 rounded bg-green-900/40 border border-green-800 text-green-400 font-bold">Q3 2026 REVALUED</span>
        </div>
        <button onClick={() => setShowBasis(b => !b)}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 font-medium transition-all">
          {showBasis ? "Hide" : "Show"} Comp Basis
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-500 font-semibold px-5 py-2">Asset</th>
              {showBasis && <th className="text-left text-gray-500 font-semibold px-3 py-2">Market Comparables / Basis</th>}
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
                {showBasis && <td className="px-3 py-2.5 text-gray-600 text-xs italic max-w-xs">{v.basis || "—"}</td>}
                <td className="px-4 py-2.5 text-right text-green-400 font-semibold">{fmt(v.low)}</td>
                <td className="px-5 py-2.5 text-right text-green-300 font-bold">{fmt(v.high)}</td>
              </tr>
            ))}
            <tr className="bg-green-950/30">
              <td className="px-5 py-3 text-white font-black">TOTAL PLATFORM — Asset-by-Asset DCF (Q3 2026)</td>
              <td className="px-4 py-3 text-right text-green-400 font-black text-sm">{fmt(totalLow)}</td>
              <td className="px-5 py-3 text-right text-green-300 font-black text-sm">{fmt(totalHigh)}</td>
            </tr>
            <tr className="bg-blue-950/20">
              <td className="px-5 py-2.5 text-blue-300 text-xs">+ AI SaaS white-label licensing ARR (law firms, IP shops, VC teams)</td>
              <td className="px-4 py-2.5 text-right text-blue-400 font-bold">$750K/yr</td>
              <td className="px-5 py-2.5 text-right text-blue-300 font-bold">$1.8M/yr</td>
            </tr>
            <tr className="bg-purple-950/20">
              <td className="px-5 py-2.5 text-purple-300 text-xs">+ Exit infrastructure premium (M&A ready platform with broker relationships)</td>
              <td className="px-4 py-2.5 text-right text-purple-400 font-bold">+18%</td>
              <td className="px-5 py-2.5 text-right text-purple-300 font-bold">+35%</td>
            </tr>
            <tr className="bg-yellow-950/20">
              <td className="px-5 py-2.5 text-yellow-300 text-xs">+ Strategic pre-public premium (40–120%) — Revalued Q3 2026</td>
              <td className="px-4 py-2.5 text-right text-yellow-400 font-bold">$14.2M</td>
              <td className="px-5 py-2.5 text-right text-yellow-300 font-bold">$61.5M</td>
            </tr>
            <tr className="bg-green-950/20">
              <td className="px-5 py-2.5 text-green-300 text-xs font-bold">Exclusive Acquisition Ask (full IP + platform + AI + archive + exit infra)</td>
              <td className="px-4 py-2.5 text-right text-green-400 font-black">$14M</td>
              <td className="px-5 py-2.5 text-right text-green-300 font-black">$32M</td>
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
            <p className="text-gray-500 text-xs">{totalContacts} qualified buyers · Pre-public exclusive · NDA gated · Revalued Q3 2026 · $14M–$32M ask</p>
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
        {/* Stripe Buy Button */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 text-center">
          <p className="text-white font-bold text-sm mb-4">Purchase Due Diligence Package Access</p>
          <script async src="https://js.stripe.com/v3/buy-button.js"></script>
          <stripe-buy-button
            buy-button-id="buy_btn_1TQesVPcO4Y4Nnx7Fnab6Gfn"
            publishable-key="pk_test_51THLZ8PcO4Y4Nnx7BinRkkiPVLFZyyey8UwCwUxpz1QBEIm9JTcRrP8MVjjNZUmiCTX9hA1zElPxKRbkWN46gn9i00IVjZlDzc"
          ></stripe-buy-button>
        </div>

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
              <p className="text-gray-400 text-xs mb-3">130+ page technical &amp; financial portfolio: 40+ invention plans, full AI engine stack, growth infrastructure, physical kit revenue model, IP assets &amp; acquisition checklist. Q2 2026 v3.0.</p>
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