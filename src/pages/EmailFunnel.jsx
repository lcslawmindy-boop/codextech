import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Copy, Check, ChevronDown, ChevronUp, Zap, Clock, TrendingUp, Shield, Star, AlertTriangle, Eye } from "lucide-react";

// ── Email sequence data ───────────────────────────────────────────────────────
const EMAILS = [
  {
    day: 0,
    tag: "WELCOME + CURIOSITY HOOK",
    tagColor: "#06b6d4",
    trigger: "Immediate — on signup",
    goal: "Deliver value instantly. Open the loop. Make them curious about what's locked.",
    subject: "Your free build guide is inside (+ what I can't show you yet)",
    preheader: "One device changed how I think about energy forever.",
    psychTriggers: ["Curiosity gap", "Reciprocity", "Pattern interrupt"],
    body: `Hey [First Name],

Your free build guide just dropped into your vault. You can access it here: [LINK]

But before you open it — I need to tell you something.

There are 39 other build plans sitting behind a locked door in the same vault. Plans sourced from granted US patents, peer-reviewed journals, and declassified government documents that most engineers have never seen.

One of them — the MEG (Motionless Electromagnetic Generator) — was co-authored by a PhD physicist, peer-reviewed, published in Foundations of Physics Letters, and granted US Patent 6,362,718.

It has been replicated in 11 countries.

I'm not allowed to show it to you yet.

Not because it's dangerous. Because it's behind the membership wall — and I promised myself I wouldn't give it away for free after the work it took to document it properly.

But here's what I CAN tell you: the free build guide in your vault today is based on the same research tradition. Same sourcing discipline. Same engineering rigor.

Open it. Build something. And if you want to see what's behind the door —

[UNLOCK THE FULL VAULT →]

More tomorrow,
The ZARP Team

P.S. — 847 founding spots remain at the $79/month rate. After 1,000 members, the price goes up permanently. I'd hate for you to miss it.`,
    cta: "UNLOCK THE FULL VAULT →",
    ctaUrl: "/paywall",
    sendTime: "Day 0 — Immediately after signup",
  },
  {
    day: 1,
    tag: "AUTHORITY + PROOF",
    tagColor: "#8b5cf6",
    trigger: "24 hours after signup",
    goal: "Build credibility. Show the depth of the archive. Remove 'is this legit?' objection.",
    subject: "The US Navy funded this research. Then it disappeared.",
    preheader: "Declassified document reveals what they didn't want published.",
    psychTriggers: ["Authority", "Social proof", "Suppression narrative"],
    body: `Hey [First Name],

In 1978, the Office of Naval Research commissioned a report on anomalous biological effects of electromagnetic fields.

The report — ONR London Branch Report R-5-78 — was officially classified, then quietly declassified, then almost impossible to find.

We found it. We sourced it. And we built a build plan from it.

It's in the vault.

The ZARP archive isn't a blog. It's not a YouTube channel. It's 40+ fully documented engineering systems — each one traceable to:

✓ A granted US patent (we cite the patent number)
✓ A peer-reviewed paper (we cite the journal and issue)
✓ A government document OR a scientific institution (we cite the source)

Every claim has a paper trail. Every device has a replication path.

Here's the thing that most "free energy" sites get wrong: they make claims without citations. We make the same claims — with the patents, papers, and primary sources attached.

That's why engineers trust this vault. Because we do the homework so you don't have to.

The MEG build plan alone cites 7 primary sources. The Prioré device cites 14.

You can browse 5 entries from the Prior Art Archive right now — free — and see exactly how we document everything:

[VIEW THE PRIOR ART ARCHIVE →]

Or skip straight to the full vault:

[UNLOCK ALL 40+ SYSTEMS →]

Tomorrow I'll show you what one of our members built in their garage.

The ZARP Team`,
    cta: "UNLOCK ALL 40+ SYSTEMS →",
    ctaUrl: "/paywall",
    sendTime: "Day 1 — 24h after signup",
  },
  {
    day: 2,
    tag: "RESULTS + SOCIAL PROOF",
    tagColor: "#22c55e",
    trigger: "48 hours after signup",
    goal: "Show real outcomes. Make membership feel inevitable for serious builders.",
    subject: "He built it in a garage in Austin. Here's what happened.",
    preheader: "\"The MEG build plan alone was worth more than 6 months of membership.\"",
    psychTriggers: ["Social proof", "Story", "Results-first"],
    body: `Hey [First Name],

R.K. is an electrical engineer based in Austin, Texas.

He found ZARP through a forum thread about the Bedini SG. Skeptical, he joined on the Starter tier — $29 — mostly to see if the sourcing was legit.

Three weeks later, he upgraded to Pro.

Here's what he wrote us:

"The MEG build plans alone are worth 10x the membership. I've read Bearden's books. I've been through the patents. But having the BOM, the step-by-step assembly, the coil specs, and the sourcing all in one place? Nothing like this exists anywhere else. I've already ordered the core components."

R.K. isn't alone.

A.S. — an independent inventor — used our AI Patent Drafting Tool to generate her full provisional patent application in one session. Her patent attorney called it "the best pre-draft she'd ever seen."

M.T. — who has studied scalar electromagnetics for 20 years — told us ZARP is the first platform that actually teaches you to BUILD, not just theorize.

These aren't cherry-picked outliers. They're the norm inside the vault.

Because here's what's different about ZARP:

Most research communities tell you what's possible.
We tell you how to build it — with a parts list and a PDF.

If you're an engineer, researcher, or inventor who is serious about scalar EM — the vault will pay for itself in your first week.

[JOIN THE VAULT — FROM $29/MONTH →]

The ZARP Team

P.S. — The Pro tier ($79/mo) gives you all 40+ builds, all 40+ courses, the full AI patent suite, and the investor toolkit. That's $27,800+ of à la carte value. At $79 a month, it's the most obvious investment I know of in this space.`,
    cta: "JOIN THE VAULT — FROM $29/MONTH →",
    ctaUrl: "/paywall",
    sendTime: "Day 2 — 48h after signup",
  },
  {
    day: 3,
    tag: "PAIN + PROBLEM AGITATION",
    tagColor: "#f59e0b",
    trigger: "72 hours after signup",
    goal: "Agitate the frustration of not having access. Make the cost of inaction feel real.",
    subject: "Why most inventors stay stuck (and never build anything)",
    preheader: "The real reason your ideas never make it off the whiteboard.",
    psychTriggers: ["Pain agitation", "Problem/solution", "Identity appeal"],
    body: `Hey [First Name],

There's a pattern I see over and over again in the independent research community.

Smart people. Good ideas. Deep interest in the technology.

And nothing built.

Not because they lack intelligence. Not because the physics is wrong.

Because the information gap is enormous.

You can read Bearden's books — dense, brilliant, and completely impractical without an engineering background and years of cross-referencing.

You can trawl through patents — written in legalese, stripped of practical assembly detail.

You can watch YouTube channels — filled with speculation, missing citations, and zero replication instructions.

And after all of that, you still don't have:
✗ A bill of materials
✗ Component specifications
✗ Supplier recommendations
✗ Step-by-step assembly sequence
✗ A PDF you can take to your bench

That's the gap. That's what ZARP closes.

Every build plan in the vault is formatted as a complete engineering document:
— Full BOM with quantities, specs, and part numbers
— Step-by-step assembly with safety warnings
— Downloadable PDF for bench use
— Build video walkthrough
— Primary source citations for every claim

You don't need to spend 6 months cross-referencing patents anymore.

We did it. It's in the vault. It's waiting for you.

[STOP RESEARCHING. START BUILDING. →]

The ZARP Team

P.S. — If you're still on the fence, ask yourself: how much time have you already spent researching without a build-ready output? The vault pays for itself the first time you don't have to start from scratch.`,
    cta: "STOP RESEARCHING. START BUILDING. →",
    ctaUrl: "/paywall",
    sendTime: "Day 3 — 72h after signup",
  },
  {
    day: 4,
    tag: "DEEP VALUE + SPECIFICITY",
    tagColor: "#3b82f6",
    trigger: "Day 4",
    goal: "Go deep on ONE device. Specificity builds credibility better than breadth.",
    subject: "What's actually inside the MEG build plan (details)",
    preheader: "7 primary sources. 23 components. One COP>1 device.",
    psychTriggers: ["Specificity", "Curiosity", "Value demonstration"],
    body: `Hey [First Name],

You've been asking about the MEG.

So today, I'm going to tell you exactly what's in the build plan — without giving it away.

The Motionless Electromagnetic Generator (US Patent 6,362,718) is the most extensively documented COP>1 device in the peer-reviewed literature. Co-authored by Bearden, Hayes, Moore, Kenny, and Patrick. Peer-reviewed by Foundations of Physics Letters.

Here's the ZARP build plan structure for the MEG:

PRIMARY SOURCES CITED: 7
— US Patent 6,362,718 (Bearden et al., 2002)
— Anastasovski et al., Found. Phys. Lett. 14(1) — 2001
— Bohren, C.F. — Am. J. Phys. 51(4) — 1983
— (+ 4 more)

BILL OF MATERIALS: 23 components
— Toroidal nanocrystalline core (VITROPERM 500F spec)
— DDS function generator module (AD9833)
— Primary and secondary coil windings (AWG 22, 1000 turns / 500 turns)
— MOSFET switching array (IRF540N)
— (+ 19 more with Digikey part numbers)

ASSEMBLY STEPS: 14 steps
— From coil winding to oscillator tuning to output measurement
— Includes RF shielding protocol and grounding specifications
— Warning flags on steps with high-voltage transient risk

ESTIMATED BUILD COST: $180–$240 (consumer-grade components)

ESTIMATED TIME: 12–18 hours for experienced builders

This is the level of detail in every ZARP build plan.

And the MEG is just one of 40+ systems in the vault.

[ACCESS THE MEG BUILD PLAN →]

The ZARP Team

P.S. — Pro members get the MEG plan PLUS all 39 others, all 40+ courses, and the full AI patent suite. $79/month. Lock in the founding rate before the price goes up.`,
    cta: "ACCESS THE MEG BUILD PLAN →",
    ctaUrl: "/paywall",
    sendTime: "Day 4",
  },
  {
    day: 5,
    tag: "URGENCY + SCARCITY",
    tagColor: "#ef4444",
    trigger: "Day 5",
    goal: "Real deadline. Real scarcity. Drive fence-sitters to decide.",
    subject: "153 people joined this week. 847 spots left at this price.",
    preheader: "After 1,000 members, the founding rate closes permanently.",
    psychTriggers: ["Urgency", "Scarcity", "Social momentum", "Loss aversion"],
    body: `Hey [First Name],

I want to be straight with you.

153 people joined ZARP this month.

That means 847 founding spots remain at the current pricing:
— Starter: $29/month
— Pro: $79/month
— Elite: $149/month

After 1,000 founding members, all prices increase. This isn't a fake deadline — it's built into how we structured the launch. The founding rate locks in forever for anyone who's already subscribed before the cap is hit.

If you've been reading these emails and thinking "I'll do it eventually" — eventually is almost here.

Here's what you're leaving on the table every day you wait:

Every day without the vault = another day cross-referencing patents manually.
Every week without the AI patent tool = another week of expensive attorney consultations.
Every month without the investor toolkit = another month your invention sits in a drawer.

The vault doesn't change. The price does.

[LOCK IN YOUR FOUNDING RATE NOW →]

I'll send one more email tomorrow. After that, I'm moving on to other things — and you'll either be inside the vault or you won't.

The ZARP Team

P.S. — If the $79 Pro tier feels like a stretch, start with Starter at $29. You can upgrade anytime — and your founding rate locks in at whatever tier you join at first. The important thing is to get in before the cap.`,
    cta: "LOCK IN YOUR FOUNDING RATE NOW →",
    ctaUrl: "/paywall",
    sendTime: "Day 5",
  },
  {
    day: 6,
    tag: "FINAL EMAIL — LAST CHANCE",
    tagColor: "#f97316",
    trigger: "Day 6 — Last in sequence",
    goal: "Close the loop. Hard deadline. Binary choice framing. No pressure, but clear consequence.",
    subject: "Last email from me (read this)",
    preheader: "This is it. In or out.",
    psychTriggers: ["Final urgency", "Binary choice", "Closure", "Consequence framing"],
    body: `Hey [First Name],

This is the last email I'm going to send you about the vault.

Not because I'm frustrated. Because I respect your time — and mine.

You've had 7 days to explore the free content, read the sourcing, and decide whether ZARP is for you.

If it is, the door is open. The founding rate is still active. Join here:

[YES — I'M IN. UNLOCK THE VAULT. →]

If it's not — that's completely fine. Different platforms are right for different people. If scalar EM, free energy research, and advanced engineering systems aren't your focus right now, ZARP isn't for you.

But if you ARE serious about this field — if you've spent time on patents, papers, or Bearden's books — and you're looking for a place that takes it as seriously as you do:

This is the only platform that documents these systems at the engineering level.
This is the only place with a full BOM, step-by-step plans, and primary source citations for 40+ devices.
This is the only community where builders are actually replicating this work.

And this is the last time I'll ask.

[UNLOCK THE FULL VAULT →]

Whatever you decide — thank you for being here.

The ZARP Team

P.S. — If you join today, you'll have access to the MEG build plan, the full course library, and the AI patent suite within 60 seconds of checkout. The hard part is deciding. The rest is already built.`,
    cta: "UNLOCK THE FULL VAULT →",
    ctaUrl: "/paywall",
    sendTime: "Day 6 — Final email",
  },
];

