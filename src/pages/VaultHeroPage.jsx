import { Link } from "react-router-dom";
import NeonVaultHero from "@/components/NeonVaultHero";
import { ArrowRight } from "lucide-react";

export default function VaultHeroPage() {
  return (
    <div className="w-full min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Vault Background */}
      <NeonVaultHero />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center max-w-2xl mx-auto z-10">
          {/* Logo */}
          <div className="mb-8 pointer-events-auto">
            <img 
              src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/822a7737e_CODEXTECHLOGO.png"
              alt="C.O.D.E.X.T.E.C.H."
              className="h-24 w-24 mx-auto object-contain drop-shadow-lg"
              style={{
                filter: "drop-shadow(0 0 20px rgba(0, 217, 255, 0.5))"
              }}
            />
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl font-black leading-[1.1] mb-6 drop-shadow-lg">
            Unlock the
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Research Archive
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed">
            40+ patents. 200+ peer-reviewed publications. Complete engineering frameworks. 
            Institutional-grade research access.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
            <Link
              to="/research-brief"
              className="px-10 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black transition-all shadow-lg hover:shadow-xl hover:shadow-cyan-500/50"
            >
              Get Free Research Brief
            </Link>
            <Link
              to="/research-membership"
              className="px-10 py-4 rounded-xl border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 font-bold transition-all"
            >
              View Membership
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row gap-8 justify-center text-sm text-gray-400">
            <div>✓ 40+ Analyzed Patents</div>
            <div>✓ Primary Source Citations</div>
            <div>✓ Institutional Access</div>
          </div>
        </div>
      </div>
    </div>
  );
}