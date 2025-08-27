import React, { useState } from 'react';
import { useSurvey } from '../../contexts/SurveyContext';
import { X, Lightbulb } from 'lucide-react';

const ENABLER_OPTIONS = [
  'Better time management',
  'More social connections',
  'Improved physical health',
  'Mental health support',
  'Financial assistance',
  'Academic support',
  'Career guidance',
  'Family support',
  'Stress reduction',
  'Better sleep habits',
  'Spiritual/religious community',
  'Creative outlets'
];

const BARRIER_OPTIONS = [
  'Time constraints',
  'Financial stress',
  'Academic pressure',
  'Social isolation',
  'Health issues',
  'Family responsibilities',
  'Work obligations',
  'Lack of resources',
  'Low motivation',
  'Anxiety/depression',
  'Lack of direction',
  'Other commitments'
];

interface GrowthModuleModalProps {
  domainName: string;
  onComplete: () => void;
  onClose: () => void;
}

export default function GrowthModuleModal({ domainName, onComplete, onClose }: GrowthModuleModalProps) {
  const { dispatch } = useSurvey();
  const [selectedEnablers, setSelectedEnablers] = useState<string[]>([]);
  const [selectedBarrier, setSelectedBarrier] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');

  const handleEnablerToggle = (enabler: string) => {
    if (selectedEnablers.includes(enabler)) {
      setSelectedEnablers(selectedEnablers.filter(e => e !== enabler));
    } else if (selectedEnablers.length < 2) {
      setSelectedEnablers([...selectedEnablers, enabler]);
    }
  };

  const handleSubmit = () => {
    dispatch({
      type: 'ADD_GROWTH_MODULE',
      payload: {
        domainName,
        enablerSelections: selectedEnablers,
        barrierSelection: selectedBarrier,
        additionalComments
      }
    });
    onComplete();
  };

  const isValid = selectedEnablers.length > 0 && selectedBarrier;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Growth Opportunities: {domainName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-slate-600">
            Since you scored lower in this area, let's explore what could help you improve.
          </p>

          {/* Enablers */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              What would help increase your score in this area? (Select up to 2)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ENABLER_OPTIONS.map(option => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEnablers.includes(option)}
                    onChange={() => handleEnablerToggle(option)}
                    disabled={!selectedEnablers.includes(option) && selectedEnablers.length >= 2}
                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className={`ml-3 text-slate-700 ${
                    !selectedEnablers.includes(option) && selectedEnablers.length >= 2
                      ? 'opacity-50'
                      : ''
                  }`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Selected: {selectedEnablers.length}/2
            </p>
          </div>

          {/* Barriers */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              What's the biggest barrier preventing improvement in this area?
            </h3>
            <div className="space-y-2">
              {BARRIER_OPTIONS.map(option => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="barrier"
                    value={option}
                    checked={selectedBarrier === option}
                    onChange={(e) => setSelectedBarrier(e.target.value)}
                    className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-slate-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Additional thoughts (optional)
            </h3>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Any other thoughts about what would help you in this area?"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-2 rounded-lg font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}