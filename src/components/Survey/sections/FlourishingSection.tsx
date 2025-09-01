import { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GrowthModuleModal from '../GrowthModuleModal';

const FLOURISHING_DOMAINS = [
  {
    key: 'happiness_satisfaction',
    name: 'Happiness & Life Satisfaction',
    questions: [
      {
        text: 'Overall, how satisfied am I with my life as a whole these days?',
        scaleLabels: { left: 'Not Satisfied at all', right: 'Completely Satisfied' }
      },
      {
        text: 'In general, how happy or unhappy do I usually feel?',
        scaleLabels: { left: 'Extremely Unhappy', right: 'Extremely Happy' }
      }
    ]
  },
  {
    key: 'mental_physical_health',
    name: 'Mental & Physical Health',
    questions: [
      {
        text: 'In general, how would I rate my physical health?',
        scaleLabels: { left: 'Poor', right: 'Excellent' }
      },
      {
        text: 'How would I rate my overall mental health?',
        scaleLabels: { left: 'Poor', right: 'Excellent' }
      }
    ]
  },
  {
    key: 'meaning_purpose',
    name: 'Meaning & Purpose',
    questions: [
      {
        text: 'Overall, to what extent do I feel the things I do in my life are worthwhile?',
        scaleLabels: { left: 'Not at all worthwhile', right: 'Completely worthwhile' }
      },
      {
        text: 'I understand my purpose in life.',
        scaleLabels: { left: 'Strongly disagree', right: 'Strongly agree' }
      }
    ]
  },
  {
    key: 'character_virtue',
    name: 'Character & Virtue',
    questions: [
      {
        text: 'I try to do what is right in all circumstances, even when it is difficult.',
        scaleLabels: { left: 'Not true of me', right: 'Completely true of me' }
      },
      {
        text: 'I am willing to give up some happiness now for greater happiness later.',
        scaleLabels: { left: 'Not true of me', right: 'Completely true of me' }
      }
    ]
  },
  {
    key: 'social_relationships',
    name: 'Close Social Relationships',
    questions: [
      {
        text: 'I am content with my friendships and relationships.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      },
      {
        text: 'My relationships are as satisfying as I want them to be.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      }
    ]
  },
  {
    key: 'financial_stability',
    name: 'Financial & Material Stability',
    questions: [
      {
        text: 'I rarely worry about being able to meet normal monthly living expenses.',
        scaleLabels: { left: 'Worry All of the Time', right: 'Do Not Ever Worry' }
      },
      {
        text: 'I rarely worry about safety, food, or housing.',
        scaleLabels: { left: 'Worry All of the Time', right: 'Do Not Ever Worry' }
      }
    ]
  }
];

export default function FlourishingSection() {
  const { state, dispatch } = useSurvey();
  const [currentDomain, setCurrentDomain] = useState(0);
  const [scores, setScores] = useState(state.flourishingScores);
  const [brightSpots, setBrightSpots] = useState(state.textResponses.brightSpots || {});
  const [showGrowthModal, setShowGrowthModal] = useState(false);
  const [growthDomain, setGrowthDomain] = useState<string>('');

  const domain = FLOURISHING_DOMAINS[currentDomain];
  const questionKeys = [`${domain.key}_1`, `${domain.key}_2`];
  const score1 = scores[questionKeys[0] as keyof typeof scores];
  const score2 = scores[questionKeys[1] as keyof typeof scores];

  const handleScoreChange = (questionKey: string, value: number) => {
    setScores(prev => ({ ...prev, [questionKey]: value }));
  };

  const handleBrightSpotChange = (value: string) => {
    setBrightSpots(prev => ({ ...prev, [domain.name]: value }));
  };

  const shouldShowGrowthModule = () => {
    return (score1 !== undefined && score1 <= 6) || (score2 !== undefined && score2 <= 6);
  };

  const handleNext = () => {
    if (shouldShowGrowthModule()) {
      setGrowthDomain(domain.name);
      setShowGrowthModal(true);
    } else {
      continueToNext();
    }
  };

  const continueToNext = () => {
    dispatch({ type: 'SET_FLOURISHING_SCORES', payload: scores });
    dispatch({ type: 'SET_TEXT_RESPONSES', payload: { brightSpots } });

    if (currentDomain < FLOURISHING_DOMAINS.length - 1) {
      setCurrentDomain(currentDomain + 1);
    } else {
      dispatch({ type: 'SET_SECTION', payload: 5 }); // Go to Well-Being Intro
    }
  };

  const handleGrowthModuleComplete = () => {
    setShowGrowthModal(false);
    continueToNext();
  };

  const handleBack = () => {
    if (currentDomain > 0) {
      setCurrentDomain(currentDomain - 1);
    } else {
      dispatch({ type: 'SET_SECTION', payload: 3 }); // Go back to Flourishing Intro
    }
  };

  const isComplete = score1 !== undefined && score2 !== undefined && brightSpots[domain.name];

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              {domain.name}
            </h2>
            <span className="text-sm text-slate-500">
              Domain {currentDomain + 1} of {FLOURISHING_DOMAINS.length}
            </span>
          </div>
          <p className="text-slate-600">
            Please rate your current experience in this area of well-being.
          </p>
        </div>

        <div className="space-y-8">
          {/* Domain Questions */}
          {domain.questions.map((question, index) => {
            const questionKey = questionKeys[index];
            const score = scores[questionKey as keyof typeof scores];

            return (
              <div key={index}>
                <label className="block text-lg font-medium text-slate-800 mb-4">
                  {question.text}
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500 w-20 text-left">{question.scaleLabels.left}</span>
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <button
                        key={num}
                        onClick={() => handleScoreChange(questionKey, num)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${score === num
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500 w-20 text-right">{question.scaleLabels.right}</span>
                </div>
              </div>
            );
          })}

          {/* Bright Spot Question */}
          <div>
            <label className="block text-lg font-medium text-slate-800 mb-4">
              What's going well for you in {domain.name.toLowerCase()}?
            </label>
            <textarea
              value={brightSpots[domain.name] || ''}
              onChange={(e) => handleBrightSpotChange(e.target.value)}
              placeholder="Share what's working well in this area of your life..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Low Score Warning */}
          {shouldShowGrowthModule() && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800 font-medium">
                Based on your responses, we'll ask some additional questions about growth opportunities in this area.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <button
            onClick={handleBack}
            className="flex items-center px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isComplete}
            className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {currentDomain < FLOURISHING_DOMAINS.length - 1 ? 'Next Domain' : 'Continue'}
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Growth Module Modal */}
      {showGrowthModal && (
        <GrowthModuleModal
          domainName={growthDomain}
          onComplete={handleGrowthModuleComplete}
          onClose={() => setShowGrowthModal(false)}
        />
      )}
    </>
  );
}