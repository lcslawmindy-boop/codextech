import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from "lucide-react";

// ── What you've actually built ────────────────────────────────────────────────
const WHAT_YOU_BUILT = [
  {
    emoji: "🧠",
    title: "A Software Platform (SaaS)",
    plain: "You built a website that charges monthly/yearly subscriptions. It has 100+ pages, 50+ backend functions, AI tools, a patent drafting suite, a virtual data room, and a full payment system via Stripe. This alone — the code and infrastructure — is worth money to a buyer.",
    value: "$50K – $500K+",
    basis: "Based on comparable code-base acquisitions on Acquire.com and Flippa for platforms of this complexity.",
  },
  {
    emoji: "📜",
    title: "Intellectual Property (IP) — The Big One",
    plain: "You documented 40+ inventions with full engineering specs, bills of materials, and citations to real granted US patents. Some of these patents are expired (free to use), and you've built educational content around them. This research library is the most defensible asset you own.",
    value: "$250K – $5M+",
    basis: "Depends on whether a buyer sees commercial potential in the underlying technology domains (energy, bioelectromagnetics, defense).",
  },
  {
    emoji: "⚙️",
    title: "AI Patent Tools",
    plain: "You have a working AI patent drafting wizard, freedom-to-operate analysis tool, patent monitoring, and an AI 'attorney chat.' Law firms and IP shops pay $10K–$50K/year for tools like this. You built it.",
    value: "$100K – $750K",
    basis: "White-label SaaS licensing to even 2–3 IP firms would generate $200K+ ARR with near-zero marginal cost.",
  },
  {
    emoji: "💾",
    title: "Content Library",
    plain: "200+ research entries, 40+ engineering build plans, 26+ structured courses, a prior art archive, and government-sourced documentation. Content businesses sell for 3–5× annual revenue.",
    value: "$50K – $300K",
    basis: "Content + course libraries on Acquire.com typically sell at 3–5× ARR.",
  },
  {
    emoji: "💳",
    title: "Live Stripe Revenue Infrastructure",
    plain: "Your platform has real Stripe integration in Live Mode with multiple subscription tiers ($29–$497/month), one-time products, and a physical shop. Even with minimal current ARR, this infrastructure is valuable — it means a buyer can start generating revenue immediately.",
    value: "Revenue multiple",
    basis: "SaaS platforms typically sell at 3–6× ARR. Every dollar of recurring revenue you generate before selling increases your price.",
  },
];

// ── What you do NOT have (honest) ────────────────────────────────────────────
const GAPS = [
  {
    gap: "No LLC or legal entity formed yet",
    why: "You need a legal entity (LLC or Corp) to sign contracts and receive acquisition payments. Without it, you personally are the seller — which creates tax and liability problems.",
    fix: "Form a Delaware LLC via Stripe Atlas (~$500 one-time) or ZenBusiness (~$50). Takes 1–3 days.",
    link: "https://stripe.com/atlas",
    linkLabel: "Stripe Atlas →",
    priority: "CRITICAL",
  },
  {
    gap: "No verified revenue / Stripe history",
    why: "Buyers will ask 'how much does this make?' If the answer is '$0 or almost nothing,' that's fine for an IP deal — but it significantly affects price for a SaaS acquisition.",
    fix: "Even $1K–$5K MRR before you sell changes the conversation. Focus on getting 10–20 paying subscribers before approaching buyers.",
    priority: "HIGH",
  },
  {
    gap: "No filed patents",
    why: "Right now your IP is valuable primarily as documented research and software — not as legally protected patents. Filed patents dramatically increase defensibility and asking price.",
    fix: "File 1–3 Provisional Patent Applications (PPAs) yourself for ~$320 each at USPTO.gov. A provisional gives you 12 months of 'Patent Pending' status while you sell. Then a buyer can take over the full filing.",
    link: "https://www.uspto.gov/patents/basics/apply",
    linkLabel: "USPTO PPA →",
    priority: "HIGH",
  },
  {
    gap: "No formal valuation from a third party",
    why: "When you tell a buyer 'this is worth $2M,' they'll ask who said so. A professional IP valuation or even a certified business appraiser's report adds credibility.",
    fix: "Get a basic IP valuation report from a firm like ipvalue.com or Ocean Tomo. Cost: $2K–$10K. Or use your existing Valuation API to generate a self-assessment and have a CPA review it.",
    link: "https://ipvalue.com",
    linkLabel: "ipvalue.com →",
    priority: "MEDIUM",
  },
  {
    gap: "No organized due diligence package",
    why: "Every serious buyer will ask for the same things: revenue screenshots, source code walkthrough, asset list, patent documentation, subscriber count. Having this ready speeds up the sale by weeks.",
    fix: "Use your VDR (Virtual Data Room) — you already built it. Upload: Stripe screenshots, subscriber count, platform demo recording, asset list, NDA. Done.",
    priority: "MEDIUM",
  },
];

