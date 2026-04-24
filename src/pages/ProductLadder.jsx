import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, DollarSign, TrendingUp, Zap, Target, ChevronRight, Award, Users, Clock, Star } from "lucide-react";

const LADDER = [
  {
    tier: 1,
    label: "Entry Product",
    name: "Free Vault + Lead Magnet",
    price: "$0",
    priceNote: "Free",
    color: "#06b6d4",
    borderColor: "border-cyan-700",
    bgColor: "bg-cyan-900/10",
    icon: "🔓",
    goal: "Lead capture. Qualify. Build trust.",
    description: "Low-friction entry point. The Free Vault gives away 1–2 full build plans and 5 prior art entries. The email lead magnet (free build guide) captures contacts for the email funnel.",
    conversionTarget: "20–35% of visitors → email list",
    avgTimeInTier: "0–7 days",
    exitTrigger: "Email funnel Day 3+ or paywall hit",
    products: [
      { name: "Free Vault", price: "$0", desc: "1 build plan, 5 prior art entries, EM simulator" },
      { name: "Lead Magnet PDF", price: "$0", desc: "Free build guide gated by email capture" },
    ],
    upsellTo: "Member Subscription",
    upsellMessage: "You've seen what's possible. Here's the full vault.",
    psychology: ["Curiosity gap", "Reciprocity (free value first)", "Social proof on free tier creates trust"],
    tactics: [
      "Show blurred previews of locked content",
      "View counter paywall after 2 content views",
      "Email sequence starts immediately on capture",
      "Urgency countdown on founding member rate"
    ]
  },
  {
    tier: 2,
    label: "Core Offer",
    name: "Member Subscription",
    price: "$49",
    priceNote: "/month (founding) · $99/mo regular",
    color: "#8b5cf6",
    borderColor: "border-purple-700",
    bgColor: "bg-purple-900/10",
    icon: "⚡",
    goal: "Primary revenue engine. Recurring MRR.",
    description: "The main offer. Full vault access — all build plans, courses, AI tools, prior art archive, and lab simulators. Founding member pricing creates urgency and locks in LTV.",
    conversionTarget: "8–14% of email list → paid member",
    avgTimeInTier: "3–18 months average",
    exitTrigger: "Natural upsell after 30–60 days of active use",
    products: [
      { name: "ZARP Member", price: "$49/mo", desc: "Full vault: 40+ builds, 40+ courses, AI patent tools" },
      { name: "Annual Member", price: "$490/yr", desc: "2 months free — for high-intent buyers" },
    ],
    upsellTo: "Physical Kit + High-Ticket",
    upsellMessage: "You've mastered the plans. Now build the real thing.",
    psychology: ["Loss aversion on founding rate", "Exclusivity (1,000 member cap)", "Sunk cost investment builds commitment"],
    tactics: [
      "Founding member countdown creates real urgency",
      "Clear value stack ($27,800+ for $49/mo)",
      "Cancel anytime removes risk perception",
      "Immediate post-purchase onboarding maintains momentum"
    ]
  },
  {
    tier: 3,
    label: "Mid-Ticket Upsell",
    name: "Physical Build Kits",
    price: "$89–$389",
    priceNote: "one-time per kit",
    color: "#f59e0b",
    borderColor: "border-yellow-700",
    bgColor: "bg-yellow-900/10",
    icon: "🔧",
    goal: "Increase LTV. Serve action-takers. Move members from digital → physical.",
    description: "Members who've studied the plans want to build. Physical kits — pre-sourced, pre-specified, ready to assemble — eliminate the friction of sourcing components individually.",
    conversionTarget: "15–25% of active members → at least 1 kit",
    avgTimeInTier: "30–90 days post-membership",
    exitTrigger: "After first successful build, hunger for advanced systems",
    products: [
      { name: "Scalar EM Lab Starter Kit", price: "$167", desc: "Foundation circuit kit for first builds" },
      { name: "MEG Replication Parts Kit", price: "$287", desc: "Complete components for COP>1 device" },
      { name: "Prioré Device Component Bundle", price: "$349", desc: "Multichannel EM therapy system parts" },
      { name: "TRZ Reactor Starter Components", price: "$389", desc: "Advanced reactor core assembly" },
    ],
    upsellTo: "High-Ticket Systems",
    upsellMessage: "You've built the prototype. Ready for the full engineering system?",
    psychology: ["Identity shift (builder not just reader)", "Progress creates appetite for more", "Physical ownership anchors value"],
    tactics: [
      "Upsell within member dashboard after 30 days",
      "Kit recommendations based on build plans accessed",
      "Bundle discount (kit + related course) increases AOV",
      "Testimonials from kit builders shown in dashboard"
    ]
  },
  {
    tier: 4,
    label: "High-Ticket Upsell",
    name: "Institutional & Licensing",
    price: "$2,000–$50,000+",
    priceNote: "per engagement",
    color: "#ef4444",
    borderColor: "border-red-700",
    bgColor: "bg-red-900/10",
    icon: "🏛",
    goal: "Capture maximum LTV from high-value buyers (defense, biotech, research institutions).",
    description: "Defense contractors, research institutions, and government agencies need more than membership. They need custom licensing, NDA engagements, VDR access, and dedicated support for restricted technologies.",
    conversionTarget: "1–3% of total members → institutional inquiry",
    avgTimeInTier: "6–24 month sales cycles",
    exitTrigger: "N/A — this is the ceiling",
    products: [
      { name: "Institutional Tech Licensing", price: "$10,000–$50,000+", desc: "Defense contractor access to restricted systems" },
      { name: "Custom Research Engagement", price: "$5,000–$25,000", desc: "Dedicated engineering consultation + VDR access" },
      { name: "White-Label Platform License", price: "$2,000/mo+", desc: "Platform licensing for institutional deployment" },
    ],
    upsellTo: "N/A — Top of Ladder",
    upsellMessage: "The ceiling for institutional buyers is the sky.",
    psychology: ["Exclusivity and scarcity of access", "Authority positioning through member community", "Vetting process increases perceived value"],
    tactics: [
      "Institutional licensing page with vetting form",
      "Defense contractor keywords in SEO/content",
      "Verified Inventor badges increase platform credibility",
      "VDR system enables secure IP sharing in diligence"
    ]
  }
];

