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
      // Demo credentials
      const demoCredentials = [
        { email: 'admin@university.edu', password: 'demo123' },
        { email: 'admin@slu.edu', password: 'demo123' }
      ];

      const validCredential = demoCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (validCredential) {
        // Get university information from database
        const university = await UniversityService.getUniversityByAdminEmail(email);
        
        if (university) {
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