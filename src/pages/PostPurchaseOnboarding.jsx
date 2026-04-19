import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Lock, BookOpen, FlaskConical, Zap, ChevronRight, ArrowRight, Award } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TIER_UNLOCKS = {
  starter: {
    name: "Starter Plan",
    color: "#f59e0b",
    inventions: 5,
    courses: 4,
    features: [
      "✓ 5 Invention Build Plans with full PDFs",
      "✓ 4 Complete courses with curriculum",
      "✓ Step-by-step assembly guides",
      "✓ Prior Art Archive access",
      "✗ AI Invention Forge",
      "✗ Patent Drafting Tool",
      "✗ Investor CRM",
    ],
    nextTier: { name: "Researcher ($97/mo)", path: "/pricing", color: "#6366f1" },
  },
  researcher: {
    name: "Researcher Plan",
    color: "#6366f1",
    inventions: 21,
    courses: 26,
    features: [
      "✓ All 21 Invention Build Plans",
      "✓ Full course library (26+ courses)",
      "✓ AI Invention Forge (unlimited)",
      "✓ EM Lab simulators & visualization",
      "✓ Prior Art Archive (200+ entries)",
      "✓ Build Video generator",
      "✗ Patent Drafting Tool",
      "✗ Investor CRM",
    ],
    nextTier: { name: "Pro ($247/mo)", path: "/pricing", color: "#22c55e" },
  },
  pro: {
    name: "Pro Plan",
    color: "#22c55e",
    inventions: 21,
    courses: 26,
    features: [
      "✓ Everything in Researcher",
      "✓ AI Patent Drafting Tool (unlimited)",
      "✓ Investor CRM & Pitch Deck Builder",
      "✓ IP Valuation Calculator",
      "✓ Acquisition CRM & deal pipeline",
      "✓ VDR Portal (Virtual Data Room)",
      "✓ Priority support",
    ],
    nextTier: null,
  },
};

