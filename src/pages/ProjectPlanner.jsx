import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ProjectPlanner() {
  const [inventionConcept, setInventionConcept] = useState("");
  const [generating, setGenerating] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const generateMilestones = async () => {
    if (!inventionConcept.trim()) return;
    setGenerating(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an R&D project manager. Break down this invention concept into 5-8 actionable development milestones with sub-tasks.

Invention: "${inventionConcept}"

For each milestone, provide:
1. Milestone name (e.g., "Design Phase", "Prototype Development")
2. Description (1-2 sentences)
3. 3-4 specific sub-tasks with brief descriptions
4. Estimated duration (in weeks)
5. Key deliverables

Format your response as a JSON array like this:
[
  {
    "name": "Phase 1: Research & Design",
    "description": "Conduct literature review and create technical specifications",
    "duration_weeks": 4,
    "deliverables": ["Literature review report", "Technical specifications document"],
    "tasks": [
      { "title": "Literature review", "description": "Survey prior art and existing solutions" },
      { "title": "Create specs", "description": "Define technical requirements and parameters" }
    ]
  }
]

Return ONLY valid JSON, no markdown code blocks or extra text.`,
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
                  tasks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (response.data?.milestones) {
        setMilestones(response.data.milestones);
        setSelectedMilestone(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating milestones. Try again.");
    }
    setGenerating(false);
  };

  const saveMilestones = async () => {
    if (milestones.length === 0) return;
    setSaveStatus("saving");

    try {
      const projects = [];
      let weekOffset = 0;

      for (const milestone of milestones) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + weekOffset * 7);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + (weekOffset + milestone.duration_weeks) * 7);

        const project = await base44.entities.InventionBuildProject.create({
          invention_name: inventionConcept,
          user_email: (await base44.auth.me()).email,
          user_name: (await base44.auth.me()).full_name,
          status: "Parts Ordered",
          priority: "high",
          progress_percent: 0,
          notes: `${milestone.name}: ${milestone.description}`,
          started_date: startDate.toISOString(),
          target_date: targetDate.toISOString(),
          milestones: [
            {
              title: milestone.name,
              completed: false,
              date: targetDate.toISOString()
            }
          ],
          parts_list: milestone.deliverables.map(d => ({
            name: d,
            ordered: false,
            received: false,
            cost: "TBD"
          }))
        });

        projects.push(project);
        weekOffset += milestone.duration_weeks;
      }

      setSaveStatus("success");
      setTimeout(() => {
        setMilestones([]);
        setInventionConcept("");
        setSaveStatus(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/ai-os" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div>
            <h1 className="text-white font-black text-lg tracking-tight">AI Project Planner</h1>
            <p className="text-slate-400 text-xs">Break down inventions into development milestones</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Input Section */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
            <h2 className="text-white font-black text-lg mb-4">Define Your Invention</h2>
            <textarea value={inventionConcept} onChange={e => setInventionConcept(e.target.value)}
              placeholder="Describe your invention concept in detail. Include what it does, the problem it solves, and key technical features..."
              className="w-full h-32 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 resize-none" />
            <button onClick={generateMilestones} disabled={!inventionConcept.trim() || generating}
              className="mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:opacity-50 transition-all">
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Generating Milestones...
                </>
              ) : (
                <>
                  <Plus size={16} /> Generate Milestones with AI
                </>
              )}
            </button>
          </div>

          {/* Milestones List */}
          {milestones.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
              <h2 className="text-white font-black text-lg mb-4">Generated Milestones ({milestones.length})</h2>
              <div className="space-y-3 mb-6">
                {milestones.map((m, i) => (
                  <button key={i} onClick={() => setSelectedMilestone(selectedMilestone === i ? null : i)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      selectedMilestone === i
                        ? "bg-slate-800 border-cyan-500 text-white"
                        : "bg-slate-800/40 border-slate-700 hover:border-slate-600 text-slate-200"
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm">{m.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">{m.description}</p>
                      </div>
                      <span className="text-xs text-slate-500 ml-4 flex-shrink-0">{m.duration_weeks}w</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Milestone Details */}
              {selectedMilestone !== null && (
                <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-bold text-sm mb-3">{milestones[selectedMilestone].name}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Sub-Tasks</p>
                      <ul className="space-y-1">
                        {milestones[selectedMilestone].tasks.map((task, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-cyan-400 mt-0.5">→</span>
                            <div>
                              <p className="font-semibold">{task.title}</p>
                              <p className="text-slate-500">{task.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Deliverables</p>
                      <ul className="space-y-1">
                        {milestones[selectedMilestone].deliverables.map((del, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-green-500" /> {del}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button onClick={saveMilestones} disabled={saveStatus === "saving"}
                className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  saveStatus === "success"
                    ? "bg-green-700 text-white"
                    : saveStatus === "error"
                    ? "bg-red-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}>
                {saveStatus === "saving" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving Projects...
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <CheckCircle2 size={16} /> Projects Saved!
                  </>
                ) : saveStatus === "error" ? (
                  <>
                    <AlertCircle size={16} /> Error Saving
                  </>
                ) : (
                  "Save as InventionBuildProjects"
                )}
              </button>
            </div>
          )}

          {/* Info */}
          {milestones.length === 0 && !generating && (
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 text-center">
              <p className="text-slate-400 text-sm">Enter an invention concept above and click "Generate Milestones" to break it down into actionable development phases.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}