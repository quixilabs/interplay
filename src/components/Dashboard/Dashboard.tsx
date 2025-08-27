import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import DashboardHeader from './DashboardHeader';
import MetricsOverview from './MetricsOverview';
import FlourishingChart from './FlourishingChart';
import DemographicsAnalysis from './DemographicsAnalysis';
import InterventionMatrix from './InterventionMatrix';
import ActionableInsights from './ActionableInsights';
import { AnalyticsService } from '../../services/analyticsService';

export default function Dashboard() {
  const { adminUser } = useAuthStore();
  const [dateRange, setDateRange] = useState('semester');
  const [selectedDemographic, setSelectedDemographic] = useState('all');
  const [surveyData, setSurveyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await AnalyticsService.getSurveyAnalytics('demo-university');
        setSurveyData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics data');
        // Fallback to mock data if database fails
        const { mockSurveyData } = await import('../../data/mockData');
        setSurveyData(mockSurveyData);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !surveyData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader 
        universityName={adminUser?.universityName || 'Demo University'}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Note:</strong> Using demo data. {error}
            </p>
          </div>
        )}

        {/* Key Metrics Overview */}
        <MetricsOverview data={surveyData} />

        {/* Primary Visualizations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <FlourishingChart data={surveyData} />
          <DemographicsAnalysis 
            data={surveyData} 
            selectedDemographic={selectedDemographic}
            onDemographicChange={setSelectedDemographic}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <InterventionMatrix data={surveyData} />
          <ActionableInsights data={surveyData} />
        </div>
      </main>
    </div>
  );
}