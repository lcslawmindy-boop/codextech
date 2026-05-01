import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Video, ShoppingCart, Loader2, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DOSSIER_TIERS = [
  { inventions: 1, basePrice: "$297", basePriceCents: 29700 },
  { inventions: 2, basePrice: "$497", basePriceCents: 49700 },
  { inventions: 3, basePrice: "$697", basePriceCents: 69700 },
  { inventions: 4, basePrice: "$847", basePriceCents: 84700 },
  { inventions: 5, basePrice: "$997", basePriceCents: 99700 },
];

function isInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

function DossierCard({ tier, selected, onSelect, pdfExport, buildVideos }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate total price
  let totalPrice = tier.basePriceCents;
  let addOns = [];
  
  if (pdfExport) {
    totalPrice += 4900; // $49
    addOns.push("PDF Export");
  }
  if (buildVideos) {
    totalPrice += 4900; // $49
    addOns.push("Build Videos");
  }

  const displayPrice = "$" + (totalPrice / 100).toFixed(0);

  const handleCheckout = async () => {
    setError(null);
    if (isInIframe()) {
      setError("Checkout only works from the published app.");
      return;
    }

    setLoading(true);
    const origin = window.location.origin;
    const description = `Invention Dossier: ${tier.inventions} ${tier.inventions === 1 ? "Invention" : "Inventions"} IP Creation Framework` + 
      (addOns.length > 0 ? ` + ${addOns.join(" + ")}` : "");

    const res = await base44.functions.invoke("createCheckoutSession", {
      title: `Invention Dossier (${tier.inventions} ${tier.inventions === 1 ? "Invention" : "Inventions"})`,
      priceInCents: totalPrice,
      description: description,
      category: "IP Services",
      successUrl: `${origin}/dossier-success?inventions=${tier.inventions}&addOns=${addOns.join(",")}`,
      cancelUrl: `${origin}/invention-dossier`,
    });

    setLoading(false);
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setError(res.data?.error || "Checkout failed. Please try again.");
    }
  };

  return (
    <div
      onClick={() => onSelect(tier.inventions)}
      className={`rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${
        selected === tier.inventions
          ? "border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/20"
          : "border-gray-700 bg-gray-900 hover:border-cyan-600"
      }`}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Invention Dossier</p>
            <h3 className="text-2xl font-black text-white mt-1">{tier.inventions} {tier.inventions === 1 ? "Invention" : "Inventions"}</h3>
          </div>
          {selected === tier.inventions && (
            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
              <Check size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* What's Included */}
        <div className="space-y-2">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">What's Included</p>
          <ul className="space-y-1.5">
            <li className="flex gap-2 text-gray-300 text-sm">
              <span className="text-cyan-400 flex-shrink-0">✓</span>
              <span>IP Creation Framework ({tier.inventions} {tier.inventions === 1 ? "invention" : "inventions"})</span>
            </li>
            <li className="flex gap-2 text-gray-300 text-sm">
              <span className="text-cyan-400 flex-shrink-0">✓</span>
              <span>Bring-to-Market Roadmap</span>
            </li>
            <li className="flex gap-2 text-gray-300 text-sm">
              <span className="text-cyan-400 flex-shrink-0">✓</span>
              <span>Patent Strategy Guidance</span>
            </li>
            <li className="flex gap-2 text-gray-300 text-sm">
              <span className="text-cyan-400 flex-shrink-0">✓</span>
              <span>Commercialization Timeline</span>
            </li>
          </ul>
        </div>

        {/* Add-ons Section */}
        <div className="border-t border-gray-800 pt-4">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Optional Add-ons (+$49 each)</p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pdfExport}
                onChange={(e) => onSelect(tier.inventions, { pdfExport: e.target.checked, buildVideos })}
                className="w-4 h-4 rounded border-gray-600 accent-cyan-500"
              />
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <FileText size={14} className="text-gray-500" />
                PDF Export
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={buildVideos}
                onChange={(e) => onSelect(tier.inventions, { pdfExport, buildVideos: e.target.checked })}
                className="w-4 h-4 rounded border-gray-600 accent-cyan-500"
              />
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <Video size={14} className="text-gray-500" />
                Build Videos
              </span>
            </label>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-gray-800 pt-4 space-y-3">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Price</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-cyan-400">{displayPrice}</p>
              <p className="text-gray-600 text-xs">one-time</p>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Processing…
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Purchase Dossier
              </>
            )}
          </button>
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function InventionDossierPackage() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [pdfExport, setPdfExport] = useState(false);
  const [buildVideos, setBuildVideos] = useState(false);

  const handleSelect = (inventions, addOns = {}) => {
    setSelectedTier(inventions);
    if (addOns.pdfExport !== undefined) setPdfExport(addOns.pdfExport);
    if (addOns.buildVideos !== undefined) setBuildVideos(addOns.buildVideos);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg">Invention Dossier — IP Creation Package</h1>
            <p className="text-gray-500 text-xs">Complete patent strategy & commercialization roadmap for your inventions</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-b border-cyan-800/50 px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">
            From Invention to Patent to Market
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Complete Invention Dossier with IP creation framework, patent strategy, and bring-to-market roadmap. 
            Choose how many inventions you need documented.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {DOSSIER_TIERS.map((tier) => (
            <DossierCard
              key={tier.inventions}
              tier={tier}
              selected={selectedTier}
              onSelect={handleSelect}
              pdfExport={pdfExport}
              buildVideos={buildVideos}
            />
          ))}
        </div>

        {/* What's in the Dossier */}
        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-black mb-8 text-center">What's In Your Invention Dossier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-sm font-black">1</span>
                IP Creation Framework
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Complete patent landscape analysis for your invention</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Prior art search & freedom-to-operate assessment</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Provisional patent application draft</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Claims strategy for non-provisional filing</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-sm font-black">2</span>
                Bring-to-Market Roadmap
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>12-month commercialization timeline</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Funding & partnership strategy</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Licensing vs. direct commercialization analysis</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">•</span>
                  <span>Market entry & scaling milestones</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Optional Add-ons Explainer */}
        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-black mb-6">Optional Add-ons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <FileText size={32} className="text-orange-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white mb-2">PDF Export (+$49)</h4>
                <p className="text-gray-400 text-sm">Professional PDF report with all IP documentation, patent claims, and commercialization roadmap for each invention. Shareable with attorneys and investors.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Video size={32} className="text-purple-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white mb-2">Build Videos (+$49)</h4>
                <p className="text-gray-400 text-sm">Step-by-step assembly & testing video guides for each invention. Includes troubleshooting protocols and measurement validation procedures for research or prototype development.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-800 bg-gray-900/40 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Builder Membership Option */}
            <div className="bg-gray-900/60 border border-cyan-800 rounded-2xl p-6">
              <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-2">With Membership</p>
              <h4 className="text-white font-black text-lg mb-2">Builder Tier — $99/month</h4>
              <p className="text-gray-400 text-sm mb-4">
                Includes 10 Invention Dossier IP generations per month. Create unlimited inventions documentation with patent strategy, commercialization roadmap, and optional PDF + video exports.
              </p>
              <Link to="/research-membership" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-bold text-sm">
                View Membership →
              </Link>
            </div>

            {/* One-Time Purchase Option */}
            <div className="bg-gray-900/60 border border-purple-800 rounded-2xl p-6">
              <p className="text-purple-400 text-xs font-black uppercase tracking-widest mb-2">One-Time Purchase</p>
              <h4 className="text-white font-black text-lg mb-2">Dossier IP Creation Package</h4>
              <p className="text-gray-400 text-sm mb-4">
                No membership required. Purchase above (1–5 inventions, $297–$997 + optional $49 PDF/video add-ons). Full IP framework delivered immediately.
              </p>
              <p className="text-purple-300 font-bold text-sm">
                Scroll up to select inventions & purchase
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}