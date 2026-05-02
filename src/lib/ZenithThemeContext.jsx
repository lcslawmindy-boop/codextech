import { createContext, useState, useContext } from "react";

const THEMES = {
  coreEnergy: {
    id: "coreEnergy",
    name: "Core Energy",
    label: "⚡",
    primaryGlow: "rgba(0, 255, 200, ",
    sunColor1Primary: "rgba(255, 220, 80, ",
    sunColor1Mid: "rgba(255, 200, 50, ",
    sunColor2Primary: "rgba(255, 180, 60, ",
    gridColor: "rgba(80, 140, 255, ",
    accentColor: "rgba(0, 230, 255, ",
    bgBase: "rgb(5, 6, 14)",
    bgCard: "rgba(8, 10, 22, 0.95)",
  },
  deepVoid: {
    id: "deepVoid",
    name: "Deep Void",
    label: "🌌",
    primaryGlow: "rgba(180, 100, 255, ",
    sunColor1Primary: "rgba(200, 150, 255, ",
    sunColor1Mid: "rgba(150, 100, 255, ",
    sunColor2Primary: "rgba(120, 80, 200, ",
    gridColor: "rgba(100, 80, 180, ",
    accentColor: "rgba(200, 100, 255, ",
    bgBase: "rgb(10, 5, 20)",
    bgCard: "rgba(15, 8, 30, 0.95)",
  },
  quantumGrid: {
    id: "quantumGrid",
    name: "Quantum Grid",
    label: "⚛️",
    primaryGlow: "rgba(0, 255, 100, ",
    sunColor1Primary: "rgba(100, 255, 200, ",
    sunColor1Mid: "rgba(80, 220, 180, ",
    sunColor2Primary: "rgba(50, 200, 150, ",
    gridColor: "rgba(0, 200, 150, ",
    accentColor: "rgba(0, 255, 120, ",
    bgBase: "rgb(5, 15, 10)",
    bgCard: "rgba(8, 20, 15, 0.95)",
  },
  stealth: {
    id: "stealth",
    name: "Stealth",
    label: "🛡️",
    primaryGlow: "rgba(100, 150, 200, ",
    sunColor1Primary: "rgba(150, 180, 220, ",
    sunColor1Mid: "rgba(120, 150, 200, ",
    sunColor2Primary: "rgba(80, 120, 180, ",
    gridColor: "rgba(60, 100, 160, ",
    accentColor: "rgba(100, 200, 255, ",
    bgBase: "rgb(8, 12, 20)",
    bgCard: "rgba(12, 16, 28, 0.95)",
  },
  academicBlue: {
    id: "academicBlue",
    name: "Academic Blue",
    label: "🔬",
    primaryGlow: "rgba(100, 180, 255, ",
    sunColor1Primary: "rgba(150, 200, 255, ",
    sunColor1Mid: "rgba(120, 180, 240, ",
    sunColor2Primary: "rgba(80, 160, 220, ",
    gridColor: "rgba(60, 140, 200, ",
    accentColor: "rgba(100, 180, 255, ",
    bgBase: "rgb(10, 15, 25)",
    bgCard: "rgba(15, 22, 35, 0.95)",
  },
  gold: {
    id: "gold",
    name: "Gold Institution",
    label: "🏛️",
    primaryGlow: "rgba(255, 200, 100, ",
    sunColor1Primary: "rgba(255, 220, 150, ",
    sunColor1Mid: "rgba(240, 200, 120, ",
    sunColor2Primary: "rgba(220, 180, 80, ",
    gridColor: "rgba(180, 150, 80, ",
    accentColor: "rgba(255, 215, 120, ",
    bgBase: "rgb(15, 12, 8)",
    bgCard: "rgba(25, 20, 12, 0.95)",
  },
  neon: {
    id: "neon",
    name: "Neon Fun",
    label: "🎨",
    primaryGlow: "rgba(255, 100, 200, ",
    sunColor1Primary: "rgba(255, 150, 220, ",
    sunColor1Mid: "rgba(200, 100, 255, ",
    sunColor2Primary: "rgba(100, 200, 255, ",
    gridColor: "rgba(0, 255, 150, ",
    accentColor: "rgba(255, 100, 200, ",
    bgBase: "rgb(15, 5, 20)",
    bgCard: "rgba(20, 8, 30, 0.95)",
  },
};

const ZenithThemeContext = createContext(null);

export function ZenithThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('zenith_theme') || "coreEnergy");

  const currentTheme = THEMES[themeId];

  const switchTheme = (id) => {
    if (THEMES[id]) {
      setThemeId(id);
      localStorage.setItem('zenith_theme', id);
    }
  };

  return (
    <ZenithThemeContext.Provider
      value={{
        themeId,
        currentTheme,
        switchTheme,
        themes: Object.values(THEMES),
      }}
    >
      {children}
    </ZenithThemeContext.Provider>
  );
}

export function useZenithTheme() {
  const context = useContext(ZenithThemeContext);
  if (!context) {
    throw new Error("useZenithTheme must be used within ZenithThemeProvider");
  }
  return context;
}