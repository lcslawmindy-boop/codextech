import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Search, ExternalLink, Lock, Download, Filter, ArrowLeft, BookOpen, Shield } from "lucide-react";
import { useTier } from "@/hooks/useTier";

const DOCUMENTS = [
  { id: 1, title: "US Patent 6,362,718 — Motionless Electromagnetic Generator", type: "Patent", category: "Free Energy", year: 2002, authors: "Bearden, Hayes, Moore, Kenny, Patrick", tier: "starter", abstract: "A magnetic generator that uses a toroidal magnetic core with switching coils to extract electrical energy from the ambient electromagnetic potential.", url: "https://patents.google.com/patent/US6362718" },
  { id: 2, title: "Foundations of Physics Letters — MEG Device Analysis", type: "Peer-Reviewed Journal", category: "Free Energy", year: 2001, authors: "T.E. Bearden et al.", tier: "starter", abstract: "Formal peer-reviewed analysis of the MEG device demonstrating COP>1 operation with supporting theoretical framework.", url: null },
  { id: 3, title: "French Patent FR 1,342,772 — Prioré Electromagnetic Device", type: "Patent", category: "Bioelectromagnetics", year: 1963, authors: "Antoine Prioré", tier: "starter", abstract: "Original Prioré device patent covering the plasma tube electromagnetic generator used in French clinical trials.", url: null },
  { id: 4, title: "Comptes Rendus de l'Académie des Sciences — Prioré Clinical Results", type: "Academic Paper", category: "Bioelectromagnetics", year: 1966, authors: "Pautrizel, Prioré et al.", tier: "pro", abstract: "Peer-reviewed results from the French Academy of Sciences documenting tumor regression in animal models using the Prioré device.", url: null },
  { id: 5, title: "Phil. Trans. Royal Society — Whittaker EM Decomposition", type: "Academic Paper", category: "Scalar EM", year: 1904, authors: "E.T. Whittaker", tier: "free", abstract: "Foundational paper showing that any EM potential can be decomposed into two bidirectional longitudinal wave sets — the mathematical basis for scalar EM theory.", url: "https://royalsocietypublishing.org/doi/abs/10.1098/rsta.1904.0024" },
  { id: 6, title: "US Patent 3,280,816 — Tesla Longitudinal Wave Transmitter", type: "Patent", category: "Scalar EM", year: 1914, authors: "Nikola Tesla", tier: "free", abstract: "Original Tesla patent for longitudinal wave transmission apparatus based on Colorado Springs experiments.", url: "https://patents.google.com/patent/US1119732" },
  { id: 7, title: "DIA Document — Soviet Scalar EM Weapons Program", type: "Declassified Gov Document", category: "Scalar EM", year: 1978, authors: "Defense Intelligence Agency", tier: "pro", abstract: "Declassified DIA report documenting Soviet research into scalar electromagnetic weapons and psychotronic devices through the 1970s.", url: null },
  { id: 8, title: "US Patent 4,394,230 — Priore-Type Electromagnetic Device", type: "Patent", category: "Bioelectromagnetics", year: 1983, authors: "R.A. Clement", tier: "starter", abstract: "US patent adaptation of Prioré-type electromagnetic rotating field device for therapeutic applications.", url: "https://patents.google.com/patent/US4394230" },
  { id: 9, title: "US Patent 3,913,004 — Gray Tube Free Energy Device", type: "Patent", category: "Free Energy", year: 1975, authors: "Edwin Gray", tier: "starter", abstract: "Gray's 'cold electricity' tube for generating electrical energy via radiant energy collection from capacitor discharge spikes.", url: "https://patents.google.com/patent/US3913004" },
  { id: 10, title: "Planetary Association for Clean Energy — Vacuum Energy Review", type: "Technical Report", category: "Vacuum Energy", year: 1996, authors: "Multiple researchers", tier: "pro", abstract: "Comprehensive technical review of zero-point energy / vacuum energy extraction device claims, experimental results, and theoretical frameworks.", url: null },
  { id: 11, title: "US Patent 4,151,431 — Kromrey Generator", type: "Patent", category: "Free Energy", year: 1979, authors: "J.C. Kromrey", tier: "starter", abstract: "Rotating electromagnetic generator that reportedly achieves over-unity by using a specific magnet geometry to avoid back-EMF.", url: "https://patents.google.com/patent/US4151431" },
  { id: 12, title: "New Energy News — MEG Replication Results", type: "Technical Report", category: "Free Energy", year: 2003, authors: "Multiple independent researchers", tier: "pro", abstract: "Compiled independent replication reports for the MEG device, including successful and failed attempts with analysis of failure modes.", url: null },
];

