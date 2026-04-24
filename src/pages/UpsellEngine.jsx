/**
 * UpsellEngine — Admin-only page
 * Full upsell system: bundles, triggers, copy, pricing psychology, cross-sell map
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ShoppingCart, Zap, Copy, Check, ChevronDown, ChevronUp,
  TrendingUp, Package, Star, ArrowRight, Target, AlertTriangle, RefreshCw
} from "lucide-react";

// ── Bundle configs ─────────────────────────────────────────────────────────────
const BUNDLES = [
  {
    id: "starter-bundle",
    name: "The Builder Starter Bundle",
    badge: "Best Entry Point",
    badgeColor: "#06b6d4",
    items: ["Scalar EM Lab Starter Kit ($167)", "Advanced EM Assembly Tool Kit ($127)"],
    individual: 294,
    bundle: 234,
    saving: 60,
    savingPct: "20%",
    headline: "Everything you need to start building — no excuses",
    copy: "Your bench. Your tools. Shipped together. The two kits every new builder orders within the first week — you might as well save $60.",
    bestFor: "New members, Starter tier",
    upsellTo: "MEG Replication Kit",
    priceAnchor: "vs $294 separately",
    psychology: "Price anchoring + bundling removes decision fatigue. Two low-risk items combined feel like a deal.",
  },
  {
    id: "meg-bundle",
    name: "The MEG Complete Build Bundle",
    badge: "Most Popular",
    badgeColor: "#8b5cf6",
    items: ["MEG Replication Parts Kit ($287)", "Advanced EM Assembly Tool Kit ($127)", "Scalar EM Lab Starter Kit ($167)"],
    individual: 581,
    bundle: 447,
    saving: 134,
    savingPct: "23%",
    headline: "Everything to replicate the MEG from day one",
    copy: "Device parts + bench setup + assembly tools. The three kits every serious MEG builder ends up buying — just do it in one order and save $134.",
    bestFor: "Pro members, active builders",
    upsellTo: "TRD-1 Telomere Device Kit (next device)",
    priceAnchor: "vs $581 separately",
    psychology: "Anchor at $581. Bundle at $447. The $134 saving is psychologically significant. Also reduces shipping to one order.",
  },
  {
    id: "lab-bundle",
    name: "The Full Research Lab Bundle",
    badge: "Elite Value",
    badgeColor: "#f59e0b",
    items: ["MEG Replication Parts Kit ($287)", "Prioré Device Component Bundle ($349)", "Scalar EM Lab Starter Kit ($167)", "Advanced EM Assembly Tool Kit ($127)"],
    individual: 930,
    bundle: 697,
    saving: 233,
    savingPct: "25%",
    headline: "Two complete devices + full bench setup",
    copy: "This is the full lab setup. MEG + Prioré + bench. Two peer-reviewed devices, one order. The $233 saving covers more than a month of Pro membership.",
    bestFor: "Elite members, serious researchers",
    upsellTo: "TRZ Reactor Components (advanced path)",
    priceAnchor: "vs $930 separately",
    psychology: "Top-of-ladder anchor. Makes the $697 feel like a bargain. $233 saving is concrete and large. Reserved for high-intent buyers.",
  },
];

// ── Upsell triggers ────────────────────────────────────────────────────────────
const TRIGGERS = [
  {
    when: "After membership checkout",
    where: "PostPurchaseOnboarding page (/checkout)",
    kit: "MEG Replication Parts Kit or Starter Bundle",
    timing: "Immediate — modal fires within 2 seconds of page load",
    copy: {
      headline: "One More Thing Before You Go",
      sub: "You just unlocked 40 build plans. Here's what most members order next:",
      cta: "Add the MEG Parts Kit — $287",
      dismiss: "No thanks, I'll source parts myself",
    },
    psychology: "Peak excitement moment — just converted. Buying energy is highest. One-click add feels frictionless vs. a separate decision later.",
    expectedCVR: "18–24%",
    badge: "Highest CVR",
    badgeColor: "#22c55e",
  },
  {
    when: "After viewing a build plan 3+ times",
    where: "InventionPlans page — fires on 3rd open of same plan",
    kit: "Matching kit for that build plan",
    timing: "1.5s delay after page load on 3rd view",
    copy: {
      headline: "You've Viewed This 3 Times — You're Ready to Build",
      sub: "The parts kit pairs directly with this build plan. Everything sourced, tested, bundled.",
      cta: "Get the Kit — $287 · Free US Shipping",
      dismiss: "Not yet",
    },
    psychology: "Behavioral intent signal. 3 views = strong interest. The gap between 'planning' and 'doing' is parts. Close it now.",
    expectedCVR: "12–16%",
    badge: "Intent Signal",
    badgeColor: "#8b5cf6",
  },
  {
    when: "After downloading a build plan PDF",
    where: "InventionPlans — fires after PDF download button click",
    kit: "Matching kit for downloaded plan",
    timing: "Inline banner below download confirmation",
    copy: {
      headline: "PDF Downloaded — Now Get the Parts",
      sub: "The build plan is in your hands. The parts kit ships in 5–7 days.",
      cta: "Order the Parts Kit — $287",
      dismiss: "I'll source my own",
    },
    psychology: "Action-to-action momentum. They just committed to downloading. Natural next step is ordering parts.",
    expectedCVR: "9–13%",
    badge: "Action Follow",
    badgeColor: "#f59e0b",
  },
  {
    when: "After viewing the shop without buying",
    where: "BuildSuppliesShop — exit intent (mouse toward top of page)",
    kit: "Starter Bundle (lowest risk entry point)",
    timing: "Exit intent detection",
    copy: {
      headline: "Before You Go — The Starter Bundle Ships Tomorrow",
      sub: "Lab kit + tools. $294 separately. $234 together. Free shipping.",
      cta: "Grab the Bundle — $234",
      dismiss: "I'll come back later",
    },
    psychology: "Exit intent is last-chance conversion. Offer the lowest-barrier bundle. $234 vs $287 feels safer as first purchase.",
    expectedCVR: "6–9%",
    badge: "Exit Capture",
    badgeColor: "#ef4444",
  },
  {
    when: "30 days after first kit purchase",
    where: "Email — triggered by Stripe webhook on purchase date + 30 days",
    kit: "Next device in progression path",
    timing: "Email — subject: 'Ready to build your second device?'",
    copy: {
      headline: "Your MEG kit should be built by now",
      sub: "Most builders who complete the MEG move to the Prioré or TRD-1 next. Here's why, and here's the kit.",
      cta: "See the Prioré Bundle — $349",
      dismiss: "N/A — email link",
    },
    psychology: "Post-build momentum. First successful build creates confidence. Ride the 'I did it' high into the next purchase.",
    expectedCVR: "14–20% on email click",
    badge: "Post-Build",
    badgeColor: "#06b6d4",
  },
];

// ── Cross-sell map ─────────────────────────────────────────────────────────────
const CROSS_SELL_MAP = [
  { bought: "MEG Replication Kit", crossSell: "Advanced EM Assembly Tool Kit", reason: "They need tools to assemble it", urgency: "Order before your kit arrives" },
  { bought: "MEG Replication Kit", crossSell: "Scalar EM Lab Starter Kit", reason: "Bench setup needed for testing", urgency: "Set up your lab first" },
  { bought: "Scalar EM Lab Starter Kit", crossSell: "MEG Replication Kit", reason: "Logical next step — they have the bench", urgency: "Start your first device build" },
  { bought: "Advanced EM Assembly Tool Kit", crossSell: "MEG Replication Kit", reason: "They have tools — now they need a device", urgency: "Put those tools to work" },
  { bought: "TRD-1 Telomere Device Kit", crossSell: "EMF Protection & Shielding Kit", reason: "Working with EM fields — protection is logical", urgency: "Protect yourself while you build" },
  { bought: "Prioré Device Component Bundle", crossSell: "Advanced EM Assembly Tool Kit", reason: "Advanced device needs professional tools", urgency: "Don't cheap out on the assembly" },
  { bought: "EMF Protection Kit", crossSell: "Scalar EM Lab Starter Kit", reason: "They're EMF-aware — now get a lab bench", urgency: "Study what you're protecting against" },
];

// ── Pricing psychology rules ───────────────────────────────────────────────────
const PRICING_RULES = [
  {
    rule: "Always show the individual price first",
    example: "~~$294~~ → $234 (bundle)",
    why: "The strikethrough creates an immediate anchor. The saving feels real, not constructed.",
    color: "#ef4444",
  },
  {
    rule: "Lead with the saving in dollars, not percent",
    example: "Save $134 (not 'save 23%')",
    why: "$134 is concrete. 23% is abstract. Dollar savings feel more real, especially at this price point.",
    color: "#f59e0b",
  },
  {
    rule: "Mid-tier bundle should be the obvious choice",
    example: "$234 Starter vs $447 MEG Bundle vs $697 Full Lab",
    why: "Price bracketing — most buyers pick the middle option. Place your best-margin bundle in the center.",
    color: "#8b5cf6",
  },
  {
    rule: "Never discount the individual kit price",
    example: "Bundles only — never 'MEG kit on sale'",
    why: "Discounting individual items trains buyers to wait for sales. Bundle discounts feel like a bonus, not a markdown.",
    color: "#22c55e",
  },
  {
    rule: "Shipping urgency beats discount urgency",
    example: "'Ships in 48 hours' > '10% off today only'",
    why: "Shipping timelines create real urgency. Fake discount countdowns erode trust. ZARP's audience is sophisticated.",
    color: "#06b6d4",
  },
  {
    rule: "Dismiss copy should reinforce the loss",
    example: "'No thanks, I'll source parts myself' > 'Close'",
    why: "The dismiss copy should make the user feel what they're giving up. 'Sourcing yourself' implies work. The kit implies ease.",
    color: "#f97316",
  },
];

// ── UI ─────────────────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 hover:text-white transition-all flex-shrink-0">
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function BundleCard({ bundle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${bundle.badgeColor}, transparent)` }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-black px-2 py-0.5 rounded mb-2 inline-block"
              style={{ backgroundColor: `${bundle.badgeColor}20`, color: bundle.badgeColor }}>
              {bundle.badge}
            </span>
            <h3 className="text-white font-black text-base">{bundle.name}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{bundle.bestFor}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <p className="text-gray-600 line-through text-sm">${bundle.individual}</p>
            <p className="font-black text-2xl" style={{ color: bundle.badgeColor }}>${bundle.bundle}</p>
            <p className="text-green-400 text-xs font-black">Save ${bundle.saving}</p>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-3 italic">"{bundle.copy}"</p>

        <div className="space-y-1 mb-4">
          {bundle.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
              <Check size={10} className="text-green-400 flex-shrink-0" /> {item}
            </div>
          ))}
        </div>

        <button onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {open ? "Hide" : "Show"} pricing psychology
        </button>

        {open && (
          <div className="mt-3 p-3 bg-gray-800 rounded-xl">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Psychology note</p>
            <p className="text-gray-300 text-xs leading-relaxed">{bundle.psychology}</p>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-500">→ Upsell next: <span className="text-yellow-400 font-bold">{bundle.upsellTo}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TriggerCard({ trigger }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-3 p-5 text-left hover:bg-gray-800/20 transition-colors min-h-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-black px-2 py-0.5 rounded"
              style={{ backgroundColor: `${trigger.badgeColor}20`, color: trigger.badgeColor }}>
              {trigger.badge}
            </span>
            <span className="text-xs text-gray-600">Expected CVR: <span className="text-white font-bold">{trigger.expectedCVR}</span></span>
          </div>
          <p className="text-white font-bold text-sm">{trigger.when}</p>
          <p className="text-gray-500 text-xs mt-0.5">{trigger.where}</p>
        </div>
        {open ? <ChevronUp size={14} className="text-gray-500 flex-shrink-0 mt-1" /> : <ChevronDown size={14} className="text-gray-500 flex-shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="border-t border-gray-800 p-5 space-y-4">
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Exact Copy</p>
            <div className="space-y-2">
              {[
                { label: "Headline", value: trigger.copy.headline },
                { label: "Sub", value: trigger.copy.sub },
                { label: "CTA", value: trigger.copy.cta },
                { label: "Dismiss", value: trigger.copy.dismiss },
              ].map((row, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-2.5 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-gray-600 text-xs mb-0.5">{row.label}</p>
                    <p className="text-white text-sm">{row.value}</p>
                  </div>
                  <CopyBtn text={row.value} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-purple-950/30 border border-purple-800/30 rounded-xl">
            <p className="text-xs font-black text-purple-300 mb-1">Psychology mechanism</p>
            <p className="text-gray-300 text-xs leading-relaxed">{trigger.psychology}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-gray-800 rounded-lg">
              <p className="text-gray-600 mb-0.5">Timing</p>
              <p className="text-white font-semibold">{trigger.timing}</p>
            </div>
            <div className="p-2.5 bg-gray-800 rounded-lg">
              <p className="text-gray-600 mb-0.5">Recommended Kit</p>
              <p className="text-white font-semibold">{trigger.kit}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function UpsellEngine() {
  const [activeTab, setActiveTab] = useState("bundles");

  const tabs = [
    { id: "bundles", label: "Bundle Configs", icon: <Package size={14} /> },
    { id: "triggers", label: "Upsell Triggers", icon: <Target size={14} /> },
    { id: "crosssell", label: "Cross-Sell Map", icon: <RefreshCw size={14} /> },
    { id: "psychology", label: "Pricing Rules", icon: <TrendingUp size={14} /> },
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
              <ShoppingCart size={17} className="text-yellow-400" /> Upsell Engine
            </h1>
            <p className="text-gray-500 text-xs">Bundle configs · Triggers · Cross-sell map · Pricing psychology</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/build-supplies-shop" className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-colors">
            View Shop →
          </Link>
          <span className="text-xs px-3 py-1.5 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-400 font-bold">🔒 ADMIN ONLY</span>
        </div>
      </div>

      {/* KPI bar */}
      <div className="border-b border-gray-800 bg-gray-900/30 px-6 py-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Post-purchase CVR target", value: "20%", color: "#22c55e", sub: "Industry avg: 8–12%" },
            { label: "Build-view CVR target", value: "14%", color: "#8b5cf6", sub: "After 3rd plan view" },
            { label: "Bundle AOV lift", value: "+68%", color: "#f59e0b", sub: "vs single kit purchase" },
            { label: "Cross-sell email CVR", value: "17%", color: "#06b6d4", sub: "30-day post-purchase" },
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
                activeTab === t.id ? "border-yellow-400 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* ── Bundles ── */}
        {activeTab === "bundles" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Bundle Configurations</h2>
              <p className="text-gray-500 text-sm">Three tiers: entry, mid, top. Price-bracket the mid tier as the obvious choice. Expand each card for the psychology logic and next upsell path.</p>
            </div>
            <div className="bg-gray-900 border border-yellow-900/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400">
                <span className="font-black text-yellow-300">Core rule:</span> Never discount individual kits. Bundle savings only.
                This protects perceived value of individual products and trains buyers to buy bundles for deals.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {BUNDLES.map((b, i) => <BundleCard key={i} bundle={b} />)}
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-black text-white mb-3">Bundle Upsell Ladder</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm">
                {[
                  { label: "Starter Bundle", price: "$234", color: "#06b6d4" },
                  { label: "MEG Complete Bundle", price: "$447", color: "#8b5cf6" },
                  { label: "Full Lab Bundle", price: "$697", color: "#f59e0b" },
                  { label: "Elite + Annual Plan", price: "$1,738/yr", color: "#ef4444" },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="px-3 py-2 rounded-xl border text-xs font-black" style={{ borderColor: `${step.color}50`, color: step.color, backgroundColor: `${step.color}10` }}>
                      <p>{step.label}</p>
                      <p className="text-white">{step.price}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight size={12} className="text-gray-700 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Triggers ── */}
        {activeTab === "triggers" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Upsell Trigger Playbook</h2>
              <p className="text-gray-500 text-sm">Five behavioral triggers. Each fires at a different moment of peak intent. Expand any card for exact copy, implementation details, and the psychology behind it.</p>
            </div>
            <div className="bg-gray-900 border border-cyan-900/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Zap size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400">
                <span className="font-black text-cyan-300">Priority order:</span> Post-purchase first, then build-view, then PDF download.
                The <code className="text-xs bg-gray-800 px-1 rounded">KitUpsellModal</code> component is ready to drop into any page.
              </p>
            </div>
            <div className="space-y-3">
              {TRIGGERS.map((t, i) => <TriggerCard key={i} trigger={t} />)}
            </div>
          </div>
        )}

        {/* ── Cross-sell ── */}
        {activeTab === "crosssell" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Cross-Sell Map</h2>
              <p className="text-gray-500 text-sm">
                What to offer after each kit purchase. Triggered via Stripe webhook → email sequence.
                Wire to ConvertKit or ActiveCampaign with purchase tag-based automation.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
              <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-3 gap-4 text-xs font-black uppercase tracking-wider text-gray-500">
                <span>Bought</span><span>Offer Next</span><span>Urgency Copy</span>
              </div>
              {CROSS_SELL_MAP.map((row, i) => (
                <div key={i} className={`px-5 py-4 grid grid-cols-3 gap-4 border-b border-gray-800 last:border-0 ${i % 2 === 0 ? "bg-gray-900/40" : ""}`}>
                  <span className="text-white text-sm font-semibold">{row.bought}</span>
                  <div>
                    <p className="text-cyan-300 text-sm font-bold">{row.crossSell}</p>
                    <p className="text-gray-600 text-xs">{row.reason}</p>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-yellow-300 text-xs font-bold italic">"{row.urgency}"</p>
                    <CopyBtn text={row.urgency} />
                  </div>
                </div>
              ))}
            </div>

            {/* Email sequence trigger */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-black text-white mb-3 flex items-center gap-2">
                <RefreshCw size={15} className="text-cyan-400" /> Post-Purchase Email Sequence (30-day cross-sell)
              </h3>
              <div className="space-y-2">
                {[
                  { day: "Day 1", action: "Order confirmation + shipping ETA", type: "Transactional" },
                  { day: "Day 4", action: "Build prep guide for their kit ('Before your kit arrives…')", type: "Engagement" },
                  { day: "Day 10", action: "Cross-sell offer — next logical kit at 10% bundle price", type: "Revenue" },
                  { day: "Day 21", action: "Assembly check-in — 'How's the build going?' + troubleshooting link", type: "Retention" },
                  { day: "Day 30", action: "Second device suggestion — 'Ready for your next build?'", type: "Revenue" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-800 rounded-xl">
                    <span className="text-cyan-400 font-black text-xs w-12 flex-shrink-0">{row.day}</span>
                    <span className="text-white text-sm flex-1">{row.action}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${
                      row.type === "Revenue" ? "bg-green-950/40 text-green-400"
                      : row.type === "Engagement" ? "bg-blue-950/40 text-blue-400"
                      : row.type === "Retention" ? "bg-purple-950/40 text-purple-400"
                      : "bg-gray-700 text-gray-400"
                    }`}>{row.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Psychology ── */}
        {activeTab === "psychology" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black mb-1">Pricing Psychology Rules</h2>
              <p className="text-gray-500 text-sm">
                Six rules that govern all upsell copy, bundle pricing, and modal design. ZARP's buyer is intelligent — no fake urgency, no dark patterns. Honest pricing psychology only.
              </p>
            </div>
            <div className="space-y-3 mb-8">
              {PRICING_RULES.map((rule, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${rule.color}20`, color: rule.color, border: `1px solid ${rule.color}40` }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-black mb-1">{rule.rule}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-300">{rule.example}</code>
                      <CopyBtn text={rule.example} />
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{rule.why}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue math */}
            <div className="bg-gradient-to-r from-green-950/30 to-cyan-950/30 border border-green-800/30 rounded-xl p-6">
              <h3 className="font-black text-white mb-4 flex items-center gap-2">
                <TrendingUp size={15} className="text-green-400" /> Upsell Revenue Math (at 500 members)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Post-purchase upsell (20% CVR × 500 members × $287 avg)", value: "$28,700", sub: "One-time, from membership cohort" },
                  { label: "Build-view modal (14% CVR × 300 viewers × $287)", value: "$12,054", sub: "Per month, ongoing" },
                  { label: "30-day cross-sell email (17% CVR × kit buyers × $247 avg)", value: "+$4,200", sub: "Recurring, compounding monthly" },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-900/60 rounded-xl p-4">
                    <p className="text-green-400 font-black text-xl">{s.value}</p>
                    <p className="text-gray-400 text-xs mt-1 leading-snug">{s.label}</p>
                    <p className="text-gray-600 text-xs mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs">
                Combined kit revenue potential at 500 members: <span className="text-white font-black">$44,954+</span> in the first 90 days,
                separate from subscription MRR ($39,500/mo). The upsell engine is a second revenue stream, not a side feature.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}