// ── Who can help you ─────────────────────────────────────────────────────────
const HELPERS = [
  {
    category: "🏢 M&A Advisors / Brokers (handle the whole sale for you)",
    color: "#6366f1",
    people: [
      {
        name: "Acquire.com (formerly MicroAcquire)",
        type: "Online marketplace + M&A advisors",
        what: "They list your platform, match you with buyers, and some offer full advisory services. Free to list. They take ~4% on close.",
        cost: "Free to list. ~4% success fee.",
        action: "Create a private/stealth listing. Buyers sign NDA before seeing any details.",
        link: "https://acquire.com",
      },
      {
        name: "Flippa",
        type: "Digital business marketplace",
        what: "Largest marketplace for buying/selling online businesses and apps. Has dedicated brokers who will manage the entire process for you.",
        cost: "$29–$49 listing fee. Broker service: 10–15% of sale price.",
        action: "List as 'Confidential' — buyers see only a teaser until NDA is signed.",
        link: "https://flippa.com",
      },
      {
        name: "Quiet Light Brokerage",
        type: "Full-service M&A broker for online businesses",
        what: "Quiet Light is one of the most respected brokers for selling content-driven SaaS platforms and IP-rich digital businesses in the $100K–$5M range. They assign you a dedicated advisor (all former online business owners themselves), handle the full process — valuation, listing, buyer vetting, negotiation, and close — and only get paid when you do. Their buyers are pre-qualified, serious, and actively looking. For a platform like yours (AI tools + IP library + Stripe revenue), they're a strong fit. Start by filling out their intake form — they'll respond within 2–3 business days with a free valuation call to tell you exactly what your platform is worth today and what you'd need to do to increase it.",
        cost: "No upfront cost. ~8–12% success fee, paid only at close.",
        action: "Fill out their intake form (5 min). Expect a free valuation call within 2–3 days.",
        link: "https://quietlight.com",
        askingRange: "$150K – $2M realistic range for your platform type",
      },
      {
        name: "Empire Flippers",
        type: "Premium business broker (mid-market)",
        what: "Empire Flippers is the largest curated marketplace for buying and selling established online businesses, with a strong track record in the $100K–$10M+ range. They have a rigorous vetting process that actually increases buyer confidence — meaning your listing gets in front of serious, funded buyers rather than tire-kickers. They handle everything: migration support, escrow, due diligence coordination, and post-sale transition. For a platform with working Stripe infrastructure, AI tools, and documented IP, they're one of the best-positioned brokers to tell your story to the right buyer. Submit your business on their site and they'll schedule a free valuation call — no commitment, no cost.",
        cost: "No upfront. Success fee: 2–15% sliding scale (lower % on larger deals).",
        action: "Submit via their website form. They'll schedule a free valuation call within a week.",
        link: "https://empireflippers.com",
        askingRange: "$200K – $3M realistic range depending on ARR at time of listing",
      },
    ],
  },
  {
    category: "📜 IP-Specific Brokers (if you want to sell the patents/tech separately)",
    color: "#f59e0b",
    people: [
      {
        name: "IPOfferings.com",
        type: "Pure IP broker",
        what: "They specifically sell patent portfolios and IP assets to buyers. Zero upfront. Pure contingency on sale.",
        cost: "No upfront. Commission on sale (typically 15–25%).",
        action: "Email them your executive summary and patent list.",
        link: "https://ipofferings.com",
      },
      {
        name: "Dominion Harbor",
        type: "Patent licensing & monetization",
        what: "They can either buy your IP outright or monetize it via licensing and give you a share. Specializes in energy and defense-adjacent tech.",
        cost: "Pure contingency — they take a cut of whatever they generate.",
        action: "Reach out via their website. Focus your pitch on the scalar EM and energy IP.",
        link: "https://dominionharbor.com",
      },
      {
        name: "Acacia Research",
        type: "IP acquisition company",
        what: "They buy IP portfolios outright and handle all monetization. You get a lump sum and walk away.",
        cost: "They buy — you get paid. No broker fee.",
        action: "Submit via their website investor/contact form.",
        link: "https://acaciaresearch.com",
      },
    ],
  },
  {
    category: "⚖️ Lawyers You'll Need (non-optional)",
    color: "#22c55e",
    people: [
      {
        name: "M&A Attorney (for the actual sale)",
        type: "Transactional lawyer",
        what: "Reviews or drafts the Asset Purchase Agreement (APA). You absolutely need this before signing anything. One wrong clause could cost you more than their fee.",
        cost: "$300–$500/hour. Total for a small deal: $2,000–$8,000.",
        action: "Find one on Avvo.com or ask Quiet Light / Empire Flippers — they have referrals.",
        link: "https://www.avvo.com/business-lawyer.html",
      },
      {
        name: "IP / Patent Attorney (for patent filing)",
        type: "USPTO-registered patent attorney",
        what: "File 1–3 Provisional Patent Applications before you sell. Also does FTO (freedom-to-operate) review to confirm you don't infringe anyone.",
        cost: "$1,500–$3,500 per provisional application (attorney-assisted).",
        action: "Find on USPTO's official attorney registry. Ask for someone with energy or electronics experience.",
        link: "https://oedci.uspto.gov/OEDCI/",
      },
      {
        name: "CPA / Tax Advisor",
        type: "Accountant",
        what: "An acquisition is a taxable event. Depending on how you structure it (asset sale vs. stock sale, installment payments, etc.), you could owe significantly different amounts. Talk to a CPA before you sign anything.",
        cost: "$200–$400/hour for consultation.",
        action: "Find a CPA who specializes in business sales/M&A. Ask your M&A attorney for a referral.",
        link: "https://www.cpaverify.org",
      },
    ],
  },
];

// ── Realistic price ranges ────────────────────────────────────────────────────
const SCENARIOS = [
  {
    label: "Minimum — IP + Code Only",
    range: "$50K – $150K",
    color: "#94a3b8",
    description: "If you sell today with zero revenue, no patents filed, no LLC. A buyer is paying for code, content, and research documentation. This is the floor.",
    who: "Individual operator, small fund, or strategic buyer who wants to build on top of your work.",
  },
  {
    label: "Realistic — Packaged Properly",
    range: "$150K – $500K",
    color: "#06b6d4",
    description: "If you form an LLC, get 1–3 PPAs filed, have even $2K–$5K MRR, and use an M&A broker. This is the most likely outcome if you do the basics right.",
    who: "Acquire.com or Empire Flippers buyer. IP firm. Small tech acquirer.",
  },
  {
    label: "Strong — With Revenue + Patents",
    range: "$500K – $2M",
    color: "#a855f7",
    description: "If you land even 1–2 white-label clients ($20K–$50K/yr), get $10K+ MRR from subscriptions, and have 3+ patents pending. This takes 6–12 months of work post-preparation.",
    who: "Strategic acquirer, IP monetization firm, or deep-tech VC-backed company.",
  },
  {
    label: "Home Run — Strategic Buyer",
    range: "$2M – $10M+",
    color: "#f97316",
    description: "If a defense contractor, pharma company, or major IP firm decides the technology clusters are strategically valuable. This is real but requires the right buyer to find you — that's what IP brokers are for.",
    who: "Defense prime (Lockheed, Raytheon), pharma R&D division, major IP management firm.",
  },
];

