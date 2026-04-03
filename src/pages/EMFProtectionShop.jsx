import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Shield, Zap, Droplets, Leaf, Home, Car, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const CATEGORIES = ["All", "Jewelry & Wearables", "Home Protection", "Car Protection", "Faraday Clothing", "Supplements & Minerals", "Water Filtration", "DIY Guides"];

const PRODUCTS = [
  // Jewelry & Wearables
  {
    id: 1, category: "Jewelry & Wearables", name: "Shungite EMF Protection Pendant", price: "$34", icon: "🪨",
    color: "#1e293b",
    badge: "Bestseller",
    description: "Authentic Karelia shungite contains fullerene C60 carbon structures documented to absorb and neutralize EMF radiation. Wear near the body for continuous field interaction.",
    specs: ["Authentic Type III Shungite from Karelia, Russia", "Carbon-fullerene lattice structure", "Cord length: 18 inches adjustable", "Polished smooth — 30mm × 25mm"],
    protection: "Personal field — 2–3 foot radius",
    link: "https://www.amazon.com/s?k=shungite+emf+pendant",
  },
  {
    id: 2, category: "Jewelry & Wearables", name: "Orgonite EMF Harmonizer Bracelet", price: "$28", icon: "🔮",
    color: "#4f46e5",
    badge: null,
    description: "Layered orgonite resin with copper coil and crushed black tourmaline crystals. Tourmaline is piezoelectric — generates a weak counter-field when under mechanical or EM stress.",
    specs: ["Black tourmaline + copper coil in resin matrix", "Piezoelectric tourmaline generates ~2–5µV counter-field", "Stretch band, fits wrist 6–8 inches", "Weight: 18g"],
    protection: "Wrist field — continuous wearable",
    link: "https://www.amazon.com/s?k=orgonite+emf+bracelet",
  },
  {
    id: 3, category: "Jewelry & Wearables", name: "Black Tourmaline Raw Crystal Set", price: "$22", icon: "💎",
    color: "#374151",
    badge: null,
    description: "Raw black tourmaline crystals (set of 5) for home placement at router, smart meter, and sleeping area. Tourmaline's piezoelectric properties create a counter-charge under EMF stress.",
    specs: ["5 raw crystals, 30–60mm each", "Piezoelectric mineral", "Carry pouch included", "Place at EMF sources: router, smart meter, breaker box"],
    protection: "Point-source neutralization",
    link: "https://www.amazon.com/s?k=black+tourmaline+crystals+emf",
  },
  {
    id: 4, category: "Jewelry & Wearables", name: "Quantum Scalar Energy Pendant", price: "$45", icon: "⚡",
    color: "#7c3aed",
    badge: null,
    description: "Japanese volcanic mineral lava base fused with quantum scalar resonance technology. Emits FIR (far-infrared) and negative ions — documented to counter positive ion accumulation from EMF exposure.",
    specs: ["Volcanic lava mineral base", "FIR emission: 8–14 µm wavelength", "Negative ion output: 1,500–2,000 ions/cm³", "Stainless steel setting"],
    protection: "Personal scalar field — all-day wear",
    link: "https://www.amazon.com/s?k=scalar+energy+pendant",
  },

  // Home Protection
  {
    id: 5, category: "Home Protection", name: "TriField TF2 EMF Meter", price: "$169", icon: "📡",
    color: "#0f766e",
    badge: "Essential",
    description: "Professional 3-axis EMF detector measuring magnetic fields, electric fields, and RF/microwave radiation. KNOW YOUR EXPOSURE before you protect — measure every room, appliance, and smart device.",
    specs: ["Magnetic: 0.1–100.0 mG", "Electric: 1–1,000 V/m", "RF: 20 MHz–6 GHz, up to 20 mW/m²", "Weighted peak detection mode"],
    protection: "Detection — know your exposure",
    link: "https://www.amazon.com/s?k=trifield+tf2+emf+meter",
  },
  {
    id: 6, category: "Home Protection", name: "Home EMF Protection Plug-In Device", price: "$49", icon: "🔌",
    color: "#dc2626",
    badge: null,
    description: "Plug-in EMF harmonizer for standard outlets. Uses a scalar energy emission module to restructure ambient EM fields within 30-foot radius. Covers one floor of a typical home.",
    specs: ["Coverage radius: ~30 feet", "Plugs into standard 110V outlet", "Scalar resonance emission", "No power draw — passive resonance unit"],
    protection: "Room-level field harmonization",
    link: "https://www.amazon.com/s?k=emf+harmonizer+plug+in",
  },
  {
    id: 7, category: "Home Protection", name: "Smart Meter Guard (Stainless Steel)", price: "$38", icon: "🛡️",
    color: "#6b7280",
    badge: "High Priority",
    description: "Stainless steel mesh Faraday guard that mounts over your home's smart meter. Documented to reduce smart meter RF radiation by up to 98% while allowing meter reading.",
    specs: ["Stainless steel mesh, 20% open area", "RF blocking: up to 98% reduction", "Fits most standard smart meters", "Weather resistant — outdoor rated"],
    protection: "Point-source blocking — smart meter",
    link: "https://www.amazon.com/s?k=smart+meter+guard+emf",
  },
  {
    id: 8, category: "Home Protection", name: "EMF Blocking Paint (YShield HSF54)", price: "$89", icon: "🎨",
    color: "#92400e",
    badge: null,
    description: "Carbon-based electrically conductive paint applied to walls, floors, and ceilings. Creates a full-room Faraday enclosure when connected to ground. Used in EMF-sensitive housing projects.",
    specs: ["Attenuation: 36 dB at 1 GHz (shielding effectiveness)", "Coverage: 250 mL covers ~5 sq meters per coat (2 coats required)", "Water-based, low VOC", "Must be grounded to circuit earth"],
    protection: "Room-level — full Faraday cage effect",
    link: "https://www.amazon.com/s?k=yshield+emf+shielding+paint",
  },
  {
    id: 9, category: "Home Protection", name: "Canopy EMF Shielding Bed Net", price: "$199", icon: "🛏️",
    color: "#1d4ed8",
    badge: "Sleep Protection",
    description: "Silver-threaded canopy net providing 360° EMF shielding around your sleeping area — the most critical 8 hours of the day. Silver threads create a Faraday mesh around the bed.",
    specs: ["Silver fiber mesh — 99% pure silver thread", "Attenuation: 25+ dB", "Fits Queen/King bed", "Ground strap included"],
    protection: "Full sleeping area — 360° coverage",
    link: "https://www.amazon.com/s?k=emf+shielding+bed+canopy+silver",
  },
  {
    id: 10, category: "Home Protection", name: "Router Guard EMF Blocker", price: "$29", icon: "📶",
    color: "#4338ca",
    badge: null,
    description: "Faraday cage enclosure that fits over your WiFi router, blocking 70–90% of router RF emissions while still allowing sufficient signal for normal internet use. Reduces whole-home ambient WiFi radiation.",
    specs: ["Galvanized steel mesh construction", "RF reduction: 70–90%", "Fits most standard routers", "Ventilated — prevents router overheating"],
    protection: "Router-level RF reduction",
    link: "https://www.amazon.com/s?k=router+guard+emf+faraday",
  },

  // Car Protection
  {
    id: 11, category: "Car Protection", name: "Car EMF Harmonizer Plug (12V)", price: "$35", icon: "🚗",
    color: "#b45309",
    badge: null,
    description: "12V cigarette lighter plug-in scalar harmonizer. Continuously neutralizes the strong EMF generated by your vehicle's alternator, electric motor (EV), and Bluetooth/cellular systems throughout the cabin.",
    specs: ["12V cigarette lighter connection", "Scalar resonance emission — cabin coverage", "LED indicator", "Compatible: all 12V vehicles including EVs"],
    protection: "Full vehicle cabin coverage",
    link: "https://www.amazon.com/s?k=car+emf+protection+12v+plug",
  },
  {
    id: 12, category: "Car Protection", name: "EV Battery EMF Shield Mat", price: "$79", icon: "⚡",
    color: "#15803d",
    badge: "EV Essential",
    description: "Carbon fiber + copper mesh mat designed to be placed over the battery pack tunnel in electric vehicles. EV motors produce intense magnetic fields at 50–400 Hz — this mat reduces floor-level exposure by up to 75%.",
    specs: ["Carbon fiber + copper mesh composite", "Frequency range: 50 Hz–10 kHz", "Magnetic field reduction: up to 75%", "Cut to size — fits any EV floor tunnel"],
    protection: "Floor-level EV magnetic field",
    link: "https://www.amazon.com/s?k=ev+emf+shield+car+floor+mat",
  },
  {
    id: 13, category: "Car Protection", name: "Cell Phone EMF Blocker Case", price: "$24", icon: "📱",
    color: "#0e7490",
    badge: null,
    description: "Wallet-style phone case with integrated Faraday fabric back panel. Blocks cell signal when closed — preventing constant background radiation during storage. Flip open to use normally.",
    specs: ["Faraday fabric back panel", "RFID blocking included", "Fits iPhone 12–15 / Samsung S21–S24", "PU leather exterior"],
    protection: "Phone EMF — off-body storage",
    link: "https://www.amazon.com/s?k=emf+blocking+phone+case",
  },

  // Faraday Clothing
  {
    id: 14, category: "Faraday Clothing", name: "Silver Fiber EMF Blocking Cap", price: "$42", icon: "🧢",
    color: "#6b7280",
    badge: null,
    description: "Lined with 35% silver fiber mesh — creates a partial Faraday cage around your skull. Critical for head-level RF protection from cellular towers, WiFi, and 5G antennas.",
    specs: ["35% silver fiber, 65% cotton", "RF attenuation: 20–25 dB", "Machine washable (cold, gentle)", "Unisex — one size fits most"],
    protection: "Head-level RF shielding",
    link: "https://www.amazon.com/s?k=silver+fiber+emf+blocking+cap",
  },
  {
    id: 15, category: "Faraday Clothing", name: "EMF Shielding Hoodie (Silver Lined)", price: "$89", icon: "🧥",
    color: "#374151",
    badge: "Bestseller",
    description: "Full hoodie with silver fiber woven throughout the fabric. Blocks 99%+ of RF/microwave and reduces ELF magnetic fields. Ideal for daily wear in high-EMF urban environments.",
    specs: ["Silver fiber content: 25%", "RF attenuation: 30+ dB (99%+ blockage)", "ELF reduction: ~40%", "Machine washable, sizes S–3XL"],
    protection: "Torso + arms — all-day RF shielding",
    link: "https://www.amazon.com/s?k=emf+shielding+hoodie+silver",
  },
  {
    id: 16, category: "Faraday Clothing", name: "Faraday Boxer Briefs / Underwear", price: "$55", icon: "🩲",
    color: "#1d4ed8",
    badge: "Fertility Protection",
    description: "Silver mesh underwear protecting reproductive organs from laptop, phone, and 5G radiation. Studies link scrotal/pelvic EMF exposure to reduced sperm motility and fertility issues.",
    specs: ["Silver fiber lining throughout", "RF attenuation: 25+ dB", "Breathable — moisture wicking", "Sizes XS–3XL, men's and women's"],
    protection: "Reproductive organ RF shielding",
    link: "https://www.amazon.com/s?k=emf+shielding+underwear+silver",
  },
  {
    id: 17, category: "Faraday Clothing", name: "Pregnancy EMF Shield Belly Band", price: "$65", icon: "🤰",
    color: "#be185d",
    badge: "Critical",
    description: "Silver fiber belly band providing 360° shielding around the womb. Used by EMF-sensitive mothers to protect developing fetuses from WiFi, cellular, and smart home device radiation.",
    specs: ["Silver fiber wrap — 360° coverage", "Fits belly sizes 28–45 inches", "RF attenuation: 25 dB", "Breathable cotton outer layer"],
    protection: "Fetal protection — 360° womb shielding",
    link: "https://www.amazon.com/s?k=emf+protection+pregnancy+belly+band",
  },

  // Supplements & Minerals
  {
    id: 18, category: "Supplements & Minerals", name: "Wildcrafted Sea Moss Gel (Irish Moss)", price: "$29", icon: "🌿",
    color: "#15803d",
    badge: "92 Minerals",
    description: "Wildcrafted Chondrus crispus sea moss contains 92 of the 102 minerals the human body needs. EMF exposure depletes key minerals (magnesium, iodine, zinc) through cellular stress — sea moss replenishes them all.",
    specs: ["92 of 102 minerals present", "Rich in iodine (thyroid protection)", "Magnesium, potassium, calcium, zinc", "Wildcrafted — no chemicals or bleaching"],
    protection: "Full-spectrum mineral replenishment",
    link: "https://www.amazon.com/s?k=wildcrafted+sea+moss+gel",
  },
  {
    id: 19, category: "Supplements & Minerals", name: "Colloidal Silver (500 PPM)", price: "$35", icon: "🥈",
    color: "#94a3b8",
    badge: null,
    description: "True colloidal silver with 500 PPM silver particle concentration. Silver is a powerful antimicrobial and has been documented to interact with bioelectric fields. Used historically for immune support and pathogen neutralization.",
    specs: ["500 PPM silver concentration", "Particle size: 0.001–0.01 microns", "True colloid — not ionic silver", "2 oz dropper bottle"],
    protection: "Immune + bioelectric support",
    link: "https://www.amazon.com/s?k=colloidal+silver+500+ppm",
  },
  {
    id: 20, category: "Supplements & Minerals", name: "ORMUS Monoatomic Gold Supplement", price: "$55", icon: "✨",
    color: "#d97706",
    badge: null,
    description: "Orbitally Rearranged Monoatomic Elements (ORMUS) — a class of mineral compounds theorized to interact with scalar/torsion fields. Made from ocean sea water concentrate using the wet-gate process. Reported benefits: enhanced nervous system conductivity and biofield coherence.",
    specs: ["Ocean-derived sea water concentrate", "Wet-gate precipitation process", "Contains: gold, rhodium, iridium, platinum group", "30 mL dropper — 60 servings"],
    protection: "Biofield coherence enhancement",
    link: "https://www.amazon.com/s?k=ormus+monoatomic+gold+supplement",
  },
  {
    id: 21, category: "Supplements & Minerals", name: "Magnesium Glycinate (400mg)", price: "$22", icon: "💊",
    color: "#0369a1",
    badge: "Most Depleted",
    description: "EMF exposure has been linked to cellular magnesium depletion — magnesium is essential for 300+ enzymatic reactions and mitochondrial function. Glycinate form has highest absorption and doesn't cause GI upset.",
    specs: ["400mg elemental magnesium per serving", "Glycinate chelate — highest bioavailability", "No laxative effect (unlike oxide/citrate)", "120 capsules — 4 month supply"],
    protection: "Cellular energy restoration",
    link: "https://www.amazon.com/s?k=magnesium+glycinate+400mg",
  },
  {
    id: 22, category: "Supplements & Minerals", name: "Ionic Zinc + Copper Liquid", price: "$19", icon: "⚗️",
    color: "#a16207",
    badge: null,
    description: "Ionic (most bioavailable) zinc and copper in balanced ratio. Zinc is critical for immune function, testosterone, and cellular repair. EMF research links chronic exposure to zinc status reduction. Copper balances zinc absorption.",
    specs: ["Zinc: 15mg per serving (ionic form)", "Copper: 1mg (maintains Zn:Cu balance)", "Liquid drops — 98% absorption rate", "60-day supply"],
    protection: "Immune + hormonal mineral support",
    link: "https://www.amazon.com/s?k=ionic+zinc+copper+liquid",
  },
  {
    id: 23, category: "Supplements & Minerals", name: "Nascent Iodine (400mcg)", price: "$28", icon: "🔴",
    color: "#991b1b",
    badge: "Thyroid Shield",
    description: "Nascent iodine (atomic I₁ form) protects the thyroid gland — the body's most EMF-sensitive organ. Iodine saturates thyroid receptors, blocking uptake of radioactive iodine-131 and reducing thyroid EMF sensitivity.",
    specs: ["400 mcg nascent iodine per 2 drops", "Detoxified atomic form (I₁)", "1 fl oz — 600 servings", "Protects thyroid from RF/microwave sensitivity"],
    protection: "Thyroid gland protection",
    link: "https://www.amazon.com/s?k=nascent+iodine+drops",
  },
  {
    id: 24, category: "Supplements & Minerals", name: "Iron Bisglycinate + Vitamin C", price: "$18", icon: "🔩",
    color: "#c2410c",
    badge: null,
    description: "Iron bisglycinate (gentle, non-constipating form) paired with vitamin C for maximum absorption. Iron is critical for hemoglobin oxygen transport — EMF exposure increases free radical load, consuming iron stores more rapidly.",
    specs: ["Iron bisglycinate: 25mg elemental iron", "Vitamin C: 125mg (enhances absorption 3×)", "Gentle — non-constipating bisglycinate chelate", "60 capsules"],
    protection: "Oxygen transport + cellular repair",
    link: "https://www.amazon.com/s?k=iron+bisglycinate+vitamin+c",
  },

  // Water Filtration
  {
    id: 25, category: "Water Filtration", name: "Berkey Black Water Filter System", price: "$289", icon: "💧",
    color: "#0369a1",
    badge: "Emergency Essential",
    description: "Gravity-fed stainless steel filtration system requiring NO electricity or water pressure. Removes 99.9999% of pathogens, heavy metals, pharmaceuticals, fluoride, chlorine, and herbicides. Works on any water source — tap, river, rain, or well.",
    specs: ["Removes 99.9999% bacteria, 99.999% viruses", "Removes fluoride, chlorine, lead, arsenic", "Gravity-fed — no power or pressure required", "2.25 gallon capacity — serves 4 people indefinitely"],
    protection: "Full-spectrum water purification — any source",
    link: "https://www.amazon.com/s?k=berkey+water+filter+system",
  },
  {
    id: 26, category: "Water Filtration", name: "Shower Filter (Chlorine + Fluoride)", price: "$45", icon: "🚿",
    color: "#0e7490",
    badge: null,
    description: "Inline shower filter removing chlorine, chloramines, fluoride, and heavy metals from bathing water. Skin absorbs chemicals directly in the shower — often a higher exposure than drinking water.",
    specs: ["Removes: chlorine, chloramines, fluoride, lead", "Vitamin C + KDF-55 + activated carbon", "Fits standard shower heads (3/4\" thread)", "Filter life: 6 months / ~10,000 gallons"],
    protection: "Bathing water — skin absorption protection",
    link: "https://www.amazon.com/s?k=shower+filter+fluoride+chlorine",
  },
  {
    id: 27, category: "Water Filtration", name: "Reverse Osmosis Under-Sink System (5-Stage)", price: "$179", icon: "🏠",
    color: "#1d4ed8",
    badge: null,
    description: "5-stage RO system removing 99%+ of dissolved solids including fluoride, chloramine, heavy metals, pharmaceuticals, and microplastics from drinking water at the tap.",
    specs: ["5 stages: sediment → carbon → RO membrane → carbon → mineral stone", "Removes 99%+ TDS, fluoride, lead, arsenic", "50 GPD production rate", "Remineralization filter adds calcium/magnesium back"],
    protection: "Drinking water — near-total contaminant removal",
    link: "https://www.amazon.com/s?k=reverse+osmosis+under+sink+5+stage",
  },
  {
    id: 28, category: "Water Filtration", name: "Emergency Water Purification Tablets (Iodine)", price: "$12", icon: "💊",
    color: "#92400e",
    badge: "Survival Kit",
    description: "Iodine-based purification tablets treating up to 25 liters per pack. For emergency situations — natural disasters, grid-down scenarios, or when your primary filtration fails. Kills bacteria, viruses, and protozoa in 30 minutes.",
    specs: ["50 tablets per pack — treats 25 liters", "Active time: 30 minutes (clear water) / 60 min (cold/turbid)", "Kills: bacteria, viruses, Giardia, Cryptosporidium", "10-year shelf life"],
    protection: "Emergency purification — any water source",
    link: "https://www.amazon.com/s?k=iodine+water+purification+tablets",
  },
  {
    id: 29, category: "Water Filtration", name: "LifeStraw Personal Water Filter", price: "$19", icon: "🥤",
    color: "#059669",
    badge: null,
    description: "Personal straw-style filter for direct-from-source drinking. Removes 99.9999% of bacteria and 99.999% of parasites with no batteries or moving parts. Essential bug-out bag item.",
    specs: ["Filters: bacteria (99.9999%), parasites (99.999%)", "1,000 gallon lifetime capacity", "No chemicals, no batteries, no moving parts", "Works on any fresh water source"],
    protection: "On-the-go emergency filtration",
    link: "https://www.amazon.com/s?k=lifestraw+personal+water+filter",
  },
];

