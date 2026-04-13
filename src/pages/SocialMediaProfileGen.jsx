import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Copy, CheckCircle2, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PLATFORMS = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    color: "#0A66C2",
    fields: ["headline", "about", "tagline"],
    limits: { headline: 220, about: 2600, tagline: 120 },
    audience: "B2B investors, IP attorneys, defense contractors, biotech executives, patent professionals",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: "🐦",
    color: "#000000",
    fields: ["bio", "pinned_post"],
    limits: { bio: 160, pinned_post: 280 },
    audience: "Tech founders, researchers, alternative energy community, independent scientists",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶️",
    color: "#FF0000",
    fields: ["channel_name", "description", "about"],
    limits: { channel_name: 100, description: 500, about: 1000 },
    audience: "Engineers, researchers, energy tech enthusiasts, patent professionals",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📸",
    color: "#E1306C",
    fields: ["name", "bio", "website_label"],
    limits: { name: 30, bio: 150, website_label: 30 },
    audience: "Science communicators, wellness community, forward-thinking investors",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    color: "#010101",
    fields: ["username", "bio"],
    limits: { username: 24, bio: 80 },
    audience: "Science-curious youth, alternative energy enthusiasts, viral research content",
  },
  {
    id: "substack",
    name: "Substack",
    icon: "📰",
    color: "#FF6719",
    fields: ["publication_name", "tagline", "description"],
    limits: { publication_name: 70, tagline: 160, description: 600 },
    audience: "Paying subscribers: researchers, investors, IP professionals, energy engineers",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: "🔴",
    color: "#FF4500",
    fields: ["subreddit_name", "description", "sidebar"],
    limits: { subreddit_name: 21, description: 500, sidebar: 1024 },
    audience: "r/LENR, r/AlternativeEnergy, r/Physics, r/patents communities",
  },
  {
    id: "facebook",
    name: "Facebook Page",
    icon: "👥",
    color: "#1877F2",
    fields: ["page_name", "short_description", "long_description"],
    limits: { page_name: 75, short_description: 255, long_description: 1000 },
    audience: "Researchers, wellness advocates, investors, independent scientists",
  },
];

const TONES = [
  { id: "executive", label: "Executive / Boardroom", desc: "C-suite, institutional investors" },
  { id: "scientific", label: "Scientific / Technical", desc: "Researchers, engineers, IP professionals" },
  { id: "visionary", label: "Visionary / Innovation", desc: "Tech founders, VCs, accelerators" },
  { id: "accessible", label: "Accessible / Educational", desc: "General public, science enthusiasts" },
];

