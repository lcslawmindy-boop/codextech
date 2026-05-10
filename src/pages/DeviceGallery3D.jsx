import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
import { businessItems } from "../lib/businessItems";
import { deviceImages } from "../lib/deviceImages";

const inventions = businessItems.filter(i => i.category === "Invention");

const colors = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#8b5cf6", "#14b8a6", "#fb923c"];

export default function DeviceGallery3D() {
  const [search, setSearch] = useState("");

  const filtered = inventions.filter(inv =>
    inv.title.toLowerCase().includes(search.toLowerCase()) ||
    inv.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 sticky top-0 z-20 bg-gray-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/invention-library" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">🎨 Device Gallery 3D</h1>
            <p className="text-gray-500 text-xs">Interactive 3D visualization of all inventions</p>
          </div>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search devices…"
            className="bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-500 w-64"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"><X size={12} /></button>}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((inv, i) => {
            const color = inv.color || colors[i % colors.length];
            return (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col hover:border-gray-700 transition-all"
                style={{ borderTopColor: color, borderTopWidth: 3 }}>
                {/* Device Image */}
                <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center overflow-hidden">
                  {deviceImages[inv.title] ? (
                    <img src={deviceImages[inv.title]} alt={inv.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-600 text-xs text-center">No image available</div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-2xl flex-shrink-0">{inv.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm leading-snug">{inv.title}</h3>
                      <p className="text-gray-500 text-xs mt-0.5 italic">"{inv.tagline}"</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed flex-1">{inv.description}</p>
                  <div className="mt-3 flex items-center gap-2 justify-between">
                    <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">{inv.price}</span>
                    <Link to="/invention-library" className="text-xs px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <p className="text-4xl mb-3">🔍</p>
            <p>No devices match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}