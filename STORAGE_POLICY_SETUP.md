# 📦 Storage Policy Setup Guide

## Setting Up Storage Policies via Supabase Dashboard

Since we can't modify storage policies via SQL (permission error), we need to set them up through the Supabase Dashboard UI.

### Step 1: Open Storage Policies

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Storage** in the left sidebar
4. Click on the **videos** bucket
5. Click the **Policies** tab (next to Files)

### Step 2: Create Public Read Policy

1. Click **New Policy**
2. Choose **For full customization, create a policy from scratch**
3. Fill in:
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: Check both `anon` and `authenticated`
   - **USING expression**: 
     ```sql
     bucket_id = 'videos'
     ```
   - **WITH CHECK expression**: (leave empty)
4. Click **Review** then **Save policy**

### Step 3: Create Public Upload Policy

1. Click **New Policy** again
2. Choose **For full customization, create a policy from scratch**
3. Fill in:
   - **Policy name**: `Public upload videos`
   - **Allowed operation**: `INSERT`
   - **Target roles**: Check both `anon` and `authenticated`
   - **USING expression**: (leave empty)
   - **WITH CHECK expression**:
     ```sql
     bucket_id = 'videos'
     ```
4. Click **Review** then **Save policy**

### Step 4: Verify Policies

You should now see two policies:
- ✅ `Public read access` (SELECT)
- ✅ `Public upload videos` (INSERT)

### Step 5: Test Upload

1. Go back to your app
2. Try uploading a video
3. It should work now! 🎉

---

## Alternative: Using Policy Templates

If the above seems complex, Supabase also provides policy templates:

1. In Storage → Policies tab
2. Click **New Policy**
3. Select **Create a policy from a template**
4. For uploads, choose: **"Allow public uploads"**
5. Modify the policy to only apply to `videos` bucket:
   ```sql
   bucket_id = 'videos'
   ```

---

## Quick Checklist

- [ ] Videos bucket exists and is marked as **Public**
- [ ] `Public read access` policy exists (SELECT)
- [ ] `Public upload videos` policy exists (INSERT)
- [ ] Both policies allow `anon` role
- [ ] Test upload works

---

## Troubleshooting

### "Policy already exists" error
- Delete the old policy first
- Then create the new one

### Still getting permission errors?
1. Check the bucket is marked as **Public** (Settings tab)
2. Verify both policies allow `anon` role
3. Make sure the `WITH CHECK` expression uses `bucket_id = 'videos'`

