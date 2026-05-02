import { useState } from "react";
import { X, Copy, Check, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

function generateId() {
  return "dev_" + Math.random().toString(36).slice(2, 10);
}
function generateKey() {
  return "sk_" + Array.from(crypto.getRandomValues(new Uint8Array(18))).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export default function DeviceSetupModal({ userEmail, onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    description: "",
    invention_name: "",
    protocol: "HTTP",
    sensors: [{ channel: "voltage", label: "Input Voltage", unit: "V", color: "#06b6d4" }],
  });
  const [deviceId] = useState(generateId());
  const [apiKey] = useState(generateKey());
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(null);

  const addSensor = () => {
    setForm(f => ({ ...f, sensors: [...f.sensors, { channel: "", label: "", unit: "", color: "#a78bfa" }] }));
  };
  const updateSensor = (i, field, val) => {
    setForm(f => {
      const sensors = [...f.sensors];
      sensors[i] = { ...sensors[i], [field]: val };
      return { ...f, sensors };
    });
  };
  const removeSensor = (i) => {
    setForm(f => ({ ...f, sensors: f.sensors.filter((_, idx) => idx !== i) }));
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreate = async () => {
    if (!form.name) return;
    setSaving(true);
    const device = await base44.entities.IoTDevice.create({
      user_email: userEmail,
      name: form.name,
      description: form.description,
      invention_name: form.invention_name,
      protocol: form.protocol,
      device_id: deviceId,
      api_key: apiKey,
      sensors: form.sensors.filter(s => s.channel),
      status: "inactive",
      total_readings: 0,
    });
    setSaving(false);
    setStep(3);
    onCreated(device);
  };

  // Build the example HTTP snippet
  const ingestUrl = `${window.location.origin}/api/f/telemetryIngest`;
  const curlExample = `curl -X POST "${ingestUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "device_id": "${deviceId}",
    "api_key": "${apiKey}",
    "readings": [
      {"channel": "${form.sensors[0]?.channel || 'voltage'}", "value": 12.4, "unit": "${form.sensors[0]?.unit || 'V'}"}
    ]
  }'`;

  const pythonExample = `import requests, json

URL = "${ingestUrl}"
DEVICE_ID = "${deviceId}"
API_KEY = "${apiKey}"

def send_reading(channel, value, unit):
    requests.post(URL, json={
        "device_id": DEVICE_ID,
        "api_key": API_KEY,
        "readings": [{"channel": channel, "value": value, "unit": unit}]
    })

# Example:
send_reading("${form.sensors[0]?.channel || 'voltage'}", 12.4, "${form.sensors[0]?.unit || 'V'}")`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-black text-lg">Connect a Device</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>

        <div className="px-6 py-5">
          {/* Steps */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step >= s ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-500"}`}>{s}</div>
                {s < 3 && <div className={`h-px w-8 ${step > s ? "bg-cyan-600" : "bg-gray-800"}`} />}
              </div>
            ))}
            <span className="text-gray-500 text-xs ml-2">{step === 1 ? "Device Info" : step === 2 ? "Sensors" : "Connect"}</span>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs font-bold mb-1 block">Device Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. MEG Replication Prototype v1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-bold mb-1 block">Linked Build / Invention</label>
                <input
                  value={form.invention_name}
                  onChange={e => setForm(f => ({ ...f, invention_name: e.target.value }))}
                  placeholder="e.g. Motionless Electromagnetic Generator"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-bold mb-1 block">Protocol</label>
                <div className="flex gap-2">
                  {["HTTP", "MQTT"].map(p => (
                    <button key={p} onClick={() => setForm(f => ({ ...f, protocol: p }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                        form.protocol === p ? "border-cyan-600 bg-cyan-950/40 text-cyan-300" : "border-gray-700 bg-gray-800 text-gray-400"
                      }`}>{p}</button>
                  ))}
                </div>
                {form.protocol === "MQTT" && (
                  <p className="text-yellow-600 text-xs mt-2">⚠ MQTT requires an MQTT broker. Use the HTTP endpoint for the easiest setup.</p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs font-bold mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional notes about this device"
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 resize-none"
                />
              </div>
              <button onClick={() => setStep(2)}
                disabled={!form.name}
                className="w-full py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm disabled:opacity-50 transition-all">
                Next: Configure Sensors →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-400 text-xs">Define the sensor channels this device will send. You can always add more later.</p>
              {form.sensors.map((s, i) => (
                <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={s.channel} onChange={e => updateSensor(i, "channel", e.target.value)}
                      placeholder="Channel key (e.g. voltage)"
                      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600" />
                    <input value={s.label} onChange={e => updateSensor(i, "label", e.target.value)}
                      placeholder="Label (e.g. Input Voltage)"
                      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600" />
                    <input value={s.unit} onChange={e => updateSensor(i, "unit", e.target.value)}
                      placeholder="Unit (e.g. V, T, A, Hz)"
                      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600" />
                    <div className="flex items-center gap-2">
                      <input type="color" value={s.color || "#06b6d4"} onChange={e => updateSensor(i, "color", e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                      <span className="text-gray-500 text-xs">Chart color</span>
                    </div>
                  </div>
                  {form.sensors.length > 1 && (
                    <button onClick={() => removeSensor(i)} className="text-xs text-red-700 hover:text-red-400">Remove</button>
                  )}
                </div>
              ))}
              <button onClick={addSensor} className="w-full py-2 rounded-xl border border-dashed border-gray-700 text-gray-500 text-xs hover:border-gray-600 hover:text-gray-300 transition-all">
                + Add Another Sensor Channel
              </button>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm hover:text-white">← Back</button>
                <button onClick={handleCreate} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm disabled:opacity-50 transition-all">
                  {saving ? "Creating…" : "Create Device"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-green-900/40 border border-green-700 flex items-center justify-center mx-auto mb-3">
                  <Check size={22} className="text-green-400" />
                </div>
                <p className="text-white font-black">Device Created!</p>
                <p className="text-gray-500 text-sm mt-1">Copy your credentials and start sending data.</p>
              </div>

              {/* Credentials */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs font-bold">Device ID</span>
                  <button onClick={() => copy(deviceId, "id")} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300">
                    {copied === "id" ? <Check size={11} /> : <Copy size={11} />} {copied === "id" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code className="block text-cyan-300 text-xs font-mono bg-gray-900 rounded-lg px-3 py-2 break-all">{deviceId}</code>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-400 text-xs font-bold">API Key</span>
                  <button onClick={() => copy(apiKey, "key")} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300">
                    {copied === "key" ? <Check size={11} /> : <Copy size={11} />} {copied === "key" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code className="block text-yellow-300 text-xs font-mono bg-gray-900 rounded-lg px-3 py-2 break-all">{apiKey}</code>
                <p className="text-red-400 text-xs">⚠ Save your API key now — it won't be shown again.</p>
              </div>

              {/* Code snippets */}
              <div>
                <p className="text-gray-400 text-xs font-bold mb-2">cURL Example</p>
                <div className="relative">
                  <pre className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">{curlExample}</pre>
                  <button onClick={() => copy(curlExample, "curl")} className="absolute top-2 right-2 text-xs text-gray-600 hover:text-gray-300 flex items-center gap-1">
                    {copied === "curl" ? <Check size={11} /> : <Copy size={11} />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-xs font-bold mb-2">Python Example</p>
                <div className="relative">
                  <pre className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">{pythonExample}</pre>
                  <button onClick={() => copy(pythonExample, "py")} className="absolute top-2 right-2 text-xs text-gray-600 hover:text-gray-300 flex items-center gap-1">
                    {copied === "py" ? <Check size={11} /> : <Copy size={11} />}
                  </button>
                </div>
              </div>

              <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm transition-all">
                Done — Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}