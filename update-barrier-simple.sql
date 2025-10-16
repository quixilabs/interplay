-- Update the barrier text for the happiness_satisfaction domain
-- Run this in your Supabase SQL Editor

-- First, let's see what we have
SELECT domain_key, barriers 
FROM domain_enablers_barriers 
WHERE domain_key = 'happiness_satisfaction';

-- Update the barrier (replacing in text array)
UPDATE domain_enablers_barriers
SET barriers = array_replace(
  barriers,
  'I don''t have enough time',
  'School commitments take up most of my time'
)
WHERE domain_key = 'happiness_satisfaction'
  AND 'I don''t have enough time' = ANY(barriers);

-- Verify the change
SELECT domain_key, barriers 
FROM domain_enablers_barriers 
WHERE domain_key = 'happiness_satisfaction';

