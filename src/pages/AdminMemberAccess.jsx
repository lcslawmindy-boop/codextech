import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Users, Check, X, Search, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { TIERS, TIER_ORDER } from "@/lib/tiers";

const TIER_FEATURES = [
  { key: "builds", label: "Build Plans", getValue: (tier) => {
    const t = TIERS[tier];
    return t ? (t.inventionsAllowed >= 999 ? "Unlimited" : `${t.inventionsAllowed} builds`) : "—";
  }},
  { key: "courses", label: "Courses", getValue: (tier) => {
    const t = TIERS[tier];
    return t ? (t.coursesAllowed >= 999 ? "Unlimited" : `${t.coursesAllowed} courses`) : "—";
  }},
  { key: "aiTools", label: "AI Tools", getValue: (tier) => TIERS[tier]?.aiTools },
  { key: "patentTools", label: "Patent Tools", getValue: (tier) => TIERS[tier]?.patentTools },
  { key: "investorTools", label: "Investor Toolkit", getValue: (tier) => TIERS[tier]?.investorTools },
  { key: "govAccess", label: "Classified / Defense Systems", getValue: (tier) => TIERS[tier]?.govAccess },
];

const PRICING_TIERS = [
  { id: "starter", name: "Starter", price: "$49/mo", color: "#06b6d4" },
  { id: "pro", name: "Pro", price: "$99/mo", color: "#8b5cf6" },
  { id: "elite", name: "Elite", price: "$149/mo", color: "#f59e0b" },
];

const PLAN_ACCESS = {
  starter: {
    builds: "5 builds",
    courses: "10 courses",
    videoGuides: false,
    supplierLinks: false,
    aiPatentTool: "Basic",
    ftoAnalysis: false,
    priorArt: "50 entries",
    privateForum: false,
    discount: "20% off kits",
    restrictedSystems: false,
    monthlyStrategy: false,
  },
  pro: {
    builds: "10 builds",
    courses: "20 courses",
    videoGuides: true,
    supplierLinks: true,
    aiPatentTool: "Full Suite",
    ftoAnalysis: true,
    priorArt: "100+ entries",
    privateForum: true,
    discount: "50% off kits",
    restrictedSystems: false,
    monthlyStrategy: false,
  },
  elite: {
    builds: "Unlimited (40+)",
    courses: "Unlimited (40+)",
    videoGuides: true,
    supplierLinks: true,
    aiPatentTool: "Full Suite",
    ftoAnalysis: true,
    priorArt: "200+ entries",
    privateForum: true,
    discount: "60% off kits",
    restrictedSystems: true,
    monthlyStrategy: true,
  },
};

const ACCESS_ROWS = [
  { key: "builds", label: "Build Plans" },
  { key: "courses", label: "Courses" },
  { key: "videoGuides", label: "Video Assembly Guides" },
  { key: "supplierLinks", label: "Supplier Links & Pricing" },
  { key: "aiPatentTool", label: "AI Patent Tool" },
  { key: "ftoAnalysis", label: "FTO Analysis" },
  { key: "priorArt", label: "Prior Art Archive" },
  { key: "privateForum", label: "Private Community Forum" },
  { key: "discount", label: "Hardware Kit Discount" },
  { key: "restrictedSystems", label: "Restricted / Defense Systems" },
  { key: "monthlyStrategy", label: "Monthly Strategy Session" },
];

function AccessCell({ value }) {
  if (typeof value === "boolean") {
    return value
      ? <Check size={16} className="text-green-400 mx-auto" />
      : <X size={16} className="text-gray-600 mx-auto" />;
  }
  return <span className="text-xs text-gray-300 font-medium">{value}</span>;
}

