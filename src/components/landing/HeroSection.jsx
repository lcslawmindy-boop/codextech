import { Link } from "react-router-dom";
import { Zap, ChevronRight, Shield, Globe } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(0,255,100,0.08) 0%, rgba(0,0,0,0) 60%), #000",
      }}
    >
      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,100,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,100,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Orb glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,255,100,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 relative z-10"
        style={{
          border: "1.5px solid rgba(0,255,100,0.5)",
          background: "rgba(0,255,100,0.07)",
          boxShadow: "0 0 24px rgba(0,255,100,0.2)",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-black tracking-widest" style={{ color: "#00ff66" }}>
          ZENITH APEX TECHNOLOGY — RESEARCH PLATFORM
        </span>
      </div>

      {/* Main headline */}
      <h1
        className="text-4xl md:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight relative z-10"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #00ff66 50%, #ffffff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "none",
        }}
      >
        Build Your IP Empire.
        <br />
        <span style={{ color: "#ff6600", WebkitTextFillColor: "#ff6600" }}>Save the Planet.</span>
      </h1>

      <p
        className="text-lg md:text-xl text-center max-w-3xl mb-6 relative z-10 leading-relaxed"
        style={{ color: "rgba(255,255,255,0.75)" }}
      >
        The world's only patent-backed, peer-reviewed, AI-powered research platform empowering
        engineers, inventors, and researchers to{" "}
        <strong style={{ color: "#00ff66" }}>draft patent claims</strong>,{" "}
        <strong style={{ color: "#ff6600" }}>build electromagnetic devices</strong>, and{" "}
        <strong style={{ color: "#00ccff" }}>commercialize breakthrough technology</strong>.
      </p>

      {/* Urgent sub-line */}
      <p
        className="text-sm text-center max-w-2xl mb-10 relative z-10"
        style={{ color: "rgba(255,100,0,0.9)", fontWeight: "700", letterSpacing: "0.05em" }}
      >
        ⚠️ EMF is silently damaging humanity. Scalar technology is the solution. Time is running out.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-10 mb-16">
        <Link
          to="/subscribe"
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all hover:scale-105"
          style={{
            background: "linear-gradient(90deg, #00ff66, #00cc44)",
            color: "#000",
            boxShadow: "0 0 40px rgba(0,255,100,0.5), 0 8px 30px rgba(0,0,0,0.5)",
          }}
        >
          <Zap size={18} /> Start Building Now <ChevronRight size={16} />
        </Link>
        <Link
          to="/free-vault"
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all hover:scale-105"
          style={{
            border: "2px solid rgba(0,255,100,0.5)",
            background: "rgba(0,255,100,0.05)",
            color: "#00ff66",
          }}
        >
          <Shield size={18} /> Free Research Preview
        </Link>
      </div>

      {/* Trust bar */}
      <div
        className="flex flex-wrap justify-center gap-8 relative z-10 pt-10 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)", width: "100%", maxWidth: "900px" }}
      >
        {[
          { num: "40+", label: "Verified Patents" },
          { num: "200+", label: "Peer-Reviewed Sources" },
          { num: "21+", label: "Device Build Plans" },
          { num: "8+", label: "Research Courses" },
          { num: "100%", label: "Primary Sources Only" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <p
              className="text-2xl font-black"
              style={{ color: i % 2 === 0 ? "#00ff66" : "#ff6600", textShadow: `0 0 16px ${i % 2 === 0 ? "#00ff66" : "#ff6600"}` }}
            >
              {s.num}
            </p>
            <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}