import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Trash2, Shield, ChevronRight, AlertTriangle, Loader2, Package, Zap, RefreshCw, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "../components/PageHeader";

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [managingBilling, setManagingBilling] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => { setUser(u); setLoading(false); });
  }, []);

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    try {
      // Sign out — actual account deletion must be handled via support
      // per App Store guidelines we must provide a way to request deletion
      await base44.integrations.Core.SendEmail({
        to: "support@zenithapex.com",
        subject: `Account Deletion Request — ${user?.email}`,
        body: `User ${user?.full_name} (${user?.email}) has requested account deletion from the app.`,
      });
      alert("Your deletion request has been submitted. You will receive confirmation within 48 hours.");
      base44.auth.logout("/");
    } catch (e) {
      alert("Error submitting request: " + e.message);
    }
    setDeleting(false);
    setDeleteConfirm(false);
  };

  const handleManageBilling = async () => {
    if (window.self !== window.top) {
      alert("Billing management only works from the published app.");
      return;
    }
    setManagingBilling(true);
    try {
      const res = await base44.functions.invoke("createCustomerPortalSession", {
        returnUrl: window.location.href,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        alert(res.data?.error || "Could not open billing portal. No active subscription found.");
      }
    } catch (e) {
      alert("Error opening billing portal: " + e.message);
    }
    setManagingBilling(false);
  };

  const handleRestoreAccess = async () => {
    setRestoring(true);
    try {
      const res = await base44.functions.invoke("restoreAccess", {});
      if (res.data.success && res.data.status === 'active') {
        alert("Access restored successfully.");
        window.location.reload();
      } else {
        alert("No active payment or subscription found.");
      }
    } catch (e) {
      alert("Error restoring access: " + e.message);
    }
    setRestoring(false);
  };



  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={28} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <PageHeader title="Account Settings" backTo="/" />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 max-w-2xl mx-auto w-full">

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-yellow-900/40 border border-yellow-700 flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-yellow-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-base truncate">{user?.full_name || "Researcher"}</p>
              <p className="text-gray-400 text-sm truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-yellow-900/40 border border-yellow-800 text-yellow-400 text-xs font-bold capitalize">
                {user?.role || "user"}
              </span>
            </div>
          </div>
        </div>

        {/* Member Dashboard Link - Prominent */}
        <Link to="/member-dashboard" className="flex items-center gap-3 px-5 py-5 bg-gradient-to-r from-cyan-900/40 to-cyan-900/20 border-2 border-cyan-500/60 rounded-2xl hover:border-cyan-400 hover:from-cyan-900/50 transition-all shadow-lg shadow-cyan-900/20" style={{ minHeight: 70 }}>
          <div className="w-12 h-12 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
            <Zap size={24} className="text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-base font-black">My Content & Build Plans</p>
            <p className="text-cyan-300 text-xs font-semibold">Access your unlocked inventions, courses & downloads</p>
          </div>
          <ChevronRight size={18} className="text-cyan-400" />
        </Link>

        {/* Member Portal Link */}
        <Link to="/member-portal" className="flex items-center gap-3 px-5 py-4 bg-gray-900 border border-yellow-900/40 rounded-2xl hover:bg-gray-800/60 transition-colors" style={{ minHeight: 64 }}>
          <Package size={20} className="text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-white text-sm font-bold">Member Portal</p>
            <p className="text-gray-500 text-xs">View membership, purchases, invoices & access your content</p>
          </div>
          <ChevronRight size={15} className="text-gray-600" />
        </Link>

        {/* Access & Billing */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
          <button
            onClick={handleManageBilling}
            disabled={managingBilling}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-800/60 transition-colors text-left disabled:opacity-50"
            style={{ minHeight: 56 }}
          >
            {managingBilling ? <Loader2 size={18} className="text-green-400 animate-spin flex-shrink-0" /> : <CreditCard size={18} className="text-green-400 flex-shrink-0" />}
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Manage Subscription</p>
              <p className="text-gray-500 text-xs">Update plan, cancel, or view invoices via Stripe</p>
            </div>
            <ChevronRight size={15} className="text-gray-600" />
          </button>

          <button
            onClick={handleRestoreAccess}
            disabled={restoring}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-800/60 transition-colors text-left disabled:opacity-50"
            style={{ minHeight: 56 }}
          >
            {restoring ? <Loader2 size={18} className="text-cyan-400 animate-spin flex-shrink-0" /> : <RefreshCw size={18} className="text-cyan-400 flex-shrink-0" />}
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Restore Access</p>
              <p className="text-gray-500 text-xs">Re-check Stripe for active subscriptions</p>
            </div>
            <ChevronRight size={15} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-3 px-5 py-4" style={{ minHeight: 56 }}>
            <Shield size={18} className="text-indigo-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Stripe Status</p>
              <p className="text-gray-500 text-xs">{user?.subscription_status === 'active' ? 'Active subscription' : 'No active subscription'}</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-900 border border-red-900/40 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-red-900/30">
            <p className="text-red-400 text-xs font-black uppercase tracking-widest">Danger Zone</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-800/60 transition-colors text-left border-b border-gray-800"
            style={{ minHeight: 56 }}
          >
            <LogOut size={18} className="text-orange-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Sign Out</p>
              <p className="text-gray-500 text-xs">You will be redirected to login</p>
            </div>
            <ChevronRight size={15} className="text-gray-600" />
          </button>

          <button
            onClick={() => setDeleteConfirm(true)}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-950/30 transition-colors text-left"
            style={{ minHeight: 56 }}
          >
            <Trash2 size={18} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 text-sm font-semibold">Delete Account</p>
              <p className="text-gray-500 text-xs">Request permanent account deletion</p>
            </div>
          </button>
        </div>

        {/* Delete confirmation — bottom sheet for thumb-reachability on mobile */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-end"
            onClick={(e) => { if (e.target === e.currentTarget) { setDeleteConfirm(false); setDeleteInput(""); } }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }} />
            <div
              className="relative w-full bg-gray-900 border-t border-red-900/60 rounded-t-3xl z-10 px-5 pt-3 pb-8 shadow-2xl"
              style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
            >
              {/* Handle */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-gray-700" />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
                <h3 className="text-white font-black text-base">Delete Account</h3>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                This will permanently remove your account and <span className="text-white font-semibold">all associated data</span>, including:
              </p>
              <ul className="text-gray-500 text-xs space-y-1 mb-4 pl-3">
                <li>• Your profile and login credentials</li>
                <li>• All saved research, build plans, and course progress</li>
                <li>• Favorites, notes, and CRM data</li>
                <li>• Subscription and billing records</li>
              </ul>
              <p className="text-red-400 text-xs font-semibold mb-4">This action cannot be undone. A request will be sent to our team for processing within 48 hours.</p>

              <p className="text-gray-500 text-xs mb-2">Type <span className="text-red-400 font-mono font-bold">DELETE</span> to confirm:</p>
              <input
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                autoCapitalize="none"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-mono focus:outline-none focus:border-red-600 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }}
                  className="flex-1 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== "DELETE" || deleting}
                  className="flex-1 py-3.5 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  {deleting ? "Submitting…" : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* App Info */}
        <div className="text-center text-gray-700 text-xs pb-4 space-y-1">
          <p>Zenith Apex Research Database</p>
          <p>Version 2.0 · All content confidential</p>
        </div>
      </div>

    </div>
  );
}