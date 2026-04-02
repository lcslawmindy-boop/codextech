import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Plus, Calendar, MessageSquare, CheckSquare, Square,
  ChevronDown, ChevronUp, Loader2, X, Edit2, Save, Bell, DollarSign,
  Mail, Phone, Video, FileText, Users, TrendingUp, Clock, AlertCircle
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const STAGES = ["Initial Outreach", "Responded", "Due Diligence", "Term Sheet Received", "Negotiating", "Funded", "Passed"];
const STAGE_COLORS = {
  "Initial Outreach": { bg: "bg-gray-800", text: "text-gray-300", border: "border-gray-600", dot: "bg-gray-400" },
  "Responded": { bg: "bg-blue-950/50", text: "text-blue-300", border: "border-blue-700", dot: "bg-blue-400" },
  "Due Diligence": { bg: "bg-yellow-950/40", text: "text-yellow-300", border: "border-yellow-700", dot: "bg-yellow-400" },
  "Term Sheet Received": { bg: "bg-purple-950/40", text: "text-purple-300", border: "border-purple-700", dot: "bg-purple-400" },
  "Negotiating": { bg: "bg-orange-950/40", text: "text-orange-300", border: "border-orange-700", dot: "bg-orange-400" },
  "Funded": { bg: "bg-green-950/40", text: "text-green-300", border: "border-green-700", dot: "bg-green-400" },
  "Passed": { bg: "bg-red-950/30", text: "text-red-400", border: "border-red-900", dot: "bg-red-500" },
};
const COMM_TYPES = ["Email", "Call", "Video Meeting", "In-Person", "Document Sent", "Note"];
const COMM_ICONS = { Email: Mail, Call: Phone, "Video Meeting": Video, "In-Person": Users, "Document Sent": FileText, Note: MessageSquare };
const PRIORITY_COLORS = { low: "text-gray-400", medium: "text-yellow-400", high: "text-red-400" };

function uid() { return Math.random().toString(36).slice(2, 9); }

