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
        // For demo login, create mock university data
        if (email === 'admin@university.edu') {
          set({
            isAuthenticated: true,
            adminUser: {
              id: 'demo-university',
              email: email,
              universityName: 'Demo University',
              universitySlug: 'demo-university',
              universityId: 'demo-university'
            }
          });
          return true;
        } else {
          // Try to get university information from database for other emails
          try {
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
          } catch (dbError) {
            console.error('Database error, using fallback:', dbError);
            // Fallback for SLU demo
            set({
              isAuthenticated: true,
              adminUser: {
                id: 'saint-louis-university',
                email: email,
                universityName: 'Saint Louis University',
                universitySlug: 'saint-louis-university',
                universityId: 'saint-louis-university'
              }
            });
            return true;
          }
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