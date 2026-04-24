import { useState } from "react";
import { ShoppingCart, Truck, Zap, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ComponentKitMarketplace({ inventionTitle, inventionIcon }) {
  const [selectedKit, setSelectedKit] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample kits — in production, fetch from ComponentKit entity
  const kits = [
    {
      id: 1,
      name: "Bare Components Bundle",
      description: "All parts, unassembled. Standard sourcing from Digikey/Amazon.",
      price: 28700,
      assembly: "bare_components",
      leadTime: 5,
      components: ["Core magnet assembly", "Toroidal coil", "Regauging circuit", "Power supply module"],
    },
    {
      id: 2,
      name: "Partially Assembled Kit",
      description: "Coils wound, magnets positioned. Ready for integration.",
      price: 49900,
      assembly: "partially_assembled",
      leadTime: 7,
      components: ["Pre-wound toroidal coil", "Magnet array (positioned)", "Regauging circuit", "Integration guide"],
    },
    {
      id: 3,
      name: "Fully Assembled Device",
      description: "Ready to test. Plug-and-play configuration.",
      price: 79900,
      assembly: "fully_assembled",
      leadTime: 14,
      components: ["Complete assembled unit", "Power supply", "Test leads & probes", "Documentation & support"],
    },
  ];

  const handleCheckout = async (kit) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = window.location.origin;
      const response = await base44.functions.invoke("createComponentCheckout", {
        kit_name: kit.name,
        invention_name: inventionTitle,
        price_cents: kit.price,
        customer_email: null, // Will be captured in checkout
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        alert("Failed to initiate checkout. Please try again.");
      }
    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAssemblyLabel = (level) => {
    const labels = {
      bare_components: "Unassembled",
      partially_assembled: "Partially Assembled",
      fully_assembled: "Fully Assembled",
    };
    return labels[level] || level;
  };

  const getAssemblyColor = (level) => {
    const colors = {
      bare_components: "bg-blue-950/30 border-blue-800 text-blue-300",
      partially_assembled: "bg-yellow-950/30 border-yellow-800 text-yellow-300",
      fully_assembled: "bg-green-950/30 border-green-800 text-green-300",
    };
    return colors[level] || "bg-gray-800";
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap size={18} className="text-cyan-400" />
        <h3 className="text-white font-black text-lg">Pre-Assembled Component Kits</h3>
        <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-cyan-600/20 border border-cyan-700 text-cyan-300 font-bold">
          Direct from manufacturer
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-5">
        Skip the sourcing phase. Order pre-assembled components built to spec for{" "}
        <span className="text-white font-bold">{inventionTitle}</span>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kits.map((kit) => (
          <div
            key={kit.id}
            className={`border rounded-xl p-5 transition-all cursor-pointer ${
              selectedKit?.id === kit.id
                ? "border-cyan-600 bg-cyan-950/20 shadow-lg shadow-cyan-500/20"
                : "border-gray-800 bg-gray-950/40 hover:border-gray-700"
            }`}
            onClick={() => setSelectedKit(kit)}
          >
            {/* Header */}
            <div className="mb-4">
              <h4 className="text-white font-bold text-sm mb-1">{kit.name}</h4>
              <div className={`inline-block text-xs font-bold px-2 py-1 rounded border mb-3 ${getAssemblyColor(kit.assembly)}`}>
                {getAssemblyLabel(kit.assembly)}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-xs leading-relaxed mb-4 h-16">{kit.description}</p>

            {/* Components preview */}
            <div className="mb-4 space-y-1">
              {kit.components.slice(0, 3).map((comp, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                  <Check size={10} className="text-cyan-400 flex-shrink-0" />
                  {comp}
                </div>
              ))}
              {kit.components.length > 3 && (
                <div className="text-xs text-gray-600">+ {kit.components.length - 3} more</div>
              )}
            </div>

            {/* Lead time */}
            <div className="flex items-center gap-1.5 mb-4 text-xs text-gray-500">
              <Truck size={12} />
              Est. {kit.leadTime} days
            </div>

            {/* Price + CTA */}
            <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Price</p>
                <p className="text-white font-black text-lg">${(kit.price / 100).toFixed(2)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout(kit);
                }}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
              >
                <ShoppingCart size={12} />
                {loading ? "Loading…" : "Buy Kit"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info callout */}
      <div className="mt-6 bg-blue-950/20 border border-blue-800/50 rounded-lg p-4">
        <p className="text-blue-300 text-xs leading-relaxed">
          <strong>How it works:</strong> Order a pre-assembled kit to save weeks of sourcing time. Each kit includes all components
          needed for {inventionTitle}. Track your order in the Members Dashboard once purchased.
        </p>
      </div>
    </div>
  );
}