// ── All outreach templates ────────────────────────────────────────────────────
const OUTREACH_TEMPLATES = [
  // ── M&A BROKERS ──
  {
    category: "M&A Brokers",
    color: "#6366f1",
    templates: [
      {
        id: "quietlight",
        label: "Quiet Light Brokerage",
        emailLink: "mailto:info@quietlight.com",
        subject: "Online Business for Sale — AI + IP Research SaaS Platform ($150K–$500K asking range)",
        body: `Hi Quiet Light team,

I'm the founder of Aethon Apex IP (aethon.base44.app), an AI-powered intellectual property research and SaaS platform built around a documented library of 40+ patent-sourced invention build plans, a full AI patent drafting suite, virtual data room, investor CRM, and live Stripe subscriptions.

Here's the quick overview:
• Platform type: SaaS + AI tools + IP content library
• Revenue: Stripe Live Mode active — subscriptions from $29–$497/month
• Assets: 40+ invention build plans, 26+ courses, AI patent drafting wizard, FTO analysis, VDR, IP marketplace, white-label SaaS infrastructure
• Tech: React/Vite frontend, Deno backend, 70+ components, 50+ backend functions
• Asking range: $150K–$500K (open to discussion based on your valuation)

I'm looking for a full-service broker to handle the sale. I'd love to schedule your free valuation call to understand what the platform is worth today and what I'd need to do to maximize the sale price.

Would you be able to get on a call this week?

Best,
[Your Name]
zenithapexresearch@gmail.com`,
      },
      {
        id: "empireflippers",
        label: "Empire Flippers",
        emailLink: "https://empireflippers.com/sell-your-business/",
        subject: "Business Submission — AI SaaS + IP Research Platform | Stripe Live | Asking $150K–$500K",
        body: `Hi Empire Flippers,

I'd like to submit my online business for your free valuation review.

Business overview:
• Name: Aethon Apex IP
• URL: aethon.base44.app
• Type: SaaS + AI tools + IP content library
• Monetization: Stripe subscriptions ($29–$497/month), one-time product sales, AI tool credits
• Assets: 40+ documented invention build plans, AI patent suite, VDR, investor CRM, white-label SaaS infrastructure, 26+ engineering courses
• Tech stack: React/Vite, Deno Deploy, Claude/GPT AI integrations, Stripe Live Mode
• Asking price: $150K–$500K (flexible, subject to your valuation)

I'm ready to provide Stripe screenshots, platform walkthrough video, and full asset list on request.

Can we schedule a free valuation call?

Best,
[Your Name]
zenithapexresearch@gmail.com`,
      },
      {
        id: "acquire",
        label: "Acquire.com (Private Listing)",
        emailLink: "https://acquire.com",
        subject: "AI + IP Research SaaS — Stealth Listing Inquiry | $150K–$500K",
        body: `Hi Acquire.com team,

I'd like to create a stealth/private listing for my SaaS platform, Aethon Apex IP.

Key details:
• Platform: AI-powered IP research SaaS + patent toolkit
• URL: aethon.base44.app
• Revenue model: Subscriptions $29–$497/mo + one-time sales
• Tech: React + Deno + Stripe Live Mode — fully functional
• Unique asset: 40+ patent-sourced invention build plans + AI FTO analysis + Virtual Data Room
• Asking: $150K–$500K

I want a private listing where buyers must sign an NDA before any details are revealed. Happy to provide Stripe screenshots and Loom walkthrough on request.

How do I get started?

Best,
[Your Name]`,
      },
    ],
  },

  // ── IP BROKERS ──
  {
    category: "IP Brokers",
    color: "#f59e0b",
    templates: [
      {
        id: "ipofferings",
        label: "IPOfferings.com",
        emailLink: "mailto:info@ipofferings.com",
        subject: "IP Portfolio Acquisition Opportunity — Patent-Backed EM & Energy Tech | NDA Required",
        body: `Hi IPOfferings team,

I'm reaching out about a potential listing for a patent-backed IP portfolio in advanced electromagnetics, bioelectromagnetic therapeutics, and clean energy technology.

PORTFOLIO HIGHLIGHTS:
• 40+ documented inventions with full engineering specs, BOMs, and schematics
• 6 patent clusters: Advanced Energy (MEG/ZPE), Bioelectromagnetic Therapeutics, Scalar EM Communications, EMF Detection, Hydromagnetic Propulsion, Resonance Energy Transfer
• Estimated IP valuation: $250K–$5M+ depending on acquirer type
• References: granted US patents (including US 6,362,718 MEG) — all properly cited

PLATFORM ASSETS ALSO INCLUDED (if desired):
• Full SaaS platform (React/Deno) with AI patent drafting, FTO wizard, VDR, investor CRM
• Stripe Live Mode with $29–$497/mo subscription tiers
• 26+ structured engineering courses and 200+ prior art entries

DEAL STRUCTURES I'M OPEN TO:
• Outright IP acquisition
• Exclusive field-of-use license
• Non-exclusive royalty arrangement
• Full platform + IP package

Happy to send a 1-page executive summary and sign an NDA for the full due diligence package.

Best,
[Your Name]
zenithapexresearch@gmail.com`,
      },
      {
        id: "dominion",
        label: "Dominion Harbor",
        emailLink: "https://dominionharbor.com",
        subject: "Scalar EM + Energy IP Portfolio — Licensing & Monetization Inquiry",
        body: `Hi Dominion Harbor team,

I have a defensible IP portfolio spanning scalar electromagnetics, clean energy devices, and bioelectromagnetic therapeutics that I believe aligns well with your monetization capabilities.

TECHNOLOGY CLUSTERS:
1. Motionless Electromagnetic Generator (MEG) — references US 6,362,718
2. Prioré-type Bioelectromagnetic Therapy — references French patent literature + Foundations of Physics Letters
3. Scalar Wave Communications (G-Com) — novel modulation topology
4. Atmospheric Energy Harvesting — based on Tesla-derived prior art
5. Hydromagnetic Propulsion — cross-domain naval + aerospace applications
6. EMF Shielding & Detection Instruments — commercial near-term

I'm open to licensing deals, royalty arrangements, or outright acquisition of individual clusters or the full portfolio. No upfront cost required from my side — I understand your contingency model.

Can we schedule a brief call to discuss fit?

Best,
[Your Name]
zenithapexresearch@gmail.com`,
      },
      {
        id: "acacia",
        label: "Acacia Research",
        emailLink: "https://acaciaresearch.com",
        subject: "IP Portfolio Submission — Advanced EM, Bioelectromagnetics & Clean Energy Technology",
        body: `Hi Acacia Research,

I'd like to submit a patent-backed IP portfolio for your acquisition consideration.

OVERVIEW:
• 6 technology clusters across electromagnetics, energy, bioelectromagnetics, and propulsion
• All inventions are sourced from or reference granted US/international patents
• Research library includes 200+ cited prior art entries with full documentation
• SaaS platform built around the IP — AI patent drafting, FTO analysis, investor VDR, Stripe revenue

VALUATION BASIS:
• Conservative: $250K–$500K (3 filed patents + R&D investment basis)
• Strategic: $2M–$10M+ (to defense contractor, pharma, or energy sector acquirer)

I'm interested in a clean acquisition where you handle all monetization post-close. Can we discuss fit?

Best,
[Your Name]
zenithapexresearch@gmail.com`,
      },
    ],
  },

  // ── DIRECT STRATEGIC BUYERS ──
  {
    category: "Direct Strategic Buyers",
    color: "#22c55e",
    templates: [
      {
        id: "defense_prime",
        label: "Defense Contractor (BD Lead)",
        emailLink: "https://linkedin.com",
        subject: "Advanced EM Technology Portfolio — Strategic Acquisition Inquiry (NDA Required)",
        body: `Hi [Name],

I'm the founder of a patent-backed IP research platform specializing in advanced electromagnetic systems with direct applications in defense: scalar wave communications, EMF detection instrumentation, atmospheric energy harvesting, and hydromagnetic propulsion.

I'm reaching out because [Company]'s work in [specific program/area] appears highly complementary to what we've built.

QUICK SNAPSHOT:
• 40+ documented inventions with full engineering specs and BOMs
• References: granted US patents across 6 technology clusters
• Platform: AI-powered IP suite with FTO analysis, VDR, investor CRM (all live)
• Deal: Looking for strategic acquisition, exclusive license, or co-development JV

This is a confidential process. All details are behind an NDA-gated virtual data room.

Would you be open to a 20-minute call to assess fit?

Best regards,
[Your Name]
Aethon Apex IP
zenithapexresearch@gmail.com`,
      },
      {
        id: "pharma_rd",
        label: "Pharma / Biotech R&D Lead",
        emailLink: "https://linkedin.com",
        subject: "Bioelectromagnetic Therapeutic IP — Acquisition Inquiry | Prioré-Type Multichannel EM Protocol",
        body: `Hi [Name],

I'm the founder of Aethon Apex IP, a research platform with a documented bioelectromagnetic therapeutic IP cluster that I believe is relevant to [Company]'s oncology / regenerative medicine / longevity research pipeline.

THE CORE IP:
• Multichannel Cellular Conditioning System (MCCS) — based on Prioré-type EM therapeutic methodology
• TRD-1 Telomere Resonance Device — resonant EM approach to cellular longevity
• Full engineering documentation, BOMs, and prior art citations (Foundations of Physics Letters, declassified government reports)
• AI platform with FTO analysis and patent drafting already integrated

IMPORTANT DISCLAIMER: This IP is for research and development use only — not FDA-cleared or approved for any medical application. All content is educational and experimental.

DEAL INTEREST:
• Exclusive field-of-use license (oncology / longevity / regenerative medicine)
• R&D partnership with milestone royalties
• Outright acquisition of the bioEM cluster

Can we set up a brief confidential call? I can send a 1-page summary and NDA immediately.

Best,
[Your Name]
zenithapexresearch@gmail.com`,
      },
      {
        id: "ipfirm_whitelabel",
        label: "IP Law Firm (White-Label SaaS)",
        emailLink: "https://linkedin.com",
        subject: "White-Label AI Patent Suite — Built for IP Firms | FTO, Drafting Wizard, Patent Monitoring",
        body: `Hi [Name],

I've built an AI patent toolkit that I think could add significant value to [Firm Name]'s client offering — either as a white-labeled internal tool or a client-facing portal.

WHAT'S BUILT AND WORKING:
• USPTO-formatted patent drafting wizard (AI-generated claim language + spec)
• Freedom-to-Operate (FTO) analysis with blocking patent identification
• Prior art cross-reference engine (200+ entries)
• Automated patent threat monitoring
• Shared patent draft portal for attorney-client collaboration
• Virtual Data Room for client due diligence packages
• All live on React/Deno — deployable as white-label in days

LICENSING MODEL:
• Annual white-label license: $10K–$50K/yr depending on usage
• Per-seat model available: $500–$1,500/user/yr
• One-time purchase with self-hosting option

This is production-ready — not a demo. Happy to do a live walkthrough.

Are you open to a 30-minute demo?

Best,
[Your Name]
zenithapexresearch@gmail.com`,
      },
      {
        id: "edtech_rollup",
        label: "EdTech / LegalTech Rollup",
        emailLink: "https://acquire.com",
        subject: "AI-Powered IP Research SaaS Acquisition — $150K–$500K | 40+ Courses + Patent Tools",
        body: `Hi [Name],

I'm the founder of Aethon Apex IP, an AI-powered research and education platform at the intersection of advanced engineering, IP law, and patent strategy. I'm exploring a sale to a strategic acquirer in the EdTech or LegalTech space.

PLATFORM METRICS:
• 40+ structured engineering courses (beginner → advanced)
• 200+ research archive entries with inline citations
• AI patent drafting, FTO analysis, patent monitoring, attorney chat
• Virtual Data Room and investor CRM
• Stripe Live Mode: $29–$497/month subscription tiers
• Tech: React/Vite, Deno, Claude/GPT integrations

WHY THIS FITS A ROLLUP:
• Defensible niche — no direct competitor combining patent tools + engineering education
• White-label infrastructure already built
• Immediately monetizable inventory (courses, build plans, AI tools)
• Clean codebase, documented, no technical debt

Asking: $150K–$500K. Open to earnout or equity component.

Would you be open to a brief call?

Best,
[Your Name]
zenithapexresearch@gmail.com`,
      },
    ],
  },

  // ── FOLLOW-UP SEQUENCES ──
  {
    category: "Follow-Up Sequences",
    color: "#06b6d4",
    templates: [
      {
        id: "followup_d3",
        label: "Follow-Up #1 — Day 3 (No Response)",
        emailLink: "",
        subject: "Re: [Original Subject] — Quick Follow-Up",
        body: `Hi [Name],

Just following up on my note from [Day]. I know inboxes get busy.

I'm the founder of Aethon Apex IP — a patent-backed IP research SaaS with 40+ invention build plans, an AI patent suite, and live Stripe revenue. I'm exploring acquisition options in the $150K–$500K range.

If this isn't the right fit for your focus right now, completely understood — just a quick yes or no would be helpful so I can direct my search.

If there's any interest, I can send a 1-page summary and a Loom walkthrough within the hour.

Best,
[Your Name]`,
      },
      {
        id: "followup_d7",
        label: "Follow-Up #2 — Day 7 (New Angle)",
        emailLink: "",
        subject: "One more thing about Aethon Apex IP — [specific asset]",
        body: `Hi [Name],

I sent you a note last week about Aethon Apex IP. One thing I didn't mention that might be more relevant for your focus:

The platform includes a white-label AI patent drafting and FTO analysis suite that's already generating revenue. Separate from the IP portfolio itself, this tool alone — licensed to 2–3 IP firms at $20K/yr — would generate $60K+ ARR with near-zero marginal cost.

If you're evaluating tools rather than IP portfolios, that component is licensable independently.

Happy to do a live demo — takes 20 minutes.

Best,
[Your Name]
zenithapexresearch@gmail.com`,
      },
      {
        id: "followup_d14",
        label: "Follow-Up #3 — Day 14 (Final Nudge)",
        emailLink: "",
        subject: "Closing the loop — Aethon Apex IP",
        body: `Hi [Name],

This will be my last note on this — I don't want to fill your inbox.

I'm actively in conversations with [2–3 other brokers/buyers] about Aethon Apex IP and expect to have a deal structure in place within the next 30–60 days.

If there was any interest on your side — even just a "send me the exec summary" — now is the best window to engage before the process closes.

If not, no hard feelings at all. I appreciate your time.

Best,
[Your Name]
zenithapexresearch@gmail.com

P.S. Platform demo: aethon.base44.app | IP broker page: aethon.base44.app/ip-broker`,
      },
      {
        id: "nda_response",
        label: "NDA Response Template (After They Ask)",
        emailLink: "",
        subject: "Re: [Subject] — NDA + Due Diligence Package",
        body: `Hi [Name],

Thank you for your interest — I'm glad to move forward.

Here's the NDA link (DocuSign — takes 2 minutes):
[Your NDA link]

Once signed, I'll grant you immediate access to the Virtual Data Room, which includes:
• Full platform asset inventory and source code overview
• Stripe revenue dashboard screenshots
• IP portfolio overview with patent citations
• Technology demo recording (Loom)
• 1-page executive summary with valuation basis
• Sample build plan and course module

I'll send VDR access credentials within 24 hours of NDA signature.

Looking forward to connecting.

Best,
[Your Name]
Aethon Apex IP
zenithapexresearch@gmail.com`,
      },
    ],
  },
];

