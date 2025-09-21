import { SUPER_ADMIN_CONFIG } from '../config/constants';
import { SuperAdminUser } from '../types';

class SuperAdminAuthService {
  private static instance: SuperAdminAuthService;
  
  private constructor() {}
  
  static getInstance(): SuperAdminAuthService {
    if (!SuperAdminAuthService.instance) {
      SuperAdminAuthService.instance = new SuperAdminAuthService();
    }
    return SuperAdminAuthService.instance;
  }

  // Generate a simple JWT-like token for demo purposes
  private generateToken(username: string): string {
    const payload = {
      username,
      timestamp: Date.now(),
      expiry: Date.now() + (SUPER_ADMIN_CONFIG.SESSION_TIMEOUT * 60 * 1000)
    };
    
    // In production, use proper JWT signing
    return btoa(JSON.stringify(payload));
  }

  // Verify token validity
  private verifyToken(token: string): { valid: boolean; payload?: any } {
    try {
      const payload = JSON.parse(atob(token));
      const now = Date.now();
      
      if (now > payload.expiry) {
        return { valid: false };
      }
      
      return { valid: true, payload };
    } catch {
      return { valid: false };
    }
  }

  // Authenticate super admin
  async authenticate(username: string, password: string): Promise<SuperAdminUser | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (username === SUPER_ADMIN_CONFIG.CREDENTIALS.username && 
        password === SUPER_ADMIN_CONFIG.CREDENTIALS.password) {
      
      const token = this.generateToken(username);
      const sessionExpiry = Date.now() + (SUPER_ADMIN_CONFIG.SESSION_TIMEOUT * 60 * 1000);
      
      // Store in localStorage
      localStorage.setItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.SESSION_EXPIRY, sessionExpiry.toString());
      
      return {
        id: 'super-admin-001',
        username,
        isAuthenticated: true,
        sessionExpiry
      };
    }
    
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    const expiry = localStorage.getItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.SESSION_EXPIRY);
    
    if (!token || !expiry) {
      return false;
    }
    
    const now = Date.now();
    const sessionExpiry = parseInt(expiry);
    
    if (now > sessionExpiry) {
      this.logout();
      return false;
    }
    
    const { valid } = this.verifyToken(token);
    if (!valid) {
      this.logout();
      return false;
    }
    
    return true;
  }

  // Get current user
  getCurrentUser(): SuperAdminUser | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    const token = localStorage.getItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    const expiry = localStorage.getItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.SESSION_EXPIRY);
    
    if (!token || !expiry) {
      return null;
    }
    
    const { payload } = this.verifyToken(token);
    
    return {
      id: 'super-admin-001',
      username: payload.username,
      isAuthenticated: true,
      sessionExpiry: parseInt(expiry)
    };
  }

  // Logout
  logout(): void {
    localStorage.removeItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.SESSION_EXPIRY);
  }

  // Extend session
  extendSession(): void {
    if (this.isAuthenticated()) {
      const user = this.getCurrentUser();
      if (user) {
        const newToken = this.generateToken(user.username);
        const newExpiry = Date.now() + (SUPER_ADMIN_CONFIG.SESSION_TIMEOUT * 60 * 1000);
        
        localStorage.setItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.AUTH_TOKEN, newToken);
        localStorage.setItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.SESSION_EXPIRY, newExpiry.toString());
      }
    }
  }
}

export const superAdminAuth = SuperAdminAuthService.getInstance();