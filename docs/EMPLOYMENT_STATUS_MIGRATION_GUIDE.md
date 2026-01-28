# Employment Status Migration Guide

## Overview
This guide walks you through migrating existing employment status data from `"Full-time"` to `"Full-time (40+ hours/week)"` to ensure clarity in survey responses and consistent data analytics.

## Why This Migration?
- **Survey Clarity**: Students will clearly understand that "full-time employment" means 40+ hours per week
- **Data Consistency**: All existing and future responses will use the same value format
- **Analytics Accuracy**: Dashboard filters and demographic breakdowns will work correctly with all data

## Files Included

### 1. Main Migration Script
**File**: `supabase/migrations/20251218000000_update_employment_status_full_time.sql`
- Updates all existing `employment_status = 'Full-time'` to `'Full-time (40+ hours/week)'`
- Includes before/after verification
- Displays helpful notices during execution

### 2. Rollback Script (Safety Net)
**File**: `supabase/migrations/ROLLBACK_20251218000000_update_employment_status_full_time.sql`
- **Use only if you need to revert the migration**
- Restores original `'Full-time'` values

### 3. Verification Script
**File**: `verify-employment-status-migration.sql`
- Run this **before** and **after** the migration to check status
- Shows distribution of employment status values
- Confirms migration success

## Migration Steps

### Step 1: Pre-Migration Verification (Recommended)
Run the verification script to see current data state:

```sql
-- Run in your Supabase SQL Editor
\i verify-employment-status-migration.sql
```

Or copy/paste the contents of `verify-employment-status-migration.sql` into the Supabase SQL Editor.

**What to look for:**
- Count of records with `'Full-time'` value
- This tells you how many records will be updated

### Step 2: Run the Migration

#### Option A: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/20251218000000_update_employment_status_full_time.sql`
5. Paste into the editor
6. Click **Run**
7. Check the output for confirmation messages

#### Option B: Via Supabase CLI (If using local development)
```bash
# Apply the migration
supabase db push

# Or apply specific migration
psql $DATABASE_URL -f supabase/migrations/20251218000000_update_employment_status_full_time.sql
```

### Step 3: Post-Migration Verification
Run the verification script again:

```sql
\i verify-employment-status-migration.sql
```

**Expected results:**
- ✅ "No records found with old 'Full-time' value"
- ✅ "Found X records with new 'Full-time (40+ hours/week)' value"

### Step 4: Test the Application
1. Check the dashboard to ensure demographic breakdowns display correctly
2. Test filtering by employment status
3. Verify at-risk groups are calculated properly

## Expected Output

When you run the main migration script, you should see output like:

```
NOTICE: Found 42 records with employment_status = 'Full-time' to be updated
UPDATE 42
NOTICE: After migration:
NOTICE:   - Records with 'Full-time': 0
NOTICE:   - Records with 'Full-time (40+ hours/week)': 122
NOTICE: Migration completed successfully!
```

## Rollback Instructions (If Needed)

If you need to revert the migration:

1. Run the rollback script:
```sql
\i supabase/migrations/ROLLBACK_20251218000000_update_employment_status_full_time.sql
```

2. **Important**: You'll also need to revert the code changes in your application:
   - `src/components/Survey/sections/DemographicsSection.tsx`
   - `src/types/filters.ts`
   - `src/services/analyticsService.ts`
   - `src/data/mockData.ts`

## Troubleshooting

### Issue: Migration shows 0 records updated
**Possible causes:**
- No existing data with `'Full-time'` employment status
- Migration already ran previously
- Different column name or table structure

**Solution:** Run the verification script to check current data state

### Issue: Some records still show old value after migration
**Possible causes:**
- Database transaction not committed
- RLS (Row Level Security) policies preventing updates

**Solution:** 
- Check Supabase logs for errors
- Ensure you have proper permissions
- Try running the migration again

### Issue: Dashboard shows both "Full-time" and "Full-time (40+ hours/week)"
**Cause:** Migration hasn't been run yet or partially completed

**Solution:** Run the verification script to confirm migration status

## Impact Assessment

### Zero Impact:
- Database schema (no schema changes)
- Other demographic fields
- Flourishing scores
- School wellbeing data

### Affected Areas:
- ✅ Demographics table: `employment_status` column values updated
- ✅ Dashboard: Employment status filters and breakdowns
- ✅ Analytics: At-risk group calculations
- ✅ Reports: Demographic analysis

## Support

If you encounter issues:
1. Check the verification script output
2. Review Supabase logs in the dashboard
3. Ensure Row Level Security policies allow updates
4. Contact your database administrator if needed

## Notes
- This is a **data-only migration** (no schema changes)
- **Backup recommended** before running in production
- Migration is **idempotent** (safe to run multiple times)
- Estimated execution time: < 1 second for most datasets

