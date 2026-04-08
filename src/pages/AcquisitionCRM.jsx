import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Plus, X, ChevronDown, ChevronUp, Mail, Phone,
  Calendar, FileText, DollarSign, Building2, Clock, Check,
  AlertCircle, Loader2, MessageSquare, Edit3, Trash2, Star
} from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── PIPELINE STAGES ──────────────────────────────────────────────────────────
const STAGES = [
  { id: "Initial Outreach", label: "Outreach", color: "#6b7280", bg: "bg-gray-800/60" },
  { id: "Responded",        label: "Responded", color: "#3b82f6", bg: "bg-blue-900/40" },
  { id: "Due Diligence",    label: "Due Diligence", color: "#a855f7", bg: "bg-purple-900/40" },
  { id: "Term Sheet Received", label: "Term Sheet", color: "#f59e0b", bg: "bg-amber-900/40" },
  { id: "Negotiating",      label: "Negotiating", color: "#f97316", bg: "bg-orange-900/40" },
  { id: "Funded",           label: "Closed ✓", color: "#22c55e", bg: "bg-green-900/40" },
  { id: "Passed",           label: "Passed", color: "#ef4444", bg: "bg-red-900/30" },
];

// ── SEED DATA — 12 identified institutional buyers ────────────────────────────
const SEED_BUYERS = [
  {
    investor_name: "Clarivate Analytics",
    investor_type: "Strategic Acquirer",
    contact_email: "corpdev@clarivate.com",
    stage: "Initial Outreach",
    priority: "high",
    deal_amount: 18000000,
    notes: "Owns PatSnap ($1.5B), Derwent Innovation, CPA Global ($6.8B). Most direct comparable acquirer. VP CorpDev: target LinkedIn. Lead with AI IP generation + Bearden data moat. 9–28× ARR comps in their own acquisition history.",
    communication_log: [],
    meetings: [],
    tasks: [{ id: "t1", title: "Find VP Corporate Development on LinkedIn", due_date: "", priority: "high", completed: false }],
  },
  {
    investor_name: "Reed Elsevier / LexisNexis",
    investor_type: "Strategic Acquirer",
    contact_email: "bizdev@lexisnexis.com",
    stage: "Initial Outreach",
    priority: "high",
    deal_amount: 12000000,
    notes: "IP analytics and research tools division. LexisNexis PatentAdvisor is direct competitor to Patent Drafter module. Frame as domain-specific AI add-on to existing IP suite. Contact: Chief Strategy Officer or VP Product.",
    communication_log: [],
    meetings: [],
    tasks: [{ id: "t2", title: "Research CSO contact via LinkedIn", due_date: "", priority: "high", completed: false }],
  },
  {
    investor_name: "SoftBank Vision Fund",
    investor_type: "Institutional VC",
    contact_email: "investments@softbank.com",
    stage: "Initial Outreach",
    priority: "high",
    deal_amount: 15000000,
    notes: "Acquired PatSnap for $1.5B — identical investment thesis. Already understand IP analytics SaaS value. Lead with: $14.2B AI IP market, 18.4% CAGR, 270× LTV:CAC, $0.80 marginal cost per invention. Target: managing partner for SaaS investments.",
    communication_log: [],
    meetings: [],
    tasks: [{ id: "t3", title: "Request intro via SBIR network to SoftBank SaaS partner", due_date: "", priority: "high", completed: false }],
  },
  {
    investor_name: "Raytheon Technologies (RTX)",
    investor_type: "Defense Prime",
    contact_email: "irad@rtx.com",
    stage: "Initial Outreach",
    priority: "high",
    deal_amount: 10000000,
    notes: "Defense prime contractor. Scalar Pulse Radar SBIR Phase I+II ($630K) is the door opener — they fund via SBIR themselves. Lead with: DoD Electronic Warfare applications, G-Com ECM-immune comms, Fireflies Sensor Pentagon procurement pathway. Contact via SBIR office or IRAD program.",
    communication_log: [],
    meetings: [],
    tasks: [{ id: "t4", title: "Submit SBIR Phase III proposal to RTX IRAD office", due_date: "", priority: "high", completed: false }],
  },
  {
    investor_name: "Breakthrough Energy Ventures",
    investor_type: "Institutional VC",
    contact_email: "info@breakthroughenergy.org",
    stage: "Initial Outreach",
    priority: "high",
    deal_amount: 8000000,
    notes: "Bill Gates clean energy fund. MEG (US Patent 6,362,718, peer-reviewed Boeing co-author) + TRZ-1 (73-sigma China Lake data, 3.5W excess heat confirmed) + DoE ARPA-E Exploratory Topics pathway = clean energy thesis. Lead with anomalous energy extraction, not 'free energy'.",
    communication_log: [],
    meetings: [],
    tasks: [{ id: "t5", title: "Prepare MEG + TRZ-1 clean energy brief (no fringe language)", due_date: "", priority: "high", completed: false }],
  },
  {
    investor_name: "Andreessen Horowitz (a16z Bio)",
    investor_type: "Institutional VC",
    contact_email: "bio@a16z.com",
    stage: "Initial Outreach",
    priority: "high",
    deal_amount: 9000000,
    notes: "$4.8B VC in longevity startups (2024). TRD-1 (PEMF wristband, ONR-validated mechanism), Prioré Platform (Nobel laureate Lwoff endorsed), Trigger Therapy ($580K longevity fund already invested) = biotech angle. Lead with ONR R-5-78 document — US govt confirmation of EM tumor reversal.",
    communication_log: [],
    meetings: [],
    tasks: [{ id: "t6", title: "Prepare longevity-focused one-pager: TRD-1 + Prioré + ONR R-5-78", due_date: "", priority: "high", completed: false }],
  },
  {
    investor_name: "L3Harris Technologies",
    investor_type: "Defense Prime",
    contact_email: "bd@l3harris.com",
    stage: "Initial Outreach",
    priority: "medium",
    deal_amount: 7500000,
    notes: "Defense electronics and EW systems. Scalar Pulse Radar (SBIR awarded), ELF Detector (community replication in 14 countries), Fireflies Sensor (SBIR Phase I: $180K) — all directly applicable to L3Harris product lines. Contact: Business Development office or Chief Technology Officer.",
    communication_log: [],
    meetings: [],
    tasks: [],
  },
  {
    investor_name: "In-Q-Tel (IQT)",
    investor_type: "Government Innovation Arm",
    contact_email: "investments@iqt.org",
    stage: "Initial Outreach",
    priority: "high",
    deal_amount: 6500000,
    notes: "CIA venture arm. Invests in tech with US intelligence community applications. ELF Lock Detector (intelligence community grant: $85K already received), Woodpecker Grid (14-country deployment), Atmospheric EM AI (geospatial intel), G-Com (ECM-immune comms) — all relevant. IQT is fast-moving for gov innovation.",
    communication_log: [],
    meetings: [],
    tasks: [{ id: "t7", title: "Contact IQT via SBIR network referral — don't cold email", due_date: "", priority: "high", completed: false }],
  },
  {
    investor_name: "Northrop Grumman Ventures",
    investor_type: "Defense Prime",
    contact_email: "ngventures@northropgrumman.com",
    stage: "Initial Outreach",
    priority: "medium",
    deal_amount: 8000000,
    notes: "Defense prime with major directed energy programs. Scalar Energy Bottle (DoD grant: $210K), T-Polarized Transducer (DARPA exploratory: $280K), Phase Conjugate Mirror System. Lead with DARPA funding precedent — Northrop already tracks DARPA-funded IP closely.",
    communication_log: [],
    meetings: [],
    tasks: [],
  },
  {
    investor_name: "WARF (Wisconsin Alumni Research Foundation)",
    investor_type: "IP Licensing Organization",
    contact_email: "licensing@warf.org",
    stage: "Initial Outreach",
    priority: "medium",
    deal_amount: 5000000,
    notes: "University IP licensing body — $180M+/year licensing income model. Platform's patent portfolio (24 device PPAs + MEG public domain engineering) fits their licensing-from-portfolio business model. They may license rather than acquire. Separate conversation: revenue-share licensing deal on provisional patents.",
    communication_log: [],
    meetings: [],
    tasks: [],
  },
  {
    investor_name: "Calico / Alphabet Life Sciences",
    investor_type: "Strategic / Corporate VC",
    contact_email: "partnerships@calicolabs.com",
    stage: "Initial Outreach",
    priority: "medium",
    deal_amount: 12000000,
    notes: "Google's longevity research arm. Altos Labs (Bezos-funded) is the comp. TRD-1 (telomere extension mechanism), Prioré-class platform (100% animal cure rate), Psychoenergetics CCS (Popp biophoton protocols) — longevity biotech angle. Lead with Fröhlich condensate biophysics (mainstream science anchor).",
    communication_log: [],
    meetings: [],
    tasks: [],
  },
  {
    investor_name: "Questel (IP Analytics SaaS)",
    investor_type: "Strategic Acquirer",
    contact_email: "corp@questel.com",
    stage: "Initial Outreach",
    priority: "medium",
    deal_amount: 6000000,
    notes: "European IP analytics SaaS — direct acquirer comp to PatSnap/CPA Global. Actively acquiring AI IP tools. Lead with AI Patent Drafter + Invention Forge as white-label additions to existing Questel product suite. Lower valuation target but faster process due to strategic fit.",
    communication_log: [],
    meetings: [],
    tasks: [],
  },
];

