import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, Zap, BookOpen, DollarSign } from "lucide-react";

export default function ValuationSlider() {
  const [rdSpend, setRdSpend] = useState(250000);
  const [patentCount, setPatentCount] = useState(3);
  const [marketSize, setMarketSize] = useState(500000000);
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [breakdown, setBreakdown] = useState(null);

  // Fetch valuation whenever sliders change
  useEffect(() => {
    const fetchValuation = async () => {
      setLoading(true);
      try {
        const res = await base44.functions.invoke("valuationApiEndpoint", {
          rd_expenditure: rdSpend,
          patent_count: patentCount,
          market_size: marketSize,
        });
        if (res.data?.valuation) {
          setValuation(res.data.valuation);
          setBreakdown(res.data.breakdown || {});
        }
      } catch (error) {
        console.error("Valuation error:", error);
      }
      setLoading(false);
    };

    const timer = setTimeout(fetchValuation, 500);
    return () => clearTimeout(timer);
  }, [rdSpend, patentCount, marketSize]);

  const formatCurrency = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const formatScore = (val) => {
    if (!val) return "0";
    return Math.round(val).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/50 border border-purple-800/50 text-purple-300 text-xs font-bold mb-4 uppercase tracking-widest">
            <Zap size={10} /> Real-Time Valuation Engine
          </div>
          <h1 className="text-4xl font-black mb-3">IP Valuation Calculator</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Input your R&D expenditures, patent portfolio size, and target market to calculate your invention's real-time valuation score.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* R&D Spend Slider */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={18} className="text-cyan-400" />
              <label className="text-white font-black text-sm">R&D Expenditure</label>
            </div>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={rdSpend}
              onChange={(e) => setRdSpend(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-cyan-400 font-black text-2xl">{formatCurrency(rdSpend)}</span>
              <span className="text-slate-600 text-xs">$50K – $5M</span>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              Total investment in research, development, and prototyping costs.
            </p>
          </div>

          {/* Patent Count Slider */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-orange-400" />
              <label className="text-white font-black text-sm">Patent Count</label>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={patentCount}
              onChange={(e) => setPatentCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-orange-400 font-black text-2xl">{patentCount}</span>
              <span className="text-slate-600 text-xs">1 – 50 patents</span>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              Number of granted or pending patents in your portfolio.
            </p>
          </div>

          {/* Market Size Slider */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-green-400" />
              <label className="text-white font-black text-sm">Target Market Size</label>
            </div>
            <input
              type="range"
              min="100000000"
              max="10000000000"
              step="100000000"
              value={marketSize}
              onChange={(e) => setMarketSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-green-400 font-black text-2xl">{formatCurrency(marketSize)}</span>
              <span className="text-slate-600 text-xs">$100M – $10B</span>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              Addressable market size for the technology or product.
            </p>
          </div>
        </div>

        {/* Valuation Score Output */}
        <div className="rounded-2xl border border-purple-800/40 overflow-hidden" style={{ background: "linear-gradient(160deg,#2d1b4e,#1a0f2e)" }}>
          {/* Header */}
          <div className="px-8 py-6 border-b border-purple-900/30">
            <div className="text-xs font-black uppercase tracking-widest text-purple-300 mb-2">Invention Valuation Score</div>
            <div className="flex items-end gap-3">
              <div className="text-6xl font-black text-purple-400">
                {loading ? "..." : formatScore(valuation)}
              </div>
              <div className="text-slate-400 text-sm pb-1">
                {loading ? "calculating..." : "IP Value Estimate"}
              </div>
            </div>
          </div>

          {/* Breakdown */}
          {breakdown && !loading && (
            <div className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {breakdown.rd_contribution && (
                  <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-800">
                    <p className="text-slate-500 text-xs uppercase font-bold mb-1">R&D Component</p>
                    <p className="text-cyan-400 font-black text-lg">${breakdown.rd_contribution.toLocaleString()}</p>
                  </div>
                )}
                {breakdown.patent_contribution && (
                  <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-800">
                    <p className="text-slate-500 text-xs uppercase font-bold mb-1">Patent Portfolio Value</p>
                    <p className="text-orange-400 font-black text-lg">${breakdown.patent_contribution.toLocaleString()}</p>
                  </div>
                )}
                {breakdown.market_contribution && (
                  <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-800">
                    <p className="text-slate-500 text-xs uppercase font-bold mb-1">Market Multiplier</p>
                    <p className="text-green-400 font-black text-lg">${breakdown.market_contribution.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {breakdown.confidence_level && (
                <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-800">
                  <p className="text-slate-400 text-sm mb-2">
                    <strong>Confidence Level:</strong> {breakdown.confidence_level}
                  </p>
                  <p className="text-slate-500 text-xs">
                    This valuation is based on patent count, R&D investment, and addressable market size. Consult a licensed IP valuation professional for certified assessments.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-amber-950/20 border border-amber-900/30 rounded-xl px-6 py-4">
          <p className="text-amber-200/70 text-xs leading-relaxed">
            <strong className="text-amber-300">Disclaimer:</strong> This valuation calculator is an educational tool based on patent count, R&D expenditure, and market size. It is not a substitute for a professional IP valuation conducted by a certified appraiser. Results are estimates only and should not be used for financial, legal, or investment decisions without professional consultation.
          </p>
        </div>
      </div>
    </div>
  );
}