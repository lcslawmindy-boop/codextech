import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const ACRONYM = [
  { letter: "C", meaning: "Complete", color: "bg-red-600" },
  { letter: "O", meaning: "Open", color: "bg-orange-600" },
  { letter: "D", meaning: "Design", color: "bg-yellow-600" },
  { letter: "E", meaning: "Execute", color: "bg-green-600" },
  { letter: "X", meaning: "eXamine", color: "bg-blue-600" },
  { letter: "T", meaning: "Test", color: "bg-purple-600" },
  { letter: "E", meaning: "Engineer", color: "bg-pink-600" },
  { letter: "C", meaning: "Construct", color: "bg-indigo-600" },
  { letter: "H", meaning: "Harness", color: "bg-cyan-600" },
];

// ── BACKGROUND ASSET GRID ──
const BACKGROUND_ASSETS = [
  // Inventors & Scientists (silhouettes/names)
  { type: "text", content: "TESLA", x: 5, y: 8, size: "text-2xl", opacity: 0.08, rotation: -15 },
  { type: "text", content: "MAXWELL", x: 88, y: 12, size: "text-2xl", opacity: 0.08, rotation: 10 },
  { type: "text", content: "BEARDEN", x: 15, y: 78, size: "text-2xl", opacity: 0.08, rotation: 25 },
  { type: "text", content: "PRIORE", x: 78, y: 82, size: "text-2xl", opacity: 0.08, rotation: -10 },
  { type: "text", content: "KAZNACHEYEV", x: 8, y: 42, size: "text-xl", opacity: 0.07, rotation: 5 },
  { type: "text", content: "LAKHOVSKY", x: 92, y: 68, size: "text-lg", opacity: 0.07, rotation: -20 },

  // Scientific Formulas
  { type: "text", content: "∇·E = ρ/ε₀", x: 85, y: 28, size: "text-xl", opacity: 0.06, rotation: 0 },
  { type: "text", content: "E = mc²", x: 10, y: 55, size: "text-2xl", opacity: 0.08, rotation: 30 },
  { type: "text", content: "φ = 1.618...", x: 92, y: 58, size: "text-lg", opacity: 0.07, rotation: -15 },
  { type: "text", content: "F = qE", x: 20, y: 88, size: "text-xl", opacity: 0.06, rotation: 10 },
  { type: "text", content: "V = IR", x: 2, y: 18, size: "text-lg", opacity: 0.06, rotation: -25 },
  { type: "text", content: "Ψ²", x: 70, y: 35, size: "text-3xl", opacity: 0.05, rotation: 0 },
  { type: "text", content: "ΔE = hf", x: 25, y: 68, size: "text-lg", opacity: 0.06, rotation: 20 },

  // Icons & Symbols
  { type: "icon", content: "⚡", x: 12, y: 32, size: "text-6xl", opacity: 0.12, rotation: 0 },
  { type: "icon", content: "🧲", x: 80, y: 45, size: "text-6xl", opacity: 0.12, rotation: -30 },
  { type: "icon", content: "🔬", x: 22, y: 75, size: "text-5xl", opacity: 0.11, rotation: 15 },
  { type: "icon", content: "🛠️", x: 62, y: 15, size: "text-5xl", opacity: 0.11, rotation: -20 },
  { type: "icon", content: "🚀", x: 2, y: 62, size: "text-6xl", opacity: 0.13, rotation: 45 },
  { type: "icon", content: "🌍", x: 85, y: 72, size: "text-5xl", opacity: 0.11, rotation: -10 },
  { type: "icon", content: "🧬", x: 35, y: 55, size: "text-5xl", opacity: 0.11, rotation: 20 },
  { type: "icon", content: "💡", x: 8, y: 70, size: "text-5xl", opacity: 0.1, rotation: -15 },
  { type: "icon", content: "⚙️", x: 75, y: 8, size: "text-5xl", opacity: 0.11, rotation: 60 },
  { type: "icon", content: "🔋", x: 45, y: 82, size: "text-4xl", opacity: 0.1, rotation: -30 },

  // Geometric Shapes (Platonic Solids)
  { type: "text", content: "▲▲▲", x: 18, y: 25, size: "text-3xl", opacity: 0.07, rotation: 0 },
  { type: "text", content: "■", x: 88, y: 88, size: "text-4xl", opacity: 0.06, rotation: 45 },
  { type: "text", content: "●●●●", x: 50, y: 12, size: "text-2xl", opacity: 0.07, rotation: 0 },
  { type: "text", content: "◆◆", x: 92, y: 35, size: "text-3xl", opacity: 0.06, rotation: 0 },
  { type: "text", content: "⬡⬡⬡", x: 8, y: 88, size: "text-2xl", opacity: 0.07, rotation: 0 },

  // Golden Spiral & Sacred Geometry
  { type: "text", content: "⨀", x: 48, y: 42, size: "text-5xl", opacity: 0.08, rotation: 0 },
  { type: "text", content: "◉", x: 28, y: 48, size: "text-3xl", opacity: 0.09, rotation: 0 },
  { type: "text", content: "☉", x: 65, y: 65, size: "text-4xl", opacity: 0.07, rotation: 0 },

  // Device Names & Labels
  { type: "text", content: "MEG", x: 75, y: 2, size: "text-lg", opacity: 0.11, rotation: 0 },
  { type: "text", content: "HVSR", x: 1, y: 48, size: "text-lg", opacity: 0.11, rotation: 0 },
  { type: "text", content: "SCALAR", x: 45, y: 28, size: "text-lg", opacity: 0.1, rotation: 0 },
  { type: "text", content: "ANENERGY", x: 82, y: 92, size: "text-sm", opacity: 0.09, rotation: 0 },
  { type: "text", content: "TORSION", x: 12, y: 92, size: "text-lg", opacity: 0.1, rotation: 0 },

  // Additional celestial & tech elements
  { type: "icon", content: "🌙", x: 35, y: 8, size: "text-4xl", opacity: 0.09, rotation: 0 },
  { type: "icon", content: "⭐", x: 70, y: 22, size: "text-3xl", opacity: 0.08, rotation: 0 },
  { type: "icon", content: "🔭", x: 55, y: 62, size: "text-4xl", opacity: 0.1, rotation: 20 },
  { type: "icon", content: "📡", x: 28, y: 12, size: "text-4xl", opacity: 0.1, rotation: -10 },
  { type: "icon", content: "🔌", x: 92, y: 12, size: "text-3xl", opacity: 0.09, rotation: 0 },
];

