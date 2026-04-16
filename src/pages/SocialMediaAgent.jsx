import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Users, TrendingUp, Calendar, Zap, BarChart2, Plus, X } from "lucide-react";
import GrowthCalendar from "../components/GrowthCalendar";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import LinkedInProspectList from "../components/LinkedInProspectList";
import { base44 } from "@/api/base44Client";
import MessageBubble from "../components/MessageBubble";

const PHASES = [
  { num: 1, label: "Warm Network", weeks: "1–2", target: 100, color: "#f59e0b" },
  { num: 2, label: "Content Engine", weeks: "3–6", target: 300, color: "#6366f1" },
  { num: 3, label: "Paid + Partners", weeks: "7–10", target: 400, color: "#22c55e" },
  { num: 4, label: "Urgency + Referral", weeks: "11–16", target: 200, color: "#ec4899" },
];

const QUICK_PROMPTS = [
  { label: "📅 Plan this week", prompt: "Give me a complete daily posting plan for this week — which platforms, what hooks, and the exact CTAs to use." },
  { label: "🐦 Write a Twitter thread", prompt: "Write a complete 10-tweet thread on the ONR-validated electromagnetic cancer cure (Priore device, 1978). Include specific documented evidence and a CTA." },
  { label: "💼 Write LinkedIn post", prompt: "Write a LinkedIn post targeting defense contractors and biotech investors about the $11.5M Bearden IP portfolio opportunity." },
  { label: "🎵 TikTok script", prompt: "Write a 60-second TikTok/Reel script on 'The Soviet weapon that may have caused Gulf War Syndrome' with scene-by-scene [VISUAL] directions." },
  { label: "📧 Email outreach sequence", prompt: "Write a 3-email outreach sequence for warm contacts introducing Zenith Apex and driving them to the beta apply page." },
  { label: "🟠 Reddit strategy", prompt: "Tell me the best Reddit communities to target and write 2 value-first posts I can use this week (no overt marketing)." },
  { label: "📊 Review my progress", prompt: "Review my growth log and tell me where I am in the 16-week plan, what I should focus on now, and what's working." },
  { label: "🎙️ Webinar script", prompt: "Write an outline and opening 5-minute script for a free webinar: 'The Physics That Could Change Energy Forever' — targeting the conversion CTA at the end." },
];

function PhaseCard({ phase, currentMembers }) {
  const cumulative = PHASES.slice(0, phase.num).reduce((s, p) => s + p.target, 0);
  const prevCumulative = PHASES.slice(0, phase.num - 1).reduce((s, p) => s + p.target, 0);
  const isActive = currentMembers >= prevCumulative && currentMembers < cumulative;
  const isDone = currentMembers >= cumulative;

  return (
    <div className={`rounded-xl border p-3 transition-all ${isActive ? "border-opacity-100 bg-opacity-10" : isDone ? "opacity-70" : "border-gray-800 opacity-50"}`}
      style={isActive ? { borderColor: phase.color, backgroundColor: phase.color + "12" } : {}}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold" style={{ color: phase.color }}>Phase {phase.num}</span>
        {isActive && <span className="text-xs px-1.5 py-0.5 rounded font-bold animate-pulse" style={{ backgroundColor: phase.color + "25", color: phase.color }}>ACTIVE</span>}
        {isDone && <span className="text-xs text-green-400 font-bold">✓ Done</span>}
      </div>
      <p className="text-white text-xs font-semibold leading-tight">{phase.label}</p>
      <p className="text-gray-500 text-xs">Wk {phase.weeks} · +{phase.target} members</p>
    </div>
  );
}

