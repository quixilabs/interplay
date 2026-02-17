import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SurveyProvider } from './contexts/SurveyContext';
import SurveyFlow from './components/Survey/SurveyFlow';
import Dashboard from './components/Dashboard/Dashboard';
import AdminLogin from './components/Admin/AdminLogin';
import AdminSettings from './components/Admin/AdminSettings';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsOfService from './components/Legal/TermsOfService';
import { useAuthStore } from './stores/authStore';
import { SuperAdminRouter, SUPER_ADMIN_CONFIG } from './modules/superadmin';

function App() {
  return (
    <SurveyProvider>
      <Router>
        <div className="min-h-screen bg-light-gray font-primary">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/survey/:universitySlug" element={<SurveyFlow />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path={`${SUPER_ADMIN_CONFIG.ADMIN_PATH}/*`} element={<SuperAdminRouter />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </SurveyProvider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default App;