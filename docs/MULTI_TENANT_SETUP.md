# Multi-Tenant Setup Guide for Interplay

Your Interplay app is now configured for multi-tenancy, allowing multiple universities to have their own isolated data and dashboards.

## Current Configuration

### Universities in Database
1. **Demo University**
   - Slug: `demo-university`
   - Admin Email: `admin@university.edu`
   - Survey URL: `/survey/demo-university`

2. **Saint Louis University**
   - Slug: `saint-louis-university`
   - Admin Email: `admin@slu.edu`
   - Survey URL: `/survey/saint-louis-university`

## How Multi-Tenancy Works

### Survey Collection
- Each university has a unique slug (URL identifier)
- Survey URL format: `/survey/{university-slug}`
- All survey responses are tagged with the `university_slug`
- University validation ensures only active surveys are accessible

### Dashboard Access
- Admin login credentials are tied to specific universities
- Dashboard data is automatically filtered by the authenticated user's university
- Each admin only sees data for their institution

### Data Isolation
- Survey responses are filtered by `university_slug` in all analytics queries
- No cross-university data contamination
- Each university's dashboard shows only their students' responses

## Adding a New University

### 1. Add University to Database
```sql
INSERT INTO universities (name, slug, admin_email, survey_active) 
VALUES ('University Name', 'university-slug', 'admin@university.edu', true);
```

### 2. Add Admin Credentials (Optional for Demo)
Update `src/stores/authStore.ts` to include new demo credentials:
```typescript
const demoCredentials = [
  { email: 'admin@university.edu', password: 'demo123' },
  { email: 'admin@slu.edu', password: 'demo123' },
  { email: 'admin@newuniversity.edu', password: 'demo123' } // Add new credential
];
```

### 3. Update Landing Page (Optional)
Add new university button to `src/components/LandingPage.tsx`:
```tsx
<Link 
  to="/survey/new-university-slug" 
  className="btn-primary px-8 py-4 rounded-brand flex items-center justify-center"
>
  New University Survey
  <ArrowRight className="ml-2 h-5 w-5" />
</Link>
```

## Features Implemented

### ✅ University Validation
- Validates university exists before allowing survey access
- Checks if survey is active for the university
- Provides helpful error messages for invalid URLs

### ✅ Dynamic Dashboard Filtering
- Analytics service filters data by university slug
- Dashboard automatically shows university-specific data
- No manual filtering required

### ✅ Multi-University Authentication
- Admin login supports multiple universities
- User context includes university information
- Automatic university detection from admin email

### ✅ Survey URL Routing
- Clean URLs: `/survey/{university-slug}`
- University-specific survey collection
- Automatic university tagging in database

## Development Testing

### Test University Isolation
1. **Login as Demo University Admin:**
   - Email: `admin@university.edu`
   - Password: `demo123`
   - Verify dashboard shows Demo University data

2. **Login as SLU Admin:**
   - Email: `admin@slu.edu`
   - Password: `demo123`
   - Verify dashboard shows Saint Louis University data

3. **Test Survey URLs:**
   - Demo: `http://localhost:5173/survey/demo-university`
   - SLU: `http://localhost:5173/survey/saint-louis-university`
   - Invalid: `http://localhost:5173/survey/nonexistent` (should show error)

### Sample Data
- Demo University: Has existing survey responses
- Saint Louis University: Has 3 sample responses for testing
- Each university's data is completely isolated

## Production Considerations

### Security
- Replace demo credentials with proper authentication
- Implement role-based access control
- Add API rate limiting per university

### Scalability
- Consider database indexing on `university_slug`
- Implement caching for university lookups
- Add database connection pooling

### Monitoring
- Track survey completion rates per university
- Monitor response volume by institution
- Alert on survey errors or university access issues

## Conference Demo Setup

For your St. Louis University conference demo:

1. **Primary Survey URL:** `http://localhost:5173/survey/saint-louis-university`
2. **Admin Dashboard:** Login with `admin@slu.edu` / `demo123`
3. **Landing Page:** Features prominent SLU survey button
4. **Data Isolation:** SLU dashboard shows only SLU student responses

The app is ready for your conference presentation with full multi-tenant support!
