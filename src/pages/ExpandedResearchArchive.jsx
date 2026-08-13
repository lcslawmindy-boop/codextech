import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, AlertTriangle, Sparkles, Brain, Heart, Shield, Zap, Leaf, Eye, Flame, Dna, Atom, BookOpen, Lock, ChevronDown, ChevronUp, Package, DollarSign, TrendingUp, FlaskConical, Crown } from "lucide-react";
import { SUPPRESSED_INVENTORS, VEDIC_HEALING_CONCEPTS, OCCULT_ESOTERIC, PATENT_SUPPRESSION } from "../lib/expandedResearchNodes";
import { NEW_INVENTIONS } from "../lib/newInventions";
import MasterExportButton from "../components/MasterExportButton";

const CATEGORIES = [
  { id: "suppressed", label: "Suppressed Technology", icon: <Zap size={16} />, color: "red", count: SUPPRESSED_INVENTORS.length },
  { id: "vedic", label: "Vedic Healing", icon: <Leaf size={16} />, color: "green", count: VEDIC_HEALING_CONCEPTS.length },
  { id: "occult", label: "Occult & Esoteric", icon: <Eye size={16} />, color: "purple", count: OCCULT_ESOTERIC.length },
  { id: "patents", label: "Patent Suppression", icon: <Lock size={16} />, color: "orange", count: PATENT_SUPPRESSION.length },
  { id: "inventions", label: "50 New Merged Inventions", icon: <Sparkles size={16} />, color: "cyan", count: NEW_INVENTIONS.length },
];

const COLOR_MAP = {
  red: { bg: "bg-red-950/30", border: "border-red-800/50", text: "text-red-400", badge: "bg-red-950/60 text-red-400 border-red-800" },
  green: { bg: "bg-green-950/30", border: "border-green-800/50", text: "text-green-400", badge: "bg-green-950/60 text-green-400 border-green-800" },
  purple: { bg: "bg-purple-950/30", border: "border-purple-800/50", text: "text-purple-400", badge: "bg-purple-950/60 text-purple-400 border-purple-800" },
  orange: { bg: "bg-orange-950/30", border: "border-orange-800/50", text: "text-orange-400", badge: "bg-orange-950/60 text-orange-400 border-orange-800" },
  cyan: { bg: "bg-cyan-950/30", border: "border-cyan-800/50", text: "text-cyan-400", badge: "bg-cyan-950/60 text-cyan-400 border-cyan-800" },
};

