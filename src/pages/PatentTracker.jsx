import { useState, useEffect } from "react";
import { ArrowLeft, Bell, TrendingUp, FileText, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import PortfolioValueChart from "@/components/PortfolioValueChart";
import PatentNotificationCenter from "@/components/PatentNotificationCenter";

const MOCK_PATENTS = [
  {
    id: "US1234567",
    title: "Motionless Electromagnetic Generator",
    status: "granted",
    filedDate: "2024-01-15",
    grantedDate: "2025-06-20",
    examinerId: "EXAMINER-001",
    estimatedValue: 2500000,
    notificationCount: 3,
  },
  {
    id: "US7654321",
    title: "Scalar EM Field Transmitter System",
    status: "pending",
    filedDate: "2024-03-22",
    grantedDate: null,
    examinerId: "EXAMINER-002",
    estimatedValue: 1800000,
    notificationCount: 1,
    nextActionDue: "2025-08-15",
  },
  {
    id: "US9876543",
    title: "Zero-Point Energy Extraction Protocol",
    status: "under-review",
    filedDate: "2024-06-10",
    grantedDate: null,
    examinerId: "EXAMINER-003",
    estimatedValue: 3200000,
    notificationCount: 2,
    lastOfficeAction: "2025-07-05",
  },
];

const STATUS_CONFIG = {
  granted: { color: "bg-green-900/30 border-green-700", badge: "✓ Granted", icon: CheckCircle },
  pending: { color: "bg-blue-900/30 border-blue-700", badge: "⏳ Pending", icon: Clock },
  "under-review": { color: "bg-yellow-900/30 border-yellow-700", badge: "📋 Under Review", icon: AlertCircle },
};

function PatentCard({ patent }) {
  const config = STATUS_CONFIG[patent.status];
  const Icon = config.icon;

  return (
    <div className={`border-2 rounded-2xl p-6 ${config.color}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h4 className="text-white font-bold text-lg mb-1">{patent.title}</h4>
          <p className="text-gray-400 text-sm font-mono">{patent.id}</p>
        </div>
        {patent.notificationCount > 0 && (
          <div className="flex-shrink-0 px-3 py-1 rounded-full bg-red-900/40 border border-red-700 text-red-300 text-xs font-bold">
            <Bell size={12} className="inline mr-1" /> {patent.notificationCount}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs uppercase font-bold mb-1">Filed</p>
          <p className="text-gray-300">{new Date(patent.filedDate).toLocaleDateString()}</p>
        </div>
        {patent.grantedDate && (
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Granted</p>
            <p className="text-green-300">{new Date(patent.grantedDate).toLocaleDateString()}</p>
          </div>
        )}
        {patent.nextActionDue && (
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Next Action Due</p>
            <p className="text-yellow-300">{new Date(patent.nextActionDue).toLocaleDateString()}</p>
          </div>
        )}
        <div>
          <p className="text-gray-500 text-xs uppercase font-bold mb-1">Est. Value</p>
          <p className="text-cyan-300 font-bold">${(patent.estimatedValue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-gray-400" />
          <span className="text-gray-300 text-sm font-semibold">{config.badge}</span>
        </div>
        <Link to={`/patent-review/${patent.id}`} className="text-cyan-400 hover:text-cyan-300 text-xs font-bold">
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default function PatentTracker() {
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const totalPortfolioValue = MOCK_PATENTS.reduce((sum, p) => sum + p.estimatedValue, 0);
  const grantedCount = MOCK_PATENTS.filter(p => p.status === "granted").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <div>
              <h1 className="text-white font-bold text-lg">Patent Tracker</h1>
              <p className="text-gray-500 text-xs">Real-time filing status, notifications & portfolio value</p>
            </div>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            <Bell size={16} />
            <span className="text-sm font-semibold">Notifications</span>
            {MOCK_PATENTS.some(p => p.notificationCount > 0) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Total Patents</p>
            <p className="text-3xl font-black text-cyan-400">{MOCK_PATENTS.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Granted</p>
            <p className="text-3xl font-black text-green-400">{grantedCount}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Portfolio Value</p>
            <p className="text-2xl font-black text-purple-400">${(totalPortfolioValue / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Active Actions</p>
            <p className="text-3xl font-black text-yellow-400">{MOCK_PATENTS.filter(p => p.nextActionDue).length}</p>
          </div>
        </div>

        {/* Notifications Panel */}
        {showNotifications && <PatentNotificationCenter patents={MOCK_PATENTS} />}

        {/* Portfolio Value Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-black text-xl mb-6 flex items-center gap-2">
            <TrendingUp size={20} /> Portfolio Value Over Time
          </h2>
          <PortfolioValueChart />
        </div>

        {/* Patents Grid */}
        <div>
          <h2 className="text-white font-black text-xl mb-6 flex items-center gap-2">
            <FileText size={20} /> Filed Patents
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MOCK_PATENTS.map(patent => (
              <div key={patent.id} onClick={() => setSelectedPatent(patent)} className="cursor-pointer">
                <PatentCard patent={patent} />
              </div>
            ))}
          </div>
        </div>

        {/* Patent Details Sidebar */}
        {selectedPatent && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">{selectedPatent.title}</h3>
              <button onClick={() => setSelectedPatent(null)} className="text-gray-500 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-gray-300">
                <span className="text-gray-500 font-bold">Patent ID:</span> {selectedPatent.id}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500 font-bold">Status:</span> {selectedPatent.status}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500 font-bold">Examiner:</span> {selectedPatent.examinerId}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500 font-bold">Estimated Value:</span> ${(selectedPatent.estimatedValue / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}