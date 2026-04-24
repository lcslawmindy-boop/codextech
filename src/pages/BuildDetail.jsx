import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Lock, ShoppingCart, Eye, FileText, ChevronDown, ChevronUp, Zap } from "lucide-react";
import BuildKitUpsellPanel from "@/components/BuildKitUpsellPanel";

// Mock build data — in production, fetch by ID
const BUILDS_DATA = {
  1: {
    title: "MEG Replication Device",
    category: "Free Energy",
    cost: "$287",
    emoji: "⚡",
    shortDesc: "US Patent 6,362,718. Complete peer-reviewed replication.",
    longDesc: "The Motionless Electromagnetic Generator (MEG) is the most documented free energy device in modern history. Tom Bearden's 2002 patent 6,362,718 specifies exact geometry, materials, and winding ratios. This build plan includes a 23-component BOM with exact part numbers from verified suppliers, step-by-step assembly guide, and physics explanation of why COP>1 doesn't violate thermodynamics.",
    marketContext: "If operational, this device could disrupt global energy markets. The patent was granted by the USPTO, peer-reviewed in Foundations of Physics Letters, and replicated by dozens of independent engineers. This is not theoretical—it's documented, replicable technology.",
    estimatedCost: "$287 for components; $45 for tools",
    whatYouGet: [
      "23-component bill of materials with part numbers",
      "Supplier links and sourcing guide",
      "Full schematics and winding specifications",
      "12-step assembly video (3 hours)",
      "Troubleshooting guide for common failures",
      "Physics explainer — why this works",
      "PDF download (40+ pages)"
    ],
    bomPreview: [
      { qty: 2, item: "Toroidal ferrite core", spec: "Fair-Rite 2878006051", source: "Digi-Key" },
      { qty: 12, item: "Magnet wire", spec: "AWG 14, 600V insulation", source: "Amazon" },
      { qty: 4, item: "Permanent magnets", spec: "N52 neodymium, 1x0.5x0.5\"", source: "KJ Magnetics" },
      { qty: 1, item: "Power supply", spec: "12V 30A regulated", source: "Mean Well" },
    ],
    stepsPreview: [
      { num: 1, title: "Wind Primary Coil", detail: "12 turns of AWG 14 on toroidal core, left-hand winding..." },
      { num: 2, title: "Wind Secondary", detail: "48 turns counter-wound, same core..." },
      { num: 3, title: "Install Magnets", detail: "Place N52 magnets equidistant around toroid..." },
    ],
  }
};

