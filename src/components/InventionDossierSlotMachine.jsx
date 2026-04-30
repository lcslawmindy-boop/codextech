import { useState } from "react";
import { Zap } from "lucide-react";

const DOSSIER_OUTPUTS = [
  { title: "Patent Strategy", icon: "📋", color: "text-blue-400" },
  { title: "Claims Analysis", icon: "⚖️", color: "text-purple-400" },
  { title: "Prior Art Search", icon: "🔍", color: "text-yellow-400" },
  { title: "FTO Assessment", icon: "✅", color: "text-green-400" },
  { title: "Commercialization Plan", icon: "🚀", color: "text-red-400" },
  { title: "Market Positioning", icon: "🎯", color: "text-pink-400" },
  { title: "Licensing Framework", icon: "📜", color: "text-indigo-400" },
  { title: "Valuation Model", icon: "💰", color: "text-cyan-400" },
];

export default function InventionDossierSlotMachine() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [pullsRemaining, setPullsRemaining] = useState(10);
  const [results, setResults] = useState([]);

  const handlePull = async () => {
    if (pullsRemaining === 0 || isSpinning) return;

    setIsSpinning(true);
    const spinDuration = 1500; // 1.5 seconds spin
    const spinInterval = setInterval(() => {
      setDisplayIndex((prev) => (prev + 1) % DOSSIER_OUTPUTS.length);
    }, 50);

    setTimeout(() => {
      clearInterval(spinInterval);
      const randomIndex = Math.floor(Math.random() * DOSSIER_OUTPUTS.length);
      setDisplayIndex(randomIndex);
      setResults((prev) => [...prev, DOSSIER_OUTPUTS[randomIndex]]);
      setPullsRemaining((prev) => prev - 1);
      setIsSpinning(false);
    }, spinDuration);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl mx-auto">
      <h3 className="text-white font-black text-2xl mb-2 text-center">Invention Dossier Generator</h3>
      <p className="text-gray-400 text-sm text-center mb-8">Pull the lever to generate unique patent & commercialization strategies. {pullsRemaining} rolls remaining.</p>

      {/* Slot Machine Display */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          {/* Machine Body */}
          <div className="bg-gradient-to-b from-yellow-900/30 to-yellow-950/50 border-4 border-yellow-700 rounded-2xl p-8 w-80 h-auto">
            {/* Display Window */}
            <div className="bg-gray-950 border-4 border-yellow-600 rounded-xl p-6 mb-6 h-40 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-transparent" />
              <div className={`text-center transition-all duration-200 ${isSpinning ? "blur-sm" : ""}`}>
                <div className={`text-5xl mb-2 ${DOSSIER_OUTPUTS[displayIndex].color}`}>
                  {DOSSIER_OUTPUTS[displayIndex].icon}
                </div>
                <p className="text-white font-black text-lg">{DOSSIER_OUTPUTS[displayIndex].title}</p>
              </div>
            </div>

            {/* Pull Lever Button */}
            <button
              onClick={handlePull}
              disabled={isSpinning || pullsRemaining === 0}
              className={`w-full py-4 px-6 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                pullsRemaining === 0
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : isSpinning
                  ? "bg-yellow-600 text-white animate-pulse"
                  : "bg-yellow-500 hover:bg-yellow-400 text-gray-950"
              }`}
            >
              <span className={`text-2xl ${isSpinning ? "animate-spin" : ""}`}>🎰</span>
              {isSpinning ? "SPINNING..." : "PULL LEVER"}
            </button>

            {/* Stats */}
            <div className="mt-4 text-center">
              <p className={`font-bold ${pullsRemaining === 0 ? "text-red-400" : "text-cyan-400"}`}>
                {pullsRemaining} Pulls Left
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {results.length > 0 && (
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Your Generated Dossiers</h4>
          <div className="grid grid-cols-2 gap-3">
            {results.map((result, i) => (
              <div key={i} className="bg-gray-800 border border-cyan-700/50 rounded-lg p-3">
                <div className={`text-2xl mb-1 ${result.color}`}>{result.icon}</div>
                <p className="text-white text-xs font-semibold">{result.title}</p>
                <p className="text-gray-500 text-xs mt-1">Pull #{i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {pullsRemaining === 0 && results.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-cyan-400 font-bold mb-3">🎉 All 10 dossiers generated!</p>
          <p className="text-gray-400 text-sm">Download your complete invention analysis package or explore more with your next billing cycle.</p>
        </div>
      )}
    </div>
  );
}