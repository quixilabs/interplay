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
    title: 'Foundations of Future Readiness',
    description: "These questions help us understand how your experience here is shaping your ability to move forward — especially when things get demanding.\n\nYour responses show what's strengthening your confidence, what's creating friction, and how this institution can better support student growth."
  },
  wellbeing: {
    title: 'Your Growth Environment',
    description: "These questions focus on how this institution supports your development — including clarity, support, feedback, and opportunity. Your input helps leaders understand what's building capability — and what might be getting in the way."
  },
  tensions: {
    title: 'Navigating Competing Demands',
    description: "Growth often means holding two important priorities at the same time.\n\nFor each pair below, use the slider to show how confident you feel navigating between these two demands right now. There is no \"right\" position. We're measuring your confidence moving between them — not choosing one over the other."
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

  // Only generate session ID on mount, don't create database record yet
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
    }
  }, [universitySlug, state.sessionId, dispatch]);

  // Create database record only after consent is given
  useEffect(() => {
    if (state.consentGiven && state.sessionId && !state.isInitialized && !initializingRef.current) {
      initializingRef.current = true;

      // Initialize survey in database asynchronously
      SurveyService.initializeSurvey(state.sessionId, state.universitySlug)
        .then(() => {
          dispatch({ type: 'SET_INITIALIZED', payload: true });
        })
        .catch((error) => {
          console.error('Failed to initialize survey:', error);
        })
        .finally(() => {
          initializingRef.current = false;
        });
    }
  }, [state.consentGiven, state.sessionId, state.universitySlug, state.isInitialized, dispatch]);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_SECTION', payload: state.currentSection + 1 });
    scrollToTop();
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SECTION', payload: state.currentSection - 1 });
    scrollToTop();
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