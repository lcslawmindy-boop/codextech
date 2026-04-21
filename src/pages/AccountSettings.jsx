import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Trash2, Shield, Bell, ChevronRight, AlertTriangle, Loader2, Package, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "../components/PageHeader";

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => { setUser(u); setLoading(false); });
  }, []);

  const handleLogout = () => {
    base44.auth.logout("/");
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

        </div>

        {/* App Info */}
        <div className="text-center text-gray-700 text-xs pb-4 space-y-1">
          <p>Zenith Apex Research Database</p>
          <p>Version 2.0 · All content confidential</p>
        </div>
      </div>

    </div>
  );
}