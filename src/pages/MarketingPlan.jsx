import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Copy, Check, Loader2, ChevronDown, ChevronUp, Calendar, Target, DollarSign, Users } from "lucide-react";
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

function WeekSection({ week, posts, selectedPlatforms }) {
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

export default function MarketingPlan() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(["linkedin", "twitter", "instagram"]);
  const [selectedObjectives, setSelectedObjectives] = useState(["investors", "courses"]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const togglePlatform = (id) => setSelectedPlatforms(prev =>
    prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
  );
  const toggleObjective = (id) => setSelectedObjectives(prev =>
    prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
  );

  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setPosts([]);
    setGenerated(false);
    setProgress(0);

    const platformList = PLATFORMS.filter(p => selectedPlatforms.includes(p.id));
    const objectiveList = OBJECTIVES.filter(o => selectedObjectives.includes(o.id));
    const allPosts = [];

    for (let weekNum = 1; weekNum <= 4; weekNum++) {
      const theme = WEEK_THEMES[weekNum - 1];
      const dayStart = (weekNum - 1) * 7 + 1;
      const dayEnd = weekNum === 4 ? 30 : weekNum * 7;

      const prompt = `You are a world-class content strategist for deep tech and alternative energy marketing.

BRAND: Bearden Scalar EM Research Platform — "The suppressed physics that changes everything"
PRODUCTS: Video courses ($147-$397), PDF books ($19-$67), Invention kits ($89)
PLATFORMS: ${platformList.map(p => p.label + " (" + p.goal + ")").join(", ")}
OBJECTIVES: ${objectiveList.map(o => o.label).join("; ")}

Generate posts for WEEK ${weekNum} ONLY (Days ${dayStart}-${dayEnd}).
Week theme: "${theme.theme}" — ${theme.desc}

Create exactly one post per platform per day for days ${dayStart} through ${dayEnd}.
That is ${selectedPlatforms.length} posts per day × ${dayEnd - dayStart + 1} days = ${selectedPlatforms.length * (dayEnd - dayStart + 1)} total posts.

Platform guidelines:
- linkedin: professional, 100-150 words, investor/thought-leader tone
- twitter: 1-2 punchy sentences, hashtags #ScalarEM #Bearden #FreeEnergy
- instagram: emoji-rich, 3-4 sentences + hashtags
- tiktok: hook (first 3 seconds) + 3 talking points
- youtube: video title + 2-sentence description + thumbnail concept
- facebook: conversational, question-based, 2 paragraphs

Return JSON: {"posts": [{"day": number, "week": ${weekNum}, "platform": string, "content": string}]}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: "gpt_5",
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

      allPosts.push(...(result?.posts || []));
      setProgress(weekNum);
      setPosts([...allPosts]);
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
            <h1 className="text-white font-bold text-lg tracking-tight">30-Day Marketing Plan</h1>
            <p className="text-gray-500 text-xs">AI-generated social media content calendar — investors, courses & digital products</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <Calendar size={13} /><span>{totalPosts} posts across {selectedPlatforms.length} platforms</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Config */}
        <div className="px-6 py-6 border-b border-gray-800 space-y-6">

          {/* Week themes overview */}
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
            {/* Platform selection */}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
                <Users size={12} /> Platforms
              </p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${
                      selectedPlatforms.includes(p.id) ? "text-white border-transparent" : "text-gray-500 border-gray-700 hover:border-gray-500"
                    }`}
                    style={selectedPlatforms.includes(p.id) ? { backgroundColor: p.color + "25", borderColor: p.color } : {}}
                  >
                    <span>{p.emoji}</span>
                    <span className="font-medium">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Objective selection */}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
                <Target size={12} /> Objectives
              </p>
              <div className="flex flex-wrap gap-2">
                {OBJECTIVES.map(o => (
                  <button
                    key={o.id}
                    onClick={() => toggleObjective(o.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${
                      selectedObjectives.includes(o.id)
                        ? "bg-purple-900/30 border-purple-600 text-purple-300"
                        : "text-gray-500 border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <span>{o.icon}</span><span className="font-medium">{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={loading || selectedPlatforms.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              {loading ? `Generating week ${progress + 1} of 4…` : `Generate ${totalPosts}-Post Calendar`}
            </button>
            {loading && (
              <p className="text-xs text-gray-500">Generating week by week (4 calls) — {progress}/4 weeks done…</p>
            )}
            {generated && !loading && (
              <p className="text-xs text-green-400 flex items-center gap-1.5">
                <Check size={12} /> {posts.length} posts generated
              </p>
            )}
          </div>
        </div>

        {/* Generated content */}
        {posts.length > 0 && (
          <div className="px-6 py-6 space-y-4 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign size={16} className="text-green-400" />
              <h2 className="text-white font-bold text-lg">Your 30-Day Content Calendar</h2>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">{posts.length} posts ready</span>
            </div>
            {[1, 2, 3, 4].map(w => (
              <WeekSection key={w} week={w} posts={posts} selectedPlatforms={selectedPlatforms} />
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
      </div>
    </div>
  );
}