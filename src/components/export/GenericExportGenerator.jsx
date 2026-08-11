import { useState } from "react";
import { ArrowLeft, Zap, Download, Check } from "lucide-react";

export default function GenericExportGenerator({ product, onBack }) {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1500);
  };

  const color = product.border === "red" ? "hsl(var(--zarp-red))" : product.border === "amber" ? "hsl(var(--zarp-amber))" : product.border === "gradient" ? "hsl(var(--zarp-violet))" : "hsl(var(--zarp-muted))";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-zarp-muted hover:text-zarp-text text-sm transition-colors">
          <ArrowLeft size={14} /> Back to Export Center
        </button>
        <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider" style={{ backgroundColor: color + "20", color }}>{product.tier}</span>
      </div>

      {!generated ? (
        <div className="rounded-xl border bg-zarp-card p-6 space-y-4" style={{ borderColor: color + "40" }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "20" }}>
              <product.icon size={22} style={{ color }} />
            </div>
            <div>
              <h3 className="text-zarp-text font-bold text-base">{product.title}</h3>
              <p className="text-zarp-muted text-xs">{product.desc}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-zarp-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Document Title</label>
              <input defaultValue={`${product.title} — ZARP Export`} className="cfg-input" />
            </div>
            <div>
              <label className="block text-zarp-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Source / Subject</label>
              <select className="cfg-input">
                <option>Select from your research nodes and device plans...</option>
                <option>AATCS-P1 Autism Therapy Pod</option>
                <option>ZDS-PTSD-1 Combat Recovery Pod</option>
                <option>AuraWell MedBed AATCS-P2</option>
                <option>Multi-Modal Biofield-AI Fusion Engine</option>
              </select>
            </div>
            <div>
              <label className="block text-zarp-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Additional Notes</label>
              <textarea rows={3} placeholder="Any specific requirements or focus areas..." className="cfg-input resize-none" />
            </div>
          </div>
          <button onClick={handleGenerate} disabled={generating} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-zarp-bg font-black text-sm" style={{ backgroundColor: color }}>
            <Zap size={16} /> {generating ? "Generating..." : `Generate ${product.title}`}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-zarp-green/40 bg-zarp-green/5 p-4 flex items-center gap-3">
            <Check size={20} className="text-zarp-green" />
            <div>
              <p className="text-zarp-text font-bold text-sm">{product.title} Generated</p>
              <p className="text-zarp-muted text-xs">Document ready for download</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <button className="rounded-xl border bg-zarp-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform text-left" style={{ borderColor: color }}>
              <Download size={18} style={{ color }} />
              <div><p className="text-zarp-text text-sm font-bold">Download PDF</p><p className="text-zarp-muted text-[10px]">Formatted document</p></div>
            </button>
            <button className="rounded-xl border bg-zarp-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform text-left" style={{ borderColor: "hsl(var(--zarp-blue) / 0.5)" }}>
              <Download size={18} className="text-zarp-blue" />
              <div><p className="text-zarp-text text-sm font-bold">Download DOCX</p><p className="text-zarp-muted text-[10px]">Editable</p></div>
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
        .cfg-input:focus { border-color: ${color}80; }
      `}</style>
    </div>
  );
}