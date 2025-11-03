-- Fix RLS Policy for Videos Table Only
-- Run this in your Supabase SQL Editor
-- (Storage policies must be set up via Dashboard - see STORAGE_POLICY_SETUP.md)

-- ============================================
-- STEP 1: Drop existing policies on videos table
-- ============================================

DROP POLICY IF EXISTS "Authenticated insert" ON videos;
DROP POLICY IF EXISTS "Public insert access" ON videos;

-- ============================================
-- STEP 2: Ensure RLS is enabled
-- ============================================

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Create public read policy (if needed)
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'videos' 
    AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access" ON videos
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- ============================================
-- STEP 4: Create public insert policy
-- ============================================
-- NOTE: Videos table doesn't have bucket_id column
-- Use WITH CHECK (true) to allow all inserts

CREATE POLICY "Public insert access" ON videos
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- STEP 5: Verify policies were created
-- ============================================

SELECT 
  'VIDEOS TABLE POLICIES:' as info,
  policyname, 
  cmd as command,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'videos'
ORDER BY policyname;

-- You should see:
-- 1. "Public read access" (SELECT)
-- 2. "Public insert access" (INSERT)

