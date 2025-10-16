-- Update the barrier text for the mental_physical_health domain
-- Change "I don't have enough time" to "Competitive environment/peer pressure"
-- Run this in your Supabase SQL Editor

-- First, let's see what we have
SELECT domain_key, barriers 
FROM domain_enablers_barriers 
WHERE domain_key = 'mental_physical_health';

-- Update the barrier (replacing in text array)
UPDATE domain_enablers_barriers
SET barriers = array_replace(
  barriers,
  'I don''t have enough time',
  'Competitive environment/peer pressure'
)
WHERE domain_key = 'mental_physical_health'
  AND 'I don''t have enough time' = ANY(barriers);

-- Verify the change
SELECT domain_key, barriers 
FROM domain_enablers_barriers 
WHERE domain_key = 'mental_physical_health';

