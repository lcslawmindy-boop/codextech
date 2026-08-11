import { AlertTriangle, Shield, Clock } from "lucide-react";
import { SUPPRESSION_COLORS, DOMAIN_COLORS } from "@/lib/researchGraphExpansion";

export default function SuppressionTimelineView({ timeline }) {
  // Group by era
  const eras = [
    { label: "1900s–1930s", start: 1900, end: 1939, color: "#f59e0b" },
    { label: "1940s–1960s", start: 1940, end: 1969, color: "#ef4444" },
    { label: "1970s–1990s", start: 1970, end: 1999, color: "#a855f7" },
    { label: "2000s–Present", start: 2000, end: 2030, color: "#06b6d4" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Clock size={18} className="text-red-400" />
        <h3 className="text-white font-bold text-lg">Suppression Timeline</h3>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed">
        Historical timeline of technology development and institutional suppression. Each entry shows the year developed,
        year suppressed (if applicable), responsible institution, current status, and estimated cost to humanity.
      </p>

      {eras.map(era => {
        const eraEvents = timeline.filter(e => e.year >= era.start && e.year <= era.end);
        if (eraEvents.length === 0) return null;
        return (
          <div key={era.label}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: era.color }} />
              <h4 className="text-white font-bold text-sm" style={{ color: era.color }}>{era.label}</h4>
              <div className="flex-1 h-px" style={{ backgroundColor: era.color + "40" }} />
            </div>
            <div className="space-y-2 ml-6">
              {eraEvents.map((event, i) => {
                const isSuppressed = !!event.suppression;
                const domainColor = event.tech ? DOMAIN_COLORS["Bioelectromagnetics"] : "#6b7280";
                return (
                  <div
                    key={i}
                    className={`bg-gray-900 border rounded-lg p-3 ${isSuppressed ? "border-red-800/50" : "border-gray-800"}`}
                    style={isSuppressed ? { borderLeftColor: "#ef4444", borderLeftWidth: 3 } : { borderLeftColor: "#22c55e", borderLeftWidth: 3 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-white font-bold text-sm font-mono flex-shrink-0 w-12">{event.year}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold leading-tight">{event.event}</p>
                        {isSuppressed && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <AlertTriangle size={11} className="text-red-400" />
                            <span className="text-red-400 text-[10px] font-bold">Suppressed {event.suppression} — {event.institution}</span>
                          </div>
                        )}
                        <p className="text-gray-500 text-[10px] mt-0.5">Status: {event.status}</p>
                        {event.costToHumanity && event.costToHumanity !== "None — mainstream acceptance" && (
                          <p className="text-gray-600 text-[10px] mt-1 leading-relaxed italic">Cost to humanity: {event.costToHumanity}</p>
                        )}
                      </div>
                      {isSuppressed ? (
                        <Shield size={14} className="text-red-400 flex-shrink-0" />
                      ) : (
                        <Shield size={14} className="text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}