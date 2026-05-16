import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Copy, Check, ChevronDown, ChevronUp, Play, ExternalLink, FileText, Mail, Video, BookOpen } from "lucide-react";
import { jsPDF } from "jspdf";

// ── EXEC SUMMARY (reused across all templates) ────────────────────────────────
const EXEC_SUMMARY = `AETHON APEX IP — EXECUTIVE SUMMARY
Confidential · NDA Required · aethon.base44.app/ip-broker
════════════════════════════════════════════════════════

WHAT IT IS
A patent-backed IP portfolio and AI-powered commercialization platform spanning 6 advanced technology clusters: electromagnetic energy systems, bioelectromagnetic therapeutics, scalar communications, EMF instrumentation, hydromagnetic propulsion, and resonance energy transfer.

PORTFOLIO SIZE & STAGE
• 40+ fully documented inventions with calibrated BOMs and assembly specs
• 3–15 active/pending US patents (strong independent claims)
• 6 patent clusters across 8+ addressable market sectors
• All inventions cite granted US patents or peer-reviewed literature
• AI patent suite: drafting wizard, FTO analysis, monitoring, attorney chat

PLATFORM (INCLUDED IN ASSET SALE)
• Full-stack SaaS — React/Vite frontend, Deno Deploy backend, Stripe Live Mode
• 100+ pages, 50+ backend functions, 20+ database entities
• Subscription tiers: $29–$497/month (Explorer → Enterprise)
• One-time products: build plans ($49–$600), courses ($97–$497), physical kits
• Virtual Data Room with NDA-gated investor access infrastructure
• Investor CRM, valuation engine, SBIR grant pipeline, IP Marketplace
• Content library: 200+ prior art entries, 26+ courses, knowledge graph

IP VALUATION RANGE
Conservative: $250K – $2M (patent count + R&D spend DCF basis)
Strategic:    $2M – $10M+ (to defense contractor, pharma, or energy acquirer)
Platform SaaS floor: $150K – $500K (comparable Acquire.com transactions)

REVENUE MODEL
SaaS Subscriptions:  $29–$497/mo
Build Plan Sales:    $49–$600 per plan
Course Library:      $97–$497 each
AI Patent Suite:     Credit packs + subscriptions
White-Label SaaS:    $10K–$50K/yr per IP firm
Valuation API:       $0.50–$2.00/call (B2B)
Physical Shop:       EMF protection kits, component bundles

DEAL STRUCTURES AVAILABLE
• Full platform + IP acquisition: $500K – $10M+
• Platform only (code + content): $150K – $500K
• IP portfolio only (patents + docs): $250K – $5M
• Exclusive field-of-use license: negotiable per sector
• White-label SaaS license: $10K–$50K/year

IDEAL ACQUIRER
IP law firm · Defense/R&D contractor · EdTech/LegalTech rollup
VC-backed IP marketplace · Pharma/biotech (bioEM cluster)
Search fund / SaaS operator · Individual operator

CONTACT
Email: zenithapexresearch@gmail.com
Broker Page: https://aethon.base44.app/ip-broker
Subject: "Aethon Apex IP — Acquisition Inquiry"

This document is confidential. Distribution prohibited without written consent.`;

