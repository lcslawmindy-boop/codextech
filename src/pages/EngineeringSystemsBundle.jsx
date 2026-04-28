import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertCircle, Lock } from "lucide-react";

export default function EngineeringSystemsBundle() {
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);

  const handleCheckout = () => {
    if (window.self !== window.top) {
      setShowPaymentWarning(true);
    } else {
      window.location.href = "https://buy.stripe.com/engineering-bundle";
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-xs">RP</div>
            <span className="font-bold text-sm">Research Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link to="/research-platform" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
          </div>
        </div>
      </nav>

      {/* Payment Warning Modal */}
      {showPaymentWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="font-black text-lg mb-3">Checkout Works on Published App</h3>
            <p className="text-gray-600 text-sm mb-6">
              Stripe checkout only functions when accessed from a published version of this platform. For testing, please visit the published app.
            </p>
            <button
              onClick={() => setShowPaymentWarning(false)}
              className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white font-bold transition-colors hover:bg-gray-800"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="px-6 py-20 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-gray-600 px-3 py-1.5 bg-gray-100 rounded-full mb-4">
              For Serious Builders
            </span>
            <h1 className="text-5xl font-black text-gray-900 leading-[1.1] mb-4">
              Engineering Systems Bundle
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              A structured research and engineering framework derived from primary-source analysis. Everything you need to understand, build, and validate advanced electromagnetic systems.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
            <div className="mb-4">
              <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Investment</span>
              <p className="text-5xl font-black text-gray-900 mt-2">$997</p>
              <p className="text-sm text-gray-600 mt-1">One-time purchase. Lifetime access.</p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 px-6 rounded-lg bg-gray-900 text-white font-black text-lg transition-all hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              Get Bundle Now <ArrowRight size={18} />
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              30-day money-back guarantee. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-8">The Problem</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <AlertCircle size={24} className="text-gray-900 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Research is fragmented</h3>
                <p className="text-gray-600">
                  Patents are scattered across USPTO. Publications live in different journals. Government reports are archived separately. Building a system requires assembling pieces from 10+ sources.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <AlertCircle size={24} className="text-gray-900 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Engineering specs are incomplete</h3>
                <p className="text-gray-600">
                  Patent claims don't include build procedures. Academic papers omit practical measurements. Government reports don't show component interactions. You're left reverse-engineering from fragments.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <AlertCircle size={24} className="text-gray-900 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">No framework for validation</h3>
                <p className="text-gray-600">
                  How do you know if your prototype is working correctly? What measurements matter? Which metrics prove operational feasibility? You're building without institutional standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="px-6 py-16 border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-8">The Solution</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            One unified system. Everything sourced from primary documents. Everything organized for builders.
          </p>

          <div className="space-y-8">
            <div className="border-l-4 border-gray-900 pl-6">
              <h3 className="font-black text-xl text-gray-900 mb-3">Complete System Documentation</h3>
              <p className="text-gray-600 mb-4">
                Not just patents. Not just papers. A unified technical framework for each major electromagnetic system:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Patent prosecution history with claims analysis</li>
                <li>✓ Peer-reviewed validation (where it exists)</li>
                <li>✓ Government technical reports and declassified archives</li>
                <li>✓ Integrated engineering specifications</li>
              </ul>
            </div>

            <div className="border-l-4 border-gray-900 pl-6">
              <h3 className="font-black text-xl text-gray-900 mb-3">Build-Ready Specifications</h3>
              <p className="text-gray-600 mb-4">
                Schematics, bills of materials, component sourcing, measurement protocols, validation frameworks.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Detailed wiring schematics (CAD-ready)</li>
                <li>✓ Component bills of materials with supplier options</li>
                <li>✓ Step-by-step assembly procedures</li>
                <li>✓ Measurement and validation protocols</li>
              </ul>
            </div>

            <div className="border-l-4 border-gray-900 pl-6">
              <h3 className="font-black text-xl text-gray-900 mb-3">Engineering Frameworks</h3>
              <p className="text-gray-600 mb-4">
                Methods for testing, validation, and troubleshooting grounded in institutional research standards.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ FTO (Freedom-to-Operate) assessment for each system</li>
                <li>✓ Patent landscape analysis (prior art, design-arounds)</li>
                <li>✓ Risk assessment and mitigation strategies</li>
                <li>✓ Regulatory compliance frameworks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">What You Get</h2>

          <div className="space-y-8">
            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-black">1</span>
                Complete Patent Analysis Suite (6 systems)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Six major electromagnetic systems, fully documented. Each includes: patent prosecution history, claims breakdown, prior art assessment, design-around strategies, and freedom-to-operate analysis.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ MEG (Motionless Electromagnetic Generator) — Complete patent genealogy</li>
                <li>✓ Anenergy System — Phi-field engineering framework</li>
                <li>✓ Prioré Device — Therapeutic EM field generation</li>
                <li>✓ Scalar EM Transducer — Wave propagation and measurement</li>
                <li>✓ Time-Reversal Zone Reactor — Patent landscape</li>
                <li>✓ TRZ Cold Fusion — Integrated analysis</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-black">2</span>
                Engineering Build Plans (6 systems)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Complete build documentation derived from verified sources. Every system includes detailed specifications, component selection, assembly procedures, and measurement validation protocols.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Detailed schematics (CAD-ready formats)</li>
                <li>✓ Bills of materials with component specifications</li>
                <li>✓ Supplier sourcing options and cost estimates</li>
                <li>✓ Step-by-step assembly instructions</li>
                <li>✓ Measurement protocols and expected results</li>
                <li>✓ Troubleshooting and validation frameworks</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-black">3</span>
                Research Modules (8 modules, 80+ hours)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Structured analysis of core electromagnetic theory. Each module bridges patent claims to engineering implementation. No speculation—all grounded in primary sources.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Module 1: Classical EM Theory vs. Bearden Extensions</li>
                <li>✓ Module 2: Regauging and Energy Extraction</li>
                <li>✓ Module 3: Scalar Potential and Field Interactions</li>
                <li>✓ Module 4: Resonance and Efficiency</li>
                <li>✓ Module 5: Measurement and Validation</li>
                <li>✓ Module 6: Patent Strategy and IP Protection</li>
                <li>✓ Module 7: Regulatory Landscape</li>
                <li>✓ Module 8: Advanced System Integration</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-black">4</span>
                Tools & Reference Materials
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Practical resources for builders. Templates, frameworks, and reference documents.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Component specification templates</li>
                <li>✓ Measurement log templates</li>
                <li>✓ FTO assessment framework</li>
                <li>✓ Patent claim analysis worksheets</li>
                <li>✓ Supplier comparison matrices</li>
                <li>✓ Troubleshooting decision trees</li>
                <li>✓ Validation protocol checklists</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-black">5</span>
                Lifetime Access + Updates
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                One purchase. Forever access. Quarterly updates as new patents are filed, research is published, and engineering frameworks are refined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="px-6 py-16 border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Who This Is For</h2>

          <div className="space-y-6">
            <div className="flex gap-4 border border-gray-200 rounded-lg p-6 bg-white">
              <CheckCircle2 size={24} className="text-gray-900 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Hardware engineers</h3>
                <p className="text-gray-600">Building advanced electromagnetic systems and need complete, verified technical specifications grounded in primary sources.</p>
              </div>
            </div>

            <div className="flex gap-4 border border-gray-200 rounded-lg p-6 bg-white">
              <CheckCircle2 size={24} className="text-gray-900 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Research teams</h3>
                <p className="text-gray-600">Validating theoretical frameworks with practical engineering. Need institutional-grade documentation and peer-reviewed validation.</p>
              </div>
            </div>

            <div className="flex gap-4 border border-gray-200 rounded-lg p-6 bg-white">
              <CheckCircle2 size={24} className="text-gray-900 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Patent attorneys</h3>
                <p className="text-gray-600">Evaluating or building IP strategies in advanced electromagnetics. Need complete patent landscapes and FTO assessments.</p>
              </div>
            </div>

            <div className="flex gap-4 border border-gray-200 rounded-lg p-6 bg-white">
              <CheckCircle2 size={24} className="text-gray-900 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Serious builders</h3>
                <p className="text-gray-600">Not hobbyists. People building working prototypes and validating against institutional standards. This is a $997 commitment for a reason.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 border-l-4 border-gray-900 bg-gray-100">
            <p className="text-gray-600 text-sm">
              <strong>Not for:</strong> Casual learners, people looking for cheap courses, or skeptics. This bundle requires hands-on engineering ability and serious intent. If you're not ready to build, save your $997.
            </p>
          </div>
        </div>
      </section>

      {/* Why This Bundle */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Why This Bundle Exists</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Building advanced electromagnetic systems requires more than patents or academic papers. It requires understanding how they interconnect—how patent claims translate to engineering specs, how theoretical frameworks apply to real measurement, how IP landscapes affect your building process.
            </p>
            <p className="mt-6">
              This bundle aggregates 6+ years of primary-source research into one unified system. Everything is sourced from verified documents. Everything is organized for builders. Everything is designed for people who actually want to construct working prototypes, not just read about theory.
            </p>
            <p className="mt-6">
              The $997 price reflects the work involved: patent analysis, engineering specification, source verification, and institutional framework development. It's not a course. It's a professional resource for serious builders.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Build?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Everything you need to understand, design, and validate advanced electromagnetic systems. Sourced from primary research. Built for builders.
          </p>
          <button
            onClick={handleCheckout}
            className="inline-flex items-center justify-center gap-2 px-12 py-4 rounded-lg bg-white text-gray-900 font-black text-lg transition-all hover:bg-gray-100"
          >
            Purchase Bundle — $997 <ArrowRight size={18} />
          </button>
          <p className="text-gray-400 text-sm mt-6">
            30-day money-back guarantee. Lifetime access. Quarterly updates.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center text-sm text-gray-600">
          <p className="mb-4">
            Questions? Email <a href="mailto:support@zenithapex.com" className="text-gray-900 font-bold hover:underline">support@zenithapex.com</a>
          </p>
          <p>
            Research Platform © 2026. Primary sources only. For serious builders.
          </p>
        </div>
      </footer>
    </div>
  );
}