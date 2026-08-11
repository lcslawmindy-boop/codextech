import { Check, Star } from "lucide-react";

const TIERS = [
  {
    name: "Explorer",
    price: "$0",
    period: "/ month",
    color: "#8B9AB0",
    border: "border-zarp-border",
    cta: "Start Free — No Credit Card",
    features: [
      "Access to 100 public research nodes",
      "Basic graph view (read-only)",
      "3 device build plans per month",
      "Community Innovation Feed (read-only)",
      "1 technology brief export per month",
    ],
  },
  {
    name: "Innovator / Pro",
    price: "$97",
    period: "/ month",
    annual: "or $797/year — save 32%",
    color: "#C9A84C",
    border: "border-zarp-gold",
    popular: true,
    cta: "Start Pro — 14 Day Free Trial",
    features: [
      "Full 500+ node research library",
      "Unlimited device build plans",
      "IP Claim Draft Framework Generator (5/month)",
      "Investor Package Builder (3/month)",
      "Licensing Brief Generator (unlimited)",
      "SBIR/STTR Grant Section Builder (3/month)",
      "Suppression Dossier (2/month)",
      "Priority Innovation Feed with alerts",
      "Save unlimited Research Collections",
      "Email support",
    ],
  },
  {
    name: "Enterprise / Architect",
    price: "$497",
    period: "/ month",
    annual: "or custom annual",
    color: "#9B30FF",
    border: "border-zarp-violet",
    cta: "Contact for Enterprise Access",
    features: [
      "Unlimited all export types",
      "Multi-System Integration Analysis (unlimited)",
      "White-label exports with your company branding",
      "Custom node additions to your private database",
      "API access for internal tools integration",
      "Dedicated account manager",
      "Patent attorney referral network access",
      "Licensing deal introduction service",
      "1x monthly strategy call with ZARP innovation team",
    ],
  },
];

export default function LandingPricing() {
  return (
    <section id="pricing" className="relative py-24 bg-zarp-card">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Choose Your Level of <span className="text-zarp-gold">Innovation</span>
        </h2>
        <p className="text-center text-zarp-muted mb-4">Annual plans include 2 months free + priority onboarding</p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {TIERS.map(tier => (
            <div
              key={tier.name}
              className={`relative bg-zarp-bg border-2 rounded-2xl p-8 transition-all hover:scale-[1.03] ${tier.border}`}
              style={tier.popular ? { boxShadow: '0 0 40px hsl(var(--zarp-gold) / 0.2)' } : {}}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1" style={{ backgroundColor: 'hsl(var(--zarp-gold))', color: 'hsl(var(--zarp-bg))' }}>
                  <Star size={10} /> MOST POPULAR
                </div>
              )}

              <h3 className="text-lg font-bold mb-1" style={{ color: tier.color, fontFamily: 'Orbitron, sans-serif' }}>{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>{tier.price}</span>
                <span className="text-zarp-muted text-sm">{tier.period}</span>
              </div>
              {tier.annual && <p className="text-xs text-zarp-muted mb-4">{tier.annual}</p>}

              <a
                href="#"
                className={`block w-full text-center px-4 py-3 rounded-xl text-sm font-bold transition-all mb-6 ${
                  tier.popular
                    ? "text-zarp-bg hover:shadow-lg"
                    : "border border-zarp-border text-zarp-text hover:border-zarp-gold/50"
                }`}
                style={tier.popular ? { backgroundColor: 'hsl(var(--zarp-gold))', boxShadow: '0 0 20px hsl(var(--zarp-gold) / 0.3)' } : {}}
              >
                {tier.cta}
              </a>

              <div className="space-y-2.5">
                {tier.features.map(feat => (
                  <div key={feat} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: tier.color + '20' }}>
                      <Check size={10} style={{ color: tier.color }} />
                    </div>
                    <span className="text-zarp-muted text-xs leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}