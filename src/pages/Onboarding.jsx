import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Zap, BookOpen, Wrench, Shield, User } from "lucide-react";
import { base44 } from "@/api/base44Client";

const GOALS = [
  { id: "build", icon: "🔧", label: "Build a device", desc: "I want to replicate a physical system" },
  { id: "patent", icon: "📋", label: "File a patent", desc: "I want to protect my invention" },
  { id: "invest", icon: "💰", label: "Invest in IP", desc: "I want to find inventions to fund" },
  { id: "research", icon: "🧪", label: "Research a topic", desc: "I want to understand a technology area" },
  { id: "business", icon: "🚀", label: "Commercialize IP", desc: "I have IP and want to monetize it" },
];

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "New to this", desc: "No engineering background" },
  { id: "intermediate", label: "Some background", desc: "Electrical/physics knowledge" },
  { id: "advanced", label: "Expert", desc: "Professional R&D or engineering" },
];

const RECOMMENDED_BY_GOAL = {
  build: [
    { label: "View Build Plans", href: "/invention-plans", icon: "🔨" },
    { label: "Build Supplies Shop", href: "/build-supplies-shop", icon: "🛒" },
    { label: "MEG Module", href: "/research-module?module=meg-system", icon: "⚡" },
  ],
  patent: [
    { label: "Patent Drafting Tool", href: "/patent-tool", icon: "📝" },
    { label: "Patent Tracker", href: "/patent-tracker", icon: "📊" },
    { label: "Prior Art Archive", href: "/prior-art", icon: "📚" },
  ],
  invest: [
    { label: "IP Marketplace", href: "/ip-marketplace", icon: "🤝" },
    { label: "Investor Portal", href: "/investor-portal", icon: "💼" },
    { label: "VDR Portal", href: "/vdr-admin", icon: "🔒" },
  ],
  research: [
    { label: "Research Database", href: "/codextech-database", icon: "🧪" },
    { label: "Source Documents", href: "/source-documents", icon: "📄" },
    { label: "Scalar EM Lab", href: "/scalar-lab", icon: "🌀" },
  ],
  business: [
    { label: "IP Marketplace", href: "/ip-marketplace", icon: "🏛️" },
    { label: "Invention Dossier", href: "/invention-dossier", icon: "📦" },
    { label: "Valuation Dashboard", href: "/valuation", icon: "💎" },
  ],
};

function Step1({ onNext }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="max-w-lg mx-auto px-5 py-14 flex flex-col min-h-[80vh] justify-center">
      <div className="text-center mb-8">
        <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-2">Step 1 of 3</p>
        <h2 className="text-3xl font-black mb-2">What's your main goal?</h2>
        <p className="text-gray-400 text-sm">We'll personalize your dashboard based on your answer.</p>
      </div>
      <div className="space-y-3 mb-8">
        {GOALS.map(g => (
          <button key={g.id} onClick={() => setSelected(g.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${selected === g.id ? "border-cyan-500 bg-cyan-950/30" : "border-gray-800 bg-gray-900 hover:border-gray-600"}`}>
            <span className="text-2xl">{g.icon}</span>
            <div>
              <p className="text-white font-bold text-sm">{g.label}</p>
              <p className="text-gray-500 text-xs">{g.desc}</p>
            </div>
            {selected === g.id && <CheckCircle2 size={16} className="text-cyan-400 ml-auto flex-shrink-0" />}
          </button>
        ))}
      </div>
      <button onClick={() => selected && onNext(selected)} disabled={!selected}
        className="w-full py-4 rounded-xl font-black text-white text-base disabled:opacity-40 transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}>
        Continue <ArrowRight size={16} />
      </button>
    </div>
  );
}

function Step2({ onNext }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="max-w-lg mx-auto px-5 py-14 flex flex-col min-h-[80vh] justify-center">
      <div className="text-center mb-8">
        <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-2">Step 2 of 3</p>
        <h2 className="text-3xl font-black mb-2">Your experience level?</h2>
        <p className="text-gray-400 text-sm">Helps us surface the right starting points.</p>
      </div>
      <div className="space-y-3 mb-8">
        {EXPERIENCE_LEVELS.map(l => (
          <button key={l.id} onClick={() => setSelected(l.id)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-left transition-all ${selected === l.id ? "border-purple-500 bg-purple-950/30" : "border-gray-800 bg-gray-900 hover:border-gray-600"}`}>
            <div>
              <p className="text-white font-bold text-sm">{l.label}</p>
              <p className="text-gray-500 text-xs">{l.desc}</p>
            </div>
            {selected === l.id && <CheckCircle2 size={16} className="text-purple-400 flex-shrink-0" />}
          </button>
        ))}
      </div>
      <button onClick={() => selected && onNext(selected)} disabled={!selected}
        className="w-full py-4 rounded-xl font-black text-white text-base disabled:opacity-40 transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #4f46e5)" }}>
        Continue <ArrowRight size={16} />
      </button>
    </div>
  );
}

function Step3({ goal, onFinish }) {
  const recs = RECOMMENDED_BY_GOAL[goal] || RECOMMENDED_BY_GOAL.research;
  return (
    <div className="max-w-lg mx-auto px-5 py-14 flex flex-col min-h-[80vh] justify-center">
      <div className="text-center mb-8">
        <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-2">Step 3 of 3 — You're Ready</p>
        <h2 className="text-3xl font-black mb-2">Here's your starting point</h2>
        <p className="text-gray-400 text-sm">Based on your goal, these are the best places to start.</p>
      </div>
      <div className="space-y-3 mb-8">
        {recs.map((r, i) => (
          <Link key={i} to={r.href}
            className="flex items-center gap-4 px-5 py-4 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl transition-all group">
            <span className="text-2xl">{r.icon}</span>
            <span className="text-white font-bold text-sm flex-1">{r.label}</span>
            <ArrowRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
          </Link>
        ))}
      </div>
      <button onClick={onFinish}
        className="w-full py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
        <Zap size={16} /> Enter the Platform
      </button>
    </div>
  );
}

function ProgressDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 pt-8 pb-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="rounded-full transition-all duration-300"
          style={{ width: step === i ? 24 : 8, height: 8, background: step === i ? "linear-gradient(90deg,#06b6d4,#8b5cf6)" : step > i ? "#374151" : "#1f2937" }} />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(null);
  const navigate = useNavigate();

  const handleGoal = (g) => { setGoal(g); setStep(1); };
  const handleLevel = () => setStep(2);
  const handleFinish = () => {
    try { localStorage.setItem("onboarding_complete", "1"); } catch {}
    navigate("/member-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <div className="absolute top-4 right-4 z-20">
        <Link to="/member-dashboard" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
          Skip →
        </Link>
      </div>
      <ProgressDots step={step} />
      {step === 0 && <Step1 onNext={handleGoal} />}
      {step === 1 && <Step2 onNext={handleLevel} />}
      {step === 2 && <Step3 goal={goal} onFinish={handleFinish} />}
    </div>
  );
}