import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Upload, Folder, FileText, Lock, Unlock,
  Loader2, Plus, Trash2, Eye, Download, Check, X, Edit2,
  Users, Key, AlertTriangle, CheckCircle2, Clock, ChevronDown,
  ChevronUp, RefreshCw, File, Filter
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const FOLDERS = ["IP & Patents", "Financials", "Technical", "Legal", "Overview", "Other"];

const FOLDER_COLORS = {
  "IP & Patents":  { text: "text-amber-400",  bg: "bg-amber-950/30 border-amber-800/50",  icon: "🔐" },
  "Financials":    { text: "text-green-400",   bg: "bg-green-950/30 border-green-800/50",  icon: "💰" },
  "Technical":     { text: "text-purple-400",  bg: "bg-purple-950/30 border-purple-800/50", icon: "⚙️" },
  "Legal":         { text: "text-red-400",     bg: "bg-red-950/30 border-red-800/50",       icon: "⚖️" },
  "Overview":      { text: "text-blue-400",    bg: "bg-blue-950/30 border-blue-800/50",     icon: "📋" },
  "Other":         { text: "text-gray-400",    bg: "bg-gray-800 border-gray-700",           icon: "📁" },
};

function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── UPLOAD MODAL ──────────────────────────────────────────────────────────────
function UploadModal({ onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [folder, setFolder] = useState("Other");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (!name) setName(f.name.replace(/\.[^.]+$/, ""));
  };

  const handleUpload = async () => {
    if (!file || !name) return;
    setUploading(true);
    setProgress("Uploading file…");
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setProgress("Registering document…");
    await base44.functions.invoke("vdrDocuments", {
      action: "upload",
      name,
      description,
      folder,
      file_url,
      file_name: file.name,
      file_size_bytes: file.size,
      file_type: file.type,
    });
    setUploading(false);
    onUploaded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-black text-base flex items-center gap-2"><Upload size={14} className="text-yellow-400" /> Upload Document</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"><X size={13} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* File picker */}
          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              file ? "border-green-700 bg-green-950/20" : "border-gray-700 hover:border-gray-500 bg-gray-900/50"
            }`}>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange}
              accept=".pdf,.docx,.xlsx,.csv,.pptx,.txt,.png,.jpg,.jpeg,.zip" />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <File size={18} className="text-green-400" />
                <span className="text-green-300 font-semibold text-sm truncate max-w-xs">{file.name}</span>
                <span className="text-gray-500 text-xs flex-shrink-0">{formatBytes(file.size)}</span>
              </div>
            ) : (
              <>
                <Upload size={24} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm font-semibold">Click to select file</p>
                <p className="text-gray-700 text-xs mt-1">PDF, DOCX, XLSX, CSV, PPTX, ZIP</p>
              </>
            )}
          </div>

          <div>
            <label className="text-gray-500 text-xs mb-1 block">Document Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. IP Portfolio Overview Q2 2026"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600" />
          </div>

          <div>
            <label className="text-gray-500 text-xs mb-1 block">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description for buyers…"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600" />
          </div>

          <div>
            <label className="text-gray-500 text-xs mb-1 block">Folder</label>
            <select value={folder} onChange={e => setFolder(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600">
              {FOLDERS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          {progress && (
            <div className="flex items-center gap-2 text-yellow-400 text-xs">
              <Loader2 size={12} className="animate-spin" /> {progress}
            </div>
          )}

          <button onClick={handleUpload} disabled={!file || !name || uploading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300 font-black text-sm disabled:opacity-50 transition-all">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "Uploading…" : "Upload & Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ACCESS GRANT MODAL ────────────────────────────────────────────────────────
function GrantModal({ existing, onClose, onSaved }) {
  const [form, setForm] = useState({
    email: existing?.email || "",
    name: existing?.name || "",
    organization: existing?.organization || "",
    access_level: existing?.access_level || "view_only",
    folder_access: existing?.folder_access || [],
    nda_verified: existing?.nda_verified || false,
    expires_at: existing?.expires_at ? existing.expires_at.slice(0, 10) : "",
    notes: existing?.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleFolder = (folder) => {
    set("folder_access", form.folder_access.includes(folder)
      ? form.folder_access.filter(f => f !== folder)
      : [...form.folder_access, folder]);
  };

  const handleSave = async () => {
    if (!form.email) return;
    setSaving(true);
    await base44.functions.invoke("vdrDocuments", {
      action: existing ? "update_grant" : "grant_access",
      grant_id: existing?.id,
      ...form,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    });
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl my-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-black text-base flex items-center gap-2">
            <Key size={14} className="text-green-400" />
            {existing ? "Edit Access Grant" : "Grant VDR Access"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"><X size={13} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Email *", key: "email", ph: "buyer@firm.com", type: "email" },
              { label: "Full Name", key: "name", ph: "John Smith" },
              { label: "Organization", key: "organization", ph: "Acacia Research" },
            ].map(f => (
              <div key={f.key} className={f.key === "email" ? "sm:col-span-2" : ""}>
                <label className="text-gray-500 text-xs mb-1 block">{f.label}</label>
                <input type={f.type || "text"} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                  placeholder={f.ph}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-green-600 placeholder-gray-600" />
              </div>
            ))}
          </div>

          {/* Access Level */}
          <div>
            <label className="text-gray-500 text-xs mb-2 block font-semibold uppercase tracking-wider">Access Level</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: "view_only", icon: Eye, label: "View Only", desc: "Can read docs in browser. No downloads." },
                { val: "download", icon: Download, label: "View + Download", desc: "Can download files as well." },
              ].map(opt => (
                <button key={opt.val} onClick={() => set("access_level", opt.val)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.access_level === opt.val
                      ? "border-green-600 bg-green-950/30 text-green-300"
                      : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <opt.icon size={13} />
                    <span className="font-bold text-xs">{opt.label}</span>
                  </div>
                  <p className="text-xs opacity-70 leading-snug">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Folder Access */}
          <div>
            <label className="text-gray-500 text-xs mb-2 block font-semibold uppercase tracking-wider">
              Folder Access <span className="text-gray-600 normal-case">(leave all unchecked = full access)</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {FOLDERS.map(folder => {
                const fc = FOLDER_COLORS[folder];
                const checked = form.folder_access.includes(folder);
                return (
                  <button key={folder} onClick={() => toggleFolder(folder)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      checked ? `${fc.bg} ${fc.text}` : "border-gray-700 text-gray-600 hover:border-gray-600 hover:text-gray-400"
                    }`}>
                    <span>{fc.icon}</span>
                    <span className="truncate">{folder}</span>
                    {checked && <Check size={10} className="ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Expires On (optional)</label>
              <input type="date" value={form.expires_at} onChange={e => set("expires_at", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-green-600" />
            </div>
            <div className="flex flex-col justify-end">
              <button onClick={() => set("nda_verified", !form.nda_verified)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-semibold text-xs transition-all ${
                  form.nda_verified
                    ? "border-green-700 bg-green-950/30 text-green-400"
                    : "border-gray-700 text-gray-500 hover:border-gray-600"
                }`}>
                {form.nda_verified ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                NDA {form.nda_verified ? "Verified ✓" : "Not Verified"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-xs mb-1 block">Notes</label>
            <input value={form.notes} onChange={e => set("notes", e.target.value)}
              placeholder="e.g. Acacia Research — intro via Ocean Tomo"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-green-600 placeholder-gray-600" />
          </div>

          {!form.nda_verified && (
            <div className="flex items-start gap-2 bg-yellow-950/20 border border-yellow-800/40 rounded-xl p-3">
              <AlertTriangle size={13} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-700 text-xs leading-relaxed">Access will be inactive until NDA is marked as verified. The grantee will not be able to view any documents without NDA verification.</p>
            </div>
          )}

          <button onClick={handleSave} disabled={!form.email || saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-900/60 hover:bg-green-800/60 border border-green-700 text-green-300 font-black text-sm disabled:opacity-50 transition-all">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
            {saving ? "Saving…" : existing ? "Update Grant" : "Grant Access"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DOCUMENT CARD ─────────────────────────────────────────────────────────────
function DocCard({ doc, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const fc = FOLDER_COLORS[doc.folder] || FOLDER_COLORS.Other;

  const handleDelete = async () => {
    if (!confirm(`Delete "${doc.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await base44.functions.invoke("vdrDocuments", { action: "delete_doc", doc_id: doc.id });
    onDelete(doc.id);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-3 hover:border-gray-700 transition-all group">
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg flex-shrink-0 ${fc.bg}`}>
        {fc.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-snug truncate">{doc.name}</p>
        {doc.description && <p className="text-gray-500 text-xs mt-0.5 truncate">{doc.description}</p>}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-lg border font-semibold ${fc.bg} ${fc.text}`}>{doc.folder}</span>
          <span className="text-gray-600 text-xs">{formatBytes(doc.file_size_bytes)}</span>
          <span className="text-gray-700 text-xs">{doc.file_name}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-700">
          <span className="flex items-center gap-1"><Eye size={9} /> {doc.view_count || 0} views</span>
          <span className="flex items-center gap-1"><Download size={9} /> {doc.download_count || 0} downloads</span>
          <span>Uploaded {formatDate(doc.created_date)}</span>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all">
          <Eye size={12} />
        </a>
        <button onClick={handleDelete} disabled={deleting}
          className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-900/50 text-gray-500 hover:text-red-400 transition-all">
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        </button>
      </div>
    </div>
  );
}

// ── ACCESS GRANT ROW ──────────────────────────────────────────────────────────
function GrantRow({ grant, onEdit, onRevoke }) {
  const isExpired = grant.expires_at && new Date(grant.expires_at) < new Date();
  const statusColor = !grant.is_active ? "text-gray-600"
    : isExpired ? "text-red-500"
    : !grant.nda_verified ? "text-yellow-500"
    : "text-green-400";
  const statusLabel = !grant.is_active ? "Revoked"
    : isExpired ? "Expired"
    : !grant.nda_verified ? "Awaiting NDA"
    : "Active";

  return (
    <div className={`bg-gray-900 border rounded-xl p-4 flex items-center gap-3 transition-all ${
      grant.is_active && !isExpired ? "border-gray-800 hover:border-gray-700" : "border-gray-800 opacity-60"
    }`}>
      <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-black text-gray-400 flex-shrink-0">
        {(grant.name || grant.email)[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-white font-semibold text-sm">{grant.name || grant.email}</p>
          <span className={`text-xs font-bold flex items-center gap-1 ${statusColor}`}>
            {statusLabel === "Active" ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
            {statusLabel}
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-0.5">{grant.email}{grant.organization ? ` · ${grant.organization}` : ""}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs">
          <span className={`flex items-center gap-1 font-semibold ${
            grant.access_level === "download" ? "text-blue-400" : "text-purple-400"
          }`}>
            {grant.access_level === "download" ? <Download size={9} /> : <Eye size={9} />}
            {grant.access_level === "download" ? "View + Download" : "View Only"}
          </span>
          {grant.folder_access?.length > 0
            ? <span className="text-gray-600">{grant.folder_access.length} folder{grant.folder_access.length !== 1 ? "s" : ""}</span>
            : <span className="text-gray-600">All folders</span>}
          {grant.expires_at && <span className={`flex items-center gap-1 ${isExpired ? "text-red-600" : "text-gray-600"}`}><Clock size={9} /> {isExpired ? "Expired" : "Expires"} {formatDate(grant.expires_at)}</span>}
          <span className="text-gray-700">{grant.access_count || 0} accesses</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button onClick={() => onEdit(grant)}
          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all">
          <Edit2 size={12} />
        </button>
        {grant.is_active && (
          <button onClick={() => onRevoke(grant.id)}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-900/50 text-gray-500 hover:text-red-400 transition-all">
            <Lock size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function VirtualDataRoom() {
  const [docs, setDocs] = useState([]);
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("documents");
  const [folderFilter, setFolderFilter] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [showGrant, setShowGrant] = useState(false);
  const [editingGrant, setEditingGrant] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await base44.functions.invoke("vdrDocuments", { action: "list_all" });
    setDocs(res.data?.docs || []);
    setGrants(res.data?.grants || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRevokeGrant = async (id) => {
    if (!confirm("Revoke this access grant?")) return;
    await base44.functions.invoke("vdrDocuments", { action: "revoke_access", grant_id: id });
    setGrants(prev => prev.map(g => g.id === id ? { ...g, is_active: false } : g));
  };

  const handleDeleteDoc = (id) => setDocs(prev => prev.filter(d => d.id !== id));

  const filteredDocs = folderFilter === "All" ? docs : docs.filter(d => d.folder === folderFilter);

  const activeGrants = grants.filter(g => g.is_active && !(g.expires_at && new Date(g.expires_at) < new Date()));
  const ndaVerifiedCount = activeGrants.filter(g => g.nda_verified).length;
  const downloadCount = activeGrants.filter(g => g.access_level === "download").length;

  // Stats per folder
  const folderStats = {};
  FOLDERS.forEach(f => { folderStats[f] = docs.filter(d => d.folder === f && d.is_active).length; });

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
          <Link to="/vdr-admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> VDR Sessions
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Shield size={14} className="text-yellow-400" /> Virtual Data Room
            </h1>
            <p className="text-gray-500 text-xs">{docs.length} documents · {activeGrants.length} active grants · NDA-gated access</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all"><RefreshCw size={13} /></button>
          <button onClick={() => setShowGrant(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-900/60 hover:bg-green-800/60 border border-green-700 text-green-300 text-xs font-black transition-all">
            <Key size={12} /> Grant Access
          </button>
          <button onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300 text-xs font-black transition-all">
            <Upload size={12} /> Upload Doc
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 pt-5">
        {[
          { label: "Total Documents", value: docs.filter(d => d.is_active).length, icon: FileText, color: "text-yellow-400" },
          { label: "Active Grants", value: activeGrants.length, icon: Users, color: "text-green-400" },
          { label: "NDA Verified", value: ndaVerifiedCount, icon: CheckCircle2, color: "text-blue-400" },
          { label: "Download Access", value: downloadCount, icon: Download, color: "text-purple-400" },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <s.icon size={16} className={s.color} />
            <div>
              <p className="text-white font-black text-xl">{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 pt-5 border-b border-gray-800">
        {[
          { id: "documents", label: `Documents (${docs.filter(d => d.is_active).length})`, icon: Folder },
          { id: "access", label: `Access Grants (${grants.length})`, icon: Key },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              tab === t.id ? "border-yellow-500 text-yellow-300" : "border-transparent text-gray-500 hover:text-gray-300"
            }`}>
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {/* DOCUMENTS TAB */}
      {tab === "documents" && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Folder sidebar */}
          <div className="w-full md:w-52 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-800 p-4 space-y-1">
            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-3 px-1">Folders</p>
            <button onClick={() => setFolderFilter("All")}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                folderFilter === "All" ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
              }`}>
              <span className="flex items-center gap-2">📁 All Folders</span>
              <span className="text-xs text-gray-600">{docs.filter(d => d.is_active).length}</span>
            </button>
            {FOLDERS.map(folder => {
              const fc = FOLDER_COLORS[folder];
              const count = folderStats[folder];
              return (
                <button key={folder} onClick={() => setFolderFilter(folder)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    folderFilter === folder ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}>
                  <span className="flex items-center gap-2">{fc.icon} <span className="truncate">{folder}</span></span>
                  {count > 0 && <span className={`text-xs font-bold ${fc.text}`}>{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Document list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            {filteredDocs.filter(d => d.is_active).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Upload size={40} className="text-gray-800 mb-4" />
                <p className="text-gray-600 font-semibold text-sm mb-1">No documents in this folder</p>
                <p className="text-gray-700 text-xs mb-4">Upload your first document to get started.</p>
                <button onClick={() => setShowUpload(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-sm font-bold hover:bg-yellow-800/40 transition-all">
                  <Upload size={13} /> Upload Document
                </button>
              </div>
            ) : (
              filteredDocs.filter(d => d.is_active).map(doc => (
                <DocCard key={doc.id} doc={doc} onDelete={handleDeleteDoc} />
              ))
            )}
          </div>
        </div>
      )}

      {/* ACCESS GRANTS TAB */}
      {tab === "access" && (
        <div className="flex-1 overflow-y-auto p-5 max-w-4xl mx-auto w-full space-y-3">
          {/* Legend */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-green-400" /> Active + NDA verified = can access</span>
            <span className="flex items-center gap-1.5"><AlertTriangle size={11} className="text-yellow-500" /> NDA not verified = blocked</span>
            <span className="flex items-center gap-1.5"><Eye size={11} className="text-purple-400" /> View Only = in-browser only</span>
            <span className="flex items-center gap-1.5"><Download size={11} className="text-blue-400" /> View + Download = can download files</span>
          </div>

          {grants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Users size={40} className="text-gray-800 mb-4" />
              <p className="text-gray-600 font-semibold text-sm mb-1">No access grants yet</p>
              <p className="text-gray-700 text-xs mb-4">Grant access to an NDA-verified buyer to allow them to view documents.</p>
              <button onClick={() => setShowGrant(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900/40 border border-green-700 text-green-300 text-sm font-bold hover:bg-green-800/40 transition-all">
                <Key size={13} /> Grant First Access
              </button>
            </div>
          ) : (
            grants.map(g => (
              <GrantRow key={g.id} grant={g}
                onEdit={(grant) => { setEditingGrant(grant); setShowGrant(true); }}
                onRevoke={handleRevokeGrant} />
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUploaded={load} />
      )}
      {showGrant && (
        <GrantModal
          existing={editingGrant}
          onClose={() => { setShowGrant(false); setEditingGrant(null); }}
          onSaved={load}
        />
      )}
    </div>
  );
}