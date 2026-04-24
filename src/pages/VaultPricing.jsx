import { Link } from "react-router-dom";
import { ArrowRight, Check, Star } from "lucide-react";

const TIERS = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    highlight: false,
    cta: "Start Free Trial",
    desc: "Perfect for exploring",
    features: [
      "15 build systems",
      "BOM previews",
      "Email support",
      "Community access",
      "Basic course library",
    ],
    notIncluded: [
      "Full video assembly",
      "Supplier sourcing",
      "Advanced builds",
    ],
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    highlight: true,
    cta: "Start Free Trial",
    desc: "Most popular",
    features: [
      "40+ complete builds",
      "Full BOMs & schematics",
      "Assembly videos included",
      "Supplier links & sourcing",
      "40+ courses",
      "Patent drafting suite",
      "200+ prior art entries",
      "Weekly new builds",
      "Priority email support",
    ],
    notIncluded: [
      "Early access",
    ],
  },
  {
    name: "Elite",
    price: "$199",
    period: "/month",
    highlight: false,
    cta: "Start Free Trial",
    desc: "Full acceleration",
    features: [
      "Everything in Pro",
      "Early access to new builds (48h)",
      "Advanced restricted systems",
      "Monthly 1-on-1 strategy call",
      "VIP community channel",
      "Direct engineering support",
      "Investor intro network",
      "Custom research requests",
    ],
    notIncluded: [],
  },
];

export default function VaultPricing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Header ── */}
      <div className="border-b border-gray-800 px-6 py-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Choose your tier. Cancel anytime. No hidden fees. Full 30-day money-back guarantee.
        </p>
      </div>

      {/* ── Pricing cards ── */}
      <div className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {TIERS.map((tier, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden transition-all ${
                tier.highlight
                  ? "md:scale-105 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-600 shadow-xl shadow-cyan-900/30 relative"
                  : "bg-gray-900 border border-gray-800"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-600 text-white text-xs font-black uppercase">
                  <Star size={11} className="inline mr-1" /> Recommended
                </div>
              )}

              <div className="p-8 border-b border-gray-800">
                <h2 className="text-2xl font-black mb-1">{tier.name}</h2>
                <p className="text-gray-500 text-sm mb-6">{tier.desc}</p>

                <div className="mb-6">
                  <div className="text-4xl font-black text-white">
                    {tier.price}
                    <span className="text-lg text-gray-500 font-normal">{tier.period}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Billed monthly. Cancel anytime.</p>
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
                    tier.highlight
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>

              {/* ── Features ── */}
              <div className="p-8 space-y-4">
                {tier.features.map((feat, j) => (
                  <div key={j} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                    {feat}
                  </div>
                ))}

                {tier.notIncluded.length > 0 && (
                  <div className="pt-4 border-t border-gray-800 space-y-3">
                    {tier.notIncluded.map((item, j) => (
                      <div key={j} className="flex items-start gap-3 text-sm text-gray-600">
                        <div className="w-4 h-4 rounded-full border border-gray-700 flex-shrink-0 mt-0.5" />
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">Common Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I try before buying?",
                a: "Yes. All plans come with a 30-day money-back guarantee. Try any tier, and if you're not satisfied, we'll refund your full membership cost—no questions asked.",
              },
              {
                q: "Do you offer annual discounts?",
                a: "Not currently, but we offer monthly billing with full flexibility. You can upgrade, downgrade, or cancel anytime. Some customers commit to annual at their own choice for continuity.",
              },
              {
                q: "What if I upgrade mid-month?",
                a: "Upgrades are prorated. If you upgrade to Pro, you'll pay the difference from today until your next billing date, and continue on that date.",
              },
              {
                q: "Are builds updated?",
                a: "Yes. Pro and Elite members get weekly new builds. We also update existing builds with new supplier links, better component sourcing, and community feedback.",
              },
              {
                q: "Is there team/institutional pricing?",
                a: "We're working on it. Contact us at team@scalarventure.com for custom quotes for teams of 5+.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-black text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-black mb-4">Ready to unlock the vault?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join engineers, researchers, and innovators building the future of advanced engineering.
          </p>
          <Link to="/vault" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black transition-all">
            Browse Builds First <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs mt-16">
        <p>30-day money-back guarantee · Stripe-secured payments · Cancel anytime</p>
      </footer>
    </div>
  );
}