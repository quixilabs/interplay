import { useState } from 'react';
import { useSurvey } from '../../../contexts/SurveyContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * SCHOOL SUPPORT BARRIERS - VERSION 2 (CHECKBOX FORMAT)
 * 
 * This section identifies specific support barriers students experience at their school.
 * Students can select 0 to 15 statements that describe challenges they're facing.
 * 
 * Each statement is mapped to a support driver for backend analytics:
 * - Access: Finding resources and getting help when needed
 * - Guidance: Academic/career direction and planning support
 * - Connection: Social relationships and sense of belonging
 * - Trust: Reliability and consistency of institutional support
 * - Care: Empathy and understanding from staff/faculty
 * 
 * ⚠️ CRITICAL: Assessment version = v2. Do not change statement text - dashboard analytics depend on this!
 */

/**
 * Support driver mapping for backend analytics
 * Not visible to students - used for scoring and dashboard categorization
 */
export const SUPPORT_DRIVER_MAPPING = {
  1: { statement: "I don't feel understood or supported when I'm struggling.", driver: "care" },
  2: { statement: "It's hard to find information about campus resources.", driver: "access" },
  3: { statement: "I'm unsure about my academic or career direction.", driver: "guidance" },
  4: { statement: "My messages or emails aren't answered in a timely way.", driver: "trust" },
  5: { statement: "I don't have a mentor or someone I can turn to.", driver: "connection" },
  6: { statement: "Staff or faculty don't show empathy when I raise a concern.", driver: "care" },
  7: { statement: "I want more help planning my next steps.", driver: "guidance" },
  8: { statement: "It's hard for me to make friends here.", driver: "connection" },
  9: { statement: "I'm confused about which courses I need to take.", driver: "guidance" },
  10: { statement: "Communication from the school feels unclear or inconsistent.", driver: "trust" },
  11: { statement: "I don't feel connected to other students.", driver: "connection" },
  12: { statement: "I'm often bounced between offices when trying to get help.", driver: "trust" },
  13: { statement: "I don't feel like the school cares about students like me.", driver: "care" },
  14: { statement: "I don't know where to go when I need help.", driver: "access" },
  15: { statement: "It takes too long to get an appointment when I need support.", driver: "access" }
} as const;

/**
 * Ordered list of statements for UI display
 */
const SUPPORT_BARRIERS_STATEMENTS = Object.entries(SUPPORT_DRIVER_MAPPING).map(([id, data]) => ({
  id: parseInt(id),
  statement: data.statement,
  driver: data.driver
}));

export default function SchoolWellbeingSection() {
  const { state, dispatch } = useSurvey();

  // Initialize checkbox state from context or as empty object
  // Format: { statement_1: boolean, statement_2: boolean, ... }
  const initialCheckboxState: Record<string, boolean> = {};
  if (state.schoolWellbeing?.assessment_version === 'v2') {
    // Extract only the statement_X fields
    Object.keys(state.schoolWellbeing).forEach(key => {
      if (key.startsWith('statement_')) {
        const value = state.schoolWellbeing[key];
        if (typeof value === 'boolean') {
          initialCheckboxState[key] = value;
        }
      }
    });
  }

  const [selectedBarriers, setSelectedBarriers] = useState<Record<string, boolean>>(initialCheckboxState);

  const handleCheckboxToggle = (statementId: number) => {
    const key = `statement_${statementId}`;
    setSelectedBarriers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    // Save checkbox responses with v2 version tag
    const responseData = {
      ...selectedBarriers,
      assessment_version: 'v2' as const
    };
    dispatch({ type: 'SET_SCHOOL_WELLBEING', payload: responseData });
    dispatch({ type: 'SET_SECTION', payload: 7 }); // Go to Tensions Intro
    scrollToTop();
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: 5 }); // Go back to Well-Being Intro
    scrollToTop();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Tell Us About the Support You Receive
        </h2>
        <p className="text-slate-600">
          Please tell us about your experience getting support at the school. There are no right or wrong answers — Just select everything that feels true for you right now. (Choose all that apply.)
        </p>
      </div>

      {/* Checkbox list - clean vertical layout */}
      <div className="space-y-3 mb-8">
        {SUPPORT_BARRIERS_STATEMENTS.map((item) => {
          const key = `statement_${item.id}`;
          const isChecked = selectedBarriers[key] || false;

          return (
            <label
              key={item.id}
              className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer group"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckboxToggle(item.id)}
                className="mt-0.5 h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 cursor-pointer"
                aria-label={item.statement}
              />

              {/* Statement text */}
              <span className="flex-1 text-base text-slate-800 leading-relaxed select-none">
                {item.statement}
              </span>
            </label>
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
          className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
}