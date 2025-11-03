# SportsDataDrop MVP

Monetize your sports videos - AI startups pay for your data.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase and Stripe keys

# Run development server
npm run dev

# Build for production
npm run build
npm run start

# Local preview with Vercel secrets
npm run pull-secrets  # Pull secrets from Vercel
npm run build
npm run preview
```

## 🛠 Tech Stack

- **SolidStart** - Framework
- **Supabase** - Database & Storage
- **Stripe** - Payments
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
├── routes/          # Page routes
├── lib/             # Utilities (Supabase, Stripe)
└── styles/          # Global styles
```

## 🎨 Design System

- **Background**: `#0d0d0d`
- **Accent**: `#00FF7F` (mint green)
- **Text**: `#EAEAEA`
- **Glass blur effects**: `bg-white/5`, `backdrop-blur-lg`

## 📝 Deployment

Deploy to Vercel:

1. Connect your GitHub repo
2. Add environment variables in Vercel dashboard
3. Deploy!

## 🔑 Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `STRIPE_PUBLIC_KEY` - Your Stripe public key