// ── Broker email templates (kept for BrokerEmailTemplate component compatibility) ───────────────────────────────────────────────────────────────────────
const BROKER_EMAILS = {
  quietlight: {
    subject: "Online Business for Sale — AI + IP Research SaaS Platform ($150K–$500K asking range)",
    body: `Hi Quiet Light team,

I'm the founder of Aethon Apex IP (aethon.base44.app), an AI-powered intellectual property research and SaaS platform built around a documented library of 40+ patent-sourced invention build plans, a full AI patent drafting suite, virtual data room, investor CRM, and live Stripe subscriptions.

Here's the quick overview:
• Platform type: SaaS + AI tools + IP content library
• Revenue: Stripe Live Mode active — subscriptions from $29–$497/month
• Assets: 40+ invention build plans, 26+ courses, AI patent drafting wizard, FTO analysis, VDR, IP marketplace, white-label SaaS infrastructure
• Tech: React/Vite frontend, Deno backend, 70+ components, 50+ backend functions
• Asking range: $150K–$500K (open to discussion based on your valuation)

I'm looking for a full-service broker to handle the sale. I'd love to schedule your free valuation call to understand what the platform is worth today and what I'd need to do to maximize the sale price.

Would you be able to get on a call this week?

Best,
[Your Name]
zenithapexresearch@gmail.com`,
  },
  empireflippers: {
    subject: "Business Submission — AI SaaS + IP Research Platform | Stripe Live | Asking $150K–$500K",
    body: `Hi Empire Flippers,

I'd like to submit my online business for your free valuation review.

Business overview:
• Name: Aethon Apex IP
• URL: aethon.base44.app
• Type: SaaS + AI tools + IP content library
• Monetization: Stripe subscriptions ($29–$497/month), one-time product sales, AI tool credits
• Assets included: 40+ documented invention build plans, AI patent suite, virtual data room, investor CRM, white-label SaaS infrastructure, 26+ engineering courses
• Tech stack: React/Vite, Deno Deploy, Claude/GPT AI integrations, Stripe Live Mode
• Asking price: $150K–$500K (flexible, subject to your valuation)

I'm ready to provide Stripe screenshots, platform walkthrough video, and full asset list on request. I'm looking for your team to manage the full sale process.

Can we schedule a free valuation call?

Best,
[Your Name]
zenithapexresearch@gmail.com`,
  },
};

