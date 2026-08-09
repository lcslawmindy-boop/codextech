import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Zap, Crown, Beaker, Rocket } from "lucide-react";

const TIERS = [
  {
    id: "explorer",
    name: "Explorer",
    price: 29,
    period: "mo",
    icon: Rocket,
    color: "#22c55e",
    tagline: "Entry-level research access",
    features: [
      "Concept graph & research database",
      "Prior art archive (read-only)",
      "Invention library browse",
      "Community forum access",
      "5 AI research queries / month",
    ],
    cta: "Start Explorer",
  },
  {
    id: "research-lab",
    name: "Research Lab",
    price: 49,
    period: "mo",
    icon: Beaker,
    color: "#06b6d4",
    tagline: "Active researcher toolkit",
    features: [
      "Everything in Explorer",
      "Scalar EM lab simulator",
      "Patent claims generator",
      "EMF exposure logging",
      "50 AI research queries / month",
      "Build plan downloads (5/mo)",
    ],
    cta: "Start Research Lab",
    popular: true,
  },
  {
    id: "pro-builder",
    name: "Pro Builder",
    price: 149,
    period: "mo",
    icon: Zap,
    color: "#f59e0b",
    tagline: "Full IP creation engine",
    features: [
      "Everything in Research Lab",
      "Patent drafting wizard",
      "Investor portal & CRM",
      "Invention forge (unlimited)",
      "Valuation dashboard",
      "Unlimited AI research queries",
      "Technical brief pack generation",
    ],
    cta: "Start Pro Builder",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 497,
    period: "mo",
    icon: Crown,
    color: "#a855f7",
    tagline: "Institutional & defense-grade",
    features: [
      "Everything in Pro Builder",
      "VDR (Virtual Data Room) suite",
      "Acquisition CRM & outreach",
      "Multi-seat team licenses",
      "Dedicated support engineer",
      "Custom integrations & API",
      "White-label SaaS option",
    ],
    cta: "Contact Sales",
  },
];

export default function MembershipTiers() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-16 px-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-950/40 border border-green-800/50 text-green-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Zap size={12} /> Membership Tiers
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Choose Your Research Access Level</h2>
          <p className="text-gray-500 text-sm">Monthly membership — upgrade, downgrade, or cancel anytime</p>
          <div className="inline-flex items-center gap-2 mt-4 bg-gray-900 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${!annual ? "bg-gray-700 text-white" : "text-gray-500"}`}
            >Monthly</button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${annual ? "bg-gray-700 text-white" : "text-gray-500"}`}
            >Annual <span className="text-green-400">(-17%)</span></button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const displayPrice = annual ? Math.round(tier.price * 10) : tier.price;
            return (
              <div
                key={tier.id}
                className={`relative bg-gray-900 border rounded-2xl p-6 flex flex-col transition-all hover:scale-[1.02] ${
                  tier.popular ? "border-cyan-500 shadow-lg shadow-cyan-900/20" : "border-gray-800"
                }`}
                style={tier.popular ? { boxShadow: "0 0 30px rgba(6,182,212,0.15)" } : {}}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500 text-white text-[10px] font-black uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tier.color}20`, border: `1px solid ${tier.color}40` }}>
                    <Icon size={16} style={{ color: tier.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base">{tier.name}</h3>
                    <p className="text-gray-600 text-[10px]">{tier.tagline}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black text-white">${displayPrice}</span>
                  <span className="text-gray-500 text-sm">/{annual ? "yr" : "mo"}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-xs leading-relaxed">
                      <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/pricing"
                  className={`block text-center py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    tier.popular
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>
        <p className="text-center text-gray-600 text-xs mt-6">
          All plans include access to the research database · Not for Sale items are research-member only · Cancel anytime
        </p>
      </div>
    </section>
  );
}