import { supabase } from '../lib/supabase';
import { debugLog, debugWarn } from '../utils/debug';

// Debug helper function to test database connection
const testDatabaseConnection = async () => {
  try {
    debugLog('🔍 [DEBUG] Testing database connection...');
    const { data, error } = await supabase.from('universities').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ [DEBUG] Database connection failed:', error);
      return false;
    }
    
    debugLog('✅ [DEBUG] Database connection successful. University table exists with', data?.length || 0, 'records');
    return true;
  } catch (error) {
    console.error('❌ [DEBUG] Database connection test failed:', error);
    return false;
  }
};

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
      debugLog('🔍 [DEBUG] Starting getUniversityBySlug...');
      debugLog('📥 [DEBUG] Input slug:', JSON.stringify(slug));
      debugLog('📏 [DEBUG] Slug length:', slug?.length);
      debugLog('🔤 [DEBUG] Slug type:', typeof slug);
      
      // Test database connection first
      await testDatabaseConnection();
      
      // Log the exact query being executed
      debugLog('🔍 [DEBUG] Executing query: SELECT * FROM universities WHERE slug = $1');
      debugLog('📋 [DEBUG] Query parameters:', { slug });
      
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('slug', slug)
        .single();

      debugLog('📊 [DEBUG] Raw database response:');
      debugLog('  - data:', JSON.stringify(data, null, 2));
      debugLog('  - error:', error);

      if (error) {
        debugLog('❌ [DEBUG] Database error details:');
        debugLog('  - error.code:', error.code);
        debugLog('  - error.message:', error.message);
        debugLog('  - error.details:', error.details);
        debugLog('  - error.hint:', error.hint);
        
        if (error.code === 'PGRST116') {
          debugLog('🔍 [DEBUG] University not found (PGRST116 - no rows returned)');
          
          // Let's also check what universities actually exist
          debugLog('🔍 [DEBUG] Checking all existing universities...');
          const { data: allUniversities, error: listError } = await supabase
            .from('universities')
            .select('slug, name');
          
          if (listError) {
            console.error('❌ [DEBUG] Failed to list universities:', listError);
          } else {
            debugLog('📋 [DEBUG] Existing universities:', JSON.stringify(allUniversities, null, 2));
            
            // Check for similar slugs
            const similarSlugs = allUniversities?.filter(u => 
              u.slug.toLowerCase().includes(slug.toLowerCase()) || 
              slug.toLowerCase().includes(u.slug.toLowerCase())
            );
            
            if (similarSlugs && similarSlugs.length > 0) {
              debugLog('🔍 [DEBUG] Found similar slugs:', JSON.stringify(similarSlugs, null, 2));
            } else {
              debugLog('🔍 [DEBUG] No similar slugs found');
            }
          }
          
          return null;
        }
        throw error;
      }
      
      debugLog('✅ [DEBUG] University found successfully:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('❌ [DEBUG] Unexpected error in getUniversityBySlug:', error);
      console.error('❌ [DEBUG] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
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
