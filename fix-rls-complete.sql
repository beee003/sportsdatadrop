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
-- STEP 3: Create new public policies for storage bucket
-- ============================================

-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create public read policy for storage (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access'
    AND qual::text LIKE '%videos%'
  ) THEN
    CREATE POLICY "Public read access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'videos');
  END IF;
END $$;

-- Create public upload policy for storage
CREATE POLICY "Public upload videos" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'videos');

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

