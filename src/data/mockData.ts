export const mockSurveyData = {
  totalResponses: 1043,
  completionRate: 82.7,
  averageCompletionTime: 11.8,
  overallFlourishingScore: 7.1,
  studentsAtRisk: 22, // 22% of total responses
  
  flourishingDomainAverages: {
    happiness_satisfaction: 7.2,
    mental_physical_health: 6.3,
    meaning_purpose: 7.6,
    character_virtue: 8.0,
    social_relationships: 6.8,
    financial_stability: 5.9
  },
  
  schoolWellbeingAverages: {
    belonging_score: 6.9,
    enjoy_school_days: 7.0,
    physical_activity: 6.4,
    feel_safe: 8.3,
    work_connected_goals: 6.8,
    contribute_bigger_purpose: 7.2,
    kind_to_others: 8.1,
    manage_emotions: 6.0,
    trusted_adult: 6.1,
    supportive_friends: 7.3,
    resources_participation: 6.6
  },
  
  demographicBreakdown: {
    yearInSchool: {
      'First year': 189,
      'Sophomore': 176,
      'Junior': 162,
      'Senior': 148,
      'Graduate': 134,
      'Other': 34
    },
    genderIdentity: {
      'Woman': 456,
      'Man': 389,
      'Non-binary': 67,
      'Other/Prefer not to say': 131
    },
    raceEthnicity: {
      'Asian': 234,
      'Black/African American': 142,
      'Hispanic/Latino/a/x': 178,
      'White': 387,
      'American Indian/Alaska Native': 23,
      'Native Hawaiian/Pacific Islander': 18,
      'Other/Multiple': 61
    },
    employmentStatus: {
      'Not employed': 298,
      'Part-time (<20hrs)': 234,
      'Part-time (20+hrs)': 189,
      'Full-time': 122,
      'Other': 34
    }
  },
  
  // Enhanced intervention analysis with more comprehensive data
  interventionAnalysis: {
    topEnablers: [
      { name: 'Strong support network', frequency: 387, percentage: 37, impact: 8.9 },
      { name: 'Clear academic goals', frequency: 342, percentage: 33, impact: 8.4 },
      { name: 'Effective time management', frequency: 298, percentage: 29, impact: 8.1 },
      { name: 'Financial stability', frequency: 267, percentage: 26, impact: 9.2 },
      { name: 'Mental health resources', frequency: 245, percentage: 23, impact: 9.1 },
      { name: 'Physical wellness habits', frequency: 223, percentage: 21, impact: 7.8 },
      { name: 'Faculty mentorship', frequency: 198, percentage: 19, impact: 8.6 },
      { name: 'Campus involvement', frequency: 189, percentage: 18, impact: 7.9 },
      { name: 'Study skills training', frequency: 167, percentage: 16, impact: 7.5 },
      { name: 'Career guidance', frequency: 145, percentage: 14, impact: 8.0 }
    ],
    topBarriers: [
      { name: 'Financial stress', frequency: 423, percentage: 41, impact: 9.3 },
      { name: 'Academic pressure', frequency: 389, percentage: 37, impact: 8.8 },
      { name: 'Time management challenges', frequency: 356, percentage: 34, impact: 8.2 },
      { name: 'Mental health concerns', frequency: 334, percentage: 32, impact: 9.4 },
      { name: 'Work-life balance', frequency: 298, percentage: 29, impact: 8.5 },
      { name: 'Social isolation', frequency: 267, percentage: 26, impact: 8.7 },
      { name: 'Lack of motivation', frequency: 234, percentage: 22, impact: 8.1 },
      { name: 'Family responsibilities', frequency: 198, percentage: 19, impact: 7.9 },
      { name: 'Housing instability', frequency: 167, percentage: 16, impact: 8.9 },
      { name: 'Technology barriers', frequency: 134, percentage: 13, impact: 7.2 }
    ],
    domainAnalysis: {
      'mental_physical_health': {
        domainName: 'Mental & Physical Health',
        enablerSelections: 1456,
        barrierSelections: 1789,
        topEnablers: {
          'Regular exercise routine': 234,
          'Adequate sleep schedule': 198,
          'Stress management techniques': 189,
          'Healthy eating habits': 167,
          'Mental health counseling': 145
        },
        topBarriers: {
          'High stress levels': 298,
          'Poor sleep quality': 267,
          'Lack of exercise time': 234,
          'Anxiety and depression': 223,
          'Unhealthy eating patterns': 198
        },
        averageEnablerCount: 2.3,
        averageBarrierCount: 2.8
      },
      'financial_stability': {
        domainName: 'Financial & Material Stability',
        enablerSelections: 1234,
        barrierSelections: 1678,
        topEnablers: {
          'Part-time employment': 189,
          'Financial aid/scholarships': 167,
          'Family financial support': 145,
          'Budgeting skills': 134,
          'Emergency savings': 112
        },
        topBarriers: {
          'High tuition costs': 267,
          'Living expenses': 234,
          'Textbook costs': 198,
          'Transportation costs': 167,
          'Healthcare expenses': 145
        },
        averageEnablerCount: 1.9,
        averageBarrierCount: 2.6
      },
      'social_relationships': {
        domainName: 'Close Social Relationships',
        enablerSelections: 1345,
        barrierSelections: 1234,
        topEnablers: {
          'Close friendships': 234,
          'Supportive family': 198,
          'Study groups': 167,
          'Campus organizations': 145,
          'Romantic relationship': 123
        },
        topBarriers: {
          'Social anxiety': 198,
          'Time constraints': 167,
          'Difficulty making friends': 145,
          'Long-distance relationships': 134,
          'Conflict resolution issues': 112
        },
        averageEnablerCount: 2.1,
        averageBarrierCount: 1.9
      }
    },
    totalResponses: 1043,
    topInterventions: [
      { name: 'Mental health support', frequency: 387, impact: 9.2 },
      { name: 'Financial assistance programs', frequency: 342, impact: 8.8 },
      { name: 'Time management workshops', frequency: 298, impact: 7.6 },
      { name: 'Academic support services', frequency: 267, impact: 8.3 },
      { name: 'Social connection programs', frequency: 234, impact: 7.8 }
    ]
  },
  
  fastestWinSuggestions: [
    'Extended library and study space hours during finals',
    'More affordable meal plan options and food pantry',
    'Improved mental health crisis response and same-day appointments',
    'Flexible attendance policies for working students',
    'More diverse counseling staff representing student demographics',
    'Meditation and quiet spaces across campus buildings',
    'Financial wellness workshops and emergency aid',
    'Better late-night transportation and campus safety',
    'More accessible parking and reduced parking fees',
    'Improved dining hall hours and healthy food options',
    'Peer tutoring programs with incentives',
    'Faculty office hours in comfortable, accessible spaces',
    'Student organization fair with clear engagement pathways',
    'Career services with industry-specific guidance',
    'Technology support and equipment lending'
  ],
  
  brightSpotThemes: [
    'Peer tutoring programs building lasting friendships and academic success',
    'Professors who genuinely care about student success and wellbeing',
    'Campus events that foster authentic community and belonging',
    'Study abroad experiences that broaden perspectives and confidence',
    'Research opportunities that provide meaning and career direction',
    'Athletic and recreation programs promoting physical and mental wellness',
    'Student organizations creating deep connections and leadership growth',
    'Mentorship programs connecting students with alumni and professionals',
    'Service learning projects that connect academics with community impact',
    'Campus traditions that create shared identity and pride'
  ],
  
  // Enhanced tension analysis with cross-domain insights
  tensionAnalysis: {
    tensionAverages: {
      performance_wellbeing: 58.3,
      ambition_contribution: 54.7,
      selfreliance_connection: 47.2,
      stability_growth: 52.1,
      academic_creative: 67.4
    },
    crossDomainAnalysis: [
      {
        tensionKey: 'performance_wellbeing',
        tensionLabel: 'Performance vs Well-being',
        description: 'High performance drive vs mental/physical health',
        avgGapScore: 0.34,
        studentsWithGap: 287,
        gapPercentage: 28,
        totalStudents: 1043,
        gapAnalysis: []
      },
      {
        tensionKey: 'ambition_contribution',
        tensionLabel: 'Personal Ambition vs Contribution',
        description: 'Individual goals vs helping others',
        avgGapScore: 0.22,
        studentsWithGap: 198,
        gapPercentage: 19,
        totalStudents: 1043,
        gapAnalysis: []
      },
      {
        tensionKey: 'selfreliance_connection',
        tensionLabel: 'Self-reliance vs Connection',
        description: 'Independence vs community connection',
        avgGapScore: 0.41,
        studentsWithGap: 356,
        gapPercentage: 34,
        totalStudents: 1043,
        gapAnalysis: []
      },
      {
        tensionKey: 'stability_growth',
        tensionLabel: 'Stability vs Growth',
        description: 'Security vs new opportunities',
        avgGapScore: 0.28,
        studentsWithGap: 234,
        gapPercentage: 22,
        totalStudents: 1043,
        gapAnalysis: []
      },
      {
        tensionKey: 'academic_creative',
        tensionLabel: 'Academic vs Creative',
        description: 'Academic achievement vs creative exploration',
        avgGapScore: 0.31,
        studentsWithGap: 267,
        gapPercentage: 26,
        totalStudents: 1043,
        gapAnalysis: []
      }
    ],
    totalTensionResponses: 1043
  },

  // Generate mock individual response data for filtering
  responses: generateMockResponses(1043)
};

