# V2 Support Barriers - Statement to Database Column Mapping

## Overview
This document maps the frontend statement IDs (statement_1 through statement_15) to the driver-prefixed database column names used in the `school_wellbeing` table.

## Complete Mapping

| Statement ID | Driver | Database Column Name | Statement Text |
|-------------|--------|---------------------|----------------|
| statement_1 | **CARE** | `care_not_understood_supported` | I don't feel understood or supported when I'm struggling. |
| statement_2 | **ACCESS** | `access_hard_find_resources` | It's hard to find information about campus resources. |
| statement_3 | **GUIDANCE** | `guidance_unsure_direction` | I'm unsure about my academic or career direction. |
| statement_4 | **TRUST** | `trust_messages_not_answered` | My messages or emails aren't answered in a timely way. |
| statement_5 | **CONNECTION** | `connection_no_mentor` | I don't have a mentor or someone I can turn to. |
| statement_6 | **CARE** | `care_no_empathy_from_staff` | Staff or faculty don't show empathy when I raise a concern. |
| statement_7 | **GUIDANCE** | `guidance_want_help_planning` | I want more help planning my next steps. |
| statement_8 | **CONNECTION** | `connection_hard_make_friends` | It's hard for me to make friends here. |
| statement_9 | **GUIDANCE** | `guidance_confused_courses` | I'm confused about which courses I need to take. |
| statement_10 | **TRUST** | `trust_unclear_communication` | Communication from the school feels unclear or inconsistent. |
| statement_11 | **CONNECTION** | `connection_not_connected_students` | I don't feel connected to other students. |
| statement_12 | **TRUST** | `trust_bounced_between_offices` | I'm often bounced between offices when trying to get help. |
| statement_13 | **CARE** | `care_school_doesnt_care` | I don't feel like the school cares about students like me. |
| statement_14 | **ACCESS** | `access_dont_know_where_help` | I don't know where to go when I need help. |
| statement_15 | **ACCESS** | `access_long_appointment_wait` | It takes too long to get an appointment when I need support. |

## Grouped by Driver

### CARE (3 statements)
- `care_not_understood_supported` ← statement_1
- `care_no_empathy_from_staff` ← statement_6
- `care_school_doesnt_care` ← statement_13

### ACCESS (3 statements)
- `access_hard_find_resources` ← statement_2
- `access_dont_know_where_help` ← statement_14
- `access_long_appointment_wait` ← statement_15

### GUIDANCE (3 statements)
- `guidance_unsure_direction` ← statement_3
- `guidance_want_help_planning` ← statement_7
- `guidance_confused_courses` ← statement_9

### TRUST (3 statements)
- `trust_messages_not_answered` ← statement_4
- `trust_unclear_communication` ← statement_10
- `trust_bounced_between_offices` ← statement_12

### CONNECTION (3 statements)
- `connection_no_mentor` ← statement_5
- `connection_hard_make_friends` ← statement_8
- `connection_not_connected_students` ← statement_11

## Example SQL Queries

### Count barriers by driver
```sql
SELECT 
  session_id,
  -- Count CARE barriers
  (care_not_understood_supported::int + 
   care_no_empathy_from_staff::int + 
   care_school_doesnt_care::int) as care_barriers,
  -- Count ACCESS barriers
  (access_hard_find_resources::int + 
   access_dont_know_where_help::int + 
   access_long_appointment_wait::int) as access_barriers,
  -- Count GUIDANCE barriers
  (guidance_unsure_direction::int + 
   guidance_want_help_planning::int + 
   guidance_confused_courses::int) as guidance_barriers,
  -- Count TRUST barriers
  (trust_messages_not_answered::int + 
   trust_unclear_communication::int + 
   trust_bounced_between_offices::int) as trust_barriers,
  -- Count CONNECTION barriers
  (connection_no_mentor::int + 
   connection_hard_make_friends::int + 
   connection_not_connected_students::int) as connection_barriers
FROM school_wellbeing
WHERE assessment_version = 'v2';
```

### Find sessions with high ACCESS barriers
```sql
SELECT 
  session_id,
  access_hard_find_resources,
  access_dont_know_where_help,
  access_long_appointment_wait
FROM school_wellbeing
WHERE assessment_version = 'v2'
  AND (access_hard_find_resources OR 
       access_dont_know_where_help OR 
       access_long_appointment_wait);
```

### Calculate driver scores (10 - barriers × 2.5)
```sql
SELECT 
  session_id,
  10 - ((care_not_understood_supported::int + 
         care_no_empathy_from_staff::int + 
         care_school_doesnt_care::int) * 2.5) as care_score,
  10 - ((access_hard_find_resources::int + 
         access_dont_know_where_help::int + 
         access_long_appointment_wait::int) * 2.5) as access_score,
  10 - ((guidance_unsure_direction::int + 
         guidance_want_help_planning::int + 
         guidance_confused_courses::int) * 2.5) as guidance_score,
  10 - ((trust_messages_not_answered::int + 
         trust_unclear_communication::int + 
         trust_bounced_between_offices::int) * 2.5) as trust_score,
  10 - ((connection_no_mentor::int + 
         connection_hard_make_friends::int + 
         connection_not_connected_students::int) * 2.5) as connection_score
FROM school_wellbeing
WHERE assessment_version = 'v2';
```

## Code Implementation

The mapping is handled in `src/services/surveyService.ts`:

```typescript
if (wellbeing.assessment_version === 'v2') {
  // CARE DRIVER
  wellbeingData.care_not_understood_supported = wellbeing.statement_1 || false;
  wellbeingData.care_no_empathy_from_staff = wellbeing.statement_6 || false;
  wellbeingData.care_school_doesnt_care = wellbeing.statement_13 || false;
  
  // ACCESS DRIVER
  wellbeingData.access_hard_find_resources = wellbeing.statement_2 || false;
  wellbeingData.access_dont_know_where_help = wellbeing.statement_14 || false;
  wellbeingData.access_long_appointment_wait = wellbeing.statement_15 || false;
  
  // ... and so on
}
```

