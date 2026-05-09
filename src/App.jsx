import { Toaster } from "@/components/ui/toaster"
import TrialBanner from './components/TrialBanner';
import { TrialContext } from './lib/TrialContext';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// Add page imports here
import ZarpLanding from './pages/ZarpLanding';
import VaultNDALanding from './pages/VaultNDALanding';
import CodextechLanding from './pages/CodextechLanding';
import FreeVault from './pages/FreeVault';
import OrderTracking from './pages/OrderTracking';
import ConceptGraph from './pages/ConceptGraph';
import LegalAgreement from './pages/LegalAgreement';
import CopyProtection from './components/CopyProtection';
import { useNdaGate } from './hooks/useNdaGate';
import { usePaymentGate } from './hooks/usePaymentGate';
import BusinessModels from './pages/BusinessModels';
import PitchBuilder from './pages/PitchBuilder';
import MarketDeck from './pages/MarketDeck';
import Subscribe from './pages/Subscribe';
import MyResearch from './pages/MyResearch';
import CourseCatalog from './pages/CourseCatalog';
import MarketingPlan from './pages/MarketingPlan';
import Simulator from './pages/Simulator';
import Checkout from './pages/Checkout';
import MyLearning from './pages/MyLearning';
import LabSimulation from './pages/LabSimulation';
import InventionPlans from './pages/InventionPlans';
import EMFImpact from './pages/EMFImpact';
import ScalarEMLab from './pages/ScalarEMLab';
import PatentDraftingTool from './pages/PatentDraftingTool';
import PatentClaimsGenerator from './pages/PatentClaimsGenerator';
import TimelinePitchDeck from './pages/TimelinePitchDeck';
import PriorArtArchive from './pages/PriorArtArchive';
import InvestorPortal from './pages/InvestorPortal';
import InvestorOutreachWorkflow from './pages/InvestorOutreachWorkflow';
import InvestorOutreachGuide from './pages/InvestorOutreachGuide';
import PatentLandscapeGraph from './pages/PatentLandscapeGraph';
import MonitoringDashboard from './pages/MonitoringDashboard';
import PatentFilingWizard from './pages/PatentFilingWizard';
import InvestorCRM from './pages/InvestorCRM';
import InvestorPackage from './pages/InvestorPackage';
import ZenithApex from './pages/ZenithApex';
import ScalarWaveSimulatorPage from './pages/ScalarWaveSimulatorPage';
import ScalarFieldSim from './pages/ScalarFieldSim';
import BrandArchitecture from './pages/BrandArchitecture';
import EMFExposureLog from './pages/EMFExposureLog';
import HeavyMetalDetox from './pages/HeavyMetalDetox';
import HealthAnalytics from './pages/HealthAnalytics';
import EMFProtectionShop from './pages/EMFProtectionShop';
import DarkTimeline from './pages/DarkTimeline';
import InventionForge from './pages/InventionForge';
import ProvisionalPatent from './pages/ProvisionalPatent';
import ScalarPotentialMap from './pages/ScalarPotentialMap';
import AdminVideos from './pages/AdminVideos';
import OpportunityMonitor from './pages/OpportunityMonitor';
import AdminDownloadCenter from './pages/AdminDownloadCenter';
import InventionLibrary from './pages/InventionLibrary';
import DownloadCenter from './pages/DownloadCenter';
import InventionTimeline from './pages/InventionTimeline';
import Pricing from './pages/Pricing';
import AccountSettings from './pages/AccountSettings';
import BetaApply from './pages/BetaApply';
import AdminBeta from './pages/AdminBeta';
import MemberPortal from './pages/MemberPortal';
import LicensingPortal from './pages/LicensingPortal';
import MobileLayout from './components/MobileLayout';
import DeviceKnowledgeGraph from './pages/DeviceKnowledgeGraph';
import AcquisitionCRM from './pages/AcquisitionCRM';
import ValuationDashboard from './pages/ValuationDashboard';
import VDRPortal from './pages/VDRPortal';
import VDRAdmin from './pages/VDRAdmin';
import VirtualDataRoom from './pages/VirtualDataRoom';
import VDRAuditLog from './pages/VDRAuditLog';
import InventionBuildTracker from './pages/InventionBuildTracker';
import TRZPatent from './pages/TRZPatent';
import CoursePlan from './pages/CoursePlan';
import SocialMediaCommand from './pages/SocialMediaCommand';
import SocialMediaAgent from './pages/SocialMediaAgent';
import AdminHub from './pages/AdminHub';
import AdminMemberAccess from './pages/AdminMemberAccess';
import AdminGuard from './components/AdminGuard';
import AdminTierAccess from './pages/AdminTierAccess';
import BuildSuppliesShop from './pages/BuildSuppliesShop';
import AdminShopOrders from './pages/AdminShopOrders';
import AdminInventorReviews from './pages/AdminInventorReviews';
import AdminPdfAccess from './pages/AdminPdfAccess';
import TroubleshootingGuides from './pages/TroubleshootingGuides';
import BeginnerManual from './pages/BeginnerManual';
import Glossary from './pages/Glossary';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import SocialMediaProfileGen from './pages/SocialMediaProfileGen';
import AIResearchAssistant from './pages/AIResearchAssistant';
import SellerTermSheet from './pages/SellerTermSheet';
import MaterialSourcing from './pages/MaterialSourcing.jsx';
import PatentIntelligence from './pages/PatentIntelligence.jsx';
import PatentDraftingWizard from './pages/PatentDraftingWizard.jsx';
import PatentReview from './pages/PatentReview.jsx';
import PitchScript from './pages/PitchScript.jsx';
import VisionFundPitch from './pages/VisionFundPitch';
import RDSandbox from './pages/RDSandbox';
import HybridPortfolio from './pages/HybridPortfolio';
import FTOAnalysisTool from './pages/FTOAnalysisTool';
import PatentAttorneyChat from './pages/PatentAttorneyChat';
import IPMarketplace from './pages/IPMarketplace';
import CoInventorMatching from './pages/CoInventorMatching';
import FlashSale from './pages/FlashSale';
import AdminPromoBlast from './pages/AdminPromoBlast';
import WhiteLabelSaaS from './pages/WhiteLabelSaaS';
import SBIRPipeline from './pages/SBIRPipeline';
import ZARPAcquisitionPackage from './pages/ZARPAcquisitionPackage';
import AcquisitionOutreachTracker from './pages/AcquisitionOutreachTracker';
import CollabPatentDraft from './pages/CollabPatentDraft';
import IPPortfolioHealth from './pages/IPPortfolioHealth';
import BuildMilestoneAI from './pages/BuildMilestoneAI';
import ValuationAPI from './pages/ValuationAPI';
import VDRNdaSign from './pages/VDRNdaSign';
import VDRDocumentGenerator from './pages/VDRDocumentGenerator';
import Welcome from './pages/Welcome';
import TrialOnboarding from './pages/TrialOnboarding';
import PostPurchaseOnboarding from './pages/PostPurchaseOnboarding';
import PostNDAOnboarding from './pages/PostNDAOnboarding';
import BuildPlansMarketplace from './pages/BuildPlansMarketplace';
import MemberDashboard from './pages/MemberDashboard';
import PublicPreview from './pages/PublicPreview';
import AcquisitionPitchDeck from './pages/AcquisitionPitchDeck';
import InstitutionalLicensing from './pages/InstitutionalLicensing';
import ReferralDashboard from './pages/ReferralDashboard';
import ContestPage from './pages/ContestPage';
import AdminContest from './pages/AdminContest';
import PaywallPage from './pages/PaywallPage';
import EmailFunnel from './pages/EmailFunnel';
import ProductLadder from './pages/ProductLadder';
import ViralScripts from './pages/ViralScripts';
import RetentionDashboard from './pages/RetentionDashboard';
import UpsellEngine from './pages/UpsellEngine';
import LeadMagnetSystem from './pages/LeadMagnetSystem';
import CommunityForum from './pages/CommunityForum';
import CreateCommunityPost from './pages/CreateCommunityPost';
import ABTestingDashboard from './pages/ABTestingDashboard';
import RevenueAudit from './pages/RevenueAudit';
import AdminNdaSignatures from './pages/AdminNdaSignatures';
import AdminStripeCatalog from './pages/AdminStripeCatalog';
import ScalarVentureHome from './pages/ScalarVentureHome';
import VaultBrowser from './pages/VaultBrowser';
import BuildDetail from './pages/BuildDetail';
import VaultPricing from './pages/VaultPricing';
import MemberVault from './pages/MemberVault';
import ResearchLab from './pages/ResearchLab';
import KitBundle from './pages/KitBundle';
import MyLibrary from './pages/MyLibrary';
import HydromagnetopropulsionCourse from './pages/HydromagnetopropulsionCourse';
import AlaCarteMenu from './pages/AlaCarteMenu';
import ResearchBriefLanding from './pages/ResearchBriefLanding';
import TechnicalBriefPack from './pages/TechnicalBriefPack';
import ResearchMembership from './pages/ResearchMembership';
import AdvancedEngineeringBundle from './pages/AdvancedEngineeringBundle';
import ResearchDisclaimer from './pages/ResearchDisclaimer';
import VaultHeroPage from './pages/VaultHeroPage';
import FunnelHome from './pages/FunnelHome';
import PatentHub from './pages/PatentHub';
import DeviceCatalogue from './pages/DeviceCatalogue';
import CourseCatalogue2 from './pages/CourseCatalogue2';
import InventionForge2 from './pages/InventionForge2';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { accepted: ndaAccepted, loading: ndaLoading } = useNdaGate();
  const { paid: hasPaid, isTrial, loading: paymentLoading } = usePaymentGate();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth || ndaLoading || paymentLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Redirect to NDA gate if not accepted
  if (!ndaAccepted) {
    return (
      <Routes>
        <Route path="/" element={<VaultNDALanding />} />
        <Route path="/free-vault" element={<FreeVault />} />
        <Route path="/build-supplies-shop" element={<BuildSuppliesShop />} />
        <Route path="/emf-impact" element={<EMFImpact />} />
        <Route path="/vault" element={<ConceptGraph />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/paywall" element={<PaywallPage />} />
        <Route path="*" element={<LegalAgreement />} />
      </Routes>
    );
  }

  // Redirect to trial onboarding or pricing if not paid
  if (!hasPaid) {
    return (
      <Routes>
        <Route path="/" element={<VaultNDALanding />} />
        <Route path="/free-vault" element={<FreeVault />} />
        <Route path="/build-supplies-shop" element={<BuildSuppliesShop />} />
        <Route path="/emf-impact" element={<EMFImpact />} />
        <Route path="/vault" element={<ConceptGraph />} />
        <Route path="/paywall" element={<PaywallPage />} />
        <Route path="/trial-onboarding" element={<TrialOnboarding />} />
        <Route path="/beta-apply" element={<BetaApply />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={isTrial ? <TrialOnboarding /> : <VaultNDALanding />} />
      </Routes>
    );
  }

  // Render the main app
  return (
    <TrialContext.Provider value={{ isTrial }}>
      <CopyProtection />
      {isTrial && <TrialBanner />}
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<ConceptGraph />} />
          <Route path="/zarp-landing" element={<ZarpLanding />} />
          <Route path="/free-vault" element={<FreeVault />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />
          <Route path="/orders" element={<OrderTracking />} />
          <Route path="/business" element={<BusinessModels />} />
          <Route path="/pitch" element={<PitchBuilder />} />
          <Route path="/market-deck" element={<MarketDeck />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/my-research" element={<MyResearch />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/lab" element={<LabSimulation />} />
          <Route path="/invention-plans" element={<InventionPlans />} />
          <Route path="/emf-impact" element={<EMFImpact />} />
          <Route path="/scalar-lab" element={<ScalarEMLab />} />
          <Route path="/patent-tool" element={<PatentDraftingTool />} />
          <Route path="/patent-claims-generator" element={<PatentClaimsGenerator />} />
          <Route path="/timeline-pitch" element={<TimelinePitchDeck />} />
          <Route path="/prior-art" element={<PriorArtArchive />} />
          <Route path="/investors" element={<InvestorPortal />} />
          <Route path="/investor-portal" element={<InvestorPortal />} />
          <Route path="/investor-outreach" element={<InvestorOutreachWorkflow />} />
          <Route path="/investor-outreach-guide" element={<InvestorOutreachGuide />} />
          <Route path="/patent-landscape" element={<PatentLandscapeGraph />} />
          <Route path="/patent-wizard" element={<PatentFilingWizard />} />
          <Route path="/investor-crm" element={<InvestorCRM />} />
          <Route path="/zenith-apex" element={<ZenithApex />} />
          <Route path="/scalar-sim" element={<ScalarFieldSim />} />
          <Route path="/scalar-wave-sim" element={<ScalarWaveSimulatorPage />} />
          <Route path="/brand" element={<BrandArchitecture />} />
          <Route path="/emf-shop" element={<EMFProtectionShop />} />
          <Route path="/emf-log" element={<EMFExposureLog />} />
          <Route path="/heavy-metal-detox" element={<HeavyMetalDetox />} />
          <Route path="/health-analytics" element={<HealthAnalytics />} />
          <Route path="/investor-package" element={<InvestorPackage />} />
          <Route path="/dark-timeline" element={<DarkTimeline />} />
          <Route path="/inventor-forge" element={<InventionForge />} />
          <Route path="/provisional-patent" element={<ProvisionalPatent />} />
          <Route path="/scalar-potential" element={<ScalarPotentialMap />} />
          <Route path="/invention-library" element={<InventionLibrary />} />
          <Route path="/download-center" element={<DownloadCenter />} />
          <Route path="/invention-timeline" element={<InventionTimeline />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/beta-apply" element={<BetaApply />} />
          <Route path="/member-portal" element={<MemberPortal />} />
          <Route path="/licensing" element={<LicensingPortal />} />
          <Route path="/device-graph" element={<DeviceKnowledgeGraph />} />
          <Route path="/vdr/:token" element={<VDRPortal />} />
          <Route path="/course-plan" element={<CoursePlan />} />
          <Route path="/social-command" element={<SocialMediaCommand />} />
          <Route path="/social-agent" element={<SocialMediaAgent />} />
          <Route path="/build-supplies-shop" element={<BuildSuppliesShop />} />
          <Route path="/troubleshooting" element={<TroubleshootingGuides />} />
          <Route path="/beginner-manual" element={<BeginnerManual />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/social-profile-gen" element={<SocialMediaProfileGen />} />
          <Route path="/ai-research" element={<AIResearchAssistant />} />
          <Route path="/patent-intelligence" element={<PatentIntelligence />} />
          <Route path="/patent-drafting-wizard" element={<PatentDraftingWizard />} />
          <Route path="/patent-review/:token" element={<PatentReview />} />
          <Route path="/term-sheet" element={<SellerTermSheet />} />
          <Route path="/pitch-script" element={<PitchScript />} />
          <Route path="/vision-fund-pitch" element={<VisionFundPitch />} />
          <Route path="/rd-sandbox" element={<RDSandbox />} />
          <Route path="/hybrid-portfolio" element={<HybridPortfolio />} />
          <Route path="/fto-analysis" element={<FTOAnalysisTool />} />
          <Route path="/patent-attorney-chat" element={<PatentAttorneyChat />} />
          <Route path="/ip-marketplace" element={<IPMarketplace />} />
          <Route path="/co-inventor-matching" element={<CoInventorMatching />} />
          <Route path="/white-label-saas" element={<WhiteLabelSaaS />} />
          <Route path="/sbir-pipeline" element={<SBIRPipeline />} />
          <Route path="/zarp-acquisition" element={<ZARPAcquisitionPackage />} />
          <Route path="/acquisition-outreach" element={<AcquisitionOutreachTracker />} />
          <Route path="/collab-patent-draft" element={<CollabPatentDraft />} />
          <Route path="/ip-portfolio-health" element={<IPPortfolioHealth />} />
          <Route path="/build-milestone-ai" element={<BuildMilestoneAI />} />
          <Route path="/valuation-api" element={<ValuationAPI />} />
          <Route path="/flash-sale" element={<FlashSale />} />
          <Route path="/vdr-nda" element={<VDRNdaSign />} />
          <Route path="/vdr-generator" element={<VDRDocumentGenerator />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/trial-onboarding" element={<TrialOnboarding />} />
          <Route path="/checkout" element={<PostPurchaseOnboarding />} />
          <Route path="/nda-onboarding" element={<PostNDAOnboarding />} />
          <Route path="/build-plans" element={<BuildPlansMarketplace />} />
          <Route path="/preview" element={<PublicPreview />} />
          <Route path="/acquire" element={<AcquisitionPitchDeck />} />
          <Route path="/referrals" element={<ReferralDashboard />} />
          <Route path="/contest" element={<ContestPage />} />
          <Route path="/paywall" element={<PaywallPage />} />
          <Route path="/community" element={<CommunityForum />} />
          <Route path="/community/new" element={<CreateCommunityPost />} />

          {/* Admin-only routes */}
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminHub />} />
            <Route path="/admin-member-access" element={<AdminMemberAccess />} />
            <Route path="/admin-contest" element={<AdminContest />} />
            <Route path="/admin-tier-access" element={<AdminTierAccess />} />
            <Route path="/admin-promo" element={<AdminPromoBlast />} />
            <Route path="/admin-beta" element={<AdminBeta />} />
            <Route path="/admin-videos" element={<AdminVideos />} />
            <Route path="/admin-downloads" element={<AdminDownloadCenter />} />
            <Route path="/vdr-admin" element={<VDRAdmin />} />
            <Route path="/vdr-documents" element={<VirtualDataRoom />} />
            <Route path="/vdr-audit-log" element={<VDRAuditLog />} />
            <Route path="/acquisition-crm" element={<AcquisitionCRM />} />
            <Route path="/valuation" element={<ValuationDashboard />} />
            <Route path="/opportunity-monitor" element={<OpportunityMonitor />} />
            <Route path="/monitoring" element={<MonitoringDashboard />} />
            <Route path="/marketing" element={<MarketingPlan />} />
            <Route path="/build-tracker" element={<InventionBuildTracker />} />
            <Route path="/trz-patent" element={<TRZPatent />} />
            <Route path="/admin-shop-orders" element={<AdminShopOrders />} />
            <Route path="/admin-inventor-reviews" element={<AdminInventorReviews />} />
            <Route path="/admin-pdf-access" element={<AdminPdfAccess />} />
            <Route path="/admin-nda-signatures" element={<AdminNdaSignatures />} />
            <Route path="/admin-stripe-catalog" element={<AdminStripeCatalog />} />
            <Route path="/email-funnel" element={<EmailFunnel />} />
            <Route path="/product-ladder" element={<ProductLadder />} />
            <Route path="/viral-scripts" element={<ViralScripts />} />
            <Route path="/material-sourcing" element={<MaterialSourcing />} />
            <Route path="/retention" element={<RetentionDashboard />} />
            <Route path="/upsell-engine" element={<UpsellEngine />} />
            <Route path="/lead-magnets" element={<LeadMagnetSystem />} />
            <Route path="/ab-testing" element={<ABTestingDashboard />} />
            <Route path="/revenue-audit" element={<RevenueAudit />} />
          </Route>

          {/* Scalar Venture Vault Routes */}
          <Route path="/venture" element={<ScalarVentureHome />} />
          <Route path="/vault-browser" element={<VaultBrowser />} />
          <Route path="/build/:id" element={<BuildDetail />} />
          <Route path="/pricing-vault" element={<VaultPricing />} />
          <Route path="/institutional-licensing" element={<InstitutionalLicensing />} />
          <Route path="/my-vault" element={<MemberVault />} />
          <Route path="/research-lab" element={<ResearchLab />} />
          <Route path="/kit-bundles" element={<KitBundle />} />
          <Route path="/my-library" element={<MyLibrary />} />
          <Route path="/hydromagnetopropulsion-course" element={<HydromagnetopropulsionCourse />} />
          <Route path="/alacarte" element={<AlaCarteMenu />} />
          <Route path="/research-brief" element={<ResearchBriefLanding />} />
          <Route path="/technical-brief-pack" element={<TechnicalBriefPack />} />
          <Route path="/research-membership" element={<ResearchMembership />} />
          <Route path="/advanced-engineering-bundle" element={<AdvancedEngineeringBundle />} />
          <Route path="/research-disclaimer" element={<ResearchDisclaimer />} />
          <Route path="/vault" element={<VaultHeroPage />} />
          <Route path="/patent-hub" element={<PatentHub />} />
          <Route path="/start" element={<FunnelHome />} />
          <Route path="/device-catalogue" element={<DeviceCatalogue />} />
          <Route path="/course-catalogue" element={<CourseCatalogue2 />} />
          <Route path="/invention-forge" element={<InventionForge2 />} />

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </TrialContext.Provider>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App