// ── PRIORITY CONFIG ───────────────────────────────────────────────────────────
const PRIORITY = {
  high:   { color: "text-red-400",    bg: "bg-red-950/40 border-red-800",    label: "High" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-950/40 border-yellow-800", label: "Med" },
  low:    { color: "text-gray-500",   bg: "bg-gray-800 border-gray-700",     label: "Low" },
};

const fmt = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n}`;

// ── CONTACT CARD ──────────────────────────────────────────────────────────────
function ContactCard({ contact, onClick, index }) {
  const stage = STAGES.find(s => s.id === contact.stage) || STAGES[0];
  const pri = PRIORITY[contact.priority] || PRIORITY.medium;
  const pendingTasks = (contact.tasks || []).filter(t => !t.completed).length;
  const logs = contact.communication_log || [];

  return (
    <Draggable draggableId={contact.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(contact)}
          className={`bg-gray-900 border border-gray-800 rounded-xl p-3.5 cursor-pointer hover:border-gray-700 transition-all select-none ${snapshot.isDragging ? 'shadow-2xl ring-1 ring-yellow-600/50 rotate-1' : ''}`}>
          {/* Name + priority */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <p className="text-white font-bold text-xs leading-tight truncate">{contact.investor_name}</p>
              <p className="text-gray-500 text-xs truncate mt-0.5">{contact.investor_type}</p>
            </div>
            <span className={`text-xs font-black px-1.5 py-0.5 rounded border flex-shrink-0 ${pri.bg} ${pri.color}`}>{pri.label}</span>
          </div>

          {/* Deal amount */}
          {contact.deal_amount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <DollarSign size={10} className="text-green-500" />
              <span className="text-green-400 font-bold text-xs">{fmt(contact.deal_amount)}</span>
              <span className="text-gray-600 text-xs">target</span>
            </div>
          )}

          {/* Footer stats */}
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-800">
            {logs.length > 0 && (
              <span className="flex items-center gap-1 text-gray-600 text-xs">
                <MessageSquare size={9} /> {logs.length}
              </span>
            )}
            {pendingTasks > 0 && (
              <span className="flex items-center gap-1 text-amber-600 text-xs">
                <Clock size={9} /> {pendingTasks} task{pendingTasks > 1 ? 's' : ''}
              </span>
            )}
            {contact.contact_email && (
              <span className="text-gray-700 text-xs truncate flex-1 text-right">{contact.contact_email.split('@')[1]}</span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

// ── DETAIL MODAL ──────────────────────────────────────────────────────────────
function DetailModal({ contact, onClose, onSave, onDelete }) {
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...contact });
  const [newLog, setNewLog] = useState({ type: 'Email', summary: '', outcome: '' });
  const [newTask, setNewTask] = useState({ title: '', due_date: '', priority: 'medium' });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addLog = () => {
    if (!newLog.summary.trim()) return;
    const log = { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], ...newLog };
    setForm(f => ({ ...f, communication_log: [...(f.communication_log || []), log] }));
    setNewLog({ type: 'Email', summary: '', outcome: '' });
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task = { id: Date.now().toString(), completed: false, ...newTask };
    setForm(f => ({ ...f, tasks: [...(f.tasks || []), task] }));
    setNewTask({ title: '', due_date: '', priority: 'medium' });
  };

  const toggleTask = (id) => {
    setForm(f => ({ ...f, tasks: (f.tasks || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t) }));
  };

  const removeLog = (id) => setForm(f => ({ ...f, communication_log: (f.communication_log || []).filter(l => l.id !== id) }));
  const removeTask = (id) => setForm(f => ({ ...f, tasks: (f.tasks || []).filter(t => t.id !== id) }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setEditing(false);
  };

  const stage = STAGES.find(s => s.id === form.stage) || STAGES[0];
  const TABS = ['overview', 'comms', 'tasks'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-800 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            {editing ? (
              <input value={form.investor_name} onChange={e => set('investor_name', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white font-black text-base w-full outline-none focus:border-yellow-600" />
            ) : (
              <h2 className="text-white font-black text-base">{form.investor_name}</h2>
            )}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded font-bold"
                style={{ backgroundColor: stage.color + '22', color: stage.color }}>{stage.label}</span>
              <span className="text-gray-500 text-xs">{form.investor_type}</span>
              {form.deal_amount > 0 && (
                <span className="text-green-400 font-bold text-xs flex items-center gap-1">
                  <DollarSign size={10} />{fmt(form.deal_amount)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {editing ? (
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-800 hover:bg-green-700 text-white text-xs font-bold transition-all disabled:opacity-60">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
              </button>
            ) : (
              <button onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
                <Edit3 size={13} />
              </button>
            )}
            <button onClick={() => onDelete(contact.id)}
              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-500 transition-all">
              <Trash2 size={13} />
            </button>
            <button onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3 flex-shrink-0">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${tab === t ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-400'}`}>
              {t === 'comms' ? `Comms (${(form.communication_log || []).length})` : t === 'tasks' ? `Tasks (${(form.tasks || []).filter(x => !x.completed).length})` : t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {/* Stage */}
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Stage</label>
                  <select value={form.stage} onChange={e => set('stage', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-600">
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                {/* Priority */}
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Priority</label>
                  <select value={form.priority} onChange={e => set('priority', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-600">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                {/* Deal amount */}
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Deal Target ($)</label>
                  <input type="number" value={form.deal_amount || ''} onChange={e => set('deal_amount', Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-600" />
                </div>
                {/* Email */}
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Contact Email</label>
                  <input value={form.contact_email || ''} onChange={e => set('contact_email', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-600" />
                </div>
                {/* Investor type */}
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Investor Type</label>
                  <input value={form.investor_type || ''} onChange={e => set('investor_type', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-600" />
                </div>
                {/* Next follow-up */}
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Next Follow-Up</label>
                  <input type="date" value={form.next_follow_up || ''} onChange={e => set('next_follow_up', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-600" />
                </div>
              </div>
              {/* Notes */}
              <div>
                <label className="text-gray-600 text-xs mb-1 block">Strategy Notes</label>
                <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={5}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-600 resize-none leading-relaxed" />
              </div>
            </>
          )}

          {/* COMMS TAB */}
          {tab === 'comms' && (
            <>
              {/* Log list */}
              <div className="space-y-2">
                {(form.communication_log || []).length === 0 && (
                  <p className="text-gray-700 text-xs text-center py-4">No communication logged yet.</p>
                )}
                {(form.communication_log || []).map(log => (
                  <div key={log.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-400">{log.type}</span>
                        <span className="text-gray-600 text-xs">{log.date}</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">{log.summary}</p>
                      {log.outcome && <p className="text-yellow-500 text-xs mt-1 font-semibold">→ {log.outcome}</p>}
                    </div>
                    <button onClick={() => removeLog(log.id)} className="text-gray-700 hover:text-red-500 transition-colors flex-shrink-0">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              {/* Add log */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
                <p className="text-gray-500 text-xs font-bold">Log Communication</p>
                <div className="grid grid-cols-2 gap-2">
                  <select value={newLog.type} onChange={e => setNewLog(l => ({ ...l, type: e.target.value }))}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none">
                    {['Email', 'Call', 'Meeting', 'LinkedIn', 'Letter', 'NDA Sent', 'Demo'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <input placeholder="Outcome (optional)" value={newLog.outcome} onChange={e => setNewLog(l => ({ ...l, outcome: e.target.value }))}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none placeholder-gray-600" />
                </div>
                <textarea placeholder="What was discussed / sent / outcome…" value={newLog.summary} onChange={e => setNewLog(l => ({ ...l, summary: e.target.value }))} rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none resize-none placeholder-gray-600" />
                <button onClick={addLog}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all">
                  <Plus size={11} /> Add Log
                </button>
              </div>
            </>
          )}

          {/* TASKS TAB */}
          {tab === 'tasks' && (
            <>
              <div className="space-y-2">
                {(form.tasks || []).length === 0 && (
                  <p className="text-gray-700 text-xs text-center py-4">No tasks yet.</p>
                )}
                {(form.tasks || []).map(task => (
                  <div key={task.id} className={`flex items-start gap-3 bg-gray-900 border rounded-xl p-3 ${task.completed ? 'border-gray-800 opacity-50' : 'border-gray-800'}`}>
                    <button onClick={() => toggleTask(task.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${task.completed ? 'bg-green-700 border-green-700' : 'border-gray-600 hover:border-gray-400'}`}>
                      {task.completed && <Check size={9} className="text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${task.completed ? 'line-through text-gray-600' : 'text-white'}`}>{task.title}</p>
                      {task.due_date && <p className="text-gray-600 text-xs mt-0.5">Due: {task.due_date}</p>}
                    </div>
                    <span className={`text-xs font-bold flex-shrink-0 ${PRIORITY[task.priority]?.color}`}>
                      {PRIORITY[task.priority]?.label}
                    </span>
                    <button onClick={() => removeTask(task.id)} className="text-gray-700 hover:text-red-500 transition-colors flex-shrink-0">
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
              {/* Add task */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
                <p className="text-gray-500 text-xs font-bold">Add Task</p>
                <input placeholder="Task description…" value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none placeholder-gray-600" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={newTask.due_date} onChange={e => setNewTask(t => ({ ...t, due_date: e.target.value }))}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none" />
                  <select value={newTask.priority} onChange={e => setNewTask(t => ({ ...t, priority: e.target.value }))}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <button onClick={addTask}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold transition-all">
                  <Plus size={11} /> Add Task
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer save */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-sm disabled:opacity-60 transition-all">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AcquisitionCRM() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const existing = await base44.entities.InvestorRelationship.list('-created_date', 100);
    if (existing.length === 0) {
      // Seed with 12 identified buyers
      const created = await base44.entities.InvestorRelationship.bulkCreate(SEED_BUYERS);
      setContacts(created);
    } else {
      setContacts(existing);
    }
    setLoading(false);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStage = destination.droppableId;
    const contact = contacts.find(c => c.id === draggableId);
    if (!contact || contact.stage === newStage) return;

    // Optimistic update
    setContacts(prev => prev.map(c => c.id === draggableId ? { ...c, stage: newStage } : c));
    await base44.entities.InvestorRelationship.update(draggableId, { stage: newStage });
  };

  const handleSave = async (updated) => {
    await base44.entities.InvestorRelationship.update(updated.id, updated);
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelected(updated);
  };

  const handleDelete = async (id) => {
    await base44.entities.InvestorRelationship.delete(id);
    setContacts(prev => prev.filter(c => c.id !== id));
    setSelected(null);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const created = await base44.entities.InvestorRelationship.create({
      investor_name: newName.trim(),
      investor_type: 'Strategic Acquirer',
      stage: 'Initial Outreach',
      priority: 'medium',
      deal_amount: 0,
      communication_log: [],
      meetings: [],
      tasks: [],
    });
    setContacts(prev => [created, ...prev]);
    setNewName('');
    setShowAdd(false);
    setSaving(false);
  };

  // Pipeline stats
  const totalPipeline = contacts.reduce((s, c) => s + (c.deal_amount || 0), 0);
  const activeContacts = contacts.filter(c => !['Funded', 'Passed'].includes(c.stage)).length;
  const highPriority = contacts.filter(c => c.priority === 'high' && c.stage !== 'Passed').length;
  const pendingTasks = contacts.reduce((s, c) => s + (c.tasks || []).filter(t => !t.completed).length, 0);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={28} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base tracking-tight">Acquisition Pipeline CRM</h1>
            <p className="text-gray-500 text-xs">Drag cards between stages · Click to manage contact</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showAdd ? (
            <div className="flex items-center gap-2">
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Buyer name…"
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-600 w-44" />
              <button onClick={handleAdd} disabled={saving}
                className="px-3 py-2 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-bold text-xs transition-all disabled:opacity-60">
                {saving ? <Loader2 size={11} className="animate-spin" /> : 'Add'}
              </button>
              <button onClick={() => setShowAdd(false)} className="px-3 py-2 rounded-xl bg-gray-800 text-gray-400 text-xs hover:bg-gray-700">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300 text-xs font-bold transition-all">
              <Plus size={12} /> Add Buyer
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-5 px-5 py-3 border-b border-gray-800/60 bg-gray-950 overflow-x-auto">
        {[
          { label: 'Total Pipeline', value: fmt(totalPipeline), color: 'text-green-400' },
          { label: 'Active Contacts', value: activeContacts, color: 'text-blue-400' },
          { label: 'High Priority', value: highPriority, color: 'text-red-400' },
          { label: 'Open Tasks', value: pendingTasks, color: 'text-amber-400' },
          { label: 'Total Buyers', value: contacts.length, color: 'text-gray-400' },
        ].map(stat => (
          <div key={stat.label} className="flex-shrink-0">
            <p className={`font-black text-base ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-600 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3 p-4 h-full min-h-0" style={{ minWidth: `${STAGES.length * 230}px` }}>
            {STAGES.map(stage => {
              const stageContacts = contacts.filter(c => c.stage === stage.id);
              const stageValue = stageContacts.reduce((s, c) => s + (c.deal_amount || 0), 0);

              return (
                <div key={stage.id} className="flex flex-col w-52 flex-shrink-0">
                  {/* Column header */}
                  <div className={`rounded-xl px-3 py-2.5 mb-2 border ${stage.bg} border-gray-800`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                        <span className="text-white font-bold text-xs">{stage.label}</span>
                      </div>
                      <span className="text-gray-500 text-xs font-bold">{stageContacts.length}</span>
                    </div>
                    {stageValue > 0 && (
                      <p className="text-xs mt-1 font-semibold" style={{ color: stage.color }}>
                        {fmt(stageValue)}
                      </p>
                    )}
                  </div>

                  {/* Droppable */}
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 space-y-2 rounded-xl p-2 min-h-24 transition-colors ${snapshot.isDraggingOver ? 'bg-gray-800/40 ring-1 ring-inset ring-gray-700' : ''}`}>
                        {stageContacts.map((c, i) => (
                          <ContactCard key={c.id} contact={c} index={i} onClick={setSelected} />
                        ))}
                        {provided.placeholder}
                        {stageContacts.length === 0 && !snapshot.isDraggingOver && (
                          <div className="border border-dashed border-gray-800 rounded-xl p-4 text-center">
                            <p className="text-gray-800 text-xs">Drop here</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Detail modal */}
      {selected && (
        <DetailModal
          contact={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}