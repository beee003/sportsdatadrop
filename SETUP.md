# 🚀 SportsDataDrop Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Stripe account (for payments)

## Step 1: Install Dependencies

```bash
cd sportsdatadrop
npm install
```

## Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Storage** → Create a bucket named `videos` (public)
4. Go to **Settings** → **API** → Copy your:
   - Project URL
   - `anon` public key

## Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   STRIPE_PUBLIC_KEY=pk_test_...
   ```

## Step 4: Set Up Stripe (No-Code Method)

### Option A: Stripe Payment Links (Easiest for MVP)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Products**
2. Create a new product called "Sports Video Dataset"
3. Set the price (you can adjust per video later)
4. Create a **Payment Link**
5. Copy the Payment Link URL
6. Update `src/lib/stripe.ts` with your Payment Link:
   ```ts
   export const getCheckoutUrl = (videoId: string, price: number) => {
     return `YOUR_STRIPE_PAYMENT_LINK_HERE?client_reference_id=${videoId}`;
   };
   ```

### Option B: Full Stripe Integration (Advanced)

For production, you'll want to:
- Create a backend API endpoint for Stripe Checkout sessions
- Handle webhooks for payment confirmations
- Automatically send download links after payment

## Step 5: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` (or the port shown in terminal)

### Local Preview with Vercel Secrets

If you've already deployed to Vercel and want to test the production build locally with the same secrets:

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project (if not already linked):
   ```bash
   vercel link
   ```

4. Pull secrets from Vercel:
   ```bash
   npm run pull-secrets
   ```
   This will create a `.env.local` file with your Vercel environment variables.

5. Build and preview:
   ```bash
   npm run build
   npm run preview
   ```

The `.env.local` file is automatically ignored by git (see `.gitignore`) and will be used during preview builds.

## Step 6: Test the Flow

1. **Upload**: Go to `/upload` and upload a test video
2. **Marketplace**: Check `/marketplace` to see your video
3. **Purchase**: Click "Buy Dataset" to test Stripe checkout

## 🚢 Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `STRIPE_PUBLIC_KEY`
5. Deploy!

## 📝 Next Steps

- [ ] Add user authentication (Supabase Auth)
- [ ] Implement Stripe webhooks for automatic fulfillment
- [ ] Add video thumbnails generation
- [ ] Add analytics (Plausible, etc.)
- [ ] Set up email notifications (Supabase Edge Functions)
- [ ] Add video preview/playback in marketplace

## 🐛 Troubleshooting

### Videos not showing in marketplace?
- Check Supabase Storage bucket permissions
- Verify RLS policies are set correctly
- Check browser console for errors

### Upload failing?
- Verify Supabase credentials in `.env`
- Check Storage bucket exists and is public
- Ensure `videos` table exists in Supabase

### Stripe checkout not working?
- Verify Payment Link URL is correct
- Check Stripe is in test mode if using test keys
- Ensure Payment Link is active in Stripe dashboard
