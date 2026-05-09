import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Download, Play, ShoppingCart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

const BUILD_PLANS = [
  {
    id: "meg",
    title: "MEG Replication Device",
    category: "Free Energy",
    basePrice: 287,
    videoPdfPrice: 50,
    teaser: "Complete Mobile Electromagnetic Generator system with flux-coupled coils, Lorentz force optimization, and COP>1 validation framework.",
    what_you_get: [
      "Full Bill of Materials with part numbers & quantities",
      "Component sourcing links (verified suppliers)",
      "Complete electrical schematics (PDF)",
      "Assembly step-by-step instructions (viewable in app)",
      "3D assembly diagrams & technical drawings",
    ],
    video_pdf_bonus: [
      "Step-by-step video assembly guide (45 min)",
      "High-res PDF manual for printing/offline reference",
      "Component sourcing optimization tips",
    ],
    icon: "⚡",
  },
  {
    id: "scalar-transmitter",
    title: "Scalar EM Transmitter",
    category: "Communications",
    basePrice: 243,
    videoPdfPrice: 50,
    teaser: "Phase-conjugate scalar wave transmitter operating at 10-40 kHz with over-unity signal coupling and phase-locking architecture.",
    what_you_get: [
      "Complete tuning specifications & frequency tables",
      "Coil winding patterns & layer diagrams",
      "Power supply schematics (multiple topologies)",
      "Assembly instructions with calibration procedures",
      "Signal verification & testing protocols",
    ],
    video_pdf_bonus: [
      "Video: Coil winding & assembly (60 min)",
      "Video: Frequency calibration & tuning (30 min)",
      "Complete PDF build manual (150 pages)",
    ],
    icon: "📡",
  },
  {
    id: "priore-device",
    title: "Prioré Device Component Bundle",
    category: "Bio-Signal",
    basePrice: 349,
    videoPdfPrice: 50,
    teaser: "Electromagnetic resonance chamber based on Prioré's original French patent designs for biofield interaction and cellular regeneration research.",
    what_you_get: [
      "Frequency mapping (Shor & Kaznacheyev biofields)",
      "Chamber construction specifications",
      "Signal generation & modulation circuits",
      "Safety & EMF containment protocols",
      "Experimental procedure documentation",
    ],
    video_pdf_bonus: [
      "Video: Chamber assembly & testing (90 min)",
      "Video: Frequency calibration for bio-resonance (45 min)",
      "Complete experimental protocol PDF",
    ],
    icon: "🧬",
  },
  {
    id: "scalar-potential",
    title: "Scalar Potential Extractor",
    category: "Energy",
    basePrice: 389,
    videoPdfPrice: 50,
    teaser: "Zero-point energy tap using scalar potential wells, time-varying electromagnetic gradients, and non-Hertzian wave coupling.",
    what_you_get: [
      "Scalar field mathematical modeling",
      "Extraction coil designs (multiple geometries)",
      "High-voltage power conditioning circuits",
      "Measurement & verification protocols",
      "Safety interlocks & failsafe systems",
    ],
    video_pdf_bonus: [
      "Video: Theory deep-dive with live demonstrations (120 min)",
      "Video: Assembly & troubleshooting (90 min)",
      "Advanced PDF manual with math derivations",
    ],
    icon: "🌀",
  },
  {
    id: "biofield-chamber",
    title: "Biofield Resonance Chamber",
    category: "Bio-Tech",
    basePrice: 195,
    videoPdfPrice: 50,
    teaser: "Kaznacheyev-Torsion field generator for cellular communication research and bioelectric field mapping.",
    what_you_get: [
      "Torsion field coil specifications",
      "Signal modulation for cellular frequencies",
      "Shielding & containment design",
      "Measurement equipment calibration guide",
      "Research documentation templates",
    ],
    video_pdf_bonus: [
      "Video: Full build walkthrough (75 min)",
      "Video: Measurement setup & verification (45 min)",
      "PDF research protocols & data logging sheets",
    ],
    icon: "🧬",
  },
];

