import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Brain, Activity, Zap, Shield, Music, Wind, Eye, ArrowRight, CheckCircle2, Users, Target, Clock, DollarSign } from "lucide-react";
import AutismBedBackgroundCarousel from "@/components/AutismBedBackgroundCarousel";
import AutismBed3DVisualization from "@/components/AutismBed3DVisualization";
import AutismBedCommercializationDeck from "@/components/AutismBedCommercializationDeck";

const MODALITIES = [
  { icon: <Activity size={18} className="text-blue-400" />, name: "HRV & Biometric Monitoring", desc: "Continuous heart rate variability, SpO2, and GSR tracking to detect anxiety onset and meltdown precursors in real time." },
  { icon: <Brain size={18} className="text-purple-400" />, name: "EEG Brainwave Sensing", desc: "Non-invasive 14-channel EEG headband monitors neural state. Alerts caregivers when stress patterns emerge before full meltdown." },
  { icon: <Zap size={18} className="text-yellow-400" />, name: "PEMF Relaxation Field", desc: "Low-intensity pulsed electromagnetic field at theta/delta frequencies (3–8 Hz) to promote calm and reduce physiological arousal." },
  { icon: <Shield size={18} className="text-green-400" />, name: "EMF Shielding Canopy", desc: "Faraday mesh canopy reduces ambient electromagnetic interference — a common sensory trigger for children with ASD." },
  { icon: <Music size={18} className="text-pink-400" />, name: "Vibroacoustic Stimulation", desc: "Low-frequency sound vibration delivered through the mattress. Clinically associated with reduced anxiety in sensory processing disorder." },
  { icon: <Wind size={18} className="text-cyan-400" />, name: "Aromatherapy Diffusion", desc: "Programmable 6-chamber diffusion system. Lavender, chamomile, and custom profiles auto-selected based on biometric state." },
  { icon: <Eye size={18} className="text-orange-400" />, name: "Sensory Light Environment", desc: "Soft chromotherapy LED dome with Lissajous patterns. Adjusts color temperature and brightness to reduce visual overstimulation." },
  { icon: <Heart size={18} className="text-red-400" />, name: "Weighted Pressure System", desc: "Programmable air-bladder compression panels simulate deep pressure stimulation — equivalent to weighted blanket therapy, dynamically adjusted." },
];

const FUNDING_TIERS = [
  { amount: 25, label: "Supporter", perks: ["Research updates", "Name in credits", "PDF build log access"] },
  { amount: 100, label: "Contributor", perks: ["All above", "Early access to research data", "Prototype video walkthroughs"] },
  { amount: 500, label: "Research Partner", perks: ["All above", "Name on prototype unit", "Quarterly researcher calls", "Pre-order priority"] },
  { amount: 2500, label: "Founding Backer", perks: ["All above", "Advisory board seat", "Co-inventor credit consideration", "Revenue share discussion"] },
];

const MILESTONES = [
  { phase: "Phase 1", amount: "$15,000", label: "Component procurement & PCB design", complete: false },
  { phase: "Phase 2", amount: "$35,000", label: "Prototype bed frame & sensor integration", complete: false },
  { phase: "Phase 3", amount: "$55,000", label: "Software dashboard & biometric alert system", complete: false },
  { phase: "Phase 4", amount: "$75,000", label: "Clinical pilot — 10 children, IRB-approved study", complete: false },
];

const BOM_PREVIEW = [
  { component: "Therapeutic Bed Frame (Titanium alloy)", cost: "$2,800" },
  { component: "EEG Neural Interface (14-ch, BLE)", cost: "$1,850" },
  { component: "Biometric Suite (HRV / GSR / SpO2)", cost: "$680" },
  { component: "PEMF Helmholtz Coil Pair (300mm, 80-turn)", cost: "$890" },
  { component: "Vibroacoustic Transducer Array (×4)", cost: "$640" },
  { component: "EMF Faraday Shielding Canopy (mesh)", cost: "$640" },
  { component: "Chromotherapy LED Dome System", cost: "$880" },
  { component: "Aromatherapy Diffusion Array (6-chamber)", cost: "$280" },
  { component: "AI Control PCB + Raspberry Pi (ISO 13485)", cost: "$580" },
  { component: "Weighted Pressure Bladder System", cost: "$420" },
  { component: "Sensory Accessory Tray Kit (certified)", cost: "$195" },
  { component: "Safety E-Stop + Emergency Relay (×2)", cost: "$300" },
];

