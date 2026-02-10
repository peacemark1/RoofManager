# Quick Local Setup Checklist

Run RoofManager on your computer in 20 minutes.

---

## 📋 Checklist

### Prerequisites (5 mins)
- [ ] Node.js installed (check: `node --version`)
- [ ] PostgreSQL installed OR Supabase account created
- [ ] Code editor open (VS Code)

### Database Setup (5 mins)
- [ ] PostgreSQL running
- [ ] Created database: `roofmanager`
- [ ] Connection string ready

### Backend Setup (5 mins)
- [ ] Created `backend/.env` file
- [ ] Added all required variables
- [ ] Ran `npm install` in backend/
- [ ] Ran `npx prisma migrate dev`
- [ ] Ran `npx prisma generate`

### Frontend Setup (3 mins)
- [ ] Created `frontend/.env.local` file
- [ ] Added API URL and Paystack key
- [ ] Ran `npm install` in frontend/

### Start Servers (2 mins)
- [ ] Terminal 1: `cd backend && npm run dev` ✅
- [ ] Terminal 2: `cd frontend && npm run dev` ✅
- [ ] Opened http://localhost:3000 in browser

### Test Application (10 mins)
- [ ] Registered new account
- [ ] Created a lead
- [ ] Created a job
- [ ] Generated estimate
- [ ] Created quote
- [ ] Created invoice
- [ ] Tested payment (test card)

---

## 🚀 Quick Commands

### Start Backend:
```bash
cd C:\Users\USER\roofing\backend
npm run dev
```

### Start Frontend:
```bash
cd C:\Users\USER\roofing\frontend
npm run dev
```

### View Database:
```bash
cd C:\Users\USER\roofing\backend
npx prisma studio
```

---

## 🐛 Quick Fixes

**Backend won't start?**
```bash
cd backend
npx prisma generate
npm run dev
```

**Frontend won't connect?**
→ Check `NEXT_PUBLIC_API_URL=http://localhost:3001/api` in frontend/.env.local

**Database errors?**
```bash
cd backend
npx prisma migrate reset
```

---

## 🎯 URLs

- **App**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Database UI**: http://localhost:5555 (run `npx prisma studio`)

---

## ✅ You're Ready!

Once everything works locally:
→ Follow `DEPLOYMENT_GUIDE.md` to go live!
