import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Trash2, MapPin, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";

const RISK_ZONES = [
  { max: 1, label: "Safe Zone", color: "#22c55e", bg: "rgba(34,197,94,0.35)" },
  { max: 4, label: "Low Risk", color: "#84cc16", bg: "rgba(132,204,22,0.35)" },
  { max: 10, label: "Moderate", color: "#f59e0b", bg: "rgba(245,158,11,0.35)" },
  { max: Infinity, label: "High Risk", color: "#ef4444", bg: "rgba(239,68,68,0.40)" },
];

function getRisk(mG) {
  return RISK_ZONES.find(z => mG < z.max) || RISK_ZONES[RISK_ZONES.length - 1];
}

function HeatmapCanvas({ pins, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pins.length) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    pins.forEach(pin => {
      const risk = getRisk(pin.mG);
      const radius = 60;
      const grad = ctx.createRadialGradient(pin.x, pin.y, 0, pin.x, pin.y, radius);
      grad.addColorStop(0, risk.bg.replace("0.35", "0.55").replace("0.40", "0.60"));
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }, [pins, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="absolute inset-0 pointer-events-none" />;
}

export default function FloorPlanHeatmap({ logs }) {
  const [floorPlanUrl, setFloorPlanUrl] = useState(() => localStorage.getItem("emf_floorplan") || null);
  const [pins, setPins] = useState(() => {
    try { return JSON.parse(localStorage.getItem("emf_pins") || "[]"); } catch { return []; }
  });
  const [uploading, setUploading] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [pendingPin, setPendingPin] = useState(null); // {x, y}
  const [pinForm, setPinForm] = useState({ label: "", mG: "" });
  const [imgSize, setImgSize] = useState({ w: 800, h: 500 });
  const [tooltip, setTooltip] = useState(null);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Save pins to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("emf_pins", JSON.stringify(pins));
  }, [pins]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFloorPlanUrl(file_url);
    localStorage.setItem("emf_floorplan", file_url);
    setUploading(false);
  };

  const handleImageLoad = () => {
    if (imgRef.current) {
      setImgSize({ w: imgRef.current.offsetWidth, h: imgRef.current.offsetHeight });
    }
  };

  const handleMapClick = useCallback((e) => {
    if (!addMode) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPendingPin({ x, y });
    setPinForm({ label: "", mG: "" });
  }, [addMode]);

  const handleAddPin = () => {
    if (!pendingPin || pinForm.mG === "") return;
    const newPin = {
      id: Date.now(),
      x: pendingPin.x,
      y: pendingPin.y,
      label: pinForm.label || "Location",
      mG: parseFloat(pinForm.mG),
    };
    setPins(prev => [...prev, newPin]);
    setPendingPin(null);
    setPinForm({ label: "", mG: "" });
  };

  const removePin = (id) => setPins(prev => prev.filter(p => p.id !== id));

  const clearAll = () => {
    setPins([]);
    setFloorPlanUrl(null);
    localStorage.removeItem("emf_pins");
    localStorage.removeItem("emf_floorplan");
  };

  // Recent log locations as suggestions
  const locationSuggestions = [...new Set(logs.map(l => l.location).filter(Boolean))].slice(0, 8);

  const safeCount = pins.filter(p => p.mG < 1).length;
  const highCount = pins.filter(p => p.mG >= 10).length;
  const modCount = pins.filter(p => p.mG >= 4 && p.mG < 10).length;

  return (
    <div className="space-y-4">
      {/* Legend + stats */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          {RISK_ZONES.map(z => (
            <span key={z.label} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
              style={{ borderColor: z.color + "60", color: z.color, backgroundColor: z.color + "15" }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: z.color }} />
              {z.label}
            </span>
          ))}
        </div>
        {pins.length > 0 && (
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="text-green-400">{safeCount} safe</span>
            <span className="text-orange-400">{modCount} moderate</span>
            <span className="text-red-400">{highCount} high</span>
          </div>
        )}
      </div>

      {!floorPlanUrl ? (
        /* Upload prompt */
        <div className="border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center">
          <Upload size={40} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Upload Your Floor Plan</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Upload a photo or image of your home's floor plan, then drop pins at each location where you've taken EMF readings.
          </p>
          <label className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm transition-all mx-auto w-fit">
            {uploading ? "Uploading…" : <><Upload size={14} /> Upload Floor Plan Image</>}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          <p className="text-gray-700 text-xs mt-4">Supports JPG, PNG, PDF screenshots, hand-drawn plans</p>
        </div>
      ) : (
        /* Map area */
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => { setAddMode(m => !m); setPendingPin(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                addMode ? "bg-red-700 border-red-600 text-white" : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500"
              }`}>
              <MapPin size={13} /> {addMode ? "Click map to place pin…" : "Add Reading Pin"}
            </button>
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-gray-700 text-gray-400 hover:border-gray-500 cursor-pointer transition-all">
              <Upload size={12} /> Change Image
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            {pins.length > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-red-400 border border-red-900/50 hover:border-red-700 transition-all">
                <Trash2 size={12} /> Clear All
              </button>
            )}
            {addMode && (
              <div className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-950/30 border border-yellow-800/40 px-3 py-1.5 rounded-lg">
                <Info size={11} /> Click anywhere on the floor plan to place a reading pin
              </div>
            )}
          </div>

          {/* Floor plan canvas */}
          <div
            ref={containerRef}
            className={`relative rounded-2xl overflow-hidden border border-gray-700 select-none ${addMode ? "cursor-crosshair" : "cursor-default"}`}
            onClick={handleMapClick}
          >
            <img
              ref={imgRef}
              src={floorPlanUrl}
              alt="Floor plan"
              className="w-full block"
              onLoad={handleImageLoad}
              draggable={false}
            />

            {/* Heatmap overlay */}
            <HeatmapCanvas pins={pins} width={imgSize.w} height={imgSize.h} />

            {/* Pins */}
            {pins.map(pin => {
              const risk = getRisk(pin.mG);
              return (
                <div
                  key={pin.id}
                  className="absolute group"
                  style={{ left: pin.x - 12, top: pin.y - 28 }}
                  onMouseEnter={() => setTooltip(pin.id)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div className="relative">
                    {/* Pin */}
                    <MapPin size={24} fill={risk.color} stroke="#fff" strokeWidth={1.5} style={{ color: risk.color, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }} />
                    {/* Tooltip */}
                    {tooltip === pin.id && (
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap z-10 shadow-xl">
                        <p className="text-white font-bold">{pin.label}</p>
                        <p style={{ color: risk.color }}>{pin.mG} mG — {risk.label}</p>
                        <button onClick={(e) => { e.stopPropagation(); removePin(pin.id); }}
                          className="text-red-400 hover:text-red-300 mt-1 flex items-center gap-1">
                          <Trash2 size={10} /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pending pin form */}
            {pendingPin && (
              <div
                className="absolute z-20 bg-gray-900 border border-gray-600 rounded-xl p-4 shadow-2xl w-56"
                style={{ left: Math.min(pendingPin.x + 10, imgSize.w - 220), top: Math.max(pendingPin.y - 120, 10) }}
                onClick={e => e.stopPropagation()}
              >
                <p className="text-white text-xs font-bold mb-3">📍 New Reading Pin</p>
                <div className="space-y-2">
                  <div>
                    <label className="text-gray-500 text-xs block mb-1">Label</label>
                    <input
                      value={pinForm.label}
                      onChange={e => setPinForm(f => ({ ...f, label: e.target.value }))}
                      placeholder="e.g. Bedroom, Router..."
                      list="location-suggestions"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
                    />
                    <datalist id="location-suggestions">
                      {locationSuggestions.map(l => <option key={l} value={l} />)}
                    </datalist>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs block mb-1">EMF Reading (mG) *</label>
                    <input
                      type="number" step="0.01"
                      value={pinForm.mG}
                      onChange={e => setPinForm(f => ({ ...f, mG: e.target.value }))}
                      placeholder="e.g. 3.2"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  {pinForm.mG && (
                    <div className="text-xs px-2 py-1 rounded-lg font-bold text-center" style={{ backgroundColor: getRisk(parseFloat(pinForm.mG)).color + "20", color: getRisk(parseFloat(pinForm.mG)).color }}>
                      {getRisk(parseFloat(pinForm.mG)).label}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleAddPin} disabled={!pinForm.mG}
                    className="flex-1 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-bold disabled:opacity-50 transition-all">
                    Place Pin
                  </button>
                  <button onClick={() => setPendingPin(null)}
                    className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 text-xs hover:border-gray-500 transition-colors">
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pin list */}
          {pins.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">📌 Pinned Locations ({pins.length})</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {pins.map(pin => {
                  const risk = getRisk(pin.mG);
                  return (
                    <div key={pin.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: risk.color }} />
                        <span className="text-white text-xs font-semibold">{pin.label}</span>
                        <span className="text-xs" style={{ color: risk.color }}>{pin.mG} mG</span>
                      </div>
                      <button onClick={() => removePin(pin.id)} className="text-gray-700 hover:text-red-400 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}