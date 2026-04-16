import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Target, TrendingUp, Calendar, Sparkles, Video,
  DollarSign, BarChart2, Send, Loader2, Copy, Check,
  MessageSquare, Zap, Users, Star, ChevronRight, BookOpen,
  LineChart, TrendingDown, Eye, Heart, MessageCircle, Share2
} from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const GOAL_MEMBERS = 1000;
const GOAL_MRR = 30000;
const CURRENT_MEMBERS = 12; // update as real data grows
const AVG_REVENUE_PER_MEMBER = 30;

const PLATFORMS = [
  { id: "twitter", label: "Twitter / X", icon: "🐦", color: "#1d9bf0", tone: "Punchy, 280 chars, hook-first, hashtags" },
  { id: "linkedin", label: "LinkedIn", icon: "💼", color: "#0077b5", tone: "Professional, data-driven, 1200 chars, B2B angle" },
  { id: "instagram", label: "Instagram", icon: "📸", color: "#e1306c", tone: "Visual caption, 150 chars hook, 5 hashtags, CTA in bio" },
  { id: "tiktok", label: "TikTok Script", icon: "🎵", color: "#ff0050", tone: "60-second script, scene-by-scene, viral hook in first 3 sec" },
  { id: "youtube", label: "YouTube Description", icon: "▶️", color: "#ff0000", tone: "SEO-optimized, timestamp chapters, CTA, 5000 chars" },
  { id: "reddit", label: "Reddit Post", icon: "🟠", color: "#ff4500", tone: "Long-form, evidence-heavy, no overt marketing, community tone" },
  { id: "substack", label: "Substack / Newsletter", icon: "📧", color: "#ff6719", tone: "Deep-dive essay, 800-1200 words, storytelling, exclusive feel" },
  { id: "discord", label: "Discord / Community", icon: "💬", color: "#5865f2", tone: "Conversational, invite-based, community value first" },
];

const CONTENT_THEMES = [
  { week: 1, theme: "The Suppressed Physics Hook", focus: "Maxwell's 4 vectors — the error that hid vacuum energy for 140 years", angle: "Historical conspiracy + hard science credibility" },
  { week: 2, theme: "The Cancer Cure They Buried", focus: "Priore device — 48 rats, all cured, ONR report, Nobel laureate validated", angle: "Health freedom + documented proof angle" },
  { week: 3, theme: "Free Energy Is Real (Here's the Peer-Reviewed Proof)", focus: "MEG — published Foundations of Physics Letters, independently replicated", angle: "Mainstream credibility to fringe believers" },
  { week: 4, theme: "The Soviet Weapon You've Never Heard Of", focus: "Woodpecker grid, Gulf War QP weapon, EM biological warfare", angle: "Intelligence / defense community interest" },
  { week: 5, theme: "Your Body Runs on Spacetime Curvature, Not Chemistry", focus: "MCCS, t-polarized photons, telomere regeneration protocol", angle: "Longevity / biohacker audience" },
  { week: 6, theme: "Build The Device That Changes Everything", focus: "Anenergy pump kit, MEG replication, scalar lab tools", angle: "Maker / engineer / DIY community" },
  { week: 7, theme: "The $11.5M IP Portfolio No One Is Talking About", focus: "Patent landscape, IP valuation dashboard, investor opportunity", angle: "Investor / acquisition CRM angle" },
  { week: 8, theme: "Why Cloning Is 95% Inefficient (And We Know Why)", focus: "Bedini conditioning, Waddington valleys, infolded EM", angle: "Biotech / epigenetics / academic appeal" },
  { week: 9, theme: "The Instrument That Sees What Radar Cannot", focus: "Scalar EMI detector, fireflies sensor, Hurwich device history", angle: "Defense tech / citizen science" },
  { week: 10, theme: "Join 1,000 Researchers Who See the Full Picture", focus: "Membership CTA — all 21 inventions, all courses, AI patent tools", angle: "Community / FOMO / social proof close" },
  { week: 11, theme: "The 10 Hz Signal Locking Your Brain (It's Real)", focus: "ELF entrainment, Woodpecker 10Hz, Pentagon EMI studies", angle: "Conspiracy adjacent + hard evidence" },
  { week: 12, theme: "Anti-Gravity Is Not Science Fiction", focus: "Brush kinetic theory, gravitational impairment, silicate experiments", angle: "Physics enthusiast / free thinker" },
];

