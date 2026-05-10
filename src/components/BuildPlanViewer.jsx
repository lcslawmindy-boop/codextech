import { useState, useEffect, useCallback, useRef } from "react";
import {
  CheckCircle2, ChevronDown, ChevronUp, ZoomIn, ZoomOut,
  RotateCcw, Wrench, List, BookOpen, AlertTriangle, Clock,
  Package, X, Maximize2, CheckSquare, Info
} from "lucide-react";

// ── Schematic Renderer (SVG-based per diagram type) ───────────────────────────

const C = {
  primary: "#06b6d4",
  secondary: "#a855f7",
  accent: "#22c55e",
  warning: "#f59e0b",
  bg: "#0f172a",
  grid: "#1e293b",
  text: "#94a3b8",
  wire: "#64748b",
};

function SchematicSVG({ diagramType, title }) {
  const schemas = {
    toroid: (
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke={C.grid} strokeWidth="0.5" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="350" stroke={C.grid} strokeWidth="0.5" />
        ))}
        {/* Toroid core outline */}
        <ellipse cx="200" cy="175" rx="80" ry="55" fill="none" stroke={C.primary} strokeWidth="2.5" />
        <ellipse cx="200" cy="175" rx="45" ry="30" fill={C.bg} stroke={C.primary} strokeWidth="1.5" strokeDasharray="4,3" />
        {/* Winding turns */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const ex = 200 + Math.cos(angle) * 80;
          const ey = 175 + Math.sin(angle) * 55;
          return <ellipse key={i} cx={ex} cy={ey} rx="8" ry="5" fill="none" stroke={C.secondary} strokeWidth="1.5" transform={`rotate(${(angle * 180) / Math.PI},${ex},${ey})`} />;
        })}
        <text x="200" y="100" textAnchor="middle" fill={C.primary} fontSize="11" fontFamily="monospace">L1 — Tank Inductor</text>
        <text x="200" y="114" textAnchor="middle" fill={C.text} fontSize="9" fontFamily="monospace">~1.0 mH · N87 Ferrite Core</text>
        <text x="312" y="175" fill={C.secondary} fontSize="9" fontFamily="monospace">Lp</text>
        <text x="312" y="188" fill={C.text} fontSize="8" fontFamily="monospace">2f₀ pump</text>
        {/* Capacitor symbol */}
        <line x1="80" y1="240" x2="118" y2="240" stroke={C.wire} strokeWidth="1.5" />
        <line x1="118" y1="226" x2="118" y2="254" stroke={C.primary} strokeWidth="2.5" />
        <line x1="128" y1="226" x2="128" y2="254" stroke={C.primary} strokeWidth="2.5" />
        <line x1="128" y1="240" x2="166" y2="240" stroke={C.wire} strokeWidth="1.5" />
        <text x="123" y="270" textAnchor="middle" fill={C.text} fontSize="9" fontFamily="monospace">C = 220nF</text>
        <line x1="118" y1="175" x2="118" y2="240" stroke={C.wire} strokeWidth="1" strokeDasharray="4,2" />
        <line x1="166" y1="175" x2="166" y2="240" stroke={C.wire} strokeWidth="1" strokeDasharray="4,2" />
        <text x="200" y="320" textAnchor="middle" fill={C.accent} fontSize="10" fontFamily="monospace">f₀ ≈ 10.7 kHz · Q ≥ 30</text>
        <text x="200" y="335" textAnchor="middle" fill={C.text} fontSize="9" fontFamily="monospace">2f₀ pump: 20–22 kHz</text>
      </g>
    ),
    meg: (
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke={C.grid} strokeWidth="0.5" />
        ))}
        <rect x="80" y="80" width="100" height="60" rx="8" fill="none" stroke={C.primary} strokeWidth="2" />
        <text x="130" y="115" textAnchor="middle" fill={C.primary} fontSize="10" fontFamily="monospace">CORE A</text>
        <rect x="220" y="80" width="100" height="60" rx="8" fill="none" stroke={C.primary} strokeWidth="2" />
        <text x="270" y="115" textAnchor="middle" fill={C.primary} fontSize="10" fontFamily="monospace">CORE B</text>
        <rect x="150" y="68" width="100" height="20" rx="4" fill={C.secondary} opacity="0.7" />
        <text x="200" y="82" textAnchor="middle" fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold">N52 MAGNET</text>
        <text x="130" y="192" textAnchor="middle" fill={C.accent} fontSize="9" fontFamily="monospace">MOSFET-1</text>
        <text x="270" y="192" textAnchor="middle" fill={C.accent} fontSize="9" fontFamily="monospace">MOSFET-2</text>
        <line x1="130" y1="140" x2="130" y2="182" stroke={C.wire} strokeWidth="1.5" />
        <line x1="270" y1="140" x2="270" y2="182" stroke={C.wire} strokeWidth="1.5" />
        <rect x="155" y="202" width="90" height="35" rx="4" fill={C.grid} stroke={C.accent} strokeWidth="1.5" />
        <text x="200" y="222" textAnchor="middle" fill={C.accent} fontSize="9" fontFamily="monospace">Arduino Nano</text>
        <text x="200" y="232" textAnchor="middle" fill={C.text} fontSize="8" fontFamily="monospace">50kHz · 500ns dead-time</text>
        <text x="200" y="282" textAnchor="middle" fill={C.primary} fontSize="10" fontFamily="monospace">→ Precision Power Meter</text>
        <text x="200" y="297" textAnchor="middle" fill={C.warning} fontSize="9" fontFamily="monospace">COP measurement point</text>
        <text x="200" y="316" textAnchor="middle" fill={C.text} fontSize="9" fontFamily="monospace">Metglas 2714A / Vitroperm 500F</text>
      </g>
    ),
    default: (
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke={C.grid} strokeWidth="0.5" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="350" stroke={C.grid} strokeWidth="0.5" />
        ))}
        <circle cx="200" cy="140" r="50" fill="none" stroke={C.primary} strokeWidth="2" />
        <circle cx="200" cy="140" r="30" fill="none" stroke={C.secondary} strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="100" y1="140" x2="150" y2="140" stroke={C.wire} strokeWidth="1.5" />
        <line x1="250" y1="140" x2="300" y2="140" stroke={C.wire} strokeWidth="1.5" />
        <line x1="200" y1="90" x2="200" y2="60" stroke={C.wire} strokeWidth="1.5" />
        <line x1="200" y1="190" x2="200" y2="220" stroke={C.wire} strokeWidth="1.5" />
        <text x="200" y="262" textAnchor="middle" fill={C.primary} fontSize="11" fontFamily="monospace">{title}</text>
        <text x="200" y="280" textAnchor="middle" fill={C.text} fontSize="9" fontFamily="monospace">Block Schematic</text>
        <text x="200" y="312" textAnchor="middle" fill={C.text} fontSize="9" fontFamily="monospace">See PDF plans for full circuit diagram</text>
      </g>
    ),
  };

  return schemas[diagramType] || schemas.default;
}

