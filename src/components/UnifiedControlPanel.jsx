import { useBackgroundMode } from './BackgroundModeControl';
import { useZenithTheme } from '@/lib/ZenithThemeContext';

export default function UnifiedControlPanel() {
  const { mode, setMode } = useBackgroundMode();
  const { themeId, switchTheme, themes } = useZenithTheme();

  const sceneOptions = [
    { id: 'off', label: 'Solid' },
    { id: 'subdued', label: 'Subdued' },
    { id: 'interactive', label: 'Interactive' },
    { id: 'defense', label: 'Defense' },
    { id: 'researcher', label: 'Researcher' },
    { id: 'institutional', label: 'Institutional' },
    { id: 'fun', label: 'Fun' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-gray-400 block mb-2">SCENE</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full px-2 py-1.5 text-xs rounded bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-cyan-600 transition-colors cursor-pointer"
        >
          {sceneOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-400 block mb-2">THEME</label>
        <select
          value={themeId}
          onChange={(e) => switchTheme(e.target.value)}
          className="w-full px-2 py-1.5 text-xs rounded bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-cyan-600 transition-colors cursor-pointer"
        >
          {themes.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.label} {theme.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}