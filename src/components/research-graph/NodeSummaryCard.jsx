import { useState, useEffect, useMemo } from "react";
import { X, Sparkles, FileText, BookOpen, Link2, ChevronRight, ExternalLink, AlertCircle, Download, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { generateNodeExportPdf } from "@/lib/nodeExportPdf";

// AI-powered research summary card — pops up on node click.
// Generates a summary + real patent numbers + cited papers (web search),
// and shows clickable links to the node's most-connected neighbors.

export default function NodeSummaryCard({ node, allNodes, allEdges, onClose, onNavigateNode, onOpenFullDetails }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const handleExportPdf = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const doc = generateNodeExportPdf({ node, aiData: data, connectedNodes: connected.map(c => c.node) });
      const filename = `ZARP_${node.label.replace(/[^a-z0-9]+/gi, "_").substring(0, 50)}.pdf`;
      doc.save(filename); // hard drive download
      const blob = doc.output("blob");
      const file = new File([blob], filename, { type: "application/pdf" });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const me = await base44.auth.me().catch(() => null);
      await base44.entities.NodeExport.create({
        node_id: node.id,
        node_label: node.label,
        domain: node.domain,
        researcher: node.researcher,
        user_email: me?.email || "unknown",
        user_name: me?.full_name || "",
        pdf_url: file_url,
        summary: (data?.summary || "").substring(0, 500),
        patent_count: data?.patent_numbers?.length || 0,
        paper_count: data?.cited_papers?.length || 0,
      });
      toast({ title: "PDF exported", description: "Saved to your dashboard & downloaded to your computer." });
    } catch (e) {
      toast({ title: "Export failed", description: e?.message || "Could not generate PDF", variant: "destructive" });
    }
    setExporting(false);
  };

  // Top connected nodes (by edge strength)
  const connected = useMemo(() => {
    const conn = [];
    allEdges.forEach(e => {
      if (e.source === node.numericId) {
        const n = allNodes.find(x => x.numericId === e.target);
        if (n) conn.push({ node: n, strength: e.strength, type: e.typeLabel });
      } else if (e.target === node.numericId) {
        const n = allNodes.find(x => x.numericId === e.source);
        if (n) conn.push({ node: n, strength: e.strength, type: e.typeLabel });
      }
    });
    return conn.sort((a, b) => (b.strength || 0) - (a.strength || 0)).slice(0, 8);
  }, [node, allNodes, allEdges]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData(null);
    setError(null);

    const prompt = `You are a research intelligence analyst for the ZARP advanced-research platform. A user clicked a research node and needs a concise, accurate briefing.

NODE: "${node.label}"
Researcher / Inventor: ${node.researcher}
Year: ${node.year}
Domain: ${node.domain}
Suppression status: ${node.suppression}
Mechanism: ${node.mechanism}
Target systems: ${node.targetSystems.join(", ")}
Tags: ${node.tags.join(", ")}

Using real public records (patent offices, peer-reviewed journals, government archives), produce:
1. "summary" — 2-3 short paragraphs explaining what this research/technology is, its claimed mechanism, historical context, and significance. Plain language, no hype.
2. "patent_numbers" — REAL patent numbers (US, EP, WO, etc.) actually associated with this inventor/technology if they exist in public records. Empty array if none confirmed. Do NOT invent numbers.
3. "cited_papers" — REAL published research papers or authoritative sources relevant to this node (title, authors, year, source/journal). Empty array if none confirmed. Do NOT fabricate.
4. "key_insights" — 3-5 bullet insights connecting this node to broader research threads.

Return strict JSON matching the schema.`;

    base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: "gemini_3_flash",
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          patent_numbers: { type: "array", items: { type: "string" } },
          cited_papers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                authors: { type: "string" },
                year: { type: "string" },
                source: { type: "string" },
                url: { type: "string" }
              },
              required: ["title"]
            }
          },
          key_insights: { type: "array", items: { type: "string" } }
        },
        required: ["summary", "patent_numbers", "cited_papers", "key_insights"]
      }
    }).then(res => {
      if (cancelled) return;
      setData(res);
      setLoading(false);
    }).catch(err => {
      if (cancelled) return;
      setError(err?.message || "Could not generate summary");
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [node]);

  const patentUrl = (p) => {
    const clean = p.trim();
    if (/^US\d/i.test(clean)) return `https://patents.google.com/patent/${clean.replace(/\s/g, "")}`;
    if (/^(EP|WO|GB|DE|FR|JP|KR|CN)/i.test(clean)) return `https://patents.google.com/patent/${clean.replace(/\s/g, "")}`;
    return `https://patents.google.com/?q=${encodeURIComponent(clean)}`;
  };

  return (
    <div className="absolute top-16 right-3 bottom-12 z-40 w-[380px] max-w-[calc(100vw-24px)] flex flex-col">
      <div className="flex flex-col bg-slate-950/97 border border-amber-400/40 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden h-full">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-slate-800" style={{ background: `linear-gradient(135deg, ${node.domainColor}22, transparent)` }}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: node.domainColor, boxShadow: `0 0 6px ${node.domainColor}` }} />
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: node.domainColor }}>{node.domain}</span>
              </div>
              <h3 className="text-white text-sm font-bold leading-tight">{node.label}</h3>
              <p className="text-slate-400 text-[10px] mt-0.5">{node.researcher} · {node.year} · {node.suppression}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 -mt-1 -mr-1 flex-shrink-0"><X size={16} /></button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-3" />
              <p className="text-amber-400 text-[10px] font-bold tracking-wider" style={{ fontFamily: "Orbitron, sans-serif" }}>ANALYZING RESEARCH...</p>
              <p className="text-slate-500 text-[9px] mt-1">Searching patents & cited papers</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/40 border border-red-800/50">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-[10px]">{error}</p>
            </div>
          )}

          {data && !loading && (
            <>
              {/* AI Summary */}
              <section>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={11} className="text-amber-400" />
                  <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-wider" style={{ fontFamily: "Orbitron, sans-serif" }}>AI Summary</h4>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-line">{data.summary}</p>
              </section>

              {/* Key insights */}
              {data.key_insights?.length > 0 && (
                <section>
                  <h4 className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1.5">Key Insights</h4>
                  <ul className="space-y-1">
                    {data.key_insights.slice(0, 5).map((k, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-300 text-[10px] leading-relaxed">
                        <span className="text-amber-400 mt-0.5">▸</span><span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Relevant nodes (clickable) */}
              {connected.length > 0 && (
                <section>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Link2 size={11} className="text-cyan-400" />
                    <h4 className="text-cyan-400 text-[9px] font-bold uppercase tracking-wider">Relevant Nodes ({connected.length})</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {connected.map(({ node: n, strength, type }) => (
                      <button
                        key={n.numericId}
                        onClick={() => onNavigateNode(n)}
                        className="group flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-800 transition-all"
                        title={`${type} · strength ${strength}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: n.domainColor }} />
                        <span className="text-slate-300 text-[10px] group-hover:text-white max-w-[140px] truncate">{n.label}</span>
                        <ChevronRight size={9} className="text-slate-600 group-hover:text-amber-400" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Patent numbers */}
              <section>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileText size={11} className="text-violet-400" />
                  <h4 className="text-violet-400 text-[9px] font-bold uppercase tracking-wider">Reference Patents</h4>
                </div>
                {data.patent_numbers?.length > 0 ? (
                  <div className="space-y-1">
                    {data.patent_numbers.map((p, i) => (
                      <a key={i} href={patentUrl(p)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-violet-950/30 border border-violet-800/40 hover:border-violet-500/60 transition-all group">
                        <FileText size={10} className="text-violet-400 flex-shrink-0" />
                        <span className="text-violet-200 text-[10px] font-mono font-bold flex-1">{p}</span>
                        <ExternalLink size={10} className="text-violet-500 group-hover:text-violet-300 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-[10px] italic px-2">No confirmed patents in public records.</p>
                )}
              </section>

              {/* Cited papers */}
              <section>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BookOpen size={11} className="text-emerald-400" />
                  <h4 className="text-emerald-400 text-[9px] font-bold uppercase tracking-wider">Cited Research Papers</h4>
                </div>
                {data.cited_papers?.length > 0 ? (
                  <div className="space-y-1.5">
                    {data.cited_papers.map((paper, i) => (
                      <a key={i} href={paper.url || "#"} target="_blank" rel="noopener noreferrer" onClick={e => !paper.url && e.preventDefault()}
                        className={`block px-2 py-1.5 rounded-md bg-emerald-950/30 border border-emerald-800/40 hover:border-emerald-500/60 transition-all ${!paper.url ? "cursor-default" : "group"}`}>
                        <p className="text-emerald-100 text-[10px] font-semibold leading-tight">{paper.title}</p>
                        <p className="text-slate-400 text-[9px] mt-0.5">
                          {paper.authors}{paper.authors && paper.year ? " · " : ""}{paper.year}{paper.source ? ` · ${paper.source}` : ""}
                        </p>
                        {paper.url && <ExternalLink size={9} className="text-emerald-500 group-hover:text-emerald-300 mt-1" />}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-[10px] italic px-2">No confirmed cited papers in public records.</p>
                )}
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-2.5 border-t border-slate-800 bg-slate-950 flex gap-2">
          <button
            onClick={handleExportPdf}
            disabled={exporting || !data}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-bold transition-all hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (<><Loader2 size={12} className="animate-spin" /> Exporting...</>) : (<><Download size={12} /> Export PDF</>)}
          </button>
          <button
            onClick={onOpenFullDetails}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 hover:text-amber-400 text-slate-300 text-[10px] font-bold transition-all"
          >
            Full Details <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}