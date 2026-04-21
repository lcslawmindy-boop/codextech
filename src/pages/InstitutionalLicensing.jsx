import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const RESTRICTED_INVENTIONS = [
  { name: "Time-Reversal Zone Cold Fusion Reactor", icon: "⚛️" },
  { name: "Aegis-SV Adaptive Scalar Counterphase Shield", icon: "🛡️" },
  { name: "Atmospheric Scalar EM Signature Recognition System", icon: "🛰️" },
  { name: "T-Polarized EM Wave Transducer", icon: "⏱️" },
  { name: "Waddington Valley EM Tracer System", icon: "🗺️" },
  { name: "Cloning Efficiency Enhancement System", icon: "🧬" },
  { name: "Kaznacheyev Reversal Cell Imprinting Chamber", icon: "🔬" },
  { name: "UV Biophoton Disease Reversal Spectrometer", icon: "🧬" },
  { name: "Telomere Regeneration Device (TRD-1)", icon: "🧬" },
  { name: "Portable Porthole Disease Treatment System", icon: "🏥" },
  { name: "Psychoenergetics Cellular Control System", icon: "🧬" },
];

const ORG_TYPES = [
  "Defense Contractor",
  "Government Agency",
  "Research Institution",
  "Academic",
  "Medical",
  "Private Company",
  "Other",
];

