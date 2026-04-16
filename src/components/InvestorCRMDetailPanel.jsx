import { useState } from "react";
import { X, MessageSquare, Calendar, Phone, Mail, Plus, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import EmailTrackingStatus from "./EmailTrackingStatus";

export default function InvestorCRMDetailPanel({ investor, onClose, onUpdate }) {
  const [showAddComm, setShowAddComm] = useState(false);
  const [commType, setCommType] = useState("email");
  const [commContent, setCommContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [scheduleMeeting, setScheduleMeeting] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("14:00");

  const handleAddCommunication = async () => {
    if (!commContent.trim()) return;

    setSaving(true);
    try {
      const newComm = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: commType,
        content: commContent,
        response: null
      };

      const updatedComms = [...(investor.communications || []), newComm];
      
      await base44.entities.InvestorOutreach.update(investor.id, {
        communications: updatedComms,
        last_contact: new Date().toISOString()
      });

      setCommContent("");
      setCommType("email");
      setShowAddComm(false);
      onUpdate && onUpdate();
    } catch (err) {
      console.error('Error adding communication:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleMeeting = async () => {
    if (!meetingDate || !meetingTime) return;

    try {
      const url = await base44.connectors.connectAppUser("googlecalendar_investor");
      if (url) window.open(url, "_blank");
      
      // Also log this as a communication
      const newComm = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: "meeting",
        content: `Meeting scheduled for ${meetingDate} at ${meetingTime}`,
        response: null
      };

      const updatedComms = [...(investor.communications || []), newComm];
      
      await base44.entities.InvestorOutreach.update(investor.id, {
        communications: updatedComms,
        next_action: `Meeting scheduled`,
        next_action_date: meetingDate
      });

      setScheduleMeeting(false);
      onUpdate && onUpdate();
    } catch (err) {
      console.error('Error scheduling meeting:', err);
    }
  };

  if (!investor) return null;

  const commTypeIcons = {
    email: <Mail size={14} />,
    call: <Phone size={14} />,
    meeting: <Calendar size={14} />,
    other: <MessageSquare size={14} />
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 border-l border-gray-800 shadow-2xl z-30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <div>
          <h3 className="text-white font-bold text-sm">{investor.investor_name}</h3>
          <p className="text-gray-500 text-xs">{investor.investor_org}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4 p-5">
        {/* Quick Stats */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-xs">Stage</p>
            <p className="text-white font-bold text-xs uppercase">{investor.stage?.replace(/_/g, " ")}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-xs">Last Contact</p>
            <p className="text-white font-bold text-xs">
              {investor.last_contact ? new Date(investor.last_contact).toLocaleDateString() : "Never"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-xs">Target Investment</p>
            <p className="text-white font-bold text-xs">${investor.target_investment?.toLocaleString() || "—"}</p>
          </div>
        </div>

        {/* Communication History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Communication History</p>
            <button
              onClick={() => setShowAddComm(!showAddComm)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-900/30 hover:bg-blue-800/40 text-blue-400 text-xs font-bold transition-all">
              <Plus size={12} /> Add
            </button>
          </div>

          {/* Add Communication Form */}
          {showAddComm && (
            <div className="bg-blue-950/20 border border-blue-800/50 rounded-lg p-3 mb-3 space-y-2">
              <select
                value={commType}
                onChange={e => setCommType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs"
              >
                <option value="email">Email</option>
                <option value="call">Phone Call</option>
                <option value="meeting">In-Person Meeting</option>
                <option value="other">Other</option>
              </select>
              <textarea
                value={commContent}
                onChange={e => setCommContent(e.target.value)}
                placeholder="Log communication details..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs resize-none"
              />
              <button
                onClick={handleAddCommunication}
                disabled={saving}
                className="w-full py-1 rounded bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold transition-all">
                {saving ? <Loader2 size={12} className="inline animate-spin mr-1" /> : "Save"}
              </button>
            </div>
          )}

          {/* Communications List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {investor.communications && investor.communications.length > 0 ? (
              investor.communications.map((comm, idx) => (
                <div key={comm.id || idx} className="bg-gray-800/30 border border-gray-700 rounded-lg p-2">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 mt-0.5">{commTypeIcons[comm.type] || commTypeIcons.other}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs">{new Date(comm.date).toLocaleDateString()} · {comm.type}</p>
                      <p className="text-gray-300 text-xs leading-relaxed mt-1">{comm.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-xs italic">No communications logged yet.</p>
            )}
          </div>
        </div>

        {/* Schedule Meeting */}
        <div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Schedule Meeting</p>
          {!scheduleMeeting ? (
            <button
              onClick={() => setScheduleMeeting(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-green-900/30 hover:bg-green-800/40 border border-green-800/50 text-green-400 text-xs font-bold transition-all">
              <Calendar size={12} /> Add to Calendar
            </button>
          ) : (
            <div className="bg-green-950/20 border border-green-800/50 rounded-lg p-3 space-y-2">
              <input
                type="date"
                value={meetingDate}
                onChange={e => setMeetingDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs"
              />
              <input
                type="time"
                value={meetingTime}
                onChange={e => setMeetingTime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs"
              />
              <button
                onClick={handleScheduleMeeting}
                className="w-full py-1 rounded bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-all">
                Confirm & Sync to Calendar
              </button>
              <button
                onClick={() => setScheduleMeeting(false)}
                className="w-full py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-all">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Email Tracking Status */}
        <EmailTrackingStatus 
          investorId={investor.id}
          onEngagement={(tracking) => {
            console.log('Investor engaged with email:', tracking);
            // Toast notification would go here
          }}
        />

        {/* Notes */}
        {investor.notes && (
          <div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Notes</p>
            <p className="bg-gray-800/30 border border-gray-700 rounded-lg p-2 text-gray-300 text-xs leading-relaxed">
              {investor.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}