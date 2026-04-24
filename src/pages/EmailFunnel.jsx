import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Copy, Check, ChevronDown, ChevronUp, Zap, Clock, Star, Shield } from "lucide-react";

const FUNNEL = [
  {
    day: 1,
    type: "Welcome + Authority",
    subject: "You're in. Here's what most engineers miss…",
    preview: "The discovery that got suppressed for 40 years",
    trigger: "Authority + Curiosity",
    body: `Hey [First Name],

Welcome to the ZARP vault.

Before you dive into the build plans, I want to tell you something most engineers spend years learning the hard way:

The biggest breakthroughs in electromagnetic engineering are sitting in plain sight — inside granted US patents, declassified ONR reports, and peer-reviewed papers that nobody teaches in university.

Tom Bearden spent 30 years translating this material into engineering-actionable form. His work on the Motionless Electromagnetic Generator (US Patent 6,362,718) was published in Foundations of Physics Letters.

That's not fringe. That's the peer-reviewed record.

This week I'm going to walk you through the 5 things I wish I'd known before starting my first scalar EM build — starting with why standard Maxwell equations hide half the physics.

Tomorrow: the Lorentz error that's been in every textbook since 1892 — and what it means for COP>1 devices.

— The ZARP Team

P.S. Your first build plan is waiting: [Link to EM Trigger Window Therapy Device]`,
    cta: "View Your First Build Plan →",
    ctaUrl: "/invention-plans",
    emotionalTrigger: "You made a smart decision. Here's proof.",
    logicalTrigger: "Peer-reviewed citation. Establishes credibility immediately."
  },
  {
    day: 2,
    type: "Education + Credibility",
    subject: "The Lorentz error — and why it matters for your build",
    preview: "Hidden since 1892. Now engineering it.",
    trigger: "Education + Intellectual Curiosity",
    body: `Hey [First Name],

In 1892, Hendrik Lorentz made a simplifying assumption in Maxwell's equations.

He "symmetrically regauged" the equations — discarding a term that would have allowed circuits to output more energy than the operator inputs.

Every electrical engineering textbook since then has inherited that error.

What does this mean in practice?

It means every conventional circuit is artificially handicapped. The Lorentz condition forces all circuits into COP<1.

Bearden's work — and the 2002 MEG patent — shows how to engineer around this. The result is a circuit that pulls from the local vacuum potential. The permanent magnet acts as a dipole, continuously replenishing energy from the vacuum field.

This isn't theory. It's in the patent record.

Want to build it? The MEG Replication Kit is inside your vault — step-by-step, full BOM, part numbers, supplier links.

[Unlock the MEG Build Plans →]`,
    cta: "Unlock the MEG Build Plans →",
    ctaUrl: "/pricing",
    emotionalTrigger: "I've been lied to. Now I know why.",
    logicalTrigger: "Explains the physics clearly. Makes the vault feel essential."
  },
  {
    day: 3,
    type: "Social Proof + FOMO",
    subject: "What R.K. built in 3 weeks (with $400 in parts)",
    preview: "An electrical engineer's full build report",
    trigger: "Social Proof + Achievability",
    body: `Hey [First Name],

R.K. is a 20-year electrical engineer.

He joined ZARP on a Tuesday. By Friday he had the BOM ordered for the Vacuum Potential Oscillator.

Three weeks later he sent us this:

"The MEG build plans alone are worth 10x the membership. I've never seen documentation like this outside of a classified contract."

He's not alone.

A.S. — an independent inventor — used the AI Patent Suite to generate a full provisional patent draft in one session. His attorney called it the best pre-draft she'd ever reviewed.

M.T. — a scalar EM researcher of 20 years — said:

"This is the only platform that teaches you to actually build, not just theorize."

These aren't exceptional cases. They're what happens when you give serious engineers primary-source documentation.

Your vault is waiting. The founding rate ($49/mo) closes when we hit 1,000 members.

[Join Before the Price Goes Up →]`,
    cta: "Join Before the Price Goes Up →",
    ctaUrl: "/paywall",
    emotionalTrigger: "Others are succeeding. I could too.",
    logicalTrigger: "Proof that the investment pays off fast."
  },
  {
    day: 4,
    type: "Pain + Agitation",
    subject: "Why most inventors never file a patent",
    preview: "It's not money. It's this.",
    trigger: "Pain Agitation + Solution",
    body: `Hey [First Name],

The #1 reason inventors never file:

They don't know if their idea is novel.

Prior art research is time-consuming, expensive, and overwhelming. Most inventors spend months on it — or skip it entirely and get rejected.

There's a second problem: even when they file, the claims are too broad or too narrow. Patent attorneys charge $400/hr to fix this.

ZARP solves both.

The Prior Art Archive has 200+ categorized entries — scalar EM, vacuum energy, bioelectromagnetics, free energy — with rejection grounds, failure reasons, and what actually worked.

The AI Patent Suite drafts your claims, identifies prior art conflicts, and generates a full provisional in one session.

One member saved $4,200 in attorney fees on his first filing.

If you've been sitting on an invention idea, this is the week to move.

[Access the Patent Suite →]`,
    cta: "Access the Patent Suite →",
    ctaUrl: "/pricing",
    emotionalTrigger: "This is the thing that's been holding me back.",
    logicalTrigger: "Quantified ROI ($4,200 saved). Specific and believable."
  },
  {
    day: 5,
    type: "Objection Handling",
    subject: "Is this real science or conspiracy?",
    preview: "The honest answer.",
    trigger: "Credibility + Preemptive Objection Removal",
    body: `Hey [First Name],

I get this question a lot. Let me be direct.

ZARP is built on:
- Granted US patents (verifiable at USPTO.gov)
- Peer-reviewed journal publications
- Declassified ONR and DOD documents
- Named, credentialed inventors and researchers

We do not promote perpetual motion machines, free energy in the thermodynamic sense, or unverified claims.

What we do teach:

Open-system thermodynamics (which is mainstream physics — the sun is an open system). Asymmetric regauging (published in peer-reviewed literature). Bioelectromagnetics (an active NIH research field). Scalar potential theory (part of classical EM — just not typically taught).

Tom Bearden was a graduate of the Command and General Staff College. His co-inventors on the MEG patent included a PhD physicist with 30+ peer-reviewed publications.

This isn't fringe. It's primary sources.

The question isn't whether this is real. The question is: are you going to build it?

[Start With the Primary Sources →]`,
    cta: "Start With the Primary Sources →",
    ctaUrl: "/prior-art",
    emotionalTrigger: "My skepticism is addressed directly and honestly.",
    logicalTrigger: "Credentials cited. Objection neutralized before it forms."
  },
  {
    day: 6,
    type: "Scarcity + Urgency",
    subject: "153 members joined this month. 847 founding spots left.",
    preview: "After 1,000 — price doubles.",
    trigger: "Scarcity + Loss Aversion",
    body: `Hey [First Name],

Quick update on where we are:

153 engineers and researchers joined ZARP this month at the founding rate of $49/mo.

847 founding spots remain.

When we hit 1,000 members, the price returns to $99/mo — permanently. No exceptions, no grandfather clauses.

At $49/mo, that's less than $1.63/day for:
- 40+ build plans (retail value: $8,000+)
- 40+ courses (retail value: $12,000+)
- Full AI patent suite (retail value: $3,000+)
- Prior art archive (retail value: $1,500+)

The math isn't close.

If you've been on the fence, this is the email that should move you.

[Lock In $49/mo Before It's Gone →]`,
    cta: "Lock In $49/mo Before It's Gone →",
    ctaUrl: "/paywall",
    emotionalTrigger: "Real fear of missing a permanent deal.",
    logicalTrigger: "Specific numbers. Concrete ROI math."
  },
  {
    day: 7,
    type: "Final CTA — Last Chance",
    subject: "Last email. Final offer. Your call.",
    preview: "I'm not going to keep asking.",
    trigger: "Finality + Respect + Last Chance",
    body: `Hey [First Name],

This is the last email in this series.

I'm not going to keep pitching you. You've seen what's inside the vault. You know what the founding rate is. You know it goes up when we hit 1,000 members.

Here's what I'll say simply:

If you're serious about building advanced EM devices, understanding the real physics, filing patents without attorney fees, and accessing primary-source engineering documentation — ZARP is the only place on earth where that exists in one platform.

If you're not ready, that's fine. The free vault stays open.

But if you're even 60% interested — that's enough to start. You can cancel anytime.

The founding rate is $49/mo. That's less than most engineers spend on a single technical book.

[Join the Vault — Final Offer →]

Whatever you decide — good luck with your work.

— The ZARP Team`,
    cta: "Join the Vault — Final Offer →",
    ctaUrl: "/paywall",
    emotionalTrigger: "Respect for the reader. No desperation. Final door closing.",
    logicalTrigger: "Anchoring to existing spend (books). Low friction framing."
  }
];

