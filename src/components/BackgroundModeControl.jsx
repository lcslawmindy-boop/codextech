import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Layers2, Circle, Zap } from 'lucide-react';

const STORAGE_KEY = 'zenith_bg_mode';

export function useBackgroundMode() {
  const [mode, setMode] = useState(() => localStorage.getItem(STORAGE_KEY) || 'interactive');
  const set = (m) => {
    setMode(m);
    localStorage.setItem(STORAGE_KEY, m);
    window.dispatchEvent(new CustomEvent('backgroundModeChanged', { detail: { mode: m } }));
  };
  return { mode, setMode: set };
}

export default function BackgroundModeControl({ mode, setMode }) {
  const [open, setOpen] = useState(false);

  const modes = [
    { id: 'off', label: 'Solid', icon: '⊙', desc: 'Logo background' },
    { id: 'subdued', label: 'Subdued', icon: '∿', desc: 'Equations (dim)' },
    { id: 'interactive', label: 'Interactive', icon: '◈', desc: 'Full effects' },
  ];

  const ui = (
    <div className="fixed left-4 top-20 z-[9998]">
      {open && (
        <div
          className="mb-2 p-3 rounded-2xl shadow-2xl"
          style={{
            background: 'rgba(0,0,20,0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: 200,
          }}
        >
          <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-3 px-1">Background</p>
          <div className="space-y-2">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left"
                style={{
                  background: mode === m.id ? 'rgba(0,220,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${mode === m.id ? 'rgba(0,220,255,0.6)' : 'transparent'}`,
                }}
              >
                <span className="text-lg">{m.icon}</span>
                <div className="min-w-0">
                  <div className="text-white text-xs font-bold">{m.label}</div>
                  <div className="text-gray-500 text-xs">{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-all"
        style={{
          background: 'rgba(0,0,20,0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <Layers2 size={14} />
        BG
      </button>
    </div>
  );

  return createPortal(ui, document.body);
}