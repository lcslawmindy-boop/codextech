import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ShoppingCart, CheckCircle2, Loader2, AlertCircle, Lock, Zap, BookOpen, FlaskConical, FileText, X, Plus, Minus, Crown, Star } from "lucide-react";
import { businessItems } from "../lib/businessItems";
import { base44 } from "@/api/base44Client";

// Include courses, books, and inventions (with a Stripe product or a parseable price)
const PRODUCTS = [
  ...businessItems.filter(i => i.category === "Course"),
  ...businessItems.filter(i => i.category === "Book/PDF"),
  ...businessItems.filter(i => i.category === "Invention"),
];

const MEMBERSHIP_PLANS = [
  {
    id: "researcher",
    title: "Researcher Membership",
    tagline: "Full access to all build plans, courses, AI patent tools & more",
    price: "$97/mo",
    priceInCents: 9700,
    icon: "🔬",
    color: "#6366f1",
    category: "Membership",
    features: ["All 21+ invention build plans", "Full course library (20+ courses)", "AI Patent Claims Generator (unlimited)", "AI Invention Forge (unlimited)", "Downloadable PDFs for every device", "Monthly research updates"],
  },
  {
    id: "pro",
    title: "Pro Researcher Membership",
    tagline: "Everything in Researcher + Investor CRM, VDR, advanced tools",
    price: "$247/mo",
    priceInCents: 24700,
    icon: "🏆",
    color: "#f59e0b",
    category: "Membership",
    features: ["Everything in Researcher", "Investor CRM + Kanban board", "Virtual Data Room (VDR)", "IP Portfolio Health dashboard", "Build Milestone AI tracker", "Priority support + private briefings"],
  },
];

function parsePriceCents(priceStr) {
  const match = priceStr?.match(/\$(\d+)/);
  return match ? parseInt(match[1]) * 100 : null;
}

function isInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

