import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Shield, Zap, Home, Car, Shirt, FlaskConical, Droplets, BookOpen, ChevronDown, ChevronUp, Star, AlertTriangle, CheckCircle2 } from "lucide-react";

// ── Product Data ──────────────────────────────────────────────────────
const PRODUCTS = [
  // Jewelry
  { id: 1, category: "Jewelry", name: "Shungite EMF Harmonizer Pendant", price: 38.49, rating: 4.8, badge: "Best Seller", color: "#6366f1", icon: "🪨", desc: "Raw shungite crystal pendant on 925 silver chain. Shungite contains fullerenes (C60) — carbon structures that absorb and neutralize EMF radiation. Worn at chest level, closest to heart and thymus.", benefits: ["Absorbs 5G, WiFi, Bluetooth frequencies", "C60 fullerene carbon matrix", "925 Sterling silver bail"] },
  { id: 2, category: "Jewelry", name: "Orgonite Scalar Pyramid Pendant", price: 31.89, rating: 4.7, badge: null, color: "#8b5cf6", icon: "🔺", desc: "Layered orgonite pendant with copper spiral, quartz crystal point, and resin matrix. Generates scalar/orgone field that counteracts artificial EMF coherence collapse.", benefits: ["Copper + quartz scalar generator", "Orgone field emission", "Converts DOR to POR (positive orgone)"] },
  { id: 3, category: "Jewelry", name: "Titanium Bio-Energy Bracelet", price: 54.99, rating: 4.6, badge: null, color: "#06b6d4", icon: "⌚", desc: "Medical-grade titanium bracelet with germanium and tourmaline inserts. Germanium emits far-infrared and anions that counteract EMF biological stress. Popular with EMF-sensitive individuals.", benefits: ["Germanium FIR emission", "Black tourmaline anion stones", "Medical-grade titanium"] },
  { id: 4, category: "Jewelry", name: "Moldavite + Copper Wrap Ring", price: 49.49, rating: 4.9, badge: "Top Rated", color: "#22c55e", icon: "💚", desc: "Moldavite tektite wrapped in pure copper wire. Copper is the primary EMF shielding metal — when shaped as a wrap it creates a localized Faraday effect around the finger while moldavite provides energetic protection.", benefits: ["Pure copper shielding wrap", "Genuine moldavite tektite", "Handmade — each unique"] },

  // Car/Home Devices
  { id: 5, category: "Car & Home", name: "EMF Harmonizer Home Plug (2-pack)", price: 87.99, rating: 4.5, badge: "Home Essential", color: "#f59e0b", icon: "🔌", desc: "Plugs into any standard outlet. Uses a scalar wave resonance chip to re-modulate the dirty electricity waveform on your home circuit, reducing high-frequency harmonics that penetrate walls and affect biology.", benefits: ["Covers up to 2,000 sq ft per plug", "Targets dirty electricity HF harmonics", "No EMF blocking (doesn't cut power)"] },
  { id: 6, category: "Car & Home", name: "Car OBD2 EMF Neutralizer", price: 43.99, rating: 4.4, badge: null, color: "#ef4444", icon: "🚗", desc: "Plugs into your car's OBD2 diagnostic port (under dashboard). Neutralizes the dense EMF environment created by modern CAN bus electronics, Bluetooth, keyless entry, and reverse cameras. Scalar resonance chip inside.", benefits: ["Fits all OBD2 vehicles (1996+)", "Targets in-cabin Bluetooth/cellular EMF", "Passive — zero power draw"] },
  { id: 7, category: "Car & Home", name: "WiFi Router EMF Shield Sleeve", price: 27.49, rating: 4.3, badge: null, color: "#3b82f6", icon: "📡", desc: "Faraday mesh sleeve that fits over most routers. Reduces EMF emission by 90%+ while allowing normal WiFi signal through ventilation channels. No performance loss at normal range.", benefits: ["90%+ EMF reduction verified", "Maintains normal WiFi signal", "Fits most standard routers"] },
  { id: 8, category: "Car & Home", name: "Smart Meter Faraday Guard", price: 60.49, rating: 4.7, badge: "Popular", color: "#a855f7", icon: "⚡", desc: "Stainless steel Faraday enclosure that mounts over your smart meter. Blocks the pulsed microwave radiation (900 MHz–2.4 GHz) emitted by smart meters every 15–30 seconds without blocking the meter's reporting signal.", benefits: ["Stainless steel Faraday construction", "Blocks 900 MHz–2.4 GHz pulsed RF", "Utility-compliant — doesn't block meter"] },

  // Faraday Clothing
  { id: 9, category: "Faraday Clothing", name: "Silver-Thread EMF Blocking Beanie", price: 43.99, rating: 4.8, badge: "Best Seller", color: "#94a3b8", icon: "🧢", desc: "90% silver fiber + 10% cotton beanie. Silver is the highest-conductivity metal — this beanie creates a Faraday enclosure around the skull, reducing cranial EMF exposure from cell towers, 5G base stations, and smart meters.", benefits: ["90% silver fiber (highest conductivity)", "35–40 dB attenuation at 1–10 GHz", "Washable — maintains shielding after 30+ washes"] },
  { id: 10, category: "Faraday Clothing", name: "Full-Body EMF Shielding Hoodie", price: 164.99, rating: 4.7, badge: null, color: "#64748b", icon: "👕", desc: "Silver-coated nylon hoodie with hood lining, sleeve protection, and torso coverage. Tested to 40 dB attenuation across 1 MHz–10 GHz. Suitable for daily wear and sleeping in high-EMF environments.", benefits: ["40 dB attenuation (99.99% reduction)", "1 MHz–10 GHz tested frequency range", "Machine washable with silver-safe detergent"] },
  { id: 11, category: "Faraday Clothing", name: "EMF Shielding Underwear (Unisex)", price: 65.99, rating: 4.6, badge: null, color: "#ec4899", icon: "🩱", desc: "Silver-fiber underwear protecting reproductive organs — the most radiation-sensitive tissues. Critical for laptop users, people living near 5G towers, or those experiencing fertility concerns.", benefits: ["Reproductive organ protection", "65% silver fiber content", "Documented fertility concern use-case"] },
  { id: 12, category: "Faraday Clothing", name: "EMF Blocking Pregnancy Belly Band", price: 76.99, rating: 4.9, badge: "Critical", color: "#f97316", icon: "🤰", desc: "Silver-lined elastic belly band for pregnant women. Protects fetal development from WiFi, 5G, Bluetooth, and smart meter radiation during the critical first trimester when fetal nervous system is forming.", benefits: ["Fetal nervous system protection", "Elastic — fits all trimesters", "OB-GYN recommended design"] },

  // Supplements
  { id: 13, category: "Supplements", name: "Wildcrafted Sea Moss Gel (Irish Moss)", price: 36.29, rating: 4.9, badge: "92 Minerals", color: "#22c55e", icon: "🌿", desc: "Wildcrafted Irish Sea Moss (Chondrus crispus) gel — contains 92 of the 102 minerals the human body is made of. EMF radiation depletes cellular minerals through stress response. Sea moss rapidly replenishes the mineral matrix.", benefits: ["92 of 102 body minerals", "Iodine, potassium, magnesium, iron, zinc", "Wildcrafted — not farmed, no heavy metals"] },
  { id: 14, category: "Supplements", name: "Colloidal Silver 10 PPM (4 oz)", price: 25.29, rating: 4.7, badge: null, color: "#94a3b8", icon: "🥛", desc: "True ionic colloidal silver at 10 PPM. Silver ions have documented antimicrobial and anti-inflammatory effects. Used historically for immune support, topical wound healing, and water purification in emergencies.", benefits: ["10 PPM — optimal therapeutic range", "99.99% pure silver", "Can be used as emergency water purifier"] },
  { id: 15, category: "Supplements", name: "ORMUS Monoatomic Gold Elixir", price: 60.49, rating: 4.8, badge: "Rare", color: "#f59e0b", icon: "✨", desc: "Orbitally Rearranged Monoatomic Elements (ORMUS) — m-state gold extracted via the wet method. Bearden's research connects ORMUS to the vacuum potential / scalar field. Reported to enhance cellular coherence and EMF resilience.", benefits: ["Wet-method ORMUS extraction", "Pineal gland activation support", "Scalar field coherence enhancement"] },
  { id: 16, category: "Supplements", name: "Magnesium + Iron + Zinc Triple Mineral", price: 30.79, rating: 4.8, badge: "Essential", color: "#06b6d4", icon: "💊", desc: "Chelated magnesium glycinate + iron bisglycinate + zinc picolinate in optimal ratios. EMF exposure is documented to deplete magnesium (cellular voltage gating), reduce iron (hemoglobin), and impair zinc (immune function).", benefits: ["Magnesium glycinate (highest absorption)", "Iron bisglycinate (non-constipating)", "Zinc picolinate + copper balance"] },

  // Water
  { id: 17, category: "Water & Detox", name: "Berkey-Style Gravity Water Filter + Fluoride Filters", price: 208.99, rating: 4.9, badge: "Emergency Ready", color: "#3b82f6", icon: "💧", desc: "Gravity-fed stainless steel filter with Black Berkey elements + fluoride/arsenic reduction filters. Removes 99.9999% bacteria, viruses, heavy metals, chlorine, fluoride, pharmaceuticals. No power needed — functions in grid-down scenarios.", benefits: ["Removes 99.9999% pathogens", "Fluoride + arsenic PF-2 filters included", "No electricity — pure gravity flow"] },
  { id: 18, category: "Water & Detox", name: "Shower Filter (Chlorine + Fluoride)", price: 49.49, rating: 4.7, badge: null, color: "#22c55e", icon: "🚿", desc: "Multi-stage shower filter with KDF-55 + activated carbon + calcium sulfite. Removes chlorine, chloramines, fluoride, and VOCs from shower water. Skin and lung absorption of chlorine in hot showers exceeds drinking water exposure.", benefits: ["KDF-55 removes 99% chlorine", "Reduces fluoride and chloramines", "Replaceable cartridge every 6 months"] },
  { id: 19, category: "Water & Detox", name: "Structured Water Vortex Device", price: 82.49, rating: 4.6, badge: null, color: "#a855f7", icon: "🌀", desc: "Inline vortex structured water unit — creates anti-clockwise spiral flow that breaks water clusters, increasing hexagonal water percentage. Structured water is documented to have higher cellular absorption and hydration efficiency.", benefits: ["Vortex restructuring geometry", "Increases hexagonal (EZ) water percentage", "No filters — maintenance-free"] },
  { id: 20, category: "Water & Detox", name: "Activated Charcoal Emergency Water Kit", price: 20.89, rating: 4.5, badge: "Survival", color: "#374151", icon: "⬛", desc: "Food-grade activated coconut charcoal + ceramic filter tube for emergency water purification. Can be combined with colloidal silver and UV sunlight exposure for a complete field water purification system.", benefits: ["Activated coconut charcoal", "Removes toxins, pesticides, heavy metals", "Emergency off-grid water purification"] },
];

