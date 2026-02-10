# Local Development Guide - Run RoofManager on Your Computer

Complete guide to run RoofManager locally before deploying.

---

## 🎯 What You'll Do

1. Set up local PostgreSQL database
2. Configure environment variables
3. Run backend API server
4. Run frontend Next.js app
5. Test the full application locally

**Time**: ~20 minutes

---

## ✅ Prerequisites

Make sure you have installed:

- [ ] **Node.js** (v18 or higher) - Download from nodejs.org
- [ ] **PostgreSQL** (v14 or higher) - Download from postgresql.org
- [ ] **Git** (already have it)
- [ ] **Code Editor** (VS Code recommended)

---

## STEP 1: Install PostgreSQL Locally

### Option A: PostgreSQL (Recommended)

1. **Download PostgreSQL**:
   - Go to https://www.postgresql.org/download/windows/
   - Download the installer for Windows
   - Run the installer

2. **During Installation**:
   - Password: Create a password (e.g., `postgres123`)
   - Port: Use default `5432`
   - Install pgAdmin (checkbox enabled)

3. **Verify Installation**:
```bash
# Open PowerShell and run:
psql --version
# Should show: psql (PostgreSQL) 14.x
```

### Option B: Use Supabase (Easier!)

If you don't want to install PostgreSQL locally:

1. Go to https://supabase.com
2. Create a free project
3. Get connection string from Settings → Database
4. Use that connection string in your `.env` file

---

## STEP 2: Create Local Database

### If using local PostgreSQL:

```bash
# Open PowerShell and connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE roofmanager;

# Quit
\q
```

Your connection string will be:
```
postgresql://postgres:postgres123@localhost:5432/roofmanager
```

---

## STEP 3: Set Up Backend Environment

1. **Navigate to backend folder**:
```bash
cd C:\Users\USER\roofing\backend
```

2. **Create `.env` file**:
```bash
# Create new file
New-Item -Path .env -ItemType File
```

3. **Edit `.env` and add**:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/roofmanager"

# JWT Secret (use any random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-random-string-12345"

# Server
PORT=3001
NODE_ENV=development

# Paystack (TEST MODE - use test keys)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxx

# Hubtel (TEST MODE - optional for now)
HUBTEL_CLIENT_ID=your-test-client-id
HUBTEL_CLIENT_SECRET=your-test-client-secret
HUBTEL_SENDER_ID=RoofManager

# Email (Gmail - optional for now)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="RoofManager <noreply@roofmanager.com>"

# Frontend URL
FRONTEND_URL=http://localhost:3000

# AI (Ollama - optional)
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

4. **Install dependencies**:
```bash
npm install
```

5. **Run database migrations**:
```bash
npx prisma migrate dev --name init
```

6. **Generate Prisma Client**:
```bash
npx prisma generate
```

7. **Seed database (optional - adds test data)**:
```bash
npx prisma db seed
```

---

## STEP 4: Set Up Frontend Environment

1. **Navigate to frontend folder**:
```bash
cd C:\Users\USER\roofing\frontend
```

2. **Create `.env.local` file**:
```bash
New-Item -Path .env.local -ItemType File
```

3. **Edit `.env.local` and add**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

4. **Install dependencies**:
```bash
npm install
```

---

## STEP 5: Start the Servers

### Terminal 1 - Backend:

```bash
cd C:\Users\USER\roofing\backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 Database connected
```

### Terminal 2 - Frontend:

```bash
cd C:\Users\USER\roofing\frontend
npm run dev
```

