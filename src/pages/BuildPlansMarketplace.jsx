import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Play, ChevronDown, ChevronUp, Check, Loader2, FileText, Video, Package, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const BUILD_PLANS = [
  {
    id: "meg",
    title: "Motionless Electromagnetic Generator (MEG)",
    category: "Free Energy",
    icon: "⚡",
    basePriceCents: 28700,
    videoPdfPriceCents: 5000,
    tagline: "Replicate Bearden's COP>1 flux-coupled generator — the most documented over-unity device in patent history.",
    description: "The MEG (US Patent 6,362,718) uses a permanent magnet as a source dipole and two wound coils to extract energy from the local magnetic vector potential. This build plan provides complete replication instructions based on the original 2002 patent filing by Bearden, Hayes, Moore, Kenny, and Fletcher.",
    specs: [
      { label: "Core", value: "Nanocrystalline or Metglas laminate" },
      { label: "Output Power", value: "~2.5W demonstrated" },
      { label: "COP Reported", value: ">1.0 (see patent)" },
      { label: "Frequency", value: "5–50 kHz switching" },
      { label: "Patent", value: "US 6,362,718 B1 (2002)" },
    ],
    what_you_get: [
      "Full Bill of Materials with part numbers & verified suppliers",
      "Complete electrical schematics (multi-page PDF)",
      "Coil winding specs — turns, gauge, geometry",
      "Core preparation & lamination instructions",
      "Assembly step-by-step (viewable in-app)",
      "COP measurement & validation framework",
      "Troubleshooting guide",
    ],
    video_pdf_bonus: [
      "45-min step-by-step video assembly walkthrough",
      "15-min COP measurement & calibration video",
      "Printable high-res PDF manual (80 pages)",
      "Component sourcing optimization notes",
    ],
  },
  {
    id: "scalar-transmitter",
    title: "G-Com Scalar Communicator",
    category: "Communications",
    icon: "📡",
    basePriceCents: 24300,
    videoPdfPriceCents: 5000,
    tagline: "Phase-conjugate scalar wave transmitter — non-Hertzian communications below standard EM detection thresholds.",
    description: "Based on Bearden's Gravitobiology (1991) and the Soviet woodpecker transmitter studies, this device creates scalar potential waves using anti-phase coil pairs wound on a ferrite core. The phase-locked architecture produces a longitudinal EM wave rather than transverse — enabling unique propagation characteristics.",
    specs: [
      { label: "Frequency Range", value: "10–40 kHz" },
      { label: "Coil Architecture", value: "Bifilar wound anti-phase pairs" },
      { label: "Core Material", value: "Ferrite rod or toroid" },
      { label: "Wave Type", value: "Longitudinal EM (scalar)" },
      { label: "Source", value: "Bearden, Gravitobiology (1991)" },
    ],
    what_you_get: [
      "Complete tuning specifications & frequency tables",
      "Bifilar coil winding patterns with layer diagrams",
      "Power supply schematics (two topologies included)",
      "Phase-lock circuit schematic",
      "Assembly instructions with calibration procedures",
      "Signal verification & testing protocols",
    ],
    video_pdf_bonus: [
      "60-min video: coil winding & core assembly",
      "30-min video: frequency calibration & phase-lock",
      "Complete PDF build manual (150 pages)",
      "Phase verification test script",
    ],
  },
  {
    id: "priore-device",
    title: "Prioré EM Resonance Chamber",
    category: "Bio-Signal",
    icon: "🧬",
    basePriceCents: 34900,
    videoPdfPriceCents: 5000,
    tagline: "Replicate Antoine Prioré's French patent EM chamber — the most significant biofield experiment of the 20th century.",
    description: "Antoine Prioré's device (French Patents 1,342,772 and 2,026,466) produced remarkable results in French government-funded trials (1960s–1970s). It combined rotating magnetic fields, microwave frequencies, and plasma tubes to produce a complex EM waveform. This build plan reconstructs the key subsystems based on Prioré's original patent specifications and the Bateman/Courrier academic reports.",
    specs: [
      { label: "Plasma Tube", value: "Argon/neon mixture, 2.4 GHz excitation" },
      { label: "Rotating Field", value: "17 Hz base, EM modulated" },
      { label: "Frequency Layers", value: "17 Hz / 9.4 GHz / optical" },
      { label: "Patents", value: "FR 1,342,772 & FR 2,026,466" },
      { label: "Source", value: "Bateman/Courrier Reports, 1965–1977" },
    ],
    what_you_get: [
      "Frequency mapping (Shor & Kaznacheyev biofield data)",
      "Chamber construction specifications & shielding layout",
      "Signal generation & modulation circuits",
      "Plasma tube sourcing & driving circuits",
      "Safety & EMF containment protocols",
      "Experimental procedure documentation (ISO-formatted)",
    ],
    video_pdf_bonus: [
      "90-min video: chamber assembly & plasma setup",
      "45-min video: frequency calibration for bio-resonance",
      "Complete experimental protocol PDF (120 pages)",
      "Data logging templates for research documentation",
    ],
  },
  {
    id: "scalar-potential",
    title: "TRZ Scalar Potential Extractor",
    category: "Energy",
    icon: "🌀",
    basePriceCents: 38900,
    videoPdfPriceCents: 5000,
    tagline: "Zero-point energy tap using scalar potential wells, time-varying EM gradients, and non-Hertzian wave coupling.",
    description: "Derived from Bearden's Sweet VTA analysis and the Aharonov-Bohm effect, this device uses paired counter-wound coils driven with time-varying asymmetric potentials to create a local gradient in the magnetic vector potential. Regauging the system asymmetrically allows net energy extraction from the vacuum potential as described in Bearden's CTMU energy analysis (2000).",
    specs: [
      { label: "Coil Type", value: "Counter-wound Möbius pairs" },
      { label: "Operating Freq", value: "DC to 1 MHz swept" },
      { label: "Core", value: "Permalloy or air core" },
      { label: "Key Effect", value: "Aharonov-Bohm / regauging" },
      { label: "Source", value: "Bearden CTMU (2000), Sweet VTA analysis" },
    ],
    what_you_get: [
      "Scalar field mathematical modeling (derivations included)",
      "Extraction coil designs — three geometries provided",
      "High-voltage power conditioning circuits",
      "Measurement & verification protocols",
      "Safety interlocks & failsafe systems",
      "Regauging calculation worksheets",
    ],
    video_pdf_bonus: [
      "120-min theory deep-dive with live demonstration",
      "90-min video: assembly & troubleshooting",
      "Advanced PDF manual with full math derivations (200 pages)",
    ],
  },
  {
    id: "trd-telomere",
    title: "TRD-1 Telomere Resonance Device",
    category: "Bio-Tech",
    icon: "🧬",
    basePriceCents: 19400,
    videoPdfPriceCents: 5000,
    tagline: "Kaznacheyev torsion-field generator for cellular communication research and bioelectric field mapping.",
    description: "Based on Kaznacheyev's cytopathic effect research and Bearden's Gravitobiology (1991), this device generates structured EM fields in the ELF (3–30 Hz) and VLF (3–30 kHz) ranges corresponding to cellular signaling frequencies identified in Soviet biophysics research. The design includes a Helmholtz coil array for uniform field generation and optional torsion field modification.",
    specs: [
      { label: "Field Type", value: "ELF/VLF structured EM" },
      { label: "Frequency Range", value: "3 Hz – 30 kHz" },
      { label: "Coil Array", value: "Helmholtz pair (3-axis option)" },
      { label: "Modulation", value: "Amplitude & phase modulated" },
      { label: "Source", value: "Kaznacheyev (1981), Bearden Gravitobiology" },
    ],
    what_you_get: [
      "Torsion field coil specifications & winding data",
      "Signal modulation schematics for cellular frequencies",
      "Helmholtz coil geometry & spacing calculations",
      "Shielding & containment design (Faraday + mu-metal)",
      "Measurement equipment calibration guide",
      "Research documentation templates (IRB-style)",
    ],
    video_pdf_bonus: [
      "75-min video: full build walkthrough",
      "45-min video: measurement setup & field verification",
      "PDF research protocols & data logging sheets (90 pages)",
      "Frequency table: Kaznacheyev biofield map",
    ],
  },
  {
    id: "emf-starter",
    title: "Scalar EM Lab Starter Kit",
    category: "Lab Tools",
    icon: "🔬",
    basePriceCents: 16700,
    videoPdfPriceCents: 5000,
    tagline: "Entry-level scalar EM test bench — build your first working scalar transmitter/receiver pair in a weekend.",
    description: "The ideal starting point for researchers new to scalar electromagnetics. This kit walks you through building a functional scalar transmitter and receiver pair using widely available components (under $50 in parts). Based on Meyl's scalar wave kit design and Bearden's introductory lectures, it demonstrates real non-Hertzian effects you can measure with a standard oscilloscope.",
    specs: [
      { label: "Parts Cost", value: "~$40–60 (components only)" },
      { label: "Skill Level", value: "Beginner — soldering required" },
      { label: "Time to Build", value: "4–8 hours" },
      { label: "Measurable Output", value: "Yes — scope verification" },
      { label: "Source", value: "Meyl Scalar Wave Kit, Bearden intro lectures" },
    ],
    what_you_get: [
      "Complete beginner-friendly BOM with Amazon/Mouser links",
      "Soldering guide for all major junctions",
      "Transmitter & receiver schematic",
      "Test & verification procedure (oscilloscope)",
      "Troubleshooting for common beginner mistakes",
    ],
    video_pdf_bonus: [
      "30-min video: complete soldering walkthrough",
      "20-min video: test & verification on scope",
      "PDF quick-start guide (40 pages)",
    ],
  },
];

