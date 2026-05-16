import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Plus, Trash2, Check, X, Search, RefreshCw, FileText, Send, ExternalLink, Package, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { BRIEF_PACKS } from "../lib/briefPackData";

// Brief pack PDF definitions — update download_url fields with real hosted PDF links
const BRIEF_PACK_DOCS = [
  { id: "meg-architecture", title: "MEG System Architecture", pages: 40, file: "meg-system-architecture.pdf" },
  { id: "scalar-transmitter", title: "Scalar Transmitter Design", pages: 35, file: "scalar-transmitter-design.pdf" },
  { id: "measurement-protocols", title: "Measurement Protocol Suite", pages: 25, file: "measurement-protocols.pdf" },
  { id: "anenergy-pump", title: "Anenergy Pump Preliminary", pages: 15, file: "anenergy-pump-preliminary.pdf" },
];

// ── Admin Master Bundle — individual URL per pack + bundle URL ──────────────────
function AdminMasterBundleAccess() {
  const [open, setOpen] = useState(false);
  const [urls, setUrls] = useState(() => {
    try { return JSON.parse(localStorage.getItem("admin_pdf_urls") || "{}"); } catch { return {}; }
  });
  const [savedId, setSavedId] = useState(null);

  const saveUrl = (id, val) => {
    const next = { ...urls, [id]: val };
    setUrls(next);
    localStorage.setItem("admin_pdf_urls", JSON.stringify(next));
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  };

  const bundleUrl = urls["__bundle__"] || "";
  const filledCount = Object.values(urls).filter(v => v && v !== urls["__bundle__"]).length;

  return (
    <div className="bg-gray-900 border-2 border-green-700/60 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-green-950/20 hover:bg-green-950/40 transition-colors text-left">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔓</span>
          <div>
            <p className="text-white font-black text-base">Admin PDF Library — All 33 Brief Packs (No Charge)</p>
            <p className="text-green-300/70 text-xs mt-0.5">Set individual download URLs per PDF · {filledCount}/33 URLs configured</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs px-3 py-1 rounded-full bg-green-900/50 border border-green-700 text-green-300 font-black">{filledCount}/33 ready</span>
          {open ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
        </div>
      </button>

      {open && (
        <div className="p-5 space-y-4">
          {/* Master folder URL */}
          <div className="bg-yellow-950/20 border border-yellow-700/40 rounded-xl p-4">
            <label className="block text-xs font-black text-yellow-400 mb-2 uppercase tracking-wider">
              📦 Master Bundle URL — All 33 in one folder/zip
            </label>
            <div className="flex gap-2">
              <input type="url" placeholder="https://drive.google.com/drive/folders/..."
                value={bundleUrl}
                onChange={e => setUrls(u => ({ ...u, "__bundle__": e.target.value }))}
                onBlur={e => saveUrl("__bundle__", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-yellow-700/50 text-white text-sm focus:outline-none focus:border-yellow-500" />
              {bundleUrl && (
                <a href={bundleUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-black transition-all">
                  <Download size={13} /> Open All
                </a>
              )}
            </div>
          </div>

          {/* Individual PDFs */}
          <div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-3">Individual PDF Download URLs — paste Google Drive / Dropbox / S3 link per pack</p>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {BRIEF_PACKS.map((pack, i) => {
                const url = urls[pack.id] || "";
                return (
                  <div key={pack.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800/60 border border-gray-700/40 hover:border-gray-600/60 transition-colors">
                    <span className="text-gray-600 text-xs font-mono w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-base flex-shrink-0">{pack.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-xs font-bold truncate">{pack.title}</p>
                      <p className="text-gray-600 text-xs">{pack.category} · {pack.pages}p</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 w-64">
                      <input type="url" placeholder="Paste PDF URL..."
                        value={url}
                        onChange={e => setUrls(u => ({ ...u, [pack.id]: e.target.value }))}
                        onBlur={e => { if (e.target.value !== (urls[pack.id] || "")) saveUrl(pack.id, e.target.value); else saveUrl(pack.id, url); }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-green-500 min-w-0" />
                      {savedId === pack.id && <Check size={12} className="text-green-400 flex-shrink-0" />}
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-green-800/60 hover:bg-green-700 text-green-300 text-xs font-bold transition-all flex-shrink-0">
                          <Download size={11} /> Open
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-gray-700 text-xs">URLs are saved in your browser (localStorage). To persist across devices, use the Grant sections below and store URLs in the database.</p>
        </div>
      )}
    </div>
  );
}

function MasterBundlePanel({ adminEmail }) {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", download_url: "", stripe_session_id: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { loadGrants(); }, []);

  const loadGrants = async () => {
    setLoading(true);
    const data = await base44.entities.PdfAccessGrant.filter({ product: "Master Brief Bundle" }, "-created_date", 200);
    setGrants(data || []);
    setLoading(false);
  };

  const handleGrant = async () => {
    if (!form.email) return;
    setSaving(true);
    await base44.entities.PdfAccessGrant.create({
      email: form.email.toLowerCase().trim(),
      tier: "brief_pack",
      product: "Master Brief Bundle",
      download_url: form.download_url || "",
      stripe_session_id: form.stripe_session_id || "",
      notes: form.notes,
      granted_by: adminEmail,
      active: true,
      email_sent: false,
    });
    setForm({ email: "", download_url: "", stripe_session_id: "", notes: "" });
    setShowForm(false);
    await loadGrants();
    setSaving(false);
  };

  const handleSendEmail = async (grant) => {
    setSendingEmail(grant.id);
    try {
      await base44.integrations.Core.SendEmail({
        to: grant.email,
        subject: "Your Master Brief Pack Bundle — All 33 Device Build Plans",
        body: `Hi,

Thank you for your purchase of the All 33 Device Build Plans — Master Brief Pack Bundle!

Your complete bundle of 33 engineering brief pack PDFs is ready for download:

${grant.download_url ? `📦 Download All 33 PDFs:\n${grant.download_url}` : "Your download link will be sent shortly. Please reply to this email if you haven't received it within 24 hours."}

WHAT'S INCLUDED (33 PDFs — 1,400–1,800 total pages):
• Vacuum Energy Devices (Anenergy Pump, VPO, MEG, Asymmetric Generators)
• Scalar EM Systems (Energy Bottle, Phase Conjugate Mirror, T-Polarized Transducer)  
• Bioelectromagnetic Devices (Kaznacheyev Chamber, Prioré-Type, TRD-1, KRCIC, UBDRS)
• Defense & Detection (Quantum Potential Sensor, ELF Detector, Aegis-SV, Woodpecker Detector)
• Agricultural & Environmental (MorphoYield, AEGH, MFCS)
• Longevity & Epigenetics (PPDTS, WVTS, CEES, BESC-1, BCRC)
• And more...

Each pack includes: system architecture, bill of materials with exact part numbers, circuit diagrams, assembly procedures, and measurement protocols.

IMPORTANT: All documents are for research and experimental purposes only. Please review the disclaimer in each PDF.

If you have any questions, reply to this email.

— Aethon Apex IP Research Team`
      });
      await base44.entities.PdfAccessGrant.update(grant.id, { email_sent: true });
      setGrants(prev => prev.map(g => g.id === grant.id ? { ...g, email_sent: true } : g));
    } catch (e) {
      console.error(e);
    }
    setSendingEmail(null);
  };

  const handleToggle = async (grant) => {
    await base44.entities.PdfAccessGrant.update(grant.id, { active: !grant.active });
    setGrants(prev => prev.map(g => g.id === grant.id ? { ...g, active: !g.active } : g));
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this master bundle access grant?")) return;
    await base44.entities.PdfAccessGrant.delete(id);
    setGrants(prev => prev.filter(g => g.id !== id));
  };

  const displayedGrants = showAll ? grants : grants.slice(0, 5);

  return (
    <div className="bg-gray-900 border border-yellow-800/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-yellow-800/30 bg-yellow-950/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={15} className="text-yellow-400" />
          <h2 className="text-white font-black text-sm">Master Bundle — All 33 Brief Packs ($197)</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/50 border border-yellow-700 text-yellow-300 font-bold">{grants.filter(g => g.active).length} active</span>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-700 hover:bg-yellow-600 text-black text-xs font-black transition-colors">
          <Plus size={12} /> Grant Master Bundle Access
        </button>
      </div>

      <div className="px-5 py-3 border-b border-gray-800 bg-gray-900/50">
        <p className="text-gray-500 text-xs mb-1 font-bold uppercase tracking-wider">Includes all 33 PDFs — {BRIEF_PACKS.length} device engineering packs</p>
        <div className="flex flex-wrap gap-1.5">
          {["Vacuum Energy", "Scalar EM", "Bioelectromagnetics", "Free Energy", "Defense", "AgTech", "Longevity", "Epigenetics"].map(cat => (
            <span key={cat} className="text-xs px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-400">{cat}</span>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="px-5 py-5 border-b border-gray-800 bg-gray-900/60 space-y-3">
          <h3 className="text-white font-bold text-sm">Grant Master Bundle Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Buyer Email *</label>
              <input type="email" placeholder="buyer@email.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Stripe Session ID</label>
              <input type="text" placeholder="cs_live_..." value={form.stripe_session_id}
                onChange={e => setForm(f => ({ ...f, stripe_session_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Master Bundle Download URL (Google Drive folder / zip link)</label>
            <input type="url" placeholder="https://drive.google.com/..." value={form.download_url}
              onChange={e => setForm(f => ({ ...f, download_url: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Notes</label>
            <input type="text" placeholder="e.g. Stripe purchase $197 verified" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleGrant} disabled={saving || !form.email}
              className="px-4 py-2 rounded-lg bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : "Grant & Save"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-4 border-gray-700 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      ) : grants.length === 0 ? (
        <div className="text-center py-8 text-gray-600 text-sm">No master bundle grants yet.</div>
      ) : (
        <>
          <div className="divide-y divide-gray-800/60">
            {displayedGrants.map(g => (
              <div key={g.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{g.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {g.stripe_session_id && <span className="text-xs text-gray-600 truncate max-w-[100px]">{g.stripe_session_id}</span>}
                    <span className="text-xs text-gray-700">{g.created_date ? new Date(g.created_date).toLocaleDateString() : ""}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {g.download_url && (
                    <a href={g.download_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors">
                      <ExternalLink size={10} /> Bundle
                    </a>
                  )}
                  <button onClick={() => handleSendEmail(g)} disabled={sendingEmail === g.id}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${g.email_sent ? "bg-green-950/40 border border-green-800 text-green-400" : "bg-yellow-900/40 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300"}`}>
                    {sendingEmail === g.id ? "Sending…" : g.email_sent ? <><Check size={10} /> Sent</> : <><Send size={10} /> Send Email</>}
                  </button>
                  <button onClick={() => handleToggle(g)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${g.active ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-600"}`}>
                    {g.active ? <Check size={12} /> : <X size={12} />}
                  </button>
                  <button onClick={() => handleDelete(g.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {grants.length > 5 && (
            <button onClick={() => setShowAll(s => !s)}
              className="w-full flex items-center justify-center gap-1 py-2.5 text-gray-600 hover:text-gray-400 text-xs transition-colors border-t border-gray-800">
              {showAll ? <><ChevronUp size={11} /> Show less</> : <><ChevronDown size={11} /> Show all {grants.length} grants</>}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function BriefPackAccessPanel({ adminEmail, onRefresh }) {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", notes: "", download_url: "", stripe_session_id: "" });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(null);

  useEffect(() => { loadGrants(); }, []);

  const loadGrants = async () => {
    setLoading(true);
    const data = await base44.entities.PdfAccessGrant.filter({ tier: "brief_pack" }, "-created_date", 200);
    setGrants(data || []);
    setLoading(false);
  };

  const handleGrant = async () => {
    if (!form.email) return;
    setSaving(true);
    await base44.entities.PdfAccessGrant.create({
      email: form.email.toLowerCase().trim(),
      tier: "brief_pack",
      product: "Technical Brief Pack",
      download_url: form.download_url || "",
      stripe_session_id: form.stripe_session_id || "",
      notes: form.notes,
      granted_by: adminEmail,
      active: true,
      email_sent: false,
    });
    setForm({ email: "", notes: "", download_url: "", stripe_session_id: "" });
    setShowForm(false);
    await loadGrants();
    setSaving(false);
  };

  const handleSendEmail = async (grant) => {
    setSendingEmail(grant.id);
    try {
      await base44.integrations.Core.SendEmail({
        to: grant.email,
        subject: "Your Technical Brief Pack — Instant Download Links",
        body: `Hi,

Thank you for your purchase of the Technical Brief Pack!

Your 4 PDF documents are ready for instant download:

${BRIEF_PACK_DOCS.map((d, i) => `${i + 1}. ${d.title} (${d.pages} pages)\n   ${grant.download_url || "[Download link — update in Admin PDF Access]"}`).join("\n\n")}

These are research documents for experimental engineering purposes. Please review the disclaimer included in each document.

If you have any questions, reply to this email.

— Aethon Apex IP Research Team`
      });
      await base44.entities.PdfAccessGrant.update(grant.id, { email_sent: true });
      setGrants(prev => prev.map(g => g.id === grant.id ? { ...g, email_sent: true } : g));
    } catch (e) {
      console.error(e);
    }
    setSendingEmail(null);
  };

  const handleToggle = async (grant) => {
    await base44.entities.PdfAccessGrant.update(grant.id, { active: !grant.active });
    setGrants(prev => prev.map(g => g.id === grant.id ? { ...g, active: !g.active } : g));
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this brief pack access grant?")) return;
    await base44.entities.PdfAccessGrant.delete(id);
    setGrants(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="bg-gray-900 border border-cyan-800/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-cyan-800/30 bg-cyan-950/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-cyan-400" />
          <h2 className="text-white font-black text-sm">Brief Pack — Instant PDF Access</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-900/50 border border-cyan-700 text-cyan-300 font-bold">{grants.filter(g => g.active).length} active</span>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold transition-colors">
          <Plus size={12} /> Grant Brief Pack Access
        </button>
      </div>

      {/* What's in the pack */}
      <div className="px-5 py-3 border-b border-gray-800 bg-gray-900/50">
        <p className="text-gray-500 text-xs mb-2 font-bold uppercase tracking-wider">PDFs in this pack ($27 product)</p>
        <div className="flex flex-wrap gap-2">
          {BRIEF_PACK_DOCS.map(d => (
            <span key={d.id} className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-300">
              📄 {d.title} <span className="text-gray-600">({d.pages}p)</span>
            </span>
          ))}
        </div>
      </div>

      {/* Add grant form */}
      {showForm && (
        <div className="px-5 py-5 border-b border-gray-800 bg-gray-900/60 space-y-3">
          <h3 className="text-white font-bold text-sm">Grant Brief Pack Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Buyer Email *</label>
              <input type="email" placeholder="buyer@email.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Stripe Session ID (optional)</label>
              <input type="text" placeholder="cs_live_..." value={form.stripe_session_id}
                onChange={e => setForm(f => ({ ...f, stripe_session_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">PDF Download URL (hosted link to zip or drive folder)</label>
            <input type="url" placeholder="https://drive.google.com/... or storage URL" value={form.download_url}
              onChange={e => setForm(f => ({ ...f, download_url: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Notes</label>
            <input type="text" placeholder="e.g. Stripe purchase verified" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleGrant} disabled={saving || !form.email}
              className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-sm disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : "Grant & Save"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grants list */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : grants.length === 0 ? (
        <div className="text-center py-10 text-gray-600 text-sm">No brief pack grants yet.</div>
      ) : (
        <div className="divide-y divide-gray-800/60">
          {grants.map(g => (
            <div key={g.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800/20 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{g.email}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {g.stripe_session_id && <span className="text-xs text-gray-600 truncate max-w-[120px]">{g.stripe_session_id}</span>}
                  {g.notes && <span className="text-xs text-gray-600 truncate">{g.notes}</span>}
                  <span className="text-xs text-gray-700">{g.created_date ? new Date(g.created_date).toLocaleDateString() : ""}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {g.download_url && (
                  <a href={g.download_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors">
                    <ExternalLink size={10} /> PDF
                  </a>
                )}
                <button onClick={() => handleSendEmail(g)} disabled={sendingEmail === g.id}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${g.email_sent ? "bg-green-950/40 border border-green-800 text-green-400" : "bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-700 text-cyan-300"}`}>
                  {sendingEmail === g.id ? "Sending…" : g.email_sent ? <><Check size={10} /> Sent</> : <><Send size={10} /> Send Email</>}
                </button>
                <button onClick={() => handleToggle(g)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${g.active ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-600"}`}>
                  {g.active ? <Check size={12} /> : <X size={12} />}
                </button>
                <button onClick={() => handleDelete(g.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPdfAccess() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", tier: "elite", notes: "" });
  const [saving, setSaving] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    base44.auth.me().then(u => setAdminEmail(u?.email || "admin")).catch(() => {});
    loadGrants();
  }, []);

  const loadGrants = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.PdfAccessGrant.list("-created_date", 200);
      setGrants(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleGrant = async () => {
    if (!form.email) return;
    setSaving(true);
    try {
      await base44.entities.PdfAccessGrant.create({
        email: form.email.toLowerCase().trim(),
        tier: form.tier,
        notes: form.notes,
        granted_by: adminEmail,
        active: true,
      });
      setForm({ email: "", tier: "elite", notes: "" });
      setShowForm(false);
      await loadGrants();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleToggle = async (grant) => {
    try {
      await base44.entities.PdfAccessGrant.update(grant.id, { active: !grant.active });
      setGrants(prev => prev.map(g => g.id === grant.id ? { ...g, active: !g.active } : g));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this PDF access grant?")) return;
    try {
      await base44.entities.PdfAccessGrant.delete(id);
      setGrants(prev => prev.filter(g => g.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = grants.filter(g => {
    const q = search.toLowerCase();
    return !q || g.email?.toLowerCase().includes(q) || g.tier?.toLowerCase().includes(q);
  });

  const activeCount = grants.filter(g => g.active).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Admin
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <Download size={16} className="text-yellow-400" />
            <div>
              <h1 className="text-white font-black text-lg">PDF Download Access</h1>
              <p className="text-gray-500 text-xs">{activeCount} active grants</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadGrants} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 transition-colors">
              <RefreshCw size={12} /> Refresh
            </button>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold transition-colors">
              <Plus size={14} /> Grant Access
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Info banner */}
        <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-xl px-5 py-4 text-sm text-yellow-200/80">
          <p><span className="font-bold text-yellow-300">PDF downloads are admin-only by default.</span> Use this panel to grant individual Elite or GOV accounts the ability to download build plan PDFs. Only accounts explicitly listed here (and active) will have download access.</p>
        </div>

        {/* Add grant form */}
        {showForm && (
          <div className="bg-gray-900 border border-yellow-700/50 rounded-2xl p-6">
            <h3 className="text-white font-black mb-4">Grant PDF Access</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Member Email *</label>
                <input
                  type="email"
                  placeholder="member@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Membership Tier *</label>
                <select
                  value={form.tier}
                  onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                >
                  <option value="elite">Elite</option>
                  <option value="gov">GOV / Defense</option>
                  <option value="brief_pack">Brief Pack</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Notes (optional)</label>
              <input
                type="text"
                placeholder="e.g. Verified Elite subscriber — manual grant"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleGrant} disabled={saving || !form.email}
                className="px-5 py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-sm disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : "Grant Access"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email or tier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500"
          />
        </div>

        {/* Admin Master Bundle Access */}
        <AdminMasterBundleAccess />

        {/* Master Bundle Section */}
        <MasterBundlePanel adminEmail={adminEmail} />

        {/* Brief Pack Section */}
        <BriefPackAccessPanel adminEmail={adminEmail} onRefresh={loadGrants} />

        {/* Grants table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Download size={32} className="mx-auto mb-3 opacity-30" />
            <p>No PDF access grants yet.</p>
            <p className="text-sm mt-1">Click "Grant Access" to add the first one.</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900">
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 px-5">Email</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 px-4">Tier</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 px-4">Granted By</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 px-4">Notes</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 px-4">Date</th>
                  <th className="text-center text-gray-500 text-xs font-bold uppercase py-3 px-4">Active</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-5 text-white font-medium">{g.email}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        g.tier === "gov" ? "bg-green-900/40 text-green-300 border border-green-800" :
                        g.tier === "brief_pack" ? "bg-cyan-900/40 text-cyan-300 border border-cyan-800" :
                        "bg-yellow-900/40 text-yellow-300 border border-yellow-800"
                      }`}>
                        {g.tier === "gov" ? "GOV" : g.tier === "brief_pack" ? "Brief Pack" : "Elite"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{g.granted_by || "—"}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs max-w-[160px] truncate">{g.notes || "—"}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{g.created_date ? new Date(g.created_date).toLocaleDateString() : "—"}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => handleToggle(g)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors ${g.active ? "bg-green-900/50 hover:bg-green-900 text-green-400" : "bg-gray-800 hover:bg-gray-700 text-gray-600"}`}>
                        {g.active ? <Check size={14} /> : <X size={14} />}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(g.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}