export const generateSessionId = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const calculateOverallFlourishingScore = (scores: any): number => {
  const domains = [
    'happiness_satisfaction',
    'mental_physical_health', 
    'meaning_purpose',
    'character_virtue',
    'social_relationships',
    'financial_stability'
  ];

  let totalScore = 0;
  let validDomains = 0;

  domains.forEach(domain => {
    const score1 = scores[`${domain}_1`];
    const score2 = scores[`${domain}_2`];
    
    if (score1 !== undefined && score2 !== undefined) {
      const domainAverage = (score1 + score2) / 2;
      totalScore += domainAverage;
      validDomains++;
    }
  });

  return validDomains > 0 ? Math.round((totalScore / validDomains) * 10) / 10 : 0;
};

export const identifyAtRiskDomains = (scores: any): string[] => {
  const domains = [
    { key: 'happiness_satisfaction', name: 'Happiness & Life Satisfaction' },
    { key: 'mental_physical_health', name: 'Mental & Physical Health' },
    { key: 'meaning_purpose', name: 'Meaning & Purpose' },
    { key: 'character_virtue', name: 'Character & Virtue' },
    { key: 'social_relationships', name: 'Close Social Relationships' },
    { key: 'financial_stability', name: 'Financial & Material Stability' }
  ];

  return domains.filter(domain => {
    const score1 = scores[`${domain.key}_1`];
    const score2 = scores[`${domain.key}_2`];
    return (score1 !== undefined && score1 <= 6) || (score2 !== undefined && score2 <= 6);
  }).map(domain => domain.name);
};

export const calculateCompletionTime = (startTime: string): number => {
  const start = new Date(startTime);
  const end = new Date();
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatPercentage = (value: number, total: number): string => {
  const percentage = Math.round((value / total) * 100);
  return `${percentage}%`;
};

export const categorizeTextResponse = (text: string): string[] => {
  const keywords = {
    'Mental Health': ['anxiety', 'depression', 'stress', 'counseling', 'therapy', 'mental health'],
    'Financial': ['money', 'financial', 'tuition', 'debt', 'cost', 'expensive', 'afford'],
    'Academic': ['grades', 'study', 'academic', 'classes', 'professor', 'coursework'],
    'Social': ['friends', 'social', 'lonely', 'community', 'belonging', 'connection'],
    'Physical Health': ['exercise', 'fitness', 'health', 'sleep', 'nutrition', 'wellness'],
    'Career': ['career', 'job', 'internship', 'future', 'professional', 'employment']
  };

  const categories: string[] = [];
  const lowerText = text.toLowerCase();

  Object.entries(keywords).forEach(([category, words]) => {
    if (words.some(word => lowerText.includes(word))) {
      categories.push(category);
    }
  });

  return categories.length > 0 ? categories : ['Other'];
};

export const generateSurveyURL = (universitySlug: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/survey/${universitySlug}`;
};