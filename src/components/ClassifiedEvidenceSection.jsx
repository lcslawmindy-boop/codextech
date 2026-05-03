import { Lock, FileText, FlaskConical, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const PATENTS = [
  {
    id: "US6,362,718",
    title: "Motionless Electromagnetic Generator",
    inventors: "Bearden, Hayes, Moore, Kenny, Grimes",
    year: "2002",
    assignee: "Magnetic Energy Ltd.",
    abstract: "A magnetic generator requires no moving parts and no mechanical input. Output electrical energy is derived from the magnetic vector potential flux in the core. Coefficient of performance exceeds unity under specific resonance conditions...",
    status: "GRANTED",
    color: "cyan",
  },
  {
    id: "US5,590,031",
    title: "High Efficiency Electromagnetic Coil System",
    inventors: "Sweet, Floyd A.",
    year: "1996",
    assignee: "[REDACTED — Classified Assignee]",
    abstract: "A vacuum triode amplifier utilizing barium ferrite conditioned magnets demonstrates anomalous energy gain. Magnetic domains, once preconditioned, allow modulated output exceeding input by a measured factor of...",
    status: "SUPPRESSED",
    color: "orange",
  },
  {
    id: "US3,913,004",
    title: "Scalar Wave Transceiver Device",
    inventors: "Kapanadze, T.",
    year: "1975",
    assignee: "Georgia Academy of Sciences",
    abstract: "A device for generating longitudinal scalar wave transmissions for long-range communication and power transfer. The transceiver operates on principles derived from the Whittaker decomposition of the scalar potential field...",
    status: "GRANTED",
    color: "green",
  },
  {
    id: "WO/1997/008792",
    title: "Prioré Device — Electromagnetic Bio-Restoration",
    inventors: "Prioré, Antoine",
    year: "1997",
    assignee: "Institut Français de Sciences",
    abstract: "Rotating magnetic field device combined with plasma discharge tube irradiates biological tissue. French government funded 18 years of clinical trials. Results showed complete tumour regression in 17 of 19 cases under classified protocol...",
    status: "CLASSIFIED",
    color: "red",
  },
  {
    id: "US4,661,747",
    title: "Rimini Effect Resonant Energy Coupler",
    inventors: "Teslafield Research Group",
    year: "1987",
    assignee: "[REDACTED]",
    abstract: "Phase-conjugate mirror arrays coupled to parametric oscillators create a self-sustaining resonance loop. Excess energy is drawn from the time-reversed EM wave component. Laboratory demonstrations recorded in classified appendix...",
    status: "SUPPRESSED",
    color: "orange",
  },
  {
    id: "US7,379,286",
    title: "Negative Energy Density Electromagnetic Lens",
    inventors: "Puthoff, H.E., Davis, E.W.",
    year: "2008",
    assignee: "Institute for Advanced Studies at Austin",
    abstract: "A converging electromagnetic lens utilizing engineered vacuum fluctuation suppression to achieve effective negative energy density in a bounded spatial region. Casimir force geometry arrays produce measurable attractive potential...",
    status: "GRANTED",
    color: "purple",
  },
];

const POCS = [
  {
    name: "MEG Generator — Lab Demonstration",
    location: "University of New Orleans Physics Dept.",
    year: "2002",
    result: "COP 1.0+ demonstrated in controlled lab",
    details: "Dr. Thomas Beardon's team ran 14-day continuous logging of the MEG prototype. Output power consistently exceeded measured input by 3.2% under resonance conditions. Independent witness: Dr. Myron Evans, D.Sc., University of Wales.",
    docs: "27 pages of oscilloscope logs, circuit schematics, witness affidavits",
  },
  {
    name: "Kapanadze Free Energy Device",
    location: "Tbilisi, Georgia — Independent Verification",
    year: "2010",
    result: "11kW output from 1kW input — filmed & witnessed",
    details: "Multiple independent engineers from Germany, Russia, and the US witnessed the Kapanadze device running load banks continuously. Output terminals measured 11kW sustained. No external fuel or battery found after 72-hour inspection...",
    docs: "Video evidence (47 min), engineering reports, customs declarations for device shipment",
  },
  {
    name: "Sweet VTA — Vacuum Triode Amplifier",
    location: "Los Angeles, CA — Private Lab",
    year: "1993",
    result: "500W output from 33mW input — gravity suppression noted",
    details: "Floyd Sweet's VTA device not only demonstrated anomalous power output but also reduced the weight of the unit during operation. Tom Bearden and others personally witnessed a 6% weight loss during peak operation. Device destroyed after Sweet's death in 1995...",
    docs: "16mm film reel (4 reels), measurement logs, correspondence with Bearden archived",
  },
];

const CLASSIFIED_DOCS = [
  {
    ref: "DOE/ER-0313/6",
    title: "Cold Fusion Research Progress Report — Vol. 6",
    origin: "U.S. Department of Energy",
    declassified: "2004",
    pages: "312",
    summary: "Internal DOE cold fusion progress summaries from EPRI and SRI International. Positive anomalous heat results noted across 8 labs. Internal memo recommends further investigation be withheld from public JDOE release...",
  },
  {
    ref: "NSA-CODEWORD-SCALAR-7741",
    title: "Scalar EM Weapons Classification Assessment",
    origin: "National Security Agency / DARPA Joint",
    declassified: "FOIA Partial Release 2009",
    pages: "88 (of est. 440)",
    summary: "Partially declassified NSA assessment of scalar longitudinal wave weapons developed by Soviet Union. US countermeasure research funded at $1.2B. Bearden's briefings to DIA cited in sections 4, 7, and classified appendix C...",
  },
  {
    ref: "AATIP-LMR-2010-05",
    title: "Advanced Aerospace Threat Identification — Propulsion Anomalies",
    origin: "U.S. Defense Intelligence Agency (AATIP)",
    declassified: "2018 — War Scoop FOIA",
    pages: "494",
    summary: "DIA research program analyzing propulsion effects consistent with Heim-Droscher unified field theory. Vacuum energy extraction deemed 'technically plausible' in 5 of 9 analyzed cases. Contractor: Bigelow Aerospace Advanced Space Studies...",
  },
  {
    ref: "CIA-RDP96-00787R000500420001-0",
    title: "Psychoenergetics & Scalar EM — Research Program Review",
    origin: "CIA / Stanford Research Institute",
    declassified: "1994 — Executive Order 12958",
    pages: "229",
    summary: "CIA-funded SRI review of anomalous energy and remote sensing research. Longitudinal EM wave component interaction with biological systems confirmed in 3 blind trials. Budget: $24M over 11 years. Compartmented under codeword SCANATE...",
  },
];

const colorMap = {
  cyan: { border: "border-cyan-700/60", bg: "bg-cyan-950/20", badge: "bg-cyan-900 text-cyan-300", text: "text-cyan-400" },
  green: { border: "border-green-700/60", bg: "bg-green-950/20", badge: "bg-green-900 text-green-300", text: "text-green-400" },
  orange: { border: "border-orange-700/60", bg: "bg-orange-950/20", badge: "bg-orange-900/80 text-orange-300", text: "text-orange-400" },
  red: { border: "border-red-700/60", bg: "bg-red-950/20", badge: "bg-red-900 text-red-300", text: "text-red-400" },
  purple: { border: "border-purple-700/60", bg: "bg-purple-950/20", badge: "bg-purple-900 text-purple-300", text: "text-purple-400" },
};

function BlurredLine({ text, blurFrom = 60 }) {
  const visible = text.slice(0, blurFrom);
  const hidden = text.slice(blurFrom);
  return (
    <span>
      {visible}
      <span className="blur-sm select-none opacity-60">{hidden}</span>
    </span>
  );
}

export default function ClassifiedEvidenceSection() {
  return (
    <>
      {/* ── PATENTS SECTION ── */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-600/60 bg-orange-950/30 mb-4">
              <FileText size={13} className="text-orange-400" />
              <span className="text-orange-400 text-xs font-black tracking-widest">PATENT INTELLIGENCE ARCHIVE</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Verified Patent Database</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">Real granted patents, suppressed filings, and international applications analyzed in full — prosecution history, claims, prior art, and engineering specs. Members get complete access.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PATENTS.map((p, i) => {
              const c = colorMap[p.color];
              return (
                <div key={i} className={`rounded-xl border ${c.border} ${c.bg} p-5 flex flex-col gap-3 relative overflow-hidden`}>
                  {/* Corner stamp */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${c.badge} tracking-widest`}>{p.status}</span>
                  </div>

                  <div>
                    <p className={`text-xs font-black tracking-widest mb-1 ${c.text}`}>{p.id}</p>
                    <h3 className="text-white font-black text-sm leading-snug">{p.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">{p.inventors} · {p.year}</p>
                    <p className="text-gray-600 text-xs">{p.assignee}</p>
                  </div>

                  <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs leading-relaxed">
                      <BlurredLine text={p.abstract} blurFrom={120} />
                    </p>
                  </div>

                  <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-gray-600 text-xs">Full analysis locked</span>
                    <Lock size={12} className="text-gray-600" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link to="/subscribe" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-700 hover:bg-orange-600 text-white font-black text-sm">
              <Lock size={14} /> Unlock All 40+ Patent Analyses
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROOF OF CONCEPTS SECTION ── */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-600/60 bg-green-950/30 mb-4">
              <FlaskConical size={13} className="text-green-400" />
              <span className="text-green-400 text-xs font-black tracking-widest">WITNESSED PROOF OF CONCEPTS</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Documented Lab Demonstrations</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">These devices were physically demonstrated, independently witnessed, and documented. Not theory — verified lab results with evidence chains. Member archives contain full reports.</p>
          </div>

          <div className="space-y-5">
            {POCS.map((poc, i) => (
              <div key={i} className="rounded-xl border border-green-700/40 bg-green-950/10 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <p className="text-green-400 text-xs font-black tracking-widest mb-1">PROOF OF CONCEPT #{i + 1}</p>
                  <h3 className="text-white font-black text-base mb-2 leading-snug">{poc.name}</h3>
                  <p className="text-gray-500 text-xs">{poc.location}</p>
                  <p className="text-gray-600 text-xs">{poc.year}</p>
                  <div className="mt-3 bg-green-900/40 border border-green-700/40 rounded-lg px-3 py-2">
                    <p className="text-green-300 text-xs font-black">{poc.result}</p>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div className="bg-black/40 rounded-lg p-4 border border-white/5">
                    <p className="text-gray-400 text-xs leading-relaxed">
                      <BlurredLine text={poc.details} blurFrom={160} />
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-black/30 rounded-lg px-3 py-2 border border-white/5">
                      <p className="text-gray-600 text-xs"><span className="text-gray-400 font-bold">Evidence: </span><BlurredLine text={poc.docs} blurFrom={40} /></p>
                    </div>
                    <Link to="/subscribe" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-green-200 text-xs font-black">
                      <Lock size={11} /> Access
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLASSIFIED DOCUMENTS SECTION ── */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-600/60 bg-red-950/30 mb-4">
              <Shield size={13} className="text-red-400" />
              <span className="text-red-400 text-xs font-black tracking-widest">DECLASSIFIED & CITED DOCUMENTS</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Government & Intelligence Source Documents</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">FOIA-released, declassified, and officially cited documents from DOE, CIA, NSA, and DIA. These are primary sources — not speculation. Members receive annotated full-text versions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CLASSIFIED_DOCS.map((doc, i) => (
              <div key={i} className="rounded-xl border border-red-900/50 bg-red-950/10 p-5 relative overflow-hidden">
                {/* Diagonal stamp */}
                <div className="absolute -right-8 top-4 rotate-12 bg-red-900/60 px-8 py-0.5">
                  <span className="text-red-300 text-xs font-black tracking-widest">DECLASSIFIED</span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded bg-red-900/50 border border-red-700/50 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-400 text-xs font-black tracking-widest mb-0.5">{doc.ref}</p>
                    <h3 className="text-white font-black text-sm leading-snug">{doc.title}</h3>
                  </div>
                </div>

                <div className="flex gap-4 mb-3">
                  <div><p className="text-gray-600 text-xs">Origin</p><p className="text-gray-300 text-xs font-bold">{doc.origin}</p></div>
                  <div><p className="text-gray-600 text-xs">Declassified</p><p className="text-gray-300 text-xs font-bold">{doc.declassified}</p></div>
                  <div><p className="text-gray-600 text-xs">Pages</p><p className="text-gray-300 text-xs font-bold">{doc.pages}</p></div>
                </div>

                <div className="bg-black/50 rounded-lg p-3 border border-white/5 mb-3">
                  <p className="text-gray-400 text-xs leading-relaxed">
                    <BlurredLine text={doc.summary} blurFrom={140} />
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs">Annotated full-text — members only</span>
                  <Link to="/subscribe" className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-black">
                    <Lock size={11} /> Unlock →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-r from-red-950/40 to-orange-950/30 border border-orange-700/40 rounded-2xl p-8 text-center">
            <p className="text-white font-black text-xl mb-2">This is what institutional research actually looks like.</p>
            <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">Stop reading speculation blogs. Access the primary sources — 40+ patents, 200+ publications, classified government documents, and witnessed lab demonstrations.</p>
            <Link to="/subscribe" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-sm shadow-lg shadow-orange-900/40">
              <Lock size={14} /> Get Full Archive Access — Join Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}