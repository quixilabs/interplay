import { useState, useEffect } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SurveyService } from '../../../services/surveyService';
import { DomainEnablersBarriers } from '../../../types/survey';

const FLOURISHING_DOMAINS = [
  {
    key: 'happiness_satisfaction',
    name: 'Happiness & Life Satisfaction',
    questions: [
      {
        text: 'Overall, I am satisfied with my life as a whole these days.',
        scaleLabels: { left: 'Not Satisfied at All', right: 'Completely Satisfied' }
      },
      {
        text: 'In general, I feel happy.',
        scaleLabels: { left: 'Extremely Unhappy', right: 'Extremely Happy' }
      }
    ]
  },
  {
    key: 'mental_physical_health',
    name: 'Mental & Physical Health',
    questions: [
      {
        text: 'In general, I would rate my physical health as…',
        scaleLabels: { left: 'Poor', right: 'Excellent' }
      },
      {
        text: 'I would rate my overall mental health as…',
        scaleLabels: { left: 'Poor', right: 'Excellent' }
      }
    ]
  },
  {
    key: 'meaning_purpose',
    name: 'Meaning & Purpose',
    questions: [
      {
        text: 'The things I do in my life feel worthwhile.',
        scaleLabels: { left: 'Not at All Worthwhile', right: 'Completely Worthwhile' }
      },
      {
        text: 'I understand my purpose in life.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      }
    ]
  },
  {
    key: 'character_virtue',
    name: 'Character & Growth',
    questions: [
      {
        text: 'I try to do what is right in all circumstances, even when it is difficult.',
        scaleLabels: { left: 'Not True of Me', right: 'Completely True of Me' }
      },
      {
        text: 'I am willing to give up some happiness now for greater happiness later.',
        scaleLabels: { left: 'Not True of Me', right: 'Completely True of Me' }
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
  const [domainEnablersBarriers, setDomainEnablersBarriers] = useState<DomainEnablersBarriers[]>([]);
  const [selectedEnablers, setSelectedEnablers] = useState<string[]>([]);
  const [selectedBarriers, setSelectedBarriers] = useState<string[]>([]);
  const [enablerOtherText, setEnablerOtherText] = useState('');
  const [barrierOtherText, setBarrierOtherText] = useState('');
  const [loading, setLoading] = useState(true);

  // Load enablers and barriers data on component mount
  useEffect(() => {
    const loadEnablersBarriers = async () => {
      try {
        const data = await SurveyService.getDomainEnablersBarriers();
        setDomainEnablersBarriers(data);
      } catch (error) {
        console.error('Failed to load enablers and barriers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEnablersBarriers();
  }, []);

  // Restore enablers and barriers when domain changes
  useEffect(() => {
    const domain = FLOURISHING_DOMAINS[currentDomain];
    const savedData = state.enablersBarriers?.find(item => item.domainKey === domain.key);

    if (savedData) {
      // Restore previously saved selections
      console.log(`🔄 [DEBUG] Restoring selections for domain: ${domain.key}`, savedData);
      setSelectedEnablers(savedData.selectedEnablers || []);
      setSelectedBarriers(savedData.selectedBarriers || []);
      setEnablerOtherText(savedData.enablerOtherText || '');
      setBarrierOtherText(savedData.barrierOtherText || '');
    } else {
      // Clear selections for new domain
      console.log(`🆕 [DEBUG] No saved data for domain: ${domain.key}, clearing selections`);
      setSelectedEnablers([]);
      setSelectedBarriers([]);
      setEnablerOtherText('');
      setBarrierOtherText('');
    }
  }, [currentDomain, state.enablersBarriers]);

  const domain = FLOURISHING_DOMAINS[currentDomain];
  const questionKeys = [`${domain.key}_1`, `${domain.key}_2`];
  const score1 = scores[questionKeys[0] as keyof typeof scores];
  const score2 = scores[questionKeys[1] as keyof typeof scores];
  const currentDomainData = domainEnablersBarriers.find(d => d.domain_key === domain.key);

  const handleScoreChange = (questionKey: string, value: number) => {
    setScores(prev => ({ ...prev, [questionKey]: value }));
  };

  const handleBrightSpotChange = (value: string) => {
    setBrightSpots(prev => ({ ...prev, [domain.name]: value }));
  };

  const isQuestionsComplete = () => {
    return score1 !== undefined && score2 !== undefined && brightSpots[domain.name];
  };

  const isEnablersBarriersComplete = () => {
    // Check if "Other" selections have required text
    const enablerOtherValid = !selectedEnablers.includes('Other') || enablerOtherText.trim().length > 0;
    const barrierOtherValid = !selectedBarriers.includes('Other') || barrierOtherText.trim().length > 0;

    // Allow form to be complete even with no selections (enablers/barriers are optional)
    return enablerOtherValid && barrierOtherValid;
  };

  const handleNext = () => {
    continueToNext();
  };

  const continueToNext = () => {
    dispatch({ type: 'SET_FLOURISHING_SCORES', payload: scores });
    dispatch({ type: 'SET_TEXT_RESPONSES', payload: { brightSpots } });

    // Save enablers and barriers
    const existingData = state.enablersBarriers || [];
    const updatedData = existingData.filter(item => item.domainKey !== domain.key);
    const newEntry = {
      domainKey: domain.key,
      selectedEnablers,
      selectedBarriers,
      enablerOtherText: selectedEnablers.includes('Other') ? enablerOtherText : undefined,
      barrierOtherText: selectedBarriers.includes('Other') ? barrierOtherText : undefined
    };

    updatedData.push(newEntry);
    dispatch({ type: 'SET_ENABLERS_BARRIERS', payload: updatedData });

    if (currentDomain < FLOURISHING_DOMAINS.length - 1) {
      setCurrentDomain(currentDomain + 1);
      // State will be restored/cleared by useEffect when currentDomain changes
    } else {
      dispatch({ type: 'SET_SECTION', payload: 5 }); // Go to Well-Being Intro
    }
  };

  const handleEnablerToggle = (enabler: string) => {
    setSelectedEnablers(prev =>
      prev.includes(enabler)
        ? prev.filter(e => e !== enabler)
        : [...prev, enabler]
    );
  };

  const handleBarrierToggle = (barrier: string) => {
    setSelectedBarriers(prev =>
      prev.includes(barrier)
        ? prev.filter(b => b !== barrier)
        : [...prev, barrier]
    );
  };

  const handleBack = () => {
    if (currentDomain > 0) {
      setCurrentDomain(currentDomain - 1);
    } else {
      dispatch({ type: 'SET_SECTION', payload: 3 }); // Go back to Flourishing Intro
    }
  };

  const isComplete = isQuestionsComplete() && isEnablersBarriersComplete();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
        <div className="text-center">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

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

          {/* Enablers and Barriers Section */}
          {currentDomainData && (
            <div className="space-y-6 border-t border-slate-200 pt-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">
                  Help us understand what supports or challenges your {domain.name.toLowerCase()}.
                </p>
                <p className="text-blue-700 text-sm">
                  Select all that apply for each category.
                </p>
              </div>

              {/* Enablers */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">
                  What helps me feel {domain.name.toLowerCase().includes('happiness') ? 'happy and satisfied' :
                    domain.name.toLowerCase().includes('health') ? 'healthy' :
                      domain.name.toLowerCase().includes('meaning') ? 'purposeful' :
                        domain.name.toLowerCase().includes('character') ? 'grow in character' :
                          domain.name.toLowerCase().includes('social') ? 'connected' :
                            'secure'}:
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    {currentDomainData.enablers.map((enabler, index) => (
                      <label key={index} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEnablers.includes(enabler)}
                          onChange={() => handleEnablerToggle(enabler)}
                          className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                        />
                        <span className="text-slate-700 flex-1">{enabler}</span>
                      </label>
                    ))}
                  </div>
                  {selectedEnablers.includes('Other') && (
                    <div className="ml-7">
                      <input
                        type="text"
                        value={enablerOtherText}
                        onChange={(e) => setEnablerOtherText(e.target.value)}
                        placeholder="Please specify..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Barriers */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">
                  What gets in the way of my {domain.name.toLowerCase().includes('happiness') ? 'happiness and satisfaction' :
                    domain.name.toLowerCase().includes('health') ? 'health' :
                      domain.name.toLowerCase().includes('meaning') ? 'feeling purposeful' :
                        domain.name.toLowerCase().includes('character') ? 'growth' :
                          domain.name.toLowerCase().includes('social') ? 'relationships' :
                            'security'}:
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    {currentDomainData.barriers.map((barrier, index) => (
                      <label key={index} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBarriers.includes(barrier)}
                          onChange={() => handleBarrierToggle(barrier)}
                          className="w-4 h-4 text-red-600 bg-slate-100 border-slate-300 rounded focus:ring-red-500 focus:ring-2 mt-1"
                        />
                        <span className="text-slate-700 flex-1">{barrier}</span>
                      </label>
                    ))}
                  </div>
                  {selectedBarriers.includes('Other') && (
                    <div className="ml-7">
                      <input
                        type="text"
                        value={barrierOtherText}
                        onChange={(e) => setBarrierOtherText(e.target.value)}
                        placeholder="Please specify..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  )}
                </div>
              </div>
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

    </>
  );
}