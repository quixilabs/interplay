import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { superAdminAuth } from '../services/superAdminAuth';
import { SUPER_ADMIN_CONFIG } from '../config/constants';
import SuperAdminLogin from './SuperAdminLogin';
import SuperAdminDashboard from './SuperAdminDashboard';
import UniversityList from './UniversityList';
import UniversityForm from './UniversityForm';
import UniversityResponses from './UniversityResponses';

export default function SuperAdminRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = superAdminAuth.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();

    // Set up session extension on activity
    const extendSession = () => {
      if (superAdminAuth.isAuthenticated()) {
        superAdminAuth.extendSession();
      }
    };

    // Extend session on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, extendSession, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, extendSession, true);
      });
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
    setSelectedUniversity(null);
  };

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view);
    if (data) {
      setSelectedUniversity(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SuperAdminLogin onLogin={handleLogin} />;
  }

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <SuperAdminDashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
      
      case 'universities':
        return <UniversityList onNavigate={handleNavigate} />;
      
      case 'create-university':
        return <UniversityForm onNavigate={handleNavigate} mode="create" />;
      
      case 'edit-university':
        return (
          <UniversityForm 
            onNavigate={handleNavigate} 
            university={selectedUniversity} 
            mode="edit" 
          />
        );
      
      case 'view-university':
        // You can implement a detailed view component here
        return <UniversityList onNavigate={handleNavigate} />;
      
      case 'view-responses':
        return (
          <UniversityResponses 
            onNavigate={handleNavigate} 
            university={selectedUniversity} 
          />
        );
      
      default:
        return <SuperAdminDashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
    }
  };

  return renderCurrentView();
}