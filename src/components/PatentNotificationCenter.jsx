import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, InfoIcon, Calendar } from "lucide-react";

const NOTIFICATION_TYPES = {
  office_action: { icon: AlertTriangle, color: "bg-yellow-900/30 border-yellow-700", title: "Office Action" },
  grant: { icon: CheckCircle, color: "bg-green-900/30 border-green-700", title: "Patent Granted" },
  deadline: { icon: Calendar, color: "bg-red-900/30 border-red-700", title: "Action Deadline" },
  info: { icon: InfoIcon, color: "bg-blue-900/30 border-blue-700", title: "Information" },
};

export default function PatentNotificationCenter({ patents }) {
  const [readNotifications, setReadNotifications] = useState({});

  const notifications = [
    {
      id: "notif-1",
      patentId: "US1234567",
      type: "grant",
      date: "2025-06-20",
      message: "Your patent 'Motionless Electromagnetic Generator' has been granted!",
    },
    {
      id: "notif-2",
      patentId: "US7654321",
      type: "office_action",
      date: "2025-07-10",
      message: "Office action received. Please respond by 2025-08-15.",
    },
    {
      id: "notif-3",
      patentId: "US9876543",
      type: "deadline",
      date: "2025-07-05",
      message: "Response to Office Action due in 30 days.",
    },
  ];

  const toggleRead = (id) => {
    setReadNotifications(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
      <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
        <Bell size={20} /> Patent Office Correspondence
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map(notif => {
          const config = NOTIFICATION_TYPES[notif.type];
          const Icon = config.icon;
          const isRead = readNotifications[notif.id];
          const patent = patents.find(p => p.id === notif.patentId);

          return (
            <div key={notif.id} onClick={() => toggleRead(notif.id)} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${config.color} ${isRead ? "opacity-60" : ""}`}>
              <div className="flex items-start gap-3">
                <Icon size={18} className="flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-white text-sm">{config.title}</p>
                    <span className="text-gray-500 text-xs flex-shrink-0">{new Date(notif.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{notif.message}</p>
                  <p className="text-gray-500 text-xs font-mono">{patent?.title || notif.patentId}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-xs">{notifications.length} unresolved notifications</p>
      </div>
    </div>
  );
}