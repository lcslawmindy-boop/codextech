import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, User, TrendingUp, Eye, EyeOff, FileText,
  DollarSign, CheckCircle2, Clock, AlertCircle, Lock, Loader2,
  ChevronRight, Briefcase, BarChart3, Users, Percent, Plus,
  FolderOpen, X, Edit3, RefreshCw
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEAL_STAGES = ["LOI Submitted", "NDA Signed", "Due Diligence", "Term Sheet", "Negotiating", "Closed", "Dead"];

const STAGE_CONFIG = {
  "LOI Submitted":  { color: "text-blue-400",   bg: "bg-blue-900/30",   border: "border-blue-700",   icon: FileText },
  "NDA Signed":     { color: "text-cyan-400",    bg: "bg-cyan-900/30",   border: "border-cyan-700",   icon: Shield },
  "Due Diligence":  { color: "text-yellow-400",  bg: "bg-yellow-900/30", border: "border-yellow-700", icon: FolderOpen },
  "Term Sheet":     { color: "text-orange-400",  bg: "bg-orange-900/30", border: "border-orange-700", icon: FileText },
  "Negotiating":    { color: "text-purple-400",  bg: "bg-purple-900/30", border: "border-purple-700", icon: Users },
  "Closed":         { color: "text-green-400",   bg: "bg-green-900/30",  border: "border-green-700",  icon: CheckCircle2 },
  "Dead":           { color: "text-gray-500",    bg: "bg-gray-900/30",   border: "border-gray-700",   icon: X },
};

function formatCurrency(val) {
  if (!val) return "—";
  if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
}

