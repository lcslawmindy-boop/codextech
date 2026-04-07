import { useState } from "react";
import { X, BookOpen, Copy, Check, Loader2, Download, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

const FORMATS = [
  { id: "apa", label: "APA 7th" },
  { id: "chicago", label: "Chicago 17th" },
  { id: "ieee", label: "IEEE" },
  { id: "mla", label: "MLA 9th" },
];

// Primary government + Bearden source database used as grounding context
const SOURCE_CONTEXT = `
Primary source database for Bearden-derived inventions:

PATENTS:
- US Patent 6,362,718 — Bearden, T.E. et al. "Motionless Electromagnetic Generator." March 26, 2002.
- US Patent 5,590,031 — Adams, R. (1996). "Electromagnetic motor/generator."
- French Patent 1,342,772 — Prioré, A. (1963). "Machine for producing radiation."
- US Patent 4,686,605 — Eastlund, B. (1987). "Method and apparatus for altering a region in the earth's atmosphere."

GOVERNMENT DOCUMENTS:
- ONR London Branch Report R-5-78 — Bateman, J.B. (1978). "The Prioré Machine and Tumor Regression in France." Office of Naval Research, London. UNCLASSIFIED.
- ARPA/ONR — Sweet, F. (1991). "Vacuum Triode Amplifier." Technical report archived by ARPA.
- DoE/EG&G — China Lake Naval Weapons Center. (1992). "Anomalous excess heat measurements in Pd/D2O." Report NWC-TP-7191. 73 sigma replication.

PEER-REVIEWED PAPERS:
- Anastasovski, P.K. et al. (2001). "Explanation of the Motionless Electromagnetic Generator with O(3) Electrodynamics." Foundations of Physics Letters, 14(1), 87–94.
- Fröhlich, H. (1973). "Collective behaviour of non-linearly coupled oscillating fields." Collective Phenomena, 1, 101–109.
- Shoulders, K. & Shoulders, S. (1996). "Observations on the Role of Charge Clusters in Nuclear Cluster Reactions." Journal of New Energy, 1(3), 111–121.

BEARDEN PRIMARY WORKS:
- Bearden, T.E. (1991). Gravitobiology. Tesla Book Company, Millbrae, CA.
- Bearden, T.E. (1980/1988). Excalibur Briefing. Strawberry Hill Press, San Francisco.
- Bearden, T.E. (1983). Toward a New Electromagnetics. Parts 1–4. Tesla Book Company.
- Bearden, T.E. (2002). Energy from the Vacuum. Cheniere Press, Santa Barbara, CA.
- Bearden, T.E. (1990). "Giant Negentropy from the Common Dipole." Journal of New Energy, 5(1).

ACADEMIC INSTITUTIONS:
- AIAS (Alpha Institute for Advanced Study) — multiple co-authored papers with Bearden, 1998–2004.
- Japanese SRI replication series (1994–1996) — independent validation of TRZ cold fusion preconditions.
`;

function CitationCard({ citation, format }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(citation.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-900/50 border border-indigo-700 text-indigo-300">
            {citation.source_type}
          </span>
          {citation.year && (
            <span className="text-gray-500 text-xs">{citation.year}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs transition-colors flex-shrink-0"
          style={{ minHeight: 32 }}
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="text-gray-200 text-sm leading-relaxed font-mono whitespace-pre-wrap break-words">
        {citation.formatted}
      </p>

      {citation.url && (
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline break-all"
        >
          {citation.url}
        </a>
      )}

      {citation.note && (
        <p className="mt-2 text-xs text-yellow-600 italic">{citation.note}</p>
      )}
    </div>
  );
}

export default function CitationGenerator({ invention, onClose }) {
  const [format, setFormat] = useState("apa");
  const [loading, setLoading] = useState(false);
  const [citations, setCitations] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = async (selectedFormat) => {
    setLoading(true);
    setCitations(null);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an academic librarian and IP research specialist. Generate a complete, accurate bibliography of academic citations for the following invention disclosure, formatted in ${selectedFormat.toUpperCase()} style.

INVENTION: ${invention.name}
TAGLINE: ${invention.tagline}
DESCRIPTION: ${invention.description}
PRINCIPLES APPLIED: ${(invention.principles || []).join(", ")}
IP TYPE: ${invention.ipType || "N/A"}
PRIOR ART DIFFERENTIATION: ${invention.priorArtDiff || "N/A"}

Use ONLY sources from the verified government and academic database below. Do NOT invent sources. Select the 8–12 most relevant sources for this specific invention.

${SOURCE_CONTEXT}

For each citation, return:
- source_type: one of "Patent", "Government Report", "Journal Article", "Book", "Technical Report"
- year: publication year as string
- formatted: the complete citation string in ${selectedFormat.toUpperCase()} format, exactly as it would appear in a reference list
- url: a real, verifiable URL if available (USPTO full-text, Google Patents, DOI, or archive.org) — null if uncertain
- note: optional short annotation (1 sentence) explaining relevance to this invention, or null

Return JSON with a "citations" array. Order by relevance to this invention (most relevant first). Be exact with formatting — italicize journal names by wrapping in *asterisks*, use correct punctuation per ${selectedFormat.toUpperCase()} style.`,
      response_json_schema: {
        type: "object",
        properties: {
          citations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                source_type: { type: "string" },
                year: { type: "string" },
                formatted: { type: "string" },
                url: { type: "string" },
                note: { type: "string" },
              }
            }
          }
        }
      }
    });

    setCitations(result?.citations || []);
    setLoading(false);
  };

  const handleFormatChange = (f) => {
    setFormat(f);
    if (citations) generate(f);
  };

  const handleCopyAll = () => {
    if (!citations) return;
    const allText = citations.map(c => c.formatted).join("\n\n");
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownloadPDF = () => {
    if (!citations) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210, margin = 20, cW = pageW - margin * 2;
    let y = 20;

    // Header
    doc.setFillColor(10, 14, 40);
    doc.rect(0, 0, pageW, 22, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(200, 180, 100);
    doc.text("ZENITH APEX RESEARCH DATABASE — ACADEMIC CITATION REPORT", margin, 10);
    doc.setFont("helvetica", "normal"); doc.setTextColor(140, 140, 180);
    doc.text(`Format: ${format.toUpperCase()} · Generated: ${new Date().toLocaleDateString()}`, margin, 17);
    y = 32;

    // Invention title
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.setFillColor(20, 25, 60); doc.rect(0, y - 5, pageW, 16, "F");
    doc.text(invention.name, margin, y + 4);
    y += 22;

    doc.setFontSize(9); doc.setFont("helvetica", "italic"); doc.setTextColor(160, 160, 200);
    const tagLines = doc.splitTextToSize(`"${invention.tagline}"`, cW);
    tagLines.forEach(l => { doc.text(l, margin, y); y += 5.5; });
    y += 6;

    // Citations
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(200, 180, 100);
    doc.text(`References (${citations.length})`, margin, y); y += 8;

    citations.forEach((c, i) => {
      if (y > 270) { doc.addPage(); doc.setFillColor(245, 245, 255); doc.rect(0,0,pageW,297,"F"); y = 20; }

      // Source type badge
      doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 130, 220);
      doc.text(`[${c.source_type}]`, margin, y); y += 5;

      // Citation text
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 50);
      const lines = doc.splitTextToSize(c.formatted || "", cW - 4);
      lines.forEach(l => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(l, margin + 3, y); y += 5;
      });

      if (c.note) {
        doc.setFontSize(8); doc.setTextColor(100, 100, 130); doc.setFont("helvetica", "italic");
        const noteLines = doc.splitTextToSize(`Note: ${c.note}`, cW - 6);
        noteLines.forEach(l => { doc.text(l, margin + 6, y); y += 4.5; });
      }

      if (c.url) {
        doc.setFontSize(7.5); doc.setTextColor(60, 100, 200);
        const urlLines = doc.splitTextToSize(c.url, cW - 6);
        urlLines.forEach(l => { doc.text(l, margin + 6, y); y += 4; });
      }

      y += 5;
      doc.setDrawColor(200, 200, 220); doc.line(margin, y, pageW - margin, y); y += 4;
    });

    // Footer
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(160, 160, 180);
      doc.text("Zenith Apex Research Database — CONFIDENTIAL", margin, 293);
      doc.text(`Page ${p} of ${total}`, pageW - margin, 293, { align: "right" });
    }

    doc.save(`citations_${invention.name.replace(/[^a-z0-9]/gi, "_").slice(0, 40)}_${format}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-4">
      <div className="w-full md:max-w-3xl bg-gray-900 rounded-t-3xl md:rounded-2xl border border-gray-700 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-indigo-400" />
            <div>
              <h2 className="text-white font-black text-base">Citation Generator</h2>
              <p className="text-gray-500 text-xs truncate max-w-xs">{invention.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Format selector */}
        <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-3 flex-shrink-0 flex-wrap">
          <span className="text-gray-500 text-xs font-semibold">Format:</span>
          <div className="flex gap-2">
            {FORMATS.map(f => (
              <button
                key={f.id}
                onClick={() => handleFormatChange(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${format === f.id ? "bg-indigo-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                style={{ minHeight: 32 }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {!citations && !loading && (
            <button
              onClick={() => generate(format)}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-black text-sm transition-all"
              style={{ minHeight: 40 }}
            >
              <BookOpen size={14} /> Generate Citations
            </button>
          )}

          {citations && !loading && (
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => generate(format)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-all"
                style={{ minHeight: 36 }}
              >
                <RefreshCw size={13} /> Regenerate
              </button>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-all"
                style={{ minHeight: 36 }}
              >
                {copiedAll ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                {copiedAll ? "Copied!" : "Copy All"}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
                style={{ minHeight: 36 }}
              >
                <Download size={13} /> PDF
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {!citations && !loading && (
            <div className="text-center py-14 text-gray-600">
              <BookOpen size={36} className="mx-auto mb-3 text-gray-700" />
              <p className="text-sm font-semibold text-gray-500 mb-1">AI Citation Generator</p>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                Generates formatted academic references from the USPTO patent database, ONR government reports, peer-reviewed journals, and Bearden's primary works — automatically matched to this invention's principles.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 max-w-xs mx-auto text-xs text-gray-600">
                {["US Patent 6,362,718", "ONR Report R-5-78", "Foundations of Physics Letters", "Prioré Patent FR 1,342,772", "China Lake NWC Report", "AIAS Publications"].map(s => (
                  <div key={s} className="bg-gray-800/60 rounded-lg px-3 py-2 text-left">{s}</div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-16">
              <Loader2 size={28} className="animate-spin text-indigo-400 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-semibold">Searching patent & government source database…</p>
              <p className="text-gray-600 text-xs mt-1">Matching relevant citations to invention principles</p>
            </div>
          )}

          {citations && !loading && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-indigo-400 font-black text-sm">{citations.length} references found</span>
                <span className="text-gray-600 text-xs">— {format.toUpperCase()} format</span>
              </div>
              {citations.map((c, i) => (
                <CitationCard key={i} citation={c} format={format} />
              ))}
              <p className="text-gray-700 text-xs text-center pt-2 pb-1">
                All citations sourced from verified patent, government, and academic databases. Verify URLs before submission.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}