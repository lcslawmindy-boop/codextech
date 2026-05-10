import { useState } from "react";
import { Shield, Loader2, Zap, AlertTriangle, CheckCircle2, Wrench, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SEV_COLORS = { critical: "#7c3aed", high: "#ef4444", medium: "#f97316", low: "#22c55e" };
const SEV_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

function ThreatCard({ threat }) {
  const color = SEV_COLORS[threat.severity] || "#888";
  return (
    <div className="p-4 rounded-xl border bg-slate-900" style={{ borderColor: color + "30" }}>
      <div className="flex items-start gap-3">
        <AlertTriangle size={14} style={{ color }} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-white text-xs font-black">{threat.title}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase"
              style={{ backgroundColor: color + "20", color }}>
              {threat.severity}
            </span>
            <span className="text-slate-600 text-[9px] uppercase tracking-wider">{threat.type?.replace(/_/g, " ")}</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">{threat.description}</p>
          {threat.affected_invention && (
            <p className="text-slate-600 text-[10px] mt-1 flex items-center gap-1">
              <ChevronRight size={9} /> Affects: <span className="text-slate-400">{threat.affected_invention}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PatchCard({ patch }) {
  const priorityColor = { high: "#ef4444", medium: "#f97316", low: "#22c55e" }[patch.priority] || "#888";
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
      <Wrench size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-[11px] font-bold">{patch.issue}</span>
          <span className="text-[9px] font-black uppercase" style={{ color: priorityColor }}>{patch.priority}</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">{patch.patch_action}</p>
      </div>
    </div>
  );
}

export default function ThreatMonitor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("intelligenceEngine", { module: "threat_monitor" });
      setData(res.data?.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const overallColor = SEV_COLORS[data?.overall_risk] || "#888";
  const sorted = (data?.threats || []).sort((a, b) => (SEV_ORDER[a.severity] || 9) - (SEV_ORDER[b.severity] || 9));

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-base flex items-center gap-2">
            <Shield size={16} className="text-red-400" /> Threat Monitor
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Prior art collisions · Conflicting claims · Auto-repair patches</p>
        </div>
        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-black transition-all">
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
          {loading ? "Scanning..." : "Scan Threats"}
        </button>
      </div>

      {!data && !loading && (
        <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-12 text-center">
          <Shield size={28} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-semibold">Run a threat scan to detect IP risks</p>
        </div>
      )}

      {loading && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center">
          <Loader2 size={24} className="animate-spin text-red-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Scanning for threats and conflicts...</p>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {/* Overall Risk */}
          <div className="p-4 rounded-xl border" style={{ borderColor: overallColor + "40", backgroundColor: overallColor + "08" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} style={{ color: overallColor }} />
                <div>
                  <p className="text-white font-black">Overall Portfolio Risk</p>
                  <p className="text-slate-400 text-xs">{data.threat_count} threats detected</p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full text-sm font-black uppercase"
                style={{ backgroundColor: overallColor + "20", color: overallColor }}>
                {data.overall_risk}
              </span>
            </div>
          </div>

          {/* Threats */}
          {sorted.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Detected Threats</p>
              <div className="space-y-2.5">
                {sorted.map((t, i) => <ThreatCard key={i} threat={t} />)}
              </div>
            </div>
          )}

          {/* Repair Patches */}
          {(data.repair_patches || []).length > 0 && (
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">
                <Wrench size={10} className="inline mr-1" />Auto-Generated Repair Patches
              </p>
              <div className="space-y-2">
                {data.repair_patches.map((p, i) => <PatchCard key={i} patch={p} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}