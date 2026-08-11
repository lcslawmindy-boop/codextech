import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, Filter, Database, Layers, Clock, Shield,
  ChevronDown, X, AlertTriangle, FileText, Cpu
} from "lucide-react";
import {
  RESEARCH_NODES, CONNECTION_EDGES, DEVICE_BUILD_PLANS, SUPPRESSION_TIMELINE,
  FILTER_DIMENSIONS, DOMAIN_COLORS, SUPPRESSION_COLORS, CONNECTION_TYPES,
  LEGAL_NOTICE,
} from "@/lib/researchGraphExpansion";
import ResearchNodeCard from "@/components/ResearchNodeCard";
import DeviceBuildPlanCard from "@/components/DeviceBuildPlanCard";
import SuppressionTimelineView from "@/components/SuppressionTimelineView";

export default function ResearchGraphExplorer() {
  const [activeView, setActiveView] = useState("nodes");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    technologyDomain: [],
    suppressionLevel: [],
    evidenceQuality: [],
    targetSystem: [],
    deviceIntegration: [],
    ipOpportunity: [],
    population: [],
  });

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return RESEARCH_NODES.filter(node => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = [
          node.title, node.description, node.domain,
          ...(node.researchers || []),
          ...(node.tags || []),
        ].join(" ").toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      // Filters
      if (filters.technologyDomain.length > 0 && !filters.technologyDomain.includes(node.domain)) return false;
      if (filters.suppressionLevel.length > 0 && !filters.suppressionLevel.includes(node.suppressionLevel)) return false;
      if (filters.evidenceQuality.length > 0 && !filters.evidenceQuality.includes(node.evidenceQuality)) return false;
      if (filters.targetSystem.length > 0 && !filters.targetSystem.includes(node.targetSystem)) return false;
      if (filters.deviceIntegration.length > 0 && !filters.deviceIntegration.includes(node.deviceIntegration)) return false;
      if (filters.ipOpportunity.length > 0 && !filters.ipOpportunity.includes(node.ipOpportunity)) return false;
      if (filters.population.length > 0 && !filters.population.some(p => node.population?.includes(p))) return false;
      return true;
    });
  }, [searchQuery, filters]);

  const toggleFilter = (dimension, value) => {
    setFilters(prev => ({
      ...prev,
      [dimension]: prev[dimension].includes(value)
        ? prev[dimension].filter(v => v !== value)
        : [...prev[dimension], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      technologyDomain: [], suppressionLevel: [], evidenceQuality: [],
      targetSystem: [], deviceIntegration: [], ipOpportunity: [], population: [],
    });
  };

  const activeFilterCount = Object.values(filters).flat().length;

  // Connection stats
  const connectionStats = useMemo(() => {
    const typeCount = {};
    CONNECTION_EDGES.forEach(edge => {
      typeCount[edge.type] = (typeCount[edge.type] || 0) + 1;
    });
    return typeCount;
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Graph
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <Database size={16} className="text-cyan-400" />
            <div>
              <h1 className="text-white font-black text-lg">ZARP Research Intelligence Engine</h1>
              <p className="text-gray-500 text-xs">{RESEARCH_NODES.length} research nodes · {CONNECTION_EDGES.length} connections · {DEVICE_BUILD_PLANS.length} device build plans</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/portfolio-strategy" className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-colors">
              Strategy →
            </Link>
            <Link to="/medbed-showcase" className="px-3 py-2 rounded-lg bg-cyan-900/30 border border-cyan-800 text-cyan-300 text-xs font-bold hover:bg-cyan-900/50 transition-colors">
              MedBed →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Legal Notice */}
        <div className="rounded-xl bg-amber-950/20 border border-amber-800/40 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200/70 text-[11px] leading-relaxed">{LEGAL_NOTICE}</p>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "nodes", label: "Research Nodes", icon: <Database size={14} />, count: RESEARCH_NODES.length },
            { id: "connections", label: "Connection Edges", icon: <Layers size={14} />, count: CONNECTION_EDGES.length },
            { id: "devices", label: "Device Build Plans", icon: <Cpu size={14} />, count: DEVICE_BUILD_PLANS.length },
            { id: "timeline", label: "Suppression Timeline", icon: <Clock size={14} />, count: SUPPRESSION_TIMELINE.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                activeView === tab.id ? "bg-white/10 border-white/20 text-white" : "border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon}{tab.label}
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-800 text-gray-400">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── NODES VIEW ── */}
        {activeView === "nodes" && (
          <div className="space-y-4">
            {/* Search + Filter bar */}
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, researcher, technology, frequency, or tag..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                  showFilters || activeFilterCount > 0 ? "bg-cyan-900/30 border-cyan-700 text-cyan-300" : "border-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                <Filter size={14} /> Filters
                {activeFilterCount > 0 && <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-700 text-white">{activeFilterCount}</span>}
              </button>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white">
                  <X size={14} /> Clear
                </button>
              )}
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
                {Object.entries(FILTER_DIMENSIONS).map(([dim, values]) => (
                  <div key={dim}>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{dim.replace(/([A-Z])/g, " $1").trim()}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {values.map(value => {
                        const active = filters[dim].includes(value);
                        const colorMap = dim === "technologyDomain" ? DOMAIN_COLORS : dim === "suppressionLevel" ? SUPPRESSION_COLORS : {};
                        const color = colorMap[value] || "#6b7280";
                        return (
                          <button
                            key={value}
                            onClick={() => toggleFilter(dim, value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                              active ? "text-white" : "text-gray-400 border-gray-700 hover:border-gray-600"
                            }`}
                            style={active ? { backgroundColor: color + "30", borderColor: color, color } : {}}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results count */}
            <p className="text-gray-500 text-xs">
              Showing {filteredNodes.length} of {RESEARCH_NODES.length} nodes
            </p>

            {/* Node grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredNodes.map(node => <ResearchNodeCard key={node.id} node={node} />)}
            </div>

            {filteredNodes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No nodes match your search. Try clearing filters.</p>
              </div>
            )}
          </div>
        )}

        {/* ── CONNECTIONS VIEW ── */}
        {activeView === "connections" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={18} className="text-purple-400" />
              <h3 className="text-white font-bold text-lg">Connection Edges</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {CONNECTION_EDGES.length} connection edges between research nodes. Each edge represents a relationship
              between two technologies — frequency overlap, shared physics, engineering synergy, historical lineage, or suppression patterns.
            </p>

            {/* Connection type legend */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(CONNECTION_TYPES).map(([type, info]) => (
                <div key={type} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                  <span className="text-xs text-gray-400">{info.label}</span>
                  <span className="text-[10px] text-gray-600">({connectionStats[type] || 0})</span>
                </div>
              ))}
            </div>

            {/* Edge list */}
            <div className="space-y-2">
              {CONNECTION_EDGES.map((edge, i) => {
                const typeInfo = CONNECTION_TYPES[edge.type];
                const sourceNode = RESEARCH_NODES.find(n => n.id === edge.source);
                const targetNode = RESEARCH_NODES.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                return (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: typeInfo.color + "20", color: typeInfo.color }}>{typeInfo.label}</span>
                      <span className="text-gray-600 text-[10px]">Strength: {edge.strength}/10</span>
                      {edge.deviceIntegration === "YES" && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-900/40 text-green-300">Device Integration</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-300 font-semibold flex-1">{sourceNode.title}</span>
                      <span style={{ color: typeInfo.color }}>→</span>
                      <span className="text-gray-300 font-semibold flex-1 text-right">{targetNode.title}</span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-1.5 leading-relaxed">{edge.mechanism}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DEVICE BUILD PLANS VIEW ── */}
        {activeView === "devices" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={18} className="text-green-400" />
              <h3 className="text-white font-bold text-lg">Device Build Plans</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {DEVICE_BUILD_PLANS.length} innovation device build plans integrating connected research node clusters.
              Each plan is a CONCEPT framework — to be validated by manufacturer. All plans include IP opportunity and regulatory pathway concepts.
            </p>
            <div className="space-y-4">
              {DEVICE_BUILD_PLANS.map(plan => <DeviceBuildPlanCard key={plan.code} plan={plan} />)}
            </div>
          </div>
        )}

        {/* ── SUPPRESSION TIMELINE VIEW ── */}
        {activeView === "timeline" && (
          <SuppressionTimelineView timeline={SUPPRESSION_TIMELINE} />
        )}
      </div>
    </div>
  );
}