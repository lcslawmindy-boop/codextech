import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Landmark, Gavel, GraduationCap, Building2, Handshake,
  Coins, AlertTriangle, Rocket, CheckCircle2, Link2,
} from "lucide-react";

// The $0 trade: what the partner brings vs. what you give.
const PARTNERS = [
  {
    icon: Gavel, accent: "#06b6d4", name: "Patent Pro Bono / IP Clinic",
    brings: "Free provisional filing + disclosure drafting for income-qualified inventors (USPTO Patent Pro Bono Program, ABA-inventor assistance, university IP clinics).",
    gives: "Nothing — pro bono is free by definition. Some clinics cap at micro-entity income. Otherwise: contingency counsel takes 1-3% equity or a small license slice in lieu of hourly fees.",
    fit: "Non-ITAR leads (SVRRD, MYTSA, NSBDM). Cannot be used for ITAR-controlled assets.",
  },
  {
    icon: GraduationCap, accent: "#10b981", name: "University Sponsored-Research / STTR",
    brings: "Lab, grad students, IRB infrastructure, equipment, and federal STTR grant money. The university runs the study; you keep or co-own the IP.",
    gives: "Royalty share or co-assignment on resulting IP. You license back exclusively for commercialization.",
    fit: "SVRRD (civil/environmental engineering dept), MYTSA (agriculture school), NSBDM (biomedical imaging), UBSCHLP (integrative-health research center).",
  },
  {
    icon: Building2, accent: "#fbbf24", name: "Strategic OEM Co-Development",
    brings: "Funds the prototype build, test rigs, field sites, and manufacturing. They carry the capex you can't.",
    gives: "Exclusive license in their vertical (e.g. water restoration, ag-tech), IP stays with you. They fund; you license.",
    fit: "Water/environmental OEM for SVRRD. Ag-tech OEM for MYTSA. Diagnostics OEM for NSBDM.",
  },
  {
    icon: Landmark, accent: "#a78bfa", name: "Federal Grants (SBIR / STTR / ARPA-E / NSF / USDA / NIH)",
    brings: "Non-dilutive cash. $75k-$1.9M per award. This is your first real capital — and it costs $0 to apply.",
    gives: "Nothing. Grants do not cost equity. You deliver the research.",
    fit: "AFWERX (INV-01), Army ARL (INV-03), NSF (SVRRD), USDA NIFA (MYTSA), NIH NIBIB (NSBDM). All five drafts are submission-ready in the app.",
  },
  {
    icon: Handshake, accent: "#f472b6", name: "Foundation / Humanitarian Deploy Partner",
    brings: "Field deployment funding, local partners, and credibility for global-health grants (Gates, BARDA, NIH).",
    gives: "Humanitarian open license for low-resource markets; you retain commercial rights elsewhere.",
    fit: "SVRRD (river restoration in developing regions) and MYTSA (low-input farming).",
  },
  {
    icon: Coins, accent: "#60a5fa", name: "IP Broker on Success Fee",
    brings: "Outbound licensing/acquisition deal-sourcing. They find buyers/licensees.",
    gives: "10-25% of any deal they close. $0 upfront.",
    fit: "Only after at least one provisional is filed and one grant is in. A broker with nothing on file has nothing to sell.",
  },
];

// What you can literally do this week for $0.
const THIS_WEEK = [
  "Apply to the USPTO Patent Pro Bono Program (income-qualified) and contact 3 ABA-accredited university IP law clinics — target free provisional filing for SVRRD and MYTSA.",
  "Sign and witness dated inventor's notebooks for all 20 filing-authorized assets to lock in conception dates ($0).",
  "Submit the 5 drafted grant proposals from the app — AFWERX, Army ARL, NSF, USDA NIFA, NIH NIBIB. Submission is free.",
  "Email 3 university labs (environmental engineering, agriculture, biomedical imaging) with a one-page STTR / sponsored-research ask.",
  "Identify 2-3 strategic OEMs in water restoration and ag-tech and send a co-development license one-pager.",
];

const SEQUENCE = [
  { n: 1, label: "Lock conception for free", when: "Day 0-3", body: "Witnessed, dated inventor's notebooks for all 20 assets. Costs nothing; establishes priority evidence if a disclosure happens." },
  { n: 2, label: "Free provisional filing", when: "Day 4-21", body: "Patent Pro Bono or IP clinic files provisionals for the 2 strongest non-ITAR leads (SVRRD, MYTSA). No USPTO fee for pro-bono micro-entity; no counsel fee." },
  { n: 3, label: "Submit grants ($0)", when: "Day 4-14", body: "AFWERX, Army ARL, NSF, USDA NIFA, NIH NIBIB — all submission-ready. Non-dilutive. The first award that lands is your first real capital." },
  { n: 4, label: "University STTR / sponsored research", when: "Day 7-30", body: "University partner brings lab + federal STTR match for SVRRD, MYTSA, NSBDM. You license back commercial rights." },
  { n: 5, label: "OEM co-development license", when: "Day 14-45", body: "Strategic OEM funds the build in exchange for exclusive vertical license. IP stays with you. No cash from you." },
  { n: 6, label: "First grant lands → real capital", when: "Month 3-9", body: "Phase I SBIR/NSF/USDA = $75k-$300k non-dilutive. This cash funds the ITAR provisionals + DDTC registration — the ITAR track is frozen until this point." },
  { n: 7, label: "Engage broker on success fee", when: "After step 2 + 6", body: "Once a provisional is filed and a grant is in, an IP broker sources license/acquisition deals for 10-25% of proceeds. $0 upfront." },
];

