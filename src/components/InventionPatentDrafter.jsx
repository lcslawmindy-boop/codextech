import { useState } from "react";
import { X, Loader2, Sparkles, FileDown, ChevronDown, ChevronUp, Edit3, Check, AlertTriangle } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

// ── USPTO PPA sections ────────────────────────────────────────────────────────
const SECTIONS = [
  { key: "title",            label: "Title of Invention",                        legalNote: "35 USC 111(b)" },
  { key: "crossReference",   label: "Cross-Reference to Related Applications",   legalNote: "37 CFR 1.78" },
  { key: "technicalField",   label: "Technical Field",                           legalNote: "37 CFR 1.77" },
  { key: "background",       label: "Background of the Invention",               legalNote: "37 CFR 1.73" },
  { key: "summary",          label: "Summary of the Invention",                  legalNote: "37 CFR 1.73" },
  { key: "briefDrawings",    label: "Brief Description of the Drawings",         legalNote: "37 CFR 1.74" },
  { key: "detailedDesc",     label: "Detailed Description of the Invention",     legalNote: "37 CFR 1.71" },
  { key: "claims",           label: "Claims",                                    legalNote: "35 USC 112 ⚠ Legal Weight", highlight: true },
  { key: "abstract",         label: "Abstract",                                  legalNote: "37 CFR 1.72(b) · ≤150 words" },
];

