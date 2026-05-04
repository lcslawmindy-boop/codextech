import { Toaster } from "@/components/ui/toaster"
import { TrialContext } from './lib/TrialContext';
import { ZenithThemeProvider } from './lib/ZenithThemeContext';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import CopyProtection from './components/CopyProtection';
import { useNdaGate } from './hooks/useNdaGate';
import MobileLayout from './components/MobileLayout';
import AdminGuard from './components/AdminGuard';

// Core pages
import Landing from './pages/Landing.jsx';
import MemberDashboard from './pages/MemberDashboard';
import AccountSettings from './pages/AccountSettings';
import Onboarding from './pages/Onboarding';
import Welcome from './pages/Welcome';
import PaywallPage from './pages/PaywallPage';
import FreeVault from './pages/FreeVault';

// Research & Database
import CodextechDatabase from './pages/CodextechDatabase';
import ResearchModuleDetail from './pages/ResearchModuleDetail';
import PatentSourceDocuments from './pages/PatentSourceDocuments';
import PriorArtArchive from './pages/PriorArtArchive';
import AIResearchAssistant from './pages/AIResearchAssistant';
import ResearchLab from './pages/ResearchLab';
import MyResearch from './pages/MyResearch';

// Build & Invention
import BuildPlansMarketplace from './pages/BuildPlansMarketplace';
import BuildDetail from './pages/BuildDetail';
import BuildSuppliesShop from './pages/BuildSuppliesShop';
import InventionForge from './pages/InventionForge';
import BOMInteractive from './pages/BOMInteractive';
import InventionBuildTracker from './pages/InventionBuildTracker';
import BuildMilestoneAI from './pages/BuildMilestoneAI';

// Patent tools
import PatentDraftingTool from './pages/PatentDraftingTool';
import PatentClaimsGenerator from './pages/PatentClaimsGenerator';
import PatentTracker from './pages/PatentTracker';
import PatentFilingWizard from './pages/PatentFilingWizard';
import PatentDraftingWizard from './pages/PatentDraftingWizard.jsx';
import PatentReview from './pages/PatentReview.jsx';
import PatentIntelligence from './pages/PatentIntelligence.jsx';
import PatentLandscapeGraph from './pages/PatentLandscapeGraph';
import PatentAttorneyChat from './pages/PatentAttorneyChat';
import ProvisionalPatent from './pages/ProvisionalPatent';
import CollabPatentDraft from './pages/CollabPatentDraft';
import FTOAnalysisTool from './pages/FTOAnalysisTool';
import IPPortfolioHealth from './pages/IPPortfolioHealth';

// IP Marketplace & Deals
import IPMarketplace from './pages/IPMarketplace';
import IPMarketplaceDashboard from './pages/IPMarketplaceDashboard';
import InvestorMatchingDashboard from './pages/InvestorMatchingDashboard';
import CoInventorMatching from './pages/CoInventorMatching';
import IPBrokeringGuide from './pages/IPBrokeringGuide';
import VDRPortal from './pages/VDRPortal';
import VDRAdmin from './pages/VDRAdmin';

// Investor tools
import InvestorPortal from './pages/InvestorPortal';
import InvestorOutreachWorkflow from './pages/InvestorOutreachWorkflow';
import InvestorOutreachGuide from './pages/InvestorOutreachGuide';
import InvestorCRM from './pages/InvestorCRM';
import InvestorPackage from './pages/InvestorPackage';
import PitchBuilder from './pages/PitchBuilder';
import PitchDeckBuilder from './pages/PitchDeckBuilder';
import TimelinePitchDeck from './pages/TimelinePitchDeck';
import PitchScript from './pages/PitchScript.jsx';
import VisionFundPitch from './pages/VisionFundPitch';
import SellerTermSheet from './pages/SellerTermSheet';

// Pricing & Checkout
import SaaSPricing from './pages/SaaSPricing';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import PostPurchaseOnboarding from './pages/PostPurchaseOnboarding';
import TripwirePage from './pages/TripwirePage';
import LeadMagnetConfirm from './pages/LeadMagnetConfirm';
import FlashSale from './pages/FlashSale';
import KitBundle from './pages/KitBundle';