const METRICS = [
  { label: "Avg Open Rate (industry)", value: "21%", yours: "Target: 45%+", icon: <Mail size={16} className="text-cyan-400" /> },
  { label: "Avg Click Rate (industry)", value: "2.6%", yours: "Target: 8%+", icon: <Eye size={16} className="text-purple-400" /> },
  { label: "Funnel Conversion (industry)", value: "1–3%", yours: "Target: 7–12%", icon: <TrendingUp size={16} className="text-green-400" /> },
  { label: "Best Send Time", value: "Tue–Thu", yours: "9am or 2pm local", icon: <Clock size={16} className="text-yellow-400" /> },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs font-bold transition-all flex-shrink-0">
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function EmailCard({ email, isOpen, onToggle }) {
  const dayColors = {
    0: "#06b6d4", 1: "#8b5cf6", 2: "#22c55e",
    3: "#f59e0b", 4: "#3b82f6", 5: "#ef4444", 6: "#f97316"
  };
  const color = dayColors[email.day];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header — always visible */}
      <button onClick={onToggle} className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-800/30 transition-colors min-h-0">
        {/* Day badge */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black text-white text-xs"
          style={{ backgroundColor: `${color}20`, border: `1.5px solid ${color}50` }}>
          <span style={{ color }} className="text-lg font-black leading-none">{email.day}</span>
          <span className="text-gray-500 text-[9px] uppercase tracking-wider">Day</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
              {email.tag}
            </span>
            <span className="text-gray-600 text-xs">{email.sendTime}</span>
          </div>
          <p className="text-white font-bold text-sm leading-snug mb-0.5">{email.subject}</p>
          <p className="text-gray-500 text-xs">{email.preheader}</p>
        </div>

        <div className="flex-shrink-0 ml-2 mt-1">
          {isOpen ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="border-t border-gray-800">
          {/* Meta bar */}
          <div className="px-5 py-3 flex flex-wrap items-center gap-3 bg-gray-900/60 border-b border-gray-800">
            <div>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-0.5">Goal</p>
              <p className="text-gray-300 text-xs">{email.goal}</p>
            </div>
            <div className="sm:ml-auto flex flex-wrap gap-2">
              {email.psychTriggers.map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">{t}</span>
              ))}
            </div>
          </div>

          {/* Subject + preheader */}
          <div className="px-5 py-4 border-b border-gray-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Subject Line</p>
                <p className="text-white font-bold text-sm">{email.subject}</p>
              </div>
              <CopyButton text={email.subject} />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Preheader</p>
                <p className="text-gray-300 text-sm">{email.preheader}</p>
              </div>
              <CopyButton text={email.preheader} />
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Email Body</p>
              <CopyButton text={email.body} />
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <pre className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">{email.body}</pre>
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 py-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Primary CTA</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-2.5 rounded-lg font-black text-white text-sm text-center"
                style={{ backgroundColor: color, boxShadow: `0 2px 12px ${color}40` }}>
                {email.cta}
              </div>
              <CopyButton text={email.cta} />
            </div>
            <p className="text-gray-600 text-xs mt-2">→ Links to: <code className="text-cyan-400">{email.ctaUrl}</code></p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EmailFunnel() {
  const [openIdx, setOpenIdx] = useState(0);
  const [expandAll, setExpandAll] = useState(false);

  const toggle = (i) => {
    if (expandAll) {
      setExpandAll(false);
      setOpenIdx(i);
    } else {
      setOpenIdx(openIdx === i ? null : i);
    }
  };

  const isOpen = (i) => expandAll || openIdx === i;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Admin
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-lg flex items-center gap-2">
              <Mail size={18} className="text-cyan-400" /> 7-Day Conversion Email Funnel
            </h1>
            <p className="text-gray-500 text-xs">Direct response copy — free → paid member conversion sequence</p>
          </div>
        </div>
        <button onClick={() => { setExpandAll(e => !e); setOpenIdx(null); }}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition-colors">
          {expandAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-10">

        {/* Funnel overview */}
        <div className="mb-10 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-black text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" /> Funnel Strategy Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { phase: "Days 0–2", label: "Build Trust", desc: "Deliver value, establish authority, show social proof", color: "#06b6d4" },
              { phase: "Days 3–4", label: "Agitate + Educate", desc: "Surface the pain, go deep on one device, show specificity", color: "#8b5cf6" },
              { phase: "Days 5–6", label: "Close", desc: "Hard urgency, scarcity, binary choice, final door", color: "#ef4444" },
            ].map((p, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4">
                <p className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: p.color }}>{p.phase} — {p.label}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Benchmark metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {METRICS.map((m, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">{m.icon}<span className="text-gray-400 text-xs font-bold">{m.label}</span></div>
                <p className="text-gray-600 text-xs line-through">{m.value}</p>
                <p className="text-white text-xs font-black">{m.yours}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Setup checklist */}
        <div className="mb-8 bg-yellow-950/20 border border-yellow-800/40 rounded-2xl p-5">
          <h3 className="text-yellow-400 font-black text-sm flex items-center gap-2 mb-3">
            <AlertTriangle size={14} /> Before You Send — Setup Checklist
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Replace [First Name] with your ESP merge tag",
              "Replace [LINK] with the actual free vault URL",
              "Connect your ESP (Mailchimp, ConvertKit, etc.) to the signup form",
              "Set automation triggers for each email timing",
              "Add UTM parameters to all CTA links for tracking",
              "Set up A/B test on Day 0 and Day 5 subject lines",
              "Configure plain-text version (increases deliverability)",
              "Suppress unsubscribes from future sequences automatically",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <Shield size={11} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Email cards */}
        <div className="space-y-4 mb-10">
          {EMAILS.map((email, i) => (
            <EmailCard key={i} email={email} isOpen={isOpen(i)} onToggle={() => toggle(i)} />
          ))}
        </div>

        {/* Subject line A/B test bank */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="font-black text-white mb-4 flex items-center gap-2">
            <Zap size={15} className="text-yellow-400" /> Subject Line A/B Test Bank
          </h3>
          <p className="text-gray-500 text-xs mb-5">Alternate subject lines to A/B test against the primary sequence.</p>
          <div className="space-y-3">
            {[
              { day: 0, alts: ["You won't believe what's locked in the vault", "Free guide inside + the one thing I can't send you"] },
              { day: 1, alts: ["The government funded this. Then buried it.", "This peer-reviewed paper shouldn't exist"] },
              { day: 2, alts: ["He spent $240 and replicated a COP>1 device", "What happened after he opened the vault"] },
              { day: 3, alts: ["The real reason your invention is stuck in your head", "Still researching? Here's why."] },
              { day: 5, alts: ["The founding rate closes at 1,000 members", "Your spot is about to expire"] },
              { day: 6, alts: ["This is goodbye (unless...)", "Final message from the vault"] },
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Day {item.day} Alternates</p>
                <div className="space-y-2">
                  {item.alts.map((alt, j) => (
                    <div key={j} className="flex items-center justify-between gap-3">
                      <p className="text-gray-300 text-sm">{alt}</p>
                      <CopyButton text={alt} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post-purchase sequence note */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-black text-white mb-2 flex items-center gap-2">
            <Star size={15} className="text-purple-400" /> Post-Purchase Sequences (Next Priority)
          </h3>
          <p className="text-gray-400 text-sm mb-4">After this funnel converts, build these sequences next:</p>
          <div className="space-y-2">
            {[
              { seq: "Starter → Pro Upgrade", trigger: "Day 7 after Starter join", goal: "Show the delta of what's locked at Starter vs Pro" },
              { seq: "Pro → Kit Purchase", trigger: "Day 3 after Pro join", goal: "Physical kit upsell — MEG or Prioré component bundles" },
              { seq: "Engagement Recovery", trigger: "No login in 14 days", goal: "Re-engage with a specific build challenge or new content drop" },
              { seq: "Annual Upgrade", trigger: "Day 25 of first month", goal: "Offer 2 months free on annual billing to reduce churn" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-800 rounded-xl">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                <div>
                  <p className="text-white font-bold text-sm">{item.seq}</p>
                  <p className="text-gray-500 text-xs">Trigger: {item.trigger} · Goal: {item.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}