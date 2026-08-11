import { Ban, Puzzle, Lightbulb } from "lucide-react";

export default function LandingProblem() {
  const cards = [
    {
      icon: <Ban size={28} className="text-zarp-red" />,
      title: "Suppressed",
      text: "Hundreds of documented technologies were shelved by institutions protecting existing markets. The research exists — it just isn't connected.",
    },
    {
      icon: <Puzzle size={28} className="text-zarp-amber" />,
      title: "Fragmented",
      text: "Rife, Prioré, Bearden, Reich, Becker — brilliant researchers working in isolation. No platform has ever mapped how their work intersects.",
    },
    {
      icon: <Lightbulb size={28} className="text-zarp-gold" />,
      title: "Untapped",
      text: "The multi-system integration opportunity — combining these technologies into next-generation therapeutic devices — has never been engineered at scale. Until now.",
    },
  ];

  return (
    <section className="relative py-24 bg-zarp-bg">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Decades of breakthrough research. <span className="text-zarp-red">Buried.</span> <span className="text-zarp-amber">Ignored.</span> <span className="text-zarp-muted">Disconnected.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {cards.map(card => (
            <div key={card.title} className="bg-zarp-card border border-zarp-border rounded-2xl p-8 hover:border-zarp-gold/40 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-zarp-elevated flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-zarp-text mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>{card.title}</h3>
              <p className="text-zarp-muted text-sm leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-16 text-2xl md:text-3xl font-bold" style={{ color: 'hsl(var(--zarp-gold))', fontFamily: 'Orbitron, sans-serif' }}>
          ZARP changes that. We built the map. Now you can build the devices.
        </p>
      </div>
    </section>
  );
}