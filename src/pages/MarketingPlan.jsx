import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Copy, Check, Loader2, ChevronDown, ChevronUp, Calendar, Target, DollarSign, Users, TrendingUp, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PLATFORMS = [
  { id: "linkedin",  label: "LinkedIn",   emoji: "💼", color: "#0077b5", goal: "Investor outreach & authority" },
  { id: "twitter",   label: "X / Twitter",emoji: "🐦", color: "#1d9bf0", goal: "Viral reach & thought leadership" },
  { id: "instagram", label: "Instagram",  emoji: "📸", color: "#e1306c", goal: "Visual storytelling & course sales" },
  { id: "tiktok",    label: "TikTok",     emoji: "🎵", color: "#ff0050", goal: "Short-form education & awareness" },
  { id: "youtube",   label: "YouTube",    emoji: "▶️", color: "#ff0000", goal: "Long-form deep-dives & SEO" },
  { id: "facebook",  label: "Facebook",   emoji: "👥", color: "#1877f2", goal: "Community building & retargeting" },
];

const OBJECTIVES = [
  { id: "investors", label: "Attract Investors", icon: "💰", desc: "Position Bearden IP as a high-value tech portfolio" },
  { id: "courses",   label: "Sell Courses",      icon: "🎓", desc: "Drive enrollment for scalar EM curriculum" },
  { id: "pdfs",      label: "Sell PDFs & Books", icon: "📖", desc: "Promote annotated research documents" },
  { id: "community", label: "Build Community",   icon: "🔬", desc: "Grow a researcher/inventor audience" },
];

const WEEK_THEMES = [
  { week: 1, theme: "The Problem with Physics", color: "#3b82f6", desc: "Hook: What mainstream science got wrong about EM theory" },
  { week: 2, theme: "The Bearden Solution",     color: "#a855f7", desc: "Introduce scalar EM, vacuum energy, anenergy pump" },
  { week: 3, theme: "Real Applications",        color: "#22c55e", desc: "Products, inventions, health applications — proof of concept" },
  { week: 4, theme: "Investment Opportunity",   color: "#f59e0b", desc: "IP portfolio, licensing, early-adopter offer, CTA" },
];

const TARGET_MEMBERS = 1000;

const PHASES = [
  {
    name: "Phase 1 — Warm Network", range: "Week 1–2", target: 100, color: "#f59e0b",
    desc: "Direct outreach to existing contacts, alternative physics forums, Bearden fan communities.",
    channels: [
      { icon: "📧", label: "Email Outreach", action: "Personal emails to 200+ warm contacts. Offer 30-day free trial or founding member discount.", conversion: "15%", volume: "200 contacts → 30 members" },
      { icon: "💬", label: "Reddit / Forums", action: "Post in r/FringeScience, r/AlternativeEnergy, Tesla/Bearden Facebook groups. Share 1 genuinely useful research excerpt.", conversion: "2–5%", volume: "1,000 views → 20 leads" },
      { icon: "🤝", label: "1-on-1 DMs", action: "LinkedIn DM to patent attorneys, independent inventors, biotech angel investors. Personalized pitch with platform demo link.", conversion: "10%", volume: "100 DMs → 10 members" },
    ]
  },
  {
    name: "Phase 2 — Content Engine", range: "Week 3–6", target: 300, color: "#6366f1",
    desc: "Launch the 30-day content calendar across LinkedIn, X, and YouTube. Build SEO and social proof.",
    channels: [
      { icon: "▶️", label: "YouTube (SEO)", action: "3 videos: 'What Bearden Actually Discovered', 'How MEG Works', 'Free Energy Patents That Were Suppressed'. Optimize for long-tail search.", conversion: "1%", volume: "10,000 views → 100 leads" },
      { icon: "💼", label: "LinkedIn Articles", action: "5 long-form articles: IP valuation of scalar EM, investing in frontier physics, alternative energy patent landscape. Include soft CTA to beta.", conversion: "3%", volume: "3,000 views → 90 leads" },
      { icon: "🐦", label: "X / Twitter Thread", action: "Weekly 10-tweet threads on suppressed patents. Pin a thread with top 5 MEG replications. Link to beta apply page.", conversion: "0.5%", volume: "20,000 impressions → 100 clicks" },
    ]
  },
  {
    name: "Phase 3 — Paid + Partners", range: "Week 7–10", target: 400, color: "#22c55e",
    desc: "Layer in paid acquisition and affiliate partnerships with influencers in alt-energy and fringe science.",
    channels: [
      { icon: "🎯", label: "Reddit Ads", action: "$500/mo targeted at r/AlternativeEnergy, r/Physics, r/Patents. Drive to free 'MEG Build Plan Preview' lead magnet page.", conversion: "2%", volume: "$500 → ~150 clicks → 3 members" },
      { icon: "🤝", label: "Affiliate / JV Partners", action: "Approach 10 alt-physics YouTubers (5k–50k subs) for 30% rev share. One good partner can bring 50–200 members.", conversion: "varies", volume: "10 partners × avg 20 referrals = 200" },
      { icon: "📧", label: "Newsletter Swap", action: "Trade newsletter plugs with fringe science, EMF health, and patent strategy newsletters. Target 10k+ subscriber lists.", conversion: "1%", volume: "5 swaps × 10k list × 1% = 500 leads" },
    ]
  },
  {
    name: "Phase 4 — Urgency + Referral", range: "Week 11–16", target: 200, color: "#ec4899",
    desc: "Final push: founding member deadline, referral program, and live webinar to convert fence-sitters.",
    channels: [
      { icon: "⏱️", label: "Founding Member Deadline", action: "Announce 'Founding 1000 Members' cohort closes [DATE]. Price increases after. Email sequence: 7 days, 3 days, 24 hours, CLOSED.", conversion: "20% of leads", volume: "Urgency converts 20% of existing list" },
      { icon: "🎁", label: "Referral Program", action: "Members get 1 month free for every referral who converts. Each member refers avg 1.2 friends → 40% member growth from referrals.", conversion: "40% lift", volume: "Existing 800 members × 1.2 referrals" },
      { icon: "🎙️", label: "Live Webinar", action: "'The Physics That Could Change Energy Forever' — free 60-min webinar. Pitch beta at end. 500 attendees target, 10% conversion.", conversion: "10%", volume: "500 attendees → 50 members" },
    ]
  },
];

