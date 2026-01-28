# Mock Data Toggle Configuration

## Overview
The demo dashboard can be configured to use either mock data or real database data through an environment variable. This is useful during development when you want to test with real survey responses.

## Quick Setup

### Step 1: Create Environment File

Create a file named `.env.local` in the project root with the following content:

```bash
# Mock Data Configuration
# Set to 'false' to use real database data for demo-university
# Set to 'true' to use mock data (default)
VITE_USE_MOCK_DATA=false
```

**Note**: `.env.local` is already in `.gitignore`, so it won't be committed to version control.

### Step 2: Restart Dev Server

After creating or modifying `.env.local`, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

Environment variables are only loaded when Vite starts, so you must restart the server for changes to take effect.

## Configuration Options

### Use Real Database Data (Development/Testing)
```bash
VITE_USE_MOCK_DATA=false
```
- Dashboard will query actual database for demo-university
- Requires survey responses in the database
- Shows real Growth Index Score if v2 data exists
- Useful for testing with actual data

### Use Mock Data (Demo/Production)
```bash
VITE_USE_MOCK_DATA=true
```
or simply omit the variable (defaults to true)
- Dashboard uses pre-generated mock data
- Consistent demo experience
- Fast performance (no database queries)
- No dependency on real survey responses

## What Data Sources Are Used?

### With Mock Data (Default)
- **Source**: `src/data/mockData.ts`
- **Contains**: 
  - 1043 mock survey responses
  - Complete flourishing scores
  - Demographics breakdowns
  - Enablers and barriers
  - Tension analysis
- **Growth Index Score**: Shows "No data available" (mock data only has v1 format)

### With Real Database Data
- **Source**: Supabase database queries
- **Queries**:
  - `survey_sessions`
  - `flourishing_scores`
  - `school_wellbeing` (includes v2 support barriers)
  - `demographics`
  - `user_enablers_barriers`
  - `tensions_assessment`
- **Growth Index Score**: Calculated from actual v2 school wellbeing responses

## Requirements for Real Data

To see real data on the dashboard, you need:

1. ✅ Survey sessions completed for demo-university
2. ✅ At least one completed survey with all sections:
   - Demographics
   - Flourishing scores
   - School wellbeing (v2 format for Growth Index Score)
   - Enablers & barriers
   - Tensions assessment

If any data is missing, you'll see:
- "No data available" messages
- Empty charts
- 0 values for metrics

This is expected behavior and indicates you need more survey responses.

## Testing the Toggle

### Test with Mock Data
1. Set `VITE_USE_MOCK_DATA=true`
2. Restart dev server
3. Login to demo dashboard
4. Should see 1043 responses with complete data

### Test with Real Data
1. Set `VITE_USE_MOCK_DATA=false`
2. Restart dev server
3. Login to demo dashboard
4. Should see actual database data (may be empty if no surveys completed)

## Troubleshooting

### Changes Not Taking Effect
- **Solution**: Restart the dev server - environment variables are only loaded at startup

### Still Seeing Mock Data When Set to False
- Check the `.env.local` file location (should be in project root)
- Verify the exact spelling: `VITE_USE_MOCK_DATA=false` (no quotes, lowercase false)
- Make sure you restarted the dev server

### Dashboard Shows "No Data Available"
- This means you're successfully using real database data, but:
  - No surveys have been completed for demo-university, OR
  - The specific data type (like v2 school wellbeing) hasn't been collected yet
- Complete a survey through `/survey/demo-university` to add data

## Implementation Details

The toggle is implemented in `src/services/analyticsService.ts`:

```typescript
static async getSurveyAnalytics(universitySlug?: string) {
  try {
    // Return mock data for demo university (can be toggled with env var)
    // Set VITE_USE_MOCK_DATA=false in .env.local to use real database data
    const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
    
    if (universitySlug === 'demo-university' && useMockData) {
      const { mockSurveyData } = await import('../data/mockData');
      return mockSurveyData;
    }
    
    // ... continues with real database queries
  }
}
```

## Best Practices

### For Development
- Use `VITE_USE_MOCK_DATA=false` when:
  - Testing new features with real data
  - Verifying database queries work correctly
  - Testing Growth Index Score with v2 data
  - Debugging data-related issues

### For Demos/Production
- Use `VITE_USE_MOCK_DATA=true` when:
  - Showing the dashboard to stakeholders
  - Need consistent, complete demo data
  - Don't have real survey responses yet
  - Want fast, reliable demo performance

## See Also
- [Growth Index Implementation](./GROWTH_INDEX_IMPLEMENTATION.md)
- [School Wellbeing V2 Implementation](./SCHOOL_WELLBEING_V2_IMPLEMENTATION.md)
- [Local Development Guide](./LOCAL_DEVELOPMENT.md)

