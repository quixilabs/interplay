import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SurveyProvider } from './contexts/SurveyContext';
import SurveyFlow from './components/Survey/SurveyFlow';
import Dashboard from './components/Dashboard/Dashboard';
import AdminLogin from './components/Admin/AdminLogin';
import LandingPage from './components/LandingPage';
import { useAuthStore } from './stores/authStore';
import { SuperAdminRouter, SUPER_ADMIN_CONFIG } from './modules/superadmin';

function App() {
  return (
    <SurveyProvider>
      <Router>
        <div className="min-h-screen bg-light-gray font-primary">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/survey/:universitySlug" element={<SurveyFlow />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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