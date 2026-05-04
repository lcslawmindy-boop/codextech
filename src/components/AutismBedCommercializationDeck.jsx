import { useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Truck, Zap, Wrench, DollarSign, TrendingUp } from 'lucide-react';

const DECK_SLIDES = [
  {
    title: 'Commercialization Roadmap',
    subtitle: 'From Prototype to Market',
    icon: <TrendingUp className="text-cyan-400" size={32} />,
    content: 'Complete pathway: procurement → assembly → testing → manufacturing → distribution.',
    color: 'from-cyan-950 to-cyan-900',
  },
  {
    title: 'Phase 1: Procurement',
    subtitle: 'Component Sourcing & BOM Finalization',
    icon: <Package className="text-blue-400" size={32} />,
    details: [
      'Qualified suppliers for all 34 components',
      'Volume pricing negotiated (20+ unit runs)',
      'Lead times: 4-8 weeks per batch',
      'Quality assurance & certification setup',
      'Cost per unit: $8,450 (prototype) → $4,200 (volume)',
    ],
    color: 'from-blue-950 to-blue-900',
    timeline: 'Weeks 1-8',
  },
  {
    title: 'Phase 2: Assembly & Integration',
    subtitle: 'Prototype Build & System Testing',
    icon: <Wrench className="text-purple-400" size={32} />,
    details: [
      'Titanium bed frame assembly & welding',
      '14-channel EEG headband integration',
      'PEMF Helmholtz coil calibration',
      'Biometric sensor suite verification',
      'EMF chamber testing & validation',
      'Full system integration test (12 days)',
    ],
    color: 'from-purple-950 to-purple-900',
    timeline: 'Weeks 8-16',
  },
  {
    title: 'Phase 3: Software & Dashboard',
    subtitle: 'AI Control System & Caregiver Portal',
    icon: <Zap className="text-yellow-400" size={32} />,
    details: [
      'Real-time biometric data pipeline',
      'AI anxiety detection algorithm (trained on 1000+ datasets)',
      'Caregiver mobile app (iOS/Android)',
      'Encrypted data storage & HIPAA compliance',
      'Automated alert system for meltdown precursors',
      'Longitudinal report generation',
    ],
    color: 'from-yellow-950 to-yellow-900',
    timeline: 'Weeks 12-20',
  },
  {
    title: 'Phase 4: Clinical Pilot',
    subtitle: 'IRB-Approved Research Study',
    icon: <Truck className="text-pink-400" size={32} />,
    details: [
      '10 children (ages 6-14) with diagnosed ASD',
      '8-week pilot study with caregiver feedback',
      'Safety monitoring & adverse event reporting',
      'Efficacy metrics: meltdown reduction, anxiety markers',
      'Publication pathway in peer-reviewed journals',
      'Real-world usage data collection',
    ],
    color: 'from-pink-950 to-pink-900',
    timeline: 'Weeks 20-36',
  },
  {
    title: 'Manufacturing & Scale',
    subtitle: 'Production Setup for 50+ Units',
    icon: <DollarSign className="text-green-400" size={32} />,
    details: [
      'Contract manufacturing partner selection',
      'Quality control procedures (ISO 13485)',
      'Production capacity: 5 units/week',
      'Supply chain resilience & redundancy',
      'Cost reduction to $3,800 per unit',
      'First commercial units: Month 12',
    ],
    color: 'from-green-950 to-green-900',
    timeline: 'Weeks 24-48',
  },
];

export default function AutismBedCommercializationDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = DECK_SLIDES[currentSlide];

  return (
    <section className="px-6 py-16 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-orange-400 text-xs font-black uppercase tracking-widest mb-3">Commercialization Strategy</p>
          <h2 className="text-3xl font-black text-white">3D Pitch Deck: Build to Market</h2>
          <p className="text-gray-400 text-sm mt-2">Complete roadmap with BOM, procurement, assembly, software, and manufacturing.</p>
        </div>

        {/* Main slide */}
        <div className={`bg-gradient-to-br ${slide.color} border border-gray-700 rounded-3xl p-12 backdrop-blur relative overflow-hidden min-h-[500px] flex flex-col justify-between`}>
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              animation: 'breatheGlow 4s ease-in-out infinite',
            }} />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              {slide.icon}
              <div>
                <h2 className="text-4xl font-black text-white">{slide.title}</h2>
                <p className="text-gray-300 text-lg mt-1">{slide.subtitle}</p>
              </div>
            </div>

            {slide.details ? (
              <div className="space-y-3">
                {slide.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3 text-gray-200">
                    <span className="text-cyan-400 font-bold mt-1">→</span>
                    <span className="text-sm leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-200 text-lg leading-relaxed">{slide.content}</p>
            )}

            {slide.timeline && (
              <div className="mt-8 inline-block bg-black/40 border border-cyan-500/50 rounded-lg px-4 py-2">
                <p className="text-cyan-400 font-black text-sm">⏱️ {slide.timeline}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation & progress */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + DECK_SLIDES.length) % DECK_SLIDES.length)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-black text-sm transition-all"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="flex items-center gap-2">
            {DECK_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'bg-cyan-400 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % DECK_SLIDES.length)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-black text-sm transition-all"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          Slide {currentSlide + 1} of {DECK_SLIDES.length}
        </p>
      </div>

      <style>{`
        @keyframes breatheGlow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }
      `}</style>
    </section>
  );
}