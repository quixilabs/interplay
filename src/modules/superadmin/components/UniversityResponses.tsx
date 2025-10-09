import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  BarChart3,
  Users,
  Heart,
  Brain,
  Target,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  X,
  ArrowUpDown
} from 'lucide-react';
import { SuperAdminUniversityService } from '../services/universityService';
import { UniversityData } from '../types';
import SessionRow from './SessionRow';

interface UniversityResponsesProps {
  onNavigate: (view: string) => void;
  university: UniversityData;
}

interface ResponseData {
  session_id: string;
  completion_time: string;
  email_for_results: string | null;
  demographics: any[];
  flourishing_scores: any[];
  school_wellbeing: any[];
  text_responses: any[];
  tensions_assessment: any[];
  user_enablers_barriers: any[];
}

type FilterStatus = 'all' | 'complete' | 'incomplete' | 'missing_data';
type SortField = 'date' | 'session_id' | 'completion';
type SortDirection = 'asc' | 'desc';

export default function UniversityResponses({ onNavigate, university }: UniversityResponsesProps) {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    loadData();
  }, [university.slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [responsesData, analyticsData] = await Promise.all([
        SuperAdminUniversityService.getUniversityResponses(university.slug, true), // Include incomplete responses
        SuperAdminUniversityService.getUniversityAnalytics(university.slug)
      ]);

      setResponses(responsesData);
      setAnalytics(analyticsData);
      setError(null);
    } catch (err) {
      console.error('Failed to load university data:', err);
      setError('Failed to load survey data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Use the service formatting method for consistent export
    const csvData = responses.map(response =>
      SuperAdminUniversityService.formatSessionForExport(response)
    );

    if (csvData.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => {
        const value = row[header as keyof typeof row];
        // Escape quotes and wrap in quotes
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${university.slug}-survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Helper to check if response has missing data
  const hasMissingData = (response: ResponseData) => {
    const hasFlourishing = response.flourishing_scores && response.flourishing_scores.length > 0;
    const hasWellbeing = response.school_wellbeing && response.school_wellbeing.length > 0;
    const hasTensions = response.tensions_assessment && response.tensions_assessment.length > 0;
    const hasEnablers = response.user_enablers_barriers && response.user_enablers_barriers.length > 0;

    return !hasFlourishing || !hasWellbeing || !hasTensions || !hasEnablers;
  };

  // Calculate data quality metrics
  const dataQualityMetrics = {
    totalSessions: responses.length,
    completedSessions: responses.filter(r => r.completion_time).length,
    incompleteSessions: responses.filter(r => !r.completion_time).length,
    sessionsWithMissingData: responses.filter(hasMissingData).length,
    recentSessions: responses.filter(r => {
      if (!r.completion_time) return false;
      const completionDate = new Date(r.completion_time);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return completionDate >= sevenDaysAgo;
    }).length,
    completionRate: responses.length > 0
      ? Math.round((responses.filter(r => r.completion_time).length / responses.length) * 100)
      : 0,
    mostCommonMissingData: (() => {
      const missing = {
        flourishing: 0,
        wellbeing: 0,
        tensions: 0,
        enablers: 0
      };
      responses.forEach(r => {
        if (!r.flourishing_scores || r.flourishing_scores.length === 0) missing.flourishing++;
        if (!r.school_wellbeing || r.school_wellbeing.length === 0) missing.wellbeing++;
        if (!r.tensions_assessment || r.tensions_assessment.length === 0) missing.tensions++;
        if (!r.user_enablers_barriers || r.user_enablers_barriers.length === 0) missing.enablers++;
      });
      const max = Math.max(...Object.values(missing));
      const key = Object.keys(missing).find(k => missing[k as keyof typeof missing] === max);
      return key ? { type: key, count: max } : null;
    })()
  };

  // Filter and sort responses
  const filteredResponses = responses
    .filter(response => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const demographics = (response.demographics || [])[0];
      const sessionId = response.session_id.toLowerCase();
      const textResponse = (response.text_responses || [])[0];

      const matchesSearch = !searchTerm || (
        sessionId.includes(searchLower) ||
        demographics?.year_in_school?.toLowerCase().includes(searchLower) ||
        demographics?.gender_identity?.toLowerCase().includes(searchLower) ||
        demographics?.employment_status?.toLowerCase().includes(searchLower) ||
        textResponse?.fastest_win_suggestion?.toLowerCase().includes(searchLower)
      );

      // Status filter
      const matchesStatus = (() => {
        switch (filterStatus) {
          case 'complete':
            return !!response.completion_time;
          case 'incomplete':
            return !response.completion_time;
          case 'missing_data':
            return hasMissingData(response);
          default:
            return true;
        }
      })();

      // Date range filter
      const matchesDateRange = (() => {
        if (!dateRange.start && !dateRange.end) return true;
        if (!response.completion_time) return false;

        const completionDate = new Date(response.completion_time);
        if (dateRange.start && new Date(dateRange.start) > completionDate) return false;
        if (dateRange.end && new Date(dateRange.end) < completionDate) return false;
        return true;
      })();

      return matchesSearch && matchesStatus && matchesDateRange;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          const dateA = a.completion_time ? new Date(a.completion_time).getTime() : 0;
          const dateB = b.completion_time ? new Date(b.completion_time).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'session_id':
          comparison = a.session_id.localeCompare(b.session_id);
          break;
        case 'completion':
          const scoreA = a.completion_time ? 1 : 0;
          const scoreB = b.completion_time ? 1 : 0;
          comparison = scoreA - scoreB;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading survey responses...</p>
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
              <button
                onClick={() => onNavigate('universities')}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{university.name}</h1>
                <p className="text-sm text-slate-600">Complete Survey Data</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Users className="h-4 w-4 mr-1 inline" />
                  Student Responses
                </button>
                <button
                  onClick={() => setViewMode('analytics')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'analytics'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <BarChart3 className="h-4 w-4 mr-1 inline" />
                  Analytics
                </button>
              </div>

              <button
                onClick={exportData}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export All Data</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {viewMode === 'analytics' ? (
          <AnalyticsView analytics={analytics} />
        ) : (
          <>
            {/* Data Quality Dashboard */}
            <DataQualityDashboard metrics={dataQualityMetrics} />

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 relative mr-4">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by session ID, demographics, or feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${showFilters ? 'bg-red-50 border-red-200 text-red-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {(filterStatus !== 'all' || dateRange.start || dateRange.end) && (
                    <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {[filterStatus !== 'all', dateRange.start, dateRange.end].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Completion Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">All Sessions</option>
                      <option value="complete">Complete Only</option>
                      <option value="incomplete">Incomplete Only</option>
                      <option value="missing_data">Has Missing Data</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {(filterStatus !== 'all' || dateRange.start || dateRange.end) && (
                <div className="flex items-center flex-wrap gap-2 pt-4 border-t border-slate-200">
                  <span className="text-sm text-slate-600 font-medium">Active filters:</span>
                  {filterStatus !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                      Status: {filterStatus.replace('_', ' ')}
                      <button
                        onClick={() => setFilterStatus('all')}
                        className="ml-2 hover:text-red-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {dateRange.start && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                      From: {dateRange.start}
                      <button
                        onClick={() => setDateRange({ ...dateRange, start: '' })}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {dateRange.end && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                      To: {dateRange.end}
                      <button
                        onClick={() => setDateRange({ ...dateRange, end: '' })}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setDateRange({ start: '', end: '' });
                    }}
                    className="text-sm text-slate-600 hover:text-slate-900 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}

              <div className="text-sm text-slate-600">
                Showing {filteredResponses.length} of {responses.length} sessions
              </div>
            </div>

            {/* Sessions Table */}
            <SessionsTable
              responses={filteredResponses}
              selectedResponse={selectedResponse}
              onResponseSelect={setSelectedResponse}
              sortField={sortField}
              onSort={(field) => {
                if (field === sortField) {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField(field);
                  setSortDirection('desc');
                }
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}

// Data Quality Dashboard Component
function DataQualityDashboard({ metrics }: { metrics: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Sessions</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.totalSessions}</p>
            <p className="text-xs text-slate-500 mt-1">
              {metrics.recentSessions} in last 7 days
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Completion Rate</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.completionRate}%</p>
            <p className="text-xs text-slate-500 mt-1">
              {metrics.completedSessions} complete, {metrics.incompleteSessions} incomplete
            </p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metrics.completionRate >= 80 ? 'bg-green-100' : 'bg-orange-100'
            }`}>
            <CheckCircle2 className={`h-6 w-6 ${metrics.completionRate >= 80 ? 'text-green-600' : 'text-orange-600'
              }`} />
          </div>
        </div>
      </div>

      {/* Missing Data */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Sessions w/ Missing Data</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.sessionsWithMissingData}</p>
            {metrics.mostCommonMissingData && (
              <p className="text-xs text-slate-500 mt-1">
                Most: {metrics.mostCommonMissingData.type} ({metrics.mostCommonMissingData.count})
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Recent Activity</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.recentSessions}</p>
            <p className="text-xs text-slate-500 mt-1">
              Last 7 days
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sessions Table Component
function SessionsTable({
  responses,
  selectedResponse,
  onResponseSelect,
  sortField,
  onSort
}: {
  responses: ResponseData[];
  selectedResponse: string | null;
  onResponseSelect: (id: string | null) => void;
  sortField: SortField;
  onSort: (field: SortField) => void;
}) {
  const exportSingleResponse = (response: ResponseData) => {
    // Use the service formatting method for consistent export
    const formattedData = SuperAdminUniversityService.formatSessionForExport(response);

    const headers = Object.keys(formattedData);
    const csvContent = [
      headers.join(','),
      headers.map(header => {
        const value = formattedData[header as keyof typeof formattedData];
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${response.session_id.substring(0, 20)}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 hover:text-slate-900 transition-colors group"
    >
      <span>{label}</span>
      <ArrowUpDown className={`h-4 w-4 ${sortField === field ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'
        }`} />
    </button>
  );

  if (responses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No sessions found</h3>
        <p className="text-slate-600">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                <SortButton field="session_id" label="Session ID" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                <SortButton field="completion" label="Status" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                <div className="flex items-center space-x-1" title="Flourishing Scores">
                  <Heart className="h-4 w-4 text-red-500" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                <div className="flex items-center space-x-1" title="School Wellbeing">
                  <Shield className="h-4 w-4 text-blue-500" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                <div className="flex items-center space-x-1" title="Tensions">
                  <Zap className="h-4 w-4 text-purple-500" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                <div className="flex items-center space-x-1" title="Enablers/Barriers">
                  <Target className="h-4 w-4 text-orange-500" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                <div className="flex items-center space-x-1" title="Feedback">
                  <Brain className="h-4 w-4 text-indigo-500" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                <SortButton field="date" label="Date" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {responses.map((response) => (
              <SessionRow
                key={response.session_id}
                response={response}
                isSelected={selectedResponse === response.session_id}
                onSelect={() => onResponseSelect(
                  selectedResponse === response.session_id ? null : response.session_id
                )}
                exportSingleResponse={exportSingleResponse}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Enhanced Analytics View
function AnalyticsView({ analytics }: { analytics: any }) {
  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Responses</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{analytics.totalResponses}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Flourishing</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {Object.values(analytics.domainAverages).length > 0
                  ? ((Object.values(analytics.domainAverages) as number[]).reduce((a, b) => a + b, 0) / Object.values(analytics.domainAverages).length).toFixed(1)
                  : 'N/A'
                }
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Top Enabler</p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {analytics.topEnablers[0]?.name || 'None'}
              </p>
              <p className="text-xs text-slate-500">
                {analytics.topEnablers[0]?.count || 0} students
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">+</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Top Barrier</p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {analytics.topBarriers[0]?.name || 'None'}
              </p>
              <p className="text-xs text-slate-500">
                {analytics.topBarriers[0]?.count || 0} students
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">-</span>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Averages */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Flourishing Domain Averages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analytics.domainAverages).map(([domain, average]: [string, any]) => (
            <div key={domain} className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">
                {domain.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' & ')}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">{average}</span>
                <span className="text-sm text-slate-500">/10</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(average / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Year in School</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographicBreakdown.yearInSchool || {}).map(([year, count]: [string, any]) => (
              <div key={year} className="flex items-center justify-between">
                <span className="text-slate-700">{year}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / analytics.totalResponses) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Gender Identity</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographicBreakdown.genderIdentity || {}).map(([gender, count]: [string, any]) => (
              <div key={gender} className="flex items-center justify-between">
                <span className="text-slate-700">{gender}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(count / analytics.totalResponses) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">All Student Suggestions</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {analytics.fastestWinSuggestions.map((suggestion: string, index: number) => (
            <div key={index} className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-slate-700">{suggestion}</p>
            </div>
          ))}
          {analytics.fastestWinSuggestions.length === 0 && (
            <p className="text-slate-500 text-center py-4">No student suggestions available</p>
          )}
        </div>
      </div>
    </div>
  );
}