// ── Next 10 actions ──────────────────────────────────────────────────────────
const NEXT_STEPS = [
  { step: 1, action: "Form a Delaware LLC", detail: "Stripe Atlas or ZenBusiness. Takes 1–3 days. ~$50–$500. Do this first — everything else flows through it.", link: "https://stripe.com/atlas", urgent: true },
  { step: 2, action: "Open a Mercury business bank account", detail: "Free. Takes 1 day. Required to receive payment at close.", link: "https://mercury.com", urgent: true },
  { step: 3, action: "Take screenshots of everything in Stripe", detail: "Revenue dashboard, subscriber count, payment history. Buyers will ask on the first call.", urgent: true },
  { step: 4, action: "Record a 10-minute platform walkthrough video", detail: "Use Loom (free). Walk through the main features. This is the most powerful sales tool you have — seeing is believing.", link: "https://loom.com", urgent: true },
  { step: 5, action: "Email Quiet Light or Empire Flippers", detail: "Send a 1-paragraph description + Stripe screenshot + your asking price range. They'll respond within a few days with a free valuation call.", link: "https://quietlight.com", urgent: false },
  { step: 6, action: "Create a private listing on Acquire.com", detail: "Free. Takes 20 minutes. Set it to 'Stealth' so only NDA-signers see details. This runs in parallel with everything else.", link: "https://acquire.com", urgent: false },
  { step: 7, action: "Email IPOfferings.com with your exec summary", detail: "They specifically deal in IP portfolios. Your tech is exactly their market. Zero upfront cost to engage them.", link: "https://ipofferings.com", urgent: false },
  { step: 8, action: "File 1–3 Provisional Patent Applications", detail: "$320 each at USPTO.gov. You can do this yourself with minimal legal help. Gives you 'Patent Pending' for 12 months — massively increases credibility with buyers.", link: "https://www.uspto.gov/patents/basics/apply", urgent: false },
  { step: 9, action: "Consult a CPA about your tax situation", detail: "Before signing anything. Asset sale vs. stock sale changes how much you keep. This conversation costs $200–$400 and could save you tens of thousands.", urgent: false },
  { step: 10, action: "Get an M&A attorney on standby", detail: "You don't need to pay them yet — just identify one. When a buyer shows up with a term sheet, you have 3–5 days to respond. Have someone ready.", link: "https://www.avvo.com/business-lawyer.html", urgent: false },
];

