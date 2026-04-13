import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// Add page imports here
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
import TimelinePitchDeck from './pages/TimelinePitchDeck';
import PriorArtArchive from './pages/PriorArtArchive';
import InvestorPortal from './pages/InvestorPortal';
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
import InventionBuildTracker from './pages/InventionBuildTracker';
import TRZPatent from './pages/TRZPatent';
import CoursePlan from './pages/CoursePlan';
import SocialMediaCommand from './pages/SocialMediaCommand';
import SocialMediaAgent from './pages/SocialMediaAgent';
import AdminHub from './pages/AdminHub';
import AdminGuard from './components/AdminGuard';
import BuildSuppliesShop from './pages/BuildSuppliesShop';
import AdminShopOrders from './pages/AdminShopOrders';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { accepted: ndaAccepted, loading: ndaLoading } = useNdaGate();
  const { paid: hasPaid, loading: paymentLoading } = usePaymentGate();

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
        <Route path="*" element={<LegalAgreement />} />
      </Routes>
    );
  }

  // Redirect to pricing/apply if not paid
  if (!hasPaid) {
    return (
      <Routes>
        <Route path="/beta-apply" element={<BetaApply />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<Pricing />} />
      </Routes>
    );
  }

  // Render the main app
  return (
    <>
      <CopyProtection />
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<ConceptGraph />} />
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
          <Route path="/timeline-pitch" element={<TimelinePitchDeck />} />
          <Route path="/prior-art" element={<PriorArtArchive />} />
          <Route path="/investors" element={<InvestorPortal />} />
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
          <Route path="/investor-portal" element={<InvestorPortal />} />
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

          {/* Admin-only routes */}
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminHub />} />
            <Route path="/admin-beta" element={<AdminBeta />} />
            <Route path="/admin-videos" element={<AdminVideos />} />
            <Route path="/admin-downloads" element={<AdminDownloadCenter />} />
            <Route path="/vdr-admin" element={<VDRAdmin />} />
            <Route path="/acquisition-crm" element={<AcquisitionCRM />} />
            <Route path="/valuation" element={<ValuationDashboard />} />
            <Route path="/opportunity-monitor" element={<OpportunityMonitor />} />
            <Route path="/monitoring" element={<MonitoringDashboard />} />
            <Route path="/marketing" element={<MarketingPlan />} />
            <Route path="/build-tracker" element={<InventionBuildTracker />} />
            <Route path="/trz-patent" element={<TRZPatent />} />
            <Route path="/admin-shop-orders" element={<AdminShopOrders />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
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