import { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * SCHOOL WELL-BEING QUESTIONS WITH DOMAIN METADATA
 * 
 * Each question includes a 'domain' field to support domain-based filtering and analytics.
 * Questions are organized into 4 domains for better UX and dashboard reporting.
 * 
 * ⚠️ CRITICAL: Do not change 'key' or 'question' values - existing data depends on these!
 * 
 * Domain Structure:
 * - Health & Safety: Getting help, physical activity, emotional regulation, safety (4 questions)
 * - Enjoyment & Engagement: School enjoyment, participation, contribution (3 questions)
 * - Belonging: Sense of belonging, friendships, adult support (3 questions)
 * - Purpose & Growth: Connection to future goals (1 question)
 */
const SCHOOL_WELLBEING_QUESTIONS = [
  // === HEALTH & SAFETY DOMAIN ===
  {
    key: 'know_where_get_help', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'I know where to get help at school if I\'m struggling.',
    domain: 'Health & Safety'
  },
  {
    key: 'physical_activity', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'I get at least 60 minutes of physical activity most days.',
    domain: 'Health & Safety'
  },
  {
    key: 'manage_emotions', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'I know how to manage my emotions when I feel stressed.',
    domain: 'Health & Safety'
  },
  {
    key: 'feel_safe', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'I feel safe in and around my school.',
    domain: 'Health & Safety'
  },

  // === ENJOYMENT & ENGAGEMENT DOMAIN ===
  {
    key: 'enjoy_school_days', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'I enjoy most of my school days.',
    domain: 'Enjoyment & Engagement'
  },
  {
    key: 'resources_participation', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'I have what I need to participate fully in school activities.',
    domain: 'Enjoyment & Engagement'
  },
  {
    key: 'contribute_bigger_purpose', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'I have opportunities at school to contribute to something bigger than myself.',
    domain: 'Enjoyment & Engagement'
  },

  // === BELONGING DOMAIN ===
  {
    key: 'belonging_score', // ⚠️ DO NOT CHANGE - used for data storage
    question: ' I feel a strong sense of belonging at my school.',
    domain: 'Belonging'
  },
  {
    key: 'supportive_friends', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'I have friends at school who support me.',
    domain: 'Belonging'
  },
  {
    key: 'trusted_adult', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'I have at least one trusted adult at school I can talk to if I need help.',
    domain: 'Belonging'
  },

  // === PURPOSE & GROWTH DOMAIN ===
  {
    key: 'work_connected_goals', // ⚠️ DO NOT CHANGE - used for data storage
    question: 'My schoolwork feels connected to my future goals.',
    domain: 'Purpose & Growth'
  }
];

const WELLBEING_CHECKLIST = [
  'I have at least one teacher who knows me well.',
  'I participate in school sports or regular physical activity.',
  'I participate in arts, music, or creative activities at school.',
  'I have time during the school week for fun, play, or humor.',
  'I spend time in nature at or near school.'
];

export default function SchoolWellbeingSection() {
  const { state, dispatch } = useSurvey();
  const [scores, setScores] = useState(state.schoolWellbeing);
  const [checklist, setChecklist] = useState<string[]>(
    state.schoolWellbeing.wellbeingChecklist || []
  );

  const handleScoreChange = (key: string, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }));
  };

  const handleChecklistToggle = (item: string) => {
    setChecklist(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_SCHOOL_WELLBEING', payload: { ...scores, wellbeingChecklist: checklist } });
    dispatch({ type: 'SET_SECTION', payload: 7 }); // Go to Tensions Intro
    scrollToTop();
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: 5 }); // Go back to Well-Being Intro
    scrollToTop();
  };

  const allQuestionsAnswered = SCHOOL_WELLBEING_QUESTIONS.every(q =>
    scores[q.key as keyof typeof scores] !== undefined
  );

  /**
   * Helper function to group questions by domain for organized rendering
   * This structure supports future dashboard analytics by domain
   */
  const groupQuestionsByDomain = () => {
    const domains: { [key: string]: typeof SCHOOL_WELLBEING_QUESTIONS } = {};
    SCHOOL_WELLBEING_QUESTIONS.forEach(question => {
      if (!domains[question.domain]) {
        domains[question.domain] = [];
      }
      domains[question.domain].push(question);
    });
    return domains;
  };

  const questionsByDomain = groupQuestionsByDomain();

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">School-Influenced Well-Being</h2>
        <p className="text-slate-600">
          These questions focus specifically on your experience at this institution and how it impacts your overall well-being.
        </p>
      </div>

      {/* 
        UI LAYOUT CHANGES: Questions grouped by domain with visual hierarchy
        - Domain headers provide context and structure
        - Card-based design with clear separation between domains
        - Enhanced spacing and backgrounds for better readability
        - Mobile-responsive design maintained
        - All question keys, wording, and scales remain unchanged
      */}
      <div className="space-y-8">
        {/* Render questions grouped by domain as distinct cards */}
        {Object.entries(questionsByDomain).map(([domain, questions]) => (
          <div
            key={domain}
            className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Domain Header - provides visual grouping */}
            <div className="bg-gradient-to-r from-teal-50 to-slate-50 border-b border-slate-200 px-4 sm:px-6 py-4">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-teal-500 rounded-full mr-3"></div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                  {domain}
                </h3>
              </div>
            </div>

            {/* Questions within this domain */}
            <div className="p-4 sm:p-6 space-y-8 bg-white">
              {questions.map((item) => {
                const score = scores[item.key as keyof typeof scores];

                return (
                  <div key={item.key}>
                    <label className="block text-base sm:text-lg font-medium text-slate-800 mb-4">
                      {item.question}
                    </label>
                    {/* Mobile-first responsive scale - UNCHANGED */}
                    <div className="space-y-3">
                      {/* Scale labels - UNCHANGED 0-10 scale */}
                      <div className="flex justify-between text-xs sm:text-sm text-slate-500 px-1">
                        <span className="text-left">Not at all</span>
                        <span className="text-right">Completely</span>
                      </div>

                      {/* Rating buttons - UNCHANGED */}
                      <div className="grid grid-cols-11 gap-1 sm:gap-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <button
                            key={num}
                            onClick={() => handleScoreChange(item.key, num)}
                            className={`aspect-square text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-colors ${score === num
                              ? 'bg-teal-600 text-white'
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
            </div>
          </div>
        ))}

        {/* School Engagement Checklist */}
        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            School Well-Being Drivers Checklist
          </h3>
          <p className="text-slate-600 mb-4">
            Which of the following statements apply to you? (Select all that apply)
          </p>
          <div className="grid grid-cols-1 gap-3">
            {WELLBEING_CHECKLIST.map((item) => (
              <label key={item} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.includes(item)}
                  onChange={() => handleChecklistToggle(item)}
                  className="h-5 w-5 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="ml-3 text-slate-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
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
          disabled={!allQuestionsAnswered}
          className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
}