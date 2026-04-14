import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ShoppingCart, ExternalLink, Copy, CheckCircle2,
  DollarSign, Package, Search, Filter, Download, TrendingUp, Loader2
} from "lucide-react";
import { inventionSteps } from "../lib/inventionSteps";
import { jsPDF } from "jspdf";

// ── COMMISSION RATE ───────────────────────────────────────────────────────────
const COMMISSION_RATE = 0.10; // 10%
const BUSINESS_ACCOUNT = "Zenith Apex Research Portfolio — ACH Direct Deposit";

// ── VENDOR LOOKUP ─────────────────────────────────────────────────────────────
// Map supplier keywords to URLs
const VENDOR_MAP = [
  { keywords: ["mouser"], name: "Mouser Electronics", url: "https://www.mouser.com/Search/Refine?Keyword=", color: "#E21B1B" },
  { keywords: ["digi-key", "digikey"], name: "Digi-Key", url: "https://www.digikey.com/en/products/result?s=", color: "#CC1111" },
  { keywords: ["amazon"], name: "Amazon", url: "https://www.amazon.com/s?k=", color: "#FF9900" },
  { keywords: ["aliexpress"], name: "AliExpress", url: "https://www.aliexpress.com/wholesale?SearchText=", color: "#FF4747" },
  { keywords: ["ebay"], name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=", color: "#0064D2" },
  { keywords: ["thorlabs"], name: "Thorlabs", url: "https://www.thorlabs.com/search/thorsearch.cfm?search=", color: "#CC2200" },
  { keywords: ["digilent"], name: "Digilent", url: "https://digilent.com/shop/search/?q=", color: "#E22222" },
  { keywords: ["mcmaster", "mcmaster-carr"], name: "McMaster-Carr", url: "https://www.mcmaster.com/#", color: "#CC3300" },
  { keywords: ["analog devices"], name: "Analog Devices", url: "https://www.analog.com/en/search.html#q=", color: "#0066CC" },
  { keywords: ["mini-circuits"], name: "Mini-Circuits", url: "https://www.minicircuits.com/WebStore/RF-Amplifiers.html?model=", color: "#003399" },
  { keywords: ["edmund optics"], name: "Edmund Optics", url: "https://www.edmundoptics.com/search/#q=", color: "#336699" },
  { keywords: ["hamamatsu"], name: "Hamamatsu", url: "https://www.hamamatsu.com/us/en/search.html?searchword=", color: "#005BAC" },
  { keywords: ["national instruments", "ni usb"], name: "National Instruments", url: "https://www.ni.com/en/search.html#q=", color: "#FFCC00" },
  { keywords: ["jlcpcb"], name: "JLCPCB", url: "https://jlcpcb.com/", color: "#1A6CA8" },
  { keywords: ["roithner"], name: "Roithner Lasertechnik", url: "https://www.roithner-laser.com/", color: "#CC6600" },
  { keywords: ["k&j magnetics", "k&j"], name: "K&J Magnetics", url: "https://www.kjmagnetics.com/search.asp?q=", color: "#336633" },
  { keywords: ["rtl-sdr"], name: "RTL-SDR Blog", url: "https://www.rtl-sdr.com/", color: "#444444" },
  { keywords: ["nooelec"], name: "Nooelec", url: "https://www.nooelec.com/store/catalogsearch/result/?q=", color: "#003366" },
  { keywords: ["del mar"], name: "Del Mar Photonics", url: "https://www.dmphotonics.com/", color: "#6600AA" },
  { keywords: ["flipsky"], name: "Flipsky", url: "https://flipsky.net/collections/all?q=", color: "#FF5500" },
  { keywords: ["leo bodnar"], name: "Leo Bodnar", url: "https://www.leobodnar.com/products/", color: "#006633" },
];

function getVendorInfo(sourceText) {
  if (!sourceText) return null;
  const lower = sourceText.toLowerCase();
  for (const v of VENDOR_MAP) {
    if (v.keywords.some(k => lower.includes(k))) return v;
  }
  // Fallback: search Google Shopping
  return { name: "Search Online", url: "https://www.google.com/search?q=buy+", color: "#4285F4" };
}

function parsePrice(sourceText) {
  if (!sourceText) return null;
  const match = sourceText.match(/\$([0-9,.]+)/);
  return match ? parseFloat(match[1].replace(",", "")) : null;
}

function buildSearchUrl(vendor, itemName, spec) {
  const query = encodeURIComponent(`${itemName} ${spec || ""}`.trim());
  return vendor.url + query;
}

// ── FLATTEN ALL BOMs ──────────────────────────────────────────────────────────
function getAllItems() {
  const items = [];
  Object.entries(inventionSteps).forEach(([inventionTitle, data]) => {
    if (!data.bom || data.bom.length === 0) return;
    data.bom.forEach((row, idx) => {
      const vendor = getVendorInfo(row.source);
      const price = parsePrice(row.source);
      const commission = price ? +(price * COMMISSION_RATE).toFixed(2) : null;
      items.push({
        id: `${inventionTitle}-${idx}`,
        invention: inventionTitle,
        qty: row.qty,
        item: row.item,
        spec: row.spec,
        source: row.source,
        vendor,
        price,
        commission,
        totalPrice: price ? +(price * row.qty).toFixed(2) : null,
        totalCommission: commission ? +(commission * row.qty).toFixed(2) : null,
        searchUrl: vendor ? buildSearchUrl(vendor, row.item, row.spec) : null,
      });
    });
  });
  return items;
}

const ALL_ITEMS = getAllItems();
const ALL_INVENTIONS = [...new Set(ALL_ITEMS.map(i => i.invention))].sort();
const ALL_VENDORS = [...new Set(ALL_ITEMS.map(i => i.vendor?.name).filter(Boolean))].sort();

// ── COPY BUTTON ───────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 rounded hover:bg-gray-700 transition-all" title="Copy">
      {copied ? <CheckCircle2 size={11} className="text-green-400" /> : <Copy size={11} className="text-gray-500" />}
    </button>
  );
}

