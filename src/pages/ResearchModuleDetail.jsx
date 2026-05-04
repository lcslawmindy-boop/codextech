import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Lock, CheckCircle2, Download, ExternalLink, ChevronRight, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTier } from "@/hooks/useTier";

// Module data keyed by slug
const MODULES = {
  "meg-system": {
    title: "Motionless Electromagnetic Generator (MEG)",
    category: "Free Energy",
    patent: "US 6,362,718",
    authors: "Bearden, Hayes, Moore, Kenny, Patrick",
    journal: "Foundations of Physics Letters, Vol. 14, No. 1, 2001",
    minTier: "member",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png",
    summary: "The MEG is a solid-state energy conversion device based on Bearden's dipole theory. It uses a nanocrystalline core with multiple coils to extract usable electrical energy from the local vacuum, achieving COP>1 under controlled conditions.",
    keyPoints: [
      "Peer-reviewed and published in Foundations of Physics Letters",
      "COP>1 demonstrated by multiple independent researchers",
      "US Patent 6,362,718 granted March 26, 2002",
      "Nanocrystalline core is critical to operation",
      "Bearden's dipole theory explains the source mechanism",
    ],
    sections: [
      { title: "Theoretical Basis", locked: false, content: "The MEG operates on Bearden's dipole theory — every dipole in the universe is already a 'broken symmetry' in the vacuum, continuously absorbing energy from the virtual photon flux (the quantum vacuum) and re-emitting it as observable EM energy. The MEG's core acts as an asymmetric magnetic path that intercepts and redirects this vacuum energy into usable output." },
      { title: "Core Architecture", locked: false, content: "The device uses a nanocrystalline (or amorphous) toroidal core with two input drive coils and two output coils arranged in a specific phase relationship. The core material must have very low coercivity and very high permeability to facilitate the Bedini effect at the core level." },
      { title: "Bill of Materials", locked: true, content: "" },
      { title: "Assembly Steps (14 Steps)", locked: true, content: "" },
      { title: "Measurement Protocol", locked: true, content: "" },
      { title: "Source Documents & Citations", locked: true, content: "" },
    ],
  },
  "priore-device": {
    title: "Prioré Electromagnetic Therapy Device",
    category: "Bioelectromagnetics",
    patent: "FR 1,342,772",
    authors: "Antoine Prioré",
    journal: "Multiple French government-funded clinical trials, 1960s–1970s",
    minTier: "member",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png",
    summary: "The Prioré device used a rotating magnetic plasma tube to produce complex EM fields that reversed cancer and trypanosomiasis in peer-reviewed animal studies, with French government funding and academic oversight.",
    keyPoints: [
      "Funded by the French government and the Aquitaine region",
      "Peer-reviewed by Jacques Pautrizel (immunologist) and others",
      "Demonstrated tumor reversal in hundreds of animal trials",
      "Complex frequency spectrum: RF + microwave + rotating magnetic field",
      "Technology suppressed after Prioré's death in 1983",
    ],
    sections: [
      { title: "Historical Context", locked: false, content: "Prioré began experiments in Bordeaux in the late 1950s. By the 1960s, his device had attracted the attention of top French immunologist Jacques Pautrizel, who ran systematic animal trials at the University of Bordeaux. The results — complete tumor regression in animals — were published in peer-reviewed literature." },
      { title: "Electromagnetic Architecture", locked: false, content: "The device combined: a plasma tube containing a mixture of helium, neon, and other gases; a powerful rotating magnetic field (produced by electromagnets); RF signals at multiple frequencies simultaneously modulated. The exact frequency spectrum required for biological effect has not been fully reproduced." },
      { title: "Replication Specifications", locked: true, content: "" },
      { title: "Component Sourcing", locked: true, content: "" },
      { title: "Clinical Trial Source Documents", locked: true, content: "" },
    ],
  },
  "scalar-transmitter": {
    title: "Scalar EM Transmitter / Receiver",
    category: "Scalar EM",
    patent: "Multiple Bearden-derived patents",
    authors: "T.E. Bearden, E.T. Whittaker",
    journal: "Bearden: Solutions to Tesla's Secrets (1981); Whittaker: Phil. Trans. (1904)",
    minTier: "member",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png",
    summary: "Whittaker's 1904 decomposition of the electromagnetic potential shows that any scalar potential contains two counterpropagating EM waves. Bearden extended this into a practical transmitter/receiver architecture for longitudinal scalar waves.",
    keyPoints: [
      "Mathematical basis: Whittaker decomposition (1904) — peer-reviewed",
      "Bearden's extension: practical transmitter using opposing coil pairs",
      "Longitudinal (scalar) component propagates through Faraday cage",
      "Tesla's Colorado Springs experiments provide empirical support",
      "Potential applications: through-earth communication, EMP-resistant comms",
    ],
    sections: [
      { title: "Whittaker Decomposition", locked: false, content: "In 1904, E.T. Whittaker published a paper in the Philosophical Transactions of the Royal Society showing that any EM potential can be decomposed into two bidirectional longitudinal wave sets. This means scalar potentials contain hidden internal EM structure — and can carry energy and information." },
      { title: "Transmitter Architecture", locked: false, content: "A scalar transmitter typically uses two opposing coil sets driven 180° out of phase, so their transverse EM fields cancel in the far field, leaving only the scalar (longitudinal) component. The receiver uses the same cancellation principle in reverse to extract the signal." },
      { title: "Full Build Specifications", locked: true, content: "" },
      { title: "Frequency & Phase Protocol", locked: true, content: "" },
      { title: "Source Documents", locked: true, content: "" },
    ],
  },
};

