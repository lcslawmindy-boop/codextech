import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, Shield, FileText, Loader2, Lock, Star, Zap, Package, Building2, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TIERS = [
  {
    id: "research",
    name: "Research License",
    price: "$12,500 / year",
    priceNote: "Non-commercial use only",
    color: "#6366f1",
    badge: "Entry",
    features: [
      "Access to 3 device architectures (your choice)",
      "Internal R&D use only — no commercial products",
      "Full annotated engineering plans",
      "Email technical support (48h response)",
      "Annual renewal with 30-day notice",
      "No sublicensing rights",
    ],
    restrictions: "Non-commercial, single institution only.",
  },
  {
    id: "commercial",
    name: "Commercial License",
    price: "$85,000 / year",
    priceNote: "Per product line",
    color: "#f59e0b",
    badge: "Most Popular",
    popular: true,
    features: [
      "Access to up to 8 device architectures",
      "Commercial product development rights",
      "White-label manufacturing permitted",
      "Priority technical support (24h response)",
      "Co-branding options available",
      "Sublicensing to 1 manufacturing partner",
      "Quarterly IP update briefings",
    ],
    restrictions: "Single product line. Geographic exclusivity available at +30%.",
  },
  {
    id: "exclusive",
    name: "Exclusive Portfolio License",
    price: "$650,000 / year",
    priceNote: "Full portfolio — all architectures",
    color: "#22c55e",
    badge: "Enterprise",
    features: [
      "Full access to all 24 device architectures",
      "Exclusive global commercialization rights",
      "Source code + engineering files included",
      "White-label + OEM + sublicensing rights",
      "Dedicated technical liaison (weekly calls)",
      "First right of refusal on new inventions",
      "Joint IP development pathway available",
      "Acquisition option clause (negotiable)",
    ],
    restrictions: "Exclusivity per vertical market. Negotiable for full platform acquisition.",
  },
  {
    id: "acquisition",
    name: "Acquisition / JV",
    price: "$6.5M – $18M",
    priceNote: "Full platform acquisition",
    color: "#a855f7",
    badge: "Strategic",
    features: [
      "Complete IP portfolio transfer",
      "All 24 invention architectures + source code",
      "Platform codebase (full transfer)",
      "Founder transition + knowledge transfer (90 days)",
      "Joint Venture equity structure available",
      "White-label SaaS licensing also available ($280K/yr)",
      "Strategic partnership / revenue share also available",
    ],
    restrictions: "NDA + proof of funds required before detailed disclosure.",
  },
];

const DEVICES = [
  { id: "meg", name: "Motionless Electromagnetic Generator (MEG)", category: "Vacuum Energy", patent: "US 6,362,718", tier: "commercial" },
  { id: "trd1", name: "Telomere Regeneration Device (TRD-1)", category: "Bioelectromagnetics", patent: "PPA Filed 2024", tier: "commercial" },
  { id: "gcom", name: "Scalar Wave Communicator (G-Com Mk I)", category: "Scalar EM", patent: "PPA Pending", tier: "commercial" },
  { id: "priore", name: "Portable Prioré-Class EM System", category: "Bioelectromagnetics", patent: "FR 1,342,772 derivative", tier: "research" },
  { id: "trz", name: "Time-Reversal Zone Cold Fusion Reactor (TRZ-1)", category: "Vacuum Energy", patent: "PPA Series", tier: "commercial" },
  { id: "scalar_radar", name: "Scalar Pulse Radar Detection System", category: "Scalar Sensing", patent: "PPA 2025", tier: "commercial" },
  { id: "woodpecker", name: "Woodpecker Grid ELF Detector", category: "Scalar Sensing", patent: "Open Source", tier: "research" },
  { id: "anenergy", name: "Anenergy Pump Demonstration Circuit", category: "Vacuum Energy", patent: "PPA Pending", tier: "research" },
  { id: "energy_bottle", name: "Scalar Energy Bottle Interferometer", category: "Scalar EM", patent: "PPA 2025", tier: "commercial" },
  { id: "vpo", name: "Vacuum Potential Oscillator (VPO)", category: "Vacuum Energy", patent: "Open Research", tier: "research" },
  { id: "biofield", name: "Biofield Frequency Exposure Chamber", category: "Bioelectromagnetics", patent: "Trade Secret", tier: "research" },
  { id: "emf_trigger", name: "EM Trigger Window Therapy Device", category: "Bioelectromagnetics", patent: "PPA 2024", tier: "commercial" },
  { id: "priore_modern", name: "Prioré-Type Multichannel EM Therapy System", category: "Bioelectromagnetics", patent: "PPA 2024", tier: "commercial" },
  { id: "meg_kit", name: "MEG Replication Kit", category: "Vacuum Energy", patent: "US 6,362,718 derivative", tier: "research" },
  { id: "asymmetric", name: "Asymmetric Regauging Overunity Generator", category: "Vacuum Energy", patent: "Patent Pending", tier: "commercial" },
  { id: "ppdts", name: "Portable Porthole Disease Treatment System", category: "Bioelectromagnetics", patent: "PPA 2025", tier: "exclusive" },
  { id: "t_polarized", name: "T-Polarized EM Wave Transducer", category: "Scalar EM", patent: "PPA 2025", tier: "exclusive" },
  { id: "pcm", name: "Whittaker Wave Phase Conjugate Mirror System", category: "Scalar EM", patent: "PPA 2025", tier: "commercial" },
  { id: "fireflies", name: "Quantum Potential EMI Detector (Fireflies)", category: "Scalar Sensing", patent: "PPA 2024", tier: "commercial" },
  { id: "elf_detector", name: "ELF Carrier Lock Detection System", category: "Scalar Sensing", patent: "Trade Secret", tier: "commercial" },
  { id: "phi_river", name: "Phi-River Gradient Sensor (∇φ Detector)", category: "Scalar Sensing", patent: "PPA 2025", tier: "research" },
  { id: "atmos_ai", name: "Atmospheric Scalar EM Signature AI System", category: "Scalar Sensing", patent: "Software Patent Pending", tier: "commercial" },
  { id: "morphogenetic", name: "Morphogenetic Field Coherence Monitor", category: "Bioelectromagnetics", patent: "Concept / PPA 2025", tier: "exclusive" },
  { id: "bioenergetics", name: "Psychoenergetics Cellular Control System", category: "Bioelectromagnetics", patent: "Trade Secret", tier: "exclusive" },
];

