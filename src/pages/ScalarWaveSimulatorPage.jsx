import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ScalarWaveSimulator from "../components/ScalarWaveSimulator";

export default function ScalarWaveSimulatorPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <span className="text-gray-500 text-xs">Bearden Scalar EM · Interactive Simulator</span>
      </div>
      <ScalarWaveSimulator />
    </div>
  );
}