import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import DashboardHeader from './DashboardHeader';
import DashboardFilters from './DashboardFilters';
import MetricsOverview from './MetricsOverview';
import SupportDriverTiles from './SupportDriverTiles';
import FlourishingChart from './FlourishingChart';
import ActionPathwayChart from './ActionPathwayChart';
import AtRiskGroupsList from './AtRiskGroupsList';
import KeyInsights from './KeyInsights';
import StudentSuggestions from './StudentSuggestions';
import TensionHeatmap from './TensionHeatmap';
import InsightTiles from './InsightTiles';
import EnablersBarriersBreakdown from './EnablersBarriersBreakdown';
import { AnalyticsService } from '../../services/analyticsService';
import { DemographicsFilters, DEFAULT_FILTERS } from '../../types/filters';

export default function Dashboard() {
  const { adminUser } = useAuthStore();
  const [dateRange, setDateRange] = useState('semester');
  const [filters, setFilters] = useState<DemographicsFilters>(DEFAULT_FILTERS);
  const [surveyData, setSurveyData] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to recalculate domain averages from filtered data
  const calculateFlourishingDomainAverages = (data: any[]) => {
    if (data.length === 0) return {};

    const domains = [
      'happiness_satisfaction',
      'mental_physical_health',
      'meaning_purpose',
      'character_virtue',
      'social_relationships',
      'financial_stability'
    ];

    const averages: any = {};

    domains.forEach(domain => {
      const scores1 = data.map(d => d[`${domain}_1`]).filter(s => s !== null && s !== undefined);
      const scores2 = data.map(d => d[`${domain}_2`]).filter(s => s !== null && s !== undefined);
      const allScores = [...scores1, ...scores2];

      if (allScores.length > 0) {
        averages[domain] = Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10;
      }
    });

    return averages;
  };

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

    // Extract flourishing data from filtered responses to recalculate overall score
    const filteredFlourishingData = filteredResponses
      .filter((response: any) => response.flourishing) // Filter out responses without flourishing data
      .map((response: any) => ({
        ...response.flourishing,
        session_id: response.sessionId
      }));

    // Recalculate overall flourishing score with filtered data
    const recalculatedFlourishingScore = AnalyticsService.calculateOverallFlourishingScore(filteredFlourishingData);

    // Recalculate flourishing domain averages
    const recalculatedDomainAverages = calculateFlourishingDomainAverages(filteredFlourishingData);

    // Recalculate students at risk (students below threshold)
    const atRiskCount = AnalyticsService.calculateAtRiskStudents(filteredFlourishingData);
    const recalculatedStudentsAtRisk = filteredResponses.length > 0
      ? Math.round((atRiskCount / filteredResponses.length) * 100)
      : 0;

    // Recalculate action pathway data with filtered data
    const filteredEnablersBarriers = filteredResponses
      .filter((response: any) => response.enablersBarriers)
      .flatMap((response: any) => response.enablersBarriers);

    const recalculatedActionPathway = AnalyticsService.calculateActionPathwayPublic(
      filteredFlourishingData,
      filteredEnablersBarriers
    );

    // Recalculate Growth Index Score with filtered data
    const filteredWellbeingData = filteredResponses
      .filter((response: any) => response.schoolWellbeing)
      .map((response: any) => response.schoolWellbeing);

    const recalculatedGrowthIndexScore = AnalyticsService.calculateGrowthIndexScorePublic(filteredWellbeingData);

    // Recalculate driver scores with filtered data
    const recalculatedDriverScores = AnalyticsService.calculateDriverScoresPublic(filteredWellbeingData);

    return {
      ...data,
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      overallFlourishingScore: recalculatedFlourishingScore,
      flourishingDomainAverages: recalculatedDomainAverages,
      studentsAtRisk: recalculatedStudentsAtRisk,
      actionPathwayData: recalculatedActionPathway,
      growthIndexScore: recalculatedGrowthIndexScore,
      driverScores: recalculatedDriverScores
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
        <section id="metrics">
          <MetricsOverview data={filteredData || surveyData} />
        </section>

        {/* Primary Visualizations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <section id="flourishing" className="flex">
            <FlourishingChart data={filteredData || surveyData} />
          </section>
          <section id="at-risk-groups" className="flex">
            <AtRiskGroupsList data={filteredData || surveyData} />
          </section>
        </div>

        {/* Growth Index Score Card */}
        <section id="growth-index">
          <SupportDriverTiles driverScores={(filteredData || surveyData)?.driverScores} />
        </section>

        {/* Conditions for Success - Critical Action Path */}
        <section id="action-pathway" className="mb-8">
          <ActionPathwayChart data={filteredData || surveyData} />
        </section>

        {/* Tension Heatmap - Our IP Highlight */}
        <section id="tensions" className="mb-8">
          <TensionHeatmap data={filteredData || surveyData} />
        </section>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <section id="key-insights">
            <KeyInsights data={filteredData || surveyData} />
          </section>
          <section id="student-voice">
            <StudentSuggestions data={filteredData || surveyData} />
          </section>
        </div>

        {/* Enablers & Barriers Detailed Analysis */}
        <section id="enablers-barriers" className="mb-8">
          <EnablersBarriersBreakdown data={filteredData || surveyData} />
        </section>

        {/* Research Insights - Why It Matters */}
        <section id="insights" className="mb-8">
          <InsightTiles data={filteredData || surveyData} />
        </section>

        {/* School Wellbeing Trends
        <div className="mb-8">
          <SchoolWellbeingTrends data={filteredData || surveyData} />
        </div> */}
      </main>
    </div>
  );
}