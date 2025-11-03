-- SIMPLE FIX - Copy and paste this ENTIRE file into Supabase SQL Editor
-- This will definitely fix the RLS issue

-- Step 1: Drop ALL existing policies on videos table
DROP POLICY IF EXISTS "Authenticated insert" ON videos;
DROP POLICY IF EXISTS "Public insert access" ON videos;
DROP POLICY IF EXISTS "Public upload videos" ON videos;

-- Step 2: Make sure RLS is enabled
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Step 3: Create public read policy (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'videos' 
    AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access" ON videos
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- Step 4: Create public insert policy (THIS IS THE KEY ONE)
CREATE POLICY "Public insert access" ON videos
FOR INSERT
TO public
WITH CHECK (true);

-- Step 5: Verify it worked
SELECT 
  'SUCCESS! Policies created:' as status,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'videos'
ORDER BY policyname;

-- You should see:
-- - "Public read access" with cmd = 'SELECT'
-- - "Public insert access" with cmd = 'INSERT'

