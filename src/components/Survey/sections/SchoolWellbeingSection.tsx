import { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SCHOOL_WELLBEING_QUESTIONS = [
  {
    key: 'belonging_score',
    question: ' I feel a strong sense of belonging at my school.'
  },
  {
    key: 'enjoy_school_days',
    question: 'I enjoy most of my school days.'
  },
  {
    key: 'physical_activity',
    question: 'I get at least 60 minutes of physical activity most days.'
  },
  {
    key: 'feel_safe',
    question: 'I feel safe in and around my school.'
  },
  {
    key: 'work_connected_goals',
    question: 'My schoolwork feels connected to my future goals.'
  },
  {
    key: 'contribute_bigger_purpose',
    question: 'I have opportunities at school to contribute to something bigger than myself.'
  },
  {
    key: 'kind_to_others',
    question: 'I am kind to others at school each day.'
  },
  {
    key: 'manage_emotions',
    question: 'I know how to manage my emotions when I feel stressed.'
  },
  {
    key: 'trusted_adult',
    question: 'I have at least one trusted adult at school I can talk to if I need help.'
  },
  {
    key: 'supportive_friends',
    question: 'I have friends at school who support me.'
  },
  {
    key: 'resources_participation',
    question: 'I have what I need to participate fully in school activities.'
  }
];

const WELLBEING_CHECKLIST = [
  'I have at least one teacher who knows me well.',
  'I participate in school sports or regular physical activity.',
  'I participate in arts, music, or creative activities at school.',
  'I have opportunities for service learning or helping the community.',
  'I have time during the school week for fun, play, or humor.',
  'I spend time in nature at or near school.',
  'My school celebrates student kindness and respect.',
  'I know where to get help at school if I’m struggling.'
];

export default function SchoolWellbeingSection() {
  const { state, dispatch } = useSurvey();
  const [scores, setScores] = useState(state.schoolWellbeing);
  const [checklist, setChecklist] = useState<string[]>([]);

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

  const handleNext = () => {
    dispatch({ type: 'SET_SCHOOL_WELLBEING', payload: { ...scores, wellbeingChecklist: checklist } });
    dispatch({ type: 'SET_SECTION', payload: 7 }); // Go to Tensions Intro
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: 5 }); // Go back to Well-Being Intro
  };

  const allQuestionsAnswered = SCHOOL_WELLBEING_QUESTIONS.every(q =>
    scores[q.key as keyof typeof scores] !== undefined
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">School-Influenced Well-Being</h2>
        <p className="text-slate-600">
          These questions focus specifically on your experience at this institution and how it impacts your overall well-being.
        </p>
      </div>

      <div className="space-y-8">
        {/* School Well-Being Questions */}
        {SCHOOL_WELLBEING_QUESTIONS.map((item) => {
          const score = scores[item.key as keyof typeof scores];

          return (
            <div key={item.key}>
              <label className="block text-lg font-medium text-slate-800 mb-4">
                {item.question}
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500 w-16">Not at all</span>
                <div className="flex space-x-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <button
                      key={num}
                      onClick={() => handleScoreChange(item.key, num)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${score === num
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-slate-500 w-16">Completely</span>
              </div>
            </div>
          );
        })}

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
          disabled={!allQuestionsAnswered}
          className="flex items-center bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
}