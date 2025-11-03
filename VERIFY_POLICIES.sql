-- VERIFY YOUR RLS POLICIES
-- Run this to check if policies are set correctly

-- Check videos table policies
SELECT 
  'VIDEOS TABLE POLICIES' as check_type,
  policyname,
  cmd as operation,
  permissive,
  roles,
  qual as using_clause,
  with_check as check_clause
FROM pg_policies 
WHERE tablename = 'videos'
ORDER BY policyname;

-- You NEED to see:
-- 1. "Public read access" - cmd = 'SELECT' - with_check should be empty/null
-- 2. "Public insert access" - cmd = 'INSERT' - with_check should be 'true' or '(true)'

-- If you don't see "Public insert access", run FIX_RLS_SIMPLE.sql

