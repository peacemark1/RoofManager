# RoofManager API Specification

Complete REST API documentation for all endpoints.

---

## Base URL
```
Development: http://localhost:3001/api
Production: https://api.roofmanager.com/api
```

## Authentication
All endpoints (except auth endpoints) require JWT token in header:
```
Authorization: Bearer <token>
```

JWT Payload:
```json
{
  "userId": "uuid",
  "companyId": "uuid",
  "role": "ADMIN|ESTIMATOR|FIELD_CREW|CLIENT",
  "email": "user@example.com"
}
```

---

## 1. Authentication Endpoints

### POST /auth/register
Register new company and admin user.

**Request:**
```json
{
  "company": {
    "name": "ABC Roofing",
    "subdomain": "abc-roofing"
  },
  "user": {
    "email": "admin@abcroofing.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "company": {
      "id": "uuid",
      "name": "ABC Roofing",
      "subdomain": "abc-roofing"
    },
    "user": {
      "id": "uuid",
      "email": "admin@abcroofing.com",
      "role": "ADMIN"
    },
    "token": "jwt-token"
  }
}
```

### POST /auth/login
Login existing user.

**Request:**
```json
{
  "email": "admin@abcroofing.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@abcroofing.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "ADMIN",
      "companyId": "uuid"
    },
    "token": "jwt-token"
  }
}
```

### GET /auth/me
Get current authenticated user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@abcroofing.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ADMIN",
    "company": {
      "id": "uuid",
      "name": "ABC Roofing",
      "logo": "https://...",
      "enabledModules": {"ai": true, "payments": true}
    }
  }
}
```

---

## 2. Lead Management

### POST /leads
Create new lead.

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "source": "WEBSITE",
  "notes": "Interested in roof replacement"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "status": "NEW",
    "createdAt": "2026-02-09T15:00:00Z"
  }
}
```

### GET /leads
Get all leads for company.

**Query Params:**
- `status` (optional): Filter by status
- `source` (optional): Filter by source
- `page` (default: 1)
- `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leads": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```

### PATCH /leads/:id
Update lead.

**Request:**
```json
{
  "status": "QUALIFIED",
  "notes": "Ready for estimate"
}
```

### POST /leads/:id/convert
Convert lead to job.

**Request:**
```json
{
  "title": "Roof Replacement - 123 Main St",
  "description": "Full roof replacement",
  "propertyType": "RESIDENTIAL",
  "roofSize": 2500
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "job": {
      "id": "uuid",
      "jobNumber": "JOB-2026-001",
      "status": "PROSPECT"
    },
    "lead": {
      "id": "uuid",
      "status": "CONVERTED"
    }
  }
}
```

---

## 3. Job Management

### POST /jobs
Create new job.

**Request:**
```json
{
  "title": "Roof Replacement - 456 Oak Ave",
  "description": "Replace shingles on residential property",
  "address": "456 Oak Ave, City, State",
  "propertyType": "RESIDENTIAL",
  "roofSize": 3000,
  "roofPitch": "6/12"
}
```

### GET /jobs
Get all jobs.

**Query Params:**
- `status` (optional)
- `page`, `limit`
- `assignedTo` (optional): Filter by user ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "jobNumber": "JOB-2026-001",
        "title": "Roof Replacement",
        "status": "IN_PROGRESS",
        "address": "123 Main St",
        "scheduledStart": "2026-02-15T08:00:00Z",
        "assignments": [
          {"userId": "uuid", "user": {"firstName": "Mike", "role": "FOREMAN"}}
        ]
      }
    ],
    "pagination": {...}
  }
}
```

### GET /jobs/:id
Get job details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "jobNumber": "JOB-2026-001",
    "title": "Roof Replacement - 123 Main St",
    "status": "IN_PROGRESS",
    "address": "123 Main St",
    "propertyType": "RESIDENTIAL",
    "roofSize": 2500,
    "scheduledStart": "2026-02-15T08:00:00Z",
    "estimatedCost": 8500,
    "actualCost": 0,
    "assignments": [...],
    "photos": [...],
    "materials": [...],
    "estimates": [...],
    "quotes": [...],
    "timeLogs": [...]
  }
}
```

### PATCH /jobs/:id
Update job.

**Request:**
```json
{
  "status": "COMPLETED",
  "actualEnd": "2026-02-17T17:00:00Z",
  "actualCost": 8200
}
```

### POST /jobs/:id/assign
Assign crew to job.

**Request:**
```json
{
  "userId": "uuid",
  "role": "foreman"
}
```

