# 🚢 Deployment Guide

## Quick Deploy to Vercel

### 1. Prepare Your Repository

```bash
cd sportsdatadrop
git init
git add .
git commit -m "Initial commit: SportsDataDrop MVP"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect SolidStart
5. Add environment variables:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   STRIPE_PUBLIC_KEY=your_key
   ```
6. Click **"Deploy"**

### 3. Post-Deployment

- ✅ Your app will be live at `your-project.vercel.app`
- ✅ Add a custom domain in Vercel settings (optional)
- ✅ Enable analytics if desired

## Alternative: Deploy to Other Platforms

### Netlify

1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `.output`
4. Add environment variables

### Cloudflare Pages

1. Connect GitHub repo
2. Framework preset: SolidStart
3. Build command: `npm run build`
4. Add environment variables

## Environment Variables Checklist

Make sure these are set in your deployment platform:

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `STRIPE_PUBLIC_KEY` (optional for MVP)

## Local Preview with Vercel Secrets

After deploying to Vercel, you can test the production build locally with the same environment variables:

1. Install and login to Vercel CLI:
   ```bash
   npm i -g vercel
   vercel login
   ```

2. Link your project (if not already linked):
   ```bash
   vercel link
   ```

3. Pull secrets from Vercel:
   ```bash
   npm run pull-secrets
   ```
   This creates a `.env.local` file with your Vercel environment variables.

4. Build and preview:
   ```bash
   npm run build
   npm run preview
   ```

The `.env.local` file is git-ignored and will be used during preview builds.

## Troubleshooting

### Build fails?
- Check Node.js version (needs 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Runtime errors?
- Verify environment variables are set correctly
- Check Supabase RLS policies
- Verify Storage bucket permissions

### Preview not loading secrets?
- Make sure you've run `vercel link` to connect your local project
- Verify secrets are set in your Vercel project dashboard
- Check that `.env.local` file was created after running `npm run pull-secrets`