const CATEGORIES = ["All", "Jewelry", "Car & Home", "Faraday Clothing", "Supplements", "Water & Detox"];

// ── DIY Guide Data ─────────────────────────────────────────────────────
const DIY_GUIDES = [
  {
    title: "Build a DIY Faraday Cage",
    icon: "⚡",
    color: "#f59e0b",
    intro: "A Faraday cage is a conductive enclosure that blocks external electromagnetic fields. Named after Michael Faraday (1836). Used for protecting electronics, sensitive equipment, and increasingly — for personal EMF refuge rooms.",
    steps: [
      { step: "Choose your conductive material", detail: "Fine copper or aluminum mesh (window screen gauge or finer). 2–3 layers of aluminum foil also works for a quick version. For a room: copper foil tape applied in overlapping strips on walls, floor, ceiling." },
      { step: "Build the frame", detail: "For a box: use wood frame (non-conductive) and line all 6 sides (including lid and base) with overlapping mesh. For a room: apply copper foil in overlapping runs on all wall surfaces, ceiling, floor under flooring or rug." },
      { step: "Ensure electrical continuity", detail: "All seams MUST be electrically continuous. Use conductive tape at all joints. Test with a multimeter — resistance across any two points on the cage should be <1Ω. A break in continuity creates a gap that leaks EMF." },
      { step: "Ground the cage", detail: "Connect a grounding wire from the cage to a true earth ground (grounding rod driven into soil, or building's grounding system). This drains induced charges to earth rather than building up voltage on the cage." },
      { step: "Treat entry points", detail: "Doors/windows are the weak point. For a room: use conductive threshold strips under door, overlap copper mesh over door frame with a conductive gasket on the door edge. A Faraday 'sleeping canopy' uses silver-mesh fabric for portable protection." },
      { step: "Verify with a test", detail: "Take a cell phone into the sealed cage. It should show 'No Service' within 30 seconds. Alternatively, take an AM radio inside — it should go silent. These are practical verification methods used by EMF shielding professionals." },
    ],
    materials: ["Copper or aluminum mesh (hardware store)", "Conductive tape (copper foil tape)", "Grounding rod + wire", "Wood frame or existing room walls", "Multimeter for continuity testing"],
  },
  {
    title: "Home EMF Protection Protocol",
    icon: "🏠",
    color: "#22c55e",
    intro: "A room-by-room protocol for reducing your EMF exposure at home. Based on documented exposure reduction principles — no pseudoscience, just distance, shielding, and source elimination.",
    steps: [
      { step: "Audit your sources", detail: "Walk your home with a trifield meter (TF2 recommended) or EMF detector app. Identify hotspots: WiFi router (highest), smart meter (pulses every 30s), microwave oven, baby monitors, smart TVs, gaming consoles. Map the exposure zones." },
      { step: "Bedroom — sleep sanctuary", detail: "Move your WiFi router out of or far from your bedroom. Switch to airplane mode on all phones at night OR plug into ethernet and turn WiFi off. If you must keep a phone: 6+ feet away, face down. Consider a silver-mesh canopy over the bed. Your body repairs during sleep — this is your highest-value intervention." },
      { step: "Router management", detail: "Place router in central location away from seating areas. Install a router EMF timer that cuts power 11pm–7am (automatic). OR switch to powerline ethernet adapters throughout home and disable WiFi entirely." },
      { step: "Smart meter shielding", detail: "Install the smart meter Faraday guard (see products). Most smart meters pulse 900 MHz every 15–30 seconds — this penetrates most wall materials. A stainless Faraday cover blocks 95%+ of this specific emission." },
      { step: "Kitchen EMF reduction", detail: "Never stand within 3 feet of a running microwave — 2.4 GHz at close range is intense. Unplug smart appliances when not in use. Smart refrigerators, dishwashers, and ovens have constant WiFi polling even when 'off'." },
      { step: "Grounding (Earthing)", detail: "Direct skin contact with the earth (bare feet on soil, grass, sand) neutralizes accumulated body voltage from EMF exposure. 20 minutes daily is documented to reduce cortisol, inflammation markers, and improve sleep quality. Indoor earthing mats connect to the ground pin of an outlet." },
    ],
    materials: ["TriField TF2 EMF meter (~$180)", "Ethernet switch + CAT6 cables", "Smart plug timers (for router)", "Smart meter Faraday cover", "Earthing mat (indoor grounding)"],
  },
  {
    title: "Emergency Water Purification (Off-Grid)",
    icon: "💧",
    color: "#3b82f6",
    intro: "In a grid-down or contamination emergency, clean water is critical within 72 hours. These methods use non-electric purification with materials available at hardware stores, health food stores, or that you may already own.",
    steps: [
      { step: "Pre-filter with layers", detail: "Build a pre-filter in a 2-liter bottle: layer from bottom up — fine clean cloth, activated charcoal (2 inches), fine sand (2 inches), coarse sand (2 inches), gravel (2 inches), cloth layer on top. This removes particulates and many chemicals before final purification." },
      { step: "Boiling (most reliable)", detail: "Bring water to a full rolling boil for 1 minute (3 minutes at altitude >6,500 ft). Kills 100% of pathogens. Does NOT remove chemicals, heavy metals, or fluoride — only biological threats. Let cool in covered container." },
      { step: "Colloidal silver method", detail: "Add 1 tsp of 10 PPM colloidal silver per quart of pre-filtered water. Wait 4–6 minutes. Silver ions kill bacteria and viruses at contact. Effective against most waterborne pathogens. Does not remove chemicals — combine with activated charcoal." },
      { step: "Solar SODIS method", detail: "Fill clear PET plastic bottles (1.5–2L), lay on reflective surface (aluminum foil) in direct sunlight for 6 hours (12+ if cloudy). UV-A radiation inactivates bacteria, viruses, protozoa. SODIS is a WHO-validated method used in over 50 countries." },
      { step: "Activated charcoal purification", detail: "Add 1 tablespoon of food-grade activated charcoal powder per quart of water, stir vigorously, let settle 8+ hours (overnight), decant or filter through cloth. Removes toxins, pesticides, chlorine, VOCs, many pharmaceuticals, and some heavy metals." },
      { step: "Long-term storage", detail: "Store purified water in food-grade glass or HDPE (#2) containers — avoid PET for long-term storage. Add 2–3 drops of colloidal silver per gallon for preservation. Store in dark, cool location. Rotate every 6 months." },
    ],
    materials: ["Clear PET bottles (SODIS)", "Food-grade activated charcoal", "Colloidal silver (10 PPM)", "Fine sand, gravel, cloth (pre-filter)", "2-liter plastic bottles for DIY filter"],
  },
  {
    title: "Body Mineral Recovery Protocol",
    icon: "🌿",
    color: "#22c55e",
    intro: "EMF exposure activates voltage-gated calcium channels (Pall, 2013), deplete intracellular magnesium, and triggers oxidative stress that consumes zinc and selenium. This protocol replenishes the key minerals via food + supplementation.",
    steps: [
      { step: "Sea moss base (92 minerals)", detail: "Take 1–2 tablespoons of raw sea moss gel daily — add to smoothies, teas, or eat plain. Sea moss is the highest-density mineral food on earth. Start slowly — the iodine content can temporarily affect thyroid in sensitive people (start with 1 tsp/day)." },
      { step: "Magnesium (first priority)", detail: "Magnesium glycinate or threonate: 300–400mg daily before bed. Magnesium is the most depleted mineral in EMF exposure — it regulates over 300 enzyme reactions and is the primary voltage buffer in cell membranes. Low magnesium = high cellular EMF sensitivity." },
      { step: "Zinc + copper balance", detail: "Zinc picolinate: 15–30mg daily with food. CRITICAL: always pair with 1–2mg copper — zinc supplementation without copper creates copper deficiency over time. Zinc is required for DNA repair (critical in EMF-exposed tissue) and immune function." },
      { step: "Iron (if deficient)", detail: "Iron bisglycinate: 18–25mg daily (check levels first with ferritin blood test). Iron is required for hemoglobin — oxygen transport capacity. EMF biological stress increases iron demand. Bisglycinate form is non-constipating and 3× more absorbable than ferrous sulfate." },
      { step: "ORMUS and trace elements", detail: "Take ORMUS elixir: 3–7 drops under tongue, hold 60 seconds before swallowing, 2× daily. M-state elements in ORMUS include rhodium, iridium, and gold — Bearden's research links these to superconducting biological states and vacuum potential coherence at the cellular level." },
      { step: "Colloidal silver protocol", detail: "1 tsp colloidal silver (10 PPM) on empty stomach daily. Silver is antimicrobial, anti-inflammatory, and documented to support mitochondrial function. Not for long-term daily use >30 days without cycling — take 30 days on, 7 days off." },
    ],
    materials: ["Raw sea moss gel (wildcrafted)", "Magnesium glycinate capsules", "Zinc picolinate + copper supplement", "Iron bisglycinate capsules", "ORMUS elixir", "Colloidal silver 10 PPM"],
  },
];

