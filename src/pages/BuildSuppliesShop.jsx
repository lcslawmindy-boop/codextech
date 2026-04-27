import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Zap, Shield, Wrench, Star, ExternalLink, Loader2, AlertCircle, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Classified products — admin-only due to free energy / medical treatment claims
const CLASSIFIED_IDS = ["meg-kit", "priore-bundle", "trz-components"];

const PRODUCT_IMAGES = {
  "meg-kit": "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/673215ad3_generated_image.png",
  "trd1-kit": "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f60938649_generated_image.png",
  "scalar-lab": "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ff9caefec_generated_image.png",
  "priore-bundle": "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f52d203fc_generated_image.png",
  "tool-kit": "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/974ad47c1_generated_image.png",
  "trz-components": "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a088c3ac2_generated_image.png",
  "gcom-parts": "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/be76fa8f9_generated_image.png",
  "emf-shield": "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/37a67ff5a_generated_image.png",
};

const PRODUCTS = [
  {
    id: "meg-kit",
    priceId: "price_1TLZbkBkbCWuj2nHbZsdfLfZ",
    name: "MEG Replication Parts Kit",
    device: "Motionless Electromagnetic Generator",
    price: 287,
    originalRef: "~$220–$250 sourced separately",
    badge: "Best Seller",
    badgeColor: "#f59e0b",
    category: "Device Components",
    icon: "⚡",
    includes: [
      "Toroidal ferrite cores (2×)",
      "Neodymium permanent magnets (4×)",
      "28 AWG copper winding wire (50ft)",
      "Hall effect sensors (4×)",
      "Output bridge rectifier module",
      "Ferrite bead assortment (20pc)",
      "Component labeling & wiring diagram",
    ],
    description: "Everything you need to begin replicating the MEG device as published in Foundations of Physics Letters (2001). Sourced, tested, and bundled — no hunting 12 separate suppliers.",
    leadTime: "Ships in 5–7 business days",
    shipping: "Free shipping (US) · $18 international",
  },
  {
    id: "trd1-kit",
    priceId: "price_1TLZbkBkbCWuj2nHPkra4rZ0",
    name: "TRD-1 Telomere Device Build Kit",
    device: "Telomere Regeneration Device",
    price: 194,
    originalRef: "~$150–$175 sourced separately",
    badge: "New",
    badgeColor: "#22c55e",
    category: "Device Components",
    icon: "🧬",
    includes: [
      "Multi-layer scalar bifilar coil",
      "Programmable frequency generator (1Hz–1MHz)",
      "Shielded aluminum enclosure",
      "Precision film capacitors (10× assorted)",
      "Shielded wiring harness & connectors",
      "Grounding strap & ferrite choke",
    ],
    description: "Core components for the TRD-1 protocol. Frequency generator pre-tested at factory. Coil wound to Bearden's specifications.",
    leadTime: "Ships in 7–10 business days",
    shipping: "Free shipping (US) · $22 international",
  },
  {
    id: "scalar-lab",
    priceId: "price_1TLZbkBkbCWuj2nHGIfKzCip",
    name: "Scalar EM Lab Starter Kit",
    device: "General Scalar EM Research",
    price: 167,
    originalRef: "~$130–$145 sourced separately",
    badge: "Essential",
    badgeColor: "#3b82f6",
    category: "Lab Tools",
    icon: "🔬",
    includes: [
      "DDS function generator (1Hz–10MHz)",
      "×10 oscilloscope probes (BNC)",
      "830-point breadboard",
      "Resistor/capacitor assortment (600pc)",
      "Shielded coaxial cable set (6×)",
      "Anti-static work mat (12\"×24\")",
    ],
    description: "The essential bench setup for any scalar EM researcher. Start experimenting from day one without hunting parts across 6 different vendors.",
    leadTime: "Ships in 3–5 business days",
    shipping: "Free shipping (US) · $15 international",
  },
  {
    id: "priore-bundle",
    priceId: "price_1TLZbkBkbCWuj2nHHc4bkmYk",
    name: "Prioré Device Component Bundle",
    device: "Prioré EM Treatment System",
    price: 349,
    originalRef: "~$270–$310 sourced separately",
    badge: "Advanced",
    badgeColor: "#a855f7",
    category: "Device Components",
    icon: "🏥",
    includes: [
      "Rotating EM field Helmholtz coil set",
      "RF oscillator module (27.12 MHz)",
      "Neon plasma discharge tube",
      "High-voltage film capacitors (5×)",
      "Faraday cage copper mesh (18\"×18\")",
      "Heavy-duty power supply (12V/10A)",
    ],
    description: "Core components for beginning Prioré system study, based on the ONR-validated device (Bateman, 1978). Assembled by researchers familiar with the original French patent.",
    leadTime: "Ships in 7–14 business days",
    shipping: "Free shipping (US) · $28 international",
  },
  {
    id: "tool-kit",
    priceId: "price_1TLZbkBkbCWuj2nHgc52Ozlz",
    name: "Advanced EM Assembly Tool Kit",
    device: "All Device Builds",
    price: 127,
    originalRef: "~$95–$115 sourced separately",
    badge: "Must Have",
    badgeColor: "#f97316",
    category: "Lab Tools",
    icon: "🔧",
    includes: [
      "Temperature-controlled soldering station (60W)",
      "Rosin core solder + flux pen",
      "Desoldering pump + wick",
      "Anti-static work mat + wrist strap",
      "Digital multimeter (auto-ranging)",
      "RF near-field signal probe",
      "Ferrite bead assortment (50pc)",
    ],
    description: "Professional assembly tools curated specifically for EM device construction. Stop wasting time with cheap tools — these are what the build plans assume you have.",
    leadTime: "Ships in 2–4 business days",
    shipping: "Free shipping (US) · $14 international",
  },
  {
    id: "gcom-parts",
    priceId: "price_1TLZbkBkbCWuj2nHWn3Y0T6U",
    name: "G-Com Scalar Communicator Parts",
    device: "Gravitational Communications Device",
    price: 243,
    originalRef: "~$190–$215 sourced separately",
    badge: null,
    category: "Device Components",
    icon: "📡",
    includes: [
      "Matched scalar bifilar antenna coil pair",
      "Phase-conjugate mirror assembly",
      "RF shielding enclosure (aluminum)",
      "Precision analog phase shifter module",
      "Isolation transformer (1:1, 50VA)",
      "Shielded twisted pair cable (25ft)",
    ],
    description: "Matched component pair for the G-Com device build. Antenna coils wound and matched as a set — critical for phase-conjugate operation.",
    leadTime: "Ships in 7–10 business days",
    shipping: "Free shipping (US) · $20 international",
  },
  {
    id: "trz-components",
    priceId: "price_1TLZbkBkbCWuj2nHPy23WbEy",
    name: "TRZ Reactor Starter Components",
    device: "Time-Reversal Zone Reactor",
    price: 389,
    originalRef: "~$300–$345 sourced separately",
    badge: "Premium",
    badgeColor: "#ef4444",
    category: "Device Components",
    icon: "⚛️",
    includes: [
      "Barium titanate crystal set (4×, matched)",
      "Phase conjugate pump module",
      "Optical bench rail mounts (aluminum)",
      "Piezoelectric transducer array (3×)",
      "Low-noise shielded coaxial cable (10ft)",
      "Precision crystal mounting brackets",
    ],
    description: "Highest-precision kit in the lineup. Barium titanate crystals individually tested and matched. For advanced builders with prior EM device experience.",
    leadTime: "Ships in 10–14 business days",
    shipping: "Free shipping (US) · $30 international",
  },
  {
    id: "emf-shield",
    priceId: "price_1TLZbkBkbCWuj2nHtdQ1LHyk",
    name: "EMF Protection & Shielding Kit",
    device: "Personal EMF Protection",
    price: 89,
    originalRef: "~$65–$80 sourced separately",
    badge: "Popular",
    badgeColor: "#06b6d4",
    category: "Protection",
    icon: "🛡️",
    includes: [
      "Mu-metal shielding sheet (12\"×12\")",
      "Copper foil tape roll (2\" × 15ft)",
      "EMF-blocking fabric (1 sq. yard)",
      "Ferrite snap-on choke clamps (10×)",
      "3-point grounding cable set",
      "EMF exposure reference card",
    ],
    description: "Personal protection and lab shielding materials. Start with this kit while your devices are in progress — reduce your daily EMF exposure immediately.",
    leadTime: "Ships in 2–4 business days",
    shipping: "Free shipping (US) · $12 international",
  },
];

