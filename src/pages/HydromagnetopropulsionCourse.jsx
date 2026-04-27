/**
 * HydromagnetopropulsionCourse
 * Theoretical research module on hydromagnetopropulsion levitation systems
 * Covers EM field theory, fluid dynamics integration, and engineering frameworks
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, AlertTriangle, Zap, Waves, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const MODULES = [
  {
    title: "1. Electromagnetic Field Fundamentals",
    lessons: [
      "Scalar electromagnetic theory — Bearden framework",
      "Vector vs. scalar EM propagation",
      "Magnetic field topology and gradient analysis",
      "Phase coherence and field synchronization",
      "Field energy density calculations"
    ]
  },
  {
    title: "2. Hydromagnetic Principles",
    lessons: [
      "Magnetohydrodynamics (MHD) basic equations",
      "Lorentz force effects on conductive fluids",
      "Pressure gradient mechanics in magnetic fields",
      "Fluid motion induced by asymmetric field topologies",
      "Coupling between EM and fluid dynamics"
    ]
  },
  {
    title: "3. Theoretical Propulsion Models",
    lessons: [
      "Asymmetric field topology for directional thrust",
      "Orthogonal field combinations for vector control",
      "Frequency-phase relationships and resonance",
      "Energy transfer from EM fields to fluid motion",
      "Mathematical modeling frameworks"
    ]
  },
  {
    title: "4. Levitation Theory",
    lessons: [
      "Opposing gravitational gradients via EM fields",
      "Field geometry for lift generation",
      "Stability and control mechanisms",
      "Energy requirements and efficiency analysis",
      "Comparison with conventional propulsion"
    ]
  },
  {
    title: "5. Engineering Frameworks (Theoretical)",
    lessons: [
      "System topology design principles",
      "Component specifications and interactions",
      "Control systems and feedback loops",
      "Safety considerations and hazard analysis",
      "Experimental validation approaches"
    ]
  },
  {
    title: "6. Experimental Validation Roadmap",
    lessons: [
      "Measurement instrumentation requirements",
      "Laboratory setup configurations",
      "Data collection and analysis protocols",
      "Replication verification standards",
      "Peer review and documentation"
    ]
  }
];

function ModuleCard({ module, expanded, onToggle }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/40 transition-colors"
      >
        <span className="text-white font-bold text-lg">{module.title}</span>
        {expanded ? <ChevronUp size={18} className="text-cyan-400" /> : <ChevronDown size={18} className="text-gray-500" />}
      </button>
      {expanded && (
        <div className="px-5 pb-4 border-t border-gray-800 space-y-2">
          {module.lessons.map((lesson, i) => (
            <div key={i} className="flex items-start gap-3 text-gray-300">
              <span className="text-cyan-400 font-bold flex-shrink-0">→</span>
              <span className="text-sm">{lesson}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HydromagnetopropulsionCourse() {
  const [expandedModule, setExpandedModule] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-6 sticky top-0 z-40">
        <Link to="/courses" className="text-cyan-400 hover:text-cyan-300 text-sm font-bold mb-4 flex items-center gap-1">
          ← Back to Courses
        </Link>
        <div className="flex items-start gap-4">
          <div className="text-4xl">⚡</div>
          <div>
            <h1 className="text-3xl font-black mb-2">Hydromagnetopropulsion Levitation Systems</h1>
            <p className="text-gray-400 mb-3">Theoretical research framework on electromagnetic propulsion and levitation</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-xs font-bold">
              <AlertTriangle size={12} /> THEORETICAL — No Confirmed Working Prototype
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Overview */}
        <div className="bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-900/30 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Course Overview</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            This course explores the theoretical integration of scalar electromagnetic principles with hydromagnetic fluid dynamics 
            to model potential propulsion and levitation mechanisms. Rather than claiming working devices, we examine the engineering 
            frameworks, mathematical foundations, and experimental approaches needed to validate (or refute) such systems.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Zap size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">6 modules</p>
                <p className="text-xs text-gray-500">From EM theory to experimental design</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Waves size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">30+ lessons</p>
                <p className="text-xs text-gray-500">Comprehensive coverage</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Research-focused</p>
                <p className="text-xs text-gray-500">Academic validation frameworks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 mb-8">
          <div className="flex gap-3">
            <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-bold text-red-300 mb-1">Important Disclaimer</p>
              <p>
                This course is entirely theoretical. No working hydromagnetopropulsion levitation device has been publicly demonstrated 
                or peer-reviewed. Content is presented for academic exploration only. Do not attempt to build systems based on these 
                frameworks without proper engineering oversight, safety protocols, and peer review.
              </p>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
        <div className="space-y-4 mb-12">
          {MODULES.map((module, i) => (
            <ModuleCard
              key={i}
              module={module}
              expanded={expandedModule === i}
              onToggle={() => setExpandedModule(expandedModule === i ? -1 : i)}
            />
          ))}
        </div>

        {/* Learning Outcomes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">What You'll Learn</h3>
          <ul className="space-y-2 text-gray-300">
            {[
              "Foundations of scalar EM theory and field topology",
              "Magnetohydrodynamic equations and applications",
              "Theoretical models for EM-induced fluid motion",
              "Engineering frameworks for propulsion and levitation",
              "Experimental validation and measurement approaches",
              "Safety analysis and hazard identification",
              "Peer review standards and reproducibility requirements",
              "How to evaluate propulsion claims critically"
            ].map((outcome, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold flex-shrink-0">✓</span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all"
          >
            View in Course Catalog <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}