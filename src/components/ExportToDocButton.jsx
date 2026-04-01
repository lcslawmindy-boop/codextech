import { useState } from "react";
import { FileText, Loader2, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ExportToDocButton({ node, aiSummary }) {
  const [loading, setLoading] = useState(false);
  const [docUrl, setDocUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setDocUrl(null);
    const res = await base44.functions.invoke("generateResearchDoc", { node, aiSummary });
    if (res.data?.url) {
      setDocUrl(res.data.url);
    } else {
      setError(res.data?.error || "Export failed");
    }
    setLoading(false);
  };

  if (docUrl) {
    return (
      <a
        href={docUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700 text-blue-300 text-xs transition-colors"
      >
        <ExternalLink size={11} />
        Open Doc
      </a>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleExport}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700 text-blue-300 text-xs transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={11} className="animate-spin" /> : <FileText size={11} />}
        {loading ? "Exporting…" : "Export to Doc"}
      </button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}