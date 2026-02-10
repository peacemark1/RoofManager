# Building RoofManager with Kilo Code

Complete guide for implementing RoofManager using the Kilo Code extension.

---

## Overview

You have **4 comprehensive specification documents** ready for Kilo Code:

1. **database_schema.md** - Prisma schema with all models
2. **api_specification.md** - REST API endpoints with request/response examples
3. **frontend_architecture.md** - Next.js components and pages
4. **backend_implementation.md** - Express.js server, controllers, and integrations

This guide explains **how to use these specs with Kilo Code** to build the application.

---

## Implementation Strategy

### Phase 1: Backend Foundation (Days 1-3)
1. Database & Prisma setup
2. Authentication system
3. Core API endpoints
4. AI integration

### Phase 2: Frontend Core (Days 4-6)
5. Next.js setup & layouts
6. Authentication pages
7. Dashboard & lead management
8. Job management

### Phase 3: Advanced Features (Days 7-9)
9. AI-assisted estimation
10. Quote generation & PDFs
11. Payments integration
12. PWA & mobile interface

### Phase 4: Polish & Deploy (Days 10-12)
13. Analytics dashboard
14. Notifications & chatbot
15. Testing & bug fixes
16. Deployment

---

## Step-by-Step Build Instructions

### STEP 1: Initialize Project Structure

**Create the workspace:**
```bash
mkdir roofmanager
cd roofmanager
mkdir backend frontend
```

**Initialize backend:**
```bash
cd backend
npm init -y
```

**Initialize frontend (Next.js):**
```bash
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --app
# Answer: Yes to all prompts (TypeScript, ESLint, Tailwind, App Router)
```

---

### STEP 2: Setup Database with Prisma

**Using Kilo Code:**

1. Open `backend/` folder in VS Code
2. Open Kilo Code
3. Paste this prompt:

```
Create the Prisma setup for RoofManager. 

Install dependencies:
- prisma
- @prisma/client

Then create prisma/schema.prisma with the EXACT schema from the database_schema.md file (attached).

After creating the schema, initialize Prisma and generate the client.
```

4. Attach: `database_schema.md`
5. Let Kilo Code generate the files

**Expected output:**
- `package.json` with Prisma dependencies
- `prisma/schema.prisma` with full schema
- `.env` with DATABASE_URL

**Manual step:**
```bash
# Set up PostgreSQL database (local or Supabase)
# Update DATABASE_URL in .env
npx prisma migrate dev --name init
npx prisma generate
```

---

### STEP 3: Build Authentication System

**Using Kilo Code:**

Prompt:
```
Create the authentication system for RoofManager backend.

Required files:
1. backend/middleware/auth.middleware.js - JWT authentication and authorization middleware
2. backend/controllers/auth.controller.js - Register, login, and getMe controllers
3. backend/routes/auth.routes.js - Auth routes

Use the specifications from backend_implementation.md (attached) under "Authentication" section.

Dependencies needed: bcrypt, jsonwebtoken

Ensure:
- JWT tokens include userId, companyId, and role
- Passwords are hashed with bcrypt (10 rounds)
- Multi-tenant support via companyId
```

Attach: `backend_implementation.md`

---

### STEP 4: Create Express Server

**Using Kilo Code:**

Prompt:
```
Create the main Express.js server for RoofManager.

File: backend/server.js

Requirements:
- Use Express with CORS, Helmet, rate limiting
- Set up routes for: auth, leads, jobs, estimates, quotes, invoices, payments, materials, analytics, company
- Error handling middleware
- Based on the specification in backend_implementation.md (attached)

Dependencies: express, cors, helmet, express-rate-limit, dotenv
```

Attach: `backend_implementation.md`

---

### STEP 5: Build Core API Controllers

**Repeat this process for each resource:**

**For Leads:**
```
Create the leads management system.

Files needed:
1. backend/controllers/lead.controller.js
2. backend/routes/lead.routes.js

Implement these endpoints from api_specification.md (attached):
- POST /leads - Create lead
- GET /leads - List leads (with pagination, filters)
- PATCH /leads/:id - Update lead
- POST /leads/:id/convert - Convert to job

Use Prisma client, ensure multi-tenant scoping with companyId from req.
```

**For Jobs:**
```
Create the job management system including:
- backend/controllers/job.controller.js
- backend/routes/job.routes.js

Implement all job endpoints from api_specification.md (attached).
Include photo upload, crew assignment, and status updates.
```

