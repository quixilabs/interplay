// Super Admin Configuration
export const SUPER_ADMIN_CONFIG = {
  // Cryptic URL path - change this to something only you know
  ADMIN_PATH: '/sys-admin-portal-x9k2m',
  
  // Super admin credentials - in production, use environment variables
  CREDENTIALS: {
    username: import.meta.env.VITE_SUPER_ADMIN_USERNAME || 'superadmin',
    password: import.meta.env.VITE_SUPER_ADMIN_PASSWORD || 'SuperSecure2024!@#'
  },
  
  // Session timeout (in minutes)
  SESSION_TIMEOUT: 60,
  
  // Local storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'super_admin_auth_token',
    SESSION_EXPIRY: 'super_admin_session_expiry'
  }
};

export const UNIVERSITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
} as const;

export type UniversityStatus = typeof UNIVERSITY_STATUS[keyof typeof UNIVERSITY_STATUS];