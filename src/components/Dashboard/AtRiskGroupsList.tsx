import { AlertTriangle, Users, TrendingUp } from 'lucide-react';

interface AtRiskGroup {
  rank: number;
  profile: string;
  description?: string;
  studentCount: number;
  totalInGroup: number;
  riskPercentage: number;
  riskLevel: 'high' | 'medium' | 'low';
  primaryConcerns?: string[];
}

interface AtRiskGroupsListProps {
  data?: any;
}

export default function AtRiskGroupsList({ data }: AtRiskGroupsListProps) {
  // Use real calculated at-risk groups from analytics service
  const atRiskGroups: AtRiskGroup[] = data?.atRiskGroups || [];

  // If no groups found, show a message
  if (atRiskGroups.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full items-center justify-center">
        <div className="text-center text-slate-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No at-risk groups identified</p>
          <p className="text-sm mt-1">Need more survey responses to identify patterns</p>
        </div>
      </div>
    );
  }

  const getRiskLevelConfig = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badgeBg: 'bg-red-100',
          badgeText: 'text-red-800',
          iconColor: 'text-red-600',
          label: 'High Risk'
        };
      case 'medium':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          badgeBg: 'bg-orange-100',
          badgeText: 'text-orange-800',
          iconColor: 'text-orange-600',
          label: 'Medium Risk'
        };
      case 'low':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          badgeBg: 'bg-yellow-100',
          badgeText: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          label: 'Low Risk'
        };
      default:
        // Fallback for unexpected values - treat as medium risk
        console.warn(`Unexpected risk level: ${level}. Defaulting to medium risk.`);
        return {
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          badgeBg: 'bg-slate-100',
          badgeText: 'text-slate-800',
          iconColor: 'text-slate-600',
          label: 'Unknown Risk'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900">Top At-Risk Student Groups</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Intersectional Analysis
          </span>
        </div>
        <p className="text-sm text-slate-600">
          Student groups with multiple risk factors requiring targeted support interventions
        </p>
      </div>

      {/* At-Risk Groups Cards - WITH SCROLLING & CONDENSED DESIGN */}
      <div className="space-y-3 overflow-y-auto pr-2 flex-1" style={{ maxHeight: '550px' }}>
        {atRiskGroups.map((group) => {
          const config = getRiskLevelConfig(group.riskLevel);

          return (
            <div
              key={group.rank}
              className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-4 transition-all hover:shadow-md`}
            >
              {/* Card Header - Condensed */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2 flex-1">
                  {/* Rank Badge - Smaller */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                      {group.rank}
                    </div>
                  </div>

                  {/* Profile Info - More Compact */}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                      {group.profile}
                    </h4>
                  </div>
                </div>

                {/* Risk Level Badge - Smaller */}
                <div className={`${config.badgeBg} ${config.badgeText} px-2 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1 flex-shrink-0 ml-2`}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{config.label}</span>
                </div>
              </div>

              {/* Statistics Row - Condensed to Single Line */}
              <div className="flex items-center justify-around text-xs bg-white/60 rounded py-2 mb-2">
                <div className="text-center">
                  <span className="font-bold text-slate-900">{group.studentCount}</span>
                  <span className="text-slate-500 ml-1">at risk</span>
                </div>
                <div className="text-center border-l border-r border-slate-200 px-3">
                  <span className="font-bold text-slate-900">{group.riskPercentage}%</span>
                  <span className="text-slate-500 ml-1">rate</span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-slate-900">{group.totalInGroup}</span>
                  <span className="text-slate-500 ml-1">total</span>
                </div>
              </div>

              {/* Primary Concerns - Smaller Tags */}
              {group.primaryConcerns && group.primaryConcerns.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {group.primaryConcerns.map((concern, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-300 text-slate-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-900">
              {atRiskGroups.reduce((sum, group) => sum + group.studentCount, 0)}
            </span>
            {' '}students identified across top 5 at-risk groups
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
            View Detailed Report →
          </button>
        </div>
      </div>
    </div>
  );
}