function Constraint() {
  return (
    <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-4 flex gap-3">
      <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
      <div className="text-amber-200/90 text-xs leading-relaxed">
        <b>The honest constraint.</b> With $0 you cannot do DDTC registration (~$2,750/yr), patent prosecution
        beyond pro-bono provisionals, or foreign filing. <b>The ITAR defense track is frozen</b> until a grant
        or partner brings cash. Lead entirely with the non-ITAR clean track — SVRRD, MYTSA, NSBDM — which need
        no export-control infrastructure and have the strongest fundable grant pathways.
      </div>
    </div>
  );
}

function PartnerCard({ p }) {
  const [open, setOpen] = useState(false);
  const Icon = p.icon;
  return (
    <div className="rounded-xl border bg-slate-900/60 overflow-hidden" style={{ borderColor: p.accent + "40" }}>
      <button onClick={() => setOpen(!open)} className="w-full text-left p-3 flex items-center gap-2">
        <Icon size={16} style={{ color: p.accent }} />
        <span className="text-white text-xs font-bold flex-1">{p.name}</span>
        <span className="text-[10px] text-slate-500">{open ? "hide" : "open"}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-slate-800 pt-3 space-y-2 text-xs">
          <p><span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">They bring</span><br /><span className="text-slate-300">{p.brings}</span></p>
          <p><span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider">You give</span><br /><span className="text-slate-300">{p.gives}</span></p>
          <p><span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Best fit</span><br /><span className="text-slate-300">{p.fit}</span></p>
        </div>
      )}
    </div>
  );
}

export default function ZeroCapitalPlan() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-4 py-3 sticky top-0 z-40 bg-slate-950/95 backdrop-blur flex items-center gap-2">
        <Link to="/zds33-admin" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-white font-black text-sm">Zero-Capital Partnership Plan</h1>
          <p className="text-slate-500 text-[10px]">Trade future IP rights for present resources · $0 to start</p>
        </div>
      </div>

      <div className="px-4 py-4 max-w-3xl mx-auto">
        {/* Premise */}
        <div className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 p-4 mb-5">
          <p className="text-cyan-100 text-xs leading-relaxed">
            <b>The core trade.</b> With $0 you cannot file, build, or register. So you exchange future IP rights
            for the resources you need <i>now</i> — counsel, lab, manufacturing, distribution — and you use
            free-to-submit grants as your first real capital. Two assets lead this plan because they are non-ITAR,
            low-regulation, and have the strongest grant pathways: <b>SVRRD</b> (passive vortex river restoration,
            viability 66/100) and <b>MYTSA</b> (low-input agricultural array, 58/100).
          </p>
        </div>

        <Constraint />

        {/* This week */}
        <section className="mt-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Rocket size={16} className="text-cyan-400" />
            <h2 className="text-white font-black text-base">Do this week — $0</h2>
          </div>
          <ul className="space-y-2">
            {THIS_WEEK.map((t, i) => (
              <li key={i} className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Partners */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Handshake size={16} className="text-cyan-400" />
            <h2 className="text-white font-black text-base">Who you partner with & what you trade</h2>
          </div>
          <div className="space-y-2">
            {PARTNERS.map((p) => <PartnerCard key={p.name} p={p} />)}
          </div>
        </section>

        {/* Sequence */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Coins size={16} className="text-cyan-400" />
            <h2 className="text-white font-black text-base">The $0 → capital sequence</h2>
          </div>
          <div className="space-y-2">
            {SEQUENCE.map((s) => (
              <div key={s.n} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">{s.n}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-sm font-bold">{s.label}</p>
                      <span className="text-[10px] text-cyan-400 font-bold">{s.when}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed mt-1">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Risks */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="text-white font-black text-base">Risks of the $0 path</h2>
          </div>
          <ul className="space-y-1.5 text-slate-400 text-xs list-disc ml-5">
            <li>Slower — partners and grants move on their timeline, not yours.</li>
            <li>You give up equity or license upside you'd otherwise keep.</li>
            <li>Pro-bono counsel is income-gated and caps the number of assets you can file.</li>
            <li>A university co-owning IP dilutes your negotiating position with later investors.</li>
            <li>Any public disclosure before a provisional is filed destroys novelty — file first, talk second.</li>
          </ul>
        </section>

        {/* Linked tools */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Link2 size={16} className="text-cyan-400" />
            <h2 className="text-white font-black text-base">Tools already in this app</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Link to="/grant-templates" className="rounded-xl border border-violet-700/40 bg-violet-950/20 p-3 hover:border-violet-500">
              <p className="text-violet-300 text-xs font-bold">Grant Templates — AFWERX · Army ARL · NSF · USDA NIFA</p>
              <p className="text-slate-500 text-[10px] mt-0.5">Submission-ready PDFs. Free to submit. Your first capital.</p>
            </Link>
            <Link to="/filing-playbook" className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 p-3 hover:border-cyan-500">
              <p className="text-cyan-300 text-xs font-bold">Filing & Equity-Raise Playbook — claim drafts + sequence</p>
              <p className="text-slate-500 text-[10px] mt-0.5">Draft claims for every asset. Counsel reviews before filing.</p>
            </Link>
            <Link to="/investor-portfolio" className="rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-3 hover:border-emerald-500">
              <p className="text-emerald-300 text-xs font-bold">Investor Portfolio — top 10 viability scorecard</p>
              <p className="text-slate-500 text-[10px] mt-0.5">Why SVRRD and MYTSA lead this plan.</p>
            </Link>
          </div>
        </section>

        <p className="text-amber-400/70 text-[10px] italic leading-relaxed">
          Nothing here is a filed patent, an investment offer, or legal advice. Pro-bono eligibility is
          income-gated and confirmed by the program. Claim drafts and grant proposals require counsel review.
        </p>
      </div>
    </div>
  );
}