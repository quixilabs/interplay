import React, { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TENSION_PAIRS = [
  {
    key: 'performance_wellbeing',
    left: 'High Performance',
    right: 'Well-Being',
    description: 'How do you balance achieving high performance with maintaining your well-being?'
  },
  {
    key: 'ambition_contribution',
    left: 'Personal Ambition',
    right: 'Contributing to Others',
    description: 'How do you balance pursuing your own goals with helping others achieve theirs?'
  },
  {
    key: 'selfreliance_connection',
    left: 'Self-Reliance',
    right: 'Connection to Others',
    description: 'How do you balance being independent with staying connected to your community?'
  },
  {
    key: 'stability_growth',
    left: 'Stability & Security',
    right: 'Growth & Adventure',
    description: 'How do you balance seeking security with pursuing new growth opportunities?'
  },
  {
    key: 'academic_creative',
    left: 'Academic Excellence',
    right: 'Creative Expression',
    description: 'How do you balance academic achievement with creative and artistic pursuits?'
  }
];

export default function TensionsSection() {
  const { state, dispatch } = useSurvey();
  const [values, setValues] = useState(state.tensionsAssessment);

  const handleSliderChange = (key: string, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    dispatch({ type: 'SET_TENSIONS_ASSESSMENT', payload: values });
    dispatch({ type: 'SET_SECTION', payload: 5 });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: 3 });
  };

  const allTensionsAnswered = TENSION_PAIRS.every(pair => 
    values[pair.key as keyof typeof values] !== undefined
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tensions Self-Check</h2>
        <p className="text-slate-600">
          Life often involves balancing competing priorities. For each pair below, move the slider to show 
          where you currently find yourself in balancing these two important areas.
        </p>
      </div>

      <div className="space-y-10">
        {TENSION_PAIRS.map((pair, index) => {
          const value = values[pair.key as keyof typeof values] || 50;
          
          return (
            <div key={pair.key} className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {pair.description}
              </h3>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-slate-700 flex-1 text-left">
                    {pair.left}
                  </span>
                  <span className="text-sm font-medium text-slate-700 flex-1 text-right">
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
                    className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #dbeafe 0%, #e879f9 ${value}%, #a7f3d0 100%)`
                    }}
                  />
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-slate-400 rounded-full shadow-lg pointer-events-none"
                    style={{ left: `calc(${value}% - 12px)` }}
                  />
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
                
                <div className="text-center mt-3">
                  <span className="inline-block px-3 py-1 bg-slate-200 rounded-full text-sm text-slate-700">
                    Current balance: {value}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Remember:</strong> There's no "right" answer here. This is about understanding your current 
          approach to balancing these important aspects of life as a student.
        </p>
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
          disabled={!allTensionsAnswered}
          className="flex items-center bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
}