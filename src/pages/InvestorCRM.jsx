import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Bell, StickyNote, ChevronDown, ChevronRight,
  Mail, ExternalLink, Plus, Trash2, Clock, AlertCircle,
  LayoutGrid, List, MessageSquare, Send
} from "lucide-react";
import { BUYERS, STAGES } from "../lib/buyerData";

const STORAGE_KEY = "zenith_investor_crm_v2";

function loadCRM() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}

function saveCRM(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function getStage(id) { return STAGES.find(s => s.id === id) || STAGES[0]; }

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── REMINDER BADGE ────────────────────────────────────────────────────────────
function ReminderBadge({ dateStr }) {
  if (!dateStr) return null;
  const days = getDaysUntil(dateStr);
  if (days === null) return null;
  const overdue = days < 0, soon = days <= 2;
  return (
    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
      overdue ? "bg-red-900/50 text-red-400" : soon ? "bg-yellow-900/50 text-yellow-400" : "bg-gray-800 text-gray-400"
    }`}>
      {overdue ? <AlertCircle size={10} /> : <Clock size={10} />}
      {overdue ? `${Math.abs(days)}d overdue` : days === 0 ? "Today" : `${days}d`}
    </span>
  );
}

// ── COMMUNICATION LOG ITEM ────────────────────────────────────────────────────
function CommItem({ item, onDelete }) {
  const typeColors = { "Email Sent": "#3b82f6", "Note": "#a855f7", "Call": "#22c55e", "Meeting": "#f59e0b", "Other": "#6b7280" };
  const color = typeColors[item.type] || typeColors.Other;
  return (
    <div className="flex items-start gap-2 group">
      <div className="flex-1 bg-gray-800/60 rounded-lg px-3 py-2 border-l-2" style={{ borderColor: color }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold" style={{ color }}>{item.type}</span>
          <span className="text-gray-600 text-xs">{fmtDate(item.createdAt)}</span>
        </div>
        <p className="text-gray-300 text-xs leading-relaxed">{item.text}</p>
      </div>
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 mt-1 text-gray-700 hover:text-red-500 transition-all">
        <Trash2 size={12} />
      </button>
    </div>
  );
}

// ── BUYER DETAIL PANEL ────────────────────────────────────────────────────────
function BuyerDetail({ buyer, tierColor, crm, onChange, compact = false }) {
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("Note");
  const id = buyer.org;
  const record = crm[id] || { stage: "not_contacted", comms: [], reminder: "" };

  const update = (patch) => { const u = { ...crm, [id]: { ...record, ...patch } }; onChange(u); };

  const addComm = (type, text) => {
    if (!text.trim()) return;
    update({ comms: [...(record.comms || []), { id: Date.now(), type, text: text.trim(), createdAt: new Date().toISOString() }] });
    setNewNote("");
  };

  const handleEmailClick = () => {
    addComm("Email Sent", `Acquisition letter sent to ${buyer.email}`);
  };

  return (
    <div className={compact ? "" : "border-t border-gray-800 px-4 py-4 space-y-4"}>
      {!compact && <p className="text-gray-400 text-xs leading-relaxed bg-gray-800/40 rounded-lg p-3">{buyer.rationale}</p>}

      {/* Stage + Reminder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Deal Stage</label>
          <select value={record.stage} onChange={e => update({ stage: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gray-500">
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1 block">
            <Bell size={10} /> Follow-up Reminder
          </label>
          <input type="date" value={record.reminder || ""} onChange={e => update({ reminder: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gray-500" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${buyer.email}?subject=Acquisition Opportunity — Zenith Apex Advanced Research Platform [CONFIDENTIAL]`}
          onClick={handleEmailClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-all"
          style={{ backgroundColor: tierColor }}>
          <Mail size={11} /> Email <span className="opacity-70 font-normal">(auto-logged)</span>
        </a>
        <a href={buyer.web} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs transition-all">
          <ExternalLink size={11} /> Website
        </a>
        <Link to="/investor-package"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs transition-all">
          📄 Package
        </Link>
      </div>

      {/* Communication Log */}
      <div>
        <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1 block">
          <MessageSquare size={10} /> Communication Log ({(record.comms || []).length})
        </label>
        <div className="space-y-2 mb-3 max-h-52 overflow-y-auto">
          {(record.comms || []).length === 0
            ? <p className="text-gray-700 text-xs italic">No communications logged yet. Emails are auto-logged when you click Email above.</p>
            : [...(record.comms || [])].reverse().map(c => (
                <CommItem key={c.id} item={c} onDelete={() => update({ comms: (record.comms || []).filter(x => x.id !== c.id) })} />
              ))
          }
        </div>

        {/* Add manual entry */}
        <div className="flex gap-2">
          <select value={noteType} onChange={e => setNoteType(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white text-xs focus:outline-none focus:border-gray-500 w-28 flex-shrink-0">
            <option>Note</option>
            <option>Call</option>
            <option>Meeting</option>
            <option>Email Sent</option>
            <option>Other</option>
          </select>
          <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addComm(noteType, newNote)}
            placeholder="Log a communication, call, or note..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-gray-500" />
          <button onClick={() => addComm(noteType, newNote)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold transition-all">
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LIST ROW ──────────────────────────────────────────────────────────────────
function BuyerRow({ buyer, tierColor, crm, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const id = buyer.org;
  const record = crm[id] || { stage: "not_contacted", comms: [], reminder: "" };
  const stage = getStage(record.stage);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800/40 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: tierColor }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-bold text-sm truncate">{buyer.org}</span>
            <span className="text-gray-500 text-xs hidden sm:inline">{buyer.contact}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: stage.color + "22", color: stage.color }}>{stage.label}</span>
            {record.reminder && <ReminderBadge dateStr={record.reminder} />}
            {(record.comms || []).length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-600"><MessageSquare size={10} /> {record.comms.length}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-600 hidden md:inline">{buyer.ask}</span>
          {expanded ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
        </div>
      </div>
      {expanded && <BuyerDetail buyer={buyer} tierColor={tierColor} crm={crm} onChange={onChange} />}
    </div>
  );
}

// ── KANBAN VIEW ───────────────────────────────────────────────────────────────
function KanbanView({ crm, onChange }) {
  const [modalBuyer, setModalBuyer] = useState(null);
  const [modalTierColor, setModalTierColor] = useState("#888");
  const allContacts = BUYERS.flatMap(b => b.contacts.map(c => ({ ...c, tierColor: b.color })));

  const byStage = {};
  STAGES.forEach(s => { byStage[s.id] = []; });
  allContacts.forEach(c => {
    const stage = crm[c.org]?.stage || "not_contacted";
    if (byStage[stage]) byStage[stage].push(c);
  });

  const moveStage = (buyerOrg, newStage) => {
    const record = crm[buyerOrg] || { stage: "not_contacted", comms: [] };
    const oldStage = getStage(record.stage);
    const newS = getStage(newStage);
    const comm = { id: Date.now(), type: "Note", text: `Stage changed: ${oldStage.label} → ${newS.label}`, createdAt: new Date().toISOString() };
    const updated = { ...crm, [buyerOrg]: { ...record, stage: newStage, comms: [...(record.comms || []), comm] } };
    onChange(updated);
  };

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "60vh" }}>
        {STAGES.map(stage => (
          <div key={stage.id} className="flex-shrink-0 w-60 flex flex-col">
            {/* Column header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-xs font-bold text-gray-300">{stage.label}</span>
              </div>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{byStage[stage.id].length}</span>
            </div>
            {/* Cards */}
            <div className="flex-1 space-y-2 bg-gray-900/40 rounded-xl p-2 border border-gray-800/60">
              {byStage[stage.id].length === 0 && (
                <div className="text-center text-gray-700 text-xs py-8">Empty</div>
              )}
              {byStage[stage.id].map((buyer, i) => {
                const record = crm[buyer.org] || {};
                const commsCount = (record.comms || []).length;
                return (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-3 cursor-pointer hover:border-gray-600 transition-all"
                    onClick={() => { setModalBuyer(buyer); setModalTierColor(buyer.tierColor); }}>
                    <p className="text-white text-xs font-bold leading-snug mb-1">{buyer.org}</p>
                    <p className="text-gray-600 text-xs truncate mb-2">{buyer.contact}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: buyer.tierColor }}>{buyer.ask?.split(" ")[0]}</span>
                      <div className="flex items-center gap-2">
                        {record.reminder && <ReminderBadge dateStr={record.reminder} />}
                        {commsCount > 0 && <span className="text-gray-600 text-xs flex items-center gap-0.5"><MessageSquare size={9} />{commsCount}</span>}
                      </div>
                    </div>
                    {/* Stage move buttons */}
                    <div className="flex gap-1 mt-2 pt-2 border-t border-gray-800">
                      {STAGES.filter(s => s.id !== stage.id).slice(0, 3).map(s => (
                        <button key={s.id} onClick={e => { e.stopPropagation(); moveStage(buyer.org, s.id); }}
                          className="flex-1 text-xs py-0.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors truncate"
                          style={{ color: s.color }} title={`Move to ${s.label}`}>
                          →{s.label.slice(0, 5)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {modalBuyer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setModalBuyer(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-white font-black text-base">{modalBuyer.org}</h2>
                <p className="text-gray-500 text-xs">{modalBuyer.contact} · {modalBuyer.email}</p>
              </div>
              <button onClick={() => setModalBuyer(null)} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="p-5">
              <BuyerDetail buyer={modalBuyer} tierColor={modalTierColor} crm={crm} onChange={onChange} compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── PIPELINE SUMMARY ──────────────────────────────────────────────────────────
function PipelineSummary({ crm }) {
  const allContacts = BUYERS.flatMap(b => b.contacts);
  const byStage = {};
  STAGES.forEach(s => { byStage[s.id] = 0; });
  allContacts.forEach(c => { const s = crm[c.org]?.stage || "not_contacted"; byStage[s] = (byStage[s] || 0) + 1; });

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-5">
      {STAGES.map(s => (
        <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
          <div className="text-2xl font-black" style={{ color: s.color }}>{byStage[s.id] || 0}</div>
          <div className="text-gray-600 text-xs mt-0.5 leading-tight">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── UPCOMING REMINDERS ────────────────────────────────────────────────────────
function UpcomingReminders({ crm }) {
  const upcoming = BUYERS.flatMap(b => b.contacts.map(c => ({ ...c, color: b.color })))
    .filter(c => crm[c.org]?.reminder)
    .map(c => ({ ...c, days: getDaysUntil(crm[c.org].reminder), reminder: crm[c.org].reminder }))
    .filter(c => c.days !== null && c.days <= 7)
    .sort((a, b) => a.days - b.days);

  if (!upcoming.length) return null;
  return (
    <div className="bg-yellow-950/20 border border-yellow-800/40 rounded-xl p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={14} className="text-yellow-400" />
        <h3 className="text-yellow-300 font-bold text-sm">Upcoming Follow-ups ({upcoming.length})</h3>
      </div>
      <div className="space-y-2">
        {upcoming.map((c, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-gray-300 font-semibold">{c.org}</span>
            </div>
            <ReminderBadge dateStr={c.reminder} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function InvestorCRM() {
  const [crm, setCRM] = useState(loadCRM);
  const [view, setView] = useState("list"); // "list" | "kanban"
  const [stageFilter, setStageFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("All");

  const handleChange = useCallback((updated) => { setCRM(updated); saveCRM(updated); }, []);

  const tiers = ["All", ...BUYERS.map(b => b.tier)];
  const totalContacts = BUYERS.reduce((s, b) => s + b.contacts.length, 0);
  const contacted = BUYERS.flatMap(b => b.contacts).filter(c => {
    const s = crm[c.org]?.stage || "not_contacted";
    return s !== "not_contacted" && s !== "passed";
  }).length;

  const filteredBuyers = BUYERS
    .filter(b => tierFilter === "All" || b.tier === tierFilter)
    .map(b => ({
      ...b,
      contacts: b.contacts.filter(c => {
        if (stageFilter === "all") return true;
        return (crm[c.org]?.stage || "not_contacted") === stageFilter;
      }),
    }))
    .filter(b => b.contacts.length > 0);

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base">Investor CRM</h1>
            <p className="text-gray-500 text-xs">{contacted} / {totalContacts} in pipeline · Emails auto-logged</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-gray-800 border border-gray-700 rounded-lg p-0.5">
            <button onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${view === "list" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>
              <List size={12} /> List
            </button>
            <button onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${view === "kanban" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>
              <LayoutGrid size={12} /> Kanban
            </button>
          </div>
          <Link to="/investor-package"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300 text-xs font-bold transition-all">
            💼 Full Package
          </Link>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-5 ${view === "kanban" ? "max-w-full" : "max-w-5xl"} mx-auto w-full`}>
        <PipelineSummary crm={crm} />
        <UpcomingReminders crm={crm} />

        {/* Kanban View */}
        {view === "kanban" && <KanbanView crm={crm} onChange={handleChange} />}

        {/* List View */}
        {view === "list" && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex flex-wrap gap-1.5">
                {tiers.map(t => (
                  <button key={t} onClick={() => setTierFilter(t)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${tierFilter === t ? "bg-white/10 border-white/30 text-white" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="w-px bg-gray-800 mx-1" />
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setStageFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${stageFilter === "all" ? "bg-white/10 border-white/30 text-white" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
                  All Stages
                </button>
                {STAGES.map(s => (
                  <button key={s.id} onClick={() => setStageFilter(s.id)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${stageFilter === s.id ? "text-white border-white/30" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}
                    style={stageFilter === s.id ? { backgroundColor: s.color + "30", borderColor: s.color } : {}}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredBuyers.length === 0 && (
              <div className="text-center text-gray-600 py-16">No buyers match current filters.</div>
            )}
            {filteredBuyers.map(tier => (
              <div key={tier.tier} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{tier.icon}</span>
                  <h2 className="text-white font-bold text-sm">{tier.tier}</h2>
                  <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{tier.contacts.length}</span>
                </div>
                <div className="space-y-2">
                  {tier.contacts.map((c, i) => (
                    <BuyerRow key={i} buyer={c} tierColor={tier.color} crm={crm} onChange={handleChange} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        <div className="text-center text-gray-700 text-xs py-6 border-t border-gray-800 mt-4">
          CRM data stored locally · Emails auto-logged on send · CONFIDENTIAL — Zenith Apex Research Portfolio
        </div>
      </div>
    </div>
  );
}