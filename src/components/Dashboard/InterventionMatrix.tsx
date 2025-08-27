import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface InterventionMatrixProps {
  data: any;
}

export default function InterventionMatrix({ data }: InterventionMatrixProps) {
  // Use real data from the analytics service
  const topInterventions = data?.topInterventions || [];
  
  // Categorize interventions based on frequency and impact
  const categorizeIntervention = (frequency: number, impact: number) => {
    if (frequency >= 60 && impact >= 8.0) return 'High Priority';
    if (frequency >= 60 && impact >= 7.0) return 'Quick Win';
    if (frequency >= 40 || impact >= 7.5) return 'Medium Priority';
    return 'Low Priority';
  };

  const interventionData = topInterventions.map((intervention: any) => ({
    intervention: intervention.name,
    frequency: intervention.frequency,
    impact: intervention.impact,
    category: categorizeIntervention(intervention.frequency, intervention.impact)
  }));

  const getColor = (category: string) => {
    switch (category) {
      case 'High Priority': return '#ef4444';
      case 'Quick Win': return '#f59e0b';
      case 'Medium Priority': return '#3b82f6';
      case 'Low Priority': return '#9ca3af';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Intervention Priority Matrix</h3>
        <p className="text-sm text-slate-600">Frequency cited by students vs. potential impact score</p>
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
                      <p className={`text-sm font-medium`} style={{ color: getColor(data.category) }}>
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
              fill={(entry: any) => getColor(entry.category)}
            >
              {interventionData.map((entry, index) => (
                <Scatter key={index} fill={getColor(entry.category)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-red-800 mb-2">High Priority Actions</h4>
          <ul className="space-y-1 text-red-700">
            {interventionData
              .filter(item => item.category === 'High Priority')
              .slice(0, 2)
              .map((item, index) => (
                <li key={index}>• {item.intervention} ({item.frequency}% frequency, {item.impact} impact)</li>
              ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Quick Wins</h4>
          <ul className="space-y-1 text-orange-700">
            {interventionData
              .filter(item => item.category === 'Quick Win')
              .slice(0, 2)
              .map((item, index) => (
                <li key={index}>• {item.intervention} ({item.frequency}% frequency, {item.impact} impact)</li>
              ))}
            {interventionData.filter(item => item.category === 'Quick Win').length === 0 && (
              <li>• No quick wins identified with current data</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        <p><strong>Matrix Guide:</strong> Top-right quadrant = High Priority, Bottom-right = Quick Wins, Top-left = Long-term investments, Bottom-left = Low Priority</p>
      </div>
    </div>
  );
}