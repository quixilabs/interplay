import React, { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { Clock, Shield, Users } from 'lucide-react';

export default function StartPage() {
  const { state, dispatch } = useSurvey();
  const [consentChecked, setConsentChecked] = useState(state.consentGiven);

  const handleNext = () => {
    if (consentChecked) {
      dispatch({ type: 'SET_CONSENT', payload: true });
      dispatch({ type: 'SET_SECTION', payload: 1 });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Your Voice Powers Youth Flourishing
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Interplay™ is the first Flourishing Intelligence™ platform built for colleges and universities. We capture authentic student perspectives, map them across Harvard’s six validated domains of well-being, and deliver actionable, research-backed strategies to improve engagement, retention, and student success.
        </p>
      </div>

      {/* Key Information Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <Clock className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-800">10 Minutes</h3>
            <p className="text-sm text-blue-600">Average completion time</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
          <Shield className="h-6 w-6 text-green-600 mt-1" />
          <div>
            <h3 className="font-semibold text-green-800">Anonymous</h3>
            <p className="text-sm text-green-600">Your responses are confidential</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
          <Users className="h-6 w-6 text-purple-600 mt-1" />
          <div>
            <h3 className="font-semibold text-purple-800">Meaningful Impact</h3>
            <p className="text-sm text-purple-600">Help improve student experience</p>
          </div>
        </div>
      </div>

      {/* Survey Description */}
      <div className="bg-slate-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">What to Expect</h2>
        <div className="space-y-3 text-slate-700">
          <p>• <strong>Your Story ⎯</strong> Share a bit about yourself and your student journey.</p>
          <p>• <strong>Flourishing Check-In ⎯</strong> Evidence-based questions across six domains of well-being: happiness, health, purpose, character, relationships, and financial stability.</p>
          <p>• <strong>Campus Experience ⎯</strong> Reflect on how your university’s culture, resources, and support systems are shaping your growth.</p>
          <p>• <strong>Opportunities for Impact ⎯</strong> Highlight where you see gaps or tensions so your feedback leads directly to actionable strategies.</p>
          <p>• <strong>Shaping the Future ⎯</strong> Your voice helps your university strengthen student flourishing and success.</p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <h3 className="font-semibold text-yellow-800 mb-2">Privacy & Confidentiality</h3>
        <p className="text-sm text-yellow-700">
          Your responses are completely anonymous and will be used only in aggregate to improve university programs and services.
          No individual responses will be shared, and participation is entirely voluntary. You may skip questions or stop at any time.
        </p>
      </div>

      {/* Consent Checkbox */}
      <div className="mb-8">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-1 h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="text-slate-900 font-medium">
              I understand and consent to participate in this survey
            </span>
            <p className="text-sm text-slate-600 mt-1">
              I understand that my participation is voluntary, my responses are anonymous, and I can stop at any time.
            </p>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!consentChecked}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Begin Survey
        </button>
      </div>
    </div>
  );
}