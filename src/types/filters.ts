export interface DemographicsFilters {
  yearInSchool: string[];
  enrollmentStatus: string[];
  ageRange: string[];
  genderIdentity: string[];
  raceEthnicity: string[];
  isInternational: string[];
  employmentStatus: string[];
  hasCaregavingResponsibilities: string[];
  inGreekOrganization: string[];
  studyMode: string[];
  transferStudent: string[];
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  key: keyof DemographicsFilters;
  label: string;
  options: FilterOption[];
  type: 'single' | 'multiple';
}

// Default filter values (all options selected = no filtering)
export const DEFAULT_FILTERS: DemographicsFilters = {
  yearInSchool: [],
  enrollmentStatus: [],
  ageRange: [],
  genderIdentity: [],
  raceEthnicity: [],
  isInternational: [],
  employmentStatus: [],
  hasCaregavingResponsibilities: [],
  inGreekOrganization: [],
  studyMode: [],
  transferStudent: []
};

// Filter options based on the demographics section
export const FILTER_OPTIONS = {
  yearInSchool: [
    'First year/Freshman',
    'Second year/Sophomore', 
    'Third year/Junior',
    'Fourth year/Senior',
    'Graduate student',
    'Other'
  ],
  enrollmentStatus: [
    'Full-time',
    'Part-time'
  ],
  ageRange: [
    '18-19',
    '20-21', 
    '22-24',
    '25 or older',
    'Prefer not to say'
  ],
  genderIdentity: [
    'Woman',
    'Man',
    'Non-binary',
    'Self-describe',
    'Prefer not to say'
  ],
  raceEthnicity: [
    'American Indian or Alaska Native',
    'Asian',
    'Black or African American',
    'Hispanic or Latino/a/x',
    'Native Hawaiian or Other Pacific Islander',
    'White',
    'Prefer not to say'
  ],
  isInternational: [
    'Yes, international student',
    'No, domestic student',
    'Prefer not to say'
  ],
  employmentStatus: [
    'Not employed',
    'Part-time (less than 20 hours/week)',
    'Part-time (20+ hours/week)',
    'Full-time (40+ hours/week)',
    'Prefer not to say'
  ],
  hasCaregavingResponsibilities: [
    'Yes',
    'No',
    'Prefer not to say'
  ],
  inGreekOrganization: [
    'Yes, currently active',
    'No',
    'Prefer not to say'
  ],
  studyMode: [
    'Entirely in-person',
    'Entirely online',
    'Hybrid (a mix of in-person and online)'
  ],
  transferStudent: [
    'No, I started at this university as a first-time freshman',
    'Yes, I transferred this year',
    'Yes, I transferred last year', 
    'Yes, I transferred two or more years ago'
  ]
};

export const FILTER_LABELS: Record<keyof DemographicsFilters, string> = {
  yearInSchool: 'Year in School',
  enrollmentStatus: 'Enrollment Status',
  ageRange: 'Age Range',
  genderIdentity: 'Gender Identity',
  raceEthnicity: 'Race/Ethnicity',
  isInternational: 'International Student',
  employmentStatus: 'Employment Status',
  hasCaregavingResponsibilities: 'Family/Caregiving Responsibilities',
  inGreekOrganization: 'Greek Organization',
  studyMode: 'Mode of Study',
  transferStudent: 'Transfer Student'
};
