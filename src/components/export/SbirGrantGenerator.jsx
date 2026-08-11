import { useState } from "react";
import { ArrowLeft, Zap, Download, Check, AlertTriangle, FileText } from "lucide-react";

const PROGRAMS = [
  { id: "sbir1", label: "SBIR Phase I", desc: "Feasibility — up to $275K" },
  { id: "sbir2", label: "SBIR Phase II", desc: "Full R&D — up to $1.85M" },
  { id: "sttr1", label: "STTR Phase I", desc: "With university partner" },
  { id: "sttr2", label: "STTR Phase II", desc: "Full R&D with university" },
  { id: "other", label: "Other Federal Grant", desc: "Custom program" },
];

const AGENCIES = ["NIH", "NSF", "DoD / DARPA", "DoE", "NASA", "VA", "BARDA", "Other"];

const SECTIONS = [
  { id: "significance", title: "Significance & Innovation", target: 750, desc: "Why does this matter? What is wrong with current approaches? Why is your approach significantly different and better?" },
  { id: "aims", title: "Specific Aims", target: 1, desc: "Aim 1: Prove feasibility of X. Aim 2: Demonstrate Y. Aim 3: Validate Z." },
  { id: "approach", title: "Approach", target: 6, desc: "Preliminary Data | Research Design | Methods | Timeline | Potential Problems & Solutions" },
  { id: "commercial", title: "Commercialization Plan", target: 2, desc: "Market opportunity | Product pathway | Regulatory strategy | Business model | Revenue projections" },
  { id: "team", title: "Team & Qualifications", target: 1, desc: "Pulls from Team section of IP profile" },
];

