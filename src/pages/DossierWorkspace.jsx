import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, FileText, Presentation, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import PatentDraftWorkflow from "@/components/PatentDraftWorkflow";
import InvestorDeckGenerator from "@/components/InvestorDeckGenerator";

const TABS = [
  { id: "patent", label: "Patent Draft Workflow", icon: FileText, color: "text-blue-400", border: "border-blue-500" },
  { id: "investor", label: "Investor Deck Generator", icon: Presentation, color: "text-purple-400", border: "border-purple-500" },
];

export default function DossierWorkspace() {
  const [activeTab, setActiveTab] = useState("patent");
  const [inventions, setInventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.HybridInvention.list("-created_date", 50).then((data) => {
      setInventions(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const ActiveIcon = TABS.find(t => t.id === activeTab)?.icon || FileText;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/invention-dossier" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={14} /> Back to Dossier
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg">Dossier Workspace</h1>
            <p className="text-gray-500 text-xs">Patent drafting & investor deck generation</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-900/60 border border-gray-800 rounded-xl p-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === tab.id ? `bg-gray-800 ${tab.color} border ${tab.border}` : "text-gray-500 hover:text-gray-300"}`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Inventory Summary */}
        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-gray-500">
            <RefreshCw size={16} className="animate-spin" /> Loading dossiers...
          </div>
        ) : inventions.length === 0 ? (
          <div className="mb-6 p-4 bg-yellow-950/20 border border-yellow-800 rounded-xl text-center">
            <p className="text-yellow-300 text-sm font-bold">No saved invention dossiers found.</p>
            <p className="text-gray-400 text-xs mt-1">
              Go to the <Link to="/research-membership" className="text-cyan-400 underline">Research Membership</Link> page, generate an invention dossier, and save it to your library first.
            </p>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-2 text-gray-500 text-xs">
            <span className="px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 font-bold">{inventions.length} saved dossiers</span>
            available for processing
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "patent" && <PatentDraftWorkflow inventions={inventions} />}
        {activeTab === "investor" && <InvestorDeckGenerator inventions={inventions} />}
      </div>
    </div>
  );
}