import { Lightbulb, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import ChartTooltip from './ChartTooltip';

interface KeyInsightsProps {
  data: any;
}

export default function KeyInsights({ data }: KeyInsightsProps) {
  // Generate dynamic insights based on real data
  const interventionAnalysis = data?.interventionAnalysis || {};
  const topIntervention = interventionAnalysis?.topInterventions?.[0] || interventionAnalysis?.topEnablers?.[0];
  const topBarrier = interventionAnalysis?.topBarriers?.[0];
  const flourishingDomains = data?.flourishingDomainAverages || {};
  const studentsAtRisk = data?.studentsAtRisk || 0;

  // Find strongest and weakest domains
  const domainEntries = Object.entries(flourishingDomains);
  const strongestDomain = domainEntries.reduce((max, [key, value]) =>
    (value as number) > (max[1] as number) ? [key, value] : max, ['', 0]);
  const weakestDomain = domainEntries.reduce((min, [key, value]) =>
    (value as number) < (min[1] as number) ? [key, value] : min, ['', 10]);

  const formatDomainName = (key: string) => {
    return key.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' & ');
  };

  const insights = [
    {
      type: 'recommendation',
      icon: Lightbulb,
      title: 'Top Enabler to Strengthen',
      content: topIntervention
        ? `"${topIntervention.name}" is the most frequently cited enabler by students (${topIntervention.percentage || topIntervention.frequency}% of responses). Strengthening this support could have broad impact.`
        : 'No enablers data available yet. Collect more survey responses to identify what students need most.',
      action: topIntervention ? 'Expand and strengthen this enabler across campus' : 'Increase survey participation',
      urgency: 'high'
    },
    {
      type: 'risk',
      icon: AlertTriangle,
      title: 'Top Barrier to Address',
      content: topBarrier
        ? `"${topBarrier.name}" is the most frequently cited barrier by students (${topBarrier.percentage}% of responses). Removing this barrier could unlock significant student potential.`
        : `${studentsAtRisk}% of students show at-risk indicators (any flourishing domain below 6). ${weakestDomain[0] ? `${formatDomainName(weakestDomain[0])} is the lowest scoring area (${weakestDomain[1]}/10).` : ''}`,
      action: topBarrier ? 'Develop strategies to reduce or eliminate this barrier' : 'Develop targeted interventions for lowest-scoring domains',
      urgency: studentsAtRisk > 25 ? 'high' : 'medium'
    },
    {
      type: 'opportunity',
      icon: TrendingUp,
      title: 'Strengths to Leverage',
      content: strongestDomain[0]
        ? `${formatDomainName(strongestDomain[0])} scores are strong (${strongestDomain[1]}/10). Build on this strength through related programs and initiatives.`
        : 'Identify and leverage institutional strengths once more data is collected.',
      action: 'Expand programs that support your strongest domains',
      urgency: 'medium'
    },
    {
      type: 'positive',
      icon: Star,
      title: 'Enabler Success',
      content: topIntervention
        ? `Students consistently identify "${topIntervention.name}" as a key enabler supporting their flourishing.`
        : 'Collect more survey responses to identify what students value most for their well-being.',
      action: topIntervention ? 'Continue to strengthen and expand this enabler' : 'Encourage more survey participation',
      urgency: 'medium'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'text-blue-600';
      case 'risk': return 'text-red-600';
      case 'opportunity': return 'text-green-600';
      case 'positive': return 'text-purple-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Key Actionable Insights</h3>
        <ChartTooltip
          title="How to use these insights"
          content={[
            "These insights translate your data into specific, prioritized actions. Each insight card shows a recommendation, the supporting evidence, and suggested next steps.",
            "Priority levels (High, Medium, Low) indicate urgency. Focus on High Priority items first for maximum impact.",
            "The 'Top Student Suggestions' section shows verbatim improvement ideas from students—implement 2-3 of these for quick wins."
          ]}
        />
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className={`border rounded-lg p-4 ${getUrgencyColor(insight.urgency)}`}>
            <div className="flex items-start space-x-3">
              <insight.icon className={`h-6 w-6 mt-0.5 ${getIconColor(insight.type)}`} />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                <p className="text-slate-700 mt-1 text-sm">{insight.content}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded">
                    Action: {insight.action}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${insight.urgency === 'high' ? 'bg-red-100 text-red-700' :
                    insight.urgency === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                    {insight.urgency.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

