import { Network, Link2, FileCode, ArrowRight } from "lucide-react";

export default function LandingHowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <Network size={32} className="text-zarp-gold" />,
      title: "Explore the Node Graph",
      text: "Browse 500+ research nodes spanning bioelectromagnetics, scalar science, acoustic medicine, photobiomodulation, consciousness field research, and suppressed electromedicine. Filter by domain, evidence quality, suppression status, and target population.",
      visual: "graph",
    },
    {
      num: "02",
      icon: <Link2 size={32} className="text-zarp-blue" />,
      title: "Discover Hidden Connections",
      text: "ZARP's intelligence engine maps the relationships between researchers, mechanisms, frequency ranges, biological targets, and engineering principles — revealing multi-system integration opportunities no single researcher ever saw.",
      visual: "edges",
    },
    {
      num: "03",
      icon: <FileCode size={32} className="text-zarp-violet" />,
      title: "Generate Device Build Plans & IP Packages",
      text: "Export professional Device Build Plans, IP claim draft frameworks, investor-ready technology briefs, and grant application sections — all grounded in documented research with proper citations.",
      visual: "export",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-zarp-bg to-zarp-card">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-16 text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          From Research to Reality in <span className="text-zarp-gold">Three Steps</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              <div className="bg-zarp-card border border-zarp-border rounded-2xl p-8 hover:border-zarp-gold/40 transition-all h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-zarp-elevated flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-5xl font-black text-zarp-border" style={{ fontFamily: 'Orbitron, sans-serif' }}>{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-zarp-text mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>{step.title}</h3>
                <p className="text-zarp-muted text-sm leading-relaxed">{step.text}</p>

                {/* Visual mockup */}
                <div className="mt-6 h-32 rounded-xl bg-zarp-bg border border-zarp-border overflow-hidden relative">
                  {step.visual === "graph" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="absolute w-2 h-2 rounded-full" style={{
                          backgroundColor: i % 3 === 0 ? 'hsl(var(--zarp-gold))' : i % 3 === 1 ? 'hsl(var(--zarp-blue))' : 'hsl(var(--zarp-violet))',
                          left: `${15 + (i * 11)}%`, top: `${20 + (i % 4) * 20}%`,
                          boxShadow: `0 0 8px currentColor`,
                        }} />
                      ))}
                    </div>
                  )}
                  {step.visual === "edges" && (
                    <div className="absolute inset-0 flex items-center justify-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-zarp-gold/20 border border-zarp-gold flex items-center justify-center text-xs font-bold text-zarp-gold">A</div>
                      <div className="flex-1 h-px bg-gradient-to-r from-zarp-gold via-zarp-blue to-zarp-violet relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zarp-blue animate-pulse" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-zarp-violet/20 border border-zarp-violet flex items-center justify-center text-xs font-bold text-zarp-violet">B</div>
                    </div>
                  )}
                  {step.visual === "export" && (
                    <div className="absolute inset-0 p-4 flex flex-col gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-2 rounded bg-zarp-elevated" style={{ width: `${90 - i * 12}%` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-zarp-elevated border border-zarp-border flex items-center justify-center">
                    <ArrowRight size={14} className="text-zarp-gold" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}