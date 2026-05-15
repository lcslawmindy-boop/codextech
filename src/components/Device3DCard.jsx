import { useState } from "react";
import { ShoppingCart, Loader2, Zap, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";

function getPriceNum(priceStr) {
  return Math.round(parseFloat((priceStr || "$0").replace(/[$,]/g, "")));
}

// Pick an accent color per invention based on its index/title hash
function accentColor(title = "") {
  const colors = ["#06b6d4", "#a855f7", "#f97316", "#22c55e", "#fbbf24", "#ec4899", "#3b82f6", "#10b981"];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// Complexity badge
function complexityBadge(complexity = "Intermediate") {
  const map = {
    Beginner:     { label: "Beginner",     bg: "#052e16", color: "#4ade80" },
    Intermediate: { label: "Intermediate", bg: "#172554", color: "#60a5fa" },
    Advanced:     { label: "Advanced",     bg: "#2d1b69", color: "#c084fc" },
    Expert:       { label: "Expert",       bg: "#450a0a", color: "#f87171" },
  };
  const c = map[complexity] || map.Intermediate;
  return (
    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function BuyButton({ invention, color }) {
  const [loading, setLoading] = useState(false);
  const priceInCents = Math.round(getPriceNum(invention.price) * 100);

  const handleBuy = async () => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app, not inside the editor.");
      return;
    }
    setLoading(true);
    try {
      const origin = window.location.origin;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: invention.title,
        priceInCents,
        description: invention.tagline,
        category: "Invention",
        successUrl: `${origin}/device-catalogue`,
        cancelUrl: `${origin}/device-catalogue`,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full py-2.5 rounded-xl text-sm font-black text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:opacity-90"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <ShoppingCart size={13} />}
      {loading ? "Processing..." : `Get Plans — ${invention.price}`}
    </button>
  );
}

export default function Device3DCard({ invention, isHighlight }) {
  const color = accentColor(invention.title);
  const complexity = invention.complexity || "Intermediate";

  // Pick 3 key "what's included" bullets — concise
  const bullets = invention.whatIncluded?.slice(0, 3) || [
    "Full BOM & part numbers",
    "Step-by-step assembly guide",
    "Downloadable PDF schematics",
  ];

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
        isHighlight ? "sm:col-span-2" : ""
      }`}
      style={{
        background: "linear-gradient(160deg, #0d1526 0%, #0a1020 100%)",
        border: `1px solid ${color}40`,
        boxShadow: `0 4px 24px ${color}18`,
      }}
    >
      {/* ── Top color accent bar ── */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      {/* ── Glow on hover ── */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}12, transparent 70%)` }} />

      {/* ── Card Header ── */}
      <div className="p-5 pb-3 relative">
        <div className="flex items-start justify-between mb-3">
          {/* Icon with glow */}
          <div className="relative">
            <div className="text-4xl leading-none">{invention.icon}</div>
            <div className="absolute -inset-2 rounded-full blur-xl opacity-40"
              style={{ background: color }} />
          </div>

          {/* Price + complexity */}
          <div className="text-right flex flex-col items-end gap-1">
            <div className="text-2xl font-black" style={{ color }}>{invention.price}</div>
            {complexityBadge(complexity)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-black text-sm leading-snug mb-1">{invention.title}</h3>
        <p className="text-slate-500 text-[11px] italic leading-snug">{invention.tagline}</p>
      </div>

      {/* ── Visual divider ── */}
      <div className="mx-5 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}30, transparent)` }} />

      {/* ── Quick stats row ── */}
      <div className="px-5 py-3 grid grid-cols-3 gap-2">
        {[
          { label: "Build Time", val: invention.buildTime || "2–4 wks" },
          { label: "Complexity", val: complexity },
          { label: "Source", val: "US Patent" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-[10px] font-black" style={{ color }}>{s.val}</div>
            <div className="text-[9px] text-slate-600 font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Visual divider ── */}
      <div className="mx-5 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}20, transparent)` }} />

      {/* ── What's included bullets ── */}
      <div className="px-5 py-3 flex-1">
        <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color }}>Included</p>
        <ul className="space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
              <span className="mt-0.5 flex-shrink-0" style={{ color }}>✓</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* ── CTA ── */}
      <div className="px-5 pb-5 pt-2">
        <BuyButton invention={invention} color={color} />
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <Lock size={9} className="text-slate-700" />
          <span className="text-[10px] text-slate-700">Secure checkout · Instant access</span>
        </div>
      </div>

      {/* ── Bottom accent line ── */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
    </div>
  );
}