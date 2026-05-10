import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain, AlertTriangle, TrendingUp, Network, Layers, Zap,
  RefreshCw, Loader2, ChevronRight, ArrowRight, Eye,
  Activity, Shield, GitBranch, Search, X, CheckCircle2,
  Radio, Microscope, Globe, BarChart3, Target, Radar,
  ArrowLeft, Cpu, FlaskConical, AlertCircle, Info,
  BookOpen, FileText, Star, Hash, Link2
} from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Helpers ───────────────────────────────────────────────────────────────────

function severityStyle(s) {
  if (s === "critical") return { color: "#ef4444", bg: "#ef444415", border: "#ef444440" };
  if (s === "warning") return { color: "#f97316", bg: "#f9731615", border: "#f9731640" };
  if (s === "success") return { color: "#22c55e", bg: "#22c55e15", border: "#22c55e40" };
  return { color: "#06b6d4", bg: "#06b6d415", border: "#06b6d440" };
}

function SeverityDot({ s, pulse }) {
  const c = severityStyle(s).color;
  return (
    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${pulse && s === "critical" ? "animate-pulse" : ""}`}
      style={{ backgroundColor: c }} />
  );
}

function ModuleBadge({ module }) {
  const MAP = {
    InsightEngine: { icon: Brain, color: "#fbbf24", label: "Insight" },
    ThreatMonitor: { icon: Radar, color: "#ef4444", label: "Threat" },
    OpportunityEngine: { icon: TrendingUp, color: "#22c55e", label: "Opportunity" },
    EntityLinker: { icon: Link2, color: "#3b82f6", label: "Entity" },
    ClusterDetection: { icon: Layers, color: "#a855f7", label: "Cluster" },
  };
  const m = MAP[module] || { icon: Brain, color: "#6b7280", label: module };
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase"
      style={{ backgroundColor: m.color + "20", color: m.color }}>
      <Icon size={8} /> {m.label}
    </span>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EventCard({ event, onAck }) {
  const [expanded, setExpanded] = useState(false);
  const style = severityStyle(event.severity);

  return (
    <div className="rounded-xl border overflow-hidden transition-all"
      style={{ borderColor: expanded ? style.border : "#1e293b", backgroundColor: expanded ? style.bg : "#0f172a" }}>
      <button className="w-full text-left px-4 py-3 flex items-start gap-3" onClick={() => setExpanded(e => !e)}>
        <SeverityDot s={event.severity} pulse />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <ModuleBadge module={event.module} />
            {event.score && (
              <span className="text-[9px] font-bold text-slate-500">score: {event.score}</span>
            )}
            {event.acknowledged && (
              <span className="text-[9px] text-green-600 flex items-center gap-0.5"><CheckCircle2 size={8} /> acked</span>
            )}
          </div>
          <p className="text-slate-200 text-xs font-semibold leading-snug">{event.title}</p>
          {!expanded && <p className="text-slate-600 text-[10px] mt-0.5 truncate">{event.body}</p>}
        </div>
        <ChevronRight size={12} className={`text-slate-600 flex-shrink-0 mt-1 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">{event.body}</p>

          {event.patch && (
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
              <p className="text-[9px] font-black text-cyan-400 uppercase tracking-wider mb-1.5">Auto-Generated Patch</p>
              <p className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-line font-mono">{event.patch}</p>
            </div>
          )}

          {(event.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.map((t, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 text-[9px]">#{t}</span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {event.action_url && (
              <Link to={event.action_url}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
                style={{ backgroundColor: style.color + "30", border: `1px solid ${style.border}`, color: style.color }}>
                Take Action <ArrowRight size={10} />
              </Link>
            )}
            {!event.acknowledged && (
              <button onClick={() => onAck(event.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all">
                <CheckCircle2 size={10} /> Acknowledge
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ClusterCard({ cluster }) {
  const TYPE_COLORS = {
    physics_principle: "#06b6d4",
    market: "#22c55e",
    claim_structure: "#a855f7",
    prior_art: "#f97316",
  };
  const color = TYPE_COLORS[cluster.cluster_type] || "#6b7280";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + "20" }}>
          <Layers size={14} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-xs leading-snug">{cluster.label}</p>
          <p className="text-slate-500 text-[10px] mt-0.5 capitalize">{cluster.cluster_type?.replace(/_/g, " ")}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-black text-lg" style={{ color }}>{cluster.size}</p>
          <p className="text-[9px] text-slate-600">members</p>
        </div>
      </div>
      <p className="text-slate-400 text-[11px] leading-relaxed mb-3">{cluster.description}</p>
      {/* Cohesion bar */}
      <div>
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-slate-600">Cohesion</span>
          <span style={{ color }} className="font-bold">{Math.round((cluster.cohesion_score || 0) * 100)}%</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${(cluster.cohesion_score || 0) * 100}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

function EntityLinkCard({ link }) {
  const RELATION_COLOR = {
    cites: "#06b6d4",
    conflicts_with: "#ef4444",
    extends: "#22c55e",
    invalidates: "#f97316",
    belongs_to: "#a855f7",
    competes_with: "#f59e0b",
    licenses_to: "#3b82f6",
    clusters_with: "#8b5cf6",
  };
  const color = RELATION_COLOR[link.relation] || "#6b7280";

  return (
    <div className="flex items-center gap-2 py-2 border-b border-slate-800 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-slate-200 text-[11px] font-semibold truncate">{link.from_label}</p>
        <p className="text-slate-600 text-[9px] uppercase">{link.from_type}</p>
      </div>
      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
        <div className="h-px w-8 relative" style={{ backgroundColor: color + "60" }}>
          <ArrowRight size={8} style={{ color }} className="absolute -right-1 -top-1" />
        </div>
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: color + "20" }}>
          {link.relation?.replace(/_/g, " ")}
        </span>
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="text-slate-200 text-[11px] font-semibold truncate">{link.to_label}</p>
        <p className="text-slate-600 text-[9px] uppercase">{link.to_type}</p>
      </div>
    </div>
  );
}

// ── Module Sidebar ────────────────────────────────────────────────────────────

const MODULES = [
  { id: "all", icon: Brain, label: "All Modules", color: "#06b6d4" },
  { id: "InsightEngine", icon: Microscope, label: "Insight Engine", color: "#fbbf24" },
  { id: "ThreatMonitor", icon: Radar, label: "Threat Monitor", color: "#ef4444" },
  { id: "OpportunityEngine", icon: TrendingUp, label: "Opportunity Engine", color: "#22c55e" },
  { id: "EntityLinker", icon: Link2, label: "Entity Linker", color: "#3b82f6" },
  { id: "ClusterDetection", icon: Layers, label: "Cluster Detection", color: "#a855f7" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function IntelligenceLayer() {
  const [events, setEvents] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [activeModule, setActiveModule] = useState("all");
  const [activeTab, setActiveTab] = useState("events");
  const [search, setSearch] = useState("");
  const [filterSev, setFilterSev] = useState("all");
  const [stats, setStats] = useState({ critical: 0, warnings: 0, opportunities: 0, clusters: 0, links: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evts, cls, lnks] = await Promise.all([
        base44.entities.IntelEvent.list("-created_date", 50),
        base44.entities.IntelCluster.list("-created_date", 30),
        base44.entities.EntityLink.list("-created_date", 40),
      ]);
      const e = evts || [], c = cls || [], l = lnks || [];
      setEvents(e);
      setClusters(c);
      setLinks(l);
      setStats({
        critical: e.filter(ev => ev.severity === "critical").length,
        warnings: e.filter(ev => ev.severity === "warning").length,
        opportunities: e.filter(ev => ev.type === "opportunity").length,
        clusters: c.length,
        links: l.length,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const runEngine = async (mod = "all") => {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await base44.functions.invoke("intelligenceEngine", { module: mod, force: true });
      setRunResult(res.data?.summary || {});
      await loadData();
    } catch (err) {
      setRunResult({ error: err.message });
    }
    setRunning(false);
  };

  const acknowledgeEvent = async (id) => {
    await base44.entities.IntelEvent.update(id, { acknowledged: true }).catch(() => {});
    setEvents(prev => prev.map(e => e.id === id ? { ...e, acknowledged: true } : e));
  };

  // Filtering
  const filteredEvents = events.filter(e => {
    if (activeModule !== "all" && e.module !== activeModule) return false;
    if (filterSev !== "all" && e.severity !== filterSev) return false;
    if (search && !e.title?.toLowerCase().includes(search.toLowerCase()) && !e.body?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredClusters = clusters.filter(c => {
    if (search && !c.label?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredLinks = links.filter(l => {
    if (search && !l.from_label?.toLowerCase().includes(search.toLowerCase()) && !l.to_label?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const TABS = [
    { id: "events", label: "Events", count: filteredEvents.length, icon: Activity },
    { id: "clusters", label: "Clusters", count: filteredClusters.length, icon: Layers },
    { id: "links", label: "Entity Links", count: filteredLinks.length, icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">

      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-slate-950/98 backdrop-blur border-b border-slate-800 px-5 py-3">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/ai-os" className="text-slate-500 hover:text-slate-200 flex items-center gap-1 text-xs">
              <ArrowLeft size={12} /> Back
            </Link>
            <div className="w-px h-4 bg-slate-800" />
            <div>
              <h1 className="text-white font-black text-base flex items-center gap-2">
                <Brain size={16} className="text-cyan-400" /> Intelligence Layer
              </h1>
              <p className="text-slate-600 text-[10px] uppercase tracking-widest">Microservice · Real-time · Semantic · Entity-linked</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stats row */}
            <div className="hidden lg:flex items-center gap-3 mr-2">
              {[
                { label: "Critical", val: stats.critical, color: "#ef4444" },
                { label: "Warnings", val: stats.warnings, color: "#f97316" },
                { label: "Opportunities", val: stats.opportunities, color: "#22c55e" },
                { label: "Clusters", val: stats.clusters, color: "#a855f7" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-black text-sm" style={{ color: s.color }}>{s.val}</p>
                  <p className="text-[9px] text-slate-600">{s.label}</p>
                </div>
              ))}
            </div>

            <button onClick={() => loadData()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all">
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Refresh
            </button>

            <button onClick={() => runEngine(activeModule)}
              disabled={running}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-black transition-all disabled:opacity-50"
              style={{ background: running ? "#1e293b" : "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
              {running ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />}
              {running ? "Running..." : "Run Engine"}
            </button>
          </div>
        </div>
      </div>

      {/* Run Result Banner */}
      {runResult && !running && (
        <div className={`px-5 py-2.5 text-xs font-semibold border-b flex items-center gap-3 ${runResult.error ? "bg-red-950/40 border-red-900 text-red-300" : "bg-emerald-950/40 border-emerald-900 text-emerald-300"}`}>
          {runResult.error ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
          {runResult.error ? `Error: ${runResult.error}` :
            `Engine complete: ${runResult.events_generated || 0} events · ${runResult.clusters_detected || 0} clusters · ${runResult.entity_links_created || 0} links`}
          <button onClick={() => setRunResult(null)} className="ml-auto text-slate-500 hover:text-slate-300"><X size={12} /></button>
        </div>
      )}

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-5 py-5 gap-5">

        {/* ── Left: Module Sidebar ── */}
        <aside className="w-44 flex-shrink-0 space-y-1">
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-2 mb-2">Modules</p>
          {MODULES.map(mod => {
            const Icon = mod.icon;
            const active = activeModule === mod.id;
            return (
              <button key={mod.id} onClick={() => setActiveModule(mod.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  active ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                }`}
                style={active ? { borderLeft: `2px solid ${mod.color}`, paddingLeft: 10 } : {}}>
                <Icon size={12} style={{ color: active ? mod.color : undefined }} />
                {mod.label}
              </button>
            );
          })}

          <div className="pt-4 space-y-1">
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-2 mb-2">Run Specific</p>
            {MODULES.slice(1).map(mod => (
              <button key={mod.id} onClick={() => runEngine(mod.id)}
                disabled={running}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-600 hover:text-slate-300 hover:bg-slate-900 transition-all disabled:opacity-40">
                <Zap size={9} style={{ color: mod.color }} />
                Run {mod.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Right: Main Content ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Search + Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search events, clusters, links..."
                className="w-full pl-8 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-slate-600" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"><X size={10} /></button>}
            </div>
            <select value={filterSev} onChange={e => setFilterSev(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none">
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Opportunity</option>
            </select>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 gap-0.5">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                    activeTab === tab.id ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}>
                  <Icon size={11} />
                  {tab.label}
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
                    style={{ backgroundColor: activeTab === tab.id ? "#1e293b" : "#0f172a", color: activeTab === tab.id ? "#e2e8f0" : "#475569" }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={20} className="animate-spin text-cyan-400" />
              <p className="text-slate-600 text-sm">Loading intelligence data...</p>
            </div>
          ) : (
            <>
              {/* Events Tab */}
              {activeTab === "events" && (
                <div className="space-y-2">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <Brain size={28} className="text-slate-700 mx-auto" />
                      <p className="text-slate-500 text-sm font-semibold">No intelligence events yet</p>
                      <p className="text-slate-700 text-xs">Click "Run Engine" to generate insights, threats, and opportunities from your portfolio data.</p>
                      <button onClick={() => runEngine()}
                        className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-lg text-white text-sm font-black"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
                        <Zap size={14} /> Run Intelligence Engine
                      </button>
                    </div>
                  ) : (
                    filteredEvents.map(event => (
                      <EventCard key={event.id} event={event} onAck={acknowledgeEvent} />
                    ))
                  )}
                </div>
              )}

              {/* Clusters Tab */}
              {activeTab === "clusters" && (
                <div>
                  {filteredClusters.length === 0 ? (
                    <div className="text-center py-16">
                      <Layers size={28} className="text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No clusters detected yet. Run the Cluster Detection module.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredClusters.map(cluster => (
                        <ClusterCard key={cluster.id} cluster={cluster} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Entity Links Tab */}
              {activeTab === "links" && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                    <Link2 size={13} className="text-blue-400" />
                    <span className="text-white font-black text-xs">Entity Relationship Graph — {filteredLinks.length} links</span>
                  </div>
                  {filteredLinks.length === 0 ? (
                    <div className="text-center py-12 text-slate-600 text-sm">
                      No entity links yet. Run the Entity Linker module.
                    </div>
                  ) : (
                    <div className="px-4 py-2 max-h-[600px] overflow-y-auto">
                      {filteredLinks.map(link => (
                        <EntityLinkCard key={link.id} link={link} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Bottom disclaimer ── */}
      <div className="border-t border-slate-800 px-5 py-3 text-[9px] text-slate-700 text-center">
        Intelligence Layer v1.0 · Microservice-style modules · Real-time event stream · Semantic entity linking · Patent-sourced analysis
      </div>
    </div>
  );
}