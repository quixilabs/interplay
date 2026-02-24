import { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Demo content – same keys preserved for state/DB compatibility
const TENSION_PAIRS = [
  {
    key: 'performance_wellbeing',
    left: 'Academic Performance',
    right: 'Personal Well-Being',
    description: 'When it comes to school and your well-being, where do you feel the stronger pull right now?'
  },
  {
    key: 'ambition_contribution',
    left: 'Independence',
    right: 'Asking for Help',
    description: 'When things feel hard, where do you tend to lean?'
  },
  {
    key: 'selfreliance_connection',
    left: 'Current Responsibilities',
    right: 'Planning for the Future',
    description: 'In this season, where is most of your energy going?'
  },
  {
    key: 'stability_growth',
    left: 'Coursework',
    right: 'Life Outside School',
    description: 'Where do you feel more pressure right now?'
  },
  {
    key: 'academic_creative',
    left: 'I prefer clear direction',
    right: "I'm comfortable figuring it out as I go",
    description: 'When things feel uncertain, where do you tend to lean?'
  }
];

export default function TensionsSection() {
  const { state, dispatch } = useSurvey();
  const [values, setValues] = useState(state.tensionsAssessment);

  const handleSliderChange = (key: string, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_TENSIONS_ASSESSMENT', payload: values });
    dispatch({ type: 'SET_SECTION', payload: 9 }); // Go to Fastest Win
    scrollToTop();
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: 7 }); // Go back to Tensions Intro
    scrollToTop();
  };

  const allTensionsAnswered = TENSION_PAIRS.every(pair =>
    values[pair.key as keyof typeof values] !== undefined
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Navigating Competing Demands</h2>
        <p className="text-slate-600">
          College often requires holding two important priorities at the same time. For each pair, move the slider toward where you feel pulled right now.
        </p>
      </div>

      <div className="space-y-10">
        {TENSION_PAIRS.map((pair) => {
          const value = values[pair.key as keyof typeof values] || 50;

          return (
            <div key={pair.key} className="bg-slate-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                {pair.description}
              </h3>

              <div className="mt-4 sm:mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs sm:text-sm font-medium text-slate-700 flex-1 text-left max-w-[45%] leading-tight">
                    {pair.left}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-700 flex-1 text-right max-w-[45%] leading-tight">
                    {pair.right}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleSliderChange(pair.key, parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-slate-400 rounded-full shadow-lg pointer-events-none"
                    style={{ left: `calc(${value}% - 12px)` }}
                  />
                </div>

                {value !== 50 && (
                  <div className="text-center mt-3">
                    <span className="inline-block px-3 py-1 bg-slate-200 rounded-full text-sm text-slate-700">
                      {pair.left}: {100 - value}% | {pair.right}: {value}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
          disabled={!allTensionsAnswered}
          className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
}