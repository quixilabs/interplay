import {
    Eye,
    Download,
    User,
    Heart,
    Brain,
    Target,
    Shield,
    Zap,
    Calendar,
    Mail,
    AlertTriangle
} from 'lucide-react';

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
    const demographics = (response.demographics || [])[0];
    const flourishing = (response.flourishing_scores || [])[0];
    const wellbeing = (response.school_wellbeing || [])[0];
    const textResponses = (response.text_responses || [])[0];
    const tensions = (response.tensions_assessment || [])[0];
    const enablersBarriers = (response.user_enablers_barriers || []);

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
        if (!data) return false;
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

                            {/* Complete Demographics */}
                            {demographics && Object.keys(demographics).length > 0 ? (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center mb-4">
                                        <User className="h-5 w-5 text-slate-600 mr-2" />
                                        <h4 className="font-semibold text-slate-900">Demographics</h4>
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
                                        </div>
                                    </div>
                                    {demographics.race_ethnicity && demographics.race_ethnicity.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <span className="text-slate-600 font-medium">Race/Ethnicity:</span>
                                            <span className="text-slate-900 ml-2">{demographics.race_ethnicity.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic">No demographic data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Complete Flourishing Scores */}
                            {flourishing && Object.keys(flourishing).length > 0 ? (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center mb-4">
                                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                                        <h4 className="font-semibold text-slate-900">Flourishing Scores</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { key: 'happiness_satisfaction', label: 'Happiness & Satisfaction', icon: '😊' },
                                            { key: 'mental_physical_health', label: 'Mental & Physical Health', icon: '🧠' },
                                            { key: 'meaning_purpose', label: 'Meaning & Purpose', icon: '🎯' },
                                            { key: 'character_virtue', label: 'Character & Virtue', icon: '⭐' },
                                            { key: 'social_relationships', label: 'Social Relationships', icon: '👥' },
                                            { key: 'financial_stability', label: 'Financial Stability', icon: '💰' }
                                        ].map(domain => {
                                            const score1 = flourishing[`${domain.key}_1`];
                                            const score2 = flourishing[`${domain.key}_2`];
                                            const hasScore1 = score1 !== null && score1 !== undefined;
                                            const hasScore2 = score2 !== null && score2 !== undefined;
                                            const avg = (hasScore1 && hasScore2) ? ((score1 + score2) / 2).toFixed(1) :
                                                hasScore1 ? score1.toFixed(1) :
                                                    hasScore2 ? score2.toFixed(1) : 'N/A';
                                            const isLow = (hasScore1 && score1 < 6) || (hasScore2 && score2 < 6);

                                            return (
                                                <div key={domain.key} className={`p-4 rounded-lg border-2 ${isLow ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-slate-900 flex items-center text-sm">
                                                            <span className="mr-2">{domain.icon}</span>
                                                            {domain.label}
                                                        </span>
                                                        <span className={`text-xl font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                                                            {avg}/10
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-slate-600">
                                                        <span>Q1: {hasScore1 ? `${score1}/10` : 'N/A'}</span>
                                                        <span>Q2: {hasScore2 ? `${score2}/10` : 'N/A'}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Heart className="h-5 w-5 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic">No flourishing data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Complete School Wellbeing */}
                            {wellbeing && Object.keys(wellbeing).length > 0 ? (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center mb-4">
                                        <Shield className="h-5 w-5 text-blue-500 mr-2" />
                                        <h4 className="font-semibold text-slate-900">School Wellbeing</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {[
                                            { key: 'belonging_score', label: 'Sense of Belonging' },
                                            { key: 'enjoy_school_days', label: 'Enjoy School Days' },
                                            { key: 'physical_activity', label: 'Physical Activity' },
                                            { key: 'feel_safe', label: 'Feel Safe' },
                                            { key: 'work_connected_goals', label: 'Connected to Goals' },
                                            { key: 'contribute_bigger_purpose', label: 'Bigger Purpose' },
                                            { key: 'kind_to_others', label: 'Kind to Others' },
                                            { key: 'manage_emotions', label: 'Manage Emotions' },
                                            { key: 'trusted_adult', label: 'Trusted Adult' },
                                            { key: 'supportive_friends', label: 'Supportive Friends' },
                                            { key: 'resources_participation', label: 'Resources Available' }
                                        ].map(item => {
                                            const score = wellbeing[item.key];
                                            const isLow = score !== null && score < 6;

                                            return (
                                                <div key={item.key} className="flex justify-between items-center p-2 bg-slate-50 rounded border">
                                                    <span className="text-xs text-slate-700">{item.label}:</span>
                                                    <span className={`font-bold text-sm ${isLow ? 'text-red-600' : score >= 8 ? 'text-green-600' : 'text-slate-900'}`}>
                                                        {score !== null ? `${score}/10` : 'N/A'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {wellbeing.wellbeing_checklist && wellbeing.wellbeing_checklist.length > 0 && (
                                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border">
                                            <h5 className="font-medium text-slate-900 mb-2 text-sm">Wellbeing Checklist:</h5>
                                            <ul className="text-xs text-slate-700 space-y-1">
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
                            ) : (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic">No wellbeing data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Tensions Assessment */}
                            {tensions && Object.keys(tensions).length > 0 ? (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center mb-4">
                                        <Zap className="h-5 w-5 text-purple-500 mr-2" />
                                        <h4 className="font-semibold text-slate-900">Tension Assessment</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { key: 'performance_wellbeing', label: 'Performance vs Well-being' },
                                            { key: 'ambition_contribution', label: 'Ambition vs Contribution' },
                                            { key: 'selfreliance_connection', label: 'Self-reliance vs Connection' },
                                            { key: 'stability_growth', label: 'Stability vs Growth' },
                                            { key: 'academic_creative', label: 'Academic vs Creative' }
                                        ].map(tension => {
                                            const score = tensions[tension.key];
                                            const hasScore = score !== null && score !== undefined;

                                            return (
                                                <div key={tension.key} className="p-3 bg-slate-50 rounded-lg border">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-medium text-slate-900 text-sm">{tension.label}</span>
                                                        <span className="text-sm font-bold text-purple-600">
                                                            {hasScore ? `${score}%` : 'N/A'}
                                                        </span>
                                                    </div>
                                                    {hasScore && (
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
                            ) : (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Zap className="h-5 w-5 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic">No tension data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Enablers and Barriers */}
                            {enablersBarriers.length > 0 ? (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center mb-4">
                                        <Target className="h-5 w-5 text-orange-500 mr-2" />
                                        <h4 className="font-semibold text-slate-900">Enablers & Barriers</h4>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {enablersBarriers.map((eb: any, index: number) => (
                                            <div key={index} className="bg-slate-50 rounded-lg p-4 border">
                                                <h5 className="font-medium text-slate-800 mb-3 text-sm">
                                                    {eb.domain_key.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' & ')}
                                                </h5>
                                                {(eb.selected_enablers || []).length > 0 && (
                                                    <div className="mb-2">
                                                        <p className="text-xs font-medium text-green-700 mb-1">✓ Enablers ({(eb.selected_enablers || []).length}):</p>
                                                        <ul className="text-xs text-slate-700 space-y-1">
                                                            {(eb.selected_enablers || []).map((enabler: string, i: number) => (
                                                                <li key={i}>• {enabler}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {(eb.selected_barriers || []).length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-medium text-red-700 mb-1">✗ Barriers ({(eb.selected_barriers || []).length}):</p>
                                                        <ul className="text-xs text-slate-700 space-y-1">
                                                            {(eb.selected_barriers || []).map((barrier: string, i: number) => (
                                                                <li key={i}>• {barrier}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Target className="h-5 w-5 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic">No enablers/barriers data available</p>
                                    </div>
                                </div>
                            )}

                            {/* Student Feedback */}
                            {textResponses?.fastest_win_suggestion ? (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center mb-4">
                                        <Brain className="h-5 w-5 text-indigo-500 mr-2" />
                                        <h4 className="font-semibold text-slate-900">Student Feedback</h4>
                                    </div>
                                    <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                                        <p className="text-sm text-slate-700 italic">"{textResponses.fastest_win_suggestion}"</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                    <div className="flex items-center">
                                        <Brain className="h-5 w-5 text-slate-400 mr-2" />
                                        <p className="text-slate-500 italic">No feedback provided</p>
                                    </div>
                                </div>
                            )}

                            {/* Session Information */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                                <div className="flex items-center mb-4">
                                    <Calendar className="h-5 w-5 text-slate-500 mr-2" />
                                    <h4 className="font-semibold text-slate-900">Session Information</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-50 rounded-lg p-3 border">
                                        <p className="text-xs text-slate-600 mb-1">Session ID:</p>
                                        <p className="font-mono text-xs text-slate-900">{response.session_id}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 border">
                                        <p className="text-xs text-slate-600 mb-1">Completed:</p>
                                        <p className="text-xs text-slate-900">
                                            {response.completion_time ? formatDate(response.completion_time) : 'In Progress'}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 border">
                                        <p className="text-xs text-slate-600 mb-1">Email Requested:</p>
                                        <p className="text-xs text-slate-900">
                                            {response.email_for_results ? 'Yes' : 'No'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
