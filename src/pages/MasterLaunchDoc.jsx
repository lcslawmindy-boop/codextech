import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Map, Navigation, List, Trash2, Palette, Cpu, Wrench, Rocket, Fingerprint, Settings } from "lucide-react";

const SECTIONS = [
  {
    id: 1,
    icon: <FileText size={18} />,
    title: "Executive Summary",
    color: "#00ccff",
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          <strong className="text-white">C.O.D.E.X.T.E.C.H.</strong> is a structured research and engineering intelligence platform designed to deliver:
        </p>
        <ul className="space-y-2">
          {["High‑signal research","Build‑ready systems","Patent intelligence","Engineering frameworks","À la carte plans","Membership‑based access"].map((i,k) => (
            <li key={k} className="flex items-center gap-3 text-gray-300 text-sm">
              <span style={{color:"#00ccff",fontWeight:900}}>›</span> {i}
            </li>
          ))}
        </ul>
        <div className="mt-4 p-4 rounded-xl" style={{background:"rgba(0,204,255,0.07)",border:"1px solid rgba(0,204,255,0.3)"}}>
          <p className="text-sm font-black text-white">This Master Launch Document consolidates all system architecture, all funnel logic, all visual direction, and all build requirements into one unified blueprint.</p>
          <p className="text-xs mt-2" style={{color:"#00ccff"}}>⚡ This is the official launch specification.</p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    icon: <Map size={18} />,
    title: "Funnel Map",
    color: "#00ff66",
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="font-black text-white mb-3 text-sm tracking-widest uppercase">Final Funnel Flow</h4>
          <div className="flex flex-col gap-2">
            {[
              ["Homepage","Entry point"],
              ["Lead Magnet","Research Brief"],
              ["Tripwire","Technical Brief Pack"],
              ["Core Offer","$49/mo Membership"],
              ["Mid‑Tier","$197 Operator Offer"],
              ["High‑Ticket","$997 Engineering Systems Bundle"],
              ["Member Dashboard","Retention"],
            ].map(([stage, label], i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1" style={{background:"rgba(0,255,100,0.07)",border:"1px solid rgba(0,255,100,0.25)"}}>
                  <span className="text-xs font-black" style={{color:"#00ff66",minWidth:"20px"}}>{i+1}</span>
                  <span className="text-white text-sm font-bold">{stage}</span>
                  <span className="text-gray-500 text-xs ml-auto">{label}</span>
                </div>
                {i < 6 && <ChevronDown size={12} style={{color:"#00ff66",flexShrink:0}} />}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-black text-white mb-3 text-sm tracking-widest uppercase">Funnel Logic</h4>
          <ul className="space-y-1">
            {["No dead ends","No duplicate pricing pages","No admin pages in public nav","Upsells after lead magnet, tripwire, and locked modules","Downsell logic for abandoned checkout"].map((r,i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span style={{color:"#00ff66",fontWeight:900}}>✓</span> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 3,
    icon: <Map size={18} />,
    title: "CTA Map",
    color: "#ff6600",
    content: (
      <div className="space-y-5">
        {[
          { section: "Homepage", ctas: [["Access Research","→ /codextech-database"],["View Pricing","→ /codextech-pricing"]] },
          { section: "Lead Magnet", ctas: [["Download Brief","→ /research-brief-download"],["Continue to Tripwire","→ /technical-brief-pack"]] },
          { section: "Tripwire", ctas: [["Unlock Full System","→ /codextech-pricing"]] },
          { section: "Pricing", ctas: [["Start Membership","→ Stripe Checkout"],["View Bundle","→ /engineering-systems-bundle"]] },
          { section: "Research Database", ctas: [["Open Module","→ /research/[id]"],["Unlock Access","→ /codextech-pricing"]] },
          { section: "Dashboard", ctas: [["Continue Research","→ /codextech-database"],["Build Ready Systems","→ /codextech-database?tag=build-ready"]] },
        ].map((group, i) => (
          <div key={i}>
            <p className="text-xs font-black tracking-widest uppercase mb-2" style={{color:"#ff6600"}}>{group.section}</p>
            <div className="space-y-1 ml-3">
              {group.ctas.map(([label, dest], j) => (
                <div key={j} className="flex items-center gap-3 text-sm">
                  <span className="text-white font-bold">{label}</span>
                  <span className="text-gray-500">{dest}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 4,
    icon: <Navigation size={18} />,
    title: "Navigation Map",
    color: "#cc00ff",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Public Nav", color: "#cc00ff", items: ["Home","Research","Pricing","Login"] },
          { title: "Member Nav", color: "#00ccff", items: ["Dashboard","Research","Build Plans","Patent Intelligence","Account"] },
          { title: "Hidden Routes", color: "#ff3366", items: ["Lead Magnet","Tripwire","Bundle","À la carte","Module Detail Pages","Admin pages","TikTok analytics"] },
        ].map((nav, i) => (
          <div key={i} className="p-4 rounded-xl" style={{background:"rgba(0,0,0,0.5)",border:`1px solid ${nav.color}44`}}>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:nav.color}}>{nav.title}</p>
            <ul className="space-y-1">
              {nav.items.map((item, j) => (
                <li key={j} className="text-sm text-gray-300 flex items-center gap-2">
                  <span style={{color:nav.color,fontSize:"10px"}}>●</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 5,
    icon: <List size={18} />,
    title: "Page Inventory",
    color: "#ffcc00",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Keep", color: "#00ff66", items: ["Homepage","Pricing","Research Database","Module Detail Pages","Dashboard","Build Plans","Patent Intelligence","À la carte shop","Bundle page","Lead magnet","Tripwire"] },
          { title: "Rebuild", color: "#ffcc00", items: ["Module Detail Pages","Dashboard","Patent & Source Docs","Tripwire","Lead Confirmation"] },
          { title: "Remove", color: "#ff3366", items: ["Old ConceptGraph","Old research versions","Duplicate pricing","NDA pages","Admin pages in nav","Experimental pages"] },
        ].map((col, i) => (
          <div key={i} className="p-4 rounded-xl" style={{background:"rgba(0,0,0,0.5)",border:`1px solid ${col.color}44`}}>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:col.color}}>● {col.title}</p>
            <ul className="space-y-1">
              {col.items.map((item, j) => (
                <li key={j} className="text-xs text-gray-300 flex items-center gap-2">
                  <span style={{color:col.color,fontWeight:900}}>›</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 6,
    icon: <Trash2 size={18} />,
    title: "Cleanup List",
    color: "#ff3366",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl" style={{background:"rgba(255,50,100,0.06)",border:"1px solid rgba(255,50,100,0.3)"}}>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:"#ff3366"}}>🗑 Remove</p>
          <ul className="space-y-1">
            {["All outdated pages","All duplicate routes","All old pricing models","All old invention plan pages","All lightbulb icons","All emoji‑style icons"].map((i,k) => (
              <li key={k} className="text-sm text-gray-300 flex items-center gap-2"><span style={{color:"#ff3366"}}>×</span> {i}</li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-xl" style={{background:"rgba(255,200,0,0.06)",border:"1px solid rgba(255,200,0,0.3)"}}>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:"#ffcc00"}}>🔧 Fix</p>
          <ul className="space-y-1">
            {["Stripe product linking","Module detail routing","Dashboard routing","Upsell logic","NDA placement"].map((i,k) => (
              <li key={k} className="text-sm text-gray-300 flex items-center gap-2"><span style={{color:"#ffcc00"}}>→</span> {i}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 7,
    icon: <Palette size={18} />,
    title: "Visual Direction Board",
    color: "#00ccff",
    content: (
      <div className="space-y-5">
        <div className="p-4 rounded-xl" style={{background:"rgba(0,0,0,0.5)",border:"1px solid rgba(0,204,255,0.3)"}}>
          <p className="text-xs font-black tracking-widest uppercase mb-2" style={{color:"#00ccff"}}>Theme</p>
          <p className="text-white font-bold">Akashic Engineering</p>
          <p className="text-gray-400 text-sm">Fusion of sacred geometry + scientific realism + neon intelligence</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl" style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)"}}>
            <p className="text-xs font-black tracking-widest uppercase mb-2 text-gray-400">Background Layers</p>
            <ul className="space-y-1 text-xs text-gray-400">
              {["Deep‑space gradient","Circuit grid","Sacred geometry","Scientific formulas","Inventor portraits","Parallax motion"].map((i,k)=><li key={k}>· {i}</li>)}
            </ul>
          </div>
          <div className="p-3 rounded-xl" style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)"}}>
            <p className="text-xs font-black tracking-widest uppercase mb-2 text-gray-400">Iconography</p>
            <ul className="space-y-1 text-xs text-gray-400">
              {["Realistic","Scientific","High‑resolution","No emojis","No clipart"].map((i,k)=><li key={k}>· {i}</li>)}
            </ul>
          </div>
          <div className="p-3 rounded-xl" style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)"}}>
            <p className="text-xs font-black tracking-widest uppercase mb-2 text-gray-400">Typography</p>
            <ul className="space-y-1 text-xs text-gray-400">
              {["Inter / Satoshi","Space Grotesk","IBM Plex Mono"].map((i,k)=><li key={k}>· {i}</li>)}
            </ul>
          </div>
        </div>
        <div>
          <p className="text-xs font-black tracking-widest uppercase mb-3 text-gray-400">Color Palette</p>
          <div className="flex flex-wrap gap-3">
            {[["Electric Blue","#0088ff"],["Violet Plasma","#8800ff"],["Quantum Cyan","#00ccff"],["Ion Gold","#ffcc00"],["Tesla Red","#ff2200"]].map(([name, hex], i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{background:"rgba(0,0,0,0.6)",border:`2px solid ${hex}66`}}>
                <div className="w-4 h-4 rounded-full" style={{background:hex,boxShadow:`0 0 8px ${hex}`}} />
                <span className="text-xs font-bold text-white">{name}</span>
                <span className="text-xs text-gray-500">{hex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    icon: <Cpu size={18} />,
    title: "Platform Architecture",
    color: "#8800ff",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl" style={{background:"rgba(136,0,255,0.07)",border:"1px solid rgba(136,0,255,0.3)"}}>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:"#8800ff"}}>Core Systems</p>
          <ul className="space-y-2">
            {["Research Database","Module Detail Engine","Membership Gating","Stripe Integration","Dashboard Logic","À la carte Catalog","Social Integrations"].map((s,i) => (
              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                <span style={{color:"#8800ff",fontWeight:900}}>⬡</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-xl" style={{background:"rgba(0,204,255,0.07)",border:"1px solid rgba(0,204,255,0.3)"}}>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:"#00ccff"}}>Tier Logic</p>
          <ul className="space-y-2">
            {["Research Access","Builder Access","Operator Access","Bundle Unlock"].map((t,i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-xs font-black px-2 py-0.5 rounded" style={{background:"rgba(0,204,255,0.15)",color:"#00ccff",border:"1px solid rgba(0,204,255,0.4)"}}>T{i+1}</span>
                <span className="text-sm text-white font-bold">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 9,
    icon: <Wrench size={18} />,
    title: "Build Specs Overview",
    color: "#00ff66",
    content: (
      <div className="space-y-5">
        <div className="p-4 rounded-xl" style={{background:"rgba(0,255,100,0.06)",border:"1px solid rgba(0,255,100,0.3)"}}>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:"#00ff66"}}>Pages to Build First</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {["Module Detail Pages","Dashboard","Patent & Source Docs","Tripwire","Lead Confirmation"].map((p,i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-xs font-black px-2 py-0.5 rounded" style={{background:"rgba(0,255,100,0.15)",color:"#00ff66",minWidth:"28px",textAlign:"center"}}>{i+1}</span>
                <span className="text-white">{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl" style={{background:"rgba(255,204,0,0.06)",border:"1px solid rgba(255,204,0,0.3)"}}>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:"#ffcc00"}}>Components</p>
          <div className="flex flex-wrap gap-2">
            {["Research cards","Category filters","Tag filters","Locked module overlays","Upsell blocks","Dashboard cards"].map((c,i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full font-bold" style={{background:"rgba(255,204,0,0.12)",border:"1px solid rgba(255,204,0,0.4)",color:"#ffcc00"}}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 10,
    icon: <Rocket size={18} />,
    title: "Launch Sequence",
    color: "#ff6600",
    content: (
      <div className="space-y-3">
        {[
          { phase: "Phase 1 — Funnel", color: "#ff6600", items: ["Fix CTAs","Fix routing","Fix pricing logic"] },
          { phase: "Phase 2 — Pages", color: "#ffcc00", items: ["Build missing pages","Rebuild incomplete pages"] },
          { phase: "Phase 3 — Navigation", color: "#00ff66", items: ["Clean public nav","Clean member nav"] },
          { phase: "Phase 4 — Cleanup", color: "#00ccff", items: ["Remove old pages","Remove duplicates","Remove outdated content"] },
          { phase: "Phase 5 — Visuals", color: "#cc00ff", items: ["Apply final visual system","Replace icons","Update backgrounds"] },
        ].map((phase, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{background:"rgba(0,0,0,0.5)",border:`1px solid ${phase.color}33`}}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{background:`${phase.color}22`,border:`2px solid ${phase.color}`,color:phase.color}}>
              {i+1}
            </div>
            <div>
              <p className="font-black text-white text-sm mb-1">{phase.phase}</p>
              <ul className="flex flex-wrap gap-2">
                {phase.items.map((item, j) => (
                  <li key={j} className="text-xs px-2 py-0.5 rounded" style={{background:`${phase.color}15`,color:phase.color,border:`1px solid ${phase.color}44`}}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 11,
    icon: <Fingerprint size={18} />,
    title: "Brand Identity System",
    color: "#00ccff",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl" style={{background:"rgba(0,204,255,0.07)",border:"1px solid rgba(0,204,255,0.3)"}}>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:"#00ccff"}}>Brand Pillars</p>
          <div className="flex flex-wrap gap-2">
            {["Intelligence","Precision","Engineering","Discovery","Innovation"].map((p,i) => (
              <span key={i} className="text-sm font-black px-3 py-1.5 rounded-lg" style={{background:"rgba(0,204,255,0.12)",border:"1px solid rgba(0,204,255,0.4)",color:"#00ccff"}}>{p}</span>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl" style={{background:"rgba(136,0,255,0.07)",border:"1px solid rgba(136,0,255,0.3)"}}>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:"#8800ff"}}>Voice</p>
          <ul className="space-y-1">
            {["Technical","Clear","Confident","High‑signal","No fluff"].map((v,i) => (
              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                <span style={{color:"#8800ff",fontWeight:900}}>›</span> {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 12,
    icon: <Settings size={18} />,
    title: "Implementation Notes",
    color: "#ffcc00",
    content: (
      <div className="space-y-2">
        {[
          "All pages must use the new visual system",
          "All modules must use the new detail page template",
          "All CTAs must follow the CTA map",
          "All navigation must follow the nav map",
          "All pricing must follow the $49/mo model",
          "All invention plans must use blur + Buy Now logic",
          "All social integrations must be active",
        ].map((note, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{background:"rgba(255,204,0,0.06)",border:"1px solid rgba(255,204,0,0.2)"}}>
            <span className="text-xs font-black px-1.5 py-0.5 rounded mt-0.5" style={{background:"rgba(255,204,0,0.2)",color:"#ffcc00",flexShrink:0}}>{String(i+1).padStart(2,"0")}</span>
            <p className="text-sm text-gray-300">{note}</p>
          </div>
        ))}
      </div>
    )
  },
];

export default function MasterLaunchDoc() {
  const [openSections, setOpenSections] = useState(new Set([1]));

  const toggle = (id) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenSections(new Set(SECTIONS.map(s => s.id)));
  const collapseAll = () => setOpenSections(new Set());

  return (
    <div className="min-h-screen" style={{background:"#030305",fontFamily:"'Share Tech Mono', monospace"}}>
      {/* Header */}
      <div className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between" style={{background:"rgba(3,3,5,0.95)",borderBottom:"2px solid rgba(0,204,255,0.4)",backdropFilter:"blur(12px)"}}>
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{background:"#00ff66",boxShadow:"0 0 8px #00ff66"}} />
            <span className="text-xs font-black tracking-widest" style={{color:"#00ccff"}}>C.O.D.E.X.T.E.C.H.</span>
          </div>
          <h1 className="text-lg font-black text-white tracking-wide">MASTER LAUNCH DOCUMENT</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={expandAll} className="text-xs px-3 py-1.5 rounded-lg font-black transition-all" style={{background:"rgba(0,204,255,0.1)",border:"1px solid rgba(0,204,255,0.4)",color:"#00ccff"}}>
            Expand All
          </button>
          <button onClick={collapseAll} className="text-xs px-3 py-1.5 rounded-lg font-black transition-all" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.15)",color:"#888"}}>
            Collapse All
          </button>
        </div>
      </div>

      {/* TOC */}
      <div className="px-6 py-6 border-b" style={{borderColor:"rgba(255,255,255,0.06)"}}>
        <p className="text-xs font-black tracking-widest text-gray-500 mb-4 uppercase">Table of Contents</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                toggle(s.id);
                document.getElementById(`section-${s.id}`)?.scrollIntoView({behavior:"smooth",block:"start"});
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-bold transition-all hover:opacity-80"
              style={{background:"rgba(0,0,0,0.5)",border:`1px solid ${s.color}33`,color:s.color}}
            >
              <span style={{color:s.color,opacity:0.7}}>{s.id}.</span>
              <span className="text-gray-300 truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-3">
        {SECTIONS.map(section => {
          const isOpen = openSections.has(section.id);
          return (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="rounded-2xl overflow-hidden"
              style={{border:`1px solid ${section.color}44`,background:"rgba(5,5,10,0.9)"}}
            >
              {/* Section Header */}
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left transition-all hover:opacity-80"
                style={{background: isOpen ? `${section.color}10` : "transparent"}}
              >
                <span className="text-xs font-black px-2 py-0.5 rounded" style={{background:`${section.color}20`,color:section.color,minWidth:"32px",textAlign:"center",border:`1px solid ${section.color}55`}}>
                  {String(section.id).padStart(2,"0")}
                </span>
                <span style={{color:section.color}}>{section.icon}</span>
                <span className="font-black text-white text-sm tracking-wide flex-1">{section.title}</span>
                {isOpen
                  ? <ChevronDown size={16} style={{color:section.color}} />
                  : <ChevronRight size={16} style={{color:"#555"}} />
                }
              </button>

              {/* Section Content */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2" style={{borderTop:`1px solid ${section.color}22`}}>
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center border-t" style={{borderColor:"rgba(255,255,255,0.06)"}}>
        <p className="text-xs text-gray-600 font-bold tracking-widest uppercase">C.O.D.E.X.T.E.C.H. · Master Launch Document · v1.0 · {new Date().toLocaleDateString()}</p>
        <p className="text-xs text-gray-700 mt-1">Official Launch Specification — Internal Use Only</p>
      </div>
    </div>
  );
}