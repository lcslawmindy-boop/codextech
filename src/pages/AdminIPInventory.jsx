import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Shield, Plus, Search, DollarSign, FileText, Briefcase, Package,
  TrendingUp, AlertTriangle, CheckCircle2, X, Edit3, Trash2,
  Zap, Sparkles, Loader2, Filter, ArrowLeft, Lock, ChevronDown, ChevronUp
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { NEW_INVENTIONS } from "../lib/newInventions";

const TYPE_COLORS = {
  patent: "#3b82f6", trademark: "#a855f7", copyright: "#22c55e", trade_secret: "#f97316",
  know_how: "#06b6d4", design: "#ec4899", software_ip: "#6366f1", algorithm: "#eab308",
  dataset: "#14b8a6", research_method: "#f59e0b", engineering_design: "#ef4444",
  humanitarian_technology: "#10b981", defensive_publication: "#8b5cf6", archived_concept: "#64748b", other: "#94a3b8",
};

const STATUS_COLORS = {
  active: "#22c55e", under_review: "#f59e0b", abandoned: "#ef4444", sold: "#a855f7", archived: "#64748b",
};

const READINESS_ORDER = ["concept", "feasibility", "prototype", "validated", "commercialized"];

const fmtMoney = (n) => {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + "20", border: `1px solid ${color}40` }}>
          {icon}
        </div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

