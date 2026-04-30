import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

/**
 * Renders a "Download Executive Summary" button for a patent/prior-art entry.
 * Pass the full patent object (from PRIOR_ART_ARCHIVE or PriorArtEntry entity).
 */
export default function PatentSummaryButton({ patent, className = "" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await base44.functions.invoke("exportPatentSummary", { patent });

      // The function returns raw PDF bytes via axios; handle as blob
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeTitle = (patent.title || "patent").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
      a.href = url;
      a.download = `${safeTitle}-executive-summary.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
      setError("Download failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white text-sm font-bold transition-colors ${className}`}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
        {loading ? "Generating PDF…" : "Download Executive Summary"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}