function SuppressedTechCard({ inv }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-5 py-4 hover:bg-gray-800/50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm mb-1">{inv.title}</h4>
            <p className="text-gray-500 text-xs">{inv.inventor} · {inv.year} · {inv.category}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inv.risk >= 80 ? "bg-red-950/60 text-red-400 border border-red-800" : inv.risk >= 60 ? "bg-orange-950/60 text-orange-400 border border-orange-800" : "bg-yellow-950/60 text-yellow-400 border border-yellow-800"}`}>
              Risk {inv.risk}
            </span>
            {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-4 space-y-3">
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">Patent</p>
            <p className="text-gray-300 text-xs">{inv.patent}</p>
          </div>
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">Description</p>
            <p className="text-gray-300 text-xs leading-relaxed">{inv.description}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-800/30">
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle size={10} className="text-red-500" /> Suppression</p>
            <p className="text-red-300/70 text-xs leading-relaxed">{inv.suppression}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {inv.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">{t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

function VedicHealingCard({ concept }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-5 py-4 hover:bg-gray-800/50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm mb-1">{concept.concept}</h4>
            <p className="text-gray-500 text-xs italic">{concept.source}</p>
          </div>
          {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-4 space-y-3">
          <p className="text-gray-300 text-xs leading-relaxed">{concept.description}</p>
          <div className="p-2.5 rounded-lg bg-green-950/20 border border-green-800/30">
            <p className="text-green-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Sparkles size={10} className="text-green-500" /> Application</p>
            <p className="text-green-300/70 text-xs leading-relaxed">{concept.application}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {concept.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">{t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

function OccultCard({ concept }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-5 py-4 hover:bg-gray-800/50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm mb-1">{concept.concept}</h4>
            <p className="text-gray-500 text-xs italic">{concept.source}</p>
          </div>
          {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-4 space-y-3">
          <p className="text-gray-300 text-xs leading-relaxed">{concept.description}</p>
          <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-800/30">
            <p className="text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Sparkles size={10} className="text-purple-500" /> Application</p>
            <p className="text-purple-300/70 text-xs leading-relaxed">{concept.application}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {concept.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">{t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

function PatentSuppressionCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-5 py-4 hover:bg-gray-800/50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
          </div>
          {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-4 space-y-3">
          <p className="text-gray-300 text-xs leading-relaxed">{item.description}</p>
          <div className="p-2.5 rounded-lg bg-orange-950/20 border border-orange-800/30">
            <p className="text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp size={10} className="text-orange-500" /> Impact</p>
            <p className="text-orange-300/70 text-xs leading-relaxed">{item.impact}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">{t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

function InventionCard({ inv }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`rounded-xl border overflow-hidden ${expanded ? "border-cyan-700" : "border-gray-800"} bg-gradient-to-br from-gray-900 to-gray-950`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-5 py-4 hover:bg-gray-800/30 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-400 font-mono text-[10px] font-bold">{inv.id.toUpperCase()}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800">{inv.category}</span>
            </div>
            <h4 className="text-white font-bold text-sm mb-1">{inv.name}</h4>
            <p className="text-gray-500 text-xs">{inv.fusion}</p>
          </div>
          {expanded ? <ChevronUp size={14} className="text-cyan-400" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-4 space-y-3">
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Atom size={10} /> Mechanism</p>
            <p className="text-gray-300 text-xs leading-relaxed">{inv.mechanism}</p>
          </div>
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Package size={10} /> Components</p>
            <div className="flex flex-wrap gap-1">
              {inv.components.map((c, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">{c}</span>)}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Shield size={10} /> Patent Claims</p>
            <ul className="space-y-1">
              {inv.patentClaims.map((c, i) => <li key={i} className="text-gray-300 text-xs leading-relaxed flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span> {c}</li>)}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="p-2.5 rounded-lg bg-green-950/20 border border-green-800/30">
              <p className="text-green-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><DollarSign size={10} /> Market</p>
              <p className="text-green-300/70 text-xs">{inv.market}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-800/30">
              <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><FlaskConical size={10} /> Build Plan</p>
              <p className="text-blue-300/70 text-xs">{inv.buildPlan}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30">
              <p className="text-amber-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><BookOpen size={10} /> Digital Products</p>
              <div className="flex flex-wrap gap-1">
                {inv.digitalProducts.map((p, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-800/50">{p}</span>)}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {inv.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">{t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExpandedResearchArchive() {
  const [activeCategory, setActiveCategory] = useState("inventions");
  const [search, setSearch] = useState("");

  const filteredInventions = useMemo(() => {
    if (!search) return NEW_INVENTIONS;
    const q = search.toLowerCase();
    return NEW_INVENTIONS.filter(i => i.name.toLowerCase().includes(q) || i.fusion.toLowerCase().includes(q) || i.tags.some(t => t.includes(q)));
  }, [search]);

  const filteredSuppressed = useMemo(() => {
    if (!search) return SUPPRESSED_INVENTORS;
    const q = search.toLowerCase();
    return SUPPRESSED_INVENTORS.filter(i => i.title.toLowerCase().includes(q) || i.inventor.toLowerCase().includes(q) || i.tags.some(t => t.includes(q)));
  }, [search]);

  const filteredVedic = useMemo(() => {
    if (!search) return VEDIC_HEALING_CONCEPTS;
    const q = search.toLowerCase();
    return VEDIC_HEALING_CONCEPTS.filter(c => c.concept.toLowerCase().includes(q) || c.tags.some(t => t.includes(q)));
  }, [search]);

  const filteredOccult = useMemo(() => {
    if (!search) return OCCULT_ESOTERIC;
    const q = search.toLowerCase();
    return OCCULT_ESOTERIC.filter(c => c.concept.toLowerCase().includes(q) || c.tags.some(t => t.includes(q)));
  }, [search]);

  const filteredPatents = useMemo(() => {
    if (!search) return PATENT_SUPPRESSION;
    const q = search.toLowerCase();
    return PATENT_SUPPRESSION.filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
  }, [search]);

  const totalNodes = SUPPRESSED_INVENTORS.length + VEDIC_HEALING_CONCEPTS.length + OCCULT_ESOTERIC.length + PATENT_SUPPRESSION.length;
  const totalInventions = NEW_INVENTIONS.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Link to="/therapy-pod-pro" className="flex items-center gap-1 text-gray-400 text-sm hover:text-white">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Therapy Pod</span>
          </Link>
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-amber-400" />
            <h1 className="text-sm font-bold hidden sm:inline">Expanded Research Archive</h1>
            <MasterExportButton />
          </div>
        </div>
        <p className="text-gray-500 text-xs mb-3">
          {totalNodes} research nodes + {totalInventions} merged inventions · Suppressed tech, Vedic medicine, occult knowledge & concept fusion
        </p>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventors, concepts, inventions..."
            className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-600 focus:border-cyan-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const colors = COLOR_MAP[cat.color];
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id ? `${colors.bg} ${colors.border} ${colors.text}` : "bg-gray-900 border border-gray-800 text-gray-500"
                }`}
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeCategory === cat.id ? colors.badge : "bg-gray-800 text-gray-500"}`}>{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        {/* Suppressed Technology */}
        {activeCategory === "suppressed" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-red-400" />
              <h2 className="text-white font-bold text-sm">Suppressed Technology Inventors & Patents</h2>
            </div>
            {filteredSuppressed.map((inv) => <SuppressedTechCard key={inv.id} inv={inv} />)}
          </div>
        )}

        {/* Vedic Healing */}
        {activeCategory === "vedic" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={16} className="text-green-400" />
              <h2 className="text-white font-bold text-sm">Vedic Medicinal Healing Concepts</h2>
            </div>
            {filteredVedic.map((c) => <VedicHealingCard key={c.id} concept={c} />)}
          </div>
        )}

        {/* Occult & Esoteric */}
        {activeCategory === "occult" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={16} className="text-purple-400" />
              <h2 className="text-white font-bold text-sm">Forbidden Occult & Esoteric Knowledge</h2>
            </div>
            {filteredOccult.map((c) => <OccultCard key={c.id} concept={c} />)}
          </div>
        )}

        {/* Patent Suppression */}
        {activeCategory === "patents" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={16} className="text-orange-400" />
              <h2 className="text-white font-bold text-sm">Patent Suppression Cases</h2>
            </div>
            {filteredPatents.map((p) => <PatentSuppressionCard key={p.id} item={p} />)}
          </div>
        )}

        {/* 50 New Inventions */}
        {activeCategory === "inventions" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400" />
                <h2 className="text-white font-bold text-sm">50 New Merged Inventions</h2>
                <span className="text-gray-600 text-xs">({filteredInventions.length})</span>
              </div>
              <MasterExportButton />
            </div>
            <p className="text-gray-500 text-xs mb-3">
              Each invention merges concepts from suppressed technology, Vedic medicine, occult/esoteric knowledge, and scalar-EM engineering to create new devices that advance humanity.
            </p>
            {filteredInventions.map((inv) => <InventionCard key={inv.id} inv={inv} />)}
          </div>
        )}
      </div>

      {/* Footer summary */}
      <div className="px-4 py-6 mt-4">
        <div className="bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-800/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Dna size={18} className="text-cyan-400" />
            <h3 className="text-white font-bold text-sm">Research Network Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
              <p className="text-2xl font-black text-red-400">{SUPPRESSED_INVENTORS.length}</p>
              <p className="text-gray-500">Suppressed Inventors</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
              <p className="text-2xl font-black text-green-400">{VEDIC_HEALING_CONCEPTS.length}</p>
              <p className="text-gray-500">Vedic Concepts</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
              <p className="text-2xl font-black text-purple-400">{OCCULT_ESOTERIC.length}</p>
              <p className="text-gray-500">Occult/Esoteric</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
              <p className="text-2xl font-black text-orange-400">{PATENT_SUPPRESSION.length}</p>
              <p className="text-gray-500">Suppression Cases</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 border border-cyan-800 col-span-2">
              <p className="text-3xl font-black text-cyan-400">{NEW_INVENTIONS.length}</p>
              <p className="text-gray-500">New Merged Inventions</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <Link to="/therapy-pod-pro" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800 text-cyan-400 text-xs font-bold hover:bg-cyan-900/40 transition-colors">
              <Heart size={14} /> View Therapy Pod Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}