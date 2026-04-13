import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Search, Loader2, AlertCircle, RefreshCw, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  color: "#f59e0b", bg: "bg-yellow-900/30 border-yellow-700 text-yellow-300" },
  shipped:  { label: "Shipped",  color: "#22c55e", bg: "bg-green-900/30 border-green-700 text-green-300" },
  cancelled:{ label: "Cancelled",color: "#ef4444", bg: "bg-red-900/30 border-red-700 text-red-300" },
};

const CARRIERS = ["USPS", "UPS", "FedEx", "DHL", "Other"];

function fmt(amount) {
  return amount ? `$${Number(amount).toFixed(2)}` : "—";
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function OrderRow({ order, onShipped }) {
  const [expanded, setExpanded] = useState(false);
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier] = useState("USPS");
  const [shipping, setShipping] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const handleShip = async () => {
    if (!tracking.trim()) { setError("Enter a tracking number."); return; }
    setShipping(true);
    setError("");
    const res = await base44.functions.invoke("markOrderShipped", {
      orderId: order.id,
      trackingNumber: tracking.trim(),
      carrier,
    });
    if (res.data?.success) {
      setDone(true);
      onShipped(order.id, tracking.trim(), carrier);
    } else {
      setError(res.data?.error || "Failed to mark shipped.");
    }
    setShipping(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Row summary */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800/40 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-white font-bold text-sm truncate">{order.product_name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${status.bg}`}>{status.label}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span>📧 {order.customer_email}</span>
            <span>💵 {fmt(order.amount)}</span>
            <span>🕐 {fmtDate(order.created_date)}</span>
            {order.tracking_number && <span className="text-green-400">📦 {order.tracking_number}</span>}
          </div>
        </div>
        <span className="text-gray-600 text-xs">{expanded ? "▴" : "▾"}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-800 px-4 py-4 space-y-4">
          {/* Customer & shipping address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Customer</p>
              <p className="text-white text-sm">{order.customer_name || "—"}</p>
              <p className="text-gray-400 text-xs">{order.customer_email}</p>
            </div>
            {order.shipping_address_line1 && (
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Ship To</p>
                <p className="text-white text-xs leading-relaxed">
                  {order.shipping_name}<br />
                  {order.shipping_address_line1}{order.shipping_address_line2 ? `, ${order.shipping_address_line2}` : ""}<br />
                  {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}<br />
                  {order.shipping_country}
                </p>
              </div>
            )}
          </div>

          {/* Stripe IDs */}
          <div className="text-xs text-gray-700 space-y-0.5">
            <p>Session: <span className="font-mono text-gray-500">{order.stripe_session_id}</span></p>
            {order.stripe_payment_intent && <p>Payment: <span className="font-mono text-gray-500">{order.stripe_payment_intent}</span></p>}
            {order.shipped_at && <p>Shipped: <span className="text-gray-500">{fmtDate(order.shipped_at)}</span></p>}
          </div>

          {/* Already shipped */}
          {order.status === "shipped" && !done && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-950/30 border border-green-800 rounded-xl px-4 py-3">
              <CheckCircle size={15} />
              <span>Shipped via <strong>{order.carrier}</strong> · Tracking: <strong>{order.tracking_number}</strong> · Email sent ✓</span>
            </div>
          )}

          {done && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-950/30 border border-green-800 rounded-xl px-4 py-3">
              <CheckCircle size={15} /> Marked shipped & customer notified by email!
            </div>
          )}

          {/* Ship form — only for pending */}
          {order.status === "pending" && !done && (
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-3">
              <p className="text-white text-sm font-bold flex items-center gap-2"><Truck size={14} className="text-yellow-400" /> Mark as Shipped</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Carrier</label>
                  <select value={carrier} onChange={e => setCarrier(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-600">
                    {CARRIERS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-gray-500 text-xs mb-1 block">Tracking Number</label>
                  <input
                    value={tracking}
                    onChange={e => setTracking(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleShip()}
                    placeholder="e.g. 9400111899223456789012"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-yellow-600"
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={11} /> {error}</p>
              )}
              <button
                onClick={handleShip}
                disabled={shipping}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm disabled:opacity-60 transition-all"
              >
                {shipping ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                {shipping ? "Sending…" : "Mark Shipped & Email Customer"}
              </button>
              <p className="text-gray-600 text-xs">Customer will receive an automated tracking email immediately.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminShopOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const data = await base44.entities.ShopOrder.list("-created_date", 200);
    setOrders(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const handleShipped = (orderId, trackingNumber, carrier) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: "shipped", tracking_number: trackingNumber, carrier } : o
    ));
  };

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.customer_email?.toLowerCase().includes(q) || o.product_name?.toLowerCase().includes(q) || o.tracking_number?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    shipped: orders.filter(o => o.status === "shipped").length,
  };

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.amount || 0), 0);

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Admin
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base flex items-center gap-2">
              <Package size={15} className="text-yellow-400" /> Shop Orders
            </h1>
            <p className="text-gray-500 text-xs">{counts.pending} pending · {counts.shipped} shipped · ${totalRevenue.toFixed(2)} total</p>
          </div>
        </div>
        <button onClick={load} disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold disabled:opacity-60 transition-all">
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 max-w-5xl mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gray-900 border border-yellow-800/40 rounded-xl p-4 text-center">
            <p className="text-yellow-400 font-black text-2xl">{counts.pending}</p>
            <p className="text-gray-500 text-xs mt-0.5">Pending</p>
          </div>
          <div className="bg-gray-900 border border-green-800/40 rounded-xl p-4 text-center">
            <p className="text-green-400 font-black text-2xl">{counts.shipped}</p>
            <p className="text-gray-500 text-xs mt-0.5">Shipped</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-white font-black text-2xl">${totalRevenue.toFixed(0)}</p>
            <p className="text-gray-500 text-xs mt-0.5">Total Revenue</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search email, product, tracking…"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-8 pr-4 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div className="flex gap-1.5">
            {["all", "pending", "shipped"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                  statusFilter === s ? "bg-yellow-900/40 border-yellow-700 text-yellow-300" : "border-gray-700 text-gray-500 hover:border-gray-500"
                }`}>
                {s} ({counts[s] ?? orders.length})
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-yellow-400" size={28} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package size={36} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{orders.length === 0 ? "No orders yet — they'll appear here after checkout." : "No orders match your filters."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => (
              <OrderRow key={order.id} order={order} onShipped={handleShipped} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}