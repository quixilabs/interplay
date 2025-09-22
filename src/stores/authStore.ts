import { create } from 'zustand';
import { UniversityService } from '../services/universityService';

interface AuthState {
  isAuthenticated: boolean;
  adminUser: {
    id: string;
    email: string;
    universityName: string;
    universitySlug: string;
    universityId: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  adminUser: null,
  
  login: async (email: string, password: string) => {
    try {
      // Demo password for all university admins (change in production)
      const DEMO_PASSWORD = 'demo123';
      
      if (password !== DEMO_PASSWORD) {
        return false;
      }

      // Try to get university information from database by admin email
      try {
        const university = await UniversityService.getUniversityByAdminEmail(email);
        
        if (university && university.is_active) {
          set({
            isAuthenticated: true,
            adminUser: {
              id: university.id,
              email: email,
              universityName: university.name,
              universitySlug: university.slug,
              universityId: university.id
            }
          });
          return true;
        }
      } catch (dbError) {
        console.error('Database error during login:', dbError);
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      adminUser: null
    });
  }
}));