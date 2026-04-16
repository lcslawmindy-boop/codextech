import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Target, Loader2, ChevronRight, Calendar, DollarSign, FileText, Zap, Copy, CheckCircle2, Download } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

const AGENCIES = ["DoD", "DARPA", "NIH", "DOE", "NSF", "NASA", "DHS", "USAF", "Army", "Navy"];
const PHASES = ["Phase I ($50K–$250K)", "Phase II ($750K–$2M)", "Phase III (commercialization)"];

const SAMPLE_SOLICITATIONS = [
  { id: "sol1", agency: "DARPA", title: "Bioelectromagnetic Interfaces for Neural Communication", topic: "BIO-24-01", deadline: "2026-06-15", phase: "Phase I ($50K–$250K)", fit_domains: ["Bioelectromagnetics", "Scalar EM"], award: "$250,000", desc: "Novel electromagnetic interfaces for non-invasive neural-electronic coupling in defense and medical applications." },
  { id: "sol2", agency: "DOE", title: "Advanced Energy Conversion and Storage Technologies", topic: "DE-FOA-0003112", deadline: "2026-07-30", phase: "Phase II ($750K–$2M)", fit_domains: ["Vacuum Energy", "Clean Energy"], award: "$1,500,000", desc: "Breakthrough energy conversion devices with COP > 1.0 under controlled laboratory conditions." },
  { id: "sol3", agency: "Army", title: "Novel Scalar EM Sensing for Electronic Warfare", topic: "W911NF-26-S-0004", deadline: "2026-05-28", phase: "Phase I ($50K–$250K)", fit_domains: ["Scalar EM", "Defense Tech"], award: "$200,000", desc: "Detection and characterization of scalar electromagnetic signatures for situational awareness." },
  { id: "sol4", agency: "NIH", title: "Non-Thermal EM Biofield Diagnostics", topic: "SBIR-26-NIH-BF01", deadline: "2026-08-15", phase: "Phase I ($50K–$250K)", fit_domains: ["Bioelectromagnetics", "Biotech / Pharma"], award: "$225,000", desc: "Low-frequency EM field measurement devices for non-invasive biofield state assessment." },
  { id: "sol5", agency: "NSF", title: "AI-Assisted Intellectual Property Generation Systems", topic: "NSF-SBIR-26-AI", deadline: "2026-09-01", phase: "Phase II ($750K–$2M)", fit_domains: ["AI / Software"], award: "$750,000", desc: "Automated systems that reduce the cost and time of invention disclosure, patent drafting, and IP commercialization." },
];

