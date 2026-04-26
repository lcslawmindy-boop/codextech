import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Plus, Trash2, Check, X, Search, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

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
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${g.tier === "gov" ? "bg-green-900/40 text-green-300 border border-green-800" : "bg-yellow-900/40 text-yellow-300 border border-yellow-800"}`}>
                        {g.tier === "gov" ? "GOV" : "Elite"}
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