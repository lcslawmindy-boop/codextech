import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Brain, ShieldAlert, FlaskConical, Database, Zap, BookOpen,
  Layers, Activity, Stethoscope, CheckCircle2, AlertTriangle, XCircle,
  Lock, Scroll, Beaker, HeartPulse, FileText, Box, Download, Loader2,
} from "lucide-react";
import NeuroRegenChamberRender from "../components/NeuroRegenChamberRender";
import NeuroRegenEngineeringDocs from "../components/NeuroRegenEngineeringDocs";
import { generateNeuroRegenPdf } from "../lib/generateNeuroRegenPdf";

// ── Synthesis content (existing) ──────────────────────────────────────────
const PROBLEM_TYPES = [
  { label: "In-utero hypoxic-ischemic injury (HIE)", note: "Stroke, placental insufficiency, cord compromise before birth." },
  { label: "Congenital infection / teratogen exposure", note: "CMV, Zika, alcohol, anticonvulsants — disrupts neurodevelopment." },
  { label: "Genetic neurodevelopmental disorders", note: "Fragile X, Rett, tuberous sclerosis, microdeletions, CNVs." },
  { label: "Neural tube & migration defects", note: "Spina bifida, lissencephaly, schizencephaly, periventricular nodular heterotopia." },
  { label: "Prematurity-related injury", note: "Periventricular leukomalacia (PVL), germinal-matrix haemorrhage, PVHI." },
];

const VERIFIED_ANCHORS = [
  "Transcranial / near-infrared photobiomodulation (PBM): mitochondrial support, reduced neuroinflammation; active neonatal-HIE and TBI research.",
  "Neurogenesis & BDNF signalling: hippocampal plasticity is real and measurable; enhancing it is an active drug/device frontier.",
  "Gut-brain axis & microbiome: early-life dysbiosis is implicated in several neurodevelopmental conditions.",
  "In-vivo partial reprogramming (OSKM/Yamanaka factors): can rejuvenate cells in animal models — frontier, not clinical, teratoma risk.",
  "Exosome & cell-based neuroprotective approaches: investigational neonatal-HIE trials exist.",
  "Epigenetic clocks: biological-age measurement is reproducible; reversing it is not yet established in brain.",
];

const SPECULATIVE = [
  "Scalar / longitudinal EM 'information medicine' (Bearden, Meyl, Priore-class fields).",
  "Gariaev 'wave genome' — DNA read/written by modulated EM/acoustic waves.",
  "Montagnier 'DNA signal in water' and water-memory templates.",
  "Akashic / etheric / Vedic bio-field nadis and chakra scalar coupling.",
  "Soma / Amrita / Bhasma as literal rejuvenating substances.",
  "Rife MOR frequency 'pathogen' framework tied to pleomorphism.",
];

