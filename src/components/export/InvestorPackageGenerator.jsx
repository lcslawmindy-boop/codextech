import { useState } from "react";
import { ArrowLeft, Check, AlertTriangle, Lock, Zap, Download, Mail, Link2, Cloud, ChevronRight, ChevronDown, Eye, FileText } from "lucide-react";

const SECTIONS = [
  { id: "cover", title: "Cover Page", desc: "Tagline, classification, version badge", auto: true },
  { id: "toc", title: "Table of Contents", desc: "Auto-generated", auto: true },
  { id: "legal", title: "Legal Notice & Disclaimer", desc: "7-section legal protection", auto: true },
  { id: "exec", title: "Executive Summary & Mission", desc: "", auto: false },
  { id: "problem", title: "Problem Statement", desc: "Market need", auto: false },
  { id: "tech", title: "Technology Overview", desc: "From Device Build Plans", auto: false },
  { id: "arch", title: "Multi-System IP Architecture", desc: "", auto: false },
  { id: "ip", title: "Intellectual Property Portfolio", desc: "From IP Tracker", auto: true },
  { id: "market", title: "Market Analysis", desc: "TAM/SAM/SOM framework", auto: false },
  { id: "capital", title: "Capital Stack & Use of Funds", desc: "", auto: false },
  { id: "financial", title: "Financial Projections", desc: "", auto: false },
  { id: "grant", title: "Grant Strategy", desc: "SBIR/STTR roadmap", auto: false },
  { id: "risk", title: "Risk Register", desc: "", auto: false },
  { id: "team", title: "Team & Advisors", desc: "", auto: false },
  { id: "appA", title: "Appendix A — Device Build Plan Details", desc: "", auto: true },
  { id: "appB", title: "Appendix B — Engineering Concept Figures", desc: "", auto: true },
  { id: "appC", title: "Appendix C — Research Node Source Citations", desc: "", auto: true },
  { id: "appD", title: "Appendix D — IP Status & Trade Secret Declarations", desc: "", auto: true },
];

const LEGAL_PROTECTIONS = [
  "Confidentiality header and footer on every page",
  "Concept visualization notice on all figures",
  "No medical claims statement (page 2)",
  "IP pre-filing status corrections",
  "Trade secret protection notice",
  "Forward-looking statements disclaimer",
  "Version + date watermark",
];

const CLASSIFICATIONS = ["Confidential", "Restricted", "Internal", "Public"];

const STEPS = ["Configuration", "Sections", "Data Sources", "Preview & Generate", "Download"];

