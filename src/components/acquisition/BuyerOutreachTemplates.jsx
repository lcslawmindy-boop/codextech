import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// ── All templates ─────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "ip_broker",
    label: "IP Broker Cold Outreach",
    tag: "IP BROKER",
    color: "#f59e0b",
    audience: "IPOfferings.com, Dominion Harbor, Acacia Research",
    subject: "IP Portfolio Acquisition Opportunity — Patent-Backed EM & Energy Tech (NDA Required)",
    body: `Hi [Name],

I'm reaching out regarding a discreet acquisition or licensing opportunity for a patent-backed IP portfolio in advanced electromagnetics, bioelectromagnetic therapeutics, and clean energy technology.

PLATFORM: Aethon Apex IP — aethon.base44.app/ip-broker

PORTFOLIO HIGHLIGHTS:
• 40+ invention build plans with calibrated BOMs, schematics & assembly documentation
• 6 patent clusters: Advanced Energy (MEG/ZPE), Bioelectromagnetic Therapeutics (Prioré-type), Scalar EM Communications, EMF Detection Instruments, Hydromagnetic Propulsion, Resonance Energy Transfer
• Estimated portfolio valuation: $2M – $50M (IP-adjusted DCF)
• 3–15 active/pending US patents with strong defensible claims
• 8+ addressable market sectors: defense, oncology, off-grid power, naval, IoT, space

DEAL STRUCTURES AVAILABLE:
• Outright acquisition ($500K – $50M depending on scope)
• Exclusive field-of-use or geographic license
• Non-exclusive multi-licensee royalty arrangement
• Joint venture / equity co-development

This is a fully NDA-gated, private process. No public exposure.

Step 1 — Preview the broker page: https://aethon.base44.app/ip-broker
Step 2 — Reply to request the full due diligence package (IP valuation report, patent landscape, Stripe revenue screenshots, source code walkthrough)

Available for a call at your convenience.

Best regards,
[Your Name]
zenithapexresearch@gmail.com`,
  },
  {
    id: "defense_contractor",
    label: "Defense Contractor / R&D Prime",
    tag: "DEFENSE",
    color: "#ef4444",
    audience: "Lockheed, Raytheon, Northrop, DARPA-aligned primes",
    subject: "Proprietary Scalar EM & Directed Energy IP Portfolio — Strategic Acquisition Opportunity",
    body: `Dear [BD / M&A Contact],

I'm contacting your business development team regarding a proprietary IP portfolio in scalar electromagnetics, directed energy instrumentation, and advanced resonance communications — technology clusters directly aligned with DoD R&D priorities.

TECHNOLOGY OVERVIEW:
• Scalar wave communications systems (classified-reference sourced)
• Broadband EM threat detection & characterization instruments
• Resonance energy transfer for remote power delivery
• Bioelectromagnetic therapeutic devices (dual-use: medical/field recovery)
• MEG-class over-unity generator designs (documented, patent-cited)

INTELLECTUAL PROPERTY:
• 40+ fully documented inventions with engineering-grade specifications
• 3–15 US patents (active, pending, or provisional-ready)
• Complete prior art documentation — 200+ entries with inline patent citations
• AI-powered patent analysis infrastructure included in asset sale

PLATFORM ASSETS BUNDLED:
• Full-stack SaaS platform (React + Deno) — 100+ modules, AI tools, Stripe revenue
• Virtual Data Room with NDA-gated due diligence infrastructure
• Investor CRM, SBIR grant pipeline analysis, IP valuation engine

ASKING RANGE: $2M – $10M+ (asset sale or exclusive field license)
DEAL STRUCTURE: Open to outright acquisition, DoD SBIR licensing, or R&D partnership

All materials are NDA-gated. I can provide a one-page technical brief and broker page preview without signing.

Please forward to your M&A or IP licensing desk if appropriate.

Respectfully,
[Your Name]
zenithapexresearch@gmail.com
https://aethon.base44.app/ip-broker`,
  },
  {
    id: "pharma_biotech",
    label: "Pharma / Biotech (Bioelectromagnetics)",
    tag: "PHARMA",
    color: "#22c55e",
    audience: "Oncology R&D leads, biotech VCs, cancer research institutes",
    subject: "Bioelectromagnetic Therapeutic IP — Non-Ionizing EM Cancer Research Platform (Confidential)",
    body: `Dear [Research Director / BD Contact],

I'm reaching out regarding a confidential acquisition opportunity for a bioelectromagnetic therapeutic IP portfolio — specifically the multichannel EM / Prioré-type device cluster and supporting research documentation.

RESEARCH BASIS:
• Sourced from peer-reviewed publications in Foundations of Physics Letters (Bearden et al.)
• References declassified French government documentation on Prioré device trials
• Documented prior art from 1970s–2000s — all expired or public domain
• No active patent conflicts in US oncology EM space (FTO pre-screened)

INCLUDED ASSETS:
• 6+ bioelectromagnetic device build plans with full engineering specs
• TRD-1 Telomere Resonance Device documentation
• MCCS (Multichannel Coherence Stimulator) — structured protocols
• Biophoton emission documentation and measurement instruments
• Prior art archive: 40+ bioelectromagnetics-specific entries

PLATFORM INFRASTRUCTURE:
• AI patent drafting tools pre-trained on EM therapeutic prior art
• Full course library: bioelectromagnetics fundamentals through advanced EM therapy
• Researcher community & knowledge graph

DEAL STRUCTURE OPTIONS:
• Field-of-use license (oncology / therapeutic applications): $250K–$1M upfront + royalties
• Exclusive acquisition of bioEM cluster: $500K–$3M
• Research collaboration / joint development agreement

This is research and educational IP — not FDA-cleared devices. All documentation is presented as engineering research for qualified buyers only.

NDA required to access full due diligence package.

Best regards,
[Your Name]
zenithapexresearch@gmail.com`,
  },
  {
    id: "ip_law_firm",
    label: "IP Law Firm (White-Label Licensing)",
    tag: "LEGAL TECH",
    color: "#6366f1",
    audience: "Patent law firms, IP boutiques, LegalTech rollups",
    subject: "AI Patent Suite — White-Label Licensing Opportunity for IP Law Firms",
    body: `Dear [Managing Partner / Technology Director],

I'm reaching out about a white-label licensing opportunity for an AI-powered patent intelligence suite — built specifically for IP practitioners and patent-intensive R&D operations.

THE PLATFORM (already built, fully functional):

AI Patent Drafting Wizard
→ USPTO-formatted claim generation, independent/dependent claim structuring, spec and abstract auto-drafting
→ Output quality: research-grade (not a toy)

Freedom-to-Operate Analysis Engine
→ Blocking patent identification, risk scoring (0–100), design-around strategy generation
→ Jurisdiction-specific risk mapping (USPTO, EPO, WIPO)

Patent Monitoring & Alert System
→ Real-time scanning of USPTO, EPO databases for competitor filings
→ Automated threat alerts with recommended actions

Invention Forge
→ AI hybrid concept generation from existing IP clusters
→ Patent claim drafting from concept description
→ IP valuation estimation

Prior Art Intelligence Library
→ 200+ classified, curated prior art entries
→ Inline citation system — sourced from granted US patents

LICENSING MODEL:
• Annual white-label license per firm: $10K–$50K/year
• Platform is React/Vite + Deno — can be rebranded in hours
• Full source code transfer available for outright acquisition

Current asking range for full platform: $150K–$750K (depending on deal structure)
White-label license: $25K–$50K/year per IP firm

I'm happy to provide a live demo. No NDA required for the overview — full technical access gated behind NDA.

Best regards,
[Your Name]
zenithapexresearch@gmail.com
Demo: https://aethon.base44.app/patent-hub`,
  },
  {
    id: "saas_operator",
    label: "SaaS Operator / Search Fund",
    tag: "SaaS BUYER",
    color: "#06b6d4",
    audience: "Acquire.com buyers, search fund operators, solo acquirers",
    subject: "AI + IP Research SaaS for Sale — Stripe Live, 100+ Pages, Asking $150K–$500K",
    body: `Hi,

Quick overview of a platform I'm looking to sell — might be a fit if you're looking for an AI/IP niche SaaS with a built-in content moat.

THE BUSINESS:
• Name: Aethon Apex IP
• URL: aethon.base44.app
• Type: SaaS + AI tools + IP research content platform
• Niche: Electromagnetic engineering research + AI patent tools

REVENUE MODEL:
• Subscriptions: $29/mo (Explorer) → $497/mo (Enterprise)
• One-time: Build plans $49–$600, Courses $97–$497
• AI tool credits, white-label SaaS, Valuation API calls
• Physical shop (EMF protection kits, component bundles)
• Stripe Live Mode — active payment infrastructure

ASSETS INCLUDED:
• Full source code (React + Deno) — 100+ pages, 50+ backend functions
• 40+ engineering build plans with verified BOMs
• 26+ structured courses
• AI patent suite (drafting, FTO, monitoring, attorney chat)
• 200+ prior art research entries
• Virtual Data Room with investor access infrastructure
• Investor CRM, SBIR pipeline, IP marketplace
• All Stripe products and pricing already configured

TECH STACK:
React/Vite + Tailwind frontend · Deno Deploy backend
Claude/GPT/Gemini AI integrations · Stripe Live Mode
Base44 managed backend (zero-DevOps handoff)

WHY SELLING: Focusing on a different venture. Platform is operationally complete and ready to hand off.

ASKING: $150K–$500K (open to discussion)
NDA: Not required for basic overview. VDR access on request.

Happy to do a 30-min Loom walkthrough or live call.

[Your Name]
zenithapexresearch@gmail.com`,
  },
  {
    id: "vc_longevity",
    label: "Longevity / Deep-Tech VC",
    tag: "INVESTOR",
    color: "#a855f7",
    audience: "Bryan Johnson (OS Fund), Laura Deming (Longevity Fund), Eric Weinstein",
    subject: "Bioelectromagnetic IP Portfolio — Longevity & EM Therapeutics Research Platform",
    body: `Dear [Name],

I'm reaching out because your investment thesis maps directly to an IP portfolio I'm positioning for strategic acquisition or licensing.

THE THESIS ALIGNMENT:
You've publicly backed radical life extension, non-mainstream biology, and "the kinds of technologies that shouldn't exist according to consensus physics."

This is exactly that.

WHAT I'VE BUILT:
A fully documented research platform around 6 technology clusters — including bioelectromagnetic therapeutics (Prioré-type devices), resonance energy transfer, and scalar EM communications. Every invention is sourced from granted US patents or peer-reviewed literature. None of this is new — it's been suppressed, defunded, or ignored for decades. The documentation, engineering specs, and AI tooling are new.

SPECIFIC LONGEVITY-RELEVANT IP:
• TRD-1: Telomere Resonance Device — EM protocol for telomerase activation
• MCCS: Multichannel Coherence Stimulator — Prioré-inspired multichannel EM therapy
• Biophoton emission instruments — cellular health measurement
• Full prior art library — 40+ peer-reviewed bioEM entries

THE PLATFORM:
AI patent suite · Virtual data room · Stripe subscriptions ($29–$497/mo) · 200+ research archive · 40+ engineering build plans · 26+ courses

This isn't a speculative pitch deck. The platform is live, the IP is documented, and the engineering is real.

WHAT I'M LOOKING FOR:
A strategic conversation — whether that's acquisition, licensing, co-development, or introductions to your portfolio companies.

NDA available. Due diligence package ready on request.

[Your Name]
zenithapexresearch@gmail.com
https://aethon.base44.app/ip-broker`,
  },
];

