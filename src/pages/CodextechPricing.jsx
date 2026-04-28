import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function CodextechPricing() {
  const handleCheckout = (priceId, tier) => {
    if (window.self !== window.top) {
      alert("Checkout works only from the published app. Please visit the main platform.");
      return;
    }
    window.location.href = `/checkout?tier=${tier}`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/codextech" className="flex items-center gap-3 hover:opacity-80">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-xs">CX</div>
            <span className="font-black text-sm">C.O.D.E.X.T.E.C.H.</span>
          </Link>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold text-sm">← Back to Home</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Choose Your Level of Research Access</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            C.O.D.E.X.T.E.C.H. is structured for users who want more than information.
            It is built for people who want organized research, system interpretation, and applied technical frameworks.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Research Access */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Research Access</h2>
            <p className="text-gray-600 text-sm mb-6">For users who want structured research intelligence.</p>
            <div className="mb-8">
              <div className="text-4xl font-black text-gray-900">$49</div>
              <div className="text-gray-600 text-sm">/month, cancel anytime</div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Core database access",
                "Research modules",
                "Weekly research updates",
                "Source-backed technical summaries"
              ].map((feature, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 size={16} className="text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleCheckout("research", "research")}
              className="w-full py-3 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors">
              Start Research Access
            </button>
          </div>

          {/* Builder Access */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Builder Access</h2>
            <p className="text-gray-600 text-sm mb-6">For users who want research plus engineering interpretation.</p>
            <div className="mb-8">
              <div className="text-4xl font-black text-gray-900">$97</div>
              <div className="text-gray-600 text-sm">/month, cancel anytime</div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Everything in Research Access",
                "Engineering system breakdowns",
                "BOM summaries",
                "Build implications",
                "Experimental classification tags"
              ].map((feature, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 size={16} className="text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleCheckout("builder", "builder")}
              className="w-full py-3 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors">
              Start Builder Access
            </button>
          </div>

          {/* Operator Access — Featured */}
          <div className="bg-gray-900 text-white rounded-2xl p-8 flex flex-col border-2 border-gray-900 lg:col-span-1 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-gray-900 text-xs font-black">
              Most Used
            </div>
            <h2 className="text-2xl font-black mb-2">Operator Access</h2>
            <p className="text-gray-300 text-sm mb-6">For users who want full access to the research and build ecosystem.</p>
            <div className="mb-8">
              <div className="text-4xl font-black text-white">$197</div>
              <div className="text-gray-400 text-sm">/month, cancel anytime</div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Full research database",
                "Full build systems library",
                "Patent intelligence modules",
                "Advanced weekly drops",
                "Engineering frameworks",
                "Premium system archives"
              ].map((feature, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 size={16} className="text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleCheckout("operator", "operator")}
              className="w-full py-3 rounded-lg bg-white text-gray-900 font-black hover:bg-gray-100 transition-colors">
              Start Operator Access
            </button>
          </div>

          {/* Engineering Bundle */}
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 flex flex-col">
            <div className="inline-flex items-center gap-1 mb-2 text-xs font-black">
              <span>🔥</span> ONE-TIME
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Engineering Systems Bundle</h2>
            <p className="text-gray-600 text-sm mb-6">For users who want immediate access to the complete build systems collection.</p>
            <div className="mb-8">
              <div className="text-4xl font-black text-gray-900">$997</div>
              <div className="text-gray-600 text-sm">one-time payment</div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Full build plan collection",
                "System architecture documents",
                "BOM frameworks",
                "Implementation pathways",
                "Lifetime access to included bundle materials"
              ].map((feature, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 size={16} className="text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleCheckout("bundle", "bundle")}
              className="w-full py-3 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors">
              Get Full Systems Bundle
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Is this theoretical or practical?",
                a: "Research is sourced from real-world patents and experimental literature, then structured for analysis and application."
              },
              {
                q: "Is this beginner-friendly?",
                a: "No. This platform is designed for individuals with technical curiosity and self-direction."
              },
              {
                q: "Can I upgrade between tiers?",
                a: "Yes. You can upgrade anytime and will only pay the difference."
              },
              {
                q: "What if I want to cancel?",
                a: "You can cancel your subscription anytime. No contract. Access ends at the end of your billing period."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white border-t border-gray-200 text-center text-sm text-gray-600">
        <p>C.O.D.E.X.T.E.C.H. © 2026. Private research infrastructure for serious builders.</p>
      </footer>
    </div>
  );
}