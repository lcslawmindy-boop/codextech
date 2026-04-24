import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Check, Download, AlertCircle } from "lucide-react";

export default function NDALanding() {
  const [step, setStep] = useState("terms"); // terms, signature, success
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signatureData, setSignatureData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCanvasMouseDown = () => {
    setIsDrawing(true);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#06b6d4";

    if (ctx.beginPath) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setSignatureData("");
    }
  };

  const handleSignTerms = async () => {
    if (!fullName || !email || !acceptedTerms) {
      setError("Please fill all fields and accept the NDA terms");
      return;
    }

    if (!signatureData && canvasRef.current) {
      const canvas = canvasRef.current;
      // Check if anything was drawn
      const imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
      const hasData = imageData.data.some((val) => val !== 0);
      if (!hasData) {
        setError("Please provide a signature");
        return;
      }
      setSignatureData(canvas.toDataURL());
    }

    setLoading(true);
    setError(null);

    try {
      const response = await base44.functions.invoke("handleNDASignature", {
        full_name: fullName,
        email,
        company,
        signature_data: canvasRef.current?.toDataURL() || signatureData,
        accepted_terms: acceptedTerms,
      });

      if (response.data?.success) {
        setStep("success");
        // Store in session/localStorage so they stay logged in
        sessionStorage.setItem("nda_signed", "true");
        sessionStorage.setItem("user_email", email);
      } else {
        setError(response.data?.error || "Failed to sign NDA");
      }
    } catch (err) {
      setError("Error processing signature. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-cyan-900/30 bg-gray-950/80 backdrop-blur px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png"
              alt="C.O.D.E.X.T.E.C.H."
              className="h-10 w-10 object-contain"
            />
            <span className="font-black text-lg">C.O.D.E.X.T.E.C.H.</span>
          </div>
          {step === "success" && (
            <span className="text-green-400 text-sm font-bold flex items-center gap-1">
              <Check size={16} /> Verified
            </span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {step === "terms" && (
          <div className="space-y-8">
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs font-black mb-6">
                🔐 SECURE ACCESS
              </div>
              <h1 className="text-4xl sm:text-5xl font-black mb-4">
                Vault Access<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Terms & Conditions
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                To access C.O.D.E.X.T.E.C.H. engineering research, proprietary builds, and courses, you must review and electronically sign this NDA.
              </p>
            </div>

            {/* NDA Terms */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6 max-h-96 overflow-y-auto">
              <div>
                <h3 className="text-white font-black text-lg mb-3">Non-Disclosure Agreement</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  This agreement covers access to proprietary engineering research, build systems, courses, and technical documentation provided by Zenith Apex LLC d/b/a C.O.D.E.X.T.E.C.H.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="text-cyan-300 font-bold mb-2">1. Confidentiality</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  You agree to maintain the confidentiality of all proprietary materials, build specifications, course content, and research data provided through the platform. This information is not to be disclosed to third parties without written consent.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="text-cyan-300 font-bold mb-2">2. Permitted Use</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Access is granted solely for your personal research, education, and professional development. Commercial use, reproduction, or redistribution of materials is strictly prohibited.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="text-cyan-300 font-bold mb-2">3. Disclaimer</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  This platform is for educational and research purposes only. Zenith Apex LLC is not liable for misuse, injury, or damages resulting from implementation of any designs or methodologies.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h4 className="text-cyan-300 font-bold mb-2">4. Data Collection</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We collect anonymous usage data to improve the platform. Your signature, email, and IP address are recorded for compliance and fraud prevention.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Company / Organization</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company (optional)"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-start gap-3 pt-4">
                <input
                  type="checkbox"
                  id="accept"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-700 bg-gray-800 cursor-pointer mt-1"
                />
                <label htmlFor="accept" className="text-sm text-gray-300 cursor-pointer leading-relaxed">
                  I have read and agree to the Non-Disclosure Agreement and terms above *
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-950/30 border border-red-800">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={() => setStep("signature")}
                disabled={!fullName || !email || !acceptedTerms}
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Proceed to Sign
              </button>
            </div>
          </div>
        )}

        {step === "signature" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black mb-2">Electronic Signature</h2>
              <p className="text-gray-400">Sign below to accept the NDA and unlock vault access</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <label className="block text-sm font-bold text-gray-300 mb-4">Draw Your Signature</label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={150}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseLeave={handleCanvasMouseUp}
                  className="w-full bg-gray-950 cursor-crosshair"
                />
              </div>
              <button
                onClick={clearSignature}
                className="mt-3 px-4 py-2 text-sm text-gray-400 hover:text-gray-200 border border-gray-700 rounded-lg transition-colors"
              >
                Clear Signature
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-950/30 border border-red-800">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep("terms")}
                className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSignTerms}
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : "Sign & Unlock Vault"}
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl">🔓</div>
              <h2 className="text-4xl font-black text-cyan-300">Vault Unlocked</h2>
              <p className="text-gray-300 text-lg">
                Your NDA has been signed and recorded. Welcome to C.O.D.E.X.T.E.C.H.
              </p>
            </div>

            <div className="bg-gray-900 border border-cyan-800 rounded-2xl p-8 space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">What's Next</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-white font-bold">Access to 40+ Build Plans</p>
                    <p className="text-gray-400 text-sm">Complete BOMs, schematics, and step-by-step guides</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-white font-bold">26 Advanced Courses</p>
                    <p className="text-gray-400 text-sm">Structured learning from fundamentals to advanced systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-white font-bold">AI Patent Suite</p>
                    <p className="text-gray-400 text-sm">Draft, FTO analysis, claims, and investor packaging</p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="/pricing"
              className="inline-block px-10 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-lg transition-all"
            >
              Choose Your Membership →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}