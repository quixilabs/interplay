// Super Admin Module Entry Point
export { default as SuperAdminRouter } from './components/SuperAdminRouter';
export { default as UniversityResponses } from './components/UniversityResponses';
export { SUPER_ADMIN_CONFIG } from './config/constants';
export { superAdminAuth } from './services/superAdminAuth';
export { SuperAdminUniversityService } from './services/universityService';
export * from './types';

// Module metadata for extraction
export const SUPER_ADMIN_MODULE = {
  name: 'Super Admin Module',
  version: '1.0.0',
  description: 'Multi-tenant university management system',
  dependencies: [
    '@supabase/supabase-js',
    'react',
    'react-router-dom',
    'lucide-react'
  ],
  extractable: true,
  crypticUrl: '/sys-admin-portal-x9k2m'
};