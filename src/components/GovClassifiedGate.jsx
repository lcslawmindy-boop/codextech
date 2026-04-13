import { Shield, Lock, Mail } from "lucide-react";

/**
 * Gate shown when a user tries to access a government/defense-classified invention.
 * Only accessible to: admin users OR users with the "government" tier.
 */
export default function GovClassifiedGate({ inventionTitle }) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="max-w-lg text-center">
        {/* Badge */}
        <div className="w-24 h-24 rounded-2xl bg-red-950/50 border-2 border-red-700 flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg shadow-red-900/40">
          🔐
        </div>

        {/* Classification banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/40 border border-red-700 mb-5">
          <Shield size={13} className="text-red-400" />
          <span className="text-red-300 font-black text-xs uppercase tracking-widest">
            Classified — Government &amp; Defense Access Only
          </span>
        </div>

        {/* Title */}
        <h2 className="text-white font-black text-2xl mb-3 leading-tight">
          {inventionTitle || "Restricted Research Content"}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          This invention involves directed-energy, psychotronic, scalar weapons, or advanced biodefense applications. Full engineering plans, specifications, and schematics are restricted to <span className="text-red-300 font-semibold">verified government agencies, defense contractors, and cleared research institutions</span>.
        </p>

        {/* What's inside */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 text-left space-y-2">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Requires Government / Defense Access tier:</p>
          {[
            "Full engineering schematics & BOM",
            "Classified source document references",
            "Build protocol & calibration procedures",
            "Downloadable PDF plans",
            "Defense procurement pathway documentation",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
              <Lock size={11} className="text-red-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="mailto:admin@zenithapex.com?subject=Government%2FDefense%20Access%20Request&body=Organization%3A%0AVerification%20Type%20(government%2Fdefense%20contractor%2Funiversity%20research)%3A%0AInterest%20area%3A%0A"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-white text-sm bg-red-800 hover:bg-red-700 transition-all"
        >
          <Mail size={15} />
          Request Classified Access
        </a>

        <p className="text-gray-700 text-xs mt-4 leading-relaxed">
          Approved entities: DoD / DARPA affiliated programs, cleared defense contractors (ITAR), SBIR Phase II awardees, national laboratory partners, and vetted academic security research programs. NDA + institutional verification required.
        </p>
      </div>
    </div>
  );
}