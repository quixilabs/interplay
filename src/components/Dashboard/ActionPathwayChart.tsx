import { ActionPathwayData, DomainActionData } from '../../types/actionPathway';
import ChartTooltip from './ChartTooltip';

interface ActionPathwayChartProps {
    data: any;
}

interface DomainRowProps {
    domain: DomainActionData;
}

// Individual domain row component
function DomainRow({ domain }: DomainRowProps) {
    const { domainLabel, criticality, topEnabler, topBarrier, averageScore } = domain;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            {/* Domain Card with Criticality Color */}
            <div
                className="rounded-lg p-4 shadow-sm border"
                style={{
                    backgroundColor: criticality.bgColor,
                    borderColor: criticality.color
                }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h4
                            className="font-semibold text-sm mb-1"
                            style={{ color: criticality.color }}
                        >
                            {domainLabel}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span
                                className="text-xs font-medium px-2 py-1 rounded"
                                style={{
                                    backgroundColor: criticality.color,
                                    color: 'white'
                                }}
                            >
                                {criticality.label}
                            </span>
                            <span className="text-xs text-slate-600">
                                Avg: {averageScore.toFixed(1)}/10
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Enabler */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-xs font-medium text-green-800 mb-1">Top Enabler</div>
                <div className="text-sm text-green-900">{topEnabler}</div>
            </div>

            {/* Top Barrier */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="text-xs font-medium text-red-800 mb-1">Top Barrier</div>
                <div className="text-sm text-red-900">{topBarrier}</div>
            </div>
        </div>
    );
}

// Legend component
function CriticalityLegend() {
    const levels = [
        { level: 4, label: 'Critical', color: '#EF4444', icon: '🔴' },
        { level: 3, label: 'Priority', color: '#F97316', icon: '🟠' },
        { level: 2, label: 'Watch', color: '#EAB308', icon: '🟡' },
        { level: 1, label: 'Informational', color: '#22C55E', icon: '🟢' }
    ];

    return (
        <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-600 mb-3">Criticality Levels</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {levels.map(level => (
                    <div key={level.level} className="flex items-center gap-2">
                        <span className="text-lg">{level.icon}</span>
                        <div>
                            <div className="text-xs font-medium" style={{ color: level.color }}>
                                Level {level.level} - {level.label}
                            </div>
                            <div className="text-xs text-slate-500">
                                {level.level === 4 && '< 5.0'}
                                {level.level === 3 && '5.0 - 6.49'}
                                {level.level === 2 && '6.5 - 7.99'}
                                {level.level === 1 && '≥ 8.0'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ActionPathwayChart({ data }: ActionPathwayChartProps) {
    const actionPathwayData: ActionPathwayData | undefined = data?.actionPathwayData;

    // Loading state
    if (!actionPathwayData) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Action Pathway</h3>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-blue-500 mx-auto mb-2"></div>
                        <p className="text-sm text-slate-500">Loading action pathway data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (actionPathwayData.domains.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Action Pathway</h3>
                <p className="text-sm text-slate-600 mb-4">
                    Prioritized domains with top enablers and barriers
                </p>
                <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-slate-400 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-slate-600 font-medium mb-1">No Data Available</p>
                        <p className="text-sm text-slate-500">
                            Student responses are needed to generate the action pathway.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">Action Pathway</h3>
                    <ChartTooltip
                        title="How to use this chart"
                        content={[
                            "Domains are sorted from highest to lowest priority based on average flourishing scores (Critical < 5.0, Priority 5.0-6.49, Watch 6.5-7.99, Informational ≥ 8.0).",
                            "Focus your interventions on Critical and Priority domains first. The colors (red, orange, yellow, green) indicate urgency levels.",
                            "For each domain, you can see the top enabler students want and the top barrier they face. Use this to guide program development and resource allocation."
                        ]}
                    />
                </div>
                <p className="text-sm text-slate-600">
                    Domains ranked by criticality with most common enablers and barriers
                </p>
                <div className="mt-2 text-xs text-slate-500">
                    Based on {actionPathwayData.totalResponses} student{actionPathwayData.totalResponses !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 px-2">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Criticality of Domains
                </div>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Top Enabler
                </div>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Top Barrier
                </div>
            </div>

            {/* Domain Rows */}
            <div className="space-y-2">
                {actionPathwayData.domains.map(domain => (
                    <DomainRow key={domain.domainKey} domain={domain} />
                ))}
            </div>

            {/* Legend */}
            <CriticalityLegend />
        </div>
    );
}

