import { useState, useEffect } from "react";
import { Shield, Lock, CheckCircle2, AlertCircle, FileText } from "lucide-react";

const NDA_KEY = "apex_nda_accepted_v1";
const LEGACY_NDA_KEY = "bearden_nda_accepted";

const NDA_TEXT = `CONFIDENTIALITY & NON-DISCLOSURE AGREEMENT — MEDBED ENGINEERING DOCUMENTS

This Agreement governs access to the AATCS-P1, ZDS-PTSD-1, and AuraWell MedBed engineering documentation, including build plans, bills of materials, assembly manuals, and technical specifications.

By accepting below, you agree:

1. All engineering documentation is confidential and proprietary to Zenith Apex LLC.
2. Build plans are for research and educational purposes only — not for commercial manufacture without written consent.
3. You will not redistribute, reverse-engineer, or commercially exploit these specifications.
4. Device designs are conceptual — subject to manufacturer validation and FDA/regulatory approval.
5. This Agreement remains in effect for three (3) years from the date of acceptance.

Unauthorized distribution violates trade secret protections under applicable law.`;

/**
 * NDA gate for the MedbedShowcase page.
 * Checks both the current and legacy localStorage keys.
 * Shows NDA acceptance overlay if not yet accepted.
 */
export default function MedbedNdaGate({ children }) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = localStorage.getItem(NDA_KEY) === "true";
    const legacy = localStorage.getItem(LEGACY_NDA_KEY);
    const legacyAccepted = legacy && JSON.parse(legacy)?.accepted === true;
    if (current || legacyAccepted) {
      // Normalize to current key
      localStorage.setItem(NDA_KEY, "true");
      setAccepted(true);
    }
    setLoading(false);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(NDA_KEY, "true");
    localStorage.setItem(LEGACY_NDA_KEY, JSON.stringify({ accepted: true, version: "1.0" }));
    setAccepted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!accepted) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          {/* Lock header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-900/30 border border-amber-700 mb-4">
              <Lock size={28} className="text-amber-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">NDA Required</h1>
            <p className="text-gray-500 text-sm">
              Accept the confidentiality agreement to access MedBed engineering documentation
            </p>
          </div>

          {/* NDA text */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
              <FileText size={14} className="text-gray-400" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                Confidentiality Agreement
              </span>
            </div>
            <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
              {NDA_TEXT}
            </div>
          </div>

          {/* Accept button */}
          <button
            onClick={handleAccept}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black text-sm transition-all flex items-center justify-center gap-2"
          >
            <Shield size={16} /> I Agree — Access Engineering Docs
          </button>

          <p className="text-center text-gray-600 text-xs mt-3">
            ✓ Agreement recorded electronically · Trade secret protected
          </p>
        </div>
      </div>
    );
  }

  return children;
}