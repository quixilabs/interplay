import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Star } from 'lucide-react';

interface ActionableInsightsProps {
  data: any;
}

export default function ActionableInsights({ data }: ActionableInsightsProps) {
  const insights = [
    {
      type: 'recommendation',
      icon: Lightbulb,
      title: 'Priority Intervention Needed',
      content: 'Mental health support services are the #1 fastest win cited by 85% of at-risk students. Consider expanding counseling hours and peer support programs.',
      action: 'Review current mental health resource capacity',
      urgency: 'high'
    },
    {
      type: 'risk',
      icon: AlertTriangle,
      title: 'Demographic Alert',
      content: 'Students working 20+ hours show 35% at-risk rate vs 20% campus average. Financial stress significantly impacts academic flourishing.',
      action: 'Explore work-study alternatives and emergency funding',
      urgency: 'high'
    },
    {
      type: 'opportunity',
      icon: TrendingUp,
      title: 'Strengths to Leverage',
      content: 'Character & Virtue scores (8.1/10) exceed peer institutions. Build on this strength through service-learning and leadership programs.',
      action: 'Expand community engagement opportunities',
      urgency: 'medium'
    },
    {
      type: 'positive',
      icon: Star,
      title: 'Bright Spot Highlight',
      content: '"The peer tutoring program helped me not just academically but also build lasting friendships" - Theme found in 34% of positive responses.',
      action: 'Expand and promote peer connection programs',
      urgency: 'medium'
    }
  ];

  const fastestWinSuggestions = [
    {
      suggestion: 'Extended library and study space hours',
      frequency: 23,
      theme: 'Academic Environment'
    },
    {
      suggestion: 'More affordable meal plan options',
      frequency: 19,
      theme: 'Financial Support'
    },
    {
      suggestion: 'Better mental health crisis response',
      frequency: 18,
      theme: 'Mental Health'
    },
    {
      suggestion: 'Flexible attendance policies for working students',
      frequency: 16,
      theme: 'Academic Policy'
    },
    {
      suggestion: 'More diverse counseling staff',
      frequency: 14,
      theme: 'Mental Health'
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
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Actionable Insights</h3>
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
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      insight.urgency === 'high' ? 'bg-red-100 text-red-700' :
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

      {/* Student Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Student Suggestions</h3>
        <p className="text-sm text-slate-600 mb-4">
          Most frequently cited "fastest win" improvements from open-text responses
        </p>
        <div className="space-y-3">
          {fastestWinSuggestions.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">{item.suggestion}</p>
                <p className="text-sm text-slate-600">{item.theme}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">{item.frequency}%</span>
                <p className="text-xs text-slate-500">of responses</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Next Steps:</strong> These student-generated suggestions provide clear direction for 
            immediate improvements. Consider implementing 2-3 of these changes this semester for maximum impact.
          </p>
        </div>
      </div>
    </div>
  );
}