import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Brain, Loader2, Download, AlertCircle,
  CheckCircle2, Sparkles, User, Plus, Trash2, Info, Share2
} from "lucide-react";
import ShareDraftModal from "@/components/wizard/ShareDraftModal";
import { base44 } from "@/api/base44Client";
import WizardProgress, { WIZARD_STEPS } from "@/components/wizard/WizardProgress";
import ClaimEditor from "@/components/wizard/ClaimEditor";
import { ABSTRACT_RULES, TITLE_RULES, validateField, getCompletionScore } from "@/lib/patentValidation";
import { exportPatentApplicationPDF } from "@/lib/patentWizardPdf";

// ── EMPTY DOC ─────────────────────────────────────────────────────────────────
const EMPTY_DOC = {
  title: "",
  inventors: [{ name: "", address: "" }],
  field: "",
  abstract: "",
  background: "",
  summary: "",
  description: "",
  drawings: "",
  claims: { independent: [""], dependent: [""] },
  aiContext: "", // holds imported Patent Intelligence output
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
function FieldLabel({ label, hint, required }) {
  return (
    <div className="flex items-start gap-1.5 mb-2">
      <label className="text-gray-300 text-xs font-black uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && (
        <div className="group relative">
          <Info size={11} className="text-gray-600 mt-0.5 cursor-help" />
          <div className="hidden group-hover:block absolute left-0 top-5 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 w-60 z-10 shadow-xl">
            {hint}
          </div>
        </div>
      )}
    </div>
  );
}

function ValidationRow({ results }) {
  if (!results || results.every(r => r.passed)) return null;
  const failures = results.filter(r => !r.passed);
  return (
    <div className="mt-2 space-y-1">
      {failures.map(r => (
        <div key={r.id} className="flex items-start gap-1.5 text-xs text-yellow-400">
          <AlertCircle size={10} className="flex-shrink-0 mt-0.5" />
          <span>{r.hint}</span>
        </div>
      ))}
    </div>
  );
}

function AiAssist({ prompt, onResult, label = "AI Assist", disabled }) {
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({ prompt, model: "claude_sonnet_4_6" });
    onResult(res);
    setLoading(false);
  };
  return (
    <button onClick={run} disabled={loading || disabled}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/40 border border-indigo-700 text-indigo-300 text-xs font-bold hover:bg-indigo-800/40 transition-all disabled:opacity-40">
      {loading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
      {loading ? "Generating…" : label}
    </button>
  );
}

// ── STEP COMPONENTS ───────────────────────────────────────────────────────────

