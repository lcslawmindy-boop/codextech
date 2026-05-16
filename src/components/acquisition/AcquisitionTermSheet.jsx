import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Download, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";

const CURRENCY = (n) => n?.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-700/60 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/60 hover:bg-gray-800 transition-colors text-left">
        <span className="text-gray-200 font-black text-sm">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>
      {open && <div className="px-4 py-3 bg-gray-900/40 space-y-1.5 text-sm">{children}</div>}
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-1.5 border-b border-gray-800/50 last:border-0 ${highlight ? "bg-yellow-950/10 rounded px-1" : ""}`}>
      <span className="text-gray-500 text-xs shrink-0 w-48">{label}</span>
      <span className={`text-right text-xs font-semibold ${highlight ? "text-yellow-300" : "text-gray-200"}`}>{value}</span>
    </div>
  );
}

function BulletList({ items, color = "text-cyan-400" }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
          <span className={`${color} mt-0.5 shrink-0`}>•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function exportToText(ts) {
  const m = ts.meta;
  const t = ts.transaction;
  let out = `${m.title}\n${m.subtitle}\n${"=".repeat(60)}\n`;
  out += `Reference: ${m.reference}\nDate: ${m.date}\nPrepared For: ${m.prepared_for}\nPrepared By: ${m.prepared_by}\n${m.confidentiality}\n\n`;
  out += `TRANSACTION SUMMARY\n${"-".repeat(40)}\n`;
  out += `Type: ${t.type}\nAsking Price: ${CURRENCY(t.asking_price_usd)}\nIP Valuation Basis: ${CURRENCY(t.ip_valuation_basis_usd)}\nDeal Structure: ${t.deal_structure}\n\n`;
  out += `ASSETS INCLUDED\n${"-".repeat(40)}\n`;
  ts.assets_included.forEach((a, i) => { out += `${i + 1}. ${a}\n`; });
  out += `\nCLOSING TIMELINE\n${"-".repeat(40)}\n`;
  ts.timeline.key_milestones.forEach(m => { out += `${m.timing}: ${m.event}\n`; });
  out += `\nPOST-CLOSING\n${"-".repeat(40)}\n`;
  const pc = ts.post_closing;
  out += `Transition Support: ${pc.transition_support}\nNon-Compete: ${pc.non_compete}\nIndemnification: ${pc.indemnification}\n`;
  out += `\nDISCLAIMER\n${"-".repeat(40)}\n${ts.disclaimer}\n`;
  return out;
}

const DEAL_STRUCTURES = [
  { value: "all_cash", label: "All Cash at Closing" },
  { value: "cash_and_equity", label: "Cash + Equity Rollover" },
  { value: "earnout", label: "Cash + Earnout" },
  { value: "license_buyout", label: "Perpetual License Buyout" },
];

export default function AcquisitionTermSheet({ onClose, prefillBuyer }) {
  const [form, setForm] = useState({
    buyer_name: prefillBuyer?.name || "",
    buyer_org: prefillBuyer?.org || "",
    asking_price: 2500000,
    ip_valuation: 2500000,
    deal_structure: "all_cash",
    earnout_amount: 500000,
    earnout_triggers: "achieving $500K ARR within 24 months of closing",
    equity_rollover_pct: 10,
    closing_period_days: 60,
    exclusivity_days: 30,
    patent_count: 6,
    platform_arr: 0,
  });
  const [loading, setLoading] = useState(false);
  const [termSheet, setTermSheet] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const generate = async () => {
    setLoading(true);
    const res = await base44.functions.invoke("generateAcquisitionTermSheet", form);
    if (res.data?.success) setTermSheet(res.data.term_sheet);
    setLoading(false);
  };

  const downloadTxt = () => {
    if (!termSheet) return;
    const blob = new Blob([exportToText(termSheet)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ZARP-Acquisition-TermSheet-${termSheet.meta.reference}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const ts = termSheet;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-950 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-yellow-400" />
            <div>
              <p className="text-white font-black text-sm">Acquisition Term Sheet Generator</p>
              <p className="text-gray-500 text-xs">Full asset purchase — non-binding LOI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!termSheet ? (
            // ── Input Form ──
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-1">Buyer Name</label>
                  <input className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                    value={form.buyer_name} onChange={e => set("buyer_name", e.target.value)} placeholder="e.g. John Smith" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-1">Buyer Organization</label>
                  <input className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                    value={form.buyer_org} onChange={e => set("buyer_org", e.target.value)} placeholder="e.g. Acme Corp" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-1">Asking Price ($)</label>
                  <input type="number" className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                    value={form.asking_price} onChange={e => set("asking_price", Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-1">IP Valuation Basis ($)</label>
                  <input type="number" className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                    value={form.ip_valuation} onChange={e => set("ip_valuation", Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-1">Deal Structure</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                    value={form.deal_structure} onChange={e => set("deal_structure", e.target.value)}>
                    {DEAL_STRUCTURES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                {form.deal_structure === "cash_and_equity" && (
                  <div>
                    <label className="text-gray-400 text-xs font-bold block mb-1">Equity Rollover %</label>
                    <input type="number" className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                      value={form.equity_rollover_pct} onChange={e => set("equity_rollover_pct", Number(e.target.value))} />
                  </div>
                )}
                {form.deal_structure === "earnout" && (
                  <>
                    <div>
                      <label className="text-gray-400 text-xs font-bold block mb-1">Earnout Amount ($)</label>
                      <input type="number" className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                        value={form.earnout_amount} onChange={e => set("earnout_amount", Number(e.target.value))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-gray-400 text-xs font-bold block mb-1">Earnout Triggers</label>
                      <input className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                        value={form.earnout_triggers} onChange={e => set("earnout_triggers", e.target.value)} />
                    </div>
                  </>
                )}
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-1">Exclusivity Period (days)</label>
                  <input type="number" className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                    value={form.exclusivity_days} onChange={e => set("exclusivity_days", Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-1">Closing Period (days)</label>
                  <input type="number" className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                    value={form.closing_period_days} onChange={e => set("closing_period_days", Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-1">Patent Count</label>
                  <input type="number" className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                    value={form.patent_count} onChange={e => set("patent_count", Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-1">Platform ARR ($ if any)</label>
                  <input type="number" className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                    value={form.platform_arr} onChange={e => set("platform_arr", Number(e.target.value))} />
                </div>
              </div>

              <button onClick={generate} disabled={loading}
                className="w-full py-3 rounded-xl font-black text-white text-sm bg-yellow-600 hover:bg-yellow-500 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><FileText size={14} /> Generate Full Acquisition Term Sheet</>}
              </button>
            </div>
          ) : (
            // ── Term Sheet Viewer ──
            <div className="space-y-3">
              {/* Header banner */}
              <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-xl px-4 py-3 text-center">
                <p className="text-yellow-300 font-black text-base">{ts.meta.title}</p>
                <p className="text-yellow-200/70 text-xs mt-0.5">{ts.meta.subtitle}</p>
                <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-yellow-200/50">
                  <span>Ref: {ts.meta.reference}</span>
                  <span>Date: {ts.meta.date}</span>
                  <span>{ts.meta.confidentiality}</span>
                </div>
              </div>

              <Section title="Parties">
                <Row label="Seller" value={`${ts.parties.seller.name} (${ts.parties.seller.dba})`} />
                <Row label="Buyer" value={`${ts.parties.buyer.name}${ts.parties.buyer.org ? ", " + ts.parties.buyer.org : ""}`} />
                <Row label="Transaction Type" value={ts.transaction.type} highlight />
              </Section>

              <Section title="Transaction Economics">
                <Row label="Asking Price" value={CURRENCY(ts.transaction.asking_price_usd)} highlight />
                <Row label="IP Valuation Basis" value={CURRENCY(ts.transaction.ip_valuation_basis_usd)} />
                <Row label="Deal Structure" value={ts.transaction.deal_structure} />
                <Row label="Platform ARR" value={ts.transaction.platform_arr_usd > 0 ? CURRENCY(ts.transaction.platform_arr_usd) : "Pre-revenue"} />
                <Row label="Revenue Multiple" value={ts.transaction.revenue_multiple} />
              </Section>

              <Section title="Assets Included (Schedule A)">
                <BulletList items={ts.assets_included} color="text-green-400" />
              </Section>

              <Section title="Assets Excluded (Schedule B)" defaultOpen={false}>
                <BulletList items={ts.assets_excluded} color="text-red-400" />
              </Section>

              <Section title="Closing Timeline">
                {ts.timeline.key_milestones.map((m, i) => (
                  <div key={i} className="flex gap-3 text-xs py-1 border-b border-gray-800/50 last:border-0">
                    <span className="text-cyan-400 font-bold shrink-0 w-28">{m.timing}</span>
                    <span className="text-gray-300">{m.event}</span>
                  </div>
                ))}
                <div className="mt-2 flex gap-4 text-xs">
                  <span className="text-gray-500">Exclusivity ends: <span className="text-yellow-300 font-bold">{ts.timeline.exclusivity_end_date}</span></span>
                  <span className="text-gray-500">Target close: <span className="text-yellow-300 font-bold">{ts.timeline.closing_deadline || ts.timeline.key_milestones.at(-1)?.event}</span></span>
                </div>
              </Section>

              <Section title="Conditions to Closing" defaultOpen={false}>
                <p className="text-gray-400 text-xs font-bold mb-1">Buyer Conditions:</p>
                <BulletList items={ts.conditions.buyer_conditions} color="text-blue-400" />
                <p className="text-gray-400 text-xs font-bold mt-3 mb-1">Seller Conditions:</p>
                <BulletList items={ts.conditions.seller_conditions} color="text-purple-400" />
              </Section>

              <Section title="Representations & Warranties" defaultOpen={false}>
                <p className="text-gray-400 text-xs font-bold mb-1">Seller:</p>
                <BulletList items={ts.representations_warranties.seller} />
                <p className="text-gray-400 text-xs font-bold mt-3 mb-1">Buyer:</p>
                <BulletList items={ts.representations_warranties.buyer} color="text-purple-400" />
              </Section>

              <Section title="Post-Closing Obligations" defaultOpen={false}>
                <Row label="Transition Support" value={ts.post_closing.transition_support} />
                <Row label="Non-Compete" value={ts.post_closing.non_compete} />
                <Row label="Non-Solicitation" value={ts.post_closing.non_solicitation} />
                <Row label="Indemnification" value={ts.post_closing.indemnification} />
                {ts.post_closing.escrow !== "N/A" && <Row label="Escrow" value={ts.post_closing.escrow} />}
              </Section>

              <Section title="Exclusivity" defaultOpen={false}>
                <Row label="Period" value={`${ts.exclusivity.period_days} days (until ${ts.exclusivity.end_date})`} highlight />
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">{ts.exclusivity.terms}</p>
                <p className="text-gray-500 text-xs mt-1">{ts.exclusivity.break_fee}</p>
              </Section>

              <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl px-4 py-3">
                <p className="text-amber-300/80 text-xs leading-relaxed"><strong className="text-amber-300">Disclaimer:</strong> {ts.disclaimer}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={downloadTxt}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-white text-xs font-black transition-all">
                  <Download size={13} /> Download .txt
                </button>
                <button onClick={() => setTermSheet(null)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-bold transition-all">
                  Edit Inputs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}