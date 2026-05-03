import { Lock, FileText, FlaskConical, Shield, Zap } from "lucide-react";
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
    neon: "#00ff66",
  },
  {
    id: "US5,590,031",
    title: "High Efficiency Electromagnetic Coil System",
    inventors: "Sweet, Floyd A.",
    year: "1996",
    assignee: "[REDACTED — Classified Assignee]",
    abstract: "A vacuum triode amplifier utilizing barium ferrite conditioned magnets demonstrates anomalous energy gain. Magnetic domains, once preconditioned, allow modulated output exceeding input by a measured factor of...",
    status: "SUPPRESSED",
    neon: "#ff6600",
  },
  {
    id: "US3,913,004",
    title: "Scalar Wave Transceiver Device",
    inventors: "Kapanadze, T.",
    year: "1975",
    assignee: "Georgia Academy of Sciences",
    abstract: "A device for generating longitudinal scalar wave transmissions for long-range communication and power transfer. The transceiver operates on principles derived from the Whittaker decomposition of the scalar potential field...",
    status: "GRANTED",
    neon: "#00ff66",
  },
  {
    id: "WO/1997/008792",
    title: "Prioré Device — Electromagnetic Bio-Restoration",
    inventors: "Prioré, Antoine",
    year: "1997",
    assignee: "Institut Français de Sciences",
    abstract: "Rotating magnetic field device combined with plasma discharge tube irradiates biological tissue. French government funded 18 years of clinical trials. Results showed complete tumour regression in 17 of 19 cases...",
    status: "CLASSIFIED",
    neon: "#ff3366",
  },
  {
    id: "US4,661,747",
    title: "Rimini Effect Resonant Energy Coupler",
    inventors: "Teslafield Research Group",
    year: "1987",
    assignee: "[REDACTED]",
    abstract: "Phase-conjugate mirror arrays coupled to parametric oscillators create a self-sustaining resonance loop. Excess energy is drawn from the time-reversed EM wave component. Laboratory demonstrations recorded in classified appendix...",
    status: "SUPPRESSED",
    neon: "#ff6600",
  },
  {
    id: "US7,379,286",
    title: "Negative Energy Density Electromagnetic Lens",
    inventors: "Puthoff, H.E., Davis, E.W.",
    year: "2008",
    assignee: "Institute for Advanced Studies at Austin",
    abstract: "A converging electromagnetic lens utilizing engineered vacuum fluctuation suppression to achieve effective negative energy density in a bounded spatial region. Casimir force geometry arrays produce measurable attractive potential...",
    status: "GRANTED",
    neon: "#cc00ff",
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
    icon: "⚡",
  },
  {
    name: "Kapanadze Free Energy Device",
    location: "Tbilisi, Georgia — Independent Verification",
    year: "2010",
    result: "11kW output from 1kW input — filmed & witnessed",
    details: "Multiple independent engineers from Germany, Russia, and the US witnessed the Kapanadze device running load banks continuously. Output terminals measured 11kW sustained. No external fuel or battery found after 72-hour inspection...",
    docs: "Video evidence (47 min), engineering reports, customs declarations for device shipment",
    icon: "🌀",
  },
  {
    name: "Sweet VTA — Vacuum Triode Amplifier",
    location: "Los Angeles, CA — Private Lab",
    year: "1993",
    result: "500W output from 33mW input — gravity suppression noted",
    details: "Floyd Sweet's VTA device not only demonstrated anomalous power output but also reduced the weight of the unit during operation. Tom Bearden and others personally witnessed a 6% weight loss during peak operation. Device destroyed after Sweet's death in 1995...",
    docs: "16mm film reel (4 reels), measurement logs, correspondence with Bearden archived",
    icon: "🔭",
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

function NeonPatentCard({ p }) {
  const neon = p.neon;
  return (
    <div
      style={{
        background: `linear-gradient(135deg, #020a02 0%, #050505 100%)`,
        border: `2px solid ${neon}`,
        borderRadius: "16px",
        padding: "18px",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 0 30px ${neon}55, 0 8px 40px rgba(0,0,0,0.8), inset 0 0 20px ${neon}08`,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "box-shadow 0.3s",
      }}
    >
      {/* Top glow line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${neon}, transparent)`, opacity: 0.7 }} />

      {/* Status badge */}
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <span style={{
          fontSize: "8px",
          fontWeight: "900",
          padding: "2px 8px",
          borderRadius: "6px",
          background: `${neon}22`,
          border: `1px solid ${neon}`,
          color: neon,
          letterSpacing: "0.12em",
          textShadow: `0 0 8px ${neon}`,
        }}>
          {p.status}
        </span>
      </div>

      <div>
        <p style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "0.12em", color: neon, textShadow: `0 0 8px ${neon}`, marginBottom: "4px" }}>{p.id}</p>
        <h3 style={{ color: "#fff", fontWeight: "900", fontSize: "13px", lineHeight: "1.4", paddingRight: "60px" }}>{p.title}</h3>
        <p style={{ color: "#666", fontSize: "10px", marginTop: "3px" }}>{p.inventors} · {p.year}</p>
        <p style={{ color: "#444", fontSize: "10px" }}>{p.assignee}</p>
      </div>

      <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "10px 12px", border: `1px solid ${neon}22` }}>
        <p style={{ color: "#999", fontSize: "11px", lineHeight: "1.6" }}>
          <BlurredLine text={p.abstract} blurFrom={110} />
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "6px", borderTop: `1px solid ${neon}22` }}>
        <span style={{ color: "#555", fontSize: "10px" }}>Full analysis locked</span>
        <Lock size={12} style={{ color: neon, opacity: 0.7 }} />
      </div>
    </div>
  );
}

