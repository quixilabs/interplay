-- ROLLBACK Migration: Revert employment status from 'Full-time (40+ hours/week)' back to 'Full-time'
-- Use this ONLY if you need to rollback the migration
-- Date: December 18, 2025
-- WARNING: This will revert the clarification change. Use with caution.

-- Display count of records to be reverted (for verification)
DO $$ 
DECLARE 
    record_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO record_count
    FROM demographics 
    WHERE employment_status = 'Full-time (40+ hours/week)';
    
    RAISE NOTICE 'Found % records with employment_status = ''Full-time (40+ hours/week)'' to be reverted', record_count;
END $$;

-- Revert the employment_status field
UPDATE demographics 
SET employment_status = 'Full-time'
WHERE employment_status = 'Full-time (40+ hours/week)';

-- Verify the rollback
DO $$ 
DECLARE 
    old_count INTEGER;
    new_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO old_count
    FROM demographics 
    WHERE employment_status = 'Full-time (40+ hours/week)';
    
    SELECT COUNT(*) INTO new_count
    FROM demographics 
    WHERE employment_status = 'Full-time';
    
    RAISE NOTICE 'After rollback:';
    RAISE NOTICE '  - Records with ''Full-time (40+ hours/week)'': %', old_count;
    RAISE NOTICE '  - Records with ''Full-time'': %', new_count;
    
    IF old_count > 0 THEN
        RAISE WARNING 'Rollback may not have completed successfully. % records still have new value.', old_count;
    ELSE
        RAISE NOTICE 'Rollback completed successfully!';
    END IF;
END $$;

