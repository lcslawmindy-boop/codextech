import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BOMVisualizer3D from "@/components/BOMVisualizer3D";

const MEG_BOM = [
  { type: "coil", name: "Primary Excitation Coil", category: "Coils", quantity: 1 },
  { type: "coil", name: "Secondary Output Coil", category: "Coils", quantity: 1 },
  { type: "core", name: "Nanocrystalline Ferrite Core", category: "Magnetic Components", quantity: 1 },
  { type: "magnet", name: "Neodymium Ring Magnet (N52)", category: "Magnets", quantity: 4 },
  { type: "capacitor", name: "High-Voltage Capacitor Bank", category: "Electronics", quantity: 3 },
  { type: "resistor", name: "Precision Current Limiting Resistor", category: "Electronics", quantity: 4 },
  { type: "connector", name: "High-Frequency Signal Connector", category: "Connectors", quantity: 2 },
  { type: "connector", name: "Power Input Connector", category: "Connectors", quantity: 1 },
];

export default function BOMInteractive() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg">Bill of Materials (BOM) Visualizer</h1>
            <p className="text-gray-500 text-xs">Interactive 3D component preview & assembly guide</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-800/50 rounded-2xl p-8">
          <h2 className="text-2xl font-black mb-2">Motionless Electromagnetic Generator (MEG)</h2>
          <p className="text-gray-400 text-sm mb-4">
            Explore the interactive 3D assembly of the MEG system. Click components to see details, use the controls to rotate and zoom.
          </p>
          <div className="flex gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700 text-purple-300">11 Components</span>
            <span className="px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700 text-blue-300">Est. Assembly Time: 8-12 hours</span>
          </div>
        </div>

        {/* 3D Visualizer */}
        <BOMVisualizer3D bom={MEG_BOM} />

        {/* Assembly Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">Assembly Steps</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-600 flex items-center justify-center text-cyan-300 font-bold text-xs">1</span>
                <span className="text-gray-300">Install ferrite core into housing base</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-600 flex items-center justify-center text-cyan-300 font-bold text-xs">2</span>
                <span className="text-gray-300">Wind primary excitation coil (24 AWG, 2000 turns)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-600 flex items-center justify-center text-cyan-300 font-bold text-xs">3</span>
                <span className="text-gray-300">Wind secondary output coil (12 AWG, 500 turns)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-600 flex items-center justify-center text-cyan-300 font-bold text-xs">4</span>
                <span className="text-gray-300">Mount neodymium ring magnets at 90° intervals</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-600 flex items-center justify-center text-cyan-300 font-bold text-xs">5</span>
                <span className="text-gray-300">Connect capacitor bank in parallel to primary coil</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-600 flex items-center justify-center text-cyan-300 font-bold text-xs">6</span>
                <span className="text-gray-300">Install signal connectors and test continuity</span>
              </li>
            </ol>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">Component Integration Points</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <span className="text-cyan-400 font-bold text-lg">↔</span>
                <div>
                  <p className="text-white font-semibold">Primary to Core</p>
                  <p className="text-gray-400 text-xs">Secure coil to ferrite core with non-conductive fasteners</p>
                </div>
              </li>
              <li className="flex gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <span className="text-purple-400 font-bold text-lg">⚡</span>
                <div>
                  <p className="text-white font-semibold">Magnet to Housing</p>
                  <p className="text-gray-400 text-xs">Use adhesive-backed mounts for easy removal during tuning</p>
                </div>
              </li>
              <li className="flex gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <span className="text-green-400 font-bold text-lg">⊙</span>
                <div>
                  <p className="text-white font-semibold">Secondary to Output</p>
                  <p className="text-gray-400 text-xs">Isolate secondary coil from primary with Faraday shielding</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Primary Frequency</p>
              <p className="text-cyan-400 font-bold">10-20 kHz</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Input Power</p>
              <p className="text-cyan-400 font-bold">50-150W</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Output Voltage</p>
              <p className="text-cyan-400 font-bold">12-48V DC</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Core Impedance</p>
              <p className="text-cyan-400 font-bold">150-500Ω</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}