const CATEGORIES = ["All", "Device Components", "Lab Tools", "Protection"];

function ProductCard({ product, onBuy, buying }) {
  const [expanded, setExpanded] = useState(false);
  const savings = Math.round(product.price * 0.15);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all flex flex-col group">
      {/* 3D Render Image */}
      {PRODUCT_IMAGES[product.id] && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={PRODUCT_IMAGES[product.id]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {product.badge && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold backdrop-blur-sm" style={{ backgroundColor: product.badgeColor + "cc", color: "#000" }}>
                {product.badge}
              </span>
            )}
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-black/60 text-gray-300 backdrop-blur-sm border border-gray-700">{product.category}</span>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header — no icon needed since we have image */}
        {!PRODUCT_IMAGES[product.id] && (
          <div className="flex items-start justify-between gap-3 mb-3">
            <div><span className="text-3xl">{product.icon}</span></div>
            <div className="flex flex-col items-end gap-1">
              {product.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: product.badgeColor + "25", color: product.badgeColor }}>
                  {product.badge}
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-700">{product.category}</span>
            </div>
          </div>
        )}

        <h3 className="text-white font-black text-base leading-snug mb-1">{product.name}</h3>
        <p className="text-gray-500 text-xs mb-3">For: <span className="text-gray-400 font-medium">{product.device}</span></p>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">{product.description}</p>

        {/* Includes toggle */}
        <button onClick={() => setExpanded(e => !e)}
          className="text-left text-xs text-blue-400 hover:text-blue-300 mb-3 transition-colors">
          {expanded ? "▾ Hide" : "▸ Show"} what's included ({product.includes.length} items)
        </button>
        {expanded && (
          <ul className="space-y-1 mb-4">
            {product.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {item}
              </li>
            ))}
          </ul>
        )}

        {/* Shipping info */}
        <div className="text-xs text-gray-600 mb-4 space-y-0.5">
          <p>📦 {product.leadTime}</p>
          <p>🚚 {product.shipping}</p>
        </div>

        {/* Price + Buy */}
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-2xl font-black text-white">${product.price}</p>
              <p className="text-xs text-gray-600">vs {product.originalRef}</p>
              <p className="text-xs text-green-400 font-semibold">~${savings} saved vs sourcing individually</p>
            </div>
          </div>
          <button
            onClick={() => onBuy(product)}
            disabled={buying === product.id}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-black transition-all disabled:opacity-60"
            style={{ backgroundColor: product.badgeColor || "#d4af37" }}
          >
            {buying === product.id ? <Loader2 size={15} className="animate-spin" /> : <ShoppingCart size={15} />}
            {buying === product.id ? "Redirecting…" : "Buy Now — Secure Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuildSuppliesShop() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [category, setCategory] = useState("All");
  const [buying, setBuying] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.auth.me()
      .then(u => { setIsAdmin(u?.role === 'admin'); setAdminChecked(true); })
      .catch(() => { setAdminChecked(true); });
  }, []);

  if (!adminChecked) return null;
  if (!isAdmin) {
    navigate("/admin");
    return null;
  }

  const isInIframe = window.self !== window.top;

  const handleBuy = async (product) => {
    if (isInIframe) {
      setError("Checkout only works from the published app. Please open the app directly to complete your purchase.");
      return;
    }
    setError("");
    setBuying(product.id);
    const res = await base44.functions.invoke("createCheckoutSession", {
      priceId: product.priceId,
      productName: product.name,
      successUrl: window.location.origin + "/build-supplies-shop?success=1",
      cancelUrl: window.location.origin + "/build-supplies-shop",
    });
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setError("Checkout failed. Please try again.");
      setBuying(null);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get("success") === "1";

  const visibleProducts = PRODUCTS.filter(p => !CLASSIFIED_IDS.includes(p.id) || isAdmin);
  const filtered = category === "All" ? visibleProducts : visibleProducts.filter(p => p.category === category);

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base flex items-center gap-2">
              <Wrench size={15} className="text-yellow-400" /> Build Supplies Shop
            </h1>
            <p className="text-gray-500 text-xs">Curated kits for Zenith Apex device builds · Members only</p>
          </div>
        </div>
        <Link to="/invention-plans" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all">
          📐 Build Plans
        </Link>
      </div>

      {/* Success banner */}
      {success && (
        <div className="bg-green-950/60 border-b border-green-800 px-6 py-3 flex items-center gap-3">
          <Star size={16} className="text-green-400" />
          <p className="text-green-300 text-sm font-bold">Order confirmed! Check your email for shipping details. Your kit will arrive within the stated lead time.</p>
        </div>
      )}

      {/* Hero */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 px-6 py-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/60 border border-yellow-800 text-yellow-400 text-xs font-black mb-4 uppercase tracking-widest">
          <Shield size={11} /> Members-Only Pricing · Pre-Sourced & Bundled
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
          Stop Sourcing Parts.<br />
          <span className="text-yellow-400">Start Building.</span>
        </h2>
        <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
          Every kit is hand-curated to match your Zenith Apex build plans — tested components, pre-matched pairs, no hunting 12 different suppliers.
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><Zap size={11} className="text-yellow-400" /> Ships to 80+ countries</span>
          <span className="flex items-center gap-1.5"><Shield size={11} className="text-green-400" /> Stripe secure checkout</span>
          <span className="flex items-center gap-1.5"><ExternalLink size={11} className="text-blue-400" /> Deposited directly to your account</span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 bg-red-950/40 border border-red-800 rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800 overflow-x-auto">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              category === c ? "bg-yellow-900/50 border-yellow-700 text-yellow-300" : "border-gray-700 text-gray-500 hover:border-gray-500"
            }`}>
            {c}
          </button>
        ))}
        <span className="text-gray-600 text-xs ml-2">{filtered.length} kits</span>
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        {!isAdmin && CLASSIFIED_IDS.length > 0 && (
          <div className="mb-5 flex items-center gap-2 px-4 py-2 rounded-xl border border-red-900/40 bg-red-950/10">
            <Lock size={12} className="text-red-600" />
            <p className="text-red-600 text-xs">{CLASSIFIED_IDS.length} products restricted to admin access due to regulatory considerations</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onBuy={handleBuy} buying={buying} />
          ))}
        </div>

        {/* Footer trust block */}
        <div className="mt-12 border-t border-gray-800 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-white font-bold text-sm mb-1">🔒 Secure Stripe Checkout</p>
            <p className="text-gray-500 text-xs leading-relaxed">All payments processed by Stripe. Card data never touches our servers. Revenue deposited directly to your bank account.</p>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-1">📦 Curated & Pre-Tested</p>
            <p className="text-gray-500 text-xs leading-relaxed">Every kit is matched to the build plan specs. No substitutions, no guessing — just start building.</p>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-1">🧰 Pairs With Build Plans</p>
            <p className="text-gray-500 text-xs leading-relaxed">Order the matching build plan PDF and parts kit together for the complete package. <Link to="/invention-plans" className="text-yellow-400 underline">View build plans →</Link></p>
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs mt-8">
          Zenith Apex Build Supplies · Members Only · All sales final · Prices include 15–20% platform curation fee
        </p>
      </div>
    </div>
  );
}