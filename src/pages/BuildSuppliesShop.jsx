import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wrench, ExternalLink, ChevronDown, ChevronUp, Search, X } from "lucide-react";

const PRODUCTS = [
  {
    id: "meg-kit",
    name: "MEG Replication — Parts Reference",
    device: "Motionless Electromagnetic Generator",
    category: "Device Components",
    icon: "⚡",
    description: "Complete sourcing reference for replicating the MEG device (US Patent 6,362,718). All parts available from standard electronics distributors.",
    bom: [
      { qty: 2, item: "Toroidal Ferrite Core", spec: "Vitroperm 500F or Metglas 2714A, nanocrystalline, µr ~100,000", source: "Digikey / Mouser", estCost: "$18–$32 ea" },
      { qty: 4, item: "N52 Neodymium Bar Magnet", spec: "50mm × 10mm × 5mm, N52 grade", source: "K&J Magnetics / Amazon", estCost: "$4–$8 ea" },
      { qty: 1, item: "28 AWG Magnet Wire", spec: "200ft spool, single-build enamel coating", source: "Amazon / Newark", estCost: "$12–$18" },
      { qty: 4, item: "Hall Effect Sensor", spec: "SS49E or A1302, ratiometric linear output", source: "Digikey", estCost: "$1.50–$2.50 ea" },
      { qty: 1, item: "Bridge Rectifier Module", spec: "400V, 10A, KBPC1010", source: "Digikey / Amazon", estCost: "$2–$5" },
      { qty: 20, item: "Ferrite Bead Assortment", spec: "Various µH values, axial leaded", source: "Amazon", estCost: "$8–$12" },
      { qty: 2, item: "IRFP460 MOSFET", spec: "500V, 20A, TO-247 package", source: "Digikey / Mouser", estCost: "$3–$6 ea" },
      { qty: 1, item: "Arduino Nano", spec: "ATmega328, USB, 5V", source: "Amazon / Adafruit", estCost: "$5–$12" },
    ],
  },
  {
    id: "trd1-kit",
    name: "TRD-1 Telomere Device — Parts Reference",
    device: "Telomere Regeneration Device",
    category: "Device Components",
    icon: "🧬",
    description: "Sourcing guide for the TRD-1 frequency generator protocol. Standard lab components available from common suppliers.",
    bom: [
      { qty: 1, item: "Bifilar Scalar Coil (wound)", spec: "200T, 28 AWG, counter-wound pair on 51mm toroid", source: "Custom wind — see build plan", estCost: "$15–$25 materials" },
      { qty: 1, item: "DDS Function Generator", spec: "AD9833 or similar, 1Hz–12.5MHz, SPI programmable", source: "Amazon / Digikey", estCost: "$8–$25" },
      { qty: 1, item: "Shielded Aluminum Enclosure", spec: "Hammond 1590BB or equiv, ~120×95×34mm", source: "Mouser / Amazon", estCost: "$12–$20" },
      { qty: 10, item: "Film Capacitor Assortment", spec: "0.01µF–1µF, 63V, polypropylene", source: "Digikey / Amazon", estCost: "$8–$15" },
      { qty: 1, item: "Shielded Wiring Harness", spec: "24 AWG, multi-conductor, braided shield, 3ft", source: "Mouser / Amazon", estCost: "$10–$18" },
      { qty: 1, item: "Ferrite Snap-On Choke", spec: "31 material, 7mm ID, suitable for USB/signal cable", source: "Digikey / Amazon", estCost: "$2–$5" },
    ],
  },
  {
    id: "scalar-lab",
    name: "Scalar EM Lab Bench — Parts Reference",
    device: "General Scalar EM Research",
    category: "Lab Tools",
    icon: "🔬",
    description: "Essential bench setup components for any scalar EM researcher. All standard electronics lab equipment.",
    bom: [
      { qty: 1, item: "DDS Function Generator", spec: "0.01Hz–10MHz, 3.3/5V output, USB serial control", source: "Amazon / Aliexpress", estCost: "$25–$60" },
      { qty: 2, item: "Oscilloscope Probe ×10", spec: "BNC connector, 100MHz, 1M/10M switchable", source: "Amazon / Tequipment", estCost: "$12–$25 ea" },
      { qty: 1, item: "830-Point Breadboard", spec: "ABS, 2 power rails, standard 0.1\" pitch", source: "Amazon / Adafruit", estCost: "$6–$12" },
      { qty: 1, item: "Resistor/Capacitor Kit", spec: "600pc, 1/4W resistors + 100nF–100µF capacitors", source: "Amazon", estCost: "$12–$20" },
      { qty: 6, item: "Shielded Coaxial Cable", spec: "BNC-BNC, RG58, 1m length", source: "Amazon / B&H", estCost: "$5–$10 ea" },
      { qty: 1, item: "Anti-Static Work Mat", spec: "12×24\", ESD-safe rubber, ground snap", source: "Amazon", estCost: "$15–$30" },
    ],
  },
  {
    id: "priore-bundle",
    name: "Prioré System — Parts Reference",
    device: "Prioré EM Treatment System",
    category: "Device Components",
    icon: "🏥",
    description: "Sourcing reference for beginning Prioré system study, based on the ONR-validated device (Bateman, 1978).",
    bom: [
      { qty: 1, item: "Helmholtz Coil Set", spec: "300mm diameter pair, 150mm spacing, 100T each, 22 AWG", source: "Custom wind / Teachspin", estCost: "$40–$80 materials" },
      { qty: 1, item: "RF Oscillator Module", spec: "27.12 MHz ISM band, crystal controlled, ±50ppm", source: "Mouser / custom PCB", estCost: "$15–$30" },
      { qty: 1, item: "Neon Plasma Tube", spec: "NE-2H or similar, 110V trigger, 1/2W", source: "Digikey / Amazon", estCost: "$3–$8" },
      { qty: 5, item: "High-Voltage Film Capacitor", spec: "1kV, 10nF, polypropylene, CDE/WIMA", source: "Digikey / Mouser", estCost: "$2–$5 ea" },
      { qty: 1, item: "Copper Mesh (Faraday)", spec: "18×18\", 30 mesh/inch, bare copper", source: "Amazon / TWP Inc.", estCost: "$20–$40" },
      { qty: 1, item: "Bench Power Supply", spec: "12V/10A regulated DC, adjustable", source: "Amazon", estCost: "$35–$60" },
    ],
  },
  {
    id: "tool-kit",
    name: "EM Assembly Tools — Reference List",
    device: "All Device Builds",
    category: "Lab Tools",
    icon: "🔧",
    description: "Recommended tools for EM device construction. These are the tools referenced throughout the build plans.",
    bom: [
      { qty: 1, item: "Soldering Station", spec: "Temperature-controlled, 60W, 200–480°C range", source: "Amazon (Hakko FX-888D equiv)", estCost: "$50–$110" },
      { qty: 1, item: "Solder + Flux Pen", spec: "60/40 rosin core 0.8mm solder + no-clean flux pen", source: "Amazon / Digikey", estCost: "$12–$20" },
      { qty: 1, item: "Desoldering Pump + Wick", spec: "ESD-safe plunger + 3.0mm braid wick", source: "Amazon", estCost: "$8–$15" },
      { qty: 1, item: "Digital Multimeter", spec: "Auto-ranging, AC/DC, continuity, 0.5% accuracy", source: "Amazon (Fluke 117 equiv)", estCost: "$30–$150" },
      { qty: 1, item: "RF Near-Field Probe", spec: "Magnetic + electric field, BNC output, 1MHz–1GHz", source: "Digikey / Langer", estCost: "$45–$120" },
      { qty: 1, item: "Wrist Strap + Mat", spec: "ESD 1MΩ wrist strap + grounded mat set", source: "Amazon", estCost: "$12–$25" },
    ],
  },
  {
    id: "gcom-parts",
    name: "G-Com Scalar Communicator — Parts Reference",
    device: "Gravitational Communications Device",
    category: "Device Components",
    icon: "📡",
    description: "Component sourcing guide for the G-Com device. Antenna coils must be wound and matched as a pair.",
    bom: [
      { qty: 2, item: "Scalar Bifilar Antenna Coil", spec: "Matched pair, 100T each, counter-wound on 51mm toroid", source: "Custom wind — see build plan", estCost: "$15–$25 materials ea" },
      { qty: 1, item: "Phase Conjugate Mirror Assembly", spec: "BaTiO₃ crystal + pump optics — see PCM build plan", source: "International Crystal / custom", estCost: "$80–$150" },
      { qty: 1, item: "RF Shielding Enclosure", spec: "Aluminum die-cast, Hammond 1590D or equiv", source: "Mouser / Amazon", estCost: "$18–$35" },
      { qty: 1, item: "Analog Phase Shifter Module", spec: "0–360° adjustable, 50Ω, 1–500MHz", source: "Minicircuits JSPHS-x", estCost: "$25–$50" },
      { qty: 1, item: "Isolation Transformer", spec: "1:1, 50VA, primary/secondary separate screens", source: "Mouser / Bel Fuse", estCost: "$30–$55" },
      { qty: 1, item: "Shielded Twisted Pair Cable", spec: "24 AWG, 6-conductor, foil+braid shield, 25ft", source: "Amazon / Belden", estCost: "$18–$35" },
    ],
  },
  {
    id: "trz-components",
    name: "TRZ Reactor — Parts Reference",
    device: "Time-Reversal Zone Reactor",
    category: "Device Components",
    icon: "⚛️",
    description: "Highest-precision sourcing reference in the lineup. Barium titanate crystals require individual testing and matching.",
    bom: [
      { qty: 4, item: "Barium Titanate Crystal", spec: "Optical grade, BaTiO₃, matched set ±2% Vπ", source: "International Crystal / MTI Corp", estCost: "$35–$80 ea" },
      { qty: 1, item: "Phase Conjugate Pump Module", spec: "532nm DPSS laser, 50mW, TEM00 mode", source: "Coherent / Roithner", estCost: "$120–$250" },
      { qty: 2, item: "Optical Rail Mount (Al)", spec: "300mm rail + 4× adjustable carriers, M4 compatible", source: "Thorlabs / Amazon", estCost: "$40–$80" },
      { qty: 3, item: "Piezoelectric Transducer", spec: "1MHz, 25mm diameter, NDT grade", source: "Olympus NDT / Digikey", estCost: "$25–$60 ea" },
      { qty: 1, item: "Low-Noise Shielded Coax", spec: "RG316, SMA connectors, 10ft, double shielded", source: "Amazon / Pasternack", estCost: "$15–$28" },
      { qty: 4, item: "Crystal Mounting Bracket", spec: "Kinematic 5-axis, M4 screws, Al alloy", source: "Thorlabs / Edmund Optics", estCost: "$18–$40 ea" },
    ],
  },
  {
    id: "emf-shield",
    name: "EMF Shielding Materials — Reference List",
    device: "Personal EMF Protection",
    category: "Protection",
    icon: "🛡️",
    description: "Personal protection and lab shielding materials. All available from standard suppliers.",
    bom: [
      { qty: 1, item: "Mu-Metal Shielding Sheet", spec: "12×12\", 0.010\" thick, annealed, >20,000 µr", source: "MuShield / Amazon", estCost: "$25–$50" },
      { qty: 1, item: "Copper Foil Tape", spec: "2\" × 15ft, conductive adhesive, 2 mil copper", source: "Amazon / Digi-Key", estCost: "$8–$15" },
      { qty: 1, item: "EMF-Blocking Fabric", spec: "Silver fiber, 47dB attenuation at 1GHz, 1 sq. yd", source: "LessEMF.com / Amazon", estCost: "$20–$40" },
      { qty: 10, item: "Ferrite Snap-On Choke", spec: "31 material, various IDs (3.5mm/7mm/9mm)", source: "Digikey / Fair-Rite", estCost: "$1.50–$4 ea" },
      { qty: 1, item: "3-Point Grounding Cable Set", spec: "14 AWG, alligator + banana + ring terminal", source: "Amazon", estCost: "$10–$18" },
    ],
  },
];

