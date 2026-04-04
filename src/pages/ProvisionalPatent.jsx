import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, FileDown, Copy, Check, ChevronDown, ChevronUp, Edit3, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SECTIONS = [
  { key: "title", label: "Title of Invention" },
  { key: "crossReference", label: "Cross-Reference to Related Applications" },
  { key: "technicalField", label: "Technical Field" },
  { key: "background", label: "Background of the Invention" },
  { key: "summary", label: "Summary of the Invention" },
  { key: "briefDrawings", label: "Brief Description of the Drawings" },
  { key: "detailedDescription", label: "Detailed Description of the Invention" },
  { key: "claims", label: "Claims" },
  { key: "abstract", label: "Abstract" },
];

const SAMPLE_INVENTIONS = [
  {
    name: "Asymmetric Regauging MEG Device",
    category: "Energy / Utilities",
    description: "A motionless electromagnetic generator that extracts energy from the vacuum via asymmetric regauging of permanent magnet flux.",
    problem: "Conventional generators destroy the source dipole during each operational cycle, limiting COP to below 1.0.",
    solution: "Asymmetric nanocrystalline core switching gates the permanent magnet flux without back-EMF destruction of the source dipole.",
    specs: [
      { label: "Core Material", value: "Nanocrystalline VITROPERM 500F, 80% Fe, 20% Si/B" },
      { label: "Operating Frequency", value: "50 kHz switching frequency" },
      { label: "Output Power", value: "2.5 kW continuous" },
      { label: "COP", value: ">3.0 (independently measured)" },
      { label: "Input Power", value: "800W gate drive" },
    ],
    principles: ["Asymmetric Regauging", "O(3) B(3) Vacuum Field", "Heaviside Energy Flow", "Lorentz Symmetry Breaking"],
    marketSize: "$1.2T global energy market",
    ipValuation: "$8.5M",
    stage: "Prototype",
  },
];

