import { useSurvey } from '../../../contexts/SurveyContext';
import { CheckCircle, Heart, TrendingUp } from 'lucide-react';
import { debugLog } from '../../../utils/debug';

export default function WrapUpSection() {
  const { state, dispatch } = useSurvey();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_SURVEY' });
    scrollToTop();

    // Here you would typically submit the survey data to your backend
    debugLog('Survey completed:', state);
  };

  const calculateCompletionTime = () => {
    if (state.startTime) {
      const start = new Date(state.startTime);
      const end = new Date();
      const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      return diffMinutes;
    }
    return 0;
  };

  const completionTime = calculateCompletionTime();

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Thank you for sharing your voice! 🎉
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
          Interplay translates your feedback into a research-based measure of flourishing, highlighting what’s working and where support is needed. Your input helps your university act quickly and wisely so every student has the best chance to thrive.
        </p>
      </div>

      {/* Survey Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-800">{completionTime} min</div>
          <div className="text-sm text-blue-600">Completion time</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-800">6</div>
          <div className="text-sm text-purple-600">Domains assessed</div>
        </div>

        <div className="text-center p-4 bg-teal-50 rounded-lg">
          <CheckCircle className="h-8 w-8 text-teal-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-teal-800">100%</div>
          <div className="text-sm text-teal-600">Survey completed</div>
        </div>
      </div>

      {/* Impact Message */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Your Impact</h3>
        <p className="text-blue-800 mb-3">
          Your responses will help university administrators understand student needs and make
          data-driven decisions about:
        </p>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• Mental health and wellness program improvements</li>
          <li>• Campus resource allocation and accessibility</li>
          <li>• Academic policy adjustments</li>
          <li>• Student support service enhancements</li>
          <li>• Campus culture and community building initiatives</li>
        </ul>
      </div>

      {/* Privacy Reminder */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <h4 className="font-semibold text-green-800 mb-2">Privacy Protection</h4>
        <p className="text-sm text-green-700">
          Your survey responses remain completely anonymous. Your answers will not be linked
          to any personally identifiable information.
        </p>
      </div>

      {/* Completion Button */}
      <div className="text-center">
        <button
          onClick={handleComplete}
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
        >
          Complete Survey
        </button>
        <p className="text-sm text-slate-500 mt-4">
          Thank you for taking the time to share your experience!
        </p>
      </div>
    </div>
  );
}