# RoofManager MVP Implementation Plan

Complete SaaS platform for roofing companies covering lead management, AI-assisted estimation, job execution, field tracking, and payments—all built with free/open-source technologies.

## User Review Required

> [!IMPORTANT]
> **Realistic Timeline Expectations**
> While you mentioned building this in a single day, a complete SaaS platform with the scope you've outlined realistically requires **2-4 weeks** for a functional MVP, even with aggressive development. I recommend we focus on **Phase 1-4** (Core Backend + Web Dashboard + Basic AI + Quoting) as the initial deliverable, which is achievable in **3-5 days** of focused work.

> [!WARNING]
> **Mobile App Development**
> Building a native mobile app (React Native) alongside the web platform will significantly extend the timeline. I recommend starting with a **Progressive Web App (PWA)** that works on mobile browsers first, then converting to native apps in Phase 2.

> [!IMPORTANT]
> **Feature Prioritization Needed**
> Please confirm which features are **absolutely critical** for the first release:
> 1. Lead management + Job pipeline tracking?
> 2. AI-assisted estimation?
> 3. Quote generation + E-signatures?
> 4. Field crew mobile access?
> 5. Payment processing?
> 6. All of the above?

---

## Proposed Technology Stack

### Backend
- **Runtime**: Node.js 20+ with Express.js
- **Database**: PostgreSQL 15+ (free tier on Supabase or Render)
- **ORM**: Prisma (type-safe, multi-tenant support)
- **Authentication**: JWT + bcrypt, with optional OAuth (Google)
- **File Storage**: Supabase Storage or Cloudinary (free tier)
- **API Architecture**: RESTful + GraphQL (Apollo Server) for complex queries

### Frontend (Web Dashboard)
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand or React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts or Chart.js
- **PDF Generation**: react-pdf or Puppeteer

### Mobile (Field Crew)
- **Phase 1**: Progressive Web App (PWA) using Next.js
- **Phase 2**: React Native (if native features needed)
- **Offline Support**: Service Workers + IndexedDB
- **Maps**: Leaflet.js (free, open-source)

### AI Integration
- **Local AI**: Ollama (running qwen3-coder:30b or llama3)
- **API Wrapper**: LangChain.js for structured outputs
- **Embeddings**: sentence-transformers for semantic search
- **Image Analysis**: Llama Vision or Qwen-VL for photo-based estimates

### Payments
- **Provider**: Stripe (test mode for development)
- **Ghana Integration**: Paystack or Flutterwave (sandbox mode)

### Communication
- **Email**: Nodemailer + free SMTP (SendGrid/Mailgun free tier)
- **SMS**: Twilio (free trial credits)
- **Chat**: Matrix/Element SDK for messaging
- **Chatbot**: Ollama-powered FAQ bot

### DevOps & Hosting
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Hosting**: Railway.app or Render.com (free tier)
- **Monitoring**: Sentry (free tier) for error tracking
- **Analytics**: Plausible (self-hosted) or PostHog (free tier)

---

## Phase 1: Core Backend & Database (Days 1-2)

### Database Schema

#### [NEW] [schema.prisma](file:///C:/Users/USER/roofing/prisma/schema.prisma)

Multi-tenant database schema with the following core entities:

**Tenant Management**
- `Company` - Multi-tenant root entity (stores company info, theme, logo, enabled modules)
- `User` - Users belonging to companies (roles: admin, estimator, field_crew, client)
- `Subscription` - Company subscription tiers and billing

**Lead & Job Pipeline**
- `Lead` - Prospect information (name, contact, source, status)
- `Job` - Jobs tracked from prospect → scouted → estimate → quote → in-progress → completed
- `JobAssignment` - Crew assignments to jobs
- `JobPhoto` - Photos uploaded by field crew with GPS metadata

**Estimation & Quoting**
- `Estimate` - AI-assisted estimates (labor, materials, timeline)
- `Quote` - Customer-facing proposals with PDF + e-signature
- `QuoteApproval` - Approval workflow and signature tracking

**Inventory & Materials**
- `Material` - Material catalog with pricing
- `JobMaterial` - Materials assigned to specific jobs
- `PurchaseOrder` - Material ordering system

**Financials**
- `Invoice` - Generated from approved quotes
- `Payment` - Payment tracking (Stripe/Paystack integration)

**Communication**
- `Notification` - Email/SMS notification queue
- `ChatMessage` - Customer communication history

**Analytics**
- `TimeLog` - Field crew work hours
- `IncidentReport` - Safety incidents
- `CompanyMetrics` - Cached analytics data

