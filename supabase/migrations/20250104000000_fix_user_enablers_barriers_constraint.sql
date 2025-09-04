-- Migration to fix unique constraint on user_enablers_barriers table
-- Ensures proper storage of all domain data including meaning_purpose

-- First, check if the unique constraint exists and drop it if needed
DO $$ 
BEGIN
    -- Drop the existing unique constraint if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_enablers_barriers_session_id_domain_key_key'
    ) THEN
        ALTER TABLE user_enablers_barriers 
        DROP CONSTRAINT user_enablers_barriers_session_id_domain_key_key;
    END IF;
END $$;

-- Recreate the unique constraint to ensure it's properly set
ALTER TABLE user_enablers_barriers 
ADD CONSTRAINT user_enablers_barriers_session_domain_unique 
UNIQUE (session_id, domain_key);

-- Add an index for better performance on lookups
CREATE INDEX IF NOT EXISTS idx_user_enablers_barriers_session_domain 
ON user_enablers_barriers(session_id, domain_key);

-- Ensure the table has the correct columns for other text
ALTER TABLE user_enablers_barriers 
ADD COLUMN IF NOT EXISTS enabler_other_text TEXT,
ADD COLUMN IF NOT EXISTS barrier_other_text TEXT;

-- Add a function to help debug storage issues
CREATE OR REPLACE FUNCTION debug_enablers_barriers_storage(p_session_id TEXT)
RETURNS TABLE(
    domain_key TEXT,
    selected_enablers TEXT[],
    selected_barriers TEXT[],
    enabler_other_text TEXT,
    barrier_other_text TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ueb.domain_key,
        ueb.selected_enablers,
        ueb.selected_barriers,
        ueb.enabler_other_text,
        ueb.barrier_other_text,
        ueb.created_at,
        ueb.updated_at
    FROM user_enablers_barriers ueb
    WHERE ueb.session_id = p_session_id
    ORDER BY ueb.domain_key;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions on the debug function
GRANT EXECUTE ON FUNCTION debug_enablers_barriers_storage(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION debug_enablers_barriers_storage(TEXT) TO authenticated;
