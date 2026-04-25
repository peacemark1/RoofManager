# RoofManager

A multi-tenant SaaS platform for roofing companies to manage leads, jobs, estimates, invoices, and payments — built for the African market with Paystack & Hubtel integrations.

## Features

- **Lead Management** — Track and convert leads with table/kanban views
- **Job Scheduling** — Assign crews, schedule work, track job progress
- **AI Estimation** — Generate material and labor estimates with AI assistance
- **Quoting & Proposals** — Create professional PDF quotes with public customer links
- **Invoicing & Payments** — Paystack (Africa) and Stripe (international) integration
- **Customer Portal** — Token-based portal for customers to view quotes, pay invoices, and track jobs
- **Mobile PWA** — Field crew app with GPS check-in, photo upload, and offline support
- **SMS Notifications** — Hubtel SMS integration for Ghana-based notifications
- **Email Notifications** — Automated emails for quotes, payments, and job updates
- **Analytics Dashboard** — Revenue, pipeline, and performance metrics
- **Team Management** — Invite and manage users with role-based access
- **Multi-Tenant** — Each roofing company gets isolated data with subscription tiers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Express.js, Node.js |
| Database | PostgreSQL with Prisma ORM |
| Auth | JWT with bcrypt password hashing |
| Payments | Paystack (Africa), Stripe (international) |
| SMS | Hubtel (Ghana) |
| Email | Nodemailer (SMTP) |
| Charts | Recharts |
| State | Zustand, React Query |
| PWA | next-pwa |

## Project Structure

```
├── backend/           # Express.js API server
│   ├── controllers/   # Route handlers
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic (email, SMS, payments)
│   ├── middleware/     # Auth middleware
│   ├── prisma/        # Database schema & migrations
│   └── server.js      # Entry point
├── frontend/          # Next.js application
│   ├── app/           # App router pages
│   │   ├── (auth)/    # Login & register
│   │   ├── (dashboard)/ # Main dashboard pages
│   │   ├── (mobile)/  # Field crew PWA
│   │   └── customer/  # Customer portal (public)
│   ├── components/    # Reusable UI components
│   └── lib/           # Utilities, API client, stores
└── docs/              # Specifications & implementation guides
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or a Supabase account)

### 1. Clone the repository

```bash
git clone https://github.com/peacemark1/RoofManager.git
cd RoofManager
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/roofmanager"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Paystack (test keys)
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx

# Hubtel SMS (optional)
HUBTEL_CLIENT_ID=your-client-id
HUBTEL_CLIENT_SECRET=your-client-secret
HUBTEL_SENDER_ID=RoofManager

# Email SMTP (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="RoofManager <noreply@roofmanager.com>"
```

Run database migrations:

```bash
npx prisma generate
npx prisma db push
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the app

Visit [http://localhost:3000](http://localhost:3000) and register a new company account.

## Deployment

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Railway** | Backend API |
| **Supabase** | PostgreSQL database |
| **Paystack** | Payment processing |
| **Hubtel** | SMS notifications |

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions.

## License

ISC
