export interface SuperAdminUser {
  id: string;
  username: string;
  isAuthenticated: boolean;
  sessionExpiry: number;
}

export interface UniversityData {
  id?: string;
  name: string;
  slug: string;
  admin_email: string;
  survey_active: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  branding_config?: Record<string, any>;
  survey_config?: Record<string, any>;
}

export interface UniversityFormData {
  name: string;
  slug: string;
  admin_email: string;
  survey_active: boolean;
  is_active: boolean;
  branding_config: {
    primary_color: string;
    logo_url: string;
    custom_domain: string;
  };
  survey_config: {
    max_responses: number;
    allow_anonymous: boolean;
    require_email: boolean;
  };
}

export interface UniversityStats {
  total_responses: number;
  completed_responses: number;
  completion_rate: number;
  last_response_date: string | null;
  active_sessions: number;
}

export interface SuperAdminDashboardData {
  total_universities: number;
  active_universities: number;
  total_responses: number;
  universities_by_status: Record<string, number>;
  recent_activity: Array<{
    id: string;
    type: 'university_created' | 'university_updated' | 'survey_completed';
    university_name: string;
    timestamp: string;
    details: string;
  }>;
}