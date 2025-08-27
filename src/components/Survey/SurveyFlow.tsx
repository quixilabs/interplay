import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSurvey } from '../../contexts/SurveyContext';
import UniversityValidator from './UniversityValidator';
import ProgressBar from './ProgressBar';
import StartPage from './sections/StartPage';
import DemographicsSection from './sections/DemographicsSection';
import FlourishingSection from './sections/FlourishingSection';
import SchoolWellbeingSection from './sections/SchoolWellbeingSection';
import TensionsSection from './sections/TensionsSection';
import FastestWinSection from './sections/FastestWinSection';
import WrapUpSection from './sections/WrapUpSection';
import { generateSessionId } from '../../utils/helpers';
import { SurveyService } from '../../services/surveyService';

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
      const sessionId = generateSessionId();
      dispatch({
        type: 'INITIALIZE_SURVEY',
        payload: {
          sessionId,
          universitySlug
        }
      });

      // Initialize survey in database asynchronously
      SurveyService.initializeSurvey(sessionId, universitySlug)
        .then(() => {
          dispatch({ type: 'SET_INITIALIZED', payload: true });
        })
        .catch(console.error);
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
    <UniversityValidator universitySlug={universitySlug}>
      <div className="min-h-screen bg-light-gray">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md shadow-brand border-b border-gray-200/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-navy font-primary">
                Student Success Survey
              </h1>
              <div className="text-sm text-warm-gray font-primary">
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
    </UniversityValidator>
  );
}