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
import ZenithApex from './pages/ZenithApex';
import ScalarFieldSim from './pages/ScalarFieldSim';
import BrandArchitecture from './pages/BrandArchitecture';
import EMFExposureLog from './pages/EMFExposureLog';
import EMFProtectionShop from './pages/EMFProtectionShop';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { accepted: ndaAccepted, loading: ndaLoading } = useNdaGate();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth || ndaLoading) {
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

  // Render the main app
  return (
    <>
      <CopyProtection />
      <Routes>
        <Route path="/" element={<ConceptGraph />} />
        <Route path="/business" element={<BusinessModels />} />
        <Route path="/pitch" element={<PitchBuilder />} />
        <Route path="/market-deck" element={<MarketDeck />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/my-research" element={<MyResearch />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/marketing" element={<MarketingPlan />} />
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
        <Route path="/monitoring" element={<MonitoringDashboard />} />
        <Route path="/patent-wizard" element={<PatentFilingWizard />} />
        <Route path="/investor-crm" element={<InvestorCRM />} />
        <Route path="/zenith-apex" element={<ZenithApex />} />
        <Route path="/scalar-sim" element={<ScalarFieldSim />} />
        <Route path="/brand" element={<BrandArchitecture />} />
        <Route path="/emf-shop" element={<EMFProtectionShop />} />
        <Route path="/emf-log" element={<EMFExposureLog />} />
        <Route path="/investor-portal" element={<InvestorPortal />} />
        <Route path="*" element={<PageNotFound />} />
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