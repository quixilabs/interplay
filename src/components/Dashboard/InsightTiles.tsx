import { useState } from 'react';
import { BookOpen, TrendingUp, Users, DollarSign, Heart, Brain, ExternalLink, ChevronRight } from 'lucide-react';

interface InsightTilesProps {
    data: any;
}

interface Insight {
    id: string;
    category: 'performance_wellbeing' | 'ambition_contribution' | 'selfreliance_connection' | 'stability_growth' | 'academic_creative';
    title: string;
    insight: string;
    statistic: string;
    source: string;
    icon: any;
    color: string;
    bgColor: string;
    relevanceScore?: number;
}

const RESEARCH_INSIGHTS: Insight[] = [
    {
        id: 'belonging_persistence',
        category: 'selfreliance_connection',
        title: 'Belonging & Student Persistence',
        insight: 'Belonging is the #1 predictor of student persistence across OECD countries.',
        statistic: '40% higher retention',
        source: 'OECD Education at a Glance 2023',
        icon: Heart,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
    },
    {
        id: 'financial_stress_dropout',
        category: 'stability_growth',
        title: 'Financial Stress Impact',
        insight: 'Students with high financial stress report 2x higher dropout intent.',
        statistic: '2x dropout risk',
        source: 'National Student Financial Wellness Study 2023',
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    {
        id: 'burnout_performance',
        category: 'performance_wellbeing',
        title: 'Burnout & Academic Performance',
        insight: 'Students experiencing burnout show 25% lower academic performance and 3x higher mental health service usage.',
        statistic: '25% lower GPA',
        source: 'American College Health Association 2023',
        icon: Brain,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
    {
        id: 'social_connections_wellbeing',
        category: 'selfreliance_connection',
        title: 'Social Support & Mental Health',
        insight: 'Students with strong social connections report 50% better mental health outcomes and higher life satisfaction.',
        statistic: '50% better mental health',
        source: 'Harvard Study of Adult Development 2023',
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        id: 'purpose_engagement',
        category: 'ambition_contribution',
        title: 'Purpose & Academic Engagement',
        insight: 'Students who connect their studies to larger purpose show 35% higher engagement and completion rates.',
        statistic: '35% higher engagement',
        source: 'Journal of Educational Psychology 2023',
        icon: TrendingUp,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
    },
    {
        id: 'creative_cognitive',
        category: 'academic_creative',
        title: 'Creativity & Cognitive Function',
        insight: 'Students engaged in creative activities alongside academics show enhanced problem-solving and reduced stress.',
        statistic: '30% better problem-solving',
        source: 'Creativity Research Journal 2023',
        icon: BookOpen,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
    },
    {
        id: 'autonomy_motivation',
        category: 'selfreliance_connection',
        title: 'Autonomy & Intrinsic Motivation',
        insight: 'Students with balanced autonomy and support show 40% higher intrinsic motivation and academic satisfaction.',
        statistic: '40% higher motivation',
        source: 'Self-Determination Theory Research 2023',
        icon: TrendingUp,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
    },
    {
        id: 'growth_mindset',
        category: 'stability_growth',
        title: 'Growth Mindset & Resilience',
        insight: 'Students who embrace growth over security develop 60% better resilience to academic setbacks.',
        statistic: '60% better resilience',
        source: 'Mindset Research Institute 2023',
        icon: TrendingUp,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
    }
];

function InsightTile({ insight, isRelevant }: { insight: Insight; isRelevant: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${isRelevant
                    ? `${insight.bgColor} border-current ${insight.color}`
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg ${isRelevant ? insight.bgColor : 'bg-slate-100'}`}>
                            <insight.icon className={`h-5 w-5 ${isRelevant ? insight.color : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                            <p className="text-sm opacity-90 line-clamp-2">{insight.insight}</p>

                            {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-bold">{insight.statistic}</span>
                                        <div className="flex items-center text-xs opacity-70">
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            Research
                                        </div>
                                    </div>
                                    <p className="text-xs opacity-80">{insight.source}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                        {isRelevant && (
                            <div className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                                Relevant
                            </div>
                        )}
                        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InsightTiles({ data }: InsightTilesProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const tensionAnalysis = data?.tensionAnalysis;

    // Determine which insights are most relevant based on tension data
    const getRelevantInsights = () => {
        if (!tensionAnalysis?.crossDomainAnalysis) {
            return RESEARCH_INSIGHTS.map(insight => ({ ...insight, relevanceScore: 0 }));
        }

        return RESEARCH_INSIGHTS.map(insight => {
            const relatedTension = tensionAnalysis.crossDomainAnalysis.find(
                (t: any) => t.tensionKey === insight.category
            );

            const relevanceScore = relatedTension ? relatedTension.avgGapScore || 0 : 0;

            return {
                ...insight,
                relevanceScore
            };
        }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    };

    const relevantInsights = getRelevantInsights();
    const highRelevanceInsights = relevantInsights.filter(i => (i.relevanceScore || 0) >= 0.2);
    const moderateRelevanceInsights = relevantInsights.filter(i => (i.relevanceScore || 0) >= 0.1 && (i.relevanceScore || 0) < 0.2);
    const generalInsights = relevantInsights.filter(i => (i.relevanceScore || 0) < 0.1);

    const categories = [
        { key: 'all', label: 'All Insights', count: relevantInsights.length },
        { key: 'relevant', label: 'Most Relevant', count: highRelevanceInsights.length },
        { key: 'performance_wellbeing', label: 'Performance vs Wellbeing', count: relevantInsights.filter(i => i.category === 'performance_wellbeing').length },
        { key: 'selfreliance_connection', label: 'Connection & Belonging', count: relevantInsights.filter(i => i.category === 'selfreliance_connection').length },
        { key: 'stability_growth', label: 'Stability vs Growth', count: relevantInsights.filter(i => i.category === 'stability_growth').length },
    ];

    const getDisplayInsights = () => {
        switch (selectedCategory) {
            case 'relevant':
                return highRelevanceInsights;
            case 'all':
                return relevantInsights;
            default:
                return relevantInsights.filter(i => i.category === selectedCategory);
        }
    };

    const displayInsights = getDisplayInsights();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-sage mr-2" />
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Research Insights</h3>
                            <p className="text-sm text-slate-600">Why these tensions matter - backed by research</p>
                        </div>
                    </div>

                    {tensionAnalysis && (
                        <div className="text-right">
                            <div className="text-sm font-medium text-slate-900">{highRelevanceInsights.length}</div>
                            <div className="text-xs text-slate-500">High relevance insights</div>
                        </div>
                    )}
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category.key}
                            onClick={() => setSelectedCategory(category.key)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.key
                                    ? 'bg-sage text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {category.label}
                            {category.count > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                                    {category.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* High Priority Insights */}
            {selectedCategory === 'all' && highRelevanceInsights.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center mb-4">
                        <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
                        <h4 className="font-semibold text-slate-900">High Priority - Based on Your Data</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {highRelevanceInsights.slice(0, 4).map(insight => (
                            <InsightTile key={insight.id} insight={insight} isRelevant={true} />
                        ))}
                    </div>
                </div>
            )}

            {/* All Insights Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900">
                        {selectedCategory === 'relevant' ? 'Most Relevant Insights' :
                            selectedCategory === 'all' ? 'All Research Insights' :
                                categories.find(c => c.key === selectedCategory)?.label || 'Insights'}
                    </h4>
                    <div className="text-sm text-slate-500">
                        {displayInsights.length} insight{displayInsights.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {displayInsights.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayInsights.map(insight => (
                            <InsightTile
                                key={insight.id}
                                insight={insight}
                                isRelevant={(insight.relevanceScore || 0) >= 0.2}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                        <p>No insights available for this category.</p>
                        <p className="text-sm mt-1">Try selecting a different filter above.</p>
                    </div>
                )}
            </div>

            {/* Research Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <h5 className="font-medium text-blue-900 mb-1">About These Insights</h5>
                        <p className="text-sm text-blue-800">
                            These research-backed insights help contextualize your tension data. Insights marked as "Relevant"
                            correspond to areas where your students show significant gaps between needs and support systems.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