export default function SocialMediaAgent() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [logs, setLogs] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm] = useState({ platform: "Twitter/X", action_type: "Post Published", content_summary: "", new_members: 0 });
  const bottomRef = useRef(null);

  const totalMembers = logs.reduce((s, l) => s + (l.new_members || 0), 0);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const init = async () => {
    setLoading(true);
    const [convs, growthLogs] = await Promise.all([
      base44.agents.listConversations({ agent_name: "social_media_agent" }),
      base44.entities.MemberGrowthLog.list("-created_date", 50),
    ]);
    setLogs(growthLogs);

    let conv;
    if (convs.length > 0) {
      conv = await base44.agents.getConversation(convs[0].id);
    } else {
      conv = await base44.agents.createConversation({
        agent_name: "social_media_agent",
        metadata: { name: "16-Week Growth Campaign" },
      });
    }
    setConversation(conv);
    setMessages(conv.messages || []);
    setLoading(false);

    base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
    });
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || !conversation) return;
    setInput("");
    setSending(true);
    await base44.agents.addMessage(conversation, { role: "user", content: msg });
    setSending(false);
  };

  const logActivity = async () => {
    const week = Math.ceil((new Date() - new Date("2026-04-12")) / (7 * 24 * 60 * 60 * 1000)) + 1;
    const phase = week <= 2 ? "Phase 1 — Warm Network" : week <= 6 ? "Phase 2 — Content Engine" : week <= 10 ? "Phase 3 — Paid + Partners" : "Phase 4 — Urgency + Referral";
    await base44.entities.MemberGrowthLog.create({ ...logForm, week: Math.max(1, week), phase, date: new Date().toISOString().split("T")[0], status: "completed" });
    const updated = await base44.entities.MemberGrowthLog.list("-created_date", 50);
    setLogs(updated);
    setShowLogForm(false);
    setLogForm({ platform: "Twitter/X", action_type: "Post Published", content_summary: "", new_members: 0 });
  };

  const memberPct = Math.min(100, (totalMembers / 1000) * 100);

  return (
    <div className="w-screen h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0 bg-gray-900/80">
        <div className="flex items-center gap-3">
          <Link to="/social-command" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base">🤖 Social Media Growth Agent</h1>
            <p className="text-gray-500 text-xs">16-week plan · 1,000 founding members</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-800 border border-gray-700 rounded-lg p-0.5">
            <button onClick={() => setActiveTab("chat")} className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${activeTab === "chat" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>💬 Chat</button>
            <button onClick={() => setActiveTab("calendar")} className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${activeTab === "calendar" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>📅 Calendar</button>
            <button onClick={() => setActiveTab("analytics")} className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${activeTab === "analytics" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>📊 Analytics</button>
            <button onClick={() => setActiveTab("linkedin")} className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${activeTab === "linkedin" ? "bg-blue-700 text-white" : "text-gray-400 hover:text-gray-200"}`}>💼 LinkedIn</button>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full bg-rose-900/40 border border-rose-700 text-rose-300 font-bold animate-pulse">
            ● LIVE: {totalMembers} / 1,000 members
          </span>
          <button onClick={() => setShowLogForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-700 text-green-300 text-xs font-bold hover:bg-green-800/40 transition-colors">
            <Plus size={12} /> Log Activity
          </button>
        </div>
      </div>

      {activeTab === "calendar" ? (
        <div className="flex-1 overflow-hidden">
          <GrowthCalendar logs={logs} />
        </div>
      ) : activeTab === "analytics" ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnalyticsDashboard logs={logs} />
        </div>
      ) : activeTab === "linkedin" ? (
        <div className="flex-1 overflow-y-auto">
          <LinkedInProspectList />
        </div>
      ) : (
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-gray-800 flex flex-col overflow-y-auto bg-gray-900/40">
          {/* Progress */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Member Goal</span>
              <Users size={13} className="text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white mb-1">{totalMembers.toLocaleString()} <span className="text-gray-600 text-base">/ 1,000</span></p>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full transition-all" style={{ width: `${memberPct}%` }} />
            </div>
            <p className="text-gray-600 text-xs">{(1000 - totalMembers)} remaining · {memberPct.toFixed(1)}% complete</p>
          </div>

          {/* Phases */}
          <div className="p-4 border-b border-gray-800">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">16-Week Phases</p>
            <div className="space-y-2">
              {PHASES.map(p => <PhaseCard key={p.num} phase={p} currentMembers={totalMembers} />)}
            </div>
          </div>

          {/* Quick prompts */}
          <div className="p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="space-y-1.5">
              {QUICK_PROMPTS.map((q, i) => (
                <button key={i} onClick={() => send(q.prompt)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 text-xs transition-all">
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recent logs */}
          {logs.length > 0 && (
            <div className="p-4 border-t border-gray-800">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"><BarChart2 size={11} /> Recent Activity</p>
              <div className="space-y-2">
                {logs.slice(0, 5).map((log, i) => (
                  <div key={i} className="text-xs bg-gray-800/60 rounded-lg px-2.5 py-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-gray-400 font-semibold">{log.platform}</span>
                      {log.new_members > 0 && <span className="text-green-400 font-bold">+{log.new_members}</span>}
                    </div>
                    <p className="text-gray-600 leading-tight truncate">{log.action_type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-yellow-400" />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🚀</div>
                    <h2 className="text-white font-black text-xl mb-2">Social Media Growth Agent</h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">Your AI strategist for reaching 1,000 founding members. Ask me to generate posts, plan your week, write scripts, or advise on growth strategy.</p>
                    <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                      {QUICK_PROMPTS.slice(0, 4).map((q, i) => (
                        <button key={i} onClick={() => send(q.prompt)}
                          className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs transition-all text-left">
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.filter(m => m.role !== "system").map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}
                {sending && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-7 w-7 rounded-lg bg-gray-800 flex items-center justify-center mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5">
                      <div className="flex gap-1 items-center h-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-800 p-4 bg-gray-900/60">
                <div className="flex gap-3 max-w-4xl mx-auto">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder="Ask the agent to generate posts, plan your week, write scripts, track progress..."
                    className="flex-1 bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 placeholder-gray-600"
                    disabled={sending}
                  />
                  <button onClick={() => send()} disabled={!input.trim() || sending}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-40 transition-all">
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
                <p className="text-gray-700 text-xs text-center mt-2">Agent has access to your growth log — ask it to review progress or log an activity.</p>
              </div>
            </>
          )}
        </div>
      </div>
      )}

      {/* Log Activity Modal */}
      {showLogForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">Log Activity</h3>
              <button onClick={() => setShowLogForm(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1.5 block">Platform</label>
                <select value={logForm.platform} onChange={e => setLogForm(f => ({ ...f, platform: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none">
                  {["Twitter/X", "LinkedIn", "TikTok", "YouTube", "Reddit", "Instagram", "Substack", "Email", "Discord", "Other"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1.5 block">Action Type</label>
                <select value={logForm.action_type} onChange={e => setLogForm(f => ({ ...f, action_type: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none">
                  {["Post Published", "Thread Posted", "Video Published", "Email Sent", "DM Outreach", "Ad Launched", "Partner Outreach", "Webinar", "Reddit Post", "Newsletter Swap"].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1.5 block">Content Summary</label>
                <textarea value={logForm.content_summary} onChange={e => setLogForm(f => ({ ...f, content_summary: e.target.value }))}
                  placeholder="Brief description of what was posted / done..."
                  rows={3} className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1.5 block">New Members Acquired</label>
                <input type="number" value={logForm.new_members} onChange={e => setLogForm(f => ({ ...f, new_members: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none" />
              </div>
              <button onClick={logActivity}
                className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-all">
                Log Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}