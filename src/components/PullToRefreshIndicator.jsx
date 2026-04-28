import { RefreshCw } from "lucide-react";

/**
 * Visual indicator for pull-to-refresh gesture.
 * @param {number} pullY  - 0 to 1 progress
 * @param {boolean} refreshing - whether refresh is in progress
 */
export default function PullToRefreshIndicator({ pullY, refreshing }) {
  if (pullY === 0 && !refreshing) return null;

  const translateY = refreshing ? 0 : (pullY - 1) * 48;
  const opacity = refreshing ? 1 : pullY;
  const rotate = refreshing ? undefined : `${pullY * 360}deg`;

  return (
    <div
      className="absolute top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
      style={{ transform: `translateY(${translateY}px)`, opacity, transition: refreshing ? "all 0.2s" : "none" }}
    >
      <div className="mt-2 w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shadow-lg">
        <RefreshCw
          size={16}
          className={`text-cyan-400 ${refreshing ? "animate-spin" : ""}`}
          style={!refreshing ? { transform: `rotate(${rotate})` } : undefined}
        />
      </div>
    </div>
  );
}