function MemberRow({ member, expanded, onToggle }) {
  const plan = member.plan_purchased || member.tier || "free";
  const tierColor = TIERS[plan]?.color || "#6b7280";
  const planObj = TIERS[plan];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-gray-800/40 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-sm font-black text-white flex-shrink-0">
          {(member.name || member.email || "?")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{member.name || member.full_name || "Unknown"}</p>
          <p className="text-gray-500 text-xs truncate">{member.email || member.contact_email || "—"}</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0"
          style={{ backgroundColor: tierColor + "20", color: tierColor, border: `1px solid ${tierColor}40` }}>
          {planObj?.name || plan}
        </span>
        {expanded ? <ChevronUp size={14} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-800 px-4 pb-4 pt-3">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Access Breakdown</p>
          <div className="grid grid-cols-2 gap-2">
            {TIER_FEATURES.map((feature) => {
              const val = feature.getValue(plan);
              return (
                <div key={feature.key} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-400">{feature.label}</span>
                  {typeof val === "boolean"
                    ? (val ? <Check size={13} className="text-green-400" /> : <X size={13} className="text-gray-600" />)
                    : <span className="text-xs font-bold text-white">{val}</span>}
                </div>
              );
            })}
          </div>
          {member.email && (
            <div className="mt-3 pt-3 border-t border-gray-800 flex gap-2">
              <span className="text-xs text-gray-600">Joined:</span>
              <span className="text-xs text-gray-400">{member.created_date ? new Date(member.created_date).toLocaleDateString() : "—"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminMemberAccess() {
  const [members, setMembers] = useState([]);
  const [ndaSigners, setNdaSigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("matrix"); // matrix | members

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [betas, ndas] = await Promise.all([
          base44.entities.BetaApplication.list("-created_date", 200),
          base44.entities.NDASignature.list("-signed_at", 200),
        ]);
        setMembers(betas || []);
        setNdaSigners(ndas || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return !q || (m.email || "").toLowerCase().includes(q) || (m.name || "").toLowerCase().includes(q);
  });

  const byTier = TIER_ORDER.reduce((acc, t) => {
    acc[t] = filtered.filter(m => (m.plan_purchased || m.tier || "free") === t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Admin
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <Users size={18} className="text-blue-400" />
            <h1 className="text-white font-black text-lg">Member Access Viewer</h1>
          </div>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 transition-colors">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Tabs */}
        <div className="flex gap-2">
          {[{ id: "matrix", label: "Access Matrix" }, { id: "members", label: "Member List" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === tab.id ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "matrix" && (
          <div>
            <h2 className="text-white font-black text-xl mb-2">Plan Access Matrix</h2>
            <p className="text-gray-500 text-sm mb-6">What each membership tier includes at a glance.</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-2xl font-black text-blue-400">{members.length}</p>
                <p className="text-gray-500 text-xs mt-0.5">Total Members</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-2xl font-black text-green-400">{ndaSigners.length}</p>
                <p className="text-gray-500 text-xs mt-0.5">NDA Signatures</p>
              </div>
              {TIER_ORDER.filter(t => t !== "free").slice(0, 2).map(t => (
                <div key={t} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-2xl font-black" style={{ color: TIERS[t]?.color }}>{byTier[t]?.length || 0}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{TIERS[t]?.name} Members</p>
                </div>
              ))}
            </div>

            {/* Matrix table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-800">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-gray-900 border-b border-gray-800">
                    <th className="text-left text-gray-500 text-xs font-bold uppercase py-4 px-5 w-48">Feature</th>
                    {PRICING_TIERS.map(t => (
                      <th key={t.id} className="text-center py-4 px-4 font-black" style={{ color: t.color }}>
                        <div>{t.name}</div>
                        <div className="text-xs font-normal text-gray-500 mt-0.5">{t.price}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {ACCESS_ROWS.map((row, i) => (
                    <tr key={row.key} className={i % 2 === 0 ? "bg-gray-900/30" : "bg-gray-900/10"}>
                      <td className="py-3 px-5 text-gray-300 text-xs font-medium">{row.label}</td>
                      {PRICING_TIERS.map(t => (
                        <td key={t.id} className="py-3 px-4 text-center">
                          <AccessCell value={PLAN_ACCESS[t.id][row.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <span className="text-gray-500 text-sm">{filtered.length} members</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-8">
                {TIER_ORDER.map(tier => {
                  const list = byTier[tier] || [];
                  if (!list.length) return null;
                  const t = TIERS[tier];
                  return (
                    <div key={tier}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t?.color }} />
                        <h3 className="font-bold text-sm text-white">{t?.name}</h3>
                        <span className="text-gray-600 text-xs">({list.length})</span>
                      </div>
                      <div className="space-y-2">
                        {list.map((m, i) => (
                          <MemberRow key={m.id || i} member={m}
                            expanded={expanded === (m.id || i)}
                            onToggle={() => setExpanded(expanded === (m.id || i) ? null : (m.id || i))} />
                        ))}
                      </div>
                    </div>
                  );
                })}
                {!filtered.length && (
                  <div className="text-center py-16 text-gray-600">
                    <Users size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No members found</p>
                  </div>
                )}
              </div>
            )}

            {/* NDA Signers section */}
            <div className="mt-10">
              <h3 className="font-black text-white text-lg mb-4">NDA Signatures ({ndaSigners.length})</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-xs min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-900 border-b border-gray-800">
                      <th className="text-left text-gray-500 font-bold uppercase py-3 px-4">Name</th>
                      <th className="text-left text-gray-500 font-bold uppercase py-3 px-4">Email</th>
                      <th className="text-left text-gray-500 font-bold uppercase py-3 px-4">Organization</th>
                      <th className="text-left text-gray-500 font-bold uppercase py-3 px-4">Signed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {ndaSigners.map((s, i) => (
                      <tr key={s.id || i} className="hover:bg-gray-900/40 transition-colors">
                        <td className="py-2.5 px-4 text-white font-medium">{s.full_name || "—"}</td>
                        <td className="py-2.5 px-4 text-gray-400">{s.email || "—"}</td>
                        <td className="py-2.5 px-4 text-gray-500">{s.company || "—"}</td>
                        <td className="py-2.5 px-4 text-gray-500">{s.signed_at ? new Date(s.signed_at).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                    {!ndaSigners.length && (
                      <tr><td colSpan={4} className="py-8 text-center text-gray-600">No NDA signatures yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}