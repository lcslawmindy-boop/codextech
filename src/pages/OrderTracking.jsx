import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowLeft } from "lucide-react";

const STATUS_COLORS = {
  pending: { bg: "bg-yellow-950/30", border: "border-yellow-800", icon: Clock, text: "Pending", color: "text-yellow-400" },
  processing: { bg: "bg-blue-950/30", border: "border-blue-800", icon: Package, text: "Processing", color: "text-blue-400" },
  shipped: { bg: "bg-purple-950/30", border: "border-purple-800", icon: Truck, text: "Shipped", color: "text-purple-400" },
  delivered: { bg: "bg-green-950/30", border: "border-green-800", icon: CheckCircle2, text: "Delivered", color: "text-green-400" },
  cancelled: { bg: "bg-red-950/30", border: "border-red-800", icon: AlertCircle, text: "Cancelled", color: "text-red-400" },
};

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const email = sessionStorage.getItem("user_email") || localStorage.getItem("user_email");
    setUserEmail(email);

    if (email) {
      base44.entities.Order.filter({ customer_email: email }, "-ordered_at", 50)
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/member-dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-2xl">Order Tracking</h1>
            <p className="text-gray-500 text-xs">Monitor your component kit shipments</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-4xl mx-auto mb-4">
              📦
            </div>
            <h2 className="text-white font-black text-xl mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">
              You haven't ordered any component kits yet. Browse inventions to get started.
            </p>
            <Link
              to="/invention-plans"
              className="inline-block px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
            >
              Shop Component Kits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const Icon = status.icon;

              return (
                <div
                  key={order.id}
                  className={`border rounded-2xl p-6 transition-all ${status.bg} ${status.border} border`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-800/50">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${status.bg}`}
                      >
                        <Icon size={24} className={status.color} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-black text-lg">{order.kit_name}</h3>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${status.bg} ${status.border} ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{order.invention_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-xs mb-1">Order Number</p>
                      <p className="text-white font-mono font-bold">{order.order_number || order.id}</p>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold mb-1">Price</p>
                      <p className="text-white font-black text-lg">${(order.price_cents / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold mb-1">Ordered</p>
                      <p className="text-white font-mono text-sm">
                        {new Date(order.ordered_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold mb-1">Estimated Delivery</p>
                      <p className="text-white font-mono text-sm">
                        {order.estimated_delivery
                          ? new Date(order.estimated_delivery).toLocaleDateString()
                          : "Pending"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold mb-1">Tracking</p>
                      <p className="text-white font-mono text-sm">
                        {order.tracking_number || "Not yet shipped"}
                      </p>
                    </div>
                  </div>

                  {/* Shipping address */}
                  {order.shipping_address && (
                    <div className="mb-4 pb-4 border-t border-gray-800/50">
                      <p className="text-gray-500 text-xs font-semibold mb-2">Shipping To</p>
                      <p className="text-gray-300 text-sm">{order.shipping_address}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-sm text-gray-300">Order placed</span>
                      <span className="ml-auto text-xs text-gray-600">
                        {new Date(order.ordered_at).toLocaleDateString()}
                      </span>
                    </div>

                    {order.status === "processing" && (
                      <div className="flex items-center gap-3 opacity-60">
                        <div className="w-2 h-2 rounded-full bg-gray-700" />
                        <span className="text-sm text-gray-400">Shipped</span>
                      </div>
                    )}

                    {(order.status === "shipped" || order.status === "delivered") && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-sm text-gray-300">Shipped</span>
                        <span className="ml-auto text-xs text-gray-600">
                          {order.shipped_at ? new Date(order.shipped_at).toLocaleDateString() : "In transit"}
                        </span>
                      </div>
                    )}

                    {order.status === "delivered" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-sm text-gray-300">Delivered</span>
                        <span className="ml-auto text-xs text-gray-600">
                          {order.estimated_delivery
                            ? new Date(order.estimated_delivery).toLocaleDateString()
                            : "Today"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-800/50">
                      <p className="text-gray-500 text-xs font-semibold mb-2">Notes</p>
                      <p className="text-gray-400 text-sm">{order.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}