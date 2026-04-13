import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Sparkles, Copy, CheckCircle2, Loader2, RefreshCw,
  Download, ChevronRight, Edit3, BarChart2, Users, Zap, Target
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const PLATFORMS = [
  {
    id: "linkedin", name: "LinkedIn", icon: "💼", color: "#0A66C2",
    fields: ["headline", "about", "tagline"],
    limits: { headline: 220, about: 2600, tagline: 120 },
    audience: "B2B investors, IP attorneys, defense contractors, biotech executives, patent professionals",
    tip: "Use keywords like 'IP generation', 'electromagnetic research', 'patent strategy'",
  },
  {
    id: "twitter", name: "Twitter / X", icon: "𝕏", color: "#1d9bf0",
    fields: ["bio", "pinned_post"],
    limits: { bio: 160, pinned_post: 280 },
    audience: "Tech founders, researchers, alternative energy community, independent scientists",
    tip: "Hooks & punchy language. Pinned post should tease the platform value.",
  },
  {
    id: "youtube", name: "YouTube", icon: "▶️", color: "#FF0000",
    fields: ["channel_name", "description", "about"],
    limits: { channel_name: 100, description: 500, about: 1000 },
    audience: "Engineers, researchers, energy tech enthusiasts, patent professionals",
    tip: "Lead with the SEO-rich channel description. About section tells the backstory.",
  },
  {
    id: "instagram", name: "Instagram", icon: "📸", color: "#E1306C",
    fields: ["name", "bio", "website_label"],
    limits: { name: 30, bio: 150, website_label: 30 },
    audience: "Science communicators, wellness community, forward-thinking investors",
    tip: "Use line breaks and emojis to make the bio scannable.",
  },
  {
    id: "tiktok", name: "TikTok", icon: "🎵", color: "#ff0050",
    fields: ["username", "bio"],
    limits: { username: 24, bio: 80 },
    audience: "Science-curious youth, alternative energy enthusiasts, viral research content",
    tip: "Short, punchy, with a call-to-action hook.",
  },
  {
    id: "substack", name: "Substack", icon: "📰", color: "#FF6719",
    fields: ["publication_name", "tagline", "description"],
    limits: { publication_name: 70, tagline: 160, description: 600 },
    audience: "Paying subscribers: researchers, investors, IP professionals, energy engineers",
    tip: "Tagline is the most important field — it determines subscribe conversions.",
  },
  {
    id: "reddit", name: "Reddit", icon: "🔴", color: "#FF4500",
    fields: ["subreddit_name", "description", "sidebar"],
    limits: { subreddit_name: 21, description: 500, sidebar: 1024 },
    audience: "r/LENR, r/AlternativeEnergy, r/Physics, r/patents communities",
    tip: "Sidebar is your community charter — explain rules and value clearly.",
  },
  {
    id: "facebook", name: "Facebook Page", icon: "👥", color: "#1877F2",
    fields: ["page_name", "short_description", "long_description"],
    limits: { page_name: 75, short_description: 255, long_description: 1000 },
    audience: "Researchers, wellness advocates, investors, independent scientists",
    tip: "Short description appears in search results — make it count.",
  },
];

const TONES = [
  { id: "executive", label: "Executive", emoji: "🏛", desc: "C-suite, institutional investors" },
  { id: "scientific", label: "Scientific", emoji: "🔬", desc: "Researchers, engineers, IP professionals" },
  { id: "visionary", label: "Visionary", emoji: "🚀", desc: "Tech founders, VCs, accelerators" },
  { id: "accessible", label: "Accessible", emoji: "📖", desc: "General public, science enthusiasts" },
  { id: "bold", label: "Bold & Provocative", emoji: "⚡", desc: "Disruption narrative, pattern-interrupt hooks" },
  { id: "credibility", label: "Authority-First", emoji: "🎖", desc: "Lead with government docs and peer citations" },
];

const FOCUSES = [
  "AI patent drafting tools", "21 invention build plans", "DoD / ONR validation",
  "Bioelectromagnetics research", "Investor CRM & pitch tools", "Advanced EM physics",
  "IP commercialization", "Hardware kits & build guides",
];

