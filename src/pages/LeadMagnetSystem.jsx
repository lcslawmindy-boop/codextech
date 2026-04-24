/**
 * LeadMagnetSystem — Admin page
 * Full lead magnet strategy: 3 magnets, placement map, timing rules, copy vault
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Download, Mail, Clock, MousePointer, Eye, Copy, Check,
  ChevronDown, ChevronUp, Target, Zap, TrendingUp, AlertTriangle, Star
} from "lucide-react";
import LeadMagnetPopup, { useLeadMagnetTrigger } from "@/components/LeadMagnetPopup";

// ── 3 Lead Magnets ────────────────────────────────────────────────────────────
const MAGNETS = [
  {
    id: "meg_blueprint",
    emoji: "⚡",
    name: "The MEG Blueprint",
    format: "8-page engineering PDF",
    color: "#f59e0b",
    audience: "Engineers, tinkerers, skeptics",
    conversionAngle: "Proof-of-concept credibility. The MEG is the most peer-reviewed device in the vault. This magnet converts skeptics.",
    headline: "The Peer-Reviewed Free Energy Device They Buried in 2002",
    subheadline: "US Patent 6,362,718. Foundations of Physics Letters. COP>1 demonstrated. Get the full engineering breakdown — free.",
    bullets: [
      "Full schematic from the original patent filing",
      "Exact component specs (ferrite cores, neodymium magnets, Hall sensors)",
      "3 failure points most replicators miss",
      "Why the output doesn't violate thermodynamics",
    ],
    cta: "Send Me the MEG Blueprint →",
    bestPages: ["/", "/free-vault", "/invention-plans"],
    bestTrigger: "45s time delay on landing page",
    expectedOPR: "38–45%",
    notes: "Highest opt-in rate of the three. MEG is the most searched device in the space. Low-commitment deliverable — 8 pages, not a course.",
  },
  {
    id: "prior_art_sample",
    emoji: "🗂️",
    name: "5 Suppressed Inventions — Primary Source Pack",
    format: "Sourced reference PDF (primary citations)",
    color: "#8b5cf6",
    audience: "Researchers, historians, patent attorneys",
    conversionAngle: "Authority signal. Every claim is sourced. This magnet converts the research-minded buyer who needs evidence before trust.",
    headline: "What They Patented. What They Buried. The Receipts.",
    subheadline: "Tesla, Moray, Gray, Priore, Searl — patent numbers, government documents, and lab results. All primary sources. No speculation.",
    bullets: [
      "Tesla Magnifying Transmitter (US Patent 1,119,732)",
      "T.H. Moray — Radiant Energy Device (patent denied — full story)",
      "Edwin Gray — Pulsed Capacitor Engine (US 3,890,548)",
      "Antoine Priore — French govt funded, ONR validated, then buried",
    ],
    cta: "Send Me the Source Pack →",
    bestPages: ["/prior-art", "/free-vault", "/courses"],
    bestTrigger: "60% scroll depth on prior art or course pages",
    expectedOPR: "28–34%",
    notes: "Converts researchers who don't want a 'sales pitch'. The sourced format signals credibility immediately. Converts into Pro buyers at high rates.",
  },
  {
    id: "patent_checklist",
    emoji: "🛡️",
    name: "The Inventor's Pre-Filing Checklist",
    format: "Interactive PDF — 17 questions",
    color: "#22c55e",
    audience: "Active inventors, patent filers, IP lawyers",
    conversionAngle: "High-value utility. Directly saves them money (avoids $400/hr attorney mistakes). Converts into patent tool users.",
    headline: "17 Questions to Answer Before Filing Your Provisional",
    subheadline: "Miss even one and your IP may be unenforceable. Most inventors learn this after they've already paid their attorney.",
    bullets: [
      "Prior art search checklist (what most people skip)",
      "Claim scope red flags — too broad vs too narrow",
      "Inventorship questions that can invalidate a patent",
      "How to file a bulletproof provisional for under $500",
    ],
    cta: "Send Me the Checklist →",
    bestPages: ["/patent-tool", "/patent-claims-generator", "/prior-art"],
    bestTrigger: "Exit intent on patent tool pages",
    expectedOPR: "31–38%",
    notes: "Highest conversion to paid tool users. Someone using the patent checklist is 3–4x more likely to buy a Pro membership within 14 days.",
  },
];

// ── Placement strategy ────────────────────────────────────────────────────────
const PLACEMENTS = [
  {
    page: "Landing page (/)",
    magnet: "MEG Blueprint",
    trigger: "45-second time delay",
    triggerType: "time",
    why: "45 seconds is enough time for genuine interest to form. Too early = annoying. Too late = they've already left.",
    expectedCapture: "4–7% of landing page visitors",
    color: "#f59e0b",
  },
  {
    page: "Free Vault (/free-vault)",
    magnet: "MEG Blueprint or Prior Art Pack",
    trigger: "60% scroll depth",
    triggerType: "scroll",
    why: "If they've scrolled 60% of the free vault, they're engaged. They've seen the quality. This is peak opt-in moment.",
    expectedCapture: "12–18% of free vault visitors",
    color: "#8b5cf6",
  },
  {
    page: "Prior Art Archive (/prior-art)",
    magnet: "Prior Art Source Pack",
    trigger: "45-second time delay",
    triggerType: "time",
    why: "Magnet matches page intent exactly. Someone browsing prior art wants more of the same — give it to them.",
    expectedCapture: "22–28% of prior art visitors",
    color: "#06b6d4",
  },
  {
    page: "Patent Tool (/patent-tool)",
    magnet: "Patent Checklist",
    trigger: "Exit intent (mouse to top of page)",
    triggerType: "exit",
    why: "Exit intent on the patent tool catches people mid-task. The checklist directly complements what they were doing.",
    expectedCapture: "8–13% of patent tool visitors",
    color: "#22c55e",
  },
  {
    page: "Invention Plans (/invention-plans)",
    magnet: "MEG Blueprint",
    trigger: "After opening same build plan twice",
    triggerType: "build_view",
    why: "Second view = intent signal. They came back. The blueprint reinforces the value of upgrading to get the full plan.",
    expectedCapture: "15–21% of repeat build-plan viewers",
    color: "#f97316",
  },
  {
    page: "Pricing (/pricing)",
    magnet: "MEG Blueprint",
    trigger: "60-second time delay (not exit — too aggressive on pricing)",
    triggerType: "time",
    why: "Someone reading pricing for 60 seconds is comparing. The magnet gives them a reason to give their email even if they don't convert today.",
    expectedCapture: "9–14% of pricing page visitors",
    color: "#ef4444",
  },
];

// ── Copy vault — full form copy for each context ──────────────────────────────
const COPY_VARIANTS = [
  {
    context: "Landing page — time trigger",
    magnet: "MEG Blueprint",
    headline: "Before You Go Any Further…",
    sub: "Get the full MEG engineering breakdown free. The peer-reviewed, patent-backed device that's been quietly replicated since 2002.",
    cta: "Send Me the Blueprint →",
    dismiss: "No thanks, I'll figure it out myself",
    color: "#f59e0b",
  },
  {
    context: "Free vault — scroll trigger",
    magnet: "MEG Blueprint",
    headline: "You're Clearly Interested. Get the Full Picture.",
    sub: "The free vault is the preview. The MEG Blueprint is the actual engineering breakdown — schematics, specs, failure modes.",
    cta: "Send Me the MEG Blueprint →",
    dismiss: "I'll stick with the free preview",
    color: "#f59e0b",
  },
  {
    context: "Prior art — time trigger",
    magnet: "Prior Art Source Pack",
    headline: "5 Suppressed Inventions. All Primary Sources. Free.",
    sub: "Tesla, Moray, Gray, Priore, Searl — patent numbers, government documents, lab results. The ones that actually worked.",
    cta: "Send Me the Source Pack →",
    dismiss: "I have my own sources",
    color: "#8b5cf6",
  },
  {
    context: "Patent tool — exit intent",
    magnet: "Patent Checklist",
    headline: "Before You File — Read This First.",
    sub: "17 questions most inventors skip. Missing even one can make your patent unenforceable. Free checklist, instant delivery.",
    cta: "Send Me the Checklist →",
    dismiss: "I know what I'm doing",
    color: "#22c55e",
  },
  {
    context: "Invention plans — 2nd build view",
    magnet: "MEG Blueprint",
    headline: "You've Looked at This Twice — Here's the Full Breakdown.",
    sub: "The MEG Blueprint covers everything you're looking at — plus the 3 failure points most builders miss.",
    cta: "Get the Engineering Breakdown →",
    dismiss: "Not now",
    color: "#f97316",
  },
  {
    context: "Pricing page — 60s time delay",
    magnet: "MEG Blueprint",
    headline: "Still Comparing? Start Here — It's Free.",
    sub: "The MEG Blueprint is the clearest signal of what's inside the vault. Get it free. Decide after.",
    cta: "Send Me the Free Blueprint →",
    dismiss: "I've already decided",
    color: "#ef4444",
  },
];

// ── UX rules ──────────────────────────────────────────────────────────────────
const UX_RULES = [
  { rule: "One popup per session, maximum", why: "Multiple popups = trust destruction. One well-timed ask is all you get.", icon: "1️⃣" },
  { rule: "Never show within the first 20 seconds", why: "Under 20 seconds = they haven't formed intent yet. You're just creating friction.", icon: "⏱️" },
  { rule: "Exit intent only on high-value pages", why: "Exit intent on every page is dark-pattern territory. Reserve it for patent/pricing pages only.", icon: "🖱️" },
  { rule: "Dismiss copy should reinforce the trade-off", why: "'No thanks, I'll figure it out myself' makes them feel what they're giving up. 'Close' doesn't.", icon: "✍️" },
  { rule: "Session storage, not cookies", why: "Don't show the same popup to a returning member. Session storage prevents reshowing within a single visit.", icon: "🔒" },
  { rule: "Never gate free vault content behind email", why: "The free vault's job is to build trust, not capture leads aggressively. The popup supplements it.", icon: "🚫" },
];

// ── UI helpers ────────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 hover:text-white transition-all flex-shrink-0">
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const TRIGGER_ICONS = {
  time: <Clock size={13} className="text-yellow-400" />,
  scroll: <MousePointer size={13} className="text-purple-400" />,
  exit: <AlertTriangle size={13} className="text-red-400" />,
  build_view: <Eye size={13} className="text-cyan-400" />,
};

function MagnetCard({ magnet }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${magnet.color}, transparent)` }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: `${magnet.color}15`, border: `1px solid ${magnet.color}30` }}>
              {magnet.emoji}
            </div>
            <div>
              <h3 className="text-white font-black text-base leading-snug">{magnet.name}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{magnet.format}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <p className="text-xs text-gray-600">Expected OPR</p>
            <p className="font-black text-lg" style={{ color: magnet.color }}>{magnet.expectedOPR}</p>
          </div>
        </div>

        <p className="text-gray-400 text-xs mb-3 italic">Audience: {magnet.audience}</p>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">{magnet.conversionAngle}</p>

        <div className="space-y-1 mb-4">
          {magnet.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
              <Check size={10} className="flex-shrink-0 mt-0.5" style={{ color: magnet.color }} /> {b}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="p-2.5 bg-gray-800 rounded-lg">
            <p className="text-gray-600 mb-0.5">Best pages</p>
            <p className="text-white font-semibold">{magnet.bestPages.join(", ")}</p>
          </div>
          <div className="p-2.5 bg-gray-800 rounded-lg">
            <p className="text-gray-600 mb-0.5">Best trigger</p>
            <p className="text-white font-semibold">{magnet.bestTrigger}</p>
          </div>
        </div>

        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {open ? "Hide" : "Show"} full headline + CTA copy
        </button>

        {open && (
          <div className="mt-3 space-y-2">
            {[
              { label: "Headline", value: magnet.headline },
              { label: "Sub", value: magnet.subheadline },
              { label: "CTA button", value: magnet.cta },
            ].map((row, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-2.5 bg-gray-800 rounded-lg">
                <div className="min-w-0">
                  <p className="text-gray-600 text-xs mb-0.5">{row.label}</p>
                  <p className="text-white text-sm">{row.value}</p>
                </div>
                <CopyBtn text={row.value} />
              </div>
            ))}
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-gray-600 text-xs mb-1">Strategy note</p>
              <p className="text-gray-300 text-xs leading-relaxed">{magnet.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Preview modal ─────────────────────────────────────────────────────────────
function PreviewButton({ magnetId, trigger }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 hover:text-white transition-all">
        <Eye size={11} /> Preview
      </button>
      {show && <LeadMagnetPopup trigger={trigger} magnetId={magnetId} onDismiss={() => setShow(false)} />}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LeadMagnetSystem() {
  const [activeTab, setActiveTab] = useState("magnets");

  const tabs = [
    { id: "magnets", label: "3 Lead Magnets", icon: <Download size={14} /> },
    { id: "placement", label: "Placement Map", icon: <Target size={14} /> },
    { id: "copy", label: "Copy Vault", icon: <Mail size={14} /> },
    { id: "ux", label: "UX Rules", icon: <Zap size={14} /> },
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
              <Download size={17} className="text-cyan-400" /> Lead Magnet System
            </h1>
            <p className="text-gray-500 text-xs">3 magnets · Placement map · Timing rules · Copy vault</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-400 font-bold">🔒 ADMIN ONLY</span>
      </div>

      {/* KPI bar */}
      <div className="border-b border-gray-800 bg-gray-900/30 px-6 py-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Target opt-in rate (landing)", value: "5–8%", color: "#f59e0b", sub: "Industry avg: 1.5–2.5%" },
            { label: "Free vault opt-in (scroll)", value: "15–18%", color: "#8b5cf6", sub: "High-intent, high-engagement" },
            { label: "Exit intent (patent pages)", value: "9–13%", color: "#22c55e", sub: "Catches mid-task abandonment" },
            { label: "Email → paid conversion", value: "4–8%", color: "#06b6d4", sub: "Over 14-day nurture sequence" },
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
        <div className="max-w-5xl mx-auto flex gap-0 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap min-h-0 ${
                activeTab === t.id ? "border-cyan-400 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* ── Magnets ── */}
        {activeTab === "magnets" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">3 Engineering Lead Magnets</h2>
              <p className="text-gray-500 text-sm">Each magnet targets a different buyer intent stage. Together they cover skeptics, researchers, and active inventors — the three main ZARP buyer profiles.</p>
            </div>
            <div className="bg-gray-900 border border-cyan-900/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Star size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400">
                <span className="font-black text-cyan-300">Selection logic:</span> The MEG Blueprint converts by credibility.
                The Source Pack converts by authority. The Patent Checklist converts by utility.
                Each one attracts a different buyer — and all three paths lead to Pro membership.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MAGNETS.map((m, i) => <MagnetCard key={i} magnet={m} />)}
            </div>
          </div>
        )}

        {/* ── Placement ── */}
        {activeTab === "placement" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Email Capture Placement Map</h2>
              <p className="text-gray-500 text-sm">6 pages, 4 trigger types. Each placement matches the magnet to the page intent — the visitor is already in the right mental state to want exactly what you're offering.</p>
            </div>

            {/* Trigger legend */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              {Object.entries(TRIGGER_ICONS).map(([key, icon]) => (
                <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500 capitalize">
                  {icon} {key.replace("_", " ")} trigger
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-8">
              {PLACEMENTS.map((p, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">{TRIGGER_ICONS[p.triggerType]}</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-bold text-sm">{p.page}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                            style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                            {p.trigger}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">Magnet: <span className="text-gray-300 font-semibold">{p.magnet}</span></p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-600">Capture rate</p>
                      <p className="font-black text-sm" style={{ color: p.color }}>{p.expectedCapture}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.why}</p>
                </div>
              ))}
            </div>

            {/* Implementation note */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-black text-white mb-3 flex items-center gap-2">
                <Zap size={15} className="text-cyan-400" /> Implementation — Drop-In Component
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                The <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300">LeadMagnetPopup</code> component + <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-cyan-300">useLeadMagnetTrigger</code> hook are already built.
                Add to any page in 5 lines:
              </p>
              <pre className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs text-cyan-300 overflow-x-auto">{`import LeadMagnetPopup, { useLeadMagnetTrigger } from "@/components/LeadMagnetPopup";

const { show, trigger, dismiss } = useLeadMagnetTrigger({ timeDelay: 45000 });

{show && <LeadMagnetPopup trigger={trigger} magnetId="meg_blueprint" onDismiss={dismiss} />}`}</pre>

              <div className="mt-4">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Preview each popup:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "MEG Blueprint", magnetId: "meg_blueprint", trigger: "time" },
                    { label: "Prior Art Pack", magnetId: "prior_art_sample", trigger: "scroll" },
                    { label: "Patent Checklist", magnetId: "patent_checklist", trigger: "exit" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">{p.label}</span>
                      <PreviewButton magnetId={p.magnetId} trigger={p.trigger} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Copy ── */}
        {activeTab === "copy" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Copy Vault — 6 Placement-Specific Variants</h2>
              <p className="text-gray-500 text-sm">
                Every page gets its own copy — headline, sub, CTA, and dismiss text. Generic copy kills opt-in rate. Context-matched copy doubles it.
              </p>
            </div>
            <div className="space-y-4">
              {COPY_VARIANTS.map((v, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${v.color}, transparent)` }} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-black px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${v.color}20`, color: v.color }}>
                        {v.context}
                      </span>
                      <span className="text-gray-600 text-xs">{v.magnet}</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Headline", value: v.headline },
                        { label: "Subheadline", value: v.sub },
                        { label: "CTA", value: v.cta },
                        { label: "Dismiss", value: v.dismiss },
                      ].map((row, j) => (
                        <div key={j} className="flex items-start justify-between gap-3 p-2.5 bg-gray-800 rounded-lg">
                          <div className="min-w-0">
                            <p className="text-gray-600 text-xs mb-0.5">{row.label}</p>
                            <p className="text-white text-sm">{row.value}</p>
                          </div>
                          <CopyBtn text={row.value} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── UX Rules ── */}
        {activeTab === "ux" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">UX Rules — Capture Without Destroying Trust</h2>
              <p className="text-gray-500 text-sm">ZARP's audience is sophisticated. Engineers and researchers have high sensitivity to manipulation. These rules protect the experience while maximizing capture.</p>
            </div>

            <div className="space-y-3 mb-8">
              {UX_RULES.map((rule, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4">
                  <div className="text-2xl flex-shrink-0">{rule.icon}</div>
                  <div>
                    <h4 className="text-white font-black text-sm mb-1">{rule.rule}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{rule.why}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue math */}
            <div className="bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-800/30 rounded-xl p-6">
              <h3 className="font-black text-white mb-4 flex items-center gap-2">
                <TrendingUp size={15} className="text-green-400" /> Lead Magnet Revenue Math (at 10,000 monthly visitors)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Email captures/month (blended 3% rate)", value: "300 emails", color: "#06b6d4" },
                  { label: "→ Paid conversion (5% over 14 days)", value: "15 new members", color: "#8b5cf6" },
                  { label: "→ Revenue (15 × $79 avg)", value: "$1,185/mo", color: "#22c55e" },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-900/60 rounded-xl p-4 text-center">
                    <p className="font-black text-xl mb-1" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-gray-400 text-xs leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs">
                At 6% blended capture rate (achievable with context-matched magnets): <span className="text-white font-black">600 emails → 30 members → $2,370/mo</span> from the email channel alone.
                The list also compounds — every subscriber is a future upsell, kit buyer, and referral source.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}