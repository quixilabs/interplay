import { useState, useEffect } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SurveyService } from '../../../services/surveyService';
import { DomainEnablersBarriers } from '../../../types/survey';
import { debugLog } from '../../../utils/debug';

// Demo content for first domain (Joy & Energy) – used when DB is not updated
const JOY_ENERGY_ENABLERS = [
  'Supportive instructors',
  'Positive relationships with other students',
  'Meaningful coursework',
  'Progress toward my goals',
  'Clear communication',
  'Flexible policies',
  'A welcoming environment',
  'Financial support or affordability',
  'Other'
];
const JOY_ENERGY_BARRIERS = [
  'Academic workload',
  'Competing responsibilities outside of school',
  'Financial stress',
  'Unclear expectations',
  'Administrative frustration',
  'Feeling disconnected',
  'Confusing communication',
  'Lack of flexibility',
  'Other'
];

// Demo content for second domain (Health & Balance) – used when DB is not updated
const HEALTH_BALANCE_ENABLERS = [
  'Manageable workload',
  'Flexible scheduling',
  'Supportive instructors',
  'Access to support services',
  'Clear deadlines and expectations',
  'Safe learning environment',
  'Other'
];
const HEALTH_BALANCE_BARRIERS = [
  'Overwhelming workload',
  'Time pressure',
  'Difficulty accessing support services',
  'Work or family responsibilities',
  'Financial strain',
  'Long commutes',
  'Inconsistent communication',
  'Other'
];

// Demo content for third domain (Direction & Purpose) – used when DB is not updated
const DIRECTION_PURPOSE_ENABLERS = [
  'Clear degree or certificate roadmap',
  'Helpful academic advising',
  'Career planning support',
  'Internships or real-world experiences',
  'Feedback that helps me improve',
  'Seeing progress toward graduation',
  'Opportunities to explore interests',
  'Mentorship',
  'Other'
];
const DIRECTION_PURPOSE_BARRIERS = [
  'Unclear program requirements',
  'Difficulty getting advising appointments',
  'Uncertainty about career direction',
  'Limited internship or hands-on opportunities',
  'Delayed or unclear feedback',
  'Course availability issues',
  'Other'
];

// Demo content for fourth domain (Growth & Responsibility) – used when DB is not updated
const GROWTH_RESPONSIBILITY_ENABLERS = [
  'Clear expectations',
  'Constructive feedback',
  'Opportunities to take initiative',
  'Real-world problem solving',
  'Support when I make mistakes',
  'Leadership opportunities',
  'Faculty who model accountability',
  'Other'
];
const GROWTH_RESPONSIBILITY_BARRIERS = [
  'Inconsistent expectations',
  'Fear of asking questions',
  'Lack of feedback',
  'Policies that feel unclear or unfair',
  'Limited opportunity to apply learning',
  'Competitive or discouraging environment',
  'Other'
];

// Demo content for fifth domain (Belonging & Support) – used when DB is not updated
const BELONGING_SUPPORT_ENABLERS = [
  'Supportive instructors',
  'Academic advisors',
  'Peer relationships',
  'Student organizations',
  'Small class sizes',
  'Mentorship',
  'Cultural or identity-based communities',
  'Welcoming environment',
  'Other'
];
const BELONGING_SUPPORT_BARRIERS = [
  'Large or impersonal classes',
  'Difficulty making friends',
  'Limited access to mentors',
  'Feeling different or isolated',
  'Lack of community-building opportunities',
  'Scheduling conflicts',
  'Other'
];

// Demo content for sixth domain (Stability & Security) – used when DB is not updated
const STABILITY_SECURITY_ENABLERS = [
  'Financial aid or scholarships',
  'Affordable tuition',
  'Emergency grants',
  'Flexible work options',
  'Food support programs',
  'Clear billing information',
  'Stable housing support',
  'Other'
];
const STABILITY_SECURITY_BARRIERS = [
  'Tuition or fees',
  'Housing costs',
  'Food insecurity',
  'Delays in financial aid',
  'Unexpected expenses',
  'Balancing work hours with school demands',
  'Lack of information about support',
  'Other'
];