export default function CodextechLanding() {
  const [vaultHovered, setVaultHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-gray-950 to-slate-950 text-white overflow-hidden relative">
      {/* ── ULTRA-DENSE FLOATING BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {BACKGROUND_ASSETS.map((asset, i) => (
          <motion.div
            key={i}
            className={`absolute ${asset.size}`}
            style={{
              left: `${asset.x}%`,
              top: `${asset.y}%`,
              opacity: asset.opacity,
            }}
            animate={{
              y: [0, -20 - i % 15, 0],
              opacity: [asset.opacity * 0.4, asset.opacity, asset.opacity * 0.4],
              rotate: [asset.rotation, asset.rotation + 5, asset.rotation - 5, asset.rotation],
            }}
            transition={{
              duration: 12 + (i % 8),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          >
            {asset.content}
          </motion.div>
        ))}
      </div>

      {/* ── ATMOSPHERIC OVERLAY ── */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/70 via-gray-950/50 to-slate-950/70 pointer-events-none z-[1]" />

      {/* ── RADIAL GLOW EFFECT ── */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-900/20 via-transparent to-transparent blur-3xl" />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10">
        {/* ── CAUTION HEADER ── */}
        <header className="border-b-4 border-yellow-500/60 px-6 py-6 bg-gradient-to-r from-yellow-950/50 to-orange-950/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-yellow-300 font-black text-2xl">⚠️</span>
              <span className="text-yellow-400 font-black text-xl tracking-widest uppercase">CAUTION</span>
              <span className="text-yellow-300 font-black text-2xl">⚠️</span>
            </div>
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-1">
                C.O.D.E.X.T.E.C.H.
              </h1>
              <p className="text-xs text-yellow-300 tracking-[0.3em] font-black">RESTRICTED RESEARCH PLATFORM</p>
            </div>
          </div>
        </header>

        {/* ── HERO SECTION ── */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-5xl mx-auto w-full text-center">
            {/* ── BANK VAULT DOOR ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="mx-auto mb-24 w-full max-w-sm"
            >
              <motion.div
                onHoverStart={() => setVaultHovered(true)}
                onHoverEnd={() => setVaultHovered(false)}
                whileHover={{ scale: 1.1 }}
                className="relative aspect-square rounded-3xl overflow-hidden border-8 border-gray-600 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-950 shadow-2xl shadow-cyan-900/50 group cursor-pointer"
              >
                {/* Vault rivet pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(107,114,128,0.3)_0.5px,transparent_0.5px)] bg-[length:30px_30px]" />

                {/* Vertical divider */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49.5%,rgba(107,114,128,0.4)_49.5%,rgba(107,114,128,0.4)_50.5%,transparent_50.5%)]" />

                {/* Horizontal divider */}
                <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49.5%,rgba(107,114,128,0.4)_49.5%,rgba(107,114,128,0.4)_50.5%,transparent_50.5%)]" />

                {/* Animated security rings */}
                <motion.div
                  animate={{
                    opacity: [0.2, 0.7, 0.2],
                    scale: [1.1, 0.95, 1.1],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute inset-0 border-4 border-cyan-500/40 rounded-3xl"
                />
                <motion.div
                  animate={{
                    opacity: [0.6, 0.15, 0.6],
                    scale: [0.9, 1.05, 0.9],
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-6 border-2 border-cyan-400/30 rounded-2xl"
                />
                <motion.div
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute inset-12 border border-cyan-300/20 rounded-xl"
                />

                {/* Central lock assembly */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: vaultHovered ? [0, 180, 360] : 0,
                      scale: vaultHovered ? 1.2 : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: vaultHovered ? "easeInOut" : "easeOut",
                    }}
                    className="relative"
                  >
                    <Lock size={96} className="text-cyan-300 drop-shadow-2xl filter blur-sm opacity-80" />
                    <Lock size={96} className="text-cyan-400 drop-shadow-lg absolute inset-0" />
                  </motion.div>
                </div>

                {/* Text overlay */}
                <div className="absolute bottom-10 left-0 right-0 text-center z-20">
                  <motion.p
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-xs font-black text-cyan-300 tracking-[0.15em] mb-2 uppercase"
                  >
                    Restricted Access
                  </motion.p>
                  <p className="text-3xl font-black text-cyan-200 drop-shadow-lg">ENTER VAULT</p>
                </div>
              </motion.div>
            </motion.div>

            {/* ── 3D PERIODIC TABLE BLOCKS ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-20"
            >
              <p className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-10 font-black">Research Framework</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3 sm:gap-4 justify-center px-2">
                {ACRONYM.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{
                      scale: 1.2,
                      rotateX: 30,
                      rotateY: 20,
                      rotateZ: 5,
                      boxShadow: `0 30px 60px rgba(0, 0, 0, 0.9), 0 0 40px ${item.color === "bg-red-600" ? "rgba(239, 68, 68, 0.5)" : item.color === "bg-cyan-600" ? "rgba(34, 211, 238, 0.5)" : "rgba(100, 100, 200, 0.3)"}`,
                    }}
                    className={`${item.color} rounded-lg p-5 sm:p-6 text-center font-black transition-all cursor-default shadow-xl`}
                    style={{
                      perspective: "1200px",
                    }}
                  >
                    <div className="text-5xl sm:text-6xl mb-2 drop-shadow-lg">{item.letter}</div>
                    <div className="text-xs sm:text-sm font-bold opacity-100 leading-tight drop-shadow">
                      {item.meaning}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── CALL TO ACTION ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-center"
            >
              <p className="text-xl sm:text-3xl font-black text-white mb-6">
                Advanced Electromagnetic Research Vault
              </p>
              <p className="text-gray-300 text-sm max-w-2xl mx-auto mb-12 leading-relaxed">
                40+ documented engineering systems · Primary-source archive · AI patent tools · Peer-reviewed · Declassified · For serious researchers only.
              </p>
              <motion.a
                href="/legal"
                whileHover={{ scale: 1.08, boxShadow: "0 20px 60px rgba(34, 211, 238, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-16 py-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-lg shadow-2xl shadow-cyan-900/60 transition-all uppercase tracking-wider"
              >
                Sign NDA & Enter
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t-2 border-gray-800 px-6 py-10 bg-gray-950/60 backdrop-blur text-center text-gray-600 text-xs">
          <p className="font-black tracking-widest">© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H.</p>
          <p className="mt-2">Advanced Electromagnetic Research · Restricted Platform</p>
          <p className="mt-3 text-gray-700">For Research, Education, and Development Purposes Only</p>
        </footer>
      </div>
    </div>
  );
}