### POST /jobs/:id/photos
Upload photo to job.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `photo`: File
- `caption`: String (optional)
- `latitude`: Number (optional)
- `longitude`: Number (optional)

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://storage.../photo.jpg",
    "caption": "Progress at noon",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "takenAt": "2026-02-15T12:00:00Z"
  }
}
```

---

## 4. Estimation (AI-Assisted)

### POST /estimates
Create estimate (AI-assisted).

**Request:**
```json
{
  "jobId": "uuid",
  "useAI": true,
  "photoUrls": ["https://...photo1.jpg", "https://...photo2.jpg"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "jobId": "uuid",
    "laborHours": 40,
    "totalCost": 8500,
    "timeline": "3-4 days",
    "aiGenerated": true,
    "aiConfidence": 85,
    "notes": "AI suggests asphalt shingles based on photos",
    "materials": [
      {"name": "Asphalt Shingles", "quantity": 30, "unit": "bundle", "estimatedCost": 3000},
      {"name": "Underlayment", "quantity": 2500, "unit": "sq ft", "estimatedCost": 500},
      {"name": "Ridge Cap", "quantity": 50, "unit": "linear ft", "estimatedCost": 200}
    ]
  }
}
```

### PATCH /estimates/:id
Update estimate (human edits).

**Request:**
```json
{
  "laborHours": 45,
  "totalCost": 9000,
  "materials": [
    {"name": "Premium Shingles", "quantity": 30, "unit": "bundle", "estimatedCost": 3500}
  ]
}
```

---

## 5. Quoting

### POST /quotes
Create quote from estimate.

**Request:**
```json
{
  "jobId": "uuid",
  "estimateId": "uuid",
  "validUntil": "2026-03-01T23:59:59Z",
  "lineItems": [
    {"description": "Labor (40 hours)", "quantity": 1, "unitPrice": 5000, "total": 5000},
    {"description": "Materials", "quantity": 1, "unitPrice": 3500, "total": 3500}
  ],
  "subtotal": 8500,
  "tax": 680,
  "discount": 0,
  "total": 9180,
  "notes": "Quote valid for 30 days",
  "termsAndConditions": "Payment due upon completion"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "quoteNumber": "QT-2026-001",
    "status": "DRAFT",
    "publicLink": "https://app.roofmanager.com/quotes/abc123",
    "total": 9180
  }
}
```

### POST /quotes/:id/send
Send quote to customer.

**Request:**
```json
{
  "recipientEmail": "customer@example.com",
  "message": "Here is your quote for the roof replacement project"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "quoteId": "uuid",
    "status": "SENT",
    "pdfUrl": "https://storage.../quote.pdf",
    "sentAt": "2026-02-09T15:30:00Z"
  }
}
```

### GET /quotes/public/:publicLink
Get quote (public, no auth required).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "quoteNumber": "QT-2026-001",
    "company": {"name": "ABC Roofing", "logo": "https://..."},
    "job": {"address": "123 Main St"},
    "lineItems": [...],
    "total": 9180,
    "validUntil": "2026-03-01T23:59:59Z",
    "status": "SENT"
  }
}
```

### POST /quotes/public/:publicLink/approve
Approve quote with e-signature.

**Request:**
```json
{
  "signedBy": "Jane Smith",
  "signatureData": "data:image/png;base64,..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "quoteId": "uuid",
    "status": "APPROVED",
    "approval": {
      "signedBy": "Jane Smith",
      "signedAt": "2026-02-09T16:00:00Z",
      "signatureUrl": "https://storage.../signature.png"
    }
  }
}
```

---

## 6. Invoicing & Payments

### POST /invoices
Create invoice from quote.

**Request:**
```json
{
  "quoteId": "uuid",
  "dueDate": "2026-03-15T23:59:59Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-2026-001",
    "status": "DRAFT",
    "total": 9180,
    "amountPaid": 0,
    "dueDate": "2026-03-15T23:59:59Z"
  }
}
```

### POST /invoices/:id/send
Send invoice to customer.

### POST /payments/create-checkout
Create Stripe checkout session.

**Request:**
```json
{
  "invoiceId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/...",
    "sessionId": "cs_..."
  }
}
```

### POST /payments/webhook
Stripe webhook handler (server-to-server).

---

## 7. Field Operations

### POST /jobs/:id/checkin
GPS check-in for field crew.

**Request:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### POST /jobs/:id/timelog/start
Start work timer.

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "startTime": "2026-02-15T08:00:00Z"
  }
}
```

### PATCH /timelog/:id/stop
Stop work timer.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "endTime": "2026-02-15T17:00:00Z",
    "totalHours": 9
  }
}
```

---

## 8. Materials & Inventory

### GET /materials
Get material catalog.

### POST /materials
Add material to catalog.

### PATCH /materials/:id
Update material (price, stock level).

### POST /jobs/:id/materials
Assign material to job.

**Request:**
```json
{
  "materialId": "uuid",
  "quantityPlanned": 30
}
```

### PATCH /jobs/:jobId/materials/:materialId
Update material usage.

**Request:**
```json
{
  "quantityUsed": 28
}
```

---

## 9. Analytics

### GET /analytics/dashboard
Get dashboard metrics.

**Query Params:**
- `startDate` (YYYY-MM-DD)
- `endDate` (YYYY-MM-DD)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 125000,
      "trend": [
        {"date": "2026-02-01", "amount": 15000},
        {"date": "2026-02-08", "amount": 18000}
      ]
    },
    "leads": {
      "total": 45,
      "converted": 12,
      "conversionRate": 26.7
    },
    "jobs": {
      "active": 8,
      "completed": 24,
      "avgDuration": 3.5
    },
    "profitability": {
      "avgMargin": 32.5
    }
  }
}
```

---

## 10. Settings & Customization

### PATCH /company/branding
Update company branding.

**Request:**
```json
{
  "primaryColor": "#1e40af",
  "secondaryColor": "#3b82f6",
  "font": "Inter"
}
```

### POST /company/logo
Upload company logo.

**Content-Type:** `multipart/form-data`

### PATCH /company/modules
Enable/disable modules.

**Request:**
```json
{
  "enabledModules": {
    "ai": true,
    "payments": true,
    "chatbot": false
  }
}
```

---

## Error Response Format

All errors return:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409 - e.g., duplicate email)
- `INTERNAL_ERROR` (500)
