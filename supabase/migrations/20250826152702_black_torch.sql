/*
  # Create Survey Database Schema

  1. New Tables
    - `survey_sessions` - Track survey sessions and completion status
    - `demographics` - Store demographic information for each session
    - `flourishing_scores` - Store all 12 flourishing domain scores
    - `school_wellbeing` - Store school-specific wellbeing scores
    - `growth_modules` - Store growth module responses for low-scoring domains
    - `text_responses` - Store open-text responses (bright spots, fastest wins)
    - `tensions_assessment` - Store tension slider responses
    - `universities` - Store university configuration data

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous survey submissions
    - Add policies for authenticated admin access
*/

-- Universities table
CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  admin_email text NOT NULL,
  survey_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Survey sessions table
CREATE TABLE IF NOT EXISTS survey_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  university_id uuid REFERENCES universities(id),
  university_slug text NOT NULL,
  start_time timestamptz DEFAULT now(),
  completion_time timestamptz,
  is_completed boolean DEFAULT false,
  ip_address inet,
  user_agent text,
  email_for_results text,
  created_at timestamptz DEFAULT now()
);

-- Demographics table
CREATE TABLE IF NOT EXISTS demographics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text REFERENCES survey_sessions(session_id) ON DELETE CASCADE,
  year_in_school text,
  enrollment_status text,
  age_range text,
  gender_identity text,
  gender_self_describe text,
  race_ethnicity jsonb DEFAULT '[]'::jsonb,
  is_international text,
  employment_status text,
  has_caregiving_responsibilities text,
  in_greek_organization text,
  created_at timestamptz DEFAULT now()
);

-- Flourishing scores table
CREATE TABLE IF NOT EXISTS flourishing_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text REFERENCES survey_sessions(session_id) ON DELETE CASCADE,
  happiness_satisfaction_1 integer CHECK (happiness_satisfaction_1 >= 0 AND happiness_satisfaction_1 <= 10),
  happiness_satisfaction_2 integer CHECK (happiness_satisfaction_2 >= 0 AND happiness_satisfaction_2 <= 10),
  mental_physical_health_1 integer CHECK (mental_physical_health_1 >= 0 AND mental_physical_health_1 <= 10),
  mental_physical_health_2 integer CHECK (mental_physical_health_2 >= 0 AND mental_physical_health_2 <= 10),
  meaning_purpose_1 integer CHECK (meaning_purpose_1 >= 0 AND meaning_purpose_1 <= 10),
  meaning_purpose_2 integer CHECK (meaning_purpose_2 >= 0 AND meaning_purpose_2 <= 10),
  character_virtue_1 integer CHECK (character_virtue_1 >= 0 AND character_virtue_1 <= 10),
  character_virtue_2 integer CHECK (character_virtue_2 >= 0 AND character_virtue_2 <= 10),
  social_relationships_1 integer CHECK (social_relationships_1 >= 0 AND social_relationships_1 <= 10),
  social_relationships_2 integer CHECK (social_relationships_2 >= 0 AND social_relationships_2 <= 10),
  financial_stability_1 integer CHECK (financial_stability_1 >= 0 AND financial_stability_1 <= 10),
  financial_stability_2 integer CHECK (financial_stability_2 >= 0 AND financial_stability_2 <= 10),
  created_at timestamptz DEFAULT now()
);

-- School wellbeing table
CREATE TABLE IF NOT EXISTS school_wellbeing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text REFERENCES survey_sessions(session_id) ON DELETE CASCADE,
  belonging_score integer CHECK (belonging_score >= 0 AND belonging_score <= 10),
  enjoy_school_days integer CHECK (enjoy_school_days >= 0 AND enjoy_school_days <= 10),
  physical_activity integer CHECK (physical_activity >= 0 AND physical_activity <= 10),
  feel_safe integer CHECK (feel_safe >= 0 AND feel_safe <= 10),
  work_connected_goals integer CHECK (work_connected_goals >= 0 AND work_connected_goals <= 10),
  contribute_bigger_purpose integer CHECK (contribute_bigger_purpose >= 0 AND contribute_bigger_purpose <= 10),
  kind_to_others integer CHECK (kind_to_others >= 0 AND kind_to_others <= 10),
  manage_emotions integer CHECK (manage_emotions >= 0 AND manage_emotions <= 10),
  trusted_adult integer CHECK (trusted_adult >= 0 AND trusted_adult <= 10),
  supportive_friends integer CHECK (supportive_friends >= 0 AND supportive_friends <= 10),
  resources_participation integer CHECK (resources_participation >= 0 AND resources_participation <= 10),
  wellbeing_checklist jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Growth modules table
CREATE TABLE IF NOT EXISTS growth_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text REFERENCES survey_sessions(session_id) ON DELETE CASCADE,
  domain_name text NOT NULL,
  enabler_selections jsonb DEFAULT '[]'::jsonb,
  barrier_selection text,
  additional_comments text,
  created_at timestamptz DEFAULT now()
);

-- Text responses table
CREATE TABLE IF NOT EXISTS text_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text REFERENCES survey_sessions(session_id) ON DELETE CASCADE,
  bright_spots jsonb DEFAULT '{}'::jsonb,
  fastest_win_suggestion text,
  created_at timestamptz DEFAULT now()
);

-- Tensions assessment table
CREATE TABLE IF NOT EXISTS tensions_assessment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text REFERENCES survey_sessions(session_id) ON DELETE CASCADE,
  performance_wellbeing integer CHECK (performance_wellbeing >= 0 AND performance_wellbeing <= 100),
  ambition_contribution integer CHECK (ambition_contribution >= 0 AND ambition_contribution <= 100),
  selfreliance_connection integer CHECK (selfreliance_connection >= 0 AND selfreliance_connection <= 100),
  stability_growth integer CHECK (stability_growth >= 0 AND stability_growth <= 100),
  academic_creative integer CHECK (academic_creative >= 0 AND academic_creative <= 100),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE flourishing_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_wellbeing ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tensions_assessment ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous survey submissions
CREATE POLICY "Allow anonymous survey submissions"
  ON survey_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous demographic submissions"
  ON demographics
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous flourishing score submissions"
  ON flourishing_scores
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous school wellbeing submissions"
  ON school_wellbeing
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous growth module submissions"
  ON growth_modules
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous text response submissions"
  ON text_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous tension assessment submissions"
  ON tensions_assessment
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policies for authenticated admin access
CREATE POLICY "Admins can read all university data"
  ON universities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read survey sessions"
  ON survey_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read demographics"
  ON demographics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read flourishing scores"
  ON flourishing_scores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read school wellbeing"
  ON school_wellbeing
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read growth modules"
  ON growth_modules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read text responses"
  ON text_responses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read tension assessments"
  ON tensions_assessment
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert demo university
INSERT INTO universities (name, slug, admin_email) 
VALUES ('Demo University', 'demo-university', 'admin@university.edu')
ON CONFLICT (slug) DO NOTHING;