const ASSETS = {
  nodes: [
    { id: "supp_004", title: "Rife Universal Microscope & Beam Ray", verified: false, relevance: "MOR resonance — unverified; frequency-bank concept reusable as a controlled exposure source." },
    { id: "bio_005", title: "Biophoton Emission (Gurwitsch)", verified: "partial", relevance: "Ultra-weak cell photon emission is real; 'information-carrying' coherence is contested." },
    { id: "bio_006", title: "Biophoton Theory (Popp)", verified: "partial", relevance: "DNA photon emission measurable; disease-coherence claims unverified." },
    { id: "bio_010", title: "Wave Genome & Linguistic DNA (Gariaev)", verified: false, relevance: "Unverified. Treat as falsifiable hypothesis, not a repair mechanism." },
    { id: "bio_007", title: "Water Memory & Digital Biology (Benveniste)", verified: false, relevance: "Unverified. No template delivery role without replication." },
  ],
  vedic: [
    { id: "vedic_002", title: "Rasayana — Rejuvenation & Telomere Science", verified: "partial", relevance: "Ashwagandha/shilajit telomere-association data exists; mechanism weak." },
    { id: "vedic_004", title: "Bhasma — Nanoparticle Metal Therapy", verified: "partial", relevance: "Gold nanoparticles cross BBB — real; 'scalar activation' is not." },
    { id: "vedic_009", title: "Shirodhara — Third-Eye Nervous System Reset", verified: "partial", relevance: "Theta induction / vagal effect has modest clinical support." },
    { id: "vedic_011", title: "Brahmi & Shankhpushpi — Nootropic Brain Herbs", verified: "partial", relevance: "Bacopa BDNF / neurogenesis signal in animal data." },
    { id: "vedic_012", title: "Triphala — Gut-Brain Microbiome Tonic", verified: "partial", relevance: "Prebiotic / anti-inflammatory effects plausible." },
  ],
  inventions: [
    { id: "inv_003", title: "MEG-Priore Hybrid Healing Generator", verified: false, relevance: "Priore-class field + Solfeggio — both unverified as repair agents." },
    { id: "inv_008", title: "Rife-Gariaev Wave Genome Repair System", verified: false, relevance: "Explicitly targets 'genetic repair' via unverified wave-genome claim." },
    { id: "inv_012", title: "Shirodhara-Theta Cranial Resonance System", verified: "partial", relevance: "Theta/PEMF entrainment — modest evidence for state induction." },
    { id: "inv_016", title: "Brahmi-Cranial Nootropic Field Enhancer", verified: "partial", relevance: "Cranial PEMF + Bacopa BDNF — neurogenesis adjunct candidate." },
    { id: "inv_020", title: "Swarna Bhasma-Scalar Telomere Activator", verified: false, relevance: "Gold-nanoparticle BBB delivery real; scalar telomerase activation is not." },
    { id: "inv_050", title: "Unified Bio-Scalar Consciousness-Healing-Longevity Pod", verified: false, relevance: "Master integration concept — architecture reference, claims unverified." },
  ],
  hybrids: [
    { id: "hyb_ncer", title: "Negentropic Chrono-Epigenetic Resonator", verified: false, relevance: "Targets epigenetic markers + telomeres in-vitro; falsification gate included." },
    { id: "hyb_cebre", title: "Chrono-Epigenetic Bio-Restoration Engine", verified: false, relevance: "Priore-style longitudinal wave + epigenetic reset; historical-claim replication gate." },
    { id: "hyb_vcsie", title: "Vacuum-Coupled Scalar Interference Extraction", verified: false, relevance: "Energy source hypothesis, not a brain-repair mechanism." },
  ],
  priorart: [
    { id: "PA-Priore", title: "Priore / ONR 1978 longitudinal-wave therapy", verified: false, relevance: "Historical remission claims, never independently replicated under blinding." },
    { id: "PA-Rife", title: "Rife 1934 trial record", verified: false, relevance: "Uncontrolled; no modern replication." },
    { id: "PA-Bedini", title: "Bedini radiant charging", verified: false, relevance: "Energy circuit concept; no biological-repair role." },
  ],
  modalities: [
    { code: "PBM", title: "Photobiomodulation (630/850 nm)", verified: true, relevance: "Strongest anchor — transcranial PBM has the most clinical-trial traction." },
    { code: "PEMF", title: "PEMF (Schumann 7.83 Hz)", verified: "partial", relevance: "Calming/coherence effects modest; not a repair modality alone." },
    { code: "HIT", title: "Hydrogen Inhalation", verified: "partial", relevance: "Neuroinflammation reduction — animal + early human data." },
    { code: "MCT", title: "MicroCurrent (1–999 µA)", verified: "partial", relevance: "Cellular repair / vagal-tone claims; limited CNS evidence." },
    { code: "VAT", title: "Vibroacoustic (30–528 Hz)", verified: "partial", relevance: "Sensory-integration / calming; not reparative." },
    { code: "SFT", title: "Scalar Field", verified: false, relevance: "Unverified as a biological repair agent." },
  ],
  pods: [
    { id: "autism", title: "AuraWell Autism Therapy Pod", verified: "partial", relevance: "Closest existing integration template — 9 modalities + 12 inventions; ASD is neurodevelopmental." },
    { id: "ptsd", title: "AuraWell PTSD Therapy Pod", verified: "partial", relevance: "Theta / vagal reset architecture reusable for nervous-system regulation." },
  ],
};

