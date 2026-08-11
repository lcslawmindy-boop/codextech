import { X, Search, Network, MousePointerClick, FolderKanban, Settings } from "lucide-react";

export default function QuickGuideModal({ open, onClose }) {
  if (!open) return null;

  const steps = [
    { icon: Search, color: "#C9A84C", title: "Search or filter", desc: "Find research nodes in your area of interest using the search bar or left filter panel" },
    { icon: Network, color: "#1D6FA4", title: "Explore the graph", desc: "Bigger nodes have more connections. Hover to see connections, click to open details" },
    { icon: MousePointerClick, color: "#9B30FF", title: "Click any node", desc: "Opens the full research record with connections, publications, and build info" },
    { icon: FolderKanban, color: "#10B981", title: "Save to Collections", desc: "Organize your research by saving nodes to custom collections" },
    { icon: Settings, color: "#F59E0B", title: "Add to Device Plans", desc: "Start building your innovation by adding nodes to device build plans" },
  ];

  const shortcuts = [
    { key: "F", desc: "Fit all nodes" },
    { key: "L", desc: "Toggle labels" },
    { key: "M", desc: "Toggle mini-map" },
    { key: "ESC", desc: "Exit focus / close drawer" },
    { key: "Ctrl+A", desc: "Select all visible nodes" },
    { key: "+/-", desc: "Zoom in/out" },
    { key: "Space", desc: "Pause/resume physics" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0D1117] border border-[#21262D] rounded-2xl overflow-hidden">
        <div className="h-1" style={{ backgroundColor: "#C9A84C" }} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#F0F6FF] font-black text-lg" style={{ fontFamily: "Orbitron, sans-serif" }}>How to Use the Research Graph</h2>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-[#161B22] text-[#8B9AB0] hover:text-[#F0F6FF] transition-colors"><X size={18} /></button>
          </div>

          <div className="space-y-3 mb-5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.color + "20", border: `1px solid ${s.color}40` }}>
                    <Icon size={16} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-[#F0F6FF] text-xs font-bold">{i + 1}. {s.title}</p>
                    <p className="text-[#8B9AB0] text-[11px] leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-[#161B22] border border-[#21262D] p-3 mb-4">
            <p className="text-[#8B9AB0] text-[10px] font-bold uppercase tracking-wider mb-2">Keyboard Shortcuts</p>
            <div className="grid grid-cols-2 gap-2">
              {shortcuts.map(s => (
                <div key={s.key} className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#0D1117] border border-[#21262D] text-[#C9A84C] text-[9px] font-mono font-bold">{s.key}</kbd>
                  <span className="text-[#8B9AB0] text-[10px]">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={onClose} className="w-full py-3 rounded-lg text-[#030712] font-black text-sm" style={{ backgroundColor: "#C9A84C" }}>
            Got it — Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}