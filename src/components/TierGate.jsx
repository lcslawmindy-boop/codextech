import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { TIERS } from "../lib/tiers";

/**
 * Wraps content — if `locked` is true, shows a blurred overlay with upgrade CTA.
 * requiredTier: "starter" | "researcher" | "pro"
 */
export default function TierGate({ locked, requiredTier = "starter", children }) {
  if (!locked) return children;

  const tier = TIERS[requiredTier] || TIERS.starter;

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blurred content behind */}
      <div className="pointer-events-none select-none blur-sm opacity-40">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/70 backdrop-blur-[2px] z-10 p-4">
        <div className="bg-gray-900 border rounded-2xl px-6 py-5 text-center max-w-xs shadow-2xl"
          style={{ borderColor: tier.color + "55" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: tier.color + "22" }}>
            <Lock size={18} style={{ color: tier.color }} />
          </div>
          <p className="text-white font-black text-sm mb-1">
            {tier.name} Plan Required
          </p>
          <p className="text-gray-400 text-xs mb-4 leading-relaxed">
            Unlock this content by upgrading to the <span style={{ color: tier.color }} className="font-bold">{tier.name}</span> plan
            {tier.type === "one_time" ? ` — $${tier.price} one-time` : ` — $${tier.price}/mo`}.
          </p>
          <Link to="/pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all"
            style={{ backgroundColor: tier.color, color: "#000" }}>
            Upgrade Now →
          </Link>
        </div>
      </div>
    </div>
  );
}