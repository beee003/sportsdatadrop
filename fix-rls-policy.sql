-- Fix RLS Policies for Public Uploads
-- Run this in your Supabase SQL Editor to allow unauthenticated uploads

-- ============================================
-- Fix videos table policy
-- ============================================

-- Drop the old authenticated policy if it exists
DROP POLICY IF EXISTS "Authenticated insert" ON videos;

-- Create the new public insert policy for videos table
CREATE POLICY "Public insert access" ON videos
FOR INSERT
WITH CHECK (true);

-- ============================================
-- Fix storage bucket policy
-- ============================================

-- Drop existing storage upload policy
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;

-- Create public upload policy for videos bucket
-- This allows anyone to upload files to the videos bucket
CREATE POLICY "Public upload videos" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'videos');

-- ============================================
-- Verify policies (optional - just to check)
-- ============================================

-- Check videos table policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'videos';

-- Check storage policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

