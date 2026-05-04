import { useState } from "react";
import { ArrowRight, CheckCircle2, Lock, FileText, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import FunnelUpsellBanner from "@/components/FunnelUpsellBanner";

function CheckoutButton({ price, priceInCents }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      const origin = window.location.origin;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: "Technical Brief Pack",
        priceInCents,
        description: "3 System Architecture Documents + Complete Measurement Protocols",
        category: "Research",
        successUrl: `${origin}/technical-brief-pack?success=true`,
        cancelUrl: `${origin}/technical-brief-pack`
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError("Checkout failed. Please try again.");
      }
    } catch (err) {
      setError("Error processing checkout.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? "Processing..." : (
        <>
          Get Brief Pack — {price} <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}

export default function TechnicalBriefPack() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Success banner */}
      {new URLSearchParams(window.location.search).get("success") === "true" && (
        <div className="px-6 py-4 bg-green-950 border-b border-green-800 text-center">
          <p className="text-green-300 font-bold text-sm">✓ Purchase complete! Your Brief Pack is ready. <Link to="/codextech-pricing" className="underline">Upgrade to full membership →</Link></p>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <Link to="/research-brief-landing" className="text-xs text-gray-500 hover:text-gray-300 mb-4 inline-block">← Back to Research Brief</Link>
          <h1 className="text-2xl font-bold">Technical Brief Pack</h1>
          <p className="text-gray-500 text-sm mt-1">System Architecture + Measurement Protocols</p>
        </div>
      </div>

      <div className="px-6 py-12 max-w-4xl mx-auto">
        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-800 text-purple-300 text-xs font-black mb-4 uppercase tracking-widest">
            <FileText size={12} /> Entry Tier Documentation
          </div>
          <h2 className="text-4xl font-black mb-3">Move from Theory to Engineering</h2>
          <p className="text-gray-400 text-lg">
            Three complete system architecture documents + institutional measurement protocols. Everything you need to start designing and testing systems.
          </p>
        </div>

        {/* Price / CTA Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: What's Included */}
          <div>
            <h3 className="text-white font-black text-xl mb-6">What's Included</h3>
            <div className="space-y-4">
              {[
                {
                  title: "MEG System Architecture (40 pages)",
                  desc: "Theoretical system design based on Bearden architecture analysis. Engineering framework for prototype development."
                },
                {
                  title: "Scalar Transmitter Design (35 pages)",
                  desc: "Experimental topology specifications derived from scalar EM theory. Not claimed as confirmed working device."
                },
                {
                  title: "Measurement Protocol Suite (25 pages)",
                  desc: "Proposed measurement approaches for theoretical scalar potential research in laboratory settings."
                },
                {
                  title: "Anenergy Pump Preliminary (15 pages)",
                  desc: "Theoretical framework based on Bearden's phi-field model. Foundations and design considerations only."
                }
              ].map((item, i) => (
                <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-lg p-4">
                  <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Purchase */}
          <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-2 border-cyan-700 rounded-2xl p-8 h-fit">
            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm mb-2">One-time purchase</p>
              <p className="text-5xl font-black text-cyan-300 mb-2">$27</p>
              <p className="text-gray-400 text-sm">Instant digital access</p>
            </div>

            <CheckoutButton price="$27" priceInCents={2700} />

            <div className="mt-6 space-y-2 text-xs text-gray-400">
              <p className="flex gap-2">
                <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                Download immediately
              </p>
              <p className="flex gap-2">
                <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                PDF format (100+ pages total)
              </p>
              <p className="flex gap-2">
                <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                Lifetime access
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-500 text-xs mb-3">After purchase, you get:</p>
              <p className="text-gray-300 text-xs">
                ✓ Bonus: institutional research email sequence<br/>
                ✓ 50% discount code for Research Membership<br/>
                ✓ Early access to Advanced Engineering Bundle
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-600 text-xs"><strong>Disclaimer:</strong> These are theoretical engineering frameworks based on published research by T.E. Bearden and related peer-reviewed literature. Documentation is for experimental research purposes. No warranties about functionality or results.</p>
            </div>
          </div>
        </div>

        {/* Why This Tier */}
        <section className="mb-12 bg-gray-900/40 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-white font-black text-xl mb-6">Why Start Here</h3>
          <div className="space-y-4">
            {[
              {
                icon: "→",
                title: "Actionable Documentation",
                desc: "Not theory. Real system architectures with component specs, assembly procedures, and measurement protocols."
              },
              {
                icon: "→",
                title: "Move Beyond Curiosity",
                desc: "Brief Pack is where casual readers become experimental engineers. You get the framework to design and build."
              },
              {
                icon: "→",
                title: "Test Everything",
                desc: "Measurement protocols are designed so you can verify (or refute) with standard lab equipment. Science, not belief."
              },
              {
                icon: "→",
                title: "Institutional Standard",
                desc: "These docs are used by research teams in 6+ countries. You're getting access to the same framework they use."
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-cyan-400 font-bold flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Level */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-white font-black text-xl mb-4">After Brief Pack: What's Next</h3>
          <p className="text-gray-400 mb-6">
            If these documents answer your questions and spark new ones, Research Membership ($97–$197/month) gives you everything: complete patent archive (40+ analyzed), 8 research modules (80+ hours), ongoing updates, and live quarterly sessions with institutional researchers.
          </p>
          <Link
            to="/codextech-pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white transition-colors font-black"
          >
            Unlock Full System <ArrowRight size={14} />
          </Link>
        </section>

        {/* Funnel Upsells */}
        <FunnelUpsellBanner variant="membership" />
        <FunnelUpsellBanner variant="operator" />
        <FunnelUpsellBanner variant="bundle" />

        {/* FAQ */}
        <div className="mt-12">
          <h3 className="text-white font-black text-xl mb-6">Questions?</h3>
          <div className="space-y-4">
            {[
              {
                q: "What format are these documents?",
                a: "PDF. 115+ pages total. Each system document includes component specifications, winding diagrams, assembly procedures, and measurement protocols."
              },
              {
                q: "Can I share these with my team?",
                a: "Yes. Your purchase covers your personal research. Teams should get institutional licenses. Reach out for team/lab pricing."
              },
              {
                q: "What if I'm still not sure this is worth $27?",
                a: "Read the Research Brief first (free). It covers the foundational theory. Brief Pack is where that theory becomes engineering. You'll know if you need it."
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-lg p-4">
                <p className="text-white font-bold text-sm mb-2">{item.q}</p>
                <p className="text-gray-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}