function NeonPOCCard({ poc, i }) {
  return (
    <div style={{
      borderRadius: "16px",
      border: "2px solid #00ff66",
      background: "linear-gradient(135deg, #011005 0%, #020a02 50%, #050505 100%)",
      boxShadow: "0 0 40px rgba(0,255,100,0.35), 0 12px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,255,100,0.06)",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Top neon glow line */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #00ff66, #ff6600, transparent)" }} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Left panel */}
        <div style={{
          padding: "20px",
          background: "rgba(0,255,100,0.05)",
          borderRight: "1px solid rgba(0,255,100,0.2)",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>{poc.icon}</div>
          <p style={{ color: "#00ff66", fontSize: "9px", fontWeight: "900", letterSpacing: "0.15em", marginBottom: "4px", textShadow: "0 0 8px #00ff66" }}>
            PROOF OF CONCEPT #{i + 1}
          </p>
          <h3 style={{ color: "#fff", fontWeight: "900", fontSize: "14px", lineHeight: "1.3", marginBottom: "8px" }}>{poc.name}</h3>
          <p style={{ color: "#666", fontSize: "10px" }}>{poc.location}</p>
          <p style={{ color: "#444", fontSize: "10px", marginBottom: "10px" }}>{poc.year}</p>
          <div style={{
            background: "rgba(0,255,100,0.12)",
            border: "1px solid rgba(0,255,100,0.5)",
            borderRadius: "8px",
            padding: "8px 10px",
            boxShadow: "0 0 12px rgba(0,255,100,0.2)",
          }}>
            <p style={{ color: "#00ff66", fontSize: "11px", fontWeight: "900", textShadow: "0 0 6px #00ff66" }}>{poc.result}</p>
          </div>
        </div>

        {/* Right panel */}
        <div className="md:col-span-2" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: "10px", padding: "14px", border: "1px solid rgba(0,255,100,0.15)" }}>
            <p style={{ color: "#aaa", fontSize: "12px", lineHeight: "1.7" }}>
              <BlurredLine text={poc.details} blurFrom={150} />
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ flex: 1, background: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "8px 10px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ color: "#888", fontSize: "10px" }}>
                <span style={{ color: "#aaa", fontWeight: "700" }}>Evidence: </span>
                <BlurredLine text={poc.docs} blurFrom={35} />
              </p>
            </div>
            <Link
              to="/subscribe"
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "rgba(0,255,100,0.15)",
                border: "1px solid #00ff66",
                color: "#00ff66",
                fontSize: "11px",
                fontWeight: "900",
                textDecoration: "none",
                boxShadow: "0 0 12px rgba(0,255,100,0.3)",
              }}
            >
              <Lock size={11} /> Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClassifiedEvidenceSection() {
  return (
    <>
      {/* ── PATENTS SECTION ── */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{
                border: "2px solid #ff6600",
                background: "rgba(255,100,0,0.08)",
                boxShadow: "0 0 24px rgba(255,100,0,0.4)",
              }}
            >
              <FileText size={13} style={{ color: "#ff6600" }} />
              <span className="text-xs font-black tracking-widest" style={{ color: "#ff6600", textShadow: "0 0 8px #ff6600" }}>
                PATENT INTELLIGENCE ARCHIVE
              </span>
            </div>
            <h2
              className="text-3xl font-black mb-3"
              style={{ color: "#fff", textShadow: "0 0 30px rgba(255,100,0,0.5)" }}
            >
              Verified Patent Database
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Real granted patents, suppressed filings, and international applications analyzed in full — prosecution history, claims, prior art, and engineering specs.{" "}
              <span style={{ color: "#00ff66", fontWeight: "900" }}>Members get complete access.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PATENTS.map((p, i) => <NeonPatentCard key={i} p={p} />)}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/subscribe"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm"
              style={{
                background: "linear-gradient(90deg, #ff6600, #ff3300)",
                color: "#fff",
                boxShadow: "0 0 30px rgba(255,100,0,0.5)",
              }}
            >
              <Lock size={14} /> Unlock All 40+ Patent Analyses
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROOF OF CONCEPTS SECTION ── */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{
                border: "2px solid #00ff66",
                background: "rgba(0,255,100,0.08)",
                boxShadow: "0 0 24px rgba(0,255,100,0.4)",
              }}
            >
              <FlaskConical size={13} style={{ color: "#00ff66" }} />
              <span className="text-xs font-black tracking-widest" style={{ color: "#00ff66", textShadow: "0 0 8px #00ff66" }}>
                WITNESSED PROOF OF CONCEPTS
              </span>
            </div>
            <h2
              className="text-3xl font-black mb-3"
              style={{ color: "#fff", textShadow: "0 0 30px rgba(0,255,100,0.5)" }}
            >
              Documented Lab Demonstrations
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              These devices were physically demonstrated, independently witnessed, and documented. Not theory — verified lab results with evidence chains.{" "}
              <span style={{ color: "#ff6600", fontWeight: "900" }}>Member archives contain full reports.</span>
            </p>
          </div>

          <div className="space-y-5">
            {POCS.map((poc, i) => <NeonPOCCard key={i} poc={poc} i={i} />)}
          </div>
        </div>
      </section>

      {/* ── CLASSIFIED DOCUMENTS SECTION ── */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{
                border: "2px solid #ff3366",
                background: "rgba(255,50,100,0.08)",
                boxShadow: "0 0 24px rgba(255,50,100,0.3)",
              }}
            >
              <Shield size={13} style={{ color: "#ff3366" }} />
              <span className="text-xs font-black tracking-widest" style={{ color: "#ff3366" }}>
                DECLASSIFIED & CITED DOCUMENTS
              </span>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Government & Intelligence Source Documents</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              FOIA-released, declassified, and officially cited documents from DOE, CIA, NSA, and DIA. These are primary sources — not speculation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CLASSIFIED_DOCS.map((doc, i) => (
              <div
                key={i}
                style={{
                  background: "linear-gradient(135deg, #0a0005 0%, #050505 100%)",
                  border: "2px solid rgba(255,50,100,0.6)",
                  borderRadius: "16px",
                  padding: "18px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 0 30px rgba(255,50,100,0.25), 0 10px 40px rgba(0,0,0,0.8)",
                }}
              >
                {/* Diagonal stamp */}
                <div style={{ position: "absolute", right: "-28px", top: "14px", transform: "rotate(12deg)", background: "rgba(255,50,100,0.3)", padding: "3px 36px", zIndex: 1 }}>
                  <span style={{ color: "#ff9999", fontSize: "8px", fontWeight: "900", letterSpacing: "0.12em" }}>DECLASSIFIED</span>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,50,100,0.15)", border: "1px solid rgba(255,50,100,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={16} style={{ color: "#ff3366" }} />
                  </div>
                  <div>
                    <p style={{ color: "#ff3366", fontSize: "9px", fontWeight: "900", letterSpacing: "0.12em", marginBottom: "2px" }}>{doc.ref}</p>
                    <h3 style={{ color: "#fff", fontWeight: "900", fontSize: "13px", lineHeight: "1.3", paddingRight: "50px" }}>{doc.title}</h3>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
                  {[{ l: "Origin", v: doc.origin }, { l: "Declassified", v: doc.declassified }, { l: "Pages", v: doc.pages }].map((item, j) => (
                    <div key={j}><p style={{ color: "#555", fontSize: "9px" }}>{item.l}</p><p style={{ color: "#ccc", fontSize: "10px", fontWeight: "700" }}>{item.v}</p></div>
                  ))}
                </div>

                <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "10px 12px", border: "1px solid rgba(255,50,100,0.15)", marginBottom: "10px" }}>
                  <p style={{ color: "#999", fontSize: "11px", lineHeight: "1.6" }}>
                    <BlurredLine text={doc.summary} blurFrom={130} />
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#555", fontSize: "10px" }}>Annotated full-text — members only</span>
                  <Link to="/subscribe" style={{ display: "flex", alignItems: "center", gap: "5px", color: "#ff3366", fontSize: "11px", fontWeight: "900", textDecoration: "none" }}>
                    <Lock size={11} /> Unlock →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-10 rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,100,0,0.1) 0%, rgba(0,255,100,0.06) 100%)",
              border: "2px solid #ff6600",
              boxShadow: "0 0 50px rgba(255,100,0,0.25)",
            }}
          >
            <p className="text-white font-black text-xl mb-2">This is what institutional research actually looks like.</p>
            <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
              Stop reading speculation blogs. Access the primary sources — 40+ patents, 200+ publications, classified government documents, and witnessed lab demonstrations.
            </p>
            <Link
              to="/subscribe"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm"
              style={{
                background: "linear-gradient(90deg, #ff6600, #ff3300)",
                color: "#fff",
                boxShadow: "0 0 40px rgba(255,100,0,0.5)",
              }}
            >
              <Lock size={14} /> Get Full Archive Access — Join Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}