// ── Zoomable Schematic Panel ─────────────────────────────────────────────────

function SchematicPanel({ invention, diagramType }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);
  const handleMouseUp = () => setDragging(false);
  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.min(3, Math.max(0.5, z - e.deltaY * 0.001)));
  };
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-slate-300 text-xs font-bold font-mono uppercase tracking-wider">
            {(diagramType || "block").toUpperCase()} SCHEMATIC
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setZoom(z => Math.min(3, z + 0.25))}
            className="w-7 h-7 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <ZoomIn size={13} />
          </button>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
            className="w-7 h-7 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <ZoomOut size={13} />
          </button>
          <button onClick={resetView}
            className="w-7 h-7 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <RotateCcw size={13} />
          </button>
          <span className="text-slate-600 text-xs font-mono ml-1">{Math.round(zoom * 100)}%</span>
        </div>
      </div>
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ height: 340 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center center", transition: dragging ? "none" : "transform 0.1s ease", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="400" height="350" viewBox="0 0 400 350">
            <rect width="400" height="350" fill={C.bg} />
            <SchematicSVG diagramType={diagramType} title={invention?.title} />
          </svg>
        </div>
        <div className="absolute bottom-2 left-3 text-slate-700 text-[10px] font-mono pointer-events-none">
          Scroll to zoom · Drag to pan
        </div>
      </div>
      <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800 text-[10px] text-slate-600 font-mono truncate">
        <span className="text-cyan-800">SOURCE: </span>
        {invention?.source?.slice(0, 100) || "See PDF plans for full documentation"}
      </div>
    </div>
  );
}

// ── BOM Table ─────────────────────────────────────────────────────────────────