// ── ITEM ROW ──────────────────────────────────────────────────────────────────
function ItemRow({ item, checked, onCheck }) {
  return (
    <tr className={`border-b border-gray-800/60 transition-all ${checked ? "bg-green-950/20 opacity-60" : "hover:bg-gray-800/30"}`}>
      <td className="py-2.5 pl-4 pr-2">
        <input type="checkbox" checked={checked} onChange={onCheck}
          className="w-4 h-4 rounded accent-green-500 cursor-pointer" />
      </td>
      <td className="py-2.5 px-3 text-xs text-gray-500 max-w-[140px] truncate" title={item.invention}>
        {item.invention.split(" ").slice(0, 3).join(" ")}…
      </td>
      <td className="py-2.5 px-3">
        <p className="text-white text-xs font-semibold leading-snug">{item.item}</p>
        <p className="text-gray-500 text-xs leading-snug mt-0.5 max-w-xs truncate">{item.spec}</p>
      </td>
      <td className="py-2.5 px-3 text-cyan-400 text-xs font-bold text-center">{item.qty}</td>
      <td className="py-2.5 px-3">
        {item.vendor && (
          <a href={item.searchUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all hover:opacity-80 whitespace-nowrap w-fit"
            style={{ backgroundColor: item.vendor.color + "20", borderColor: item.vendor.color + "50", color: item.vendor.color }}>
            <ExternalLink size={10} /> {item.vendor.name}
          </a>
        )}
      </td>
      <td className="py-2.5 px-3 text-gray-400 text-xs max-w-[120px]">
        <span className="truncate block">{item.source}</span>
      </td>
      <td className="py-2.5 px-3 text-right">
        {item.price != null
          ? <span className="text-white text-xs font-bold">${item.price.toFixed(2)}</span>
          : <span className="text-gray-700 text-xs">—</span>}
      </td>
      <td className="py-2.5 px-3 text-right">
        {item.totalPrice != null
          ? <span className="text-gray-300 text-xs">${item.totalPrice.toFixed(2)}</span>
          : <span className="text-gray-700 text-xs">—</span>}
      </td>
      <td className="py-2.5 px-3 text-right pr-4">
        {item.commission != null
          ? <span className="text-green-400 text-xs font-bold">${item.commission.toFixed(2)}</span>
          : <span className="text-gray-700 text-xs">—</span>}
      </td>
    </tr>
  );
}

// ── PDF EXPORT ────────────────────────────────────────────────────────────────
function exportPDF(items, totalCost, totalCommission) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297; const margin = 15;
  let y = 0;

  doc.setFillColor(10, 14, 26);
  doc.rect(0, 0, W, 210, "F");
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, W, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("ZENITH APEX — MATERIAL SOURCING REPORT", margin, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | ${items.length} line items | 10% Commission → ${BUSINESS_ACCOUNT}`, margin, 26);

  doc.setFontSize(10);
  doc.setTextColor(34, 197, 94);
  doc.text(`Total Est. Cost: $${totalCost.toFixed(2)}   |   Total 10% Commission: $${totalCommission.toFixed(2)}`, margin, 34);

  y = 44;
  // Header row
  const cols = [
    { label: "Invention", x: margin, w: 58 },
    { label: "Item", x: margin + 58, w: 60 },
    { label: "Qty", x: margin + 118, w: 12 },
    { label: "Vendor", x: margin + 130, w: 32 },
    { label: "Unit $", x: margin + 162, w: 20 },
    { label: "Total $", x: margin + 182, w: 22 },
    { label: "Commission", x: margin + 204, w: 25 },
  ];

  doc.setFillColor(20, 30, 50);
  doc.rect(margin - 2, y - 5, W - margin * 2 + 4, 10, "F");
  cols.forEach(col => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(col.label, col.x, y + 1);
  });
  y += 10;

  items.slice(0, 60).forEach((item, i) => {
    if (y > 195) { doc.addPage(); doc.setFillColor(10, 14, 26); doc.rect(0, 0, W, 210, "F"); y = 20; }
    if (i % 2 === 0) { doc.setFillColor(18, 24, 38); doc.rect(margin - 2, y - 4, W - margin * 2 + 4, 9, "F"); }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(200, 210, 225);
    doc.text(item.invention.slice(0, 30), cols[0].x, y + 1);
    doc.text(item.item.slice(0, 32), cols[1].x, y + 1);
    doc.setTextColor(34, 211, 238);
    doc.text(String(item.qty), cols[2].x, y + 1);
    doc.setTextColor(200, 210, 225);
    doc.text((item.vendor?.name || "—").slice(0, 18), cols[3].x, y + 1);
    doc.setTextColor(255, 255, 255);
    doc.text(item.price != null ? `$${item.price.toFixed(2)}` : "—", cols[4].x, y + 1);
    doc.text(item.totalPrice != null ? `$${item.totalPrice.toFixed(2)}` : "—", cols[5].x, y + 1);
    doc.setTextColor(34, 197, 94);
    doc.text(item.commission != null ? `$${item.commission.toFixed(2)}` : "—", cols[6].x, y + 1);
    y += 9;
  });

  // Totals
  y += 5;
  doc.setFillColor(20, 40, 30);
  doc.rect(margin - 2, y, W - margin * 2 + 4, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(34, 197, 94);
  doc.text(`TOTAL ESTIMATED COST: $${totalCost.toFixed(2)}`, margin, y + 7);
  doc.text(`TOTAL 10% COMMISSION: $${totalCommission.toFixed(2)}`, margin, y + 14);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(`Commission → ACH Direct Deposit → ${BUSINESS_ACCOUNT}`, margin + 120, y + 7);

  doc.save(`ZenithApex_MaterialSourcing_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function MaterialSourcing() {
  const [search, setSearch] = useState("");
  const [inventionFilter, setInventionFilter] = useState("All");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [exporting, setExporting] = useState(false);

  const filtered = useMemo(() => {
    return ALL_ITEMS.filter(item => {
      const matchSearch = !search || item.item.toLowerCase().includes(search.toLowerCase()) ||
        item.spec?.toLowerCase().includes(search.toLowerCase()) ||
        item.invention.toLowerCase().includes(search.toLowerCase());
      const matchInvention = inventionFilter === "All" || item.invention === inventionFilter;
      const matchVendor = vendorFilter === "All" || item.vendor?.name === vendorFilter;
      return matchSearch && matchInvention && matchVendor;
    });
  }, [search, inventionFilter, vendorFilter]);

  const checkedItems = filtered.filter(i => checkedIds.has(i.id));
  const totalCost = filtered.reduce((s, i) => s + (i.totalPrice || 0), 0);
  const totalCommission = filtered.reduce((s, i) => s + (i.totalCommission || 0), 0);
  const checkedCost = checkedItems.reduce((s, i) => s + (i.totalPrice || 0), 0);
  const checkedCommission = checkedItems.reduce((s, i) => s + (i.totalCommission || 0), 0);

  const toggleCheck = (id) => {
    setCheckedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAll = () => setCheckedIds(new Set(filtered.map(i => i.id)));
  const clearAll = () => setCheckedIds(new Set());

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 50));
    exportPDF(filtered, totalCost, totalCommission);
    setExporting(false);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Admin
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Package size={15} className="text-green-400" /> Material Sourcing Center
            </h1>
            <p className="text-gray-500 text-xs">All BOM items · Vendor links · 10% commission tracked → ACH deposit</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-all disabled:opacity-60">
            {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            Export PDF
          </button>
        </div>
      </div>

      {/* Commission Banner */}
      <div className="px-5 py-3 border-b border-green-900/40 bg-green-950/20 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-green-400" />
          <span className="text-green-300 text-xs font-black">10% Commission on Every Order</span>
        </div>
        <div className="flex items-center gap-2 bg-green-900/30 border border-green-800 rounded-lg px-3 py-1.5">
          <DollarSign size={11} className="text-green-400" />
          <span className="text-green-200 text-xs font-bold">ACH Direct Deposit → {BUSINESS_ACCOUNT}</span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs">
          <span className="text-gray-500">{filtered.length} items shown</span>
          <span className="text-white font-bold">Est. Total: <span className="text-yellow-400">${totalCost.toFixed(2)}</span></span>
          <span className="text-green-400 font-black">Commission: ${totalCommission.toFixed(2)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 border-b border-gray-800 bg-gray-900/50 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search size={13} className="text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items, specs, inventions..."
            className="bg-transparent text-white text-xs placeholder-gray-600 focus:outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-gray-500" />
          <select value={inventionFilter} onChange={e => setInventionFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none max-w-[200px]">
            <option value="All">All Inventions</option>
            {ALL_INVENTIONS.map(i => <option key={i} value={i}>{i.slice(0, 40)}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none">
            <option value="All">All Vendors</option>
            {ALL_VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <button onClick={selectAll} className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold">Select All</button>
        <button onClick={clearAll} className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold">Clear</button>
      </div>

      {/* Selected summary bar */}
      {checkedIds.size > 0 && (
        <div className="px-5 py-2.5 bg-blue-950/30 border-b border-blue-800/40 flex flex-wrap items-center gap-4 text-xs">
          <span className="text-blue-300 font-black">{checkedIds.size} items selected</span>
          <span className="text-white">Cart Total: <span className="text-yellow-400 font-bold">${checkedCost.toFixed(2)}</span></span>
          <span className="text-green-400 font-bold">Commission: ${checkedCommission.toFixed(2)}</span>
          <button onClick={() => exportPDF(checkedItems, checkedCost, checkedCommission)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold transition-all">
            <Download size={11} /> Export Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="py-2.5 pl-4 pr-2 w-8"></th>
              <th className="py-2.5 px-3 text-left text-gray-500 text-xs font-bold uppercase tracking-wider">Invention</th>
              <th className="py-2.5 px-3 text-left text-gray-500 text-xs font-bold uppercase tracking-wider">Item / Spec</th>
              <th className="py-2.5 px-3 text-center text-gray-500 text-xs font-bold uppercase tracking-wider">Qty</th>
              <th className="py-2.5 px-3 text-left text-gray-500 text-xs font-bold uppercase tracking-wider">Vendor</th>
              <th className="py-2.5 px-3 text-left text-gray-500 text-xs font-bold uppercase tracking-wider">Source / Notes</th>
              <th className="py-2.5 px-3 text-right text-gray-500 text-xs font-bold uppercase tracking-wider">Unit $</th>
              <th className="py-2.5 px-3 text-right text-gray-500 text-xs font-bold uppercase tracking-wider">Total $</th>
              <th className="py-2.5 px-3 text-right pr-4 text-green-500 text-xs font-bold uppercase tracking-wider">10% Comm.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <ItemRow key={item.id} item={item} checked={checkedIds.has(item.id)} onCheck={() => toggleCheck(item.id)} />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center text-gray-600 py-16 text-sm">No items match your filters.</div>
        )}

        {/* Footer totals */}
        {filtered.length > 0 && (
          <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6">
              <span className="text-gray-500">{filtered.length} line items</span>
              <span className="text-white font-black">Est. Procurement Total: <span className="text-yellow-400">${totalCost.toFixed(2)}</span></span>
              <span className="text-green-400 font-black flex items-center gap-1">
                <DollarSign size={11} /> 10% Commission: ${totalCommission.toFixed(2)}
              </span>
            </div>
            <div className="text-gray-600 text-xs">
              Commission deposited via ACH → {BUSINESS_ACCOUNT}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}