import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileText, CheckSquare, Square, Loader2, Download, Copy, Check, ChevronDown, ChevronUp, AlertTriangle, Zap, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ENTITY_STATUSES = [
  { value: "micro", label: "Micro Entity", desc: "Individual inventor, gross income ≤ $239,000, fewer than 5 prior US patents" },
  { value: "small", label: "Small Entity", desc: "≤500 employees, 60% fee discount" },
  { value: "large", label: "Large Entity", desc: "Corporation >500 employees — standard fees apply" },
];

const STEPS = ["Select Card", "Inventor Info", "Review & Generate", "Draft & Checklist"];

function buildChecklist(category, entityStatus) {
  const base = [
    { id: "cover", label: "Cover Sheet (USPTO Form SB/16 or equivalent)", required: true, form: "AIA/14 or SB/16", desc: "Inventor name(s), title, correspondence address, entity status declaration." },
    { id: "spec", label: "Specification — written description of invention", required: true, form: "37 CFR § 1.71", desc: "Must describe the invention in full, clear, concise terms enabling someone skilled in the field to make and use it." },
    { id: "claims", label: "At least one claim (optional for provisional, strongly recommended)", required: false, form: "37 CFR § 1.75", desc: "Claims define the metes and bounds of the invention. Even informal claims are valuable for a provisional." },
    { id: "abstract", label: "Abstract (150 words max)", required: true, form: "37 CFR § 1.72(b)", desc: "Brief narrative description of the invention for search purposes." },
    { id: "drawings", label: "Drawings / Figures (if necessary to understand invention)", required: false, form: "37 CFR § 1.81", desc: "Black & white line drawings preferred. Each figure referenced in specification." },
    { id: "filing_fee", label: "Filing Fee — Provisional Application", required: true, form: "37 CFR § 1.16(d)", desc: entityStatus === "micro" ? "Micro Entity: $340 (2024 fee schedule)" : entityStatus === "small" ? "Small Entity: $680" : "Large Entity: $1,360" },
    { id: "oath", label: "Inventor Oath or Declaration (not required for provisional — but prepare now)", required: false, form: "AIA/01 (for non-provisional)", desc: "Required when converting to non-provisional. Each inventor must sign declaring inventorship." },
    { id: "assignment", label: "Assignment Document (if assigning to entity/company)", required: false, form: "USPTO Assignment Division", desc: "Record any ownership transfer. Required if filing on behalf of a legal entity." },
  ];

  const categoryExtras = {
    "Vacuum Energy": [
      { id: "utility", label: "Utility Assertion — Practical Utility Statement", required: true, form: "MPEP § 2107", desc: "USPTO requires credible utility for vacuum/zero-point energy devices. Include experimental data, simulation results, or theoretical basis. Lack of utility is the #1 rejection ground." },
      { id: "operability", label: "Operability / Non-Perpetual Motion Disclaimer", required: true, form: "MPEP § 2164.07", desc: "Explicitly state the device does NOT violate thermodynamics laws (even if the theory is unconventional). Frame as 'harvesting' not 'generating from nothing'." },
      { id: "experimental", label: "Experimental Evidence or Working Model Reference", required: false, form: "37 CFR § 1.91", desc: "If a working model exists, reference it. USPTO may require a model for perpetual motion-adjacent claims." },
    ],
    "Free Energy": [
      { id: "utility", label: "Utility Assertion — Practical Utility Statement", required: true, form: "MPEP § 2107", desc: "Critical for free energy devices. Include COP measurements, test data, or theoretical framework citing known physics." },
      { id: "operability", label: "Operability Statement — Energy Balance Disclosure", required: true, form: "MPEP § 2164.07", desc: "Address USPTO's inherent skepticism. Reference open-system thermodynamics, environment energy coupling, or Bearden's anenergy pump framework." },
    ],
    "Scalar EM": [
      { id: "theory", label: "Theoretical Framework Disclosure (Scalar EM basis)", required: true, form: "37 CFR § 1.71(a)", desc: "Cite foundational prior art: Bearden (1982), Tesla longitudinal wave theory, Whittaker decomposition. Establishes prior art differentiation." },
      { id: "prior_art", label: "Prior Art Search: Scalar EM Patents (Class 307, 330, 324)", required: true, form: "MPEP § 2131", desc: "Search USPTO classes 307 (electrical transmission systems), 330 (amplifiers), 324 (electrical measurement). Document distinguishing features." },
    ],
    "Bioelectromagnetics": [
      { id: "fda", label: "FDA 510(k) Pre-Market Notification Assessment", required: false, form: "21 CFR Part 807", desc: "If device may be used therapeutically, assess whether FDA clearance is needed alongside USPTO filing. File patent first." },
      { id: "safety", label: "Safety Disclosure — EM Emission Levels", required: true, form: "FCC Part 15 reference", desc: "Disclose any EM emissions; note compliance with FCC/ICNIRP standards or distinguish as non-consumer device." },
      { id: "clinical", label: "Clinical Evidence Summary (if health claims involved)", required: false, form: "MPEP § 2107.01", desc: "Any therapeutic claims require credible utility. Reference clinical studies, peer-reviewed literature, or comparative data." },
    ],
    "Tesla Technology": [
      { id: "differentiation", label: "Prior Art Differentiation from Tesla Patents (1890–1943)", required: true, form: "MPEP § 2131", desc: "All original Tesla patents are expired and public domain. You must clearly differentiate from US 645,576, US 787,412, US 1,119,732, etc." },
      { id: "theory", label: "Transmission Theory Disclosure", required: true, form: "37 CFR § 1.71(a)", desc: "Describe mechanism of transmission/resonance distinguishing from Hertzian EM waves. Reference longitudinal or scalar components if applicable." },
    ],
    "Resonance Devices": [
      { id: "prior_art", label: "Prior Art Search: Class 310 (Electrical Energy Generation)", required: true, form: "MPEP § 2131", desc: "Search CPC classes H02N (electric machines not otherwise provided), H03H (resonators). Crowded field — document distinctions carefully." },
    ],
    "Phase Conjugation": [
      { id: "theory", label: "Phase Conjugation Mechanism Disclosure", required: true, form: "37 CFR § 1.71(a)", desc: "Fully describe the four-wave mixing or stimulated Brillouin scattering process. Claim novel application or material configuration." },
    ],
    "Atmospheric EM": [
      { id: "fcc", label: "FCC Spectrum Disclosure (if using licensed frequencies)", required: false, form: "47 CFR Part 5", desc: "If device operates in licensed EM spectrum, note experimental license requirements alongside patent strategy." },
    ],
  };

  const extras = categoryExtras[category] || [];
  return [...base, ...extras];
}