export default function BuildPlansMarketplace() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [purchased, setPurchased] = useState({});
  const [loadingCheckout, setLoadingCheckout] = useState({});

  const handlePurchaseBuild = async (plan, includeVideo) => {
    const key = `${plan.id}-${includeVideo ? "full" : "base"}`;
    setLoadingCheckout(prev => ({ ...prev, [key]: true }));

    const price = includeVideo ? plan.basePrice + plan.videoPdfPrice : plan.basePrice;
    const title = includeVideo
      ? `${plan.title} + Video & PDF`
      : `${plan.title} (Build Plan)`;

    try {
      const res = await base44.functions.invoke("createComponentCheckout", {
        priceInCents: price * 100,
        title,
        metadata: {
          plan_id: plan.id,
          include_video: includeVideo,
        },
      });
      window.open(res.data.url, "_blank");
    } catch (e) {
      alert("Checkout error: " + e.message);
    }
    setLoadingCheckout(prev => ({ ...prev, [key]: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* ── Header ── */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <Link to="/nda-onboarding" className="text-xs text-gray-400 hover:text-white mb-4 inline-block">
            ← Back to Vault
          </Link>
          <h1 className="text-4xl font-black mb-2">Build Plans à la Carte</h1>
          <p className="text-gray-400">
            Purchase individual build plans. View schematics & instructions in-app (no copy/paste). Optional: video assembly + PDF download for +$50.
          </p>
        </div>
      </div>

      {/* ── Plans Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUILD_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-cyan-600 transition-all"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700 bg-gray-900/50">
                <div className="text-4xl mb-3">{plan.icon}</div>
                <h3 className="text-xl font-black text-white mb-1">{plan.title}</h3>
                <p className="text-xs text-cyan-400 font-bold uppercase">{plan.category}</p>
              </div>

              {/* Teaser */}
              <div className="p-6 border-b border-gray-700">
                <p className="text-sm text-gray-300 italic">{plan.teaser}</p>
              </div>

              {/* Pricing & Options */}
              <div className="p-6 border-b border-gray-700 bg-gray-950/50">
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Base Plan Includes:</p>
                  <div className="space-y-1">
                    {plan.what_you_get.slice(0, 3).map((item, j) => (
                      <p key={j} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Base Plan */}
                  <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                    <p className="text-2xl font-black text-cyan-400">${plan.basePrice}</p>
                    <p className="text-xs text-gray-400 mt-1">Build Plan</p>
                    <p className="text-xs text-gray-500 mt-2 leading-tight">Schematics, BOMs, instructions (viewable in app)</p>
                  </div>

                  {/* Video + PDF */}
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-800">
                    <p className="text-2xl font-black text-purple-300">${plan.basePrice + plan.videoPdfPrice}</p>
                    <p className="text-xs text-purple-300 mt-1 font-bold">+ Video & PDF</p>
                    <p className="text-xs text-purple-200 mt-2 leading-tight">Video assembly + offline PDF manual</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="p-6 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchaseBuild(plan, false)}
                  disabled={loadingCheckout[`${plan.id}-base`]}
                  className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  {loadingCheckout[`${plan.id}-base`] ? "Loading..." : "Buy Plan"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchaseBuild(plan, true)}
                  disabled={loadingCheckout[`${plan.id}-full`]}
                  className="w-full py-3 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  {loadingCheckout[`${plan.id}-full`] ? "Loading..." : "+ Video & PDF"}
                </motion.button>
              </div>

              {/* Expanded Details Button */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                  className="text-xs text-gray-400 hover:text-cyan-400 transition-colors font-bold"
                >
                  {selectedPlan === plan.id ? "Hide Details ▲" : "Show Details ▼"}
                </button>
              </div>

              {/* Expanded Content */}
              {selectedPlan === plan.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6 border-t border-gray-700 bg-gray-900/50"
                >
                  <p className="text-xs text-gray-400 mb-3 font-bold uppercase">Everything Included:</p>
                  <div className="space-y-2 mb-4">
                    {plan.what_you_get.map((item, j) => (
                      <p key={j} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 mb-3 font-bold uppercase">Video & PDF Bonus:</p>
                  <div className="space-y-2">
                    {plan.video_pdf_bonus.map((item, j) => (
                      <p key={j} className="text-xs text-purple-300 flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">♦</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Info Section ── */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-2xl font-black mb-6">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Purchase Build Plan",
              desc: "Choose base plan or add video + PDF. Complete checkout securely.",
            },
            {
              step: "2",
              title: "View in Invention Plans",
              desc: "Access full schematics, BOMs, step-by-step instructions in app. No copy/paste.",
            },
            {
              step: "3",
              title: "Build & Assemble",
              desc: "Optional: watch video assembly guides and download PDF manual for offline reference.",
            },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className="text-3xl font-black text-cyan-400 mb-2">{item.step}</div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 bg-gray-950/50 text-center text-gray-600 text-xs">
        <p>All plans are viewable in-app with protected content. Copy/paste disabled to protect intellectual property.</p>
      </footer>
    </div>
  );
}