/**
 * PaywallModal — Reusable membership/purchase gate modal
 * Props:
 *   type: "membership" | "purchase" | "upgrade"
 *   inventionTitle: string
 *   price: string (e.g., "$99/mo")
 *   icon: emoji or React component
 *   features: string[] (what's included)
 *   ctaLabel: string
 *   ctaHref: string (link to pricing/checkout)
 *   onDismiss: fn
 */
import { X, Check, Lock, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PAYWALL_CONFIG = {
  membership: {
    badge: "Membership Required",
    badgeColor: "text-indigo-400",
    badgeBg: "bg-indigo-950/40 border-indigo-800",
    headerColor: "text-indigo-400",
    buttonColor: "bg-indigo-700 hover:bg-indigo-600",
    icon: Lock,
  },
  purchase: {
    badge: "Purchase Required",
    badgeColor: "text-red-400",
    badgeBg: "bg-red-950/40 border-red-800",
    headerColor: "text-red-400",
    buttonColor: "bg-red-700 hover:bg-red-600",
    icon: Shield,
  },
  upgrade: {
    badge: "Upgrade Available",
    badgeColor: "text-amber-400",
    badgeBg: "bg-amber-950/40 border-amber-800",
    headerColor: "text-amber-400",
    buttonColor: "bg-amber-600 hover:bg-amber-500",
    icon: ArrowRight,
  },
};

export default function PaywallModal({
  type = "membership",
  inventionTitle,
  price,
  icon = "🔒",
  features = [],
  ctaLabel = "View Plans",
  ctaHref = "/pricing",
  onDismiss,
}) {
  const config = PAYWALL_CONFIG[type] || PAYWALL_CONFIG.membership;
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header bar */}
        <div className={`h-1 w-full ${type === "membership" ? "bg-indigo-600" : type === "purchase" ? "bg-red-600" : "bg-amber-600"}`} />

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-300 transition-colors z-10">
          <X size={18} />
        </button>

        {/* Icon section */}
        <div className="flex items-center justify-center py-8">
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl border-2 ${config.badgeBg}`}>
            {typeof icon === "string" ? icon : <icon.type {...icon.props} size={48} className={config.headerColor} />}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconComponent size={14} className={config.headerColor} />
            <span className={`font-black text-xs uppercase tracking-wider ${config.headerColor}`}>
              {config.badge}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-white font-black text-2xl text-center mb-2">
            {inventionTitle || "Unlock Full Access"}
          </h2>

          {/* Price or subtitle */}
          {price && (
            <p className="text-center text-gray-400 text-sm mb-6">
              {type === "membership" ? `Starting at ${price}` : `One-time: ${price}`}
            </p>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 mb-6 space-y-2.5">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">What's included:</p>
              {features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <Check size={13} className={`flex-shrink-0 mt-0.5 ${
                    type === "membership" ? "text-indigo-400" : type === "purchase" ? "text-red-400" : "text-amber-400"
                  }`} />
                  {feat}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <Link
            to={ctaHref}
            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-white text-sm transition-all mb-3 ${config.buttonColor}`}>
            {ctaLabel} <ArrowRight size={14} />
          </Link>

          {/* Dismiss option */}
          <button
            onClick={onDismiss}
            className="w-full py-2.5 text-gray-400 hover:text-gray-300 text-xs font-semibold transition-colors">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}