function ChecklistItem({ item, checked, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${checked ? "border-green-800 bg-green-950/20" : item.required ? "border-gray-700 bg-gray-900" : "border-gray-800 bg-gray-900/50"}`}>
      <div className="flex items-start gap-3 p-3">
        <button onClick={() => onToggle(item.id)} className="flex-shrink-0 mt-0.5">
          {checked ? <CheckSquare size={17} className="text-green-400" /> : <Square size={17} className="text-gray-500" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-white text-sm font-semibold leading-snug">{item.label}</span>
              {item.required && <span className="ml-2 text-xs text-red-400 font-bold">REQUIRED</span>}
            </div>
            <span className="text-xs text-gray-600 font-mono whitespace-nowrap flex-shrink-0">{item.form}</span>
          </div>
          <button onClick={() => setExpanded(x => !x)} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 mt-0.5 transition-colors">
            {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />} {expanded ? "Less" : "Details"}
          </button>
          {expanded && <p className="text-gray-400 text-xs leading-relaxed mt-1">{item.desc}</p>}
        </div>
      </div>
    </div>
  );
}

function DraftSection({ section }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(section.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <h4 className="text-white font-bold text-sm">{section.heading}</h4>
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono">{section.content}</pre>
    </div>
  );
}

export default function PatentFilingWizard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preselectedCardId = params.get("card");

  const [step, setStep] = useState(0);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [inventorName, setInventorName] = useState("");
  const [inventorCity, setInventorCity] = useState("");
  const [inventorState, setInventorState] = useState("");
  const [entityStatus, setEntityStatus] = useState("micro");
  const [includeIdentity, setIncludeIdentity] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [activeTab, setActiveTab] = useState("draft");
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    base44.entities.OpportunityCard.list("-created_date", 50).then(data => {
      setCards(data);
      if (preselectedCardId) {
        const found = data.find(c => c.id === preselectedCardId);
        if (found) { setSelectedCard(found); setStep(1); }
      }
      setLoadingCards(false);
    });
  }, []);

  const checklist = selectedCard ? buildChecklist(selectedCard.category, entityStatus) : [];

  const toggleCheck = (id) => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));

  const checkedCount = checklist.filter(i => checkedItems[i.id]).length;
  const requiredCount = checklist.filter(i => i.required).length;
  const requiredChecked = checklist.filter(i => i.required && checkedItems[i.id]).length;

  const handleGenerate = async () => {
    setGenerating(true);
    const inventorInfo = includeIdentity
      ? `Inventor: ${inventorName || '[INVENTOR NAME]'}, City: ${inventorCity || '[CITY]'}, State: ${inventorState || '[STATE]'}`
      : null;
    const res = await base44.functions.invoke("generatePatentDraft", {
      card: selectedCard,
      inventorInfo,
      entityStatus: ENTITY_STATUSES.find(e => e.value === entityStatus)?.label,
    });
    setDraft(res.data?.draft);
    setGenerating(false);
    setStep(3);
  };

  const exportAsText = () => {
    if (!draft) return;
    const sections = (draft.sections || []).map(s => `${'='.repeat(60)}\n${s.heading.toUpperCase()}\n${'='.repeat(60)}\n\n${s.content}`).join("\n\n");
    const claims = (draft.independent_claims || []).map((c, i) => `${i + 1}. ${c}`).join("\n");
    const depClaims = (draft.dependent_claims || []).map((c, i) => `${draft.independent_claims.length + i + 1}. ${c}`).join("\n");
    const fullText = `USPTO PROVISIONAL PATENT APPLICATION DRAFT
Title: ${draft.title || selectedCard?.headline}
Generated: ${new Date().toLocaleString()}
Entity Status: ${ENTITY_STATUSES.find(e => e.value === entityStatus)?.label}

${sections}

${'='.repeat(60)}
CLAIMS
${'='.repeat(60)}

${claims}
${depClaims}

${'='.repeat(60)}
ABSTRACT
${'='.repeat(60)}

${draft.abstract}

${'='.repeat(60)}
ATTORNEY NOTES
${'='.repeat(60)}

${draft.attorney_notes || ''}

${'='.repeat(60)}
DRAWINGS NEEDED
${'='.repeat(60)}

${(draft.drawings_needed || []).map((d, i) => `FIG. ${i + 1}: ${d}`).join("\n")}
`;
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `provisional_patent_${(draft.title || "draft").replace(/\s+/g, "_").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <Link to="/investors" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight flex items-center gap-2">
              <FileText size={16} className="text-blue-400" /> Patent Filing Wizard
            </h1>
            <p className="text-gray-500 text-xs">USPTO Provisional Application Generator · Category-specific disclosure checklist</p>
          </div>
        </div>
        {draft && (
          <button onClick={exportAsText}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-all">
            <Download size={12} /> Export Draft (.txt)
          </button>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 border-b border-gray-800 px-5 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <button onClick={() => draft || i < step + 1 ? setStep(i) : null}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${step === i ? "border-blue-500 text-white" : i < step ? "border-gray-600 text-gray-400 cursor-pointer hover:text-gray-200" : "border-transparent text-gray-600"}`}>
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${step === i ? "bg-blue-600 text-white" : i < step ? "bg-gray-600 text-gray-300" : "bg-gray-800 text-gray-600"}`}>{i + 1}</span>
              {s}
            </button>
            {i < STEPS.length - 1 && <ArrowRight size={12} className="text-gray-700 mx-1 flex-shrink-0" />}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── Step 0: Select Card ── */}
        {step === 0 && (
          <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-white font-bold text-lg mb-1">Select an Opportunity Card</h2>
            <p className="text-gray-500 text-sm mb-5">Choose an existing opportunity card to convert into a provisional patent application. You can also start fresh.</p>

            {loadingCards ? (
              <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-gray-600" /></div>
            ) : cards.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-sm mb-4">No opportunity cards found. Create one first in the Investor Portal.</p>
                <Link to="/investors" className="text-blue-400 hover:text-blue-300 text-sm">→ Go to Investor Portal</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cards.map(card => (
                  <button key={card.id} onClick={() => { setSelectedCard(card); setStep(1); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCard?.id === card.id ? "border-blue-500 bg-blue-950/20" : "border-gray-700 bg-gray-900 hover:border-gray-500"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{card.category}</span>
                          <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded">{card.stage}</span>
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${card.status === "live" ? "text-green-400 bg-green-900/30" : "text-gray-500 bg-gray-800"}`}>{card.status}</span>
                        </div>
                        <h3 className="text-white font-bold text-sm">{card.headline}</h3>
                        <p className="text-gray-500 text-xs mt-0.5 font-mono">{card.alias}</p>
                      </div>
                      <ArrowRight size={16} className="text-gray-600 flex-shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
                <div className="pt-3 border-t border-gray-800">
                  <p className="text-gray-600 text-xs mb-2">Don't have an opportunity card yet?</p>
                  <Link to="/investors" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                    <Zap size={12} /> Create one in the Investor Portal →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Inventor Info ── */}
        {step === 1 && selectedCard && (
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-white font-bold text-lg mb-1">Inventor & Entity Information</h2>
            <p className="text-gray-500 text-sm mb-5">This information is used only for the draft. The application remains anonymous — your real info is only included if you explicitly choose below.</p>

            <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-4 mb-5">
              <p className="text-blue-300 font-bold text-xs mb-0.5">Selected card: <span className="text-white">{selectedCard.headline}</span></p>
              <p className="text-gray-500 text-xs">{selectedCard.category} · {selectedCard.stage}</p>
            </div>

            {/* Entity Status */}
            <div className="mb-5">
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wide block mb-2">Entity Status (affects USPTO fees)</label>
              <div className="space-y-2">
                {ENTITY_STATUSES.map(e => (
                  <button key={e.value} onClick={() => setEntityStatus(e.value)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${entityStatus === e.value ? "border-blue-500 bg-blue-950/20" : "border-gray-700 bg-gray-900 hover:border-gray-600"}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-sm">{e.label}</span>
                      {entityStatus === e.value && <CheckSquare size={15} className="text-blue-400" />}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{e.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Include identity toggle */}
            <div className="border border-gray-700 rounded-xl p-4 mb-5">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <div onClick={() => setIncludeIdentity(x => !x)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${includeIdentity ? "bg-blue-600" : "bg-gray-700"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${includeIdentity ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <div>
                  <span className="text-white text-sm font-semibold">Include real inventor details</span>
                  <p className="text-gray-500 text-xs">Off = all placeholders used [INVENTOR NAME], [CITY], [STATE]</p>
                </div>
              </label>

              {includeIdentity && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  {[["Inventor Full Name", inventorName, setInventorName, "Jane D. Smith"], ["City", inventorCity, setInventorCity, "Austin"], ["State", inventorState, setInventorState, "TX"]].map(([label, val, setter, ph]) => (
                    <div key={label}>
                      <label className="text-gray-400 text-xs block mb-1">{label}</label>
                      <input value={val} onChange={e => setter(e.target.value)} placeholder={ph}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500 transition-colors">← Back</button>
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold transition-all">
                Continue → <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Review ── */}
        {step === 2 && selectedCard && (
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-white font-bold text-lg mb-1">Review & Generate</h2>
            <p className="text-gray-500 text-sm mb-5">Review the details below before generating your USPTO provisional patent application draft.</p>

            <div className="space-y-3 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2 text-sm">
                <p className="text-gray-400">Invention: <span className="text-white font-semibold">{selectedCard.headline}</span></p>
                <p className="text-gray-400">Alias: <span className="text-white font-mono text-xs">{selectedCard.alias}</span></p>
                <p className="text-gray-400">Category: <span className="text-white">{selectedCard.category}</span></p>
                <p className="text-gray-400">Stage: <span className="text-white">{selectedCard.stage}</span></p>
                <p className="text-gray-400">Entity Status: <span className="text-white">{ENTITY_STATUSES.find(e => e.value === entityStatus)?.label}</span></p>
                <p className="text-gray-400">Inventor info: <span className="text-white">{includeIdentity && inventorName ? inventorName : "Anonymous (placeholders)"}</span></p>
              </div>

              <div className="bg-yellow-950/20 border border-yellow-900/40 rounded-xl p-4 flex gap-3">
                <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-300 font-bold text-xs mb-1">Important Notice</p>
                  <p className="text-gray-400 text-xs leading-relaxed">This draft is AI-generated for reference purposes only and does not constitute legal advice. Have a registered USPTO patent attorney or agent review before filing. Using <span className="font-bold text-white">Claude Sonnet</span> for maximum legal accuracy — uses additional integration credits.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500 transition-colors">← Back</button>
              <button onClick={handleGenerate} disabled={generating}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-60 transition-all">
                {generating ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                {generating ? "Generating Draft…" : "Generate USPTO Provisional Draft"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Draft & Checklist ── */}
        {step === 3 && draft && (
          <div className="p-5 max-w-5xl mx-auto">
            {/* Title bar */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-white font-black text-base">{draft.title || selectedCard?.headline}</h2>
                <p className="text-gray-500 text-xs mt-0.5">USPTO Provisional Patent Application Draft · {ENTITY_STATUSES.find(e => e.value === entityStatus)?.label} · {new Date().toLocaleDateString()}</p>
                {draft.filing_date_recommendation && (
                  <p className="text-green-400 text-xs mt-1 font-semibold">📅 {draft.filing_date_recommendation}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                <Shield size={12} className="text-green-400" />
                <span>{requiredChecked}/{requiredCount} required items checked</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 mb-5">
              {[["draft", "📄 Application Draft"], ["claims", "⚖️ Claims"], ["checklist", `✅ Filing Checklist (${checkedCount}/${checklist.length})`], ["notes", "📋 Attorney Notes"]].map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${activeTab === id ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Draft Sections */}
            {activeTab === "draft" && (
              <div className="space-y-3">
                {(draft.sections || []).map((section, i) => (
                  <DraftSection key={i} section={section} />
                ))}
                {draft.abstract && (
                  <DraftSection section={{ heading: "Abstract", content: draft.abstract }} />
                )}
                {(draft.drawings_needed || []).length > 0 && (
                  <div className="border border-gray-800 rounded-xl p-4 bg-gray-900">
                    <h4 className="text-white font-bold text-sm mb-2">Required Drawings</h4>
                    <ol className="space-y-1">
                      {draft.drawings_needed.map((d, i) => (
                        <li key={i} className="text-gray-400 text-xs"><span className="text-gray-600 font-mono">FIG. {i+1} — </span>{d}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Claims */}
            {activeTab === "claims" && (
              <div className="space-y-3">
                {(draft.independent_claims || []).length > 0 && (
                  <div className="border border-blue-900/40 rounded-xl overflow-hidden">
                    <div className="bg-blue-950/30 px-4 py-2 border-b border-blue-900/40">
                      <h4 className="text-blue-300 font-bold text-sm">Independent Claims</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      {draft.independent_claims.map((claim, i) => (
                        <div key={i} className="text-gray-300 text-xs leading-relaxed">
                          <span className="text-gray-500 font-bold">{i + 1}. </span>{claim}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(draft.dependent_claims || []).length > 0 && (
                  <div className="border border-gray-800 rounded-xl overflow-hidden">
                    <div className="bg-gray-900 px-4 py-2 border-b border-gray-800">
                      <h4 className="text-gray-300 font-bold text-sm">Dependent Claims</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      {draft.dependent_claims.map((claim, i) => (
                        <div key={i} className="text-gray-400 text-xs leading-relaxed">
                          <span className="text-gray-600 font-bold">{(draft.independent_claims?.length || 0) + i + 1}. </span>{claim}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(draft.prior_art_references || []).length > 0 && (
                  <div className="border border-gray-800 rounded-xl p-4 bg-gray-900">
                    <h4 className="text-white font-bold text-sm mb-2">Prior Art References</h4>
                    <ul className="space-y-1">
                      {draft.prior_art_references.map((ref, i) => (
                        <li key={i} className="text-gray-400 text-xs">• {ref}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Checklist */}
            {activeTab === "checklist" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-xs">Check off items as you prepare them for filing. Required items must be completed before submission.</p>
                  <div className="text-xs text-gray-500">{requiredChecked}/{requiredCount} required · {checkedCount}/{checklist.length} total</div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${checklist.length ? (checkedCount / checklist.length) * 100 : 0}%` }} />
                </div>
                {checklist.map(item => (
                  <ChecklistItem key={item.id} item={item} checked={!!checkedItems[item.id]} onToggle={toggleCheck} />
                ))}
              </div>
            )}

            {/* Attorney Notes */}
            {activeTab === "notes" && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-yellow-400" /> Attorney Review Notes
                </h4>
                <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">{draft.attorney_notes || "No notes generated."}</pre>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-gray-600 text-xs">⚠️ This document is AI-generated for reference only. Consult a licensed USPTO patent attorney or agent before filing any patent application. Filing an incomplete or inaccurate application can result in loss of patent rights.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}