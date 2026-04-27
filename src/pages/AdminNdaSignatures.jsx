import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, Search, RefreshCw, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AdminNdaSignatures() {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.NDASignature.list("-signed_at", 500);
      setSignatures(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = signatures.filter(s => {
    const q = search.toLowerCase();
    return !q || s.email?.toLowerCase().includes(q) || s.full_name?.toLowerCase().includes(q) || s.company?.toLowerCase().includes(q);
  });

  const signed = signatures.filter(s => s.accepted_terms).length;
  const pending = signatures.filter(s => !s.accepted_terms).length;

  const getSignedPdfUrl = (sig) => {
    const d = sig.signature_data || "";
    if (d.startsWith("http") || d.startsWith("data:")) return d;
    return null;
  };

  const isDocuSign = (sig) => {
    const d = sig.signature_data || "";
    return d.startsWith("docusign_");
  };

  const getEnvelopeId = (sig) => {
    const d = sig.signature_data || "";
    const match = d.match(/docusign_(?:envelope|signed):(.+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
              <ArrowLeft size={14} /> Admin
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <FileText size={16} className="text-cyan-400" />
            <div>
              <h1 className="text-white font-black text-lg">NDA Signatures — DocuSign Master</h1>
              <p className="text-gray-500 text-xs">{signed} signed · {pending} pending</p>
            </div>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300">
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Sent", value: signatures.length, color: "#06b6d4" },
            { label: "Fully Signed", value: signed, color: "#22c55e" },
            { label: "Awaiting Signature", value: pending, color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
              <p className="font-black text-3xl mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text" placeholder="Search by name, email, company…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 px-5">Name</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 px-4">Email</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 px-4">Company</th>
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 px-4">Date</th>
                  <th className="text-center text-gray-500 text-xs font-bold uppercase py-3 px-4">Status</th>
                  <th className="text-center text-gray-500 text-xs font-bold uppercase py-3 px-4">Signed PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filtered.map((sig) => {
                  const pdfUrl = getSignedPdfUrl(sig);
                  const envelopeId = getEnvelopeId(sig);
                  return (
                    <tr key={sig.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-5 text-white font-medium">{sig.full_name}</td>
                      <td className="py-3 px-4 text-gray-300 text-xs">{sig.email}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{sig.company || "—"}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {sig.signed_at ? new Date(sig.signed_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {sig.accepted_terms ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-900/40 border border-green-700 text-green-300 font-bold">
                            <CheckCircle2 size={10} /> Signed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-300 font-bold">
                            <Clock size={10} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {pdfUrl && pdfUrl.startsWith("http") ? (
                          <a href={pdfUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/40 border border-cyan-700 text-cyan-300 text-xs font-bold hover:bg-cyan-900/60 transition-colors">
                            <Download size={11} /> Download PDF
                          </a>
                        ) : envelopeId ? (
                          <span className="text-gray-600 text-xs">
                            {sig.accepted_terms ? "Stored" : "Awaiting"}
                          </span>
                        ) : (
                          <span className="text-gray-700 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-600">
                      No NDA signatures found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* DocuSign webhook info */}
        <div className="mt-8 bg-blue-950/20 border border-blue-800/40 rounded-xl p-5">
          <p className="text-blue-300 font-bold text-sm mb-2">📋 DocuSign Connect Webhook Setup</p>
          <p className="text-gray-400 text-xs leading-relaxed mb-2">
            To receive automatic signed PDF copies, configure DocuSign Connect to POST to your webhook URL:
          </p>
          <code className="text-cyan-400 text-xs bg-gray-900 px-3 py-2 rounded-lg block">
            {window.location.origin}/api/docusignWebhook
          </code>
          <p className="text-gray-600 text-xs mt-2">
            In DocuSign Admin → Connect → Add Configuration → set Trigger Events: "Envelope Completed"
          </p>
        </div>
      </div>
    </div>
  );
}