// Courses & Learning
import CourseCatalog from './pages/CourseCatalog';
import MyLearning from './pages/MyLearning';
import MyLibrary from './pages/MyLibrary';
import HydromagnetopropulsionCourse from './pages/HydromagnetopropulsionCourse';
import LabSimulation from './pages/LabSimulation';
import ScalarEMLab from './pages/ScalarEMLab';

// Simulations & Labs
import ScalarFieldSim from './pages/ScalarFieldSim';
import ScalarWaveSimulatorPage from './pages/ScalarWaveSimulatorPage';
import ScalarPotentialMap from './pages/ScalarPotentialMap';
import Simulator from './pages/Simulator';

// EMF / Health
import EMFImpact from './pages/EMFImpact';
import EMFExposureLog from './pages/EMFExposureLog';
import EMFProtectionShop from './pages/EMFProtectionShop';
import HeavyMetalDetox from './pages/HeavyMetalDetox';
import HealthAnalytics from './pages/HealthAnalytics';

// Community & social
import CommunityForum from './pages/CommunityForum';
import CreateCommunityPost from './pages/CreateCommunityPost';
import ReferralDashboard from './pages/ReferralDashboard';
import ContestPage from './pages/ContestPage';
import SocialMediaCommand from './pages/SocialMediaCommand';
import SocialMediaAgent from './pages/SocialMediaAgent';
import SocialMediaProfileGen from './pages/SocialMediaProfileGen';

// Profile & Member
import MemberPortal from './pages/MemberPortal';
import MemberVault from './pages/MemberVault';
import MemberProfileSetup from './pages/MemberProfileSetup';
import BetaApply from './pages/BetaApply';


// Other tools
import HybridPortfolio from './pages/HybridPortfolio';
import RDSandbox from './pages/RDSandbox';
import SBIRPipeline from './pages/SBIRPipeline';
import WhiteLabelSaaS from './pages/WhiteLabelSaaS';
import InventionComparison from './pages/InventionComparison';
import InventionDashboard from './pages/InventionDashboard';
import InventionDossierPackage from './pages/InventionDossierPackage';
import DossierWorkspace from './pages/DossierWorkspace';
import ZARPAcquisitionPackage from './pages/ZARPAcquisitionPackage';
import AcquisitionOutreachTracker from './pages/AcquisitionOutreachTracker';
import ValuationAPI from './pages/ValuationAPI';
import BusinessModels from './pages/BusinessModels';
import DeviceKnowledgeGraph from './pages/DeviceKnowledgeGraph';
import PatentTechGraph from './pages/PatentTechGraph';
import DocumentDashboard from './pages/DocumentDashboard';
import IoTDashboard from './pages/IoTDashboard';
import CustomFlow from './pages/CustomFlow';
import TikTokAnalytics from './pages/TikTokAnalytics';
import AcquisitionPitchDeck from './pages/AcquisitionPitchDeck';
import InstitutionalLicensing from './pages/InstitutionalLicensing';
import LicensingPortal from './pages/LicensingPortal';
import PublicPreview from './pages/PublicPreview';
import AlaCarteShop from './pages/AlaCarteShop';
import AlaCarteMenu from './pages/AlaCarteMenu';
import ResearchDisclaimer from './pages/ResearchDisclaimer';
import ResearchMethodology from './pages/ResearchMethodology';
import InventionTimeline from './pages/InventionTimeline';
import InventionLibrary from './pages/InventionLibrary';
import DownloadCenter from './pages/DownloadCenter';
import TroubleshootingGuides from './pages/TroubleshootingGuides';
import BeginnerManual from './pages/BeginnerManual';
import Glossary from './pages/Glossary';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import ZenithApex from './pages/ZenithApex';
import CoursePlan from './pages/CoursePlan';
import MaterialSourcing from './pages/MaterialSourcing.jsx';
import AutismBedCrowdfund from './pages/AutismBedCrowdfund.jsx';
import CaregiversDashboard from './pages/CaregiversDashboard.jsx';
import AdminAutismBedDashboard from './pages/AdminAutismBedDashboard.jsx';
import AutismBedBusinessStrategy from './pages/AutismBedBusinessStrategy.jsx';
import AutismBedVCPitchDeck from './pages/AutismBedVCPitchDeck.jsx';
import MedBedCrowdfund from './pages/MedBedCrowdfund';

