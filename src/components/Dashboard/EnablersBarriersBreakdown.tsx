import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import ChartTooltip from './ChartTooltip';

interface EnablersBarriersBreakdownProps {
    data: any;
}

export default function EnablersBarriersBreakdown({ data }: EnablersBarriersBreakdownProps) {
    const interventionAnalysis = data?.interventionAnalysis || {};
    const domainAnalysis = interventionAnalysis?.domainAnalysis || {};

    if (Object.keys(domainAnalysis).length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-sage mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900">Enablers & Barriers by Domain</h3>
                </div>
                <div className="text-center py-8">
                    <p className="text-slate-500">No enablers and barriers data available. Students need to complete the flourishing section to generate this analysis.</p>
                </div>
            </div>
        );
    }

    // Prepare data for the chart
    const chartData = Object.entries(domainAnalysis).map(([domainKey, analysis]: [string, any]) => ({
        domain: analysis.domainName,
        enablers: analysis.averageEnablerCount,
        barriers: analysis.averageBarrierCount,
        domainKey
    }));

    // Get top enablers and barriers overall
    const topEnablers = interventionAnalysis?.topEnablers?.slice(0, 5) || [];
    const topBarriers = interventionAnalysis?.topBarriers?.slice(0, 5) || [];

    const formatDomainName = (name: string) => {
        if (name.length > 20) {
            return name.substring(0, 17) + '...';
        }
        return name;
    };

    return (
        <div className="space-y-6">
            {/* Domain Overview Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Shield className="h-5 w-5 text-sage mr-2" />
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Enablers & Barriers by Domain</h3>
                            <p className="text-sm text-slate-600">Average number selected per student by flourishing domain</p>
                        </div>
                        <ChartTooltip
                            title="How to use this chart"
                            content={[
                                "This chart shows the average number of enablers (green) and barriers (red) students identified for each flourishing domain.",
                                "Domains with more barriers than enablers need urgent attention. Hover over bars for exact counts.",
                                "The ranked lists below show the most frequently mentioned enablers and barriers across all domains—these are your key action items."
                            ]}
                        />
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-500">Based on {interventionAnalysis.totalResponses || 0} responses</div>
                    </div>
                </div>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="domain"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickFormatter={formatDomainName}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                label={{ value: 'Average Count', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-3 shadow-lg rounded-lg border">
                                                <p className="font-medium text-slate-900 mb-2">{label}</p>
                                                <div className="space-y-1">
                                                    <p className="text-green-600">
                                                        <strong>Enablers:</strong> {payload[0]?.value} avg per student
                                                    </p>
                                                    <p className="text-red-600">
                                                        <strong>Barriers:</strong> {payload[1]?.value} avg per student
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Bar dataKey="enablers" fill="#22c55e" name="Enablers" />
                            <Bar dataKey="barriers" fill="#ef4444" name="Barriers" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Enablers and Barriers Lists */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Enablers */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center mb-4">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-slate-900">Most Needed Enablers</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                        What students most want to help them flourish
                    </p>
                    <div className="space-y-3">
                        {topEnablers.map((enabler: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">{enabler.name}</p>
                                    <p className="text-sm text-green-700">
                                        {enabler.frequency} students ({enabler.percentage}%)
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">#{index + 1}</div>
                                </div>
                            </div>
                        ))}
                        {topEnablers.length === 0 && (
                            <p className="text-slate-500 text-center py-4">No enabler data available yet</p>
                        )}
                    </div>
                </div>

                {/* Top Barriers */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center mb-4">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                        <h3 className="text-lg font-semibold text-slate-900">Biggest Barriers</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                        What students say prevents them from flourishing
                    </p>
                    <div className="space-y-3">
                        {topBarriers.map((barrier: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">{barrier.name}</p>
                                    <p className="text-sm text-red-700">
                                        {barrier.frequency} students ({barrier.percentage}%)
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-red-600">#{index + 1}</div>
                                </div>
                            </div>
                        ))}
                        {topBarriers.length === 0 && (
                            <p className="text-slate-500 text-center py-4">No barrier data available yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommended Actions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Strengthen Top Enablers</h4>
                        {topEnablers.slice(0, 2).map((enabler: any, index: number) => (
                            <p key={index} className="text-sm text-slate-700 mb-1">
                                • Expand "{enabler.name}" programs campus-wide
                            </p>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2">Remove Top Barriers</h4>
                        {topBarriers.slice(0, 2).map((barrier: any, index: number) => (
                            <p key={index} className="text-sm text-slate-700 mb-1">
                                • Address "{barrier.name}" through policy/program changes
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
