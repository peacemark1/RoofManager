# RoofManager Deployment Guide

Complete deployment strategy using free/low-cost services.

---

## Deployment Architecture

```
┌─────────────────┐
│   Vercel        │  Frontend (Next.js)
│   (Free Tier)   │  
└────────┬────────┘
         │
         │ API Calls
         │
┌────────▼────────┐
│   Railway       │  Backend (Express.js + Prisma)
│   (Free $5/mo)  │  
└────────┬────────┘
         │
         ├─────────────────────┐
         │                     │
┌────────▼────────┐   ┌────────▼────────┐
│   Supabase      │   │   Cloudinary    │
│   (Free Tier)   │   │   (Free Tier)   │
│   PostgreSQL    │   │   Image Storage │
└─────────────────┘   └─────────────────┘

Additional Services:
- Stripe (Test Mode) - Payments
- SendGrid (Free Tier) - Emails
- Ollama (Self-hosted or Modal.com) - AI
```

---

## 1. Local Development Setup

### Prerequisites

```bash
# Install Node.js 20+
node --version  # Should be v20+

# Install PostgreSQL locally (or use Docker)
# Option 1: Local install
# Windows: Download from postgresql.org
# Mac: brew install postgresql@15
# Linux: sudo apt-get install postgresql-15

# Option 2: Docker
docker run --name roofmanager-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Install Ollama (for AI)
# Download from ollama.ai
ollama pull qwen3-coder:30b
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
# DATABASE_URL="postgresql://postgres:password@localhost:5432/roofmanager"
# JWT_SECRET=your-random-secret-key
# OLLAMA_URL=http://localhost:11434

# Run Prisma migrations
npx prisma migrate dev --name init
npx prisma generate

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Start development server
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Prisma Studio: `npx prisma studio`

---

## 2. Database Deployment (Supabase)

### Create Supabase Project

1. Go to https://supabase.com
2. Sign in with GitHub
3. Click "New Project"
4. Project Name: `roofmanager`
5. Database Password: Generate strong password
6. Region: Choose closest to your users
7. Plan: Free tier (500MB database, 2GB bandwidth)

### Get Connection String

1. In Supabase dashboard → Settings → Database
2. Copy "Connection string" (Transaction mode)
3. Replace `[YOUR-PASSWORD]` with your database password

**Example:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijk.supabase.co:5432/postgres
```

### Run Migrations

```bash
# In backend directory
# Update .env with Supabase connection string
DATABASE_URL="postgresql://postgres:password@db.abcdefghijk.supabase.co:5432/postgres"

# Run migrations on Supabase
npx prisma migrate deploy

# Generate client
npx prisma generate
```

---

## 3. Backend Deployment (Railway)

### Why Railway?
- Free $5/month credit
- Easy deployment from GitHub
- Built-in PostgreSQL (optional)
- Automatic HTTPS

### Setup

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Root directory: `backend`

### Environment Variables

In Railway dashboard → Variables, add:

```bash
# Database (use Supabase URL)
DATABASE_URL=postgresql://postgres:password@db.abcdefghijk.supabase.co:5432/postgres

# Server
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-production-key

# Ollama (use Modal.com or self-hosted)
OLLAMA_URL=https://your-ollama-endpoint.com
OLLAMA_MODEL=qwen3-coder:30b

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@roofmanager.com

# SMS
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Storage
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Frontend URL
FRONTEND_URL=https://roofmanager.vercel.app
```

### Build Settings

Railway auto-detects Node.js projects. If needed:

**Start Command:**
```bash
npm run start
```

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

### Get Railway URL

After deployment, Railway provides a URL like:
```
https://backend-production-abc123.up.railway.app
```

---

## 4. Frontend Deployment (Vercel)

### Why Vercel?
- Made for Next.js
- Automatic deployments from GitHub
- Free tier (100GB bandwidth)
- Global CDN
- Automatic HTTPS

### Setup

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Root Directory: `frontend`
6. Framework Preset: Next.js (auto-detected)

### Environment Variables

In Vercel → Settings → Environment Variables:

