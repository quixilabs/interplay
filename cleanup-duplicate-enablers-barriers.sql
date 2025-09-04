-- Cleanup script to remove duplicate enablers/barriers records
-- Run this if you have existing duplicate records causing constraint violations

-- First, let's see what duplicates exist
SELECT 
    session_id, 
    domain_key, 
    COUNT(*) as duplicate_count,
    array_agg(id ORDER BY created_at) as record_ids
FROM user_enablers_barriers 
GROUP BY session_id, domain_key 
HAVING COUNT(*) > 1
ORDER BY session_id, domain_key;

-- Remove duplicates, keeping only the oldest record for each (session_id, domain_key) combination
WITH duplicate_records AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY session_id, domain_key 
            ORDER BY created_at ASC
        ) as row_num
    FROM user_enablers_barriers
)
DELETE FROM user_enablers_barriers 
WHERE id IN (
    SELECT id 
    FROM duplicate_records 
    WHERE row_num > 1
);

-- Verify cleanup
SELECT 
    session_id, 
    domain_key, 
    COUNT(*) as count_after_cleanup
FROM user_enablers_barriers 
GROUP BY session_id, domain_key 
HAVING COUNT(*) > 1;

-- This should return no rows if cleanup was successful
