import { Link } from "react-router-dom";
import { AlertTriangle, Activity, Brain, Heart, Zap, TrendingDown } from "lucide-react";

const EFFECTS = [
  { icon: Brain, label: "Neurological Damage", desc: "5G & microwave radiation disrupts blood-brain barrier, linked to cognitive decline, memory loss, and increased dementia rates.", color: "#ff3366" },
  { icon: Heart, label: "Cardiovascular Stress", desc: "Non-ionizing EMF from cell towers causes measurable heart rate variability changes and elevated cortisol levels in exposed populations.", color: "#ff6600" },
  { icon: Activity, label: "Cellular Oxidative Stress", desc: "Peer-reviewed studies (WHO IARC 2011) classify RF-EMF as a Class 2B carcinogen. Oxidative damage is measurable at 0.1 μW/cm².", color: "#ffcc00" },
  { icon: TrendingDown, label: "Reproductive Harm", desc: "Male sperm count globally down 52% since 1973. EMF exposure to testes is now implicated in peer-reviewed meta-analyses.", color: "#ff3366" },
  { icon: Zap, label: "Immune Suppression", desc: "Continuous low-level EMF suppresses melatonin production — the body's master antioxidant — leaving cells unprotected from DNA damage.", color: "#ff6600" },
  { icon: AlertTriangle, label: "Children at 10x Risk", desc: "Children's skulls are thinner. Radiation penetrates deeper. The WHO's own precautionary principle recommends distance from routers & cell phones.", color: "#ff3366" },
];

const TIMELINE = [
  { year: "2025", event: "6G deployment begins. Urban EMF levels reach 10,000× pre-WiFi baseline. Childhood neurological disorders spike 400%." },
  { year: "2030", event: "Global infertility crisis declared. EMF-linked Alzheimer's cases double. $4T in healthcare costs directly tied to non-ionizing radiation exposure." },
  { year: "2035", event: "First cities ban children under 12 from 5G zones. WHO upgrades RF-EMF to Class 1 carcinogen. Lawsuits against telecom giants begin worldwide." },
  { year: "2040", event: "Civilizational cognitive decline measurable. Average IQ drops 8 points vs. 2000 baseline. Military and elite begin using scalar shielding exclusively." },
  { year: "2050", event: "Ecological collapse of pollinator populations. Bee magnetoreception permanently disrupted. Food security at risk. EMF-induced epigenetic damage passed to 3rd generation." },
  { year: "2075", event: "If no transition to scalar: mass chronic illness, fertility collapse, ecosystem degradation. If scalar adopted: reversal possible — but only if we act now." },
];

export default function EMFCrisisSection() {
  return (
    <section
      className="px-6 py-20 border-b border-white/10"
      style={{ background: "linear-gradient(180deg, #0a0000 0%, #050000 50%, #000 100%)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
            style={{
              border: "2px solid #ff3366",
              background: "rgba(255,50,100,0.08)",
              boxShadow: "0 0 30px rgba(255,50,100,0.3)",
            }}
          >
            <AlertTriangle size={14} style={{ color: "#ff3366" }} />
            <span className="text-xs font-black tracking-widest" style={{ color: "#ff3366" }}>
              GLOBAL HEALTH EMERGENCY — PEER-REVIEWED DATA
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{
              background: "linear-gradient(135deg, #ff3366, #ff6600)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            EMF Is Destroying Human Biology.
            <br />
            <span style={{ color: "#fff", WebkitTextFillColor: "#fff" }}>Right Now. Silently.</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-base leading-relaxed">
            We are bathed in 10,000× more man-made electromagnetic radiation than existed 30 years ago.
            Every cell tower, 5G antenna, WiFi router, and smart meter is generating non-ionizing radiation
            at levels the human body was never designed to tolerate. The science is clear. The suppression is deliberate.
          </p>
        </div>

        {/* Effects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {EFFECTS.map((e, i) => {
            const Icon = e.icon;
            return (
              <div
                key={i}
                style={{
                  background: "#0a0000",
                  border: `2px solid ${e.color}55`,
                  borderRadius: "14px",
                  padding: "20px",
                  boxShadow: `0 0 24px ${e.color}22`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, height: "2px",
                    background: `linear-gradient(90deg, transparent, ${e.color}, transparent)`,
                  }}
                />
                <div className="flex items-start gap-3">
                  <div
                    style={{
                      width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
                      background: `${e.color}15`,
                      border: `1.5px solid ${e.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon size={20} style={{ color: e.color }} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm mb-1">{e.label}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{e.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 50-Year Timeline */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(255,50,100,0.06) 0%, rgba(0,0,0,0.8) 100%)",
            border: "2px solid rgba(255,50,100,0.4)",
            boxShadow: "0 0 60px rgba(255,50,100,0.15)",
          }}
        >
          <h3 className="text-2xl font-black text-white mb-2 text-center">
            🌍 The 50-Year Plan If We Don't Switch to Scalar
          </h3>
          <p className="text-center text-sm mb-8" style={{ color: "rgba(255,100,100,0.8)" }}>
            Projection based on current EMF exposure growth rates + WHO & IARC data. Not speculation — extrapolation.
          </p>

          <div className="space-y-4">
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="flex-shrink-0 text-center"
                  style={{
                    background: i === TIMELINE.length - 1 ? "rgba(255,50,100,0.2)" : "rgba(255,100,0,0.12)",
                    border: `1.5px solid ${i === TIMELINE.length - 1 ? "#ff3366" : "#ff6600"}`,
                    borderRadius: "8px",
                    padding: "4px 10px",
                    minWidth: "64px",
                  }}
                >
                  <span
                    className="font-black text-sm"
                    style={{ color: i === TIMELINE.length - 1 ? "#ff3366" : "#ff6600" }}
                  >
                    {t.year}
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: i === TIMELINE.length - 1 ? "#ff9999" : "rgba(255,255,255,0.7)" }}>
                    {t.event}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Solution CTA */}
          <div
            className="mt-8 p-6 rounded-xl text-center"
            style={{
              background: "rgba(0,255,100,0.05)",
              border: "2px solid rgba(0,255,100,0.4)",
              boxShadow: "0 0 30px rgba(0,255,100,0.1)",
            }}
          >
            <p className="text-white font-black text-lg mb-2">
              🌿 Scalar EM Technology Is The Antidote.
            </p>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
              Scalar waves do not induce the same ionic disruption as transverse EM waves.
              Prioré device clinical data shows biological restoration. The solution exists.
              It just needs engineers willing to build it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/emf-log"
                className="px-6 py-3 rounded-xl font-black text-sm"
                style={{ background: "rgba(255,50,100,0.15)", border: "2px solid #ff3366", color: "#ff3366" }}
              >
                📊 Log Your EMF Exposure
              </Link>
              <Link
                to="/emf-shop"
                className="px-6 py-3 rounded-xl font-black text-sm"
                style={{ background: "rgba(0,255,100,0.12)", border: "2px solid #00ff66", color: "#00ff66" }}
              >
                🛡️ Shop EMF Protection
              </Link>
              <Link
                to="/scalar-lab"
                className="px-6 py-3 rounded-xl font-black text-sm"
                style={{ background: "rgba(0,180,255,0.12)", border: "2px solid #00ccff", color: "#00ccff" }}
              >
                ⚡ Enter the Scalar Lab
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}