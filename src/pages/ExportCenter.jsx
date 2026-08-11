import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, FileStack, ChevronRight } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ExportTypeSelector, { EXPORT_PRODUCTS } from "@/components/export/ExportTypeSelector";
import InvestorPackageGenerator from "@/components/export/InvestorPackageGenerator";
import LicensingBriefGenerator from "@/components/export/LicensingBriefGenerator";
import SbirGrantGenerator from "@/components/export/SbirGrantGenerator";
import GenericExportGenerator from "@/components/export/GenericExportGenerator";
import ExportHistoryTable from "@/components/export/ExportHistoryTable";
import ExportLegalFooter from "@/components/export/ExportLegalFooter";
import { base44 } from "@/api/base44Client";

const STATS = [
  { label: "Documents Generated This Month", value: 12, icon: FileText, color: "hsl(var(--zarp-gold))" },
  { label: "Total Exports", value: 47, icon: FileStack, color: "hsl(var(--zarp-blue))" },
  { label: "Pages Created", value: 326, icon: Download, color: "hsl(var(--zarp-violet))" },
];

export default function ExportCenter() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const userTier = user?.role === "admin" ? "ENTERPRISE" : "PRO";
  const product = EXPORT_PRODUCTS.find(p => p.id === activeProduct);

  const renderGenerator = () => {
    if (!product) return null;
    const props = { onBack: () => setActiveProduct(null) };
    switch (product.id) {
      case "investor-package": return <InvestorPackageGenerator {...props} />;
      case "licensing-brief": return <LicensingBriefGenerator {...props} />;
      case "sbir-grant": return <SbirGrantGenerator {...props} />;
      default: return <GenericExportGenerator {...props} product={product} />;
    }
  };

  return (
    <div className="min-h-screen bg-zarp-bg flex">
      <DashboardSidebar user={user} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-zarp-muted text-xs mb-4">
            <Link to="/" className="hover:text-zarp-text transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-zarp-text font-semibold">Export Center</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(var(--zarp-gold) / 0.15)", border: "1px solid hsl(var(--zarp-gold) / 0.3)" }}>
                <Download size={20} className="text-zarp-gold" />
              </div>
              <div>
                <h1 className="text-zarp-text font-black text-2xl">Export Center</h1>
                <p className="text-zarp-muted text-sm">Turn your research and device plans into professional deliverables.</p>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {STATS.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-xl border border-zarp-border bg-zarp-card p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.color + "15" }}>
                      <Icon size={16} style={{ color: s.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-zarp-text font-black text-lg leading-none">{s.value}</p>
                      <p className="text-zarp-muted text-[10px] leading-tight mt-1">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          {activeProduct ? renderGenerator() : (
            <div className="space-y-8">
              <ExportTypeSelector onSelect={setActiveProduct} userTier={userTier} />
              <ExportHistoryTable />
            </div>
          )}

          <ExportLegalFooter />
        </div>
      </div>
    </div>
  );
}