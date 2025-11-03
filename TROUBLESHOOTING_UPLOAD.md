# 🔧 Upload Troubleshooting Guide

## Common Issues and Fixes

### ❌ "new row violates row-level security policy"

**Problem**: Your Supabase database still has the old authenticated-only RLS policies.

**Solution**: Run the SQL fix script in Supabase:

1. Go to your Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the **ENTIRE** contents of `fix-rls-complete.sql`
5. Click **Run** (Ctrl/Cmd + Enter)

The script will:
- ✅ Remove old authenticated policies
- ✅ Create new public insert policies
- ✅ Fix storage bucket permissions
- ✅ Show you verification queries

**After running**: Try uploading again. It should work immediately.

---

### ❌ Storage Upload Errors

**Error**: "Bucket not found" or "Permission denied"

**Fix**:
1. Go to Supabase Dashboard → **Storage**
2. Check if `videos` bucket exists
3. If not, create it:
   - Click **New Bucket**
   - Name: `videos`
   - Public: ✅ **Yes** (check this!)
   - Click **Create**

4. Update storage policies (run in SQL Editor):
```sql
-- Allow public uploads to videos bucket
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
CREATE POLICY "Public upload videos" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'videos');
```

---

### ❌ Environment Variables Not Set

**Error**: "Missing Supabase URL" or similar

**Fix**:
1. Check `.env` file (local) or Vercel Environment Variables (production)
2. Ensure these are set:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **For Vercel**: 
   - Go to Project Settings → Environment Variables
   - Add both variables
   - Redeploy

---

### ❌ File Size Limits

**Error**: Upload fails silently or times out

**Fix**:
- Supabase free tier: 50MB file size limit
- Upgrade plan or compress videos before upload
- For larger files, consider chunked uploads (future feature)

---

### ❌ Browser Console Errors

**How to Debug**:
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Try uploading a video
4. Look for error messages (they'll be in red)
5. Share the exact error message for troubleshooting

---

## Step-by-Step Verification

### 1. Check RLS Policies

Run in Supabase SQL Editor:
```sql
-- Check videos table policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'videos';

-- Should show:
-- - "Public read access" (SELECT)
-- - "Public insert access" (INSERT)
```

### 2. Check Storage Policies

```sql
-- Check storage policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND qual::text LIKE '%videos%';

-- Should show:
-- - "Public read access" (SELECT)
-- - "Public upload videos" (INSERT)
```

### 3. Check Storage Bucket

In Supabase Dashboard:
- Go to **Storage** → **Buckets**
- Find `videos` bucket
- Ensure it's marked as **Public**
- Check file size limits

### 4. Test Upload Manually

In Supabase Dashboard:
- Go to **Storage** → **videos** → **Upload file**
- Try uploading a test video
- If this works, the issue is in the code
- If this fails, it's a Supabase configuration issue

---

## Quick Fix Checklist

- [ ] Run `fix-rls-complete.sql` in Supabase SQL Editor
- [ ] Verify `videos` bucket exists and is public
- [ ] Check environment variables are set correctly
- [ ] Check browser console for detailed errors
- [ ] Verify file size is under 50MB (free tier limit)
- [ ] Try uploading again after fixes

---

## Still Not Working?

1. **Check browser console** - Share the exact error
2. **Check Supabase logs** - Dashboard → Logs → API
3. **Verify database** - Run the verification queries above
4. **Test storage** - Try uploading directly in Supabase dashboard

---

## Testing Upload Flow

1. ✅ Select a video file (under 50MB)
2. ✅ Enter a title
3. ✅ Set a price
4. ✅ Click Upload
5. ✅ Check browser console for progress logs
6. ✅ Check Supabase Storage → videos bucket (file should appear)
7. ✅ Check Supabase Database → videos table (row should appear)
8. ✅ Check marketplace page (video should be listed)

If any step fails, check the error message and refer to fixes above.

