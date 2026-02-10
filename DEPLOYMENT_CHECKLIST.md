# Quick Deployment Checklist

Use this checklist to deploy RoofManager in under 1 hour.

---

## ☑️ Pre-Deployment (5 mins)

- [ ] Code is pushed to GitHub
- [ ] Created accounts:
  - [ ] Vercel (vercel.com)
  - [ ] Railway (railway.app)
  - [ ] Supabase (supabase.com)
- [ ] Gathered API keys:
  - [ ] Paystack Live Keys
  - [ ] Hubtel Credentials
  - [ ] Email SMTP credentials

---

## ☑️ Database Setup (5 mins)

- [ ] Created Supabase project
- [ ] Copied connection string
- [ ] Ran `npx prisma migrate deploy` locally
- [ ] Verified tables exist in Supabase Dashboard

---

## ☑️ Backend Deployment (10 mins)

- [ ] Added `Procfile` to backend/
- [ ] Updated `package.json` with build scripts
- [ ] Deployed to Railway from GitHub
- [ ] Added all environment variables to Railway
- [ ] Generated Railway domain
- [ ] Tested backend: `https://your-app.up.railway.app/api/health`

---

## ☑️ Frontend Deployment (10 mins)

- [ ] Created `.env.production` with Railway API URL
- [ ] Deployed to Vercel from GitHub
- [ ] Added environment variables to Vercel
- [ ] Got Vercel URL: `https://your-app.vercel.app`
- [ ] Updated Railway `FRONTEND_URL` variable

---

## ☑️ Webhook Configuration (5 mins)

- [ ] Added Paystack webhook URL in dashboard
- [ ] Added webhook secret to Railway
- [ ] Tested payment flow with test card

---

## ☑️ Testing (15 mins)

- [ ] Registered test company account
- [ ] Created lead → quote → estimate
- [ ] Generated PDF quote
- [ ] Created invoice → tested payment
- [ ] Checked email notifications
- [ ] Sent test SMS via Hubtel
- [ ] Accessed customer portal

---

## ☑️ Go Live (5 mins)

- [ ] Switched to Paystack live keys
- [ ] Activated Hubtel live account
- [ ] Loaded Hubtel credit (GHS 20+)
- [ ] Did final end-to-end test
- [ ] Invited first real customer!

---

## 🎯 You're Live!

Total time: **~55 minutes**

Your app is now at: `https://roofmanager.vercel.app`

---

## 🚨 Quick Troubleshooting

**Frontend shows "Cannot connect to server"?**
→ Check `NEXT_PUBLIC_API_URL` in Vercel matches Railway URL

**Database errors?**
→ Verify `DATABASE_URL` in Railway, run migrations again

**Payments not working?**
→ Using live keys? Webhook URL correct? Check Railway logs

**SMS not sending?**
→ Hubtel has credit? Sender ID approved? Phone format: 233XXXXXXXXX

---

## 📞 Support

If stuck, check:
1. Railway logs (Deployments tab)
2. Vercel logs (Functions tab)
3. Supabase logs (Reports tab)

**Need help?** Check the detailed `DEPLOYMENT_GUIDE.md`
