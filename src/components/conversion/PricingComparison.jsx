import { CheckCircle2 } from "lucide-react";

export default function PricingComparison() {
  const tiers = [
    {
      name: "Researcher",
      price: "$49",
      period: "/month",
      description: "For individuals exploring the archive",
      cta: "Start Free Trial",
      features: [
        "3 courses + 3 build plans included",
        "Core research archive access",
        "8 structured research modules",
        "Monthly updates",
        "Community access"
      ],
      value: "$993/year value",
    },
    {
      name: "Builder",
      price: "$99",
      period: "/month",
      description: "For engineers actively building systems",
      cta: "Subscribe Now",
      highlight: true,
      features: [
        "Everything in Researcher",
        "40+ patent analyses",
        "Engineering documentation",
        "3 Invention Dossier Generations (3 inventions each)",
        "Expert support (48hr response)",
        "20% off EMF Shop"
      ],
      value: "$3,929/year value",
    },
    {
      name: "Pro",
      price: "$199",
      period: "/month",
      description: "For serious inventors & commercialization",
      cta: "Subscribe Now",
      features: [
        "Everything in Builder",
        "ALL courses & build plans unlocked",
        "ALL research PDFs included",
        "Video build guides with BOM",
        "AI Patent Attorney tool",
        "5 Invention Dossiers/month (5 inventions each)",
        "Pitch deck generator"
      ],
      value: "$5,294/year value",
    }
  ];

  return (
    <div id="pricing" className="bg-gray-950 py-16 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-black text-white mb-4 text-center">Simple, Transparent Pricing</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Choose the tier that matches your role. All plans include access to the complete research archive, updated monthly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl overflow-hidden transition-all ${
                tier.highlight
                  ? "border-2 border-blue-600 shadow-lg shadow-blue-600/20 bg-blue-950/20 relative"
                  : "border border-gray-800 bg-gray-900/40"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-black rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">{tier.name}</h3>
                  <p className="text-sm text-gray-400">{tier.description}</p>
                </div>

                <div>
                  <div className="text-3xl font-black text-white">
                    {tier.price}
                    <span className="text-lg text-gray-400 font-normal">{tier.period}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{tier.value}</p>
                </div>

                <button className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors ${
                  tier.highlight
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}>
                  {tier.cta}
                </button>

                <div className="space-y-2 pt-4 border-t border-gray-700">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex gap-2 text-sm text-gray-300">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h3 className="font-black text-white mb-4">What's Included in Every Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-bold text-blue-400 mb-2">Core Research</p>
              <p className="text-gray-300 text-sm">40+ patent analyses, 200+ peer-reviewed publications, declassified reports, 8 structured research modules, monthly updates.</p>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-400 mb-2">Commercialization Tools</p>
              <p className="text-gray-300 text-sm">Invention dossier IP generation, patent strategy, bring-to-market roadmap, BOM sourcing guides, step-by-step build frameworks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}