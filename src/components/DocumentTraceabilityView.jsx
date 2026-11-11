import { useState, useEffect, useCallback } from "react";
import {
  Scroll, FileText, BookOpen, ShieldCheck, FlaskConical, Loader2,
  ChevronRight, AlertCircle, ExternalLink, Quote, Layers,
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const STRENGTH_COLORS = {
  strong: "#22c55e", moderate: "#fbbf24", weak: "#f97316", speculative: "#ef4444",
};
const RELIABILITY_COLORS = {
  high: "#22c55e", moderate: "#fbbf24", low: "#f97316", unverified: "#ef4444",
};
const CLAIM_STATUS_COLORS = {
  proposed: "#fbbf24", verified: "#22c55e", disputed: "#f97316", refuted: "#ef4444",
};
const LINK_TYPE_COLORS = {
  supports: "#22c55e", basis: "#06b6d4", validates: "#a855f7", extends: "#fbbf24", contradicts: "#ef4444",
};

async function fetchAll(entity, query, opts = {}) {
  const all = [];
  let cursor = null;
  do {
    const page = await base44.entities[entity].filter(query, { ...opts, limit: opts.limit || 100, cursor });
    all.push(...(page.items || []));
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  return all;
}

function Pill({ label, color, small }) {
  return (
    <span className={`font-bold uppercase rounded ${small ? "text-[8px] px-1 py-0.5" : "text-[9px] px-1.5 py-0.5"}`}
      style={{ color, background: color + "20", border: `1px solid ${color}40` }}>
      {label.replace(/_/g, " ")}
    </span>
  );
}

export default function DocumentTraceabilityView() {
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [chain, setChain] = useState({ claims: [], sources: [], reviews: [], links: [], inventions: [], loading: false });

  // Load all research documents once
  useEffect(() => {
    (async () => {
      setLoadingDocs(true);
      try {
        const all = await fetchAll("ResearchDocument", {}, { sort: "-created_date" });
        setDocs(all);
        if (all[0]) setSelectedDoc(all[0]);
      } catch (e) { console.error("docs load", e); }
      setLoadingDocs(false);
    })();
  }, []);

  // Load the full evidence chain for the selected document
  const loadChain = useCallback(async (docId) => {
    if (!docId) return;
    setChain({ claims: [], sources: [], reviews: [], links: [], inventions: [], loading: true });
    try {
      // Claims linked to this document
      const claims = await fetchAll("EvidenceClaim", { research_document_id: docId });
      const claimIds = claims.map((c) => c.id);

      let sources = [], reviews = [], links = [], inventions = [];
      if (claimIds.length) {
        // Sources for those claims
        sources = await fetchAll("EvidenceSource", { evidence_claim_id: { $in: claimIds } });
        const sourceIds = sources.map((s) => s.id);

        if (sourceIds.length) {
          // Reviews for those sources
          reviews = await fetchAll("EvidenceReview", { evidence_source_id: { $in: sourceIds } });
          const reviewIds = reviews.map((r) => r.id);

          if (reviewIds.length) {
            // Invention evidence links stemming from those reviews
            links = await fetchAll("InventionEvidenceLink", { evidence_review_id: { $in: reviewIds } });
            const invIds = [...new Set(links.map((l) => l.invention_candidate_id).filter(Boolean))];
            if (invIds.length) {
              const invResults = await Promise.allSettled(invIds.map((id) => base44.entities.InventionCandidate.get(id)));
              inventions = invResults.filter((r) => r.status === "fulfilled").map((r) => r.value);
            }
          }
        }
      }
      setChain({ claims, sources, reviews, links, inventions, loading: false });
    } catch (e) {
      console.error("chain load", e);
      setChain({ claims: [], sources: [], reviews: [], links: [], inventions: [], loading: false });
    }
  }, []);

  useEffect(() => {
    if (selectedDoc) loadChain(selectedDoc.id);
  }, [selectedDoc, loadChain]);

  const sourcesByClaim = chain.sources.reduce((m, s) => { (m[s.evidence_claim_id] ||= []).push(s); return m; }, {});
  const reviewsBySource = chain.reviews.reduce((m, r) => { (m[r.evidence_source_id] ||= []).push(r); return m; }, {});
  const linksByReview = chain.links.reduce((m, l) => { (m[l.evidence_review_id] ||= []).push(l); return m; }, {});
  const invById = chain.inventions.reduce((m, i) => { m[i.id] = i; return m; }, {});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Document list */}
      <div className="lg:col-span-1">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-800 bg-slate-950/50">
            <FileText size={14} className="text-cyan-400" />
            <span className="text-white font-bold text-xs">Research Documents</span>
            <span className="text-slate-600 text-[10px] ml-auto">{docs.length}</span>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {loadingDocs ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-600" size={18} /></div>
            ) : docs.length === 0 ? (
              <div className="text-center py-8 px-3">
                <AlertCircle size={18} className="text-slate-700 mx-auto mb-2" />
                <p className="text-slate-600 text-[11px]">No research documents yet</p>
              </div>
            ) : (
              docs.map((d) => (
                <button key={d.id} onClick={() => setSelectedDoc(d)}
                  className={`w-full text-left px-3 py-2.5 border-b border-slate-800/50 transition-colors ${selectedDoc?.id === d.id ? "bg-cyan-950/30 border-l-2 border-l-cyan-500" : "hover:bg-slate-800/40"}`}>
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{d.title}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {d.document_type && <Pill label={d.document_type} color="#06b6d4" small />}
                    {d.status && <Pill label={d.status} color="#94a3b8" small />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Traceability chain */}
      <div className="lg:col-span-2">
        {!selectedDoc ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
            <Scroll size={28} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-xs">Select a research document to trace its evidence chain.</p>
          </div>
        ) : chain.loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 flex flex-col items-center">
            <Loader2 className="animate-spin text-cyan-400 mb-3" size={24} />
            <p className="text-slate-400 text-xs">Loading evidence chain…</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Document header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <FileText size={14} className="text-cyan-400" />
                    <span className="font-mono text-[10px] text-slate-500">{selectedDoc.id?.slice(-8)}</span>
                    {selectedDoc.document_type && <Pill label={selectedDoc.document_type} color="#06b6d4" />}
                    {selectedDoc.status && <Pill label={selectedDoc.status} color="#94a3b8" />}
                  </div>
                  <h3 className="text-white font-bold text-sm leading-tight">{selectedDoc.title}</h3>
                  {selectedDoc.abstract && <p className="text-slate-400 text-xs leading-relaxed mt-2">{selectedDoc.abstract}</p>}
                  {selectedDoc.source_url && (
                    <a href={selectedDoc.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-400 text-[11px] mt-2 hover:underline">
                      <ExternalLink size={11} /> Source URL
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 text-center flex-shrink-0">
                  <div><p className="text-cyan-400 font-black text-lg">{chain.claims.length}</p><p className="text-slate-600 text-[8px] uppercase">Claims</p></div>
                  <div><p className="text-green-400 font-black text-lg">{chain.sources.length}</p><p className="text-slate-600 text-[8px] uppercase">Citations</p></div>
                  <div><p className="text-amber-400 font-black text-lg">{chain.reviews.length}</p><p className="text-slate-600 text-[8px] uppercase">Reviews</p></div>
                  <div><p className="text-purple-400 font-black text-lg">{chain.inventions.length}</p><p className="text-slate-600 text-[8px] uppercase">Inventions</p></div>
                </div>
              </div>
            </div>

            {/* Chain */}
            {chain.claims.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <AlertCircle size={22} className="text-slate-700 mx-auto mb-2" />
                <p className="text-slate-500 text-xs">No evidence claims linked to this document yet.</p>
                <p className="text-slate-600 text-[10px] mt-1">Claims are created with <code className="text-slate-500">research_document_id</code> pointing here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chain.claims.map((claim) => {
                  const claimSources = sourcesByClaim[claim.id] || [];
                  return (
                    <div key={claim.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      {/* Claim row */}
                      <div className="px-4 py-3 border-b border-slate-800/60" style={{ borderLeft: `3px solid ${STRENGTH_COLORS[claim.evidence_strength] || "#64748b"}` }}>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <Scroll size={12} className="text-green-400 flex-shrink-0" />
                          <span className="text-slate-500 text-[10px] font-mono">CLAIM</span>
                          {claim.claim_type && <Pill label={claim.claim_type} color="#94a3b8" small />}
                          {claim.evidence_strength && <Pill label={claim.evidence_strength} color={STRENGTH_COLORS[claim.evidence_strength]} small />}
                          {claim.status && <Pill label={claim.status} color={CLAIM_STATUS_COLORS[claim.status] || "#94a3b8"} small />}
                        </div>
                        <p className="text-slate-200 text-xs leading-relaxed">{claim.claim_text}</p>
                        {claim.supporting_data && <p className="text-slate-500 text-[11px] mt-1.5 italic">{claim.supporting_data}</p>}
                        {claim.citations?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {claim.citations.map((c, i) => (
                              <span key={i} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                <Quote size={9} /> {c.length > 40 ? c.slice(0, 37) + "..." : c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Sources under this claim */}
                      {claimSources.length === 0 ? (
                        <div className="px-4 py-2 text-slate-600 text-[10px] flex items-center gap-1.5">
                          <AlertCircle size={10} /> No citations linked to this claim.
                        </div>
                      ) : (
                        <div className="px-4 py-3 space-y-2.5">
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen size={10} /> {claimSources.length} Supporting Source{claimSources.length > 1 ? "s" : ""}
                          </p>
                          {claimSources.map((src) => {
                            const srcReviews = reviewsBySource[src.id] || [];
                            return (
                              <div key={src.id} className="rounded-lg border border-slate-800 bg-slate-950/40 overflow-hidden">
                                <div className="px-3 py-2">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-slate-500 text-[9px] font-mono">SOURCE</span>
                                    {src.source_type && <Pill label={src.source_type} color="#f97316" small />}
                                    {src.reliability && <Pill label={src.reliability} color={RELIABILITY_COLORS[src.reliability]} small />}
                                    {src.status && <Pill label={src.status} color="#94a3b8" small />}
                                  </div>
                                  <p className="text-white text-xs font-semibold leading-snug">{src.title}</p>
                                  {src.doi && <p className="text-cyan-400 text-[10px] font-mono mt-0.5">DOI: {src.doi}</p>}
                                  {src.authors?.length > 0 && <p className="text-slate-500 text-[10px] mt-0.5">{src.authors.join(", ")}</p>}
                                  {src.excerpt && <p className="text-slate-400 text-[11px] leading-relaxed mt-1.5 italic line-clamp-3">"{src.excerpt}"</p>}
                                  {src.url && (
                                    <a href={src.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-400 text-[10px] mt-1.5 hover:underline">
                                      <ExternalLink size={10} /> Open source
                                    </a>
                                  )}
                                </div>

                                {/* Reviews under this source */}
                                {srcReviews.length > 0 && (
                                  <div className="border-t border-slate-800/60 px-3 py-2 space-y-1.5 bg-slate-900/30">
                                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                      <ShieldCheck size={10} /> {srcReviews.length} Review{srcReviews.length > 1 ? "s" : ""}
                                    </p>
                                    {srcReviews.map((rev) => {
                                      const revLinks = linksByReview[rev.id] || [];
                                      return (
                                        <div key={rev.id} className="rounded border border-slate-800 bg-slate-950/50 p-2">
                                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                            <span className="text-slate-500 text-[8px] font-mono">REVIEW</span>
                                            {rev.review_type && <Pill label={rev.review_type} color="#a855f7" small />}
                                            {rev.assessment && <Pill label={rev.assessment} color={rev.assessment.includes("accept") ? "#22c55e" : rev.assessment.includes("reject") ? "#ef4444" : "#fbbf24"} small />}
                                            {rev.status && <Pill label={rev.status} color="#94a3b8" small />}
                                            {rev.methodology_score != null && <span className="text-[9px] text-slate-400">M:{rev.methodology_score}</span>}
                                            {rev.reproducibility_score != null && <span className="text-[9px] text-slate-400">R:{rev.reproducibility_score}</span>}
                                          </div>
                                          {rev.review_notes && <p className="text-slate-400 text-[10px] leading-relaxed mb-1">{rev.review_notes}</p>}
                                          {revLinks.length > 0 && (
                                            <div className="mt-1.5 pt-1.5 border-t border-slate-800/50 space-y-1">
                                              <p className="text-slate-500 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                <FlaskConical size={9} /> Supports Invention{revLinks.length > 1 ? "s" : ""}
                                              </p>
                                              {revLinks.map((link) => {
                                                const inv = invById[link.invention_candidate_id];
                                                return (
                                                  <div key={link.id} className="flex items-center gap-1.5 flex-wrap text-[10px]">
                                                    <Pill label={link.link_type} color={LINK_TYPE_COLORS[link.link_type] || "#94a3b8"} small />
                                                    <span className="text-slate-300">{inv?.name || link.invention_candidate_id?.slice(-8)}</span>
                                                    {link.relevance && <span className="text-slate-600">· {link.relevance}</span>}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inventions supported summary */}
            {chain.inventions.length > 0 && (
              <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Layers size={14} className="text-purple-400" />
                  <h4 className="text-purple-300 font-bold text-xs uppercase tracking-wider">Inventions Supported by This Document</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {chain.inventions.map((inv) => (
                    <div key={inv.id} className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5">
                      <p className="text-white text-xs font-semibold leading-snug">{inv.name}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {inv.readiness_level && <Pill label={inv.readiness_level} color="#06b6d4" small />}
                        {inv.humanitarian_flag && <Pill label="humanitarian" color="#22c55e" small />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}