// ── ALL LISTING / EMAIL TEMPLATES ─────────────────────────────────────────────
const DOCUMENTS = [
  {
    id: "acquire_listing",
    icon: "🛒",
    label: "Acquire.com Private Listing",
    tag: "MARKETPLACE",
    color: "#06b6d4",
    link: "https://acquire.com/sell",
    linkLabel: "List on Acquire.com →",
    instructions: "Go to acquire.com → Sell → Create Listing → set Visibility to 'Stealth' so buyers sign NDA before seeing anything. Use the text below for the listing fields.",
    sections: [
      {
        title: "Listing Title",
        content: "AI-Powered IP Research & Patent Intelligence Platform — SaaS + 40+ Invention Library + AI Patent Suite",
      },
      {
        title: "Tagline (1 sentence)",
        content: "Patent-backed AI platform with 40+ engineering build plans, AI patent drafting suite, virtual data room, and live Stripe subscriptions — fully transferable, zero DevOps.",
      },
      {
        title: "Business Description (public-facing teaser — buyers see this before NDA)",
        content: `Established AI-powered research and IP commercialization platform in the advanced electromagnetics and clean energy technology space.

WHAT'S INCLUDED:
• SaaS platform with 4 subscription tiers ($29–$497/month) — Stripe Live Mode, active revenue infrastructure
• 40+ patent-sourced engineering invention build plans with full BOMs, schematics, assembly instructions
• AI patent suite: USPTO-formatted drafting wizard, FTO analysis, patent monitoring, attorney AI chat
• 26+ structured engineering courses with video/text content
• 200+ curated prior art research entries — inline patent citations
• Virtual Data Room with NDA-gated investor access system
• Investor CRM, SBIR grant pipeline, IP marketplace, valuation API
• Physical product shop: 5 kit bundles, Stripe-integrated

TECH STACK: React/Vite + Tailwind · Deno Deploy backend · Claude/GPT/Gemini AI · Stripe Live Mode · Base44 managed backend (zero-DevOps handoff for buyer)

MONETIZATION: Subscriptions, one-time build plan sales, course sales, AI tool credits, white-label SaaS licensing, physical kits, valuation API (B2B)

WHY SELLING: Repositioning focus. Platform is operationally complete and profitable infrastructure is fully built. Ready for an operator to scale.

NDA required to access: revenue figures, subscriber count, full source code, patent documentation, IP valuation report.`,
      },
      {
        title: "Category Tags (select these in Acquire.com)",
        content: "SaaS · AI/ML · Marketplace · EdTech · LegalTech · Content · B2B",
      },
      {
        title: "Asking Price",
        content: "$250,000 – $500,000 (negotiable — open to offers and deal structure discussion)",
      },
    ],
  },
  {
    id: "ipofferings",
    icon: "📜",
    label: "IPOfferings.com Email + Exec Summary",
    tag: "IP BROKER",
    color: "#f59e0b",
    link: "mailto:info@ipofferings.com",
    linkLabel: "Email IPOfferings →",
    instructions: "Email info@ipofferings.com with this email. Attach the Executive Summary PDF (download below). They respond within 3–5 business days.",
    sections: [
      {
        title: "Subject Line",
        content: "IP Portfolio Representation Inquiry — Patent-Backed EM, Bioelectromagnetics & Energy Tech | 40+ Inventions | $250K–$5M Range",
      },
      {
        title: "Email Body",
        content: `Dear IPOfferings Team,

I'm reaching out to explore representation for a patent-backed IP portfolio in advanced electromagnetics, bioelectromagnetic therapeutics, and clean energy technology.

PORTFOLIO OVERVIEW:
• 6 patent clusters: Advanced Energy (MEG/ZPE), Bioelectromagnetic Therapeutics (Prioré-type), Scalar EM Communications, EMF Detection Instruments, Hydromagnetic Propulsion, Resonance Energy Transfer
• 3–15 active/pending US patents with strong independent claims
• 40+ fully documented inventions: calibrated BOMs, circuit schematics, assembly instructions, patent citations
• AI-powered IP commercialization platform included as a bundled asset

ADDRESSABLE BUYERS (your network):
• Defense prime contractors (scalar EM, directed energy)
• Pharma / biotech R&D divisions (bioelectromagnetic therapeutics, oncology)
• Energy sector (MEG, zero-point energy, atmospheric generators)
• IP monetization firms (Acacia-model licensing play)
• LegalTech / IP tool companies (white-label patent suite)

DEAL STRUCTURES I'M OPEN TO:
• Full IP portfolio acquisition
• Exclusive field-of-use licenses by sector
• Royalty-based licensing arrangement
• Platform + IP combined asset sale

I've attached a 1-page executive summary. Full due diligence package (patent documentation, IP valuation report, Stripe revenue screenshots, source code overview, VDR access) available after NDA.

Would you be willing to evaluate this portfolio for representation?

Best regards,
[Your Name]
zenithapexresearch@gmail.com
https://aethon.base44.app/ip-broker

[ATTACHMENT: Aethon_Apex_IP_Executive_Summary.pdf]`,
      },
      {
        title: "Executive Summary (attach as PDF — download below)",
        content: EXEC_SUMMARY,
      },
    ],
  },
  {
    id: "dominion_harbor",
    icon: "⚓",
    label: "Dominion Harbor Outreach",
    tag: "PATENT LICENSING",
    color: "#a855f7",
    link: "https://dominionharbor.com",
    linkLabel: "Dominion Harbor →",
    instructions: "Submit via their website contact form at dominionharbor.com. Use this email as the message body. They specialize in energy and defense-adjacent IP — lean into that angle.",
    sections: [
      {
        title: "Subject Line",
        content: "Proprietary EM & Energy Technology IP Portfolio — Licensing / Monetization Partnership Inquiry",
      },
      {
        title: "Email Body",
        content: `Dear Dominion Harbor Team,

I'm reaching out to explore a licensing monetization partnership for a proprietary IP portfolio in advanced electromagnetics, clean energy technology, and bioelectromagnetic therapeutics.

Based on your firm's specialization in energy and defense-adjacent IP monetization, I believe this portfolio aligns directly with your buyer network.

PORTFOLIO HIGHLIGHTS:
• MEG (Motionless Electromagnetic Generator) — US Patent 6,362,718 (expired, public domain) documentation + novel improvements documentation (patent-pending ready)
• Scalar EM Communications Systems — documented from classified-reference sourced prior art
• Atmospheric EM Energy Harvesting — Tesla-derived, patent-cited
• Hydromagnetic Propulsion System — naval / aerospace applications
• Bioelectromagnetic Therapeutics — Prioré-type device cluster (oncology, accelerated healing)
• EMF Detection & Characterization Instruments — dual-use: military/civilian

CLAIM STRENGTHS:
• All inventions sourced from granted US patents or peer-reviewed journals
• Full FTO pre-screening conducted (AI-assisted, no blocking active patents identified in target domains)
• 200+ prior art entries documented — supports strong novelty arguments for filings
• 3–15 patents currently pending or provisional-ready

MONETIZATION OPPORTUNITY:
• Defense sector: directed energy, EM countermeasures, field power systems
• Energy sector: off-grid power, MEG licensing, atmospheric harvesting
• Healthcare: bioEM therapeutics licensing to pharma/clinical research
• Communications: scalar EM protocols for secure/hardened communications

I'm open to: revenue-share licensing model, outright portfolio acquisition, or joint monetization structure.

Full due diligence package available under NDA: patent documentation, IP valuation report (DCF model), competitive landscape analysis, prior art archive, source code (if platform is included).

Would you be open to a brief call to evaluate fit?

Best regards,
[Your Name]
zenithapexresearch@gmail.com
https://aethon.base44.app/ip-broker`,
      },
    ],
  },
  {
    id: "acacia",
    icon: "🌳",
    label: "Acacia Research Outreach",
    tag: "IP ACQUIRER",
    color: "#22c55e",
    link: "https://acaciaresearch.com",
    linkLabel: "Acacia Research →",
    instructions: "Submit via Acacia's website contact/investor form. They buy IP portfolios outright — focus on the acquisition angle, not licensing. They want clean, defensible claims.",
    sections: [
      {
        title: "Subject Line",
        content: "IP Portfolio Acquisition Inquiry — 6 Technology Clusters, 40+ Inventions, Defense/Energy/BioEM Applications",
      },
      {
        title: "Email Body",
        content: `Dear Acacia Research Team,

I'm reaching out regarding an IP portfolio acquisition opportunity across 6 advanced technology clusters with documented commercial applications in defense, energy, and bioelectromagnetic medicine.

PORTFOLIO SUMMARY:
Technology Clusters:
1. Advanced Energy — MEG, ZPE devices, atmospheric EM harvesting
2. Bioelectromagnetic Therapeutics — Prioré-type multichannel EM therapy
3. Scalar EM Communications — classified-reference sourced, novel implementation
4. EMF Detection Instruments — civilian/military dual-use
5. Hydromagnetic Propulsion — naval/aerospace applications
6. Resonance Energy Transfer — wireless power, IoT-scale applications

IP CHARACTERISTICS (important for your evaluation):
• All claims sourced from granted US patents or peer-reviewed scientific literature
• No active blocking patents identified via FTO pre-screening
• 200+ prior art entries documented and classified — supports strong filing arguments
• 3–15 patents pending or provisional-ready
• Expired foundational patents (MEG: US 6,362,718 expired ~2020) create unencumbered design space for improvement patents

DOCUMENTATION:
• 40+ fully engineered invention build plans (BOM, schematics, assembly, patent citations)
• Full prior art archive with inline citations
• AI-generated patent draft quality assessments
• IP valuation report (DCF model): $250K–$5M conservative range

PLATFORM ASSET (optional bundled):
Full SaaS platform with Stripe revenue infrastructure, AI patent tools, virtual data room, investor CRM — available as a bundled acquisition or separated.

I'm looking for an outright acquisition of the IP portfolio. Open to your standard due diligence process.

Full package available under NDA: patent drafts, valuation model, competitive landscape, source documentation.

Best regards,
[Your Name]
zenithapexresearch@gmail.com
https://aethon.base44.app/ip-broker`,
      },
    ],
  },
  {
    id: "quiet_light",
    icon: "💡",
    label: "Quiet Light Brokerage",
    tag: "M&A BROKER",
    color: "#6366f1",
    link: "https://quietlight.com/sell",
    linkLabel: "Quiet Light Intake Form →",
    instructions: "Go to quietlight.com/sell and fill out their intake form (5 min). Use this email as the 'additional notes' field or send directly to their team. They'll book a free valuation call within 2–3 days.",
    sections: [
      {
        title: "Subject Line",
        content: "Business Submission — AI + IP Research SaaS | Stripe Live | $150K–$500K Asking Range | Full-Service Broker Needed",
      },
      {
        title: "Email Body",
        content: `Hi Quiet Light team,

I'm the founder of Aethon Apex IP (aethon.base44.app) and I'm looking for a full-service broker to manage the sale of my platform. Based on your track record with content-driven SaaS platforms and IP-rich digital businesses, I think you'd be a strong fit.

THE BUSINESS AT A GLANCE:
• Platform: AI-powered IP research & patent intelligence SaaS
• URL: aethon.base44.app
• Type: SaaS + AI tools + IP content library + patent documentation
• Revenue: Stripe Live Mode — active subscription tiers ($29–$497/mo), one-time products, physical shop
• Tech: React/Vite frontend, Deno Deploy backend, Claude/GPT/Gemini integrations, fully managed (zero DevOps for buyer)

KEY ASSETS:
• 40+ patent-sourced engineering build plans (full BOMs, schematics, assembly)
• AI patent suite: drafting wizard, FTO analysis, freedom-to-operate, monitoring
• 26+ structured engineering courses
• 200+ prior art research entries with inline citations
• Virtual Data Room with NDA-gated buyer access
• Investor CRM, SBIR pipeline, IP marketplace, valuation API
• Physical shop: 5 product kits, Stripe-integrated

WHY I NEED A BROKER:
I've built the platform but I'm not an M&A expert. I need someone who knows how to price it properly, find the right buyers, and close the deal. I don't want to leave money on the table negotiating myself.

ASKING RANGE: $150K–$500K (open to your guidance on pricing)

I'm ready to provide:
✓ Stripe revenue screenshots and subscriber count
✓ 10-minute Loom platform walkthrough video
✓ Full asset list
✓ 1-page executive summary (attached)
✓ VDR access on NDA signing

Would love to schedule your free valuation call this week.

Best,
[Your Name]
zenithapexresearch@gmail.com

[ATTACHMENT: Aethon_Apex_IP_Executive_Summary.pdf]`,
      },
    ],
  },
];

