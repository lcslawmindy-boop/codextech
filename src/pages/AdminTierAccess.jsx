import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Lock, Check } from "lucide-react";

const TIERS_DATA = {
  builder: {
    name: "Builder",
    price: "$39/mo",
    color: "#10b981",
    features: [
      "25% off all à la carte courses & build plans",
      "Bill of Materials & supplier guides",
      "Step-by-step instructions",
      "Build Video generator",
      "EM Lab simulators & visualization",
      "Prior Art Archive (200+ entries)",
      "Cancel anytime",
    ],
    locked: [
      "AI Invention Forge",
      "AI Patent Claims Generator",
      "AI Patent Drafting Tool",
      "FTO Analysis & IP Valuation",
      "Investor CRM & Pitch Builder",
      "Virtual Data Room (VDR)",
      "IP Portfolio Health Dashboard",
      "Co-Inventor Matching Network",
      "SBIR Grant Pipeline",
      "Patent Intelligence Monitor",
    ],
  },
  researcher: {
    name: "Researcher",
    price: "$59/mo",
    color: "#3b82f6",
    features: [
      "50% off all à la carte courses & build plans",
      "Bill of Materials & supplier guides",
      "Step-by-step instructions",
      "Build Video generator",
      "AI Invention Forge (unlimited dossiers)",
      "AI Patent Claims Generator",
      "AI Patent Drafting Tool (USPTO-compliant)",
      "Prior Art Archive with AI search (200+ entries)",
      "FTO Analysis & IP Valuation",
      "Patent Landscape Graph",
      "EM Lab simulators & visualization",
      "Access to courses",
      "Cancel anytime",
    ],
    locked: [
      "Downloadable PDFs & Bill of Materials (Pro only)",
      "Investor CRM & Pitch Builder",
      "Virtual Data Room (VDR)",
      "IP Portfolio Health Dashboard",
      "Co-Inventor Matching Network",
      "SBIR Grant Pipeline",
    ],
  },
  pro: {
    name: "Pro",
    price: "$89/mo",
    color: "#a855f7",
    features: [
      "50% off all à la carte courses & build plans",
      "ALL 40+ AI tools unlocked",
      "Downloadable PDFs for all build plans",
      "Bill of Materials & complete supplier lists",
      "Investor CRM & Pitch Builder",
      "Virtual Data Room (VDR)",
      "IP Portfolio Health Dashboard",
      "Co-Inventor Matching Network",
      "SBIR Grant Pipeline",
      "Patent Intelligence Monitor",
      "Acquisition CRM & pipeline management",
      "White-Label SaaS rights",
      "Priority support",
      "Cancel anytime",
    ],
    locked: [],
  },
};

