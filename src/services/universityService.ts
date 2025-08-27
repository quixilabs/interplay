import { supabase } from '../lib/supabase';

export interface University {
  id: string;
  name: string;
  slug: string;
  admin_email: string;
  survey_active: boolean;
  created_at: string;
  updated_at: string;
}

export class UniversityService {
  // Get all universities
  static async getAllUniversities(): Promise<University[]> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  }

  // Get university by slug
  static async getUniversityBySlug(slug: string): Promise<University | null> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching university:', error);
      throw error;
    }
  }

  // Get university by admin email
  static async getUniversityByAdminEmail(email: string): Promise<University | null> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('admin_email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching university by email:', error);
      throw error;
    }
  }

  // Check if university survey is active
  static async isUniversitySurveyActive(slug: string): Promise<boolean> {
    try {
      const university = await this.getUniversityBySlug(slug);
      return university?.survey_active ?? false;
    } catch (error) {
      console.error('Error checking survey status:', error);
      return false;
    }
  }

  // Create new university
  static async createUniversity(university: Omit<University, 'id' | 'created_at' | 'updated_at'>): Promise<University> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .insert(university)
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
  static async updateUniversity(id: string, updates: Partial<University>): Promise<University> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .update({
          ...updates,
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

  // Delete university
  static async deleteUniversity(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting university:', error);
      throw error;
    }
  }

  // Get university response count
  static async getUniversityResponseCount(slug: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('survey_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('university_slug', slug)
        .eq('is_completed', true);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching response count:', error);
      return 0;
    }
  }
}
