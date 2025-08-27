export const mockSurveyData = {
  totalResponses: 1247,
  completionRate: 78.3,
  averageCompletionTime: 12.4,
  overallFlourishingScore: 7.2,
  studentsAtRisk: 287, // 23% of total responses
  
  flourishingDomainAverages: {
    happiness_satisfaction: 7.2,
    mental_physical_health: 6.4,
    meaning_purpose: 7.8,
    character_virtue: 8.1,
    social_relationships: 6.9,
    financial_stability: 5.8
  },
  
  schoolWellbeingAverages: {
    belonging_score: 6.8,
    enjoy_school_days: 7.1,
    physical_activity: 6.3,
    feel_safe: 8.4,
    work_connected_goals: 6.7,
    contribute_bigger_purpose: 7.3,
    kind_to_others: 8.2,
    manage_emotions: 6.1,
    trusted_adult: 5.9,
    supportive_friends: 7.4,
    resources_participation: 6.5
  },
  
  demographicBreakdown: {
    yearInSchool: {
      'First year': 156,
      'Sophomore': 142,
      'Junior': 138,
      'Senior': 134,
      'Graduate': 89,
      'Other': 23
    },
    genderIdentity: {
      'Woman': 334,
      'Man': 298,
      'Non-binary': 45,
      'Other/Prefer not to say': 82
    },
    raceEthnicity: {
      'Asian': 178,
      'Black/African American': 95,
      'Hispanic/Latino/a/x': 121,
      'White': 312,
      'Other/Multiple': 73
    },
    employmentStatus: {
      'Not employed': 245,
      'Part-time (<20hrs)': 189,
      'Part-time (20+hrs)': 156,
      'Full-time': 89
    }
  },
  
  topInterventions: [
    { name: 'Mental health support', frequency: 85, impact: 9.2 },
    { name: 'Financial assistance', frequency: 72, impact: 8.8 },
    { name: 'Better time management', frequency: 68, impact: 7.1 },
    { name: 'Academic support', frequency: 61, impact: 8.3 },
    { name: 'More social connections', frequency: 58, impact: 7.8 }
  ],
  
  fastestWinSuggestions: [
    'Extended library and study space hours',
    'More affordable meal plan options', 
    'Better mental health crisis response',
    'Flexible attendance policies for working students',
    'More diverse counseling staff',
    'Meditation and quiet spaces across campus',
    'Financial wellness workshops',
    'Better late-night transportation',
    'More accessible parking',
    'Improved dining hall hours'
  ],
  
  brightSpotThemes: [
    'Peer tutoring programs building friendships',
    'Professors who care about student success',
    'Campus events fostering community',
    'Study abroad changing perspectives',
    'Research opportunities providing purpose',
    'Athletic programs promoting wellness',
    'Student organizations creating belonging',
    'Mentorship programs guiding growth'
  ],
  
  tensionsAverages: {
    performance_wellbeing: 62, // Slightly toward performance
    ambition_contribution: 58, // Balanced with slight personal ambition
    selfreliance_connection: 45, // Toward connection
    stability_growth: 54, // Balanced
    academic_creative: 71 // Toward academic focus
  }
};

export const mockUniversityData = {
  id: 'demo-university',
  name: 'Demo University',
  slug: 'demo-university',
  adminEmail: 'admin@university.edu',
  surveyActive: true,
  lastSurveyDate: '2024-01-15',
  totalResponses: 1247,
  responseRate: 12.3, // Percentage of total student body
  studentPopulation: 10135
};

export const mockGrowthModules = [
  {
    domainName: 'Mental & Physical Health',
    enablers: ['Better time management', 'Stress reduction'],
    barriers: 'Academic pressure',
    responses: 156
  },
  {
    domainName: 'Financial & Material Stability', 
    enablers: ['Financial assistance', 'Part-time work opportunities'],
    barriers: 'High cost of living',
    responses: 134
  },
  {
    domainName: 'Close Social Relationships',
    enablers: ['More social connections', 'Campus events'],
    barriers: 'Time constraints',
    responses: 98
  }
];