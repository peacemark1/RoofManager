# RoofManager

A multi-tenant SaaS platform for roofing companies to manage leads, jobs, estimates, quotes, invoices, payments, and crew operations.

## Features

- **Multi-Tenant Architecture** — Each company gets isolated data with subdomain support
- **Lead Management** — Track leads with kanban board and table views
- **Job Pipeline** — Full job lifecycle from scheduling through completion
- **AI Estimation** — Generate roof estimates with AI assistance
- **Quotes & Invoices** — Professional PDF quotes with customer portal access
- **Payments** — Integrated Paystack (Ghana) and Stripe payment processing
- **Customer Portal** — Public token-based portal for customers to view quotes, invoices, and pay online
- **SMS & Email Notifications** — Hubtel SMS (Ghana) and email alerts
- **Analytics Dashboard** — Revenue, pipeline, and performance metrics
- **Mobile Crew App** — GPS check-in, photo upload, time tracking
- **PWA Support** — Installable progressive web app for field use

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Frontend   | Next.js 14, React 18, TypeScript, Tailwind CSS    |
| Backend    | Express.js, Prisma ORM                            |
| Database   | PostgreSQL                                        |
| Auth       | JWT with role-based access control                |
| Payments   | Paystack, Stripe                                  |
| SMS        | Hubtel (Ghana)                                    |
| State      | Zustand, React Query                              |
| UI         | Radix UI, Lucide Icons, Recharts                  |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or use Docker)

### Option A: Docker Compose (Recommended)

```bash
# Clone and start everything
git clone https://github.com/peacemark1/RoofManager.git
cd RoofManager
docker compose up -d

# App is running at:
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
# Database: postgresql://postgres:postgres@localhost:5432/roofmanager
```

### Option B: Manual Setup

**1. Database**

```bash
# Start PostgreSQL and create database
createdb roofmanager
```

**2. Backend**

```bash
cd backend
cp .env.example .env    # Edit with your database URL and secrets
npm install
npx prisma db push      # Create tables
npm run dev              # http://localhost:3001
```

**3. Frontend**

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev              # http://localhost:3000
```

## Project Structure

```
RoofManager/
├── frontend/               # Next.js 14 app
│   ├── app/                # App router pages
│   │   ├── (auth)/         # Login & register
│   │   ├── (dashboard)/    # Main dashboard pages
│   │   ├── (mobile)/       # Mobile crew views
│   │   ├── customer/       # Customer portal (public)
│   │   └── quote/          # Public quote viewer
│   ├── components/         # React components
│   ├── lib/                # API client, stores, utilities
│   └── store/              # Zustand state management
├── backend/                # Express.js API
│   ├── controllers/        # Route handlers
│   ├── routes/             # API route definitions
│   ├── middleware/          # Auth, validation
│   ├── services/           # Email, SMS, payment services
│   ├── prisma/             # Database schema & migrations
│   └── Dockerfile          # Production container
├── docker-compose.yml      # Local development stack
└── docs/                   # Specifications & guides
```

## API Endpoints

| Endpoint           | Description             |
| ------------------ | ----------------------- |
| `POST /api/auth/*` | Register, login, profile|
| `GET /api/health`  | Health check            |
| `CRUD /api/leads`  | Lead management         |
| `CRUD /api/jobs`   | Job management          |
| `CRUD /api/estimates` | AI-powered estimates |
| `CRUD /api/quotes` | Quote generation        |
| `CRUD /api/invoices`| Invoice management     |
| `POST /api/payments`| Payment processing     |
| `GET /api/analytics`| Business analytics     |
| `GET /api/customer` | Customer portal API    |
| `CRUD /api/materials`| Inventory management  |
| `POST /api/sms`    | SMS notifications       |

## Deployment

### Backend (Railway / Fly.io)

Set these environment variables:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)

Set these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url/api
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all required variables.

## License

ISC
