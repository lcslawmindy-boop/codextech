import { useState } from "react";
import { FileText, ChevronRight, ChevronLeft, Download, CheckCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";

const STEPS = ["Select Dossier", "Edit Claims", "Edit Description", "Review & Export"];

export default function PatentDraftWorkflow({ inventions = [] }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [claims, setClaims] = useState([]);
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [background, setBackground] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [exported, setExported] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectInvention = (inv) => {
    setSelected(inv);
    // Pre-populate from dossier data
    setTitle(inv.hybrid_concept || "");
    const rawClaims = inv.patent_claims
      ? (Array.isArray(inv.patent_claims) ? inv.patent_claims : inv.patent_claims.split(/\n|\d+\.\s/).filter(Boolean))
      : [""];
    setClaims(rawClaims);
    setAbstract(inv.description || inv.synergy_analysis || "");
    setBackground(`This invention relates to ${inv.hybrid_concept || "the described technology"}. The field of the invention encompasses ${inv.market_applications || "multiple application domains"}.`);
    setDetailedDesc(inv.mechanism || inv.technical_integration || "");
  };

  const addClaim = () => setClaims([...claims, ""]);
  const removeClaim = (i) => setClaims(claims.filter((_, idx) => idx !== i));
  const updateClaim = (i, val) => setClaims(claims.map((c, idx) => idx === i ? val : c));

  const handleExport = () => { // synchronous client-side PDF
    setLoading(true);
    setError(null);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
      const pageW = 216;
      const pageH = 279;
      const marginL = 20;
      const textW = 176;
      let y = 20;

      const addPage = () => { doc.addPage(); y = 20; };

      const writeText = (text, size, bold, color = [20, 20, 35], indent = 0) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text || "", textW - indent);
        lines.forEach(line => {
          if (y > pageH - 20) addPage();
          doc.text(line, marginL + indent, y);
          y += size * 0.42;
        });
        y += 3;
      };

      const sectionHeader = (label) => {
        if (y > pageH - 30) addPage();
        doc.setFillColor(30, 30, 50);
        doc.rect(marginL, y, textW, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(label, marginL + 4, y + 5.5);
        y += 13;
      };

      // Cover
      doc.setFillColor(240, 240, 248);
      doc.roundedRect(marginL, y, textW, 32, 2, 2, "F");
      doc.setTextColor(50, 50, 80);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("UNITED STATES PATENT AND TRADEMARK OFFICE", pageW / 2, y + 10, { align: "center" });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("PROVISIONAL PATENT APPLICATION — 35 U.S.C. § 111(b)", pageW / 2, y + 17, { align: "center" });
      doc.text(`Filing Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageW / 2, y + 24, { align: "center" });
      y += 38;

      writeText(title.toUpperCase(), 14, true, [20, 20, 40]);
      y += 5;

      sectionHeader("ABSTRACT");
      writeText(abstract, 9.5, false);

      sectionHeader("BACKGROUND OF THE INVENTION");
      writeText(background, 9.5, false);

      sectionHeader("DETAILED DESCRIPTION OF THE INVENTION");
      writeText(detailedDesc, 9.5, false);

      sectionHeader("CLAIMS");
      claims.filter(c => c.trim()).forEach((claim, i) => {
        writeText(`${i + 1}. ${claim}`, 9, false, [20, 20, 50], 0);
        y += 2;
      });

      sectionHeader("INVENTOR'S DECLARATION");
      writeText("I hereby declare that I am the original inventor of the subject matter claimed herein and authorize the filing of this provisional patent application.", 9, false);
      y += 10;
      doc.setDrawColor(120, 120, 130);
      doc.setLineWidth(0.3);
      doc.line(marginL, y, marginL + 80, y);
      doc.line(marginL + 100, y, marginL + 176, y);
      y += 4;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 110);
      doc.text("Inventor Signature", marginL, y);
      doc.text("Date", marginL + 100, y);

      const filename = `${title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 40)}_patent_draft.pdf`;
      doc.save(filename);
      setExported(true);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const canNext = () => {
    if (step === 0) return !!selected;
    if (step === 1) return claims.filter(c => c.trim()).length > 0;
    if (step === 2) return title.trim() && abstract.trim();
    return true;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FileText size={22} className="text-blue-400" />
        <div>
          <h3 className="text-white font-black text-xl">Patent Draft Workflow</h3>
          <p className="text-gray-500 text-xs">Formalize your invention dossier into a structured patent draft</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-black flex-shrink-0 transition-all ${i < step ? "bg-green-600 text-white" : i === step ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-500"}`}>
              {i < step ? <CheckCircle size={14} /> : i + 1}
            </div>
            <div className="flex flex-col ml-2 flex-1">
              <span className={`text-xs font-bold ${i === step ? "text-white" : i < step ? "text-green-400" : "text-gray-600"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-px w-4 flex-shrink-0 mr-2 ${i < step ? "bg-green-600" : "bg-gray-700"}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-64">

        {/* Step 0: Select */}
        {step === 0 && (
          <div>
            <p className="text-gray-400 text-sm mb-4">Choose an invention dossier to formalize into a patent draft:</p>
            {inventions.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <FileText size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No saved invention dossiers found.</p>
                <p className="text-xs mt-1">Generate and save a dossier first using the Invention Dossier Generator above.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {inventions.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => handleSelectInvention(inv)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selected?.id === inv.id ? "border-blue-500 bg-blue-950/30" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">{inv.hybrid_concept || "Unnamed Invention"}</p>
                        <p className="text-gray-400 text-xs mt-1">{inv.description?.substring(0, 100) || "No description"}...</p>
                        <div className="flex gap-2 mt-2">
                          {inv.synergy_score && <span className="px-2 py-0.5 rounded-full bg-cyan-900/40 border border-cyan-800 text-cyan-300 text-xs">Score: {inv.synergy_score}</span>}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${inv.status === "filed" ? "bg-green-900/40 border border-green-800 text-green-300" : "bg-gray-800 border border-gray-700 text-gray-400"}`}>{inv.status || "draft"}</span>
                        </div>
                      </div>
                      {selected?.id === inv.id && <CheckCircle size={18} className="text-blue-400 flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 1: Edit Claims */}
        {step === 1 && (
          <div>
            <p className="text-gray-400 text-sm mb-4">Review and edit the patent claims. Each claim should be a distinct, independently patentable feature.</p>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {claims.map((claim, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-gray-500 text-xs font-bold mt-3 w-6 flex-shrink-0">{i + 1}.</span>
                  <textarea
                    value={claim}
                    onChange={(e) => updateClaim(i, e.target.value)}
                    rows={3}
                    placeholder={`Claim ${i + 1}...`}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <button onClick={() => removeClaim(i)} className="mt-2 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addClaim} className="mt-3 flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors">
              <Plus size={14} /> Add Claim
            </button>
          </div>
        )}

        {/* Step 2: Edit Description */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Patent Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="Title of Invention"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Abstract</label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                placeholder="A brief summary of the invention..."
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Background of the Invention</label>
              <textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Prior art and technical field..."
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Detailed Description</label>
              <textarea
                value={detailedDesc}
                onChange={(e) => setDetailedDesc(e.target.value)}
                rows={5}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Detailed technical description of the invention..."
              />
            </div>
          </div>
        )}

        {/* Step 3: Review & Export */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Title</p>
              <p className="text-white font-bold">{title}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-500 text-xs uppercase font-bold mb-2">Claims ({claims.filter(c => c.trim()).length})</p>
              <ol className="space-y-1 list-decimal list-inside">
                {claims.filter(c => c.trim()).map((c, i) => (
                  <li key={i} className="text-gray-300 text-sm">{c.substring(0, 80)}{c.length > 80 ? "..." : ""}</li>
                ))}
              </ol>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Abstract</p>
              <p className="text-gray-300 text-sm">{abstract.substring(0, 200)}{abstract.length > 200 ? "..." : ""}</p>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {exported ? (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-900/30 border border-green-700 text-green-300">
                <CheckCircle size={18} /> Patent draft exported successfully!
              </div>
            ) : (
              <button
                onClick={handleExport}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Generating PDF...</> : <><Download size={16} /> Export Patent Draft (PDF)</>}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-800">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white font-bold text-sm transition-colors">
            <ChevronLeft size={14} /> Back
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all disabled:opacity-40 ml-auto"
          >
            Next <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}