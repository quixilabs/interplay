import { useState } from 'react';
import { AlertTriangle, TrendingUp, Info, Zap, BarChart3 } from 'lucide-react';

interface TensionHeatmapProps {
    data: any;
}

interface DomainTensionCellProps {
    domainName: string;
    domainKey: string;
    flourishingScore: number;
    enablerCount: number;
    barrierCount: number;
    tensionScore: number;
    studentCount: number;
    onClick: () => void;
}

interface HeatmapCellProps {
    label: string;
    description: string;
    gapScore: number;
    gapPercentage: number;
    studentsWithGap: number;
    totalStudents: number;
    onClick: () => void;
}

function DomainTensionCell({ domainName, flourishingScore, enablerCount, barrierCount, studentCount, onClick }: DomainTensionCellProps) {
    // Calculate tension level based on flourishing score vs enabler/barrier balance
    const expectedEnablers = flourishingScore < 7 ? 3 : flourishingScore < 8 ? 2 : 1; // Lower scores need more enablers
    const enablerGap = Math.max(0, expectedEnablers - enablerCount);

    // Overall tension score: combines low flourishing + high barriers + insufficient enablers
    const overallTension = (
        (10 - flourishingScore) * 0.4 +  // 40% weight for low flourishing
        barrierCount * 0.3 +             // 30% weight for barriers
        enablerGap * 0.3                 // 30% weight for enabler gap
    ) / 10;

    const getTensionColor = (tension: number) => {
        if (tension >= 0.7) return 'bg-red-500 text-white'; // Critical tension
        if (tension >= 0.5) return 'bg-orange-400 text-white'; // High tension
        if (tension >= 0.3) return 'bg-yellow-300 text-slate-800'; // Moderate tension
        return 'bg-green-300 text-slate-800'; // Low tension
    };

    const getTensionLevel = (tension: number) => {
        if (tension >= 0.7) return 'Critical';
        if (tension >= 0.5) return 'High';
        if (tension >= 0.3) return 'Moderate';
        return 'Low';
    };

    return (
        <div
            className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${getTensionColor(overallTension)}`}
            onClick={onClick}
        >
            <div className="text-sm font-semibold mb-2">{domainName}</div>
            <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                    <span className="opacity-80">Flourishing:</span>
                    <span className="font-bold">{flourishingScore.toFixed(1)}/10</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="opacity-80">Enablers:</span>
                    <span className="font-bold">{enablerCount.toFixed(1)} avg</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="opacity-80">Barriers:</span>
                    <span className="font-bold">{barrierCount.toFixed(1)} avg</span>
                </div>
                <div className="flex justify-between items-center border-t pt-1 mt-1">
                    <span className="opacity-80">Tension:</span>
                    <span className="font-bold">{getTensionLevel(overallTension)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="opacity-80">Students:</span>
                    <span className="font-bold">{studentCount}</span>
                </div>
            </div>
        </div>
    );
}

function HeatmapCell({ label, description, gapScore, gapPercentage, studentsWithGap, totalStudents, onClick }: HeatmapCellProps) {
    // Determine color intensity based on gap score
    const getIntensityColor = (gap: number) => {
        if (gap >= 0.4) return 'bg-red-500 text-white'; // Critical gap
        if (gap >= 0.2) return 'bg-orange-400 text-white'; // Moderate gap
        if (gap >= 0) return 'bg-yellow-300 text-slate-800'; // Minor gap
        return 'bg-green-300 text-slate-800'; // No gap/well supported
    };

    const getGapLevel = (gap: number) => {
        if (gap >= 0.4) return 'Critical';
        if (gap >= 0.2) return 'Moderate';
        if (gap >= 0) return 'Minor';
        return 'Supported';
    };

    return (
        <div
            className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${getIntensityColor(gapScore)}`}
            onClick={onClick}
        >
            <div className="text-sm font-semibold mb-2">{label}</div>
            <div className="text-xs mb-2 opacity-90">{description}</div>
            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <span className="text-xs opacity-80">Gap Level:</span>
                    <span className="text-xs font-bold">{getGapLevel(gapScore)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs opacity-80">Students:</span>
                    <span className="text-xs font-bold">{gapPercentage}% ({studentsWithGap}/{totalStudents})</span>
                </div>
            </div>
        </div>
    );
}

