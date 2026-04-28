import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export default function SaaSPricing() {
  const [openFaq, setOpenFaq] = useState(0);

  const tiers = [
    {
      name: "Research Access",
      price: "$49",
      period: "per month",
      badge: null,
      tagline: "For researchers starting out",
      cta: "Get Started",
      description: "Access to core research database. Ideal for individual researchers and early-stage builders.",
      features: [
        { feature: "Patent Database (40+)", included: true },
        { feature: "Peer-Reviewed Publications (200+)", included: true },
        { feature: "Declassified Archives", included: false },
        { feature: "Research Modules (8)", included: false },
        { feature: "Engineering System Specs", included: false },
        { feature: "Monthly Updates", included: true },
        { feature: "Email Support", included: true },
        { feature: "Expert Consultation", included: false }
      ]
    },
    {
      name: "Builder Access",
      price: "$97",
      period: "per month",
      badge: null,
      tagline: "For active developers and teams",
      cta: "Get Started",
      description: "Full research library with engineering documentation. For hardware builders and technical teams.",
      features: [
        { feature: "Patent Database (40+)", included: true },
        { feature: "Peer-Reviewed Publications (200+)", included: true },
        { feature: "Declassified Archives", included: true },
        { feature: "Research Modules (8)", included: true },
        { feature: "Engineering System Specs", included: true },
        { feature: "Monthly Updates", included: true },
        { feature: "Email Support", included: true },
        { feature: "Expert Consultation", included: false }
      ]
    },
    {
      name: "Operator Access",
      price: "$197",
      period: "per month",
      badge: "MOST USED BY ENGINEERS",
      tagline: "For serious builders and institutions",
      cta: "Get Full Access",
      description: "Complete platform with expert support and institutional features. For teams building production systems.",
      features: [
        { feature: "Patent Database (40+)", included: true },
        { feature: "Peer-Reviewed Publications (200+)", included: true },
        { feature: "Declassified Archives", included: true },
        { feature: "Research Modules (8)", included: true },
        { feature: "Engineering System Specs", included: true },
        { feature: "Monthly Updates", included: true },
        { feature: "Email Support", included: true },
        { feature: "Expert Consultation", included: true }
      ]
    }
  ];

  const comparisonFeatures = [
    {
      category: "Core Research",
      items: [
        { name: "Patent Database Access", tiers: [true, true, true] },
        { name: "Patent Prosecution History", tiers: [true, true, true] },
        { name: "Peer-Reviewed Publications", tiers: [true, true, true] },
        { name: "Declassified Government Archives", tiers: [false, true, true] },
        { name: "Source Verification", tiers: [true, true, true] }
      ]
    },
    {
      category: "Engineering Documentation",
      items: [
        { name: "8 Research Modules (80+ hours)", tiers: [false, true, true] },
        { name: "Engineering System Specifications", tiers: [false, true, true] },
        { name: "Build Documentation", tiers: [false, true, true] },
        { name: "Component Bills of Materials", tiers: [false, true, true] },
        { name: "Measurement Protocols", tiers: [false, true, true] }
      ]
    },
    {
      category: "Support & Updates",
      items: [
        { name: "Monthly Research Updates", tiers: [true, true, true] },
        { name: "Email Support (48h response)", tiers: [true, true, true] },
        { name: "Direct Expert Consultation", tiers: [false, false, true] },
        { name: "Monthly Live Sessions", tiers: [false, false, true] },
        { name: "Priority Research Requests", tiers: [false, false, true] }
      ]
    },
    {
      category: "Team & Access",
      items: [
        { name: "Individual Access", tiers: [true, true, true] },
        { name: "Team Seats (3+)", tiers: [false, false, true] },
        { name: "Institutional Billing", tiers: [false, false, true] },
        { name: "Custom Integrations", tiers: [false, false, true] }
      ]
    }
  ];

  const faqs = [
    {
      q: "How do I know this research is credible?",
      a: "Every source is verified and citable. Patents are cross-referenced against USPTO records. Publications are verified against original journal archives. Government documents are authenticated through OSTI.gov and official channels. We provide complete source transparency—you can trace every claim back to its original document. No speculation. No secondary interpretation."
    },
    {
      q: "What exactly is in the patent database?",
      a: "40+ U.S. patents with full prosecution history, claims analysis, and prior art assessment. Each patent includes: technical claims, inventor notes, legal history, and engineering implications. Patents are indexed and cross-referenced, allowing you to understand the complete landscape for any given technology area."
    },
    {
      q: "Are the research modules courses?",
      a: "No. Modules are structured research analysis, not educational content. Each module follows a framework: source material → technical extraction → cross-reference analysis → IP implications → reproducibility assessment. 80+ hours total. Designed for engineers and researchers who need deep technical grounding, not learners."
    },
    {
      q: "What do I get with 'Expert Consultation'?",
      a: "Direct access to research directors for monthly sessions. Ask technical questions about patents, discuss research interpretation, clarify engineering applications. Get expert answers—not automated responses. Available to Operator Access tier members."
    },
    {
      q: "Can I upgrade or downgrade anytime?",
      a: "Yes. You can change tiers or cancel anytime. No contracts. Changes take effect at the start of your next billing cycle."
    },
    {
      q: "Is this platform suitable for teams?",
      a: "Absolutely. Research Access and Builder Access are individual subscriptions. Operator Access includes team features: team seats, institutional billing, and custom configurations. Contact us for enterprise arrangements."
    },
    {
      q: "What's the difference between published research and 'declassified archives'?",
      a: "Published research: peer-reviewed journals and academic literature. Declassified archives: government technical reports, DARPA research, ONR documentation, and institutional repositories that have been released for research use. Both are primary sources. Declassified material is available in Operator Access tier."
    },
    {
      q: "How often is the database updated?",
      a: "Monthly. New patent filings are indexed quarterly. Emerging peer-reviewed research is flagged as it's published. Government archives are monitored for newly declassified material. You get institutional-grade intelligence—not static data."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-xs">
              RP
            </div>
            <span className="font-bold text-sm text-gray-900">Research Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/research-platform" className="text-sm text-gray-600 hover:text-gray-900">Home</a>
            <a href="/research-methodology" className="text-sm text-gray-600 hover:text-gray-900">Methodology</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Access institutional-grade research. Choose the tier that matches your needs.
          </p>
          <p className="text-sm text-gray-500">
            All plans include unlimited research database access. Cancel anytime. No contracts.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <div key={i} className={`rounded-lg border-2 p-8 transition-all ${
                tier.badge
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}>
                {tier.badge && (
                  <div className="text-xs font-black uppercase tracking-widest text-gray-600 mb-4 flex items-center justify-between">
                    <span>{tier.badge}</span>
                  </div>
                )}
                
                <h3 className="text-2xl font-black text-gray-900 mb-1">{tier.name}</h3>
                <p className="text-sm text-gray-600 mb-6">{tier.tagline}</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-black text-gray-900">{tier.price}</span>
                  <span className="text-gray-600 text-sm ml-2">/{tier.period}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-8 leading-relaxed">{tier.description}</p>
                
                <Link to="/research-membership"
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold mb-8 transition-colors ${
                    tier.badge
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border-2 border-gray-900 text-gray-900 hover:bg-gray-50"
                  }`}>
                  {tier.cta} <ArrowRight size={14} />
                </Link>
                
                <div className="space-y-3 border-t border-gray-200 pt-8">
                  {tier.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      {f.included ? (
                        <CheckCircle2 size={16} className="text-gray-900 flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${f.included ? "text-gray-900" : "text-gray-400"}`}>
                        {f.feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="px-6 py-16 border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Detailed Feature Comparison</h2>
          
          <div className="space-y-8">
            {comparisonFeatures.map((category, ci) => (
              <div key={ci}>
                <h3 className="font-bold text-lg text-gray-900 mb-4 pb-4 border-b border-gray-200">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item, ii) => (
                    <div key={ii} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-3">
                      <div className="col-span-1 md:col-span-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      </div>
                      <div className="col-span-3 md:col-span-3 grid grid-cols-3 gap-4 text-center">
                        {item.tiers.map((included, ti) => (
                          <div key={ti}>
                            {included ? (
                              <CheckCircle2 size={18} className="text-gray-900 mx-auto" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-300 mx-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-gray-900" />
                <span>Included</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-300" />
                <span>Not included</span>
              </div>
            </div>
            <div className="flex gap-4 font-medium text-gray-900">
              <div className="text-center w-20">Research Access</div>
              <div className="text-center w-20">Builder Access</div>
              <div className="text-center w-20">Operator Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-bold text-gray-900">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={18} className="text-gray-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-16 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Why Teams Trust This Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Institutional Standard</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Used by research institutions and engineering teams in 6+ countries. Every analysis is traceable to its primary source. Zero speculation.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Complete Transparency</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Patents verified against USPTO records. Publications checked against journal archives. Government documents authenticated through official channels.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Living Research</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monthly updates: new patents indexed, emerging research flagged, regulatory developments tracked. You stay current with institutional research.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Expert Access</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Operator Access includes monthly sessions with research directors. Ask questions. Get expert answers. Not automated support—human expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Access the Research?</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Join engineering teams building on verified primary sources. Start with Research Access or jump straight to Operator Access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/research-brief"
              className="px-8 py-4 rounded-lg border-2 border-white text-white font-bold hover:bg-white hover:text-gray-900 transition-colors">
              Get Free Research Brief
            </Link>
            <Link to="/research-membership"
              className="px-8 py-4 rounded-lg bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              Choose Your Plan <ArrowRight size={16} />
            </Link>
          </div>
          <p className="text-gray-400 text-xs mt-8">
            Questions? Email support@zenithapex.com
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-bold text-gray-900 text-sm mb-3">Platform</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="/research-platform" className="hover:text-gray-900">Home</a></li>
                <li><a href="/research-methodology" className="hover:text-gray-900">Methodology</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-3">Resources</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="/research-brief" className="hover:text-gray-900">Free Brief</a></li>
                <li><a href="#faq" className="hover:text-gray-900">FAQ</a></li>
                <li><a href="/research-methodology" className="hover:text-gray-900">Our Process</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-3">Legal</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="/terms" className="hover:text-gray-900">Terms</a></li>
                <li><a href="/refund-policy" className="hover:text-gray-900">Refunds</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-3">Contact</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="mailto:support@zenithapex.com" className="hover:text-gray-900">Support</a></li>
                <li><a href="mailto:inquiry@zenithapex.com" className="hover:text-gray-900">Institutional</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-600">
            <p>Research Platform © 2026. Primary sources only. Institutional-grade research.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}