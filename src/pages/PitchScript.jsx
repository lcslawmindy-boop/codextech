import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Mic, DollarSign, Brain, Shield, Zap, Target, CheckCircle2, AlertTriangle, TrendingUp, Users } from "lucide-react";

// ── PITCH SCRIPT ─────────────────────────────────────────────────────────────
const PITCH_SECTIONS = [
  {
    id: "hook",
    label: "The Hook (0–30 sec)",
    color: "#f59e0b",
    icon: "⚡",
    script: `"In 1978, the US Office of Naval Research filed an unclassified report confirming that a French engineer named Antoine Priore built a device that cured implanted tumors in controlled animal experiments using electromagnetic fields. Every control animal died. Every treated animal survived. Nobel Laureate André Lwoff personally validated the results.

That technology was never commercialized. Until now."`,
    tips: [
      "Make eye contact. Let the silence after 'Until now' land.",
      "Speak slowly — this is unfamiliar territory for most investors.",
      "Do NOT start with 'scalar electromagnetics' — start with the government document.",
    ],
  },
  {
    id: "problem",
    label: "The Problem (30 sec – 2 min)",
    color: "#ef4444",
    icon: "🎯",
    script: `"There is a 40-year gap between validated advanced electromagnetic research and commercial application. Thousands of peer-reviewed papers, US government reports, and DoD-funded experiments exist confirming phenomena that mainstream engineering has never productized.

The problem isn't the science. The problem is that nobody built the infrastructure to turn that science into patents, products, and revenue.

Law firms don't have tools for this category. Patent agents don't understand the physics. Investors can't evaluate what they can't see structured, documented, and priced.

That's the gap I filled."`,
    tips: [
      "Pause after 'That's the gap I filled.' — let them ask 'How?'",
      "If they push back on the science, pivot immediately to: 'The platform is what we're selling — not a physics debate.'",
      "Have the ONR document on your laptop ready to pull up.",
    ],
  },
  {
    id: "solution",
    label: "The Solution (2–4 min)",
    color: "#6366f1",
    icon: "🏗",
    script: `"Zenith Apex Research Portfolio is an AI-powered intellectual property generation and commercialization platform. Here's what it does:

You select a technology domain — say, bioelectromagnetics. The AI generates a complete invention dossier: technical specs grounded in documented physics, a 5-year P&L, a USPTO patent strategy, prior art conflict scoring, and a full provisional patent application that establishes a real filing date.

The marginal cost per invention cycle: about 80 cents in API fees. The value displaced: $10,000 to $50,000 in attorney fees per filing.

We have 23 documented device architectures with engineering build plans, bills of materials, and animated assembly guides. We have a Virtual Data Room with tokenized investor access and full audit trails. We have live Stripe revenue from courses, hardware kits, and research memberships.

This is not a research project. This is a production-ready platform generating revenue today, with an IP pipeline that took 40 years of prior research to make possible."`,
    tips: [
      "Show the live platform during this section — open the Invention Forge and run it in real time.",
      "The 80 cents vs $50K contrast is your best line — say it slowly.",
      "If they ask about the science: 'The platform works regardless of which inventions you choose to commercialize.'",
    ],
  },
  {
    id: "traction",
    label: "Traction & Validation (4–6 min)",
    color: "#22c55e",
    icon: "📈",
    script: `"Let me show you what institutional validation looks like for this asset class.

Peer-reviewed: Anastasovski et al., Foundations of Physics Letters, 2001 — 15 authors from Boeing Phantom Works, Trinity College Dublin, and Alfvén Laboratory Stockholm confirming COP greater than 1 in the Motionless Electromagnetic Generator.

Government: US Office of Naval Research London Branch Report R-5-78, 1978 — formal validation of electromagnetic tumor cure in controlled animal experiments.

Defense: DoD SBIR grants totaling over $630,000 awarded for electromagnetic sensing technology in this domain.

On the platform itself: live recurring revenue through Stripe, a beta applicant pipeline, and an Investor CRM tracking active due diligence conversations.

The IP asset floor on independent asset-by-asset valuation: $9.2 million — conservative. Strategic acquisition premium to an acquirer with existing distribution: $8.8 million to $25 million."`,
    tips: [
      "Print the ONR report cover page — hand it across the table.",
      "Have the Stripe dashboard open — real revenue is your strongest signal.",
      "Don't apologize for the valuation. State it flatly and wait.",
    ],
  },
  {
    id: "ask",
    label: "The Ask / Close (6–8 min)",
    color: "#d4af37",
    icon: "💼",
    script: `"Here's what I'm offering, and here's what I'm not.

I'm not raising a Series A to build something. I'm offering a fully built, revenue-generating platform with a documented IP moat that cannot be replicated — because the 40-year research window to assemble this has already closed.

For a strategic acquisition: $8.8 million to $25 million, depending on scope and acquirer. A defense contractor, IP management firm, or deep-tech VC portfolio company acquires the full platform, AI suite, 23 invention dossiers, government documentation archive, and all revenue infrastructure.

For a licensing arrangement: $850,000 to $2.2 million per year for the full platform, or $210,000 to $750,000 per year for the AI Patent Suite alone as a white-label tool for law firms and IP shops.

I'm speaking to six qualified buyers before public launch. If you want priority data room access, I need an executed NDA and a proof-of-funds letter within 14 days.

What questions do you have?"`,
    tips: [
      "End with a question. Always. Never end with a statement.",
      "The 14-day deadline is real — enforce it.",
      "If they say 'we need more time': 'Understood — I'll move to the next buyer on the list and circle back if it's still available.'",
      "Do NOT drop the price in the first meeting. Ever.",
    ],
  },
];

