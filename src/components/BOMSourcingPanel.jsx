import { useState } from "react";
import { ShoppingCart, Search, RefreshCw, Download, CheckCircle2, AlertCircle, Loader2, ExternalLink, Package } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

const DISTRIBUTOR_LINKS = {
  mouser: (q) => `https://www.mouser.com/Search/Refine?Keyword=${encodeURIComponent(q)}`,
  digikey: (q) => `https://www.digikey.com/en/products/filter?keywords=${encodeURIComponent(q)}`,
  amazon: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`,
  aliexpress: (q) => `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(q)}`,
};

function parseEstCost(source) {
  // Extract numeric cost from strings like "Mouser ~$4" or "$45" 
  const match = source?.match(/\$([0-9,.]+)/);
  return match ? parseFloat(match[1].replace(",", "")) : null;
}

function getDistributor(source) {
  const s = (source || "").toLowerCase();
  if (s.includes("mouser")) return "mouser";
  if (s.includes("digi-key") || s.includes("digikey")) return "digikey";
  if (s.includes("amazon")) return "amazon";
  if (s.includes("aliexpress")) return "aliexpress";
  return null;
}

function generateShoppingListPDF(items, inventionTitle) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 18;
  const contentW = W - margin * 2;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 297, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("CONSOLIDATED SHOPPING LIST", margin, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(inventionTitle, margin, 40);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 47);

  // Table header
  let y = 60;
  doc.setFillColor(30, 41, 59);
  doc.rect(margin - 2, y - 5, contentW + 4, 10, "F");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("QTY", margin, y + 1);
  doc.text("COMPONENT", margin + 12, y + 1);
  doc.text("SPEC", margin + 80, y + 1);
  doc.text("SOURCE", margin + 130, y + 1);
  doc.text("EST.", margin + 162, y + 1);
  y += 12;

  let totalCost = 0;
  const checkedItems = items.filter(i => i.checked);
  const uncheckedItems = items.filter(i => !i.checked);
  const allItems = [...uncheckedItems, ...checkedItems];

  allItems.forEach((row, idx) => {
    if (y > 270) { doc.addPage(); doc.setFillColor(15, 23, 42); doc.rect(0, 0, W, 297, "F"); y = 20; }
    if (idx % 2 === 0) { doc.setFillColor(22, 33, 48); doc.rect(margin - 2, y - 3, contentW + 4, 9, "F"); }

    doc.setFontSize(7.5);
    doc.setTextColor(row.checked ? 80 : 34, 211, 238);
    doc.text(String(row.qty), margin, y + 1);

    doc.setTextColor(row.checked ? 80 : 203, 213, 225);
    const itemText = (row.item || "").slice(0, 40);
    doc.text(itemText, margin + 12, y + 1);

    doc.setTextColor(row.checked ? 60 : 148, 163, 184);
    doc.text((row.spec || "").slice(0, 28), margin + 80, y + 1);

    doc.setTextColor(row.checked ? 60 : 100, 116, 139);
    doc.text((row.source || "").slice(0, 20), margin + 130, y + 1);

    const cost = parseEstCost(row.source);
    if (cost) {
      totalCost += cost * (parseInt(row.qty) || 1);
      doc.setTextColor(row.checked ? 60 : 52, 211, 153);
      doc.text("$" + cost.toFixed(2), margin + 162, y + 1);
    }

    // Checkmark for procured items
    if (row.checked) {
      doc.setTextColor(52, 211, 153);
      doc.text("✓", W - margin - 4, y + 1);
    }

    y += 9;
  });

  // Total
  y += 5;
  doc.setFillColor(15, 40, 30);
  doc.rect(margin - 2, y - 3, contentW + 4, 12, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(52, 211, 153);
  doc.text(`ESTIMATED TOTAL: ~$${totalCost.toFixed(2)}`, margin, y + 5);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.text(`${uncheckedItems.length} items remaining · ${checkedItems.length} procured`, W - margin, y + 5, { align: "right" });

  y += 18;
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text("Prices are estimates from BOM source annotations. Verify current pricing at distributors before ordering.", margin, y);

  const filename = (inventionTitle || "BOM").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
  doc.save(`ShoppingList_${filename}.pdf`);
}

export default function BOMSourcingPanel({ bom, checked, inventionTitle }) {
  const [fetching, setFetching] = useState(false);
  const [pricingData, setPricingData] = useState({});
  const [fetchError, setFetchError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState("mouser");

  const totalEstimate = bom.reduce((sum, row) => {
    const cost = parseEstCost(row.source);
    return sum + (cost ? cost * (parseInt(row.qty) || 1) : 0);
  }, 0);

  const procuredItems = bom.filter((_, i) => checked[i]);
  const remainingItems = bom.filter((_, i) => !checked[i]);
  const remainingCost = remainingItems.reduce((sum, row) => {
    const cost = parseEstCost(row.source);
    return sum + (cost ? cost * (parseInt(row.qty) || 1) : 0);
  }, 0);

  const fetchLivePricing = async () => {
    setFetching(true);
    setFetchError(null);
    try {
      const queries = bom.slice(0, 8).map(row => row.item); // Limit to 8 for speed
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a components pricing assistant. For each of the following electronic components, provide realistic current pricing from Mouser, Digi-Key, or Amazon. Return JSON with the component name as key and an object with: price (number, USD), availability ("In Stock", "Limited", "Out of Stock"), distributor (string), and link_hint (short search string for the distributor site).

Components:
${queries.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Respond ONLY with valid JSON like:
{"component_name": {"price": 4.50, "availability": "In Stock", "distributor": "Mouser", "link_hint": "ferrite toroid N87"}}`,
        response_json_schema: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              price: { type: "number" },
              availability: { type: "string" },
              distributor: { type: "string" },
              link_hint: { type: "string" },
            },
          },
        },
      });
      setPricingData(result || {});
    } catch (e) {
      setFetchError("Could not fetch live pricing. Using BOM estimates.");
    }
    setFetching(false);
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    await new Promise(r => setTimeout(r, 50));
    const enrichedBOM = bom.map((row, i) => ({ ...row, checked: !!checked[i] }));
    generateShoppingListPDF(enrichedBOM, inventionTitle);
    setGeneratingPDF(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ShoppingCart size={14} className="text-green-400" />
          <span className="text-white font-bold text-sm">Parts Sourcing & Shopping List</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLivePricing}
            disabled={fetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700/50 text-blue-300 text-xs font-bold transition-all disabled:opacity-50"
          >
            {fetching ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
            {fetching ? "Fetching…" : "Fetch Live Pricing"}
          </button>
          <button
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/50 hover:bg-green-800/60 border border-green-700/50 text-green-300 text-xs font-bold transition-all disabled:opacity-50"
          >
            {generatingPDF ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
            {generatingPDF ? "Generating…" : "Export Shopping List PDF"}
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="px-5 py-3 border-b border-gray-800 bg-gray-950/40 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Package size={12} className="text-gray-500" />
          <span className="text-gray-400 text-xs">{bom.length} total components</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-green-500" />
          <span className="text-green-400 text-xs font-bold">{procuredItems.length} procured</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-yellow-500 text-xs">⏳</span>
          <span className="text-yellow-400 text-xs font-bold">{remainingItems.length} remaining</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {remainingCost > 0 && (
            <span className="text-xs text-gray-400">Remaining: <span className="text-yellow-300 font-black">${remainingCost.toFixed(2)}</span></span>
          )}
          {totalEstimate > 0 && (
            <span className="text-xs text-gray-400">Total est: <span className="text-green-300 font-black">${totalEstimate.toFixed(2)}</span></span>
          )}
        </div>
      </div>

      {fetchError && (
        <div className="mx-5 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-950/30 border border-yellow-800/40 text-yellow-500 text-xs">
          <AlertCircle size={12} /> {fetchError}
        </div>
      )}

      {/* Distributor selector */}
      <div className="px-5 pt-3 pb-2 flex items-center gap-2">
        <span className="text-gray-500 text-xs">Quick search on:</span>
        {Object.keys(DISTRIBUTOR_LINKS).map(d => (
          <button
            key={d}
            onClick={() => setSelectedDistributor(d)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
              selectedDistributor === d ? "bg-cyan-800/60 text-cyan-200 border border-cyan-700" : "bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Component rows */}
      <div className="px-5 pb-5 space-y-2 max-h-80 overflow-y-auto">
        {bom.map((row, i) => {
          const isProcured = !!checked[i];
          const estimatedCost = parseEstCost(row.source);
          const distributor = getDistributor(row.source);
          const liveData = Object.entries(pricingData).find(([k]) =>
            row.item?.toLowerCase().includes(k.toLowerCase().split(" ")[0]) ||
            k.toLowerCase().includes((row.item || "").toLowerCase().split(" ")[0])
          )?.[1];
          const searchQuery = row.item;
          const searchUrl = DISTRIBUTOR_LINKS[selectedDistributor]?.(liveData?.link_hint || searchQuery);

          return (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isProcured
                  ? "bg-green-950/10 border-green-900/30 opacity-60"
                  : "bg-gray-800/40 border-gray-700/50 hover:border-gray-600"
              }`}
            >
              {/* Procured indicator */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isProcured ? "bg-green-500" : "bg-gray-600"}`} />

              {/* Item info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isProcured ? "text-gray-500 line-through" : "text-gray-200"}`}>
                    ×{row.qty} {row.item}
                  </span>
                  {isProcured && <span className="text-green-500 text-xs">✓ Procured</span>}
                </div>
                <p className="text-gray-600 text-xs truncate mt-0.5">{row.spec}</p>
              </div>

              {/* Pricing */}
              <div className="text-right flex-shrink-0">
                {liveData ? (
                  <div>
                    <p className="text-green-300 text-xs font-black">${liveData.price?.toFixed(2)}</p>
                    <p className={`text-xs ${liveData.availability === "In Stock" ? "text-green-500" : liveData.availability === "Limited" ? "text-yellow-500" : "text-red-500"}`}>
                      {liveData.availability}
                    </p>
                    <p className="text-gray-600 text-xs">{liveData.distributor}</p>
                  </div>
                ) : estimatedCost ? (
                  <div>
                    <p className="text-gray-400 text-xs font-bold">~${estimatedCost.toFixed(2)}</p>
                    <p className="text-gray-600 text-xs">{distributor || "est."}</p>
                  </div>
                ) : (
                  <p className="text-gray-600 text-xs">—</p>
                )}
              </div>

              {/* Search link */}
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/60 text-gray-400 hover:text-white transition-all"
                title={`Search ${selectedDistributor}`}
              >
                <ExternalLink size={12} />
              </a>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="px-5 pb-4 text-gray-700 text-xs">
        💡 Click <ExternalLink size={10} className="inline" /> to search each component on your selected distributor. "Fetch Live Pricing" uses AI to estimate current market prices.
      </div>
    </div>
  );
}