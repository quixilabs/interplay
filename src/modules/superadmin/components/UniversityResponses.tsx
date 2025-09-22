import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Filter,
  Eye,
  BarChart3,
  Users,
  Calendar,
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SuperAdminUniversityService } from '../services/universityService';
import { UniversityData } from '../types';

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

export default function UniversityResponses({ onNavigate, university }: UniversityResponsesProps) {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('analytics');

  useEffect(() => {
    loadData();
  }, [university.slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [responsesData, analyticsData] = await Promise.all([
        SuperAdminUniversityService.getUniversityResponses(university.slug),
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDemographicSummary = (demographics: any[]) => {
    const demo = demographics[0];
    if (!demo) return 'No demographics';
    
    const parts = [];
    if (demo.year_in_school) parts.push(demo.year_in_school);
    if (demo.gender_identity) parts.push(demo.gender_identity);
    if (demo.age_range) parts.push(demo.age_range);
    
    return parts.join(', ') || 'Demographics available';
  };

  const getFlourishingAverage = (flourishingScores: any[]) => {
    const scores = flourishingScores[0];
    if (!scores) return 'N/A';
    
    const domains = [
      'happiness_satisfaction',
      'mental_physical_health',
      'meaning_purpose',
      'character_virtue',
      'social_relationships',
      'financial_stability'
    ];
    
    let total = 0;
    let count = 0;
    
    domains.forEach(domain => {
      const score1 = scores[`${domain}_1`];
      const score2 = scores[`${domain}_2`];
      if (score1 !== null) { total += score1; count++; }
      if (score2 !== null) { total += score2; count++; }
    });
    
    return count > 0 ? (total / count).toFixed(1) : 'N/A';
  };

  const filteredResponses = responses.filter(response => {
    const searchLower = searchTerm.toLowerCase();
    const demographics = response.demographics[0];
    const sessionId = response.session_id.toLowerCase();
    
    return sessionId.includes(searchLower) ||
           demographics?.year_in_school?.toLowerCase().includes(searchLower) ||
           demographics?.gender_identity?.toLowerCase().includes(searchLower) ||
           demographics?.employment_status?.toLowerCase().includes(searchLower);
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
                <p className="text-sm text-slate-600">Survey Responses</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('analytics')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'analytics' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-1 inline" />
                  Analytics
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="h-4 w-4 mr-1 inline" />
                  Responses
                </button>
              </div>

              <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
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
          <ResponsesListView 
            responses={filteredResponses}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedResponse={selectedResponse}
            onResponseSelect={setSelectedResponse}
          />
        )}
      </main>
    </div>
  );
}

// Analytics View Component
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
                  ? (Object.values(analytics.domainAverages).reduce((a: any, b: any) => a + b, 0) / Object.values(analytics.domainAverages).length).toFixed(1)
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

      {/* Top Enablers and Barriers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Enablers</h3>
          <div className="space-y-3">
            {analytics.topEnablers.slice(0, 5).map((enabler: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-slate-900 font-medium">{enabler.name}</span>
                <span className="text-green-600 font-bold">{enabler.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Barriers</h3>
          <div className="space-y-3">
            {analytics.topBarriers.slice(0, 5).map((barrier: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-slate-900 font-medium">{barrier.name}</span>
                <span className="text-red-600 font-bold">{barrier.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fastest Win Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Suggestions</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {analytics.fastestWinSuggestions.map((suggestion: string, index: number) => (
            <div key={index} className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-700">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Responses List View Component
function ResponsesListView({ 
  responses, 
  searchTerm, 
  onSearchChange, 
  selectedResponse, 
  onResponseSelect 
}: {
  responses: ResponseData[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedResponse: string | null;
  onResponseSelect: (id: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by session ID, year, gender, or employment..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="text-sm text-slate-600">
            {responses.length} responses
          </div>
        </div>
      </div>

      {/* Responses List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Individual Responses</h3>
        </div>
        
        <div className="divide-y divide-slate-200">
          {responses.map((response) => (
            <ResponseRow 
              key={response.session_id}
              response={response}
              isSelected={selectedResponse === response.session_id}
              onSelect={() => onResponseSelect(
                selectedResponse === response.session_id ? null : response.session_id
              )}
            />
          ))}
        </div>

        {responses.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No responses found</h3>
            <p className="text-slate-600">
              {searchTerm ? 'Try adjusting your search terms.' : 'No survey responses have been submitted yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Response Row Component
function ResponseRow({ 
  response, 
  isSelected, 
  onSelect 
}: { 
  response: ResponseData; 
  isSelected: boolean; 
  onSelect: () => void; 
}) {
  const demographics = response.demographics[0];
  const flourishing = response.flourishing_scores[0];
  const wellbeing = response.school_wellbeing[0];
  const textResponses = response.text_responses[0];
  const tensions = response.tensions_assessment[0];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFlourishingAverage = () => {
    if (!flourishing) return 'N/A';
    
    const domains = [
      'happiness_satisfaction',
      'mental_physical_health',
      'meaning_purpose',
      'character_virtue',
      'social_relationships',
      'financial_stability'
    ];
    
    let total = 0;
    let count = 0;
    
    domains.forEach(domain => {
      const score1 = flourishing[`${domain}_1`];
      const score2 = flourishing[`${domain}_2`];
      if (score1 !== null) { total += score1; count++; }
      if (score2 !== null) { total += score2; count++; }
    });
    
    return count > 0 ? (total / count).toFixed(1) : 'N/A';
  };

  return (
    <div className="p-6">
      <div 
        className="cursor-pointer"
        onClick={onSelect}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-medium text-slate-900">
                  Session: {response.session_id.substring(0, 12)}...
                </p>
                <p className="text-sm text-slate-600">
                  Completed: {formatDate(response.completion_time)}
                </p>
              </div>
              
              {demographics && (
                <div className="hidden md:block">
                  <p className="text-sm text-slate-700">
                    {demographics.year_in_school} • {demographics.gender_identity}
                  </p>
                  <p className="text-sm text-slate-500">
                    {demographics.employment_status}
                  </p>
                </div>
              )}

              <div className="hidden lg:block">
                <p className="text-sm text-slate-700">
                  Flourishing: <span className="font-semibold">{getFlourishingAverage()}/10</span>
                </p>
                {response.email_for_results && (
                  <div className="flex items-center text-xs text-slate-500">
                    <Mail className="h-3 w-3 mr-1" />
                    Wants results
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {isSelected ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isSelected && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demographics Details */}
            {demographics && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Demographics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Year:</span>
                    <span className="text-slate-900">{demographics.year_in_school || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Enrollment:</span>
                    <span className="text-slate-900">{demographics.enrollment_status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Age:</span>
                    <span className="text-slate-900">{demographics.age_range || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Employment:</span>
                    <span className="text-slate-900">{demographics.employment_status || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Flourishing Scores */}
            {flourishing && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Flourishing Scores</h4>
                <div className="space-y-2 text-sm">
                  {[
                    { key: 'happiness_satisfaction', label: 'Happiness' },
                    { key: 'mental_physical_health', label: 'Health' },
                    { key: 'meaning_purpose', label: 'Purpose' },
                    { key: 'character_virtue', label: 'Character' },
                    { key: 'social_relationships', label: 'Relationships' },
                    { key: 'financial_stability', label: 'Financial' }
                  ].map(domain => {
                    const score1 = flourishing[`${domain.key}_1`];
                    const score2 = flourishing[`${domain.key}_2`];
                    const avg = (score1 !== null && score2 !== null) ? ((score1 + score2) / 2).toFixed(1) : 'N/A';
                    
                    return (
                      <div key={domain.key} className="flex justify-between">
                        <span className="text-slate-600">{domain.label}:</span>
                        <span className="text-slate-900 font-medium">{avg}/10</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* School Wellbeing */}
            {wellbeing && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">School Wellbeing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Belonging:</span>
                    <span className="text-slate-900">{wellbeing.belonging_score || 'N/A'}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Safety:</span>
                    <span className="text-slate-900">{wellbeing.feel_safe || 'N/A'}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Academic Support:</span>
                    <span className="text-slate-900">{wellbeing.work_connected_goals || 'N/A'}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Emotional Management:</span>
                    <span className="text-slate-900">{wellbeing.manage_emotions || 'N/A'}/10</span>
                  </div>
                </div>
              </div>
            )}

            {/* Text Response */}
            {textResponses?.fastest_win_suggestion && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Fastest Win Suggestion</h4>
                <p className="text-sm text-slate-700 italic">
                  "{textResponses.fastest_win_suggestion}"
                </p>
              </div>
            )}

            {/* Tensions */}
            {tensions && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Tension Balances</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Performance vs Wellbeing:</span>
                    <span className="text-slate-900">{tensions.performance_wellbeing || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ambition vs Contribution:</span>
                    <span className="text-slate-900">{tensions.ambition_contribution || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Self-reliance vs Connection:</span>
                    <span className="text-slate-900">{tensions.selfreliance_connection || 'N/A'}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Enablers and Barriers */}
            {response.user_enablers_barriers.length > 0 && (
              <div className="bg-slate-50 rounded-lg p-4 lg:col-span-2">
                <h4 className="font-semibold text-slate-900 mb-3">Enablers & Barriers by Domain</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {response.user_enablers_barriers.map((eb: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-3">
                      <h5 className="font-medium text-slate-800 mb-2">
                        {eb.domain_key.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h5>
                      {eb.selected_enablers?.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-green-700 mb-1">Enablers:</p>
                          <p className="text-xs text-slate-600">{eb.selected_enablers.join(', ')}</p>
                        </div>
                      )}
                      {eb.selected_barriers?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-red-700 mb-1">Barriers:</p>
                          <p className="text-xs text-slate-600">{eb.selected_barriers.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}