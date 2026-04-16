import { ChevronDown, ChevronUp, TrendingUp, Clock, MessageSquare, Zap, DollarSign, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function InvestorLikelihoodBreakdown({ investor, expanded = false }) {
  const [show, setShow] = useState(expanded);
  const factors = investor.scoring_breakdown || {};

  const factorDetails = {
    stage_progress: {
      icon: <TrendingUp size={14} />,
      label: "Stage Progress",
      color: "#10b981",
      description: "How far along in deal pipeline (prospect → closed)",
      details: {
        prospect: "0 pts - No engagement yet",
        initial_outreach: "5 pts - First contact made",
        responded: "10 pts - They replied positively",
        meeting_scheduled: "15 pts - Meeting confirmed",
        due_diligence: "20 pts - Active evaluation",
        term_sheet: "23 pts - Near final terms",
        negotiating: "25 pts - Final deal negotiations",
        closed: "100 pts - Investment completed"
      }
    },
    engagement: {
      icon: <Clock size={14} />,
      label: "Recent Engagement",
      color: "#f59e0b",
      description: "How recently you've contacted them (last 7 days = high priority)",
      details: {
        "< 7 days": "20 pts - Very fresh contact",
        "7-14 days": "15 pts - Recent touchpoint",
        "14-30 days": "10 pts - Month-old interaction",
        "> 30 days": "0 pts - Cold trail"
      }
    },
    response_rate: {
      icon: <MessageSquare size={14} />,
      label: "Response Rate",
      color: "#3b82f6",
      description: "% of your communications they've replied to",
      details: {
        "100%": "15 pts - Always responds",
        "75%+": "12 pts - Usually engaged",
        "50%+": "8 pts - Sometimes replies",
        "25%+": "5 pts - Occasional response",
        "0%": "0 pts - No engagement"
      }
    },
    custom_scoring: {
      icon: <Zap size={14} />,
      label: "Custom Assessment",
      color: "#a855f7",
      description: "Your manual scoring of fit (strategic fit, sector experience, etc.)",
      details: {
        "80-100": "40 pts - Perfect alignment",
        "60-79": "30 pts - Strong fit",
        "40-59": "20 pts - Moderate fit",
        "0-39": "0 pts - Poor fit"
      }
    },
    size_alignment: {
      icon: <DollarSign size={14} />,
      label: "Investment Size Fit",
      color: "#06b6d4",
      description: "Your ask matches their typical check size",
      details: {
        "within 50%": "10 pts - Perfect size match",
        "50-100% variance": "5 pts - Close match",
        "> 100% variance": "0 pts - Wrong size bracket"
      }
    },
    imminent_action: {
      icon: <CheckCircle2 size={14} />,
      label: "Urgent Action",
      color: "#ec4899",
      description: "You have a scheduled action within the next week",
      details: {
        "within 7 days": "10 pts - Action pending",
        "no action": "0 pts - No urgent items"
      }
    }
  };

  const totalScore = investor.likelihood_score || 0;

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/50">
      <button
        onClick={() => setShow(!show)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors">
        <div className="flex items-center gap-3 flex-1">
          <TrendingUp size={16} className="text-green-400" />
          <div className="text-left">
            <p className="text-white font-bold text-sm">Likelihood Breakdown</p>
            <p className="text-gray-500 text-xs">Why they're likely to invest</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-green-400 font-black text-lg">{totalScore}%</p>
            <p className="text-gray-600 text-xs">{investor.recommendation || "—"}</p>
          </div>
          {show ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </div>
      </button>

      {show && (
        <div className="px-4 py-3 border-t border-gray-800 space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(factors).map(([key, value]) => {
            const detail = factorDetails[key];
            if (!detail || value === 0) return null;

            return (
              <div key={key} className="bg-gray-800/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: detail.color }}>{detail.icon}</span>
                  <div className="flex-1">
                    <p className="text-gray-300 font-bold text-sm">{detail.label}</p>
                    <p className="text-gray-500 text-xs">{detail.description}</p>
                  </div>
                  <span className="font-black text-lg" style={{ color: detail.color }}>
                    +{value}
                  </span>
                </div>

                {/* Mini gauge */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(value / Object.values(factors).reduce((a, b) => a + b, 0)) * 100}%`,
                        backgroundColor: detail.color
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{Math.round((value / 100) * 100)}%</span>
                </div>

                {/* Examples */}
                <div className="bg-gray-900/50 rounded p-2 mt-2">
                  <p className="text-gray-600 text-xs font-semibold mb-1">Point scale:</p>
                  <ul className="text-gray-500 text-xs space-y-0.5">
                    {Object.entries(detail.details).map(([condition, points]) => (
                      <li key={condition} className="flex items-center justify-between">
                        <span>{condition}</span>
                        <span className="font-mono">{points}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          {/* Overall Summary */}
          <div className="bg-green-950/20 border border-green-800/50 rounded-lg p-3 mt-3">
            <p className="text-green-400 text-xs font-bold mb-2">💡 What This Means</p>
            {totalScore >= 75 && (
              <p className="text-green-300 text-xs leading-relaxed">
                <strong>Hot Prospect:</strong> This investor shows strong engagement signals across multiple factors. They've moved far in your pipeline, respond frequently, and represent a good investment size fit. Prioritize closing this deal.
              </p>
            )}
            {totalScore >= 50 && totalScore < 75 && (
              <p className="text-yellow-300 text-xs leading-relaxed">
                <strong>Warm Lead:</strong> Solid potential but not all signals are aligned. Focus on improving engagement (respond faster, more frequent contact) and clarifying strategic fit. They could become a hot prospect.
              </p>
            )}
            {totalScore < 50 && (
              <p className="text-gray-400 text-xs leading-relaxed">
                <strong>Cold Lead:</strong> Limited engagement or poor alignment. Consider if this investor is worth your effort or if you should focus on warmer prospects first. If pursuing, start with a strong value prop.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}