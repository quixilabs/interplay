# Super Admin Module

A comprehensive, extractable module for managing universities in a multi-tenant application.

## Features

- **Secure Authentication**: Cryptic URL with session-based authentication
- **University Management**: Full CRUD operations for universities
- **Dashboard Analytics**: System-wide statistics and monitoring
- **Extractable Design**: Can be moved to a separate project as the app grows
- **Production Ready**: Includes proper error handling, validation, and security

## Security Features

- Cryptic URL path (`/sys-admin-portal-x9k2m`) - change this in production
- Session timeout (60 minutes by default)
- Secure credential validation
- Activity-based session extension
- Protected routes and components

## Configuration

### Environment Variables

Add these to your `.env` file for production:

```env
VITE_SUPER_ADMIN_USERNAME=your_secure_username
VITE_SUPER_ADMIN_PASSWORD=your_secure_password_2024!
```

### Cryptic URL

Change the cryptic URL in `src/modules/superadmin/config/constants.ts`:

```typescript
export const SUPER_ADMIN_CONFIG = {
  ADMIN_PATH: '/your-secret-path-here',
  // ... other config
};
```

## Usage

### Integration with Main App

Add the Super Admin route to your main App.tsx:

```typescript
import { SuperAdminRouter, SUPER_ADMIN_CONFIG } from './modules/superadmin';

// In your Routes component:
<Route 
  path={`${SUPER_ADMIN_CONFIG.ADMIN_PATH}/*`} 
  element={<SuperAdminRouter />} 
/>
```

### Default Credentials (Development)

- **Username**: `superadmin`
- **Password**: `SuperSecure2024!@#`

**⚠️ IMPORTANT**: Change these credentials in production!

## Database Requirements

The module uses the existing `universities` table with these additional optional fields:

- `branding_config` (JSONB) - Store branding customizations
- `survey_config` (JSONB) - Store survey-specific settings
- `is_active` (BOOLEAN) - For soft delete functionality

## File Structure

```
src/modules/superadmin/
├── components/
│   ├── SuperAdminLogin.tsx      # Authentication component
│   ├── SuperAdminDashboard.tsx  # Main dashboard
│   ├── UniversityList.tsx       # University management
│   ├── UniversityForm.tsx       # Create/edit universities
│   └── SuperAdminRouter.tsx     # Route management
├── services/
│   ├── superAdminAuth.ts        # Authentication service
│   └── universityService.ts     # University CRUD operations
├── config/
│   └── constants.ts             # Configuration constants
├── types/
│   └── index.ts                 # TypeScript definitions
├── index.ts                     # Module entry point
└── README.md                    # This file
```

## Extracting to Separate Project

When ready to extract to a separate project:

1. **Copy the entire `superadmin` folder**
2. **Install dependencies**:
   ```bash
   npm install @supabase/supabase-js react react-router-dom lucide-react
   ```
3. **Update imports** to match your new project structure
4. **Configure Supabase connection** in the new project
5. **Update the cryptic URL** and credentials
6. **Set up proper authentication** (replace demo auth with real system)

## Production Considerations

### Security Enhancements

1. **Replace demo authentication** with proper JWT/OAuth
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** on login attempts
4. **Add audit logging** for all admin actions
5. **Use HTTPS only** in production
6. **Implement IP whitelisting** if needed

### Database Enhancements

1. **Add audit trail table** for tracking changes
2. **Implement soft deletes** properly
3. **Add database indexes** for performance
4. **Set up database backups**

### Monitoring

1. **Add error tracking** (Sentry, etc.)
2. **Implement health checks**
3. **Set up alerts** for critical actions
4. **Monitor session activity**

## API Endpoints

The module uses these Supabase table operations:

- `universities` - Full CRUD operations
- `survey_sessions` - Read-only for statistics
- Row Level Security policies should allow super admin access

## Customization

### Adding New Features

1. **Create new components** in the `components/` folder
2. **Add routes** to `SuperAdminRouter.tsx`
3. **Extend services** as needed
4. **Update types** in `types/index.ts`

### Styling

The module uses Tailwind CSS with a dark theme for the admin interface. Customize colors and styling by modifying the component classes.

## Support

This module is designed to be self-contained and extractable. For issues or enhancements, refer to the main application documentation or create a separate issue tracker for the extracted module.