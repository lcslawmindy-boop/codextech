import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Bell, Mail, Calendar, TrendingDown, Zap, RefreshCw,
  ChevronDown, ChevronUp, Copy, Check, AlertTriangle, Users, Clock,
  Activity, Target, MessageSquare, BookOpen, Wrench, Star
} from "lucide-react";

// ── Weekly content release schedule ───────────────────────────────────────────
const CONTENT_WEEKS = [
  {
    week: "Week 1 — Activation",
    theme: "Get your first win fast",
    themeColor: "#06b6d4",
    releases: [
      { day: "Monday", type: "Build Drop", title: "Featured Build Plan — MEG Replication Kit", trigger: "New build badge on dashboard", email: false },
      { day: "Tuesday", type: "Course", title: "Scalar EM Fundamentals — Module 1 unlocked", trigger: "In-app notification: 'Module 1 is live'", email: false },
      { day: "Thursday", type: "Email", title: "\"Did you open your build plan yet?\"", trigger: "Auto — if user has 0 library opens in 72h", email: true },
      { day: "Friday", type: "Kit Upsell", title: "MEG Parts Kit — limited bundle reminder", trigger: "Banner on build plan page", email: false },
    ]
  },
  {
    week: "Week 2 — Depth",
    theme: "Show the breadth of the vault",
    themeColor: "#8b5cf6",
    releases: [
      { day: "Monday", type: "Build Drop", title: "New Build Unlocked — Prioré Multichannel EM System", trigger: "Push notification + email", email: true },
      { day: "Wednesday", type: "Prior Art", title: "5 new prior art entries added to archive", trigger: "\"Archive updated\" badge on nav", email: false },
      { day: "Thursday", type: "Email", title: "\"The French government funded this — then buried it\"", trigger: "Auto-send to all active members", email: true },
      { day: "Saturday", type: "Lab", title: "Scalar Wave Simulator — new parameter preset", trigger: "Lab changelog notification", email: false },
    ]
  },
  {
    week: "Week 3 — Investment Value",
    theme: "Anchor the price to the value",
    themeColor: "#22c55e",
    releases: [
      { day: "Monday", type: "Course", title: "Patent Strategy Course — Module 3 dropped", trigger: "In-app notification", email: false },
      { day: "Tuesday", type: "Email", title: "\"Your membership saved you $2,400 this month\"", trigger: "Auto — value recap with usage data", email: true },
      { day: "Thursday", type: "Build Drop", title: "Anenergy Pump Circuit — complete BOM now available", trigger: "Dashboard build feed", email: false },
      { day: "Friday", type: "Upsell", title: "Upgrade to Pro — this week only, bonus course included", trigger: "Banner for Starter members only", email: true },
    ]
  },
  {
    week: "Week 4 — Community + FOMO",
    theme: "You're part of something bigger",
    themeColor: "#f59e0b",
    releases: [
      { day: "Monday", type: "Social Proof", title: "\"3 members replicated the MEG this month\"", trigger: "Dashboard feed post", email: false },
      { day: "Wednesday", type: "Build Drop", title: "New restricted build unlocked for Elite members", trigger: "Email to Elite / upgrade nudge for Pro", email: true },
      { day: "Thursday", type: "Email", title: "Monthly digest — what dropped, what's coming", trigger: "All active members", email: true },
      { day: "Sunday", type: "Teaser", title: "\"Next month: 3 new builds + AI patent update\"", trigger: "Email preview of upcoming drops", email: true },
    ]
  },
];

