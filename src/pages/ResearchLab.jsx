import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, FlaskConical, Activity, CheckCircle2, PauseCircle, BookOpen, Pencil, Trash2, Play, Square, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ExperimentForm from "@/components/research/ExperimentForm";
import SensorLogPanel from "@/components/research/SensorLogPanel";
import ExperimentPdfGenerator from "@/components/research/ExperimentPdfGenerator";

const STATUS_META = {
  planned:   { label: "Planned",   icon: BookOpen,    color: "text-gray-400",   bg: "bg-gray-800 border-gray-700" },
  active:    { label: "Active",    icon: Activity,    color: "text-green-400",  bg: "bg-green-950/30 border-green-800" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-cyan-400",  bg: "bg-cyan-950/30 border-cyan-800" },
  paused:    { label: "Paused",    icon: PauseCircle, color: "text-yellow-400", bg: "bg-yellow-950/30 border-yellow-800" },
};

export default function ResearchLab() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [selectedExp, setSelectedExp] = useState(null);
  const [activeTab, setActiveTab] = useState("data"); // "data" | "details" | "conclusion"
  const [filterStatus, setFilterStatus] = useState("all");
  const [savingConclusion, setSavingConclusion] = useState(false);
  const [conclusionText, setConclusionText] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.ResearchExperiment.list("-created_date", 100);
    setExperiments(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (selectedExp) setConclusionText(selectedExp.conclusion || "");
  }, [selectedExp?.id]);

  const handleSave = async (form) => {
    if (editingExp) {
      const updated = await base44.entities.ResearchExperiment.update(editingExp.id, form);
      setExperiments(es => es.map(e => e.id === editingExp.id ? { ...e, ...form } : e));
      if (selectedExp?.id === editingExp.id) setSelectedExp({ ...selectedExp, ...form });
    } else {
      const created = await base44.entities.ResearchExperiment.create(form);
      setExperiments(es => [created, ...es]);
      setSelectedExp(created);
    }
    setShowForm(false);
    setEditingExp(null);
  };

  const handleDelete = async (exp) => {
    if (!confirm(`Delete "${exp.title}"? All sensor readings will be lost.`)) return;
    await base44.entities.ResearchExperiment.delete(exp.id);
    setExperiments(es => es.filter(e => e.id !== exp.id));
    if (selectedExp?.id === exp.id) setSelectedExp(null);
  };

  const handleStatusChange = async (exp, status) => {
    const updates = { status };
    if (status === "active" && !exp.started_at) updates.started_at = new Date().toISOString();
    if (status === "completed") updates.completed_at = new Date().toISOString();
    await base44.entities.ResearchExperiment.update(exp.id, updates);
    const updated = { ...exp, ...updates };
    setExperiments(es => es.map(e => e.id === exp.id ? updated : e));
    if (selectedExp?.id === exp.id) setSelectedExp(updated);
  };

  const saveConclusion = async () => {
    setSavingConclusion(true);
    await base44.entities.ResearchExperiment.update(selectedExp.id, {
      conclusion: conclusionText,
      peer_review_ready: selectedExp.peer_review_ready,
    });
    setExperiments(es => es.map(e => e.id === selectedExp.id ? { ...e, conclusion: conclusionText } : e));
    setSelectedExp(s => ({ ...s, conclusion: conclusionText }));
    setSavingConclusion(false);
  };

  const togglePeerReview = async () => {
    const next = !selectedExp.peer_review_ready;
    await base44.entities.ResearchExperiment.update(selectedExp.id, { peer_review_ready: next });
    setExperiments(es => es.map(e => e.id === selectedExp.id ? { ...e, peer_review_ready: next } : e));
    setSelectedExp(s => ({ ...s, peer_review_ready: next }));
  };

  const filtered = experiments.filter(e => filterStatus === "all" || e.status === filterStatus);

  const counts = {
    all: experiments.length,
    active: experiments.filter(e => e.status === "active").length,
    completed: experiments.filter(e => e.status === "completed").length,
    planned: experiments.filter(e => e.status === "planned").length,
    paused: experiments.filter(e => e.status === "paused").length,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-2">
            <FlaskConical size={18} className="text-cyan-400" />
            <div>
              <h1 className="text-white font-black text-base tracking-tight">Research Lab</h1>
              <p className="text-gray-500 text-xs">Track experiments · Log sensor data · Generate PDF reports</p>
            </div>
          </div>
        </div>
        <button onClick={() => { setEditingExp(null); setShowForm(s => !s); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-all">
          <Plus size={14} /> New Experiment
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — experiment list */}
        <div className="w-72 flex-shrink-0 border-r border-gray-800 overflow-y-auto bg-gray-900/30 flex flex-col">
          {/* Status filter */}
          <div className="px-3 py-3 border-b border-gray-800 flex gap-1.5 flex-wrap">
            {["all", "active", "completed", "planned", "paused"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all capitalize ${filterStatus === s ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                {s} {counts[s] > 0 && <span className="ml-1 opacity-60">({counts[s]})</span>}
              </button>
            ))}
          </div>

          {/* New/Edit form inline in sidebar */}
          {showForm && (
            <div className="p-3 border-b border-gray-800">
              <ExperimentForm
                initial={editingExp}
                onSave={handleSave}
                onCancel={() => { setShowForm(false); setEditingExp(null); }}
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-gray-700 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-600 px-4">
              <FlaskConical size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No experiments yet.</p>
              <p className="text-xs mt-1">Click "New Experiment" to start.</p>
            </div>
          ) : (
            <div className="flex-1">
              {filtered.map(exp => {
                const meta = STATUS_META[exp.status] || STATUS_META.planned;
                const Icon = meta.icon;
                const isSelected = selectedExp?.id === exp.id;
                return (
                  <div key={exp.id}
                    onClick={() => { setSelectedExp(exp); setShowForm(false); setEditingExp(null); setActiveTab("data"); }}
                    className={`px-4 py-3 border-b border-gray-800/60 cursor-pointer transition-all ${isSelected ? "bg-gray-800/80 border-l-2 border-l-cyan-500" : "hover:bg-gray-800/30"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold leading-snug truncate ${isSelected ? "text-white" : "text-gray-300"}`}>{exp.title}</p>
                        <p className="text-gray-600 text-xs mt-0.5 truncate">{exp.invention_name}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Icon size={10} className={meta.color} />
                          <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                          {exp.peer_review_ready && (
                            <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-green-900/40 border border-green-800 text-green-400">Peer Review</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="flex-1 overflow-y-auto">
          {!selectedExp ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <FlaskConical size={40} className="text-gray-700 mb-4" />
              <p className="text-gray-500 text-lg font-semibold">Select an experiment</p>
              <p className="text-gray-700 text-sm mt-1 max-w-xs">Choose an experiment from the list or create a new one to start logging sensor data and generating reports.</p>
            </div>
          ) : (
            <div className="p-6 max-w-4xl mx-auto">
              {/* Experiment header */}
              <div className="flex items-start justify-between mb-6 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {(() => {
                      const meta = STATUS_META[selectedExp.status] || STATUS_META.planned;
                      const Icon = meta.icon;
                      return (
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color}`}>
                          <Icon size={10} /> {meta.label}
                        </span>
                      );
                    })()}
                    {selectedExp.peer_review_ready && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 border border-green-800 text-green-400 font-bold">✓ Peer Review Ready</span>
                    )}
                  </div>
                  <h2 className="text-white font-black text-2xl leading-snug">{selectedExp.title}</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Based on: <span className="text-cyan-400">{selectedExp.invention_name}</span></p>
                  {selectedExp.tags?.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      {selectedExp.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                  {/* Status transitions */}
                  {selectedExp.status === "planned" && (
                    <button onClick={() => handleStatusChange(selectedExp, "active")}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-all">
                      <Play size={12} /> Start
                    </button>
                  )}
                  {selectedExp.status === "active" && (
                    <>
                      <button onClick={() => handleStatusChange(selectedExp, "paused")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-700 hover:bg-yellow-600 text-white text-xs font-bold transition-all">
                        <PauseCircle size={12} /> Pause
                      </button>
                      <button onClick={() => handleStatusChange(selectedExp, "completed")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold transition-all">
                        <Square size={12} /> Complete
                      </button>
                    </>
                  )}
                  {selectedExp.status === "paused" && (
                    <button onClick={() => handleStatusChange(selectedExp, "active")}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-all">
                      <Play size={12} /> Resume
                    </button>
                  )}
                  <ExperimentPdfGenerator experiment={selectedExp} />
                  <button onClick={() => { setEditingExp(selectedExp); setShowForm(true); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-all">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(selectedExp)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400 text-xs font-bold transition-all border border-red-900/40">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-800 mb-6 gap-1">
                {[
                  { id: "data", label: "Sensor Data" },
                  { id: "details", label: "Experiment Details" },
                  { id: "conclusion", label: "Conclusions & Report" },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${activeTab === tab.id ? "border-cyan-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === "data" && (
                <SensorLogPanel experiment={selectedExp} />
              )}

              {activeTab === "details" && (
                <div className="space-y-4">
                  {selectedExp.hypothesis && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                      <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">Hypothesis / Research Question</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedExp.hypothesis}</p>
                    </div>
                  )}
                  {selectedExp.methodology && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                      <p className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">Methodology & Setup Notes</p>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedExp.methodology}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Sensor Type", value: selectedExp.sensor_type?.replace(/_/g, " ") },
                      { label: "Unit", value: selectedExp.sensor_unit || "—" },
                      { label: "Started", value: selectedExp.started_at ? new Date(selectedExp.started_at).toLocaleDateString() : "—" },
                      { label: "Completed", value: selectedExp.completed_at ? new Date(selectedExp.completed_at).toLocaleDateString() : "—" },
                    ].map(item => (
                      <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                        <p className="text-gray-600 text-xs mb-1">{item.label}</p>
                        <p className="text-white text-sm font-semibold capitalize">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "conclusion" && (
                <div className="space-y-5">
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <p className="text-green-400 font-bold text-xs uppercase tracking-wider mb-3">Conclusions & Findings</p>
                    <textarea
                      value={conclusionText}
                      onChange={e => setConclusionText(e.target.value)}
                      rows={8}
                      placeholder="Document your experimental findings, observations, and conclusions here. Include statistical analysis, anomalies, and comparison to theoretical predictions..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500 resize-none leading-relaxed"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={selectedExp.peer_review_ready || false}
                          onChange={togglePeerReview}
                          className="w-4 h-4 rounded accent-green-500" />
                        <span className="text-sm text-gray-400">Mark as ready for peer review</span>
                      </label>
                      <button onClick={saveConclusion} disabled={savingConclusion}
                        className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-bold disabled:opacity-50 transition-all">
                        {savingConclusion ? "Saving…" : "Save Conclusions"}
                      </button>
                    </div>
                  </div>

                  {/* Export */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <p className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2">Export Experimental Report</p>
                    <p className="text-gray-400 text-sm mb-4">Generate a formatted PDF report including hypothesis, methodology, all sensor readings, statistical summaries, conclusions, and research disclaimers — suitable for personal records or peer review submission.</p>
                    <ExperimentPdfGenerator experiment={selectedExp} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}