import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Loader2, Layers } from "lucide-react";
import { HYBRID_DEVICES } from "@/lib/hybridDevices";
import { generateHybridDevPackagePdf } from "@/lib/generateHybridDevPackagePdf";
import HybridDevCard from "@/components/HybridDevCard";

export default function HybridDevPackages() {
  const [busy, setBusy] = useState(false);

  const downloadAll = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 30));
    generateHybridDevPackagePdf(HYBRID_DEVICES, "Hybrid_Devices_Development_Packages_All.pdf");
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-5 py-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/rd-sandbox" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4">
          <ArrowLeft size={14} /> R&D Sandbox
        </Link>
        <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2"><Layers size={18} className="text-cyan-400" /> Hybrid Device Development Packages</h1>
            <p className="text-gray-500 text-xs mt-1">Engineering PRD, PDR, BOM, SOW and EVT/DVT/PVT test plan for each hybrid device, with falsification gates.</p>
          </div>
          <button
            onClick={downloadAll}
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-sm font-bold disabled:opacity-60"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Download all {HYBRID_DEVICES.length} (one PDF)
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HYBRID_DEVICES.map((d) => <HybridDevCard key={d.id} dev={d} />)}
        </div>
      </div>
    </div>
  );
}