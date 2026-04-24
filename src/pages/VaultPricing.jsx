import { Link } from "react-router-dom";
import { ArrowRight, Check, Star } from "lucide-react";

const TIERS = [
  {
    name: "Free Vault",
    price: "Always Free",
    period: "",
    highlight: false,
    cta: "Start Browsing",
    desc: "Forever free",
    features: [
      "All 40 builds searchable",
      "Complete BOMs & schematics",
      "Supplier recommendations",
      "PDF downloads",
      "No login required",
    ],
    notIncluded: [
      "Video assembly",
      "Community forums",
      "Sourcing links",
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
      "Everything in Free Vault",
      "Video assembly guides (3–12 hrs each)",
      "Verified supplier links & pricing",
      "Engineer community & forums",
      "Priority support",
      "Weekly new builds",
      "Advanced courses",
    ],
    notIncluded: [
      "One-time purchase option",
    ],
  },
  {
    name: "À La Carte",
    price: "$299",
    period: "per build",
    highlight: false,
    cta: "Buy Single Build",
    desc: "Pay as you go",
    features: [
      "One complete build (video + sourcing)",
      "Lifetime access",
      "No subscription",
      "No cancellation",
      "30 downloads included",
    ],
    notIncluded: [
      "Community access",
      "Course library",
    ],
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
                q: "Do I need to sign up to browse the vault?",
                a: "No. The entire vault is free and searchable without login. You only need to register if you want to upgrade to Pro or purchase à la carte.",
              },
              {
                q: "Can I download BOMs and schematics for free?",
                a: "Yes. All 40 builds include complete BOMs, schematics, and supplier recommendations. Pro tier adds video assembly guides and verified supplier links.",
              },
              {
                q: "Is there a refund guarantee?",
                a: "Yes. Pro subscriptions come with a 30-day money-back guarantee. À la carte purchases are final but include lifetime access.",
              },
              {
                q: "What's the difference between Pro ($99/mo) and À La Carte ($299)?",
                a: "Pro: video assembly + sourcing + community for all 40 builds, recurring. À La Carte: one complete build, one-time payment, lifetime access. Choose based on how many builds you plan to use.",
              },
              {
                q: "Do universities and institutions get discounts?",
                a: "Yes! Universities and corporate R&D teams can license our entire vault. Visit our institutional licensing page or contact licensing@scalarvault.io.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-black text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Institutional CTA ── */}
        <div className="bg-purple-900/20 border border-purple-800/40 rounded-2xl p-10 mb-12 text-center">
          <h3 className="text-2xl font-black mb-3">Institution or Corporate Team?</h3>
          <p className="text-gray-400 mb-6">License our entire library for student labs, internal R&D, or client delivery. Custom pricing, white-label, and API access available.</p>
          <Link to="/institutional-licensing" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-purple-700 text-purple-300 hover:bg-purple-900/40 font-bold transition-all">
            Institutional Licensing <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Browse 40 builds free. Upgrade to Pro for video guides & sourcing. Or buy individual builds à la carte.
          </p>
          <Link to="/vault" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black transition-all">
            Browse All Builds <ArrowRight size={16} />
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