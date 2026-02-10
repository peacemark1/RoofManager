# RoofManager Deployment Guide

Complete guide to deploy RoofManager to production using free-tier services.

---

## 🌍 Deployment Stack (All Free Tiers!)

| Service | Purpose | Free Tier | Ghana Friendly? |
|---------|---------|-----------|-----------------|
| **Vercel** | Frontend hosting | Unlimited | ✅ Yes |
| **Railway** | Backend API | 500 hours/month | ✅ Yes |
| **Supabase** | PostgreSQL Database | 500MB | ✅ Yes |
| **Cloudinary** | Image storage | 25GB | ✅ Yes |
| **Paystack** | Payments | Pay per transaction | ✅ Ghana-based! |
| **Hubtel** | SMS | Pay per SMS | ✅ Ghana-based! |

**Total Monthly Cost**: GHS 0 (until you get customers, then only transaction fees!)

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

- [ ] GitHub account
- [ ] Code pushed to a GitHub repository
- [ ] Vercel account (sign up with GitHub)
- [ ] Railway account (sign up with GitHub)
- [ ] Supabase account (sign up with GitHub)
- [ ] Paystack account (already have from Phase 6)
- [ ] Hubtel account (from Phase 7)
- [ ] Domain name (optional, but recommended - roofmanager.gh from GH¢50/year)

---

## STEP 1: Database Deployment (Supabase)

**Time**: 5 minutes

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click **"Start your project"** → Sign in with GitHub
3. Click **"New Project"**
4. Fill in:
   - Name: `roofmanager-db`
   - Database Password: (generate a strong password - save it!)
   - Region: **Singapore** (closest to Ghana with good speeds)
5. Click **"Create new project"** (takes ~2 minutes)

### 1.2 Get Connection String

