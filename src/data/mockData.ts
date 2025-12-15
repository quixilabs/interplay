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
      'First year/Freshman': 189,
      'Second year/Sophomore': 176,
      'Third year/Junior': 162,
      'Fourth year/Senior': 148,
      'Graduate student': 134,
      'Other': 34
    },
    enrollmentStatus: {
      'Full-time': 892,
      'Part-time': 151
    },
    ageRange: {
      '18-19': 298,
      '20-21': 287,
      '22-24': 234,
      '25 or older': 189,
      'Prefer not to say': 35
    },
    genderIdentity: {
      'Woman': 456,
      'Man': 389,
      'Non-binary': 67,
      'Self-describe': 45,
      'Prefer not to say': 86
    },
    raceEthnicity: {
      'Asian': 234,
      'Black or African American': 142,
      'Hispanic or Latino/a/x': 178,
      'White': 387,
      'American Indian or Alaska Native': 23,
      'Native Hawaiian or Other Pacific Islander': 18,
      'Prefer not to say': 61
    },
    isInternational: {
      'Yes, international student': 156,
      'No, domestic student': 823,
      'Prefer not to say': 64
    },
    employmentStatus: {
      'Not employed': 298,
      'Part-time (less than 20 hours/week)': 234,
      'Part-time (20+ hours/week)': 189,
      'Full-time': 122,
      'Prefer not to say': 200
    },
    hasCaregavingResponsibilities: {
      'Yes': 234,
      'No': 756,
      'Prefer not to say': 53
    },
    inGreekOrganization: {
      'Yes, currently active': 178,
      'No': 823,
      'Prefer not to say': 42
    },
    studyMode: {
      'Entirely in-person': 687,
      'Entirely online': 145,
      'Hybrid (a mix of in-person and online)': 211
    },
    transferStudent: {
      'No, I started at this university as a first-time freshman': 645,
      'Yes, I transferred this year': 123,
      'Yes, I transferred last year': 145,
      'Yes, I transferred two or more years ago': 130
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

  // Action Pathway data - domains ranked by criticality
  actionPathwayData: {
    domains: [
      {
        domainKey: 'financial_stability',
        domainLabel: 'Financial & Material Stability',
        averageScore: 5.9,
        criticality: {
          level: 3,
          label: 'Priority',
          color: '#F97316',
          bgColor: '#FFEDD5'
        },
        topEnabler: 'Financial aid/scholarships',
        topBarrier: 'High tuition costs',
        sampleSize: 1043
      },
      {
        domainKey: 'mental_physical_health',
        domainLabel: 'Mental & Physical Health',
        averageScore: 6.3,
        criticality: {
          level: 2,
          label: 'Watch',
          color: '#EAB308',
          bgColor: '#FEF9C3'
        },
        topEnabler: 'Regular exercise routine',
        topBarrier: 'High stress levels',
        sampleSize: 1043
      },
      {
        domainKey: 'social_relationships',
        domainLabel: 'Close Social Relationships',
        averageScore: 6.8,
        criticality: {
          level: 2,
          label: 'Watch',
          color: '#EAB308',
          bgColor: '#FEF9C3'
        },
        topEnabler: 'Close friendships',
        topBarrier: 'Social anxiety',
        sampleSize: 1043
      },
      {
        domainKey: 'happiness_satisfaction',
        domainLabel: 'Happiness & Life Satisfaction',
        averageScore: 7.2,
        criticality: {
          level: 2,
          label: 'Watch',
          color: '#EAB308',
          bgColor: '#FEF9C3'
        },
        topEnabler: 'Positive relationships',
        topBarrier: 'Academic pressure',
        sampleSize: 1043
      },
      {
        domainKey: 'meaning_purpose',
        domainLabel: 'Meaning & Purpose',
        averageScore: 7.6,
        criticality: {
          level: 2,
          label: 'Watch',
          color: '#EAB308',
          bgColor: '#FEF9C3'
        },
        topEnabler: 'Clear academic goals',
        topBarrier: 'Lack of direction',
        sampleSize: 1043
      },
      {
        domainKey: 'character_virtue',
        domainLabel: 'Character & Growth',
        averageScore: 8.0,
        criticality: {
          level: 1,
          label: 'Informational',
          color: '#22C55E',
          bgColor: '#D1FAE5'
        },
        topEnabler: 'Personal values alignment',
        topBarrier: 'Ethical dilemmas',
        sampleSize: 1043
      }
    ],
    totalResponses: 1043
  },

  // Growth Index Score and Driver Scores (from v2 support barriers)
  growthIndexScore: 8.0,
  
  driverScores: {
    trust: 10.0,
    access: 10.0,
    care: 10.0,
    guidance: 5.0,
    connection: 5.0
  },

  // Intersectional At-Risk Student Groups
  atRiskGroups: {
    groups: [
      {
        rank: 1,
        profile: 'Full-time students working 20+ hours/week',
        description: 'Students balancing full course load with significant work commitments',
        studentCount: 156,
        totalInGroup: 867,
        riskPercentage: 18,
        riskLevel: 'medium',
        primaryConcerns: ['Financial Stability', 'Mental Health'],
        atRiskMemberIds: [] // Mock - not used in display
      },
      {
        rank: 2,
        profile: 'First-year students from low-income families',
        description: 'New students facing financial challenges during transition',
        studentCount: 142,
        totalInGroup: 592,
        riskPercentage: 24,
        riskLevel: 'high',
        primaryConcerns: ['Financial Stability', 'Social Relationships'],
        atRiskMemberIds: [] // Mock - not used in display
      },
      {
        rank: 3,
        profile: 'Transfer students working part-time',
        description: 'Transfer students managing work while adjusting to new environment',
        studentCount: 98,
        totalInGroup: 653,
        riskPercentage: 15,
        riskLevel: 'medium',
        primaryConcerns: ['Social Relationships', 'Meaning & Purpose'],
        atRiskMemberIds: [] // Mock - not used in display
      },
      {
        rank: 4,
        profile: 'International students in STEM fields',
        description: 'International students facing cultural and academic adjustment challenges',
        studentCount: 76,
        totalInGroup: 633,
        riskPercentage: 12,
        riskLevel: 'medium',
        primaryConcerns: ['Mental Health', 'Social Relationships'],
        atRiskMemberIds: [] // Mock - not used in display
      },
      {
        rank: 5,
        profile: 'Part-time students over 25 years old',
        description: 'Non-traditional students balancing multiple life responsibilities',
        studentCount: 54,
        totalInGroup: 284,
        riskPercentage: 19,
        riskLevel: 'medium',
        primaryConcerns: ['Financial Stability', 'Character & Virtue'],
        atRiskMemberIds: [] // Mock - not used in display
      }
    ],
    uniqueStudentCount: 426, // Realistic unique count (some students in multiple groups)
    totalOccurrences: 526 // Sum of all studentCounts (156+142+98+76+54)
  },

  // Generate mock individual response data for filtering
  responses: generateMockResponses(1043)
};

