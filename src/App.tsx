import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SurveyProvider } from './contexts/SurveyContext';
import SurveyFlow from './components/Survey/SurveyFlow';
import Dashboard from './components/Dashboard/Dashboard';
import AdminLogin from './components/Admin/AdminLogin';
import LandingPage from './components/LandingPage';
import { useAuthStore } from './stores/authStore';

function App() {
  return (
    <SurveyProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/survey/:universitySlug" element={<SurveyFlow />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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