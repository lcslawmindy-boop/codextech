import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, Loader2, CheckCircle2, Package } from "lucide-react";
import ScalarHealingExplodedView from "@/components/ScalarHealingExplodedView";
import BrainHealingExplodedView from "@/components/BrainHealingExplodedView";
import VPOAnenergyPump3D from "@/components/VPOAnenergyPump3D";
import ScalarGridNode3D from "@/components/ScalarGridNode3D";
import { generateMasterInvestorPdf } from "@/lib/masterInvestorPdf";

const DEVICE_CODES = ["ZA-PRI-001", "ZA-BRH-002", "ZA-VPO-003", "ZA-GRD-004"];

export default function InvestorMasterPackage() {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState("");
  const renderZoneRef = useRef(null);

  // Render all 4 devices in a hidden zone so their WebGL canvases exist for capture
  const [showDevices, setShowDevices] = useState(false);

  useEffect(() => {
    // Mount devices immediately so canvases are ready
    setShowDevices(true);
  }, []);

  const captureCanvases = () => {
    const images = {};
    const canvases = renderZoneRef.current?.querySelectorAll("canvas") || [];
    canvases.forEach((canvas, i) => {
      try {
        images[DEVICE_CODES[i]] = canvas.toDataURL("image/png");
      } catch (e) {
        // WebGL canvas may need preserveDrawingBuffer — skip if fails
      }
    });
    return images;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setDone(false);
    setProgress("Capturing 3D device renderings...");

    // Wait for WebGL canvases to render
    await new Promise((r) => setTimeout(r, 2500));

    setProgress("Compiling master investor package...");
    await new Promise((r) => setTimeout(r, 200));

    const deviceImages = captureCanvases();

    setProgress("Generating PDF document...");
    await new Promise((r) => setTimeout(r, 200));

    const doc = generateMasterInvestorPdf(deviceImages);

    setProgress("Finalizing download...");
    await new Promise((r) => setTimeout(r, 200));

    doc.save("Aethon-Apex-Master-Investor-Package.pdf");

    setGenerating(false);
    setDone(true);
    setProgress("");
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-purple-950/20 to-cyan-950/20 border-b border-gray-800 px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/light-timeline-devices" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={14} /> Light Timeline Devices
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-purple-400" />
            <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">Master Investor Package · PDF Export</span>
          </div>
          <h1 className="text-3xl font-black">Aethon Apex — Master Investor & Grant Package</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-3xl">
            One comprehensive PDF compiling the complete technical, engineering, and IP dossier: dark & light timelines,
            3D device CAD renderings, PRD, PDR, BOM, SOW, EVT assembly manual, technology research, draft patent claims,
            trade secrets, and a 5-year roadmap to market.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Download card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-900/30 border border-purple-700 flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black">Complete Investor Dossier</h2>
              <p className="text-gray-400 text-sm mt-1">
                42-page comprehensive PDF document with all sections compiled and formatted for investor and grant review.
              </p>
            </div>
          </div>

          {/* Contents grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {[
              "Executive Summary", "Dark Timeline (2026–2050)", "Light Timeline (2026–2050)",
              "Technology Overview", "Research Foundation", "4× Device 3D CAD Renderings",
              "PRD (Product Requirements)", "PDR (Design Review)", "BOM (28 line items)",
              "SOW (Statement of Work)", "EVT Assembly Manual", "10 Draft Patent Claims",
              "6 Trade Secrets", "5-Year Market Roadmap", "Investment Summary",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs">
                <CheckCircle2 size={11} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>

          {/* Generate button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {progress || "Generating..."}
                </>
              ) : done ? (
                <>
                  <CheckCircle2 size={16} />
                  Downloaded — Generate Again?
                </>
              ) : (
                <>
                  <Download size={16} />
                  Generate Master PDF
                </>
              )}
            </button>
            <div className="text-xs text-gray-500">
              {generating ? "This takes ~5 seconds to render 3D devices and compile the document." : "PDF will download automatically when ready."}
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { val: "42", label: "PDF Pages", color: "text-purple-400" },
            { val: "4", label: "3D Device Renderings", color: "text-cyan-400" },
            { val: "10", label: "Patent Claims", color: "text-red-400" },
            { val: "28", label: "BOM Line Items", color: "text-green-400" },
            { val: "$31.7M", label: "5-Year Budget", color: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl bg-yellow-950/20 border border-yellow-800/40 px-5 py-3 mb-6">
          <p className="text-yellow-200/70 text-xs leading-relaxed">
            <span className="font-bold text-yellow-300">Research & Experimental:</span> All concepts derived from published works
            attributed to their original authors (Bearden, Prioré, Rife, Reich, Schauberger, Moray, et al.) under Fair Use
            (17 U.S.C. § 107). Devices are research prototypes — not for clinical diagnostic or therapeutic use without IRB
            approval and regulatory clearance. Patent claims are drafts prepared for provisional filing — not legal advice.
          </p>
        </div>

        {/* Hidden render zone for 3D device canvas capture */}
        {showDevices && (
          <div
            ref={renderZoneRef}
            className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none"
            aria-hidden="true"
            style={{ width: "600px", height: "480px" }}
          >
            <div style={{ width: "600px", height: "480px" }}>
              <ScalarHealingExplodedView />
            </div>
            <div style={{ width: "600px", height: "480px" }}>
              <BrainHealingExplodedView />
            </div>
            <div style={{ width: "600px", height: "480px" }}>
              <VPOAnenergyPump3D />
            </div>
            <div style={{ width: "600px", height: "480px" }}>
              <ScalarGridNode3D />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}