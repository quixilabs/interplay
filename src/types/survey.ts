export interface Demographics {
  yearInSchool?: string;
  enrollmentStatus?: string;
  ageRange?: string;
  genderIdentity?: string;
  genderSelfDescribe?: string;
  raceEthnicity?: string[];
  isInternational?: string;
  employmentStatus?: string;
  hasCaregavingResponsibilities?: string;
  inGreekOrganization?: string;
}

export interface FlourishingScores {
  happiness_satisfaction_1?: number;
  happiness_satisfaction_2?: number;
  mental_physical_health_1?: number;
  mental_physical_health_2?: number;
  meaning_purpose_1?: number;
  meaning_purpose_2?: number;
  character_virtue_1?: number;
  character_virtue_2?: number;
  social_relationships_1?: number;
  social_relationships_2?: number;
  financial_stability_1?: number;
  financial_stability_2?: number;
}

export interface SchoolWellbeing {
  belonging_score?: number;
  enjoy_school_days?: number;
  physical_activity?: number;
  feel_safe?: number;
  work_connected_goals?: number;
  contribute_bigger_purpose?: number;
  kind_to_others?: number;
  manage_emotions?: number;
  trusted_adult?: number;
  supportive_friends?: number;
  resources_participation?: number;
}

export interface TextResponses {
  brightSpots?: { [domain: string]: string };
  fastestWinSuggestion?: string;
}

export interface TensionsAssessment {
  performance_wellbeing?: number;
  ambition_contribution?: number;
  selfreliance_connection?: number;
  stability_growth?: number;
  academic_creative?: number;
}

export interface GrowthModule {
  domainName: string;
  enablerSelections: string[];
  barrierSelection: string;
  additionalComments?: string;
}

export interface SurveyState {
  currentSection: number;
  sessionId: string;
  universitySlug: string;
  isCompleted: boolean;
  startTime: string | null;
  demographics: Demographics;
  flourishingScores: FlourishingScores;
  schoolWellbeing: SchoolWellbeing;
  textResponses: TextResponses;
  tensionsAssessment: TensionsAssessment;
  growthModules: GrowthModule[];
  consentGiven: boolean;
  emailForResults: string;
  isInitialized: boolean;
}

export type SurveyAction =
  | { type: 'SET_SECTION'; payload: number }
  | { type: 'SET_DEMOGRAPHICS'; payload: Partial<Demographics> }
  | { type: 'SET_FLOURISHING_SCORES'; payload: Partial<FlourishingScores> }
  | { type: 'SET_SCHOOL_WELLBEING'; payload: Partial<SchoolWellbeing> }
  | { type: 'SET_TEXT_RESPONSES'; payload: Partial<TextResponses> }
  | { type: 'SET_TENSIONS_ASSESSMENT'; payload: Partial<TensionsAssessment> }
  | { type: 'ADD_GROWTH_MODULE'; payload: GrowthModule }
  | { type: 'SET_CONSENT'; payload: boolean }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'INITIALIZE_SURVEY'; payload: { sessionId: string; universitySlug: string } }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'COMPLETE_SURVEY' };