// ── 5-Email Follow-Up Sequence ────────────────────────────────────────────────
const SEQUENCES = [
  {
    day: "Day 0",
    label: "Initial Outreach",
    color: "#06b6d4",
    desc: "Send the appropriate template above. Keep it factual and brief. Attach or link your 1-page executive summary.",
    subject: "[Use the relevant template above]",
    body: `[Use the relevant cold outreach template from above for your specific buyer type]

ALWAYS ATTACH OR LINK:
1. 1-page executive summary (copy from /acquisition-outreach → Executive Summary)
2. Broker page link: https://aethon.base44.app/ip-broker
3. Your NDA link for VDR access`,
  },
  {
    day: "Day 4",
    label: "Follow-Up #1 — Value Reminder",
    color: "#a855f7",
    desc: "Short follow-up. Add one new data point they haven't seen. Don't re-pitch. Just nudge.",
    subject: "Re: IP Portfolio — One More Data Point",
    body: `Hi [Name],

Following up on my note from [Day].

One thing I didn't mention: the AI patent drafting suite processes full USPTO-formatted claims in under 60 seconds. That alone has been the highest-retention feature for our early users — and it's fully white-labelable.

If this isn't the right fit for your portfolio, I'd appreciate a quick "not interested" so I can close the loop.

If there's any interest — even at a preliminary stage — I'm happy to do a 20-min no-NDA demo.

[Your Name]`,
  },
  {
    day: "Day 10",
    label: "Follow-Up #2 — Social Proof / Third-Party",
    color: "#f59e0b",
    desc: "Reference a comparable deal or third-party validation to build credibility.",
    subject: "Re: Aethon Apex IP — Comparable Deals Reference",
    body: `Hi [Name],

One more note — I've been looking at comparable transactions:

• AI patent tools platforms have sold for $200K–$2M on Acquire.com in 2023–2024
• IP content libraries (engineering + research) typically 3–5× ARR
• EM/energy IP portfolios: Ocean Tomo and IPOfferings have closed deals in the $500K–$5M range for smaller portfolios

For context: we're live on Stripe, have active subscribers, and the codebase is fully transferable with zero DevOps overhead (managed backend).

I'm also in conversations with [Quiet Light / IPOfferings — name the broker you've actually emailed] about a formal listing, which I wanted to give you the opportunity to see first.

Happy to connect this week.

[Your Name]`,
  },
  {
    day: "Day 18",
    label: "Follow-Up #3 — Urgency / Deadline",
    color: "#ef4444",
    desc: "Create a soft deadline. You're listing publicly soon. First-mover gets exclusivity window.",
    subject: "Re: Aethon Apex IP — Listing Publicly Next Week",
    body: `Hi [Name],

Quick heads-up: I'm going to list this publicly on Acquire.com and Flippa next week after getting some final documentation in order.

Before I do — I wanted to give you a first-look window. Once it's listed publicly, I lose the ability to offer an exclusivity period or a clean bilateral NDA process.

If you'd like to review the due diligence package (Stripe revenue screenshots, patent documentation, source code overview, asset list) before the public listing, I can have that to you within 24 hours of NDA signing.

No pressure — just wanted to be transparent about the timeline.

[Your Name]`,
  },
  {
    day: "Day 30",
    label: "Follow-Up #4 — Final Check-In",
    color: "#22c55e",
    desc: "Clean close. Leave the door open. Short and professional.",
    subject: "Re: Aethon Apex IP — Closing the Loop",
    body: `Hi [Name],

Last note from me on this — I don't want to clog your inbox.

The platform is now live on Acquire.com. We've had [X] inquiries in the first [X] days.

If the timing wasn't right when I first reached out, I understand — these decisions don't move on my timeline. If circumstances change or you'd like to revisit, I'm easy to find.

Either way, I appreciate you taking the time to read my notes.

[Your Name]
zenithapexresearch@gmail.com

P.S. — If you know someone who might be a better fit for this (defense tech, longevity biotech, LegalTech), an introduction would be genuinely appreciated.`,
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function CopyBlock({ label, value }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
        <button
          onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 font-bold transition-all">
          {copied ? <Check size={9} className="text-green-400" /> : <Copy size={9} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-900 rounded-lg px-3 py-3 border border-gray-800 max-h-72 overflow-y-auto">
        {value}
      </pre>
    </div>
  );
}

function TemplateCard({ tpl }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-xl overflow-hidden" style={{ borderColor: tpl.color + "40" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between px-4 py-3.5 text-left hover:bg-gray-900/60 transition-colors"
        style={{ background: tpl.color + "0d" }}>
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-xs px-2 py-0.5 rounded font-black flex-shrink-0 mt-0.5"
            style={{ background: tpl.color + "22", color: tpl.color, border: `1px solid ${tpl.color}40` }}>
            {tpl.tag}
          </span>
          <div className="min-w-0">
            <p className="text-white font-black text-sm">{tpl.label}</p>
            <p className="text-gray-500 text-xs mt-0.5 truncate">To: {tpl.audience}</p>
          </div>
        </div>
        {open ? <ChevronUp size={13} className="text-gray-500 flex-shrink-0 mt-1" /> : <ChevronDown size={13} className="text-gray-500 flex-shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="bg-gray-950 px-4 pb-4 pt-3 space-y-3 border-t border-gray-800">
          <CopyBlock label="Subject Line" value={tpl.subject} />
          <CopyBlock label="Email Body" value={tpl.body} />
          <p className="text-gray-700 text-xs">Fill in <strong className="text-gray-500">[Your Name]</strong> and <strong className="text-gray-500">[Name]</strong> before sending.</p>
        </div>
      )}
    </div>
  );
}