export default function InstitutionalLicensing() {
  const [selectedTech, setSelectedTech] = useState([]);
  const [formData, setFormData] = useState({
    organization_name: "",
    organization_type: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    intended_use: "",
    security_clearance: "",
    annual_rd_budget: "",
    project_timeline: "",
    technical_requirements: "",
    nda_signed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTechToggle = (techName) => {
    setSelectedTech(prev =>
      prev.includes(techName)
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    if (selectedTech.length === 0) {
      setErrorMsg("Please select at least one technology of interest");
      setSubmitting(false);
      return;
    }

    try {
      await base44.entities.InstitutionalLicensingInquiry.create({
        ...formData,
        interested_technologies: selectedTech,
      });

      setSubmitStatus("success");
      setFormData({
        organization_name: "",
        organization_type: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        intended_use: "",
        security_clearance: "",
        annual_rd_budget: "",
        project_timeline: "",
        technical_requirements: "",
        nda_signed: false,
      });
      setSelectedTech([]);
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setErrorMsg(error.message || "Failed to submit inquiry. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-lg flex items-center gap-2">
              <Shield size={20} /> Institutional Licensing
            </h1>
            <p className="text-gray-500 text-xs mt-1">Defense contractors & research institutions</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* Hero */}
        <div className="mb-12 max-w-3xl">
          <h2 className="text-4xl font-black mb-4">
            Advanced Research Access<br />
            <span className="text-cyan-400">For Qualified Institutions</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Zenith Apex offers exclusive licensing of advanced scalar EM, bioelectromagnetics, and quantum potential technologies for vetted defense contractors, government agencies, and accredited research institutions.
          </p>
          <p className="text-gray-500 text-sm mt-4 border-l-2 border-cyan-600 pl-4">
            All inquiries require completion of a formal licensing agreement, security vetting, and NDA execution. Technical specifications are provided only to qualified entities.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Organization Details */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-7">
            <h3 className="text-white font-black text-lg mb-6">Organization Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Organization Name*</label>
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Legal organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Organization Type*</label>
                <select
                  name="organization_type"
                  value={formData.organization_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="">Select type...</option>
                  {ORG_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Contact Name*</label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email*</label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="contact@org.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Annual R&D Budget</label>
                <input
                  type="text"
                  name="annual_rd_budget"
                  value={formData.annual_rd_budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g., $5M–$10M"
                />
              </div>
            </div>
          </div>

          {/* Technology Selection */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-7">
            <h3 className="text-white font-black text-lg mb-2 flex items-center gap-2">
              <Lock size={18} className="text-red-400" /> Restricted Technologies*
            </h3>
            <p className="text-gray-500 text-sm mb-6">Select the technologies you are interested in licensing</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {RESTRICTED_INVENTIONS.map(tech => (
                <label key={tech.name} className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-red-600/50 transition-all cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedTech.includes(tech.name)}
                    onChange={() => handleTechToggle(tech.name)}
                    className="w-4 h-4 rounded accent-red-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-bold group-hover:text-red-400 transition-colors">{tech.icon} {tech.name}</div>
                  </div>
                </label>
              ))}
            </div>

            {selectedTech.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-cyan-950/40 border border-cyan-900/50">
                <p className="text-cyan-300 text-xs font-bold">
                  {selectedTech.length} technolog{selectedTech.length === 1 ? "y" : "ies"} selected
                </p>
              </div>
            )}
          </div>

          {/* Project & Clearance Details */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-7">
            <h3 className="text-white font-black text-lg mb-6">Project & Security Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Intended Use / Application</label>
                <textarea
                  name="intended_use"
                  value={formData.intended_use}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Describe how you plan to use or develop this technology..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Security Clearance Level</label>
                  <input
                    type="text"
                    name="security_clearance"
                    value={formData.security_clearance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g., Top Secret, Secret, None"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Project Timeline</label>
                  <input
                    type="text"
                    name="project_timeline"
                    value={formData.project_timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g., 12–18 months"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Technical Requirements & Specifications</label>
                <textarea
                  name="technical_requirements"
                  value={formData.technical_requirements}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Any specific performance requirements, integration needs, or technical constraints..."
                />
              </div>
            </div>
          </div>

          {/* NDA & Legal */}
          <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-7">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-black text-lg">Licensing & NDA Agreement</h3>
                <p className="text-gray-400 text-sm mt-2">
                  All technical specifications, build plans, and materials are provided under strict confidentiality and non-disclosure agreements. By submitting this form, you acknowledge that:
                </p>
                <ul className="text-gray-400 text-xs mt-3 space-y-2 ml-4">
                  <li>• Your organization will comply with all applicable export control regulations (ITAR, EAR)</li>
                  <li>• You understand the sensitive nature of these technologies and their restricted distribution</li>
                  <li>• You agree to sign a formal NDA before receiving technical specifications</li>
                  <li>• All information shared is proprietary and confidential</li>
                </ul>
              </div>
            </div>
            <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/40 border border-red-900/40 cursor-pointer hover:bg-gray-800/60 transition-colors">
              <input
                type="checkbox"
                name="nda_signed"
                checked={formData.nda_signed}
                onChange={handleInputChange}
                className="w-4 h-4 rounded accent-red-500"
              />
              <span className="text-red-300 text-xs font-bold">I acknowledge the above and agree to proceed with licensing inquiry</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-3">
            {errorMsg && (
              <div className="p-4 rounded-lg bg-red-950/40 border border-red-900/50 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{errorMsg}</p>
              </div>
            )}
            {submitStatus === "success" && (
              <div className="p-4 rounded-lg bg-green-950/40 border border-green-900/50 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-300 text-sm font-bold">Inquiry Submitted Successfully</p>
                  <p className="text-green-300/70 text-xs mt-1">A representative from Zenith Apex will contact you within 2–3 business days to discuss licensing terms and technical vetting requirements.</p>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting || !formData.nda_signed || selectedTech.length === 0}
              className="w-full px-6 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
              {submitting ? "Submitting..." : "Submit Licensing Inquiry"}
            </button>
            <p className="text-center text-gray-500 text-xs">
              🔐 All submissions are reviewed and verified. Security vetting required.
            </p>
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-16 max-w-3xl mx-auto border-t border-gray-800 pt-12">
          <h3 className="text-white font-black text-lg mb-6">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-600/20 border border-cyan-600 mb-3">
                <span className="text-cyan-400 font-black">1</span>
              </div>
              <h4 className="text-white font-bold mb-2">Initial Review</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                Our licensing team reviews your organization's qualifications and security profile.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-600/20 border border-cyan-600 mb-3">
                <span className="text-cyan-400 font-black">2</span>
              </div>
              <h4 className="text-white font-bold mb-2">Technical Vetting</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                If approved, we conduct technical discussions to assess capability and integration needs.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-600/20 border border-cyan-600 mb-3">
                <span className="text-cyan-400 font-black">3</span>
              </div>
              <h4 className="text-white font-bold mb-2">Licensing Agreement</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                Formalize terms with NDA, technical access, and support arrangements tailored to your needs.
              </p>
            </div>
          </div>

          <div className="mt-10 p-6 rounded-xl bg-gray-900/60 border border-gray-800">
            <p className="text-gray-400 text-sm">
              <span className="text-gray-300 font-bold">Questions?</span><br />
              Contact our licensing team directly at{" "}
              <a href="mailto:licensing@zenithapex.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                licensing@zenithapex.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}