// Function to generate mock individual responses for filtering
function generateMockResponses(count: number) {
  const responses = [];
  
  const yearOptions = ['First year', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Other'];
  const genderOptions = ['Woman', 'Man', 'Non-binary', 'Other/Prefer not to say'];
  const raceOptions = ['Asian', 'Black/African American', 'Hispanic/Latino/a/x', 'White', 'American Indian/Alaska Native', 'Native Hawaiian/Pacific Islander', 'Other/Multiple'];
  const employmentOptions = ['Not employed', 'Part-time (<20hrs)', 'Part-time (20+hrs)', 'Full-time', 'Other'];
  
  for (let i = 0; i < count; i++) {
    const response = {
      id: `mock_response_${i + 1}`,
      sessionId: `session_${i + 1}`,
      createdAt: new Date(2024, 0, 1 + Math.floor(Math.random() * 90)).toISOString(),
      demographics: {
        yearInSchool: yearOptions[Math.floor(Math.random() * yearOptions.length)],
        genderIdentity: genderOptions[Math.floor(Math.random() * genderOptions.length)],
        raceEthnicity: [raceOptions[Math.floor(Math.random() * raceOptions.length)]],
        employmentStatus: employmentOptions[Math.floor(Math.random() * employmentOptions.length)]
      },
      flourishing: generateFlourishingScores(),
      schoolWellbeing: generateSchoolWellbeingScores(),
      tensions: generateTensionScores(),
      enablersBarriers: generateEnablersBarriers()
    };
    responses.push(response);
  }
  
  return responses;
}

function generateFlourishingScores() {
  const domains = ['happiness_satisfaction', 'mental_physical_health', 'meaning_purpose', 'character_virtue', 'social_relationships', 'financial_stability'];
  const scores: any = {};
  
  domains.forEach(domain => {
    // Generate scores with some realistic variation
    const baseScore = Math.random() * 3 + 6; // 6-9 range mostly
    scores[`${domain}_1`] = Math.max(1, Math.min(10, Math.round((baseScore + (Math.random() - 0.5) * 2) * 10) / 10));
    scores[`${domain}_2`] = Math.max(1, Math.min(10, Math.round((baseScore + (Math.random() - 0.5) * 2) * 10) / 10));
  });
  
  return scores;
}

function generateSchoolWellbeingScores() {
  const fields = ['belonging_score', 'enjoy_school_days', 'physical_activity', 'feel_safe', 'work_connected_goals', 'contribute_bigger_purpose', 'kind_to_others', 'manage_emotions', 'trusted_adult', 'supportive_friends', 'resources_participation'];
  const scores: any = {};
  
  fields.forEach(field => {
    // Generate scores with realistic distribution
    const baseScore = Math.random() * 3 + 6; // 6-9 range mostly
    scores[field] = Math.max(1, Math.min(10, Math.round((baseScore + (Math.random() - 0.5) * 3) * 10) / 10));
  });
  
  return scores;
}

function generateTensionScores() {
  return {
    performance_wellbeing: Math.round(Math.random() * 100),
    ambition_contribution: Math.round(Math.random() * 100),
    selfreliance_connection: Math.round(Math.random() * 100),
    stability_growth: Math.round(Math.random() * 100),
    academic_creative: Math.round(Math.random() * 100)
  };
}

function generateEnablersBarriers() {
  const enablerOptions = ['Strong support network', 'Clear academic goals', 'Effective time management', 'Financial stability', 'Mental health resources', 'Physical wellness habits', 'Faculty mentorship', 'Campus involvement'];
  const barrierOptions = ['Financial stress', 'Academic pressure', 'Time management challenges', 'Mental health concerns', 'Work-life balance', 'Social isolation', 'Lack of motivation', 'Family responsibilities'];
  
  const selectedEnablers = [];
  const selectedBarriers = [];
  
  // Randomly select 1-4 enablers and barriers
  const enablerCount = Math.floor(Math.random() * 4) + 1;
  const barrierCount = Math.floor(Math.random() * 4) + 1;
  
  for (let i = 0; i < enablerCount; i++) {
    const enabler = enablerOptions[Math.floor(Math.random() * enablerOptions.length)];
    if (!selectedEnablers.includes(enabler)) {
      selectedEnablers.push(enabler);
    }
  }
  
  for (let i = 0; i < barrierCount; i++) {
    const barrier = barrierOptions[Math.floor(Math.random() * barrierOptions.length)];
    if (!selectedBarriers.includes(barrier)) {
      selectedBarriers.push(barrier);
    }
  }
  
  return {
    selectedEnablers,
    selectedBarriers
  };
}

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