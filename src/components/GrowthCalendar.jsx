import React, { useState } from "react";
import { Calendar, Users, Zap, Mic, Target, Star } from "lucide-react";

// 16-week plan data
const WEEKS = [
  { week: 1, phase: 1, phaseColor: "#f59e0b", theme: "The Suppressed Physics Hook", platform: "Twitter/X + Email", target: 30, posts: ["10-tweet thread: Maxwell's 4 vectors", "Email blast to warm contacts"], milestones: [] },
  { week: 2, phase: 1, phaseColor: "#f59e0b", theme: "Warm Network DM Blitz", platform: "LinkedIn + DM", target: 70, posts: ["LinkedIn connection requests (100/day)", "Personal DMs to researchers/investors", "Reddit value post in r/AlternativeEnergy"], milestones: ["First 100 members target"] },
  { week: 3, phase: 2, phaseColor: "#6366f1", theme: "The Cancer Cure They Buried", platform: "Twitter/X + Reddit", target: 100, posts: ["Thread: ONR Priore validation 1978", "Reddit: r/longevity evidence post", "LinkedIn article: EM medicine investment"], milestones: [] },
  { week: 4, phase: 2, phaseColor: "#6366f1", theme: "Free Energy Is Real (Peer-Reviewed Proof)", platform: "YouTube + Twitter", target: 130, posts: ["YouTube: 'What Bearden Actually Discovered'", "Twitter thread: MEG peer-review facts", "Instagram: infographic MEG device"], milestones: ["YouTube channel launch"] },
  { week: 5, phase: 2, phaseColor: "#6366f1", theme: "Your Body Runs on Spacetime", platform: "Substack + TikTok", target: 160, posts: ["Substack essay: MCCS & telomere science", "TikTok: '5 things mainstream physics got wrong'", "Email newsletter to list"], milestones: ["Substack launch"] },
  { week: 6, phase: 2, phaseColor: "#6366f1", theme: "The Soviet Weapon Nobody Talks About", platform: "YouTube + Reddit", target: 200, posts: ["YouTube: QP weapons documentary", "Reddit: r/conspiracy evidence post", "Twitter: Woodpecker grid thread"], milestones: ["200 members milestone"] },
  { week: 7, phase: 3, phaseColor: "#22c55e", theme: "Paid Ads Launch + Affiliate Outreach", platform: "Reddit Ads + LinkedIn", target: 250, posts: ["Reddit Ads: $500 campaign live", "LinkedIn: 5 outreach messages to YouTubers", "Substack: weekly deep-dive"], milestones: ["First paid campaign live"] },
  { week: 8, phase: 3, phaseColor: "#22c55e", theme: "Build the Device — Maker Community", platform: "YouTube + Reddit", target: 310, posts: ["YouTube: MEG build walkthrough", "Reddit: r/DIYelectronics post", "Twitter: MEG replication challenge"], milestones: [] },
  { week: 9, phase: 3, phaseColor: "#22c55e", theme: "The $11.5M IP Portfolio", platform: "LinkedIn + Email", target: 380, posts: ["LinkedIn article: scalar EM IP valuation", "Email: investor intro sequence (3-part)", "Substack: patent landscape deep-dive"], milestones: ["Newsletter swap #1"] },
  { week: 10, phase: 3, phaseColor: "#22c55e", theme: "Partner Blitz + Newsletter Swaps", platform: "Multiple", target: 450, posts: ["5 newsletter swap placements live", "2 affiliate partners onboarded", "Podcast outreach: 10 shows pitched"], milestones: ["400 members milestone", "Newsletter swap #2"] },
  { week: 11, phase: 4, phaseColor: "#ec4899", theme: "The 10 Hz Signal Locking Your Brain", platform: "TikTok + Twitter", target: 540, posts: ["TikTok: ELF entrainment viral hook", "Twitter: Pentagon EMI studies thread", "Reddit: r/conspiracy crossover post"], milestones: ["Referral program launches"] },
  { week: 12, phase: 4, phaseColor: "#ec4899", theme: "Anti-Gravity Is Not Sci-Fi", platform: "YouTube + Substack", target: 630, posts: ["YouTube: gravitational impairment science", "Substack: Brush kinetic theory deep-dive", "LinkedIn: defense tech angle post"], milestones: [] },
  { week: 13, phase: 4, phaseColor: "#ec4899", theme: "Live Webinar: The Physics That Changes Energy", platform: "Webinar + Email", target: 730, posts: ["Webinar promotional emails (3-part sequence)", "Twitter countdown campaign", "LinkedIn event posting"], milestones: ["LIVE WEBINAR 🎙️"] },
  { week: 14, phase: 4, phaseColor: "#ec4899", theme: "Founding Member Deadline Warning", platform: "Email + All", target: 820, posts: ["Email: '7 days left for founding pricing'", "All platforms: urgency countdown posts", "Referral push: 1 month free offer"], milestones: ["Deadline warning campaign"] },
  { week: 15, phase: 4, phaseColor: "#ec4899", theme: "Final Push — 48-Hour Close", platform: "Email + Twitter", target: 930, posts: ["Email: 48-hour warning", "Twitter: final thread with member count", "Instagram: countdown story"], milestones: ["48-hour urgency window"] },
  { week: 16, phase: 4, phaseColor: "#ec4899", theme: "Founding 1000 Close 🎉", platform: "All Platforms", target: 1000, posts: ["CLOSE: 'Founding cohort full' announcement", "Email: Welcome to all 1000 members", "Twitter: celebration + social proof thread"], milestones: ["🏆 1,000 MEMBERS GOAL"] },
];

