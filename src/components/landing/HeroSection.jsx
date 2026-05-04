import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Database, Wrench } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,180,255,0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Live badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 relative z-10"
        style={{
          border: "1px solid rgba(0,200,255,0.35)",
          background: "rgba(0,200,255,0.07)",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-black tracking-widest text-cyan-400">
          C.O.D.E.X.T.E.C.H. — ENGINEERING INTELLIGENCE PLATFORM
        </span>
      </div>

      {/* Headline */}
      <h1
        className="text-4xl md:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight relative z-10"
        style={{ maxWidth: "960px" }}
      >
        <span className="text-white">Structured Research Intelligence</span>
        <br />
        <span
          style={{
            background: "linear-gradient(135deg, #00ccff 0%, #00ff99 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          For Advanced EM Engineering.
        </span>
      </h1>

      {/* Sub-headline */}
      <p
        className="text-base md:text-lg text-center max-w-2xl mb-4 relative z-10 leading-relaxed"
        style={{ color: "rgba(255,255,255,0.65)" }}
      >
        A systematic research database for engineers, inventors, and technical researchers working in electromagnetic systems, energy devices, and advanced physics.{" "}
        <span className="text-white font-bold">Primary sources. Verified patents. Build-ready specifications.</span>
      </p>

      {/* Autism Sensory Bed Note */}
      <p
        className="text-sm md:text-base text-center max-w-xl mb-6 relative z-10 leading-relaxed italic"
        style={{ color: "rgba(200,150,255,0.75)" }}
      >
        Right now, we're funding a prototype multi-modal sensory regulation bed for autistic children. Real-time biometric monitoring. Anxiety detection. Adaptive calming response. Caregiver portal. Research-backed. Non-medical. {" "}
        <span className="text-white font-bold">Join us in bringing this to market.</span>
      </p>

      <p
        className="text-sm text-center mb-10 relative z-10 font-bold"
        style={{ color: "rgba(0,200,255,0.85)", letterSpacing: "0.04em" }}
      >
        40+ granted US patents · 200+ peer-reviewed publications · 6 build systems · $89/month
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-10 mb-16">
        <Link
          to="/codextech-database"
          className="flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-black text-base text-black transition-all hover:scale-105"
          style={{
            background: "linear-gradient(90deg, #00ccff, #00ff99)",
            boxShadow: "0 0 40px rgba(0,200,255,0.4), 0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          Access the Research Database <ArrowRight size={16} />
        </Link>
        <Link
          to="/pricing"
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all hover:scale-105"
          style={{
            border: "1.5px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <ShieldCheck size={16} /> View Membership Options
        </Link>
      </div>

      {/* Trust bar */}
      <div
        className="grid grid-cols-2 sm:grid-cols-5 gap-6 relative z-10 pt-10 border-t w-full max-w-3xl"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        {[
          { icon: <Database size={14} />, num: "40+", label: "Granted Patents" },
          { icon: <ShieldCheck size={14} />, num: "200+", label: "Peer-Reviewed Sources" },
          { icon: <Wrench size={14} />, num: "6", label: "Build Systems" },
          { icon: <ShieldCheck size={14} />, num: "8", label: "Research Modules" },
          { icon: <Database size={14} />, num: "100%", label: "Primary Sources" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="flex justify-center mb-1 text-cyan-500 opacity-60">{s.icon}</div>
            <p className="text-xl font-black text-white">{s.num}</p>
            <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}