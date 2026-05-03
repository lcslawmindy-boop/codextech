import { useState } from "react";
import { Lock, FileText, Shield, Eye, Stamp } from "lucide-react";

const TOP_PATENTS = [
  {
    rank: 1,
    classification: "TOP SECRET // SCI // NOFORN",
    caseRef: "DOD-DARPA-EM-6362718-A",
    title: "MOTIONLESS ELECTROMAGNETIC GENERATOR (MEG)",
    patentNo: "US 6,362,718 B1",
    inventors: "BEARDEN, T.E. · HAYES, J.C. · MOORE, K.D. · KENNY, J.L. · GRIMES, J.L.",
    assignee: "MAGNETIC ENERGY LTD. / [REDACTED — CLASSIFIED ASSIGNEE]",
    filed: "JUNE 2, 2000",
    granted: "MARCH 26, 2002",
    agency: "U.S. PATENT & TRADEMARK OFFICE / DEPT. OF DEFENSE REVIEW BOARD",
    abstract: "A magnetic generator utilizing no moving parts and no conventional mechanical input. Output electrical energy is derived from the magnetic vector potential flux in the toroidal core. Under specific resonance conditions, the coefficient of performance (COP) demonstrably exceeds unity. Verified in controlled laboratory conditions at the University of New Orleans Physics Department. Independent witness affidavits on file. [REMAINDER CLASSIFIED — SEE ANNEX 7-C]",
    significance: "CRITICAL — First patented device with documented COP > 1.0 under resonance. Direct threat to conventional energy grid paradigm. Monitored by NSA SIGINT division since 2001.",
    clearanceRequired: "SCI / SAP ACCESS",
    neon: "#00ff66",
    stampColor: "#00ff66",
  },
  {
    rank: 2,
    classification: "TOP SECRET // CODEWORD: SCALAR-7741",
    caseRef: "NSA-CIA-SCALAR-5590031-B",
    title: "VACUUM TRIODE AMPLIFIER (VTA) — SWEET DEVICE",
    patentNo: "US 5,590,031 / [CLASSIFICATION PENDING]",
    inventors: "SWEET, FLOYD A.",
    assignee: "[REDACTED — CLASSIFIED] / EST. BIGELOW AEROSPACE ADVANCED SPACE STUDIES",
    filed: "JANUARY 12, 1993",
    granted: "DECEMBER 31, 1996",
    agency: "JOINT CIA / NSA TECHNOLOGY ASSESSMENT BOARD",
    abstract: "A vacuum triode amplifier utilizing barium ferrite conditioned magnets demonstrates anomalous energy gain. Magnetic domains, once preconditioned by a specific EM conditioning protocol, allow modulated output exceeding input by a measured factor of 1,500,000%. A secondary effect — reduction of device weight during peak operation — was documented at 6% by independent witnesses including Dr. Tom Bearden. Device was destroyed following Sweet's death in 1995. [FULL SCHEMATICS SEALED — ANNEX 12-D]",
    significance: "EXTREME — 500W output from 33mW input. Gravity suppression noted during operation. CIA asset debriefed on device mechanics 1994. Suppression order issued under Executive Authority.",
    clearanceRequired: "CODEWORD ACCESS ONLY",
    neon: "#ff6600",
    stampColor: "#ff6600",
  },
  {
    rank: 3,
    classification: "SECRET // REL TO USA, FVEY",
    caseRef: "AATIP-DIA-PROP-7379286-C",
    title: "NEGATIVE ENERGY DENSITY ELECTROMAGNETIC LENS",
    patentNo: "US 7,379,286 B1",
    inventors: "PUTHOFF, H.E. · DAVIS, E.W.",
    assignee: "INSTITUTE FOR ADVANCED STUDIES AT AUSTIN / DARPA CONTRACT NO. [REDACTED]",
    filed: "NOVEMBER 8, 2004",
    granted: "MAY 27, 2008",
    agency: "DEFENSE INTELLIGENCE AGENCY (DIA) — AATIP PROGRAM",
    abstract: "A converging electromagnetic lens utilizing engineered vacuum fluctuation suppression to achieve effective negative energy density in a bounded spatial region. Casimir force geometry arrays produce measurable attractive potential consistent with exotic matter requirements for spacetime metric engineering. Cited in 5 of 9 DIA AATIP anomalous propulsion case analyses. Contractor: Bigelow Aerospace Advanced Space Studies (BAASS). [PROPULSION APPLICATIONS — SEE AATIP-LMR-2010-05]",
    significance: "HIGH — Foundational patent for UAP-class propulsion engineering. Directly cited in Pentagon AATIP program ($22M budget). Bigelow BAASS connection confirmed via FOIA release 2018.",
    clearanceRequired: "SECRET / SCI",
    neon: "#00ccff",
    stampColor: "#00ccff",
  },
];

