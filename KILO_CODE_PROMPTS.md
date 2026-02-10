# Kilo Code Build Prompts for RoofManager

Copy and paste these prompts into Kilo Code, one at a time, in order.

---

## STEP 1: Install Backend Dependencies

```
Install all dependencies for the RoofManager backend.

In the backend/ directory, install:

Core:
- express
- @prisma/client
- prisma (dev)
- dotenv
- cors
- helmet

Authentication:
- bcrypt
- jsonwebtoken

Utilities:
- axios
- multer
- sharp
- winston
- express-validator
- express-rate-limit

Integrations:
- nodemailer
- twilio
- stripe
- puppeteer

Dev:
- nodemon (dev)
- typescript (dev)
- @types/node (dev)
- @types/express (dev)

Run: npm install [all packages above]
```

---

## STEP 2: Create Prisma Schema

```
Create the complete Prisma database schema for RoofManager.

File: backend/prisma/schema.prisma

Use the EXACT schema from the database_schema.md file I'll attach.

The schema includes:
- Multi-tenant Company and User models
- Lead and Job pipeline models
- Estimation and Quoting models
- Material and Inventory models
- Financial models (Invoice, Payment)
- Communication models (Notification, ChatMessage)
- Analytics models

After creating the schema file, also create a .env file copying from .env.example and set DATABASE_URL to: postgresql://postgres:password@localhost:5432/roofmanager

Then run:
npx prisma generate
```

**ATTACH:** `docs/specifications/database_schema.md`

---

## STEP 3: Create Authentication Middleware

```
Create JWT authentication middleware for RoofManager.

File: backend/middleware/auth.middleware.js

Requirements:
- authenticate() function: Extract JWT from Bearer token, verify, attach user and companyId to req
- authorize(...roles) function: Check if user has required role
- Use environment variable JWT_SECRET
- Return 401 for invalid/missing tokens
- Return 403 for insufficient permissions

Use the exact implementation from backend_implementation.md section "Authentication".
```

**ATTACH:** `docs/specifications/backend_implementation.md`

---

## STEP 4: Create Authentication Controllers

```
Create authentication controllers for register and login.

File: backend/controllers/auth.controller.js

Functions needed:
1. register(req, res) - Create company + admin user in transaction, return JWT
2. login(req, res) - Verify credentials, return JWT

Requirements:
- Hash passwords with bcrypt (10 rounds)
- Create free subscription on company registration
- JWT payload: userId, companyId, role
- Multi-tenant support

Use the implementation from backend_implementation.md section "Authentication".
```

**ATTACH:** `docs/specifications/backend_implementation.md`

---

## STEP 5: Create Authentication Routes

```
Create Express routes for authentication.

File: backend/routes/auth.routes.js

Routes:
- POST /register - Call auth.controller.register
- POST /login - Call auth.controller.login
- GET /me - Call auth.controller.getMe (requires authentication middleware)

Export router.
```

---

## STEP 6: Create Express Server

```
Create the main Express.js server for RoofManager.

File: backend/server.js

Requirements:
- Use Express with CORS (allow FRONTEND_URL from env)
- Use Helmet for security headers
- Rate limiting: 100 requests per 15 minutes
- Body parsing with 10mb limit
- Routes: /api/auth, /api/leads, /api/jobs, /api/estimates, /api/quotes, /api/invoices, /api/payments, /api/materials, /api/analytics, /api/company
- Error handling middleware
- Listen on PORT from env (default 3001)

Use the exact implementation from backend_implementation.md section "Server Setup".
```

**ATTACH:** `docs/specifications/backend_implementation.md`

---

## STEP 7: Create Lead Management

```
Create the lead management system.

Files:
1. backend/controllers/lead.controller.js
2. backend/routes/lead.routes.js

Implement these endpoints from api_specification.md:
- POST /leads - Create lead
- GET /leads - List leads with pagination, filters (status, source)
- GET /leads/:id - Get single lead
- PATCH /leads/:id - Update lead
- DELETE /leads/:id - Delete lead
- POST /leads/:id/convert - Convert lead to job

Ensure:
- All queries scoped to req.companyId
- Pagination with default limit=20
- Input validation
```

**ATTACH:** `docs/specifications/api_specification.md`

---

## STEP 8: Create Job Management

```
Create the job management system.

Files:
1. backend/controllers/job.controller.js
2. backend/routes/job.routes.js

Implement all job endpoints from api_specification.md:
- POST /jobs - Create job
- GET /jobs - List jobs with filters
- GET /jobs/:id - Get job with full details (assignments, photos, materials, estimates)
- PATCH /jobs/:id - Update job
- POST /jobs/:id/assign - Assign crew to job
- POST /jobs/:id/photos - Upload photo (multipart/form-data)

Include file upload handling with multer for photos.
```

**ATTACH:** `docs/specifications/api_specification.md`

---

## STEP 9: Create AI Estimator

```
Create AI-powered cost estimation using Ollama.

File: backend/ai/estimator.js

Function: generateEstimate(jobData)

Requirements:
- Connect to Ollama API at OLLAMA_URL
- Send structured prompt with job details (propertyType, roofSize, roofPitch, description)
- Parse JSON response with: laborHours, materials[], totalCost, timeline, confidenceScore, notes
- Fallback to rule-based estimation if AI fails
- Rule-based: $5.50/sq ft base rate, 60% labor, 40% materials

Use exact implementation from backend_implementation.md section "AI Integration".
```

**ATTACH:** `docs/specifications/backend_implementation.md`

---

## STEP 10: Create Estimate Controllers

```
Create estimation endpoints with AI integration.

Files:
1. backend/controllers/estimate.controller.js
2. backend/routes/estimate.routes.js

Endpoints:
- POST /estimates - Create estimate (with optional AI generation)
- GET /estimates/:id - Get estimate
- PATCH /estimates/:id - Update estimate

If useAI=true in request, call AI estimator, otherwise use manual data.
Save estimate with materials as nested create.
```

**ATTACH:** `C:\Users\USER\.gemini\antigravity\brain\c32086a5-8818-4b7a-8080-b0a0e4d7ef7a\backend_implementation.md`

---

## NEXT STEPS

After completing these 10 steps with Kilo Code, you'll have:
✅ Backend server running
✅ Authentication working
✅ Lead and Job management
✅ AI-powered estimation

Then continue with:
- Quote generation (Step 11-12 in kilo_code_build_guide.md)
- Frontend setup (Step 13-15)
- Payments integration (Step 16)
- Mobile PWA (Step 17)

**Test the backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma migrate dev --name init
npm run dev
```

Then test with Postman or curl:
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"company":{"name":"Test Roofing","subdomain":"test"},"user":{"email":"admin@test.com","password":"password123","firstName":"John","lastName":"Doe"}}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```
