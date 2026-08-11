import { useState } from "react";
import { ArrowLeft, Zap, Download, Check } from "lucide-react";

const LICENSEE_TYPES = [
  "Medical Device Manufacturer",
  "Consumer Electronics Company",
  "Defense / Government Contractor",
  "Pharmaceutical / Biotech",
  "Agricultural / Environmental Company",
  "Software / Platform Company",
  "Other",
];

const DEAL_STRUCTURES = [
  "Royalty on Revenue", "Upfront Licensing Fee", "Equity Stake",
  "Co-Development Agreement", "Exclusive License", "Non-Exclusive License",
];

export default function LicensingBriefGenerator({ onBack }) {
  const [form, setForm] = useState({
    tech: "Schumann-Tuned PEMF Waveform Protocol",
    sourcePlan: "AATCS-P1 Autism Therapy Pod",
    novel: "Sub-threshold Schumann resonance tuning with closed-loop AI dosimetry — no existing device combines these.",
    licenseeType: "Medical Device Manufacturer",
    deal: ["Royalty on Revenue", "Non-Exclusive License"],
    gets: "Full technical documentation, build plans, protocol specifications, and engineering support package.",
    protected: "Auto-pulled from IP Tracker: 2 trade secrets, 4 drafted claims, 1 pending patent application.",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleDeal = (d) => setForm(prev => ({ ...prev, deal: prev.deal.includes(d) ? prev.deal.filter(x => x !== d) : [...prev.deal, d] }));

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-zarp-muted hover:text-zarp-text text-sm transition-colors">
          <ArrowLeft size={14} /> Back to Export Center
        </button>
        <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider" style={{ backgroundColor: "hsl(var(--zarp-blue) / 0.15)", color: "hsl(var(--zarp-blue))" }}>PRO</span>
      </div>

      {!generated ? (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-zarp-border bg-zarp-card p-5 space-y-3">
            <h3 className="text-zarp-text font-bold text-sm mb-2">Licensing Brief Configuration</h3>
            <Field label="What You're Licensing"><input value={form.tech} onChange={e => set("tech", e.target.value)} className="cfg-input" /></Field>
            <Field label="Source Device Plan">
              <select value={form.sourcePlan} onChange={e => set("sourcePlan", e.target.value)} className="cfg-input">
                <option>AATCS-P1 Autism Therapy Pod</option>
                <option>ZDS-PTSD-1 Combat Recovery Pod</option>
                <option>AuraWell MedBed AATCS-P2</option>
              </select>
            </Field>
            <Field label="What Makes It Novel (150 chars)"><textarea value={form.novel} onChange={e => set("novel", e.target.value)} maxLength={150} rows={3} className="cfg-input resize-none" /></Field>
            <Field label="Target Licensee Type">
              <div className="space-y-1.5">
                {LICENSEE_TYPES.map(t => (
                  <button key={t} onClick={() => set("licenseeType", t)} className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${form.licenseeType === t ? "border-zarp-blue/50 bg-zarp-blue/10 text-zarp-text" : "border-zarp-border text-zarp-muted"}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.licenseeType === t ? "border-zarp-blue" : "border-zarp-border"}`} style={form.licenseeType === t ? { backgroundColor: "hsl(var(--zarp-blue))" } : {}} />
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Deal Structure Preference (multi-select)">
              <div className="flex flex-wrap gap-2">
                {DEAL_STRUCTURES.map(d => (
                  <button key={d} onClick={() => toggleDeal(d)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${form.deal.includes(d) ? "border-zarp-blue/50 bg-zarp-blue/15 text-zarp-blue" : "border-zarp-border text-zarp-muted"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="What Licensee Gets"><textarea value={form.gets} onChange={e => set("gets", e.target.value)} rows={2} className="cfg-input resize-none" /></Field>
            <Field label="What's Protected (auto-pull from IP Tracker)"><textarea value={form.protected} onChange={e => set("protected", e.target.value)} rows={2} className="cfg-input resize-none" /></Field>
            <div className="border-t border-zarp-border pt-3">
              <h4 className="text-zarp-text text-xs font-bold mb-2">Contact Information</h4>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Name" value={form.contactName} onChange={e => set("contactName", e.target.value)} className="cfg-input text-xs" />
                <input placeholder="Title" value={form.contactTitle} onChange={e => set("contactTitle", e.target.value)} className="cfg-input text-xs" />
                <input placeholder="Email" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} className="cfg-input text-xs" />
                <input placeholder="Phone" value={form.contactPhone} onChange={e => set("contactPhone", e.target.value)} className="cfg-input text-xs" />
              </div>
            </div>
            <button onClick={handleGenerate} disabled={generating} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-zarp-bg font-black text-sm" style={{ backgroundColor: "hsl(var(--zarp-blue))" }}>
              <Zap size={16} /> {generating ? "Generating..." : "Generate Licensing Brief"}
            </button>
          </div>

          {/* Live preview */}
          <div className="rounded-xl border border-zarp-border bg-zarp-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-zarp-border bg-zarp-elevated/50">
              <span className="text-zarp-text text-xs font-bold">Live Preview — One-Page Brief</span>
            </div>
            <div className="p-6 bg-white/95" style={{ aspectRatio: "1 / 1.4" }}>
              <div className="border-b-2 pb-2 mb-3" style={{ borderColor: "#d4af37" }}>
                <p className="text-gray-900 font-black text-sm">{form.tech}</p>
                <p className="text-gray-500 text-[9px]">Licensing Opportunity Brief</p>
              </div>
              <div className="space-y-2 text-[9px] text-gray-700">
                <Section title="Technology Snapshot" body={form.sourcePlan} />
                <Section title="The Innovation" body={form.novel} />
                <Section title="Why Now" body="Market timing aligns with regulatory shifts and growing demand for non-invasive therapy systems." />
                <Section title="What We're Offering" body={form.gets} />
                <Section title="What's Protected" body={form.protected} />
                <div>
                  <p className="font-bold text-gray-900 mb-0.5">Deal Structures Available</p>
                  <div className="flex flex-wrap gap-1">
                    {form.deal.map(d => <span key={d} className="px-1.5 py-0.5 rounded bg-gray-100 text-[8px]">{d}</span>)}
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  <p className="font-bold text-gray-900 mb-0.5">Contact</p>
                  <p>{form.contactName || "[Name]"} · {form.contactTitle || "[Title]"}</p>
                  <p>{form.contactEmail || "[email]"} · {form.contactPhone || "[phone]"}</p>
                </div>
              </div>
              <p className="text-gray-400 text-[7px] mt-3 text-center">© Aethon Apex IP Holdings LLC — Confidential</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-zarp-green/40 bg-zarp-green/5 p-4 flex items-center gap-3">
            <Check size={20} className="text-zarp-green" />
            <div>
              <p className="text-zarp-text font-bold text-sm">Licensing Brief Generated</p>
              <p className="text-zarp-muted text-xs">1 page · {form.tech}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <button className="rounded-xl border bg-zarp-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform text-left" style={{ borderColor: "hsl(var(--zarp-gold) / 0.5)" }}>
              <Download size={18} className="text-zarp-gold" />
              <div><p className="text-zarp-text text-sm font-bold">Download PDF</p><p className="text-zarp-muted text-[10px]">One-page brief</p></div>
            </button>
            <button className="rounded-xl border bg-zarp-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform text-left" style={{ borderColor: "hsl(var(--zarp-blue) / 0.5)" }}>
              <Download size={18} className="text-zarp-blue" />
              <div><p className="text-zarp-text text-sm font-bold">Download DOCX</p><p className="text-zarp-muted text-[10px]">Editable format</p></div>
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
        .cfg-input:focus { border-color: hsl(var(--zarp-blue) / 0.5); }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="block text-zarp-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">{label}</label>{children}</div>;
}

function Section({ title, body }) {
  return <div><p className="font-bold text-gray-900 mb-0.5">{title}</p><p className="leading-relaxed">{body}</p></div>;
}