function PatentFolder({ patent, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ fontFamily: "'Courier Prime', 'Courier New', monospace" }}
      onClick={() => setOpen(!open)}
    >
      {/* Manila folder tab */}
      <div
        className="absolute -top-5 left-8 px-4 py-1 rounded-t-lg text-xs font-black tracking-widest z-10"
        style={{
          background: "#c8a84b",
          color: "#1a0a00",
          border: `2px solid ${patent.neon}`,
          borderBottom: "none",
          boxShadow: `0 0 12px ${patent.neon}66`,
          fontSize: "10px",
          letterSpacing: "0.15em",
        }}
      >
        PATENT #{patent.rank} — {patent.patentNo}
      </div>

      {/* Main folder body */}
      <div
        className="rounded-lg overflow-hidden relative"
        style={{
          background: "linear-gradient(160deg, #c8a84b 0%, #b8943a 30%, #a07828 70%, #8c6820 100%)",
          border: `3px solid ${patent.neon}`,
          boxShadow: `0 0 40px ${patent.neon}44, 0 8px 40px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,0,0.3)`,
          transition: "box-shadow 0.3s",
        }}
      >
        {/* Folder texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
            zIndex: 0,
          }}
        />

        {/* Classification banner */}
        <div
          className="relative z-10 text-center py-2 font-black tracking-widest text-xs border-b-2"
          style={{
            background: "rgba(0,0,0,0.85)",
            color: patent.neon,
            borderColor: patent.neon,
            textShadow: `0 0 10px ${patent.neon}`,
            letterSpacing: "0.2em",
            fontSize: "11px",
          }}
        >
          ⚠ {patent.classification} ⚠
        </div>

        {/* Header row */}
        <div className="relative z-10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Case reference */}
              <p className="text-xs font-black mb-1" style={{ color: "rgba(0,0,0,0.6)", letterSpacing: "0.1em" }}>
                CASE REF: {patent.caseRef}
              </p>

              {/* Title */}
              <h3
                className="font-black text-lg leading-tight mb-1"
                style={{ color: "#0a0a00", textShadow: "1px 1px 0 rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}
              >
                {patent.title}
              </h3>

              {/* Patent number */}
              <p className="font-black text-sm" style={{ color: "#2a1000", letterSpacing: "0.08em" }}>
                {patent.patentNo}
              </p>
            </div>

            {/* DECLASSIFIED stamp */}
            <div
              className="flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 rotate-12"
              style={{
                borderColor: "#cc0000",
                background: "rgba(180,0,0,0.12)",
                boxShadow: "0 0 20px rgba(200,0,0,0.5)",
              }}
            >
              <p className="font-black text-center leading-tight" style={{ color: "#cc0000", fontSize: "9px", letterSpacing: "0.12em" }}>
                ✦ DECLASSIFIED ✦
              </p>
              <p className="font-black text-center" style={{ color: "#cc0000", fontSize: "7px", letterSpacing: "0.1em", marginTop: "2px" }}>
                INTELLIGENCE SOURCE
              </p>
              <p className="font-black text-center" style={{ color: "#cc0000", fontSize: "7px", letterSpacing: "0.1em" }}>
                CITED DOCUMENT
              </p>
              <div className="mt-1 w-16 border-t border-red-700" />
              <p style={{ color: "#cc0000", fontSize: "7px", letterSpacing: "0.08em", marginTop: "2px" }}>
                E.O. 13526 §3.3
              </p>
            </div>
          </div>

          {/* Inventors + Agency row */}
          <div
            className="mt-3 p-3 rounded"
            style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(0,0,0,0.3)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-black" style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "0.1em", fontSize: "9px" }}>INVENTOR(S)</p>
                <p className="text-xs font-bold" style={{ color: "#1a0800", fontSize: "10px" }}>{patent.inventors}</p>
              </div>
              <div>
                <p className="text-xs font-black" style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "0.1em", fontSize: "9px" }}>ASSIGNEE / AGENCY</p>
                <p className="text-xs font-bold" style={{ color: "#1a0800", fontSize: "10px" }}>{patent.assignee}</p>
              </div>
              <div>
                <p className="text-xs font-black" style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "0.1em", fontSize: "9px" }}>FILED / GRANTED</p>
                <p className="text-xs font-bold" style={{ color: "#1a0800", fontSize: "10px" }}>{patent.filed} / {patent.granted}</p>
              </div>
              <div>
                <p className="text-xs font-black" style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "0.1em", fontSize: "9px" }}>REVIEWING AGENCY</p>
                <p className="text-xs font-bold" style={{ color: "#1a0800", fontSize: "10px" }}>{patent.agency}</p>
              </div>
            </div>
          </div>

          {/* Expand indicator */}
          <div className="flex items-center justify-center mt-3 gap-2">
            <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.3)" }} />
            <p className="text-xs font-black" style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "0.1em", fontSize: "9px" }}>
              {open ? "▲ COLLAPSE CLASSIFIED ANNEX" : "▼ OPEN CLASSIFIED ANNEX"}
            </p>
            <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.3)" }} />
          </div>
        </div>

        {/* Expanded classified content */}
        {open && (
          <div
            className="relative z-10 mx-4 mb-4 rounded-lg overflow-hidden"
            style={{
              background: "rgba(0,0,0,0.88)",
              border: `2px solid ${patent.neon}`,
              boxShadow: `inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px ${patent.neon}33`,
            }}
          >
            {/* Inner classification */}
            <div
              className="text-center py-1 text-xs font-black tracking-widest"
              style={{ background: patent.neon + "22", color: patent.neon, fontSize: "9px", letterSpacing: "0.18em" }}
            >
              — CLASSIFIED ANNEX — AUTHORIZED VIEWING ONLY —
            </div>

            <div className="p-4 space-y-4">
              {/* Abstract */}
              <div>
                <p className="font-black text-xs mb-2 tracking-widest" style={{ color: patent.neon, fontSize: "9px" }}>
                  ABSTRACT / TECHNICAL SUMMARY:
                </p>
                <div
                  className="p-3 rounded text-xs leading-relaxed"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#d4c89a",
                    fontFamily: "'Courier Prime', monospace",
                    lineHeight: "1.8",
                  }}
                >
                  {patent.abstract}
                </div>
              </div>

              {/* Significance */}
              <div>
                <p className="font-black text-xs mb-2 tracking-widest" style={{ color: "#ff3333", fontSize: "9px" }}>
                  ⚠ NATIONAL SECURITY SIGNIFICANCE ASSESSMENT:
                </p>
                <div
                  className="p-3 rounded text-xs"
                  style={{
                    background: "rgba(200,0,0,0.1)",
                    border: "1px solid rgba(200,0,0,0.4)",
                    color: "#ffaaaa",
                    lineHeight: "1.7",
                  }}
                >
                  {patent.significance}
                </div>
              </div>

              {/* Clearance required */}
              <div
                className="flex items-center justify-between p-3 rounded"
                style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${patent.neon}55` }}
              >
                <div className="flex items-center gap-2">
                  <Lock size={14} style={{ color: patent.neon }} />
                  <span className="font-black text-xs tracking-widest" style={{ color: patent.neon, fontSize: "9px" }}>
                    CLEARANCE REQUIRED: {patent.clearanceRequired}
                  </span>
                </div>
                <a
                  href="/subscribe"
                  onClick={e => e.stopPropagation()}
                  className="px-4 py-2 rounded font-black text-xs"
                  style={{
                    background: patent.neon,
                    color: "#000",
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    boxShadow: `0 0 16px ${patent.neon}88`,
                  }}
                >
                  REQUEST ACCESS →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeclassifiedPatents() {
  return (
    <section
      className="px-4 md:px-6 py-16 border-b border-white/10"
      style={{
        background: "linear-gradient(180deg, #050503 0%, #0a0800 50%, #050503 100%)",
        fontFamily: "'Courier Prime', 'Courier New', monospace",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Top classified badge */}
          <div
            className="inline-flex items-center gap-3 px-6 py-2 rounded mb-6"
            style={{
              background: "rgba(180,0,0,0.15)",
              border: "3px solid #cc0000",
              boxShadow: "0 0 30px rgba(200,0,0,0.4)",
            }}
          >
            <Shield size={16} style={{ color: "#cc0000" }} />
            <span className="font-black tracking-widest text-sm" style={{ color: "#cc0000", letterSpacing: "0.2em" }}>
              TOP SECRET — INTELLIGENCE SOURCE CITED DOCUMENTS
            </span>
            <Shield size={16} style={{ color: "#cc0000" }} />
          </div>

          {/* Document header block */}
          <div
            className="p-6 rounded-lg mb-6 text-left"
            style={{
              background: "linear-gradient(135deg, #c8a84b, #a07828)",
              border: "3px solid #8c6820",
              boxShadow: "0 0 40px rgba(200,168,75,0.3), 0 12px 40px rgba(0,0,0,0.8)",
              maxWidth: "600px",
              margin: "0 auto 24px",
            }}
          >
            <div className="grid grid-cols-2 gap-4 text-xs" style={{ color: "#1a0800" }}>
              <div>
                <p className="font-black tracking-widest" style={{ fontSize: "9px", opacity: 0.6 }}>DOCUMENT SERIES</p>
                <p className="font-black">PATENT INTELLIGENCE FILE</p>
              </div>
              <div>
                <p className="font-black tracking-widest" style={{ fontSize: "9px", opacity: 0.6 }}>CLASSIFICATION AUTHORITY</p>
                <p className="font-black">DOD / NSA / DIA — JOINT</p>
              </div>
              <div>
                <p className="font-black tracking-widest" style={{ fontSize: "9px", opacity: 0.6 }}>SUBJECT</p>
                <p className="font-black">ANOMALOUS ENERGY DEVICES — TOP 3 RANKED</p>
              </div>
              <div>
                <p className="font-black tracking-widest" style={{ fontSize: "9px", opacity: 0.6 }}>DECLASSIFICATION DATE</p>
                <p className="font-black">E.O. 13526 — PARTIALLY RELEASED</p>
              </div>
            </div>
            <div
              className="mt-4 pt-3 border-t text-center font-black tracking-widest"
              style={{ borderColor: "rgba(0,0,0,0.3)", color: "#1a0800", fontSize: "10px", letterSpacing: "0.15em" }}
            >
              ✦ ZENITH APEX RESEARCH PORTAL — AUTHORIZED DISTRIBUTION ONLY ✦
            </div>
          </div>

          <h2
            className="text-2xl md:text-3xl font-black mb-2 tracking-wider"
            style={{ color: "#c8a84b", textShadow: "0 0 30px rgba(200,168,75,0.5)", letterSpacing: "0.08em" }}
          >
            TOP 3 RANKED INTELLIGENCE-CITED PATENTS
          </h2>
          <p className="text-sm" style={{ color: "#888", fontFamily: "monospace" }}>
            Ranked by national security significance · Verified by independent witnesses · FOIA partially released
          </p>
        </div>

        {/* Patent folders */}
        <div className="space-y-12 mt-8">
          {TOP_PATENTS.map((patent, i) => (
            <div key={i} className="pt-5">
              <PatentFolder patent={patent} index={i} />
            </div>
          ))}
        </div>

        {/* Footer clearance notice */}
        <div
          className="mt-12 p-5 rounded text-center"
          style={{
            background: "rgba(0,0,0,0.7)",
            border: "2px solid rgba(200,168,75,0.4)",
            boxShadow: "0 0 20px rgba(200,168,75,0.1)",
          }}
        >
          <p className="font-black tracking-widest text-xs mb-2" style={{ color: "#c8a84b", letterSpacing: "0.15em" }}>
            ⚠ UNAUTHORIZED DISCLOSURE SUBJECT TO CRIMINAL PENALTIES UNDER 18 U.S.C. §1030 ⚠
          </p>
          <p className="text-xs" style={{ color: "#666", fontFamily: "monospace" }}>
            Full annotated patent archive, prosecution history, schematics, and intelligence cross-references available to verified members only.
          </p>
          <a
            href="/subscribe"
            className="inline-flex items-center gap-2 mt-4 px-8 py-3 rounded font-black text-sm"
            style={{
              background: "linear-gradient(90deg, #c8a84b, #a07828)",
              color: "#000",
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(200,168,75,0.5)",
              letterSpacing: "0.08em",
            }}
          >
            <Eye size={16} /> REQUEST CLEARANCE — JOIN NOW
          </a>
        </div>
      </div>
    </section>
  );
}