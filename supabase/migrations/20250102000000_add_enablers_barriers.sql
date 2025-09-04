-- Migration to add enablers and barriers tables for flourishing domains
-- This replaces the growth module functionality with domain-specific enablers and barriers

-- Create domain_enablers_barriers table to store enabler and barrier options for each domain
CREATE TABLE IF NOT EXISTS domain_enablers_barriers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain_key TEXT NOT NULL,
    domain_name TEXT NOT NULL,
    enablers TEXT[] NOT NULL,
    barriers TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_enablers_barriers table to store user selections
CREATE TABLE IF NOT EXISTS user_enablers_barriers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES survey_sessions(session_id) ON DELETE CASCADE,
    domain_key TEXT NOT NULL,
    selected_enablers TEXT[] DEFAULT '{}',
    selected_barriers TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, domain_key)
);

-- Insert the domain enablers and barriers data
INSERT INTO domain_enablers_barriers (domain_key, domain_name, enablers, barriers) VALUES 
(
    'happiness_satisfaction',
    'Happiness & Life Satisfaction',
    ARRAY['Belonging', 'Fun or humor', 'Arts/music/creative activities', 'Spending time in nature', 'Someone checking in', 'Other'],
    ARRAY['Not enough time', 'Don''t feel welcome', 'Don''t know what to do', 'Costs', 'Rules or schedule', 'Family responsibilities', 'Other']
),
(
    'mental_physical_health',
    'Mental & Physical Health',
    ARRAY['More chances to move', 'Safer spaces', 'Access to counselor', 'Stress tools', 'Better sleep or food', 'Other'],
    ARRAY['Time', 'Access', 'Don''t know how', 'Stigma', 'Safety concerns', 'Costs', 'Other']
),
(
    'meaning_purpose',
    'Meaning & Purpose',
    ARRAY['Connect classwork to future', 'Service learning', 'Mentors', 'Reflection time', 'Choice in projects', 'Other'],
    ARRAY['Don''t see the point', 'No time', 'No mentor', 'Unsure of goals', 'Rules or schedule', 'Other']
),
(
    'character_virtue',
    'Character & Virtue',
    ARRAY['Emotion tools', 'Kindness recognition', 'Restorative approaches', 'Teacher coaching', 'Practice chances', 'Other'],
    ARRAY['Forget tools', 'No space or time to cool down', 'Worry what others think', 'Adults unavailable', 'Other']
),
(
    'social_relationships',
    'Close Social Relationships',
    ARRAY['Trusted adult', 'Peer connection', 'Anti-bullying', 'Group norms', 'Mentoring', 'Other'],
    ARRAY['New or isolated', 'Negative experiences', 'Schedule or transport', 'Shyness or anxiety', 'Don''t know which adult', 'Other']
),
(
    'financial_stability',
    'Financial & Material Stability',
    ARRAY['Fee waivers', 'Meals or snacks', 'Supplies/device/wi-fi', 'Transport help', 'Work opportunities', 'Other'],
    ARRAY['Costs', 'Transport', 'Family responsibilities', 'Don''t know what help exists', 'Other']
);

-- Add RLS policies
ALTER TABLE domain_enablers_barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_enablers_barriers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to domain_enablers_barriers (reference data)
CREATE POLICY "Allow public read access to domain enablers and barriers" ON domain_enablers_barriers
    FOR SELECT USING (true);

-- Allow users to insert/update their own enablers and barriers
CREATE POLICY "Users can manage their own enablers and barriers" ON user_enablers_barriers
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_domain_enablers_barriers_domain_key ON domain_enablers_barriers(domain_key);
CREATE INDEX IF NOT EXISTS idx_user_enablers_barriers_session_domain ON user_enablers_barriers(session_id, domain_key);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_enablers_barriers_updated_at 
    BEFORE UPDATE ON user_enablers_barriers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
