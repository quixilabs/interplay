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
        .order('completion_time', { ascending: false });

      if (sessionsError) throw sessionsError;

      return sessions || [];
    } catch (error) {
      console.error('Error fetching university responses:', error);
      throw error;
    }
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