import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import ChartTooltip from './ChartTooltip';

interface InterventionMatrixProps {
  data: any;
}

export default function InterventionMatrix({ data }: InterventionMatrixProps) {
  // Use real data from the analytics service
  const interventionAnalysis = data?.interventionAnalysis || {};
  const topEnablers = interventionAnalysis?.topEnablers || [];
  const topBarriers = interventionAnalysis?.topBarriers || [];

  // Combine enablers and barriers for the matrix, treating barriers as high-impact items to address
  const allInterventions = [
    ...topEnablers.map((enabler: any) => ({
      ...enabler,
      type: 'enabler'
    })),
    ...topBarriers.slice(0, 3).map((barrier: any) => ({
      ...barrier,
      type: 'barrier',
      impact: barrier.impact + 1 // Barriers get slightly higher impact scores as they need urgent attention
    }))
  ];

  // Categorize interventions based on percentage and impact
  const categorizeIntervention = (percentage: number, impact: number, type: string) => {
    if (type === 'barrier' && percentage >= 30) return 'Critical Barrier';
    if (percentage >= 50 && impact >= 8.0) return 'High Priority';
    if (percentage >= 50 && impact >= 7.0) return 'Quick Win';
    if (percentage >= 25 || impact >= 7.5) return 'Medium Priority';
    return 'Low Priority';
  };

  const interventionData = allInterventions.map((intervention: any) => ({
    intervention: intervention.name,
    frequency: intervention.percentage || intervention.frequency || 0,
    impact: intervention.impact,
    type: intervention.type,
    category: categorizeIntervention(intervention.percentage || intervention.frequency || 0, intervention.impact, intervention.type)
  }));

  const getColor = (category: string, type?: string) => {
    switch (category) {
      case 'Critical Barrier': return '#dc2626'; // Darker red for barriers
      case 'High Priority': return '#ef4444';
      case 'Quick Win': return '#f59e0b';
      case 'Medium Priority': return type === 'barrier' ? '#f97316' : '#3b82f6'; // Orange for barriers, blue for enablers
      case 'Low Priority': return '#9ca3af';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-lg font-semibold text-slate-900">Enablers & Barriers Priority Matrix</h3>
          <ChartTooltip
            title="How to use this chart"
            content={[
              "This scatter plot maps enablers and barriers by how often students mention them (X-axis) versus their potential impact on flourishing (Y-axis).",
              "Blue dots are enablers to strengthen, while red/orange dots are barriers to address. Top-right quadrant = highest priority (high frequency + high impact).",
              "Items in the bottom-right are 'quick wins' - frequently mentioned but easier to address. Focus on these for immediate improvements."
            ]}
          />
        </div>
        <p className="text-sm text-slate-600">Frequency cited by students vs. potential impact (barriers shown in red/orange)</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            data={interventionData}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="frequency"
              name="frequency"
              unit="%"
              domain={[20, 90]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'Frequency Cited (%)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle' } }}
            />
            <YAxis
              type="number"
              dataKey="impact"
              name="impact"
              domain={[6, 10]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'Potential Impact', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 shadow-lg rounded-lg border max-w-48">
                      <p className="font-medium text-slate-900">{data.intervention}</p>
                      <p className="text-slate-600">Frequency: {data.frequency}%</p>
                      <p className="text-slate-600">Impact: {data.impact}/10</p>
                      <p className="text-xs text-slate-500 capitalize">{data.type}</p>
                      <p className={`text-sm font-medium`} style={{ color: getColor(data.category, data.type) }}>
                        {data.category}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={60} stroke="#94a3b8" strokeDasharray="2 2" />
            <ReferenceLine y={7.5} stroke="#94a3b8" strokeDasharray="2 2" />
            <Scatter
              dataKey="impact"
              fill="#3b82f6"
            >
              {interventionData.map((entry, index) => (
                <Scatter key={index} fill={getColor(entry.category, entry.type)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-red-800 mb-2">Critical Barriers to Address</h4>
          <ul className="space-y-1 text-red-700">
            {interventionData
              .filter(item => item.category === 'Critical Barrier' || (item.type === 'barrier' && item.category === 'High Priority'))
              .slice(0, 2)
              .map((item, index) => (
                <li key={index}>• {item.intervention} ({item.frequency}% cite this barrier)</li>
              ))}
            {interventionData.filter(item => item.category === 'Critical Barrier' || (item.type === 'barrier' && item.category === 'High Priority')).length === 0 && (
              <li>• No critical barriers identified</li>
            )}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-green-800 mb-2">Top Enablers to Strengthen</h4>
          <ul className="space-y-1 text-green-700">
            {interventionData
              .filter(item => item.type === 'enabler')
              .slice(0, 2)
              .map((item, index) => (
                <li key={index}>• {item.intervention} ({item.frequency}% want this enabler)</li>
              ))}
            {interventionData.filter(item => item.type === 'enabler').length === 0 && (
              <li>• No enabler data available yet</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        <p><strong>Matrix Guide:</strong> Blue dots = Enablers to strengthen, Red/Orange dots = Barriers to address. Top-right = High Priority, Bottom-right = Quick Wins</p>
      </div>
    </div>
  );
}