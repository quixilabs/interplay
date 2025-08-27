import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface FlourishingChartProps {
  data: any;
}

export default function FlourishingChart({ data }: FlourishingChartProps) {
  // Mock data for flourishing domains
  const flourishingData = [
    {
      domain: 'Happiness & Life Satisfaction',
      current: 7.2,
      benchmark: 6.8,
      fullMark: 10
    },
    {
      domain: 'Mental & Physical Health',
      current: 6.4,
      benchmark: 6.9,
      fullMark: 10
    },
    {
      domain: 'Meaning & Purpose',
      current: 7.8,
      benchmark: 7.1,
      fullMark: 10
    },
    {
      domain: 'Character & Virtue',
      current: 8.1,
      benchmark: 7.6,
      fullMark: 10
    },
    {
      domain: 'Social Relationships',
      current: 6.9,
      benchmark: 7.3,
      fullMark: 10
    },
    {
      domain: 'Financial Stability',
      current: 5.8,
      benchmark: 6.2,
      fullMark: 10
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Flourishing Domain Scores</h3>
          <p className="text-sm text-slate-600">Average scores across six well-being domains</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-slate-600">Your University</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-500 rounded mr-2"></div>
            <span className="text-slate-600">Peer Average</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={flourishingData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="domain" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              className="text-xs"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <Radar
              name="Your University"
              dataKey="current"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="Peer Average"
              dataKey="benchmark"
              stroke="#14b8a6"
              fill="#14b8a6"
              fillOpacity={0.05}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
          <ul className="space-y-1 text-green-700">
            <li>• Character & Virtue (8.1/10)</li>
            <li>• Meaning & Purpose (7.8/10)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Growth Areas</h4>
          <ul className="space-y-1 text-orange-700">
            <li>• Financial Stability (5.8/10)</li>
            <li>• Mental & Physical Health (6.4/10)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}