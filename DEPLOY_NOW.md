# 🚀 Quick Deploy to Vercel

Your code is now on GitHub! Here's how to deploy to Vercel:

## Step 1: Go to Vercel
1. Visit https://vercel.com
2. Sign in with your GitHub account (if not already signed in)

## Step 2: Import Your Project
1. Click **"New Project"** or **"Add New..."** → **"Project"**
2. Find **"sportsdatadrop"** in your repositories list
3. Click **"Import"**

## Step 3: Configure Project
Vercel will auto-detect SolidStart settings:
- **Framework Preset**: SolidStart ✓
- **Build Command**: `npm run build` ✓
- **Output Directory**: `.output` ✓
- **Install Command**: `npm install` ✓

**You can leave these as-is!**

## Step 4: Add Environment Variables
Click **"Environment Variables"** and add these three:

1. **VITE_SUPABASE_URL**
   - Value: Your Supabase project URL (from your `.env` file)

2. **VITE_SUPABASE_ANON_KEY**
   - Value: Your Supabase anon key (from your `.env` file)

3. **STRIPE_PUBLIC_KEY** (Optional)
   - Value: Your Stripe public key (from your `.env` file)

You can copy these from your local `.env` file.

## Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your app will be live at `sportsdatadrop.vercel.app` (or similar)

## 🎉 After Deployment

Once deployed, you can:
- Visit your live site
- Test all features
- Use `npm run pull-secrets` locally to sync secrets for local preview

## 🔄 Future Updates
Any time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically redeploy! 🚀

