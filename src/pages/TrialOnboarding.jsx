import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Zap, FileText, Brain, Users, ShieldCheck, ChevronRight, Clock } from "lucide-react";
import { isTrialActive } from "@/hooks/useTrialPass";

const TRIAL_FEATURES = [
  {
    icon: "🧠",
    title: "AI Invention Engine",
    desc: "Generate complete invention dossiers with technical specs and market analysis",
    status: "premium",
    path: "/inventor-forge",
  },
  {
    icon: "📋",
    title: "Patent Drafting Tool",
    desc: "Create USPTO-ready provisional patent applications in minutes",
    status: "premium",
    path: "/patent-tool",
  },
  {
    icon: "🔬",
    title: "23 Device Build Plans",
    desc: "Step-by-step blueprints with Bill of Materials for scalar EM devices",
    status: "premium",
    path: "/invention-plans",
  },
  {
    icon: "📚",
    title: "26-Course Library",
    desc: "Structured learning from IP strategy to advanced device physics",
    status: "premium",
    path: "/courses",
  },
  {
    icon: "🌐",
    title: "Concept Knowledge Graph",
    desc: "Interactive network of 200+ research concepts — free to explore",
    status: "free",
    path: "/",
  },
  {
    icon: "📜",
    title: "Prior Art Archive",
    desc: "Searchable database of 200+ historical inventions and patents",
    status: "premium",
    path: "/prior-art",
  },
  {
    icon: "💼",
    title: "Investor CRM & Pitching",
    desc: "Full pipeline management, VC deck builder, and outreach tracking",
    status: "premium",
    path: "/investor-crm",
  },
  {
    icon: "🏛️",
    title: "Virtual Data Room (VDR)",
    desc: "Secure NDA-gated document sharing with analytics and access control",
    status: "premium",
    path: "/vdr-admin",
  },
];

function FeatureCard({ feature }) {
  const isPremium = feature.status === "premium";
  const isFree = feature.status === "free";

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden transition-all group ${
        isPremium
          ? "bg-gray-900 border-gray-700 hover:border-gray-600"
          : "bg-green-950/20 border-green-800/50 hover:border-green-700"
      }`}
    >
      {isPremium && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent pointer-events-none" />
      )}
      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{feature.icon}</span>
          {isPremium && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-900/60 border border-yellow-700">
              <Lock size={11} className="text-yellow-400" />
              <span className="text-xs font-bold text-yellow-300">Premium</span>
            </div>
          )}
          {isFree && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-900/60 border border-green-700">
              <ShieldCheck size={11} className="text-green-400" />
              <span className="text-xs font-bold text-green-300">Free</span>
            </div>
          )}
        </div>
        <h3 className={`font-black text-sm mb-1 ${isPremium ? "text-gray-300" : "text-green-200"}`}>
          {feature.title}
        </h3>
        <p className={`text-xs leading-relaxed ${isPremium ? "text-gray-500" : "text-green-300/80"}`}>
          {feature.desc}
        </p>

        {isPremium && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <p className="text-gray-600 text-xs mb-2">Unlock during your trial or upgrade now</p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              See Plans <ChevronRight size={11} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrialOnboarding() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const trialEnd = localStorage.getItem("trial_pass_end");
      if (!trialEnd) return;
      const now = Date.now();
      const diff = Math.max(0, parseInt(trialEnd) - now);
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const freeFeatures = TRIAL_FEATURES.filter((f) => f.status === "free");
  const premiumFeatures = TRIAL_FEATURES.filter((f) => f.status === "premium");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header with timer */}
      <div className="sticky top-0 z-20 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm px-5 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-black text-base">Welcome to ZARP Trial</h1>
            <p className="text-gray-500 text-xs mt-0.5">24-hour Explorer Pass</p>
          </div>
          {timeLeft && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-950/40 border border-cyan-800">
              <Clock size={14} className="text-cyan-400" />
              <span className="text-sm font-bold text-cyan-300">{timeLeft} remaining</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-gray-800 px-5 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-900/40 border border-yellow-800 text-yellow-400 text-xs font-bold mb-6 uppercase tracking-widest">
            <Zap size={11} /> 24-Hour Explorer Pass
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Welcome to the AI Operating System for <span className="text-cyan-400">R&D & IP Creation</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed mb-8">
            You have 24 hours to explore the platform and see what's possible. Access the Knowledge Graph and one full invention build plan free. Everything else is available with a paid plan.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base text-black bg-gradient-to-r from-cyan-400 to-green-400 hover:opacity-90 transition-all shadow-[0_4px_24px_rgba(14,165,233,0.4)]"
          >
            <Zap size={16} /> View Plans & Pricing
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Free during trial */}
      <div className="px-5 py-14 bg-green-950/10 border-b border-green-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h3 className="text-white font-black text-2xl mb-2 flex items-center gap-2">
              <ShieldCheck size={24} className="text-green-400" /> Free During Your Trial
            </h3>
            <p className="text-gray-400 text-sm">Full access to these features for the next 24 hours</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {freeFeatures.map((f, i) => (
              <FeatureCard key={i} feature={f} />
            ))}
          </div>
        </div>
      </div>

      {/* Premium features */}
      <div className="px-5 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h3 className="text-white font-black text-2xl mb-2 flex items-center gap-2">
              <Lock size={24} className="text-yellow-500" /> Available with Paid Plans
            </h3>
            <p className="text-gray-400 text-sm">Upgrade anytime to unlock the full platform</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {premiumFeatures.map((f, i) => (
              <FeatureCard key={i} feature={f} />
            ))}
          </div>

          {/* Upgrade CTA */}
          <div className="mt-12 bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-800/30 rounded-2xl p-8 text-center">
            <h3 className="text-white font-black text-xl mb-3">Ready to unlock everything?</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
              Join the Researcher plan ($97/mo) for unlimited AI invention generation, full patent drafting, all build plans, and complete access to the IP toolkit. Cancel anytime.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base bg-cyan-700 hover:bg-cyan-600 text-white transition-all"
            >
              Start Researcher Plan — $97/mo
              <ChevronRight size={16} />
            </Link>
            <p className="text-gray-600 text-xs mt-4">🔒 Secured by Stripe · Cancel anytime</p>
          </div>
        </div>
      </div>

      {/* Info sections */}
      <div className="border-t border-gray-800 px-5 py-12 bg-gray-900/40">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { num: "1", label: "Explore Free Features", desc: "Use the Knowledge Graph and Prior Art during your 24-hour pass" },
            { num: "2", label: "See What's Locked", desc: "Browse premium features and get a sense of the full platform potential" },
            { num: "3", label: "Decide to Upgrade", desc: "Join a paid plan to access everything and start creating IP immediately" },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-900/40 border border-cyan-800 flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-400 font-black">{step.num}</span>
              </div>
              <h4 className="text-white font-bold text-sm mb-1">{step.label}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div className="px-5 py-8 border-t border-gray-800 text-center">
        <p className="text-gray-600 text-xs mb-4">Quick access to free features:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold transition-all"
          >
            Knowledge Graph
          </Link>
          <Link
            to="/prior-art"
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold transition-all"
          >
            Prior Art Archive
          </Link>
          <Link
            to="/pricing"
            className="px-4 py-2 rounded-lg bg-cyan-900/60 hover:bg-cyan-800/60 border border-cyan-700 text-cyan-300 text-xs font-semibold transition-all"
          >
            View All Plans
          </Link>
        </div>
      </div>
    </div>
  );
}