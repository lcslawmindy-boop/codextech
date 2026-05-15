import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, DollarSign, TrendingUp, Download, Loader, CheckCircle } from "lucide-react";

export default function InvestorPackageBuilder() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    invention_name: "",
    patent_count: 3,
    rd_expenditure: 250000,
    market_size: 500000000,
    company_stage: "Prototype",
    ip_valuation: 0,
    equity_offered: 15,
    funding_ask: 500000,
    investor_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [ddPackage, setDdPackage] = useState(null);
  const [termSheet, setTermSheet] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const calculateValuation = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("valuationApiEndpoint", {
        rd_expenditure: formData.rd_expenditure,
        patent_count: formData.patent_count,
        market_size: formData.market_size,
      });
      if (res.data?.valuation) {
        setFormData({ ...formData, ip_valuation: res.data.valuation });
      }
    } catch (error) {
      console.error("Valuation error:", error);
    }
    setLoading(false);
  };

  const generateDueDiligence = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("generateDueDiligencePackage", formData);
      if (res.data?.package) {
        setDdPackage(res.data.package);
      }
    } catch (error) {
      console.error("DD generation error:", error);
    }
    setLoading(false);
  };

  const generateTermSheet = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("generateAcquisitionTermSheet", formData);
      if (res.data?.term_sheet) {
        setTermSheet(res.data.term_sheet);
      }
    } catch (error) {
      console.error("Term sheet generation error:", error);
    }
    setLoading(false);
  };

  const exportToPDF = async (type) => {
    setExportLoading(true);
    try {
      if (type === "dd") {
        const res = await base44.functions.invoke("exportPatentDoc", {
          content: JSON.stringify(ddPackage),
          title: ddPackage.title,
          format: "pdf",
        });
        if (res.data?.url) {
          window.open(res.data.url, "_blank");
        }
      } else if (type === "ts") {
        const res = await base44.functions.invoke("exportPatentDoc", {
          content: JSON.stringify(termSheet),
          title: termSheet.title,
          format: "pdf",
        });
        if (res.data?.url) {
          window.open(res.data.url, "_blank");
        }
      }
    } catch (error) {
      console.error("Export error:", error);
    }
    setExportLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/50 border border-blue-800/50 text-blue-300 text-xs font-bold mb-4 uppercase tracking-widest">
            <FileText size={10} /> Investor Package Builder
          </div>
          <h1 className="text-4xl font-black mb-3">Create Investor Due Diligence Package</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Generate a complete acquisition package with IP valuation, due diligence summary, and term sheet.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: "Invention Details" },
            { num: 2, label: "Valuation" },
            { num: 3, label: "Investment Terms" },
            { num: 4, label: "Review & Export" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                  step >= s.num
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {step > s.num ? <CheckCircle size={16} /> : s.num}
              </div>
              <span
                className={`text-xs font-bold ${
                  step >= s.num ? "text-white" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
              {s.num < 4 && <div className="w-8 h-px bg-slate-800" />}
            </div>
          ))}
        </div>

        {/* Step 1: Invention Details */}
        {step === 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black mb-6">Invention Details</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Invention Name
                </label>
                <input
                  type="text"
                  name="invention_name"
                  value={formData.invention_name}
                  onChange={handleInputChange}
                  placeholder="e.g., MEG Replication System"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Patent Count
                  </label>
                  <input
                    type="number"
                    name="patent_count"
                    value={formData.patent_count}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Company Stage
                  </label>
                  <select
                    name="company_stage"
                    value={formData.company_stage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option>Concept</option>
                    <option>Prototype</option>
                    <option>Patent Pending</option>
                    <option>Patent Granted</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  R&D Expenditure ($)
                </label>
                <input
                  type="number"
                  name="rd_expenditure"
                  value={formData.rd_expenditure}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Target Market Size ($)
                </label>
                <input
                  type="number"
                  name="market_size"
                  value={formData.market_size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Valuation */}
        {step === 2 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black mb-6">Calculate IP Valuation</h2>
            <div className="space-y-5">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm mb-3">
                  Based on your R&D spend, patent count, and market size:
                </p>
                <button
                  onClick={calculateValuation}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader size={16} className="animate-spin" /> Calculating...
                    </span>
                  ) : (
                    "Calculate Valuation"
                  )}
                </button>
              </div>
              {formData.ip_valuation > 0 && (
                <div className="bg-gradient-to-br from-cyan-950 to-blue-950 rounded-lg p-6 border border-cyan-700/50">
                  <p className="text-slate-400 text-sm mb-2">IP Valuation Score</p>
                  <p className="text-4xl font-black text-cyan-400">
                    ${formData.ip_valuation.toLocaleString()}
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 rounded-lg border border-slate-600 text-slate-300 font-bold hover:bg-slate-800 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={formData.ip_valuation === 0}
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Investment Terms */}
        {step === 3 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black mb-6">Investment Terms</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Investor Name (optional)
                </label>
                <input
                  type="text"
                  name="investor_name"
                  value={formData.investor_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Venture Capital Partners"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Funding Ask ($)
                </label>
                <input
                  type="number"
                  name="funding_ask"
                  value={formData.funding_ask}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Equity Offered (%)
                </label>
                <input
                  type="number"
                  name="equity_offered"
                  value={formData.equity_offered}
                  onChange={handleInputChange}
                  min="5"
                  max="50"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 rounded-lg border border-slate-600 text-slate-300 font-bold hover:bg-slate-800 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all"
                >
                  Review & Generate →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Export */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-black mb-6">Review & Generate Documents</h2>
              <div className="space-y-4">
                {/* Due Diligence */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <FileText size={18} className="text-blue-400" /> Due Diligence Package
                    </h3>
                    {ddPackage && <CheckCircle size={18} className="text-green-500" />}
                  </div>
                  {!ddPackage ? (
                    <button
                      onClick={generateDueDiligence}
                      disabled={loading}
                      className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-50"
                    >
                      {loading ? "Generating..." : "Generate Due Diligence"}
                    </button>
                  ) : (
                    <button
                      onClick={() => exportToPDF("dd")}
                      disabled={exportLoading}
                      className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Download size={16} /> Export to PDF
                    </button>
                  )}
                </div>

                {/* Term Sheet */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <DollarSign size={18} className="text-orange-400" /> Acquisition Term Sheet
                    </h3>
                    {termSheet && <CheckCircle size={18} className="text-green-500" />}
                  </div>
                  {!termSheet ? (
                    <button
                      onClick={generateTermSheet}
                      disabled={loading}
                      className="w-full px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all disabled:opacity-50"
                    >
                      {loading ? "Generating..." : "Generate Term Sheet"}
                    </button>
                  ) : (
                    <button
                      onClick={() => exportToPDF("ts")}
                      disabled={exportLoading}
                      className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Download size={16} /> Export to PDF
                    </button>
                  )}
                </div>
              </div>

              {/* Summary */}
              {(ddPackage || termSheet) && (
                <div className="mt-6 bg-slate-700/30 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-300 text-sm">
                    <strong>IP Valuation:</strong> ${formData.ip_valuation.toLocaleString()} | 
                    <strong className="ml-3">Funding Ask:</strong> ${formData.funding_ask.toLocaleString()} | 
                    <strong className="ml-3">Equity:</strong> {formData.equity_offered}%
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-6 py-3 rounded-lg border border-slate-600 text-slate-300 font-bold hover:bg-slate-800 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all border border-slate-700"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}