export default function TensionHeatmap({ data }: TensionHeatmapProps) {
    const [selectedTension, setSelectedTension] = useState<any>(null);
    const [selectedDomain, setSelectedDomain] = useState<any>(null);

    const flourishingDomains = data?.flourishingDomainAverages || {};
    const interventionAnalysis = data?.interventionAnalysis || {};
    const domainAnalysis = interventionAnalysis?.domainAnalysis || {};
    const tensionAnalysis = data?.tensionAnalysis;

    // Create domain-specific tension analysis
    const createDomainTensionAnalysis = () => {
        const domainTensions: any[] = [];

        Object.entries(flourishingDomains).forEach(([domainKey, flourishingScore]) => {
            const domainData = domainAnalysis[domainKey];
            if (domainData) {
                domainTensions.push({
                    domainKey,
                    domainName: domainData.domainName,
                    flourishingScore: flourishingScore as number,
                    enablerCount: domainData.averageEnablerCount || 0,
                    barrierCount: domainData.averageBarrierCount || 0,
                    studentCount: Object.keys(domainAnalysis).length || 0
                });
            }
        });

        return domainTensions;
    };

    const domainTensions = createDomainTensionAnalysis();
    const hasData = domainTensions.length > 0 || (tensionAnalysis && tensionAnalysis.crossDomainAnalysis);

    if (!hasData) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                    <Zap className="h-5 w-5 text-sage mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900">Flourishing vs. Enablers/Barriers Tension</h3>
                    <Info className="h-4 w-4 text-slate-400 ml-2" />
                </div>
                <div className="text-center py-8">
                    <p className="text-slate-500">No data available. Students need to complete the flourishing section and enablers/barriers to generate this analysis.</p>
                </div>
            </div>
        );
    }

    const heatmapData = tensionAnalysis?.crossDomainAnalysis || [];

    return (
        <div className="space-y-6">
            {/* Domain-Specific Tension Analysis */}
            {domainTensions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <BarChart3 className="h-5 w-5 text-sage mr-2" />
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Flourishing vs. Enablers/Barriers Tension</h3>
                                <p className="text-sm text-slate-600">Domain-specific tension between flourishing scores and enabler/barrier balance</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-500">Based on {data?.totalResponses || 0} student responses</div>
                        </div>
                    </div>

                    {/* Domain Tension Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {domainTensions.map((domain: any, index: number) => (
                            <DomainTensionCell
                                key={index}
                                domainName={domain.domainName}
                                domainKey={domain.domainKey}
                                flourishingScore={domain.flourishingScore}
                                enablerCount={domain.enablerCount}
                                barrierCount={domain.barrierCount}
                                tensionScore={0} // Calculated internally
                                studentCount={domain.studentCount}
                                onClick={() => setSelectedDomain(domain)}
                            />
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center space-x-6 text-xs">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                            <span>Critical Tension</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-orange-400 rounded mr-2"></div>
                            <span>High Tension</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-yellow-300 rounded mr-2"></div>
                            <span>Moderate Tension</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-300 rounded mr-2"></div>
                            <span>Low Tension</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Cross-Domain Analysis (if available) */}
            {heatmapData.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Zap className="h-5 w-5 text-sage mr-2" />
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Cross-Domain Tension Analysis</h3>
                                <p className="text-sm text-slate-600">Complex tensions between competing priorities</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-500">Based on {tensionAnalysis?.totalTensionResponses || 0} tension assessments</div>
                        </div>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {heatmapData.map((tension: any, index: number) => (
                            <HeatmapCell
                                key={index}
                                label={tension.tensionLabel}
                                description={tension.description}
                                gapScore={tension.avgGapScore}
                                gapPercentage={tension.gapPercentage}
                                studentsWithGap={tension.studentsWithGap}
                                totalStudents={tension.totalStudents}
                                onClick={() => setSelectedTension(tension)}
                            />
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center space-x-6 text-xs">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                            <span>Critical Gap</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-orange-400 rounded mr-2"></div>
                            <span>Moderate Gap</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-yellow-300 rounded mr-2"></div>
                            <span>Minor Gap</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-300 rounded mr-2"></div>
                            <span>Well Supported</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Priority Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900">Priority Tension Areas</h3>
                </div>

                <div className="space-y-4">
                    {/* Domain-specific tensions */}
                    {domainTensions
                        .filter((domain: any) => {
                            const enablerGap = Math.max(0, (domain.flourishingScore < 7 ? 3 : domain.flourishingScore < 8 ? 2 : 1) - domain.enablerCount);
                            const overallTension = ((10 - domain.flourishingScore) * 0.4 + domain.barrierCount * 0.3 + enablerGap * 0.3) / 10;
                            return overallTension >= 0.5; // High or Critical tension
                        })
                        .sort((a: any, b: any) => {
                            const tensionA = ((10 - a.flourishingScore) * 0.4 + a.barrierCount * 0.3 + Math.max(0, (a.flourishingScore < 7 ? 3 : a.flourishingScore < 8 ? 2 : 1) - a.enablerCount) * 0.3) / 10;
                            const tensionB = ((10 - b.flourishingScore) * 0.4 + b.barrierCount * 0.3 + Math.max(0, (b.flourishingScore < 7 ? 3 : b.flourishingScore < 8 ? 2 : 1) - b.enablerCount) * 0.3) / 10;
                            return tensionB - tensionA;
                        })
                        .slice(0, 3)
                        .map((domain: any, index: number) => {
                            const enablerGap = Math.max(0, (domain.flourishingScore < 7 ? 3 : domain.flourishingScore < 8 ? 2 : 1) - domain.enablerCount);
                            const overallTension = ((10 - domain.flourishingScore) * 0.4 + domain.barrierCount * 0.3 + enablerGap * 0.3) / 10;

                            return (
                                <div key={index} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 mb-1">{domain.domainName}</h4>
                                            <p className="text-sm text-slate-700 mb-2">
                                                Flourishing score: {domain.flourishingScore.toFixed(1)}/10,
                                                Avg barriers: {domain.barrierCount.toFixed(1)},
                                                Avg enablers: {domain.enablerCount.toFixed(1)}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-orange-700">
                                                    <strong>Action needed:</strong>
                                                    {domain.flourishingScore < 7 ? ' Increase enablers and reduce barriers' :
                                                        domain.barrierCount > domain.enablerCount ? ' Focus on removing barriers' :
                                                            ' Strengthen existing enablers'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-orange-600">
                                                {overallTension >= 0.7 ? 'Critical' : 'High'}
                                            </div>
                                            <div className="text-xs text-slate-500">Tension Level</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    {/* Cross-domain tensions */}
                    {heatmapData
                        .filter((t: any) => t.avgGapScore >= 0.2)
                        .sort((a: any, b: any) => b.avgGapScore - a.avgGapScore)
                        .slice(0, 2)
                        .map((tension: any, index: number) => (
                            <div key={`cross-${index}`} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900 mb-1">{tension.tensionLabel}</h4>
                                        <p className="text-sm text-slate-700 mb-2">{tension.description}</p>
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="text-blue-700">
                                                <strong>{tension.gapPercentage}%</strong> of students show significant gaps
                                            </span>
                                            <span className="text-slate-600">
                                                ({tension.studentsWithGap} out of {tension.totalStudents} students)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-blue-600">
                                            {tension.avgGapScore >= 0.4 ? 'Critical' : 'High'}
                                        </div>
                                        <div className="text-xs text-slate-500">Cross-Domain</div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {domainTensions.filter((domain: any) => {
                        const enablerGap = Math.max(0, (domain.flourishingScore < 7 ? 3 : domain.flourishingScore < 8 ? 2 : 1) - domain.enablerCount);
                        const overallTension = ((10 - domain.flourishingScore) * 0.4 + domain.barrierCount * 0.3 + enablerGap * 0.3) / 10;
                        return overallTension >= 0.5;
                    }).length === 0 && heatmapData.filter((t: any) => t.avgGapScore >= 0.2).length === 0 && (
                            <div className="text-center py-4 text-slate-500">
                                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                <p>Great news! No critical tension areas identified in current data.</p>
                                <p className="text-sm mt-1">Students appear to have good balance between their flourishing and available support.</p>
                            </div>
                        )}
                </div>
            </div>

            {/* Domain Detail Modal */}
            {selectedDomain && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">{selectedDomain.domainName}</h3>
                                    <p className="text-slate-600">Domain-specific tension analysis</p>
                                </div>
                                <button
                                    onClick={() => setSelectedDomain(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-slate-900">{selectedDomain.flourishingScore.toFixed(1)}</div>
                                    <div className="text-sm text-slate-600">Flourishing Score</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-700">{selectedDomain.enablerCount.toFixed(1)}</div>
                                    <div className="text-sm text-slate-600">Avg Enablers</div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-red-700">{selectedDomain.barrierCount.toFixed(1)}</div>
                                    <div className="text-sm text-slate-600">Avg Barriers</div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">Tension Analysis:</h4>
                                <p className="text-blue-800 text-sm">
                                    {selectedDomain.flourishingScore < 7 && selectedDomain.barrierCount > selectedDomain.enablerCount
                                        ? `Critical tension: Low flourishing score combined with more barriers than enablers. Immediate intervention needed.`
                                        : selectedDomain.flourishingScore < 7
                                            ? `Moderate tension: Low flourishing score suggests need for more enablers to support student success.`
                                            : selectedDomain.barrierCount > selectedDomain.enablerCount * 1.5
                                                ? `Barrier-heavy: Despite good flourishing, high barrier count suggests potential future challenges.`
                                                : `Good balance: Flourishing score and enabler/barrier ratio indicate healthy support systems.`
                                    }
                                </p>
                            </div>

                            {/* Top enablers and barriers for this domain */}
                            {domainAnalysis[selectedDomain.domainKey] && (
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-green-800 mb-2">Top Enablers</h4>
                                        <div className="space-y-1">
                                            {Object.entries(domainAnalysis[selectedDomain.domainKey].topEnablers)
                                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                                .slice(0, 3)
                                                .map(([enabler, count], index) => (
                                                    <p key={index} className="text-sm text-slate-700">
                                                        • {enabler} ({count as number} students)
                                                    </p>
                                                ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-red-800 mb-2">Top Barriers</h4>
                                        <div className="space-y-1">
                                            {Object.entries(domainAnalysis[selectedDomain.domainKey].topBarriers)
                                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                                .slice(0, 3)
                                                .map(([barrier, count], index) => (
                                                    <p key={index} className="text-sm text-slate-700">
                                                        • {barrier} ({count as number} students)
                                                    </p>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cross-Domain Tension Modal */}
            {selectedTension && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">{selectedTension.tensionLabel}</h3>
                                    <p className="text-slate-600">{selectedTension.description}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTension(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-slate-900">{selectedTension.gapPercentage}%</div>
                                    <div className="text-sm text-slate-600">Students with significant gaps</div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-slate-900">{selectedTension.avgGapScore.toFixed(2)}</div>
                                    <div className="text-sm text-slate-600">Average gap score</div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">What This Means:</h4>
                                <p className="text-blue-800 text-sm">
                                    {selectedTension.avgGapScore >= 0.4
                                        ? `This represents a critical mismatch between student needs and available support systems. Immediate intervention recommended.`
                                        : selectedTension.avgGapScore >= 0.2
                                            ? `Students in this area show moderate tension between competing priorities. Consider targeted support programs.`
                                            : `This area shows good balance between student needs and institutional support.`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
