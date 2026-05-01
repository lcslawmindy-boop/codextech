import { useState, useEffect, lazy, Suspense } from "react";
import { Monitor } from "lucide-react";

const RadarSweepBackground = lazy(() => import("./backgrounds/RadarSweepBackground"));
const CircuitBoardBackground = lazy(() => import("./backgrounds/CircuitBoardBackground"));
const QuantumFieldBackground = lazy(() => import("./backgrounds/QuantumFieldBackground"));
const NeuralNetworkBackground = lazy(() => import("./backgrounds/NeuralNetworkBackground"));
const PlasmaFieldBackground = lazy(() => import("./backgrounds/PlasmaFieldBackground"));
const CosmicResearchBackground = lazy(() => import("./CosmicResearchBackground"));

const THEMES = [
  {
    id: "radar",
    label: "Radar",
    icon: "🎯",
    desc: "Tactical sweep",
    accent: "#00ff44",
    bg: "#010a04",
    component: RadarSweepBackground,
  },
  {
    id: "circuit",
    label: "PCB",
    icon: "🔌",
    desc: "Circuit board",
    accent: "#0088ff",
    bg: "#020408",
    component: CircuitBoardBackground,
  },
  {
    id: "quantum",
    label: "Quantum",
    icon: "⚛️",
    desc: "Wave field",
    accent: "#4488ff",
    bg: "#000510",
    component: QuantumFieldBackground,
  },
  {
    id: "neural",
    label: "Neural",
    icon: "🧠",
    desc: "AI network",
    accent: "#ff6600",
    bg: "#050005",
    component: NeuralNetworkBackground,
  },
  {
    id: "plasma",
    label: "Plasma",
    icon: "⚡",
    desc: "Tokamak field",
    accent: "#0088ff",
    bg: "#000208",
    component: PlasmaFieldBackground,
  },
  {
    id: "cosmic",
    label: "Cosmic",
    icon: "🌌",
    desc: "Research cosmos",
    accent: "#00ffff",
    bg: "#000008",
    component: CosmicResearchBackground,
  },
];

const STORAGE_KEY = "codextech_bg_theme";

export function useBackgroundTheme() {
  const [themeId, setThemeId] = useState(() => localStorage.getItem(STORAGE_KEY) || "radar");
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const set = (id) => { setThemeId(id); localStorage.setItem(STORAGE_KEY, id); };
  return { theme, themeId, setThemeId: set, themes: THEMES };
}

export function ActiveBackground({ themeId }) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const Component = theme.component;
  return (
    <Suspense fallback={<div className="fixed inset-0 -z-10" style={{ background: theme.bg }} />}>
      <Component />
    </Suspense>
  );
}

export default function BackgroundThemeSwitcher({ themeId, setThemeId }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-50">
      {/* Palette panel */}
      {open && (
        <div
          className="mb-2 p-3 rounded-2xl shadow-2xl"
          style={{
            background: "rgba(0,0,20,0.92)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            minWidth: 240,
          }}
        >
          <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-2 px-1">Scene Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setThemeId(t.id); setOpen(false); }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-center"
                style={{
                  background: themeId === t.id ? t.accent + "22" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${themeId === t.id ? t.accent + "88" : "transparent"}`,
                }}
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-white text-xs font-bold leading-tight">{t.label}</span>
                <span className="text-gray-500 text-xs leading-tight">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-all"
        style={{
          background: "rgba(0,0,20,0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        <Monitor size={14} />
        Scene
      </button>
    </div>
  );
}