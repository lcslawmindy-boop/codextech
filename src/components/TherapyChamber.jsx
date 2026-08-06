import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function TherapyChamber({
  index,
  name,
  tagline,
  icon,
  accent,
  nodes,
  mechanism,
  protocol,
}) {
  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(160deg, hsl(222 39% 13%) 0%, hsl(222 47% 8%) 100%)",
        borderColor: `${accent}40`,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3 border-b"
        style={{ borderColor: `${accent}30`, background: `${accent}12` }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${accent}25`, border: `1px solid ${accent}50` }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest" style={{ color: accent }}>
              CHAMBER {String(index).padStart(2, "0")}
            </span>
          </div>
          <h3 className="text-white font-black text-sm leading-tight">{name}</h3>
          <p className="text-gray-500 text-xs truncate">{tagline}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex-1 flex flex-col gap-4">
        {/* Mechanism */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1.5">Operating Mechanism</p>
          <p className="text-gray-300 text-xs leading-relaxed">{mechanism}</p>
        </div>

        {/* Protocol */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1.5">Therapeutic Protocol</p>
          <p className="text-gray-400 text-xs leading-relaxed">{protocol}</p>
        </div>

        {/* Source concepts */}
        <div className="mt-auto pt-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Integrated Concepts ({nodes.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {nodes.map((n) => (
              <Link
                key={n.id}
                to="/"
                className="text-[10px] px-2 py-0.5 rounded-full border transition-colors hover:bg-white/5"
                style={{
                  borderColor: `${accent}40`,
                  color: `${accent}cc`,
                }}
                title={n.label}
              >
                {n.short}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}