```bash
# Backend API (Railway URL)
NEXT_PUBLIC_API_URL=https://backend-production-abc123.up.railway.app/api

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Build Settings

Vercel auto-configures Next.js. Default settings:

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Custom Domain (Optional)

1. In Vercel → Settings → Domains
2. Add your domain: `app.roofmanager.com`
3. Update DNS records as instructed
4. SSL certificate auto-generated

---

## 5. AI Deployment (Ollama on Modal)

Since Ollama requires GPU, you can't run it on typical free hosting. Options:

### Option A: Modal.com (Serverless GPU)

**Setup:**

1. Sign up at https://modal.com (generous free tier)
2. Create `backend/ai/modal_ollama.py`:

```python
import modal

stub = modal.Stub("roofmanager-ollama")

@stub.function(
    image=modal.Image.debian_slim().pip_install("ollama"),
    gpu="any",
    timeout=300
)
@modal.web_endpoint()
def generate_estimate(job_data: dict):
    import ollama
    
    response = ollama.chat(
        model='qwen3-coder:30b',
        messages=[{
            'role': 'user',
            'content': f'''Generate estimate for: {job_data}'''
        }]
    )
    
    return response['message']['content']
```

3. Deploy:
```bash
modal deploy backend/ai/modal_ollama.py
```

4. Update `OLLAMA_URL` in Railway to Modal endpoint

### Option B: Self-Host on Home PC

Run Ollama on your local machine and expose via Cloudflare Tunnel:

```bash
# On your PC with GPU
ollama serve

# Install Cloudflare Tunnel
cloudflared tunnel create roofmanager-ai
cloudflared tunnel route dns roofmanager-ai ollama.yourdomain.com
cloudflared tunnel run roofmanager-ai --url http://localhost:11434
```

Update `OLLAMA_URL` to `https://ollama.yourdomain.com`

### Option C: Fallback Only

Disable AI, use rule-based estimation by setting:
```bash
USE_AI_ESTIMATION=false
```

---

## 6. File Storage (Cloudinary)

### Setup

1. Go to https://cloudinary.com
2. Sign up (free tier: 25GB storage, 25GB bandwidth/month)
3. Dashboard → Settings → Access Keys
4. Copy: Cloud Name, API Key, API Secret

### Configure Backend

In `backend/utils/upload.js`:

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadPhoto(file, folder) {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: `roofmanager/${folder}`,
    resource_type: 'auto'
  });
  
  return result.secure_url;
}

module.exports = { uploadPhoto };
```

---

## 7. Email Setup (SendGrid)

### Setup

1. Go to https://sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Create API Key:
   - Settings → API Keys → Create API Key
   - Full Access
4. Verify sender email:
   - Settings → Sender Authentication → Verify Single Sender
   - Use `noreply@yourdomain.com`

### Configure Backend

Already set up in `backend/notifications/email.js` - just add env vars:

```bash
SENDGRID_API_KEY=SG.abc123...
FROM_EMAIL=noreply@yourdomain.com
```

---

## 8. SMS Setup (Twilio)

### Setup

1. Go to https://twilio.com
2. Sign up (free trial: 500 SMSs, test numbers only)
3. Get credentials:
   - Console → Account SID
   - Auth Token
   - Phone Number (trial or buy one for $1/month)

### Configure Backend

```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 9. Payment Setup (Stripe)

### Setup

1. Go to https://stripe.com
2. Sign up (free, pay-as-you-go)
3. Get API keys:
   - Developers → API Keys
   - Copy Publishable Key (pk_test_...) and Secret Key (sk_test_...)

### Configure

**Backend (Railway):**
```bash
STRIPE_SECRET_KEY=sk_test_...
```

**Frontend (Vercel):**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Webhook Setup

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-railway-url.railway.app/api/payments/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy Webhook Secret (whsec_...)
5. Add to Railway:
```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 10. CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      # Backend tests
      - name: Test Backend
        run: |
          cd backend
          npm install
          npm run test
      
      # Frontend tests
      - name: Test Frontend
        run: |
          cd frontend
          npm install
          npm run lint
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: echo "Railway auto-deploys on push"
      
      - name: Deploy to Vercel
        run: echo "Vercel auto-deploys on push"
```