// ── Churn signals + automated responses ───────────────────────────────────────
const CHURN_SIGNALS = [
  {
    signal: "0 logins in 7 days",
    risk: "high",
    riskColor: "#ef4444",
    trigger: "Day 8 — automated",
    email: {
      subject: "Did we lose you? (here's what dropped while you were away)",
      body: `Hey [First Name],

You haven't opened the vault in a week. That's fine — life gets busy.

But here's what dropped while you were away:
→ [BUILD_NAME] build plan — full BOM + assembly guide
→ [COURSE_NAME] — Module [N] now live
→ [N] new prior art entries added to the archive

The builds don't expire. Everything you paid for is still there.

[Open the vault →] — or reply to this email and tell me what would make it more useful for you.

— The ZARP Team`,
      psychTrigger: "Loss aversion + curiosity gap",
    }
  },
  {
    signal: "0 logins in 14 days",
    risk: "critical",
    riskColor: "#f97316",
    trigger: "Day 15 — automated",
    email: {
      subject: "We're about to lose you — and I don't want that",
      body: `Hey [First Name],

Two weeks with no vault activity. I'm going to be straight with you.

Most members who go 14 days without logging in cancel within 30 days. I don't want that to happen, because I know there's something in the vault that's relevant to what you're working on.

So here's what I'll do: reply to this email and tell me what you're trying to build, research, or patent. I'll personally point you to the 3 most useful resources in your account right now.

Or — if the timing just isn't right — you can pause your membership instead of canceling. Your data and progress stay intact.

[Log back in →]
[Pause instead of cancel →]

The ZARP Team`,
      psychTrigger: "Personal outreach + pause offer (saves cancellations)",
    }
  },
  {
    signal: "Visits /account page 2+ times",
    risk: "medium",
    riskColor: "#f59e0b",
    trigger: "Same-day trigger",
    email: {
      subject: "Before you cancel — one thing to check",
      body: `Hey [First Name],

I noticed you visited your account page a couple of times recently — usually that means someone is thinking about canceling.

Before you do, two things:

1. You can pause your membership (keeps your access, pauses billing for up to 2 months)
2. There are [N] build plans and courses you haven't opened yet — are any of them relevant to what you're working on?

If it's a budget issue — reply to this email. There are options.
If the content isn't what you expected — also reply. That's fixable.

The ZARP Team

P.S. — Your MEG build plan PDF download expires when your membership does. Just so you know.`,
      psychTrigger: "Anticipated regret + ownership reminder",
    }
  },
  {
    signal: "Approaching 30-day renewal (day 25)",
    risk: "medium",
    riskColor: "#3b82f6",
    trigger: "Day 25 — automated",
    email: {
      subject: "Your vault renews in 5 days — here's what's coming next month",
      body: `Hey [First Name],

Your ZARP membership renews on [RENEWAL_DATE].

Before it does — here's what's dropping next month:
→ [3 upcoming build plan titles]
→ [N] new course modules
→ Major AI patent tool update (claim scoring v2)

Already planning to stay? Nothing you need to do.

Not sure? Here's your usage summary this month:
— Build plans accessed: [N]
— Courses completed: [N]
— PDFs downloaded: [N]

If you got value from any of those, the renewal is worth it.

[Manage my subscription →]

The ZARP Team`,
      psychTrigger: "Usage validation + future value preview",
    }
  },
  {
    signal: "Cancellation initiated",
    risk: "critical",
    riskColor: "#ef4444",
    trigger: "Cancellation webhook — immediate",
    email: {
      subject: "Before your access ends — can I ask why?",
      body: `Hey [First Name],

Your ZARP membership has been canceled. Access continues until [END_DATE].

One quick question: why?

a) Too expensive right now
b) Didn't use it enough
c) Didn't find what I was looking for
d) Switching to something else
e) Other

Reply with a letter. I read every response personally, and if there's anything I can do — a discount, a pause, a different plan — I'll make it happen.

The ZARP Team

P.S. — Your data stays intact for 90 days. If you come back, everything is exactly where you left it.`,
      psychTrigger: "Feedback loop + win-back offer hook",
    }
  },
];