const SUBSYSTEMS_SYN = [
  { name: "1. Transcranial PBM Core", icon: Zap, verified: true, sources: ["Modality: PBM", "inv_016 BCNFE", "inv_020 SBSTA (BBB delivery only)"], role: "Multi-array 630/850 nm near-IR to cortex. Strongest evidence-backed modality. Dosimetry-controlled, sham-controlled." },
  { name: "2. Cranial PEMF + Theta Entrainment", icon: Activity, verified: "partial", sources: ["inv_012 STCRS", "inv_016 BCNFE", "Modality: PEMF / VAT"], role: "4–7 Hz theta + Schumann PEMF for state induction / vagal tone. Adjunct, not a repair claim." },
  { name: "3. Neuroinflammation Control (H₂ + Microbiome)", icon: HeartPulse, verified: "partial", sources: ["Modality: HIT", "inv_015 TMPGRS", "vedic_012 Triphala"], role: "Hydrogen inhalation + gut-brain microbiome protocol. Targets inflammation axis with early human data." },
  { name: "4. Epigenetic / Reprogramming Interface", icon: Beaker, verified: false, sources: ["hyb_ncer NCER", "hyb_cebre CEBRE", "inv_008 RGWGRS"], role: "In-vitro ONLY. Tests whether longitudinal-wave / wave-genome exposure shifts epigenetic markers vs sham. Falsification gate required." },
  { name: "5. Diagnostics & Closed-Loop", icon: Stethoscope, verified: "partial", sources: ["inv_039 Naessens", "inv_040 Popp", "Modality: BIO (HRV/EEG/GSR)"], role: "Biometric closed-loop to titrate dose and prevent overload. Popp biophoton as research readout, not clinical." },
  { name: "6. Bioactive Delivery", icon: FlaskConical, verified: "partial", sources: ["inv_020 SBSTA (gold nanoparticle)", "vedic_002 Rasayana", "vedic_011 Brahmi"], role: "BBB-crossing nanoparticle + nootropic herb delivery. Pharmacology handled under IND; 'scalar activation' dropped." },
];

