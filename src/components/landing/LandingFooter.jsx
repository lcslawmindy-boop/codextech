import { Quote } from "lucide-react";
import { Link } from "react-router-dom";

const TESTIMONIALS = [
  {
    text: "I mapped 6 technologies I'd been researching separately for 3 years and generated my first licensing brief in 20 minutes. The connection engine is unlike anything I've seen.",
    author: "Independent Biotech Inventor",
  },
  {
    text: "The investor package output gave me something I could actually send to serious capital. The legal disclaimers and IP status framing made it credible.",
    author: "Medical Device IP Developer",
  },
  {
    text: "I used the SBIR section builder for a grant application and the grant officer specifically called out our technology justification as exceptionally well-documented.",
    author: "Research Commercialization Consultant",
  },
];

export default function LandingFooter() {
  return (
    <>
      {/* Testimonials */}
      <section className="relative py-24 bg-zarp-bg">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            What Innovators Are <span className="text-zarp-gold">Building with ZARP</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-zarp-card border border-zarp-border rounded-2xl p-6">
                <Quote size={28} className="text-zarp-gold/40 mb-4" />
                <p className="text-zarp-text text-sm leading-relaxed mb-4">{t.text}</p>
                <p className="text-zarp-muted text-xs font-semibold">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(var(--zarp-gold)) 0%, hsl(var(--zarp-amber)) 100%)' }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-zarp-bg" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            The Research Exists. The Connections Are Here. Start Building.
          </h2>
          <p className="text-zarp-bg/80 text-lg mb-8 max-w-2xl mx-auto">
            Your next device concept, IP filing, investor package, or grant application starts with one node.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing" className="px-8 py-4 rounded-xl text-base font-bold bg-zarp-bg text-zarp-text hover:scale-105 transition-all">
              Start Free Today
            </a>
            <a href="#pricing" className="px-8 py-4 rounded-xl text-base font-bold border-2 border-zarp-bg text-zarp-bg hover:bg-zarp-bg/10 transition-all">
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-zarp-bg border-t border-zarp-border py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Col 1 — Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-display font-bold text-lg text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>ZARP</span>
              </div>
              <p className="text-zarp-muted text-xs leading-relaxed mb-2">
                Where Suppressed Science Meets Engineered Innovation
              </p>
              <p className="text-zarp-muted text-[10px] leading-relaxed">
                For innovation and integration purposes — not a validation of underlying science.
              </p>
            </div>

            {/* Col 2 — Platform */}
            <div>
              <p className="text-zarp-text text-sm font-bold mb-3">Platform</p>
              <div className="space-y-2">
                {["Features", "Pricing", "Research Library", "Device Builder", "Export Center"].map(l => (
                  <a key={l} href="#" className="block text-zarp-muted text-xs hover:text-zarp-gold transition-colors">{l}</a>
                ))}
              </div>
            </div>

            {/* Col 3 — Company */}
            <div>
              <p className="text-zarp-text text-sm font-bold mb-3">Company</p>
              <div className="space-y-2">
                {["About", "Blog", "Careers", "Press", "Contact"].map(l => (
                  <a key={l} href="#" className="block text-zarp-muted text-xs hover:text-zarp-gold transition-colors">{l}</a>
                ))}
              </div>
            </div>

            {/* Col 4 — Legal */}
            <div>
              <p className="text-zarp-text text-sm font-bold mb-3">Legal</p>
              <div className="space-y-2">
                {["Terms of Service", "Privacy Policy", "Disclaimer", "IP Notice"].map(l => (
                  <Link key={l} to="/terms" className="block text-zarp-muted text-xs hover:text-zarp-gold transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Legal bar */}
          <div className="pt-6 border-t border-zarp-border">
            <p className="text-zarp-muted text-[10px] leading-relaxed">
              © 2026 ZARP / Aethon Apex IP Holdings LLC — Henderson, NV 89002. All research content is for innovation and IP development purposes only. Nothing on this platform constitutes medical advice, treatment claims, or legal advice. All device plans are conceptual and subject to manufacturer validation. All IP assets are protected as trade secrets under NRS 600A and the Defend Trade Secrets Act.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}