export default function ConversionHero() {
  const logoUrl = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcf3bcb42_df887ac44_logo.png";

  return (
    <div className="relative overflow-hidden bg-gray-950 border-b border-gray-800">
      <style>{`
        @keyframes orbitObjects {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .orbit-container {
          animation: orbitObjects 12s linear infinite;
        }
        @keyframes sunPulse {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 12px rgba(255, 180, 60, 0.9)); }
          50% { opacity: 1; filter: drop-shadow(0 0 20px rgba(255, 200, 80, 1)); }
        }
        .sun-pulse {
          animation: sunPulse 3s ease-in-out infinite;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-start gap-8">
          {/* Logo with Orbital System */}
          <div className="flex-shrink-0 relative" style={{ width: "240px", height: "240px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Green Orbit Ring */}
            <div className="absolute rounded-full border-2 border-green-500/50" style={{ width: "240px", height: "240px", top: "0", left: "0" }} />
            
            {/* Center Logo */}
            <img
              src={logoUrl}
              alt="Zenith Apex Tech"
              className="w-32 h-32 rounded-lg relative z-10"
              style={{
                filter: "drop-shadow(0 0 16px rgba(59, 130, 246, 0.6))",
              }}
            />

            {/* Orbiting Container */}
            <div className="orbit-container absolute" style={{ width: "240px", height: "240px", top: "0", left: "0" }}>
              {/* Sun Element */}
              <div className="sun-pulse absolute" style={{ top: "0px", left: "50%", transform: "translateX(-50%)" }}>
                <div className="w-5 h-5 rounded-full" style={{ background: "radial-gradient(circle at 35% 35%, rgba(255, 200, 80, 1), rgba(255, 140, 20, 0.8))", boxShadow: "0 0 14px rgba(255, 180, 60, 0.9)" }} />
              </div>

              {/* Green Laser */}
              <div className="absolute" style={{ bottom: "0px", left: "50%", transform: "translateX(-50%)" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff80", boxShadow: "0 0 10px rgba(0, 255, 128, 1)" }} />
              </div>
            </div>
          </div>

          {/* Company Name & Mission on Right */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-black text-white leading-tight mb-2">
                ZENITH APEX T.E.C.H
              </h1>
              <p className="text-gray-400 text-sm tracking-widest font-bold">
                Tethering · Electromagnetic · Consciousness · Hub
              </p>
            </div>

            <p className="text-lg text-gray-300 italic leading-relaxed max-w-2xl">
              "Enable inventors and engineers with institutional-grade research. Bridge patents to commercialization. Build scalable technology businesses."
            </p>

            <p className="text-sm text-gray-500">
              Institutional-grade research intelligence for advanced engineers and serious builders.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href="#pricing" className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors">
                View Membership Plans
              </a>
              <a href="/research-brief" className="px-6 py-2.5 rounded-lg border border-gray-700 hover:border-gray-600 text-white font-bold text-sm transition-colors">
                Free Sample
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}