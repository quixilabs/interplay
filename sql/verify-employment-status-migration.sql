-- Verification Script: Check employment status distribution before/after migration
-- Run this script to verify the current state of employment_status data
-- Date: December 18, 2025

-- Show all distinct employment status values and their counts
SELECT 
    employment_status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM demographics
WHERE employment_status IS NOT NULL
GROUP BY employment_status
ORDER BY count DESC;

-- Show total demographics records
SELECT 
    COUNT(*) as total_demographics_records,
    COUNT(CASE WHEN employment_status IS NOT NULL THEN 1 END) as records_with_employment_status,
    COUNT(CASE WHEN employment_status IS NULL THEN 1 END) as records_without_employment_status
FROM demographics;

-- Check for old 'Full-time' value
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 
            'WARNING: Found ' || COUNT(*) || ' records with old ''Full-time'' value. Migration needed or not yet applied.'
        ELSE 
            'SUCCESS: No records found with old ''Full-time'' value. Migration has been applied or no data to migrate.'
    END as migration_status
FROM demographics
WHERE employment_status = 'Full-time';

-- Check for new 'Full-time (40+ hours/week)' value
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 
            'CONFIRMED: Found ' || COUNT(*) || ' records with new ''Full-time (40+ hours/week)'' value.'
        ELSE 
            'INFO: No records found with new ''Full-time (40+ hours/week)'' value yet.'
    END as new_value_status
FROM demographics
WHERE employment_status = 'Full-time (40+ hours/week)';