const MRR_BREAKDOWN = [
  { label: "Builder Membership ($39/mo)", members: 250, value: 9750 },
  { label: "Researcher Membership ($59/mo)", members: 200, value: 11800 },
  { label: "Pro Membership — Founding Members ($39/mo)", members: 500, value: 19500 },
  { label: "Pro Membership — Regular ($89/mo)", members: 50, value: 4450 },
  { label: "Standalone Build Plans (avg $300)", members: 100, value: 30000 },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-700">
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function PostCard({ post, day, platform }) {
  const p = PLATFORMS.find(p => p.id === platform);
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{p?.emoji}</span>
          <span className="text-xs font-semibold" style={{ color: p?.color }}>{p?.label}</span>
          <span className="text-xs text-gray-600">· Day {day}</span>
        </div>
        <CopyButton text={post} />
      </div>
      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{post}</p>
    </div>
  );
}

function WeekSection({ week, posts }) {
  const [open, setOpen] = useState(week === 1);
  const weekPosts = posts.filter(p => p.week === week);
  if (!weekPosts.length) return null;
  const theme = WEEK_THEMES[week - 1];

  return (
    <div className="border border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-900/60 transition-colors"
        style={{ backgroundColor: theme.color + "10" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: theme.color }}>
            {week}
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-sm">Week {week}: {theme.theme}</p>
            <p className="text-gray-500 text-xs">{theme.desc} · {weekPosts.length} posts</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      {open && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-950">
          {weekPosts.map((p, i) => (
            <PostCard key={i} post={p.content} day={p.day} platform={p.platform} />
          ))}
        </div>
      )}
    </div>
  );
}

