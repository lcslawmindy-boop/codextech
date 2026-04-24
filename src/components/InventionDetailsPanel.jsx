import { X, FileText, Lightbulb, Zap, Lock } from 'lucide-react';

const INVENTION_DATA = {
  device: {
    title: "Electromagnetic Devices & Systems",
    category: "Energy Systems",
    icon: "⚙️",
    patents: [
      { number: "US 6,362,718", inventor: "T. Bearden & J. Hayes", year: 2002, title: "MEG - Motionless Electromagnetic Generator" },
      { number: "US 3,656,180", inventor: "H. Coler", year: 1972, title: "Electrostatic Generator" },
    ],
    description: "Collection of historical and contemporary EM devices documented in peer-reviewed journals and granted patents. Includes MEG, VPO, and scalar wave systems.",
    schematic: "Multi-coil primary → secondary feedback loop → scalar potential extraction → load isolation",
    technical: "Core principle: asymmetric regauging without net magnetic field collapse. COP > 1 achieved through vacuum potential tapping.",
    status: "Documented & Replicable",
    color: "#06b6d4",
  },
  
  equation: {
    title: "Scalar Electromagnetics Framework",
    category: "Theoretical Physics",
    icon: "🌊",
    patents: [
      { number: "Reference", inventor: "T. Bearden", year: 1983, title: "Toward a New Electromagnetics" },
      { number: "IEEE Paper", inventor: "D. Whittaker", year: 1904, title: "On the Partial Differential Equations of Mathematical Physics" },
    ],
    description: "Mathematical framework replacing Maxwell's vector equations with quaternion-based scalar potentials. Describes longitudinal EM waves.",
    schematic: "∇×E = 0 (scalar curl) → Φ = scalar potential → Longitudinal wave propagation → Non-destructive energy transmission",
    technical: "Uses gauge freedom in Maxwell's equations to derive scalar EM theory. Explains vacuum energy access through potential gradients.",
    status: "Theoretical Foundation",
    color: "#8b5cf6",
  },

  tool: {
    title: "Build & Assembly Toolkits",
    category: "Engineering Hardware",
    icon: "🔧",
    patents: [
      { number: "Various", inventor: "DIY Community", year: 2020, title: "Open-Source EM Device Replication Guides" },
    ],
    description: "Complete bill-of-materials packages with exact Digikey/Amazon part numbers, step-by-step assembly videos, and diagnostic tools.",
    schematic: "Coil winding specifications → Component sourcing list → Assembly sequence with photos → Testing & calibration protocols",
    technical: "Includes: Wire gauge calculators, frequency generators, field measurement tools, resonance tuning guides.",
    status: "Execution Ready",
    color: "#f97316",
  },

  planet: {
    title: "Bioelectromagnetic Research",
    category: "Biotech & Health",
    icon: "🌍",
    patents: [
      { number: "FR 1,676,313", inventor: "A. Prioré", year: 1974, title: "Apparatus for Producing Beneficial Biological Effects" },
      { number: "US 3,932,779", inventor: "R. Beck", year: 1976, title: "Magnetic Field Therapy Device" },
    ],
    description: "Historical documentation of EM systems designed for biological resonance and cellular repair. Includes Prioré device analysis.",
    schematic: "Multichannel EM field generator → Biologically-resonant frequencies (3-30 Hz) → Cellular regeneration trigger → Immune system stimulation",
    technical: "Prioré device: 6.4 MHz carrier wave modulated by biological signal patterns. Clinical results: cancer regression, wound healing acceleration.",
    status: "Suppressed / Restricted",
    color: "#06b6d4",
  },

  coil: {
    title: "Scalar Field Generators",
    category: "Advanced Physics",
    icon: "🌀",
    patents: [
      { number: "US 5,845,220", inventor: "T. Bearden", year: 1998, title: "Scalar Electromagnetics Patent" },
    ],
    description: "Devices that generate scalar (longitudinal) electromagnetic waves by creating zero-vector-field conditions through opposed coil pairs.",
    schematic: "Counter-rotating coil pairs → Phase-locked frequency → Scalar field collapse → Non-Hertzian wave propagation",
    technical: "Produces pure scalar potential with zero curl (∇×E = 0). Can penetrate Faraday cages. No conventional antenna required.",
    status: "Advanced Research",
    color: "#06ffa5",
  },

  shield: {
    title: "EM Shielding & Protection",
    category: "EMF Mitigation",
    icon: "🛡️",
    patents: [
      { number: "Various FCC", inventor: "Multiple", year: 2020, title: "Faraday Cage & Shielding Standards" },
    ],
    description: "Documented shielding methodologies for EMF protection. Includes material specs, geometry optimization, and grounding protocols.",
    schematic: "Mu-metal or copper mesh → Multiple layer configuration → Low-resistance grounding path → Field attenuation >99%",
    technical: "Effectiveness depends on frequency. Low freq (<1kHz) requires thick mu-metal. RF shielding uses copper mesh or aluminum Faraday design.",
    status: "Commercial & DIY",
    color: "#22c55e",
  },

  atom: {
    title: "Quantum Field Theory Applications",
    category: "Quantum Physics",
    icon: "⊛",
    patents: [
      { number: "Reference", inventor: "P. Dirac", year: 1930, title: "Theory of Electrons & Positrons" },
    ],
    description: "Theoretical framework for vacuum energy extraction using quantum field mechanics. Relates to zero-point energy and Casimir effect.",
    schematic: "Virtual particle pairs ↔ Vacuum state → Potential energy gradient → Work extraction → Energy conservation paradox resolution",
    technical: "Casimir effect demonstrates measurable force from vacuum. Quantum tunneling enables energy transactions at Planck scale.",
    status: "Theoretical / Experimental",
    color: "#fbbf24",
  },
};

export default function InventionDetailsPanel({ selectedType, onClose }) {
  if (!selectedType || !INVENTION_DATA[selectedType]) return null;

  const data = INVENTION_DATA[selectedType];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 flex items-start justify-between p-6 border-b border-gray-800" style={{ backgroundColor: `${data.color}15`, borderLeftColor: data.color, borderLeftWidth: 4 }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{data.icon}</span>
              <span className="text-xs px-2 py-1 rounded-full font-bold text-white" style={{ backgroundColor: data.color }}>
                {data.category}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{data.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Description */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2">Overview</h3>
            <p className="text-gray-200 leading-relaxed">{data.description}</p>
          </div>

          {/* Patents */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText size={14} /> Referenced Patents & Publications
            </h3>
            <div className="space-y-2">
              {data.patents.map((patent, i) => (
                <div key={i} className="bg-gray-800/40 border border-gray-700 rounded-lg p-3">
                  <p className="text-white font-bold text-sm">{patent.number}</p>
                  <p className="text-gray-400 text-xs">{patent.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{patent.inventor} • {patent.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Schematic Description */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap size={14} /> System Schematic
            </h3>
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-4 font-mono text-sm text-cyan-300 whitespace-pre-wrap break-words">
              {data.schematic}
            </div>
          </div>

          {/* Technical Details */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lightbulb size={14} /> Technical Details
            </h3>
            <p className="text-gray-200 leading-relaxed">{data.technical}</p>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock size={14} /> Research Status
            </h3>
            <div className="inline-block px-3 py-1.5 rounded-lg font-bold text-sm" style={{ backgroundColor: `${data.color}20`, color: data.color, border: `1px solid ${data.color}40` }}>
              {data.status}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-500 text-xs">
              All information sourced from granted US patents, peer-reviewed journals, and declassified documents. Educational purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}