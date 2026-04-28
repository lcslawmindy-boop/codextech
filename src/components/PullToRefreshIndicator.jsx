import { Loader2, ArrowDown } from "lucide-react";

/**
 * Visual indicator for pull-to-refresh.
 * Place at the top of a scrollable container.
 */
export default function PullToRefreshIndicator({ pulling, pullDistance, refreshing, threshold = 80 }) {
  const progress = Math.min(pullDistance / threshold, 1);
  const visible = pulling || refreshing || pullDistance > 0;

  if (!visible) return null;

  return (
    <div
      className="flex items-center justify-center transition-all pointer-events-none"
      style={{ height: refreshing ? 52 : pullDistance * 0.6, overflow: "hidden" }}
    >
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 shadow-lg transition-opacity ${visible ? "opacity-100" : "opacity-0"}`}>
        {refreshing ? (
          <>
            <Loader2 size={14} className="animate-spin text-cyan-400" />
            <span className="text-xs text-gray-300 font-semibold">Refreshing…</span>
          </>
        ) : (
          <>
            <ArrowDown
              size={14}
              className="text-cyan-400 transition-transform"
              style={{ transform: `rotate(${progress * 180}deg)` }}
            />
            <span className="text-xs text-gray-300 font-semibold">
              {progress >= 1 ? "Release to refresh" : "Pull to refresh"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}