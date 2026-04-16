import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, BookOpen, Package, Zap, Shield, Download, ExternalLink, Loader2, CheckCircle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MemberOnboardingChecklist from "@/components/MemberOnboardingChecklist";

const PLAN_CONTENT = {
  "Research Membership ($29/mo)": {
    badge: "🔬 Research Membership",
    color: "#6366f1",
    features: [
      { icon: <Zap size={15} />, label: "AI Invention Forge", path: "/inventor-forge", desc: "Generate novel scalar EM inventions" },
      { icon: <FileText size={15} />, label: "Patent Drafting Tool", path: "/patent-tool", desc: "Unlimited provisional patent generation" },
      { icon: <Shield size={15} />, label: "Prior Art Archive", path: "/prior-art", desc: "200+ documented prior art entries" },
      { icon: <BookOpen size={15} />, label: "Course Catalog", path: "/courses", desc: "Access all research courses" },
      { icon: <Package size={15} />, label: "Invention Library", path: "/invention-library", desc: "Full device documentation library" },
      { icon: <FileText size={15} />, label: "Patent Landscape", path: "/patent-landscape", desc: "Visual IP mapping tool" },
    ],
  },
  "Invention Plans Bundle ($197)": {
    badge: "⚙️ Build Plans Bundle",
    color: "#f59e0b",
    features: [
      { icon: <Download size={15} />, label: "MEG Build Plan", path: "/download-center", desc: "Motionless Electromagnetic Generator — US Patent 6,362,718" },
      { icon: <Download size={15} />, label: "TRD-1 Build Plan", path: "/download-center", desc: "Telomere Regeneration Device — MCCS Protocol" },
      { icon: <Download size={15} />, label: "G-Com Mk I", path: "/download-center", desc: "Scalar Wave Communicator" },
      { icon: <Download size={15} />, label: "Prioré-Class System", path: "/download-center", desc: "EM Treatment System — ONR Validated" },
      { icon: <Download size={15} />, label: "TRZ Cold Fusion Reactor", path: "/download-center", desc: "73-sigma validated replication" },
      { icon: <Package size={15} />, label: "Download Center", path: "/download-center", desc: "All files in one place" },
    ],
  },
  "Complete Course Library ($497)": {
    badge: "📚 Course Library",
    color: "#22c55e",
    features: [
      { icon: <BookOpen size={15} />, label: "Scalar EM Fundamentals", path: "/courses", desc: "Maxwell's original equations & O(3) theory" },
      { icon: <BookOpen size={15} />, label: "MEG Replication Workshop", path: "/courses", desc: "Step-by-step METGLAS core assembly" },
      { icon: <BookOpen size={15} />, label: "Prioré Device Deep Dive", path: "/courses", desc: "ONR R-5-78 full analysis" },
      { icon: <BookOpen size={15} />, label: "USPTO Patent Strategy", path: "/courses", desc: "Frontier tech filing tactics" },
      { icon: <BookOpen size={15} />, label: "Bioelectromagnetics", path: "/courses", desc: "Fröhlich coherence & healing devices" },
      { icon: <BookOpen size={15} />, label: "All 10 Courses", path: "/courses", desc: "Full lifetime access" },
    ],
  },
  "Membership + Plans ($226)": {
    badge: "⭐ Membership + Plans",
    color: "#a855f7",
    features: [
      { icon: <Zap size={15} />, label: "AI Invention Forge", path: "/inventor-forge", desc: "Generate novel scalar EM inventions" },
      { icon: <FileText size={15} />, label: "Patent Drafting Tool", path: "/patent-tool", desc: "Unlimited provisional patent generation" },
      { icon: <Download size={15} />, label: "All 5 Build Plans", path: "/download-center", desc: "MEG, TRD-1, G-Com, Prioré, TRZ" },
      { icon: <BookOpen size={15} />, label: "Course Catalog", path: "/courses", desc: "Full course library access" },
      { icon: <Shield size={15} />, label: "Prior Art Archive", path: "/prior-art", desc: "200+ documented entries" },
      { icon: <Package size={15} />, label: "Download Center", path: "/download-center", desc: "All purchased files" },
    ],
  },
};

