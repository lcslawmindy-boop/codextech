import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Mail, Send, Eye, MousePointer, FileSignature, Plus,
  ChevronDown, ChevronUp, RefreshCw, Check, Clock, AlertCircle, Loader2, Copy, ExternalLink
} from "lucide-react";

const STATUS_COLORS = {
  not_contacted: "bg-gray-800 text-gray-400 border-gray-700",
  email_sent:    "bg-blue-900/40 text-blue-300 border-blue-700",
  opened:        "bg-cyan-900/40 text-cyan-300 border-cyan-700",
  clicked:       "bg-yellow-900/40 text-yellow-300 border-yellow-700",
  nda_signed:    "bg-purple-900/40 text-purple-300 border-purple-700",
  responded:     "bg-green-900/40 text-green-300 border-green-700",
  passed:        "bg-red-900/20 text-red-500 border-red-800",
};

const STATUS_LABELS = {
  not_contacted: "Not Contacted",
  email_sent:    "Email Sent",
  opened:        "Opened ✉️",
  clicked:       "Clicked Link",
  nda_signed:    "NDA Signed ✅",
  responded:     "Responded",
  passed:        "Passed",
};

const DEFAULT_CONTACTS = [
  { id: "1", name: "IPOfferings.com", email: "info@ipofferings.com", org: "IP Broker", type: "broker", status: "not_contacted", notes: "" },
  { id: "2", name: "Dominion Harbor", email: "info@dominionharbor.com", org: "Patent Monetization", type: "broker", status: "not_contacted", notes: "" },
  { id: "3", name: "Ocean Tomo", email: "info@oceantomo.com", org: "IP Broker / M&A", type: "broker", status: "not_contacted", notes: "" },
  { id: "4", name: "Bryan Johnson", email: "", org: "OS Fund", type: "direct", status: "not_contacted", notes: "" },
  { id: "5", name: "Eric Weinstein", email: "", org: "Thiel Capital", type: "direct", status: "not_contacted", notes: "" },
  { id: "6", name: "Laura Deming", email: "", org: "Longevity Fund", type: "direct", status: "not_contacted", notes: "" },
];

const STORAGE_KEY = "acq_crm_contacts_v2";
const TRACKING_KEY = "acq_crm_tracking_v2";

function loadContacts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_CONTACTS; } catch { return DEFAULT_CONTACTS; }
}
function saveContacts(contacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}
function loadTracking() {
  try { return JSON.parse(localStorage.getItem(TRACKING_KEY)) || {}; } catch { return {}; }
}
function saveTracking(t) {
  localStorage.setItem(TRACKING_KEY, JSON.stringify(t));
}

function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[status] || STATUS_COLORS.not_contacted}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function TrackingRow({ label, icon, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color }} className="flex-shrink-0">{icon}</span>
      <span className="text-gray-500 text-xs">{label}:</span>
      <span className="text-gray-200 text-xs font-bold">{value}</span>
    </div>
  );
}

