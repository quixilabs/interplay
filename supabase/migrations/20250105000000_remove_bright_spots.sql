-- Migration to remove bright_spots column from text_responses table
-- This removes the follow-up free text questions from the flourishing domains

-- Remove the bright_spots column from text_responses table
ALTER TABLE text_responses DROP COLUMN IF EXISTS bright_spots;

-- Update any existing policies if needed (they should still work without the column)
-- No policy changes needed as the existing policies work with any column structure