// Admin
import AdminHub from './pages/AdminHub';
import AdminMemberAccess from './pages/AdminMemberAccess';
import AdminContest from './pages/AdminContest';
import AdminTierAccess from './pages/AdminTierAccess';
import AdminPromoBlast from './pages/AdminPromoBlast';
import AdminBeta from './pages/AdminBeta';
import AdminVideos from './pages/AdminVideos';
import AdminDownloadCenter from './pages/AdminDownloadCenter';
import VirtualDataRoom from './pages/VirtualDataRoom';
import VDRAuditLog from './pages/VDRAuditLog';
import VDRDocumentGenerator from './pages/VDRDocumentGenerator';
import VDRNdaSign from './pages/VDRNdaSign';
import AcquisitionCRM from './pages/AcquisitionCRM';
import ValuationDashboard from './pages/ValuationDashboard';
import OpportunityMonitor from './pages/OpportunityMonitor';
import MonitoringDashboard from './pages/MonitoringDashboard';
import MarketingPlan from './pages/MarketingPlan';
import TRZPatent from './pages/TRZPatent';
import AdminShopOrders from './pages/AdminShopOrders';
import AdminInventorReviews from './pages/AdminInventorReviews';
import AdminPdfAccess from './pages/AdminPdfAccess';
import AdminNdaSignatures from './pages/AdminNdaSignatures';
import AdminStripeCatalog from './pages/AdminStripeCatalog';
import EmailFunnel from './pages/EmailFunnel';
import ProductLadder from './pages/ProductLadder';
import ViralScripts from './pages/ViralScripts';
import RetentionDashboard from './pages/RetentionDashboard';
import UpsellEngine from './pages/UpsellEngine';
import LeadMagnetSystem from './pages/LeadMagnetSystem';
import RevenueAudit from './pages/RevenueAudit';
import BackgroundImagePicker from './pages/BackgroundImagePicker';
import MasterLaunchDoc from './pages/MasterLaunchDoc';

