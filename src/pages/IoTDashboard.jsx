import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Activity, Bell, History, Cpu, RefreshCw, AlertTriangle, Wifi, WifiOff, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DeviceCard from "../components/telemetry/DeviceCard";
import TelemetryChart from "../components/telemetry/TelemetryChart";
import AlertsPanel from "../components/telemetry/AlertsPanel";
import HistoryPanel from "../components/telemetry/HistoryPanel";
import DeviceSetupModal from "../components/telemetry/DeviceSetupModal";

const TABS = [
  { id: "live", label: "Live Feed", icon: Activity },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "history", label: "History", icon: History },
];

const POLL_INTERVAL = 5000; // 5 seconds

export default function IoTDashboard() {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("live");
  const [showSetup, setShowSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pollingActive, setPollingActive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [unackedAlerts, setUnackedAlerts] = useState(0);
  const pollRef = useRef(null);

  // Auth check
  useEffect(() => {
    base44.auth.me().then(u => {
      if (u) setUser(u);
      else base44.auth.redirectToLogin();
    }).catch(() => base44.auth.redirectToLogin());
  }, []);

  // Load devices
  const loadDevices = useCallback(async () => {
    if (!user) return;
    const devs = await base44.entities.IoTDevice.filter({ user_email: user.email });
    setDevices(devs);
    if (!selectedDevice && devs.length > 0) setSelectedDevice(devs[0]);
    setLoading(false);
  }, [user, selectedDevice]);

  useEffect(() => {
    loadDevices();
  }, [user]);

  // Load readings for selected device (polling)
  const loadReadings = useCallback(async () => {
    if (!selectedDevice) return;
    const data = await base44.entities.TelemetryReading.filter(
      { device_id: selectedDevice.device_id },
      "-timestamp",
      200
    );
    setReadings(data.reverse());
    setLastUpdated(new Date());
  }, [selectedDevice]);

  // Load alerts
  const loadAlerts = useCallback(async () => {
    if (!user) return;
    const data = await base44.entities.TelemetryAlert.filter({ user_email: user.email });
    setAlerts(data);
    setUnackedAlerts(data.filter(a => a.triggered_at && !a.acknowledged).length);
  }, [user]);

  useEffect(() => {
    loadReadings();
    loadAlerts();
  }, [selectedDevice, user]);

  // Polling
  useEffect(() => {
    if (!pollingActive || !selectedDevice) return;
    pollRef.current = setInterval(() => {
      loadReadings();
      loadAlerts();
    }, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [pollingActive, selectedDevice, loadReadings, loadAlerts]);

  const handleDeviceCreated = (device) => {
    setDevices(prev => [...prev, device]);
    setSelectedDevice(device);
    setShowSetup(false);
  };

  const handleDeleteDevice = async (device) => {
    if (!confirm(`Remove device "${device.name}"? This will not delete existing readings.`)) return;
    await base44.entities.IoTDevice.delete(device.id);
    setDevices(prev => prev.filter(d => d.id !== device.id));
    if (selectedDevice?.id === device.id) setSelectedDevice(null);
  };

  // Current readings stats
  const latestReadings = readings.length
    ? Object.values(
        readings.reduce((acc, r) => {
          if (!acc[r.channel] || r.timestamp > acc[r.channel].timestamp) acc[r.channel] = r;
          return acc;
        }, {})
      )
    : [];

  const deviceAlerts = alerts.filter(a => a.device_id === selectedDevice?.device_id);
  const activeAlertCount = deviceAlerts.filter(a => a.triggered_at && !a.acknowledged).length;

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/60">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-cyan-400" />
            <h1 className="text-white font-bold text-lg">IoT Telemetry Dashboard</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-gray-600 text-xs">Updated {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button
            onClick={() => setPollingActive(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              pollingActive ? "bg-green-900/40 text-green-400 border border-green-700" : "bg-gray-800 text-gray-500 border border-gray-700"
            }`}
          >
            {pollingActive ? <><Wifi size={11} /> Live</> : <><WifiOff size={11} /> Paused</>}
          </button>
          <button onClick={() => { loadReadings(); loadAlerts(); }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all">
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => setShowSetup(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-bold transition-all"
          >
            <Plus size={14} /> Connect Device
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar — device list */}
        <div className="w-60 flex-shrink-0 border-r border-gray-800 overflow-y-auto bg-gray-900/30 p-3 space-y-2">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider px-1 mb-2">Devices ({devices.length})</p>
          {devices.length === 0 ? (
            <div className="text-center py-8">
              <Cpu size={28} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-xs">No devices yet</p>
              <button onClick={() => setShowSetup(true)} className="mt-3 text-cyan-500 text-xs hover:text-cyan-300">
                + Connect your first device
              </button>
            </div>
          ) : (
            devices.map(dev => (
              <DeviceCard
                key={dev.id}
                device={dev}
                selected={selectedDevice?.id === dev.id}
                onSelect={setSelectedDevice}
                onDelete={handleDeleteDevice}
              />
            ))
          )}
        </div>

        {/* Main panel */}
        <div className="flex-1 overflow-y-auto">
          {!selectedDevice ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Cpu size={48} className="text-gray-700 mx-auto mb-4" />
                <h2 className="text-white font-bold text-xl mb-2">No Device Selected</h2>
                <p className="text-gray-500 text-sm mb-6">Connect a hardware prototype to start streaming sensor data.</p>
                <button onClick={() => setShowSetup(true)}
                  className="px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm transition-all">
                  Connect Your First Device
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* Device header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-white font-black text-2xl">{selectedDevice.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${
                      selectedDevice.status === "active"
                        ? "bg-green-900/40 text-green-400 border-green-700"
                        : "bg-gray-800 text-gray-500 border-gray-700"
                    }`}>{selectedDevice.status || "inactive"}</span>
                  </div>
                  {selectedDevice.invention_name && (
                    <p className="text-gray-500 text-sm">{selectedDevice.invention_name}</p>
                  )}
                  <p className="text-gray-700 text-xs font-mono mt-1">ID: {selectedDevice.device_id}</p>
                </div>
                {activeAlertCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-900/30 border border-red-700">
                    <AlertTriangle size={14} className="text-red-400" />
                    <span className="text-red-300 text-sm font-black">{activeAlertCount} unacknowledged alert{activeAlertCount > 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>

              {/* Live sensor readings — current values */}
              {latestReadings.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {latestReadings.map((r, i) => {
                    const sensorConfig = (selectedDevice.sensors || []).find(s => s.channel === r.channel);
                    const color = sensorConfig?.color || "#06b6d4";
                    const hasAlert = deviceAlerts.some(a => a.channel === r.channel && a.triggered_at && !a.acknowledged);
                    return (
                      <div key={i} className={`rounded-xl border p-4 ${hasAlert ? "border-red-700 bg-red-950/20" : "border-gray-800 bg-gray-900/60"}`}>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{r.label || r.channel}</p>
                        <p className="font-black text-2xl" style={{ color }}>{r.value}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{r.unit}</p>
                        {hasAlert && <p className="text-red-400 text-xs mt-1 font-bold">⚠ Alert</p>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-1 border-b border-gray-800 pb-0">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const badge = tab.id === "alerts" && unackedAlerts > 0 ? unackedAlerts : null;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all -mb-px relative ${
                        activeTab === tab.id
                          ? "border-cyan-500 text-cyan-300"
                          : "border-transparent text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <Icon size={14} /> {tab.label}
                      {badge && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-black">{badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              {activeTab === "live" && (
                <div className="space-y-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Activity size={12} /> Real-time Waveform
                      </p>
                      <span className="text-xs text-gray-600">{readings.length} data points</span>
                    </div>
                    <TelemetryChart
                      readings={readings}
                      alerts={deviceAlerts}
                      channels={selectedDevice.sensors || []}
                    />
                  </div>

                  {/* Raw reading log */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Recent Readings</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="text-left text-gray-600 pb-2 pr-4">Time</th>
                            <th className="text-left text-gray-600 pb-2 pr-4">Channel</th>
                            <th className="text-left text-gray-600 pb-2 pr-4">Value</th>
                            <th className="text-left text-gray-600 pb-2">Alert</th>
                          </tr>
                        </thead>
                        <tbody>
                          {readings.slice(-20).reverse().map((r, i) => (
                            <tr key={i} className={`border-b border-gray-800/50 ${r.alert_triggered ? "bg-red-950/10" : i % 2 === 0 ? "bg-gray-900/20" : ""}`}>
                              <td className="py-1.5 pr-4 text-gray-600 font-mono">
                                {new Date(r.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="py-1.5 pr-4 text-cyan-400 font-bold">{r.label || r.channel}</td>
                              <td className="py-1.5 pr-4 text-white font-black">{r.value} <span className="text-gray-600 font-normal">{r.unit}</span></td>
                              <td className="py-1.5">
                                {r.alert_triggered && <span className="text-red-400">⚠</span>}
                              </td>
                            </tr>
                          ))}
                          {readings.length === 0 && (
                            <tr><td colSpan={4} className="py-6 text-center text-gray-700">Waiting for readings…</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* HTTP quick-send instructions */}
                  {readings.length === 0 && (
                    <div className="bg-gray-900/40 border border-dashed border-gray-700 rounded-2xl p-6">
                      <p className="text-gray-400 font-bold text-sm mb-3 flex items-center gap-2"><Zap size={14} className="text-cyan-400" /> Quick Start — Send your first reading</p>
                      <pre className="text-xs text-gray-400 bg-gray-950 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">{`curl -X POST "${window.location.origin}/api/f/telemetryIngest" \\
  -H "Content-Type: application/json" \\
  -d '{
    "device_id": "${selectedDevice.device_id}",
    "api_key": "YOUR_API_KEY",
    "readings": [{"channel": "voltage", "value": 12.4, "unit": "V"}]
  }'`}</pre>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <AlertsPanel
                    device={selectedDevice}
                    alerts={alerts}
                    onAlertsChange={loadAlerts}
                  />
                </div>
              )}

              {activeTab === "history" && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <HistoryPanel readings={readings} device={selectedDevice} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showSetup && user && (
        <DeviceSetupModal
          userEmail={user.email}
          onClose={() => setShowSetup(false)}
          onCreated={handleDeviceCreated}
        />
      )}
    </div>
  );
}