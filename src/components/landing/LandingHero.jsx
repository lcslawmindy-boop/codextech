import { Link } from "react-router-dom";
import { ChevronDown, Play, Sparkles } from "lucide-react";
import ParticleField from "./ParticleField";

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zarp-bg">
      {/* Particle background */}
      <div className="absolute inset-0">
        <ParticleField density={50} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-zarp-bg/50 via-transparent to-zarp-bg" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-zarp-bg/80" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--zarp-bg) / 0.8) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20 pb-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zarp-gold/30 bg-zarp-gold/5 mb-8">
          <Sparkles size={13} className="text-zarp-gold" />
          <span className="text-zarp-gold text-xs font-semibold tracking-wider uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Zero-point & Advanced Research Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '-0.02em' }}>
          The World's First Research Intelligence Platform
          <br />
          <span className="bg-gradient-to-r from-zarp-gold via-zarp-blue to-zarp-violet bg-clip-text text-transparent">
            for Frontier & Suppressed Science
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zarp-muted max-w-3xl mx-auto mb-4 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          ZARP maps the hidden connections between breakthrough technologies —
          so you can engineer devices, draft IP, and build innovations
          that the mainstream hasn't caught up to yet.
        </p>

        {/* Tagline */}
        <p className="text-sm text-zarp-gold/80 mb-10 font-semibold tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Map it. Connect it. Build it. Patent it.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
          {[
            { icon: "🔬", label: "50+ Research Domains" },
            { icon: "🔗", label: "2,400+ Technology Connections" },
            { icon: "⚡", label: "6 Device Build Frameworks" },
          ].map(badge => (
            <div key={badge.label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zarp-card/60 border border-zarp-border backdrop-blur-sm">
              <span className="text-lg">{badge.icon}</span>
              <span className="text-zarp-text text-sm font-semibold">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#pricing"
            className="px-8 py-4 rounded-xl text-base font-bold text-zarp-bg transition-all hover:scale-105"
            style={{ backgroundColor: 'hsl(var(--zarp-gold))', boxShadow: '0 0 30px hsl(var(--zarp-gold) / 0.4)' }}
          >
            ★ Start Building Free
          </a>
          <button className="px-8 py-4 rounded-xl text-base font-bold text-zarp-text border border-zarp-border bg-zarp-card/40 backdrop-blur-sm hover:border-zarp-blue/50 transition-all flex items-center justify-center gap-2">
            <Play size={16} className="text-zarp-blue" /> Watch How It Works
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center">
          <ChevronDown size={24} className="text-zarp-muted animate-bounce" />
        </div>
      </div>
    </section>
  );
}