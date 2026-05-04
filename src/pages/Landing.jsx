import LiveActivityTicker from "@/components/LiveActivityTicker";
import HeroSection from "@/components/landing/HeroSection";
import TrustSignals from "@/components/conversion/TrustSignals";
import EMFCrisisSection from "@/components/landing/EMFCrisisSection";
import PlatformShowcase from "@/components/landing/PlatformShowcase";
import TopProductsSection from "@/components/landing/TopProductsSection";
import DeclassifiedPatents from "@/components/DeclassifiedPatents";
import BuildDevicesCatalogue from "@/components/BuildDevicesCatalogue";
import CourseCatalogue3D from "@/components/CourseCatalogue3D";
import PitchDeckShowcase from "@/components/landing/PitchDeckShowcase";
import ClassifiedEvidenceSection from "@/components/ClassifiedEvidenceSection";
import ConversionFunnel from "@/components/ConversionFunnel";
import TrustProofSection from "@/components/TrustProofSection";
import PricingComparison from "@/components/conversion/PricingComparison";
import UserDashboardSection from "@/components/UserDashboardSection";
import { Link } from "react-router-dom";
import { Percent } from "lucide-react";
import ZaraAlienMascot from "@/components/ZaraAlienMascot";
import LibraryBackground from "@/components/backgrounds/LibraryBackground";

export default function Landing() {
  return (
    <div
      className="min-h-screen relative"
      style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.04em" }}
    >
      <LibraryBackground />
      <LiveActivityTicker />

      <ZaraAlienMascot />

      <div className="pt-16">
        <HeroSection />
        <TrustSignals />
        <EMFCrisisSection />
        <PlatformShowcase />
        <TopProductsSection />
        <DeclassifiedPatents />
        <ClassifiedEvidenceSection />
        <BuildDevicesCatalogue />
        <PitchDeckShowcase />
        <CourseCatalogue3D />
        <ConversionFunnel />

        {/* IP Marketplace & Bearden Graph CTA */}
        <section className="px-6 py-16 border-b border-white/10 solid-section">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "linear-gradient(135deg, rgba(0,150,255,0.08), rgba(0,0,0,0.7))",
                  border: "2px solid rgba(0,150,255,0.4)",
                  boxShadow: "0 0 40px rgba(0,150,255,0.12)",
                }}
              >
                <h3 className="text-2xl font-black mb-4 text-white">🔮 Bearden Concept Graph</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Interactive 3D knowledge graph of 100+ electromagnetic devices and their technical relationships.
                </p>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ 100+ device nodes with full specifications</li>
                  <li>✓ Patent cross-references & claim relationships</li>
                  <li>✓ Technology maturity scoring</li>
                  <li>✓ Market opportunity heat mapping</li>
                </ul>
                <Link
                  to="/device-graph"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm"
                  style={{ background: "rgba(0,150,255,0.15)", border: "2px solid #0096ff", color: "#00aaff" }}
                >
                  🔮 Explore the Graph →
                </Link>
              </div>

              <div
                className="rounded-2xl p-8"
                style={{
                  background: "linear-gradient(135deg, rgba(0,255,100,0.08), rgba(0,0,0,0.7))",
                  border: "2px solid rgba(0,255,100,0.4)",
                  boxShadow: "0 0 40px rgba(0,255,100,0.12)",
                }}
              >
                <h3 className="text-2xl font-black mb-4 text-white">🤝 Anonymous IP Marketplace</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Broker patents, inventions, and partnerships with full anonymity. Smart matching connects the right capital with the right IP.
                </p>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ Anonymous inventor & investor profiles</li>
                  <li>✓ AI-powered matching algorithm</li>
                  <li>✓ VDR for secure due diligence documents</li>
                  <li>✓ Deal pipeline management & LOI templates</li>
                </ul>
                <Link
                  to="/ip-marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm"
                  style={{ background: "rgba(0,255,100,0.15)", border: "2px solid #00ff66", color: "#00ff66" }}
                >
                  🤝 Browse Marketplace →
                </Link>
              </div>
            </div>

            <div
              className="mt-6 p-4 rounded-xl text-center"
              style={{ background: "rgba(255,200,0,0.06)", border: "1px solid rgba(255,200,0,0.3)" }}
            >
              <p className="text-yellow-300 text-sm font-bold flex items-center justify-center gap-2">
                <Percent size={14} /> ZAT earns 5% commission on closed marketplace deals — transparent, fair, aligned with your success.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-12 border-b border-white/10 solid-section">
          <div className="max-w-4xl mx-auto">
            <UserDashboardSection />
          </div>
        </section>

        <TrustProofSection />
        <PricingComparison />

        <section className="px-6 py-12 border-t border-white/10 solid-section">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center">
              <div><p className="font-black text-white text-xl mb-1">40+</p><p className="text-gray-500 text-xs">Verified Patents</p></div>
              <div><p className="font-black text-white text-xl mb-1">200+</p><p className="text-gray-500 text-xs">Peer-Reviewed Sources</p></div>
              <div><p className="font-black text-white text-xl mb-1">21+</p><p className="text-gray-500 text-xs">Device Build Plans</p></div>
              <div><p className="font-black text-white text-xl mb-1">12</p><p className="text-gray-500 text-xs">AI Tools Included</p></div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-600 text-xs mb-4">
                Powered by ZAT (Zenith Apex Technology) · Primary sources only · No speculation · Institutional-grade research
              </p>
              <div className="flex justify-center gap-6 text-gray-500 text-xs">
                <Link to="/terms" className="hover:text-gray-300">Terms</Link>
                <Link to="/refund-policy" className="hover:text-gray-300">Refund Policy</Link>
                <Link to="/research-disclaimer" className="hover:text-gray-300">Research Disclaimer</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}