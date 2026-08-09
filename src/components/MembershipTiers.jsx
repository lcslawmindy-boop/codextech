import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Zap, Crown, Beaker, Rocket } from "lucide-react";

const TIERS = [
  {
    name: "Explorer",
    icon: Beaker,
    color: "#22c55e",
    monthly: 29,
    annual: 288,
    tagline: "For independent researchers getting started",
    features: [
      "Full Concept Graph access (93 nodes)",
      "Prior Art Archive (50+ entries)",
      "Scalar EM Lab simulators",
      "AI Research Assistant (50 queries/mo)",
      "Community forum access",
      "Newsletter & research updates",
    ],
    cta: "Start Exploring",
    popular: false,
  },
  {
    name: "Research Lab",
    icon: Rocket,
    color: "#06b6d4",
    monthly: 49,
    annual: 468,
    tagline: "For serious researchers and builders",
    features: [
      "Everything in Explorer",
      "Patent Suite (drafting wizard, claims generator)",
      "Invention Library (20+ build plans)",
      "AI Research Assistant (unlimited)",
      "Device Gallery 3D & CAD views",
      "EMF Impact & health analytics",
    ],
    cta: "Upgrade to Research Lab",
    popular: true,
  },
  {
    name: "Pro Builder",
    icon: Zap,
    color: "#f59e0b",
    monthly: 149,
    annual: 1428,
    tagline: "For engineers and patent professionals",
    features: [
      "Everything in Research Lab",
      "Technical Brief Packs (full engineering docs)",
      "Therapy Pod Pro engineering package",
      "Patent Filing Wizard & FTO analysis",
      "Investor Portal + CRM",
      "Priority support & early access",
    ],
    cta: "Go Pro Builder",
    popular: false,
  },
  {
    name: "Apex Enterprise",
    icon: Crown,
    color: "#a855f7",
    monthly: 497,
    annual: 4764,
    tagline: "For labs, firms, and institutions",
    features: [
      "Everything in Pro Builder",
      "VDR (Virtual Data Room) with NDA gating",
      "Acquisition Suite (CRM, term sheets, exit advisor)",
      "Valuation Engine + API access",
      "White-label SaaS option",
      "Dedicated account manager & SLA",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function MembershipTiers() {
  const [billing, setBilling] = useState("monthly");

  return (
    <section className="py-14 px-6 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/50 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Check size={12} /> Membership
          </div>
          <h2 className="text-2xl font-black text-white">Choose Your Research Tier</h2>
          <p className="text-gray-500 text-sm mt-1">Monthly or annual — cancel anytime. All tiers include full research database access.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-gray-800 border border-gray-700 rounded-lg p-0.5 mt-4">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 rounded text-sm font-bold transition-colors ${billing === "monthly" ? "bg-gray-700 text-white" : "text-gray-400"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-4 py-1.5 rounded text-sm font-bold transition-colors ${billing === "annual" ? "bg-gray-700 text-white" : "text-gray-400"}`}
            >
              Annual <span className="text-green-400 text-xs">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const price = billing === "monthly" ? tier.monthly : tier.annual;
            const period = billing === "monthly" ? "/mo" : "/yr";
            return (
              <div
                key={i}
                className={`relative bg-gray-950 border rounded-2xl p-5 flex flex-col ${tier.popular ? "border-cyan-600 shadow-lg shadow-cyan-900/20" : "border-gray-800"}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-600 text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${tier.color}15`, border: `1px solid ${tier.color}30` }}>
                    <Icon size={18} style={{ color: tier.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{tier.name}</h3>
                    <p className="text-gray-600 text-[10px] leading-tight">{tier.tagline}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-black text-white">${price}</span>
                  <span className="text-gray-500 text-sm">{period}</span>
                </div>

                <ul className="space-y-2 mb-5 flex-1">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-400 text-xs leading-relaxed">
                      <Check size={12} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/pricing"
                  className={`block text-center py-2.5 rounded-xl text-sm font-bold transition-colors ${tier.popular ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"}`}
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}