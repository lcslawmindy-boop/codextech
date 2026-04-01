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