function AssetCard({ asset, onEdit, onDelete, onExpand, expanded }) {
  const typeColor = TYPE_COLORS[asset.asset_type] || "#94a3b8";
  const statusColor = STATUS_COLORS[asset.status] || "#64748b";
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col" style={{ borderTopColor: typeColor, borderTopWidth: 3 }}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: typeColor + "20", color: typeColor, border: `1px solid ${typeColor}40` }}>
              {asset.asset_type?.replace(/_/g, " ")}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: statusColor + "20", color: statusColor, border: `1px solid ${statusColor}40` }}>
              {asset.status?.replace(/_/g, " ")}
            </span>
            {asset.humanitarian_flag && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-800">
                🌐 Humanitarian
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-sm leading-snug">{asset.asset_name}</h3>
        </div>
      </div>

      {/* Description */}
      {asset.description && (
        <p className="text-gray-400 text-xs leading-relaxed mb-3">{asset.description}</p>
      )}

      {/* Problem solved */}
      {asset.problem_solved && (
        <div className="mb-2.5">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">Problem Solved</p>
          <p className="text-gray-300 text-xs leading-relaxed">{asset.problem_solved}</p>
        </div>
      )}

      {/* Target beneficiaries */}
      {asset.target_beneficiaries && (
        <div className="mb-3">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">Who It Helps</p>
          <p className="text-gray-300 text-xs leading-relaxed">{asset.target_beneficiaries}</p>
        </div>
      )}

      {/* Valuation + readiness */}
      <div className="mt-auto grid grid-cols-2 gap-2 pt-3 border-t border-gray-800">
        <div>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">Conservative Val.</p>
          <p className="text-green-400 font-black text-lg leading-tight">{fmtMoney(asset.valuation_low)}</p>
          <p className="text-gray-600 text-[10px]">Range: {fmtMoney(asset.valuation_low)} – {fmtMoney(asset.valuation_high)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">Readiness</p>
          <p className="text-white font-bold text-sm capitalize">{asset.readiness_level?.replace(/_/g, " ")}</p>
          <p className="text-gray-600 text-[10px] capitalize">{asset.filing_status?.replace(/_/g, " ")}</p>
        </div>
      </div>

      {/* Expand for details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
          {asset.jurisdiction && <p className="text-gray-500 text-xs"><span className="font-bold text-gray-400">Jurisdiction:</span> {asset.jurisdiction}</p>}
          {asset.application_number && <p className="text-gray-500 text-xs"><span className="font-bold text-gray-400">App #:</span> {asset.application_number}</p>}
          {asset.ip_strategy && <p className="text-gray-500 text-xs"><span className="font-bold text-gray-400">Strategy:</span> {asset.ip_strategy.replace(/_/g, " ")}</p>}
          {asset.valuation_basis && <p className="text-gray-500 text-xs"><span className="font-bold text-gray-400">Val. Basis:</span> {asset.valuation_basis}</p>}
          {asset.confidential !== undefined && <p className="text-gray-500 text-xs"><span className="font-bold text-gray-400">Confidential:</span> {asset.confidential ? "Yes" : "No"}</p>}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3">
        <button onClick={() => onExpand(asset.id)} className="flex-1 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-colors">
          {expanded ? "Less" : "Details"}
        </button>
        <button onClick={() => onEdit(asset)} className="px-3 py-1.5 rounded-lg bg-blue-950/50 border border-blue-800 text-blue-400 text-xs font-bold hover:bg-blue-900/50 transition-colors">
          <Edit3 size={12} />
        </button>
        <button onClick={() => onDelete(asset)} className="px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-800 text-red-400 text-xs font-bold hover:bg-red-900/50 transition-colors">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  asset_name: "", asset_type: "patent", description: "", problem_solved: "", target_beneficiaries: "",
  jurisdiction: "US", filing_status: "not_filed", application_number: "", filing_date: "",
  valuation_low: "", valuation_high: "", valuation_basis: "",
  ip_strategy: "standard", readiness_level: "concept", humanitarian_flag: false,
  humanitarian_category: "none", confidential: true, review_status: "pending", status: "active",
};

function AssetFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.asset_name) return;
    setSaving(true);
    const payload = { ...form };
    payload.valuation_low = payload.valuation_low ? Number(payload.valuation_low) : null;
    payload.valuation_high = payload.valuation_high ? Number(payload.valuation_high) : null;
    await onSave(payload);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-white font-black text-lg">{initial ? "Edit IP Asset" : "Add IP Asset"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Name + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Asset Name *</label>
              <input value={form.asset_name} onChange={e => set("asset_name", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Vedic Mercury Vortex Scalar Engine" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Asset Type *</label>
              <select value={form.asset_type} onChange={e => set("asset_type", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500">
                {Object.keys(TYPE_COLORS).map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-400 text-xs font-bold mb-1 block">Brief Description (what the asset is)</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="What the asset is and how it works..." />
          </div>

          {/* Problem solved */}
          <div>
            <label className="text-gray-400 text-xs font-bold mb-1 block">Problem Solved</label>
            <textarea value={form.problem_solved} onChange={e => set("problem_solved", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="What problem does this IP solve?" />
          </div>

          {/* Target beneficiaries */}
          <div>
            <label className="text-gray-400 text-xs font-bold mb-1 block">Who It Helps (target beneficiaries)</label>
            <textarea value={form.target_beneficiaries} onChange={e => set("target_beneficiaries", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Who benefits — users, markets, populations..." />
          </div>

          {/* Valuation */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Conservative Val. (Low)</label>
              <input type="number" value={form.valuation_low} onChange={e => set("valuation_low", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="50000" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Optimistic Val. (High)</label>
              <input type="number" value={form.valuation_high} onChange={e => set("valuation_high", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="250000" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Valuation Basis</label>
              <input value={form.valuation_basis} onChange={e => set("valuation_basis", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="cost approach, claim count..." />
            </div>
          </div>

          {/* Status + readiness + strategy */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500">
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Readiness Level</label>
              <select value={form.readiness_level} onChange={e => set("readiness_level", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500">
                {READINESS_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">IP Strategy</label>
              <select value={form.ip_strategy} onChange={e => set("ip_strategy", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500">
                {["defensive", "offensive", "defensive_publication", "trade_secret", "humanitarian_open", "standard"].map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          </div>

          {/* Filing + jurisdiction */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Filing Status</label>
              <select value={form.filing_status} onChange={e => set("filing_status", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500">
                {["not_filed", "provisional_filed", "non_provisional_filed", "granted", "abandoned"].map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Jurisdiction</label>
              <input value={form.jurisdiction} onChange={e => set("jurisdiction", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="US, EP, PCT" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-1 block">Application #</label>
              <input value={form.application_number} onChange={e => set("application_number", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="USPTO app number" />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.humanitarian_flag} onChange={e => set("humanitarian_flag", e.target.checked)} className="rounded" />
              <span className="text-gray-300 text-xs font-bold">Humanitarian Application</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.confidential} onChange={e => set("confidential", e.target.checked)} className="rounded" />
              <span className="text-gray-300 text-xs font-bold">Confidential</span>
            </label>
          </div>
        </div>
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm font-bold hover:bg-gray-700 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.asset_name} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            {initial ? "Save Changes" : "Add Asset"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminIPInventory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const loadAssets = async () => {
    setLoading(true);
    try {
      const page = await base44.entities.IPAsset.list({ sort: "-created_date", limit: 100 });
      setAssets(page.items || []);
    } catch (e) {
      console.error("Failed to load IP assets", e);
    }
    setLoading(false);
  };

  useEffect(() => { loadAssets(); }, []);

  const filtered = useMemo(() => {
    return assets.filter(a => {
      if (typeFilter !== "all" && a.asset_type !== typeFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [a.asset_name, a.description, a.problem_solved, a.target_beneficiaries].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [assets, search, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = assets.length;
    const totalLow = assets.reduce((s, a) => s + (a.valuation_low || 0), 0);
    const totalHigh = assets.reduce((s, a) => s + (a.valuation_high || 0), 0);
    const active = assets.filter(a => a.status === "active").length;
    const humanitarian = assets.filter(a => a.humanitarian_flag).length;
    const byType = {};
    assets.forEach(a => { byType[a.asset_type] = (byType[a.asset_type] || 0) + 1; });
    return { total, totalLow, totalHigh, active, humanitarian, byType };
  }, [assets]);

  const handleSave = async (payload) => {
    try {
      if (editingAsset?.id) {
        await base44.entities.IPAsset.update(editingAsset.id, payload);
      } else {
        await base44.entities.IPAsset.create(payload);
      }
      setShowForm(false);
      setEditingAsset(null);
      await loadAssets();
    } catch (e) {
      console.error("Save failed", e);
      alert("Failed to save: " + (e.message || "unknown error"));
    }
  };

  const handleDelete = async (asset) => {
    if (!confirm(`Delete "${asset.asset_name}"? This cannot be undone.`)) return;
    try {
      await base44.entities.IPAsset.delete(asset.id);
      await loadAssets();
    } catch (e) {
      alert("Delete failed: " + (e.message || "unknown error"));
    }
  };

  const handleSeed = async () => {
    if (!confirm(`Create IPAsset records from ${NEW_INVENTIONS.length} inventions? This adds ${NEW_INVENTIONS.length} assets to the repository.`)) return;
    setSeeding(true);
    setSeedMsg("Generating IP assets from invention library...");
    try {
      const records = NEW_INVENTIONS.map(inv => {
        const claimsCount = inv.patentClaims?.length || 1;
        const isHumanitarian = inv.tags?.some(t => /conscious|healing|therapy|detox|longevity|wellness|water|safety/i.test(t));
        const valLow = 50000 + claimsCount * 25000;
        const valHigh = 50000 + claimsCount * 100000;
        return {
          asset_name: inv.name,
          asset_type: "patent",
          description: inv.mechanism?.slice(0, 500) || inv.fusion,
          problem_solved: inv.market?.split(".")[0] + "." || "Addresses an unmet need in " + inv.category,
          target_beneficiaries: inv.market || inv.category,
          jurisdiction: "US",
          filing_status: "not_filed",
          valuation_low: valLow,
          valuation_high: valHigh,
          valuation_basis: `Cost approach — ${claimsCount} patent claim(s) × $25K conservative floor`,
          ip_strategy: isHumanitarian ? "humanitarian_open" : "standard",
          readiness_level: inv.buildPlan?.toLowerCase().includes("phase 3") ? "validated" : inv.buildPlan?.toLowerCase().includes("phase 2") ? "prototype" : "concept",
          humanitarian_flag: isHumanitarian,
          humanitarian_category: isHumanitarian ? "assistive_technology" : "none",
          confidential: true,
          review_status: "pending",
          status: "active",
        };
      });
      await base44.entities.IPAsset.bulkCreate(records);
      setSeedMsg(`Created ${records.length} IP assets from invention library.`);
      await loadAssets();
      setTimeout(() => setSeedMsg(""), 4000);
    } catch (e) {
      setSeedMsg("Seed failed: " + (e.message || "unknown error"));
      console.error(e);
    }
    setSeeding(false);
  };

  const typeOptions = [...new Set(assets.map(a => a.asset_type).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Admin
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-700 flex items-center justify-center">
              <Briefcase size={20} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg leading-none">IP Asset Inventory Repository</h1>
              <p className="text-gray-500 text-xs mt-0.5">Conservative valuation · problem · beneficiaries · admin only</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-red-950/50 border border-red-800 text-red-400 font-bold flex items-center gap-1">
              <Lock size={11} /> ADMIN ONLY
            </span>
            <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-bold transition-all disabled:opacity-50">
              {seeding ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {seeding ? "Seeding..." : "Seed from Inventions"}
            </button>
            <button onClick={() => { setEditingAsset(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold transition-all">
              <Plus size={14} /> Add Asset
            </button>
          </div>
        </div>
      </div>

      {seedMsg && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-purple-950/40 border border-purple-800 rounded-xl px-4 py-2 text-purple-300 text-sm font-semibold">
            {seedMsg}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard icon={<Package size={16} className="text-blue-400" />} label="Total Assets" value={stats.total} sub={`${stats.active} active`} color="#3b82f6" />
          <StatCard icon={<DollarSign size={16} className="text-green-400" />} label="Conservative Val." value={fmtMoney(stats.totalLow)} sub={`Range to ${fmtMoney(stats.totalHigh)}`} color="#22c55e" />
          <StatCard icon={<TrendingUp size={16} className="text-amber-400" />} label="Asset Types" value={Object.keys(stats.byType).length} sub="distinct categories" color="#f59e0b" />
          <StatCard icon={<Shield size={16} className="text-purple-400" />} label="Humanitarian" value={stats.humanitarian} sub="open-access flagged" color="#a855f7" />
          <StatCard icon={<FileText size={16} className="text-cyan-400" />} label="Showing" value={filtered.length} sub={`of ${stats.total} total`} color="#06b6d4" />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets, problems, beneficiaries..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-gray-600" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-gray-600">
            <option value="all">All Types</option>
            {typeOptions.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-gray-600">
            <option value="all">All Statuses</option>
            {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-gray-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package size={40} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-bold text-sm mb-2">{assets.length === 0 ? "No IP assets yet" : "No matches found"}</p>
            <p className="text-gray-600 text-xs mb-6">{assets.length === 0 ? "Seed from your invention library or add manually." : "Try adjusting your search or filters."}</p>
            {assets.length === 0 && (
              <div className="flex items-center justify-center gap-3">
                <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-sm font-bold transition-all disabled:opacity-50">
                  <Sparkles size={14} /> Seed from 50 Inventions
                </button>
                <button onClick={() => { setEditingAsset(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold transition-all">
                  <Plus size={14} /> Add Manually
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                expanded={expandedId === asset.id}
                onExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                onEdit={(a) => { setEditingAsset(a); setShowForm(true); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="max-w-7xl mx-auto px-6 pb-10">
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl px-5 py-3">
          <p className="text-amber-200/70 text-xs leading-relaxed">
            <strong className="text-amber-300">Conservative Valuation Notice:</strong> All valuations are advisory estimates based on claimed patent count and cost approach. They do not represent guaranteed market value or appraised worth. Independent IP valuation is required before any transaction, licensing, or disclosure. Research-use-only assets — not for sale.
          </p>
        </div>
      </div>

      {showForm && (
        <AssetFormModal
          initial={editingAsset}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingAsset(null); }}
        />
      )}
    </div>
  );
}