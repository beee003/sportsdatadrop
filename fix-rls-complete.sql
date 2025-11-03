-- Complete RLS Policy Fix for SportsDataDrop
-- This script will fix ALL RLS issues for public uploads
-- Run this ENTIRE script in Supabase SQL Editor

-- ============================================
-- STEP 1: Drop ALL existing policies that might conflict
-- ============================================

-- Drop all existing policies on videos table
DROP POLICY IF EXISTS "Authenticated insert" ON videos;
DROP POLICY IF EXISTS "Public insert access" ON videos;

-- Drop all existing policies on storage.objects for videos bucket
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Public upload videos" ON storage.objects;

-- ============================================
-- STEP 2: Create new public policies for videos table
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create public read policy (if it doesn't exist)
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

-- Create public insert policy
CREATE POLICY "Public insert access" ON videos
FOR INSERT
WITH CHECK (true);

-- ============================================
-- STEP 3: Storage policies (must be done via Dashboard)
-- ============================================
-- NOTE: Storage policies cannot be modified via SQL due to permissions.
-- You must set them up in the Supabase Dashboard:
--
-- 1. Go to Storage → Policies
-- 2. Select the "videos" bucket
-- 3. Create these policies:
--
--    Policy 1: "Public read access"
--    - Operation: SELECT
--    - Target roles: anon, authenticated
--    - USING expression: bucket_id = 'videos'
--
--    Policy 2: "Public upload videos"  
--    - Operation: INSERT
--    - Target roles: anon, authenticated
--    - WITH CHECK expression: bucket_id = 'videos'
--
-- See STORAGE_POLICY_SETUP.md for detailed UI instructions.

-- ============================================
-- STEP 4: Verify the policies were created
-- ============================================

-- Show all policies on videos table
SELECT 
  'VIDEOS TABLE POLICIES:' as info,
  policyname, 
  cmd as command,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'videos'
ORDER BY policyname;

-- Show all policies on storage.objects for videos bucket
SELECT 
  'STORAGE POLICIES:' as info,
  policyname, 
  cmd as command
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND (qual::text LIKE '%videos%' OR policyname LIKE '%video%')
ORDER BY policyname;

