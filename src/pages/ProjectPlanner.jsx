import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Loader2, CheckCircle2, AlertCircle, Plus, Trash2,
  Target, Clock, ChevronDown, ChevronUp, Zap, GitBranch,
  Calendar, Flag, Edit3, Save, X, BarChart3, ListChecks, Sparkles
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const PRIORITY_COLORS = { low: "#22c55e", medium: "#f59e0b", high: "#ef4444", critical: "#a855f7" };
const STATUS_OPTIONS = ["Parts Ordered","Parts Received","Assembly in Progress","Wiring & Connections","Testing","Calibration","Completed","On Hold","Issue Flagged"];

// ── Sub-components ────────────────────────────────────────────────────────────

function MilestoneCard({ milestone, index, isSelected, onSelect, onTaskToggle }) {
  const completedTasks = (milestone.tasks || []).filter(t => t.completed).length;
  const totalTasks = (milestone.tasks || []).length;
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      className={`rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? "bg-slate-800 border-cyan-500/60 shadow-lg shadow-cyan-900/20"
          : "bg-slate-900 border-slate-800 hover:border-slate-600"
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                Phase {index + 1}
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock size={9} /> {milestone.duration_weeks}w
              </span>
            </div>
            <h3 className="text-white font-black text-sm leading-snug">{milestone.name}</h3>
            <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{milestone.description}</p>
          </div>
          {isSelected ? <ChevronUp size={14} className="text-cyan-400 flex-shrink-0 mt-1" /> : <ChevronDown size={14} className="text-slate-600 flex-shrink-0 mt-1" />}
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-slate-600">{completedTasks}/{totalTasks} tasks</span>
            <span className="text-[9px] font-bold text-cyan-400">{pct}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Expanded tasks */}
      {isSelected && (
        <div className="border-t border-slate-700 px-4 py-3 space-y-3">
          {/* Tasks */}
          {(milestone.tasks || []).length > 0 && (
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2">Sub-Tasks</p>
              <div className="space-y-1.5">
                {milestone.tasks.map((task, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); onTaskToggle(i); }}
                    className="w-full flex items-start gap-2.5 text-left group"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      task.completed
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-slate-600 group-hover:border-cyan-500"
                    }`}>
                      {task.completed && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${task.completed ? "line-through text-slate-600" : "text-slate-200"}`}>
                        {task.title}
                      </p>
                      <p className="text-slate-600 text-[10px] leading-snug">{task.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {(milestone.deliverables || []).length > 0 && (
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2">Deliverables</p>
              <div className="space-y-1">
                {milestone.deliverables.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <Flag size={9} className="text-green-400 flex-shrink-0" />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onStatusChange }) {
  const [editing, setEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(project.status);

  const save = async () => {
    await base44.entities.InventionBuildProject.update(project.id, { status: newStatus });
    onStatusChange();
    setEditing(false);
  };

  const pct = project.progress_percent || 0;
  const statusColor = {
    "Completed": "#22c55e", "Testing": "#06b6d4", "Assembly in Progress": "#f97316",
    "Issue Flagged": "#ef4444", "On Hold": "#6b7280",
  }[project.status] || "#a855f7";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-sm truncate">{project.invention_name}</p>
          <p className="text-slate-500 text-xs truncate mt-0.5">{project.notes?.slice(0, 60)}</p>
        </div>
        <button onClick={() => setEditing(e => !e)} className="text-slate-600 hover:text-slate-300">
          <Edit3 size={12} />
        </button>
      </div>

      {editing ? (
        <div className="flex gap-2 mb-3">
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={save} className="px-2 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white">
            <Save size={11} />
          </button>
          <button onClick={() => setEditing(false)} className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-400">
            <X size={11} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: statusColor + "20", color: statusColor }}>
            {project.status}
          </span>
          {project.target_date && (
            <span className="text-[10px] text-slate-600 flex items-center gap-1">
              <Calendar size={9} /> {new Date(project.target_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-slate-600">Progress</span>
          <span className="text-slate-400 font-bold">{pct}%</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: statusColor }} />
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ProjectPlanner() {
  const [inventionConcept, setInventionConcept] = useState("");
  const [generating, setGenerating] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState("generate"); // generate | projects

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const list = await base44.entities.InventionBuildProject.list("-created_date", 20);
      setProjects(list || []);
    } catch {}
    setLoadingProjects(false);
  };

  const generateMilestones = async () => {
    if (!inventionConcept.trim()) return;
    setGenerating(true);
    setMilestones([]);
    setSelectedMilestone(null);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert R&D project manager and engineer. Break this invention into 5-7 actionable development milestones.

Invention: "${inventionConcept}"

Return JSON with this exact structure:
{
  "milestones": [
    {
      "name": "Phase name (e.g. Research & Specification)",
      "description": "1-2 sentence description of what this phase accomplishes",
      "duration_weeks": 3,
      "deliverables": ["Deliverable 1", "Deliverable 2"],
      "tasks": [
        { "title": "Task title", "description": "Task description", "completed": false },
        { "title": "Task 2", "description": "Description", "completed": false }
      ]
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            milestones: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  duration_weeks: { type: "number" },
                  deliverables: { type: "array", items: { type: "string" } },
                  tasks: { type: "array", items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, completed: { type: "boolean" } } } }
                }
              }
            }
          }
        }
      });

      if (response?.milestones) setMilestones(response.milestones);
    } catch (err) {
      console.error(err);
    }
    setGenerating(false);
  };

  const toggleTask = (milestoneIdx, taskIdx) => {
    setMilestones(prev => prev.map((m, mi) =>
      mi !== milestoneIdx ? m : {
        ...m,
        tasks: m.tasks.map((t, ti) => ti === taskIdx ? { ...t, completed: !t.completed } : t)
      }
    ));
  };

  const saveMilestones = async () => {
    if (milestones.length === 0) return;
    setSaveStatus("saving");
    try {
      let weekOffset = 0;
      for (const milestone of milestones) {
        const started = new Date();
        started.setDate(started.getDate() + weekOffset * 7);
        const target = new Date();
        target.setDate(target.getDate() + (weekOffset + milestone.duration_weeks) * 7);

        await base44.entities.InventionBuildProject.create({
          invention_name: inventionConcept,
          user_email: "",
          status: "Parts Ordered",
          priority: "high",
          progress_percent: 0,
          notes: `${milestone.name}: ${milestone.description}`,
          started_date: started.toISOString(),
          target_date: target.toISOString(),
          milestones: [{ title: milestone.name, completed: false, date: target.toISOString() }],
          parts_list: milestone.deliverables.map(d => ({ name: d, ordered: false, received: false, cost: "TBD" }))
        });
        weekOffset += milestone.duration_weeks;
      }
      setSaveStatus("success");
      loadProjects();
      setTimeout(() => { setSaveStatus(null); setMilestones([]); setInventionConcept(""); }, 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  };

  const totalWeeks = milestones.reduce((s, m) => s + (m.duration_weeks || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/90 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/ai-os" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs">
            <ArrowLeft size={13} /> Back
          </Link>
          <div className="w-px h-4 bg-slate-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Target size={16} className="text-teal-400" /> AI Project Planner
            </h1>
            <p className="text-slate-500 text-[10px]">Generate R&D milestones · Track build projects</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button onClick={() => setActiveTab("generate")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "generate" ? "bg-teal-500/20 border border-teal-500/40 text-teal-300" : "text-slate-500 hover:text-slate-300"
            }`}>
            <Sparkles size={11} /> Generate
          </button>
          <button onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "projects" ? "bg-teal-500/20 border border-teal-500/40 text-teal-300" : "text-slate-500 hover:text-slate-300"
            }`}>
            <ListChecks size={11} /> Projects {projects.length > 0 && `(${projects.length})`}
          </button>
        </div>
      </div>

      <div className="flex-1 p-5 max-w-5xl mx-auto w-full">

        {activeTab === "generate" && (
          <div className="space-y-5">
            {/* Input */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-white font-black text-sm mb-1 flex items-center gap-2">
                <Zap size={15} className="text-yellow-400" /> Define Your Invention Concept
              </h2>
              <p className="text-slate-500 text-xs mb-4">AI will break it into actionable development phases with tasks, deliverables, and timelines.</p>
              <textarea
                value={inventionConcept}
                onChange={e => setInventionConcept(e.target.value)}
                placeholder="Describe your invention concept in detail. What does it do? What problem does it solve? What are the key technical components?"
                className="w-full h-28 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-teal-500 resize-none"
              />
              <button
                onClick={generateMilestones}
                disabled={!inventionConcept.trim() || generating}
                className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-sm font-black transition-all"
              >
                {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {generating ? "Generating Milestones..." : "Generate Milestones with AI"}
              </button>
            </div>

            {/* Milestones */}
            {milestones.length > 0 && (
              <>
                {/* Summary bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-5">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider">Phases</p>
                    <p className="text-white font-black text-2xl">{milestones.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider">Total Duration</p>
                    <p className="text-teal-400 font-black text-2xl">{totalWeeks}w</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider">Total Tasks</p>
                    <p className="text-cyan-400 font-black text-2xl">{milestones.reduce((s, m) => s + (m.tasks?.length || 0), 0)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider">Deliverables</p>
                    <p className="text-purple-400 font-black text-2xl">{milestones.reduce((s, m) => s + (m.deliverables?.length || 0), 0)}</p>
                  </div>
                  <div className="ml-auto self-center">
                    <button
                      onClick={saveMilestones}
                      disabled={saveStatus === "saving"}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-black text-sm text-white transition-all ${
                        saveStatus === "success" ? "bg-green-700"
                        : saveStatus === "error" ? "bg-red-700"
                        : "bg-emerald-600 hover:bg-emerald-500"
                      }`}
                    >
                      {saveStatus === "saving" ? <Loader2 size={14} className="animate-spin" /> :
                       saveStatus === "success" ? <CheckCircle2 size={14} /> :
                       saveStatus === "error" ? <AlertCircle size={14} /> : <Save size={14} />}
                      {saveStatus === "saving" ? "Saving..." :
                       saveStatus === "success" ? "Saved!" :
                       saveStatus === "error" ? "Error" : "Save as Build Projects"}
                    </button>
                  </div>
                </div>

                {/* Milestone cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {milestones.map((m, i) => (
                    <MilestoneCard
                      key={i}
                      milestone={m}
                      index={i}
                      isSelected={selectedMilestone === i}
                      onSelect={() => setSelectedMilestone(selectedMilestone === i ? null : i)}
                      onTaskToggle={ti => toggleTask(i, ti)}
                    />
                  ))}
                </div>
              </>
            )}

            {milestones.length === 0 && !generating && (
              <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-10 text-center">
                <GitBranch size={28} className="text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-semibold">Enter an invention concept above</p>
                <p className="text-slate-600 text-xs mt-1">AI will generate a structured R&D plan with milestones, tasks, and deliverables.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-black text-sm flex items-center gap-2">
                <BarChart3 size={15} className="text-teal-400" /> Active Build Projects
              </h2>
              <button onClick={loadProjects} className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1">
                <Loader2 size={11} className={loadingProjects ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            {loadingProjects ? (
              <div className="flex justify-center py-12">
                <Loader2 size={20} className="animate-spin text-teal-400" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 text-slate-600 text-sm">
                No projects yet. Generate milestones and save them to create projects.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.map(p => (
                  <ProjectCard key={p.id} project={p} onStatusChange={loadProjects} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}