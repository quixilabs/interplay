import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import ChartTooltip from './ChartTooltip';

interface FlourishingChartProps {
  data: any;
}

export default function FlourishingChart({ data }: FlourishingChartProps) {
  // Use real data from the analytics service
  const domainAverages = data?.flourishingDomainAverages || {};
  
  const flourishingData = [
    {
      domain: 'Happiness & Life Satisfaction',
      current: domainAverages.happiness_satisfaction || 0,
      benchmark: 6.8, // Keep benchmark as static for now
      fullMark: 10
    },
    {
      domain: 'Mental & Physical Health',
      current: domainAverages.mental_physical_health || 0,
      benchmark: 6.9,
      fullMark: 10
    },
    {
      domain: 'Meaning & Purpose',
      current: domainAverages.meaning_purpose || 0,
      benchmark: 7.1,
      fullMark: 10
    },
    {
      domain: 'Character & Virtue',
      current: domainAverages.character_virtue || 0,
      benchmark: 7.6,
      fullMark: 10
    },
    {
      domain: 'Social Relationships',
      current: domainAverages.social_relationships || 0,
      benchmark: 7.3,
      fullMark: 10
    },
    {
      domain: 'Financial Stability',
      current: domainAverages.financial_stability || 0,
      benchmark: 6.2,
      fullMark: 10
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Flourishing Domain Scores</h3>
            <p className="text-sm text-slate-600">Average scores across six well-being domains</p>
          </div>
          <ChartTooltip
            title="How to use this chart"
            content={[
              "The blue area shows your university's average scores across six flourishing domains, while the dashed teal line represents peer institution averages.",
              "Larger gaps between your scores and peer averages indicate areas where your students may need more support.",
              "Look at 'Growth Areas' below the chart to identify which domains need the most attention."
            ]}
          />
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
            {flourishingData
              .sort((a, b) => b.current - a.current)
              .slice(0, 2)
              .map((domain, index) => (
                <li key={index}>• {domain.domain} ({domain.current}/10)</li>
              ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Growth Areas</h4>
          <ul className="space-y-1 text-orange-700">
            {flourishingData
              .sort((a, b) => a.current - b.current)
              .slice(0, 2)
              .map((domain, index) => (
                <li key={index}>• {domain.domain} ({domain.current}/10)</li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}