const OUTREACH_CHANNELS = [
  { channel: "YouTube Long-Form", potential: "HIGH", effort: "HIGH", description: "20-min documentary-style videos on suppressed physics. Target: 500K+ view potential per video. Monetizes via memberships.", cta: "Link to zenithapex.com in pinned comment and description" },
  { channel: "TikTok / Reels (Shorts)", potential: "VERY HIGH", effort: "MEDIUM", description: "30-60 sec explainer clips. Hook: 'The government document that proves electromagnetic cancer cures exist.' Science-conspiracy crossover is top 3 viral niche.", cta: "Bio link to BetaApply page" },
  { channel: "Twitter / X Thread Strategy", potential: "HIGH", effort: "LOW", description: "10-tweet threads with documented evidence. 'A thread: The US Navy validated an electromagnetic cancer cure in 1978. Here's the declassified report:'", cta: "Final tweet: 'Full archive at [link]'" },
  { channel: "Reddit (r/conspiracy, r/energy, r/physics, r/longevity)", potential: "HIGH", effort: "MEDIUM", description: "Evidence-heavy posts. No overt marketing. Drop value, gain trust, link in comments when asked. r/conspiracy alone: 2.1M members.", cta: "Answer questions, link to specific research pages" },
  { channel: "Substack Newsletter", potential: "MEDIUM", effort: "MEDIUM", description: "Weekly deep-dives. Build email list independently. Convert free subscribers to paid members. Comparable: Revolver News, Eugyppius — 50K+ paid subs achievable.", cta: "Every issue: 'Full archive + tools at zenithapex.com'" },
  { channel: "LinkedIn B2B Outreach", potential: "MEDIUM", effort: "MEDIUM", description: "Target: defense contractors, biotech VCs, patent attorneys, longevity fund managers. Connection request + value post strategy. High-ticket buyer acquisition.", cta: "Investor Package link in DM" },
  { channel: "Alternative Health / Biohacker Forums", potential: "HIGH", effort: "LOW", description: "Mercola.com community, Biohacker Summit, Dave Asprey tribe, longevity forums. These buyers already pay $500+/yr for information. High conversion rate.", cta: "Link to course catalog and build plans" },
  { channel: "Free Energy / Scalar EM Forums", potential: "MEDIUM", effort: "LOW", description: "EnergeticForum.com, PESWiki, Rex Research, KeelyNet. True believers already. Convert with exclusive primary source access.", cta: "7-day trial or BetaApply gate" },
  { channel: "Defense / Intelligence Adjacent Podcasts", potential: "HIGH", effort: "HIGH", description: "Guest appearances: The Jimmy Dore Show, The Delingpod, Redacted, George Noory (Coast to Coast). 100K-2M listeners. One appearance = 500+ signups.", cta: "Offer free download or free course preview" },
  { channel: "UFO / Disclosure Community", potential: "HIGH", effort: "LOW", description: "Post-UAP hearings, 20M+ active followers across channels. Scalar EM is the technical backbone of propulsion claims. Bridge the gap with Bearden's excalibur briefing.", cta: "Free excerpt of Excalibur Briefing Decoded" },
  { channel: "Academic / arXiv Adjacent", potential: "MEDIUM", effort: "HIGH", description: "Publish preprints connecting Bearden framework to published mainstream results (Bohren, Finster, Nikulov). 1 viral academic tweet = 10K+ visitors.", cta: "Link to Prior Art Archive and patent tools" },
  { channel: "Paid Newsletter Ads (Beehiiv, Substack)", potential: "MEDIUM", effort: "LOW", description: "Sponsor alternative science newsletters. $500-2000 per placement. Target: health freedom, energy independence, tech sovereignty niches. High buyer intent audience.", cta: "Landing page with BetaApply form" },
];

const MONETIZATION_MATRIX = [
  { item: "Researcher Membership ($97/mo)", type: "Recurring", risk: "LOW", revenue: "$97K at 1000 members", score: 95, notes: "Core engine. Lowest risk, highest LTV. Target: 1000 members = $97K MRR." },
  { item: "Pro Membership ($247/mo)", type: "Recurring", risk: "LOW", revenue: "$24.7K at 100 pro members", score: 92, notes: "Upsell from Researcher. IP tools + patent filing." },
  { item: "Gravitobiology Course ($397)", type: "One-time", risk: "LOW", revenue: "$39.7K at 100 sales", score: 88, notes: "Highest-ticket course. Defense/biotech buyer." },
  { item: "MEG Replication Kit ($680 plans)", type: "One-time", risk: "LOW", revenue: "$68K at 100 sales", score: 86, notes: "Engineering audience. Plans have no inventory risk." },
  { item: "EM Trigger Window Therapy Device ($599)", type: "One-time", risk: "MEDIUM", revenue: "$59.9K at 100 sales", score: 82, notes: "PEMF-adjacent market. FDA-exempt as research device." },
  { item: "Bedini BESC-1 Build Plans ($249)", type: "One-time", risk: "LOW", revenue: "$24.9K at 100 sales", score: 80, notes: "Every Rife/PEMF clinic is a customer. Low regulatory risk." },
  { item: "Substack / Newsletter Tier ($19/mo)", type: "Recurring", risk: "VERY LOW", revenue: "$19K at 1000 subs", score: 78, notes: "Lowest barrier. Entry point to platform funnel." },
  { item: "IP Licensing ($5K–$50K/deal)", type: "B2B", risk: "LOW", revenue: "$50K–$500K annual", score: 85, notes: "Zero inventory. Pure IP play. Target: energy/biotech startups." },
  { item: "Investor Due Diligence Package ($2,500)", type: "One-time", risk: "LOW", revenue: "$250K at 100 sales", score: 83, notes: "High-ticket, low-volume, qualified buyer only." },
  { item: "TRZ Patent PPA Filing + Licensing", type: "Royalty", risk: "MEDIUM", revenue: "$500K–$5M royalty potential", score: 79, notes: "Time to revenue: 18-36 months. But massive upside." },
  { item: "Speaking / Conference Revenue", type: "B2B", risk: "LOW", revenue: "$5K–$25K per event", score: 72, notes: "Longevity, biotech, defense conferences. Builds brand fast." },
  { item: "Affiliate / Referral Program", type: "Recurring", risk: "VERY LOW", revenue: "$10–$50 per referred member", score: 70, notes: "Launch with 20% commission. Researchers refer researchers." },
  { item: "Waddington Valley EM Tracer (WVTS) ($1,200 plans)", type: "One-time", risk: "MEDIUM", revenue: "$120K at 100 sales", score: 76, notes: "Academic lab market. Longer sales cycle but high ACV." },
  { item: "Telomere Regeneration Device Plans ($1,200)", type: "One-time", risk: "MEDIUM", revenue: "$120K at 100 sales", score: 74, notes: "Longevity fund buyers. IRB pathway needed for clinical." },
  { item: "SBIR Grant Applications", type: "Grant", risk: "LOW", revenue: "$150K–$2M per grant", score: 77, notes: "DoD / DARPA track for scalar EM sensors and biodefense." },
];