function MembershipCard({ plan, inCart, onToggle }) {
  return (
    <div
      onClick={() => onToggle(plan)}
      className={`cursor-pointer w-full text-left p-4 rounded-xl border transition-all relative ${
        inCart ? "border-yellow-500 bg-yellow-900/10" : "border-gray-700 bg-gray-900 hover:border-gray-500"
      }`}
    >
      {plan.id === "researcher" && (
        <span className="absolute top-2 right-2 text-xs bg-indigo-700 text-white px-2 py-0.5 rounded-full font-bold">POPULAR</span>
      )}
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{plan.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider" style={{ backgroundColor: plan.color + "20", color: plan.color }}>
              Membership
            </span>
            <span className="text-green-400 font-bold text-sm ml-auto">{plan.price}</span>
          </div>
          <p className="text-white font-semibold text-sm leading-snug">{plan.title}</p>
          <p className="text-gray-400 text-xs mt-0.5 italic">"{plan.tagline}"</p>
          <ul className="mt-2 space-y-0.5">
            {plan.features.slice(0, 3).map((f, i) => (
              <li key={i} className="text-gray-500 text-xs flex items-center gap-1.5">
                <CheckCircle2 size={9} className="text-green-500 flex-shrink-0" />{f}
              </li>
            ))}
            {plan.features.length > 3 && (
              <li className="text-gray-600 text-xs">+{plan.features.length - 3} more…</li>
            )}
          </ul>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
          inCart ? "border-yellow-400 bg-yellow-500" : "border-gray-600"
        }`}>
          {inCart && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item, inCart, onToggle }) {
  return (
    <button
      onClick={() => onToggle(item)}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        inCart ? "border-purple-500 bg-purple-900/20" : "border-gray-700 bg-gray-900 hover:border-gray-500"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider" style={{ backgroundColor: item.color + "20", color: item.color }}>
              {item.category}
            </span>
            <span className="text-green-400 font-bold text-sm ml-auto">{item.price}</span>
          </div>
          <p className="text-white font-semibold text-sm leading-snug">{item.title}</p>
          <p className="text-gray-400 text-xs mt-0.5 italic">"{item.tagline}"</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
          inCart ? "border-purple-400 bg-purple-500" : "border-gray-600"
        }`}>
          {inCart && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
}

function CartSummary({ cart, membershipCart, onRemoveProduct, onRemoveMembership, onCheckout, loading, error }) {
  const productTotal = cart.reduce((sum, item) => sum + (parsePriceCents(item.price) || 0), 0);
  const membershipTotal = membershipCart.reduce((sum, p) => sum + p.priceInCents, 0);
  const total = productTotal + membershipTotal;
  const isEmpty = cart.length === 0 && membershipCart.length === 0;

  return (
    <div className="sticky top-6 bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-white font-bold text-base flex items-center gap-2">
        <ShoppingCart size={16} /> Cart ({cart.length + membershipCart.length})
      </h2>

      {isEmpty ? (
        <div className="text-center py-6 text-gray-600">
          <ShoppingCart size={28} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Select items to continue</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {membershipCart.map(plan => (
              <div key={plan.id} className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-2">
                <span className="text-lg">{plan.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{plan.title}</p>
                  <p className="text-green-400 text-xs font-bold">{plan.price}</p>
                </div>
                <button onClick={() => onRemoveMembership(plan)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <X size={12} />
                </button>
              </div>
            ))}
            {cart.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-2">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                  <p className="text-green-400 text-xs font-bold">{item.price.split(" ")[0]}</p>
                </div>
                <button onClick={() => onRemoveProduct(item)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total</span>
            <span className="text-green-400 font-bold text-lg">${(total / 100).toFixed(2)}{membershipCart.length > 0 ? "/mo" : ""}</span>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <button
            onClick={onCheckout}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
            {loading ? "Redirecting…" : `Checkout — $${(total / 100).toFixed(2)}`}
          </button>
          <p className="text-gray-600 text-xs text-center">
            {membershipCart.length > 0
              ? "Membership billed monthly. Cancel anytime."
              : "Instant digital access upon payment. NDA applies."}
          </p>
        </>
      )}

      <div className="border-t border-gray-800 pt-4 space-y-1.5 text-xs text-gray-600">
        <div className="flex items-center gap-1.5"><Lock size={10} /> 256-bit SSL encryption</div>
        <div className="flex items-center gap-1.5"><CheckCircle2 size={10} /> Secure Stripe payment</div>
        <div className="flex items-center gap-1.5"><Zap size={10} /> Instant access on purchase</div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isSuccess = params.get("success") === "1";
  const purchasedProduct = params.get("product");

  const [cart, setCart] = useState([]); // one-time products
  const [membershipCart, setMembershipCart] = useState([]); // subscriptions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Membership");

  const FILTER_TABS = ["Membership", "Course", "Book/PDF", "Invention"];

  const filteredProducts = filter === "Membership"
    ? []
    : PRODUCTS.filter(p => p.category === filter);

  const toggleProduct = (item) => {
    setCart(prev =>
      prev.find(p => p.title === item.title)
        ? prev.filter(p => p.title !== item.title)
        : [...prev, item]
    );
  };

  const toggleMembership = (plan) => {
    setMembershipCart(prev =>
      prev.find(p => p.id === plan.id)
        ? prev.filter(p => p.id !== plan.id)
        : [...prev, plan]
    );
  };

  const handleCheckout = async () => {
    setError(null);

    if (isInIframe()) {
      setError("Checkout is only available on the published app — not in the preview iframe. Please open the published app URL to complete your purchase.");
      return;
    }

    if (cart.length === 0 && membershipCart.length === 0) {
      setError("Please select at least one item.");
      return;
    }

    // If memberships are in cart, handle subscription checkout for the first one
    // (Stripe doesn't support mixing subscription + one-time in a single session)
    if (membershipCart.length > 0) {
      setLoading(true);
      const plan = membershipCart[0]; // process first membership
      const origin = window.location.origin;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: plan.title,
        priceInCents: plan.priceInCents,
        description: plan.tagline,
        category: "Membership",
        mode: "subscription",
        interval: "month",
        successUrl: `${origin}/checkout?success=1&product=${encodeURIComponent(plan.title)}`,
        cancelUrl: `${origin}/checkout`,
      });
      setLoading(false);
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError(res.data?.error || "Checkout failed. Please try again.");
      }
      return;
    }

    // One-time cart checkout — take first item (Stripe single-item sessions)
    const item = cart[0];
    const priceInCents = parsePriceCents(item.price);
    if (!priceInCents) {
      setError("Could not determine product price.");
      return;
    }
    setLoading(true);
    const origin = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: item.title,
      priceInCents,
      description: item.tagline,
      category: item.category,
      successUrl: `${origin}/checkout?success=1&product=${encodeURIComponent(item.title)}`,
      cancelUrl: `${origin}/checkout`,
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
          <div className="flex gap-3 justify-center">
            <Link to="/my-learning" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors">
              <BookOpen size={14} /> My Learning
            </Link>
            <Link to="/member-portal" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition-colors">
              <Crown size={14} /> Member Portal
            </Link>
          </div>
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
            <p className="text-gray-500 text-xs">Select memberships, courses, books & build plans — then checkout via Stripe</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(cart.length + membershipCart.length) > 0 && (
            <span className="bg-purple-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.length + membershipCart.length} item{cart.length + membershipCart.length !== 1 ? "s" : ""}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock size={12} /> Secured by Stripe
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Product list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {FILTER_TABS.map(f => (
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
                  {f === "Book/PDF" && <FileText size={11} />}
                  {f === "Membership" && <Crown size={11} />}
                  {f}
                </button>
              ))}
            </div>

            {/* Membership plans */}
            {filter === "Membership" && (
              <div className="space-y-3">
                <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl px-4 py-3 mb-4">
                  <p className="text-indigo-300 text-xs font-bold flex items-center gap-2"><Star size={12} /> Memberships give you ongoing access to all platform features — cancel anytime.</p>
                </div>
                {MEMBERSHIP_PLANS.map(plan => (
                  <MembershipCard
                    key={plan.id}
                    plan={plan}
                    inCart={!!membershipCart.find(p => p.id === plan.id)}
                    onToggle={toggleMembership}
                  />
                ))}
              </div>
            )}

            {/* One-time products */}
            {filter !== "Membership" && (
              <div className="space-y-2">
                {filteredProducts.length === 0 && (
                  <p className="text-gray-600 text-sm text-center py-8">No items in this category.</p>
                )}
                {filteredProducts.map((item, i) => (
                  <ProductCard
                    key={i}
                    item={item}
                    inCart={!!cart.find(p => p.title === item.title)}
                    onToggle={toggleProduct}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart summary */}
          <div className="lg:col-span-1">
            <CartSummary
              cart={cart}
              membershipCart={membershipCart}
              onRemoveProduct={(item) => setCart(prev => prev.filter(p => p.title !== item.title))}
              onRemoveMembership={(plan) => setMembershipCart(prev => prev.filter(p => p.id !== plan.id))}
              onCheckout={handleCheckout}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}