import { useState, useEffect } from "react";
import { Shield, ShieldAlert, AlertTriangle, CheckCircle2, Lock, Loader2, Eye, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";

const NDA_VERSION = "VDR-2.0";
const EFFECTIVE_DATE = "April 1, 2026";

export default function VDRNdaSign() {
  const [user, setUser] = useState(null);
  const [grant, setGrant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle"); // idle | already_signed | no_grant | signing | signed | error

  // Form state
  const [fullName, setFullName] = useState("");
  const [typedSig, setTypedSig] = useState("");
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const allReady = fullName.trim().length > 2 &&
    typedSig.trim().length > 2 &&
    checked1 && checked2 && checked3;

  useEffect(() => {
    (async () => {
      try {
        const me = await base44.auth.me();
        if (!me) {
          base44.auth.redirectToLogin(window.location.href);
          return;
        }
        setUser(me);
        setFullName(me.full_name || "");

        // Check if a grant exists for this email
        const res = await base44.functions.invoke("vdrDocuments", { action: "check_grant_status" });
        if (res.data?.already_signed) {
          setGrant(res.data.grant);
          setStatus("already_signed");
        } else if (res.data?.grant) {
          setGrant(res.data.grant);
          setStatus("idle");
        } else {
          setStatus("no_grant");
        }
      } catch {
        setStatus("no_grant");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSign = async () => {
    if (!allReady) return;
    setStatus("signing");
    setErrorMsg("");
    try {
      const res = await base44.functions.invoke("vdrDocuments", {
        action: "sign_nda",
        full_name: fullName.trim(),
        typed_signature: typedSig.trim(),
        nda_version: NDA_VERSION,
        ip_address: "", // populated server-side
      });
      if (res.data?.success) {
        setStatus("signed");
      } else {
        setErrorMsg(res.data?.error || "Something went wrong.");
        setStatus("idle");
      }
    } catch (e) {
      setErrorMsg(e.message || "Signing failed.");
      setStatus("idle");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={32} />
    </div>
  );

  if (status === "no_grant") return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <Lock size={48} className="text-gray-700 mx-auto mb-4" />
        <h1 className="text-white font-black text-2xl mb-3">No Access Grant Found</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Your email address (<span className="text-gray-200">{user?.email}</span>) has not been granted access to the Virtual Data Room.
          Contact Zenith Apex to request access.
        </p>
        <a href="mailto:zenithapexresearch@gmail.com?subject=VDR Access Request"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-yellow-900/40 border border-yellow-700 text-yellow-300 font-bold text-sm hover:bg-yellow-800/40 transition-all">
          Request Access →
        </a>
      </div>
    </div>
  );

  if (status === "already_signed") return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-white font-black text-2xl mb-3">NDA Already Signed</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          You have already signed the VDR Non-Disclosure Agreement. Your access is verified.
        </p>
        {grant?.nda_verified_at && (
          <p className="text-gray-600 text-xs">Signed on {new Date(grant.nda_verified_at).toLocaleString()}</p>
        )}
        <a href="/member-portal"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-green-900/40 border border-green-700 text-green-300 font-bold text-sm hover:bg-green-800/40 transition-all">
          Go to Member Portal →
        </a>
      </div>
    </div>
  );

  if (status === "signed") return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={40} className="text-green-400" />
        </div>
        <h1 className="text-white font-black text-2xl mb-3">NDA Signed & Verified</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Your digital signature has been recorded and your VDR access is now <strong className="text-green-400">active</strong>.
          You may now view documents in the Virtual Data Room.
        </p>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left text-xs text-gray-500 space-y-1 mb-6">
          <p>Signed as: <span className="text-gray-300">{fullName}</span></p>
          <p>Email: <span className="text-gray-300">{user?.email}</span></p>
          <p>Timestamp: <span className="text-gray-300">{new Date().toLocaleString()}</span></p>
          <p>Agreement version: <span className="text-gray-300">{NDA_VERSION}</span></p>
        </div>
        <a href="/member-portal"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-sm transition-all">
          Enter Data Room →
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-900/30 border border-yellow-700 flex items-center justify-center">
              <Shield size={28} className="text-yellow-400" />
            </div>
          </div>
          <h1 className="text-white font-black text-3xl mb-2 tracking-tight">
            Virtual Data Room — NDA
          </h1>
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest">
            Digital Signature Required
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Agreement Version {NDA_VERSION} · Effective {EFFECTIVE_DATE}
          </p>
          {grant && (
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-xl bg-blue-900/30 border border-blue-800 text-blue-300 text-xs">
              <Eye size={11} /> Access level: <strong>{grant.access_level === "download" ? "View + Download" : "View Only"}</strong>
              {grant.organization && <> · {grant.organization}</>}
            </div>
          )}
        </div>

        {/* Warning banner */}
        <div className="bg-red-950/40 border border-red-900/60 rounded-xl px-5 py-4 flex items-start gap-3 mb-6">
          <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-red-300 text-sm leading-relaxed">
            <strong>This agreement is legally binding.</strong> By signing below you agree to maintain strict confidentiality over all materials in the Zenith Apex Virtual Data Room. Violations are subject to $2,500,000 in liquidated damages.
          </p>
        </div>

        {/* Agreement body */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800 bg-gray-800/40">
            <FileText size={13} className="text-yellow-400" />
            <p className="text-yellow-400 text-xs font-black uppercase tracking-wider">Non-Disclosure Agreement — Full Text</p>
          </div>
          <div className="px-6 py-5 space-y-5 text-gray-300 text-sm leading-relaxed overflow-y-auto max-h-[40vh]">

            <section>
              <h2 className="text-white font-bold mb-1 flex items-center gap-1.5"><span className="text-yellow-400">1.</span> PARTIES & SCOPE</h2>
              <p>This Non-Disclosure Agreement ("Agreement") is entered into between the owner of the Zenith Apex Advanced Research Platform ("Disclosing Party") and the individual identified below ("Recipient"). It governs all IP portfolios, financial models, technical architectures, patent documents, and any other materials accessed through the Virtual Data Room ("VDR Materials").</p>
            </section>

            <section>
              <h2 className="text-white font-bold mb-1 flex items-center gap-1.5"><span className="text-yellow-400">2.</span> CONFIDENTIALITY OBLIGATIONS</h2>
              <p>Recipient shall: (a) hold all VDR Materials in strict confidence; (b) not copy, distribute, publish, or transmit any VDR Materials; (c) not use VDR Materials for any purpose other than evaluating a potential transaction with Disclosing Party; (d) not disclose VDR Materials to any third party without prior written consent; (e) not input VDR Materials into any AI system, language model, or automated data processing tool.</p>
            </section>

            <section>
              <h2 className="text-white font-bold mb-1 flex items-center gap-1.5"><span className="text-yellow-400">3.</span> INTELLECTUAL PROPERTY</h2>
              <p>Access to VDR Materials grants no license or ownership right in any IP. All patents, provisional applications, device architectures, financial models, and platform code remain the exclusive property of the Disclosing Party.</p>
            </section>

            <section>
              <h2 className="text-white font-bold mb-1 flex items-center gap-1.5"><span className="text-yellow-400">4.</span> MONITORING & ACCESS LOGGING</h2>
              <p>The Disclosing Party logs all access events including page views, session duration, IP address, and user agent. This data may be used in enforcement proceedings. Recipient consents to such logging as a condition of access.</p>
            </section>

            <section>
              <h2 className="text-white font-bold mb-1 flex items-center gap-1.5"><span className="text-yellow-400">5.</span> LIQUIDATED DAMAGES</h2>
              <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 mt-2">
                <p>Recipient agrees to pay liquidated damages of <strong className="text-white">$250,000 USD per incident</strong> of unauthorized disclosure, and <strong className="text-white">$2,500,000 USD</strong> for unauthorized commercial exploitation or AI ingestion of VDR Materials. These amounts are agreed as reasonable estimates of harm, not penalties.</p>
              </div>
            </section>

            <section>
              <h2 className="text-white font-bold mb-1 flex items-center gap-1.5"><span className="text-yellow-400">6.</span> ELECTRONIC SIGNATURE</h2>
              <p>Electronic acceptance of this Agreement constitutes a valid, legally binding signature under the Electronic Signatures in Global and National Commerce Act (E-SIGN, 15 U.S.C. § 7001) and applicable state law. Recipient's full name, typed signature, email address, timestamp, and IP address are recorded as evidence of assent.</p>
            </section>

            <section>
              <h2 className="text-white font-bold mb-1 flex items-center gap-1.5"><span className="text-yellow-400">7.</span> TERM & GOVERNING LAW</h2>
              <p>This Agreement takes effect upon signing and survives any termination of access. It is governed by the laws of the United States of America.</p>
            </section>

          </div>
        </div>

        {/* Signature block */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-5 space-y-5">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
            <Shield size={13} className="text-yellow-400" /> Signature & Acknowledgements
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Your Full Legal Name *</label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. John A. Smith"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">
                Type Your Signature * <span className="text-gray-700">(must match name above)</span>
              </label>
              <input
                value={typedSig}
                onChange={e => setTypedSig(e.target.value)}
                placeholder="Type your full name to sign"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm italic focus:outline-none focus:border-yellow-600 placeholder-gray-600 font-serif"
                style={{ fontFamily: "'Georgia', serif" }}
              />
            </div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-3 text-xs text-gray-500 space-y-0.5">
            <p>Signing as: <span className="text-gray-300">{user?.email}</span></p>
            <p>Timestamp: <span className="text-gray-300">{new Date().toLocaleString()}</span></p>
            <p>Agreement: <span className="text-gray-300">VDR Non-Disclosure Agreement v{NDA_VERSION}</span></p>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { state: checked1, set: setChecked1, text: "I have read and fully understand this Non-Disclosure Agreement and agree to be legally bound by all its terms." },
              { state: checked2, set: setChecked2, text: "I will NOT copy, share, reproduce, distribute, or input any VDR Materials into any AI system or third-party service." },
              { state: checked3, set: setChecked3, text: "I understand that violations may result in liquidated damages up to $2,500,000 and that my access is monitored and logged." },
            ].map(({ state, set, text }, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => set(s => !s)}
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                    state ? "bg-green-600 border-green-500" : "bg-gray-800 border-gray-600 group-hover:border-gray-400"
                  }`}
                >
                  {state && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <span className="text-gray-300 text-sm leading-relaxed">{text}</span>
              </label>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-950/40 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle size={14} /> {errorMsg}
          </div>
        )}

        {/* Sign button */}
        <button
          onClick={handleSign}
          disabled={!allReady || status === "signing"}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-base transition-all ${
            allReady && status !== "signing"
              ? "bg-yellow-800 hover:bg-yellow-700 text-black shadow-lg shadow-yellow-900/30"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          {status === "signing" ? (
            <><Loader2 size={16} className="animate-spin" /> Recording Signature…</>
          ) : allReady ? (
            <><Shield size={16} /> Sign & Activate VDR Access</>
          ) : (
            "Complete all fields above to sign"
          )}
        </button>

        <p className="text-gray-700 text-xs text-center mt-3">
          Your signature is timestamped and cryptographically recorded. By signing you confirm you are 18+ and have authority to enter this agreement.
        </p>
      </div>
    </div>
  );
}