const CATEGORY_COLORS = {
  "Vacuum Energy": "#f59e0b",
  "Bioelectromagnetics": "#22c55e",
  "Scalar EM": "#6366f1",
  "Scalar Sensing": "#06b6d4",
};

const STEP_LABELS = ["Select Tier", "Choose Architectures", "Your Details", "Review & Sign"];

export default function LicensingPortal() {
  const [step, setStep] = useState(0);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [form, setForm] = useState({ name: "", org: "", email: "", role: "", jurisdiction: "", intended_use: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const tier = TIERS.find(t => t.id === selectedTier);

  const maxDevices = selectedTier === "research" ? 3 : selectedTier === "commercial" ? 8 : 24;

  const toggleDevice = (id) => {
    if (selectedDevices.includes(id)) {
      setSelectedDevices(d => d.filter(x => x !== id));
    } else {
      if (selectedDevices.length >= maxDevices) return;
      setSelectedDevices(d => [...d, id]);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.org) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");

    const deviceNames = selectedDevices.map(id => DEVICES.find(d => d.id === id)?.name).filter(Boolean);

    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: `Zenith Apex — Licensing Agreement Initiated: ${tier.name}`,
      body: `Dear ${form.name},\n\nThank you for initiating a licensing inquiry with Zenith Apex Research Portfolio.\n\nLICENSE TIER: ${tier.name}\nANNUAL FEE: ${tier.price}\nORGANIZATION: ${form.org}\nJURISDICTION: ${form.jurisdiction || "Not specified"}\n\nSELECTED DEVICE ARCHITECTURES (${deviceNames.length}):\n${deviceNames.map(n => `  • ${n}`).join("\n")}\n\nINTENDED USE:\n${form.intended_use}\n\nNEXT STEPS:\n1. Our licensing team will review your submission within 2 business days.\n2. You will receive a DocuSign envelope with the full licensing agreement for electronic signature.\n3. Upon execution, you will receive immediate access to selected architecture files.\n\nIf you have questions, reply to this email.\n\nNOTE: This initiation is subject to NDA execution and identity verification. All licensing agreements include liquidated damages of $2.5M per breach incident.\n\n— Zenith Apex Research Portfolio\nLicensing Department`
    });

    await base44.integrations.Core.SendEmail({
      to: "zenithapexresearch@gmail.com",
      subject: `[LICENSING INQUIRY] ${tier.name} — ${form.org}`,
      body: `New licensing inquiry received.\n\nTIER: ${tier.name} (${tier.price})\nNAME: ${form.name}\nORG: ${form.org}\nEMAIL: ${form.email}\nROLE: ${form.role}\nJURISDICTION: ${form.jurisdiction}\n\nDEVICES SELECTED (${deviceNames.length}/${maxDevices}):\n${deviceNames.map(n => `  • ${n}`).join("\n")}\n\nINTENDED USE:\n${form.intended_use}`
    });

    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-900/40 border-2 border-green-600 flex items-center justify-center mx-auto">
            <Check size={36} className="text-green-400" />
          </div>
          <h1 className="text-white font-black text-2xl">Licensing Inquiry Submitted</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your <strong className="text-white">{tier?.name}</strong> licensing inquiry has been received. A DocuSign agreement will be sent to <strong className="text-yellow-400">{form.email}</strong> within 2 business days.
          </p>
          <div className="bg-gray-900 border border-yellow-900/40 rounded-2xl p-5 text-left space-y-3">
            <p className="text-yellow-400 font-bold text-sm">Next Steps</p>
            {["Our team reviews your submission (2 business days)", "DocuSign agreement sent to your email", "Upon execution — immediate architecture file access", "Technical onboarding call scheduled"].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-yellow-900/60 border border-yellow-700 text-yellow-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                <p className="text-gray-300 text-xs">{s}</p>
              </div>
            ))}
          </div>
          <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm">← Back to Platform</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-yellow-900/40 bg-gray-900/80 px-5 py-4 flex items-center gap-4 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-black text-lg tracking-tight">IP Licensing Portal</h1>
          <p className="text-yellow-600 text-xs font-semibold uppercase tracking-widest">Zenith Apex Research Portfolio</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Lock size={13} className="text-green-400" />
          <span className="text-green-400 text-xs font-bold">NDA-Protected</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-gray-900/60 border-b border-gray-800 px-5 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${i < step ? "bg-green-600 text-white" : i === step ? "bg-yellow-600 text-black" : "bg-gray-800 text-gray-600"}`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${i === step ? "text-yellow-300" : i < step ? "text-green-400" : "text-gray-600"}`}>{label}</span>
              {i < STEP_LABELS.length - 1 && <div className="flex-1 h-px bg-gray-800 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-8">
        <div className="max-w-5xl mx-auto">

          {/* STEP 0 — Tier Selection */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-white font-black text-2xl mb-2">Select a Licensing Tier</h2>
                <p className="text-gray-500 text-sm">Choose the tier that matches your commercialization scope. All tiers require NDA execution before agreement delivery.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {TIERS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTier(t.id)}
                    className={`text-left rounded-2xl border p-6 transition-all ${selectedTier === t.id ? "border-yellow-500 bg-yellow-950/20" : "border-gray-800 bg-gray-900 hover:border-gray-600"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-widest" style={{ backgroundColor: t.color + "22", color: t.color, border: `1px solid ${t.color}44` }}>{t.badge}</span>
                      {t.popular && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/60 border border-yellow-700 text-yellow-300 font-bold">★ Most Selected</span>}
                      {selectedTier === t.id && <Check size={16} className="text-yellow-400" />}
                    </div>
                    <h3 className="text-white font-black text-lg mb-1">{t.name}</h3>
                    <p className="font-black text-xl mb-0.5" style={{ color: t.color }}>{t.price}</p>
                    <p className="text-gray-500 text-xs mb-4">{t.priceNote}</p>
                    <div className="space-y-1.5">
                      {t.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check size={11} className="flex-shrink-0 mt-0.5" style={{ color: t.color }} />
                          <span className="text-gray-300 text-xs">{f}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-600 text-xs mt-4 border-t border-gray-800 pt-3">{t.restrictions}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  disabled={!selectedTier}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm transition-all disabled:opacity-40"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1 — Device Architecture Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-white font-black text-2xl mb-2">Select Device Architectures</h2>
                <p className="text-gray-500 text-sm">
                  Your <span className="text-yellow-400 font-bold">{tier?.name}</span> allows up to{" "}
                  <span className="text-white font-bold">{maxDevices === 24 ? "all 24" : maxDevices}</span> architectures.{" "}
                  <span className="text-yellow-300">{selectedDevices.length} / {maxDevices} selected.</span>
                </p>
              </div>

              {/* Category filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DEVICES.map(d => {
                  const locked = !selectedDevices.includes(d.id) && selectedDevices.length >= maxDevices;
                  const selected = selectedDevices.includes(d.id);
                  const catColor = CATEGORY_COLORS[d.category] || "#6b7280";
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleDevice(d.id)}
                      disabled={locked}
                      className={`text-left rounded-xl border p-4 transition-all ${selected ? "border-yellow-500 bg-yellow-950/20" : locked ? "border-gray-800 bg-gray-900/40 opacity-40 cursor-not-allowed" : "border-gray-800 bg-gray-900 hover:border-gray-600"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-bold leading-snug mb-1">{d.name}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: catColor + "20", color: catColor }}>{d.category}</span>
                            <span className="text-gray-600 text-xs">{d.patent}</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${selected ? "bg-yellow-600 border-yellow-500" : "border-gray-700"}`}>
                          {selected && <Check size={11} className="text-black" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(0)} className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm">← Back</button>
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedDevices.length === 0}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm transition-all disabled:opacity-40"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Contact Details */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-white font-black text-2xl mb-2">Your Details</h2>
                <p className="text-gray-500 text-sm">Required for agreement preparation and DocuSign delivery.</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                {[
                  { key: "name", label: "Full Legal Name *", placeholder: "As it will appear on the agreement" },
                  { key: "org", label: "Organization / Entity *", placeholder: "Company, lab, or individual name" },
                  { key: "email", label: "Email for DocuSign *", placeholder: "Agreement will be sent here" },
                  { key: "role", label: "Your Role / Title", placeholder: "CEO, CTO, Research Director, etc." },
                  { key: "jurisdiction", label: "Jurisdiction / Country", placeholder: "e.g. United States, UK, EU" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-gray-400 text-xs font-semibold mb-1.5">{field.label}</label>
                    <input
                      value={form[field.key]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1.5">Intended Use / Application</label>
                  <textarea
                    value={form.intended_use}
                    onChange={e => setForm(f => ({ ...f, intended_use: e.target.value }))}
                    placeholder="Briefly describe your intended commercial or research application..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600 resize-none"
                  />
                </div>
              </div>
              <div className="bg-yellow-950/30 border border-yellow-900/40 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={15} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-200 text-xs leading-relaxed">By proceeding, you acknowledge that all licensing agreements include an NDA clause with <strong>$2.5M liquidated damages per breach</strong>. Your submission is logged and timestamped.</p>
                </div>
              </div>
              {error && <p className="text-red-400 text-xs bg-red-950/30 border border-red-800 rounded-xl px-4 py-3">{error}</p>}
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm">← Back</button>
                <button
                  onClick={() => { if (!form.name || !form.email || !form.org) { setError("Please fill name, organization, and email."); return; } setError(""); setStep(3); }}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm transition-all"
                >
                  Review Agreement <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Review & Sign */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-white font-black text-2xl mb-2">Review & Initiate Agreement</h2>
                <p className="text-gray-500 text-sm">Confirm your selections. A DocuSign envelope will be sent to your email upon submission.</p>
              </div>

              {/* Summary card */}
              <div className="bg-gray-900 border border-yellow-900/40 rounded-2xl p-6 space-y-5">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">License Tier</p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-black text-lg">{tier?.name}</h3>
                    <span className="text-yellow-400 font-black text-lg">{tier?.price}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{tier?.priceNote}</p>
                </div>
                <div className="border-t border-gray-800 pt-4">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Selected Architectures ({selectedDevices.length})</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedDevices.map(id => {
                      const d = DEVICES.find(x => x.id === id);
                      return (
                        <div key={id} className="flex items-center gap-2">
                          <Check size={11} className="text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-xs">{d?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border-t border-gray-800 pt-4 space-y-2">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Licensee Details</p>
                  {[["Name", form.name], ["Organization", form.org], ["Email", form.email], ["Role", form.role || "—"], ["Jurisdiction", form.jurisdiction || "—"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-gray-500">{k}</span>
                      <span className="text-gray-300 font-semibold text-right max-w-[65%] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreement terms preview */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={14} className="text-blue-400" />
                  <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">Agreement Summary</p>
                </div>
                <div className="text-gray-500 text-xs leading-relaxed space-y-2">
                  <p>This licensing agreement grants the licensee rights to the selected Zenith Apex device architectures under the terms of the <strong className="text-gray-300">{tier?.name}</strong>.</p>
                  <p>The agreement includes: IP access rights, sublicensing terms, confidentiality obligations, payment schedule, and liquidated damages of <strong className="text-yellow-300">$2.5M per breach incident</strong>.</p>
                  <p>Full agreement (15–22 pages) will be delivered via DocuSign to <strong className="text-white">{form.email}</strong> within 2 business days of submission.</p>
                  <p>By submitting, you confirm that the information provided is accurate and that you have authority to bind your organization to licensing agreements.</p>
                </div>
              </div>

              {error && <p className="text-red-400 text-xs bg-red-950/30 border border-red-800 rounded-xl px-4 py-3">{error}</p>}

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm">← Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-black font-black text-sm transition-all disabled:opacity-60 shadow-lg"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                  {submitting ? "Submitting…" : "Submit & Initiate DocuSign →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}