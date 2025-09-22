import { useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSurvey } from '../../contexts/SurveyContext';
import UniversityValidator from './UniversityValidator';
import ProgressBar from './ProgressBar';
import StartPage from './sections/StartPage';
import SectionIntro from './sections/SectionIntro';
import DemographicsSection from './sections/DemographicsSection';
import FlourishingSection from './sections/FlourishingSection';
import SchoolWellbeingSection from './sections/SchoolWellbeingSection';
import TensionsSection from './sections/TensionsSection';
import FastestWinSection from './sections/FastestWinSection';
import WrapUpSection from './sections/WrapUpSection';
import { generateSessionId } from '../../utils/helpers';
import { SurveyService } from '../../services/surveyService';
import { UniversityService } from '../../services/universityService';
import { useState } from 'react';

// Section intro texts
const SECTION_INTROS = {
  demographics: {
    title: 'About You',
    description: 'These questions help us understand different student experiences and ensure all voices are represented in our analysis. Your responses will remain completely anonymous and confidential.'
  },
  flourishing: {
    title: 'Core Flourishing Domains',
    description: 'These questions are built on a research-validated measure of flourishing, developed at Harvard, and adapted for your university through Interplay. Your answers help us understand well-being in a holistic way—so your school can respond where it matters most.'
  },
  wellbeing: {
    title: 'School Well-Being',
    description: 'These questions focus specifically on your experience at this institution and how it impacts your overall well-being. Your insights help us understand what\'s working well and where there are opportunities for improvement.'
  },
  tensions: {
    title: 'Tensions Self-Check',
    description: 'Sometimes thriving means balancing two important things that can feel in tension—like focusing on performance vs. caring for your well-being. These sliders help us see where students feel pulled, so your university can better support both sides.'
  }
};

const SECTIONS = [
  { name: 'Start', component: StartPage, type: 'content' },
  { name: 'Demographics Intro', component: null, type: 'intro', introKey: 'demographics' },
  { name: 'Demographics', component: DemographicsSection, type: 'content' },
  { name: 'Flourishing Intro', component: null, type: 'intro', introKey: 'flourishing' },
  { name: 'Core Flourishing', component: FlourishingSection, type: 'content' },
  { name: 'Well-Being Intro', component: null, type: 'intro', introKey: 'wellbeing' },
  { name: 'School Well-Being', component: SchoolWellbeingSection, type: 'content' },
  { name: 'Tensions Intro', component: null, type: 'intro', introKey: 'tensions' },
  { name: 'Tensions Assessment', component: TensionsSection, type: 'content' },
  { name: 'Fastest Win', component: FastestWinSection, type: 'content' },
  { name: 'Complete', component: WrapUpSection, type: 'content' }
];

export default function SurveyFlow() {
  const { universitySlug } = useParams<{ universitySlug: string }>();
  const { state, dispatch } = useSurvey();
  const initializingRef = useRef(false);
  const [universityName, setUniversityName] = useState<string>('');

  useEffect(() => {
    if (universitySlug && !state.sessionId && !initializingRef.current) {
      initializingRef.current = true; // Prevent duplicate initialization during this effect
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
        .catch((error) => {
          console.error('Failed to initialize survey:', error);
        })
        .finally(() => {
          initializingRef.current = false; // Reset after completion/error
        });
    }
  }, [universitySlug, state.sessionId, dispatch]);

  // Reset initialization ref when university slug changes
  useEffect(() => {
    initializingRef.current = false;
  }, [universitySlug]);

  // Load university name for display
  useEffect(() => {
    const loadUniversityName = async () => {
      if (universitySlug) {
        try {
          const university = await UniversityService.getUniversityBySlug(universitySlug);
          if (university) {
            setUniversityName(university.name);
          }
        } catch (error) {
          console.error('Failed to load university name:', error);
        }
      }
    };

    loadUniversityName();
  }, [universitySlug]);

  if (!universitySlug) {
    return <Navigate to="/" replace />;
  }

  if (state.isCompleted) {
    return <Navigate to="/" replace />;
  }

  const currentSectionData = SECTIONS[state.currentSection];

  if (!currentSectionData) {
    return <Navigate to="/" replace />;
  }

  const handleNext = () => {
    dispatch({ type: 'SET_SECTION', payload: state.currentSection + 1 });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: state.currentSection - 1 });
  };

  // Calculate progress based on content sections only (excluding intro pages)
  const contentSections = SECTIONS.filter(s => s.type === 'content');
  const currentContentSectionIndex = SECTIONS.slice(0, state.currentSection + 1)
    .filter(s => s.type === 'content').length - 1;

  return (
    <UniversityValidator universitySlug={universitySlug}>
      <div className="min-h-screen bg-light-gray">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md shadow-brand border-b border-gray-200/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {/* University Name Display */}
            {universityName && (
              <div className="text-center mb-4">
                <h1 className="text-lg sm:text-xl font-bold text-navy font-primary">
                  {universityName}
                </h1>
                <p className="text-sm text-warm-gray font-primary">Student Success Survey</p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {!universityName && (
                  <h1 className="text-xl font-semibold text-navy font-primary">
                    Student Success Survey
                  </h1>
                )}
              </div>
              <div className="text-sm text-warm-gray font-primary">
                Section {Math.max(1, currentContentSectionIndex + 1)} of {contentSections.length}
              </div>
            </div>
            <ProgressBar
              currentSection={Math.max(0, currentContentSectionIndex)}
              totalSections={contentSections.length}
              sections={contentSections.map(s => s.name)}
            />
          </div>
        </div>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
          {currentSectionData.type === 'intro' ? (
            <SectionIntro
              title={SECTION_INTROS[currentSectionData.introKey as keyof typeof SECTION_INTROS].title}
              description={SECTION_INTROS[currentSectionData.introKey as keyof typeof SECTION_INTROS].description}
              onNext={handleNext}
              onBack={handleBack}
              canGoBack={state.currentSection > 0}
            />
          ) : (
            currentSectionData.component && <currentSectionData.component />
          )}
        </main>
      </div>
    </UniversityValidator>
  );
}