const DIY_GUIDES = [
  {
    title: "DIY Faraday Cage — 3 Methods",
    icon: "⚡",
    color: "#f59e0b",
    summary: "Block EMP, directed energy weapons, and government surveillance signals from entering your home or storage areas.",
    steps: [
      { title: "Method 1: Galvanized Steel Trash Can (Easiest)", detail: "Purchase a galvanized steel trash can with a tight-fitting lid (Home Depot, ~$30). Line the inside bottom and sides with cardboard or foam to prevent your devices from touching the metal and short-circuiting. Place electronics inside. Seal the lid with aluminum tape for added RF seal. This creates a functional Faraday cage blocking all RF frequencies above ~1 MHz including 5G, WiFi, and cell signals." },
      { title: "Method 2: Copper Mesh Room Faraday Cage", detail: "Purchase 6-layer copper mesh (1mm pitch) from industrial suppliers. Frame with 2×4 wood studs. Staple copper mesh to all 6 surfaces (4 walls, floor, ceiling). Overlap all seams by 10cm and solder or crimp seams shut. Ground the mesh to an earth ground rod driven 6 feet into soil outside. Paint over with standard drywall compound for aesthetics. This creates a room-level Faraday cage effective against 5G (up to 60 GHz)." },
      { title: "Method 3: Window Film + EMF Paint Combo", detail: "Apply YShield EMF-blocking carbon paint (2 coats) to all wall surfaces. Connect each wall to a common ground strip. Apply EMF-blocking window film (Stewart FilmScreen or LLumar ClimaGuard) to all windows. This soft Faraday approach reduces room EMF by 99%+ without the visual impact of a mesh cage. Ground the paint layer through a 12 AWG wire to a ground rod. Verify with TriField TF2 meter before and after." },
    ],
    warning: "Faraday cages block all RF in and out — your phone and WiFi will not work inside. Plan accordingly.",
  },
  {
    title: "EMF Weapon Defense Protocol",
    icon: "🛡️",
    color: "#ef4444",
    summary: "Documented steps for protecting yourself from directed energy weapons, synthetic telepathy systems, and weaponized ELF entrainment signals.",
    steps: [
      { title: "Step 1: Identify Your Exposure", detail: "Purchase a TriField TF2 meter. Measure all rooms, paying attention to: the direction of anomalous readings (directed EMF has a source direction), unusual readings at night vs day (weapons often operate at night), and readings that correlate with symptoms (headache, tinnitus, fatigue, sleep disruption). Log all readings with timestamp and GPS location. This creates a legal evidence record." },
      { title: "Step 2: Harden Your Sleeping Area First", detail: "Your sleeping area is the highest priority — you are most vulnerable during 8 hours of sleep. Install: silver-lined bed canopy (blocks RF), copper mesh under mattress pad (blocks ELF magnetic fields), EMF paint on bedroom walls, router turned OFF at night (or physical timer switch). Ground all metal surfaces in the room to common earth ground." },
      { title: "Step 3: Personal Faraday Garments", detail: "Wear silver-fiber cap and hoodie during peak exposure periods. For suspected directed energy targeting: layer a silver fiber t-shirt + silver hoodie for 40–50 dB combined attenuation. Copper mesh underlayer provides additional magnetic field shielding. Grounding shoes (earthing sandals) complete the circuit — connecting your body to Earth's natural -30V DC ground potential, which counteracts the positive charge buildup from EMF exposure." },
      { title: "Step 4: Mineral Restoration Protocol", detail: "Directed energy exposure depletes: magnesium (cellular energy), iodine (thyroid), zinc (immune), iron (oxygen transport). Protocol: AM: sea moss gel (1 tbsp), nascent iodine (2 drops), ionic zinc. PM: magnesium glycinate (400mg), iron bisglycinate (if symptomatic). Weekly: colloidal silver (1 tsp, hold under tongue 60 seconds). This replenishes EMF-depleted minerals and supports bioelectric field coherence." },
    ],
    warning: "If you believe you are being targeted with directed energy, document everything with timestamps, seek medical evaluation, and contact an EMF testing professional.",
  },
  {
    title: "Home EMF Protection — Room by Room",
    icon: "🏠",
    color: "#22c55e",
    summary: "A room-by-room EMF reduction protocol using commercially available products and DIY techniques.",
    steps: [
      { title: "Bedroom (Priority 1)", detail: "Turn off WiFi router at night (use mechanical outlet timer, ~$8). Replace smart bulbs with incandescent or non-smart LED. Move alarm clock from beside head (use battery clock instead). Install EMF shielding bed canopy. Move phone OUT of bedroom — charge in hallway. If you must have phone, put in airplane mode. Install smart meter guard on exterior smart meter. This room should be your EMF sanctuary." },
      { title: "Kitchen (Priority 2)", detail: "Microwave: do NOT stand in front of it while running. Stand 6+ feet back. Better: replace with convection oven. WiFi router: relocate to a room you spend little time in. Smart appliances: disable WiFi connectivity features when possible (usually in app settings). Use wired internet via ethernet wherever possible — eliminates WiFi radiation entirely. Install router guard on your router." },
      { title: "Home Office / Living Room", detail: "Replace WiFi with ethernet: powerline ethernet adapters (~$40/pair) carry internet through your existing electrical wiring — no WiFi radiation, full internet speed. Desktop computer: use corded keyboard and mouse (Bluetooth keyboards emit constant RF). Monitor: add laptop EMF shield pad under laptop. Smart TV: disable WiFi/Bluetooth when using ethernet connection (settings menu)." },
      { title: "Outdoor / Neighborhood Level", detail: "Identify nearby cell towers using Antennasearch.com (enter your address). 5G small cells are often mounted on utility poles directly in front of homes — identify yours. If within 500 feet of a cell tower: EMF paint on exterior-facing wall + EMF window film on windows facing the tower. Plant dense evergreen hedges (fir, arborvitae) between your home and the tower — vegetation provides 10–15 dB of natural RF attenuation." },
    ],
    warning: null,
  },
  {
    title: "Emergency Water Purification (Any Source)",
    icon: "💧",
    color: "#3b82f6",
    summary: "Step-by-step water purification for emergency scenarios including grid-down, contaminated municipal water, or field conditions.",
    steps: [
      { title: "Step 1: Pre-Filter Visible Particles", detail: "If water is turbid (cloudy), pre-filter through: cloth → coffee filter → paper towel in sequence. Let sediment settle for 30 minutes. Use only the top 75% of settled water. This pre-filtration dramatically improves the effectiveness of subsequent purification steps and extends filter life." },
      { title: "Step 2: Solar Disinfection (SODIS — free)", detail: "Fill clear PET plastic bottles (not glass) completely with pre-filtered water. Leave NO air space. Lay flat in direct sunlight for 6 hours (sunny day) or 2 full days (cloudy). UV-A radiation (280–400nm) penetrates the plastic and inactivates 99.9%+ of pathogens. This is a WHO-validated technique used globally in disaster relief. Bottles must be clear PET (#1 plastic) — not HDPE." },
      { title: "Step 3: Chemical Purification (When Sun Unavailable)", detail: "Unscented liquid bleach (sodium hypochlorite 5.25–8.25%): add 8 drops per gallon of clear water, 16 drops per gallon of cloudy water. Stir and wait 30 minutes before drinking. OR: iodine tablets (50 tablets treat 25 liters — see product above). OR: boil for 1 minute (3 minutes above 6,500 feet altitude). Boiling is the most reliable method — kills all pathogens including Cryptosporidium." },
      { title: "Step 4: Re-Mineralize (Critical Long-Term)", detail: "Purified water strips minerals. For long-term use: add a pinch of Himalayan salt (5–6 minerals), a drop of ionic trace minerals, or a small piece of shungite stone (placed in water for 8+ hours — releases fulvic minerals). Sea moss gel added to water provides 92 minerals. Without remineralization, extended consumption of purely distilled or RO water can deplete body minerals over weeks." },
    ],
    warning: "Purification removes pathogens but NOT heavy metals or chemical contaminants. Use Berkey or RO system for chemical contamination. SODIS does not remove chemicals.",
  },
];

