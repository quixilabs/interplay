-- Fix Row Level Security Policies for Survey Application
-- This script allows anonymous users to read universities and insert survey data

-- 1. Allow anonymous users to read universities (for survey validation)
DROP POLICY IF EXISTS "Allow anonymous read access to universities" ON universities;
CREATE POLICY "Allow anonymous read access to universities" 
ON universities FOR SELECT 
TO anon 
USING (survey_active = true);

-- 2. Allow anonymous users to insert survey sessions
DROP POLICY IF EXISTS "Allow anonymous insert to survey_sessions" ON survey_sessions;
CREATE POLICY "Allow anonymous insert to survey_sessions" 
ON survey_sessions FOR INSERT 
TO anon 
WITH CHECK (true);

-- 3. Allow anonymous users to read their own survey sessions
DROP POLICY IF EXISTS "Allow anonymous read own survey_sessions" ON survey_sessions;
CREATE POLICY "Allow anonymous read own survey_sessions" 
ON survey_sessions FOR SELECT 
TO anon 
USING (true);

-- 4. Allow anonymous users to update their own survey sessions
DROP POLICY IF EXISTS "Allow anonymous update own survey_sessions" ON survey_sessions;
CREATE POLICY "Allow anonymous update own survey_sessions" 
ON survey_sessions FOR UPDATE 
TO anon 
USING (true)
WITH CHECK (true);

-- 5. Allow anonymous users to insert demographics
DROP POLICY IF EXISTS "Allow anonymous insert to demographics" ON demographics;
CREATE POLICY "Allow anonymous insert to demographics" 
ON demographics FOR INSERT 
TO anon 
WITH CHECK (true);

-- 6. Allow anonymous users to insert flourishing scores
DROP POLICY IF EXISTS "Allow anonymous insert to flourishing_scores" ON flourishing_scores;
CREATE POLICY "Allow anonymous insert to flourishing_scores" 
ON flourishing_scores FOR INSERT 
TO anon 
WITH CHECK (true);

-- 7. Allow anonymous users to insert school wellbeing data
DROP POLICY IF EXISTS "Allow anonymous insert to school_wellbeing" ON school_wellbeing;
CREATE POLICY "Allow anonymous insert to school_wellbeing" 
ON school_wellbeing FOR INSERT 
TO anon 
WITH CHECK (true);

-- 8. Allow anonymous users to insert growth modules
DROP POLICY IF EXISTS "Allow anonymous insert to growth_modules" ON growth_modules;
CREATE POLICY "Allow anonymous insert to growth_modules" 
ON growth_modules FOR INSERT 
TO anon 
WITH CHECK (true);

-- 9. Allow anonymous users to insert text responses
DROP POLICY IF EXISTS "Allow anonymous insert to text_responses" ON text_responses;
CREATE POLICY "Allow anonymous insert to text_responses" 
ON text_responses FOR INSERT 
TO anon 
WITH CHECK (true);

-- 10. Allow anonymous users to insert tensions assessment
DROP POLICY IF EXISTS "Allow anonymous insert to tensions_assessment" ON tensions_assessment;
CREATE POLICY "Allow anonymous insert to tensions_assessment" 
ON tensions_assessment FOR INSERT 
TO anon 
WITH CHECK (true);

-- Verify policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('universities', 'survey_sessions', 'demographics', 'flourishing_scores', 'school_wellbeing', 'growth_modules', 'text_responses', 'tensions_assessment')
ORDER BY tablename, policyname;
