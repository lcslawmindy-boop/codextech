import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, Zap, RefreshCw, GitCompare, Presentation } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6"];

function StatCard({ icon: Icon, label, value, sub, color = "text-cyan-400" }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">{label}</p>
        <p className={`font-black text-xl ${color}`}>{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs shadow-xl">
      {label && <p className="text-gray-400 font-bold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>{p.name}: <span className="font-bold">{typeof p.value === "number" ? (p.value > 100 ? `$${p.value}M` : p.value) : p.value}</span></p>
      ))}
    </div>
  );
};

export default function InventionDashboard() {
  const [inventions, setInventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.HybridInvention.list("-created_date", 100).then(data => {
      setInventions(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <RefreshCw size={24} className="animate-spin text-cyan-400" />
    </div>
  );

  // ── Derived data ────────────────────────────────────────────────────────────
  const totalIPLow = inventions.reduce((s, i) => s + (i.ip_value_low || 0), 0);
  const totalIPHigh = inventions.reduce((s, i) => s + (i.ip_value_high || 0), 0);
  const avgScore = inventions.length ? Math.round(inventions.reduce((s, i) => s + (i.synergy_score || 0), 0) / inventions.length) : 0;
  const statusCounts = inventions.reduce((acc, i) => { acc[i.status || "draft"] = (acc[i.status || "draft"] || 0) + 1; return acc; }, {});

  // Bar chart: IP value per invention
  const ipBarData = inventions
    .filter(i => i.ip_value_low || i.ip_value_high)
    .slice(0, 10)
    .map(i => ({
      name: (i.hybrid_concept || "Unnamed").substring(0, 20),
      low: i.ip_value_low || 0,
      high: i.ip_value_high || 0,
    }));

  // Scatter: synergy score vs IP value
  const scatterData = inventions
    .filter(i => i.synergy_score && (i.ip_value_low || i.ip_value_high))
    .map(i => ({
      score: i.synergy_score,
      value: ((i.ip_value_low || 0) + (i.ip_value_high || 0)) / 2,
      name: (i.hybrid_concept || "").substring(0, 20),
    }));

  // Pie: status distribution
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Line: projected licensing revenue over 5 years (based on high IP values)
  const revenueData = [1, 2, 3, 4, 5].map(yr => ({
    year: `Year ${yr}`,
    conservative: Math.round(totalIPLow * yr * 0.04),
    optimistic: Math.round(totalIPHigh * yr * 0.08),
  }));

  // Radar: sector coverage
  const sectorMap = {};
  inventions.forEach(inv => {
    (inv.market_sectors || []).forEach(s => {
      sectorMap[s] = (sectorMap[s] || 0) + 1;
    });
  });
  const radarData = Object.entries(sectorMap).slice(0, 7).map(([sector, count]) => ({
    sector: sector.substring(0, 14),
    count,
  }));

  // Top inventions by IP value
  const topInventions = [...inventions]
    .filter(i => i.ip_value_high)
    .sort((a, b) => (b.ip_value_high || 0) - (a.ip_value_high || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/invention-dossier" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-cyan-400" />
            <div>
              <h1 className="text-white font-bold text-lg">Invention Portfolio Dashboard</h1>
              <p className="text-gray-500 text-xs">IP value distribution, synergy scores & licensing projections</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Link to="/invention-comparison" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-xs transition-colors">
              <GitCompare size={12} /> Compare
            </Link>
            <Link to="/pitch-deck-builder" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-xs transition-colors">
              <Presentation size={12} /> Pitch Deck
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {inventions.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <BarChart3 size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-bold">No inventions in your portfolio yet.</p>
            <Link to="/research-membership" className="text-cyan-400 text-sm underline mt-2 inline-block">Generate your first dossier →</Link>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={BarChart3} label="Total Inventions" value={inventions.length} sub="in portfolio" color="text-cyan-400" />
              <StatCard icon={DollarSign} label="Portfolio IP Value" value={`$${totalIPLow}M–$${totalIPHigh}M`} sub="combined range" color="text-green-400" />
              <StatCard icon={Zap} label="Avg Synergy Score" value={`${avgScore}/100`} sub="across all inventions" color="text-yellow-400" />
              <StatCard icon={TrendingUp} label="Licensing Potential" value={`$${Math.round(totalIPHigh * 0.08)}M`} sub="yr 1 optimistic" color="text-purple-400" />
            </div>

            {/* IP Value Bar Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-black text-lg mb-1">IP Value Distribution</h2>
              <p className="text-gray-500 text-xs mb-6">Low and high IP valuations per invention ($M)</p>
              {ipBarData.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-8">No valuation data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ipBarData} margin={{ top: 0, right: 0, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={v => `$${v}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="low" name="IP Value Low" fill="#0891b2" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="high" name="IP Value High" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Synergy Scatter + Status Pie */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-black text-lg mb-1">Synergy Score vs IP Value</h2>
                <p className="text-gray-500 text-xs mb-6">Higher score + value = strongest commercialization candidates</p>
                {scatterData.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-8">Insufficient data.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="score" name="Synergy Score" type="number" domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 10 }} label={{ value: "Synergy Score", position: "bottom", fill: "#6b7280", fontSize: 10 }} />
                      <YAxis dataKey="value" name="IP Value" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={v => `$${v}M`} />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
                      <Scatter name="Inventions" data={scatterData} fill="#8b5cf6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-black text-lg mb-1">Portfolio Status</h2>
                <p className="text-gray-500 text-xs mb-6">Distribution by filing/development stage</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {pieData.map((entry, i) => (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="text-gray-300 text-xs capitalize">{entry.name}</span>
                        </div>
                        <span className="text-white font-bold text-xs">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Projected Licensing Revenue */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-black text-lg mb-1">Projected Licensing Revenue</h2>
              <p className="text-gray-500 text-xs mb-6">5-year projections at 4% (conservative) and 8% (optimistic) annual licensing rate on portfolio IP value</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={v => `$${v}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                  <Line type="monotone" dataKey="conservative" name="Conservative" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4 }} />
                  <Line type="monotone" dataKey="optimistic" name="Optimistic" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 4 }} strokeDasharray="6 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Radar + Top Inventions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {radarData.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-white font-black text-lg mb-1">Market Sector Coverage</h2>
                  <p className="text-gray-500 text-xs mb-4">Number of inventions targeting each sector</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#1f2937" />
                      <PolarAngleAxis dataKey="sector" tick={{ fill: "#9ca3af", fontSize: 9 }} />
                      <Radar name="Inventions" dataKey="count" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-black text-lg mb-4">Top Inventions by IP Value</h2>
                {topInventions.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-8">No valuation data available.</p>
                ) : (
                  <div className="space-y-3">
                    {topInventions.map((inv, i) => {
                      const maxVal = topInventions[0].ip_value_high || 1;
                      const pct = ((inv.ip_value_high || 0) / maxVal * 100).toFixed(0);
                      return (
                        <div key={inv.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-300 text-xs font-medium truncate max-w-48">{i + 1}. {inv.hybrid_concept || "Unnamed"}</span>
                            <span className="text-green-400 text-xs font-bold flex-shrink-0 ml-2">${inv.ip_value_low}M–${inv.ip_value_high}M</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}