const FLOURISHING_DOMAINS = [
  {
    key: 'happiness_satisfaction',
    name: 'Joy & Energy',
    questions: [
      {
        text: 'I experience genuine joy here.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      },
      {
        text: 'My overall experience here feels positive.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      }
    ]
  },
  {
    key: 'mental_physical_health',
    name: 'Health & Balance',
    questions: [
      {
        text: 'Being here supports my mental well-being.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      },
      {
        text: 'The pace and demands here feel manageable.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      }
    ]
  },
  {
    key: 'meaning_purpose',
    name: 'Direction & Purpose',
    questions: [
      {
        text: "What I'm doing here feels connected to who I want to become.",
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      },
      {
        text: "I can see a clear path forward from what I'm doing here.",
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      }
    ]
  },
  {
    key: 'character_virtue',
    name: 'Growth & Responsibility',
    questions: [
      {
        text: 'Being here supports me in taking responsibility for my actions.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      },
      {
        text: "Being here strengthens my ability to adjust when things don't go as planned.",
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      }
    ]
  },
  {
    key: 'social_relationships',
    name: 'Belonging & Support',
    questions: [
      {
        text: 'I feel like I truly belong here.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      },
      {
        text: 'If I needed help, I know someone here I could turn to.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      }
    ]
  },
  {
    key: 'financial_stability',
    name: 'Stability & Security',
    questions: [
      {
        text: 'Worries about money or basic needs make it hard for me to fully engage here.',
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      },
      {
        text: "I feel confident I can meet my basic needs while I'm here.",
        scaleLabels: { left: 'Strongly Disagree', right: 'Strongly Agree' }
      }
    ]
  }
];

export default function FlourishingSection() {
  const { state, dispatch } = useSurvey();
  const [currentDomain, setCurrentDomain] = useState(0);
  const [scores, setScores] = useState(state.flourishingScores);
  const [domainEnablersBarriers, setDomainEnablersBarriers] = useState<DomainEnablersBarriers[]>([]);
  const [selectedEnablers, setSelectedEnablers] = useState<string[]>([]);
  const [selectedBarriers, setSelectedBarriers] = useState<string[]>([]);
  const [enablerOtherText, setEnablerOtherText] = useState('');
  const [barrierOtherText, setBarrierOtherText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);

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
      debugLog(`🔄 [DEBUG] Restoring selections for domain: ${domain.key}`, savedData);
      setSelectedEnablers(savedData.selectedEnablers || []);
      setSelectedBarriers(savedData.selectedBarriers || []);
      setEnablerOtherText(savedData.enablerOtherText || '');
      setBarrierOtherText(savedData.barrierOtherText || '');
    } else {
      // Clear selections for new domain
      debugLog(`🆕 [DEBUG] No saved data for domain: ${domain.key}, clearing selections`);
      setSelectedEnablers([]);
      setSelectedBarriers([]);
      setEnablerOtherText('');
      setBarrierOtherText('');
    }
    // Clear error when domain changes
    setShowError(false);
  }, [currentDomain, state.enablersBarriers]);

  const domain = FLOURISHING_DOMAINS[currentDomain];
  const questionKeys = [`${domain.key}_1`, `${domain.key}_2`];
  const score1 = scores[questionKeys[0] as keyof typeof scores];
  const score2 = scores[questionKeys[1] as keyof typeof scores];
  const currentDomainData = domainEnablersBarriers.find(d => d.domain_key === domain.key);
  // For demo: all six domains use hardcoded enablers/barriers without DB changes
  const isJoyEnergyDomain = domain.key === 'happiness_satisfaction';
  const isHealthBalanceDomain = domain.key === 'mental_physical_health';
  const isDirectionPurposeDomain = domain.key === 'meaning_purpose';
  const isGrowthResponsibilityDomain = domain.key === 'character_virtue';
  const isBelongingSupportDomain = domain.key === 'social_relationships';
  const isStabilitySecurityDomain = domain.key === 'financial_stability';
  const effectiveEnablers = isJoyEnergyDomain ? JOY_ENERGY_ENABLERS : isHealthBalanceDomain ? HEALTH_BALANCE_ENABLERS : isDirectionPurposeDomain ? DIRECTION_PURPOSE_ENABLERS : isGrowthResponsibilityDomain ? GROWTH_RESPONSIBILITY_ENABLERS : isBelongingSupportDomain ? BELONGING_SUPPORT_ENABLERS : isStabilitySecurityDomain ? STABILITY_SECURITY_ENABLERS : (currentDomainData?.enablers ?? []);
  const effectiveBarriers = isJoyEnergyDomain ? JOY_ENERGY_BARRIERS : isHealthBalanceDomain ? HEALTH_BALANCE_BARRIERS : isDirectionPurposeDomain ? DIRECTION_PURPOSE_BARRIERS : isGrowthResponsibilityDomain ? GROWTH_RESPONSIBILITY_BARRIERS : isBelongingSupportDomain ? BELONGING_SUPPORT_BARRIERS : isStabilitySecurityDomain ? STABILITY_SECURITY_BARRIERS : (currentDomainData?.barriers ?? []);
  const showEnablersBarriers = currentDomainData || isJoyEnergyDomain || isHealthBalanceDomain || isDirectionPurposeDomain || isGrowthResponsibilityDomain || isBelongingSupportDomain || isStabilitySecurityDomain;
  const useDemoEnablerBarrierHeadings = isJoyEnergyDomain || isHealthBalanceDomain || isDirectionPurposeDomain || isGrowthResponsibilityDomain || isBelongingSupportDomain || isStabilitySecurityDomain;

  const handleScoreChange = (questionKey: string, value: number) => {
    setScores(prev => ({ ...prev, [questionKey]: value }));
  };


  const isQuestionsComplete = () => {
    return score1 !== undefined && score2 !== undefined;
  };

  const isEnablersBarriersComplete = () => {
    // Require at least one enabler to be selected
    if (selectedEnablers.length === 0) {
      return false;
    }

    // Require at least one barrier to be selected
    if (selectedBarriers.length === 0) {
      return false;
    }

    // Check if "Other" selections have required text
    const enablerOtherValid = !selectedEnablers.includes('Other') || enablerOtherText.trim().length > 0;
    const barrierOtherValid = !selectedBarriers.includes('Other') || barrierOtherText.trim().length > 0;

    return enablerOtherValid && barrierOtherValid;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!isComplete) {
      setShowError(true);
      scrollToTop();
      return;
    }
    continueToNext();
  };

  const continueToNext = () => {
    setShowError(false);
    dispatch({ type: 'SET_FLOURISHING_SCORES', payload: scores });

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
      scrollToTop();
      // State will be restored/cleared by useEffect when currentDomain changes
    } else {
      dispatch({ type: 'SET_SECTION', payload: 5 }); // Go to Well-Being Intro
      scrollToTop();
    }
  };

  const handleEnablerToggle = (enabler: string) => {
    setSelectedEnablers(prev =>
      prev.includes(enabler)
        ? prev.filter(e => e !== enabler)
        : [...prev, enabler]
    );
    if (showError) {
      setShowError(false);
    }
  };

  const handleBarrierToggle = (barrier: string) => {
    setSelectedBarriers(prev =>
      prev.includes(barrier)
        ? prev.filter(b => b !== barrier)
        : [...prev, barrier]
    );
    if (showError) {
      setShowError(false);
    }
  };

  const handleBack = () => {
    if (currentDomain > 0) {
      setCurrentDomain(currentDomain - 1);
      scrollToTop();
    } else {
      dispatch({ type: 'SET_SECTION', payload: 3 }); // Go back to Flourishing Intro
      scrollToTop();
    }
  };

  const isComplete = isQuestionsComplete() && isEnablersBarriersComplete();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-3xl mx-auto">
        <div className="text-center">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
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

        {/* Error Message */}
        {showError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-semibold">
              {!isQuestionsComplete() && "Please answer both rating questions."}
              {isQuestionsComplete() && !isEnablersBarriersComplete() && (
                <>
                  {selectedEnablers.length === 0 && "Please select at least one enabler. "}
                  {selectedBarriers.length === 0 && "Please select at least one barrier. "}
                  {selectedEnablers.includes('Other') && !enablerOtherText.trim() && "Please specify your 'Other' enabler. "}
                  {selectedBarriers.includes('Other') && !barrierOtherText.trim() && "Please specify your 'Other' barrier."}
                </>
              )}
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* Domain Questions */}
          {domain.questions.map((question, index) => {
            const questionKey = questionKeys[index];
            const score = scores[questionKey as keyof typeof scores];

            return (
              <div key={index}>
                <label className="block text-base sm:text-lg font-medium text-slate-800 mb-4">
                  {question.text}
                </label>
                {/* Mobile-first responsive scale */}
                <div className="space-y-3">
                  {/* Scale labels */}
                  <div className="flex justify-between text-xs sm:text-sm text-slate-500 px-1">
                    <span className="text-left max-w-[45%] leading-tight">{question.scaleLabels.left}</span>
                    <span className="text-right max-w-[45%] leading-tight">{question.scaleLabels.right}</span>
                  </div>

                  {/* Rating buttons */}
                  <div className="grid grid-cols-11 gap-1 sm:gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <button
                        key={num}
                        onClick={() => handleScoreChange(questionKey, num)}
                        className={`aspect-square text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-colors ${score === num
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}


          {/* Enablers and Barriers Section */}
          {showEnablersBarriers && (
            <div className="space-y-6 border-t border-slate-200 pt-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">
                  Help us understand what supports or challenges your {domain.name.toLowerCase()}.
                </p>
                <p className="text-blue-700 text-sm">
                  Select at least one option for each category. <span className="text-red-600">*</span>
                </p>
              </div>

              {/* Enablers */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">
                  {useDemoEnablerBarrierHeadings ? 'Enablers – Select all that apply: ' : (
                    <>What helps me feel {domain.name.toLowerCase().includes('meaning') ? 'purposeful' :
                      domain.name.toLowerCase().includes('character') ? 'grow in character' :
                        domain.name.toLowerCase().includes('social') ? 'connected' :
                          'secure'}: </>
                  )}<span className="text-red-600">*</span>
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    {effectiveEnablers.map((enabler, index) => (
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
                        onChange={(e) => {
                          setEnablerOtherText(e.target.value);
                          if (showError) {
                            setShowError(false);
                          }
                        }}
                        placeholder="Please specify *"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Barriers */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">
                  {useDemoEnablerBarrierHeadings ? 'Barriers – Select all that apply: ' : (
                    <>What gets in the way of my {domain.name.toLowerCase().includes('meaning') ? 'feeling purposeful' :
                      domain.name.toLowerCase().includes('character') ? 'growth' :
                        domain.name.toLowerCase().includes('social') ? 'relationships' :
                          'security'}: </>
                  )}<span className="text-red-600">*</span>
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    {effectiveBarriers.map((barrier, index) => (
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
                        onChange={(e) => {
                          setBarrierOtherText(e.target.value);
                          if (showError) {
                            setShowError(false);
                          }
                        }}
                        placeholder="Please specify *"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between mt-8 sm:mt-12 space-y-4 sm:space-y-0">
          <button
            onClick={handleBack}
            className="flex items-center justify-center sm:justify-start px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {currentDomain < FLOURISHING_DOMAINS.length - 1 ? 'Next Domain' : 'Continue'}
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>

    </>
  );
}