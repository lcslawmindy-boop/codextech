import { Wifi, WifiOff, Zap, Clock, Trash2, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const STATUS_STYLES = {
  active: "bg-green-900/40 text-green-400 border-green-700",
  inactive: "bg-gray-800 text-gray-500 border-gray-700",
  error: "bg-red-900/30 text-red-400 border-red-700",
};

export default function DeviceCard({ device, selected, onSelect, onDelete }) {
  const lastSeen = device.last_seen
    ? formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })
    : "Never";

  return (
    <div
      onClick={() => onSelect(device)}
      className={`cursor-pointer rounded-xl border p-4 transition-all ${
        selected
          ? "border-cyan-600 bg-cyan-950/20 shadow-lg shadow-cyan-900/20"
          : "border-gray-800 bg-gray-900/60 hover:border-gray-700"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {device.status === "active" ? (
            <Wifi size={15} className="text-green-400" />
          ) : (
            <WifiOff size={15} className="text-gray-600" />
          )}
          <span className="text-white font-bold text-sm truncate max-w-[120px]">{device.name}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${STATUS_STYLES[device.status] || STATUS_STYLES.inactive}`}>
          {device.status || "inactive"}
        </span>
      </div>

      <p className="text-gray-500 text-xs mb-3 truncate">{device.invention_name || "No build linked"}</p>

      <div className="flex items-center gap-3 text-xs text-gray-600">
        <span className="flex items-center gap-1"><Zap size={10} /> {device.total_readings || 0} pts</span>
        <span className="flex items-center gap-1"><Clock size={10} /> {lastSeen}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500 font-mono">{device.protocol || "HTTP"}</span>
        {(device.sensors || []).map((s, i) => (
          <span key={i} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: (s.color || "#06b6d4") + "22", color: s.color || "#06b6d4" }}>
            {s.channel}
          </span>
        ))}
      </div>

      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(device); }}
          className="mt-3 text-xs text-gray-700 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 size={11} /> Remove device
        </button>
      )}
    </div>
  );
}