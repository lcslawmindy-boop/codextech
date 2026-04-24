/**
 * UpgradeBar — sticky top strip shown on member-area pages.
 * Keeps the upgrade CTA visible without a full nav rebuild.
 * Import and drop at the top of any page that needs it.
 */
import { Link } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";

export default function UpgradeBar({ message, ctaLabel = "Upgrade Now", ctaHref = "/paywall" }) {
  return (
    <div className="w-full bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border-b border-purple-800/40 px-4 py-2 flex items-center justify-between gap-3 backdrop-blur">
      <div className="flex items-center gap-2 min-w-0">
        <Zap size={13} className="text-purple-400 flex-shrink-0" />
        <span className="text-purple-200 text-xs truncate">
          {message || "Unlock all 40+ builds, courses & AI tools — from $29/month"}
        </span>
      </div>
      <Link to={ctaHref}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition-colors whitespace-nowrap flex-shrink-0">
        {ctaLabel} <ArrowRight size={11} />
      </Link>
    </div>
  );
}