// ── Q&A OBJECTIONS ────────────────────────────────────────────────────────────
const QA = [
  {
    category: "Valuation Challenges",
    color: "#f59e0b",
    items: [
      {
        q: "Your valuation seems high. How do you justify $9M+ for a platform with limited revenue?",
        a: `"The valuation is asset-based, not revenue-based — and that's intentional. We have 23 documented invention architectures, an AI patent generation suite with no comparable platform in existence, and a Virtual Data Room system. Each asset was valued independently using DCF and comparable SaaS transaction multiples.

The revenue is early-stage by design — we've been building the asset base, not scaling sales. A buyer with an existing distribution network can 10× that revenue in 12 months with zero additional R&D spend. That's what you're paying for: the infrastructure, not the current run rate."`,
        tip: "Never defend the valuation. Explain the basis and redirect to acquirer upside.",
      },
      {
        q: "What comparable transactions support this price?",
        a: `"IP management SaaS platforms — companies like Anaqua, Dennemeyer, and Clarivate — trade at 8–15× ARR on strategic acquisitions. AI-native patent tools are commanding 20–25× ARR premiums as of 2025–2026.

Our AI Patent Suite alone — Claim Summarizer, Novelty/FTO Analysis, Competitive Landscape, Drafting Wizard — displaces $10,000–$50,000 in attorney fees per filing. At 100 filings per year for a law firm licensee, that's $1–5M in annual value delivered per client. We're licensing it at $210K–$750K/year. The ROI case writes itself."`,
        tip: "Have printed comps ready. Anaqua sold for $1B+ in 2021. Clarivate acquired CPA Global for $1.4B.",
      },
      {
        q: "How do I know the IP is clean and there are no encumbrances?",
        a: `"The platform software, AI architecture, and original compilation are 100% original work. The underlying research we reference — Bearden's papers, the ONR reports, peer-reviewed publications — are either public domain or unclassified government documents. We don't own Bearden's books; we own the platform built on top of them. That's the same position as any SaaS company that builds on publicly available scientific literature. Full IP audit is available in the data room under NDA."`,
        tip: "Offer the data room access immediately when this question comes up. It signals confidence.",
      },
    ],
  },
  {
    category: "Science & Credibility",
    color: "#6366f1",
    items: [
      {
        q: "This sounds like fringe science. Why should I take this seriously?",
        a: `"That's exactly the right question — and the answer is why this is an acquisition opportunity rather than a commodity.

Boeing Phantom Works doesn't publish in fringe journals. Trinity College Dublin doesn't co-author fringe papers. The US Office of Naval Research doesn't file unclassified reports on fringe experiments. These are the institutions that validated the core phenomena documented on this platform.

The mainstream has been slow to adopt this domain. That's the moat. You're not buying the physics — you're buying the first-mover infrastructure in a category that institutional science has already validated but commercial engineering has not yet addressed."`,
        tip: "Physical documents beat verbal arguments every time. Hand them the ONR report.",
      },
      {
        q: "Has any of this actually been built and demonstrated?",
        a: `"The MEG — Motionless Electromagnetic Generator — was independently replicated by Jean-Louis Naudin in France and documented with full oscilloscope readings. The Priore device cured trypanosomiasis in controlled experiments at the University of Bordeaux with US government observers present. DoD SBIR grants of $630K+ were awarded for electromagnetic sensing work in this domain.

Our platform's 23 build plans include full bills of materials, assembly steps, and engineering schematics. We're not selling proof of concept — we're selling the commercialization infrastructure. The hardware replication is the buyer's upside, not our liability."`,
        tip: "Redirect from 'has it been proven' to 'the commercialization infrastructure is what you're buying.'",
      },
      {
        q: "What stops a well-funded competitor from building this in 6 months?",
        a: `"Three things. First, the primary source archive — 40 years of Bearden's research, the ONR documents, the Bioenergetics briefing slides, the declassified TACOM reports. Assembling that took decades; it's not a Google search. Second, the domain expertise baked into every AI prompt, every invention dossier, every patent strategy — that's not replicable by copying our interface. Third, the prior art archive and patent landscape graph we've built creates compounding defensibility — every new filing we log makes the platform more valuable, not less."`,
        tip: "The archive and institutional validation documents ARE the moat. Emphasize this.",
      },
    ],
  },
  {
    category: "Deal Structure",
    color: "#22c55e",
    items: [
      {
        q: "Would you consider a partial acquisition or minority stake?",
        a: `"We're open to a minority equity investment at the right valuation — Series A preferred at $9.2M pre-money, with pro-rata rights and a board observer seat at $1M+. That gives you upside participation as we scale the AI Patent Suite licensing to law firms and the VDR Portal to VC firms.

Full acquisition remains the preferred path — it's cleaner, faster, and frankly better for both parties. But if a minority stake gets you in the data room faster, let's talk terms."`,
        tip: "Always present full acquisition as preferred. Minority stake is a concession, not your opening.",
      },
      {
        q: "What does transition look like? Are you staying on?",
        a: `"90-day paid transition consulting is included in the acquisition at $250/hour, with full onboarding documentation at no cost. The platform is built on Base44 — a no-code/low-code SaaS infrastructure — so technical handoff is straightforward. The AI prompts, persona architecture, and workflow logic are all documented.

If the acquirer wants me to stay on as an advisor or in a defined role, that's a separate negotiation. I'm open to it if the structure makes sense."`,
        tip: "Don't offer to stay on for free. Your knowledge has value — price it.",
      },
      {
        q: "Can we license just the AI Patent Suite without the full platform?",
        a: `"Yes — Tier B licensing is $210,000–$420,000 upfront plus $210,000–$750,000 per year, depending on the scope and territory. That gives you white-label rights to the Patent Intelligence suite — Claim Summarizer, Novelty/FTO, Competitive Landscape, and the 7-step Drafting Wizard with Secure Sharing — for your law firm, IP practice, or VC portfolio.

It's the fastest path to ROI if you have an existing client base. A law firm with 50 patent clients can recover the license fee in 60–90 days."`,
        tip: "Know your tiers cold. Tier A = devices only. Tier B = AI Patent Suite. Tier C = VDR. Tier D = full platform.",
      },
      {
        q: "What if due diligence reveals the revenue is lower than represented?",
        a: `"All revenue figures are Stripe-verifiable — I'll give you direct read access to the dashboard under NDA. The valuation is primarily IP-based, not revenue-based, so revenue variance has limited impact on the floor price. If anything, lower current revenue increases the acquirer's upside — you're buying an undermonetized asset at a defensible IP floor, not a mature business at a revenue multiple."`,
        tip: "Stripe dashboard access as a due diligence offer is extremely confidence-inspiring. Offer it proactively.",
      },
    ],
  },
  {
    category: "Closing Pressure",
    color: "#ef4444",
    items: [
      {
        q: "We need more time to evaluate.",
        a: `"Understood — and I want you to have what you need to make a confident decision. I can extend data room access for 30 days under NDA. What I can't do is hold exclusivity open-ended — I'm running a structured process with a limited buyer list. If you need more than 45 days from NDA execution, I'd need to move to the next buyer and circle back if it's still available. What's driving the timeline on your end — internal approval process, legal review, something else? Let's solve that specifically."`,
        tip: "Turn timeline objections into specific blockers. Solve the blocker, not the vague delay.",
      },
      {
        q: "The price is too high.",
        a: `"I hear you — and I'm not going to negotiate against myself in the first meeting. The floor is the IP asset valuation, which is independently supportable at $9.2M. If you see a specific asset that you'd exclude from scope, we can talk about a narrower transaction at a lower price point. But if you're looking at the full platform at a discount to IP floor value — that's not a conversation I can have. What scope would make the economics work for you?"`,
        tip: "Never lower the price. Narrow the scope if needed. Price per included asset stays constant.",
      },
      {
        q: "Let me think about it and get back to you.",
        a: `"Of course. Before we wrap up — what's the one thing that would need to be true for you to move forward? I'd rather know the real objection now so I can address it directly, rather than follow up in two weeks on something I could answer today."`,
        tip: "This is the most important question in any negotiation. The answer tells you whether it's a real deal or a polite no.",
      },
    ],
  },
];