export default function BuildDetail() {
  const { id } = useParams();
  const build = BUILDS_DATA[id] || BUILDS_DATA[1];
  const [showBom, setShowBom] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Header ── */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-20">
        <Link to="/vault" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3">
          <ArrowLeft size={16} /> Back to Vault
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">{build.category}</p>
            <h1 className="text-3xl font-black">{build.title}</h1>
          </div>
          <span className="text-green-400 font-black text-lg">{build.cost}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* ── Visual + CTA ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="h-96 bg-gradient-to-br from-gray-800 to-gray-950 rounded-2xl flex items-center justify-center text-9xl border border-gray-800">
              {build.emoji}
            </div>
          </div>

          <div>
            {/* ── Premium upsell ── */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-cyan-400" />
                <span className="text-cyan-400 font-bold text-sm">Premium</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                BOMs and schematics are free. Upgrade for: video assembly (3–12 hrs), verified supplier links, and access to engineer forums.
              </p>
              <Link to="/pricing-vault" className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-center transition-all">
                Upgrade to Pro
              </Link>
              <div className="text-xs text-gray-600 mt-4 space-y-1">
                <p>✓ $99/month or $299 one-time per build</p>
                <p>✓ Cancel anytime</p>
              </div>
            </div>

            {/* ── Kit upsell ── */}
            <div className="bg-gray-900 border border-orange-900/30 rounded-2xl p-6">
              <h3 className="text-white font-black text-sm mb-2">Buy the Kit</h3>
              <p className="text-gray-400 text-xs mb-4">All 23 components pre-sourced and verified. Ready to assemble.</p>
              <button className="w-full py-3 rounded-xl border border-orange-800 text-orange-400 hover:bg-orange-900/20 font-black text-sm transition-all">
                <ShoppingCart size={14} className="inline mr-2" /> Shop Kit
              </button>
            </div>
          </div>
        </div>

        {/* ── Overview ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-black mb-4">Overview</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-white font-bold mb-2">What It Is</h3>
              <p className="text-gray-300 leading-relaxed">{build.longDesc}</p>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-white font-bold mb-2">Market Context</h3>
              <p className="text-gray-300 leading-relaxed">{build.marketContext}</p>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-white font-bold mb-2">Estimated Cost to Build</h3>
              <p className="text-gray-300 font-mono">{build.estimatedCost}</p>
            </div>
          </div>
        </section>

        {/* ── Kit Upsell ── */}
        <BuildKitUpsellPanel
          buildTitle={build.title}
          kitPrice={287}
          components={[
            "Toroidal ferrite core (Fair-Rite)",
            "Magnet wire AWG 14",
            "N52 neodymium magnets",
            "Power supply 12V 30A",
            "Control circuit board",
            "Enclosure & hardware",
            "Mounting accessories",
            "Schematic & manual",
          ]}
        />

        {/* ── What you get ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-black mb-4">Complete Build Includes</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <ul className="space-y-3">
              {build.whatYouGet.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <span className="text-cyan-400 font-black mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── BOM Preview ── */}
        <section className="mb-12">
          <button
            onClick={() => setShowBom(!showBom)}
            className="flex items-center justify-between w-full mb-4 p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all">
            <h2 className="text-xl font-black">Bill of Materials Preview</h2>
            {showBom ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showBom && (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900">
                      <th className="text-left px-6 py-3 font-black">Qty</th>
                      <th className="text-left px-6 py-3 font-black">Item</th>
                      <th className="text-left px-6 py-3 font-black">Specification</th>
                      <th className="text-left px-6 py-3 font-black">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {build.bomPreview.map((row, i) => (
                      <tr key={i} className={`border-b border-gray-800 ${i % 2 === 0 ? "bg-gray-950" : "bg-gray-900/50"}`}>
                        <td className="px-6 py-3 text-cyan-400 font-bold">{row.qty}</td>
                        <td className="px-6 py-3">{row.item}</td>
                        <td className="px-6 py-3 text-gray-400">{row.spec}</td>
                        <td className="px-6 py-3 text-gray-400">{row.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-900 text-xs text-gray-500 border-t border-gray-800">
                ✓ Full 23-component BOM included above. Premium: verified supplier links & 3-hour video assembly guide.
              </div>
            </div>
          )}
        </section>

        {/* ── Assembly Steps Preview ── */}
        <section className="mb-12">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center justify-between w-full mb-4 p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all">
            <h2 className="text-xl font-black">Assembly Steps Preview</h2>
            {showSteps ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showSteps && (
            <div className="space-y-4">
              {build.stepsPreview.map((step, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-black flex-shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{step.title}</h4>
                      <p className="text-gray-400 text-sm">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center py-6 border-t border-gray-800">
                <p className="text-gray-500 text-sm mb-3">Premium: 12-step video assembly + written guide</p>
                <Link to="/pricing-vault" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-all">
                  <Eye size={14} /> Watch Video Assembly
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Final CTA ── */}
        <div className="text-center bg-gray-900 border border-cyan-900/30 rounded-2xl p-12">
          <h2 className="text-2xl font-black mb-2">Ready to Build?</h2>
          <p className="text-gray-400 mb-6">You have the full BOM above. Upgrade to Pro for video assembly guide, verified supplier links, and engineer forums.</p>
          <Link to="/pricing-vault" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black transition-all">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}