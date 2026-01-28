-- Update the barrier text for the meaning_purpose domain
-- Change "I don't have enough time" to "I don't know how to set up goals"
-- Run this in your Supabase SQL Editor

-- First, let's see what we have
SELECT domain_key, barriers 
FROM domain_enablers_barriers 
WHERE domain_key = 'meaning_purpose';

-- Update the barrier (replacing in text array)
UPDATE domain_enablers_barriers
SET barriers = array_replace(
  barriers,
  'I don''t have enough time',
  'I don''t know how to set up goals'
)
WHERE domain_key = 'meaning_purpose'
  AND 'I don''t have enough time' = ANY(barriers);

-- Verify the change
SELECT domain_key, barriers 
FROM domain_enablers_barriers 
WHERE domain_key = 'meaning_purpose';