**Pattern:** Reference `api_specification.md` and `backend_implementation.md` for each controller.

---

### STEP 6: AI Integration (Ollama)

**Using Kilo Code:**

Prompt:
```
Create the AI-powered estimation system.

File: backend/ai/estimator.js

Requirements:
- Connect to Ollama API (local LLM)
- Function: generateEstimate(jobData) returns structured estimate
- Fallback to rule-based estimation if AI fails
- Use the exact implementation from backend_implementation.md (attached)

Dependencies: axios

Then update backend/controllers/estimate.controller.js to use this AI estimator.
```

Attach: `backend_implementation.md`

---

### STEP 7: Payment Integration (Stripe)

**Using Kilo Code:**

Prompt:
```
Create Stripe payment integration.

File: backend/integrations/stripe.js

Functions needed:
- createCheckoutSession(invoice, successUrl, cancelUrl)
- handleWebhook(event)
- handlePaymentSuccess(session)

Based on backend_implementation.md (attached).

Dependencies: stripe

Also create:
- backend/controllers/payment.controller.js
- backend/routes/payment.routes.js
```

Attach: `backend_implementation.md`

---

### STEP 8: Frontend Setup (Next.js)

**Using Kilo Code:**

Prompt:
```
Set up the Next.js frontend for RoofManager.

Tasks:
1. Install dependencies: 
   - @tanstack/react-query
   - zustand
   - react-hook-form
   - zod
   - recharts
   - shadcn/ui components

2. Create folder structure from frontend_architecture.md (attached):
   - app/(auth), app/(dashboard), app/(mobile)
   - components/ui, components/dashboard, components/leads, etc.
   - lib/api.ts, lib/hooks, lib/stores

3. Set up Tailwind config with custom colors from frontend_architecture.md

4. Create globals.css with base styles
```

Attach: `frontend_architecture.md`

**Manual shadcn/ui setup:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog table
```

---

### STEP 9: Build Frontend Pages

**For each page, use this pattern:**

**Login Page:**
```
Create the login page for RoofManager.

File: app/(auth)/login/page.tsx

Requirements:
- Premium glassmorphism design with gradient background
- Email/password form using react-hook-form
- Use the EXACT design from frontend_architecture.md (attached) under "Authentication Pages"
- Connect to API using lib/api.ts
- Store token in Zustand authStore

Make it look stunning and modern!
```

**Dashboard:**
```
Create the main dashboard page.

File: app/(dashboard)/dashboard/page.tsx

Components needed:
- StatsCard component (4 metrics: revenue, active jobs, pending quotes, conversion rate)
- Pipeline overview (Kanban-style)
- Revenue chart (using Recharts)

Follow the exact specification from frontend_architecture.md (attached) under "Dashboard Homepage".
```

**Repeat for all pages:** leads, jobs, estimates, quotes, mobile, etc.

---

### STEP 10: Build Reusable Components

**Example prompts:**

**Lead Table:**
```
Create the LeadTable component.

File: components/leads/LeadTable.tsx

Requirements:
- Data table with columns: Name, Email, Phone, Source, Status, Actions
- Sortable, filterable
- Use shadcn/ui table component
- Based on frontend_architecture.md (attached)
```

**Job Photo Gallery:**
```
Create JobPhotoGallery component.

File: components/jobs/JobPhotoGallery.tsx

Requirements:
- Grid layout of photos
- Lightbox on click
- Show caption and GPS location
- Upload new photos button
```

---

### STEP 11: State Management (Zustand)

**Using Kilo Code:**

Prompt:
```
Create Zustand stores for RoofManager.

Files:
1. lib/stores/authStore.ts - User authentication state
2. lib/stores/offlineStore.ts - Offline queue for PWA

Use specifications from frontend_architecture.md (attached) under "State Management".

Include:
- Login/logout actions
- Persistent storage
- Token management
```

---

### STEP 12: API Client & Hooks

**Using Kilo Code:**

Prompt:
```
Create the API client and custom React hooks.

Files:
1. lib/api.ts - Axios-based API client with auth headers
2. lib/hooks/useJobs.ts - React Query hooks for jobs
3. lib/hooks/useLeads.ts - React Query hooks for leads
4. lib/hooks/useAuth.ts - Auth hook

Based on frontend_architecture.md (attached).

