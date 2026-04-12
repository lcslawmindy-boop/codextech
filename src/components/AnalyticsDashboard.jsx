import React, { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from "recharts";
import { TrendingUp, Users, Target, Calendar, Award, Zap } from "lucide-react";

const GOAL = 1000;
const START_DATE = new Date("2026-04-12");
const PHASE_COLORS = { 1: "#f59e0b", 2: "#6366f1", 3: "#22c55e", 4: "#ec4899" };

function getPhase(week) {
  if (week <= 2) return 1;
  if (week <= 6) return 2;
  if (week <= 10) return 3;
  return 4;
}

function weekToDate(week) {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() + (week - 1) * 7);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsDashboard({ logs = [] }) {
  const stats = useMemo(() => {
    // Aggregate by week
    const byWeek = {};
    logs.forEach(log => {
      const w = log.week || 1;
      if (!byWeek[w]) byWeek[w] = { week: w, members: 0, posts: 0, platforms: {} };
      byWeek[w].members += log.new_members || 0;
      byWeek[w].posts += 1;
      byWeek[w].platforms[log.platform] = (byWeek[w].platforms[log.platform] || 0) + (log.new_members || 0);
    });

    // Build cumulative growth series for all 16 weeks
    let cumulative = 0;
    const growthData = [];
    for (let w = 1; w <= 16; w++) {
      const weekData = byWeek[w] || { members: 0, posts: 0 };
      cumulative += weekData.members;
      const phase = getPhase(w);
      const targets = { 1: 100, 2: 200, 3: 450, 4: 1000 };
      // Target is cumulative
      const cumulTargets = [0, 100, 200, 450, 1000];
      const weekTarget = Math.round(cumulTargets[phase - 1] + (cumulTargets[phase] - cumulTargets[phase - 1]) * (
        w <= 2 ? (w / 2) : w <= 6 ? ((w - 2) / 4) : w <= 10 ? ((w - 6) / 4) : ((w - 10) / 6)
      ));
      growthData.push({
        label: `Wk ${w}`,
        date: weekToDate(w),
        actual: cumulative > 0 ? cumulative : null,
        target: weekTarget,
        newMembers: weekData.members,
        posts: weekData.posts,
        phase,
      });
    }

    // Platform performance
    const platformTotals = {};
    const platformPosts = {};
    logs.forEach(log => {
      platformTotals[log.platform] = (platformTotals[log.platform] || 0) + (log.new_members || 0);
      platformPosts[log.platform] = (platformPosts[log.platform] || 0) + 1;
    });
    const platformData = Object.keys(platformTotals)
      .map(p => ({
        platform: p.replace("/X", "").substring(0, 9),
        fullName: p,
        members: platformTotals[p],
        posts: platformPosts[p],
        convRate: platformPosts[p] > 0 ? (platformTotals[p] / platformPosts[p]).toFixed(1) : "0",
      }))
      .sort((a, b) => b.members - a.members);

    // Projection
    const totalMembers = cumulative;
    const weeksWithData = Object.keys(byWeek).length;
    const avgPerWeek = weeksWithData > 0 ? totalMembers / weeksWithData : 0;
    const weeksToGoal = avgPerWeek > 0 ? Math.ceil((GOAL - totalMembers) / avgPerWeek) : null;
    let projectedDate = null;
    if (weeksToGoal !== null) {
      const d = new Date();
      d.setDate(d.getDate() + weeksToGoal * 7);
      projectedDate = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }
    const onTrack = weeksToGoal !== null && weeksToGoal <= 16;

    return { growthData, platformData, totalMembers, avgPerWeek, projectedDate, onTrack, weeksToGoal };
  }, [logs]);

  const topPlatform = stats.platformData[0];

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users size={13} className="text-blue-400" />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Total Members</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.totalMembers}</p>
          <p className="text-gray-600 text-xs mt-0.5">of {GOAL} goal · {((stats.totalMembers / GOAL) * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={13} className="text-yellow-400" />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Avg / Week</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.avgPerWeek.toFixed(1)}</p>
          <p className="text-gray-600 text-xs mt-0.5">members per active week</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={13} className="text-purple-400" />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Projected Date</span>
          </div>
          <p className={`text-sm font-black ${stats.onTrack ? "text-green-400" : stats.projectedDate ? "text-red-400" : "text-gray-500"}`}>
            {stats.projectedDate || "No data yet"}
          </p>
          <p className={`text-xs mt-0.5 ${stats.onTrack ? "text-green-600" : "text-red-600"}`}>
            {stats.projectedDate ? (stats.onTrack ? "✅ On track" : `⚠️ ${stats.weeksToGoal}+ weeks out`) : "Log activity to project"}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Award size={13} className="text-pink-400" />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Top Platform</span>
          </div>
          <p className="text-sm font-black text-white">{topPlatform?.fullName || "—"}</p>
          <p className="text-gray-600 text-xs mt-0.5">{topPlatform ? `${topPlatform.members} members · ${topPlatform.convRate}/post` : "No data yet"}</p>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} className="text-blue-400" />
          <h3 className="text-white font-bold text-sm">Member Growth vs Target — 16 Weeks</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={stats.growthData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 10 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} domain={[0, 1000]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
            <ReferenceLine y={1000} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "GOAL", fill: "#f59e0b", fontSize: 10 }} />
            <Area type="monotone" dataKey="target" name="Target" stroke="#4b5563" strokeDasharray="4 4" fill="url(#targetGrad)" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="actual" name="Actual" stroke="#3b82f6" fill="url(#actualGrad)" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Performance */}
      {stats.platformData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Award size={14} className="text-pink-400" /> Members by Platform
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.platformData} margin={{ top: 0, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="platform" tick={{ fill: "#6b7280", fontSize: 10 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="members" name="Members" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <Target size={14} className="text-green-400" /> Conversion Rate (Members / Post)
            </h3>
            <div className="space-y-2">
              {stats.platformData.map((p, i) => {
                const rate = parseFloat(p.convRate);
                const maxRate = parseFloat(stats.platformData[0]?.convRate || 1);
                const pct = maxRate > 0 ? (rate / maxRate) * 100 : 0;
                const colors = ["#ec4899", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#06b6d4"];
                const color = colors[i % colors.length];
                return (
                  <div key={p.platform}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-gray-300 font-semibold">{p.fullName}</span>
                      <span className="font-bold" style={{ color }}>{p.convRate} mem/post</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-gray-600 text-xs mt-4 pt-3 border-t border-gray-800">Based on {logs.length} logged activities</p>
          </div>
        </div>
      )}

      {/* Weekly new members bar */}
      {stats.growthData.some(d => d.newMembers > 0) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Users size={14} className="text-yellow-400" /> New Members per Week
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stats.growthData} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="newMembers" name="New Members" radius={[3, 3, 0, 0]}>
                {stats.growthData.map((entry, i) => (
                  <rect key={i} fill={PHASE_COLORS[entry.phase]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-2 flex-wrap">
            {[1,2,3,4].map(p => (
              <div key={p} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PHASE_COLORS[p] }} />
                Phase {p}
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <div className="text-5xl mb-3">📊</div>
          <p className="font-bold text-gray-400 mb-1">No data yet</p>
          <p className="text-sm">Log activity using the "Log Activity" button to see analytics.</p>
        </div>
      )}
    </div>
  );
}