const GATES = [
  { stage: "Gate 0 — Literature & harm screen", req: "Confirm no existing therapy claims; map all device claims to falsifiable endpoints; export-control (EAR/ITAR) review for EM-emission hardware." },
  { stage: "Gate 1 — In-vitro (cell cultures)", req: "Exposed vs sham on neural progenitor / iPSC-neuron lines. Pre-registered endpoints: DNA methylation, telomere length, BDNF, viability. Null-result path mandatory." },
  { stage: "Gate 2 — Animal model", req: "Relevant injury model (e.g., neonatal HIE or genetic). Randomised, blinded, powered. IACUC approval. Dose-finding before any efficacy claim." },
  { stage: "Gate 3 — Regulatory", req: "IND/IMD filings with the regulator. No human use without ethics (IRB) and regulatory clearance. No 'reversal' language outside granted protocol." },
  { stage: "Gate 4 — First-in-human", req: "Safety-only primary endpoint. Independent DSMB. Consent for investigational device. No marketing of reversal of pre-birth injury." },
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

function GroupSection({ icon: Icon, title, items }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-cyan-400" />
        <h3 className="text-white font-bold text-xs uppercase tracking-wider">{title}</h3>
        <span className="text-gray-600 text-[10px] ml-auto">{items.length} assets</span>
      </div>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id || it.code} className="bg-gray-950 border border-gray-800 rounded-lg p-2.5">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-gray-200 text-xs font-bold leading-snug">{it.title}</p>
              <VBadge v={it.verified} />
            </div>
            <p className="text-gray-500 text-[11px] leading-relaxed">{it.relevance}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SynthesisView() {
  const counts = useMemo(() => {
    const all = [...ASSETS.nodes, ...ASSETS.vedic, ...ASSETS.inventions, ...ASSETS.hybrids, ...ASSETS.priorart, ...ASSETS.modalities, ...ASSETS.pods];
    return {
      verified: all.filter((a) => a.verified === true).length,
      partial: all.filter((a) => a.verified === "partial").length,
      speculative: all.filter((a) => a.verified === false).length,
    };
  }, []);

  return (
    <>
      <div className="bg-amber-950/30 border border-amber-800/50 rounded-2xl p-4 mb-6 flex gap-3">
        <ShieldAlert size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-200 text-sm font-bold mb-1">Investigational research direction — not a therapy.</p>
          <p className="text-amber-100/70 text-xs leading-relaxed">
            No established clinical method reverses structural pre-birth brain damage. This page is a synthesis of platform assets that <em>could</em> feed a governed research program (in-vitro → animal → IRB-gated first-in-human). It makes <strong>no medical claim</strong>. Speculative platform concepts (scalar EM, wave genome, Priore, Akashic) are flagged and must pass falsification before any reliance.
          </p>
        </div>
      </div>

      <h2 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><Brain size={14} className="text-cyan-400" /> What "pre-birth brain damage" covers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {PROBLEM_TYPES.map((p) => (
          <div key={p.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
            <p className="text-gray-200 text-xs font-bold mb-1">{p.label}</p>
            <p className="text-gray-500 text-[11px] leading-relaxed">{p.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="bg-green-950/20 border border-green-800/40 rounded-2xl p-4">
          <h3 className="text-green-300 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2"><CheckCircle2 size={13} /> Verified scientific anchors</h3>
          <ul className="space-y-2">
            {VERIFIED_ANCHORS.map((v) => (
              <li key={v} className="text-green-100/80 text-[11px] leading-relaxed flex gap-2"><span className="text-green-500 flex-shrink-0">•</span> {v}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-950/20 border border-red-800/40 rounded-2xl p-4">
          <h3 className="text-red-300 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2"><XCircle size={13} /> Speculative platform claims (require falsification)</h3>
          <ul className="space-y-2">
            {SPECULATIVE.map((v) => (
              <li key={v} className="text-red-100/70 text-[11px] leading-relaxed flex gap-2"><span className="text-red-500 flex-shrink-0">•</span> {v}</li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><Lock size={14} className="text-amber-400" /> Evidence ladder & governance gates</h2>
      <div className="space-y-2 mb-6">
        {GATES.map((g, i) => (
          <div key={g.stage} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-950/50 border border-amber-800 flex items-center justify-center text-amber-400 text-xs font-black flex-shrink-0">{i}</div>
            <div>
              <p className="text-white text-xs font-bold mb-0.5">{g.stage}</p>
              <p className="text-gray-400 text-[11px] leading-relaxed">{g.req}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><Layers size={14} className="text-cyan-400" /> Proposed chamber subsystems</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {SUBSYSTEMS_SYN.map((s) => (
          <div key={s.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><s.icon size={14} className="text-cyan-400" /><h3 className="text-white text-xs font-bold">{s.name}</h3></div>
              <VBadge v={s.verified} />
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed mb-2">{s.role}</p>
            <div className="flex flex-wrap gap-1">
              {s.sources.map((src) => <span key={src} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-400">{src}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-white font-bold text-sm flex items-center gap-2"><Database size={14} className="text-cyan-400" /> Platform asset inventory</h2>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1 text-green-400"><CheckCircle2 size={10} /> {counts.verified} verified</span>
          <span className="flex items-center gap-1 text-amber-400"><AlertTriangle size={10} /> {counts.partial} partial</span>
          <span className="flex items-center gap-1 text-red-400"><XCircle size={10} /> {counts.speculative} speculative</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <GroupSection icon={Scroll} title="Research Nodes" items={ASSETS.nodes} />
        <GroupSection icon={BookOpen} title="Vedic Therapies" items={ASSETS.vedic} />
        <GroupSection icon={Zap} title="Inventions" items={ASSETS.inventions} />
        <GroupSection icon={Layers} title="Hybrid Devices" items={ASSETS.hybrids} />
        <GroupSection icon={FlaskConical} title="Prior Art" items={ASSETS.priorart} />
        <GroupSection icon={Activity} title="Therapy Modalities" items={ASSETS.modalities} />
      </div>
      <div className="mb-8">
        <GroupSection icon={Stethoscope} title="Existing Targeted Therapy Pods (integration templates)" items={ASSETS.pods} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
        <p className="text-gray-300 text-xs leading-relaxed">
          <strong className="text-white">Bottom line.</strong> The platform's strongest, evidence-backed contribution to pre-birth brain injury is the <strong>transcranial PBM + neuroinflammation (H₂) + gut-brain</strong> stack, wrapped in a closed-loop biometric controller — consistent with the AuraWell ASD pod architecture. The "reprogramming" layer (epigenetic / wave-genome / Priore) is <strong>not established</strong> and must remain in-vitro under falsification gates. No claim of reversing pre-birth brain damage is made or implied.
        </p>
      </div>
    </>
  );
}

function EngineeringView() {
  const [exporting, setExporting] = useState(false);
  const handleExport = () => {
    setExporting(true);
    try { generateNeuroRegenPdf(); } catch (e) { console.error(e); alert("Export failed: " + (e.message || e)); }
    setExporting(false);
  };
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="text-white font-bold text-sm flex items-center gap-2"><Box size={14} className="text-cyan-400" /> Engineering Package</h2>
          <p className="text-gray-500 text-xs mt-0.5">ZA-NRC-001 Rev B · PRD · PDR · BOM · SOW · EVT · DVT · Research Only</p>
        </div>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold transition-all disabled:opacity-50">
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {exporting ? "Generating…" : "Export Full PDF"}
        </button>
      </div>
      <NeuroRegenChamberRender />
      <div className="mt-6">
        <NeuroRegenEngineeringDocs />
      </div>
    </>
  );
}

export default function NeuroRegenChamber() {
  const [view, setView] = useState("synthesis");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/research-network" className="text-gray-400 hover:text-white"><ArrowLeft size={16} /></Link>
            <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800 flex items-center justify-center">
              <Brain size={20} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-base font-black leading-tight">Neuro Regeneration Chamber</h1>
              <p className="text-gray-500 text-xs">Pre-birth brain damage reversal — synthesis & engineering package</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-950/60 border border-red-800 text-red-400 uppercase tracking-wider">Not for Sale</span>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-yellow-950/40 border border-yellow-800 text-yellow-400 uppercase tracking-wider">Research Only</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 border-b border-gray-800 px-5 py-2">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          {[
            { id: "synthesis", label: "Synthesis", icon: <Brain size={14} /> },
            { id: "engineering", label: "Engineering Package", icon: <FileText size={14} /> },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setView(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === tab.id ? "bg-gray-800 text-white border border-gray-700" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-6">
        {view === "synthesis" ? <SynthesisView /> : <EngineeringView />}
        <div className="flex flex-wrap gap-3 mt-8 mb-10">
          <Link to="/targeted-therapy-pods" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">View AuraWell Pods</Link>
          <Link to="/therapy-pod-pro" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Therapy Pod Pro (engineering)</Link>
          <Link to="/hybrid-dev-packages" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Hybrid Dev Packages</Link>
          <Link to="/evidence-ledger" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Evidence Ledger</Link>
        </div>
      </div>
    </div>
  );
}