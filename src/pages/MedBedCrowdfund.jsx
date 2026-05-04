import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Zap, Brain, Shield, Activity, Star, TrendingUp, DollarSign, Users, Target, Layers } from "lucide-react";
import LibraryBackground from "@/components/backgrounds/LibraryBackground";

const DEVICES = [
  { name: "MedBed Pro 2.0", subtitle: "Full-Body Multi-Modal", bom: "$29,725", msrp: "$55,000", margin: "46%", desc: "World's first AI-adaptive closed-loop healing system with 10+ modalities, robotic bio-sensor arm, Rife frequencies, photobiomodulation, and EEG biofeedback.", color: "cyan", revenue: "$518,400/yr", roi: "6–14 months" },
  { name: "EM Trigger Window", subtitle: "Clinical PEMF Chamber", bom: "$2,808", msrp: "$28,000", margin: "90%", desc: "Precision PEMF therapy via matched Helmholtz coils with DDS signal generator achieving sub-0.1Hz frequency resolution. Class A amplification.", color: "purple", revenue: "$345,600/yr", roi: "8–16 months" },
  { name: "KRCIC", subtitle: "Kaznacheyev Reversal Cell", bom: "$10,548", msrp: "$35,000", margin: "70%", desc: "Soviet biophoton research replicated. Single-photon counting PMTs detect ultra-weak biophoton emissions for cellular communication research.", color: "green", revenue: "$576,000/yr", roi: "12–24 months" },
  { name: "UBDRS", subtitle: "UV Biophoton Spectrometer", bom: "$7,741", msrp: "$48,000", margin: "84%", desc: "UV-Vis spectrometry + NVIDIA Jetson Nano ML identifies disease-specific biophoton signatures in real time via spectral fingerprint matching.", color: "yellow", revenue: "$460,800/yr", roi: "10–20 months" },
  { name: "WVTS", subtitle: "Waddington Valley EM Tracer", bom: "$7,680", msrp: "$38,000", margin: "80%", desc: "Maps electromagnetic signatures across Waddington developmental landscape. Enables unprecedented cellular reprogramming insight.", color: "pink", revenue: "$691,200/yr", roi: "14–28 months" },
  { name: "PCCS", subtitle: "Psychoenergetics Cellular", bom: "$3,580", msrp: "$32,000", margin: "89%", desc: "3-layer DDS modulation hierarchy through bifilar scalar coils. Precision psychoenergetic cellular control based on Popp's biophoton coherence theory.", color: "orange", revenue: "$403,200/yr", roi: "9–18 months" },
  { name: "PCM System", subtitle: "Whittaker Wave Phase Conjugate", bom: "$6,880", msrp: "$45,000", margin: "85%", desc: "Implements Whittaker's superpotential wave theory using barium titanate crystals to time-reverse diseased EM signatures.", color: "cyan", revenue: "$576,000/yr", roi: "12–22 months" },
  { name: "PPDTS", subtitle: "Portable Porthole Disease", bom: "$3,770", msrp: "$22,000", margin: "83%", desc: "Suitcase-portable device measuring biophoton spectrum via NVIDIA Jetson Nano. Delivers antifield therapy through copper-mesh antenna blankets.", color: "purple", revenue: "$230,400/yr", roi: "6–12 months" },
  { name: "Prioré-Type EM", subtitle: "Multichannel EM Therapy", bom: "$7,085", msrp: "$28,000", margin: "75%", desc: "Inspired by Antoine Prioré's cancer remission research. 3-layer FPGA-orchestrated DDS driving Helmholtz coils inside a full-body Faraday chamber.", color: "green", revenue: "$345,600/yr", roi: "8–16 months" },
];

const REVENUE_PROJECTIONS = [
  { year: "2026", devices: 18, revenue: "$1.08M", gross: "$594K", ebitda: "($5.8M)" },
  { year: "2027", devices: 130, revenue: "$7.6M", gross: "$4.5M", ebitda: "($3.9M)" },
  { year: "2028", devices: 480, revenue: "$28.9M", gross: "$17.3M", ebitda: "$2.1M" },
  { year: "2029", devices: 1200, revenue: "$71.6M", gross: "$43.7M", ebitda: "$14.2M" },
  { year: "2030", devices: 3100, revenue: "$186.8M", gross: "$116.4M", ebitda: "$52M" },
];

