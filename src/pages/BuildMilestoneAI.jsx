import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wrench, Plus, Zap, Loader2, CheckCircle2, AlertTriangle, Clock, ChevronDown, ChevronUp, X, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_OPTS = ["Parts Ordered", "Parts Received", "Assembly in Progress", "Wiring & Connections", "Testing", "Calibration", "Completed", "On Hold", "Issue Flagged"];
const STATUS_COLORS = {
  "Parts Ordered": "#6b7280", "Parts Received": "#f59e0b", "Assembly in Progress": "#6366f1",
  "Wiring & Connections": "#8b5cf6", "Testing": "#06b6d4", "Calibration": "#22c55e",
  "Completed": "#22c55e", "On Hold": "#ef4444", "Issue Flagged": "#ef4444",
};

function progressFromStatus(status) {
  const map = { "Parts Ordered": 10, "Parts Received": 20, "Assembly in Progress": 40, "Wiring & Connections": 55, "Testing": 70, "Calibration": 85, "Completed": 100, "On Hold": 0, "Issue Flagged": 0 };
  return map[status] || 0;
}

export default function BuildMilestoneAI() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({ invention_name: "", status: "Parts Ordered", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await base44.entities.InventionBuildProject.list("-updated_date", 20);
    setProjects(data);
    setLoading(false);
  };

  const createProject = async () => {
    if (!newForm.invention_name) return;
    setSaving(true);
    const user = await base44.auth.me();
    const project = await base44.entities.InventionBuildProject.create({
      ...newForm,
      user_email: user?.email || "",
      user_name: user?.full_name || "",
      progress_percent: progressFromStatus(newForm.status),
      milestones: [],
      issues: [],
    });
    setProjects(p => [project, ...p]);
    setSelected(project);
    setShowNewForm(false);
    setNewForm({ invention_name: "", status: "Parts Ordered", notes: "" });
    setSaving(false);
  };

  const updateStatus = async (status) => {
    if (!selected) return;
    const updated = await base44.entities.InventionBuildProject.update(selected.id, {
      status,
      progress_percent: progressFromStatus(status),
    });
    setProjects(p => p.map(x => x.id === selected.id ? { ...x, status, progress_percent: progressFromStatus(status) } : x));
    setSelected(s => ({ ...s, status, progress_percent: progressFromStatus(status) }));
  };

  const addNote = async () => {
    if (!newNote.trim() || !selected) return;
    const notes = (selected.notes || "") + `\n[${new Date().toLocaleString()}] ${newNote}`;
    await base44.entities.InventionBuildProject.update(selected.id, { notes });
    setSelected(s => ({ ...s, notes }));
    setProjects(p => p.map(x => x.id === selected.id ? { ...x, notes } : x));
    setNewNote("");
  };

  const runDiagnosis = async () => {
    if (!selected) return;
    setDiagnosing(true);
    setDiagnosis(null);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert hardware R&D engineer and invention build advisor. Analyze this build project and provide an AI diagnostic:

INVENTION: ${selected.invention_name}
CURRENT STATUS: ${selected.status}
PROGRESS: ${selected.progress_percent}%
BUILD NOTES / LOG:
${selected.notes || "No notes logged yet."}
ISSUES FLAGGED: ${JSON.stringify(selected.issues || [])}

Provide a JSON analysis with:
- risk_level: "low" | "medium" | "high" | "critical"
- failure_points: array of 3 likely failure points at this build stage
- component_substitutions: array of 2-3 suggested component substitutions or improvements
- completion_estimate: string (e.g. "3-4 weeks at current pace")
- next_action: string (most important next step, 1-2 sentences)
- encouragement: string (1 motivating sentence based on progress)`,
      response_json_schema: {
        type: "object",
        properties: {
          risk_level: { type: "string" },
          failure_points: { type: "array", items: { type: "string" } },
          component_substitutions: { type: "array", items: { type: "string" } },
          completion_estimate: { type: "string" },
          next_action: { type: "string" },
          encouragement: { type: "string" },
        }
      }
    });

    setDiagnosis(res);
    setDiagnosing(false);
  };

  const riskColors = { low: "#22c55e", medium: "#f59e0b", high: "#f97316", critical: "#ef4444" };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2"><Wrench size={14} className="text-orange-400" /> Build Milestone Tracker</h1>
            <p className="text-gray-500 text-xs">Log progress · AI flags failure points · suggests components · estimates completion</p>
          </div>
        </div>
        <button onClick={() => setShowNewForm(f => !f)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-700 hover:bg-orange-600 text-white text-xs font-black transition-all">
          <Plus size={12} /> New Project
        </button>
      </div>

      {showNewForm && (
        <div className="border-b border-gray-800 bg-gray-900/60 px-5 py-4">
          <div className="max-w-2xl mx-auto flex gap-3 flex-wrap items-end">
            <div className="flex-1 min-w-40">
              <label className="block text-gray-500 text-xs mb-1">Invention Name *</label>
              <input value={newForm.invention_name} onChange={e => setNewForm(p => ({ ...p, invention_name: e.target.value }))}
                placeholder="e.g. MEG Replication Build"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-600 placeholder-gray-600" />
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Starting Status</label>
              <select value={newForm.status} onChange={e => setNewForm(p => ({ ...p, status: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={createProject} disabled={saving || !newForm.invention_name}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-700 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-black transition-all">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              Create
            </button>
            <button onClick={() => setShowNewForm(false)} className="text-gray-600 hover:text-gray-400 px-2"><X size={14} /></button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Project List */}
          <div className="space-y-2">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Projects ({projects.length})</p>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-orange-400" /></div>
            ) : projects.length === 0 ? (
              <div className="border border-dashed border-gray-800 rounded-2xl p-8 text-center">
                <Wrench size={28} className="text-gray-800 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No projects yet. Create one above.</p>
              </div>
            ) : (
              projects.map(p => {
                const color = STATUS_COLORS[p.status] || "#6b7280";
                return (
                  <button key={p.id} onClick={() => { setSelected(p); setDiagnosis(null); }}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${selected?.id === p.id ? "border-orange-600 bg-orange-950/20" : "border-gray-800 bg-gray-900 hover:border-gray-700"}`}>
                    <p className="text-white font-black text-sm mb-1">{p.invention_name}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold capitalize" style={{ color }}>{p.status}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${p.progress_percent || 0}%`, backgroundColor: color }} />
                    </div>
                    <p className="text-gray-600 text-xs mt-1">{p.progress_percent || 0}% complete</p>
                  </button>
                );
              })
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2 space-y-4">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-800 rounded-2xl text-center px-8">
                <Wrench size={36} className="text-gray-800 mb-3" />
                <p className="text-gray-600 font-bold">Select a project to view details and run AI diagnosis</p>
              </div>
            ) : (
              <>
                {/* Project header */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-white font-black text-lg">{selected.invention_name}</h2>
                      <p className="text-gray-500 text-xs">{selected.user_name || selected.user_email}</p>
                    </div>
                    <button onClick={runDiagnosis} disabled={diagnosing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-700 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-black transition-all">
                      {diagnosing ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                      {diagnosing ? "Diagnosing…" : "AI Diagnosis"}
                    </button>
                  </div>

                  {/* Status selector */}
                  <div className="mb-3">
                    <label className="block text-gray-500 text-xs mb-1.5">Current Status</label>
                    <div className="flex flex-wrap gap-1.5">
                      {STATUS_OPTS.map(s => (
                        <button key={s} onClick={() => updateStatus(s)}
                          className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all"
                          style={{
                            backgroundColor: selected.status === s ? (STATUS_COLORS[s] + "25") : "transparent",
                            borderColor: selected.status === s ? STATUS_COLORS[s] : "#374151",
                            color: selected.status === s ? STATUS_COLORS[s] : "#6b7280",
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-black" style={{ color: STATUS_COLORS[selected.status] || "#6b7280" }}>{selected.progress_percent || 0}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${selected.progress_percent || 0}%`, backgroundColor: STATUS_COLORS[selected.status] || "#6b7280" }} />
                    </div>
                  </div>
                </div>

                {/* Build log */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Build Log</p>
                  <div className="bg-gray-800 rounded-xl p-3 max-h-36 overflow-y-auto mb-3 text-xs text-gray-400 font-mono whitespace-pre-wrap">
                    {selected.notes || "No notes logged yet. Add your first update below."}
                  </div>
                  <div className="flex gap-2">
                    <input value={newNote} onChange={e => setNewNote(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addNote()}
                      placeholder="Log an update, issue, or observation…"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-600 placeholder-gray-600" />
                    <button onClick={addNote} disabled={!newNote.trim()}
                      className="px-3 py-2 rounded-xl bg-orange-700 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-black transition-all">
                      Log
                    </button>
                  </div>
                </div>

                {/* AI Diagnosis results */}
                {diagnosis && (
                  <div className="bg-orange-950/20 border border-orange-800/40 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-orange-400 text-xs font-black uppercase tracking-widest">AI Build Diagnosis</p>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: (riskColors[diagnosis.risk_level] || "#888") + "20", color: riskColors[diagnosis.risk_level] || "#888" }}>
                        {diagnosis.risk_level} risk
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Likely Failure Points</p>
                        {(diagnosis.failure_points || []).map((f, i) => (
                          <div key={i} className="flex items-start gap-2 mb-1.5">
                            <AlertTriangle size={11} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-300 text-xs leading-relaxed">{f}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">Component Substitutions</p>
                        {(diagnosis.component_substitutions || []).map((c, i) => (
                          <div key={i} className="flex items-start gap-2 mb-1.5">
                            <TrendingUp size={11} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-300 text-xs leading-relaxed">{c}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900 rounded-xl p-3">
                        <p className="text-gray-500 text-xs font-bold mb-1">Completion Estimate</p>
                        <p className="text-white font-black text-sm flex items-center gap-1.5"><Clock size={12} className="text-orange-400" />{diagnosis.completion_estimate}</p>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-3">
                        <p className="text-gray-500 text-xs font-bold mb-1">Next Action</p>
                        <p className="text-gray-300 text-xs leading-relaxed">{diagnosis.next_action}</p>
                      </div>
                    </div>

                    {diagnosis.encouragement && (
                      <div className="bg-green-950/30 border border-green-800/40 rounded-xl px-4 py-2.5">
                        <p className="text-green-300 text-sm italic">⚡ {diagnosis.encouragement}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}