import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap, Shield, Brain, Activity, Cpu, FlaskConical,
  ChevronRight, ChevronDown, Star, AlertTriangle,
  FileText, Layers, Settings, Target, Radio, Wind, Package
} from "lucide-react";
import MedbedBomGenerator from "@/components/MedbedBomGenerator";
import MedbedNdaGate from "@/components/MedbedNdaGate";

// ── Device catalog derived from all uploaded engineering docs ──────────────

const DEVICES = [
  {
    id: "aatcs-p1-asd",
    brand: "BrightSteps™",
    name: "AATCS-P1 Autism Therapy Pod",
    subtitle: "ASD Unified Therapy System",
    category: "Clinical",
    classification: "Pediatric / ASD",
    color: "#06b6d4",
    accentColor: "#0891b2",
    badge: "ASD CERTIFIED",
    badgeColor: "bg-cyan-900/60 text-cyan-300 border-cyan-700",
    heroImage: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cfa595b8b_ChatGPTImageJul21202605_06_21PM.png",
    explodedImage: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/52567b0b5_TherapyPodexplodedCAD.png",
    tagline: "Calm Minds. Stronger Futures.",
    description: "Adaptive multi-modal therapy pod engineered specifically for autistic children and adults. Nine simultaneously operating healing modalities under closed-loop BFAC+ACE AI control, with child-safe profiles, sensory calibration for hyper/hypo-sensitivity, and caregiver dashboard integration. Based on the complete AATCS-P1 platform with ASD-specific protocol tuning.",
    keySpecs: [
      { label: "Modalities", value: "9 Active" },
      { label: "PEMF Freq", value: "7.83 Hz Schumann" },
      { label: "PBM Range", value: "630–850 nm" },
      { label: "VAT Range", value: "20–528 Hz" },
      { label: "FIR Temp", value: "37–55°C" },
      { label: "H₂ Purity", value: "99.99%" },
      { label: "Controller", value: "ARM Cortex-A72 + STM32H7" },
      { label: "AI Model", value: "TensorFlow Lite Closed-Loop" },
      { label: "Dimensions", value: "1600×1500×1700 mm" },
      { label: "Weight", value: "210 kg" },
      { label: "Power", value: "1,200W Max" },
      { label: "Compliance", value: "FDA Class II Target" },
    ],
    modalities: [
      { code: "PBM", label: "Photobiomodulation", spec: "660nm/850nm NIR — 100/120 mW/cm²", color: "#ef4444", asdNote: "Gentle red spectrum with auto-dim for light-sensitive children" },
      { code: "PEMF", label: "Pulsed EM Field", spec: "7.83 Hz Schumann Resonance — Helmholtz coil matrix", color: "#3b82f6", asdNote: "Sub-threshold Schumann tuning — supports neuroplasticity safely" },
      { code: "VAT", label: "Vibroacoustic Therapy", spec: "20–528 Hz — 9-transducer seat-back array", color: "#a855f7", asdNote: "Low-frequency sensory integration; adjustable for tactile sensitivity" },
      { code: "FIT", label: "Far-Infrared Thermal", spec: "5–14μm wavelength — 37–55°C carbon fiber panels", color: "#f97316", asdNote: "Soothing warmth for calming autonomic dysregulation" },
      { code: "SFT", label: "Scalar Field Therapy", spec: "20Hz–20kHz DDS — dual-layer toroidal coil", color: "#06b6d4", asdNote: "Coherence field supporting neuroregulation" },
      { code: "MCT", label: "Microcurrent Therapy", spec: "1–999μA — silver-carbon composite electrodes", color: "#ec4899", asdNote: "Sub-threshold currents for cellular ATP support" },
      { code: "HIT", label: "Hydrogen Inhalation", spec: "99.99% H₂ — PEM electrolyzer, 150–300 mL/min", color: "#14b8a6", asdNote: "Selective antioxidant — supports mitochondrial health" },
      { code: "NIA", label: "Negative Ion Therapy", spec: "10⁶–10⁷ ions/cm³ — HEPA + activated carbon", color: "#2dd4bf", asdNote: "Air quality enrichment for sensory-calm environment" },
      { code: "BIO", label: "Biometric AI Control", spec: "HRV + SpO₂ + EEG + GSR + Skin Temp — real-time", color: "#10b981", asdNote: "Continuous closed-loop adaptation to child's physiological state" },
    ],
    documents: [
      { type: "PRD", title: "AATCS-P1-ASD Product Requirements", status: "Rev A" },
      { type: "PDR", title: "Preliminary Design Review — ASD Variant", status: "Rev A" },
      { type: "BOM", title: "Bill of Materials — AATCS-P1-ASD-BOM-001", status: "56 line items" },
      { type: "SOW", title: "Statement of Work — ASD Prototype Build", status: "80h assembly" },
      { type: "ASM", title: "Assembly Manual — AATCS-P1-MAN-001 Rev A", status: "53 pages" },
      { type: "SPEC", title: "Full Technical Spec Sheet", status: "10 modalities" },
    ],
    asdFeatures: [
      "Child-safe sensory profiles with hyper/hypo-sensitivity calibration",
      "Visual calm environment with infinity mirror ceiling and WLED ambient",
      "Sound-isolated acoustic interior panels (NRC 0.65 rating)",
      "Caregiver dashboard with live biometric feed and alert system",
      "Soft-close canopy with no sudden movements or loud actuations",
      "Color-therapy mode: chromotherapy WLED synchronized to session protocol",
      "Parent/therapist pre-set session profiles (calming, stimulating, integration)",
      "Emergency exit — child-accessible interior release on canopy",
    ],
    assemblyPhases: [
      { phase: "A", title: "Structural Frame", hours: 12.5, desc: "6061-T6 aluminum extrusion, M8 fasteners at 20 Nm, leveling feet, cable management" },
      { phase: "B", title: "Canopy Assembly", hours: 11, desc: "Polycarbonate panels, soft-close hinges, gas struts, hinge wiring chase" },
      { phase: "C", title: "Electrical Installation", hours: 21, desc: "48V/24V PSUs, E-stop (dual-channel NC), PCB stack, LED arrays, PEMF coils, sensor suite" },
      { phase: "D", title: "Special Systems", hours: 6.5, desc: "Holographic fan display, infinity mirror, robotic bio-sensor arm" },
      { phase: "E", title: "Interior Finishing", hours: 5, desc: "Acoustic panels, memory foam mattress, antimicrobial cover, silicone edge guards" },
      { phase: "F", title: "Firmware & Testing", hours: 18, desc: "Flash Pi5 + 4x Pi Zero 2W, first power-up sequence, subsystem tests, 30-min burn-in" },
      { phase: "G", title: "QC & Delivery", hours: 6, desc: "Torque audit, exterior ABS panels, titanium accent rails, final QC sign-off" },
    ],
  },
  {
    id: "zds-ptsd-pod",
    brand: "Zenith Defense Systems™",
    name: "ZDS-PTSD-1 Combat Recovery Pod",
    subtitle: "Military Grade PTSD & TBI Neurorecovery System",
    category: "Defense / Medical",
    classification: "Military / PTSD",
    color: "#f59e0b",
    accentColor: "#d97706",
    badge: "MIL-SPEC",
    badgeColor: "bg-amber-900/60 text-amber-300 border-amber-700",
    heroImage: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c63dded0e_zenithdefensesystems.png",
    explodedImage: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fb4fa9a6f_ChatGPTImageJul21202605_09_21PM.png",
    tagline: "Defense. Security. Innovation. — Healing the Warrior",
    description: "Military-hardened PTSD and Traumatic Brain Injury recovery system derived from the AATCS-P1 platform, reengineered to MIL-STD-810H environmental standards. Incorporates classified bioelectromagnetic modalities for hyperarousal dampening, amygdala retraining, and neuroregulation. Deployable to VA hospitals, forward operating bases, and garrison medical units. Designed for the DoD's PTSD/TBI clinical trials pipeline.",
    keySpecs: [
      { label: "Platform Base", value: "AATCS-P1 / MIL-STD-810H" },
      { label: "PEMF Preset", value: "Delta (0.5–4 Hz) Neuroinduction" },
      { label: "Scalar Mode", value: "Phase-conjugate Bearden Protocol" },
      { label: "EEG Feedback", value: "Real-time PTSD hyperarousal detection" },
      { label: "H₂ Flow", value: "300 mL/min — TBI neuroprotection" },
      { label: "VAT Protocol", value: "Trauma Release Protocol (TRP-1)" },
      { label: "Power", value: "MIL-spec 28VDC + 115VAC 400Hz" },
      { label: "Enclosure", value: "IP65 rated — field deployable" },
      { label: "Dimensions", value: "1700×1600×1750 mm" },
      { label: "Weight", value: "240 kg (MIL-hardened frame)" },
      { label: "Standards", value: "MIL-STD-810H, MIL-STD-461G EMC" },
      { label: "Security", value: "FIPS 140-2 encrypted session logs" },
    ],
    modalities: [
      { code: "PBM", label: "Photobiomodulation", spec: "810nm NIR transcranial — TBI-specific protocol", color: "#ef4444", militaryNote: "Transcranial NIR at 810nm — FDA-cleared for TBI neuroprotection" },
      { code: "PEMF", label: "Delta-Band PEMF", spec: "0.5–4 Hz delta induction — hyperarousal dampening", color: "#3b82f6", militaryNote: "Delta-wave entrainment suppresses amygdala hyperarousal associated with PTSD" },
      { code: "VAT", label: "Trauma Release Protocol", spec: "Somatic tremor facilitation — 20–40 Hz resonance", color: "#a855f7", militaryNote: "Bioacoustic facilitation of TRE (Tension & Trauma Release Exercises)" },
      { code: "FIT", label: "Far-Infrared Thermal", spec: "Military-grade 45–55°C deep tissue — autonomic reset", color: "#f97316", militaryNote: "Parasympathetic activation via thermal-visceral pathways" },
      { code: "SFT", label: "Phase-Conjugate Scalar", spec: "Bearden SEM protocol — 0.1–40 Hz bioresonance", color: "#06b6d4", militaryNote: "Scalar phase conjugation for neurocoherence restoration — classified protocol" },
      { code: "MCT", label: "CES / Cranial Electrotherapy", spec: "0.5 Hz CES — Alpha brainwave normalization", color: "#ec4899", militaryNote: "FDA-cleared CES mode for PTSD anxiety and insomnia" },
      { code: "HIT", label: "Hydrogen Neuroprotection", spec: "300 mL/min 99.99% H₂ — TBI oxidative stress reduction", color: "#14b8a6", militaryNote: "Molecular H₂ selectively reduces ·OH — critical for blast TBI recovery" },
      { code: "NIA", label: "Negative Ion Calm Environment", spec: "10⁷ ions/cm³ — field-deployable HEPA filtration", color: "#2dd4bf", militaryNote: "Combat stress reduction via atmospheric ion enhancement" },
      { code: "BIO", label: "PTSD Biomarker AI Engine", spec: "EEG alpha/delta ratio + HRV + GSR + cortisol proxy", color: "#10b981", militaryNote: "Real-time PTSD severity scoring — adaptive protocol adjustment" },
    ],
    documents: [
      { type: "PRD", title: "ZDS-PTSD-1 Military Requirements Document", status: "Rev A" },
      { type: "PDR", title: "Preliminary Design Review — MIL Variant", status: "Rev A" },
      { type: "BOM", title: "ZDS-PTSD-1-BOM-001 — MIL-spec components", status: "68 line items" },
      { type: "SOW", title: "Statement of Work — Military Prototype", status: "95h assembly" },
      { type: "ICD", title: "Interface Control Document — DoD Integration", status: "Draft" },
      { type: "VVP", title: "Verification & Validation Plan — Clinical Trial", status: "Phase 1" },
    ],
    militaryFeatures: [
      "MIL-STD-810H: vibration, shock, humidity, altitude, temperature (-32°C to +60°C)",
      "MIL-STD-461G: electromagnetic compatibility — no interference with base communications",
      "FIPS 140-2 Level 2 encrypted session data — HIPAA + DoD health records compliant",
      "Dual-power mode: 115VAC 400Hz military power + 28VDC vehicle/forward-base operation",
      "Ruggedized IP65 exterior panels — field cleanable, resistant to CBRN decontamination agents",
      "Classified SFT scalar protocol library: Bearden phase-conjugate neurocoherence protocols",
      "PTSD severity index integration with DSM-5 PCL-5 score correlation",
      "VA / DoD telemedicine integration: real-time clinician dashboard with SIPR-net option",
      "Rapid deployment: 45-minute field setup by 2 personnel from transit cases",
      "Chain-of-custody session logs with biometric authentication of attending clinician",
    ],
    assemblyPhases: [
      { phase: "A", title: "MIL-Spec Frame", hours: 16, desc: "7075-T6 aluminum + steel-reinforced joints, MIL-DTL-5541 chromate conversion coating" },
      { phase: "B", title: "Hardened Canopy", hours: 13, desc: "Polycarbonate (MIL-PRF-32432) + EMI shielding mesh, IP65 gasket seal" },
      { phase: "C", title: "MIL-Spec Electrical", hours: 28, desc: "MIL-SPEC wire (MIL-W-22759), EMI-filtered power entry, classified PEMF/SFT wiring" },
      { phase: "D", title: "Classified Systems", hours: 9, desc: "CES unit, EEG array, PTSD biomarker compute stack, secure comms module" },
      { phase: "E", title: "CBRN-Safe Interior", hours: 6, desc: "Sealed antimicrobial surfaces, decontamination-compatible materials" },
      { phase: "F", title: "MIL Firmware & Testing", hours: 24, desc: "Classified firmware flash, MIL-STD-810H environmental test suite, PTSD protocol validation" },
      { phase: "G", title: "Military QC & Acceptance", hours: 8, desc: "DoD acceptance testing, MIL-spec documentation package, security clearance sign-off" },
    ],
  },
  {
    id: "aurawell-medbed",
    brand: "AuraWell™",
    name: "MedBed AATCS-P2 Full-Body Recline",
    subtitle: "Advanced Adaptive Therapy Chamber System — Recline Platform",
    category: "Clinical / Spa",
    classification: "Clinical / Wellness",
    color: "#8b5cf6",
    accentColor: "#7c3aed",
    badge: "PATENT PENDING",
    badgeColor: "bg-purple-900/60 text-purple-300 border-purple-700",
    heroImage: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9ba699ec6_ChatGPTImageJul21202603_49_04PM.png",
    explodedImage: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3a26f5b10_ChatGPTImageJul21202604_41_50PM.png",
    tagline: "The World's Most Advanced Therapeutic Recovery Platform",
    description: "The AuraWell MedBed AATCS-P2 is a full-body recline medbed — a supine therapy chamber that allows complete horizontal immersion in all nine modalities simultaneously. Derived from the AATCS-P1 pod architecture and the BrightSteps therapy bed design, the P2 extends therapy access to full-body panels, overhead canopy LED/scalar arrays, under-mattress PEMF coil matrix, and lateral FIR side walls. Includes AI-generated personalized session protocols based on real-time biometric intake.",
    keySpecs: [
      { label: "Platform", value: "AATCS-P2 MedBed" },
      { label: "Form Factor", value: "Full-body recline / supine" },
      { label: "PBM Coverage", value: "Full-body 5×5 calibration grid" },
      { label: "PEMF Coils", value: "2×2 floor matrix + canopy pair" },
      { label: "FIR Panels", value: "Side wall + under-mattress" },
      { label: "VAT", value: "8-transducer mattress array" },
      { label: "Scalar Coils", value: "8 octagonal wall-mount pairs" },
      { label: "Biometrics", value: "HRV, SpO₂, EEG, GSR, Temp" },
      { label: "Dimensions", value: "2100×900×500 mm (bed) + canopy" },
      { label: "Weight", value: "185 kg" },
      { label: "Power", value: "1,400W Max" },
      { label: "IP Rating", value: "IP44 clinical environment" },
    ],
    modalities: [
      { code: "PBM", label: "Full-Body PBM Arrays", spec: "Overhead 660nm/850nm + lateral panels — 5×5 grid calibration", color: "#ef4444", medNote: "Complete dorsal + ventral coverage via overhead + angled side panels" },
      { code: "PEMF", label: "Under-Mattress PEMF Matrix", spec: "2×2 Helmholtz floor coil grid — uniform field through body", color: "#3b82f6", medNote: "Supine PEMF penetration — superior to seated configuration" },
      { code: "VAT", label: "Mattress Vibroacoustic Array", spec: "8-transducer mattress embed — full dorsal surface vibration", color: "#a855f7", medNote: "Body-contact haptic delivery through memory foam — maximum somatic integration" },
      { code: "FIT", label: "Side-Wall + Under-Mattress FIR", spec: "420×230mm panels — lateral walls + floor — total body wrap", color: "#f97316", medNote: "Tri-surface FIR envelope for deep tissue therapeutic heating" },
      { code: "SFT", label: "Octagonal Wall Scalar Array", spec: "8 coil pairs — circumferential coherence field", color: "#06b6d4", medNote: "360° scalar field immersion — uniform toroidal field distribution" },
      { code: "MCT", label: "Precision Microcurrent", spec: "1–999μA dual-channel — head, torso, limb zones keyed", color: "#ec4899", medNote: "Full-body cellular ATP stimulation protocol" },
      { code: "HIT", label: "Hydrogen Therapy", spec: "99.99% H₂ — 150–300 mL/min canopy delivery", color: "#14b8a6", medNote: "Ambient molecular hydrogen therapy during full-body session" },
      { code: "NIA", label: "Negative Ion Environment", spec: "Sealed canopy ion enrichment — 10⁷ ions/cm³", color: "#2dd4bf", medNote: "Enriched therapeutic atmosphere inside sealed canopy" },
      { code: "BIO", label: "Closed-Loop AI Dosimetry", spec: "ARM Cortex-A72 + STM32H7 + TensorFlow Lite", color: "#10b981", medNote: "Real-time adaptive dosimetry across all 9 modalities simultaneously" },
    ],
    documents: [
      { type: "PRD", title: "AATCS-P2 MedBed Product Requirements", status: "Rev A" },
      { type: "PDR", title: "P2 Preliminary Design Review", status: "Rev A" },
      { type: "BOM", title: "AATCS-P2-BOM-001 — Full component list", status: "72 line items" },
      { type: "SOW", title: "P2 Manufacturing Statement of Work", status: "90h assembly" },
      { type: "SPEC", title: "P2 Technical Specification", status: "9 modalities" },
      { type: "VAL", title: "Clinical Validation Protocol", status: "IRB pending" },
    ],
    medbedFeatures: [
      "Supine full-body immersion — maximum therapeutic surface exposure",
      "Motorized canopy height adjustment (500–1200mm from patient surface)",
      "Auto-leveling pneumatic patient platform — zero-gravity preset",
      "Integrated patient monitoring: SpO₂, ECG, respiratory rate via non-contact radar",
      "AI session architect: intake questionnaire → personalized 45-min protocol",
      "Cloud session records: therapist dashboard with session replay and trend analytics",
      "Multi-patient mode: 4 sequential sessions with auto-sanitize cycle",
      "Modular upgrade path: add plasma tube ring, EEG headset, aromatherapy module",
    ],
  },
];

