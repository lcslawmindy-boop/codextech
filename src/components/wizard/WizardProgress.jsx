import { CheckCircle2 } from "lucide-react";

export const WIZARD_STEPS = [
  { id: "import", label: "Import / Setup", short: "Setup" },
  { id: "title", label: "Title & Inventors", short: "Title" },
  { id: "abstract", label: "Abstract", short: "Abstract" },
  { id: "description", label: "Specification", short: "Spec" },
  { id: "claims", label: "Claims", short: "Claims" },
  { id: "drawings", label: "Drawings", short: "Drawings" },
  { id: "review", label: "Review & Export", short: "Export" },
];

export default function WizardProgress({ currentStep, completedSteps, onStepClick }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {WIZARD_STEPS.map((step, i) => {
        const isActive = currentStep === step.id;
        const isDone = completedSteps.includes(step.id);
        const isClickable = isDone || i === 0 || completedSteps.includes(WIZARD_STEPS[i - 1]?.id);
        return (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-indigo-700 text-white"
                  : isDone
                  ? "bg-green-900/40 text-green-400 hover:bg-green-900/60"
                  : isClickable
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  : "text-gray-700 cursor-not-allowed"
              }`}
            >
              {isDone && !isActive ? (
                <CheckCircle2 size={12} className="text-green-400" />
              ) : (
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-black ${
                  isActive ? "bg-white/20" : "bg-gray-700"
                }`}>{i + 1}</span>
              )}
              <span className="hidden sm:inline">{step.short}</span>
            </button>
            {i < WIZARD_STEPS.length - 1 && (
              <div className={`w-4 h-px mx-1 flex-shrink-0 ${isDone ? "bg-green-700" : "bg-gray-800"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}