const FUNDING_ROUNDS = [
  { round: "Round 0", label: "Personal Capital + Credit", amount: "$50K–$150K", timing: "Right Now", desc: "Personal savings, HELOC, ROBS 401K business loan; SBA Microloan up to $50K." },
  { round: "Round 1", label: "Friends, Family & Angels", amount: "$100K–$500K", timing: "Months 1–3", desc: "SAFE with $5M–$8M valuation cap. Target integrative MDs, health entrepreneurs, AngelList syndicates." },
  { round: "Round 2", label: "Revenue-Based Financing", amount: "$50K–$250K", timing: "Month 6+", desc: "Clearco / Pipe / Capchase: 3–6 months of projected revenue advance. No equity dilution." },
  { round: "Round 3", label: "Grants (SBIR/STTR)", amount: "$25K–$500K", timing: "Months 1–12", desc: "NIH SBIR Phase I: up to $275K non-dilutive for biomedical device R&D." },
  { round: "Round 4", label: "Institutional Seed", amount: "$500K–$3M", timing: "Month 6–9", desc: "Rock Health, Khosla, General Catalyst. Priced equity at $8M–$15M pre-money." },
  { round: "Round 5", label: "SBA 7(a) Expansion Loan", amount: "$500K–$5M", timing: "Year 2", desc: "Up to $5M at prime + 2.25%, 10-year term for MedSpa locations." },
  { round: "Round 6", label: "Series A VC Round", amount: "$12M–$18M", timing: "Month 18–24", desc: "Target a16z Bio, Khosla, Rock Health. Milestones: $500K ARR, 3 MedSpa locations, 50 clinic partners, FDA filed." },
];

const PLEDGE_TIERS = [
  { amount: 500, label: "Pioneer", perks: ["Research updates", "Name in credits", "PDF BOM access", "Prototype video walkthroughs"] },
  { amount: 2500, label: "Clinical Partner", perks: ["All above", "Name on prototype unit", "Quarterly researcher calls", "Priority pre-order access"] },
  { amount: 10000, label: "Founding Investor", perks: ["All above", "Advisory board seat", "Revenue share discussion", "Series A deal flow access"] },
  { amount: 50000, label: "Series Seed Backer", perks: ["All above", "SAFE convertible note terms", "Direct founder access", "IP portfolio co-ownership discussion"] },
];

const MODALITIES = [
  "Rife Frequency Therapy (10Hz–10,000Hz via plasma tubes)",
  "Red/NIR Photobiomodulation (630nm + 850nm, 4 articulating panels)",
  "Faraday EMF Shielding (military-grade mesh + copper coils)",
  "6-Chamber Programmable Aromatherapy Diffusion",
  "Crystal Resonance Arrays (quartz, amethyst, rose quartz)",
  "EEG Neural Interface (14-channel biofeedback loop)",
  "Noble Gas Plasma Tubes ×6 (argon/neon, 600mm)",
  "Infinity Mirror + Sacred Geometry Immersive Display",
  "Holographic 3D Fan Display",
  "Robotic 5-DOF Bio-Sensor Arm",
];

const colorMap = {
  cyan: "border-cyan-500/60 text-cyan-400",
  purple: "border-purple-500/60 text-purple-400",
  green: "border-green-500/60 text-green-400",
  yellow: "border-yellow-500/60 text-yellow-400",
  pink: "border-pink-500/60 text-pink-400",
  orange: "border-orange-500/60 text-orange-400",
};

