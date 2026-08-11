import { Link } from "react-router-dom";
import { ChevronDown, Play, Sparkles } from "lucide-react";
import ParticleField from "./ParticleField";

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Particle background */}
      <div className="absolute inset-0">
        <ParticleField density={50} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(2,6,23,0.8) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20 pb-12">
        {/* Disclaimer bar */}
        <div className="inline-block px-4 py-1.5 rounded border border-slate-700 mb-8">
          <span className="text-slate-500 text-[10px] font-mono tracking-wider">
            ⚠ Concepts and patents for R&D purposes only · Not medical advice
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-white" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '-0.02em' }}>
          The World's First Research Intelligence Platform
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
            for Frontier & Suppressed Science
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-4 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          ZARP maps the hidden connections between breakthrough technologies —
          so you can engineer devices, draft IP, and build innovations
          that the mainstream hasn't caught up to yet.
        </p>

        {/* Tagline */}
        <p className="text-sm text-amber-400/80 mb-10 font-semibold tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Map it. Connect it. Build it. Patent it.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
          {[
            { icon: "🔬", label: "50+ Research Domains" },
            { icon: "🔗", label: "2,400+ Technology Connections" },
            { icon: "⚡", label: "6 Device Build Frameworks" },
          ].map(badge => (
            <div key={badge.label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-lg">{badge.icon}</span>
              <span className="text-white text-sm font-semibold">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="#pricing"
            className="px-8 py-4 rounded-xl text-base font-bold text-slate-950 transition-all hover:scale-105"
            style={{ backgroundColor: '#fbbf24', boxShadow: '0 0 30px rgba(251,191,36,0.4)' }}
          >
            ★ Start Building Free
          </a>
          <button className="px-8 py-4 rounded-xl text-base font-bold text-white border border-slate-700 bg-slate-900/40 backdrop-blur-sm hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2">
            <Play size={16} className="text-cyan-400" /> Watch How It Works
          </button>
        </div>

        {/* Showcase video */}
        <div className="relative max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden border border-slate-700 group" style={{ boxShadow: '0 0 60px rgba(139,92,246,0.15)' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10 pointer-events-none" />
          <video
            src="https://media.base44.com/videos/public/69ccefebfea78b23498c66a8/0bb7a01b0_aethonapexipvideo.MOV"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover"
            style={{ maxHeight: '420px' }}
          />
          <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-[10px] font-bold tracking-wider uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Aethon Apex IP — Platform Showcase
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center">
          <ChevronDown size={24} className="text-slate-500 animate-bounce" />
        </div>
      </div>
    </section>
  );
}