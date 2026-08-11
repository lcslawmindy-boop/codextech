import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Plus, Save } from "lucide-react";
import { DOMAINS, EVIDENCE_LEVELS, SUPPRESSION_STATUS, TARGET_SYSTEMS, POPULATIONS } from "@/lib/researchGraphData";

export default function FilterPanel({ filters, setFilters, nodeCounts, edgeCount }) {
  const [expanded, setExpanded] = useState({ domain: true, evidence: false, suppression: false, target: false, freq: false, population: false, device: false, era: false, connections: false });
  const [savedFilters, setSavedFilters] = useState([
    { name: "ASD Focus", filters: { domains: ["bioelectromagnetics", "neurostimulation"], evidence: [], suppression: [], targetSystems: ["Neurological"], minConnections: 0, eraMin: null, eraMax: null } },
    { name: "Veteran Stack", filters: { domains: ["bioelectromagnetics", "neurostimulation", "suppressed_em"], evidence: [], suppression: [], targetSystems: ["Neurological"], minConnections: 0, eraMin: null, eraMax: null } },
    { name: "Scalar Only", filters: { domains: ["scalar_em"], evidence: [], suppression: [], targetSystems: [], minConnections: 0, eraMin: null, eraMax: null } },
  ]);

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const toggleArray = (key, val) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val],
    }));
  };

  const resetAll = () => {
    setFilters({ domains: [], evidence: [], suppression: [], targetSystems: [], minConnections: 0, eraMin: null, eraMax: null, freqMin: null, freqMax: null, population: [], deviceIntegration: [] });
  };

  const activeCount = filters.domains.length + filters.evidence.length + filters.suppression.length + filters.targetSystems.length + (filters.minConnections > 0 ? 1 : 0) + (filters.eraMin ? 1 : 0);

  const Section = ({ id, label, children, defaultOpen }) => (
    <div className="border-b border-[#21262D]">
      <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-[#161B22] transition-colors">
        <span className="text-[#F0F6FF] text-xs font-bold">{label}</span>
        {expanded[id] ? <ChevronUp size={12} className="text-[#8B9AB0]" /> : <ChevronDown size={12} className="text-[#8B9AB0]" />}
      </button>
      {expanded[id] && <div className="px-3 pb-3">{children}</div>}
    </div>
  );

  return (
    <div className="w-[280px] flex-shrink-0 bg-[#0D1117] border-r border-[#21262D] flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-3 border-b border-[#21262D] flex items-center justify-between">
        <span className="text-[#C9A84C] text-xs font-black tracking-wider" style={{ fontFamily: "Orbitron, sans-serif" }}>FILTERS</span>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-[9px] font-bold">{activeCount} active</span>
          )}
          {activeCount > 0 && (
            <button onClick={resetAll} className="text-[#8B9AB0] text-[10px] hover:text-[#C9A84C] transition-colors flex items-center gap-1">
              <RotateCcw size={10} /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Domain */}
        <Section id="domain" label="Technology Domain">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => update("domains", DOMAINS.map(d => d.id))} className="text-[#C9A84C] text-[9px] hover:underline">Select All</button>
            <button onClick={() => update("domains", [])} className="text-[#8B9AB0] text-[9px] hover:underline">Clear All</button>
          </div>
          {DOMAINS.map(d => (
            <button key={d.id} onClick={() => toggleArray("domains", d.id)} className="w-full flex items-center gap-2 py-1 text-left group">
              <div className={`w-3.5 h-3.5 rounded flex-shrink-0 border ${filters.domains.includes(d.id) ? "border-transparent" : "border-[#21262D]"}`} style={filters.domains.includes(d.id) ? { backgroundColor: d.color } : {}} />
              <span className="text-[#F0F6FF] text-[11px] flex-1 truncate group-hover:text-[#C9A84C] transition-colors">{d.name}</span>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[#8B9AB0] text-[9px] w-8 text-right">{d.count}</span>
            </button>
          ))}
        </Section>

        {/* Evidence */}
        <Section id="evidence" label="Evidence Quality">
          {EVIDENCE_LEVELS.map(e => (
            <button key={e.level} onClick={() => toggleArray("evidence", e.level)} className="w-full flex items-center gap-2 py-1 text-left">
              <div className={`w-3.5 h-3.5 rounded flex-shrink-0 border ${filters.evidence.includes(e.level) ? "border-transparent" : "border-[#21262D]"}`} style={filters.evidence.includes(e.level) ? { backgroundColor: e.color } : {}} />
              <span className="text-[#8B9AB0] text-[10px]">{e.stars}</span>
              <span className="text-[#F0F6FF] text-[11px] flex-1">{e.label}</span>
              <span className="text-[#8B9AB0] text-[9px]">{e.count}</span>
            </button>
          ))}
        </Section>

        {/* Suppression */}
        <Section id="suppression" label="Suppression Status">
          {SUPPRESSION_STATUS.map(s => (
            <button key={s.id} onClick={() => toggleArray("suppression", s.id)} className="w-full flex items-center gap-2 py-1 text-left">
              <div className={`w-3.5 h-3.5 rounded flex-shrink-0 border ${filters.suppression.includes(s.id) ? "border-transparent" : "border-[#21262D]"}`} style={filters.suppression.includes(s.id) ? { backgroundColor: s.color } : {}} />
              <span className="text-[10px]">{s.icon}</span>
              <span className="text-[#F0F6FF] text-[11px] flex-1">{s.label}</span>
              <span className="text-[#8B9AB0] text-[9px]">{s.count}</span>
            </button>
          ))}
        </Section>

        {/* Target System */}
        <Section id="target" label="Target System">
          <div className="flex flex-wrap gap-1.5">
            {TARGET_SYSTEMS.map(t => (
              <button key={t} onClick={() => toggleArray("targetSystems", t)} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${filters.targetSystems.includes(t) ? "border-[#1D6FA4] bg-[#1D6FA4]/15 text-[#1D6FA4]" : "border-[#21262D] text-[#8B9AB0]"}`}>
                {t}
              </button>
            ))}
          </div>
        </Section>

        {/* Frequency */}
        <Section id="freq" label="Operating Frequency">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[9px] text-[#8B9AB0]">
              {["ELF", "Delta", "Theta", "Alpha", "Beta", "RF", "MW", "Opt"].map(f => <span key={f}>{f}</span>)}
            </div>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min Hz" value={filters.freqMin || ""} onChange={e => update("freqMin", e.target.value ? parseFloat(e.target.value) : null)} className="w-full px-2 py-1 rounded bg-[#161B22] border border-[#21262D] text-[#F0F6FF] text-[10px] outline-none focus:border-[#C9A84C]/50" />
              <span className="text-[#8B9AB0] text-[10px]">to</span>
              <input type="number" placeholder="Max Hz" value={filters.freqMax || ""} onChange={e => update("freqMax", e.target.value ? parseFloat(e.target.value) : null)} className="w-full px-2 py-1 rounded bg-[#161B22] border border-[#21262D] text-[#F0F6FF] text-[10px] outline-none focus:border-[#C9A84C]/50" />
            </div>
          </div>
        </Section>

        {/* Population */}
        <Section id="population" label="Target Population">
          {POPULATIONS.map(p => (
            <button key={p} onClick={() => toggleArray("population", p)} className="w-full flex items-center gap-2 py-1 text-left">
              <div className={`w-3.5 h-3.5 rounded flex-shrink-0 border ${filters.population?.includes(p) ? "border-transparent bg-[#7C3AED]" : "border-[#21262D]"}`} />
              <span className="text-[#F0F6FF] text-[11px]">{p}</span>
            </button>
          ))}
        </Section>

        {/* Device Integration */}
        <Section id="device" label="Device Integration">
          {["Integrated in Aethon Device", "Candidate for Integration", "In My Device Plans", "Not Yet Mapped"].map(d => (
            <button key={d} onClick={() => toggleArray("deviceIntegration", d)} className="w-full flex items-center gap-2 py-1 text-left">
              <div className={`w-3.5 h-3.5 rounded flex-shrink-0 border ${filters.deviceIntegration?.includes(d) ? "border-transparent bg-[#9B30FF]" : "border-[#21262D]"}`} />
              <span className="text-[#F0F6FF] text-[11px]">{d}</span>
            </button>
          ))}
        </Section>

        {/* Era */}
        <Section id="era" label="Era of Research">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[#8B9AB0]">
              <span>1850s</span><span>2020s</span>
            </div>
            <input type="range" min="1850" max="2025" value={filters.eraMin || 1850} onChange={e => update("eraMin", parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
            <input type="range" min="1850" max="2025" value={filters.eraMax || 2025} onChange={e => update("eraMax", parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
            <p className="text-[#8B9AB0] text-[10px] text-center">{filters.eraMin || 1850} — {filters.eraMax || 2025}</p>
          </div>
        </Section>

        {/* Connections */}
        <Section id="connections" label="Minimum Connections">
          <input type="range" min="0" max="60" value={filters.minConnections} onChange={e => update("minConnections", parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
          <p className="text-[#8B9AB0] text-[10px] text-center mt-1">Show only nodes with {filters.minConnections}+ connections</p>
        </Section>

        {/* Saved filters */}
        <div className="px-3 py-3 border-t border-[#21262D]">
          <p className="text-[#8B9AB0] text-[9px] font-bold uppercase tracking-wider mb-2">My Saved Filters</p>
          <div className="flex flex-wrap gap-1.5">
            {savedFilters.map(sf => (
              <button key={sf.name} onClick={() => setFilters({ ...filters, ...sf.filters })} className="px-2 py-1 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[10px] font-bold border border-[#C9A84C]/30 hover:bg-[#C9A84C]/25 transition-colors">
                {sf.name}
              </button>
            ))}
            <button className="px-2 py-1 rounded-full border border-[#21262D] text-[#8B9AB0] text-[10px] hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors flex items-center gap-1">
              <Plus size={10} /> Save Current
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-3 py-3 border-t border-[#21262D] bg-[#0D1117]">
        <p className="text-[#F0F6FF] text-xs font-bold">Showing <span className="text-[#C9A84C]">{nodeCounts.visible}</span> of <span className="text-[#8B9AB0]">{nodeCounts.total}</span> nodes</p>
        <p className="text-[#8B9AB0] text-[10px] mt-0.5">{edgeCount} connections visible</p>
        <button className="w-full mt-2 px-3 py-2 rounded-lg bg-[#161B22] border border-[#21262D] text-[#8B9AB0] text-[10px] font-bold hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors flex items-center justify-center gap-1">
          <Save size={10} /> Export Filtered View
        </button>
      </div>
    </div>
  );
}