export default function AutismBedCrowdfund() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalBOM = BOM_PREVIEW.reduce((sum, item) => {
    return sum + parseInt(item.cost.replace(/\$|,/g, ""));
  }, 0);

  const handlePledge = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <AutismBedBackgroundCarousel />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/60 backdrop-blur px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">← Back to Platform</Link>
            <span className="text-xs text-cyan-400 font-black tracking-widest uppercase">Research Crowdfund</span>
          </div>
        </div>

        {/* Hero */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-pink-500/40 bg-pink-950/30">
              <Heart size={14} className="text-pink-400" />
              <span className="text-xs font-black tracking-widest text-pink-400 uppercase">Autism Spectrum Research — Prototype Funding</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              The Autism Sensory Regulation Bed
              <br />
              <span style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Measure. Calm. Understand.
              </span>
            </h1>
            <p className="text-gray-300 text-base leading-relaxed mb-4 max-w-2xl mx-auto">
              A multi-modal sensory regulation environment for children on the autism spectrum. Designed to measure anxiety, detect meltdown precursors, and deliver calming sensory inputs — <strong className="text-white">not a medical device.</strong> A research prototype for caregiver-guided comfort and data collection.
            </p>
            <p className="text-gray-500 text-sm mb-10">
              All funds go directly to prototype construction. This is a research crowdfund — not equity or a medical product.
            </p>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { val: "$75K", label: "Prototype Goal" },
                { val: "8", label: "Sensory Modalities" },
                { val: "3.5M", label: "US Kids w/ ASD" },
                { val: "Phase 1", label: "Current Stage" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-xl p-4">
                  <p className="text-xl font-black text-white">{s.val}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Research Vision Section */}
        <section className="px-6 py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-pink-400 text-xs font-black uppercase tracking-widest mb-3">The Research Vision</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Why This Matters</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur">
                <h3 className="text-white font-black text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🧠</span> The Challenge
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  Children on the autism spectrum often experience sensory overload and anxiety that can escalate into meltdowns within minutes. Early detection is critical — but current tools require expensive clinical equipment or subjective observation. There's a gap: no accessible device exists that simultaneously monitors physiological stress markers AND delivers adaptive multi-modal calming interventions in a child-safe environment.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-cyan-900/40 rounded-xl p-6 backdrop-blur">
                <h3 className="text-white font-black text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Our Response
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  A sensory regulation bed that continuously monitors Heart Rate Variability (HRV), Galvanic Skin Response (GSR), EEG alpha waves, and oxygen saturation. When anxiety precursors are detected, the bed activates multi-modal calming responses: gentle vibration, color therapy, binaural beats, scent diffusion, and PEMF relaxation fields. Simple. Non-invasive. Data-driven.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-purple-900/40 rounded-xl p-6 backdrop-blur">
                <h3 className="text-white font-black text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">👨‍👩‍👧</span> For Families & Specialists
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  A secure caregiver dashboard visualizes 24/7 biometric patterns. Parents and therapists can identify triggers, track intervention effectiveness, spot daily rhythms, and export longitudinal reports. The data stays encrypted and private — no medical claims, purely a research tool for understanding what calms and what triggers each child.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-green-900/40 rounded-xl p-6 backdrop-blur">
                <h3 className="text-white font-black text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔬</span> Impact
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  Early intervention in sensory dysregulation can prevent behavioral escalation and reduce trauma. This prototype generates the first longitudinal dataset on real-time anxiety detection in autistic children — valuable for future clinical research, personalized therapeutic protocols, and next-generation sensory devices. We're building research infrastructure that will help thousands.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-7 backdrop-blur">
                <h2 className="text-xl font-black text-white mb-4">The Problem</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  Children with Autism Spectrum Disorder (ASD) frequently experience sensory overload and meltdowns that are difficult for caregivers to anticipate or de-escalate. Standard therapeutic tools are passive, static, and provide no biometric data.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  There is no existing device that simultaneously monitors physiological stress markers AND delivers adaptive multi-modal calming interventions in a child-safe, comfortable environment.
                </p>
              </div>
              <div className="bg-gray-900/70 border border-purple-900/40 rounded-2xl p-7 backdrop-blur">
                <h2 className="text-xl font-black text-white mb-4">The Prototype</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  A sensory-safe bed environment that continuously reads the child's biometrics (HRV, EEG, galvanic skin response) and responds with gentle sensory interventions: soft vibration, light adjustment, scent diffusion, and EMF-shielded calm space.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Data collected forms a longitudinal caregiver report — mapping what triggers anxiety, what reduces it, and how the child's baseline changes over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Commercialization Deck */}
        <AutismBedCommercializationDeck />

        {/* 3D Visualization */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-3">Interactive 3D Model</p>
              <h2 className="text-3xl font-black text-white">The Complete Autism Sensory Regulation Bed</h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">All 8 sensory systems integrated into a single therapeutic environment. Drag to rotate, scroll to zoom.</p>
            </div>
            <AutismBed3DVisualization />
          </div>
        </section>

        {/* Modalities */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-3">Device Modalities</p>
              <h2 className="text-3xl font-black text-white">8 Integrated Sensory Systems</h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">Each module works independently or as part of an adaptive AI protocol responding to the child's real-time biometric state.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MODALITIES.map((mod, i) => (
                <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 flex gap-4 backdrop-blur">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">{mod.icon}</div>
                  <div>
                    <p className="text-white font-black text-sm mb-1">{mod.name}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOM Preview */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">Bill of Materials (Prototype)</p>
              <h2 className="text-3xl font-black text-white">Verified Component Costs</h2>
              <p className="text-gray-400 text-sm mt-2">Prototype pricing. Volume manufacturing reduces BOM ~35–40%.</p>
            </div>
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur">
              <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 border-b border-gray-800 text-xs font-black text-gray-500 uppercase tracking-wider">
                <span>Component</span>
                <span>Unit Cost</span>
              </div>
              {BOM_PREVIEW.map((item, i) => (
                <div key={i} className={`grid grid-cols-[1fr_auto] gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                  <span className="text-gray-300">{item.component}</span>
                  <span className="text-cyan-400 font-black">{item.cost}</span>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 border-t border-gray-700 bg-gray-800/50">
                <span className="text-white font-black">Prototype BOM Total (12 core components)</span>
                <span className="text-white font-black text-lg">${totalBOM.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-3 text-center">Full 34-component BOM available to Research Partners ($500+). Costs exclude labour, software, and regulatory.</p>
          </div>
        </section>

        {/* Milestones */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">Funding Milestones</p>
              <h2 className="text-3xl font-black text-white">Phased Development Plan</h2>
            </div>
            <div className="space-y-4">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex items-center gap-5 bg-gray-900/60 border border-gray-800 rounded-xl px-6 py-4 backdrop-blur">
                  <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 font-black text-xs">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-sm">{m.phase} — {m.label}</p>
                  </div>
                  <span className="text-cyan-400 font-black text-sm">{m.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Caregiver Dashboard + Shop */}
        <section className="px-6 py-12 border-t border-white/10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/70 border border-cyan-900/40 rounded-2xl p-8 backdrop-blur">
              <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">For Active Users</p>
              <h3 className="text-2xl font-black text-white mb-3">Caregiver Portal</h3>
              <p className="text-gray-400 text-sm mb-6">Parents and caregivers using the prototype can access real-time biometric visualization, daily rhythm analysis, and PDF export to share with specialists.</p>
              <Link to="/caregiver-dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-all">
                Access Dashboard <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-gray-900/70 border border-pink-900/40 rounded-2xl p-8 backdrop-blur">
              <p className="text-pink-400 text-xs font-black uppercase tracking-widest mb-3">Component Shop</p>
              <h3 className="text-2xl font-black text-white mb-3">Source Parts Yourself</h3>
              <p className="text-gray-400 text-sm mb-6">DIY builders can source individual prototype components or full kits from our verified supplier network. Full BOM available to research backers.</p>
              <Link to="/alacarte" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-sm transition-all">
                Browse Component Shop <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Pledge Tiers */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-3">Support the Research</p>
              <h2 className="text-3xl font-black text-white">Pledge Tiers</h2>
              <p className="text-gray-400 text-sm mt-2">This is a research crowdfund. No equity. No medical claims. 100% toward prototype construction.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {FUNDING_TIERS.map((tier, i) => (
                <div key={i}
                  onClick={() => setSelectedTier(tier)}
                  className={`bg-gray-900/70 border rounded-2xl p-5 cursor-pointer transition-all backdrop-blur ${selectedTier?.amount === tier.amount ? 'border-purple-500 shadow-lg shadow-purple-900/30' : 'border-gray-800 hover:border-gray-600'}`}>
                  <p className="text-2xl font-black text-white mb-1">${tier.amount}</p>
                  <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-4">{tier.label}</p>
                  <div className="space-y-1.5">
                    {tier.perks.map((perk, j) => (
                      <p key={j} className="text-gray-400 text-xs flex items-start gap-1.5">
                        <CheckCircle2 size={11} className="text-green-400 flex-shrink-0 mt-0.5" /> {perk}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pledge form */}
            {!submitted ? (
              <form onSubmit={handlePledge} className="max-w-lg mx-auto bg-gray-900/80 border border-purple-900/40 rounded-2xl p-7 backdrop-blur">
                <h3 className="text-white font-black text-lg mb-4">Register Your Pledge</h3>
                <p className="text-gray-400 text-sm mb-5">Enter your email to be contacted with payment details and updates. No charge until we reach Phase 1 goal.</p>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500 transition mb-3"
                />
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-gray-500 text-sm">Pledge tier:</span>
                  <span className="text-white font-black">{selectedTier ? `$${selectedTier.amount} — ${selectedTier.label}` : 'Select a tier above'}</span>
                </div>
                <button
                  type="submit"
                  disabled={!selectedTier}
                  className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-40"
                  style={{ background: "linear-gradient(90deg, #7c3aed, #3b82f6)" }}>
                  Register Pledge — ${selectedTier?.amount || '—'}
                </button>
                <p className="text-gray-600 text-xs mt-3 text-center">No payment charged now. We'll contact you at Phase 1 milestone.</p>
              </form>
            ) : (
              <div className="max-w-lg mx-auto bg-green-950/50 border border-green-700 rounded-2xl p-7 text-center backdrop-blur">
                <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-black text-lg mb-2">Pledge Registered</h3>
                <p className="text-gray-400 text-sm">Thank you. We'll contact you at {email} when we hit Phase 1. No charge until then.</p>
              </div>
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="px-6 py-12 border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 text-xs leading-relaxed">
              <strong className="text-gray-500">Important:</strong> This prototype is a research and comfort device only. It is NOT a medical device, does not diagnose, treat, or cure any condition, and has not been evaluated by the FDA. All sensory modalities are low-intensity wellness technologies. Parental/caregiver supervision is required at all times. Research data will be used to improve caregiver tools only — not for clinical claims.
            </p>
            <div className="flex justify-center gap-6 text-gray-600 text-xs mt-5">
              <Link to="/research-disclaimer" className="hover:text-gray-400">Research Disclaimer</Link>
              <Link to="/terms" className="hover:text-gray-400">Terms</Link>
              <Link to="/" className="hover:text-gray-400">Back to Platform</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}