import { useState } from "react";
import { timelineEvents, eraLabels, typeIcons } from "../lib/beardenTimeline";
import { groupColors, nodes } from "../lib/beardenData";

function ConceptTag({ conceptId, onConceptClick }) {
  const node = nodes.find(n => n.id === conceptId);
  if (!node) return null;
  const color = groupColors[node.group] || "#6b7280";
  return (
    <button
      onClick={() => onConceptClick(conceptId)}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors hover:opacity-80"
      style={{ borderColor: color + "60", backgroundColor: color + "15", color }}
    >
      {node.label}
    </button>
  );
}

export default function TimelineView({ onConceptClick }) {
  const [activeEra, setActiveEra] = useState(null);

  const filtered = activeEra
    ? timelineEvents.filter(e => e.era === activeEra)
    : timelineEvents;

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-950 px-4 py-6">
      <div className="max-w-2xl mx-auto">

        {/* Era filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveEra(null)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              activeEra === null
                ? "bg-gray-700 border-gray-500 text-white"
                : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            All Eras
          </button>
          {Object.entries(eraLabels).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setActiveEra(activeEra === key ? null : key)}
              className="px-3 py-1 rounded-full text-xs border transition-colors"
              style={
                activeEra === key
                  ? { backgroundColor: color + "25", borderColor: color, color }
                  : { backgroundColor: "transparent", borderColor: "#374151", color: "#9ca3af" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-16 top-0 bottom-0 w-px bg-gray-800" />

          <div className="space-y-6">
            {filtered.map((event, i) => (
              <div key={i} className="flex gap-4 group">
                {/* Year */}
                <div className="w-12 flex-shrink-0 text-right">
                  <span className="text-gray-500 text-xs font-mono leading-none">{event.year}</span>
                </div>

                {/* Dot */}
                <div className="flex-shrink-0 flex flex-col items-center" style={{ width: "8px", marginTop: "4px" }}>
                  <div
                    className="w-3 h-3 rounded-full border-2 z-10 flex-shrink-0 transition-transform group-hover:scale-125"
                    style={{ backgroundColor: event.color + "30", borderColor: event.color }}
                  />
                </div>

                {/* Card */}
                <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-4 mb-1 hover:border-gray-600 transition-colors">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-base leading-none mt-0.5">{typeIcons[event.type]}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider"
                          style={{ backgroundColor: eraLabels[event.era].color + "20", color: eraLabels[event.era].color }}
                        >
                          {eraLabels[event.era].label}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-sm leading-snug">{event.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">{event.description}</p>
                  {event.concepts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {event.concepts.map(cid => (
                        <ConceptTag key={cid} conceptId={cid} onConceptClick={onConceptClick} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}