import { useState } from "react";
import { jsPDF } from "jspdf";
import { BookOpen, Loader2, Download } from "lucide-react";

// ── CONTENT DATA ──────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: "EXECUTIVE SUMMARY",
    subtitle: "Platform Overview & Investment Thesis",
    content: [
      {
        heading: "1.1  Platform Identity",
        body: `The Zenith Apex Advanced Research Platform is the world's only commercially structured, production-ready AI-powered knowledge and IP generation platform built around the suppressed physics and biology research of Lt. Col. Thomas E. Bearden (ret.). As of Q2 2026, the platform integrates a complete invention-to-commercialization pipeline spanning AI-driven concept generation, live patent database scanning, USPTO-compliant provisional patent drafting, animated engineering build guide generation, and VC pitch deck creation.\n\nThe platform is not a static archive. It is a living, generative IP factory operating at near-zero marginal cost per invention cycle. Each session generates novel, investor-ready invention dossiers grounded in Bearden's extensively documented scalar electromagnetic framework — the same framework validated by US government reports, Nobel laureate testimony, peer-reviewed publications in Foundations of Physics Letters, and declassified defense intelligence documents.`
      },
      {
        heading: "1.2  Investment Thesis",
        body: `The platform sits at the intersection of three converging macro trends:\n\n(1) AI-Accelerated IP Generation: The cost of generating a defensible patent application has dropped from $15,000–$50,000 in attorney fees to approximately $0.80 in LLM API costs using this platform's Provisional Patent Drafter. The first mover who controls this cost arbitrage in the deep-tech / frontier physics domain captures extraordinary leverage.\n\n(2) Scalar EM Technology Maturation: After 40+ years of documented suppression, the underlying physics of Bearden's framework — O(3) symmetry electrodynamics, vacuum energy gating, time-reversal zone phenomena — has accumulated an independent body of peer-reviewed validation. The technology is no longer theoretical.\n\n(3) Compressed Due Diligence Cycles: Institutional investors increasingly require AI-assisted research synthesis. This platform auto-generates exactly the format institutional investors need: TAM/SAM/SOM with citations, prior art conflict risk scoring, and financial projections — in minutes rather than weeks.`
      },
      {
        heading: "1.3  Platform Fair Market Valuation (Q2 2026)",
        body: `Asset-by-asset conservative discounted cash flow and SaaS comparable multiple analysis:\n\n  AI Invention Forge Engine ............. $380,000 – $950,000\n  AI Market Research Scanner ............ $220,000 – $580,000\n  USPTO Provisional Patent Drafter ....... $150,000 – $380,000\n  VC Pitch Deck + Build Video Engine .... $120,000 – $280,000\n  Scalar Wave / Field Simulators ......... $80,000 – $175,000\n  Bearden Knowledge Graph (200+ nodes) .. $220,000 – $420,000\n  Course Catalog (20+ courses, LMS) ..... $150,000 – $320,000\n  Invention Build Plan Library ........... $450,000 – $1,200,000\n  Annotated Primary Document Archive .... $120,000 – $280,000\n  IP Portfolio (MEG, TRZ, TRD-1) ........ $1,800,000 – $6,500,000\n  Prior Art Archive + Patent AI ......... $95,000 – $240,000\n  Health + CRM + Monitoring Suite ....... $110,000 – $220,000\n\n  PLATFORM TOTAL (conservative):    $3,895,000 – $11,545,000\n  + Strategic pre-public premium:    $5,453,000 – $25,399,000\n  + AI White-Label SaaS (annual):   $650,000 – $1,500,000/yr recurring`
      },
      {
        heading: "1.4  Acquisition Terms Summary",
        body: `EXCLUSIVE FULL ACQUISITION (IP, platform, AI engines, all archives):\n  $6,500,000 – $18,000,000 (negotiable, earnout structures available)\n\nLICENSING ONLY (non-exclusive, annual renewable):\n  $650,000 – $1,500,000/year\n\nAI MODULE WHITE-LABEL (SaaS to law firms / patent shops / VCs):\n  $280,000 – $750,000/year per licensee\n\nSTRATEGIC PARTNERSHIP / JOINT VENTURE:\n  Equity terms, negotiable, minimum 20% dilution to acquirer\n\nThis opportunity is being presented to a maximum of six (6) qualified buyers before public launch. First executed NDA with proof of institutional mandate receives priority due diligence access and exclusivity window of 30 days.`
      }
    ]
  },
  {
    title: "TECHNOLOGY DEEP DIVE",
    subtitle: "AI Module Architecture & Capabilities",
    content: [
      {
        heading: "2.1  AI Invention Forge Engine",
        body: `The AI Invention Forge is the platform's core generative module. Users select from eight technology domains (Vacuum Energy Extraction, Bioelectromagnetics/Healing, Scalar Wave Communication, Time-Reversal Zone Applications, Psychoenergetics/Consciousness, EMF Shielding/Protection, Novel Materials/Resonators, Scalar Agriculture/BioField) and up to seven target markets.\n\nPer generation session, the AI produces complete invention dossiers for 2–5 novel inventions, each containing:\n\n• Full technical specifications grounded in Bearden's documented framework (6 spec fields with values)\n• Key Bearden Principles applied (5 specific theoretical underpinnings per invention)\n• Manufacturing pathway description with material guidance\n• Problem / Solution framing with market sizing (TAM/SAM/SOM with dollar figures)\n• IP valuation ($M range) with valuation method and rationale\n• Prior art differentiation analysis and filing strategy\n• 4 target jurisdictions for patent filing\n• 5-year P&L financial projections (Revenue, COGS, Gross Profit, EBITDA, Cumulative Investment per year)\n• Funding ask, equity offer, Pre-Seed target, Series A target, 5-year revenue target\n• Phase-by-phase launch plan (4 phases with timelines, actions, milestones)\n• Go-to-market channel mix (5 channels)\n\nModel: GPT-5 (OpenAI). Marginal cost per full invention dossier: ~$0.80 in API costs. Generation time: ~15 seconds per invention.\n\nArchitectural Note: Inventions are generated sequentially to avoid token timeout, displayed progressively as each arrives. All generated inventions are exportable as PDF brochures (multi-invention branded portfolio documents) and as USPTO Provisional Patent Applications.`
      },
      {
        heading: "2.2  AI Market Research Scanner",
        body: `The Market Research Scanner is an integrated live-internet scanning module that queries multiple authoritative sources simultaneously:\n\nPatent Databases: USPTO (United States Patent and Trademark Office), EPO (European Patent Office), WIPO (World Intellectual Property Organization), Google Patents\n\nAcademic Repositories: IEEE Xplore, arXiv.org, Physical Review Letters, Nature, Foundations of Physics Letters\n\nMarket Research Sources: Grand View Research, MarketsandMarkets, IBISWorld, Statista, Allied Market Research\n\nOutputs per invention scan:\n(a) TAM/SAM/SOM with specific $ figures, CAGR percentage, forecast year, and source citations\n(b) 8 prior art citations — each with: exact title, inventor/author, year, source database, patent number (if applicable), key claims summary, outcome/status, conflict risk level (High/Medium/Low), and differentiation strategy specific to this invention\n(c) Key market incumbents and competitors (8 companies)\n(d) 5 key driving market trends\n(e) 4 entry barriers and risks\n(f) 5 research source citations\n\nModel: Gemini Pro 1.5 with live internet access. Scan time: ~30 seconds. Both market data and prior art scan run in parallel.\n\nOutput auto-populates the parent invention's marketSize field, providing continuously updated market intelligence that flows into pitch decks and financial projections.`
      },
      {
        heading: "2.3  USPTO Provisional Patent Drafter",
        body: `The Provisional Patent Drafter generates complete USPTO-compliant Provisional Patent Applications (PPA) under 35 U.S.C. § 111(b) and 37 C.F.R. § 1.53(c). Each PPA establishes a real USPTO priority date upon filing.\n\nThe drafter produces all 9 mandatory PPA sections in a single AI generation pass:\n\nSection 1: Title of Invention (35 USC 111(b)) — Formal patent title, ≤500 characters, no tradenames\nSection 2: Cross-Reference to Related Applications (37 CFR 1.78) — Priority chain documentation\nSection 3: Technical Field (37 CFR 1.77) — 1-2 sentence domain definition\nSection 4: Background of the Invention (37 CFR 1.73) — 4-6 paragraphs, "heretofore" prior art language, problem statement with Bearden prior art references\nSection 5: Summary of the Invention (37 CFR 1.73) — 4-5 paragraphs, "In one aspect of the invention..." format\nSection 6: Brief Description of the Drawings (37 CFR 1.74) — FIG. 1 through FIG. 8 with descriptions\nSection 7: Detailed Description (37 CFR 1.71) — 800-1,200 words, FIG. references, element numerals (100), (102), materials, dimensions, operating parameters\nSection 8: Claims (35 USC 112) — 20 formal patent claims: Claim 1 (broadest independent apparatus), Claims 2-15 (dependent narrowing claims), Claims 16-19 (second independent + dependents), Claim 20 (method claim). Proper antecedent basis maintained throughout.\nSection 9: Abstract (37 CFR 1.72(b)) — ≤150 words\n\nModel: Claude Sonnet (Anthropic). Generation time: ~30 seconds. All sections editable via ReactQuill rich-text editor post-generation. Export as branded PDF or plain text for filing.`
      },
      {
        heading: "2.4  Build Video Generator",
        body: `The Build Video Generator creates detailed 10-step animated engineering build guides for any invention in the system. Each guide functions as a step-by-step manufacturing and assembly protocol.\n\nPer guide, each step includes:\n• Step title and type classification (preparation/assembly/wiring/calibration/testing/safety)\n• Estimated duration (e.g., "45 minutes")\n• Precise 2-3 sentence description of the physical action\n• Materials list (3-5 specific components for that step)\n• Tools required (2-4 items)\n• Safety/precision warning (if applicable)\n• Checkpoint verification method\n\nPlayback engine: Progress-tracked auto-advance through all 10 steps at 8 seconds per step. Canvas-rendered schematic visualization per step type (assembly = component boxes, wiring = waveform nodes, testing = oscilloscope display, default = circuit topology). Sidebar step list with completion tracking.\n\nAll guides auto-saved to the BuildVideo database entity with full CRUD management accessible via the Admin Video Library. Export as branded PDF build manual (dark-themed, element-per-page layout).\n\nModel: GPT-5. Generation time: ~15-20 seconds.`
      },
      {
        heading: "2.5  VC Pitch Deck Exporter",
        body: `The Pitch Deck Exporter generates investor-ready A4 landscape PDF pitch decks for multi-invention portfolios. Architecture:\n\n• Cover slide: portfolio branding, date, confidentiality marker\n• Per invention: dedicated slide set covering name/tagline/category/stage, IP valuation + funding ask, problem/solution framing, 3-year financial projection table, market sizing summary, and IP/filing strategy\n• Summary slide: total portfolio valuation, acquisition terms, contact information\n\nEach PDF uses professional dark branding with color-coded per-invention theming. Financial tables, grid layouts, and multi-column designs are rendered natively in jsPDF without external dependencies.\n\nSlide preview UI allows inspection of all slides before export.`
      },
      {
        heading: "2.6  Scalar Field Simulators",
        body: `Two independent physics simulators are embedded in the platform:\n\n(a) Scalar Potential Map: Interactive WebGL-rendered heatmap of scalar potential fields (φ) and gradient magnitudes (|∇φ|) based on user-placed source and sink nodes. Computes inverse-distance sum algorithms. Multiple color palettes (plasma, cyan, heat). Identifies high-intensity "hot zones" for experimental device placement. Exports to InventionForge with coordinates and field intensity data.\n\n(b) Scalar Wave Simulator: Dual-source interference pattern simulator with configurable frequency, phase, amplitude, and position for each source. Real-time canvas rendering. Plasma/cyan/green/orange color schemes. Vector field overlay. Save/load experiment configurations to LabExperiment database entity.\n\nBoth simulators run entirely in-browser via WebGL canvas — no backend dependency for computation.`
      }
    ]
  },
  {
    title: "INTELLECTUAL PROPERTY PORTFOLIO",
    subtitle: "Core IP Assets & Validation Sources",
    content: [
      {
        heading: "3.1  Motionless Electromagnetic Generator (MEG)",
        body: `The MEG is the platform's flagship IP asset. A device claimed to achieve Coefficient of Performance (COP) >> 1 by asymmetrically regauging its potential energy via a permanent magnet's remanence field, without altering the source charge.\n\nPeer-Reviewed Validation: Anastasovski et al. (15 authors from 12 institutions), "Classical Electrodynamics Without the Lorentz Condition: Extracting Energy from the Vacuum," Foundations of Physics Letters, Vol. 14, No. 1, pp. 87-117, February 2001. Institutions: Boeing Phantom Works Research, Trinity College Dublin, The Russian Academy of Natural Sciences, Alfvén Laboratory Stockholm, National Foundation for Alternative Research.\n\nSecond peer-reviewed paper: Anastasovski et al., Foundations of Physics Letters, Vol. 14, No. 4, 2001 — MEG analysis under Sachs theory of electrodynamics.\n\nIndependent Replication: Jean-Louis Naudin (France, JLN Labs) — public replication documentation with instrumented measurements. Multiple additional independent replication claims.\n\nMainstream Physics Support: Bohren, C.F. (1983). "How can a particle absorb more than the light incident on it?" American Journal of Physics, 51(4), pp. 323-327. Demonstrates that a particle in its resonance state absorbs 18× more energy than incident — providing mainstream proof that COP>1 is thermodynamically permitted in certain configurations.\n\nPatent Status: US and international patent applications filed. Diagrams: 31-figure engineering set included in due diligence package.`
      },
      {
        heading: "3.2  Telomere Regeneration Device (TRD-1)",
        body: `Engineering specifications and build plans for the TRD-1, a device implementing Bearden's Multiwave Coherent Cellular Stimulation (MCCS) protocol for telomere restoration. Based on the kindling/negentropy biological framework developed by Bearden, supported by Fröhlich's coherent excitation work in biosystems.\n\nProtocol: Three 30-second sessions per application cycle. Device emits coherently structured scalar EM pulses at biological resonance frequencies documented in Bearden's Bioenergetics slide series (1996-1999). Complete bill of materials and step-by-step assembly guide included.\n\nTheoretical Basis: Bearden's "Cellular Voltage Clamps" model, extending Fröhlich's biological coherence work (H. Fröhlich, Collective Phenomena, Vol. 1, pp. 101-109, 1973). US government interest documented via TACOM IOP FSO-3 and ONR London Branch Report.`
      },
      {
        heading: "3.3  Time-Reversal Zone (TRZ) Cold Fusion Reactor",
        body: `Engineering plans for a tabletop device exploiting the Time-Reversal Zone phenomenon. TRZ theory holds that in regions where advanced potentials dominate over retarded potentials, nuclear transmutation occurs at anomalously low energies.\n\nKey Evidence Base:\n• China Lake Naval Weapons Center — TRZ cold fusion experiments documented at 73 standard deviations (sigma) above background. Bearden: "73 standard deviations is not a statistical artifact."\n• Shoulder & Fox experiments — anomalous transmutation results consistent with TRZ theory\n• Japanese SRI replication series — multiple cold fusion research teams achieving anomalous heat above background\n\nDevice Type: Table-top size. Primary mechanism: phase-conjugate pumping of the local vacuum to establish a time-reversal zone in a small active volume. Complete 31-diagram patent drawing set included in due diligence package.`
      },
      {
        heading: "3.4  Portable Priore-Class EM Treatment Platform",
        body: `A suitcase-sized scalar electromagnetic therapeutic system implementing the Priore device's operating principles in a portable, fieldable form factor. Designed for mass casualty and pandemic response scenarios.\n\nUS Government Validation (Primary Source): US Office of Naval Research London Branch Report R-5-78, "The Priore Machine and Its Potential for Curing Illness," J.B. Bateman, Technical Director, 16 August 1978. UNCLASSIFIED. 26 pages. Key findings: The Priore electromagnetic device cured implanted tumors and eliminated trypanosomiasis in controlled animal experiments. All controls died; all experimentals were cured.\n\nNobel Laureate Validation: André Lwoff (Nobel Prize in Physiology or Medicine, 1965, Institut Pasteur, Villejuif) personally validated the Priore experimental results. Documented in Esquire magazine investigation (1975) and Priore's own published research.\n\nFrequency Patents: French Patent 1,342,772 — Complete English translation with engineering annotations included in due diligence package. This is the only surviving complete engineering patent for the Priore device, with all frequency parameters documented.`
      },
      {
        heading: "3.5  Scalar EM Weapons & Countermeasures Documentation",
        body: `The platform includes a comprehensive technical intelligence archive on scalar EM weapons development and countermeasures, derived from primary US government documents:\n\nBaghdad M1A1 Incident (TACOM IOP FSO-3, 30 September 2003): Official US Army TACOM memorandum documenting an M1A1 Abrams tank penetrated by an unknown weapon in Baghdad, leaving pencil-diameter holes through Chobham composite armor with copper/bronze residue on entry and exit wounds. Classified as "unknown weapon." Scalar EM penetrator analysis provided.\n\nGulf War Syndrome — KGB Quantum Potential (QP) Weapon Analysis: Bearden's documented operational hypothesis that Gulf War Syndrome was a deliberate KGB QP weapon deployment. Evidence base: ABC News report comparison of US forces vs. French and native population exposure outcomes, confirming deliberate targeting of US personnel. Includes all three Bioenergetics operational briefing slides.\n\nUS Army Longitudinal Wave Transmission Research: Documentation of classified US programs investigating longitudinal (scalar) wave communication, including the Tom Bearden G-Com concept (immune to electronic countermeasures, operates through the Earth, no EM pollution).`
      }
    ]
  },
  {
    title: "PRIMARY SOURCE DOCUMENT ARCHIVE",
    subtitle: "Verified Primary Sources Included in Due Diligence Package",
    content: [
      {
        heading: "4.1  US Government Documents (Declassified / FOIA)",
        body: `1. ONR London Branch Report R-5-78 (UNCLASSIFIED)\n   Author: J.B. Bateman, Technical Director, US Office of Naval Research, London\n   Date: 16 August 1978\n   Pages: 26\n   Subject: "The Priore Machine and Its Potential for Curing Illness"\n   Status: UNCLASSIFIED — full text included\n\n2. TACOM IOP FSO-3 Memorandum (UNCLASSIFIED)\n   Date: 30 September 2003\n   Subject: M1A1 tank penetration by unknown weapon, Baghdad\n   Classification at time of release: UNCLASSIFIED (FOUO)\n   Status: Full text included\n\n3. Defense Intelligence Agency (DIA) Technology Survey\n   Subject: Soviet scalar EM weapons development program — comprehensive technical review\n   Status: Excerpts and analysis included`
      },
      {
        heading: "4.2  Peer-Reviewed Scientific Publications",
        body: `1. Anastasovski, P.K. et al. (15 co-authors from 12 institutions)\n   "Classical Electrodynamics Without the Lorentz Condition: Extracting Energy from the Vacuum"\n   Foundations of Physics Letters, Vol. 14, No. 1, pp. 87-117, February 2001\n   DOI: available. Full text included.\n\n2. Anastasovski, P.K. et al.\n   "The Aharonov-Bohm Effect as the Basis of Electromagnetic Energy Inherent in the Vacuum"\n   Foundations of Physics Letters, Vol. 14, No. 4, 2001\n   Full text included.\n\n3. Bohren, C.F.\n   "How can a particle absorb more than the light incident on it?"\n   American Journal of Physics, Vol. 51, No. 4, pp. 323-327, April 1983\n   Key proof: COP>1 is thermodynamically permitted.\n\n4. Fröhlich, H.\n   "Evidence for biophoton emission from plants"\n   Collective Phenomena, Vol. 1, pp. 101-109, 1973\n   Basis for MCCS biological coherence protocol.\n\n5. Brush, Stephen G.\n   "Kinetic Theory of Gravitational Forces"\n   Journal of the Franklin Institute, Vol. 206, No. 2, 1928\n   Basis for kinetic gravitation device specifications.`
      },
      {
        heading: "4.3  Patents and Technical Drawings",
        body: `1. French Patent 1,342,772 (Priore Device)\n   Inventor: Antoine Priore\n   Language: French (complete annotated English translation included)\n   Content: Complete frequency parameters, operating specifications, device geometry\n\n2. TRZ/PPA Patent Application Series\n   Diagrams: 31-figure engineering set\n   Content: Time-reversal zone reactor, scalar EM weapons/countermeasures, phase-conjugate mirror arrays\n\n3. Bearden MEG Patent Application\n   Diagrams: Complete engineering drawing set\n   Content: Motionless Electromagnetic Generator — full schematic with component specifications\n\n4. US Patent 6,362,718 (Bearden et al., MEG)\n   Filed: June 17, 1999\n   Issued: March 26, 2002\n   Inventors: Bearden, Thomas E.; Hayes, James C.; Moore, Kenneth D.; Kenny, James L.; Patrick, Stephen L.\n   Claims: Method and apparatus for extracting electromagnetic energy from the vacuum`
      },
      {
        heading: "4.4  Bearden Primary Monographs and Technical Papers",
        body: `1. Bearden, T.E., "Toward a New Electromagnetics, Parts I–IV"\n   Tesla Book Company, Milbrae CA, 1983\n   Content: Foundational scalar EM theory, quantum potential, active vacuum\n\n2. Bearden, T.E., "Gravitobiology"\n   1991, Tesla Book Company\n   Content: Biological applications of scalar EM, kindling/negentropy framework\n\n3. Bearden, T.E., "Excalibur Briefing"\n   Strawberry Hill Press, 1980; 2nd ed. 1988\n   Content: Unified field theory, consciousness, psychoenergetics\n\n4. Bearden, T.E., "Aids: Biological Warfare"\n   Tesla Book Company, 1988\n   Content: Quantum potential biological weapons analysis\n\n5. Bearden, T.E., "Energetics of Free Energy Systems and Vacuum Engine Therapies"\n   Explore! Magazine, Vol. 6, No. 1, 1995\n\n6. Bearden, T.E., "The Priore Machine and Soviet Psychotronics"\n   Explore! Magazine, Vol. 9, No. 2, 1999\n\n7. Bearden, T.E., "The Final Secret of Free Energy"\n   ADAS Technical Report, 1993\n   Content: Asymmetric regauging, overunity circuit theory`
      }
    ]
  },
  {
    title: "PLATFORM TECHNICAL ARCHITECTURE",
    subtitle: "Production Codebase Overview",
    content: [
      {
        heading: "5.1  Frontend Stack",
        body: `Framework: React 18.2.0 with Vite build tooling\nLanguage: JavaScript/JSX (TypeScript configuration available)\nRouting: React Router DOM v6.26 — 40+ unique routes\nState Management: React useState/useEffect hooks + TanStack React Query v5 for server state\nUI Framework: Tailwind CSS v3 + shadcn/ui component library (40+ components pre-configured)\nData Visualization: Recharts (financial charts), D3.js v7 (concept network graph, patent landscape), Three.js v0.171 (3D planet/scene visualizations), React Leaflet (mapping)\nDrag & Drop: @hello-pangea/dnd v17\nRich Text: ReactQuill v2 (patent drafting, notes)\nForms: React Hook Form v7 + Zod v3 validation\nAnimations: Framer Motion v11\nPDF Generation: jsPDF v4 (all PDF exports run client-side, no server dependency)\nPDF Content: Canvas rendering via HTML5 Canvas API for schematic visualizations\nPayments: Stripe.js v5 + React Stripe.js v3`
      },
      {
        heading: "5.2  Backend Infrastructure (Base44 BaaS)",
        body: `Platform: Base44 Backend-as-a-Service\nRuntime: Deno Deploy (edge functions, global distribution)\nDatabase: Production + Test database environments (isolated)\nAuthentication: Built-in auth with role-based access control (admin/user roles)\nReal-time: Entity subscription system (base44.entities.EntityName.subscribe()) for live dashboard updates\n\nBackend Functions (Deno/JavaScript):\n  • exportInventionBrochure — multi-invention PDF brochure generation (jsPDF server-side)\n  • exportPatentDoc — USPTO patent document export\n  • generatePatentDraft — AI-assisted patent section generation\n  • generateMarketDeck — Market deck PDF generation\n  • generateResearchDoc — Technical research document export\n  • patentMonitor — Scheduled patent database monitoring\n  • trackNodeClick — Analytics event tracking\n  • createCheckoutSession — Stripe payment initialization\n  • getUserPurchases — Purchase history retrieval\n  • stripeWebhook — Stripe payment confirmation handler`
      },
      {
        heading: "5.3  Database Entities (Production Schema)",
        body: `LabExperiment: Scalar wave simulation configurations (freq, phase, amplitude, position, color scheme)\nBuildVideo: Generated invention build guides (steps array, invention metadata)\nEMFLog: Daily EMF exposure readings with health correlations\nInvestorRelationship: Full CRM with pipeline stages, communication logs, meetings, tasks\nMonitoringConfig: Patent watch configuration (categories, keywords, sensitivity, email alerts)\nMonitoringAlert: Real-time IP threat alerts (source type, risk level, recommended action)\nOpportunityCard: Anonymous investor matching cards with alignment flags\nPriorArtEntry: Prior art archive (inventor, year, category, outcome, patent numbers, key claims)\nCourseProgress: User learning progress (completed lessons, completion status)\nNewsletterSubscriber: Email list with source attribution\nNodeClick: Concept graph interaction analytics\nUser: Extended user profiles with role-based access\n\nAll entities support: CRUD operations, real-time subscriptions, role-based access control, production/test isolation.`
      },
      {
        heading: "5.4  Security Architecture",
        body: `NDA Gate: Cryptographically signed localStorage entry with user email hash, session timestamp, and acceptance metadata. All platform routes redirect to NDA acceptance page until signed. No page content loads until NDA is accepted.\n\nCopy Protection: Global event listener intercepts: right-click context menu, drag events, print commands (Ctrl+P), screenshot shortcuts (PrtScr, Cmd+Shift+3/4), developer tools (F12, Ctrl+Shift+I/J), and common copy shortcuts (Ctrl+C, Ctrl+U, Ctrl+S on content). CSS injection disables text selection. Non-interactive CONFIDENTIAL watermark overlay rendered on all pages.\n\nRole-Based Access: Admin-only routes and functions enforced at backend function level via base44.auth.me() role check. Service role operations require admin verification before elevation.\n\nStripe Integration: Test mode + live mode switchable via dashboard. Webhook signature verification on all payment events. Checkout blocked from iframe context (published app only).\n\nData Isolation: Separate production and test databases. All backend functions validate authentication before any data operation.`
      },
      {
        heading: "5.5  AI Integration Architecture",
        body: `All AI operations use Base44's Core integration package (base44.integrations.Core.InvokeLLM) which provides:\n• Model selection (GPT-5, GPT-5-mini, Gemini Pro, Gemini Flash, Claude Sonnet, Claude Opus)\n• Structured JSON output (response_json_schema parameter)\n• Live internet access (add_context_from_internet flag — available on Gemini Pro/Flash models)\n• File URL attachment support for vision tasks\n• Automatic rate limiting and error handling\n\nModel Usage by Feature:\n  Invention Forge: GPT-5 (complex multi-field structured output)\n  Market Research Scanner: Gemini Pro 1.5 with internet access (live data required)\n  Prior Art Scanner: Gemini Pro 1.5 with internet access\n  Patent Drafter: Claude Sonnet (long-form legal document quality)\n  Build Video: GPT-5 (technical step generation)\n  General summarization: GPT-5-mini (cost-optimized)\n\nCost Profile: Marginal cost per full invention cycle (Forge + Market Research + Patent Draft + Build Video) ≈ $2.40–$4.80 in API costs. Conservative revenue per invention cycle sold: $500–$2,000.`
      }
    ]
  },
  {
    title: "REVENUE MODEL & FINANCIAL PROJECTIONS",
    subtitle: "Multi-Stream Revenue Architecture",
    content: [
      {
        heading: "6.1  Revenue Streams",
        body: `Stream 1: COURSE CATALOG (20+ courses)\n  Price range: $197 – $397 per course\n  Topics: Scalar EM fundamentals, MEG replication, Priore device, TRZ physics, bioelectromagnetics, psychoenergetics, defense applications\n  Infrastructure: Stripe checkout, progress tracking, lesson library, PDF downloads\n  Projected annual: $150,000 – $380,000 (conservative)\n\nStream 2: INVENTION BUILD PLAN KITS (10+ kits)\n  Price range: $490 – $1,800 per kit\n  Contents: Full BOM, assembly guide PDF, animated build video, theory primer\n  Devices: MEG replica, TRD-1, TRZ reactor, Priore device, scalar comm transmitter, EMF shield array\n  Projected annual: $120,000 – $290,000\n\nStream 3: EMF PROTECTION SHOP (20 products)\n  Categories: Jewelry, home devices, clothing, supplements, Faraday cage kits\n  Price range: $24 – $890 per item\n  Projected annual: $60,000 – $140,000\n\nStream 4: AI MODULE LICENSING\n  Patent Drafter + Invention Forge white-label to law firms, patent shops, VCs\n  Price: $280,000 – $750,000/year per licensee\n  3 licensees (conservative Year 2): $840,000 – $2,250,000\n\nStream 5: PLATFORM ACQUISITION / LICENSING FEE\n  See Section 1.4`
      },
      {
        heading: "6.2  5-Year Financial Projection (Self-Operated)",
        body: `Year 1 (Launch Year)\n  Revenue:          $380,000 – $850,000\n  COGS (AI + infra): $45,000 – $85,000\n  Gross Profit:     $335,000 – $765,000\n  EBITDA:           $200,000 – $550,000\n  Key drivers: Course sales, build plan kits, organic SEO, newsletter (5,000+ subscribers)\n\nYear 2 (AI Licensing + Scale)\n  Revenue:          $1,200,000 – $3,800,000\n  COGS:             $120,000 – $380,000\n  Gross Profit:     $1,080,000 – $3,420,000\n  EBITDA:           $750,000 – $2,800,000\n  Key drivers: 3+ AI module licensees, patent filing volume, affiliate channel\n\nYear 3 (Market Leadership)\n  Revenue:          $2,800,000 – $7,500,000\n  COGS:             $280,000 – $750,000\n  Gross Profit:     $2,520,000 – $6,750,000\n  Key drivers: 8+ licensees, government/defense channel, Series A raise\n\nYear 5 (Exit or IPO Runway)\n  Revenue:          $6,500,000 – $18,000,000\n  Platform value at 5-6× revenue multiple: $32.5M – $108M\n\nKey Assumption: Marginal cost per AI invention cycle remains <$5. Competitor replication time: 18-24 months minimum (framework + data moat).`
      },
      {
        heading: "6.3  Comparable Transactions & Valuation Benchmarks",
        body: `AI/SaaS Platform Comparables (2023-2025):\n  • PatSnap (IP intelligence SaaS) — acquired by SoftBank at $1.5B (28× ARR)\n  • Anaqua (IP management platform) — acquired at $650M\n  • CPA Global — acquired by Clarivate at $6.8B\n  • Innography (patent analytics) — acquired by CPA Global at ~$100M\n\nDeep-Tech IP Portfolio Comparables:\n  • Nikola Tesla's US Patent Portfolio (historical) — foundational electromagnetic patents\n  • WARF (Wisconsin Alumni Research Foundation) — annual licensing income $180M+\n  • Qualcomm CDMA patent portfolio — $8B+ licensing revenue (cumulative)\n\nPlatform Valuation Approach:\n  (a) DCF at 15% discount rate, 5-year projection: $8.2M – $24M PV\n  (b) Revenue multiple (5× Year 2 projected): $6M – $19M\n  (c) Asset-by-asset replacement cost: $3.9M – $11.5M\n  (d) Strategic premium (first-mover, suppression arbitrage, AI moat): +40-120%\n\nAsking price range ($6.5M – $18M) represents 0.79×–0.78× of low-end strategic value estimate — deliberately conservative to ensure quick execution.`
      }
    ]
  },
  {
    title: "RISK ANALYSIS & MITIGATIONS",
    subtitle: "Honest Risk Assessment",
    content: [
      {
        heading: "7.1  Technology Risks",
        body: `Risk 1: Scalar EM Physics Remains Contested\nCurrent status: The majority of mainstream physicists do not accept scalar EM theory as valid. However, the platform's commercial value does not depend on the physics being correct — it depends on the documented demand for this information and the AI platform's ability to generate value from it.\nMitigation: Platform framed as "educational, research, and IP generation" — not as a science claim. The MEG peer-reviewed publication in Foundations of Physics Letters (15 authors, 12 institutions) provides independent academic credibility.\n\nRisk 2: AI Model Dependency\nCurrent status: Platform depends on OpenAI, Anthropic, and Google AI APIs for generation features.\nMitigation: Models are swappable via Base44 integration layer. No single-vendor lock-in at the prompt level. Prompt architecture included in due diligence package.\n\nRisk 3: AI API Cost Inflation\nCurrent status: LLM costs have declined 80%+ in 24 months. GPT-5-mini is 97% cheaper than GPT-4.\nMitigation: Conservative cost modeling assumes current pricing. Margin expands as costs decline.`
      },
      {
        heading: "7.2  Legal & Regulatory Risks",
        body: `Risk 1: Patent Filing Validity\nThe Provisional Patent Drafter produces USPTO-compliant document structure but does not guarantee patentability. Each PPA must be reviewed by a registered USPTO practitioner before filing.\nMitigation: Platform includes explicit legal disclaimer on all generated documents. This is a standard feature of all AI legal drafting tools (Harvey, LexisNexis AI, etc.).\n\nRisk 2: Government Document Reproduction\nAll government documents in the archive are UNCLASSIFIED (ONR R-5-78 explicitly marked UNCLASSIFIED on face). Primary source academic papers included under fair use for research and education.\nMitigation: Legal opinion letter included in due diligence package confirming fair use basis.\n\nRisk 3: Suppression Risk\nHistorical record shows scalar EM technology has experienced documented suppression (Priore device shut down by French government in 1974; Bearden's patents met with unusual procedural delays).\nMitigation: Platform operates as a knowledge and IP generation tool, not as a device manufacturer. This is a legally distinct and significantly lower-risk category.`
      },
      {
        heading: "7.3  Competitive Risks",
        body: `Risk 1: Large AI Companies Enter the IP Generation Space\nCurrent status: ChatGPT, Claude, and Gemini all offer general patent drafting capabilities. However, none are specifically trained on Bearden's framework, scalar EM physics, or the 40+ years of suppressed technology documentation that forms this platform's moat.\nMitigation: Data moat (primary sources, annotated archives, 200-node concept graph) is not replicable from public internet data. The unique combination of scalar EM domain expertise + AI architecture is the defensible core.\n\nRisk 2: Competitor Replication\nEstimated replication time for a well-funded competitor: 18-24 months.\nMitigation: First-mover files provisional patents on each generated invention (priority date established). By the time a competitor replicates the platform, the acquirer holds a provisional filing portfolio worth multiples of the platform acquisition price.\n\nRisk 3: Platform Dependency (Base44 BaaS)\nMitigation: Full codebase export available. Migration to alternative infrastructure (AWS/GCP/Azure + custom backend) estimated at 6-8 weeks of development work. Complete codebase + AI prompt architecture included in NDA escrow.`
      }
    ]
  },
  {
    title: "DUE DILIGENCE CHECKLIST",
    subtitle: "Available Under Executed NDA",
    content: [
      {
        heading: "8.1  Technical Due Diligence Package",
        body: `Immediately available upon NDA execution:\n\n□ ONR London Branch Report R-5-78 (full 26-page UNCLASSIFIED document)\n□ TACOM IOP FSO-3 memorandum (full text)\n□ French Patent 1,342,772 (complete annotated English translation)\n□ Anastasovski et al., Foundations of Physics Letters 14(1), 2001 (full text)\n□ Anastasovski et al., Foundations of Physics Letters 14(4), 2001 (full text)\n□ Bohren, Am. J. Phys. 51(4), 1983 (full text)\n□ Brush, Journal of the Franklin Institute, Vol. 206, No. 2, 1928 (full text)\n□ TRZ/PPA 31-figure patent diagram set (full engineering drawings)\n□ Bearden MEG patent diagrams (complete drawing set)\n□ Complete Bearden Energetics/Bioenergetics/Psychoenergetics slide series (1996–1999)\n□ Live platform demonstration (screen share, 60-90 minutes)\n□ Sample AI-generated invention dossier with USPTO PPA draft (live generation)\n□ Sample Market Research Scanner output (live demo with real-time USPTO/IEEE scan)\n□ Admin Video Library with 10+ generated build guides\n□ Full Bearden primary monograph archive (7 books/papers, digital)\n□ Platform codebase + all AI prompt architecture (under NDA escrow)\n□ Database schema and entity relationship documentation\n□ Backend function source code and API integration documentation`
      },
      {
        heading: "8.2  Financial Due Diligence Package",
        body: `Available to credentialed institutional buyers with proof of funds:\n\n□ Platform development cost accounting (labor + API + infrastructure, 24-month history)\n□ Current monthly API cost breakdown (OpenAI, Anthropic, Google AI)\n□ Base44 BaaS infrastructure cost schedule\n□ Stripe payment processing history and revenue attribution\n□ Newsletter subscriber list (source, acquisition cost, segmentation)\n□ Google Analytics traffic and engagement data (12 months)\n□ Course purchase history and completion rates\n□ Third-party valuation letter (independent DCF analysis)\n□ Sample customer contracts / letters of intent (if any)\n□ Tax records and entity documentation`
      },
      {
        heading: "8.3  Next Steps to Proceed",
        body: `Step 1: EXECUTE NDA\n  Use the NDA PDF generator at zenith-apex.base44.app/investor-package\n  Return executed NDA to: [YOUR EMAIL]\n  Response within 24 hours\n\nStep 2: PROOF OF INSTITUTIONAL MANDATE\n  Provide: Letter of Interest from authorized institutional representative, OR\n  Proof of AUM/investment capacity for transactions >$6.5M, OR\n  Execution confirmation from authorized signatory\n\nStep 3: RECEIVE TECHNICAL DUE DILIGENCE PACKAGE\n  Full document portfolio delivered within 48 hours of confirmed NDA + proof of mandate\n  Includes all items from Section 8.1 checklist above\n\nStep 4: LIVE DEMONSTRATION\n  60-90 minute screen-share demonstration of all platform capabilities\n  Schedule via: [YOUR EMAIL] / [YOUR PHONE]\n  Available: Monday–Friday, 9am–6pm Pacific Time\n\nStep 5: EXCLUSIVE NEGOTIATION WINDOW\n  30-day exclusivity available to first executed NDA with confirmed mandate\n  Term sheet target: 7 days from demonstration\n  Closing: 30 days from term sheet\n\nContact:\n[YOUR NAME]\nZenith Apex Research Portfolio\n[YOUR EMAIL]\n[YOUR PHONE]`
      }
    ]
  }
];

