import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

/**
 * Reusable upsell banner — shown after lead magnet, tripwire, locked modules.
 * variant: "bundle" | "membership" | "operator"
 */
export default function FunnelUpsellBanner({ variant = "membership" }) {
  const configs = {
    membership: {
      badge: "NEXT STEP",
      heading: "Unlock the Full Research Database",
      sub: "Get structured modules, patent intelligence, and weekly drops.",
      price: "$49/mo",
      cta: "Start Membership",
      href: "/codextech-pricing",
      color: "#1a1a2e",
      border: "#3b82f6",
      btnBg: "#3b82f6",
    },
    operator: {
      badge: "UPGRADE",
      heading: "Go Full Operator Access",
      sub: "Full database + build systems + patent intelligence + engineering frameworks.",
      price: "$197/mo",
      cta: "Unlock Operator Access",
      href: "/codextech-pricing",
      color: "#0f0f0f",
      border: "#8b5cf6",
      btnBg: "#8b5cf6",
    },
    bundle: {
      badge: "🔥 ONE-TIME OFFER",
      heading: "Get the Engineering Systems Bundle",
      sub: "Complete build plans, architecture docs, BOM frameworks — lifetime access.",
      price: "$997 one-time",
      cta: "Get the Bundle",
      href: "/engineering-systems-bundle",
      color: "#0f0f0a",
      border: "#f59e0b",
      btnBg: "#f59e0b",
    },
  };

  const c = configs[variant];

  return (
    <div
      className="rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 my-8"
      style={{ background: c.color, border: `2px solid ${c.border}`, boxShadow: `0 0 30px ${c.border}33` }}
    >
      <div className="flex-1">
        <span className="text-xs font-black tracking-widest px-2 py-1 rounded mb-2 inline-block"
          style={{ background: `${c.border}22`, color: c.border, border: `1px solid ${c.border}55` }}>
          {c.badge}
        </span>
        <h3 className="text-white font-black text-lg mt-1">{c.heading}</h3>
        <p className="text-gray-400 text-sm mt-1">{c.sub}</p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="font-black text-white text-xl">{c.price}</span>
        <Link
          to={c.href}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all hover:opacity-90"
          style={{ background: c.btnBg, color: variant === "bundle" ? "#000" : "#fff" }}
        >
          {c.cta} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}