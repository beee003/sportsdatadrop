# 🚀 Quick Fix Guide - Copy & Paste Ready

## Fix Videos Table Policy (SQL Editor)

Copy and paste this into Supabase SQL Editor:

```sql
-- Drop old policy
DROP POLICY IF EXISTS "Authenticated insert" ON videos;

-- Create new public insert policy for videos table
CREATE POLICY "Public insert access" ON videos
FOR INSERT
TO public
WITH CHECK (true);
```

**That's it!** The `WITH CHECK (true)` allows anyone to insert - no bucket_id needed (that's only for storage).

---

## Fix Storage Bucket Policy (Dashboard UI)

Since SQL doesn't work for storage, do this in the Dashboard:

1. Go to **Storage** → Click **videos** bucket → **Policies** tab
2. Click **New Policy** → **Create from scratch**
3. Fill in:
   - **Name**: `Public upload videos`
   - **Operation**: `INSERT`
   - **Target roles**: Check `anon` and `authenticated`
   - **WITH CHECK expression**: 
     ```sql
     bucket_id = 'videos'
     ```
4. Save

---

## Done!

After both steps, uploads will work. Test it now! 🎉

