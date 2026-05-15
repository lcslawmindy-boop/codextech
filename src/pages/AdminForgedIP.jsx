import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Loader2, Trash2, RefreshCw, Search, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

function exportIPPDF(inv) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;
  const cW = W - margin * 2;
  let y = 0;
  let pageCount = 0;

  const addPage = () => {
    if (pageCount > 0) doc.addPage();
    pageCount++;
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, W, 20, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("AETHON APEX IP HOLDINGS — FORGED HYBRID IP PACKAGE", margin, 13);
    doc.text("ADMIN EXPORT — CONFIDENTIAL", W - margin, 13, { align: "right" });
    y = 28;
  };

  const check = (need = 14) => { if (y + need > 280) addPage(); };

  const section = (txt) => {
    check(16);
    doc.setFillColor(20, 20, 20);
    doc.rect(margin - 3, y - 3, cW + 6, 12, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(txt, margin, y + 5);
    y += 15;
  };

  const body = (txt, size = 10) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    const lines = doc.splitTextToSize(txt || "—", cW);
    lines.forEach(l => { check(8); doc.text(l, margin, y); y += 7; });
    y += 3;
  };

  const label = (lbl, val) => {
    check(10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(lbl, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(String(val || "—"), cW - 50);
    doc.text(lines[0] || "", margin + 48, y);
    y += 7;
  };

  // Cover
  addPage();

  // Title block
  doc.setDrawColor(0);
  doc.setLineWidth(0.8);
  doc.rect(margin - 3, y - 3, cW + 6, 32, "D");
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  const titleLines = doc.splitTextToSize(inv.hybrid_concept || "Hybrid IP Concept", cW - 6);
  titleLines.forEach((l, i) => doc.text(l, margin, y + 8 + i * 9));
  y += 36;

  // Metadata
  label("Mode:", inv.mode === "merge" ? "🔗 Merged IP" : "✨ Cross-Pollinated IP");
  label("Synergy Score:", `${inv.synergy_score || 0}/100`);
  label("IP Valuation:", `$${inv.ip_value_low || 0}M – $${inv.ip_value_high || 0}M`);
  label("Status:", (inv.status || "draft").toUpperCase());
  label("Market Sectors:", (inv.market_sectors || []).join(", ") || "—");
  label("Input Technologies:", (inv.input_nodes || []).map(n => n.label).join(", ") || "—");
  label("Created:", inv.created_date ? new Date(inv.created_date).toLocaleDateString() : "—");
  y += 5;

  section("1. TECHNICAL MECHANISM");
  body(inv.mechanism);

  section("2. PATENT CLAIMS (DRAFT — 3 INDEPENDENT)");
  body(inv.patent_claims);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120, 120, 120);
  check(8);
  doc.text("⚠ Draft only — consult a patent attorney before filing", margin, y);
  y += 10;

  section("3. IP VALUATION JUSTIFICATION");
  body(inv.ip_valuation);

  section("4. MARKET APPLICATIONS");
  body(inv.market_applications);

  section("5. REQUIRED COMPONENTS");
  body(inv.required_components);

  section("6. SUGGESTED NEXT STEPS");
  body(inv.suggested_next_steps);

  // Footer on all pages
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 287, W, 10, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Aethon Apex IP Holdings — Forged Hybrid IP Package — ADMIN EXPORT — CONFIDENTIAL", margin, 293);
    doc.text(`Page ${p} of ${total}`, W - margin, 293, { align: "right" });
  }

  const fname = (inv.hybrid_concept || "IP").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
  doc.save(`AethonApex_ForgedIP_${fname}.pdf`);
}

