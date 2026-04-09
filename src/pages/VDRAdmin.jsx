import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Plus, Eye, Clock, User, Mail, Building2,
  CheckCircle, XCircle, AlertTriangle, Loader2, Trash2, Copy,
  BarChart3, Activity, Lock, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  active:  { color: 'text-green-400',  bg: 'bg-green-950/40 border-green-800',  icon: CheckCircle,   label: 'Active' },
  expired: { color: 'text-gray-500',   bg: 'bg-gray-800 border-gray-700',       icon: Clock,         label: 'Expired' },
  revoked: { color: 'text-red-400',    bg: 'bg-red-950/40 border-red-800',      icon: XCircle,       label: 'Revoked' },
};

const fmt_time = (seconds) => {
  if (!seconds || seconds === 0) return '—';
  const m = Math.floor(seconds / 60);
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return m > 0 ? `${m}m ${Math.floor(seconds % 60)}s` : `${Math.floor(seconds)}s`;
};

function SessionCard({ session, onRevoke, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [copying, setCopying] = useState(false);
  const cfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.expired;
  const Icon = cfg.icon;
  const views = session.page_views || [];
  const isActive = session.status === 'active' && new Date(session.expires_at) > new Date();
  const timeRemaining = isActive ? Math.max(0, new Date(session.expires_at) - new Date()) : 0;
  const hoursLeft = Math.floor(timeRemaining / 3600000);
  const minsLeft = Math.floor((timeRemaining % 3600000) / 60000);

  const vdrLink = `${window.location.origin}/vdr/${session.token}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(vdrLink);
    setCopying(true);
    setTimeout(() => setCopying(false), 1500);
  };

  // Page view frequency map
  const pageFreq = views.reduce((acc, v) => {
    acc[v.page] = (acc[v.page] || 0) + 1;
    return acc;
  }, {});
  const topPages = Object.entries(pageFreq).sort((a, b) => b[1] - a[1]);

  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden ${isActive ? 'border-green-900/50' : 'border-gray-800'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-white font-black text-sm">{session.buyer_name}</h3>
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg border font-bold ${cfg.bg} ${cfg.color}`}>
                <Icon size={9} /> {cfg.label}
              </span>
              {isActive && (
                <span className="text-xs text-amber-400 font-bold">
                  {hoursLeft}h {minsLeft}m left
                </span>
              )}
            </div>
            <p className="text-gray-500 text-xs">{session.buyer_email} · {session.buyer_org}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isActive && (
              <>
                <button onClick={copyLink}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-all">
                  <Copy size={10} /> {copying ? 'Copied!' : 'Copy Link'}
                </button>
                <a href={vdrLink} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
                  <ExternalLink size={12} />
                </a>
              </>
            )}
            <button onClick={() => setExpanded(e => !e)}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-800">
          <div className="flex items-center gap-1.5">
            <Eye size={11} className="text-blue-500" />
            <span className="text-white font-bold text-xs">{views.length}</span>
            <span className="text-gray-600 text-xs">views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={11} className="text-purple-500" />
            <span className="text-white font-bold text-xs">{session.access_count || 0}</span>
            <span className="text-gray-600 text-xs">sessions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-amber-500" />
            <span className="text-white font-bold text-xs">{fmt_time(session.total_time_seconds)}</span>
            <span className="text-gray-600 text-xs">total time</span>
          </div>
          <div className="ml-auto text-gray-700 text-xs">
            NDA: {new Date(session.nda_signed_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-800 p-4 space-y-4">
          {/* Page view analytics */}
          <div>
            <p className="text-gray-500 text-xs font-bold mb-2">DOCUMENT ENGAGEMENT</p>
            {topPages.length === 0 ? (
              <p className="text-gray-700 text-xs">No pages viewed yet.</p>
            ) : (
              <div className="space-y-2">
                {topPages.map(([page, count]) => {
                  const totalTime = views.filter(v => v.page === page).reduce((s, v) => s + (v.duration_seconds || 0), 0);
                  const maxCount = topPages[0][1];
                  return (
                    <div key={page}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-xs truncate flex-1">{page}</span>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                          <span className="text-blue-400 text-xs font-bold">{count}×</span>
                          <span className="text-amber-400 text-xs">{fmt_time(totalTime)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-700 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Raw view log */}
          {views.length > 0 && (
            <div>
              <p className="text-gray-500 text-xs font-bold mb-2">ACCESS LOG</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {views.slice().reverse().map((v, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-gray-600 py-1 border-b border-gray-800/50">
                    <span className="text-gray-500 flex-shrink-0">{new Date(v.viewed_at).toLocaleTimeString()}</span>
                    <span className="flex-1 text-gray-400 truncate">{v.page}</span>
                    <span className="text-amber-600 flex-shrink-0">{fmt_time(v.duration_seconds)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {session.status === 'active' && (
              <button onClick={() => onRevoke(session.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 border border-red-900 text-red-400 text-xs font-bold transition-all">
                <Lock size={11} /> Revoke Access
              </button>
            )}
            <button onClick={() => onDelete(session.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-500 text-xs font-bold transition-all">
              <Trash2 size={11} /> Delete Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GENERATE SESSION MODAL ────────────────────────────────────────────────────
function GenerateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ buyer_name: '', buyer_email: '', buyer_org: '', duration_hours: 72 });
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.buyer_name || !form.buyer_email) return;
    setCreating(true);
    const res = await base44.functions.invoke('createVDRSession', form);
    setResult(res.data);
    setCreating(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-white font-black text-base">Generate VDR Access Link</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-gray-800 text-gray-400"><XCircle size={13} /></button>
        </div>
        <div className="p-5 space-y-3">
          {!result ? (
            <>
              {[
                { label: 'Buyer Name *', key: 'buyer_name', ph: 'e.g. John Smith' },
                { label: 'Buyer Email *', key: 'buyer_email', ph: 'investor@firm.com' },
                { label: 'Organization', key: 'buyer_org', ph: 'e.g. Clarivate Analytics' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-gray-500 text-xs mb-1 block">{f.label}</label>
                  <input value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.ph}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600" />
                </div>
              ))}
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Access Duration</label>
                <select value={form.duration_hours} onChange={e => set('duration_hours', Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600">
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                  <option value={72}>72 hours (standard)</option>
                  <option value={168}>7 days</option>
                </select>
              </div>
              <div className="bg-yellow-950/20 border border-yellow-900/40 rounded-xl p-3 text-xs text-yellow-700 leading-relaxed">
                A cryptographically signed link will be generated and emailed to the buyer automatically with access instructions and NDA reminder.
              </div>
              <button onClick={handleCreate} disabled={creating || !form.buyer_name || !form.buyer_email}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-sm disabled:opacity-60 transition-all">
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                {creating ? 'Generating & Sending…' : 'Generate & Email Access Link'}
              </button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle size={36} className="text-green-500 mx-auto" />
              <div>
                <p className="text-white font-black mb-1">Access Link Generated</p>
                <p className="text-gray-400 text-sm">Email sent to {form.buyer_email}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-left">
                <p className="text-gray-500 text-xs mb-1">Access Link (also emailed):</p>
                <p className="text-yellow-400 font-mono text-xs break-all">{result.vdr_link}</p>
                <p className="text-gray-600 text-xs mt-2">Expires: {new Date(result.expires_at).toLocaleString()}</p>
              </div>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm transition-all">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function VDRAdmin() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadSessions(); }, []);

  const loadSessions = async () => {
    setLoading(true);
    const data = await base44.entities.VDRSession.list('-created_date', 200);
    setSessions(data);
    setLoading(false);
  };

  const handleRevoke = async (id) => {
    await base44.functions.invoke('vdrAccess', { token: sessions.find(s => s.id === id)?.token, action: 'revoke', duration_seconds: 'Revoked by admin' });
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'revoked' } : s));
  };

  const handleDelete = async (id) => {
    await base44.entities.VDRSession.delete(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const filtered = sessions.filter(s => filter === 'all' ? true : s.status === filter);

  // Aggregate analytics
  const totalViews = sessions.reduce((s, x) => s + (x.page_views || []).length, 0);
  const totalTime = sessions.reduce((s, x) => s + (x.total_time_seconds || 0), 0);
  const activeSessions = sessions.filter(s => s.status === 'active' && new Date(s.expires_at) > new Date()).length;

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={28} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/acquisition-crm" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> CRM
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base tracking-tight">Virtual Data Room — Admin</h1>
            <p className="text-gray-500 text-xs">Manage NDA sessions · Track buyer engagement</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300 text-xs font-black transition-all">
          <Plus size={13} /> Generate VDR Link
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5 px-5 py-3 border-b border-gray-800/60 overflow-x-auto">
        {[
          { label: 'Total Sessions', value: sessions.length, color: 'text-white' },
          { label: 'Active Now', value: activeSessions, color: 'text-green-400' },
          { label: 'Total Page Views', value: totalViews, color: 'text-blue-400' },
          { label: 'Total Read Time', value: totalTime >= 3600 ? `${Math.floor(totalTime/3600)}h ${Math.floor((totalTime%3600)/60)}m` : `${Math.floor(totalTime/60)}m`, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="flex-shrink-0">
            <p className={`font-black text-base ${s.color}`}>{s.value}</p>
            <p className="text-gray-600 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-5 py-3 border-b border-gray-800">
        {[['all','All'], ['active','Active'], ['expired','Expired'], ['revoked','Revoked']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === val ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-400'}`}>
            {label} ({val === 'all' ? sessions.length : sessions.filter(s => s.status === val).length})
          </button>
        ))}
      </div>

      {/* Session list */}
      <div className="flex-1 p-5 space-y-3 max-w-4xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Shield size={40} className="text-gray-800 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">No sessions yet. Generate a VDR link for a buyer after NDA execution.</p>
          </div>
        ) : (
          filtered.map(session => (
            <SessionCard key={session.id} session={session} onRevoke={handleRevoke} onDelete={handleDelete} />
          ))
        )}
      </div>

      {showModal && (
        <GenerateModal onClose={() => setShowModal(false)} onCreated={loadSessions} />
      )}
    </div>
  );
}