// ── PDF export ────────────────────────────────────────────────────────────────
function exportPDF(inv, draft) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 18;
  let y = M;

  // Strip HTML tags from quill content
  const strip = (html) => html ? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";

  const addPage = () => { doc.addPage(); doc.setFillColor(8, 8, 18); doc.rect(0, 0, W, 297, "F"); y = M; };
  const checkPage = (needed = 12) => { if (y + needed > 275) addPage(); };

  // Cover
  doc.setFillColor(8, 8, 18); doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(30, 50, 120); doc.rect(0, 0, W, 38, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(140, 160, 255);
  doc.text("UNITED STATES PROVISIONAL PATENT APPLICATION", M, 14);
  doc.text("35 U.S.C. § 111(b)  ·  37 C.F.R. § 1.53(c)  ·  PATENT PENDING", M, 20);
  doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(strip(draft.title) || inv.name, W - M * 2);
  titleLines.forEach((l, i) => { doc.text(l, M, 30 + i * 7); });
  y = 48;

  // Meta
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(120, 120, 160);
  doc.text(`Filed: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, M, y);
  doc.text(`Category: ${inv.category || ""}  ·  Stage: ${inv.stage || ""}  ·  IP Value: ${inv.ipValuation || ""}`, M, y + 5);
  y += 14;

  doc.setDrawColor(60, 80, 200); doc.setLineWidth(0.5); doc.line(M, y, W - M, y); y += 6;

  SECTIONS.forEach((sec) => {
    const raw = strip(draft[sec.key] || "");
    if (!raw) return;

    checkPage(14);
    // Section heading
    doc.setFillColor(16, 24, 60); doc.rect(M - 2, y - 4, W - M * 2 + 4, 10, "F");
    doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.setTextColor(...(sec.highlight ? [248, 113, 113] : [100, 140, 255]));
    doc.text(sec.label.toUpperCase(), M, y + 2);
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 120);
    doc.text(sec.legalNote, W - M, y + 2, { align: "right" });
    y += 9;

    doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(210, 210, 225);
    const lines = doc.splitTextToSize(raw, W - M * 2);
    lines.forEach((line) => {
      checkPage(5);
      doc.text(line, M, y);
      y += 4.8;
    });
    y += 5;
    doc.setDrawColor(30, 30, 50); doc.setLineWidth(0.2); doc.line(M, y - 2, W - M, y - 2);
  });

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 90);
    doc.text("CONFIDENTIAL — PATENT PENDING — ZENITH APEX RESEARCH", W / 2, 292, { align: "center" });
    doc.text(`Page ${i} of ${totalPages}`, W - M, 292, { align: "right" });
  }

  const safeName = (inv.name || "provisional-patent").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 50);
  doc.save(`${safeName}-provisional-patent.pdf`);
}

// ── Section editor card ───────────────────────────────────────────────────────
function SectionCard({ sec, content, onChange, isGenerating }) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);

  const wordCount = content ? content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length : 0;
  const hasContent = content && content.replace(/<[^>]+>/g, "").trim().length > 0;

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all ${sec.highlight ? "border-red-900/60" : "border-gray-800"} ${hasContent ? "" : "opacity-60"}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${sec.highlight ? "bg-red-950/20 hover:bg-red-950/30" : "bg-gray-900 hover:bg-gray-800/60"}`}
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronUp size={13} className="text-gray-500" /> : <ChevronDown size={13} className="text-gray-500" />}
          <span className={`font-bold text-sm ${sec.highlight ? "text-red-300" : "text-white"}`}>{sec.label}</span>
          {sec.highlight && <AlertTriangle size={12} className="text-red-400" />}
          <span className="text-gray-600 text-xs">{sec.legalNote}</span>
        </div>
        <div className="flex items-center gap-3">
          {hasContent && <span className="text-gray-600 text-xs">{wordCount} words</span>}
          {isGenerating && !hasContent && <Loader2 size={12} className="animate-spin text-blue-400" />}
          {hasContent && <span className="w-2 h-2 rounded-full bg-green-500" />}
          <button
            onClick={e => { e.stopPropagation(); setEditing(v => !v); }}
            className={`p-1 transition-colors ${editing ? "text-blue-400" : "text-gray-600 hover:text-gray-300"}`}
          >
            {editing ? <Check size={13} /> : <Edit3 size={13} />}
          </button>
        </div>
      </div>

      {/* Content */}
      {open && (
        <div className={`${sec.highlight ? "bg-red-950/10" : "bg-gray-950"} border-t ${sec.highlight ? "border-red-900/30" : "border-gray-800"}`}>
          {editing ? (
            <div className="patent-quill">
              <ReactQuill
                value={content || ""}
                onChange={onChange}
                theme="snow"
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    ["clean"],
                  ],
                }}
              />
            </div>
          ) : (
            <div
              className="px-5 py-4 text-gray-300 text-sm leading-relaxed font-mono prose prose-sm prose-invert max-w-none min-h-[60px]"
              dangerouslySetInnerHTML={{ __html: content || `<span class="text-gray-600 italic">— generating… —</span>` }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function InventionPatentDrafter({ invention, onClose }) {
  const [draft, setDraft] = useState({});
  const [generating, setGenerating] = useState(false);
  const [generatingSection, setGeneratingSection] = useState("");
  const [done, setDone] = useState(false);
  const [exporting, setExporting] = useState(false);

  const updateSection = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const completedCount = SECTIONS.filter(s => {
    const c = draft[s.key] || "";
    return c.replace(/<[^>]+>/g, "").trim().length > 20;
  }).length;

  const generate = async () => {
    setGenerating(true);
    setDone(false);
    setDraft({});

    const invData = `
Invention Name: ${invention.name}
Tagline: ${invention.tagline || ""}
Category: ${invention.category || ""}
Stage: ${invention.stage || ""}
Description: ${invention.description || ""}
Problem: ${invention.problem || ""}
Solution: ${invention.solution || ""}
Technical Specifications: ${(invention.specs || []).map(s => `${s.label}: ${s.value}`).join("; ")}
Key Bearden Principles: ${(invention.principles || []).join(", ")}
Manufacturing: ${invention.manufacturing || ""}
Prior Art Differentiation: ${invention.priorArtDiff || ""}
Filing Strategy: ${invention.filingStrategy || ""}
IP Type: ${invention.ipType || ""}
Jurisdictions: ${(invention.jurisdictions || []).join(", ")}
IP Valuation: ${invention.ipValuation || ""}
Market Size: ${invention.marketSize || ""}
`.trim();

    // Generate all 9 sections in one LLM call for speed
    setGeneratingSection("Generating all USPTO sections…");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior USPTO patent attorney specializing in electromagnetic devices, scalar field physics, and energy technologies based on Thomas Bearden's framework.

Draft a complete US Provisional Patent Application (PPA) for the following invention. Use strict formal USPTO patent language throughout — terms like "heretofore", "it would be desirable", "comprising", "wherein", "said", proper antecedent basis, and element reference numerals (100), (102) etc.

INVENTION DATA:
${invData}

Return a JSON object with exactly these keys. Each value should be well-formed HTML (use <p>, <ol>, <li>, <strong> tags):

title: Formal patent title (avoid tradenames, ≤500 chars)

crossReference: One paragraph: "This application claims the benefit of..." or "No prior applications."

technicalField: 1-2 sentences defining the technical field per USPTO convention.

background: 4-6 paragraphs covering: (1) the general field and its limitations, (2) prior art deficiencies citing specific technical problems using "heretofore" language, (3) why the invention is needed. Reference Bearden's documented prior art where appropriate.

summary: 4-5 paragraphs each starting with "In one aspect of the invention..." or "In another aspect..." covering the main independent claim scope and key embodiments.

briefDrawings: List FIG. 1 through FIG. 8 with one-sentence descriptions. Format as <ol> list.

detailedDesc: 700-1000 words. Full description of preferred embodiments. Reference FIG. numbers and element numerals (100), (102), etc. Describe materials, dimensions, operating parameters, alternatives. Ground in Bearden's documented scalar EM framework.

claims: 20 patent claims formatted as <ol>. Claim 1 = broadest independent method/apparatus claim using "comprising". Claims 2-15 = dependent claims narrowing Claim 1. Claims 16-19 = second independent claim + dependents. Claim 20 = method claim. Use proper patent claim language.

abstract: Single paragraph ≤150 words per 37 CFR 1.72(b). Summarize invention and its primary advantage.`,
      response_json_schema: {
        type: "object",
        properties: {
          title:          { type: "string" },
          crossReference: { type: "string" },
          technicalField: { type: "string" },
          background:     { type: "string" },
          summary:        { type: "string" },
          briefDrawings:  { type: "string" },
          detailedDesc:   { type: "string" },
          claims:         { type: "string" },
          abstract:       { type: "string" },
        }
      },
      model: "claude_sonnet_4_6",
    });

    setDraft(result);
    setGeneratingSection("");
    setGenerating(false);
    setDone(true);
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { exportPDF(invention, draft); setExporting(false); }, 100);
  };

  return (
    <>
      {/* Quill dark theme override */}
      <style>{`
        .patent-quill .ql-toolbar { background: #1a1a2e; border-color: #374151; }
        .patent-quill .ql-container { background: #0f0f1a; border-color: #374151; color: #d1d5db; font-family: monospace; min-height: 140px; }
        .patent-quill .ql-editor { font-size: 13px; line-height: 1.7; }
        .patent-quill .ql-stroke { stroke: #9ca3af; }
        .patent-quill .ql-fill { fill: #9ca3af; }
        .patent-quill .ql-picker { color: #9ca3af; }
      `}</style>

      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-gray-950 border border-gray-700 rounded-2xl shadow-2xl flex flex-col" style={{ height: "92vh" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-gray-400 text-xs font-mono uppercase tracking-widest">USPTO Provisional Patent</span>
              <span className="text-white font-black text-sm truncate max-w-xs">{invention.name}</span>
              {done && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-950/60 border border-green-800 text-green-400 font-bold">
                  {completedCount}/{SECTIONS.length} sections
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!done && !generating && (
                <button
                  onClick={generate}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-black text-sm transition-all shadow-[0_0_20px_rgba(80,140,255,0.3)]"
                >
                  <Sparkles size={14} /> Generate Patent Draft
                </button>
              )}
              {done && (
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-green-700 to-cyan-700 hover:from-green-600 hover:to-cyan-600 text-white font-black text-sm disabled:opacity-60 transition-all"
                >
                  {exporting ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
                  {exporting ? "Building PDF…" : "Export as PDF"}
                </button>
              )}
              {done && (
                <button
                  onClick={generate}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-all"
                >
                  <Sparkles size={12} /> Regenerate
                </button>
              )}
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="px-5 py-2 bg-yellow-950/20 border-b border-yellow-900/30 flex items-center gap-2 flex-shrink-0">
            <AlertTriangle size={11} className="text-yellow-500 flex-shrink-0" />
            <p className="text-yellow-300 text-xs">
              <strong>Legal Notice:</strong> This draft is for preliminary review only. A provisional patent establishes a priority date but does not issue as a patent. Review with a registered USPTO patent practitioner before filing. Not legal advice.
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
            {/* Generating state */}
            {generating && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-14 h-14 border-4 border-blue-800 border-t-blue-400 rounded-full animate-spin" />
                <p className="text-white font-black text-lg">Drafting Patent Application</p>
                <p className="text-gray-400 text-sm">{generatingSection}</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {SECTIONS.map(s => (
                    <div key={s.key} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-gray-700">·</span> {s.label}
                    </div>
                  ))}
                </div>
                <p className="text-blue-500 text-xs mt-2">Using Claude Sonnet · ~30 seconds · all 9 sections in one pass</p>
              </div>
            )}

            {/* Empty state */}
            {!generating && !done && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">📋</div>
                <h2 className="text-white font-black text-xl mb-2">Generate Patent Draft</h2>
                <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-4">
                  The AI will map this invention's specifications, Bearden principles, and prior art differentiation into a formal USPTO Provisional Patent Application structure across all 9 required sections.
                </p>
                <div className="grid grid-cols-3 gap-2 max-w-lg text-xs text-gray-600">
                  {SECTIONS.map(s => (
                    <div key={s.key} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-left">
                      <span className={s.highlight ? "text-red-400" : "text-blue-400"}>§</span> {s.label}
                    </div>
                  ))}
                </div>
                <button
                  onClick={generate}
                  className="mt-6 flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-black text-base transition-all shadow-[0_0_30px_rgba(80,140,255,0.3)]"
                >
                  <Sparkles size={16} /> Generate Full Patent Draft
                </button>
                <p className="text-gray-600 text-xs mt-2">Powered by Claude Sonnet · ~30 seconds</p>
              </div>
            )}

            {/* Sections */}
            {done && SECTIONS.map(sec => (
              <SectionCard
                key={sec.key}
                sec={sec}
                content={draft[sec.key] || ""}
                onChange={val => updateSection(sec.key, val)}
                isGenerating={generating}
              />
            ))}

            {done && (
              <p className="text-center text-gray-700 text-xs py-4">
                35 USC 111(b) · 37 CFR Part 1 · A provisional establishes priority date only. File nonprovisional within 12 months. · Zenith Apex Research
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}