const MRR_MODEL = [
  { members: 100, mrr: 4900, arr: 58800, kitRevenue: 8700, note: "Early traction" },
  { members: 250, mrr: 12250, arr: 147000, kitRevenue: 21750, note: "Product-market fit signal" },
  { members: 500, mrr: 24500, arr: 294000, kitRevenue: 43500, note: "Price increase justified" },
  { members: 1000, mrr: 49000, arr: 588000, kitRevenue: 87000, note: "Series A conversation territory" },
  { members: 2500, mrr: 99000, arr: 1188000, kitRevenue: 217500, note: "Scale: full price at $99/mo" },
];

export default function ProductLadder() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
        <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Admin
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-green-400" />
          <h1 className="text-white font-black text-lg">Product Ladder & Revenue Strategy</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Ladder Visual */}
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-2 text-center">The Revenue Ladder</h2>
          <p className="text-gray-500 text-sm text-center mb-10">Each tier feeds the next. Total LTV per customer: $500–$75,000+</p>

          <div className="space-y-4">
            {LADDER.map((step, i) => (
              <div key={step.tier}>
                <div
                  className={`border ${step.borderColor} ${step.bgColor} rounded-2xl p-6 cursor-pointer hover:opacity-90 transition-all`}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                >
                  <div className="flex items-center gap-4">
                    {/* Tier number */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-900">
                      {step.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: step.color }}>
                          Tier {step.tier} — {step.label}
                        </span>
                      </div>
                      <h3 className="text-white font-black text-lg">{step.name}</h3>
                      <p className="text-gray-400 text-sm hidden sm:block">{step.goal}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-black text-xl" style={{ color: step.color }}>{step.price}</div>
                      <div className="text-gray-500 text-xs">{step.priceNote}</div>
                    </div>

                    <ChevronRight size={16} className={`text-gray-500 flex-shrink-0 transition-transform ${activeStep === i ? "rotate-90" : ""}`} />
                  </div>

                  {activeStep === i && (
                    <div className="mt-6 border-t border-gray-800/50 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Description + Products */}
                      <div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">{step.description}</p>

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Products at this tier</p>
                        <div className="space-y-2 mb-4">
                          {step.products.map((p, j) => (
                            <div key={j} className="flex items-start justify-between gap-3 bg-gray-900/60 rounded-lg px-3 py-2">
                              <div>
                                <p className="text-white text-xs font-bold">{p.name}</p>
                                <p className="text-gray-500 text-xs">{p.desc}</p>
                              </div>
                              <span className="text-green-400 font-black text-xs flex-shrink-0">{p.price}</span>
                            </div>
                          ))}
                        </div>

                        {step.upsellTo !== "N/A — Top of Ladder" && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/60 border border-gray-700">
                            <ArrowRight size={14} style={{ color: step.color }} className="flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold" style={{ color: step.color }}>Upsell → {step.upsellTo}</p>
                              <p className="text-gray-500 text-xs italic">"{step.upsellMessage}"</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Metrics + Psychology */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-900/60 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Conversion Target</p>
                            <p className="text-white text-sm font-bold">{step.conversionTarget}</p>
                          </div>
                          <div className="bg-gray-900/60 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Avg Time in Tier</p>
                            <p className="text-white text-sm font-bold">{step.avgTimeInTier}</p>
                          </div>
                        </div>

                        <div className="bg-gray-900/60 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Psychology Triggers</p>
                          <ul className="space-y-1">
                            {step.psychology.map((p, j) => (
                              <li key={j} className="text-gray-300 text-xs flex items-start gap-2">
                                <span style={{ color: step.color }} className="flex-shrink-0 mt-0.5">•</span> {p}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gray-900/60 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Conversion Tactics</p>
                          <ul className="space-y-1">
                            {step.tactics.map((t, j) => (
                              <li key={j} className="text-gray-300 text-xs flex items-start gap-2">
                                <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span> {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Connector arrow */}
                {i < LADDER.length - 1 && (
                  <div className="flex items-center justify-center py-1">
                    <div className="w-px h-5 bg-gray-800" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MRR Model */}
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-2">Revenue Model Projections</h2>
          <p className="text-gray-500 text-sm mb-6">Subscription MRR + physical kit revenue (15% kit attach rate at avg $145/kit)</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 pr-4">Members</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 pr-4">MRR</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 pr-4">ARR</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 pr-4">Kit Revenue/mo</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {MRR_MODEL.map((row, i) => (
                  <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-900/40 transition-colors">
                    <td className="py-3 pr-4 font-bold text-white">{row.members.toLocaleString()}</td>
                    <td className="py-3 pr-4 font-bold text-green-400">${row.mrr.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-gray-300">${row.arr.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-yellow-400">${row.kitRevenue.toLocaleString()}</td>
                    <td className="py-3 text-gray-500 text-xs">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upsell Timing */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <Clock size={18} className="text-cyan-400" /> Upsell Timing Strategy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { time: "Day 0", action: "Capture email via lead magnet", color: "text-cyan-400" },
              { time: "Day 1–7", action: "7-day email funnel → convert to member", color: "text-blue-400" },
              { time: "Day 30", action: "In-dashboard kit upsell (first build completed?)", color: "text-yellow-400" },
              { time: "Day 60+", action: "Institutional inquiry form shown to power users", color: "text-red-400" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-4">
                <p className={`font-black text-sm mb-1 ${item.color}`}>{item.time}</p>
                <p className="text-gray-300 text-sm leading-snug">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}