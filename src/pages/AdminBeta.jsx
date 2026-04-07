import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Loader2, Check, X, Mail, DollarSign, Users, TrendingUp, Clock, ChevronDown, ChevronUp, Search, FileText } from "lucide-react";
import { generateAndEmailInvoice, PLAN_DETAILS } from "../lib/generateInvoice";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  pending:   { label: "Pending Review", color: "text-yellow-400", bg: "bg-yellow-900/30 border-yellow-700" },
  approved:  { label: "Approved",       color: "text-blue-400",   bg: "bg-blue-900/30 border-blue-700" },
  invited:   { label: "Invited",        color: "text-purple-400", bg: "bg-purple-900/30 border-purple-700" },
  converted: { label: "Paying Member",  color: "text-green-400",  bg: "bg-green-900/30 border-green-700" },
  rejected:  { label: "Rejected",       color: "text-red-400",    bg: "bg-red-900/30 border-red-700" },
};

const MRR_BY_PLAN = Object.fromEntries(
  Object.entries(PLAN_DETAILS).map(([k, v]) => [k, v.interval ? v.price : 0])
);

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-white font-black text-3xl">{value}</p>
      {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function ApplicantRow({ app, onUpdate, onInvite, inviting }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(app.admin_notes || "");
  const [plan, setPlan] = useState(app.plan_purchased || "");
  const [invoicing, setInvoicing] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(app.invoice_url || null);
  const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;

  const handleStatusChange = async (newStatus) => {
    await base44.entities.BetaApplication.update(app.id, { status: newStatus, admin_notes: notes });
    onUpdate();
  };

  const handleSaveNotes = async () => {
    await base44.entities.BetaApplication.update(app.id, { admin_notes: notes });
    onUpdate();
  };

  const handleMarkConverted = async () => {
    setInvoicing(true);
    const mrr = MRR_BY_PLAN[plan] || 0;
    await base44.entities.BetaApplication.update(app.id, {
      status: "converted",
      plan_purchased: plan,
      mrr_value: mrr,
      converted_at: new Date().toISOString(),
    });
    // Generate PDF invoice and email it
    const { invoiceNumber, fileUrl } = await generateAndEmailInvoice(app, plan);
    await base44.entities.BetaApplication.update(app.id, {
      invoice_url: fileUrl,
      invoice_number: invoiceNumber,
    });
    setInvoiceUrl(fileUrl);
    setInvoicing(false);
    onUpdate();
  };

  return (
    <div className={`bg-gray-900 border rounded-xl overflow-hidden transition-all ${expanded ? "border-yellow-700/50" : "border-gray-800"}`}>
      <button className="w-full text-left px-5 py-4 flex items-center gap-4" onClick={() => setExpanded(e => !e)}>
        {/* Status dot */}
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${app.status === "converted" ? "bg-green-400" : app.status === "invited" ? "bg-purple-400" : app.status === "approved" ? "bg-blue-400" : app.status === "rejected" ? "bg-red-500" : "bg-yellow-400"}`} />

        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-4 items-center">
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{app.full_name}</p>
            <p className="text-gray-500 text-xs truncate">{app.email}</p>
          </div>
          <p className="text-gray-400 text-xs hidden sm:block">{app.background}</p>
          <div className="hidden sm:block">
            <span className={`text-xs px-2 py-0.5 rounded border ${sc.bg} ${sc.color} font-bold`}>{sc.label}</span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-gray-500 text-xs">{app.budget || "—"}</p>
            {app.mrr_value > 0 && <p className="text-green-400 font-bold text-xs">${app.mrr_value}/mo</p>}
          </div>
        </div>

        {expanded ? <ChevronUp size={15} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={15} className="text-gray-500 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-800 px-5 py-4 space-y-4">
          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Why Interested</p>
              <p className="text-gray-300 text-sm leading-relaxed">{app.why_interested}</p>
            </div>
            <div className="space-y-2">
              <div><p className="text-gray-500 text-xs font-semibold">Primary Interest</p><p className="text-gray-300 text-sm">{app.primary_interest || "—"}</p></div>
              <div><p className="text-gray-500 text-xs font-semibold">NDA Signed</p><p className={`text-sm font-bold ${app.nda_signed ? "text-green-400" : "text-red-400"}`}>{app.nda_signed ? "✓ Yes" : "✗ No"}</p></div>
              <div><p className="text-gray-500 text-xs font-semibold">Applied</p><p className="text-gray-300 text-sm">{app.created_date ? new Date(app.created_date).toLocaleDateString() : "—"}</p></div>
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase mb-1.5">Admin Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Internal notes about this applicant..."
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600 resize-none"
            />
            <button onClick={handleSaveNotes} className="mt-1 text-xs text-yellow-500 hover:text-yellow-300">Save notes</button>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {app.status === "pending" && (
              <>
                <button onClick={() => handleStatusChange("approved")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold">
                  <Check size={13} /> Approve
                </button>
                <button onClick={() => handleStatusChange("rejected")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-900/50 hover:bg-red-800 border border-red-700 text-red-300 text-xs font-bold">
                  <X size={13} /> Reject
                </button>
              </>
            )}

            {app.status === "approved" && (
              <button
                onClick={() => onInvite(app)}
                disabled={inviting === app.id}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold disabled:opacity-60"
              >
                {inviting === app.id ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
                {inviting === app.id ? "Sending…" : "Send Invite"}
              </button>
            )}

            {(app.status === "invited" || app.status === "approved") && (
              <div className="flex items-center gap-2 ml-auto">
                <select
                  value={plan}
                  onChange={e => setPlan(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-300 text-xs focus:outline-none"
                >
                  <option value="">Mark as converted…</option>
                  {Object.keys(MRR_BY_PLAN).map(p => <option key={p}>{p}</option>)}
                </select>
                {plan && (
                  <button onClick={handleMarkConverted}
                    disabled={invoicing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white text-xs font-bold disabled:opacity-60">
                    {invoicing ? <Loader2 size={13} className="animate-spin" /> : <DollarSign size={13} />}
                    {invoicing ? "Generating Invoice…" : "Mark Converted + Invoice"}
                  </button>
                )}
                {invoiceUrl && (
                  <a href={invoiceUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-900/50 border border-indigo-700 text-indigo-300 text-xs font-bold hover:bg-indigo-800/50">
                    <FileText size={13} /> View Invoice
                  </a>
                )}
              </div>
            )}

            {app.status === "rejected" && (
              <button onClick={() => handleStatusChange("pending")}
                className="text-xs text-gray-500 hover:text-gray-300 underline">
                Undo rejection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBeta() {
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    const all = await base44.entities.BetaApplication.list("-created_date", 200);
    setApps(all);
  };

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      setUser(me);
      if (me?.role === "admin") await load();
      setLoading(false);
    })();
  }, []);

  const handleInvite = async (app) => {
    setInviting(app.id);

    // Invite the user to the platform
    await base44.users.inviteUser(app.email, "user");

    // Send welcome email
    await base44.integrations.Core.SendEmail({
      to: app.email,
      subject: "🔓 You're In — Zenith Apex Beta Access Granted",
      body: `Dear ${app.full_name},\n\nYour Zenith Apex beta application has been approved.\n\nYour private access link:\nhttps://app.base44.com\n\nWhat you now have access to:\n✓ All 5 Invention Build Plans (MEG, TRD-1, G-Com, Prioré, TRZ)\n✓ AI Patent Drafting Tool — unlimited use\n✓ Full Course Library (10 courses)\n✓ AI Invention Forge\n✓ Investor Package & Due Diligence Docs\n✓ Prior Art Archive (200+ entries)\n\nYour beta pricing is available on the Pricing page. Rates are grandfathered — your price never increases after you subscribe.\n\nIMPORTANT: Your access is personal and non-transferable. The NDA you agreed to during application is in full effect.\n\nWelcome to the research.\n\n— Zenith Apex Research Portfolio`
    });

    await base44.entities.BetaApplication.update(app.id, {
      status: "invited",
      invited_at: new Date().toISOString(),
    });

    await load();
    setInviting(null);
  };

  const filtered = apps.filter(a => {
    if (filter !== "all" && a.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.full_name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.background?.toLowerCase().includes(q);
    }
    return true;
  });

  // Stats
  const totalMRR = apps.filter(a => a.status === "converted").reduce((s, a) => s + (a.mrr_value || 0), 0);
  const totalRevenue = apps.filter(a => a.status === "converted").reduce((s, a) => {
    const p = a.plan_purchased || "";
    if (p.includes("$497")) return s + 497;
    if (p.includes("$197")) return s + 197;
    if (p.includes("$226")) return s + 226;
    return s + (a.mrr_value || 0);
  }, 0);
  const conversionRate = apps.length > 0 ? Math.round((apps.filter(a => a.status === "converted").length / apps.filter(a => a.status !== "rejected").length) * 100) || 0 : 0;

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={32} />
    </div>
  );

  if (!user || user.role !== "admin") return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <Lock size={40} className="text-yellow-600" />
      <h2 className="text-white font-black text-xl">Admin Access Required</h2>
      <Link to="/" className="text-yellow-400 hover:underline text-sm">← Back to Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-yellow-900/40 bg-gray-900/80 px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-lg">Beta Program Dashboard</h1>
            <p className="text-yellow-600 text-xs font-semibold">Admin Only · Closed Beta Management</p>
          </div>
        </div>
        <a
          href="/beta-apply"
          target="_blank"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-xs transition-all"
        >
          View Apply Page ↗
        </a>
      </div>

      {/* Stats */}
      <div className="px-5 py-6 border-b border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl">
          <StatCard icon={<Users size={18} />} label="Total Applicants" value={apps.length} sub={`${apps.filter(a => a.status === "pending").length} pending review`} color="#f59e0b" />
          <StatCard icon={<TrendingUp size={18} />} label="MRR" value={`$${totalMRR}`} sub={`${apps.filter(a => a.status === "converted").length} paying members`} color="#22c55e" />
          <StatCard icon={<DollarSign size={18} />} label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} sub="one-time + recurring" color="#a855f7" />
          <StatCard icon={<Clock size={18} />} label="Conversion Rate" value={`${conversionRate}%`} sub={`${apps.filter(a => a.status === "invited").length} awaiting conversion`} color="#3b82f6" />
        </div>

        {/* MRR target progress */}
        <div className="mt-5 max-w-5xl bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs font-semibold uppercase">Progress to $10K MRR Target</p>
            <p className="text-white font-black text-sm">${totalMRR.toLocaleString()} / $10,000</p>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 transition-all"
              style={{ width: `${Math.min((totalMRR / 10000) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1.5">
            <span>$0</span>
            <span className="text-yellow-600 font-bold">Acquisition-Ready: $10K–$30K MRR</span>
            <span>$30K</span>
          </div>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="px-5 py-3 border-b border-gray-800 flex flex-wrap items-center gap-3 flex-shrink-0">
        <div className="flex gap-1.5 flex-wrap">
          {["all", "pending", "approved", "invited", "converted", "rejected"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${filter === s ? "bg-yellow-700 text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              {s === "all" ? `All (${apps.length})` : `${s} (${apps.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
          <Search size={13} className="text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="bg-transparent text-white text-xs focus:outline-none w-40 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Applicant list */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="max-w-5xl space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              {apps.length === 0 ? (
                <>
                  <Users size={40} className="mx-auto mb-3 text-gray-800" />
                  <p className="font-semibold text-gray-500 mb-1">No applications yet</p>
                  <p className="text-sm">Share your beta apply page to start collecting vetted applicants.</p>
                  <a href="/beta-apply" target="_blank" className="inline-block mt-4 text-yellow-400 hover:underline text-sm">Open Apply Page ↗</a>
                </>
              ) : "No applicants match the current filter."}
            </div>
          )}
          {filtered.map(app => (
            <ApplicantRow
              key={app.id}
              app={app}
              onUpdate={load}
              onInvite={handleInvite}
              inviting={inviting}
            />
          ))}
        </div>
      </div>
    </div>
  );
}