export default function MedBedCrowdfund() {
  const [expandedDevice, setExpandedDevice] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handlePledge = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <LibraryBackground />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/70 backdrop-blur px-6 py-4 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">← Back to Platform</Link>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-black tracking-widest uppercase">Live Raise — MedBed Pro 2.0</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-cyan-500/40 bg-cyan-950/30">
              <Zap size={14} className="text-cyan-400" />
              <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">MedBed Therapeutics Inc. — Confidential Raise</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              MedBed Pro 2.0
              <br />
              <span style={{ background: "linear-gradient(135deg, #00ccff, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                World's First AI-Adaptive<br />Multi-Modal Healing System
              </span>
            </h1>
            <p className="text-gray-300 text-base leading-relaxed mb-10 max-w-2xl mx-auto">
              A 9-device therapeutic ecosystem combining Rife frequency therapy, photobiomodulation, biophoton research, and closed-loop AI biometric adaptation. $480M target valuation. $89B TAM. 9 patent claims filed.
            </p>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
              {[
                { val: "$480M", label: "Target Valuation" },
                { val: "$89B", label: "Total TAM" },
                { val: "$38M–$92M", label: "IP Portfolio Value" },
                { val: "9 Devices", label: "Therapeutic Ecosystem" },
                { val: "9 Claims", label: "Patents Filed" },
                { val: "65–91%", label: "Gross Margins" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 backdrop-blur">
                  <p className="text-xl font-black text-white">{s.val}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#pledge"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-black transition-all hover:scale-105"
                style={{ background: "linear-gradient(90deg, #00ccff, #a855f7)", boxShadow: "0 4px 24px rgba(0,200,255,0.4)" }}>
                Invest Now <ArrowRight size={15} />
              </a>
              <a href="#devices"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-white border border-cyan-500/50 hover:bg-cyan-950/30 transition">
                View 9-Device Ecosystem <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* MedBed Pro 2.0 Flagship */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-950/50 to-purple-950/50 border border-cyan-700/50 rounded-2xl p-8 backdrop-blur">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">Flagship Device</p>
                  <h2 className="text-3xl font-black text-white mb-4">MedBed Pro 2.0</h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    A full-body therapeutic chamber combining 10+ healing modalities under closed-loop AI control. The robotic bio-sensor arm continuously reads biometric data (HRV, GSR, SpO2, EEG) and adapts Rife frequencies, photobiomodulation intensity, and aromatherapy profiles in real time.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: "BOM Cost", val: "$29,725" },
                      { label: "MSRP", val: "$55,000" },
                      { label: "Gross Margin", val: "46%" },
                      { label: "5-Year LTV", val: "$97,340" },
                    ].map((s, i) => (
                      <div key={i} className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
                        <p className="text-gray-500 text-xs">{s.label}</p>
                        <p className="text-white font-black text-lg">{s.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                    <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">Revenue Per Deployed Unit</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-gray-500">Session Price:</span> <span className="text-white">$150–$299</span></div>
                      <div><span className="text-gray-500">Daily (8 sessions):</span> <span className="text-white">$1,800–$3,000</span></div>
                      <div><span className="text-gray-500">Monthly (60% util):</span> <span className="text-white font-black text-green-400">$43,200</span></div>
                      <div><span className="text-gray-500">Annual Revenue:</span> <span className="text-white font-black">$518,400</span></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-3">10+ Modalities</p>
                  <div className="space-y-2">
                    {MODALITIES.map((m, i) => (
                      <p key={i} className="text-gray-300 text-xs flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>{m}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9-Device Ecosystem */}
        <section id="devices" className="px-6 py-16 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">Complete Ecosystem</p>
              <h2 className="text-3xl font-black text-white mb-3">9-Device Therapeutic Ecosystem</h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">Total BOM: $79,817 | Total MSRP: $331,000 | Average Margin: 76%</p>
            </div>

            {/* Summary table */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur mb-8">
              <div className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-gray-800 text-xs font-black text-gray-500 uppercase tracking-wider">
                <span>Device</span><span>BOM Cost</span><span>MSRP</span><span>Margin</span>
              </div>
              {DEVICES.map((d, i) => (
                <div key={i} className={`grid grid-cols-4 gap-4 px-5 py-3 text-sm cursor-pointer hover:bg-gray-800/40 transition-colors ${i % 2 === 0 ? 'bg-gray-900/20' : ''}`}
                  onClick={() => setExpandedDevice(expandedDevice === i ? null : i)}>
                  <span className="text-white font-black">{d.name}</span>
                  <span className="text-gray-400">{d.bom}</span>
                  <span className="text-cyan-400 font-black">{d.msrp}</span>
                  <span className="text-green-400 font-black">{d.margin}</span>
                </div>
              ))}
              <div className="grid grid-cols-4 gap-4 px-5 py-4 border-t border-gray-700 bg-gray-800/50">
                <span className="text-white font-black">TOTAL — All 9 Devices</span>
                <span className="text-white font-black">$79,817</span>
                <span className="text-white font-black">$331,000</span>
                <span className="text-green-400 font-black">76%</span>
              </div>
            </div>

            {/* Device cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEVICES.map((d, i) => (
                <div key={i} className={`bg-gray-900/60 border rounded-2xl p-5 backdrop-blur cursor-pointer transition-all ${colorMap[d.color]} ${expandedDevice === i ? 'ring-1 ring-cyan-500/40' : 'hover:bg-gray-900/80'}`}
                  onClick={() => setExpandedDevice(expandedDevice === i ? null : i)}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-xs font-black uppercase tracking-widest ${colorMap[d.color].split(' ')[1]}`}>{d.subtitle}</p>
                    {expandedDevice === i ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </div>
                  <h3 className="text-white font-black text-lg mb-2">{d.name}</h3>
                  <div className="flex gap-3 text-xs mb-3">
                    <span className="text-gray-500">BOM: <span className="text-white">{d.bom}</span></span>
                    <span className="text-gray-500">MSRP: <span className="text-cyan-400 font-black">{d.msrp}</span></span>
                    <span className="text-gray-500">Margin: <span className="text-green-400 font-black">{d.margin}</span></span>
                  </div>
                  {expandedDevice === i && (
                    <div className="border-t border-gray-700 pt-3 mt-2">
                      <p className="text-gray-400 text-xs leading-relaxed mb-3">{d.desc}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-800/50 rounded-lg p-2">
                          <p className="text-gray-500">Annual Revenue</p>
                          <p className="text-green-400 font-black">{d.revenue}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2">
                          <p className="text-gray-500">ROI Payback</p>
                          <p className="text-cyan-400 font-black">{d.roi}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Analysis */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-3">Market Opportunity</p>
              <h2 className="text-3xl font-black text-white">$89B Total Addressable Market</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { val: "$62B", label: "TAM", desc: "Global wellness technology market (2025)" },
                { val: "$14B", label: "SAM", desc: "PEMF + photobiomodulation + clinical wellness devices" },
                { val: "$420M", label: "SOM", desc: "Realistic 5-year serviceable market capture (3%)" },
              ].map((m, i) => (
                <div key={i} className="bg-gray-900/70 border border-purple-900/40 rounded-2xl p-6 text-center backdrop-blur">
                  <p className="text-4xl font-black text-purple-400 mb-1">{m.val}</p>
                  <p className="text-white font-black mb-2">{m.label}</p>
                  <p className="text-gray-400 text-xs">{m.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur">
              <div className="px-5 py-4 border-b border-gray-800">
                <p className="text-white font-black">Key Market Segments</p>
              </div>
              {[
                { seg: "Clinical Wellness Centers", size: "$8.2B", cagr: "18%" },
                { seg: "Autism & Neurodevelopmental Therapy", size: "$3.1B", cagr: "22%" },
                { seg: "Sports Recovery & Performance", size: "$5.7B", cagr: "24%" },
                { seg: "Home Wellness / DTC Premium", size: "$12B", cagr: "31%" },
                { seg: "Integrative Medicine Clinics", size: "$4.4B", cagr: "16%" },
                { seg: "Longevity & Anti-Aging Clinics", size: "$6.3B", cagr: "28%" },
              ].map((s, i) => (
                <div key={i} className={`grid grid-cols-3 gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? 'bg-gray-900/20' : ''}`}>
                  <span className="text-gray-300">{s.seg}</span>
                  <span className="text-white font-black">{s.size}</span>
                  <span className="text-green-400 font-black">{s.cagr} CAGR</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue Projections */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">Financial Projections</p>
              <h2 className="text-3xl font-black text-white">Path to $186.8M Revenue by 2030</h2>
              <p className="text-gray-400 text-sm mt-2">Hardware + SaaS ($499/mo/device) + Consumables + Licensing</p>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur mb-8">
              <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-gray-800 text-xs font-black text-gray-500 uppercase tracking-wider">
                <span>Year</span><span>Devices</span><span>Revenue</span><span>Gross Profit</span><span>EBITDA</span>
              </div>
              {REVENUE_PROJECTIONS.map((r, i) => (
                <div key={i} className={`grid grid-cols-5 gap-4 px-5 py-4 text-sm ${i % 2 === 0 ? 'bg-gray-900/20' : ''}`}>
                  <span className="text-cyan-400 font-black">{r.year}</span>
                  <span className="text-gray-300">{r.devices.toLocaleString()}</span>
                  <span className="text-white font-black">{r.revenue}</span>
                  <span className="text-green-400">{r.gross}</span>
                  <span className={r.ebitda.startsWith('(') ? 'text-red-400' : 'text-green-400 font-black'}>{r.ebitda}</span>
                </div>
              ))}
            </div>

            {/* MedSpa model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/70 border border-green-900/40 rounded-2xl p-6 backdrop-blur">
                <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">MedSpa Launch Plan — 5 Unit Fleet</p>
                <h3 className="text-white font-black text-lg mb-4">Monthly P&L (60% Utilization)</h3>
                {[
                  { label: "Gross Revenue", val: "$43,200", pos: true },
                  { label: "Staff Costs", val: "($14,500)", pos: false },
                  { label: "Rent (premium wellness)", val: "($10,000)", pos: false },
                  { label: "SaaS Platform (5 beds)", val: "($2,495)", pos: false },
                  { label: "Consumables & Supplies", val: "($2,000)", pos: false },
                  { label: "Marketing & Advertising", val: "($3,000)", pos: false },
                  { label: "Insurance & Misc", val: "($800)", pos: false },
                ].map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-gray-800/50">
                    <span className="text-gray-400">{l.label}</span>
                    <span className={l.pos ? 'text-white font-black' : 'text-red-400'}>{l.val}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm pt-2 font-black">
                  <span className="text-white">NET OPERATING PROFIT</span>
                  <span className="text-green-400 text-lg">$10,405/mo</span>
                </div>
              </div>

              <div className="bg-gray-900/70 border border-cyan-900/40 rounded-2xl p-6 backdrop-blur">
                <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">Exit Scenarios</p>
                {[
                  { label: "IP Portfolio Acquisition (2026–27)", val: "$38M–$92M", desc: "Sell patent portfolio. Company continues under perpetual license." },
                  { label: "Full Company Acquisition (2028–29)", val: "$280M–$520M", desc: "Philips, Medtronic, Apple Health. 4–6× revenue multiple." },
                  { label: "Series C / Pre-IPO (2029)", val: "$600M–$900M", desc: "Growth equity at $130M+ ARR. Sets up NASDAQ listing." },
                  { label: "IPO — NASDAQ (2030–31)", val: "$1.2B–$2.4B", desc: "Healthcare tech IPO at 8–13× forward revenue on $187M ARR." },
                ].map((s, i) => (
                  <div key={i} className="mb-4 pb-4 border-b border-gray-800/50 last:border-0 last:mb-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-black text-xs">{s.label}</p>
                      <span className="text-cyan-400 font-black text-sm">{s.val}</span>
                    </div>
                    <p className="text-gray-500 text-xs">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* IP Strategy */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-3">Intellectual Property</p>
              <h2 className="text-3xl font-black text-white">$38M–$92M IP Portfolio</h2>
              <p className="text-gray-400 text-sm mt-2">Income approach, royalty relief method across 9-device ecosystem</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { val: "9 Claims", label: "Utility Patents" },
                { val: "5 Algorithms", label: "Trade Secrets" },
                { val: "9 Systems", label: "Device Families" },
                { val: "3 Filed", label: "Trademarks" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-900/70 border border-yellow-900/40 rounded-2xl p-5 text-center backdrop-blur">
                  <p className="text-2xl font-black text-yellow-400 mb-1">{s.val}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur">
              <p className="text-white font-black mb-4">Key Patent Claims</p>
              <div className="space-y-3">
                {[
                  { claim: "Claim 1 — Apparatus", desc: "Multi-modal therapeutic healing apparatus: titanium alloy bed frame; Faraday EM shielding canopy; Rife frequency generator; photobiomodulation LED panels (600–900nm); programmable aromatherapy diffusion array; central control PCU orchestrating all therapeutic modalities." },
                  { claim: "Claim 2 — Method", desc: "Closed-loop bioadaptive therapy delivery: measuring HRV, GSR, SpO2 in real time; biometric adaptation algorithm; automatically adjusting EM frequency, PBM intensity, and aromatherapy profile in response to detected physiological state changes." },
                  { claim: "Claim 3 — System", desc: "Therapy management system: cloud-connected control interface; patient biometric database; ML protocol optimization engine; practitioner-facing dashboard; AI-driven protocol generation module." },
                  { claim: "Claim 4 — EM Trigger Window", desc: "PEMF therapy apparatus: matched Helmholtz coil pair (250–350mm dia); DDS signal generator (frequency resolution <0.1Hz); Class A power amplifier; low-pass filter (>80dB 2nd harmonic attenuation)." },
                ].map((c, i) => (
                  <div key={i} className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                    <p className="text-cyan-400 font-black text-xs mb-1">{c.claim}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Funding Rounds */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-3">Funding Strategy</p>
              <h2 className="text-3xl font-black text-white">Step-by-Step Capital Raise</h2>
              <p className="text-gray-400 text-sm mt-2">$2M Seed → $18M Series A → IPO at $1.2B–$2.4B</p>
            </div>
            <div className="space-y-3">
              {FUNDING_ROUNDS.map((r, i) => (
                <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-xl p-5 flex gap-5 backdrop-blur hover:border-purple-700/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-purple-950/50 border border-purple-700/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 font-black text-xs">{i}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-gray-500 text-xs">{r.round} · </span>
                        <span className="text-white font-black text-sm">{r.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-black text-sm">{r.amount}</p>
                        <p className="text-gray-600 text-xs">{r.timing}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Target Investors */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">Target Investors</p>
              <h2 className="text-3xl font-black text-white">$18M Series A — Institutional Targets</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Andreessen Horowitz (a16z)", type: "Venture Capital · Series A–C · AUM: $35B+", fit: "Very High", desc: "Active biotech portfolio; funded Hims & Hers, Devoted Health, Nuvation Bio." },
                { name: "Khosla Ventures", type: "Venture Capital · Seed–Series B · AUM: $15B+", fit: "Very High", desc: "Loves paradigm-shifting hardware. Portfolio includes deep science disruption plays." },
                { name: "Rock Health", type: "Digital Health VC · Seed–Series A · AUM: $1.5B+", fit: "Very High", desc: "Perfect stage fit. Hands-on operator support for medical device go-to-market." },
                { name: "Longevity Vision Fund", type: "Longevity VC · Seed–Series A · AUM: $100M+", fit: "Very High", desc: "Direct mission alignment. Therapeutic healing technology is core to the longevity stack." },
                { name: "GV (Google Ventures)", type: "Corporate VC · Seed–Series C · AUM: $8B+", fit: "High", desc: "Biometric data integration and AI-driven protocol generation align perfectly with GV thesis." },
                { name: "Mayo Clinic Ventures", type: "Strategic / Hospital System · Evergreen", fit: "High", desc: "Investment + clinical trial access + FDA validation pathway + credibility boost." },
              ].map((inv, i) => (
                <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-xl p-5 backdrop-blur">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-black text-sm">{inv.name}</p>
                    <span className={`text-xs font-black px-2 py-1 rounded ${inv.fit === 'Very High' ? 'bg-green-950/50 text-green-400 border border-green-900' : 'bg-cyan-950/50 text-cyan-400 border border-cyan-900'}`}>
                      {inv.fit}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mb-2">{inv.type}</p>
                  <p className="text-gray-400 text-xs">{inv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pledge Tiers */}
        <section id="pledge" className="px-6 py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">Support the Raise</p>
              <h2 className="text-3xl font-black text-white">Investment & Pledge Tiers</h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">Register your interest. No payment charged now — we contact you at each milestone with terms and wire instructions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {PLEDGE_TIERS.map((tier, i) => (
                <div key={i}
                  onClick={() => setSelectedTier(tier)}
                  className={`bg-gray-900/70 border rounded-2xl p-5 cursor-pointer transition-all backdrop-blur ${selectedTier?.amount === tier.amount ? 'border-cyan-500 shadow-lg shadow-cyan-900/30' : 'border-gray-800 hover:border-gray-600'}`}>
                  <p className="text-3xl font-black text-white mb-1">${tier.amount.toLocaleString()}</p>
                  <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">{tier.label}</p>
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

            {!submitted ? (
              <form onSubmit={handlePledge} className="max-w-lg mx-auto bg-gray-900/80 border border-cyan-900/40 rounded-2xl p-7 backdrop-blur">
                <h3 className="text-white font-black text-lg mb-4">Register Your Investment Interest</h3>
                <p className="text-gray-400 text-sm mb-5">Enter your email to receive investor materials, term sheet access, and milestone updates.</p>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="investor@email.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-cyan-500 transition mb-3"
                />
                <div className="flex items-center gap-3 mb-5 text-sm">
                  <span className="text-gray-500">Selected tier:</span>
                  <span className="text-white font-black">{selectedTier ? `$${selectedTier.amount.toLocaleString()} — ${selectedTier.label}` : 'Select a tier above'}</span>
                </div>
                <button type="submit" disabled={!selectedTier}
                  className="w-full py-3 rounded-xl font-black text-sm text-black transition-all disabled:opacity-40 hover:scale-[1.02]"
                  style={{ background: "linear-gradient(90deg, #00ccff, #a855f7)" }}>
                  Register Interest — ${selectedTier?.amount?.toLocaleString() || '—'}
                </button>
                <p className="text-gray-600 text-xs mt-3 text-center">No payment now. Investor materials sent within 48 hours.</p>
              </form>
            ) : (
              <div className="max-w-lg mx-auto bg-green-950/50 border border-green-700 rounded-2xl p-7 text-center backdrop-blur">
                <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-black text-lg mb-2">Interest Registered</h3>
                <p className="text-gray-400 text-sm">Thank you. Investor materials will be sent to {email} within 48 hours. NDA required for full data room access.</p>
              </div>
            )}
          </div>
        </section>

        {/* Due Diligence Process */}
        <section className="px-6 py-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-3">Due Diligence Process</p>
              <h2 className="text-2xl font-black text-white">4-Stage DD Process</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { stage: "Stage 1", label: "NDA Execution", desc: "Sign NDA to gain access to Stage 1 investor materials." },
                { stage: "Stage 2", label: "Stage 1 Package", desc: "Executive summary, pitch deck, financials, IP overview delivered." },
                { stage: "Stage 3", label: "Management Meeting", desc: "Introductory call with CEO + CMO. Q&A on strategy and technology." },
                { stage: "Stage 4", label: "Full Data Room", desc: "Patents, clinical data, device specs, cap table, term sheet access." },
              ].map((s, i) => (
                <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-xl p-5 text-center backdrop-blur">
                  <div className="w-8 h-8 rounded-full bg-yellow-950/50 border border-yellow-700/50 flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-400 font-black text-xs">{i + 1}</span>
                  </div>
                  <p className="text-yellow-400 text-xs font-black mb-1">{s.stage}</p>
                  <p className="text-white font-black text-sm mb-2">{s.label}</p>
                  <p className="text-gray-500 text-xs">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="px-6 py-12 border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 text-xs leading-relaxed">
              <strong className="text-gray-500">CONFIDENTIAL — MedBed Therapeutics Inc.</strong> This document is proprietary and confidential. All financial projections are forward-looking statements based on current assumptions and are subject to change. This is not a registered securities offering. All investment discussions are subject to execution of an NDA and applicable securities law compliance. Devices are research tools — not FDA-cleared medical devices unless otherwise stated.
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