export default function InvestorPackageGenerator({ onBack }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    title: "Aethon Apex IP Holdings LLC — Master Investor & Grant Package",
    code: "ZARP-INV-0001",
    revision: "A",
    date: new Date().toISOString().split("T")[0],
    version: 1,
    classification: "Confidential",
    recipient: "",
    company: "Aethon Apex IP Holdings LLC",
    address: "Henderson, NV 89002",
    website: "zarpdatabase.base44.app",
    color: "#d4af37",
  });
  const [selectedSections, setSelectedSections] = useState(SECTIONS.map(s => s.id));
  const [legal, setLegal] = useState(LEGAL_PROTECTIONS.map(() => true));
  const [expandedSection, setExpandedSection] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [generated, setGenerated] = useState(false);

  const toggleSection = (id) => {
    setSelectedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const includedCount = selectedSections.length;
  const estPages = Math.max(8, includedCount * 2 + 6);

  const handleGenerate = () => {
    setGenerating(true);
    setGenStep(0);
    const interval = setInterval(() => {
      setGenStep(prev => {
        if (prev >= includedCount) {
          clearInterval(interval);
          setGenerating(false);
          setGenerated(true);
          setStep(5);
          return prev;
        }
        return prev + 1;
      });
    }, 250);
  };

  const setCfg = (k, v) => setConfig(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-zarp-muted hover:text-zarp-text text-sm transition-colors">
          <ArrowLeft size={14} /> Back to Export Center
        </button>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider" style={{ backgroundColor: "hsl(var(--zarp-gold) / 0.15)", color: "hsl(var(--zarp-gold))" }}>PRO</span>
          <span className="text-zarp-muted text-xs font-mono">{config.code} · Rev {config.revision}</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => {
          const stepNum = i + 1;
          const active = step === stepNum;
          const done = step > stepNum;
          return (
            <div key={s} className="flex items-center flex-1">
              <button
                onClick={() => !generated && step > stepNum && setStep(stepNum)}
                disabled={generated}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all flex-1 ${active ? "bg-zarp-elevated text-zarp-text" : done ? "text-zarp-gold" : "text-zarp-muted"}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${active ? "text-zarp-bg" : done ? "" : "bg-zarp-elevated"}`} style={active ? { backgroundColor: "hsl(var(--zarp-gold))" } : done ? { color: "hsl(var(--zarp-gold))" } : {}} >
                  {done ? <Check size={10} /> : stepNum}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className={`w-4 h-px ${done ? "bg-zarp-gold" : "bg-zarp-border"}`} />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Configuration */}
      {step === 1 && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-zarp-border bg-zarp-card p-5 space-y-3">
            <h3 className="text-zarp-text font-bold text-sm mb-2">Package Configuration</h3>
            <Field label="Document Title"><input value={config.title} onChange={e => setCfg("title", e.target.value)} className="cfg-input" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Document Code"><input value={config.code} onChange={e => setCfg("code", e.target.value)} className="cfg-input font-mono" /></Field>
              <Field label="Revision"><input value={config.revision} onChange={e => setCfg("revision", e.target.value)} className="cfg-input" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date"><input type="date" value={config.date} onChange={e => setCfg("date", e.target.value)} className="cfg-input" /></Field>
              <Field label="Version"><input type="number" value={config.version} onChange={e => setCfg("version", parseInt(e.target.value) || 1)} className="cfg-input" /></Field>
            </div>
            <Field label="Classification">
              <select value={config.classification} onChange={e => setCfg("classification", e.target.value)} className="cfg-input">
                {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Authorized Recipient (optional)"><input value={config.recipient} onChange={e => setCfg("recipient", e.target.value)} placeholder="Name / Organization" className="cfg-input" /></Field>
          </div>
          <div className="rounded-xl border border-zarp-border bg-zarp-card p-5 space-y-3">
            <h3 className="text-zarp-text font-bold text-sm mb-2">Company Branding</h3>
            <Field label="Company Name"><input value={config.company} onChange={e => setCfg("company", e.target.value)} className="cfg-input" /></Field>
            <Field label="Company Address"><input value={config.address} onChange={e => setCfg("address", e.target.value)} className="cfg-input" /></Field>
            <Field label="Website"><input value={config.website} onChange={e => setCfg("website", e.target.value)} className="cfg-input" /></Field>
            <Field label="Logo Upload (Pro+)">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg bg-zarp-elevated border border-zarp-border text-zarp-muted text-xs hover:text-zarp-text transition-colors">Upload Logo</button>
                <span className="text-zarp-muted text-[10px]">PNG/SVG recommended</span>
              </div>
            </Field>
            <Field label="Primary Color Override">
              <div className="flex items-center gap-2">
                <input type="color" value={config.color} onChange={e => setCfg("color", e.target.value)} className="w-10 h-9 rounded border border-zarp-border bg-transparent cursor-pointer" />
                <input value={config.color} onChange={e => setCfg("color", e.target.value)} className="cfg-input font-mono flex-1" />
              </div>
            </Field>
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-zarp-bg font-bold text-sm" style={{ backgroundColor: "hsl(var(--zarp-gold))" }}>
              Continue to Sections <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Sections */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zarp-border bg-zarp-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zarp-text font-bold text-sm">Select Sections to Include</h3>
              <div className="flex items-center gap-3">
                <span className="text-zarp-muted text-xs">{includedCount} of {SECTIONS.length} selected</span>
                <button onClick={() => setSelectedSections(SECTIONS.map(s => s.id))} className="text-zarp-gold text-xs hover:underline">Select All</button>
                <button onClick={() => setSelectedSections([])} className="text-zarp-muted text-xs hover:underline">Clear</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {SECTIONS.map(s => {
                const checked = selectedSections.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggleSection(s.id)} className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${checked ? "border-zarp-gold/40 bg-zarp-gold/5" : "border-zarp-border bg-zarp-elevated/30 opacity-60"}`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${checked ? "bg-zarp-gold" : "border border-zarp-border"}`}>
                      {checked && <Check size={12} className="text-zarp-bg" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-zarp-text text-xs font-semibold">{s.title}</p>
                        {s.auto && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-zarp-blue/15 text-zarp-blue">AUTO</span>}
                      </div>
                      {s.desc && <p className="text-zarp-muted text-[10px] mt-0.5">{s.desc}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border border-zarp-border bg-zarp-card p-5">
            <h3 className="text-zarp-text font-bold text-sm mb-3">Legal Protections <span className="text-zarp-muted text-xs font-normal">— applied to every page</span></h3>
            <div className="grid md:grid-cols-2 gap-2">
              {LEGAL_PROTECTIONS.map((lp, i) => (
                <button key={i} onClick={() => setLegal(prev => prev.map((v, j) => j === i ? !v : v))} className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${legal[i] ? "border-zarp-green/40 bg-zarp-green/5" : "border-zarp-border opacity-50"}`}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${legal[i] ? "bg-zarp-green" : "border border-zarp-border"}`}>
                    {legal[i] && <Check size={12} className="text-zarp-bg" />}
                  </div>
                  <span className="text-zarp-text text-xs">{lp}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-lg bg-zarp-elevated text-zarp-muted text-sm font-bold hover:text-zarp-text transition-colors">Back</button>
            <button onClick={() => setStep(3)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-zarp-bg font-bold text-sm" style={{ backgroundColor: "hsl(var(--zarp-gold))" }}>Continue to Data Sources <ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {/* Step 3: Data Sources */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zarp-border bg-zarp-card p-5 space-y-4">
            <h3 className="text-zarp-text font-bold text-sm">Data Source Selectors</h3>
            <DataSourceRow label="Technology Overview pulls from:" options={["AATCS-P1 Autism Therapy Pod", "ZDS-PTSD-1 Combat Recovery Pod", "AuraWell MedBed AATCS-P2"]} />
            <DataSourceRow label="IP Portfolio pulls from:" options={["Auto: IP Tracker (28 active patents)"]} auto />
            <DataSourceRow label="Financial Projections:" options={["Manual entry with placeholders", "Template — SaaS revenue model", "Template — Hardware + Licensing"]} />
            <DataSourceRow label="Market Analysis data:" options={["Auto: ZARP market intelligence", "Manual TAM/SAM/SOM entry"]} />
            <div className="border-t border-zarp-border pt-4">
              <h4 className="text-zarp-text text-xs font-bold mb-2">Team & Advisors <span className="text-zarp-muted font-normal">— inline form</span></h4>
              <div className="space-y-2">
                {[1, 2, 3].map(n => (
                  <div key={n} className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <input placeholder="Name" className="cfg-input text-xs" />
                    <input placeholder="Title" className="cfg-input text-xs" />
                    <input placeholder="Bio (brief)" className="cfg-input text-xs" />
                    <input placeholder="LinkedIn URL" className="cfg-input text-xs" />
                  </div>
                ))}
              </div>
              <button className="mt-2 text-zarp-gold text-xs hover:underline">+ Add team member</button>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2.5 rounded-lg bg-zarp-elevated text-zarp-muted text-sm font-bold hover:text-zarp-text transition-colors">Back</button>
            <button onClick={() => setStep(4)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-zarp-bg font-bold text-sm" style={{ backgroundColor: "hsl(var(--zarp-gold))" }}>Continue to Preview <ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {/* Step 4: Preview & Generate */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="grid lg:grid-cols-5 gap-4">
            {/* Preview */}
            <div className="lg:col-span-3 rounded-xl border border-zarp-border bg-zarp-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-zarp-border bg-zarp-elevated/50">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-zarp-gold" />
                  <span className="text-zarp-text text-xs font-bold">Live Document Preview</span>
                </div>
                <span className="text-zarp-muted text-[10px]">Estimated: {estPages} pages</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto p-4 space-y-3 bg-zarp-bg/50">
                {selectedSections.map((sid, i) => {
                  const s = SECTIONS.find(x => x.id === sid);
                  return (
                    <div key={sid} className="rounded-lg border border-zarp-border bg-white/95 p-4 shadow-sm" style={{ aspectRatio: "1 / 1.3" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-[8px] font-mono uppercase">{config.classification}</span>
                        <span className="text-gray-400 text-[8px] font-mono">{config.code} · Rev {config.revision} · v{config.version}</span>
                      </div>
                      <div className="text-center py-8">
                        {i === 0 ? (
                          <>
                            <div className="w-12 h-12 rounded-lg mx-auto mb-3" style={{ backgroundColor: config.color }} />
                            <p className="text-gray-900 font-black text-sm">{config.company}</p>
                            <p className="text-gray-600 text-[10px] mt-1">{config.title}</p>
                            <p className="text-gray-400 text-[8px] mt-4">{config.date}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-700 font-bold text-[11px]">{s.title}</p>
                            <div className="mt-3 space-y-1">
                              <div className="h-1 bg-gray-200 rounded w-3/4 mx-auto" />
                              <div className="h-1 bg-gray-200 rounded w-full" />
                              <div className="h-1 bg-gray-200 rounded w-5/6 mx-auto" />
                              <div className="h-1 bg-gray-200 rounded w-2/3 mx-auto" />
                            </div>
                            {s.auto && <p className="text-blue-500 text-[8px] mt-3 font-bold">Auto-generated from data</p>}
                          </>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between">
                        <span className="text-gray-300 text-[7px]">© {config.company}</span>
                        <span className="text-gray-300 text-[7px]">Page {i + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Outline */}
            <div className="lg:col-span-2 rounded-xl border border-zarp-border bg-zarp-card p-4">
              <h3 className="text-zarp-text text-xs font-bold mb-3">Document Outline</h3>
              <div className="space-y-1 max-h-[420px] overflow-y-auto">
                {selectedSections.map((sid, i) => {
                  const s = SECTIONS.find(x => x.id === sid);
                  const isExpanded = expandedSection === sid;
                  return (
                    <div key={sid}>
                      <button onClick={() => setExpandedSection(isExpanded ? null : sid)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-zarp-elevated/50 transition-colors">
                        <span className="text-zarp-muted text-[10px] font-mono w-5">{i + 1}.</span>
                        <span className="text-zarp-text text-[11px] font-semibold flex-1 truncate">{s.title}</span>
                        {s.auto ? <Check size={10} className="text-zarp-green" /> : <AlertTriangle size={10} className="text-amber-400" />}
                        <ChevronDown size={10} className={`text-zarp-muted transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      {isExpanded && (
                        <div className="pl-7 py-1 space-y-1">
                          <p className="text-zarp-muted text-[10px]">{s.auto ? "✅ Auto-Generated" : "⚠️ Needs Input"}</p>
                          <p className="text-zarp-muted text-[10px]">Est. {s.auto ? "150" : "300"} words</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-zarp-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zarp-muted text-[10px]">Total estimated words</span>
                  <span className="text-zarp-text text-xs font-bold">{selectedSections.length * 250}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zarp-muted text-[10px]">Estimated pages</span>
                  <span className="text-zarp-text text-xs font-bold">{estPages}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="px-4 py-2.5 rounded-lg bg-zarp-elevated text-zarp-muted text-sm font-bold hover:text-zarp-text transition-colors">Back</button>
            <button onClick={handleGenerate} className="flex items-center gap-2 px-6 py-3 rounded-lg text-zarp-bg font-black text-sm" style={{ backgroundColor: "hsl(var(--zarp-gold))", boxShadow: "0 0 20px hsl(var(--zarp-gold) / 0.3)" }}>
              <Zap size={16} /> Generate Full Package
            </button>
          </div>
        </div>
      )}

      {/* Generating overlay */}
      {generating && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-zarp-card border border-zarp-gold/30 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "hsl(var(--zarp-gold) / 0.15)" }}>
              <FileText size={28} className="text-zarp-gold animate-pulse" />
            </div>
            <h3 className="text-zarp-text font-bold text-lg mb-2">Building Document</h3>
            <p className="text-zarp-muted text-sm mb-4">Building Section {genStep} of {includedCount}...</p>
            <div className="w-full h-2 rounded-full bg-zarp-elevated overflow-hidden">
              <div className="h-full rounded-full transition-all duration-200" style={{ width: `${(genStep / includedCount) * 100}%`, backgroundColor: "hsl(var(--zarp-gold))" }} />
            </div>
            <p className="text-zarp-muted text-xs mt-3">{Math.round((genStep / includedCount) * 100)}% complete</p>
          </div>
        </div>
      )}

      {/* Step 5: Download */}
      {step === 5 && generated && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zarp-green/40 bg-zarp-green/5 p-4 flex items-center gap-3">
            <Check size={20} className="text-zarp-green" />
            <div>
              <p className="text-zarp-text font-bold text-sm">Package Generated Successfully</p>
              <p className="text-zarp-muted text-xs">{estPages} pages · {selectedSections.length} sections · {config.code} v{config.version}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <DownloadCard icon={FileText} label="Download PDF" desc="Complete package" color="hsl(var(--zarp-gold))" />
            <DownloadCard icon={FileText} label="Download DOCX" desc="Editable format" color="hsl(var(--zarp-blue))" />
            <DownloadCard icon={Download} label="Complete Bundle" desc="PDF + DOCX + JSON (.zip)" color="hsl(var(--zarp-violet))" />
          </div>
          <div className="rounded-xl border border-zarp-border bg-zarp-card p-5">
            <h3 className="text-zarp-text font-bold text-sm mb-3">Share Options</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <ShareOption icon={Mail} title="Email Link" desc="Enter recipient email — encrypted download link" actionLabel="Send" />
              <ShareOption icon={Link2} title="Shareable Link" desc="Copy link — expiry: 7 / 14 / 30 days" actionLabel="Copy" />
              <ShareOption icon={Cloud} title="Save to Cloud" desc="OneDrive / Google Drive (if connected)" actionLabel="Save" />
            </div>
          </div>
          <div className="rounded-xl border border-zarp-border bg-zarp-card p-5">
            <h3 className="text-zarp-text font-bold text-sm mb-2">Version Control</h3>
            <p className="text-zarp-muted text-xs">Auto-saved to Export History · Version {config.version} · {new Date().toLocaleString()}</p>
          </div>
          <div className="flex justify-between">
            <button onClick={onBack} className="px-4 py-2.5 rounded-lg bg-zarp-elevated text-zarp-muted text-sm font-bold hover:text-zarp-text transition-colors">Back to Export Center</button>
            <button onClick={() => { setGenerated(false); setStep(1); }} className="px-5 py-2.5 rounded-lg bg-zarp-elevated text-zarp-text text-sm font-bold hover:bg-zarp-gold/20 transition-colors">Generate New Package</button>
          </div>
        </div>
      )}

      <style>{`
        .cfg-input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          background: hsl(var(--zarp-elevated));
          border: 1px solid hsl(var(--zarp-border));
          color: hsl(var(--zarp-text));
          font-size: 13px;
          outline: none;
        }
        .cfg-input:focus { border-color: hsl(var(--zarp-gold) / 0.5); }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-zarp-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function DataSourceRow({ label, options, auto }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 py-2 border-b border-zarp-border/50">
      <span className="text-zarp-muted text-xs md:w-64 flex-shrink-0">{label}</span>
      <select className="cfg-input text-xs flex-1">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      {auto && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-zarp-blue/15 text-zarp-blue">AUTO</span>}
    </div>
  );
}

function DownloadCard({ icon: Icon, label, desc, color }) {
  return (
    <button className="rounded-xl border bg-zarp-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform text-left" style={{ borderColor: color + "50" }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "20" }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-zarp-text text-sm font-bold">{label}</p>
        <p className="text-zarp-muted text-[10px]">{desc}</p>
      </div>
      <Download size={14} className="ml-auto text-zarp-muted" />
    </button>
  );
}

function ShareOption({ icon: Icon, title, desc, actionLabel }) {
  return (
    <div className="rounded-lg border border-zarp-border bg-zarp-elevated/50 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-zarp-blue" />
        <span className="text-zarp-text text-xs font-bold">{title}</span>
      </div>
      <p className="text-zarp-muted text-[10px] mb-2">{desc}</p>
      <button className="w-full py-1.5 rounded-lg bg-zarp-elevated border border-zarp-border text-zarp-text text-[10px] font-bold hover:border-zarp-blue/50 transition-colors">{actionLabel}</button>
    </div>
  );
}