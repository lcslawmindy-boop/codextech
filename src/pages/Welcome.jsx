import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Zap, Lock, CheckCircle2, Wrench, BookOpen, Shield, ChevronRight } from "lucide-react";

// ── The one build we let them "experience" for free ───────────────────────────
const TEASER_BUILD = {
  title: "MEG Replication Kit",
  category: "Free Energy — US Patent 6,362,718",
  hook: "Motionless Electromagnetic Generator. Peer-reviewed. COP>1 demonstrated. Co-authored by PhD physicist, published in Foundations of Physics Letters.",
  img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png",
  preview: [
    { label: "Components", value: "23 parts", free: true },
    { label: "Est. build cost", value: "~$180–240", free: true },
    { label: "Build time", value: "12–18 hours", free: true },
    { label: "Primary sources", value: "7 citations", free: true },
    { label: "Full BOM (Digikey part numbers)", value: "Unlock", free: false },
    { label: "Step-by-step assembly (14 steps)", value: "Unlock", free: false },
    { label: "Downloadable PDF", value: "Unlock", free: false },
    { label: "Build video walkthrough", value: "Unlock", free: false },
  ],
};

const VALUE_PROPS = [
  { icon: <Wrench size={20} className="text-orange-400" />, title: "40+ Full Build Plans", detail: "BOM, assembly steps, PDF, build video — for every device in the vault." },
  { icon: <BookOpen size={20} className="text-blue-400" />, title: "40+ Advanced Courses", detail: "Scalar EM, patent strategy, bioelectromagnetics, vacuum energy. New content monthly." },
  { icon: <Shield size={20} className="text-green-400" />, title: "AI Patent Suite", detail: "Provisional patents, FTO analysis, claims generator. Minutes, not months." },
];

// ── Step components ───────────────────────────────────────────────────────────

function StepWelcome({ onNext }) {
  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto px-5 py-16 min-h-[80vh] justify-center">
      <div className="mb-8">
        <img
          src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png"
          alt="ZARP"
          className="h-16 w-16 object-contain mx-auto mb-5"
        />
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-black mb-5 uppercase tracking-widest">
          <Zap size={10} /> You're Inside the Vault
        </div>
        <h1 className="text-4xl font-black leading-tight mb-4">
          Welcome to<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">ZARP Engineering Platform</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-2">
          40+ advanced EM systems documented from <strong className="text-white">granted US patents</strong>, <strong className="text-white">peer-reviewed journals</strong>, and <strong className="text-white">primary engineering sources</strong>.
        </p>
        <p className="text-gray-500 text-sm leading-relaxed">
          Full build plans. Complete BOMs. AI patent tools. Physical kit delivery. Every system documented at the engineering level — not the conceptual level.
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-xs py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 20px rgba(0,200,255,0.4)" }}
      >
        Show Me What's Inside <ArrowRight size={16} />
      </button>
      <p className="text-gray-700 text-xs mt-3">Takes 60 seconds</p>
    </div>
  );
}

function StepValue({ onNext }) {
  return (
    <div className="max-w-lg mx-auto px-5 py-12 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-8">
        <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-2">Step 2 of 3 — What You Get</p>
        <h2 className="text-3xl font-black mb-3">
          One Membership.<br />The Entire Vault.
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Primary sources. Precise specifications. Engineering-grade documentation — not theory, not conjecture.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {VALUE_PROPS.map((item, i) => (
          <div key={i} className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-0.5">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Price anchor */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-7 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs mb-1">À la carte value</p>
          <p className="text-white font-black text-xl line-through opacity-40">$27,800+</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs mb-1">Your membership</p>
          <p className="text-green-400 font-black text-2xl">$49<span className="text-gray-500 text-sm font-normal">/month</span></p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 20px rgba(0,200,255,0.4)" }}
      >
        Show Me a Real Build Plan <ArrowRight size={16} />
      </button>
    </div>
  );
}

function StepBuild({ onPaywall }) {
  const [revealed, setRevealed] = useState(false);

  const handleRevealAttempt = () => {
    if (!revealed) {
      setRevealed(true);
      // After 1.2s of "revealing", trigger the paywall
      setTimeout(onPaywall, 1200);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-5 py-12 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-6">
        <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-2">Step 3 of 3 — Your First Build</p>
        <h2 className="text-3xl font-black mb-2">The MEG Build Plan</h2>
        <p className="text-gray-500 text-sm">Peer-reviewed COP&gt;1 demonstration. US Patent 6,362,718. Foundations of Physics Letters.</p>
      </div>

      {/* Build card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
        <div className="h-40 relative overflow-hidden">
          <img
            src={TEASER_BUILD.img}
            alt={TEASER_BUILD.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-white font-black text-base leading-snug">{TEASER_BUILD.title}</p>
            <p className="text-cyan-400 text-xs">{TEASER_BUILD.category}</p>
          </div>
        </div>

        <div className="p-4">
          <p className="text-gray-400 text-xs leading-relaxed mb-4 italic">{TEASER_BUILD.hook}</p>
          <div className="space-y-2">
            {TEASER_BUILD.preview.map((row, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-800 last:border-0">
                <span className="text-gray-400 text-xs">{row.label}</span>
                {row.free ? (
                  <span className="text-white text-xs font-bold">{row.value}</span>
                ) : (
                  <button
                    onClick={handleRevealAttempt}
                    className={`flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg transition-all ${
                      revealed
                        ? "bg-purple-600 text-white animate-pulse"
                        : "bg-gray-800 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50"
                    }`}
                  >
                    <Lock size={10} />
                    {revealed ? "Unlocking…" : "Unlock"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mb-4">
        Click any locked field above — or access the full platform:
      </p>
      <button
        onClick={onPaywall}
        className="w-full py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 20px rgba(0,200,255,0.4)" }}
      >
        Access Full Platform <ChevronRight size={16} />
      </button>
      <p className="text-center text-gray-700 text-xs mt-2">$49/month · Cancel anytime</p>
    </div>
  );
}

// ── Progress indicator ─────────────────────────────────────────────────────────
function ProgressDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 pt-8 pb-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: step === i ? 24 : 8,
            height: 8,
            background: step === i
              ? "linear-gradient(90deg, #06b6d4, #8b5cf6)"
              : step > i ? "#374151" : "#1f2937",
          }}
        />
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Welcome() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const goToPaywall = () => navigate("/paywall");

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      {/* Skip link — low friction, high trust */}
      <div className="absolute top-4 right-4 z-20">
        <Link to="/free-vault" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
          Skip intro →
        </Link>
      </div>

      <ProgressDots step={step} />

      {step === 0 && <StepWelcome onNext={() => setStep(1)} />}
      {step === 1 && <StepValue onNext={() => setStep(2)} />}
      {step === 2 && <StepBuild onPaywall={goToPaywall} />}
    </div>
  );
}