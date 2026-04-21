import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Zap, Shield, BookOpen, Download, Users, Star, Lock, ChevronRight, Sparkles, FlaskConical, Briefcase, Mail, Activity, CheckCircle2, Flame, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTier } from "@/hooks/useTier";
import { deviceImages } from "@/lib/deviceImages";

const INDIVIDUAL_BUILDS = [
  // ── PUBLIC TIER BUILD PLANS ──
  { name: "Vacuum Potential Oscillator (VPO) Circuit Kit", price: 189, category: "Build Plan", icon: "🔧", public: true },
  { name: "Open-System Magnetic Generator (Prototype Plans)", price: 179, category: "Build Plan", icon: "⚙️", public: true },
  { name: "Woodpecker Grid Standing Wave Detector", price: 249, category: "Build Plan", icon: "📻", public: true },
  { name: "Phi-River Gradient Sensor", price: 349, category: "Build Plan", icon: "🌊", public: true },
  { name: "Anenergy Pump Demonstration Circuit", price: 297, category: "Build Plan", icon: "🔋", public: true },
  { name: "Scalar Energy Bottle Interferometer", price: 449, category: "Build Plan", icon: "🎯", public: true },
  { name: "Quantum Potential EMI Detector", price: 497, category: "Build Plan", icon: "📡", public: true },
  { name: "EM Trigger Window Therapy Device", price: 599, category: "Build Plan", icon: "💊", public: true },
  { name: "Bedini Environmental EM Signal Conditioner", price: 697, category: "Build Plan", icon: "🎛️", public: true },
  { name: "Biofield Frequency Exposure Chamber", price: 397, category: "Build Plan", icon: "🧪", public: true },
  { name: "Morphogenetic Field Coherence Monitor", price: 799, category: "Build Plan", icon: "🌿", public: true },
  { name: "Whittaker Wave Phase Conjugate Mirror System", price: 849, category: "Build Plan", icon: "🔭", public: true },
  { name: "Prioré-Type Multichannel EM Therapy System", price: 697, category: "Build Plan", icon: "🏥", public: true },
  { name: "MEG Replication Kit", price: 847, category: "Build Plan", icon: "🔮", public: true },
  { name: "Asymmetric Regauging Overunity Generator", price: 897, category: "Build Plan", icon: "⚡", public: true },
  { name: "MorphoYield TRZ-Agri Array", price: 697, category: "Build Plan", icon: "🌾", public: true },
  
  // ── RESTRICTED TIER (Defense Contractor Licensing Only) ──
  { name: "Time-Reversal Zone Cold Fusion Reactor", price: 0, category: "Build Plan", icon: "⚛️", public: false, restricted: true },
  { name: "Aegis-SV Adaptive Scalar Counterphase Shield", price: 0, category: "Build Plan", icon: "🛡️", public: false, restricted: true },
  { name: "Atmospheric Scalar EM Signature Recognition System", price: 0, category: "Build Plan", icon: "🛰️", public: false, restricted: true },
  { name: "T-Polarized EM Wave Transducer", price: 0, category: "Build Plan", icon: "⏱️", public: false, restricted: true },
  { name: "Waddington Valley EM Tracer System", price: 0, category: "Build Plan", icon: "🗺️", public: false, restricted: true },
  { name: "Cloning Efficiency Enhancement System", price: 0, category: "Build Plan", icon: "🧬", public: false, restricted: true },
  { name: "Kaznacheyev Reversal Cell Imprinting Chamber", price: 0, category: "Build Plan", icon: "🔬", public: false, restricted: true },
  { name: "UV Biophoton Disease Reversal Spectrometer", price: 0, category: "Build Plan", icon: "🧬", public: false, restricted: true },
  { name: "Telomere Regeneration Device (TRD-1)", price: 0, category: "Build Plan", icon: "🧬", public: false, restricted: true },
  { name: "Portable Porthole Disease Treatment System", price: 0, category: "Build Plan", icon: "🏥", public: false, restricted: true },
  { name: "Psychoenergetics Cellular Control System", price: 0, category: "Build Plan", icon: "🧬", public: false, restricted: true },
];