---

## 11. Monitoring & Error Tracking (Sentry)

### Setup

1. Go to https://sentry.io
2. Sign up (free tier: 5K errors/month)
3. Create project: `roofmanager`
4. Copy DSN

### Backend

```bash
npm install @sentry/node

# In backend/server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Frontend

```bash
npx @sentry/wizard@latest -i nextjs

# Follow wizard prompts
```

---

## 12. Production Checklist

Before going live:

### Security
- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (64+ random characters)
- [ ] Enable HTTPS only (enforced by Vercel/Railway)
- [ ] Set up rate limiting (already in server.js)
- [ ] Add Helmet.js security headers (already configured)
- [ ] Validate all user inputs
- [ ] Sanitize database queries (Prisma does this)

### Performance
- [ ] Enable Next.js image optimization
- [ ] Set up CDN for static assets (Vercel does this)
- [ ] Add database indexes (already in Prisma schema)
- [ ] Enable Prisma connection pooling
- [ ] Set up Redis for caching (optional)

### Monitoring
- [ ] Configure Sentry error tracking
- [ ] Set up uptime monitoring (UptimeRobot, free)
- [ ] Enable Railway/Vercel analytics
- [ ] Monitor database performance (Supabase dashboard)

### Backup
- [ ] Enable automatic Supabase backups (Settings → Database → Backups)
- [ ] Export Prisma schema to version control
- [ ] Document environment variables

### Testing
- [ ] Test all user flows end-to-end
- [ ] Test on mobile devices
- [ ] Test PWA offline functionality
- [ ] Test payment flow (Stripe test mode)
- [ ] Test email delivery
- [ ] Test multi-tenant isolation

---

## 13. Cost Breakdown (Monthly)

All services on **free tier** initially:

| Service | Free Tier | Upgrade Cost |
|---------|-----------|--------------|
| **Supabase** | 500MB DB, 2GB bandwidth | $25/mo (Pro) |
| **Railway** | $5 credit/mo | $0.000463/min |
| **Vercel** | 100GB bandwidth | $20/mo (Pro) |
| **Cloudinary** | 25GB storage | $89/mo (Plus) |
| **SendGrid** | 100 emails/day | $19.95/mo (Essentials) |
| **Twilio** | Trial only | $1/mo + $0.0075/SMS |
| **Stripe** | Free | 2.9% + $0.30 per transaction |
| **Sentry** | 5K errors/mo | $26/mo (Team) |

**Total Initial Cost:** ~$0-6/month (Railway credit)

**Estimated for 50 users:** ~$100-150/month

---

## 14. Scaling Strategy

### Stage 1: MVP (0-10 companies)
- Use all free tiers
- Self-host AI on local PC

### Stage 2: Growth (10-100 companies)
- Upgrade Supabase to Pro ($25)
- Railway autoscales (pay per usage)
- Move AI to Modal.com ($10-30/mo)

### Stage 3: Scale (100-1000 companies)
- Migrate to dedicated database (AWS RDS)
- Add Redis caching
- Set up load balancer
- Multi-region deployment

---

## Deployment Complete! 🚀

Your RoofManager SaaS is now live with:

✅ Global CDN (Vercel)  
✅ Scalable backend (Railway)  
✅ Managed database (Supabase)  
✅ AI-powered estimates (Ollama/Modal)  
✅ Payment processing (Stripe)  
✅ Email & SMS (SendGrid/Twilio)  
✅ Error tracking (Sentry)  
✅ CI/CD (GitHub Actions)  

**Production URLs:**
- Frontend: `https://roofmanager.vercel.app`
- Backend API: `https://backend-production-abc123.up.railway.app`
- Database: Managed by Supabase

**Next Steps:**
1. Configure custom domain
2. Test all features in production
3. Onboard first customers
4. Monitor performance and errors
5. Iterate based on feedback
