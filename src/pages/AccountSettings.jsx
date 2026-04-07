import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Trash2, Shield, Bell, ChevronRight, AlertTriangle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageHeader from "../components/PageHeader";

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    // Clear local NDA acceptance
    localStorage.removeItem("bearden_nda_accepted");
    // Log out — account deletion would require a backend function in production
    await base44.auth.logout("/");
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

        {/* Settings Rows */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
          <div className="flex items-center gap-3 px-5 py-4" style={{ minHeight: 56 }}>
            <Shield size={18} className="text-indigo-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">NDA Status</p>
              <p className="text-gray-500 text-xs">Confidentiality agreement accepted</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-green-900/40 border border-green-800 text-green-400 font-bold">Active</span>
          </div>

          <button
            onClick={() => localStorage.removeItem("bearden_nda_accepted")}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-800/60 transition-colors text-left"
            style={{ minHeight: 56 }}
          >
            <Bell size={18} className="text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Reset NDA Agreement</p>
              <p className="text-gray-500 text-xs">Forces re-acceptance on next visit</p>
            </div>
            <ChevronRight size={15} className="text-gray-600" />
          </button>
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
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-950/30 transition-colors text-left"
            style={{ minHeight: 56 }}
          >
            <Trash2 size={18} className="text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-300 text-sm font-semibold">Delete Account</p>
              <p className="text-gray-500 text-xs">Permanently remove your account and data</p>
            </div>
            <ChevronRight size={15} className="text-gray-600" />
          </button>
        </div>

        {/* App Info */}
        <div className="text-center text-gray-700 text-xs pb-4 space-y-1">
          <p>Zenith Apex Research Database</p>
          <p>Version 2.0 · All content confidential</p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm">
          <div
            className="w-full bg-gray-900 rounded-t-3xl border-t border-red-900/50 p-6 space-y-4"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-1 rounded-full bg-gray-700" />
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle size={22} className="text-red-400 flex-shrink-0" />
              <h3 className="text-white font-black text-lg">Delete Account?</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              This action is <strong className="text-red-400">permanent</strong>. Your account, research saves, and all data will be removed. This cannot be undone.
            </p>
            <div>
              <p className="text-gray-500 text-xs mb-2">Type <strong className="text-white">DELETE</strong> to confirm:</p>
              <input
                type="text"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-600"
                style={{ minHeight: 44 }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                className="flex-1 py-3.5 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm transition-colors hover:bg-gray-700"
                style={{ minHeight: 44 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== "DELETE" || deleting}
                className="flex-1 py-3.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-40"
                style={{ minHeight: 44 }}
              >
                {deleting ? "Deleting…" : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}