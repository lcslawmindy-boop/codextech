import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Radio, Database, Lock } from "lucide-react";

const ACRONYM = [
  { letter: "C", meaning: "Classified", color: "from-red-600 to-red-800" },
  { letter: "O", meaning: "Omitted", color: "from-orange-600 to-orange-800" },
  { letter: "D", meaning: "Declassified", color: "from-yellow-600 to-yellow-800" },
  { letter: "E", meaning: "Engineering", color: "from-green-600 to-green-800" },
  { letter: "X", meaning: "Extreme", color: "from-blue-600 to-blue-800" },
  { letter: "T", meaning: "Tesla", color: "from-cyan-600 to-cyan-800" },
  { letter: "E", meaning: "Electromagnetic", color: "from-purple-600 to-purple-800" },
  { letter: "C", meaning: "Concepts", color: "from-pink-600 to-pink-800" },
  { letter: "H", meaning: "Hidden", color: "from-indigo-600 to-indigo-800" },
];

const FLOATING_ICONS = [
  { icon: "⚡", x: 10, y: 20, delay: 0 },
  { icon: "🧲", x: 85, y: 15, delay: 0.5 },
  { icon: "∞", x: 20, y: 70, delay: 1 },
  { icon: "φ", x: 80, y: 75, delay: 1.5 },
  { icon: "ω", x: 50, y: 10, delay: 2 },
  { icon: "√", x: 15, y: 50, delay: 2.5 },
  { icon: "∑", x: 90, y: 50, delay: 3 },
];

const EQUATIONS = [
  "E = mc²",
  "∇·E = ρ/ε₀",
  "F = qE",
  "V = IR",
];

export default function CodextechLanding() {
  const navigate = useNavigate();
  const [vaultHovered, setVaultHovered] = useState(false);

  const handleVaultClick = () => {
    navigate("/legal");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-950 to-gray-950 text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(120,119,198,.2)_25%,rgba(120,119,198,.2)_26%,transparent_27%,transparent_74%,rgba(120,119,198,.2)_75%,rgba(120,119,198,.2)_76%,transparent_77%,transparent)] bg-[length:50px_50px]" />
      </div>

      {/* Floating background icons */}
      <div className="fixed inset-0 pointer-events-none">
        {FLOATING_ICONS.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            initial={{ x: `${item.x}%`, y: `${item.y}%` }}
            animate={{
              y: [`${item.y}%`, `${item.y - 20}%`, `${item.y}%`],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-900/30 px-6 py-6 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Zap size={24} className="text-cyan-400" />
              <span className="font-black text-xl">C.O.D.E.X.T.E.C.H.</span>
            </motion.div>
            <Link to="/pricing" className="text-sm px-6 py-2 rounded-lg border border-cyan-700 text-cyan-400 hover:bg-cyan-900/20 transition-all">
              Membership
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl mx-auto w-full">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black text-center mb-8 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Advanced
              </span>
              <br />
              <span className="text-white">Electromagnetic</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500">
                Research
              </span>
            </motion.h1>

            {/* Subtitle with equations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-16"
            >
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6">
                40+ documented engineering systems. Peer-reviewed. Source-linked. Classified research declassified.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm sm:text-base">
                {EQUATIONS.map((eq, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
                    className="text-cyan-400 font-mono"
                  >
                    {eq}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Vault Portal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center mb-20"
            >
              <motion.button
                onClick={handleVaultClick}
                onHoverStart={() => setVaultHovered(true)}
                onHoverEnd={() => setVaultHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-64 h-64 rounded-2xl overflow-hidden group"
              >
                {/* Vault portal background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-purple-900/40 to-gray-950 border-2 border-cyan-600/50 group-hover:border-cyan-400 transition-all duration-300" />

                {/* Animated glow */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(34, 197, 94, 0.3)",
                      "0 0 40px rgba(59, 130, 246, 0.5)",
                      "0 0 20px rgba(34, 197, 94, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0"
                />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center gap-4">
                  <Lock size={48} className={`transition-all duration-300 ${vaultHovered ? "text-cyan-300" : "text-cyan-500"}`} />
                  <div className="text-center">
                    <h2 className="text-2xl font-black mb-2">ENTER VAULT</h2>
                    <p className="text-xs text-gray-400">Click to access research</p>
                  </div>

                  {/* Orbiting dots */}
                  {[0, 120, 240].map((rotation, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-full h-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 ${i === 0 ? "opacity-100" : "opacity-60"}`} />
                    </motion.div>
                  ))}
                </div>
              </motion.button>
            </motion.div>

            {/* Acronym blocks */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-2 sm:gap-3"
            >
              {ACRONYM.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, rotateY: 10 }}
                  className={`bg-gradient-to-br ${item.color} rounded-lg p-4 sm:p-6 text-center group cursor-default`}
                >
                  <div className="text-3xl sm:text-4xl font-black mb-2 group-hover:scale-110 transition-transform">
                    {item.letter}
                  </div>
                  <div className="text-xs sm:text-sm font-bold opacity-90 group-hover:opacity-100">
                    {item.meaning}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="border-t border-cyan-900/30 bg-gray-950/50 backdrop-blur px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">Ready to explore?</h2>
            <p className="text-gray-400 mb-8">Sign the NDA to access the complete research vault.</p>
            <motion.button
              onClick={handleVaultClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black transition-all"
            >
              Enter Vault
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
}