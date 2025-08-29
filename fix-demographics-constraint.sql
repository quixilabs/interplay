-- Fix Demographics Table Constraint Issue
-- Add unique constraint on session_id to allow upsert operations

-- First, check if there are any duplicate session_ids in demographics
SELECT session_id, COUNT(*) 
FROM demographics 
GROUP BY session_id 
HAVING COUNT(*) > 1;

-- If there are duplicates, we need to clean them up first
-- Delete duplicates keeping only the latest one
DELETE FROM demographics 
WHERE id NOT IN (
  SELECT DISTINCT ON (session_id) id 
  FROM demographics 
  ORDER BY session_id, created_at DESC
);

-- Add unique constraint on session_id
ALTER TABLE demographics 
ADD CONSTRAINT demographics_session_id_unique 
UNIQUE (session_id);

-- Verify the constraint was added
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'demographics'::regclass 
AND contype = 'u';