const DOC_COLORS = {
  PRD: "bg-blue-900/40 text-blue-300 border-blue-800",
  PDR: "bg-purple-900/40 text-purple-300 border-purple-800",
  BOM: "bg-amber-900/40 text-amber-300 border-amber-800",
  SOW: "bg-green-900/40 text-green-300 border-green-800",
  ASM: "bg-cyan-900/40 text-cyan-300 border-cyan-800",
  SPEC: "bg-red-900/40 text-red-300 border-red-800",
  ICD: "bg-indigo-900/40 text-indigo-300 border-indigo-800",
  VVP: "bg-teal-900/40 text-teal-300 border-teal-800",
  VAL: "bg-pink-900/40 text-pink-300 border-pink-800",
};

function DeviceCard({ device, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(device)}
      className={`relative cursor-pointer rounded-2xl border transition-all overflow-hidden ${selected ? "border-opacity-100 shadow-xl" : "border-gray-800 hover:border-gray-600"}`}
      style={selected ? { borderColor: device.color, boxShadow: `0 0 30px ${device.color}25` } : {}}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={device.heroImage} alt={device.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${device.badgeColor}`}>
            {device.badge}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-gray-400 text-[10px] font-mono">{device.brand}</p>
          <h3 className="text-white font-bold text-sm leading-tight">{device.name}</h3>
          <p className="text-gray-500 text-[10px] mt-0.5">{device.subtitle}</p>
        </div>
      </div>
      <div className="p-4 bg-gray-950">
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{device.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1">
            {device.modalities.slice(0, 5).map(m => (
              <div key={m.code} className="w-5 h-5 rounded-sm text-[8px] font-bold flex items-center justify-center" style={{ backgroundColor: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40` }}>{m.code.slice(0, 1)}</div>
            ))}
            <div className="w-5 h-5 rounded-sm text-[8px] font-bold flex items-center justify-center bg-gray-800 text-gray-500">+{device.modalities.length - 5}</div>
          </div>
          <span className="text-xs font-bold" style={{ color: device.color }}>View Build →</span>
        </div>
      </div>
    </div>
  );
}