// ── Components ───────────────────────────────────────────────────────────────

function BrokerEmailTemplate({ brokerKey, label, color, emailLink }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const tpl = BROKER_EMAILS[brokerKey];

  const copyField = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="border rounded-xl overflow-hidden" style={{ borderColor: color + "40" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-900/60"
        style={{ background: color + "10" }}>
        <span className="text-sm font-black" style={{ color }}>✉️ Ready-to-Send Email → {label}</span>
        {open ? <ChevronUp size={13} className="text-gray-500" /> : <ChevronDown size={13} className="text-gray-500" />}
      </button>
      {open && (
        <div className="bg-gray-950 px-4 pb-4 pt-3 space-y-3">
          {/* Subject */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Subject Line</p>
              <button onClick={() => copyField("subject", tpl.subject)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 font-bold transition-all">
                {copied === "subject" ? <Check size={9} className="text-green-400" /> : <Copy size={9} />}
                {copied === "subject" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-gray-200 text-xs bg-gray-900 rounded-lg px-3 py-2 border border-gray-800">{tpl.subject}</p>
          </div>
          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Email Body</p>
              <div className="flex items-center gap-2">
                <button onClick={() => copyField("body", tpl.body)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 font-bold transition-all">
                  {copied === "body" ? <Check size={9} className="text-green-400" /> : <Copy size={9} />}
                  {copied === "body" ? "Copied" : "Copy"}
                </button>
                <a href={emailLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-all"
                  style={{ background: color + "20", color, border: `1px solid ${color}50` }}>
                  <ExternalLink size={9} /> Open Email / Site
                </a>
              </div>
            </div>
            <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-900 rounded-lg px-3 py-3 border border-gray-800 max-h-64 overflow-y-auto">
              {tpl.body}
            </pre>
          </div>
          <p className="text-gray-600 text-xs">Fill in <strong>[Your Name]</strong> before sending.</p>
        </div>
      )}
    </div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-bold transition-all">
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function TemplateCard({ tpl, color }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(null);

  const copy = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="border rounded-xl overflow-hidden" style={{ borderColor: color + "30" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-900/60 transition-colors"
        style={{ background: color + "08" }}>
        <span className="text-sm font-bold text-white">✉️ {tpl.label}</span>
        {open ? <ChevronUp size={13} className="text-gray-500" /> : <ChevronDown size={13} className="text-gray-500" />}
      </button>
      {open && (
        <div className="bg-gray-950 px-4 pb-4 pt-3 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Subject Line</p>
              <button onClick={() => copy("subject", tpl.subject)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 font-bold transition-all">
                {copied === "subject" ? <Check size={9} className="text-green-400" /> : <Copy size={9} />}
                {copied === "subject" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-gray-200 text-xs bg-gray-900 rounded-lg px-3 py-2 border border-gray-800">{tpl.subject}</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Email Body</p>
              <div className="flex items-center gap-2">
                <button onClick={() => copy("body", tpl.body)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 font-bold transition-all">
                  {copied === "body" ? <Check size={9} className="text-green-400" /> : <Copy size={9} />}
                  {copied === "body" ? "Copied" : "Copy"}
                </button>
                {tpl.emailLink && (
                  <a href={tpl.emailLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-all"
                    style={{ background: color + "20", color, border: `1px solid ${color}50` }}>
                    <ExternalLink size={9} /> Open
                  </a>
                )}
              </div>
            </div>
            <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-900 rounded-lg px-3 py-3 border border-gray-800 max-h-72 overflow-y-auto">
              {tpl.body}
            </pre>
          </div>
          <p className="text-gray-600 text-xs">Replace all <strong className="text-gray-500">[bracketed placeholders]</strong> before sending.</p>
        </div>
      )}
    </div>
  );
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-900/60 hover:bg-gray-900 transition-colors text-left">
        <p className="text-white font-black text-base">{title}</p>
        {open ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
      </button>
      {open && <div className="px-5 pb-5 pt-2 space-y-4 bg-gray-950/50">{children}</div>}
    </div>
  );
}

export default function ExitAdvisor() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link to="/acquisition-outreach" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">Exit Advisor</h1>
            <p className="text-gray-500 text-xs">Plain-English guide to selling your platform</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">

        {/* Honest intro */}
        <div className="bg-blue-950/30 border border-blue-800/50 rounded-2xl p-6">
          <p className="text-blue-200 font-black text-lg mb-3">Here's the honest truth about what you have and what to do next.</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            You've built something real. It's not nothing — it's a functioning SaaS platform with AI tools, an IP research library, Stripe payments, and a documented technology portfolio. Most people who want to sell a platform don't have half of what you've built.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            The problem isn't what you built. The problem is that <strong className="text-white">no one will pay you fair value if they can't easily understand, verify, and trust what they're buying.</strong> That's what we fix below.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            The good news: you don't need to do this alone. There are brokers who will handle 90% of the process for you — for free upfront, taking a cut only when you close. That's where you should start.
          </p>
        </div>

        {/* What you built */}
        <Section title="🗂️ What You've Actually Built (and what it's worth)">
          <p className="text-gray-400 text-sm">Here's a plain-English breakdown of your assets and realistic value ranges.</p>
          <div className="space-y-3">
            {WHAT_YOU_BUILT.map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <p className="text-white font-bold text-sm">{item.title}</p>
                  </div>
                  <span className="text-green-400 font-black text-sm whitespace-nowrap">{item.value}</span>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed mb-1.5">{item.plain}</p>
                <p className="text-gray-600 text-xs italic">{item.basis}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* What you're missing */}
        <Section title="⚠️ What You Don't Have Yet (the honest gaps)">
          <p className="text-gray-400 text-sm">These are the things buyers will ask about. Fix as many as you can before approaching anyone.</p>
          <div className="space-y-3">
            {GAPS.map((g, i) => (
              <div key={i} className={`border rounded-xl p-4 ${
                g.priority === "CRITICAL" ? "border-red-800/60 bg-red-950/10" :
                g.priority === "HIGH" ? "border-yellow-800/50 bg-yellow-950/10" :
                "border-gray-700 bg-gray-900/40"
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded font-black ${
                    g.priority === "CRITICAL" ? "bg-red-900/50 text-red-300" :
                    g.priority === "HIGH" ? "bg-yellow-900/50 text-yellow-300" :
                    "bg-gray-800 text-gray-400"
                  }`}>{g.priority}</span>
                  <p className="text-white font-bold text-sm">{g.gap}</p>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-2">{g.why}</p>
                <p className="text-gray-200 text-xs leading-relaxed"><strong className="text-white">Fix:</strong> {g.fix}</p>
                {g.link && (
                  <a href={g.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    <ExternalLink size={10} /> {g.linkLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Realistic price scenarios */}
        <Section title="💰 Realistic Price Scenarios">
          <p className="text-gray-400 text-sm">What you can realistically expect depending on how much prep work you do.</p>
          <div className="space-y-3">
            {SCENARIOS.map((s, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderLeftWidth: 3, borderLeftColor: s.color }}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-white font-bold text-sm">{s.label}</p>
                  <span className="font-black text-base" style={{ color: s.color }}>{s.range}</span>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed mb-1.5">{s.description}</p>
                <p className="text-gray-600 text-xs"><strong className="text-gray-500">Likely buyer:</strong> {s.who}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-3">
            <p className="text-amber-300/80 text-xs leading-relaxed">
              <strong className="text-amber-300">Honest note:</strong> You will not get $14M–$38M in a first deal without patent filings, significant verified revenue, and a strategic buyer who specifically wants your technology domains. Those numbers are strategic upside scenarios, not today's reality. Focus on the $150K–$500K range — that's achievable in 3–6 months with the right prep.
            </p>
          </div>

          {/* Where to find each buyer type */}
          <div className="border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-900 border-b border-gray-800">
              <p className="text-white font-black text-sm">🔍 Where to Find Each Buyer Type</p>
            </div>
            <div className="divide-y divide-gray-800">
              {[
                {
                  range: "$50K – $150K",
                  color: "#94a3b8",
                  buyer: "Individual operator / small fund",
                  where: [
                    { name: "Acquire.com", url: "https://acquire.com", note: "Largest buyer pool for code + content assets. Free to list, stealth mode available." },
                    { name: "Flippa", url: "https://flippa.com", note: "Good for smaller deals. Post as 'Confidential' — buyers sign NDA before details." },
                    { name: "MicroAcquire", url: "https://microacquire.com", note: "Fast marketplace. Buyers here move quickly on sub-$200K deals." },
                  ],
                },
                {
                  range: "$150K – $500K",
                  color: "#06b6d4",
                  buyer: "Tech acquirer / IP firm / small fund",
                  where: [
                    { name: "Quiet Light Brokerage", url: "https://quietlight.com", note: "Full-service broker. They find the buyer, manage the deal, take ~10%. No upfront cost." },
                    { name: "Empire Flippers", url: "https://empireflippers.com", note: "Vetted buyer network. Submit your business for a free valuation call." },
                    { name: "Acquire.com", url: "https://acquire.com", note: "Also has buyers in this range — especially for AI/SaaS platforms." },
                  ],
                },
                {
                  range: "$500K – $2M",
                  color: "#a855f7",
                  buyer: "Strategic acquirer / IP monetization firm",
                  where: [
                    { name: "IPOfferings.com", url: "https://ipofferings.com", note: "Pure IP broker. Email your exec summary — they match you with strategic buyers." },
                    { name: "Dominion Harbor", url: "https://dominionharbor.com", note: "Specializes in energy/defense-adjacent IP. Works pure contingency." },
                    { name: "Ocean Tomo", url: "https://oceantomo.com", note: "IP auctions + M&A advisory. Good for full platform + IP combined deals." },
                  ],
                },
                {
                  range: "$2M – $10M+",
                  color: "#f97316",
                  buyer: "Defense prime / pharma / major IP firm",
                  where: [
                    { name: "Acacia Research", url: "https://acaciaresearch.com", note: "Buys IP outright. Handles all monetization. You get a lump sum." },
                    { name: "Linked In outreach (direct)", url: "https://linkedin.com", note: "Target BD/M&A leads at Lockheed, Raytheon, or major IP law firms directly." },
                    { name: "Ocean Tomo / FTI Consulting", url: "https://oceantomo.com", note: "Handles strategic IP M&A at this scale. Requires a polished due diligence package." },
                  ],
                },
              ].map((row, i) => (
                <div key={i} className="px-4 py-3 flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="sm:w-32 flex-shrink-0">
                    <span className="font-black text-sm" style={{ color: row.color }}>{row.range}</span>
                    <p className="text-gray-600 text-xs mt-0.5">{row.buyer}</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {row.where.map((w, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <a href={w.url} target="_blank" rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1">
                          <ExternalLink size={9} /> {w.name}
                        </a>
                        <span className="text-gray-500 text-xs">— {w.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Who can help */}
        <Section title="👥 Who Can Help You — Specific People & Services">
          <p className="text-gray-400 text-sm">These are the actual people and services to contact. Start with the M&A brokers — they do the heavy lifting.</p>
          <div className="space-y-5">
            {HELPERS.map((cat, ci) => (
              <div key={ci}>
                <p className="font-black text-sm mb-2" style={{ color: cat.color }}>{cat.category}</p>
                <div className="space-y-2">
                  {cat.people.map((p, pi) => (
                    <div key={pi} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-white font-bold text-sm">{p.name}</p>
                          <p className="text-gray-500 text-xs">{p.type}</p>
                        </div>
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-bold transition-all whitespace-nowrap">
                            <ExternalLink size={10} /> Visit
                          </a>
                        )}
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed mb-1.5">{p.what}</p>
                      {p.askingRange && (
                        <p className="text-green-400 text-xs font-bold mb-1.5">💰 {p.askingRange}</p>
                      )}
                      <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Cost:</strong> {p.cost}</p>
                      <p className="text-xs text-cyan-400"><strong className="text-cyan-300">→ Action:</strong> {p.action}</p>
                    </div>
                  ))}
                </div>

                {/* Email templates for M&A brokers */}
                {ci === 0 && (
                  <div className="mt-4 space-y-3">
                    {[
                      { key: "quietlight", label: "Quiet Light", color: "#6366f1", emailLink: "mailto:info@quietlight.com" },
                      { key: "empireflippers", label: "Empire Flippers", color: "#06b6d4", emailLink: "https://empireflippers.com/sell-your-business/" },
                    ].map(({ key, label, color, emailLink }) => (
                      <BrokerEmailTemplate key={key} brokerKey={key} label={label} color={color} emailLink={emailLink} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Outreach Templates */}
        <Section title="📧 Buyer Outreach Templates & Email Sequences">
          <p className="text-gray-400 text-sm">Copy, fill in the blanks, and send. Organized by buyer type — brokers, IP firms, direct strategic buyers, and follow-up sequences.</p>
          <div className="space-y-6">
            {OUTREACH_TEMPLATES.map((cat, ci) => (
              <div key={ci}>
                <p className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2"
                  style={{ color: cat.color }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: cat.color }} />
                  {cat.category}
                </p>
                <div className="space-y-2">
                  {cat.templates.map((tpl) => (
                    <TemplateCard key={tpl.id} tpl={tpl} color={cat.color} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Next 10 steps */}
        <Section title="✅ Your Next 10 Actions — In Order">
          <p className="text-gray-400 text-sm">Do these in order. The first 4 are urgent — do them this week.</p>
          <div className="space-y-2">
            {NEXT_STEPS.map((s, i) => (
              <div key={i} className={`border rounded-xl p-4 flex gap-4 ${
                s.urgent ? "border-green-800/50 bg-green-950/10" : "border-gray-800 bg-gray-900/40"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                  s.urgent ? "bg-green-700 text-white" : "bg-gray-800 text-gray-400"
                }`}>{s.step}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-bold text-sm">{s.action}</p>
                    {s.urgent && <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/50 text-green-300 font-black">THIS WEEK</span>}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.detail}</p>
                  {s.link && (
                    <a href={s.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      <ExternalLink size={10} /> {s.link.replace("https://", "").replace(/\/.*/,"")}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Acquisition Tier Roadmap CTA */}
        <div className="bg-orange-950/20 border border-orange-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-orange-300 font-black text-base">🎯 Acquisition Tier Roadmap</p>
            <p className="text-gray-400 text-sm mt-0.5">Exactly what it costs financially to reach each exit tier — from $50K individual buyer to $10M+ major IP firm.</p>
          </div>
          <Link to="/acquisition-tier-roadmap"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-600 text-white font-black text-sm transition-all">
            View Roadmap →
          </Link>
        </div>

        {/* Investor Budget Sheet CTA */}
        <div className="bg-indigo-950/20 border border-indigo-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-indigo-300 font-black text-base">💰 Investor Budget Sheet</p>
            <p className="text-gray-400 text-sm mt-0.5">Full budget breakdown, valuation bridge, and ROI scenarios to present to an investor for LLC formation + patent filing.</p>
          </div>
          <Link to="/investor-budget-sheet"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-black text-sm transition-all">
            Open Sheet →
          </Link>
        </div>

        {/* Acquisition Ready Kit CTA */}
        <div className="bg-yellow-950/20 border border-yellow-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-yellow-300 font-black text-base">📦 Acquisition Ready Kit</p>
            <p className="text-gray-400 text-sm mt-0.5">Private listing draft, all 5 broker emails, due diligence PDFs, and Loom recording guide — all in one place.</p>
          </div>
          <Link to="/acquisition-ready-kit"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm transition-all">
            Open Kit →
          </Link>
        </div>

        {/* Bottom line */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center">
          <p className="text-white font-black text-lg mb-3">Bottom Line</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            You don't need to be an expert. You need to do 4 things this week: <strong className="text-white">form an LLC, open a bank account, screenshot your Stripe, and email one broker.</strong>
            Then let the broker guide you from there. That's what they're paid for.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://quietlight.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-black transition-all">
              Email Quiet Light <ExternalLink size={12} />
            </a>
            <a href="https://acquire.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold transition-all">
              List on Acquire.com <ExternalLink size={12} />
            </a>
            <a href="https://stripe.com/atlas" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold transition-all">
              Form LLC (Stripe Atlas) <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs pb-6">
          This page is informational only — not legal or financial advice. Consult qualified counsel before signing any agreements.
        </p>
      </div>
    </div>
  );
}