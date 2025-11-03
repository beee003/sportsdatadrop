# 🏗️ Athera AI - Project Description

## Project Name
**Athera AI** — The privacy-first sports data marketplace for AI companies.

## Tagline
> "Standardize, anonymize, and monetize sports performance videos for AI training."

---

## 🌍 Overview

Athera AI is a **two-sided marketplace** where:

* **Athletes, coaches, and sports creators** upload raw training or match videos.
* **AI startups and research labs** purchase standardized, anonymized datasets to train computer-vision models.

The platform automatically:

* Runs **video standardization pipelines** (frame rate, resolution normalization).
* Performs **privacy preservation** (face/jersey blurring).
* Extracts **pose keypoints** for ML training (via OpenPose / MediaPipe).
* Generates metadata JSON for each clip.
* Stores results in a secure bucket and lists them for enterprise buyers.

---

## 🧩 Core Features

### For Creators / Athletes
* Secure login (Supabase Auth).
* Video upload with consent form.
* Automatic privacy filtering & processing jobs (FastAPI + RunPod worker).
* Earnings dashboard with Stripe Connect payouts.

### For Companies / Startups
* Dataset marketplace interface: preview, filter, buy, or license datasets.
* Stripe Checkout for single purchases.
* Enterprise dashboard with license history & API access tokens.

### For Admins
* Review/approve standardized videos.
* Manage payouts and legal/consent logs.

---

## ⚙️ Tech Stack

| Layer      | Tool / Framework                              | Purpose                                        |
| ---------- | --------------------------------------------- | ---------------------------------------------- |
| Frontend   | **SolidStart + Tailwind + shadcn/ui**         | Fast, reactive, modern UI                      |
| Auth & DB  | **Supabase (Postgres)**                       | Users, metadata, consent, purchases            |
| Storage    | **Supabase Storage → S3**                     | Encrypted video & dataset storage              |
| Backend    | **FastAPI (Python)**                          | Video standardization & anonymization pipeline |
| Worker     | **Celery / RunPod Jobs**                      | Offload heavy ML processing                    |
| Payments   | **Stripe Connect**                            | Marketplace payments & payouts                 |
| Deployment | **Vercel (web)** + **Fly.io / Railway (API)** | Scalable & low-friction hosting               |
| Security   | **AWS KMS + Signed URLs**                     | Encryption + controlled access                 |

---

## 🖥️ Folder Structure

```
athera-ai/
├── apps/
│   ├── web/                  # SolidStart frontend
│   │   ├── routes/           # /upload /marketplace /dashboard
│   │   ├── components/       # Navbar, VideoCard, UploadForm
│   │   ├── lib/              # Supabase client, Stripe helpers
│   │   └── styles/           # Tailwind globals
│   └── api/                  # FastAPI backend
│       ├── main.py
│       ├── workers/
│       │   ├── blur_faces.py
│       │   ├── extract_pose.py
│       │   └── pipeline.py
│       └── routes/
│           ├── upload.py
│           ├── standardize.py
│           └── purchases.py
├── packages/
│   ├── ui/                   # Shared shadcn components
│   ├── db/                   # Schema + migrations
│   └── sdk/                  # Python/TS client SDK
└── infra/
    ├── docker-compose.yml
    ├── fly.toml
    ├── vercel.json
    └── stripe-webhooks/
```

---

## 🎨 Design

* Dark glassmorphism theme.
* Accent: **Mint #00FF7F**; background: **#0D0D0D**; text: **#EAEAEA**.
* Smooth Framer-Motion transitions.
* Dashboard cards for datasets & earnings.
* Video previews in 16:9 grid with "Buy Dataset" overlay.

---

## 💰 Revenue Model

* 20% commission per sale (Stripe Connect Custom accounts).
* $10–$100 per dataset.
* Future subscription API for bulk dataset access ($200–$2,000 / month).

---

## 🧠 Future Add-ons

* Automated labeling micro-tasks (pay per frame).
* Differential-privacy option for enterprise.
* Integration with **Weights & Biases** / **Hugging Face** for model benchmarking.

---

## 🎯 Goal

Ship MVP in one week — functional upload → processing → marketplace → Stripe checkout → payout — then onboard the first 5 AI sports startups.

---

## 🚀 Quick Start

### Frontend (SolidStart)
```bash
cd apps/web
npm install
npm run dev
```

### Backend (FastAPI)
```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables
```bash
# Frontend (.env)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
STRIPE_PUBLIC_KEY=...

# Backend (.env)
SUPABASE_SERVICE_KEY=...
STRIPE_SECRET_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

---

## 📝 Current MVP Status

✅ Basic upload functionality
✅ Supabase integration
✅ Marketplace UI
✅ Stripe checkout integration
⏳ Video processing pipeline (next)
⏳ Privacy anonymization (next)
⏳ Pose extraction (next)
⏳ Admin dashboard (next)