function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all flex flex-col">
      <div className="h-1" style={{ backgroundColor: product.color }} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{product.icon}</span>
            <div>
              {product.badge && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-1 inline-block" style={{ backgroundColor: product.color + "30", color: product.color }}>
                  {product.badge}
                </span>
              )}
              <h3 className="text-white font-bold text-sm leading-snug">{product.name}</h3>
            </div>
          </div>
          <span className="text-green-400 font-black text-lg whitespace-nowrap">{product.price}</span>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed mb-3">{product.description}</p>

        <div className="flex items-center gap-2 mb-3 text-xs">
          <Shield size={11} className="text-cyan-400 flex-shrink-0" />
          <span className="text-cyan-400 font-semibold">{product.protection}</span>
        </div>

        <button onClick={() => setExpanded(x => !x)} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-300 transition-colors mb-3">
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />} {expanded ? "Hide specs" : "Show specs"}
        </button>

        {expanded && (
          <ul className="mb-3 space-y-1">
            {product.specs.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                <CheckCircle2 size={10} className="text-green-500 flex-shrink-0 mt-0.5" />{s}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3 border-t border-gray-800">
          <a href={product.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: product.color || "#374151" }}>
            <ShoppingCart size={12} /> Find on Amazon →
          </a>
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
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl flex-shrink-0">{guide.icon}</span>
          <div>
            <h3 className="text-white font-bold text-base leading-snug">{guide.title}</h3>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{guide.summary}</p>
          </div>
        </div>

        {guide.warning && (
          <div className="flex items-start gap-2 bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-3 mb-3">
            <AlertTriangle size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-300 text-xs leading-relaxed">{guide.warning}</p>
          </div>
        )}

        <button onClick={() => setExpanded(x => !x)}
          className="flex items-center gap-1.5 text-xs font-bold transition-colors"
          style={{ color: guide.color }}>
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Hide Guide" : "View Full Guide"}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            {guide.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: guide.color + "25", color: guide.color }}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{step.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EMFProtectionShop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showGuides, setShowGuides] = useState(false);

  const filtered = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

  const catCounts = {};
  CATEGORIES.slice(1).forEach(c => { catCounts[c] = PRODUCTS.filter(p => p.category === c).length; });

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
              <Shield size={18} className="text-green-400" /> EMF Protection Shop & Survival Guide
            </h1>
            <p className="text-gray-500 text-xs">Jewelry · Home/Car devices · Faraday clothing · Supplements · Water filtration · DIY guides</p>
          </div>
        </div>
        <button onClick={() => setShowGuides(s => !s)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${showGuides ? "bg-red-900/40 border-red-600 text-red-300" : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}`}>
          🛡️ {showGuides ? "Hide Guides" : "View DIY Guides"}
        </button>
      </div>

      {/* Emergency banner */}
      <div className="bg-red-950/30 border-b border-red-900/30 px-6 py-2 flex items-start gap-3">
        <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-red-300 text-xs leading-relaxed">
          <strong>Sovereign Health Notice:</strong> EMF from 5G, smart meters, WiFi, and EV vehicles is a documented biological stressor. This shop provides tools for detection, shielding, mineral replenishment, and emergency water purification. Knowledge is protection.
        </p>
      </div>

      {/* DIY Guides section */}
      {showGuides && (
        <div className="border-b border-gray-800 px-6 py-6">
          <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <Info size={15} className="text-yellow-400" /> Free DIY Protection Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DIY_GUIDES.map((guide, i) => <GuideCard key={i} guide={guide} />)}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="px-6 py-3 border-b border-gray-800 flex gap-2 flex-wrap items-center">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${activeCategory === cat ? "bg-green-900/40 border-green-600 text-green-300 font-bold" : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"}`}>
            {cat} {cat !== "All" && catCounts[cat] ? `(${catCounts[cat]})` : ""}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-600">{filtered.length} products</span>
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Category sub-header */}
        {activeCategory !== "All" && (
          <div className="mb-5 p-4 rounded-xl bg-gray-900 border border-gray-800">
            {{
              "Jewelry & Wearables": { icon: "💎", text: "Scalar and mineral crystals worn on the body create continuous personal field protection. Shungite, tourmaline, and orgonite interact with ambient EM fields via piezoelectric and carbon-fullerene mechanisms." },
              "Home Protection": { icon: "🏠", text: "Layer your home protection: measure first (EMF meter), then block at source (smart meter guard, router guard), then shield key areas (EMF paint, bed canopy). Ground all shielding to earth." },
              "Car Protection": { icon: "🚗", text: "Modern vehicles — especially EVs — generate intense EMF from motors, alternators, and Bluetooth/cellular systems. The car cabin is a metal enclosure that can trap and amplify these fields." },
              "Faraday Clothing": { icon: "🧥", text: "Silver fiber clothing creates a wearable Faraday mesh. Most effective when layered: base layer + outer layer gives 40–50 dB combined RF attenuation. Wash cold, gentle cycle to preserve silver fibers." },
              "Supplements & Minerals": { icon: "🌿", text: "EMF exposure is documented to deplete Mg, Zn, I, and Fe via oxidative stress mechanisms. Replenish daily with sea moss (92 minerals), nascent iodine (thyroid), magnesium glycinate (cellular energy), and ionic zinc." },
              "Water Filtration": { icon: "💧", text: "Municipal water contains fluoride (neurotoxin), chloramine (carcinogen), microplastics, and pharmaceutical residues. Your skin absorbs shower water too — filter both drinking AND bathing water." },
              "DIY Guides": { icon: "🔧", text: "All guides are free below." },
            }[activeCategory] && (() => {
              const info = { "Jewelry & Wearables": { icon: "💎", text: "Scalar and mineral crystals worn on the body create continuous personal field protection." }, "Home Protection": { icon: "🏠", text: "Layer your home protection: measure first (EMF meter), then block at source, then shield key areas." }, "Car Protection": { icon: "🚗", text: "Modern vehicles generate intense EMF from motors, alternators, and Bluetooth/cellular systems." }, "Faraday Clothing": { icon: "🧥", text: "Silver fiber clothing creates a wearable Faraday mesh — most effective when layered." }, "Supplements & Minerals": { icon: "🌿", text: "EMF exposure depletes Mg, Zn, I, Fe via oxidative stress. Replenish daily with sea moss, iodine, magnesium, and zinc." }, "Water Filtration": { icon: "💧", text: "Filter both drinking AND bathing water — your skin absorbs shower water directly." } }[activeCategory];
              return info ? (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-2xl">{info.icon}</span>
                  <p className="text-gray-300">{info.text}</p>
                </div>
              ) : null;
            })()}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        <div className="mt-10 text-center text-gray-700 text-xs max-w-2xl mx-auto">
          Products link to Amazon search results. Verify specifications before purchase. This platform is for informational and educational purposes — not medical advice. Consult a qualified physician for health concerns.
        </div>
      </div>
    </div>
  );
}