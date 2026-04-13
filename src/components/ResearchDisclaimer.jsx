import { AlertTriangle } from "lucide-react";

export default function ResearchDisclaimer({ type = "general" }) {
  const messages = {
    general: "For educational and experimental research purposes only. Not intended for medical use. Do not attempt electrical experiments without proper training. Zenith Apex LLC assumes no liability for injury, property damage, or results.",
    medical: "Third-party experimental results referenced (ONR London Branch Report R-5-78, Kaznacheyev cytopathogenic studies, Prioré animal experiments, Rife mortal oscillatory rate research) are historical research documentation and do not constitute medical claims. This content describes documented experimental outcomes in laboratory settings — not clinical treatments. Consult a licensed physician for any medical decisions.",
    energy: "COP>1 figures reference peer-reviewed publications (Anastasovski et al., Foundations of Physics Letters, 2001; Bohren, Am. J. Phys., 1983; Nikulov, 2002). These are documented experimental and theoretical findings — not commercial performance guarantees. Results may vary based on construction quality, materials, and measurement methodology.",
    bioelectromagnetics: "Bioelectromagnetic research described herein references published Soviet and Western scientific literature including Kaznacheyev (USSR), Lisitsyn (USSR), Priore (France), Rife (USA), and Reich (USA/Austria). Therapeutic applications referenced are experimental and not FDA-approved. Do not use information on this platform to diagnose or treat any medical condition.",
  };

  const copyright = "All third-party works referenced on this platform — including works by Bearden, Tesla, Priore, Rife, Reich, Schauberger, Russell, Mills, LaViolette, Podkletnov, Hutchison, Bohren, Kawai, Moray, Waddington, Evans, Maxwell, and others — remain the exclusive copyright of their respective authors or estates. Content is referenced under the Fair Use doctrine (17 U.S.C. § 107) for educational, research, commentary, and criticism purposes. Zenith Apex LLC claims no ownership of any third-party source material.";

  return (
    <div className="rounded-xl border border-yellow-800/50 bg-yellow-950/20 px-4 py-3 mb-4 space-y-2">
      <div className="flex items-start gap-2">
        <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
        <p className="text-yellow-300/80 text-xs leading-relaxed">
          <span className="font-bold text-yellow-300">Research Disclaimer: </span>
          {messages[type]}
        </p>
      </div>
      <p className="text-gray-600 text-xs leading-relaxed pl-5">
        <span className="font-semibold text-gray-500">© Attribution: </span>
        {copyright}
      </p>
    </div>
  );
}