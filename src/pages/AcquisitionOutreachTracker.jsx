import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, ExternalLink, Copy, Check, ChevronDown, ChevronUp, Target, DollarSign, Users, FileText, Star, ShieldCheck, LayoutTemplate, Send } from "lucide-react";
import OutreachCRM from "../components/acquisition/OutreachCRM";
import AcquisitionTermSheet from "../components/acquisition/AcquisitionTermSheet";

const BROKERS = [
  {
    name: "IPOfferings.com",
    type: "IP Broker",
    model: "Contingency (% of deal)",
    contact: "info@ipofferings.com",
    website: "https://ipofferings.com",
    notes: "Largest IP broker. Works on pure contingency. Email them the executive summary + NDA.",
    priority: "high",
    status: "not_contacted",
  },
  {
    name: "Dominion Harbor",
    type: "Patent Monetization",
    model: "Pure contingency",
    contact: "info@dominionharbor.com",
    website: "https://dominionharbor.com",
    notes: "Specializes in patent licensing & monetization. No upfront fees. Strong defense/energy sector network.",
    priority: "high",
    status: "not_contacted",
  },
  {
    name: "Acacia Research",
    type: "IP Acquirer / Licensor",
    model: "Acquires or licenses — royalty splits",
    contact: "Via website contact form",
    website: "https://acaciaresearch.com",
    notes: "They buy or license IP and handle all monetization. Good for scalar EM / defense-adjacent IP.",
    priority: "high",
    status: "not_contacted",
  },
  {
    name: "Ocean Tomo",
    type: "IP Broker / M&A",
    model: "Commission on sale",
    contact: "info@oceantomo.com",
    website: "https://oceantomo.com",
    notes: "IP auctions + private M&A advisory. Good for full platform acquisition deals.",
    priority: "medium",
    status: "not_contacted",
  },
  {
    name: "Epicenter IP",
    type: "Boutique IP Broker",
    model: "Commission / contingency",
    contact: "Via website",
    website: "https://epicenterip.com",
    notes: "Boutique firm, handles fringe/emerging tech IP well. Personal relationships with buyers.",
    priority: "medium",
    status: "not_contacted",
  },
];

const PLATFORMS = [
  {
    name: "Acquire.com",
    type: "App/SaaS Marketplace",
    model: "Free to list, ~4% on close",
    website: "https://acquire.com",
    notes: "Private listing available — NDA required before any buyer sees details. Best for full platform acquisition.",
    priority: "high",
    status: "not_listed",
    cta: "Create Private Listing",
  },
  {
    name: "Flippa (Private)",
    type: "Digital Business Marketplace",
    model: "Listing fee ~$49, success fee ~10%",
    website: "https://flippa.com",
    notes: "Set listing to private/confidential. Buyer sees only a teaser — must request access to see details.",
    priority: "medium",
    status: "not_listed",
    cta: "Create Confidential Listing",
  },
  {
    name: "MicroAcquire",
    type: "Startup Acquisition",
    model: "Free, NDA-gated",
    website: "https://microacquire.com",
    notes: "Stealth listings standard. All buyers sign NDA before any contact. Good for faster smaller deals.",
    priority: "medium",
    status: "not_listed",
    cta: "Create Stealth Listing",
  },
];

const STATUS_OPTIONS = {
  not_contacted: { label: "Not Contacted", color: "bg-gray-800 text-gray-400 border-gray-700" },
  outreach_sent: { label: "Outreach Sent", color: "bg-blue-900/40 text-blue-300 border-blue-700" },
  in_discussion: { label: "In Discussion", color: "bg-yellow-900/40 text-yellow-300 border-yellow-700" },
  nda_signed: { label: "NDA Signed", color: "bg-purple-900/40 text-purple-300 border-purple-700" },
  proposal_sent: { label: "Proposal Sent", color: "bg-orange-900/40 text-orange-300 border-orange-700" },
  passed: { label: "Passed", color: "bg-red-900/20 text-red-500 border-red-800" },
  closed: { label: "Closed ✓", color: "bg-green-900/40 text-green-300 border-green-700" },
};

