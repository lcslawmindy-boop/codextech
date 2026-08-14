import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Brain, Heart, Activity } from "lucide-react";
import { TARGETED_PODS } from "../lib/targetedTherapyPods";
import TargetedPodDetail from "../components/TargetedPodDetail";
import TargetedPodExportButton from "../components/TargetedPodExportButton";

export default function TargetedTherapyPods() {
  const [activePod, setActivePod] = useState(TARGETED_PODS[0].id);
  const pod = TARGETED_PODS.find(p => p.id === activePod);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Link to="/therapy-pod-pro" className="flex items-center gap-1 text-gray-400 text-sm hover:text-white">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Therapy Pod Pro</span>
          </Link>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" />
            <h1 className="text-sm font-bold hidden sm:inline">Targeted Therapy Pods</h1>
            <TargetedPodExportButton pod={pod} />
          </div>
        </div>
        <p className="text-gray-500 text-xs">
          Two specialized pods — Autism & PTSD — each combining 9 BrightSteps modalities + 12 inventions + Vedic + suppressed + consciousness tech
        </p>
      </div>

      {/* Pod selector tabs */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          {TARGETED_PODS.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePod(p.id)}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                activePod === p.id
                  ? "border-2 text-white"
                  : "bg-gray-900 border border-gray-800 text-gray-500 hover:text-gray-300"
              }`}
              style={activePod === p.id ? { borderColor: p.color, backgroundColor: `${p.color}15` } : {}}
            >
              {p.id === "autism" ? <Brain size={20} style={{ color: activePod === p.id ? p.color : undefined }} /> : <Heart size={20} style={{ color: activePod === p.id ? p.color : undefined }} />}
              <span>{p.condition}</span>
              <span className="text-[10px] font-mono opacity-70">{p.designation}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active pod detail */}
      <div className="px-4">
        <TargetedPodDetail pod={pod} />
      </div>
    </div>
  );
}