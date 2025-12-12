-- Migration: Add V2 Support Barriers Assessment to school_wellbeing table
-- This adds checkbox-based barrier assessment while preserving V1 rating scale data
-- Column names include driver category prefix for better organization and querying

-- Add version tracking column
ALTER TABLE school_wellbeing 
ADD COLUMN IF NOT EXISTS assessment_version VARCHAR(10) DEFAULT 'v1';

-- CARE DRIVER (3 barriers)
-- Barriers related to feeling understood, empathy, and institutional caring
ALTER TABLE school_wellbeing
ADD COLUMN IF NOT EXISTS care_not_understood_supported BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS care_no_empathy_from_staff BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS care_school_doesnt_care BOOLEAN DEFAULT FALSE;

-- ACCESS DRIVER (3 barriers)
-- Barriers related to finding resources and getting help
ALTER TABLE school_wellbeing
ADD COLUMN IF NOT EXISTS access_hard_find_resources BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS access_dont_know_where_help BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS access_long_appointment_wait BOOLEAN DEFAULT FALSE;

-- GUIDANCE DRIVER (3 barriers)
-- Barriers related to academic/career direction and planning
ALTER TABLE school_wellbeing
ADD COLUMN IF NOT EXISTS guidance_unsure_direction BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS guidance_want_help_planning BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS guidance_confused_courses BOOLEAN DEFAULT FALSE;

-- TRUST DRIVER (3 barriers)
-- Barriers related to reliability and consistency of support
ALTER TABLE school_wellbeing
ADD COLUMN IF NOT EXISTS trust_messages_not_answered BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS trust_unclear_communication BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS trust_bounced_between_offices BOOLEAN DEFAULT FALSE;

-- CONNECTION DRIVER (3 barriers)
-- Barriers related to social relationships and sense of belonging
ALTER TABLE school_wellbeing
ADD COLUMN IF NOT EXISTS connection_no_mentor BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS connection_hard_make_friends BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS connection_not_connected_students BOOLEAN DEFAULT FALSE;

-- Add detailed comments documenting the schema
COMMENT ON COLUMN school_wellbeing.assessment_version IS 
  'Version of assessment: v1 (rating scale 0-10) or v2 (checkbox barriers)';

COMMENT ON COLUMN school_wellbeing.care_not_understood_supported IS 
  'V2 Barrier: I don''t feel understood or supported when I''m struggling.';
COMMENT ON COLUMN school_wellbeing.care_no_empathy_from_staff IS 
  'V2 Barrier: Staff or faculty don''t show empathy when I raise a concern.';
COMMENT ON COLUMN school_wellbeing.care_school_doesnt_care IS 
  'V2 Barrier: I don''t feel like the school cares about students like me.';

COMMENT ON COLUMN school_wellbeing.access_hard_find_resources IS 
  'V2 Barrier: It''s hard to find information about campus resources.';
COMMENT ON COLUMN school_wellbeing.access_dont_know_where_help IS 
  'V2 Barrier: I don''t know where to go when I need help.';
COMMENT ON COLUMN school_wellbeing.access_long_appointment_wait IS 
  'V2 Barrier: It takes too long to get an appointment when I need support.';

COMMENT ON COLUMN school_wellbeing.guidance_unsure_direction IS 
  'V2 Barrier: I''m unsure about my academic or career direction.';
COMMENT ON COLUMN school_wellbeing.guidance_want_help_planning IS 
  'V2 Barrier: I want more help planning my next steps.';
COMMENT ON COLUMN school_wellbeing.guidance_confused_courses IS 
  'V2 Barrier: I''m confused about which courses I need to take.';

COMMENT ON COLUMN school_wellbeing.trust_messages_not_answered IS 
  'V2 Barrier: My messages or emails aren''t answered in a timely way.';
COMMENT ON COLUMN school_wellbeing.trust_unclear_communication IS 
  'V2 Barrier: Communication from the school feels unclear or inconsistent.';
COMMENT ON COLUMN school_wellbeing.trust_bounced_between_offices IS 
  'V2 Barrier: I''m often bounced between offices when trying to get help.';

COMMENT ON COLUMN school_wellbeing.connection_no_mentor IS 
  'V2 Barrier: I don''t have a mentor or someone I can turn to.';
COMMENT ON COLUMN school_wellbeing.connection_hard_make_friends IS 
  'V2 Barrier: It''s hard for me to make friends here.';
COMMENT ON COLUMN school_wellbeing.connection_not_connected_students IS 
  'V2 Barrier: I don''t feel connected to other students.';

COMMENT ON TABLE school_wellbeing IS 
  'Stores school wellbeing responses. V1: rating scale fields. V2: driver-prefixed barrier checkboxes (care_*, access_*, guidance_*, trust_*, connection_*).';