// Vault
import ScalarVentureHome from './pages/ScalarVentureHome';
import VaultBrowser from './pages/VaultBrowser';
import VaultHeroPage from './pages/VaultHeroPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { loading: ndaLoading } = useNdaGate();

  if (isLoadingPublicSettings || isLoadingAuth || ndaLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <TrialContext.Provider value={{ isTrial: false }}>
      <CopyProtection />
      <Routes>
        <Route element={<MobileLayout />}>
          {/* ── Core ── */}
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<MemberDashboard />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/paywall" element={<PaywallPage />} />
          <Route path="/pricing" element={<SaaSPricing />} />
          <Route path="/subscribe" element={<SaaSPricing />} />
          <Route path="/free-vault" element={<FreeVault />} />

          {/* ── Research & Database ── */}
          <Route path="/codextech-database" element={<CodextechDatabase />} />
          <Route path="/research-module" element={<ResearchModuleDetail />} />
          <Route path="/source-documents" element={<PatentSourceDocuments />} />
          <Route path="/prior-art" element={<PriorArtArchive />} />
          <Route path="/ai-research" element={<AIResearchAssistant />} />
          <Route path="/research-lab" element={<ResearchLab />} />
          <Route path="/my-research" element={<MyResearch />} />
          <Route path="/research-disclaimer" element={<ResearchDisclaimer />} />
          <Route path="/research-methodology" element={<ResearchMethodology />} />

          {/* ── Build & Invention ── */}
          <Route path="/build-plans" element={<BuildPlansMarketplace />} />
          <Route path="/invention-plans" element={<BuildPlansMarketplace />} />
          <Route path="/build/:id" element={<BuildDetail />} />
          <Route path="/build-supplies-shop" element={<BuildSuppliesShop />} />
          <Route path="/inventor-forge" element={<InventionForge />} />
          <Route path="/bom-visualizer" element={<BOMInteractive />} />
          <Route path="/build-milestone-ai" element={<BuildMilestoneAI />} />
          <Route path="/invention-library" element={<InventionLibrary />} />
          <Route path="/invention-timeline" element={<InventionTimeline />} />
          <Route path="/invention-comparison" element={<InventionComparison />} />
          <Route path="/invention-dashboard" element={<InventionDashboard />} />
          <Route path="/invention-dossier" element={<InventionDossierPackage />} />
          <Route path="/dossier-workspace" element={<DossierWorkspace />} />

          {/* ── Patent Tools ── */}
          <Route path="/patent-tool" element={<PatentDraftingTool />} />
          <Route path="/patent-claims-generator" element={<PatentClaimsGenerator />} />
          <Route path="/patent-tracker" element={<PatentTracker />} />
          <Route path="/patent-wizard" element={<PatentFilingWizard />} />
          <Route path="/patent-drafting-wizard" element={<PatentDraftingWizard />} />
          <Route path="/patent-review/:token" element={<PatentReview />} />
          <Route path="/patent-intelligence" element={<PatentIntelligence />} />
          <Route path="/patent-landscape" element={<PatentLandscapeGraph />} />
          <Route path="/patent-attorney-chat" element={<PatentAttorneyChat />} />
          <Route path="/provisional-patent" element={<ProvisionalPatent />} />
          <Route path="/collab-patent-draft" element={<CollabPatentDraft />} />
          <Route path="/fto-analysis" element={<FTOAnalysisTool />} />
          <Route path="/ip-portfolio-health" element={<IPPortfolioHealth />} />
          <Route path="/patent-tech-graph" element={<PatentTechGraph />} />

          {/* ── IP Marketplace ── */}
          <Route path="/ip-marketplace" element={<IPMarketplace />} />
          <Route path="/ip-marketplace/dashboard" element={<IPMarketplaceDashboard />} />
          <Route path="/ip-marketplace/matching" element={<InvestorMatchingDashboard />} />
          <Route path="/co-inventor-matching" element={<CoInventorMatching />} />
          <Route path="/ip-brokering-guide" element={<IPBrokeringGuide />} />
          <Route path="/vdr/:token" element={<VDRPortal />} />

          {/* ── Investors ── */}
          <Route path="/investors" element={<InvestorPortal />} />
          <Route path="/investor-portal" element={<InvestorPortal />} />
          <Route path="/investor-outreach" element={<InvestorOutreachWorkflow />} />
          <Route path="/investor-outreach-guide" element={<InvestorOutreachGuide />} />
          <Route path="/investor-crm" element={<InvestorCRM />} />
          <Route path="/investor-package" element={<InvestorPackage />} />
          <Route path="/pitch" element={<PitchBuilder />} />
          <Route path="/pitch-deck-builder" element={<PitchDeckBuilder />} />
          <Route path="/timeline-pitch" element={<TimelinePitchDeck />} />
          <Route path="/pitch-script" element={<PitchScript />} />
          <Route path="/vision-fund-pitch" element={<VisionFundPitch />} />
          <Route path="/term-sheet" element={<SellerTermSheet />} />
          <Route path="/acquire" element={<AcquisitionPitchDeck />} />
          <Route path="/zarp-acquisition" element={<ZARPAcquisitionPackage />} />
          <Route path="/acquisition-outreach" element={<AcquisitionOutreachTracker />} />
          <Route path="/valuation-api" element={<ValuationAPI />} />

          {/* ── Shop & Checkout ── */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/post-purchase" element={<PostPurchaseOnboarding />} />
          <Route path="/orders" element={<OrderTracking />} />
          <Route path="/tripwire" element={<TripwirePage />} />
          <Route path="/lead-magnet-confirm" element={<LeadMagnetConfirm />} />
          <Route path="/flash-sale" element={<FlashSale />} />
          <Route path="/kit-bundles" element={<KitBundle />} />
          <Route path="/alacarte" element={<AlaCarteShop />} />

          {/* ── Courses & Learning ── */}
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/my-library" element={<MyLibrary />} />
          <Route path="/hydromagnetopropulsion-course" element={<HydromagnetopropulsionCourse />} />
          <Route path="/lab" element={<LabSimulation />} />
          <Route path="/scalar-lab" element={<ScalarEMLab />} />
          <Route path="/course-plan" element={<CoursePlan />} />

          {/* ── Simulators ── */}
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/scalar-sim" element={<ScalarFieldSim />} />
          <Route path="/scalar-wave-sim" element={<ScalarWaveSimulatorPage />} />
          <Route path="/scalar-potential" element={<ScalarPotentialMap />} />

          {/* ── EMF & Health ── */}
          <Route path="/emf-impact" element={<EMFImpact />} />
          <Route path="/emf-log" element={<EMFExposureLog />} />
          <Route path="/emf-shop" element={<EMFProtectionShop />} />
          <Route path="/heavy-metal-detox" element={<HeavyMetalDetox />} />
          <Route path="/health-analytics" element={<HealthAnalytics />} />

          {/* ── Community ── */}
          <Route path="/community" element={<CommunityForum />} />
          <Route path="/community/new" element={<CreateCommunityPost />} />
          <Route path="/referrals" element={<ReferralDashboard />} />
          <Route path="/contest" element={<ContestPage />} />
          <Route path="/social-command" element={<SocialMediaCommand />} />
          <Route path="/social-agent" element={<SocialMediaAgent />} />
          <Route path="/social-profile-gen" element={<SocialMediaProfileGen />} />

          {/* ── Profile & Member ── */}
          <Route path="/member-portal" element={<MemberPortal />} />
          <Route path="/my-vault" element={<MemberVault />} />
          <Route path="/member-profile-setup" element={<MemberProfileSetup />} />
          <Route path="/beta-apply" element={<BetaApply />} />
          <Route path="/licensing" element={<LicensingPortal />} />
          <Route path="/institutional-licensing" element={<InstitutionalLicensing />} />

          {/* ── Misc Tools ── */}
          <Route path="/business" element={<BusinessModels />} />
          <Route path="/device-graph" element={<DeviceKnowledgeGraph />} />
          <Route path="/document-dashboard" element={<DocumentDashboard />} />
          <Route path="/download-center" element={<DownloadCenter />} />
          <Route path="/iot-dashboard" element={<IoTDashboard />} />
          <Route path="/my-flow" element={<CustomFlow />} />
          <Route path="/tiktok-analytics" element={<TikTokAnalytics />} />
          <Route path="/hybrid-portfolio" element={<HybridPortfolio />} />
          <Route path="/rd-sandbox" element={<RDSandbox />} />
          <Route path="/sbir-pipeline" element={<SBIRPipeline />} />
          <Route path="/white-label-saas" element={<WhiteLabelSaaS />} />
          <Route path="/zenith-apex" element={<ZenithApex />} />
          <Route path="/material-sourcing" element={<MaterialSourcing />} />
          <Route path="/autism-bed-crowdfund" element={<AutismBedCrowdfund />} />
          <Route path="/autism-bed-business-strategy" element={<AutismBedBusinessStrategy />} />
          <Route path="/autism-bed-vc-pitch" element={<AutismBedVCPitchDeck />} />
          <Route path="/admin-autism-bed" element={<AdminAutismBedDashboard />} />
          <Route path="/caregiver-dashboard" element={<CaregiversDashboard />} />
          <Route path="/medbed-crowdfund" element={<MedBedCrowdfund />} />

          {/* ── Vault ── */}
          <Route path="/venture" element={<ScalarVentureHome />} />
          <Route path="/vault" element={<VaultHeroPage />} />
          <Route path="/vault-browser" element={<VaultBrowser />} />

          {/* ── Info & Legal ── */}
          <Route path="/troubleshooting" element={<TroubleshootingGuides />} />
          <Route path="/beginner-manual" element={<BeginnerManual />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/preview" element={<PublicPreview />} />

          {/* ── Admin-only ── */}
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
            <Route path="/vdr-nda" element={<VDRNdaSign />} />
            <Route path="/vdr-generator" element={<VDRDocumentGenerator />} />
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
            <Route path="/retention" element={<RetentionDashboard />} />
            <Route path="/upsell-engine" element={<UpsellEngine />} />
            <Route path="/lead-magnets" element={<LeadMagnetSystem />} />
            <Route path="/revenue-audit" element={<RevenueAudit />} />
            <Route path="/bg-picker" element={<BackgroundImagePicker />} />
            <Route path="/master-launch-doc" element={<MasterLaunchDoc />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </TrialContext.Provider>
  );
};

function App() {
  return (
    <ZenithThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ZenithThemeProvider>
  );
}

export default App;