function StepImport({ doc, setDoc }) {
  const [pasting, setPasting] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Brain size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-black text-sm mb-1">Import from Patent Intelligence</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Paste any output from the AI Patent Intelligence page (Claim Summarizer, Novelty Analysis, or Drafting Strategy). The wizard will use it as context to pre-populate fields with AI assistance throughout your drafting session.
            </p>
          </div>
        </div>
      </div>

      <div>
        <FieldLabel label="AI Patent Intelligence Output" hint="Paste the full output from any Patent Intelligence tab. The more context you provide, the better the AI pre-fill suggestions will be." />
        <textarea
          value={doc.aiContext}
          onChange={e => setDoc(d => ({ ...d, aiContext: e.target.value }))}
          rows={12}
          placeholder="Paste your AI Patent Intelligence output here…&#10;&#10;Examples:&#10;• Claim Summarizer analysis&#10;• Novelty & FTO report&#10;• Provisional Drafting Strategy output&#10;• Competitive Landscape report&#10;&#10;You can also type your own invention description directly."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none"
        />
        {doc.aiContext.trim() && (
          <p className="text-green-400 text-xs mt-1.5 flex items-center gap-1">
            <CheckCircle2 size={11} /> {doc.aiContext.trim().split(/\s+/).length} words of context loaded — AI will use this throughout the wizard
          </p>
        )}
      </div>

      <div className="border-t border-gray-800 pt-5">
        <p className="text-gray-500 text-xs mb-3 font-semibold uppercase tracking-wider">Or start from scratch</p>
        <div>
          <FieldLabel label="Invention Summary" hint="A brief plain-language description of what your invention does." />
          <textarea
            value={doc.summary}
            onChange={e => setDoc(d => ({ ...d, summary: e.target.value }))}
            rows={5}
            placeholder="Brief description of what your invention does, the problem it solves, and its key innovative aspects…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function StepTitle({ doc, setDoc }) {
  const titleValidation = validateField(doc.title, TITLE_RULES);

  const addInventor = () => setDoc(d => ({ ...d, inventors: [...d.inventors, { name: "", address: "" }] }));
  const removeInventor = (i) => setDoc(d => ({ ...d, inventors: d.inventors.filter((_, idx) => idx !== i) }));
  const updateInventor = (i, field, val) => setDoc(d => {
    const inv = [...d.inventors];
    inv[i] = { ...inv[i], [field]: val };
    return { ...d, inventors: inv };
  });

  const context = doc.aiContext || doc.summary;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel label="Title of Invention" required hint="USPTO limits titles to 500 characters. Do not start with 'A', 'An', or 'The'. Should be specific and descriptive." />
          {context && (
            <AiAssist
              label="Suggest Title"
              prompt={`Based on this invention context, suggest 3 concise USPTO-compliant patent application titles (no leading articles like 'A'/'An'/'The', under 100 chars each). Return only the 3 titles, one per line.\n\nCONTEXT:\n${context}`}
              onResult={(res) => {
                const first = res.trim().split("\n")[0].replace(/^\d+\.\s*/, "").trim();
                if (first) setDoc(d => ({ ...d, title: first }));
              }}
            />
          )}
        </div>
        <input
          value={doc.title}
          onChange={e => setDoc(d => ({ ...d, title: e.target.value }))}
          placeholder="e.g., Electromagnetic Field Modulation System for Bioelectromagnetic Therapy"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600"
        />
        <ValidationRow results={titleValidation} />
        <p className="text-gray-700 text-xs mt-1">{doc.title.length}/500 chars</p>
      </div>

      <div>
        <FieldLabel label="Technical Field" required hint="One or two sentences identifying the technical field your invention relates to." />
        <div className="flex gap-2 mb-2">
          {context && (
            <AiAssist
              label="Generate Field"
              prompt={`Write a 1-2 sentence USPTO patent 'Field of the Invention' statement for this invention. Be specific about the technical domain. Return only the statement.\n\nCONTEXT:\n${context}`}
              onResult={(res) => setDoc(d => ({ ...d, field: res.trim() }))}
            />
          )}
        </div>
        <textarea
          value={doc.field}
          onChange={e => setDoc(d => ({ ...d, field: e.target.value }))}
          rows={3}
          placeholder="The present invention relates to [technical field], and more particularly to [specific sub-domain]."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <FieldLabel label="Inventors" required hint="All inventors who contributed to the conception of the invention. Must match USPTO records." />
          <button onClick={addInventor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all">
            <Plus size={12} /> Add Inventor
          </button>
        </div>
        <div className="space-y-3">
          {doc.inventors.map((inv, i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User size={13} className="text-gray-500" />
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Inventor {i + 1}</span>
                </div>
                {doc.inventors.length > 1 && (
                  <button onClick={() => removeInventor(i)} className="text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Full Legal Name *</label>
                  <input value={inv.name} onChange={e => updateInventor(i, "name", e.target.value)}
                    placeholder="First Middle Last"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none" />
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Address / Residence</label>
                  <input value={inv.address} onChange={e => updateInventor(i, "address", e.target.value)}
                    placeholder="City, State, Country"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepAbstract({ doc, setDoc }) {
  const results = validateField(doc.abstract, ABSTRACT_RULES);
  const wordCount = doc.abstract.trim() ? doc.abstract.trim().split(/\s+/).length : 0;
  const context = doc.aiContext || doc.summary;

  return (
    <div className="space-y-5">
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
        <span className="text-gray-400 font-bold">USPTO Abstract Requirements:</span> Single paragraph, 150–250 words, third-person language only, no first-person ("I", "we"), no claims language. Must concisely describe the nature and gist of the invention.
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel label="Abstract" required hint="A single-paragraph concise summary. Must be 150–250 words. No first-person language." />
          {context && (
            <AiAssist
              label="Generate Abstract"
              prompt={`Write a USPTO-compliant patent abstract for this invention. Requirements: exactly one paragraph, 150-250 words, third person only (no I/we/our), concisely describes the nature and gist of the invention, mentions the key technical components and their functions. Return ONLY the abstract text.\n\nINVENTION CONTEXT:\n${context}`}
              onResult={(res) => setDoc(d => ({ ...d, abstract: res.trim() }))}
            />
          )}
        </div>
        <textarea
          value={doc.abstract}
          onChange={e => setDoc(d => ({ ...d, abstract: e.target.value }))}
          rows={10}
          placeholder="A [type of device/method/system] for [purpose] is disclosed. The [invention] comprises [main components]. In operation, [how it works]. The [invention] provides [key advantages and benefits]."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between mt-2">
          <ValidationRow results={results} />
          <span className={`text-xs ml-auto font-bold tabular-nums ${
            wordCount < 100 ? "text-gray-600" : wordCount <= 300 ? "text-green-400" : "text-red-400"
          }`}>{wordCount} words</span>
        </div>
      </div>
    </div>
  );
}

function StepDescription({ doc, setDoc }) {
  const context = doc.aiContext || doc.summary;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel label="Background of the Invention" hint="Describe the state of the prior art, the problem your invention solves, and why existing solutions are inadequate." />
          {context && (
            <AiAssist
              label="Generate Background"
              prompt={`Write a USPTO patent 'Background of the Invention' section. Include: the technical field context, description of prior art limitations, the specific problem being solved. Be 200-400 words. Third person only. Return only the section text.\n\nINVENTION CONTEXT:\n${context}`}
              onResult={(res) => setDoc(d => ({ ...d, background: res.trim() }))}
            />
          )}
        </div>
        <textarea
          value={doc.background}
          onChange={e => setDoc(d => ({ ...d, background: e.target.value }))}
          rows={7}
          placeholder="The field of [technology] has long sought solutions to [problem]. Prior art approaches include [examples], however these suffer from [limitations]. There remains a need for [what your invention provides]."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none leading-relaxed"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel label="Summary of the Invention" hint="Brief overview of the invention and its advantages. Should mirror the independent claims broadly." />
          {context && (
            <AiAssist
              label="Generate Summary"
              prompt={`Write a USPTO patent 'Summary of the Invention' section. Should broadly describe the invention and its key advantages. Mirror the scope of independent claims. Be 150-300 words. Return only the section text.\n\nINVENTION CONTEXT:\n${context}`}
              onResult={(res) => setDoc(d => ({ ...d, summary: res.trim() }))}
            />
          )}
        </div>
        <textarea
          value={doc.summary}
          onChange={e => setDoc(d => ({ ...d, summary: e.target.value }))}
          rows={6}
          placeholder="In accordance with the present invention, there is provided a [system/method/apparatus] for [purpose]. The invention comprises [key elements] and achieves [key advantages]."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none leading-relaxed"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel label="Detailed Description" required hint="The most important section. Must enable a PHOSITA (person having ordinary skill in the art) to make and use the invention. Describe all embodiments, components, and modes of operation." />
          {context && (
            <AiAssist
              label="Generate Description"
              prompt={`Write a detailed USPTO patent specification 'Detailed Description of the Preferred Embodiments'. Include: description of each component and its function, how components interact, preferred embodiment, alternative embodiments, mode of operation step by step. Be 600-1000 words. Third person. Technical but clear. Return only the section text.\n\nINVENTION CONTEXT:\n${context}`}
              onResult={(res) => setDoc(d => ({ ...d, description: res.trim() }))}
            />
          )}
        </div>
        <textarea
          value={doc.description}
          onChange={e => setDoc(d => ({ ...d, description: e.target.value }))}
          rows={14}
          placeholder="Referring now to the drawings, FIG. 1 illustrates a [description]. The [first element] (10) comprises [details]. In the preferred embodiment, [component] operates by [mechanism]…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}

function StepClaims({ doc, setDoc }) {
  const context = doc.aiContext || doc.summary;

  return (
    <div className="space-y-6">
      <div className="bg-yellow-950/20 border border-yellow-800/30 rounded-xl p-4 text-xs text-yellow-300/80 leading-relaxed">
        <span className="font-black text-yellow-300">USPTO Claim Rules:</span> Independent claims must start with "A/An/The", use "comprising" or "consisting of", and end with a period. Dependent claims must reference a prior claim number. Real-time validation is shown below each claim.
      </div>

      {context && (
        <AiAssist
          label="Auto-Generate All Claims from Context"
          prompt={`Generate USPTO-formatted patent claims for this invention. Format exactly as follows:

INDEPENDENT CLAIM 1 (method):
A method for [field], comprising: [steps with semicolons, period at end].

INDEPENDENT CLAIM 2 (system):
A system for [field], comprising: [components with semicolons, period at end].

INDEPENDENT CLAIM 3 (apparatus):
An apparatus for [field], comprising: [elements with semicolons, period at end].

DEPENDENT CLAIM 4:
The method of claim 1, wherein [specific limitation].

DEPENDENT CLAIM 5:
The system of claim 2, wherein [specific limitation].

DEPENDENT CLAIM 6:
The apparatus of claim 3, further comprising [element].

DEPENDENT CLAIM 7:
The method of claim 1, wherein [another limitation].

Return ONLY the claims in the exact format above. Each claim must end with a period.

INVENTION CONTEXT:
${context}`}
          onResult={(res) => {
            // Parse independent and dependent claims from response
            const indMatches = [...res.matchAll(/INDEPENDENT CLAIM \d+[^:]*:\s*([\s\S]*?)(?=INDEPENDENT CLAIM \d+|DEPENDENT CLAIM \d+|$)/gi)];
            const depMatches = [...res.matchAll(/DEPENDENT CLAIM \d+[^:]*:\s*([\s\S]*?)(?=DEPENDENT CLAIM \d+|INDEPENDENT CLAIM \d+|$)/gi)];
            const ind = indMatches.map(m => m[1].trim()).filter(Boolean);
            const dep = depMatches.map(m => m[1].trim()).filter(Boolean);
            setDoc(d => ({
              ...d,
              claims: {
                independent: ind.length ? ind : d.claims.independent,
                dependent: dep.length ? dep : d.claims.dependent,
              }
            }));
          }}
        />
      )}

      <ClaimEditor claims={doc.claims} onChange={(claims) => setDoc(d => ({ ...d, claims }))} />
    </div>
  );
}

function StepDrawings({ doc, setDoc }) {
  const context = doc.aiContext || doc.summary;

  return (
    <div className="space-y-5">
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
        <span className="text-gray-400 font-bold">Brief Description of Drawings:</span> List each figure (FIG. 1, FIG. 2, etc.) and describe what it shows. This section is required if drawings are included with your application. Drawings themselves are uploaded separately to USPTO.
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel label="Brief Description of the Drawings" hint="List each figure and a brief description. E.g., 'FIG. 1 is a perspective view of the device according to an embodiment of the present invention.'" />
          {context && (
            <AiAssist
              label="Suggest Figures"
              prompt={`For this invention, suggest 4-6 patent drawing figures. For each, write the standard USPTO brief description format: 'FIG. X is a [view type] of [what is shown] according to [embodiment description].' Return only the list of figure descriptions, one per line.\n\nINVENTION CONTEXT:\n${context}`}
              onResult={(res) => setDoc(d => ({ ...d, drawings: res.trim() }))}
            />
          )}
        </div>
        <textarea
          value={doc.drawings}
          onChange={e => setDoc(d => ({ ...d, drawings: e.target.value }))}
          rows={10}
          placeholder={"FIG. 1 is a perspective view of the device according to a preferred embodiment of the present invention.\nFIG. 2 is a cross-sectional view taken along line 2-2 of FIG. 1.\nFIG. 3 is a block diagram illustrating the operational components of the system.\nFIG. 4 is a flowchart illustrating the method steps according to one embodiment."}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}

function StepReview({ doc }) {
  const score = getCompletionScore(doc);
  const indClaims = (doc.claims?.independent || []).filter(c => c.trim());
  const depClaims = (doc.claims?.dependent || []).filter(c => c.trim());
  const totalClaims = indClaims.length + depClaims.length;

  const checks = [
    { label: "Title", done: !!doc.title.trim(), critical: true },
    { label: "Inventor(s)", done: doc.inventors.some(i => i.name.trim()), critical: true },
    { label: "Technical Field", done: !!doc.field.trim(), critical: false },
    { label: "Abstract", done: !!doc.abstract.trim(), critical: true },
    { label: "Background", done: !!doc.background.trim(), critical: false },
    { label: "Summary", done: !!doc.summary.trim(), critical: false },
    { label: "Detailed Description", done: !!doc.description.trim(), critical: true },
    { label: "Independent Claims", done: indClaims.length >= 1, critical: true },
    { label: "Dependent Claims", done: depClaims.length >= 1, critical: false },
    { label: "Brief Description of Drawings", done: !!doc.drawings.trim(), critical: false },
  ];

  const criticalMissing = checks.filter(c => c.critical && !c.done);

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-black text-sm">Document Completeness</h3>
          <span className={`text-2xl font-black ${score >= 80 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"}`}>{score}%</span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full transition-all ${score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
            style={{ width: `${score}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {checks.map(c => (
            <div key={c.label} className={`flex items-center gap-2 text-xs ${c.done ? "text-gray-400" : c.critical ? "text-red-400" : "text-gray-600"}`}>
              {c.done ? <CheckCircle2 size={11} className="text-green-500" /> : <AlertCircle size={11} className={c.critical ? "text-red-500" : "text-gray-600"} />}
              {c.label} {c.critical && !c.done && <span className="text-red-500 font-bold">*</span>}
            </div>
          ))}
        </div>
      </div>

      {criticalMissing.length > 0 && (
        <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4">
          <p className="text-red-400 font-black text-xs uppercase tracking-wider mb-2">Required sections missing</p>
          <p className="text-red-300/70 text-xs">Complete these before filing: {criticalMissing.map(c => c.label).join(", ")}</p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Title", value: doc.title ? doc.title.slice(0, 30) + (doc.title.length > 30 ? "…" : "") : "—" },
          { label: "Inventors", value: doc.inventors.filter(i => i.name.trim()).length },
          { label: "Total Claims", value: totalClaims },
          { label: "Ind. / Dep.", value: `${indClaims.length} / ${depClaims.length}` },
        ].map(item => (
          <div key={item.label} className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-white text-sm font-black">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Full preview */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 space-y-4 max-h-80 overflow-y-auto">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Document Preview</p>
        {[
          { label: "Title", val: doc.title },
          { label: "Abstract", val: doc.abstract?.slice(0, 300) + (doc.abstract?.length > 300 ? "…" : "") },
          { label: "Independent Claims", val: (doc.claims?.independent || []).filter(c => c.trim()).map((c, i) => `${i + 1}. ${c}`).join("\n\n") },
        ].map(s => s.val && (
          <div key={s.label}>
            <p className="text-indigo-400 text-xs font-black uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-950/20 border border-yellow-800/30 rounded-xl p-4 text-xs text-yellow-300/80 leading-relaxed">
        <span className="font-black text-yellow-300">Legal Notice:</span> This tool generates a draft document for review. Always consult a registered patent attorney or agent before filing. This is not legal advice. USPTO filing requires official forms (ADS, oath/declaration, fee payment) in addition to this specification.
      </div>
    </div>
  );
}

// ── MAIN WIZARD ───────────────────────────────────────────────────────────────
export default function PatentDraftingWizard() {
  const location = useLocation();
  const [step, setStep] = useState("import");
  const [completed, setCompleted] = useState([]);
  const [showShare, setShowShare] = useState(false);
  const [doc, setDoc] = useState(() => {
    // Accept pre-seeded context from navigation state
    const state = location.state;
    if (state?.aiContext) return { ...EMPTY_DOC, aiContext: state.aiContext };
    return EMPTY_DOC;
  });

  const stepIndex = WIZARD_STEPS.findIndex(s => s.id === step);

  const goNext = () => {
    if (!completed.includes(step)) setCompleted(c => [...c, step]);
    const next = WIZARD_STEPS[stepIndex + 1];
    if (next) setStep(next.id);
  };

  const goPrev = () => {
    const prev = WIZARD_STEPS[stepIndex - 1];
    if (prev) setStep(prev.id);
  };

  const handleStepClick = (id) => setStep(id);

  const score = getCompletionScore(doc);
  const isLast = stepIndex === WIZARD_STEPS.length - 1;

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {showShare && <ShareDraftModal doc={doc} onClose={() => setShowShare(false)} />}
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/patent-intelligence" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Patent Intelligence
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Sparkles size={15} className="text-indigo-400" /> Patent Drafting Wizard
            </h1>
            <p className="text-gray-500 text-xs">USPTO-formatted · Real-time validation · AI-assisted · PDF export</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${score >= 80 ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-400"}`}>
            {score}% complete
          </span>
          <button
            onClick={() => setShowShare(true)}
            disabled={!doc.title?.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-black transition-all disabled:opacity-40">
            <Share2 size={13} /> Share
          </button>
          <button
            onClick={() => exportPatentApplicationPDF(doc)}
            disabled={score < 30}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-black transition-all disabled:opacity-40">
            <Download size={13} /> Export PDF
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-3 border-b border-gray-800 bg-gray-900/50 overflow-x-auto">
        <WizardProgress currentStep={step} completedSteps={completed} onStepClick={handleStepClick} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">
          {/* Step header */}
          <div className="mb-6">
            <h2 className="text-white font-black text-xl">
              {WIZARD_STEPS.find(s => s.id === step)?.label}
            </h2>
            <p className="text-gray-500 text-xs mt-1">Step {stepIndex + 1} of {WIZARD_STEPS.length}</p>
          </div>

          {step === "import" && <StepImport doc={doc} setDoc={setDoc} />}
          {step === "title" && <StepTitle doc={doc} setDoc={setDoc} />}
          {step === "abstract" && <StepAbstract doc={doc} setDoc={setDoc} />}
          {step === "description" && <StepDescription doc={doc} setDoc={setDoc} />}
          {step === "claims" && <StepClaims doc={doc} setDoc={setDoc} />}
          {step === "drawings" && <StepDrawings doc={doc} setDoc={setDoc} />}
          {step === "review" && <StepReview doc={doc} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <button onClick={goPrev} disabled={stepIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-bold transition-all disabled:opacity-30">
              <ArrowLeft size={14} /> Back
            </button>

            {isLast ? (
              <button onClick={() => exportPatentApplicationPDF(doc)} disabled={score < 30}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white text-sm font-black transition-all disabled:opacity-40">
                <Download size={14} /> Export Full Application PDF
              </button>
            ) : (
              <button onClick={goNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-black transition-all">
                Continue <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}