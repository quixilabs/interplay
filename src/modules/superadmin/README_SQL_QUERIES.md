# SQL Query Integration for SuperAdmin Module

## Overview

The SuperAdmin module now uses SQL-based queries to fetch complete student session data, ensuring all fields are properly retrieved and formatted for both display and CSV export.

## Data Fetching Methods

### 1. `getStudentSessionData(sessionId: string)`

Fetches complete data for a single student session using optimized SQL queries.

**SQL Query Structure (Conceptual):**
```sql
-- Get all data for a specific student session
SELECT 
  ss.session_id,
  ss.university_slug,
  ss.start_time,
  ss.completion_time,
  ss.is_completed,
  ss.email_for_results,
  
  -- Demographics (via LEFT JOIN)
  d.*,
  
  -- Flourishing Scores (via LEFT JOIN)
  f.*,
  
  -- School Wellbeing (via LEFT JOIN)
  sw.*,
  
  -- Tensions Assessment (via LEFT JOIN)
  ta.*,
  
  -- Text Responses (via LEFT JOIN)
  tr.*

FROM survey_sessions ss
LEFT JOIN demographics d ON ss.session_id = d.session_id
LEFT JOIN flourishing_scores f ON ss.session_id = f.session_id
LEFT JOIN school_wellbeing sw ON ss.session_id = sw.session_id
LEFT JOIN tensions_assessment ta ON ss.session_id = ta.session_id
LEFT JOIN text_responses tr ON ss.session_id = tr.session_id

WHERE ss.session_id = ?;
```

**Separate Queries for Related Data:**
```sql
-- Get user enablers/barriers
SELECT 
  domain_key,
  selected_enablers,
  selected_barriers,
  enabler_other_text,
  barrier_other_text,
  created_at
FROM user_enablers_barriers
WHERE session_id = ?
ORDER BY created_at;

-- Get growth modules (if available)
SELECT 
  domain_name,
  enabler_selections,
  barrier_selection,
  additional_comments,
  created_at
FROM growth_modules
WHERE session_id = ?
ORDER BY created_at;
```

### 2. `getUniversityResponses(universitySlug: string)`

Fetches all survey sessions for a university with all related data.

**Implementation:**
- Uses Supabase's query builder with nested selects
- Includes incomplete sessions for debugging
- Orders by completion_time (most recent first)
- Returns all related tables as nested objects/arrays

### 3. `formatSessionForExport(session: any)`

Formats session data into a flat structure suitable for CSV export.

**CSV Export Structure:**

| Column Name | Source | Type | Notes |
|------------|--------|------|-------|
| `session_id` | survey_sessions | string | Unique session identifier |
| `university_slug` | survey_sessions | string | University identifier |
| `start_time` | survey_sessions | timestamp | When survey started |
| `completion_time` | survey_sessions | timestamp | When survey completed |
| `is_completed` | survey_sessions | boolean | Completion status |
| `email_for_results` | survey_sessions | string | Student email (if provided) |
| **Demographics** |
| `year_in_school` | demographics | string | Student year |
| `enrollment_status` | demographics | string | Full-time/Part-time |
| `age_range` | demographics | string | Age bracket |
| `gender_identity` | demographics | string | Gender |
| `gender_self_describe` | demographics | string | Custom gender description |
| `race_ethnicity` | demographics | array | Joined with `;` |
| `is_international` | demographics | string | International student status |
| `employment_status` | demographics | string | Employment type |
| `has_caregiving_responsibilities` | demographics | string | Caregiving status |
| `in_greek_organization` | demographics | string | Greek life participation |
| `study_mode` | demographics | string | In-person/Online/Hybrid |
| `transfer_student` | demographics | string | Transfer status |
| **Flourishing Scores** (1-10 scale) |
| `happiness_satisfaction_1` | flourishing_scores | number | Question 1 |
| `happiness_satisfaction_2` | flourishing_scores | number | Question 2 |
| `mental_physical_health_1` | flourishing_scores | number | Question 1 |
| `mental_physical_health_2` | flourishing_scores | number | Question 2 |
| `meaning_purpose_1` | flourishing_scores | number | Question 1 |
| `meaning_purpose_2` | flourishing_scores | number | Question 2 |
| `character_virtue_1` | flourishing_scores | number | Question 1 |
| `character_virtue_2` | flourishing_scores | number | Question 2 |
| `social_relationships_1` | flourishing_scores | number | Question 1 |
| `social_relationships_2` | flourishing_scores | number | Question 2 |
| `financial_stability_1` | flourishing_scores | number | Question 1 |
| `financial_stability_2` | flourishing_scores | number | Question 2 |
| **School Wellbeing** (0-10 scale) |
| `belonging_score` | school_wellbeing | number | Sense of belonging |
| `enjoy_school_days` | school_wellbeing | number | School enjoyment |
| `physical_activity` | school_wellbeing | number | Physical activity level |
| `feel_safe` | school_wellbeing | number | Safety feeling |
| `work_connected_goals` | school_wellbeing | number | Goal connection |
| `contribute_bigger_purpose` | school_wellbeing | number | Purpose contribution |
| `kind_to_others` | school_wellbeing | number | Kindness level |
| `manage_emotions` | school_wellbeing | number | Emotional management |
| `trusted_adult` | school_wellbeing | number | Adult support |
| `supportive_friends` | school_wellbeing | number | Friend support |
| `resources_participation` | school_wellbeing | number | Resource availability |
| `wellbeing_checklist` | school_wellbeing | array | Joined with `;` |
| **Tensions Assessment** (0-100 percentage) |
| `performance_wellbeing` | tensions_assessment | number | Performance vs Wellbeing |
| `ambition_contribution` | tensions_assessment | number | Ambition vs Contribution |
| `selfreliance_connection` | tensions_assessment | number | Self-reliance vs Connection |
| `stability_growth` | tensions_assessment | number | Stability vs Growth |
| `academic_creative` | tensions_assessment | number | Academic vs Creative |
| **Text Responses** |
| `fastest_win_suggestion` | text_responses | string | Student's suggestion |
| **Enablers & Barriers** (Flattened) |
| `enablers_barriers` | user_enablers_barriers | string | Format: `domain: E[...] B[...]` |
| `growth_modules` | growth_modules | string | Format: `domain: enablers / barriers` |