function SectionEditor({ sectionKey, label, content, onEdit, editMode, onToggleEdit }) {
  const [copied, setCopied] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [collapsed, setCollapsed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    onEdit(sectionKey, localContent);
    onToggleEdit();
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-800/40 transition-colors border-b border-gray-800"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-3">
          {collapsed ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronUp size={14} className="text-gray-500" />}
          <span className="text-white font-bold text-sm">{label}</span>
          {sectionKey === "claims" && (
            <span className="text-xs px-2 py-0.5 rounded bg-yellow-900/40 border border-yellow-800 text-yellow-400 font-semibold">Legal Weight</span>
          )}
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <button onClick={handleCopy} className="text-gray-500 hover:text-white transition-colors p-1">
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          </button>
          <button onClick={onToggleEdit} className="text-gray-500 hover:text-blue-400 transition-colors p-1">
            <Edit3 size={13} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="px-5 py-4">
          {editMode ? (
            <div className="space-y-2">
              <textarea
                value={localContent}
                onChange={e => setLocalContent(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm font-mono leading-relaxed focus:outline-none focus:border-blue-600 resize-none"
                rows={Math.max(8, (localContent || "").split("\n").length + 2)}
              />
              <div className="flex gap-2">
                <button onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold">
                  <Save size={11} /> Save
                </button>
                <button onClick={onToggleEdit}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs hover:text-white">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <pre className="text-gray-300 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
              {content || <span className="text-gray-600 italic">— not yet generated —</span>}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProvisionalPatent() {
  const [step, setStep] = useState("input"); // input | generating | review
  const [inputMode, setInputMode] = useState("manual"); // manual | paste
  const [invention, setInvention] = useState({
    name: "", category: "", description: "", problem: "", solution: "",
    specs: [{ label: "", value: "" }], principles: [""], stage: "Concept",
  });
  const [pasteText, setPasteText] = useState("");
  const [draft, setDraft] = useState({});
  const [generating, setGenerating] = useState(false);
  const [editingSections, setEditingSections] = useState({});
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [progress, setProgress] = useState("");

  const toggleEdit = (key) => setEditingSections(e => ({ ...e, [key]: !e[key] }));
  const updateDraftSection = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const loadSample = () => {
    setInvention(SAMPLE_INVENTIONS[0]);
    setInputMode("manual");
  };

  const addSpec = () => setInvention(inv => ({ ...inv, specs: [...(inv.specs || []), { label: "", value: "" }] }));
  const updateSpec = (i, field, val) => setInvention(inv => {
    const specs = [...(inv.specs || [])];
    specs[i] = { ...specs[i], [field]: val };
    return { ...inv, specs };
  });
  const addPrinciple = () => setInvention(inv => ({ ...inv, principles: [...(inv.principles || []), ""] }));
  const updatePrinciple = (i, val) => setInvention(inv => {
    const principles = [...(inv.principles || [])];
    principles[i] = val;
    return { ...inv, principles };
  });

  const generateDraft = async () => {
    setGenerating(true);
    setStep("generating");
    setProgress("Analyzing invention disclosure...");

    const invData = inputMode === "paste"
      ? `Invention Disclosure (raw text): ${pasteText}`
      : `Invention Name: ${invention.name}
Category: ${invention.category}
Stage: ${invention.stage}
Description: ${invention.description}
Problem Solved: ${invention.problem}
Solution: ${invention.solution}
Technical Specifications: ${(invention.specs || []).map(s => `${s.label}: ${s.value}`).join("; ")}
Key Principles: ${(invention.principles || []).join(", ")}`;

    setProgress("Drafting USPTO provisional patent application...");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior USPTO patent attorney specializing in electromagnetic devices, energy technologies, and scalar field physics. Draft a complete US Provisional Patent Application (PPA) in strict USPTO format based on the following invention disclosure.

${invData}

Generate each section with full legal precision and technical depth. Write as a real patent application that could be filed directly with the USPTO under 35 USC 111(b). Use formal patent language throughout.

Return a JSON object with these exact keys:
- title: string (formal invention title, ≤500 chars, avoid tradenames)
- crossReference: string (paragraph stating "This application claims the benefit of..." or "No prior applications" if none)
- technicalField: string (1-2 sentences defining the technical field per USPTO convention)
- background: string (3-6 paragraphs: prior art, limitations, and why improvement needed; cite specific technical problems using formal patent language like "heretofore", "it would be desirable", etc.)
- summary: string (3-5 paragraphs: brief summary of invention aspects; "In one aspect...", "In another aspect..."; mention independent claim scope)
- briefDrawings: string (list FIG. 1 through FIG. 6+ with one-line descriptions of each figure showing the invention structure and operation)
- detailedDescription: string (full detailed description, 800-1200 words: preferred embodiments, alternative embodiments, materials, dimensions, operating parameters, element-by-element description referencing FIG. numbers; use element reference numerals like "(100)", "(102)" etc.)
- claims: string (20 claims: 3 independent + 17 dependent; Claim 1 = broadest independent; each claim on new line starting "1.", "2." etc.; independent claims use "comprising" not "consisting of"; proper antecedent basis; claim 20 = method claim)
- abstract: string (single paragraph, 150 words max, per USPTO rule 1.72(b); summarize the invention and its key advantage)`,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          crossReference: { type: "string" },
          technicalField: { type: "string" },
          background: { type: "string" },
          summary: { type: "string" },
          briefDrawings: { type: "string" },
          detailedDescription: { type: "string" },
          claims: { type: "string" },
          abstract: { type: "string" },
        }
      },
      model: "claude_sonnet_4_6",
    });

    setDraft(result);
    setProgress("");
    setGenerating(false);
    setStep("review");
  };

  const handleExport = async (type) => {
    setExporting(true);
    setExportType(type);
    const invName = draft.title || invention.name || "provisional-patent";
    const filename = invName.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 60);

    const res = await fetch(`/functions/exportPatentDoc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ draft, invention, format: type, filename }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${type === "pdf" ? "pdf" : "txt"}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
    setExportType(null);
  };

  const completedSections = SECTIONS.filter(s => draft[s.key]?.length > 20).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/inventor-forge" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Invention Forge</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">📋 Provisional Patent Drafter</h1>
            <p className="text-gray-500 text-xs">US Provisional Patent Application (35 USC 111(b)) · USPTO Format</p>
          </div>
        </div>
        {step === "review" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{completedSections}/{SECTIONS.length} sections</span>
            <button onClick={() => handleExport("pdf")} disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-60 transition-all">
              {exporting && exportType === "pdf" ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
              Export PDF
            </button>
            <button onClick={() => handleExport("txt")} disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-60 transition-all">
              {exporting && exportType === "txt" ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
              Export Text
            </button>
          </div>
        )}
      </div>

      {/* Step: Input */}
      {step === "input" && (
        <div className="max-w-3xl mx-auto w-full px-5 py-8 space-y-6">
          {/* USPTO disclaimer */}
          <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-2xl p-4">
            <p className="text-yellow-400 text-xs font-bold mb-1">⚖️ Legal Notice</p>
            <p className="text-yellow-200 text-xs leading-relaxed">This tool drafts a US Provisional Patent Application per 35 USC 111(b) and 37 CFR Part 1. A provisional application establishes a priority date but does not issue as a patent. You must file a nonprovisional within 12 months. Always review with a registered patent attorney before filing. This output is not legal advice.</p>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1">
            {["manual", "paste"].map(m => (
              <button key={m} onClick={() => setInputMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === m ? "bg-blue-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                {m === "manual" ? "📝 Manual Input" : "📋 Paste from Invention Forge"}
              </button>
            ))}
          </div>

          {inputMode === "paste" ? (
            <div className="space-y-3">
              <label className="text-white font-bold text-sm block">Paste Invention Details</label>
              <p className="text-gray-500 text-xs">Copy any invention description, spec sheet, or Invention Forge output and paste it here.</p>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder="Paste invention name, description, specs, technical principles, problem/solution, market data, etc. — the AI will extract and structure everything automatically."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-600 font-mono resize-none leading-relaxed"
                rows={14}
              />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold">Invention Disclosure</h2>
                <button onClick={loadSample} className="text-xs text-blue-400 hover:text-blue-300 underline">Load sample invention</button>
              </div>

              {/* Basic fields */}
              {[
                { key: "name", label: "Invention Name *", placeholder: "e.g. Asymmetric Regauging Electromagnetic Generator" },
                { key: "category", label: "Technology Category", placeholder: "e.g. Energy / Utilities, Medical Device, Communications" },
                { key: "stage", label: "Development Stage", placeholder: "Concept / Prototype / Patent-Ready" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-gray-400 text-xs font-semibold block mb-1">{f.label}</label>
                  <input
                    value={invention[f.key] || ""}
                    onChange={e => setInvention(inv => ({ ...inv, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600"
                  />
                </div>
              ))}

              {[
                { key: "description", label: "Invention Description *", rows: 4, placeholder: "Full description of what the invention is and does..." },
                { key: "problem", label: "Problem Being Solved *", rows: 3, placeholder: "What specific problem does this invention solve? What prior art is deficient?" },
                { key: "solution", label: "Technical Solution *", rows: 3, placeholder: "How does the invention solve the problem? What is the novel mechanism?" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-gray-400 text-xs font-semibold block mb-1">{f.label}</label>
                  <textarea
                    value={invention[f.key] || ""}
                    onChange={e => setInvention(inv => ({ ...inv, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    rows={f.rows}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 resize-none"
                  />
                </div>
              ))}

              {/* Specs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-400 text-xs font-semibold">Technical Specifications</label>
                  <button onClick={addSpec} className="text-xs text-blue-400 hover:text-blue-300">+ Add Spec</button>
                </div>
                <div className="space-y-2">
                  {(invention.specs || []).map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={spec.label} onChange={e => updateSpec(i, "label", e.target.value)}
                        placeholder="Parameter name"
                        className="w-1/3 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-600" />
                      <input value={spec.value} onChange={e => updateSpec(i, "value", e.target.value)}
                        placeholder="Value / description"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-600" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Principles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-400 text-xs font-semibold">Key Technical Principles (Bearden framework, prior art, etc.)</label>
                  <button onClick={addPrinciple} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
                </div>
                <div className="space-y-2">
                  {(invention.principles || []).map((p, i) => (
                    <input key={i} value={p} onChange={e => updatePrinciple(i, e.target.value)}
                      placeholder={`e.g. Asymmetric Regauging, O(3) B(3) Field, Phase Conjugate Mirror`}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-600" />
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={generateDraft}
            disabled={inputMode === "manual" ? !invention.name : !pasteText.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-black text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(100,100,255,0.3)]"
          >
            <Sparkles size={18} /> Draft Provisional Patent Application
          </button>
          <p className="text-center text-gray-600 text-xs">Powered by Claude Sonnet · Generates all 9 USPTO sections · ~30 seconds</p>
        </div>
      )}

      {/* Step: Generating */}
      {step === "generating" && (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 mx-auto border-4 border-blue-800 border-t-blue-400 rounded-full animate-spin" />
            <h2 className="text-white font-black text-xl">Drafting Patent Application</h2>
            <p className="text-gray-400 text-sm">{progress}</p>
            <div className="space-y-1 text-xs text-gray-600">
              {SECTIONS.map(s => (
                <p key={s.key}>{draft[s.key] ? "✓" : "·"} {s.label}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step: Review */}
      {step === "review" && (
        <div className="max-w-4xl mx-auto w-full px-5 py-6 space-y-4">
          {/* USPTO filing header */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">US Provisional Patent Application</p>
                <h2 className="text-white font-black text-xl leading-tight">{draft.title || invention.name}</h2>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-950/50 border border-blue-800 text-blue-300">35 USC 111(b)</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-green-950/50 border border-green-800 text-green-300">37 CFR Part 1</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-950/50 border border-purple-800 text-purple-300">{completedSections}/{SECTIONS.length} sections complete</span>
                  <span className="text-xs text-gray-500">Filed: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>
              <button onClick={() => setStep("input")} className="text-xs text-gray-500 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg">← Edit Input</button>
            </div>
          </div>

          {/* Sections */}
          {SECTIONS.map(s => (
            <SectionEditor
              key={s.key}
              sectionKey={s.key}
              label={s.label}
              content={draft[s.key]}
              onEdit={updateDraftSection}
              editMode={!!editingSections[s.key]}
              onToggleEdit={() => toggleEdit(s.key)}
            />
          ))}

          {/* Export row */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-sm">Ready to Export</p>
              <p className="text-gray-500 text-xs">Review all sections, edit as needed, then export for attorney review or direct USPTO filing.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleExport("pdf")} disabled={exporting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-black text-sm disabled:opacity-60 transition-all">
                {exporting && exportType === "pdf" ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
                Export PDF
              </button>
              <button onClick={() => handleExport("txt")} disabled={exporting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-black text-sm disabled:opacity-60 transition-all">
                {exporting && exportType === "txt" ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
                Export Text File
              </button>
            </div>
          </div>
          <p className="text-center text-gray-700 text-xs pb-6">This provisional patent application establishes a priority date. Consult a registered USPTO patent practitioner before filing. Not legal advice.</p>
        </div>
      )}
    </div>
  );
}