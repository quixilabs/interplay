import { useState } from 'react';
import { AlertTriangle, TrendingUp, Info, Zap } from 'lucide-react';

interface TensionHeatmapProps {
    data: any;
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

    const tensionAnalysis = data?.tensionAnalysis;
    const hasData = tensionAnalysis && tensionAnalysis.crossDomainAnalysis;

    if (!hasData) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                    <Zap className="h-5 w-5 text-sage mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900">Cross-Domain Tension Analysis</h3>
                    <Info className="h-4 w-4 text-slate-400 ml-2" />
                </div>
                <div className="text-center py-8">
                    <p className="text-slate-500">No data available. Students need to complete tension assessments to generate this analysis.</p>
                </div>
            </div>
        );
    }

    const heatmapData = tensionAnalysis?.crossDomainAnalysis || [];

    return (
        <div className="space-y-6">
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
                    {/* Cross-domain tensions */}
                    {heatmapData
                        .filter((t: any) => t.avgGapScore >= 0.2)
                        .sort((a: any, b: any) => b.avgGapScore - a.avgGapScore)
                        .slice(0, 3)
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

                    {heatmapData.filter((t: any) => t.avgGapScore >= 0.2).length === 0 && (
                        <div className="text-center py-4 text-slate-500">
                            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            <p>Great news! No critical tension areas identified in current data.</p>
                            <p className="text-sm mt-1">Students appear to have good balance in their cross-domain tensions.</p>
                        </div>
                    )}
                </div>
            </div>

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
