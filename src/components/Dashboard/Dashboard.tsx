import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import DashboardHeader from './DashboardHeader';
import DashboardFilters from './DashboardFilters';
import MetricsOverview from './MetricsOverview';
import FlourishingChart from './FlourishingChart';
import DemographicsAnalysis from './DemographicsAnalysis';
import InterventionMatrix from './InterventionMatrix';
import ActionableInsights from './ActionableInsights';
import SchoolWellbeingTrends from './SchoolWellbeingTrends';
import TensionHeatmap from './TensionHeatmap';
import InsightTiles from './InsightTiles';
import EnablersBarriersBreakdown from './EnablersBarriersBreakdown';
import { AnalyticsService } from '../../services/analyticsService';
import { DemographicsFilters, DEFAULT_FILTERS } from '../../types/filters';

export default function Dashboard() {
  const { adminUser } = useAuthStore();
  const [dateRange, setDateRange] = useState('semester');
  const [selectedDemographic, setSelectedDemographic] = useState('all');
  const [filters, setFilters] = useState<DemographicsFilters>(DEFAULT_FILTERS);
  const [surveyData, setSurveyData] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to filter data based on selected filters
  const filterSurveyData = (data: any, filters: DemographicsFilters) => {
    if (!data?.responses) return data;

    const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0);
    if (!hasActiveFilters) return data;

    const filteredResponses = data.responses.filter((response: any) => {
      const demographics = response.demographics || {};

      return Object.entries(filters).every(([filterKey, selectedValues]) => {
        if (selectedValues.length === 0) return true; // No filter applied for this field

        const responseValue = demographics[filterKey];

        // Handle array fields (like raceEthnicity)
        if (Array.isArray(responseValue)) {
          return selectedValues.some((selectedValue: string) => responseValue.includes(selectedValue));
        }

        // Handle single value fields
        return selectedValues.includes(responseValue);
      });
    });

    return {
      ...data,
      responses: filteredResponses,
      totalResponses: filteredResponses.length
    };
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Use the authenticated user's university slug
        const universitySlug = adminUser?.universitySlug || 'demo-university';
        const data = await AnalyticsService.getSurveyAnalytics(universitySlug);
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
  }, [dateRange, adminUser?.universitySlug]);

  // Apply filters whenever surveyData or filters change
  useEffect(() => {
    if (surveyData) {
      const filtered = filterSurveyData(surveyData, filters);
      setFilteredData(filtered);
    }
  }, [surveyData, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
          <p className="text-warm-gray font-primary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !surveyData) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger mb-4 font-primary">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2 rounded-brand"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <DashboardHeader
        universityName={adminUser?.universityName || 'Demo University'}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-warning/10 border border-warning/30 rounded-brand p-4">
            <p className="text-warning font-primary">
              <strong>Note:</strong> Using demo data. {error}
            </p>
          </div>
        )}

        {/* Dashboard Filters */}
        <DashboardFilters
          filters={filters}
          onFiltersChange={setFilters}
          data={surveyData}
        />

        {/* Key Metrics Overview */}
        <MetricsOverview data={filteredData || surveyData} />

        {/* Primary Visualizations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <FlourishingChart data={filteredData || surveyData} />
          <DemographicsAnalysis
            data={filteredData || surveyData}
            selectedDemographic={selectedDemographic}
            onDemographicChange={setSelectedDemographic}
          />
        </div>

        {/* Tension Heatmap - Our IP Highlight */}
        <div className="mb-8">
          <TensionHeatmap data={filteredData || surveyData} />
        </div>

        {/* Research Insights - Why It Matters */}
        <div className="mb-8">
          <InsightTiles data={filteredData || surveyData} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <InterventionMatrix data={filteredData || surveyData} />
          <ActionableInsights data={filteredData || surveyData} />
        </div>

        {/* Enablers & Barriers Detailed Analysis */}
        <div className="mb-8">
          <EnablersBarriersBreakdown data={filteredData || surveyData} />
        </div>

        {/* School Wellbeing Trends
        <div className="mb-8">
          <SchoolWellbeingTrends data={filteredData || surveyData} />
        </div> */}
      </main>
    </div>
  );
}