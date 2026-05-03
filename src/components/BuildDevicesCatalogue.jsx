import { Link } from "react-router-dom";
import { Lock, Zap, ChevronRight } from "lucide-react";
import Device3DCard from "./Device3DCard";

const DEVICES = [
  {
    icon: "⚡",
    name: "Motionless Electromagnetic Generator (MEG)",
    desc: "Bearden's patented US6,362,718. No moving parts. Draws from magnetic vector potential. COP >1.0 demonstrated.",
    tag: "PATENT GRANTED",
    neon: "#00ff66",
    stats: [{ val: "23", label: "Part BOM" }, { val: "COP 1.2+", label: "Measured" }, { val: "US Pat.", label: "Verified" }],
    href: "/invention-plans",
  },
  {
    icon: "🌀",
    name: "Kapanadze Free Energy Device",
    desc: "11kW output from 1kW input. Filmed & witnessed by German, Russian, and US engineers. Full video archive.",
    tag: "POC WITNESSED",
    neon: "#ff6600",
    stats: [{ val: "11kW", label: "Output" }, { val: "1100%", label: "COP" }, { val: "72hr", label: "Verified" }],
    href: "/invention-plans",
  },
  {
    icon: "🔭",
    name: "Sweet Vacuum Triode Amplifier (VTA)",
    desc: "500W from 33mW input. Gravity suppression observed during operation. Preconditioned barium ferrite magnets.",
    tag: "GRAVITY FX",
    neon: "#00ccff",
    stats: [{ val: "500W", label: "Output" }, { val: "33mW", label: "Input" }, { val: "-6%", label: "Weight" }],
    href: "/invention-plans",
  },
  {
    icon: "🧲",
    name: "TRZ Scalar Reactor System",
    desc: "Scalar longitudinal wave resonance chamber. Phase-conjugate output amplification via bifilar coil geometry.",
    tag: "BUILD READY",
    neon: "#cc00ff",
    stats: [{ val: "47", label: "Part BOM" }, { val: "3-Phase", label: "Output" }, { val: "Video", label: "Guided" }],
    href: "/invention-plans",
  },
  {
    icon: "📡",
    name: "G-Com Scalar Communicator",
    desc: "Long-range scalar wave communications device. Based on Whittaker decomposition principles. Build kit available.",
    tag: "KIT AVAILABLE",
    neon: "#ffcc00",
    stats: [{ val: "8km+", label: "Range" }, { val: "LW Band", label: "Freq" }, { val: "19", label: "Parts" }],
    href: "/invention-plans",
  },
  {
    icon: "🌡️",
    name: "Prioré Electromagnetic Bio Device",
    desc: "Rotating EM field + plasma discharge. French gov funded 18-year clinical trials. Tumour regression documented.",
    tag: "CLINICAL DATA",
    neon: "#ff3366",
    stats: [{ val: "17/19", label: "Trials" }, { val: "18yr", label: "Research" }, { val: "Classified", label: "Docs" }],
    href: "/invention-plans",
  },
];

export default function BuildDevicesCatalogue() {
  return (
    <section
      className="px-6 py-16 border-b border-white/10"
      style={{ background: "linear-gradient(180deg, #020802 0%, #030303 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{
              border: "2px solid #00ff66",
              background: "rgba(0,255,100,0.08)",
              boxShadow: "0 0 20px rgba(0,255,100,0.3)",
            }}
          >
            <Zap size={13} style={{ color: "#00ff66" }} />
            <span
              className="text-xs font-black tracking-widest"
              style={{ color: "#00ff66", textShadow: "0 0 8px #00ff66" }}
            >
              BUILD DEVICES CATALOGUE
            </span>
          </div>
          <h2
            className="text-3xl font-black mb-3"
            style={{ color: "#fff", textShadow: "0 0 30px rgba(0,255,100,0.4)" }}
          >
            21+ Invention Build Plans — 3D Guided
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Step-by-step assembly, complete BOMs, sourcing guides & video walkthroughs. From bench prototype to working device.{" "}
            <span style={{ color: "#ff6600", fontWeight: "900" }}>Members get instant access to all plans.</span>
          </p>
        </div>

        {/* 3D Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {DEVICES.map((device, i) => (
            <Device3DCard key={i} device={device} index={i} />
          ))}
        </div>

        {/* CTA Bar */}
        <div
          className="rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            background: "linear-gradient(90deg, rgba(0,255,100,0.08) 0%, rgba(255,100,0,0.08) 100%)",
            border: "2px solid",
            borderImage: "linear-gradient(90deg, #00ff66, #ff6600) 1",
            boxShadow: "0 0 40px rgba(0,255,100,0.15), 0 0 40px rgba(255,100,0,0.1)",
          }}
        >
          <div>
            <p className="font-black text-white text-lg">🔩 All 21+ Build Plans Included in Membership</p>
            <p className="text-gray-400 text-sm">Each plan includes BOM, schematics, supplier sourcing & video assembly guide</p>
          </div>
          <Link
            to="/subscribe"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm"
            style={{
              background: "linear-gradient(90deg, #00ff66, #00cc44)",
              color: "#000",
              boxShadow: "0 0 30px rgba(0,255,100,0.5)",
            }}
          >
            Access All Build Plans <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}