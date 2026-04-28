import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

// ── ACRONYM WITH USER'S DEFINITIONS ──
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

// ── FLOATING BACKGROUND ASSETS ──
const FLOATING_ASSETS = [
  // Inventors & Scientists
  { text: "Tesla", x: 5, y: 10, size: "text-xs", opacity: 0.15 },
  { text: "Maxwell", x: 85, y: 15, size: "text-xs", opacity: 0.15 },
  { text: "Bearden", x: 20, y: 75, size: "text-xs", opacity: 0.15 },
  { text: "Prioré", x: 75, y: 80, size: "text-xs", opacity: 0.15 },
  { text: "Kaznacheyev", x: 10, y: 45, size: "text-xs", opacity: 0.15 },
  
  // Mathematical/Physics Symbols
  { text: "∇·E = ρ/ε₀", x: 88, y: 35, size: "text-sm", opacity: 0.1 },
  { text: "E = mc²", x: 12, y: 60, size: "text-sm", opacity: 0.1 },
  { text: "φ = 1.618", x: 92, y: 65, size: "text-sm", opacity: 0.1 },
  { text: "∞", x: 45, y: 8, size: "text-2xl", opacity: 0.12 },
  { text: "√2", x: 8, y: 25, size: "text-lg", opacity: 0.1 },
  { text: "Ω", x: 75, y: 25, size: "text-lg", opacity: 0.1 },

  // Icons/Emojis
  { text: "⚡", x: 15, y: 35, size: "text-4xl", opacity: 0.12 },
  { text: "🧲", x: 82, y: 55, size: "text-4xl", opacity: 0.12 },
  { text: "🔬", x: 25, y: 85, size: "text-4xl", opacity: 0.12 },
  { text: "🛠️", x: 65, y: 10, size: "text-4xl", opacity: 0.12 },
  { text: "🚀", x: 5, y: 70, size: "text-4xl", opacity: 0.12 },
  { text: "🌍", x: 88, y: 80, size: "text-4xl", opacity: 0.12 },
  { text: "🧬", x: 40, y: 70, size: "text-4xl", opacity: 0.12 },

  // Geometric Shapes (Platonic Solids references)
  { text: "▲ ■ ●", x: 20, y: 20, size: "text-xs", opacity: 0.1 },
  { text: "◆", x: 92, y: 40, size: "text-2xl", opacity: 0.1 },
  { text: "⬡", x: 10, y: 80, size: "text-2xl", opacity: 0.1 },

  // Golden Spiral / Sacred Geometry
  { text: "⨀", x: 50, y: 45, size: "text-3xl", opacity: 0.08 },
  { text: "◉", x: 30, y: 55, size: "text-2xl", opacity: 0.1 },

  // Device Names
  { text: "MEG", x: 78, y: 5, size: "text-xs", opacity: 0.12 },
  { text: "HVSR", x: 2, y: 55, size: "text-xs", opacity: 0.12 },
];

export default function CodextechLanding() {
  const [vaultHovered, setVaultHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-gray-950 to-slate-950 text-white overflow-hidden relative">
      {/* ── DENSE FLOATING BACKGROUND LAYER ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {FLOATING_ASSETS.map((asset, i) => (
          <motion.div
            key={i}
            className={`absolute ${asset.size}`}
            style={{
              left: `${asset.x}%`,
              top: `${asset.y}%`,
              opacity: asset.opacity,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [asset.opacity * 0.7, asset.opacity, asset.opacity * 0.7],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {asset.text}
          </motion.div>
        ))}
      </div>

      {/* ── DARK OVERLAY FOR READABILITY ── */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/60 via-gray-950/40 to-slate-950/60 pointer-events-none z-[1]" />

      {/* ── CONTENT ── */}
      <div className="relative z-10">
        {/* ── HEADER WITH CAUTION BANNER ── */}
        <header className="border-b-2 border-yellow-500/40 px-6 py-4 bg-gradient-to-r from-yellow-950/30 to-orange-950/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-yellow-400 font-black text-xs tracking-widest">⚠️ CAUTION ⚠️</span>
            </div>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-black text-white">C.O.D.E.X.T.E.C.H.</h1>
              <p className="text-xs text-yellow-300 mt-1 tracking-widest">RESTRICTED RESEARCH PLATFORM</p>
            </div>
          </div>
        </header>

        {/* ── HERO SECTION ── */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-5xl mx-auto w-full text-center">
            {/* ── BANK VAULT PORTAL ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mx-auto mb-20 w-full max-w-xs"
            >
              <motion.div
                onHoverStart={() => setVaultHovered(true)}
                onHoverEnd={() => setVaultHovered(false)}
                whileHover={{ scale: 1.08 }}
                className="relative aspect-square rounded-2xl overflow-hidden border-4 border-gray-700 bg-gradient-to-b from-gray-800 to-gray-950 shadow-2xl shadow-cyan-900/40 group cursor-pointer"
              >
                {/* Vault door segments */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(107,114,128,0.3)_49%,rgba(107,114,128,0.3)_51%,transparent_51%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49%,rgba(107,114,128,0.3)_49%,rgba(107,114,128,0.3)_51%,transparent_51%)]" />

                {/* Animated glowing rings */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.9, 1, 0.9],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 border-2 border-cyan-500/50 rounded-2xl"
                />
                <motion.div
                  animate={{
                    opacity: [0.5, 0.2, 0.5],
                    scale: [1, 0.85, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
                  className="absolute inset-4 border border-cyan-400/30 rounded-xl"
                />

                {/* Center lock */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: vaultHovered ? [0, 180, 360] : 0,
                    }}
                    transition={{ duration: 1 }}
                  >
                    <Lock size={80} className="text-cyan-400 drop-shadow-lg" />
                  </motion.div>
                </div>

                {/* Text overlay */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <p className="text-xs font-black text-cyan-300 tracking-widest">RESTRICTED ACCESS</p>
                  <p className="text-2xl font-black text-white mt-2">ENTER VAULT</p>
                </div>
              </motion.div>
            </motion.div>

            {/* ── 3D PERIODIC TABLE BLOCKS ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-16"
            >
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-8">Framework</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-2 sm:gap-3 justify-center">
                {ACRONYM.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{
                      scale: 1.15,
                      rotateX: 20,
                      rotateY: 20,
                      boxShadow: `0 20px 40px rgba(0, 0, 0, 0.8)`,
                    }}
                    className={`${item.color} rounded-lg p-4 sm:p-5 text-center font-black transition-all cursor-default`}
                    style={{
                      perspective: "1000px",
                    }}
                  >
                    <div className="text-4xl sm:text-5xl mb-1">{item.letter}</div>
                    <div className="text-xs sm:text-sm font-bold opacity-90 leading-tight">
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
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-center"
            >
              <p className="text-lg sm:text-2xl font-black text-white mb-4">
                Advanced Electromagnetic Research
              </p>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-10 leading-relaxed">
                40+ documented engineering systems. Primary-source research archive. AI patent drafting suite. Peer-reviewed. Declassified. For serious researchers only.
              </p>
              <motion.a
                href="/legal"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-12 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base shadow-lg shadow-cyan-900/50 transition-all"
              >
                Sign NDA & Enter
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-gray-800 px-6 py-8 bg-gray-950/50 backdrop-blur text-center text-gray-600 text-xs">
          <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Restricted Research Platform</p>
          <p className="mt-2">For Research and Educational Purposes Only</p>
        </footer>
      </div>
    </div>
  );
}