1. In your Supabase project, go to **Settings → Database**
2. Scroll to **Connection string → URI**
3. Copy the connection string (looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with the password you created
5. **Save this** - you'll need it for Railway

### 1.3 Run Database Migrations

On your local machine:

```bash
cd C:\Users\USER\roofing\backend

# Install Prisma CLI if not already installed
npm install -g prisma

# Update .env with Supabase connection string
echo DATABASE_URL="your-supabase-connection-string" > .env

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

✅ **Database is ready!**

---

## STEP 2: Backend Deployment (Railway)

**Time**: 10 minutes

### 2.1 Prepare Backend for Deployment

1. Create `backend/.gitignore` if not exists:
```
node_modules/
.env
dist/
*.log
```

2. Create `backend/Procfile`:
```
web: node server.js
```

3. Update `backend/package.json` - add scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "npx prisma generate",
    "postinstall": "npx prisma generate"
  }
}
```

4. Commit and push to GitHub:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Deploy to Railway

1. Go to https://railway.app
2. Click **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Select your `roofing` repository
4. Railway will detect it's a Node.js project
5. Click **"Add variables"** and add all environment variables:

```bash
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production

# Paystack
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_WEBHOOK_SECRET=your-webhook-secret

# Hubtel SMS
HUBTEL_CLIENT_ID=your-client-id
HUBTEL_CLIENT_SECRET=your-client-secret
HUBTEL_SENDER_ID=RoofManager

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=RoofManager <noreply@roofmanager.com>

# Frontend URL (will update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app
```

6. Click **"Deploy"**
7. Railway will build and deploy (takes ~3 minutes)
8. Once deployed, go to **Settings → Networking → Generate Domain**
9. Copy your Railway URL: `https://roofmanager-production.up.railway.app`

✅ **Backend is live!**

---

## STEP 3: Frontend Deployment (Vercel)

**Time**: 10 minutes

### 3.1 Prepare Frontend

1. Update `frontend/.env.local` → rename to `frontend/.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://roofmanager-production.up.railway.app/api
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
```

2. Create `frontend/vercel.json` (optional, for custom config):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

3. Push to GitHub:
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 3.2 Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New..." → "Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://roofmanager-production.up.railway.app/api
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   ```
7. Click **"Deploy"** (takes ~3 minutes)
8. Once deployed, Vercel gives you a URL: `https://roofmanager.vercel.app`

### 3.3 Update Backend with Frontend URL

1. Go back to **Railway**
2. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://roofmanager.vercel.app
   ```
3. Railway will automatically redeploy

✅ **Frontend is live!**

---

## STEP 4: Configure Webhooks

### 4.1 Paystack Webhook

1. Go to https://dashboard.paystack.com/#/settings/developer
2. Add webhook URL:
   ```
   https://roofmanager-production.up.railway.app/api/payments/webhook/paystack
   ```
3. Copy the webhook secret
4. Add to Railway environment variables:
   ```
   PAYSTACK_WEBHOOK_SECRET=whsec_xxxxx
   ```

### 4.2 Test Paystack Integration

1. Go to your live app: `https://roofmanager.vercel.app`
2. Create a test invoice
3. Use Paystack test card: `5531 8866 5214 2950`
4. Verify payment is processed

✅ **Payments are live!**

---

## STEP 5: Custom Domain (Optional but Recommended)

### 5.1 Buy Ghana Domain

1. Go to https://internetghana.com or https://domains.google
2. Search for `roofmanager.gh` or `roofmanager.com.gh`
3. Purchase (GH¢50-150/year)

### 5.2 Configure Domain in Vercel

1. In Vercel project → **Settings → Domains**
2. Add your domain: `roofmanager.gh` and `www.roofmanager.gh`
3. Vercel will give you nameserver records
4. Update your domain's DNS settings with those nameservers
5. Wait 24-48 hours for DNS propagation

### 5.3 Update Environment Variables

Update in both Railway and Vercel:
```
FRONTEND_URL=https://roofmanager.gh
```

✅ **Custom domain is live!**

---

## STEP 6: Post-Deployment Testing

### Test Checklist:

- [ ] Open `https://roofmanager.vercel.app` (or your domain)
- [ ] Register a new company account
- [ ] Create a lead
- [ ] Convert lead to quote
- [ ] Test AI estimation
- [ ] Generate PDF quote
- [ ] Create invoice
- [ ] Test Paystack payment (use test card)
- [ ] Check email notifications
- [ ] Test SMS with Hubtel (use your Ghana number)
- [ ] Access customer portal via token link
- [ ] Test PWA on mobile (Add to Home Screen)

---

## STEP 7: Switch to Production Mode

### 7.1 Paystack Live Keys

1. In Paystack Dashboard → **Settings → API Keys**
2. Activate your account (requires business verification)
3. Copy **Live Secret Key** and **Live Public Key**
4. Update in Railway and Vercel:
   ```
   PAYSTACK_SECRET_KEY=sk_live_xxxxx
   PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   ```

### 7.2 Hubtel Live Credentials

1. Activate your Hubtel account
2. Load credit (minimum GHS 20)
3. Already using live credentials? You're good!

### 7.3 Email Production Setup

For better email deliverability, use:
- **SendGrid** (free 100 emails/day) or
- **Amazon SES** (free 62,000 emails/month)

Instead of Gmail (which may have sending limits).

---

## 📊 Monitoring & Maintenance

### Railway Monitoring
- Check **Metrics** tab for CPU/Memory usage
- Review **Deployments** for errors
- Set up **Alerts** for downtime

### Vercel Analytics
- Enable **Vercel Analytics** for free
- Track page views, performance, errors

### Database Monitoring
- Supabase Dashboard → **Reports**
- Check database size (500MB free tier)
- Monitor active connections

---

## 🚨 Troubleshooting

### Frontend can't connect to backend?
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Verify Railway backend is running
- Check CORS settings in backend

### Database connection errors?
- Verify `DATABASE_URL` in Railway
- Check Supabase project is active
- Run `npx prisma generate` after changes

### Paystack payments not working?
- Verify you're using **live keys** (not test keys)
- Check webhook URL is correct
- Look for errors in Railway logs

### SMS not sending?
- Check Hubtel credit balance
- Verify sender ID is approved
- Check phone number format (233XXXXXXXXX)

---

## 💰 Cost Breakdown

### Free Tier Limits:
- **Vercel**: 100GB bandwidth, unlimited deploys
- **Railway**: 500 execution hours/month (enough for 24/7)
- **Supabase**: 500MB database, 2GB bandwidth

### When You Exceed Free Tiers:
- **Railway**: $5/month for 500 more hours
- **Supabase**: $25/month for 8GB database
- **Vercel**: Still free (very generous limits)

### Transaction Costs:
- **Paystack**: 1.95% + GHS 0.20 per transaction
- **Hubtel SMS**: GHS 0.035 per SMS

**Example**: 100 jobs/month with GHS 2,000 average:
- Revenue: GHS 200,000
- Paystack fees: ~GHS 4,300
- SMS costs: ~GHS 10
- Hosting: GHS 0 (still in free tier!)

---

## 🎉 You're Live!

Your RoofManager SaaS is now:
- ✅ Accessible worldwide at a custom domain
- ✅ Processing real payments with Paystack
- ✅ Sending SMS via Hubtel
- ✅ Backed by production database
- ✅ Auto-scaling and monitored

**Next steps**:
1. Test everything thoroughly
2. Invite your first customer (maybe a roofing company you know?)
3. Gather feedback and iterate
4. Market to roofing companies in Ghana!

**akpe** (thank you in Ewe)! You've built something amazing! 🚀🇬🇭
