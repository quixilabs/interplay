import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import DashboardHeader from '../Dashboard/DashboardHeader';
import { Search, Download, Eye, Filter, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { AnalyticsService } from '../../services/analyticsService';

interface SurveyResponse {
  sessionId: string;
  timestamp: string;
  demographics: {
    yearInSchool?: string;
    genderIdentity?: string;
    ageRange?: string;
    enrollmentStatus?: string;
  };
  flourishing?: {
    overallScore?: number;
  };
}

export default function SurveyResults() {
  const { adminUser } = useAuthStore();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [sortField, setSortField] = useState<'timestamp' | 'score'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const universitySlug = adminUser?.universitySlug || 'demo-university';
        const data = await AnalyticsService.getSurveyAnalytics(universitySlug);
        
        if (data?.responses) {
          setResponses(data.responses);
        }
      } catch (error) {
        console.error('Failed to fetch survey responses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [adminUser?.universitySlug]);

  const handleSort = (field: 'timestamp' | 'score') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredResponses = responses.filter(response => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      response.sessionId.toLowerCase().includes(searchLower) ||
      response.demographics?.yearInSchool?.toLowerCase().includes(searchLower) ||
      response.demographics?.genderIdentity?.toLowerCase().includes(searchLower)
    );
  });

  const sortedResponses = [...filteredResponses].sort((a, b) => {
    if (sortField === 'timestamp') {
      const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      const aScore = a.flourishing?.overallScore || 0;
      const bScore = b.flourishing?.overallScore || 0;
      return sortDirection === 'asc' ? aScore - bScore : bScore - aScore;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray">
        <DashboardHeader
          universityName={adminUser?.universityName || 'Demo University'}
          dateRange="semester"
          onDateRangeChange={() => {}}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
            <p className="text-warm-gray">Loading survey responses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <DashboardHeader
        universityName={adminUser?.universityName || 'Demo University'}
        dateRange="semester"
        onDateRangeChange={() => {}}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy font-primary mb-2">Survey Responses</h1>
          <p className="text-warm-gray">View and manage individual survey submissions</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-warm-gray/20 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-warm-gray" />
              <input
                type="text"
                placeholder="Search by ID, demographics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-warm-gray/30 rounded-brand focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm border border-warm-gray/30 rounded-brand hover:border-sage/50 transition-colors">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-sage text-white rounded-brand hover:bg-sage-dark transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-warm-gray/20">
            <div>
              <span className="text-sm text-warm-gray">Total Responses:</span>
              <span className="ml-2 text-lg font-semibold text-navy">{responses.length}</span>
            </div>
            <div>
              <span className="text-sm text-warm-gray">Showing:</span>
              <span className="ml-2 text-lg font-semibold text-navy">{filteredResponses.length}</span>
            </div>
          </div>
        </div>

        {/* Responses Table */}
        <div className="bg-white rounded-xl shadow-sm border border-warm-gray/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-gray border-b border-warm-gray/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">
                    Response ID
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider cursor-pointer hover:text-sage"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center gap-1">
                      Date Submitted
                      {sortField === 'timestamp' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">
                    Year in School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider">
                    Gender Identity
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-warm-gray uppercase tracking-wider cursor-pointer hover:text-sage"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center gap-1">
                      Flourishing Score
                      {sortField === 'score' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-warm-gray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray/20">
                {sortedResponses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-warm-gray">No survey responses found</p>
                    </td>
                  </tr>
                ) : (
                  sortedResponses.map((response) => (
                    <tr 
                      key={response.sessionId} 
                      className="hover:bg-sage/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-warm-gray">
                        {response.sessionId.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                        {formatDate(response.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                        {response.demographics?.yearInSchool || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                        {response.demographics?.genderIdentity || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {response.flourishing?.overallScore ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            response.flourishing.overallScore >= 8 
                              ? 'bg-sage/10 text-sage' 
                              : response.flourishing.overallScore >= 6 
                              ? 'bg-warning/10 text-warning' 
                              : 'bg-danger/10 text-danger'
                          }`}>
                            {response.flourishing.overallScore.toFixed(1)}/10
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => setSelectedResponse(response)}
                          className="text-sage hover:text-sage-dark transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Response Detail Modal */}
        {selectedResponse && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-warm-gray/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-navy">Response Details</h2>
                  <button
                    onClick={() => setSelectedResponse(null)}
                    className="text-warm-gray hover:text-navy transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-warm-gray mb-1">Response ID</h3>
                  <p className="text-navy font-mono">{selectedResponse.sessionId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-warm-gray mb-1">Submitted</h3>
                  <p className="text-navy">{formatDate(selectedResponse.timestamp)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-warm-gray mb-2">Demographics</h3>
                  <div className="bg-light-gray p-4 rounded-brand space-y-2">
                    {Object.entries(selectedResponse.demographics).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-warm-gray capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-navy font-medium">{value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedResponse.flourishing?.overallScore && (
                  <div>
                    <h3 className="text-sm font-medium text-warm-gray mb-1">Flourishing Score</h3>
                    <p className="text-2xl font-bold text-sage">
                      {selectedResponse.flourishing.overallScore.toFixed(1)}/10
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