function daysTil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function urgencyColor(days) {
  if (days < 30) return "#ef4444";
  if (days < 60) return "#f59e0b";
  return "#22c55e";
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-500 hover:text-gray-300 text-xs transition-all">
      {copied ? <CheckCircle2 size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function exportProposalPDF(sol, proposal, invention) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 18, cW = W - M * 2;
  let y = 20;

  doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 5, "F");

  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
  doc.text("SBIR/STTR Grant Proposal", M, 24);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text(`${sol.agency} · ${sol.topic} · ${sol.title}`, M, 31);
  doc.text(`Generated: ${new Date().toLocaleDateString()} · ZARP IP Platform`, M, 37);
  y = 48;

  const sections = [
    ["TECHNICAL ABSTRACT", proposal.technical_abstract],
    ["IDENTIFICATION OF ANTICIPATED RESULTS", proposal.anticipated_results],
    ["TECHNICAL OBJECTIVES", proposal.technical_objectives],
    ["WORK PLAN", proposal.work_plan],
    ["COMMERCIAL APPLICATIONS", proposal.commercial_applications],
    ["COMPANY / TEAM QUALIFICATIONS", proposal.qualifications],
    ["BUDGET JUSTIFICATION", proposal.budget_justification],
  ];

  sections.forEach(([title, content]) => {
    if (!content) return;
    if (y > 260) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(212, 175, 55);
    doc.text(title, M, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(190, 200, 220);
    const lines = doc.splitTextToSize(content, cW);
    lines.forEach(line => {
      if (y > 278) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
      doc.text(line, M, y); y += 5.5;
    });
    y += 5;
  });

  doc.save(`SBIR_Proposal_${sol.agency}_${Date.now()}.pdf`);
}

export default function SBIRPipeline() {
  const [invention, setInvention] = useState({ title: "", description: "", domain: "", team_background: "" });
  const [matched, setMatched] = useState(null);
  const [matching, setMatching] = useState(false);
  const [selectedSol, setSelectedSol] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  const runMatch = async () => {
    if (!invention.title || !invention.description) return;
    setMatching(true);
    setMatched(null);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an SBIR/STTR grant matching expert. Given this invention:
Title: ${invention.title}
Description: ${invention.description}
Domain: ${invention.domain}

And these open solicitations:
${SAMPLE_SOLICITATIONS.map(s => `- ID:${s.id} Agency:${s.agency} Title:"${s.title}" Topic:${s.topic} Desc:"${s.desc}"`).join("\n")}

Return a JSON with:
- ranked_ids: array of solicitation IDs ranked best to worst fit (all 5)
- fit_scores: object mapping id to integer 0-100
- fit_reasons: object mapping id to 1-sentence explanation`,
      response_json_schema: {
        type: "object",
        properties: {
          ranked_ids: { type: "array", items: { type: "string" } },
          fit_scores: { type: "object" },
          fit_reasons: { type: "object" },
        }
      }
    });

    setMatched(res);
    setMatching(false);
  };

  const generateProposal = async (sol) => {
    setSelectedSol(sol);
    setGenerating(true);
    setProposal(null);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert SBIR grant writer. Generate a complete, government-level SBIR proposal.

INVENTION:
Title: ${invention.title}
Description: ${invention.description}
Domain: ${invention.domain}
Team: ${invention.team_background || "Experienced R&D team"}

SOLICITATION:
Agency: ${sol.agency}
Topic: ${sol.topic}
Title: ${sol.title}
Description: ${sol.desc}
Award: ${sol.award}

Generate EXACTLY these 7 fields with complete, detailed text (200+ words each, no placeholders):

1. technical_abstract: 250-word overview of innovation, technical approach, why it matters to ${sol.agency}
2. anticipated_results: 4-5 concrete, measurable Phase I outcomes with metrics
3. technical_objectives: 4 numbered technical objectives with specific milestones (e.g., "Objective 1: Develop prototype core component by Month 3 to validate efficiency gains")
4. work_plan: Month-by-month Phase I plan (6 months) with deliverables for each phase
5. commercial_applications: 3 specific market opportunities with TAM estimates and timelines
6. qualifications: Team expertise, relevant publications/patents, prior award experience
7. budget_justification: Detailed budget breakdown including personnel ($X/hr), equipment, materials, overhead (typically 25-35% for small firms)

Be specific, technical, and quantifiable. Every section should be submission-ready.`,
        model: "claude_sonnet_4_6",
        response_json_schema: {
          type: "object",
          properties: {
            technical_abstract: { type: "string" },
            anticipated_results: { type: "string" },
            technical_objectives: { type: "string" },
            work_plan: { type: "string" },
            commercial_applications: { type: "string" },
            qualifications: { type: "string" },
            budget_justification: { type: "string" },
          }
        }
      });

      // Validate that we got actual content
      if (!res || Object.keys(res).length === 0) {
        throw new Error("Empty response from LLM - all fields missing");
      }

      const emptyFields = Object.entries(res).filter(([k, v]) => !v || v.trim().length === 0);
      if (emptyFields.length > 0) {
        console.warn("Warning: Empty fields detected:", emptyFields.map(e => e[0]));
      }

      setProposal(res);
    } catch (error) {
      console.error("Proposal generation failed:", error);
      alert(`Error generating proposal: ${error.message}\n\nPlease check your invention details and try again.`);
    } finally {
      setGenerating(false);
    }
  };

  const rankedSolicitations = matched
    ? [...SAMPLE_SOLICITATIONS].sort((a, b) => (matched.fit_scores?.[b.id] || 0) - (matched.fit_scores?.[a.id] || 0))
    : SAMPLE_SOLICITATIONS;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2"><Target size={14} className="text-green-400" /> SBIR/STTR Grant Pipeline</h1>
            <p className="text-gray-500 text-xs">AI matches inventions to open solicitations · auto-fills proposals · tracks deadlines</p>
          </div>
        </div>
        <button onClick={() => setShowExplainer(!showExplainer)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-blue-400 hover:bg-blue-950/20 transition-colors">
          ℹ️ What is SBIR?
        </button>
      </div>

      {/* SBIR Explainer Modal */}
      {showExplainer && (
        <div className="bg-blue-950/30 border-b border-blue-800/40 px-5 py-4 text-sm space-y-3 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h3 className="text-blue-300 font-bold mb-2">What is SBIR?</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                <strong>SBIR (Small Business Innovation Research)</strong> is a $4B annual federal funding program managed by agencies including DoD, NIH, DOE, NSF, DARPA, NASA, and DHS. It provides non-dilutive R&D funding for small companies (≤500 employees) to commercialize innovative technology.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                <strong>Phase I:</strong> $50K–$250K proof-of-concept (6 months)
              </p>
              <p className="text-gray-400 text-xs">
                <strong>Phase II:</strong> $750K–$2M development (2 years)
              </p>
              <p className="text-gray-400 text-xs">
                <strong>Phase III:</strong> Commercialization (agency or private market)
              </p>
            </div>
            <div>
              <h3 className="text-blue-300 font-bold mb-2">Is NSF an IP Generation System?</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                <strong>NSF SBIR</strong> (National Science Foundation) specifically funds AI, software, and "dual-use" R&D. Your ZARP platform—an AI-assisted IP generation system that automates invention disclosure, patent drafting, and commercialization—<strong>directly aligns with NSF SBIR Topic: "AI-Assisted Intellectual Property Generation Systems"</strong> (NSF-SBIR-26-AI, \\$750K Phase II).
              </p>
              <p className="text-gray-400 text-xs mt-2">
                This means: <strong>ZARP is a defensible SBIR project itself.</strong> You could pursue NSF SBIR to scale ZARP, not just use it to win other agencies' grants.
              </p>
            </div>
          </div>
          <p className="text-gray-500 text-xs italic">💡 Pro tip: Use ZARP to generate SBIR proposals for other inventors/companies, then use those wins to fund ZARP development via NSF SBIR.</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Invention Input */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Your Invention</p>
              {[
                { key: "title", label: "Invention Title *", placeholder: "e.g. Portable Prioré-class EM Therapy Device" },
                { key: "domain", label: "Technology Domain", placeholder: "e.g. Bioelectromagnetics, Vacuum Energy, Scalar EM" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-gray-500 text-xs mb-1">{f.label}</label>
                  <input value={invention[f.key]} onChange={e => setInvention(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-600 placeholder-gray-600" />
                </div>
              ))}
              {[
                { key: "description", label: "Technical Description *", placeholder: "Describe the core technology, mechanism, and novelty…", rows: 4 },
                { key: "team_background", label: "Team Background (optional)", placeholder: "e.g. PhD physicists, 2 prior SBIR awards, licensed IP…", rows: 2 },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-gray-500 text-xs mb-1">{f.label}</label>
                  <textarea value={invention[f.key]} onChange={e => setInvention(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} rows={f.rows}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-600 placeholder-gray-600 resize-none" />
                </div>
              ))}
              <button onClick={runMatch} disabled={matching || !invention.title || !invention.description}
                className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white font-black text-sm flex items-center justify-center gap-2 transition-all">
                {matching ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {matching ? "Matching to Open Solicitations…" : "Match to SBIR Solicitations"}
              </button>
            </div>

            {/* Deadline tracker */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Upcoming Deadlines</p>
              <div className="space-y-2">
                {[...SAMPLE_SOLICITATIONS].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).map(s => {
                  const days = daysTil(s.deadline);
                  const color = urgencyColor(days);
                  return (
                    <div key={s.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: color + "20", color }}>{s.agency}</span>
                        <p className="text-gray-400 text-xs truncate">{s.title.slice(0, 36)}…</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <p className="text-xs font-bold" style={{ color }}>{days}d</p>
                        <Calendar size={11} style={{ color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Matched Solicitations */}
          <div className="space-y-3">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
              {matched ? "AI-Ranked Solicitations" : "Open Solicitations"} ({SAMPLE_SOLICITATIONS.length})
            </p>
            {rankedSolicitations.map(s => {
              const score = matched?.fit_scores?.[s.id];
              const reason = matched?.fit_reasons?.[s.id];
              const days = daysTil(s.deadline);
              const urgColor = urgencyColor(days);
              return (
                <div key={s.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-black px-2 py-0.5 rounded bg-green-900/30 border border-green-800/40 text-green-400">{s.agency}</span>
                        <span className="text-gray-500 text-xs">{s.topic}</span>
                        <span className="text-xs font-bold" style={{ color: urgColor }}>{days}d left</span>
                      </div>
                      <p className="text-white font-bold text-sm leading-snug">{s.title}</p>
                    </div>
                    {score !== undefined && (
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-lg" style={{ color: score > 70 ? "#22c55e" : score > 40 ? "#f59e0b" : "#6b7280" }}>{score}%</p>
                        <p className="text-gray-600 text-xs">fit</p>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mb-2">{s.desc}</p>
                  {reason && <p className="text-green-300 text-xs italic mb-2">AI: {reason}</p>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 text-xs font-bold">{s.award}</span>
                      <span className="text-gray-600 text-xs">{s.phase}</span>
                    </div>
                    <button onClick={() => generateProposal(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-700 hover:bg-green-600 text-white text-xs font-black transition-all">
                      <FileText size={11} /> Generate Proposal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generated Proposal */}
        {(generating || proposal) && selectedSol && (
          <div className="mt-6 bg-gray-900 border border-green-800/40 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-green-950/20">
              <div>
                <p className="text-green-400 text-xs font-black uppercase tracking-widest">Generated SBIR Proposal</p>
                <p className="text-gray-400 text-xs">{selectedSol.agency} · {selectedSol.topic} · {selectedSol.award}</p>
              </div>
              {proposal && (
                <button onClick={() => exportProposalPDF(selectedSol, proposal, invention)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-800 hover:bg-green-700 text-white text-xs font-black transition-all">
                  <Download size={12} /> Export PDF
                </button>
              )}
            </div>
            {generating ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-green-400 mr-3" />
                <span className="text-gray-400">Generating submission-ready proposal with Claude Sonnet…</span>
              </div>
            ) : (
              <div className="p-5 space-y-5">
                {[
                  { key: "technical_abstract", label: "Technical Abstract" },
                  { key: "anticipated_results", label: "Anticipated Results" },
                  { key: "technical_objectives", label: "Technical Objectives" },
                  { key: "work_plan", label: "Work Plan" },
                  { key: "commercial_applications", label: "Commercial Applications" },
                  { key: "qualifications", label: "Team Qualifications" },
                  { key: "budget_justification", label: "Budget Justification" },
                ].map(s => proposal[s.key] && (
                  <div key={s.key} className="border border-gray-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800/60 border-b border-gray-800">
                      <p className="text-green-400 text-xs font-black uppercase tracking-wider">{s.label}</p>
                      <CopyBtn text={proposal[s.key]} />
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{proposal[s.key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}