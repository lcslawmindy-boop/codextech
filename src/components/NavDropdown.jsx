import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function NavDropdown({ label, icon, color, items, isAdmin }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const visible = items.filter(i => !i.adminOnly || isAdmin);
  if (visible.length === 0) return null;

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all"
        style={{
          backgroundColor: open ? hexToRgba(color, 0.2) : hexToRgba(color, 0.1),
          borderColor: open ? hexToRgba(color, 0.6) : hexToRgba(color, 0.3),
          color: color,
        }}
      >
        <span>{icon}</span>
        <span>{label}</span>
        <ChevronDown size={10} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 z-[200] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl min-w-[200px] max-h-80 overflow-y-auto"
          style={{ boxShadow: `0 8px 32px ${hexToRgba(color, 0.15)}` }}
        >
          {visible.map((item, i) => (
            item.path === "#diagnostics" ? (
              <button
                key={i}
                onClick={() => { item.onAction?.(); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-800 text-gray-300 hover:text-white text-xs transition-colors border-b border-gray-800/60 last:border-0 text-left"
              >
                <span className="text-sm">{item.emoji}</span>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  {item.desc && <p className="text-gray-600 text-[10px] leading-tight mt-0.5">{item.desc}</p>}
                </div>
              </button>
            ) : (
              <Link
                key={i}
                to={item.path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-800 text-gray-300 hover:text-white text-xs transition-colors border-b border-gray-800/60 last:border-0"
              >
                <span className="text-sm">{item.emoji}</span>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  {item.desc && <p className="text-gray-600 text-[10px] leading-tight mt-0.5">{item.desc}</p>}
                </div>
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}