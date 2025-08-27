import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSurvey } from '../../contexts/SurveyContext';
import ProgressBar from './ProgressBar';
import StartPage from './sections/StartPage';
import DemographicsSection from './sections/DemographicsSection';
import FlourishingSection from './sections/FlourishingSection';
import SchoolWellbeingSection from './sections/SchoolWellbeingSection';
import TensionsSection from './sections/TensionsSection';
import FastestWinSection from './sections/FastestWinSection';
import WrapUpSection from './sections/WrapUpSection';
import { generateSessionId } from '../../utils/helpers';

const SECTIONS = [
  { name: 'Start', component: StartPage },
  { name: 'Demographics', component: DemographicsSection },
  { name: 'Core Flourishing', component: FlourishingSection },
  { name: 'School Well-Being', component: SchoolWellbeingSection },
  { name: 'Tensions Assessment', component: TensionsSection },
  { name: 'Fastest Win', component: FastestWinSection },
  { name: 'Complete', component: WrapUpSection }
];

export default function SurveyFlow() {
  const { universitySlug } = useParams<{ universitySlug: string }>();
  const { state, dispatch } = useSurvey();

  useEffect(() => {
    if (universitySlug && !state.sessionId) {
      dispatch({
        type: 'INITIALIZE_SURVEY',
        payload: {
          sessionId: generateSessionId(),
          universitySlug
        }
      });
    }
  }, [universitySlug, state.sessionId, dispatch]);

  if (!universitySlug) {
    return <Navigate to="/" replace />;
  }

  if (state.isCompleted) {
    return <Navigate to="/" replace />;
  }

  const CurrentSection = SECTIONS[state.currentSection]?.component;

  if (!CurrentSection) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-800">
              Student Flourishing Survey
            </h1>
            <div className="text-sm text-slate-600">
              Section {state.currentSection + 1} of {SECTIONS.length}
            </div>
          </div>
          <ProgressBar 
            currentSection={state.currentSection} 
            totalSections={SECTIONS.length} 
            sections={SECTIONS.map(s => s.name)}
          />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <CurrentSection />
      </main>
    </div>
  );
}