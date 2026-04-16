import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Loader2, Download, Copy, CheckCircle2, AlertTriangle, Zap, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";
import { hasTrialToken, consumeTrialToken, TRIAL_FEATURES } from "../lib/trialTokens";

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-500 hover:text-gray-300 text-xs transition-all">
      {copied ? <CheckCircle2 size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function exportClaimsPDF(result, inventionTitle) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 18, cW = W - M * 2;
  let y = 20;

  doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 5, "F");

  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
  doc.text("Patent Claims Generation Report", M, 24);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text(`Invention: ${inventionTitle} · Generated ${new Date().toLocaleDateString()}`, M, 31);
  y = 45;

  // Independent Claims
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(212, 175, 55);
  doc.text("INDEPENDENT CLAIMS", M, y); y += 8;
  result.independent_claims?.forEach(claim => {
    if (y > 270) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(200, 210, 230);
    doc.text(`Claim ${claim.claim_number} (${claim.scope_breadth})`, M, y); y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(190, 200, 220);
    const lines = doc.splitTextToSize(claim.text, cW - 4);
    lines.forEach(line => {
      if (y > 280) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
      doc.text(line, M + 2, y); y += 5;
    });
    y += 3;
  });

  y += 5;
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(212, 175, 55);
  doc.text("DEPENDENT CLAIMS", M, y); y += 8;
  result.dependent_claims?.slice(0, 10).forEach(claim => {
    if (y > 270) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(200, 210, 230);
    doc.text(`Claim ${claim.claim_number} (depends on ${claim.depends_on})`, M, y); y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(190, 200, 220);
    const lines = doc.splitTextToSize(claim.text, cW - 4);
    lines.forEach(line => {
      if (y > 280) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
      doc.text(line, M + 2, y); y += 5;
    });
    y += 3;
  });

  // Novelty Analysis
  y += 5;
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(212, 175, 55);
  doc.text("NOVELTY ANALYSIS", M, y); y += 8;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(190, 200, 220);
  if (result.novelty_analysis?.core_novelty) {
    const lines = doc.splitTextToSize(`Core Novelty: ${result.novelty_analysis.core_novelty}`, cW);
    lines.forEach(line => {
      if (y > 280) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
      doc.text(line, M, y); y += 5;
    });
  }

  // Prior Art Risks
  if (result.prior_art_risks?.length > 0) {
    y += 5;
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(212, 175, 55);
    doc.text("PRIOR ART RISKS", M, y); y += 8;
    result.prior_art_risks.forEach(risk => {
      if (y > 270) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(risk.risk_level === "critical" ? "#ef4444" : risk.risk_level === "high" ? "#f59e0b" : "#6b7280");
      doc.text(`${risk.risk_level.toUpperCase()}: ${risk.issue}`, M, y); y += 5;
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(190, 200, 220);
      const mitLines = doc.splitTextToSize(`Mitigation: ${risk.mitigation}`, cW - 4);
      mitLines.forEach(line => {
        if (y > 280) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
        doc.text(line, M + 2, y); y += 4;
      });
      y += 2;
    });
  }

  doc.save(`PatentClaims_${inventionTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
}

export default function PatentClaimsGenerator() {
  const [inventionTitle, setInventionTitle] = useState("");
  const [technicalDescription, setTechnicalDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [tokenAvailable, setTokenAvailable] = useState(true);
  const [tokenUsed, setTokenUsed] = useState(false);

  useEffect(() => {
    setTokenAvailable(hasTrialToken(TRIAL_FEATURES.patent_claims));
  }, []);

  const handleGenerate = async () => {
    if (!inventionTitle.trim() || !technicalDescription.trim()) {
      setError("Please fill in both invention title and technical description");
      return;
    }
    if (!tokenAvailable) return;
    consumeTrialToken(TRIAL_FEATURES.patent_claims);
    setTokenAvailable(false);
    setTokenUsed(true);

    setGenerating(true);
    setError(null);

    try {
      const response = await base44.functions.invoke("generatePatentClaims", {
        invention_title: inventionTitle,
        technical_description: technicalDescription
      });

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.error || "Failed to generate claims");
      }
    } catch (err) {
      setError(err.message || "Error generating claims");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/patent-tool" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <FileText size={14} className="text-green-400" /> Patent Claims Generator
            </h1>
            <p className="text-gray-500 text-xs">USPTO-compliant independent & dependent claims with novelty & prior art analysis</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Invention Title *</label>
                <input
                  value={inventionTitle}
                  onChange={e => setInventionTitle(e.target.value)}
                  placeholder="e.g., Quantum-Enhanced EM Field Resonator"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-600 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Technical Description *</label>
                <textarea
                  value={technicalDescription}
                  onChange={e => setTechnicalDescription(e.target.value)}
                  placeholder="Describe the technical details, mechanism, components, and how it works in detail..."
                  rows={8}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-600 placeholder-gray-600 resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-3">
                  <p className="text-red-300 text-xs">{error}</p>
                </div>
              )}

              {!tokenAvailable && !tokenUsed ? (
                <div className="bg-indigo-950/40 border border-indigo-700/60 rounded-xl p-4 text-center">
                  <Lock size={18} className="text-indigo-400 mx-auto mb-2" />
                  <p className="text-indigo-300 font-bold text-sm mb-1">1× Free Trial Used</p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">Your beta trial token for the Patent Claims Generator has been used. Upgrade to Researcher to generate unlimited claims.</p>
                  <Link to="/pricing" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-black text-sm transition-all">
                    Upgrade to Researcher — $97/mo
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {tokenAvailable && !tokenUsed && (
                    <div className="flex items-center gap-2 bg-green-950/30 border border-green-800/50 rounded-xl px-3 py-2">
                      <Zap size={12} className="text-green-400 flex-shrink-0" />
                      <p className="text-green-300 text-xs font-semibold">1× Free Beta Trial — generate once, then upgrade to unlock unlimited.</p>
                    </div>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !inventionTitle.trim() || !technicalDescription.trim()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-600 disabled:opacity-40 text-white font-black text-base flex items-center justify-center gap-2 transition-all shadow-[0_4px_24px_rgba(34,197,94,0.25)]">
                    {generating ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                    {generating ? "Generating Claims…" : "Generate Patent Claims"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {!result && !generating && (
              <div className="flex flex-col items-center justify-center h-full min-h-96 border border-gray-800 border-dashed rounded-2xl text-center px-8">
                <FileText size={40} className="text-gray-800 mb-4" />
                <p className="text-gray-600 font-bold text-sm mb-1">Generate Patent Claims</p>
                <p className="text-gray-700 text-xs">Provide invention details to generate USPTO-compliant claims with novelty analysis and prior art risk assessment.</p>
              </div>
            )}

            {generating && (
              <div className="flex flex-col items-center justify-center h-96 border border-green-900/30 rounded-2xl">
                <Loader2 size={32} className="text-green-400 animate-spin mb-3" />
                <p className="text-gray-400 text-sm">Analyzing invention and drafting claims…</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Compliance Check */}
                {result.upto_compliance_check && (
                  <div className={`border rounded-2xl p-4 ${result.upto_compliance_check.is_compliant ? "bg-green-950/20 border-green-800/50" : "bg-yellow-950/20 border-yellow-800/50"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={16} className={result.upto_compliance_check.is_compliant ? "text-green-400" : "text-yellow-400"} />
                      <p className={`text-xs font-black uppercase tracking-wider ${result.upto_compliance_check.is_compliant ? "text-green-400" : "text-yellow-400"}`}>
                        {result.upto_compliance_check.is_compliant ? "USPTO Compliant" : "Compliance Issues"}
                      </p>
                    </div>
                    {result.upto_compliance_check.recommendations?.map((rec, i) => (
                      <p key={i} className="text-gray-300 text-xs leading-relaxed mt-1">✓ {rec}</p>
                    ))}
                  </div>
                )}

                {/* Prior Art Risks */}
                {result.prior_art_risks?.length > 0 && (
                  <div className="bg-red-950/20 border border-red-800/50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={16} className="text-red-400" />
                      <p className="text-red-400 text-xs font-black uppercase tracking-wider">Prior Art Risks</p>
                    </div>
                    <div className="space-y-2">
                      {result.prior_art_risks.map((risk, i) => (
                        <div key={i} className="bg-gray-900/40 rounded p-2">
                          <p className="text-xs font-bold text-red-300 mb-1">{risk.risk_level.toUpperCase()}: {risk.issue}</p>
                          <p className="text-xs text-gray-400">Mitigation: {risk.mitigation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Novelty Analysis */}
                {result.novelty_analysis && (
                  <div className="bg-blue-950/20 border border-blue-800/50 rounded-2xl p-4">
                    <p className="text-blue-400 text-xs font-black uppercase tracking-wider mb-2">Novelty Analysis</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{result.novelty_analysis.core_novelty}</p>
                  </div>
                )}

                {/* Claims Summary */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Generated Claims</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-bold text-sm">{result.independent_claims?.length || 0} Independent</p>
                      <p className="text-gray-600 text-xs">Broadest to narrow scope</p>
                    </div>
                    <div>
                      <p className="text-green-400 font-bold text-sm">{result.dependent_claims?.length || 0} Dependent</p>
                      <p className="text-gray-600 text-xs">Additional limitations</p>
                    </div>
                  </div>
                </div>

                {/* Export Button */}
                <button
                  onClick={() => exportClaimsPDF(result, inventionTitle)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-800 hover:bg-green-700 text-white font-black text-sm transition-all">
                  <Download size={14} /> Export PDF Report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Claims Display */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Independent Claims */}
            {result.independent_claims?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800 bg-green-950/20">
                  <p className="text-green-400 text-xs font-black uppercase tracking-widest">Independent Claims</p>
                </div>
                <div className="p-5 space-y-4">
                  {result.independent_claims.map(claim => (
                    <div key={claim.claim_number} className="border border-gray-800 rounded-xl p-4 bg-gray-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-green-400 font-bold text-sm">Claim {claim.claim_number}</p>
                        <CopyBtn text={claim.text} />
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed font-mono">{claim.text}</p>
                      <p className="text-gray-600 text-xs mt-2 capitalize">Scope: {claim.scope_breadth}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dependent Claims */}
            {result.dependent_claims?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800 bg-blue-950/20">
                  <p className="text-blue-400 text-xs font-black uppercase tracking-widest">Dependent Claims ({result.dependent_claims.length})</p>
                </div>
                <div className="p-5 space-y-4">
                  {result.dependent_claims.slice(0, 8).map(claim => (
                    <div key={claim.claim_number} className="border border-gray-800 rounded-xl p-4 bg-gray-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-blue-400 font-bold text-sm">Claim {claim.claim_number} (depends on claim {claim.depends_on})</p>
                        <CopyBtn text={claim.text} />
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed font-mono">{claim.text}</p>
                    </div>
                  ))}
                  {result.dependent_claims.length > 8 && (
                    <p className="text-gray-500 text-xs italic text-center pt-2">+{result.dependent_claims.length - 8} more dependent claims (view full PDF for all)</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}