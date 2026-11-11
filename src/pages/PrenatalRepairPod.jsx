import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Brain, ShieldAlert, Baby, Dna, Activity, HeartPulse,
  Beaker, Stethoscope, Lock, CheckCircle2, AlertTriangle, XCircle,
  Layers, Zap, FlaskConical, BookOpen, ChevronDown, ChevronUp, FileText,
  Download, Loader2, Box,
} from "lucide-react";
import PrenatalPodRender from "@/components/PrenatalPodRender";
import PrenatalEngineeringDocs from "@/components/PrenatalEngineeringDocs";
import { generatePrenatalPodPdf } from "@/lib/generatePrenatalPodPdf";

// Honest scope — autism is a neurodevelopmental difference, not "damage to reverse"
const PRENATAL_INJURY_TYPES = [
  { label: "Congenital infection", note: "CMV, rubella, Zika — implicated in ASD-risk neuroinflammation.", verified: "partial" },
  { label: "In-utero hypoxic-ischemic injury", note: "Placental insufficiency, cord compromise — HIE linked to ASD traits.", verified: "partial" },
  { label: "Teratogen / medication exposure", note: "Valproate, alcohol, anticonvulsants — epigenetic disruption.", verified: "partial" },
  { label: "Prematurity-related injury", note: "PVL, germinal-matrix haemorrhage — white-matter injury.", verified: "partial" },
  { label: "Genetic / epigenetic variants", note: "CNVs, fragile X, MECP2 — many core to ASD, not 'damage'.", verified: "partial" },
  { label: "Maternal immune activation", note: "Cytokine storm in pregnancy — neuroinflammation signal.", verified: "partial" },
];

// What the device can honestly target (adjunctive support, not repair)
const TARGET_MECHANISMS = [
  { name: "Neuroinflammation reduction", icon: HeartPulse, verified: "partial", how: "Transcranial PBM + H₂ inhalation target the inflammation axis that prenatal injury amplifies. Early animal + neonatal data.", can: "Reduce markers / support regulation", cannot: "Reverse structural injury or 'cure' autism" },
  { name: "Neural coherence & regulation", icon: Activity, verified: "partial", how: "Cranial PEMF theta + vibroacoustic calming + closed-loop biometrics to titrate dose and prevent sensory overload.", can: "Support state regulation, reduce overload", cannot: "Rewire neurodevelopmental differences" },
  { name: "Gut-brain axis support", icon: Beaker, verified: "partial", how: "Microbiome delivery (Triphala/prebiotic) addressing the gut dysbiosis common in ASD.", can: "Modulate gut-brain signalling", cannot: "Treat core ASD traits directly" },
  { name: "Bioactive / BBB delivery", icon: FlaskConical, verified: "partial", how: "Gold-nanoparticle + Brahmi (BDNF adjunct) under IND. Pharmacology, not 'scalar activation'.", can: "Deliver neurotrophic support", cannot: "Repair DNA or reverse genetic variants" },
  { name: "Epigenetic readout (research only)", icon: Dna, verified: false, how: "IN-VITRO ONLY. Tests whether exposure shifts DNA methylation vs sham. Falsification gate required.", can: "Generate falsifiable data", cannot: "Be used on a child without IRB + pediatric ethics + regulatory clearance" },
  { name: "Closed-loop safety control", icon: Stethoscope, verified: true, how: "HRV/EEG/EDA biometrics auto-reduce intensity to protect a child from overload.", can: "Keep exposure within safe bounds", cannot: "Diagnose or treat any condition" },
];

const SUBSYSTEMS = [
  { ref: "PBM", name: "Transcranial PBM Helmet (pediatric)", verified: true, role: "630/850 nm near-IR, dosimetry-capped for pediatric skull. Strongest evidence anchor. Sham-capable." },
  { ref: "PEMF", name: "Cranial PEMF + Theta Coil Ring", verified: "partial", role: "4–7 Hz theta + 7.83 Hz Schumann for state regulation. Adjunct, not a repair claim." },
  { ref: "HIT", name: "Low-Dose H₂ Inhalation (pediatric)", verified: "partial", role: "Titrated H₂ for neuroinflammation; pediatric flow limits, MQ-8 auto-shutoff." },
  { ref: "GUT", name: "Gut-Brain Microbiome Delivery", verified: "partial", role: "Prebiotic/Triphala oral port; optional IND-gated bioactive. Addresses gut dysbiosis." },
  { ref: "BIO", name: "Pediatric Biometric Closed-Loop", verified: "partial", role: "HRV/EEG/EDA + child-safe caps; ≤200 ms auto-reduction to prevent overload." },
  { ref: "EPI", name: "Epigenetic Reprogramming Interface", verified: false, role: "IN-VITRO ONLY. Never on a child. Tests wave-genome / longitudinal-wave exposure vs sham." },
  { ref: "SHD", name: "Faraday + Soft Pediatric Enclosure", verified: true, role: "EM shielded, child-safe materials (ASTM F963), <100 ms E-stop." },
  { ref: "CTL", name: "Controller + Audit Log", verified: true, role: "Signed firmware, append-only session log, reviewer-readable, IRB-exportable." },
];

