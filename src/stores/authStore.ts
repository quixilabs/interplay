import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  adminUser: {
    id: string;
    email: string;
    universityName: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  adminUser: null,
  
  login: async (email: string, password: string) => {
    // Mock authentication - in production this would call your auth API
    if (email === 'admin@university.edu' && password === 'demo123') {
      set({
        isAuthenticated: true,
        adminUser: {
          id: '1',
          email: 'admin@university.edu',
          universityName: 'Demo University'
        }
      });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      adminUser: null
    });
  }
}));