You should see:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
- Ready in 2.5s
```

---

## STEP 6: Open Your App!

1. **Open browser** and go to: http://localhost:3000

2. **You should see**: The RoofManager landing page!

3. **Register a new account**:
   - Click "Sign Up" or go to http://localhost:3000/register
   - Create your first company account
   - You'll be redirected to the dashboard

---

## 🧪 Test the Full Application

### Test Checklist:

#### 1. Authentication
- [ ] Register new company account
- [ ] Login with credentials
- [ ] See the dashboard

#### 2. Leads Management
- [ ] Go to "Leads" page
- [ ] Click "Add Lead"
- [ ] Fill in lead details
- [ ] View in table and kanban views
- [ ] Edit a lead
- [ ] Change lead status

#### 3. Jobs
- [ ] Go to "Jobs" page
- [ ] Create a new job
- [ ] View job details
- [ ] Change job status

#### 4. AI Estimation
- [ ] Go to "Estimates" → "Create"
- [ ] Fill in roof parameters
- [ ] Click "Generate AI Estimate" (if Ollama is running)
- [ ] Or click "Calculate Manually"
- [ ] See the estimate results

#### 5. Quotes
- [ ] Go to "Quotes"
- [ ] Create a new quote
- [ ] View quote details
- [ ] Change quote status

#### 6. Invoices
- [ ] Go to "Invoices"
- [ ] Create an invoice
- [ ] View invoice list
- [ ] Filter by status

#### 7. Payments (Test Mode)
- [ ] Click "Pay" on an invoice
- [ ] Payment modal should open
- [ ] Use Paystack test card:
   - Card: `5531 8866 5214 2950`
   - CVV: `123`
   - Expiry: Any future date
   - PIN: `1234`
   - OTP: `123456`
- [ ] Payment should succeed
- [ ] Invoice status should update to "paid"

#### 8. Dashboard Analytics
- [ ] Go to "Dashboard"
- [ ] See revenue stats
- [ ] See pipeline overview
- [ ] See recent activity

---

## 🐛 Troubleshooting

### Backend won't start?

**Error: "Database connection failed"**
→ Check PostgreSQL is running
→ Verify connection string in `.env`
→ Run: `psql -U postgres` to test connection

**Error: "Port 3001 already in use"**
→ Kill the process: `Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process`
→ Or change PORT in `.env`

**Error: "Prisma schema not found"**
→ Run: `npx prisma generate`

### Frontend won't start?

**Error: "Cannot connect to backend"**
→ Check backend is running on port 3001
→ Verify `NEXT_PUBLIC_API_URL` in `.env.local`

**Error: "Module not found"**
→ Delete `node_modules` and run `npm install` again

**Error: "Port 3000 already in use"**
→ Run: `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process`

### Database issues?

**Want to reset database?**
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

**Want to view database?**
```bash
npx prisma studio
# Opens database viewer at http://localhost:5555
```

---

## 📊 View Your Database (Prisma Studio)

While backend is running, open a new terminal:

```bash
cd C:\Users\USER\roofing\backend
npx prisma studio
```

This opens a beautiful database viewer at http://localhost:5555 where you can:
- See all your tables
- Browse data
- Edit records
- Add test data

---

## 🎨 Optional: Test with Sample Data

Want to populate your database with test data?

1. **Create** `backend/prisma/seed.js`:

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create test company
  const company = await prisma.company.create({
    data: {
      name: 'Test Roofing Co.',
      email: 'admin@testroofing.com',
      phone: '0244123456',
      address: 'Accra, Ghana'
    }
  })

  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'admin@testroofing.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      companyId: company.id
    }
  })

  // Create test leads
  await prisma.lead.createMany({
    data: [
      {
        companyId: company.id,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '0244111111',
        address: '123 Oxford St, Osu, Accra',
        source: 'website',
        status: 'new',
        estimatedValue: 5000
      },
      {
        companyId: company.id,
        name: 'Michael Brown',
        email: 'michael@example.com',
        phone: '0244222222',
        address: '456 Cantonments Rd, Accra',
        source: 'referral',
        status: 'contacted',
        estimatedValue: 8000
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

2. **Run the seed**:
```bash
node prisma/seed.js
```

3. **Login** with:
   - Email: `admin@testroofing.com`
   - Password: `password123`

---

## 🎯 Next Steps

Once you've tested locally and everything works:

1. ✅ **Fix any bugs** you find
2. ✅ **Test all features** thoroughly
3. ✅ **Add your real business info** in settings
4. ✅ **Take screenshots** for marketing
5. ✅ **Deploy to production** using `DEPLOYMENT_GUIDE.md`

---

## 💡 Pro Tips

### Keep Backend and Frontend Running:
- Use 2 terminal windows side-by-side
- Or use VS Code split terminal (Ctrl + Shift + `)

### Auto-Reload:
- Backend auto-reloads on file changes (using nodemon)
- Frontend auto-reloads on file changes (Next.js default)

### Debug Mode:
Add this to backend `.env` for detailed logs:
```env
DEBUG=true
LOG_LEVEL=debug
```

### Test Emails Locally:
Use **Mailtrap** (mailtrap.io) for testing emails without sending real ones.

---

## 🎉 You're Running Locally!

Your RoofManager is now running on:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Database**: http://localhost:5555 (Prisma Studio)

Enjoy exploring what you built! 🚀
