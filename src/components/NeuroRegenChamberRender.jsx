import { useState } from "react";
import { DEVICE, SUBSYSTEMS, CALLOUTS } from "@/lib/neuroRegenSpecs";

const VC = {
  verified: "#22c55e",
  partial: "#f59e0b",
  speculative: "#ef4444",
};
const VLBL = { verified: "Verified", partial: "Partial", speculative: "Speculative" };

export default function NeuroRegenChamberRender() {
  const [active, setActive] = useState(null);
  const activeSub = active ? SUBSYSTEMS.find((s) => s.ref === active) : null;

  return (
    <div className="space-y-4">
      {/* Header strip */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-white font-bold text-sm">Engineering-Grade Rendering — Exploded View with Callouts</p>
          <p className="text-gray-500 text-xs mt-0.5">ZA-NRC-001 · AI-generated reference render · 8 subsystem callouts</p>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          {Object.entries(VLBL).map(([k, l]) => (
            <span key={k} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: VC[k] + "20", color: VC[k], border: `1px solid ${VC[k]}40` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: VC[k] }} /> {l}
            </span>
          ))}
        </div>
      </div>

      {/* Render with overlay callouts */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-gray-800 bg-black select-none">
        <img
          src={DEVICE.image}
          alt="Neuro Regeneration Chamber engineering render"
          className="w-full h-auto block"
          draggable={false}
        />
        {/* Callout pins */}
        {CALLOUTS.map((c) => {
          const sub = SUBSYSTEMS.find((s) => s.ref === c.ref);
          const color = sub?.color || "#06b6d4";
          const isActive = active === c.ref;
          return (
            <button
              key={c.ref}
              onClick={() => setActive(isActive ? null : c.ref)}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 group"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              title={c.label}
            >
              <span
                className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-black transition-transform group-hover:scale-110"
                style={{
                  background: color + "30",
                  border: `2px solid ${color}`,
                  color,
                  boxShadow: `0 0 0 3px ${color}25`,
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                }}
              >
                {c.ref}
              </span>
            </button>
          );
        })}

        {/* Active callout detail popover */}
        {activeSub && (
          <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-72 bg-gray-950/95 backdrop-blur border rounded-xl p-3 z-20" style={{ borderColor: activeSub.color + "80" }}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black px-1.5 py-0.5 rounded" style={{ background: activeSub.color + "25", color: activeSub.color }}>{activeSub.ref}</span>
                <span className="text-white font-bold text-xs">{activeSub.name}</span>
              </div>
              <button onClick={() => setActive(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">{activeSub.desc}</p>
            <span className="inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: VC[VMAP(activeSub.verified)] + "20", color: VC[VMAP(activeSub.verified)] }}>
              {VLBL[VMAP(activeSub.verified)]}
            </span>
          </div>
        )}
      </div>

      {/* Subsystem legend grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SUBSYSTEMS.map((s) => (
          <button
            key={s.ref}
            onClick={() => setActive(active === s.ref ? null : s.ref)}
            className="text-left bg-gray-900 border rounded-xl p-3 transition-colors hover:bg-gray-800/50"
            style={{ borderColor: active === s.ref ? s.color : "#1f2937", borderTopColor: s.color, borderTopWidth: 2 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-black px-1.5 py-0.5 rounded" style={{ background: s.color + "25", color: s.color }}>{s.ref}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: VC[VMAP(s.verified)] }} title={VLBL[VMAP(s.verified)]} />
            </div>
            <p className="text-white font-bold text-xs leading-snug">{s.name}</p>
            <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5 line-clamp-3">{s.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function VMAP(v) {
  return v === true ? "verified" : v === "partial" ? "partial" : "speculative";
}