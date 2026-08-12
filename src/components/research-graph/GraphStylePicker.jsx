import { useState, useRef, useEffect } from "react";
import { Palette, Check, ChevronDown } from "lucide-react";
import { GRAPH_BG_THEMES } from "@/lib/graphScene3D";

// Visual theme picker — shows a thumbnail preview of each background theme
// so users can see the style before selecting it.
export default function GraphStylePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const themeNames = Object.keys(GRAPH_BG_THEMES);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  const currentThumb = GRAPH_BG_THEMES[value]?.[0];

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold hover:text-amber-400 hover:border-amber-400/50 transition-colors"
        title="Graph background theme"
      >
        <Palette size={12} />
        {currentThumb && (
          <span
            className="w-4 h-4 rounded-sm border border-slate-700 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentThumb})` }}
          />
        )}
        <span className="hidden md:inline">{value}</span>
        <ChevronDown size={10} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-800">
            <p className="text-amber-400 text-[9px] font-black uppercase tracking-wider" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Graph Style
            </p>
            <p className="text-slate-500 text-[8px] mt-0.5">Pick a background theme for the 3D graph</p>
          </div>
          <div className="p-2 grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto">
            {themeNames.map(name => {
              const thumb = GRAPH_BG_THEMES[name]?.[0];
              const isActive = name === value;
              return (
                <button
                  key={name}
                  onClick={() => { onChange(name); setOpen(false); }}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all group ${isActive ? "border-amber-400 ring-2 ring-amber-400/30" : "border-slate-800 hover:border-slate-600"}`}
                >
                  <div
                    className="h-16 bg-cover bg-center"
                    style={{ backgroundImage: `url(${thumb})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center justify-between">
                    <span className={`text-[10px] font-bold leading-tight ${isActive ? "text-amber-400" : "text-slate-200"}`}>{name}</span>
                    {isActive && <Check size={12} className="text-amber-400 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}