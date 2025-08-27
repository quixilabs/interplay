import { supabase } from '../lib/supabase';

export class AnalyticsService {
  // Get survey analytics for dashboard
  static async getSurveyAnalytics(universitySlug?: string) {
    try {
      // Get basic survey session stats
      let sessionsQuery = supabase
        .from('survey_sessions')
        .select('*');
      
      if (universitySlug) {
        sessionsQuery = sessionsQuery.eq('university_slug', universitySlug);
      }

      const { data: sessions, error: sessionsError } = await sessionsQuery;
      
      if (sessionsError) throw sessionsError;

      // Get flourishing scores with session info
      const { data: flourishingData, error: flourishingError } = await supabase
        .from('flourishing_scores')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);

      if (flourishingError) throw flourishingError;

      // Get demographics data
      const { data: demographicsData, error: demographicsError } = await supabase
        .from('demographics')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);

      if (demographicsError) throw demographicsError;

      // Get school wellbeing data
      const { data: wellbeingData, error: wellbeingError } = await supabase
        .from('school_wellbeing')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);

      if (wellbeingError) throw wellbeingError;

      // Get growth modules data
      const { data: growthModulesData, error: growthModulesError } = await supabase
        .from('growth_modules')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);

      if (growthModulesError) throw growthModulesError;

      // Get text responses
      const { data: textResponsesData, error: textResponsesError } = await supabase
        .from('text_responses')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);

      if (textResponsesError) throw textResponsesError;

      // Calculate analytics
      const completedSessions = sessions?.filter(s => s.is_completed) || [];
      const totalResponses = completedSessions.length;
      const completionRate = sessions?.length ? (totalResponses / sessions.length) * 100 : 0;

      // Calculate flourishing domain averages
      const flourishingDomainAverages = this.calculateFlourishingAverages(flourishingData || []);
      
      // Calculate overall flourishing score
      const overallFlourishingScore = this.calculateOverallFlourishingScore(flourishingData || []);

      // Calculate at-risk students
      const studentsAtRisk = this.calculateAtRiskStudents(flourishingData || []);

      // Calculate school wellbeing averages
      const schoolWellbeingAverages = this.calculateSchoolWellbeingAverages(wellbeingData || []);

      // Analyze demographics
      const demographicBreakdown = this.analyzeDemographics(demographicsData || []);

      // Analyze interventions
      const topInterventions = this.analyzeInterventions(growthModulesData || []);

      // Analyze text responses
      const fastestWinSuggestions = this.analyzeFastestWins(textResponsesData || []);
      const brightSpotThemes = this.analyzeBrightSpots(textResponsesData || []);

      return {
        totalResponses,
        completionRate: Math.round(completionRate * 10) / 10,
        overallFlourishingScore,
        studentsAtRisk: Math.round((studentsAtRisk / totalResponses) * 100),
        flourishingDomainAverages,
        schoolWellbeingAverages,
        demographicBreakdown,
        topInterventions,
        fastestWinSuggestions,
        brightSpotThemes
      };
    } catch (error) {
      console.error('Error fetching survey analytics:', error);
      throw error;
    }
  }

  private static calculateFlourishingAverages(data: any[]) {
    if (data.length === 0) return {};

    const domains = [
      'happiness_satisfaction',
      'mental_physical_health',
      'meaning_purpose',
      'character_virtue',
      'social_relationships',
      'financial_stability'
    ];

    const averages: any = {};

    domains.forEach(domain => {
      const scores1 = data.map(d => d[`${domain}_1`]).filter(s => s !== null);
      const scores2 = data.map(d => d[`${domain}_2`]).filter(s => s !== null);
      const allScores = [...scores1, ...scores2];
      
      if (allScores.length > 0) {
        averages[domain] = Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10;
      }
    });

    return averages;
  }

  private static calculateOverallFlourishingScore(data: any[]) {
    if (data.length === 0) return 0;

    const domains = [
      'happiness_satisfaction',
      'mental_physical_health',
      'meaning_purpose',
      'character_virtue',
      'social_relationships',
      'financial_stability'
    ];

    let totalScore = 0;
    let validResponses = 0;

    data.forEach(response => {
      let responseTotal = 0;
      let validDomains = 0;

      domains.forEach(domain => {
        const score1 = response[`${domain}_1`];
        const score2 = response[`${domain}_2`];
        
        if (score1 !== null && score2 !== null) {
          responseTotal += (score1 + score2) / 2;
          validDomains++;
        }
      });

      if (validDomains > 0) {
        totalScore += responseTotal / validDomains;
        validResponses++;
      }
    });

    return validResponses > 0 ? Math.round((totalScore / validResponses) * 10) / 10 : 0;
  }

  private static calculateAtRiskStudents(data: any[]) {
    if (data.length === 0) return 0;

    const domains = [
      'happiness_satisfaction',
      'mental_physical_health',
      'meaning_purpose',
      'character_virtue',
      'social_relationships',
      'financial_stability'
    ];

    let atRiskCount = 0;

    data.forEach(response => {
      let isAtRisk = false;

      domains.forEach(domain => {
        const score1 = response[`${domain}_1`];
        const score2 = response[`${domain}_2`];
        
        if ((score1 !== null && score1 < 6) || (score2 !== null && score2 < 6)) {
          isAtRisk = true;
        }
      });

      if (isAtRisk) {
        atRiskCount++;
      }
    });

    return atRiskCount;
  }

  private static calculateSchoolWellbeingAverages(data: any[]) {
    if (data.length === 0) return {};

    const fields = [
      'belonging_score',
      'enjoy_school_days',
      'physical_activity',
      'feel_safe',
      'work_connected_goals',
      'contribute_bigger_purpose',
      'kind_to_others',
      'manage_emotions',
      'trusted_adult',
      'supportive_friends',
      'resources_participation'
    ];

    const averages: any = {};

    fields.forEach(field => {
      const scores = data.map(d => d[field]).filter(s => s !== null);
      if (scores.length > 0) {
        averages[field] = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
      }
    });

    return averages;
  }

  private static analyzeDemographics(data: any[]) {
    if (data.length === 0) return {};

    const breakdown: any = {};

    // Year in school
    breakdown.yearInSchool = this.countValues(data, 'year_in_school');
    
    // Gender identity
    breakdown.genderIdentity = this.countValues(data, 'gender_identity');
    
    // Race/ethnicity (handle array values)
    breakdown.raceEthnicity = {};
    data.forEach(d => {
      if (d.race_ethnicity && Array.isArray(d.race_ethnicity)) {
        d.race_ethnicity.forEach((race: string) => {
          breakdown.raceEthnicity[race] = (breakdown.raceEthnicity[race] || 0) + 1;
        });
      }
    });
    
    // Employment status
    breakdown.employmentStatus = this.countValues(data, 'employment_status');

    return breakdown;
  }

  private static countValues(data: any[], field: string) {
    const counts: any = {};
    data.forEach(d => {
      const value = d[field];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return counts;
  }

  private static analyzeInterventions(data: any[]) {
    const interventions: any = {};
    
    data.forEach(module => {
      // Count enabler selections
      if (module.enabler_selections && Array.isArray(module.enabler_selections)) {
        module.enabler_selections.forEach((enabler: string) => {
          if (!interventions[enabler]) {
            interventions[enabler] = { frequency: 0, impact: 7.5 }; // Default impact score
          }
          interventions[enabler].frequency++;
        });
      }
    });

    // Convert to array and sort by frequency
    return Object.entries(interventions)
      .map(([name, data]: [string, any]) => ({
        name,
        frequency: data.frequency,
        impact: data.impact
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  }

  private static analyzeFastestWins(data: any[]) {
    const suggestions: string[] = [];
    
    data.forEach(response => {
      if (response.fastest_win_suggestion) {
        suggestions.push(response.fastest_win_suggestion);
      }
    });

    // For now, return a sample of suggestions
    // In production, you'd use NLP to categorize and count similar suggestions
    return suggestions.slice(0, 10);
  }

  private static analyzeBrightSpots(data: any[]) {
    const brightSpots: string[] = [];
    
    data.forEach(response => {
      if (response.bright_spots) {
        Object.values(response.bright_spots).forEach((spot: any) => {
          if (typeof spot === 'string' && spot.trim()) {
            brightSpots.push(spot);
          }
        });
      }
    });

    return brightSpots.slice(0, 8);
  }
}