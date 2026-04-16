import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Loader2, Copy, CheckCircle2, Download, FlaskConical, DollarSign, ShoppingCart, Layers } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { nodes } from "@/lib/beardenData";
import { jsPDF } from "jspdf";
import NodeSelector from "@/components/NodeSelector";

// ── BUILD SUPPLIES SUGGESTIONS (keyed by keyword matching) ──────────────────
const SUPPLY_KEYWORDS = [
  { keywords: ["scalar", "wave", "longitudinal", "phi"], items: ["Advanced EM Assembly Tool Kit ($127)", "Scalar EM Lab Starter Kit ($167)"] },
  { keywords: ["magnet", "meg", "flux", "regaug"], items: ["Advanced EM Assembly Tool Kit ($127)", "MEG Replication Parts Kit ($287)"] },
  { keywords: ["telomere", "biological", "cell", "priore", "kindling", "epigenetic"], items: ["TRD-1 Telomere Device Build Kit ($194)", "Prioré Device Component Bundle ($349)"] },
  { keywords: ["trz", "time-reversal", "cold fusion", "nuclear"], items: ["TRZ Reactor Starter Components ($389)", "Advanced EM Assembly Tool Kit ($127)"] },
  { keywords: ["communicate", "g-com", "global scaling", "graviton"], items: ["G-Com Scalar Communicator Parts ($243)", "Scalar EM Lab Starter Kit ($167)"] },
  { keywords: ["emf", "protection", "shield", "exposure"], items: ["EMF Protection & Shielding Kit ($89)", "Advanced EM Assembly Tool Kit ($127)"] },
  { keywords: ["vacuum", "energy", "moray", "anenergy"], items: ["MEG Replication Parts Kit ($287)", "Advanced EM Assembly Tool Kit ($127)"] },
];

function getSuggestedSupplies(text) {
  const lower = (text || "").toLowerCase();
  const found = new Set();
  SUPPLY_KEYWORDS.forEach(({ keywords, items }) => {
    if (keywords.some(k => lower.includes(k))) items.forEach(i => found.add(i));
  });
  if (found.size === 0) {
    SUPPLY_KEYWORDS[0].items.forEach(i => found.add(i));
    SUPPLY_KEYWORDS[5].items.forEach(i => found.add(i));
  }
  return [...found].slice(0, 4);
}

// ── SYNERGY ARC VISUALIZER ──────────────────────────────────────────────────
function SynergyVisualizer({ selected, result }) {
  const W = 480, H = 180;
  const positions = selected.map((_, i) => ({
    x: 60 + (i / Math.max(selected.length - 1, 1)) * (W - 120),
    y: H / 2,
  }));
  const midX = W / 2, midY = 50;
  const colors = ["#d4af37", "#6366f1", "#22c55e", "#f97316", "#ec4899", "#06b6d4"];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="block">
        {/* Arcs from each node to center */}
        {positions.map((pos, i) => (
          <g key={i}>
            <path
              d={`M ${pos.x} ${pos.y} Q ${(pos.x + midX) / 2} ${midY - 20} ${midX} ${midY + 10}`}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="2"
              strokeDasharray="5,4"
              opacity="0.7"
            />
            <circle cx={pos.x} cy={pos.y} r="20" fill={colors[i % colors.length] + "30"} stroke={colors[i % colors.length]} strokeWidth="1.5" />
            <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill={colors[i % colors.length]} fontSize="9" fontWeight="bold">
              {selected[i].label.split(" ").slice(0, 2).join(" ")}
            </text>
          </g>
        ))}
        {/* Center hybrid node */}
        <circle cx={midX} cy={midY} r="26" fill="#d4af3720" stroke="#d4af37" strokeWidth="2" />
        <text x={midX} y={midY - 4} textAnchor="middle" fill="#d4af37" fontSize="8" fontWeight="bold">HYBRID</text>
        <text x={midX} y={midY + 8} textAnchor="middle" fill="#d4af37" fontSize="8">INVENTION</text>
        {/* Synergy score */}
        {result && (
          <text x={W - 60} y={20} textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="bold">
            {result.synergy_score}%
          </text>
        )}
        {result && (
          <text x={W - 60} y={34} textAnchor="middle" fill="#6b7280" fontSize="8">
            Synergy
          </text>
        )}
      </svg>
    </div>
  );
}