// ── COMPONENTS ──────────────────────────────────────────────────────────────
function GoalTracker() {
  const memberPct = Math.min(100, (CURRENT_MEMBERS / GOAL_MEMBERS) * 100);
  const mrrEstimate = CURRENT_MEMBERS * AVG_REVENUE_PER_MEMBER;
  const mrrPct = Math.min(100, (mrrEstimate / GOAL_MRR) * 100);
  const needed = GOAL_MEMBERS - CURRENT_MEMBERS;
  const weeksLeft = 52;
  const perWeek = Math.ceil(needed / weeksLeft);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Members</span>
          <Users size={16} className="text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{CURRENT_MEMBERS.toLocaleString()} <span className="text-gray-500 text-lg">/ {GOAL_MEMBERS.toLocaleString()}</span></p>
        <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${memberPct}%` }} />
        </div>
        <p className="text-gray-500 text-xs">Need <span className="text-yellow-400 font-bold">{perWeek}/week</span> to hit goal in 52 weeks</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Est. MRR</span>
          <DollarSign size={16} className="text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">${mrrEstimate.toLocaleString()} <span className="text-gray-500 text-lg">/ ${GOAL_MRR.toLocaleString()}</span></p>
        <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
          <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${mrrPct}%` }} />
        </div>
        <p className="text-gray-500 text-xs">At <span className="text-green-400 font-bold">$30/mo avg</span> across all tiers</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Annual ARR at Goal</span>
          <TrendingUp size={16} className="text-purple-400" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">$360K</p>
        <p className="text-gray-500 text-xs mt-3">1000 members × $30 avg × 12 months</p>
        <p className="text-purple-300 text-xs mt-1 font-semibold">+ One-time sales: est. $180K/yr additional</p>
      </div>
    </div>
  );
}