const PHASE_LABELS = {
  1: "Phase 1 — Warm Network",
  2: "Phase 2 — Content Engine",
  3: "Phase 3 — Paid + Partners",
  4: "Phase 4 — Urgency + Referral",
};

const PHASE_COLORS = {
  1: "#f59e0b",
  2: "#6366f1",
  3: "#22c55e",
  4: "#ec4899",
};

// Start date: April 12, 2026
const START_DATE = new Date("2026-04-12");

function getWeekDates(weekNum) {
  const start = new Date(START_DATE);
  start.setDate(start.getDate() + (weekNum - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getCurrentWeek() {
  const now = new Date();
  const diff = Math.floor((now - START_DATE) / (7 * 24 * 60 * 60 * 1000));
  return Math.min(16, Math.max(1, diff + 1));
}

export default function GrowthCalendar({ logs = [] }) {
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const currentWeek = getCurrentWeek();

  // Compute total members per week from logs
  const membersByWeek = {};
  logs.forEach(log => {
    const w = log.week;
    membersByWeek[w] = (membersByWeek[w] || 0) + (log.new_members || 0);
  });

  const totalSoFar = Object.values(membersByWeek).reduce((a, b) => a + b, 0);
  const selected = WEEKS[selectedWeek - 1];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Stats bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-800 bg-gray-900/60 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <Users size={13} className="text-yellow-400" />
          <span className="text-white font-bold text-sm">{totalSoFar} <span className="text-gray-500 font-normal">/ 1,000 members</span></span>
        </div>
        <div className="w-32 bg-gray-800 rounded-full h-1.5">
          <div className="bg-yellow-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, (totalSoFar / 1000) * 100)}%` }} />
        </div>
        <div className="flex items-center gap-2 ml-auto flex-wrap gap-y-1">
          {[1,2,3,4].map(p => (
            <span key={p} className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: PHASE_COLORS[p] + "20", color: PHASE_COLORS[p], border: `1px solid ${PHASE_COLORS[p]}40` }}>
              {PHASE_LABELS[p].split(" — ")[0]}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Week grid */}
        <div className="w-56 flex-shrink-0 border-r border-gray-800 overflow-y-auto bg-gray-900/30 p-3">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">16 Weeks</p>
          <div className="space-y-1">
            {WEEKS.map(w => {
              const isNow = w.week === currentWeek;
              const isPast = w.week < currentWeek;
              const isSelected = w.week === selectedWeek;
              const weekMembers = membersByWeek[w.week] || 0;
              return (
                <button key={w.week} onClick={() => setSelectedWeek(w.week)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all border ${
                    isSelected ? "border-opacity-100" : "border-transparent hover:bg-gray-800/60"
                  } ${isPast && !isSelected ? "opacity-60" : ""}`}
                  style={isSelected ? { borderColor: w.phaseColor, backgroundColor: w.phaseColor + "12" } : {}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold" style={{ color: w.phaseColor }}>Wk {w.week}</span>
                      {isNow && <span className="text-xs px-1 rounded font-bold bg-yellow-900/60 text-yellow-400 border border-yellow-700">NOW</span>}
                    </div>
                    {weekMembers > 0 && <span className="text-xs text-green-400 font-bold">+{weekMembers}</span>}
                  </div>
                  <p className="text-gray-400 text-xs leading-tight mt-0.5 truncate">{w.theme}</p>
                  {w.milestones.length > 0 && <span className="text-xs">🏆</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Week detail */}
        <div className="flex-1 overflow-y-auto p-5">
          {selected && (
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: selected.phaseColor + "20", color: selected.phaseColor }}>
                      {PHASE_LABELS[selected.phase]}
                    </span>
                    {selected.week === currentWeek && (
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-900/40 border border-yellow-700 text-yellow-400 font-bold animate-pulse">CURRENT WEEK</span>
                    )}
                  </div>
                  <h2 className="text-white font-black text-xl leading-tight">Week {selected.week}: {selected.theme}</h2>
                  <p className="text-gray-500 text-xs mt-1">
                    <Calendar size={11} className="inline mr-1" />{getWeekDates(selected.week)}
                    <span className="mx-2">·</span>
                    <span className="font-semibold text-gray-400">{selected.platform}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-gray-500 text-xs mb-0.5">Cumulative target</p>
                  <p className="text-2xl font-black" style={{ color: selected.phaseColor }}>{selected.target.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs">members by end of week</p>
                </div>
              </div>

              {/* Milestones */}
              {selected.milestones.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Star size={11} className="text-yellow-400" /> Milestones This Week
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.milestones.map((m, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-bold text-sm ${
                        m.includes("🏆") || m.includes("WEBINAR") || m.includes("MEMBERS GOAL")
                          ? "border-yellow-600 bg-yellow-900/30 text-yellow-300"
                          : "border-gray-700 bg-gray-800/60 text-gray-300"
                      }`}>
                        {m.includes("WEBINAR") ? <Mic size={13} className="text-pink-400" /> : <Target size={13} />}
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scheduled Posts */}
              <div className="mb-5">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Zap size={11} /> Scheduled Posts & Actions
                </h3>
                <div className="space-y-2">
                  {selected.posts.map((post, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: selected.phaseColor }}>
                        {i + 1}
                      </div>
                      <p className="text-gray-300 text-sm leading-snug">{post}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress bar for this week */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs font-semibold">Progress toward week {selected.week} target</span>
                  <span className="text-xs font-bold" style={{ color: selected.phaseColor }}>
                    {totalSoFar} / {selected.target} members
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full transition-all" style={{
                    width: `${Math.min(100, (totalSoFar / selected.target) * 100)}%`,
                    backgroundColor: selected.phaseColor
                  }} />
                </div>
                <p className="text-gray-600 text-xs mt-2">
                  {totalSoFar >= selected.target
                    ? "✅ Target reached!"
                    : `Need ${selected.target - totalSoFar} more members to hit this week's cumulative target`}
                </p>
              </div>

              {/* Phase overview strip */}
              <div className="mt-5 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">16-Week Timeline Overview</p>
                <div className="flex gap-1 h-8">
                  {WEEKS.map(w => (
                    <button key={w.week}
                      onClick={() => setSelectedWeek(w.week)}
                      title={`Week ${w.week}: ${w.theme}`}
                      className="flex-1 rounded transition-all hover:opacity-90"
                      style={{
                        backgroundColor: w.phaseColor + (w.week === selectedWeek ? "cc" : w.week < currentWeek ? "55" : "33"),
                        outline: w.week === selectedWeek ? `2px solid ${w.phaseColor}` : "none",
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Wk 1</span><span>Wk 4</span><span>Wk 8</span><span>Wk 12</span><span>Wk 16</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}