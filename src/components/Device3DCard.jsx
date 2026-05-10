import { useState } from "react";
import { ShoppingCart, Loader2, ChevronDown, ChevronUp, Package, Zap, Wrench, Lightbulb } from "lucide-react";
import { base44 } from "@/api/base44Client";

function getPriceNum(priceStr) {
  return Math.round(parseFloat((priceStr || "$0").replace(/[$,]/g, "")));
}

function BuyButton({ invention }) {
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
      className="w-full py-3 px-4 rounded-lg text-sm font-black text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
      {loading ? "Processing..." : `Get Build Plans — ${invention.price}`}
    </button>
  );
}

export default function Device3DCard({ invention, isHighlight }) {
  const [expanded, setExpanded] = useState(false);
  const priceNum = getPriceNum(invention.price);

  // Device specs for display
  const specs = [
    { label: "Complexity", value: invention.complexity || "Intermediate" },
    { label: "Build Time", value: invention.buildTime || "2-4 weeks" },
    { label: "Cost Range", value: invention.price },
  ];

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
        isHighlight
          ? "md:col-span-2 md:row-span-2 shadow-2xl"
          : "shadow-xl hover:shadow-2xl"
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)",
        border: "1px solid rgba(148,163,184,0.2)",
      }}
    >
      {/* 3D-style background effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
      </div>

      {/* Header with Icon & Stats */}
      <div className={`relative p-6 ${isHighlight ? "pb-8" : "pb-4"}`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="text-5xl flex-shrink-0">{invention.icon}</div>
            <div className="flex-1">
              <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-1">{invention.title}</h3>
              <p className="text-slate-400 text-xs italic">{invention.tagline}</p>
              {isHighlight && invention.description && (
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">{invention.description}</p>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">PRICE</p>
            <p className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {invention.price}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`flex flex-wrap gap-2 ${isHighlight ? "gap-3" : ""}`}>
          {specs.map((spec, i) => (
            <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[10px]">
              <span className="text-slate-500 font-bold">{spec.label}:</span>
              <span className="text-slate-300 ml-1">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative px-6 pb-6 space-y-4 flex-1">
        {/* What It Is */}
        {invention.whatItIs && (
          <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-800/20 rounded-lg p-4">
            <p className="text-slate-300 text-sm leading-relaxed">{invention.whatItIs}</p>
          </div>
        )}

        {/* Problem & Solution Toggle */}
        {(invention.problem || invention.beardenSolution) && (
          <div className="space-y-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 transition-colors text-left"
            >
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Details</span>
              {expanded ? (
                <ChevronUp size={14} className="text-cyan-400" />
              ) : (
                <ChevronDown size={14} className="text-slate-500" />
              )}
            </button>

            {expanded && (
              <div className="space-y-2.5">
                {invention.problem && (
                  <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-3.5">
                    <p className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1.5">⚠ Problem</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{invention.problem}</p>
                  </div>
                )}
                {invention.beardenSolution && (
                  <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-3.5">
                    <p className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-1.5">💡 Solution</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{invention.beardenSolution}</p>
                  </div>
                )}
                {invention.market && (
                  <div className="bg-green-950/20 border border-green-900/30 rounded-lg p-3.5">
                    <p className="text-green-400 font-bold text-xs uppercase tracking-wider mb-1.5">📈 Market</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{invention.market}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* What's Included */}
        {invention.whatIncluded && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2.5">📦 Includes</p>
            <ul className="space-y-1.5">
              {invention.whatIncluded.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-700/50">
          <BuyButton invention={invention} />
          <a
            href="#specs"
            className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-slate-300 border border-slate-700 hover:bg-slate-800/60 transition-all text-center"
          >
            View Full Specifications
          </a>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
        style={{
          background: "linear-gradient(135deg, rgba(0,229,255,0.1), rgba(59,130,246,0.1))",
        }}
      />
    </div>
  );
}