Configure React Query with proper defaults.
```

---

### STEP 13: Mobile PWA Setup

**Using Kilo Code:**

Prompt:
```
Configure Progressive Web App for RoofManager.

Tasks:
1. Install next-pwa
2. Create public/manifest.json with RoofManager branding
3. Update next.config.js with PWA settings
4. Create service worker for offline support
5. Create mobile-optimized job pages in app/(mobile)/

Use the PWA configuration from frontend_architecture.md (attached).
```

---

### STEP 14: Quote PDF Generation

**Using Kilo Code:**

Prompt:
```
Create PDF generation for quotes.

File: backend/quotes/generator.js

Use Puppeteer to generate styled PDFs from quote data.
Include company branding, line items table, totals.

Based on backend_implementation.md (attached) under "PDF Generation".

Dependencies: puppeteer
```

---

### STEP 15: Testing & Integration

**Create test files:**

```
Create Jest tests for RoofManager backend.

Files:
1. backend/tests/auth.test.js - Test register, login, JWT
2. backend/tests/jobs.test.js - Test job CRUD operations
3. backend/tests/ai-estimator.test.js - Test AI estimation

Use Supertest for API testing.

Dependencies: jest, supertest, @types/jest
```

---

## Tips for Using Kilo Code Effectively

### 1. **Be Specific with Context**
Always attach the relevant specification files and reference specific sections.

**Good prompt:**
> "Create the login page using the EXACT design from frontend_architecture.md section 'Authentication Pages'. Include glassmorphism effects, gradient background, and company logo."

**Bad prompt:**
> "Make a login page"

### 2. **One Component at a Time**
Don't ask Kilo Code to build the entire app at once. Break it down:
- Single file per prompt
- Single feature per prompt
- Test after each component

### 3. **Iterate and Refine**
If the output isn't perfect:
> "The button styling looks off. Make it use the gradient from primary-500 to primary-600 with hover effects as specified in the design system."

### 4. **Reference Specifications**
Always attach relevant docs:
- `database_schema.md` for Prisma models
- `api_specification.md` for API endpoints
- `frontend_architecture.md` for React components
- `backend_implementation.md` for controllers/logic

### 5. **Use TypeScript Definitions**
Ask Kilo Code to generate types from your API spec:
> "Generate TypeScript interfaces for all API responses from api_specification.md"

---

## Testing Checklist

After building each module, test:

**Backend:**
- [ ] Can register new company
- [ ] Can login and get JWT
- [ ] Can create lead
- [ ] Can convert lead to job
- [ ] AI estimation works (or fallback)
- [ ] Can generate quote
- [ ] Can create invoice
- [ ] Stripe test payment works

**Frontend:**
- [ ] Login page works
- [ ] Dashboard loads with stats
- [ ] Can create and view leads
- [ ] Can create and view jobs
- [ ] Can upload photos
- [ ] Mobile view is responsive
- [ ] Offline indicator shows when offline
- [ ] PWA installs on mobile

**Integration:**
- [ ] Frontend connects to backend API
- [ ] Multi-tenant isolation (create 2 companies, verify data separation)
- [ ] File uploads work
- [ ] PDFs generate correctly
- [ ] Emails send (to test inbox)

---

## Common Issues & Solutions

### Issue: Prisma client not found
```bash
npx prisma generate
```

### Issue: CORS errors
Check `backend/server.js` CORS config matches frontend URL.

### Issue: JWT expired
Check `.env` JWT_EXPIRES_IN setting.

### Issue: AI estimation fails
Verify Ollama is running:
```bash
curl http://localhost:11434/api/generate -d '{"model": "qwen3-coder:30b", "prompt": "test"}'
```

### Issue: Stripe webhook not working
Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3001/api/payments/webhook
```

---

## Next Steps After Building

1. **Deploy backend** to Railway/Render
2. **Deploy frontend** to Vercel
3. **Set up production database** on Supabase
4. **Configure custom domain**
5. **Add monitoring** (Sentry)
6. **Create user documentation**

---

## Summary

By following this guide with Kilo Code:

✅ **Day 1-3**: Backend API ready  
✅ **Day 4-6**: Web dashboard functional  
✅ **Day 7-9**: Mobile PWA, AI, payments integrated  
✅ **Day 10-12**: Polished, tested, deployed  

**You now have everything Kilo Code needs to build RoofManager!** 🚀

Use the specifications as blueprints and iterate with Kilo Code until each component works perfectly.