## Usage Examples

### Display Individual Session Data

```typescript
import { SuperAdminUniversityService } from '../services/universityService';

// Get complete session data
const sessionData = await SuperAdminUniversityService.getStudentSessionData(sessionId);

// Access nested data
const demographics = sessionData.demographics;
const flourishingScores = sessionData.flourishing_scores;
const enablersBarriers = sessionData.user_enablers_barriers;
```

### Export Single Session

```typescript
// Format for export
const formattedData = SuperAdminUniversityService.formatSessionForExport(sessionData);

// Convert to CSV
const headers = Object.keys(formattedData);
const csvRow = headers.map(h => formattedData[h]).join(',');
```

### Export All University Sessions

```typescript
// Get all responses
const responses = await SuperAdminUniversityService.getUniversityResponses(universitySlug, true);

// Format all for export
const csvData = responses.map(response => 
  SuperAdminUniversityService.formatSessionForExport(response)
);

// Convert to CSV file
// (See UniversityResponses.tsx exportData() method for full implementation)
```

## Data Quality Features

### Missing Data Detection

The UI automatically detects and highlights sessions with missing data:
- Missing flourishing scores
- Missing school wellbeing data
- Missing tension assessments
- Missing enablers/barriers
- Missing text feedback

### At-Risk Student Detection

Sessions with any flourishing score < 6 are automatically flagged as "at-risk" with visual indicators:
- Red left border on table row
- Warning icon next to session ID
- Red banner when session is expanded
- Color-coded score displays

### Filtering & Sorting

Users can filter sessions by:
- Completion status (Complete/Incomplete)
- Missing data
- Date range
- Search term (session ID, demographics, feedback)

Sort by:
- Session ID
- Completion status
- Date completed

## Implementation Notes

1. **Supabase Integration**: The current implementation uses Supabase's query builder with nested selects, which provides similar functionality to SQL JOINs.

2. **Fallback Strategy**: If an RPC function is available in Supabase, it's used first. Otherwise, falls back to query builder approach.

3. **Array Handling**: Related data (demographics, scores, etc.) may be returned as single-item arrays from Supabase. The formatting function handles both array and object formats.

4. **CSV Escaping**: All CSV exports properly escape quotes and special characters to prevent data corruption.

5. **Performance**: For large datasets, consider implementing pagination or lazy loading in the future.

## Future Enhancements

- [ ] Create Supabase RPC function for optimized single-query data retrieval
- [ ] Add batch export with progress indicator for very large datasets
- [ ] Implement server-side CSV generation for better performance
- [ ] Add data validation and integrity checks
- [ ] Create scheduled export jobs for automated reporting

