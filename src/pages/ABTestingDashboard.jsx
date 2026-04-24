/**
 * A/B Testing Dashboard — Growth Hacker Command Center
 * Tests: headlines, pricing tiers, CTA buttons, paywall timing
 * Includes: roadmap, measurement framework, optimization loop
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, FlaskConical, TrendingUp, Target, RotateCcw,
  CheckCircle2, Clock, Zap, ChevronDown, ChevronUp, Copy, Check,
  AlertTriangle, BarChart2, MousePointer, DollarSign, Eye
} from "lucide-react";

// ── Test Roadmap ──────────────────────────────────────────────────────────────
const TEST_ROADMAP = [
  {
    phase: 1,
    title: "Highest-Leverage First",
    duration: "Weeks 1–4",
    color: "#ef4444",
    tests: [
      {
        id: "hl-01",
        name: "Landing Page Hero Headline",
        page: "/",
        element: "H1 headline",
        why: "The headline is the #1 revenue lever. A 10% improvement = 10% more revenue across all downstream conversions. Test this first, always.",
        metric: "Email opt-in rate",
        sampleSize: "500 unique visitors per variant",
        duration: "7–14 days",
        variants: [
          { label: "Control (A)", copy: "They Patented It. They Buried It. We Built the Vault.", note: "Curiosity + conspiracy angle" },
          { label: "Variant B", copy: "40+ Advanced EM Engineering Systems. All Sourced. All Buildable.", note: "Direct benefit / specificity angle" },
          { label: "Variant C", copy: "The Engineering Vault They Don't Want You to See.", note: "Pure forbidden knowledge angle" },
        ],
        winCriteria: "≥15% lift in email opt-in rate, p<0.05",
        implementation: "Randomize on page load via localStorage bucket assignment. Log bucket to analytics.",
      },
      {
        id: "hl-02",
        name: "Paywall Page CTA Button",
        page: "/paywall",
        element: "Primary Pro CTA button",
        why: "Highest-traffic paid conversion point. Button copy is the last thing they read before deciding. Small improvements here = direct revenue.",
        metric: "Stripe checkout initiated rate",
        sampleSize: "300 unique visitors per variant",
        duration: "7–14 days",
        variants: [
          { label: "Control (A)", copy: "Get Pro Now — Lock the Rate", note: "Current — urgency + action" },
          { label: "Variant B", copy: "Unlock All 40+ Systems — $79/mo", note: "Benefit-led, price anchor" },
          { label: "Variant C", copy: "Start Building Today →", note: "Action + identity-based" },
        ],
        winCriteria: "≥10% lift in checkout initiation, p<0.05",
        implementation: "Rotate button text on load. Track button clicks with analytics event.",
      },
    ],
  },
  {
    phase: 2,
    title: "Pricing Architecture",
    duration: "Weeks 5–8",
    color: "#f59e0b",
    tests: [
      {
        id: "pr-01",
        name: "Default Highlighted Tier",
        page: "/paywall, /pricing",
        element: "Which tier is 'Most Popular'",
        why: "The highlighted tier anchors 80% of decisions. Currently Pro. Test if anchoring on Starter reduces friction and increases total conversions.",
        metric: "Total paid conversions (all tiers combined)",
        sampleSize: "400 unique visitors per variant",
        duration: "14 days",
        variants: [
          { label: "Control (A)", copy: "Pro highlighted as 'MOST POPULAR'", note: "$79/mo is the anchor" },
          { label: "Variant B", copy: "Starter highlighted as 'START HERE'", note: "$29/mo lowers entry — more total conversions?" },
          { label: "Variant C", copy: "Elite highlighted as 'BEST VALUE'", note: "Premium anchor — shifts Pro to 'middle safe choice'" },
        ],
        winCriteria: "≥8% lift in total checkout initiations OR higher avg revenue per visitor",
        implementation: "Randomize highlighted tier. Track which tier each user clicks, plus total revenue.",
      },
      {
        id: "pr-02",
        name: "Pricing Anchor Strategy",
        page: "/paywall",
        element: "Strikethrough anchor price for Pro",
        why: "Showing Pro at '$199/mo retail → $79/mo' vs no anchor is a classic pricing psychology test. The anchor creates perceived value.",
        metric: "Pro plan checkout rate",
        sampleSize: "400 unique visitors per variant",
        duration: "14 days",
        variants: [
          { label: "Control (A)", copy: "No anchor — just $79/mo", note: "Current state" },
          { label: "Variant B", copy: "$199/mo retail → $79/mo (60% OFF badge)", note: "High anchor" },
          { label: "Variant C", copy: "$129/mo retail → $79/mo (39% OFF badge)", note: "Credible anchor" },
        ],
        winCriteria: "≥12% lift in Pro plan specifically",
        implementation: "Show/hide anchor element. Track Pro-specific checkout.",
      },
    ],
  },
  {
    phase: 3,
    title: "Paywall Timing & Friction",
    duration: "Weeks 9–12",
    color: "#8b5cf6",
    tests: [
      {
        id: "pw-01",
        name: "Free Vault Gate Timing",
        page: "/free-vault",
        element: "When paywall modal fires after free item expansion",
        why: "Currently fires after 2 free item views. Test if waiting for 3 views = higher-intent visitor = higher conversion, even with fewer captures.",
        metric: "Paywall modal → pricing page click-through rate",
        sampleSize: "300 unique visitors per variant",
        duration: "14 days",
        variants: [
          { label: "Control (A)", copy: "Modal after 2nd item expanded", note: "Current — fires fast" },
          { label: "Variant B", copy: "Modal after 3rd item expanded", note: "Higher intent gate" },
          { label: "Variant C", copy: "No modal — only bottom CTA", note: "Zero friction, lower conversions?" },
        ],
        winCriteria: "Highest revenue per free vault visitor (not just modal CTR)",
        implementation: "localStorage counter for item views. Bucket users to threshold on first visit.",
      },
      {
        id: "pw-02",
        name: "Lead Magnet Timing",
        page: "/",
        element: "Popup timing delay",
        why: "Currently 45 seconds. Test 20s (catches more visitors before exit) vs 90s (catches higher-intent only).",
        metric: "Email opt-in rate AND email → paid conversion rate (14-day)",
        sampleSize: "500 unique visitors per variant",
        duration: "21 days (need 14d downstream conversion data)",
        variants: [
          { label: "Control (A)", copy: "45 second delay", note: "Current" },
          { label: "Variant B", copy: "20 second delay", note: "Catches more — lower intent?" },
          { label: "Variant C", copy: "90 second delay", note: "Fewer captures — higher intent?" },
        ],
        winCriteria: "Highest email → paid conversion rate over 14 days (not just captures)",
        implementation: "Randomize delay in useLeadMagnetTrigger hook. Track source tag by bucket.",
      },
    ],
  },
  {
    phase: 4,
    title: "Conversion Copy Refinement",
    duration: "Weeks 13–16",
    color: "#06b6d4",
    tests: [
      {
        id: "cp-01",
        name: "Hero Email CTA Copy",
        page: "/",
        element: "Email capture button text",
        why: "The 'Get Free Build Guide →' button is the primary lead gen mechanism. Test outcome-focused vs action-focused vs curiosity.",
        metric: "Email opt-in rate",
        sampleSize: "500 unique visitors per variant",
        duration: "14 days",
        variants: [
          { label: "Control (A)", copy: "Get Free Build Guide →", note: "Current" },
          { label: "Variant B", copy: "Send Me the MEG Blueprint →", note: "Specific magnet name" },
          { label: "Variant C", copy: "Start Here — Free Engineering PDF →", note: "Curiosity + format clarity" },
        ],
        winCriteria: "≥10% lift in opt-in rate",
        implementation: "Rotate button text. Track submission events by variant.",
      },
      {
        id: "cp-02",
        name: "Countdown Urgency Copy",
        page: "/paywall, /pricing",
        element: "Urgency bar text",
        why: "Current: 'Founding rates expire in [timer]'. Test specificity vs. scarcity vs. social proof framing.",
        metric: "Checkout initiation rate from urgency bar",
        sampleSize: "400 unique visitors per variant",
        duration: "14 days",
        variants: [
          { label: "Control (A)", copy: "Founding rates expire in [timer]", note: "Timer-based urgency" },
          { label: "Variant B", copy: "847 founding spots remaining — price rises at 1,000", note: "Scarcity-based" },
          { label: "Variant C", copy: "153 engineers joined this week — founding rate still active", note: "Social proof" },
        ],
        winCriteria: "≥8% lift in checkout initiation within session",
        implementation: "Rotate urgency bar variant. Track which variant → checkout.",
      },
    ],
  },
];

// ── Measurement framework ─────────────────────────────────────────────────────
const METRICS = [
  { name: "Email Opt-in Rate", formula: "Emails captured / Unique visitors", target: ">5% landing, >15% free vault", tier: "Top of Funnel", color: "#06b6d4" },
  { name: "Paywall Click-Through Rate", formula: "Pricing page visits / Paywall trigger views", target: ">22%", tier: "Mid Funnel", color: "#f59e0b" },
  { name: "Checkout Initiation Rate", formula: "Stripe checkout opens / Pricing page visits", target: ">8%", tier: "Bottom Funnel", color: "#8b5cf6" },
  { name: "Paid Conversion Rate", formula: "Paid members / Checkout initiations", target: ">55%", tier: "Revenue", color: "#22c55e" },
  { name: "Revenue Per Visitor (RPV)", formula: "Total MRR / Unique monthly visitors", target: ">$0.45", tier: "North Star", color: "#ef4444" },
  { name: "Email → Paid (14-day)", formula: "Paid conversions from email / Emails captured", target: ">5%", tier: "Email Funnel", color: "#f97316" },
];

// ── Optimization loop ─────────────────────────────────────────────────────────
const OPT_LOOP = [
  { step: 1, label: "Hypothesize", icon: "💡", desc: "Identify ONE conversion drop-off point. Form a specific hypothesis: 'Changing X to Y will improve Z by N%.' Never test without a hypothesis.", color: "#f59e0b" },
  { step: 2, label: "Implement", icon: "⚙️", desc: "Build the variant. Use localStorage bucket assignment — rand() < 0.5 = A, else = B. Never split by day or week (time bias).", color: "#8b5cf6" },
  { step: 3, label: "Measure", icon: "📊", desc: "Run for minimum 7 days AND minimum 200 conversions per variant. Use base44.analytics.track() to log every interaction with the bucket ID.", color: "#06b6d4" },
  { step: 4, label: "Validate", icon: "✅", desc: "Calculate statistical significance (p<0.05). Use a chi-squared test on conversion rates. Reject results that don't hit sample size OR significance.", color: "#22c55e" },
  { step: 5, label: "Ship Winner", icon: "🚀", desc: "Set the winning variant as the new control. Archive the loser. Document what you learned about your audience.", color: "#f97316" },
  { step: 6, label: "Iterate", icon: "🔄", desc: "Move immediately to the next test in the roadmap. The compound effect of 4–6 wins per quarter is exponential — 10% × 10% × 10% = 33% total lift.", color: "#ef4444" },
];

// ── Implementation code snippets ──────────────────────────────────────────────
const CODE_SNIPPET = `// Drop into any page — bucket is sticky per session
function useABTest(testId, variants = ["A", "B"]) {
  const key = \`zarp_ab_\${testId}\`;
  const [bucket] = useState(() => {
    const saved = sessionStorage.getItem(key);
    if (saved) return saved;
    const assigned = variants[Math.floor(Math.random() * variants.length)];
    sessionStorage.setItem(key, assigned);
    // Log assignment
    base44.analytics.track({ eventName: "ab_test_assigned", properties: { testId, bucket: assigned } });
    return assigned;
  });
  const track = (event) => base44.analytics.track({ eventName: event, properties: { testId, bucket } });
  return { bucket, track };
}

// Usage in a component:
const { bucket, track } = useABTest("hl-01", ["A", "B", "C"]);
const HEADLINES = {
  A: "They Patented It. They Buried It. We Built the Vault.",
  B: "40+ Advanced EM Engineering Systems. All Sourced. All Buildable.",
  C: "The Engineering Library They Don't Want You to See.",
};
// Render: <h1>{HEADLINES[bucket]}</h1>
// On key action: track("cta_clicked")`;

// ── UI Helpers ────────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 hover:text-white transition-all flex-shrink-0 min-h-0">
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function TestCard({ test, phaseColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${phaseColor}, transparent)` }} />
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/30 transition-colors min-h-0">
        <div className="flex items-center gap-3">
          <FlaskConical size={14} style={{ color: phaseColor }} className="flex-shrink-0" />
          <div>
            <p className="text-white font-black text-sm">{test.name}</p>
            <p className="text-gray-500 text-xs">{test.page} · {test.element} · {test.duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-600">Primary metric</p>
            <p className="text-xs font-semibold" style={{ color: phaseColor }}>{test.metric}</p>
          </div>
          {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-4">
          {/* Why */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Why this test</p>
            <p className="text-gray-300 text-sm leading-relaxed">{test.why}</p>
          </div>

          {/* Variants */}
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Test variants</p>
          <div className="space-y-2 mb-4">
            {test.variants.map((v, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-2.5 bg-gray-800 rounded-lg">
                <div className="min-w-0">
                  <span className="text-xs font-black mr-2" style={{ color: phaseColor }}>{v.label}</span>
                  <span className="text-white text-sm">"{v.copy}"</span>
                  <p className="text-gray-500 text-xs mt-0.5 italic">{v.note}</p>
                </div>
                <CopyBtn text={v.copy} />
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2.5 bg-gray-800 rounded-lg text-xs">
              <p className="text-gray-600 mb-0.5">Sample size needed</p>
              <p className="text-white font-semibold">{test.sampleSize}</p>
            </div>
            <div className="p-2.5 bg-gray-800 rounded-lg text-xs">
              <p className="text-gray-600 mb-0.5">Win criteria</p>
              <p className="text-white font-semibold">{test.winCriteria}</p>
            </div>
          </div>

          <div className="p-2.5 bg-gray-800 rounded-lg text-xs">
            <p className="text-gray-600 mb-0.5">Implementation</p>
            <p className="text-gray-300">{test.implementation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ABTestingDashboard() {
  const [activeTab, setActiveTab] = useState("roadmap");

  const tabs = [
    { id: "roadmap", label: "Testing Roadmap", icon: <Target size={14} /> },
    { id: "metrics", label: "Measurement", icon: <BarChart2 size={14} /> },
    { id: "loop", label: "Optimization Loop", icon: <RotateCcw size={14} /> },
    { id: "code", label: "Implementation", icon: <Zap size={14} /> },
  ];

  const totalTests = TEST_ROADMAP.reduce((acc, p) => acc + p.tests.length, 0);

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
              <FlaskConical size={17} className="text-green-400" /> A/B Testing System
            </h1>
            <p className="text-gray-500 text-xs">{totalTests} tests · 4 phases · 16-week roadmap</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-green-900/40 border border-green-700 text-green-400 font-bold">🔒 ADMIN ONLY</span>
      </div>

      {/* KPI summary */}
      <div className="border-b border-gray-800 bg-gray-900/20 px-6 py-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Tests in roadmap", value: totalTests, color: "#22c55e", sub: "4 phases, 16 weeks" },
            { label: "Expected total lift", value: "35–60%", color: "#f59e0b", sub: "Compounded across all tests" },
            { label: "Revenue unlock at 10k/mo visitors", value: "$4k+/mo", color: "#8b5cf6", sub: "Via conversion optimization" },
            { label: "Minimum test duration", value: "7 days", color: "#06b6d4", sub: "Always wait for significance" },
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
                activeTab === t.id ? "border-green-400 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* ── Roadmap ── */}
        {activeTab === "roadmap" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">16-Week Testing Roadmap</h2>
              <p className="text-gray-500 text-sm">Ordered by impact potential. Never run more than 2 tests simultaneously — you'll lose the ability to attribute results.</p>
            </div>

            <div className="bg-gray-900 border border-yellow-900/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400">
                <span className="font-black text-yellow-300">Rule #1:</span> Test in funnel order (top → bottom). Winning a headline test is meaningless if your paywall kills the conversion later. Fix the biggest drop-off point first.
              </p>
            </div>

            <div className="space-y-8">
              {TEST_ROADMAP.map((phase) => (
                <div key={phase.phase}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-black flex-shrink-0"
                      style={{ backgroundColor: phase.color }}>
                      {phase.phase}
                    </div>
                    <div>
                      <h3 className="font-black text-white">{phase.title}</h3>
                      <p className="text-xs" style={{ color: phase.color }}>{phase.duration}</p>
                    </div>
                  </div>
                  <div className="space-y-3 ml-11">
                    {phase.tests.map(test => (
                      <TestCard key={test.id} test={test} phaseColor={phase.color} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Metrics ── */}
        {activeTab === "metrics" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Measurement Framework — What to Track</h2>
              <p className="text-gray-500 text-sm">Each test has ONE primary metric. Secondary metrics provide context but cannot override the primary. This prevents p-hacking.</p>
            </div>

            <div className="space-y-3 mb-8">
              {METRICS.map((m, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: `${m.color}15`, border: `1px solid ${m.color}30` }}>
                      <BarChart2 size={16} style={{ color: m.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-black text-sm">{m.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">Formula: {m.formula}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-600">{m.tier}</p>
                    <p className="font-black text-sm" style={{ color: m.color }}>{m.target}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Funnel visualization */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-black text-white mb-4">Conversion Funnel — Where Your Tests Live</h3>
              <div className="space-y-2">
                {[
                  { stage: "Unique Visitors", value: "10,000", test: "Headline tests fire here", color: "#06b6d4", width: "100%" },
                  { stage: "Email Captures", value: "500 (5%)", test: "Lead magnet timing tests", color: "#8b5cf6", width: "50%" },
                  { stage: "Paywall Views", value: "2,200 (22%)", test: "Paywall timing tests", color: "#f59e0b", width: "80%" },
                  { stage: "Checkout Opens", value: "176 (8%)", test: "CTA copy tests fire here", color: "#f97316", width: "60%" },
                  { stage: "Paid Members", value: "97 (55%)", test: "Pricing tier tests", color: "#22c55e", width: "40%" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 flex-shrink-0 text-right">
                      <p className="text-xs text-gray-400 font-semibold">{s.stage}</p>
                      <p className="text-xs font-black" style={{ color: s.color }}>{s.value}</p>
                    </div>
                    <div className="flex-1 bg-gray-800 rounded-full h-6 overflow-hidden">
                      <div className="h-full rounded-full flex items-center px-2" style={{ width: s.width, backgroundColor: `${s.color}30`, border: `1px solid ${s.color}50` }}>
                        <span className="text-xs text-gray-400 truncate">{s.test}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistical significance guide */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-black text-white mb-3 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-400" /> When to Call a Winner
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Minimum conversions", value: "200 per variant", note: "Never call a winner with fewer events" },
                  { label: "Minimum duration", value: "7 days", note: "Catches weekly behavioral cycles" },
                  { label: "Significance threshold", value: "p < 0.05", note: "95% confidence — use chi-squared test" },
                ].map((r, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-green-400 font-black text-base mb-0.5">{r.value}</p>
                    <p className="text-white text-xs font-bold">{r.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{r.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Optimization Loop ── */}
        {activeTab === "loop" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">The Optimization Loop</h2>
              <p className="text-gray-500 text-sm">6-step cycle. Each full loop takes 2–4 weeks. Run it 6–8 times per year. Compound effect: 6 wins at 10% each = 77% total lift.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {OPT_LOOP.map((s, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex gap-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 mb-2"
                      style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                      {s.icon}
                    </div>
                    <div className="text-xs font-black" style={{ color: s.color }}>Step {s.step}</div>
                  </div>
                  <div>
                    <h4 className="font-black text-white mb-1">{s.label}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Compounding math */}
            <div className="bg-gradient-to-r from-green-950/30 to-cyan-950/30 border border-green-800/30 rounded-xl p-6">
              <h3 className="font-black text-white mb-4 flex items-center gap-2">
                <TrendingUp size={15} className="text-green-400" /> The Compounding Math — Why You Do This
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { scenario: "1 win (10% lift)", rpv: "$0.50 → $0.55", extraMRR: "+$500/mo at 10k visitors", color: "#06b6d4" },
                  { scenario: "4 wins (compounded)", rpv: "$0.50 → $0.73", extraMRR: "+$2,300/mo at 10k visitors", color: "#8b5cf6" },
                  { scenario: "8 wins (compounded)", rpv: "$0.50 → $1.07", extraMRR: "+$5,700/mo at 10k visitors", color: "#22c55e" },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-900/60 rounded-xl p-4 text-center">
                    <p className="font-black text-xl mb-1" style={{ color: s.color }}>{s.extraMRR}</p>
                    <p className="text-white text-xs font-bold">{s.scenario}</p>
                    <p className="text-gray-500 text-xs mt-0.5">RPV: {s.rpv}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs">Based on current baseline RPV of ~$0.50/visitor. Tests are multiplicative, not additive — each win raises the baseline for the next test.</p>
            </div>
          </div>
        )}

        {/* ── Implementation ── */}
        {activeTab === "code" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Implementation — Drop-In A/B Hook</h2>
              <p className="text-gray-500 text-sm">One reusable hook handles bucket assignment, session persistence, and analytics tracking. Drop it into any page in 2 lines.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-800/50">
                <span className="text-xs font-bold text-gray-400">hooks/useABTest.js — paste into your project</span>
                <CopyBtn text={CODE_SNIPPET} />
              </div>
              <pre className="p-5 text-xs text-cyan-300 overflow-x-auto leading-relaxed">{CODE_SNIPPET}</pre>
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-white">Priority Setup Checklist</h3>
              {[
                { done: false, task: "Create hooks/useABTest.js with the hook above", when: "Today", priority: "critical" },
                { done: false, task: "Add bucket tracking to base44.analytics.track() on every key CTA click", when: "Today", priority: "critical" },
                { done: false, task: "Set up hl-01 (Landing headline test) — 3 variants, track email opt-in by bucket", when: "Week 1", priority: "high" },
                { done: false, task: "Set up hl-02 (Paywall CTA test) — 3 variants, track checkout initiation by bucket", when: "Week 1", priority: "high" },
                { done: false, task: "Review analytics after 7 days — check if sample sizes are sufficient", when: "Week 2", priority: "medium" },
                { done: false, task: "Call first winner with p<0.05. Set as new control.", when: "Week 2–3", priority: "medium" },
                { done: false, task: "Start Phase 2 (pricing tests) immediately after Phase 1 winner is shipped", when: "Week 5", priority: "medium" },
              ].map((item, i) => (
                <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                  item.priority === "critical" ? "border-red-900/50 bg-red-950/10" :
                  item.priority === "high" ? "border-yellow-900/50 bg-yellow-950/10" :
                  "border-gray-800 bg-gray-900"
                }`}>
                  <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 ${
                    item.priority === "critical" ? "border-red-600" :
                    item.priority === "high" ? "border-yellow-600" : "border-gray-600"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{item.task}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.when}</p>
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded flex-shrink-0 ${
                    item.priority === "critical" ? "bg-red-900/40 text-red-400" :
                    item.priority === "high" ? "bg-yellow-900/40 text-yellow-400" :
                    "bg-gray-800 text-gray-500"
                  }`}>{item.priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}