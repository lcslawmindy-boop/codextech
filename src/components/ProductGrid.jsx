import { useState } from "react";
import { Link } from "react-router-dom";
import { Database, BookOpen, FlaskConical, Shield, FileText, Lock, Check, Loader2, Coins } from "lucide-react";
import { PRODUCTS, BUILD_PLANS_INFO } from "@/lib/alaCarteProducts";
import { useCredits } from "@/hooks/useCredits";

const ICONS = { Database, BookOpen, FlaskConical, Shield, FileText };

export default function ProductGrid() {
  const { balance, spend } = useCredits();
  const [spending, setSpending] = useState(null);
  const [needCredits, setNeedCredits] = useState(null);

  const handleBuy = async (product) => {
    setNeedCredits(null);
    setSpending(product.id);
    const result = await spend(product.name, product.creditCost);
    setSpending(null);
    if (result.ok) {
      window.location.href = product.route;
    } else {
      setNeedCredits(product.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {PRODUCTS.map((product) => {
        const Icon = ICONS[product.icon] || Database;
        const isNeedCredits = needCredits === product.id;
        const isSpending = spending === product.id;
        return (
          <div
            key={product.id}
            className="relative flex flex-col rounded-2xl overflow-hidden border transition-all hover:scale-[1.02]"
            style={{ borderColor: product.color + "50", background: "linear-gradient(160deg,#0d1526,#0a1020)" }}
          >
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: product.color + "20" }}>
                  <Icon size={22} style={{ color: product.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-black text-lg leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Coins size={11} style={{ color: product.color }} />
                    <span className="text-xs font-bold" style={{ color: product.color }}>{product.creditCost} credits</span>
                    <span className="text-slate-600 text-xs">· ${product.price}</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">{product.desc}</p>
              <ul className="space-y-1.5 mb-5 flex-1">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check size={11} className="flex-shrink-0 mt-0.5" style={{ color: product.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              {isNeedCredits ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-bold flex-1">
                    <Lock size={14} /> Need {product.creditCost} credits
                  </span>
                  <Link
                    to="/pricing"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold whitespace-nowrap transition-all"
                  >
                    Buy Credits →
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => handleBuy(product)}
                  disabled={isSpending}
                  className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: product.color }}
                >
                  {isSpending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    `Get Access · ${product.creditCost} credits`
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Build Plans — Not for Sale (blurred) */}
      <div className="relative flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/30">
        <div className="p-6 flex flex-col flex-1 blur-[6px] pointer-events-none select-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-800">
              <Lock size={22} className="text-slate-500" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">{BUILD_PLANS_INFO.name}</h3>
              <p className="text-slate-600 text-xs">Not for Sale</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mb-4">{BUILD_PLANS_INFO.desc}</p>
          <ul className="space-y-1.5 flex-1">
            {BUILD_PLANS_INFO.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <Check size={11} className="flex-shrink-0 mt-0.5 text-slate-700" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-5 py-2.5 rounded-full bg-red-950/90 border-2 border-red-700 text-red-400 text-xs font-black uppercase tracking-widest shadow-xl">
            🔒 Not for Sale — Research Only
          </div>
        </div>
      </div>
    </div>
  );
}