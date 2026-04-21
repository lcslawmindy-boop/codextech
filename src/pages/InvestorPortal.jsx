import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, FileCheck, DollarSign, Clock, CheckCircle2, AlertCircle, Eye, MessageSquare, Download, Filter, ChevronRight, Briefcase, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const LOI_STATUSES = {
  submitted: { color: "#f59e0b", label: "Submitted", icon: "📤" },
  under_review: { color: "#6366f1", label: "Under Review", icon: "🔍" },
  interested: { color: "#3b82f6", label: "Seller Interested", icon: "👍" },
  negotiating: { color: "#8b5cf6", label: "Negotiating", icon: "💬" },
  completed: { color: "#22c55e", label: "Deal Closed", icon: "✅" },
  rejected: { color: "#ef4444", label: "Rejected", icon: "❌" },
};

function LOICard({ loi }) {
  const [expanded, setExpanded] = useState(false);
  const status = LOI_STATUSES[loi.status || "submitted"];
  const daysAgo = Math.floor((Date.now() - new Date(loi.submitted_date).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span style={{ backgroundColor: status.color + "20", color: status.color, border: `1px solid ${status.color}40` }}
                className="text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1">
                {status.icon} {status.label}
              </span>
              <span className="text-gray-600 text-xs">{daysAgo}d ago</span>
            </div>
            <p className="text-white font-bold text-sm mb-1">{loi.invention_name}</p>
            <p className="text-gray-500 text-xs">{loi.seller_org || "Anonymous Seller"}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-yellow-400 font-black text-base">{loi.offer_amount ? `$${loi.offer_amount.toLocaleString()}` : "TBD"}</p>
            <p className="text-gray-600 text-xs">Your Offer</p>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3 mb-3 border-t border-gray-800 pt-3">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Your Message</p>
              <p className="text-gray-400 text-xs leading-relaxed">{loi.message}</p>
            </div>
            {loi.seller_response && (
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Seller Response</p>
                <p className="text-gray-300 text-xs leading-relaxed">{loi.seller_response}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-600">Category</p>
                <p className="text-white font-bold">{loi.category}</p>
              </div>
              <div>
                <p className="text-gray-600">IP Valuation</p>
                <p className="text-white font-bold">${loi.ip_valuation?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 flex-wrap">
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-bold transition-all">
            <Eye size={11} /> {expanded ? "Less" : "Details"}
          </button>
          {loi.status === "negotiating" && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold transition-all ml-auto">
              <MessageSquare size={11} /> Respond
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ investment }) {
  const gainLoss = investment.current_value - investment.invested_amount;
  const gainLossPercent = ((gainLoss / investment.invested_amount) * 100).toFixed(1);
  const isPositive = gainLoss >= 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-white font-bold text-sm mb-1">{investment.invention_name}</p>
          <p className="text-gray-500 text-xs">{investment.status} · {investment.ownership_percent}% ownership</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded font-bold ${isPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
          {isPositive ? "+" : ""}{gainLossPercent}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-gray-600">Invested</p>
          <p className="text-white font-bold">${investment.invested_amount?.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-gray-600">Current Value</p>
          <p className="text-white font-bold">${investment.current_value?.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-gray-600">Gain/Loss</p>
          <p className={`font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
            ${Math.abs(gainLoss).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InvestorPortal() {
  const [loiSubmissions, setLoiSubmissions] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loiFilter, setLoiFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Load LOI submissions (using InvestorRelationship as proxy for tracking)
        const lois = await base44.entities.InvestorRelationship.filter({}, "-created_date", 20);
        setLoiSubmissions(lois || []);

        // Load portfolio (create sample data structure)
        setPortfolio([
          {
            id: "inv1",
            invention_name: "Project HELIX",
            status: "Active",
            invested_amount: 850000,
            current_value: 950000,
            ownership_percent: 12,
            category: "Bioelectromagnetics",
          },
          {
            id: "inv2",
            invention_name: "Project AXIOM",
            status: "Active",
            invested_amount: 2500000,
            current_value: 2850000,
            ownership_percent: 8,
            category: "Vacuum Energy",
          },
        ]);
      } catch (error) {
        console.error("Error loading investor data:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredLois = loiFilter === "all" 
    ? loiSubmissions 
    : loiSubmissions.filter(l => l.status === loiFilter);

  const totalInvested = portfolio.reduce((s, p) => s + p.invested_amount, 0);
  const totalValue = portfolio.reduce((s, p) => s + p.current_value, 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/ip-marketplace" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
              <ArrowLeft size={14} /> Back
            </Link>
            <div className="w-px h-6 bg-gray-700" />
            <div>
              <h1 className="text-white font-black text-lg flex items-center gap-2">
                <Briefcase size={20} /> Investor Portal
              </h1>
              <p className="text-gray-500 text-xs">Track LOIs, negotiations, and your IP investment portfolio</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Total Invested</p>
            <p className="text-white font-black text-2xl">${(totalInvested / 1000000).toFixed(1)}M</p>
            <p className="text-gray-600 text-xs mt-1">across {portfolio.length} companies</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Current Value</p>
            <p className="text-white font-black text-2xl">${(totalValue / 1000000).toFixed(1)}M</p>
            <p className="text-gray-600 text-xs mt-1">portfolio valuation</p>
          </div>
          <div className={`rounded-xl p-5 border ${totalGain >= 0 ? "bg-green-950/30 border-green-900/40" : "bg-red-950/30 border-red-900/40"}`}>
            <p className={`text-xs uppercase font-bold mb-1 ${totalGain >= 0 ? "text-green-400" : "text-red-400"}`}>Gain / Loss</p>
            <p className={`font-black text-2xl ${totalGain >= 0 ? "text-green-400" : "text-red-400"}`}>
              {totalGain >= 0 ? "+" : "-"}${Math.abs(totalGain / 1000000).toFixed(1)}M
            </p>
            <p className={`text-xs mt-1 ${totalGain >= 0 ? "text-green-600" : "text-red-600"}`}>{totalGainPercent}% return</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Active LOIs</p>
            <p className="text-white font-black text-2xl">{loiSubmissions.length}</p>
            <p className="text-gray-600 text-xs mt-1">pending & negotiating</p>
          </div>
        </div>

        {/* LOI Submissions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-black text-xl flex items-center gap-2">
              <FileCheck size={20} /> LOI Submissions
            </h2>
            <select value={loiFilter} onChange={(e) => setLoiFilter(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500">
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="interested">Interested</option>
              <option value="negotiating">Negotiating</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {filteredLois.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <FileCheck size={40} className="text-gray-800 mx-auto mb-3" />
              <p className="text-gray-600 font-bold">No LOI submissions yet</p>
              <p className="text-gray-700 text-sm">Submit letters of intent from the IP Marketplace to track them here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLois.map(loi => (
                <LOICard key={loi.id} loi={loi} />
              ))}
            </div>
          )}
        </div>

        {/* Investment Portfolio */}
        <div>
          <h2 className="text-white font-black text-xl flex items-center gap-2 mb-4">
            <TrendingUp size={20} /> Active Investments
          </h2>
          {portfolio.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <DollarSign size={40} className="text-gray-800 mx-auto mb-3" />
              <p className="text-gray-600 font-bold">No active investments</p>
              <p className="text-gray-700 text-sm">Completed LOI negotiations will appear here as active investments.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.map(inv => (
                <PortfolioCard key={inv.id} investment={inv} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-white font-black text-xl flex items-center gap-2 mb-4">
            <Clock size={20} /> Recent Updates
          </h2>
          <div className="space-y-3">
            {[
              { title: "Project AXIOM", action: "Seller responded to your LOI", time: "2 hours ago", type: "message" },
              { title: "Project HELIX", action: "Deal closed — shares transferred", time: "1 day ago", type: "completed" },
              { title: "Project CIPHER", action: "Your offer accepted — moving to negotiation", time: "3 days ago", type: "interested" },
            ].map((activity, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" 
                  style={{
                    backgroundColor: activity.type === "completed" ? "#22c55e" : activity.type === "message" ? "#3b82f6" : "#f59e0b"
                  }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{activity.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.action}</p>
                </div>
                <span className="text-gray-600 text-xs flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}