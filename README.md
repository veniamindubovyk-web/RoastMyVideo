# 🎬 RoastMyVideo

AI-powered YouTube video analyzer. Get brutal honest feedback on why your video isn't working.

## Deploy to Vercel (FREE) — 5 steps

### Step 1 — Create GitHub account
Go to github.com → Sign up (free)

### Step 2 — Upload this project to GitHub
1. Click "+" → "New repository"
2. Name it "roastmyvideo"
3. Click "Create repository"
4. Upload all these files

### Step 3 — Create Vercel account
Go to vercel.com → Sign up with GitHub (free)

### Step 4 — Deploy
1. Click "Add New Project"
2. Select your "roastmyvideo" repository
3. Click "Deploy"

### Step 5 — Add your API keys
In Vercel dashboard:
1. Go to your project → "Settings" → "Environment Variables"
2. Add: YOUTUBE_API_KEY = your key
3. Add: ANTHROPIC_API_KEY = your key
4. Click "Redeploy"

Your site will be live at: https://roastmyvideo.vercel.app

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```
