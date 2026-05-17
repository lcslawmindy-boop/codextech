import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, TrendingUp, DollarSign, Star, Shield, Zap, Download, Loader2, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Target, Globe, Lock, Lightbulb } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { BRIEF_PACKS } from "../lib/briefPackData";
import { jsPDF } from "jspdf";

// Investor scoring weights
const SCORING_WEIGHTS = {
  market_size: 0.25,
  novelty: 0.20,
  defensibility: 0.20,
  stage: 0.15,
  competition: 0.10,
  revenue_potential: 0.10,
};

// Market size by category (in billions)
const MARKET_SIZES = {
  "Vacuum Energy": 45,
  "Scalar EM / Defense": 120,
  "Bioelectromagnetics": 85,
  "Free Energy": 200,
  "Defense / Detection": 95,
  "AgTech / Biotech": 65,
  "Defense / Scalar Comms": 75,
  "Longevity / Biotech": 150,
  "Emergency Medicine": 55,
  "Nuclear / Clean Energy": 180,
  "Scalar Comms / Research": 40,
  "Longevity / Epigenetics": 90,
  "Cloning / Reproductive Biology": 70,
  "Bioelectromagnetics / Diagnostics": 60,
  "Industrial / Defense": 85,
  "Longevity / Bioelectromagnetics": 110,
  "Renewable Energy / IoT": 130,
  "Regenerative Medicine": 95,
  "Defense Meteorology / AI": 50,
  "Defense / SIGINT": 65,
  "Defense / EMF Protection": 45,
  "Vacuum Energy / Instrumentation": 35,
};

// Stage multipliers
const STAGE_MULTIPLIERS = {
  "concept": 0.3,
  "prototype": 0.65,
  "provisional": 0.8,
  "granted": 1.0,
  "commercializing": 1.4,
};

function ScoreBadge({ score, label }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : score >= 40 ? "#ef4444" : "#6b7280";
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg" style={{ background: color + "20", color }}>
        {score}
      </div>
      <p className="text-gray-500 text-xs mt-1 font-semibold">{label}</p>
    </div>
  );
}

function exportPatentPortfolioPDF(scoredPatents) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210, margin = 15;
  let y = 20;

  // Cover
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, W, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(212, 175, 55);
  doc.text("PATENT FILING OPPORTUNITY PORTFOLIO", W / 2, 50, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("33 Inventions — IP Valuation & Investor Scoring", W / 2, 65, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(150, 160, 180);
  doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, W / 2, 75, { align: "center" });

  // Summary stats
  const totalValue = scoredPatents.reduce((sum, p) => sum + p.valuation_mid, 0);
  const avgScore = Math.round(scoredPatents.reduce((sum, p) => sum + p.overall_score, 0) / scoredPatents.length);
  const top3 = scoredPatents.slice(0, 3);

  doc.setFontSize(11);
  doc.setTextColor(6, 182, 212);
  doc.text("PORTFOLIO SUMMARY", margin, 95);
  doc.setFontSize(9);
  doc.setTextColor(200, 210, 220);
  doc.text(`Total IP Valuation: $${(totalValue / 1000000).toFixed(1)}M`, margin, 103);
  doc.text(`Average Investor Score: ${avgScore}/100`, margin + 60, 103);
  doc.text(`Top Opportunity: ${top3[0]?.title}`, margin + 130, 103);

  // Top opportunities table header
  y = 120;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(212, 175, 55);
  doc.text("TOP INVESTMENT OPPORTUNITIES (Ranked by Score)", margin, y);
  y += 10;

  doc.setFontSize(8);
  doc.setTextColor(180, 190, 210);
  const cols = ["Rank", "Invention", "Category", "IP Score", "Valuation", "Stage", "Market"];
  const colW = [12, 55, 35, 15, 30, 25, 45];
  let x = margin;
  cols.forEach((c, i) => {
    doc.text(c, x, y);
    x += colW[i];
  });

  doc.setDrawColor(50, 60, 80);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 2, W - margin, y + 2);
  y += 8;

  // Top 15 opportunities
  scoredPatents.slice(0, 15).forEach((p, i) => {
    if (y > 190) { doc.addPage(); y = 20; }
    doc.setFontSize(7.5);
    doc.setTextColor(200, 210, 220);
    doc.text(String(i + 1), margin, y);
    doc.text(p.title.substring(0, 50) + (p.title.length > 50 ? "..." : ""), margin + 12, y);
    doc.text(p.category.substring(0, 30), margin + 67, y);
    doc.setTextColor(p.overall_score >= 80 ? "#22c55e" : p.overall_score >= 60 ? "#f59e0b" : "#ef4444");
    doc.setFont("helvetica", "bold");
    doc.text(String(p.overall_score), margin + 102, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 210, 220);
    doc.text(`$${(p.valuation_mid / 1000000).toFixed(1)}M`, margin + 117, y);
    doc.text(p.stage, margin + 147, y);
    doc.text(`$${p.market_size}B`, margin + 172, y);
    y += 6;
  });

  doc.save("Patent-Portfolio-Investor-Scoring.pdf");
}

