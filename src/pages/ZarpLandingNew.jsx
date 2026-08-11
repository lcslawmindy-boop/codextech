import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingProblem from "@/components/landing/LandingProblem";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingShowcase from "@/components/landing/LandingShowcase";
import LandingPremium from "@/components/landing/LandingPremium";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingFooter from "@/components/landing/LandingFooter";

export default function ZarpLandingNew() {
  return (
    <div className="min-h-screen bg-zarp-bg text-zarp-text" style={{ fontFamily: 'Inter, sans-serif' }}>
      <LandingNavbar />
      <LandingHero />
      <LandingProblem />
      <LandingHowItWorks />
      <div id="showcase">
        <LandingShowcase />
      </div>
      <LandingPremium />
      <LandingPricing />
      <LandingFooter />
    </div>
  );
}