export default function PostPurchaseOnboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tier, setTier] = useState(null);
  const [loading, setLoading] = useState(true);

  const productId = searchParams.get("product");
  const tierData = TIER_UNLOCKS[productId];

  useEffect(() => {
    // Verify purchase and set tier
    if (tierData) {
      setTier(productId);
    }
    setLoading(false);
  }, [productId, tierData]);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tierData) {
    return (
      <div className="w-screen min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-white font-black text-2xl mb-2">Purchase confirmed!</h1>
          <p className="text-gray-400 text-sm mb-6">Your account is being set up. Redirecting in a moment…</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-700 text-white font-bold text-sm hover:bg-blue-600 transition-all">
            Go to Dashboard <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-white font-black text-xl">Welcome to Zenith Apex</h1>
          <p className="text-gray-500 text-sm">Plan: <span style={{ color: tierData.color }} className="font-bold">{tierData.name}</span></p>
        </div>
      </div>

      {/* Hero — Success confirmation */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 px-5 py-12 text-center border-b border-gray-800">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: tierData.color + "20", border: `2px solid ${tierData.color}` }}>
              <CheckCircle2 size={32} style={{ color: tierData.color }} />
            </div>
          </div>
          <h2 className="text-white font-black text-3xl mb-2">Payment Successful!</h2>
          <p className="text-gray-400 text-lg mb-6">Your {tierData.name} membership is active. Now let's get you started on your first invention or course.</p>
        </div>
      </div>

      {/* Main content: 2 columns */}
      <div className="px-5 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: What you've unlocked */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-black text-xl mb-6">Here's what you can access now</h3>

            {/* Invention plans card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <FlaskConical size={22} style={{ color: tierData.color }} />
                <h4 className="text-white font-bold text-lg">{tierData.inventions} Invention Build Plans</h4>
              </div>
              <p className="text-gray-400 text-sm mb-4">Step-by-step instructions, Bills of Materials, schematics, and downloadable PDFs for each device.</p>
              <Link to="/invention-plans"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all text-white"
                style={{ backgroundColor: tierData.color }}>
                Browse All Plans <ChevronRight size={14} />
              </Link>
            </div>

            {/* Courses card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen size={22} style={{ color: tierData.color }} />
                <h4 className="text-white font-bold text-lg">{tierData.courses}+ Structured Courses</h4>
              </div>
              <p className="text-gray-400 text-sm mb-4">Learn scalar EM theory, patent strategy, investor relations, and device physics — with new content monthly.</p>
              <Link to="/courses"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all text-white"
                style={{ backgroundColor: tierData.color }}>
                Start Learning <ChevronRight size={14} />
              </Link>
            </div>

            {/* Features grid */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award size={16} style={{ color: tierData.color }} />
                Full Feature Access
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tierData.features.map((f, i) => (
                  <div key={i} className={`flex items-start gap-2 text-sm ${f.startsWith("✓") ? "text-gray-300" : "text-gray-600 opacity-50"}`}>
                    <span className={f.startsWith("✓") ? "text-green-400" : "text-gray-700"} style={f.startsWith("✓") ? { color: tierData.color } : {}}>
                      {f.startsWith("✓") ? "✓" : "✗"}
                    </span>
                    <span>{f.replace(/^[✓✗] /, "")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick start + upgrade path */}
          <div>
            {/* Quick start card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 sticky top-6">
              <h3 className="text-white font-bold text-lg mb-4">Next Steps</h3>
              <div className="space-y-3">
                <Link to="/invention-plans"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-700 hover:border-gray-600 bg-gray-800/40 transition-all text-left">
                  <span className="text-2xl">🔧</span>
                  <div>
                    <p className="text-white font-bold text-sm">Pick a Device to Build</p>
                    <p className="text-gray-500 text-xs">Browse all {tierData.inventions} build plans</p>
                  </div>
                </Link>

                <Link to="/courses"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-700 hover:border-gray-600 bg-gray-800/40 transition-all text-left">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="text-white font-bold text-sm">Take a Course</p>
                    <p className="text-gray-500 text-xs">Learn theory & best practices</p>
                  </div>
                </Link>

                <Link to="/inventor-forge"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-700 hover:border-gray-600 bg-gray-800/40 transition-all text-left">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-white font-bold text-sm">Generate an Invention</p>
                    <p className="text-gray-500 text-xs">Use AI Forge (if in your plan)</p>
                  </div>
                </Link>

                <Link to="/account"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-700 hover:border-gray-600 bg-gray-800/40 transition-all text-left">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-white font-bold text-sm">View Your Account</p>
                    <p className="text-gray-500 text-xs">Manage subscription & settings</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Upgrade card (if not Pro) */}
            {tierData.nextTier && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Want More?</p>
                <h4 className="text-white font-black text-lg mb-2">Upgrade to {tierData.nextTier.name}</h4>
                <ul className="space-y-2 mb-4 text-xs text-gray-300">
                  {productId === "starter" && (
                    <>
                      <li className="flex items-center gap-2">
                        <span style={{ color: tierData.nextTier.color }}>+</span> AI Invention Forge (unlimited)
                      </li>
                      <li className="flex items-center gap-2">
                        <span style={{ color: tierData.nextTier.color }}>+</span> All 21 build plans
                      </li>
                      <li className="flex items-center gap-2">
                        <span style={{ color: tierData.nextTier.color }}>+</span> Full course library
                      </li>
                    </>
                  )}
                  {productId === "researcher" && (
                    <>
                      <li className="flex items-center gap-2">
                        <span style={{ color: tierData.nextTier.color }}>+</span> AI Patent Drafting Tool
                      </li>
                      <li className="flex items-center gap-2">
                        <span style={{ color: tierData.nextTier.color }}>+</span> Investor CRM & Pitch Builder
                      </li>
                      <li className="flex items-center gap-2">
                        <span style={{ color: tierData.nextTier.color }}>+</span> VDR Portal
                      </li>
                    </>
                  )}
                </ul>
                <Link to={tierData.nextTier.path}
                  className="block w-full py-2.5 rounded-lg font-bold text-sm text-center transition-all text-white"
                  style={{ backgroundColor: tierData.nextTier.color }}>
                  Explore Upgrade
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-gray-800 px-5 py-12 text-center bg-gray-900/40">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-white font-black text-xl mb-2">Ready to get started?</h3>
          <p className="text-gray-400 text-sm mb-6">Your membership is active immediately. Start exploring invention plans, taking courses, and using AI tools.</p>
          <Link to="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all"
            style={{ backgroundColor: tierData.color }}>
            Go to Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}