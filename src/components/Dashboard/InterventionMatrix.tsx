import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface InterventionMatrixProps {
  data: any;
}

export default function InterventionMatrix({ data }: InterventionMatrixProps) {
  // Mock data for intervention opportunities
  const interventionData = [
    { 
      intervention: 'Mental health support', 
      frequency: 85, 
      impact: 9.2, 
      category: 'High Priority'
    },
    { 
      intervention: 'Financial assistance', 
      frequency: 72, 
      impact: 8.8, 
      category: 'High Priority'
    },
    { 
      intervention: 'Better time management', 
      frequency: 68, 
      impact: 7.1, 
      category: 'Quick Win'
    },
    { 
      intervention: 'Academic support', 
      frequency: 61, 
      impact: 8.3, 
      category: 'High Priority'
    },
    { 
      intervention: 'More social connections', 
      frequency: 58, 
      impact: 7.8, 
      category: 'Medium Priority'
    },
    { 
      intervention: 'Stress reduction programs', 
      frequency: 54, 
      impact: 8.5, 
      category: 'Medium Priority'
    },
    { 
      intervention: 'Career guidance', 
      frequency: 49, 
      impact: 7.3, 
      category: 'Medium Priority'
    },
    { 
      intervention: 'Better sleep habits', 
      frequency: 42, 
      impact: 6.9, 
      category: 'Low Priority'
    },
    { 
      intervention: 'Physical health support', 
      frequency: 38, 
      impact: 7.6, 
      category: 'Medium Priority'
    },
    { 
      intervention: 'Creative outlets', 
      frequency: 31, 
      impact: 6.2, 
      category: 'Low Priority'
    }
  ];

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
            <li>• Mental health support (85% frequency, 9.2 impact)</li>
            <li>• Financial assistance (72% frequency, 8.8 impact)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Quick Wins</h4>
          <ul className="space-y-1 text-orange-700">
            <li>• Time management resources (68% frequency, 7.1 impact)</li>
            <li>• Study skills workshops (moderate effort, good ROI)</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        <p><strong>Matrix Guide:</strong> Top-right quadrant = High Priority, Bottom-right = Quick Wins, Top-left = Long-term investments, Bottom-left = Low Priority</p>
      </div>
    </div>
  );
}