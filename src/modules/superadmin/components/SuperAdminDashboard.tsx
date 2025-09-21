import { useState, useEffect } from 'react';
import { Users, Building2, BarChart3, Activity, Plus, Settings, LogOut } from 'lucide-react';
import { SuperAdminUniversityService } from '../services/universityService';
import { SuperAdminDashboardData } from '../types';
import { superAdminAuth } from '../services/superAdminAuth';

interface SuperAdminDashboardProps {
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function SuperAdminDashboard({ onLogout, onNavigate }: SuperAdminDashboardProps) {
  const [dashboardData, setDashboardData] = useState<SuperAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await SuperAdminUniversityService.getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    superAdminAuth.logout();
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Super Admin</h1>
                <p className="text-sm text-slate-600">University Management System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('settings')}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Universities</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {dashboardData?.total_universities || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Universities</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {dashboardData?.active_universities || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Responses</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {dashboardData?.total_responses?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">System Health</p>
                <p className="text-2xl font-bold text-green-600 mt-1">Healthy</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('universities')}
              className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Building2 className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900">Manage Universities</p>
                <p className="text-sm text-blue-600">View, edit, and manage all universities</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('create-university')}
              className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Plus className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-green-900">Add University</p>
                <p className="text-sm text-green-600">Create a new university account</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-purple-900">System Analytics</p>
                <p className="text-sm text-purple-600">View system-wide statistics</p>
              </div>
            </button>
          </div>
        </div>

        {/* Universities by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Universities by Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {dashboardData?.universities_by_status?.active || 0}
              </p>
              <p className="text-sm text-green-700">Active</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {dashboardData?.universities_by_status?.inactive || 0}
              </p>
              <p className="text-sm text-yellow-700">Inactive</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {dashboardData?.universities_by_status?.suspended || 0}
              </p>
              <p className="text-sm text-red-700">Suspended</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}