export default function AdminTierAccess() {
  const [expandedTier, setExpandedTier] = useState("pro");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-5 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-6 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-lg flex items-center gap-2">
              <Eye size={20} /> Membership Tier Access
            </h1>
            <p className="text-gray-500 text-xs mt-1">View what each membership tier can access</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Overview */}
        <div className="mb-12 p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
          <h2 className="text-white font-black text-xl mb-4">Tier Structure Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(TIERS_DATA).map(([key, tier]) => (
              <div
                key={key}
                className="p-4 rounded-lg border-2 cursor-pointer transition-all"
                style={{
                  borderColor: tier.color,
                  backgroundColor: tier.color + "15",
                }}
                onClick={() => setExpandedTier(key)}
              >
                <h3 className="font-black text-lg" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{tier.price}</p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <Check size={14} style={{ color: tier.color }} />
                  <span className="text-gray-300">{tier.features.length} features included</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Lock size={14} className="text-gray-600" />
                  <span className="text-gray-400">{tier.locked.length} items locked</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Tier View */}
        <div className="space-y-8">
          {Object.entries(TIERS_DATA).map(([key, tier]) => (
            <div
              key={key}
              className="rounded-2xl border-2 overflow-hidden transition-all"
              style={{
                borderColor: tier.color,
                backgroundColor: key === expandedTier ? tier.color + "10" : tier.color + "05",
              }}
            >
              {/* Header */}
              <div
                className="p-6 cursor-pointer"
                style={{ backgroundColor: tier.color + "20" }}
                onClick={() => setExpandedTier(expandedTier === key ? null : key)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-2xl" style={{ color: tier.color }}>
                      {tier.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{tier.price}</p>
                  </div>
                  <div
                    className="text-3xl transition-transform"
                    style={{ transform: expandedTier === key ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▼
                  </div>
                </div>
              </div>

              {/* Content */}
              {expandedTier === key && (
                <div className="p-6 space-y-8 border-t-2" style={{ borderColor: tier.color + "30" }}>
                  {/* Included Features */}
                  <div>
                    <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                      <Check size={18} style={{ color: tier.color }} /> Included Features ({tier.features.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tier.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 flex items-start gap-3"
                        >
                          <Check size={14} className="flex-shrink-0 mt-1" style={{ color: tier.color }} />
                          <span className="text-gray-200 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Locked Features */}
                  {tier.locked.length > 0 && (
                    <div>
                      <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                        <Lock size={18} className="text-gray-600" /> Locked Features ({tier.locked.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tier.locked.map((feature, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-gray-800/30 border border-gray-700 border-dashed flex items-start gap-3 opacity-60"
                          >
                            <Lock size={14} className="flex-shrink-0 mt-1 text-gray-600" />
                            <span className="text-gray-500 text-sm line-through">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-700">
                    <p className="text-gray-300 text-sm">
                      <span className="font-bold">Total Access:</span> {tier.features.length} out of{" "}
                      {tier.features.length + tier.locked.length} features
                      {tier.locked.length === 0 && (
                        <span className="ml-2 text-green-400 font-bold">✓ Fully Unlocked</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-12 p-6 rounded-2xl border border-gray-800 bg-gray-900/60">
          <h2 className="text-white font-black text-xl mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-bold">Feature</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-bold" style={{ color: TIERS_DATA.builder.color }}>
                    Builder
                  </th>
                  <th className="text-center py-3 px-4 text-gray-300 font-bold" style={{ color: TIERS_DATA.researcher.color }}>
                    Researcher
                  </th>
                  <th className="text-center py-3 px-4 text-gray-300 font-bold" style={{ color: TIERS_DATA.pro.color }}>
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  "25% off à la carte",
                  "50% off à la carte",
                  "Bill of Materials",
                  "Build Video generator",
                  "Prior Art Archive",
                  "AI Invention Forge",
                  "AI Patent Drafting Tool",
                  "FTO Analysis",
                  "Investor CRM",
                  "Virtual Data Room",
                  "Downloadable PDFs",
                  "White-Label SaaS",
                ].map((feature, idx) => {
                  const builderHas = TIERS_DATA.builder.features.some(f => f.includes(feature.split(" ")[0]));
                  const researcherHas = TIERS_DATA.researcher.features.some(f => f.includes(feature.split(" ")[0]));
                  const proHas = TIERS_DATA.pro.features.some(f => f.includes(feature.split(" ")[0]));

                  return (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{feature}</td>
                      <td className="text-center py-3 px-4">
                        {builderHas ? (
                          <Check size={16} className="mx-auto" style={{ color: TIERS_DATA.builder.color }} />
                        ) : (
                          <Lock size={16} className="mx-auto text-gray-600" />
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {researcherHas ? (
                          <Check size={16} className="mx-auto" style={{ color: TIERS_DATA.researcher.color }} />
                        ) : (
                          <Lock size={16} className="mx-auto text-gray-600" />
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {proHas ? (
                          <Check size={16} className="mx-auto" style={{ color: TIERS_DATA.pro.color }} />
                        ) : (
                          <Lock size={16} className="mx-auto text-gray-600" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}