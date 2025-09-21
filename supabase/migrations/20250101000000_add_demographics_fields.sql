-- Add new demographic fields for study mode and transfer student status
-- Migration: Add study_mode and transfer_student columns to demographics table

ALTER TABLE demographics 
ADD COLUMN IF NOT EXISTS study_mode text,
ADD COLUMN IF NOT EXISTS transfer_student text;

-- Add comments to document the new columns
COMMENT ON COLUMN demographics.study_mode IS 'Student''s current mode of study: Entirely in-person, Entirely online, or Hybrid (a mix of in-person and online)';
COMMENT ON COLUMN demographics.transfer_student IS 'Transfer student status: No (first-time freshman), Yes (transferred this year), Yes (transferred last year), or Yes (transferred two or more years ago)';