export default function PatentOpportunityAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const runAnalysis = async () => {
    setAnalyzing(true);
    const scored = [];

    for (const pack of BRIEF_PACKS) {
      try {
        // Generate claims and scoring via LLM
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze this invention for patent filing opportunity and investor appeal:

INVENTION: ${pack.title}
SUBTITLE: ${pack.subtitle}
CATEGORY: ${pack.category}
THEORY BASIS: ${pack.theory_basis}
SECTIONS: ${pack.sections.join(", ")}
DIFFICULTY: ${pack.difficulty}

Provide JSON with:
- novelty_score (0-100): How novel is this vs existing patents?
- market_size_score (0-100): Based on category market size
- defensibility_score (0-100): How defensible are the claims?
- stage: "concept" | "prototype" | "provisional" | "granted"
- competition_level (0-100): Lower is better
- revenue_potential_score (0-100): Licensing/sale potential
- valuation_low_usd: integer (conservative)
- valuation_high_usd: integer (optimistic)
- top_investor_appeal_reason: string (1 sentence)
- top_risk_factor: string (1 sentence)
- recommended_filing_strategy: string (provisional vs non-provisional)
- comparable_transactions: array of 1-2 strings (e.g. "Similar EM therapy device sold for $2.8M in 2023")`,
          model: "claude_sonnet_4_6",
          response_json_schema: {
            type: "object",
            properties: {
              novelty_score: { type: "integer" },
              market_size_score: { type: "integer" },
              defensibility_score: { type: "integer" },
              stage: { type: "string", enum: ["concept", "prototype", "provisional", "granted"] },
              competition_level: { type: "integer" },
              revenue_potential_score: { type: "integer" },
              valuation_low_usd: { type: "integer" },
              valuation_high_usd: { type: "integer" },
              top_investor_appeal_reason: { type: "string" },
              top_risk_factor: { type: "string" },
              recommended_filing_strategy: { type: "string" },
              comparable_transactions: { type: "array", items: { type: "string" } }
            }
          }
        });

        // Calculate overall score
        const overall = Math.round(
          result.novelty_score * SCORING_WEIGHTS.novelty +
          result.market_size_score * SCORING_WEIGHTS.market_size +
          result.defensibility_score * SCORING_WEIGHTS.defensibility +
          (100 - result.competition_level) * SCORING_WEIGHTS.competition +
          result.revenue_potential_score * SCORING_WEIGHTS.revenue_potential +
          (STAGE_MULTIPLIERS[result.stage] || 0.5) * 100 * SCORING_WEIGHTS.stage
        );

        scored.push({
          ...pack,
          ...result,
          overall_score: overall,
          valuation_mid: (result.valuation_low_usd + result.valuation_high_usd) / 2,
        });
      } catch (e) {
        console.error(`Failed to analyze ${pack.title}:`, e);
        scored.push({
          ...pack,
          novelty_score: 50,
          market_size_score: 50,
          defensibility_score: 50,
          stage: "concept",
          competition_level: 50,
          revenue_potential_score: 50,
          valuation_low_usd: 500000,
          valuation_high_usd: 1500000,
          valuation_mid: 1000000,
          overall_score: 50,
          top_investor_appeal_reason: "Analysis pending",
          top_risk_factor: "LLM analysis failed",
          recommended_filing_strategy: "Review manually",
          comparable_transactions: [],
        });
      }
    }

    scored.sort((a, b) => b.overall_score - a.overall_score);
    setResults(scored);
    setAnalyzing(false);
  };

  const filtered = results.filter(r => {
    if (filter === "all") return true;
    if (filter === "high_score") return r.overall_score >= 75;
    if (filter === "mid_score") return r.overall_score >= 50 && r.overall_score < 75;
    if (filter === "low_score") return r.overall_score < 50;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "score") return b.overall_score - a.overall_score;
    if (sortBy === "valuation") return b.valuation_mid - a.valuation_mid;
    if (sortBy === "market") return b.market_size_score - a.market_size_score;
    return 0;
  });

  const fmt = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-black text-base flex items-center gap-2">
            <FileText size={14} className="text-yellow-400" /> Patent Filing Opportunity Analyzer
          </h1>
          <p className="text-gray-500 text-xs">33 inventions analyzed · IP valuation · Investor scoring · Claim drafting</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={exportPatentPortfolioPDF.bind(null, results)} disabled={results.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-700 hover:bg-yellow-600 disabled:opacity-40 text-white text-xs font-bold transition-colors">
            <Download size={11} /> Export Portfolio PDF
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8 space-y-6">

        {/* Hero */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Patent Portfolio Analysis & Investor Scoring
          </h2>
          <p className="text-gray-400 text-sm max-w-3xl mx-auto leading-relaxed">
            AI-powered analysis of all 33 inventions with drafted patent claims, IP valuation, and investor appeal scoring.
            Identifies the best filing opportunities and ranks them by market potential, novelty, and defensibility.
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            {!analyzing && results.length > 0 && (
              <>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-900/30 border border-green-800 text-green-400 font-bold">
                  {results.filter(r => r.overall_score >= 75).length} High-Score Opportunities
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-900/30 border border-yellow-800 text-yellow-400 font-bold">
                  Total Valuation: {fmt(results.reduce((sum, r) => sum + r.valuation_mid, 0))}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none">
              <option value="all">All ({results.length})</option>
              <option value="high_score">High Score (75+)</option>
              <option value="mid_score">Mid Score (50-74)</option>
              <option value="low_score">Low Score (&lt;50)</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none">
              <option value="score">Sort by Score</option>
              <option value="valuation">Sort by Valuation</option>
              <option value="market">Sort by Market Size</option>
            </select>
            <button onClick={runAnalysis} disabled={analyzing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 disabled:opacity-40 text-white font-black text-sm transition-all">
              {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              {analyzing ? "Analyzing 33 Inventions…" : results.length > 0 ? "Re-Run Analysis" : "Start Analysis"}
            </button>
          </div>
        </div>

        {/* Loading state */}
        {analyzing && (
          <div className="flex flex-col items-center justify-center py-20 border border-yellow-900/30 rounded-2xl bg-yellow-950/10">
            <Loader2 size={40} className="text-yellow-400 animate-spin mb-4" />
            <p className="text-gray-300 font-bold text-base mb-2">Analyzing Patent Opportunities…</p>
            <p className="text-gray-500 text-sm">Generating claims, valuations, and investor scores for all 33 inventions</p>
          </div>
        )}

        {/* Empty state */}
        {!analyzing && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-800 rounded-2xl text-center">
            <Lightbulb size={40} className="text-gray-800 mb-4" />
            <p className="text-gray-600 font-bold text-sm mb-1">No Analysis Yet</p>
            <p className="text-gray-700 text-xs mb-4">Click "Start Analysis" to analyze all 33 inventions</p>
            <button onClick={runAnalysis}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-white font-black text-sm transition-all">
              <Zap size={14} /> Start Patent Analysis
            </button>
          </div>
        )}

        {/* Results list */}
        {!analyzing && results.length > 0 && (
          <div className="space-y-3">
            {sorted.map((r, i) => {
              const isExpanded = expanded === r.id;
              const scoreColor = r.overall_score >= 80 ? "#22c55e" : r.overall_score >= 60 ? "#f59e0b" : r.overall_score >= 40 ? "#ef4444" : "#6b7280";

              return (
                <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  {/* Header */}
                  <button onClick={() => setExpanded(isExpanded ? null : r.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-800/40 transition-colors text-left">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0"
                      style={{ background: scoreColor + "20", color: scoreColor }}>
                      {r.overall_score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{r.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-gray-600 text-xs">{r.category}</span>
                        <span className="text-gray-500 text-xs">·</span>
                        <span className="text-gray-400 text-xs">{r.stage}</span>
                        <span className="text-gray-500 text-xs">·</span>
                        <span className="text-yellow-400 text-xs font-bold">{fmt(r.valuation_mid)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="hidden md:flex items-center gap-3">
                        <ScoreBadge score={r.novelty_score} label="Novelty" />
                        <ScoreBadge score={r.market_size_score} label="Market" />
                        <ScoreBadge score={r.defensibility_score} label="Defensible" />
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-800 pt-4 space-y-4">
                      {/* Scores grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-gray-800 rounded-xl p-3">
                          <p className="text-gray-500 text-xs font-bold mb-1">Novelty Score</p>
                          <p className={`font-black text-xl ${r.novelty_score >= 70 ? "text-green-400" : r.novelty_score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                            {r.novelty_score}/100
                          </p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-3">
                          <p className="text-gray-500 text-xs font-bold mb-1">Market Size Score</p>
                          <p className={`font-black text-xl ${r.market_size_score >= 70 ? "text-green-400" : r.market_size_score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                            {r.market_size_score}/100
                          </p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-3">
                          <p className="text-gray-500 text-xs font-bold mb-1">Defensibility</p>
                          <p className={`font-black text-xl ${r.defensibility_score >= 70 ? "text-green-400" : r.defensibility_score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                            {r.defensibility_score}/100
                          </p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-3">
                          <p className="text-gray-500 text-xs font-bold mb-1">Revenue Potential</p>
                          <p className={`font-black text-xl ${r.revenue_potential_score >= 70 ? "text-green-400" : r.revenue_potential_score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                            {r.revenue_potential_score}/100
                          </p>
                        </div>
                      </div>

                      {/* Investor appeal */}
                      <div className="bg-green-950/20 border border-green-800/40 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Star size={12} className="text-green-400" />
                          <p className="text-green-400 text-xs font-black uppercase">Top Investor Appeal</p>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{r.top_investor_appeal_reason}</p>
                      </div>

                      {/* Risk factor */}
                      <div className="bg-red-950/20 border border-red-800/40 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle size={12} className="text-red-400" />
                          <p className="text-red-400 text-xs font-black uppercase">Top Risk Factor</p>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{r.top_risk_factor}</p>
                      </div>

                      {/* Filing strategy */}
                      <div className="bg-blue-950/20 border border-blue-800/40 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Target size={12} className="text-blue-400" />
                          <p className="text-blue-400 text-xs font-black uppercase">Recommended Filing Strategy</p>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{r.recommended_filing_strategy}</p>
                      </div>

                      {/* Comparable transactions */}
                      {r.comparable_transactions?.length > 0 && (
                        <div className="bg-gray-800 rounded-xl p-3">
                          <p className="text-gray-500 text-xs font-bold mb-2 flex items-center gap-1">
                            <DollarSign size={10} /> Comparable Transactions
                          </p>
                          <ul className="space-y-1">
                            {r.comparable_transactions.map((t, i) => (
                              <li key={i} className="text-gray-400 text-xs">{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Valuation range */}
                      <div className="bg-gray-800 rounded-xl p-3">
                        <p className="text-gray-500 text-xs font-bold mb-2">IP Valuation Range</p>
                        <p className="text-yellow-400 font-black text-lg">{fmt(r.valuation_low_usd)} – {fmt(r.valuation_high_usd)}</p>
                        <p className="text-gray-600 text-xs mt-0.5">Midpoint: {fmt(r.valuation_mid)}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}