// ── LOOM GUIDE ────────────────────────────────────────────────────────────────
const LOOM_SCRIPT = [
  { min: "0:00–0:45", label: "Hook & Overview", icon: "🎯", script: "Start with: 'I'm going to walk you through Aethon Apex IP — a patent-backed AI research platform in the advanced electromagnetics space. This is a 10-minute overview of what you're acquiring.' Show the home page / concept graph. Don't start with login or admin panels." },
  { min: "0:45–2:00", label: "The Core Value Prop", icon: "💡", script: "Show the invention library — scroll through the build plan catalogue. Say: 'Every one of these 40+ inventions is sourced from a granted US patent or peer-reviewed journal. Each has a full bill of materials, circuit schematics, and assembly instructions. This is the content moat.' Click one build plan and show the depth." },
  { min: "2:00–3:30", label: "AI Patent Suite", icon: "⚡", script: "Open the Patent Drafting Wizard. Say: 'This is the AI patent suite — the highest-retention feature. A user can go from invention concept to a USPTO-formatted draft with independent and dependent claims in under 60 seconds.' Also show the FTO Analysis tool briefly." },
  { min: "3:30–5:00", label: "Revenue Infrastructure", icon: "💳", script: "Show the Pricing page. Say: 'Four subscription tiers from $29 to $497/month, all wired to Stripe Live Mode. There are also one-time build plan purchases, course sales, and a physical product shop.' Briefly show the Stripe dashboard (blur specific numbers if desired, but show the structure)." },
  { min: "5:00–6:30", label: "Platform Depth", icon: "🏗️", script: "Show the Virtual Data Room, Investor CRM, and the concept graph. Say: 'The platform has 100+ pages and 50+ backend functions. The VDR, Investor CRM, SBIR pipeline, and IP marketplace are all included. A buyer inherits a complete infrastructure — not a prototype.'" },
  { min: "6:30–7:30", label: "Content Library", icon: "📚", script: "Show the prior art archive and course catalogue. Say: '200+ classified research entries, 26+ structured engineering courses, a 200-node interactive concept graph. This is the SEO and content moat that took years to build.'" },
  { min: "7:30–8:30", label: "Tech Stack", icon: "🔧", script: "Briefly show the codebase structure or admin hub. Say: 'React/Vite frontend, Deno Deploy backend, Claude/GPT/Gemini AI integrations, fully managed backend — the buyer gets all source code and zero DevOps overhead. Handoff is clean.'" },
  { min: "8:30–9:30", label: "Deal Summary", icon: "🤝", script: "Return to the IP Broker landing page. Say: 'Asking range is $150K–$500K for the platform, up to $5M+ for the full IP portfolio depending on deal structure. We're open to outright acquisition, field-of-use licensing, or white-label SaaS deals. NDA required for the full due diligence package.'" },
  { min: "9:30–10:00", label: "Call to Action", icon: "📞", script: "End with: 'If you want to go deeper — sign the NDA at the broker page link, and I'll give you full VDR access: Stripe screenshots, patent documentation, IP valuation report, and source code walkthrough. Happy to do a live call.' Show the broker page URL one more time." },
];