function SequenceCard({ seq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-900/60 transition-colors bg-gray-900/30">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ background: seq.color + "22", color: seq.color }}>{seq.day}</span>
          <div>
            <p className="text-white font-bold text-sm">{seq.label}</p>
            <p className="text-gray-600 text-xs mt-0.5">{seq.desc}</p>
          </div>
        </div>
        {open ? <ChevronUp size={13} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={13} className="text-gray-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="bg-gray-950 px-4 pb-4 pt-3 space-y-3 border-t border-gray-800">
          <CopyBlock label="Subject Line" value={seq.subject} />
          <CopyBlock label="Email Body" value={seq.body} />
        </div>
      )}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function BuyerOutreachTemplates() {
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
        {[
          { id: "templates", label: "📨 Cold Outreach Templates (6)" },
          { id: "sequence", label: "🔁 5-Email Follow-Up Sequence" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === t.id ? "bg-gray-700 text-white" : "text-gray-600 hover:text-gray-400"
            }`}>{t.label}</button>
        ))}
      </div>

      {/* Templates */}
      {activeTab === "templates" && (
        <div className="space-y-3">
          <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-3">
            <p className="text-blue-300 text-xs leading-relaxed">
              <strong className="text-blue-200">6 buyer-specific templates.</strong> Each is optimized for its audience — don't send the defense template to a SaaS buyer. Pick the one that matches who you're emailing and fill in the <strong>[brackets]</strong>.
            </p>
          </div>
          {TEMPLATES.map(tpl => <TemplateCard key={tpl.id} tpl={tpl} />)}
        </div>
      )}

      {/* Sequence */}
      {activeTab === "sequence" && (
        <div className="space-y-3">
          <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-3">
            <p className="text-purple-300 text-xs leading-relaxed">
              <strong className="text-purple-200">5-email sequence over 30 days.</strong> Send one initial email, then follow up on Day 4, 10, 18, and 30. Most deals close on follow-up #2 or #3 — don't stop after the first email.
            </p>
          </div>
          {/* Timeline visual */}
          <div className="flex items-center gap-0 overflow-x-auto pb-2">
            {SEQUENCES.map((seq, i) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: seq.color + "22", color: seq.color, border: `2px solid ${seq.color}50` }}>
                    {i + 1}
                  </div>
                  <p className="text-xs font-bold mt-1" style={{ color: seq.color }}>{seq.day}</p>
                </div>
                {i < SEQUENCES.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-800 flex-shrink-0 mx-1" />
                )}
              </div>
            ))}
          </div>

          {SEQUENCES.map(seq => <SequenceCard key={seq.day} seq={seq} />)}

          <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-3">
            <p className="text-amber-300/80 text-xs leading-relaxed">
              <strong className="text-amber-300">Pro tip:</strong> Track opens with a free tool like Mailtrack or HubSpot free CRM. If they opened 3x but didn't reply — call them. The interest is there.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}