import { useState, useEffect, useRef } from "react";
import { Palette, Check } from "lucide-react";

const THEMES = [
  { id: "default", label: "Dark Slate",       swatch: ["#111318", "#1c1f26"], desc: "Classic deep charcoal" },
  { id: "navy",    label: "Deep Navy",         swatch: ["#060e26", "#0d1a3a"], desc: "Rich navy blue" },
  { id: "emerald", label: "Midnight Emerald",  swatch: ["#051a0e", "#0a2616"], desc: "Dark forest green" },
  { id: "purple",  label: "Deep Purple",       swatch: ["#0d0619", "#160a28"], desc: "Cosmic indigo" },
  { id: "warm",    label: "Warm Charcoal",     swatch: ["#141210", "#1e1b17"], desc: "Warm dark mocha" },
  { id: "crimson", label: "Crimson Dark",      swatch: ["#110508", "#1c0910"], desc: "Dark bloodstone red" },
  { id: "steel",   label: "Steel Blue",        swatch: ["#0c1419", "#121d25"], desc: "Industrial steel" },
];

export function applyTheme(id) {
  if (id === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", id);
  }
  localStorage.setItem("zarp_theme", id);
}

export function loadTheme() {
  const saved = localStorage.getItem("zarp_theme") || "default";
  applyTheme(saved);
  return saved;
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("default");
  const ref = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("zarp_theme") || "default";
    setActive(saved);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (id) => {
    applyTheme(id);
    setActive(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title="Change platform theme"
        className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
        style={{ background: "rgba(30,41,59,0.95)", border: "1px solid rgba(51,65,85,0.8)", color: "#64748B" }}
      >
        <Palette size={15} />
      </button>

      {open && (
        <div className="absolute right-0 bottom-12 z-[200] rounded-2xl p-3 shadow-2xl w-64" style={{ background: "#1E293B", border: "1px solid #334155" }}>
          <p className="text-white font-black text-xs uppercase tracking-widest mb-3 px-1">Platform Theme</p>
          <div className="space-y-1">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => select(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                  active === t.id
                    ? "bg-white/10 border border-white/20"
                    : "hover:bg-gray-800 border border-transparent"
                }`}
              >
                {/* Swatch */}
                <div className="flex rounded-lg overflow-hidden w-8 h-8 flex-shrink-0 border border-gray-700">
                  <div className="flex-1" style={{ backgroundColor: t.swatch[0] }} />
                  <div className="flex-1" style={{ backgroundColor: t.swatch[1] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold leading-tight">{t.label}</p>
                  <p className="text-gray-600 text-xs">{t.desc}</p>
                </div>
                {active === t.id && <Check size={12} className="text-green-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}