// ── Add Relationship Modal ─────────────────────────────────────────────
function AddRelationshipModal({ cards, onSave, onClose }) {
  const [form, setForm] = useState({ investor_name: "", investor_type: "", contact_email: "", card_id: "", card_alias: "", stage: "Initial Outreach", priority: "medium", deal_amount: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, deal_amount: parseFloat(form.deal_amount) || 0, communication_log: [], meetings: [], tasks: [] };
    const saved = await base44.entities.InvestorRelationship.create(data);
    onSave({ ...data, id: saved.id });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-bold">Track New Investor Relationship</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-gray-400 text-xs block mb-1">Investor Name / Fund *</label>
              <input value={form.investor_name} onChange={e => setForm(f => ({ ...f, investor_name: e.target.value }))}
                placeholder="e.g. Clean Energy Fund III"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Investor Type</label>
              <input value={form.investor_type} onChange={e => setForm(f => ({ ...f, investor_type: e.target.value }))}
                placeholder="VC / Angel / Foundation"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Contact Email</label>
              <input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
                placeholder="partner@fund.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Linked Opportunity Card</label>
            <select value={form.card_id} onChange={e => {
              const card = cards.find(c => c.id === e.target.value);
              setForm(f => ({ ...f, card_id: e.target.value, card_alias: card?.alias || "" }));
            }} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
              <option value="">— None —</option>
              {cards.map(c => <option key={c.id} value={c.id}>{c.alias} · {c.category}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Stage</label>
              <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Deal Amount ($)</label>
              <input type="number" value={form.deal_amount} onChange={e => setForm(f => ({ ...f, deal_amount: e.target.value }))}
                placeholder="e.g. 250000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2} placeholder="Initial context, source of introduction, investor thesis..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500">Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.investor_name}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-50 transition-all">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              {saving ? "Saving…" : "Add Relationship"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Relationship Detail Panel ──────────────────────────────────────────
function RelationshipPanel({ rel, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState("comms");
  const [stage, setStage] = useState(rel.stage);
  const [newComm, setNewComm] = useState({ type: "Email", date: new Date().toISOString().slice(0, 10), summary: "", outcome: "" });
  const [newMeeting, setNewMeeting] = useState({ title: "", date: "", time: "", type: "Video Meeting", notes: "" });
  const [newTask, setNewTask] = useState({ title: "", due_date: "", priority: "medium" });
  const [saving, setSaving] = useState(false);

  const save = async (updates) => {
    setSaving(true);
    const updated = { ...rel, ...updates };
    await base44.entities.InvestorRelationship.update(rel.id, updates);
    onUpdate(updated);
    setSaving(false);
  };

  const handleStageChange = async (s) => {
    setStage(s);
    await save({ stage: s });
  };

  const addComm = async () => {
    if (!newComm.summary) return;
    const log = [...(rel.communication_log || []), { ...newComm, id: uid() }];
    await save({ communication_log: log });
    setNewComm({ type: "Email", date: new Date().toISOString().slice(0, 10), summary: "", outcome: "" });
  };

  const addMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date) return;
    const meetings = [...(rel.meetings || []), { ...newMeeting, id: uid(), completed: false }];
    await save({ meetings });
    setNewMeeting({ title: "", date: "", time: "", type: "Video Meeting", notes: "" });
  };

  const addTask = async () => {
    if (!newTask.title) return;
    const tasks = [...(rel.tasks || []), { ...newTask, id: uid(), completed: false }];
    await save({ tasks });
    setNewTask({ title: "", due_date: "", priority: "medium" });
  };

  const toggleTask = async (id) => {
    const tasks = (rel.tasks || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    await save({ tasks });
  };

  const toggleMeeting = async (id) => {
    const meetings = (rel.meetings || []).map(m => m.id === id ? { ...m, completed: !m.completed } : m);
    await save({ meetings });
  };

  const sc = STAGE_COLORS[stage] || STAGE_COLORS["Initial Outreach"];
  const CommIcon = COMM_ICONS[newComm.type] || MessageSquare;

  const overdueTasks = (rel.tasks || []).filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date());

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-800 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
              <h2 className="text-white font-bold">{rel.investor_name}</h2>
              {rel.investor_type && <span className="text-xs text-gray-500">{rel.investor_type}</span>}
            </div>
            {rel.card_alias && <p className="text-gray-500 text-xs">Card: <span className="text-blue-400">{rel.card_alias}</span></p>}
            {overdueTasks.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs">
                <AlertCircle size={11} /> {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {saving && <Loader2 size={13} className="animate-spin text-gray-500" />}
            <button onClick={onClose}><X size={18} className="text-gray-500 hover:text-white" /></button>
          </div>
        </div>

        {/* Stage selector */}
        <div className="px-5 py-3 border-b border-gray-800 flex-shrink-0">
          <p className="text-gray-500 text-xs mb-2 font-semibold uppercase tracking-wide">Deal Stage</p>
          <div className="flex flex-wrap gap-2">
            {STAGES.map(s => {
              const c = STAGE_COLORS[s];
              return (
                <button key={s} onClick={() => handleStageChange(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${stage === s ? `${c.bg} ${c.text} ${c.border}` : "border-gray-700 text-gray-600 hover:border-gray-500 hover:text-gray-400"}`}>
                  {s}
                </button>
              );
            })}
          </div>
          {rel.deal_amount > 0 && (
            <p className="text-green-400 text-xs mt-2 font-bold flex items-center gap-1"><DollarSign size={11} />{rel.deal_amount.toLocaleString()} target</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 flex-shrink-0">
          {[["comms", `💬 Comms (${(rel.communication_log || []).length})`], ["meetings", `📅 Meetings (${(rel.meetings || []).length})`], ["tasks", `✅ Tasks (${(rel.tasks || []).filter(t => !t.completed).length} open)`]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${activeTab === id ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* ── Comms Tab ── */}
          {activeTab === "comms" && (
            <>
              {/* Add new */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 space-y-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Log Communication</p>
                <div className="grid grid-cols-2 gap-2">
                  <select value={newComm.type} onChange={e => setNewComm(f => ({ ...f, type: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
                    {COMM_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <input type="date" value={newComm.date} onChange={e => setNewComm(f => ({ ...f, date: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none" />
                </div>
                <input value={newComm.summary} onChange={e => setNewComm(f => ({ ...f, summary: e.target.value }))}
                  placeholder="What was discussed or sent?"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <input value={newComm.outcome} onChange={e => setNewComm(f => ({ ...f, outcome: e.target.value }))}
                  placeholder="Outcome / next step (optional)"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <button onClick={addComm} disabled={!newComm.summary}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold disabled:opacity-50 transition-all">
                  <Plus size={11} /> Log
                </button>
              </div>
              {/* Log entries */}
              {(rel.communication_log || []).slice().reverse().map(entry => {
                const Icon = COMM_ICONS[entry.type] || MessageSquare;
                return (
                  <div key={entry.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-xs font-semibold">{entry.type}</span>
                        <span className="text-gray-600 text-xs">{entry.date}</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">{entry.summary}</p>
                      {entry.outcome && <p className="text-blue-400 text-xs mt-1">→ {entry.outcome}</p>}
                    </div>
                  </div>
                );
              })}
              {(rel.communication_log || []).length === 0 && (
                <p className="text-gray-600 text-xs text-center py-6">No communications logged yet.</p>
              )}
            </>
          )}

          {/* ── Meetings Tab ── */}
          {activeTab === "meetings" && (
            <>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 space-y-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Schedule Meeting</p>
                <input value={newMeeting.title} onChange={e => setNewMeeting(f => ({ ...f, title: e.target.value }))}
                  placeholder="Meeting title (e.g. Initial call, Due diligence review)"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <div className="grid grid-cols-3 gap-2">
                  <input type="date" value={newMeeting.date} onChange={e => setNewMeeting(f => ({ ...f, date: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none" />
                  <input type="time" value={newMeeting.time} onChange={e => setNewMeeting(f => ({ ...f, time: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none" />
                  <select value={newMeeting.type} onChange={e => setNewMeeting(f => ({ ...f, type: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
                    <option>Video Meeting</option>
                    <option>In-Person</option>
                    <option>Call</option>
                  </select>
                </div>
                <input value={newMeeting.notes} onChange={e => setNewMeeting(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Agenda / notes"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <button onClick={addMeeting} disabled={!newMeeting.title || !newMeeting.date}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold disabled:opacity-50 transition-all">
                  <Calendar size={11} /> Add Meeting
                </button>
              </div>
              {(rel.meetings || []).slice().sort((a, b) => a.date > b.date ? 1 : -1).map(m => {
                const isPast = m.date && new Date(m.date) < new Date();
                return (
                  <div key={m.id} className={`border rounded-xl p-3 flex items-start gap-3 ${m.completed ? "border-green-900/40 bg-green-950/10" : isPast ? "border-red-900/40 bg-red-950/10" : "border-gray-800 bg-gray-900"}`}>
                    <button onClick={() => toggleMeeting(m.id)} className="flex-shrink-0 mt-0.5">
                      {m.completed ? <CheckSquare size={15} className="text-green-400" /> : <Square size={15} className="text-gray-500" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${m.completed ? "text-gray-500 line-through" : "text-white"}`}>{m.title}</p>
                      <p className="text-gray-500 text-xs">{m.date}{m.time ? ` at ${m.time}` : ""} · {m.type}</p>
                      {m.notes && <p className="text-gray-400 text-xs mt-1">{m.notes}</p>}
                      {isPast && !m.completed && <p className="text-red-400 text-xs mt-0.5">Past date — mark complete?</p>}
                    </div>
                  </div>
                );
              })}
              {(rel.meetings || []).length === 0 && (
                <p className="text-gray-600 text-xs text-center py-6">No meetings scheduled.</p>
              )}
            </>
          )}

          {/* ── Tasks Tab ── */}
          {activeTab === "tasks" && (
            <>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 space-y-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Add Follow-up Task</p>
                <input value={newTask.title} onChange={e => setNewTask(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Send NDA, Prepare term sheet summary, Follow up on DD request"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={newTask.due_date} onChange={e => setNewTask(f => ({ ...f, due_date: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none" />
                  <select value={newTask.priority} onChange={e => setNewTask(f => ({ ...f, priority: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
                    <option value="low">Low priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority</option>
                  </select>
                </div>
                <button onClick={addTask} disabled={!newTask.title}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold disabled:opacity-50 transition-all">
                  <Plus size={11} /> Add Task
                </button>
              </div>
              {(rel.tasks || []).map(task => {
                const isOverdue = !task.completed && task.due_date && new Date(task.due_date) < new Date();
                return (
                  <div key={task.id} className={`border rounded-xl p-3 flex items-start gap-3 ${task.completed ? "border-green-900/40 bg-green-950/10" : isOverdue ? "border-red-900/40 bg-red-950/10" : "border-gray-800 bg-gray-900"}`}>
                    <button onClick={() => toggleTask(task.id)} className="flex-shrink-0 mt-0.5">
                      {task.completed ? <CheckSquare size={15} className="text-green-400" /> : <Square size={15} className="text-gray-500" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>{task.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {task.due_date && (
                          <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-400" : "text-gray-500"}`}>
                            <Clock size={10} /> {task.due_date}
                            {isOverdue && " · OVERDUE"}
                          </span>
                        )}
                        <span className={`text-xs font-semibold ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(rel.tasks || []).length === 0 && (
                <p className="text-gray-600 text-xs text-center py-6">No tasks yet. Add follow-up reminders above.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pipeline Kanban Column ─────────────────────────────────────────────
function KanbanColumn({ stage, rels, onSelect }) {
  const c = STAGE_COLORS[stage];
  const total = rels.reduce((sum, r) => sum + (r.deal_amount || 0), 0);
  return (
    <div className="flex-shrink-0 w-60">
      <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl border ${c.bg} ${c.border} border-b-0`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${c.dot}`} />
          <span className={`text-xs font-bold ${c.text}`}>{stage}</span>
        </div>
        <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded-full">{rels.length}</span>
      </div>
      <div className={`min-h-32 rounded-b-xl border ${c.border} p-2 space-y-2`} style={{ background: "rgba(17,24,39,0.8)" }}>
        {total > 0 && <p className="text-green-400 text-xs font-bold px-1">${total.toLocaleString()}</p>}
        {rels.map(rel => {
          const openTasks = (rel.tasks || []).filter(t => !t.completed).length;
          const overdue = (rel.tasks || []).filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date()).length;
          const upcomingMeeting = (rel.meetings || []).filter(m => !m.completed && m.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date > b.date ? 1 : -1)[0];
          return (
            <button key={rel.id} onClick={() => onSelect(rel)}
              className="w-full text-left bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-600 transition-all">
              <p className="text-white text-xs font-bold leading-snug">{rel.investor_name}</p>
              {rel.card_alias && <p className="text-gray-600 text-xs mt-0.5 font-mono truncate">{rel.card_alias}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-xs font-bold ${PRIORITY_COLORS[rel.priority]}`}>{rel.priority}</span>
                {openTasks > 0 && <span className={`text-xs flex items-center gap-0.5 ${overdue > 0 ? "text-red-400" : "text-yellow-400"}`}><CheckSquare size={9} /> {openTasks}</span>}
                {upcomingMeeting && <span className="text-xs text-blue-400 flex items-center gap-0.5"><Calendar size={9} /> {upcomingMeeting.date}</span>}
              </div>
            </button>
          );
        })}
        {rels.length === 0 && <p className="text-gray-700 text-xs text-center py-4">Empty</p>}
      </div>
    </div>
  );
}

// ── Calendar View ──────────────────────────────────────────────────────
function CalendarView({ rels }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const allEvents = useMemo(() => {
    const events = [];
    rels.forEach(rel => {
      (rel.meetings || []).forEach(m => {
        if (!m.completed && m.date) events.push({ date: m.date, label: `${rel.investor_name}: ${m.title}`, type: "meeting", rel });
      });
      (rel.tasks || []).forEach(t => {
        if (!t.completed && t.due_date) events.push({ date: t.due_date, label: `${rel.investor_name}: ${t.title}`, type: "task", overdue: t.due_date < today.toISOString().slice(0, 10), rel });
      });
    });
    return events;
  }, [rels]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthStr = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

  const eventsForDay = (d) => {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return allEvents.filter(e => e.date === ds);
  };

  return (
    <div className="p-5 max-w-4xl">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }} className="text-gray-400 hover:text-white px-2 py-1 rounded">←</button>
        <h3 className="text-white font-bold text-base flex-1 text-center">{monthStr}</h3>
        <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }} className="text-gray-400 hover:text-white px-2 py-1 rounded">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="text-center text-gray-600 text-xs py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const d = i + 1;
          const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const isToday = ds === today.toISOString().slice(0, 10);
          const events = eventsForDay(d);
          return (
            <div key={d} className={`min-h-16 rounded-lg p-1 border text-xs ${isToday ? "border-blue-500 bg-blue-950/20" : "border-gray-800 bg-gray-900/50"}`}>
              <span className={`font-bold ${isToday ? "text-blue-400" : "text-gray-500"}`}>{d}</span>
              {events.map((e, j) => (
                <div key={j} className={`mt-0.5 px-1 py-0.5 rounded text-xs leading-tight truncate ${e.type === "meeting" ? "bg-blue-900/60 text-blue-300" : e.overdue ? "bg-red-900/60 text-red-300" : "bg-yellow-900/50 text-yellow-300"}`}>
                  {e.label}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-900/60" /> Meeting</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-yellow-900/50" /> Task due</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-900/60" /> Overdue</span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function InvestorCRM() {
  const [rels, setRels] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("pipeline"); // pipeline | calendar

  useEffect(() => {
    Promise.all([
      base44.entities.InvestorRelationship.list("-updated_date", 100),
      base44.entities.OpportunityCard.list("-created_date", 50),
    ]).then(([r, c]) => { setRels(r); setCards(c); setLoading(false); });
  }, []);

  const handleUpdate = (updated) => {
    setRels(prev => prev.map(r => r.id === updated.id ? updated : r));
    if (selected?.id === updated.id) setSelected(updated);
  };

  const totalFunded = rels.filter(r => r.stage === "Funded").reduce((s, r) => s + (r.deal_amount || 0), 0);
  const totalPipeline = rels.filter(r => !["Funded", "Passed"].includes(r.stage)).reduce((s, r) => s + (r.deal_amount || 0), 0);
  const allOverdue = rels.flatMap(r => (r.tasks || []).filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date()).map(t => ({ ...t, rel: r })));
  const upcomingMeetings = rels.flatMap(r => (r.meetings || []).filter(m => !m.completed && m.date >= new Date().toISOString().slice(0, 10)).map(m => ({ ...m, rel: r }))).sort((a, b) => a.date > b.date ? 1 : -1).slice(0, 5);

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <Link to="/investors" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight flex items-center gap-2">
              <TrendingUp size={16} className="text-green-400" /> Investor Relationship CRM
            </h1>
            <p className="text-gray-500 text-xs">{rels.length} relationships tracked · pipeline & calendar</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-all">
          <Plus size={13} /> Track Relationship
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 px-5 py-3 border-b border-gray-800 overflow-x-auto flex-shrink-0">
        {[
          { label: "Total Relationships", value: rels.length, color: "text-white" },
          { label: "Pipeline Value", value: `$${totalPipeline.toLocaleString()}`, color: "text-blue-400" },
          { label: "Funded", value: `$${totalFunded.toLocaleString()}`, color: "text-green-400" },
          { label: "Overdue Tasks", value: allOverdue.length, color: allOverdue.length > 0 ? "text-red-400" : "text-gray-500" },
          { label: "Upcoming Meetings", value: upcomingMeetings.length, color: "text-yellow-400" },
        ].map(s => (
          <div key={s.label} className="flex-shrink-0">
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-600 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overdue alerts */}
      {allOverdue.length > 0 && (
        <div className="mx-5 mt-3 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
          <Bell size={13} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-xs"><strong>{allOverdue.length} overdue task{allOverdue.length > 1 ? "s" : ""}</strong>: {allOverdue.slice(0, 3).map(t => `${t.rel.investor_name} — ${t.title}`).join(" · ")}</p>
        </div>
      )}

      {/* View tabs */}
      <div className="flex items-center gap-1 border-b border-gray-800 px-5 flex-shrink-0">
        {[["pipeline", "🗂 Pipeline"], ["calendar", "📅 Calendar"]].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${view === id ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-gray-600" /></div>
        ) : view === "pipeline" ? (
          <div className="p-5">
            {rels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <TrendingUp size={48} className="text-gray-700 mb-4" />
                <h2 className="text-white font-bold text-xl mb-2">No investor relationships tracked yet</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-md">Add investor relationships to track their deal stage, log communications, schedule meetings, and manage follow-up tasks.</p>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-sm">
                  <Plus size={14} /> Track Your First Relationship
                </button>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {STAGES.map(stage => (
                  <KanbanColumn key={stage} stage={stage}
                    rels={rels.filter(r => r.stage === stage)}
                    onSelect={setSelected} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <CalendarView rels={rels} />
        )}
      </div>

      {showAdd && <AddRelationshipModal cards={cards} onSave={r => setRels(prev => [r, ...prev])} onClose={() => setShowAdd(false)} />}
      {selected && <RelationshipPanel rel={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
    </div>
  );
}