#### [NEW] [server.js](file:///C:/Users/USER/roofing/backend/server.js)

Express.js server with:
- JWT authentication middleware
- Multi-tenant request context (extract company from token/subdomain)
- RESTful API routes for all entities
- Error handling and logging
- CORS configuration for web/mobile clients

#### [NEW] [auth.controller.js](file:///C:/Users/USER/roofing/backend/controllers/auth.controller.js)

Authentication endpoints:
- `POST /auth/register` - Company registration
- `POST /auth/login` - JWT token issuance
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Current user info

---

## Phase 2: Web Dashboard (Days 3-4)

### Lead & Job Management Interface

#### [NEW] [app/dashboard/page.tsx](file:///C:/Users/USER/roofing/frontend/app/dashboard/page.tsx)

Main dashboard showing:
- Pipeline overview (cards: leads → prospects → quotes → active jobs → completed)
- Quick stats (revenue, conversion rate, active crews)
- Recent activity feed

#### [NEW] [app/leads/page.tsx](file:///C:/Users/USER/roofing/frontend/app/leads/page.tsx)

Lead management:
- Data table with filtering/sorting
- Add/edit lead forms
- Drag-and-drop pipeline (Kanban board style)
- Conversion to job button

#### [NEW] [app/jobs/[id]/page.tsx](file:///C:/Users/USER/roofing/frontend/app/jobs/[id]/page.tsx)

Job detail view:
- Job timeline and status
- Assigned crew members
- Photos uploaded from field
- Material list
- Cost breakdown (estimated vs actual)
- Progress notes

#### [NEW] [components/JobAssignment.tsx](file:///C:/Users/USER/roofing/frontend/components/JobAssignment.tsx)

Assign crews to jobs:
- Available crew list
- Crew availability calendar
- GPS location tracking when on job

---

## Phase 3: AI Integration (Day 5)

### AI-Assisted Estimation

#### [NEW] [ai/estimator.js](file:///C:/Users/USER/roofing/backend/ai/estimator.js)

Ollama integration for cost estimation:
- Analyze job description + photos (if available)
- Generate structured output: labor hours, material list, costs
- Compare with historical jobs for accuracy
- Return AI suggestions + confidence scores

**Prompt Template**:
```
You are an expert roofing estimator. Given the following job details:
- Property type: {propertyType}
- Roof size: {roofSize} sq ft
- Pitch: {pitch}
- Materials requested: {materials}
- Photos: [analyzed via Llama Vision]

Provide a JSON estimate:
{
  "laborHours": number,
  "materials": [{ "name": string, "quantity": number, "unit": string, "estimatedCost": number }],
  "totalCost": number,
  "timeline": string,
  "confidenceScore": 0-100,
  "notes": string
}
```

#### [NEW] [app/estimates/create/page.tsx](file:///C:/Users/USER/roofing/frontend/app/estimates/create/page.tsx)

Estimation workflow:
1. Enter job details (address, roof size, pitch, material preferences)
2. Upload photos (optional)
3. Click "Generate AI Estimate"
4. Review AI suggestions in editable form
5. Adjust labor/materials/costs as needed
6. Save estimate and convert to quote

---

## Phase 4: Quoting & Proposals (Day 6)

### Quote Generation

#### [NEW] [quotes/generator.js](file:///C:/Users/USER/roofing/backend/quotes/generator.js)

PDF proposal generation:
- Company branding (logo, colors from theme)
- Job details and scope
- Itemized cost breakdown
- Terms and conditions
- E-signature section

Uses `puppeteer` to render HTML template as PDF.

#### [NEW] [app/quotes/[id]/page.tsx](file:///C:/Users/USER/roofing/frontend/app/quotes/[id]/page.tsx)

Quote approval interface:
- Customer-facing view (public link)
- E-signature integration (DocuSign API or signature canvas)
- Approve/Reject buttons
- Payment terms selection

#### [NEW] [integrations/docusign.js](file:///C:/Users/USER/roofing/backend/integrations/docusign.js)

E-signature integration:
- Create envelope with quote PDF
- Send to customer email
- Webhook for signature completion

**Free Alternative**: Use HTML5 Canvas for signature capture and store as image.

---

## Phase 5: Mobile PWA (Days 7-8)

### Field Crew Interface

#### [NEW] [app/mobile/jobs/page.tsx](file:///C:/Users/USER/roofing/frontend/app/mobile/jobs/page.tsx)

Mobile-optimized job list:
- Large touch targets
- Simplified UI (no clutter)
- Offline-first (Service Worker caching)
- Pull to refresh