const LISTING_STATUS = {
  not_listed: { label: "Not Listed", color: "bg-gray-800 text-gray-400 border-gray-700" },
  listing_created: { label: "Listing Created", color: "bg-blue-900/40 text-blue-300 border-blue-700" },
  live: { label: "Live", color: "bg-green-900/40 text-green-300 border-green-700" },
  offer_received: { label: "Offer Received", color: "bg-yellow-900/40 text-yellow-300 border-yellow-700" },
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-xs text-gray-400 hover:text-white transition-all">
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function BrokerCard({ broker: initialBroker }) {
  const [broker, setBroker] = useState(initialBroker);
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");

  const st = STATUS_OPTIONS[broker.status];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-black text-yellow-400">
          {broker.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-white font-bold text-sm">{broker.name}</p>
            {broker.priority === "high" && <Star size={11} className="text-yellow-400 fill-yellow-400" />}
          </div>
          <p className="text-gray-500 text-xs">{broker.type} · {broker.model}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${st.color}`}>{st.label}</span>
          {expanded ? <ChevronUp size={13} className="text-gray-600" /> : <ChevronDown size={13} className="text-gray-600" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-3">
          <p className="text-gray-400 text-sm leading-relaxed">{broker.notes}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <a href={broker.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-all">
              <ExternalLink size={11} /> Website
            </a>
            <CopyBtn text={broker.contact} />
            <span className="text-gray-600 text-xs">{broker.contact}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Update Status:</p>
            {Object.entries(STATUS_OPTIONS).map(([key, val]) => (
              <button key={key} onClick={() => setBroker(b => ({ ...b, status: key }))}
                className={`text-xs px-2 py-1 rounded-full border font-semibold transition-all ${
                  broker.status === key ? val.color : "border-gray-700 text-gray-600 hover:border-gray-500"
                }`}>{val.label}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={note} onChange={e => setNote(e.target.value)}
              placeholder="Add a note (e.g. 'Spoke with John, sending exec summary')..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-gray-500 placeholder-gray-600" />
          </div>
        </div>
      )}
    </div>
  );
}

function PlatformCard({ platform: initialPlatform }) {
  const [platform, setPlatform] = useState(initialPlatform);
  const [expanded, setExpanded] = useState(false);
  const st = LISTING_STATUS[platform.status];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-black text-blue-400">
          {platform.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-white font-bold text-sm">{platform.name}</p>
            {platform.priority === "high" && <Star size={11} className="text-yellow-400 fill-yellow-400" />}
          </div>
          <p className="text-gray-500 text-xs">{platform.type} · {platform.model}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${st.color}`}>{st.label}</span>
          {expanded ? <ChevronUp size={13} className="text-gray-600" /> : <ChevronDown size={13} className="text-gray-600" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-3">
          <p className="text-gray-400 text-sm leading-relaxed">{platform.notes}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <a href={platform.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all">
              <ExternalLink size={11} /> {platform.cta}
            </a>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Update Status:</p>
            {Object.entries(LISTING_STATUS).map(([key, val]) => (
              <button key={key} onClick={() => setPlatform(p => ({ ...p, status: key }))}
                className={`text-xs px-2 py-1 rounded-full border font-semibold transition-all ${
                  platform.status === key ? val.color : "border-gray-700 text-gray-600 hover:border-gray-500"
                }`}>{val.label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const OUTREACH_TEMPLATE = `Subject: IP Portfolio Acquisition Opportunity — Patent-Backed EM & Energy Tech (NDA Required)

Hi [Name],

I'm reaching out regarding a discreet acquisition or licensing opportunity for a patent-backed IP portfolio in advanced electromagnetics, bioelectromagnetic therapeutics, and clean energy technology.

PLATFORM: Aethon Apex IP — aethon.base44.app/ip-broker

PORTFOLIO HIGHLIGHTS:
• 40+ invention build plans with calibrated BOMs, schematics & assembly documentation
• 6 patent clusters: Advanced Energy (MEG/ZPE), Bioelectromagnetic Therapeutics (Prioré-type), Scalar EM Communications, EMF Detection Instruments, Hydromagnetic Propulsion, Resonance Energy Transfer
• Estimated portfolio valuation: $2M – $50M (IP-adjusted DCF)
• 3–15 active/pending US patents with strong defensible claims
• 8+ addressable market sectors: defense, oncology, off-grid power, naval, IoT, space

PLATFORM ASSETS INCLUDED:
• Full source code (React + Deno backend) with 40+ live modules
• AI Patent Suite: drafting wizard, FTO analysis, patent monitoring, claims generator
• Virtual Data Room with NDA-gated investor access infrastructure
• Investor CRM, valuation engine, SBIR grant pipeline, IP Marketplace
• Stripe Live Mode — multi-stream revenue model (subscriptions, one-time, API, white-label)
• Complete research library: 200+ prior art entries, 26+ courses, knowledge graph

DEAL STRUCTURES AVAILABLE:
• Outright acquisition ($500K – $50M depending on portfolio scope)
• Exclusive field-of-use or geographic license
• Non-exclusive multi-licensee royalty arrangement
• Joint venture / equity co-development

This is a fully NDA-gated, private process. No public exposure.

To receive the full due diligence package (IP valuation report, patent landscape, financial model, Stripe screenshots, source code walkthrough):

Step 1 — Preview the broker page: https://aethon.base44.app/ip-broker
Step 2 — Reply to this email or sign NDA at: https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=ZARP-NDA&env=na4&acct=zenithapex

Happy to discuss any deal structure. Available for a call at your convenience.

Best regards,
[Your Name]
Aethon Apex IP
zenithapexresearch@gmail.com`;

const EXEC_SUMMARY = `AETHON APEX IP — 1-PAGE EXECUTIVE SUMMARY
Confidential · NDA Required · aethon.base44.app/ip-broker
═══════════════════════════════════════════════════════════════

WHAT IT IS
A patent-backed IP portfolio and AI-powered commercialization platform spanning 6 advanced technology clusters: electromagnetic energy systems, bioelectromagnetic therapeutics, scalar communications, EMF instrumentation, hydromagnetic propulsion, and resonance energy transfer.

PORTFOLIO SIZE & STAGE
• 40+ fully documented inventions with calibrated BOMs and assembly specs
• 3–15 active/pending US patents (strong independent claims)
• 6 patent clusters across 8+ addressable market sectors
• All inventions cite granted US patents or peer-reviewed literature

IP VALUATION RANGE
Conservative: $2M – $10M (patent count + R&D spend DCF basis)
Strategic:    $10M – $50M (to defense contractor, pharma, or energy acquirer)
Asset Floor:  $16.2M (40+ built platform modules at comparable SaaS benchmarks)

REVENUE MODEL (EXISTING PLATFORM)
SaaS Subscriptions   $29–$497/mo · Explorer → Enterprise tiers
Build Plan Sales     $49–$600 per plan · 40+ catalogue
Course Library       26+ engineering courses · $97–$497 each
AI Patent Suite      Credits + subscriptions · $49–$349 per pack
White-Label SaaS     $10K–$50K/yr per IP firm or university
Valuation API        $0.50–$2.00/call · B2B (VCs, law firms, R&D)
Current ARR target: $58K (conservative) → $350K+ (12mo post-acquisition)

TECHNOLOGY
React 18 + Tailwind · Deno Deploy backend · Stripe Live Mode
20+ database entities · 50+ backend functions · Claude/GPT/Gemini AI
Modules: Patent Drafting, FTO Analysis, VDR, Investor CRM, IP Marketplace,
         SBIR Pipeline, Valuation API, Co-Inventor Matching, Build Tracker

DEAL STRUCTURES
• Full acquisition: $750K – $2.5M (platform + IP portfolio)
• IP-only licensing: $250K – $5M upfront + royalties
• Exclusive field license (per sector): negotiable
• Joint venture / equity: available for strategic partners

IDEAL ACQUIRER
IP law firm · Defense/R&D contractor · EdTech/LegalTech rollup
VC-backed IP marketplace · Pharma / biotech (bioEM cluster)
Individual operator/SaaS acquirer

CONTACT & NEXT STEPS
1. Sign NDA to receive full due diligence package
2. VDR access granted within 24 hours
3. Technical walkthrough + Stripe revenue call available
4. Term sheet generated within 48 hours of qualified interest

Email: zenithapexresearch@gmail.com
Subject: "Aethon Apex IP — Acquisition Inquiry"
Broker Page: https://aethon.base44.app/ip-broker

This document is confidential. Distribution prohibited without written consent.
All figures are projections. Subject to NDA and due diligence verification.`;

const LEGAL_SECTIONS = [
  {
    title: "🚀 Do Today — Before Any Outreach",
    color: "border-green-800/50 bg-green-950/10",
    headingColor: "text-green-400",
    items: [
      {
        id: "biz_email",
        label: "Get a business email address",
        detail: "founder@zenithapexresearch.com via Google Workspace (~$6/mo). Takes 15 min. Makes every email 10x more credible to VCs and brokers.",
        link: "https://workspace.google.com",
        linkLabel: "Google Workspace →",
        urgent: true,
      },
      {
        id: "exec_summary",
        label: "Write a 1-page executive summary",
        detail: "Title, what ZARP is, key assets (21+ build plans, AI tools, recurring revenue), asking price range, and contact. Attach to every broker email.",
        urgent: true,
      },
      {
        id: "nda_ready",
        label: "Confirm your DocuSign NDA is active & working",
        detail: "Test the NDA link yourself: https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=ZARP-NDA — make sure it routes to you correctly.",
        link: "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=ZARP-NDA&env=na4&acct=zenithapex",
        linkLabel: "Test NDA Link →",
        urgent: true,
      },
    ],
  },
  {
    title: "🏢 This Week — Before Serious Discussions",
    color: "border-blue-800/50 bg-blue-950/10",
    headingColor: "text-blue-400",
    items: [
      {
        id: "llc",
        label: "Form an LLC",
        detail: "Protects your personal assets. Do this before signing any term sheet or LOI. Cost: $50–$150. Use Stripe Atlas (Delaware LLC, easiest for investors) or your state directly.",
        link: "https://stripe.com/atlas",
        linkLabel: "Stripe Atlas →",
        urgent: false,
      },
      {
        id: "bank_account",
        label: "Open a business bank account",
        detail: "Required once you have an LLC. Mercury.com is free and perfect for startups/acquisitions. Buyers will ask about business financials.",
        link: "https://mercury.com",
        linkLabel: "Mercury (free) →",
        urgent: false,
      },
      {
        id: "revenue_docs",
        label: "Gather revenue & membership records",
        detail: "Screenshot Stripe dashboard, export revenue history, list number of active beta members. Buyers will ask for trailing 12-month revenue in first call.",
        urgent: false,
      },
    ],
  },
  {
    title: "⚖️ Patent & IP Risk — Do You Infringe Anyone?",
    color: "border-yellow-800/50 bg-yellow-950/10",
    headingColor: "text-yellow-400",
    items: [
      {
        id: "infringement_risk",
        label: "✅ Overall infringement risk: VERY LOW",
        detail: "You are selling educational content, research documentation, and software tools — NOT manufacturing or distributing patented physical devices. Selling a 'build plan' for educational purposes is legally distinct from selling the device itself. This is the same model used by universities, IEEE, and patent libraries worldwide.",
        urgent: false,
      },
      {
        id: "bearden_prior_art",
        label: "✅ Bearden's published work is prior art — not active patent",
        detail: "Most Bearden-derived devices were published as research papers, creating prior art. This means no one can hold a valid patent over those concepts, and you are free to teach, document, and sell research based on them. Prior art publication dates back to the 1980s–2000s.",
        urgent: false,
      },
      {
        id: "expired_patents",
        label: "✅ Referenced patents are expired or dedicated to public domain",
        detail: "US utility patents expire after 20 years from filing. Patents from the 1980s–2000s (e.g. MEG: US6,362,718 filed 2000 — expired ~2020) are fully in the public domain. Expired patents are FREE to use, reproduce, teach from, and sell documentation about.",
        link: "https://patents.google.com/patent/US6362718",
        linkLabel: "Check MEG patent expiry →",
        urgent: false,
      },
      {
        id: "prioré_status",
        label: "✅ Prioré-type devices — no enforceable US patent",
        detail: "Antoine Prioré's French patents expired decades ago. No valid US patent exists on the general multichannel EM therapeutic methodology described in your build plans. Your documentation cites published journal sources (Foundations of Physics Letters, etc.) — all prior art.",
        urgent: false,
      },
      {
        id: "software_ip",
        label: "✅ Your platform software is 100% original — no third-party IP concerns",
        detail: "Your React codebase, AI tools, VDR, patent drafting wizard, and all modules were built original from scratch on Base44. No copied libraries, no cloned SaaS. The AI-generated patent drafts are research output, not reproductions of protected works.",
        urgent: false,
      },
      {
        id: "no_medical_claims",
        label: "⚠️ NEVER make medical, therapeutic, or 'free energy' product claims",
        detail: "This is your highest regulatory risk. Keep all content clearly labeled as 'research', 'educational', and 'experimental.' Never say 'this device treats X disease' or 'generates unlimited power.' Your terms of service and disclaimers already cover this — make sure marketing materials match.",
        urgent: true,
      },
      {
        id: "no_fcc_claims",
        label: "⚠️ Do not imply FCC or FDA approval for any device",
        detail: "None of the devices in your build plans are FCC-certified or FDA-cleared. As long as you label them as research/experimental builds (not consumer products), you are operating legally. Do not use phrases like 'certified,' 'approved,' or 'safe for medical use.'",
        urgent: true,
      },
      {
        id: "trademark_check",
        label: "⚠️ Check your brand name 'Aethon Apex IP' on USPTO TESS",
        detail: "Before acquiring or licensing under this brand, run a trademark search on USPTO TESS (tess.uspto.gov) for 'Aethon Apex' and 'Aethon' in your classes (IC 042 — software/research services). This takes 10 minutes and prevents a future brand conflict.",
        link: "https://tess.uspto.gov",
        linkLabel: "Search USPTO TESS →",
        urgent: true,
      },
      {
        id: "content_citations",
        label: "✅ All research content is properly cited to source patents and papers",
        detail: "Every build plan cites the originating US patent number or journal reference. This demonstrates good-faith educational use and dramatically reduces any IP exposure. Never reproduce the full text of a patent claim as your own — summarize and cite.",
        urgent: false,
      },
      {
        id: "ip_attorney",
        label: "Recommended: $300–$500 IP attorney consult before any acquisition closes",
        detail: "One hour with a USPTO-registered patent attorney is worth every dollar before signing any LOI or term sheet. They can do a rapid FTO (Freedom-to-Operate) review on your top 3–5 inventions. Find one on Avvo.com or USPTO's attorney registry.",
        link: "https://www.avvo.com/patent-lawyer.html",
        linkLabel: "Find USPTO Patent Attorney →",
        urgent: false,
      },
    ],
  },
  {
    title: "📋 Before Signing Any Deal",
    color: "border-purple-800/50 bg-purple-950/10",
    headingColor: "text-purple-400",
    items: [
      {
        id: "llc_before_deal",
        label: "LLC must be formed before signing LOI or term sheet",
        detail: "Never sign acquisition documents as an individual. The LLC is the seller. This is critical for tax and liability reasons.",
        urgent: false,
      },
      {
        id: "lawyer_review",
        label: "Have a lawyer review any term sheet",
        detail: "One-time cost ~$500–$1,500 to review an acquisition term sheet. Worth every dollar. Look for M&A attorneys or use Clerky.com for lighter-touch review.",
        link: "https://www.clerky.com",
        linkLabel: "Clerky →",
        urgent: false,
      },
      {
        id: "asset_vs_stock",
        label: "Understand asset sale vs. stock sale",
        detail: "Most platform/IP acquisitions are asset sales (buyer purchases specific IP, code, content — not the whole LLC). This is simpler and better for you as the seller.",
        urgent: false,
      },
    ],
  },
];

function LegalChecklist() {
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const totalItems = LEGAL_SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white font-bold text-sm flex items-center gap-2"><ShieldCheck size={14} className="text-green-400" /> Legal & Setup Progress</p>
          <span className="text-green-400 font-black text-sm">{doneCount}/{totalItems}</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${totalItems > 0 ? (doneCount / totalItems) * 100 : 0}%` }} />
        </div>
        <p className="text-gray-600 text-xs mt-1.5">Click any item to mark as done</p>
      </div>

      {LEGAL_SECTIONS.map((section, si) => (
        <div key={si} className={`border rounded-2xl p-4 space-y-3 ${section.color}`}>
          <p className={`font-black text-sm ${section.headingColor}`}>{section.title}</p>
          {section.items.map((item) => (
            <div key={item.id}
              onClick={() => toggle(item.id)}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                checked[item.id]
                  ? "bg-green-950/30 border-green-800/40 opacity-60"
                  : "bg-gray-900/60 border-gray-700/50 hover:border-gray-600"
              }`}>
              <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                checked[item.id] ? "bg-green-600 border-green-600" : "border-gray-600"
              }`}>
                {checked[item.id] && <Check size={11} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className={`text-sm font-semibold leading-snug ${checked[item.id] ? "line-through text-gray-600" : "text-white"}`}>
                    {item.label}
                  </p>
                  {item.urgent && !checked[item.id] && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-900/40 text-red-400 border border-red-800/50 font-bold">NOW</span>
                  )}
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{item.detail}</p>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="inline-flex items-center gap-1 mt-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    <ExternalLink size={10} /> {item.linkLabel}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AcquisitionOutreachTracker() {
  const [tab, setTab] = useState("brokers");
  const [showTemplate, setShowTemplate] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showTermSheet, setShowTermSheet] = useState(false);

  const highPriorityBrokers = BROKERS.filter(b => b.priority === "high").length;
  const highPriorityPlatforms = PLATFORMS.filter(p => p.priority === "high").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/zarp-acquisition" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Target size={14} className="text-yellow-400" /> Acquisition Outreach Tracker
            </h1>
            <p className="text-gray-500 text-xs">No money upfront — brokers, platforms & direct buyer pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowSummary(s => !s); setShowTemplate(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/40 border border-purple-700 text-purple-300 text-xs font-bold hover:bg-purple-800/50 transition-all">
            <LayoutTemplate size={12} /> {showSummary ? "Hide" : "1-Page"} Summary
          </button>
          <button onClick={() => { setShowTemplate(t => !t); setShowSummary(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-xs font-bold hover:bg-yellow-800/50 transition-all">
            <FileText size={12} /> {showTemplate ? "Hide" : "Email"} Template
          </button>
          <button onClick={() => setShowTermSheet(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-900/40 border border-green-700 text-green-300 text-xs font-bold hover:bg-green-800/50 transition-all">
            <FileText size={12} /> Draft Term Sheet
          </button>
          <Link to="/exit-advisor" 
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-700 text-blue-300 text-xs font-bold hover:bg-blue-800/50 transition-all">
            <Users size={12} /> Exit Advisor
          </Link>
        </div>
      </div>

      {/* Acquisition Term Sheet Modal */}
      {showTermSheet && <AcquisitionTermSheet onClose={() => setShowTermSheet(false)} />}

      {/* 1-Page Executive Summary */}
      {showSummary && (
        <div className="mx-5 mt-4 bg-gray-900 border border-purple-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-purple-400 text-xs font-black uppercase tracking-wider">1-Page Executive Summary — Copy & Send with Every Broker Email</p>
            <CopyBtn text={EXEC_SUMMARY} />
          </div>
          <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-800/50 rounded-xl p-4 max-h-80 overflow-y-auto">
            {EXEC_SUMMARY}
          </pre>
        </div>
      )}

      {/* Email Template */}
      {showTemplate && (
        <div className="mx-5 mt-4 bg-gray-900 border border-yellow-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-yellow-400 text-xs font-black uppercase tracking-wider">Cold Outreach Email Template — IP Broker Edition</p>
            <CopyBtn text={OUTREACH_TEMPLATE} />
          </div>
          <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-800/50 rounded-xl p-4 max-h-80 overflow-y-auto">
            {OUTREACH_TEMPLATE}
          </pre>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-5 pt-5">
        {[
          { label: "IP Brokers", value: BROKERS.length, sub: `${highPriorityBrokers} high priority`, icon: <DollarSign size={14} className="text-yellow-400" /> },
          { label: "Marketplaces", value: PLATFORMS.length, sub: `${highPriorityPlatforms} recommended`, icon: <Users size={14} className="text-blue-400" /> },
          { label: "LinkedIn Targets", value: 23, sub: "in outreach list", icon: <Target size={14} className="text-green-400" /> },
        ].map((s, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            {s.icon}
            <div>
              <p className="text-white font-black text-xl">{s.value}</p>
              <p className="text-gray-400 text-xs font-semibold">{s.label}</p>
              <p className="text-gray-600 text-xs">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Priority Action Box */}
      <div className="mx-5 mt-4 bg-green-950/20 border border-green-800/40 rounded-2xl p-4">
        <p className="text-green-400 font-black text-xs uppercase tracking-wider mb-2">✅ Recommended First Steps (No Money Upfront)</p>
        <ol className="space-y-1">
          {[
            "Email IPOfferings.com — paste the template above, attach your 1-page exec summary",
            "Submit to Dominion Harbor — focus on the scalar EM patent angle",
            "Create a private/stealth listing on Acquire.com — free, NDA-gated",
            "Continue LinkedIn outreach — Bryan Johnson, Laura Deming, Eric Weinstein are highest probability",
            "Contact Acacia Research if you want them to acquire & monetize the IP themselves",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300 text-xs leading-relaxed">
              <span className="text-green-500 font-bold flex-shrink-0">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 pt-5 border-b border-gray-800 overflow-x-auto">
        {[
          { id: "crm", label: "📨 Outreach CRM" },
          { id: "brokers", label: "IP Brokers & M&A" },
          { id: "platforms", label: "Marketplace Listings" },
          { id: "linkedin", label: "Direct Buyer Outreach" },
          { id: "legal", label: "⚖️ Legal & Setup" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              tab === t.id ? "border-yellow-500 text-yellow-300" : "border-transparent text-gray-500 hover:text-gray-300"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-4xl mx-auto w-full space-y-3">
        {tab === "crm" && (
          <OutreachCRM outreachTemplate={OUTREACH_TEMPLATE} />
        )}

        {tab === "brokers" && (
          <>
            <p className="text-gray-500 text-xs mb-4">These firms work on contingency or commission — <strong className="text-gray-300">zero money upfront</strong>. They find buyers/licensees and take a % on close.</p>
            {BROKERS.map((b, i) => <BrokerCard key={i} broker={b} />)}
          </>
        )}

        {tab === "platforms" && (
          <>
            <p className="text-gray-500 text-xs mb-4">List your platform privately — buyers sign NDA before seeing any details. No public exposure.</p>
            {PLATFORMS.map((p, i) => <PlatformCard key={i} platform={p} />)}
          </>
        )}

        {tab === "legal" && <LegalChecklist />}

        {tab === "linkedin" && (
          <div className="space-y-4">
            <p className="text-gray-500 text-xs">Your existing LinkedIn prospect list is the fastest path to a warm acquisition conversation. These 23 targets already align with the thesis.</p>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-white font-bold mb-3">Top 5 Highest-Probability Direct Buyers</p>
              <div className="space-y-3">
                {[
                  { name: "Bryan Johnson", org: "OS Fund", why: "Paid $100M for Blueprint longevity — TRD-1 device is a natural fit", urgency: "high" },
                  { name: "Laura Deming", org: "Longevity Fund", why: "Dedicated longevity VC — telomere science is her core thesis", urgency: "high" },
                  { name: "Eric Weinstein", org: "Thiel Capital", why: "Physicist + VC — publicly advocates for suppressed science", urgency: "high" },
                  { name: "David Sinclair", org: "Harvard / NovaBay", why: "World's #1 longevity researcher — direct alignment with MCCS protocol", urgency: "high" },
                  { name: "Peter Thiel", org: "Founders Fund", why: "Invests in 'secrets' — scalar EM IP is exactly his thesis", urgency: "medium" },
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-black text-gray-300 flex-shrink-0">
                      {p.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-sm">{p.name}</p>
                        <span className="text-xs text-gray-500">· {p.org}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ml-auto ${
                          p.urgency === "high" ? "bg-green-900/30 text-green-400 border-green-800/50" : "bg-yellow-900/30 text-yellow-400 border-yellow-800/50"
                        }`}>{p.urgency}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">{p.why}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <Link to="/social-agent" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-sm transition-all">
                  Open LinkedIn Outreach Agent →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}