import { X, Layers, Eye } from "lucide-react";

export default function GraphFilterPanel({
  nodeTypes, activeTypes, onToggleType,
  overlays, activeOverlays, onToggleOverlay,
  onClose
}) {
  return (
    <div className="w-56 border-r border-slate-800 bg-slate-950 flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Layers size={13} className="text-cyan-400" />
          <span className="text-white font-black text-xs">Graph Filters</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white">
          <X size={13} />
        </button>
      </div>

      {/* Node Types */}
      <div className="p-4 border-b border-slate-800">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Node Types</p>
        <div className="space-y-2">
          {nodeTypes.map(t => {
            const Icon = t.icon;
            const active = activeTypes.includes(t.id);
            return (
              <button key={t.id} onClick={() => onToggleType(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all text-left ${
                  active ? "border-opacity-40 bg-opacity-10" : "border-slate-800 bg-transparent opacity-40"
                }`}
                style={active ? { borderColor: t.color + "50", backgroundColor: t.color + "10" } : {}}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: active ? t.color : "#475569" }} />
                <span className="text-xs font-semibold" style={{ color: active ? t.color : "#64748b" }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Intelligence Overlays */}
      <div className="p-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
          <Eye size={10} className="inline mr-1" />Overlays
        </p>
        <div className="space-y-2">
          {overlays.map(ov => {
            const active = activeOverlays.includes(ov.id);
            return (
              <button key={ov.id} onClick={() => onToggleOverlay(ov.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all text-left ${
                  active ? "border-opacity-40" : "border-slate-800 opacity-40"
                }`}
                style={active ? { borderColor: ov.color + "50", backgroundColor: ov.color + "10" } : {}}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: active ? ov.color : "#475569" }} />
                <span className="text-[11px] font-semibold leading-snug" style={{ color: active ? ov.color : "#64748b" }}>
                  {ov.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}