const FIELD_LABELS = {
  headline: "Headline", about: "About / Summary", tagline: "Tagline",
  bio: "Bio", pinned_post: "Pinned Post", channel_name: "Channel Name",
  description: "Description", name: "Display Name", website_label: "Website Label",
  username: "Username", publication_name: "Publication Name",
  subreddit_name: "Subreddit Name", sidebar: "Sidebar / Community Info",
  page_name: "Page Name", short_description: "Short Description",
  long_description: "Long Description",
};

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold transition-all"
    >
      {copied ? <CheckCircle2 size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function CharBar({ current, max }) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  const color = pct > 95 ? "bg-red-500" : pct > 80 ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs tabular-nums ${pct > 95 ? "text-red-400" : "text-gray-600"}`}>{current}/{max}</span>
    </div>
  );
}

function FieldCard({ fieldKey, label, value, limit, onChange, platformColor }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const isLong = limit > 400;

  const save = () => { onChange(draft); setEditing(false); };

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-700/60 shadow-lg" style={{ boxShadow: `0 2px 24px ${platformColor}18` }}>
      {/* Platform-colored label bar */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: `linear-gradient(90deg, ${platformColor}22, ${platformColor}08)`, borderBottom: `1px solid ${platformColor}30` }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platformColor }} />
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: platformColor }}>{label}</p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={value} />
          <button
            onClick={() => { setDraft(value); setEditing(e => !e); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all"
            style={{ background: `${platformColor}20`, color: platformColor, border: `1px solid ${platformColor}40` }}
          >
            <Edit3 size={10} /> {editing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-5 bg-gray-900">
        {editing ? (
          <>
            {isLong
              ? <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={8}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none mb-3"
                  style={{ focusBorderColor: platformColor }} />
              : <input value={draft} onChange={e => setDraft(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none mb-3" />
            }
            <div className="flex items-center justify-between">
              <CharBar current={draft.length} max={limit} />
              <button onClick={save} className="ml-3 px-4 py-1.5 rounded-lg text-white text-xs font-black transition-all"
                style={{ backgroundColor: platformColor }}>
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap mb-4 font-light">{value}</p>
            <CharBar current={value.length} max={limit} />
          </>
        )}
      </div>
    </div>
  );
}

export default function SocialMediaProfileGen() {
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customFocus, setCustomFocus] = useState("");
  const [editedResult, setEditedResult] = useState(null);
  const [generatedFor, setGeneratedFor] = useState(null);
  const resultRef = useRef(null);

  const displayResult = editedResult || result;

  const generate = async () => {
    setLoading(true);
    setResult(null);
    setEditedResult(null);

    const prompt = `You are a world-class brand strategist and copywriter specializing in deep-tech, IP, and advanced research platforms.

Generate a complete, professional ${platform.name} business profile for the following company:

COMPANY: Zenith Apex Research Portfolio (ZARP)
PLATFORM: ${platform.name}
TARGET AUDIENCE: ${platform.audience}
TONE: ${tone.label} — ${tone.desc}
PLATFORM TIP: ${platform.tip}
${customFocus ? `CUSTOM FOCUS / EMPHASIS: ${customFocus}` : ""}

COMPANY DESCRIPTION:
Zenith Apex Research Portfolio is an AI-powered intellectual property generation and commercialization platform for advanced electromagnetic technology, bioelectromagnetic medicine, and next-generation energy research. The platform integrates:
- AI Invention Forge Engine that generates complete investor-ready invention dossiers from documented electromagnetic physics
- USPTO-compliant Provisional Patent Drafter (AI-assisted, Claude Sonnet powered)
- Live patent database scanner (USPTO, EPO, WIPO, Google Patents, IEEE)
- VC-grade pitch deck and animated engineering build guide generator
- 26 documented device architectures with engineering build plans, bills of materials, and PDFs
- Course catalog, research membership, and hardware kit shop
- Peer-reviewed institutional validation: Boeing Phantom Works, Trinity College Dublin, Alfvén Laboratory Stockholm (Foundations of Physics Letters, 2001)
- US Office of Naval Research validation documentation (UNCLASSIFIED, 1978)
- $630K+ in DoD SBIR grants awarded for electromagnetic sensing technology
- Investor CRM, patent landscape graph, prior art archive, and monitoring dashboard
- App URL: https://zenithapex.base44.app

CRITICAL LANGUAGE RULES:
- NEVER use: "suppressed", "fringe", "pseudoscience", "conspiracy", "free energy", "alternative science"
- DO use: "advanced electromagnetic research", "bioelectromagnetic medicine", "next-generation energy technology", "AI-powered IP generation", "peer-validated", "government-documented"
- Emphasize: peer-reviewed validation, government documentation, institutional credibility, commercial IP value, AI tools
- Match the tone to: ${tone.label}

Generate exactly these fields: ${platform.fields.join(", ")}
Character limits: ${platform.fields.map(f => `${f}: max ${platform.limits[f]} chars`).join(", ")}

Return ONLY a JSON object with keys: ${platform.fields.join(", ")}
Each value must be a string within the character limit. Be compelling, specific, and professional.`;

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
    setGeneratedFor({ platform: platform.id, tone: tone.id });
    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleFieldEdit = (fieldKey, newValue) => {
    setEditedResult(prev => ({ ...(prev || result), [fieldKey]: newValue }));
  };

  const allFieldsText = displayResult
    ? platform.fields.filter(f => displayResult[f]).map(f => `[${(FIELD_LABELS[f] || f).toUpperCase()}]\n${displayResult[f]}`).join("\n\n")
    : "";

  const handleDownload = () => {
    const blob = new Blob([allFieldsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ZenithApex_${platform.name.replace(/\s/g, "_")}_Profile.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
              <Sparkles size={15} className="text-yellow-400" /> Social Profile Generator
            </h1>
            <p className="text-gray-500 text-xs">AI-powered · Investment-grade language · Editable output · 8 platforms</p>
          </div>
        </div>
        <Link to="/social-command" className="px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all hidden sm:flex items-center gap-1.5">
          Social Command <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full p-5 space-y-7">

          {/* STEP 1: Platform */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-yellow-700 flex items-center justify-center text-xs font-black text-white flex-shrink-0">1</span>
              <h2 className="text-white text-sm font-black uppercase tracking-widest">Select Platform</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => { setPlatform(p); setResult(null); setEditedResult(null); }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                    platform.id === p.id
                      ? "border-white/40 bg-white/10 text-white shadow-lg"
                      : "border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-600 hover:text-white"
                  }`}>
                  <span className="text-lg">{p.icon}</span>
                  <span className="text-xs leading-tight">{p.name}</span>
                  {platform.id === p.id && <CheckCircle2 size={12} className="ml-auto text-green-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
            {/* Platform info */}
            <div className="mt-3 flex items-start gap-2 bg-blue-950/20 border border-blue-900/30 rounded-xl px-4 py-2.5">
              <Users size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-blue-300 text-xs font-bold">Audience: </span>
                <span className="text-blue-300/70 text-xs">{platform.audience}</span>
                <p className="text-gray-600 text-xs mt-0.5">💡 {platform.tip}</p>
              </div>
            </div>
          </div>

          {/* STEP 2: Tone */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-yellow-700 flex items-center justify-center text-xs font-black text-white flex-shrink-0">2</span>
              <h2 className="text-white text-sm font-black uppercase tracking-widest">Select Tone</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {TONES.map(t => (
                <button key={t.id} onClick={() => setTone(t)}
                  className={`text-left px-4 py-3 rounded-xl border transition-all ${
                    tone.id === t.id
                      ? "border-yellow-600 bg-yellow-950/40 text-white"
                      : "border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-600 hover:text-white"
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{t.emoji}</span>
                    <p className="font-bold text-sm">{t.label}</p>
                    {tone.id === t.id && <CheckCircle2 size={11} className="ml-auto text-yellow-400" />}
                  </div>
                  <p className="text-gray-500 text-xs">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: Focus */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-yellow-700 flex items-center justify-center text-xs font-black text-white flex-shrink-0">3</span>
              <h2 className="text-white text-sm font-black uppercase tracking-widest">Custom Focus <span className="text-gray-600 font-normal normal-case tracking-normal">— optional</span></h2>
            </div>
            {/* Quick-select chips */}
            <div className="flex flex-wrap gap-2 mb-2.5">
              {FOCUSES.map(f => (
                <button key={f} onClick={() => setCustomFocus(prev => prev.includes(f) ? prev.replace(f, "").replace(", , ", ", ").trim().replace(/^, |, $/g, "") : prev ? `${prev}, ${f}` : f)}
                  className={`px-3 py-1 rounded-full text-xs border font-medium transition-all ${
                    customFocus.includes(f)
                      ? "bg-yellow-900/50 border-yellow-700 text-yellow-300"
                      : "bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
            <input
              value={customFocus}
              onChange={e => setCustomFocus(e.target.value)}
              placeholder="Or type custom focus instructions…"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600 transition-all"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-base transition-all disabled:opacity-60 shadow-xl shadow-yellow-900/20"
            style={{ background: loading ? "#78350f" : "linear-gradient(135deg, #92400e, #b45309)" }}
          >
            {loading
              ? <><Loader2 size={18} className="animate-spin" /> Generating with Claude Sonnet…</>
              : <><Sparkles size={18} /> Generate {platform.name} Profile</>
            }
          </button>

          {/* Empty state */}
          {!displayResult && !loading && (
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">{platform.icon}</div>
              <h3 className="text-white font-black text-lg mb-2">AI will generate a complete {platform.name} profile</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-5">
                Professional, investment-grade copy. No fringe language. All fields within character limits. Editable after generation.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { icon: <BarChart2 size={11} />, label: "Peer-reviewed citations" },
                  { icon: <Zap size={11} />, label: "DoD validation" },
                  { icon: <Target size={11} />, label: "AI tools emphasis" },
                  { icon: <Users size={11} />, label: "Institutional credibility" },
                ].map(tag => (
                  <div key={tag.label} className="flex items-center gap-1.5 bg-gray-800/60 border border-gray-700 rounded-full px-3 py-1.5 text-xs text-gray-400">
                    {tag.icon}{tag.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {displayResult && (
            <div className="space-y-5" ref={resultRef}>

              {/* Platform mockup header card */}
              <div className="rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl"
                style={{ boxShadow: `0 8px 40px ${platform.color}28` }}>
                {/* Banner */}
                <div className="relative px-6 py-5 flex items-center justify-between"
                  style={{ background: `linear-gradient(135deg, ${platform.color}33, ${platform.color}10)` }}>
                  <div className="flex items-center gap-4">
                    {/* Fake avatar */}
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2"
                      style={{ backgroundColor: platform.color + "30", borderColor: platform.color + "60" }}>
                      {platform.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-black text-lg">Zenith Apex Research</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-black"
                          style={{ backgroundColor: platform.color + "40", color: platform.color }}>
                          {platform.name}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">zenithapex.base44.app · {tone.emoji} {tone.label} tone · {platform.fields.length} fields generated</p>
                    </div>
                  </div>
                  {/* Floating action buttons */}
                  <div className="flex items-center gap-2">
                    <button onClick={generate}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border"
                      style={{ backgroundColor: platform.color + "20", borderColor: platform.color + "50", color: platform.color }}>
                      <RefreshCw size={11} /> Regenerate
                    </button>
                    <CopyButton text={allFieldsText} label="Copy All" />
                    <button onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-bold transition-all">
                      <Download size={11} /> .txt
                    </button>
                  </div>
                </div>
                {/* Sub-bar */}
                <div className="px-6 py-2.5 flex items-center gap-4 bg-gray-900/80 border-t border-gray-700/40">
                  <span className="text-gray-500 text-xs">✏️ Click any field to edit inline</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-gray-500 text-xs">📋 Copy individual fields or all at once</span>
                  {editedResult && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span className="text-yellow-400 text-xs font-bold">⚡ Edits saved</span>
                    </>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                {platform.fields.map(field =>
                  displayResult[field] ? (
                    <FieldCard
                      key={field}
                      fieldKey={field}
                      label={FIELD_LABELS[field] || field}
                      value={displayResult[field]}
                      limit={platform.limits[field]}
                      onChange={(v) => handleFieldEdit(field, v)}
                      platformColor={platform.color}
                    />
                  ) : null
                )}
              </div>

              {/* Validation badge */}
              <div className="flex items-start gap-3 bg-green-950/20 border border-green-900/30 rounded-2xl p-4">
                <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 text-xs font-black uppercase tracking-wider mb-0.5">✅ Investment-Grade Language Verified</p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    No fringe, pseudoscience, or conspiracy framing. Peer-reviewed validation, DoD documentation, AI IP tools, and commercial credibility emphasized throughout. Ready to post directly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}