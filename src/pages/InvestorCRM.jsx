import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Bell, StickyNote, ChevronDown, ChevronRight,
  Mail, ExternalLink, Plus, Trash2, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { BUYERS, STAGES } from "../lib/buyerData";

const STORAGE_KEY = "zenith_investor_crm_v1";

function loadCRM() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveCRM(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getStage(id) {
  return STAGES.find(s => s.id === id) || STAGES[0];
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function ReminderBadge({ dateStr }) {
  if (!dateStr) return null;
  const days = getDaysUntil(dateStr);
  if (days === null) return null;
  const overdue = days < 0;
  const soon = days <= 2;
  return (
    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
      overdue ? "bg-red-900/50 text-red-400" :
      soon ? "bg-yellow-900/50 text-yellow-400" :
      "bg-gray-800 text-gray-400"
    }`}>
      {overdue ? <AlertCircle size={10} /> : <Clock size={10} />}
      {overdue ? `${Math.abs(days)}d overdue` : days === 0 ? "Today" : `${days}d`}
    </span>
  );
}

function NoteItem({ note, onDelete }) {
  return (
    <div className="flex items-start gap-2 group">
      <div className="flex-1 bg-gray-800/60 rounded-lg px-3 py-2">
        <p className="text-gray-300 text-xs leading-relaxed">{note.text}</p>
        <p className="text-gray-600 text-xs mt-1">{new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      </div>
      <button onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 mt-1 text-gray-700 hover:text-red-500 transition-all">
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function BuyerRow({ buyer, tierColor, tierIcon, crm, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const [newNote, setNewNote] = useState("");
  const id = buyer.org;
  const record = crm[id] || { stage: "not_contacted", notes: [], reminder: "" };
  const stage = getStage(record.stage);

  const update = (patch) => {
    const updated = { ...crm, [id]: { ...record, ...patch } };
    onChange(updated);
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    update({ notes: [...(record.notes || []), { id: Date.now(), text: newNote.trim(), createdAt: new Date().toISOString() }] });
    setNewNote("");
  };

  const deleteNote = (noteId) => {
    update({ notes: (record.notes || []).filter(n => n.id !== noteId) });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all">
      {/* Row header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800/40 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: tierColor }} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-bold text-sm truncate">{buyer.org}</span>
            <span className="text-gray-500 text-xs hidden sm:inline">{buyer.contact}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: stage.color + "22", color: stage.color }}>
              {stage.label}
            </span>
            {record.reminder && <ReminderBadge dateStr={record.reminder} />}
            {record.notes?.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <StickyNote size={10} /> {record.notes.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-600 hidden md:inline">{buyer.ask}</span>
          {expanded ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-gray-800 px-4 py-4 space-y-4">
          {/* Rationale */}
          <p className="text-gray-400 text-xs leading-relaxed bg-gray-800/40 rounded-lg p-3">{buyer.rationale}</p>

          {/* Stage selector + reminder + links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Deal Stage</label>
              <select
                value={record.stage}
                onChange={e => update({ stage: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gray-500"
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block flex items-center gap-1">
                <Bell size={10} /> Follow-up Reminder
              </label>
              <input
                type="date"
                value={record.reminder || ""}
                onChange={e => update({ reminder: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${buyer.email}?subject=Acquisition Opportunity — Zenith Apex Advanced Research Platform [CONFIDENTIAL]`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: tierColor }}>
              <Mail size={11} /> Email
            </a>
            <a href={buyer.web} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs transition-all">
              <ExternalLink size={11} /> Website
            </a>
            <Link to="/investor-package"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs transition-all">
              📄 Full Package
            </Link>
          </div>

          {/* Notes */}
          <div>
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1">
              <StickyNote size={10} /> Interaction Notes
            </label>
            <div className="space-y-2 mb-2 max-h-48 overflow-y-auto">
              {(record.notes || []).length === 0 && (
                <p className="text-gray-700 text-xs italic">No notes yet. Add your first interaction note below.</p>
              )}
              {(record.notes || []).map(n => (
                <NoteItem key={n.id} note={n} onDelete={() => deleteNote(n.id)} />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addNote()}
                placeholder="Add note (e.g. 'Called, left voicemail. Follow up Thu.')"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-gray-500"
              />
              <button onClick={addNote}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold transition-all">
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PipelineSummary({ crm }) {
  const allContacts = BUYERS.flatMap(b => b.contacts);
  const bySage = {};
  STAGES.forEach(s => { bySage[s.id] = 0; });
  allContacts.forEach(c => {
    const stage = crm[c.org]?.stage || "not_contacted";
    bySage[stage] = (bySage[stage] || 0) + 1;
  });

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-6">
      {STAGES.map(s => (
        <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
          <div className="text-2xl font-black" style={{ color: s.color }}>{bySage[s.id] || 0}</div>
          <div className="text-gray-600 text-xs mt-0.5 leading-tight">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function UpcomingReminders({ crm }) {
  const allContacts = BUYERS.flatMap(b => b.contacts.map(c => ({ ...c, tier: b.tier, color: b.color })));
  const upcoming = allContacts
    .filter(c => crm[c.org]?.reminder)
    .map(c => ({ ...c, days: getDaysUntil(crm[c.org].reminder), reminder: crm[c.org].reminder }))
    .filter(c => c.days !== null && c.days <= 7)
    .sort((a, b) => a.days - b.days);

  if (!upcoming.length) return null;

  return (
    <div className="bg-yellow-950/20 border border-yellow-800/40 rounded-xl p-4 mb-6">
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

export default function InvestorCRM() {
  const [crm, setCRM] = useState(loadCRM);
  const [stageFilter, setStageFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("All");

  const handleChange = (updated) => {
    setCRM(updated);
    saveCRM(updated);
  };

  const tiers = ["All", ...BUYERS.map(b => b.tier)];

  const filteredBuyers = BUYERS
    .filter(b => tierFilter === "All" || b.tier === tierFilter)
    .map(b => ({
      ...b,
      contacts: b.contacts.filter(c => {
        if (stageFilter === "all") return true;
        const stage = crm[c.org]?.stage || "not_contacted";
        return stage === stageFilter;
      }),
    }))
    .filter(b => b.contacts.length > 0);

  const totalContacts = BUYERS.reduce((s, b) => s + b.contacts.length, 0);
  const contacted = BUYERS.flatMap(b => b.contacts).filter(c => {
    const s = crm[c.org]?.stage || "not_contacted";
    return s !== "not_contacted" && s !== "passed";
  }).length;

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
            <p className="text-gray-500 text-xs">{contacted} / {totalContacts} in pipeline · Data saved locally</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/investor-package"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300 text-xs font-bold transition-all">
            💼 Full Package
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 max-w-5xl mx-auto w-full">
        {/* Pipeline summary */}
        <PipelineSummary crm={crm} />

        {/* Upcoming reminders */}
        <UpcomingReminders crm={crm} />

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

        {/* Buyer rows by tier */}
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
                <BuyerRow
                  key={i}
                  buyer={c}
                  tierColor={tier.color}
                  tierIcon={tier.icon}
                  crm={crm}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="text-center text-gray-700 text-xs py-6 border-t border-gray-800">
          All CRM data stored locally in your browser · CONFIDENTIAL — Zenith Apex Research Portfolio
        </div>
      </div>
    </div>
  );
}