// ── STRATEGY SECTION ──────────────────────────────────────────────────────────
const STRATEGY = {
  recommendation: "HYBRID: License AI Suite + VDR Now → Full Acquisition in 12–18 Months",
  rationale: "Licensing 2–3 law firms on the AI Patent Suite at $210K–$750K/yr each generates $420K–$1.5M ARR with zero additional development cost. That ARR then justifies a 15–25× strategic multiple — pushing the acquisition price from $8.8M to $15M–$39M. You sell higher by not selling now.",
  paths: [
    {
      path: "🏢 Sell Full Platform Now",
      pros: ["Immediate $8.8M–$25M liquidity", "Clean exit, no ongoing risk", "Buyer takes over scaling and legal exposure"],
      cons: ["Likely lowest price — no ARR to anchor premium multiple", "Negotiating from 'early revenue' position, not 'growing SaaS'", "You lose all upside if buyer 10×s it in 2 years"],
      verdict: "Good if you need liquidity NOW or want a clean exit. Not optimal for maximum price.",
      color: "#6366f1",
    },
    {
      path: "📋 License AI Suite + VDR (Keep Platform)",
      pros: ["$210K–$750K/yr per law firm licensee — 2 clients = $420K–$1.5M ARR", "$50K–$180K/yr per VDR client", "ARR built here becomes the multiple anchor for future acquisition", "You retain platform and collect revenue while building sale price"],
      cons: ["Requires active sales to law firms and VC firms", "12–18 month delay to maximum acquisition price", "Legal/support overhead for licensees"],
      verdict: "BEST for maximum total value. Build ARR for 12 months, then sell at 15–25× that ARR.",
      color: "#22c55e",
    },
    {
      path: "🛒 Keep Selling Kits + Courses",
      pros: ["Immediate cash flow", "No legal complexity", "Builds customer base and social proof"],
      cons: ["Low margins vs. SaaS licensing", "Doesn't build the ARR multiple that drives acquisition price", "Time-intensive for relatively low revenue ceiling"],
      verdict: "Keep as a revenue floor — but don't let it distract from licensing deals. It's support revenue, not your exit strategy.",
      color: "#f59e0b",
    },
    {
      path: "💼 Raise Minority Investment + Scale",
      pros: ["$750K–$3M at $9.2M pre-money = fuel for law firm sales team", "Investor validates the valuation publicly", "Positions for larger acquisition at higher multiple"],
      cons: ["Dilution — you give up 7.5–24% equity", "Investors have governance rights", "Longer path to exit"],
      verdict: "Strong option if you want to maximize the exit price and are willing to wait 2–4 years for the larger outcome.",
      color: "#d4af37",
    },
  ],
  playbook: [
    { step: 1, action: "Execute 2 AI Patent Suite licenses to law firms", timeline: "Month 1–3", impact: "Generate $420K–$1.5M ARR" },
    { step: 2, action: "Execute 2 VDR Portal licenses to VC/IP firms", timeline: "Month 2–4", impact: "Add $100K–$360K ARR" },
    { step: 3, action: "Continue kit/course sales as base revenue", timeline: "Ongoing", impact: "Maintain $50K–$150K/yr floor" },
    { step: 4, action: "File 2–3 provisional patents on AI pipeline + VDR architecture", timeline: "Month 1–2", impact: "Dramatically increases IP defensibility and acquisition price" },
    { step: 5, action: "Run structured acquisition process with 6 qualified buyers", timeline: "Month 12–18", impact: "Close at $15M–$39M with ARR-backed multiple" },
  ],
};

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function PitchSection({ section }) {
  const [open, setOpen] = useState(true);
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-700/60 mb-4"
      style={{ boxShadow: `0 2px 20px ${section.color}18` }}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: `linear-gradient(90deg, ${section.color}22, ${section.color}08)`, borderBottom: open ? `1px solid ${section.color}30` : "none" }}
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <p className="text-white font-black text-sm">{section.label}</p>
        </div>
        {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>
      {open && (
        <div className="bg-gray-900 p-5 space-y-4">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Mic size={11} /> Script — Say This Word For Word
            </p>
            <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-line italic">{section.script}</p>
          </div>
          <button
            onClick={() => setShowTips(t => !t)}
            className="text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{ color: section.color, background: `${section.color}15`, border: `1px solid ${section.color}30` }}
          >
            {showTips ? <ChevronUp size={11} /> : <ChevronDown size={11} />} Delivery Tips
          </button>
          {showTips && (
            <div className="space-y-2">
              {section.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2">
                  <CheckCircle2 size={11} className="flex-shrink-0 mt-0.5" style={{ color: section.color }} />
                  {tip}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QACard({ item, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700/50 mb-3">
      <button
        className="w-full flex items-start justify-between px-5 py-4 text-left bg-gray-900 hover:bg-gray-800/60 transition-all"
        onClick={() => setOpen(o => !o)}
      >
        <p className="text-gray-200 text-sm font-semibold leading-snug pr-4">❓ {item.q}</p>
        {open ? <ChevronUp size={13} className="flex-shrink-0 text-gray-500 mt-0.5" /> : <ChevronDown size={13} className="flex-shrink-0 text-gray-500 mt-0.5" />}
      </button>
      {open && (
        <div className="bg-gray-950 border-t border-gray-800 p-5 space-y-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color }}>Your Answer</p>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line italic">{item.a}</p>
          </div>
          <div className="flex items-start gap-2 bg-yellow-950/20 border border-yellow-800/30 rounded-lg px-3 py-2">
            <AlertTriangle size={11} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-300/80 text-xs">{item.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StrategyPath({ path }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden border mb-3" style={{ borderColor: path.color + "50" }}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: `linear-gradient(90deg, ${path.color}18, ${path.color}06)` }}
        onClick={() => setOpen(o => !o)}
      >
        <p className="text-white font-black text-sm">{path.path}</p>
        {open ? <ChevronUp size={13} className="text-gray-500" /> : <ChevronDown size={13} className="text-gray-500" />}
      </button>
      {open && (
        <div className="bg-gray-900 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-green-400 text-xs font-black uppercase tracking-wider mb-2">Pros</p>
              <div className="space-y-1.5">
                {path.pros.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle2 size={11} className="text-green-500 flex-shrink-0 mt-0.5" /> {p}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-red-400 text-xs font-black uppercase tracking-wider mb-2">Cons</p>
              <div className="space-y-1.5">
                {path.cons.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <AlertTriangle size={11} className="text-red-400 flex-shrink-0 mt-0.5" /> {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl px-4 py-3 border" style={{ background: `${path.color}15`, borderColor: `${path.color}40` }}>
            <p className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: path.color }}>Verdict</p>
            <p className="text-gray-200 text-sm">{path.verdict}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function PitchScript() {
  const [activeTab, setActiveTab] = useState("pitch");

  const TABS = [
    { id: "pitch", label: "Pitch Script", icon: <Mic size={13} /> },
    { id: "qa", label: "Q&A Objections", icon: <Brain size={13} /> },
    { id: "strategy", label: "Exit Strategy", icon: <TrendingUp size={13} /> },
  ];

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
              <Mic size={15} className="text-yellow-400" /> Pitch Script & Close Playbook
            </h1>
            <p className="text-gray-500 text-xs">Word-for-word script · Objection responses · Exit strategy</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/term-sheet"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-900/40 border border-indigo-700 text-indigo-300 text-xs font-bold hover:bg-indigo-800/50 transition-all">
            <DollarSign size={12} /> Term Sheets
          </Link>
          <Link to="/investor-package"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all">
            <Users size={12} /> Buyer List
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-gray-900/50 px-5">
        <div className="flex gap-1 py-2">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-yellow-900/50 border border-yellow-700 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-5">

          {/* PITCH SCRIPT TAB */}
          {activeTab === "pitch" && (
            <div className="space-y-2">
              <div className="bg-yellow-950/20 border border-yellow-800/40 rounded-xl px-5 py-3 mb-5">
                <p className="text-yellow-300 text-xs font-black uppercase tracking-wider mb-1">How to Use This</p>
                <p className="text-yellow-200/70 text-xs leading-relaxed">
                  Read the script sections out loud before every meeting. The tips are for in-room adjustments. Total pitch time: 6–8 minutes. The goal is to end on a question and let them talk.
                </p>
              </div>
              {PITCH_SECTIONS.map(section => (
                <PitchSection key={section.id} section={section} />
              ))}
            </div>
          )}

          {/* Q&A TAB */}
          {activeTab === "qa" && (
            <div className="space-y-6">
              <div className="bg-indigo-950/20 border border-indigo-800/40 rounded-xl px-5 py-3">
                <p className="text-indigo-300 text-xs font-black uppercase tracking-wider mb-1">Objection Handling Rules</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  {[
                    { rule: "Never defend. Redirect.", desc: "Agree with the concern, then reframe." },
                    { rule: "Never drop the price first.", desc: "Narrow scope instead. Price per asset stays fixed." },
                    { rule: "Silence is power.", desc: "After you answer, stop talking. Let them respond." },
                  ].map((r, i) => (
                    <div key={i} className="bg-indigo-950/30 border border-indigo-800/30 rounded-lg p-3">
                      <p className="text-indigo-300 text-xs font-black mb-1">{r.rule}</p>
                      <p className="text-gray-500 text-xs">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              {QA.map(cat => (
                <div key={cat.category}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">{cat.category}</h3>
                  </div>
                  {cat.items.map((item, i) => (
                    <QACard key={i} item={item} color={cat.color} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* STRATEGY TAB */}
          {activeTab === "strategy" && (
            <div className="space-y-6">
              {/* Recommendation banner */}
              <div className="bg-green-950/30 border-2 border-green-700/60 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={18} className="text-green-400" />
                  <p className="text-green-400 font-black text-base uppercase tracking-wider">Recommended Path</p>
                </div>
                <p className="text-white font-black text-xl mb-3">{STRATEGY.recommendation}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{STRATEGY.rationale}</p>
              </div>

              {/* Paths */}
              <div>
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">All Exit Paths — Compared</h3>
                {STRATEGY.paths.map((path, i) => <StrategyPath key={i} path={path} />)}
              </div>

              {/* 5-step playbook */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={15} className="text-yellow-400" />
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">The Optimal Playbook — 18 Months to Maximum Exit</h3>
                </div>
                <div className="space-y-3">
                  {STRATEGY.playbook.map(item => (
                    <div key={item.step} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <div className="w-8 h-8 rounded-full bg-yellow-900/50 border border-yellow-700 flex items-center justify-center text-yellow-400 font-black text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm mb-1">{item.action}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-xs">{item.timeline}</span>
                          <span className="text-gray-700">·</span>
                          <span className="text-green-400 text-xs font-bold">{item.impact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom line */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
                <p className="text-yellow-400 font-black text-sm uppercase tracking-wider mb-3">Bottom Line</p>
                <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
                  <p>• <strong className="text-white">If you need money NOW:</strong> Sell the full platform for $8.8M–$25M. Clean exit. Done.</p>
                  <p>• <strong className="text-white">If you can wait 12–18 months:</strong> License the AI Patent Suite to 2 law firms, license VDR to 2 VC firms, file 3 provisional patents, then run a structured acquisition at $15M–$39M backed by real ARR.</p>
                  <p>• <strong className="text-white">Never just sell kits and courses</strong> as your primary strategy — it's a revenue floor, not an exit. Keep it running but don't let it be your focus.</p>
                  <p>• <strong className="text-white">The best deal</strong> is the one where the buyer thinks they're stealing it and you know you're at your floor. Get there by building ARR first.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}