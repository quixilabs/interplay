import { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

export default function FastestWinSection() {
  const { state, dispatch } = useSurvey();
  const [suggestion, setSuggestion] = useState(state.textResponses.fastestWinSuggestion || '');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    dispatch({
      type: 'SET_TEXT_RESPONSES',
      payload: {
        ...state.textResponses,
        fastestWinSuggestion: suggestion
      }
    });
    dispatch({ type: 'SET_SECTION', payload: 10 }); // Go to Complete
    scrollToTop();
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: 8 }); // Go back to Tensions Assessment
    scrollToTop();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Your Fastest Win Suggestion</h2>
        </div>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Based on your responses, you've shared insights about your flourishing experience.
          Now we'd love to hear your ideas for improvement.
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">
          💡 Measure What Matters
        </h3>
        <p className="text-orange-700">
          Student feedback directly influences university decisions about programs, resources, and policies.
          Your suggestion could spark meaningful change for the entire campus community.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-lg sm:text-xl font-semibold text-slate-900 mb-4">
            If the school could change ONE thing to help you improve your well-being the fastest, what should it be?
          </label>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Share your idea for the most impactful change the university could make to improve student well-being. Be as specific or general as you'd like..."
            className="w-full px-4 py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-slate-900"
            rows={6}
          />
          <p className="text-sm text-slate-500 mt-2">
            This could be anything: academic policies, campus resources, physical spaces, programs, services, or cultural changes.
          </p>
        </div>

        {/* Example Suggestions */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-slate-800 mb-3">Examples of past student suggestions:</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• "More flexible deadlines during high-stress periods"</li>
            <li>• "Better late-night food options for students with evening classes"</li>
            <li>• "Meditation and quiet spaces across campus for stress relief"</li>
            <li>• "Financial wellness workshops and budgeting support"</li>
            <li>• "More diverse counseling staff who understand different cultural backgrounds"</li>
            <li>• "Study abroad programs that are more financially accessible"</li>
          </ul>
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
          disabled={suggestion.trim().length === 0}
          className="flex items-center justify-center bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
}