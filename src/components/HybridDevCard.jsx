import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { generateHybridDevPackagePdf } from "@/lib/generateHybridDevPackagePdf";

export default function HybridDevCard({ dev }) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 30));
    generateHybridDevPackagePdf([dev], `${dev.id}_Development_Package.pdf`);
    setBusy(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col">
      <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-1">{dev.source}</p>
      <h3 className="text-white font-bold text-sm leading-snug mb-2">{dev.name}</h3>
      <p className="text-gray-400 text-xs leading-relaxed mb-3">{dev.fusion}</p>
      <p className="text-gray-500 text-[11px] mb-1">{dev.components.length} subsystems · {dev.patentClaims.length} draft claims</p>
      <p className="text-gray-500 text-[11px] mb-4">Advisory valuation: {dev.valuation}</p>
      <button
        onClick={download}
        disabled={busy}
        className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 text-white text-xs font-bold disabled:opacity-60"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
        PRD · PDR · BOM · SOW · EVT/DVT PDF
      </button>
    </div>
  );
}