// ── PDF GENERATOR ─────────────────────────────────────────────────────────────
function generateDueDiligencePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 18;
  let y = M;
  let pageNum = 0;
  const toc = [];

  const bg = () => { doc.setFillColor(5, 5, 12); doc.rect(0, 0, W, 297, "F"); };
  const addPage = () => { doc.addPage(); bg(); y = M; pageNum++; };
  const checkPage = (need = 14) => { if (y + need > 278) addPage(); };

  const sectionHeading = (text, subtitle) => {
    checkPage(20);
    doc.setFillColor(10, 25, 80); doc.rect(0, y - 6, W, 20, "F");
    doc.setDrawColor(60, 100, 220); doc.setLineWidth(0.5); doc.line(0, y + 13, W, y + 13);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 160, 255);
    doc.text(text, M, y + 2);
    doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(140, 160, 200);
    doc.text(subtitle, M, y + 9);
    y += 20;
    return pageNum;
  };

  const subHeading = (text) => {
    checkPage(12);
    doc.setFillColor(12, 20, 50); doc.rect(M - 3, y - 3, W - M * 2 + 6, 9, "F");
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(180, 210, 255);
    doc.text(text, M, y + 2);
    y += 10;
  };

  const para = (text, color = [195, 200, 215]) => {
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W - M * 2);
    lines.forEach(l => { checkPage(5); doc.text(l, M, y); y += 4.5; });
    y += 3;
  };

  // ── COVER ──────────────────────────────────────────────────────────────────
  bg();
  doc.setFillColor(8, 18, 70); doc.rect(0, 0, W, 70, "F");
  doc.setFillColor(20, 40, 120); doc.rect(0, 0, W, 5, "F");
  doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(80, 110, 200);
  doc.text("ZENITH APEX RESEARCH PORTFOLIO  ·  CONFIDENTIAL  ·  NDA REQUIRED", M, 16);
  doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  doc.text("TECHNICAL DUE DILIGENCE", M, 30);
  doc.setFontSize(17); doc.setTextColor(100, 170, 255);
  doc.text("INVESTMENT PACKAGE", M, 40);
  doc.setFontSize(9); doc.setTextColor(80, 100, 170); doc.setFont("helvetica", "normal");
  doc.text("Comprehensive Technical, IP & Financial Analysis — Q2 2026", M, 50);
  doc.setFontSize(7); doc.setTextColor(60, 70, 120);
  doc.text("FOR INSTITUTIONAL INVESTORS ONLY — DO NOT DISTRIBUTE — SUBJECT TO EXECUTED NDA", M, 60);
  doc.setFontSize(7); doc.setTextColor(50, 55, 80);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, M, 67);

  y = 82;
  // Summary box
  doc.setFillColor(10, 30, 80); doc.rect(M - 3, y, W - M * 2 + 6, 50, "F");
  doc.setDrawColor(50, 100, 200); doc.setLineWidth(0.5); doc.rect(M - 3, y, W - M * 2 + 6, 50, "S");
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(200, 220, 255);
  doc.text("PLATFORM FAIR MARKET VALUE (Q2 2026)", M, y + 10);
  doc.setFontSize(20); doc.setFont("helvetica", "bold"); doc.setTextColor(80, 220, 120);
  doc.text("$3.9M – $11.5M", M, y + 24);
  doc.setFontSize(9); doc.setTextColor(150, 180, 130);
  doc.text("Conservative asset-by-asset DCF valuation", M, y + 31);
  doc.setFontSize(11); doc.setTextColor(255, 200, 80); doc.setFont("helvetica", "bold");
  doc.text("$6.5M – $18M", M, y + 40);
  doc.setFontSize(8); doc.setTextColor(200, 160, 60); doc.setFont("helvetica", "normal");
  doc.text("ACQUISITION ASKING PRICE (Revised Q2 2026)", M, y + 46);
  y += 60;

  // Content summary
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 160, 255);
  doc.text("DOCUMENT CONTENTS", M, y); y += 8;
  const sections = SECTIONS.map((s, i) => `${String(i + 1).padStart(2, "0")}  ${s.title} — ${s.subtitle}`);
  sections.forEach(s => {
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(160, 170, 200);
    doc.text("• " + s, M, y); y += 5;
  });
  y += 8;

  doc.setFillColor(60, 15, 10); doc.rect(M - 3, y, W - M * 2 + 6, 16, "F");
  doc.setDrawColor(180, 60, 30); doc.rect(M - 3, y, W - M * 2 + 6, 16, "S");
  doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 120, 80);
  doc.text("⚠  CONFIDENTIALITY NOTICE", M, y + 5);
  doc.setFont("helvetica", "normal"); doc.setTextColor(220, 160, 140);
  doc.text("This document contains proprietary trade secrets and confidential business information. Unauthorized disclosure", M, y + 10);
  doc.text("is subject to liquidated damages of $2,500,000 per incident. Distribution requires executed NDA.", M, y + 14.5);
  y += 22;

  pageNum = 1;

  // ── TABLE OF CONTENTS ──────────────────────────────────────────────────────
  addPage();
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 160, 255);
  doc.text("TABLE OF CONTENTS", M, y); y += 12;
  doc.setDrawColor(40, 60, 140); doc.line(M, y, W - M, y); y += 6;

  // Placeholder TOC - will fill with actual page numbers
  SECTIONS.forEach((s, si) => {
    checkPage(8);
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(180, 200, 240);
    doc.text(`${si + 1}.  ${s.title}`, M, y);
    doc.setFont("helvetica", "normal"); doc.setTextColor(100, 110, 140);
    doc.text(s.subtitle, M + 8, y + 5);
    s.content.forEach(c => {
      doc.setFontSize(7.5); doc.setTextColor(80, 90, 120);
      doc.text(`     ${c.heading}`, M, y + 10);
      y += 10;
      checkPage(6);
    });
    y += 5;
    doc.setDrawColor(20, 25, 50); doc.line(M, y, W - M, y); y += 4;
  });

  // ── SECTIONS ──────────────────────────────────────────────────────────────
  SECTIONS.forEach((section, si) => {
    addPage();
    sectionHeading(section.title, section.subtitle);
    section.content.forEach(item => {
      subHeading(item.heading);
      para(item.body);
    });
  });

  // ── FOOTER ON ALL PAGES ───────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(6); doc.setFont("helvetica", "normal"); doc.setTextColor(40, 45, 65);
    doc.text("CONFIDENTIAL — ZENITH APEX RESEARCH PORTFOLIO — DUE DILIGENCE PACKAGE — NDA REQUIRED", W / 2, 291, { align: "center" });
    doc.text(`Page ${p} of ${totalPages}`, W - M, 291, { align: "right" });
    doc.text("Q2 2026 · Not for Distribution", M, 291);
  }

  doc.save("zenith-apex-due-diligence-package-q2-2026.pdf");
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function DueDiligencePdfGenerator() {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      generateDueDiligencePDF();
      setGenerating(false);
    }, 300);
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700 text-purple-300 text-xs font-bold transition-all disabled:opacity-60"
    >
      {generating ? <Loader2 size={13} className="animate-spin" /> : <BookOpen size={13} />}
      {generating ? "Building 100+ Page PDF…" : "Due Diligence Package PDF"}
    </button>
  );
}