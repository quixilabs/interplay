-- Migration: Update employment status from 'Full-time' to 'Full-time (40+ hours/week)'
-- This migration ensures clarity in survey responses by specifying what constitutes full-time employment
-- Date: December 18, 2025

-- Display count of records to be updated (for verification)
DO $$ 
DECLARE 
    record_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO record_count
    FROM demographics 
    WHERE employment_status = 'Full-time';
    
    RAISE NOTICE 'Found % records with employment_status = ''Full-time'' to be updated', record_count;
END $$;

-- Update the employment_status field
UPDATE demographics 
SET employment_status = 'Full-time (40+ hours/week)'
WHERE employment_status = 'Full-time';

-- Verify the update
DO $$ 
DECLARE 
    old_count INTEGER;
    new_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO old_count
    FROM demographics 
    WHERE employment_status = 'Full-time';
    
    SELECT COUNT(*) INTO new_count
    FROM demographics 
    WHERE employment_status = 'Full-time (40+ hours/week)';
    
    RAISE NOTICE 'After migration:';
    RAISE NOTICE '  - Records with ''Full-time'': %', old_count;
    RAISE NOTICE '  - Records with ''Full-time (40+ hours/week)'': %', new_count;
    
    IF old_count > 0 THEN
        RAISE WARNING 'Migration may not have completed successfully. % records still have old value.', old_count;
    ELSE
        RAISE NOTICE 'Migration completed successfully!';
    END IF;
END $$;

