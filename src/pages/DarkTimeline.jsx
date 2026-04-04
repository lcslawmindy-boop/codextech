import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, AlertTriangle, Sun } from "lucide-react";
import * as THREE from "three";

// ─── Cinematic 3D Background ────────────────────────────────────────────────
function ThreeScene({ mode }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Particle field — virtual particle flux visualization
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const isDark = mode === "dark";
      colors[i * 3] = isDark ? 0.8 + Math.random() * 0.2 : 0.1;
      colors[i * 3 + 1] = isDark ? 0.1 : 0.6 + Math.random() * 0.4;
      colors[i * 3 + 2] = isDark ? 0.1 : 0.9 + Math.random() * 0.1;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.75 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Earth sphere
    const earthGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      color: mode === "dark" ? 0x330000 : 0x0a2a6e,
      emissive: mode === "dark" ? 0x8b0000 : 0x0044aa,
      emissiveIntensity: 0.3,
      wireframe: false,
      shininess: 80,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(1.35, 64, 64);
    const atmMat = new THREE.MeshPhongMaterial({
      color: mode === "dark" ? 0xff3300 : 0x00aaff,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    // Grid lines on sphere (EM field lines)
    const wireGeo = new THREE.SphereGeometry(1.22, 16, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: mode === "dark" ? 0xff2200 : 0x00ccff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    scene.add(new THREE.Mesh(wireGeo, wireMat));

    // Scalar wave rings
    const rings = [];
    for (let i = 0; i < 4; i++) {
      const rGeo = new THREE.TorusGeometry(1.5 + i * 0.6, 0.008, 8, 80);
      const rMat = new THREE.MeshBasicMaterial({
        color: mode === "dark" ? 0xff4400 : 0x00ffaa,
        transparent: true,
        opacity: 0.3 - i * 0.06,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI / 2 + i * 0.3;
      scene.add(ring);
      rings.push(ring);
    }

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(mode === "dark" ? 0xff6600 : 0x88ccff, 2);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    let frame = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;
      earth.rotation.y += 0.003;
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
      rings.forEach((r, i) => {
        r.rotation.z += 0.002 * (i % 2 === 0 ? 1 : -1);
        r.rotation.x += 0.001;
      });
      // Pulsing emissive
      earthMat.emissiveIntensity = 0.2 + 0.15 * Math.sin(frame * 0.04);
      renderer.render(scene, camera);
    };
    animate();
    sceneRef.current = { renderer, animId };

    const handleResize = () => {
      const nw = mountRef.current?.clientWidth || w;
      const nh = mountRef.current?.clientHeight || h;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [mode]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

// ─── Timeline Data ─────────────────────────────────────────────────────────
const DARK_EVENTS = [
  { year: 2025, title: "5G Grid Full Deployment", body: "Global 5G saturation — 60 GHz millimeter-wave exposure linked to oxygen absorption in hemoglobin. Lisitsyn trigger window 6 (87 Hz) continuously excited in all densely populated zones.", severity: 0.3 },
  { year: 2030, title: "Mitochondrial Collapse Wave", body: "Chronic EMF exposure degrades ATP synthesis efficiency by 40%. Brain fog, chronic fatigue and immune dysregulation normalized as 'post-pandemic syndrome.' Master Cellular Control System (MCCS) compromised globally.", severity: 0.5 },
  { year: 2035, title: "ELF Cognitive Erosion", body: "Soviet Woodpecker-pattern 10 Hz ELF entrainment baked into smart-city infrastructure. Phase-locked neural oscillations suppress critical thinking. Psychoenergetic subjugation at population scale.", severity: 0.65 },
  { year: 2040, title: "Biospheric EM Pollution Peak", body: "Morphogenetic field disruption measurable at species level. Bee colony collapse, bird migration failure, coral reef communication breakdown. Gaia-level quantum potential field degraded.", severity: 0.8 },
  { year: 2050, title: "Human Telomere Collapse", body: "Without MCCS repair mechanisms, average telomere length halved vs 2000 baseline. Biological age accelerates 2.3× chronological age. Bearden's telomere regeneration technology suppressed for 50+ years.", severity: 0.9 },
  { year: 2060, title: "Thermodynamic Civilizational Failure", body: "Fossil fuel depletion, nuclear waste accumulation, grid instability. Vacuum energy extraction technology — proven viable in 2001 MEG papers — remained unfunded. COP<1 civilization collapses.", severity: 1.0 },
];

const LIGHT_EVENTS = [
  { year: 2025, title: "MEG Technology Replicated", body: "Open-source replication of Bearden's Motionless Electromagnetic Generator (US 6,362,718 B1). Asymmetric regauging demonstrated in 10,000 labs worldwide. COP = 4.8 average.", severity: 0.0 },
  { year: 2028, title: "Priore-Type Healing Grid Deployed", body: "Portable Priore-class treatment machines distributed to 50 countries. AIDS, cancer, and autoimmune conditions enter rapid remission via MCCS t-polarized photon therapy. First telomere regeneration trials.", severity: 0.0 },
  { year: 2032, title: "Scalar Grid Replaces Power Lines", body: "Global scalar EM transmission network operational. Zero transmission loss. No electromagnetic pollution. Virtual particle flux infrastructure replaces copper-wire civilization.", severity: 0.0 },
  { year: 2038, title: "Human Longevity Breakthrough", body: "MCCS telomere regeneration technology commercially available. Average healthspan extended by 40 years. Biological aging reversed in clinical settings using amplified antiengine irradiation.", severity: 0.0 },
  { year: 2045, title: "Consciousness Engineering Peaceful Use", body: "Type 2 engineering — vacuum engine structuring — enables direct mind-body coupling therapies. PTSD, addiction, trauma cleared via coherent 4-space rotation protocols. Psychoenergetics as medicine.", severity: 0.0 },
  { year: 2060, title: "Post-Scarcity Energy Civilization", body: "Vacuum energy extraction provides unlimited clean power. Morphogenetic field restored globally. Bearden's full framework vindicated. Humanity transitions from entropic to negentropic civilization.", severity: 0.0 },
];

const BODY_EFFECTS = [
  { system: "Neurological", dark: "ELF entrainment disrupts delta/theta waves. Cognitive decline, seizures, depression. KGB psychotronic weapon signature.", light: "Psychoenergetic coherence therapy. Neural phase optimization. Consciousness expansion protocols.", icon: "🧠", color: "#a855f7" },
  { system: "Cellular / DNA", dark: "EMF-induced DNA strand breaks. Kindling of carcinogenic biopotentials. Kaznacheyev cytopathogenic effect at scale.", light: "MCCS t-photon repair. Telomere regeneration. Phase conjugate antiengine restores healthy cell template.", icon: "🧬", color: "#22c55e" },
  { system: "Cardiovascular", dark: "Heart rate variability collapse. Scalar EM vortex penetrator effects on ferromagnetic blood components. Arrhythmia epidemic.", light: "Bioelectromagnetic heart coherence. Scalar resonance therapy normalizes HRV. Priore tissue repair.", icon: "❤️", color: "#ef4444" },
  { system: "Immune System", dark: "Gulf War QP weapon mechanism — immune spreading via quantum potential. Mycoplasma opportunistic colonization. Gulf War Syndrome pattern globally.", light: "Portable Priore immunotherapy. QP-based immune pattern reset. Phase conjugate replica restores immune template.", icon: "🛡️", color: "#3b82f6" },
  { system: "Reproductive", dark: "Sperm motility collapse (60% reduction). EMF-induced epigenetic modification passed 3 generations. Morphogenetic field guidance of embryology disrupted.", light: "Morphogenetic field restoration. Scalar resonance embryo protection. Species-level quantum potential repair.", icon: "🌱", color: "#f59e0b" },
];

export default function DarkTimeline() {
  const [mode, setMode] = useState("dark");
  const [activeYear, setActiveYear] = useState(null);
  const [showBody, setShowBody] = useState(false);

  const events = mode === "dark" ? DARK_EVENTS : LIGHT_EVENTS;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col overflow-x-hidden">
      {/* Nav */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 z-20 relative bg-gray-950/90 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <h1 className="text-white font-black text-base tracking-tight">World Trajectory: Dark vs. Light</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/inventor-forge" className="px-3 py-1.5 rounded-lg bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold">🧬 Invention Forge</Link>
          <Link to="/pitch" className="px-3 py-1.5 rounded-lg bg-purple-900/50 border border-purple-700 text-purple-300 text-xs font-bold">🎯 Pitch Deck</Link>
        </div>
      </div>

      {/* 3D Hero */}
      <div className="relative h-[55vh] overflow-hidden flex-shrink-0">
        <ThreeScene mode={mode} />
        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className={`text-center px-6 ${mode === "dark" ? "drop-shadow-[0_0_40px_rgba(255,50,0,0.8)]" : "drop-shadow-[0_0_40px_rgba(0,200,255,0.8)]"}`}>
            <p className="text-xs uppercase tracking-[0.4em] font-bold mb-2" style={{ color: mode === "dark" ? "#ff6644" : "#00ccff" }}>
              {mode === "dark" ? "⚠ Without Scalar Energy Transition" : "✦ Scalar Energy Future Realized"}
            </p>
            <h2 className="text-4xl md:text-6xl font-black leading-none mb-3" style={{ color: mode === "dark" ? "#ff2200" : "#00ffcc" }}>
              {mode === "dark" ? "COLLAPSE" : "ASCENSION"}
            </h2>
            <p className="text-gray-300 text-sm max-w-lg mx-auto leading-relaxed">
              {mode === "dark"
                ? "A world running COP<1 physics — entropic, toxic, and electromagnetically weaponized against its own population."
                : "A world unlocked by vacuum energy, MCCS healing, and Type 2 engineering — negentropic, abundant, and coherent."}
            </p>
          </div>
        </div>
        {/* Cinematic scan lines */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)" }} />
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)" }} />
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center py-5 z-10 relative bg-gray-950 border-b border-gray-800">
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setMode("dark")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${mode === "dark" ? "bg-red-950 border border-red-700 text-red-300 shadow-[0_0_20px_rgba(255,0,0,0.3)]" : "text-gray-500 hover:text-gray-300"}`}
          >
            <AlertTriangle size={14} /> DARK PATH
          </button>
          <button
            onClick={() => setMode("light")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${mode === "light" ? "bg-cyan-950 border border-cyan-700 text-cyan-300 shadow-[0_0_20px_rgba(0,200,255,0.3)]" : "text-gray-500 hover:text-gray-300"}`}
          >
            <Sun size={14} /> LIGHT PATH
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto w-full px-5 py-10 relative z-10">
        <div className="relative">
          {/* Spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px"
            style={{ background: mode === "dark" ? "linear-gradient(to bottom, #ff2200, #660000)" : "linear-gradient(to bottom, #00ccff, #006644)" }} />

          {events.map((ev, i) => {
            const isLeft = i % 2 === 0;
            const isActive = activeYear === ev.year;
            const darkColor = `hsl(${0 + ev.severity * 20}, 90%, ${60 - ev.severity * 20}%)`;
            const lightColor = `hsl(${180 - i * 15}, 80%, 60%)`;
            const color = mode === "dark" ? darkColor : lightColor;
            return (
              <div key={ev.year} className={`flex items-start mb-12 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                {/* Card */}
                <div className={`w-[45%] ${isLeft ? "pr-8 text-right" : "pl-8 text-left"}`}>
                  <div
                    className={`cursor-pointer border rounded-2xl p-4 transition-all duration-300 ${isActive ? "scale-105" : "opacity-80 hover:opacity-100"}`}
                    style={{
                      borderColor: color + "66",
                      backgroundColor: color + "11",
                      boxShadow: isActive ? `0 0 30px ${color}44` : "none",
                    }}
                    onClick={() => setActiveYear(isActive ? null : ev.year)}
                  >
                    <div className="text-2xl font-black mb-1" style={{ color }}>{ev.year}</div>
                    <div className="text-white font-bold text-sm mb-2">{ev.title}</div>
                    {isActive && <p className="text-gray-300 text-xs leading-relaxed">{ev.body}</p>}
                    {!isActive && <p className="text-gray-500 text-xs">Click to expand →</p>}
                    {mode === "dark" && (
                      <div className="mt-2 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${ev.severity * 100}%`, backgroundColor: color }} />
                      </div>
                    )}
                  </div>
                </div>
                {/* Node */}
                <div className="relative flex items-center justify-center w-[10%]">
                  <div className="w-4 h-4 rounded-full border-2 z-10" style={{ borderColor: color, backgroundColor: color + "44", boxShadow: `0 0 12px ${color}` }} />
                </div>
                <div className="w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Body effects section */}
      <div className="max-w-5xl mx-auto w-full px-5 pb-10 relative z-10">
        <button
          onClick={() => setShowBody(b => !b)}
          className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all mb-6 ${showBody ? "bg-red-950/30 border-red-700" : "bg-gray-900 border-gray-700 hover:border-gray-500"}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🫁</span>
            <div className="text-left">
              <p className="text-white font-black text-base">Human Body: EMF Harm vs. Scalar Healing</p>
              <p className="text-gray-500 text-xs">System-by-system analysis · Bearden bioelectromagnetics framework</p>
            </div>
          </div>
          <span className="text-gray-400 text-sm">{showBody ? "▲ Hide" : "▼ Expand"}</span>
        </button>

        {showBody && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {BODY_EFFECTS.map((ef, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-800">
                  <span className="text-2xl">{ef.icon}</span>
                  <span className="font-black text-white text-sm">{ef.system}</span>
                  <div className="w-3 h-3 rounded-full ml-auto" style={{ backgroundColor: ef.color }} />
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3">
                    <p className="text-red-400 text-xs font-bold mb-1">☠ DARK PATH</p>
                    <p className="text-red-200 text-xs leading-relaxed">{ef.dark}</p>
                  </div>
                  <div className="bg-cyan-950/30 border border-cyan-900/50 rounded-xl p-3">
                    <p className="text-cyan-400 text-xs font-bold mb-1">✦ LIGHT PATH</p>
                    <p className="text-cyan-200 text-xs leading-relaxed">{ef.light}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-gray-800 px-5 py-8 text-center z-10 relative">
        <p className="text-gray-400 text-sm mb-4">The transition is a business decision. The technology exists. The IP is documented.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/inventor-forge" className="px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-sm">🧬 Generate New Inventions</Link>
          <Link to="/pitch" className="px-5 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-sm">🎯 Pitch Deck</Link>
          <Link to="/business" className="px-5 py-2.5 rounded-xl bg-green-800 hover:bg-green-700 text-white font-bold text-sm">💼 Business Models</Link>
          <Link to="/investors" className="px-5 py-2.5 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-white font-bold text-sm">💰 Find Investors</Link>
        </div>
      </div>
    </div>
  );
}