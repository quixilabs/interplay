import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SurveyState, SurveyAction } from '../types/survey';
import { SurveyService } from '../services/surveyService';

const initialState: SurveyState = {
  currentSection: 0,
  sessionId: '',
  universitySlug: '',
  isCompleted: false,
  startTime: null,
  demographics: {},
  flourishingScores: {},
  schoolWellbeing: {},
  textResponses: {},
  tensionsAssessment: {},
  enablersBarriers: [],
  consentGiven: false,
  emailForResults: '',
  isInitialized: false
};

function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'SET_SECTION':
      return { ...state, currentSection: action.payload };
    case 'SET_DEMOGRAPHICS':
      const newDemographics = { ...state.demographics, ...action.payload };
      // Save to database (only if initialized)
      if (state.sessionId && state.isInitialized) {
        SurveyService.saveDemographics(state.sessionId, newDemographics).catch(console.error);
      }
      return { ...state, demographics: newDemographics };
    case 'SET_FLOURISHING_SCORES':
      const newFlourishingScores = { ...state.flourishingScores, ...action.payload };
      // Save to database (only if initialized)
      if (state.sessionId && state.isInitialized) {
        SurveyService.saveFlourishingScores(state.sessionId, newFlourishingScores).catch(console.error);
      }
      return { ...state, flourishingScores: newFlourishingScores };
    case 'SET_SCHOOL_WELLBEING':
      const newSchoolWellbeing = { ...state.schoolWellbeing, ...action.payload };
      // Save to database (only if initialized)
      if (state.sessionId && state.isInitialized) {
        SurveyService.saveSchoolWellbeing(state.sessionId, newSchoolWellbeing).catch(console.error);
      }
      return { ...state, schoolWellbeing: newSchoolWellbeing };
    case 'SET_TEXT_RESPONSES':
      const newTextResponses = { ...state.textResponses, ...action.payload };
      // Save to database (only if initialized)
      if (state.sessionId && state.isInitialized) {
        SurveyService.saveTextResponses(state.sessionId, newTextResponses).catch(console.error);
      }
      return { ...state, textResponses: newTextResponses };
    case 'SET_TENSIONS_ASSESSMENT':
      const newTensionsAssessment = { ...state.tensionsAssessment, ...action.payload };
      // Save to database (only if initialized)
      if (state.sessionId && state.isInitialized) {
        SurveyService.saveTensionsAssessment(state.sessionId, newTensionsAssessment).catch(console.error);
      }
      return { ...state, tensionsAssessment: newTensionsAssessment };
    case 'SET_ENABLERS_BARRIERS':
      // Save to database (only if initialized)
      if (state.sessionId && state.isInitialized) {
        SurveyService.saveEnablersBarriers(state.sessionId, action.payload).catch(console.error);
      }
      return { ...state, enablersBarriers: action.payload };
    case 'SET_CONSENT':
      return { ...state, consentGiven: action.payload };
    case 'SET_EMAIL':
      return { ...state, emailForResults: action.payload };
    case 'INITIALIZE_SURVEY':
      const initializedState = {
        ...state,
        sessionId: action.payload.sessionId,
        universitySlug: action.payload.universitySlug,
        startTime: new Date().toISOString(),
        isInitialized: false
      };
      return initializedState;
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'COMPLETE_SURVEY':
      // Complete survey in database
      if (state.sessionId) {
        SurveyService.completeSurvey(state.sessionId, state.emailForResults).catch(console.error);
      }
      return { ...state, isCompleted: true };
    default:
      return state;
  }
}

const SurveyContext = createContext<{
  state: SurveyState;
  dispatch: React.Dispatch<SurveyAction>;
} | null>(null);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(surveyReducer, initialState);

  return (
    <SurveyContext.Provider value={{ state, dispatch }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}