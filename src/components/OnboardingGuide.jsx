import { useState, useEffect } from "react";
import { ChevronRight, Check, Lightbulb, Zap, BookOpen, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Welcome to ZARP",
    subtitle: "Let's get you set up in 5 minutes",
    icon: Zap,
    description: "Your AI operating system for invention, IP creation, and commercialization is ready.",
    action: null,
    actionText: "Continue",
  },
  {
    id: 2,
    title: "Access Your First Build Plan",
    subtitle: "Explore invention blueprints",
    icon: BookOpen,
    description: "Head to Invention Plans to browse 23 ready-to-build hardware blueprints. Each includes a Bill of Materials, sourcing guide, and step-by-step assembly instructions.",
    action: "/invention-plans",
    actionText: "Explore Build Plans",
  },
  {
    id: 3,
    title: "Set Up Your Project Dashboard",
    subtitle: "Organize your work",
    icon: Lightbulb,
    description: "Go to My Research to create your first project. You can track build progress, save favorite inventions, and manage your IP portfolio all in one place.",
    action: "/my-research",
    actionText: "Open My Research",
  },
  {
    id: 4,
    title: "Run Your First Patent Search",
    subtitle: "Discover the prior art",
    icon: Search,
    description: "Use the AI Research Assistant to search the prior art database. Ask questions like 'What's the history of scalar EM devices?' and get cited, detailed answers.",
    action: "/ai-research",
    actionText: "Start Patent Search",
  },
  {
    id: 5,
    title: "You're All Set!",
    subtitle: "Start building your IP empire",
    icon: Check,
    description: "You now have full access to the platform. Explore courses, generate AI invention dossiers, draft patents, and connect with investors.",
    action: "/",
    actionText: "Go to Dashboard",
  },
];

export default function OnboardingGuide({ onComplete, autoStart = true }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isOpen, setIsOpen] = useState(autoStart);
  const [showTooltip, setShowTooltip] = useState(true);

  const step = ONBOARDING_STEPS[currentStep];
  const StepIcon = step.icon;
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    if (onComplete) onComplete();
  };

  const handleComplete = () => {
    setIsOpen(false);
    if (onComplete) onComplete();
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-white font-black text-lg">Onboarding Guide</h2>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="px-8 py-12">
          <div className="flex gap-8">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                <StepIcon size={32} className="text-cyan-400" />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-cyan-400 font-bold text-sm uppercase tracking-widest mb-2">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </p>
              <h3 className="text-white font-black text-2xl mb-1">{step.title}</h3>
              <p className="text-gray-400 text-sm font-semibold mb-4">{step.subtitle}</p>
              <p className="text-gray-300 text-base leading-relaxed">{step.description}</p>
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="px-8 py-6 border-t border-gray-800 bg-gray-950/30">
          <div className="flex gap-2 mb-6 flex-wrap">
            {ONBOARDING_STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  idx === currentStep
                    ? "bg-cyan-500 text-black scale-110"
                    : idx < currentStep
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {idx < currentStep ? <Check size={16} /> : idx + 1}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {step.action ? (
              <Link
                to={step.action}
                className="flex-1 px-6 py-3 rounded-xl font-black text-base text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {step.actionText}
                <ChevronRight size={16} />
              </Link>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 rounded-xl font-black text-base text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {step.actionText}
                <ChevronRight size={16} />
              </button>
            )}

            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <button
                onClick={handleComplete}
                className="px-6 py-3 rounded-xl font-bold text-base text-gray-300 bg-gray-800 hover:bg-gray-700 transition-all"
              >
                Done
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="px-6 py-3 rounded-xl font-bold text-base text-gray-400 hover:text-gray-300 transition-all"
              >
                Skip
              </button>
            )}
          </div>
        </div>

        {/* Tip */}
        {showTooltip && (
          <div className="px-8 py-3 bg-cyan-950/30 border-t border-cyan-900/30 flex gap-3 items-start">
            <Lightbulb size={16} className="flex-shrink-0 text-cyan-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-cyan-300 text-xs font-semibold">Pro Tip:</p>
              <p className="text-cyan-200/70 text-xs leading-relaxed">
                {currentStep === 0
                  ? "You can skip this anytime and come back later via the Help menu."
                  : currentStep === 1
                  ? "Save your favorite inventions to your project dashboard for quick access."
                  : currentStep === 2
                  ? "Your project dashboard syncs across all devices — work from anywhere."
                  : currentStep === 3
                  ? "The AI Research Assistant can also help with competitor research and prior art analysis."
                  : "Check out the Glossary and Troubleshooting guides in the sidebar anytime you need help."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}