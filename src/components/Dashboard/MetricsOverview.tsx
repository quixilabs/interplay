
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';
import ChartTooltip from './ChartTooltip';

interface MetricsOverviewProps {
  data: any;
}

export default function MetricsOverview({ data }: MetricsOverviewProps) {
  // Use real data from the analytics service
  const metrics = {
    averageFlourishingScore: data?.overallFlourishingScore || 0,
    studentsAtRisk: data?.studentsAtRisk || 0,
    completionRate: data?.completionRate || 0,
    topGrowthOpportunity: data?.topInterventions?.[0]?.name || 'No data available'
  };

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType,
    subtitle
  }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    subtitle?: string;
  }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-warm-gray font-primary">{title}</p>
          <p className="text-2xl font-bold text-navy font-primary mt-1">{value}</p>
          {subtitle && <p className="text-sm text-warm-gray/80 font-primary mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 bg-light-gray rounded-brand">
          <Icon className="h-6 w-6 text-sage" />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center">
          {changeType === 'positive' ? (
            <TrendingUp className="h-4 w-4 text-success mr-1" />
          ) : changeType === 'negative' ? (
            <TrendingDown className="h-4 w-4 text-danger mr-1" />
          ) : null}
          <span className={`text-sm ${changeType === 'positive' ? 'text-success' :
            changeType === 'negative' ? 'text-danger' :
              'text-warm-gray'
            }`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-semibold text-navy font-primary">Key Metrics Overview</h2>
        <ChartTooltip
          title="How to use these metrics"
          content={[
            "These four key metrics provide a quick snapshot of overall student wellbeing at your institution.",
            "The Overall Flourishing Score (out of 10) averages all six domains. Students Below Threshold shows the percentage with any domain score under 6.",
            "Track changes over time using the trend indicators. Use these metrics to set targets and measure progress on wellbeing initiatives."
          ]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Overall Flourishing Score"
          value={metrics.averageFlourishingScore}
          icon={Target}
          change="+0.3 from last semester"
          changeType="positive"
          subtitle="Out of 10"
        />

        <MetricCard
          title="Students Below Threshold"
          value={`${metrics.studentsAtRisk}%`}
          icon={AlertTriangle}
          change="-5% from last semester"
          changeType="positive"
          subtitle="Any domain score < 6"
        />

        <MetricCard
          title="Survey Completion Rate"
          value={`${metrics.completionRate}%`}
          icon={TrendingUp}
          change="+12% from last campaign"
          changeType="positive"
          subtitle={`${data?.totalResponses || 0} responses`}
        />

        <MetricCard
          title="Top Growth Opportunity"
          value={metrics.topGrowthOpportunity}
          icon={Target}
          subtitle="Most cited intervention need"
        />
      </div>
    </div>
  );
}