export default function SbirGrantGenerator({ onBack }) {
  const [program, setProgram] = useState("sbir1");
  const [agency, setAgency] = useState("NIH");
  const [sections, setSections] = useState({
    significance: "Current electromagnetic therapy approaches lack closed-loop biometric adaptation, resulting in one-size-fits-all protocols that fail to account for individual neurophysiological variability. Our AATCS-P1 platform integrates real-time HRV, EEG, and GSR feedback with AI-driven protocol adjustment — a paradigm shift from static to adaptive bioelectromagnetic therapy. This innovation enables personalized dosimetry across 9 simultaneous modalities, significantly improving therapeutic outcomes for ASD populations.",
    aims: "Aim 1: Prove feasibility of closed-loop AI dosimetry in a single-modality PEMF configuration.\nAim 2: Demonstrate multi-modal synergy in a pediatric ASD cohort (n=30).\nAim 3: Validate clinical outcomes via standardized behavioral assessment scales.",
    approach: "Preliminary Data: Bench-top validation of Schumann-tuned PEMF coil array completed.\nResearch Design: Phase I feasibility — 12-week single-arm open label.\nMethods: Biometric capture via ARM Cortex-A72 + STM32H7 controller; outcome measures: ATEC, SRS-2, CGI-I.\nTimeline: Months 1-3 setup, 4-9 intervention, 10-12 analysis.\nPotential Problems: Sensor artifact noise — mitigated by adaptive filtering.",
    commercial: "Market opportunity: $2.1B ASD therapy market (2026), 12% CAGR. Product pathway: FDA Class II 510(k). Regulatory strategy: De Novo pathway. Business model: Clinical + home-use dual channel. Revenue projections: $8M Year 3, $24M Year 5.",
    team: "Principal Investigator: [From IP Profile Team Section]\nCo-Investigator: [From IP Profile]\nAdvisory Board: [From IP Profile]",
  });
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const setSection = (id, val) => setSections(prev => ({ ...prev, [id]: val }));

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1500);
  };

  const compliance = [
    { check: true, label: "Word count within limit" },
    { check: true, label: "Required sections present" },
    { check: false, label: "Missing: Preliminary Data subsection" },
    { check: true, label: "Format matches agency requirements" },
    { check: true, label: "No prohibited language detected" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-zarp-muted hover:text-zarp-text text-sm transition-colors">
          <ArrowLeft size={14} /> Back to Export Center
        </button>
        <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider" style={{ backgroundColor: "hsl(var(--zarp-violet) / 0.15)", color: "hsl(var(--zarp-violet))" }}>PRO</span>
      </div>

      {!generated ? (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Selectors */}
            <div className="rounded-xl border border-zarp-border bg-zarp-card p-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zarp-muted text-[10px] font-bold uppercase tracking-wider mb-2">Program</label>
                  <div className="space-y-1.5">
                    {PROGRAMS.map(p => (
                      <button key={p.id} onClick={() => setProgram(p.id)} className={`w-full flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${program === p.id ? "border-zarp-violet/50 bg-zarp-violet/10" : "border-zarp-border"}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${program === p.id ? "border-zarp-violet" : "border-zarp-border"}`} style={program === p.id ? { backgroundColor: "hsl(var(--zarp-violet))" } : {}} />
                        <div><p className="text-zarp-text text-xs font-bold">{p.label}</p><p className="text-zarp-muted text-[10px]">{p.desc}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-zarp-muted text-[10px] font-bold uppercase tracking-wider mb-2">Agency</label>
                  <div className="flex flex-wrap gap-2">
                    {AGENCIES.map(a => (
                      <button key={a} onClick={() => setAgency(a)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${agency === a ? "border-zarp-violet/50 bg-zarp-violet/15 text-zarp-violet" : "border-zarp-border text-zarp-muted"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section builder */}
            <div className="rounded-xl border border-zarp-border bg-zarp-card p-5 space-y-4">
              <h3 className="text-zarp-text font-bold text-sm">Section Builder</h3>
              {SECTIONS.map(s => (
                <div key={s.id} className="rounded-lg border border-zarp-border bg-zarp-elevated/30 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-zarp-text text-xs font-bold">{s.title}</p>
                    <span className="text-zarp-muted text-[10px]">Target: {s.target}{s.target > 1 ? " pages" : " page"}</span>
                  </div>
                  <p className="text-zarp-muted text-[10px] mb-2">{s.desc}</p>
                  <textarea
                    value={sections[s.id]}
                    onChange={e => setSection(s.id, e.target.value)}
                    rows={s.target > 1 ? 5 : 3}
                    className="cfg-input resize-none text-xs"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-zarp-muted text-[9px]">{sections[s.id].split(/\s+/).length} words</span>
                    <button className="text-zarp-violet text-[10px] hover:underline flex items-center gap-1"><Zap size={9} /> AI Fill from Research</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance checker */}
          <div className="space-y-4">
            <div className="rounded-xl border border-zarp-border bg-zarp-card p-4 sticky top-4">
              <h3 className="text-zarp-text font-bold text-sm mb-3">Compliance Checker</h3>
              <div className="space-y-2">
                {compliance.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {c.check ? <Check size={12} className="text-zarp-green" /> : <AlertTriangle size={12} className="text-amber-400" />}
                    <span className={`text-xs ${c.check ? "text-zarp-muted" : "text-amber-400"}`}>{c.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-zarp-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-zarp-muted text-[10px]">Agency format</span>
                  <span className="text-zarp-text text-xs font-bold">{agency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zarp-muted text-[10px]">Program</span>
                  <span className="text-zarp-text text-xs font-bold">{PROGRAMS.find(p => p.id === program)?.label}</span>
                </div>
              </div>
              <button onClick={handleGenerate} disabled={generating} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-zarp-bg font-bold text-sm" style={{ backgroundColor: "hsl(var(--zarp-violet))" }}>
                <Zap size={14} /> {generating ? "Generating..." : "Generate Grant Sections"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-zarp-green/40 bg-zarp-green/5 p-4 flex items-center gap-3">
            <Check size={20} className="text-zarp-green" />
            <div>
              <p className="text-zarp-text font-bold text-sm">Grant Sections Generated</p>
              <p className="text-zarp-muted text-xs">{PROGRAMS.find(p => p.id === program)?.label} · {agency} · 5 sections</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <button className="rounded-xl border bg-zarp-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform text-left" style={{ borderColor: "hsl(var(--zarp-violet) / 0.5)" }}>
              <FileText size={18} className="text-zarp-violet" />
              <div><p className="text-zarp-text text-sm font-bold">Download DOCX</p><p className="text-zarp-muted text-[10px]">Agency template</p></div>
            </button>
            <button className="rounded-xl border bg-zarp-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform text-left" style={{ borderColor: "hsl(var(--zarp-gold) / 0.5)" }}>
              <Download size={18} className="text-zarp-gold" />
              <div><p className="text-zarp-text text-sm font-bold">Download PDF</p><p className="text-zarp-muted text-[10px]">Formatted</p></div>
            </button>
            <button onClick={() => setGenerated(false)} className="rounded-xl border border-zarp-border bg-zarp-elevated p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform text-left">
              <div><p className="text-zarp-text text-sm font-bold">Generate New</p><p className="text-zarp-muted text-[10px]">Start over</p></div>
            </button>
          </div>
          <button onClick={onBack} className="px-4 py-2.5 rounded-lg bg-zarp-elevated text-zarp-muted text-sm font-bold hover:text-zarp-text transition-colors">Back to Export Center</button>
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
        .cfg-input:focus { border-color: hsl(var(--zarp-violet) / 0.5); }
      `}</style>
    </div>
  );
}