// ── COPY BUTTON ─────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 text-xs font-semibold transition-all">
      {copied ? <CheckCircle2 size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── PDF EXPORT ──────────────────────────────────────────────────────────────
function exportPDF(selected, result) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 18, cW = W - margin * 2;
  let y = 20;

  doc.setFillColor(10, 10, 20);
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, W, 5, "F");

  doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(212, 175, 55);
  doc.text("ZARP — R&D Simulation Sandbox", margin, 24);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text(`Hybrid Invention Analysis · Generated ${new Date().toLocaleDateString()}`, margin, 32);
  y = 44;

  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(212, 175, 55);
  doc.text("INPUT NODES", margin, y); y += 8;
  selected.forEach(n => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(200, 210, 230);
    doc.text(`• ${n.label} [${n.group}]`, margin + 4, y); y += 6;
  });
  y += 4;

  const sections = [
    ["HYBRID INVENTION CONCEPT", result?.hybrid_concept],
    ["TECHNICAL MECHANISM", result?.mechanism],
    ["KEY NOVELTY & PATENT CLAIMS", result?.patent_claims],
    ["MARKET APPLICATIONS", result?.market_applications],
    ["REQUIRED COMPONENTS", result?.required_components],
    ["IP VALUATION ESTIMATE", result?.ip_valuation],
  ];

  sections.forEach(([title, content]) => {
    if (!content) return;
    if (y > 260) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(212, 175, 55);
    doc.text(title, margin, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(190, 200, 220);
    const lines = doc.splitTextToSize(content, cW - 4);
    lines.forEach(line => {
      if (y > 278) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
      doc.text(line, margin + 2, y); y += 5.5;
    });
    y += 4;
  });

  doc.setFillColor(212, 175, 55); doc.rect(0, 292, W, 5, "F");
  doc.save(`ZARP_Hybrid_Invention_${Date.now()}.pdf`);
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RDSandbox() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("merge"); // merge | cross-pollinate

  const toggleNode = (node) => {
    setResult(null);
    setSelected(prev =>
      prev.find(n => n.id === node.id)
        ? prev.filter(n => n.id !== node.id)
        : prev.length >= 5 ? prev : [...prev, node]
    );
  };

  const handleRun = async () => {
    if (selected.length < 2) return;
    setLoading(true);
    setResult(null);

    const nodeDescriptions = selected.map(n => `- ${n.label} (${n.group}): ${n.description}`).join("\n");
    const modeLabel = mode === "merge" ? "merge (synthesize into a single hybrid device/concept)" : "cross-pollinate (find synergistic IP opportunities and unexpected combinations)";

    const prompt = `You are an advanced IP and R&D strategist working within the Zenith Apex Research Portfolio (ZARP) platform.

The user wants to ${modeLabel} the following invention nodes from the ZARP knowledge graph:

${nodeDescriptions}

Produce a structured analysis with EXACTLY these JSON keys:
- hybrid_concept: A concise name and 2-sentence description of the new hybrid invention
- mechanism: 3-4 sentences explaining the technical mechanism combining these fields
- synergy_score: An integer 0-100 representing how synergistic these concepts are
- patent_claims: 3 numbered potential patent claim directions for the hybrid
- market_applications: 3 specific market applications with estimated market size
- required_components: The key engineering components and materials needed to realize this hybrid
- ip_valuation: A reasoned IP valuation estimate in USD with explanation (e.g. "$X - $Y million because...")
- suggested_next_steps: 3 concrete next steps to realize this invention

Be specific, technical, and IP-focused. Treat this as a real invention disclosure.`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          hybrid_concept: { type: "string" },
          mechanism: { type: "string" },
          synergy_score: { type: "integer" },
          patent_claims: { type: "string" },
          market_applications: { type: "string" },
          required_components: { type: "string" },
          ip_valuation: { type: "string" },
          suggested_next_steps: { type: "string" },
        }
      }
    });

    setResult(res);
    setLoading(false);

    // Save to HybridInvention entity (ensure all fields are strings)
    await base44.entities.HybridInvention.create({
      hybrid_concept: res.hybrid_concept || "",
      mechanism: res.mechanism || "",
      synergy_score: res.synergy_score || 0,
      patent_claims: typeof res.patent_claims === 'string' ? res.patent_claims : JSON.stringify(res.patent_claims),
      market_applications: typeof res.market_applications === 'string' ? res.market_applications : JSON.stringify(res.market_applications),
      required_components: res.required_components || "",
      ip_valuation: res.ip_valuation || "",
      suggested_next_steps: typeof res.suggested_next_steps === 'string' ? res.suggested_next_steps : JSON.stringify(res.suggested_next_steps),
      input_nodes: selected.map(n => ({ id: n.id, label: n.label, group: n.group })),
      mode,
      market_sectors: [...new Set(selected.map(n => n.group))],
      status: "draft",
    });
  };

  const supplies = result ? getSuggestedSupplies(
    (result.hybrid_concept || "") + " " + (result.required_components || "") + " " + selected.map(n => n.label).join(" ")
  ) : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Graph
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <FlaskConical size={14} className="text-yellow-400" /> R&D Simulation Sandbox
            </h1>
            <p className="text-gray-500 text-xs">Select 2–5 invention nodes · AI cross-pollination · IP valuation</p>
          </div>
        </div>
        <Link to="/hybrid-portfolio"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-bold transition-all">
          <Layers size={12} /> Portfolio
        </Link>
        {result && (
          <button onClick={() => exportPDF(selected, result)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-xs transition-all">
            <Download size={12} /> Export PDF
          </button>
        )}
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-5 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Controls */}
        <div className="space-y-4">
          {/* Mode selector */}
          <div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Synthesis Mode</p>
            <div className="flex gap-2">
              {[
                { id: "merge", label: "⚗️ Merge", desc: "Synthesize into one hybrid device" },
                { id: "cross-pollinate", label: "🧬 Cross-Pollinate", desc: "Find synergistic IP opportunities" },
              ].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all text-left ${
                    mode === m.id ? "bg-yellow-900/40 border-yellow-700 text-yellow-300" : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600"
                  }`}>
                  <p>{m.label}</p>
                  <p className="text-xs font-normal text-gray-600 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Node selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Select Invention Nodes</p>
              <span className="text-gray-600 text-xs">{selected.length}/5 selected</span>
            </div>
            <NodeSelector selected={selected} onToggle={toggleNode} />
          </div>

          {/* Selected chips */}
          {selected.length > 0 && (
            <div>
              <p className="text-gray-600 text-xs mb-2">Selected nodes:</p>
              <div className="flex flex-wrap gap-2">
                {selected.map((n, i) => (
                  <button key={n.id} onClick={() => toggleNode(n)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-900/30 border border-yellow-800/60 text-yellow-300 text-xs font-bold hover:bg-red-950/40 hover:border-red-800 hover:text-red-300 transition-all">
                    {n.label.split(" ").slice(0, 3).join(" ")} ×
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={selected.length < 2 || loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40 bg-gradient-to-r from-yellow-800 to-yellow-700 hover:from-yellow-700 hover:to-yellow-600 text-black shadow-[0_4px_24px_rgba(200,160,0,0.25)]">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
            {loading ? "Simulating Cross-Pollination…" : `Run AI Synthesis (${selected.length} nodes)`}
          </button>

          {/* Synergy visualizer */}
          {selected.length >= 2 && (
            <SynergyVisualizer selected={selected} result={result} />
          )}
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-full min-h-64 border border-gray-800 border-dashed rounded-2xl text-center px-8">
              <FlaskConical size={40} className="text-gray-800 mb-4" />
              <p className="text-gray-600 font-bold text-sm mb-1">Select 2–5 invention nodes</p>
              <p className="text-gray-700 text-xs">The AI will synthesize a hybrid concept, project the IP value, and suggest build components.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 border border-yellow-900/30 rounded-2xl">
              <Loader2 size={32} className="text-yellow-400 animate-spin mb-3" />
              <p className="text-gray-400 text-sm">Synthesizing cross-domain IP…</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Synergy score + concept header */}
              <div className="bg-gradient-to-br from-yellow-950/30 to-gray-900 border border-yellow-800/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Hybrid Invention</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${result.synergy_score}%` }} />
                    </div>
                    <span className="text-green-400 font-black text-sm">{result.synergy_score}% synergy</span>
                  </div>
                </div>
                <p className="text-white font-black text-sm leading-relaxed">{result.hybrid_concept}</p>
              </div>

              {/* Sections */}
              {[
                { icon: "⚙️", label: "Technical Mechanism", key: "mechanism", color: "#3b82f6" },
                { icon: "📋", label: "Potential Patent Claims", key: "patent_claims", color: "#a855f7" },
                { icon: "📊", label: "Market Applications", key: "market_applications", color: "#22c55e" },
                { icon: "🔩", label: "Required Components", key: "required_components", color: "#f59e0b" },
                { icon: "🚀", label: "Suggested Next Steps", key: "suggested_next_steps", color: "#06b6d4" },
              ].map(s => (
                result[s.key] && (
                  <div key={s.key} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800"
                      style={{ background: s.color + "12" }}>
                      <p className="text-xs font-black uppercase tracking-wider" style={{ color: s.color }}>
                        {s.icon} {s.label}
                      </p>
                      <CopyBtn text={result[s.key]} />
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{result[s.key]}</p>
                    </div>
                  </div>
                )
              ))}

              {/* IP Valuation */}
              {result.ip_valuation && (
                <div className="bg-green-950/20 border border-green-800/50 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-900/40">
                    <p className="text-green-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign size={12} /> IP Valuation Estimate
                    </p>
                    <CopyBtn text={result.ip_valuation} />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-green-300 font-bold text-sm leading-relaxed">{result.ip_valuation}</p>
                  </div>
                </div>
              )}

              {/* Build Supplies suggestions */}
              {supplies.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-orange-950/20">
                    <p className="text-orange-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingCart size={12} /> Suggested Build Supplies
                    </p>
                    <Link to="/build-supplies-shop" className="text-orange-400 text-xs font-bold hover:underline">
                      Shop →
                    </Link>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    {supplies.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{s}</p>
                      </div>
                    ))}
                    <Link to="/build-supplies-shop"
                      className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-orange-900/30 hover:bg-orange-800/40 border border-orange-800/50 text-orange-300 text-xs font-bold transition-all">
                      <ShoppingCart size={12} /> View All Build Supplies
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}