export default function BuildPlansMarketplace() {
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("order_success") === "true") {
      setOrderSuccess(decodeURIComponent(params.get("plan") || "your plan"));
    }
  }, []);

  const handleBuy = async (plan, includeVideo) => {
    if (window.top !== window.self) {
      alert("Checkout only works from the published app — not inside the editor preview.");
      return;
    }
    const key = `${plan.id}-${includeVideo ? "video" : "base"}`;
    setLoading(prev => ({ ...prev, [key]: true }));

    const priceInCents = plan.basePriceCents + (includeVideo ? plan.videoPdfPriceCents : 0);
    const title = includeVideo ? `${plan.title} + Video & PDF` : plan.title;

    try {
      const res = await base44.functions.invoke("createBuildPlanCheckout", {
        planId: plan.id,
        planTitle: title,
        priceInCents,
        includeVideo,
        description: plan.description,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        alert("Could not start checkout. Please try again.");
      }
    } catch (e) {
      alert("Checkout error: " + e.message);
    }
    setLoading(prev => ({ ...prev, [key]: false }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black">Build Plans — À La Carte</h1>
            <p className="text-gray-400 text-sm mt-0.5">Step-by-step invention build plans. Viewable in-app. Optional: Video + PDF for +$50.</p>
          </div>
          <Link to="/invention-plans" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">
            View All Inventions →
          </Link>
        </div>
      </div>

      {/* Order success banner */}
      {orderSuccess && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-3 bg-green-950/50 border border-green-700 rounded-xl px-5 py-3">
            <Check size={18} className="text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm font-bold">Purchase confirmed! Access to <span className="text-white">{orderSuccess}</span> is now active.</p>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {BUILD_PLANS.map((plan) => {
          const isExpanded = expanded === plan.id;
          const basePrice = (plan.basePriceCents / 100).toFixed(0);
          const fullPrice = ((plan.basePriceCents + plan.videoPdfPriceCents) / 100).toFixed(0);

          return (
            <div key={plan.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-colors">
              {/* Main card row */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                {/* Left: Info */}
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{plan.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{plan.category}</span>
                      <h2 className="text-xl font-black text-white leading-tight">{plan.title}</h2>
                      <p className="text-gray-400 text-sm mt-1 italic">{plan.tagline}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{plan.description}</p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {plan.specs.map((s, i) => (
                      <div key={i} className="bg-gray-800 rounded-lg px-3 py-2">
                        <p className="text-gray-500 text-xs">{s.label}</p>
                        <p className="text-white text-xs font-bold mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Whats included quick list */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {plan.what_you_get.slice(0, 3).map((item, i) => (
                      <p key={i} className="text-xs text-gray-400 flex items-center gap-1">
                        <Check size={11} className="text-green-400 flex-shrink-0" /> {item}
                      </p>
                    ))}
                    {plan.what_you_get.length > 3 && (
                      <button onClick={() => setExpanded(isExpanded ? null : plan.id)}
                        className="text-xs text-cyan-500 hover:text-cyan-400 font-bold">
                        +{plan.what_you_get.length - 3} more…
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Pricing & Buy */}
                <div className="flex flex-col gap-3 min-w-[200px]">
                  {/* Build Plan option */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-2xl font-black text-white">${basePrice}</p>
                        <p className="text-gray-400 text-xs font-bold mt-0.5">Build Plan</p>
                      </div>
                      <FileText size={18} className="text-cyan-400 mt-1" />
                    </div>
                    <p className="text-gray-500 text-xs leading-snug">Schematics, BOM, assembly instructions — viewable in-app</p>
                    <button
                      onClick={() => handleBuy(plan, false)}
                      disabled={loading[`${plan.id}-base`]}
                      className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading[`${plan.id}-base`]
                        ? <><Loader2 size={14} className="animate-spin" /> Processing…</>
                        : <><ShoppingCart size={14} /> Buy Now</>}
                    </button>
                  </div>

                  {/* Video + PDF option */}
                  <div className="bg-gradient-to-br from-purple-950/60 to-blue-950/60 border border-purple-700/60 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-2xl font-black text-purple-200">${fullPrice}</p>
                        <p className="text-purple-400 text-xs font-bold mt-0.5">+ Video & PDF</p>
                      </div>
                      <Video size={18} className="text-purple-400 mt-1" />
                    </div>
                    <p className="text-purple-300/70 text-xs leading-snug">Everything above + video guide + downloadable PDF manual</p>
                    <button
                      onClick={() => handleBuy(plan, true)}
                      disabled={loading[`${plan.id}-video`]}
                      className="w-full py-2.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-black text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading[`${plan.id}-video`]
                        ? <><Loader2 size={14} className="animate-spin" /> Processing…</>
                        : <><Play size={14} /> Buy + Video & PDF</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable details */}
              <div className="border-t border-gray-800">
                <button
                  onClick={() => setExpanded(isExpanded ? null : plan.id)}
                  className="w-full flex items-center justify-between px-6 py-3 text-xs text-gray-500 hover:text-gray-300 transition-colors font-bold"
                >
                  <span>{isExpanded ? "Hide full details" : "Show full details — what's included"}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-950/50">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Package size={12} className="text-cyan-400" /> Build Plan Includes
                      </p>
                      <div className="space-y-1.5">
                        {plan.what_you_get.map((item, i) => (
                          <p key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <Check size={11} className="text-green-400 flex-shrink-0 mt-0.5" /> {item}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Video size={12} className="text-purple-400" /> Video & PDF Bonus (+$50)
                      </p>
                      <div className="space-y-1.5">
                        {plan.video_pdf_bonus.map((item, i) => (
                          <p key={i} className="text-xs text-purple-300 flex items-start gap-2">
                            <span className="text-purple-500 flex-shrink-0 mt-0.5">♦</span> {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/40">
          <h3 className="font-black text-white mb-4">How It Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {[
              { n: "1", t: "Buy the Plan", d: "Secure Stripe checkout. One-time payment. Instant access." },
              { n: "2", t: "View In-App", d: "Schematics, BOMs, and assembly steps unlock inside the Invention Plans viewer." },
              { n: "3", t: "Build It", d: "Video add-on: watch assembly step-by-step. PDF: print & use offline." },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-cyan-900 border border-cyan-700 text-cyan-400 font-black text-xs flex items-center justify-center flex-shrink-0">{s.n}</div>
                <div>
                  <p className="font-bold text-white">{s.t}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-700 text-xs">
        All plans protected in-app. Content is viewable only — no copy/paste or download without PDF add-on.
      </footer>
    </div>
  );
}