export default function ResearchModuleDetail() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const slug = params.get("module") || "meg-system";
  const module = MODULES[slug] || MODULES["meg-system"];

  const { isMember } = useTier();
  const hasAccess = isMember;

  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900/95 backdrop-blur px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link to="/codextech-database" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors" style={{ minHeight: 44 }}>
            <ArrowLeft size={16} /> Research Database
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300 text-sm truncate">{module.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 rounded-full bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs font-bold">{module.category}</span>
              {!hasAccess && <span className="px-2 py-1 rounded-full bg-yellow-950/40 border border-yellow-800 text-yellow-300 text-xs font-bold flex items-center gap-1"><Lock size={10} /> Locked</span>}
            </div>
            <h1 className="text-3xl font-black mb-3">{module.title}</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{module.summary}</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p><span className="text-gray-400 font-bold">Patent:</span> {module.patent}</p>
              <p><span className="text-gray-400 font-bold">Authors:</span> {module.authors}</p>
              <p><span className="text-gray-400 font-bold">Source:</span> {module.journal}</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-800 h-56 lg:h-auto">
            <img src={module.img} alt={module.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-black text-sm mb-4 flex items-center gap-2"><BookOpen size={14} className="text-cyan-400" /> Key Technical Points</h3>
          <div className="space-y-2">
            {module.keyPoints.map((pt, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section navigation + content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section list */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Sections</h3>
            <div className="space-y-1">
              {module.sections.map((sec, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(i)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
                    activeSection === i
                      ? "bg-cyan-950/40 border border-cyan-800 text-cyan-300"
                      : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600"
                  }`}
                >
                  <span>{sec.title}</span>
                  {sec.locked && !hasAccess ? <Lock size={12} className="text-yellow-500 flex-shrink-0" /> : <ChevronRight size={12} className="text-gray-600 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Content pane */}
          <div className="lg:col-span-2">
            {(() => {
              const sec = module.sections[activeSection];
              const isLocked = sec.locked && !hasAccess;
              return (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 min-h-48">
                  <h3 className="text-white font-black text-lg mb-4">{sec.title}</h3>
                  {isLocked ? (
                    <div className="flex flex-col items-center text-center py-8">
                      <div className="w-14 h-14 rounded-2xl bg-yellow-950/40 border border-yellow-800 flex items-center justify-center mb-4">
                        <Lock size={24} className="text-yellow-400" />
                      </div>
                      <p className="text-gray-400 text-sm mb-4">This section requires a paid membership to access.</p>
                      <Link to="/pricing" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm transition-colors">
                        <Zap size={14} /> Join — $49/mo
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm leading-relaxed">{sec.content}</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Bottom CTA */}
        {!hasAccess && (
          <div className="mt-10 bg-gradient-to-br from-cyan-950/30 to-gray-950 border border-cyan-800/40 rounded-2xl p-8 text-center">
            <h3 className="text-white font-black text-xl mb-2">Unlock the Full Module</h3>
            <p className="text-gray-400 text-sm mb-5">Get complete BOMs, assembly steps, measurement protocols, and source documents for every system in the vault.</p>
            <Link to="/pricing" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black transition-colors">
              Join for $49/month <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}