function ModalityGrid({ modalities, variant }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {modalities.map(m => {
        const note = m.asdNote || m.militaryNote || m.medNote;
        return (
          <div key={m.code} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ backgroundColor: `${m.color}15`, border: `1px solid ${m.color}40`, color: m.color }}>
                {m.code}
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-bold text-sm">{m.label}</h4>
                <p className="text-gray-500 text-[10px] font-mono mt-0.5 leading-relaxed">{m.spec}</p>
                {note && <p className="text-gray-400 text-[10px] mt-1.5 leading-relaxed border-l-2 pl-2" style={{ borderColor: m.color }}>{note}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SpecGrid({ specs }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {specs.map(s => (
        <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">{s.label}</p>
          <p className="text-white font-bold text-sm mt-0.5">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function AssemblyTimeline({ phases }) {
  const total = phases.reduce((s, p) => s + p.hours, 0);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-xs">Total assembly time (excluding cure holds)</p>
        <span className="text-white font-bold text-sm">{total} hours</span>
      </div>
      {phases.map(p => (
        <div key={p.phase} className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
            {p.phase}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold text-sm">{p.title}</span>
              <span className="text-gray-500 text-xs">{p.hours}h</span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{p.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentsGrid({ docs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {docs.map(d => (
        <div key={d.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-3">
          <div className={`px-2 py-0.5 rounded text-[9px] font-black border flex-shrink-0 ${DOC_COLORS[d.type] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
            {d.type}
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-tight">{d.title}</p>
            <p className="text-gray-600 text-[10px] mt-0.5">{d.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MedbedShowcase() {
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]);
  const [activeTab, setActiveTab] = useState("overview");

  const d = selectedDevice;

  return (
    <MedbedNdaGate>
      <MedbedShowcaseContent device={d} selectedDevice={selectedDevice} setSelectedDevice={setSelectedDevice} activeTab={activeTab} setActiveTab={setActiveTab} />
    </MedbedNdaGate>
  );
}

function MedbedShowcaseContent({ device: d, selectedDevice, setSelectedDevice, activeTab, setActiveTab }) {

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "modalities", label: `Modalities (${d.modalities.length})` },
    { id: "specs", label: "Technical Specs" },
    { id: "bom", label: "BOM Generator" },
    { id: "assembly", label: "Assembly Plan" },
    { id: "documents", label: "Documents" },
    { id: "features", label: d.id === "zds-ptsd-pod" ? "Military Features" : d.id === "aatcs-p1-asd" ? "ASD Features" : "MedBed Features" },
  ];

  const featureList = d.asdFeatures || d.militaryFeatures || d.medbedFeatures || [];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">ZARP Research Division</span>
            </div>
            <h1 className="text-white font-black text-xl">Advanced Therapy Device Showcase</h1>
            <p className="text-gray-500 text-xs mt-0.5">Autism Pod · PTSD Combat Recovery · MedBed — Complete Build Plans, BOM, PRD, PDR, SOW</p>
          </div>
          <div className="flex gap-2">
            <Link to="/therapy-pod-pro" className="px-3 py-2 rounded-lg bg-cyan-900/30 border border-cyan-800 text-cyan-300 text-xs font-bold hover:bg-cyan-900/50 transition-colors">
              AATCS-P1 Pro Docs →
            </Link>
            <Link to="/resonance-dashboard" className="px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-800 text-purple-300 text-xs font-bold hover:bg-purple-900/50 transition-colors">
              Live Resonance →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Device selector */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {DEVICES.map(dev => (
            <DeviceCard key={dev.id} device={dev} selected={selectedDevice.id === dev.id} onSelect={setSelectedDevice} />
          ))}
        </div>

        {/* Device detail */}
        <div className="bg-gray-900 border rounded-2xl overflow-hidden" style={{ borderColor: d.color + "40" }}>
          {/* Device hero */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img src={d.heroImage} alt={d.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/60 to-transparent" />
            <div className="absolute inset-0 flex items-end pb-8 px-8">
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border mb-2 inline-block ${d.badgeColor}`}>{d.badge}</span>
                <p className="text-gray-400 text-xs font-mono">{d.brand}</p>
                <h2 className="text-white font-black text-2xl md:text-3xl leading-tight mt-1">{d.name}</h2>
                <p className="mt-1" style={{ color: d.color }}>{d.tagline}</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-800/80 text-gray-300 border border-gray-700">{d.classification}</span>
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-800/80 text-gray-300 border border-gray-700">{d.modalities.length} Modalities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-800 px-6 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === t.id ? "border-b-2 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
                  style={activeTab === t.id ? { borderBottomColor: d.color, color: d.color } : {}}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-bold text-base mb-2">System Description</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{d.description}</p>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-3">Key Specifications</h3>
                  <SpecGrid specs={d.keySpecs.slice(0, 8)} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-3">Modality Overview</h3>
                  <div className="flex flex-wrap gap-2">
                    {d.modalities.map(m => (
                      <div key={m.code} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold" style={{ borderColor: m.color + "40", backgroundColor: m.color + "10", color: m.color }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                        {m.code} — {m.label}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Exploded view */}
                {d.explodedImage && (
                  <div>
                    <h3 className="text-white font-bold text-base mb-3">Exploded CAD Reference</h3>
                    <div className="rounded-xl overflow-hidden border border-gray-800">
                      <img src={d.explodedImage} alt="Exploded view" className="w-full object-contain max-h-80" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "modalities" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={16} className="text-gray-400" />
                  <p className="text-gray-400 text-sm">{d.modalities.length} simultaneous therapeutic modalities under BFAC+ACE closed-loop AI control</p>
                </div>
                <ModalityGrid modalities={d.modalities} />
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-bold text-base mb-3">Full Technical Specifications</h3>
                  <SpecGrid specs={d.keySpecs} />
                </div>
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className="text-amber-400" />
                    <p className="text-amber-400 text-xs font-bold">Safety & Compliance Notes</p>
                  </div>
                  <ul className="space-y-1.5 text-gray-400 text-xs">
                    <li>• Dual-channel NC E-stop circuit — IEC 60947-5-5 compliant, response ≤250ms</li>
                    <li>• BFAC safety engine monitors all modalities in real-time — automatic cutoff on threshold breach</li>
                    <li>• PEMF contraindicated: cardiac implants, cochlear implants, pregnancy (2nd/3rd trimester)</li>
                    <li>• HIT: spark-free interlock prevents simultaneous MCT electrode and H₂ output</li>
                    <li>• NIR LEDs (850nm): invisible — IR-blocking OD3+ glasses mandatory during commissioning</li>
                    <li>• H₂ auto-shutdown at 25% LEL — sensor within 30cm of electrolyzer</li>
                    <li>• All components max 80°C during 30-min burn-in — thermal camera monitoring required</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "bom" && (
              <MedbedBomGenerator device={d} />
            )}

            {activeTab === "assembly" && (
              <div className="space-y-6">
                <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 flex gap-3">
                  <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-300 text-xs leading-relaxed">Assembly manual reference: AATCS-P1-MAN-001 Rev A (53 pages). Full LOTO procedures mandatory throughout Phase C. Read Section 1 (Safety Overview) before beginning ANY work. Minimum 2 technicians required for all phases.</p>
                </div>
                <AssemblyTimeline phases={d.assemblyPhases} />
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-gray-400" />
                  <p className="text-gray-400 text-sm">Engineering document package — PRD, PDR, BOM, SOW, Assembly Manual</p>
                </div>
                <DocumentsGrid docs={d.documents} />
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mt-4">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Research-to-Patent Cross-Reference (AuraWell Matrix)</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Research Nodes", value: "42 nodes / 7 domains" },
                      { label: "Patent Portfolio", value: "28 active USPTO" },
                      { label: "Portfolio Value", value: "$47M–$89M est." },
                      { label: "IP Gaps Identified", value: "7 priority filings" },
                    ].map(s => (
                      <div key={s.label} className="bg-gray-900 rounded-lg p-3">
                        <p className="text-gray-600 text-[10px]">{s.label}</p>
                        <p className="text-white font-bold text-xs mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} style={{ color: d.color }} />
                  <p className="text-gray-400 text-sm">Specialized features for {d.classification}</p>
                </div>
                {featureList.map((f, i) => (
                  <div key={i} className="flex gap-3 items-start bg-gray-950 border border-gray-800 rounded-lg p-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black" style={{ backgroundColor: d.color + "20", color: d.color, border: `1px solid ${d.color}40` }}>
                      {i + 1}
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">{f}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Patent Intelligence section */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-900/30 border border-amber-800 flex items-center justify-center">
                <Shield size={14} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">IP Risk Register Highlights</p>
                <p className="text-gray-500 text-xs">From AuraWell Patent Matrix — Prior Art Risk</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { node: "NReg-01", risk: "High", threat: "NeuroStar TMS Blocking", mitigation: "File continuation — multi-modal biofield + sound synergy differentiation" },
                { node: "SAC-02", risk: "High", threat: "GE Healthcare Ultrasound", mitigation: "Design-around: sub-MHz acoustic range (40–100 kHz)" },
                { node: "EMM-01", risk: "Med", threat: "Bioelectronics PEMF", mitigation: "Narrow to Schumann-tuned PEMF waveform profiles" },
                { node: "BSc-03", risk: "Med", threat: "Meyl DE Scalar Patent", mitigation: "File method claims on biointeraction protocols vs. transmission" },
              ].map(r => (
                <div key={r.node} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-gray-500">{r.node}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${r.risk === "High" ? "bg-red-900/50 text-red-300" : "bg-amber-900/50 text-amber-300"}`}>{r.risk}</span>
                    <span className="text-gray-400 text-[10px]">{r.threat}</span>
                  </div>
                  <p className="text-gray-600 text-[10px]">→ {r.mitigation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-900/30 border border-green-800 flex items-center justify-center">
                <Target size={14} className="text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">IP Gap Filing Roadmap</p>
                <p className="text-gray-500 text-xs">Unprotected technology opportunities — top priority</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { rank: 1, gap: "Multi-Modal Biofield-AI Fusion Engine", cost: "$45K–$65K", opp: "High" },
                { rank: 2, gap: "Quantum-Vedic Resonance Protocol Suite", cost: "$55K–$75K", opp: "High" },
                { rank: 3, gap: "AATCS-P1 Personalization Algorithm", cost: "$50K–$70K", opp: "High" },
                { rank: 4, gap: "Integrated Marma-Meridian EM Map", cost: "$40K–$55K", opp: "High" },
              ].map(g => (
                <div key={g.rank} className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex items-start gap-3">
                  <span className="text-green-400 font-black text-sm w-4 flex-shrink-0">#{g.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold leading-tight">{g.gap}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 text-[10px]">Filing est: {g.cost}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-900/50 text-green-300">Opportunity: {g.opp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}