// ── Engagement tactics ────────────────────────────────────────────────────────
const ENGAGEMENT_TACTICS = [
  {
    category: "In-App Hooks",
    color: "#06b6d4",
    icon: <Activity size={16} className="text-cyan-400" />,
    tactics: [
      { name: "\"New Drop\" badge", desc: "Red badge on nav items when new content posts. Clears on visit. Triggers login habit.", effort: "Low", impact: "High" },
      { name: "Build streak counter", desc: "Track consecutive weeks with vault activity. Show streak on dashboard. Loss aversion kicks in after 3+ weeks.", effort: "Medium", impact: "High" },
      { name: "Progress gates", desc: "'You're 60% through the MEG build plan' progress bar. Incompletion drives return visits.", effort: "Medium", impact: "Medium" },
      { name: "Vault 'what's new' feed", desc: "Chronological feed of recent drops on the dashboard. First thing members see on login.", effort: "Low", impact: "Medium" },
    ]
  },
  {
    category: "Email Triggers",
    color: "#8b5cf6",
    icon: <Mail size={16} className="text-purple-400" />,
    tactics: [
      { name: "Usage digest (monthly)", desc: "Personalized: 'You accessed N builds, completed N courses, downloaded N PDFs this month.' Makes value concrete.", effort: "Medium", impact: "High" },
      { name: "\"Coming next month\" preview", desc: "Sent day 27 of billing cycle. Lists upcoming drops. Gives a reason to stay for another month.", effort: "Low", impact: "High" },
      { name: "Kit re-engagement", desc: "If user opened a build plan but didn't buy the kit: 'You viewed the MEG plan 3 times — the parts kit is $287.' 7-day delay.", effort: "Low", impact: "Medium" },
      { name: "Win email", desc: "When a member downloads their first PDF or completes a course module — send a congratulations email with the next suggested action.", effort: "Low", impact: "Medium" },
    ]
  },
  {
    category: "Upgrade Triggers",
    color: "#22c55e",
    icon: <TrendingDown size={16} className="text-green-400" />,
    tactics: [
      { name: "Locked content gate", desc: "Starter members see Pro-locked builds blurred with a 1-click upgrade CTA. FOMO at the moment of desire.", effort: "Low", impact: "High" },
      { name: "Annual plan offer (month 2)", desc: "On day 35: 'Pay annually, get 2 months free.' Reduces churn by locking in 12 months of cash.", effort: "Low", impact: "High" },
      { name: "Elite-only content drop", desc: "Monthly restricted build that ONLY Elite can access. Creates visible tier differentiation and upgrade pressure.", effort: "Medium", impact: "High" },
      { name: "Kit bundle discount", desc: "After 3 kit purchases: 'Bundle your next 3 kits and save 15%.' Volume incentive, raises LTV.", effort: "Low", impact: "Medium" },
    ]
  },
];

// ── Churn reduction math ──────────────────────────────────────────────────────
const CHURN_MATH = [
  { tactic: "Login re-engagement email (7-day)", saves: "~8% of at-risk users", revenue: "+$23/mo avg per save" },
  { tactic: "Pause-instead-of-cancel offer", saves: "~22% of cancellation attempts", revenue: "Delays churn 6–8 weeks avg" },
  { tactic: "Annual plan upsell (month 2)", saves: "Reduces monthly churn by ~40%", revenue: "+$232 LTV per conversion" },
  { tactic: "Pre-renewal preview email", saves: "~12% churn reduction at renewal", revenue: "+$79/mo per save" },
  { tactic: "Win email (first action)", saves: "34% higher 30-day retention", revenue: "Compounding effect on LTV" },
];

// ── UI helpers ─────────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-400 hover:text-white transition-all flex-shrink-0">
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function RiskBadge({ risk, color }) {
  return (
    <span className="text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}50` }}>
      {risk}
    </span>
  );
}

function ChurnCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-800/30 transition-colors min-h-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlertTriangle size={15} style={{ color: item.riskColor }} className="flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{item.signal}</p>
            <p className="text-gray-500 text-xs">{item.trigger}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <RiskBadge risk={item.risk} color={item.riskColor} />
          {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Subject Line</p>
              <p className="text-white font-bold text-sm">{item.email.subject}</p>
            </div>
            <CopyButton text={item.email.subject} />
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Email Body</p>
              <CopyButton text={item.email.body} />
            </div>
            <pre className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
              {item.email.body}
            </pre>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-950/30 border border-purple-800/30 rounded-lg">
            <Zap size={11} className="text-purple-400 flex-shrink-0" />
            <p className="text-purple-300 text-xs"><span className="font-black">Psych trigger:</span> {item.email.psychTrigger}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function WeekCard({ week }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-800/30 transition-colors min-h-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: week.themeColor }} />
          <div>
            <p className="text-white font-black text-sm">{week.week}</p>
            <p className="text-gray-500 text-xs italic">"{week.theme}"</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-600">{week.releases.length} drops</span>
          {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-800 divide-y divide-gray-800">
          {week.releases.map((r, i) => (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <div className="flex-shrink-0 w-20 text-xs text-gray-600 font-bold pt-0.5">{r.day}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-xs font-black px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${week.themeColor}15`, color: week.themeColor }}>
                    {r.type}
                  </span>
                  {r.email && <Mail size={11} className="text-purple-400" title="Email sent" />}
                </div>
                <p className="text-white text-sm font-semibold leading-snug mb-0.5">{r.title}</p>
                <p className="text-gray-500 text-xs">{r.trigger}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RetentionDashboard() {
  const [activeTab, setActiveTab] = useState("calendar");

  const tabs = [
    { id: "calendar", label: "Content Calendar", icon: <Calendar size={14} /> },
    { id: "churn", label: "Churn Signals", icon: <AlertTriangle size={14} /> },
    { id: "tactics", label: "Engagement Tactics", icon: <Target size={14} /> },
    { id: "math", label: "Retention Math", icon: <TrendingDown size={14} /> },
  ];

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
              <RefreshCw size={17} className="text-green-400" /> Retention Engine
            </h1>
            <p className="text-gray-500 text-xs">Content cadence · Churn signals · Re-engagement playbook</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-400 font-bold">🔒 ADMIN ONLY</span>
        </div>
      </div>

      {/* KPI bar */}
      <div className="border-b border-gray-800 bg-gray-900/30 px-6 py-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Target monthly churn", value: "<5%", color: "#22c55e", sub: "Industry avg: 8–10%" },
            { label: "Churn intervention window", value: "7 days", color: "#f59e0b", sub: "After inactivity trigger" },
            { label: "Annual plan LTV lift", value: "+40%", color: "#8b5cf6", sub: "vs monthly billing" },
            { label: "Win-back rate (avg)", value: "22%", color: "#06b6d4", sub: "With pause offer" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="font-black text-2xl mb-0.5" style={{ color: s.color }}>{s.value}</p>
              <p className="text-white text-xs font-bold">{s.label}</p>
              <p className="text-gray-600 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 px-6 sticky top-[73px] z-20 bg-gray-950">
        <div className="max-w-5xl mx-auto flex gap-0">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-colors min-h-0 ${
                activeTab === t.id
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* ── TAB: Content Calendar ── */}
        {activeTab === "calendar" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">4-Week Repeating Content Cadence</h2>
              <p className="text-gray-500 text-sm">
                Release content on a predictable schedule. Members who anticipate drops don't cancel.
                Each week has a distinct psychological theme — activation, depth, value anchor, FOMO.
              </p>
            </div>
            <div className="bg-gray-900 border border-cyan-900/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Bell size={15} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-black text-cyan-300">Core principle:</span>
                <span className="text-gray-400"> Every Monday = new build drop. Members form a habit of checking in every Monday. That habit is the retention engine.</span>
              </div>
            </div>
            <div className="space-y-3">
              {CONTENT_WEEKS.map((week, i) => <WeekCard key={i} week={week} />)}
            </div>

            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-black text-white mb-3 flex items-center gap-2">
                <BookOpen size={15} className="text-blue-400" /> Content Production Minimums
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Wrench size={16} className="text-orange-400" />, label: "2 new build plans/month", sub: "Monday drops = login habit" },
                  { icon: <BookOpen size={16} className="text-blue-400" />, label: "4 course modules/month", sub: "1 per week keeps engagement" },
                  { icon: <Mail size={16} className="text-purple-400" />, label: "4–6 emails/month", sub: "2 value drops + 2 triggers + re-engage" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                    {item.icon}
                    <div>
                      <p className="text-white font-bold text-sm">{item.label}</p>
                      <p className="text-gray-500 text-xs">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Churn Signals ── */}
        {activeTab === "churn" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Churn Signal Playbook</h2>
              <p className="text-gray-500 text-sm">
                Every signal below is a behavioral indicator. Each one triggers an automated email with exact copy.
                Expand any card to get the full email — subject, body, and the psychological mechanism it uses.
              </p>
            </div>
            <div className="bg-gray-900 border border-yellow-900/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle size={15} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400">
                <span className="font-black text-yellow-300">Implementation note:</span> Wire these to your ESP (ConvertKit, ActiveCampaign, etc.) via webhook or Zapier.
                The signal source is your app analytics or Stripe billing events.
              </p>
            </div>
            <div className="space-y-3">
              {CHURN_SIGNALS.map((item, i) => <ChurnCard key={i} item={item} />)}
            </div>
          </div>
        )}

        {/* ── TAB: Engagement Tactics ── */}
        {activeTab === "tactics" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Engagement Tactics by Category</h2>
              <p className="text-gray-500 text-sm">
                Rated by implementation effort (Low/Medium/High) and estimated retention impact.
                Start with all Low-effort + High-impact tactics before investing in complex builds.
              </p>
            </div>
            <div className="space-y-8">
              {ENGAGEMENT_TACTICS.map((cat, ci) => (
                <div key={ci}>
                  <div className="flex items-center gap-2 mb-3">
                    {cat.icon}
                    <h3 className="font-black text-white text-base">{cat.category}</h3>
                  </div>
                  <div className="space-y-2">
                    {cat.tactics.map((tactic, ti) => (
                      <div key={ti} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm mb-1">{tactic.name}</h4>
                          <p className="text-gray-400 text-xs leading-relaxed">{tactic.desc}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${
                            tactic.effort === "Low" ? "bg-green-950/40 text-green-400 border border-green-800/40"
                            : tactic.effort === "Medium" ? "bg-yellow-950/40 text-yellow-400 border border-yellow-800/40"
                            : "bg-red-950/40 text-red-400 border border-red-800/40"
                          }`}>{tactic.effort} effort</span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${
                            tactic.impact === "High" ? "bg-purple-950/40 text-purple-300 border border-purple-800/40"
                            : "bg-gray-800 text-gray-400 border border-gray-700"
                          }`}>{tactic.impact} impact</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: Retention Math ── */}
        {activeTab === "math" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Retention Math — What Each Tactic Is Worth</h2>
              <p className="text-gray-500 text-sm">
                At 500 members × $79/month avg = $39,500 MRR. A 1% churn reduction saves ~$395/month.
                These are the highest-ROI levers in the business.
              </p>
            </div>

            {/* Impact table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
              <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-3 gap-3 text-xs font-black uppercase tracking-wider text-gray-500">
                <span>Tactic</span><span>Churn Impact</span><span>Revenue Impact</span>
              </div>
              {CHURN_MATH.map((row, i) => (
                <div key={i} className={`px-5 py-4 grid grid-cols-3 gap-3 border-b border-gray-800 last:border-0 ${i % 2 === 0 ? "bg-gray-900/40" : ""}`}>
                  <span className="text-white text-sm font-semibold">{row.tactic}</span>
                  <span className="text-green-400 text-sm font-bold">{row.saves}</span>
                  <span className="text-cyan-400 text-sm font-bold">{row.revenue}</span>
                </div>
              ))}
            </div>

            {/* Annual plan math */}
            <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-800/40 rounded-xl p-6 mb-6">
              <h3 className="text-white font-black mb-4 flex items-center gap-2">
                <Star size={15} className="text-yellow-400" /> The Annual Plan is Your Single Biggest Retention Lever
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Monthly subscriber", value: "$79/mo", sub: "~40% 12-month retention avg" },
                  { label: "Annual subscriber", value: "$790/yr", sub: "~85% 12-month retention avg" },
                  { label: "LTV difference", value: "+$484", sub: "Per member converted to annual" },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-900/60 rounded-xl p-4 text-center">
                    <p className="text-white font-black text-xl">{s.value}</p>
                    <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                    <p className="text-gray-600 text-xs">{s.sub}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm">
                <span className="font-black text-purple-300">When to offer it:</span> Day 35 email (after they've experienced the first full month of value).
                Offer = "Pay annually, get 2 months free." That's $790 vs $948 — $158 savings, $790 collected upfront.
              </p>
            </div>

            {/* Pause strategy */}
            <div className="bg-gray-900 border border-orange-900/30 rounded-xl p-5">
              <h3 className="font-black text-white mb-2 flex items-center gap-2">
                <Clock size={15} className="text-orange-400" /> The Pause Strategy — Saves ~22% of Cancellations
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Most members who cancel aren't angry — they're busy or broke temporarily.
                Offering a 1–2 month pause (billing stops, access continues) converts ~22% of cancellation attempts into temporary pauses.
                Of those, ~60% reactivate within 6 weeks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-800 rounded-xl">
                  <p className="text-white font-bold text-sm mb-1">Implementation</p>
                  <p className="text-gray-500 text-xs">Add "Pause membership" button to account settings. Stripe supports pausing subscriptions natively via the `pause_collection` parameter.</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-xl">
                  <p className="text-white font-bold text-sm mb-1">Trigger point</p>
                  <p className="text-gray-500 text-xs">Offer pause in: (1) the 14-day re-engagement email, (2) the cancellation flow exit popup, (3) the post-cancel win-back email.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}