const ALL_TOOLS = [
  { icon: <Zap size={16} />, label: "Invention Forge", path: "/inventor-forge", color: "#3b82f6", desc: "AI-powered invention generator" },
  { icon: <FileText size={16} />, label: "Patent Tool", path: "/patent-tool", color: "#f59e0b", desc: "Draft provisional patents" },
  { icon: <Shield size={16} />, label: "Prior Art Archive", path: "/prior-art", color: "#22c55e", desc: "200+ prior art records" },
  { icon: <BookOpen size={16} />, label: "Courses", path: "/courses", color: "#6366f1", desc: "Full course library" },
  { icon: <Package size={16} />, label: "Download Center", path: "/download-center", color: "#f59e0b", desc: "Build plans & docs" },
  { icon: <FileText size={16} />, label: "Patent Landscape", path: "/patent-landscape", color: "#ec4899", desc: "IP visualization" },
  { icon: <Zap size={16} />, label: "Scalar EM Lab", path: "/scalar-lab", color: "#06b6d4", desc: "Interactive simulations" },
  { icon: <Shield size={16} />, label: "Monitoring", path: "/monitoring", color: "#8b5cf6", desc: "Patent threat tracking" },
];

function StatusBadge({ status }) {
  const cfg = {
    converted: { label: "Active", icon: <CheckCircle size={12} />, cls: "text-green-400 bg-green-900/40 border-green-700" },
    invited:   { label: "Invited", icon: <Clock size={12} />, cls: "text-purple-400 bg-purple-900/40 border-purple-700" },
    approved:  { label: "Approved", icon: <Clock size={12} />, cls: "text-blue-400 bg-blue-900/40 border-blue-700" },
    pending:   { label: "Pending", icon: <AlertCircle size={12} />, cls: "text-yellow-400 bg-yellow-900/40 border-yellow-700" },
  }[status] || { label: status, icon: null, cls: "text-gray-400 bg-gray-800 border-gray-700" };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function ContentCard({ item }) {
  return (
    <Link to={item.path}
      className="flex flex-col bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-600 transition-all group">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors flex-shrink-0">
          {item.icon}
        </div>
        <p className="text-white font-bold text-sm leading-tight">{item.label}</p>
      </div>
      <p className="text-gray-500 text-xs leading-relaxed flex-1">{item.desc}</p>
      <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-gray-400 mt-3 transition-colors">
        Open <ChevronRight size={12} />
      </div>
    </Link>
  );
}

export default function MemberPortal() {
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      setUser(me);
      if (me?.email) {
        const apps = await base44.entities.BetaApplication.filter({ email: me.email });
        if (apps.length > 0) setMembership(apps[0]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={28} />
    </div>
  );

  const planContent = membership?.plan_purchased ? PLAN_CONTENT[membership.plan_purchased] : null;
  const isActive = membership?.status === "converted";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            ← Home
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-lg">Member Portal</h1>
            <p className="text-gray-500 text-xs">{user?.full_name || user?.email}</p>
          </div>
        </div>
        <Link to="/account" className="text-gray-500 hover:text-gray-300 text-xs underline">Account Settings</Link>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-6xl mx-auto w-full space-y-8">

        {/* Onboarding checklist (for active members) */}
        {isActive && <MemberOnboardingChecklist />}

        {/* Membership card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-white font-black text-xl">
                  {membership ? (membership.plan_purchased || "Beta Access") : "No Active Membership"}
                </h2>
                {membership && <StatusBadge status={membership.status} />}
              </div>
              <p className="text-gray-500 text-sm">
                {membership
                  ? `Applied ${membership.created_date ? new Date(membership.created_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}`
                  : "You don't have an active membership yet."}
              </p>
              {membership?.converted_at && (
                <p className="text-green-400 text-xs mt-1">
                  ✓ Activated {new Date(membership.converted_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              {membership?.invoice_url && (
                <a
                  href={membership.invoice_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-900/50 border border-indigo-700 text-indigo-300 text-xs font-bold hover:bg-indigo-800/60 transition-all"
                >
                  <FileText size={13} /> Download Invoice {membership.invoice_number && `(${membership.invoice_number})`}
                </a>
              )}
              {!membership && (
                <Link to="/beta-apply"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm transition-all">
                  Apply for Beta Access →
                </Link>
              )}
              {membership && !isActive && (
                <Link to="/pricing"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm transition-all">
                  Upgrade / Purchase →
                </Link>
              )}
            </div>
          </div>

          {/* MRR info */}
          {isActive && membership.mrr_value > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-6 text-xs">
              <div><p className="text-gray-600 mb-0.5">Monthly Rate</p><p className="text-green-400 font-black text-lg">${membership.mrr_value}/mo</p></div>
              <div><p className="text-gray-600 mb-0.5">Status</p><p className="text-white font-bold">Grandfathered Beta Rate</p></div>
              <div><p className="text-gray-600 mb-0.5">NDA</p><p className={membership.nda_signed ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{membership.nda_signed ? "✓ Signed" : "✗ Not Signed"}</p></div>
            </div>
          )}
        </div>

        {/* Purchase history */}
        {membership && (
          <div>
            <h3 className="text-white font-black text-base mb-3">Purchase History</h3>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-4 px-5 py-3 border-b border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span>Product</span><span>Date</span><span>Amount</span><span>Receipt</span>
              </div>
              {isActive ? (
                <div className="grid grid-cols-4 px-5 py-4 items-center text-sm">
                  <span className="text-white font-semibold truncate pr-2">{membership.plan_purchased || "Beta Access"}</span>
                  <span className="text-gray-400 text-xs">{membership.converted_at ? new Date(membership.converted_at).toLocaleDateString() : "—"}</span>
                  <span className="text-green-400 font-bold">{membership.mrr_value > 0 ? `$${membership.mrr_value}/mo` : "One-Time"}</span>
                  <span>
                    {membership.invoice_url ? (
                      <a href={membership.invoice_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-xs font-bold">
                        <FileText size={12} /> {membership.invoice_number || "Invoice"} <ExternalLink size={10} />
                      </a>
                    ) : <span className="text-gray-600 text-xs">—</span>}
                  </span>
                </div>
              ) : (
                <div className="px-5 py-8 text-center text-gray-600 text-sm">No purchases yet.</div>
              )}
            </div>
          </div>
        )}

        {/* Purchased content grid */}
        {isActive && planContent && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-black text-base">Your Content</h3>
              <span className="text-xs px-3 py-1 rounded-full border font-bold" style={{ color: planContent.color, borderColor: planContent.color + "60", backgroundColor: planContent.color + "15" }}>
                {planContent.badge}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
              {planContent.features.map((item, i) => (
                <ContentCard key={i} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* All platform tools (for any member) */}
        {membership && (
          <div>
            <h3 className="text-white font-black text-base mb-3">Platform Tools</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ALL_TOOLS.map((tool, i) => (
                <Link key={i} to={tool.path}
                  className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 flex flex-col gap-2 transition-all group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tool.color + "22", color: tool.color }}>
                    {tool.icon}
                  </div>
                  <p className="text-white font-bold text-xs">{tool.label}</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Not a member CTA */}
        {!membership && (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="text-5xl mb-4">🔬</div>
            <h2 className="text-white font-black text-xl mb-2">Access Zenith Apex Research</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Apply for the closed beta to access invention build plans, AI patent tools, scalar EM simulations, and the full course library.
            </p>
            <Link to="/beta-apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm transition-all">
              Apply for Beta Access <ChevronRight size={16} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}