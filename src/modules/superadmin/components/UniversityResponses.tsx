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
  ChevronUp,
  User,
  Heart,
  Brain,
  Target,
  Shield,
  DollarSign,
  Zap
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
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');

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

  const exportData = () => {
    // Create comprehensive CSV export
    const csvData = responses.map(response => {
      const demographics = response.demographics[0] || {};
      const flourishing = response.flourishing_scores[0] || {};
      const wellbeing = response.school_wellbeing[0] || {};
      const tensions = response.tensions_assessment[0] || {};
      const textResponse = response.text_responses[0] || {};
      
      return {
        session_id: response.session_id,
        completion_time: response.completion_time,
        email_for_results: response.email_for_results || '',
        
        // Demographics
        year_in_school: demographics.year_in_school || '',
        enrollment_status: demographics.enrollment_status || '',
        age_range: demographics.age_range || '',
        gender_identity: demographics.gender_identity || '',
        gender_self_describe: demographics.gender_self_describe || '',
        race_ethnicity: demographics.race_ethnicity?.join('; ') || '',
        is_international: demographics.is_international || '',
        employment_status: demographics.employment_status || '',
        has_caregiving_responsibilities: demographics.has_caregiving_responsibilities || '',
        in_greek_organization: demographics.in_greek_organization || '',
        study_mode: demographics.study_mode || '',
        transfer_student: demographics.transfer_student || '',
        
        // Flourishing Scores
        happiness_satisfaction_1: flourishing.happiness_satisfaction_1 || '',
        happiness_satisfaction_2: flourishing.happiness_satisfaction_2 || '',
        mental_physical_health_1: flourishing.mental_physical_health_1 || '',
        mental_physical_health_2: flourishing.mental_physical_health_2 || '',
        meaning_purpose_1: flourishing.meaning_purpose_1 || '',
        meaning_purpose_2: flourishing.meaning_purpose_2 || '',
        character_virtue_1: flourishing.character_virtue_1 || '',
        character_virtue_2: flourishing.character_virtue_2 || '',
        social_relationships_1: flourishing.social_relationships_1 || '',
        social_relationships_2: flourishing.social_relationships_2 || '',
        financial_stability_1: flourishing.financial_stability_1 || '',
        financial_stability_2: flourishing.financial_stability_2 || '',
        
        // School Wellbeing
        belonging_score: wellbeing.belonging_score || '',
        enjoy_school_days: wellbeing.enjoy_school_days || '',
        physical_activity: wellbeing.physical_activity || '',
        feel_safe: wellbeing.feel_safe || '',
        work_connected_goals: wellbeing.work_connected_goals || '',
        contribute_bigger_purpose: wellbeing.contribute_bigger_purpose || '',
        kind_to_others: wellbeing.kind_to_others || '',
        manage_emotions: wellbeing.manage_emotions || '',
        trusted_adult: wellbeing.trusted_adult || '',
        supportive_friends: wellbeing.supportive_friends || '',
        resources_participation: wellbeing.resources_participation || '',
        wellbeing_checklist: wellbeing.wellbeing_checklist?.join('; ') || '',
        
        // Tensions
        performance_wellbeing: tensions.performance_wellbeing || '',
        ambition_contribution: tensions.ambition_contribution || '',
        selfreliance_connection: tensions.selfreliance_connection || '',
        stability_growth: tensions.stability_growth || '',
        academic_creative: tensions.academic_creative || '',
        
        // Text Responses
        fastest_win_suggestion: textResponse.fastest_win_suggestion || '',
        
        // Enablers and Barriers (flattened)
        enablers_barriers: response.user_enablers_barriers.map((eb: any) => 
          `${eb.domain_key}: E[${eb.selected_enablers?.join(', ') || ''}] B[${eb.selected_barriers?.join(', ') || ''}]`
        ).join(' | ')
      };
    });

    // Convert to CSV
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${university.slug}-survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  const filteredResponses = responses.filter(response => {
    const searchLower = searchTerm.toLowerCase();
    const demographics = response.demographics[0];
    const sessionId = response.session_id.toLowerCase();
    const textResponse = response.text_responses[0];
    
    return sessionId.includes(searchLower) ||
           demographics?.year_in_school?.toLowerCase().includes(searchLower) ||
           demographics?.gender_identity?.toLowerCase().includes(searchLower) ||
           demographics?.employment_status?.toLowerCase().includes(searchLower) ||
           textResponse?.fastest_win_suggestion?.toLowerCase().includes(searchLower);
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
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="h-4 w-4 mr-1 inline" />
                  Student Responses
                </button>
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
          <StudentResponsesView 
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

// Enhanced Student Responses List View
function StudentResponsesView({ 
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
              placeholder="Search by session ID, demographics, or student suggestions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="text-sm text-slate-600">
            {responses.length} complete responses
          </div>
        </div>
      </div>

      {/* Responses List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Complete Student Responses</h3>
          <p className="text-sm text-slate-600 mt-1">
            Click on any response to view all answers and demographics (for app improvement purposes)
          </p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {responses.map((response) => (
            <StudentResponseRow 
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

// Enhanced Individual Student Response Row
function StudentResponseRow({ 
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

  const getAtRiskIndicator = () => {
    if (!flourishing) return false;
    
    const domains = [
      'happiness_satisfaction',
      'mental_physical_health',
      'meaning_purpose',
      'character_virtue',
      'social_relationships',
      'financial_stability'
    ];
    
    return domains.some(domain => {
      const score1 = flourishing[`${domain}_1`];
      const score2 = flourishing[`${domain}_2`];
      return (score1 !== null && score1 < 6) || (score2 !== null && score2 < 6);
    });
  };

  const isAtRisk = getAtRiskIndicator();

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
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-slate-900">
                    Session: {response.session_id.substring(0, 12)}...
                  </p>
                  {isAtRisk && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      At Risk
                    </span>
                  )}
                  {response.email_for_results && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Wants Results
                    </span>
                  )}
                </div>
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
                    {demographics.age_range} • {demographics.employment_status}
                  </p>
                </div>
              )}

              <div className="hidden lg:block">
                <p className="text-sm text-slate-700">
                  Flourishing: <span className={`font-semibold ${isAtRisk ? 'text-red-600' : 'text-green-600'}`}>
                    {getFlourishingAverage()}/10
                  </span>
                </p>
                {textResponses?.fastest_win_suggestion && (
                  <p className="text-xs text-slate-500 max-w-48 truncate">
                    "{textResponses.fastest_win_suggestion}"
                  </p>
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

      {/* Expanded Complete Student Data */}
      {isSelected && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="space-y-6">
            {/* Complete Demographics */}
            {demographics && (
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-slate-600 mr-2" />
                  <h4 className="font-semibold text-slate-900">Complete Demographics</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Year in School:</span>
                      <span className="text-slate-900">{demographics.year_in_school || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Enrollment:</span>
                      <span className="text-slate-900">{demographics.enrollment_status || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Age Range:</span>
                      <span className="text-slate-900">{demographics.age_range || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Study Mode:</span>
                      <span className="text-slate-900">{demographics.study_mode || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Gender:</span>
                      <span className="text-slate-900">{demographics.gender_identity || 'Not provided'}</span>
                    </div>
                    {demographics.gender_self_describe && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Self-Describe:</span>
                        <span className="text-slate-900">{demographics.gender_self_describe}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">International:</span>
                      <span className="text-slate-900">{demographics.is_international || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Transfer:</span>
                      <span className="text-slate-900">{demographics.transfer_student || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Employment:</span>
                      <span className="text-slate-900">{demographics.employment_status || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Caregiving:</span>
                      <span className="text-slate-900">{demographics.has_caregiving_responsibilities || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Greek Org:</span>
                      <span className="text-slate-900">{demographics.in_greek_organization || 'Not provided'}</span>
                    </div>
                    {demographics.race_ethnicity && demographics.race_ethnicity.length > 0 && (
                      <div className="col-span-full">
                        <span className="text-slate-600 font-medium">Race/Ethnicity:</span>
                        <span className="text-slate-900 ml-2">{demographics.race_ethnicity.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Complete Flourishing Scores */}
            {flourishing && (
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <h4 className="font-semibold text-slate-900">All Flourishing Scores</h4>
                  <span className="ml-2 text-sm text-slate-600">(Harvard Validated Framework)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'happiness_satisfaction', label: 'Happiness & Life Satisfaction', icon: '😊' },
                    { key: 'mental_physical_health', label: 'Mental & Physical Health', icon: '🧠' },
                    { key: 'meaning_purpose', label: 'Meaning & Purpose', icon: '🎯' },
                    { key: 'character_virtue', label: 'Character & Virtue', icon: '⭐' },
                    { key: 'social_relationships', label: 'Social Relationships', icon: '👥' },
                    { key: 'financial_stability', label: 'Financial Stability', icon: '💰' }
                  ].map(domain => {
                    const score1 = flourishing[`${domain.key}_1`];
                    const score2 = flourishing[`${domain.key}_2`];
                    const avg = (score1 !== null && score2 !== null) ? ((score1 + score2) / 2).toFixed(1) : 'N/A';
                    const isLow = (score1 !== null && score1 < 6) || (score2 !== null && score2 < 6);
                    
                    return (
                      <div key={domain.key} className={`p-4 rounded-lg border-2 ${isLow ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900 flex items-center">
                            <span className="mr-2">{domain.icon}</span>
                            {domain.label}
                          </span>
                          <span className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                            {avg}/10
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Q1: {score1 !== null ? `${score1}/10` : 'N/A'}</span>
                          <span>Q2: {score2 !== null ? `${score2}/10` : 'N/A'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Complete School Wellbeing */}
            {wellbeing && (
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-blue-500 mr-2" />
                  <h4 className="font-semibold text-slate-900">School Wellbeing Scores</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'belonging_score', label: 'Sense of Belonging' },
                    { key: 'enjoy_school_days', label: 'Enjoy School Days' },
                    { key: 'physical_activity', label: 'Physical Activity' },
                    { key: 'feel_safe', label: 'Feel Safe at School' },
                    { key: 'work_connected_goals', label: 'Work Connected to Goals' },
                    { key: 'contribute_bigger_purpose', label: 'Contribute to Purpose' },
                    { key: 'kind_to_others', label: 'Kind to Others' },
                    { key: 'manage_emotions', label: 'Manage Emotions' },
                    { key: 'trusted_adult', label: 'Trusted Adult Available' },
                    { key: 'supportive_friends', label: 'Supportive Friends' },
                    { key: 'resources_participation', label: 'Resources for Participation' }
                  ].map(item => {
                    const score = wellbeing[item.key];
                    const isLow = score !== null && score < 6;
                    
                    return (
                      <div key={item.key} className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="text-sm text-slate-700">{item.label}:</span>
                        <span className={`font-bold ${isLow ? 'text-red-600' : score >= 8 ? 'text-green-600' : 'text-slate-900'}`}>
                          {score !== null ? `${score}/10` : 'N/A'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {wellbeing.wellbeing_checklist && wellbeing.wellbeing_checklist.length > 0 && (
                  <div className="mt-4 p-4 bg-white rounded-lg border">
                    <h5 className="font-medium text-slate-900 mb-2">Wellbeing Checklist Items Selected:</h5>
                    <ul className="text-sm text-slate-700 space-y-1">
                      {wellbeing.wellbeing_checklist.map((item: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-600 mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Complete Tension Assessment */}
            {tensions && (
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Zap className="h-5 w-5 text-purple-500 mr-2" />
                  <h4 className="font-semibold text-slate-900">Tension Assessment Results</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'performance_wellbeing', label: 'Performance vs Well-being', left: 'Performance Focus', right: 'Well-being Focus' },
                    { key: 'ambition_contribution', label: 'Personal Ambition vs Contribution', left: 'Personal Ambition', right: 'Helping Others' },
                    { key: 'selfreliance_connection', label: 'Self-reliance vs Connection', left: 'Independence', right: 'Community Connection' },
                    { key: 'stability_growth', label: 'Stability vs Growth', left: 'Security/Routine', right: 'Growth/Change' },
                    { key: 'academic_creative', label: 'Academic vs Creative', left: 'Academic Focus', right: 'Creative Exploration' }
                  ].map(tension => {
                    const score = tensions[tension.key];
                    
                    return (
                      <div key={tension.key} className="p-4 bg-white rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-slate-900">{tension.label}</span>
                          <span className="text-lg font-bold text-purple-600">
                            {score !== null ? `${score}%` : 'N/A'}
                          </span>
                        </div>
                        {score !== null && (
                          <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>{tension.left}</span>
                            <span>{tension.right}</span>
                          </div>
                        )}
                        {score !== null && (
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Complete Enablers and Barriers by Domain */}
            {response.user_enablers_barriers.length > 0 && (
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Target className="h-5 w-5 text-orange-500 mr-2" />
                  <h4 className="font-semibold text-slate-900">Enablers & Barriers by Domain</h4>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {response.user_enablers_barriers.map((eb: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border">
                      <h5 className="font-medium text-slate-800 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        {eb.domain_key.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' & ')}
                      </h5>
                      
                      {eb.selected_enablers?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-green-700 mb-2 flex items-center">
                            <span className="text-green-600 mr-1">+</span>
                            Enablers Selected ({eb.selected_enablers.length}):
                          </p>
                          <ul className="text-sm text-slate-700 space-y-1">
                            {eb.selected_enablers.map((enabler: string, i: number) => (
                              <li key={i} className="flex items-start">
                                <span className="text-green-500 mr-2 mt-0.5">•</span>
                                {enabler}
                              </li>
                            ))}
                          </ul>
                          {eb.enabler_other_text && (
                            <div className="mt-2 p-2 bg-green-50 rounded border-l-2 border-green-300">
                              <p className="text-sm text-green-800">
                                <strong>Other:</strong> "{eb.enabler_other_text}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {eb.selected_barriers?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-red-700 mb-2 flex items-center">
                            <span className="text-red-600 mr-1">-</span>
                            Barriers Selected ({eb.selected_barriers.length}):
                          </p>
                          <ul className="text-sm text-slate-700 space-y-1">
                            {eb.selected_barriers.map((barrier: string, i: number) => (
                              <li key={i} className="flex items-start">
                                <span className="text-red-500 mr-2 mt-0.5">•</span>
                                {barrier}
                              </li>
                            ))}
                          </ul>
                          {eb.barrier_other_text && (
                            <div className="mt-2 p-2 bg-red-50 rounded border-l-2 border-red-300">
                              <p className="text-sm text-red-800">
                                <strong>Other:</strong> "{eb.barrier_other_text}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {(!eb.selected_enablers || eb.selected_enablers.length === 0) && 
                       (!eb.selected_barriers || eb.selected_barriers.length === 0) && (
                        <p className="text-sm text-slate-500 italic">No enablers or barriers selected for this domain</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Feedback */}
            {textResponses?.fastest_win_suggestion && (
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Brain className="h-5 w-5 text-indigo-500 mr-2" />
                  <h4 className="font-semibold text-slate-900">Student Feedback</h4>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                  <h5 className="font-medium text-slate-900 mb-2">Fastest Win Suggestion:</h5>
                  <p className="text-slate-700 italic">"{textResponses.fastest_win_suggestion}"</p>
                </div>
              </div>
            )}

            {/* Session Information */}
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-slate-500 mr-2" />
                <h4 className="font-semibold text-slate-900">Session Information</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-slate-600">Session ID:</p>
                  <p className="font-mono text-sm text-slate-900">{response.session_id}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-slate-600">Completed:</p>
                  <p className="text-sm text-slate-900">{formatDate(response.completion_time)}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-slate-600">Results Requested:</p>
                  <p className="text-sm text-slate-900">
                    {response.email_for_results ? 'Yes (email provided)' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}