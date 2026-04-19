import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Zap, Shield, BookOpen, Download, Users, Star, Lock, ChevronRight, Sparkles, FlaskConical, Briefcase, Mail, Activity, CheckCircle2, Flame, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";

const INDIVIDUAL_BUILDS = [
  // ── From businessItems Invention category (filtered and priced)
  { name: "Anenergy Pump Demonstration Circuit", price: 297, category: "Build Plan", icon: "🔋" },
  { name: "Scalar Energy Bottle Interferometer", price: 649, category: "Build Plan", icon: "🎯" },
  { name: "Vacuum Potential Oscillator (VPO) Circuit Kit", price: 189, category: "Build Plan", icon: "🔧" },
  { name: "Biofield Frequency Exposure Chamber", price: 397, category: "Build Plan", icon: "🧪" },
  { name: "Open-System Magnetic Generator (Prototype Plans)", price: 179, category: "Build Plan", icon: "⚙️" },
  { name: "Quantum Potential EMI Detector", price: 497, category: "Build Plan", icon: "📡" },
  { name: "EM Trigger Window Therapy Device", price: 599, category: "Build Plan", icon: "💊" },
  { name: "Morphogenetic Field Coherence Monitor", price: 799, category: "Build Plan", icon: "🌿" },
  { name: "Whittaker Wave Phase Conjugate Mirror System", price: 849, category: "Build Plan", icon: "🔭" },
  { name: "Prioré-Type Multichannel EM Therapy System", price: 697, category: "Build Plan", icon: "🏥" },
  { name: "ELF Carrier Lock Detection System", price: 497, category: "Build Plan", icon: "📡" },
  { name: "Phi-River Gradient Sensor", price: 349, category: "Build Plan", icon: "🌊" },
  { name: "MEG Replication Kit", price: 847, category: "Build Plan", icon: "🔮" },
  { name: "Asymmetric Regauging Overunity Generator", price: 897, category: "Build Plan", icon: "⚡" },
  { name: "Telomere Regeneration Device (TRD-1)", price: 2397, category: "Build Plan", icon: "🧬" },
  { name: "Portable Porthole Disease Treatment System", price: 1697, category: "Build Plan", icon: "🏥" },
  { name: "Time-Reversal Zone Cold Fusion Reactor", price: 1297, category: "Build Plan", icon: "⚛️" },
  { name: "Atmospheric Scalar EM Signature Recognition System", price: 897, category: "Build Plan", icon: "🛰️" },
  { name: "Woodpecker Grid Standing Wave Detector", price: 297, category: "Build Plan", icon: "📻" },
  { name: "T-Polarized EM Wave Transducer", price: 1197, category: "Build Plan", icon: "⏱️" },
  { name: "Psychoenergetics Cellular Control System", price: 697, category: "Build Plan", icon: "🧬" },
  { name: "Bedini Environmental EM Signal Conditioner", price: 897, category: "Build Plan", icon: "🎛️" },
  { name: "Waddington Valley EM Tracer System", price: 1697, category: "Build Plan", icon: "🗺️" },
  { name: "Cloning Efficiency Enhancement System", price: 2397, category: "Build Plan", icon: "🧬" },
  { name: "Kaznacheyev Reversal Cell Imprinting Chamber", price: 1697, category: "Build Plan", icon: "🔬" },
  { name: "UV Biophoton Disease Reversal Spectrometer", price: 2397, category: "Build Plan", icon: "🧬" },
  { name: "MorphoYield TRZ-Agri Array", price: 1697, category: "Build Plan", icon: "🌾" },
  { name: "Aegis-SV Adaptive Scalar Counterphase Shield", price: 1097, category: "Build Plan", icon: "🛡️" },
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

const SUBSCRIPTION_TIERS = [
  {
    id: "researcher",
    name: "Researcher Millionaires Club",
    price: 97,
    color: "#6366f1",
    badge: "MOST POPULAR",
    description: "50% off all invention plans & courses",
    features: [
      "AI Invention Forge (unlimited)",
      "AI Patent Claims Generator",
      "EM Lab simulators & visualization",
      "Prior Art Archive with AI search",
      "Build Video generator",
      "IP Valuation & FTO Analysis",
      "50% off all invention plans & courses",
      "Cancel anytime",
    ],
    locked: ["Patent Drafting Tool", "Investor CRM", "VDR Portal"],
  },
  {
    id: "forge-dossier",
    name: "Invention Forge Dossier",
    price: 99,
    color: "#f59e0b",
    description: "One complete AI invention dossier with all materials",
    isOneTime: true,
    features: [
      "1 AI Invention Forge Dossier (complete package)",
      "AI Patent Draft (for your invention)",
      "Pitch Deck Builder (investor-ready)",
      "IP Valuation Report",
      "Investor Potential List (pre-screened matches)",
      "AI Patent Claims Generator",
      "EM Lab simulators & visualization",
      "Prior Art Archive with AI search",
      "Support",
    ],
    locked: [],
  },
  {
    id: "all-courses",
    name: "All Access Courses",
    price: 497,
    color: "#ec4899",
    description: "Unlimited access to all 20+ courses",
    isOneTime: true,
    features: [
      "All 20+ courses in our library",
      "Scalar Electromagnetics Fundamentals",
      "Bearden Energy from the Vacuum Theory",
      "Building EM Device Prototypes",
      "Patent Strategy for Energy Inventors",
      "Quantum Field Theory Essentials",
      "Bioelectromagnetics & Health",
      "Prior Art Research & Analysis",
      "Investor Pitch Fundamentals",
      "Lifetime access to all course materials",
      "Support",
    ],
    locked: [],
  },
  {
    id: "pro",
    name: "Pro Billionaires Club",
    price: 247,
    color: "#22c55e",
    description: "75% off all invention plans & courses + IP suite",
    features: [
      "AI Invention Forge (unlimited)",
      "AI Patent Claims Generator",
      "AI Patent Drafting Tool (unlimited)",
      "Investor CRM & Pitch Deck Builder",
      "Virtual Data Room (VDR)",
      "Acquisition CRM & pipeline management",
      "IP Portfolio Health Dashboard",
      "Co-Inventor Matching Network",
      "75% off all invention plans & courses",
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

function ItemCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const details = ITEM_DETAILS[item.name];

  useState(() => {
    base44.functions.invoke("getUserPurchases", {})
      .then(res => {
        const purchases = res?.data?.purchases || [];
        setHasPurchased(purchases.some(p => p.title === item.name));
      })
      .catch(() => setHasPurchased(false))
      .finally(() => setCheckingPurchase(false));
  }, [item.name]);

  const handleCheckout = async () => {
    const baseUrl = window.location.origin;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: item.name,
      priceInCents: item.price * 100,
      description: item.category,
      category: "one_time",
      mode: "payment",
      successUrl: `${baseUrl}/checkout?success=true&product=${item.name}`,
      cancelUrl: `${baseUrl}/pricing`,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all flex flex-col">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{item.icon}</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400">{item.category}</span>
        </div>
        <h3 className="text-white font-bold text-sm leading-snug mb-2">{item.name}</h3>
        {details && <p className="text-gray-400 text-xs leading-relaxed mb-4">{details.desc}</p>}
        
        {(details?.bom || details?.includes || details?.curriculum) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-3 hover:text-cyan-300 transition-colors"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {details?.bom ? (hasPurchased ? "View BOM & Materials" : "What's Included") : "View Details"}
          </button>
        )}

        {expanded && details?.bom && !hasPurchased && (
          <div className="mb-4 space-y-3 bg-blue-950/40 border border-blue-800/50 rounded-lg p-3">
            <div>
              <p className="text-blue-300 text-xs font-bold mb-3 flex items-center gap-1.5">
                <Lock size={10} /> Purchase to unlock materials & suppliers
              </p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                When you purchase this plan, you'll get instant access to the complete bill of materials, parts list, supplier recommendations, and downloadable PDF specifications.
              </p>
            </div>
          </div>
        )}

        {expanded && details?.bom && hasPurchased && (
          <div className="mb-4 space-y-3 bg-gray-800/40 rounded-lg p-3">
            <div>
              <p className="text-yellow-400 text-xs font-bold mb-2">🛠️ Bill of Materials:</p>
              <div className="space-y-1.5">
                {details.bom.map((row, i) => (
                  <div key={i} className="text-xs text-gray-300 border-l-2 border-cyan-600/30 pl-2">
                    <p className="font-semibold">{row.item} (Qty: {row.qty})</p>
                    <p className="text-gray-500">{row.spec}</p>
                    <p className="text-cyan-400 text-xs flex items-center gap-1 mt-0.5">
                      <ExternalLink size={9} /> {row.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {details?.materials && (
              <div>
                <p className="text-green-400 text-xs font-bold mb-2">📦 Materials & Sources:</p>
                <div className="space-y-1">
                  {details.materials.map((mat, i) => (
                    <p key={i} className="text-xs text-gray-300">• {mat}</p>
                  ))}
                </div>
              </div>
            )}
            {details?.sources && (
              <div>
                <p className="text-blue-400 text-xs font-bold mb-2">🔗 Recommended Suppliers:</p>
                <div className="space-y-1">
                  {Object.entries(details.sources).map(([cat, url], i) => (
                    <p key={i} className="text-xs text-cyan-300">
                      {cat}: <span className="text-gray-400">{url}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
            <button className="w-full mt-2 py-2 px-3 rounded-lg bg-cyan-900/40 border border-cyan-700 text-cyan-300 text-xs font-bold hover:bg-cyan-800/50 transition-all flex items-center justify-center gap-2">
              <Download size={11} /> Download Plans PDF
            </button>
          </div>
        )}

        {expanded && (details?.includes || details?.curriculum) && (
          <div className="mb-4 bg-gray-800/40 rounded-lg p-3">
            {details?.includes && (
              <div className="mb-3">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">Includes:</p>
                <ul className="space-y-1">
                  {details.includes.map((inc, i) => (
                    <li key={i} className="text-gray-300 text-xs flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0 mt-0.5">✓</span> {inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {details?.curriculum && (
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">Course Modules:</p>
                <ul className="space-y-1">
                  {details.curriculum.map((mod, i) => (
                    <li key={i} className="text-gray-300 text-xs flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0 mt-0.5">✓</span> {mod}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-gray-800 bg-gray-800/20 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Regular price:</span>
          <span className="font-black text-cyan-400">${item.price}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Researcher (50% off):</span>
          <span className="font-black text-green-400">${(item.price * 0.5).toFixed(0)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Pro (75% off):</span>
          <span className="font-black text-emerald-400">${(item.price * 0.25).toFixed(0)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full mt-2 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold transition-all"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

function PlanCard({ plan }) {
  const isPopular = plan.badge === "MOST POPULAR";

  const handleCheckout = async () => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: plan.name,
      priceInCents: plan.price * 100,
      description: plan.description,
      category: plan.isOneTime ? "one_time" : "membership",
      mode: plan.isOneTime ? "payment" : "subscription",
      interval: plan.isOneTime ? undefined : "month",
      successUrl: `${baseUrl}/checkout?success=true&product=${plan.id}`,
      cancelUrl: `${baseUrl}/pricing`,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div
      className={`relative bg-gray-900 rounded-2xl border overflow-hidden flex flex-col ${
        isPopular ? "border-indigo-600 shadow-xl shadow-indigo-900/20 scale-105" : "border-gray-800"
      }`}
    >
      {plan.badge && (
        <div
          className="text-center py-2 text-xs font-black tracking-widest"
          style={{ backgroundColor: plan.color + "25", color: plan.color }}
        >
          {plan.badge}
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white font-black text-xl mb-1">{plan.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
        <div className="flex items-end gap-1 mb-1">
          <span className="text-4xl font-black" style={{ color: plan.color }}>
            ${plan.price}
          </span>
          <span className="text-gray-500 text-sm mb-1">{plan.isOneTime ? "one-time" : "/month"}</span>
        </div>
        <p className="text-gray-600 text-xs mb-5">{plan.isOneTime ? "One-time purchase" : "Cancel anytime • No long-term commitment"}</p>

        <div className="space-y-2 mb-6 flex-1">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
              <span className="text-gray-300 text-xs leading-relaxed">{f}</span>
            </div>
          ))}
          {plan.locked.map((f, i) => (
            <div key={i} className="flex items-start gap-2 opacity-40">
              <Lock size={12} className="flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-gray-600 text-xs line-through">{f}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-3 rounded-xl font-black text-sm transition-all text-white"
          style={{
            backgroundColor: plan.color,
            boxShadow: `0 4px 20px ${plan.color}40`,
          }}
        >
          {plan.isOneTime 
            ? `Get ${plan.name} — $${plan.price}` 
            : plan.name === "Researcher" 
              ? `Go with Researcher — $${plan.price}/mo` 
              : `Upgrade to ${plan.name} — $${plan.price}/mo`}
        </button>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

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
          Ready to Become a Millionaire or Billionaire?<br />
          <span className="text-cyan-400">Build Your IP Empire</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
          Purchase individual build plans and courses on-demand, or save big with a monthly subscription for unlimited access to everything.
        </p>
      </div>

      <div className="px-5 pb-12 max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-950/60 border border-red-800 rounded-xl p-4 mb-6 text-red-300 text-sm text-center">{error}</div>
        )}

        {/* ── À LA CARTE SECTION ── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart size={24} className="text-yellow-400" />
            <div>
              <h3 className="text-white font-black text-2xl">Build Plans & Courses</h3>
              <p className="text-gray-500 text-sm">Each build plan includes: BOM, parts list, supplier recommendations, PDF, step-by-step instructions, and build video</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {[...INDIVIDUAL_BUILDS, ...INDIVIDUAL_COURSES].map((item, i) => (
              <ItemCard key={i} item={item} />
            ))}
          </div>
        </div>

        {/* ── SUBSCRIPTION TIERS ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <Flame size={24} className="text-red-400" />
            <div>
              <h3 className="text-white font-black text-2xl">Monthly Subscriptions</h3>
              <p className="text-gray-500 text-sm">Unlimited access for one low monthly price</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {SUBSCRIPTION_TIERS.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
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