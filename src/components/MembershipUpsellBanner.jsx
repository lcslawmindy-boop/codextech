import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function MembershipUpsellBanner() {
  return (
    <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-b border-cyan-700/50 px-6 py-4 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TrendingUp size={18} className="text-cyan-400 flex-shrink-0" />
          <div>
            <p className="text-white font-black text-sm">📦 Membership: $49/mo</p>
            <p className="text-cyan-300 text-xs">3 courses + 3 build plans included, plus 1 new of each every month</p>
          </div>
        </div>
        <Link to="/research-membership"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs whitespace-nowrap transition-colors flex-shrink-0">
          Learn More <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}