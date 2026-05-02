import { useState } from "react";
import { createPortal } from "react-dom";
import { Palette } from "lucide-react";
import { useZenithTheme } from "@/lib/ZenithThemeContext";

export default function ZenithThemeSwitcher() {
  const { themeId, switchTheme, themes, currentTheme } = useZenithTheme();
  const [open, setOpen] = useState(false);

  const ui = (
    <div className="fixed top-4 right-4 z-[9997]">
      {/* Theme panel */}
      {open && (
        <div
          className="mb-3 rounded-2xl p-4 border backdrop-blur-md shadow-2xl"
          style={{
            background: currentTheme.bgCard,
            borderColor: currentTheme.accentColor + "0.5)",
            boxShadow: `0 0 24px ${currentTheme.primaryGlow}0.35)`,
            minWidth: "220px",
          }}
        >
          <p
            className="text-xs font-black uppercase tracking-widest mb-4"
            style={{ color: currentTheme.accentColor + "0.8)" }}
          >
            Zenith Theme
          </p>
          <div className="space-y-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  switchTheme(theme.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-all active:scale-95 text-left"
                style={{
                  background:
                    themeId === theme.id
                      ? theme.primaryGlow + "0.25)"
                      : "rgba(0,0,0,0.2)",
                  border:
                    themeId === theme.id
                      ? `2px solid ${theme.accentColor}0.8)`
                      : `1px solid ${theme.gridColor}0.3)`,
                  boxShadow:
                    themeId === theme.id
                      ? `0 0 12px ${theme.primaryGlow}0.5)`
                      : "none",
                }}
              >
                <span className="text-lg">{theme.label}</span>
                <div>
                  <p
                    className="text-xs font-bold"
                    style={{ color: theme.accentColor + "1)" }}
                  >
                    {theme.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {theme.id === "coreEnergy" && "Warm & energetic"}
                    {theme.id === "deepVoid" && "Mystic & ethereal"}
                    {theme.id === "quantumGrid" && "Organic & living"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95"
        style={{
          background: currentTheme.bgCard,
          borderColor: currentTheme.accentColor + "0.5)",
          border: "1px solid",
          color: currentTheme.accentColor + "1)",
          boxShadow: `0 0 16px ${currentTheme.primaryGlow}0.3)`,
        }}
      >
        <Palette size={14} />
        Theme
      </button>
    </div>
  );

  return createPortal(ui, document.body);
}