#### [NEW] [app/mobile/jobs/[id]/page.tsx](file:///C:/Users/USER/roofing/frontend/app/mobile/jobs/[id]/page.tsx)

Job detail for field crew:
- Check-in button with GPS capture
- Upload photos (camera access)
- Log work hours (start/stop timer)
- Material usage tracking
- Notes section

#### [NEW] [public/sw.js](file:///C:/Users/USER/roofing/frontend/public/sw.js)

Service Worker for offline support:
- Cache API responses
- Queue photo uploads when offline
- Sync when connection restored

---

## Phase 6: Payments & Invoicing (Day 9)

### Invoice Generation

#### [NEW] [invoices/generator.js](file:///C:/Users/USER/roofing/backend/invoices/generator.js)

Convert approved quotes to invoices:
- Copy quote line items
- Add payment terms
- Generate invoice PDF
- Send to customer via email

#### [NEW] [integrations/stripe.js](file:///C:/Users/USER/roofing/backend/integrations/stripe.js)

Stripe integration:
- Create payment intent
- Generate checkout session
- Webhook for payment confirmation
- Update invoice status

#### [NEW] [app/invoices/[id]/pay/page.tsx](file:///C:/Users/USER/roofing/frontend/app/invoices/[id]/pay/page.tsx)

Customer payment page:
- Invoice summary
- Stripe checkout embed
- Payment confirmation

---

## Phase 7: Communication (Day 10)

### Notification System

#### [NEW] [notifications/email.js](file:///C:/Users/USER/roofing/backend/notifications/email.js)

Email notifications via Nodemailer:
- Quote sent to customer
- Payment received
- Job status updates
- Crew assignments

#### [NEW] [notifications/sms.js](file:///C:/Users/USER/roofing/backend/notifications/sms.js)

SMS notifications via Twilio:
- Job starting soon reminders
- Payment reminders
- Emergency alerts

#### [NEW] [chatbot/faq.js](file:///C:/Users/USER/roofing/backend/chatbot/faq.js)

AI-powered FAQ chatbot:
- Ollama-based responses
- Knowledge base from company docs
- Escalate to human if confidence < 70%

---

## Phase 8: Analytics (Day 11)

### Dashboard Metrics

#### [NEW] [app/analytics/page.tsx](file:///C:/Users/USER/roofing/frontend/app/analytics/page.tsx)

Analytics dashboard with charts:
- Revenue over time (line chart)
- Lead conversion funnel
- Crew efficiency (jobs completed per week)
- Average job profitability
- Material cost trends

Uses Recharts for visualizations.

---

## Phase 9: Customization (Day 12)

### Multi-Tenant Theming

#### [NEW] [app/settings/branding/page.tsx](file:///C:/Users/USER/roofing/frontend/app/settings/branding/page.tsx)

Company customization:
- Logo upload
- Primary/secondary color picker
- Font selection
- Module enable/disable toggles

#### [NEW] [middleware/theme.js](file:///C:/Users/USER/roofing/backend/middleware/theme.js)

Inject company theme into frontend:
- Load theme from database
- Apply CSS variables dynamically

---

## Phase 10: Deployment (Day 13)

### Hosting Setup

#### [NEW] [.github/workflows/deploy.yml](file:///C:/Users/USER/roofing/.github/workflows/deploy.yml)

CI/CD pipeline:
- Run tests on push
- Deploy backend to Railway
- Deploy frontend to Vercel
- Run database migrations

#### [NEW] [docker-compose.yml](file:///C:/Users/USER/roofing/docker-compose.yml)

Local development environment:
- PostgreSQL container
- Backend container
- Frontend container
- Ollama container

---

## Verification Plan

### Automated Tests
- `npm run test` - Backend unit tests (Jest)
- `npm run test:e2e` - Frontend E2E tests (Playwright)
- `npm run test:api` - API integration tests (Supertest)

### Manual Verification
1. **Lead to Job Flow**: Create lead → Convert to job → Assign crew
2. **AI Estimation**: Create estimate → Verify AI suggestions → Edit and save
3. **Quoting**: Generate quote PDF → Send to test email → Sign and approve
4. **Mobile/Field**: Access on mobile → Upload photo → Log work hours
5. **Payment**: Create invoice → Make test payment (Stripe test mode)
6. **Multi-Tenancy**: Create 2 companies → Verify data isolation

### User Acceptance Testing
- Deploy to staging environment
- Provide access to test roofing company
- Collect feedback on usability
