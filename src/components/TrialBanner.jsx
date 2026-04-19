import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, X } from "lucide-react";
import { getTrialPass, TRIAL_DURATION_MS } from "@/hooks/useTrialPass";

function formatTimeLeft(ms) {
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TrialBanner() {
  const [remainingMs, setRemainingMs] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const update = () => {
      const { remainingMs } = getTrialPass();
      setRemainingMs(remainingMs);
    };
    update();
    const interval = setInterval(update, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  if (dismissed || remainingMs <= 0) return null;

  const pct = Math.min((remainingMs / TRIAL_DURATION_MS) * 100, 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-[500] flex items-center gap-3 px-4 py-2 text-xs font-semibold"
      style={{ background: "linear-gradient(90deg, #0c1a2e, #0f2240)", borderBottom: "1px solid rgba(14,165,233,0.3)" }}>
      <Clock size={12} className="text-cyan-400 flex-shrink-0" />
      <span className="text-cyan-300">24-Hour Trial Pass —</span>
      <span className="text-white font-bold">{formatTimeLeft(remainingMs)} remaining</span>
      {/* progress bar */}
      <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden mx-2 hidden sm:block">
        <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <Link to="/pricing"
        className="px-3 py-1 rounded-lg font-black text-xs text-black transition-all flex-shrink-0"
        style={{ background: "linear-gradient(90deg, #0EA5E9, #10B981)" }}>
        Upgrade for Full Access
      </Link>
      <button onClick={() => setDismissed(true)} className="text-slate-500 hover:text-white flex-shrink-0 ml-1">
        <X size={12} />
      </button>
    </div>
  );
}