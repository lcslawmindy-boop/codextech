import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { businessItems } from "@/lib/businessItems";
import BottomSheet from "@/components/BottomSheet";

const inventionNames = businessItems
  .filter(i => i.category === "Invention")
  .map(i => i.title);

const SENSOR_TYPES = [
  { value: "photon_count", label: "Photon Count (counts/sec)" },
  { value: "spectrum", label: "Spectrum Reading (nm)" },
  { value: "voltage", label: "Voltage (mV / V)" },
  { value: "current", label: "Current (mA / µA)" },
  { value: "frequency", label: "Frequency (Hz / kHz / MHz)" },
  { value: "field_strength", label: "Field Strength (mT / µT)" },
  { value: "temperature", label: "Temperature (°C)" },
  { value: "pressure", label: "Pressure (Pa / mbar)" },
  { value: "custom", label: "Custom / Other" },
];

const INVENTION_OPTIONS = inventionNames.map(n => ({ value: n, label: n }));

export default function ExperimentForm({ onSave, onCancel, initial }) {
  const [form, setForm] = useState(initial || {
    title: "",
    invention_name: inventionNames[0] || "",
    hypothesis: "",
    methodology: "",
    sensor_type: "photon_count",
    sensor_unit: "",
    tags: [],
    status: "planned",
  });
  const [tagInput, setTagInput] = useState("");
  const [inventionSheetOpen, setInventionSheetOpen] = useState(false);
  const [sensorSheetOpen, setSensorSheetOpen] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags?.includes(t)) set("tags", [...(form.tags || []), t]);
    setTagInput("");
  };

  const removeTag = (t) => set("tags", form.tags.filter(x => x !== t));

  const selectedSensorLabel = SENSOR_TYPES.find(s => s.value === form.sensor_type)?.label || form.sensor_type;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
      <h3 className="text-white font-black text-lg">{initial ? "Edit Experiment" : "New Experiment"}</h3>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">Experiment Title *</label>
        <input value={form.title} onChange={e => set("title", e.target.value)}
          placeholder="e.g. Anenergy Pump Phase-Alignment Study #3"
          className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
      </div>

      {/* Invention — BottomSheet picker */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">Based on Invention *</label>
        <button
          type="button"
          onClick={() => setInventionSheetOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500 text-left"
          style={{ minHeight: 44 }}
        >
          <span className="truncate">{form.invention_name || "Select invention…"}</span>
          <ChevronDown size={14} className="text-gray-500 flex-shrink-0 ml-2" />
        </button>
        <BottomSheet
          open={inventionSheetOpen}
          onClose={() => setInventionSheetOpen(false)}
          title="Select Invention"
          options={INVENTION_OPTIONS}
          value={form.invention_name}
          onChange={(val) => set("invention_name", val)}
        />
      </div>

      {/* Sensor type + unit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Primary Sensor Type</label>
          <button
            type="button"
            onClick={() => setSensorSheetOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500 text-left"
            style={{ minHeight: 44 }}
          >
            <span className="truncate text-xs">{selectedSensorLabel}</span>
            <ChevronDown size={14} className="text-gray-500 flex-shrink-0 ml-1" />
          </button>
          <BottomSheet
            open={sensorSheetOpen}
            onClose={() => setSensorSheetOpen(false)}
            title="Select Sensor Type"
            options={SENSOR_TYPES}
            value={form.sensor_type}
            onChange={(val) => set("sensor_type", val)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Unit Label (e.g. counts/sec)</label>
          <input value={form.sensor_unit} onChange={e => set("sensor_unit", e.target.value)}
            placeholder="counts/sec"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
        </div>
      </div>

      {/* Hypothesis */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">Hypothesis / Research Question</label>
        <textarea value={form.hypothesis} onChange={e => set("hypothesis", e.target.value)}
          rows={2} placeholder="What are you testing or observing?"
          className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 resize-none" />
      </div>

      {/* Methodology */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">Methodology / Setup Notes</label>
        <textarea value={form.methodology} onChange={e => set("methodology", e.target.value)}
          rows={3} placeholder="Describe your experimental setup, parameters, and controls..."
          className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 resize-none" />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">Tags</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {(form.tags || []).map(t => (
            <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-900/40 border border-cyan-700 text-cyan-300 text-xs">
              {t}
              <button onClick={() => removeTag(t)} className="hover:text-white"><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Add tag, press Enter"
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-cyan-500" />
          <button onClick={addTag} className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs">Add</button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)}
          disabled={!form.title || !form.invention_name}
          className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm disabled:opacity-50 transition-colors">
          {initial ? "Save Changes" : "Create Experiment"}
        </button>
        <button onClick={onCancel}
          className="px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}