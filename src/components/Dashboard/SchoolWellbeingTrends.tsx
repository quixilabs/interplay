import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SchoolWellbeingTrendsProps {
  data: any;
}

export default function SchoolWellbeingTrends({ data }: SchoolWellbeingTrendsProps) {
  // Mock trend data over time
  const trendData = [
    {
      month: 'Aug 2023',
      belonging: 6.5,
      safety: 8.2,
      academicSupport: 6.1,
      mentalHealth: 5.8
    },
    {
      month: 'Sep 2023', 
      belonging: 6.7,
      safety: 8.3,
      academicSupport: 6.3,
      mentalHealth: 6.1
    },
    {
      month: 'Oct 2023',
      belonging: 6.6,
      safety: 8.1,
      academicSupport: 6.4,
      mentalHealth: 5.9
    },
    {
      month: 'Nov 2023',
      belonging: 6.8,
      safety: 8.4,
      academicSupport: 6.7,
      mentalHealth: 6.3
    },
    {
      month: 'Dec 2023',
      belonging: 7.1,
      safety: 8.5,
      academicSupport: 6.9,
      mentalHealth: 6.5
    },
    {
      month: 'Jan 2024',
      belonging: 6.8,
      safety: 8.4,
      academicSupport: 6.5,
      mentalHealth: 6.1
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">School Well-Being Trends</h3>
        <p className="text-sm text-slate-600">Key institutional well-being metrics over time</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              domain={[5, 9]}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 shadow-lg rounded-lg border">
                      <p className="font-medium text-slate-900">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                          {entry.name}: {entry.value}/10
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="belonging" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              name="Sense of Belonging"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="safety" 
              stroke="#10b981" 
              strokeWidth={2} 
              name="Campus Safety"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="academicSupport" 
              stroke="#f59e0b" 
              strokeWidth={2} 
              name="Academic Support"
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="mentalHealth" 
              stroke="#ef4444" 
              strokeWidth={2} 
              name="Mental Health Access"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-green-800 mb-2">Positive Trends</h4>
          <ul className="space-y-1 text-green-700">
            <li>• Belonging scores improving (+0.6 since August)</li>
            <li>• Campus safety remains consistently high (8.4+)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Areas for Focus</h4>
          <ul className="space-y-1 text-orange-700">
            <li>• Mental health access needs improvement</li>
            <li>• Academic support showing slower progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
}