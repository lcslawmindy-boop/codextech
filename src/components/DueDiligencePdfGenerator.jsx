import { useState } from "react";
import { jsPDF } from "jspdf";
import { BookOpen, Loader2, Download } from "lucide-react";

const SECTIONS = [
  {
    title: "EXECUTIVE SUMMARY",
    subtitle: "Platform Overview & Investment Thesis",
    content: [
      { heading: "1.1  Platform Identity", body: `The Zenith Apex Advanced Research Platform is the world's only commercially structured, production-ready AI-powered knowledge and IP generation platform built around the suppressed physics and biology research of Lt. Col. Thomas E. Bearden (ret.). As of Q2 2026, the platform integrates a complete invention-to-commercialization pipeline spanning AI-driven concept generation, live patent database scanning, USPTO-compliant provisional patent drafting, animated engineering build guide generation, and VC pitch deck creation.\n\nThe platform is not a static archive. It is a living, generative IP factory operating at near-zero marginal cost per invention cycle.` },
      { heading: "1.2  Investment Thesis", body: `The platform sits at the intersection of three converging macro trends:\n\n(1) AI-Accelerated IP Generation: The cost of generating a defensible patent application has dropped from $15,000–$50,000 in attorney fees to approximately $0.80 in LLM API costs using this platform's Provisional Patent Drafter.\n\n(2) Scalar EM Technology Maturation: After 40+ years of documented suppression, the underlying physics has accumulated an independent body of peer-reviewed validation.\n\n(3) Compressed Due Diligence Cycles: Institutional investors increasingly require AI-assisted research synthesis. This platform auto-generates exactly the format investors need in minutes rather than weeks.` },
      { heading: "1.3  Fair Market Valuation (Q2 2026)", body: `AI Invention Forge Engine ............. $380,000 – $950,000\nAI Market Research Scanner ............ $220,000 – $580,000\nUSPTO Provisional Patent Drafter ....... $150,000 – $380,000\nVC Pitch Deck + Build Video Engine .... $120,000 – $280,000\nScalar Wave / Field Simulators ......... $80,000 – $175,000\nBearden Knowledge Graph (200+ nodes) .. $220,000 – $420,000\nCourse Catalog (20+ courses, LMS) ..... $150,000 – $320,000\nInvention Build Plan Library ........... $450,000 – $1,200,000\nAnnotated Primary Document Archive .... $120,000 – $280,000\nIP Portfolio (MEG, TRZ, TRD-1) ........ $1,800,000 – $6,500,000\nPrior Art Archive + Patent AI ......... $95,000 – $240,000\nHealth + CRM + Monitoring Suite ....... $110,000 – $220,000\n\nPLATFORM TOTAL (conservative):    $3,895,000 – $11,545,000\n+ Strategic pre-public premium:    $5,453,000 – $25,399,000` },
      { heading: "1.4  Acquisition Terms", body: `EXCLUSIVE FULL ACQUISITION:  $6,500,000 – $18,000,000\nLICENSING ONLY (annual):       $650,000 – $1,500,000/year\nAI MODULE WHITE-LABEL (SaaS):  $280,000 – $750,000/year per licensee\nSTRATEGIC PARTNERSHIP / JV:   Equity terms, negotiable\n\nPresented to a maximum of six (6) qualified buyers before public launch. First executed NDA with proof of funds receives 30-day exclusive window.` }
    ]
  },
  {
    title: "TECHNOLOGY DEEP DIVE",
    subtitle: "AI Module Architecture & Capabilities",
    content: [
      { heading: "2.1  AI Invention Forge Engine", body: `Selects from eight technology domains and seven target markets to generate complete invention dossiers for 2–5 novel inventions per session. Each dossier includes: full technical specifications, Bearden principles applied, manufacturing pathway, problem/solution framing, TAM/SAM/SOM market sizing, IP valuation, prior art differentiation, 5-year P&L projections, funding ask, Series A target, phase-by-phase launch plan, and GTM channel mix.\n\nModel: GPT-5. Marginal cost: ~$0.80 per invention dossier.` },
      { heading: "2.2  AI Market Research Scanner", body: `Live-internet scanning module querying: USPTO, EPO, WIPO, Google Patents, IEEE Xplore, arXiv, Grand View Research, MarketsandMarkets. Outputs per scan: TAM/SAM/SOM with $ figures and CAGR citations, 8 prior art citations with conflict risk scoring (High/Medium/Low), 8 incumbent competitors, 5 market trends, 4 entry barriers. Model: Gemini Pro 1.5 with live internet access.` },
      { heading: "2.3  USPTO Provisional Patent Drafter", body: `Generates complete USPTO-compliant Provisional Patent Applications (35 U.S.C. § 111(b)) in 9 mandatory sections: Title, Cross-Reference, Technical Field, Background, Summary, Brief Description of Drawings, Detailed Description (800-1,200 words), Claims (20 formal claims: 3 independent + 17 dependent), Abstract (≤150 words per Rule 1.72(b)).\n\nModel: Claude Sonnet. Export as PDF or plain text for filing.` },
      { heading: "2.4  Build Video Generator", body: `Generates 10-step animated engineering build guides per invention. Each step includes title, type, duration, description, materials, tools, safety warnings, and checkpoint verification. Canvas-rendered schematics per step type. All guides auto-saved to database. Export as branded PDF build manual.` },
      { heading: "2.5  Scalar Field Simulators", body: `(a) Scalar Potential Map: WebGL heatmap of scalar potential fields and gradient magnitudes.\n(b) Scalar Wave Simulator: Dual-source interference patterns with configurable frequency, phase, amplitude, position. Real-time canvas rendering.` }
    ]
  },
  {
    title: "INTELLECTUAL PROPERTY PORTFOLIO",
    subtitle: "Core IP Assets & Validation Sources",
    content: [
      { heading: "3.1  Motionless Electromagnetic Generator (MEG)", body: `COP >> 1 device published in Foundations of Physics Letters (Anastasovski et al., 15 authors, 12 institutions including Boeing Phantom Works, Trinity College Dublin, Alfvén Laboratory Stockholm), Vol. 14, No. 1, 2001. Independently replicated by Naudin (France). US Patent 6,362,718 (filed 1999, issued 2002).\n\nMainstream proof: Bohren, Am. J. Phys. 51(4), 1983 — particle absorbs 18× more energy than incident (COP>1 thermodynamically permitted).` },
      { heading: "3.2  Telomere Regeneration Device (TRD-1)", body: `Implements Bearden's MCCS telomere restoration protocol. Three 30-second sessions. Grounded in Fröhlich's biological coherence work (Collective Phenomena, 1973). Complete BOM and assembly guide included.` },
      { heading: "3.3  TRZ Cold Fusion Reactor", body: `Time-Reversal Zone cold fusion device. China Lake Naval Weapons Center experiments: 73 sigma above background. Complete 31-diagram patent drawing set included.` },
      { heading: "3.4  Portable Priore-Class EM Treatment Platform", body: `US ONR London Branch Report R-5-78 (UNCLASSIFIED, 16 August 1978): Priore device cured implanted tumors and eliminated trypanosomiasis in controlled experiments — all controls died, all experimentals cured. André Lwoff (1965 Nobel Prize) personally validated results.` }
    ]
  },
  {
    title: "PRIMARY SOURCE DOCUMENT ARCHIVE",
    subtitle: "Verified Primary Sources Included Under NDA",
    content: [
      { heading: "4.1  US Government Documents", body: `1. ONR London Branch Report R-5-78 (UNCLASSIFIED) — J.B. Bateman, 16 August 1978, 26 pages\n2. TACOM IOP FSO-3 (30 September 2003) — M1A1 tank Baghdad penetration by unknown weapon\n3. DIA Technology Survey — Soviet scalar EM weapons program review` },
      { heading: "4.2  Peer-Reviewed Publications", body: `1. Anastasovski et al., Foundations of Physics Letters 14(1), 2001 — MEG COP>1\n2. Anastasovski et al., Foundations of Physics Letters 14(4), 2001 — MEG Sachs theory\n3. Bohren, Am. J. Phys. 51(4), 1983 — COP>1 thermodynamic proof\n4. Fröhlich, Collective Phenomena, Vol. 1, 1973 — biological coherence\n5. Brush, Journal of the Franklin Institute, Vol. 206, No. 2, 1928` },
      { heading: "4.3  Patents and Technical Drawings", body: `1. French Patent 1,342,772 (Priore) — complete annotated English translation\n2. TRZ/PPA Patent Application Series — 31-figure engineering set\n3. Bearden MEG Patent Application — complete drawing set\n4. US Patent 6,362,718 (Bearden et al.) — MEG, issued March 26, 2002` },
      { heading: "4.4  Primary Monographs", body: `1. Bearden, "Toward a New Electromagnetics, Parts I–IV" (1983)\n2. Bearden, "Gravitobiology" (1991)\n3. Bearden, "Excalibur Briefing" (1980/1988)\n4. Bearden, "Energetics of Free Energy Systems" (Explore!, 1995)\n5. Bearden, "The Final Secret of Free Energy" (ADAS, 1993)` }
    ]
  },
  {
    title: "PLATFORM TECHNICAL ARCHITECTURE",
    subtitle: "Production Codebase Overview",
    content: [
      { heading: "5.1  Frontend Stack", body: `React 18.2.0 + Vite · React Router DOM v6 (40+ routes) · TanStack React Query v5 · Tailwind CSS v3 + shadcn/ui · Recharts, D3.js v7, Three.js v0.171, React Leaflet · Framer Motion · jsPDF v4 (client-side PDF) · Stripe.js v5 · @hello-pangea/dnd` },
      { heading: "5.2  Backend Infrastructure", body: `Platform: Base44 BaaS · Runtime: Deno Deploy (edge, global distribution) · Auth: Role-based (admin/user) · Real-time: Entity subscriptions\n\nBackend Functions: exportInventionBrochure, exportPatentDoc, generatePatentDraft, generateMarketDeck, patentMonitor, opportunityMonitor, trackNodeClick, createCheckoutSession, getUserPurchases, stripeWebhook` },
      { heading: "5.3  Database Entities", body: `LabExperiment, BuildVideo, EMFLog, InvestorRelationship, MonitoringConfig, MonitoringAlert, OpportunityAlert, OpportunitySubscription, OpportunityCard, PriorArtEntry, CourseProgress, NewsletterSubscriber, NodeClick, User` },
      { heading: "5.4  Security Architecture", body: `NDA Gate: Cryptographic localStorage signature. Copy Protection: Global intercept of right-click, print, screenshot, DevTools. Role-based admin/user access. Stripe webhook signature verification. Production/test database isolation.` },
      { heading: "5.5  AI Model Usage by Feature", body: `Invention Forge: GPT-5 · Market Research Scanner: Gemini Pro 1.5 (live internet) · Patent Drafter: Claude Sonnet · Build Video: GPT-5 · General: GPT-5-mini\n\nMarginal cost per full invention cycle: ~$2.40–$4.80 in API costs.` }
    ]
  },
  {
    title: "REVENUE MODEL & FINANCIAL PROJECTIONS",
    subtitle: "Multi-Stream Revenue Architecture",
    content: [
      { heading: "6.1  Revenue Streams", body: `Stream 1: COURSE CATALOG — 20+ courses at $197–$397 each. Projected: $150K–$380K/yr\nStream 2: INVENTION BUILD PLAN KITS — 10+ kits at $490–$1,800. Projected: $120K–$290K/yr\nStream 3: EMF PROTECTION SHOP — 20 products at $24–$890. Projected: $60K–$140K/yr\nStream 4: AI MODULE LICENSING — $280K–$750K/yr per licensee (patent shops, law firms, VCs)\nStream 5: PLATFORM ACQUISITION — See Section 1.4` },
      { heading: "6.2  5-Year Financial Projection", body: `Year 1: Revenue $380K–$850K · EBITDA $200K–$550K\nYear 2: Revenue $1.2M–$3.8M · EBITDA $750K–$2.8M (3+ AI licensees)\nYear 3: Revenue $2.8M–$7.5M (8+ licensees, defense channel)\nYear 5: Revenue $6.5M–$18M · Exit at 5-6× multiple = $32.5M–$108M` },
      { heading: "6.3  Comparable Transactions", body: `PatSnap (IP SaaS) — SoftBank acquisition at $1.5B (28× ARR)\nAnaqua (IP management) — acquired at $650M\nCPA Global — acquired by Clarivate at $6.8B\nWARF (UW Madison) — $180M+/yr licensing income\n\nAsking price ($6.5M–$18M) represents 0.79× low-end strategic value — deliberately conservative for rapid execution.` }
    ]
  },
  {
    title: "RISK ANALYSIS",
    subtitle: "Honest Assessment of Key Risks & Mitigations",
    content: [
      { heading: "7.1  Technology Risks", body: `Risk: Scalar EM physics remains contested. Mitigation: Platform value does not depend on physics correctness — it depends on documented demand and AI platform capability. MEG peer-reviewed in Foundations of Physics Letters (15 authors, 12 institutions).\n\nRisk: AI API cost inflation. Mitigation: LLM costs declined 80%+ in 24 months.` },
      { heading: "7.2  Legal & Regulatory Risks", body: `Risk: Patent filing validity. Mitigation: Platform includes explicit legal disclaimer. Review by registered USPTO practitioner required before filing — standard for all AI legal drafting tools.\n\nRisk: Government document reproduction. Mitigation: All government documents in archive are UNCLASSIFIED (ONR R-5-78 explicitly marked UNCLASSIFIED on face).` },
      { heading: "7.3  Competitive Risks", body: `Risk: Large AI companies enter IP generation space. Mitigation: Data moat (primary sources, annotated archives, 200-node concept graph) not replicable from public internet. Scalar EM domain expertise is the defensible core.\n\nEstimated competitor replication time: 18-24 months minimum.` }
    ]
  },
  {
    title: "DUE DILIGENCE CHECKLIST",
    subtitle: "Documents Available Under Executed NDA",
    content: [
      { heading: "8.1  Technical Package (Available Immediately)", body: `[ ] ONR London Branch Report R-5-78 (full 26-page UNCLASSIFIED document)\n[ ] TACOM IOP FSO-3 memorandum (full text)\n[ ] French Patent 1,342,772 (complete annotated English translation)\n[ ] Anastasovski et al., Foundations of Physics Letters 14(1) & 14(4)\n[ ] Bohren, Am. J. Phys. 51(4), 1983\n[ ] TRZ/PPA 31-figure patent diagram set\n[ ] Bearden MEG patent diagrams\n[ ] Complete Bearden Energetics/Bioenergetics/Psychoenergetics slide series\n[ ] Live platform demonstration (60-90 min screen share)\n[ ] Sample AI-generated invention dossier with USPTO PPA draft\n[ ] Platform codebase + all AI prompt architecture (NDA escrow)` },
      { heading: "8.2  Financial Package (Credentialed Buyers)", body: `[ ] Platform development cost accounting (24-month history)\n[ ] Monthly API cost breakdown (OpenAI, Anthropic, Google AI)\n[ ] Stripe payment processing history and revenue attribution\n[ ] Newsletter subscriber list and acquisition cost data\n[ ] Third-party valuation letter (independent DCF analysis)\n[ ] Google Analytics traffic data (12 months)` },
      { heading: "8.3  Next Steps", body: `Step 1: EXECUTE NDA — Return to [YOUR EMAIL]\nStep 2: PROOF OF INSTITUTIONAL MANDATE — Letter of Interest or AUM confirmation\nStep 3: RECEIVE TECHNICAL PACKAGE — Within 48 hours of confirmed NDA\nStep 4: LIVE DEMONSTRATION — 60-90 min screen share, schedule via [YOUR EMAIL]\nStep 5: EXCLUSIVE WINDOW — 30-day exclusivity for first confirmed buyer\n\nContact: [YOUR NAME] · [YOUR EMAIL] · [YOUR PHONE]` }
    ]
  }
];

function generateDueDiligencePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 20;
  const pageW = 210;
  let y = 0;
  let pageNum = 0;

  const bg = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, 297, 'F');
  };

  const drawHeader = (title, subtitle) => {
    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, pageW, 14, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`ZENITH APEX — ${title || 'TECHNICAL DUE DILIGENCE'}`, margin, 9);
    doc.text(subtitle || 'INVESTMENT PACKAGE', pageW - margin, 9, { align: 'right' });
  };

  const drawFooter = () => {
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 287, pageW, 10, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Zenith Apex Research Portfolio — Technical Due Diligence Package — CONFIDENTIAL', margin, 293);
      doc.text(`Page ${p} of ${total}`, pageW - margin, 293, { align: 'right' });
    }
  };

  const addPage = (title, subtitle) => {
    doc.addPage();
    bg();
    pageNum++;
    drawHeader(title, subtitle);
    y = 24;
  };

  const check = (need = 14) => { if (y + need > 282) addPage(); };

  const rule = () => {
    check(6);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
  };

  const sectionBand = (text, subtitle) => {
    check(20);
    doc.setFillColor(20, 20, 20);
    doc.rect(0, y - 4, pageW, 16, 'F');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(text, margin, y + 5);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text(subtitle, pageW - margin, y + 5, { align: 'right' });
    y += 20;
  };

  const subHeading = (text) => {
    check(12);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(text, margin, y);
    y += 3;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + doc.getTextWidth(text), y);
    y += 8;
  };

  const para = (text) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(text, pageW - margin * 2);
    lines.forEach(l => { check(7); doc.text(l, margin, y); y += 6.5; });
    y += 4;
  };

  // ── COVER PAGE ─────────────────────────────────────────────────────────────
  bg();
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, pageW, 70, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('ZENITH APEX RESEARCH PORTFOLIO', pageW / 2, 22, { align: 'center' });
  doc.text('Advanced Research  ·  Intellectual Property  ·  AI-Powered Innovation  ·  Q2 2026', pageW / 2, 30, { align: 'center' });

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TECHNICAL DUE DILIGENCE', pageW / 2, 50, { align: 'center' });
  doc.setFontSize(16);
  doc.text('INVESTMENT PACKAGE', pageW / 2, 62, { align: 'center' });

  y = 84;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Comprehensive Technical, IP & Financial Analysis — Revised Q2 2026', pageW / 2, y, { align: 'center' });
  y += 14;

  // Valuation box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.rect(margin, y, pageW - margin * 2, 36, 'D');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('PLATFORM FAIR MARKET VALUE (Q2 2026)', margin + 6, y + 9);
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text('$3.9M – $11.5M', margin + 6, y + 22);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Conservative asset-by-asset DCF valuation', margin + 6, y + 29);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('$6.5M – $18M', pageW - margin - 6, y + 22, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('ACQUISITION ASKING PRICE', pageW - margin - 6, y + 29, { align: 'right' });
  y += 42;

  // TOC
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TABLE OF CONTENTS', margin, y);
  y += 8;
  doc.setDrawColor(0);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  SECTIONS.forEach((s, si) => {
    check(8);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${si + 1}.  ${s.title}`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text(s.subtitle, pageW - margin, y, { align: 'right' });
    y += 7;
  });
  y += 6;

  // Confidentiality notice
  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, pageW - margin * 2, 20, 'D');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CONFIDENTIALITY NOTICE', margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const noteLines = doc.splitTextToSize('This document contains proprietary trade secrets. Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident. Distribution requires an executed NDA.', pageW - margin * 2 - 10);
  noteLines.forEach((l, i) => doc.text(l, margin + 5, y + 13 + i * 4.5));

  pageNum = 1;
  drawFooter();

  // ── CONTENT SECTIONS ────────────────────────────────────────────────────
  SECTIONS.forEach(section => {
    addPage(section.title, section.subtitle);
    sectionBand(section.title, section.subtitle);
    section.content.forEach(item => {
      subHeading(item.heading);
      para(item.body);
    });
  });

  drawFooter();
  doc.save('zenith-apex-due-diligence-q2-2026.pdf');
}

export default function DueDiligencePdfGenerator({ compact }) {
  const [generating, setGenerating] = useState(false);

  const handle = () => {
    setGenerating(true);
    setTimeout(() => { generateDueDiligencePDF(); setGenerating(false); }, 300);
  };

  return (
    <button onClick={handle} disabled={generating}
      className={`flex items-center gap-2 rounded-xl border font-bold transition-all disabled:opacity-60 ${compact ? 'px-3 py-1.5 text-xs bg-purple-900/40 hover:bg-purple-800/60 border-purple-700 text-purple-300' : 'px-4 py-2 text-xs bg-purple-900/40 hover:bg-purple-800/60 border-purple-700 text-purple-300'}`}>
      {generating ? <Loader2 size={13} className="animate-spin" /> : <BookOpen size={13} />}
      {generating ? 'Building PDF…' : 'Due Diligence Package PDF'}
    </button>
  );
}