// Function to generate mock individual responses for filtering
function generateMockResponses(count: number) {
  const responses = [];
  
  // Use the exact same values as FILTER_OPTIONS to ensure they match
  const yearOptions = ['First year/Freshman', 'Second year/Sophomore', 'Third year/Junior', 'Fourth year/Senior', 'Graduate student', 'Other'];
  const genderOptions = ['Woman', 'Man', 'Non-binary', 'Self-describe', 'Prefer not to say'];
  const raceOptions = ['Asian', 'Black or African American', 'Hispanic or Latino/a/x', 'White', 'American Indian or Alaska Native', 'Native Hawaiian or Other Pacific Islander', 'Prefer not to say'];
  const employmentOptions = ['Not employed', 'Part-time (less than 20 hours/week)', 'Part-time (20+ hours/week)', 'Full-time', 'Prefer not to say'];
  const enrollmentOptions = ['Full-time', 'Part-time'];
  const ageRangeOptions = ['18-19', '20-21', '22-24', '25 or older', 'Prefer not to say'];
  const internationalOptions = ['Yes, international student', 'No, domestic student', 'Prefer not to say'];
  const caregivingOptions = ['Yes', 'No', 'Prefer not to say'];
  const greekOptions = ['Yes, currently active', 'No', 'Prefer not to say'];
  const studyModeOptions = ['Entirely in-person', 'Entirely online', 'Hybrid (a mix of in-person and online)'];
  const transferOptions = [
    'No, I started at this university as a first-time freshman',
    'Yes, I transferred this year',
    'Yes, I transferred last year',
    'Yes, I transferred two or more years ago'
  ];
  
  for (let i = 0; i < count; i++) {
    const response = {
      id: `mock_response_${i + 1}`,
      sessionId: `session_${i + 1}`,
      createdAt: new Date(2024, 0, 1 + Math.floor(Math.random() * 90)).toISOString(),
      demographics: {
        yearInSchool: yearOptions[Math.floor(Math.random() * yearOptions.length)],
        enrollmentStatus: enrollmentOptions[Math.floor(Math.random() * enrollmentOptions.length)],
        ageRange: ageRangeOptions[Math.floor(Math.random() * ageRangeOptions.length)],
        genderIdentity: genderOptions[Math.floor(Math.random() * genderOptions.length)],
        raceEthnicity: [raceOptions[Math.floor(Math.random() * raceOptions.length)]],
        isInternational: internationalOptions[Math.floor(Math.random() * internationalOptions.length)],
        employmentStatus: employmentOptions[Math.floor(Math.random() * employmentOptions.length)],
        hasCaregavingResponsibilities: caregivingOptions[Math.floor(Math.random() * caregivingOptions.length)],
        inGreekOrganization: greekOptions[Math.floor(Math.random() * greekOptions.length)],
        studyMode: studyModeOptions[Math.floor(Math.random() * studyModeOptions.length)],
        transferStudent: transferOptions[Math.floor(Math.random() * transferOptions.length)]
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