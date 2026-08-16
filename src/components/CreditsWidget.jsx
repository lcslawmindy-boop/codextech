import { Link } from "react-router-dom";
import { Coins, Plus } from "lucide-react";
import { useCredits } from "../hooks/useCredits";

// Compact credit-balance chip with a buy-credits link. Drop into headers/navs.
export default function CreditsWidget({ compact = false }) {
  const { balance, loading } = useCredits();

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-500">
        <Coins size={12} className="animate-pulse" /> …
      </div>
    );
  }

  return (
    <Link
      to="/pricing"
      className={`flex items-center gap-1.5 rounded-lg bg-amber-950/40 border border-amber-700/50 text-amber-300 hover:bg-amber-900/40 transition-colors ${compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs"} font-bold`}
      title="Research credits — click to buy more"
    >
      <Coins size={12} />
      <span className="font-mono">{balance ?? 0}</span>
      <span className="text-amber-500/70 hidden sm:inline">credits</span>
      <Plus size={10} className="text-amber-400" />
    </Link>
  );
}