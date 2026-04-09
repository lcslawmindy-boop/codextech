import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Plus, X, Check, Loader2, AlertTriangle, ChevronDown,
  ChevronUp, Edit3, Trash2, Package, Wrench, FlaskConical, Settings,
  CheckCircle2, Clock, PauseCircle, Flag, BarChart3, Users, Filter
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { businessItems } from "../lib/businessItems";

const STATUSES = [
  { id: "Parts Ordered",         label: "Parts Ordered",         icon: <Package size={12} />,        color: "#6b7280", bg: "bg-gray-800/60",     border: "border-gray-700" },
  { id: "Parts Received",        label: "Parts Received",        icon: <Check size={12} />,          color: "#3b82f6", bg: "bg-blue-900/40",    border: "border-blue-800" },
  { id: "Assembly in Progress",  label: "Assembly",              icon: <Wrench size={12} />,         color: "#a855f7", bg: "bg-purple-900/40",  border: "border-purple-800" },
  { id: "Wiring & Connections",  label: "Wiring",                icon: <Settings size={12} />,       color: "#f59e0b", bg: "bg-amber-900/40",   border: "border-amber-800" },
  { id: "Testing",               label: "Testing",               icon: <FlaskConical size={12} />,   color: "#22d3ee", bg: "bg-cyan-900/40",    border: "border-cyan-800" },
  { id: "Calibration",           label: "Calibration",           icon: <Settings size={12} />,       color: "#f97316", bg: "bg-orange-900/40",  border: "border-orange-800" },
  { id: "Completed",             label: "Completed ✓",           icon: <CheckCircle2 size={12} />,   color: "#22c55e", bg: "bg-green-900/40",   border: "border-green-800" },
  { id: "On Hold",               label: "On Hold",               icon: <PauseCircle size={12} />,    color: "#94a3b8", bg: "bg-slate-900/40",   border: "border-slate-700" },
  { id: "Issue Flagged",         label: "Issue Flagged",         icon: <AlertTriangle size={12} />,  color: "#ef4444", bg: "bg-red-900/40",     border: "border-red-800" },
];

const PRIORITY = {
  low:      { color: "text-gray-500",   bg: "bg-gray-800 border-gray-700",         label: "Low" },
  medium:   { color: "text-yellow-400", bg: "bg-yellow-950/40 border-yellow-800",  label: "Med" },
  high:     { color: "text-orange-400", bg: "bg-orange-950/40 border-orange-800",  label: "High" },
  critical: { color: "text-red-400",    bg: "bg-red-950/40 border-red-800",        label: "CRIT" },
};

const INVENTIONS = (businessItems || []).filter(b => b.category === "Invention").map(b => b.title);

// ── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ project, onEdit, onDelete, onStatusChange }) {
  const status = STATUSES.find(s => s.id === project.status) || STATUSES[0];
  const pri = PRIORITY[project.priority] || PRIORITY.medium;
  const issues = (project.issues || []).filter(i => !i.resolved).length;
  const milestonesDone = (project.milestones || []).filter(m => m.completed).length;
  const milestonesTotal = (project.milestones || []).length;

  return (
    <div className={`bg-gray-900 border rounded-xl p-3.5 space-y-2.5 hover:border-gray-600 transition-all`}
      style={{ borderColor: status.color + "44" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-white font-bold text-xs leading-snug truncate">{project.invention_name}</p>
          <p className="text-gray-500 text-xs truncate mt-0.5">{project.user_name || project.user_email}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-xs font-black px-1.5 py-0.5 rounded border ${pri.bg} ${pri.color}`}>{pri.label}</span>
          <button onClick={() => onEdit(project)} className="text-gray-600 hover:text-gray-300 transition-colors"><Edit3 size={11} /></button>
          <button onClick={() => onDelete(project.id)} className="text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={11} /></button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-600 text-xs">Progress</span>
          <span className="text-gray-400 text-xs font-bold">{project.progress_percent || 0}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${project.progress_percent || 0}%`, backgroundColor: status.color }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs">
        {milestonesTotal > 0 && (
          <span className="text-gray-600">{milestonesDone}/{milestonesTotal} milestones</span>
        )}
        {issues > 0 && (
          <span className="flex items-center gap-1 text-red-500 font-bold">
            <AlertTriangle size={9} /> {issues} issue{issues > 1 ? "s" : ""}
          </span>
        )}
        {project.target_date && (
          <span className="flex items-center gap-1 text-gray-600 ml-auto">
            <Clock size={9} /> {project.target_date}
          </span>
        )}
      </div>

      {/* Notes preview */}
      {project.notes && (
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{project.notes}</p>
      )}

      {/* Quick status changer */}
      <select
        value={project.status}
        onChange={e => onStatusChange(project.id, e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
        style={{ color: status.color }}
        onClick={e => e.stopPropagation()}
      >
        {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
    </div>
  );
}

// ── ADD / EDIT MODAL ─────────────────────────────────────────────────────────
function ProjectModal({ project, onClose, onSave }) {
  const isEdit = !!project?.id;
  const [form, setForm] = useState(project || {
    invention_name: "", user_email: "", user_name: "", status: "Parts Ordered",
    priority: "medium", progress_percent: 0, notes: "", admin_notes: "",
    target_date: "", started_date: new Date().toISOString().split("T")[0],
    milestones: [], issues: [], parts_list: [],
  });
  const [saving, setSaving] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");
  const [newIssue, setNewIssue] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setForm(f => ({ ...f, milestones: [...(f.milestones || []), { title: newMilestone.trim(), completed: false, date: "" }] }));
    setNewMilestone("");
  };

  const toggleMilestone = (i) => {
    setForm(f => {
      const m = [...(f.milestones || [])];
      m[i] = { ...m[i], completed: !m[i].completed, date: !m[i].completed ? new Date().toISOString().split("T")[0] : "" };
      const done = m.filter(x => x.completed).length;
      return { ...f, milestones: m, progress_percent: Math.round((done / m.length) * 100) };
    });
  };

  const addIssue = () => {
    if (!newIssue.trim()) return;
    setForm(f => ({ ...f, issues: [...(f.issues || []), { id: Date.now().toString(), description: newIssue.trim(), severity: "medium", resolved: false }] }));
    setNewIssue("");
  };

  const handleSave = async () => {
    if (!form.invention_name || !form.user_email) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-white font-black text-base">{isEdit ? "Edit Build Project" : "New Build Project"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={16} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-gray-500 text-xs mb-1 block">Invention *</label>
              <select value={form.invention_name} onChange={e => set("invention_name", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600">
                <option value="">Select invention…</option>
                {INVENTIONS.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">User Email *</label>
              <input value={form.user_email} onChange={e => set("user_email", e.target.value)} placeholder="user@email.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600" />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">User Name</label>
              <input value={form.user_name} onChange={e => set("user_name", e.target.value)} placeholder="Display name"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600" />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600">
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Priority</label>
              <select value={form.priority} onChange={e => set("priority", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Start Date</label>
              <input type="date" value={form.started_date || ""} onChange={e => set("started_date", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600" />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Target Date</label>
              <input type="date" value={form.target_date || ""} onChange={e => set("target_date", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600" />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Progress %</label>
              <input type="number" min="0" max="100" value={form.progress_percent || 0} onChange={e => set("progress_percent", Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600" />
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-xs mb-1 block">User Notes</label>
            <textarea value={form.notes || ""} onChange={e => set("notes", e.target.value)} rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600 resize-none" />
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Admin Notes (internal)</label>
            <textarea value={form.admin_notes || ""} onChange={e => set("admin_notes", e.target.value)} rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600 resize-none" />
          </div>

          {/* Milestones */}
          <div>
            <label className="text-gray-500 text-xs mb-2 block font-bold uppercase tracking-wider">Milestones</label>
            <div className="space-y-1.5 mb-2">
              {(form.milestones || []).map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button onClick={() => toggleMilestone(i)}
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${m.completed ? "bg-green-700 border-green-700" : "border-gray-600"}`}>
                    {m.completed && <Check size={9} className="text-white" />}
                  </button>
                  <span className={`text-xs ${m.completed ? "line-through text-gray-600" : "text-gray-300"}`}>{m.title}</span>
                  {m.date && <span className="text-gray-700 text-xs ml-auto">{m.date}</span>}
                  <button onClick={() => setForm(f => ({ ...f, milestones: f.milestones.filter((_, j) => j !== i) }))}
                    className="text-gray-700 hover:text-red-500 transition-colors"><X size={10} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addMilestone()}
                placeholder="Add milestone…"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none" />
              <button onClick={addMilestone} className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold">Add</button>
            </div>
          </div>

          {/* Issues */}
          <div>
            <label className="text-gray-500 text-xs mb-2 block font-bold uppercase tracking-wider">Issues / Blockers</label>
            <div className="space-y-1.5 mb-2">
              {(form.issues || []).map((issue, i) => (
                <div key={issue.id} className="flex items-center gap-2 bg-red-950/20 border border-red-900/30 rounded-lg px-3 py-2">
                  <AlertTriangle size={10} className={issue.resolved ? "text-gray-600" : "text-red-400"} />
                  <span className={`text-xs flex-1 ${issue.resolved ? "line-through text-gray-600" : "text-red-300"}`}>{issue.description}</span>
                  <button onClick={() => setForm(f => ({ ...f, issues: f.issues.map((x, j) => j === i ? { ...x, resolved: !x.resolved } : x) }))}
                    className="text-xs text-gray-600 hover:text-green-400">{issue.resolved ? "Reopen" : "Resolve"}</button>
                  <button onClick={() => setForm(f => ({ ...f, issues: f.issues.filter((_, j) => j !== i) }))}
                    className="text-gray-700 hover:text-red-500"><X size={10} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newIssue} onChange={e => setNewIssue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addIssue()}
                placeholder="Describe issue or blocker…"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none" />
              <button onClick={addIssue} className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800/60 text-red-300 text-xs font-bold border border-red-800">Flag</button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <button onClick={handleSave} disabled={saving || !form.invention_name || !form.user_email}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-sm disabled:opacity-50 transition-all">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── STATS BAR ─────────────────────────────────────────────────────────────────
function StatsBar({ projects }) {
  const total = projects.length;
  const completed = projects.filter(p => p.status === "Completed").length;
  const issues = projects.filter(p => p.status === "Issue Flagged" || (p.issues || []).some(i => !i.resolved)).length;
  const inProgress = projects.filter(p => ["Assembly in Progress", "Wiring & Connections", "Testing", "Calibration"].includes(p.status)).length;
  const avgProgress = total > 0 ? Math.round(projects.reduce((s, p) => s + (p.progress_percent || 0), 0) / total) : 0;
  const uniqueUsers = new Set(projects.map(p => p.user_email)).size;

  return (
    <div className="flex items-center gap-5 px-5 py-3 border-b border-gray-800/60 overflow-x-auto bg-gray-950">
      {[
        { label: "Total Projects", value: total, color: "text-gray-300" },
        { label: "Completed", value: completed, color: "text-green-400" },
        { label: "In Progress", value: inProgress, color: "text-blue-400" },
        { label: "Issues", value: issues, color: "text-red-400" },
        { label: "Avg Progress", value: `${avgProgress}%`, color: "text-yellow-400" },
        { label: "Active Users", value: uniqueUsers, color: "text-purple-400" },
      ].map(s => (
        <div key={s.label} className="flex-shrink-0">
          <p className={`font-black text-base ${s.color}`}>{s.value}</p>
          <p className="text-gray-600 text-xs">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function InventionBuildTracker() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [modalProject, setModalProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterUser, setFilterUser] = useState("");
  const [filterInvention, setFilterInvention] = useState("");
  const [viewMode, setViewMode] = useState("kanban"); // kanban | list

  useEffect(() => { init(); }, []);

  const init = async () => {
    const me = await base44.auth.me();
    setUser(me);
    if (me?.role === "admin") {
      const data = await base44.entities.InventionBuildProject.list("-updated_date", 200);
      setProjects(data);
    }
    setLoading(false);
  };

  const handleSave = async (form) => {
    if (form.id) {
      const updated = await base44.entities.InventionBuildProject.update(form.id, form);
      setProjects(prev => prev.map(p => p.id === form.id ? updated : p));
    } else {
      const created = await base44.entities.InventionBuildProject.create(form);
      setProjects(prev => [created, ...prev]);
    }
    setShowModal(false);
    setModalProject(null);
  };

  const handleDelete = async (id) => {
    await base44.entities.InventionBuildProject.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleStatusChange = async (id, status) => {
    await base44.entities.InventionBuildProject.update(id, { status });
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const filtered = projects.filter(p =>
    (!filterUser || p.user_email.toLowerCase().includes(filterUser.toLowerCase()) || (p.user_name || "").toLowerCase().includes(filterUser.toLowerCase())) &&
    (!filterInvention || p.invention_name === filterInvention)
  );

  const uniqueUsers = [...new Set(projects.map(p => p.user_email))];

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={28} />
    </div>
  );

  if (user?.role !== "admin") return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center p-8">
      <Flag size={48} className="text-gray-700 mb-4" />
      <h1 className="text-white font-black text-2xl mb-2">Admin Access Required</h1>
      <p className="text-gray-500 text-sm mb-6">The Build Tracker is restricted to admin accounts.</p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm">← Back</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base tracking-tight flex items-center gap-2">
              <BarChart3 size={16} className="text-yellow-400" /> Invention Build Tracker
            </h1>
            <p className="text-gray-500 text-xs">Monitor build progress per user & device</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg p-0.5 gap-0.5">
            <button onClick={() => setViewMode("kanban")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === "kanban" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>
              Kanban
            </button>
            <button onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === "list" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>
              List
            </button>
          </div>
          <button onClick={() => { setModalProject(null); setShowModal(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300 text-xs font-bold transition-all">
            <Plus size={12} /> Add Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsBar projects={projects} />

      {/* Filters */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-800/60 bg-gray-950">
        <Filter size={12} className="text-gray-600 flex-shrink-0" />
        <input value={filterUser} onChange={e => setFilterUser(e.target.value)} placeholder="Filter by user…"
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs w-44 focus:outline-none focus:border-yellow-600 placeholder-gray-600" />
        <select value={filterInvention} onChange={e => setFilterInvention(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-yellow-600">
          <option value="">All inventions</option>
          {INVENTIONS.map(i => <option key={i}>{i}</option>)}
        </select>
        {(filterUser || filterInvention) && (
          <button onClick={() => { setFilterUser(""); setFilterInvention(""); }}
            className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1">
            <X size={10} /> Clear
          </button>
        )}
        <span className="text-gray-700 text-xs ml-auto">{filtered.length} projects</span>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === "kanban" && (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-3 p-4 h-full" style={{ minWidth: `${STATUSES.length * 220}px` }}>
            {STATUSES.map(status => {
              const cols = filtered.filter(p => p.status === status.id);
              return (
                <div key={status.id} className="flex flex-col w-52 flex-shrink-0">
                  {/* Column header */}
                  <div className={`rounded-xl px-3 py-2.5 mb-2 border ${status.bg} ${status.border}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: status.color }}>{status.icon}</span>
                        <span className="text-white font-bold text-xs">{status.label}</span>
                      </div>
                      <span className="text-gray-500 text-xs font-bold">{cols.length}</span>
                    </div>
                  </div>
                  {/* Cards */}
                  <div className="flex-1 space-y-2 min-h-16">
                    {cols.map(p => (
                      <ProjectCard key={p.id} project={p}
                        onEdit={proj => { setModalProject(proj); setShowModal(true); }}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                    {cols.length === 0 && (
                      <div className="border border-dashed border-gray-800 rounded-xl p-4 text-center">
                        <p className="text-gray-800 text-xs">No projects</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/40">
                  {["Invention", "User", "Status", "Priority", "Progress", "Target", "Issues", ""].map(h => (
                    <th key={h} className="text-left text-gray-500 font-bold px-4 py-3 uppercase tracking-wider text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-gray-700 py-8">No projects yet. Click "Add Project" to start tracking.</td></tr>
                )}
                {filtered.map(p => {
                  const status = STATUSES.find(s => s.id === p.status) || STATUSES[0];
                  const pri = PRIORITY[p.priority] || PRIORITY.medium;
                  const openIssues = (p.issues || []).filter(i => !i.resolved).length;
                  return (
                    <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{p.invention_name}</td>
                      <td className="px-4 py-3 text-gray-400">{p.user_name || p.user_email}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 font-semibold" style={{ color: status.color }}>
                          {status.icon} {status.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-1.5 py-0.5 rounded border text-xs font-black ${pri.bg} ${pri.color}`}>{pri.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${p.progress_percent || 0}%`, backgroundColor: status.color }} />
                          </div>
                          <span className="text-gray-400">{p.progress_percent || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.target_date || "—"}</td>
                      <td className="px-4 py-3">
                        {openIssues > 0 ? (
                          <span className="flex items-center gap-1 text-red-400 font-bold">
                            <AlertTriangle size={10} /> {openIssues}
                          </span>
                        ) : <span className="text-gray-700">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setModalProject(p); setShowModal(true); }}
                            className="text-gray-600 hover:text-gray-300"><Edit3 size={12} /></button>
                          <button onClick={() => handleDelete(p.id)}
                            className="text-gray-700 hover:text-red-500"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectModal
          project={modalProject}
          onClose={() => { setShowModal(false); setModalProject(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}