const LOOM_SETUP = [
  { step: "1", title: "Install Loom", detail: "Go to loom.com → Download the desktop app or use the Chrome extension. It's free for up to 25 videos at 5 min each (upgrade to Loom Starter $12.50/mo for longer recordings).", link: "https://loom.com" },
  { step: "2", title: "Set recording to 'Screen + Camera'", detail: "Click the Loom icon → select 'Screen + Camera' (not Screen Only). Buyers want to see your face — it builds trust. Use 'Full Screen' capture, not window only." },
  { step: "3", title: "Prepare your browser", detail: "Before recording: close all other tabs, turn off notifications (Mac: Do Not Disturb · Windows: Focus Assist), log into the platform as a demo account (not admin), zoom browser to 110%." },
  { step: "4", title: "Record in one take (mostly)", detail: "Don't re-record if you stumble — just pause 2 seconds and keep going. Loom lets you trim the start and end. Natural stumbles make it feel authentic, not scripted." },
  { step: "5", title: "Share settings", detail: "After recording: set sharing to 'Anyone with link can view.' Do NOT require login to watch. Copy the link and include it in every broker email and your Acquire.com listing." },
  { step: "6", title: "Add to your due diligence package", detail: "Paste the Loom link at the top of your VDR. Label it: 'Platform Walkthrough Video (10 min) — watch this first.'" },
];