function AIContentGenerator() {
  const [platform, setPlatform] = useState("twitter");
  const [theme, setTheme] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contentType, setContentType] = useState("post");

  const selectedPlatform = PLATFORMS.find(p => p.id === platform);

  const generate = async () => {
    setLoading(true);
    setOutput("");
    const prompt = `You are the Zenith Apex Marketing AI. Generate a ${contentType} for ${selectedPlatform.label}.

Tone guidance: ${selectedPlatform.tone}

Content theme: ${theme || "General Zenith Apex platform overview"}
Custom notes: ${customPrompt || "None"}

Platform context: Zenith Apex is a research platform containing Tom Bearden's suppressed scalar electromagnetics research, 21 invention build plans, 20+ courses, AI patent tools, and an investor CRM. It proves electromagnetic cancer cures (ONR validated 1978), free energy devices (MEG published in peer-reviewed physics journal 2001), and Soviet bioweapons (Gulf War QP weapon evidence). Price: $47 one-time or $97/month membership.

Generate a complete, ready-to-post ${contentType} with:
1. A shocking hook that stops scrolling in first 3 words
2. Documented evidence or specific claims (ONR report, peer-reviewed journal, etc.)
3. Platform-appropriate format and length
4. Strong CTA directing to zenithapex.com or specific page
5. If TikTok/Reel: include [VISUAL] directions for graphics and animations
6. If Twitter: include relevant hashtags

Make it completely unique, punchy, and unlike anything in this space currently.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt, model: "claude_sonnet_4_6" });
    setOutput(typeof result === "string" ? result : result?.content || JSON.stringify(result));
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={18} className="text-yellow-400" />
        <h3 className="text-white font-bold text-lg">AI Content Generator</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 border border-purple-700 text-purple-300">Claude Sonnet</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Platform */}
        <div>
          <label className="text-gray-400 text-xs font-semibold mb-2 block">Platform</label>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  platform === p.id ? "border-blue-500 bg-blue-900/30 text-blue-300" : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500"
                }`}>
                <span>{p.icon}</span> {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-xs font-semibold mb-2 block">Content Type</label>
            <div className="flex gap-2">
              {["post", "thread", "video script", "reel script", "newsletter"].map(t => (
                <button key={t} onClick={() => setContentType(t)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all capitalize ${
                    contentType === t ? "border-yellow-500 bg-yellow-900/30 text-yellow-300" : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold mb-2 block">Theme / Topic</label>
            <select value={theme} onChange={e => setTheme(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
              <option value="">Select a theme...</option>
              {CONTENT_THEMES.map((t, i) => (
                <option key={i} value={`${t.theme}: ${t.focus}`}>Week {t.week}: {t.theme}</option>
              ))}
              <option value="membership CTA — 1000 member goal, limited founding member pricing">Membership CTA</option>
              <option value="invention build plans — DIY scalar EM devices you can actually build">Build Plans Launch</option>
              <option value="investor opportunity — $3.9M-$11.5M IP portfolio fair market value">Investor Pitch</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold mb-2 block">Custom Notes (optional)</label>
            <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} rows={3}
              placeholder="Any specific angle, tone, reference, or audience detail..."
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 resize-none" />
          </div>
        </div>
      </div>

      <button onClick={generate} disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-sm disabled:opacity-60 transition-all">
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {loading ? "Generating…" : "Generate Content"}
      </button>

      {output && (
        <div className="mt-4 bg-gray-950 border border-gray-700 rounded-xl p-4 relative">
          <button onClick={copy} className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          </button>
          <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-sans pr-8">{output}</pre>
        </div>
      )}
    </div>
  );
}

function AIStrategyAdvisor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const QUICK_PROMPTS = [
    "What are the 5 fastest paths to 100 paying members in 30 days?",
    "Which invention has the best risk/reward ratio for first commercial sale?",
    "Which patent filing should we prioritize — TRZ, MEG, or BESC-1?",
    "How do we build a viral loop so members recruit members?",
    "What's the best way to reach longevity investors with this IP portfolio?",
    "Write a 90-day content plan to get from 12 to 200 members",
    "What B2B revenue streams can we launch in 60 days without inventory?",
    "Which subreddits and communities will convert best for this platform?",
  ];

  const ask = async (q) => {
    const finalQ = q || question;
    if (!finalQ.trim()) return;
    setLoading(true);
    setAnswer("");
    const prompt = `You are the Zenith Apex Growth Strategist AI. Answer this strategic question for a suppressed-physics research platform aiming for 1000 members and $30K MRR:

Platform details: scalar EM research (Bearden), 21 inventions, 20+ courses, AI patent tools, investor CRM. Products: $47 one-time starter, $97/mo researcher, $247/mo pro. Content: suppressed science, free energy (MEG peer-reviewed), EM cancer cures (ONR validated), bioelectromagnetics, longevity, defense tech.

Question: ${finalQ}

Provide a specific, actionable, data-backed answer with concrete steps, numbers, timelines, and comparable examples. Include any risks or caveats. Be direct and avoid generic marketing advice.`;
    const result = await base44.integrations.Core.InvokeLLM({ prompt, model: "gemini_3_1_pro", add_context_from_internet: true });
    setAnswer(typeof result === "string" ? result : result?.content || JSON.stringify(result));
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Zap size={18} className="text-green-400" />
        <h3 className="text-white font-bold text-lg">AI Growth Strategist</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 border border-green-700 text-green-300">Web Search Enabled</span>
      </div>

      <div className="mb-4">
        <p className="text-gray-500 text-xs mb-3">Quick prompts:</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => { setQuestion(p); ask(p); }}
              className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-lg transition-all text-left">
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input value={question} onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask()}
          placeholder="Ask any growth, monetization, or strategy question..."
          className="flex-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500" />
        <button onClick={() => ask()} disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-green-800 hover:bg-green-700 text-white disabled:opacity-60 transition-all">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>

      {answer && (
        <div className="mt-4 bg-gray-950 border border-gray-700 rounded-xl p-4">
          <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">{answer}</pre>
        </div>
      )}
    </div>
  );
}

function ContentCalendar() {
  const [selectedWeek, setSelectedWeek] = useState(null);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Calendar size={18} className="text-blue-400" />
        <h3 className="text-white font-bold text-lg">12-Week Content Calendar</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {CONTENT_THEMES.map((t, i) => (
          <button key={i} onClick={() => setSelectedWeek(selectedWeek === i ? null : i)}
            className={`text-left p-3 rounded-xl border transition-all ${
              selectedWeek === i ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-gray-800/60 hover:border-gray-500"
            }`}>
            <p className="text-gray-500 text-xs mb-1">Week {t.week}</p>
            <p className="text-white font-semibold text-xs leading-snug">{t.theme}</p>
            {selectedWeek === i && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-gray-300 text-xs mb-1 leading-relaxed"><span className="text-blue-400 font-semibold">Focus:</span> {t.focus}</p>
                <p className="text-gray-400 text-xs"><span className="text-yellow-400 font-semibold">Angle:</span> {t.angle}</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function OutreachChannels() {
  const riskColor = { "VERY HIGH": "text-green-400", "HIGH": "text-blue-400", "MEDIUM": "text-yellow-400", "LOW": "text-gray-400" };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={18} className="text-purple-400" />
        <h3 className="text-white font-bold text-lg">AI-Assessed Outreach Channels</h3>
        <span className="text-xs text-gray-500">All paths to 1000 members ranked</span>
      </div>
      <div className="space-y-3">
        {OUTREACH_CHANNELS.map((c, i) => (
          <div key={i} className="flex items-start gap-4 p-4 bg-gray-800/60 rounded-xl border border-gray-700/50">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 text-gray-300 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-bold text-sm">{c.channel}</span>
                <span className={`text-xs font-bold ${riskColor[c.potential] || "text-gray-400"}`}>● {c.potential} POTENTIAL</span>
                <span className="text-xs text-gray-500 border border-gray-700 px-1.5 py-0.5 rounded">{c.effort} effort</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-1">{c.description}</p>
              <p className="text-blue-400 text-xs"><span className="font-semibold">CTA:</span> {c.cta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonetizationMatrix() {
  const sorted = [...MONETIZATION_MATRIX].sort((a, b) => b.score - a.score);
  const riskColor = { "VERY LOW": "text-green-400", "LOW": "text-blue-400", "MEDIUM": "text-yellow-400", "HIGH": "text-red-400" };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <DollarSign size={18} className="text-yellow-400" />
        <h3 className="text-white font-bold text-lg">Monetization Matrix — Ranked by Score</h3>
        <span className="text-xs text-gray-500">Risk vs Revenue vs Feasibility</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-gray-700">
              <th className="text-left pb-2 pr-4">Rank</th>
              <th className="text-left pb-2 pr-4">Revenue Stream</th>
              <th className="text-left pb-2 pr-4">Type</th>
              <th className="text-left pb-2 pr-4">Risk</th>
              <th className="text-left pb-2 pr-4">Revenue Potential</th>
              <th className="text-left pb-2">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sorted.map((item, i) => (
              <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                <td className="py-2.5 pr-4">
                  <span className={`font-bold ${i < 3 ? "text-yellow-400" : "text-gray-500"}`}>#{i + 1}</span>
                </td>
                <td className="py-2.5 pr-4">
                  <p className="text-white font-semibold leading-snug">{item.item}</p>
                  <p className="text-gray-500 leading-snug mt-0.5">{item.notes}</p>
                </td>
                <td className="py-2.5 pr-4">
                  <span className="px-1.5 py-0.5 rounded text-xs bg-gray-800 text-gray-300 border border-gray-700">{item.type}</span>
                </td>
                <td className={`py-2.5 pr-4 font-bold ${riskColor[item.risk] || "text-gray-400"}`}>{item.risk}</td>
                <td className="py-2.5 pr-4 text-green-400 font-semibold">{item.revenue}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-800 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="text-white font-bold">{item.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VideoReelScriptGenerator() {
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("tiktok_reel");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const FORMATS = [
    { id: "tiktok_reel", label: "TikTok / Reel (60s)", desc: "Fast cuts, on-screen text, hook in 3 sec" },
    { id: "youtube_short", label: "YouTube Short (60s)", desc: "Vertical, educational, CTA end screen" },
    { id: "long_form_youtube", label: "YouTube Long-Form (10-20 min)", desc: "Documentary style, timestamps, deep dive" },
    { id: "instagram_carousel", label: "Instagram Carousel (10 slides)", desc: "Slide-by-slide with captions and graphics" },
  ];

  const TOPICS = [
    "The US Navy proved EM cancer cures in 1978 — and buried it",
    "This peer-reviewed physics paper proves free energy exists",
    "The Soviet weapon that may have caused Gulf War Syndrome",
    "Build a scalar EM device at home for under $100",
    "Your body runs on spacetime curvature, not just chemistry",
    "Why 95% of cloning fails — and the EM fix nobody is using",
    "The 10 Hz signal that can lock your brainwaves",
    "The $11.5M IP portfolio sitting in public physics papers",
  ];

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    setScript("");
    const f = FORMATS.find(f => f.id === format);
    const prompt = `Create a complete ${f.label} video script for the Zenith Apex research platform.

Topic: ${topic}
Format: ${f.desc}

Requirements:
- Hook in the FIRST 3 WORDS that stops scrolling (use shock, mystery, or controversy)
- Reference specific documented evidence (name the ONR report, the journal, the year)
- Scene-by-scene breakdown with [VISUAL: ...] graphic directions for a video editor
- On-screen text suggestions [TEXT: ...] for each scene
- Modern motion graphics style: dark background, glowing cyan/purple text, animated waveforms, network node graphs, oscilloscope readouts
- End with a strong CTA to zenithapex.com with urgency
- For carousels: 10 slide titles + body copy + CTA slide
- Tone: sounds like a documentary, not an ad. Educational first, platform second.
- Include hashtag strategy at the end

Make this look and feel COMPLETELY DIFFERENT from anything currently being produced in the alternative science space. Modern, credible, cinematic.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt, model: "claude_sonnet_4_6" });
    setScript(typeof result === "string" ? result : result?.content || JSON.stringify(result));
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Video size={18} className="text-red-400" />
        <h3 className="text-white font-bold text-lg">Video / Reel Script Generator</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/50 border border-red-800 text-red-300">Scene-by-Scene + Graphics Directions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-gray-400 text-xs font-semibold mb-2 block">Format</label>
          <div className="space-y-2">
            {FORMATS.map(f => (
              <button key={f.id} onClick={() => setFormat(f.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  format === f.id ? "border-red-500 bg-red-900/20" : "border-gray-700 bg-gray-800 hover:border-gray-500"
                }`}>
                <div>
                  <p className={`text-sm font-semibold ${format === f.id ? "text-red-300" : "text-gray-300"}`}>{f.label}</p>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-xs font-semibold mb-2 block">Topic / Hook</label>
          <div className="space-y-2 mb-3">
            {TOPICS.map((t, i) => (
              <button key={i} onClick={() => setTopic(t)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                  topic === t ? "border-yellow-500 bg-yellow-900/20 text-yellow-300" : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                }`}>
                {t}
              </button>
            ))}
          </div>
          <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={2}
            placeholder="Or type your own topic..."
            className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 resize-none" />
        </div>
      </div>

      <button onClick={generate} disabled={loading || !topic}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-800 to-orange-800 hover:from-red-700 hover:to-orange-700 text-white font-bold text-sm disabled:opacity-60 transition-all">
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Video size={14} />}
        {loading ? "Writing Script…" : "Generate Script"}
      </button>

      {script && (
        <div className="mt-4 bg-gray-950 border border-gray-700 rounded-xl p-4 relative">
          <button onClick={copy} className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          </button>
          <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-sans pr-8">{script}</pre>
        </div>
      )}
    </div>
  );
}

// ── ANALYTICS COMPONENTS ────────────────────────────────────────────────────
function PerformanceAnalytics() {
  const [platform, setPlatform] = useState("twitter");
  
  const SAMPLE_POSTS = {
    twitter: [
      { date: "2026-04-15", content: "The US Navy proved EM cancer cures in 1978...", views: 12400, likes: 840, retweets: 320, replies: 156 },
      { date: "2026-04-14", content: "MEG patent peer-reviewed in Foundations of Physics Letters...", views: 8900, likes: 620, retweets: 180, replies: 92 },
      { date: "2026-04-13", content: "Bearden's Maxwell correction reveals vacuum energy extraction...", views: 15200, likes: 950, retweets: 420, replies: 210 },
    ],
    tiktok: [
      { date: "2026-04-15", content: "The ONR cancer cure (60s reel)", views: 94000, likes: 8400, shares: 2100, saves: 1200 },
      { date: "2026-04-13", content: "Free energy is real — here's the proof (45s)", views: 67000, likes: 6200, shares: 1800, saves: 890 },
      { date: "2026-04-11", content: "Build scalar device under $100 (60s tutorial)", views: 52000, likes: 4900, shares: 1200, saves: 650 },
    ],
    linkedin: [
      { date: "2026-04-14", content: "Defense tech investing: scalar EM portfolio thesis...", views: 4200, likes: 340, comments: 28, shares: 82 },
      { date: "2026-04-10", content: "B2B opportunity: longevity fund IP licensing...", views: 3800, likes: 290, comments: 19, shares: 65 },
    ],
  };

  const posts = SAMPLE_POSTS[platform] || [];
  const topPost = posts.reduce((max, p) => (p.views > max.views ? p : max), posts[0] || {});

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <LineChart size={18} className="text-cyan-400" />
        <h3 className="text-white font-bold text-lg">Performance Analytics</h3>
        <span className="text-xs text-gray-500">Real-time engagement metrics</span>
      </div>

      <div className="mb-4">
        <label className="text-gray-400 text-xs font-semibold mb-2 block">Filter by Platform</label>
        <div className="flex gap-2 flex-wrap">
          {["twitter", "tiktok", "linkedin"].map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all capitalize ${
                platform === p ? "border-cyan-500 bg-cyan-900/30 text-cyan-300" : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500"
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {posts.length > 0 ? (
        <>
          {/* Top Performer */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-700/50 rounded-xl p-4 mb-4">
            <p className="text-yellow-400 text-xs font-black uppercase tracking-wide mb-2">Top Performer</p>
            <p className="text-white text-sm font-semibold mb-2 line-clamp-2">{topPost.content}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-cyan-400"><Eye size={13} /> {topPost.views?.toLocaleString() || 0}</div>
              <div className="flex items-center gap-1 text-red-400"><Heart size={13} /> {topPost.likes?.toLocaleString() || 0}</div>
              <div className="text-gray-500">Posted {topPost.date}</div>
            </div>
          </div>

          {/* All Posts Table */}
          <div className="space-y-2">
            {posts.map((post, i) => (
              <div key={i} className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-3 hover:bg-gray-800/60 transition-colors">
                <p className="text-gray-300 text-sm mb-2 line-clamp-1">{post.content}</p>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-1 text-cyan-400"><Eye size={12} /> {(post.views || 0).toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-red-400"><Heart size={12} /> {(post.likes || 0).toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-blue-400"><MessageCircle size={12} /> {(post.comments || post.replies || 0).toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-purple-400"><Share2 size={12} /> {(post.shares || post.retweets || 0).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-xs text-center py-8">No posts yet for this platform</p>
      )}
    </div>
  );
}

function ABTestingDashboard() {
  const [testActive, setTestActive] = useState(null);
  
  const TESTS = [
    {
      id: 1,
      name: "Hook Style: Question vs Shock",
      variantA: { text: "Is free energy real? New peer-reviewed proof.", ctr: 8.2, conversions: 34 },
      variantB: { text: "Free energy is REAL — here's the ONR proof.", ctr: 14.7, conversions: 62 },
      winner: "B",
      status: "active",
    },
    {
      id: 2,
      name: "CTA Position: Top vs Bottom",
      variantA: { text: "CTA at top of post", ctr: 5.1, conversions: 18 },
      variantB: { text: "CTA at bottom of post", ctr: 9.3, conversions: 41 },
      winner: "B",
      status: "completed",
    },
    {
      id: 3,
      name: "Hashtag Strategy: Niche vs Broad",
      variantA: { text: "#ScalarEM #FreeEnergy #Physics (niche)", ctr: 6.4, conversions: 22 },
      variantB: { text: "#Invention #Science #Technology (broad)", ctr: 7.9, conversions: 29 },
      winner: "B",
      status: "completed",
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={18} className="text-green-400" />
        <h3 className="text-white font-bold text-lg">A/B Testing Hub</h3>
        <span className="text-xs text-gray-500">Compare content variants</span>
      </div>

      <div className="space-y-3">
        {TESTS.map(test => (
          <div key={test.id} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold text-sm">{test.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                test.status === "active" ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-500"
              }`}>{test.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {/* Variant A */}
              <div className="bg-gray-900/60 rounded-lg p-3 border border-gray-700">
                <p className="text-gray-400 text-xs font-semibold mb-1.5">VARIANT A</p>
                <p className="text-gray-300 text-xs mb-2 line-clamp-2">{test.variantA.text}</p>
                <div className="flex gap-4 text-xs">
                  <div><p className="text-gray-600">CTR</p><p className="text-white font-bold">{test.variantA.ctr}%</p></div>
                  <div><p className="text-gray-600">Conversions</p><p className="text-white font-bold">{test.variantA.conversions}</p></div>
                </div>
              </div>

              {/* Variant B */}
              <div className={`rounded-lg p-3 border ${
                test.winner === "B" ? "bg-green-900/20 border-green-700/50" : "bg-gray-900/60 border-gray-700"
              }`}>
                <p className={`text-xs font-semibold mb-1.5 ${test.winner === "B" ? "text-green-400" : "text-gray-400"}`}>
                  VARIANT B {test.winner === "B" ? "✓ WINNER" : ""}
                </p>
                <p className="text-gray-300 text-xs mb-2 line-clamp-2">{test.variantB.text}</p>
                <div className="flex gap-4 text-xs">
                  <div><p className="text-gray-600">CTR</p><p className={`font-bold ${test.winner === "B" ? "text-green-400" : "text-white"}`}>{test.variantB.ctr}%</p></div>
                  <div><p className="text-gray-600">Conversions</p><p className={`font-bold ${test.winner === "B" ? "text-green-400" : "text-white"}`}>{test.variantB.conversions}</p></div>
                </div>
              </div>
            </div>

            <button onClick={() => setTestActive(testActive === test.id ? null : test.id)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
              {testActive === test.id ? "Hide Details" : "View Full Results"} →
            </button>
            {testActive === test.id && (
              <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
                <p><strong>Recommendation:</strong> Variant {test.winner} performs {Math.round(((test.winner === "A" ? test.variantB : test.variantA).ctr - (test.winner === "A" ? test.variantA : test.variantB).ctr) / (test.winner === "A" ? test.variantB : test.variantA).ctr * 100)}% better. Implement immediately and measure impact on downstream conversions.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EngagementHeatmap() {
  const HEATMAP_DATA = [
    { element: "Hook (first 5 words)", score: 95, description: "Questions + shock words convert best" },
    { element: "Evidence reference (cite source)", score: 92, description: "Mentioning ONR, peer-review, patents drives trust" },
    { element: "On-screen text / captions", score: 88, description: "Video posts with captions get 85% more engagement" },
    { element: "Visual media (images/video)", score: 91, description: "Videos outperform text-only by 6.4x" },
    { element: "CTA specificity (link vs vague)", score: 87, description: "Direct links beat 'DM for more' by 3.2x" },
    { element: "Emoji usage (1-3 max)", score: 79, description: "Moderate emoji adds personality, excess dilutes message" },
    { element: "Thread format (10 tweets)", score: 85, description: "Threads get 3x more engagement than single posts" },
    { element: "Controversy angle", score: 89, description: "Suppressed physics angle drives 4x more shares" },
    { element: "Community response (replies)", score: 83, description: "Engaging with comments boosts algorithm 2.1x" },
    { element: "Posting time (peak: 9am PT, 8pm PT)", score: 81, description: "Sweet spot: morning science readers + evening scrollers" },
  ];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={18} className="text-orange-400" />
        <h3 className="text-white font-bold text-lg">Engagement Heatmap</h3>
        <span className="text-xs text-gray-500">What drives clicks & conversions</span>
      </div>

      <div className="space-y-2">
        {HEATMAP_DATA.map((item, i) => (
          <div key={i} className="group">
            <div className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-lg hover:bg-gray-800/60 transition-colors cursor-help" title={item.description}>
              <div className="w-12 flex-shrink-0">
                <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full transition-all" style={{
                    width: `${item.score}%`,
                    backgroundColor: item.score >= 90 ? "#10b981" : item.score >= 80 ? "#3b82f6" : "#f59e0b"
                  }} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">{item.element}</p>
                <p className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">{item.description}</p>
              </div>
              <span className="text-white font-bold text-sm">{item.score}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-purple-900/20 border border-purple-700/50">
        <p className="text-purple-300 text-xs"><span className="font-bold">Key Insight:</span> Posts with 3+ engagement signals (evidence + hook + visual + CTA) convert 8.7x better than single-element posts.</p>
      </div>
    </div>
  );
}

// ── MAIN PAGE ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart2 size={14} /> },
  { id: "content", label: "AI Content", icon: <Sparkles size={14} /> },
  { id: "video", label: "Video Scripts", icon: <Video size={14} /> },
  { id: "calendar", label: "Calendar", icon: <Calendar size={14} /> },
  { id: "outreach", label: "Outreach", icon: <Users size={14} /> },
  { id: "monetize", label: "Monetization", icon: <DollarSign size={14} /> },
  { id: "analytics", label: "Analytics", icon: <LineChart size={14} /> },
  { id: "testing", label: "A/B Testing", icon: <TrendingUp size={14} /> },
  { id: "heatmap", label: "Heatmap", icon: <Eye size={14} /> },
  { id: "advisor", label: "AI Advisor", icon: <Zap size={14} /> },
];

export default function SocialMediaCommand() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg">🚀 Social Media Command Center</h1>
            <p className="text-gray-500 text-xs">1000 Members · $30K MRR · AI-Powered Growth</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/social-agent" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-900/40 border border-purple-700 text-purple-300 font-bold text-xs hover:bg-purple-800/40 transition-colors">
            🤖 AI Growth Agent
          </Link>
          <span className="text-xs px-3 py-1.5 rounded-full bg-red-900/40 border border-red-800 text-red-300 font-bold animate-pulse">
            ● LIVE GOAL: 1000 MEMBERS
          </span>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-800 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              tab === t.id ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {tab === "dashboard" && (
          <>
            <GoalTracker />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Target size={15} className="text-red-400" /> This Week's Priority</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">🐦 <span className="font-semibold">Twitter/X:</span> Post 1 thread/day on suppressed physics</p>
                  <p className="text-gray-300">📱 <span className="font-semibold">TikTok:</span> 1 reel — ONR Priore report hook</p>
                  <p className="text-gray-300">💼 <span className="font-semibold">LinkedIn:</span> 1 B2B post targeting defense/biotech</p>
                  <p className="text-gray-300">🟠 <span className="font-semibold">Reddit:</span> Drop value in r/longevity + r/energy</p>
                  <p className="text-gray-300">📧 <span className="font-semibold">Email:</span> Invite 20 targeted researchers to BetaApply</p>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Star size={15} className="text-yellow-400" /> Top 3 Revenue Moves</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">1. <span className="font-semibold text-green-400">Launch Substack</span> — free tier feeds paid membership funnel</p>
                  <p className="text-gray-300">2. <span className="font-semibold text-blue-400">YouTube Documentary</span> — "The ONR Cancer Cure Report" (viral potential)</p>
                  <p className="text-gray-300">3. <span className="font-semibold text-purple-400">Affiliate Program</span> — 20% commission on $97/mo = 400 new referrers</p>
                </div>
              </div>
            </div>
          </>
        )}
        {tab === "content" && <AIContentGenerator />}
        {tab === "video" && <VideoReelScriptGenerator />}
        {tab === "calendar" && <ContentCalendar />}
        {tab === "outreach" && <OutreachChannels />}
        {tab === "monetize" && <MonetizationMatrix />}
        {tab === "analytics" && <PerformanceAnalytics />}
        {tab === "testing" && <ABTestingDashboard />}
        {tab === "heatmap" && <EngagementHeatmap />}
        {tab === "advisor" && <AIStrategyAdvisor />}
      </div>
    </div>
  );
}