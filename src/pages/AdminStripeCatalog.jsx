import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Save, CheckCircle, AlertCircle, ExternalLink, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { businessItems } from "@/lib/businessItems";

// Items that have a stripeProductId — these can be synced
const CATALOG = businessItems.filter(i => i.stripeProductId).map(i => ({
  title: i.title,
  category: i.category,
  tagline: i.tagline,
  description: i.description,
  price: i.price,
  stripeProductId: i.stripeProductId,
}));

// Membership tiers to include as reference (no auto-sync, prices managed via Stripe dashboard)
const MEMBERSHIPS = [
  { title: "Starter — Vault Access", price: "$47 one-time", description: "One-time access to 5 build plans and 4 courses. Includes the core scalar EM curriculum and beginner build documentation. No subscription required.", stripeProductId: null },
  { title: "Researcher — Monthly Membership", price: "$97/month", description: "Full access to all 40+ build plans, all 40+ courses, AI patent drafting tools, prior art archive, and research lab simulator. Recurring monthly subscription. Cancel anytime.", stripeProductId: null },
  { title: "Pro — Full Platform", price: "$247/month", description: "Everything in Researcher plus investor package, co-inventor matching, IP marketplace access, and priority support. Recurring monthly subscription.", stripeProductId: null },
];

export default function AdminStripeCatalog() {
  const [stripeProducts, setStripeProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [errors, setErrors] = useState({});
  const [edits, setEdits] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStripeProducts();
  }, []);

  const loadStripeProducts = async () => {
    setLoading(true);
    const res = await base44.functions.invoke("listStripeProducts", {});
    const products = res.data.products || [];
    setStripeProducts(products);

    // Pre-populate edits from Stripe's current data
    const initial = {};
    products.forEach(p => {
      initial[p.id] = { name: p.name, description: p.description || "" };
    });
    setEdits(initial);
    setLoading(false);
  };

  const handleSave = async (productId) => {
    setSaving(s => ({ ...s, [productId]: true }));
    setErrors(e => ({ ...e, [productId]: null }));
    try {
      await base44.functions.invoke("updateStripeProductDescription", {
        product_id: productId,
        description: edits[productId]?.description || "",
        name: edits[productId]?.name || undefined,
      });
      setSaved(s => ({ ...s, [productId]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [productId]: false })), 3000);
    } catch (e) {
      setErrors(err => ({ ...err, [productId]: e.message }));
    }
    setSaving(s => ({ ...s, [productId]: false }));
  };

  const applyFromCatalog = (productId, item) => {
    setEdits(e => ({
      ...e,
      [productId]: {
        ...e[productId],
        description: item.description + (item.tagline ? ` — ${item.tagline}` : ""),
      }
    }));
  };

  // Match catalog items to Stripe products
  const catalogWithStripe = CATALOG.map(item => {
    const sp = stripeProducts.find(p => p.id === item.stripeProductId);
    return { ...item, stripeData: sp };
  });

  const allProducts = stripeProducts.filter(p =>
    !CATALOG.some(c => c.stripeProductId === p.id)
  );

  const filtered = (search
    ? [...catalogWithStripe.filter(i => i.title.toLowerCase().includes(search.toLowerCase())), ...allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))]
    : [...catalogWithStripe, ...allProducts]
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-30 flex items-center gap-4">
        <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Admin
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div className="flex-1">
          <h1 className="text-white font-black text-lg">Stripe Product Catalog</h1>
          <p className="text-gray-500 text-xs">Manage descriptions for all courses, build plans, and memberships</p>
        </div>
        <button onClick={loadStripeProducts} disabled={loading} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors disabled:opacity-50">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
        <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors">
          <ExternalLink size={14} /> Stripe Dashboard
        </a>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Search */}
        <div className="relative mb-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-600"
          />
        </div>

        {/* Membership reference */}
        <div className="mb-8 p-5 rounded-2xl bg-gray-900/60 border border-purple-900/30">
          <h2 className="text-purple-400 font-black text-sm uppercase tracking-wider mb-3">Membership Tier Descriptions (Reference)</h2>
          <p className="text-gray-500 text-xs mb-4">These are your suggested descriptions. Add them directly in the <a href="https://dashboard.stripe.com/products" target="_blank" className="text-cyan-400 hover:underline">Stripe Dashboard</a> for subscription products.</p>
          <div className="space-y-3">
            {MEMBERSHIPS.map((m, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-bold text-sm">{m.title}</span>
                  <span className="text-purple-400 font-black text-sm">{m.price}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stripe Products */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-white font-black text-sm uppercase tracking-wider text-gray-400">
              Stripe Products ({stripeProducts.length} total)
            </h2>

            {catalogWithStripe.filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase())).map(item => {
              const pid = item.stripeProductId;
              const edit = edits[pid] || {};
              if (!item.stripeData) return (
                <div key={pid} className="p-4 rounded-xl bg-gray-900 border border-yellow-900/30">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={14} className="text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="text-white font-bold text-sm">{item.title}</p>
                      <p className="text-yellow-400 text-xs">Product ID <code className="bg-gray-800 px-1 rounded">{pid}</code> not found in your Stripe account.</p>
                    </div>
                  </div>
                </div>
              );
              return (
                <div key={pid} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{item.category}</span>
                      <h3 className="text-white font-black text-sm mt-0.5">{item.stripeData.name}</h3>
                      <p className="text-gray-600 text-xs font-mono mt-0.5">{pid}</p>
                    </div>
                    <span className="text-green-400 font-black text-sm whitespace-nowrap">{item.price}</span>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">Description (shown on Stripe checkout)</label>
                    <textarea
                      rows={3}
                      value={edit.description || ""}
                      onChange={e => setEdits(ed => ({ ...ed, [pid]: { ...ed[pid], description: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                      placeholder="Add a description for customers on the checkout page..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => applyFromCatalog(pid, item)}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-colors"
                    >
                      Auto-fill from Catalog
                    </button>
                    <button
                      onClick={() => handleSave(pid)}
                      disabled={saving[pid]}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-black transition-colors disabled:opacity-50"
                    >
                      <Save size={12} /> {saving[pid] ? "Saving…" : "Save to Stripe"}
                    </button>
                    {saved[pid] && <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={12} /> Saved</span>}
                    {errors[pid] && <span className="text-red-400 text-xs">{errors[pid]}</span>}
                  </div>
                </div>
              );
            })}

            {/* Other Stripe products not in catalog */}
            {allProducts.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).length > 0 && (
              <>
                <h2 className="text-gray-600 font-black text-sm uppercase tracking-wider mt-8">Other Stripe Products</h2>
                {allProducts.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).map(p => {
                  const edit = edits[p.id] || {};
                  return (
                    <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-white font-black text-sm">{p.name}</h3>
                          <p className="text-gray-600 text-xs font-mono mt-0.5">{p.id}</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={edit.description || ""}
                          onChange={e => setEdits(ed => ({ ...ed, [p.id]: { ...ed[p.id], description: e.target.value } }))}
                          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                          placeholder="Add a description..."
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSave(p.id)}
                          disabled={saving[p.id]}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-black transition-colors disabled:opacity-50"
                        >
                          <Save size={12} /> {saving[p.id] ? "Saving…" : "Save to Stripe"}
                        </button>
                        {saved[p.id] && <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={12} /> Saved</span>}
                        {errors[p.id] && <span className="text-red-400 text-xs">{errors[p.id]}</span>}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}