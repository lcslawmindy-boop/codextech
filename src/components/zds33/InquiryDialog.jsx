import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { PATHWAYS } from "@/lib/zds33";
import { Loader2, X, CheckCircle2 } from "lucide-react";

const field = "w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500";

export default function InquiryDialog({ tech, onClose }) {
  const options = tech.pathways.length ? tech.pathways : Object.keys(PATHWAYS);
  const [form, setForm] = useState({ name: "", email: "", organization: "", pathway: options[0], message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      await base44.functions.invoke("zds33Public", { action: "inquiry", ip_asset_id: tech.id, ...form });
      setDone(true);
    } catch (ex) {
      setErr(ex?.response?.data?.error || "Could not send your inquiry. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-white">Request partnership</h3>
            <p className="text-xs text-slate-400">{tech.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        {done ? (
          <div className="text-center py-8">
            <CheckCircle2 className="mx-auto text-emerald-400 mb-2" size={36} />
            <p className="text-white font-semibold">Inquiry received</p>
            <p className="text-xs text-slate-400 mt-1">Our team reviews every inquiry. No commitment or disclosure is made automatically.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input required className={field} placeholder="Your name" value={form.name} onChange={set("name")} />
            <input required type="email" className={field} placeholder="Email" value={form.email} onChange={set("email")} />
            <input className={field} placeholder="Organization" value={form.organization} onChange={set("organization")} />
            <select className={field} value={form.pathway} onChange={set("pathway")}>
              {options.map((p) => <option key={p} value={p}>{PATHWAYS[p]}</option>)}
            </select>
            <textarea rows={4} className={field} placeholder="How would you like to work together?" value={form.message} onChange={set("message")} />
            {err && <p className="text-xs text-red-400">{err}</p>}
            <button disabled={busy} className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
              {busy && <Loader2 size={14} className="animate-spin" />} Send inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}