const CATEGORIES = ["All", "Free Energy", "Scalar EM", "Bioelectromagnetics", "Vacuum Energy"];
const TYPES = ["All", "Patent", "Peer-Reviewed Journal", "Academic Paper", "Declassified Gov Document", "Technical Report"];
const TIER_ORDER = ["free", "starter", "pro", "elite"];

const TIER_COLORS = {
  free: "text-green-400 border-green-800 bg-green-950/30",
  starter: "text-cyan-400 border-cyan-800 bg-cyan-950/30",
  pro: "text-purple-400 border-purple-800 bg-purple-950/30",
};

export default function PatentSourceDocuments() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [docType, setDocType] = useState("All");
  const { tier } = useTier();
  const userTierIdx = TIER_ORDER.indexOf(tier);

  const filtered = DOCUMENTS.filter(doc => {
    const matchSearch = !search || doc.title.toLowerCase().includes(search.toLowerCase()) || doc.authors.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || doc.category === category;
    const matchType = docType === "All" || doc.type === docType;
    return matchSearch && matchCat && matchType;
  });

  const hasAccess = (doc) => userTierIdx >= TIER_ORDER.indexOf(doc.tier);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900/95 backdrop-blur px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/codextech-database" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-white font-black text-base">Patents & Source Documents</h1>
              <p className="text-gray-500 text-xs">{DOCUMENTS.length} primary source documents</p>
            </div>
          </div>
          <Link to="/codextech-pricing" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-black transition-colors">
            <Shield size={12} /> Full Access
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patents, authors..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-700"
            />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-cyan-700">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={docType} onChange={e => setDocType(e.target.value)}
            className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-cyan-700">
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mb-6 text-xs text-gray-500">
          <span>{filtered.length} documents</span>
          <span>·</span>
          <span>{filtered.filter(d => hasAccess(d)).length} accessible</span>
          <span>·</span>
          <span>{filtered.filter(d => d.url).length} with external links</span>
        </div>

        {/* Document grid */}
        <div className="space-y-3">
          {filtered.map(doc => {
            const accessible = hasAccess(doc);
            return (
              <div key={doc.id} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${accessible ? "border-gray-800 hover:border-gray-600" : "border-gray-800 opacity-80"}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{doc.type}</span>
                      <span className="text-xs text-gray-500">{doc.category}</span>
                      <span className="text-xs text-gray-600">{doc.year}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${TIER_COLORS[doc.tier] || ""}`}>
                        {doc.tier === "free" ? "Free" : doc.tier === "starter" ? "Starter+" : "Pro+"}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1 leading-snug">{doc.title}</h3>
                    <p className="text-gray-500 text-xs mb-2">{doc.authors}</p>
                    {accessible ? (
                      <p className="text-gray-400 text-xs leading-relaxed">{doc.abstract}</p>
                    ) : (
                      <p className="text-gray-600 text-xs italic">Abstract and full document available with membership upgrade.</p>
                    )}
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                    {doc.url && accessible && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-colors whitespace-nowrap">
                        <ExternalLink size={12} /> View Source
                      </a>
                    )}
                    {!accessible && (
                      <Link to="/codextech-pricing"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-950/40 border border-yellow-800 text-yellow-400 text-xs font-bold transition-colors whitespace-nowrap">
                        <Lock size={12} /> Unlock
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}