function GrowthPlanTab() {
  const totalValue = MRR_BREAKDOWN.reduce((s, r) => s + r.value, 0);
  const currentProgress = 0;
  const pct = Math.max(2, Math.round((currentProgress / TARGET_MEMBERS) * 100));

  return (
    <div className="px-6 py-6 space-y-8 max-w-6xl mx-auto">
      {/* Hero goal */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-yellow-900/40 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-white font-black text-2xl mb-1">🎯 Goal: <span className="text-yellow-400">{TARGET_MEMBERS} Founding Members</span></h2>
            <p className="text-gray-400 text-sm">Founding 1000 member cohort — founding pricing locked. 16-week acquisition plan.</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-0.5">Revenue at {TARGET_MEMBERS} members</p>
            <p className="text-green-400 font-black text-3xl">${totalValue.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">blended first-payment value</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Members acquired</span>
            <span className="text-yellow-300 font-bold">{currentProgress} / {TARGET_MEMBERS}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>0</span><span>250</span><span>500</span><span>750</span><span>1000</span>
          </div>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div>
        <h3 className="text-white font-black text-base mb-3">Revenue at {TARGET_MEMBERS} Members Goal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {MRR_BREAKDOWN.map((r, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-2 leading-tight">{r.label}</p>
              <p className="text-white font-black text-xl">${r.value.toLocaleString()}</p>
              <p className="text-gray-600 text-xs mt-1">{r.members} members</p>
            </div>
          ))}
        </div>
        <div className="bg-green-950/30 border border-green-900/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-green-400 font-black text-2xl">${totalValue.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">Total first-payment revenue from {TARGET_MEMBERS} members</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm font-bold">$77,960/mo recurring</p>
            <p className="text-gray-600 text-xs">from membership subs alone</p>
          </div>
        </div>
      </div>

      {/* Phase roadmap */}
      <div>
        <h3 className="text-white font-black text-base mb-4">16-Week Acquisition Roadmap</h3>
        <div className="space-y-4">
          {PHASES.map((phase, pi) => {
            const cumulative = PHASES.slice(0, pi + 1).reduce((s, p) => s + p.target, 0);
            return (
              <div key={pi} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden" style={{ borderLeftColor: phase.color, borderLeftWidth: 3 }}>
                <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-black text-sm">{phase.name}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">{phase.range} · {phase.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-black text-lg" style={{ color: phase.color }}>+{phase.target}</p>
                    <p className="text-gray-600 text-xs">{cumulative} total</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-800">
                  {phase.channels.map((ch, ci) => (
                    <div key={ci} className="px-5 py-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{ch.icon}</span>
                        <p className="text-white font-bold text-sm">{ch.label}</p>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">{ch.action}</p>
                      <div className="flex items-center gap-3 pt-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">Conv: {ch.conversion}</span>
                        <span className="text-xs text-gray-600">{ch.volume}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link to="/beta-apply" className="flex items-center gap-3 bg-yellow-900/30 border border-yellow-800 rounded-xl p-4 hover:bg-yellow-900/50 transition-colors">
          <Zap size={18} className="text-yellow-400" />
          <div><p className="text-white font-bold text-sm">Beta Apply Page</p><p className="text-gray-500 text-xs">Share this link in all outreach</p></div>
        </Link>
        <Link to="/pricing" className="flex items-center gap-3 bg-indigo-900/30 border border-indigo-800 rounded-xl p-4 hover:bg-indigo-900/50 transition-colors">
          <DollarSign size={18} className="text-indigo-400" />
          <div><p className="text-white font-bold text-sm">Pricing Page</p><p className="text-gray-500 text-xs">Checkout-ready landing page</p></div>
        </Link>
        <Link to="/social-command" className="flex items-center gap-3 bg-rose-900/30 border border-rose-700 rounded-xl p-4 hover:bg-rose-900/50 transition-colors">
          <TrendingUp size={18} className="text-rose-400" />
          <div><p className="text-white font-bold text-sm">🚀 Social Command</p><p className="text-gray-500 text-xs">AI content + video + advisor</p></div>
        </Link>
      </div>
    </div>
  );
}

export default function MarketingPlan() {
  const [tab, setTab] = useState("growth");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["linkedin", "twitter", "instagram"]);
  const [selectedObjectives, setSelectedObjectives] = useState(["investors", "courses"]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const togglePlatform = (id) => setSelectedPlatforms(prev =>
    prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
  );
  const toggleObjective = (id) => setSelectedObjectives(prev =>
    prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
  );

  const handleGenerate = async () => {
    setLoading(true);
    setPosts([]);
    setGenerated(false);

    const platformList = PLATFORMS.filter(p => selectedPlatforms.includes(p.id));
    const objectiveList = OBJECTIVES.filter(o => selectedObjectives.includes(o.id));
    const totalCalls = selectedPlatforms.length * 4;
    setProgress({ done: 0, total: totalCalls });

    const allPosts = [];
    let done = 0;

    for (const platform of platformList) {
      for (let weekNum = 1; weekNum <= 4; weekNum++) {
        const theme = WEEK_THEMES[weekNum - 1];
        const dayStart = (weekNum - 1) * 7 + 1;
        const dayEnd = weekNum === 4 ? 30 : weekNum * 7;
        const days = dayEnd - dayStart + 1;

        const platformGuide = {
          linkedin: "professional, 100-120 words, investor tone",
          twitter: "1-2 punchy sentences + hashtags #ScalarEM #Bearden",
          instagram: "emoji-rich, 3 sentences + hashtags",
          tiktok: "3-second hook + 3 bullet talking points",
          youtube: "video title + 1-sentence description + thumbnail idea",
          facebook: "conversational, question-based, 2 short paragraphs",
        }[platform.id] || "concise and compelling";

        const prompt = `Content strategist for deep tech marketing. Generate ${days} social media posts (one per day) for ${platform.label}.

Brand: Bearden Scalar EM Research Platform — "The suppressed physics that changes everything"
Products: Video courses ($147-$397), PDFs ($19-$67), Invention kits ($89)
Objectives: ${objectiveList.map(o => o.label).join(", ")}
Week ${weekNum} theme: "${theme.theme}" — ${theme.desc}
Days: ${dayStart} to ${dayEnd}
Style: ${platformGuide}

Return JSON: {"posts": [{"day": number, "week": ${weekNum}, "platform": "${platform.id}", "content": string}]}
Generate exactly ${days} posts for days ${dayStart}-${dayEnd}.`;

        let result = null;
        try {
          result = await base44.integrations.Core.InvokeLLM({
            prompt,
            model: "gpt_5_mini",
            response_json_schema: {
              type: "object",
              properties: {
                posts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day: { type: "number" },
                      week: { type: "number" },
                      platform: { type: "string" },
                      content: { type: "string" },
                    },
                  },
                },
              },
            },
          });
        } catch (err) {
          console.warn(`Skipping ${platform.id} week ${weekNum}:`, err.message);
        }

        allPosts.push(...(result?.posts || []));
        done++;
        setProgress({ done, total: totalCalls });
        setPosts([...allPosts]);
      }
    }

    setGenerated(true);
    setLoading(false);
  };

  const totalPosts = selectedPlatforms.length * 30;

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/business" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Marketing Plan</h1>
            <p className="text-gray-500 text-xs">1000-member growth roadmap + AI content calendar</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Users size={13} className="text-yellow-400" />
          <span className="text-yellow-400 font-bold">Target: 1,000 members</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 bg-gray-900/50 px-4">
        <button onClick={() => setTab("growth")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${tab === "growth" ? "border-yellow-500 text-yellow-300" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
          🎯 1000 Members Plan
        </button>
        <button onClick={() => setTab("calendar")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${tab === "calendar" ? "border-purple-500 text-purple-300" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
          📅 30-Day Content Calendar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "growth" && <GrowthPlanTab />}

        {tab === "calendar" && (
          <>
            <div className="px-6 py-6 border-b border-gray-800 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {WEEK_THEMES.map((t, i) => (
                  <div key={i} className="rounded-xl p-3 border" style={{ backgroundColor: t.color + "10", borderColor: t.color + "30" }}>
                    <div className="text-xs font-bold mb-1" style={{ color: t.color }}>Week {i + 1}</div>
                    <div className="text-white text-sm font-semibold leading-tight">{t.theme}</div>
                    <div className="text-gray-500 text-xs mt-1">{t.desc}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
                    <Users size={12} /> Platforms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map(p => (
                      <button key={p.id} onClick={() => togglePlatform(p.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${
                          selectedPlatforms.includes(p.id) ? "text-white border-transparent" : "text-gray-500 border-gray-700 hover:border-gray-500"
                        }`}
                        style={selectedPlatforms.includes(p.id) ? { backgroundColor: p.color + "25", borderColor: p.color } : {}}>
                        <span>{p.emoji}</span>
                        <span className="font-medium">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
                    <Target size={12} /> Objectives
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {OBJECTIVES.map(o => (
                      <button key={o.id} onClick={() => toggleObjective(o.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${
                          selectedObjectives.includes(o.id)
                            ? "bg-purple-900/30 border-purple-600 text-purple-300"
                            : "text-gray-500 border-gray-700 hover:border-gray-500"
                        }`}>
                        <span>{o.icon}</span><span className="font-medium">{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={handleGenerate} disabled={loading || selectedPlatforms.length === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  {loading ? `Generating… (${progress.done}/${progress.total})` : `Generate ${totalPosts}-Post Calendar`}
                </button>
                {loading && <p className="text-xs text-gray-500">{progress.done} of {progress.total} batches done — posts appear as they generate…</p>}
                {generated && !loading && (
                  <p className="text-xs text-green-400 flex items-center gap-1.5"><Check size={12} /> {posts.length} posts generated</p>
                )}
              </div>
            </div>

            {posts.length > 0 && (
              <div className="px-6 py-6 space-y-4 max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign size={16} className="text-green-400" />
                  <h2 className="text-white font-bold text-lg">Your 30-Day Content Calendar</h2>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">{posts.length} posts ready</span>
                </div>
                {[1, 2, 3, 4].map(w => (
                  <WeekSection key={w} week={w} posts={posts} />
                ))}
              </div>
            )}

            {!loading && !generated && (
              <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                <div className="text-5xl mb-4">📅</div>
                <h2 className="text-white font-bold text-xl mb-2">Ready to generate your calendar</h2>
                <p className="text-gray-500 text-sm max-w-md">Select your target platforms and objectives above, then click Generate. AI will create {totalPosts} fully-written, platform-optimized posts across 4 strategic weekly themes.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}