const INDIVIDUAL_COURSES = [
  { name: "Scalar Electromagnetics Fundamentals", price: 297, category: "Course", icon: "📚" },
  { name: "Bearden Energy from the Vacuum Theory", price: 397, category: "Course", icon: "📖" },
  { name: "Building EM Device Prototypes", price: 397, category: "Course", icon: "🔬" },
  { name: "Patent Strategy for Energy Inventors", price: 397, category: "Course", icon: "⚖️" },
  { name: "Quantum Field Theory Essentials", price: 297, category: "Course", icon: "🌌" },
  { name: "Bioelectromagnetics & Health", price: 347, category: "Course", icon: "💊" },
  { name: "Prior Art Research & Analysis", price: 297, category: "Course", icon: "🔍" },
  { name: "Investor Pitch Fundamentals", price: 297, category: "Course", icon: "💼" },
];

const TIERS = [
  {
    id: "builder",
    name: "Builder",
    price: 39,
    color: "#10b981",
    badge: null,
    description: "Build essentials",
    features: [
      "25% off all à la carte courses & build plans",
      "Bill of Materials & supplier guides",
      "Step-by-step instructions",
      "Build Video generator",
      "EM Lab simulators & visualization",
      "Prior Art Archive (200+ entries)",
      "Cancel anytime",
    ],
    locked: [
      "AI Invention Forge",
      "AI Patent Claims Generator",
      "AI Patent Drafting Tool",
      "FTO Analysis & IP Valuation",
      "Investor CRM & Pitch Builder",
      "Virtual Data Room (VDR)",
      "IP Portfolio Health Dashboard",
      "Co-Inventor Matching Network",
      "SBIR Grant Pipeline",
      "Patent Intelligence Monitor",
    ],
  },
  {
    id: "researcher",
    name: "Researcher",
    price: 59,
    color: "#3b82f6",
    badge: "MOST POPULAR",
    description: "AI tools, IP analysis & prior art search",
    features: [
      "50% off all à la carte courses & build plans",
      "Bill of Materials & supplier guides",
      "Step-by-step instructions",
      "Build Video generator",
      "AI Invention Forge (unlimited dossiers)",
      "AI Patent Claims Generator",
      "AI Patent Drafting Tool (USPTO-compliant)",
      "Prior Art Archive with AI search (200+ entries)",
      "FTO Analysis & IP Valuation",
      "Patent Landscape Graph",
      "EM Lab simulators & visualization",
      "Access to courses",
      "Cancel anytime",
    ],
    locked: [
      "Downloadable PDFs & Bill of Materials (Pro only)",
      "Investor CRM & Pitch Builder",
      "Virtual Data Room (VDR)",
      "IP Portfolio Health Dashboard",
      "Co-Inventor Matching Network",
      "SBIR Grant Pipeline",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 89,
    color: "#a855f7",
    description: "Full IP commercialization suite + all platform tools",
    features: [
      "50% off all à la carte courses & build plans",
      "ALL 40+ AI tools unlocked",
      "Downloadable PDFs for all build plans",
      "Bill of Materials & complete supplier lists",
      "Investor CRM & Pitch Builder",
      "Virtual Data Room (VDR)",
      "IP Portfolio Health Dashboard",
      "Co-Inventor Matching Network",
      "SBIR Grant Pipeline",
      "Patent Intelligence Monitor",
      "Acquisition CRM & pipeline management",
      "White-Label SaaS rights",
      "Priority support",
      "Cancel anytime",
    ],
    locked: [],
  },
];

const ITEM_DETAILS = {
  "Anenergy Pump Demonstration Circuit": { 
    desc: "Tabletop demonstration of the anenergy pump — the Moray mechanism in a kit. Gradient-phi extraction showing the phi-field / energy distinction.",
    bom: [
      { item: "Shielded toroidal coil", qty: 1, spec: "Primary winding 1000T, secondary 500T", source: "Amazon / Newark Electronics" },
      { item: "DDS pulse controller", qty: 1, spec: "AD9910 or equivalent", source: "Digikey" },
      { item: "Signal generator", qty: 1, spec: "1MHz-50MHz", source: "Rigol / Keysight" },
      { item: "Measurement probes", qty: 2, spec: "HV differential probes", source: "Fluke / Tektronix" },
    ],
    materials: ["Copper wire (14 AWG)", "Ferrite core material", "PCB substrate", "Capacitor bank 100µF-1000µF"],
    sources: { "Wire & Components": "Digikey.com", "Coils & Cores": "Kesco.com", "Test Equipment": "Fluke.com" }
  },
  "Scalar Energy Bottle Interferometer": { 
    desc: "Two-transmitter zero-vector interference zone for tabletop energy capture demonstration. Shows scalar pulse timing mechanism.",
    bom: [
      { item: "Zero-vector transmitter coil", qty: 2, spec: "Push-pull topology to cancel transverse EM", source: "Custom wind or Kesco" },
      { item: "FPGA timing module", qty: 1, spec: "Nanosecond resolution", source: "Digikey / Mouser" },
      { item: "Dual detector panel", qty: 1, spec: "RF spectrum analyzer compatible", source: "Rigol" },
    ],
    materials: ["Magnet wire", "Coaxial cable (RG-58)", "SMA connectors", "Aluminum enclosure"],
    sources: { "FPGA Modules": "Digikey.com", "RF Hardware": "Mini-Circuits.com", "Enclosures": "Hammond-mfg.com" }
  },
  "Vacuum Potential Oscillator (VPO) Circuit Kit": { 
    desc: "Hands-on exploration of scalar phi-field principles. Resonant LC circuit tuned to shift vacuum-ground potential.",
    bom: [
      { item: "Custom wound toroids", qty: 2, spec: "Quartz resonator coupled", source: "Kesco / Custom" },
      { item: "Quartz resonator", qty: 1, spec: "32.768 kHz or tuned frequency", source: "Amazon / Digikey" },
      { item: "Measurement guide + software", qty: 1, spec: "PDF + oscilloscope macro", source: "Download included" },
    ],
    materials: ["Ferrite powder core", "Magnet wire AWG 22", "Capacitors 10pF-1000pF", "Resistor assortment"],
    sources: { "Resonators": "Murata.com", "Capacitors": "Wyle.com", "Wire": "Adafruit.com" }
  },
  "Biofield Frequency Exposure Chamber": { 
    desc: "Replicate Kaznacheyev-type UV photon transmission experiments. Quartz-windowed exposure chamber for biophysics research.",
    bom: [
      { item: "Quartz-windowed chamber", qty: 1, spec: "UV-transparent (not glass)", source: "Edmund Optics" },
      { item: "UV LED driver + frequency generator", qty: 1, spec: "Programmable DDS", source: "Digikey" },
      { item: "Dual-compartment system", qty: 1, spec: "Cell culture compatible", source: "VWR / Corning" },
    ],
    materials: ["UV-grade quartz panes", "Aluminum frame", "Silicone tubing", "O-ring seals"],
    sources: { "Optics": "EdmundOptics.com", "Culture Equipment": "VWR.com", "Tubing": "Cole-Parmer.com" }
  },
  "Open-System Magnetic Generator (Prototype Plans)": { 
    desc: "Engineering plans based on Kromrey/Gray/Searl design principles. Standard machining and winding techniques.",
    bom: [
      { item: "Rotating disk", qty: 1, spec: "Aluminum or composite, 12\" diameter", source: "McMaster / Local machine shop" },
      { item: "Permanent magnets", qty: 8, spec: "Grade N52 1\"x1\"x0.5\"", source: "KJ Magnetics" },
      { item: "Coil winding supplies", qty: 1, spec: "AWG 16-22 copper wire", source: "Adafruit / Amazon" },
      { item: "Bearing set + motor coupling", qty: 1, spec: "NEMA mount", source: "Bearing Industries / VXB" },
    ],
    materials: ["Shaft steel (1\" diameter)", "Brush contacts", "Commutator rings", "Insulation paper"],
    sources: { "Magnets": "KJMagnetics.com", "Bearings": "VXB.com", "Wire": "Adafruit.com", "Steel": "McMaster.com" }
  },
  "Quantum Potential EMI Detector": { 
    desc: "Detect scalar EM interference invisible to standard instruments. Tuned quartz-crystal array with statistical burst-pattern firmware.",
    bom: [
      { item: "Quartz-crystal array", qty: 4, spec: "Tuned resonators", source: "Digikey / Mouser" },
      { item: "Statistical analysis firmware", qty: 1, spec: "Python + DSP", source: "Download included" },
      { item: "Sensitive RF frontend", qty: 1, spec: "Low-noise amplifier", source: "Mini-Circuits" },
    ],
    materials: ["PCB substrate (FR-4)", "Coaxial connectors", "SMA adapters", "Shielded enclosure"],
    sources: { "Crystals": "Digikey.com", "RF Parts": "Mini-Circuits.com", "PCB": "PCBWay.com" }
  },
  "EM Trigger Window Therapy Device": { 
    desc: "Programmable frequency generator for precision EM therapy using biological trigger windows. Consumer and clinical versions.",
    bom: [
      { item: "DDS frequency generator", qty: 1, spec: "AD9910 or equivalent", source: "Digikey" },
      { item: "Wristband enclosure (consumer)", qty: 1, spec: "Aluminum + silicone", source: "Amazon" },
      { item: "Full-body chamber coils (clinical)", qty: 2, spec: "Helmholtz coil geometry", source: "Custom or Kesco" },
    ],
    materials: ["Magnet wire AWG 18-22", "PCB substrate", "LiPo battery", "Timing crystal 16MHz"],
    sources: { "ICs": "Digikey.com", "Enclosures": "Amazon.com", "Wire": "Adafruit.com" }
  },
  "Morphogenetic Field Coherence Monitor": { 
    desc: "Measure species-level quantum potential coherence in biological systems. Applications in agriculture optimization.",
    bom: [
      { item: "Wideband antenna array", qty: 1, spec: "Tuned 10Hz-1MHz", source: "Custom or Mini-Circuits" },
      { item: "SQUID-compatible interface", qty: 1, spec: "Magnetometry frontend", source: "Digikey" },
      { item: "Real-time analysis software", qty: 1, spec: "Python + LabVIEW", source: "Download included" },
    ],
    materials: ["Shielded Faraday enclosure", "Coaxial cable", "SMA connectors", "Precision resistors 1%"],
    sources: { "Hardware": "Mini-Circuits.com", "Enclosures": "Hampton-Roads.com", "Software": "Included" }
  },
  "Whittaker Wave Phase Conjugate Mirror System": { 
    desc: "Time-reverse EM signals for scalar communications and healing. Based on Gravitobiology Figs 10-11.",
    bom: [
      { item: "Nonlinear optical medium", qty: 1, spec: "BaTiO₃ crystal or ferrofluid cell", source: "Edmund Optics / Sigma-Aldrich" },
      { item: "Pump laser", qty: 1, spec: "532nm 1W DPSS", source: "Coherent / Laserland" },
      { item: "Signal detection array", qty: 1, spec: "Photodiode + amplifier", source: "Thorlabs" },
    ],
    materials: ["Optical mounts", "Dichroic mirrors", "Precision apertures", "Laser safety enclosure"],
    sources: { "Optics": "Thorlabs.com", "Crystals": "EdmundOptics.com", "Laser": "LaserLand.com" }
  },
  "Scalar EM Lab Starter Kit": { desc: "Foundation circuit kit for scalar electromagnetic experiments. Perfect for beginners learning EM field manipulation.", includes: ["EM measurement tools", "Coil assembly guides", "Field visualization software"] },
  "G-Com Scalar Communicator Parts": { desc: "Complete component set for building a scalar communication device. Advanced precision components included.", includes: ["Precision capacitors", "Signal generation circuits", "Transmission modules", "Receiver assembly"] },
  "EMF Protection & Shielding Kit": { desc: "Professional-grade shielding materials for EMF exposure reduction and lab safety.", includes: ["Mu-metal shielding", "Faraday cage materials", "Installation guides", "Testing equipment"] },
  "Prioré Device Component Bundle": { desc: "Specialized components for Prioré-type multi-channel electromagnetic device research.", includes: ["Custom solenoids", "Frequency generators", "Phase control circuits", "Assembly documentation"] },
  "MEG Replication Parts Kit": { desc: "Complete parts set for replicating the Motionless Electromagnetic Generator concept.", includes: ["Permanent magnets", "Coil winding supplies", "Control electronics", "Step-by-step guides"] },
  "TRD-1 Telomere Device Build Kit": { desc: "Bioelectromagnetic device components for cellular regeneration research.", includes: ["Biofrequency generators", "Telomere measurement tools", "Treatment delivery systems"] },
  "TRZ Reactor Starter Components": { desc: "Advanced reactor core components for scalar EM energy research and experimentation.", includes: ["Reactor core materials", "Containment assemblies", "Control systems", "Safety documentation"] },
  "Advanced EM Assembly Tool Kit": { desc: "Professional tools and precision instruments for advanced electromagnetic device assembly.", includes: ["Precision measuring tools", "Specialized soldering equipment", "Diagnostic instruments", "Tool case"] },
  
  "Scalar Electromagnetics Fundamentals": { desc: "Foundational course covering scalar EM theory, mathematics, and experimental principles.", curriculum: ["Introduction to scalar fields", "Maxwell's equations revisited", "Scalar potential theory", "Experimental validation methods", "Lab safety protocols"] },
  "Bearden Energy from the Vacuum Theory": { desc: "Deep dive into Tom Bearden's energy extraction from vacuum framework and implications.", curriculum: ["Overview of Bearden's work", "Vacuum energy concepts", "Curled-up dimensions", "Extraction mechanisms", "Patent landscape analysis"] },
  "Building EM Device Prototypes": { desc: "Hands-on course for designing and building functional electromagnetic device prototypes.", curriculum: ["Circuit design fundamentals", "Coil winding techniques", "Assembly best practices", "Troubleshooting & optimization", "Testing methodologies"] },
  "Patent Strategy for Energy Inventors": { desc: "Strategic IP planning for novel energy technologies and scalar EM inventions.", curriculum: ["Patent landscape mapping", "Claim drafting strategies", "Prior art research", "Freedom-to-operate analysis", "Commercialization planning"] },
  "Quantum Field Theory Essentials": { desc: "Quantum mechanics fundamentals relevant to scalar EM and vacuum energy research.", curriculum: ["QFT basics for inventors", "Vacuum fluctuations", "Quantum tunneling", "Field quantization", "Advanced mathematics"] },
  "Bioelectromagnetics & Health": { desc: "Explore bioelectromagnetic effects on living systems and research applications.", curriculum: ["Cellular bioelectricity", "EMF health effects", "Therapeutic frequencies", "Research methodologies", "Safety considerations"] },
  "Prior Art Research & Analysis": { desc: "Master prior art research techniques to identify patentability gaps and innovation opportunities.", curriculum: ["Patent database navigation", "Citation analysis", "Novelty assessment", "Claims analysis", "Competitive intelligence"] },
  "Investor Pitch Fundamentals": { desc: "Learn to pitch novel energy inventions to investors, VCs, and strategic partners.", curriculum: ["Pitch deck fundamentals", "Storytelling techniques", "Financial projections", "Technical communication", "Q&A strategies"] },
};

function ItemCard({ item, userTier }) {
  const [expanded, setExpanded] = useState(false);
  const details = ITEM_DETAILS[item.name];
  
  // Calculate discounted price based on tier
  const basePrice = item.price + 100;
  let displayPrice = basePrice;
  if (userTier === "builder") {
    displayPrice = Math.round(basePrice * 0.75);
  } else if (["researcher", "pro"].includes(userTier)) {
    displayPrice = Math.round(basePrice * 0.50);
  }

  const handleCheckout = async () => {
    const baseUrl = window.location.origin;
    const checkoutPrice = userTier ? displayPrice : basePrice;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: item.name,
      priceInCents: checkoutPrice * 100,
      description: item.category,
      category: "one_time",
      mode: "payment",
      successUrl: `${baseUrl}/checkout?success=true&product=${item.name}`,
      cancelUrl: `${baseUrl}/pricing`,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  const deviceImage = deviceImages[item.name];
  const colors = ["#3b82f6","#22c55e","#a855f7","#f59e0b","#ef4444","#06b6d4","#ec4899","#84cc16","#f97316","#8b5cf6","#14b8a6","#fb923c"];
  const color = item.color || colors[Math.random() * colors.length | 0];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col"
      style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
      {/* Image preview for build plans */}
      {item.category === "Build Plan" && deviceImage && (
        <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-gray-700 overflow-hidden border-b border-gray-700">
          <img src={deviceImage} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-4 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl flex-shrink-0">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded font-bold uppercase" style={{ backgroundColor: color + "22", color }}>{item.price}</span>
            </div>
            <h3 className="text-white font-bold text-sm leading-snug">{item.name}</h3>
            {item.tagline && <p className="text-gray-500 text-xs mt-1 italic">{item.tagline}</p>}
          </div>
        </div>

        {details?.desc && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">{details.desc}</p>
        )}

        {(details?.bom || details?.includes || details?.curriculum) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-3 hover:text-cyan-300 transition-colors"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            View Details
          </button>
        )}

        {expanded && details?.bom && (
          <div className="mb-3 bg-gray-800/50 rounded-lg p-3 text-xs space-y-2">
            <p className="text-gray-400 font-bold uppercase">BOM Preview:</p>
            <div className="space-y-1">
              {details.bom.slice(0, 2).map((row, i) => (
                <div key={i} className="text-gray-300">
                  <p className="font-semibold">{row.item}</p>
                  <p className="text-gray-500 text-xs">{row.spec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {expanded && (details?.includes || details?.curriculum) && (
          <div className="mb-3 bg-gray-800/50 rounded-lg p-3 text-xs">
            {details?.includes && (
              <ul className="space-y-1">
                {details.includes.slice(0, 3).map((inc, i) => (
                  <li key={i} className="text-gray-300 flex items-start gap-2">
                    <span className="text-cyan-400 flex-shrink-0">✓</span> {inc}
                  </li>
                ))}
              </ul>
            )}
            {details?.curriculum && (
              <ul className="space-y-1">
                {details.curriculum.slice(0, 3).map((mod, i) => (
                  <li key={i} className="text-gray-300 flex items-start gap-2">
                    <span className="text-cyan-400 flex-shrink-0">✓</span> {mod}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex flex-col gap-2">
        {item.restricted ? (
          <a href={`mailto:licensing@zenithapex.com?subject=Defense%20Contractor%20Licensing%20Inquiry:%20${encodeURIComponent(item.name)}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-red-900/60 hover:bg-red-800/60 border border-red-700 text-red-300 transition-colors w-full">
            🔐 Licensing Inquiries Only
          </a>
        ) : (
          <>
            <div className="p-2 rounded-lg bg-gray-800/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">No membership:</span>
                <span className="text-white text-sm font-bold">${basePrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Builder (25%):</span>
                <span className="text-cyan-400 text-sm font-bold">${Math.round(basePrice * 0.75)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Researcher (50%):</span>
                <span className="text-green-400 text-sm font-bold">${Math.round(basePrice * 0.50)}</span>
              </div>
            </div>

            <button onClick={handleCheckout}
              className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-cyan-700 hover:bg-cyan-600 text-white transition-all">
              💳 Buy Now {userTier ? `$${displayPrice}` : `$${basePrice}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PlanCard({ tier, billingCycle }) {
  const annualPrice = Math.round(tier.price * 10); // 2 months free (10 months of annual billing)
  const displayPrice = billingCycle === "annual" ? annualPrice : tier.price;
  const billingPeriod = billingCycle === "annual" ? "/year" : "/month";
  const annualSavings = (tier.price * 2).toFixed(0);

  const handleCheckout = async () => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: tier.name,
      priceInCents: displayPrice * 100,
      description: tier.description,
      category: "membership",
      mode: "subscription",
      interval: "month",
      successUrl: `${baseUrl}/checkout?success=true&product=${tier.id}`,
      cancelUrl: `${baseUrl}/pricing`,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  const isPro = tier.id === "pro";

  return (
    <div className={`relative bg-gray-900 rounded-2xl overflow-hidden flex flex-col ${isPro ? "border-2 border-purple-500 shadow-2xl shadow-purple-900/30" : "border border-gray-700"}`}>
      {tier.badge && (
        <div className="text-center py-2.5 text-xs font-black tracking-widest" style={{ backgroundColor: tier.color + "25", color: tier.color }}>
          {tier.badge}
        </div>
      )}
      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-white font-black text-xl mb-1">{tier.name}</h3>
        <p className="text-gray-400 text-sm mb-5">{tier.description}</p>
        <div className="flex items-end gap-1 mb-1">
          <span className="text-5xl font-black" style={{ color: tier.color }}>${displayPrice}</span>
          <span className="text-gray-500 text-base mb-1.5">{billingPeriod}</span>
        </div>
        {billingCycle === "annual" && (
          <p className="text-green-400 text-xs font-bold mb-2">Save ${annualSavings}/year</p>
        )}
        <p className="text-gray-600 text-xs mb-6">Cancel anytime · Instant access</p>

        <div className="space-y-2 mb-6 flex-1">
          {tier.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
              <span className="text-gray-300 text-sm">{f}</span>
            </div>
          ))}
          {tier.locked?.map((f, i) => (
            <div key={i} className="flex items-start gap-2 opacity-35">
              <Lock size={12} className="flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-gray-500 text-sm line-through">{f}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-4 rounded-xl font-black text-base transition-all text-white"
          style={{ backgroundColor: tier.color, boxShadow: `0 4px 20px ${tier.color}40` }}
        >
          Get {tier.name} — ${displayPrice}{billingCycle === "annual" ? "/year" : "/mo"}
        </button>
        <p className="text-center text-gray-600 text-xs mt-3">🔒 Secured by Stripe</p>
      </div>
    </div>
  );
}

export default function Pricing() {
  const { tier } = useTier();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [showFilter, setShowFilter] = useState("all"); // "all", "available", "locked"

  // Show all items regardless of tier
  let visibleItems = [...INDIVIDUAL_BUILDS, ...INDIVIDUAL_COURSES];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <h1 className="text-white font-black text-lg">ZARP Pricing</h1>
      </div>

      {/* Hero */}
      <div className="text-center px-5 py-12 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
          Create with Passion<br />Build for Impact<br />
          <span className="text-cyan-400">Forge Your Future</span><br />
          Start Building Your IP Portfolio Today
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Three tiers. One platform. Pick the plan that fits your stage.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              billingCycle === "monthly"
                ? "bg-cyan-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              billingCycle === "annual"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Annual
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">Save 2 months</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TIERS.map(tier => <PlanCard key={tier.id} tier={tier} billingCycle={billingCycle} />)}
        </div>
      </div>

      <div className="px-5 pb-12 max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-950/60 border border-red-800 rounded-xl p-4 mb-6 text-red-300 text-sm text-center">{error}</div>
        )}

        {/* Newsletter Section */}
        <div className="mb-16 max-w-2xl mx-auto bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-900/30 rounded-2xl p-8">
          <div className="text-center mb-6">
            <Mail size={24} className="text-cyan-400 mx-auto mb-3" />
            <h3 className="text-white font-black text-2xl mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm">Get insights on scalar EM research, new build plans, and exclusive offers straight to your inbox.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              onClick={async () => {
                if (!newsletterEmail) return;
                try {
                  await base44.entities.NewsletterSubscriber.create({
                    email: newsletterEmail,
                    source: "pricing_page",
                    status: "active"
                  });
                  setNewsletterStatus("success");
                  setNewsletterEmail("");
                  setTimeout(() => setNewsletterStatus(null), 3000);
                } catch (err) {
                  setNewsletterStatus("error");
                  setTimeout(() => setNewsletterStatus(null), 3000);
                }
              }}
              className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all whitespace-nowrap"
            >
              {newsletterStatus === "success" ? "✓ Subscribed!" : "Subscribe"}
            </button>
          </div>
          {newsletterStatus === "success" && (
            <p className="text-green-400 text-xs mt-3 text-center">Thanks for subscribing! Check your email for confirmation.</p>
          )}
        </div>

        {/* ── À LA CARTE SECTION ── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart size={24} className="text-yellow-400" />
            <div>
              <h3 className="text-white font-black text-2xl">Build Plans & Courses</h3>
              <p className="text-gray-500 text-sm">Each build plan includes: BOM, parts list, supplier recommendations, PDF, step-by-step instructions, and build video</p>
            </div>
          </div>

          {tier && (
            <div className="mb-4 p-3 rounded-lg bg-gray-900/60 border border-gray-800 text-xs text-gray-400">
              <strong>Your tier:</strong> {tier.charAt(0).toUpperCase() + tier.slice(1)} membership
              {[25, 50].includes(Math.round((tier === "builder" ? 0.25 : tier === "researcher" ? 0.50 : 0) * 100)) && (
                <span className="ml-2 text-green-400 font-bold">({tier === "builder" ? "25" : "50"}% discount applied)</span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {visibleItems.map((item, i) => (
              <ItemCard key={i} item={item} userTier={tier} />
            ))}
          </div>
        </div>




      </div>
    </div>
  );
}

function ShoppingCart({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}