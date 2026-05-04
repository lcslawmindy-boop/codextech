import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowRight, Download, Zap, BookOpen, Wrench } from "lucide-react";

const PRODUCT_CONFIG = {
  "meg-brief": {
    title: "MEG Engineering Brief + Source Pack",
    emoji: "⚡",
    downloadLabel: "Download MEG Brief Pack (PDF)",
    downloadUrl: null, // placeholder — attach real file URL
    nextSteps: [
      { icon: <BookOpen size={16} className="text-cyan-400" />, label: "Continue in the Research Database", href: "/codextech-database", cta: "Open Database →" },
      { icon: <Wrench size={16} className="text-orange-400" />, label: "View the full MEG Build Plan", href: "/research-module?module=meg-system", cta: "View Module →" },
      { icon: <Zap size={16} className="text-purple-400" />, label: "Upgrade for complete BOMs + assembly steps", href: "/codextech-pricing", cta: "See Plans →" },
    ],
  },
  "research-primer": {
    title: "Free Scalar EM Research Primer",
    emoji: "📚",
    downloadLabel: "Download Research Primer (PDF)",
    downloadUrl: null,
    nextSteps: [
      { icon: <BookOpen size={16} className="text-cyan-400" />, label: "Browse the Research Database", href: "/codextech-database", cta: "Open Database →" },
      { icon: <Zap size={16} className="text-yellow-400" />, label: "See what the full membership includes", href: "/codextech-pricing", cta: "View Plans →" },
    ],
  },
  default: {
    title: "Your Purchase Is Confirmed",
    emoji: "✅",
    downloadLabel: null,
    downloadUrl: null,
    nextSteps: [
      { icon: <BookOpen size={16} className="text-cyan-400" />, label: "Explore the Research Database", href: "/codextech-database", cta: "Open Database →" },
      { icon: <Zap size={16} className="text-purple-400" />, label: "Upgrade for full membership", href: "/codextech-pricing", cta: "See Plans →" },
    ],
  },
};

export default function LeadMagnetConfirm() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const product = params.get("product") || "default";
  const config = PRODUCT_CONFIG[product] || PRODUCT_CONFIG.default;
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-5 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-950/40 border-2 border-green-700 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} className="text-green-400" />
        </div>

        <div className="text-4xl mb-4">{config.emoji}</div>
        <h1 className="text-3xl font-black mb-3">You're all set!</h1>
        <p className="text-gray-400 text-base mb-2">
          <span className="text-white font-bold">{config.title}</span> is ready.
        </p>
        <p className="text-gray-500 text-sm mb-8">Check your email for your receipt and download link.</p>

        {/* Download button */}
        {config.downloadLabel && (
          <a
            href={config.downloadUrl || "#"}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black text-white text-base mb-8 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", boxShadow: "0 4px 24px rgba(6,182,212,0.3)" }}
          >
            <Download size={18} /> {config.downloadLabel}
          </a>
        )}

        {/* Next steps */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-white font-black text-sm mb-4">What to do next:</h3>
          <div className="space-y-4">
            {config.nextSteps.map((step, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {step.icon}
                  <span className="text-gray-300 text-sm">{step.label}</span>
                </div>
                <Link to={step.href} className="text-cyan-400 text-xs font-black hover:text-cyan-300 transition-colors whitespace-nowrap flex items-center gap-1">
                  {step.cta} <ArrowRight size={11} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade nudge */}
        <div className="bg-gradient-to-br from-purple-950/30 to-gray-950 border border-purple-800/40 rounded-2xl p-6 mb-6">
          <p className="text-white font-black mb-1">Want the full build plan?</p>
          <p className="text-gray-400 text-sm mb-4">Membership unlocks complete BOMs, assembly steps, measurement protocols, and 40+ additional systems.</p>
          <Link to="/codextech-pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-sm transition-colors">
            <Zap size={14} /> View Membership Plans
          </Link>
        </div>

        <Link to="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
          Return to home →
        </Link>
      </div>
    </div>
  );
}