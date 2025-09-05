import { supabase } from '../lib/supabase';

export class AnalyticsService {
  // Get survey analytics for dashboard
  static async getSurveyAnalytics(universitySlug?: string) {
    try {
      // Return mock data for demo university
      if (universitySlug === 'demo-university') {
        const { mockSurveyData } = await import('../data/mockData');
        return mockSurveyData;
      }
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
      let flourishingQuery = supabase
        .from('flourishing_scores')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);
      
      if (universitySlug) {
        flourishingQuery = flourishingQuery.eq('survey_sessions.university_slug', universitySlug);
      }

      const { data: flourishingData, error: flourishingError } = await flourishingQuery;

      if (flourishingError) throw flourishingError;

      // Get demographics data
      let demographicsQuery = supabase
        .from('demographics')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);
      
      if (universitySlug) {
        demographicsQuery = demographicsQuery.eq('survey_sessions.university_slug', universitySlug);
      }

      const { data: demographicsData, error: demographicsError } = await demographicsQuery;

      if (demographicsError) throw demographicsError;

      // Get school wellbeing data
      let wellbeingQuery = supabase
        .from('school_wellbeing')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);
      
      if (universitySlug) {
        wellbeingQuery = wellbeingQuery.eq('survey_sessions.university_slug', universitySlug);
      }

      const { data: wellbeingData, error: wellbeingError } = await wellbeingQuery;

      if (wellbeingError) throw wellbeingError;

      // Get enablers and barriers data
      let enablersBarriersQuery = supabase
        .from('user_enablers_barriers')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);
      
      if (universitySlug) {
        enablersBarriersQuery = enablersBarriersQuery.eq('survey_sessions.university_slug', universitySlug);
      }

      const { data: enablersBarriersData, error: enablersBarriersError } = await enablersBarriersQuery;

      if (enablersBarriersError) throw enablersBarriersError;

      // Get domain reference data for enablers and barriers
      const { data: domainData, error: domainError } = await supabase
        .from('domain_enablers_barriers')
        .select('*');

      if (domainError) throw domainError;

      // Get text responses
      let textResponsesQuery = supabase
        .from('text_responses')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);
      
      if (universitySlug) {
        textResponsesQuery = textResponsesQuery.eq('survey_sessions.university_slug', universitySlug);
      }

      const { data: textResponsesData, error: textResponsesError } = await textResponsesQuery;

      if (textResponsesError) throw textResponsesError;

      // Get tensions assessment data
      let tensionsQuery = supabase
        .from('tensions_assessment')
        .select(`
          *,
          survey_sessions!inner(university_slug, is_completed)
        `)
        .eq('survey_sessions.is_completed', true);
      
      if (universitySlug) {
        tensionsQuery = tensionsQuery.eq('survey_sessions.university_slug', universitySlug);
      }

      const { data: tensionsData, error: tensionsError } = await tensionsQuery;

      if (tensionsError) throw tensionsError;

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

      // Analyze interventions (enablers and barriers)
      const interventionAnalysis = this.analyzeEnablersBarriers(enablersBarriersData || [], domainData || []);

      // Analyze text responses
      const fastestWinSuggestions = this.analyzeFastestWins(textResponsesData || []);
      const brightSpotThemes: string[] = []; // Removed bright spots functionality

      // Analyze tension data
      const tensionAnalysis = this.analyzeTensions(tensionsData || [], flourishingData || [], wellbeingData || [], enablersBarriersData || [], domainData || []);

      return {
        totalResponses,
        completionRate: Math.round(completionRate * 10) / 10,
        overallFlourishingScore,
        studentsAtRisk: Math.round((studentsAtRisk / totalResponses) * 100),
        flourishingDomainAverages,
        schoolWellbeingAverages,
        demographicBreakdown,
        interventionAnalysis,
        fastestWinSuggestions,
        brightSpotThemes,
        tensionAnalysis
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

  private static analyzeEnablersBarriers(enablersBarriersData: any[], domainData: any[]) {
    // Create a map of domain keys to domain names
    const domainMap = new Map();
    domainData.forEach(domain => {
      domainMap.set(domain.domain_key, domain);
    });

    const enablerCounts: any = {};
    const barrierCounts: any = {};
    const domainAnalysis: any = {};

    // Process each user's enablers and barriers selections
    enablersBarriersData.forEach(userResponse => {
      const domain = domainMap.get(userResponse.domain_key);
      if (!domain) return;

      // Initialize domain analysis if not exists
      if (!domainAnalysis[userResponse.domain_key]) {
        domainAnalysis[userResponse.domain_key] = {
          domainName: domain.domain_name,
          enablerSelections: 0,
          barrierSelections: 0,
          topEnablers: {},
          topBarriers: {},
          averageEnablerCount: 0,
          averageBarrierCount: 0
        };
      }

      const domainStats = domainAnalysis[userResponse.domain_key];

      // Count enabler selections
      if (userResponse.selected_enablers && Array.isArray(userResponse.selected_enablers)) {
        domainStats.enablerSelections += userResponse.selected_enablers.length;
        userResponse.selected_enablers.forEach((enabler: string) => {
          enablerCounts[enabler] = (enablerCounts[enabler] || 0) + 1;
          domainStats.topEnablers[enabler] = (domainStats.topEnablers[enabler] || 0) + 1;
        });
      }

      // Count barrier selections
      if (userResponse.selected_barriers && Array.isArray(userResponse.selected_barriers)) {
        domainStats.barrierSelections += userResponse.selected_barriers.length;
        userResponse.selected_barriers.forEach((barrier: string) => {
          barrierCounts[barrier] = (barrierCounts[barrier] || 0) + 1;
          domainStats.topBarriers[barrier] = (domainStats.topBarriers[barrier] || 0) + 1;
        });
      }
    });

    // Calculate averages for each domain
    const totalResponses = enablersBarriersData.length;
    Object.keys(domainAnalysis).forEach(domainKey => {
      const domainResponses = enablersBarriersData.filter(r => r.domain_key === domainKey).length;
      if (domainResponses > 0) {
        domainAnalysis[domainKey].averageEnablerCount = Math.round((domainAnalysis[domainKey].enablerSelections / domainResponses) * 10) / 10;
        domainAnalysis[domainKey].averageBarrierCount = Math.round((domainAnalysis[domainKey].barrierSelections / domainResponses) * 10) / 10;
      }
    });

    // Get top enablers and barriers overall
    const topEnablers = Object.entries(enablerCounts)
      .map(([name, count]: [string, any]) => ({
        name,
        frequency: count,
        percentage: Math.round((count / totalResponses) * 100),
        impact: 7.5 // Default impact score - could be enhanced with user ratings
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    const topBarriers = Object.entries(barrierCounts)
      .map(([name, count]: [string, any]) => ({
        name,
        frequency: count,
        percentage: Math.round((count / totalResponses) * 100),
        impact: 7.5 // Default impact score
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    return {
      topEnablers,
      topBarriers,
      domainAnalysis,
      totalResponses,
      // Legacy compatibility - use top enablers as interventions for existing charts
      topInterventions: topEnablers.slice(0, 5)
    };
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


  private static analyzeTensions(tensionsData: any[], flourishingData: any[], wellbeingData: any[], enablersBarriersData: any[], domainData: any[]) {
    if (tensionsData.length === 0) return null;

    // Calculate tension averages
    const tensionAverages = {
      performance_wellbeing: 0,
      ambition_contribution: 0,
      selfreliance_connection: 0,
      stability_growth: 0,
      academic_creative: 0
    };

    const tensionCounts = { ...tensionAverages };

    tensionsData.forEach(tension => {
      Object.keys(tensionAverages).forEach(key => {
        if (tension[key] !== null && tension[key] !== undefined) {
          tensionAverages[key as keyof typeof tensionAverages] += tension[key];
          tensionCounts[key as keyof typeof tensionCounts]++;
        }
      });
    });

    // Calculate averages
    Object.keys(tensionAverages).forEach(key => {
      const count = tensionCounts[key as keyof typeof tensionCounts];
      if (count > 0) {
        tensionAverages[key as keyof typeof tensionAverages] = 
          Math.round((tensionAverages[key as keyof typeof tensionAverages] / count) * 10) / 10;
      }
    });

    // Create cross-domain analysis by matching session IDs
    const crossDomainAnalysis = this.createCrossDomainAnalysis(tensionsData, flourishingData, wellbeingData, enablersBarriersData, domainData);

    return {
      tensionAverages,
      crossDomainAnalysis,
      totalTensionResponses: tensionsData.length
    };
  }

  private static createCrossDomainAnalysis(tensionsData: any[], flourishingData: any[], wellbeingData: any[], enablersBarriersData: any[], domainData: any[]) {
    // Map data by session_id for cross-referencing
    const flourishingMap = new Map();
    flourishingData.forEach(f => flourishingMap.set(f.session_id, f));
    
    const wellbeingMap = new Map();
    wellbeingData.forEach(w => wellbeingMap.set(w.session_id, w));

    // Map enablers and barriers by session_id and domain_key
    const enablersBarriersMap = new Map();
    enablersBarriersData.forEach(eb => {
      const key = `${eb.session_id}_${eb.domain_key}`;
      enablersBarriersMap.set(key, eb);
    });

    // Create domain reference map
    const domainMap = new Map();
    domainData.forEach(domain => {
      domainMap.set(domain.domain_key, domain);
    });

    const heatmapData: any[] = [];

    // Define the cross-domain relationships we want to analyze
    const crossDomainMappings = [
      {
        tensionKey: 'performance_wellbeing',
        tensionLabel: 'Performance vs Well-being',
        flourishingKeys: ['happiness_satisfaction', 'mental_physical_health'],
        wellbeingKeys: ['manage_emotions', 'feel_safe'],
        description: 'High performance drive vs mental/physical health'
      },
      {
        tensionKey: 'ambition_contribution',
        tensionLabel: 'Personal Ambition vs Contribution',
        flourishingKeys: ['meaning_purpose', 'character_virtue'],
        wellbeingKeys: ['contribute_bigger_purpose', 'kind_to_others'],
        description: 'Individual goals vs helping others'
      },
      {
        tensionKey: 'selfreliance_connection',
        tensionLabel: 'Self-reliance vs Connection',
        flourishingKeys: ['social_relationships'],
        wellbeingKeys: ['belonging_score', 'supportive_friends', 'trusted_adult'],
        description: 'Independence vs community connection'
      },
      {
        tensionKey: 'stability_growth',
        tensionLabel: 'Stability vs Growth',
        flourishingKeys: ['financial_stability'],
        wellbeingKeys: ['work_connected_goals'],
        description: 'Security vs new opportunities'
      },
      {
        tensionKey: 'academic_creative',
        tensionLabel: 'Academic vs Creative',
        flourishingKeys: ['meaning_purpose'],
        wellbeingKeys: ['enjoy_school_days'],
        description: 'Academic achievement vs creative exploration'
      }
    ];

    crossDomainMappings.forEach(mapping => {
      const analysisData = {
        tensionKey: mapping.tensionKey,
        tensionLabel: mapping.tensionLabel,
        description: mapping.description,
        gapAnalysis: [] as any[]
      };

      tensionsData.forEach(tension => {
        const sessionId = tension.session_id;
        const tensionScore = tension[mapping.tensionKey];
        
        if (tensionScore === null || tensionScore === undefined) return;

        const flourishing = flourishingMap.get(sessionId);
        const wellbeing = wellbeingMap.get(sessionId);

        if (flourishing || wellbeing) {
          // Calculate flourishing scores for this mapping
          let flourishingScore = 0;
          let flourishingCount = 0;
          
          if (flourishing) {
            mapping.flourishingKeys.forEach(key => {
              const score1 = flourishing[`${key}_1`];
              const score2 = flourishing[`${key}_2`];
              if (score1 !== null) { flourishingScore += score1; flourishingCount++; }
              if (score2 !== null) { flourishingScore += score2; flourishingCount++; }
            });
          }

          // Calculate wellbeing scores for this mapping
          let wellbeingScore = 0;
          let wellbeingCount = 0;
          
          if (wellbeing) {
            mapping.wellbeingKeys.forEach(key => {
              const score = wellbeing[key];
              if (score !== null) { wellbeingScore += score; wellbeingCount++; }
            });
          }

          // Calculate actual enabler support score using enablers/barriers data
          let enablerScore = 5; // Default neutral score
          let hasEnablersBarriersData = false;

          // Check all relevant domains for this tension mapping
          const relevantDomains = [...mapping.flourishingKeys];
          let totalEnablerScore = 0;
          let domainCount = 0;

          relevantDomains.forEach(domainKey => {
            const ebKey = `${sessionId}_${domainKey}`;
            const enablersBarriersData = enablersBarriersMap.get(ebKey);
            
            if (enablersBarriersData) {
              hasEnablersBarriersData = true;
              domainCount++;
              
              // Calculate enabler strength (number of enablers selected)
              const enablerCount = enablersBarriersData.selected_enablers?.length || 0;
              const barrierCount = enablersBarriersData.selected_barriers?.length || 0;
              
              // Score based on enabler-to-barrier ratio
              // More enablers = higher score, more barriers = lower score
              const maxPossibleEnablers = domainMap.get(domainKey)?.enablers?.length || 6;
              const maxPossibleBarriers = domainMap.get(domainKey)?.barriers?.length || 6;
              
              const enablerRatio = enablerCount / maxPossibleEnablers;
              const barrierRatio = barrierCount / maxPossibleBarriers;
              
              // Score from 1-10: high enablers and low barriers = high score
              const domainScore = Math.max(1, Math.min(10, 
                5 + (enablerRatio * 5) - (barrierRatio * 4)
              ));
              
              totalEnablerScore += domainScore;
            }
          });

          // If we have enablers/barriers data, use it; otherwise fall back to flourishing/wellbeing proxy
          if (hasEnablersBarriersData && domainCount > 0) {
            enablerScore = totalEnablerScore / domainCount;
          } else if (flourishingCount > 0 || wellbeingCount > 0) {
            const avgFlourishingScore = flourishingCount > 0 ? flourishingScore / flourishingCount : 5;
            const avgWellbeingScore = wellbeingCount > 0 ? wellbeingScore / wellbeingCount : 5;
            enablerScore = (avgFlourishingScore + avgWellbeingScore) / 2;
          }

          // Calculate gap: tension indicates need, enabler indicates support
          // Higher tension score (0-100) = more balanced, lower = leaning to one side
          // We want to identify where there's high need but low enablers
          const normalizedTension = Math.abs(tensionScore - 50) / 50; // 0 = balanced, 1 = extreme
          const normalizedEnabler = (enablerScore - 1) / 9; // Convert 1-10 to 0-1
          
          const gapScore = normalizedTension - normalizedEnabler; // Positive = gap exists
          
          analysisData.gapAnalysis.push({
            sessionId,
            tensionScore,
            enablerScore,
            gapScore,
            normalizedTension,
            normalizedEnabler,
            hasActualEnablersData: hasEnablersBarriersData
          });
        }
      });

      // Calculate summary statistics for this cross-domain analysis
      if (analysisData.gapAnalysis.length > 0) {
        const gapScores = analysisData.gapAnalysis.map(g => g.gapScore);
        const avgGap = gapScores.reduce((a, b) => a + b, 0) / gapScores.length;
        const studentsWithGap = gapScores.filter(g => g > 0.2).length; // Threshold for significant gap
        const gapPercentage = (studentsWithGap / gapScores.length) * 100;

        heatmapData.push({
          ...analysisData,
          avgGapScore: Math.round(avgGap * 100) / 100,
          studentsWithGap,
          gapPercentage: Math.round(gapPercentage),
          totalStudents: gapScores.length
        });
      }
    });

    return heatmapData;
  }
}