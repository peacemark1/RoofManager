# RoofManager

A multi-tenant SaaS platform for roofing companies to manage leads, jobs, estimates, quotes, invoices, and payments.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Radix UI, Recharts, Zustand, React Query
- **Backend:** Express.js, Prisma ORM, JWT authentication
- **Database:** SQLite (development) / PostgreSQL (production)
- **Payments:** Paystack (Ghana) + Stripe
- **SMS:** Hubtel (Ghana)
- **Email:** Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

The backend runs on `http://localhost:3001`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies API requests to the backend.

### Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

## Features

- **Multi-tenant:** Company-scoped data isolation via subdomain
- **Lead Pipeline:** Table + Kanban views, status tracking
- **Job Management:** Scheduling, crew assignment, GPS check-in, photo uploads
- **AI Estimates:** Ollama integration with manual fallback
- **Quotes:** PDF generation, public links, e-signatures
- **Invoices:** Line items, payment tracking, PDF export
- **Payments:** Paystack + Stripe checkout
- **Materials:** Inventory tracking, purchase orders
- **Analytics:** Revenue charts, pipeline stats
- **Customer Portal:** Token-based access (no login required)
- **SMS & Email:** Hubtel + Nodemailer notifications
- **Mobile:** PWA-ready responsive views

## API Routes

| Route | Description |
|-------|-------------|
| `POST /api/auth/register` | Register company + admin user |
| `POST /api/auth/login` | Login |
| `GET /api/leads` | List leads |
| `GET /api/jobs` | List jobs |
| `GET /api/estimates` | List estimates |
| `GET /api/quotes` | List quotes |
| `GET /api/invoices` | List invoices |
| `GET /api/payments` | List payments |
| `GET /api/materials` | List materials |
| `GET /api/analytics` | Dashboard analytics |
| `GET /api/settings` | Company settings |
| `GET /api/customer/:token` | Customer portal |

## Project Structure

```
├── backend/
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, rate limiting, multi-tenant
│   ├── routes/           # Express route definitions
│   ├── services/         # Business logic (SMS, email, AI)
│   ├── prisma/           # Schema and migrations
│   └── server.js         # Entry point
├── frontend/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # API client, hooks, utilities
│   └── store/            # Zustand auth store
└── README.md
```

## License

Private
