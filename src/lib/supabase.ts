import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up your Supabase connection.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      universities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          admin_email: string;
          survey_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          admin_email: string;
          survey_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          admin_email?: string;
          survey_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      survey_sessions: {
        Row: {
          id: string;
          session_id: string;
          university_id: string | null;
          university_slug: string;
          start_time: string;
          completion_time: string | null;
          is_completed: boolean;
          ip_address: string | null;
          user_agent: string | null;
          email_for_results: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          university_id?: string | null;
          university_slug: string;
          start_time?: string;
          completion_time?: string | null;
          is_completed?: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          email_for_results?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          university_id?: string | null;
          university_slug?: string;
          start_time?: string;
          completion_time?: string | null;
          is_completed?: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          email_for_results?: string | null;
          created_at?: string;
        };
      };
      demographics: {
        Row: {
          id: string;
          session_id: string;
          year_in_school: string | null;
          enrollment_status: string | null;
          age_range: string | null;
          gender_identity: string | null;
          gender_self_describe: string | null;
          race_ethnicity: string[] | null;
          is_international: string | null;
          employment_status: string | null;
          has_caregiving_responsibilities: string | null;
          in_greek_organization: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          year_in_school?: string | null;
          enrollment_status?: string | null;
          age_range?: string | null;
          gender_identity?: string | null;
          gender_self_describe?: string | null;
          race_ethnicity?: string[] | null;
          is_international?: string | null;
          employment_status?: string | null;
          has_caregiving_responsibilities?: string | null;
          in_greek_organization?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          year_in_school?: string | null;
          enrollment_status?: string | null;
          age_range?: string | null;
          gender_identity?: string | null;
          gender_self_describe?: string | null;
          race_ethnicity?: string[] | null;
          is_international?: string | null;
          employment_status?: string | null;
          has_caregiving_responsibilities?: string | null;
          in_greek_organization?: string | null;
          created_at?: string;
        };
      };
      flourishing_scores: {
        Row: {
          id: string;
          session_id: string;
          happiness_satisfaction_1: number | null;
          happiness_satisfaction_2: number | null;
          mental_physical_health_1: number | null;
          mental_physical_health_2: number | null;
          meaning_purpose_1: number | null;
          meaning_purpose_2: number | null;
          character_virtue_1: number | null;
          character_virtue_2: number | null;
          social_relationships_1: number | null;
          social_relationships_2: number | null;
          financial_stability_1: number | null;
          financial_stability_2: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          happiness_satisfaction_1?: number | null;
          happiness_satisfaction_2?: number | null;
          mental_physical_health_1?: number | null;
          mental_physical_health_2?: number | null;
          meaning_purpose_1?: number | null;
          meaning_purpose_2?: number | null;
          character_virtue_1?: number | null;
          character_virtue_2?: number | null;
          social_relationships_1?: number | null;
          social_relationships_2?: number | null;
          financial_stability_1?: number | null;
          financial_stability_2?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          happiness_satisfaction_1?: number | null;
          happiness_satisfaction_2?: number | null;
          mental_physical_health_1?: number | null;
          mental_physical_health_2?: number | null;
          meaning_purpose_1?: number | null;
          meaning_purpose_2?: number | null;
          character_virtue_1?: number | null;
          character_virtue_2?: number | null;
          social_relationships_1?: number | null;
          social_relationships_2?: number | null;
          financial_stability_1?: number | null;
          financial_stability_2?: number | null;
          created_at?: string;
        };
      };
      school_wellbeing: {
        Row: {
          id: string;
          session_id: string;
          belonging_score: number | null;
          enjoy_school_days: number | null;
          physical_activity: number | null;
          feel_safe: number | null;
          work_connected_goals: number | null;
          contribute_bigger_purpose: number | null;
          kind_to_others: number | null;
          manage_emotions: number | null;
          trusted_adult: number | null;
          supportive_friends: number | null;
          resources_participation: number | null;
          wellbeing_checklist: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          belonging_score?: number | null;
          enjoy_school_days?: number | null;
          physical_activity?: number | null;
          feel_safe?: number | null;
          work_connected_goals?: number | null;
          contribute_bigger_purpose?: number | null;
          kind_to_others?: number | null;
          manage_emotions?: number | null;
          trusted_adult?: number | null;
          supportive_friends?: number | null;
          resources_participation?: number | null;
          wellbeing_checklist?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          belonging_score?: number | null;
          enjoy_school_days?: number | null;
          physical_activity?: number | null;
          feel_safe?: number | null;
          work_connected_goals?: number | null;
          contribute_bigger_purpose?: number | null;
          kind_to_others?: number | null;
          manage_emotions?: number | null;
          trusted_adult?: number | null;
          supportive_friends?: number | null;
          resources_participation?: number | null;
          wellbeing_checklist?: string[] | null;
          created_at?: string;
        };
      };
      growth_modules: {
        Row: {
          id: string;
          session_id: string;
          domain_name: string;
          enabler_selections: string[] | null;
          barrier_selection: string | null;
          additional_comments: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          domain_name: string;
          enabler_selections?: string[] | null;
          barrier_selection?: string | null;
          additional_comments?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          domain_name?: string;
          enabler_selections?: string[] | null;
          barrier_selection?: string | null;
          additional_comments?: string | null;
          created_at?: string;
        };
      };
      text_responses: {
        Row: {
          id: string;
          session_id: string;
          bright_spots: Record<string, string> | null;
          fastest_win_suggestion: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          bright_spots?: Record<string, string> | null;
          fastest_win_suggestion?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          bright_spots?: Record<string, string> | null;
          fastest_win_suggestion?: string | null;
          created_at?: string;
        };
      };
      tensions_assessment: {
        Row: {
          id: string;
          session_id: string;
          performance_wellbeing: number | null;
          ambition_contribution: number | null;
          selfreliance_connection: number | null;
          stability_growth: number | null;
          academic_creative: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          performance_wellbeing?: number | null;
          ambition_contribution?: number | null;
          selfreliance_connection?: number | null;
          stability_growth?: number | null;
          academic_creative?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          performance_wellbeing?: number | null;
          ambition_contribution?: number | null;
          selfreliance_connection?: number | null;
          stability_growth?: number | null;
          academic_creative?: number | null;
          created_at?: string;
        };
      };
    };
  };
}