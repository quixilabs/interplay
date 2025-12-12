import { supabase } from '../lib/supabase';
import { getCriticalityLevel } from '../utils/calculateCriticality';
import { DOMAIN_CONFIG, ActionPathwayData, DomainActionData, DomainKey } from '../types/actionPathway';

// Debug flag - set to false to disable debug logging in production
const DEBUG_ANALYTICS = import.meta.env.DEV; // Automatically disabled in production builds

export class AnalyticsService {
  // Get survey analytics for dashboard
  static async getSurveyAnalytics(universitySlug?: string) {
    try {
      // Return mock data for demo university (can be toggled with env var)
      // Set VITE_USE_MOCK_DATA=false in .env.local to use real database data
      const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
      
      if (universitySlug === 'demo-university' && useMockData) {
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

      // Build combined responses array for filtering
      const responses = this.buildResponsesArray(sessions || [], demographicsData || [], flourishingData || [], wellbeingData || [], enablersBarriersData || [], tensionsData || []);

      // Calculate action pathway data
      const actionPathwayData = this.calculateActionPathway(flourishingData || [], enablersBarriersData || []);

      // Calculate Growth Index Score from v2 support barriers data
      const growthIndexScore = this.calculateGrowthIndexScore(wellbeingData || []);

      // Calculate individual driver scores from v2 support barriers data
      const driverScores = this.calculateDriverScores(wellbeingData || []);

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
        tensionAnalysis,
        responses,
        actionPathwayData,
        growthIndexScore,
        driverScores
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

  // Make this method public so it can be called from Dashboard when filtering
  static calculateOverallFlourishingScore(data: any[]) {
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

  // Make this method public so it can be called from Dashboard when filtering
  static calculateAtRiskStudents(data: any[]) {
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


  private static buildResponsesArray(sessions: any[], demographicsData: any[], flourishingData: any[], wellbeingData: any[], enablersBarriersData: any[], tensionsData: any[]) {
    // Debug: Check what data we received
    if (DEBUG_ANALYTICS) {
      console.log('🔍 DEBUG: Data received for building responses:');
      console.log('  - Sessions:', sessions.length, 'records');
      console.log('  - Demographics:', demographicsData.length, 'records');
      console.log('  - Flourishing:', flourishingData.length, 'records');
      console.log('  - Wellbeing:', wellbeingData.length, 'records');
      
      if (sessions.length > 0) {
        console.log('  - Sample session.id (UUID):', sessions[0].id);
        console.log('  - Sample session.session_id (TEXT):', sessions[0].session_id);
      }
      if (demographicsData.length > 0) {
        console.log('  - Sample demographics session_id:', demographicsData[0].session_id);
        console.log('  - Sample demographics data:', {
          session_id: demographicsData[0].session_id,
          year_in_school: demographicsData[0].year_in_school,
          gender_identity: demographicsData[0].gender_identity,
          race_ethnicity: demographicsData[0].race_ethnicity
        });
      }
    }

    // Create maps by session_id for quick lookup
    const demographicsMap = new Map();
    demographicsData.forEach(d => demographicsMap.set(d.session_id, d));

    const flourishingMap = new Map();
    flourishingData.forEach(f => flourishingMap.set(f.session_id, f));

    const wellbeingMap = new Map();
    wellbeingData.forEach(w => wellbeingMap.set(w.session_id, w));

    const tensionsMap = new Map();
    tensionsData.forEach(t => tensionsMap.set(t.session_id, t));

    // Group enablers/barriers by session_id
    const enablersBarriersMap = new Map();
    enablersBarriersData.forEach(eb => {
      if (!enablersBarriersMap.has(eb.session_id)) {
        enablersBarriersMap.set(eb.session_id, []);
      }
      enablersBarriersMap.get(eb.session_id).push(eb);
    });

    // Build responses array from completed sessions
    const responses = sessions
      .filter(session => session.is_completed)
      .map(session => {
        // IMPORTANT: Use session.session_id (text) not session.id (uuid) to match other tables
        const sessionKey = session.session_id;
        const demographics = demographicsMap.get(sessionKey) || {};
        const flourishing = flourishingMap.get(sessionKey) || {};
        const wellbeing = wellbeingMap.get(sessionKey) || {};
        const tensions = tensionsMap.get(sessionKey) || {};
        const enablersBarriers = enablersBarriersMap.get(sessionKey) || [];

        return {
          id: session.id,
          sessionId: session.session_id, // Use the text session_id, not the UUID id
          createdAt: session.created_at,
          demographics: {
            yearInSchool: demographics.year_in_school,
            enrollmentStatus: demographics.enrollment_status,
            ageRange: demographics.age_range,
            genderIdentity: demographics.gender_identity,
            raceEthnicity: demographics.race_ethnicity || [],
            isInternational: demographics.is_international_student,
            employmentStatus: demographics.employment_status,
            hasCaregavingResponsibilities: demographics.has_caregiving_responsibilities,
            inGreekOrganization: demographics.in_greek_organization,
            studyMode: demographics.study_mode,
            transferStudent: demographics.transfer_student
          },
          flourishing: {
            happiness_satisfaction_1: flourishing.happiness_satisfaction_1,
            happiness_satisfaction_2: flourishing.happiness_satisfaction_2,
            mental_physical_health_1: flourishing.mental_physical_health_1,
            mental_physical_health_2: flourishing.mental_physical_health_2,
            meaning_purpose_1: flourishing.meaning_purpose_1,
            meaning_purpose_2: flourishing.meaning_purpose_2,
            character_virtue_1: flourishing.character_virtue_1,
            character_virtue_2: flourishing.character_virtue_2,
            social_relationships_1: flourishing.social_relationships_1,
            social_relationships_2: flourishing.social_relationships_2,
            financial_stability_1: flourishing.financial_stability_1,
            financial_stability_2: flourishing.financial_stability_2
          },
          schoolWellbeing: wellbeing,
          tensions: tensions,
          enablersBarriers: enablersBarriers
        };
      });

    // Debug logging to help diagnose filter issues
    if (DEBUG_ANALYTICS && responses.length > 0) {
      console.log('🔍 DEBUG: Sample response demographics:', responses[0]?.demographics);
      console.log('🔍 DEBUG: Total responses:', responses.length);
      
      // Show unique values for each demographic field
      const uniqueValues: any = {};
      responses.forEach(r => {
        Object.keys(r.demographics).forEach(key => {
          if (!uniqueValues[key]) uniqueValues[key] = new Set();
          const value = r.demographics[key as keyof typeof r.demographics];
          if (Array.isArray(value)) {
            value.forEach(v => uniqueValues[key].add(v));
          } else if (value) {
            uniqueValues[key].add(value);
          }
        });
      });
      
      console.log('🔍 DEBUG: Unique demographic values in database:');
      Object.keys(uniqueValues).forEach(key => {
        console.log(`  ${key}:`, Array.from(uniqueValues[key]));
      });
    }

    return responses;
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

  /**
   * Calculate Action Pathway data: domain criticality with top enablers/barriers
   * This helps administrators identify which domains need attention and what interventions to focus on
   * Public method for use in filtering
   */
  static calculateActionPathwayPublic(flourishingData: any[], enablersBarriersData: any[]): ActionPathwayData {
    return this.calculateActionPathway(flourishingData, enablersBarriersData);
  }

  /**
   * Public method for calculating Growth Index Score - used when filtering data
   * @param wellbeingData - Array of school wellbeing responses (v2 format)
   * @returns Growth Index Score rounded to 1 decimal place, or null if no v2 data available
   */
  static calculateGrowthIndexScorePublic(wellbeingData: any[]): number | null {
    return this.calculateGrowthIndexScore(wellbeingData);
  }

  /**
   * Calculate individual driver scores from v2 school support barriers data
   * Returns scores for Access, Guidance, Connection, Trust, and Care
   * 
   * @param wellbeingData - Array of school wellbeing responses (v2 format)
   * @returns Object with driver scores or null values if no data available
   */
  private static calculateDriverScores(wellbeingData: any[]): Record<string, number | null> {
    // Filter for v2 responses only - must have explicit v2 version
    const v2Responses = wellbeingData.filter(response => 
      response.assessment_version === 'v2'
    );

    if (v2Responses.length === 0) {
      return {
        access: null,
        guidance: null,
        connection: null,
        trust: null,
        care: null
      };
    }

    // Define driver column mappings (same as Growth Index Score)
    const driverMapping = {
      access: [
        'access_hard_find_resources',
        'access_dont_know_where_help',
        'access_long_appointment_wait'
      ],
      guidance: [
        'guidance_unsure_direction',
        'guidance_want_help_planning',
        'guidance_confused_courses'
      ],
      connection: [
        'connection_no_mentor',
        'connection_hard_make_friends',
        'connection_not_connected_students'
      ],
      trust: [
        'trust_messages_not_answered',
        'trust_unclear_communication',
        'trust_bounced_between_offices'
      ],
      care: [
        'care_not_understood_supported',
        'care_no_empathy_from_staff',
        'care_school_doesnt_care'
      ]
    };

    // Calculate driver scores for each student, then average
    const studentDriverScores: Record<string, number[]> = {
      access: [],
      guidance: [],
      connection: [],
      trust: [],
      care: []
    };

    v2Responses.forEach(response => {
      // Calculate each driver score for this student
      Object.entries(driverMapping).forEach(([driver, columns]) => {
        let barrierCount = 0;
        let hasData = false;

        columns.forEach(column => {
          const value = response[column];
          if (value !== undefined && value !== null) {
            hasData = true;
            if (value === true) {
              barrierCount++;
            }
          }
        });

        // Only include if student has responded to this driver's questions
        if (hasData) {
          const driverScore = 10 - (barrierCount * 2.5);
          studentDriverScores[driver].push(driverScore);
        }
      });
    });

    // Calculate average score for each driver across all students
    const driverAverages: Record<string, number | null> = {};

    Object.entries(studentDriverScores).forEach(([driver, scores]) => {
      if (scores.length > 0) {
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        driverAverages[driver] = Math.round(average * 10) / 10;
      } else {
        driverAverages[driver] = null;
      }
    });

    return driverAverages;
  }

  /**
   * Public method for calculating driver scores - used when filtering data
   * @param wellbeingData - Array of school wellbeing responses (v2 format)
   * @returns Object with driver scores or null values if no data available
   */
  static calculateDriverScoresPublic(wellbeingData: any[]): Record<string, number | null> {
    return this.calculateDriverScores(wellbeingData);
  }

  /**
   * Internal calculation method for Action Pathway data
   */
  private static calculateActionPathway(flourishingData: any[], enablersBarriersData: any[]): ActionPathwayData {
    if (flourishingData.length === 0) {
      return {
        domains: [],
        totalResponses: 0
      };
    }

    const domainKeys = Object.keys(DOMAIN_CONFIG) as DomainKey[];
    const domainResults: DomainActionData[] = [];

    // Process each domain
    domainKeys.forEach(domainKey => {
      const config = DOMAIN_CONFIG[domainKey];
      const [col1, col2] = config.columns;

      // Calculate domain average score across all students
      const domainScores: number[] = [];
      
      flourishingData.forEach(response => {
        const score1 = response[col1];
        const score2 = response[col2];
        
        // Only include if BOTH questions are answered (as per requirements)
        if (score1 !== null && score1 !== undefined && score2 !== null && score2 !== undefined) {
          const domainAvg = (score1 + score2) / 2;
          domainScores.push(domainAvg);
        }
      });

      // Skip domain if no valid responses
      if (domainScores.length === 0) {
        return;
      }

      const averageScore = domainScores.reduce((sum, score) => sum + score, 0) / domainScores.length;
      const roundedAverage = Math.round(averageScore * 10) / 10;

      // Calculate criticality level
      const criticality = getCriticalityLevel(roundedAverage);

      // Find top enabler and barrier for this domain
      const domainEnablersBarriers = enablersBarriersData.filter(
        eb => eb.domain_key === domainKey
      );

      const enablerCounts: Record<string, number> = {};
      const barrierCounts: Record<string, number> = {};

      domainEnablersBarriers.forEach(record => {
        // Count enablers
        if (record.selected_enablers && Array.isArray(record.selected_enablers)) {
          record.selected_enablers.forEach((enabler: string) => {
            enablerCounts[enabler] = (enablerCounts[enabler] || 0) + 1;
          });
        }

        // Count barriers
        if (record.selected_barriers && Array.isArray(record.selected_barriers)) {
          record.selected_barriers.forEach((barrier: string) => {
            barrierCounts[barrier] = (barrierCounts[barrier] || 0) + 1;
          });
        }
      });

      // Get top enabler (most frequently selected)
      let topEnabler = 'None reported';
      if (Object.keys(enablerCounts).length > 0) {
        const sortedEnablers = Object.entries(enablerCounts)
          .sort((a, b) => {
            // Sort by frequency, then alphabetically for ties
            if (b[1] === a[1]) {
              return a[0].localeCompare(b[0]);
            }
            return b[1] - a[1];
          });
        topEnabler = sortedEnablers[0][0];
      }

      // Get top barrier (most frequently selected)
      let topBarrier = 'None reported';
      if (Object.keys(barrierCounts).length > 0) {
        const sortedBarriers = Object.entries(barrierCounts)
          .sort((a, b) => {
            // Sort by frequency, then alphabetically for ties
            if (b[1] === a[1]) {
              return a[0].localeCompare(b[0]);
            }
            return b[1] - a[1];
          });
        topBarrier = sortedBarriers[0][0];
      }

      domainResults.push({
        domainKey,
        domainLabel: config.label,
        averageScore: roundedAverage,
        criticality,
        topEnabler,
        topBarrier,
        sampleSize: domainScores.length
      });
    });

    // Sort domains by criticality (highest level first = worst scores)
    // Then by average score (lowest first within same criticality level)
    const sortedDomains = domainResults.sort((a, b) => {
      if (b.criticality.level === a.criticality.level) {
        return a.averageScore - b.averageScore;
      }
      return b.criticality.level - a.criticality.level;
    });

    return {
      domains: sortedDomains,
      totalResponses: flourishingData.length
    };
  }

  /**
   * Calculate Growth Index Score from v2 school support barriers data
   * Growth Index Score = (Access Score + Guidance Score + Connection Score + Trust Score + Care Score) / 5
   * Each driver score = 10 - (number of selected statements × 2.5)
   * 
   * @param wellbeingData - Array of school wellbeing responses (v2 format)
   * @returns Growth Index Score rounded to 1 decimal place, or null if no v2 data available
   */
  private static calculateGrowthIndexScore(wellbeingData: any[]): number | null {
    // Filter for v2 responses only - must have explicit v2 version
    const v2Responses = wellbeingData.filter(response => 
      response.assessment_version === 'v2'
    );

    if (v2Responses.length === 0) {
      return null;
    }

    // Define driver column mappings
    const driverMapping = {
      access: [
        'access_hard_find_resources',
        'access_dont_know_where_help',
        'access_long_appointment_wait'
      ],
      guidance: [
        'guidance_unsure_direction',
        'guidance_want_help_planning',
        'guidance_confused_courses'
      ],
      connection: [
        'connection_no_mentor',
        'connection_hard_make_friends',
        'connection_not_connected_students'
      ],
      trust: [
        'trust_messages_not_answered',
        'trust_unclear_communication',
        'trust_bounced_between_offices'
      ],
      care: [
        'care_not_understood_supported',
        'care_no_empathy_from_staff',
        'care_school_doesnt_care'
      ]
    };

    // Calculate driver scores for each student, then average
    const studentDriverScores: Record<string, number[]> = {
      access: [],
      guidance: [],
      connection: [],
      trust: [],
      care: []
    };

    v2Responses.forEach(response => {
      // Calculate each driver score for this student
      Object.entries(driverMapping).forEach(([driver, columns]) => {
        let barrierCount = 0;
        let hasData = false;

        columns.forEach(column => {
          const value = response[column];
          if (value !== undefined && value !== null) {
            hasData = true;
            if (value === true) {
              barrierCount++;
            }
          }
        });

        // Only include if student has responded to this driver's questions
        if (hasData) {
          const driverScore = 10 - (barrierCount * 2.5);
          studentDriverScores[driver].push(driverScore);
        }
      });
    });

    // Calculate average score for each driver across all students
    const driverAverages: Record<string, number> = {};
    let validDriverCount = 0;

    Object.entries(studentDriverScores).forEach(([driver, scores]) => {
      if (scores.length > 0) {
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        driverAverages[driver] = average;
        validDriverCount++;
      }
    });

    // Calculate Growth Index Score if we have at least one driver
    if (validDriverCount === 0) {
      return null;
    }

    const growthIndexScore = Object.values(driverAverages).reduce((sum, avg) => sum + avg, 0) / validDriverCount;

    // Round to 1 decimal place
    return Math.round(growthIndexScore * 10) / 10;
  }
}