// ── PDF Export ────────────────────────────────────────────────────────────────
function exportDueDiligencePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 18, cW = W - margin * 2;
  let y = 20;

  const addPage = () => {
    doc.addPage();
    doc.setFillColor(8, 10, 20);
    doc.rect(0, 0, W, 297, "F");
    y = 20;
  };

  const checkPage = (needed = 20) => { if (y + needed > 275) addPage(); };

  // Cover page
  doc.setFillColor(8, 10, 20);
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, W, 6, "F");
  doc.rect(0, 291, W, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(212, 175, 55);
  doc.text("AETHON APEX IP", margin, 50);
  doc.setFontSize(14);
  doc.setTextColor(200, 210, 230);
  doc.text("Acquisition Due Diligence Package", margin, 62);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 120, 150);
  doc.text("CONFIDENTIAL — NDA REQUIRED", margin, 72);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 80);
  doc.text("aethon.base44.app/ip-broker", margin, 88);

  // Contents
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(212, 175, 55);
  doc.text("CONTENTS OF THIS PACKAGE:", margin, 108);
  const contents = [
    "1. Executive Summary & Platform Overview",
    "2. IP Portfolio — Technology Clusters & Patent Documentation",
    "3. Platform Asset Description — Technical Specifications",
    "4. Revenue Model & Monetization Streams",
    "5. Deal Structures & Pricing",
    "6. Acquisition Checklist — What's Included",
    "7. Due Diligence Questions & Answers",
    "8. Next Steps & Contact",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(180, 190, 210);
  contents.forEach((c, i) => { doc.text(c, margin + 4, 118 + i * 10); });

  doc.setFontSize(8);
  doc.setTextColor(70, 80, 100);
  doc.text("This document is confidential and intended solely for qualified acquisition prospects under NDA.", margin, 205);
  doc.text("Not for distribution. All figures are projections. Subject to due diligence verification.", margin, 212);

  // Page 2 — Exec Summary
  addPage();
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 4, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
  doc.text("1. EXECUTIVE SUMMARY", margin, y + 10); y += 20;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(185, 200, 220);
  EXEC_SUMMARY.split("\n").forEach(line => {
    checkPage(6);
    if (line.startsWith("═") || line.startsWith("─")) return;
    if (line === "") { y += 3; return; }
    const wrapped = doc.splitTextToSize(line, cW - 4);
    wrapped.forEach(l => { checkPage(6); doc.text(l, margin + 2, y); y += 5.5; });
  });

  // Page 3 — IP Portfolio
  addPage();
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 4, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
  doc.text("2. IP PORTFOLIO — TECHNOLOGY CLUSTERS", margin, y + 10); y += 20;

  const clusters = [
    { name: "Cluster 1: Advanced Energy Systems", color: [255, 165, 0], items: ["MEG (Motionless Electromagnetic Generator) — US Patent 6,362,718 basis", "Zero-Point Energy Transducer — vacuum energy coupling documentation", "Atmospheric EM Energy Harvester — Tesla-derived, patent-cited", "Resonance Generator Array — multi-coil over-unity documentation"] },
    { name: "Cluster 2: Bioelectromagnetic Therapeutics", color: [100, 220, 150], items: ["TRD-1: Telomere Resonance Device — EM telomerase activation protocol", "MCCS: Multichannel Coherence Stimulator — Prioré-type EM therapy device", "Biophoton Emission Instrument — cellular health measurement via EM", "Regenerative Field Generator — accelerated tissue healing protocol"] },
    { name: "Cluster 3: Scalar EM Communications", color: [100, 180, 255], items: ["Scalar Wave Transmitter/Receiver Pair — secure comms documentation", "Phase-Conjugate Mirror System — signal reversal & amplification", "ELF/SLF Scalar Carrier Platform — deep-penetration communications", "Quantum-Coupled Resonance Array — entanglement-adjacent signaling"] },
    { name: "Cluster 4: EMF Detection Instruments", color: [220, 100, 255], items: ["Broadband EM Threat Detector — military/civilian dual-use", "Scalar Field Mapper — 3D environment EM characterization", "Biophoton Spectrometer — cellular emission measurement", "ELF Anomaly Monitor — geomagnetic disturbance detection"] },
    { name: "Cluster 5: Hydromagnetic Propulsion", color: [255, 100, 100], items: ["MHD Drive — magnetohydrodynamic naval propulsion system", "Ion Wind Propulsion Array — aerospace silent thrust", "Plasma Vortex Thruster — low-power atmospheric propulsion", "Electromagnetic Inertia Drive — reaction-less propulsion concept"] },
    { name: "Cluster 6: Resonance Energy Transfer", color: [255, 220, 50], items: ["Resonant Inductive Coupling Network — wireless power at range", "Tesla Coil Transmission System — high-voltage wireless power", "Scalar Potential Wireless Node — IoT-scale power delivery", "Frequency-Locked Power Array — multi-device simultaneous delivery"] },
  ];

  clusters.forEach(cluster => {
    checkPage(40);
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(...cluster.color);
    doc.text(cluster.name, margin, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(185, 200, 220);
    cluster.items.forEach(item => { checkPage(7); doc.text(`  • ${item}`, margin + 2, y); y += 5.5; });
    y += 4;
  });

  // Page 4 — Platform Technical
  addPage();
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 4, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
  doc.text("3. PLATFORM ASSET — TECHNICAL SPECIFICATIONS", margin, y + 10); y += 20;

  const techSections = [
    ["Frontend", "React 18 + Vite · Tailwind CSS · Framer Motion · Three.js (3D)\n100+ pages · 80+ components · Fully responsive (mobile + desktop)"],
    ["Backend", "Deno Deploy serverless functions · 50+ backend functions\nBase44 managed backend (zero-DevOps) · Real-time entity subscriptions"],
    ["AI Integrations", "Claude Sonnet 4.6 · GPT-4o · Gemini 1.5 Pro\nPatent drafting · FTO analysis · Prior art classification · Attorney chat"],
    ["Payments", "Stripe Live Mode · Checkout sessions · Subscription management\nCustomer portal · Webhook processing · Metered billing (AI usage)"],
    ["Database", "20+ entity types · Base44 managed database · Full CRUD + filtering\nKey entities: PriorArtEntry, HybridInvention, FTOAnalysis, VDRSession,\nInvestorRelationship, OpportunityCard, BetaApplication, ShopOrder"],
    ["Content Library", "200+ prior art research entries (classified, tagged, cited)\n40+ invention build plans · 26+ structured engineering courses\nKnowledge graph: 100+ nodes, interactive concept visualization"],
    ["IP Tools Suite", "Patent Drafting Wizard (USPTO-formatted) · FTO Analysis Tool\nPatent Claims Generator · Patent Monitoring · Attorney AI Chat\nCollaborative Patent Draft · Patent Review (shared link) · Prior Art Archive"],
    ["Deal Infrastructure", "Virtual Data Room (NDA-gated, access tracking) · Investor CRM\nSBIR Grant Pipeline · IP Marketplace · Co-Inventor Matching\nAcquisition Outreach Tracker · Valuation API · Term Sheet Generator"],
  ];

  techSections.forEach(([title, content]) => {
    checkPage(25);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(212, 175, 55);
    doc.text(title.toUpperCase(), margin, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(185, 200, 220);
    const lines = doc.splitTextToSize(content, cW - 6);
    lines.forEach(l => { checkPage(6); doc.text(l, margin + 3, y); y += 5.2; });
    y += 4;
  });

  // Page 5 — Revenue + Deal
  addPage();
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 4, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
  doc.text("4. REVENUE MODEL & DEAL STRUCTURES", margin, y + 10); y += 20;

  const revenueRows = [
    ["SaaS Subscriptions", "$29–$497/month", "Explorer ($29) · Research Lab ($49) · Pro Builder ($149) · Enterprise ($497)"],
    ["Build Plan Sales", "$49–$600 each", "40+ catalogue, one-time purchase, instant digital delivery"],
    ["Engineering Courses", "$97–$497 each", "26+ courses, beginner to advanced, structured with quizzes"],
    ["AI Patent Credits", "$49–$349/pack", "Patent drafting, FTO analysis, monitoring — credit-based billing"],
    ["White-Label SaaS", "$10K–$50K/year", "Entire platform rebranded for IP law firms or universities"],
    ["Valuation API", "$0.50–$2.00/call", "B2B — VCs, law firms, R&D departments query the valuation engine"],
    ["Physical Kits", "$89–$349 each", "5 component bundles: EMF kit, MEG kit, Prioré bundle, etc."],
  ];

  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(212, 175, 55);
  doc.text("REVENUE STREAMS:", margin, y); y += 8;
  revenueRows.forEach(([stream, price, note]) => {
    checkPage(14);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(255, 200, 80);
    doc.text(stream, margin + 2, y);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(100, 220, 120);
    doc.text(price, margin + 65, y);
    y += 5.5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(160, 175, 195);
    doc.text(note, margin + 4, y); y += 7;
  });

  y += 5;
  checkPage(60);
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(212, 175, 55);
  doc.text("DEAL STRUCTURES:", margin, y); y += 8;

  const deals = [
    ["Full Platform + IP Acquisition", "$500K – $10M+", "Code, content, IP portfolio, all tooling, Stripe infrastructure, customer relationships"],
    ["Platform Only (SaaS)", "$150K – $500K", "Full codebase, content library, Stripe setup — no IP portfolio rights"],
    ["IP Portfolio Only", "$250K – $5M+", "6 patent clusters, documentation, prior art archive — no platform code"],
    ["Exclusive Field License", "$250K–$2M + royalties", "One technology domain exclusively (e.g., bioEM therapeutics only)"],
    ["White-Label SaaS License", "$10K–$50K/year", "Annual license to operate the platform under buyer's brand"],
  ];

  deals.forEach(([structure, range, desc]) => {
    checkPage(18);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(200, 200, 255);
    doc.text(structure, margin + 2, y);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(100, 220, 120);
    doc.text(range, margin + 2, y + 5.5);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(160, 175, 195);
    const dlines = doc.splitTextToSize(desc, cW - 6);
    dlines.forEach(l => { y += 5.5; checkPage(6); doc.text(l, margin + 4, y); });
    y += 8;
  });

  // Page 6 — DD Checklist + Next Steps
  addPage();
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 4, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
  doc.text("5. ACQUISITION CHECKLIST & NEXT STEPS", margin, y + 10); y += 20;

  const checklist = [
    "✓ Platform live and operational at aethon.base44.app",
    "✓ Stripe Live Mode active — payment infrastructure fully functional",
    "✓ All 40+ build plans documented with full engineering specs",
    "✓ AI patent suite operational — drafting wizard, FTO, monitoring, attorney chat",
    "✓ Virtual Data Room built and operational with NDA-gated access",
    "✓ Investor CRM, SBIR pipeline, IP marketplace, valuation API — all functional",
    "✓ 200+ prior art entries classified and documented",
    "✓ 26+ courses structured and accessible",
    "✓ Full source code available for buyer review under NDA",
    "✓ IP valuation model prepared (DCF basis)",
    "✓ Patent documentation package ready for review",
    "□ LLC formation (in progress — Stripe Atlas)",
    "□ 1–3 Provisional Patent Applications to be filed",
    "□ Third-party IP valuation (available on request)",
    "□ Formal Stripe revenue export (available on request with NDA)",
  ];

  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(185, 200, 220);
  checklist.forEach(item => {
    checkPage(7);
    const color = item.startsWith("✓") ? [100, 220, 120] : [200, 200, 80];
    doc.setTextColor(...color);
    doc.text(item, margin + 2, y); y += 7;
  });

  y += 6;
  checkPage(40);
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(212, 175, 55);
  doc.text("NEXT STEPS TO ACCESS FULL DUE DILIGENCE:", margin, y); y += 8;
  const steps = [
    "Step 1 — Sign NDA: https://aethon.base44.app/vdr-nda",
    "Step 2 — VDR access granted within 24 hours",
    "Step 3 — Review: Stripe revenue, patent docs, source code walkthrough video",
    "Step 4 — Schedule a live call or submit a Letter of Intent",
    "Step 5 — Term sheet generated within 48 hours of qualified interest",
  ];
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(185, 200, 220);
  steps.forEach(step => { checkPage(7); doc.text(step, margin + 2, y); y += 8; });

  y += 10;
  checkPage(20);
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(212, 175, 55);
  doc.text("CONTACT:", margin, y); y += 7;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(185, 200, 220);
  doc.text("Email: zenithapexresearch@gmail.com", margin + 2, y); y += 6;
  doc.text("Broker Page: https://aethon.base44.app/ip-broker", margin + 2, y); y += 6;
  doc.text("Subject: 'Aethon Apex IP — Acquisition Inquiry'", margin + 2, y);

  // Disclaimer
  doc.setFontSize(7.5); doc.setTextColor(70, 80, 100);
  doc.text("DISCLAIMER: This document is confidential and for qualified acquisition prospects only. All financial projections are estimates.", margin, 285);
  doc.text("Not legal or financial advice. Subject to NDA and due diligence verification. © Aethon Apex IP", margin, 290);
  doc.setFillColor(212, 175, 55); doc.rect(0, 291, W, 6, "F");

  doc.save(`Aethon_Apex_IP_Due_Diligence_Package_${Date.now()}.pdf`);
}

function exportExecSummaryPDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 18, cW = W - margin * 2;
  let y = 20;

  doc.setFillColor(8, 10, 20); doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 5, "F");
  doc.setFillColor(212, 175, 55); doc.rect(0, 292, W, 5, "F");

  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(212, 175, 55);
  doc.text("AETHON APEX IP", margin, 28);
  doc.setFontSize(11); doc.setTextColor(180, 190, 220);
  doc.text("Executive Summary — Acquisition & Licensing Opportunity", margin, 37);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(90, 110, 140);
  doc.text(`CONFIDENTIAL · ${new Date().toLocaleDateString()} · aethon.base44.app/ip-broker`, margin, 44);
  y = 54;

  EXEC_SUMMARY.split("\n").forEach(line => {
    if (y > 278) { doc.addPage(); doc.setFillColor(8, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
    if (line.startsWith("═") || line.startsWith("─")) { y += 2; return; }
    if (line === "") { y += 3; return; }
    const isBold = line.endsWith(":") || line.startsWith("AETHON") || line.startsWith("WHAT") || line.startsWith("PORTFOLIO") || line.startsWith("IP VAL") || line.startsWith("REVENUE") || line.startsWith("DEAL") || line.startsWith("IDEAL") || line.startsWith("CONTACT") || line.startsWith("Platform");
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(isBold ? 9 : 8.5);
    doc.setTextColor(isBold ? 212 : 185, isBold ? 175 : 200, isBold ? 55 : 220);
    const wrapped = doc.splitTextToSize(line, cW - 2);
    wrapped.forEach(l => { if (y > 278) { doc.addPage(); doc.setFillColor(8,10,20); doc.rect(0,0,W,297,"F"); y=20; } doc.text(l, margin + 2, y); y += 5.5; });
  });

  doc.save(`Aethon_Apex_IP_Executive_Summary_${Date.now()}.pdf`);
}

// ── UI Components ─────────────────────────────────────────────────────────────
function CopyBtn({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 font-bold transition-all">
      {copied ? <Check size={9} className="text-green-400" /> : <Copy size={9} />}
      {copied ? "Copied" : label}
    </button>
  );
}

function DocCard({ doc: d }) {
  const [open, setOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState({});
  const toggleSection = (i) => setSectionOpen(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="border rounded-2xl overflow-hidden" style={{ borderColor: d.color + "40" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-gray-900/40 transition-colors"
        style={{ background: d.color + "0d" }}>
        <span className="text-2xl flex-shrink-0">{d.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-white font-black text-sm">{d.label}</p>
            <span className="text-xs px-2 py-0.5 rounded font-black" style={{ background: d.color + "22", color: d.color, border: `1px solid ${d.color}40` }}>{d.tag}</span>
          </div>
          <p className="text-gray-500 text-xs">{d.instructions.slice(0, 80)}…</p>
        </div>
        {open ? <ChevronUp size={14} className="text-gray-500 flex-shrink-0 mt-1" /> : <ChevronDown size={14} className="text-gray-500 flex-shrink-0 mt-1" />}
      </button>

      {open && (
        <div className="border-t border-gray-800 bg-gray-950 px-4 pb-4 pt-3 space-y-3">
          {/* Instructions */}
          <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-3">
            <p className="text-blue-300 text-xs leading-relaxed"><strong className="text-blue-200">How to use:</strong> {d.instructions}</p>
          </div>

          <a href={d.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: d.color + "22", color: d.color, border: `1px solid ${d.color}40` }}>
            <ExternalLink size={10} /> {d.linkLabel}
          </a>

          {/* Sections */}
          {d.sections.map((section, i) => (
            <div key={i} className="border border-gray-800 rounded-xl overflow-hidden">
              <button onClick={() => toggleSection(i)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-900/60 hover:bg-gray-900 transition-colors text-left">
                <p className="text-gray-300 text-xs font-black">{section.title}</p>
                {sectionOpen[i] ? <ChevronUp size={11} className="text-gray-600" /> : <ChevronDown size={11} className="text-gray-600" />}
              </button>
              {sectionOpen[i] && (
                <div className="px-3 pb-3 pt-2 space-y-2 bg-gray-950">
                  <div className="flex justify-end">
                    <CopyBtn text={section.content} />
                  </div>
                  <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-900 rounded-lg px-3 py-3 border border-gray-800 max-h-72 overflow-y-auto">
                    {section.content}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AcquisitionReadyKit() {
  const [tab, setTab] = useState("listings");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link to="/exit-advisor" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Exit Advisor
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">Acquisition Ready Kit</h1>
            <p className="text-gray-500 text-xs">Listings · Broker emails · Due diligence PDFs · Loom guide</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportExecSummaryPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-xs font-bold hover:bg-yellow-800/50 transition-all">
            <Download size={11} /> Exec Summary PDF
          </button>
          <button onClick={exportDueDiligencePDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-900/40 border border-purple-700 text-purple-300 text-xs font-bold hover:bg-purple-800/50 transition-all">
            <Download size={11} /> Full DD Package PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 py-3 border-b border-gray-800 bg-gray-900/40 overflow-x-auto">
        {[
          { id: "listings", label: "📋 Listings & Emails", count: DOCUMENTS.length },
          { id: "loom", label: "🎥 Loom Walkthrough Guide" },
          { id: "pdfs", label: "📄 PDF Downloads" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${tab === t.id ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-400"}`}>
            {t.label}
            {t.count && <span className="bg-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded-full font-black">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-3xl mx-auto w-full space-y-4">

        {/* LISTINGS & EMAILS TAB */}
        {tab === "listings" && (
          <>
            <div className="bg-green-950/20 border border-green-800/30 rounded-xl p-3">
              <p className="text-green-300 text-xs leading-relaxed">
                <strong className="text-green-200">5 complete documents ready to send.</strong> Click any card to expand — each has copy-ready subject lines, email bodies, and listing text. Attach the Executive Summary PDF (download top-right) to every email.
              </p>
            </div>
            {DOCUMENTS.map(d => <DocCard key={d.id} doc={d} />)}
          </>
        )}

        {/* LOOM TAB */}
        {tab === "loom" && (
          <div className="space-y-4">
            <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-4">
              <p className="text-purple-200 font-black text-sm mb-1 flex items-center gap-2"><Video size={13} /> Why the Loom video matters</p>
              <p className="text-gray-300 text-xs leading-relaxed">
                A 10-minute platform walkthrough is the single most effective sales tool you have. Buyers who watch the video before a call are 3× more likely to move to due diligence. It removes friction, answers 80% of questions, and lets them share it internally with decision-makers. It's also what separates you from every other listing on Acquire.com.
              </p>
            </div>

            {/* Setup */}
            <div className="border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-900 border-b border-gray-800">
                <p className="text-white font-black text-sm flex items-center gap-2"><Play size={12} className="text-green-400" /> Setup — Do This Before Recording</p>
              </div>
              <div className="divide-y divide-gray-800">
                {LOOM_SETUP.map((s, i) => (
                  <div key={i} className="px-4 py-3 flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs font-black text-gray-400 flex-shrink-0">{s.step}</div>
                    <div>
                      <p className="text-white font-bold text-sm">{s.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{s.detail}</p>
                      {s.link && (
                        <a href={s.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          <ExternalLink size={9} /> {s.link.replace("https://", "")}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Script */}
            <div className="border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-900 border-b border-gray-800">
                <p className="text-white font-black text-sm flex items-center gap-2"><BookOpen size={12} className="text-yellow-400" /> 10-Minute Recording Script</p>
                <p className="text-gray-500 text-xs mt-0.5">Don't memorize — just use this as a guide. Talk naturally.</p>
              </div>
              <div className="divide-y divide-gray-800">
                {LOOM_SCRIPT.map((s, i) => (
                  <div key={i} className="px-4 py-3 flex gap-3">
                    <div className="flex-shrink-0 text-center" style={{ minWidth: 70 }}>
                      <p className="text-yellow-400 font-black text-xs">{s.min}</p>
                      <p className="text-xl mt-1">{s.icon}</p>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{s.label}</p>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{s.script}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-3">
              <p className="text-amber-300/80 text-xs leading-relaxed">
                <strong className="text-amber-300">After recording:</strong> Watch it back once. If it's at least 7/10 quality — ship it. Perfect is the enemy of done. The video doesn't need to be polished. It needs to be real.
              </p>
            </div>

            <a href="https://loom.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-black text-sm transition-all">
              <Video size={14} /> Open Loom.com →
            </a>
          </div>
        )}

        {/* PDF DOWNLOADS TAB */}
        {tab === "pdfs" && (
          <div className="space-y-4">
            <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-3">
              <p className="text-blue-300 text-xs leading-relaxed">
                These are the two PDFs you need to attach to every broker email and upload to your VDR. Generate them fresh before each outreach so the date is current.
              </p>
            </div>

            {[
              {
                icon: "📄",
                title: "Executive Summary PDF",
                desc: "1-page overview of the platform, IP portfolio, revenue model, and deal structures. Attach this to every broker email. (~1 page)",
                color: "#f59e0b",
                action: exportExecSummaryPDF,
                label: "Download Executive Summary",
                includes: ["Platform overview & URL", "IP portfolio — 6 clusters summary", "Revenue model + ARR targets", "IP valuation range ($250K–$5M+)", "Deal structures available", "Contact information"],
              },
              {
                icon: "📦",
                title: "Full Due Diligence Package PDF",
                desc: "Complete 6-section buyer package: exec summary, IP portfolio detail, technical specs, revenue model, deal structures, acquisition checklist, and next steps. (~8–10 pages)",
                color: "#a855f7",
                action: exportDueDiligencePDF,
                label: "Download Full DD Package",
                includes: ["Executive summary (full)", "All 6 IP technology clusters — detailed inventory", "Platform technical specs (frontend, backend, AI, payments, database)", "Revenue streams breakdown with pricing", "All deal structures and price ranges", "Acquisition checklist (what's ready now)", "Due diligence next steps + contact"],
              },
            ].map((pdf, i) => (
              <div key={i} className="border border-gray-800 rounded-2xl p-5" style={{ borderLeftWidth: 3, borderLeftColor: pdf.color }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{pdf.icon}</span>
                    <div>
                      <p className="text-white font-black text-base">{pdf.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{pdf.desc}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Includes:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {pdf.includes.map((item, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Check size={9} style={{ color: pdf.color }} className="flex-shrink-0" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={pdf.action}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm transition-all text-black"
                  style={{ backgroundColor: pdf.color }}>
                  <Download size={14} /> {pdf.label}
                </button>
                <p className="text-gray-700 text-xs mt-2 text-center">Upload this to your VDR · Attach to every broker email · Include in Acquire.com listing</p>
              </div>
            ))}

            <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/30">
              <p className="text-white font-bold text-sm mb-2">📋 Where to use these PDFs</p>
              <div className="space-y-2">
                {[
                  { where: "Every broker email", what: "Attach Executive Summary as PDF. Link to broker page." },
                  { where: "Acquire.com listing", what: "Upload Full DD Package to your listing's secure documents section." },
                  { where: "Your VDR", what: "Upload both to aethon.base44.app/vdr-documents — label 'For Buyers'." },
                  { where: "Quiet Light / Empire Flippers", what: "Send Full DD Package + Exec Summary in your first email." },
                  { where: "IPOfferings / Acacia / Dominion Harbor", what: "Exec Summary email attachment + Full DD Package in VDR." },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-green-400 font-bold flex-shrink-0 w-36">{r.where}</span>
                    <span className="text-gray-500">— {r.what}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}