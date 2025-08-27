import React, { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SCHOOL_WELLBEING_QUESTIONS = [
  {
    key: 'belonging_score',
    question: 'How much do you feel you belong at this school?'
  },
  {
    key: 'enjoy_school_days',
    question: 'How much do you enjoy your school days?'
  },
  {
    key: 'physical_activity',
    question: 'How often do you get physical activity that makes you feel energized?'
  },
  {
    key: 'feel_safe',
    question: 'How safe do you feel at school?'
  },
  {
    key: 'work_connected_goals',
    question: 'How connected is your school work to your goals and interests?'
  },
  {
    key: 'contribute_bigger_purpose',
    question: 'How much does your school experience help you contribute to a bigger purpose?'
  },
  {
    key: 'kind_to_others',
    question: 'How often are you kind and helpful to others at school?'
  },
  {
    key: 'manage_emotions',
    question: 'How well are you able to manage your emotions during challenging times at school?'
  },
  {
    key: 'trusted_adult',
    question: 'How much do you have at least one trusted adult at school you can talk to?'
  },
  {
    key: 'supportive_friends',
    question: 'How much do you have supportive friends at school?'
  },
  {
    key: 'resources_participation',
    question: 'How much do you have access to resources and opportunities to participate in school activities that interest you?'
  }
];

const WELLBEING_CHECKLIST = [
  'I feel connected to my school community',
  'I have meaningful relationships with faculty/staff',
  'I participate in extracurricular activities',
  'I use campus mental health resources when needed',
  'I feel comfortable expressing my identity on campus',
  'I have academic support when I need it',
  'I feel physically safe on campus',
  'I can balance academic and personal life effectively'
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
    dispatch({ type: 'SET_SECTION', payload: 4 });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: 2 });
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
        {SCHOOL_WELLBEING_QUESTIONS.map((item, index) => {
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
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        score === num
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
            {WELLBEING_CHECKLIST.map((item, index) => (
              <label key={index} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
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