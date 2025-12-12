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
  studyMode?: string;
  transferStudent?: string;
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
  // V1 fields (legacy rating scale format)
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
  wellbeingChecklist?: string[];
  
  // V2 fields (checkbox barrier format)
  assessment_version?: 'v1' | 'v2';
  
  // Frontend format (used by component state)
  statement_1?: boolean;
  statement_2?: boolean;
  statement_3?: boolean;
  statement_4?: boolean;
  statement_5?: boolean;
  statement_6?: boolean;
  statement_7?: boolean;
  statement_8?: boolean;
  statement_9?: boolean;
  statement_10?: boolean;
  statement_11?: boolean;
  statement_12?: boolean;
  statement_13?: boolean;
  statement_14?: boolean;
  statement_15?: boolean;
  
  // Database format (driver-prefixed columns)
  // CARE DRIVER
  care_not_understood_supported?: boolean;
  care_no_empathy_from_staff?: boolean;
  care_school_doesnt_care?: boolean;
  
  // ACCESS DRIVER
  access_hard_find_resources?: boolean;
  access_dont_know_where_help?: boolean;
  access_long_appointment_wait?: boolean;
  
  // GUIDANCE DRIVER
  guidance_unsure_direction?: boolean;
  guidance_want_help_planning?: boolean;
  guidance_confused_courses?: boolean;
  
  // TRUST DRIVER
  trust_messages_not_answered?: boolean;
  trust_unclear_communication?: boolean;
  trust_bounced_between_offices?: boolean;
  
  // CONNECTION DRIVER
  connection_no_mentor?: boolean;
  connection_hard_make_friends?: boolean;
  connection_not_connected_students?: boolean;
  
  // Allow dynamic indexing for checkbox responses
  [key: string]: number | string | string[] | boolean | undefined;
}

export interface TextResponses {
  fastestWinSuggestion?: string;
}

export interface TensionsAssessment {
  performance_wellbeing?: number;
  ambition_contribution?: number;
  selfreliance_connection?: number;
  stability_growth?: number;
  academic_creative?: number;
}

export interface EnablersBarriers {
  domainKey: string;
  selectedEnablers: string[];
  selectedBarriers: string[];
  enablerOtherText?: string;
  barrierOtherText?: string;
}

export interface DomainEnablersBarriers {
  domain_key: string;
  domain_name: string;
  enablers: string[];
  barriers: string[];
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
  enablersBarriers: EnablersBarriers[];
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
  | { type: 'SET_ENABLERS_BARRIERS'; payload: EnablersBarriers[] }
  | { type: 'SET_CONSENT'; payload: boolean }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'INITIALIZE_SURVEY'; payload: { sessionId: string; universitySlug: string } }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'COMPLETE_SURVEY' };