const GATES = [
  { stage: "Gate 0 — Reframe & harm screen", req: "Acknowledge autism is a neurodevelopmental difference, not 'damage to reverse'. Remove all 'cure/reverse' language. Map every device claim to a falsifiable endpoint." },
  { stage: "Gate 1 — In-vitro (no child involved)", req: "iPSC-neuron + prenatal-injury model. Exposed vs sham. Pre-registered: DNA methylation, BDNF, TNF-α, viability. Null-result path mandatory." },
  { stage: "Gate 2 — Animal model (pediatric injury)", req: "Relevant prenatal-injury animal model. Randomised, blinded, powered. IACUC. Pediatric dosing. No efficacy claim without dose-finding." },
  { stage: "Gate 3 — Pediatric regulatory + ethics", req: "IND/IMD + IRB with pediatric expertise + assent/consent. Independent DSMB. Investigational-device labeling only." },
  { stage: "Gate 4 — First-in-child (safety only)", req: "Safety-only primary endpoint. Slow titration. DSMB halt rules. No marketing of reversal of autism or brain damage." },
];

const VMAP = { true: "verified", partial: "partial", false: "speculative" };
const VC = {
  verified: { label: "Verified", color: "#22c55e", Icon: CheckCircle2 },
  partial: { label: "Partial / early", color: "#f59e0b", Icon: AlertTriangle },
  speculative: { label: "Speculative", color: "#ef4444", Icon: XCircle },
};
function VBadge({ v }) {
  const c = VC[VMAP[v] || "speculative"];
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 whitespace-nowrap"
      style={{ background: c.color + "20", color: c.color, border: `1px solid ${c.color}40` }}>
      <c.Icon size={9} /> {c.label}
    </span>
  );
}

function Section({ title, children, icon: Icon }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors">
        <span className="flex items-center gap-2 text-white font-bold text-sm">{Icon && <Icon size={14} className="text-cyan-400" />}{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>
      {open && <div className="px-5 pb-4 border-t border-gray-800">{children}</div>}
    </div>
  );
}

