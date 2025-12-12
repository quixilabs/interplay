import { supabase } from '../../../lib/supabase';
import { UniversityData, UniversityFormData, UniversityStats, SuperAdminDashboardData } from '../types';

export class SuperAdminUniversityService {
  // Get all universities with stats
  static async getAllUniversities(): Promise<(UniversityData & { stats: UniversityStats })[]> {
    try {
      const { data: universities, error } = await supabase
        .from('universities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get stats for each university
      const universitiesWithStats = await Promise.all(
        (universities || []).map(async (university) => {
          const stats = await this.getUniversityStats(university.slug);
          return { ...university, stats };
        })
      );

      return universitiesWithStats;
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  }

  // Get university stats
  static async getUniversityStats(universitySlug: string): Promise<UniversityStats> {
    try {
      // Get total responses
      const { count: totalResponses, error: totalError } = await supabase
        .from('survey_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('university_slug', universitySlug);

      if (totalError) throw totalError;

      // Get completed responses
      const { count: completedResponses, error: completedError } = await supabase
        .from('survey_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('university_slug', universitySlug)
        .eq('is_completed', true);

      if (completedError) throw completedError;

      // Get last response date
      const { data: lastResponse, error: lastError } = await supabase
        .from('survey_sessions')
        .select('created_at')
        .eq('university_slug', universitySlug)
        .eq('is_completed', true)
        .order('created_at', { ascending: false })
        .limit(1);

      // Get active sessions (started but not completed in last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: activeSessions, error: activeError } = await supabase
        .from('survey_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('university_slug', universitySlug)
        .eq('is_completed', false)
        .gte('start_time', oneDayAgo);

      if (activeError) throw activeError;

      const total = totalResponses || 0;
      const completed = completedResponses || 0;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        total_responses: total,
        completed_responses: completed,
        completion_rate: completionRate,
        last_response_date: lastResponse && lastResponse.length > 0 ? lastResponse[0].created_at : null,
        active_sessions: activeSessions || 0
      };
    } catch (error) {
      console.error('Error fetching university stats:', error);
      return {
        total_responses: 0,
        completed_responses: 0,
        completion_rate: 0,
        last_response_date: null,
        active_sessions: 0
      };
    }
  }

  // Create new university
  static async createUniversity(universityData: UniversityFormData): Promise<UniversityData> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .insert({
          name: universityData.name,
          slug: universityData.slug,
          admin_email: universityData.admin_email,
          survey_active: universityData.survey_active,
          is_active: universityData.is_active,
          branding_config: universityData.branding_config,
          survey_config: universityData.survey_config
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating university:', error);
      throw error;
    }
  }

  // Update university
  static async updateUniversity(id: string, universityData: Partial<UniversityFormData>): Promise<UniversityData> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .update({
          ...universityData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating university:', error);
      throw error;
    }
  }

  // Delete university (soft delete by setting is_active to false)
  static async deleteUniversity(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('universities')
        .update({ 
          is_active: false,
          survey_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting university:', error);
      throw error;
    }
  }

  // Hard delete university (use with caution)
  static async hardDeleteUniversity(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error hard deleting university:', error);
      throw error;
    }
  }

  // Get dashboard data
  static async getDashboardData(): Promise<SuperAdminDashboardData> {
    try {
      // Get all universities
      const { data: universities, error: universitiesError } = await supabase
        .from('universities')
        .select('*');

      if (universitiesError) throw universitiesError;

      const totalUniversities = universities?.length || 0;
      const activeUniversities = universities?.filter(u => u.is_active && u.survey_active).length || 0;

      // Get total responses across all universities
      const { count: totalResponses, error: responsesError } = await supabase
        .from('survey_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true);

      if (responsesError) throw responsesError;

      // Universities by status
      const universitiesByStatus = {
        active: universities?.filter(u => u.is_active && u.survey_active).length || 0,
        inactive: universities?.filter(u => u.is_active && !u.survey_active).length || 0,
        suspended: universities?.filter(u => !u.is_active).length || 0
      };

      // Recent activity (mock data for now - in production, you'd have an activity log table)
      const recentActivity = [
        {
          id: '1',
          type: 'university_created' as const,
          university_name: 'New University',
          timestamp: new Date().toISOString(),
          details: 'University created and activated'
        }
      ];

      return {
        total_universities: totalUniversities,
        active_universities: activeUniversities,
        total_responses: totalResponses || 0,
        universities_by_status: universitiesByStatus,
        recent_activity: recentActivity
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Validate university slug
  static async validateSlug(slug: string, excludeId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('universities')
        .select('id')
        .eq('slug', slug);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return !data || data.length === 0;
    } catch (error) {
      console.error('Error validating slug:', error);
      return false;
    }
  }

  // Generate slug from name
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Get complete student session data using optimized SQL query
  static async getStudentSessionData(sessionId: string): Promise<any> {
    try {
      // Get main session data with all joins
      const { data: sessionData, error: sessionError } = await supabase.rpc('get_complete_session_data', {
        p_session_id: sessionId
      });

      if (sessionError) {
        // Fallback to manual query if RPC doesn't exist
        const { data, error } = await supabase
          .from('survey_sessions')
          .select(`
            session_id,
            university_slug,
            start_time,
            completion_time,
            is_completed,
            email_for_results,
            demographics (
              year_in_school,
              enrollment_status,
              age_range,
              gender_identity,
              gender_self_describe,
              race_ethnicity,
              is_international,
              employment_status,
              has_caregiving_responsibilities,
              in_greek_organization,
              study_mode,
              transfer_student
            ),
            flourishing_scores (
              happiness_satisfaction_1,
              happiness_satisfaction_2,
              mental_physical_health_1,
              mental_physical_health_2,
              meaning_purpose_1,
              meaning_purpose_2,
              character_virtue_1,
              character_virtue_2,
              social_relationships_1,
              social_relationships_2,
              financial_stability_1,
              financial_stability_2
            ),
            school_wellbeing (
              assessment_version,
              belonging_score,
              enjoy_school_days,
              physical_activity,
              feel_safe,
              work_connected_goals,
              contribute_bigger_purpose,
              kind_to_others,
              manage_emotions,
              trusted_adult,
              supportive_friends,
              resources_participation,
              wellbeing_checklist,
              care_not_understood_supported,
              care_no_empathy_from_staff,
              care_school_doesnt_care,
              access_hard_find_resources,
              access_dont_know_where_help,
              access_long_appointment_wait,
              guidance_unsure_direction,
              guidance_want_help_planning,
              guidance_confused_courses,
              trust_messages_not_answered,
              trust_unclear_communication,
              trust_bounced_between_offices,
              connection_no_mentor,
              connection_hard_make_friends,
              connection_not_connected_students
            ),
            tensions_assessment (
              performance_wellbeing,
              ambition_contribution,
              selfreliance_connection,
              stability_growth,
              academic_creative
            ),
            text_responses (
              fastest_win_suggestion
            )
          `)
          .eq('session_id', sessionId)
          .single();

        if (error) throw error;

        // Get user enablers/barriers separately
        const { data: enablersBarriers, error: ebError } = await supabase
          .from('user_enablers_barriers')
          .select('domain_key, selected_enablers, selected_barriers, enabler_other_text, barrier_other_text, created_at')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (ebError) throw ebError;

        // Get growth modules separately
        const { data: growthModules, error: gmError } = await supabase
          .from('growth_modules')
          .select('domain_name, enabler_selections, barrier_selection, additional_comments, created_at')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (gmError) throw gmError;

        return {
          ...data,
          user_enablers_barriers: enablersBarriers || [],
          growth_modules: growthModules || []
        };
      }

      return sessionData;
    } catch (error) {
      console.error('Error fetching student session data:', error);
      throw error;
    }
  }

  // Get detailed survey responses for a university
  static async getUniversityResponses(universitySlug: string, includeIncomplete: boolean = true): Promise<any[]> {
    try {
      let query = supabase
        .from('survey_sessions')
        .select(`
          *,
          demographics(*),
          flourishing_scores(*),
          school_wellbeing(*),
          text_responses(*),
          tensions_assessment(*),
          user_enablers_barriers(*)
        `)
        .eq('university_slug', universitySlug);
      
      // Only filter by completion status if we don't want incomplete responses
      if (!includeIncomplete) {
        query = query.eq('is_completed', true);
      }
      
      const { data: sessions, error: sessionsError } = await query
        .order('completion_time', { ascending: false, nullsFirst: false });

      if (sessionsError) throw sessionsError;

      return sessions || [];
    } catch (error) {
      console.error('Error fetching university responses:', error);
      throw error;
    }
  }

  // Export single session as CSV-ready object
  static formatSessionForExport(session: any): any {
    const demographics = Array.isArray(session.demographics) ? session.demographics[0] : session.demographics;
    const flourishing = Array.isArray(session.flourishing_scores) ? session.flourishing_scores[0] : session.flourishing_scores;
    const wellbeing = Array.isArray(session.school_wellbeing) ? session.school_wellbeing[0] : session.school_wellbeing;
    const tensions = Array.isArray(session.tensions_assessment) ? session.tensions_assessment[0] : session.tensions_assessment;
    const textResponse = Array.isArray(session.text_responses) ? session.text_responses[0] : session.text_responses;
    
    return {
      // Session Info
      session_id: session.session_id,
      university_slug: session.university_slug,
      start_time: session.start_time,
      completion_time: session.completion_time,
      is_completed: session.is_completed,
      email_for_results: session.email_for_results || '',
      
      // Demographics
      year_in_school: demographics?.year_in_school || '',
      enrollment_status: demographics?.enrollment_status || '',
      age_range: demographics?.age_range || '',
      gender_identity: demographics?.gender_identity || '',
      gender_self_describe: demographics?.gender_self_describe || '',
      race_ethnicity: demographics?.race_ethnicity?.join('; ') || '',
      is_international: demographics?.is_international || '',
      employment_status: demographics?.employment_status || '',
      has_caregiving_responsibilities: demographics?.has_caregiving_responsibilities || '',
      in_greek_organization: demographics?.in_greek_organization || '',
      study_mode: demographics?.study_mode || '',
      transfer_student: demographics?.transfer_student || '',
      
      // Flourishing Scores
      happiness_satisfaction_1: flourishing?.happiness_satisfaction_1 ?? '',
      happiness_satisfaction_2: flourishing?.happiness_satisfaction_2 ?? '',
      mental_physical_health_1: flourishing?.mental_physical_health_1 ?? '',
      mental_physical_health_2: flourishing?.mental_physical_health_2 ?? '',
      meaning_purpose_1: flourishing?.meaning_purpose_1 ?? '',
      meaning_purpose_2: flourishing?.meaning_purpose_2 ?? '',
      character_virtue_1: flourishing?.character_virtue_1 ?? '',
      character_virtue_2: flourishing?.character_virtue_2 ?? '',
      social_relationships_1: flourishing?.social_relationships_1 ?? '',
      social_relationships_2: flourishing?.social_relationships_2 ?? '',
      financial_stability_1: flourishing?.financial_stability_1 ?? '',
      financial_stability_2: flourishing?.financial_stability_2 ?? '',
      
      // School Wellbeing
      wellbeing_assessment_version: wellbeing?.assessment_version || 'v1',
      belonging_score: wellbeing?.belonging_score ?? '',
      enjoy_school_days: wellbeing?.enjoy_school_days ?? '',
      physical_activity: wellbeing?.physical_activity ?? '',
      feel_safe: wellbeing?.feel_safe ?? '',
      work_connected_goals: wellbeing?.work_connected_goals ?? '',
      contribute_bigger_purpose: wellbeing?.contribute_bigger_purpose ?? '',
      kind_to_others: wellbeing?.kind_to_others ?? '',
      manage_emotions: wellbeing?.manage_emotions ?? '',
      trusted_adult: wellbeing?.trusted_adult ?? '',
      supportive_friends: wellbeing?.supportive_friends ?? '',
      resources_participation: wellbeing?.resources_participation ?? '',
      wellbeing_checklist: wellbeing?.wellbeing_checklist?.join('; ') || '',
      
      // V2 Support Barriers - CARE Driver
      care_not_understood_supported: wellbeing?.care_not_understood_supported ?? '',
      care_no_empathy_from_staff: wellbeing?.care_no_empathy_from_staff ?? '',
      care_school_doesnt_care: wellbeing?.care_school_doesnt_care ?? '',
      care_barrier_count: wellbeing?.assessment_version === 'v2' 
        ? [wellbeing?.care_not_understood_supported, wellbeing?.care_no_empathy_from_staff, wellbeing?.care_school_doesnt_care].filter(Boolean).length 
        : '',
      care_score: wellbeing?.assessment_version === 'v2' 
        ? (10 - ([wellbeing?.care_not_understood_supported, wellbeing?.care_no_empathy_from_staff, wellbeing?.care_school_doesnt_care].filter(Boolean).length * 2.5)).toFixed(1) 
        : '',
      
      // V2 Support Barriers - ACCESS Driver
      access_hard_find_resources: wellbeing?.access_hard_find_resources ?? '',
      access_dont_know_where_help: wellbeing?.access_dont_know_where_help ?? '',
      access_long_appointment_wait: wellbeing?.access_long_appointment_wait ?? '',
      access_barrier_count: wellbeing?.assessment_version === 'v2' 
        ? [wellbeing?.access_hard_find_resources, wellbeing?.access_dont_know_where_help, wellbeing?.access_long_appointment_wait].filter(Boolean).length 
        : '',
      access_score: wellbeing?.assessment_version === 'v2' 
        ? (10 - ([wellbeing?.access_hard_find_resources, wellbeing?.access_dont_know_where_help, wellbeing?.access_long_appointment_wait].filter(Boolean).length * 2.5)).toFixed(1) 
        : '',
      
      // V2 Support Barriers - GUIDANCE Driver
      guidance_unsure_direction: wellbeing?.guidance_unsure_direction ?? '',
      guidance_want_help_planning: wellbeing?.guidance_want_help_planning ?? '',
      guidance_confused_courses: wellbeing?.guidance_confused_courses ?? '',
      guidance_barrier_count: wellbeing?.assessment_version === 'v2' 
        ? [wellbeing?.guidance_unsure_direction, wellbeing?.guidance_want_help_planning, wellbeing?.guidance_confused_courses].filter(Boolean).length 
        : '',
      guidance_score: wellbeing?.assessment_version === 'v2' 
        ? (10 - ([wellbeing?.guidance_unsure_direction, wellbeing?.guidance_want_help_planning, wellbeing?.guidance_confused_courses].filter(Boolean).length * 2.5)).toFixed(1) 
        : '',
      
      // V2 Support Barriers - TRUST Driver
      trust_messages_not_answered: wellbeing?.trust_messages_not_answered ?? '',
      trust_unclear_communication: wellbeing?.trust_unclear_communication ?? '',
      trust_bounced_between_offices: wellbeing?.trust_bounced_between_offices ?? '',
      trust_barrier_count: wellbeing?.assessment_version === 'v2' 
        ? [wellbeing?.trust_messages_not_answered, wellbeing?.trust_unclear_communication, wellbeing?.trust_bounced_between_offices].filter(Boolean).length 
        : '',
      trust_score: wellbeing?.assessment_version === 'v2' 
        ? (10 - ([wellbeing?.trust_messages_not_answered, wellbeing?.trust_unclear_communication, wellbeing?.trust_bounced_between_offices].filter(Boolean).length * 2.5)).toFixed(1) 
        : '',
      
      // V2 Support Barriers - CONNECTION Driver
      connection_no_mentor: wellbeing?.connection_no_mentor ?? '',
      connection_hard_make_friends: wellbeing?.connection_hard_make_friends ?? '',
      connection_not_connected_students: wellbeing?.connection_not_connected_students ?? '',
      connection_barrier_count: wellbeing?.assessment_version === 'v2' 
        ? [wellbeing?.connection_no_mentor, wellbeing?.connection_hard_make_friends, wellbeing?.connection_not_connected_students].filter(Boolean).length 
        : '',
      connection_score: wellbeing?.assessment_version === 'v2' 
        ? (10 - ([wellbeing?.connection_no_mentor, wellbeing?.connection_hard_make_friends, wellbeing?.connection_not_connected_students].filter(Boolean).length * 2.5)).toFixed(1) 
        : '',
      
      // V2 Overall Growth Index Score (average of all 5 driver scores)
      growth_index_score: wellbeing?.assessment_version === 'v2' 
        ? (() => {
            const careScore = 10 - ([wellbeing?.care_not_understood_supported, wellbeing?.care_no_empathy_from_staff, wellbeing?.care_school_doesnt_care].filter(Boolean).length * 2.5);
            const accessScore = 10 - ([wellbeing?.access_hard_find_resources, wellbeing?.access_dont_know_where_help, wellbeing?.access_long_appointment_wait].filter(Boolean).length * 2.5);
            const guidanceScore = 10 - ([wellbeing?.guidance_unsure_direction, wellbeing?.guidance_want_help_planning, wellbeing?.guidance_confused_courses].filter(Boolean).length * 2.5);
            const trustScore = 10 - ([wellbeing?.trust_messages_not_answered, wellbeing?.trust_unclear_communication, wellbeing?.trust_bounced_between_offices].filter(Boolean).length * 2.5);
            const connectionScore = 10 - ([wellbeing?.connection_no_mentor, wellbeing?.connection_hard_make_friends, wellbeing?.connection_not_connected_students].filter(Boolean).length * 2.5);
            return ((careScore + accessScore + guidanceScore + trustScore + connectionScore) / 5).toFixed(1);
          })()
        : '',
      
      // Tensions
      performance_wellbeing: tensions?.performance_wellbeing ?? '',
      ambition_contribution: tensions?.ambition_contribution ?? '',
      selfreliance_connection: tensions?.selfreliance_connection ?? '',
      stability_growth: tensions?.stability_growth ?? '',
      academic_creative: tensions?.academic_creative ?? '',
      
      // Text Responses
      fastest_win_suggestion: textResponse?.fastest_win_suggestion || '',
      
      // Enablers and Barriers (flattened)
      enablers_barriers: (session.user_enablers_barriers || []).map((eb: any) => 
        `${eb.domain_key}: E[${(eb.selected_enablers || []).join(', ')}] B[${(eb.selected_barriers || []).join(', ')}]${eb.enabler_other_text ? ` E_OTHER[${eb.enabler_other_text}]` : ''}${eb.barrier_other_text ? ` B_OTHER[${eb.barrier_other_text}]` : ''}`
      ).join(' | ') || '',
      
      // Growth Modules (if any)
      growth_modules: (session.growth_modules || []).map((gm: any) =>
        `${gm.domain_name}: ${gm.enabler_selections || ''} / ${gm.barrier_selection || ''}${gm.additional_comments ? ` (${gm.additional_comments})` : ''}`
      ).join(' | ') || ''
    };
  }

  // Get aggregated response data for a university
  static async getUniversityAnalytics(universitySlug: string): Promise<any> {
    try {
      const responses = await this.getUniversityResponses(universitySlug);
      
      if (responses.length === 0) {
        return {
          totalResponses: 0,
          completionRate: 0,
          averageCompletionTime: 0,
          domainAverages: {},
          demographicBreakdown: {},
          topEnablers: [],
          topBarriers: [],
          fastestWinSuggestions: []
        };
      }

      // Calculate domain averages
      const domainAverages: any = {};
      const domains = [
        'happiness_satisfaction',
        'mental_physical_health',
        'meaning_purpose',
        'character_virtue',
        'social_relationships',
        'financial_stability'
      ];

      domains.forEach(domain => {
        const scores: number[] = [];
        responses.forEach(response => {
          const flourishing = response.flourishing_scores?.[0];
          if (flourishing) {
            const score1 = flourishing[`${domain}_1`];
            const score2 = flourishing[`${domain}_2`];
            if (score1 !== null) scores.push(score1);
            if (score2 !== null) scores.push(score2);
          }
        });
        
        if (scores.length > 0) {
          domainAverages[domain] = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
        }
      });

      // Calculate demographic breakdown
      const demographicBreakdown: any = {};
      const demographics = responses.map(r => r.demographics?.[0]).filter(Boolean);
      
      // Year in school breakdown
      demographicBreakdown.yearInSchool = {};
      demographics.forEach(demo => {
        const year = demo.year_in_school;
        if (year) {
          demographicBreakdown.yearInSchool[year] = (demographicBreakdown.yearInSchool[year] || 0) + 1;
        }
      });

      // Gender breakdown
      demographicBreakdown.genderIdentity = {};
      demographics.forEach(demo => {
        const gender = demo.gender_identity;
        if (gender) {
          demographicBreakdown.genderIdentity[gender] = (demographicBreakdown.genderIdentity[gender] || 0) + 1;
        }
      });

      // Analyze enablers and barriers
      const enablerCounts: any = {};
      const barrierCounts: any = {};
      
      responses.forEach(response => {
        response.user_enablers_barriers?.forEach((eb: any) => {
          eb.selected_enablers?.forEach((enabler: string) => {
            enablerCounts[enabler] = (enablerCounts[enabler] || 0) + 1;
          });
          eb.selected_barriers?.forEach((barrier: string) => {
            barrierCounts[barrier] = (barrierCounts[barrier] || 0) + 1;
          });
        });
      });

      const topEnablers = Object.entries(enablerCounts)
        .map(([name, count]: [string, any]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const topBarriers = Object.entries(barrierCounts)
        .map(([name, count]: [string, any]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Get fastest win suggestions
      const fastestWinSuggestions = responses
        .map(r => r.text_responses?.[0]?.fastest_win_suggestion)
        .filter(Boolean);

      return {
        totalResponses: responses.length,
        domainAverages,
        demographicBreakdown,
        topEnablers,
        topBarriers,
        fastestWinSuggestions
      };
    } catch (error) {
      console.error('Error fetching university analytics:', error);
      throw error;
    }
  }
}