function BOMTable({ bom, checked, onToggle, onResetAll }) {
  const checkedCount = checked.filter(Boolean).length;
  const pct = bom.length > 0 ? Math.round((checkedCount / bom.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-semibold">{checkedCount} / {bom.length} components procured</span>
          <span className={`text-xs font-black ${pct === 100 ? "text-green-400" : pct > 50 ? "text-yellow-400" : "text-slate-500"}`}>{pct}%</span>
        </div>
        <div className="flex items-center gap-3">
          {checkedCount > 0 && (
            <button onClick={onResetAll} className="text-slate-600 hover:text-slate-400 text-xs flex items-center gap-1 transition-colors">
              <RotateCcw size={10} /> Reset
            </button>
          )}
          <button onClick={() => bom.forEach((_, i) => { if (!checked[i]) onToggle(i); })}
            className="text-cyan-700 hover:text-cyan-500 text-xs flex items-center gap-1 transition-colors">
            <CheckSquare size={10} /> Mark All
          </button>
        </div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-500" : "bg-cyan-500"}`} style={{ width: `${pct}%` }} />
      </div>
      {pct === 100 && (
        <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-3 bg-green-950/30 border border-green-900/40 rounded-lg px-3 py-2">
          <CheckCircle2 size={13} /> All components procured — ready to build!
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900">
              <th className="w-8 py-2.5 px-3 text-left" />
              <th className="py-2.5 px-3 text-left text-slate-500 font-bold uppercase tracking-wider w-12">Qty</th>
              <th className="py-2.5 px-3 text-left text-slate-500 font-bold uppercase tracking-wider">Component</th>
              <th className="py-2.5 px-3 text-left text-slate-500 font-bold uppercase tracking-wider hidden md:table-cell">Specification</th>
              <th className="py-2.5 px-3 text-left text-slate-500 font-bold uppercase tracking-wider hidden lg:table-cell">Source / Cost</th>
            </tr>
          </thead>
          <tbody>
            {bom.map((row, i) => (
              <tr key={i} onClick={() => onToggle(i)}
                className={`border-t border-slate-800 cursor-pointer select-none transition-all ${
                  checked[i] ? "bg-green-950/20 opacity-50" : i % 2 === 0 ? "bg-slate-900/20 hover:bg-slate-800/30" : "hover:bg-slate-800/30"
                }`}>
                <td className="py-2.5 px-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked[i] ? "bg-green-600 border-green-600" : "border-slate-600"}`}>
                    {checked[i] && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                </td>
                <td className={`py-2.5 px-3 font-black ${checked[i] ? "text-slate-600 line-through" : "text-cyan-400"}`}>{row.qty}</td>
                <td className={`py-2.5 px-3 font-semibold ${checked[i] ? "text-slate-600 line-through" : "text-slate-200"}`}>{row.item}</td>
                <td className={`py-2.5 px-3 hidden md:table-cell ${checked[i] ? "text-slate-700" : "text-slate-400"}`}>{row.spec}</td>
                <td className={`py-2.5 px-3 hidden lg:table-cell ${checked[i] ? "text-slate-700" : "text-slate-500"}`}>{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-700 text-[10px] mt-2 text-right">Click any row to mark as procured</p>
    </div>
  );
}

// ── Assembly Step Card ────────────────────────────────────────────────────────

function StepCard({ step, index, completed, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-all ${
      completed ? "border-green-900/40 bg-green-950/10 opacity-70"
        : expanded ? "border-cyan-800/50 bg-slate-900/80"
        : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
    }`}>
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-xs border transition-all ${
            completed ? "bg-green-600 border-green-600 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          }`}>
          {completed ? <CheckCircle2 size={14} /> : index + 1}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm leading-snug ${completed ? "text-slate-500 line-through" : "text-white"}`}>{step.title}</p>
          {step.duration && (
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 mt-0.5">
              <Clock size={9} /> {step.duration}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {step.warning && !completed && (
            <span className="w-5 h-5 flex items-center justify-center rounded bg-yellow-900/40 border border-yellow-800">
              <AlertTriangle size={10} className="text-yellow-400" />
            </span>
          )}
          {expanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-600" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-800/50 pt-3">
          <p className="text-slate-300 text-sm leading-relaxed">{step.detail}</p>
          {step.warning && (
            <div className="flex items-start gap-2.5 bg-yellow-950/30 border border-yellow-800/50 rounded-lg px-3 py-2.5">
              <AlertTriangle size={13} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-300 text-xs leading-relaxed">{step.warning}</p>
            </div>
          )}
          {step.checkpoint && (
            <div className="flex items-start gap-2.5 bg-green-950/20 border border-green-900/40 rounded-lg px-3 py-2.5">
              <CheckCircle2 size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300 text-xs leading-relaxed"><strong>Checkpoint:</strong> {step.checkpoint}</p>
            </div>
          )}
          {(step.materials?.length > 0 || step.tools?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {step.materials?.length > 0 && (
                <div className="bg-slate-800/40 rounded-lg p-3">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Package size={9} /> Materials
                  </p>
                  <ul className="space-y-0.5">
                    {step.materials.map((m, j) => (
                      <li key={j} className="text-slate-300 text-xs flex items-start gap-1.5">
                        <span className="text-cyan-700 mt-0.5 flex-shrink-0">·</span>
                        {typeof m === "object" ? `${m.name}${m.cost ? ` — ${m.cost}` : ""}` : m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {step.tools?.length > 0 && (
                <div className="bg-slate-800/40 rounded-lg p-3">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Wrench size={9} /> Tools
                  </p>
                  <ul className="space-y-0.5">
                    {step.tools.map((t, j) => (
                      <li key={j} className="text-slate-300 text-xs flex items-start gap-1.5">
                        <span className="text-purple-700 mt-0.5 flex-shrink-0">·</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <button onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all w-full justify-center ${
              completed ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-green-800/40 border border-green-800 text-green-300 hover:bg-green-800/60"
            }`}>
            {completed ? <><RotateCcw size={11} /> Mark Incomplete</> : <><CheckCircle2 size={11} /> Mark Step Complete</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BuildPlanViewer({ invention, data, onClose }) {
  const [activeTab, setActiveTab] = useState("schematic");
  const [bomChecked, setBomChecked] = useState([]);
  const [stepsCompleted, setStepsCompleted] = useState([]);

  useEffect(() => {
    if (data?.bom) setBomChecked(new Array(data.bom.length).fill(false));
    if (data?.steps) setStepsCompleted(new Array(data.steps.length).fill(false));
  }, [data]);

  const bomProgress = bomChecked.filter(Boolean).length;
  const stepsProgress = stepsCompleted.filter(Boolean).length;
  const totalBom = data?.bom?.length || 0;
  const totalSteps = data?.steps?.length || 0;

  const toggleBom = useCallback((i) => {
    setBomChecked(prev => { const a = [...prev]; a[i] = !a[i]; return a; });
  }, []);

  const toggleStep = useCallback((i) => {
    setStepsCompleted(prev => { const a = [...prev]; a[i] = !a[i]; return a; });
  }, []);

  const TABS = [
    { id: "schematic", label: "Schematic", icon: <Maximize2 size={13} /> },
    { id: "bom", label: `BOM (${bomProgress}/${totalBom})`, icon: <List size={13} /> },
    { id: "steps", label: `Assembly (${stepsProgress}/${totalSteps})`, icon: <BookOpen size={13} /> },
  ];

  if (!invention || !data) return null;

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-900/30 border border-cyan-800/50 flex items-center justify-center flex-shrink-0">
            <Wrench size={18} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-white font-black text-base leading-snug">{invention.title}</h2>
            <p className="text-slate-500 text-xs italic mt-0.5 line-clamp-1">{invention.tagline}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex-shrink-0">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/30">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Build Progress</span>
          <span className="text-[10px] text-slate-500">{stepsProgress}/{totalSteps} steps · {bomProgress}/{totalBom} parts</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${totalSteps > 0 ? Math.round((stepsProgress / totalSteps) * 100) : 0}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2.5 border-b border-slate-800 bg-slate-900/20">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "schematic" && (
          <div className="space-y-4">
            <SchematicPanel invention={invention} diagramType={data.diagramType} />
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info size={13} className="text-cyan-400" />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Technical Overview</p>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{data.overview}</p>
            </div>
            {data.notes && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Engineering Notes</p>
                <p className="text-slate-400 text-xs leading-relaxed">{data.notes}</p>
              </div>
            )}
            {data.softwareNotes && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Software & Firmware</p>
                <p className="text-slate-400 text-xs leading-relaxed font-mono">{data.softwareNotes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "bom" && (
          data.bom?.length > 0 ? (
            <BOMTable bom={data.bom} checked={bomChecked} onToggle={toggleBom}
              onResetAll={() => setBomChecked(new Array(data.bom.length).fill(false))} />
          ) : (
            <div className="text-center py-12 text-slate-600">
              <List size={28} className="mx-auto mb-2 opacity-30" />
              <p>No BOM data available for this build plan.</p>
            </div>
          )
        )}

        {activeTab === "steps" && (
          <div className="space-y-2">
            {stepsProgress > 0 && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-semibold">{stepsProgress} of {totalSteps} steps complete</span>
                <button onClick={() => setStepsCompleted(new Array(totalSteps).fill(false))}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400 transition-colors">
                  <RotateCcw size={10} /> Reset all
                </button>
              </div>
            )}
            {data.steps?.length > 0 ? (
              data.steps.map((step, i) => (
                <StepCard key={i} step={step} index={i} total={totalSteps}
                  completed={stepsCompleted[i] || false} onToggle={() => toggleStep(i)} />
              ))
            ) : (
              <div className="text-center py-12 text-slate-600">
                <BookOpen size={28} className="mx-auto mb-2 opacity-30" />
                <p>No assembly steps available for this build plan.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/40 text-[9px] text-slate-700 leading-relaxed">
        For research and educational purposes only. Not approved for medical, therapeutic, or commercial application.
      </div>
    </div>
  );
}