export default function PrenatalRepairPod() {
  const [view, setView] = useState("overview");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try { await generatePrenatalPodPdf(); } finally { setExporting(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/neuro-regen-chamber" className="text-gray-400 hover:text-white"><ArrowLeft size={16} /></Link>
            <div className="w-10 h-10 rounded-xl bg-rose-950/50 border border-rose-800 flex items-center justify-center">
              <Baby size={20} className="text-rose-400" />
            </div>
            <div>
              <h1 className="text-base font-black leading-tight">Prenatal Repair Pod — NRC-P Variant</h1>
              <p className="text-gray-500 text-xs">Investigational device concept · prenatal DNA/brain injury → autism adjunctive support</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-950/60 border border-red-800 text-red-400 uppercase tracking-wider">Not for Sale</span>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-yellow-950/40 border border-yellow-800 text-yellow-400 uppercase tracking-wider">Pediatric — IRB Gated</span>
          </div>
        </div>
      </div>

      {/* View tabs */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-5 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {[
            { id: "overview", label: "Overview", icon: <Baby size={14} /> },
            { id: "engineering", label: "Engineering Package", icon: <Box size={14} /> },
          ].map((t) => (
            <button key={t.id} onClick={() => setView(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === t.id ? "bg-gray-800 text-white border border-gray-700" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
              {t.icon}{t.label}
            </button>
          ))}
          {view === "engineering" && (
            <button onClick={handleExport} disabled={exporting} className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold transition-all disabled:opacity-50">
              {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}{exporting ? "Building PDF..." : "Export Full PDF"}
            </button>
          )}
        </div>
      </div>

      {view === "engineering" ? (
        <div className="max-w-4xl mx-auto px-5 py-6 space-y-5">
          <PrenatalPodRender />
          <PrenatalEngineeringDocs />
        </div>
      ) : (
      <div className="max-w-4xl mx-auto px-5 py-6 space-y-5">
        {/* Honest scope banner */}
        <div className="bg-amber-950/30 border border-amber-800/50 rounded-2xl p-4 flex gap-3">
          <ShieldAlert size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-amber-200 text-sm font-bold">Read this first — what this device is, and is not.</p>
            <p className="text-amber-100/70 text-xs leading-relaxed">
              No device can currently reverse or repair brain damage, and autism is a neurodevelopmental difference — not "damage to be reversed." This page is an <strong>investigational device concept</strong> for adjunctive support of children whose prenatal injury (infection, HIE, teratogen, prematurity) contributed to ASD-related dysregulation. It makes <strong>no claim to cure, reverse, or repair autism or brain damage</strong>. Any human use requires IRB approval with pediatric expertise, IND/IMD regulatory clearance, and assent/consent. Speculative mechanisms (wave-genome "DNA repair", scalar EM) stay in-vitro with falsification gates and are never applied to a child.
            </p>
          </div>
        </div>

        {/* Device concept summary */}
        <Section title="Device Concept — NRC-P (Prenatal Variant)" icon={Baby}>
          <p className="text-gray-300 text-xs leading-relaxed mt-3 mb-3">
            A pediatric-scaled variant of the Neuro Regeneration Chamber (NRC-1) tuned to the dysregulations that prenatal injury can amplify in ASD: neuroinflammation, sensory overload, neural incoherence, and gut-brain disruption. Closed-loop biometrics titrate every modality to keep a child safe. The "DNA repair" layer is an in-vitro research interface only — it never operates on a child.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { k: "8", l: "Subsystems", c: "#06b6d4" },
              { k: "2", l: "Verified anchors", c: "#22c55e" },
              { k: "4", l: "Partial / early", c: "#f59e0b" },
              { k: "1", l: "In-vitro only", c: "#ef4444" },
            ].map((s) => (
              <div key={s.l} className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-center">
                <p className="text-2xl font-black" style={{ color: s.c }}>{s.k}</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Prenatal injury types */}
        <Section title="Prenatal injury subtypes linked to ASD-risk dysregulation" icon={Dna}>
          <div className="space-y-2 mt-3">
            {PRENATAL_INJURY_TYPES.map((p) => (
              <div key={p.label} className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-gray-200 text-xs font-bold">{p.label}</p>
                  <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">{p.note}</p>
                </div>
                <VBadge v={p.verified} />
              </div>
            ))}
          </div>
        </Section>

        {/* What it can / cannot do */}
        <Section title="What this device can and cannot do (honest)" icon={ShieldAlert}>
          <div className="space-y-2 mt-3">
            {TARGET_MECHANISMS.map((m) => (
              <div key={m.name} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="flex items-center gap-2 text-white text-xs font-bold"><m.icon size={13} className="text-cyan-400" />{m.name}</span>
                  <VBadge v={m.verified} />
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed mb-2">{m.how}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-950/20 border border-green-800/30 rounded p-2">
                    <p className="text-green-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Can</p>
                    <p className="text-green-100/70 text-[11px] leading-snug">{m.can}</p>
                  </div>
                  <div className="bg-red-950/20 border border-red-800/30 rounded p-2">
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Cannot</p>
                    <p className="text-red-100/70 text-[11px] leading-snug">{m.cannot}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Subsystems */}
        <Section title="Subsystems (pediatric-scaled)" icon={Layers}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {SUBSYSTEMS.map((s) => (
              <div key={s.ref} className="bg-gray-950 border border-gray-800 rounded-lg p-3" style={{ borderTopColor: "#06b6d4", borderTopWidth: 2 }}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800">{s.ref}</span>
                    <span className="text-white text-xs font-bold">{s.name}</span>
                  </span>
                  <VBadge v={s.verified} />
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">{s.role}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Gates */}
        <Section title="Evidence ladder & pediatric governance gates" icon={Lock}>
          <div className="space-y-2 mt-3">
            {GATES.map((g, i) => (
              <div key={g.stage} className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-950/50 border border-amber-800 flex items-center justify-center text-amber-400 text-xs font-black flex-shrink-0">{i}</div>
                <div>
                  <p className="text-white text-xs font-bold mb-0.5">{g.stage}</p>
                  <p className="text-gray-400 text-[11px] leading-relaxed">{g.req}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Cross-links */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-gray-300 text-xs leading-relaxed mb-3">
            <strong className="text-white">Bottom line.</strong> This variant reuses the NRC-1 engineering package and the AuraWell Autism Pod integration template, narrowed to honest adjunctive support (neuroinflammation, regulation, gut-brain, closed-loop safety). The "DNA repair" claim is an in-vitro hypothesis — it is never applied to a child. No reversal of autism or brain damage is claimed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/neuro-regen-chamber" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-900/40 border border-cyan-800 text-cyan-300 text-xs font-bold hover:bg-cyan-900/60">
              <Brain size={13} /> Full NRC Engineering Package
            </Link>
            <Link to="/targeted-therapy-pods" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900/40 border border-rose-800 text-rose-300 text-xs font-bold hover:bg-rose-900/60">
              <HeartPulse size={13} /> AuraWell Autism Pod
            </Link>
            <Link to="/therapy-pod-pro" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">
              <FileText size={13} /> Therapy Pod Pro Docs
            </Link>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}