export default function AdminForgedIP() {
  const [inventions, setInventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.HybridInvention.list("-created_date", 200);
    setInventions(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this forged IP from the library?")) return;
    await base44.entities.HybridInvention.delete(id);
    setInventions(prev => prev.filter(i => i.id !== id));
  };

  const handleExport = (inv) => {
    setExporting(inv.id);
    setTimeout(() => {
      exportIPPDF(inv);
      setExporting(null);
    }, 50);
  };

  const handleExportAll = () => {
    filtered.forEach((inv, i) => {
      setTimeout(() => exportIPPDF(inv), i * 300);
    });
  };

  const filtered = inventions.filter(inv =>
    !search ||
    (inv.hybrid_concept || "").toLowerCase().includes(search.toLowerCase()) ||
    (inv.market_sectors || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const STATUS_COLORS = {
    draft: "text-gray-400 bg-gray-800",
    filed: "text-yellow-400 bg-yellow-900/40",
    patented: "text-green-400 bg-green-900/40",
    commercializing: "text-indigo-400 bg-indigo-900/40",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 sticky top-0 z-20 bg-gray-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Admin
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">⚡ Forged IP Build Library</h1>
            <p className="text-gray-500 text-xs">{inventions.length} hybrid inventions · PDF export · Admin view</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search inventions…"
              className="bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-500 w-52"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"><X size={12} /></button>}
          </div>
          <button onClick={load} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
            <RefreshCw size={13} />
          </button>
          {filtered.length > 0 && (
            <button
              onClick={handleExportAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 text-xs font-bold transition-all">
              <Download size={13} /> Export All ({filtered.length})
            </button>
          )}
          <Link to="/invention-forge"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-bold transition-all">
            ⚡ Open Forge
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      {!loading && inventions.length > 0 && (
        <div className="flex items-center gap-6 px-5 py-3 border-b border-gray-800 bg-gray-900/50">
          {[
            { label: "Total Forged", value: inventions.length, color: "text-yellow-400" },
            { label: "Draft", value: inventions.filter(i => (i.status || "draft") === "draft").length, color: "text-gray-400" },
            { label: "Filed", value: inventions.filter(i => i.status === "filed").length, color: "text-yellow-400" },
            { label: "Patented", value: inventions.filter(i => i.status === "patented").length, color: "text-green-400" },
            { label: "Avg Synergy", value: `${Math.round(inventions.reduce((s, i) => s + (i.synergy_score || 0), 0) / inventions.length)}%`, color: "text-cyan-400" },
            { label: "Total IP Est.", value: `$${inventions.reduce((s, i) => s + (i.ip_value_low || 0), 0)}–${inventions.reduce((s, i) => s + (i.ip_value_high || 0), 0)}M`, color: "text-green-400" },
          ].map((m, i) => (
            <div key={i}>
              <p className="text-gray-600 text-xs">{m.label}</p>
              <p className={`font-black text-sm ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-yellow-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-4xl mb-3">⚡</p>
            <p className="font-bold mb-1">{search ? `No results for "${search}"` : "No forged IPs yet"}</p>
            <p className="text-sm">Use the Invention Forge to generate hybrid IP concepts.</p>
            <Link to="/invention-forge" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-sm font-bold">
              ⚡ Open Forge
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inv) => (
              <div key={inv.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-white font-black text-sm">{inv.hybrid_concept}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${STATUS_COLORS[inv.status || "draft"]}`}>
                        {inv.status || "draft"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                        {inv.mode === "merge" ? "🔗 Merged" : "✨ Cross-Pollinated"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-900 text-cyan-400">
                        Synergy: {inv.synergy_score}/100
                      </span>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <span className="text-green-400 font-bold text-sm">${inv.ip_value_low || 0}M–${inv.ip_value_high || 0}M</span>
                      <span className="text-gray-500 text-xs">{(inv.market_sectors || []).join(", ")}</span>
                      <span className="text-gray-600 text-xs">{inv.created_date ? new Date(inv.created_date).toLocaleDateString() : ""}</span>
                    </div>

                    {/* Input nodes */}
                    {(inv.input_nodes || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {inv.input_nodes.map((n, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">{n.label}</span>
                        ))}
                      </div>
                    )}

                    {/* Mechanism preview */}
                    {inv.mechanism && (
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{inv.mechanism}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleExport(inv)}
                      disabled={exporting === inv.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 text-xs font-bold transition-all disabled:opacity-50">
                      {exporting === inv.id ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                      Export PDF
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-900 text-red-400 text-xs font-bold transition-all">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}