const CATEGORIES = ["All", "Device Components", "Lab Tools", "Protection"];

function BomTable({ bom }) {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left text-gray-500 font-semibold py-2 pr-3 w-10">Qty</th>
            <th className="text-left text-gray-500 font-semibold py-2 pr-4">Component</th>
            <th className="text-left text-gray-500 font-semibold py-2 pr-4 hidden sm:table-cell">Specification</th>
            <th className="text-left text-gray-500 font-semibold py-2 pr-3">Source</th>
            <th className="text-left text-gray-500 font-semibold py-2">Est. Cost</th>
          </tr>
        </thead>
        <tbody>
          {bom.map((row, i) => (
            <tr key={i} className={`border-b border-gray-800/60 ${i % 2 === 0 ? "bg-gray-800/20" : ""}`}>
              <td className="py-2 pr-3 font-bold text-cyan-400">{row.qty}</td>
              <td className="py-2 pr-4 text-gray-200 font-medium">{row.item}</td>
              <td className="py-2 pr-4 text-gray-500 hidden sm:table-cell">{row.spec}</td>
              <td className="py-2 pr-3 text-blue-400">{row.source}</td>
              <td className="py-2 text-green-400 font-semibold whitespace-nowrap">{row.estCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{product.icon}</span>
            <div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-700">{product.category}</span>
              <h3 className="text-white font-black text-sm leading-snug mt-1">{product.name}</h3>
              <p className="text-gray-500 text-xs">For: <span className="text-gray-400">{product.device}</span></p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg bg-blue-950/60 border border-blue-800 text-blue-300 font-bold whitespace-nowrap flex-shrink-0">
            {product.bom.length} parts
          </span>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed mb-3">{product.description}</p>

        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-2 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Hide" : "View"} Full BOM & Sourcing Guide
        </button>

        {expanded && <BomTable bom={product.bom} />}

        {expanded && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
            <ExternalLink size={10} />
            <span>Search part numbers on <a href="https://www.digikey.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Digikey</a>, <a href="https://www.mouser.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Mouser</a>, or <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Amazon</a></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BuildSuppliesShop() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter(p => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.device.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 sticky top-0 z-20 bg-gray-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base flex items-center gap-2">
              <Wrench size={15} className="text-yellow-400" /> Build Supplies — BOM & Sourcing Guide
            </h1>
            <p className="text-gray-500 text-xs">Member reference — find and source all components for every device build</p>
          </div>
        </div>
        <Link to="/invention-plans" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all">
          📐 Build Plans
        </Link>
      </div>

      {/* Hero */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 px-6 py-8 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          Source Every Part Yourself.
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
          Complete bill of materials for each device build — exact part numbers, specifications, recommended suppliers, and estimated costs. No middleman.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-gray-500">
          <span>🔬 {PRODUCTS.reduce((acc, p) => acc + p.bom.length, 0)}+ component references</span>
          <span>🏪 Digikey · Mouser · Amazon · specialty suppliers</span>
          <span>💰 Estimated costs included</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-gray-800 bg-gray-900/40">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                category === c ? "bg-yellow-900/50 border-yellow-700 text-yellow-300" : "border-gray-700 text-gray-500 hover:border-gray-500"
              }`}>
              {c}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search devices…"
            className="bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-7 py-1.5 text-xs text-white placeholder-gray-600 outline-none focus:border-gray-500 w-44"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"><X size={11} /></button>}
        </div>
        <span className="text-gray-600 text-xs">{filtered.length} devices</span>
      </div>

      {/* Product grid */}
      <div className="max-w-5xl mx-auto px-5 py-6 space-y-4">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">No results for "{search}"</div>
        )}

        <div className="mt-8 border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-600 text-xs">
            All part numbers and prices are estimates. Verify availability and pricing directly with suppliers. <Link to="/invention-plans" className="text-yellow-400 hover:underline">View full build plans →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}