// ── Components ─────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all flex flex-col">
      <div className="h-1" style={{ backgroundColor: product.color }} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: product.color + "20" }}>
            {product.icon}
          </div>
          <div className="flex flex-col items-end gap-1">
            {product.badge && (
              <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: product.color + "25", color: product.color }}>
                {product.badge}
              </span>
            )}
            <div className="flex items-center gap-1">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold">{product.rating}</span>
            </div>
          </div>
        </div>

        <h3 className="text-white font-bold text-sm leading-snug mb-1">{product.name}</h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-3 flex-1">{product.desc}</p>

        <div className="space-y-1 mb-4">
          {product.benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
              <CheckCircle2 size={11} className="flex-shrink-0 mt-0.5" style={{ color: product.color }} />
              {b}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <span className="text-green-400 font-black text-lg">${product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: product.color }}
          >
            <ShoppingCart size={12} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function GuideCard({ guide }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="h-1" style={{ backgroundColor: guide.color }} />
      <div className="p-5">
        <button className="w-full text-left" onClick={() => setExpanded(e => !e)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{guide.icon}</span>
              <div>
                <h3 className="text-white font-bold text-base">{guide.title}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{guide.steps.length} steps · Free guide</p>
              </div>
            </div>
            {expanded ? <ChevronUp size={16} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />}
          </div>
        </button>

        {expanded && (
          <div className="mt-5 space-y-5">
            <p className="text-gray-300 text-sm leading-relaxed">{guide.intro}</p>

            <div className="space-y-3">
              {guide.steps.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                    style={{ backgroundColor: guide.color }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{s.step}</p>
                    <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Materials needed:</p>
              <ul className="space-y-1">
                {guide.materials.map((m, i) => (
                  <li key={i} className="text-gray-300 text-xs flex gap-2">
                    <span style={{ color: guide.color }}>•</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onRemove }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-gray-900 border-l border-gray-800 h-full overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-bold flex items-center gap-2"><ShoppingCart size={16} /> Cart ({cart.length} items)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-12">Your cart is empty</p>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-800">
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold leading-snug">{item.name}</p>
                <p className="text-gray-500 text-xs">Qty: {item.qty} · ${(item.price * item.qty).toFixed(2)}</p>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Total</span>
              <span className="text-green-400 font-black text-xl">${total.toFixed(2)}</span>
            </div>
            <div className="bg-yellow-950/40 border border-yellow-800/40 rounded-xl p-3 mb-4">
              <p className="text-yellow-300 text-xs flex items-start gap-2">
                <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" />
                Checkout via Stripe is available on the published app. Products ship within 3–5 business days.
              </p>
            </div>
            <button
              onClick={() => { if (window.self === window.top) alert("Stripe checkout coming soon on published app."); else alert("Checkout available on published app only."); }}
              className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-black text-sm transition-all">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function EMFProtectionShop() {
  const [tab, setTab] = useState("shop");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const filtered = categoryFilter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === categoryFilter);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const CAT_ICONS = { "All": "🛍️", "Jewelry": "💎", "Car & Home": "🏠", "Faraday Clothing": "👕", "Supplements": "🌿", "Water & Detox": "💧" };

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight flex items-center gap-2">
              <Shield size={16} className="text-green-400" /> EMF Protection Shop & Survival Guide
            </h1>
            <p className="text-gray-500 text-xs">Protection devices · Faraday clothing · Supplements · Water purification · DIY guides</p>
          </div>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900/40 hover:bg-green-800/60 border border-green-700 text-green-300 text-xs font-bold transition-all"
        >
          <ShoppingCart size={14} /> Cart
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-500 text-black text-xs font-black flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-gray-900 via-green-950/30 to-gray-900 border-b border-gray-800 px-5 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: "🛡️", label: "EMF Defense", sub: "Shielding & harmonizers" },
              { icon: "🧬", label: "Body Repair", sub: "92-mineral sea moss + ORMUS" },
              { icon: "💧", label: "Pure Water", sub: "Emergency filtration systems" },
              { icon: "📚", label: "Free Guides", sub: "DIY Faraday + protocols" },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-3">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-white font-bold text-sm">{label}</p>
                <p className="text-gray-500 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-5">
        {[["shop", "🛍️ Shop Products"], ["guides", "📚 Free Protection Guides"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === id ? "border-green-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "shop" && (
          <div className="p-5">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border font-semibold transition-all ${categoryFilter === cat ? "bg-green-900/40 border-green-600 text-green-300" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
                  {CAT_ICONS[cat]} {cat}
                </button>
              ))}
            </div>

            {/* Section label */}
            {categoryFilter !== "All" && (
              <div className="mb-4">
                <h2 className="text-white font-bold text-lg">{CAT_ICONS[categoryFilter]} {categoryFilter}</h2>
                <p className="text-gray-500 text-xs">{filtered.length} products</p>
              </div>
            )}

            {/* Category sections when "All" */}
            {categoryFilter === "All" ? (
              CATEGORIES.filter(c => c !== "All").map(cat => {
                const catProducts = PRODUCTS.filter(p => p.category === cat);
                return (
                  <div key={cat} className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl">{CAT_ICONS[cat]}</span>
                      <h2 className="text-white font-bold text-lg">{cat}</h2>
                      <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{catProducts.length} items</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {catProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
              </div>
            )}

            <div className="mt-8 text-center text-gray-600 text-xs">
              All products ship within 3–5 business days · Payments secured by Stripe · NDA applies to platform access
            </div>
          </div>
        )}

        {tab === "guides" && (
          <div className="p-5 max-w-4xl mx-auto space-y-4">
            <div className="bg-green-950/20 border border-green-900/30 rounded-xl p-4 mb-6">
              <p className="text-green-300 text-sm leading-relaxed">
                <strong>Free guides</strong> — the following protocols are provided freely as a public service. You do not need to purchase anything to implement these protections. Share freely.
              </p>
            </div>
            {DIY_GUIDES.map((guide, i) => <GuideCard key={i} guide={guide} />)}
          </div>
        )}
      </div>

      {showCart && <CartDrawer cart={cart} onClose={() => setShowCart(false)} onRemove={removeFromCart} />}
    </div>
  );
}