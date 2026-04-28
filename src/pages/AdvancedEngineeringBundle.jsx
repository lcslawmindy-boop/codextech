import { useState } from "react";
import { ArrowRight, CheckCircle2, Wrench, AlertCircle, FileText, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

function CheckoutButton({ price, priceInCents }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const origin = window.location.origin;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: "Advanced Engineering Bundle",
        priceInCents,
        description: "Hands-On System Design + Component Sourcing + Troubleshooting",
        category: "Engineering",
        successUrl: `${origin}/bundle-success`,
        cancelUrl: `${origin}/advanced-engineering-bundle`
      });

      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
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
          Get Bundle — {price} <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}

export default function AdvancedEngineeringBundle() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 mb-4 inline-block">← Back</a>
          <h1 className="text-2xl font-bold">Advanced Engineering Bundle</h1>
          <p className="text-gray-500 text-sm mt-1">For Teams Building Systems</p>
        </div>
      </div>

      <div className="px-6 py-12 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-800 text-red-300 text-xs font-black mb-4 uppercase tracking-widest">
            <Wrench size={12} /> Premium Engineering Access
          </div>
          <h2 className="text-4xl font-black mb-4">From Design to Prototype</h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Complete hands-on system designs + component sourcing + troubleshooting protocols + measurement validation. For teams actually building and testing systems.
          </p>
        </div>

        {/* Price / CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-black text-xl mb-6">What You Get</h3>

            {[
              {
                title: "3 Experimental System Frameworks",
                items: [
                  "MEG (Motionless Electromagnetic Generator): theoretical topology based on Bearden research. Assembly framework for experimental prototyping.",
                  "Scalar Transmitter: experimental geometry specifications derived from scalar EM theory. Design framework for research purposes.",
                  "Anenergy Pump: theoretical toroidal architecture framework based on published models. For experimental research only."
                ]
              },
              {
                title: "Component Selection Framework",
                items: [
                  "How to evaluate ferrite cores: permeability, frequency response, thermal characteristics",
                  "Magnet wire selection: gauge, insulation, operating temperature, current density limits",
                  "Coil geometry optimization: turns count, layer spacing, winding density, impedance matching",
                  "High-voltage supply specifications: regulation, noise floor, isolation requirements"
                ]
              },
              {
                title: "Troubleshooting Protocol Suite",
                items: [
                  "50+ common failure modes with root cause analysis",
                  "Measurement anomalies: what they indicate and how to respond",
                  "Thermal management: identifying runaway conditions and stabilization techniques",
                  "Impedance debugging: identifying system resonance vs. load mismatches"
                ]
              },
              {
                title: "Lab Setup Documentation",
                items: [
                  "Equipment requirements: oscilloscope specs, function generators, current probes",
                  "Measurement instrumentation: isolation requirements, calibration procedures, data collection protocols",
                  "Safety protocols: high-voltage handling, magnetic field exposure limits, emergency procedures",
                  "Data logging: how to record and analyze experimental results for reproducibility"
                ]
              },
              {
                title: "Sourcing Guide",
                items: [
                  "Vetted suppliers for specialty components (nanocrystalline cores, ferrite materials, precision resistors)",
                  "Part number references and equivalent components from multiple suppliers",
                  "Cost optimization: which components justify premium sourcing vs. budget alternatives",
                  "Lead time management: long-lead items and critical-path planning"
                ]
              },
              {
                title: "Measurement Data Archive",
                items: [
                  "Real oscilloscope traces from institutional builds",
                  "Impedance curves across frequency range",
                  "Thermal profiles under sustained excitation",
                  "Comparison: expected vs. actual behavior patterns"
                ]
              }
            ].map((section, i) => (
              <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 mb-4">
                <h4 className="text-white font-bold text-base mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="text-cyan-400 flex-shrink-0 mt-0.5">→</span>
                      <p className="text-gray-400 text-sm">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sidebar: Purchase + Info */}
          <div className="lg:col-span-1">
            {/* Purchase Card */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-2 border-cyan-700 rounded-2xl p-8 mb-6 sticky top-6">
              <p className="text-gray-400 text-sm mb-2">One-time purchase</p>
              <p className="text-5xl font-black text-cyan-300 mb-2">$997</p>
              <p className="text-gray-400 text-xs mb-8">Lifetime access + updates</p>

              <CheckoutButton price="$997" priceInCents={99700} />

              <div className="mt-6 space-y-2 text-xs text-gray-400">
                <p className="flex gap-2">
                  <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                  Instant digital access
                </p>
                <p className="flex gap-2">
                  <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                  200+ pages documentation
                </p>
                <p className="flex gap-2">
                  <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                  Lifetime updates included
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-white font-bold text-sm mb-3">Prerequisite</p>
                <p className="text-gray-400 text-xs">
                  This bundle assumes you have Research Membership (you understand the theory). If you haven't joined yet, start with Technical Brief Pack or Membership.
                </p>
              </div>
            </div>

            {/* Who This Is For */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <h4 className="text-white font-bold text-sm mb-4">This Bundle Is For:</h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                <li className="flex gap-2">
                  <Zap size={12} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  Research labs with engineering teams
                </li>
                <li className="flex gap-2">
                  <Zap size={12} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  Institutional R&D departments
                </li>
                <li className="flex gap-2">
                  <Zap size={12} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  Technical founders building advanced EM systems
                </li>
                <li className="flex gap-2">
                  <Zap size={12} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  Engineers with serious experimental goals
                </li>
              </ul>
            </div>

            {/* Critical Disclaimer */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-5">
              <div className="flex gap-3">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-bold text-xs mb-1">Research Use Only</p>
                  <p className="text-gray-300 text-xs mb-2">
                    These are theoretical engineering frameworks based on published research (Bearden, Maxwell, peer-reviewed literature). No warranties are made about functionality, safety, or results.
                  </p>
                  <p className="text-gray-300 text-xs">
                    <strong>Safety:</strong> High-voltage systems require proper training, institutional oversight, and comprehensive safety protocols. Do not attempt construction without expert guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why This Bundle */}
        <section className="mb-14 bg-gray-900/40 border border-gray-800 rounded-2xl p-12">
          <h3 className="text-white font-black text-2xl mb-8 text-center">Why Advanced Engineering Bundle</h3>

          <div className="space-y-6">
            {[
              {
                icon: <Wrench className="text-cyan-400" />,
                title: "Real Hands-On Documentation",
                desc: "Not theory. Actual build procedures, component specifications, and troubleshooting from teams that have constructed systems."
              },
              {
                icon: <FileText className="text-purple-400" />,
                title: "Complete Engineering Framework",
                desc: "Everything from component selection through measurement validation. You know exactly what to buy, how to assemble, and how to verify."
              },
              {
                icon: <Zap className="text-yellow-400" />,
                title: "Institutional Standard",
                desc: "These designs are used by research teams in multiple countries. You're getting the same framework they rely on."
              },
              {
                icon: <CheckCircle2 className="text-green-400" />,
                title: "Measurement Validation",
                desc: "Real oscilloscope traces, thermal data, and impedance curves. You know what success looks like, and what to do if results diverge."
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h4 className="text-white font-bold mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Phase */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h3 className="text-white font-black text-lg mb-4">Phase 2: Advanced Bundles ($1,997–$2,997)</h3>
          <p className="text-gray-400 text-sm mb-4">
            After completing this bundle, advanced teams move to specialized systems: High-Voltage Engineering ($1,997), Quantum Field Measurement ($2,497), and others. Available to members who've successfully completed builds from the core bundle.
          </p>
          <p className="text-gray-500 text-xs">Contact support to discuss advanced phase eligibility after your first build.</p>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="text-white font-black text-lg mb-6">Questions?</h3>
          <div className="space-y-4">
            {[
              {
                q: "Do I need Research Membership first?",
                a: "Yes. The bundle assumes you understand the theory. Get Membership ($97–$197/month) to understand the foundations before ordering this bundle."
              },
              {
                q: "Can I get a refund if I realize building isn't for me?",
                a: "This is a digital information product. Once purchased, it's non-refundable. Consider reading the Technical Brief Pack first to confirm this is the right fit."
              },
              {
                q: "How long does the documentation take to understand?",
                a: "Expect 60–100 hours of study and hands-on work to fully understand the systems and execute a complete build."
              },
              {
                q: "What if I have questions during the build?",
                a: "Institutional membership includes direct expert support. Technical tier includes email support."
              },
              {
                q: "Do you provide components or kits?",
                a: "No. We provide sourcing guides and vetted suppliers. You source components yourself (or through your institution). This keeps costs low and components current."
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-lg p-4">
                <p className="text-white font-bold text-sm mb-2">{item.q}</p>
                <p className="text-gray-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}