const TYPE_COLORS = {
  "Welcome + Authority": "bg-blue-900/40 border-blue-700 text-blue-300",
  "Education + Credibility": "bg-purple-900/40 border-purple-700 text-purple-300",
  "Social Proof + FOMO": "bg-green-900/40 border-green-700 text-green-300",
  "Pain + Agitation": "bg-red-900/40 border-red-700 text-red-300",
  "Objection Handling": "bg-yellow-900/40 border-yellow-700 text-yellow-300",
  "Scarcity + Urgency": "bg-orange-900/40 border-orange-700 text-orange-300",
  "Final CTA — Last Chance": "bg-cyan-900/40 border-cyan-700 text-cyan-300",
};

function EmailCard({ email }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyBody = () => {
    navigator.clipboard.writeText(email.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">D{email.day}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${TYPE_COLORS[email.type] || "bg-gray-800 border-gray-700 text-gray-300"}`}>
                {email.type}
              </span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{email.trigger}</span>
            </div>
            <h3 className="text-white font-bold text-base leading-snug">{email.subject}</h3>
            <p className="text-gray-500 text-xs mt-1 italic">Preview: {email.preview}</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-800">
          {/* Body */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Body Copy</p>
              <button
                onClick={copyBody}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-colors"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-gray-950 rounded-xl p-4 max-h-72 overflow-y-auto">
              {email.body}
            </pre>
          </div>

          {/* CTA + Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-gray-800">
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-gray-800">
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">CTA</p>
              <p className="text-white text-sm font-bold">{email.cta}</p>
              <a href={email.ctaUrl} className="text-cyan-500 text-xs hover:underline mt-1 block">{email.ctaUrl}</a>
            </div>
            <div className="p-4 border-b sm:border-b-0 sm:border-r border-gray-800">
              <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-2">Emotional Trigger</p>
              <p className="text-gray-300 text-sm italic">"{email.emotionalTrigger}"</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-2">Logical Trigger</p>
              <p className="text-gray-300 text-sm italic">"{email.logicalTrigger}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmailFunnel() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
        <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Admin
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-cyan-400" />
          <h1 className="text-white font-black text-lg">7-Day Email Funnel</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-green-900/40 border border-green-700 text-green-300 font-bold">Direct Response</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Emails", value: "7", icon: <Mail size={16} className="text-cyan-400" />, color: "border-cyan-800" },
            { label: "Avg Open Rate Target", value: "38%", icon: <Zap size={16} className="text-yellow-400" />, color: "border-yellow-800" },
            { label: "Conversion Target", value: "8–14%", icon: <Star size={16} className="text-green-400" />, color: "border-green-800" },
            { label: "Funnel Duration", value: "7 days", icon: <Clock size={16} className="text-purple-400" />, color: "border-purple-800" },
          ].map((s, i) => (
            <div key={i} className={`bg-gray-900 border ${s.color} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-gray-400 text-xs">{s.label}</span></div>
              <div className="text-2xl font-black text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Strategy Note */}
        <div className="bg-blue-950/30 border border-blue-800 rounded-xl p-5 mb-10">
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-300 font-bold text-sm mb-1">Funnel Strategy</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Day 1–2: Build authority and educate. Day 3–4: Social proof + pain agitation. Day 5: Preempt objections. Day 6–7: Scarcity + final close. Each email has ONE primary CTA. No confusion. No multiple links.
              </p>
            </div>
          </div>
        </div>

        {/* Emails */}
        <div className="space-y-4">
          {FUNNEL.map((email) => (
            <EmailCard key={email.day} email={email} />
          ))}
        </div>

        {/* Implementation Notes */}
        <div className="mt-10 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-black text-lg mb-4">Implementation Notes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="text-cyan-400 font-bold mb-2">Deliverability</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Use plain text + minimal HTML</li>
                <li>• Warm domain: 50/day → 200/day → 500/day</li>
                <li>• SPF, DKIM, DMARC all configured</li>
                <li>• Send from personal-style sender name</li>
              </ul>
            </div>
            <div>
              <p className="text-yellow-400 font-bold mb-2">Optimization</p>
              <ul className="space-y-1 text-gray-400">
                <li>• A/B test Day 1 subject line first</li>
                <li>• Segment: opened Day 1 vs. didn't</li>
                <li>• Non-openers get resend Day 2 with new subject</li>
                <li>• Clickers go to accelerated close sequence</li>
              </ul>
            </div>
            <div>
              <p className="text-green-400 font-bold mb-2">Recommended Tools</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Resend (transactional) or Klaviyo (sequences)</li>
                <li>• Instantly.ai or Lemlist for cold</li>
                <li>• PostHog for click-through tracking</li>
              </ul>
            </div>
            <div>
              <p className="text-orange-400 font-bold mb-2">Trigger Conditions</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Day 1: Immediate on signup</li>
                <li>• Day 2–6: 24h intervals</li>
                <li>• Day 7: Only if no purchase by Day 6</li>
                <li>• Stop sequence on conversion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}