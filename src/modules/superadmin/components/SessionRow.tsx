import {
    Eye,
    Download,
    User,
    Heart,
    Brain,
    Target,
    Shield,
    Zap,
    Mail,
    AlertTriangle
} from 'lucide-react';
import { debugLog } from '../../../utils/debug';

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

interface SessionRowProps {
    response: ResponseData;
    isSelected: boolean;
    onSelect: () => void;
    exportSingleResponse: (response: ResponseData) => void;
}

export default function SessionRow({
    response,
    isSelected,
    onSelect,
    exportSingleResponse
}: SessionRowProps) {
    // Handle both array and object formats from Supabase
    const demographics = Array.isArray(response.demographics)
        ? response.demographics[0]
        : response.demographics;

    const flourishing = Array.isArray(response.flourishing_scores)
        ? response.flourishing_scores[0]
        : response.flourishing_scores;

    const wellbeing = Array.isArray(response.school_wellbeing)
        ? response.school_wellbeing[0]
        : response.school_wellbeing;

    const textResponses = Array.isArray(response.text_responses)
        ? response.text_responses[0]
        : response.text_responses;

    const tensions = Array.isArray(response.tensions_assessment)
        ? response.tensions_assessment[0]
        : response.tensions_assessment;

    const enablersBarriers = Array.isArray(response.user_enablers_barriers)
        ? response.user_enablers_barriers
        : response.user_enablers_barriers ? [response.user_enablers_barriers] : [];

    // Debug logging (remove after fixing)
    if (isSelected) {
        debugLog('Session Data Debug:', {
            session_id: response.session_id,
            demographics_raw: response.demographics,
            demographics_processed: demographics,
            demographics_keys: demographics ? Object.keys(demographics) : 'null',
            flourishing_raw: response.flourishing_scores,
            flourishing_processed: flourishing,
            flourishing_keys: flourishing ? Object.keys(flourishing) : 'null',
        });
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Helper function to check if a section has data
    const getSectionStatus = (data: unknown) => {
        if (!data || data === null || data === undefined) return false;
        if (typeof data !== 'object') return false;
        const keys = Object.keys(data as object);
        return keys.length > 0;
    };

    // More robust check for data existence
    const hasData = (data: unknown): boolean => {
        if (!data) return false;
        if (typeof data !== 'object') return false;
        if (Array.isArray(data)) return data.length > 0;
        return Object.keys(data as object).length > 0;
    };

    const getStatusIcon = (isComplete: boolean) => {
        if (isComplete) {
            return <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">✓</span>
            </div>;
        }
        return <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xs font-bold">✗</span>
        </div>;
    };

    const hasFlourishingData = getSectionStatus(flourishing);
    const hasWellbeingData = getSectionStatus(wellbeing);
    const hasTensionData = getSectionStatus(tensions);
    const hasEnablersData = enablersBarriers.length > 0;
    const hasFeedbackData = textResponses?.fastest_win_suggestion ? true : false;

    // Check if student is at risk (low flourishing scores)
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
        <>
            <tr
                className={`hover:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''} cursor-pointer transition-colors ${isAtRisk ? 'border-l-4 border-l-red-500' : ''}`}
                onClick={onSelect}
            >
                <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-mono text-slate-900">{response.session_id.substring(0, 10)}...</p>
                            {isAtRisk && (
                                <span title="At Risk - Low Flourishing Scores">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                </span>
                            )}
                        </div>
                        {response.email_for_results && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1 w-fit">
                                <Mail className="h-3 w-3 mr-1" />
                                Results Requested
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    {response.completion_time ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Complete
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⋯ Incomplete
                        </span>
                    )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusIcon(hasFlourishingData)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusIcon(hasWellbeingData)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusIcon(hasTensionData)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusIcon(hasEnablersData)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusIcon(hasFeedbackData)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                    {response.completion_time ? formatDate(response.completion_time) : 'In Progress'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect();
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                exportSingleResponse(response);
                            }}
                            className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Export"
                        >
                            <Download className="h-4 w-4" />
                        </button>
                    </div>
                </td>
            </tr>

            {isSelected && (
                <tr>
                    <td colSpan={9} className="bg-slate-50">
                        <div className="p-6 space-y-6">
                            {/* Quick Summary Alert */}
                            {isAtRisk && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-800">At-Risk Student Identified</h4>
                                            <p className="text-sm text-red-700 mt-1">This student has one or more flourishing scores below 6/10. Consider follow-up.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Compact Demographics Display */}
                            {hasData(demographics) ? (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center mb-3">
                                        <User className="h-4 w-4 text-slate-600 mr-2" />
                                        <h4 className="font-semibold text-slate-900 text-sm">Demographics</h4>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <div className="text-xs text-slate-500">Year</div>
                                            <div className="text-sm font-medium text-slate-900">{demographics.year_in_school || '—'}</div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <div className="text-xs text-slate-500">Age</div>
                                            <div className="text-sm font-medium text-slate-900">{demographics.age_range || '—'}</div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <div className="text-xs text-slate-500">Gender</div>
                                            <div className="text-sm font-medium text-slate-900">{demographics.gender_identity || '—'}</div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <div className="text-xs text-slate-500">Enrollment</div>
                                            <div className="text-sm font-medium text-slate-900">{demographics.enrollment_status || '—'}</div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <div className="text-xs text-slate-500">Employment</div>
                                            <div className="text-sm font-medium text-slate-900">{demographics.employment_status || '—'}</div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <div className="text-xs text-slate-500">International</div>
                                            <div className="text-sm font-medium text-slate-900">{demographics.is_international || '—'}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic text-sm">No demographic data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Compact Flourishing Scores with Visual Bars */}
                            {hasData(flourishing) ? (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <Heart className="h-4 w-4 text-red-500 mr-2" />
                                            <h4 className="font-semibold text-slate-900 text-sm">Flourishing Scores</h4>
                                        </div>
                                        <span className="text-xs text-slate-500">(1-10 scale)</span>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { key: 'happiness_satisfaction', label: 'Happiness', icon: '😊' },
                                            { key: 'mental_physical_health', label: 'Mental/Physical', icon: '🧠' },
                                            { key: 'meaning_purpose', label: 'Meaning', icon: '🎯' },
                                            { key: 'character_virtue', label: 'Character', icon: '⭐' },
                                            { key: 'social_relationships', label: 'Social', icon: '👥' },
                                            { key: 'financial_stability', label: 'Financial', icon: '💰' }
                                        ].map(domain => {
                                            const score1 = flourishing[`${domain.key}_1`];
                                            const score2 = flourishing[`${domain.key}_2`];
                                            const hasScore1 = score1 !== null && score1 !== undefined;
                                            const hasScore2 = score2 !== null && score2 !== undefined;
                                            const avg = (hasScore1 && hasScore2) ? ((score1 + score2) / 2) :
                                                hasScore1 ? score1 : hasScore2 ? score2 : 0;
                                            const isLow = (hasScore1 && score1 < 6) || (hasScore2 && score2 < 6);
                                            const avgDisplay = avg > 0 ? avg.toFixed(1) : 'N/A';

                                            return (
                                                <div key={domain.key} className="flex items-center gap-3">
                                                    <span className="text-sm w-6">{domain.icon}</span>
                                                    <span className="text-xs font-medium text-slate-700 w-24">{domain.label}</span>
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all ${isLow ? 'bg-red-500' : avg >= 8 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                                style={{ width: `${(avg / 10) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`text-sm font-bold w-10 text-right ${isLow ? 'text-red-600' : avg >= 8 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                            {avgDisplay}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 flex gap-2">
                                                        <span>Q1:{hasScore1 ? score1 : '—'}</span>
                                                        <span>Q2:{hasScore2 ? score2 : '—'}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Heart className="h-4 w-4 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic text-sm">No flourishing data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Compact School Wellbeing with Mini Bars */}
                            {hasData(wellbeing) ? (
                                wellbeing.assessment_version === 'v2' ? (
                                    // V2: Display checkbox barriers grouped by driver
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <Shield className="h-4 w-4 text-blue-500 mr-2" />
                                                <h4 className="font-semibold text-slate-900 text-sm">Support Barriers (V2)</h4>
                                            </div>
                                            <span className="text-xs text-slate-500">Checkbox Assessment</span>
                                        </div>
                                        
                                        {/* Display barriers grouped by driver */}
                                        <div className="space-y-3">
                                            {/* CARE Driver */}
                                            {(() => {
                                                const careBarriers = [
                                                    { key: 'care_not_understood_supported', label: 'Not understood/supported when struggling' },
                                                    { key: 'care_no_empathy_from_staff', label: 'No empathy from staff' },
                                                    { key: 'care_school_doesnt_care', label: 'School doesn\'t care about students like me' }
                                                ].filter(b => wellbeing[b.key] === true);
                                                const careCount = careBarriers.length;
                                                const careScore = (10 - (careCount * 2.5)).toFixed(1);
                                                
                                                return (
                                                    <div className="bg-red-50 p-3 rounded border border-red-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-medium text-red-900 text-xs">CARE</h5>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-red-700">{careCount}/3 barriers</span>
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${careCount === 0 ? 'bg-green-100 text-green-800' : careCount >= 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                    Score: {careScore}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {careCount > 0 ? (
                                                            <div className="space-y-1">
                                                                {careBarriers.map((barrier, idx) => (
                                                                    <div key={idx} className="flex items-start gap-2">
                                                                        <span className="text-red-600 mt-0.5">✗</span>
                                                                        <span className="text-xs text-red-800">{barrier.label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-red-700 italic">No barriers selected</p>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                            {/* ACCESS Driver */}
                                            {(() => {
                                                const accessBarriers = [
                                                    { key: 'access_hard_find_resources', label: 'Hard to find campus resources' },
                                                    { key: 'access_dont_know_where_help', label: 'Don\'t know where to go for help' },
                                                    { key: 'access_long_appointment_wait', label: 'Long wait for appointments' }
                                                ].filter(b => wellbeing[b.key] === true);
                                                const accessCount = accessBarriers.length;
                                                const accessScore = (10 - (accessCount * 2.5)).toFixed(1);
                                                
                                                return (
                                                    <div className="bg-orange-50 p-3 rounded border border-orange-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-medium text-orange-900 text-xs">ACCESS</h5>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-orange-700">{accessCount}/3 barriers</span>
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${accessCount === 0 ? 'bg-green-100 text-green-800' : accessCount >= 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                    Score: {accessScore}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {accessCount > 0 ? (
                                                            <div className="space-y-1">
                                                                {accessBarriers.map((barrier, idx) => (
                                                                    <div key={idx} className="flex items-start gap-2">
                                                                        <span className="text-orange-600 mt-0.5">✗</span>
                                                                        <span className="text-xs text-orange-800">{barrier.label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-orange-700 italic">No barriers selected</p>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                            {/* GUIDANCE Driver */}
                                            {(() => {
                                                const guidanceBarriers = [
                                                    { key: 'guidance_unsure_direction', label: 'Unsure about academic/career direction' },
                                                    { key: 'guidance_want_help_planning', label: 'Want more help planning next steps' },
                                                    { key: 'guidance_confused_courses', label: 'Confused about which courses to take' }
                                                ].filter(b => wellbeing[b.key] === true);
                                                const guidanceCount = guidanceBarriers.length;
                                                const guidanceScore = (10 - (guidanceCount * 2.5)).toFixed(1);
                                                
                                                return (
                                                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-medium text-blue-900 text-xs">GUIDANCE</h5>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-blue-700">{guidanceCount}/3 barriers</span>
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${guidanceCount === 0 ? 'bg-green-100 text-green-800' : guidanceCount >= 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                    Score: {guidanceScore}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {guidanceCount > 0 ? (
                                                            <div className="space-y-1">
                                                                {guidanceBarriers.map((barrier, idx) => (
                                                                    <div key={idx} className="flex items-start gap-2">
                                                                        <span className="text-blue-600 mt-0.5">✗</span>
                                                                        <span className="text-xs text-blue-800">{barrier.label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-blue-700 italic">No barriers selected</p>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                            {/* TRUST Driver */}
                                            {(() => {
                                                const trustBarriers = [
                                                    { key: 'trust_messages_not_answered', label: 'Messages not answered timely' },
                                                    { key: 'trust_unclear_communication', label: 'Unclear/inconsistent communication' },
                                                    { key: 'trust_bounced_between_offices', label: 'Bounced between offices' }
                                                ].filter(b => wellbeing[b.key] === true);
                                                const trustCount = trustBarriers.length;
                                                const trustScore = (10 - (trustCount * 2.5)).toFixed(1);
                                                
                                                return (
                                                    <div className="bg-purple-50 p-3 rounded border border-purple-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-medium text-purple-900 text-xs">TRUST</h5>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-purple-700">{trustCount}/3 barriers</span>
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${trustCount === 0 ? 'bg-green-100 text-green-800' : trustCount >= 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                    Score: {trustScore}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {trustCount > 0 ? (
                                                            <div className="space-y-1">
                                                                {trustBarriers.map((barrier, idx) => (
                                                                    <div key={idx} className="flex items-start gap-2">
                                                                        <span className="text-purple-600 mt-0.5">✗</span>
                                                                        <span className="text-xs text-purple-800">{barrier.label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-purple-700 italic">No barriers selected</p>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                            {/* CONNECTION Driver */}
                                            {(() => {
                                                const connectionBarriers = [
                                                    { key: 'connection_no_mentor', label: 'No mentor to turn to' },
                                                    { key: 'connection_hard_make_friends', label: 'Hard to make friends' },
                                                    { key: 'connection_not_connected_students', label: 'Not connected to other students' }
                                                ].filter(b => wellbeing[b.key] === true);
                                                const connectionCount = connectionBarriers.length;
                                                const connectionScore = (10 - (connectionCount * 2.5)).toFixed(1);
                                                
                                                return (
                                                    <div className="bg-green-50 p-3 rounded border border-green-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-medium text-green-900 text-xs">CONNECTION</h5>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-green-700">{connectionCount}/3 barriers</span>
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${connectionCount === 0 ? 'bg-green-100 text-green-800' : connectionCount >= 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                    Score: {connectionScore}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {connectionCount > 0 ? (
                                                            <div className="space-y-1">
                                                                {connectionBarriers.map((barrier, idx) => (
                                                                    <div key={idx} className="flex items-start gap-2">
                                                                        <span className="text-green-600 mt-0.5">✗</span>
                                                                        <span className="text-xs text-green-800">{barrier.label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-green-700 italic">No barriers selected</p>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                ) : (
                                    // V1: Display original rating scale format
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <Shield className="h-4 w-4 text-blue-500 mr-2" />
                                                <h4 className="font-semibold text-slate-900 text-sm">School Wellbeing</h4>
                                            </div>
                                            <span className="text-xs text-slate-500">(0-10 scale)</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {[
                                                { key: 'belonging_score', label: 'Belonging' },
                                                { key: 'enjoy_school_days', label: 'Enjoy School' },
                                                { key: 'physical_activity', label: 'Physical Activity' },
                                                { key: 'feel_safe', label: 'Feel Safe' },
                                                { key: 'work_connected_goals', label: 'Goal Connection' },
                                                { key: 'contribute_bigger_purpose', label: 'Bigger Purpose' },
                                                { key: 'kind_to_others', label: 'Kindness' },
                                                { key: 'manage_emotions', label: 'Emotions' },
                                                { key: 'trusted_adult', label: 'Adult Support' },
                                                { key: 'supportive_friends', label: 'Friend Support' },
                                                { key: 'resources_participation', label: 'Resources' }
                                            ].map(item => {
                                                const score = wellbeing[item.key];
                                                const isLow = score !== null && score < 6;
                                                const hasScore = score !== null && score !== undefined;

                                                return (
                                                    <div key={item.key} className="bg-slate-50 p-2 rounded border">
                                                        <div className="text-xs text-slate-600 mb-1 truncate" title={item.label}>{item.label}</div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                {hasScore && (
                                                                    <div
                                                                        className={`h-full ${isLow ? 'bg-red-500' : score >= 8 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                                        style={{ width: `${(score / 10) * 100}%` }}
                                                                    ></div>
                                                                )}
                                                            </div>
                                                            <span className={`text-xs font-bold ${isLow ? 'text-red-600' : score >= 8 ? 'text-green-600' : 'text-slate-900'}`}>
                                                                {hasScore ? score : '—'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {wellbeing.wellbeing_checklist && wellbeing.wellbeing_checklist.length > 0 && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                                <h5 className="font-medium text-blue-900 mb-2 text-xs">Wellbeing Checklist ({wellbeing.wellbeing_checklist.length} selected):</h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {wellbeing.wellbeing_checklist.map((item: string, index: number) => (
                                                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            ) : (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Shield className="h-4 w-4 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic text-sm">No wellbeing data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Compact Tensions Assessment */}
                            {hasData(tensions) ? (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <Zap className="h-4 w-4 text-purple-500 mr-2" />
                                            <h4 className="font-semibold text-slate-900 text-sm">Tensions (0=Left, 100=Right)</h4>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { key: 'performance_wellbeing', left: 'Performance', right: 'Well-being' },
                                            { key: 'ambition_contribution', left: 'Ambition', right: 'Contribution' },
                                            { key: 'selfreliance_connection', left: 'Self-reliance', right: 'Connection' },
                                            { key: 'stability_growth', left: 'Stability', right: 'Growth' },
                                            { key: 'academic_creative', left: 'Academic', right: 'Creative' }
                                        ].map(tension => {
                                            const score = tensions[tension.key];
                                            const hasScore = score !== null && score !== undefined;

                                            return (
                                                <div key={tension.key} className="bg-slate-50 p-2 rounded border">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-medium text-blue-700">{tension.left}</span>
                                                        <span className="text-xs font-bold text-purple-600">
                                                            {hasScore ? `${score}%` : '—'}
                                                        </span>
                                                        <span className="text-xs font-medium text-purple-700">{tension.right}</span>
                                                    </div>
                                                    {hasScore && (
                                                        <div className="relative w-full bg-gradient-to-r from-blue-200 via-purple-200 to-purple-400 rounded-full h-2">
                                                            <div
                                                                className="absolute top-0 h-2 w-1 bg-slate-900 rounded-full shadow-md"
                                                                style={{ left: `${score}%`, transform: 'translateX(-50%)' }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Zap className="h-4 w-4 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic text-sm">No tension data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Compact Enablers and Barriers */}
                            {enablersBarriers.length > 0 ? (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center mb-3">
                                        <Target className="h-4 w-4 text-orange-500 mr-2" />
                                        <h4 className="font-semibold text-slate-900 text-sm">Enablers & Barriers by Domain</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {enablersBarriers.map((eb: any, index: number) => (
                                            <div key={index} className="bg-slate-50 rounded-lg p-3 border">
                                                <h5 className="font-medium text-slate-800 mb-2 text-xs flex items-center">
                                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                                                    {eb.domain_key.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' & ')}
                                                </h5>
                                                <div className="space-y-2">
                                                    {(eb.selected_enablers || []).length > 0 && (
                                                        <div>
                                                            <p className="text-xs font-medium text-green-700 mb-1">+ {(eb.selected_enablers || []).length} Enabler{(eb.selected_enablers || []).length > 1 ? 's' : ''}</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(eb.selected_enablers || []).map((enabler: string, i: number) => (
                                                                    <span key={i} className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                                                        {enabler}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(eb.selected_barriers || []).length > 0 && (
                                                        <div>
                                                            <p className="text-xs font-medium text-red-700 mb-1">- {(eb.selected_barriers || []).length} Barrier{(eb.selected_barriers || []).length > 1 ? 's' : ''}</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(eb.selected_barriers || []).map((barrier: string, i: number) => (
                                                                    <span key={i} className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                                                                        {barrier}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(eb.selected_enablers || []).length === 0 && (eb.selected_barriers || []).length === 0 && (
                                                        <p className="text-xs text-slate-500 italic">No selections</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Target className="h-4 w-4 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic text-sm">No enablers/barriers data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Student Feedback - Compact */}
                            {textResponses?.fastest_win_suggestion ? (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center mb-2">
                                        <Brain className="h-4 w-4 text-indigo-500 mr-2" />
                                        <h4 className="font-semibold text-slate-900 text-sm">Student Suggestion</h4>
                                    </div>
                                    <div className="bg-indigo-50 rounded-lg p-3 border-l-2 border-indigo-400">
                                        <p className="text-sm text-slate-700 italic">"{textResponses.fastest_win_suggestion}"</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Brain className="h-4 w-4 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic text-sm">No feedback provided</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