function StatCard({ label, value, sub, color = "text-cyan-400", icon: Icon }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        {Icon && <Icon size={18} className={color} />}
      </div>
      <div className={`text-2xl font-black ${color} mb-1`}>{value}</div>
      <div className="text-gray-400 text-xs font-bold">{label}</div>
      {sub && <div className="text-gray-600 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function DealPipelineCard({ deal, userEmail, onStageChange }) {
  const cfg = STAGE_CONFIG[deal.deal_stage] || STAGE_CONFIG["LOI Submitted"];
  const Icon = cfg.icon;
  const isInventor = deal.inventor_email === userEmail;
  const commission = deal.deal_value ? (deal.deal_value * 0.05) : null;

  return (
    <div className={`border ${cfg.border} rounded-xl p-5 ${cfg.bg}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">{deal.listing_category || "IP Deal"}</p>
          <h3 className="text-white font-black text-base">{deal.listing_alias}</h3>
          <p className="text-gray-500 text-xs mt-0.5">
            {isInventor ? "You are: Inventor" : "You are: Investor"} · {deal.investor_org || "Anonymous counterpart"}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.border} ${cfg.color} flex-shrink-0`}>
          <Icon size={11} /> {deal.deal_stage}
        </div>
      </div>

      {/* Pipeline progress bar */}
      <div className="mb-4">
        <div className="flex gap-1 mb-1">
          {DEAL_STAGES.filter(s => s !== "Dead").map((s, i) => {
            const stageIdx = DEAL_STAGES.indexOf(deal.deal_stage);
            const thisIdx = DEAL_STAGES.indexOf(s);
            const active = thisIdx <= stageIdx && deal.deal_stage !== "Dead";
            return (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${active ? "bg-cyan-500" : "bg-gray-800"}`} />
            );
          })}
        </div>
        <p className="text-gray-600 text-xs">
          {DEAL_STAGES.indexOf(deal.deal_stage) + 1} / {DEAL_STAGES.filter(s => s !== "Dead").length} stages
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-gray-600 text-xs">Deal Value</p>
          <p className="text-white font-bold text-sm">{formatCurrency(deal.deal_value)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs">ZARP Commission</p>
          <p className="text-yellow-400 font-bold text-sm">{commission ? formatCurrency(commission) : "5% on close"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs">VDR Access</p>
          <p className={`font-bold text-sm ${deal.vdr_access_granted ? "text-green-400" : "text-gray-500"}`}>
            {deal.vdr_access_granted ? "✓ Granted" : "Pending"}
          </p>
        </div>
      </div>

      {/* VDR CTA */}
      {deal.vdr_access_granted && deal.vdr_session_id && (
        <Link
          to={`/vdr/${deal.vdr_session_id}`}
          className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-bold mb-3"
        >
          <FolderOpen size={12} /> Open Virtual Data Room →
        </Link>
      )}

      {/* Commission status */}
      {deal.deal_stage === "Closed" && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
          deal.commission_paid ? "bg-green-900/30 border border-green-700 text-green-300" : "bg-yellow-900/30 border border-yellow-700 text-yellow-300"
        }`}>
          <Percent size={11} />
          {deal.commission_paid
            ? `Commission paid ${deal.commission_paid_at ? new Date(deal.commission_paid_at).toLocaleDateString() : ""}`
            : `Commission due: ${formatCurrency(commission)} — awaiting payment`}
        </div>
      )}

      {/* Stage advancement (admin action reflected here for now) */}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
        <Clock size={11} />
        Last updated: {deal.updated_date ? new Date(deal.updated_date).toLocaleDateString() : "recently"}
      </div>
    </div>
  );
}

function ProfileSetupModal({ user, existing, onSave, onClose }) {
  const [form, setForm] = useState({
    alias: existing?.alias || "",
    profile_type: existing?.profile_type || "inventor",
    bio: existing?.bio || "",
    expertise_areas: existing?.expertise_areas?.join(", ") || "",
    preferred_categories: existing?.preferred_categories?.join(", ") || "",
    investment_range_min: existing?.investment_range_min || "",
    investment_range_max: existing?.investment_range_max || "",
    anonymous: existing?.anonymous !== false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.alias || !form.profile_type) return;
    setSaving(true);
    const payload = {
      user_email: user.email,
      alias: form.alias,
      profile_type: form.profile_type,
      bio: form.bio,
      expertise_areas: form.expertise_areas ? form.expertise_areas.split(",").map(s => s.trim()) : [],
      preferred_categories: form.preferred_categories ? form.preferred_categories.split(",").map(s => s.trim()) : [],
      investment_range_min: parseFloat(form.investment_range_min) || 0,
      investment_range_max: parseFloat(form.investment_range_max) || 0,
      anonymous: form.anonymous,
      status: "active",
    };
    if (existing?.id) {
      await base44.entities.MarketplaceProfile.update(existing.id, payload);
    } else {
      await base44.entities.MarketplaceProfile.create(payload);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <p className="text-white font-black text-base flex items-center gap-2"><User size={14} /> {existing ? "Edit Profile" : "Create Profile"}</p>
            <p className="text-gray-500 text-xs">Your real identity stays hidden until NDA is signed</p>
          </div>
          <button onClick={onClose}><X size={16} className="text-gray-600 hover:text-gray-300" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Profile type */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-2">I am a *</label>
            <div className="grid grid-cols-3 gap-2">
              {["inventor", "investor", "both"].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, profile_type: t }))}
                  className={`py-2 rounded-lg text-xs font-black capitalize transition-all border ${
                    form.profile_type === t ? "bg-cyan-800 border-cyan-600 text-cyan-200" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1">Anonymous Alias * <span className="text-gray-600 font-normal">(shown publicly)</span></label>
            <input value={form.alias} onChange={e => setForm(f => ({ ...f, alias: e.target.value }))}
              placeholder="e.g. Inventor Sigma-7, Capital Shield LLC"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600" />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1">Bio / Background</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Brief background (shown anonymously to matched counterparts)"
              rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600 resize-none" />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1">Expertise / Focus Areas (comma-separated)</label>
            <input value={form.expertise_areas} onChange={e => setForm(f => ({ ...f, expertise_areas: e.target.value }))}
              placeholder="e.g. Scalar EM, Bioelectromagnetics, Patent Strategy"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600" />
          </div>

          {(form.profile_type === "investor" || form.profile_type === "both") && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Min Investment ($)</label>
                <input type="number" value={form.investment_range_min} onChange={e => setForm(f => ({ ...f, investment_range_min: e.target.value }))}
                  placeholder="50000"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Max Investment ($)</label>
                <input type="number" value={form.investment_range_max} onChange={e => setForm(f => ({ ...f, investment_range_max: e.target.value }))}
                  placeholder="5000000"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600" />
              </div>
            </div>
          )}

          {/* Anonymous toggle */}
          <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              {form.anonymous ? <EyeOff size={14} className="text-cyan-400" /> : <Eye size={14} className="text-yellow-400" />}
              <div>
                <p className="text-white text-sm font-bold">{form.anonymous ? "Anonymous Mode ON" : "Identity Visible"}</p>
                <p className="text-gray-500 text-xs">Real name shown only after mutual NDA</p>
              </div>
            </div>
            <button onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
              className={`w-10 h-5 rounded-full transition-all relative ${form.anonymous ? "bg-cyan-600" : "bg-gray-600"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.anonymous ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          <button onClick={handleSave} disabled={saving || !form.alias}
            className="w-full py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 disabled:opacity-40 text-white font-black text-sm flex items-center justify-center gap-2 transition-all">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            {saving ? "Saving…" : existing ? "Save Changes" : "Create Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IPMarketplaceDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pipeline");
  const [authed, setAuthed] = useState(false);

  const loadData = async (userEmail) => {
    const [profileData, dealData] = await Promise.all([
      base44.entities.MarketplaceProfile.filter({ user_email: userEmail }),
      base44.entities.IPDeal.filter({
        $or: [{ inventor_email: userEmail }, { investor_email: userEmail }]
      }, "-updated_date", 50).catch(() => []),
    ]);
    setProfile(profileData[0] || null);
    setDeals(dealData);
  };

  useEffect(() => {
    const init = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      setAuthed(isAuth);
      if (isAuth) {
        const me = await base44.auth.me();
        setUser(me);
        await loadData(me.email);
      }
      setLoading(false);
    };
    init();
  }, []);

  const activeDeals = deals.filter(d => !["Closed", "Dead"].includes(d.deal_stage));
  const closedDeals = deals.filter(d => d.deal_stage === "Closed");
  const totalValue = closedDeals.reduce((s, d) => s + (d.deal_value || 0), 0);
  const totalCommission = closedDeals.reduce((s, d) => s + (d.commission_amount || (d.deal_value ? d.deal_value * 0.05 : 0)), 0);
  const vdrActive = deals.filter(d => d.vdr_access_granted).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="text-cyan-400 animate-spin" size={28} />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Lock size={48} className="text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-3">Authentication Required</h2>
          <p className="text-gray-400 text-sm mb-6">
            The IP Marketplace Dashboard is restricted to authenticated members. Sign in to manage your profiles, deals, and VDR access.
          </p>
          <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-all">
            Sign In to Continue
          </button>
          <div className="mt-4">
            <Link to="/ip-marketplace" className="text-gray-500 text-xs hover:text-gray-400">← Browse public marketplace</Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "pipeline", label: "Deal Pipeline", icon: BarChart3 },
    { id: "vdr", label: "VDR Access", icon: FolderOpen },
    { id: "commission", label: "Commission", icon: Percent },
    { id: "profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 sticky top-0 z-30 px-5 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/ip-marketplace" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
              <ArrowLeft size={14} /> Marketplace
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <div>
              <h1 className="text-white font-black text-base flex items-center gap-2">
                <Shield size={14} className="text-cyan-400" /> Deal Dashboard
              </h1>
              <p className="text-gray-500 text-xs">
                {profile ? (
                  <span className="flex items-center gap-1.5">
                    <EyeOff size={10} className="text-cyan-500" /> Anonymous: {profile.alias}
                    <span className="mx-1">·</span>
                    <span className="capitalize">{profile.profile_type}</span>
                  </span>
                ) : "No profile yet — create one below"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => loadData(user?.email)} className="p-2 text-gray-500 hover:text-gray-300">
              <RefreshCw size={14} />
            </button>
            <button onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 hover:border-cyan-600 text-gray-300 text-xs font-bold transition-all">
              <Edit3 size={12} /> {profile ? "Edit Profile" : "Create Profile"}
            </button>
            <Link to="/ip-marketplace"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold transition-all">
              <Plus size={12} /> New Listing
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Deals" value={activeDeals.length} sub="In pipeline" color="text-cyan-400" icon={Briefcase} />
          <StatCard label="Closed Deals" value={closedDeals.length} sub={`${formatCurrency(totalValue)} total`} color="text-green-400" icon={CheckCircle2} />
          <StatCard label="VDR Sessions" value={vdrActive} sub="Active access grants" color="text-purple-400" icon={FolderOpen} />
          <StatCard label="Commission Due" value={formatCurrency(totalCommission)} sub="5% of closed deals" color="text-yellow-400" icon={Percent} />
        </div>

        {/* No profile banner */}
        {!profile && (
          <div className="bg-blue-950/30 border border-blue-700 rounded-xl p-5 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-blue-300 font-bold text-sm mb-1">Set up your anonymous marketplace profile</p>
              <p className="text-gray-400 text-xs">Create a public alias to appear in the marketplace. Your real identity stays hidden until you sign a mutual NDA with a counterpart.</p>
            </div>
            <button onClick={() => setShowProfileModal(true)}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm transition-all">
              Create Profile
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-1 justify-center ${
                  activeTab === t.id ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
                }`}>
                <Icon size={12} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Pipeline Tab */}
        {activeTab === "pipeline" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-lg">Deal Pipeline</h2>
              <p className="text-gray-500 text-xs">{deals.length} total deals</p>
            </div>

            {deals.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <Briefcase size={40} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-bold mb-2">No deals yet</p>
                <p className="text-gray-600 text-sm mb-5">Submit a LOI on a listing or post your invention to start deal flow.</p>
                <Link to="/ip-marketplace" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-sm transition-all">
                  Browse Marketplace →
                </Link>
              </div>
            ) : (
              <>
                {activeDeals.length > 0 && (
                  <div className="mb-6">
                    <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">Active Deals ({activeDeals.length})</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeDeals.map(d => <DealPipelineCard key={d.id} deal={d} userEmail={user?.email} />)}
                    </div>
                  </div>
                )}
                {closedDeals.length > 0 && (
                  <div>
                    <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">Closed Deals ({closedDeals.length})</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {closedDeals.map(d => <DealPipelineCard key={d.id} deal={d} userEmail={user?.email} />)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* VDR Access Tab */}
        {activeTab === "vdr" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-lg">Virtual Data Room Access</h2>
              <p className="text-gray-500 text-xs">{vdrActive} active sessions</p>
            </div>

            {deals.filter(d => d.vdr_access_granted).length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <FolderOpen size={40} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-bold mb-2">No VDR access yet</p>
                <p className="text-gray-600 text-sm">VDR access is granted when a deal reaches the Due Diligence stage. Submit a LOI to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deals.filter(d => d.vdr_access_granted).map(d => (
                  <div key={d.id} className="bg-gray-900 border border-purple-700/50 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">{d.listing_category}</p>
                        <h3 className="text-white font-black text-base">{d.listing_alias}</h3>
                        <p className="text-purple-400 text-xs mt-0.5 flex items-center gap-1">
                          <CheckCircle2 size={10} /> VDR Access Active
                        </p>
                      </div>
                      <Shield size={20} className="text-purple-400 flex-shrink-0" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Deal Stage</span>
                        <span className="text-white font-bold">{d.deal_stage}</span>
                      </div>
                      {d.nda_signed_at && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">NDA Signed</span>
                          <span className="text-green-400 font-bold">{new Date(d.nda_signed_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Session ID</span>
                        <span className="text-gray-400 font-mono text-xs">{d.vdr_session_id?.slice(0, 12) || "—"}…</span>
                      </div>
                    </div>
                    {d.vdr_session_id && (
                      <Link to={`/vdr/${d.vdr_session_id}`}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-purple-800 hover:bg-purple-700 text-white text-xs font-black transition-all">
                        <FolderOpen size={12} /> Open Data Room
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Commission Tab */}
        {activeTab === "commission" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-lg">Commission Tracker</h2>
              <p className="text-gray-500 text-xs">5% on all closed deals</p>
            </div>

            <div className="bg-yellow-950/20 border border-yellow-700/50 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <Percent size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-300 font-black text-sm mb-1">ZARP Brokerage Commission Model</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    ZARP takes a 5% commission on successfully brokered deals. This covers deal facilitation, anonymous matching, VDR hosting, NDA management, and post-close support. The commission is calculated on the final executed deal value and is due within 30 days of close.
                  </p>
                </div>
              </div>
            </div>

            {closedDeals.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <DollarSign size={40} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-bold mb-2">No closed deals yet</p>
                <p className="text-gray-600 text-sm">Commission becomes due when a deal is marked as Closed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {closedDeals.map(d => {
                  const commission = d.commission_amount || (d.deal_value ? d.deal_value * 0.05 : 0);
                  return (
                    <div key={d.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">{d.listing_category}</p>
                          <h3 className="text-white font-bold text-base">{d.listing_alias}</h3>
                          <p className="text-gray-500 text-xs mt-0.5">
                            Closed: {d.closed_at ? new Date(d.closed_at).toLocaleDateString() : "—"}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-white font-black text-xl">{formatCurrency(d.deal_value)}</p>
                          <p className="text-gray-500 text-xs">Deal value</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-800 mt-4 pt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">5% Commission</p>
                          <p className="text-yellow-400 font-black text-lg">{formatCurrency(commission)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Status</p>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            d.commission_paid
                              ? "bg-green-900/40 text-green-300 border border-green-700"
                              : "bg-orange-900/40 text-orange-300 border border-orange-700"
                          }`}>
                            {d.commission_paid ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {d.commission_paid ? "Paid" : "Pending"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Summary */}
                <div className="bg-gray-900 border border-cyan-700/50 rounded-xl p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Total Deal Value</p>
                      <p className="text-white font-black text-xl">{formatCurrency(totalValue)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Total Commission</p>
                      <p className="text-yellow-400 font-black text-xl">{formatCurrency(totalCommission)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Commission Paid</p>
                      <p className="text-green-400 font-black text-xl">
                        {formatCurrency(closedDeals.filter(d => d.commission_paid).reduce((s, d) => s + (d.commission_amount || d.deal_value * 0.05 || 0), 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-lg">My Anonymous Profile</h2>
              <button onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 hover:border-cyan-600 text-gray-300 text-xs font-bold transition-all">
                <Edit3 size={12} /> {profile ? "Edit" : "Create"}
              </button>
            </div>

            {!profile ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <User size={40} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-bold mb-2">No profile created</p>
                <p className="text-gray-600 text-sm mb-5">Create an anonymous profile to participate in the marketplace.</p>
                <button onClick={() => setShowProfileModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-sm transition-all">
                  <Plus size={14} /> Create Profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-cyan-700/40 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center">
                      <User size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">{profile.alias}</p>
                      <p className="text-cyan-400 text-xs font-bold capitalize">{profile.profile_type}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      {profile.anonymous ? <EyeOff size={12} className="text-cyan-400" /> : <Eye size={12} className="text-yellow-400" />}
                      <span className="text-gray-400">{profile.anonymous ? "Anonymous — identity hidden" : "Identity visible"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {profile.verified ? <CheckCircle2 size={12} className="text-green-400" /> : <Clock size={12} className="text-gray-500" />}
                      <span className="text-gray-400">{profile.verified ? "Identity verified" : "Pending verification"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {profile.nda_on_file ? <Shield size={12} className="text-purple-400" /> : <AlertCircle size={12} className="text-gray-500" />}
                      <span className="text-gray-400">{profile.nda_on_file ? "NDA on file" : "No NDA on file"}</span>
                    </div>
                  </div>

                  {profile.bio && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Bio</p>
                      <p className="text-gray-300 text-sm">{profile.bio}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Deal Stats</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-2xl font-black text-cyan-400">{activeDeals.length}</p>
                        <p className="text-gray-500 text-xs">Active Deals</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-green-400">{closedDeals.length}</p>
                        <p className="text-gray-500 text-xs">Closed Deals</p>
                      </div>
                    </div>
                  </div>

                  {profile.expertise_areas?.length > 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                      <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.expertise_areas.map((a, i) => (
                          <span key={i} className="px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(profile.profile_type === "investor" || profile.profile_type === "both") && profile.investment_range_max > 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                      <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Investment Range</p>
                      <p className="text-white font-bold">
                        {formatCurrency(profile.investment_range_min)} – {formatCurrency(profile.investment_range_max)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showProfileModal && (
        <ProfileSetupModal
          user={user}
          existing={profile}
          onSave={async () => {
            setShowProfileModal(false);
            await loadData(user.email);
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}