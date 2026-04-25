import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Download, CheckCircle2, AlertCircle, LogIn } from "lucide-react";

const NDA_TEXT = `CONFIDENTIALITY & NON-DISCLOSURE AGREEMENT

This Confidentiality & Non-Disclosure Agreement ("Agreement") is entered into as of the date of electronic signature below, by and between Zenith Apex LLC, operating as C.O.D.E.X.T.E.C.H. ("Disclosing Party"), and the Individual or Entity accessing this platform ("Receiving Party").

WHEREAS, the Disclosing Party possesses certain confidential information, proprietary research, engineering systems, and intellectual property related to advanced electromagnetic engineering, renewable energy systems, and related technologies;

WHEREAS, the Receiving Party wishes to gain access to such confidential information for research, educational, and evaluation purposes only;

NOW, THEREFORE, in consideration of mutual covenants and agreements, the parties agree as follows:

1. CONFIDENTIAL INFORMATION
Confidential Information includes, but is not limited to:
- Engineering schematics, build plans, and technical specifications
- Course materials and educational frameworks
- Proprietary analysis methodologies
- Investor relations documentation
- Business strategies and market analysis
- Any information marked as "Confidential" or proprietary in nature

2. PERMITTED USES
Receiving Party may use Confidential Information solely for:
- Personal research and educational purposes
- Evaluation of membership value
- Private prototype construction for personal use
- Not for commercial distribution without written consent

3. OBLIGATIONS
Receiving Party agrees to:
- Maintain all Confidential Information in strict confidence
- Not disclose to third parties without prior written consent
- Not reverse-engineer or reproduce proprietary systems for commercial sale
- Return all materials upon request or termination
- Use industry-standard security measures for digital materials

4. TERM
This Agreement shall remain in effect for a period of three (3) years from the date of last disclosure, or indefinitely for trade secrets, as applicable under law.

5. NO LICENSE GRANTED
Access to Confidential Information does not grant any license, ownership, or patent rights to Receiving Party.

6. DISCLAIMER
The Disclosing Party makes no warranty regarding the accuracy or completeness of Confidential Information. Use is at Receiving Party's own risk.

7. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.

By electronically signing below, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions of this Agreement.`;

export default function VaultNDALanding() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Returning member login
  const [returningEmail, setReturningEmail] = useState("");
  const [returningLoading, setReturningLoading] = useState(false);
  const [returningError, setReturningError] = useState(null);

  const handleReturningLogin = async (e) => {
    e.preventDefault();
    if (!returningEmail) return;
    setReturningLoading(true);
    setReturningError(null);
    try {
      const sigs = await base44.entities.NDASignature.filter({ email: returningEmail.toLowerCase().trim() });
      if (sigs && sigs.length > 0) {
        localStorage.setItem("nda_member_email", returningEmail.toLowerCase().trim());
        localStorage.setItem("bearden_nda_accepted", JSON.stringify({ accepted: true, version: "1.0" }));
        window.location.href = "/pricing";
      } else {
        setReturningError("No NDA signature found for that email. Please sign below.");
      }
    } catch (err) {
      setReturningError("Error checking signature. Please try again.");
    }
    setReturningLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !agreed) {
      setError("Please fill all fields and agree to the NDA");
      console.error("Validation failed:", { fullName, email, agreed });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save NDA signature
      const result = await base44.entities.NDASignature.create({
        full_name: fullName,
        email,
        company: organization,
        signature_data: "", // Canvas signature would go here
        accepted_terms: true,
        signed_at: new Date().toISOString(),
      });
      
      console.log("NDA signature created:", result);

      // Send admin notification
      try {
        await base44.functions.invoke("sendNDANotification", {
          full_name: fullName,
          email,
          organization,
        });
      } catch (notificationErr) {
        console.warn("Notification send failed (non-blocking):", notificationErr);
      }

      localStorage.setItem("nda_member_email", email.toLowerCase().trim());
      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error("Error processing NDA:", err);
      setError(err.message || "Error processing signature. Please try again.");
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    // Create and download NDA as PDF
    const element = document.getElementById("nda-content");
    const opt = {
      margin: 10,
      filename: "C.O.D.E.X.T.E.C.H_NDA.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };

    // Would use html2pdf library - for now just alert
    alert("Download NDA PDF");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png"
              alt="C.O.D.E.X.T.E.C.H."
              className="h-10 w-10 object-contain"
            />
            <span className="font-black text-lg">C.O.D.E.X.T.E.C.H. — NDA</span>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-bold transition-colors"
          >
            <Download size={14} /> Master Copy
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NDA Document */}
          <div className="lg:col-span-2">
            <div
              id="nda-content"
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 prose prose-invert max-w-none"
            >
              <h1 className="text-3xl font-black text-cyan-300 mb-6">
                Confidentiality & Non-Disclosure Agreement
              </h1>
              <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">
                {NDA_TEXT}
              </div>
            </div>
          </div>

          {/* Signature Panel */}
          <div className="lg:col-span-1">
            {/* Returning Member Login */}
          <div className="sticky top-24 space-y-4">
          <div className="bg-gray-900 border border-cyan-800/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <LogIn size={16} className="text-cyan-400" />
              <p className="text-white font-black text-sm">Already signed? Log in</p>
            </div>
            <form onSubmit={handleReturningLogin} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={returningEmail}
                onChange={e => setReturningEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500"
              />
              {returningError && <p className="text-red-400 text-xs">{returningError}</p>}
              <button type="submit" disabled={returningLoading}
                className="w-full py-2.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-sm transition-colors disabled:opacity-50">
                {returningLoading ? "Checking..." : "Access Vault →"}
              </button>
            </form>
          </div>

          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-2 border-cyan-600 rounded-2xl p-6 shadow-xl shadow-cyan-500/20">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">Signature Received</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Your electronic signature has been recorded. Welcome to the vault.
                  </p>
                  <div className="bg-gray-800 rounded-lg p-4 text-xs text-gray-300 mb-4">
                    <p className="font-bold text-white mb-1">Notification Sent</p>
                    <p>Admin has been notified of your access request.</p>
                  </div>
                  <a
                    href="/pricing"
                    className="block w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black transition-colors"
                  >
                    Explore Membership
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-black text-white mb-4">
                    Electronic Signature
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">
                      Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Your organization"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <label className="flex items-start gap-3 py-3 px-4 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-5 h-5 mt-1 cursor-pointer"
                    />
                    <span className="text-xs text-gray-300">
                      I have read and agree to this NDA and understand that my use of C.O.D.E.X.T.E.C.H. is restricted to personal research and educational purposes.
                    </span>
                  </label>

                  {error && (
                    <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-900/30 border border-red-800">
                      <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Sign & Continue"}
                  </button>

                  <p className="text-center text-xs text-gray-600">
                    ✓ Signature recorded electronically
                  </p>
                </form>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}