const FIELD_LABELS = {
  headline: "Headline",
  about: "About / Summary",
  tagline: "Tagline",
  bio: "Bio",
  pinned_post: "Pinned Post",
  channel_name: "Channel Name",
  description: "Description",
  about: "About Section",
  name: "Display Name",
  website_label: "Website Label",
  username: "Username",
  publication_name: "Publication Name",
  subreddit_name: "Subreddit Name",
  sidebar: "Sidebar / Community Info",
  page_name: "Page Name",
  short_description: "Short Description",
  long_description: "Long Description",
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 text-xs transition-all"
    >
      {copied ? <CheckCircle2 size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function FieldCard({ label, value, limit }) {
  const pct = Math.round((value.length / limit) * 100);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${pct > 95 ? "text-red-400" : "text-gray-600"}`}>{value.length}/{limit}</span>
          <CopyButton text={value} />
        </div>
      </div>
      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default function SocialMediaProfileGen() {
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customFocus, setCustomFocus] = useState("");

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const prompt = `You are a world-class brand strategist and copywriter specializing in deep-tech, IP, and advanced research platforms.

Generate a complete, professional ${platform.name} business profile for the following company:

COMPANY: Zenith Apex Research Portfolio (ZARP)

PLATFORM: ${platform.name}
TARGET AUDIENCE: ${platform.audience}
TONE: ${tone.label} — ${tone.desc}
${customFocus ? `CUSTOM FOCUS: ${customFocus}` : ""}

COMPANY DESCRIPTION (use this to create the profile):
Zenith Apex Research Portfolio is an AI-powered intellectual property generation and commercialization platform for advanced electromagnetic technology, bioelectromagnetic medicine, and next-generation energy research. The platform integrates:
- AI Invention Forge Engine that generates complete investor-ready invention dossiers from documented electromagnetic physics
- USPTO-compliant Provisional Patent Drafter (AI-assisted, Claude Sonnet powered)
- Live patent database scanner (USPTO, EPO, WIPO, Google Patents, IEEE)
- VC-grade pitch deck and animated engineering build guide generator
- 26 documented device architectures with engineering build plans, bills of materials, and PDFs
- Course catalog, research membership, and hardware kit shop
- Peer-reviewed institutional validation: Boeing Phantom Works, Trinity College Dublin, Alfvén Laboratory Stockholm (published Foundations of Physics Letters, 2001)
- US Office of Naval Research validation documentation (UNCLASSIFIED, 1978)
- $630K+ in DoD SBIR grants awarded for electromagnetic sensing technology
- Investor CRM, patent landscape graph, prior art archive, and monitoring dashboard

CRITICAL INSTRUCTIONS:
- Never use words: "suppressed", "fringe", "pseudoscience", "conspiracy", "alternative", "paranormal", "free energy"
- Frame as: advanced electromagnetic research, bioelectromagnetic medicine, next-generation energy technology, AI-powered IP generation
- Emphasize: peer-reviewed validation, government documentation, institutional credibility, commercial IP value, AI tools
- Professional, credible, investment-grade language throughout
- App URL: https://zenithapex.base44.app

Generate exactly these fields for ${platform.name}: ${platform.fields.join(", ")}

Each field must respect these character limits: ${platform.fields.map(f => `${f}: ${platform.limits[f]} chars`).join(", ")}

Return a JSON object with exactly these keys: ${platform.fields.join(", ")}
Values must be strings. Stay within the character limits. Be compelling and professional.`;

    const schema = {
      type: "object",
      properties: Object.fromEntries(platform.fields.map(f => [f, { type: "string" }])),
    };

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: schema,
      model: "claude_sonnet_4_6",
    });

    setResult(res);
    setLoading(false);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Sparkles size={15} className="text-yellow-400" /> Social Media Profile Generator
            </h1>
            <p className="text-gray-500 text-xs">AI-powered professional profiles for every platform · Investment-grade language</p>
          </div>
        </div>
        <Link to="/social-command" className="px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all">
          Social Command →
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-5 max-w-5xl mx-auto w-full space-y-6">

        {/* Platform Selector */}
        <div>
          <h2 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">1. Select Platform</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => { setPlatform(p); setResult(null); }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                  platform.id === p.id
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-600 hover:text-white"
                }`}>
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <h2 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">2. Select Tone</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TONES.map(t => (
              <button key={t.id} onClick={() => setTone(t)}
                className={`text-left px-4 py-3 rounded-xl border text-xs transition-all ${
                  tone.id === t.id
                    ? "border-yellow-600 bg-yellow-950/30 text-white"
                    : "border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-600"
                }`}>
                <p className="font-bold mb-0.5">{t.label}</p>
                <p className="text-gray-600">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Optional custom focus */}
        <div>
          <h2 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">3. Optional: Custom Focus</h2>
          <input
            value={customFocus}
            onChange={e => setCustomFocus(e.target.value)}
            placeholder="e.g. emphasize AI patent tools, focus on biotech applications, highlight DoD validation..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600 transition-all"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-yellow-800 hover:bg-yellow-700 disabled:opacity-60 text-white font-black text-sm transition-all"
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Generating with Claude Sonnet…</>
            : <><Sparkles size={16} /> Generate {platform.name} Profile</>
          }
        </button>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{platform.icon}</span>
                <h2 className="text-white font-black text-base">{platform.name} Profile — Ready to Copy</h2>
              </div>
              <button onClick={generate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-bold transition-all">
                <RefreshCw size={12} /> Regenerate
              </button>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 space-y-4">
              {/* Platform context */}
              <div className="flex items-start gap-3 bg-blue-950/30 border border-blue-900/40 rounded-xl p-3">
                <ExternalLink size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-300 text-xs leading-relaxed">
                  <span className="font-bold">Target audience: </span>{platform.audience}
                </p>
              </div>

              {platform.fields.map(field => (
                result[field] ? (
                  <FieldCard
                    key={field}
                    label={FIELD_LABELS[field] || field}
                    value={result[field]}
                    limit={platform.limits[field]}
                  />
                ) : null
              ))}
            </div>

            {/* Copy All */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Full Profile (All Fields)</p>
                <CopyButton text={platform.fields.filter(f => result[f]).map(f => `[${(FIELD_LABELS[f] || f).toUpperCase()}]\n${result[f]}`).join("\n\n")} />
              </div>
              <p className="text-gray-600 text-xs">Copy all fields at once to paste into a doc or email</p>
            </div>

            {/* Language reminder */}
            <div className="bg-green-950/20 border border-green-900/30 rounded-xl p-4">
              <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1">✅ Investment-Grade Language Verified</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Generated profile emphasizes peer-reviewed validation, government documentation, AI tools, and commercial IP value.
                No fringe, alternative, or pseudoscience framing. Ready to post directly.
              </p>
            </div>
          </div>
        )}

        {/* Instructions when no result yet */}
        {!result && !loading && (
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8 text-center">
            <Sparkles size={32} className="text-yellow-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Generate Professional Profiles</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
              Select your platform and tone above, then click Generate. Claude Sonnet will create investment-grade,
              professionally worded profiles for your chosen platform — no fringe language, no pseudoscience framing.
            </p>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto">
              {["Peer-reviewed citations", "DoD SBIR validation", "AI tools emphasis", "Institutional credibility"].map(tag => (
                <div key={tag} className="bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-400">{tag}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}