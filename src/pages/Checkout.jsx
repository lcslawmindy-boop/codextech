import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ShoppingCart, CheckCircle2, Loader2, AlertCircle, Lock, Zap, BookOpen, FlaskConical } from "lucide-react";
import { businessItems } from "../lib/businessItems";
import { base44 } from "@/api/base44Client";

// Only courses and invention kits on this page
const PRODUCTS = [
  ...businessItems.filter(i => i.category === "Course"),
  ...businessItems.filter(i => i.category === "Invention"),
];

function parsePriceCents(priceStr) {
  const match = priceStr.match(/\$(\d+)/);
  return match ? parseInt(match[1]) * 100 : null;
}

function isInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

function ProductCard({ item, selected, onSelect }) {
  const price = parsePriceCents(item.price);
  return (
    <button
      onClick={() => onSelect(item)}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected
          ? "border-purple-500 bg-purple-900/20"
          : "border-gray-700 bg-gray-900 hover:border-gray-500"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
              style={{ backgroundColor: item.color + "20", color: item.color }}
            >
              {item.category}
            </span>
            <span className="text-green-400 font-bold text-sm ml-auto">{item.price}</span>
          </div>
          <p className="text-white font-semibold text-sm leading-snug">{item.title}</p>
          <p className="text-gray-400 text-xs mt-0.5 italic">"{item.tagline}"</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
          selected ? "border-purple-400 bg-purple-500" : "border-gray-600"
        }`}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
}

export default function Checkout() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isSuccess = params.get("success") === "1";
  const purchasedProduct = params.get("product");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  const handleCheckout = async () => {
    setError(null);

    if (isInIframe()) {
      setError("Checkout is only available on the published app — not in the preview iframe. Please open the published app URL to complete your purchase.");
      return;
    }

    if (!selectedProduct) {
      setError("Please select a product first.");
      return;
    }

    const priceInCents = parsePriceCents(selectedProduct.price);
    if (!priceInCents) {
      setError("Could not determine product price.");
      return;
    }

    setLoading(true);
    const origin = window.location.origin;
    const successUrl = `${origin}/checkout?success=1&product=${encodeURIComponent(selectedProduct.title)}`;
    const cancelUrl = `${origin}/checkout`;

    const res = await base44.functions.invoke("createCheckoutSession", {
      title: selectedProduct.title,
      priceInCents,
      description: selectedProduct.tagline,
      category: selectedProduct.category,
      successUrl,
      cancelUrl,
    });

    setLoading(false);

    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setError(res.data?.error || "Checkout failed. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="w-screen min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
        <div className="max-w-lg w-full bg-green-950 border border-green-700 rounded-2xl p-10 text-center">
          <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
          <h1 className="text-green-300 font-bold text-2xl mb-2">Payment Successful!</h1>
          <p className="text-green-200 text-sm mb-1">
            {purchasedProduct ? `You've purchased "${purchasedProduct}".` : "Your purchase was completed."}
          </p>
          <p className="text-green-600 text-xs mb-8">A receipt and access details have been sent to your email.</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors">
            <BookOpen size={14} /> View All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/courses" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Checkout</h1>
            <p className="text-gray-500 text-xs">Select a product and complete your purchase securely via Stripe</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Lock size={12} /> Secured by Stripe
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Product list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
              {["All", "Course", "Invention"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                    filter === f
                      ? "bg-gray-700 border-gray-500 text-white"
                      : "border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {f === "Course" && <BookOpen size={11} />}
                  {f === "Invention" && <FlaskConical size={11} />}
                  {f === "All" && <Zap size={11} />}
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filtered.map((item, i) => (
                <ProductCard
                  key={i}
                  item={item}
                  selected={selectedProduct?.title === item.title}
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold text-base">Order Summary</h2>

              {selectedProduct ? (
                <>
                  <div className="bg-gray-800 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{selectedProduct.icon}</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-semibold uppercase"
                        style={{ backgroundColor: selectedProduct.color + "20", color: selectedProduct.color }}
                      >
                        {selectedProduct.category}
                      </span>
                    </div>
                    <p className="text-white text-sm font-semibold leading-snug">{selectedProduct.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">"{selectedProduct.tagline}"</p>
                  </div>

                  <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-green-400 font-bold text-lg">{selectedProduct.price.split(" ")[0]}</span>
                  </div>

                  {error && (
                    <div className="bg-red-950 border border-red-800 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-xs leading-relaxed">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
                    {loading ? "Redirecting…" : "Proceed to Payment"}
                  </button>

                  <p className="text-gray-600 text-xs text-center">
                    Instant digital access upon payment. NDA applies.
                  </p>
                </>
              ) : (
                <div className="text-center py-6 text-gray-600">
                  <ShoppingCart size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Select a product to continue</p>
                </div>
              )}

              <div className="border-t border-gray-800 pt-4 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-1.5"><Lock size={10} /> 256-bit SSL encryption</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 size={10} /> Secure Stripe payment</div>
                <div className="flex items-center gap-1.5"><Zap size={10} /> Instant access on purchase</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}