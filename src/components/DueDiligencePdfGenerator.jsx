import { useState } from "react";
import { jsPDF } from "jspdf";
import { BookOpen, Loader2, Download } from "lucide-react";

const SECTIONS = [
  {
    title: "EXECUTIVE SUMMARY",
    subtitle: "Platform Overview & Investment Thesis",
    content: [
      { heading: "1.1  Platform Identity", body: `The Zenith Apex Advanced Research Platform is the world's only commercially structured, production-ready AI-powered knowledge and IP generation platform built around the suppressed physics and biology research of Lt. Col. Thomas E. Bearden (ret.). As of Q2 2026, the platform integrates a complete invention-to-commercialization pipeline spanning AI-driven concept generation, live patent database scanning, USPTO-compliant provisional patent drafting, animated engineering build guide generation, and VC pitch deck creation.\n\nThe platform is not a static archive. It is a living, generative IP factory operating at near-zero marginal cost per invention cycle.` },
      { heading: "1.2  Investment Thesis", body: `The platform sits at the intersection of three converging macro trends:\n\n(1) AI-Accelerated IP Generation: The cost of generating a defensible patent application has dropped from $15,000–$50,000 in attorney fees to approximately $0.80 in LLM API costs using this platform's Provisional Patent Drafter.\n\n(2) Scalar EM Technology Maturation: After 40+ years of documented suppression, the underlying physics has accumulated an independent body of peer-reviewed validation from 15 authors across 12 institutions.\n\n(3) Compressed Due Diligence Cycles: Institutional investors increasingly require AI-assisted research synthesis. This platform auto-generates exactly the format investors need in minutes rather than weeks.` },
      { heading: "1.3  Fair Market Valuation (Q2 2026)", body: `AI Invention Forge Engine ............. $380,000 – $950,000\nAI Market Research Scanner ............ $220,000 – $580,000\nUSPTO Provisional Patent Drafter ....... $150,000 – $380,000\nVC Pitch Deck + Build Video Engine .... $120,000 – $280,000\nScalar Wave / Field Simulators ......... $80,000 – $175,000\nBearden Knowledge Graph (200+ nodes) .. $220,000 – $420,000\nCourse Catalog (20+ courses, LMS) ..... $150,000 – $320,000\nInvention Build Plan Library ........... $450,000 – $1,200,000\nAnnotated Primary Document Archive .... $120,000 – $280,000\nIP Portfolio (MEG, TRZ, TRD-1) ........ $1,800,000 – $6,500,000\nPrior Art Archive + Patent AI ......... $95,000 – $240,000\nHealth + CRM + Monitoring Suite ....... $110,000 – $220,000\n\nPLATFORM TOTAL (conservative):    $3,895,000 – $11,545,000\n+ Strategic pre-public premium:    $5,453,000 – $25,399,000` },
      { heading: "1.4  Acquisition Terms", body: `EXCLUSIVE FULL ACQUISITION:        $6,500,000 – $18,000,000\nLICENSING ONLY (annual):           $650,000 – $1,500,000/year\nAI MODULE WHITE-LABEL (SaaS):      $280,000 – $750,000/year per licensee\nSTRATEGIC PARTNERSHIP / JV:        Equity terms, negotiable\n\nPresented to a maximum of six (6) qualified buyers before public launch. First executed NDA with proof of funds receives a 30-day exclusive window.` }
    ]
  },
  {
    title: "TECHNOLOGY DEEP DIVE",
    subtitle: "AI Module Architecture & Capabilities",
    content: [
      { heading: "2.1  AI Invention Forge Engine", body: `Selects from eight technology domains and seven target markets to generate complete invention dossiers for 2–5 novel inventions per session. Each dossier includes: full technical specifications, Bearden principles applied, manufacturing pathway, problem/solution framing, TAM/SAM/SOM market sizing, IP valuation, prior art differentiation, 5-year P&L projections, funding ask, Series A target, phase-by-phase launch plan, and GTM channel mix.\n\nModel: GPT-5 (production). Marginal cost: ~$0.80 per complete invention dossier.` },
      { heading: "2.2  AI Market Research Scanner", body: `Live-internet scanning module querying USPTO, EPO, WIPO, Google Patents, IEEE Xplore, arXiv, Grand View Research, and MarketsandMarkets. Outputs per scan: TAM/SAM/SOM with $ figures and CAGR citations, 8 prior art citations with conflict risk scoring (High/Medium/Low), 8 incumbent competitors with analysis, 5 market trends, and 4 entry barriers.\n\nModel: Gemini Pro 1.5 with live internet access.` },
      { heading: "2.3  USPTO Provisional Patent Drafter", body: `Generates complete USPTO-compliant Provisional Patent Applications (35 U.S.C. § 111(b)) in 9 mandatory sections: Title, Cross-Reference, Technical Field, Background, Summary, Brief Description of Drawings, Detailed Description (800–1,200 words), Claims (20 formal claims: 3 independent + 17 dependent), Abstract (≤150 words per Rule 1.72(b)).\n\nModel: Claude Sonnet 4.6. Export as professionally formatted PDF or plain text for direct filing.` },
      { heading: "2.4  Build Video Generator", body: `Generates 10-step animated engineering build guides per invention. Each step includes title, type, duration, description, materials list, tools required, safety warnings, and checkpoint verification procedure. Canvas-rendered schematics per step type. All guides auto-saved to database and exportable as branded PDF build manuals.` },
      { heading: "2.5  Scalar Field Simulators", body: `(a) Scalar Potential Map: WebGL heatmap of scalar potential fields and gradient magnitudes with configurable source positions and frequencies.\n\n(b) Scalar Wave Simulator: Dual-source wave interference patterns with configurable frequency, phase, amplitude, and position parameters. Real-time canvas rendering at 60fps.` }
    ]
  },
  {
    title: "INTELLECTUAL PROPERTY PORTFOLIO",
    subtitle: "Core IP Assets & Primary Source Validation",
    content: [
      { heading: "3.1  Motionless Electromagnetic Generator (MEG)", body: `COP >> 1 device published in Foundations of Physics Letters (Anastasovski et al., 15 authors, 12 institutions including Boeing Phantom Works, Trinity College Dublin, Alfvén Laboratory Stockholm), Vol. 14, No. 1, 2001. Independently replicated by Naudin (France). US Patent 6,362,718 (filed 1999, issued March 26, 2002).\n\nMainstream proof: Bohren, Am. J. Phys. 51(4), 1983 — particle absorbs 18× more energy than incident (COP>1 thermodynamically permitted in open systems).` },
      { heading: "3.2  Telomere Regeneration Device (TRD-1)", body: `Implements Bearden's MCCS (Multiwave Coherent Cellular Stimulation) telomere restoration protocol. Three 30-second treatment sessions. Grounded in Fröhlich's biological coherence work (Collective Phenomena, Vol. 1, 1973). Complete bill of materials and step-by-step assembly guide included with NDA disclosure.` },
      { heading: "3.3  TRZ Cold Fusion Reactor (Time-Reversal Zone)", body: `Time-Reversal Zone cold fusion device. Primary data: China Lake Naval Weapons Center controlled experiments demonstrating anomalous transmutation at 73 sigma above background. Complete 31-figure patent drawing set included. Phase-conjugate pumping mechanism establishes TRZ in palladium cathode matrix.` },
      { heading: "3.4  Portable Prioré-Class EM Treatment Platform", body: `Primary validation source: US ONR London Branch Report R-5-78 (UNCLASSIFIED, 16 August 1978, 26 pages) — Priore device cured implanted tumors and eliminated trypanosomiasis in controlled experiments: all controls died, all experimentals cured. French Patent 1,342,772. André Lwoff (1965 Nobel Prize in Physiology/Medicine) personally validated results and submitted documentation to French government agencies.` },
      { heading: "3.5  Remaining 20 Device Architectures", body: `Complete engineering documentation available under NDA for: Scalar Wave Communicator (G-Com Mk I), Scalar Pulse Radar, Woodpecker Grid ELF Detector, Anenergy Pump Demonstration Circuit, Scalar Energy Bottle Interferometer, Vacuum Potential Oscillator, Biofield Frequency Exposure Chamber, EM Trigger Window Therapy Device, Prioré-Type Multichannel EM Therapy System, ELF Carrier Lock Detection System, Phi-River Gradient Sensor, Atmospheric Scalar EM Signature AI System, Morphogenetic Field Coherence Monitor, Whittaker Wave Phase Conjugate Mirror, Asymmetric Regauging Overunity Generator, Portable Porthole Disease Treatment System, T-Polarized EM Wave Transducer, Quantum Potential EMI Detector (Fireflies), and Psychoenergetics Cellular Control System.` }
    ]
  },
  {
    title: "PRIMARY SOURCE DOCUMENT ARCHIVE",
    subtitle: "Verified Primary Sources Included Under NDA",
    content: [
      { heading: "4.1  US Government Documents", body: `1. ONR London Branch Report R-5-78 (UNCLASSIFIED) — J.B. Bateman, 16 August 1978, 26 pages. Documents Priore device tumor cure and trypanosomiasis elimination in French government controlled experiments.\n\n2. TACOM IOP FSO-3 (30 September 2003) — M1A1 Abrams tank penetration in Baghdad by unknown weapon system. Documents anomalous penetration inconsistent with all known kinetic or EM weapons.\n\n3. DIA Technology Survey — Soviet scalar EM weapons program review and assessment.` },
      { heading: "4.2  Peer-Reviewed Publications", body: `1. Anastasovski et al., Foundations of Physics Letters 14(1), 2001 — MEG COP>1 (15 authors, 12 institutions)\n2. Anastasovski et al., Foundations of Physics Letters 14(4), 2001 — MEG Sachs unified field theory\n3. Bohren, Am. J. Phys. 51(4), 1983 — COP>1 thermodynamic proof for open EM systems\n4. Fröhlich, Collective Phenomena, Vol. 1, 1973 — Biological EM coherence\n5. Brush, Journal of the Franklin Institute, Vol. 206, No. 2, 1928 — Whittaker wave decomposition confirmation` },
      { heading: "4.3  Patents and Engineering Documentation", body: `1. French Patent 1,342,772 (Prioré) — complete annotated English translation with technical analysis\n2. TRZ/PPA Patent Application Series — 31-figure complete engineering set\n3. Bearden MEG Patent Application — complete drawing set and claims\n4. US Patent 6,362,718 (Bearden, Hayes, Kenny, Moore, Thrash) — MEG, issued March 26, 2002\n5. Bearden provisional patent application series (in process)` },
      { heading: "4.4  Primary Monographs and Briefings", body: `1. Bearden, "Toward a New Electromagnetics, Parts I–IV" (Tesla Book Company, 1983)\n2. Bearden, "Gravitobiology" (Tesla Book Company, 1991)\n3. Bearden, "Excalibur Briefing" (Strawberry Hill Press, 1980; Second Edition 1988)\n4. Bearden, "Energetics of Free Energy Systems and Vacuum Engine Therapies" (Explore! magazine, 1995)\n5. Bearden, "The Final Secret of Free Energy" (ADAS, 1993)\n6. Bearden, "Solutions to Tesla's Secrets and the Soviet Tesla Weapons" (Tesla Book Company, 1981)` }
    ]
  },
  {
    title: "PLATFORM TECHNICAL ARCHITECTURE",
    subtitle: "Production Codebase & Infrastructure Overview",
    content: [
      { heading: "5.1  Frontend Technology Stack", body: `React 18.2.0 + Vite build system · React Router DOM v6 (40+ routes, nested layouts) · TanStack React Query v5 (server state management) · Tailwind CSS v3 + shadcn/ui component library · Recharts, D3.js v7, Three.js v0.171, React Leaflet (geospatial) · Framer Motion (animations) · jsPDF v4 (client-side professional PDF generation) · Stripe.js v5 (payments) · @hello-pangea/dnd (drag-and-drop)` },
      { heading: "5.2  Backend Infrastructure", body: `Platform: Base44 BaaS (Backend-as-a-Service)\nRuntime: Deno Deploy (edge-distributed, global)\nAuthentication: Role-based access control (admin/user)\nReal-time: Entity subscription system (WebSocket-backed)\n\nBackend Functions (Deno edge functions):\nexportInventionBrochure, exportPatentDoc, generatePatentDraft, generateMarketDeck, patentMonitor, opportunityMonitor, trackNodeClick, createCheckoutSession, getUserPurchases, stripeWebhook, exportToGoogleSlides` },
      { heading: "5.3  Database Entities", body: `LabExperiment, BuildVideo, EMFLog, InvestorRelationship, MonitoringConfig, MonitoringAlert, OpportunityAlert, OpportunitySubscription, OpportunityCard, PriorArtEntry, CourseProgress, NewsletterSubscriber, BetaApplication, NodeClick, User\n\nAll entities include built-in: id, created_date, updated_date, created_by. Real-time subscription available on all entity types.` },
      { heading: "5.4  Security Architecture", body: `NDA Gate: Cryptographic localStorage signature with timestamp.\nCopy Protection: Global intercept of right-click, drag, print, screenshot, and developer tools keyboard shortcuts.\nRole-based admin/user access control on all routes and data.\nStripe webhook signature verification (HMAC-SHA256).\nProduction/test database isolation.\nAdmin-only function authentication enforced at API level.` },
      { heading: "5.5  AI Model Usage by Feature", body: `Invention Forge Engine:   GPT-5 (production)\nMarket Research Scanner:  Gemini Pro 1.5 (live internet access)\nPatent Drafter:           Claude Sonnet 4.6\nBuild Video Generator:    GPT-5\nPitch Deck Generator:     GPT-5-mini\nGeneral LLM calls:        GPT-5-mini (default)\n\nMarginal cost per complete invention cycle (forge + market + patent): ~$2.40–$4.80 in API costs.` }
    ]
  },
  {
    title: "REVENUE MODEL & FINANCIAL PROJECTIONS",
    subtitle: "Multi-Stream Revenue Architecture & 5-Year Projections",
    content: [
      { heading: "6.1  Revenue Streams", body: `Stream 1 — COURSE CATALOG: 20+ courses at $197–$397 each. Target audience: researchers, engineers, patent attorneys.\n  Projected annual revenue: $150,000 – $380,000\n\nStream 2 — INVENTION BUILD PLAN KITS: 10+ kits at $490–$1,800.\n  Projected annual revenue: $120,000 – $290,000\n\nStream 3 — EMF PROTECTION SHOP: 20 products at $24–$890.\n  Projected annual revenue: $60,000 – $140,000\n\nStream 4 — AI MODULE LICENSING: $280,000–$750,000/yr per licensee.\n  Target: patent law firms, VC due diligence teams, research institutions.\n\nStream 5 — PLATFORM ACQUISITION: See Section 1.4.` },
      { heading: "6.2  5-Year Financial Projection", body: `Year 1: Revenue $380,000 – $850,000 · EBITDA $200,000 – $550,000\nYear 2: Revenue $1,200,000 – $3,800,000 · EBITDA $750,000 – $2,800,000 (3+ AI licensees)\nYear 3: Revenue $2,800,000 – $7,500,000 (8+ licensees, defense channel active)\nYear 4: Revenue $4,500,000 – $12,000,000 (DoD SBIR/STTR grants + institutional)\nYear 5: Revenue $6,500,000 – $18,000,000 · Exit at 5–6× multiple = $32.5M – $108M` },
      { heading: "6.3  Comparable Acquisition Transactions", body: `PatSnap (IP intelligence SaaS) — SoftBank acquisition at $1.5B (28× ARR)\nAnaqua (IP management software) — acquired at $650M\nCPA Global (IP management) — acquired by Clarivate at $6.8B\nWARF (University of Wisconsin Madison) — $180M+/yr licensing income\nClarivate (Derwent Innovation) — $1.4B revenue, 28× ARR at IPO\n\nAsking price ($6.5M–$18M) represents 0.79× low-end strategic value — deliberately conservative pricing for rapid execution.` }
    ]
  },
  {
    title: "RISK ANALYSIS",
    subtitle: "Honest Assessment of Key Risks & Mitigations",
    content: [
      { heading: "7.1  Technology Risks", body: `Risk: Scalar EM physics remains contested in mainstream academic literature.\nMitigation: Platform value does not depend on physics correctness — it depends on (a) documented demand from a large existing community, and (b) AI platform capability which is independently valuable. MEG peer-reviewed in Foundations of Physics Letters by 15 authors across 12 institutions.\n\nRisk: AI API cost inflation.\nMitigation: LLM costs declined 80%+ in the 24 months prior to this writing. Trajectory continues downward. Platform cost structure improves automatically as models improve.` },
      { heading: "7.2  Legal & Regulatory Risks", body: `Risk: Patent filing validity and practitioner review requirement.\nMitigation: Platform includes explicit legal disclaimer requiring review by a registered USPTO practitioner before filing. This is standard for all AI-assisted legal drafting tools (Harvey AI, Clio, Spellbook). Disclaimer is prominently displayed.\n\nRisk: Government document reproduction.\nMitigation: All government documents in the archive are explicitly marked UNCLASSIFIED on their face (ONR R-5-78 is stamped UNCLASSIFIED, August 16, 1978). FOIA-obtainable by any member of the public.` },
      { heading: "7.3  Competitive Risks", body: `Risk: Large AI companies (OpenAI, Google, Anthropic) enter IP generation space.\nMitigation: The defensible moat is the data — annotated primary archives, 200-node concept graph, curated prior art database, and domain expertise on suppressed-physics IP — none of which is replicable from the public internet.\n\nEstimated competitor replication time: 18–24 months minimum for domain knowledge assembly. Platform technology replication: 3–6 months. Combined defensible moat: 24–30 months.` }
    ]
  },
  {
    title: "DUE DILIGENCE CHECKLIST",
    subtitle: "Documents Available Under Executed NDA",
    content: [
      { heading: "8.1  Technical Package — Available Immediately Upon NDA Execution", body: `[ ] ONR London Branch Report R-5-78 — full 26-page UNCLASSIFIED document\n[ ] TACOM IOP FSO-3 memorandum — full text\n[ ] French Patent 1,342,772 — complete annotated English translation\n[ ] Anastasovski et al., Foundations of Physics Letters 14(1) & 14(4) — full papers\n[ ] Bohren, Am. J. Phys. 51(4), 1983 — COP>1 thermodynamic proof\n[ ] TRZ/PPA 31-figure complete patent diagram set\n[ ] Bearden MEG patent diagrams and claims analysis\n[ ] Complete Bearden Energetics/Bioenergetics/Psychoenergetics slide series\n[ ] Live platform demonstration (60–90 min screen share)\n[ ] Sample AI-generated invention dossier with USPTO PPA draft\n[ ] Platform codebase + AI prompt architecture (NDA escrow)` },
      { heading: "8.2  Financial Package — Available to Credentialed Institutional Buyers", body: `[ ] Platform development cost accounting (24-month history)\n[ ] Monthly AI API cost breakdown (OpenAI, Anthropic, Google AI)\n[ ] Stripe payment processing history and revenue attribution by product\n[ ] Newsletter subscriber list and per-channel acquisition cost data\n[ ] Third-party valuation letter (independent DCF analysis)\n[ ] Google Analytics 12-month traffic data with source attribution\n[ ] Beta application pipeline — 200+ pre-qualified applicants` },
      { heading: "8.3  Process to Proceed", body: `Step 1 — EXECUTE NDA\n  Return signed NDA to: [YOUR EMAIL]\n  Electronic signature accepted via DocuSign.\n\nStep 2 — PROOF OF INSTITUTIONAL MANDATE\n  Provide: Letter of Interest on letterhead, AUM confirmation, or institutional mandate letter.\n\nStep 3 — RECEIVE TECHNICAL PACKAGE\n  Within 48 hours of confirmed NDA and mandate letter.\n\nStep 4 — LIVE DEMONSTRATION\n  60–90 minute live screen share. Schedule via: [YOUR EMAIL]\n\nStep 5 — EXCLUSIVE WINDOW\n  30-day exclusivity period for first confirmed buyer with proof of funds.\n\nContact: [YOUR NAME]  ·  [YOUR EMAIL]  ·  [YOUR PHONE]` }
    ]
  }
];

function generateDueDiligencePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 0;

  const bg = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, 297, 'F');
  };

  const drawHeader = (title, subtitle) => {
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageW, 16, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`ZENITH APEX — ${title || 'TECHNICAL DUE DILIGENCE'}`, margin, 10.5);
    doc.text(subtitle || 'INVESTMENT PACKAGE', pageW - margin, 10.5, { align: 'right' });
  };

  const drawFooter = () => {
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 285, pageW, 12, 'F');
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 285, pageW, 0.4, 'F');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text('Zenith Apex Research Portfolio — Technical Due Diligence Package — CONFIDENTIAL — Unauthorized Disclosure Prohibited', margin, 291);
      doc.text(`Page ${p} of ${total}`, pageW - margin, 291, { align: 'right' });
    }
  };

  const addPage = (title, subtitle) => {
    doc.addPage();
    bg();
    drawHeader(title, subtitle);
    y = 26;
  };

  const check = (need = 16) => { if (y + need > 281) addPage(); };

  const rule = () => {
    check(8);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageW - margin, y);
    y += 8;
  };

  const sectionBand = (text, subtitle) => {
    check(24);
    doc.setFillColor(10, 10, 10);
    doc.rect(0, y - 5, pageW, 22, 'F');
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(text, margin, y + 9);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(190, 190, 190);
    doc.text(subtitle, pageW - margin, y + 9, { align: 'right' });
    y += 26;
  };

  const subHeading = (text) => {
    check(18);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(text, margin, y);
    y += 4;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + Math.min(doc.getTextWidth(text), contentW), y);
    y += 10;
  };

  const para = (text) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    const lines = doc.splitTextToSize(text, contentW);
    lines.forEach(l => { check(10); doc.text(l, margin, y); y += 8.5; });
    y += 5;
  };

  // ── COVER PAGE ─────────────────────────────────────────────────────────────
  bg();
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageW, 76, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 190, 190);
  doc.text('ZENITH APEX RESEARCH PORTFOLIO', pageW / 2, 24, { align: 'center' });
  doc.text('Advanced Research  ·  Intellectual Property  ·  AI-Powered Innovation  ·  Q2 2026', pageW / 2, 33, { align: 'center' });

  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TECHNICAL DUE DILIGENCE', pageW / 2, 55, { align: 'center' });
  doc.setFontSize(17);
  doc.text('INVESTMENT PACKAGE', pageW / 2, 68, { align: 'center' });

  y = 90;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text('Comprehensive Technical, IP & Financial Analysis — Revised Q2 2026', pageW / 2, y, { align: 'center' });
  y += 16;

  // Valuation box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.rect(margin, y, contentW, 40, 'D');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('PLATFORM FAIR MARKET VALUE (Q2 2026)', margin + 8, y + 10);
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text('$3.9M – $11.5M', margin + 8, y + 25);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Conservative asset-by-asset DCF valuation', margin + 8, y + 33);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('$6.5M – $18M', pageW - margin - 8, y + 25, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('ACQUISITION ASKING PRICE', pageW - margin - 8, y + 33, { align: 'right' });
  y += 48;

  // TOC
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TABLE OF CONTENTS', margin, y);
  y += 8;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;
  SECTIONS.forEach((s, si) => {
    check(10);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${si + 1}.  ${s.title}`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.setFontSize(10);
    doc.text(s.subtitle, pageW - margin, y, { align: 'right' });
    y += 9;
  });
  y += 8;

  // Confidentiality notice
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, contentW, 24, 'D');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CONFIDENTIALITY NOTICE', margin + 6, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const noteLines = doc.splitTextToSize('This document contains proprietary trade secrets. Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident. Distribution requires a fully executed NDA.', contentW - 12);
  noteLines.forEach((l, i) => doc.text(l, margin + 6, y + 16 + i * 5.5));

  drawFooter();

  // ── CONTENT SECTIONS ──────────────────────────────────────────────────────
  SECTIONS.forEach(section => {
    addPage(section.title, section.subtitle);
    sectionBand(section.title, section.subtitle);
    section.content.forEach(item => {
      subHeading(item.heading);
      para(item.body);
      rule();
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
      className={`flex items-center gap-2 rounded-xl border font-bold transition-all disabled:opacity-60 ${compact ? 'px-3 py-1.5 text-xs bg-blue-900/40 hover:bg-blue-800/60 border-blue-700 text-blue-300' : 'px-4 py-2 text-xs bg-blue-900/40 hover:bg-blue-800/60 border-blue-700 text-blue-300'}`}>
      {generating ? <Loader2 size={13} className="animate-spin" /> : <BookOpen size={13} />}
      {generating ? 'Building PDF…' : 'Due Diligence Package PDF'}
    </button>
  );
}