function ContactRow({ contact, tracking, onUpdate, onSendEmail, sending }) {
  const [expanded, setExpanded] = useState(false);
  const [editEmail, setEditEmail] = useState(contact.email);
  const [editNote, setEditNote] = useState(contact.notes || "");
  const t = tracking[contact.id] || {};

  const handleSave = () => {
    onUpdate(contact.id, { email: editEmail, notes: editNote });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-black text-cyan-400 flex-shrink-0">
          {contact.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-bold text-sm">{contact.name}</p>
            <span className="text-gray-600 text-xs">· {contact.org}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <StatusBadge status={contact.status} />
            {t.opens > 0 && <span className="text-xs text-cyan-400 flex items-center gap-1"><Eye size={9} /> {t.opens}</span>}
            {t.clicks > 0 && <span className="text-xs text-yellow-400 flex items-center gap-1"><MousePointer size={9} /> {t.clicks}</span>}
            {t.nda_signed && <span className="text-xs text-purple-400 flex items-center gap-1"><FileSignature size={9} /> NDA</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {contact.email && contact.status === "not_contacted" && (
            <button
              onClick={e => { e.stopPropagation(); onSendEmail(contact); }}
              disabled={sending === contact.id}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              {sending === contact.id ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
              Send
            </button>
          )}
          {expanded ? <ChevronUp size={13} className="text-gray-600" /> : <ChevronDown size={13} className="text-gray-600" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-800 space-y-3">
          {/* Tracking stats */}
          {(t.sent_at || t.opens > 0 || t.clicks > 0) && (
            <div className="bg-gray-800/60 rounded-xl p-3 space-y-1.5">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Tracking</p>
              {t.sent_at && <TrackingRow label="Sent" icon={<Mail size={10} />} value={new Date(t.sent_at).toLocaleDateString()} color="#60a5fa" />}
              <TrackingRow label="Opens" icon={<Eye size={10} />} value={t.opens || 0} color="#22d3ee" />
              <TrackingRow label="Link Clicks" icon={<MousePointer size={10} />} value={t.clicks || 0} color="#fbbf24" />
              <TrackingRow label="NDA Signed" icon={<FileSignature size={10} />} value={t.nda_signed ? "Yes ✅" : "No"} color="#a78bfa" />
              {t.last_activity && <TrackingRow label="Last Activity" icon={<Clock size={10} />} value={new Date(t.last_activity).toLocaleDateString()} color="#4ade80" />}
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">Email Address</label>
            <input value={editEmail} onChange={e => setEditEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-cyan-600 placeholder-gray-600" />
          </div>

          {/* Notes */}
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">Notes</label>
            <textarea value={editNote} onChange={e => setEditNote(e.target.value)}
              placeholder="e.g. Spoke with their BD team, follow up Friday..."
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-cyan-600 placeholder-gray-600 resize-none" />
          </div>

          {/* Status update */}
          <div>
            <p className="text-gray-500 text-xs font-bold mb-1.5">Update Status:</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => onUpdate(contact.id, { status: key })}
                  className={`text-xs px-2 py-1 rounded-full border font-semibold transition-all ${
                    contact.status === key ? STATUS_COLORS[key] : "border-gray-700 text-gray-600 hover:border-gray-500"
                  }`}>{label}</button>
              ))}
            </div>
          </div>

          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-bold transition-all">
            <Check size={10} /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

function AddContactModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", org: "", type: "broker", notes: "" });
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-full max-w-md">
        <p className="text-white font-black text-sm mb-4">Add Contact to CRM</p>
        <div className="space-y-3">
          {[
            { key: "name", placeholder: "Contact name", label: "Name *" },
            { key: "email", placeholder: "email@example.com", label: "Email" },
            { key: "org", placeholder: "Organization / firm", label: "Organization" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-gray-500 text-xs font-bold block mb-1">{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-cyan-600 placeholder-gray-600" />
            </div>
          ))}
          <div>
            <label className="text-gray-500 text-xs font-bold block mb-1">Type</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none">
              <option value="broker">IP Broker</option>
              <option value="direct">Direct Buyer</option>
              <option value="vc">VC / Investor</option>
              <option value="platform">Marketplace</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-700 text-gray-400 text-xs font-bold hover:bg-gray-800 transition-all">Cancel</button>
          <button
            disabled={!form.name}
            onClick={() => { onAdd({ ...form, id: Date.now().toString(), status: "not_contacted" }); onClose(); }}
            className="flex-1 py-2 rounded-xl bg-cyan-800 hover:bg-cyan-700 text-white text-xs font-bold transition-all disabled:opacity-50">
            Add Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OutreachCRM({ outreachTemplate }) {
  const [contacts, setContacts] = useState(loadContacts);
  const [tracking, setTracking] = useState(loadTracking);
  const [sending, setSending] = useState(null);
  const [sendResult, setSendResult] = useState(null);
  const [trackedEmail, setTrackedEmail] = useState(null); // { contactId, body, nda_url, broker_url }
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const updateContact = (id, changes) => {
    setContacts(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...changes } : c);
      saveContacts(next);
      return next;
    });
  };

  const addContact = (contact) => {
    setContacts(prev => { const next = [...prev, contact]; saveContacts(next); return next; });
  };

  const deleteContact = (id) => {
    setContacts(prev => { const next = prev.filter(c => c.id !== id); saveContacts(next); return next; });
  };

  // Refresh tracking from EmailTracking entity
  const refreshTracking = async () => {
    setRefreshing(true);
    try {
      const records = await base44.entities.EmailTracking.list("-updated_date", 100);
      const newTracking = { ...tracking };

      records.forEach(r => {
        // We stored recipient_tag in description as "recipient_tag:XXX"
        const match = (r.description || "").match(/recipient_tag:(.+)/);
        const contactId = match ? match[1] : r.investor_id;
        if (!contactId) return;
        if (!newTracking[contactId]) newTracking[contactId] = {};
        newTracking[contactId].opens = r.open_count || 0;
        newTracking[contactId].clicks = r.total_clicks || 0;
        newTracking[contactId].last_activity = r.last_engagement || r.updated_date;
        if (r.status === "clicked" || r.open_count > 0) {
          // Auto-update contact status
          setContacts(prev => {
            const next = prev.map(c => {
              if (c.id !== contactId) return c;
              const autoStatus = r.total_clicks > 0 ? "clicked" : r.open_count > 0 ? "opened" : c.status;
              return { ...c, status: autoStatus };
            });
            saveContacts(next);
            return next;
          });
        }
      });

      // Check NDA signatures
      const ndas = await base44.entities.NDASignature.list("-created_date", 50);
      ndas.forEach(nda => {
        contacts.forEach(c => {
          if (nda.email && c.email && nda.email.toLowerCase() === c.email.toLowerCase()) {
            newTracking[c.id] = { ...(newTracking[c.id] || {}), nda_signed: true };
            setContacts(prev => {
              const next = prev.map(ct => ct.id === c.id ? { ...ct, status: "nda_signed" } : ct);
              saveContacts(next);
              return next;
            });
          }
        });
      });

      saveTracking(newTracking);
      setTracking(newTracking);
    } catch (e) {
      console.error("Refresh failed:", e);
    }
    setRefreshing(false);
  };

  const sendEmail = async (contact) => {
    if (!contact.email) {
      setSendResult({ id: contact.id, type: "error", msg: "No email address — add one first." });
      return;
    }
    setSending(contact.id);
    setSendResult(null);
    try {
      // Build personalized email with tracking pixel + tracked NDA link
      const body = outreachTemplate
        .replace(/\[Name\]/g, contact.name)
        .replace(/\[Your Name\]/g, "Founder, Aethon Apex IP");

      const res = await base44.functions.invoke("sendAcquisitionOutreach", {
        to: contact.email,
        subject: "IP Portfolio Acquisition Opportunity — Patent-Backed EM & Energy Tech (NDA Required)",
        email_body: body,
        recipient_name: contact.name,
        recipient_org: contact.org,
        recipient_tag: contact.id,
      });

      if (res.data?.success) {
        const newT = { ...tracking, [contact.id]: { ...(tracking[contact.id] || {}), sent_at: new Date().toISOString(), opens: 0, clicks: 0 } };
        saveTracking(newT);
        setTracking(newT);
        setTrackedEmail({
          contactId: contact.id,
          contactName: contact.name,
          contactEmail: contact.email,
          body: res.data.tracked_body,
          nda_url: res.data.tracked_nda_url,
          broker_url: res.data.tracked_broker_url,
          token: res.data.tracking_token,
        });
        setSendResult({ id: contact.id, type: "ready", msg: "Tracked email ready — copy & paste into Gmail/Outlook below." });
      } else {
        setSendResult({ id: contact.id, type: "error", msg: res.data?.error || "Preparation failed." });
      }
    } catch (e) {
      setSendResult({ id: contact.id, type: "error", msg: e.message });
    }
    setSending(null);
  };

  const filtered = filter === "all" ? contacts : contacts.filter(c => c.status === filter || c.type === filter);

  const stats = {
    total: contacts.length,
    sent: contacts.filter(c => c.status !== "not_contacted").length,
    opened: contacts.filter(c => ["opened", "clicked", "nda_signed", "responded"].includes(c.status)).length,
    nda: contacts.filter(c => c.status === "nda_signed").length,
  };

  return (
    <div className="space-y-4">
      {showAdd && <AddContactModal onAdd={addContact} onClose={() => setShowAdd(false)} />}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Contacts", value: stats.total, color: "text-gray-300", icon: <Mail size={12} /> },
          { label: "Outreach Sent", value: stats.sent, color: "text-blue-400", icon: <Send size={12} /> },
          { label: "Opened/Clicked", value: stats.opened, color: "text-cyan-400", icon: <Eye size={12} /> },
          { label: "NDA Signed", value: stats.nda, color: "text-purple-400", icon: <FileSignature size={12} /> },
        ].map((s, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <div className={`flex items-center justify-center gap-1 mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`font-black text-lg ${s.color}`}>{s.value}</p>
            <p className="text-gray-600 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 flex gap-1 flex-wrap">
          {["all", "not_contacted", "email_sent", "opened", "clicked", "nda_signed"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${
                filter === f ? "bg-cyan-900/40 border-cyan-700 text-cyan-300" : "border-gray-700 text-gray-600 hover:border-gray-500"
              }`}>
              {STATUS_LABELS[f] || "All"}
            </button>
          ))}
        </div>
        <button onClick={refreshTracking} disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-all disabled:opacity-50">
          {refreshing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Sync
        </button>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/40 border border-cyan-700 text-cyan-300 text-xs font-bold hover:bg-cyan-800/50 transition-all">
          <Plus size={11} /> Add Contact
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl px-4 py-2.5 flex items-start gap-2">
        <AlertCircle size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-300 text-xs leading-relaxed">
          Click <strong>Send</strong> to fire a tracked outreach email. The platform embeds a tracking pixel + tracked NDA link — opens and clicks auto-update status. Hit <strong>Sync</strong> to pull latest activity.
        </p>
      </div>

      {/* Contact list */}
      <div className="space-y-2">
        {filtered.length === 0 && <p className="text-gray-600 text-sm text-center py-8">No contacts match this filter.</p>}
        {filtered.map(c => (
          <div key={c.id} className="relative">
            <ContactRow
              contact={c}
              tracking={tracking}
              onUpdate={updateContact}
              onSendEmail={sendEmail}
              sending={sending}
            />
            {sendResult?.id === c.id && (
              <div className={`mt-1 mx-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                sendResult.type === "ready" ? "bg-cyan-950/40 border border-cyan-800/50 text-cyan-300"
                : sendResult.type === "success" ? "bg-green-950/40 border border-green-800/50 text-green-300"
                : "bg-red-950/40 border border-red-800/50 text-red-300"
              }`}>
                {sendResult.type === "ready" ? <Mail size={11} /> : sendResult.type === "success" ? <Check size={11} /> : <AlertCircle size={11} />}
                {sendResult.msg}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tracked email ready panel */}
      {trackedEmail && (
        <div className="bg-gray-900 border border-cyan-800/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-400 font-black text-sm">📨 Tracked Email Ready — {trackedEmail.contactName}</p>
              <p className="text-gray-500 text-xs mt-0.5">Copy the body below and paste into Gmail or Outlook. All links and the open pixel are already tracked.</p>
            </div>
            <button onClick={() => { updateContact(trackedEmail.contactId, { status: "email_sent" }); setTrackedEmail(null); }}
              className="text-xs px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-700 text-green-300 font-bold hover:bg-green-800/50 transition-all">
              Mark Sent ✓
            </button>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${trackedEmail.contactEmail}?subject=IP Portfolio Acquisition Opportunity — Patent-Backed EM %26 Energy Tech (NDA Required)`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all">
              <ExternalLink size={10} /> Open in Gmail / Outlook
            </a>
            <button onClick={() => { navigator.clipboard.writeText(`To: ${trackedEmail.contactEmail}\nSubject: IP Portfolio Acquisition Opportunity — Patent-Backed EM & Energy Tech (NDA Required)\n\n${trackedEmail.body}`); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-bold transition-all">
              <Copy size={10} /> Copy Full Email
            </button>
            <button onClick={() => { navigator.clipboard.writeText(trackedEmail.nda_url); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-700 text-purple-300 text-xs font-bold transition-all">
              <Copy size={10} /> Copy Tracked NDA Link
            </button>
          </div>

          {/* Email body preview */}
          <div>
            <p className="text-gray-500 text-xs font-bold mb-1.5 uppercase tracking-wider">Email Body (with tracking embedded)</p>
            <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-800/60 rounded-xl p-4 max-h-72 overflow-y-auto border border-gray-700">
              {trackedEmail.body}
            </pre>
          </div>

          <div className="bg-yellow-950/20 border border-yellow-900/40 rounded-xl px-4 py-2.5">
            <p className="text-yellow-300 text-xs leading-relaxed">
              ⚡ <strong>How tracking works:</strong> The NDA link and broker page link are replaced with tracked redirect URLs. When the recipient clicks either link, a click event is recorded. An invisible tracking pixel records when the email is opened. Hit <strong>Sync</strong> above to pull the latest activity into the CRM.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}